# RTBA — A4 Presentation: Script & Q&A Prep
**Group 38 · CSIT321 · 6 minutes talk + 2 minutes Q&A**

Slide deck: `RTBA_A4_Prototype_Presentation.pptx` (9 slides). This script is timed to the deck slide-by-slide — one person can read it end-to-end, or split it across speakers as marked. Swap the speaker labels freely; what matters is the timing.

---

## Before you walk in (2-minute checklist)

- [ ] Deck open and slide 1 showing before you're called up.
- [ ] Skim the whole script once out loud — total should land at 5:30–6:00.
- [ ] Decide as a group: are you attempting the **live prototype** (backend + frontend running) as a bonus, or presenting **slides-only**? Slides-only is completely safe — every screen you need is already built into the deck using real output from the algorithm, not invented numbers.
- [ ] If attempting the live demo: start `npm run dev` in `backend/` and `frontend/` *before* you're called up, and have a browser tab already open to `localhost:5173`. Don't attempt first-time setup live.
- [ ] Decide who answers Q&A questions about (a) the algorithm/backend and (b) the interface/architecture — you don't all need to answer everything.

---

## Script

### Slide 1 — Title (0:00–0:15)
**Speaker: Rashid**

> Good [morning/afternoon], I'm Rashid, and this is Group 38 — Rolling Trailblazers Australia. Today we're presenting our A4 prototype: a trail-to-user matching engine for the Illawarra region.

### Slide 2 — Recap: Problem & Vision (0:15–0:50)
**Speaker: Rashid**

> Quick recap of the problem we're solving. A trail marked "wheelchair accessible" can still hide loose gravel, a steep pinch, or a flight of steps — accessibility isn't a yes-or-no label. So RTBA breaks every trail into segments, builds a capability profile for every user, and matches the two — including *partial* access. And the design principle that governs everything we built: be conservative, not optimistic. A false positive can strand someone and destroy trust in the platform.

### Slide 3 — System Architecture (0:50–1:35)
**Speaker: Yousef**

> Here's what we actually built since A3. It's a real three-layer application: a React front-end for the profile builder and results screens, a Node.js and Express API that runs the matching engine, and a structured trail-and-segment data layer. On the right, you can see we've also reserved three API endpoints for the AI query engine, transport planning, and community trail-condition reporting your sponsor described — they return a clean "not implemented yet" response for now. That's a contract for Semester 2, not something we're pretending is done. And importantly — this isn't just designed, it's tested: seven automated tests currently pass against this exact codebase.

### Slide 4 — The Matching Algorithm (1:35–2:25)
**Speaker: Eissa**

> This is how the scoring actually works. Every segment gets scored out of 100, weighted exactly the way our sponsor specified: surface is worth 30 points, gradient 25, width 15, hazards 15, facilities 10, and safety 5. What matters more than the formula is the philosophy behind it — this is a direct quote from the sponsor's design sheet: *"be conservative rather than optimistic — a false positive can strand a user, damage confidence, and destroy trust in the platform."* So our algorithm walks a trail in order and stops dead at the very first segment that breaches any of the user's thresholds. And that safety floor never turns off — even a profile that says "advanced, high confidence" still gets stopped by a genuinely hazardous segment. We'll show you exactly that in a moment.

### Slide 5 — Walkthrough Part 1: Profile & Discover (2:25–3:10)
**Speaker: Eissa**

> This is the user-facing side. Six quick questions build a capability profile — mobility type, endurance, confidence, terrain tolerance, distance, and support — deliberately short, because many of our users have limited technical confidence. Once that's done, Discover ranks all seven Illawarra trails for that specific profile, not a generic accessibility score. You can see Blue Mile and Nan Tien coming back Suitable, Shellharbour and Kiama coming back Partially Accessible, and Lake Illawarra — despite being fully sealed — coming back Not Recommended. We'll explain that last one, because it's actually the most important result on this slide.

### Slide 6 — The "Secret Sauce": Trail Details & Results (3:10–4:20)
**Speaker: Khaled**

> This is the screen our sponsor called the breakthrough after A3, so we want to spend real time here. This is Minnamurra, run against the exact worked example from the sponsor's own design brief: a mobility scooter user, low confidence, solo, sealed surfaces only, maximum one-and-a-half kilometres. The algorithm gives safe access for the first 800 metres of boardwalk — that's the green block — then stops dead at the rainforest floor track, because the surface, the gradient, the width, *and* the overall score all breach this profile's thresholds simultaneously. You can see exactly why in the capability meters underneath: a segment score of 34 against a required minimum of 80; a 9% gradient against a 5% limit; 900 millimetres of width against a 1,000 millimetre minimum. And underneath that, the trip-level notes: the 1.6 kilometre return trip exceeds this user's 1.5 kilometre limit, and because they're solo with low confidence, we recommend a companion. That's the whole pipeline — score, match, stop, explain — running on one real example.

### Slide 7 — Tested & Validated (4:20–4:55)
**Speaker: Tuba**

