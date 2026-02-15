import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Toast from "../shared/Toast.tsx";

type ConfigData = {
  allPages: string[];
  headerPages: string[];
};

export default function Config({ onClose }: { onClose?: () => void }) {
  const [data, setData] = useState<ConfigData>({
    allPages: [],
    headerPages: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" | "info" }
  >(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/config");
      if (!res.ok) throw new Error("failed to load config");
      const json = await res.json();
      setData(json || { allPages: [], headerPages: [] });
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not load config", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (data.headerPages.length > 4) {
      setToast({ message: "Maximum 4 pages allowed in header", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headerPages: data.headerPages }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "save failed");
      }
      setToast({ message: "Header configuration saved", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        message: (err as Error).message || "Save failed",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function togglePage(page: string) {
    setData((prev) => {
      const isSelected = prev.headerPages.includes(page);
      if (isSelected) {
        return {
          ...prev,
          headerPages: prev.headerPages.filter((p) => p !== page),
        };
      } else {
        if (prev.headerPages.length >= 4) {
          setToast({ message: "Maximum 4 pages allowed", type: "info" });
          return prev;
        }
        return {
          ...prev,
          headerPages: [...prev.headerPages, page],
        };
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Header & Pages Configuration
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all flex items-center gap-2"
          >
            Back
          </button>
        )}
      </div>

      <div className="rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-100/10 dark:border-gray-800/50 overflow-hidden shadow-sm">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
              Select Header Items
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Choose which pages to display in the top navigation bar. (Maximum
              4)
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase py-1 px-2 rounded-md bg-indigo-500/10 text-indigo-400">
                {data.headerPages.length} / 4 Selected
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {loading
              ? (
                <div className="p-8 text-center text-gray-500">
                  Scanning pages…
                </div>
              )
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.allPages.length === 0
                    ? (
                      <div className="col-span-full p-8 text-center text-gray-500 italic border border-dashed border-gray-100/10 rounded-xl">
                        No files found in /pages directory.
                      </div>
                    )
                    : (
                      data.allPages.map((page) => (
                        <label
                          key={page}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                            data.headerPages.includes(page)
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                              : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                data.headerPages.includes(page)
                                  ? "bg-indigo-600 border-indigo-600"
                                  : "border-gray-600 bg-transparent group-hover:border-gray-400"
                              }`}
                            >
                              {data.headerPages.includes(page) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-mono truncate uppercase">
                              {page}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={data.headerPages.includes(page)}
                            onChange={() => togglePage(page)}
                          />
                        </label>
                      ))
                    )}
                </div>
              )}

            <div className="flex gap-3 pt-4 border-t border-gray-100/10 dark:border-gray-800/50">
              <button
                type="submit"
                disabled={saving || loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-bold transition-all shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center gap-2"
              >
                {saving
                  ? (
                    <svg
                      className="animate-spin h-4 w-4"
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                  )}
                <span>{saving ? "Saving…" : "Save Configuration"}</span>
              </button>
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-bold transition-all"
              >
                Reload
              </button>
            </div>
          </form>
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
