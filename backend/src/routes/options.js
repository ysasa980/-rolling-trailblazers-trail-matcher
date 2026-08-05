const express = require("express");
const { MAX_DISTANCE_TABLE_M } = require("../matching/profile");

const router = express.Router();

// GET /api/options - static reference data for the Profile Builder form.
// Keeping this server-driven (rather than hardcoded in the frontend) is one of
// the POC's "future hooks": a national rollout can extend these lists (e.g. new
// mobility aid types) without a frontend release.
router.get("/", (req, res) => {
  res.json({
    mobilityType: [
      { value: "manual_wheelchair", label: "Manual wheelchair" },
      { value: "powered_wheelchair", label: "Powered wheelchair" },
      { value: "mobility_scooter", label: "Mobility scooter" },
      { value: "assisted_walking", label: "Assisted walking" },
      { value: "limited_walking", label: "Limited walking" },
      { value: "carer_assisted", label: "Carer-assisted" }
    ],
    endurance: [
      { value: "very_low", label: "Very low" },
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ],
    confidence: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ],
    maxDistance: Object.keys(MAX_DISTANCE_TABLE_M).map((key) => ({
      value: key,
      label: key.replace(/_/g, " ").replace("plus", "+"),
      metres: MAX_DISTANCE_TABLE_M[key]
    })),
    assistance: [
      { value: "solo", label: "Solo" },
      { value: "companion", label: "With a companion" },
      { value: "carer", label: "With a carer / support worker" }
    ],
    terrainTolerance: [
      { value: "sealed_only", label: "Sealed surfaces only" },
      { value: "sealed_firm_gravel", label: "Sealed + firm gravel" },
      { value: "accepts_uneven", label: "Accepts uneven ground" },
      { value: "advanced", label: "Advanced / experienced" }
    ],
    tripModifiers: [
      { value: "wetWeather", label: "Wet weather forecast" },
      { value: "noMobileReception", label: "Concerned about mobile reception" },
      { value: "noSupportPerson", label: "No support person available today" },
      { value: "timePressure", label: "Return transport timing is tight" }
    ]
  });
});

module.exports = router;
