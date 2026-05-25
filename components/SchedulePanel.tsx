import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAppStore } from "../useAppStore";
import { nativeService } from "../services/nativeService";

export const SchedulePanel: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const { dynamicDB, setDynamicDB } = useAppStore();
  const dayNames = [
    "Sobota",
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
  ];

  // Compute current day string
  const standardDayNames = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];
  const currentDayName = standardDayNames[new Date().getDay()];

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Check every 10 seconds for more responsiveness
    return () => clearInterval(interval);
  }, []);

  const [selectedDay, setSelectedDay] = useState<string | null>(currentDayName);

  let schedule = {};
  try {
    schedule = JSON.parse(dynamicDB["weeklySchedule"] || "{}");
  } catch (e) {
    console.error("Error parsing weeklySchedule:", e);
  }

  const reorderedSchedule = [
    schedule["6"],
    schedule["0"],
    schedule["1"],
    schedule["2"],
    schedule["3"],
    schedule["4"],
    schedule["5"],
  ];

  const checkIsCurrentProgram = (
    entries: any[],
    index: number,
    dayName: string,
  ) => {
    const currentRealDay = standardDayNames[currentTime.getDay()];
    if (dayName !== currentRealDay) return false;

    const entry = entries[index];
    if (!entry || !entry.time) return false;

    const [hours, mins] = entry.time.split(":").map(Number);
    const entryMins = hours * 60 + mins;

    const nowHours = currentTime.getHours();
    const nowMins = currentTime.getMinutes();
    const nowTotalMins = nowHours * 60 + nowMins;

    if (nowTotalMins < entryMins) return false;

    const nextEntry = entries[index + 1];
    if (nextEntry && nextEntry.time) {
      const [nHours, nMins] = nextEntry.time.split(":").map(Number);
      const nextMins = nHours * 60 + nMins;
      // Handle day wrap around edge cases if the schedule reaches midnight
      if (nextMins > entryMins && nowTotalMins >= nextMins) return false;
    }

    return true;
  };

  const handleSetReminder = async (entry: any, minutesStr: string) => {
    if (!minutesStr || isNaN(Number(minutesStr))) return;
    const minutes = Number(minutesStr);

    const targetDayIndex = standardDayNames.indexOf(selectedDay!);
    const now = new Date();
    let nextDate = new Date();
    let diff = (targetDayIndex + 7 - now.getDay()) % 7;

    nextDate.setDate(now.getDate() + diff);
    const [hours, mins] = entry.time.split(":").map(Number);
    nextDate.setHours(hours, mins, 0, 0);

    // Subtract reminder minutes
    const notificationTime = new Date(nextDate.getTime() - minutes * 60000);

    if (notificationTime.getTime() > now.getTime()) {
      await nativeService.scheduleLocalReminder(
        "Christian Culture Przypomnienie",
        `Za ${minutes} minut rozpocznie się: ${entry.title}`,
        notificationTime,
      );
      alert(
        `Powiadomienie systemowe ustawione na ${notificationTime.toLocaleTimeString()}`,
      );
    } else {
      alert(`Nie można ustawić powiadomienia w przeszłości.`);
      // if we are past today's time, it might be next week
      const nextWeekNotification = new Date(
        notificationTime.getTime() + 7 * 24 * 60 * 60 * 1000,
      );
      if (
        confirm(
          "Wydarzenie już minęło. Chcesz ustawić przypomnienie na następny tydzień?",
        )
      ) {
        await nativeService.scheduleLocalReminder(
          "Christian Culture Przypomnienie",
          `Za ${minutes} minut rozpocznie się: ${entry.title}`,
          nextWeekNotification,
        );
        alert(
          `Powiadomienie systemowe ustawione na ${nextWeekNotification.toLocaleString()}`,
        );
      }
    }
  };

  return (
    <div className="w-full animate-fade-in bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] p-6 rounded-[2rem] border border-white/5 text-white max-h-[85vh] overflow-y-auto relative scrollbar-thin scrollbar-thumb-zinc-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black uppercase tracking-widest text-[#C5A059]">
          {selectedDay ? (
            <button
              onClick={() => setSelectedDay(null)}
              className="text-sm mr-2 hover:text-white transition-colors"
            >
              &larr; Wróć do pełnej ramówki
            </button>
          ) : (
            "Dziś w programie"
          )}
        </h2>
        {onClose && (
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        )}
      </div>

      {selectedDay ? (
        <div className="animate-fade-in">
          <h3 className="font-bold text-2xl mb-4 text-[#C5A059]">
            {selectedDay}
          </h3>
          {/* Detailed view for selected day */}
          <div className="text-zinc-300">
            {(() => {
              const dayIdx = dayNames.indexOf(selectedDay);
              const dayEntries = reorderedSchedule[dayIdx];
              return dayEntries ? (
                <ul className="space-y-4">
                  {(dayEntries as any[]).map((entry: any, i: number) => {
                    const isCurrent = checkIsCurrentProgram(
                      dayEntries as any[],
                      i,
                      selectedDay!,
                    );
                    return (
                      <li
                        key={i}
                        className={`flex flex-col gap-2 p-4 rounded-xl border transition-all duration-500 ${isCurrent ? "bg-gold-dark/10 border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]" : "bg-zinc-900 border-white/5"}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 relative">
                            {isCurrent && (
                              <div className="absolute -left-[27px] top-1/2 -translate-y-1/2 w-2 h-10 bg-[#C5A059] rounded-r-md animate-pulse shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
                            )}
                            <span
                              className={`font-mono font-bold text-lg ${isCurrent ? "text-white" : "text-[#C5A059]"}`}
                            >
                              {entry.time}
                            </span>
                            <span
                              className={`text-lg ${isCurrent ? "text-[#C5A059] font-bold" : ""}`}
                            >
                              {entry.title}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const reminders = JSON.parse(
                                dynamicDB["userReminders"] || "[]",
                              );
                              reminders.push({
                                ...entry,
                                day: selectedDay,
                                reminderMinutes: 10,
                              });
                              setDynamicDB({
                                ...dynamicDB,
                                userReminders: JSON.stringify(reminders),
                              });

                              // Generate and download .ics file
                              const targetDayIndex =
                                standardDayNames.indexOf(selectedDay);

                              const now = new Date();
                              let nextDate = new Date();
                              let diff =
                                (targetDayIndex + 7 - now.getDay()) % 7;

                              nextDate.setDate(now.getDate() + diff);
                              const [hours, minutes] = entry.time
                                .split(":")
                                .map(Number);
                              nextDate.setHours(hours, minutes, 0, 0);

                              // if it's already passed today, assume next week
                              if (
                                diff === 0 &&
                                nextDate.getTime() < now.getTime()
                              ) {
                                nextDate.setDate(nextDate.getDate() + 7);
                              }

                              const formatDate = (date: Date) => {
                                return date
                                  .toISOString()
                                  .replace(/-|:|\.\d+/g, "");
                              };

                              const endDate = new Date(
                                nextDate.getTime() + 60 * 60 * 1000,
                              ); // 1 hour duration

                              const icsContent = [
                                "BEGIN:VCALENDAR",
                                "VERSION:2.0",
                                "BEGIN:VEVENT",
                                `DTSTART:${formatDate(nextDate)}`,
                                `DTEND:${formatDate(endDate)}`,
                                `SUMMARY:${entry.title}`,
                                "DESCRIPTION:Wydarzenie Christian Culture",
                                "END:VEVENT",
                                "END:VCALENDAR",
                              ].join("\r\n");

                              const blob = new Blob([icsContent], {
                                type: "text/calendar;charset=utf-8",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "wydarzenie_cc.ics";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);

                              alert(
                                `Dodano do kalendarza: ${entry.title}. Pobrano przypomnienie wieloplatformowe.`,
                              );
                            }}
                            className="w-10 h-10 rounded-full bg-[#C5A059] text-black flex items-center justify-center font-bold text-xl hover:scale-105 active:scale-95 transition-transform shrink-0"
                            title="Dodaj do kalendarza"
                          >
                            📅
                          </button>
                        </div>
                        <div className="border-t border-white/10 mt-2 pt-2 flex items-center gap-3">
                          <label
                            htmlFor={`reminder-select-${i}`}
                            className="text-xs text-zinc-400"
                          >
                            Powiadom systemowo:
                          </label>
                          <select
                            id={`reminder-select-${i}`}
                            onChange={(e) =>
                              handleSetReminder(entry, e.target.value)
                            }
                            className="text-xs bg-zinc-800 text-white px-2 py-1 rounded-full outline-none border border-zinc-700 hover:border-[#C5A059] transition-colors"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Wybierz czas...
                            </option>
                            <option value="5">5 min przed</option>
                            <option value="10">10 min przed</option>
                            <option value="15">15 min przed</option>
                          </select>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Brak wydarzeń w tym dniu.</p>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] p-2">
          {reorderedSchedule.map((dayEntries, idx) => {
            const dayName = dayNames[idx];
            const isSaturday = dayName === "Sobota";
            return (
              <div
                key={dayName}
                onClick={() => setSelectedDay(dayName)}
                className="cursor-pointer bg-zinc-900 p-4 rounded-xl border border-white/5 hover:border-[#C5A059]/50 transition-colors"
              >
                <h3
                  className={`font-bold mb-2 ${isSaturday ? "text-red-500" : "text-[#C5A059]"}`}
                >
                  {dayName}
                </h3>
                {dayEntries ? (
                  <ul className="text-sm text-zinc-300">
                    {dayEntries.map((entry: any, i: number) => {
                      const isCurrent = checkIsCurrentProgram(
                        dayEntries as any[],
                        i,
                        dayName,
                      );
                      return (
                        <li
                          key={i}
                          className={`mb-1 flex items-center ${isCurrent ? "bg-gold-dark/20 text-white font-bold p-1 rounded border border-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.3)]" : ""}`}
                        >
                          <span
                            className={`font-mono mr-2 ${isCurrent ? "text-white" : "text-zinc-500"}`}
                          >
                            {entry.time}
                          </span>
                          <span className={isCurrent ? "text-[#C5A059]" : ""}>
                            {entry.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-zinc-600">Brak propozycji</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
