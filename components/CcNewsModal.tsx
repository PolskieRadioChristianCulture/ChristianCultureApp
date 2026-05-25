import React from "react";
import { X, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { useAppStore } from "../useAppStore";

interface CcNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTickerExpanded?: boolean;
}

export const CcNewsModal: React.FC<CcNewsModalProps> = ({
  isOpen,
  onClose,
  isTickerExpanded = false,
}) => {
  const dynamicDB = useAppStore((state) => state.dynamicDB);
  const newsText = dynamicDB["Nowości CC"] || "";

  if (!isOpen) return null;

  // Split lines to identify title and sections
  let lines: string[] = [];
  if (typeof newsText === "string") {
    lines = newsText.split("\n").filter((l) => l.trim() !== "");
  } else if (Array.isArray(newsText)) {
    lines = [
      "✨ CC OS Nowości",
      ...(newsText as any[]).map((item) => `- ${item.title}: ${item.content}`),
    ];
  }

  const title = lines[0] || "Nowości Christian Culture";
  const content = lines.slice(1);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[6500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
        {/* Header Header */}
        <div className="relative px-8 pt-10 pb-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="absolute top-8 right-8 p-2.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all active:scale-95 border border-white/10"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
              GLOBALNA MISJA
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Aktualności • CCN
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-medium text-white leading-tight uppercase tracking-tighter">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-hide space-y-6">
          {content.map((line, idx) => {
            // Very basic Markdown-like detection
            const isHeading =
              line.includes(":") && line.length < 50 && idx < 10;
            const isAddress =
              line.includes("ul. Pomorska") || line.includes("Starogard");
            const isContact =
              line.includes("Zapisy") || line.includes("E-mail");

            if (isAddress) {
              return (
                <div
                  key={idx}
                  className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl items-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                      Lokalizacja
                    </p>
                    <p className="text-sm font-normal text-white leading-tight">
                      {line.replace("📍 Znajdziesz nas: ", "")}
                    </p>
                  </div>
                </div>
              );
            }

            if (isContact) {
              const isEmail = line.toLowerCase().includes("e-mail");
              return (
                <div
                  key={idx}
                  className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl items-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    {isEmail ? <Mail size={22} /> : <Phone size={22} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                      {isEmail ? "Email Kontaktowy" : "Kontakt / Rezerwacje"}
                    </p>
                    <p className="text-sm font-normal text-white leading-tight">
                      {line
                        .replace("📞 Zapisy i pytania: ", "")
                        .replace("📧 E-mail: ", "")}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <p
                key={idx}
                className={`text-zinc-400 leading-relaxed text-sm sm:text-base ${isHeading ? "text-white font-medium uppercase tracking-tight text-lg mt-8 mb-2" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      '<span class="text-white">$1</span>',
                    )
                    .replace(
                      /\[(.*?)\]\((.*?)\)/g,
                      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#C5A059] underline hover:text-white transition-colors">$1</a>',
                    ),
                }}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/5 bg-black/40 flex flex-col gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 m-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Aktywne teraz
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full py-4 bg-[#C5A059] text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#C5A059]/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
          >
            ZAMKNIJ OKNO
          </button>
        </div>
      </div>
    </div>
  );
};
