import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell
} from "recharts";

import { MapPin } from "@phosphor-icons/react";
import SwissTooltip from "./SwissTooltip";
import { fmtMoney } from "../../utils/formatters";
import { CHART_COLORS } from "../../utils/chartColors";

export default function RegionsChart({ data }) {
  return (
    <div className="swiss-card p-6 lg:col-span-2" data-testid="regions-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="overline">Fig. 03 — Region Comparison</div>
          <h3 className="font-display font-bold text-2xl text-slate-950 mt-1 tracking-tight">Region-wise Sales</h3>
        </div>
        <MapPin size={20} weight="bold" className="text-slate-900" />
      </div>
      <div className="h-[280px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 50, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={fmtMoney} />
            <YAxis type="category" dataKey="region" tickLine={false} axisLine={{ stroke: "#020617" }} width={130} />
            <Tooltip content={<SwissTooltip />} />
            <Bar dataKey="revenue" name="Revenue" barSize={22}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}