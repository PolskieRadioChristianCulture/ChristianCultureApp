import React, { useEffect } from "react";
import { APP_VERSION } from "../types";

export interface UpdateAvailableModalProps {
  isOpen: boolean;
  onUpdate: () => void;
  newAvailableVersion?: string | null;
  isErrorDriven?: boolean;
}

export const UpdateAvailableModal: React.FC<UpdateAvailableModalProps> = ({
  isOpen,
  onUpdate,
  newAvailableVersion,
  isErrorDriven = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      // 1. Play Soft Notification Sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        console.warn('Could not play update sound', e);
      }

      // 2. Vibrate if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f160b] via-[#050505] to-black px-6 py-12 text-center select-none font-sans animate-fade-in-overlay overflow-hidden">
      <div className="flex flex-col h-full w-full justify-between animate-fade-in-up-content">
        {/* Header */}
        <div className="mt-10">
          <h2 
            className="text-[#D4AF37] text-[26px] font-bold leading-snug tracking-wide uppercase"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {isErrorDriven ? "Dostępna nowa wersja\naplikacji" : "Konieczna aktualizacja\ndo nowej wersji aplikacji"}
          </h2>
          {!isErrorDriven && (
            <div className="text-[#D4AF37] opacity-90 text-2xl font-bold mt-2">
              V{newAvailableVersion || APP_VERSION}
            </div>
          )}
        </div>

        {/* Central Logo */}
        <div className="flex flex-1 items-center justify-center w-full my-8">
          <img 
            src="/android-chrome-512x512.png" 
            alt="Christian Culture Radio" 
            className="w-64 h-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.2)] object-contain"
          />
        </div>

        {/* Bottom Text and Action Button */}
        <div className="w-full space-y-8 pb-safe">
          <div className={`text-base leading-relaxed px-4 font-normal ${isErrorDriven ? "text-[#E2B859]" : "text-[#F5F5F5]"}`}>
            {isErrorDriven ? (
               <p>Wykryliśmy nową wersję plików.<br/>Zaktualizuj aplikację, aby uniknąć błędów.</p>
            ) : (
              <>
                <p>Korzystasz ze starej wersji aplikacji.</p>
                <p className="mt-1">
                  Zaktualizuj ją już teraz i sprawdź, co nowego<br />
                  przygotowaliśmy dla Ciebie!
                </p>
              </>
            )}
          </div>

          <button 
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.classList.remove('animate-pulse-gold');
              btn.innerText = "POBIERANIE...";
              btn.disabled = true;
              btn.style.opacity = "0.7";
              btn.style.boxShadow = "none";
              onUpdate();
            }}
            className="animate-pulse-gold w-full bg-[#E5BA73] hover:bg-[#D4AF37] text-black font-extrabold py-[18px] rounded-xl transition-all uppercase tracking-widest text-lg active:scale-95 shadow-[0_4px_14px_rgba(229,186,115,0.3)]"
          >
            Aktualizuj teraz
          </button>
        </div>
      </div>
    </div>
  );
};

