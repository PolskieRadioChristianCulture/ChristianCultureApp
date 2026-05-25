import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Separator } from "./Separator";
import { EditableImage } from "./EditableImage";
import {
  UserPersona,
  ToastMessage,
  fixOrphans,
  ManagementTab,
  MIRIAM_AVATAR_URL,
  JESZUA_AVATAR_URL,
  CENTRUM_LOGO_URL,
  inferGenderFromName,
  SupportedLanguage,
  isAllowedDomain,
  isStripeAllowed,
  APP_VERSION,
  SocialLinks,
  Post,
  RadioStreamType,
} from "../types";
import { PersistenceService } from "../services/persistenceService";
import { googleCalendarService } from "../services/googleCalendarService";
import { nativeService } from "../services/nativeService";
import { CommunityService } from "../services/communityService";
import { ImpactStyle } from "@capacitor/haptics";
import {
  Camera,
  Image as ImageIcon,
  Share2,
  LogOut,
  Edit3,
  LayoutDashboard,
  Radio,
  ShieldCheck,
  Plus,
  Youtube,
  Facebook,
  Instagram,
  Music,
  MessageCircle,
  MessageSquare,
  UserPlus,
  GripVertical,
  MoreVertical,
  FolderOpen,
  X,
} from "lucide-react";
import { Responsive } from "react-grid-layout";
import { WidgetTile } from "./IdentityEngine/WidgetTile";
import { AddWidgetModal } from "./IdentityEngine/AddWidgetModal";
import { MyFilesModal } from "./MyFilesModal";
import { Widget, WidgetType, WidgetMetadata } from "../types";
import { mediaPlayerService } from "../services/mediaPlayerService";
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { sanitizeForFirestore } from "../services/syncService";

const WidthProvider = (ComposedComponent: any) => {
  return (props: any) => {
    const [width, setWidth] = useState(1200);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current) setWidth(ref.current.offsetWidth);
      const handleResize = () => {
        if (ref.current) setWidth(ref.current.offsetWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <div ref={ref} className="w-full">
        <ComposedComponent {...props} width={width} />
      </div>
    );
  };
};

const ResponsiveGridLayout = WidthProvider(Responsive);

const SocialIcons = {
  spotify: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.223.367-.704.482-1.071.259-2.92-1.785-6.595-2.187-10.925-1.197-.419.096-.841-.172-.937-.591-.096-.419.172-.841.591-.937 4.737-1.082 8.791-.622 12.083 1.394.367.223.482.704.259 1.072zm1.472-3.257c-.281.456-.88.604-1.336.323-3.342-2.054-8.438-2.651-12.39-1.452-.512.155-1.05-.141-1.205-.653-.155-.512.141-1.05.653-1.205 4.519-1.371 10.134-.703 14.004 1.675.456.281.604.88.323 1.336-.049.079-.049.079 0 0zm.127-3.41c-4.01-2.381-10.619-2.6-14.46-1.432-.614.186-1.263-.166-1.449-.78-.186-.614.166-1.263.78-1.449 4.417-1.34 11.712-1.08 16.331 1.66.552.327.739 1.035.412 1.587-.327.552-1.035.739-1.587.412-.027-.016-.027-.016 0 0z" />
    </svg>
  ),
  tiktok: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.417 6.417 0 0 1-1.87-1.62v7.94c.03 3.48-2.35 6.74-5.75 7.52-3.4.78-7.16-1.15-8.52-4.37-1.36-3.22-.05-7.22 2.99-8.82 1.08-.57 2.32-.82 3.53-.73v4.02c-.82-.13-1.73.07-2.35.65-.62.58-.91 1.48-.77 2.32.14.84.73 1.56 1.53 1.83.8.27 1.72.11 2.37-.42.65-.53.97-1.41.92-2.25V0h.02z" />
    </svg>
  ),
  whatsapp: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  messenger: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 4.97 0 11.11c0 3.5 1.62 6.62 4.15 8.65.22.17.35.44.35.73l-.01 2.57c0 .54.58.9 1.05.63l2.88-1.61c.23-.13.49-.16.74-.1 1.04.25 2.13.38 3.24.38 6.63 0 12-4.97 12-11.11S18.63 0 12 0zm1.19 14.83l-2.41-2.57-4.7 2.57 5.17-5.5 2.41 2.57 4.7-2.57-5.17 5.5z" />
    </svg>
  ),
};

interface UserPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userPersona: UserPersona;
  targetUserID?: string;
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onBecomePatron: () => void;
  onBecomeMecenas: () => void;
  onOpenRadioMode: () => void;
  onOpenDashboard: () => void;
  onOpenManagement: (tab: ManagementTab) => void;
  onUpdateUserPersona: (persona: UserPersona) => void; // Added for sync
  isTickerExpanded?: boolean;
  isLandscape?: boolean;
  onOpenSupport: () => void;
  onOpenChat: (uid: string) => void;
  onOpenBusinessCard?: () => void;
  onOpenZbyszekGieron?: () => void;
  onOpenAdminLogin?: () => void;
}

const StripeBuyButton = "stripe-buy-button" as any;

