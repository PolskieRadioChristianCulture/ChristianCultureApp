import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { BibleService } from "../services/bibleService";
import { PersistenceService } from "../services/persistenceService";
import { CheckCircle, BookOpen } from "lucide-react";

interface BibleReadingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  onConfirmRead: () => void;
}

const BIBLE_BOOKS = [
  { name: "Rodzaju", chapters: 50 }, { name: "Wyjścia", chapters: 40 }, { name: "Kapłańska", chapters: 27 },
  { name: "Liczb", chapters: 36 }, { name: "Powtórzonego Prawa", chapters: 34 }, { name: "Jozuego", chapters: 24 },
  { name: "Sędziów", chapters: 21 }, { name: "Rut", chapters: 4 }, { name: "1 Samuela", chapters: 31 },
  { name: "2 Samuela", chapters: 24 }, { name: "1 Królewska", chapters: 22 }, { name: "2 Królewska", chapters: 25 },
  { name: "1 Kronik", chapters: 29 }, { name: "2 Kronik", chapters: 36 }, { name: "Ezdrasza", chapters: 10 },
  { name: "Nehemiasza", chapters: 13 }, { name: "Estery", chapters: 10 }, { name: "Hioba", chapters: 42 },
  { name: "Psalmów", chapters: 150 }, { name: "Przysłów", chapters: 31 }, { name: "Kaznodziei", chapters: 12 },
  { name: "Pieśń nad Pieśniami", chapters: 8 }, { name: "Izajasza", chapters: 66 }, { name: "Jeremiasza", chapters: 52 },
  { name: "Treny", chapters: 5 }, { name: "Ezechiela", chapters: 48 }, { name: "Daniela", chapters: 12 },
  { name: "Ozeasza", chapters: 14 }, { name: "Joela", chapters: 3 }, { name: "Amosa", chapters: 9 },
  { name: "Abdiasza", chapters: 1 }, { name: "Jonasza", chapters: 4 }, { name: "Micheasza", chapters: 7 },
  { name: "Nahuma", chapters: 3 }, { name: "Habakuka", chapters: 3 }, { name: "Sofoniasza", chapters: 3 },
  { name: "Aggeusza", chapters: 2 }, { name: "Zachariasza", chapters: 14 }, { name: "Malachiasza", chapters: 4 },
  { name: "Mateusza", chapters: 28 }, { name: "Marka", chapters: 16 }, { name: "Łukasza", chapters: 24 },
  { name: "Jana", chapters: 21 }, { name: "Dzieje", chapters: 28 }, { name: "Rzymian", chapters: 16 },
  { name: "1 Koryntian", chapters: 16 }, { name: "2 Koryntian", chapters: 13 }, { name: "Galatów", chapters: 6 },
  { name: "Efezjan", chapters: 6 }, { name: "Filipian", chapters: 4 }, { name: "Kolosan", chapters: 4 },
  { name: "1 Tesaloniczan", chapters: 5 }, { name: "2 Tesaloniczan", chapters: 3 }, { name: "1 Tymoteusza", chapters: 6 },
  { name: "2 Tymoteusza", chapters: 4 }, { name: "Tytusa", chapters: 3 }, { name: "Filemona", chapters: 1 },
  { name: "Hebrajczyków", chapters: 13 }, { name: "Jakuba", chapters: 5 }, { name: "1 Piotra", chapters: 5 },
  { name: "2 Piotra", chapters: 3 }, { name: "1 Jana", chapters: 5 }, { name: "2 Jana", chapters: 1 },
  { name: "3 Jana", chapters: 1 }, { name: "Judy", chapters: 1 }, { name: "Objawienie", chapters: 22 }
];

