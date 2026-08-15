function List({ title, figure, items, accent }) {
  return (
    <div className="swiss-card p-6" data-testid={`${title.toLowerCase()}-performers-card`}>
      <div className="overline">{figure}</div>
      <h3 className="font-display font-bold text-xl text-slate-950 mt-1 tracking-tight">{title} Performers</h3>
      <div className="mt-5 space-y-3">
        {items.map((e) => (
          <div key={e.employee_id} className="flex items-center justify-between border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
            <div>
              <div className="text-sm font-semibold text-slate-900">{e.name}</div>
              <div className="text-[10px] font-mono-tab text-slate-500 uppercase tracking-widest">{e.department}</div>
            </div>
            <div className="font-mono-tab font-bold text-sm" style={{ color: accent }}>{e.productivity_score}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs font-mono-tab text-slate-400 uppercase tracking-widest">No data in this window</div>
        )}
      </div>
    </div>
  );
}

export default function TopBottomPerformers({ top, bottom }) {
  return (
    <>
      <List title="Top" figure="Fig. 02 — Leaders" items={top} accent="#002FA7" />
      <List title="Bottom" figure="Fig. 03 — Needs Attention" items={bottom} accent="#FF2A2A" />
    </>
  );
}
