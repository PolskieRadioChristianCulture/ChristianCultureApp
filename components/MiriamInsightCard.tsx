import React from "react";
import { MIRIAM_AVATAR_URL, fixOrphans } from "../types";

interface MiriamInsightCardProps {
  insight: string;
  onClose: () => void;
  onSpeak: (title: string, content: string, autoStartAudio?: boolean) => void;
  appLanguage: "pl" | "en";
  isTickerExpanded?: boolean;
}

export const MiriamInsightCard: React.FC<MiriamInsightCardProps> = ({
  insight,
  onClose,
  onSpeak,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const title = appLanguage === "pl" ? "Wskazówka Miriam" : "Miriam's Insight";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[2000] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-12 animate-fade-in-scale-up ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md glass-dark border border-white/10 rounded-[2.5rem] p-8 shadow-3xl flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={MIRIAM_AVATAR_URL}
                alt="Miriam Avatar"
                className="w-14 h-14 rounded-full border-2 border-[#C5A059] shadow-2xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black animate-pulse shadow-lg shadow-green-500/50"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {title}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                MIRIAM CC ASSISTANT
              </p>
            </div>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center glass text-zinc-400 hover:text-white rounded-full transition-all border border-white/10 shadow-xl active:scale-90 group"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin mb-8">
          <p className="text-zinc-200 text-xl sm:text-2xl font-medium leading-relaxed italic opacity-90">
            "{fixOrphans(insight)}"
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            aria-label="Ulubione"
            onClick={() => onSpeak(title, insight)}
            className="w-full py-5 bg-[#C5A059] text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#E2B859] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#C5A059]/20 active:scale-95"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            {appLanguage === "pl" ? "SŁUCHAJ" : "LISTEN"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-5 glass text-zinc-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:text-white transition-all border border-white/10 active:scale-95 shadow-xl"
          >
            {appLanguage === "pl" ? "ZAMKNIJ" : "CLOSE"}
          </button>
        </div>
      </div>
    </div>
  );
};
