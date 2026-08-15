import { Funnel } from "@phosphor-icons/react";

export default function HiringFilterBar({ filters, setFilters, roles }) {
  const update = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <section className="border-t border-b border-slate-200 bg-slate-50" data-testid="hiring-filter-bar">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <Funnel size={16} weight="bold" className="text-slate-900" />
          <span className="overline">Slicers</span>
        </div>
        <select className="swiss-select" value={filters.role} onChange={(e) => update("role", e.target.value)} data-testid="hiring-filter-role">
          {(roles || ["All"]).map((r) => <option key={r} value={r}>Role · {r}</option>)}
        </select>
        <select className="swiss-select" value={filters.minScore} onChange={(e) => update("minScore", e.target.value)} data-testid="hiring-filter-min-score">
          <option value="">Any score</option>
          <option value="80">Score ≥ 80 · Strong Match</option>
          <option value="60">Score ≥ 60 · Consider+</option>
        </select>
      </div>
    </section>
  );
}
