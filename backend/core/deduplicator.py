import hashlib
import re

from backend.scraper.normalizer import NormalizedListing


def normalize_title(title: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]+", " ", title.lower())).strip()


def listing_fingerprint(listing: NormalizedListing) -> str:
    material = f"{normalize_title(listing.title)}|{round(listing.price or 0, 2)}|{listing.platform}"
    return hashlib.sha256(material.encode("utf-8")).hexdigest()
