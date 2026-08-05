const STATUS_STYLE = {
  "Suitable": { fg: "var(--status-suitable)", bg: "var(--status-suitable-bg)", icon: "check" },
  "Suitable with Caution": { fg: "var(--status-caution)", bg: "var(--status-caution-bg)", icon: "alert" },
  "Suitable with Assistance": { fg: "var(--status-assistance)", bg: "var(--status-assistance-bg)", icon: "hand" },
  "Partially Accessible": { fg: "var(--status-partial)", bg: "var(--status-partial-bg)", icon: "half" },
  "Not Recommended": { fg: "var(--status-not-recommended)", bg: "var(--status-not-recommended-bg)", icon: "cross" }
};

function Icon({ name, colour }) {
  const stroke = colour;
  switch (name) {
    case "check":
      return <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "alert":
      return <svg viewBox="0 0 24 24" fill="none"><path d="M12 4l9 16H3z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" /><path d="M12 10v4" stroke={stroke} strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="17" r="0.9" fill={stroke} /></svg>;
    case "hand":
      return <svg viewBox="0 0 24 24" fill="none"><circle cx="7" cy="8" r="3" stroke={stroke} strokeWidth="2" /><circle cx="17" cy="8" r="3" stroke={stroke} strokeWidth="2" /><path d="M3 20c0-3 2-5 4-5s4 2 4 5M13 20c0-3 2-5 4-5s4 2 4 5" stroke={stroke} strokeWidth="2" strokeLinecap="round" /></svg>;
    case "half":
      return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" /><path d="M12 3a9 9 0 010 18z" fill={stroke} /></svg>;
    case "cross":
      return <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" /></svg>;
    default:
      return null;
  }
}

export default function StatusBadge({ status, size = "normal" }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE["Not Recommended"];
  return (
    <span
      className="status-badge"
      style={{
        color: style.fg,
        background: style.bg,
        fontSize: size === "large" ? "1rem" : undefined,
        padding: size === "large" ? "0.6rem 1.1rem" : undefined
      }}
    >
      <Icon name={style.icon} colour={style.fg} />
      {status}
    </span>
  );
}

export { STATUS_STYLE };
