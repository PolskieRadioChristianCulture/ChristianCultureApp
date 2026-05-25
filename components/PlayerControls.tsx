import React from 'react';
import { COLORS } from '../constants/ThemeConstants';
import { RadioStreamType } from '../types';

interface PlayerControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  isBuffering: boolean;
  activeStream: RadioStreamType;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onToggle,
  onNext,
  onPrev,
  isBuffering,
  activeStream
}) => {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10 py-4">
      {/* Prev Button */}
      <button
        onClick={onPrev}
        className="p-3 text-gold/60 hover:text-gold transition-colors active:scale-90"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Main Play/Pause Button */}
      <button
        onClick={onToggle}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 group ${isPlaying ? 'bg-black border-4 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)]' : 'bg-gold border-4 border-gold-light shadow-[0_0_40px_rgba(197,160,89,0.3)]'}`}
      >
        {isBuffering && (
          <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        )}

        {isPlaying ? (
          <div className="flex gap-2">
            <div className="w-2 h-8 bg-gold rounded-full animate-pulse"></div>
            <div className="w-2 h-8 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <svg className="w-10 h-10 text-black fill-current translate-x-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="p-3 text-gold/60 hover:text-gold transition-colors active:scale-90"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
