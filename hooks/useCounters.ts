import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { CommunityService } from '../services/communityService';
import { getBiblicalDateString } from '../types';
import { DateTime } from 'luxon';

export function useCounters() {
  const [totalViews, setTotalViews] = useState<number>(0);
  const [dailyRadioStats, setDailyRadioStats] = useState(0);
  const [globalAmensCount, setGlobalAmensCount] = useState<number>(0);
  const [dailyAmensCount, setDailyAmensCount] = useState<number>(0);

  // Zliczanie wizyty całkowitej
  useEffect(() => {
    const registerVisit = async () => {
      if (!db) return;
      const hasCounted = sessionStorage.getItem("cc_total_views_counted");
      if (!hasCounted) {
        try {
          await setDoc(doc(db, "counters", "stats"), {
            totalViews: increment(1)
          }, { merge: true });
          sessionStorage.setItem("cc_total_views_counted", "1");
        } catch (error) {
          console.error("Błąd podczas zliczania odwiedzin:", error);
        }
      }
    };
    registerVisit();
  }, []);

  // Nasłuchiwanie zmian w liczniku głównym
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "counters", "stats"), (docSnap) => {
      if (docSnap.exists() && docSnap.data().totalViews) {
        setTotalViews(docSnap.data().totalViews);
      }
    });
    return () => unsub();
  }, []);

  // Daily Radio Stats (Biblical Date listener)
  useEffect(() => {
    let unsub = () => {};
    let lastSubscribedDate = "";

    const checkAndSubscribe = () => {
      const todayStr = getBiblicalDateString(new Date());
      if (todayStr !== lastSubscribedDate) {
        unsub();
        lastSubscribedDate = todayStr;
        unsub = CommunityService.subscribeToDailyRadioStats(todayStr, (clicks) => {
          setDailyRadioStats(clicks);
        });
      }
    };

    checkAndSubscribe();
    const interval = setInterval(checkAndSubscribe, 60000);

    return () => {
      clearInterval(interval);
      unsub();
    };
  }, []);

  // Global & Daily Amens
  useEffect(() => {
    const unsubscribeCounters = CommunityService.subscribeToGlobalCounters((counters) => {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
      const dailyKey = `pray_${today}`;
      
      let total = 0;
      let daily = 0;

      if (typeof counters.pray === 'number') {
        total = counters.pray;
      } else {
        total = Object.entries(counters).reduce((sum, [key, val]) => {
          if (typeof val === 'number' && !key.includes('_202')) return sum + val;
          return sum;
        }, 0);
      }

      if (typeof counters[dailyKey] === 'number') {
        daily = counters[dailyKey] as number;
      }
      
      setGlobalAmensCount(total);
      setDailyAmensCount(daily);
    });

    const handleLocalAmen = () => {
      setGlobalAmensCount((prev) => prev + 1);
      setDailyAmensCount((prev) => prev + 1);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('local-amen-increment', handleLocalAmen);
    }

    return () => {
      unsubscribeCounters();
      if (typeof window !== 'undefined') {
        window.removeEventListener('local-amen-increment', handleLocalAmen);
      }
    };
  }, []);

  return {
    totalViews,
    dailyRadioStats,
    globalAmensCount,
    dailyAmensCount
  };
}
