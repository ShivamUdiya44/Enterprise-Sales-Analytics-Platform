export const fmtMoney = (n) => {
  if (n == null) return "—";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Number(n).toFixed(0)}`;
};
export const fmtNum = (n) => new Intl.NumberFormat("en-US").format(n ?? 0);
export const fmtPct = (n) => `${n >= 0 ? "+" : ""}${(n ?? 0).toFixed(1)}%`;