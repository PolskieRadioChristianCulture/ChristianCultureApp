import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Music, PlayCircle, ChevronRight, X, Link2Off } from "lucide-react";
import { Rnd } from "react-rnd";
import { SupportedLanguage } from "../types";
import { useWidgetSync } from "../hooks/useWidgetSync";
import { useAppStore } from "../useAppStore";

interface Props {
  appLanguage: SupportedLanguage;
  onOpenMusicNews: () => void;
}

const MUSIC_NEWS = [
  { pl: "Odkryj najnowsze hity 2026", en: "Discover the latest hits of 2026" },
  { pl: "Posłuchaj chrześcijańskiego Popu", en: "Listen to Christian Pop" },
  { pl: "Nowe sety uwielbienia", en: "New worship sets" },
  { pl: "Playlista: Wiara i Moc", en: "Playlist: Faith and Power" },
];

export const MusicNewsWidget: React.FC<Props> = ({
  appLanguage,
  onOpenMusicNews,
}) => {
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
    "music_news",
    { x: 20, y: 350 },
    { width: 340, height: "auto" },
  );

  const [isVisible, setIsVisible] = useState(() => {
    const stored = localStorage.getItem("cc_widget_music_news_visible");
    return stored === "true";
  });

  const [currentMusicNewsIdx, setCurrentMusicNewsIdx] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("cc_widget_music_news_visible");
      setIsVisible(stored === "true");
    };
    window.addEventListener("cc_widgets_updated", handleUpdate);
    return () => window.removeEventListener("cc_widgets_updated", handleUpdate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMusicNewsIdx((prev) => (prev + 1) % MUSIC_NEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const closeWidget = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem("cc_widget_music_news_visible", "false");
    window.dispatchEvent(new Event("cc_widgets_updated"));
  };

  if (!isVisible || !position || isGroupMinimized || areAllWidgetsHidden)
    return null;

  const content = (
    <Rnd
      size={size}
      position={position}
      onDragStart={onDrag}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      minWidth={300}
      minHeight={150}
      bounds="window"
      dragHandleClassName="drag-handle"
      className="z-[50] drop-shadow-2xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full h-full relative overflow-hidden group bg-gradient-to-br from-zinc-900 to-black border border-[#C5A059]/30 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all hover:border-[#C5A059] flex flex-col justify-between"
      >
        <div className="absolute top-0 left-0 right-0 h-10 drag-handle cursor-grab active:cursor-grabbing z-20 flex justify-between items-center px-4 bg-gradient-to-b from-black/50 to-transparent">
          {groupId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                ungroup();
              }}
              className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Link2Off className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1" />
          <button
            aria-label="Zamknij"
            onClick={closeWidget}
            className="p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-zinc-400 hover:text-white transition-all backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          aria-label="Dalej"
          onClick={onOpenMusicNews}
          className="w-full h-full p-5 sm:p-6 flex flex-col justify-between text-left outline-none pt-12"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
            <Music className="w-32 h-32 text-[#C5A059]" />
          </div>

          <div className="relative z-10 flex items-start gap-3 w-full">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0 border border-[#C5A059]/30">
              <PlayCircle className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">
                {appLanguage === "pl"
                  ? "Nowości Muzyczne 2026"
                  : "Music News 2026"}
              </h3>
              <div className="h-12 sm:h-14 relative mt-2">
                {MUSIC_NEWS.map((news, idx) => (
                  <p
                    key={idx}
                    className={`absolute inset-0 text-sm sm:text-base font-bold text-white transition-all duration-500 transform ${idx === currentMusicNewsIdx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  >
                    {appLanguage === "pl" ? news.pl : news.en}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-10 w-full flex justify-end mt-4">
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5 group-hover:border-[#C5A059]/50">
              {appLanguage === "pl"
                ? "SŁUCHAJ PLAYLISTY"
                : "LISTEN TO PLAYLIST"}{" "}
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </button>
      </motion.div>
    </Rnd>
  );

  return createPortal(content, document.body);
};
