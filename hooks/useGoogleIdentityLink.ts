import { useState, useCallback, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { UserPersona, inferGenderFromName } from '../types';
import { sanitizeForFirestore } from '../services/syncService';

interface UseGoogleIdentityLinkProps {
  uiLang: string;
  userPersona: UserPersona;
  setUserPersona: (persona: UserPersona) => void;
  addToast: (msg: string, type: 'success' | 'alert' | 'info' | 'error' | 'news') => void;
  dynamicDB: any;
  setDynamicDB: (db: any) => void;
}

export function useGoogleIdentityLink({
  uiLang,
  userPersona,
  setUserPersona,
  addToast,
  dynamicDB,
  setDynamicDB,
}: UseGoogleIdentityLinkProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGoogleIdentityLink = useCallback(async () => {
    setIsSyncing(true);
    addToast(uiLang === 'pl' ? "Otwieram bramy Christian Identity..." : "Opening Christian Identity gates...", "info");
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      provider.addScope('https://www.googleapis.com/auth/drive');
      provider.addScope('https://www.googleapis.com/auth/tasks');
      provider.addScope('https://www.googleapis.com/auth/calendar');
      provider.addScope('https://www.googleapis.com/auth/contacts');
      provider.addScope('https://www.googleapis.com/auth/gmail');
      provider.addScope('https://www.googleapis.com/auth/keep');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user) {
        const name = user.displayName || 'Gość';
        const email = user.email || undefined;
        const picture = user.photoURL || undefined;
        const uid = user.uid;
        
        // INTELLIGENT ONBOARDING: Mężczyzna -> Miriam, Kobieta -> Jeszua
        const gender = inferGenderFromName(name);
        const mentor = gender === 'male' ? 'Miriam' : 'Jeszua';
        
        const updatedPersona: UserPersona = {
          ...userPersona,
          name: name,
          googleEmail: email,
          profilePicture: picture,
          gender: gender,
          assignedMentor: mentor,
          isGoogleCalendarConnected: true,
          uid: uid,
          joshuaSystem: {
            enabled: true,
            disciplineMode: '5.10.15',
            driveSyncEnabled: true,
          }
        };

        const sanitized = sanitizeForFirestore(updatedPersona);
        setUserPersona(sanitized);
        
        addToast(uiLang === 'pl' ? `Witaj w Rodzinie CC, ${name}!` : `Welcome to CC Family, ${name}!`, "success");
        
        // Update Nowości CC in dynamicDB
        const updatedDynamicDB = { ...dynamicDB };
        const newNewsLine = uiLang === 'pl' ? `- Tożsamość: Użytkownik ${name} połączył się z globalnym ekosystemem Christian Culture.\n` : `- Identity: User ${name} connected with the global Christian Culture ecosystem.\n`;
        const existingNews = typeof updatedDynamicDB['Nowości CC'] === 'string' ? updatedDynamicDB['Nowości CC'] : '✨ CC OS Nowości \n';
        const lines = existingNews.split('\n');
        // Insert after the title if it exists
        if (lines.length > 0 && lines[0].startsWith('✨')) {
          lines.splice(1, 0, newNewsLine.trim());
          updatedDynamicDB['Nowości CC'] = lines.join('\n');
        } else {
          updatedDynamicDB['Nowości CC'] = newNewsLine + existingNews;
        }
        setDynamicDB(updatedDynamicDB);
      }
    } catch (error: any) {
      console.error("Google Identity Link Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
          addToast(uiLang === 'pl' ? "Logowanie anulowane." : "Login cancelled.", "info");
      } else {
        addToast(uiLang === 'pl' ? "Błąd połączenia z Identity. Spróbuj ponownie." : "Identity connection error. Please try again.", "alert");
      }
    } finally {
      setIsSyncing(false);
    }
  }, [uiLang, userPersona, addToast, setUserPersona, dynamicDB, setDynamicDB]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('cc_trigger_google_login', handleGoogleIdentityLink);
        return () => {
        window.removeEventListener('cc_trigger_google_login', handleGoogleIdentityLink);
        };
    }
  }, [handleGoogleIdentityLink]);

  return { isSyncing, handleGoogleIdentityLink };
}
