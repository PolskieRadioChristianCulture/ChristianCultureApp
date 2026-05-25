import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Download,
  Share2,
  Upload,
  Image as ImageIcon,
  Save,
  Settings2,
  Maximize2,
  Zap,
} from "lucide-react";
import {
  BibleVerse,
  SupportedLanguage,
  ToastMessage,
  fixOrphans,
} from "../types";
import * as htmlToImage from "html-to-image";
import { PersistenceService } from "../services/persistenceService";
import { motion, AnimatePresence } from "motion/react";
import MaxVerseGenerator from "./MaxVerseGenerator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  verse: BibleVerse | null;
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  isTickerExpanded?: boolean;
}

export const VerseImageGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  verse,
  appLanguage,
  addToast,
  isTickerExpanded = false,
}) => {
  const [bgIndex, setBgIndex] = useState<number>(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"backgrounds" | "text">(
    "backgrounds",
  );

  const [verseFontSize, setVerseFontSize] = useState<number>(24);
  const [versePosY, setVersePosY] = useState<number>(0);
  const [verseMaxWidth, setVerseMaxWidth] = useState<number>(100);
  const [refFontSize, setRefFontSize] = useState<number>(14);
  const [refPosY, setRefPosY] = useState<number>(0);
  const [refMaxWidth, setRefMaxWidth] = useState<number>(100);
  const [isMaxGeneratorOpen, setIsMaxGeneratorOpen] = useState(false);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [startFontSize, setStartFontSize] = useState<number>(24);
  const [startPosY, setStartPosY] = useState<number>(0);

  const [selectedFont, setSelectedFont] = useState<string>("font-serif");
  const fonts = [
    { name: "Lora", className: "font-serif" },
    { name: "Inter", className: "font-sans" },
    { name: "JetBrains", className: "font-mono" },
  ];

  const availableBackgrounds = Array.from(
    { length: 10 },
    (_, i) => `/backgrounds/${i + 1}.jpg`,
  );

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        setTouchStartDist(dist);
        setStartFontSize(verseFontSize);
      } else if (e.touches.length === 1) {
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
        setStartPosY(versePosY);
      }
    } else {
      setTouchStartX((e as React.MouseEvent).clientX);
      setTouchStartY((e as React.MouseEvent).clientY);
      setStartPosY(versePosY);
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      if (e.touches.length === 2 && touchStartDist !== null) {
        // Handle pinching for font size
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const ratio = dist / touchStartDist;
        setVerseFontSize(Math.min(Math.max(16, startFontSize * ratio), 100));
        setHasInteracted(true);
      } else if (e.touches.length === 1 && touchStartY !== null) {
        // Handle drag to move up/down
        const deltaY = e.touches[0].clientY - touchStartY;
        // Adjust drag speed based on container size, just raw pixels works fine
        setVersePosY(startPosY + deltaY);
        setHasInteracted(true);
      }
    } else {
      if (touchStartY !== null) {
        const deltaY = (e as React.MouseEvent).clientY - touchStartY;
        setVersePosY(startPosY + deltaY);
        setHasInteracted(true);
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchStartDist(null);

    let endX: number | null = null;
    let endY: number | null = null;

    if ("changedTouches" in e && e.changedTouches.length > 0) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else if ("clientX" in e) {
      endX = (e as React.MouseEvent).clientX;
      endY = (e as React.MouseEvent).clientY;
    }

    if (
      touchStartX !== null &&
      endX !== null &&
      touchStartY !== null &&
      endY !== null
    ) {
      const distanceX = touchStartX - endX;
      const distanceY = Math.abs(touchStartY - endY);

      // Only trigger horizontal swipe if movement is mostly horizontal
      if (Math.abs(distanceX) > 50 && distanceY < Math.abs(distanceX)) {
        const isLeftSwipe = distanceX > 50;
        const isRightSwipe = distanceX < -50;

        if (isLeftSwipe || isRightSwipe) {
          setHasInteracted(true);
        }

        if (isLeftSwipe) {
          setBgIndex((prev) => Math.min(prev + 1, availableBackgrounds.length));
        }
        if (isRightSwipe) {
          setBgIndex((prev) => Math.max(prev - 1, 0));
        }
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  useEffect(() => {
    if (isOpen) {
      const savedSettings = PersistenceService.loadVerseImageSettings();
      if (savedSettings) {
        if (savedSettings.verseFontSize !== undefined)
          setVerseFontSize(savedSettings.verseFontSize);
        if (savedSettings.versePosY !== undefined)
          setVersePosY(savedSettings.versePosY);
        if (savedSettings.verseMaxWidth !== undefined)
          setVerseMaxWidth(savedSettings.verseMaxWidth);
        if (savedSettings.refFontSize !== undefined)
          setRefFontSize(savedSettings.refFontSize);
        if (savedSettings.refPosY !== undefined)
          setRefPosY(savedSettings.refPosY);
        if (savedSettings.refMaxWidth !== undefined)
          setRefMaxWidth(savedSettings.refMaxWidth);
      }
    }
  }, [isOpen]);

  const handleSaveSettings = () => {
    PersistenceService.saveVerseImageSettings({
      verseFontSize,
      versePosY,
      verseMaxWidth,
      refFontSize,
      refPosY,
      refMaxWidth,
    });
    addToast(
      appLanguage === "pl"
        ? "Zapisano ustawienia wyświetlania!"
        : "Display settings saved!",
      "success",
    );
  };

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast(
          appLanguage === "pl"
            ? "Plik jest za duży (max 5MB)"
            : "File is too large (max 5MB)",
          "alert",
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBg(event.target?.result as string);
        setBgIndex(availableBackgrounds.length);
        setHasInteracted(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async (): Promise<Blob | null> => {
    if (!previewRef.current) return null;
    try {
      setIsGenerating(true);
      const node = previewRef.current;
      const scale = 1080 / node.offsetWidth;
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        pixelRatio: scale,
        fontEmbedCSS: "",
        skipFonts: true,
        canvasWidth: 1080,
        canvasHeight: 1080,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      setIsGenerating(false);
      return blob;
    } catch (err) {
      setIsGenerating(false);
      console.error("Failed to generate image", err);
      addToast(
        appLanguage === "pl"
          ? "Błąd podczas generowania obrazu"
          : "Error generating image",
        "alert",
      );
      return null;
    }
  };

  const handleDownload = async () => {
    const blob = await generateImage();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `werset-dnia-cc-${Date.now()}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(
        appLanguage === "pl" ? "Zapisano obraz!" : "Image saved!",
        "success",
      );
    }
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const file = new File([blob], `werset-dnia-cc-${Date.now()}.webp`, {
      type: "image/png",
    });
    const shareText = `"${verse?.text}" — ${verse?.reference}\n\n#ChristianCulture | cclite.pl | www.polskieradio.cc |\nPolecam aplikacje Christian Culture w sklepie Google Play: https://play.google.com/store/apps/dev?id=5215448773598149938 \n| Udostępnij Werset Dnia i zostań patronem na https://patronite.pl/osobowoscplus\n| Niech dobry Bóg Cię błogosławi.`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Werset Dnia - Christian Culture",
          text: shareText,
        });
      } catch (e) {
        console.log("Share canceled or failed", e);
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: "Werset Dnia - Christian Culture",
          text: shareText,
          url: "https://cclite.pl",
        });
      } catch (e) {}
    } else {
      addToast(
        appLanguage === "pl"
          ? "Twoja przeglądarka nie wspiera udostępniania plików, użyj przycisku Pobierz"
          : "Your browser does not support file sharing, use the Download button",
        "info",
      );
      handleDownload();
    }
  };

  if (!isOpen || !verse) return null;

  const currentBgSrc =
    bgIndex === availableBackgrounds.length
      ? customBg || ""
      : availableBackgrounds[bgIndex];

  return (
    <div
      className={`fixed inset-0 z-[11000] bg-[#09090b] flex flex-col items-center justify-start overflow-hidden animate-fade-in`}
    >
      {/* Sticky Header */}
      <div className="w-full flex justify-between items-center px-8 sm:px-12 py-6 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/80 backdrop-blur-xl border-b border-zinc-800 shrink-0 z-50 pt-[calc(1rem+env(safe-area-inset-top,0px))]">
        <h2 className="text-xl font-black text-[#C5A059] uppercase tracking-widest flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          {appLanguage === "pl" ? "Kreator Wersetu" : "Verse Creator"}
        </h2>
        <button
          aria-label="Zamknij"
          onClick={onClose}
          className="p-2 text-zinc-500 hover:text-white rounded-full hover:bg-white/5 transition-all active:scale-95"
          title={appLanguage === "pl" ? "Zamknij" : "Close"}
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-6 py-8 flex flex-col items-center">
        <div className="w-full aspect-square max-w-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex items-center justify-center overflow-hidden rounded-xl bg-zinc-900 transition-all mb-8 mx-auto border border-white/5 shrink-0">
          <div
            ref={previewRef}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: currentBgSrc
                  ? `url('${currentBgSrc}')`
                  : "none",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-between w-full h-full text-center overflow-hidden py-10 pointer-events-none">
              <div className="mb-auto flex flex-col items-center w-full">
                <div className="flex flex-col items-center opacity-50 select-none whitespace-nowrap">
                  <p className="text-white/60 text-[6px] font-medium tracking-[0.3em] uppercase drop-shadow-sm">
                    Christian Culture | www.polskieradio.cc
                  </p>
                </div>
              </div>

              <div
                className="flex-1 flex flex-col items-center justify-center w-full shrink-0"
                style={{ transform: `translateY(${versePosY}px)` }}
              >
                <p
                  className={`text-white/95 italic leading-snug drop-shadow-2xl mx-auto px-2 ${selectedFont}`}
                  style={{
                    fontSize: `${verseFontSize}px`,
                    maxWidth: `${verseMaxWidth}%`,
                  }}
                >
                  "{fixOrphans(verse.text)}"
                </p>
              </div>

              <div className="mt-auto flex flex-col items-center w-full">
                <div
                  className="flex flex-col items-center w-full px-4"
                  style={{ transform: `translateY(${refPosY}px)` }}
                >
                  <div className="flex items-center justify-center w-full max-w-full opacity-90">
                    <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#C5A059]/70" />
                    <p
                      className={`text-[#C5A059] tracking-[0.2em] md:tracking-[0.25em] uppercase drop-shadow-lg shrink-0 px-3 sm:px-4 text-center whitespace-nowrap ${selectedFont}`}
                      style={{
                        fontSize: `${refFontSize}px`,
                        lineHeight: 1.2,
                        maxWidth: `${refMaxWidth}%`,
                      }}
                    >
                      {verse.reference}
                    </p>
                    <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#C5A059]/70" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Area */}
            <div
              className="absolute inset-0 z-30"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onTouchStart}
              onMouseMove={onTouchMove}
              onMouseUp={onTouchEnd}
              onMouseLeave={onTouchEnd}
            >
              {!hasInteracted && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none rounded-xl"
                  onClick={() => setHasInteracted(true)}
                >
                  <motion.div
                    animate={{ x: [-80, 80, -80] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                    className="flex items-center justify-center p-3 rounded-full bg-black/60 shadow-xl"
                  >
                    <span className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      👆
                    </span>
                  </motion.div>
                  <span className="absolute bottom-10 text-white font-black text-sm uppercase tracking-widest drop-shadow-md text-center max-w-[80%]">
                    {appLanguage === "pl"
                      ? "Przesuń tło / Przesuń tekst"
                      : "Swipe bg / Drag text"}
                  </span>
                </div>
              )}

              {bgIndex === availableBackgrounds.length && !customBg && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm cursor-pointer hover:bg-zinc-800/80 transition-colors pointer-events-auto"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setHasInteracted(true);
                    fileInputRef.current?.click();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setHasInteracted(true);
                    fileInputRef.current?.click();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasInteracted(true);
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-16 h-16 text-[#C5A059] mb-4 animate-pulse" />
                  <span className="text-[#C5A059] font-black uppercase tracking-widest text-lg text-center max-w-[70%]">
                    {appLanguage === "pl"
                      ? "DODAJ WŁASNE TŁO"
                      : "ADD CUSTOM BG"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Akcje generowania (ikony premium) */}
        <div className="flex gap-6 mb-4 shrink-0 justify-center">
          <button
            aria-label="Pobierz"
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-14 h-14 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-300 rounded-full flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-lg"
            title={appLanguage === "pl" ? "Pobierz Obraz" : "Download Image"}
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>

          <button
            aria-label="Ustawienia"
            onClick={() => setIsEditing(!isEditing)}
            className={`w-14 h-14 backdrop-blur-md border rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${isEditing ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
            title={appLanguage === "pl" ? "Edytuj" : "Edit"}
          >
            <Settings2 className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button
            aria-label="Udostępnij"
            onClick={handleShare}
            disabled={isGenerating}
            className="w-14 h-14 bg-[#C5A059] text-black rounded-full flex items-center justify-center hover:bg-[#E2B859] transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] disabled:opacity-50 active:scale-95"
            title={appLanguage === "pl" ? "Udostępnij" : "Share"}
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Share2 className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full overflow-hidden flex-shrink-0"
            >
              <div className="w-full pt-4">
                <div className="flex justify-center gap-8 mb-4 border-b border-zinc-800 pb-2">
                  <button
                    onClick={() => setActiveTab("backgrounds")}
                    className={`text-xs font-black uppercase tracking-widest transition-colors ${activeTab === "backgrounds" ? "text-[#C5A059]" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    {appLanguage === "pl" ? "Tła" : "Backgrounds"}
                  </button>
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`text-xs font-black uppercase tracking-widest transition-colors ${activeTab === "text" ? "text-[#C5A059]" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    {appLanguage === "pl" ? "Tekst" : "Text"}
                  </button>
                </div>

                {activeTab === "backgrounds" && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-zinc-400 text-xs font-black uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Wybierz Tło"
                          : "Select Background"}
                      </h3>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-[#C5A059]/20 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        {appLanguage === "pl" ? "Wgraj Tło" : "Upload BG"}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleCustomUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex gap-4 overflow-x-auto overflow-y-hidden w-full pb-4 px-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {availableBackgrounds.map((bg, i) => (
                        <button
                          key={bg}
                          onClick={() => {
                            setHasInteracted(true);
                            setBgIndex(i);
                          }}
                          className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all snap-center ${bgIndex === i ? "border-[#C5A059] scale-105 shadow-[0_0_15px_rgba(197,160,89,0.3)]" : "border-zinc-800 hover:border-zinc-600"}`}
                        >
                          <img
                            src={bg}
                            alt={bg}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}

                      {customBg && (
                        <button
                          onClick={() => {
                            setHasInteracted(true);
                            setBgIndex(availableBackgrounds.length);
                          }}
                          className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all snap-center ${bgIndex === availableBackgrounds.length ? "border-[#C5A059] scale-105 shadow-[0_0_15px_rgba(197,160,89,0.3)]" : "border-zinc-800 hover:border-zinc-600"}`}
                        >
                          <img
                            src={customBg}
                            alt="Custom"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )}

                      {/* Upload Plus Tile */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`shrink-0 w-24 h-24 rounded-xl border-2 border-dashed transition-all snap-center flex flex-col items-center justify-center gap-1 group ${bgIndex === availableBackgrounds.length && !customBg ? "border-[#C5A059] bg-[#C5A059]/10" : "border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#C5A059]/5"}`}
                      >
                        <Upload className="w-6 h-6 text-[#C5A059] group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase text-[#C5A059]/80">
                          {appLanguage === "pl" ? "DODAJ" : "ADD"}
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {activeTab === "text" && (
                  <div className="flex flex-col gap-6 w-full pb-10 px-1">
                    {/* Font Selection */}
                    <div className="flex flex-col gap-3">
                      <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        {appLanguage === "pl" ? "Czcionka" : "Font"}
                      </label>
                      <div className="flex gap-2">
                        {fonts.map((f) => (
                          <button
                            key={f.name}
                            onClick={() => setSelectedFont(f.className)}
                            className={`flex-1 py-2 rounded-lg border transition-all text-xs ${f.className} ${selectedFont === f.className ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"}`}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          {appLanguage === "pl"
                            ? "Wielkość Wersetu"
                            : "Verse Size"}
                        </label>
                        <span className="text-[#C5A059] text-xs font-mono">
                          {verseFontSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="72"
                        value={verseFontSize}
                        onChange={(e) =>
                          setVerseFontSize(Number(e.target.value))
                        }
                        className="w-full accent-[#C5A059]"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          {appLanguage === "pl"
                            ? "Pozycja Wersetu (Y)"
                            : "Verse Position (Y)"}
                        </label>
                        <span className="text-[#C5A059] text-xs font-mono">
                          {versePosY}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={versePosY}
                        onChange={(e) => setVersePosY(Number(e.target.value))}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          {appLanguage === "pl"
                            ? "Szerokość Wersetu"
                            : "Verse Width"}
                        </label>
                        <span className="text-[#C5A059] text-xs font-mono">
                          {verseMaxWidth}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={verseMaxWidth}
                        onChange={(e) =>
                          setVerseMaxWidth(Number(e.target.value))
                        }
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    <div className="h-[1px] bg-zinc-800/50 my-1 w-full" />

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          {appLanguage === "pl"
                            ? "Wielkość Odnośnika"
                            : "Reference Size"}
                        </label>
                        <span className="text-[#C5A059] text-xs font-mono">
                          {refFontSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={refFontSize}
                        onChange={(e) => setRefFontSize(Number(e.target.value))}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          {appLanguage === "pl"
                            ? "Pozycja Odnośnika (Y)"
                            : "Reference Position (Y)"}
                        </label>
                        <span className="text-[#C5A059] text-xs font-mono">
                          {refPosY}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={refPosY}
                        onChange={(e) => setRefPosY(Number(e.target.value))}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          {appLanguage === "pl"
                            ? "Szerokość Odnośnika"
                            : "Reference Width"}
                        </label>
                        <span className="text-[#C5A059] text-xs font-mono">
                          {refMaxWidth}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={refMaxWidth}
                        onChange={(e) => setRefMaxWidth(Number(e.target.value))}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    <div className="pt-4 pb-2">
                      <button
                        onClick={handleSaveSettings}
                        className="w-full py-3 bg-zinc-900 border border-zinc-700 text-[#C5A059] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {appLanguage === "pl"
                          ? "Zapisz moje ustawienia wyglądu"
                          : "Save my layout settings"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER: ZAMKNIJ */}
        <div className="w-full mt-4 pb-4 space-y-3">
          <button
            onClick={() => setIsMaxGeneratorOpen(true)}
            className="hidden sm:flex w-full py-5 bg-[#C5A059] border border-[#C5A059]/20 text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-[#D4A017] transition-all shadow-[0_10px_30px_rgba(197,160,89,0.3)] items-center justify-center gap-3 active:scale-95 group mb-2"
          >
            <Zap className="w-4 h-4 group-hover:animate-pulse" />
            {appLanguage === "pl" ? "MAX GENERATOR" : "MAX GENERATOR"}
            <Maximize2 className="w-4 h-4 ml-2" />
          </button>

          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="w-full py-4 bg-zinc-900 border border-zinc-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
          >
            <X className="w-4 h-4" />
            {appLanguage === "pl" ? "ZAMKNIJ GENERATOR" : "CLOSE GENERATOR"}
          </button>
        </div>

        <MaxVerseGenerator
          isOpen={isMaxGeneratorOpen}
          onClose={() => setIsMaxGeneratorOpen(false)}
          initialVerse={verse}
          uiLang={appLanguage === "pl" ? "pl" : "en"}
        />
      </div>
    </div>
  );
};
