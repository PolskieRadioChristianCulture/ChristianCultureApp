import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Browser } from "@capacitor/browser";
import {
  X,
  Layout,
  ExternalLink,
  Play,
  Globe,
  Calendar as CalendarIcon,
  MessageSquare,
} from "lucide-react";
import { Responsive } from "react-grid-layout";
import { EditableImage } from "./EditableImage";
import {
  ToastMessage,
  SupportedLanguage,
  ALL_CHANNELS_YOUTUBE_URL,
  POLSKIE_RADIO_CC_URL,
} from "../types";

const WidthProvider = (ComposedComponent: any) => {
  return (props: any) => {
    const [width, setWidth] = React.useState(1200);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
      const handleResize = () => {
        if (ref.current) {
          setWidth(ref.current.offsetWidth);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <div ref={ref} style={{ width: "100%" }}>
        <ComposedComponent {...props} width={width} />
      </div>
    );
  };
};

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ZbyszekGieronModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTvStudy: () => void;
  appLanguage: SupportedLanguage;
  addToast: (
    message: string,
    type?: ToastMessage["type"],
    action?: ToastMessage["action"],
  ) => string;
}

export const ZbyszekGieronModal: React.FC<ZbyszekGieronModalProps> = ({
  isOpen,
  onClose,
  onOpenTvStudy,
  appLanguage,
  addToast,
}) => {
  // Static content based on user's request
  const profile = {
    name: "Zbyszek Gieroń",
    description: `Zapraszamy Cię w niezwykłą podróż do świata mądrości i wiary. Poznaj Christian Culture: Opowiadania z morałem! 📖✨`,
    avatarUrl: "/ZbyszekGieronNajnowszy.webp",
    coverUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=400&fit=crop",
  };

  const widgets = [
    {
      id: "zbyszek-post",
      type: "post",
      content: `Zatrzymaj się na chwilę w zabieganym świecie i pozwól sobie na relaks, który buduje ducha. Nasza aplikacja to Twój mobilny, duchowy przewodnik, który pomoże Ci odnaleźć spokój i naładować baterie.
Co zyskasz, instalując naszą aplikację?

🌱 Codzienną porcję motywacji: Krótkie historie o wielkim znaczeniu.

🛤️ Przewodnik po wartościach: Poznasz chrześcijańskie wartości w przystępny sposób.

🕯️ Moment refleksji: Znajdziesz czas na przemyślenie swojej wiary i relacji z bliskimi.

🙌 Konkretny morał: Każda opowieść kończy się słowem z Pisma Świętego.

Wystarczy kilka minut dziennie, aby poczuć różnicę! Nie czekaj, pobierz już dziś i zacznij swoją drogę do pokoju i nadziei. To Twój czas na duchowe wzmocnienie! 💪❤️

Zaprasza Zbyszek Gieroń.`,
      positionIndex: 0,
      layout: { x: 0, y: 0, w: 4, h: 6 },
      metadata: {
        title: "Dlaczego warto?",
        fontSize: "base",
      },
    },
    {
      id: "zbyszek-youtube-embed",
      type: "embed",
      content: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/videoseries?si=ID3GBNqL8Fw9_ngi&amp;list=PLp5jujo7SUvF9bTAs3c9158_KvmdqeZOX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="border-radius: 12px;"></iframe>`,
      positionIndex: 1,
      layout: { x: 4, y: 0, w: 8, h: 6 },
      metadata: {
        title: "Jezus Wraca - YouTube",
      },
    },
    {
      id: "zbyszek-link",
      type: "link",
      content: "https://justpaste.it/l0wa8",
      positionIndex: 2,
      layout: { x: 0, y: 6, w: 12, h: 3 },
      metadata: {
        title: "Opowiadania z morałem",
        color: "#C5A059",
      },
    },
  ];

  const gridLayouts = useMemo(
    () => ({
      lg: widgets.map((w) => ({
        i: w.id,
        x: w.layout.x,
        y: w.layout.y,
        w: w.layout.w,
        h: w.layout.h,
      })),
    }),
    [],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1601] flex items-center justify-center p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/100 backdrop-blur-[15px] cursor-pointer"
        onClick={onClose}
      />

      <div className="z-10 w-full h-full bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden animate-fade-in">
        {/* Navigation / Actions Layer */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            aria-label="Odtwarzaj"
            onClick={() => {
              onClose();
              onOpenTvStudy();
            }}
            className="p-2 sm:px-4 sm:py-2 text-white bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2 shadow-xl"
          >
            <Play size={14} />{" "}
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest">
              CC TV
            </span>
          </button>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors border border-white/20 shadow-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] pb-32">
          {/* Cover Photo */}
          <div className="relative w-full h-48 sm:h-72 bg-zinc-900 overflow-hidden group">
            <EditableImage
              storageKey="zbyszek_cover"
              defaultSrc={profile.coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>

          {/* Avatar & Profile Info */}
          <div className="relative px-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pb-6 border-b border-white/5 -mt-16 sm:-mt-20 z-10 block">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-zinc-950 bg-zinc-900 overflow-hidden shadow-2xl flex-shrink-0 group">
              <EditableImage
                storageKey="zbyszek_avatar"
                defaultSrc="/ZbyszekGieronNajnowszy.jpg"
                alt="Avatar"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 w-full">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-zinc-400 text-sm mt-1 mb-2 whitespace-pre-wrap max-w-xl leading-snug">
                  {profile.description}
                </p>
              </div>

              {/* Follow / Edit Button */}
              <div className="flex items-center gap-2 flex-shrink-0 mb-2">
                <a
                  href="mailto:zbyszek.gieron@gmail.com"
                  className="p-2 sm:px-4 sm:py-2 bg-[#C5A059] hover:bg-[#E2B859] text-black rounded-lg font-bold tracking-wide transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-xl"
                >
                  <MessageSquare size={16} />{" "}
                  <span className="hidden sm:inline">
                    {appLanguage === "pl" ? "Napisz wiadomość" : "Send Message"}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 sm:space-y-8 mt-2">
            {/* Official Resources Section */}
            <div className="space-y-4">
              <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest px-1">
                Oficjalne Zasoby Misji
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://youtube.com/@zbyszek.gieron__jezus-wraca?si=epk0ogy6E2j_3jTe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-4 transition-all hover:bg-[#C5A059]/20 group"
                >
                  <div className="w-12 h-12 bg-[#FF0000]/10 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-[#FF0000]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-[#C5A059] font-black uppercase tracking-widest text-sm">
                      Kanał YouTube
                    </h4>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                      Jezus Wraca
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-[#C5A059] transition-colors" />
                </a>

                <a
                  href="https://www.facebook.com/share/1DMmshEAHu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-2xl p-4 transition-all hover:bg-[#1877F2]/20 group"
                >
                  <div className="w-12 h-12 bg-[#1877F2]/10 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-[#1877F2]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-[#1877F2] font-black uppercase tracking-widest text-sm">
                      Profil na FB
                    </h4>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                      Zbyszek Gieroń
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-[#1877F2] transition-colors" />
                </a>

                <a
                  href="https://drive.google.com/file/d/1gxrZFQHNnbQR6r0sBta42u-AiQQvdaQM/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-[#C5A059]/10 border border-[#C5A059]/40 rounded-2xl p-4 transition-all hover:bg-[#C5A059]/20 group md:col-span-2"
                >
                  <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-[#C5A059] font-black uppercase tracking-widest text-sm">
                      Cykl Codziennych Rozważań
                    </h4>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                      Otwórz dokument PDF
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-[#C5A059] transition-colors" />
                </a>
              </div>
            </div>

            {/* Dashboard Widgets */}
            <div className="relative">
              <h3 className="text-[#C5A059] text-xs font-black uppercase tracking-widest mb-4 flex justify-between items-center bg-black/40 p-4 rounded-t-2xl border-x border-t border-[#C5A059]/20">
                <span className="flex items-center gap-2">
                  <Layout size={14} /> Identity Dashboard
                </span>
              </h3>

              <div className="bg-black/20 border-x border-b border-[#C5A059]/10 rounded-b-2xl min-h-[200px]">
                <ResponsiveGridLayout
                  className="layout"
                  layouts={gridLayouts}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                  rowHeight={30}
                  isDraggable={false}
                  isResizable={false}
                  margin={[10, 10]}
                >
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`group relative ${widget.type === "link" ? "bg-[#C5A059]/10 border-[#C5A059]/30 hover:bg-[#C5A059]/20 shadow-[0_0_15px_rgba(197,160,89,0.2)]" : "bg-zinc-900/80 border-white/5"} border rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl transition-all hover:scale-[1.02] hover:border-[#C5A059]/50`}
                    >
                      {/* Content Renderer */}
                      <div className="w-full h-full p-4 flex flex-col justify-center items-center text-center overflow-auto scrollbar-hide">
                        {widget.type === "link" && (
                          <a
                            href={widget.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 group/link w-full h-full justify-center"
                          >
                            <ExternalLink className="text-[#C5A059] mb-2 w-8 h-8 group-hover/link:scale-110 transition-transform" />
                            <span className="text-[#C5A059] font-black uppercase tracking-widest text-xl sm:text-3xl group-hover/link:text-white transition-colors block truncate w-full px-2">
                              {widget.metadata?.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate w-full italic">
                              {widget.content}
                            </span>
                          </a>
                        )}
                        {widget.type === "post" && (
                          <div className="w-full h-full text-left overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 p-2">
                            <h4 className="text-[#C5A059] text-[10px] font-black uppercase tracking-tighter mb-2">
                              {widget.metadata?.title || "Wiadomość z misji"}
                            </h4>
                            <div
                              className={`text-zinc-300 leading-relaxed max-w-full ${
                                (widget as any).metadata?.fontSize === "sm"
                                  ? "text-sm"
                                  : (widget as any).metadata?.fontSize ===
                                      "base"
                                    ? "text-base leading-relaxed"
                                    : (widget as any).metadata?.fontSize ===
                                        "xl"
                                      ? "text-xl font-medium leading-tight"
                                      : "text-xs"
                              }`}
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {widget.content}
                            </div>
                          </div>
                        )}
                        {widget.type === "embed" && (
                          <div
                            className="w-full h-full flex items-center justify-center pointer-events-auto overflow-hidden rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: widget.content }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </ResponsiveGridLayout>
              </div>
            </div>

            <div className="mt-8 pb-8 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-zinc-900 border border-white/10 hover:border-[#C5A059]/30 text-zinc-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-800"
              >
                Zamknij profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
