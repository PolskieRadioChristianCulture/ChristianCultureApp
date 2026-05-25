import { useCallback } from 'react';
import { nativeService } from "../services/nativeService";

export const useSharing = (appLanguage: string) => {
  const handleShareRadio = useCallback(async () => {
    const shareText = appLanguage === "pl"
      ? "Słucham CC Radio! https://cclite.pl"
      : "Listening to CC Radio! https://cclite.pl";
    const success = await nativeService.share("CC Radio", shareText, "https://cclite.pl");
    if (!success) {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {}
    }
  }, [appLanguage]);

  const handleShareApp = useCallback(async () => {
    const shareText = appLanguage === "pl"
      ? "Polecam aplikację Christian Culture! https://cclite.pl"
      : "I recommend the Christian Culture app! https://cclite.pl";
    const success = await nativeService.share("Christian Culture", shareText, "https://cclite.pl");
    if (!success) {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {}
    }
  }, [appLanguage]);

  return { handleShareRadio, handleShareApp };
};
