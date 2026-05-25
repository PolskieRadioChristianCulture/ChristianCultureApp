import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Palette,
  ShoppingBag,
  PenTool,
  Sparkles,
  Trash2,
  Download,
  Share2,
  Shirt,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Info,
  InfoIcon,
  Maximize2,
  Move,
  Type,
  Image as ImageIcon,
  Box,
  RotateCcw,
  Search,
  Check,
  ShieldCheck,
  Zap,
  HelpCircle,
  X,
  Languages,
  Menu,
} from "lucide-react";
import { useAppStore } from "../useAppStore";

interface ImaginationStudioProps {
  onBack: () => void;
  uiLang?: "pl" | "en";
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  colors: string[];
  weights?: string[];
  fits?: string[];
}

const CATEGORIES = [
  { id: "clothing", label: "Odzież", en: "Clothing", icon: Shirt },
  { id: "headwear", label: "Nakrycia głowy", en: "Headwear", icon: Monitor },
  {
    id: "accessories",
    label: "Akcesoria",
    en: "Accessories",
    icon: ShoppingBag,
  },
];

const PRODUCTS: Product[] = [
  {
    id: "tshirt-premium",
    name: "T-Shirt Premium Cotton",
    category: "clothing",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
    colors: ["#000000", "#FFFFFF", "#450a0a", "#1e1b4b"], // Black, White, Burgundy, Deep Blue
    weights: ["180g", "220g (Heavy)"],
    fits: ["Regular", "Oversize"],
  },
  {
    id: "hoodie-lux",
    name: "Hoodie Christian Heritage",
    category: "clothing",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2187&auto=format&fit=crop",
    colors: ["#000000", "#1a1a1a", "#450a0a"],
    weights: ["340g"],
    fits: ["Oversize"],
  },
  {
    id: "cap-signature",
    name: "Cap Alpha & Omega",
    category: "headwear",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=2072&auto=format&fit=crop",
    colors: ["#000000", "#D4AF37"],
  },
  {
    id: "mug-sacrum",
    name: "Mug Ceramic White Gold",
    category: "accessories",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop",
    colors: ["#FFFFFF", "#000000"],
  },
];

const FONTS = [
  { id: "lora", name: "Lora (Biblical)", family: '"Lora", serif' },
  { id: "cinzel", name: "Cinzel (Classical)", family: '"Cinzel", serif' },
  { id: "inter", name: "Inter (Modern)", family: '"Inter", sans-serif' },
  {
    id: "playfair",
    name: "Playfair (Elegant)",
    family: '"Playfair Display", serif',
  },
  { id: "bodoni", name: "Bodoni (Editorial)", family: '"Bodoni Moda", serif' },
];

const VERSES = [
  {
    text: "אֶהְיֶה אֲשֶׁר אֶהְיֶה",
    lang: "Hebrew",
    meaning: "Jestem, który Jestem",
  },
  {
    text: "Ἐν ἀρχῇ ἦν ὁ Λόγος",
    lang: "Greek",
    meaning: "Na początku było Słowo",
  },
  { text: "YHWH", lang: "Hebrew", meaning: "Imię Boże" },
  { text: "Α Ω", lang: "Greek", meaning: "Alpha & Omega" },
];

const SYMBOLS = [
  { id: "ichthys", name: "ICHTHYS", icon: "🐟" },
  { id: "chirho", name: "Chi Rho", icon: "☧" },
  { id: "cross", name: "Cross", icon: "✝" },
  { id: "dove", name: "Dove", icon: "🕊️" },
];

