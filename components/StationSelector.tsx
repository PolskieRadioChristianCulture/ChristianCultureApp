import React from 'react';
import { RadioStreamType } from '../types';
import { COLORS } from '../constants/ThemeConstants';

interface StationSelectorProps {
  activeStream: RadioStreamType;
  onSwitch: (stream: RadioStreamType) => void;
  appLanguage: string;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  activeStream,
  onSwitch,
  appLanguage
}) => {
  const STATIONS = [
    { id: 'PL' as RadioStreamType, label: appLanguage === 'pl' ? 'RADIO POLSKA' : 'RADIO POLAND', color: '#C5A059' },
    { id: 'GLOBAL' as RadioStreamType, label: appLanguage === 'pl' ? 'CC GLOBAL' : 'CC GLOBAL', color: '#E2B859' },
    { id: 'BIBLIA' as RadioStreamType, label: appLanguage === 'pl' ? 'BIBLIA AUDIO' : 'AUDIO BIBLE', color: '#A68043' }
  ];

  return (
    <div className="flex gap-2 p-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
      {STATIONS.map((station) => (
        <button
          key={station.id}
          onClick={() => onSwitch(station.id)}
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeStream === station.id ? 'bg-gold text-black shadow-lg scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
        >
          {station.label}
        </button>
      ))}
    </div>
  );
};
