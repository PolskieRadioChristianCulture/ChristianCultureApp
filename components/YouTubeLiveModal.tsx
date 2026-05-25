import React, { useState, useEffect, useRef, useMemo } from "react";
import { Share2, Heart, X, Maximize } from "lucide-react";
import { useAppStore } from "../useAppStore";

interface YouTubeLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLandscape?: boolean;
  initialSource?: "live" | "films" | "plus" | "testimonies" | "objawienie";
  isTickerExpanded?: boolean;
}

export const YouTubeLiveModal: React.FC<YouTubeLiveModalProps> = ({
  isOpen,
  onClose,
  isLandscape = false,
  initialSource = "live",
  isTickerExpanded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dynamicDB = useAppStore((state) => state.dynamicDB);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const shouldBeFullScreen = isLandscape && isMobile;

  const sources = {
    live: "https://www.youtube.com/embed/videoseries?si=jhgDXOENwAoQmn6L&list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW&autoplay=1",
    films:
      "https://www.youtube.com/embed/videoseries?si=xGtwd_6RYb1IdELm&list=PLQBdxcl9HBc-1cGuhrYvZyGK4Swr4dooA&autoplay=1",
    plus:
      dynamicDB["Kanały YouTube"]
        ?.match(/https:\/\/youtube\.com\/@[\w-]+/i)?.[0]
        ?.replace("youtube.com/@", "youtube.com/embed/@") + "?autoplay=1",
    testimonies:
      "https://www.youtube.com/embed/videoseries?si=raOPJBjkWLvkeY2z&list=PLQBdxcl9HBc9FvSiQ__2u5PLdNrfOdElh&autoplay=1",
    objawienie:
      "https://www.youtube.com/embed/videoseries?si=GMPVG4tscytqg_a9&list=PLDA6geI28g8QBRVh8GU5zsWEMTaJjrEQk&autoplay=1",
  };

  const [activeSourceId, setActiveSourceId] = useState<
    "live" | "films" | "plus" | "testimonies" | "objawienie"
  >(initialSource);

  useEffect(() => {
    if (isOpen) {
      setActiveSourceId(initialSource);
    }
  }, [isOpen, initialSource]);

  if (!isOpen) return null;

  const handleShare = async () => {
    const titles = {
      live: "Cuda Każdego Dnia",
      films: "CC Film",
      plus: "Osobowość Plus",
      testimonies: "Świadectwa CC",
    };

    const urls = {
      live: "https://www.youtube.com/playlist?list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW",
      films:
        "https://www.youtube.com/playlist?list=PLQBdxcl9HBc-1cGuhrYvZyGK4Swr4dooA",
      plus:
        dynamicDB["Kanały YouTube"]?.match(
          /https:\/\/youtube\.com\/@[\w-]+/i,
        )?.[0] || "https://youtube.com/@osobowoscplus",
      testimonies:
        "https://youtube.com/playlist?list=PLQBdxcl9HBc9FvSiQ__2u5PLdNrfOdElh",
    };

    const shareData = {
      title: titles[activeSourceId],
      text: `Obejrzyj ${titles[activeSourceId]} Christian Culture!`,
      url: urls[activeSourceId],
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link skopiowany do schowka!");
      }
    } catch (err) {
      console.error("Błąd udostępniania:", err);
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[6000] bg-black backdrop-blur-2xl flex items-center justify-center animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"} ${shouldBeFullScreen ? "p-0" : "p-4 bg-black/95"}`}
    >
      <div
        ref={containerRef}
        className={`w-full flex flex-col gap-4 animate-scale-up transition-all duration-500 ${shouldBeFullScreen ? "max-w-none h-full gap-0" : "max-w-4xl"}`}
      >
        {/* Source Switcher */}
        {!shouldBeFullScreen && (
          <div className="flex justify-center gap-2 sm:gap-4 mb-2 flex-wrap">
            <button
              onClick={() => setActiveSourceId("live")}
              className={`px-3 sm:px-6 py-2 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl border ${
                activeSourceId === "live"
                  ? "bg-[#C5A059] text-black border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                  : "bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20"
              }`}
            >
              Cuda Każdego Dnia
            </button>
            <button
              onClick={() => setActiveSourceId("films")}
              className={`px-3 sm:px-6 py-2 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl border ${
                activeSourceId === "films"
                  ? "bg-[#C5A059] text-black border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                  : "bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20"
              }`}
            >
              CC Film
            </button>
            {dynamicDB["Kanały YouTube"]?.includes("Osobowość Plus") && (
              <button
                onClick={() => setActiveSourceId("plus")}
                className={`px-3 sm:px-6 py-2 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl border ${
                  activeSourceId === "plus"
                    ? "bg-[#C5A059] text-black border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                    : "bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20"
                }`}
              >
                Osobowość Plus
              </button>
            )}
            <button
              onClick={() => setActiveSourceId("testimonies")}
              className={`px-3 sm:px-6 py-2 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl border ${
                activeSourceId === "testimonies"
                  ? "bg-[#C5A059] text-black border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                  : "bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20"
              }`}
            >
              Świadectwa CC
            </button>
            <button
              onClick={() => setActiveSourceId("objawienie")}
              className={`px-3 sm:px-6 py-2 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl border ${
                activeSourceId === "objawienie"
                  ? "bg-[#C5A059] text-black border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                  : "bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20"
              }`}
            >
              Objawienie
            </button>
          </div>
        )}

        {/* Video Container */}
        <div
          className={`relative bg-black overflow-hidden shadow-2xl transition-all duration-500 ${shouldBeFullScreen ? "flex-1 rounded-0 border-0" : "aspect-video rounded-3xl border border-white/10"}`}
        >
          <iframe
            width="100%"
            height="100%"
            src={sources[activeSourceId]}
            title="Transmisja na żywo YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          ></iframe>

          {/* Floating Close Button for Full Screen / Landscape */}
          {shouldBeFullScreen && (
            <button
              aria-label="Zamknij"
              onClick={onClose}
              className="absolute top-12 right-6 z-50 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation Panel */}
        {!shouldBeFullScreen && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-6 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
            <button
              aria-label="Udostępnij"
              onClick={handleShare}
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-2xl transition-all border border-white/5 hover:border-[#C5A059]/30 active:scale-95 shadow-lg w-full h-full"
            >
              <div className="flex-shrink-0">
                <Share2
                  size={20}
                  className="text-[#C5A059] group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center leading-tight">
                Udostępnij
              </div>
            </button>

            <a
              href="https://patronite.pl/osobowoscplus"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-4 bg-gradient-to-br from-[#C5A059] via-[#D4AF37] to-[#8B7344] text-black rounded-2xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(197,160,89,0.3)] hover:shadow-[0_15px_40px_rgba(197,160,89,0.5)] hover:scale-[1.02] w-full h-full"
            >
              <div className="flex-shrink-0">
                <Heart
                  size={20}
                  fill="currentColor"
                  className="group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center leading-tight">
                Patronite
              </div>
            </a>

            <button
              aria-label="Pełny ekran"
              onClick={toggleFullScreen}
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-2xl transition-all border border-white/5 hover:border-[#C5A059]/30 active:scale-95 shadow-lg w-full h-full"
            >
              <div className="flex-shrink-0">
                <Maximize
                  size={20}
                  className="text-[#C5A059] group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center leading-tight">
                Pełny Ekran
              </div>
            </button>

            <a
              href="https://linktr.ee/christianculturenetwork?utm_source=linktree_profile_share&ltsid=1d265923-7bb1-48a3-a5ba-14e10dba54ab"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-2xl transition-all border border-white/5 hover:border-[#C5A059]/30 active:scale-95 shadow-lg w-full h-full"
            >
              <div className="flex-shrink-0">
                <Share2
                  size={20}
                  className="text-red-600 group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center leading-tight">
                Wszystkie Kanały
              </div>
            </a>

            <button
              aria-label="Zamknij"
              onClick={onClose}
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-4 bg-zinc-900/80 hover:bg-red-600/10 text-white hover:text-red-500 rounded-2xl transition-all border border-white/5 hover:border-red-500/30 active:scale-95 shadow-lg w-full h-full"
            >
              <div className="flex-shrink-0">
                <X
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </div>
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center leading-tight">
                Zamknij
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
