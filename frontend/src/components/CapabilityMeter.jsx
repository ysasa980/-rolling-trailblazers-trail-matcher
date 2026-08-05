/**
 * A single meter: shows where a segment's actual value sits relative to the
 * user's threshold. `higherIsBetter=true` means values ABOVE the threshold
 * marker are fine (e.g. segment score, width); false means values BELOW the
 * threshold are fine (e.g. gradient).
 */
export default function CapabilityMeter({ label, actual, threshold, max, unit = "", higherIsBetter = true, ok }) {
  const clampedActual = Math.max(0, Math.min(max, actual));
  const actualPct = (clampedActual / max) * 100;
  const thresholdPct = (Math.max(0, Math.min(max, threshold)) / max) * 100;
  const colour = ok ? "var(--status-suitable)" : "var(--status-not-recommended)";

  return (
    <div className="meter-row">
      <div className="meter-label">{label}</div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${actualPct}%`, background: colour }} />
        <div className="meter-threshold" style={{ left: `${thresholdPct}%` }} title={`Your threshold: ${threshold}${unit}`} />
      </div>
      <div className="meter-value">{actual}{unit}</div>
    </div>
  );
}
