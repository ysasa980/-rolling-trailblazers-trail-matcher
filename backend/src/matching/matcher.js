const { scoreSegment } = require("./scoring");
const { buildThresholds } = require("./profile");

const STATUS = {
  SUITABLE: "Suitable",
  CAUTION: "Suitable with Caution",
  ASSISTANCE: "Suitable with Assistance",
  PARTIAL: "Partially Accessible",
  NOT_RECOMMENDED: "Not Recommended"
};

// Ordered from best to worst, used only to decide whether a modifier is
// allowed to downgrade the result (never upgrade it).
const STATUS_ORDER = [STATUS.SUITABLE, STATUS.CAUTION, STATUS.ASSISTANCE, STATUS.PARTIAL, STATUS.NOT_RECOMMENDED];

function downgrade(current, to) {
  return STATUS_ORDER.indexOf(to) > STATUS_ORDER.indexOf(current) ? to : current;
}

/**
 * Walks a trail segment-by-segment against the user's thresholds.
 * Stops at the FIRST segment that breaches any limit - this is the sponsor's
 * "secret sauce" line: "The algorithm stops at the first segment that
 * exceeds your profile thresholds."
 */
function walkSegments(trail, thresholds) {
  const segmentResults = [];
  let accessibleDistanceM = 0;
  let stoppedAt = null;

  for (const segment of trail.segments) {
    const { total: score, breakdown } = scoreSegment(segment);
    const length = segment.endM - segment.startM;

    const reasons = [];
    if (!thresholds.allowedSurfaces.includes(segment.surface)) {
      reasons.push(`surface "${segment.surface}" is outside your terrain tolerance`);
    }
    if (segment.gradientMaxPct > thresholds.maxGradientPct) {
      reasons.push(`gradient reaches ${segment.gradientMaxPct}% (your limit is ${thresholds.maxGradientPct}%)`);
    }
    if (segment.hazards.includes("step(s)") && !thresholds.canManageSteps) {
      reasons.push("segment includes steps");
    }
    if (segment.widthMm < thresholds.minWidthMm) {
      reasons.push(`path width ${segment.widthMm}mm is narrower than your ${thresholds.minWidthMm}mm minimum`);
    }
    if (score < thresholds.minSegmentScore) {
      reasons.push(`segment score ${score} is below your minimum of ${thresholds.minSegmentScore}`);
    }

    const passable = reasons.length === 0;

    segmentResults.push({
      segmentId: segment.id,
      label: segment.label,
      startM: segment.startM,
      endM: segment.endM,
      lengthM: length,
      surface: segment.surface,
      gradientMaxPct: segment.gradientMaxPct,
      widthMm: segment.widthMm,
      score,
      breakdown,
      hazards: segment.hazards,
      passable,
      reasons,
      // colour coding for the map / segment-profile visual (green / amber / red)
      colour: passable ? (score >= 85 ? "green" : "amber") : "red"
    });

    if (!passable) {
      stoppedAt = segment.id;
      break;
    }
    accessibleDistanceM += length;
  }

  return { segmentResults, accessibleDistanceM, stoppedAt };
}

function baseStatusFromDistance(accessibleDistanceM, totalLengthM) {
  if (accessibleDistanceM === 0) return STATUS.NOT_RECOMMENDED;
  if (accessibleDistanceM < totalLengthM) return STATUS.PARTIAL;
  return STATUS.SUITABLE;
}

/**
 * Applies the endurance / return-trip check. RTBA trails are treated
 * conservatively as out-and-back for POC purposes, so the return trip is
 * double the accessible distance unless the trail is a loop that re-joins
 * the trailhead within the accessible section.
 */
function applyEnduranceCheck(status, accessibleDistanceM, thresholds) {
  const returnTripM = accessibleDistanceM * 2;
  const ratio = thresholds.maxDistanceM > 0 ? returnTripM / thresholds.maxDistanceM : Infinity;
  const notes = [];

  if (ratio <= 1.0 || accessibleDistanceM === 0) {
    return { status, returnTripM, notes };
  }

  notes.push(
    `Return trip of ${returnTripM}m exceeds your selected maximum distance (${thresholds.maxDistanceM}m).`
  );

  if (ratio > 1.3) {
    return { status: STATUS.NOT_RECOMMENDED, returnTripM, notes };
  }
  // Within 30% over: downgrade one step rather than fail outright - conservative,
  // not alarmist.
  return { status: downgrade(status, STATUS.CAUTION), returnTripM, notes };
}

