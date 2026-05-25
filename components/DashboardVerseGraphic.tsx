import React, { useRef, useState } from "react";
import { Share2, Zap } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { BibleVerse } from "../types";

interface DashboardVerseGraphicProps {
  verse: BibleVerse | null;
  appLanguage: "pl" | "en";
  addToast: (msg: string, type?: string) => void;
}

export const DashboardVerseGraphic: React.FC<DashboardVerseGraphicProps> = ({
  verse,
  appLanguage,
  addToast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const dayOfYear = Math.floor(
    (new Date().getTime() -
      new Date(new Date().getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24,
  );
  const backgroundIndex = (dayOfYear % 10) + 1;
  const bgUrl = `/backgrounds/${backgroundIndex}.webp`;

  const handleShare = async () => {
    if (!previewRef.current || !verse) return;
    try {
      setIsGenerating(true);
      const node = previewRef.current;
      const scale = 1080 / node.offsetWidth;
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        pixelRatio: scale,
        fontEmbedCSS: "",
        skipFonts: true,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const file = new File([blob], `werset-dnia-cc-${Date.now()}.webp`, {
        type: "image/png",
      });
      const shareText = `"${verse.text}" — ${verse.reference}\n\n#ChristianCulture | cclite.pl | www.polskieradio.cc |\nPolecam aplikacje Christian Culture w sklepie Google Play: https://play.google.com/store/apps/dev?id=5215448773598149938 \n| Udostępnij Werset Dnia i zostań patronem na https://patronite.pl/osobowoscplus\n| Niech dobry Bóg Cię błogosławi.`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Werset Dnia - Christian Culture",
          text: shareText,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Werset Dnia - Christian Culture",
          text: shareText,
          url: "https://cclite.pl",
        });
      } else {
        addToast(
          appLanguage === "pl"
            ? "Twoja przeglądarka nie wspiera udostępniania plików."
            : "Your browser does not support file sharing.",
          "info",
        );
      }
    } catch (err) {
      console.error("Failed to generate image", err);
      addToast(
        appLanguage === "pl"
          ? "Błąd podczas generowania obrazu"
          : "Error generating image",
        "alert",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const formatVerseText = (text: string) => {
    // Add a newline (\n) after sentence-ending punctuation so each sentence is on a new line.
    return text.replace(/([.!?][»"'\)]*)\s+/g, "$1\n").trim();
  };

  if (!verse) return null;

  return (
    <div className="w-[100%] h-full flex justify-center relative group">
      {/* Outer container */}
      <div className="w-full h-full bg-black border border-white/5 shadow-2xl rounded-3xl overflow-hidden flex flex-col relative transition-all duration-500 hover:border-[#C5A059]/30">
        {/* Real graphic container (used for generation) */}
        <div
          ref={previewRef}
          className="w-full flex-1 relative flex items-center justify-center overflow-hidden bg-black object-cover"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          </div>

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 text-center py-10 overflow-auto scrollbar-none">
            <div className="flex flex-col items-center gap-2 max-w-[95%] mx-auto mb-auto pt-4 hidden">
              {/* Empty space filler for vertical centering if needed */}
            </div>

            <div className="w-full flex flex-col items-center justify-center">
              <p
                className="text-white/95 font-serif italic mb-4 leading-relaxed drop-shadow-md whitespace-pre-wrap"
                style={{ fontSize: "1.25rem", fontFamily: "Lora, serif" }}
              >
                "{formatVerseText(verse.text)}"
              </p>
              <div className="w-16 h-px bg-[#C5A059] mx-auto mb-4" />
              <p
                className="text-[#C5A059] font-black uppercase tracking-widest drop-shadow-sm whitespace-pre-wrap"
                style={{ fontSize: "0.85rem" }}
              >
                {verse.reference.replace(/ – /g, " ")}
              </p>
            </div>

            <div className="absolute bottom-6 inset-x-0 w-full px-6 flex items-center justify-between pointer-events-none select-none opacity-40">
              <div className="w-8 h-8 rounded bg-[#C5A059] flex items-center justify-center text-black font-black text-[10px]">
                CC
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                  Digital Light
                </span>
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-white">
                  Christian Culture
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Share Button overlaid below */}
        <div className="bg-black/50 backdrop-blur-md border-t border-white/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 pl-2">
            <Zap className="w-4 h-4 text-[#C5A059]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                {appLanguage === "pl" ? "Werset Dnia" : "Verse of the Day"}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                {appLanguage === "pl" ? "Edycja Specjalna" : "Special Edition"}
              </span>
            </div>
          </div>

          <button
            aria-label="Udostępnij"
            onClick={handleShare}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-full bg-[#C5A059] text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isGenerating
              ? appLanguage === "pl"
                ? "Tworzenie..."
                : "Creating..."
              : appLanguage === "pl"
                ? "Udostępnij Grafike"
                : "Share Graphic"}
          </button>
        </div>
      </div>
    </div>
  );
};
