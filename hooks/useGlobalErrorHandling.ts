import { useEffect } from 'react';
import { nativeService } from '../services/nativeService';

export function useGlobalErrorHandling(
  appLanguage: string,
  addToast: (msg: string, type: 'success' | 'error' | 'info' | 'alert' | 'news', options?: any) => void
) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Tymczasowe wyciszenie wszystkich błędów dla wersji webowej (cclite.pl), ponieważ jest zawieszona
      if (!nativeService.isNative()) {
        return;
      }

      const msg = event.message || "";
      // Ignore common benign errors that are noisy but don't break the app
      const isBenign =
        msg === "Script error." ||
        msg.includes("Can only be used on") ||
        msg.includes("WebSocket") ||
        msg.includes("vite") ||
        msg.includes("stripe") ||
        msg.includes("payload");

      if (isBenign) {
        console.warn("[GlobalError] Ignored benign error:", msg);
        return;
      }

      const errorDetail = event.error
        ? event.error.stack || event.error.message || event.error
        : event.message;
      console.error("[GlobalError] Uncaught error:", errorDetail);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Tymczasowe wyciszenie wszystkich błędów dla wersji webowej (cclite.pl), ponieważ jest zawieszona
      if (!nativeService.isNative()) {
        return;
      }

      const reasonStr = event.reason ? String(event.reason) : "";
      const isBenign =
        reasonStr.includes("Can only be used on") ||
        reasonStr.includes("Script error") ||
        reasonStr.includes("WebSocket") ||
        reasonStr.includes("vite") ||
        reasonStr.includes("stripe") ||
        reasonStr.includes("payload") ||
        reasonStr.includes("Timeout: Message sending") ||
        reasonStr.includes("permission_denied") ||
        reasonStr.includes("Missing or insufficient") ||
        reasonStr.includes("the client is offline");

      if (isBenign) {
        console.warn(
          "[GlobalError] Ignored benign promise rejection:",
          reasonStr,
        );
        return;
      }

      console.error("[GlobalError] Unhandled promise rejection:", event.reason);
    };

    if (typeof window !== 'undefined') {
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);
    }

    return () => {
      if (typeof window !== 'undefined') {
          window.removeEventListener("error", handleError);
          window.removeEventListener(
            "unhandledrejection",
            handleUnhandledRejection,
          );
      }
    };
  }, [appLanguage, addToast]);
}
