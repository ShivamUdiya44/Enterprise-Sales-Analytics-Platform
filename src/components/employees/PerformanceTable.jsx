import { fmtMoney } from "../../utils/formatters";

export default function PerformanceTable({ data }) {
  return (
    <div className="swiss-card overflow-hidden lg:col-span-4" data-testid="performance-table-card">
      <div className="p-6 pb-3 flex items-center justify-between">
        <div>
          <div className="overline">Fig. 04 — Roster</div>
          <h3 className="font-display font-bold text-2xl text-slate-950 mt-1 tracking-tight">Employee Performance</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tab text-slate-500 uppercase tracking-widest">
          {data.length} employees
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              {["Rank", "Employee", "Department", "Region", "Revenue", "Orders", "Tasks", "Score"].map((h) => (
                <th key={h} className="px-6 py-3 overline">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono-tab">
            {data.map((e, i) => (
              <tr key={e.employee_id} className="border-t border-slate-100 hover:bg-slate-50/60" data-testid={`employee-row-${i}`}>
                <td className="px-6 py-3 text-slate-500">{e.rank}</td>
                <td className="px-6 py-3 text-slate-900 font-semibold">{e.name}</td>
                <td className="px-6 py-3 text-slate-700">{e.department}</td>
                <td className="px-6 py-3 text-slate-700">{e.region || "—"}</td>
                <td className="px-6 py-3 text-slate-900">{fmtMoney(e.revenue_generated)}</td>
                <td className="px-6 py-3 text-slate-700">{e.orders_handled}</td>
                <td className="px-6 py-3 text-slate-700">{e.tasks_completed}</td>
                <td className="px-6 py-3 font-bold text-slate-950">{e.productivity_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
