import React, { useState, useCallback, useEffect } from "react";
import {
  FoundVerse,
  ToastMessage,
  fixOrphans,
  SupportedLanguage,
} from "../types";
import { searchBibleVerses } from "../services/geminiService";
import { BibleService } from "../services/bibleService";
import { FixedSizeList } from "react-window";
import { ChapterReadingModal } from "./ChapterReadingModal";

interface VerseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTranslation: string;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  appLanguage: SupportedLanguage;
  initialQuery?: string;
  isTickerExpanded?: boolean;
}

export const VerseSearchModal: React.FC<VerseSearchModalProps> = ({
  isOpen,
  onClose,
  selectedTranslation,
  addToast,
  appLanguage,
  initialQuery = "",
  isTickerExpanded = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<FoundVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [readingChapterRef, setReadingChapterRef] = useState<string | null>(
    null,
  );
  const [readingChapterContent, setReadingChapterContent] =
    useState<string>("");

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      console.log(`[VerseSearchModal] Starting search for: "${searchQuery}"`);
      setIsLoading(true);
      setResults([]);
      try {
        // 1. Zawsze najpierw próbujemy lokalnego przeszukiwania całej Biblii (darmowe, natychmiastowe, dosłowne)
        let combinedData: FoundVerse[] = [];
        try {
          const localData = await BibleService.searchVerses(searchQuery, 20);
          if (localData && localData.length > 0) {
            combinedData = [...localData];
          }
        } catch (localErr) {
          console.error("Local search error:", localErr);
        }

        // 2. Opcjonalnie próbujemy dopytać AI dla głębi i szerszego kontekstu
        try {
          const aiData = await searchBibleVerses(
            searchQuery,
            selectedTranslation,
            appLanguage,
          );
          if (aiData && aiData.length > 0) {
            // Filtrujemy, żeby nie duplikować tych samych referencji
            const newAiData = aiData.filter(
              (aiVerse) =>
                !combinedData.some((localVerse) =>
                  localVerse.reference.includes(aiVerse.reference),
                ),
            );
            combinedData = [...combinedData, ...newAiData];
          }
        } catch (aiErr) {
          // Ignore AI errors if we already have local results
        }

        console.log(
          `[VerseSearchModal] Search results received:`,
          combinedData,
        );
        if (combinedData && combinedData.length > 0) {
          setResults(combinedData);
          addToast(
            appLanguage === "pl"
              ? `Znaleziono ${combinedData.length} wersety(ów).`
              : `Found ${combinedData.length} verses.`,
            "success",
          );
        } else {
          console.warn(
            `[VerseSearchModal] No results found for: "${searchQuery}"`,
          );
          addToast(
            appLanguage === "pl"
              ? "Nie znaleziono wersetów dla podanej frazy."
              : "No verses found for the given phrase.",
            "info",
          );
        }
      } catch (error: any) {
        console.error(`[VerseSearchModal] Search error:`, error);
        if (error.isApiQuotaExceeded) {
          addToast(
            appLanguage === "pl"
              ? "Wygląda na to, że wyczerpaliśmy limit darmowych zapytań. Asystent CC potrzebuje Twojego prywatnego klucza API, aby dalej służyć. Możesz go dodać w ustawieniach. Wspierając misję, pomagasz zwiększać limity dla wszystkich!"
              : "Our free quota has been exceeded. Assistant CC needs your private API key to continue service. You can add it in settings. Supporting the mission helps us increase limits for everyone!",
            "info",
          );
          // Opcjonalnie można spróbować otworzyć okno klucza, jeśli jest dostępne:
          if (
            window.aistudio &&
            typeof window.aistudio.openSelectKey === "function"
          ) {
            window.aistudio.openSelectKey();
          }
        } else {
          addToast(
            appLanguage === "pl"
              ? "Błąd wyszukiwania. Spróbuj ponownie."
              : "Search error. Try again.",
            "info",
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTranslation, addToast, appLanguage],
  );

  useEffect(() => {
    if (isOpen && initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    } else if (!isOpen) {
      setResults([]);
      setQuery("");
      setReadingChapterRef(null);
    }
  }, [isOpen, initialQuery, handleSearch]);

  const copyResults = useCallback(() => {
    if (results.length === 0) return;
    const text = results
      .map(
        (v: FoundVerse) =>
          `${v.reference}: "${v.text}"\n(Kontekst: ${v.connection})`,
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
    addToast(
      appLanguage === "pl"
        ? "Wyniki wyszukiwania skopiowane!"
        : "Search results copied!",
      "success",
    );
  }, [results, addToast, appLanguage]);

  const handleOpenChapter = useCallback(
    async (reference: string) => {
      try {
        const parts = reference.split(":");
        const chapterRef = parts.length > 1 ? parts[0] : reference;
        setReadingChapterContent(
          appLanguage === "pl"
            ? "Ładowanie rozdziału..."
            : "Loading chapter...",
        );
        setReadingChapterRef(chapterRef);
        const content = await BibleService.getChapter(reference);
        setReadingChapterContent(content);
      } catch (error) {
        console.error("Failed to load chapter", error);
        addToast(
          appLanguage === "pl"
            ? "Błąd otwierania rozdziału."
            : "Error opening chapter.",
          "info",
        );
        setReadingChapterRef(null);
      }
    },
    [appLanguage, addToast],
  );

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[2000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in-scale-up ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-[2.5rem] shadow-3xl flex flex-col max-h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full opacity-100">
          <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                {appLanguage === "pl" ? "Wyszukiwarka" : "Search"}{" "}
                <span className="text-[#C5A059]">
                  {appLanguage === "pl" ? "Słowa" : "Word"}
                </span>
              </h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                Scriptura scripturam interpretatur
              </p>
            </div>
            <button
              aria-label="Ulubione"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-[#C5A059] transition-colors rounded-full bg-zinc-900"
              title={appLanguage === "pl" ? "Zamknij" : "Close"}
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

          <div className="px-8 pb-4 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(query);
              }}
              className="relative"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  appLanguage === "pl"
                    ? "Wpisz słowo, temat lub problem (np. lęk, nadzieja, przebaczenie)..."
                    : "Enter a word, topic or problem (e.g. hope, forgiveness)..."
                }
                className="w-full py-4 pl-6 pr-14 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-zinc-500"
                autoFocus
              />
              <button
                aria-label="Ulubione"
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-[#C5A059] disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={4}
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
            </form>
            <div className="mt-3 flex justify-center">
              <button
                aria-label="Ulubione"
                onClick={() => handleOpenChapter("Jana 1")}
                className="text-[9px] font-black text-zinc-500 hover:text-[#C5A059] uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {appLanguage === "pl"
                  ? "Otwórz Biblię (Czytaj Rozdziałami)"
                  : "Open Bible (Browse Chapters)"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-8 pb-8 flex flex-col">
            {results.length > 0 ? (
              <div className="flex-1 flex flex-col animate-slide-down">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    {appLanguage === "pl"
                      ? "Wyniki wyszukiwania"
                      : "Search results"}
                  </span>
                  <button
                    aria-label="Ulubione"
                    onClick={copyResults}
                    className="text-[10px] font-bold text-[#C5A059] hover:text-[#E2B859] uppercase tracking-widest flex items-center gap-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    {appLanguage === "pl" ? "Kopiuj" : "Copy"}
                  </button>
                </div>

                <div className="flex-1">
                  <FixedSizeList
                    height={400}
                    itemCount={results.length}
                    itemSize={220}
                    width="100%"
                    className="scrollbar-thin"
                  >
                    {({ index, style }) => {
                      const verse = results[index];
                      return (
                        <div style={style} className="pr-4 pb-4">
                          <div className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800 hover:border-[#C5A059]/30 transition-colors h-full overflow-y-auto scrollbar-thin">
                            <div className="flex items-center justify-between mb-3 border-b border-zinc-800/50 pb-2">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center text-xs font-black">
                                  {index + 1}
                                </span>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">
                                  {verse.reference}
                                </h4>
                              </div>
                              <button
                                onClick={() =>
                                  handleOpenChapter(verse.reference)
                                }
                                className="px-3 py-1 bg-zinc-800 hover:bg-[#C5A059]/20 text-[#C5A059] border border-zinc-700 hover:border-[#C5A059]/50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                              >
                                {appLanguage === "pl"
                                  ? "Czytaj w Biblii"
                                  : "Read in Bible"}
                              </button>
                            </div>
                            <p className="text-lg font-serif italic text-zinc-200 mb-4 leading-relaxed">
                              "{verse.text}"
                            </p>
                            <div className="bg-[#C5A059]/5 p-3 rounded-xl border border-[#C5A059]/10">
                              <p className="text-xs text-zinc-400 font-medium">
                                <span className="text-[#C5A059] font-bold uppercase text-[9px] tracking-widest mr-2">
                                  {appLanguage === "pl"
                                    ? "Kontekst:"
                                    : "Context:"}
                                </span>
                                {verse.connection}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </FixedSizeList>
                </div>
              </div>
            ) : (
              !isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 opacity-50 space-y-4">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p className="text-sm">
                    {appLanguage === "pl"
                      ? "Wpisz frazę, aby odkryć biblijne połączenia."
                      : "Enter a phrase to discover biblical connections."}
                  </p>
                </div>
              )
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] mt-auto">
            <button
              onClick={onClose}
              className="w-full py-4 bg-zinc-800 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-700 transition-all shadow-lg active:scale-95 text-center border border-zinc-700"
            >
              {appLanguage === "pl" ? "ZAMKNIJ OKNO" : "CLOSE WINDOW"}
            </button>
          </div>
        </div>
      </div>

      {readingChapterRef && (
        <ChapterReadingModal
          isOpen={true}
          onClose={() => setReadingChapterRef(null)}
          title={readingChapterRef}
          content={readingChapterContent}
          appLanguage={appLanguage}
          isTickerExpanded={isTickerExpanded}
        />
      )}
    </div>
  );
};
