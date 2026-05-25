import React, { useEffect } from "react";
import { ToastMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
  isIntentionsVisible?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  toasts,
  onRemove,
  isIntentionsVisible = false,
}) => {
  // Obliczanie pozycji top:
  // Mobile: Ticker=32px (8), Intentions=28px (7). Total=60px
  // Desktop: Ticker=64px (16), Intentions=48px (12). Total=112px
  const topClass = isIntentionsVisible
    ? "top-[calc(60px+env(safe-area-inset-top,0px))] sm:top-[calc(112px+env(safe-area-inset-top,0px))]"
    : "top-[calc(32px+env(safe-area-inset-top,0px))] sm:top-[calc(64px+env(safe-area-inset-top,0px))]";

  // Cascade logic: only show the first toast in the queue
  const currentToast = toasts[0];

  return (
    <div
      className={`fixed ${topClass} inset-x-0 z-[5000] flex flex-col items-center pointer-events-none transition-all duration-700 ease-in-out px-0 sm:px-6`}
    >
      <div className="flex flex-col w-full max-w-none sm:max-w-2xl">
        <AnimatePresence>
          {currentToast && (
            <ToastItem
              key={currentToast.id}
              toast={currentToast}
              onRemove={onRemove}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  useEffect(() => {
    // Nie usuwaj automatycznie, jeśli Toast ma akcję (np. aktualizacja) lub błąd
    if (toast.action || toast.type === "alert") return;

    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove, toast.action, toast.type]);

  const icons: Record<ToastMessage["type"], React.ReactNode> = {
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    news: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        />
      </svg>
    ),
    alert: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  };

  const colors: Record<ToastMessage["type"], string> = {
    info: "shadow-[0_30px_60px_rgba(0,0,0,0.8)]",
    success: "shadow-[0_30px_60px_rgba(79,70,229,0.2)]",
    news: "shadow-[0_30px_60px_rgba(249,115,22,0.2)]",
    alert: "shadow-[0_30px_60px_rgba(239,68,68,0.2)]",
    error: "shadow-[0_30px_60px_rgba(239,68,68,0.2)]",
  };

  const innerBg: Record<ToastMessage["type"], string> = {
    info: "bg-zinc-950",
    success: "bg-indigo-950",
    news: "bg-orange-950",
    alert: "bg-red-950",
    error: "bg-red-950",
  };

  const gradients: Record<ToastMessage["type"], string> = {
    info: "conic-gradient(from 0deg, transparent 0 270deg, rgba(197,160,89,0.1) 270deg 330deg, #C5A059 360deg)",
    success:
      "conic-gradient(from 0deg, transparent 0 270deg, rgba(99,102,241,0.1) 270deg 330deg, #6366f1 360deg)",
    news: "conic-gradient(from 0deg, transparent 0 270deg, rgba(249,115,22,0.1) 270deg 330deg, #f97316 360deg)",
    alert:
      "conic-gradient(from 0deg, transparent 0 270deg, rgba(239,68,68,0.1) 270deg 330deg, #ef4444 360deg)",
    error:
      "conic-gradient(from 0deg, transparent 0 270deg, rgba(239,68,68,0.1) 270deg 330deg, #ef4444 360deg)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, info) => {
        if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) {
          onRemove(toast.id);
        }
      }}
      onClick={() => onRemove(toast.id)}
      className={`pointer-events-auto w-full flex flex-col sm:rounded-[1.5rem] transition-colors duration-700 bg-transparent text-white ${colors[toast.type]} z-50 cursor-pointer active:brightness-90 hover:brightness-110 relative overflow-hidden`}
    >
      <div
        className="absolute inset-[-500%] z-0 rounded-full animate-[spin_8s_linear_infinite]"
        style={{ background: gradients[toast.type] }}
      />
      <div
        className={`absolute inset-[1px] rounded-none sm:rounded-[calc(1.5rem-1px)] z-0 pointer-events-none backdrop-blur-3xl ${innerBg[toast.type]}/98`}
      />

      <div className="relative z-10 px-6 py-3 w-full flex items-center gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center text-[#C5A059] border border-white/5 shadow-inner">
          {icons[toast.type]}
        </div>
        <div className="flex-1 flex flex-col gap-0 py-1">
          <p className="text-[7px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mb-0.5">
            System
          </p>
          <p className="text-[11px] sm:text-xs font-black tracking-tight uppercase leading-tight text-white drop-shadow-md">
            {toast.message}
          </p>
        </div>

        {toast.action ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.action?.onClick();
            }}
            className="px-5 py-3 bg-[#C5A059] text-black font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            {toast.action.label}
          </button>
        ) : (
          <button
            aria-label="Ulubione"
            onClick={() => onRemove(toast.id)}
            className="p-2.5 text-white/20 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};
