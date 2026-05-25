import { useEffect } from 'react';
import { App as CapacitorApp } from "@capacitor/app";
import { AppView } from '../App';
import { ToastMessage, SupportedLanguage } from '../types';

interface BackButtonProps {
  modals: Record<string, boolean>;
  closeAllModals: () => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  appLanguage: SupportedLanguage;
  addToast: (msg: string, type?: ToastMessage["type"]) => void;
  setShowWebSplash: (val: boolean) => void;
}

export const useBackButton = ({
  modals,
  closeAllModals,
  currentView,
  setCurrentView,
  appLanguage,
  addToast,
  setShowWebSplash,
}: BackButtonProps) => {
  useEffect(() => {
    let backPressCount = 0;
    let backPressTimer: NodeJS.Timeout;

    const backButtonListener = CapacitorApp.addListener(
      "backButton",
      ({ canGoBack }) => {
        // 1. Close open modals first
        const activeModal = Object.entries(modals).find(([_, isOpen]) => isOpen);
        if (activeModal) {
          closeAllModals();
          return;
        }

        // 2. If not in main view, go back to radio
        if (currentView !== "radio") {
          setCurrentView("radio");
          return;
        }

        // 3. Exit sequence
        if (backPressCount === 0) {
          backPressCount++;
          setShowWebSplash(true);
          addToast(
            appLanguage === "pl"
              ? "Naciśnij ponownie, aby wyjść"
              : "Press again to exit",
            "info",
          );
          backPressTimer = setTimeout(() => {
            backPressCount = 0;
            setShowWebSplash(false);
          }, 3000);
        } else {
          CapacitorApp.exitApp();
        }
      },
    );

    return () => {
      backButtonListener.then((l) => l.remove());
      if (backPressTimer) clearTimeout(backPressTimer);
    };
  }, [modals, closeAllModals, currentView, setCurrentView, appLanguage, addToast, setShowWebSplash]);
};
