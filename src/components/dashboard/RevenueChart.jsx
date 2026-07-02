import { useMemo } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import SwissTooltip from "./SwissTooltip";
import { fmtMoney } from "../../utils/formatters";


export default function RevenueChart({ data, granularity }) {
  const total = useMemo(() => {
  if (!data?.length) return 0;
  return data.reduce((sum, item) => sum + item.revenue, 0);
}, [data]);
  return (
    <div className="swiss-card p-6 lg:col-span-3" data-testid="revenue-chart-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="overline">Fig. 01 — Revenue Trend</div>
          <h2 className="font-display font-black text-3xl text-slate-950 mt-1 tracking-tighter">
            {fmtMoney(total)}
            <span className="ml-3 text-sm font-mono-tab text-slate-500 uppercase tracking-widest">/ {granularity}</span>
          </h2>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
          <div className="overline">Series</div>
          <div className="flex items-center gap-3 mt-2 text-xs font-mono-tab">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#002FA7]" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#FF2A2A]" /> Orders</span>
          </div>
        </div>
      </div>
      <div className="h-[340px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#002FA7" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#002FA7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="period" tickLine={false} axisLine={{ stroke: "#020617" }} interval="preserveStartEnd" minTickGap={28} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtMoney(v)} width={60} />
            <Tooltip content={<SwissTooltip />} />
            <Area type="linear" dataKey="revenue" stroke="#002FA7" strokeWidth={2} fill="url(#rev)" name="Revenue" />
            <Line type="linear" dataKey="orders" stroke="#FF2A2A" strokeWidth={1.5} dot={false} yAxisId={0} name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}