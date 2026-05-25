
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { APP_VERSION } from '../types';

export class TelemetryService {
  private static readonly COLLECTION = 'telemetry_errors';

  static async logError(error: Error, context?: Record<string, any>) {
    console.error('[Telemetry] Logging error:', error, context);

    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: serverTimestamp(),
        version: APP_VERSION,
        userAgent: navigator.userAgent,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || 'anonymous',
        ...context
      };

      // Only log to Firestore if we have a connection (optional, could use a buffer)
      if (db) {
        await addDoc(collection(db, this.COLLECTION), errorData);
      }
    } catch (e) {
      // Fallback to console if logging fails
      console.warn('[Telemetry] Failed to log error to cloud:', e);
    }
  }

  static async logEvent(eventName: string, data?: Record<string, any>) {
    console.log(`[Telemetry] Event: ${eventName}`, data);
    // Optional: Log events to a separate collection
  }
}
