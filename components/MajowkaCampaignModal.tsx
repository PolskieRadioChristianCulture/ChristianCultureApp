import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Youtube, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { fixOrphans } from "../types";

interface MajowkaCampaignModalProps {
  onClose?: () => void;
}

export const MajowkaCampaignModal: React.FC<MajowkaCampaignModalProps> = ({
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Sprawdzenie czy jesteśmy w maju (miesiąc 4 w JS to Maj)
    const now = new Date();
    const isMay = now.getMonth() === 4; // 0=Jan, 4=May

    // Sprawdzenie czy użytkownik już widział to dzisiaj
    const today = now.toISOString().slice(0, 10);
    const lastSeen = localStorage.getItem("cc_majowka_seen_date");

    if (isMay && lastSeen !== today) {
      // Oznacz jako obejrzane od razu
      localStorage.setItem("cc_majowka_seen_date", today);

      // Inteligentne opóźnienie: 15 sekund
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const autoCloseTimer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      return () => clearTimeout(autoCloseTimer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (onClose) onClose();
  };

  const handleOpenSong = () => {
    window.open("https://youtu.be/-6rv3cb-nuE?is=pVy7kPNtiBUblU1c", "_blank");
    handleDismiss();
  };

  const handleSmsSub = () => {
    // Próba otwarcia aplikacji SMS
    window.open("sms:+48537147043?body=Majówka u Jezusa", "_blank");
  };

  if (!isVisible || isDismissed) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-900/90 border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-900/20"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')]"></div>
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-6xl"
            >
              🌸
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent"></div>
          </div>

          <button
            aria-label="Zamknij"
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white transition-colors z-20"
          >
            <X size={20} />
          </button>

          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-sans tracking-tight text-[#C5A059]">
                Majówka u Jezusa
              </h2>
              <p className="text-zinc-400 text-sm italic">
                {fixOrphans(
                  "Zapraszamy do wspólnego uwielbienia w tym pięknym miesiącu.",
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div
                onClick={handleOpenSong}
                className="group cursor-pointer p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-[#C5A059]/50 transition-all hover:bg-zinc-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <Youtube size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#C5A059] font-medium">
                      Posłuchaj piosenki
                    </h3>
                    <p className="text-xs text-zinc-500">
                      „Majówka u Jezusa” na naszym kanale
                    </p>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-zinc-600 group-hover:text-[#C5A059]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                    <MessageSquare size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-zinc-200 font-medium">
                      Subskrypcja SMS
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Duchowe inspiracje na każdy dzień
                    </p>
                  </div>
                </div>
                <div className="bg-black/40 p-3 rounded-lg text-center space-y-2">
                  <p className="text-xs text-zinc-400 uppercase tracking-widest">
                    Wyślij SMS o treści:
                  </p>
                  <p className="text-lg font-mono text-[#C5A059] font-bold">
                    Majówka u Jezusa
                  </p>
                  <p className="text-xs text-zinc-500 underline">
                    na numer: 537 147 043
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSmsSub}
                    className="w-full mt-2 border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-black"
                  >
                    WYŚLIJ TERAZ
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <p className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                {fixOrphans("Zrób to Dla Jezusa – On już czeka.")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
