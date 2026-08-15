import { CheckCircle, WarningOctagon } from "@phosphor-icons/react";

export default function UploadResultsPanel({ result }) {
  if (!result) return null;

  return (
    <div className="mt-6 space-y-4" data-testid="upload-results-panel">
      {result.unmapped_sheets?.length > 0 && (
        <div className="swiss-card p-4 flex items-center gap-3 text-xs font-mono-tab" style={{ borderLeft: "4px solid #B8860B" }}>
          <span>Unmapped sheets ignored: {result.unmapped_sheets.join(", ")}</span>
        </div>
      )}

      {result.sheets.map((sheet) => (
        <div key={sheet.sheet_key} className="swiss-card p-6" data-testid={`upload-sheet-${sheet.sheet_key}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {sheet.errors.length === 0
                ? <CheckCircle size={20} weight="fill" className="text-[#002FA7]" />
                : <WarningOctagon size={20} weight="fill" className="text-[#FF2A2A]" />}
              <h3 className="font-display font-bold text-lg text-slate-950 capitalize">{sheet.sheet_key}</h3>
              <span className="text-xs font-mono-tab text-slate-500">({sheet.matched_sheet_name})</span>
            </div>
            <div className="text-xs font-mono-tab text-slate-500 uppercase tracking-widest">
              {sheet.rows_inserted} / {sheet.rows_total} rows {result.dry_run ? "validated" : "inserted"}
            </div>
          </div>

          {sheet.errors.length > 0 && (
            <div className="mt-3 space-y-1">
              {sheet.errors.slice(0, 10).map((err, i) => (
                <div key={i} className="text-xs font-mono-tab text-[#FF2A2A]">✕ {err}</div>
              ))}
              {sheet.errors.length > 10 && (
                <div className="text-xs font-mono-tab text-slate-400">…and {sheet.errors.length - 10} more</div>
              )}
            </div>
          )}

          {sheet.warnings.length > 0 && (
            <div className="mt-2 space-y-1">
              {sheet.warnings.map((warn, i) => (
                <div key={i} className="text-xs font-mono-tab" style={{ color: "#B8860B" }}>⚠ {warn}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
