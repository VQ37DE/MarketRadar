import argparse
import asyncio
import json
import os
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db.database import SessionLocal, get_db, init_db, session_scope
from backend.db.models import Listing, Watchlist
from backend.scheduler import scrape_watchlist, start_scheduler

load_dotenv()

API_PREFIX = "/api/v1"
CONFIG_PATH = Path(os.getenv("CONFIG_PATH", "config.yaml"))

app = FastAPI(title="MarketRadar API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WatchlistPayload(BaseModel):
    name: str
    enabled: bool = True
    keywords: list[str] = []
    platforms: list[str] = ["craigslist"]
    location: str | None = None
    radius_miles: int | None = None
    price_min: float | None = None
    price_max: float | None = None
    category_id: str | None = None
    category_name: str | None = None
    craigslist_category: str | None = None
    facebook_category: str | None = None
    condition: list[str] = []
    alert_type: str | None = None


class SettingsPayload(BaseModel):
    poll_interval_seconds: int | None = None
    min_deal_score: int | None = None
    theme: str | None = None
    email_to: str | None = None
    webhook_url: str | None = None


def read_config() -> dict[str, Any]:
    if not CONFIG_PATH.exists():
        return {}
    with CONFIG_PATH.open("r", encoding="utf-8") as config_file:
        return yaml.safe_load(config_file) or {}


def write_config(config: dict[str, Any]) -> None:
    with CONFIG_PATH.open("w", encoding="utf-8") as config_file:
        yaml.safe_dump(config, config_file, sort_keys=False)


def sync_watchlists_from_config() -> None:
    config = read_config()
    with session_scope() as db:
        for item in config.get("watchlists", []):
            existing = db.get(Watchlist, item["id"])
            data = {
                "name": item["name"],
                "enabled": item.get("enabled", True),
                "keywords": item.get("keywords", []),
                "platforms": item.get("platforms", []),
                "location": item.get("location"),
                "radius_miles": item.get("radius_miles"),
                "price_min": item.get("price_min"),
                "price_max": item.get("price_max"),
                "category_id": item.get("category_id"),
                "category_name": item.get("category_name"),
                "craigslist_category": item.get("craigslist_category"),
                "facebook_category": item.get("facebook_category"),
                "condition": item.get("condition", []),
                "alert_type": item.get("alert_type"),
            }
            if existing:
                for key, value in data.items():
                    setattr(existing, key, value)
            else:
                db.add(Watchlist(id=item["id"], **data))


def listing_to_dict(listing: Listing) -> dict[str, Any]:
    return {
        "id": listing.id,
        "title": listing.title,
        "price": listing.price,
        "location": listing.location,
        "platform": listing.platform,
        "category_id": listing.category_id,
        "category_name": listing.category_name,
        "condition": listing.condition,
        "description": listing.description,
        "images": listing.images,
        "url": listing.url,
        "posted_at": listing.posted_at.isoformat() if listing.posted_at else None,
        "scraped_at": listing.scraped_at.isoformat() if listing.scraped_at else None,
        "deal_score": listing.deal_score,
        "watchlist_id": listing.watchlist_id,
        "relist_count": listing.relist_count,
        "price_drop_amount": listing.price_drop_amount,
        "price_drop_percent": listing.price_drop_percent,
        "days_sitting": listing.days_sitting,
        "history": [
            {"observed_at": h.observed_at.isoformat(), "price": h.price, "title": h.title, "url": h.url}
            for h in listing.history
        ],
    }


@app.on_event("startup")
def startup() -> None:
    init_db()
    sync_watchlists_from_config()
    config = read_config()
    interval = int(config.get("scraper", {}).get("poll_interval_seconds", 300))
    app.state.scheduler = start_scheduler(SessionLocal, interval)


@app.on_event("shutdown")
def shutdown() -> None:
    scheduler = getattr(app.state, "scheduler", None)
    if scheduler:
        scheduler.shutdown(wait=False)


@app.get(f"{API_PREFIX}/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get(f"{API_PREFIX}/listings")
def get_listings(
    platform: str | None = None,
    category: str | None = None,
    min_score: int = 0,
    search: str | None = None,
    db: Session = Depends(get_db),
) -> list[dict[str, Any]]:
    query = db.query(Listing).filter(Listing.deal_score >= min_score)
    if platform and platform != "both":
        query = query.filter(Listing.platform == platform)
    if category:
        query = query.filter(Listing.category_id == category)
    if search:
        query = query.filter(Listing.title.ilike(f"%{search}%"))
    return [listing_to_dict(item) for item in query.order_by(Listing.scraped_at.desc()).limit(200).all()]


@app.get(f"{API_PREFIX}/listings/{{listing_id}}")
def get_listing(listing_id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing_to_dict(listing)


@app.get(f"{API_PREFIX}/watchlists")
def get_watchlists(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [
        {
            "id": w.id,
            "name": w.name,
            "enabled": w.enabled,
            "keywords": w.keywords,
            "platforms": w.platforms,
            "location": w.location,
            "radius_miles": w.radius_miles,
            "price_min": w.price_min,
            "price_max": w.price_max,
            "category_id": w.category_id,
            "category_name": w.category_name,
            "craigslist_category": w.craigslist_category,
            "facebook_category": w.facebook_category,
            "condition": w.condition,
            "alert_type": w.alert_type,
            "last_scraped_at": w.last_scraped_at.isoformat() if w.last_scraped_at else None,
            "result_count": w.result_count,
        }
        for w in db.query(Watchlist).order_by(Watchlist.created_at.desc()).all()
    ]


@app.get(f"{API_PREFIX}/categories")
def get_categories() -> list[dict[str, Any]]:
    return read_config().get("search_categories", [])


@app.post(f"{API_PREFIX}/watchlists")
def create_watchlist(payload: WatchlistPayload, db: Session = Depends(get_db)) -> dict[str, Any]:
    watchlist = Watchlist(**payload.model_dump())
    db.add(watchlist)
    db.commit()
    db.refresh(watchlist)
    return {"id": watchlist.id}


@app.patch(f"{API_PREFIX}/watchlists/{{watchlist_id}}")
def update_watchlist(watchlist_id: str, payload: dict[str, Any], db: Session = Depends(get_db)) -> dict[str, str]:
    watchlist = db.get(Watchlist, watchlist_id)
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    for key, value in payload.items():
        if hasattr(watchlist, key):
            setattr(watchlist, key, value)
    db.commit()
    return {"status": "updated"}


@app.delete(f"{API_PREFIX}/watchlists/{{watchlist_id}}")
def delete_watchlist(watchlist_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    watchlist = db.get(Watchlist, watchlist_id)
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    db.delete(watchlist)
    db.commit()
    return {"status": "deleted"}


@app.get(f"{API_PREFIX}/settings")
def get_settings() -> dict[str, Any]:
    config = read_config()
    return {
        "poll_interval_seconds": config.get("scraper", {}).get("poll_interval_seconds", 300),
        "min_deal_score": config.get("scraper", {}).get("min_deal_score", 70),
        "theme": config.get("ui", {}).get("theme", "dark"),
        "email_to": config.get("alerts", {}).get("email", {}).get("to"),
        "webhook_url": config.get("alerts", {}).get("webhook", {}).get("url"),
    }


@app.patch(f"{API_PREFIX}/settings")
def update_settings(payload: SettingsPayload) -> dict[str, str]:
    config = read_config()
    config.setdefault("scraper", {})
    config.setdefault("ui", {})
    config.setdefault("alerts", {}).setdefault("email", {})
    config.setdefault("alerts", {}).setdefault("webhook", {})
    data = payload.model_dump(exclude_none=True)
    if "poll_interval_seconds" in data:
        config["scraper"]["poll_interval_seconds"] = data["poll_interval_seconds"]
    if "min_deal_score" in data:
        config["scraper"]["min_deal_score"] = data["min_deal_score"]
    if "theme" in data:
        config["ui"]["theme"] = data["theme"]
    if "email_to" in data:
        config["alerts"]["email"]["to"] = data["email_to"]
    if "webhook_url" in data:
        config["alerts"]["webhook"]["url"] = data["webhook_url"]
    write_config(config)
    return {"status": "updated"}


@app.websocket(f"{API_PREFIX}/ws/listings")
async def listings_socket(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            with SessionLocal() as db:
                listings = [listing_to_dict(item) for item in db.query(Listing).order_by(Listing.scraped_at.desc()).limit(50)]
            await websocket.send_text(json.dumps(listings))
            await asyncio.sleep(30)
    except WebSocketDisconnect:
        return


async def dry_run(watchlist_id: str | None) -> None:
    init_db()
    sync_watchlists_from_config()
    with SessionLocal() as db:
        query = db.query(Watchlist).filter(Watchlist.enabled.is_(True))
        if watchlist_id:
            query = query.filter(Watchlist.id == watchlist_id)
        for watchlist in query.all():
            listings = await scrape_watchlist(db, watchlist, dry_run=True)
            print(f"{watchlist.name}: {len(listings)} listings")
            for listing in listings[:5]:
                print(f"- {listing.platform}: {listing.title} ${listing.price}")


def cli() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Run scrapers without writing to the database.")
    parser.add_argument("--watchlist", help="Limit dry run to one watchlist id.")
    args = parser.parse_args()
    if args.dry_run:
        asyncio.run(dry_run(args.watchlist))


if __name__ == "__main__":
    cli()
