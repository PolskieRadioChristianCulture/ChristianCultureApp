import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Share2, X, RefreshCw, Lightbulb, Link2Off } from "lucide-react";
import { Rnd } from "react-rnd";
import { SupportedLanguage } from "../types";
import { useWidgetSync } from "../hooks/useWidgetSync";
import { useAppStore } from "../useAppStore";

interface Props {
  appLanguage: SupportedLanguage;
}

interface Tip {
  text: string;
  dateAdded: string; // YYYY-MM-DD
}

const TIPS_PL: Tip[] = [
  {
    text: "Czy wiesz, że klikając w logo CC możesz włączyć tryb pełnoekranowy (Immersive Mode), aby skupić się tylko na Słowie i muzyce?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Czy wiesz, że Studio Wyobraźni pozwala na generowanie chrześcijańskich obrazów za pomocą zaawansowanej sztucznej inteligencji?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Czy wiesz, że w prawym panelu znajdziesz w pełni funkcjonalną Szkołę Biblijną z poziomami od podstaw do zaawansowanej teologii?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Czy wiesz, że wszystkie Twoje notatki i postępy pozostają w 100% prywatne i są zapisane bezpiecznie na Twoim urządzeniu?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Czy wiesz, że LIVE GLOBAL pozwala Ci w czasie rzeczywistym zobaczyć mapę Wojowników Chrystusa, z którymi dzielisz tę samą audycję?",
    dateAdded: "2026-03-01",
  },
  {
    text: "Czy wiesz, że możesz swobodnie reorganizować swój ekran, dodając i zarządzając nowymi Kafelkami z bocznego menu (przycisk +)?",
    dateAdded: "2026-04-25",
  },
  {
    text: "Czy wiesz, że każdego dnia czeka na Ciebie nowy Werset Dnia? Możesz wygenerować z niego piękny obraz i udostępnić jako ewangelizację!",
    dateAdded: "2026-04-20",
  },
  {
    text: "Czy wiesz, że asystent głosowy wita Cię rano, w południe i wieczorem, dostosowując przesłanie do pory dnia?",
    dateAdded: "2026-04-10",
  },
  {
    text: "Czy wiesz, że budujemy to narzędzie całkowicie oddolnie dla Jezusa? Twoja modlitwa o ten projekt to nasz najsilniejszy oręż.",
    dateAdded: "2026-01-01",
  },
];

const TIPS_EN: Tip[] = [
  {
    text: "Did you know that by clicking the CC logo you can enable Immersive Mode to focus solely on the Word and music?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Did you know that the Imagination Studio allows you to generate Christian images using advanced AI?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Did you know that in the right panel you will find a fully functional Bible School with levels from basics to advanced theology?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Did you know that all your notes and progress remain 100% private and are stored securely on your device?",
    dateAdded: "2026-01-01",
  },
  {
    text: "Did you know that LIVE GLOBAL lets you view a real-time anonymous map of Warriors of Christ sharing the same broadcast?",
    dateAdded: "2026-03-01",
  },
  {
    text: "Did you know that you can freely reorganize your screen by adding and moving Tiles from the side menu (+ button)?",
    dateAdded: "2026-04-25",
  },
  {
    text: "Did you know that a new Verse of the Day awaits you every day? You can generate a beautiful image of it and share it to evangelize!",
    dateAdded: "2026-04-20",
  },
  {
    text: "Did you know that the voice assistant greets you in the morning, noon, and evening, adjusting the message to the time of day?",
    dateAdded: "2026-04-10",
  },
  {
    text: "Did you know that we are building this tool entirely from the ground up for Jesus? Your prayer for this project is our strongest weapon.",
    dateAdded: "2026-01-01",
  },
];

export const DidYouKnowWidget: React.FC<Props> = ({ appLanguage }) => {
  const areAllWidgetsHidden = useAppStore((state) => state.areAllWidgetsHidden);
  const {
    position,
    size,
    groupId,
    isGroupMinimized,
    onDrag,
    onDragStop,
    onResizeStop,
    ungroup,
    minimizeGroup,
  } = useWidgetSync(
    "didyouknow",
    { x: 40, y: 160 },
    { width: 340, height: "auto" },
  );

  const [isForcedVisible, setIsForcedVisible] = useState(
    () => localStorage.getItem("cc_widget_didyouknow_visible") === "true",
  );
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = appLanguage === "pl" ? TIPS_PL : TIPS_EN;

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, [quotes.length]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsForcedVisible(
        localStorage.getItem("cc_widget_didyouknow_visible") === "true",
      );
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cc_widgets_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cc_widgets_updated", handleStorageChange);
    };
  }, []);

  const closeWidget = () => {
    setIsForcedVisible(false);
    localStorage.setItem("cc_widget_didyouknow_visible", "false");
    window.dispatchEvent(new Event("cc_widgets_updated"));
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const shareQuote = async () => {
    const text = `${quotes[quoteIndex].text} - Christian Culture`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Christian Culture Info",
          text: text,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  if (!isForcedVisible || !position || isGroupMinimized || areAllWidgetsHidden)
    return null;

  const currentQuoteObj = quotes[quoteIndex];
  const currentQuote = currentQuoteObj.text;

  // Check if tip is less than 30 days old
  const isNew = (() => {
    const dateAdded = new Date(currentQuoteObj.dateAdded);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateAdded.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 30;
  })();

  const WidgetContent = (
    <div className="w-full h-full relative rounded-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/90 backdrop-blur-xl border border-[#C5A059]/30 shadow-2xl overflow-hidden flex flex-col p-5">
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#C5A059]/10 to-transparent pointer-events-none" />

      {isNew && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] py-1 text-center shadow-md z-20">
          NOWOŚĆ
        </div>
      )}

      <div
        className={`relative z-10 flex items-center justify-between mb-4 drag-handle cursor-move ${isNew ? "mt-4" : ""}`}
      >
        <h3 className="text-[#C5A059] text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />{" "}
          {appLanguage === "pl" ? "Czy wiesz, że..." : "Did you know..."}
        </h3>
        <button
          aria-label="Zamknij"
          onClick={closeWidget}
          className="text-zinc-400 hover:text-white transition-colors drag-cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center my-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-white text-center font-medium leading-relaxed font-sans"
          >
            {currentQuote}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-[#C5A059]/20 drag-cancel">
        <div className="flex items-center gap-3">
          <button
            aria-label="Udostępnij"
            onClick={shareQuote}
            className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {groupId && (
            <button
              onClick={ungroup}
              title={appLanguage === "pl" ? "Rozgrupuj" : "Ungroup"}
              className="text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1 text-xs px-2 py-1 bg-white/5 rounded-md"
            >
              <Link2Off className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={nextQuote}
          className="w-8 h-8 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return createPortal(
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      minWidth={280}
      minHeight={160}
      bounds="window"
      className="!fixed z-[50]"
      cancel=".drag-cancel"
      dragHandleClassName="drag-handle"
    >
      {WidgetContent}
    </Rnd>,
    document.body,
  );
};
