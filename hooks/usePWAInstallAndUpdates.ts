import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from "virtual:pwa-register/react";
import { SystemNotification, APP_VERSION } from '../types';
import { NotificationService } from '../services/notificationService';
import { PersistenceService } from '../services/persistenceService';

export function usePWAInstallAndUpdates(
  appLanguage: string,
  appStarted: boolean,
  addToast: (msg: string, type: 'success' | 'error' | 'info', options?: any) => void,
  t: (key: string) => string,
  setSystemNotifications: React.Dispatch<React.SetStateAction<SystemNotification[]>>
) {
  const [installStatus, setInstallStatus] = useState<"install" | "installed" | "update">(() => {
    if (typeof window === 'undefined') return "install";
    return window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone
      ? "installed"
      : "install";
  });

  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [updateRegistration, setUpdateRegistration] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isInstallationGuideOpen, setIsInstallationGuideOpen] = useState(false);
  const [newAvailableVersion, setNewAvailableVersion] = useState<string | null>(null);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("[PWA] Service Worker registered");
      setUpdateRegistration(r);
    },
    onRegisterError(error) {
      console.error("[PWA] Service Worker registration failed:", error);
    },
  });

  useEffect(() => {
    if (needRefresh && updateRegistration?.waiting) {
      setIsUpdatePending(true);
      
      // Request version from waiting service worker
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'VERSION_INFO') {
          console.log("[SW] Otrzymano info o nowej wersji:", event.data.version);
          setNewAvailableVersion(event.data.version);
          navigator.serviceWorker.removeEventListener("message", handleMessage);
        }
      };
      
      if (typeof navigator !== "undefined" && navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("message", handleMessage);
        updateRegistration.waiting.postMessage({ type: 'GET_VERSION' });
      }
    }
  }, [needRefresh, updateRegistration]);

  // Show update toast and modal when app is started and update is pending
  useEffect(() => {
    if (isUpdatePending && appStarted) {
      console.log("[SW] Wyświetlanie powiadomienia o aktualizacji po starcie aplikacji.");

      // Pokazujemy modal jeśli jeszcze nie był pokazany w tej sesji
      if (typeof sessionStorage !== 'undefined') {
        const modalShown = sessionStorage.getItem("cc_update_modal_shown");
        if (!modalShown) {
          setIsUpdateModalOpen(true);
          sessionStorage.setItem("cc_update_modal_shown", "true");
        }
      }

      if (installStatus !== "update") {
        addToast(t("app.update_available"), "info", {
          label: t("app.update_now"),
          onClick: () => {
            updateServiceWorker(true);
          },
        });
        setInstallStatus("update");
      }
    }
  }, [
    isUpdatePending,
    appStarted,
    installStatus,
    addToast,
    t,
    updateServiceWorker,
  ]);

  // Okresowe sprawdzanie aktualizacji (co godzinę)
  useEffect(() => {
    const checkForUpdates = async () => {
      if (typeof navigator !== 'undefined' && "serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            console.log("[SW] Sprawdzanie dostępności aktualizacji...");
            registration.update();
          }
        } catch (error) {
          console.warn("[SW] Błąd podczas sprawdzania aktualizacji:", error);
        }
      }
    };

    const interval = setInterval(checkForUpdates, 60 * 60 * 1000); // 1 hour
    if (document.readyState === "complete") {
      checkForUpdates();
    } else {
      window.addEventListener("load", checkForUpdates);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", checkForUpdates);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (installStatus !== "installed") {
        setInstallStatus("install");
      }
    };
    const handleAppInstalled = () => {
      setInstallStatus("installed");
      setDeferredPrompt(null);
      addToast(t("install.success"), "success");
    };
    if (typeof window !== 'undefined') {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      }
    };
  }, [installStatus, addToast, t]);

  const triggerDirectInstall = useCallback(async () => {
    if (installStatus === "update") {
      if (typeof navigator !== 'undefined' && "serviceWorker" in navigator) {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
            return;
          }
        } catch (err) {
          console.error("[SW] Update failed:", err);
        }
      }
      window.location.reload();
      return;
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstallStatus("installed");
        }
        setDeferredPrompt(null);
      } catch (err) {
        setIsInstallationGuideOpen(true);
      }
    } else {
      setIsInstallationGuideOpen(true);
    }
  }, [deferredPrompt, installStatus]);

  useEffect(() => {
    setSystemNotifications((prev) => {
      const lastShownVersion = PersistenceService.safeGetItem("cc_last_shown_version", null);
      if (lastShownVersion !== APP_VERSION) {
        const initialNotifs: SystemNotification[] = [
          ...prev,
          {
            id: `update-${APP_VERSION}`,
            title: appLanguage === "pl" ? "NOWA WERSJA SYSTEMU" : "NEW SYSTEM UPDATE",
            message:
              appLanguage === "pl"
                ? `Christian Culture v${APP_VERSION} jest podłączona. Ciesz się bezproblemowym działaniem Radia HI-RES i nowym planerem.`
                : `Christian Culture v${APP_VERSION} is now active. Enjoy HI-RES radio and the new planner.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            type: "success",
            icon: "🌟",
          },
        ];
        PersistenceService.safeSetItem("cc_last_shown_version", JSON.stringify(APP_VERSION));
        return initialNotifs;
      }
      return prev;
    });
  }, [appLanguage, setSystemNotifications]);

  useEffect(() => {
    if (installStatus === "install" && deferredPrompt) {
      const installNotif: SystemNotification = {
        id: "install-prompt",
        title: appLanguage === "pl" ? "ZAINSTALUJ CC RADIO" : "INSTALL CC RADIO",
        message:
          appLanguage === "pl"
            ? "Zainstaluj Christian Culture na swoim urządzeniu, aby uzyskać status samodzielnej aplikacji PWA."
            : "Install Christian Culture on your device to get standalone PWA status.",
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "success",
        icon: "📲",
        action: {
          label: appLanguage === "pl" ? "ZAINSTALUJ TERAZ" : "INSTALL NOW",
          onClick: triggerDirectInstall,
        },
      };

      setSystemNotifications((prev) => {
        if (prev.some((n) => n.id === "install-prompt")) return prev;
        return [installNotif, ...prev];
      });
    }
  }, [
    installStatus,
    deferredPrompt,
    appLanguage,
    triggerDirectInstall,
    setSystemNotifications,
  ]);

  return {
    installStatus,
    isUpdatePending,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    isInstallationGuideOpen,
    setIsInstallationGuideOpen,
    triggerDirectInstall,
    updateServiceWorker,
    newAvailableVersion
  };
}
