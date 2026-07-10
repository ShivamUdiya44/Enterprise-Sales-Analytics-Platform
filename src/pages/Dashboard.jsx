import Header from "../components/layout/Header";
import KpiCard from "../components/dashboard/KPICard";
import { fmtMoney, fmtNum } from "../utils/formatters";
import FilterBar from "../components/dashboard/FilterBar";
import RevenueChart from "../components/dashboard/RevenueChart";
import CategoriesPanel from "../components/dashboard/CategoriesPanel";
import RegionsChart from "../components/dashboard/RegionsChart";
import TopProducts from "../components/dashboard/TopProducts";
import RecentOrders from "../components/dashboard/RecentOrders";
import { exportCSV } from "../utils/exportCSV";
import useDashboardData from "../hooks/useDashboardData";


import { useState } from "react";
import {
    ShoppingCart,
    CurrencyDollar,
    Package,
    ArrowUpRight,
} from "@phosphor-icons/react";

export default function Dashboard() {
  const [filters, setFilters] = useState({ region: "All", category: "All", product: "All", range: "180" });
  const [granularity, setGranularity] = useState("weekly");

    const {
    options,
    kpis,
    trend,
    categories,
    regions,
    topProducts,
    orders,
    loading
} = useDashboardData(filters, granularity);





  return (
    <div className="min-h-screen bg-white">
      <Header />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        options={options}
        granularity={granularity}
        setGranularity={setGranularity}
        onExport={() => exportCSV(orders)}
      />

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        {/* Title block */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="overline">Report · 01 / Sales Dashboard</div>
            <h1 className="font-display font-black text-5xl lg:text-6xl tracking-tighter text-slate-950 mt-2">
              Business <span className="italic font-light">Performance</span>
            </h1>
            <p className="text-slate-600 mt-3 max-w-xl">
              A control-room view of revenue, orders, products and regions — updated against the last {filters.range} days of activity.
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

        {/* KPI grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="kpi-grid">
          <KpiCard
            label="Total Revenue"
            value={kpis ? fmtMoney(kpis.revenue) : "—"}
            sub={`${fmtNum(kpis?.units_sold)} units · ${filters.range}d`}
            trend={kpis?.revenue_growth}
            icon={CurrencyDollar}
            accent="bg-[#002FA7] text-white"
            testid="kpi-revenue"
            index={1}
          />
          <KpiCard
            label="Total Orders"
            value={kpis ? fmtNum(kpis.orders) : "—"}
            sub="orders in window"
            trend={kpis?.orders_growth}
            icon={ShoppingCart}
            accent="bg-[#FF2A2A] text-white"
            testid="kpi-orders"
            index={2}
          />
          <KpiCard
            label="Avg Order Value"
            value={kpis ? `$${kpis.aov.toFixed(2)}` : "—"}
            sub="AOV per order"
            trend={kpis ? (kpis.revenue_growth - kpis.orders_growth) : 0}
            icon={Package}
            accent="bg-[#FFD700] text-slate-950"
            testid="kpi-aov"
            index={3}
          />
          <KpiCard
            label="Units Sold"
            value={kpis ? fmtNum(kpis.units_sold) : "—"}
            sub="across all SKUs"
            trend={kpis?.orders_growth}
            icon={ArrowUpRight}
            accent="bg-slate-950 text-white"
            testid="kpi-units"
            index={4}
          />
        </section>

        {/* Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-6">
          <RevenueChart data={trend} granularity={granularity} />
          <CategoriesPanel data={categories} />
          <RegionsChart data={regions} />
          <TopProducts data={topProducts} />
          <RecentOrders data={orders} />
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-slate-200 pt-6 flex flex-wrap justify-between gap-4 text-xs font-mono-tab text-slate-500 uppercase tracking-widest" data-testid="footer">
          <span>© Meridian Sales Intelligence</span>
          <span>Build 1.0 · {new Date().getFullYear()}</span>
          <span>Data: synthetic · 180-day window</span>
        </footer>

        {loading && (
          <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-3 py-2 text-[10px] font-mono-tab tracking-widest uppercase" data-testid="loading-indicator">
            ● Computing
          </div>
        )}
      </main>
    </div>
  );
}


