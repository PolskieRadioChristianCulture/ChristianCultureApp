import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Share2, Play, Smartphone } from "lucide-react";
import { SupportedLanguage } from "../types";
import { mediaPlayerService } from "../services/mediaPlayerService";

interface CcResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const CcResourcesModal: React.FC<CcResourcesModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const resources = [
    {
      id: "ringtone-good-morning",
      title:
        appLanguage === "pl"
          ? "Dzwonek CC - Dzień Dobry"
          : "CC Ringtone - Good Morning",
      description:
        appLanguage === "pl"
          ? "Rozpocznij dzień z Bożym przesłaniem. Oficjalny dzwonek Christian Culture."
          : "Start your day with a Godly message. Official Christian Culture ringtone.",
      url: "https://docs.google.com/uc?export=download&id=1dJyM5aZJ2N9DHL10Hp0t__3RT1nK_mf4",
      viewUrl:
        "https://drive.google.com/file/d/1dJyM5aZJ2N9DHL10Hp0t__3RT1nK_mf4/view?usp=sharing",
      type: "audio/mpeg",
      icon: <Smartphone className="w-6 h-6 text-[#C5A059]" />,
    },
  ];

  const handleListen = (resource: any) => {
    mediaPlayerService.playUrl(resource.url, resource.title);
    // Ensure the player widget is visible
    localStorage.setItem("cc_widget_mediaplayer_visible", "true");
    window.dispatchEvent(new Event("cc_widgets_updated"));

    // Notify user
    const msg =
      appLanguage === "pl" ? "Uruchamiam odtwarzacz..." : "Starting player...";
    window.dispatchEvent(
      new CustomEvent("cc_show_toast", {
        detail: { message: msg, type: "info" },
      }),
    );
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const handleShare = async (resource: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: resource.viewUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(resource.viewUrl);
      alert(
        appLanguage === "pl"
          ? "Link skopiowany do schowka!"
          : "Link copied to clipboard!",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed bottom-0 left-0 right-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/30 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-widest uppercase">
                {appLanguage === "pl" ? "ZASOBY" : "RESOURCES"}{" "}
                <span className="text-[#C5A059]">CCN</span>
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">
                {appLanguage === "pl"
                  ? "Materiały do pobrania"
                  : "Downloadable materials"}
              </p>
            </div>
            <button
              aria-label="Zamknij"
              onClick={onClose}
              className="p-3 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6 no-scrollbar">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-6 bg-zinc-900/51 border border-white/5 rounded-[1.5rem] group hover:border-[#C5A059]/40 transition-all"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 bg-[#C5A059]/10 rounded-2xl group-hover:scale-110 transition-transform">
                    {res.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-medium">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    aria-label="Odtwarzaj"
                    onClick={() => handleListen(res)}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-white/5 rounded-2xl hover:bg-[#C5A059] group/btn transition-all active:scale-95"
                  >
                    <Play className="w-5 h-5 text-[#C5A059] group-hover/btn:text-black mb-2" />
                    <span className="text-[9px] font-black text-zinc-400 group-hover/btn:text-black uppercase tracking-widest">
                      {appLanguage === "pl" ? "Posłuchaj" : "Listen"}
                    </span>
                  </button>
                  <button
                    aria-label="Pobierz"
                    onClick={() => handleDownload(res.url)}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-white/5 rounded-2xl hover:bg-[#C5A059] group/btn transition-all active:scale-95"
                  >
                    <Download className="w-5 h-5 text-[#C5A059] group-hover/btn:text-black mb-2" />
                    <span className="text-[9px] font-black text-zinc-400 group-hover/btn:text-black uppercase tracking-widest">
                      {appLanguage === "pl" ? "Pobierz" : "Download"}
                    </span>
                  </button>
                  <button
                    aria-label="Udostępnij"
                    onClick={() => handleShare(res)}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-white/5 rounded-2xl hover:bg-[#C5A059] group/btn transition-all active:scale-95"
                  >
                    <Share2 className="w-5 h-5 text-[#C5A059] group-hover/btn:text-black mb-2" />
                    <span className="text-[9px] font-black text-zinc-400 group-hover/btn:text-black uppercase tracking-widest">
                      {appLanguage === "pl" ? "Udostępnij" : "Share"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-8 bg-zinc-900/30 border-t border-white/5 text-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
              Zrób to Dla Jezusa – On już czeka.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
