import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WidgetType, WidgetMetadata, fixOrphans } from "../../types";
import {
  X,
  Plus,
  Link as LinkIcon,
  Share2,
  Youtube,
  BookOpen,
  MessageCircle,
} from "lucide-react";

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: WidgetType, content: string, metadata: WidgetMetadata) => void;
  isTickerExpanded?: boolean;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isTickerExpanded = false,
}) => {
  const [selectedType, setSelectedType] = useState<WidgetType | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const widgetTypes = [
    {
      type: "link" as const,
      label: "Link zewnętrzny",
      icon: LinkIcon,
      description: "Własna strona, sklep, blog",
    },
    {
      type: "social" as const,
      label: "Social Media",
      icon: Share2,
      description: "Profile społecznościowe",
    },
    {
      type: "multimedia" as const,
      label: "Multimedia",
      icon: Youtube,
      description: "YouTube, Spotify, SoundCloud",
    },
    {
      type: "spiritual" as const,
      label: "Duchowość",
      icon: BookOpen,
      description: "Werset, intencja modlitewna",
    },
    {
      type: "communication" as const,
      label: "Komunikacja",
      icon: MessageCircle,
      description: "Link do czatu lub grupy",
    },
  ];

  const handleAdd = () => {
    if (!selectedType) return;

    let metadata: WidgetMetadata = { title, url };
    let finalContent = content;

    if (selectedType === "multimedia") {
      // Auto-detect YouTube video ID
      const ytMatch = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      );
      if (ytMatch) {
        metadata.subType = "youtube";
        metadata.videoId = ytMatch[1];
      }
    }

    if (selectedType === "social") {
      if (url.includes("youtube.com")) metadata.subType = "youtube";
      else if (url.includes("facebook.com")) metadata.subType = "facebook";
      else if (url.includes("instagram.com")) metadata.subType = "instagram";
    }

    onAdd(selectedType, finalContent, metadata);
    reset();
    onClose();
  };

  const reset = () => {
    setSelectedType(null);
    setUrl("");
    setTitle("");
    setContent("");
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[7000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-4xl flex flex-col overflow-hidden max-h-[80vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">
            Magazyn Widgetów
          </h3>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {!selectedType ? (
            <div className="grid grid-cols-1 gap-3">
              {widgetTypes.map((item) => (
                <button
                  key={item.type}
                  aria-label={item.label}
                  onClick={() => setSelectedType(item.type)}
                  className="flex items-center gap-4 p-5 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-[#E2B859]/30 rounded-2xl transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-[#E2B859] transition-colors">
                    <item.icon aria-hidden="true" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <button
                onClick={() => setSelectedType(null)}
                aria-label="Wróć do listy widgetów"
                className="text-[10px] font-black text-[#E2B859] uppercase tracking-widest hover:underline mb-4"
              >
                ← Wróć do listy
              </button>

              <div className="space-y-4">
                {(selectedType === "link" ||
                  selectedType === "social" ||
                  selectedType === "multimedia" ||
                  selectedType === "communication") && (
                  <div className="space-y-2">
                    <label
                      htmlFor="widget-url"
                      className="text-[10px] font-black text-zinc-500 uppercase tracking-widest"
                    >
                      Link (URL)
                    </label>
                    <input
                      id="widget-url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#E2B859]/50 transition-all font-mono"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="widget-title"
                    className="text-[10px] font-black text-zinc-500 uppercase tracking-widest"
                  >
                    Tytuł / Nazwa
                  </label>
                  <input
                    id="widget-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Wpisz nazwę widgetu..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#E2B859]/50 transition-all"
                  />
                </div>

                {selectedType === "spiritual" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="widget-content"
                      className="text-[10px] font-black text-zinc-500 uppercase tracking-widest"
                    >
                      Treść (Werset / Intencja)
                    </label>
                    <textarea
                      id="widget-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Co chcesz przekazać światu?"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#E2B859]/50 transition-all resize-none"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleAdd}
                aria-label="Dodaj widget"
                className="w-full py-5 bg-[#E2B859] text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all mt-6"
              >
                DODAJ WIDGET
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
