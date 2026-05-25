import React, { useState, useCallback } from "react";
import {
  AISuggestion,
  AISuggestionType,
  BibleVerse,
  UserGender,
  MIRIAM_AVATAR_URL,
  fixOrphans,
  SupportedLanguage,
} from "../types";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    type: AISuggestionType,
    dailyVerseContext: BibleVerse | null,
    userName: string,
    userGender: UserGender,
  ) => void | Promise<void>;
  suggestions: AISuggestion[];
  loading: boolean;
  dailyVerseContext: BibleVerse | null;
  userName: string;
  userGender: UserGender;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  suggestions,
  loading,
  dailyVerseContext,
  userName,
  userGender,
  appLanguage,
  isTickerExpanded = false,
}) => {
  if (!isOpen) return null;

  const [selectedType, setSelectedType] =
    useState<AISuggestionType>("sanctification");

  const handleGenerate = useCallback(
    (type: AISuggestionType) => {
      setSelectedType(type);
      onGenerate(type, dailyVerseContext, userName, userGender);
    },
    [onGenerate, dailyVerseContext, userName, userGender],
  );

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[1001] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-12 animate-fade-in-scale-up ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <div className="relative w-full max-w-4xl h-full sm:h-[90vh] glass-dark border border-white/10 rounded-[3rem] p-8 sm:p-14 shadow-3xl flex flex-col">
        <div className="flex justify-between items-center mb-10 flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={MIRIAM_AVATAR_URL}
                alt="Miriam"
                className="w-14 h-14 rounded-full border-2 border-[#C5A059] object-cover shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black animate-pulse shadow-lg shadow-green-500/50"></div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                {appLanguage === "pl" ? "Asystent" : "Assistant"}{" "}
                <span className="text-[#C5A059]">Miriam CC</span>
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">
                INTELLIGENT SPIRITUAL GUIDANCE
              </p>
            </div>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center glass rounded-full text-zinc-400 hover:text-white transition-all border border-white/10 shadow-xl active:scale-90 group"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
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

        <div className="flex flex-col sm:flex-row gap-5 mb-10 flex-shrink-0">
          <button
            aria-label="Ulubione"
            onClick={() => handleGenerate("sanctification")}
            disabled={loading}
            className={`flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] ${
              selectedType === "sanctification"
                ? "bg-[#C5A059] text-black shadow-[#C5A059]/20"
                : "glass border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            {loading && selectedType === "sanctification" ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>
                  {appLanguage === "pl" ? "GENEROWANIE..." : "GENERATING..."}
                </span>
              </div>
            ) : appLanguage === "pl" ? (
              "Wskazówki Uświęcenia"
            ) : (
              "Sanctification Tips"
            )}
          </button>
          <button
            aria-label="Ulubione"
            onClick={() => handleGenerate("evangelism")}
            disabled={loading}
            className={`flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] ${
              selectedType === "evangelism"
                ? "bg-[#C5A059] text-black shadow-[#C5A059]/20"
                : "glass border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            {loading && selectedType === "evangelism" ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>
                  {appLanguage === "pl" ? "GENEROWANIE..." : "GENERATING..."}
                </span>
              </div>
            ) : appLanguage === "pl" ? (
              "Pomysły na Ewangelizację"
            ) : (
              "Evangelism Ideas"
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin">
          {suggestions.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-40 space-y-6">
              <div className="w-24 h-24 rounded-full glass border border-white/5 flex items-center justify-center text-5xl">
                ✨
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-center max-w-xs">
                {appLanguage === "pl"
                  ? "Wybierz typ wskazówek, aby Miriam mogła je wygenerować."
                  : "Select a type of suggestions for Miriam to generate."}
              </p>
            </div>
          )}

          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="glass rounded-[2rem] p-8 border border-white/5 hover:border-[#C5A059]/30 transition-all shadow-xl group"
            >
              <h3 className="text-[13px] font-black text-white uppercase tracking-[0.1em] mb-3 group-hover:text-[#C5A059] transition-colors">
                {fixOrphans(suggestion.title)}
              </h3>
              <p className="text-zinc-300 text-base leading-relaxed opacity-80">
                {fixOrphans(suggestion.content)}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-white/10 flex-shrink-0 mt-8">
          <button
            onClick={onClose}
            className="w-full py-5 bg-[#C5A059] text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[#C5A059]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {appLanguage === "pl" ? "Wróć do Centrum" : "Return to Center"}
          </button>
        </div>
      </div>
    </div>
  );
};
