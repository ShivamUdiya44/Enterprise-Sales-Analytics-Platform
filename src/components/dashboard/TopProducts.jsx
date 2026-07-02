import { Storefront } from "@phosphor-icons/react";
import { fmtMoney } from "../../utils/formatters";

export default function TopProducts({ data }) {
  return (
    <div className="swiss-card p-6 lg:col-span-2" data-testid="top-products-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="overline">Fig. 04 — SKU Performance</div>
          <h3 className="font-display font-bold text-2xl text-slate-950 mt-1 tracking-tight">Top Selling Products</h3>
        </div>
        <Storefront size={20} weight="bold" className="text-slate-900" />
      </div>
      <div className="mt-4 divide-y divide-slate-200">
        {data.map((p, i) => (
          <div key={p.product} className="py-3 flex items-center gap-4" data-testid={`product-row-${i}`}>
            <span className="font-mono-tab text-[11px] text-slate-400 w-8">0{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-950 truncate">{p.product}</div>
              <div className="text-[10px] font-mono-tab text-slate-500 uppercase tracking-widest">
                {p.category} · {p.units} units
              </div>
            </div>
            <div className="hidden sm:block w-32 h-1.5 bg-slate-100">
              <div
                className="h-full bg-slate-950"
                style={{ width: `${(p.revenue / data[0].revenue) * 100}%` }}
              />
            </div>
            <div className="font-mono-tab font-bold text-slate-900 w-24 text-right">{fmtMoney(p.revenue)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}