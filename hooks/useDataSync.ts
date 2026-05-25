import { useEffect } from 'react';
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { DatabaseService } from "../services/databaseService";
import { useAppStore } from "../useAppStore";

export const useDataSync = () => {
  const setDynamicDB = useAppStore((state) => state.setDynamicDB);

  useEffect(() => {
    const syncDatabase = async () => {
      try {
        const data = await DatabaseService.fetchData();
        if (data && Object.keys(data).length > 0) {
          setDynamicDB(data);
        }
      } catch (err) {
        console.warn("[DynamicDB] Błąd synchronizacji:", err);
      }
    };

    const configRef = doc(db, "config", "global");
    const unsubscribeConfig = onSnapshot(configRef, (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data();
        setDynamicDB({ ...useAppStore.getState().dynamicDB, ...remoteData });
      }
    }, (error) => {
      console.warn("Global config snapshot non-fatal error suppressed:", error);
    });

    syncDatabase();
    const interval = setInterval(syncDatabase, 300000);
    return () => {
      clearInterval(interval);
      unsubscribeConfig();
    };
  }, [setDynamicDB]);
};
