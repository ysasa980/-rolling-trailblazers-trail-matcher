import { useState } from "react";

const STEPS = [
  { key: "mobilityType", title: "What's your mobility type?", optionsKey: "mobilityType" },
  { key: "endurance", title: "How would you describe your endurance today?", optionsKey: "endurance" },
  { key: "confidence", title: "How confident do you feel on unfamiliar trails?", optionsKey: "confidence" },
  { key: "terrainTolerance", title: "What terrain are you comfortable on?", optionsKey: "terrainTolerance" },
  { key: "maxDistance", title: "What's the furthest round trip you're comfortable with today?", optionsKey: "maxDistance" },
  { key: "assistance", title: "Will you have support with you?", optionsKey: "assistance" }
];

export default function ProfileBuilder({ options, profile, onSave, onCancel }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(profile || {});

  if (!options) return <p>Loading profile options...</p>;

  const current = STEPS[step];
  const choices = options[current.optionsKey] || [];
  const value = draft[current.key];

  function choose(v) {
    setDraft((d) => ({ ...d, [current.key]: v }));
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const finalProfile = { ...draft };
      // resolve maxDistance bucket -> metres for the matching engine
      const bucket = options.maxDistance.find((o) => o.value === finalProfile.maxDistance);
      finalProfile.maxDistanceM = bucket ? bucket.metres : 500;
      onSave(finalProfile);
    }
  }

  function back() {
    if (step === 0) {
      onCancel && onCancel();
    } else {
      setStep((s) => s - 1);
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <div className="progress-steps" aria-hidden="true">
        {STEPS.map((s, i) => (
          <div key={s.key} className="step" data-done={i <= step} />
        ))}
      </div>
      <h2>{current.title}</h2>
      <p className="field-hint">Step {step + 1} of {STEPS.length}. You can change this any time from "My Profile".</p>

      <div className="option-grid" role="group" aria-label={current.title}>
        {choices.map((opt) => (
          <button
            key={opt.value}
            className="option-card"
            aria-pressed={value === opt.value}
            onClick={() => choose(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.7rem", marginTop: "2rem" }}>
        <button className="btn-ghost" onClick={back}>{step === 0 ? "Cancel" : "Back"}</button>
        <button className="btn-primary" disabled={!value} onClick={next}>
          {step === STEPS.length - 1 ? "See my trail matches" : "Next"}
        </button>
      </div>
    </div>
  );
}
