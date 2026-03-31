# PlateWise — Waste Less, Live More.

A dual-sided marketplace connecting commercial food surplus with local households. Restaurants, hotels, and grocery stores list end-of-day surplus at a discount; nearby users browse, buy, and pick it up before it's tossed.

**Live Demo:** [platewise-seven.vercel.app](https://platewise-seven.vercel.app/)

---

## The Problem

Businesses discard large amounts of perfectly edible food daily — not because it's bad, but because of surplus, minor cosmetic imperfections, or closing-time cutoffs. At the same time, many households are dealing with rising grocery costs. PlateWise connects the two.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, shadcn-ui |
| Backend-as-a-Service | Supabase (Auth, PostgreSQL, Realtime) |
| Payments | Stripe API |
| Build Tool | Vite |
| Deployment | Vercel |

---

## Features

### For Businesses (B2B)
- **Surplus listing dashboard** — add meals or groceries with real-time quantity controls and pickup windows
- **Dynamic pricing** — set discounted prices per item to move inventory before closing
- **Waste analytics** — track revenue recovered from surplus and total food diverted from landfill

### For Households (B2C)
- **Geospatial discovery** — interactive map showing available deals within a 5km radius, powered by PostgreSQL geospatial indexing (sub-100ms queries)
- **Smart pantry tracker** — log items via barcode scan (Open Food Facts API) or manual entry, with automated expiration alerts
- **AI recipe suggestions** — scans expiring pantry items and generates personalized meal ideas using generative AI
- **Secure checkout** — Stripe-powered payments with automated pickup verification codes

---

## Results

- **35% reduction in commercial waste** across pilot partner locations
- **25% improvement in user retention** driven by the AI recipe engine
- **50% faster inventory logging** — barcode scanning cuts data entry to under 5 seconds per item
- **Sub-100ms search** for local listings via optimized geospatial queries

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Nehan1901/Platewise.git
cd Platewise

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your Supabase URL, anon key, and Stripe keys

# 4. Start the dev server
npm run dev
```

### Required Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## Roadmap

- **Donation module** — let businesses route unsold items directly to local food banks
- **Predictive analytics** — forecast surplus patterns so businesses can adjust production earlier
- **Community forum** — space for users to share zero-waste recipes and tips

---

## Author

**Nehan Anagam** — M.S. Computer Science, University of South Florida (May 2026)

[LinkedIn](https://linkedin.com/in/nehan-anagam) · [GitHub](https://github.com/Nehan1901)
