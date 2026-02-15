import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

export default function Toast(
  { message, type, onClose, duration = 3000 }: Props,
) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success"
    ? "bg-emerald-500"
    : type === "error"
    ? "bg-red-500"
    : "bg-indigo-500";

  const toastContent = (
    <div className="fixed inset-x-0 bottom-8 flex justify-center z-[9999] pointer-events-none px-4">
      <div
        className={`${bgColor} text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-lg bg-opacity-80 border border-white/10 ring-1 ring-black/5 pointer-events-auto transition-all duration-500 ease-out`}
      >
        {type === "success" && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "error" && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span className="text-sm font-semibold tracking-tight">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(toastContent, document.body);
}
