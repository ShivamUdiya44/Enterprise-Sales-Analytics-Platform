import { WarningOctagon, Warning, CheckCircle, Info } from "@phosphor-icons/react";
import useInsights from "../../hooks/useInsights";

const SEVERITY = {
  critical: { icon: WarningOctagon, color: "#FF2A2A", label: "Critical" },
  warning: { icon: Warning, color: "#B8860B", label: "Warning" },
  positive: { icon: CheckCircle, color: "#002FA7", label: "Positive" },
  info: { icon: Info, color: "#64748b", label: "Info" },
};

export default function InsightsPanel({ filters, className = "" }) {
  const { items, loading } = useInsights(filters);

  return (
    <div className={`swiss-card p-6 ${className}`} data-testid="insights-card">
      <div className="overline">Fig. 06 — Automated Findings</div>
      <h3 className="font-display font-bold text-xl text-slate-950 mt-1 tracking-tight">Insights</h3>
      <p className="text-xs text-slate-500 mt-1">Statistical rules over current filters — not AI-generated.</p>

      <div className="mt-5 space-y-3">
        {loading && <div className="text-xs font-mono-tab text-slate-400 uppercase tracking-widest">Computing…</div>}

        {!loading && items.length === 0 && (
          <div className="text-xs font-mono-tab text-slate-400 uppercase tracking-widest">No notable findings in this window</div>
        )}

        {items.map((item, i) => {
          const meta = SEVERITY[item.severity] || SEVERITY.info;
          const Icon = meta.icon;
          return (
            <div key={i} className="flex gap-3 border-t border-slate-100 pt-3 first:border-t-0 first:pt-0" data-testid={`insight-row-${i}`}>
              <Icon size={18} weight="fill" style={{ color: meta.color }} className="shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{item.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
