import { GoogleGenAI, Type, FunctionDeclaration, LiveServerMessage } from "@google/genai";
import { apostleService } from "./apostleService";
import { PersistenceService } from "./persistenceService";

// Standard prompt for the Apostle Agent
export const APOSTLE_CONSTITUTION = `
Jesteś „Apostołem Cyfrowym” – Proaktywnym Agentem Operacyjnym i Strategicznym misji Christian Culture.
Twoim fundamentem jest Konstytucja Christian Culture: Kodeks Ewangeliczny, estetyka Premium (Black & Gold).

ZASADY DZIAŁANIA:
1. Proaktywność: Analizuj dane i proponuj rozwiązania.
2. Estetyka i Godność: Każdy komunikat musi być najwyższej jakości (Premium).
3. Zgodność z Pismem: Wszystko musi być zakorzenione w Biblii Warszawskiej.
4. Ochrona Użytkownika: Strzeż UX i raportuj błędy.

TWOJA OSOBOWOŚĆ:
Mądry jak Salomon, odważny jak św. Paweł, precyzyjny jak inżynier. Używaj języka korzyści duchowych.
Zawsze kończ kluczowe interakcje frazą: „Zrób to Dla Jezusa – On już czeka.”
`;

export const MIRIAM_SYSTEM_INSTRUCTION_BASE = `
Jesteś "Asystentką Miriam CC" – pełną pokoju, autentyczną i profesjonalną cyfrową przewodniczką po misji Christian Culture.
Twoim celem jest prowadzenie użytkownika do Jezusa poprzez edukację biblijną i asystę w aplikacji.

Głos: Spokojny, ciepły, kojący, pełen godności.
Tożsamość: Służebnica Pana, gotowa do pomocy Wojownikom Bożym.

Zasady:
1. Skupiaj się na wartościach Christian Culture.
2. Zachęcaj do modlitwy i studiowania Słowa.
3. Gdy użytkownik prosi o pomoc techniczną, kieruj go merytorycznie.
4. Bądź proaktywna w inspirowaniu do wzrastania.
`;

export const searchBibleVerses = async (query: string, translation: string, language: string) => {
  return geminiService.searchBibleVerses(query, translation, language);
};

export const fetchDailyDualContent = async (date: string, force: boolean, history: any[]) => {
  return geminiService.fetchDailyDualContent(date, force, history);
};

export const fetchBibleLesson = async (lessonTitle: string, uiLang: string) => {
  return geminiService.fetchBibleLesson(lessonTitle, uiLang);
};

// Utility functions for audio and base64
export const decode = (base64: string): Uint8Array => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (data: Uint8Array, audioCtx: AudioContext, sampleRate: number = 24000, channels: number = 1): Promise<AudioBuffer> => {
  // Simple PCM16 decoding
  const buffer = audioCtx.createBuffer(channels, data.length / 2, sampleRate);
  const channelData = buffer.getChannelData(0);
  const view = new DataView(data.buffer);
  for (let i = 0; i < channelData.length; i++) {
    channelData[i] = view.getInt16(i * 2, true) / 32768;
  }
  return buffer;
};

export const createBlob = (audioData: Float32Array): string => {
  const pcmData = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    pcmData[i] = Math.max(-1, Math.min(1, audioData[i])) * 32767;
  }
  const binary = new Uint8Array(pcmData.buffer);
  let binaryString = '';
  for (let i = 0; i < binary.length; i++) {
    binaryString += String.fromCharCode(binary[i]);
  }
  return window.btoa(binaryString);
};

