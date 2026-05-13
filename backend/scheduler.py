import asyncio
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from backend.core.deduplicator import listing_fingerprint
from backend.core.image_hashing import image_hashes
from backend.core.relist_radar import find_relist_candidate, update_relist_metadata
from backend.core.scorer import score_listing
from backend.db.models import Listing, ListingHistory, Watchlist
from backend.scraper.craigslist import scrape_craigslist
from backend.scraper.facebook import scrape_facebook


def persist_listing(db: Session, listing, keywords: list[str]) -> Listing:
    listing.deal_score = score_listing(listing, keywords)
    fingerprint = listing_fingerprint(listing)
    existing = db.query(Listing).filter(Listing.fingerprint == fingerprint).one_or_none()
    if existing:
        existing.scraped_at = listing.scraped_at
        existing.deal_score = listing.deal_score
        existing.price = listing.price
        update_relist_metadata(db, existing, listing)
        return existing

    relist = find_relist_candidate(db, listing)
    record = Listing(
        id=listing.id,
        fingerprint=fingerprint,
        title=listing.title,
        price=listing.price,
        location=listing.location,
        platform=listing.platform,
        condition=listing.condition,
        description=listing.description,
        images=listing.images,
        image_hashes=listing.raw.get("image_hashes") or [],
        url=listing.url,
        posted_at=listing.posted_at,
        scraped_at=listing.scraped_at,
        deal_score=listing.deal_score,
        seller_signal=listing.seller_signal,
        watchlist_id=listing.watchlist_id,
        relist_of_id=relist.id if relist else None,
        relist_count=(relist.relist_count + 1) if relist else 0,
    )
    record.history.append(ListingHistory(price=listing.price, title=listing.title, url=listing.url, raw=listing.raw))
    db.add(record)
    return record


async def scrape_watchlist(db: Session, watchlist: Watchlist, dry_run: bool = False) -> list:
    config = {
        "id": watchlist.id,
        "keywords": watchlist.keywords,
        "location": watchlist.location,
        "price_min": watchlist.price_min,
        "price_max": watchlist.price_max,
    }
    scraped = []
    if "craigslist" in watchlist.platforms:
        try:
            scraped.extend(scrape_craigslist(config))
        except Exception as exc:
            print(f"Craigslist scrape failed for {watchlist.id}: {exc}")
    if "facebook" in watchlist.platforms:
        try:
            scraped.extend(await scrape_facebook(config))
        except Exception as exc:
            print(f"Facebook scrape failed for {watchlist.id}: {exc}")

    if dry_run:
        return scraped

    for listing in scraped:
        if listing.images and not listing.raw.get("image_hashes"):
            listing.raw["image_hashes"] = image_hashes(listing.images)
        persist_listing(db, listing, watchlist.keywords)
    watchlist.last_scraped_at = datetime.now(timezone.utc)
    watchlist.result_count = len(scraped)
    db.commit()
    return scraped


def run_poll(db_factory) -> None:
    with db_factory() as db:
        for watchlist in db.query(Watchlist).filter(Watchlist.enabled.is_(True)).all():
            try:
                asyncio.run(scrape_watchlist(db, watchlist))
            except Exception as exc:
                print(f"Watchlist {watchlist.id} scrape failed: {exc}")


def start_scheduler(db_factory, interval_seconds: int) -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone="UTC")
    scheduler.add_job(lambda: run_poll(db_factory), "interval", seconds=interval_seconds, id="poll-watchlists")
    scheduler.start()
    return scheduler
