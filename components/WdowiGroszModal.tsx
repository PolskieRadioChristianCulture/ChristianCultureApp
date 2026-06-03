import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, ShieldCheck, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Capacitor } from "@capacitor/core";
import { AdMob, BannerAdSize, BannerAdPosition } from "@capacitor-community/admob";

interface WdowiGroszModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTickerExpanded?: boolean;
}

export const WdowiGroszModal: React.FC<WdowiGroszModalProps> = ({
  isOpen,
  onClose,
  isTickerExpanded,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (Capacitor.isNativePlatform()) {
        const showAdMobBanner = async () => {
          try {
            await AdMob.initialize({
              initializeForTesting: false,
            });
            await AdMob.showBanner({
              adId: 'ca-app-pub-6762200025251358/2009151047',
              adSize: BannerAdSize.ADAPTIVE_BANNER,
              position: BannerAdPosition.TOP_CENTER,
              margin: 40,
              isTesting: false,
            });
          } catch (error) {
            console.error("Błąd ładowania AdMob:", error);
          }
        };
        showAdMobBanner();
      } else {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense error:", e);
        }
      }
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        AdMob.removeBanner().catch((err) => console.warn("AdMob remove error:", err));
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-[10000] flex items-center justify-center p-4 ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-2xl bg-zinc-900 border border-[#C5A059]/30 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col ${isTickerExpanded ? "mb-12" : ""}`}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#C5A059]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                    Wdowi <span className="text-[#C5A059]">Grosz</span>
                  </h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none">
                    Wsparcie Misji CC
                  </p>
                </div>
              </div>
              <button
                aria-label="Zamknij"
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-gold">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                  <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">
                    Twoje wsparcie ma znaczenie
                  </span>
                </div>

                <p className="text-lg font-medium text-white leading-relaxed">
                  Oglądając tą reklamę finansujesz utrzymanie misji CC - strony
                  i aplikacji.
                </p>

                <p className="text-sm text-zinc-400">
                  Dziękujemy, że jesteś częścią naszej społeczności. Każde
                  kliknięcie i wyświetlenie pomaga nam głosić Ewangelię na cały
                  świat.
                </p>
              </div>

              {/* Reklama Google */}
              <div className="w-full min-h-[250px] bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-4">
                <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Reklama Wspierająca Misję
                </div>

                {Capacitor.isNativePlatform() ? (
                  <div className="text-center space-y-2">
                    <p className="text-xs text-zinc-400">Reklama mobilna AdMob jest ładowana...</p>
                    <p className="text-[10px] text-zinc-500 font-mono">ID: 2009151047</p>
                  </div>
                ) : (
                  <ins
                    className="adsbygoogle"
                    style={{ display: "block", width: "100%", height: "auto" }}
                    data-ad-client="ca-pub-6762200025251358"
                    data-ad-slot="2009151047"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  ></ins>
                )}
              </div>

              <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 text-center italic text-sm text-zinc-400">
                „A Jezus, usiadłszy naprzeciw skarbony, przypatrywał się, jak
                tłum wrzucał pieniądze do skarbony. I wielu bogaczy wrzucało
                wiele. Przyszła też jedna uboga wdowa i wrzuciła dwa pieniążki,
                to jest czwartak.”
                <br />
                <span className="text-[#C5A059] font-bold not-italic">
                  — Ew. Marka 12:41-42
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-center">
              <Button
                onClick={onClose}
                className="bg-[#C5A059] hover:bg-[#E2B859] text-black font-black uppercase tracking-widest text-[11px] px-10 py-6 rounded-full shadow-lg shadow-[#C5A059]/20 h-auto"
              >
                Zamknij i kontynuuj
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
