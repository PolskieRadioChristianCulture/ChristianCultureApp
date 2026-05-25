import { useState, useCallback, useEffect } from 'react';
import { ToastMessage } from '../types';

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: ToastMessage["type"] = "info",
      action?: ToastMessage["action"],
    ): string => {
      const id = Math.random().toString(36).substr(2, 9);
      let finalMessage = message;
      let finalAction = action;

      if (type === "alert") {
        finalMessage = `Przepraszamy za błąd, cały czas pracujemy nad rozwojem platformy Christian Culture. Może chcesz nam w tym pomóc? (Błąd: ${message})`;
        finalAction = {
          label: "Napisz do nas",
          onClick: () => {
            window.open("https://chat.whatsapp.com/KiNyDmllfyM8TI6xwDe7L2", "_blank");
          },
        };
      }

      setToasts((prev) => [...prev, { id, message: finalMessage, type, action: finalAction }]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleGlobalToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        addToast(customEvent.detail.message, customEvent.detail.type || "info");
      }
    };
    window.addEventListener("cc_show_toast", handleGlobalToast);
    return () => window.removeEventListener("cc_show_toast", handleGlobalToast);
  }, [addToast]);

  return { toasts, addToast, removeToast };
};
