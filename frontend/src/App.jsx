import { useEffect, useState } from "react";
import { api } from "./api";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import ProfileBuilder from "./pages/ProfileBuilder";
import Discover from "./pages/Discover";
import TrailResults from "./pages/TrailResults";

export default function App() {
  const [view, setView] = useState("landing");
  const [options, setOptions] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedTrailId, setSelectedTrailId] = useState(null);
  const [apiError, setApiError] = useState(null);

  function loadOptions() {
    setApiError(null);
    api.getOptions().then(setOptions).catch((e) => setApiError(e.message));
  }

  useEffect(() => {
    loadOptions();
  }, []);

  function handleNavigate(next) {
    setView(next);
  }

  function handleSaveProfile(p) {
    setProfile(p);
    setView("discover");
  }

  function handleOpenTrail(id) {
    setSelectedTrailId(id);
    setView("trailResults");
  }

  return (
    <div className="app-shell">
      <NavBar view={view} onNavigate={handleNavigate} hasProfile={!!profile} />
      <main className="app-main">
        {apiError && (
          <div className="container" style={{ marginTop: "1rem" }}>
            <div className="card state-card is-error">
              <span className="state-icon" aria-hidden="true">⚠</span>
              <div className="state-body">
                <p>
                  <strong>We couldn't reach the RTBA service.</strong> This can happen if the service has
                  been idle and is waking back up - it usually resolves within a few seconds.
                </p>
                <button className="btn-secondary" onClick={loadOptions}>Try again</button>
              </div>
            </div>
          </div>
        )}

        {view === "landing" && <Landing onNavigate={handleNavigate} hasProfile={!!profile} />}
        {view === "profile" && (
          <ProfileBuilder
            options={options}
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={() => setView("landing")}
          />
        )}
        {view === "discover" && <Discover profile={profile} onOpenTrail={handleOpenTrail} />}
        {view === "trailResults" && (
          <TrailResults trailId={selectedTrailId} profile={profile} onBack={() => setView("discover")} />
        )}
      </main>
      <Footer />
    </div>
  );
}
