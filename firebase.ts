import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDocFromServer, doc, setLogLevel } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './firebase-applet-config.json';

// Reduce Firestore noise in logs
setLogLevel('error');

// Safely initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("CRITICAL: Failed to initialize Firebase. App will run in limited offline mode.", error);
  // Create a dummy app to prevent crashes on subsequent calls
  app = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
}

export const auth = getAuth(app as any);
export const db = getFirestore(app as any, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app as any);
storage.maxUploadRetryTime = 3000;

// Initialize Messaging safely (only in browser and if supported)
export const getMessagingInstance = async () => {
  try {
    const supported = await isSupported();
    if (supported && typeof window !== 'undefined') {
      return getMessaging(app as any);
    }
  } catch (err) {
    console.error('Messaging not supported:', err);
  }
  return null;
};

export const rtdb = getDatabase(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  // @ts-ignore
  const errorCode = error?.code || '';
  
  const isPermissionError = 
    errorCode === 'permission-denied' || 
    errorMessage.toLowerCase().includes('permission') || 
    errorMessage.toLowerCase().includes('insufficient');

  const authInfo = {
    userId: auth.currentUser?.uid,
    email: auth.currentUser?.email,
    emailVerified: auth.currentUser?.emailVerified,
    isAnonymous: auth.currentUser?.isAnonymous,
    tenantId: auth.currentUser?.tenantId,
    providerInfo: auth.currentUser?.providerData.map(provider => ({
      providerId: provider.providerId,
      displayName: provider.displayName || 'none',
      email: provider.email || 'none',
      photoUrl: provider.photoURL || 'none'
    })) || []
  };

  const errorInfo: FirestoreErrorInfo = {
    error: errorMessage,
    operationType,
    path,
    authInfo: authInfo as any
  };

  // Suppress list/get permission errors - they shouldn't crash the whole app
  if (isPermissionError && (operationType === OperationType.LIST || operationType === OperationType.GET)) {
    console.warn('[Firestore] Non-fatal permission error suppressed:', errorInfo);
    return;
  }

  // Suppress permission errors on live_presence to prevent crashing if guest writes
  if (isPermissionError && path && path.includes('live_presence')) {
    console.warn('[Firestore] Presence update permission error suppressed:', errorInfo);
    return;
  }

  const errorString = JSON.stringify(errorInfo, null, 2);
  
  if (errorMessage.toLowerCase().includes('offline')) {
    console.warn('[Firestore] Mutation failed due to offline state:', errorInfo);
  } else {
    console.error('[Firestore] API ERROR:', errorString);
  }
  
  // Only throw if it's a mutation or a critical failure we didn't suppress
  throw new Error(errorString);
}

// CRITICAL: Validate connection to Firestore on boot
async function testConnection() {
  try {
    console.log("[Firebase] Testing connection to Firestore...");
    // Use an un-awaited promise with short timeout or just ignore, but getDocFromServer timeouts in 10s.
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("[Firebase] Connection check successful.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("[Firebase] Client is offline. App will use local cache until network is restored.");
    } else {
      console.log("[Firebase] Connection check skipped or handled (expected if test doc missing).");
    }
  }
}
testConnection();

