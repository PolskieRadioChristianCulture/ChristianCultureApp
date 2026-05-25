import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { ToastMessage } from '../types';

// @ts-ignore
import { useRegisterSW } from "virtual:pwa-register/react";

export const usePWA = (addToast: (msg: string, type?: ToastMessage["type"], action?: any) => void) => {
  const { t } = useTranslation();
  const [installStatus, setInstallStatus] = useState<"install" | "installed" | "update">(() => {
    return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone
      ? "installed"
      : "install";
  });

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) { console.log("[PWA] Service Worker registered"); },
    onRegisterError(error) { console.error("[PWA] SW Error:", error); },
  });

  useEffect(() => {
    if (needRefresh) {
      addToast(t("app.update_available"), "info", {
        label: t("app.update_now"),
        onClick: () => updateServiceWorker(true),
      });
      setInstallStatus("update");
    }
  }, [needRefresh, addToast, t, updateServiceWorker]);

  return { installStatus, updateServiceWorker };
};
