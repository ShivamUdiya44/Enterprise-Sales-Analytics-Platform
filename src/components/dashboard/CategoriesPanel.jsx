import { fmtMoney } from "../../utils/formatters";
import { CHART_COLORS } from "../../utils/chartColors";

export default function CategoriesPanel({ data }) {
  const max = data.length
    ? Math.max(...data.map(d => d.revenue))
    : 1;
  return (
    <div className="swiss-card p-6" data-testid="categories-card">
      <div className="overline">Fig. 02 — Category Mix</div>
      <h3 className="font-display font-bold text-xl text-slate-950 mt-1 tracking-tight">Top Categories</h3>
      <div className="mt-5 space-y-4">
        {data.map((c, i) => (
          <div key={c.category} data-testid={`category-row-${i}`}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-900 uppercase tracking-wider">{c.category}</span>
              <span className="font-mono-tab text-slate-900 font-bold">{fmtMoney(c.revenue)}</span>
            </div>
            <div className="mt-1.5 h-2 bg-slate-100 relative">
              <div
                className="h-full"
                style={{ width: `${(c.revenue / max) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] font-mono-tab text-slate-500 uppercase tracking-widest">
              <span>{c.orders} orders</span>
              <span>0{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}