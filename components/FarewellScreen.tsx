import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { App as CapacitorApp } from "@capacitor/app";
import { nativeService } from "../services/nativeService";

interface FarewellScreenProps {
  isOpen: boolean;
  onCancel: () => void;
  appLanguage: string;
}

export function FarewellScreen({
  isOpen,
  onCancel,
  appLanguage,
}: FarewellScreenProps) {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setCountdown(7);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (nativeService.isNative()) {
              CapacitorApp.exitApp();
            } else {
              // W wersji web po prostu powrót do Radia
              onCancel();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-950 via-[#0a0a0a] to-black"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-48 h-48 mb-6 drop-shadow-[0_0_30px_rgba(197,160,89,0.3)]"
          >
            <img
              src="/cc_logo_transparent.png"
              alt="Christian Culture Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Słowo / Werset */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md text-center space-y-4"
          >
            <p className="text-white text-xl sm:text-2xl font-medium leading-relaxed font-serif italic">
              „Jahwe strzec będzie wyjścia twego i wejścia twego, odtąd aż na wieki”
            </p>
            <p className="text-[#C5A059] font-black uppercase tracking-[0.3em] text-sm md:text-base">
              Psalm 121, 8
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <span className="w-4 h-4 rounded-full border border-zinc-500 flex items-center justify-center text-[10px]">
                {countdown}
              </span>
              <span>
                {appLanguage === "pl" ? "Aplikacja zostanie zamknięta" : "App will be closed"}
              </span>
            </div>

            <button
              onClick={onCancel}
              className="px-8 py-3 rounded-full bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all hover:border-[#C5A059]/30 active:scale-95"
            >
              {appLanguage === "pl" ? "POWRÓT DO RADIA" : "BACK TO RADIO"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
