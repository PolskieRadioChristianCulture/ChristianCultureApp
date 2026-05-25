import React from 'react';
import { PrayerIntentions } from './PrayerIntentions';
import { UserPersona } from '../types';

interface PrayerIntentionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPersona: UserPersona;
  isIntentionsBarVisible: boolean;
}

export const PrayerIntentionsModal: React.FC<PrayerIntentionsModalProps> = ({
  isOpen,
  onClose,
  userPersona,
  isIntentionsBarVisible,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[6000] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-fade-in ${isIntentionsBarVisible ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-gold/30 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-8 p-2 text-zinc-500 hover:text-gold transition-all hover:scale-110 z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5} />
          </svg>
        </button>
        <PrayerIntentions
          userId={userPersona.googleEmail || "guest"}
          userName={userPersona.name}
        />
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 hover:text-gold transition-colors"
          >
            ZAMKNIJ ARCHIWUM INTENCJI
          </button>
        </div>
      </div>
    </div>
  );
};
