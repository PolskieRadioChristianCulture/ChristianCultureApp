import { create } from "zustand";
import { PersistenceService } from "./services/persistenceService";
import { SyncService } from "./services/syncService";
import { auth } from "./firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  UserPersona,
  Prayer,
  DailyGoal,
  DailyTask,
  DailyNote,
  SpiritualGoal,
  DailyGoalProgress,
  SystemNotification,
  NotificationSettings,
  DynamicDBData,
  UserLayouts,
} from "./types";

interface AppState {
  userPersona: UserPersona;
  prayers: Prayer[];
  dailyGoals: DailyGoal[];
  dailyTasks: DailyTask[];
  notes: DailyNote[];
  spiritualGoals: SpiritualGoal[];
  dailyGoalProgress: DailyGoalProgress[];
  systemNotifications: SystemNotification[];
  notificationSettings: NotificationSettings;
  isAuthReady: boolean;
  userId: string | null;
  dynamicDB: DynamicDBData;
  areAllWidgetsHidden: boolean;
  userLayouts: UserLayouts;

  isZenMode: boolean;

  // Actions
  setIsZenMode: (val: boolean) => void;
  setAreAllWidgetsHidden: (val: boolean) => void;
  setUserPersona: (persona: UserPersona) => void;
  setPrayers: (prayers: Prayer[]) => void;
  setDailyGoals: (goals: DailyGoal[]) => void;
  setDailyTasks: (tasks: DailyTask[]) => void;
  setNotes: (notes: DailyNote[]) => void;
  setSpiritualGoals: (goals: SpiritualGoal[]) => void;
  setDailyGoalProgress: (progress: DailyGoalProgress[]) => void;
  setSystemNotifications: (
    notifications:
      | SystemNotification[]
      | ((prev: SystemNotification[]) => SystemNotification[]),
  ) => void;
  setNotificationSettings: (settings: NotificationSettings) => void;
  setDynamicDB: (data: DynamicDBData) => void;
  setUserLayouts: (
    layouts: UserLayouts | ((prev: UserLayouts) => UserLayouts),
  ) => void;

  // Auth & Sync
  initAuth: () => void;
  syncToCloud: () => Promise<void>;
}

const CZAREK_AVATAR = "/ROGOWSKI.webp";

const migrateUserPersona = (persona: UserPersona | null): UserPersona => {
  const defaultPersona: UserPersona = {
    name: "Gość",
    profilePicture: CZAREK_AVATAR,
    gender: "unspecified",
    ageGroup: "unspecified",
    maritalStatus: "unspecified",
    spiritualStatus: "unspecified",
    appMode: PersistenceService.loadRememberedStartMode() || "standard",
    theme: "dark",
    preferredLaunchMode: "radio",
    smartStart: true,
    autostartRadio: true,
    aiGreetingsEnabled: false,
    geolocationConsent: false,
    keepScreenOnWhileRadioPlaying: false,
    screensaverEnabled: true,
    isFirstRun: true,
    joshuaSystem: {
      enabled: false,
      disciplineMode: "5.10.15",
      driveSyncEnabled: false,
    },
  };

  if (!persona) return defaultPersona;

  // Migration: force update old avatar to new ROGOWSKI.jpg
  if (
    persona.profilePicture &&
    (persona.profilePicture.includes("rogowski_avatar.jpg") ||
      persona.profilePicture.includes("unsplash.com") ||
      persona.profilePicture === "")
  ) {
    return { ...persona, profilePicture: CZAREK_AVATAR };
  }

  return persona;
};

