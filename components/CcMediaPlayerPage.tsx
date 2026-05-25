import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  X,
  Music,
  Film,
  List,
  Volume2,
  Maximize2,
} from "lucide-react";
import { SupportedLanguage } from "../types";
import { mediaPlayerService, Material } from "../services/mediaPlayerService";
import { AudioVisualizer } from "./AudioVisualizer";

interface CcMediaPlayerPageProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const CcMediaPlayerPage: React.FC<CcMediaPlayerPageProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const [playingMaterial, setPlayingMaterial] = useState<Material | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Material[]>([]);
  const [myMaterials, setMyMaterials] = useState<Material[]>([]);
  const [activeTab, setActiveTab] = useState<
    "playlist" | "myfiles" | "resources"
  >("playlist");
  const [resources, setResources] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | HTMLVideoElement>(null);

  useEffect(() => {
    // CC Resources Data
    const rcData = [
      {
        id: "ringtone-good-morning",
        name:
          appLanguage === "pl"
            ? "Dzwonek CC - Dzień Dobry"
            : "CC Ringtone - Good Morning",
        description:
          appLanguage === "pl"
            ? "Oficjalny dzwonek Christian Culture."
            : "Official Christian Culture ringtone.",
        url: "https://docs.google.com/uc?id=1dJyM5aZJ2N9DHL10Hp0t__3RT1nK_mf4",
        type: "audio/mpeg",
        size: 2.1 * 1024 * 1024, // Mock size for display
      },
    ];
    setResources(rcData);

    const handleChanged = () => {
      const material = mediaPlayerService.playingMaterial;
      const url = mediaPlayerService.playingUrl;

      setPlayingMaterial(material);
      setPlayingUrl(url);
      setPlaylist(mediaPlayerService.playlist);

      if (url) {
        setIsPlaying(true);
        // Dispatch radio stop event
        window.dispatchEvent(new CustomEvent("cc_stop_radio"));

        // Use timeout to ensure element is ready after key-change remount
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch((err) => {
              if (err.name === "NotAllowedError") {
                console.warn("Autoplay blocked, waiting for user interaction");
              } else {
                console.error("Playback failed:", err);
                const msg =
                  appLanguage === "pl"
                    ? "Odtwarzanie zablokowane lub błąd źródła"
                    : "Playback blocked or source error";
                window.dispatchEvent(
                  new CustomEvent("cc_show_toast", {
                    detail: { message: msg, type: "error" },
                  }),
                );
              }
              setIsPlaying(false);
            });
          }
        }, 500);
      }
    };

    mediaPlayerService.on("changed", handleChanged);
    handleChanged();

    // Load my files
    const stored = localStorage.getItem("cc_userMaterials");
    if (stored) {
      try {
        setMyMaterials(JSON.parse(stored));
      } catch (e) {}
    }

    return () => {
      mediaPlayerService.removeListener("changed", handleChanged);
    };
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(
        (audioRef.current.currentTime /
          Math.max(1, audioRef.current.duration)) *
          100,
      );
    }
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
          console.error("Playback failed in togglePlay:", e);
          setIsPlaying(false);
        }
      }
    }
  };

  const stop = () => {
    mediaPlayerService.stop();
    setIsPlaying(false);
  };

  const isVideo = playingMaterial
    ? playingMaterial.type.startsWith("video/") ||
      playingMaterial.name.endsWith(".mp4")
    : false;

  return (
    <>
      {/* Background Audio Engine - always mounted */}
      {playingUrl && !isVideo && (
        <audio
          key={playingUrl}
          ref={audioRef as any}
          src={playingUrl}
          autoPlay
          className="hidden"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => mediaPlayerService.playNext()}
          onError={(e) => {
            console.error("Audio error:", e);
            const msg =
              appLanguage === "pl"
                ? "Błąd odtwarzania zasobu CC. Sprawdź połączenie."
                : "CC Resource playback error. Check connection.";
            window.dispatchEvent(
              new CustomEvent("cc_show_toast", {
                detail: { message: msg, type: "error" },
              }),
            );
          }}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 z-[10000] bg-black flex flex-col overflow-hidden select-none ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
          >
            {/* Background Decorative */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C5A059] rounded-full blur-[150px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C5A059] rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8A6D3B] flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                  <Music className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase">
                    {appLanguage === "pl" ? "ODTWARZACZ" : "MEDIA PLAYER"}{" "}
                    <span className="text-[#C5A059]">CC</span>
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                    Christian Culture Multimedia
                  </p>
                </div>
              </div>
              <button
                aria-label="Zamknij"
                onClick={onClose}
                className="p-4 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all hover:bg-white/10 active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left Side: Visuals & Current Item */}
              <div className="flex-[2] flex flex-col p-6 lg:p-12 items-center justify-center relative border-r border-white/5 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/20">
                <div className="w-full max-w-4xl flex flex-col items-center">
                  {playingMaterial ? (
                    <div className="w-full flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                      {/* Media Display */}
                      <div className="w-full aspect-video lg:aspect-[21/9] rounded-[2.5rem] bg-zinc-900 border border-[#C5A059]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative flex items-center justify-center group pointer-events-auto">
                        {isVideo ? (
                          <video
                            key={playingUrl}
                            ref={audioRef as any}
                            src={playingUrl!}
                            autoPlay
                            className="w-full h-full object-contain"
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => mediaPlayerService.playNext()}
                            onError={(e) => {
                              console.error("Video error:", e);
                              const msg =
                                appLanguage === "pl"
                                  ? "Błąd odtwarzania wideo"
                                  : "Video playback error";
                              window.dispatchEvent(
                                new CustomEvent("cc_show_toast", {
                                  detail: { message: msg, type: "error" },
                                }),
                              );
                            }}
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
                            <AudioVisualizer
                              audioRef={audioRef as any}
                              isPlaying={isPlaying}
                            />
                            <div className="relative z-10 flex flex-col items-center">
                              <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[3rem] bg-gradient-to-br from-[#C5A059]/20 to-black border border-[#C5A059]/40 flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                                <div className="absolute inset-0 bg-[#C5A059]/5 animate-pulse" />
                                <Music className="w-16 h-16 lg:w-24 lg:h-24 text-[#C5A059] drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
                              </div>
                              <div className="mt-8 text-center space-y-2">
                                <span className="px-4 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-[10px] font-black uppercase tracking-[0.2em]">
                                  {appLanguage === "pl"
                                    ? "Teraz Odtwarzane"
                                    : "Now Playing"}
                                </span>
                                <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tight px-6 max-w-2xl">
                                  {playingMaterial.name}
                                </h3>
                              </div>
                            </div>
                            {/* Audio visualizer only here - audio tag is global for background play */}
                          </>
                        )}
                      </div>

                      {/* Progress & Controls */}
                      <div className="w-full max-w-2xl space-y-8 mt-4">
                        {/* Seek Bar */}
                        <div className="space-y-4">
                          <div
                            className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 cursor-pointer relative group"
                            onClick={(e) => {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const x = e.clientX - rect.left;
                              const pct = x / rect.width;
                              if (audioRef.current) {
                                audioRef.current.currentTime =
                                  pct * (audioRef.current.duration || 0);
                              }
                            }}
                          >
                            <div
                              className="absolute inset-0 bg-[#C5A059]"
                              style={{ width: `${progress}%` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            <span>
                              {Math.floor(
                                (audioRef.current?.currentTime || 0) / 60,
                              )}
                              :
                              {Math.floor(
                                (audioRef.current?.currentTime || 0) % 60,
                              )
                                .toString()
                                .padStart(2, "0")}
                            </span>
                            <span>
                              {Math.floor(
                                (audioRef.current?.duration || 0) / 60,
                              )}
                              :
                              {Math.floor(
                                (audioRef.current?.duration || 0) % 60,
                              )
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        {/* Main Buttons */}
                        <div className="flex items-center justify-center gap-10">
                          <button
                            aria-label="Poprzedni utwór"
                            onClick={() => mediaPlayerService.playPrev()}
                            disabled={playlist.length <= 1}
                            className="p-4 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                          >
                            <SkipBack className="w-8 h-8" />
                          </button>

                          <button
                            aria-label="Odtwarzaj"
                            onClick={togglePlay}
                            className="w-24 h-24 rounded-full bg-[#C5A059] flex items-center justify-center text-black shadow-[0_0_30px_rgba(197,160,89,0.4)] hover:scale-105 transition-all active:scale-95 group/play"
                          >
                            {isPlaying ? (
                              <Pause className="w-10 h-10 fill-current" />
                            ) : (
                              <Play className="w-10 h-10 fill-current ml-2" />
                            )}
                          </button>

                          <button
                            onClick={stop}
                            className="p-4 bg-white/5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                          >
                            <Square className="w-8 h-8 fill-current" />
                          </button>

                          <button
                            aria-label="Następny utwór"
                            onClick={() => mediaPlayerService.playNext()}
                            disabled={playlist.length <= 1}
                            className="p-4 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                          >
                            <SkipForward className="w-8 h-8" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-8 py-20 opacity-40">
                      <div className="w-40 h-40 rounded-[3.5rem] bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center">
                        <Music className="w-20 h-20 text-zinc-700" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-black text-white tracking-widest uppercase">
                          {appLanguage === "pl"
                            ? "ODTWARZACZ PUSTY"
                            : "PLAYER EMPTY"}
                        </h3>
                        <p className="text-sm font-medium text-zinc-500 mt-2">
                          {appLanguage === "pl"
                            ? "Wybierz media z biblioteki lub zasobów."
                            : "Select media from library or resources."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Playlist / Menu */}
              <div className="lg:w-96 flex flex-col bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/40 backdrop-blur-xl border-l border-white/5">
                <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex gap-2">
                  <button
                    onClick={() => setActiveTab("playlist")}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === "playlist"
                        ? "bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20"
                        : "bg-white/5 text-zinc-500 hover:bg-white/10"
                    }`}
                  >
                    {appLanguage === "pl" ? "KOLEJKA" : "PLAY"}
                  </button>
                  <button
                    onClick={() => setActiveTab("myfiles")}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === "myfiles"
                        ? "bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20"
                        : "bg-white/5 text-zinc-500 hover:bg-white/10"
                    }`}
                  >
                    {appLanguage === "pl" ? "MOJE" : "MY"}
                  </button>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === "resources"
                        ? "bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20"
                        : "bg-white/5 text-zinc-500 hover:bg-white/10"
                    }`}
                  >
                    {appLanguage === "pl" ? "ZASOBY" : "RESOURCES"}
                  </button>
                </div>

                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">
                      {activeTab === "playlist"
                        ? appLanguage === "pl"
                          ? "KOLEJKA ODTWARZANIA"
                          : "NOW PLAYING"
                        : activeTab === "myfiles"
                          ? appLanguage === "pl"
                            ? "MOJA BIBLIOTEKA"
                            : "MY LIBRARY"
                          : appLanguage === "pl"
                            ? "ZASOBY CHRISTIAN CULTURE"
                            : "CC RESOURCES"}
                    </h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                      {activeTab === "playlist"
                        ? playlist.length
                        : activeTab === "myfiles"
                          ? myMaterials.length
                          : resources.length}{" "}
                      {appLanguage === "pl" ? "Elementów" : "Items"}
                    </p>
                  </div>
                  {activeTab === "playlist" ? (
                    <List className="w-4 h-4 text-[#C5A059]" />
                  ) : (
                    <Music className="w-4 h-4 text-[#C5A059]" />
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                  {activeTab === "playlist" ? (
                    playlist.length > 0 ? (
                      playlist.map((item, index) => (
                        <button
                          aria-label="Głośność"
                          key={item.id + index}
                          onClick={() =>
                            mediaPlayerService.play(item, playlist)
                          }
                          className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                            playingMaterial?.id === item.id
                              ? "bg-[#C5A059]/10 border border-[#C5A059]/40 border-l-[6px] border-l-[#C5A059]"
                              : "bg-white/5 border border-transparent hover:bg-white/10"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              playingMaterial?.id === item.id
                                ? "bg-[#C5A059]"
                                : "bg-zinc-900 group-hover:bg-zinc-800"
                            }`}
                          >
                            {item.type.startsWith("video/") ||
                            item.name.endsWith(".mp4") ? (
                              <Film
                                className={`w-5 h-5 ${playingMaterial?.id === item.id ? "text-black" : "text-zinc-500"}`}
                              />
                            ) : (
                              <Volume2
                                className={`w-5 h-5 ${playingMaterial?.id === item.id ? "text-black" : "text-zinc-500"}`}
                              />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h4
                              className={`text-xs font-bold truncate leading-tight ${
                                playingMaterial?.id === item.id
                                  ? "text-white"
                                  : "text-zinc-400 group-hover:text-zinc-200"
                              }`}
                            >
                              {item.name}
                            </h4>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                              {(item.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                          {playingMaterial?.id === item.id && isPlaying && (
                            <div className="flex gap-0.5 items-end h-3">
                              <div className="w-1 bg-[#C5A059] animate-music-bar-1 rounded-full" />
                              <div className="w-1 bg-[#C5A059] animate-music-bar-2 rounded-full" />
                              <div className="w-1 bg-[#C5A059] animate-music-bar-3 rounded-full" />
                            </div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                        <Volume2 className="w-12 h-12 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                          {appLanguage === "pl"
                            ? "Kolejka jest pusta.\nTwoja muzyka pojawi się tutaj."
                            : "Playlist is empty.\nYour music will appear here."}
                        </p>
                      </div>
                    )
                  ) : activeTab === "myfiles" ? (
                    myMaterials.length > 0 ? (
                      myMaterials
                        .filter(
                          (m) =>
                            m.type.startsWith("audio/") ||
                            m.type.startsWith("video/") ||
                            m.name.endsWith(".mp3") ||
                            m.name.endsWith(".mp4"),
                        )
                        .map((item, index) => (
                          <button
                            aria-label="Głośność"
                            key={item.id + index}
                            onClick={() =>
                              mediaPlayerService.play(item, myMaterials)
                            }
                            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                              playingMaterial?.id === item.id
                                ? "bg-[#C5A059]/10 border border-[#C5A059]/40 border-l-[6px] border-l-[#C5A059]"
                                : "bg-white/5 border border-transparent hover:bg-white/10"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                playingMaterial?.id === item.id
                                  ? "bg-[#C5A059]"
                                  : "bg-zinc-900 group-hover:bg-zinc-800"
                              }`}
                            >
                              {item.type.startsWith("video/") ||
                              item.name.endsWith(".mp4") ? (
                                <Film
                                  className={`w-5 h-5 ${playingMaterial?.id === item.id ? "text-black" : "text-zinc-500"}`}
                                />
                              ) : (
                                <Volume2
                                  className={`w-5 h-5 ${playingMaterial?.id === item.id ? "text-black" : "text-zinc-500"}`}
                                />
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <h4
                                className={`text-xs font-bold truncate leading-tight ${
                                  playingMaterial?.id === item.id
                                    ? "text-white"
                                    : "text-zinc-400 group-hover:text-zinc-200"
                                }`}
                              >
                                {item.name}
                              </h4>
                              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                {(item.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                            </div>
                          </button>
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                        <Music className="w-12 h-12 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                          {appLanguage === "pl"
                            ? "Twoja biblioteka jest pusta."
                            : "Your library is empty."}
                        </p>
                      </div>
                    )
                  ) : resources.length > 0 ? (
                    resources.map((item, index) => (
                      <button
                        aria-label="Głośność"
                        key={item.id + index}
                        onClick={() =>
                          mediaPlayerService.playUrl(item.url, item.name)
                        }
                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                          playingMaterial?.name === item.name
                            ? "bg-[#C5A059]/10 border border-[#C5A059]/40 border-l-[6px] border-l-[#C5A059]"
                            : "bg-white/5 border border-transparent hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            playingMaterial?.name === item.name
                              ? "bg-[#C5A059]"
                              : "bg-zinc-900 group-hover:bg-zinc-800"
                          }`}
                        >
                          <Volume2
                            className={`w-5 h-5 ${playingMaterial?.name === item.name ? "text-black" : "text-zinc-500"}`}
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h4
                            className={`text-xs font-bold truncate leading-tight ${
                              playingMaterial?.name === item.name
                                ? "text-white"
                                : "text-zinc-400 group-hover:text-zinc-200"
                            }`}
                          >
                            {item.name}
                          </h4>
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                            {(item.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <Music className="w-12 h-12 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                        {appLanguage === "pl"
                          ? "Brak dostępnych zasobów."
                          : "No resources available."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="p-8 bg-zinc-900/40 border-t border-white/5">
                  <div className="flex items-center justify-between opacity-60">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                      Premium Experience
                    </span>
                    <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em]">
                      v4.8.240
                    </span>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <p className="text-[8px] text-zinc-600 text-center uppercase tracking-[0.4em] font-medium">
                      Niech każde słowo i dźwięk będzie na chwałę Jahwe.
                    </p>
                    <p className="text-[10px] text-[#C5A059] text-center font-black uppercase tracking-[0.3em] mt-2">
                      Zrób to Dla Jezusa – On już czeka.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
