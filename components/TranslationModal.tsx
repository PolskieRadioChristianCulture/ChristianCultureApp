import React from "react";
import {
  BIBLE_TRANSLATIONS,
  BibleTranslation,
  SupportedLanguage,
} from "../types";

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (translation: BibleTranslation) => void;
  onSelectRandom: () => void;
  appLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isTickerExpanded?: boolean;
}

export const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
  onSelectRandom,
  appLanguage,
  onLanguageChange,
  isTickerExpanded = false,
}) => {
  if (!isOpen) return null;

  const categories = Array.from(
    new Set(BIBLE_TRANSLATIONS.map((t) => t.category)),
  );

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[2000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in-scale-up ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-[3rem] p-10 shadow-3xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">
            {appLanguage === "pl" ? "Wybierz" : "Select"}{" "}
            <span className="text-[#C5A059]">
              {appLanguage === "pl"
                ? "Przekład / Język"
                : "Translation / Language"}
            </span>
          </h3>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-thin">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-1">
              {appLanguage === "pl" ? "Język Aplikacji" : "App Language"}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onLanguageChange("pl")}
                className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  appLanguage === "pl"
                    ? "bg-[#C5A059] border-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-[#C5A059]/50"
                }`}
              >
                🇵🇱 Polski
              </button>
              <button
                onClick={() => onLanguageChange("en")}
                className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  appLanguage === "en"
                    ? "bg-[#C5A059] border-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-[#C5A059]/50"
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          <button
            aria-label="Ulubione"
            onClick={onSelectRandom}
            className="w-full py-4 bg-[#C5A059] text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 14a4 4 0 100-8 4 4 0 000 8zM12 8a1 1 0 100 2 1 1 0 000-2z"
              />
            </svg>
            {appLanguage === "pl" ? "Losowy Przekład" : "Random Translation"}
          </button>

          {categories.map((cat) => (
            <div key={cat} className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-1">
                {cat}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BIBLE_TRANSLATIONS.filter((t) => t.category === cat).map(
                  (translation) => (
                    <button
                      key={translation.id}
                      onClick={() => onSelect(translation)}
                      className={`text-left p-4 rounded-xl border text-xs font-bold transition-all ${
                        selectedId === translation.id
                          ? "bg-[#C5A059] border-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-[#C5A059]/50"
                      }`}
                    >
                      {translation.name}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
