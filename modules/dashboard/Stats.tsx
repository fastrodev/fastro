import { useEffect, useState } from "react";
import Toast from "../shared/Toast.tsx";

type PostStat = {
  filename: string;
  words: number;
  readingMin: number;
};

export default function Stats({ onClose }: { onClose?: () => void }) {
  const [stats, setStats] = useState<PostStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" | "info" }
  >(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("failed to list posts");
      const data = await res.json();
      const files: string[] = data.posts || [];

      const items: PostStat[] = [];
      for (const f of files) {
        try {
          const r = await fetch(`/api/posts/${encodeURIComponent(f)}`);
          if (!r.ok) throw new Error("failed to fetch post");
          const d = await r.json();
          const content: string = d.content || "";
          const words = content.split(/\s+/).filter(Boolean).length;
          const readingMin = Math.max(1, Math.round(words / 200));
          items.push({ filename: f, words, readingMin });
        } catch (_) {
          items.push({ filename: f, words: 0, readingMin: 0 });
        }
      }

      setStats(items);
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not load stats", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Post Statistics
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
        <div className="p-4 border-b border-gray-100/10 dark:border-gray-800/50 flex items-center justify-between">
          <h3 className="text-sm font-bold">Overview</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              className="p-1.5 rounded-md hover:bg-indigo-500/10 text-gray-500 hover:text-indigo-400 transition-colors"
              title="Refresh"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {loading
            ? (
              <div className="p-12 text-center text-gray-500">
                Loading stats…
              </div>
            )
            : stats.length === 0
            ? (
              <div className="p-8 text-center text-gray-500 italic">
                No posts found
              </div>
            )
            : (
              <ul className="divide-y divide-gray-100/10">
                {stats.map((s) => (
                  <li
                    key={s.filename}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[13px] font-mono text-gray-700 dark:text-gray-300 truncate">
                        {s.filename}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {s.words} words • {s.readingMin} min read
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-indigo-400">
                        {/* views placeholder */}—
                      </div>
                      <div className="text-[11px] text-gray-500">views</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
