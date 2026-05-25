import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Tablet,
  Smartphone,
  Save,
  RefreshCw,
  Settings2,
  Palette,
  Type,
  Image as LucideImage,
  Trash2,
  SkipBack,
  SkipForward,
  Plus,
  Monitor,
  Layers,
  Sparkles,
  Pin,
  PinOff,
  Move,
} from "lucide-react";
import DailyWordWidget from "./DailyWordWidget";
import { useAppStore } from "../useAppStore";
import { WidgetConfig } from "../types";
import { DEFAULT_WIDGET_CONFIGS } from "../constants";

interface WidgetDashboardProps {
  onBack: () => void;
  uiLang?: "pl" | "en";
}

const WidgetDashboard: React.FC<WidgetDashboardProps> = ({
  onBack,
  uiLang = "pl",
}) => {
  const { userPersona, setUserPersona } = useAppStore();
  const [selectedWidgetId, setSelectedWidgetId] =
    useState<string>("bible-daily");
  const [activeTab, setActiveTab] = useState<"style" | "content" | "advanced">(
    "style",
  );
  const [previewMode, setPreviewMode] = useState<
    "mobile" | "tablet" | "desktop"
  >("mobile");

  const currentConfigs =
    userPersona.widgetConfigs &&
    Object.keys(userPersona.widgetConfigs).length > 0
      ? userPersona.widgetConfigs
      : DEFAULT_WIDGET_CONFIGS;

  const currentWidgetConfig =
    currentConfigs[selectedWidgetId] ||
    DEFAULT_WIDGET_CONFIGS[selectedWidgetId] ||
    DEFAULT_WIDGET_CONFIGS["bible-daily"];

  const handleUpdateConfig = (updates: Partial<WidgetConfig>) => {
    const updatedConfigs = {
      ...currentConfigs,
      [selectedWidgetId]: { ...currentWidgetConfig, ...updates },
    };
    setUserPersona({
      ...userPersona,
      widgetConfigs: updatedConfigs,
    });
  };

  const createNewWidget = () => {
    const newId = `custom-widget-${Date.now()}`;
    const newWidget: WidgetConfig = {
      ...DEFAULT_WIDGET_CONFIGS["bible-daily"],
      id: newId,
      name: uiLang === "pl" ? "Nowy Widżet" : "New Widget",
      description:
        uiLang === "pl"
          ? "Widżet zdefiniowany przez użytkownika."
          : "User defined widget.",
    };

    setUserPersona({
      ...userPersona,
      widgetConfigs: {
        ...currentConfigs,
        [newId]: newWidget,
      },
    });
    setSelectedWidgetId(newId);
  };

  const deleteWidget = (id: string) => {
    if (["bible-daily", "radio-control", "media-player"].includes(id)) return;

    const newConfigs = { ...currentConfigs };
    delete newConfigs[id];

    setUserPersona({
      ...userPersona,
      widgetConfigs: newConfigs,
    });
    setSelectedWidgetId("bible-daily");
  };

  const resetToDefault = () => {
    const defaultConfig = DEFAULT_WIDGET_CONFIGS[selectedWidgetId];
    if (defaultConfig) {
      handleUpdateConfig(defaultConfig);
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-black text-white flex flex-col md:flex-row overflow-hidden animate-fade-in font-sans">
      <div className="w-full md:w-[420px] h-full bg-[#080808] border-r border-white/5 flex flex-col pt-safe pb-safe shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-white/5 transition-colors border border-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-[#D4AF37]">
                {uiLang === "pl" ? "Architekt Widżetów" : "Widget Architect"}
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">
                CCN Global Ecosystem 2026
              </p>
            </div>
          </div>
          <button
            onClick={createNewWidget}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            title={uiLang === "pl" ? "Stwórz nowy" : "Create new"}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/5 bg-black/40">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {Object.keys(currentConfigs).map((id) => (
              <div key={id} className="relative group">
                <button
                  onClick={() => setSelectedWidgetId(id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedWidgetId === id
                      ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_4px_20px_rgba(212,175,55,0.3)] scale-105"
                      : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white hover:border-white/20"
                  }`}
                >
                  {currentConfigs[id].name}
                </button>
                {!["bible-daily", "radio-control", "media-player"].includes(
                  id,
                ) && (
                  <button
                    aria-label="Usuń"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWidget(id);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 hover:scale-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex px-6 border-b border-white/5 justify-between">
          {[
            {
              id: "style",
              icon: Palette,
              label: uiLang === "pl" ? "Styl" : "Style",
            },
            {
              id: "content",
              icon: LucideImage,
              label: uiLang === "pl" ? "Obraz" : "Media",
            },
            {
              id: "advanced",
              icon: Settings2,
              label: uiLang === "pl" ? "Opcje" : "Advanced",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex flex-col items-center gap-1.5 relative transition-all ${
                activeTab === tab.id
                  ? "text-[#D4AF37]"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="nav-tab-active"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#D4AF37] shadow-[0_-2px_10px_rgba(212,175,55,0.5)]"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {activeTab === "style" && (
            <div className="space-y-8 animate-slide-up">
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {uiLang === "pl" ? "Główna Paleta" : "Primary Palette"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-500 uppercase font-black">
                      {uiLang === "pl" ? "Akcent Główny" : "Primary Accent"}
                    </label>
                    <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/10 p-2.5 rounded-2xl hover:border-[#D4AF37]/30 transition-colors">
                      <input
                        type="color"
                        value={currentWidgetConfig.accentColor}
                        onChange={(e) =>
                          handleUpdateConfig({ accentColor: e.target.value })
                        }
                        className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-none"
                      />
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
                        {currentWidgetConfig.accentColor}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-500 uppercase font-black">
                      {uiLang === "pl" ? "Tekst / Ikony" : "Text / Icons"}
                    </label>
                    <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/10 p-2.5 rounded-2xl hover:border-[#D4AF37]/30 transition-colors">
                      <input
                        type="color"
                        value={currentWidgetConfig.contentColor}
                        onChange={(e) =>
                          handleUpdateConfig({ contentColor: e.target.value })
                        }
                        className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-none"
                      />
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
                        {currentWidgetConfig.contentColor}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Layers className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {uiLang === "pl"
                      ? "Geometria i Warstwy"
                      : "Geometry & Layers"}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-lg">
                      <label className="text-[9px] text-zinc-500 uppercase font-black">
                        {uiLang === "pl"
                          ? "Zaokrąglenie Rogów"
                          : "Corner Radius"}
                      </label>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                        {currentWidgetConfig.borderRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="64"
                      step="4"
                      value={currentWidgetConfig.borderRadius}
                      onChange={(e) =>
                        handleUpdateConfig({
                          borderRadius: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-lg">
                      <label className="text-[9px] text-zinc-500 uppercase font-black">
                        {uiLang === "pl" ? "Grubość Ramki" : "Border Width"}
                      </label>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                        {currentWidgetConfig.borderWidth || 0}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      step="1"
                      value={currentWidgetConfig.borderWidth || 0}
                      onChange={(e) =>
                        handleUpdateConfig({
                          borderWidth: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {uiLang === "pl" ? "Efekty Wizualne" : "Visual Effects"}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-lg">
                      <label className="text-[9px] text-zinc-500 uppercase font-black">
                        {uiLang === "pl" ? "Przezroczystość Tła" : "Bg Opacity"}
                      </label>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                        {currentWidgetConfig.backgroundAlpha || 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentWidgetConfig.backgroundAlpha || 100}
                      onChange={(e) =>
                        handleUpdateConfig({
                          backgroundAlpha: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-lg">
                      <label className="text-[9px] text-zinc-500 uppercase font-black">
                        {uiLang === "pl"
                          ? "Intensywność Cienia"
                          : "Shadow Intensity"}
                      </label>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                        {currentWidgetConfig.shadowIntensity || 0}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentWidgetConfig.shadowIntensity || 0}
                      onChange={(e) =>
                        handleUpdateConfig({
                          shadowIntensity: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pin
                          className={`w-4 h-4 ${currentWidgetConfig.isPinned ? "text-[#D4AF37]" : "text-zinc-600"}`}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          {uiLang === "pl"
                            ? "Przypnij do strony głównej"
                            : "Pin to Home Page"}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleUpdateConfig({
                            isPinned: !currentWidgetConfig.isPinned,
                          })
                        }
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${currentWidgetConfig.isPinned ? "bg-[#D4AF37]" : "bg-zinc-800"}`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${currentWidgetConfig.isPinned ? "translate-x-6" : ""}`}
                        />
                      </button>
                    </div>

                    {currentWidgetConfig.isPinned && (
                      <div className="grid grid-cols-2 gap-4 pt-4 animate-fade-in">
                        <div className="space-y-2">
                          <label
                            htmlFor={`col_${selectedWidgetId}`}
                            className="text-[9px] text-zinc-500 uppercase font-black"
                          >
                            Kolumna (X)
                          </label>
                          <select
                            id={`col_${selectedWidgetId}`}
                            value={currentWidgetConfig.gridPos?.x || 0}
                            onChange={(e) =>
                              handleUpdateConfig({
                                gridPos: {
                                  ...(currentWidgetConfig.gridPos || {
                                    x: 0,
                                    y: 0,
                                    w: 1,
                                    h: 1,
                                  }),
                                  x: parseInt(e.target.value),
                                },
                              })
                            }
                            className="w-full bg-zinc-900 border border-white/5 p-2 rounded-xl text-xs text-zinc-300"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor={`row_${selectedWidgetId}`}
                            className="text-[9px] text-zinc-500 uppercase font-black"
                          >
                            Wiersz (Y)
                          </label>
                          <select
                            id={`row_${selectedWidgetId}`}
                            value={currentWidgetConfig.gridPos?.y || 0}
                            onChange={(e) =>
                              handleUpdateConfig({
                                gridPos: {
                                  ...(currentWidgetConfig.gridPos || {
                                    x: 0,
                                    y: 0,
                                    w: 1,
                                    h: 1,
                                  }),
                                  y: parseInt(e.target.value),
                                },
                              })
                            }
                            className="w-full bg-zinc-900 border border-white/5 p-2 rounded-xl text-xs text-zinc-300"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-500 uppercase font-black">
                            Szerokość (W)
                          </label>
                          <select
                            value={currentWidgetConfig.gridPos?.w || 4}
                            onChange={(e) =>
                              handleUpdateConfig({
                                gridPos: {
                                  ...(currentWidgetConfig.gridPos || {
                                    x: 0,
                                    y: 0,
                                    w: 4,
                                    h: 2,
                                  }),
                                  w: parseInt(e.target.value),
                                },
                              })
                            }
                            className="w-full bg-zinc-900 border border-white/5 p-2 rounded-xl text-xs text-zinc-300"
                          >
                            {[1, 2, 3, 4, 5, 6, 8, 12].map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-500 uppercase font-black">
                            Wysokość (H)
                          </label>
                          <select
                            value={currentWidgetConfig.gridPos?.h || 2}
                            onChange={(e) =>
                              handleUpdateConfig({
                                gridPos: {
                                  ...(currentWidgetConfig.gridPos || {
                                    x: 0,
                                    y: 0,
                                    w: 4,
                                    h: 2,
                                  }),
                                  h: parseInt(e.target.value),
                                },
                              })
                            }
                            className="w-full bg-zinc-900 border border-white/5 p-2 rounded-xl text-xs text-zinc-300"
                          >
                            {[1, 2, 3, 4, 5, 6].map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-lg">
                      <label className="text-[9px] text-zinc-500 uppercase font-black">
                        {uiLang === "pl" ? "Efekt Szkła (Glass)" : "Glass Blur"}
                      </label>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                        {currentWidgetConfig.blurAmount || 0}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={currentWidgetConfig.blurAmount || 0}
                      onChange={(e) =>
                        handleUpdateConfig({
                          blurAmount: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6 animate-slide-up">
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <LucideImage className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {uiLang === "pl"
                      ? "Tło i Prestiż"
                      : "Background & Prestige"}
                  </span>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {uiLang === "pl"
                      ? "Personalizowane Tło"
                      : "Custom Background"}
                  </label>
                  <input
                    type="text"
                    value={currentWidgetConfig.backgroundImage || ""}
                    onChange={(e) =>
                      handleUpdateConfig({ backgroundImage: e.target.value })
                    }
                    className="w-full bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-white/5 p-4 rounded-2xl text-[11px] font-mono text-zinc-400 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    placeholder="https://..."
                  />

                  <div className="grid grid-cols-4 gap-3">
                    {[
                      "https://images.unsplash.com/photo-1504052434139-41951f690761",
                      "https://images.unsplash.com/photo-1512411993213-91caeb117947",
                      "https://images.unsplash.com/photo-1445206245138-028a38ae95d1",
                      "https://images.unsplash.com/photo-1590483734724-383b85ad9390",
                      "https://images.unsplash.com/photo-1614850523296-e8c041de439a",
                      "https://images.unsplash.com/photo-1534447677768-be436bb09401",
                      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
                      "https://images.unsplash.com/photo-1542831371-29b0f74f9713",
                    ].map((url) => (
                      <button
                        key={url}
                        onClick={() =>
                          handleUpdateConfig({ backgroundImage: url })
                        }
                        className={`aspect-video rounded-xl bg-cover bg-center border-2 transition-all shadow-lg ${
                          currentWidgetConfig.backgroundImage?.startsWith(url)
                            ? "border-[#D4AF37] scale-110 shadow-[#D4AF37]/20"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        style={{
                          backgroundImage: `url(${url}?auto=format&fit=crop&w=120&q=50)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {uiLang === "pl"
                        ? "Branding Biblia Audio"
                        : "Biblia Audio Branding"}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateConfig({
                          showLogo: !currentWidgetConfig.showLogo,
                        })
                      }
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${currentWidgetConfig.showLogo ? "bg-[#D4AF37]" : "bg-zinc-800"}`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${currentWidgetConfig.showLogo ? "translate-x-6" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-8 animate-slide-up">
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Type className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {uiLang === "pl"
                      ? "Typografia i Treść"
                      : "Typography & Content"}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[9px] text-zinc-500 uppercase font-black">
                      {uiLang === "pl" ? "Rodzina Czcionki" : "Font Family"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Inter", "Lora", "Space Grotesk", "JetBrains Mono"].map(
                        (font) => (
                          <button
                            key={font}
                            onClick={() =>
                              handleUpdateConfig({ fontFamily: font as any })
                            }
                            className={`py-2 px-3 rounded-xl text-[10px] border transition-all ${
                              currentWidgetConfig.fontFamily === font
                                ? "bg-[#D4AF37] border-[#D4AF37] text-black font-black"
                                : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white"
                            }`}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-lg">
                      <label className="text-[9px] text-zinc-500 uppercase font-black">
                        {uiLang === "pl" ? "Rozmiar Czcionki" : "Font Size"}
                      </label>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                        {currentWidgetConfig.fontSize || 14}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={currentWidgetConfig.fontSize || 14}
                      onChange={(e) =>
                        handleUpdateConfig({
                          fontSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-1.5 rounded-lg">
                      <label className="text-[9px] text-zinc-500 uppercase font-black">
                        {uiLang === "pl"
                          ? "Światło (Tracking)"
                          : "Letter Spacing"}
                      </label>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                        {currentWidgetConfig.letterSpacing || "0.1em"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {["0.05em", "0.1em", "0.2em", "0.3em"].map((space) => (
                        <button
                          key={space}
                          onClick={() =>
                            handleUpdateConfig({ letterSpacing: space })
                          }
                          className={`py-2 rounded-lg text-[9px] border transition-all ${
                            currentWidgetConfig.letterSpacing === space
                              ? "border-[#D4AF37] text-[#D4AF37]"
                              : "border-white/5 text-zinc-600"
                          }`}
                        >
                          {space}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-6 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 uppercase font-black">
                    Nazwa Unikalna Widżetu
                  </label>
                  <input
                    type="text"
                    value={currentWidgetConfig.name}
                    onChange={(e) =>
                      handleUpdateConfig({ name: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-xs text-zinc-300 font-bold tracking-wider"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-500 uppercase font-black">
                    Krótki Opis Systemowy
                  </label>
                  <textarea
                    value={currentWidgetConfig.description}
                    onChange={(e) =>
                      handleUpdateConfig({ description: e.target.value })
                    }
                    rows={2}
                    className="w-full bg-zinc-900 border border-white/5 p-3 rounded-xl text-[10px] text-zinc-500 leading-relaxed resize-none"
                  />
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={resetToDefault}
              className="h-14 flex items-center justify-center gap-2 bg-zinc-900/50 hover:bg-zinc-900 border border-white/10 rounded-2xl transition-all group"
            >
              <RefreshCw className="w-4 h-4 text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Restart
              </span>
            </button>
            <button
              onClick={onBack}
              className="h-14 flex items-center justify-center gap-3 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:translate-y-[-2px] active:translate-y-0 transition-all border border-[#D4AF37]/50"
            >
              <Save className="w-5 h-5" />
              <span>Save Config</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#020202] relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 transition-all duration-700">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none blur-[150px] transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at center, ${currentWidgetConfig.accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Dynamic Frame Container */}
        <div
          className={`relative transition-all duration-700 ease-in-out z-10 flex flex-col overflow-hidden ${
            previewMode === "desktop"
              ? "w-full max-w-[1000px] aspect-video bg-[#0c0c0c] rounded-2xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)]"
              : previewMode === "tablet"
                ? "w-full max-w-[500px] aspect-[3/4] bg-black rounded-[40px] border-[10px] border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                : "w-full max-w-[320px] aspect-[9/19.5] bg-black rounded-[50px] border-[10px] border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          }`}
        >
          {previewMode === "desktop" ? (
            /* Windows Desktop Frame Header */
            <div className="h-10 w-full bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  CCN Desktop Environment
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-0.5 bg-zinc-600" />
                <div className="w-3 h-3 border border-zinc-600" />
                <div className="w-3 h-3 text-zinc-600 flex items-center justify-center text-xs">
                  ✕
                </div>
              </div>
            </div>
          ) : (
            /* Mobile/Tablet Notch/Status Bar */
            <div className="h-10 w-full flex items-center justify-between px-8">
              <span className="text-[10px] font-black tracking-tight text-white/50">
                22:15
              </span>
              <div className="w-20 h-5 bg-zinc-900 rounded-b-2xl mx-auto" />
              <div className="flex items-center gap-2">
                <div className="text-[10px] opacity-50">📶</div>
                <div className="text-[10px] opacity-50">🔋</div>
              </div>
            </div>
          )}

          <div
            className={`flex-1 p-8 flex flex-col items-center relative transition-all duration-500 ${
              previewMode === "desktop"
                ? "bg-gradient-to-br from-[#0c0c0c] to-[#050505] justify-center"
                : "justify-start mt-4"
            }`}
          >
            {/* Windows Wallpaper Effect for Desktop Mode */}
            {previewMode === "desktop" && (
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#D4AF37]/20 to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />
              </div>
            )}

            <div
              className={`${previewMode === "desktop" ? "w-[480px]" : "w-full"} flex flex-center py-4 z-10 transition-all duration-500`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedWidgetId}-${previewMode}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="w-full"
                  style={{
                    boxShadow: currentWidgetConfig.shadowIntensity
                      ? `0 ${currentWidgetConfig.shadowIntensity / 4}px ${currentWidgetConfig.shadowIntensity}px rgba(0,0,0,${currentWidgetConfig.shadowIntensity / 100})`
                      : "none",
                  }}
                >
                  {selectedWidgetId.includes("bible") ||
                  selectedWidgetId.includes("custom") ? (
                    <DailyWordWidget
                      backgroundImage={currentWidgetConfig.backgroundImage}
                      verseText="„Albowiem tak Bóg umiłował świat, że Syna swego jednorodzonego dał, aby każdy, kto weń wierzy, nie zginął, ale miał żywot wieczny.”"
                      verseRef="Ew. Jana 3:16"
                      accentColor={currentWidgetConfig.accentColor}
                      borderRadius={currentWidgetConfig.borderRadius}
                      backgroundAlpha={currentWidgetConfig.backgroundAlpha}
                    />
                  ) : selectedWidgetId === "radio-control" ? (
                    <div
                      className="w-full aspect-[2/1] border flex flex-col p-6 space-y-4 shadow-2xl relative overflow-hidden"
                      style={{
                        borderRadius: `${currentWidgetConfig.borderRadius}px`,
                        backgroundColor: `rgba(10,10,10, ${currentWidgetConfig.backgroundAlpha! / 100})`,
                        borderColor: `rgba(255,255,255,${(currentWidgetConfig.borderWidth || 0) * 0.05})`,
                        borderWidth: `${currentWidgetConfig.borderWidth || 0}px`,
                        backdropFilter: `blur(${currentWidgetConfig.blurAmount || 0}px)`,
                        fontFamily: currentWidgetConfig.fontFamily,
                      }}
                    >
                      <div className="flex justify-between items-center z-10">
                        <span
                          className="text-[10px] font-black uppercase tracking-[0.3em]"
                          style={{ color: currentWidgetConfig.accentColor }}
                        >
                          CC Network Radio
                        </span>
                        <div className="flex gap-2 items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">
                            LIVE
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center z-10">
                        <span className="text-base font-black text-white tracking-widest">
                          Polskie Radio Christian Culture
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                          Global Broadcast Premium
                        </span>
                      </div>

                      <div className="w-full h-0.5 bg-white/5 rounded-full relative overflow-hidden mb-2">
                        <div
                          className="absolute inset-y-0 left-0 w-1/3 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                          style={{
                            backgroundColor: currentWidgetConfig.accentColor,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-center gap-10 z-10">
                        <div className="text-xl text-zinc-600 transition-transform active:scale-90">
                          🔈
                        </div>
                        <div
                          className="text-5xl transition-transform active:scale-95 cursor-pointer"
                          style={{ color: currentWidgetConfig.accentColor }}
                        >
                          ▶️
                        </div>
                        <div className="text-xl text-zinc-600 transition-transform active:scale-90">
                          📡
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-full aspect-[2/1] border flex flex-col p-6 space-y-4 shadow-2xl relative overflow-hidden"
                      style={{
                        borderRadius: `${currentWidgetConfig.borderRadius}px`,
                        backgroundColor: `rgba(10,10,10, ${currentWidgetConfig.backgroundAlpha! / 100})`,
                        borderColor: `rgba(255,255,255,${(currentWidgetConfig.borderWidth || 0) * 0.05})`,
                        borderWidth: `${currentWidgetConfig.borderWidth || 0}px`,
                        backdropFilter: `blur(${currentWidgetConfig.blurAmount || 0}px)`,
                        fontFamily: currentWidgetConfig.fontFamily,
                      }}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-2xl shadow-inner overflow-hidden">
                          <LucideImage className="w-6 h-6 text-zinc-700" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[8px] font-black tracking-[0.2em] mb-1 text-zinc-600 uppercase">
                            Now broadcasting
                          </div>
                          <div className="text-lg font-black text-white truncate leading-none uppercase tracking-tighter">
                            Szkoła Biblijna Lecja 01
                          </div>
                          <div className="text-[9px] text-[#D4AF37] font-bold mt-1 uppercase">
                            Nazir Mentor AI
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-end space-y-3">
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full w-2/3 shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-all duration-1000"
                            style={{
                              backgroundColor: currentWidgetConfig.accentColor,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-600 font-black tracking-widest uppercase">
                          <span>12:45</span>
                          <span>24:00</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-12 pt-2">
                        <SkipBack className="w-5 h-5 text-zinc-700 hover:text-white transition-colors" />
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-zinc-900 border border-white/5 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
                          <div
                            className="text-4xl"
                            style={{ color: currentWidgetConfig.accentColor }}
                          >
                            ⏸
                          </div>
                        </div>
                        <SkipForward className="w-5 h-5 text-zinc-700 hover:text-white transition-colors" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Windows Taskbar Mock up */}
            {previewMode === "desktop" && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-3xl border-t border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-lg">
                    ⊞
                  </div>
                  <div className="w-32 h-8 rounded-lg bg-white/5 flex items-center px-3">
                    <div className="w-3 h-3 text-zinc-600">🔍</div>
                    <div className="ml-2 text-[9px] text-zinc-600 uppercase font-black tracking-widest">
                      Search
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/50">
                  <div className="w-px h-6 bg-white/5 mx-2" />
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-[10px] font-black">22:15</span>
                    <span className="text-[8px] font-bold opacity-50">
                      26.04.2026
                    </span>
                  </div>
                </div>
              </div>
            )}

            {previewMode !== "desktop" && (
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 w-full px-6 pt-10 opacity-20 grayscale scale-95 origin-top">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-lg border border-white/5" />
                    <div className="w-10 h-1.5 bg-zinc-800 rounded-full" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {previewMode !== "desktop" && (
            <div className="h-16 w-full flex items-center justify-evenly px-6 border-t border-white/5">
              <div className="w-2 h-2 rotate-45 border-l-2 border-b-2 border-white/20" />
              <div className="w-12 h-1 bg-white/20 rounded-full" />
              <div className="w-3 h-3 border-2 border-white/20 rounded-sm" />
            </div>
          )}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-5 glass rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
              {previewMode === "desktop"
                ? "Windows Architect Mode"
                : "Live Architect Preview"}
            </span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex gap-4">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`transition-colors cursor-pointer ${previewMode === "desktop" ? "text-[#D4AF37]" : "text-zinc-500 hover:text-white"}`}
              title="Windows PC / Laptop"
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`transition-colors cursor-pointer ${previewMode === "mobile" ? "text-[#D4AF37]" : "text-zinc-500 hover:text-white"}`}
              title="Smartphone"
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPreviewMode("tablet")}
              className={`transition-colors cursor-pointer ${previewMode === "tablet" ? "text-[#D4AF37]" : "text-zinc-500 hover:text-white"}`}
              title="Tablet"
            >
              <Tablet className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetDashboard;
