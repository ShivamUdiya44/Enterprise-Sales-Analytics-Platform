import { useState } from "react";
import axios from "axios";
import { CloudArrowUp } from "@phosphor-icons/react";

import Header from "../components/layout/Header";
import DropZone from "../components/upload/DropZone";
import UploadResultsPanel from "../components/upload/UploadResultsPanel";
import SchemaReferencePanel from "../components/upload/SchemaReferencePanel";
import { API } from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dryRun, setDryRun] = useState(true);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!file) return;

    setSubmitting(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/upload/workbook`, formData, {
        params: { dry_run: dryRun },
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed — check the file and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="overline">Report · 05 / Data Ingestion</div>
            <h1 className="font-display font-black text-5xl lg:text-6xl tracking-tighter text-slate-950 mt-2">
              Upload <span className="italic font-light">Data</span>
            </h1>
            <p className="text-slate-600 mt-3 max-w-xl">
              Upload a multi-sheet .xlsx workbook — Sales, Expenses, Employees, Candidates. Each sheet is validated independently.
            </p>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <DropZone file={file} setFile={setFile} />

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 text-xs font-mono-tab text-slate-600 uppercase tracking-widest cursor-pointer">
                <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} data-testid="upload-dry-run-toggle" />
                Dry run (preview only, no write to database)
              </label>

              <button
                className="tab-btn flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!file || submitting}
                data-testid="upload-submit-btn"
              >
                <CloudArrowUp size={14} weight="bold" />
                {submitting ? "Uploading…" : dryRun ? "Preview" : "Upload"}
              </button>
            </div>

            {error && (
              <div className="mt-4 swiss-card p-4 text-xs font-mono-tab" style={{ borderLeft: "4px solid #FF2A2A" }} data-testid="upload-error">
                {error}
              </div>
            )}

            <UploadResultsPanel result={result} />
          </div>

          <SchemaReferencePanel />
        </section>

        <footer className="mt-14 border-t border-slate-200 pt-6 flex flex-wrap justify-between gap-4 text-xs font-mono-tab text-slate-500 uppercase tracking-widest" data-testid="upload-footer">
          <span>© Meridian Sales Intelligence</span>
          <span>Build 1.0 · {new Date().getFullYear()}</span>
          <span>Re-uploads upsert by ID — safe to re-run</span>
        </footer>
      </main>
    </div>
  );
}
