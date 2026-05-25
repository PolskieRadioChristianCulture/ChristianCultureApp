import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RadioStreamType, VisualMode } from '../types';
import { BACKGROUND_IDS, BIBLE_BACKGROUND_IDS, GLOBAL_BACKGROUND_IDS } from '../config';
import { useCustomBackgrounds } from '../hooks/useCustomBackgrounds';

interface RotatingBackgroundProps {
  activeStream: RadioStreamType;
  visualMode: VisualMode;
}

export const RotatingBackground: React.FC<RotatingBackgroundProps> = ({ activeStream, visualMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadError, setLoadError] = useState<Record<string, boolean>>({});
  const prevActiveIdRef = useRef<string | null>(null);
  const {
    backgrounds: customBackgrounds,
    isActive: areCustomCustomBackgroundsActive,
  } = useCustomBackgrounds();

  const currentBackgroundSet = useMemo(() => {
    if (areCustomCustomBackgroundsActive && customBackgrounds.length > 0) {
      return customBackgrounds.map((bg) => bg.url);
    }
    if (activeStream === "BIBLIA") return GLOBAL_BACKGROUND_IDS;
    if (activeStream === "GLOBAL") return BIBLE_BACKGROUND_IDS;
    return BACKGROUND_IDS;
  }, [activeStream, customBackgrounds, areCustomCustomBackgroundsActive]);

  useEffect(() => {
    setCurrentIndex(0);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentBackgroundSet.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [currentBackgroundSet]);

  const handleImageError = (id: string) => {
    console.warn(`[Background] Failed to load image: ${id}`);
    setLoadError((prev) => ({ ...prev, [id]: true }));
  };

  const filterStyle = useMemo(() => {
    if (visualMode === "sabbath") {
      return "brightness(0.55) contrast(1.05) saturate(1.2) sepia(0.35) hue-rotate(-5deg)";
    }
    if (visualMode === "night") {
      return "brightness(0.3) contrast(1.15) saturate(0.6) hue-rotate(20deg)";
    }
    return activeStream === "BIBLIA"
      ? "brightness(0.5) contrast(1.1) saturate(0.9) sepia(0.1)"
      : "brightness(0.6) contrast(1.1) saturate(0.85)";
  }, [visualMode, activeStream]);

  const visibleBackgrounds = currentBackgroundSet.filter((id) => !loadError[id]);
  const activeId = visibleBackgrounds.length > 0
    ? visibleBackgrounds[currentIndex % visibleBackgrounds.length]
    : currentBackgroundSet[0];

  useEffect(() => { if (activeId) prevActiveIdRef.current = activeId; }, [activeId]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-zinc-900">
      {currentBackgroundSet.map((id, index) => {
        const imageUrl = id.startsWith("blob:") || id.startsWith("/")
          ? id
          : `https://drive.google.com/thumbnail?id=${id}&sz=w1920`;
        if (!imageUrl || loadError[id]) return null;

        const isActive = id === activeId;
        const isPrev = id === prevActiveIdRef.current && !isActive;

        return (
          <div
            key={id}
            className={`absolute inset-0 transition-opacity duration-[4000ms] ease-in-out ${isActive ? "opacity-100 z-10" : isPrev ? "opacity-100 z-0" : "opacity-0 z-0"}`}
          >
            <img
              src={imageUrl}
              alt="Background"
              className={`w-full h-full object-cover object-center ${index % 2 === 0 ? "animate-ken-burns-1" : "animate-ken-burns-2"}`}
              style={{ filter: filterStyle, transition: "filter 4s ease-in-out" }}
              onError={() => handleImageError(id)}
              referrerPolicy="no-referrer"
            />
          </div>
        );
      })}
      <div className={`absolute inset-0 z-10 transition-colors duration-[3000ms] ${
        visualMode === "sabbath"
          ? "bg-gradient-to-b from-amber-900/40 via-transparent to-black/90"
          : visualMode === "night"
            ? "bg-gradient-to-b from-indigo-950/60 via-transparent to-black/95"
            : "bg-gradient-to-b from-black/60 via-transparent to-black/85"
      }`} />
      <div className={`divine-rays z-20 transition-opacity duration-[3000ms] ${
        visualMode === "sabbath"
          ? "opacity-[0.12] text-amber-500"
          : visualMode === "night"
            ? "opacity-[0.06] text-indigo-400"
            : "opacity-[0.08]"
      }`} />
    </div>
  );
};
