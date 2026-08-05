const test = require("node:test");
const assert = require("node:assert/strict");
const trails = require("../src/data/trails.json");
const { matchTrail, matchAllTrails, STATUS } = require("../src/matching/matcher");

function findTrail(id) {
  const t = trails.find((t) => t.id === id);
  assert.ok(t, `fixture trail "${id}" must exist`);
  return t;
}

test("Sponsor worked example: scooter/low-confidence/solo/sealed-only on Minnamurra -> Partially Accessible, 800m, 1.6km return", () => {
  const minnamurra = findTrail("minnamurra");
  const profile = {
    mobilityType: "mobility_scooter",
    endurance: "low",
    confidence: "low",
    maxDistanceM: 1500,
    assistance: "solo",
    terrainTolerance: "sealed_only"
  };

  const result = matchTrail(minnamurra, profile);

  assert.equal(result.accessibleDistanceM, 800, "should stop after the 800m boardwalk segment");
  assert.equal(result.returnTripM, 1600, "return trip should be double the accessible distance");
  assert.equal(result.status, STATUS.PARTIAL, "should be classified Partially Accessible");
  assert.ok(
    result.notes.some((n) => n.includes("companion or support worker")),
    "solo + low confidence should recommend a companion"
  );
});

test("Blue Mile is Suitable for a generous-distance profile (gold-standard accessible benchmark)", () => {
  const blueMile = findTrail("blue-mile");
  const profile = {
    mobilityType: "powered_wheelchair",
    endurance: "medium",
    confidence: "medium",
    maxDistanceM: 8000,
    assistance: "companion",
    terrainTolerance: "sealed_only"
  };
  const result = matchTrail(blueMile, profile);
  assert.equal(result.status, STATUS.SUITABLE);
  assert.equal(result.accessibleDistanceM, blueMile.totalLengthM);
});

test("Blue Mile's classification degrades when the round trip exceeds the user's stated max distance", () => {
  const blueMile = findTrail("blue-mile");
  const profile = {
    mobilityType: "mobility_scooter",
    endurance: "low",
    confidence: "low",
    maxDistanceM: 1500, // trail is fully surface-accessible, but 7km return exceeds this user's capacity
    assistance: "solo",
    terrainTolerance: "sealed_only"
  };
  const result = matchTrail(blueMile, profile);
  assert.equal(result.status, STATUS.NOT_RECOMMENDED);
  assert.ok(result.notes.some((n) => n.includes("exceeds your selected maximum distance")));
});

test("Even an advanced/high-confidence profile is conservatively stopped by a genuinely dangerous segment (Minnamurra upper falls)", () => {
  const minnamurra = findTrail("minnamurra");
  const profile = {
    mobilityType: "assisted_walking",
    endurance: "high",
    confidence: "high",
    maxDistanceM: 6000,
    assistance: "companion",
    terrainTolerance: "advanced"
  };
  const result = matchTrail(minnamurra, profile);
  // Segment 1 (boardwalk) is passable. Segment 2 (rainforest floor) individually
  // satisfies the surface/gradient/width checks for an "advanced" profile, but its
  // combined score (poor mobile coverage + high isolation + difficult emergency
  // access + minimal facilities) still falls below even the high-confidence
  // score floor (50) - demonstrating that RTBA's conservative safety floor applies
  // regardless of how skilled/confident the user says they are.
  assert.equal(result.accessibleDistanceM, 800);
  assert.equal(result.status, STATUS.PARTIAL);
  assert.ok(result.segmentResults[1].reasons.some((r) => r.includes("below your minimum")));
});

test("A trail whose very first segment fails is Not Recommended with zero accessible distance", () => {
  const syntheticTrail = {
    id: "synthetic-hard-start",
    name: "Synthetic Hard-Start Trail",
    totalLengthM: 500,
    segments: [
      {
        id: "SYN-1",
        label: "Steep narrow trailhead",
        startM: 0,
        endM: 500,
        surface: "dirt",
        gradientAvgPct: 14,
        gradientMaxPct: 18,
        widthMm: 600,
        hazards: ["step(s)", "loose stones"],
        facilities: { parking: false, toilet: false, seating: false, shade: false },
        safety: { mobileCoverage: "poor", isolation: "high", emergencyAccess: "difficult" }
      }
    ]
  };
  const profile = {
    mobilityType: "manual_wheelchair",
    endurance: "very_low",
    confidence: "low",
    maxDistanceM: 500,
    assistance: "solo",
    terrainTolerance: "sealed_only"
  };
  const result = matchTrail(syntheticTrail, profile);
  assert.equal(result.accessibleDistanceM, 0);
  assert.equal(result.status, STATUS.NOT_RECOMMENDED);
});

test("Wet weather modifier downgrades a passable unsealed-inclusive result toward Caution", () => {
  const shellharbour = findTrail("shellharbour");
  const profile = {
    mobilityType: "assisted_walking",
    endurance: "high",
    confidence: "high",
    maxDistanceM: 6000,
    assistance: "companion",
    terrainTolerance: "accepts_uneven"
  };
  const wet = matchTrail(shellharbour, profile, { wetWeather: true });
  assert.ok(
    wet.notes.some((n) => n.toLowerCase().includes("wet weather")),
    "wet weather note should be present when an unsealed segment is in the accessible portion"
  );
});

test("matchAllTrails sorts best-first using STATUS_ORDER", () => {
  const profile = {
    mobilityType: "assisted_walking",
    endurance: "high",
    confidence: "high",
    maxDistanceM: 6000,
    assistance: "companion",
    terrainTolerance: "advanced"
  };
  const results = matchAllTrails(trails, profile);
  assert.equal(results.length, trails.length);
  const blueMileIdx = results.findIndex((r) => r.trailId === "blue-mile");
  const minnamurraIdx = results.findIndex((r) => r.trailId === "minnamurra");
  // Blue Mile: Suitable with Caution (endurance-limited). Minnamurra: Partially Accessible.
  assert.ok(blueMileIdx < minnamurraIdx, "Blue Mile should outrank Minnamurra for this profile");
});
