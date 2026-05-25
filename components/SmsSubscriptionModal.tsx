import React, { useState, useEffect } from "react";
import { useAppStore } from "../useAppStore";
import { fixOrphans, ToastMessage, SupportedLanguage } from "../types";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface SmsSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
}

export const SmsSubscriptionModal: React.FC<SmsSubscriptionModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  addToast,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Check current status
    const checkStatus = async () => {
      try {
        if (auth.currentUser) {
          // If logged in, fetch their previous subscription using UID as ID
          const docRef = doc(db, "smsSubscribers", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPhoneNumber(docSnap.data().phoneNumber || "");
            setIsSubscribed(docSnap.data().subscribed || false);
          } else if (auth.currentUser.phoneNumber) {
            setPhoneNumber(auth.currentUser.phoneNumber);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [isOpen]);

  const handleSubscribeToggle = async () => {
    if (!isSubscribed) {
      const strippedPhone = phoneNumber.replace(/[\s-]/g, "");
      const plPhoneRegex = /^(?:\+48|0048)?[4-8]\d{8}$/;

      if (!plPhoneRegex.test(strippedPhone)) {
        addToast(
          appLanguage === "pl"
            ? "Bezpłatna subskrypcja możliwa tylko dla polskich numerów komórkowych."
            : "Free subscription is only available for Polish mobile numbers.",
          "alert",
        );
        return;
      }
    }

    setSaving(true);
    try {
      const subscriberId = auth.currentUser
        ? auth.currentUser.uid
        : phoneNumber.replace(/\D/g, ""); // fall back to digits-only phone number if not logged in
      const newStatus = !isSubscribed;

      const payload = {
        phoneNumber,
        subscribed: newStatus,
        userId: auth.currentUser ? auth.currentUser.uid : null,
        timestampSubscribed: serverTimestamp(),
        source: "app_user", // Adding source as requested
      };

      /**
       * TO IMPLEMENT FIREBASE PHONE AUTHENTICATION (For better security & spam prevention):
       * 1. Add <div id="recaptcha-container"></div> to the DOM.
       * 2. Initialize RecaptchaVerifier:
       *      import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
       *      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
       * 3. Send SMS OTP:
       *      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
       *      setConfirmationResult(confirmationResult);
       * 4. User enters the OTP in a new UI input field.
       * 5. Verify the code:
       *      await confirmationResult.confirm(code);
       * 6. Once verified, perform the setDoc below.
       */

      await setDoc(doc(db, "smsSubscribers", subscriberId), payload, {
        merge: true,
      });
      setIsSubscribed(newStatus);

      if (newStatus) {
        addToast(
          appLanguage === "pl"
            ? "Subskrypcja aktywowana!"
            : "Subscription activated!",
          "success",
        );
      } else {
        addToast(
          appLanguage === "pl"
            ? "Subskrypcja anulowana."
            : "Subscription cancelled.",
          "info",
        );
      }
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.WRITE, "smsSubscribers");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 border-[#C5A059]/40 text-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-2xl max-w-md overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-60"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-[#C5A059] rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center border border-[#C5A059]/30 relative z-10 shadow-xl">
              <span className="text-4xl">📜</span>
            </div>
          </div>

          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
            {appLanguage === "pl" ? "Subskrypcja SMS" : "SMS Subscription"}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">
            {appLanguage === "pl"
              ? "Chrześcijańskie Inspiracje"
              : "Christian Inspirations"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-zinc-400 text-xs font-medium leading-relaxed italic text-center px-2">
            {fixOrphans(
              appLanguage === "pl"
                ? "Otrzymuj chrześcijańskie inspiracje prosto na Twój telefon! Zostaw swój numer, aby być zawsze blisko Słowa."
                : "Receive Christian inspirations directly to your phone! Leave your number to always stay close to the Word.",
            )}
          </p>

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-black tracking-widest text-[#C5A059] pl-2">
              {appLanguage === "pl" ? "Numer telefonu:" : "Phone number:"}
            </label>
            <input
              type="tel"
              placeholder="+48 123 456 789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading || saving}
              className="w-full px-5 py-4 bg-black/60 border border-zinc-800 rounded-2xl text-white text-sm focus:border-[#C5A059] transition-colors outline-none placeholder:text-zinc-700"
            />
          </div>

          <Button
            onClick={handleSubscribeToggle}
            disabled={loading || saving}
            className={`w-full py-7 ${isSubscribed ? "bg-zinc-800 text-zinc-300" : "bg-gradient-to-r from-[#C5A059] to-[#A68043] text-white"} font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all border-none`}
          >
            {saving ? (
              <span>...</span>
            ) : isSubscribed ? (
              appLanguage === "pl" ? (
                "ANULUJ SUBSKRYPCJĘ"
              ) : (
                "CANCEL SUBSCRIPTION"
              )
            ) : (
              <>
                <span>✉️</span>{" "}
                {appLanguage === "pl" ? "SUBSKRYBUJ SMS" : "SUBSCRIBE SMS"}
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-center pt-2 pb-4">
          <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-[0.3em]">
            Soli Deo Gloria • Christian Culture
          </p>
        </div>

        <div className="border-t border-white/5 pt-4">
          <Button
            onClick={onClose}
            className="w-full py-6 bg-zinc-900 border border-zinc-800 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 active:scale-95 transition-all outline-none"
          >
            {appLanguage === "pl" ? "ZAMKNIJ OKNO" : "CLOSE WINDOW"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
