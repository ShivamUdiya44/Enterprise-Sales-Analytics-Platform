import { useMemo } from "react";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import SwissTooltip from "../dashboard/SwissTooltip";
import { fmtMoney } from "../../utils/formatters";

export default function ProfitTrendChart({ data, granularity }) {
  const totalProfit = useMemo(() => {
    if (!data?.length) return 0;
    return data.reduce((sum, item) => sum + item.profit, 0);
  }, [data]);

  return (
    <div className="swiss-card p-6 lg:col-span-3" data-testid="profit-trend-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="overline">Fig. 01 — Profit Trend</div>
          <h2 className="font-display font-black text-3xl text-slate-950 mt-1 tracking-tighter">
            {fmtMoney(totalProfit)}
            <span className="ml-3 text-sm font-mono-tab text-slate-500 uppercase tracking-widest">/ {granularity}</span>
          </h2>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
          <div className="overline">Series</div>
          <div className="flex items-center gap-3 mt-2 text-xs font-mono-tab">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#002FA7]" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#FF2A2A]" /> Expenses</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#FFD700]" /> Profit</span>
          </div>
        </div>
      </div>
      <div className="h-[340px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="period" tickLine={false} axisLine={{ stroke: "#020617" }} interval="preserveStartEnd" minTickGap={28} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtMoney(v)} width={60} />
            <Tooltip content={<SwissTooltip />} />
            <Bar dataKey="revenue" fill="#002FA7" name="Revenue" barSize={16} />
            <Bar dataKey="expenses" fill="#FF2A2A" name="Expenses" barSize={16} />
            <Line type="linear" dataKey="profit" stroke="#B8860B" strokeWidth={2.5} dot={false} name="Profit" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
