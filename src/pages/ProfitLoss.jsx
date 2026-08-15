import { useState } from "react";
import {
  CurrencyDollar,
  Receipt,
  ChartPieSlice,
  TrendUp,
} from "@phosphor-icons/react";

import Header from "../components/layout/Header";
import KpiCard from "../components/dashboard/KPICard";
import PnlFilterBar from "../components/pnl/PnlFilterBar";
import ProfitTrendChart from "../components/pnl/ProfitTrendChart";
import ExpenseBreakdownPanel from "../components/pnl/ExpenseBreakdownPanel";
import ProfitabilityByRegion from "../components/pnl/ProfitabilityByRegion";
import InsightsPanel from "../components/insights/InsightsPanel";
import { fmtMoney, fmtPct } from "../utils/formatters";
import usePnlData from "../hooks/usePnlData";

export default function ProfitLoss() {
  const [filters, setFilters] = useState({ region: "All", range: "180" });
  const [granularity, setGranularity] = useState("weekly");

  const { options, summary, trend, expenseBreakdown, profitability, loading } = usePnlData(filters, granularity);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PnlFilterBar
        filters={filters}
        setFilters={setFilters}
        options={options}
        granularity={granularity}
        setGranularity={setGranularity}
      />

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="overline">Report · 02 / Profit &amp; Loss</div>
            <h1 className="font-display font-black text-5xl lg:text-6xl tracking-tighter text-slate-950 mt-2">
              Profit <span className="italic font-light">&amp; Loss</span>
            </h1>
            <p className="text-slate-600 mt-3 max-w-xl">
              Revenue against cost, margin trend, and where profitability is concentrated — over the last {filters.range} days.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="stripe-accent w-16 h-16" />
            <div className="text-right">
              <div className="overline">Run</div>
              <div className="font-mono-tab font-bold text-slate-900">{new Date().toISOString().slice(0, 10)}</div>
              <div className="font-mono-tab text-xs text-slate-500">UTC · MERIDIAN/01</div>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="pnl-kpi-grid">
          <KpiCard
            label="Revenue"
            value={summary ? fmtMoney(summary.revenue) : "—"}
            sub="in window"
            trend={summary?.revenue_growth}
            icon={CurrencyDollar}
            accent="bg-[#002FA7] text-white"
            testid="kpi-pnl-revenue"
            index={1}
          />
          <KpiCard
            label="Expenses"
            value={summary ? fmtMoney(summary.expenses) : "—"}
            sub="in window"
            icon={Receipt}
            accent="bg-[#FF2A2A] text-white"
            testid="kpi-pnl-expenses"
            index={2}
          />
          <KpiCard
            label="Gross Profit"
            value={summary ? fmtMoney(summary.gross_profit) : "—"}
            sub="revenue − expenses"
            trend={summary?.profit_growth}
            icon={TrendUp}
            accent="bg-[#FFD700] text-slate-950"
            testid="kpi-pnl-profit"
            index={3}
          />
          <KpiCard
            label="Margin"
            value={summary ? `${summary.margin_pct.toFixed(1)}%` : "—"}
            sub={summary ? `${fmtPct(summary.margin_delta_pts)} pts vs prior` : "gross margin"}
            trend={summary?.margin_delta_pts}
            icon={ChartPieSlice}
            accent="bg-slate-950 text-white"
            testid="kpi-pnl-margin"
            index={4}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-6">
          <ProfitTrendChart data={trend} granularity={granularity} />
          <ExpenseBreakdownPanel data={expenseBreakdown} />
          <ProfitabilityByRegion data={profitability} />
          <InsightsPanel filters={{ region: filters.region, range: filters.range }} className="lg:col-span-2" />
        </section>

        <footer className="mt-14 border-t border-slate-200 pt-6 flex flex-wrap justify-between gap-4 text-xs font-mono-tab text-slate-500 uppercase tracking-widest" data-testid="pnl-footer">
          <span>© Meridian Sales Intelligence</span>
          <span>Build 1.0 · {new Date().getFullYear()}</span>
          <span>Department view is expense allocation only — sales data has no department field</span>
        </footer>

        {loading && (
          <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-3 py-2 text-[10px] font-mono-tab tracking-widest uppercase" data-testid="pnl-loading-indicator">
            ● Computing
          </div>
        )}
      </main>
    </div>
  );
}
