const express = require("express");
const trails = require("../data/trails.json");
const { matchTrail, matchAllTrails } = require("../matching/matcher");

const router = express.Router();

function validateProfile(profile) {
  const required = ["mobilityType", "endurance", "confidence", "assistance", "terrainTolerance"];
  const missing = required.filter((k) => !profile || !profile[k]);
  if (missing.length) return `Missing profile fields: ${missing.join(", ")}`;
  if (!profile.maxDistanceM && !profile.maxDistance) return "Missing maxDistanceM or maxDistance";
  return null;
}

// POST /api/match  { profile, tripModifiers? }  -> matches against ALL trails, best-first
router.post("/", (req, res) => {
  const { profile, tripModifiers } = req.body || {};
  const error = validateProfile(profile);
  if (error) return res.status(400).json({ error });
  const results = matchAllTrails(trails, profile, tripModifiers || {});
  res.json({ results });
});

// POST /api/match/:trailId  { profile, tripModifiers? } -> matches against ONE trail
router.post("/:trailId", (req, res) => {
  const { profile, tripModifiers } = req.body || {};
  const error = validateProfile(profile);
  if (error) return res.status(400).json({ error });
  const trail = trails.find((t) => t.id === req.params.trailId);
  if (!trail) return res.status(404).json({ error: "Trail not found" });
  const result = matchTrail(trail, profile, tripModifiers || {});
  res.json(result);
});

module.exports = router;
