import { useEffect, useState } from "react";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";
import SegmentStrip from "../components/SegmentStrip";
import CapabilityMeter from "../components/CapabilityMeter";

const MODIFIER_OPTIONS = [
  { key: "wetWeather", label: "Wet weather forecast" },
  { key: "noMobileReception", label: "Concerned about mobile reception" },
  { key: "noSupportPerson", label: "No support person available today" },
  { key: "timePressure", label: "Return transport timing is tight" }
];

export default function TrailResults({ trailId, profile, onBack }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [modifiers, setModifiers] = useState({});

  useEffect(() => {
    if (!trailId || !profile) return;
    api.matchTrail(trailId, profile, modifiers).then(setResult).catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trailId, profile, JSON.stringify(modifiers)]);

  if (!trailId) return <div className="container section"><p>Choose a trail from Discover first.</p></div>;
  if (error) return <div className="container section"><p>Couldn't load this trail: {error}</p></div>;
  if (!result) return <div className="container section"><p>Running the matching algorithm...</p></div>;

  const failingSegment = result.segmentResults.find((s) => !s.passable);
  const activeSegment = result.segmentResults.find((s) => s.segmentId === selectedSegment) || failingSegment || result.segmentResults[0];

  function toggleModifier(key) {
    setModifiers((m) => ({ ...m, [key]: !m[key] }));
  }

  const heroBg = {
    "Suitable": "var(--status-suitable-bg)",
    "Suitable with Caution": "var(--status-caution-bg)",
    "Suitable with Assistance": "var(--status-assistance-bg)",
    "Partially Accessible": "var(--status-partial-bg)",
    "Not Recommended": "var(--status-not-recommended-bg)"
  }[result.status];

  return (
    <div className="container section">
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: "1rem" }}>&larr; Back to Discover</button>

      <h2 style={{ marginBottom: "0.2rem" }}>{result.trailName}</h2>
      <p className="subtitle" style={{ color: "var(--ink-soft)" }}>{result.region} · {(result.totalLengthM / 1000).toFixed(1)}km total</p>

      <div className="recommendation-hero" style={{ background: heroBg }}>
        <StatusBadge status={result.status} size="large" />
        <p className="explanation-text" style={{ marginTop: "0.8rem" }}>{result.explanation}</p>
        {result.notes.length > 0 && (
          <ul className="notes-list">
            {result.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        )}
      </div>

      <h3>Segment-by-segment breakdown</h3>
      <p className="field-hint">
        The algorithm walks this trail in order and stops at the first segment that exceeds your profile's
        thresholds. Tap a segment to see exactly why it scored the way it did.
      </p>
      <SegmentStrip
        segments={result.segmentResults}
        totalLengthM={result.totalLengthM}
        onSelectSegment={setSelectedSegment}
        selectedId={activeSegment?.segmentId}
      />

      {activeSegment && (
        <div className="card segment-detail-card" style={{ marginTop: "1.2rem", borderLeftColor: activeSegment.passable ? "var(--status-suitable)" : "var(--status-not-recommended)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3>{activeSegment.label}</h3>
            <span className="score-pill" style={{ color: activeSegment.passable ? "var(--status-suitable)" : "var(--status-not-recommended)" }}>
              {activeSegment.score}/100
            </span>
          </div>
          <p className="field-hint">{activeSegment.startM}m &ndash; {activeSegment.endM}m &middot; surface: {activeSegment.surface}</p>

          <p className="field-hint" style={{ marginTop: "0.9rem", marginBottom: "0.3rem" }}>
            <strong>Your capability vs. this segment's demand</strong> - the marker line is your threshold.
          </p>
          <CapabilityMeter
            label="Segment score"
            actual={activeSegment.score}
            threshold={result.thresholds.minSegmentScore}
            max={100}
            ok={activeSegment.score >= result.thresholds.minSegmentScore}
          />
          <CapabilityMeter
            label="Gradient"
            actual={activeSegment.gradientMaxPct}
            threshold={result.thresholds.maxGradientPct}
            max={20}
            unit="%"
            ok={activeSegment.gradientMaxPct <= result.thresholds.maxGradientPct}
          />
          <CapabilityMeter
            label="Path width"
            actual={activeSegment.widthMm}
            threshold={result.thresholds.minWidthMm}
            max={3200}
            unit="mm"
            ok={activeSegment.widthMm >= result.thresholds.minWidthMm}
          />

          {!activeSegment.passable && (
            <div className="reasons">
              <strong>Why this stopped the algorithm:</strong>
              <ul className="notes-list">
                {activeSegment.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
          {activeSegment.hazards.length > 0 && (
            <p className="field-hint">Recorded hazards: {activeSegment.hazards.join(", ")}</p>
          )}
        </div>
      )}

      <h3 style={{ marginTop: "2rem" }}>Trip-day conditions</h3>
      <p className="field-hint">These don't change the trail - they change today's recommendation.</p>
      <div className="trip-modifiers">
        {MODIFIER_OPTIONS.map((m) => (
          <label key={m.key}>
            <input type="checkbox" checked={!!modifiers[m.key]} onChange={() => toggleModifier(m.key)} />
            {m.label}
          </label>
        ))}
      </div>
    </div>
  );
}
