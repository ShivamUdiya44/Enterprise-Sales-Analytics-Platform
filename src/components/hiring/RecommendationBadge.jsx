const STYLES = {
  "Strong Match": { bg: "#002FA7", fg: "#ffffff" },
  "Consider": { bg: "#FFD700", fg: "#020617" },
  "Not Recommended": { bg: "#FF2A2A", fg: "#ffffff" },
};

export default function RecommendationBadge({ recommendation }) {
  const style = STYLES[recommendation] || { bg: "#e2e8f0", fg: "#020617" };
  return (
    <span
      className="inline-block px-2 py-1 text-[10px] font-mono-tab font-bold uppercase tracking-widest"
      style={{ background: style.bg, color: style.fg }}
    >
      {recommendation}
    </span>
  );
}
