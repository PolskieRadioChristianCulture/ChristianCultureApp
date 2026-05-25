import React from "react";
import { X } from "lucide-react";

interface TvStudyModalProps {
  onClose: () => void;
}

export const TvStudyModal: React.FC<TvStudyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] p-6 border border-zinc-800">
        <button
          aria-label="Zamknij"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#C5A059] mb-4">
          Telewizyjne Studium Pisma Świętego
        </h2>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/videoseries?si=WhveAuLa1UQVSzwQ&amp;list=PLs8TgKBcNke1BIL1szN47GLzK9YFfyQNs"
            title="Telewizyjne Studium Pisma Świętego"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
