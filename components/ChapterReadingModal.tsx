import React, { useState, useEffect, useRef } from "react";
import { SupportedLanguage, BibleVerse, ToastMessage } from "../types";
import { BibleService } from "../services/bibleService";
import { PersistenceService } from "../services/persistenceService";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Image as ImageIcon,
  Type,
  Minus,
  Plus,
} from "lucide-react";
import { VerseImageGeneratorModal } from "./VerseImageGeneratorModal";

const BIBLE_BOOKS = [
  { eng: "Genesis", pl: "1 Mojżeszowa", chapters: 50 },
  { eng: "Exodus", pl: "2 Mojżeszowa", chapters: 40 },
  { eng: "Leviticus", pl: "3 Mojżeszowa", chapters: 27 },
  { eng: "Numbers", pl: "4 Mojżeszowa", chapters: 36 },
  { eng: "Deuteronomy", pl: "5 Mojżeszowa", chapters: 34 },
  { eng: "Joshua", pl: "Jozuego", chapters: 24 },
  { eng: "Judges", pl: "Sędziów", chapters: 21 },
  { eng: "Ruth", pl: "Rut", chapters: 4 },
  { eng: "1 Samuel", pl: "1 Samuela", chapters: 31 },
  { eng: "2 Samuel", pl: "2 Samuela", chapters: 24 },
  { eng: "1 Kings", pl: "1 Królewska", chapters: 22 },
  { eng: "2 Kings", pl: "2 Królewska", chapters: 25 },
  { eng: "1 Chronicles", pl: "1 Kronik", chapters: 29 },
  { eng: "2 Chronicles", pl: "2 Kronik", chapters: 36 },
  { eng: "Ezra", pl: "Ezdrasza", chapters: 10 },
  { eng: "Nehemiah", pl: "Nehemiasza", chapters: 13 },
  { eng: "Esther", pl: "Estery", chapters: 10 },
  { eng: "Job", pl: "Hioba", chapters: 42 },
  { eng: "Psalms", pl: "Psalm", chapters: 150 },
  { eng: "Proverbs", pl: "Przysłów", chapters: 31 },
  { eng: "Ecclesiastes", pl: "Kaznodziei", chapters: 12 },
  { eng: "Song of Solomon", pl: "Pieśń nad Pieśniami", chapters: 8 },
  { eng: "Isaiah", pl: "Izajasza", chapters: 66 },
  { eng: "Jeremiah", pl: "Jeremiasza", chapters: 52 },
  { eng: "Lamentations", pl: "Treny", chapters: 5 },
  { eng: "Ezekiel", pl: "Ezechiela", chapters: 48 },
  { eng: "Daniel", pl: "Daniela", chapters: 12 },
  { eng: "Hosea", pl: "Ozeasza", chapters: 14 },
  { eng: "Joel", pl: "Joela", chapters: 3 },
  { eng: "Amos", pl: "Amosa", chapters: 9 },
  { eng: "Obadiah", pl: "Abdiasza", chapters: 1 },
  { eng: "Jonah", pl: "Jonasza", chapters: 4 },
  { eng: "Micah", pl: "Micheasza", chapters: 7 },
  { eng: "Nahum", pl: "Nahuma", chapters: 3 },
  { eng: "Habakkuk", pl: "Habakuka", chapters: 3 },
  { eng: "Zephaniah", pl: "Sofoniasza", chapters: 3 },
  { eng: "Haggai", pl: "Aggeusza", chapters: 2 },
  { eng: "Zechariah", pl: "Zachariasza", chapters: 14 },
  { eng: "Malachi", pl: "Malachiasza", chapters: 4 },
  { eng: "Matthew", pl: "Ewangelia Mateusza", chapters: 28 },
  { eng: "Mark", pl: "Ewangelia Marka", chapters: 16 },
  { eng: "Luke", pl: "Ewangelia Łukasza", chapters: 24 },
  { eng: "John", pl: "Ewangelia Jana", chapters: 21 },
  { eng: "Acts", pl: "Dzieje Apostolskie", chapters: 28 },
  { eng: "Romans", pl: "Rzymian", chapters: 16 },
  { eng: "1 Corinthians", pl: "1 Koryntian", chapters: 16 },
  { eng: "2 Corinthians", pl: "2 Koryntian", chapters: 13 },
  { eng: "Galatians", pl: "Galatów", chapters: 6 },
  { eng: "Ephesians", pl: "Efezjan", chapters: 6 },
  { eng: "Philippians", pl: "Filipian", chapters: 4 },
  { eng: "Colossians", pl: "Kolosan", chapters: 4 },
  { eng: "1 Thessalonians", pl: "1 Tesaloniczan", chapters: 5 },
  { eng: "2 Thessalonians", pl: "2 Tesaloniczan", chapters: 3 },
  { eng: "1 Timothy", pl: "1 Tymoteusza", chapters: 6 },
  { eng: "2 Timothy", pl: "2 Tymoteusza", chapters: 4 },
  { eng: "Titus", pl: "Tytusa", chapters: 3 },
  { eng: "Philemon", pl: "Filemona", chapters: 1 },
  { eng: "Hebrews", pl: "Hebrajczyków", chapters: 13 },
  { eng: "James", pl: "Jakuba", chapters: 5 },
  { eng: "1 Peter", pl: "1 Piotra", chapters: 5 },
  { eng: "2 Peter", pl: "2 Piotra", chapters: 3 },
  { eng: "1 John", pl: "1 Jana", chapters: 5 },
  { eng: "2 John", pl: "2 Jana", chapters: 1 },
  { eng: "3 John", pl: "3 Jana", chapters: 1 },
  { eng: "Jude", pl: "Judy", chapters: 1 },
  { eng: "Revelation", pl: "Objawienie Jana", chapters: 22 },
];

