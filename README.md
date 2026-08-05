# Rolling Trailblazers Australia — Trail Matching Engine (POC)

CSIT321 · Group 38 · A4 Prototype

This is the working prototype behind the A4 presentation: a segment-by-segment
trail-to-user matching engine, exposed via a REST API and a React front-end.

## What's real here

- **The matching algorithm is fully implemented and tested** (`backend/src/matching/`).
  Run `cd backend && npm install && npm test` — 7 tests pass, including one that
  reproduces the sponsor's exact worked example from
  *Trail Algorithm - base assumptions.docx* (mobility scooter, low confidence,
  solo, sealed-only, 1.5km max → Minnamurra → Partially Accessible, 800m
  accessible, 1.6km return).
- **The API is a real Express server** with endpoints for trails, matching, and
  profile options, plus three stub endpoints (`/api/ai-query`,
  `/api/transport-plan`, `/api/trail-conditions`) that return `501 Not
  Implemented` — these are the "future hooks" from the A2 report, not features
  we're claiming to have built.
- **The front-end is a real React (Vite) app** that calls that API. It builds
  cleanly (`npm run build`) but has not been screenshotted in a live browser by
  the assistant that generated it — test it yourself before relying on it for a
  live demo (see below).

## What's simplified for the POC (and why)

- **Data layer:** trail + segment data lives in `backend/src/data/trails.json`
  rather than PostgreSQL. It mirrors the exact schema shape from the A2 report
  (a parent Trail record with child Segment records) so the migration to
  Postgres is a lift-and-shift, not a redesign.
- **Map:** the Discover screen shows an illustrative regional overview (pure
  SVG, no external map-tile dependency), not a geocoded Leaflet/Google map.
  The segment-accessibility visualisation (the "secret sauce" screen) was
  prioritised instead — see the A4 presentation for the rationale.
- **Trail data accuracy:** segment attributes (surface, gradient, hazards etc.)
  are the team's best estimate from public trail descriptions, not yet
  sponsor-verified field data.

## Running it

```bash
# Terminal 1 - backend (port 4000)
cd backend
npm install
npm test        # optional - confirms the algorithm is correct first
npm run dev

# Terminal 2 - frontend (port 5173)
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173**. The Vite dev server proxies `/api/*` to
the backend on port 4000 (see `frontend/vite.config.js`), so both must be
running.

## Project layout

```
backend/
  src/
    data/trails.json        7 Illawarra POC trails, segment-level attributes
    matching/
      scoring.js             weighted 0-100 segment scoring
      profile.js             user profile -> matching thresholds
      matcher.js             the core algorithm (segment walk, endurance, risk modifiers)
    routes/                  trails / match / options endpoints
    server.js
  tests/matcher.test.js       7 automated tests
frontend/
  src/
    pages/                   Landing, ProfileBuilder, Discover, TrailResults
    components/               StatusBadge, SegmentStrip, CapabilityMeter, MiniMap, NavBar, Footer
    api.js
```
