import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Gamepad2,
  Brain,
  Puzzle,
  Trophy,
  Star,
  ChevronRight,
  Play,
  Grid,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { SupportedLanguage } from "../types";

interface GamesPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
}

interface ChristianGame {
  id: string;
  title: { pl: string; en: string };
  description: { pl: string; en: string };
  difficulty: "easy" | "medium" | "hard";
  icon: React.ReactNode;
  category: "quiz" | "puzzle" | "logic" | "crossword";
}

const CHRISTIAN_GAMES: ChristianGame[] = [
  {
    id: "bible_crossword",
    title: { pl: "BIBLIJNE KRZYŻÓWKI", en: "BIBLE CROSSWORD" },
    description: {
      pl: "Rozwiązuj biblijne zagadki i odkrywaj ukryte przesłania Słowa.",
      en: "Solve biblical riddles and discover hidden messages of the Word.",
    },
    difficulty: "medium",
    icon: <Grid className="w-6 h-6" />,
    category: "crossword",
  },
  {
    id: "bible_quiz",
    title: { pl: "QUIZ BIBLIJNY", en: "BIBLE QUIZ" },
    description: {
      pl: "Sprawdź swoją znajomość Słowa Bożego w dynamicznym teleturnieju.",
      en: "Test your knowledge of the Word of God in a dynamic game show.",
    },
    difficulty: "medium",
    icon: <Brain className="w-6 h-6" />,
    category: "quiz",
  },
  {
    id: "puzzle_cross",
    title: { pl: "PUZZLE NADZIEI", en: "PUZZLES OF HOPE" },
    description: {
      pl: "Układaj piękne krajobrazy i biblijne sceny w ciszy i modlitwie.",
      en: "Solve beautiful landscapes and biblical scenes in silence and prayer.",
    },
    difficulty: "easy",
    icon: <Puzzle className="w-6 h-6" />,
    category: "puzzle",
  },
  {
    id: "warrior_logic",
    title: { pl: "LOGIKA WOJOWNIKA", en: "WARRIOR LOGIC" },
    description: {
      pl: 'Strategiczne wyzwania oparte na zasadach z "Pokonać Goliata".',
      en: 'Strategic challenges based on principles from "Defeating Goliath".',
    },
    difficulty: "hard",
    icon: <Gamepad2 className="w-6 h-6" />,
    category: "logic",
  },
];

