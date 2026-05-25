import React, { useState, useEffect, useRef } from "react";
import { MonitorUp } from "lucide-react";
import { Responsive, Layout } from "react-grid-layout";
import { Calendar } from "../Calendar";
import { DailyDetail } from "../DailyDetail";
import { getLocalDateString } from "../../types";
import type { AppView } from "../../App";

const WidthProvider = (ComposedComponent: any) => {
  return (props: any) => {
    const [width, setWidth] = useState(1200);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current) setWidth(ref.current.offsetWidth);
      const handleResize = () => {
        if (ref.current) setWidth(ref.current.offsetWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <div ref={ref} className="w-full">
        <ComposedComponent {...props} width={width} />
      </div>
    );
  };
};

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardView: React.FC<{
  plannerLayouts: any;
  setPlannerLayouts: (layouts: any) => void;
  uiLang: any;
  notes: any[];
  prayers: any[];
  dailyGoals: any[];
  dailyTasks: any[];
  setPrayers: (prayers: any[]) => void;
  setDailyGoals: (goals: any[]) => void;
  setDailyTasks: (tasks: any[]) => void;
  setNotes: (notes: any[]) => void;
  spiritualGoals: any;
  setSpiritualGoals: (goals: any) => void;
  dailyGoalProgress: any;
  setDailyGoalProgress: (progress: any) => void;
  globalAmensCount: number;
  dailyAmensCount: number;
  dailyVerse: any;
  userPersona: any;
  radioAlarm: any;
  openManagement: (tab: any) => void;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  addToast: (msg: string, type?: any) => void;
  setSelectedDailyVerseForModal: (v: any) => void;
  setIsDailyVerseModalOpen: (open: boolean) => void;
  setCurrentView: (view: AppView) => void;
  setIsBiblicalSchoolOpen: (open: boolean) => void;
  setIsSupportModalOpen: (open: boolean) => void;
  isLandscape: boolean;
  toggleFavorite: (item: any) => void;
  handleGoogleIdentityLink: () => void;
  isSyncing: boolean;
  setAreAllWidgetsHidden: (v: boolean) => void;
}> = ({
  plannerLayouts,
  setPlannerLayouts,
  uiLang,
  notes,
  prayers,
  dailyGoals,
  dailyTasks,
  setPrayers,
  setDailyGoals,
  setDailyTasks,
  setNotes,
  spiritualGoals,
  setSpiritualGoals,
  dailyGoalProgress,
  setDailyGoalProgress,
  globalAmensCount,
  dailyAmensCount,
  dailyVerse,
  userPersona,
  radioAlarm,
  openManagement,
  setIsVoiceAssistantOpen,
  addToast,
  setSelectedDailyVerseForModal,
  setIsDailyVerseModalOpen,
  setCurrentView,
  setIsBiblicalSchoolOpen,
  setIsSupportModalOpen,
  isLandscape,
  toggleFavorite,
  handleGoogleIdentityLink,
  isSyncing,
  setAreAllWidgetsHidden,
}) => {
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto px-2 lg:px-4 py-2 lg:py-4 scrollbar-thin">
      <div className="w-full h-full flex-1">
        <div className="hidden lg:block w-full h-full style-kafelki">
          <ResponsiveGridLayout
            className="layout"
            layouts={plannerLayouts}
            onLayoutChange={(_, allLayouts: any) =>
              setPlannerLayouts(allLayouts)
            }
            breakpoints={{
              lg: 1024,
              md: 768,
              sm: 640,
              xs: 480,
              xxs: 0,
            }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={80}
            isDraggable={true}
            isResizable={true}
            margin={[24, 24]}
            draggableHandle=".drag-handle"
          >
            <div
              key="calendar"
              className="relative group bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/80 border border-white/5 hover:border-[#D4AF37]/30 transition-all rounded-[2rem] shadow-2xl overflow-hidden flex flex-col pt-8"
            >
              <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900 border-b border-white/5 flex items-center justify-center cursor-move drag-handle transition-colors hover:bg-zinc-800 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAreAllWidgetsHidden(false);
                    localStorage.setItem("cc_widget_calendar_visible", "true");
                    window.dispatchEvent(new Event("cc_widgets_updated"));
                    addToast(
                      uiLang === "pl"
                        ? "Przeniesiono Calendar na pulpit."
                        : "Moved Calendar to desktop.",
                      "success",
                    );
                    setCurrentView("radio");
                  }}
                  className="absolute right-4 text-zinc-500 hover:text-white transition-colors drag-cancel flex items-center gap-1 z-[60]"
                  title={
                    uiLang === "pl" ? "Przenieś na pulpit" : "Move to Desktop"
                  }
                >
                  <MonitorUp className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">
                    {uiLang === "pl" ? "Pulpit" : "Desktop"}
                  </span>
                </button>
              </div>
              <div className="w-full h-full overflow-y-auto scrollbar-hide">
                <Calendar
                  selectedDate={new Date()}
                  onDateSelect={() => {}}
                  theme="dark"
                  appLanguage={uiLang}
                  notes={notes}
                  prayers={prayers}
                  dailyGoals={dailyGoals}
                  dailyTasks={dailyTasks}
                  onOpenDashboard={() => setCurrentView("dashboard")}
                />
              </div>
            </div>

            <div
              key="dashboard"
              className="relative group bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/80 border border-white/5 hover:border-[#D4AF37]/30 transition-all rounded-[2rem] shadow-2xl overflow-hidden flex flex-col pt-8"
            >
              <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900 border-b border-white/5 flex items-center justify-center cursor-move drag-handle transition-colors hover:bg-zinc-800 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAreAllWidgetsHidden(false);
                    localStorage.setItem("cc_widget_dashboard_visible", "true");
                    window.dispatchEvent(new Event("cc_widgets_updated"));
                    addToast(
                      uiLang === "pl"
                        ? "Przeniesiono Daily Detail na pulpit."
                        : "Moved Daily Detail to desktop.",
                      "success",
                    );
                    setCurrentView("radio");
                  }}
                  className="absolute right-4 text-zinc-500 hover:text-white transition-colors drag-cancel flex items-center gap-1 z-[60]"
                  title={
                    uiLang === "pl" ? "Przenieś na pulpit" : "Move to Desktop"
                  }
                >
                  <MonitorUp className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">
                    {uiLang === "pl" ? "Pulpit" : "Desktop"}
                  </span>
                </button>
              </div>
              <div className="w-full h-full overflow-y-auto scrollbar-hide">
                <DailyDetail
                  globalAmensCount={globalAmensCount}
                  dailyAmensCount={dailyAmensCount}
                  date={new Date()}
                  dailyVerse={dailyVerse}
                  appLanguage={uiLang}
                  userPersona={userPersona}
                  weatherData={null}
                  radioAlarm={radioAlarm}
                  onOpenRadioControl={() => openManagement("alarm")}
                  onOpenManagement={openManagement}
                  isMiriamUnlocked={true}
                  onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
                  prayers={prayers}
                  onAddPrayer={(content, time) => {
                    const newPrayer = {
                      id: Date.now().toString(),
                      content,
                      date: new Date().toISOString().split("T")[0],
                      reminderTime: time,
                      completed: false,
                      createdAt: new Date().toISOString(),
                    };
                    setPrayers([...prayers, newPrayer]);
                  }}
                  onUpdatePrayer={(id, content, time, completed) =>
                    setPrayers(
                      prayers.map((p) =>
                        p.id === id
                          ? { ...p, content, reminderTime: time, completed }
                          : p,
                      ),
                    )
                  }
                  onDeletePrayer={(id) =>
                    setPrayers(prayers.filter((p) => p.id !== id))
                  }
                  dailyGoals={dailyGoals}
                  onAddDailyGoal={(content) => {
                    const newGoal = {
                      id: Date.now().toString(),
                      content,
                      date: new Date().toISOString().split("T")[0],
                      completed: false,
                      createdAt: new Date().toISOString(),
                    };
                    setDailyGoals([...dailyGoals, newGoal]);
                  }}
                  onUpdateDailyGoal={(id, content, completed) =>
                    setDailyGoals(
                      dailyGoals.map((g) =>
                        g.id === id ? { ...g, content, completed } : g,
                      ),
                    )
                  }
                  onDeleteDailyGoal={(id) =>
                    setDailyGoals(dailyGoals.filter((g) => g.id !== id))
                  }
                  dailyTasks={dailyTasks}
                  onAddDailyTask={(content) => {
                    const newTask = {
                      id: Date.now().toString(),
                      content,
                      date: new Date().toISOString().split("T")[0],
                      completed: false,
                      createdAt: new Date().toISOString(),
                    };
                    setDailyTasks([...dailyTasks, newTask]);
                  }}
                  onUpdateDailyTask={(id, content, completed) =>
                    setDailyTasks(
                      dailyTasks.map((t) =>
                        t.id === id ? { ...t, content, completed } : t,
                      ),
                    )
                  }
                  onDeleteDailyTask={(id) =>
                    setDailyTasks(dailyTasks.filter((t) => t.id !== id))
                  }
                  note={
                    notes.find((n) => n.date === getLocalDateString(new Date()))
                      ?.content || ""
                  }
                  onUpdateNote={(content) => {
                    const today = getLocalDateString(new Date());
                    const existing = notes.find((n) => n.date === today);
                    if (existing) {
                      setNotes(
                        notes.map((n) =>
                          n.date === today ? { ...n, content } : n,
                        ),
                      );
                    } else {
                      setNotes([
                        ...notes,
                        {
                          id: Date.now().toString(),
                          date: today,
                          content,
                          createdAt: new Date().toISOString(),
                        },
                      ]);
                    }
                  }}
                  spiritualGoals={spiritualGoals}
                  setSpiritualGoals={setSpiritualGoals}
                  dailyGoalProgress={dailyGoalProgress}
                  setDailyGoalProgress={setDailyGoalProgress}
                  addToast={addToast}
                  theme="dark"
                  onOpenDailyVerseModal={(v) => {
                    setSelectedDailyVerseForModal(v);
                    setIsDailyVerseModalOpen(true);
                  }}
                  onOpenRadioMode={() => setCurrentView("radio")}
                  onOpenBiblicalSchool={() => setIsBiblicalSchoolOpen(true)}
                  onOpenSupport={() => setIsSupportModalOpen(true)}
                  isLandscape={isLandscape}
                  onToggleFavorite={toggleFavorite}
                  onGoogleLogin={handleGoogleIdentityLink}
                  isSyncing={isSyncing}
                />
              </div>
            </div>
          </ResponsiveGridLayout>
        </div>

        <div className="lg:hidden flex flex-col gap-6">
          <Calendar
            selectedDate={new Date()}
            onDateSelect={() => {}}
            theme="dark"
            appLanguage={uiLang}
            notes={notes}
            dailyGoals={dailyGoals}
            dailyTasks={dailyTasks}
            prayers={prayers}
            onOpenDashboard={() => setCurrentView("dashboard")}
          />
          <DailyDetail
            globalAmensCount={globalAmensCount}
            dailyAmensCount={dailyAmensCount}
            date={new Date()}
            dailyVerse={dailyVerse}
            appLanguage={uiLang}
            userPersona={userPersona}
            weatherData={null}
            radioAlarm={radioAlarm}
            onOpenRadioControl={() => openManagement("alarm")}
            onOpenManagement={openManagement}
            isMiriamUnlocked={true}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            prayers={prayers}
            onAddPrayer={(content, time) => {
              const newPrayer = {
                id: Date.now().toString(),
                content,
                date: new Date().toISOString().split("T")[0],
                reminderTime: time,
                completed: false,
                createdAt: new Date().toISOString(),
              };
              setPrayers([...prayers, newPrayer]);
            }}
            onUpdatePrayer={(id, content, time, completed) =>
              setPrayers(
                prayers.map((p) =>
                  p.id === id
                    ? { ...p, content, reminderTime: time, completed }
                    : p,
                ),
              )
            }
            onDeletePrayer={(id) =>
              setPrayers(prayers.filter((p) => p.id !== id))
            }
            dailyGoals={dailyGoals}
            onAddDailyGoal={(content) => {
              const newGoal = {
                id: Date.now().toString(),
                content,
                date: new Date().toISOString().split("T")[0],
                completed: false,
                createdAt: new Date().toISOString(),
              };
              setDailyGoals([...dailyGoals, newGoal]);
            }}
            onUpdateDailyGoal={(id, content, completed) =>
              setDailyGoals(
                dailyGoals.map((g) =>
                  g.id === id ? { ...g, content, completed } : g,
                ),
              )
            }
            onDeleteDailyGoal={(id) =>
              setDailyGoals(dailyGoals.filter((g) => g.id !== id))
            }
            dailyTasks={dailyTasks}
            onAddDailyTask={(content) => {
              const newTask = {
                id: Date.now().toString(),
                content,
                date: new Date().toISOString().split("T")[0],
                completed: false,
                createdAt: new Date().toISOString(),
              };
              setDailyTasks([...dailyTasks, newTask]);
            }}
            onUpdateDailyTask={(id, content, completed) =>
              setDailyTasks(
                dailyTasks.map((t) =>
                  t.id === id ? { ...t, content, completed } : t,
                ),
              )
            }
            onDeleteDailyTask={(id) =>
              setDailyTasks(dailyTasks.filter((t) => t.id !== id))
            }
            note={
              notes.find((n) => n.date === getLocalDateString(new Date()))
                ?.content || ""
            }
            onUpdateNote={(content) => {
              const today = getLocalDateString(new Date());
              const existing = notes.find((n) => n.date === today);
              if (existing) {
                setNotes(
                  notes.map((n) => (n.date === today ? { ...n, content } : n)),
                );
              } else {
                setNotes([
                  ...notes,
                  {
                    id: Date.now().toString(),
                    date: today,
                    content,
                    createdAt: new Date().toISOString(),
                  },
                ]);
              }
            }}
            spiritualGoals={spiritualGoals}
            setSpiritualGoals={setSpiritualGoals}
            dailyGoalProgress={dailyGoalProgress}
            setDailyGoalProgress={setDailyGoalProgress}
            addToast={addToast}
            theme="dark"
            onOpenDailyVerseModal={(v) => {
              setSelectedDailyVerseForModal(v);
              setIsDailyVerseModalOpen(true);
            }}
            onOpenRadioMode={() => setCurrentView("radio")}
            onOpenBiblicalSchool={() => setIsBiblicalSchoolOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            isLandscape={isLandscape}
            onToggleFavorite={toggleFavorite}
            onGoogleLogin={handleGoogleIdentityLink}
            isSyncing={isSyncing}
          />
        </div>
      </div>
    </div>
  );
};