interface ChapterReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const ChapterReadingModal: React.FC<ChapterReadingModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteColors, setFavoriteColors] = useState<Record<string, string>>(
    {},
  );
  const [fontSettings, setFontSettings] = useState({
    fontSize: 18,
    fontFamily: "font-serif",
  });
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [selectedVerseRef, setSelectedVerseRef] = useState<string | null>(null);
  const [selectedVerseText, setSelectedVerseText] = useState<string | null>(
    null,
  );
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorVerse, setGeneratorVerse] = useState<BibleVerse | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFavorites(PersistenceService.loadFavoriteVerses());
      setFavoriteColors(PersistenceService.loadFavoriteVerseColors());
      const loadedFonts = PersistenceService.loadBibleFontSettings();
      setFontSettings({
        fontSize: loadedFonts.fontSize || 18,
        fontFamily: loadedFonts.fontFamily || "font-serif",
      });
    }
  }, [isOpen]);

  const toggleFavorite = (ref: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(ref);
      const newFavs = isFav ? prev.filter((r) => r !== ref) : [...prev, ref];
      PersistenceService.saveFavoriteVerses(newFavs);

      // Remove color if un-favoriting
      if (isFav) {
        setFavoriteColors((prevColors) => {
          const newColors = { ...prevColors };
          delete newColors[ref];
          PersistenceService.saveFavoriteVerseColors(newColors);
          return newColors;
        });
      }

      return newFavs;
    });
  };

  const handleColorChange = (ref: string, color: string) => {
    setFavoriteColors((prev) => {
      const newColors = { ...prev };
      if (color === "transparent") {
        delete newColors[ref];
      } else {
        newColors[ref] = color;
      }
      PersistenceService.saveFavoriteVerseColors(newColors);
      return newColors;
    });
  };

  const increaseFontSize = () => {
    setFontSettings((prev) => {
      const next = { ...prev, fontSize: Math.min(prev.fontSize + 2, 40) };
      PersistenceService.saveBibleFontSettings(next);
      return next;
    });
  };

  const decreaseFontSize = () => {
    setFontSettings((prev) => {
      const next = { ...prev, fontSize: Math.max(prev.fontSize - 2, 12) };
      PersistenceService.saveBibleFontSettings(next);
      return next;
    });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSettings((prev) => {
      const next = { ...prev, fontFamily: e.target.value };
      PersistenceService.saveBibleFontSettings(next);
      return next;
    });
  };

  // Initialize from title on first open
  useEffect(() => {
    if (!isOpen) return;

    // Parse title to extract book and chapter, e.g. "Psalm 23"
    setChapterContent(content);

    let parsedChapter = 1;
    let possibleBookName = title;

    const chapterMatch = title.trim().match(/(.+)\s+(\d+)$/);
    if (chapterMatch) {
      possibleBookName = chapterMatch[1].trim();
      parsedChapter = parseInt(chapterMatch[2], 10);
    }

    // Find book index
    let bookIdx = BIBLE_BOOKS.findIndex(
      (b) =>
        b.pl.toLowerCase() === possibleBookName.toLowerCase() ||
        b.eng.toLowerCase() === possibleBookName.toLowerCase(),
    );

    if (bookIdx === -1) {
      bookIdx = BIBLE_BOOKS.findIndex(
        (b) =>
          b.pl.toLowerCase().includes(possibleBookName.toLowerCase()) ||
          b.eng.toLowerCase().includes(possibleBookName.toLowerCase()),
      );
    }

    if (bookIdx !== -1) {
      setCurrentBookIndex(bookIdx);
      if (!isNaN(parsedChapter)) {
        setCurrentChapter(parsedChapter);
      }
    }
  }, [isOpen, title, content]);

  const loadChapter = async (bIndex: number, chNum: number) => {
    if (bIndex < 0 || bIndex >= BIBLE_BOOKS.length) return;
    const book = BIBLE_BOOKS[bIndex];
    if (chNum < 1 || chNum > book.chapters) return;

    setIsLoading(true);
    setCurrentBookIndex(bIndex);
    setCurrentChapter(chNum);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    try {
      const ref = `${book.pl} ${chNum}`;
      const newContent = await BibleService.getChapter(ref);
      setChapterContent(newContent);
    } catch (e) {
      setChapterContent("Wystąpił błąd podczas pobierania rozdziału.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    const book = BIBLE_BOOKS[currentBookIndex];
    if (currentChapter < book.chapters) {
      loadChapter(currentBookIndex, currentChapter + 1);
    } else if (currentBookIndex < BIBLE_BOOKS.length - 1) {
      loadChapter(currentBookIndex + 1, 1);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 1) {
      loadChapter(currentBookIndex, currentChapter - 1);
    } else if (currentBookIndex > 0) {
      const prevBook = BIBLE_BOOKS[currentBookIndex - 1];
      loadChapter(currentBookIndex - 1, prevBook.chapters);
    }
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIdx = parseInt(e.target.value, 10);
    loadChapter(newIdx, 1);
  };

  const handleShare = async (ref: string, text: string) => {
    const isEnglishVerse = appLanguage === "en" && ref.includes(":");
    const translationInfo = isEnglishVerse
      ? "New International Version (NIV)"
      : appLanguage === "pl"
        ? "Biblia Warszawska (BW)"
        : "Warsaw Bible (BW)";

    const fullContent = `"${text}"\n— ${ref} —\n\n${appLanguage === "pl" ? "Przekład" : "Translation"}: ${translationInfo}\n\n#ChristianCulture | cclite.pl | www.polskieradio.cc |\nPolecam aplikacje Christian Culture w sklepie Google Play: https://play.google.com/store/apps/dev?id=5215448773598149938 \n| Udostępnij Werset Dnia i zostań patronem na https://patronite.pl/osobowoscplus\n| Niech dobry Bóg Cię błogosławi.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Słowo Boże - Christian Culture",
          text: fullContent,
          url: "https://cclite.pl",
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(fullContent);
      window.dispatchEvent(
        new CustomEvent("cc_show_toast", {
          detail: {
            message:
              appLanguage === "pl"
                ? "Skopiowano do schowka"
                : "Copied to clipboard",
            type: "success",
          },
        }),
      );
    }
    setSelectedVerseRef(null);
  };

  const currentBook = BIBLE_BOOKS[currentBookIndex];
  const isFirstChapter = currentBookIndex === 0 && currentChapter === 1;
  const isLastChapter =
    currentBookIndex === BIBLE_BOOKS.length - 1 &&
    currentChapter === currentBook.chapters;

  if (!isOpen) return null;

  const renderVerses = () => {
    if (isLoading) {
      return (
        <p className="opacity-50 transition-opacity">
          {appLanguage === "pl"
            ? "Ładowanie rozdziału..."
            : "Loading chapter..."}
        </p>
      );
    }

    if (!chapterContent) return <p></p>;

    const verses = chapterContent.split("\n\n");
    return verses.map((verseText, idx) => {
      // Wyciągnij numer wersetu (pierwsze słowo to usually numer)
      const verseMatch = verseText.match(/^(\d+)\s+([\s\S]*)/);
      const verseNum = verseMatch ? verseMatch[1] : null;
      const textOnly = verseMatch ? verseMatch[2] : verseText;
      const fullRef = verseNum
        ? `${currentBook.pl} ${currentChapter}:${verseNum}`
        : "";
      const isFav = fullRef && favorites.includes(fullRef);
      const isSelected = selectedVerseRef === fullRef && fullRef !== null;
      const customColor =
        isFav && fullRef ? favoriteColors[fullRef] : undefined;

      const handleDown = () => {
        if (!fullRef) return;
        longPressTimerRef.current = setTimeout(() => {
          setSelectedVerseRef((prev) => (prev === fullRef ? null : fullRef));
          setSelectedVerseText(verseText);
          if (navigator.vibrate) navigator.vibrate(50);
        }, 500);
      };

      const handleUpOrLeave = () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      };

      return (
        <div key={idx} className="flex flex-col mb-4">
          <p
            className={`transition-all duration-300 ${isFav || isSelected ? "px-5 py-4 rounded-2xl -mx-5" : "px-5 py-2 -mx-5 hover:bg-white/[0.02] rounded-2xl"} cursor-pointer select-none relative`}
            style={{
              fontSize: `${fontSettings.fontSize}px`,
              lineHeight: 1.9,
              backgroundColor: isFav
                ? customColor
                  ? `${customColor}26`
                  : "rgba(197, 160, 89, 0.1)"
                : isSelected
                  ? "rgba(255, 255, 255, 0.05)"
                  : "",
              color: isFav ? customColor || "#C5A059" : undefined,
            }}
            onPointerDown={handleDown}
            onPointerUp={handleUpOrLeave}
            onPointerLeave={handleUpOrLeave}
            onPointerCancel={handleUpOrLeave}
            onClick={() => {
              if (isSelected) {
                setSelectedVerseRef(null);
              } else {
                setSelectedVerseRef(fullRef);
                setSelectedVerseText(verseText);
              }
            }}
          >
            {verseNum && (
              <sup className="text-[#C5A059] font-black mr-2.5 text-[0.65em] opacity-80 select-none tracking-tighter align-super">
                {verseNum}
              </sup>
            )}
            <span
              className="font-[450] tracking-wide text-zinc-100/95"
              style={{ color: isFav && customColor ? customColor : undefined }}
            >
              {textOnly}
            </span>
          </p>
          {isSelected && fullRef && selectedVerseText && (
            <div className="flex flex-col gap-2 mt-2 px-4 py-4 bg-zinc-900 border border-[#C5A059]/30 rounded-xl shadow-lg animate-fade-in-scale-up -mx-2 sm:mx-0">
              <div className="flex w-full mb-2 gap-2 justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                {[
                  "#C5A059",
                  "#ef4444",
                  "#f59e0b",
                  "#10b981",
                  "#3b82f6",
                  "#8b5cf6",
                  "#ec4899",
                  "transparent",
                ].map((color) => (
                  <button
                    aria-label="Zamknij"
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFav && color !== "transparent")
                        toggleFavorite(fullRef);
                      handleColorChange(fullRef, color);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[3px] transition-all flex items-center justify-center ${color === "transparent" ? "bg-zinc-800" : ""} ${favoriteColors[fullRef] === color || (!favoriteColors[fullRef] && color === "#C5A059" && isFav) ? "border-white scale-110" : "border-transparent hover:scale-110"}`}
                    style={
                      color !== "transparent" ? { backgroundColor: color } : {}
                    }
                    title={
                      color === "transparent"
                        ? appLanguage === "pl"
                          ? "Wyczyść kolor"
                          : "Clear color"
                        : ""
                    }
                  >
                    {color === "transparent" && (
                      <X className="w-4 h-4 text-zinc-500" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button
                  aria-label="Ulubione"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(fullRef);
                  }}
                  className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase text-[#C5A059] hover:text-white transition-all bg-black/40 px-3 py-2 rounded-lg border border-[#C5A059]/20 flex-1 justify-center whitespace-nowrap"
                >
                  <Heart
                    className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isFav ? "fill-[#C5A059]" : ""}`}
                  />
                  {appLanguage === "pl"
                    ? isFav
                      ? "Usuń"
                      : "Ulubione"
                    : isFav
                      ? "Remove"
                      : "Favorite"}
                </button>
                <button
                  aria-label="Udostępnij"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(fullRef, selectedVerseText);
                  }}
                  className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase text-[#C5A059] hover:text-white transition-all bg-black/40 px-3 py-2 rounded-lg border border-[#C5A059]/20 flex-1 justify-center whitespace-nowrap"
                >
                  <Share2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  {appLanguage === "pl" ? "Udostępnij" : "Share"}
                </button>
                <button
                  aria-label="Kreator Wersetu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGeneratorVerse({
                      reference: fullRef,
                      text: selectedVerseText,
                    });
                    setIsGeneratorOpen(true);
                    setSelectedVerseRef(null);
                  }}
                  className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase text-[#C5A059] hover:text-white transition-all bg-[#C5A059]/20 px-3 py-2 rounded-lg border border-[#C5A059]/40 flex-1 justify-center whitespace-nowrap"
                >
                  <ImageIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  {appLanguage === "pl" ? "Grafika" : "Graphic"}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col animate-fade-in-scale-up text-zinc-100 overflow-hidden">
      {/* STICKY HEADER */}
      <div className="flex-shrink-0 px-6 sm:px-12 py-6 flex justify-between items-center border-b border-[#C5A059]/20 bg-black z-[2101] pt-[calc(1.5rem+env(safe-area-inset-top,0px))]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#C5A059] uppercase tracking-tighter drop-shadow-glow">
            {appLanguage === "pl" ? currentBook.pl : currentBook.eng}{" "}
            {currentChapter}
          </h2>
          <p className="text-[10px] font-bold text-[#C5A059]/70 uppercase tracking-widest mt-1">
            {appLanguage === "pl"
              ? "Przytrzymaj werset, by otworzyć narzędzia"
              : "Long press verse to open tools"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* FONT SETTINGS BUTTON */}
          <div className="relative">
            <button
              onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
              className={`p-3 rounded-full border transition-all shadow-xl active:scale-95 shrink-0 ${isFontMenuOpen ? "bg-zinc-900 text-[#C5A059] border-[#C5A059]/50" : "bg-black text-zinc-400 hover:text-[#C5A059] border-zinc-800"}`}
              title={
                appLanguage === "pl" ? "Ustawienia czcionki" : "Font settings"
              }
            >
              <Type className="w-6 h-6" strokeWidth={2} />
            </button>
            {isFontMenuOpen && (
              <div className="absolute top-full right-0 mt-4 p-5 bg-black border border-[#C5A059]/40 rounded-2xl shadow-2xl flex flex-col gap-4 w-64 animate-fade-in z-[3000]">
                <h3 className="text-[#C5A059] font-black uppercase tracking-widest text-[10px]">
                  {appLanguage === "pl" ? "Wielkość" : "Size"}
                </h3>
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={decreaseFontSize}
                    className="p-2 bg-black rounded-lg text-zinc-400 hover:text-white border border-white/5 active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-zinc-300">
                    {fontSettings.fontSize}px
                  </span>
                  <button
                    onClick={increaseFontSize}
                    className="p-2 bg-black rounded-lg text-zinc-400 hover:text-white border border-white/5 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-[#C5A059] font-black uppercase tracking-widest text-[10px] mt-2">
                  {appLanguage === "pl" ? "Krój pisma" : "Font"}
                </h3>
                <select
                  value={fontSettings.fontFamily}
                  onChange={handleFontFamilyChange}
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-zinc-300 text-sm focus:border-[#C5A059] outline-none"
                >
                  <option value="font-sans">Inter (Sans-serif)</option>
                  <option value="font-bible">Lora (Serif)</option>
                  <option value="font-mono">JetBrains (Mono)</option>
                </select>
              </div>
            )}
          </div>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-3 bg-zinc-900 rounded-full text-zinc-400 hover:text-[#C5A059] border border-zinc-800 transition-all shadow-xl active:scale-95 shrink-0"
            title={appLanguage === "pl" ? "Zamknij" : "Close"}
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 sm:p-12 lg:px-24 scrollbar-thin"
      >
        <div
          className={`max-w-[720px] mx-auto prose prose-invert prose-p:text-zinc-100 prose-p:leading-[1.9] text-lg whitespace-pre-wrap pb-32 ${fontSettings.fontFamily}`}
        >
          {renderVerses()}
        </div>
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="flex-shrink-0 px-4 sm:px-12 py-4 flex flex-col items-center border-t border-[#C5A059]/20 bg-black gap-4 mb-safe pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 sm:gap-4 max-w-xl w-full">
          <button
            aria-label="Wstecz"
            onClick={handlePrev}
            disabled={isFirstChapter}
            className="p-2 bg-black rounded-full text-zinc-400 hover:text-[#C5A059] disabled:opacity-30 transition-all border border-[#C5A059]/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex justify-center items-center gap-2">
            <select
              value={currentBookIndex}
              onChange={handleBookChange}
              className="bg-gradient-to-b from-zinc-900 to-black border border-[#C5A059]/30 shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.8)] text-[#C5A059] text-sm sm:text-base font-black uppercase tracking-tight rounded-xl px-2 sm:px-4 py-3 appearance-none text-center hover:border-[#C5A059] cursor-pointer outline-none w-full max-w-[200px]"
            >
              {BIBLE_BOOKS.map((b, i) => (
                <option key={i} value={i}>
                  {appLanguage === "pl" ? b.pl : b.eng}
                </option>
              ))}
            </select>

            <select
              value={currentChapter}
              onChange={(e) =>
                loadChapter(currentBookIndex, parseInt(e.target.value, 10))
              }
              className="bg-gradient-to-b from-zinc-900 to-black border border-[#C5A059]/30 shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.8)] text-zinc-100 text-sm sm:text-base font-black uppercase rounded-xl px-2 sm:px-4 py-3 appearance-none text-center hover:border-[#C5A059] cursor-pointer outline-none w-16"
            >
              {Array.from(
                { length: currentBook.chapters },
                (_, i) => i + 1,
              ).map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>

          <button
            aria-label="Dalej"
            onClick={handleNext}
            disabled={isLastChapter}
            className="p-2 bg-black rounded-full text-zinc-400 hover:text-[#C5A059] disabled:opacity-30 transition-all border border-[#C5A059]/20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* PROMINENT CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="w-full max-w-xl py-4 bg-black text-[#C5A059] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#C5A059]/10 transition-all border border-[#C5A059]/30 shadow-xl active:scale-95 flex items-center justify-center gap-2"
        >
          {appLanguage === "pl" ? "ZAMKNIJ BIBLIĘ" : "CLOSE BIBLE"}
        </button>
      </div>

      {generatorVerse && (
        <VerseImageGeneratorModal
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          verse={generatorVerse}
          appLanguage={appLanguage}
          addToast={(message, type) => {
            window.dispatchEvent(
              new CustomEvent("cc_show_toast", { detail: { message, type } }),
            );
          }}
          isTickerExpanded={isTickerExpanded}
        />
      )}
    </div>
  );
};
