import { useEffect, useState } from "react";
import Toast from "../shared/Toast.tsx";

type Counts = {
  untracked: number;
  staged: number;
  deleted: number;
  ahead: number;
};
type GitFiles = {
  untracked: string[];
  staged: string[];
  deleted: string[];
};

export default function GitOverview({
  branch: initialBranch,
  counts: initialCounts,
  onClose,
}: {
  branch?: string;
  counts?: Counts;
  onClose?: () => void;
}) {
  const [branch, setBranch] = useState(initialBranch || "");
  const [counts, setCounts] = useState<Counts>(
    initialCounts || { untracked: 0, staged: 0, deleted: 0, ahead: 0 },
  );
  const [files, setFiles] = useState<GitFiles>({
    untracked: [],
    staged: [],
    deleted: [],
  });
  const [log, setLog] = useState<string[]>([]);
  const [logLimit, setLogLimit] = useState(5);
  const [logLoading, setLogLoading] = useState(false);
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" | "info" }
  >(null);
  const [loading, setLoading] = useState({
    add: false,
    commit: false,
    push: false,
    checkout: false,
  });

  async function fetchLog(limit: number) {
    setLogLoading(true);
    try {
      const res = await fetch(`/api/git/log?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch log");
      const data = await res.json();
      setLog(data.log || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLogLoading(false);
    }
  }

  async function handleLoadMore() {
    const newLimit = logLimit + 5;
    setLogLimit(newLimit);
    await fetchLog(newLimit);
  }

  async function refresh() {
    try {
      const res = await fetch("/api/git/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      const data = await res.json();
      setBranch(data.branch || "");
      if (data.counts) setCounts(data.counts);
      if (data.files) setFiles(data.files);
      // We'll fetch log separately or just sync the initial one
      if (data.log) setLog(data.log);
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not refresh git status", type: "error" });
    }
  }

  useEffect(() => {
    refresh();
    fetchLog(logLimit);
  }, []);

  async function handleAdd() {
    setLoading((s) => ({ ...s, add: true }));
    try {
      const res = await fetch("/api/git/add", { method: "POST" });
      const data = await res.json();
      setToast({ message: data.output || "Added changes", type: "success" });
      await refresh();
    } catch (err) {
      console.error(err);
      setToast({ message: "Add failed", type: "error" });
    } finally {
      setLoading((s) => ({ ...s, add: false }));
    }
  }

  async function handleCommit() {
    const msg = globalThis.prompt?.(
      "Commit message:",
      "update posts from dashboard",
    );
    if (msg === null) return;
    setLoading((s) => ({ ...s, commit: true }));
    try {
      const res = await fetch("/api/git/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setToast({ message: data.output || "Committed", type: "success" });
      await refresh();
    } catch (err) {
      console.error(err);
      setToast({ message: "Commit failed", type: "error" });
    } finally {
      setLoading((s) => ({ ...s, commit: false }));
    }
  }

  async function handleUnstage() {
    setLoading((s) => ({ ...s, commit: true }));
    try {
      const res = await fetch("/api/git/unstage", { method: "POST" });
      const data = await res.json();
      setToast({ message: data.output || "Unstaged changes", type: "success" });
      await refresh();
    } catch (err) {
      console.error(err);
      setToast({ message: "Unstage failed", type: "error" });
    } finally {
      setLoading((s) => ({ ...s, commit: false }));
    }
  }

  async function handlePush() {
    setLoading((s) => ({ ...s, push: true }));
    try {
      const res = await fetch("/api/git/push", { method: "POST" });
      const data = await res.json();
      setToast({ message: data.output || "Pushed", type: "success" });
      await refresh();
    } catch (err) {
      console.error(err);
      setToast({ message: "Push failed", type: "error" });
    } finally {
      setLoading((s) => ({ ...s, push: false }));
    }
  }

  async function handleCheckout() {
    const b = globalThis.prompt?.("Checkout branch:", branch || "");
    if (!b) return;
    setLoading((s) => ({ ...s, checkout: true }));
    try {
      const res = await fetch("/api/git/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch: b }),
      });
      const data = await res.json();
      setToast({ message: data.output || `Checked out ${b}`, type: "success" });
      await refresh();
    } catch (err) {
      console.error(err);
      setToast({ message: "Checkout failed", type: "error" });
    } finally {
      setLoading((s) => ({ ...s, checkout: false }));
    }
  }

  const c = counts || { untracked: 0, staged: 0, deleted: 0, ahead: 0 };

  return (
    <div className="flex flex-col gap-6 p-2 sm:p-0">
      {onClose && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Git Status
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all flex items-center gap-2"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>
      )}
      {/* Unified Header: Branch & Push Status */}
      <div className="p-4 rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-100/10 dark:border-gray-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">
              Current Branch
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xl font-black text-indigo-400">
                {branch || "..."}
              </span>
              <button
                type="button"
                onClick={handleCheckout}
                className="p-1 rounded-md hover:bg-white/10 text-gray-500 hover:text-indigo-400 transition-colors"
                title="Switch Branch"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-100/10 hidden md:block"></div>
          <div className="flex flex-col">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">
              Sync Status
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                <span className="font-mono font-bold text-sky-400 text-sm leading-none">
                  {c.ahead}
                </span>
                <span className="text-[9px] uppercase font-black text-sky-500/70 tracking-tighter">
                  Ahead
                </span>
              </div>
              <span className="hidden xl:inline text-[11px] text-gray-500 italic">
                commits to push
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={loading.push || c.ahead === 0}
          onClick={handlePush}
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-30 disabled:grayscale text-white font-bold transition-all shadow-lg shadow-sky-900/40 active:scale-95 flex items-center justify-center gap-2"
        >
          {loading.push
            ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                </circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                >
                </path>
              </svg>
            )
            : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          <span className="text-sm">
            {loading.push ? "Pushing..." : "Push to Origin"}
          </span>
        </button>
      </div>

      {/* Main Layout: Changes & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Untracked & Deleted & Staged stacked in 3 rows */}
        <div className="flex flex-col gap-6">
          {/* 1. Untracked / Modified */}
          <div className="rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-100/10 dark:border-gray-800/50 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-100/10 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/5 dark:bg-gray-800/20">
              <h3 className="font-bold flex items-center gap-2 text-gray-100 text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                </span>
                Untracked
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                  {c.untracked}
                </span>
              </h3>
            </div>
            <div className="p-5 bg-black/[0.02] dark:bg-white/[0.02] min-h-[100px] max-h-[200px] overflow-y-auto custom-scrollbar">
              {files.untracked.length > 0
                ? (
                  <ul className="space-y-1">
                    {files.untracked.map((f) => (
                      <li
                        key={f}
                        className="p-2.5 text-[11px] font-mono truncate rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                )
                : (
                  <div className="h-full min-h-[80px] flex flex-col items-center justify-center p-4 text-center text-gray-600 text-[11px] italic">
                    Clean
                  </div>
                )}
            </div>
          </div>

          {/* 2. Deleted (Not Staged) */}
          <div className="rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-100/10 dark:border-gray-800/50 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-100/10 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/5 dark:bg-gray-800/20">
              <h3 className="font-bold flex items-center gap-2 text-gray-100 text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                </span>
                Deleted
                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-mono">
                  {c.deleted}
                </span>
              </h3>
            </div>
            <div className="p-5 bg-black/[0.02] dark:bg-white/[0.02] min-h-[100px] max-h-[200px] overflow-y-auto custom-scrollbar">
              {files.deleted.length > 0
                ? (
                  <ul className="space-y-1">
                    {files.deleted.map((f) => (
                      <li
                        key={f}
                        className="p-2.5 text-[11px] font-mono truncate rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                )
                : (
                  <div className="h-full min-h-[80px] flex flex-col items-center justify-center p-4 text-center text-gray-600 text-[11px] italic">
                    No deletions
                  </div>
                )}
            </div>
            {(c.untracked > 0 || c.deleted > 0) && (
              <div className="p-4 bg-gray-50/5 dark:bg-black/20 border-t border-gray-100/10 dark:border-gray-800/50 mt-auto">
                <button
                  type="button"
                  disabled={loading.add || (c.untracked === 0 && c.deleted === 0)}
                  onClick={handleAdd}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 disabled:grayscale text-white font-bold transition-all text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20"
                >
                  Add All Changes
                </button>
              </div>
            )}
          </div>

          {/* 3. Staged Files */}
          <div className="rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-100/10 dark:border-gray-800/50 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-100/10 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/5 dark:bg-gray-800/20">
              <h3 className="font-bold flex items-center gap-2 text-gray-100 text-sm whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                </span>
                Staged
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono">
                  {c.staged}
                </span>
              </h3>
            </div>
            <div className="p-5 bg-black/[0.02] dark:bg-white/[0.02] min-h-[140px] max-h-[300px] overflow-y-auto custom-scrollbar">
              {files.staged.length > 0
                ? (
                  <ul className="space-y-1">
                    {files.staged.map((f) => (
                      <li
                        key={f}
                        className="p-2.5 text-[11px] font-mono truncate rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                )
                : (
                  <div className="h-full min-h-[120px] flex flex-col items-center justify-center p-8 text-center text-gray-600 text-[11px] italic">
                    Empty
                  </div>
                )}
            </div>
            <div className="p-4 bg-gray-50/5 dark:bg-black/20 border-t border-gray-100/10 dark:border-gray-800/50 grid grid-cols-2 gap-3 mt-auto">
              <button
                type="button"
                disabled={loading.commit || c.staged === 0}
                onClick={handleUnstage}
                className="py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 disabled:opacity-20 transition-all text-xs font-bold uppercase tracking-widest"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={loading.commit || c.staged === 0}
                onClick={handleCommit}
                className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-bold transition-all text-xs uppercase tracking-widest shadow-lg shadow-blue-900/40"
              >
                Commit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity (History) */}
        <div className="rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-100/10 dark:border-gray-800/50 overflow-hidden shadow-sm flex flex-col h-full lg:sticky lg:top-6 lg:max-h-[calc(100vh-100px)]">
          <div className="p-4 border-b border-gray-100/10 dark:border-gray-800/50 bg-gray-50/5 dark:bg-gray-800/20">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-gray-500">
              Recent Activity
            </h3>
          </div>
          <div className="p-5 flex-grow overflow-y-auto bg-black/[0.02] dark:bg-white/[0.02] custom-scrollbar">
            {log.length > 0
              ? (
                <div className="flex flex-col gap-6">
                  <ul className="space-y-6">
                    {log.map((line, i) => {
                      const [hash, ...msgArr] = line.split(" ");
                      const msg = msgArr.join(" ");
                      return (
                        <li
                          key={i}
                          className="group relative pl-6 border-l border-gray-100/10 dark:border-gray-800 hover:border-indigo-500/50 transition-colors"
                        >
                          <div className="absolute -left-1 w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800 group-hover:bg-indigo-500 transition-colors top-1">
                          </div>
                          <div className="flex flex-col gap-1">
                            <code className="text-[10px] font-mono text-indigo-400/80 tracking-tighter">
                              {hash}
                            </code>
                            <span className="text-[12px] text-gray-500 dark:text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                              {msg}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    disabled={logLoading}
                    onClick={handleLoadMore}
                    className="w-full py-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-indigo-400 border border-gray-100/10 hover:border-indigo-500/30 rounded-lg transition-all disabled:opacity-30"
                  >
                    {logLoading ? "Loading..." : "Load More Activity"}
                  </button>
                </div>
              )
              : (
                <div className="h-full flex items-center justify-center text-center py-8 text-[11px] text-gray-600 italic">
                  No history found
                </div>
              )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
