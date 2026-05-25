import { useState, useCallback } from 'react';
import { AppView } from '../App';

export const useNavigation = () => {
  const [currentView, setCurrentView] = useState<AppView>("radio");

  const navigateTo = useCallback((view: AppView) => {
    setCurrentView(view);
  }, []);

  return {
    currentView,
    navigateTo,
    setCurrentView, // Keep for compatibility during transition
  };
};
