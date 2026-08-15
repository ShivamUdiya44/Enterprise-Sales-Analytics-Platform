import RecommendationBadge from "./RecommendationBadge";

const LABELS = {
  experience: "Experience",
  skill_match: "Skill Match",
  test_score: "Test Score",
  education: "Education",
};

export default function ScoreBreakdownPanel({ candidate }) {
  if (!candidate) {
    return (
      <div className="swiss-card p-6 lg:col-span-1 flex items-center justify-center" data-testid="score-breakdown-card">
        <div className="text-xs font-mono-tab text-slate-400 uppercase tracking-widest text-center">
          Select a candidate to see the scoring rubric
        </div>
      </div>
    );
  }

  return (
    <div className="swiss-card p-6 lg:col-span-1" data-testid="score-breakdown-card">
      <div className="overline">Fig. 02 — Rubric</div>
      <h3 className="font-display font-bold text-xl text-slate-950 mt-1 tracking-tight">{candidate.name}</h3>
      <p className="text-xs text-slate-500 mt-1">{candidate.applied_role}</p>

      <div className="mt-4">
        <RecommendationBadge recommendation={candidate.recommendation} />
        <div className="font-display font-black text-4xl text-slate-950 mt-3 tabular-nums tracking-tighter">
          {candidate.composite_score}
          <span className="text-base font-normal text-slate-400"> / 100</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {Object.entries(candidate.sub_scores).map(([key, value]) => (
          <div key={key}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-900 uppercase tracking-wider">{LABELS[key] || key}</span>
              <span className="font-mono-tab text-slate-500">weight {(candidate.weights[key] * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-1.5 h-2 bg-slate-100 relative">
              <div className="h-full bg-[#002FA7]" style={{ width: `${value * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-mono-tab text-slate-400 uppercase tracking-widest mt-6">
        Deterministic weighted rubric — no AI/ML involved
      </p>
    </div>
  );
}
