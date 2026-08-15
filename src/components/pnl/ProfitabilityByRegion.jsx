import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

import { MapPin } from "@phosphor-icons/react";
import SwissTooltip from "../dashboard/SwissTooltip";
import { fmtMoney } from "../../utils/formatters";
import { CHART_COLORS } from "../../utils/chartColors";

export default function ProfitabilityByRegion({ data }) {
  return (
    <div className="swiss-card p-6 lg:col-span-2" data-testid="profitability-region-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="overline">Fig. 03 — Region Profitability</div>
          <h3 className="font-display font-bold text-2xl text-slate-950 mt-1 tracking-tight">Profit by Region</h3>
        </div>
        <MapPin size={20} weight="bold" className="text-slate-900" />
      </div>
      <div className="h-[280px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 50, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={fmtMoney} />
            <YAxis type="category" dataKey="key" tickLine={false} axisLine={{ stroke: "#020617" }} width={130} />
            <Tooltip content={<SwissTooltip />} />
            <Bar dataKey="profit" name="Profit" barSize={22}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.profit >= 0 ? CHART_COLORS[i % CHART_COLORS.length] : "#FF2A2A"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
