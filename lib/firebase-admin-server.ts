import admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (adminApp) return adminApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[FirebaseAdmin] Missing credentials in environment variables.');
    return null;
  }

  // Handle escaped newlines in private key
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  try {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('[FirebaseAdmin] Initialized successfuly for project:', projectId);
    return adminApp;
  } catch (error) {
    console.error('[FirebaseAdmin] Initialization error:', error);
    return null;
  }
}
