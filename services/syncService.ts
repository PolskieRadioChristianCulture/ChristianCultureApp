import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { UserPersona, Prayer, DailyGoal, DailyTask, DailyNote, SpiritualGoal, DailyGoalProgress, SystemNotification, NotificationSettings } from '../types';

export const sanitizeForFirestore = (data: any): any => {
  // Absolute primitives and basics
  if (data === null) return null;
  if (data === undefined) return null;
  if (typeof data === 'function') return null;
  if (typeof data === 'symbol') return null;
  
  // Basic types
  if (typeof data !== 'object') return data;
  
  // Date handling
  if (data instanceof Date) return data.toISOString();
  
  // Array handling
  if (Array.isArray(data)) {
    return data
      .map(sanitizeForFirestore)
      .filter(item => item !== undefined && item !== null);
  }
  
  // Object handling - ensured to be plain object
  const result: Record<string, any> = {};
  const keys = Object.keys(data);
  
  for (const key of keys) {
    const value = data[key];
    // We skip undefined and functions
    if (value !== undefined && typeof value !== 'function' && typeof value !== 'symbol') {
      const sanitizedValue = sanitizeForFirestore(value);
      if (sanitizedValue !== undefined && sanitizedValue !== null) {
        result[key] = sanitizedValue;
      }
    }
  }
  return result;
};

export const SyncService = {
  syncUserData: async (userId: string, data: any) => {
    try {
      const userRef = doc(db, 'users', userId);
      const sanitizedData = sanitizeForFirestore(data);
      await setDoc(userRef, {
        ...sanitizedData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  },

  subscribeToUserData: (userId: string, callback: (data: any) => void) => {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    });
  }
};
