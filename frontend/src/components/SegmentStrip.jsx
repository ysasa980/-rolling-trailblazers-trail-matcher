const COLOUR_HEX = { green: "#2d6a4f", amber: "#a8631c", red: "#9a3b3b" };

/**
 * The platform's "secret sauce" visual (sponsor's own words, response_to_PPT.docx):
 * a proportional, colour-coded strip showing exactly which segments are
 * accessible for THIS user, and where the algorithm stops. Used on both the
 * Trail Detail screen (generic trail view) and the Results screen (matched
 * to the current profile).
 */
export default function SegmentStrip({ segments, totalLengthM, onSelectSegment, selectedId }) {
  return (
    <div>
      <div className="segment-strip" role="img" aria-label="Trail segment accessibility breakdown">
        {segments.map((seg) => {
          const widthPct = (seg.lengthM / totalLengthM) * 100;
          return (
            <button
              key={seg.segmentId}
              className="seg-block"
              style={{
                width: `${widthPct}%`,
                background: COLOUR_HEX[seg.colour],
                border: selectedId === seg.segmentId ? "3px solid var(--ink)" : "none",
                cursor: "pointer"
              }}
              onClick={() => onSelectSegment && onSelectSegment(seg.segmentId)}
              title={`${seg.label}: ${seg.lengthM}m`}
              aria-pressed={selectedId === seg.segmentId}
            >
              {widthPct > 12 ? `${seg.lengthM}m` : ""}
            </button>
          );
        })}
      </div>
      <div className="segment-legend">
        <span><span className="dot" style={{ background: COLOUR_HEX.green }} /> Accessible for your profile</span>
        <span><span className="dot" style={{ background: COLOUR_HEX.amber }} /> Accessible, borderline score</span>
        <span><span className="dot" style={{ background: COLOUR_HEX.red }} /> Exceeds your thresholds</span>
      </div>
    </div>
  );
}
