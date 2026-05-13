from datetime import datetime, timezone
from difflib import SequenceMatcher

from backend.scraper.normalizer import NormalizedListing


CONDITION_SCORE = {
    "new": 1.0,
    "like_new": 0.9,
    "like new": 0.9,
    "good": 0.7,
    "fair": 0.45,
    "poor": 0.2,
}

MARKET_AVERAGES = {
    "monitor": 230,
    "1440p": 260,
    "bike": 850,
    "gravel": 1100,
    "camera": 220,
    "sofa": 450,
    "desk": 180,
    "macbook": 900,
}


def estimate_market_value(title: str, fallback: float) -> float:
    lowered = title.lower()
    matches = [value for key, value in MARKET_AVERAGES.items() if key in lowered]
    if matches:
        return sum(matches) / len(matches)
    return max(fallback * 1.2, fallback + 50, 1)


def keyword_relevance(title: str, keywords: list[str]) -> float:
    if not keywords:
        return 0.6
    title_lower = title.lower()
    exact_hits = sum(1 for keyword in keywords if keyword.lower() in title_lower)
    fuzzy = max((SequenceMatcher(None, keyword.lower(), title_lower).ratio() for keyword in keywords), default=0)
    return min(1.0, (exact_hits / len(keywords)) * 0.75 + fuzzy * 0.25)


def freshness_score(posted_at: datetime | None) -> float:
    if not posted_at:
        return 0.45
    now = datetime.now(timezone.utc)
    if posted_at.tzinfo is None:
        posted_at = posted_at.replace(tzinfo=timezone.utc)
    hours = max((now - posted_at).total_seconds() / 3600, 0)
    if hours <= 1:
        return 1.0
    if hours <= 24:
        return 0.8
    if hours <= 72:
        return 0.55
    return 0.25


def score_listing(listing: NormalizedListing, keywords: list[str] | None = None) -> int:
    market_value = estimate_market_value(listing.title, listing.price)
    price_delta = max(market_value - listing.price, 0) / market_value
    price_component = min(price_delta * 1.8, 1.0)
    condition_component = CONDITION_SCORE.get((listing.condition or "").lower(), 0.5)
    seller_component = min(max(listing.seller_signal, 0), 1)

    score = (
        price_component * 40
        + freshness_score(listing.posted_at) * 20
        + keyword_relevance(listing.title, keywords or []) * 20
        + condition_component * 10
        + seller_component * 10
    )
    return max(0, min(100, round(score)))
