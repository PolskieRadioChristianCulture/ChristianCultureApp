import React, { useState, useEffect } from "react";

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: string;
}

export const StoreModal: React.FC<
  StoreModalProps & { isTickerExpanded?: boolean }
> = ({ isOpen, onClose, appLanguage, isTickerExpanded }) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setCountdown(30);
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (countdown <= 0 && isOpen) {
      onClose();
    }
  }, [countdown, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border-2 border-[#C5A059] rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(197,160,89,0.3)] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-[#C5A059] uppercase tracking-[0.3em]">
            {appLanguage === "pl" ? "SKLEP CC" : "CC SHOP"}
          </h3>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-zinc-900 text-zinc-400 hover:text-white rounded-full transition-all border border-zinc-800 shadow-xl active:scale-90 hover:bg-zinc-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="w-full">
          <iframe
            style={{ borderRadius: "24px", border: "none" }}
            src="https://embed.creator-spring.com/widget?slug=my-store-1009741&per=30&currency=&page=1&layout=carousel-small&theme=dark"
            title="Sklep CC Merch store powered by Spring"
            width="100%"
            height="420"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          ></iframe>
        </div>
        <p className="mt-4 mb-4 text-[10px] text-zinc-500 text-center font-bold uppercase tracking-widest">
          {appLanguage === "pl"
            ? `To okno zamknie się automatycznie za ${countdown}s...`
            : `This window will close automatically in ${countdown}s...`}
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 bg-[#C5A059] text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#C5A059]/90 transition-all shadow-lg active:scale-95 text-center"
        >
          {appLanguage === "pl" ? "ZAMKNIJ OKNO" : "CLOSE WINDOW"}
        </button>
      </div>
    </div>
  );
};
