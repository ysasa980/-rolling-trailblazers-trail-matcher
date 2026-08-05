import { useEffect, useState } from "react";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";
import MiniMap from "../components/MiniMap";

export default function Discover({ profile, onOpenTrail }) {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    if (!profile) return;
    api.matchAll(profile).then((data) => setResults(data.results)).catch((e) => setError(e.message));
  }, [profile]);

  if (!profile) {
    return (
      <div className="container section">
        <div className="empty-state">Build your profile first to see trail matches.</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container section">
        <div className="card state-card is-error">
          <span className="state-icon" aria-hidden="true">⚠</span>
          <div className="state-body"><p>Couldn't load your trail matches: {error}</p></div>
        </div>
      </div>
    );
  }
  if (!results) {
    return (
      <div className="container section">
        <div className="loading-state">
          <span className="spinner" aria-hidden="true" />
          Matching your profile against the Illawarra trail set...
        </div>
      </div>
    );
  }

  const mapTrails = results.map((r) => ({ id: r.trailId, name: r.trailName, lat: r.lat, lng: r.lng, bestStatus: r.status }));

  return (
    <div className="container section">
      <div className="section-title-row">
        <h2>Your trail matches</h2>
        <span className="subtitle">Ranked best-first for your profile · {results.length} Illawarra trails</span>
      </div>

      <MiniMap trails={results.map((r) => ({ id: r.trailId, name: r.trailName, lat: r.lat, lng: r.lng, bestStatus: r.status }))} highlightedId={highlighted} onSelect={setHighlighted} />

      <div style={{ height: "1.4rem" }} />

      {results.map((r) => (
        <div key={r.trailId} className="card trail-card" style={{ marginBottom: "0.9rem" }} onMouseEnter={() => setHighlighted(r.trailId)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
            <h3>{r.trailName}</h3>
            <StatusBadge status={r.status} />
          </div>
          <p className="explanation-text">{r.explanation}</p>
          <div className="meta-row">
            <span>Total length: {(r.totalLengthM / 1000).toFixed(1)}km</span>
            <span>Accessible for you: {(r.accessibleDistanceM / 1000).toFixed(1)}km</span>
          </div>
          <div>
            <button className="btn-secondary" onClick={() => onOpenTrail(r.trailId)}>View segment breakdown</button>
          </div>
        </div>
      ))}
    </div>
  );
}
