import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Share2, X, RefreshCw, Link2Off } from "lucide-react";
import { Rnd } from "react-rnd";
import { SupportedLanguage } from "../types";
import { useWidgetSync } from "../hooks/useWidgetSync";
import { useAppStore } from "../useAppStore";

interface Props {
  appLanguage: SupportedLanguage;
}

const MOTIVATIONS_PL = [
  "Bóg nie powołuje uzdolnionych, On uzdalnia powołanych.",
  "Największa bitwa, jaką toczysz, to bitwa o Twój własny umysł. Pokonaj Goliata w swojej głowie.",
  "Twoja przeszłość nie definiuje Twojej przyszłości w Chrystusie.",
  "Nie pytaj Boga dlaczego, pytaj czego chce Cię przez to nauczyć.",
  "Jesteś Wojownikiem Chrystusa. Podnieś głowę i walcz, bo zwycięstwo jest po stronie Światła.",
  "Nie bój się burzy. Modlitwa to Twoja kotwica.",
  "Każdy dzień to nowa łaska. Zrób to dla Jezusa.",
];

const MOTIVATIONS_EN = [
  "God does not call the qualified, He qualifies the called.",
  "The greatest battle you fight is the battle for your own mind. Defeat the Goliath in your head.",
  "Your past does not define your future in Christ.",
  "Don't ask God why, ask what He wants to teach you through it.",
  "You are a Warrior of Christ. Lift your head and fight, for victory is on the side of the Light.",
  "Do not fear the storm. Prayer is your anchor.",
  "Every day is a new grace. Do it for Jesus.",
];

export const SpiritualMotivationWidget: React.FC<Props> = ({ appLanguage }) => {
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
    "motivation",
    { x: window.innerWidth > 1024 ? window.innerWidth - 360 : 40, y: 140 },
    { width: 320, height: "auto" },
  );

  const [isForcedVisible, setIsForcedVisible] = useState(
    () => localStorage.getItem("cc_widget_motivation_visible") === "true",
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const quotes = appLanguage === "pl" ? MOTIVATIONS_PL : MOTIVATIONS_EN;

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, [quotes.length]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsForcedVisible(
        localStorage.getItem("cc_widget_motivation_visible") === "true",
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
    localStorage.setItem("cc_widget_motivation_visible", "false");
    window.dispatchEvent(new Event("cc_widgets_updated"));
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
    setIsFavorite(false);
  };

  const shareQuote = async () => {
    const text = `${quotes[quoteIndex]} - Christian Culture`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Christian Culture Motivation",
          text: text,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      // Fallback: could use a toast here if we pass down a toast function
    }
  };

  if (!isForcedVisible || !position || isGroupMinimized || areAllWidgetsHidden)
    return null;

  const currentQuote = quotes[quoteIndex];

  const WidgetContent = (
    <div className="w-full h-full relative rounded-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/80 backdrop-blur-xl border border-[#C5A059]/30 shadow-2xl overflow-hidden flex flex-col p-5">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-900/50 to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-4 drag-handle cursor-move">
        <h3 className="text-[#C5A059] text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <span>⚔️</span>{" "}
          {appLanguage === "pl" ? "Duchowa Motywacja" : "Spiritual Motivation"}
        </h3>
        <button
          aria-label="Zamknij"
          onClick={closeWidget}
          className="text-zinc-400 hover:text-white transition-colors drag-cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center my-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-white text-center font-medium leading-relaxed italic"
          >
            "{currentQuote}"
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-[#C5A059]/20 drag-cancel">
        <div className="flex items-center gap-3">
          <button
            aria-label="Ulubione"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`transition-colors ${isFavorite ? "text-red-500" : "text-zinc-400 hover:text-red-400"}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            aria-label="Udostępnij"
            onClick={shareQuote}
            className="text-zinc-400 hover:text-blue-400 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {groupId && (
            <button
              onClick={ungroup}
              title={appLanguage === "pl" ? "Rozgrupuj" : "Ungroup"}
              className="text-zinc-400 hover:text-red-400 transition-colors flex items-center justify-center p-1 bg-white/5 rounded-md"
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
      minHeight={180}
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
