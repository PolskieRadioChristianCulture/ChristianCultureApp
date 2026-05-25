import React from "react";

interface SeparatorProps {
  text?: string;
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
  text,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center w-full flex-shrink-0 ${className}`}
    >
      <div className="flex-grow min-w-[30px] sm:min-w-[60px] h-[2px] bg-gradient-to-r from-transparent via-[#B5925E]/50 to-[#B5925E] shadow-[0_0_10px_rgba(181,146,94,0.4)]" />
      {text && (
        <span className="text-[#B5925E] mx-4 sm:mx-6 font-bold text-[0.8rem] sm:text-[1rem] tracking-[0.3em] sm:tracking-[0.5em] uppercase whitespace-nowrap text-glow-gold">
          {text}
        </span>
      )}
      <div className="flex-grow min-w-[30px] sm:min-w-[60px] h-[2px] bg-gradient-to-l from-transparent via-[#B5925E]/50 to-[#B5925E] shadow-[0_0_10px_rgba(181,146,94,0.4)]" />
    </div>
  );
};
