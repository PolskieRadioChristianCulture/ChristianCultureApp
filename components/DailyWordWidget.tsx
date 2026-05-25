import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Share2, BookOpen, Sparkles, X } from "lucide-react";
import { geminiService } from "../services/geminiService";

interface DailyWordWidgetProps {
  verseText?: string;
  verseRef?: string;
  backgroundImage?: string;
  accentColor?: string;
  borderRadius?: number;
  backgroundAlpha?: number;
  showLogo?: boolean;
}

const DailyWordWidget: React.FC<DailyWordWidgetProps> = ({
  verseText = "„Albowiem tak Bóg umiłował świat, że Syna swego jednorodzonego dał, aby każdy, kto weń wierzy, nie zginął, ale miał żywot wieczny.”",
  verseRef = "Ew. Jana 3:16",
  backgroundImage = "https://images.unsplash.com/photo-1504052434139-41951f690761?q=80&w=2070&auto=format&fit=crop",
  accentColor = "#D4AF37",
  borderRadius = 32,
  backgroundAlpha = 80,
  showLogo = true,
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleAiInsight = async () => {
    if (aiInsight) {
      setAiInsight(null);
      return;
    }
    setIsAiLoading(true);
    try {
      const insight = await geminiService.getSpiritualInsight(
        verseText,
        verseRef,
      );
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div
      className="relative w-full max-w-[400px] aspect-[4/5] overflow-hidden shadow-2xl group border border-white/5 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]"
      style={{ borderRadius: `${borderRadius}px`, fontFamily: "Inter" }}
    >
      {/* Background with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"
          style={{ opacity: backgroundAlpha / 100 }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between p-8 text-center">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center">
          <button
            aria-label="Menu"
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white/80" strokeWidth={1.5} />
          </button>
          {showLogo && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">
                Biblia Audio
              </span>
              <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/60">
                Premium Edition
              </span>
            </div>
          )}
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full max-h-full overflow-y-auto p-2">
          <AnimatePresence mode="wait">
            {!aiInsight ? (
              <motion.div
                key="verse"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Header */}
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase"
                  style={{ color: accentColor }}
                >
                  S Ł O W O &nbsp; D N I A
                </motion.h4>

                {/* Verse Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl md:text-2xl font-serif text-white/95 leading-relaxed px-2"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {verseText}
                </motion.p>

                {/* Reference */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: accentColor }}
                >
                  {verseRef}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="ai-insight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#C5A059]/10 border border-[#C5A059]/20 p-6 rounded-3xl relative backdrop-blur-xl"
              >
                <button
                  aria-label="Zamknij"
                  onClick={() => setAiInsight(null)}
                  className="absolute top-3 right-3 text-[#C5A059] hover:bg-white/10 p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                    Apostoł Cyfrowy Insight
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium text-white italic leading-relaxed">
                  {aiInsight}
                </p>
                <div className="mt-4 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                  Filtrowane przez Konstytucję CC
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Audio Player Bar */}
        <div className="w-full space-y-5 px-2 mt-4">
          {/* Progress Area */}
          <div className="w-full space-y-2">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full w-[65%] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-all duration-1000"
                style={{ backgroundColor: accentColor }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-bold text-white/30 tracking-[0.2em] uppercase">
              <span>03:12</span>
              <span className="text-white/20">Biblia Audio Player</span>
              <span>04:45</span>
            </div>
          </div>

          {/* Brand Line */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-black whitespace-nowrap">
              Christian Culture Network
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="w-full grid grid-cols-3 gap-2 mt-6">
          <button
            aria-label="Otwórz Biblię"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("cc_open_bible"))
            }
            className="h-12 rounded-full border backdrop-blur-md flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider hover:bg-opacity-20 active:scale-95 transition-all outline-none"
            style={{
              backgroundColor: `${accentColor}1A`,
              borderColor: `${accentColor}4D`,
              color: accentColor,
            }}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Czytaj</span>
          </button>

          <button
            onClick={handleAiInsight}
            disabled={isAiLoading}
            className="h-12 rounded-full bg-zinc-900 border border-[#C5A059]/30 flex items-center justify-center gap-2 text-[#C5A059] font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {isAiLoading ? (
              <div className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Inspiracja</span>
              </>
            )}
          </button>

          <button
            aria-label="Udostępnij"
            className="h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all outline-none"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Decorative Border Glow */}
      <div
        className="absolute inset-0 pointer-events-none border border-white/10"
        style={{ borderRadius: `${borderRadius}px` }}
      />
    </div>
  );
};

export default DailyWordWidget;