export const useAppStore = create<AppState>((set, get) => ({
  // ... existing storage ...
  userPersona: migrateUserPersona(PersistenceService.loadUserPersona()),
  prayers: PersistenceService.loadPrayers(),
  dailyGoals: PersistenceService.loadDailyGoals(),
  dailyTasks: PersistenceService.loadDailyTasks(),
  notes: PersistenceService.loadNotes(),
  spiritualGoals: PersistenceService.loadSpiritualGoals(),
  dailyGoalProgress: PersistenceService.loadProgress(),
  systemNotifications: PersistenceService.loadSystemNotifications(),
  notificationSettings: PersistenceService.loadNotificationSettings(),
  dynamicDB: PersistenceService.loadDynamicDB(),
  userLayouts: PersistenceService.loadUserLayouts() || {},
  isAuthReady: false,
  userId: null,
  areAllWidgetsHidden: PersistenceService.loadWidgetsHidden(),

  isZenMode: true,
  setIsZenMode: (isZenMode) => set({ isZenMode }),

  setUserLayouts: (update) => {
    if (typeof update === "function") {
      const next = update(get().userLayouts);
      set({ userLayouts: next });
      PersistenceService.saveUserLayouts(next);
    } else {
      set({ userLayouts: update });
      PersistenceService.saveUserLayouts(update);
    }
  },

  setAreAllWidgetsHidden: (areAllWidgetsHidden) => {
    set({ areAllWidgetsHidden });
    PersistenceService.saveWidgetsHidden(areAllWidgetsHidden);
    if (!areAllWidgetsHidden) {
      // Re-enable individual widget visibility in localStorage if they were hidden
      const widgetKeys = [
        "mediaplayer",
        "motivation",
        "didyouknow",
        "golden_thoughts",
        "cta_mobilization",
        "yellow_card",
        "music_news",
        "emi_news",
      ];
      widgetKeys.forEach((k) => {
        localStorage.setItem(`cc_widget_${k}_visible`, "true");
      });
      // Dispatch event so active widgets can update their internal isForcedVisible state
      window.dispatchEvent(new Event("cc_widgets_updated"));
    }
  },
  setUserPersona: (userPersona) => {
    set({ userPersona });
    PersistenceService.saveUserPersona(userPersona);
    get().syncToCloud();
  },
  setPrayers: (prayers) => {
    set({ prayers });
    PersistenceService.savePrayers(prayers);
    get().syncToCloud();
  },
  setDailyGoals: (dailyGoals) => {
    set({ dailyGoals });
    PersistenceService.saveDailyGoals(dailyGoals);
    get().syncToCloud();
  },
  setDailyTasks: (dailyTasks) => {
    set({ dailyTasks });
    PersistenceService.saveDailyTasks(dailyTasks);
    get().syncToCloud();
  },
  setNotes: (notes) => {
    set({ notes });
    PersistenceService.saveNotes(notes);
    get().syncToCloud();
  },
  setSpiritualGoals: (spiritualGoals) => {
    set({ spiritualGoals });
    PersistenceService.saveSpiritualGoals(spiritualGoals);
    get().syncToCloud();
  },
  setDailyGoalProgress: (dailyGoalProgress) => {
    set({ dailyGoalProgress });
    PersistenceService.saveProgress(dailyGoalProgress);
    get().syncToCloud();
  },
  setSystemNotifications: (update) => {
    if (typeof update === "function") {
      const next = update(get().systemNotifications);
      set({ systemNotifications: next });
      PersistenceService.saveSystemNotifications(next);
    } else {
      set({ systemNotifications: update });
      PersistenceService.saveSystemNotifications(update);
    }
    get().syncToCloud();
  },
  setNotificationSettings: (notificationSettings) => {
    set({ notificationSettings });
    PersistenceService.saveNotificationSettings(notificationSettings);
    get().syncToCloud();
  },
  setDynamicDB: (dynamicDB) => {
    set({ dynamicDB });
    PersistenceService.saveDynamicDB(dynamicDB);
  },

  initAuth: () => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          set({ userId: user.uid, isAuthReady: true });
          
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SYNC_OFFLINE_CONTENT' });
          }

          // Subscribe to cloud changes
          SyncService.subscribeToUserData(user.uid, (data) => {
            if (data) {
              const updatedPersona = { ...get().userPersona, ...data.userPersona };
              delete (updatedPersona as any).userPersona;
              delete (updatedPersona as any).prayers;
              delete (updatedPersona as any).dailyGoals;
              delete (updatedPersona as any).dailyTasks;
              delete (updatedPersona as any).notes;
              delete (updatedPersona as any).spiritualGoals;
              delete (updatedPersona as any).dailyGoalProgress;
              delete (updatedPersona as any).systemNotifications;
              delete (updatedPersona as any).notificationSettings;
              delete (updatedPersona as any).updatedAt;
              
              set({
                userPersona: updatedPersona,
                prayers: data.prayers || get().prayers,
                dailyGoals: data.dailyGoals || get().dailyGoals,
                dailyTasks: data.dailyTasks || get().dailyTasks,
                notes: data.notes || get().notes,
                spiritualGoals: data.spiritualGoals || get().spiritualGoals,
                dailyGoalProgress:
                  data.dailyGoalProgress || get().dailyGoalProgress,
                systemNotifications:
                  data.systemNotifications || get().systemNotifications,
                notificationSettings:
                  data.notificationSettings || get().notificationSettings,
              });
            }
          });
        } else {
          signInAnonymously(auth).catch((error) => {
            // Silencing the expected error since Anonymous Auth might be disabled 
            // and we rely on public rules for radio stats.
            // console.error("[Auth] Failed to sign in anonymously:", error);
            set({ userId: null, isAuthReady: true });
          });
        }
      });
    } catch (error) {
      console.error("[Auth] Failed to initialize auth listener:", error);
      set({ isAuthReady: true, userId: null });
    }
  },

  syncToCloud: async () => {
    try {
      const {
        userId,
        userPersona,
        prayers,
        dailyGoals,
        dailyTasks,
        notes,
        spiritualGoals,
        dailyGoalProgress,
        systemNotifications,
        notificationSettings,
      } = get();
      if (userId) {
        await SyncService.syncUserData(userId, {
          userPersona,
          prayers,
          dailyGoals,
          dailyTasks,
          notes,
          spiritualGoals,
          dailyGoalProgress,
          systemNotifications,
          notificationSettings,
        });
      }
    } catch (error) {
      console.warn("Sync to cloud failed (Offline mode fallback):", error);
      // App continues to work without throwing unhandled promise rejections
    }
  },
}));
