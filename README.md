# BaliVilla Host Portal

Next.js 16 host-facing management site for host.balivilla.com. For Bali villa owners to manage listings, bookings, and payouts.

## Prerequisites

- Node.js 20+
- The Django backend (`balivilla-api`) running on port 8000
- The guest site (`balivilla-web`) running on port 3000 (optional — needed for "Preview as guest" links)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.example .env.local
# Defaults point to localhost:8000 (API) and localhost:3000 (guest site)

# 3. Start the dev server (runs on port 3001 to avoid conflict with balivilla-web)
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001).

> Auth requires the backend to be running. The dashboard UI renders with mock/empty states without it.

## Project structure

```
app/
  login/          # Host login page
  signup/         # Host registration
  dashboard/      # Authenticated dashboard (sidebar layout)
    page.js       # Overview / metrics
    listings/     # Property management
    reservations/ # Booking management
    messages/     # Guest chat
    calendar/     # Availability
    insights/     # Analytics
    payouts/      # Earnings
    profile/      # Settings
components/
  layout/         # Sidebar, TopBar
  ui/             # Shared UI atoms
lib/
  api-client.js   # Fetch wrapper
messages/
  en.json         # English strings
  id.json         # Indonesian strings
```

## Common issues

**"Cannot find module" on first run** — run `npm install` first.

**API errors** — start `balivilla-api` with `python manage.py runserver`.

**Port conflict** — if port 3001 is taken, pick any free port: `npm run dev -- -p 3002`.

**"Visit BaliVilla" link goes nowhere** — start `balivilla-web` on port 3000, or update `NEXT_PUBLIC_WEB_URL` in `.env.local`.
