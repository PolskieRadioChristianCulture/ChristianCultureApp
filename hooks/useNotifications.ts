import { useEffect } from 'react';
import { useAppStore } from "../useAppStore";
import { NotificationService } from "../services/notificationService";
import { APP_VERSION } from "../types";

export const useNotifications = (appLanguage: string, installStatus: string, triggerDirectInstall: () => void) => {
  const { systemNotifications, setSystemNotifications } = useAppStore();

  useEffect(() => {
    const checkUpdates = () => {
      const now = new Date();
      const hour = now.getHours();
      const currentSlot = NotificationService.getUpdateSlot(hour);
      if (currentSlot === "cuda") return;

      const lastUpdateStr = localStorage.getItem("cc_last_notif_update");
      if (currentSlot && NotificationService.shouldUpdate(lastUpdateStr, currentSlot)) {
        const newNotif = NotificationService.generateNotification(currentSlot, appLanguage);
        setSystemNotifications((prev) => prev.some((n) => n.id === newNotif.id) ? prev : [newNotif, ...prev]);
        localStorage.setItem("cc_last_notif_update", JSON.stringify({ date: now.toDateString(), slot: currentSlot }));
      }
    };
    checkUpdates();
    const interval = setInterval(checkUpdates, 60000);
    return () => clearInterval(interval);
  }, [appLanguage, setSystemNotifications]);

  useEffect(() => {
    const lastShownVersion = localStorage.getItem("cc_last_shown_version");
    if (lastShownVersion !== APP_VERSION) {
      const welcomeNotif = {
        id: "welcome",
        title: appLanguage === "pl" ? "Witaj w CC RADIO!" : "Welcome to CC RADIO!",
        message: appLanguage === "pl" ? `v${APP_VERSION} jest aktywna.` : `v${APP_VERSION} is active.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "success" as const,
        icon: "🌟",
      };
      setSystemNotifications((prev) => [welcomeNotif, ...prev]);
      localStorage.setItem("cc_last_shown_version", APP_VERSION);
    }
  }, [appLanguage, setSystemNotifications]);

  useEffect(() => {
    if (installStatus === "install") {
      const installNotif = {
        id: "install-prompt",
        title: appLanguage === "pl" ? "ZAINSTALUJ CC RADIO" : "INSTALL CC RADIO",
        message: appLanguage === "pl" ? "Zainstaluj jako PWA." : "Install as PWA.",
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "success" as const,
        icon: "📲",
        action: { label: appLanguage === "pl" ? "ZAINSTALUJ" : "INSTALL", onClick: triggerDirectInstall },
      };
      setSystemNotifications((prev) => prev.some((n) => n.id === "install-prompt") ? prev : [installNotif, ...prev]);
    }
  }, [installStatus, appLanguage, triggerDirectInstall, setSystemNotifications]);
};
