import { Funnel } from "@phosphor-icons/react";

export default function PnlFilterBar({ filters, setFilters, options, granularity, setGranularity }) {
  const update = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <section className="border-t border-b border-slate-200 bg-slate-50" data-testid="pnl-filter-bar">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <Funnel size={16} weight="bold" className="text-slate-900" />
          <span className="overline">Slicers</span>
        </div>
        <select className="swiss-select" value={filters.region} onChange={(e) => update("region", e.target.value)} data-testid="pnl-filter-region">
          {(options.regions || []).map((r) => <option key={r} value={r}>Region · {r}</option>)}
        </select>
        <select className="swiss-select" value={filters.range} onChange={(e) => update("range", e.target.value)} data-testid="pnl-filter-range">
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
          <option value="90">Last 90 days</option>
          <option value="180">Last 180 days</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <div className="overline mr-2">Granularity</div>
          {["daily", "weekly", "monthly"].map((g) => (
            <button
              key={g}
              className={`tab-btn ${granularity === g ? "active" : ""}`}
              onClick={() => setGranularity(g)}
              data-testid={`pnl-granularity-${g}`}
            >{g}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
