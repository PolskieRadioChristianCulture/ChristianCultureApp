import { getFirestore, collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, auth } from '../firebase';

export interface ErrorLogEntry {
  timestamp: Timestamp;
  platform: string;
  device_model: string;
  font_size_settings: number;
  error_message: string;
  error_stacktrace?: string;
  screen_name?: string;
  user_id?: string | null;
  user_email?: string | null;
  is_anonymous_user: boolean;
  status: string;
  ui_metrics?: { width: number; height: number };
}

export async function logErrorToFirestore(
  errorMessage: string,
  error: Error | null = null,
  screenName: string | null = null,
  status: 'Info' | 'Warning' | 'Critical' = 'Critical',
  uiMetrics: { width: number; height: number } | null = null
) {
  const user = auth.currentUser;
  
  // Try to safely get font size
  let font_size_settings = 16;
  try {
    font_size_settings = parseFloat(getComputedStyle(document.body).fontSize) || 16;
  } catch (e) {
    // Ignore, fallback to default
  }

  const logEntry: ErrorLogEntry = {
    timestamp: serverTimestamp() as Timestamp,
    platform: "Web",
    device_model: navigator.userAgent,
    font_size_settings: font_size_settings,
    error_message: errorMessage,
    error_stacktrace: error ? error.stack : undefined,
    screen_name: screenName || window.location.pathname,
    user_id: user?.uid || null,
    user_email: user?.email || null,
    is_anonymous_user: user?.isAnonymous || false,
    status: status,
    ui_metrics: uiMetrics || undefined,
  };

  try {
    await addDoc(collection(db, "error_logs"), logEntry);
    console.log("Error log added to Firestore");
  } catch (e) {
    console.error("Error adding log to Firestore:", e);
  }
}

export function checkElementOverflow(
  element: HTMLElement | null,
  screenName: string,
  elementName: string = "Unnamed Element"
): boolean {
  if (!element) {
    console.warn(`Element for ${elementName} not found.`);
    return false;
  }

  let isOverflowing = false;
  const overflowDetails: string[] = [];

  // Sprawdź przepełnienie poziome
  if (element.scrollWidth > element.clientWidth + 2) {
    isOverflowing = true;
    overflowDetails.push(`Horizontal overflow: scrollWidth=${element.scrollWidth}px, clientWidth=${element.clientWidth}px`);
  }

  // Sprawdź przepełnienie pionowe
  if (element.scrollHeight > element.clientHeight + 2) {
    isOverflowing = true;
    overflowDetails.push(`Vertical overflow: scrollHeight=${element.scrollHeight}px, clientHeight=${element.clientHeight}px`);
  }

  if (isOverflowing) {
    const uiMetrics = { width: window.innerWidth, height: window.innerHeight };
    const errorMessage = `UI Overflow detected in "${elementName}" on screen "${screenName}". Details: ${overflowDetails.join("; ")}`;

    console.warn(errorMessage, { element, uiMetrics });
    logErrorToFirestore(
      errorMessage,
      null,
      screenName,
      "Warning",
      uiMetrics
    ).catch(console.error);
  }

  return isOverflowing;
}
