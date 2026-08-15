import { useState } from "react";
import useSWR from "swr";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { API, fetcher } from "../../services/api";

function SheetSpec({ sheet }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-slate-100 first:border-t-0" data-testid={`schema-sheet-${sheet.sheet_key}`}>
      <button
        className="w-full flex items-center justify-between py-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-semibold text-slate-900 capitalize">{sheet.sheet_key}</span>
        <div className="flex items-center gap-2 text-xs font-mono-tab text-slate-500">
          <span>{sheet.accepted_sheet_names.join(" / ")}</span>
          {open ? <CaretDown size={14} /> : <CaretRight size={14} />}
        </div>
      </button>
      {open && (
        <table className="w-full text-xs mb-3">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pr-4 py-1 font-normal">Column</th>
              <th className="pr-4 py-1 font-normal">Accepted headers</th>
              <th className="pr-4 py-1 font-normal">Required</th>
              <th className="py-1 font-normal">Type</th>
            </tr>
          </thead>
          <tbody className="font-mono-tab">
            {sheet.columns.map((col) => (
              <tr key={col.name} className="border-t border-slate-50">
                <td className="pr-4 py-1 font-semibold text-slate-900">{col.name}</td>
                <td className="pr-4 py-1 text-slate-600">{col.accepted_headers.join(", ")}</td>
                <td className="pr-4 py-1">{col.required ? "yes" : "no"}</td>
                <td className="py-1 text-slate-600">{col.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function SchemaReferencePanel() {
  const { data } = useSWR([`${API}/upload/schema`, {}], fetcher);

  return (
    <div className="swiss-card p-6" data-testid="schema-reference-card">
      <div className="overline">Reference</div>
      <h3 className="font-display font-bold text-xl text-slate-950 mt-1 tracking-tight">Expected Sheet Schema</h3>
      <p className="text-xs text-slate-500 mt-1">Sheets and columns the workbook is validated against.</p>

      <div className="mt-4">
        {(data?.sheets ?? []).map((sheet) => (
          <SheetSpec key={sheet.sheet_key} sheet={sheet} />
        ))}
      </div>
    </div>
  );
}
