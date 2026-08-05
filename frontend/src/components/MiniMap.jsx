import { STATUS_STYLE } from "./StatusBadge";

// Illawarra bounding box used purely for illustrative pin placement.
const BOUNDS = { latMin: -34.72, latMax: -34.30, lngMin: 150.72, lngMax: 150.93 };
const W = 420, H = 300;

function project(lat, lng) {
  const x = ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * (W - 60) + 30;
  const y = ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * (H - 40) + 20;
  return { x, y };
}

/**
 * Illustrative regional overview - NOT a geocoded street map. This is a
 * deliberate Semester 1 scope decision (see A4 report s.5): it satisfies the
 * "visual trail display + entry point" base requirement without depending on
 * a live map-tile provider, while the segment strip (the platform's real
 * differentiator) carries the detailed accessibility visualisation. Full
 * Leaflet/Google Maps integration is planned for A5.
 */
export default function MiniMap({ trails, highlightedId, onSelect }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Illustrative map of Illawarra POC trail locations" style={{ width: "100%", height: "auto", background: "var(--forest-light)", borderRadius: "var(--radius)" }}>
      <path d={`M 20 20 L 60 40 L 40 90 L 80 150 L 60 220 L 90 280 L 40 280 L 20 20 Z`} fill="#cfe6da" opacity="0.6" />
      <text x={W - 10} y={H - 10} textAnchor="end" fontSize="10" fill="var(--ink-soft)">Illustrative overview - not to scale</text>
      {trails.map((t) => {
        const { x, y } = project(t.lat, t.lng);
        const style = STATUS_STYLE[t.bestStatus] || STATUS_STYLE["Not Recommended"];
        const isActive = highlightedId === t.id;
        return (
          <g key={t.id} transform={`translate(${x},${y})`} style={{ cursor: "pointer" }} onClick={() => onSelect && onSelect(t.id)}>
            <circle r={isActive ? 10 : 7} fill={style.fg} stroke="white" strokeWidth="2" />
            {isActive && (
              <text y="-14" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">{t.name.split("(")[0].trim()}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
