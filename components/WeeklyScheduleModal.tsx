import React, { useState } from "react";
import { SchedulePanel } from "../components/SchedulePanel";

export const WeeklyScheduleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <SchedulePanel onClose={onClose} />
      </div>
    </div>
  );
};