// --- Bible Crossword Game Component ---
const BibleCrosswordGame: React.FC<{ appLanguage: SupportedLanguage }> = ({
  appLanguage,
}) => {
  const [solved, setSolved] = useState<string[]>([]);
  const puzzles = [
    {
      id: "1",
      question:
        appLanguage === "pl" ? "Kto pokonał Goliata?" : "Who defeated Goliath?",
      answer: "DAWID",
    },
    {
      id: "2",
      question:
        appLanguage === "pl"
          ? "Pierwszy ogród w Biblii?"
          : "First garden in the Bible?",
      answer: "EDEN",
    },
    {
      id: "3",
      question:
        appLanguage === "pl"
          ? "Co spadło z nieba dla Izraelitów?"
          : "What fell from heaven for the Israelites?",
      answer: "MANNA",
    },
    {
      id: "4",
      question:
        appLanguage === "pl" ? "Matka Jahwe Jezusa?" : "Mother of Lord Jesus?",
      answer: "MARYJA",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#E2B859] mb-2 uppercase tracking-tighter">
          {appLanguage === "pl"
            ? "BIBLIJNE KRZYŻÓWKI v1.0"
            : "BIBLE CROSSWORD v1.0"}
        </h2>
        <div className="h-1 w-24 bg-[#C5A059] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {puzzles.map((p) => (
          <div
            key={p.id}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-start text-left"
          >
            <span className="text-[10px] font-black text-[#C5A059] mb-2 opacity-60">
              ZAGADKA #{p.id}
            </span>
            <p className="text-white font-medium mb-4">{p.question}</p>
            {solved.includes(p.id) ? (
              <div className="w-full p-2 bg-[#C5A059]/20 border border-[#C5A059]/50 rounded-lg text-[#C5A059] font-black text-center tracking-widest">
                {p.answer}
              </div>
            ) : (
              <button
                onClick={() => setSolved([...solved, p.id])}
                className="w-full p-2 bg-[#C5A059] hover:bg-[#E2B859] text-black font-black rounded-lg transition-all text-xs tracking-widest"
              >
                {appLanguage === "pl" ? "ODKRYJ" : "REVEAL"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/5 max-w-md italic text-zinc-500 text-sm">
        {appLanguage === "pl"
          ? '"Bo Słowo Boże jest żywe i skuteczne..." - Hebrajczyków 4:12'
          : '"For the word of God is alive and active..." - Hebrews 4:12'}
      </div>
    </div>
  );
};

export const GamesPortalModal: React.FC<GamesPortalModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  if (!isOpen) return null;

  const renderActiveGame = () => {
    switch (activeGameId) {
      case "bible_crossword":
        return <BibleCrosswordGame appLanguage={appLanguage} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#C5A059] mb-6 border border-white/10">
              <Play className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase">
              {appLanguage === "pl" ? "Tryb Immersji" : "Immersive Mode"}
            </h3>
            <p className="text-zinc-500 max-w-sm mb-8">
              {appLanguage === "pl"
                ? "Ta gra jest właśnie przygotowywana do Twojej dyspozycji. Zrób to Dla Jezusa!"
                : "This game is currently being prepared for your disposal. Do it For Jesus!"}
            </p>
            <button
              onClick={() => setActiveGameId(null)}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold transition-all uppercase tracking-widest text-[10px]"
            >
              {appLanguage === "pl" ? "WRÓĆ DO LISTY" : "BACK TO LIST"}
            </button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-0 bg-black backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: activeGameId ? 1 : 0.9, y: activeGameId ? 0 : 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className={`relative w-full h-full bg-[#080808] ${!activeGameId ? "md:max-w-5xl md:h-[90vh] md:rounded-[40px] border border-[#C5A059]/30" : "rounded-0 border-0"} overflow-hidden shadow-[0_0_100px_rgba(197,160,89,0.15)] flex flex-col transition-all duration-500`}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#C5A059]/10 via-transparent to-transparent">
            <div className="flex items-center gap-4">
              {activeGameId ? (
                <button
                  onClick={() => setActiveGameId(null)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all group"
                  title={appLanguage === "pl" ? "Wróć" : "Back"}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059] flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                  <Gamepad2 className="w-7 h-7 text-black" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-black text-[#E2B859] tracking-tighter uppercase leading-none">
                  {activeGameId
                    ? CHRISTIAN_GAMES.find((g) => g.id === activeGameId)?.title[
                        appLanguage
                      ]
                    : appLanguage === "pl"
                      ? "GRY CHRZEŚCIJAŃSKIE"
                      : "CHRISTIAN GAMES"}
                </h2>
                <p className="text-[9px] text-[#C5A059] font-bold uppercase tracking-[0.25em] mt-1 opacity-70">
                  {activeGameId
                    ? "Immersive Game Session"
                    : appLanguage === "pl"
                      ? "Edukacja przez rozrywkę dla Jezusa"
                      : "Education through entertainment for Jesus"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeGameId && (
                <button
                  onClick={() => {}} // Could reset game state
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10"
                >
                  <RotateCcw className="w-5 h-5 text-zinc-400" />
                </button>
              )}
              <button
                aria-label="Zamknij"
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 group ml-2"
              >
                <X className="w-6 h-6 text-zinc-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin relative">
            <AnimatePresence mode="wait">
              {activeGameId ? (
                <motion.div
                  key="game-room"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-full w-full bg-gradient-to-b from-black to-[#111]"
                >
                  {renderActiveGame()}
                </motion.div>
              ) : (
                <motion.div
                  key="game-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {CHRISTIAN_GAMES.map((game, idx) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setActiveGameId(game.id)}
                      className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-[#C5A059]/5 hover:border-[#C5A059]/50 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-24 h-24 text-[#C5A059]" />
                      </div>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black transition-all">
                            {game.icon}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star
                              className={`w-3 h-3 ${game.difficulty === "easy" ? "text-[#C5A059]" : "text-zinc-600"}`}
                            />
                            <Star
                              className={`w-3 h-3 ${game.difficulty !== "easy" ? "text-[#C5A059]" : "text-zinc-600"}`}
                            />
                            <Star
                              className={`w-3 h-3 ${game.difficulty === "hard" ? "text-[#C5A059]" : "text-zinc-600"}`}
                            />
                          </div>
                        </div>

                        <h3 className="text-xl font-black text-white group-hover:text-[#E2B859] transition-colors uppercase tracking-tight">
                          {game.title[appLanguage]}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-2 mb-8 line-clamp-2">
                          {game.description[appLanguage]}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest px-3 py-1 bg-[#C5A059]/10 rounded-full">
                            {game.category}
                          </span>
                          <div className="flex items-center gap-2 text-[#C5A059] group-hover:gap-4 transition-all">
                            <span className="text-xs font-black uppercase tracking-widest">
                              {appLanguage === "pl" ? "GRAJ" : "PLAY"}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Coming Soon Placeholder */}
                  <div className="p-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center text-center opacity-40">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 mb-4">
                      <Play className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                      {appLanguage === "pl"
                        ? "Wkrótce nowe wyzwania..."
                        : "New challenges coming soon..."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Info */}
          {!activeGameId && (
            <div className="p-6 border-t border-white/5 bg-black/40 text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                {appLanguage === "pl"
                  ? "Wszystko, co robisz, czyń z serca, jak dla Jahwe"
                  : "Whatever you do, work at it with all your heart, as for the Lord"}
              </p>
              <p className="text-[8px] text-zinc-700 mt-2">Kolosan 3:23 (BW)</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GamesPortalModal;
