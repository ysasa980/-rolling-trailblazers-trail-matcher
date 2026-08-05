const express = require("express");
const trails = require("../data/trails.json");

const router = express.Router();

// GET /api/trails - lightweight list for the Discovery screen
router.get("/", (req, res) => {
  const summary = trails.map((t) => ({
    id: t.id,
    name: t.name,
    region: t.region,
    lat: t.lat,
    lng: t.lng,
    pocRole: t.poc_role,
    totalLengthM: t.totalLengthM,
    segmentCount: t.segments.length
  }));
  res.json(summary);
});

// GET /api/trails/:id - full detail including segments (for Trail Detail screen)
router.get("/:id", (req, res) => {
  const trail = trails.find((t) => t.id === req.params.id);
  if (!trail) return res.status(404).json({ error: "Trail not found" });
  res.json(trail);
});

module.exports = router;