export const UserPanel: React.FC<UserPanelProps> = ({
  isOpen,
  onClose,
  userPersona,
  targetUserID,
  appLanguage,
  addToast,
  onLogout,
  onEditProfile,
  onOpenRadioMode,
  onOpenDashboard,
  onOpenManagement,
  onUpdateUserPersona,
  isTickerExpanded = false,
  isLandscape = false,
  onOpenSupport,
  onOpenChat,
  onOpenBusinessCard,
  onOpenZbyszekGieron,
  onOpenAdminLogin,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBackgroundInfo, setShowBackgroundInfo] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [profileData, setProfileData] = useState<UserPersona | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState<{
    status: string;
    requestId?: string;
  }>({ status: "loading" });
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const materialFileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async () => {
    setIsSyncing(true);
    try {
      await PersistenceService.saveUserPersona(userPersona);
      addToast(
        appLanguage === "pl"
          ? "Profil zapisany i zsynchronizowany! ✨"
          : "Profile saved and synced! ✨",
        "success",
      );
    } catch (err) {
      addToast(appLanguage === "pl" ? "Błąd zapisu." : "Save error.", "alert");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAdminEntry = () => {
    if (onOpenAdminLogin) {
      onClose();
      onOpenAdminLogin();
      return;
    }
    const pin = prompt(
      appLanguage === "pl" ? "Podaj PIN Administratora:" : "Enter Admin PIN:",
    );
    if (pin === "5550455") {
      onOpenManagement("system");
      addToast(
        appLanguage === "pl"
          ? "Witaj w Centrum Dowodzenia, Cezary."
          : "Welcome to Command Center, Cezary.",
        "success",
      );
    } else if (pin !== null) {
      addToast(appLanguage === "pl" ? "Błędny PIN." : "Invalid PIN.", "alert");
    }
  };

  const activePersonaRaw = profileData || userPersona;
  const activePersona = useMemo(() => {
    if (!activePersonaRaw) return activePersonaRaw;
    const cleanUrls = (activePersonaRaw.avatarUrls || [])
      .map((url: string) => (url && url.startsWith("blob:") ? "/ROGOWSKI.jpg" : url))
      .filter(Boolean);
    const cleanPic = activePersonaRaw.profilePicture && activePersonaRaw.profilePicture.startsWith("blob:")
      ? "/ROGOWSKI.jpg"
      : activePersonaRaw.profilePicture;
    const cleanBg = activePersonaRaw.profileBackground && activePersonaRaw.profileBackground.startsWith("blob:")
      ? undefined
      : activePersonaRaw.profileBackground;
    return {
      ...activePersonaRaw,
      avatarUrls: cleanUrls.length > 0 ? cleanUrls : ["/ROGOWSKI.jpg"],
      profilePicture: cleanPic || "/ROGOWSKI.jpg",
      profileBackground: cleanBg,
    };
  }, [profileData, userPersona]);

  const isSelf = !targetUserID || targetUserID === userPersona.uid;

  useEffect(() => {
    if (activePersona.avatarUrls && activePersona.avatarUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentAvatarIndex(
          (prev) => (prev + 1) % activePersona.avatarUrls!.length,
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activePersona.avatarUrls]);

  const handleAddWidget = async (
    type: WidgetType,
    content: string,
    metadata: WidgetMetadata,
  ) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      content,
      positionIndex: activePersona.widgets?.length || 0,
      metadata,
      layout: {
        w: 2,
        h: type === "multimedia" || type === "spiritual" ? 2 : 1,
        x: 0,
        y: 99999, // Auto-position at bottom
      },
    };

    const updatedWidgets = [...(activePersona.widgets || []), newWidget];
    onUpdateUserPersona({ ...activePersona, widgets: updatedWidgets });
    addToast(
      appLanguage === "pl" ? "Widget dodany!" : "Widget added!",
      "success",
    );
  };

  const handleDeleteWidget = (id: string) => {
    const updatedWidgets = (activePersona.widgets || []).filter(
      (w) => w.id !== id,
    );
    onUpdateUserPersona({ ...activePersona, widgets: updatedWidgets });
  };

  const handleLayoutChange = (currentLayout: any) => {
    if (!isSelf) return;

    // Check if anything actually changed to avoid infinite loops
    const updatedWidgets = (activePersona.widgets || []).map((widget) => {
      const layoutItem = currentLayout.find((l: any) => l.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          layout: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
        };
      }
      return widget;
    });

    // Only update if layouts are different
    const hasChanged =
      JSON.stringify(activePersona.widgets?.map((w) => w.layout)) !==
      JSON.stringify(updatedWidgets.map((w) => w.layout));

    if (hasChanged) {
      onUpdateUserPersona({ ...activePersona, widgets: updatedWidgets });
    }
  };

  useEffect(() => {
    if (targetUserID && targetUserID !== userPersona.uid) {
      setIsLoading(true);
      CommunityService.getUserProfile(targetUserID)
        .then((profile) => {
          setProfileData(profile as UserPersona);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
      CommunityService.checkRelationshipStatus(
        userPersona.uid,
        targetUserID,
      ).then(setRelationshipStatus);
    } else {
      setProfileData(userPersona);
      setRelationshipStatus({ status: "none" });
    }
  }, [targetUserID, userPersona]);

  const handleFriendAction = async () => {
    if (relationshipStatus.status === "none" && targetUserID) {
      await CommunityService.sendFriendRequest(
        userPersona.uid,
        userPersona.name,
        userPersona.profilePicture || "",
        targetUserID,
      );
      setRelationshipStatus({ status: "pending_sent" });
    } else if (
      relationshipStatus.status === "pending_received" &&
      relationshipStatus.requestId
    ) {
      await CommunityService.respondToFriendRequest(
        relationshipStatus.requestId,
        "accepted",
      );
      setRelationshipStatus({ status: "friends" });
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit for base64 storage
        addToast(
          appLanguage === "pl"
            ? "Zdjęcie jest za duże (max 1MB)"
            : "Image is too large (max 1MB)",
          "alert",
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdateUserPersona({
          ...activePersona,
          profileBackground: base64String,
        });
        addToast(
          appLanguage === "pl"
            ? "Tło profilu zaktualizowane! ✨"
            : "Profile background updated! ✨",
          "success",
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMaterialUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSyncing(true);
      try {
        // Zapis do lokalnego OPFS (Origin Private File System) dla dużych plików
        if ("storage" in navigator && "getDirectory" in navigator.storage) {
          try {
            const opfsRoot = await navigator.storage.getDirectory();
            const materialsDir = await opfsRoot.getDirectoryHandle(
              "cc_materials",
              { create: true },
            );
            const fileHandle = await materialsDir.getFileHandle(file.name, {
              create: true,
            });
            const writable = await fileHandle.createWritable();
            await writable.write(file);
            await writable.close();
            console.log("Plik zapisany w OPFS pomyślnie.");
          } catch (opfsErr) {
            console.warn("OPFS error, kontynuuję z zapisem metadata:", opfsErr);
          }
        }

        // Zapis metadanych do IndexedDB/dynamicDB
        const storedMaterialsStr =
          typeof window !== "undefined"
            ? localStorage.getItem("cc_userMaterials") || "[]"
            : "[]";
        let storedMaterials = [];
        try {
          storedMaterials = JSON.parse(storedMaterialsStr);
        } catch (e) {}

        storedMaterials.push({
          id: Date.now().toString(),
          name: file.name,
          type: file.type || "unknown",
          size: file.size,
          addedAt: new Date().toISOString(),
        });

        localStorage.setItem(
          "cc_userMaterials",
          JSON.stringify(storedMaterials),
        );

        addToast(
          appLanguage === "pl"
            ? `Materiał "${file.name}" gotowy do użycia. Dostęp do plików przyznany!`
            : `Material "${file.name}" ready to use. File access granted!`,
          "success",
        );
      } catch (err) {
        console.error("Błąd zapisu materiału:", err);
        addToast(
          appLanguage === "pl"
            ? "Błąd dostępu do pliku."
            : "File access error.",
          "alert",
        );
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // PROBLEM 2: Upewnienie się, że opcja logowania jest widoczna
  const isGoogleUser = !!activePersona.googleEmail;
  const allowed = isStripeAllowed();

  const handleGoogleIdentityLink = useCallback(async () => {
    setIsSyncing(true);
    addToast(
      appLanguage === "pl"
        ? "Otwieram bramy Christian Identity..."
        : "Opening Christian Identity gates...",
      "info",
    );

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const name = user.displayName || "Gość";
        const email = user.email || undefined;
        const picture = user.photoURL || undefined;
        const uid = user.uid;

        // INTELLIGENT ONBOARDING: Mężczyzna -> Miriam, Kobieta -> Jeszua
        const gender = inferGenderFromName(name);
        const mentor = gender === "male" ? "Miriam" : "Jeszua";

        const updatedPersona: UserPersona = {
          ...activePersona,
          name: name,
          googleEmail: email,
          profilePicture: picture,
          gender: gender,
          assignedMentor: mentor,
          isGoogleCalendarConnected: true,
          uid: uid,
          joshuaSystem: {
            enabled: true,
            disciplineMode: "5.10.15",
            driveSyncEnabled: true,
          },
        };

        const sanitized = sanitizeForFirestore(updatedPersona);
        onUpdateUserPersona(sanitized);

        addToast(
          appLanguage === "pl"
            ? `Witaj, ${name}! Twoim mentorem uświęcenia została ${mentor === "Miriam" ? "Miriam CC" : "Jeszua"}. System Joshua aktywowany.`
            : `Welcome, ${name}! ${mentor === "Miriam" ? "Miriam CC" : "Jeszua"} is your mentor. Joshua system active.`,
          "success",
        );
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        addToast(
          appLanguage === "pl" ? "Logowanie anulowane." : "Login cancelled.",
          "info",
        );
      } else {
        addToast(
          appLanguage === "pl"
            ? "Błąd logowania Google."
            : "Google login error.",
          "alert",
        );
      }
    } finally {
      setIsSyncing(false);
    }
  }, [appLanguage, addToast, activePersona, onUpdateUserPersona]);

  const handleFacebookIdentityLink = useCallback(async () => {
    setIsSyncing(true);
    addToast(
      appLanguage === "pl"
        ? "Łączenie z profilem Facebook..."
        : "Connecting to Facebook profile...",
      "info",
    );

    try {
      const provider = new FacebookAuthProvider();
      provider.setCustomParameters({
        display: "popup",
      });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const name = user.displayName || "Gość";
      const email = user.email || undefined;
      const picture = user.photoURL || undefined;

      const gender = inferGenderFromName(name);
      const mentor = gender === "male" ? "Miriam" : "Jeszua";

      const updatedPersona: UserPersona = {
        ...userPersona,
        name: name,
        googleEmail: email || userPersona.googleEmail,
        profilePicture: picture || userPersona.profilePicture,
        gender: gender,
        assignedMentor: mentor,
      };

      onUpdateUserPersona(updatedPersona);

      addToast(
        appLanguage === "pl"
          ? `Witaj, ${name}! Połączono z Facebook.`
          : `Welcome, ${name}! Connected to Facebook.`,
        "success",
      );
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/popup-closed-by-user") {
        addToast(
          appLanguage === "pl" ? "Logowanie anulowane." : "Login cancelled.",
          "info",
        );
      } else {
        addToast(
          appLanguage === "pl"
            ? "Błąd logowania przez Facebook."
            : "Facebook login error.",
          "alert",
        );
      }
    } finally {
      setIsSyncing(false);
    }
  }, [appLanguage, addToast, userPersona, onUpdateUserPersona]);

  const handleShareInvite = useCallback(async () => {
    if (!activePersona.name) {
      addToast(
        appLanguage === "pl"
          ? "Ustaw imię w profilu przed udostępnieniem."
          : "Set your name in profile before sharing.",
        "info",
      );
      onEditProfile();
      return;
    }
    setIsSharing(true);
    const msg =
      appLanguage === "pl"
        ? `Korzystam z Christian Culture – biblijnego organizera RADIO. Pomaga mi w codziennym uświęceniu. Zainstaluj na https://cclite.pl. — ${activePersona.name}`
        : `I'm using Christian Culture RADIO biblical organizer. Helps my daily sanctification. Install at https://cclite.pl. — ${activePersona.name}`;

    try {
      if (navigator.share)
        await navigator.share({
          title: "Christian Culture RADIO",
          text: msg,
          url: "https://cclite.pl",
        });
      else await navigator.clipboard.writeText(msg);
      addToast(
        appLanguage === "pl"
          ? "Zaproszenie gotowe! ✨"
          : "Invitation ready! ✨",
        "success",
      );
    } catch (err) {
      addToast(appLanguage === "pl" ? "Skopiowano." : "Copied.", "success");
    } finally {
      setIsSharing(false);
    }
  }, [userPersona.name, appLanguage, addToast, onEditProfile]);

  const handleShareProfile = useCallback(async () => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("open-public-profile", {
          detail: { uid: activePersona.uid || activePersona.googleEmail },
        }),
      );
    }, 100);
  }, [activePersona, onClose]);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 w-full dark bg-zinc-950 z-[4000] transform transition-transform duration-500 ease-in-out shadow-4xl border-l border-white/10 pt-safe pb-safe ${isOpen ? "translate-x-0" : "translate-x-full"} top-[calc(48px+env(safe-area-inset-top,0px))] sm:top-[calc(64px+env(safe-area-inset-top,0px))]`}
    >
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col relative overflow-x-hidden overflow-y-auto">
        {/* Background Image / Header */}
        <div className="absolute top-0 inset-x-0 w-full h-64 overflow-hidden pointer-events-none">
          {userPersona.profileBackground ? (
            <img
              src={userPersona.profileBackground}
              className="w-full h-full object-cover opacity-80"
              alt="Background"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#E2B859]/20 to-zinc-950"></div>
          )}
          {/* Stronger gradient for perfect blending with zinc-950 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950"></div>
        </div>

        {/* Hidden inputs outside of absolute element to ensure functionality */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleBackgroundUpload}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={materialFileInputRef}
          onChange={handleMaterialUpload}
          accept=".mp3,.mp4,.pdf,audio/*,video/*,application/pdf"
          className="hidden"
        />

        <div className="flex flex-col h-full p-4 sm:p-8 pt-4 relative z-10 w-full">
          <div className="flex justify-between items-start w-full mb-6 flex-shrink-0 relative z-50">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                {appLanguage === "pl" ? "Wizytówka" : "Business Card"}{" "}
                <span className="text-[#E2B859]">
                  {appLanguage === "pl" ? "Pielgrzyma" : "Pilgrim"}
                </span>
              </h2>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                Christian Identity Engine v{APP_VERSION}
              </p>
            </div>
            <div className="flex flex-row items-start gap-2 relative">
              {onOpenZbyszekGieron && (
                <button
                  onClick={() => {
                    nativeService.hapticImpact(ImpactStyle.Light);
                    onClose();
                    onOpenZbyszekGieron();
                  }}
                  className="w-12 h-12 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md rounded-full text-[#E2B859] shadow-lg hover:bg-zinc-800 transition-all border border-[#E2B859]/30 active:scale-90 cursor-pointer overflow-hidden p-0"
                  title="Wizytówka Zbyszka Gieronia"
                >
                  <EditableImage
                    storageKey="userpanel_zbyszek_shortcut"
                    defaultSrc="/ZbyszekGieronNajnowszy.jpg"
                    alt="Zbyszek"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              )}
              {onOpenBusinessCard && (
                <button
                  onClick={() => {
                    nativeService.hapticImpact(ImpactStyle.Light);
                    onClose();
                    onOpenBusinessCard();
                  }}
                  className="w-12 h-12 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md rounded-full text-[#E2B859] shadow-lg hover:bg-zinc-800 transition-all border border-[#E2B859]/30 active:scale-90 cursor-pointer overflow-hidden p-0"
                  title="Wizytówka Twórcy CC"
                >
                  <EditableImage
                    storageKey="userpanel_cclogo_shortcut"
                    defaultSrc={CENTRUM_LOGO_URL}
                    alt="CC Logo"
                    className="w-full h-full object-cover"
                  />
                </button>
              )}
              <div className="flex flex-col items-center gap-2 relative">
                <button
                  aria-label="Ulubione"
                  onClick={() => {
                    nativeService.hapticImpact(ImpactStyle.Light);
                    onClose();
                  }}
                  className="p-3 bg-zinc-900/80 backdrop-blur-md rounded-full text-zinc-500 shadow-lg hover:bg-zinc-800 transition-all hover:text-[#E2B859] active:scale-90 border border-zinc-800 cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative flex items-center justify-center">
                  <AnimatePresence>
                    {isActionMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                        className="absolute right-full mr-3 flex flex-row items-center gap-2"
                      >
                        <button
                          aria-label="Dashboard i kalendarz"
                          onClick={() => {
                            nativeService.hapticImpact(ImpactStyle.Medium);
                            onClose();
                            onOpenDashboard();
                          }}
                          className="w-[48px] h-[48px] flex items-center justify-center bg-zinc-900/80 backdrop-blur-md rounded-full text-[#E2B859] shadow-lg hover:bg-[#E2B859] hover:text-black transition-all active:scale-90 border border-[#E2B859]/30"
                          title={
                            appLanguage === "pl"
                              ? "DASHBOARD / KALENDARZ"
                              : "DASHBOARD / CALENDAR"
                          }
                        >
                          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                        </button>

                        <button
                          aria-label="Moje pliki"
                          onClick={() => {
                            nativeService.hapticImpact(ImpactStyle.Medium);
                            onClose();
                            mediaPlayerService.openMyFiles();
                          }}
                          className="w-[48px] h-[48px] flex items-center justify-center bg-zinc-900/80 backdrop-blur-md rounded-full text-[#E2B859] shadow-lg hover:bg-[#E2B859] hover:text-black transition-all active:scale-90 border border-[#E2B859]/30"
                          title={
                            appLanguage === "pl" ? "MOJE PLIKI" : "MY FILES"
                          }
                        >
                          <FolderOpen className="w-5 h-5 flex-shrink-0" />
                        </button>

                        <div className="relative">
                          <button
                            aria-label="Informacje o tle"
                            onClick={() => {
                              nativeService.hapticImpact(ImpactStyle.Light);
                              setShowBackgroundInfo(!showBackgroundInfo);
                            }}
                            className={`w-[48px] h-[48px] flex items-center justify-center backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90 border ${showBackgroundInfo ? "bg-[#E2B859] text-black border-[#E2B859]" : "bg-zinc-900/80 text-zinc-500 border-zinc-800 hover:text-[#E2B859]"}`}
                          >
                            <Plus className="w-6 h-6 flex-shrink-0" />
                          </button>

                          <AnimatePresence>
                            {showBackgroundInfo && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-4xl z-[100]"
                              >
                                <div className="space-y-4 relative">
                                  <div className="absolute -top-[21px] left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900/95 border-t border-l border-white/10 rotate-45"></div>

                                  <div className="space-y-2 relative z-10">
                                    <div>
                                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">
                                        {appLanguage === "pl"
                                          ? "TŁO PROFILOWE"
                                          : "PROFILE BACKGROUND"}
                                      </p>
                                      <p className="text-[9px] font-bold text-white uppercase tracking-tighter">
                                        1200 x 600 PX •{" "}
                                        <span className="text-[#E2B859]">
                                          MAX 1MB
                                        </span>
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        fileInputRef.current?.click();
                                        setShowBackgroundInfo(false);
                                      }}
                                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[8px] uppercase tracking-widest rounded-lg transition-colors"
                                    >
                                      {appLanguage === "pl"
                                        ? "Zmień Tło"
                                        : "Change Background"}
                                    </button>
                                  </div>

                                  <div className="h-px w-full bg-white/10 relative z-10" />

                                  <div className="space-y-2 relative z-10">
                                    <div>
                                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">
                                        {appLanguage === "pl"
                                          ? "WŁASNE MATERIAŁY"
                                          : "OWN MATERIALS"}
                                      </p>
                                      <p className="text-[9px] font-bold text-white uppercase tracking-tighter">
                                        MP3, MP4, PDF •{" "}
                                        <span className="text-[#E2B859]">
                                          OPFS BANK
                                        </span>
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        materialFileInputRef.current?.click();
                                        setShowBackgroundInfo(false);
                                      }}
                                      className="w-full py-2 bg-[#E2B859]/10 hover:bg-[#E2B859]/20 border border-[#E2B859]/30 text-[#E2B859] font-black text-[8px] uppercase tracking-widest rounded-lg transition-colors"
                                    >
                                      {appLanguage === "pl"
                                        ? "Wgraj Plik"
                                        : "Upload File"}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    aria-label="Więcej opcji"
                    onClick={() => {
                      nativeService.hapticImpact(ImpactStyle.Light);
                      setIsActionMenuOpen(!isActionMenuOpen);
                    }}
                    className={`w-[48px] h-[48px] flex flex-shrink-0 items-center justify-center backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90 border ${isActionMenuOpen ? "bg-zinc-800 text-white border-white/20" : "bg-zinc-900/80 text-zinc-500 border-zinc-800 hover:text-white"}`}
                  >
                    <MoreVertical className="w-6 h-6 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4 relative z-10 flex-grow">
            <div className="relative mb-6 flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#E2B859]/20 rounded-[3rem] blur-2xl animate-pulse"></div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key="active-user-avatar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-32 h-32 rounded-[2.5rem] border-4 border-[#E2B859] overflow-hidden shadow-2xl relative z-10"
                  >
                    {activePersona.avatarUrls &&
                    activePersona.avatarUrls.length > 0 ? (
                      <img
                        src={
                          activePersona.avatarUrls[currentAvatarIndex] ||
                          "/ROGOWSKI.jpg"
                        }
                        alt={activePersona.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/ROGOWSKI.jpg";
                        }}
                      />
                    ) : (
                      <img
                        src={activePersona.profilePicture || "/ROGOWSKI.jpg"}
                        alt={activePersona.name || "Rogowski"}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/ROGOWSKI.jpg";
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {activePersona.assignedMentor && (
                  <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full border-4 border-zinc-950 overflow-hidden shadow-xl animate-bounce-slow z-20">
                    <img
                      src={
                        activePersona.assignedMentor === "Miriam"
                          ? MIRIAM_AVATAR_URL
                          : JESZUA_AVATAR_URL
                      }
                      className="w-full h-full object-cover"
                      alt="Mentor"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center space-y-4 mb-8 w-full px-4">
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter flex items-center justify-center gap-2 text-center">
                    {activePersona.name ||
                      (appLanguage === "pl" ? "Pielgrzym" : "Pilgrim")}
                    {isGoogleUser && (
                      <div className="relative group/verified">
                        <ShieldCheck
                          className={`w-7 h-7 sm:w-8 h-8 ${auth.currentUser?.emailVerified ? "text-blue-400" : "text-[#E2B859]"} animate-pulse`}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[8px] font-black text-white uppercase tracking-widest rounded opacity-0 group-hover/verified:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-[100]">
                          {auth.currentUser?.emailVerified
                            ? appLanguage === "pl"
                              ? "Weryfikacja Google"
                              : "Google Verified"
                            : appLanguage === "pl"
                              ? "Zalogowano przez Google"
                              : "Google Logged In"}
                        </div>
                      </div>
                    )}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#E2B859] font-black uppercase tracking-[0.3em] px-4 py-1 bg-[#E2B859]/10 border border-[#E2B859]/20 rounded-full inline-block">
                {activePersona.personalStatus ||
                  (appLanguage === "pl"
                    ? "Cyfrowy Świadek Chrystusa"
                    : "Digital Witness of Christ")}
              </p>

              {activePersona.bio && (
                <div className="max-w-xs mx-auto mt-4 p-4 bg-zinc-900/40 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-[11px] text-zinc-300 font-medium leading-relaxed italic">
                    "{fixOrphans(activePersona.bio)}"
                  </p>
                </div>
              )}

              {activePersona.socialLinks &&
                Object.values(activePersona.socialLinks).some((v) => !!v) && (
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {(
                      [
                        "spotify",
                        "youtube",
                        "facebook",
                        "instagram",
                        "tiktok",
                        "whatsapp",
                        "messenger",
                      ] as const
                    ).map((platform) => {
                      const link = activePersona.socialLinks?.[platform];
                      if (!link) return null;

                      const Icon =
                        platform === "youtube"
                          ? Youtube
                          : platform === "facebook"
                            ? Facebook
                            : platform === "instagram"
                              ? Instagram
                              : SocialIcons[
                                  platform as keyof typeof SocialIcons
                                ];

                      return (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#E2B859] hover:border-[#E2B859]/50 transition-all active:scale-90 shadow-lg"
                          title={
                            platform.charAt(0).toUpperCase() + platform.slice(1)
                          }
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                )}

              {/* Christian Identity Engine: Widgets */}
              <div className="w-full mt-8 px-4 sm:px-0">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                    Moduły Tożsamości
                  </p>
                  {isSelf && (
                    <button
                      onClick={() => setIsAddWidgetModalOpen(true)}
                      className="p-2 bg-[#E2B859]/10 text-[#E2B859] rounded-lg border border-[#E2B859]/30 hover:bg-[#E2B859] hover:text-black transition-all active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {activePersona.widgets && activePersona.widgets.length > 0 ? (
                  <ResponsiveGridLayout
                    className="layout"
                    layouts={{
                      lg: activePersona.widgets.map((w) => ({
                        i: w.id,
                        x: w.layout?.x || 0,
                        y: w.layout?.y || 0,
                        w: w.layout?.w || 2,
                        h: w.layout?.h || 1,
                      })),
                      md: activePersona.widgets.map((w) => ({
                        i: w.id,
                        x: w.layout?.x || 0,
                        y: w.layout?.y || 0,
                        w: w.layout?.w || 2,
                        h: w.layout?.h || 1,
                      })),
                      sm: activePersona.widgets.map((w) => ({
                        i: w.id,
                        x: 0,
                        y: w.layout?.y || 0,
                        w: 2,
                        h: w.layout?.h || 1,
                      })),
                      xs: activePersona.widgets.map((w) => ({
                        i: w.id,
                        x: 0,
                        y: w.layout?.y || 0,
                        w: 2,
                        h: w.layout?.h || 1,
                      })),
                    }}
                    breakpoints={{
                      lg: 1200,
                      md: 996,
                      sm: 768,
                      xs: 480,
                      xxs: 0,
                    }}
                    cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 }}
                    rowHeight={80}
                    draggableHandle=".cursor-grab"
                    isDraggable={isSelf}
                    isResizable={false}
                    onLayoutChange={(layout) => handleLayoutChange(layout)}
                    margin={[12, 12]}
                  >
                    {activePersona.widgets.map((widget) => (
                      <div key={widget.id}>
                        <WidgetTile
                          widget={widget}
                          isOwner={isSelf}
                          onDelete={handleDeleteWidget}
                          dragHandleProps={{ className: "cursor-grab" }}
                        />
                      </div>
                    ))}
                  </ResponsiveGridLayout>
                ) : (
                  isSelf && (
                    <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center gap-4 bg-white/[0.02]">
                      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                        <LayoutDashboard className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                        Twój panel jest pusty. Dodaj pierwszy widget, by
                        spersonalizować swoją wizytówkę.
                      </p>
                      <button
                        onClick={() => setIsAddWidgetModalOpen(true)}
                        className="px-6 py-2.5 bg-zinc-900 text-zinc-400 font-black text-[10px] uppercase tracking-widest rounded-xl border border-white/10 hover:border-[#E2B859]/50 hover:text-[#E2B859] transition-all"
                      >
                        Kliknij tutaj (+)
                      </button>
                    </div>
                  )
                )}
              </div>

              {activePersona.embedCodes &&
                activePersona.embedCodes
                  .filter((c) => c.trim() !== "")
                  .map((code, index) => (
                    <div
                      key={index}
                      className="mt-6 w-full max-w-xs mx-auto overflow-hidden rounded-2xl border border-white/5 shadow-2xl bg-black/20"
                    >
                      <div
                        className="w-full flex justify-center items-center [&>iframe]:!w-full [&>iframe]:!max-w-full [&>iframe]:!border-0"
                        dangerouslySetInnerHTML={{ __html: code }}
                      />
                    </div>
                  ))}
              {/* Posts Section Removed */}
            </div>

            {isSelf &&
              (userPersona.role === "admin" ||
                auth.currentUser?.email === "nazirczarkes@gmail.com" ||
                auth.currentUser?.uid === "u5SeqT54FcNocFcXjiRcKowjHqC2" ||
                auth.currentUser?.uid === "J4AQs5wSpaWsSjtj04JLqCHPIeg1") && (
                <div className="w-full max-w-xs mb-8 p-1 bg-gradient-to-br from-[#E2B859] via-[#8B7344] to-[#C5A059] rounded-3xl shadow-[0_0_30px_rgba(226,184,89,0.3)]">
                  <div className="bg-zinc-950 rounded-[1.4rem] p-5">
                    <div className="flex flex-col items-center justify-center mb-4">
                      <h3 className="text-[#E2B859] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        ⚜️ PANEL ZARZĄDZANIA CC ⚜️
                      </h3>
                      <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#E2B859] to-transparent mt-2"></div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          // We will add the modal open trigger here
                          const event = new CustomEvent(
                            "cc_open_admin_post_modal",
                            {
                              detail: {
                                collectionName: "morning_inspirations",
                              },
                            },
                          );
                          window.dispatchEvent(event);
                        }}
                        className="w-full py-3 bg-[#E2B859]/10 border border-[#E2B859]/30 text-[#E2B859] font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#E2B859] hover:text-black transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> ➕ DODAJ NOWĄ POBUDKĘ
                      </button>

                      <button
                        onClick={() =>
                          addToast(
                            appLanguage === "pl"
                              ? "Statystyki analityczne wkrótce..."
                              : "Analytics soon...",
                            "info",
                          )
                        }
                        className="w-full py-3 bg-zinc-900 border border-white/10 text-zinc-300 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" /> 📊 STATYSTYKI
                      </button>

                      <button
                        onClick={() => onOpenManagement("admin")}
                        className="w-full py-3 bg-zinc-900 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-red-500" /> 👥
                        MODERACJA
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {isGoogleUser && (
              <div className="bg-zinc-900/40 p-5 rounded-[2rem] border border-[#E2B859]/20 w-full max-w-xs text-center mb-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E2B859]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#E2B859]" />
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                    Status Tożsamości
                  </p>
                </div>
                <p className="text-white font-black text-xs uppercase tracking-tight truncate px-2 mb-2">
                  {userPersona.googleEmail}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                      Zalogowany przez Google
                    </span>
                  </div>
                  {auth.currentUser?.emailVerified && (
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]" />
                      <span className="text-[8px] font-black text-[#3b82f6] uppercase tracking-widest">
                        Zweryfikowany przez Google
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePersona.joshuaSystem?.enabled && (
              <div className="mt-6 p-5 bg-[#E2B859]/10 border-2 border-[#E2B859]/40 rounded-[2.5rem] w-full max-w-xs relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 transition-opacity">
                  <span className="text-xl">🛡️</span>
                </div>
                <Separator text="SYSTEM JOSHUA ACTIVE" />
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-zinc-500">Tryb Dyscypliny:</span>
                    <span className="text-white bg-black px-2 py-0.5 rounded shadow-inner">
                      5.10.15
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                    <div className="w-[15%] h-full bg-gradient-to-r from-[#E2B859] to-[#B8860B] shadow-[0_0_15px_#E2B859] animate-pulse"></div>
                  </div>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest text-center mt-1">
                    Fundament Twojej Twierdzy
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 w-full max-w-xs mt-8">
              {isSelf ? (
                <>
                  <button
                    aria-label="Ulubione"
                    onClick={onOpenSupport}
                    className="w-full py-4 bg-gradient-to-r from-gold to-gold-dark text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-[#8B7344]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {appLanguage === "pl"
                      ? "WESPRZYJ DZIEŁO CC"
                      : "SUPPORT CC MISSION"}
                  </button>

                  <div className="p-5 bg-zinc-900 border border-[#E2B859]/20 rounded-3xl relative overflow-hidden group shadow-xl">
                    <Separator text="Patronat CC" className="mb-4" />
                    <div className="flex justify-center min-h-[60px] transform scale-105 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] rounded-xl p-2 shadow-inner border border-white/5">
                      {allowed ? (
                        <StripeBuyButton
                          title="Formularz bezpiecznej płatności Stripe - Patronat CC"
                          buy-button-id="buy_btn_1StrU77fVEX4acCUmubYefe2"
                          publishable-key="pk_live_51StVn37fVEX4acCU4e0JW4Zpc0WhogMeyeMwxd91VWDDp8sxWeuClHqdo76Vi5mdi9oprv4mk1JmJrSRaPAmxn6O00WLnDfOtR"
                          locale={appLanguage}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-600 py-2">
                          <p className="text-[10px] font-bold uppercase">
                            Dostępne na cclite.pl
                          </p>
                          <p className="text-[8px] opacity-40">
                            Stripe Domain Restriction
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  {targetUserID === "04ydViWW5RXLiEwZKqGO7dgRb8A2" && (
                    <button
                      onClick={handleAdminEntry}
                      className="w-full py-4 bg-zinc-900 border-2 border-red-900/40 text-red-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mb-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      {appLanguage === "pl"
                        ? "TRYB ADMINISTRATORA"
                        : "ADMIN MODE"}
                    </button>
                  )}
                  <button
                    aria-label="Profil"
                    onClick={handleFriendAction}
                    disabled={
                      relationshipStatus.status === "loading" ||
                      relationshipStatus.status === "friends" ||
                      relationshipStatus.status === "pending_sent"
                    }
                    className="w-full py-4 bg-gold text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <UserPlus className="w-5 h-5" />
                    {relationshipStatus.status === "loading"
                      ? "..."
                      : relationshipStatus.status === "friends"
                        ? appLanguage === "pl"
                          ? "ZNAJOMI"
                          : "FRIENDS"
                        : relationshipStatus.status === "pending_sent"
                          ? appLanguage === "pl"
                            ? "ZAPROSZENIE WYSŁANE"
                            : "REQUEST SENT"
                          : relationshipStatus.status === "pending_received"
                            ? appLanguage === "pl"
                              ? "AKCEPTUJ ZAPROSZENIE"
                              : "ACCEPT REQUEST"
                            : appLanguage === "pl"
                              ? "DODAJ DO ZNAJOMYCH"
                              : "ADD FRIEND"}
                  </button>
                  <button
                    aria-label="Wiadomości"
                    onClick={() => targetUserID && onOpenChat(targetUserID)}
                    className="w-full py-4 bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {appLanguage === "pl" ? "WYŚLIJ WIADOMOŚĆ" : "SEND MESSAGE"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-col items-center gap-4 w-full relative z-10 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3 w-full mb-2">
              <button
                onClick={onEditProfile}
                className="py-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-zinc-800 hover:text-[#E2B859]"
              >
                <Edit3 className="w-4 h-4" />
                <div className="leading-none">
                  {appLanguage === "pl" ? "EDYTUJ" : "EDIT"}
                </div>
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSyncing}
                className="py-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-[#E2B859] font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-zinc-800"
              >
                <ShieldCheck className="w-4 h-4" />
                <div className="leading-none">
                  {appLanguage === "pl" ? "ZAPISZ" : "SAVE"}
                </div>
              </button>
              <button
                aria-label="Udostępnij"
                onClick={handleShareInvite}
                disabled={isSharing}
                className={`py-4 border font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${isSharing ? "bg-gold-dark text-white animate-pulse border-gold-dark" : "bg-gold-dark text-white border-gold-dark hover:scale-105 active:scale-95 hover:bg-gold"}`}
              >
                <Share2 className="w-4 h-4" />
                <div className="leading-none">
                  {appLanguage === "pl" ? "ZAPROŚ" : "INVITE"}
                </div>
              </button>
              <button
                aria-label="Udostępnij"
                onClick={handleShareProfile}
                className="col-span-2 py-4 border border-[#C5A059]/30 bg-zinc-900 text-[#C5A059] font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:bg-[#C5A059]/10"
              >
                <Share2 className="w-4 h-4" />
                <div className="leading-none">
                  {appLanguage === "pl" ? "WIZYTÓWKA" : "PROFILE"}
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenRadioMode();
              }}
              className="w-full py-5 bg-gold-dark text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Radio className="w-6 h-6" />
              {appLanguage === "pl" ? "POWRÓT DO RADIA" : "BACK TO RADIO"}
            </button>

            <div className="mb-4 w-full">
              <div className="bg-zinc-900/50 border border-[#C5A059]/20 p-4 rounded-xl text-center shadow-lg">
                <h4 className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-2">
                  {appLanguage === "pl" ? "Złota Przestrzeń" : "Golden Space"}
                </h4>
                <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight mb-2">
                  {appLanguage === "pl"
                    ? "W TYM MIEJSCU MOŻESZ PROMOWAĆ SWOJE CHRZEŚCIJAŃSKIE INICJATYWY"
                    : "YOU CAN PROMOTE YOUR CHRISTIAN INITIATIVES HERE"}
                </p>
                <a
                  href="mailto:polskiercctv@gmail.com"
                  className="text-[9px] font-bold text-blue-400 hover:text-blue-300 uppercase underline tracking-widest block"
                >
                  polskiercctv@gmail.com
                </a>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-4 bg-red-900/10 text-red-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-900/20 transition-all active:scale-95 border border-red-500/20 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {appLanguage === "pl" ? "WYLOGUJ" : "LOGOUT"}
            </button>

            <button
              aria-label="Zamknij"
              onClick={() => {
                nativeService.hapticImpact(ImpactStyle.Light);
                onClose();
              }}
              className="w-full py-4 mt-2 bg-zinc-900 text-zinc-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 hover:text-white transition-all active:scale-95 border border-zinc-800 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {appLanguage === "pl" ? "ZAMKNIJ PROFIL" : "CLOSE PROFILE"}
            </button>
          </div>
        </div>

        <AddWidgetModal
          isOpen={isAddWidgetModalOpen}
          onClose={() => setIsAddWidgetModalOpen(false)}
          onAdd={handleAddWidget}
          isTickerExpanded={isTickerExpanded}
        />
      </div>
    </div>
  );
};
