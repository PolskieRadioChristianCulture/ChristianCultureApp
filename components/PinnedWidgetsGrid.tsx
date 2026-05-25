import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { WidgetConfig } from "../types";
import DailyWordWidget from "./DailyWordWidget";
import { LucideImage, SkipBack, SkipForward } from "lucide-react";
import { useAppStore } from "../useAppStore";

interface PinnedWidgetsGridProps {
  widgetConfigs: Record<string, WidgetConfig>;
  uiLang: "pl" | "en";
}

const PinnedWidgetsGrid: React.FC<PinnedWidgetsGridProps> = ({
  widgetConfigs,
  uiLang,
}) => {
  const areAllWidgetsHidden = useAppStore((state) => state.areAllWidgetsHidden);
  const pinnedWidgets = Object.values(widgetConfigs).filter((w) => w.isPinned);

  if (pinnedWidgets.length === 0) return null;

  return (
    <div className="grid grid-cols-12 gap-6 w-full animate-fade-in py-6">
      <AnimatePresence mode="wait">
        {!areAllWidgetsHidden && (
          <motion.div
            key="widgets-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-12 grid grid-cols-12 gap-6"
          >
            <div className="col-span-12">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[#D4AF37]/30" />
                {uiLang === "pl" ? "PRZYPIĘTE MODUŁY" : "PINNED MODULES"}
                <span className="w-full h-px bg-[#D4AF37]/10" />
              </h3>
            </div>

            {pinnedWidgets.map((widget) => {
              const gridPos = widget.gridPos || { x: 0, y: 0, w: 4, h: 2 };

              return (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className={`relative group bg-[#0a0a0a] border border-white/5 shadow-2xl transition-all hover:border-[#D4AF37]/30`}
                  style={{
                    gridColumn: `span ${gridPos.w}`,
                    gridRow: `span ${gridPos.h}`,
                    borderRadius: `${widget.borderRadius || 24}px`,
                    backgroundColor: `rgba(10,10,10, ${(widget.backgroundAlpha || 80) / 100})`,
                    borderColor: `rgba(255,255,255,${(widget.borderWidth || 0) * 0.05})`,
                    borderWidth: `${widget.borderWidth || 0}px`,
                    backdropFilter: `blur(${widget.blurAmount || 0}px)`,
                    boxShadow: widget.shadowIntensity
                      ? `0 ${widget.shadowIntensity / 4}px ${widget.shadowIntensity}px rgba(0,0,0,${widget.shadowIntensity / 100})`
                      : "none",
                    fontFamily: widget.fontFamily,
                  }}
                >
                  {/* Glowing background for depth effect */}
                  <div
                    className="absolute -inset-10 opacity-[0.05] group-hover:opacity-15 transition-all duration-1000 blur-[80px] pointer-events-none z-0"
                    style={{
                      background: `radial-gradient(circle at center, ${widget.accentColor || "#D4AF37"} 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10 w-full h-full">
                    {widget.id.includes("bible") ||
                    widget.id.includes("custom") ? (
                      <DailyWordWidget
                        backgroundImage={widget.backgroundImage}
                        verseText={
                          uiLang === "pl"
                            ? "„Albowiem tak Bóg umiłował świat, że Syna swego jednorodzonego dał...”"
                            : "„For God so loved the world, that he gave his only begotten Son...”"
                        }
                        verseRef={
                          uiLang === "pl" ? "Ew. Jana 3:16" : "John 3:16"
                        }
                        accentColor={widget.accentColor}
                        borderRadius={widget.borderRadius}
                        backgroundAlpha={widget.backgroundAlpha}
                        showLogo={widget.showLogo}
                      />
                    ) : widget.id === "radio-control" ? (
                      <div className="w-full h-full flex flex-col p-6 space-y-4">
                        <div className="flex justify-between items-center z-10">
                          <span
                            className="text-[10px] font-black uppercase tracking-[0.3em]"
                            style={{ color: widget.accentColor }}
                          >
                            CC Network Radio
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center z-10">
                          <span className="text-sm font-black text-white tracking-widest leading-tight">
                            Polskie Radio Christian Culture
                          </span>
                          <span className="text-[8px] text-zinc-500 font-bold uppercase mt-1">
                            Premium Global Stream
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-8 z-10">
                          <div
                            className="text-3xl transition-transform active:scale-95 cursor-pointer"
                            style={{ color: widget.accentColor }}
                          >
                            ▶️
                          </div>
                        </div>
                      </div>
                    ) : widget.id === "media-player" ? (
                      <div className="w-full h-full flex flex-col p-6 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-xl shadow-inner overflow-hidden">
                            <LucideImage className="w-5 h-5 text-zinc-700" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="text-xs font-black text-white truncate leading-none uppercase tracking-tighter">
                              Szkoła Biblijna Lecja 01
                            </div>
                            <div className="text-[8px] text-[#D4AF37] font-bold mt-1 uppercase">
                              Nazir Mentor AI
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-8 pt-2">
                          <SkipBack className="w-4 h-4 text-zinc-700 hover:text-white transition-colors" />
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900 border border-white/5 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
                            <div
                              className="text-2xl"
                              style={{ color: widget.accentColor }}
                            >
                              ⏸
                            </div>
                          </div>
                          <SkipForward className="w-4 h-4 text-zinc-700 hover:text-white transition-colors" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest">
                          {widget.name}
                        </h4>
                        <p className="text-zinc-500 text-[10px] mt-2 leading-relaxed">
                          {widget.description}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PinnedWidgetsGrid;