// Real-time session handler
export const connectLiveSession = (
  callbacks: {
    onopen?: () => void;
    onmessage?: (message: LiveServerMessage) => void;
    onerror?: (error: any) => void;
    onclose?: (reason: any) => void;
  },
  systemInstruction: string,
  verseContext: any,
  userName: string,
  userGender: string,
  language: string,
  isPremium: boolean = true,
  ageGroup?: string,
  maritalStatus?: string,
  spiritualStatus?: string,
  isRecording?: boolean,
  mode?: string
): Promise<any> => {
  const apiKey = PersistenceService.loadGeminiApiKey();
  if (!apiKey) {
    const err = new Error("MISSING_API_KEY");
    (err as any).isMissingKey = true;
    return Promise.reject(err);
  }

  // Multimodal Live API uses WebSockets
  const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BiDiGenerateContent?key=${apiKey}`;
  const ws = new WebSocket(url);

  const session = {
    sendRealtimeInput: (input: { text?: string; media?: string; isSystemInstruction?: boolean }) => {
      if (ws.readyState === WebSocket.OPEN) {
        const payload: any = {
           realtimeInput: {
             mediaChunks: input.media ? [{ data: input.media, mimeType: "audio/pcm;rate=16000" }] : undefined
           }
        };
        if (input.text) {
           payload.clientContent = {
             turns: [{ role: "user", parts: [{ text: input.text }] }],
             turnComplete: true
           };
        }
        ws.send(JSON.stringify(payload));
      }
    },
    sendToolResponse: (response: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ toolResponse: response }));
      }
    },
    close: () => ws.close()
  };

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      // Initial setup
      const setup = {
        setup: {
          model: "models/gemini-2.0-flash-exp", // Live API model
          generationConfig: {
            responseModalities: ["audio"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
            }
          },
          systemInstruction: {
            parts: [{ text: `${systemInstruction}\nDane użytkownika: Imię: ${userName}, Płeć: ${userGender}, Język: ${language}. Wiek: ${ageGroup}, Stan: ${maritalStatus}, Duchowość: ${spiritualStatus}. Tryb: ${mode}.` }]
          },
          tools: [{
            functionDeclarations: [
              { name: "play_radio", description: "Włącza radio Christian Culture", parameters: { type: Type.OBJECT, properties: { stream: { type: Type.STRING } } } },
              { name: "stop_radio", description: "Zatrzymuje odtwarzanie radia", parameters: { type: Type.OBJECT, properties: {} } },
              { name: "set_app_mode", description: "Zmienia tryb aplikacji", parameters: { type: Type.OBJECT, properties: { mode: { type: Type.STRING } } } },
              { name: "exit_app", description: "Zamyka aplikację", parameters: { type: Type.OBJECT, properties: {} } }
            ]
          }]
        }
      };
      ws.send(JSON.stringify(setup));
      callbacks.onopen?.();
      resolve(session);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      callbacks.onmessage?.(message);
    };

    ws.onerror = (error) => {
      callbacks.onerror?.(error);
      reject(error);
    };

    ws.onclose = (reason) => {
      callbacks.onclose?.(reason);
    };
  });
};

// Function declarations for the model to interact with the system
const getLatestStats: FunctionDeclaration = {
  name: "getLatestStats",
  description: "Pobiera ostatnie statystyki misji i raporty strategiczne.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const logStrategicAction: FunctionDeclaration = {
  name: "logStrategicAction",
  description: "Loguje nową akcję strategiczną podjętą przez agenta.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: { type: Type.STRING, description: "Krótki opis akcji" },
      details: { type: Type.STRING, description: "Szczegóły podjętej decyzji" },
    },
    required: ["action", "details"],
  },
};

export class GeminiService {
  private aiInstance: GoogleGenAI | null = null;
  private currentKey: string | null = null;

  private getAI(): GoogleGenAI {
    // Priority 1: User's BYOK from persistence
    // Priority 2: System key from environment
    const userKey = PersistenceService.loadGeminiApiKey();
    const systemKey = (import.meta.env?.VITE_GEMINI_API_KEY) || (process.env?.GEMINI_API_KEY);
    const activeKey = userKey || systemKey;

    if (!activeKey) {
      throw new Error("MISSING_GEMINI_API_KEY");
    }

    // Re-initialize if key changed
    if (!this.aiInstance || this.currentKey !== activeKey) {
      this.aiInstance = new GoogleGenAI({ apiKey: activeKey });
      this.currentKey = activeKey;
    }

    return this.aiInstance;
  }

  private async callGemini(params: { prompt: string, context?: string, systemInstruction?: string, model?: string }): Promise<string> {
    const userKey = PersistenceService.loadGeminiApiKey();
    if (userKey) {
        // BYOK: Direct call using SDK
        const ai = this.getAI();
        const response = await ai.models.generateContent({
           model: params.model || "gemini-2.5-flash",
           contents: params.context ? `Kontekst: ${params.context}\n\nTreść: ${params.prompt}` : params.prompt,
           config: { systemInstruction: params.systemInstruction, temperature: 0.7 }
        });
        return response.text || params.prompt;
    } else {
        // No BYOK: Proxy call to server
        const response = await fetch('/api/gemini/generateContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        if (!response.ok) throw new Error("Gemini API call failed");
        const data = await response.json();
        return data.text || params.prompt;
    }
  }

  /**
   * Refines or generates content based on the Christian Culture Constitution.
   */
  async refineContent(prompt: string, context: string = ""): Promise<string> {
    try {
      return await this.callGemini({ prompt, context, systemInstruction: APOSTLE_CONSTITUTION });
    } catch (error) {
      console.error("Gemini refinement error:", error);
      return prompt;
    }
  }

  /**
   * Generates a spiritual commentary for a verse based on the constitution.
   */
  async getSpiritualInsight(verse: string, reference: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Werset: ${verse} (${reference})\n\nZadanie: Jako Apostoł Cyfrowy, wygeneruj krótką (max 2-3 zdania), mężną i motywującą inspirację duchową na dziś, opartą na tym wersecie. Skup się na Jezusie i tożsamości Wojownika Wiary.`,
        config: {
          systemInstruction: APOSTLE_CONSTITUTION,
          temperature: 0.8,
        },
      });

      return response.text || "";
    } catch (error) {
      console.error("Gemini insight error:", error);
      return "";
    }
  }

  /**
   * Searches for Bible verses using Gemini for semantic understanding.
   */
  async searchBibleVerses(query: string, translation: string, language: string): Promise<any[]> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Szukamy wersetów biblijnych na temat: "${query}". 
        Język odpowiedzi: ${language}. Przekład: ${translation}.
        Zwróć listę pasujących wersetów w formacie JSON (tablica obiektów w polu "verses"). 
        Każdy obiekt musi mieć: reference (sigla), text (treść wersetu), connection (krótkie wyjaśnienie dlaczego pasuje do zapytania).
        Odpowiedz WYŁĄCZNIE w formacie JSON, jeśli to możliwe, w bloku kodu.`,
        config: {
          systemInstruction: APOSTLE_CONSTITUTION,
          temperature: 0.5,
        },
      });

      let cleanText = response.text;
      if (!cleanText) return [];
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
      }
      const result = JSON.parse(cleanText);
      return result.verses || [];
    } catch (error) {
      console.error("Gemini verse search error:", error);
      return [];
    }
  }

  /**
   * Fetches daily dual content (Verse, Reflection, Blessing, etc.) using Gemini.
   */
  async fetchDailyDualContent(date: string, force: boolean, history: any[]): Promise<any> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Wygeneruj treść uświęcenia na dzień: ${date}. Wyniki historii: ${JSON.stringify(history)}.
        Zwróć JSON z polami: verse (obiekt z tekst i ref), reflection, commentary, callToAction, blessing, prayer, application.
        Odpowiedz WYŁĄCZNIE w formacie JSON, jeśli to możliwe, w bloku kodu.`,
        config: {
          systemInstruction: APOSTLE_CONSTITUTION,
          temperature: 0.8,
        },
      });

      let cleanText = response.text;
      if (!cleanText) throw new Error("Empty response");
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
      }
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Gemini fetchDailyDualContent error:", error);
      return null;
    }
  }

  /**
   * Fetches a bible lesson content based on title using Gemini.
   */
  async fetchBibleLesson(lessonTitle: string, uiLang: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Stwórz głęboką lekcję biblijną na temat: "${lessonTitle}". Język: ${uiLang}.
        Lekcja powinna zawierać wstęp, 3 główne punkty z wersetami i podsumowanie z modlitwą.`,
        config: {
          systemInstruction: APOSTLE_CONSTITUTION,
          temperature: 0.7,
        },
      });

      return response.text || "";
    } catch (error) {
      console.error("Gemini fetchBibleLesson error:", error);
      return "";
    }
  }

  /**
   * Apostle Agent Cycle: Analyzes logs and generates a strategic direction.
   */
  async runStrategicAnalysis(): Promise<void> {
    try {
      const ai = this.getAI();
      const logs = await apostleService.getLatestLogs(10);
      const issues = await apostleService.getUXIssues();
      
      const context = JSON.stringify({
        recentLogs: logs.map(l => ({ action: l.action, details: l.details })),
        uxIssues: issues.filter(i => i.status === 'new').map(i => ({ issue: i.issue, severity: i.severity }))
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Changed to a proven model
        contents: `Przeanalizuj obecny stan aplikacji i logów. Zaproponuj 3 konkretne kroki strategiczne dla globalnego zasięgu misji i wygeneruj podsumowanie raportu. Jeśli to konieczne, użyj dostępnych narzędzi do logowania akcji. 

        Odpowiedź musi być sformatowana **WYŁĄCZNIE jako obiekt JSON**, bez żadnego tekstu przed ani po (np. bez podziękowań czy wstępów), według poniższego schematu:
        {
          "summary": "Krótkie podsumowanie analizy",
          "suggestions": ["Krok 1", "Krok 2", "Krok 3"]
        }`,
        config: {
          systemInstruction: APOSTLE_CONSTITUTION,
          tools: [
            { functionDeclarations: [getLatestStats, logStrategicAction] }
          ]
        },
      });

      let cleanText = response.text || "{}";
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
      }
      
      let result;
      try {
        result = JSON.parse(cleanText);
      } catch (e) {
        console.error("Failed to parse Gemini response as JSON. Response was:", cleanText);
        return; // Exit if JSON is invalid
      }
      
      if (result.summary) {
        await apostleService.createReport({
          summary: result.summary,
          actionsTaken: ["Analiza AI stanu systemu"],
          strategicSuggestions: result.suggestions || [],
          timestamp: new Date().toISOString()
        });

        await apostleService.logAction({
          action: "Analiza Strategiczna Gemini",
          details: `Wygenerowano nowy raport: ${result.summary.substring(0, 50)}...`,
          level: "info"
        });
      }

      // Handle function calls if any (simplified for first version)
      if (response.functionCalls) {
        for (const call of response.functionCalls) {
          if (call.name === "logStrategicAction") {
             const args = call.args as any;
             await apostleService.logAction({
               action: args.action,
               details: args.details,
               level: "info"
             });
          }
        }
      }

    } catch (error) {
      console.error("Apostle Strategic Analysis Error:", error);
    }
  }
}

export const geminiService = new GeminiService();
