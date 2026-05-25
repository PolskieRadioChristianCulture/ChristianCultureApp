import React from 'react';
import { BibleVerse, UserPersona } from '../types';
import { fixOrphans } from '../types';

interface VerseOverlayProps {
  verse: BibleVerse | null;
  userPersona: UserPersona;
  onOpenModal: () => void;
  isGlowActive?: boolean;
}

export const VerseOverlay: React.FC<VerseOverlayProps> = ({
  verse,
  userPersona,
  onOpenModal,
  isGlowActive = false
}) => {
  if (!verse) return null;

  const config = userPersona.dailyVerseConfig || { fontSize: 20, fontFamily: 'lora' };

  return (
    <div
      className={`w-full max-w-2xl px-6 py-10 text-center animate-fade-in transition-all duration-1000 cursor-pointer group ${isGlowActive ? 'glowing-gold-border rounded-[3rem] bg-black/20 backdrop-blur-sm' : ''}`}
      onClick={onOpenModal}
    >
      <p
        className={`text-white leading-relaxed tracking-tight group-hover:opacity-80 transition-opacity ${config.fontFamily === 'lora' ? 'font-bible' : ''}`}
        style={{ fontSize: `${config.fontSize}px` }}
      >
        "{fixOrphans(verse.text)}"
      </p>
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="h-[1px] w-12 bg-gold/40"></div>
        <p className="text-xs font-black text-gold uppercase tracking-[0.3em] opacity-80">
          {verse.reference}
        </p>
      </div>
    </div>
  );
};
