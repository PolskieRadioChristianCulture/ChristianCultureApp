import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Minimize2,
  X,
  Link2Off,
} from "lucide-react";
import { Rnd } from "react-rnd";
import { AudioVisualizer } from "./AudioVisualizer";
import { mediaPlayerService, Material } from "../services/mediaPlayerService";
import { SupportedLanguage } from "../types";
import { useWidgetSync } from "../hooks/useWidgetSync";
import { useAppStore } from "../useAppStore";

interface Props {
  appLanguage: SupportedLanguage;
}

export const LocalMediaPlayerWidget: React.FC<Props> = ({ appLanguage }) => {
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
    "mediaplayer",
    {
      x:
        window.innerWidth > 1024
          ? window.innerWidth - 420
          : (window.innerWidth - 384) / 2,
      y:
        window.innerWidth > 1024
          ? window.innerHeight - 300
          : window.innerHeight - 300,
    },
    {
      width: window.innerWidth > 1024 ? 384 : window.innerWidth - 32,
      height: "auto",
    },
  );

  const [playingMaterial, setPlayingMaterial] = useState<Material | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if it's landscape on mobile/tablet devices
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth < 1024;

      if (isLandscape && isMobile && isPlaying && !isMinimized) {
        setIsFullScreen(true);
      } else if (!isLandscape && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener("resize", checkOrientation);
    // Initial check
    checkOrientation();

    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, [isPlaying, isMinimized, isFullScreen]);

  useEffect(() => {
    const handleChanged = () => {
      setPlayingMaterial(mediaPlayerService.playingMaterial);
      setPlayingUrl(mediaPlayerService.playingUrl);
      setIsMinimized(mediaPlayerService.isMinimized);
      setIsPlaying(true);

      // Force play call after state update
      setTimeout(async () => {
        if (audioRef.current && mediaPlayerService.playingUrl) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            window.dispatchEvent(new CustomEvent("cc_stop_radio"));
          } catch (e) {
            console.error("Playback failed:", e);
            setIsPlaying(false);
          }
        }
      }, 100);
    };

    mediaPlayerService.on("changed", handleChanged);

    // Initial state
    handleChanged();

    return () => {
      mediaPlayerService.removeListener("changed", handleChanged);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(
        (audioRef.current.currentTime /
          Math.max(1, audioRef.current.duration)) *
          100,
      );
    }
  };

  const handleEnded = () => {
    mediaPlayerService.playNext();
  };

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.error("Playback failed:", e);
          setIsPlaying(false);
        }
      }
    }
  };

  const stop = () => {
    mediaPlayerService.stop();
  };

  const minimize = () => {
    mediaPlayerService.setMinimized(true);
  };

  const [isForcedVisible, setIsForcedVisible] = useState(
    () => localStorage.getItem("cc_widget_mediaplayer_visible") === "true",
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsForcedVisible(
        localStorage.getItem("cc_widget_mediaplayer_visible") === "true",
      );
    };
    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener("cc_widgets_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cc_widgets_updated", handleStorageChange);
    };
  }, []);

  if ((!playingMaterial || !playingUrl) && !isForcedVisible) return null;
  if (isMinimized && (!playingMaterial || !playingUrl || !isForcedVisible))
    return null;
  if (!position || isGroupMinimized || areAllWidgetsHidden) return null;

  const isVideo = playingMaterial
    ? playingMaterial.type.startsWith("video/") ||
      playingMaterial.name.endsWith(".mp4")
    : false;
  const hasMultiple = mediaPlayerService.playlist.length > 1;

  const PlayerContent = (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        width: isFullScreen ? "100%" : "100%",
        height: isFullScreen ? "100%" : "100%",
      }}
      className={`pointer-events-auto relative shadow-2xl transition-all duration-500 overflow-hidden ${
        isFullScreen
          ? "w-full h-full rounded-none flex flex-col justify-center items-center"
          : "rounded-[1.5rem] p-4 flex flex-col"
      }`}
    >
      <div
        className="absolute inset-[-500%] z-0 rounded-full animate-[spin_8s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0 270deg, rgba(197,160,89,0.1) 270deg 330deg, #C5A059 360deg)",
        }}
      />
      <div
        className={`absolute inset-[1px] z-0 pointer-events-none bg-zinc-950/80 backdrop-blur-3xl ${isFullScreen ? "rounded-none border-none" : "rounded-[calc(1.5rem-1px)]"}`}
      />

      <button
        aria-label="Zamknij"
        onClick={() => {
          if (isFullScreen) {
            setIsFullScreen(false);
          } else {
            stop();
            localStorage.setItem("cc_widget_mediaplayer_visible", "false");
            window.dispatchEvent(new Event("cc_widgets_updated"));
          }
        }}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full text-zinc-400 hover:text-white transition-colors z-[10020] drag-cancel"
        title={
          isFullScreen
            ? appLanguage === "pl"
              ? "Wyjdź"
              : "Exit"
            : appLanguage === "pl"
              ? "Zatrzymaj i zamknij"
              : "Stop & close"
        }
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {isFullScreen ? (
          <Minimize2 className="w-6 h-6" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </button>

      {!isFullScreen && groupId && (
        <button
          onClick={ungroup}
          title={appLanguage === "pl" ? "Rozgrupuj" : "Ungroup"}
          className="absolute top-4 right-16 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full text-zinc-400 hover:text-red-400 transition-colors z-[10020] drag-cancel"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <Link2Off className="w-4 h-4" />
        </button>
      )}

      {/* Progress bar background */}
      {playingMaterial && (
        <div
          className="absolute bottom-0 left-0 h-1.5 bg-[#E2B859] transition-all duration-300 z-50 pointer-events-none"
          style={{ width: `${progress}%` }}
        />
      )}

      <div
        className={`flex flex-col gap-4 relative z-10 w-full flex-grow cursor-move drag-handle ${isFullScreen ? "h-full max-w-4xl mx-auto p-8 justify-center" : "p-0"}`}
      >
        <div
          className={
            isFullScreen ? "flex flex-col items-center gap-6" : "contents"
          }
        >
          <h4
            className={`text-[#E2B859] font-black truncate uppercase tracking-widest text-center px-4 leading-relaxed mt-2 ${isFullScreen ? "text-xl" : "text-xs"}`}
          >
            {playingMaterial ? (
              <>
                {hasMultiple &&
                  (appLanguage === "pl"
                    ? "Odtwarzanie Playlisty:"
                    : "Playing Playlist:")}
                {!hasMultiple &&
                  (appLanguage === "pl" ? "Odtwarzanie:" : "Playing:")}
                <br />
                <span
                  className={`text-white font-bold normal-case block mt-1 ${isFullScreen ? "text-2xl" : "text-sm"}`}
                >
                  {playingMaterial.name}
                </span>
              </>
            ) : appLanguage === "pl" ? (
              "ODTWARZACZ (PUSTY)"
            ) : (
              "PLAYER (EMPTY)"
            )}
          </h4>

          {!playingMaterial ? (
            <div className="flex-grow flex flex-col items-center justify-center min-h-[140px] opacity-50">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-zinc-900 border border-[#E2B859]/30 flex items-center justify-center shadow-inner">
                <div className="text-4xl text-[#E2B859]">🎵</div>
              </div>
            </div>
          ) : isVideo ? (
            <video
              ref={audioRef as any}
              src={playingUrl!}
              controls={isFullScreen}
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className={`rounded-lg bg-black transition-all drag-cancel object-contain flex-grow ${isFullScreen ? "w-full max-h-[60vh] shadow-2xl" : "w-full h-full min-h-[140px]"}`}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className={
                isFullScreen
                  ? "w-full flex flex-col items-center gap-8 py-8"
                  : "flex-grow flex flex-col justify-center items-center h-full min-h-[140px]"
              }
            >
              {isFullScreen ? (
                <>
                  <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />
                  <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-zinc-800 to-black border border-[#E2B859]/30 flex items-center justify-center shadow-inner relative overflow-hidden z-20">
                    <div className="absolute inset-0 bg-[#E2B859]/5 animate-pulse" />
                    <div className="text-6xl text-[#E2B859] drop-shadow-lg">
                      🎵
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-zinc-800 to-black border border-[#E2B859]/30 flex items-center justify-center shadow-inner relative overflow-hidden z-20">
                  <div className="absolute inset-0 bg-[#E2B859]/5 animate-pulse" />
                  <div className="text-4xl text-[#E2B859] drop-shadow-lg">
                    🎵
                  </div>
                </div>
              )}
              <audio
                ref={audioRef}
                src={playingUrl!}
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => console.error("Audio error in widget:", e)}
                crossOrigin="anonymous"
                className="hidden"
              />
            </div>
          )}

          {/* Controls */}
          <div
            className={`flex items-center justify-center mt-auto pb-2 ${isFullScreen ? "gap-12 mt-8 scale-125" : "gap-6"} drag-cancel ${!playingMaterial ? "opacity-50 pointer-events-none" : ""}`}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {hasMultiple && (
              <button
                aria-label="Poprzedni utwór"
                onClick={(e) => {
                  e.stopPropagation();
                  mediaPlayerService.playPrev();
                }}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90"
              >
                <SkipBack className={isFullScreen ? "w-6 h-6" : "w-4 h-4"} />
              </button>
            )}

            <button
              aria-label="Odtwarzaj"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className={`flex justify-center items-center rounded-full bg-[#E2B859] text-black shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 flex-shrink-0 ${isFullScreen ? "w-20 h-20" : "w-12 h-12"}`}
            >
              {isPlaying ? (
                <Pause
                  className={
                    isFullScreen
                      ? "w-8 h-8 fill-current"
                      : "w-5 h-5 fill-current"
                  }
                />
              ) : (
                <Play
                  className={`${isFullScreen ? "w-8 h-8 ml-1" : "w-5 h-5 ml-1"} fill-current`}
                />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                stop();
              }}
              className={`flex justify-center items-center rounded-full bg-red-900/40 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90 border border-red-500/20 flex-shrink-0 ${isFullScreen ? "w-14 h-14" : "w-10 h-10"}`}
            >
              <Square
                className={
                  isFullScreen ? "w-6 h-6 fill-current" : "w-4 h-4 fill-current"
                }
              />
            </button>

            {hasMultiple && (
              <button
                aria-label="Następny utwór"
                onClick={(e) => {
                  e.stopPropagation();
                  mediaPlayerService.playNext();
                }}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90"
              >
                <SkipForward className={isFullScreen ? "w-6 h-6" : "w-4 h-4"} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  let widgetContent;

  if (isFullScreen) {
    widgetContent = (
      <div className="fixed inset-0 z-[50] pointer-events-auto flex justify-center items-center">
        {PlayerContent}
      </div>
    );
  } else {
    widgetContent = (
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={{ x: position.x, y: position.y }}
        onDrag={onDrag}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        minWidth={280}
        minHeight={200}
        bounds="window"
        className="!fixed z-[50]"
        cancel=".drag-cancel"
        dragHandleClassName="drag-handle"
      >
        {PlayerContent}
      </Rnd>
    );
  }

  // Use createPortal to mount it directly to document.body, escaping all scaling/transforms of ancestors
  return createPortal(widgetContent, document.body);
};
