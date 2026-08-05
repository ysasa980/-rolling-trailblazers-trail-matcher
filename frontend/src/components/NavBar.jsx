export default function NavBar({ view, onNavigate, hasProfile }) {
  return (
    <header className="navbar">
      <div className="container">
        <button
          className="brand"
          onClick={() => onNavigate("landing")}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <img src="/logo.png" alt="Rolling Trailblazers Australia logo" />
          <span className="brand-text">
            Rolling Trailblazers
            <small>Limits are optional</small>
          </span>
        </button>
        <nav aria-label="Primary">
          <button aria-current={view === "landing"} onClick={() => onNavigate("landing")}>Home</button>
          <button aria-current={view === "profile"} onClick={() => onNavigate("profile")}>My Profile</button>
          <button aria-current={view === "discover"} onClick={() => onNavigate("discover")} disabled={!hasProfile}>
            Discover Trails
          </button>
        </nav>
      </div>
    </header>
  );
}
