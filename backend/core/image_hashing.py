from io import BytesIO

import imagehash
import requests
from PIL import Image


def perceptual_hash_from_url(url: str, timeout: int = 10) -> str | None:
    try:
        response = requests.get(url, timeout=timeout, headers={"User-Agent": "MarketRadar/0.1"})
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))
        return str(imagehash.phash(image))
    except Exception:
        return None


def image_hashes(urls: list[str]) -> list[str]:
    return [value for value in (perceptual_hash_from_url(url) for url in urls[:5]) if value]
