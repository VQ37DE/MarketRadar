# MarketRadar

MarketRadar is a real-time deal aggregator and scoring engine for Facebook Marketplace and Craigslist. It normalizes listings into one fast dashboard, scores deal quality, and tracks relists, price drops, and stale inventory so buyers can negotiate with context.

## Stack

- Backend: FastAPI, SQLAlchemy, SQLite, APScheduler, Playwright, BeautifulSoup
- Frontend: React, Vite, TailwindCSS
- Config: YAML watchlists and alert settings
- Notifications: SMTP email and webhook delivery
- Packaging: Docker and docker-compose

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Open the frontend at `http://localhost:5173` and the API at `http://localhost:8000/api/v1`.

For local development without Docker:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload

cd frontend
npm install
npm run dev
```

## Facebook Marketplace Setup

Facebook Marketplace requires an authenticated browser session. Export your own session cookies to `cookies.json` at the repository root. MarketRadar never stores your Facebook password. Keep `cookies.json` private and do not commit it.

The Facebook scraper is intentionally conservative: it loads Marketplace searches with Playwright using your cookies and extracts visible listing data. Site markup changes often, so selectors may need occasional adjustment.

## Configuration

Edit `config.yaml` to define watchlists, polling, scoring thresholds, and alert destinations. Secrets belong in `.env`.

```yaml
watchlists:
  - id: "gaming-monitors"
    name: "Gaming Monitors"
    enabled: true
    keywords: ["monitor", "1440p", "144hz"]
    platforms: ["facebook", "craigslist"]
    location: "Austin, TX"
    radius_miles: 35
    price_min: 50
    price_max: 400
    condition: ["like_new", "good"]
    alert_type: "email"
```

## Scraper Dry Run

Run scrapers without writing to the database:

```bash
python -m backend.main --dry-run --watchlist gaming-monitors
```

## API

All application endpoints live under `/api/v1/`.

- `GET /api/v1/listings`
- `GET /api/v1/listings/{listing_id}`
- `GET /api/v1/watchlists`
- `POST /api/v1/watchlists`
- `PATCH /api/v1/watchlists/{watchlist_id}`
- `DELETE /api/v1/watchlists/{watchlist_id}`
- `GET /api/v1/settings`
- `PATCH /api/v1/settings`
- `WS /api/v1/ws/listings`

## Relist Radar

MarketRadar stores every observed version of a listing. New listings are checked against existing records using title similarity and optional perceptual image hashes. Cards surface:

- Relist count
- Price drops and percentage change
- Days sitting unsold
- Version history in the detail panel

## Project Layout

```text
backend/
  main.py
  scraper/
  core/
  db/
  alerts/
  scheduler.py
frontend/
  src/
seeds/
  mock_listings.json
config.yaml
docker-compose.yml
Dockerfile
```

## Disclaimer

Scraping Facebook Marketplace may violate Facebook's Terms of Service. Use this project responsibly and at your own risk.
