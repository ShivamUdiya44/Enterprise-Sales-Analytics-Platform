import { fmtMoney } from "../../utils/formatters";
import { CHART_COLORS } from "../../utils/chartColors";

export default function ExpenseBreakdownPanel({ data }) {
  const max = data.length
    ? Math.max(...data.map(d => d.amount))
    : 1;
  return (
    <div className="swiss-card p-6" data-testid="expense-breakdown-card">
      <div className="overline">Fig. 02 — Cost Mix</div>
      <h3 className="font-display font-bold text-xl text-slate-950 mt-1 tracking-tight">Expense Breakdown</h3>
      <div className="mt-5 space-y-4">
        {data.map((e, i) => (
          <div key={e.expense_category} data-testid={`expense-row-${i}`}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-900 uppercase tracking-wider">{e.expense_category}</span>
              <span className="font-mono-tab text-slate-900 font-bold">{fmtMoney(e.amount)}</span>
            </div>
            <div className="mt-1.5 h-2 bg-slate-100 relative">
              <div
                className="h-full"
                style={{ width: `${(e.amount / max) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] font-mono-tab text-slate-500 uppercase tracking-widest">
              <span>{e.share_pct}% of total</span>
              <span>0{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
