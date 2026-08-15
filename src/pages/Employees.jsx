import { useState } from "react";
import {
  Users,
  Trophy,
  TrendUp,
  Buildings,
} from "@phosphor-icons/react";

import Header from "../components/layout/Header";
import KpiCard from "../components/dashboard/KPICard";
import EmployeeFilterBar from "../components/employees/EmployeeFilterBar";
import PerformanceTable from "../components/employees/PerformanceTable";
import TopBottomPerformers from "../components/employees/TopBottomPerformers";
import DepartmentBarChart from "../components/employees/DepartmentBarChart";
import { fmtMoney } from "../utils/formatters";
import useEmployeeData from "../hooks/useEmployeeData";

export default function Employees() {
  const [filters, setFilters] = useState({ department: "All", region: "All", range: "180" });

  const { options, performance, topPerformers, bottomPerformers, departments, loading } = useEmployeeData(filters);

  const headcount = performance.length;
  const totalRevenue = departments.reduce((sum, d) => sum + d.total_revenue, 0);
  const avgRevenuePerEmployee = headcount ? totalRevenue / headcount : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <EmployeeFilterBar filters={filters} setFilters={setFilters} options={options} />

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="overline">Report · 03 / Employee Performance</div>
            <h1 className="font-display font-black text-5xl lg:text-6xl tracking-tighter text-slate-950 mt-2">
              Team <span className="italic font-light">Performance</span>
            </h1>
            <p className="text-slate-600 mt-3 max-w-xl">
              Productivity and output across staff, ranked within the current filters — over the last {filters.range} days.
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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="employee-kpi-grid">
          <KpiCard
            label="Headcount"
            value={loading ? "—" : String(headcount)}
            sub="active employees"
            icon={Users}
            accent="bg-[#002FA7] text-white"
            testid="kpi-headcount"
            index={1}
          />
          <KpiCard
            label="Revenue / Employee"
            value={loading ? "—" : fmtMoney(avgRevenuePerEmployee)}
            sub="average across roster"
            icon={TrendUp}
            accent="bg-[#FFD700] text-slate-950"
            testid="kpi-revenue-per-employee"
            index={2}
          />
          <KpiCard
            label="Top Performer"
            value={topPerformers[0]?.name || "—"}
            sub={topPerformers[0] ? `Score ${topPerformers[0].productivity_score}` : "no data"}
            icon={Trophy}
            accent="bg-slate-950 text-white"
            testid="kpi-top-performer"
            index={3}
          />
          <KpiCard
            label="Departments"
            value={loading ? "—" : String(departments.length)}
            sub="in roster"
            icon={Buildings}
            accent="bg-[#FF2A2A] text-white"
            testid="kpi-departments"
            index={4}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-6">
          <DepartmentBarChart data={departments} />
          <TopBottomPerformers top={topPerformers} bottom={bottomPerformers} />
          <PerformanceTable data={performance} />
        </section>

        <footer className="mt-14 border-t border-slate-200 pt-6 flex flex-wrap justify-between gap-4 text-xs font-mono-tab text-slate-500 uppercase tracking-widest" data-testid="employees-footer">
          <span>© Meridian Sales Intelligence</span>
          <span>Build 1.0 · {new Date().getFullYear()}</span>
          <span>Productivity score: weighted composite (revenue 60% · orders 20% · tasks 20%)</span>
        </footer>

        {loading && (
          <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-3 py-2 text-[10px] font-mono-tab tracking-widest uppercase" data-testid="employees-loading-indicator">
            ● Computing
          </div>
        )}
      </main>
    </div>
  );
}
