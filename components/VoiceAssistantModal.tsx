import React, { useState, useEffect, useRef, useCallback } from "react";
import { LiveServerMessage } from "@google/genai";
import {
  connectLiveSession,
  decode,
  decodeAudioData,
  createBlob,
  MIRIAM_SYSTEM_INSTRUCTION_BASE,
} from "../services/geminiService";
import { PersistenceService } from "../services/persistenceService";
// Fixed: Removed SuggestedAction which is not exported from types.ts and not used in this file
import {
  BibleVerse,
  UserGender,
  ToastMessage,
  MIRIAM_AVATAR_URL,
  fixOrphans,
  HOTLINE_NADZIEJA_NUMBER,
  MARIUSZ_PRIEST_NUMBER,
  PAWEL_COACH_NUMBER,
  UserAgeGroup,
  MaritalStatus,
  SpiritualStatus,
  AppMode,
  RadioStreamType,
  SupportedLanguage,
} from "../types";
import { mediaPlayerService, Material } from "../services/mediaPlayerService";
import { extractTextFromPdf } from "../services/pdfService";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  dailyVerseContext: BibleVerse | null;
  userName: string;
  userGender: UserGender;
  userAvatar?: string;
  initialContext?: string;
  appLanguage: SupportedLanguage;
  onSpeakingStatusChange: (isSpeaking: boolean) => void;
  userAgeGroup: UserAgeGroup;
  userMaritalStatus: MaritalStatus;
  userSpiritualStatus: SpiritualStatus;
  isPremium?: boolean;
  onExecuteRadioAction?: (
    action:
      | RadioStreamType
      | "STOP"
      | "STANDARD_MODE"
      | "BLIND_MODE"
      | "INSTALL"
      | "EXIT",
  ) => void;
  currentMode: AppMode;
  isTickerExpanded?: boolean;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  addToast,
  dailyVerseContext,
  userName,
  userGender,
  userAvatar,
  initialContext,
  appLanguage,
  onSpeakingStatusChange,
  userAgeGroup,
  userMaritalStatus,
  userSpiritualStatus,
  isPremium = true,
  onExecuteRadioAction,
  currentMode,
  isTickerExpanded = false,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiTranscription, setAiTranscription] = useState("");
  const [micGranted, setMicGranted] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(
    !!PersistenceService.loadGeminiApiKey(),
  );

  const liveSessionRef = useRef<Promise<any> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioSources = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTime = useRef(0);
  const initialContextSent = useRef(false);

  useEffect(() => {
    onSpeakingStatusChange(isSpeaking);
  }, [isSpeaking, onSpeakingStatusChange]);

  // Re-check for API key when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasApiKey(!!PersistenceService.loadGeminiApiKey());
    }
  }, [isOpen]);

  const requestMicrophoneAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setMicGranted(true);
      return true;
    } catch (error) {
      addToast(
        appLanguage === "pl"
          ? "Brak dostępu do mikrofonu."
          : "Mic access denied.",
        "info",
      );
      setMicGranted(false);
      return false;
    }
  }, [addToast, appLanguage]);

  const stopListening = useCallback(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.then((session) => session.close());
      liveSessionRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      audioSources.current.forEach((source) => source.stop());
      audioSources.current.clear();
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsConnecting(false);
    setIsListening(false);
    setIsSpeaking(false);
    nextStartTime.current = 0;
    initialContextSent.current = false;
    setAiTranscription("");
  }, []);

  const startListening = useCallback(async () => {
    if (isListening || isConnecting) return;

    // Check key before starting
    const currentKey = PersistenceService.loadGeminiApiKey();
    if (!currentKey) {
      addToast(
        appLanguage === "pl"
          ? "Asystent Miriam wymaga klucza API."
          : "Miriam Assistant requires an API key.",
        "news",
      );
      if ((window as any).cc_openManualApiKeyModal)
        (window as any).cc_openManualApiKeyModal();
      return;
    }

    if (!micGranted) {
      const granted = await requestMicrophoneAccess();
      if (!granted) return;
    }
    setIsConnecting(true);
    setIsListening(false);
    setAiTranscription("");

    try {
      // Gather context files
      let loadedContextFiles = "";
      try {
        const storedMaterialsStr =
          localStorage.getItem("cc_userMaterials") || "[]";
        const storedMaterials: Material[] = JSON.parse(storedMaterialsStr);
        const contextFiles = storedMaterials.filter((m) => m.useAsContext);
        if (contextFiles.length > 0) {
          addToast(
            appLanguage === "pl"
              ? "Wczytywanie dokumentów do pamięci AI..."
              : "Loading documents into AI memory...",
            "info",
          );
          for (const file of contextFiles) {
            const f = await mediaPlayerService.getFile(file);
            if (f) {
              if (
                file.name.toLowerCase().endsWith(".pdf") ||
                file.type === "application/pdf"
              ) {
                const pdfText = await extractTextFromPdf(f);
                loadedContextFiles += `\n\n--- ZAWARTA LEKCJA/DOKUMENT (${file.name}) ---\n${pdfText}\n--- KONIEC DOKUMENTU ---\n\n`;
              } else {
                const txt = await f.text();
                loadedContextFiles += `\n\n--- ZAWARTA LEKCJA/DOKUMENT (${file.name}) ---\n${txt}\n--- KONIEC DOKUMENTU ---\n\n`;
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load context files", err);
      }

      inputAudioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 16000 });
      outputAudioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 24000 });
      const stream = mediaStreamRef.current!;
      mediaStreamSourceRef.current =
        inputAudioContextRef.current.createMediaStreamSource(stream);
      scriptProcessorRef.current =
        inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);

      liveSessionRef.current = connectLiveSession(
        {
          onopen: () => {
            setIsConnecting(false);
            setIsListening(true);
            mediaStreamSourceRef.current?.connect(scriptProcessorRef.current!);
            scriptProcessorRef.current?.connect(
              inputAudioContextRef.current!.destination,
            );

            let combinedInitialContext = initialContext || "";
            if (loadedContextFiles) {
              combinedInitialContext += `\n\nMasz dostęp do następujących plików dydaktycznych przydzielonych przez użytkownika, traktuj je jako dodatkową wiedzę do odpowiedzi na jego pytania:\n${loadedContextFiles}`;
            }

            if (combinedInitialContext && !initialContextSent.current) {
              liveSessionRef.current?.then((session) => {
                session.sendRealtimeInput({ text: combinedInitialContext });
                initialContextSent.current = true;
              });
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setAiTranscription(
                (prev) =>
                  prev + message.serverContent!.outputTranscription!.text,
              );
            }

            if (
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data
            ) {
              window.dispatchEvent(
                new CustomEvent("cc-trigger-mute-warning", {
                  detail: { type: "check_audio" },
                }),
              );
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                let response = { status: "ok" };
                if (fc.name === "play_radio")
                  onExecuteRadioAction?.(fc.args.stream as RadioStreamType);
                else if (fc.name === "set_app_mode")
                  onExecuteRadioAction?.(
                    fc.args.mode === "standard"
                      ? "STANDARD_MODE"
                      : "BLIND_MODE",
                  );
                else if (fc.name === "stop_radio")
                  onExecuteRadioAction?.("STOP");
                else if (fc.name === "trigger_install_ui")
                  onExecuteRadioAction?.("INSTALL");
                else if (fc.name === "exit_app") onExecuteRadioAction?.("EXIT");
                else if (fc.name === "call_contact") {
                  const target = fc.args.target as
                    | "PRIEST"
                    | "COACH"
                    | "HOTLINE";
                  let num = HOTLINE_NADZIEJA_NUMBER;
                  if (target === "PRIEST") num = MARIUSZ_PRIEST_NUMBER;
                  if (target === "COACH") num = PAWEL_COACH_NUMBER; // Zaktualizowano numer
                  window.location.href = `tel:${num.replace(/\s/g, "")}`;
                } else if (
                  fc.name === "read_daily_verse_details" &&
                  dailyVerseContext
                ) {
                  const fullTextToSpeak =
                    (appLanguage === "pl"
                      ? "Oto szczegóły wersetu dnia: "
                      : "Here are the details of the daily verse: ") +
                    `${dailyVerseContext.text} (${dailyVerseContext.reference}). ` +
                    (dailyVerseContext.reflection
                      ? (appLanguage === "pl"
                          ? "Refleksja: "
                          : "Reflection: ") +
                        `${dailyVerseContext.reflection}. `
                      : "") +
                    (dailyVerseContext.commentary
                      ? (appLanguage === "pl"
                          ? "Komentarz: "
                          : "Commentary: ") +
                        `${dailyVerseContext.commentary}. `
                      : "") +
                    (dailyVerseContext.callToAction
                      ? (appLanguage === "pl"
                          ? "Wezwanie do działania: "
                          : "Call to action: ") +
                        `${dailyVerseContext.callToAction}. `
                      : "") +
                    (dailyVerseContext.blessing
                      ? (appLanguage === "pl"
                          ? "Błogosławieństwo: "
                          : "Blessing: ") + `${dailyVerseContext.blessing}. `
                      : "") +
                    (dailyVerseContext.prayer
                      ? (appLanguage === "pl" ? "Modlitwa: " : "Prayer: ") +
                        `${dailyVerseContext.prayer}. `
                      : "") +
                    (dailyVerseContext.application
                      ? (appLanguage === "pl"
                          ? "Zastosowanie: "
                          : "Application: ") +
                        `${dailyVerseContext.application}.`
                      : "");

                  liveSessionRef.current?.then((session) => {
                    session.sendRealtimeInput({
                      text: fullTextToSpeak,
                      isSystemInstruction: true,
                    });
                  });
                  response = { status: "reading_verse_details" };
                }

                liveSessionRef.current?.then((session) => {
                  session.sendToolResponse({
                    functionResponses: [{ id: fc.id, name: fc.name, response }],
                  });
                });
              }
            }

            if (
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data
            ) {
              const base64EncodedAudioString =
                message.serverContent.modelTurn.parts[0].inlineData.data;
              if (outputAudioContextRef.current) {
                nextStartTime.current = Math.max(
                  nextStartTime.current,
                  outputAudioContextRef.current.currentTime,
                );
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  outputAudioContextRef.current,
                  24000,
                  1,
                );
                const source =
                  outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContextRef.current.destination);
                source.addEventListener("ended", () => {
                  audioSources.current.delete(source);
                  if (audioSources.current.size === 0) setIsSpeaking(false);
                });
                setIsSpeaking(true);
                source.start(nextStartTime.current);
                nextStartTime.current =
                  nextStartTime.current + audioBuffer.duration;
                audioSources.current.add(source);
              }
            }
            if (message.serverContent?.turnComplete) {
              setAiTranscription("");
            }
          },
          onerror: (e: any) => {
            console.error("[Miriam] Live session error:", e);
            stopListening();
            // Better non-technical error handling
            const msg = (e?.message || "").toLowerCase();
            if (
              msg.includes("api key") ||
              msg.includes("auth") ||
              msg.includes("key not found")
            ) {
              addToast(
                appLanguage === "pl"
                  ? "Klucz API nieprawidłowy. Odśwież go w ustawieniach."
                  : "API key invalid. Refresh it in settings.",
                "news",
              );
              if ((window as any).cc_openManualApiKeyModal)
                (window as any).cc_openManualApiKeyModal();
            } else {
              addToast(
                appLanguage === "pl"
                  ? "Połączenie z Miriam przerwane."
                  : "Connection to Miriam lost.",
                "alert",
              );
            }
          },
          onclose: (e: any) => {
            console.debug("[Miriam] Live session closed.");
            stopListening();
          },
        },
        MIRIAM_SYSTEM_INSTRUCTION_BASE,
        dailyVerseContext,
        userName,
        userGender,
        appLanguage,
        true,
        userAgeGroup,
        userMaritalStatus,
        userSpiritualStatus,
        true,
        currentMode,
      );

      // WAŻNE: Oczekiwanie na wynik połączenia
      await liveSessionRef.current;

      scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        const pcmBlob = createBlob(inputData);
        liveSessionRef.current
          ?.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
          })
          .catch(() => {});
      };
    } catch (error: any) {
      console.error("[Miriam] Failed to connect:", error);
      stopListening();
      if (error.isMissingKey || error.message?.includes("MISSING_API_KEY")) {
        addToast(
          appLanguage === "pl"
            ? "Asystent głosowy wymaga własnego klucza API."
            : "Voice assistant requires your own API key.",
          "news",
        );
        if ((window as any).cc_openManualApiKeyModal)
          (window as any).cc_openManualApiKeyModal();
      } else {
        addToast(
          appLanguage === "pl"
            ? "Błąd połączenia. Spróbuj ponownie za chwilę."
            : "Connection error. Try again in a moment.",
          "alert",
        );
      }
    }
  }, [
    isListening,
    isConnecting,
    micGranted,
    addToast,
    dailyVerseContext,
    userName,
    userGender,
    requestMicrophoneAccess,
    initialContext,
    appLanguage,
    onSpeakingStatusChange,
    userAgeGroup,
    userMaritalStatus,
    userSpiritualStatus,
    onExecuteRadioAction,
    currentMode,
  ]);

  useEffect(() => {
    if (isOpen) {
      const key = PersistenceService.loadGeminiApiKey();
      if (key) {
        requestMicrophoneAccess().then((granted) => {
          if (granted) startListening();
        });
      }
    } else {
      stopListening();
    }
  }, [isOpen, stopListening, requestMicrophoneAccess, startListening]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[5001] bg-black flex flex-col items-center justify-center p-4 sm:p-12 animate-fade-in ${currentMode !== "blind" ? "bg-black/95 backdrop-blur-3xl" : ""} ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <div className="w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Wizualizacja Miriam */}
        <div className="relative group">
          <div
            className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-1000 ${isSpeaking ? "bg-[#C5A059]/40 scale-125" : "bg-blue-500/10"}`}
          ></div>
          <div
            className={`w-40 h-40 rounded-full border-4 transition-all duration-500 overflow-hidden shadow-2xl relative z-10 ${isSpeaking ? "border-[#C5A059] scale-110" : "border-zinc-800"} ${!hasApiKey ? "grayscale opacity-50" : ""}`}
          >
            <img
              src={MIRIAM_AVATAR_URL}
              alt="Miriam CC"
              className="w-full h-full object-cover"
            />
            {isListening && (
              <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Dynamiczny tekst AI */}
        <div className="min-h-[120px] text-center px-6 flex flex-col justify-center">
          {!hasApiKey ? (
            <div className="space-y-4 animate-fade-in">
              <p className="text-[#C5A059] text-sm font-black uppercase tracking-[0.2em] leading-tight">
                {appLanguage === "pl"
                  ? "Miriam wymaga aktywacji klucza API"
                  : "Miriam requires API key activation"}
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
                {appLanguage === "pl"
                  ? "Aby odblokować asystenta głosowego i funkcje AI, wprowadź własny klucz Gemini API w ustawieniach."
                  : "To unlock the voice assistant and AI features, enter your own Gemini API key in settings."}
              </p>
              <button
                onClick={() => (window as any).cc_openManualApiKeyModal?.()}
                className="mt-4 px-6 py-3 bg-[#C5A059] text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#C5A059]/20"
              >
                {appLanguage === "pl"
                  ? "Wprowadź Klucz Teraz"
                  : "Enter Key Now"}
              </button>
            </div>
          ) : aiTranscription ? (
            <p className="text-2xl sm:text-3xl font-serif italic text-white/90 leading-relaxed animate-fade-in">
              {aiTranscription}
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-[#C5A059] text-sm font-black uppercase tracking-[0.5em]">
                {isListening
                  ? appLanguage === "pl"
                    ? "SŁUCHAM TWOJEGO GŁOSU..."
                    : "LISTENING TO YOUR VOICE..."
                  : appLanguage === "pl"
                    ? "ŁĄCZENIE Z MIRIAM CC..."
                    : "CONNECTING TO MIRIAM CC..."}
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                  Aplikacja Christian Culture
                </p>
                <p className="text-zinc-700 text-[8px] font-black uppercase tracking-[0.3em]">
                  {currentMode === "blind"
                    ? appLanguage === "pl"
                      ? "TRYB DLA NIEWIDOMYCH AKTYWNY"
                      : "BLIND MODE ACTIVE"
                    : appLanguage === "pl"
                      ? "ASYSTENT GŁOSOWY CC"
                      : "CC VOICE ASSISTANT"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fala dźwiękowa */}
        {isSpeaking && (
          <div className="flex gap-2 h-16 items-center">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-[#C5A059] rounded-full animate-bounce shadow-[0_0_15px_#C5A059]"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${40 + Math.random() * 60}%`,
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Główny przycisk mikrofonu / zamknięcia */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => (isListening ? onClose() : startListening())}
            disabled={!hasApiKey && !isListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 border-4 shadow-2xl ${
              isListening
                ? "bg-red-600 border-red-400 scale-110 shadow-red-600/40"
                : !hasApiKey
                  ? "bg-zinc-950 border-zinc-900 cursor-not-allowed grayscale"
                  : "bg-zinc-900 border-[#C5A059]/20 hover:scale-105"
            }`}
            aria-label={
              isListening ? "Wyłącz asystenta" : "Rozpocznij słuchanie"
            }
          >
            {isListening ? (
              <svg
                className="w-14 h-14 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className={`w-14 h-14 ${!hasApiKey ? "text-zinc-800" : "text-[#C5A059]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </button>
          <p className="text-zinc-500 font-black uppercase tracking-[0.5em] text-[10px]">
            {isListening
              ? appLanguage === "pl"
                ? "KLIKNIJ X BY WYJŚĆ"
                : "CLICK X TO EXIT"
              : appLanguage === "pl"
                ? "DOTKNIJ, BY ROZMAWIAĆ"
                : "TOUCH TO TALK"}
          </p>
        </div>

        {/* Back Button for non-blind users */}
        {currentMode !== "blind" && (
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="absolute top-8 right-8 p-4 text-zinc-500 hover:text-white transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <footer className="absolute bottom-12 w-full text-center px-10">
        <div className="max-w-xs mx-auto space-y-2">
          <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">
            {appLanguage === "pl"
              ? "WSPARCIE: dar na utrzymanie i rozwój aplikacji CC"
              : "SUPPORT: donation for CC app maintenance and development"}
          </p>
          <p className="text-zinc-800 text-[7px] font-bold uppercase tracking-[0.2em]">
            {appLanguage === "pl"
              ? "Tryb specjalny wymaga dużych nakładów na infrastrukturę CC Intelligence."
              : "Special mode requires high infrastructure costs for CC Intelligence."}
          </p>
        </div>
      </footer>
    </div>
  );
};
