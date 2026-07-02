import { ChartBar, ArrowRight } from "@phosphor-icons/react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-950 flex items-center justify-center" data-testid="brand-logo">
            <ChartBar size={20} weight="bold" color="#FFD700" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-black text-lg tracking-tighter text-slate-950">MERIDIAN/01</div>
            <div className="overline text-[9px]">Sales Intelligence</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 ml-6 text-xs">
          <span className="overline">Workspace</span>
          <ArrowRight size={12} className="text-slate-400 mx-1" />
          <span className="font-semibold text-slate-900">Q4 / Performance Review</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-200">
            <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
            <span className="overline text-[10px]">Live · 180d</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
  S
</div>
        </div>
      </div>
      {/* Marquee strip */}
      <div className="border-t border-slate-200 bg-slate-950 text-white overflow-hidden">
        <div className="flex whitespace-nowrap marquee py-1.5 text-[10px] font-mono-tab tracking-widest">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex">
              {[
                "▲ NA +12.4% MoM",
                "■ APAC PEAK · WEEK 47",
                "● EU SOFT · -3.1% WoW",
                "▲ ELECTRONICS LEADS CAT MIX 38%",
                "◆ AOV $312.55",
                "▲ TOP SKU · AEROPODS PRO",
                "■ NEW HIGH · DAILY ORDERS 642",
                "● LATAM RISING · +8.9%",
              ].map((t, i) => (
                <span key={i} className="px-8 opacity-80">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}