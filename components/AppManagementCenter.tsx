import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Separator } from "./Separator";
import {
  UserPersona,
  RadioAlarm,
  ToastMessage,
  fixOrphans,
  DAY_NAMES_PL,
  DAY_NAMES_EN,
  APP_VERSION,
  ManagementTab,
  NotificationSettings,
  SMS_SUB_NUMBER,
  HOTLINE_NADZIEJA_NUMBER,
  COACH_HOLISTYCZNY_URL,
  STUDIO_DOBREGO_SLOWA_URL,
  getLocalDateString,
  RadioStreamType,
  SystemNotification,
  RADIO_EMAIL,
  CCTV_EMAIL,
  POLSKIE_RADIO_CC_URL,
  CCLITE_PL_URL,
  PAWEL_COACH_NUMBER,
  MARIUSZ_PRIEST_NUMBER,
  CHRISTIAN_DATING_APP_URL,
  SupportedLanguage,
} from "../types";
import { useAppStore } from "../useAppStore";
import { UserPersonaSelector } from "./UserPersonaSelector";
import { AdminPostsManager } from "./AdminPostsManager";
import { PersistenceService } from "../services/persistenceService";
import { googleCalendarService } from "../services/googleCalendarService";
import { PrivacyComplianceModal } from "./PrivacyComplianceModal";
import { nativeService } from "../services/nativeService";
import { ImpactStyle } from "@capacitor/haptics";
import {
  auth,
  db,
  storage,
  handleFirestoreError,
  OperationType,
} from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LoginScreen } from "./LoginScreen";
import { Capacitor } from "@capacitor/core";
import { NativeSettings, AndroidSettings } from "capacitor-native-settings";
import { Bell, Trash2, Radio, Globe, BookOpen, Save } from "lucide-react";

interface AppManagementCenterProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ManagementTab;
  userPersona: UserPersona;
  onUpdateUserPersona: (persona: UserPersona) => void;
  radioAlarm: RadioAlarm | null;
  onUpdateRadioAlarm: (alarm: RadioAlarm) => void;
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenRadioMode: () => void;
  isProKeyActive: boolean;
  onSetProKeyActive: (active: boolean) => void;
  onHardRefresh?: () => void;
  installStatus?: "install" | "installed" | "update";
  onInstallApp?: () => void;
  isGoogleCalendarConnected: boolean;
  googleCalendarId?: string;
  onGoogleLoginFromManagement: (personaData: {
    name: string;
    email: string;
    picture?: string;
  }) => void;
  systemNotifications?: SystemNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onClearNotifications?: () => void;
  isLandscape?: boolean;
  onToggleFavorite?: (item: any) => void;
  isTickerExpanded?: boolean;
  activeStream?: "PL" | "GLOBAL" | "BIBLIA";
  isAdminMode?: boolean;
}

