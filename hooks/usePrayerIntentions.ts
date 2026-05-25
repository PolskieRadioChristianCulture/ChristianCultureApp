import { useState, useEffect } from 'react';
import { CommunityService } from '../services/communityService';
import { nativeService } from '../services/nativeService';
import { SystemNotification } from '../types';

export function usePrayerIntentions(
  addToast: (msg: string, type: string) => void,
  setSystemNotifications: React.Dispatch<React.SetStateAction<SystemNotification[]>>,
  setIsPrayerIntentionsOpen: (isOpen: boolean) => void
) {
  const [hasNewPrayerIntention, setHasNewPrayerIntention] = useState(false);
  const [latestIntentionTimestamp, setLatestIntentionTimestamp] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cc_latest_intention_ts");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Track latest prayer intention
  useEffect(() => {
    const unsubscribe = CommunityService.subscribeToIntentions((intentions) => {
      if (intentions.length > 0) {
        const latestDt = new Date(intentions[0].createdAt).getTime();
        const intentionText = intentions[0].text;
        
        if (latestIntentionTimestamp > 0 && latestDt > latestIntentionTimestamp) {
          setHasNewPrayerIntention(true);
          
          if (typeof window !== "undefined") {
            const notifText = `Właśnie teraz ktoś potrzebuje Twojej modlitwy: ${intentionText}`;
            nativeService.scheduleLocalReminder("SOS MODLITWA", notifText, new Date(Date.now() + 1000));
            addToast("SOS: Nowa intencja modlitewna!", "error");
            
            // Add to system notifications
            setSystemNotifications(prev => [{
              id: `sos-${Date.now()}`,
              title: "SOS Modlitwa",
              message: notifText,
              timestamp: new Date().toISOString(),
              isRead: false,
              type: 'alert',
              icon: "🆘",
              action: {
                label: "MODLĘ SIĘ",
                onClick: () => {
                  setHasNewPrayerIntention(false);
                  setIsPrayerIntentionsOpen(true);
                }
              }
            }, ...prev]);
          }
        }
        if (latestDt > latestIntentionTimestamp) {
          setLatestIntentionTimestamp(latestDt);
          if (typeof window !== "undefined") {
             localStorage.setItem("cc_latest_intention_ts", latestDt.toString());
          }
        }
      }
    });
    return () => unsubscribe();
  }, [latestIntentionTimestamp, addToast, setSystemNotifications, setIsPrayerIntentionsOpen]);

  return { hasNewPrayerIntention, setHasNewPrayerIntention };
}
