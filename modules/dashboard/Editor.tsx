import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  initialTitle?: string;
  initialContent?: string;
  onClose: () => void;
  onPublish?: (filename: string, content: string) => void;
};

const DEFAULT_CONTENT = `---
title: "Post Title Here"
description: "A brief description of your post."
date: ${new Date().toISOString().split("T")[0]}
author: "Fastro Team"
tags: ["news"]
image: ""
---

Start writing your post content here...
`;

export default function Editor({
  initialTitle = "",
  initialContent = DEFAULT_CONTENT,
  onClose,
  onPublish,
}: Props) {
  const [_title, _setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState(
    initialTitle ? initialTitle : "untitled-1.md",
  );
  const [editingFilename, setEditingFilename] = useState(false);
  const filenameInputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [gutterHeight, setGutterHeight] = useState<number | null>(null);
  const LINE_HEIGHT_PX = 24; // 1.5rem at 16px base

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  // Autosize textarea and sync gutter height whenever content changes
  useLayoutEffect(() => {
    const ta = contentRef.current;
    if (!ta) return;
    // reset to allow shrink
    ta.style.height = "auto";
    const sh = ta.scrollHeight;
    ta.style.height = sh + "px";
    setGutterHeight(sh);
  }, [content]);

  useEffect(() => {
    if (editingFilename) {
      filenameInputRef.current?.focus();
      filenameInputRef.current?.select();
    }
  }, [editingFilename]);

  // Sync filename when initialTitle changes (e.g., opening a different post)
  useEffect(() => {
    if (!editingFilename) {
      setFilename(initialTitle ? initialTitle : "untitled-1.md");
    }
    // only update when initialTitle changes or when editingFilename toggles
  }, [initialTitle, editingFilename]);

  const handlePublish = () => {
    if (onPublish) onPublish(filename, content);
  };

  const handleFilenameBlur = () => {
    setEditingFilename(false);
    if (!filename.trim()) setFilename("untitled-1.md");
  };

  const handleFilenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      filenameInputRef.current?.blur();
    }
  };

  const lineCount = content.split("\n").length || 1;

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col min-h-0 bg-gray-50 dark:bg-[#101624] rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100/70 dark:bg-[#181f2e]/80 gap-2">
        <div className="flex items-center gap-2">
          {editingFilename
            ? (
              <input
                ref={filenameInputRef}
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                onBlur={handleFilenameBlur}
                onKeyDown={handleFilenameKeyDown}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-[#232b3b] text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-200 lowercase shadow-sm outline-none border border-indigo-400 focus:border-indigo-600"
                style={{ width: Math.max(10, filename.length + 3) + "ch" }}
              />
            )
            : (
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-200 dark:bg-[#232b3b] text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-200 lowercase shadow-sm hover:ring-2 hover:ring-indigo-400 transition-all outline-none"
                onClick={() => setEditingFilename(true)}
                title="Edit filename"
              >
                {filename}
              </button>
            )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-full transition-colors focus:outline-none"
            title="Preview"
            onClick={() => alert("Preview belum diimplementasikan")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:text-white hover:bg-indigo-600 dark:text-indigo-400 dark:hover:text-white dark:hover:bg-indigo-500 rounded-full transition-colors focus:outline-none"
            title="Publish"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="close editor"
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors focus:outline-none"
            title="Close"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path
                fillRule="evenodd"
                d="M10 8.586l4.95-4.95a1 1 0 111.414 1.415L11.414 10l4.95 4.95a1 1 0 01-1.414 1.415L10 11.414l-4.95 4.95a1 1 0 01-1.415-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 bg-transparent">
        <div className="flex-1 flex min-h-0 overflow-y-auto custom-scrollbar bg-transparent">
          <div
            className="w-14 shrink-0 bg-gray-100 dark:bg-[#181f2e] border-r border-gray-200 dark:border-gray-800 flex flex-col items-stretch select-none"
            style={{
              height: gutterHeight ? gutterHeight + "px" : "auto",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div
                key={i}
                className="text-right text-xs text-gray-400 dark:text-gray-500 font-mono px-2"
                style={{
                  height: LINE_HEIGHT_PX + "px",
                  lineHeight: LINE_HEIGHT_PX + "px",
                  userSelect: "none",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="start typing your post..."
            className="flex-1 w-full resize-none bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-600 text-gray-800 dark:text-gray-100 font-mono lowercase px-4 py-4 overflow-hidden"
            style={{
              lineHeight: LINE_HEIGHT_PX / 16 + "rem",
              fontSize: "1rem",
              // height is controlled via autosize in useLayoutEffect
            }}
          />
        </div>
      </div>
    </div>
  );
}
