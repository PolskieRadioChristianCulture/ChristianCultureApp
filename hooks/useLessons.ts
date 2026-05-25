import { useState, useCallback } from 'react';
import { UserPersona, ToastMessage, SupportedLanguage } from '../types';
import { getStaticLessonContent } from '../services/biblicalSchoolLessonContent';
import { fetchBibleLesson } from '../services/geminiService';
import { PersistenceService } from '../services/persistenceService';
import { VoiceGreetingService } from '../services/voiceGreetingService';

interface LessonsProps {
  userPersona: UserPersona;
  setUserPersona: (persona: UserPersona) => void;
  uiLang: SupportedLanguage;
  addToast: (msg: string, type?: ToastMessage["type"]) => void;
  setModalOpen: (name: string, isOpen: boolean) => void;
}

export const useLessons = ({
  userPersona,
  setUserPersona,
  uiLang,
  addToast,
  setModalOpen
}: LessonsProps) => {
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string | null>(null);
  const [currentLessonImage, setCurrentLessonImage] = useState<string | null>(null);
  const [currentLessonContent, setCurrentLessonContent] = useState<string | null>(null);
  const [isLessonLoading, setIsLessonLoading] = useState(false);

  const handleOpenLesson = useCallback(async (lessonTitle: string, imageUrl?: string) => {
    if (!lessonTitle) return;
    setCurrentLessonTitle(lessonTitle);
    setCurrentLessonImage(imageUrl || null);
    setCurrentLessonContent(null);
    setIsLessonLoading(true);
    setModalOpen("lessonReading", true);

    try {
      let content = getStaticLessonContent(lessonTitle, uiLang);
      if (!content) {
        content = await fetchBibleLesson(lessonTitle, uiLang);
      }
      setCurrentLessonContent(content);
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
      addToast(uiLang === "pl" ? "Nie udało się pobrać lekcji." : "Failed to fetch lesson.", "alert");
    } finally {
      setIsLessonLoading(false);
    }
  }, [uiLang, addToast, setModalOpen]);

  const handleLessonComplete = useCallback((title: string) => {
    if (!title) return;
    const currentCompleted = userPersona.completedLessons || [];
    if (!currentCompleted.includes(title)) {
      const updatedCompleted = [...currentCompleted, title];
      const badges = userPersona.badges || [];
      const newBadges = [...badges];

      if (updatedCompleted.length === 1 && !badges.includes("Pierwszy Krok")) {
        newBadges.push("Pierwszy Krok");
        addToast(uiLang === "pl" ? "Odznaka odblokowana: Pierwszy Krok!" : "Badge Unlocked: First Step!", "success");
      }
      if (updatedCompleted.length >= 5 && !badges.includes("Wytrwały Uczeń")) {
        newBadges.push("Wytrwały Uczeń");
        addToast(uiLang === "pl" ? "Odznaka odblokowana: Wytrwały Uczeń!" : "Badge Unlocked: Persistent Student!", "success");
      }
      if (updatedCompleted.length >= 10 && !badges.includes("Absolwent Fundamentów")) {
        newBadges.push("Absolwent Fundamentów");
        addToast(uiLang === "pl" ? "Odznaka odblokowana: Absolwent Fundamentów!" : "Badge Unlocked: Foundations Graduate!", "success");
      }

      const updatedPersona = {
        ...userPersona,
        completedLessons: updatedCompleted,
        badges: newBadges,
      };
      setUserPersona(updatedPersona);
      PersistenceService.saveUserPersona(updatedPersona);
    }
    setModalOpen("lessonReading", false);
  }, [userPersona, setUserPersona, uiLang, addToast, setModalOpen]);

  return {
    currentLessonTitle,
    currentLessonImage,
    currentLessonContent,
    isLessonLoading,
    handleOpenLesson,
    handleLessonComplete
  };
};
