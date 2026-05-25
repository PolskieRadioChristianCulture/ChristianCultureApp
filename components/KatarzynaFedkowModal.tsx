import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Youtube,
  Heart,
  Share2,
  ExternalLink,
  Play,
  MessageSquare,
  GraduationCap,
  Star,
  Bell,
  User,
  Instagram,
  Facebook,
  Globe,
  ShieldCheck,
  Layout,
  Plus,
  Check,
} from "lucide-react";
import { SupportedLanguage } from "../types";
import { nativeService } from "../services/nativeService";
import { ImpactStyle } from "@capacitor/haptics";
import { EditableImage } from "./EditableImage";

interface KatarzynaFedkowModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
}

export function KatarzynaFedkowModal({
  isOpen,
  onClose,
  appLanguage,
}: KatarzynaFedkowModalProps) {
  if (!isOpen) return null;

  const handleExternalLink = (url: string) => {
    nativeService.hapticImpact(ImpactStyle.Light);
    window.open(url, "_blank");
  };

  const widgets = [
    {
      id: "yt-main",
      type: "link",
      content: "https://youtube.com/@ccwomen7?si=ofGJmJqcQKuXUf20",
      title: "YouTube - CC Women",
      subtitle: "Subskrybuj kanał Katarzyny",
      icon: <Youtube className="w-6 h-6" />,
      color: "bg-red-600",
    },
    {
      id: "fb-women",
      type: "link",
      content: "https://www.facebook.com/ChristianCultureNetwork",
      title: "Facebook",
      subtitle: "Społeczność CC",
      icon: <Facebook className="w-6 h-6" />,
      color: "bg-blue-600",
    },
  ];

  const playlists = [
    { id: "PLcWRjZtKUlTcxyTIEE7yMfVfz1gvvRAig", title: "Serce Kobiety" },
    { id: "PLcWRjZtKUlTduVymQJdFCjgbyroIu5C12", title: "Inspiracje CC Women" },
    { id: "PLcWRjZtKUlTfbbMIbz-vPzkXoUpGLib63", title: "Spotkania z Bogiem" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl"
      >
        <button
          aria-label="Zamknij"
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-[#C5A059] hover:text-black transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-5xl h-full max-h-[90vh] overflow-hidden rounded-[2.5rem] border border-[#C5A059]/30 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row shadow-2xl shadow-[#C5A059]/10">
          {/* Lewa kolumna: Profil */}
          <div className="w-full md:w-1/3 bg-gradient-to-b from-[#C5A059]/10 to-transparent p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-[#C5A059]/20 overflow-y-auto">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-[#C5A059]/20 rounded-[3rem] blur-2xl"></div>
              <EditableImage
                storageKey="katarzyna_avatar"
                defaultSrc="/Katarzyna Fedków.webp"
                alt="Katarzyna Fedków"
                className="w-48 h-48 rounded-[2.5rem] border-4 border-[#C5A059] object-cover shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] p-2 rounded-full border border-[#C5A059] z-20">
                <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-white text-center tracking-tight mb-2">
              Katarzyna Fedków
            </h1>
            <p className="text-[#C5A059] font-bold uppercase tracking-widest text-xs mb-6 px-4 py-1.5 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/20">
              Ambasadorka CC Women
            </p>

            <div className="w-full space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-zinc-400 text-sm italic leading-relaxed text-center">
                  "Służę Bogu poprzez wsparcie kobiet w odkrywaniu ich
                  tożsamości w Chrystusie. CC Women to przestrzeń pełna miłości
                  i prawdy."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {widgets.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleExternalLink(w.content)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 transition-all group"
                  >
                    <div className="text-zinc-400 group-hover:text-[#C5A059] mb-2">
                      {w.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500 group-hover:text-white">
                      {w.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                handleExternalLink("mailto:ccwomen@polskieradio.cc")
              }
              className="mt-8 w-full py-4 bg-[#C5A059] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#E2B859] transition-all shadow-lg shadow-[#C5A059]/20"
            >
              Napisz Wiadomość
            </button>
          </div>

          {/* Prawa kolumna: Content */}
          <div className="flex-1 p-8 overflow-y-auto bg-black custom-scrollbar">
            <h2 className="text-[#C5A059] font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Layout className="w-4 h-4" /> Multimedialna Biblioteka CC Women
            </h2>

            <div className="space-y-8">
              {playlists.map((playlist, idx) => (
                <div key={playlist.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#C5A059] text-black flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      {playlist.title}
                    </h3>
                  </div>
                  <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/videoseries?list=${playlist.id}`}
                      title={`Playlista: ${playlist.title}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5">
              <h3 className="text-[#C5A059] font-black uppercase tracking-widest text-xs mb-4">
                O Misji CC Women
              </h3>
              <p className="text-zinc-400 leading-relaxed font-lora">
                CC Women to integralna część projektu Christian Culture Network.
                Naszym celem jest budowanie profesjonalnej platformy
                multimedialnej dla globalnej społeczności chrześcijańskiej, ze
                szczególnym uwzględnieniem roli kobiety w świetle Słowa Bożego.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
