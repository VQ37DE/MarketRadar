import json
import os
from datetime import datetime, timezone
from urllib.parse import quote_plus

from playwright.async_api import async_playwright

from backend.scraper.normalizer import NormalizedListing, normalize_listing


async def scrape_facebook(watchlist: dict, cookies_path: str | None = None) -> list[NormalizedListing]:
    cookies_path = cookies_path or os.getenv("FACEBOOK_COOKIES_PATH", "cookies.json")
    if not os.path.exists(cookies_path):
        raise FileNotFoundError("Facebook scraping requires cookies.json. See README setup instructions.")

    query = quote_plus(" ".join(watchlist.get("keywords") or []))
    url = f"https://www.facebook.com/marketplace/search/?query={query}"
    listings: list[NormalizedListing] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        with open(cookies_path, "r", encoding="utf-8") as cookie_file:
            await context.add_cookies(json.load(cookie_file))
        page = await context.new_page()
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(2500)

        cards = await page.locator("a[href*='/marketplace/item/']").all()
        seen: set[str] = set()
        for card in cards[:60]:
            href = await card.get_attribute("href")
            if not href or href in seen:
                continue
            seen.add(href)
            text = (await card.inner_text()).splitlines()
            title = text[-1] if text else "Facebook Marketplace listing"
            price_line = next((line for line in text if line.strip().startswith("$")), "0")
            price = float("".join(ch for ch in price_line if ch.isdigit() or ch == ".") or 0)
            image_src = None
            image = card.locator("img").first
            if await image.count():
                image_src = await image.get_attribute("src")
            payload = {
                "title": title,
                "price": price,
                "location": watchlist.get("location"),
                "category_id": watchlist.get("category_id"),
                "category_name": watchlist.get("category_name"),
                "url": href if href.startswith("http") else f"https://www.facebook.com{href}",
                "posted_at": None,
                "scraped_at": datetime.now(timezone.utc),
                "images": [image_src] if image_src else [],
            }
            listings.append(normalize_listing(payload, "facebook", watchlist.get("id")))
        await browser.close()

    return listings
