from datetime import datetime, timezone

from rapidfuzz import fuzz
from sqlalchemy.orm import Session

from backend.db.models import Listing, ListingHistory
from backend.scraper.normalizer import NormalizedListing


def _aware(dt: datetime | None) -> datetime:
    if not dt:
        return datetime.now(timezone.utc)
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def find_relist_candidate(db: Session, listing: NormalizedListing, threshold: int = 85) -> Listing | None:
    candidates = db.query(Listing).filter(Listing.platform == listing.platform).limit(500).all()
    best: tuple[int, Listing | None] = (0, None)
    for candidate in candidates:
        title_score = fuzz.token_set_ratio(candidate.title, listing.title)
        image_overlap = bool(set(candidate.image_hashes or []) & set(listing.raw.get("image_hashes") or []))
        score = max(title_score, 95 if image_overlap else 0)
        if score > best[0]:
            best = (score, candidate)
    return best[1] if best[0] >= threshold else None


def update_relist_metadata(db: Session, record: Listing, incoming: NormalizedListing) -> None:
    first_price = record.history[0].price if record.history else record.price
    first_seen = _aware(record.first_seen_at)
    now = datetime.now(timezone.utc)
    price_drop = max(first_price - incoming.price, 0)

    record.price_drop_amount = round(price_drop, 2)
    record.price_drop_percent = round((price_drop / first_price) * 100, 1) if first_price else 0
    record.days_sitting = max((now - first_seen).days, 0)
    record.relist_count = max(record.relist_count, len(record.history))

    record.history.append(
        ListingHistory(
            listing_id=record.id,
            observed_at=incoming.scraped_at,
            price=incoming.price,
            title=incoming.title,
            url=incoming.url,
            raw=incoming.raw,
        )
    )
