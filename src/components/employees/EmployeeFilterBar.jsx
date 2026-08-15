import { Funnel } from "@phosphor-icons/react";

export default function EmployeeFilterBar({ filters, setFilters, options }) {
  const update = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <section className="border-t border-b border-slate-200 bg-slate-50" data-testid="employee-filter-bar">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <Funnel size={16} weight="bold" className="text-slate-900" />
          <span className="overline">Slicers</span>
        </div>
        <select className="swiss-select" value={filters.department} onChange={(e) => update("department", e.target.value)} data-testid="employee-filter-department">
          {(options.departments || ["All"]).map((d) => <option key={d} value={d}>Department · {d}</option>)}
        </select>
        <select className="swiss-select" value={filters.region} onChange={(e) => update("region", e.target.value)} data-testid="employee-filter-region">
          {(options.regions || ["All"]).map((r) => <option key={r} value={r}>Region · {r}</option>)}
        </select>
        <select className="swiss-select" value={filters.range} onChange={(e) => update("range", e.target.value)} data-testid="employee-filter-range">
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
          <option value="90">Last 90 days</option>
          <option value="180">Last 180 days</option>
        </select>
      </div>
    </section>
  );
}
