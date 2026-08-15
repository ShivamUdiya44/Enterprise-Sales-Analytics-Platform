import { useRef, useState } from "react";
import { FileXls, UploadSimple } from "@phosphor-icons/react";

export default function DropZone({ file, setFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div
      className={`swiss-card p-10 text-center cursor-pointer transition-colors ${dragging ? "bg-slate-50" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      data-testid="upload-dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xlsm"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        data-testid="upload-file-input"
      />
      {file ? (
        <>
          <FileXls size={40} weight="bold" className="mx-auto text-[#002FA7]" />
          <div className="mt-3 font-display font-bold text-lg text-slate-950">{file.name}</div>
          <div className="text-xs font-mono-tab text-slate-500 mt-1 uppercase tracking-widest">
            {(file.size / 1024).toFixed(1)} KB · click to change
          </div>
        </>
      ) : (
        <>
          <UploadSimple size={40} weight="bold" className="mx-auto text-slate-400" />
          <div className="mt-3 font-display font-bold text-lg text-slate-950">Drop your .xlsx workbook here</div>
          <div className="text-xs font-mono-tab text-slate-500 mt-1 uppercase tracking-widest">
            or click to browse · Sales, Expenses, Employees, Candidates sheets
          </div>
        </>
      )}
    </div>
  );
}
