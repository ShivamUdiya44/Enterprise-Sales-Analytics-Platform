import { Funnel, Download } from "@phosphor-icons/react";


export default function FilterBar({ filters, setFilters, options, granularity, setGranularity, onExport }) {
    const update = (key, value) =>
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
  return (
    <section className="border-t border-b border-slate-200 bg-slate-50" data-testid="filter-bar">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <Funnel size={16} weight="bold" className="text-slate-900" />
          <span className="overline">Slicers</span>
        </div>
        <select className="swiss-select" value={filters.region} onChange={(e) => update("region", e.target.value)} data-testid="filter-region">
          {(options.regions || []).map((r) => <option key={r} value={r}>Region · {r}</option>)}
        </select>
        <select className="swiss-select" value={filters.category} onChange={(e) => update("category", e.target.value)} data-testid="filter-category">
          {(options.categories || []).map((r) => <option key={r} value={r}>Category · {r}</option>)}
        </select>
        <select className="swiss-select" value={filters.product} onChange={(e) => update("product", e.target.value)} data-testid="filter-product">
          {(options.products || []).map((r) => <option key={r} value={r}>Product · {r}</option>)}
        </select>
        <select className="swiss-select" value={filters.range} onChange={(e) => update("range", e.target.value)} data-testid="filter-range">
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
              data-testid={`granularity-${g}`}
            >{g}</button>
          ))}
          <button
            className="tab-btn flex items-center gap-2"
            onClick={onExport}
            data-testid="export-btn"
          >
            <Download size={12} weight="bold" /> Export
          </button>
        </div>
      </div>
    </section>
  );
}