const ImaginationStudio: React.FC<ImaginationStudioProps> = ({
  onBack,
  uiLang = "pl",
}) => {
  const [activeCategory, setActiveCategory] = useState("clothing");
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]);
  const [selectedWeight, setSelectedWeight] = useState(
    selectedProduct.weights?.[0] || "",
  );
  const [selectedFit, setSelectedFit] = useState(
    selectedProduct.fits?.[0] || "",
  );

  const [canvasItems, setCanvasItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [leftSidebarView, setLeftSidebarView] = useState<
    "tools" | "products" | "library"
  >("tools");

  const [rotation, setRotation] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const t = (pl: string, en: string) => (uiLang === "pl" ? pl : en);

  const addText = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      content: t("Wpisz tekst...", "Enter text..."),
      font: FONTS[0].family,
      fontSize: 24,
      color: "#D4AF37",
      x: 50,
      y: 50,
      rotation: 0,
    };
    setCanvasItems([...canvasItems, newItem]);
    setSelectedId(newItem.id);
  };

  const addSymbol = (symbol: any) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: "symbol",
      content: symbol.icon,
      fontSize: 48,
      color: "#D4AF37",
      x: 50,
      y: 50,
      rotation: 0,
    };
    setCanvasItems([...canvasItems, newItem]);
    setSelectedId(newItem.id);
  };

  const removeItem = (id: string) => {
    setCanvasItems(canvasItems.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateItem = (id: string, updates: any) => {
    setCanvasItems(
      canvasItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const selectedItem = canvasItems.find((item) => item.id === selectedId);

  return (
    <div className="fixed inset-0 z-[9000] bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* HEADER */}
      <header className="h-20 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-500 hover:text-[#D4AF37] transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">
              {t("Powrót", "Back")}
            </span>
          </button>

          <div className="w-px h-8 bg-white/5 mx-2" />

          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#D4AF37] leading-none">
              Your Imagination Studio
            </h1>
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-1">
              Christian Culture Heritage
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-8 px-8 py-2 rounded-full border border-white/5 bg-zinc-900/50">
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-zinc-500 uppercase font-black">
                {t("DPI Check", "DPI Check")}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-white">
                  300 DPI
                </span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-zinc-500 uppercase font-black">
                {t("Review", "Review")}
              </span>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase">
                {t("Zatwierdzony", "Approved")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Przycisk"
              className="w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all relative"
            >
              <ShoppingCart className="w-5 h-5 text-zinc-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="text-[8px] font-black text-black">1</span>
              </div>
            </button>
            <button
              aria-label="Zamknij"
              onClick={onBack}
              className="w-11 h-11 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - TOOLS & ASSETS */}
        <aside className="w-20 md:w-80 h-full border-r border-white/5 bg-[#050505] flex overflow-hidden">
          {/* Internal Narrow Nav */}
          <div className="w-20 h-full border-r border-white/5 flex flex-col items-center py-8 gap-8">
            {[
              { id: "products", icon: Box, label: t("Baza", "Base") },
              { id: "tools", icon: PenTool, label: t("Narzędzia", "Tools") },
              { id: "library", icon: Sparkles, label: t("Zasoby", "Assets") },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setLeftSidebarView(nav.id as any)}
                className={`group flex flex-col items-center gap-2 relative transition-all ${
                  leftSidebarView === nav.id
                    ? "text-[#D4AF37]"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <nav.icon className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                  {nav.label}
                </span>
                {leftSidebarView === nav.id && (
                  <div className="absolute -right-[11px] w-0.5 h-full bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]" />
                )}
              </button>
            ))}
          </div>

          {/* Detailed View */}
          <div className="flex-1 overflow-y-auto p-6 hidden md:block">
            {leftSidebarView === "products" && (
              <div className="space-y-8 animate-slide-up">
                <section className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("Kategoria", "Category")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          activeCategory === cat.id
                            ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                            : "bg-black border-white/5 text-zinc-500"
                        }`}
                      >
                        {uiLang === "pl" ? cat.label : cat.en}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("Wybierz Produkt", "Select Product")}
                  </label>
                  <div className="space-y-3">
                    {PRODUCTS.filter((p) => p.category === activeCategory).map(
                      (product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedColor(product.colors[0]);
                            setSelectedWeight(product.weights?.[0] || "");
                            setSelectedFit(product.fits?.[0] || "");
                          }}
                          className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                            selectedProduct.id === product.id
                              ? "bg-zinc-900 border-[#D4AF37] shadow-xl"
                              : "bg-black border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-black uppercase tracking-tight leading-tight">
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              {product.price} PLN
                            </p>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                </section>
              </div>
            )}

            {leftSidebarView === "tools" && (
              <div className="space-y-8 animate-slide-up">
                <section className="space-y-3">
                  <h3 className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("Dodaj Elementy", "Add Elements")}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={addText}
                      className="p-4 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all flex flex-col items-center gap-2 group"
                    >
                      <Type className="w-5 h-5 text-zinc-400 group-hover:text-[#D4AF37]" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {t("Tekst", "Text")}
                      </span>
                    </button>
                    <button
                      aria-label="Kreator Wersetu"
                      className="p-4 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all flex flex-col items-center gap-2 group"
                    >
                      <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-[#D4AF37]" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {t("Grafika", "Image")}
                      </span>
                    </button>
                  </div>
                </section>

                {selectedItem && (
                  <section className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                        {t("Właściwości", "Properties")}
                      </h3>
                      <button
                        aria-label="Usuń"
                        onClick={() => removeItem(selectedId!)}
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {selectedItem.type === "text" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-600 uppercase font-bold">
                            {t("Tekst", "Content")}
                          </label>
                          <input
                            type="text"
                            value={selectedItem.content}
                            onChange={(e) =>
                              updateItem(selectedId!, {
                                content: e.target.value,
                              })
                            }
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-600 uppercase font-bold">
                            {t("Typografia", "Typography")}
                          </label>
                          <div className="grid grid-cols-1 gap-2">
                            {FONTS.map((font) => (
                              <button
                                key={font.id}
                                onClick={() =>
                                  updateItem(selectedId!, { font: font.family })
                                }
                                className={`p-2 rounded border text-left transition-all ${
                                  selectedItem.font === font.family
                                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                                    : "border-white/5 bg-black"
                                }`}
                                style={{ fontFamily: font.family }}
                              >
                                {font.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-bold">
                          <span>{t("Rozmiar", "Size")}</span>
                          <span>{selectedItem.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={selectedItem.fontSize}
                          onChange={(e) =>
                            updateItem(selectedId!, {
                              fontSize: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full accent-[#D4AF37]"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-bold">
                          <span>{t("Obrót", "Rotation")}</span>
                          <span>{selectedItem.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={selectedItem.rotation}
                          onChange={(e) =>
                            updateItem(selectedId!, {
                              rotation: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full accent-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}

            {leftSidebarView === "library" && (
              <div className="space-y-8 animate-slide-up">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                      {t("Słowo Boże", "God's Word")}
                    </label>
                    <Languages className="w-3 h-3 text-zinc-400" />
                  </div>
                  <div className="space-y-3">
                    {VERSES.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const newItem = {
                            id: Math.random().toString(36).substr(2, 9),
                            type: "text",
                            content: v.text,
                            font:
                              i % 2 === 0 ? FONTS[0].family : FONTS[1].family,
                            fontSize: 24,
                            color: "#D4AF37",
                            x: 50,
                            y: 50,
                            rotation: 0,
                          };
                          setCanvasItems([...canvasItems, newItem]);
                          setSelectedId(newItem.id);
                        }}
                        className="w-full p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all text-left group"
                      >
                        <p className="text-lg font-serif text-white group-hover:text-[#D4AF37] transition-colors">
                          {v.text}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[8px] text-zinc-500 uppercase font-black">
                            {v.lang}
                          </span>
                          <span className="text-[10px] text-zinc-400 italic">
                            "{v.meaning}"
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("Symbole Sacrum", "Holy Symbols")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {SYMBOLS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => addSymbol(s)}
                        className="aspect-square rounded-2xl bg-zinc-900 border border-white/5 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <span className="text-3xl filter drop-shadow-xl text-zinc-400 group-hover:text-[#D4AF37] transition-all">
                          {s.icon}
                        </span>
                        <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                          {s.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </aside>

        {/* CENTRAL CANVAS - THE WORKSPACE */}
        <main className="flex-1 bg-[#020202] relative flex flex-col items-center justify-center overflow-hidden">
          {/* Background Atmosphere */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#D4AF37]/5 blur-[200px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-5" />
          </div>

          {/* Workspace Labels */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 flex justify-between items-center z-10">
            <div className="flex items-center gap-2 text-zinc-600">
              <Move className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                {t("Pole nadruku: 30x40cm", "Print area: 30x40cm")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className={`p-2 rounded-full border transition-all ${isZoomed ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "border-white/10 text-zinc-500 hover:text-white"}`}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIs3DMode(!is3DMode)}
                className={`p-2 rounded-full border transition-all ${is3DMode ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "border-white/10 text-zinc-500 hover:text-white"}`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* THE PRODUCT MOCKUP */}
          <div
            className={`relative transition-all duration-1000 ease-out ${isZoomed ? "scale-125" : "scale-100"}`}
            style={{
              transform: `perspective(1000px) rotateY(${rotation}deg)`,
              transition: is3DMode
                ? "none"
                : "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
            }}
            onMouseDown={(e) => {
              if (!is3DMode) return;
              const startX = e.clientX;
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX;
                setRotation(rotation + deltaX * 0.5);
              };
              const handleMouseUp = () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
              };
              window.addEventListener("mousemove", handleMouseMove);
              window.addEventListener("mouseup", handleMouseUp);
            }}
          >
            {/* Product Visual */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter brightness-90"
                style={{
                  filter:
                    selectedColor === "#FFFFFF"
                      ? "invert(1) brightness(0.9) contrast(1.1)"
                      : "none",
                }}
              />

              {/* PRINT AREA CANVAS */}
              <div className="absolute inset-0 flex items-center justify-center p-[20%] pointer-events-none">
                <div className="w-full h-full border border-white/10 border-dashed rounded-lg relative flex items-center justify-center">
                  {canvasItems.map((item) => (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setSelectedId(item.id);
                      }}
                      className={`absolute cursor-move pointer-events-auto select-none ${selectedId === item.id ? "outline outline-2 outline-[#D4AF37] outline-offset-4 ring-4 ring-black/50" : ""}`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                        fontSize: `${item.fontSize}px`,
                        fontFamily: item.font,
                        color: item.color,
                      }}
                    >
                      {item.content}
                      {selectedId === item.id && (
                        <div
                          className="absolute -top-6 -right-6 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shadow Base */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-10 bg-black/60 blur-[40px] rounded-full" />
          </div>

          {/* FOOTER ACTION BAR */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 flex justify-between items-center">
            <div className="flex items-center gap-4 glass p-4 rounded-3xl border border-white/5">
              <div className="flex items-center -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-black italic text-[#D4AF37] overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-black bg-[#D4AF37] flex items-center justify-center text-[10px] font-black italic text-black z-10">
                  +2.4k
                </div>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                {t("Pasjonatów projektuje", "Enthusiasts designing")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                aria-label="Pobierz"
                className="h-14 px-8 rounded-2xl glass border border-white/10 flex items-center gap-3 text-zinc-400 hover:text-white transition-all group active:scale-95"
              >
                <Download className="w-5 h-5 group-hover:translate-y-[2px] transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {t("Zapisz Projekt", "Save")}
                </span>
              </button>
              <button className="h-14 px-10 rounded-2xl bg-[#D4AF37] text-black shadow-[0_10px_40px_rgba(212,175,55,0.3)] flex items-center gap-4 hover:translate-y-[-4px] active:translate-y-0 transition-all">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-[0.2em]">
                  {t("Dodaj do Koszyka", "Add to Cart")}
                </span>
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR - CONFIGURATION & JOSHUA'S ADVISOR */}
        <aside className="w-80 h-full border-l border-white/5 bg-[#050505] flex flex-col pt-8">
          <div className="px-6 flex-1 overflow-y-auto space-y-10 pb-20">
            {/* Product Config Section */}
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter text-[#D4AF37]">
                  {t("Konfiguracja", "Configuration")}
                </h2>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  {selectedProduct.name}
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                  {t("Kolor Podstawowy", "Primary Color")}
                </label>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${
                        selectedColor === color
                          ? "border-[#D4AF37] scale-110 shadow-lg shadow-[#D4AF37]/20"
                          : "border-white/5"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {selectedProduct.weights && (
                <div className="space-y-4">
                  <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("Gramatura / Materiał", "Fabric / Weight")}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedProduct.weights.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setSelectedWeight(weight)}
                        className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between ${
                          selectedWeight === weight
                            ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                            : "bg-black border-white/5 text-zinc-500"
                        }`}
                      >
                        {weight}
                        {selectedWeight === weight && (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.fits && (
                <div className="space-y-4">
                  <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("Krój / Sylwetka", "Fit / Silhouette")}
                  </label>
                  <div className="flex gap-2">
                    {selectedProduct.fits.map((fit) => (
                      <button
                        key={fit}
                        onClick={() => setSelectedFit(fit)}
                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedFit === fit
                            ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                            : "bg-black border-white/5 text-zinc-500"
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Joshua's Approval Engine */}
            <section className="bg-zinc-900/50 rounded-3xl border border-[#D4AF37]/20 p-6 space-y-4 relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-all" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    Joshua's Approval
                  </h3>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase">
                    {t("System Doradczy Premium", "Premium Advisor System")}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-400 italic leading-relaxed">
                  {t(
                    '"Szlachetna czerń wymaga złotych akcentów. Wybrany font Lora doskonale podkreśli autorytet wersetu."',
                    '"Noble black requires gold accents. The selected Lora font will perfectly emphasize the authority of the verse."',
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 px-1">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                <span className="text-[8px] font-black uppercase text-green-500 tracking-tighter">
                  {t(
                    "Status: Optymalny Estetycznie",
                    "Status: Aesthetically Optimal",
                  )}
                </span>
              </div>
            </section>

            {/* Price Summary */}
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase font-black">
                  {t("Cena Projektu", "Project Price")}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black text-[#D4AF37]">
                    {selectedProduct.price} PLN
                  </span>
                  <span className="text-[8px] text-zinc-600 font-bold uppercase">
                    {t(
                      "Wliczając certyfikat autentyczności",
                      "Includes certificate of authenticity",
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="p-6 border-t border-white/5 bg-black">
            <div className="flex items-center justify-center gap-3 opacity-30 grayscale">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Sacrum Quality
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ImaginationStudio;
