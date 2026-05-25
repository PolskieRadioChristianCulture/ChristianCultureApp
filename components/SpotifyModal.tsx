import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Music, Mic, BookOpen } from "lucide-react";

interface SpotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: string;
  isTickerExpanded?: boolean;
}

type SpotifySourceId = "artist" | "apokalipsa" | "biblia";

interface SpotifySource {
  id: SpotifySourceId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  embedUrl: string;
  externalUrl: string;
}

export const SpotifyModal: React.FC<SpotifyModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const sources: SpotifySource[] = [
    {
      id: "artist",
      label: "Christian Culture",
      sublabel: appLanguage === "pl" ? "Wykonawca" : "Artist",
      icon: <Music className="w-4 h-4" />,
      embedUrl:
        "https://open.spotify.com/embed/artist/3ZgXCNnAllDbNDtzk4jkg6?utm_source=generator",
      externalUrl:
        "https://open.spotify.com/artist/3ZgXCNnAllDbNDtzk4jkg6?si=XQIq_CW1RliSjO0zTvTvpw",
    },
    {
      id: "apokalipsa",
      label: "Apokalipsa",
      sublabel: appLanguage === "pl" ? "Dzień po dniu" : "Day by day",
      icon: <Mic className="w-4 h-4" />,
      embedUrl:
        "https://open.spotify.com/embed/show/4gzexFk8sksSCFCkFb769E?utm_source=generator",
      externalUrl:
        "https://open.spotify.com/show/4gzexFk8sksSCFCkFb769E?si=502b1914bce949cc",
    },
    {
      id: "biblia",
      label: "Biblia Audio",
      sublabel: "Christian Culture",
      icon: <BookOpen className="w-4 h-4" />,
      embedUrl:
        "https://open.spotify.com/embed/show/6M2mU6VzRCPCOjWihgO8Aw?utm_source=generator",
      externalUrl:
        "https://open.spotify.com/show/6M2mU6VzRCPCOjWihgO8Aw?si=ebe779dfef784b4a",
    },
  ];

  const [activeSourceId, setActiveSourceId] =
    useState<SpotifySourceId>("artist");
  const activeSource =
    sources.find((s) => s.id === activeSourceId) || sources[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-0 left-0 right-0 z-[6000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden glassmorphism flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center">
                  <Music className="w-6 h-6 text-[#1DB954]" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white tracking-tight leading-none">
                    Spotify CC
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
                    {appLanguage === "pl"
                      ? "Podcasty i Muzyka"
                      : "Podcasts & Music"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="p-4 bg-black/10 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
              {sources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setActiveSourceId(source.id)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all text-[11px] font-bold uppercase tracking-widest ${
                    activeSourceId === source.id
                      ? "bg-[#1DB954] text-black shadow-lg shadow-[#1DB954]/20"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {source.icon}
                  <span>{source.label}</span>
                </button>
              ))}
            </div>

            {/* Spotify Embed Area */}
            <div className="p-6 bg-black/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl overflow-hidden shadow-2xl border border-[#1DB954]/20"
                >
                  <iframe
                    data-testid="embed-iframe"
                    style={{ borderRadius: "12px" }}
                    src={activeSource.embedUrl}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={activeSource.label}
                  ></iframe>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer / CTA */}
            <div className="p-6 bg-black/40 border-t border-white/5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#1DB954] font-bold uppercase tracking-[0.2em] mb-1">
                    {activeSource.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.1em] text-center sm:text-left">
                    {activeSource.sublabel}
                  </p>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      activeSource.externalUrl,
                      "_blank",
                      "noreferrer",
                    )
                  }
                  className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all transform hover:scale-105 w-full sm:w-auto justify-center"
                >
                  <span className="text-xs uppercase tracking-widest">
                    {appLanguage === "pl"
                      ? "Otwórz na Spotify"
                      : "Open in Spotify"}
                  </span>
                  <ExternalLink size={14} />
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-full mt-2 py-4 bg-zinc-800 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-700 transition-all shadow-lg active:scale-95 text-center border border-white/10"
              >
                {appLanguage === "pl" ? "ZAMKNIJ OKNO" : "CLOSE WINDOW"}
              </button>
              <p className="text-[10px] text-zinc-700 uppercase tracking-widest text-center mt-2">
                {appLanguage === "pl"
                  ? "Zrób to Dla Jezusa – On już czeka."
                  : "Do it For Jesus – He is waiting."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
