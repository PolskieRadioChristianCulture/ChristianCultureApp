
import { UserPersona } from '../types';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export class VoiceGreetingService {
  private static STORAGE_KEY = 'cc_intro_played_session';
  private static DAILY_GREETING_KEY = 'cc_daily_mentor_greeting_date';

  static async getSpecialMessage(): Promise<string | null> {
    try {
      const snap = await getDoc(doc(db, 'ccn_business_card', 'global'));
      if (snap.exists() && snap.data().specialMessage?.trim()) {
        return snap.data().specialMessage.trim();
      }
    } catch(e) {
      console.warn('Could not fetch special message for Voice Greeting:', e);
    }
    return null;
  }

  static async getDailyMentorGreeting(persona: UserPersona): Promise<string | null> {
    const today = new Date().toISOString().split('T')[0];
    const lastGreetingDate = localStorage.getItem(this.DAILY_GREETING_KEY);
    
    // Check for special message first
    const specialMsg = await this.getSpecialMessage();
    if (specialMsg) {
      // If there's a special message, we can still mark it as played but we ALWAYS play it or play once per session?
      // Let's assume daily, or we just rely on standard session marking in App.tsx
      return specialMsg;
    }
    
    if (lastGreetingDate === today) {
        return null;
    }
    
    localStorage.setItem(this.DAILY_GREETING_KEY, today);
    
    const isMale = persona.gender === 'male';
    const name = persona.name && persona.name !== 'Gość' ? persona.name : (isMale ? 'Synu' : 'Córko');
    
    if (isMale) {
        return `Miriam - mentorka CC: Witaj, ${name}. Niech Twój dzień będzie pełen pokoju Bożego. Pamiętaj, że jesteś w rękach Pana. Zrób to dla Jezusa – On już czeka.`;
    } else {
        return `Jeszua - mentor CC: Witaj, ${name}. Pójdź za Mną, a znajdziesz odpocznienie dla duszy swojej. Nie bój się, Jam jest z Tobą. Zrób to dla Jezusa – On już czeka.`;
    }
  }

  static async getGreeting(persona: UserPersona): Promise<string> {
    // Check for special message first
    const specialMsg = await this.getSpecialMessage();
    if (specialMsg) {
      return specialMsg;
    }

    const hour = new Date().getHours();
    const timeStr = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const name = persona.name && persona.name !== 'Gość' ? persona.name : 'Boży Wojowniku';
    const source = (window as any).cc_active_source_name || 'Radio Christian Culture';
    
    // Default greeting without weather fetch to avoid potential issues/delays
    if (hour >= 5 && hour < 10) {
      return `Halleluja, powiedz rano Panu: Tak! ${name}, Boży wojownik nie śpi, on czuwa. Jest ${timeStr}. Dobrze zaczynasz ten dzień ze Słowem w ${source}. Powstań i walcz. Zrób to dla Jezusa – On już czeka.`;
    } else if (hour >= 10 && hour < 15) {
      return `Witaj w samym sercu dnia, ${name}. Jest ${timeStr}. To czas na oddech w Duchu. Słuchasz ${source} – niech Słowo pracuje w Tobie, gdy Ty pracujesz dla Pana. Zrób to dla Jezusa – On już czeka.`;
    } else {
        return `Dobre popołudnie, ${name}! Wybija ${timeStr}. Odpocznij chwilę przy ${source}. Poczuj Jego obecność tu i teraz. Zrób to dla Jezusa – On już czeka.`;
    }
  }

  static async synthesizeAndPlay(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    try {
      if (!('speechSynthesis' in window)) {
        throw new Error("SpeechSynthesis not supported");
      }

      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.rate = 0.9;
        utterance.pitch = 0.8;

        const voices = window.speechSynthesis.getVoices();
        const plMaleVoice = voices.find(v => v.lang.startsWith('pl') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('marek')));
        if (plMaleVoice) utterance.voice = plMaleVoice;

        utterance.onstart = () => {
          if (onStart) onStart();
        };

        utterance.onend = () => {
          if (onEnd) onEnd();
          resolve();
        };

        utterance.onerror = (e) => {
          console.error("SpeechSynthesis Error:", e);
          if (onEnd) onEnd();
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    } catch (error) {
      console.error("VoiceGreetingService Error:", error);
      if (onEnd) onEnd();
      return Promise.resolve();
    }
  }

  static markIntroPlayed() {
    sessionStorage.setItem(this.STORAGE_KEY, 'true');
  }

  static isIntroPlayed(): boolean {
    return sessionStorage.getItem(this.STORAGE_KEY) === 'true';
  }
}
