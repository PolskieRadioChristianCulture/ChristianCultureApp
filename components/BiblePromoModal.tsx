import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Book, MessageSquare, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { SupportedLanguage } from "../types";

interface BiblePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const BiblePromoModal: React.FC<BiblePromoModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded,
}) => {
  const isPl = appLanguage === "pl";

  const handleSms = () => {
    window.open("sms:+48799082024?body=Biblia", "_blank");
  };

  const handleCall = () => {
    window.open("tel:+48799082024", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-[10000] ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
        >
          {/* Backdrop (covers full screen to dim background) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container - constrained to user boundaries */}
          <div
            className={`absolute inset-0 flex items-center justify-center p-2`}
          >
            {/* Modal itself */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md md:max-w-4xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-gold/40 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(197,160,89,0.3)] flex flex-col max-h-full"
            >
              <div className="overflow-y-auto scrollbar-hide flex-1 flex flex-col md:flex-row">
                <button
                  aria-label="Zamknij"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/90 rounded-full text-zinc-400 hover:text-white transition-colors border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header / Banner area */}
                <div className="relative h-40 sm:h-48 md:h-auto md:w-1/2 overflow-hidden shrink-0 flex items-center justify-center bg-black/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/30 via-black to-black z-0" />
                  <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.5),transparent_100%)]" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-10 md:p-4">
                    <motion.div
                      initial={{ rotateY: -15, rotateX: 5 }}
                      animate={{ rotateY: 15, rotateX: -5 }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="relative"
                    >
                      <img
                        src="/books/biblia_ubg_cover.webp"
                        alt="Biblia UBG"
                        className="h-32 sm:h-36 md:h-[40rem] lg:h-[45rem] rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-white/20 object-contain transition-all duration-700 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -top-3 -right-3 md:-right-6 md:-top-6 bg-gold text-black font-black text-[9px] md:text-[11px] px-3 py-1 md:px-4 md:py-2 rounded-full shadow-lg border border-white/30 uppercase tracking-widest whitespace-nowrap">
                        {isPl ? "PREZENT" : "GIFT"}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-8 pt-4 md:py-12 md:px-12 text-center md:w-1/2 flex flex-col justify-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gold/10 px-3 py-1 rounded-full border border-gold/30 flex items-center gap-2">
                      <Book className="w-3.5 h-3.5 text-gold" />
                      <span className="text-gold font-black text-[9px] uppercase tracking-[0.2em]">
                        {isPl
                          ? "Misja Christian Culture"
                          : "Christian Culture Mission"}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-3 leading-none hyphens-none break-keep">
                    {isPl ? "Twoja Darmowa Biblia" : "Your Free Bible"} <br />
                    <span className="text-gold">
                      {isPl ? "CZEKA DZISIAJ" : "IS WAITING TODAY"}
                    </span>
                  </h2>

                  <p className="text-zinc-400 text-[11px] sm:text-xs md:text-sm mb-6 leading-relaxed px-2 md:px-0">
                    {isPl
                      ? "Zamów swój egzemplarz darmowej Biblii UBG. Pokrywasz jedynie koszt wysyłki (pobranie). Niech Słowo Boże przemienia Twoje życie!"
                      : "Order your free copy of the UBG Bible. You only cover shipping costs (COD). Let the Word of God transform your life!"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <Button
                      onClick={handleSms}
                      className="h-12 md:h-14 bg-zinc-900 hover:bg-zinc-800 border border-gold/20 text-white rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 group"
                    >
                      <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                      <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">
                        {isPl ? "Wyślij SMS" : "Send SMS"}
                      </span>
                    </Button>

                    <Button
                      onClick={handleCall}
                      className="h-12 md:h-14 bg-gold hover:bg-gold/90 text-black rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 group"
                    >
                      <Phone className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">
                        {isPl ? "Zadzwoń" : "Call"}
                      </span>
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-start justify-center md:justify-start gap-3 text-left">
                    <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p className="text-[9px] md:text-[10px] text-zinc-500 leading-tight md:leading-normal">
                      {isPl
                        ? 'Wyślij SMS: "Biblia" lub zadzwoń: +48 799 082 024. Akcja Christian Culture.'
                        : 'SMS: "Biblia" or call: +48 799 082 024. Christian Culture campaign.'}
                    </p>
                  </div>

                  <div className="mt-6 md:mt-8">
                    <p className="text-[9px] md:text-[10px] font-black text-gold/40 uppercase tracking-[0.2em] italic mb-1">
                      Zrób to Dla Jezusa – On już czeka.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
