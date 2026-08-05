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

  useEffect(() => {
    api.getOptions().then(setOptions).catch((e) => setApiError(e.message));
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
            <div className="card" style={{ borderColor: "var(--status-not-recommended)" }}>
              Couldn't reach the RTBA API at <code>/api</code>: {apiError}. Is the backend running on port 4000?
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
