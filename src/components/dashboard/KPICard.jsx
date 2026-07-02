import { TrendUp, TrendDown } from "@phosphor-icons/react";
import { fmtPct } from "../../utils/formatters";

export default function KpiCard({ label, value, sub, trend, icon: Icon, accent, testid, index }) {
  const positive = trend >= 0;
  return (
    <div
      className="swiss-card swiss-card-interactive p-5 relative"
      data-testid={testid}
    >
      <div className="flex items-start justify-between">
        <div className="overline">{label}</div>
        <div className={`w-8 h-8 flex items-center justify-center ${accent}`}>
          <Icon size={16} weight="bold" />
        </div>
      </div>
      <div className="mt-6 font-display font-black text-4xl lg:text-5xl text-slate-950 tabular-nums tracking-tighter">
        {value}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-slate-500 font-mono-tab uppercase tracking-widest">{sub}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold ${positive ? "kpi-trend-up" : "kpi-trend-down"}`}>
            {positive ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
            {fmtPct(trend)}
          </div>
        )}
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent.includes("klein") ? "#002FA7" : accent.includes("red") ? "#FF2A2A" : accent.includes("gold") ? "#FFD700" : "#020617" }} />
      <div className="absolute bottom-1 right-2 font-mono-tab text-[9px] text-slate-300">0{index}</div>
    </div>
  );
}