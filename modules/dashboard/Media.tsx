import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Toast from "../shared/Toast.tsx";

type Asset = { name: string; url?: string; size?: number };

export default function Media({ onClose }: { onClose?: () => void }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  type Selected = {
    id: string;
    file: File;
    name: string;
    size?: number;
    status: "idle" | "pending" | "uploading" | "uploaded" | "error";
    url?: string;
  };

  const [selectedFiles, setSelectedFiles] = useState<Selected[]>([]);
  const [viewer, setViewer] = useState<
    {
      url: string;
      temp?: boolean;
    } | null
  >(null);
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" | "info" }
  >(null);

  function openViewerUrl(url: string) {
    // revoke previous temp url if any
    setViewer((prev) => {
      if (prev?.temp) {
        try {
          URL.revokeObjectURL(prev.url);
        } catch {
          /* ignore */
        }
      }
      return { url, temp: false };
    });
  }

  function _openViewerFile(file: File) {
    const obj = URL.createObjectURL(file);
    setViewer((prev) => {
      if (prev?.temp) {
        try {
          URL.revokeObjectURL(prev.url);
        } catch {
          /* ignore */
        }
      }
      return { url: obj, temp: true };
    });
  }

  function closeViewer() {
    setViewer((prev) => {
      if (prev?.temp) {
        try {
          URL.revokeObjectURL(prev.url);
        } catch {
          /* ignore */
        }
      }
      return null;
    });
  }

  // load assets on mount
  useEffect(() => {
    setIsClient(true);
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("failed to list media");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not load media", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("file") as
      | HTMLInputElement
      | null;
    const filesFromInput = Array.from(input?.files || []);
    // Merge newly selected files into selectedFiles if any (in case user used form without onChange)
    if (filesFromInput.length) {
      addFiles(filesFromInput);
    }

    // Determine which files to upload: those pending or error
    const toUpload = selectedFiles.filter((s) =>
      s.status === "pending" || s.status === "error"
    );
    if (toUpload.length === 0) return;

    setUploading(true);

    // Upload sequentially to keep status simple
    for (const sel of toUpload) {
      // set file status to uploading
      setSelectedFiles((cur) =>
        cur.map((c) => c.id === sel.id ? { ...c, status: "uploading" } : c)
      );
      try {
        const fd = new FormData();
        fd.append("file", sel.file, sel.name);
        const res = await fetch("/api/media", { method: "POST", body: fd });
        if (!res.ok) throw new Error("upload failed");
        const data = await res.json().catch(() => ({}));
        // mark uploaded and store url if available
        setSelectedFiles((cur) =>
          cur.map((c) =>
            c.id === sel.id
              ? { ...c, status: "uploaded", url: data.url ?? c.url }
              : c
          )
        );
        setToast({ message: `${sel.name} uploaded`, type: "success" });
      } catch (err) {
        console.error(err);
        setSelectedFiles((cur) =>
          cur.map((c) => c.id === sel.id ? { ...c, status: "error" } : c)
        );
        setToast({ message: `${sel.name} upload failed`, type: "error" });
      }
      // refresh assets after each file to reflect server state
      await load();
    }

    // finished
    setUploading(false);
    // keep selectedFiles so user can see uploaded statuses; optionally we could clear uploaded entries
  }

  async function handleDelete(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/media/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      setToast({ message: `${name} deleted`, type: "success" });
      await load();
    } catch (err) {
      console.error(err);
      setToast({ message: "Delete failed", type: "error" });
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: "URL copied to clipboard", type: "success" });
    } catch (_err) {
      /* ignore */
      setToast({ message: "Failed to copy URL", type: "error" });
    }
  }

  function addFiles(list: File[]) {
    if (!list.length) return;
    setSelectedFiles((cur) => {
      const existingNames = new Set(cur.map((c) => c.name + "@" + c.file.size));
      const next = [...cur];
      for (const f of list) {
        const key = f.name + "@" + f.size;
        if (existingNames.has(key)) continue;
        next.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          name: f.name,
          size: f.size,
          status: "pending",
        });
      }
      return next;
    });
    // mark pending
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Media Library
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
          <h3 className="text-sm font-bold">Manage Assets</h3>
          <form onSubmit={handleUpload} className="flex items-center gap-3">
            <label className="bg-white/5 px-3 py-2 rounded-lg text-sm cursor-pointer">
              <input
                name="file"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                multiple
                onChange={(e) => {
                  const list = Array.from(
                    (e.target as HTMLInputElement).files || [],
                  );
                  addFiles(list);
                }}
              />
              {uploading ? "Uploading…" : "Choose File"}
            </label>
            <button
              type="submit"
              disabled={uploading}
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
            >
              Upload
            </button>
          </form>
        </div>

        <div className="p-4">
          {loading
            ? (
              <div className="p-12 text-center text-gray-500">
                Loading assets…
              </div>
            )
            : (selectedFiles.length === 0 && assets.length === 0)
            ? (
              <div className="p-8 text-center text-gray-500 italic">
                No assets uploaded
              </div>
            )
            : (
              <ul className="space-y-2">
                {/* Selected files with statuses */}
                {selectedFiles.map((sf) => (
                  <li
                    key={sf.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-[150px] max-w-[250px]">
                      <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200 truncate">
                        {sf.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0 font-medium">
                        {sf.size ? `${Math.round(sf.size / 1024)} KB` : "—"}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center min-w-0 gap-2">
                      {sf.url
                        ? (
                          <>
                            <code className="flex-1 text-[11px] bg-black/20 text-gray-500 px-2 py-1 rounded truncate font-mono border border-white/5">
                              {sf.url}
                            </code>
                            <button
                              type="button"
                              onClick={() => sf.url && copyToClipboard(sf.url)}
                              className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 px-2 py-1 hover:bg-indigo-500/10 rounded transition-colors"
                            >
                              Copy
                            </button>
                          </>
                        )
                        : (
                          <div className="flex-1 flex items-center justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                              {sf.status === "pending" && "Not uploaded"}
                              {sf.status === "uploading" && "Uploading…"}
                              {sf.status === "uploaded" && "Uploaded"}
                              {sf.status === "error" && "Error"}
                            </span>
                          </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto border-l border-white/10 pl-4">
                      <button
                        type="button"
                        onClick={() =>
                          sf.url
                            ? openViewerUrl(sf.url)
                            : _openViewerFile(sf.file)}
                        className="text-xs font-semibold text-gray-400 hover:text-indigo-400 px-2 py-1 transition-colors"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles((cur) =>
                            cur.filter((c) => c.id !== sf.id)
                          )}
                        className="text-xs font-semibold text-gray-400 hover:text-rose-400 px-2 py-1 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}

                {/* Render remote assets (already uploaded), skip duplicates that are uploaded in selectedFiles */}
                {assets.filter((a) =>
                  !selectedFiles.some((sf) =>
                    sf.name === a.name && sf.status === "uploaded"
                  )
                ).map((a) => (
                  <li
                    key={a.name}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-[150px] max-w-[250px]">
                      <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200 truncate">
                        {a.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 font-medium">
                        {a.size ? `${Math.round(a.size / 1024)} KB` : "—"}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center min-w-0 gap-2">
                      <code className="flex-1 text-[11px] bg-black/20 text-gray-500 px-2 py-1 rounded truncate font-mono border border-white/5">
                        {a.url}
                      </code>
                      <button
                        type="button"
                        onClick={() => a.url && copyToClipboard(a.url)}
                        className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 px-2 py-1 hover:bg-indigo-500/10 rounded transition-colors"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto border-l border-white/10 pl-4">
                      <button
                        type="button"
                        onClick={() => a.url && openViewerUrl(a.url)}
                        className="text-xs font-semibold text-gray-400 hover:text-indigo-400 px-2 py-1 transition-colors"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.name)}
                        className="text-xs font-semibold text-gray-400 hover:text-rose-400 px-2 py-1 transition-colors"
                      >
                        Delete
                      </button>
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
      {viewer && isClient && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={closeViewer}
        >
          <div
            className="relative flex items-center justify-center max-w-180 w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeViewer}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2 transition-all shadow-xl z-[60] border-2 border-white dark:border-gray-900"
              aria-label="Close preview"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img
              src={viewer.url}
              alt="preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
