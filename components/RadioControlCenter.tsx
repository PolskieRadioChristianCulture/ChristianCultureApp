import React, { useState, useEffect } from "react";
import {
  RadioAlarm,
  fixOrphans,
  DAY_NAMES_PL,
  DAY_NAMES_EN,
  SupportedLanguage,
} from "../types";

interface RadioControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  alarm: RadioAlarm | null;
  onUpdateAlarm: (alarm: RadioAlarm) => void;
  appLanguage: SupportedLanguage;
}

export const RadioControlCenter: React.FC<RadioControlCenterProps> = ({
  isOpen,
  onClose,
  alarm,
  onUpdateAlarm,
  appLanguage,
}) => {
  const [localTime, setLocalTime] = useState(alarm?.time || "07:00");
  const [localStream, setLocalStream] = useState<"PL" | "GLOBAL" | "BIBLIA">(
    alarm?.stream || "PL",
  );
  const [localFade, setLocalFade] = useState(alarm?.fadeInEnabled ?? true);
  const [selectedDays, setSelectedDays] = useState<number[]>(
    alarm?.selectedDays || [0, 1, 2, 3, 4, 5, 6],
  );

  useEffect(() => {
    if (alarm) {
      setLocalTime(alarm.time);
      setLocalStream(alarm.stream as any);
      setLocalFade(alarm.fadeInEnabled);
      setSelectedDays(alarm.selectedDays);
    }
  }, [alarm]);

  if (!isOpen) return null;

  const currentDayNames = appLanguage === "pl" ? DAY_NAMES_PL : DAY_NAMES_EN;

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort(),
    );
  };

  const handleSetDaily = () => setSelectedDays([0, 1, 2, 3, 4, 5, 6]);

  const handleToggleAlarmEnabled = () => {
    const newAlarm: RadioAlarm = alarm || {
      id: "default",
      time: localTime,
      enabled: false,
      repeatDaily: true,
      stream: localStream,
      fadeInEnabled: localFade,
      selectedDays,
    };
    onUpdateAlarm({
      ...newAlarm,
      enabled: !newAlarm.enabled,
      time: localTime,
      stream: localStream,
      fadeInEnabled: localFade,
      selectedDays,
    });
  };

  const handleSaveAndClose = () => {
    const alarmToSave: RadioAlarm = alarm
      ? {
          ...alarm,
          time: localTime,
          stream: localStream,
          fadeInEnabled: localFade,
          selectedDays,
        }
      : {
          id: "default",
          time: localTime,
          enabled: true,
          repeatDaily: true,
          stream: localStream,
          fadeInEnabled: localFade,
          selectedDays,
        };
    onUpdateAlarm(alarmToSave);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in z-[3000]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-[3rem] p-8 sm:p-10 shadow-3xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Centrum" : "Radio"}{" "}
              <span className="text-[#E2B859]">
                {appLanguage === "pl" ? "Radia" : "Control"}
              </span>
            </h3>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              Management & Biblical Alarm
            </p>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin">
          <div className="bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  ⏰
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">
                    {appLanguage === "pl" ? "Budzik Radiowy" : "Radio Alarm"}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    Start with Praise
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleAlarmEnabled}
                className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${alarm?.enabled ? "bg-[#E2B859]" : "bg-zinc-800"}`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${alarm?.enabled ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>

            <div className="flex flex-col items-center gap-6">
              <input
                type="time"
                value={localTime}
                onChange={(e) => setLocalTime(e.target.value)}
                className="bg-black border border-zinc-800 text-[#E2B859] text-5xl font-black rounded-2xl p-4 w-full text-center focus:ring-2 focus:ring-[#E2B859] focus:outline-none transition-all"
              />

              <div className="w-full space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      {appLanguage === "pl" ? "WYBIERZ DNI" : "CHOOSE DAYS"}
                    </p>
                    <button
                      onClick={handleSetDaily}
                      className="text-[8px] font-black text-[#E2B859] uppercase tracking-widest hover:underline"
                    >
                      {appLanguage === "pl" ? "CODZIENNIE" : "DAILY"}
                    </button>
                  </div>
                  <div className="flex justify-between gap-1">
                    {currentDayNames.map((day, idx) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(idx)}
                        className={`w-10 h-10 rounded-full text-[10px] font-black transition-all flex items-center justify-center border ${
                          selectedDays.includes(idx)
                            ? "bg-[#E2B859] border-[#E2B859] text-white shadow-lg shadow-[#E2B859]/20"
                            : "bg-zinc-800 border-zinc-700 text-zinc-500"
                        }`}
                      >
                        {day.substring(0, 1).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest text-center">
                    {appLanguage === "pl" ? "WYBÓR STACJI" : "STATION CHOICE"}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setLocalStream("PL")}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${localStream === "PL" ? "bg-[#E2B859] text-white shadow-lg" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}
                    >
                      {appLanguage === "pl" ? "RADIO POLSKA" : "PL"}
                    </button>
                    <button
                      onClick={() => setLocalStream("GLOBAL")}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${localStream === "GLOBAL" ? "bg-[#E2B859] text-white shadow-lg" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}
                    >
                      {appLanguage === "pl" ? "GLOBAL CC" : "GLOBAL"}
                    </button>
                    <button
                      onClick={() => setLocalStream("BIBLIA")}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${localStream === "BIBLIA" ? "bg-[#E2B859] text-white shadow-lg" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}
                    >
                      {appLanguage === "pl" ? "BIBLIA AUDIO" : "BIBLIA"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">
                      {appLanguage === "pl"
                        ? "Narastająca Głośność"
                        : "Progressive Volume"}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">
                      Fade-in (5 min)
                    </span>
                  </div>
                  <button
                    onClick={() => setLocalFade(!localFade)}
                    className={`w-12 h-6 rounded-full p-1 transition-all duration-500 ${localFade ? "bg-[#E2B859]" : "bg-zinc-700"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-500 ${localFade ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 text-center italic leading-relaxed px-4">
                {appLanguage === "pl"
                  ? fixOrphans(
                      "Radio włączy się automatycznie o wybranej godzinie w zaznaczone dni tygodnia.",
                    )
                  : "The radio will start automatically at the selected time on the checked days."}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveAndClose}
          className="w-full py-5 mt-6 bg-[#E2B859] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#E2B859] transition-all shadow-xl active:scale-95"
        >
          {appLanguage === "pl" ? "ZAPISZ USTAWIENIA" : "SAVE SETTINGS"}
        </button>
      </div>
    </div>
  );
};
