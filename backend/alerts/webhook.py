import os

import httpx


async def send_webhook_alert(url: str | None, payload: dict) -> None:
    target = url or os.getenv("WEBHOOK_URL")
    if not target:
        return
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(target, json=payload)