const processImageTo1080SquareBlob = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 500;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Could not get canvas context");

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Canvas toBlob failed");
          },
          "image/jpeg",
          0.6,
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const AppManagementCenter: React.FC<AppManagementCenterProps> = ({
  isOpen,
  onClose,
  initialTab = "profile",
  userPersona,
  onUpdateUserPersona,
  radioAlarm,
  onUpdateRadioAlarm,
  appLanguage,
  addToast,
  onLanguageChange,
  onOpenRadioMode,
  isProKeyActive,
  onSetProKeyActive,
  onHardRefresh,
  installStatus = "install",
  onInstallApp,
  isGoogleCalendarConnected,
  googleCalendarId,
  onGoogleLoginFromManagement,
  systemNotifications = [],
  onMarkNotificationRead,
  onClearNotifications,
  isLandscape = false,
  onToggleFavorite,
  isTickerExpanded = false,
  activeStream,
  isAdminMode = false,
}) => {
  const dynamicDB = useAppStore((state) => state.dynamicDB);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ManagementTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() =>
    PersistenceService.loadNotificationSettings(),
  );
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTabsExpanded, setIsTabsExpanded] = useState(false);

  // Broadcast states
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTriggeringMotivation, setIsTriggeringMotivation] = useState(false);

  // Morning Inspirations states
  const [miTitle, setMiTitle] = useState("");
  const [miContent, setMiContent] = useState("");
  const [miImageFile, setMiImageFile] = useState<File | null>(null);
  const [isPublishingMi, setIsPublishingMi] = useState(false);

  // Christian Inspirations states
  const [ciTitle, setCiTitle] = useState("");
  const [ciContent, setCiContent] = useState("");
  const [ciImageFile, setCiImageFile] = useState<File | null>(null);
  const [isPublishingCi, setIsPublishingCi] = useState(false);

  const handlePublishChristianInspiration = async () => {
    if (!ciTitle || !ciContent) {
      addToast(
        appLanguage === "pl"
          ? "Tytuł i treść są wymagane!"
          : "Title and content required!",
        "alert",
      );
      return;
    }
    if (!adminPin) {
      addToast(
        appLanguage === "pl" ? "PIN jest wymagany!" : "PIN is required!",
        "alert",
      );
      return;
    }

    setIsPublishingCi(true);
    try {
      if (!auth.currentUser) throw new Error("Not authenticated");

      let imageUrl = null;
      if (ciImageFile) {
        try {
          const squareBlob = await processImageTo1080SquareBlob(ciImageFile);
          if (storage) {
            try {
              const fileExt = "jpg";
              const fileName = `inspirations_images/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
              const storageRef = ref(storage, fileName);
              await uploadBytes(storageRef, squareBlob);
              imageUrl = await getDownloadURL(storageRef);
            } catch (err) {
              console.warn("Storage exception, falling back to base64", err);
              imageUrl = await blobToBase64(squareBlob);
            }
          } else {
            imageUrl = await blobToBase64(squareBlob);
          }
        } catch (err) {
          console.error(err);
          addToast("Błąd przetwarzania zdjęcia.", "alert");
          setIsPublishingCi(false);
          return;
        }
      }

      const postData: any = {
        title: ciTitle,
        content: ciContent,
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || userPersona.name || "Admin",
        aspectRatio: "1:1",
        timestamp: serverTimestamp(),
        status: "published",
        smsSent: false,
        pushSent: false,
      };

      if (imageUrl) {
        postData.imageUrl = imageUrl;
      }

      const docRef = await addDoc(
        collection(db, "christianInspirations"),
        postData,
      );

      try {
        await fetch("/api/admin/notify-christian-inspiration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `🕊️ ${ciTitle}`,
            body:
              appLanguage === "pl"
                ? "Nowa Chrześcijańska Inspiracja"
                : "New Christian Inspiration available.",
            inspirationId: docRef.id,
            pin: adminPin,
          }),
        });
      } catch (err) {
        console.warn(
          "Wysyłanie powiadomienia lub SMS nie powiodło się, ale post został zapisany.",
          err,
        );
      }

      addToast(
        appLanguage === "pl"
          ? "Chrześcijańska Inspiracja opublikowana!"
          : "Christian Inspiration published!",
        "success",
      );
      setCiTitle("");
      setCiContent("");
      setCiImageFile(null);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      addToast(
        appLanguage === "pl"
          ? `Błąd publikacji: ${errMsg}`
          : `Publish error: ${errMsg}`,
        "alert",
      );
      handleFirestoreError(
        error,
        OperationType.CREATE,
        "christianInspirations",
      );
    } finally {
      setIsPublishingCi(false);
    }
  };

  const handlePublishMorningInspiration = async () => {
    if (!miTitle || !miContent) {
      addToast(
        appLanguage === "pl"
          ? "Tytuł i treść są wymagane!"
          : "Title and content required!",
        "alert",
      );
      return;
    }
    if (!adminPin) {
      addToast(
        appLanguage === "pl" ? "PIN jest wymagany!" : "PIN is required!",
        "alert",
      );
      return;
    }

    setIsPublishingMi(true);
    try {
      if (!auth.currentUser) throw new Error("Not authenticated");

      let imageUrl = null;
      if (miImageFile) {
        try {
          const squareBlob = await processImageTo1080SquareBlob(miImageFile);
          if (storage) {
            try {
              const fileExt = "jpg";
              const fileName = `post_images/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
              const storageRef = ref(storage, fileName);
              await uploadBytes(storageRef, squareBlob);
              imageUrl = await getDownloadURL(storageRef);
            } catch (err) {
              console.warn("Storage exception, falling back to base64", err);
              imageUrl = await blobToBase64(squareBlob);
            }
          } else {
            imageUrl = await blobToBase64(squareBlob);
          }
        } catch (err) {
          console.error(err);
          addToast("Błąd przetwarzania zdjęcia.", "alert");
          setIsPublishingMi(false);
          return;
        }
      }

      const postData: any = {
        title: miTitle,
        content: miContent,
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || userPersona.name || "Admin",
        aspectRatio: "1:1",
        timestamp: serverTimestamp(),
        commentsCount: 0,
        sharesCount: 0,
      };

      if (imageUrl) {
        postData.imageUrl = imageUrl;
      }

      const docRef = await addDoc(
        collection(db, "morning_inspirations"),
        postData,
      );

      try {
        await fetch("/api/admin/notify-morning-inspiration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `🌅 ${miTitle}`,
            body:
              appLanguage === "pl"
                ? "Nowa Pobudka Poranna, otwórz by zgłębić Słowo."
                : "New Morning Inspiration available.",
            postId: docRef.id,
            pin: adminPin,
          }),
        });
      } catch (err) {
        console.warn(
          "Wysyłanie powiadomienia nie powiodło się, ale post został zapisany.",
          err,
        );
      }

      addToast(
        appLanguage === "pl"
          ? "Pobudka Poranna opublikowana!"
          : "Morning Inspiration published!",
        "success",
      );
      setMiTitle("");
      setMiContent("");
      setMiImageFile(null);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      addToast(
        appLanguage === "pl"
          ? `Błąd publikacji: ${errMsg}`
          : `Publish error: ${errMsg}`,
        "alert",
      );
      handleFirestoreError(error, OperationType.CREATE, "morning_inspirations");
    } finally {
      setIsPublishingMi(false);
    }
  };

  const isAdmin =
    isAdminMode ||
    userPersona.googleEmail === "nazirczarkes@gmail.com" ||
    auth.currentUser?.uid === "u5SeqT54FcNocFcXjiRcKowjHqC2" ||
    auth.currentUser?.uid === "J4AQs5wSpaWsSjtj04JLqCHPIeg1";

  const handleBroadcast = async () => {
    if (!broadcastTitle || !broadcastMsg || !adminPin) {
      addToast(
        appLanguage === "pl" ? "Wypełnij wszystkie pola!" : "Fill all fields!",
        "alert",
      );
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle,
          body: broadcastMsg,
          pin: adminPin,
        }),
      });

      const data = await response.json();
      if (data.success) {
        addToast(
          appLanguage === "pl"
            ? "Globalne Wołanie wysłane pomyślnie!"
            : "Global Call sent successfully!",
          "success",
        );
        setBroadcastTitle("");
        setBroadcastMsg("");
        setAdminPin("");
      } else {
        const errMsg = data.error || "Wewnętrzny błąd serwera";
        if (errMsg.includes("credential")) {
          addToast(
            appLanguage === "pl"
              ? `Błąd Push: Brak kluczy admina w Secrets na serwerze! Skonfiguruj FIREBASE_PRIVATE_KEY`
              : `Push Error: Missing admin keys in Secrets`,
            "alert",
          );
        } else {
          addToast(
            appLanguage === "pl"
              ? `Błąd Push: ${errMsg}`
              : `Push Error: ${errMsg}`,
            "alert",
          );
        }
      }
    } catch (err: any) {
      addToast(err.message || "Failed to connect to server", "alert");
    } finally {
      setIsSending(false);
    }
  };

  const handleManualMotivation = async () => {
    if (!adminPin) {
      addToast(appLanguage === "pl" ? "Podaj PIN!" : "Enter PIN!", "alert");
      return;
    }
    setIsTriggeringMotivation(true);
    try {
      const res = await fetch("/api/admin/trigger-motivation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPin }),
      });
      if (res.ok) {
        addToast(
          appLanguage === "pl"
            ? "Motywacja wysłana pomyślnie!"
            : "Motivation sent successfully!",
          "success",
        );
      } else {
        addToast("Error triggering motivation", "alert");
      }
    } catch (err) {
      addToast("Connection error", "alert");
    } finally {
      setIsTriggeringMotivation(false);
    }
  };

  const [alarmTime, setAlarmTime] = useState(radioAlarm?.time || "07:00");
  const [alarmDays, setAlarmDays] = useState<number[]>(
    radioAlarm?.selectedDays || [0, 1, 2, 3, 4, 5, 6],
  );
  const [alarmStream, setAlarmStream] = useState<RadioStreamType>(
    radioAlarm?.stream || "PL",
  );
  const [alarmFade, setAlarmFade] = useState(radioAlarm?.fadeInEnabled ?? true);

  // Cloud tab states
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gapiSignedIn, setGapiSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(
    userPersona.googleEmail,
  );
  const [geminiKeys, setGeminiKeys] = useState<string[]>(() => {
    const saved = PersistenceService.loadGeminiApiKey();
    try {
      return saved ? JSON.parse(saved) : [""];
    } catch {
      return saved ? [saved] : [""];
    }
  });
  const [showGeminiKeys, setShowGeminiKeys] = useState<boolean[]>([]);
  const [isKeyValidating, setIsKeyValidating] = useState(false);

  // Location & Weather states
  const [locationInput, setLocationInput] = useState(
    userPersona.location || "",
  );
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNotifSettings(PersistenceService.loadNotificationSettings());
      if (radioAlarm) {
        setAlarmTime(radioAlarm.time);
        setAlarmDays(radioAlarm.selectedDays || [0, 1, 2, 3, 4, 5, 6]);
        setAlarmStream(radioAlarm.stream);
        setAlarmFade(radioAlarm.fadeInEnabled);
      }
      // Sync location input when opening the panel
      setLocationInput(userPersona.location || "");

      // Mark all notifications as read when opening the notifications tab
      if (initialTab === "notifications" || activeTab === "notifications") {
        systemNotifications.forEach((n) => {
          if (!n.isRead) onMarkNotificationRead?.(n.id);
        });
      }
    }
  }, [
    isOpen,
    initialTab,
    radioAlarm,
    userPersona.location,
    activeTab,
    systemNotifications,
    onMarkNotificationRead,
  ]);

  // Also mark as read when switching to the notifications tab while the modal is already open
  useEffect(() => {
    if (isOpen && activeTab === "notifications") {
      systemNotifications.forEach((n) => {
        if (!n.isRead) onMarkNotificationRead?.(n.id);
      });
    }
  }, [activeTab, isOpen, systemNotifications, onMarkNotificationRead]);

  // Google Calendar Integration
  useEffect(() => {
    const checkGapi = async () => {
      if (window.gapi && window.gapi.client) {
        setGapiLoaded(true);
        try {
          // If the user has a custom client ID, re-initialize with it first
          if (userPersona.googleClientId) {
            await googleCalendarService.reinitClient(
              userPersona.googleClientId,
            );
          } else {
            await googleCalendarService.ensureClientReady();
          }

          const signedIn = googleCalendarService.isSignedIn();
          setGapiSignedIn(signedIn);
          if (signedIn) {
            const basicProfile = googleCalendarService[
              "authInstance"
            ].currentUser
              .get()
              .getBasicProfile();
            setUserEmail(basicProfile.getEmail());
            // Update userPersona if different
            if (userPersona.googleEmail !== basicProfile.getEmail()) {
              onUpdateUserPersona({
                ...userPersona,
                googleEmail: basicProfile.getEmail(),
                isGoogleCalendarConnected: true,
              });
            }
          } else {
            setUserEmail(undefined);
            onUpdateUserPersona({
              ...userPersona,
              googleEmail: null,
              isGoogleCalendarConnected: false,
            });
          }
        } catch (error) {
          console.error("GAPI client not ready on mount:", error);
          setGapiSignedIn(false);
          setUserEmail(undefined);
          onUpdateUserPersona({
            ...userPersona,
            googleEmail: null,
            isGoogleCalendarConnected: false,
          });
        }
      }
    };
    checkGapi();
  }, [userPersona, onUpdateUserPersona]);

  const handleGoogleSignIn = useCallback(async () => {
    addToast(
      appLanguage === "pl" ? "Łączę z Google..." : "Connecting to Google...",
      "info",
    );
    try {
      await googleCalendarService.signIn();
      const signedIn = googleCalendarService.isSignedIn();
      setGapiSignedIn(signedIn);
      if (signedIn) {
        const basicProfile = googleCalendarService["authInstance"].currentUser
          .get()
          .getBasicProfile();
        const email = basicProfile.getEmail();
        const name = basicProfile.getName();
        const picture = basicProfile.getImageUrl();
        setUserEmail(email);
        onGoogleLoginFromManagement({ name, email, picture });
        addToast(
          appLanguage === "pl"
            ? "Połączono z Kalendarzem Google!"
            : "Connected to Google Calendar!",
          "success",
        );
      } else {
        addToast(
          appLanguage === "pl"
            ? "Logowanie Google nieudane."
            : "Google login failed.",
          "info",
        );
      }
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      addToast(
        appLanguage === "pl" ? "Błąd logowania Google." : "Google login error.",
        "alert",
      );
    }
  }, [addToast, appLanguage, onGoogleLoginFromManagement]);

  const handleGoogleSignOut = useCallback(async () => {
    addToast(
      appLanguage === "pl"
        ? "Rozłączam z Google..."
        : "Disconnecting from Google...",
      "info",
    );
    try {
      await googleCalendarService.signOut();
      setGapiSignedIn(false);
      setUserEmail(undefined);
      onUpdateUserPersona({
        ...userPersona,
        googleEmail: null,
        isGoogleCalendarConnected: false,
        googleCalendarId: null,
      });
      addToast(
        appLanguage === "pl"
          ? "Rozłączono z Google."
          : "Disconnected from Google.",
        "success",
      );
    } catch (error) {
      console.error("Google Sign-Out failed:", error);
      addToast(
        appLanguage === "pl"
          ? "Błąd rozłączania Google."
          : "Google disconnect error.",
        "alert",
      );
    }
  }, [addToast, appLanguage, onUpdateUserPersona, userPersona]);

  useEffect(() => {
    setShowGeminiKeys(new Array(geminiKeys.length).fill(false));
  }, [geminiKeys.length]);

  const handleSaveGeminiKeys = async () => {
    // Filter out empty keys
    const validKeys = geminiKeys.filter((k) => k.trim() !== "");

    setIsKeyValidating(true);
    PersistenceService.saveGeminiApiKey(JSON.stringify(validKeys));

    setTimeout(() => {
      setIsKeyValidating(false);
      addToast(
        appLanguage === "pl"
          ? "Klucze Gemini zapisane pomyślnie!"
          : "Gemini keys saved successfully!",
        "success",
      );
    }, 800);
  };

  const handleSelectPlatformKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        addToast(
          appLanguage === "pl"
            ? "Otwarto wybór klucza systemowego."
            : "System key selection opened.",
          "info",
        );
      } catch (e) {
        console.error("Failed to open key selector", e);
      }
    }
  };

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      addToast(
        appLanguage === "pl"
          ? "Geolokalizacja nie jest obsługiwana."
          : "Geolocation not supported.",
        "info",
      );
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
        setLocationInput(coords);
        onUpdateUserPersona({
          ...userPersona,
          location: coords,
          geolocationConsent: true,
        });
        addToast(
          appLanguage === "pl" ? "Lokalizacja pobrana!" : "Location fetched!",
          "success",
        );
        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        onUpdateUserPersona({
          ...userPersona,
          location: undefined,
          geolocationConsent: false,
        });
        addToast(
          appLanguage === "pl"
            ? "Nie udało się pobrać lokalizacji."
            : "Failed to fetch location.",
          "info",
        );
        setLoadingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleLocationBlur = () => {
    if (locationInput.trim() !== userPersona.location) {
      onUpdateUserPersona({
        ...userPersona,
        location: locationInput.trim(),
        geolocationConsent: true,
      });
      addToast(
        appLanguage === "pl" ? "Lokalizacja zapisana." : "Location saved.",
        "success",
      );
    }
  };

  const handleUpdateAlarm = (updates: Partial<RadioAlarm>) => {
    const currentAlarm: RadioAlarm = radioAlarm || {
      id: "default",
      time: alarmTime,
      enabled: false,
      repeatDaily: true,
      selectedDays: alarmDays,
      stream: alarmStream,
      fadeInEnabled: alarmFade,
    };
    onUpdateRadioAlarm({ ...currentAlarm, ...updates });
  };

  const toggleAlarmDay = (dayIdx: number) => {
    const newDays = alarmDays.includes(dayIdx)
      ? alarmDays.filter((d) => d !== dayIdx)
      : [...alarmDays, dayIdx].sort((a, b) => a - b);
    setAlarmDays(newDays);
    handleUpdateAlarm({ selectedDays: newDays });
  };

  const handleNotificationSettingChange = useCallback(
    (key: keyof NotificationSettings, value: string | boolean) => {
      setNotifSettings((prev) => {
        const newSettings = { ...prev, [key]: value };
        // Jeśli użytkownik wyłącza powiadomienie, resetuj lastTriggerDate, aby mogło się ponownie włączyć po ponownym włączeniu
        if (key === "verseOfDayEnabled" && !value)
          newSettings.lastVerseTriggerDate = null;
        if (key === "dailyMiraclesEnabled" && !value)
          newSettings.lastMiracleTriggerDate = null;
        if (key === "supportRemindersEnabled" && !value)
          newSettings.lastSupportTriggerDate = null;
        if (key === "momentOfPeaceEnabled" && !value)
          newSettings.lastMomentOfPeaceTriggerDate = null;

        PersistenceService.saveNotificationSettings(newSettings);

        // Sync with Native Service if on native platform
        if (nativeService.isNative()) {
          const [hour, minute] = newSettings.verseOfDayTime
            .split(":")
            .map(Number);
          nativeService.scheduleCCNotifications({ hour, minute });
        }

        return newSettings;
      });
      addToast(
        appLanguage === "pl"
          ? "Ustawienia powiadomień zapisane!"
          : "Notifications updated!",
        "success",
      );
    },
    [addToast, appLanguage],
  );

  const toggleSmartStart = () => {
    const newState = !userPersona.smartStart;
    onUpdateUserPersona({ ...userPersona, smartStart: newState });
    addToast(
      newState
        ? appLanguage === "pl"
          ? "Tryb Inteligentny włączony! 🚀"
          : "Smart Mode enabled! 🚀"
        : appLanguage === "pl"
          ? "Tryb Inteligentny wyłączony."
          : "Smart Mode disabled.",
      "info",
    );
  };

  const toggleKeepScreenOn = () => {
    const newState = !userPersona.keepScreenOnWhileRadioPlaying;
    onUpdateUserPersona({
      ...userPersona,
      keepScreenOnWhileRadioPlaying: newState,
    });
    addToast(
      newState
        ? appLanguage === "pl"
          ? "Ekran będzie włączony podczas odtwarzania radia."
          : "Screen will stay on while radio plays."
        : appLanguage === "pl"
          ? "Ekran może się wyłączyć podczas odtwarzania radia."
          : "Screen may turn off while radio plays.",
      "info",
    );
  };

  const startScreensaver = () => {
    // Dyspozycja rozpoczęcia wygaszacza
    onClose();
    setTimeout(
      () => window.dispatchEvent(new CustomEvent("start-screensaver")),
      100,
    );
  };

  if (!isOpen) return null;

  const currentDayNames = appLanguage === "pl" ? DAY_NAMES_PL : DAY_NAMES_EN;

  const labels = {
    header:
      activeTab === "admin"
        ? appLanguage === "pl"
          ? "PANEL"
          : "COMMAND"
        : "MANAGEMENT",
    headerGold:
      activeTab === "admin"
        ? appLanguage === "pl"
          ? "DOWODZENIA"
          : "CENTER"
        : "CENTER",
    historyTitle: appLanguage === "pl" ? "HISTORIA" : "HISTORY",
    clearAll: appLanguage === "pl" ? "WYCZYŚĆ WSZYSTKO" : "CLEAR ALL",
    noNotifs:
      appLanguage === "pl" ? "BRAK NOWYCH POWIADOMIEŃ" : "NO NEW NOTIFICATIONS",
    newBadge: "NEW",
    returnBtn: appLanguage === "pl" ? "POWRÓT DO RADIA" : "RETURN TO RADIO",
    tabs: {
      profile: appLanguage === "pl" ? "PROFIL" : "PROFILE",
      notifications: appLanguage === "pl" ? "POWIADOMIENIA" : "NOTIFICATIONS",
      alarm: appLanguage === "pl" ? "BUDZIK" : "ALARM",
      preferences: appLanguage === "pl" ? "PREFERENCJE" : "PREFERENCES",
      cloud: appLanguage === "pl" ? "INTEGRACJE" : "INTEGRATIONS",
      contact: appLanguage === "pl" ? "KONTAKT" : "CONTACT",
      legal: appLanguage === "pl" ? "PRAWNE" : "LEGAL",
      system: appLanguage === "pl" ? "SYSTEM" : "SYSTEM",
      emergency: appLanguage === "pl" ? "INFOLINIA" : "HOTLINE",
      favorites: appLanguage === "pl" ? "ULUBIONE" : "FAVORITES",
      admin: appLanguage === "pl" ? "ADMIN" : "ADMIN",
      about: appLanguage === "pl" ? "O NAS" : "ABOUT",
    },
  };

  // Funkcja tłumacząca dynamicznie treść powiadomień systemowych w locie
  const translateNotification = (notif: SystemNotification) => {
    if (appLanguage === "pl") return notif;

    const translations: Record<string, { title: string; message: string }> = {
      welcome: {
        title: "WELCOME TO RADIO VERSION!",
        message: `Christian Culture RADIO v${APP_VERSION} is now active. Enjoy HI-RES radio and new glow effects.`,
      },
      "patronage-notice": {
        title: "BECOME A PATRON",
        message:
          "Become a patron of your favorite station - Radio Christian Culture Polska - Christian Culture Global - Biblia Audio Christian Culture. Support the mission regularly via PayPal.",
      },
      "auto-morning": {
        title: "DAILY WORD",
        message:
          "Your daily verse and sanctification planner are ready. Give the Lord the firstfruits of this morning.",
      },
      "auto-afternoon": {
        title: "SUPPORT CC MISSION",
        message:
          "Your support keeps our HI-RES radio running. Check new ways to help in the support panel.",
      },
      "auto-evening": {
        title: "GLOBAL CRY 21:00",
        message:
          "Join the evening community prayer. May this be a time of deep silence with the Lord.",
      },
    };

    let key = notif.id;
    if (key.startsWith("auto-morning")) key = "auto-morning";
    if (key.startsWith("auto-afternoon")) key = "auto-afternoon";
    if (key.startsWith("auto-evening")) key = "auto-evening";

    const t = translations[key];
    if (t) {
      return { ...notif, title: t.title, message: t.message };
    }
    return notif;
  };

  // Helper do renderowania wiadomości z klikalnymi nazwami stacji
  const renderMessageWithLinks = (message: string) => {
    const stations = [
      "Radio Christian Culture Polska",
      "Christian Culture Global",
      "Biblia Audio Christian Culture",
    ];
    const paypalUrl =
      "https://www.paypal.com/paypalme/CezaryRogowski?locale.x=pl_PL&country.x=PL";

    let parts: (string | React.ReactNode)[] = [message];

    stations.forEach((station) => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach((part) => {
        if (typeof part === "string") {
          const split = part.split(station);
          split.forEach((s, i) => {
            newParts.push(s);
            if (i < split.length - 1) {
              newParts.push(
                <a
                  key={`${station}-${i}`}
                  href={paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A059] font-black underline hover:text-[#E2B859] transition-colors inline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {station}
                </a>,
              );
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return <>{parts}</>;
  };

  return (
    <div
      className={`fixed inset-0 z-[3000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 animate-fade-in`}
      onClick={onClose}
    >
      <div
        className={`relative w-full h-full bg-zinc-950 border-0 shadow-none flex flex-col overflow-hidden pt-safe pb-safe`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section - Matches screenshot style */}
        <div
          className={`px-10 pt-12 pb-6 flex justify-between items-start flex-shrink-0`}
        >
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
              {labels.header}{" "}
              <span className="text-[#C5A059]">{labels.headerGold}</span>
            </h2>
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mt-2">
              v{APP_VERSION} • SOLI DEO GLORIA
            </p>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-zinc-900/80 text-zinc-400 hover:text-white rounded-full transition-all border border-zinc-800 shadow-xl active:scale-90 group"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs - Settings Dropdown / Grid */}
        <div className="px-6 sm:px-10 flex flex-col py-4 border-b border-white/5 flex-shrink-0">
          <button
            aria-label="Ulubione"
            onClick={() => setIsTabsExpanded(!isTabsExpanded)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 text-[#C5A059] font-black uppercase tracking-widest text-[11px] sm:text-xs transition-all hover:bg-zinc-800"
          >
            <span className="flex items-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {appLanguage === "pl" ? "USTAWIENIA APLIKACJI" : "APP SETTINGS"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isTabsExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isTabsExpanded && (
            <div className="mt-4 grid grid-rows-2 grid-flow-col auto-cols-max gap-2 sm:gap-3 overflow-x-auto no-scrollbar animate-fade-in pb-2">
              {(
                [
                  "profile",
                  "favorites",
                  "notifications",
                  "alarm",
                  "preferences",
                  "cloud",
                  "emergency",
                  "contact",
                  "legal",
                  "system",
                  "about",
                  ...(isAdmin ? ["admin"] : []),
                ] as ManagementTab[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsTabsExpanded(false);
                  }}
                  className={`px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all border whitespace-nowrap relative flex items-center gap-2 ${activeTab === tab ? "bg-gold-dark border-gold-dark text-white shadow-lg shadow-gold/20" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"}`}
                >
                  {(labels.tabs as any)[tab]}
                  {tab === "notifications" &&
                    systemNotifications.some((n) => !n.isRead) && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-black text-white shadow-[0_0_8px_#dc2626]">
                        {systemNotifications.filter((n) => !n.isRead).length}
                      </span>
                    )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-10 scrollbar-thin">
          {activeTab === "profile" && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-zinc-900/60 p-6 rounded-[2rem] border border-zinc-800 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] rounded-full pointer-events-none"></div>
                <h4 className="text-zinc-400 text-xs font-black uppercase tracking-widest relative z-10">
                  {appLanguage === "pl" ? "TRYB APLIKACJI" : "APP MODE"}
                </h4>
                <div className="flex gap-4 relative z-10">
                  <button
                    onClick={() => {
                      onUpdateUserPersona({
                        ...userPersona,
                        appMode: "standard",
                      });
                      addToast(
                        appLanguage === "pl"
                          ? "Zmieniono na Tryb Standardowy"
                          : "Switched to Standard Mode",
                        "success",
                      );
                    }}
                    className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${userPersona.appMode === "standard" ? "bg-gold-dark text-black shadow-lg shadow-gold/20" : "bg-black border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
                  >
                    {appLanguage === "pl" ? "Standardowy" : "Standard"}
                  </button>
                  <button
                    onClick={() => {
                      onUpdateUserPersona({ ...userPersona, appMode: "blind" });
                      addToast(
                        appLanguage === "pl"
                          ? "Zmieniono na Tryb Dla Niewidomych (Voice)"
                          : "Switched to Blind Mode (Voice)",
                        "success",
                      );
                    }}
                    className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${userPersona.appMode === "blind" ? "bg-gold-dark text-black shadow-lg shadow-gold/20" : "bg-black border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
                  >
                    {appLanguage === "pl" ? "Dla Niewidomych" : "Blind Assist"}
                  </button>
                </div>
              </div>

              <UserPersonaSelector
                userName={userPersona.name}
                userGender={userPersona.gender}
                userAvatar={userPersona.profilePicture}
                userBackground={userPersona.profileBackground}
                userPersonalStatus={userPersona.personalStatus}
                preferredLaunchMode={userPersona.preferredLaunchMode}
                userAgeGroup={userPersona.ageGroup}
                maritalStatus={userPersona.maritalStatus}
                spiritualStatus={userPersona.spiritualStatus}
                googleEmail={userPersona.googleEmail}
                isGoogleVerified={auth.currentUser?.emailVerified}
                bio={userPersona.bio}
                socialLinks={userPersona.socialLinks}
                embedCodes={userPersona.embedCodes}
                onSave={(fields) => {
                  onUpdateUserPersona({ ...userPersona, ...fields });
                  addToast(
                    appLanguage === "pl"
                      ? "Profil zaktualizowany!"
                      : "Profile updated!",
                    "success",
                  );
                }}
                addToast={addToast}
                appLanguage={appLanguage}
              />
            </div>
          )}

          {activeTab === "admin" && isAdmin && (
            <div className="animate-fade-in space-y-8 pb-10 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
              <div className="flex justify-between items-start mb-2 lg:col-span-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                  {appLanguage === "pl" ? "PANEL DOWODZENIA" : "COMMAND CENTER"}
                </h3>
              </div>

              <div className="bg-zinc-900/60 p-8 rounded-[2.5rem] border border-[#C5A059]/20 space-y-6 relative overflow-hidden lg:col-span-2">
                <h4 className="text-[#C5A059] font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-pulse"></span>
                  NADAJ KOMUNIKAT GŁÓWNY (GLOBAL PUSH)
                </h4>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Wpisz PIN autoryzacyjny..."
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full bg-black/60 border border-red-900/50 rounded-2xl px-6 py-4 text-sm text-white focus:border-red-500 outline-none transition-all placeholder:text-zinc-600 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Tytuł wiadomości PUSH..."
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium"
                  />
                  <textarea
                    placeholder="Treść powiadomienia wysyłana na wszystkie urządzenia..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    rows={3}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium resize-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleBroadcast}
                      disabled={isSending || !adminPin}
                      aria-label="Wyślij globalne wołanie"
                      className={`relative z-50 w-full py-5 ${isSending || !adminPin ? "bg-zinc-800" : "bg-red-600 hover:bg-red-700"} text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer`}
                    >
                      {isSending ? "WYSYŁANIE..." : "WYŚLIJ GLOBALNE WOŁANIE"}
                    </button>
                    <button
                      onClick={handleManualMotivation}
                      disabled={isTriggeringMotivation || !adminPin}
                      aria-label="Testuj powiadomienia Push"
                      className={`relative z-50 w-full py-5 ${isTriggeringMotivation || !adminPin ? "bg-zinc-800" : "bg-[#C5A059] hover:bg-[#E2B859]"} text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer`}
                    >
                      {isTriggeringMotivation
                        ? "WYSYŁANIE..."
                        : "TESTUJ PUSH / MOTYWACJA"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 p-8 rounded-[2.5rem] border border-[#C5A059]/20 space-y-6 relative overflow-hidden lg:col-span-1 md:col-span-1">
                <h4 className="text-[#C5A059] font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full"></span>
                  {appLanguage === "pl"
                    ? "Pobudki - Publikacja"
                    : "Morning Wakeups - Publisher"}
                </h4>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={
                      appLanguage === "pl" ? "Tytuł Pobudki..." : "Title..."
                    }
                    value={miTitle}
                    onChange={(e) => setMiTitle(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium"
                  />

                  <textarea
                    placeholder={
                      appLanguage === "pl"
                        ? "Treść inspiracji..."
                        : "Inspiration content..."
                    }
                    value={miContent}
                    onChange={(e) => setMiContent(e.target.value)}
                    rows={6}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium resize-none"
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-2">
                      {appLanguage === "pl"
                        ? "Zdjęcie (Opcjonalne)"
                        : "Image (Optional)"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setMiImageFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-zinc-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-800 file:text-[#C5A059] hover:file:bg-zinc-700"
                    />
                  </div>

                  {!adminPin && (
                    <p className="text-red-500 text-[10px] font-black tracking-widest uppercase pl-2">
                      {appLanguage === "pl" ? "Wymagany PIN autoryzacyjny (powyżej) 👆" : "Admin PIN required (above) 👆"}
                    </p>
                  )}

                  <button
                    onClick={handlePublishMorningInspiration}
                    disabled={isPublishingMi || !adminPin}
                    aria-label={
                      appLanguage === "pl"
                        ? "Opublikuj Pobudkę"
                        : "Publish Morning Inspiration"
                    }
                    className={`relative z-50 w-full py-5 ${isPublishingMi || !adminPin ? "bg-zinc-800" : "bg-[#C5A059]"} text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer`}
                  >
                    {isPublishingMi
                      ? appLanguage === "pl"
                        ? "PUBLIKOWANIE..."
                        : "PUBLISHING..."
                      : appLanguage === "pl"
                        ? "OPUBLIKUJ POBUDKĘ"
                        : "PUBLISH INSPIRATION"}
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900/60 p-8 rounded-[2.5rem] border border-[#C5A059]/20 space-y-6 relative overflow-hidden lg:col-span-1 md:col-span-1">
                <h4 className="text-[#C5A059] font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full"></span>
                  {appLanguage === "pl"
                    ? "Inspiracje - Publikacja"
                    : "Inspirations - Publisher"}
                </h4>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={
                      appLanguage === "pl" ? "Tytuł Inspiracji..." : "Title..."
                    }
                    value={ciTitle}
                    onChange={(e) => setCiTitle(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium"
                  />

                  <textarea
                    placeholder={
                      appLanguage === "pl"
                        ? "Treść inspiracji..."
                        : "Inspiration content..."
                    }
                    value={ciContent}
                    onChange={(e) => setCiContent(e.target.value)}
                    rows={6}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium resize-none"
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-2">
                      {appLanguage === "pl"
                        ? "Zdjęcie (Opcjonalne)"
                        : "Image (Optional)"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCiImageFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-zinc-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-800 file:text-[#C5A059] hover:file:bg-zinc-700"
                    />
                  </div>

                  {!adminPin && (
                    <p className="text-red-500 text-[10px] font-black tracking-widest uppercase pl-2">
                      {appLanguage === "pl" ? "Wymagany PIN autoryzacyjny (powyżej) 👆" : "Admin PIN required (above) 👆"}
                    </p>
                  )}

                  <button
                    onClick={handlePublishChristianInspiration}
                    disabled={isPublishingCi || !adminPin}
                    aria-label={
                      appLanguage === "pl"
                        ? "Opublikuj Inspirację"
                        : "Publish Inspiration"
                    }
                    className={`relative z-50 w-full py-5 ${isPublishingCi || !adminPin ? "bg-zinc-800" : "bg-[#C5A059]"} text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer`}
                  >
                    {isPublishingCi
                      ? appLanguage === "pl"
                        ? "PUBLIKOWANIE..."
                        : "PUBLISHING..."
                      : appLanguage === "pl"
                        ? "OPUBLIKUJ INSPIRACJĘ"
                        : "PUBLISH INSPIRATION"}
                  </button>
                </div>
              </div>

              {/* <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-[#C5A059]/20 space-y-6 lg:col-span-2">
                <h4 className="text-[#C5A059] font-black text-xs uppercase tracking-widest">
                  {appLanguage === 'pl' ? 'Zarządzanie Treścią' : 'Content Management'}
                </h4>
              </div> */}
              <div className="lg:col-span-2">
                <AdminPostsManager
                  appLanguage={appLanguage}
                  addToast={addToast}
                />
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="animate-fade-in space-y-8 pb-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.9] w-2/3">
                  {appLanguage === "pl" ? "TWOJE ULUBIONE" : "YOUR FAVORITES"}
                </h3>
              </div>

              {!userPersona.favorites || userPersona.favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-30">
                  <span className="text-7xl mb-6">❤️</span>
                  <p className="text-sm font-black uppercase tracking-widest text-zinc-500">
                    {appLanguage === "pl"
                      ? "Brak ulubionych treści"
                      : "No favorite content"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {userPersona.favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="p-6 rounded-[2.5rem] bg-zinc-900/60 border border-zinc-800 flex flex-col gap-4 relative group overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-gold-dark/20 text-gold-dark text-[8px] font-black uppercase tracking-widest rounded-full border border-gold-dark/30">
                          {fav.type === "verse"
                            ? appLanguage === "pl"
                              ? "Werset"
                              : "Verse"
                            : appLanguage === "pl"
                              ? "Inspiracja"
                              : "Inspiration"}
                        </span>
                        <button
                          aria-label="Ulubione"
                          onClick={() => onToggleFavorite?.(fav)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-zinc-200 font-serif italic text-lg leading-relaxed">
                        "{fav.content}"
                      </p>
                      {fav.reference && (
                        <p className="text-[10px] font-black text-gold-dark uppercase tracking-widest">
                          — {fav.reference} —
                        </p>
                      )}
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-2">
                        {new Date(fav.timestamp).toLocaleDateString(
                          appLanguage === "pl" ? "pl-PL" : "en-US",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-fade-in space-y-8 pb-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.9] w-2/3">
                  {labels.historyTitle}
                </h3>
                <button
                  onClick={onClearNotifications}
                  className="text-[12px] font-black text-[#C5A059] uppercase tracking-widest hover:text-[#E2B859] transition-colors text-right pt-1"
                >
                  {labels.clearAll}
                </button>
              </div>

              {/* List Section FIRST */}
              {systemNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-30">
                  <span className="text-7xl mb-6">🔕</span>
                  <p className="text-sm font-black uppercase tracking-widest text-zinc-500">
                    {labels.noNotifs}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {[...systemNotifications].reverse().map((notif) => {
                    const tNotif = translateNotification(notif);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationRead?.(notif.id)}
                        className={`p-7 rounded-[3rem] border transition-all cursor-pointer group relative overflow-hidden ${
                          notif.isRead
                            ? "bg-zinc-900/40 border-zinc-800/50 opacity-60"
                            : "bg-zinc-900 border-[#C5A059]/30 shadow-2xl shadow-[#C5A059]/5"
                        }`}
                      >
                        {!notif.isRead && (
                          <div className="absolute top-4 right-6 px-4 py-1.5 bg-gold-dark text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg z-10">
                            {labels.newBadge}
                          </div>
                        )}
                        <div className="flex gap-7 items-start relative z-0">
                          <div className="w-16 h-16 rounded-2xl bg-black/60 flex items-center justify-center text-3xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                            {notif.icon}
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
                              {tNotif.title}
                            </h4>
                            <div className="text-[14px] text-zinc-400 leading-relaxed font-medium">
                              {renderMessageWithLinks(
                                fixOrphans(tNotif.message),
                              )}
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                              <svg
                                className="w-3.5 h-3.5 text-zinc-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                {new Date(notif.timestamp).toLocaleString(
                                  appLanguage === "pl" ? "pl-PL" : "en-US",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Notification settings section MOVED TO BOTTOM */}
              <div className="bg-zinc-900/60 p-8 rounded-[2.5rem] border border-zinc-800 space-y-8 mt-12">
                <Separator
                  text={
                    appLanguage === "pl"
                      ? "Ustawienia Powiadomień"
                      : "Notification Settings"
                  }
                />

                {/* Werset Dnia */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-black text-xs uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Werset Dnia"
                        : "Verse of the Day"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? `Codziennie o ${notifSettings.verseOfDayTime}`
                        : `Daily at ${notifSettings.verseOfDayTime}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="time"
                      value={notifSettings.verseOfDayTime}
                      onChange={(e) =>
                        handleNotificationSettingChange(
                          "verseOfDayTime",
                          e.target.value,
                        )
                      }
                      className="bg-black border border-zinc-800 text-[#C5A059] text-sm font-black rounded-lg p-2 focus:ring-1 focus:ring-[#C5A059] focus:outline-none transition-all"
                    />
                    <button
                      onClick={() =>
                        handleNotificationSettingChange(
                          "verseOfDayEnabled",
                          !notifSettings.verseOfDayEnabled,
                        )
                      }
                      className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${notifSettings.verseOfDayEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${notifSettings.verseOfDayEnabled ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Cuda Każdego Dnia */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-black text-xs uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Cuda Każdego Dnia"
                        : "Daily Miracles"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Premiera YouTube o 18:00"
                        : "YouTube Premiere at 18:00"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "dailyMiraclesEnabled",
                        !notifSettings.dailyMiraclesEnabled,
                      )
                    }
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${notifSettings.dailyMiraclesEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${notifSettings.dailyMiraclesEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Wezwanie do wsparcia */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-black text-xs uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Wezwanie do Wsparcia"
                        : "Call for Support"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "1. i 15. dnia miesiąca o 12:00"
                        : "1st & 15th of month at 12:00"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "supportRemindersEnabled",
                        !notifSettings.supportRemindersEnabled,
                      )
                    }
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${notifSettings.supportRemindersEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${notifSettings.supportRemindersEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Chwila Pokoju */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-black text-xs uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Chwila Pokoju"
                        : "Moment of Peace"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Losowe inspiracje w ciągu dnia"
                        : "Random inspirations during the day"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "momentOfPeaceEnabled",
                        !notifSettings.momentOfPeaceEnabled,
                      )
                    }
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${notifSettings.momentOfPeaceEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${notifSettings.momentOfPeaceEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Widget na Ekran Blokady */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-black text-xs uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Widget Ekranu Blokady"
                        : "Lock Screen Widget"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Werset dnia na ekranie blokady"
                        : "Verse of the day on lock screen"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "lockScreenWidgetEnabled",
                        !notifSettings.lockScreenWidgetEnabled,
                      )
                    }
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${notifSettings.lockScreenWidgetEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${notifSettings.lockScreenWidgetEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* 4 AM Wakeup */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-black text-xs uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Wyjście z bloków (4:00)"
                        : "Wake up (4:00 AM)"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Motywacyjna pobudka dla Wojowników"
                        : "Motivational wake-up for Warriors"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "wakeup4amEnabled",
                        !notifSettings.wakeup4amEnabled,
                      )
                    }
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${notifSettings.wakeup4amEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${notifSettings.wakeup4amEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* 6 AM Wakeup */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-black text-xs uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Pobudki Poranne (6:00)"
                        : "Morning Wake-ups (6:00 AM)"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Pobudka dla Uczniów Jezusa"
                        : "Wake-up for Jesus' Disciples"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationSettingChange(
                        "wakeup6amEnabled",
                        !notifSettings.wakeup6amEnabled,
                      )
                    }
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${notifSettings.wakeup6amEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${notifSettings.wakeup6amEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Custom Sounds (Android System Notification Settings) */}
                {Capacitor.isNativePlatform() &&
                  Capacitor.getPlatform() === "android" && (
                    <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-black text-sm uppercase tracking-tight">
                          {appLanguage === "pl"
                            ? "Dźwięki Powiadomień"
                            : "Notification Sounds"}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                          {appLanguage === "pl"
                            ? "W systemie Android możesz przypisać dowolny dźwięk (MP3/WAV) do kanałów powiadomień bezpośrednio w ustawieniach systemowych aplikacji."
                            : "In Android, you can assign any custom sound (MP3/WAV) to notification channels directly in the system app settings."}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await NativeSettings.open({
                              optionAndroid: AndroidSettings.AppNotification,
                              optionIOS: undefined as any,
                            });
                          } catch (err) {
                            console.log("Error opening native settings", err);
                          }
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl transition-colors active:scale-95 text-center mt-2"
                      >
                        {appLanguage === "pl"
                          ? "Otwórz Ustawienia Dźwięków (Android)"
                          : "Open Sound Settings (Android)"}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}

          {activeTab === "alarm" && (
            <div className="animate-fade-in space-y-8 pb-10">
              <div className="bg-zinc-900/40 p-6 sm:p-12 rounded-[3rem] border border-zinc-800/50 text-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent"></div>

                <div className="flex flex-col items-center mb-8">
                  <span className="text-3xl mb-4">⏰</span>
                  <Separator
                    text={
                      appLanguage === "pl"
                        ? "Budzik Radiowy CC"
                        : "CC Radio Alarm"
                    }
                  />
                </div>

                <div className="relative inline-block w-full max-w-sm mx-auto group">
                  <input
                    type="time"
                    value={alarmTime}
                    onChange={(e) => {
                      setAlarmTime(e.target.value);
                      handleUpdateAlarm({ time: e.target.value });
                    }}
                    className="bg-black/60 border border-zinc-800 text-[#C5A059] text-6xl sm:text-8xl font-black rounded-[2.5rem] p-8 w-full text-center focus:ring-4 focus:ring-[#C5A059]/10 transition-all mb-8 shadow-2xl font-mono tracking-tighter"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-[10px] font-black shadow-lg animate-pulse">
                    ON
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">
                      {appLanguage === "pl"
                        ? "POWTARZAJ W DNI:"
                        : "REPEAT ON DAYS:"}
                    </p>
                    <div className="flex flex-wrap justify-start gap-2">
                      {currentDayNames.map((day, idx) => {
                        const isActive = alarmDays.includes(idx);
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleAlarmDay(idx)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center border-2 ${
                              isActive
                                ? "bg-gold-dark border-gold-dark text-white shadow-xl shadow-gold/10 scale-105"
                                : "bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-700"
                            }`}
                          >
                            {day.substring(0, 2).toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">
                      {appLanguage === "pl"
                        ? "ŹRÓDŁO DŹWIĘKU:"
                        : "AUDIO SOURCE:"}
                    </p>

                    {radioAlarm?.localFileName ? (
                      <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-black" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-white text-xs font-bold truncate">
                              {radioAlarm.localFileName}
                            </p>
                            <p className="text-[#C5A059] text-[10px] tracking-widest uppercase">
                              {appLanguage === "pl"
                                ? "Lokalny plik audio"
                                : "Local audio file"}
                            </p>
                          </div>
                        </div>
                        <button
                          aria-label="Usuń"
                          onClick={() =>
                            handleUpdateAlarm({
                              localFileId: undefined,
                              localFileName: undefined,
                            })
                          }
                          className="p-3 bg-red-900/40 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                          title={
                            appLanguage === "pl"
                              ? "Zresetuj do radia"
                              : "Reset to radio"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {(["PL", "GLOBAL", "BIBLIA"] as const).map((stream) => (
                          <button
                            key={stream}
                            onClick={() => {
                              setAlarmStream(stream);
                              handleUpdateAlarm({ stream });
                            }}
                            className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                              alarmStream === stream
                                ? "bg-white border-white text-black shadow-xl scale-105"
                                : "bg-zinc-950 border-zinc-800 text-zinc-600"
                            }`}
                          >
                            {stream === "PL"
                              ? appLanguage === "pl"
                                ? "RADIO POLSKA"
                                : "RADIO PL"
                              : stream === "GLOBAL"
                                ? appLanguage === "pl"
                                  ? "GLOBAL CC"
                                  : "GLOBAL CC"
                                : appLanguage === "pl"
                                  ? "BIBLIA AUDIO"
                                  : "AUDIO BIBLE"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-zinc-800">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-white uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Narastająca Głośność"
                        : "Progressive Volume"}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      Fade-in (5 min)
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateAlarm({
                        fadeInEnabled: !radioAlarm?.fadeInEnabled,
                      })
                    }
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${radioAlarm?.fadeInEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${radioAlarm?.fadeInEnabled ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleUpdateAlarm({ enabled: !radioAlarm?.enabled })
                  }
                  className={`w-full mt-8 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 ${
                    radioAlarm?.enabled
                      ? "bg-red-600 text-white border-b-8 border-red-800 hover:bg-red-500"
                      : "bg-gold-dark text-white border-b-8 border-gold-dark/80 hover:scale-[1.02]"
                  }`}
                >
                  {radioAlarm?.enabled
                    ? appLanguage === "pl"
                      ? "WYŁĄCZ BUDZIK"
                      : "TURN OFF ALARM"
                    : appLanguage === "pl"
                      ? "AKTYWUJ BUDZIK"
                      : "ACTIVATE ALARM"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="animate-fade-in space-y-8 pb-10">
              <div className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800/50 space-y-8 backdrop-blur-sm">
                <Separator
                  text={appLanguage === "pl" ? "Automatyzacja" : "Automation"}
                />

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-zinc-800/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Autostart Radia"
                          : "Radio Autostart"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Ostatnio słuchana stacja"
                          : "Last listened station"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const newVal = !userPersona.autostartRadio;
                        onUpdateUserPersona({
                          ...userPersona,
                          autostartRadio: newVal,
                        });
                        addToast(
                          newVal
                            ? appLanguage === "pl"
                              ? "Autostart radia włączony! 📻"
                              : "Radio autostart on! 📻"
                            : appLanguage === "pl"
                              ? "Autostart radia wyłączony."
                              : "Radio autostart off.",
                          "info",
                        );
                      }}
                      className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${userPersona.autostartRadio ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${userPersona.autostartRadio ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-zinc-800/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Tryb Inteligentny"
                          : "Smart Mode"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Auto-Start & Lokalizacja"
                          : "Auto-Start & Location"}
                      </span>
                    </div>
                    <button
                      onClick={toggleSmartStart}
                      className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${userPersona.smartStart ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${userPersona.smartStart ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-zinc-800/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Powitania Głosowe AI"
                          : "AI Voice Greetings"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Dynamiczne powitanie na start"
                          : "Dynamic greeting on start"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const newVal = !userPersona.aiGreetingsEnabled;
                        onUpdateUserPersona({
                          ...userPersona,
                          aiGreetingsEnabled: newVal,
                        });
                        addToast(
                          newVal
                            ? appLanguage === "pl"
                              ? "Powitania AI włączone! 🎙️"
                              : "AI greetings enabled! 🎙️"
                            : appLanguage === "pl"
                              ? "Powitania AI wyłączone."
                              : "AI greetings disabled.",
                          "info",
                        );
                      }}
                      className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${userPersona.aiGreetingsEnabled ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${userPersona.aiGreetingsEnabled ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-zinc-800/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Ekran Włączony"
                          : "Keep Screen On"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Podczas Odtwarzania Radia"
                          : "While Radio Is Playing"}
                      </span>
                    </div>
                    <button
                      onClick={toggleKeepScreenOn}
                      className={`w-14 h-8 rounded-full p-1 transition-all duration-500 flex-shrink-0 ${userPersona.keepScreenOnWhileRadioPlaying ? "bg-[#C5A059]" : "bg-zinc-800"}`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${userPersona.keepScreenOnWhileRadioPlaying ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-zinc-800/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Wygaszacz Ekranu"
                          : "Screensaver"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Tylko na życzenie"
                          : "On demand only"}
                      </span>
                    </div>
                    <button
                      onClick={startScreensaver}
                      className="px-4 py-2 rounded-full transition-all duration-300 flex-shrink-0 bg-zinc-800 hover:bg-[#C5A059] text-white/70 hover:text-white group flex items-center justify-center border border-zinc-700/50 hover:border-[#C5A059]"
                    >
                      <span className="text-xs uppercase font-bold tracking-widest">
                        {appLanguage === "pl" ? "Uruchom" : "Start"}
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 p-4 bg-black/20 rounded-2xl border border-zinc-800/30">
                    <div className="flex flex-col gap-1 mb-2">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Optymalizacja Wersetu Dnia"
                          : "Daily Verse Optimization"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Dostosuj czcionkę ekranu wersetu"
                          : "Customize verse screen font"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center px-2">
                      <span className="text-xs text-white uppercase tracking-wider">
                        {appLanguage === "pl"
                          ? "Wielkość czcionki"
                          : "Font Size"}
                      </span>
                      <input
                        type="range"
                        min="12"
                        max="36"
                        value={userPersona.dailyVerseConfig?.fontSize || 20}
                        onChange={(e) =>
                          onUpdateUserPersona({
                            ...userPersona,
                            dailyVerseConfig: {
                              ...userPersona.dailyVerseConfig,
                              fontSize: parseInt(e.target.value) || 20,
                              fontFamily:
                                userPersona.dailyVerseConfig?.fontFamily ||
                                "sans",
                            },
                          })
                        }
                        className="w-1/2 accent-gold"
                      />
                      <span className="text-xs font-mono text-zinc-400">
                        {userPersona.dailyVerseConfig?.fontSize || 20}px
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-xs text-white uppercase tracking-wider px-2">
                        {appLanguage === "pl"
                          ? "Rodzaj czcionki"
                          : "Font Family"}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(["sans", "serif", "mono", "lora"] as const).map(
                          (font) => (
                            <button
                              key={font}
                              onClick={() =>
                                onUpdateUserPersona({
                                  ...userPersona,
                                  dailyVerseConfig: {
                                    ...userPersona.dailyVerseConfig,
                                    fontSize:
                                      userPersona.dailyVerseConfig?.fontSize ||
                                      20,
                                    fontFamily: font,
                                  },
                                })
                              }
                              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${userPersona.dailyVerseConfig?.fontFamily === font || (!userPersona.dailyVerseConfig?.fontFamily && font === "sans") ? "bg-gold-dark text-white" : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"}`}
                            >
                              {font}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        addToast(
                          appLanguage === "pl"
                            ? "Ustawienia Wersetu Dnia zostały pomyślnie zapisane."
                            : "Daily Verse settings have been successfully saved.",
                          "success",
                        )
                      }
                      className="mt-2 w-full py-3 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {appLanguage === "pl"
                        ? "Zapisz ustawienia"
                        : "Save settings"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 p-4 bg-black/20 rounded-2xl border border-zinc-800/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Język aplikacji"
                          : "App Language"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Wybierz język interfejsu"
                          : "Choose interface language"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(
                        [
                          "pl",
                          "en",
                          "de",
                          "es",
                          "fr",
                          "it",
                          "pt",
                          "uk",
                        ] as SupportedLanguage[]
                      ).map((lang) => {
                        const isRestricted =
                          (activeStream === "PL" ||
                            activeStream === "BIBLIA") &&
                          lang !== "pl";
                        return (
                          <button
                            key={lang}
                            onClick={() => onLanguageChange(lang)}
                            disabled={isRestricted}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${appLanguage === lang ? "bg-gold-dark border-gold-dark text-white shadow-lg" : isRestricted ? "bg-zinc-900 border-zinc-900 text-zinc-700 cursor-not-allowed opacity-50" : "bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400"}`}
                            title={
                              isRestricted
                                ? appLanguage === "pl"
                                  ? "Odtwarzana stacja wymaga języka polskiego"
                                  : "The playing station requires Polish language"
                                : ""
                            }
                          >
                            {lang.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                    {(activeStream === "PL" || activeStream === "BIBLIA") && (
                      <p className="text-[10px] text-zinc-500 mt-2">
                        {appLanguage === "pl"
                          ? "* Zmiana języka jest zablokowana podczas słuchania stacji Radio Polska oraz Biblia Audio."
                          : "* Language change is locked while listening to Radio Poland and Audio Bible."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lokalizacja i Pogoda */}
              <div className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800/50 space-y-8 backdrop-blur-sm">
                <Separator
                  text={
                    appLanguage === "pl"
                      ? "Lokalizacja i Pogoda"
                      : "Location & Weather"
                  }
                />
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
                    {appLanguage === "pl"
                      ? "Twoja lokalizacja (miasto/koordynaty)"
                      : "Your location (city/coordinates)"}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onBlur={handleLocationBlur}
                      placeholder={
                        appLanguage === "pl"
                          ? "Wpisz miasto lub koordynaty..."
                          : "Enter city or coordinates..."
                      }
                      className="flex-1 py-5 px-6 bg-black/60 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-zinc-600 shadow-inner"
                    />
                    <button
                      aria-label="Ulubione"
                      onClick={handleGetLocation}
                      disabled={loadingLocation}
                      className="w-16 h-16 bg-gold-dark border border-gold-dark rounded-2xl flex items-center justify-center hover:scale-105 transition-all text-white shadow-xl active:scale-95"
                      title={
                        appLanguage === "pl"
                          ? "Pobierz lokalizację GPS"
                          : "Get GPS location"
                      }
                    >
                      {loadingLocation ? (
                        <svg
                          className="animate-spin h-6 w-6 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth={4}
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-7 h-7 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-[#C5A059]/5 rounded-[2rem] p-6 border border-[#C5A059]/10">
                  <p className="text-zinc-500 text-xs italic leading-relaxed">
                    {appLanguage === "pl"
                      ? "Wprowadź miasto, aby dostosować zawartość i stacje radiowe. Aplikacja nie zbiera danych geolokalizacyjnych."
                      : "Enter a city to customize content and radio stations. The app does not collect geolocation data."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "emergency" && (
            <div className="animate-fade-in space-y-8 pb-10">
              <div className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800/50 space-y-8 backdrop-blur-sm">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                  <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-xl shadow-[#25D366]/20">
                    <span className="text-3xl text-white">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.337a9.993 9.993 0 004.779 1.216h.004c5.502 0 9.985-4.48 9.985-9.984C21.996 6.388 17.518 2 12.012 2zM12.012 19.164h-.003a8.318 8.318 0 01-4.243-1.158l-.304-.18-3.155.805.842-3.078-.198-.314A8.28 8.28 0 013.684 11.98c0-4.57 3.722-8.287 8.328-8.287 4.568 0 8.325 3.714 8.325 8.287s-3.757 8.184-8.325 8.184zm4.567-6.223c-.25-.126-1.484-.732-1.714-.816-.23-.084-.397-.126-.565.126-.167.25-.65 1.006-.796 1.216-.146.21-.293.238-.543.112-1.115-.568-2.023-1.077-2.756-2.083-.19-.262-.02-.404.105-.53.111-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.02-.438-.063-.125-.565-1.364-.775-1.867-.204-.492-.41-.425-.565-.432-.146-.007-.313-.007-.48-.007-.167 0-.438.063-.667.313-.23.25-.877.856-.877 2.086 0 1.23.897 2.42 1.022 2.587.125.167 1.764 2.69 4.27 3.774 1.734.75 2.392.81 3.238.683.94-.14 1.484-.606 1.693-1.193.21-.587.21-1.088.147-1.193-.062-.105-.23-.167-.48-.292z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Infolinia Nadzieja CC"
                        : "CC Hope Hotline"}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Wsparcie na WhatsApp"
                        : "WhatsApp Support"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-[#25D366]/5 border border-[#25D366]/20 rounded-3xl">
                    <p className="text-xs text-zinc-400 leading-relaxed italic text-center">
                      {appLanguage === "pl"
                        ? "Masz problem duchowy i potrzebujesz rozmowy? Christian Culture jest w gotowości. Napisz do nas, a nasz zespół wsparcia odpowie na Twoją wiadomość, aby udzielić Ci potrzebnego wsparcia w trudnej sytuacji."
                        : "Do you have a spiritual problem and need to talk? Christian Culture is ready. Write to us and our support team will answer your message to provide the support you need."}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      nativeService.hapticImpact(ImpactStyle.Medium);
                      window.open("https://wa.me/48730958583", "_blank");
                    }}
                    className="w-full py-5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-black text-[12px] uppercase tracking-widest rounded-2xl hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.337a9.993 9.993 0 004.779 1.216h.004c5.502 0 9.985-4.48 9.985-9.984C21.996 6.388 17.518 2 12.012 2zM12.012 19.164h-.003a8.318 8.318 0 01-4.243-1.158l-.304-.18-3.155.805.842-3.078-.198-.314A8.28 8.28 0 013.684 11.98c0-4.57 3.722-8.287 8.328-8.287 4.568 0 8.325 3.714 8.325 8.287s-3.757 8.184-8.325 8.184zm4.567-6.223c-.25-.126-1.484-.732-1.714-.816-.23-.084-.397-.126-.565.126-.167.25-.65 1.006-.796 1.216-.146.21-.293.238-.543.112-1.115-.568-2.023-1.077-2.756-2.083-.19-.262-.02-.404.105-.53.111-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.02-.438-.063-.125-.565-1.364-.775-1.867-.204-.492-.41-.425-.565-.432-.146-.007-.313-.007-.48-.007-.167 0-.438.063-.667.313-.23.25-.877.856-.877 2.086 0 1.23.897 2.42 1.022 2.587.125.167 1.764 2.69 4.27 3.774 1.734.75 2.392.81 3.238.683.94-.14 1.484-.606 1.693-1.193.21-.587.21-1.088.147-1.193-.062-.105-.23-.167-.48-.292z" />
                    </svg>
                    {appLanguage === "pl"
                      ? "NAPISZ NA WHATSAPP (+48 730 958 583)"
                      : "MESSAGE ON WHATSAPP (+48 730 958 583)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cloud" && (
            <div className="animate-fade-in space-y-8 pb-10">
              <div className="bg-zinc-900/40 p-8 sm:p-10 rounded-[3rem] border border-zinc-800/50 space-y-10 backdrop-blur-sm">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Centrum Integracji"
                        : "Integration Center"}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Twoje połączenia z usługami Google"
                        : "Your Google service connections"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Google Full Connect Action */}
                  {!gapiSignedIn ? (
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full p-8 bg-gradient-to-br from-[#4285F4] to-[#34A853] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:scale-[1.02] shadow-2xl transition-all border-4 border-white/10"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <svg className="w-10 h-10" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h5 className="text-lg font-black text-white uppercase tracking-widest leading-none mb-1">
                          {appLanguage === "pl"
                            ? "POŁĄCZ WSZYSTKIE USŁUGI"
                            : "CONNECT ALL SERVICES"}
                        </h5>
                        <p className="text-[10px] text-white/70 font-bold uppercase tracking-tight">
                          {appLanguage === "pl"
                            ? "Dysk, Kalendarz, Zdjęcia, Zadania"
                            : "Drive, Calendar, Photos, Tasks"}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/20">
                          <svg
                            className="w-6 h-6 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            {appLanguage === "pl"
                              ? "Zalogowano jako"
                              : "Logged in as"}
                          </p>
                          <p className="text-white font-black text-sm uppercase tracking-tight">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleGoogleSignOut}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                      >
                        {appLanguage === "pl" ? "Rozłącz" : "Disconnect"}
                      </button>
                    </div>
                  )}

                  {/* Integration List */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Google Calendar Row */}
                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-zinc-800/50 group hover:border-[#E2B859]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-xs uppercase tracking-tight">
                            {appLanguage === "pl"
                              ? "Kalendarz Google"
                              : "Google Calendar"}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                            {appLanguage === "pl"
                              ? "Terminarz i wydarzenia"
                              : "Schedule & events"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!gapiSignedIn) handleGoogleSignIn();
                          else
                            onUpdateUserPersona({
                              ...userPersona,
                              isGoogleCalendarConnected:
                                !userPersona.isGoogleCalendarConnected,
                            });
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${gapiSignedIn && userPersona.isGoogleCalendarConnected ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${gapiSignedIn && userPersona.isGoogleCalendarConnected ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    {/* Google Drive Row */}
                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-zinc-800/50 group hover:border-[#E2B859]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center text-yellow-500">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M15.42 2H8.58L3 11.58v6.84L8.58 28h6.84L21 18.42v-6.84L15.42 2zm-1.84 21h-3.16l-4.58-7.92L10.42 7.16h3.16l4.58 7.92-4.58 7.92z"
                              transform="scale(0.8) translate(3,3)"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-xs uppercase tracking-tight">
                            {appLanguage === "pl"
                              ? "Dysk Google (Sync)"
                              : "Google Drive (Sync)"}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                            {appLanguage === "pl"
                              ? "Synchronizacja plików"
                              : "Files synchronization"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!gapiSignedIn) handleGoogleSignIn();
                          else
                            onUpdateUserPersona({
                              ...userPersona,
                              joshuaSystem: {
                                ...userPersona.joshuaSystem!,
                                driveSyncEnabled:
                                  !userPersona.joshuaSystem?.driveSyncEnabled,
                              },
                            });
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${gapiSignedIn && userPersona.joshuaSystem?.driveSyncEnabled ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${gapiSignedIn && userPersona.joshuaSystem?.driveSyncEnabled ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    {/* Google Photos Row */}
                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-zinc-800/50 group hover:border-[#E2B859]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-xs uppercase tracking-tight">
                            {appLanguage === "pl"
                              ? "Zdjęcia Google"
                              : "Google Photos"}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                            {appLanguage === "pl"
                              ? "Biblioteka wizytówek CC"
                              : "CC Identity Library"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!gapiSignedIn) handleGoogleSignIn();
                          else
                            onUpdateUserPersona({
                              ...userPersona,
                              isGooglePhotosConnected:
                                !userPersona.isGooglePhotosConnected,
                            });
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${gapiSignedIn && userPersona.isGooglePhotosConnected ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${gapiSignedIn && userPersona.isGooglePhotosConnected ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    {/* Google Tasks Row */}
                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-zinc-800/50 group hover:border-[#E2B859]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-xs uppercase tracking-tight">
                            {appLanguage === "pl"
                              ? "Zadania Google"
                              : "Google Tasks"}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                            {appLanguage === "pl"
                              ? "Synchronizacja Planera"
                              : "Planner Synchronization"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!gapiSignedIn) handleGoogleSignIn();
                          else
                            onUpdateUserPersona({
                              ...userPersona,
                              isGoogleTasksConnected:
                                !userPersona.isGoogleTasksConnected,
                            });
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${gapiSignedIn && userPersona.isGoogleTasksConnected ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${gapiSignedIn && userPersona.isGoogleTasksConnected ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    {/* Google Keep Row */}
                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-zinc-800/50 group hover:border-[#E2B859]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-600/20 rounded-xl flex items-center justify-center text-amber-500">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.808 13.064a3 3 0 01-1.444-2.704 3 3 0 013-3 3 3 0 013 3 3 3 0 01-1.444 2.704 4.015 4.015 0 00-1.556 3.296h-1a4.015 4.015 0 00-1.556-3.296z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-xs uppercase tracking-tight">
                            {appLanguage === "pl"
                              ? "Google Keep"
                              : "Google Keep"}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                            {appLanguage === "pl"
                              ? "Notatki i listy"
                              : "Notes & lists"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!gapiSignedIn) handleGoogleSignIn();
                          else
                            onUpdateUserPersona({
                              ...userPersona,
                              isGoogleKeepConnected:
                                !userPersona.isGoogleKeepConnected,
                            });
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${gapiSignedIn && userPersona.isGoogleKeepConnected ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${gapiSignedIn && userPersona.isGoogleKeepConnected ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Custom Client ID Input */}
                  <div className="p-6 bg-black/40 rounded-3xl border border-zinc-800/50 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">
                        {appLanguage === "pl"
                          ? "Klucz Google Project (Advanced)"
                          : "Google Project Key (Advanced)"}
                      </span>
                      <button
                        onClick={() =>
                          window.open(
                            "https://console.cloud.google.com/apis/credentials",
                            "_blank",
                          )
                        }
                        className="text-[9px] text-[#E2B859] font-black uppercase hover:underline tracking-widest"
                      >
                        {appLanguage === "pl" ? "Pobierz klucz" : "Get Key"}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={userPersona.googleClientId || ""}
                      onChange={(e) => {
                        const newId = e.target.value;
                        onUpdateUserPersona({
                          ...userPersona,
                          googleClientId: newId,
                        });
                        googleCalendarService.reinitClient(newId);
                      }}
                      placeholder="5532...apps.googleusercontent.com"
                      className="w-full bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-xs text-zinc-300 focus:outline-none focus:border-[#E2B859]/50 transition-all font-mono"
                    />
                    <p className="text-[8px] text-zinc-500 italic uppercase font-bold tracking-tight">
                      {appLanguage === "pl"
                        ? "Użycie własnego klucza usuwa ograniczenia darmowych limitów CC Network."
                        : "Using your own key removes CC Network free limit restrictions."}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="p-6 bg-blue-600/5 rounded-[2.5rem] border border-blue-600/20 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                        {appLanguage === "pl"
                          ? "Polityka Integracji"
                          : "Integration Policy"}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
                      {fixOrphans(
                        appLanguage === "pl"
                          ? "Integracja z usługami Google pozwala na automatyczny backup Twoich danych duchowych, synchronizację Planera z Kalendarzem oraz zarządzanie biblioteką zdjęć w Identity Engine. Dane są przesyłane bezpośrednio między Twoim urządzeniem a serwerami Google zgodnie z Twoimi zgodami OAuth."
                          : "Integration with Google services allows for automatic backup of your spiritual data, synchronization of the Planner with the Calendar, and management of the photo library in the Identity Engine. Data is sent directly between your device and Google servers according to your OAuth consents.",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* CC Intelligence API Key Section */}
              <div className="bg-zinc-900/40 p-8 sm:p-10 rounded-[3rem] border border-zinc-800/50 space-y-10 backdrop-blur-sm">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "CC Intelligence"
                        : "CC Intelligence"}
                    </h4>
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest animate-pulse">
                      {appLanguage === "pl"
                        ? "Wymagany własny klucz API"
                        : "Personal API key required"}
                    </p>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 space-y-3">
                  <div className="flex items-center gap-3 text-red-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "WAŻNA INFORMACJA"
                        : "IMPORTANT NOTICE"}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                    {appLanguage === "pl"
                      ? "Ze względu na wyczerpanie limitów deweloperskich, wszystkie funkcje AI (Miriam, Werset Dnia AI, Lekcje) wymagają teraz podania własnego klucza API Gemini. Korzystasz z AI na własny koszt i limit."
                      : "Due to developer quota exhaustion, all AI features (Miriam, AI Verse of the Day, Lessons) now require your own Gemini API key. You use AI at your own cost and limit."}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block">
                        {appLanguage === "pl"
                          ? "Twoje Klucze API Gemini"
                          : "Your Gemini API Keys"}
                      </label>
                      <button
                        aria-label="Ulubione"
                        onClick={() => setGeminiKeys([...geminiKeys, ""])}
                        className="text-[10px] font-black text-gold uppercase tracking-widest flex items-center gap-1 hover:text-gold/80"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        {appLanguage === "pl" ? "DODAJ KLUCZ" : "ADD KEY"}
                      </button>
                      {geminiKeys.some((k) => k.trim() !== "") && (
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">
                          {appLanguage === "pl"
                            ? "Klucz wprowadzony"
                            : "Key entered"}
                        </span>
                      )}
                    </div>
                    {geminiKeys.map((key, index) => (
                      <div key={index} className="relative group mt-2">
                        <input
                          type={showGeminiKeys[index] ? "text" : "password"}
                          value={key}
                          onChange={(e) => {
                            const newKeys = [...geminiKeys];
                            newKeys[index] = e.target.value;
                            setGeminiKeys(newKeys);
                          }}
                          placeholder={
                            appLanguage === "pl"
                              ? "Wklej swój klucz tutaj..."
                              : "Paste your key here..."
                          }
                          className="w-full py-5 px-6 pr-14 bg-black/60 border border-zinc-800 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-[#E2B859] focus:border-[#E2B859]/50 focus:outline-none text-white placeholder-zinc-600 shadow-inner transition-all group-hover:border-zinc-700"
                        />
                        <button
                          aria-label="Ulubione"
                          onClick={() => {
                            const newShow = [...showGeminiKeys];
                            newShow[index] = !newShow[index];
                            setShowGeminiKeys(newShow);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-2"
                        >
                          {showGeminiKeys[index] ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      aria-label="Ulubione"
                      onClick={handleSaveGeminiKeys}
                      disabled={isKeyValidating}
                      className="py-5 bg-gold-dark text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isKeyValidating ? (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth={4}
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : null}
                      {appLanguage === "pl" ? "ZAPISZ KLUCZ" : "SAVE KEY"}
                    </button>

                    {window.aistudio && (
                      <button
                        aria-label="Ulubione"
                        onClick={handleSelectPlatformKey}
                        className="py-5 bg-zinc-800 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-700 active:scale-95 transition-all border border-zinc-700 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                        {appLanguage === "pl"
                          ? "WYBIERZ SYSTEMOWY"
                          : "SELECT SYSTEM KEY"}
                      </button>
                    )}
                  </div>

                  <div className="bg-indigo-500/5 rounded-2xl p-6 border border-indigo-500/10">
                    <p className="text-zinc-500 text-[11px] italic leading-relaxed">
                      {appLanguage === "pl"
                        ? "Klucz API jest przechowywany wyłącznie lokalnie w Twojej przeglądarce. Pozwala on na korzystanie z zaawansowanych funkcji Miriam AI."
                        : "The API key is stored exclusively locally in your browser. It allows you to use advanced Miriam AI features."}
                    </p>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 font-bold hover:underline mt-3 inline-block text-[11px]"
                    >
                      {appLanguage === "pl"
                        ? "Pobierz swój klucz tutaj →"
                        : "Get your key here →"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="animate-fade-in space-y-8 pb-10">
              <div className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800/50 space-y-8 backdrop-blur-sm">
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">
                  {appLanguage === "pl"
                    ? "Kontakt & Wsparcie"
                    : "Contact & Support"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mariusz Pastor */}
                  <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-blue-500/30 transition-all group">
                    <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      ⛪
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">
                        {appLanguage === "pl"
                          ? "Mariusz Pastor"
                          : "Mariusz Pastor"}
                      </p>
                      <a
                        href={`tel:${dynamicDB["Kontakt tel."]?.match(/Pastor\sMariusz.*?\+48\s?(\d{9,11})/i)?.[1] || MARIUSZ_PRIEST_NUMBER.replace(/\s/g, "")}`}
                        className="text-sm text-white font-black uppercase tracking-tight hover:text-blue-400 transition-colors"
                      >
                        {dynamicDB["Kontakt tel."]?.match(
                          /Pastor\sMariusz.*?(\+48\s?\d{9,11})/i,
                        )?.[1] || MARIUSZ_PRIEST_NUMBER}
                      </a>
                    </div>
                  </div>

                  {/* Hotline Nadzieja */}
                  <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-[#E2B859]/30 transition-all group">
                    <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      📞
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">
                        {appLanguage === "pl"
                          ? "Infolinia Nadzieja"
                          : "Hope Hotline"}
                      </p>
                      <a
                        href={`tel:${dynamicDB["Kontakt tel."]?.match(/Infolinia.*?(\d{9,11})/i)?.[1] || HOTLINE_NADZIEJA_NUMBER.replace(/\s/g, "")}`}
                        className="text-sm text-white font-black uppercase tracking-tight hover:text-[#E2B859] transition-colors"
                      >
                        {dynamicDB["Kontakt tel."]?.match(
                          /Infolinia.*?(\+48\s?\d{9,11})/i,
                        )?.[1] || HOTLINE_NADZIEJA_NUMBER}
                      </a>
                    </div>
                  </div>

                  {/* Pomocna Dłoń (New from Spreadsheet) */}
                  {dynamicDB["Kontakt tel."]?.includes(
                    "Centrum Rozwoju Pomocna Dłoń",
                  ) && (
                    <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-emerald-500/30 transition-all group">
                      <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        🤝
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">
                          {appLanguage === "pl"
                            ? "Pomocna Dłoń"
                            : "Helping Hand"}
                        </p>
                        <a
                          href={`tel:${dynamicDB["Kontakt tel."]?.match(/Pomocna Dłoń.*?(\d{9,11})/i)?.[1] || "790577194"}`}
                          className="text-sm text-white font-black uppercase tracking-tight hover:text-emerald-400 transition-colors"
                        >
                          {dynamicDB["Kontakt tel."]?.match(
                            /Pomocna Dłoń.*?(\+48\s?\d{9,11})/i,
                          )?.[1] || "+48 790 577 194"}
                        </a>
                      </div>
                    </div>
                  )}

                  <a
                    href={CHRISTIAN_DATING_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-pink-500/30 transition-all group"
                  >
                    <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      ❤️
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">
                        {appLanguage === "pl"
                          ? "Chrześcijańska Randka"
                          : "Christian Dating"}
                      </p>
                      <p className="text-[10px] text-pink-400 font-bold tracking-widest uppercase">
                        NOWY PORTAL
                      </p>
                    </div>
                  </a>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-zinc-800/50">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-xl shadow-inner">
                      📧
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                        Radio Christian Culture
                      </p>
                      <a
                        href={`mailto:${dynamicDB["Kontakt e-mail"]?.split(" ")[2] || RADIO_EMAIL}`}
                        className="text-sm text-white font-black tracking-tight hover:text-red-400 transition-colors"
                      >
                        {dynamicDB["Kontakt e-mail"]?.split(" ")[2] ||
                          RADIO_EMAIL}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-zinc-800/50">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-xl shadow-inner">
                      📧
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                        TV Christian Culture
                      </p>
                      <a
                        href={`mailto:${dynamicDB["Kontakt e-mail"]?.split(" ")[0] || CCTV_EMAIL}`}
                        className="text-sm text-white font-black tracking-tight hover:text-red-400 transition-colors"
                      >
                        {dynamicDB["Kontakt e-mail"]?.split(" ")[0] ||
                          CCTV_EMAIL}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border border-zinc-800/50">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-xl shadow-inner">
                      📧
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                        Zbyszek Gieroń
                      </p>
                      <a
                        href="mailto:zbyszek.gieron@gmail.com"
                        className="text-sm text-white font-black tracking-tight hover:text-red-400 transition-colors"
                      >
                        zbyszek.gieron@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-5 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-2xl group hover:bg-[#C5A059]/10 transition-all">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                      📄
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">
                        Cykl Codziennych Rozważań
                      </p>
                      <a
                        href="https://drive.google.com/file/d/1gxrZFQHNnbQR6r0sBta42u-AiQQvdaQM/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white font-black tracking-tight hover:text-[#C5A059] transition-colors"
                      >
                        {appLanguage === "pl" ? "Otwórz PDF" : "Open PDF"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bug Report / Suggestions WhatsApp Section */}
                <div className="mt-8 p-8 bg-[#25D366]/5 border border-[#25D366]/20 rounded-[3rem] relative overflow-hidden group border-dashed">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg
                      className="w-16 h-16 text-[#25D366]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.411-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.658zm6.25-3.358l.369.219c1.472.874 3.156 1.335 4.884 1.335 5.539 0 10.048-4.51 10.051-10.05.001-2.684-1.045-5.207-2.946-7.108-1.901-1.901-4.42-2.947-7.103-2.947-5.541 0-10.051 4.509-10.054 10.05-.001 1.77.464 3.491 1.345 5.009l.241.415-.999 3.644 3.738-.971zm10.743-7.531c-.301-.15-1.781-.879-2.056-.979-.275-.1-.475-.15-.675.15s-.775.979-.95 1.179-.35.225-.65.075c-.3-.15-1.265-.467-2.41-1.488-.891-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.463.13-.612.134-.133.301-.351.451-.526.15-.175.2-.3.3-.5s.05-.375-.025-.525c-.075-.15-.675-1.626-.925-2.226-.243-.585-.49-.506-.675-.516-.175-.01-.375-.012-.575-.012s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.501s1.075 2.901 1.225 3.101c.15.2 2.115 3.226 5.122 4.526.715.31 1.274.495 1.71.634.717.229 1.37.197 1.886.12.574-.085 1.781-.726 2.031-1.426.25-.7 0-1.275-.075-1.426-.075-.15-.275-.25-.575-.401z" />
                    </svg>
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <h5 className="text-white font-black text-xs uppercase tracking-widest mb-3">
                      {appLanguage === "pl"
                        ? "MASZ POMYSŁ LUB BŁĄD?"
                        : "SUGGESTION OR BUG?"}
                    </h5>
                    <p className="text-zinc-400 text-[11px] font-medium leading-relaxed max-w-xs mb-6">
                      {appLanguage === "pl"
                        ? "Aplikacja cały czas rozwija się dla Ciebie. Napisz nam, co powinniśmy naprawić lub dodać, by służyło to misji Dla Jezusa!"
                        : "The app is constantly evolving for you. Let us know what we should fix or add to serve the mission For Jesus!"}
                    </p>
                    <a
                      href="https://chat.whatsapp.com/KiNyDmllfyM8TI6xwDe7L2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#128C7E] transition-all shadow-xl flex items-center justify-center gap-3 group/btn"
                    >
                      <svg
                        className="w-5 h-5 group-hover/btn:scale-110 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.301-.15-1.767-.872-2.036-.969-.27-.099-.463-.147-.678.147-.21.295-.819 1.026-1.003 1.226-.18.2-.36.223-.66.074-.3-.15-1.265-.466-2.41-1.488-.891-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.463.13-.612.133-.133.3-.351.45-.526.15-.175.2-.3.3-.5s.05-.375-.025-.525c-.075-.15-.675-1.626-.925-2.226-.243-.585-.49-.506-.675-.516-.175-.01-.375-.012-.575-.012s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.501 0 1.475 1.075 2.901 1.225 3.101.15.2 2.115 3.226 5.122 4.526.715.31 1.274.495 1.71.634.717.229 1.37.197 1.886.12.574-.085 1.781-.726 2.031-1.426.25-.7 0-1.275-.075-1.426s-.275-.25-.575-.401z" />
                      </svg>
                      {appLanguage === "pl"
                        ? "NAPISZ NA WHATSAPP"
                        : "WRITE ON WHATSAPP"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "legal" && (
            <div className="animate-fade-in space-y-6 sm:space-y-8 pb-10">
              <div className="bg-zinc-900/60 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-zinc-800 space-y-8 backdrop-blur-md">
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-6">
                  {appLanguage === "pl"
                    ? "Prywatność & Zgodność"
                    : "Privacy & Compliance"}
                </h4>

                <div className="bg-[#E2B859]/5 rounded-2xl p-6 border border-[#E2B859]/10">
                  <p className="text-zinc-400 text-xs sm:text-sm italic leading-relaxed">
                    {appLanguage === "pl"
                      ? "Twoja prywatność jest dla nas święta. CC Lite została zaprojektowana tak, abyś to Ty miał pełną władzę nad swoimi danymi duchowymi."
                      : "Your privacy is sacred to us. CC Lite is designed so that you have full power over your spiritual data."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-black text-[#E2B859] uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Przechowywanie Danych:"
                        : "Data Storage:"}
                    </p>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {fixOrphans(
                        appLanguage === "pl"
                          ? "Christian Culture RADIO jest aplikacją typu Client-Side. Oznacza to, że Twoje modlitwy, cele, notatki oraz dane profilowe są przechowywane wyłącznie w pamięci podręcznej Twojej przeglądarki (LocalStorage). My, jako twórcy, nie mamy do nich dostępu."
                          : "Christian Culture RADIO is a Client-Side application. This means your prayers, goals, notes, and profile data are stored exclusively in your browser's LocalStorage. We, as creators, have no access to them.",
                      )}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-black text-[#E2B859] uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Integracja z Chmurą:"
                        : "Cloud Integration:"}
                    </p>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {fixOrphans(
                        appLanguage === "pl"
                          ? "Jeśli zdecydujesz się podłączyć Dysk Google lub Kalendarz, aplikacja będzie wysyłać Twoje dane bezpośrednio do Twojej prywatnej chmury. Połączenie odbywa się przez oficjalne API Google i wymaga Twojej wyraźnej zgody przy każdym logowaniu."
                          : "If you choose to connect Google Drive or Calendar, the app will send your data directly to your private cloud. The connection is made through the official Google API and requires your explicit consent at each login.",
                      )}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-black text-[#E2B859] uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Sztuczna Inteligencja (Miriam AI):"
                        : "Artificial Intelligence (Miriam AI):"}
                    </p>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {fixOrphans(
                        appLanguage === "pl"
                          ? "Aplikacja korzysta z usług Google CC Intelligence. Treści wierszy, analiz i rozmów są generowane w chmurze Google. Jeśli korzystasz z własnego klucza API, Twoje limity i prywatność podlegają regulaminom Google Cloud Platform."
                          : "The app uses Google CC Intelligence services. Verse content, analysis, and conversations are generated in the Google cloud. If you use your own API key, your limits and privacy are subject to Google Cloud Platform terms.",
                      )}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-black text-[#E2B859] uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Geolokalizacja:"
                        : "Geolocation:"}
                    </p>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {fixOrphans(
                        appLanguage === "pl"
                          ? "Dostęp do lokalizacji jest opcjonalny i służy wyłącznie do automatycznego doboru języka oraz regionalnej stacji radiowej w Trybie Inteligentnym. Twoje współrzędne nie są zapisywane na zewnętrznych serwerach."
                          : "Location access is optional and used solely for automatic language selection and regional radio station picking in Smart Mode. Your coordinates are not saved on external servers.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <button
                    aria-label="Ulubione"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black text-[#E2B859] uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {appLanguage === "pl"
                      ? "Pełna Polityka Prywatności"
                      : "Full Privacy Policy"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="animate-fade-in space-y-6 pb-10">
              <div className="bg-zinc-900/40 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-zinc-800/50 space-y-8 backdrop-blur-sm">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                  <div className="w-16 h-16 bg-[#E2B859] rounded-2xl flex items-center justify-center shadow-xl shadow-[#E2B859]/20">
                    <span className="text-3xl text-black">📲</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Instalacja Aplikacji"
                        : "App Installation"}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Zarządzaj wersją natywną"
                        : "Manage native version"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-zinc-800/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-xs uppercase tracking-tight">
                        {appLanguage === "pl"
                          ? "Status Aplikacji"
                          : "App Status"}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${installStatus === "installed" ? "text-green-500" : "text-amber-500"}`}
                      >
                        {installStatus === "installed"
                          ? appLanguage === "pl"
                            ? "ZAINSTALOWANO (PWA PREMIUM)"
                            : "INSTALLED (PWA PREMIUM)"
                          : appLanguage === "pl"
                            ? "DOSTĘPNA DO INSTALACJI"
                            : "AVAILABLE FOR INSTALL"}
                      </span>
                    </div>
                    {installStatus !== "installed" && (
                      <button
                        onClick={onInstallApp}
                        className="px-8 py-4 bg-[#E2B859] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                      >
                        {appLanguage === "pl"
                          ? "ZAINSTALUJ TERAZ"
                          : "INSTALL NOW"}
                      </button>
                    )}
                  </div>

                  <div className="p-6 bg-[#E2B859]/5 border border-[#E2B859]/20 rounded-3xl">
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                      {appLanguage === "pl"
                        ? "Instalacja Christian Culture jako PWA pozwala na szybszy dostęp, pracę w trybie offline oraz pełną integrację z systemem powiadomień Android/iOS."
                        : "Installing Christian Culture as a PWA allows for faster access, offline work, and full integration with the Android/iOS notification system."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-zinc-800/50 space-y-8 backdrop-blur-sm">
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-6">
                  {appLanguage === "pl"
                    ? "Zarządzanie Systemem"
                    : "System Management"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={onHardRefresh}
                    className="group relative overflow-hidden py-6 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] text-zinc-300 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl border border-zinc-800 hover:border-[#E2B859]/50 hover:text-white transition-all shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E2B859]/0 via-[#E2B859]/5 to-[#E2B859]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    {appLanguage === "pl"
                      ? "WYMUŚ AKTUALIZACJĘ"
                      : "FORCE UPDATE"}
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          appLanguage === "pl"
                            ? "Czy na pewno chcesz wyczyścić wszystkie dane? Tej operacji nie można cofnąć."
                            : "Are you sure you want to clear all data? This action cannot be undone.",
                        )
                      ) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="py-6 bg-red-950/10 text-red-500 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl border border-red-900/20 hover:bg-red-900/20 transition-all shadow-xl"
                  >
                    {appLanguage === "pl"
                      ? "WYCZYŚĆ DANE (RESET)"
                      : "CLEAR DATA (RESET)"}
                  </button>
                </div>

                <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800/50">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    <span>
                      {appLanguage === "pl"
                        ? "Wersja Aplikacji"
                        : "App Version"}
                    </span>
                    <span className="text-[#E2B859]">v{APP_VERSION}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="animate-fade-in space-y-6 pb-10">
              <div className="bg-zinc-900/40 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-zinc-800/50 space-y-8 backdrop-blur-sm">
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-6">
                  {appLanguage === "pl" ? "O Nas" : "About Us"}
                </h4>

                <div className="space-y-4">
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {appLanguage === "pl"
                      ? "Christian Culture Lite to cyfrowe centrum duchowe, stworzone, aby wspierać Twoją codzienną modlitwę, studiowanie Pisma Świętego i życie w bliskości z Bogiem. Nasza misja to dostarczanie wysokiej jakości treści duchowych w nowoczesnej formie."
                      : "Christian Culture Lite is a digital spiritual center, created to support your daily prayer, study of the Holy Scripture, and life in closeness with God. Our mission is to provide high-quality spiritual content in a modern form."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back to main button - Solid Gold style */}
        <div className="p-10 border-t border-white/5 bg-zinc-900/30 flex-shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenRadioMode();
            }}
            className="w-full py-7 bg-gold-dark text-white font-black uppercase tracking-[0.25em] rounded-[2.5rem] shadow-[0_20px_60px_rgba(184,134,11,0.3)] text-xs hover:scale-[1.02] active:scale-95 transition-all"
          >
            {labels.returnBtn}
          </button>
        </div>
      </div>
      {isPrivacyModalOpen && (
        <PrivacyComplianceModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          appLanguage={appLanguage}
          isTickerExpanded={isTickerExpanded}
        />
      )}
    </div>
  );
};
