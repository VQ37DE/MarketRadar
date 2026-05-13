from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid5, NAMESPACE_URL

from pydantic import BaseModel, Field, HttpUrl


Platform = Literal["facebook", "craigslist"]


class NormalizedListing(BaseModel):
    id: str
    title: str
    price: float = 0
    location: str | None = None
    platform: Platform
    category_id: str | None = None
    category_name: str | None = None
    condition: str | None = None
    description: str = ""
    images: list[str] = Field(default_factory=list)
    url: str
    posted_at: datetime | None = None
    scraped_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deal_score: int = 0
    watchlist_id: str | None = None
    seller_signal: float = 0.5
    raw: dict[str, Any] = Field(default_factory=dict)


def stable_listing_id(platform: Platform, url: str, title: str) -> str:
    seed = url or f"{platform}:{title}"
    return str(uuid5(NAMESPACE_URL, seed))


def normalize_listing(payload: dict[str, Any], platform: Platform, watchlist_id: str | None = None) -> NormalizedListing:
    title = str(payload.get("title") or "Untitled listing").strip()
    url = str(payload.get("url") or "")
    return NormalizedListing(
        id=str(payload.get("id") or stable_listing_id(platform, url, title)),
        title=title,
        price=float(payload.get("price") or 0),
        location=payload.get("location"),
        platform=platform,
        category_id=payload.get("category_id"),
        category_name=payload.get("category_name"),
        condition=payload.get("condition"),
        description=payload.get("description") or "",
        images=list(payload.get("images") or []),
        url=url,
        posted_at=payload.get("posted_at"),
        scraped_at=payload.get("scraped_at") or datetime.now(timezone.utc),
        deal_score=int(payload.get("deal_score") or 0),
        watchlist_id=watchlist_id,
        seller_signal=float(payload.get("seller_signal") or 0.5),
        raw=payload,
    )