> We didn't want to just claim the algorithm works — we proved it. Seven automated tests currently pass, including one that reproduces the sponsor's exact worked example number-for-number: 800 metres accessible, 1.6 kilometre return, Partially Accessible. We also specifically tested that the conservative safety floor holds even for advanced, high-confidence users, that trails rank correctly best-first for any profile, and that trip-day conditions like wet weather correctly downgrade a recommendation.

### Slide 8 — Progress & Next Steps (4:55–5:35)
**Speaker: Tuba**

> Against our A2 base requirements: the trail data model, the weighted scoring, the user profile, and the matching engine with risk modifiers are done. Map integration and the full accessible UI are in progress. For A5, our priorities are migrating from our current data layer to the PostgreSQL schema we specified in A2, a live geographic map, the community trail-condition reporting that solves the "trail degradation" problem, sponsor-reviewed field data for all seven trails, and the onboarding and community-landing work our sponsor flagged after A3.

### Slide 9 — Thank You / Questions (5:35–5:50)
**Speaker: Tuba**

> That's where we are — a tested matching engine, a working interface, and a clear list of what's next. Happy to take your questions.

---

## Expected Questions & Suggested Answers

**1. "Is this real, working code, or a mockup for today?"**
> The matching algorithm and API are genuinely implemented in Node.js/Express and covered by seven automated tests — including the exact worked example from your own design brief. The front-end is a real React application that calls that API. Everything on the Results screen (slide 6) is real computed output, not invented numbers.

**2. "Why did a fully sealed, 'accessible' trail like Lake Illawarra come back Not Recommended?"**
> Surface accessibility isn't the same as endurance capacity. Lake Illawarra is fully sealed, but it's 7km one-way — a 14km round trip, which exceeded that particular profile's stated distance limit by more than 30%, so the algorithm downgraded it rather than over-promise. That's the "conservative, not optimistic" principle applying to distance, not just terrain.

**3. "What's the actual difference between 'Partially Accessible' and 'Suitable with Assistance'?"**
> Partially Accessible means the trail itself becomes physically unsuitable beyond a certain point — the user can't safely continue no matter who's with them. Suitable with Assistance means the *whole* trail is within their physical thresholds, but their profile (e.g. solo + low confidence) means we recommend they don't do it alone. They're different axes: one's about the trail, one's about the trip.

**4. "Is the map on the Discover screen a real, geocoded map?"**
> Not yet — it's an illustrative regional overview for the POC, so we didn't need to depend on a live map-tile provider this semester. We deliberately prioritised the segment-accessibility visualisation instead, since that's the platform's real differentiator. A full Leaflet/Google Maps integration with entry points and facilities overlays is scoped for A5.

**5. "A2 specified PostgreSQL — why isn't that implemented yet?"**
> For the POC we're using a structured JSON data layer that mirrors the exact schema shape we specified in A2 — trail records with child segment records. That let us focus this sprint on getting the algorithm correct and tested. The migration to PostgreSQL is a scoped, well-understood task for A5, not a redesign.

**6. "How did you decide the scoring weights and thresholds?"**
> The weights — surface 30, gradient 25, width 15, hazards 15, facilities 10, safety 5 — come directly from your Algorithm Design Sheet. The confidence-to-minimum-score thresholds (80 for low confidence, 65 for medium, 50 for high) are modelled directly on the worked examples in your base-assumptions document.

**7. "How do you handle trail degradation — the Waze-style updates you mentioned wanting?"**
> That's explicitly out of scope for Semester 1 in your own base-assumptions document — you called it "a moment in time" problem. We've reserved a `/api/trail-conditions` endpoint in the architecture so community-reported updates have somewhere to plug in later, but we haven't built the reporting feature itself yet.

**8. "How confident are you in the accuracy of the trail data — surface, gradient, hazards?"**
> Right now the segment data is our best estimate from public trail descriptions, built so we could test the algorithm end-to-end. Sponsor-reviewed field data for all seven trails is explicitly on our list for the next phase — the algorithm is only as conservative as the data feeding it.

**9. "Who did what?"**
> *(Personalise this with your real breakdown before presenting — suggested split: one person on the matching algorithm/backend, one on the API, one on the React front-end, one on the trail dataset/testing, one on architecture docs and this presentation.)*

**10. "What was the hardest part?"**
> Getting the algorithm to fail safely in the right *order* — surface, then gradient, then width, then score — so that the explanation we give the user is always specific and correct, not just "not recommended" with no reason. That's what the capability meters on slide 6 are for.

---

## If something doesn't cooperate on the day

- **Live demo won't load:** don't troubleshoot in front of the room. Say "we've got that running on video/screenshots today" and go straight to slide 6 — it already shows the real output.
- **Running short on time:** cut slide 8 down to one sentence ("base requirements are done, map and UI polish are in progress, full detail is in our report") and go straight to Questions.
- **Running long:** the two slides you can compress without losing anything important are 2 (recap) and 5 (walkthrough part 1) — the room already has context from A2/A3.
