/**
 * RTBA Weighted Segment Accessibility Score (0-100)
 * Implements the scoring rules defined in "Trail Algorithm - base assumptions"
 * and the "Algorithm Design Sheet" supplied by the sponsor (Jeremy Fox).
 *
 * Total = Surface(30) + Gradient(25) + Width(15) + Hazards(15) + Facilities(10) + Safety(5)
 */

function scoreSurface(surface) {
  const table = {
    "sealed": 30,
    "boardwalk": 27,
    "compacted gravel": 20,
    "loose gravel": 12,
    "dirt": 8,
    "sand": 0,
    "mud": 0
  };
  return table[surface] ?? 0;
}

function scoreGradient(gradientMaxPct) {
  // Conservative: uses the segment's MAXIMUM gradient, not the average,
  // because a short steep pinch can strand a user even if the average is gentle.
  if (gradientMaxPct <= 3) return 25;
  if (gradientMaxPct <= 5) return 20;
  if (gradientMaxPct <= 8) return 14;
  if (gradientMaxPct <= 12) return 8;
  return 0;
}

function scoreWidth(widthMm) {
  if (widthMm >= 1500) return 15;
  if (widthMm >= 1000) return 10;
  if (widthMm >= 800) return 5;
  return 0;
}

const HAZARD_PENALTIES = {
  "minor root exposure": 2,
  "bollard pinch point": 3,
  "loose stones": 4,
  "step(s)": 10,
  "gate/barrier": 8,
  "water crossing": 15
};

function scoreHazards(hazards = []) {
  let score = 15;
  for (const h of hazards) {
    score -= HAZARD_PENALTIES[h] ?? 0;
  }
  return Math.max(0, score);
}

function scoreFacilities(facilities = {}) {
  const count = ["parking", "toilet", "seating", "shade"].filter((k) => facilities[k]).length;
  if (count >= 3) return 10;
  if (count === 2) return 7;
  if (count === 1) return 4;
  return 1; // "none" still gets 0-3; we use 1 as the conservative floor
}

function scoreSafety(safety = {}) {
  const table = { good: 5, moderate: 3, poor: 0, easy: 5, difficult: 0, low: 5, medium: 3, high: 0 };
  const coverage = table[safety.mobileCoverage] ?? 0;
  const isolation = table[safety.isolation] ?? 0;
  const emergency = table[safety.emergencyAccess] ?? 0;
  // Average the three safety sub-indicators, then cap at the 0-5 weight.
  const avg = (coverage + isolation + emergency) / 3;
  return Math.round(Math.min(5, avg));
}

/**
 * Scores a single trail segment.
 * Returns the total (0-100) plus the per-factor breakdown, which the UI
 * uses to explain *why* a segment scored the way it did (sponsor feedback:
 * "why matched" / "what caused caution" logic).
 */
function scoreSegment(segment) {
  const surface = scoreSurface(segment.surface);
  const gradient = scoreGradient(segment.gradientMaxPct);
  const width = scoreWidth(segment.widthMm);
  const hazards = scoreHazards(segment.hazards);
  const facilities = scoreFacilities(segment.facilities);
  const safety = scoreSafety(segment.safety);
  const total = surface + gradient + width + hazards + facilities + safety;
  return {
    total,
    breakdown: { surface, gradient, width, hazards, facilities, safety }
  };
}

module.exports = {
  scoreSurface,
  scoreGradient,
  scoreWidth,
  scoreHazards,
  scoreFacilities,
  scoreSafety,
  scoreSegment,
  HAZARD_PENALTIES
};