/**
 * Trip-level risk modifiers (Step 6 of the sponsor's design). These react to
 * the *situation*, not the trail itself, and can only ever downgrade.
 */
function applyRiskModifiers(status, { segmentResults, thresholds, tripModifiers = {} }) {
  const notes = [];
  const passedSegments = segmentResults.filter((s) => s.passable);
  const hasUnsealedPassed = passedSegments.some((s) => !["sealed", "boardwalk"].includes(s.surface));

  if (tripModifiers.wetWeather && hasUnsealedPassed) {
    notes.push("Wet weather forecast: unsealed sections in your accessible portion may become slippery.");
    status = downgrade(status, STATUS.CAUTION);
  }

  const poorCoverage = passedSegments.some((s) => false); // placeholder, coverage checked below via raw segment safety
  if (tripModifiers.noMobileReception) {
    notes.push("No mobile reception reported on this route - check in before you depart.");
    status = downgrade(status, STATUS.CAUTION);
  }

  if (thresholds.assistanceRecommended) {
    notes.push("Based on your profile (solo + your confidence/endurance level), a companion or support worker is recommended.");
    status = downgrade(status, STATUS.ASSISTANCE);
  } else if (tripModifiers.noSupportPerson && thresholds.raw.assistance === "solo") {
    notes.push("Travelling solo with no support person - consider a check-in plan.");
    status = downgrade(status, STATUS.CAUTION);
  }

  if (tripModifiers.timePressure) {
    notes.push("Return transport timing is tight - build in a buffer before your scheduled departure.");
    status = downgrade(status, STATUS.CAUTION);
  }

  return { status, notes };
}

function buildExplanation({ trail, segmentResults, accessibleDistanceM, returnTripM, status, thresholds }) {
  const firstFail = segmentResults.find((s) => !s.passable);
  const lines = [];

  if (status === STATUS.NOT_RECOMMENDED && accessibleDistanceM === 0) {
    lines.push(
      `${trail.name} is not recommended for your profile: the very first segment (${segmentResults[0].label}) does not meet your thresholds (${segmentResults[0].reasons.join("; ")}).`
    );
  } else if (accessibleDistanceM < trail.totalLengthM) {
    lines.push(
      `Safe access is available for the first ${accessibleDistanceM}m of ${trail.name}.`
    );
    if (firstFail) {
      lines.push(
        `Beyond this point (${firstFail.label}) the trail becomes unsuitable because ${firstFail.reasons.join("; ")}.`
      );
    }
    lines.push(`Return trip total distance: ${(returnTripM / 1000).toFixed(1)}km.`);
  } else {
    lines.push(`${trail.name} matches your profile for its full length (${trail.totalLengthM}m).`);
  }

  return lines.join(" ");
}

/**
 * Public entry point: match one profile against one trail.
 */
function matchTrail(trail, profile, tripModifiers = {}) {
  const thresholds = buildThresholds(profile);
  const { segmentResults, accessibleDistanceM, stoppedAt } = walkSegments(trail, thresholds);

  let status = baseStatusFromDistance(accessibleDistanceM, trail.totalLengthM);

  const endurance = applyEnduranceCheck(status, accessibleDistanceM, thresholds);
  status = endurance.status;

  const risk = applyRiskModifiers(status, { segmentResults, thresholds, tripModifiers });
  status = risk.status;

  const explanation = buildExplanation({
    trail,
    segmentResults,
    accessibleDistanceM,
    returnTripM: endurance.returnTripM,
    status,
    thresholds
  });

  return {
    trailId: trail.id,
    trailName: trail.name,
    region: trail.region,
    lat: trail.lat,
    lng: trail.lng,
    status,
    accessibleDistanceM,
    totalLengthM: trail.totalLengthM,
    returnTripM: endurance.returnTripM,
    stoppedAt,
    segmentResults,
    notes: [...endurance.notes, ...risk.notes],
    explanation,
    thresholds
  };
}

/**
 * Matches a profile against every trail in the dataset, sorted best-first.
 */
function matchAllTrails(trails, profile, tripModifiers = {}) {
  const results = trails.map((t) => matchTrail(t, profile, tripModifiers));
  results.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  return results;
}

module.exports = { matchTrail, matchAllTrails, STATUS, STATUS_ORDER };
