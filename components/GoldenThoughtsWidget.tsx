import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Quote,
  Share2,
  X,
  RefreshCw,
  Heart,
  Link2Off,
  ChevronDown,
} from "lucide-react";
import { Rnd } from "react-rnd";
import { SupportedLanguage } from "../types";
import { useWidgetSync } from "../hooks/useWidgetSync";
import { useAppStore } from "../useAppStore";

interface Props {
  appLanguage: SupportedLanguage;
}

const THOUGHTS_PL = [
  "Twoim przeznaczeniem nie jest ucieczka, ale zwycięstwo. Pokonaj swojego Goliata.",
  "Goliat upada nie dlatego, że jest słaby, ale dlatego, że Ty masz silniejszego Boga.",
  "Wojownik płacze w ukryciu przed Bogiem, ale walczy mężnie przed ludźmi.",
  "Każdy kamień w Twojej torbie ma znaczenie. Nie marnuj go na lęk, użyj go do walki.",
  "Bóg nie szuka gigantów, On szuka tych, którzy ufają Gigantowi z Niebios.",
  "Twój strach karmi Goliata. Twoja wiara go zabija.",
  "Odwaga to nie brak lęku, ale świadomość, że Bóg jest z Tobą w samym centrum bitwy.",
  "Prawdziwy Wojownik wie, że bez modlitwy każda zbroja jest tylko ciężarem.",
  "Nie licz swoich problemów, licz obietnice Boże. One są większe niż Twój przeciwnik.",
  "Tworzymy autonomiczny, chrześcijański system operacyjny Christian Culture - multimedialną, globalną platformę społecznościową na najwyższym światowym, profesjonalnym poziomie w każdym aspekcie.",
  "Zrób to Dla Jezusa – On już czeka na Twój krok wiary.",
];

const THOUGHTS_EN = [
  "Your destiny is not flight, but victory. Defeat your Goliath.",
  "Goliath falls not because he is weak, but because you have a stronger God.",
  "A warrior cries in secret before God, but fights bravely before men.",
  "Every stone in your bag matters. Don't waste it on fear, use it to fight.",
  "God is not looking for giants, He is looking for those who trust the Giant from Heaven.",
  "Your fear feeds Goliath. Your faith kills him.",
  "Courage is not the absence of fear, but the knowledge that God is with you in the center of the battle.",
  "A true Warrior knows that without prayer, every armor is just a burden.",
  "Do not count your problems, count God's promises. They are greater than your opponent.",
  "We are creating an autonomous, Christian operating system Christian Culture - a multimedia, global social platform at the highest global, professional level in every aspect.",
  "Do it for Jesus – He is already waiting for your step of faith.",
];

export const GoldenThoughtsWidget: React.FC<Props> = ({ appLanguage }) => {
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
    "golden_thoughts",
    { x: 40, y: 150 },
    { width: 320, height: "auto" },
  );

  const [isVisible, setIsVisible] = useState(() => {
    const stored = localStorage.getItem("cc_widget_golden_thoughts_visible");
    return stored === "true";
  });

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const thoughts = appLanguage === "pl" ? THOUGHTS_PL : THOUGHTS_EN;

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * thoughts.length));
  }, [thoughts.length]);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("cc_widget_golden_thoughts_visible");
      setIsVisible(stored === "true");
    };
    window.addEventListener("cc_widgets_updated", handleUpdate);
    return () => window.removeEventListener("cc_widgets_updated", handleUpdate);
  }, []);

  const closeWidget = () => {
    setIsVisible(false);
    localStorage.setItem("cc_widget_golden_thoughts_visible", "false");
    window.dispatchEvent(new Event("cc_widgets_updated"));
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % thoughts.length);
    setIsFavorite(false);
  };

  const shareQuote = async () => {
    const text = `„${thoughts[quoteIndex]}” - Cezary Rogowski, Pokonać Goliata`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Złota Myśl - Pokonać Goliata",
          text: text,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  if (!isVisible || !position || isGroupMinimized || areAllWidgetsHidden)
    return null;

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
      <div className="w-full h-full relative rounded-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/90 backdrop-blur-2xl border border-[#C5A059]/40 shadow-[0_0_40px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col p-6 font-sans">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-4 drag-handle cursor-move">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.2em] leading-none">
              {appLanguage === "pl"
                ? "Złote Myśli: Pokonać Goliata"
                : "Golden Thoughts: Overcoming Goliath"}
            </h3>
          </div>
          <div className="flex items-center gap-2 drag-cancel">
            {groupId && (
              <button
                aria-label="W dół"
                onClick={minimizeGroup}
                className="text-zinc-500 hover:text-[#C5A059] transition-colors p-1 hover:bg-white/5 rounded-full"
                title={
                  appLanguage === "pl" ? "Minimalizuj grupę" : "Minimize group"
                }
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button
              aria-label="Zamknij"
              onClick={closeWidget}
              className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative z-10 flex-grow flex items-center justify-center my-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              <p
                className="text-zinc-100 text-center font-medium leading-relaxed italic text-sm sm:text-base selection:bg-[#C5A059] selection:text-black"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
              >
                „{thoughts[quoteIndex]}”
              </p>
              <p className="text-[#C5A059] text-[10px] font-bold tracking-widest uppercase opacity-80">
                — Cezary Rogowski
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-[#C5A059]/10 drag-cancel">
          <div className="flex items-center gap-4">
            <button
              aria-label="Ulubione"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`transition-all active:scale-90 ${isFavorite ? "text-red-500" : "text-zinc-500 hover:text-red-400"}`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
            <button
              aria-label="Udostępnij"
              onClick={shareQuote}
              className="text-zinc-500 hover:text-[#C5A059] transition-all active:scale-90"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {groupId && (
              <button
                onClick={ungroup}
                className="text-zinc-500 hover:text-red-400 transition-all active:scale-90 p-1 bg-white/5 rounded-md"
              >
                <Link2Off className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={nextQuote}
            className="group w-10 h-10 rounded-full bg-[#C5A059]/5 text-[#C5A059] border border-[#C5A059]/20 flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition-all shadow-[0_0_15px_rgba(197,160,89,0.1)] active:scale-95"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </Rnd>,
    document.body,
  );
};
