export default function Landing({ onNavigate, hasProfile }) {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="eyebrow">Illawarra Proof of Concept</div>
          <h1>Find out exactly how far you can go - and where the trail stops being safe for you.</h1>
          <p className="lede">
            Rolling Trailblazers Australia matches your capability profile against six Illawarra trails,
            segment by segment, so you get a straight answer instead of a guess.
          </p>
          <div className="cta-row">
            <button className="btn-primary" onClick={() => onNavigate("profile")}>
              {hasProfile ? "Update my profile" : "Build my profile"}
            </button>
            {hasProfile && (
              <button className="btn-secondary" style={{ background: "transparent", color: "white", borderColor: "white" }} onClick={() => onNavigate("discover")}>
                See my trail matches
              </button>
            )}
          </div>
          <div className="tagline-strip">
            <span className="big">LIMITS ARE OPTIONAL</span>
            <span className="small">Different Wheels. Same Challenge.</span>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-title-row">
          <h2>Why this exists</h2>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Accessible ≠ binary</h3>
            <p>
              A trail marked "wheelchair accessible" can still hide loose gravel, steep pinches, or steps.
              We break every trail into segments and score each one honestly.
            </p>
          </div>
          <div className="card">
            <h3>Conservative by design</h3>
            <p>
              If we're not sure, we under-recommend. A false positive can strand someone - so RTBA always
              errs toward the safer answer.
            </p>
          </div>
          <div className="card">
            <h3>Built with you, not just for you</h3>
            <p>
              Your mobility type, endurance, confidence and support all shape the recommendation - it's
              matched to you, not a generic accessibility label.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-title-row">
          <h2>How matching works</h2>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>1. Your profile</h3>
            <p>Six quick questions - mobility type, endurance, confidence, terrain tolerance, distance, and support.</p>
          </div>
          <div className="card">
            <h3>2. Segment scoring</h3>
            <p>Every trail is scored segment-by-segment on surface, gradient, width, hazards, facilities and safety.</p>
          </div>
          <div className="card">
            <h3>3. Your recommendation</h3>
            <p>The algorithm walks the trail in order and stops at the first segment that exceeds your thresholds.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
