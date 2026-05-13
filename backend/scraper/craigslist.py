from datetime import datetime, timezone
from urllib.parse import quote_plus

import requests
from bs4 import BeautifulSoup

from backend.scraper.normalizer import NormalizedListing, normalize_listing


def _price_to_float(text: str | None) -> float:
    if not text:
        return 0
    cleaned = "".join(ch for ch in text if ch.isdigit() or ch == ".")
    return float(cleaned or 0)


def build_search_url(watchlist: dict) -> str:
    query = quote_plus(" ".join(watchlist.get("keywords") or []))
    location = (watchlist.get("location") or "austin").split(",")[0].lower().replace(" ", "")
    url = f"https://{location}.craigslist.org/search/sss?query={query}&sort=date"
    if watchlist.get("price_min") is not None:
        url += f"&min_price={int(watchlist['price_min'])}"
    if watchlist.get("price_max") is not None:
        url += f"&max_price={int(watchlist['price_max'])}"
    return url


def scrape_craigslist(watchlist: dict, timeout: int = 20) -> list[NormalizedListing]:
    response = requests.get(build_search_url(watchlist), timeout=timeout, headers={"User-Agent": "MarketRadar/0.1"})
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    listings: list[NormalizedListing] = []

    for result in soup.select(".cl-search-result, li.result-row")[:80]:
        title_el = result.select_one(".titlestring, .label")
        link_el = result.select_one("a[href]")
        price_el = result.select_one(".price")
        time_el = result.select_one("time")
        title = title_el.get_text(" ", strip=True) if title_el else "Craigslist listing"
        url = link_el.get("href") if link_el else ""
        posted_at = None
        if time_el and time_el.get("datetime"):
            posted_at = datetime.fromisoformat(time_el["datetime"].replace("Z", "+00:00"))
        payload = {
            "title": title,
            "price": _price_to_float(price_el.get_text(strip=True) if price_el else None),
            "location": watchlist.get("location"),
            "url": url,
            "posted_at": posted_at,
            "scraped_at": datetime.now(timezone.utc),
            "images": [],
        }
        listings.append(normalize_listing(payload, "craigslist", watchlist.get("id")))
    return listings
