import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ShabbatWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: "pl" | "en";
  isTickerExpanded?: boolean;
}

export const ShabbatWelcomeModal: React.FC<ShabbatWelcomeModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-0 left-0 right-0 z-[4000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border-2 border-[#C5A059] rounded-[2.5rem] p-6 shadow-[0_0_80px_rgba(197,160,89,0.4)] overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <h3 className="text-2xl sm:text-3xl font-black text-[#C5A059] uppercase tracking-[0.4em] drop-shadow-glow">
                  {appLanguage === "pl" ? "SZABAT SZALOM" : "SHABBAT SHALOM"}
                </h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                  {appLanguage === "pl"
                    ? "Błogosławionego czasu odpoczynku"
                    : "Blessed time of rest"}
                </p>
              </div>
              <button
                aria-label="Zamknij"
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/tb054FxRno4?si=8B_39wNZphqHXq99&autoplay=1"
                title="Shabbat Welcome"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="h-full bg-[#C5A059]"
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                {appLanguage === "pl"
                  ? `To okno można zamknąć. Autozamknięcie za ${countdown}s...`
                  : `This window can be closed. Auto-close in ${countdown}s...`}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#C5A059] text-black font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
              >
                {appLanguage === "pl" ? "WEJDŹ W ODPOCZYNEK" : "ENTER REST"}
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
