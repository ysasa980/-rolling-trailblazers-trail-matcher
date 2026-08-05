/**
 * Step 4 of the sponsor's algorithm design: converts a User Capability Profile
 * into concrete thresholds that the Matching Algorithm (matcher.js) can apply
 * segment-by-segment. Mirrors the worked examples in
 * "Trail Algorithm - base assumptions" (User A / User B).
 */

const MAX_DISTANCE_TABLE_M = {
  "under_500m": 400,
  "500m_1km": 750,
  "1_3km": 1800,
  "3_5km": 4000,
  "5km_plus": 5500
};

const TERRAIN_SURFACE_TABLE = {
  "sealed_only": ["sealed", "boardwalk"],
  "sealed_firm_gravel": ["sealed", "boardwalk", "compacted gravel"],
  "accepts_uneven": ["sealed", "boardwalk", "compacted gravel", "loose gravel", "dirt"],
  "advanced": ["sealed", "boardwalk", "compacted gravel", "loose gravel", "dirt", "sand", "mud"]
};

const TERRAIN_GRADIENT_TABLE = {
  "sealed_only": 5,
  "sealed_firm_gravel": 8,
  "accepts_uneven": 12,
  "advanced": 100
};

// Minimum path width the user needs, by mobility type.
const MOBILITY_MIN_WIDTH_MM = {
  manual_wheelchair: 900,
  powered_wheelchair: 1000,
  mobility_scooter: 1000,
  assisted_walking: 700,
  limited_walking: 700,
  carer_assisted: 900
};

// Confidence -> minimum acceptable segment score (matches sponsor's worked
// examples: low confidence => 80, medium => 65).
const CONFIDENCE_MIN_SCORE = {
  low: 80,
  medium: 65,
  high: 50
};

/**
 * @param {object} profile
 *  mobilityType: manual_wheelchair | powered_wheelchair | mobility_scooter |
 *                assisted_walking | limited_walking | carer_assisted
 *  endurance: very_low | low | medium | high
 *  confidence: low | medium | high
 *  maxDistance: under_500m | 500m_1km | 1_3km | 3_5km | 5km_plus
 *  assistance: solo | companion | carer
 *  terrainTolerance: sealed_only | sealed_firm_gravel | accepts_uneven | advanced
 */
function buildThresholds(profile) {
  const allowedSurfaces = TERRAIN_SURFACE_TABLE[profile.terrainTolerance] ?? TERRAIN_SURFACE_TABLE.sealed_only;
  const maxGradientPct = TERRAIN_GRADIENT_TABLE[profile.terrainTolerance] ?? TERRAIN_GRADIENT_TABLE.sealed_only;
  const minWidthMm = MOBILITY_MIN_WIDTH_MM[profile.mobilityType] ?? 1000;
  const minSegmentScore = CONFIDENCE_MIN_SCORE[profile.confidence] ?? CONFIDENCE_MIN_SCORE.low;
  // The UI offers simple distance *buckets* (low cognitive load for users with
  // limited technical confidence), but callers may instead supply an exact
  // maxDistanceM (e.g. a precise trip plan) which always takes precedence.
  const maxDistanceM = profile.maxDistanceM ?? MAX_DISTANCE_TABLE_M[profile.maxDistance] ?? MAX_DISTANCE_TABLE_M.under_500m;

  // Steps: only ever permitted for an "advanced" terrain tolerance AND when the
  // user is not solo (conservative-by-design - the sponsor's #1 design
  // principle is "conservative rather than optimistic").
  const canManageSteps = profile.terrainTolerance === "advanced" && profile.assistance !== "solo";

  // A user is flagged as needing assistance-only recommendations when they are
  // solo AND (low confidence OR a wheeled mobility type with low/very-low endurance).
  const wheeledTypes = ["manual_wheelchair", "powered_wheelchair", "mobility_scooter"];
  const assistanceRecommended =
    profile.assistance === "solo" &&
    (profile.confidence === "low" ||
      (wheeledTypes.includes(profile.mobilityType) && ["very_low", "low"].includes(profile.endurance)));

  return {
    allowedSurfaces,
    maxGradientPct,
    minWidthMm,
    minSegmentScore,
    maxDistanceM,
    canManageSteps,
    assistanceRecommended,
    raw: profile
  };
}

module.exports = { buildThresholds, MAX_DISTANCE_TABLE_M, TERRAIN_SURFACE_TABLE, TERRAIN_GRADIENT_TABLE, CONFIDENCE_MIN_SCORE };