function getChaptersForDay(dayOfYear: number): string[] {
  // Budujemy płaską listę wszystkich rozdziałów: ["Rodzaju 1", "Rodzaju 2", ...]
  const allChapters: string[] = [];
  for (const book of BIBLE_BOOKS) {
    for (let c = 1; c <= book.chapters; c++) {
      allChapters.push(`${book.name} ${c}`);
    }
  }

  // Rozkładamy 1189 rozdziałów na 365 dni (około 3.25 bezresztowo)
  // Wzór: startIdx = Math.floor(dayOfYear * (1189 / 365)), limit dzienny ok 3-4
  const TOTAL_CHAPTERS = allChapters.length; // 1189
  const DAYS_IN_YEAR = 365;
  
  // dayOfYear jest 0-indexed dla tablicy 365 dni
  const dayIndex = Math.min(Math.max(0, dayOfYear - 1), DAYS_IN_YEAR - 1);
  
  const startIdx = Math.floor(dayIndex * (TOTAL_CHAPTERS / DAYS_IN_YEAR));
  const endIdx = Math.floor((dayIndex + 1) * (TOTAL_CHAPTERS / DAYS_IN_YEAR));
  
  return allChapters.slice(startIdx, endIdx);
}

export const BibleReadingPlanModal: React.FC<BibleReadingPlanModalProps> = ({
  isOpen,
  onClose,
  date,
  onConfirmRead,
}) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const checkReadStatus = async () => {
      const status = PersistenceService.safeGetItem(
        `bible_reading_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`,
        "",
      );
      setIsRead(status === "true");
    };

    const fetchChapters = async () => {
      setIsLoading(true);
      try {
        // Obliczamy dzień roku (1-365)
        const start = new Date(date.getFullYear(), 0, 0);
        const diff =
          date.getTime() -
          start.getTime() +
          (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        const chaptersToRead = getChaptersForDay(dayOfYear);

        let fullText = "";
        for (const ch of chaptersToRead) {
          const result = await BibleService.getChapter(ch);
          fullText += `\n\n=== ${ch.toUpperCase()} ===\n\n` + result;
        }

        setContent(fullText || "Nie udało się załadować wersetów na dzisiaj.");
      } catch (error) {
        console.error(error);
        setContent("Wystąpił błąd podczas ładowania rozdziałów.");
      } finally {
        setIsLoading(false);
      }
    };

    checkReadStatus();
    fetchChapters();
  }, [isOpen, date]);

  const handleConfirm = () => {
    PersistenceService.safeSetItem(
      `bible_reading_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`,
      "true",
    );
    setIsRead(true);
    onConfirmRead();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent overlayClassName="z-[10500]" className="sm:max-w-[700px] bg-black border-2 border-[#C5A059]/30 text-white rounded-[2rem] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[11000]">
        <DialogTitle className="sr-only">Odczyt Biblijny na Dziś</DialogTitle>
        <div className="flex flex-col h-[80vh] max-h-[800px]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-zinc-900 via-black to-zinc-900">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl border transition-all ${isRead ? "bg-emerald-600/20 text-emerald-500 border-emerald-500/50 shadow-[0_0_15px_rgba(5,150,105,0.4)]" : "bg-red-900/20 text-red-600 border-red-900/50 shadow-[0_0_15px_rgba(153,27,27,0.4)]"}`}
              >
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-[#C5A059]">
                  Słowo na dziś
                </h2>
                <p className="text-xs font-bold text-zinc-500 tracking-wider">
                  {date.toLocaleDateString("pl-PL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {isRead && (
              <div className="flex items-center gap-2 bg-emerald-900/30 text-emerald-400 px-4 py-2 rounded-full border border-emerald-800/50">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Przeczytane
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 sm:p-8 bg-zinc-950/80 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 rounded-full border-t-2 border-[#C5A059] animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] animate-pulse">
                  Ładowanie Słowa Bożego...
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <p className="text-lg sm:text-xl font-bible text-zinc-200 leading-[1.8] sm:leading-[2] whitespace-pre-wrap">
                  {content}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-zinc-900/30 backdrop-blur-md flex justify-center">
            <button
              onClick={handleConfirm}
              disabled={isLoading || isRead}
              className={`relative overflow-hidden w-full max-w-sm py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 active:scale-95 flex items-center justify-center gap-3
                ${
                  isRead
                    ? "bg-emerald-600/10 text-emerald-500 border border-emerald-500/30 cursor-not-allowed"
                    : "bg-red-800 hover:bg-red-700 text-white border border-red-500 shadow-[0_0_30px_rgba(153,27,27,0.4)]"
                }
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              {isRead ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Rozświetlenie Potwierdzone</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>Zatwierdź Rozświetlenie</span>
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
