import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import {
  X,
  Save,
  Layout,
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  Move,
  ExternalLink,
  MessageSquare,
  Share2,
  Play,
  Info,
  Globe,
  Calendar as CalendarIcon,
  ShieldCheck,
  LogOut,
  Radio,
} from "lucide-react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Responsive } from "react-grid-layout";
import {
  ToastMessage,
  SupportedLanguage,
  ALL_CHANNELS_YOUTUBE_URL,
  POLSKIE_RADIO_CC_URL,
} from "../types";
import { PersistenceService } from "../services/persistenceService";

const WidthProvider = (ComposedComponent: any) => {
  return (props: any) => {
    const [width, setWidth] = useState(1200);
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
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

type WidgetType = "link" | "social" | "multimedia" | "embed" | "post";

interface Widget {
  id: string;
  type: WidgetType;
  content: string;
  positionIndex: number;
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  metadata?: {
    title?: string;
    icon?: string;
    color?: string;
    embedUrl?: string;
    fontSize?: "xs" | "sm" | "base" | "xl";
  };
}

interface BusinessCardData {
  verseOfTheDay: string;
  widgets: Widget[];
  theme: {
    primaryColor: string;
    backgroundColor: string;
  };
  specialMessage?: string;
  profile?: {
    name: string;
    description: string;
    avatarUrl: string;
    avatarUrls?: string[];
    coverUrl: string;
  };
}

interface BusinessCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTvStudy: () => void;
  appLanguage: SupportedLanguage;
  addToast: (
    message: string,
    type?: ToastMessage["type"],
    action?: ToastMessage["action"],
  ) => string;
  isTickerExpanded?: boolean;
  onOpenManagement?: () => void;
}

export const BusinessCardModal: React.FC<BusinessCardModalProps> = ({
  isOpen,
  onClose,
  onOpenTvStudy,
  appLanguage,
  addToast,
  isTickerExpanded = false,
  onOpenManagement,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState("");
  const [isPinPromptOpen, setIsPinPromptOpen] = useState(false);
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [cardData, setCardData] = useState<BusinessCardData>({
    verseOfTheDay: "",
    widgets: [],
    theme: {
      primaryColor: "#C5A059",
      backgroundColor: "#18181b",
    },
    profile: {
      name: "Cezary Rogowski",
      description:
        "Wizjoner Christian Culture.\n„Idźcie na cały świat i głoście ewangelię wszelkiemu stworzeniu.” — Ewangelia Marka 16:15",
      avatarUrl: "/ROGOWSKI.jpg",
      avatarUrls: ["/ROGOWSKI.jpg"],
      coverUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=400&fit=crop",
    },
  });
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLayoutChanged, setIsLayoutChanged] = useState(false);

  const avatarUrlsString = useMemo(() => {
    return cardData.profile?.avatarUrls?.join(",") || "/ROGOWSKI.jpg";
  }, [cardData.profile?.avatarUrls]);

  useEffect(() => {
    if (
      cardData.profile?.avatarUrls &&
      cardData.profile.avatarUrls.length > 1
    ) {
      const interval = setInterval(() => {
        setCurrentAvatarIndex(
          (prev) => {
            const urls = cardData.profile?.avatarUrls || [];
            return urls.length > 0 ? (prev + 1) % urls.length : 0;
          }
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [avatarUrlsString]);

  const handleImageUpload = (file: File, type: "avatar" | "cover") => {
    const url = URL.createObjectURL(file);
    if (type === "avatar") {
      const currentAvatars = cardData.profile?.avatarUrls || [
        cardData.profile?.avatarUrl || "",
      ];
      const newAvatars = [...currentAvatars, url].slice(-12);
      setCardData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile!,
          avatarUrl: url,
          avatarUrls: newAvatars,
        },
      }));
    } else {
      setCardData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile!,
          coverUrl: url,
        },
      }));
    }
    setIsLayoutChanged(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, type: "avatar" | "cover") => {
    e.preventDefault();
    if (!isAdmin) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file, type);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let loadedData: Partial<BusinessCardData> = {};

      // Load local first for speed and guarantee
      const localData = PersistenceService.loadBusinessCard();
      if (localData) {
        loadedData = { ...localData };
      }

      try {
        const docRef = doc(db, "ccn_business_card", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dbData = docSnap.data() as BusinessCardData;
          loadedData = {
            ...loadedData,
            ...dbData,
            profile: { ...loadedData.profile, ...(dbData.profile || {}) },
          };
        }
      } catch (e) {
        console.warn("Could not load from firestore, using local cache", e);
      }

      if (Object.keys(loadedData).length > 0) {
        // Sanitize any broken blob URLs loaded from firestore or local cache
        if (loadedData.profile) {
          if (loadedData.profile.avatarUrls) {
            loadedData.profile.avatarUrls = loadedData.profile.avatarUrls
              .map((url: string) => (url && url.startsWith("blob:") ? "/ROGOWSKI.jpg" : url))
              .filter(Boolean);
          }
          if (loadedData.profile.avatarUrl && loadedData.profile.avatarUrl.startsWith("blob:")) {
            loadedData.profile.avatarUrl = "/ROGOWSKI.jpg";
          }
          if (loadedData.profile.coverUrl && loadedData.profile.coverUrl.startsWith("blob:")) {
            loadedData.profile.coverUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=400&fit=crop";
          }
          if (
            loadedData.profile.avatarUrl &&
            (loadedData.profile.avatarUrl.includes("unsplash.com") ||
              loadedData.profile.avatarUrl.includes(
                "1KK3LQ5YpD8rTNgXuHIT6jXhXEPprdIux",
              ) ||
              loadedData.profile.avatarUrl.includes("rogowski_avatar.webp"))
          ) {
            loadedData.profile.avatarUrl = "/ROGOWSKI.jpg";
            loadedData.profile.name = "Cezary Rogowski";
            loadedData.profile.description =
              "Wizjoner Christian Culture.\n„Idźcie na cały świat i głoście ewangelię wszelkiemu stworzeniu.” — Ewangelia Marka 16:15";
          }
        }

        setCardData(
          (prev) =>
            ({
              ...prev,
              ...loadedData,
              profile: {
                ...prev.profile,
                ...(loadedData.profile || {}),
              },
            }) as BusinessCardData,
        );
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "5550455") {
      setIsAdmin(true);
      setIsPinPromptOpen(false);
      addToast(
        appLanguage === "pl"
          ? "Zalogowano poprawnie"
          : "Logged in successfully",
        "success",
      );
    } else {
      addToast(
        appLanguage === "pl" ? "Nieprawidłowy PIN" : "Invalid PIN",
        "alert",
      );
    }
  };

  const handleSave = async () => {
    try {
      // Zapis lokalny dla bezpieczeństwa (wymóg użytkownika)
      PersistenceService.saveBusinessCard({
        ...cardData,
        updatedAt: new Date().toISOString(),
      });

      await setDoc(
        doc(db, "ccn_business_card", "global"),
        {
          ...cardData,
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser?.uid || "admin_pin",
        },
        { merge: true },
      );
      addToast(
        appLanguage === "pl" ? "Zapisano pomyślnie!" : "Saved successfully!",
        "success",
      );
      setIsLayoutChanged(false);
    } catch (err) {
      addToast(
        appLanguage === "pl"
          ? "Błąd zapisu w chmurze (zapisano lokalnie)"
          : "Cloud Save Error (Saved Locally)",
        "alert",
      );
      console.error(err);
      setIsLayoutChanged(false); // even if cloud fails, local was saved
    }
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setCardData((prev: any) => ({
      ...prev,
      widgets: prev.widgets.map((w: Widget) =>
        w.id === id ? { ...w, ...updates } : w,
      ),
    }));
  };

  const addWidget = () => {
    const id = Date.now().toString();
    const newWidget: Widget = {
      id,
      type: "link",
      content: "",
      positionIndex: cardData.widgets.length,
      layout: { x: 0, y: 99999, w: 2, h: 2 },
      metadata: {
        title: "Nowy Kafelek",
        color: "#C5A059",
      },
    };
    setCardData((prev: any) => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
  };

  const handleLayoutChange = (layout: any) => {
    setCardData((prev: any) => ({
      ...prev,
      widgets: prev.widgets.map((w: Widget) => {
        const l = layout.find((item: any) => item.i === w.id);
        if (l) {
          return {
            ...w,
            layout: { x: l.x, y: l.y, w: l.w, h: l.h },
          };
        }
        return w;
      }),
    }));
    setIsLayoutChanged(true);
  };

  const gridLayouts = useMemo(() => {
    return {
      lg: cardData.widgets.map((w: Widget) => ({
        i: w.id,
        x: w.layout?.x || 0,
        y: w.layout?.y || 0,
        w: w.layout?.w || 2,
        h: w.layout?.h || 2,
      })),
    };
  }, [cardData.widgets]);

  const removeWidget = (id: string) => {
    setCardData((prev: any) => ({
      ...prev,
      widgets: prev.widgets.filter((w: any) => w.id !== id),
    }));
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "link":
        return (
          <a
            href={widget.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 group/link w-full h-full"
          >
            <span className="text-[#C5A059] font-black uppercase tracking-widest text-xs group-hover/link:scale-110 transition-transform block truncate w-full">
              {widget.metadata?.title}
            </span>
            <span className="text-[10px] text-zinc-500 truncate w-full italic">
              {widget.content}
            </span>
          </a>
        );
      case "embed":
        return (
          <div
            className="w-full h-full flex items-center justify-center p-0 overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: widget.content,
            }}
          />
        );
      case "multimedia":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            {widget.metadata?.embedUrl ? (
              <iframe
                src={widget.metadata.embedUrl}
                title={widget.metadata.title}
                className="w-full aspect-video border-0 rounded-lg max-h-[140px]"
              />
            ) : (
              <div className="text-zinc-600 italic text-[10px]">
                Multimedia Content
              </div>
            )}
            <span className="text-[#C5A059] font-bold text-[10px] uppercase truncate w-full mt-1">
              {widget.metadata?.title}
            </span>
          </div>
        );
      case "social":
        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="text-white font-bold text-xs uppercase">
              {widget.metadata?.title}
            </span>
          </div>
        );
      case "post":
        return (
          <div className="w-full h-full text-left p-1 overflow-y-auto scrollbar-hide max-h-[160px]">
            <h4 className="text-[#C5A059] text-[10px] font-black uppercase tracking-tighter mb-1 truncate">
              {widget.metadata?.title || "Post"}
            </h4>
            <p
              className={`text-zinc-300 leading-tight ${
                widget.metadata?.fontSize === "sm"
                  ? "text-xs"
                  : widget.metadata?.fontSize === "base"
                    ? "text-sm"
                    : widget.metadata?.fontSize === "xl"
                      ? "text-base"
                      : "text-[11px]"
              }`}
            >
              {widget.content}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[1601] flex items-center justify-center p-0`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#09090b] bg-opacity-95 cursor-pointer"
        onClick={onClose}
      />

      {isPinPromptOpen && !isAdmin ? (
        <div className="relative z-10 bg-zinc-900 border border-[#C5A059]/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
          <h2 className="text-[#C5A059] font-black uppercase text-xl mb-4">
            Autoryzacja Admina
          </h2>
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              className="bg-black border border-[#C5A059]/50 rounded-xl p-4 text-center text-white font-black tracking-widest text-xl focus:border-[#C5A059] outline-none"
              placeholder="PIN"
            />
            <button
              aria-label="Przycisk"
              type="submit"
              className="bg-[#C5A059] text-black hover:bg-[#E2B859] transition-colors font-black uppercase py-4 rounded-xl"
            >
              Weryfikuj
            </button>
          </form>
          <button
            onClick={() => setIsPinPromptOpen(false)}
            className="mt-4 text-zinc-500 hover:text-white uppercase tracking-widest text-xs font-bold"
          >
            Pomiń (Read-Only)
          </button>
        </div>
      ) : (
        <div className="z-10 w-full h-full bg-[#09090b] flex flex-col relative overflow-hidden">
          {/* Navigation / Actions Layer */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-full transition-all font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 shadow-xl ${isLayoutChanged ? "bg-red-500 text-white animate-pulse" : "bg-black/60 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/50 hover:bg-[#C5A059] hover:text-black"}`}
              >
                <Save size={14} className="hidden sm:block" /> Zapisz
              </button>
            )}
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
              onClick={() => {
                onClose();
                (window as any).cc_openDashboard?.();
              }}
              className="p-2 sm:px-4 sm:py-2 text-white bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2 shadow-xl"
            >
              <CalendarIcon size={14} />{" "}
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest">
                Planer
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
          <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#09090b] pb-32">
            {/* Cover Photo */}
            <div
              className="relative w-full h-48 sm:h-72 bg-zinc-900 overflow-hidden group"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, "cover")}
            >
              {cardData.profile?.coverUrl && (
                <img
                  src={cardData.profile.coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=400&fit=crop";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80 pointer-events-none" />

              {isAdmin && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span
                    className="text-white font-bold tracking-widest uppercase bg-black/50 px-4 py-2 rounded-xl pointer-events-auto cursor-pointer"
                    onClick={() =>
                      document.getElementById("cover-upload")?.click()
                    }
                  >
                    Zmień Tło (Upuść lub Kliknij)
                  </span>
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleImageUpload(e.target.files[0], "cover")
                    }
                  />
                </div>
              )}

              {/* Secret Admin Button */}
              {!isAdmin && (
                <button
                  className="absolute top-0 inset-x-0 w-full h-16 opacity-0 z-40 cursor-default"
                  onClick={() => setIsPinPromptOpen(true)}
                  aria-label="Secret Access"
                />
              )}
            </div>

            {/* Avatar & Profile Info */}
            <div className="relative px-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pb-6 border-b border-white/5 -mt-16 sm:-mt-20 z-10 block">
              <div
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-zinc-950 bg-zinc-900 overflow-hidden shadow-2xl flex-shrink-0 group"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, "avatar")}
              >
                {cardData.profile?.avatarUrls &&
                cardData.profile.avatarUrls.length > 0 ? (
                  <img
                    src={
                      cardData.profile.avatarUrls[currentAvatarIndex] ||
                      "/ROGOWSKI.jpg"
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/ROGOWSKI.jpg";
                    }}
                  />
                ) : cardData.profile?.avatarUrl ? (
                  <img
                    src={cardData.profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/ROGOWSKI.jpg";
                    }}
                  />
                ) : (
                  <img
                    src="/ROGOWSKI.jpg"
                    alt="Default Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Radio Icon Overlay */}
                <div className="absolute bottom-2 right-2 bg-zinc-900 rounded-full p-1.5 border border-[#C5A059] shadow-lg z-20">
                  <Radio className="w-5 h-5 text-[#C5A059]" />
                </div>

                {isAdmin && (
                  <div
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <span className="text-white text-[10px] font-bold text-center tracking-widest uppercase">
                      Zmień
                      <br />
                      Avatar
                    </span>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleImageUpload(e.target.files[0], "avatar")
                      }
                    />
                  </div>
                )}
              </div>
              {/* Radio Icon Overlay */}
              <div className="absolute -bottom-2 -right-2 bg-zinc-900 rounded-full p-1.5 border border-[#C5A059] shadow-lg z-20">
                <Radio className="w-5 h-5 text-[#C5A059]" />
              </div>

              <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 w-full">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {cardData.profile?.name}
                  </h1>
                  {cardData.profile?.description && (
                    <p className="text-zinc-400 text-sm mt-1 mb-2 whitespace-pre-wrap max-w-xl leading-snug">
                      {cardData.profile.description}
                    </p>
                  )}
                </div>

                {/* Follow / Edit Button */}
                <div className="flex items-center gap-2 flex-shrink-0 mb-2">
                  {isAdmin ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold tracking-wide transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg border border-white/10"
                      >
                        <Edit2 size={16} /> Edytuj Profil
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSave}
                          className={`flex-1 px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${isLayoutChanged ? "bg-red-500 text-white animate-pulse" : "bg-black text-[#C5A059] border border-[#C5A059]/50 hover:bg-[#C5A059] hover:text-black"}`}
                        >
                          <Save size={14} /> ZAPISZ
                        </button>
                        <button
                          onClick={() => {
                            auth.signOut();
                            setIsAdmin(false);
                            onClose();
                            addToast(
                              appLanguage === "pl"
                                ? "Wylogowano"
                                : "Logged out",
                              "info",
                            );
                          }}
                          className="flex-1 px-4 py-2 bg-zinc-900 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 transition-all"
                        >
                          <LogOut size={14} /> WYLOGUJ
                        </button>
                      </div>

                      {onOpenManagement && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenManagement();
                          }}
                          className="w-full px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-black tracking-widest transition-all flex items-center justify-center gap-2 text-xs sm:text-sm border border-red-400/30 shadow-lg shadow-red-900/20 group animate-pulse"
                        >
                          <Layout
                            size={16}
                            className="group-hover:rotate-12 transition-transform"
                          />
                          PANEL ZARZĄDZANIA
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {!isAdmin && (
                        <button
                          onClick={() => setIsPinPromptOpen(true)}
                          className="w-full px-6 py-2 bg-red-900/40 hover:bg-red-800/60 text-red-100 rounded-lg font-black tracking-widest transition-all flex items-center justify-center gap-2 text-xs sm:text-sm border border-red-500/30 shadow-lg shadow-black/40 group"
                        >
                          <ShieldCheck
                            size={16}
                            className="text-red-400 group-hover:scale-110 transition-transform"
                          />
                          ADMIN
                        </button>
                      )}
                      {isAdmin && onOpenManagement && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenManagement();
                          }}
                          className="w-full px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-black tracking-widest transition-all flex items-center justify-center gap-2 text-xs sm:text-sm border border-red-400/30 shadow-lg shadow-red-900/20 group animate-pulse"
                        >
                          <Layout
                            size={16}
                            className="group-hover:rotate-12 transition-transform"
                          />
                          PANEL ZARZĄDZANIA
                        </button>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            addToast(
                              appLanguage === "pl"
                                ? "Funkcja wkrótce dostępna"
                                : "Coming soon",
                              "info",
                            )
                          }
                          className="px-6 py-2 bg-[#C5A059] hover:bg-gold text-black rounded-lg font-bold tracking-wide transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-lg shadow-[#C5A059]/20"
                        >
                          <Plus size={16} />{" "}
                          {appLanguage === "pl" ? "Obserwuj" : "Follow"}
                        </button>
                        <button
                          aria-label="Wiadomości"
                          onClick={() =>
                            addToast(
                              appLanguage === "pl"
                                ? "Wiadomości chrześcijańskie wkrótce"
                                : "Messaging coming soon",
                              "info",
                            )
                          }
                          className="p-2 sm:px-4 sm:py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold tracking-wide transition-colors flex items-center gap-2 text-xs sm:text-sm border border-white/10"
                        >
                          <MessageSquare size={16} />{" "}
                          <span className="hidden sm:inline">
                            {appLanguage === "pl" ? "Wiadomość" : "Message"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 sm:space-y-8 mt-2">
              {/* Verse of the Day */}
              <div className="bg-black/50 p-6 rounded-2xl border border-[#C5A059]/30">
                <h3 className="text-[#C5A059] text-xs font-black uppercase tracking-widest mb-4">
                  Słowo Dnia
                </h3>
                {isAdmin ? (
                  <textarea
                    value={cardData.verseOfTheDay}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        verseOfTheDay: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059] min-h-[100px]"
                    placeholder="Treść słowa dnia..."
                  />
                ) : (
                  cardData.verseOfTheDay && (
                    <p className="text-white text-lg font-bold italic">
                      "{cardData.verseOfTheDay}"
                    </p>
                  )
                )}
              </div>

              {/* Special Message (Voice Assistant) */}
              {isAdmin && (
                <div className="bg-black/50 p-6 rounded-2xl border border-blue-500/30">
                  <h3 className="text-blue-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    Wiadomość Specjalna (Asystent Głosowy)
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px]">
                      Opcjonalne
                    </span>
                  </h3>
                  <textarea
                    value={cardData.specialMessage}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        specialMessage: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 min-h-[100px]"
                    placeholder="Napisz tutaj, jeśli chcesz nadpisać standardowe powitanie asystenta. Asystent odczyta to po zalogowaniu."
                  />
                </div>
              )}

              {/* Official Resources Section */}
              <div className="space-y-4">
                <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest px-1">
                  Oficjalne Zasoby Misji
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={ALL_CHANNELS_YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-4 transition-all hover:bg-[#C5A059]/20 group"
                  >
                    <div className="w-12 h-12 bg-[#FF0000]/10 rounded-xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-[#FF0000]" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-[#C5A059] font-black uppercase tracking-widest text-sm">
                        Kanały YouTube
                      </h4>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                        Wszystkie w jednym miejscu
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-[#C5A059] transition-colors" />
                  </a>

                  <a
                    href={POLSKIE_RADIO_CC_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-zinc-900 border border-white/5 rounded-2xl p-4 transition-all hover:bg-zinc-800 group"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-[#C5A059]" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm">
                        Portal Główny
                      </h4>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                        www.polskieradio.cc
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>

              {/* Dashboard Widgets */}
              <div className="relative">
                <h3 className="text-[#C5A059] text-xs font-black uppercase tracking-widest mb-4 flex justify-between items-center bg-black/40 p-4 rounded-t-2xl border-x border-t border-[#C5A059]/20">
                  <span className="flex items-center gap-2">
                    <Layout size={14} /> Identity Dashboard
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-500 hidden md:block uppercase tracking-tighter">
                        Drag & Resize enabled
                      </span>
                      <button
                        onClick={addWidget}
                        className="flex items-center gap-1 bg-[#C5A059]/20 hover:bg-[#C5A059]/40 px-4 py-1.5 rounded-full text-[#C5A059] transition-all border border-[#C5A059]/30 text-[10px] font-black uppercase"
                      >
                        <Plus size={14} /> Dodaj Element
                      </button>
                    </div>
                  )}
                </h3>

                <div className="bg-black/20 border-x border-b border-[#C5A059]/10 rounded-b-2xl min-h-[300px] p-4">
                  {isAdmin ? (
                    <ResponsiveGridLayout
                      className="layout"
                      layouts={gridLayouts}
                      breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                      }}
                      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                      rowHeight={30}
                      isDraggable={isAdmin}
                      isResizable={isAdmin}
                      onLayoutChange={handleLayoutChange}
                      draggableHandle=".drag-handle"
                      margin={[10, 10]}
                    >
                      {cardData.widgets.map((widget: Widget) => (
                        <div
                          key={widget.id}
                          className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#C5A059]/50"
                        >
                          {/* Admin Toolbar Overlay */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-black/60 p-1 rounded-lg backdrop-blur-md border border-white/10">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setEditingWidget(widget);
                              }}
                              className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              aria-label="Przycisk"
                              className="drag-handle p-1.5 text-white hover:bg-white/10 rounded cursor-grab active:cursor-grabbing"
                            >
                              <Move size={12} />
                            </button>
                            <button
                              aria-label="Usuń"
                              onClick={(e) => {
                                e.preventDefault();
                                removeWidget(widget.id);
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Content Renderer */}
                          <div className="w-full h-full p-4 flex flex-col justify-center items-center text-center overflow-auto scrollbar-hide">
                            {renderWidgetContent(widget)}
                          </div>
                        </div>
                      ))}
                    </ResponsiveGridLayout>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {cardData.widgets.map((widget: Widget) => (
                        <div
                          key={widget.id}
                          className="group relative bg-zinc-900 border border-white/10 rounded-2xl p-4 min-h-[140px] flex flex-col justify-center items-center text-center shadow-2xl transition-all hover:scale-[1.02] hover:border-[#C5A059]/30"
                        >
                          {renderWidgetContent(widget)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
      )}
      {/* Profile Editor Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setIsEditingProfile(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                <h3 className="text-[#C5A059] font-black uppercase tracking-widest">
                  Edytuj Profil
                </h3>
                <button
                  aria-label="Zamknij"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Nazwa / Imię i Nazwisko
                  </label>
                  <input
                    type="text"
                    value={cardData.profile?.name || ""}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        profile: { ...cardData.profile!, name: e.target.value },
                      })
                    }
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Opis (Bio)
                  </label>
                  <textarea
                    value={cardData.profile?.description || ""}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        profile: {
                          ...cardData.profile!,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059] min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    URL Avatara
                  </label>
                  <input
                    type="text"
                    value={cardData.profile?.avatarUrl || ""}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        profile: {
                          ...cardData.profile!,
                          avatarUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    URL Tła (Cover)
                  </label>
                  <input
                    type="text"
                    value={cardData.profile?.coverUrl || ""}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        profile: {
                          ...cardData.profile!,
                          coverUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="p-6 bg-black/60 border-t border-white/10 flex gap-4">
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setIsLayoutChanged(true);
                  }}
                  className="flex-1 bg-[#C5A059] text-black py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#E2B859] transition-all"
                >
                  Gotowe
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Widget Editor Drawer/Modal */}
      <AnimatePresence>
        {editingWidget && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setEditingWidget(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                <h3 className="text-[#C5A059] font-black uppercase tracking-widest">
                  Edytuj Element
                </h3>
                <button
                  aria-label="Zamknij"
                  onClick={() => setEditingWidget(null)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Typ Modułu
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["link", "social", "multimedia", "embed", "post"].map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() =>
                            setEditingWidget({
                              ...editingWidget,
                              type: t as WidgetType,
                            })
                          }
                          className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${editingWidget.type === t ? "bg-[#C5A059] text-black border-[#C5A059]" : "bg-black text-zinc-400 border-white/10 hover:border-white/30"}`}
                        >
                          {t}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Tytuł / Nazwa
                  </label>
                  <input
                    type="text"
                    value={editingWidget.metadata?.title || ""}
                    onChange={(e) =>
                      setEditingWidget({
                        ...editingWidget,
                        metadata: {
                          ...editingWidget.metadata,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059]"
                    placeholder="Np. Oficjalny Kanał YouTube"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {editingWidget.type === "embed"
                      ? "Kod HTML / Iframe"
                      : "Treść / Link"}
                  </label>
                  <textarea
                    value={editingWidget.content || ""}
                    onChange={(e) =>
                      setEditingWidget({
                        ...editingWidget,
                        content: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059] min-h-[120px] font-mono text-xs"
                    placeholder={
                      editingWidget.type === "embed"
                        ? '<iframe title="Ramka zawartości" ...></iframe>'
                        : "https://... lub treść posta"
                    }
                  />
                </div>

                {editingWidget.type === "post" && (
                  <div className="space-y-4 animate-fade-in border-t border-white/5 pt-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Wielkość czcionki
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "xs", l: "Obecna" },
                        { id: "sm", l: "Średnia" },
                        { id: "base", l: "Duża" },
                        { id: "xl", l: "Bardzo Duża" },
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() =>
                            setEditingWidget({
                              ...editingWidget,
                              metadata: {
                                ...editingWidget.metadata,
                                fontSize: size.id as any,
                              },
                            })
                          }
                          className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                            (editingWidget.metadata?.fontSize || "xs") ===
                            size.id
                              ? "bg-[#C5A059] text-black border-[#C5A059]"
                              : "bg-black text-zinc-400 border-white/10 hover:border-white/30"
                          }`}
                        >
                          {size.l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {editingWidget.type === "multimedia" && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Embed URL (Opcjonalne)
                    </label>
                    <input
                      type="text"
                      value={editingWidget.metadata?.embedUrl || ""}
                      onChange={(e) =>
                        setEditingWidget({
                          ...editingWidget,
                          metadata: {
                            ...editingWidget.metadata,
                            embedUrl: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#C5A059]"
                      placeholder="Np. URL do Spotify Embed"
                    />
                  </div>
                )}
              </div>

              <div className="p-6 bg-black/60 border-t border-white/10 flex gap-4">
                <button
                  onClick={() => {
                    updateWidget(editingWidget.id, editingWidget);
                    setEditingWidget(null);
                  }}
                  className="flex-1 bg-[#C5A059] text-black py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#E2B859] transition-all"
                >
                  Zastosuj Zmiany
                </button>
                <button
                  onClick={() => setEditingWidget(null)}
                  className="px-6 bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all border border-white/5"
                >
                  Anuluj
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
