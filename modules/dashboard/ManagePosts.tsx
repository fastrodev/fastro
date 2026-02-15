import { useEffect, useState } from "react";
import Editor from "./Editor.tsx";
import Toast from "../shared/Toast.tsx";

type Post = { filename: string };

export default function ManagePosts({ onClose }: { onClose: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<
    null | { filename: string; content: string }
  >(null);
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" | "info" }
  >(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to list posts");
      const data = await res.json();
      setPosts((data.posts || []).map((p: string) => ({ filename: p })));
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not load posts", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(filename: string) {
    if (!confirm(`Delete ${filename}?`)) return;
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      const data = await res.json();
      setToast({ message: `${data.filename} deleted`, type: "success" });
      await load();
    } catch (err) {
      console.error(err);
      setToast({ message: "Delete failed", type: "error" });
    }
  }

  async function handleEdit(filename: string) {
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(filename)}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const data = await res.json();
      setEditing({ filename: data.filename, content: data.content });
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not load post", type: "error" });
    }
  }

  async function handleSave(filename: string, content: string) {
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(filename)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setToast({ message: `${data.filename} saved`, type: "success" });
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      setToast({ message: "Save failed", type: "error" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Post Library
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

      {!editing
        ? (
          <div className="rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-100/10 dark:border-gray-800/50 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-100/10 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/5 dark:bg-gray-800/20">
              <h3 className="text-sm font-bold flex items-center gap-2">
                All Files
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono">
                  {posts.length}
                </span>
              </h3>
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

            <div className="bg-white/[0.01] overflow-y-auto custom-scrollbar max-h-[60vh]">
              {loading && posts.length === 0
                ? (
                  <div className="p-12 text-center text-gray-500 text-sm animate-pulse">
                    Scanning posts...
                  </div>
                )
                : posts.length === 0
                ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center text-gray-500 text-sm italic">
                    <svg
                      className="w-12 h-12 mb-3 opacity-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    No posts found
                  </div>
                )
                : (
                  <ul className="divide-y divide-gray-100/5 dark:divide-gray-800/50">
                    {posts.map((p) => (
                      <li
                        key={p.filename}
                        className="group flex items-center justify-between p-4 hover:bg-indigo-500/[0.03] transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/10 transition-colors">
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-indigo-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <span className="font-mono text-[13px] text-gray-600 dark:text-gray-300 truncate tracking-tight">
                            {p.filename}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEdit(p.filename)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-900/10"
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
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.filename)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all"
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
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        )
        : (
          <div className="page mt-4">
            <Editor
              initialTitle={editing.filename}
              initialContent={editing.content}
              onClose={() => setEditing(null)}
              onPublish={(_f, c) => handleSave(editing.filename, c)}
            />
          </div>
        )}

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
