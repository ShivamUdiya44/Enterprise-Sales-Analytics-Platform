import { useState } from "react";
import { Users, Star, Target } from "@phosphor-icons/react";

import Header from "../components/layout/Header";
import KpiCard from "../components/dashboard/KPICard";
import HiringFilterBar from "../components/hiring/HiringFilterBar";
import CandidateRankingTable from "../components/hiring/CandidateRankingTable";
import ScoreBreakdownPanel from "../components/hiring/ScoreBreakdownPanel";
import useHiringData from "../hooks/useHiringData";

export default function Hiring() {
  const [filters, setFilters] = useState({ role: "All", department: "All", minScore: "" });
  const [selected, setSelected] = useState(null);

  const { items, roles, loading } = useHiringData(filters);

  const avgScore = items.length ? items.reduce((sum, c) => sum + c.composite_score, 0) / items.length : 0;
  const strongMatches = items.filter((c) => c.recommendation === "Strong Match").length;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HiringFilterBar filters={filters} setFilters={setFilters} roles={roles} />

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="overline">Report · 04 / Hiring</div>
            <h1 className="font-display font-black text-5xl lg:text-6xl tracking-tighter text-slate-950 mt-2">
              Candidate <span className="italic font-light">Ranking</span>
            </h1>
            <p className="text-slate-600 mt-3 max-w-xl">
              Candidates scored against a transparent, weighted rubric — experience, skill match, test score, and education.
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

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5" data-testid="hiring-kpi-grid">
          <KpiCard
            label="Candidates"
            value={loading ? "—" : String(items.length)}
            sub="in pool"
            icon={Users}
            accent="bg-[#002FA7] text-white"
            testid="kpi-candidate-count"
            index={1}
          />
          <KpiCard
            label="Avg Match Score"
            value={loading ? "—" : avgScore.toFixed(1)}
            sub="out of 100"
            icon={Target}
            accent="bg-[#FFD700] text-slate-950"
            testid="kpi-avg-score"
            index={2}
          />
          <KpiCard
            label="Strong Matches"
            value={loading ? "—" : String(strongMatches)}
            sub="score ≥ 80"
            icon={Star}
            accent="bg-slate-950 text-white"
            testid="kpi-strong-matches"
            index={3}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-6">
          <CandidateRankingTable data={items} selectedId={selected?.candidate_id} onSelect={setSelected} />
          <ScoreBreakdownPanel candidate={selected} />
        </section>

        <footer className="mt-14 border-t border-slate-200 pt-6 flex flex-wrap justify-between gap-4 text-xs font-mono-tab text-slate-500 uppercase tracking-widest" data-testid="hiring-footer">
          <span>© Meridian Sales Intelligence</span>
          <span>Build 1.0 · {new Date().getFullYear()}</span>
          <span>Weights: experience 30% · skill match 35% · test score 25% · education 10%</span>
        </footer>

        {loading && (
          <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-3 py-2 text-[10px] font-mono-tab tracking-widest uppercase" data-testid="hiring-loading-indicator">
            ● Computing
          </div>
        )}
      </main>
    </div>
  );
}
