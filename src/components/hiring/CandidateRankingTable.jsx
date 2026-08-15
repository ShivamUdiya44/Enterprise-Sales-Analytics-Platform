import RecommendationBadge from "./RecommendationBadge";

export default function CandidateRankingTable({ data, selectedId, onSelect }) {
  return (
    <div className="swiss-card overflow-hidden lg:col-span-3" data-testid="candidate-ranking-card">
      <div className="p-6 pb-3 flex items-center justify-between">
        <div>
          <div className="overline">Fig. 01 — Applicant Pool</div>
          <h3 className="font-display font-bold text-2xl text-slate-950 mt-1 tracking-tight">Candidate Ranking</h3>
        </div>
        <div className="text-xs font-mono-tab text-slate-500 uppercase tracking-widest">{data.length} candidates</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              {["Rank", "Candidate", "Role", "Experience", "Score", "Recommendation"].map((h) => (
                <th key={h} className="px-6 py-3 overline">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono-tab">
            {data.map((c, i) => (
              <tr
                key={c.candidate_id}
                onClick={() => onSelect(c)}
                className={`border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer ${selectedId === c.candidate_id ? "bg-slate-50" : ""}`}
                data-testid={`candidate-row-${i}`}
              >
                <td className="px-6 py-3 text-slate-500">{c.rank}</td>
                <td className="px-6 py-3 text-slate-900 font-semibold">{c.name}</td>
                <td className="px-6 py-3 text-slate-700">{c.applied_role}</td>
                <td className="px-6 py-3 text-slate-700">{c.years_experience}y</td>
                <td className="px-6 py-3 font-bold text-slate-950">{c.composite_score}</td>
                <td className="px-6 py-3"><RecommendationBadge recommendation={c.recommendation} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="px-6 py-8 text-xs font-mono-tab text-slate-400 uppercase tracking-widest">No candidates match these filters</div>
        )}
      </div>
    </div>
  );
}
