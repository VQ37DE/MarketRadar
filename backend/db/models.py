from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Watchlist(Base):
    __tablename__ = "watchlists"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    keywords: Mapped[list[str]] = mapped_column(JSON, default=list)
    platforms: Mapped[list[str]] = mapped_column(JSON, default=list)
    location: Mapped[str | None] = mapped_column(String(160), nullable=True)
    radius_miles: Mapped[int | None] = mapped_column(Integer, nullable=True)
    price_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    price_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    category_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    category_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    craigslist_category: Mapped[str | None] = mapped_column(String(20), nullable=True)
    facebook_category: Mapped[str | None] = mapped_column(String(120), nullable=True)
    condition: Mapped[list[str]] = mapped_column(JSON, default=list)
    alert_type: Mapped[str | None] = mapped_column(String(40), nullable=True)
    last_scraped_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    result_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    listings: Mapped[list["Listing"]] = relationship(back_populates="watchlist")


class Listing(Base):
    __tablename__ = "listings"
    __table_args__ = (UniqueConstraint("fingerprint", name="uq_listing_fingerprint"),)

    id: Mapped[str] = mapped_column(String, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    price: Mapped[float] = mapped_column(Float, default=0)
    location: Mapped[str | None] = mapped_column(String(160), nullable=True)
    platform: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    category_id: Mapped[str | None] = mapped_column(String(80), nullable=True, index=True)
    category_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    condition: Mapped[str | None] = mapped_column(String(40), nullable=True)
    description: Mapped[str] = mapped_column(Text, default="")
    images: Mapped[list[str]] = mapped_column(JSON, default=list)
    image_hashes: Mapped[list[str]] = mapped_column(JSON, default=list)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    scraped_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    removed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    deal_score: Mapped[int] = mapped_column(Integer, default=0)
    seller_signal: Mapped[float] = mapped_column(Float, default=0.5)
    watchlist_id: Mapped[str | None] = mapped_column(ForeignKey("watchlists.id"), nullable=True)
    relist_of_id: Mapped[str | None] = mapped_column(String, nullable=True)
    relist_count: Mapped[int] = mapped_column(Integer, default=0)
    price_drop_amount: Mapped[float] = mapped_column(Float, default=0)
    price_drop_percent: Mapped[float] = mapped_column(Float, default=0)
    days_sitting: Mapped[int] = mapped_column(Integer, default=0)

    watchlist: Mapped[Watchlist | None] = relationship(back_populates="listings")
    history: Mapped[list["ListingHistory"]] = relationship(back_populates="listing", cascade="all, delete-orphan")


class ListingHistory(Base):
    __tablename__ = "listing_history"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    listing_id: Mapped[str] = mapped_column(ForeignKey("listings.id"), nullable=False, index=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    price: Mapped[float] = mapped_column(Float, default=0)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    raw: Mapped[dict] = mapped_column(JSON, default=dict)

    listing: Mapped[Listing] = relationship(back_populates="history")
