import { fmtMoney } from "../../utils/formatters";

export default function SwissTooltip({ active, payload, label, valueFormatter = fmtMoney }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-slate-900 px-3 py-2 font-mono-tab text-[11px]">
      <div className="font-bold text-slate-900 mb-1 uppercase tracking-wider">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2" style={{ background: p.color }} />
          <span className="text-slate-600 uppercase">{p.name}</span>
          <span className="ml-auto font-bold text-slate-900">{valueFormatter(p.value)}</span>
        </div>
      ))}
    </div>
  );
}