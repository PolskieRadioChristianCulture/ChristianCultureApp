import React, { useState, useCallback, useEffect } from "react";
import {
  UserPersona,
  ToastMessage,
  UserGender,
  inferGenderFromName,
  UserAgeGroup,
  MaritalStatus,
  SpiritualStatus,
  fixOrphans,
  APP_VERSION,
} from "../types";
import { PersistenceService } from "../services/persistenceService";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { sanitizeForFirestore } from "../services/syncService";

const LOGO_URL =
  "https://drive.google.com/thumbnail?id=1dHi9QX86UWj21YAIk3I8xyAXalzQkZpj&sz=w512";

interface LoginScreenProps {
  onLogin: (persona: UserPersona) => void;
  userPersona: UserPersona;
  onUpdateUserPersona: (persona: UserPersona) => void;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  onClose?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  userPersona,
  onUpdateUserPersona,
  addToast,
  onClose,
}) => {
  const [currentPersona, setCurrentPersona] =
    useState<UserPersona>(userPersona);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentPersona(userPersona);
  }, [userPersona]);

  const handleGoogleLogin = async () => {
    console.log("CC Global: Initiating Google Login...");
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    // Force account selection to help with some browser issues
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      console.log("CC Global: Calling signInWithPopup...");
      const result = await signInWithPopup(auth, provider);
      console.log("CC Global: Auth success for user:", result.user.email);
      const user = result.user;

      if (user) {
        const { displayName, photoURL, email, uid } = user;

        // Sprawdź czy użytkownik już istnieje w Firestore
        const userDocRef = doc(db, "users", uid);
        let userDoc;
        try {
          userDoc = await getDoc(userDocRef);
        } catch (e) {
          console.error("CC Global: Firestore GET error:", e);
          handleFirestoreError(e, OperationType.GET, `users/${uid}`);
          return;
        }

        let persona: UserPersona;

        if (userDoc.exists()) {
          console.log("CC Global: Existing user found in Firestore");
          const data = userDoc.data();

          // Fix corrupted nested collections if they exist in Firestore
          if (
            data.userPersona &&
            (data.userPersona.userPersona ||
              data.userPersona.prayers ||
              data.userPersona.dailyGoals)
          ) {
            try {
              await updateDoc(userDocRef, {
                "userPersona.userPersona": deleteField(),
                "userPersona.prayers": deleteField(),
                "userPersona.dailyGoals": deleteField(),
                "userPersona.dailyTasks": deleteField(),
                "userPersona.notes": deleteField(),
                "userPersona.spiritualGoals": deleteField(),
                "userPersona.dailyGoalProgress": deleteField(),
                "userPersona.systemNotifications": deleteField(),
                "userPersona.notificationSettings": deleteField(),
                "userPersona.updatedAt": deleteField(),
              });
            } catch (err) {
              console.error("Cleanup error", err);
            }
          }

          persona = {
            ...currentPersona,
            ...(data.userPersona || data), // Prefer nested userPersona if it exists
            googleEmail: email || undefined,
            isFirstRun: false,
          };

          // Clean up accidentally nested collections inside UserPersona
          delete (persona as any).userPersona;
          delete (persona as any).prayers;
          delete (persona as any).dailyGoals;
          delete (persona as any).dailyTasks;
          delete (persona as any).notes;
          delete (persona as any).spiritualGoals;
          delete (persona as any).dailyGoalProgress;
          delete (persona as any).systemNotifications;
          delete (persona as any).notificationSettings;
          delete (persona as any).updatedAt;
        } else {
          console.log("CC Global: Creating new user in Firestore");
          const gender = displayName
            ? inferGenderFromName(displayName)
            : "unspecified";
          const mentor = gender === "male" ? "Miriam" : "Jeszua";

          persona = {
            ...currentPersona,
            name: displayName || currentPersona.name,
            profilePicture: photoURL || currentPersona.profilePicture,
            gender: gender,
            googleEmail: email || undefined,
            assignedMentor: mentor,
            uid: uid,
            isFirstRun: false,
          };

          // Zapisz nowego użytkownika w Firestore
          try {
            const sanitizedPersona = sanitizeForFirestore(persona);
            await setDoc(userDocRef, sanitizedPersona);
          } catch (e) {
            console.error("CC Global: Firestore SET error:", e);
            handleFirestoreError(e, OperationType.WRITE, `users/${uid}`);
            return;
          }
        }

        onUpdateUserPersona(persona);
        PersistenceService.setSSOCookie(persona);
        PersistenceService.safeSetItem("cc_app_start_choice", "standard");

        const welcomeMsg =
          persona.gender === "male"
            ? `Witaj, Bracie ${persona.name}! Twoim mentorem uświęcenia została Miriam CC. ✨`
            : `Witaj, Siostro ${persona.name}! Twój Mistrz, Jeszua, poprowadzi Cię przez ten rok. ✨`;

        addToast(welcomeMsg, "success");
        onLogin(persona);
      }
    } catch (error: any) {
      console.error("CC Global: Firebase Google Login Error:", error);
      const errorCode = error.code || "unknown";
      let message = "Błąd logowania Google. Spróbuj ponownie.";

      if (errorCode === "auth/unauthorized-domain") {
        message =
          "Błąd: Domena nie jest autoryzowana w Firebase. Dodaj ją w konsoli.";
      } else if (errorCode === "auth/popup-blocked") {
        message =
          "Błąd: Przeglądarka zablokowała okno logowania. Zezwól na pop-upy.";
      } else if (errorCode === "auth/cancelled-by-user") {
        message = "Logowanie zostało anulowane.";
      } else if (errorCode === "auth/operation-not-allowed") {
        message =
          "Błąd: Logowanie Google nie jest włączone w konsoli Firebase.";
      } else if (errorCode === "auth/internal-error") {
        message =
          "Wystąpił błąd wewnętrzny Firebase. Spróbuj odświeżyć stronę.";
      }

      addToast(`${message} (${errorCode})`, "news");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestPersona: UserPersona = {
      ...currentPersona,
      name: "Pielgrzym",
      gender: "unspecified",
      preferredLaunchMode: "radio",
      ageGroup: "adult",
      maritalStatus: "unspecified",
      spiritualStatus: "believer",
      isFirstRun: false,
    };
    onUpdateUserPersona(guestPersona);
    PersistenceService.safeSetItem("cc_app_start_choice", "standard");
    addToast(
      "Wchodzisz jako Gość. Niektóre funkcje SSO mogą być ograniczone.",
      "info",
    );
    onLogin(guestPersona);
  };

  const handlePersonaSave = useCallback(
    (updatedFields: {
      name: string;
      gender?: UserGender;
      profilePicture?: string;
      personalStatus?: string;
      preferredLaunchMode?: "standard" | "radio";
      ageGroup?: UserAgeGroup;
      maritalStatus?: MaritalStatus;
      spiritualStatus?: SpiritualStatus;
      googleEmail?: string;
    }) => {
      const gender =
        updatedFields.gender ??
        (updatedFields.name
          ? inferGenderFromName(updatedFields.name)
          : "unspecified");
      const mentor = gender === "male" ? "Miriam" : "Jeszua";

      const newPersona: UserPersona = {
        ...currentPersona,
        ...updatedFields,
        gender: gender,
        assignedMentor: mentor,
        isFirstRun: false,
        // Ensure required fields are present
        ageGroup:
          updatedFields.ageGroup || currentPersona.ageGroup || "unspecified",
        maritalStatus:
          updatedFields.maritalStatus ||
          currentPersona.maritalStatus ||
          "unspecified",
        spiritualStatus:
          updatedFields.spiritualStatus ||
          currentPersona.spiritualStatus ||
          "unspecified",
      };

      onUpdateUserPersona(newPersona);
      PersistenceService.safeSetItem("cc_app_start_choice", "standard");
      addToast(
        `Witaj w Christian Culture! Twój mentor: ${mentor === "Miriam" ? "Miriam CC" : "Jeszua"}.`,
        "success",
      );
      onLogin(newPersona);
    },
    [currentPersona, onUpdateUserPersona, addToast, onLogin],
  );

  return (
    <div className="fixed inset-0 z-[6100] flex items-center justify-center px-6 py-8 pt-[calc(2rem+env(safe-area-inset-top,0px))] overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute inset-0 bg-[#C5A059]/5 opacity-30 pointer-events-none"></div>
      <div className="relative z-[6110] max-w-md w-full h-full sm:h-auto bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border-2 border-white/5 rounded-[3.5rem] p-10 sm:p-12 shadow-[0_30px_100px_rgba(0,0,0,1)] animate-fade-in flex flex-col overflow-y-auto scrollbar-thin">
        <div className="flex flex-col items-center text-center space-y-8 w-full">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#C5A059] rounded-[2.5rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-28 h-28 bg-black border-2 border-[#C5A059]/40 rounded-[2.5rem] flex items-center justify-center text-white text-5xl shadow-2xl relative z-10 animate-floating-button-pulse overflow-hidden">
              <img
                src={LOGO_URL}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white leading-tight tracking-tighter uppercase text-center">
              Christian Culture Global
            </h3>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
              {fixOrphans(
                "Zyskaj natychmiastowy dostęp do wszystkich usług Christian Culture za pomocą swojego konta Google.",
              )}
            </p>
          </div>

          <div className="w-full pt-8 border-t border-white/5">
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-col gap-5 w-full max-w-[340px]">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex flex-col items-center justify-center gap-3 py-6 bg-black border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl hover:bg-zinc-900 hover:border-[#C5A059]/40 hover:text-[#C5A059] transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/5 to-[#C5A059]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="relative z-10 text-center">
                    {isLoading ? "Łączenie..." : "KONTYNUUJ Z GOOGLE"}
                  </span>
                </button>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-transparent text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-white/5 hover:bg-white/5 hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  Utwórz konto e-mail
                </button>
              </div>

              <div className="flex flex-col items-center gap-5 opacity-40 hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500/50 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.2)]"></span>
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                    System SSO Aktywny
                  </span>
                </div>
                <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">
                  Christian Identity Engine v{APP_VERSION}
                </p>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-white/5 space-y-8">
              <button
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    handleGuestLogin();
                  }
                }}
                className="w-full py-4 bg-transparent border border-zinc-900 text-zinc-700 font-black text-[9px] uppercase tracking-[0.4em] rounded-xl hover:text-zinc-500 hover:border-zinc-800 transition-all duration-500 italic"
              >
                {onClose
                  ? "— Zamknij (Kontynuuj używanie) —"
                  : "— Kontynuuj jako Gość (bez SSO) —"}
              </button>
              <p className="text-[9px] text-zinc-600 text-center leading-relaxed italic opacity-60 px-4">
                {fixOrphans(
                  "Logując się, akceptujesz regulamin serwisu Christian Culture oraz politykę prywatności CC Global.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
