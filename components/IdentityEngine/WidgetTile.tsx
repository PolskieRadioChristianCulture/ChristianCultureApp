import React from "react";
import { motion } from "motion/react";
import { Widget, fixOrphans } from "../../types";
import {
  ExternalLink,
  Youtube,
  Music,
  MessageCircle,
  Book,
  MessageSquare,
  Trash2,
  GripVertical,
} from "lucide-react";

interface WidgetTileProps {
  widget: Widget;
  isOwner: boolean;
  onDelete?: (id: string) => void;
  dragHandleProps?: any;
}

export const WidgetTile: React.FC<WidgetTileProps> = ({
  widget,
  isOwner,
  onDelete,
  dragHandleProps,
}) => {
  const renderContent = () => {
    switch (widget.type) {
      case "link":
        return (
          <a
            href={widget.metadata?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full h-full p-4 hover:bg-white/5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E2B859]/10 flex items-center justify-center text-[#E2B859] border border-[#E2B859]/20 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white uppercase tracking-tight truncate">
                {widget.metadata?.title || "Link"}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {widget.metadata?.url}
              </p>
            </div>
          </a>
        );

      case "social":
        return (
          <a
            href={widget.metadata?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 h-full text-center gap-2 hover:bg-white/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-[#E2B859] group-hover:border-[#E2B859]/30 border border-white/5 transition-all">
              {widget.metadata?.subType === "youtube" && (
                <Youtube className="w-6 h-6" />
              )}
              {widget.metadata?.subType === "facebook" && (
                <MessageCircle className="w-6 h-6" />
              )}
              {/* Default social icon if unknown */}
              {!["youtube", "facebook"].includes(
                widget.metadata?.subType || "",
              ) && <ExternalLink className="w-6 h-6" />}
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              {widget.metadata?.title}
            </p>
          </a>
        );

      case "multimedia":
        if (
          widget.metadata?.subType === "youtube" &&
          widget.metadata?.videoId
        ) {
          return (
            <div className="w-full h-full overflow-hidden rounded-2xl bg-black relative">
              <iframe
                title={`Wideo widgetu ${widget.metadata?.title}`}
                src={`https://www.youtube.com/embed/${widget.metadata.videoId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          );
        }
        return (
          <div className="flex items-center gap-4 p-4 h-full bg-zinc-900/50 rounded-2xl border border-white/5">
            <Music className="w-8 h-8 text-[#E2B859]" />
            <div>
              <p className="text-xs font-black text-white uppercase tracking-tight">
                {widget.metadata?.title || "Multimedia"}
              </p>
              <p className="text-[10px] text-zinc-500">
                Odtwarzacz multimedialny
              </p>
            </div>
          </div>
        );

      case "spiritual":
        return (
          <div className="p-5 h-full flex flex-col justify-center bg-gradient-to-br from-[#E2B859]/10 to-transparent border border-[#E2B859]/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Book className="w-4 h-4 text-[#E2B859]" />
              <p className="text-[10px] font-black text-[#E2B859] uppercase tracking-[0.2em]">
                Słowo Boże
              </p>
            </div>
            <p className="text-[11px] text-zinc-200 font-serif italic leading-relaxed">
              "{fixOrphans(widget.content)}"
            </p>
            {widget.metadata?.title && (
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-2">
                {widget.metadata.title}
              </p>
            )}
          </div>
        );

      case "communication":
        return (
          <button
            aria-label="Wiadomości"
            className="flex items-center justify-center gap-3 w-full h-full bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-2xl border border-white/10 group"
          >
            <MessageSquare className="w-5 h-5 text-[#E2B859] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {widget.metadata?.title || "Kontakt"}
            </span>
          </button>
        );

      default:
        return (
          <div className="p-4 text-zinc-500 text-[10px]">Unknown Widget</div>
        );
    }
  };

  return (
    <div className="relative group/tile w-full h-full bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all overflow-hidden shadow-xl">
      {renderContent()}

      {isOwner && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/tile:opacity-100 transition-opacity">
          <div
            {...dragHandleProps}
            className="p-1.5 bg-black/60 rounded-md text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <button
            aria-label="Usuń"
            onClick={() => onDelete?.(widget.id)}
            className="p-1.5 bg-red-950/60 rounded-md text-red-500 hover:bg-red-900/80 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
