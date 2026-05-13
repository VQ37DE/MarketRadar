# 🔍 MarketRadar

> An intelligent, automated deal discovery engine for Facebook Marketplace and Craigslist — built to surface high-value listings the moment they go live.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)

---

## 📖 About

MarketRadar is a real-time listing aggregator and deal-scoring system that continuously monitors **Facebook Marketplace** and **Craigslist** for newly posted items matching user-defined criteria.

Rather than manually refreshing searches, MarketRadar runs asynchronous scrapers on a configurable polling interval, normalizes listing data across platforms into a unified schema, and applies a scoring algorithm to rank deals by value — factoring in asking price vs. estimated market value, listing age, seller history, and keyword relevance.

---

## ✨ Key Features

- **Multi-Platform Scraping** — Simultaneous coverage of Facebook Marketplace and Craigslist with platform-specific parsers
- **Real-Time Alerting** — Push notifications or email/webhook alerts the moment a high-score listing is detected
- **Deal Scoring Engine** — Heuristic + ML-assisted ranking based on price deviation, condition, and market comparables
- **Configurable Watchlists** — Define search queries, location radius, price floors/ceilings, and keyword filters per target
- **Deduplication** — Cross-platform fingerprinting to avoid surfacing the same item twice
- **Historical Tracking** — Stores listing lifecycles to analyze price drops, relisting patterns, and market trends

---

## 🎯 Use Cases

- Flipping goods for profit
- Tracking specific items (electronics, furniture, vehicles) at a target price
- Competitive market research and price trend analysis

---

## 🏗️ Project Structure

```
marketradar/
├── scrapers/
│   ├── facebook.py        # Facebook Marketplace scraper
│   └── craigslist.py      # Craigslist scraper
├── core/
│   ├── scorer.py          # Deal scoring engine
│   ├── deduplicator.py    # Cross-platform deduplication
│   └── normalizer.py      # Unified listing schema
├── alerts/
│   ├── email.py           # Email notification handler
│   └── webhook.py         # Webhook / push notification handler
├── storage/
│   └── db.py              # Listing storage and history tracking
├── config.yaml            # User-defined watchlists and settings
├── main.py                # Entry point
└── requirements.txt
```

---

## ⚙️ Configuration

Edit `config.yaml` to define your watchlists:

```yaml
watchlists:
  - name: "Gaming Monitors"
    keywords: ["monitor", "1440p", "144hz"]
    platforms: ["facebook", "craigslist"]
    location: "Houston, TX"
    radius_miles: 30
    price_min: 50
    price_max: 400
    alert: email

  - name: "Vintage Cameras"
    keywords: ["film camera", "35mm", "canon ae-1"]
    platforms: ["craigslist"]
    location: "Houston, TX"
    radius_miles: 50
    price_max: 200
    alert: webhook

alerts:
  email:
    to: "you@example.com"
  webhook:
    url: "https://hooks.slack.com/your-webhook-url"

scraper:
  poll_interval_seconds: 120
  min_deal_score: 70
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Chrome + ChromeDriver (for Selenium-based scraping)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/marketradar.git
cd marketradar

# Install dependencies
pip install -r requirements.txt

# Configure your watchlists
cp config.example.yaml config.yaml
# Edit config.yaml with your targets and alert preferences
```

### Run

```bash
python main.py
```

---

## 🧠 How the Deal Scorer Works

Each listing is assigned a score from **0–100** based on:

| Factor | Weight |
|---|---|
| Price vs. estimated market value | 40% |
| Listing freshness (age) | 20% |
| Keyword match quality | 20% |
| Item condition | 10% |
| Seller reputation signals | 10% |

Only listings above the configured `min_deal_score` threshold trigger an alert.

---

## ⚠️ Disclaimer

This tool is intended for personal and educational use only. Scraping Facebook Marketplace may violate their [Terms of Service](https://www.facebook.com/terms.php). Use responsibly and at your own risk.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)
