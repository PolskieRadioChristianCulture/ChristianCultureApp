import { useState, useEffect } from 'react';
import { VisualMode, UserPersona } from '../types';
import { visualModeService } from '../services/visualModeService';

export function useVisualMode(userPersona: UserPersona) {
  const [visualMode, setVisualMode] = useState<VisualMode>("standard");

  useEffect(() => {
    const updateVisualMode = () => {
      const mode = visualModeService.calculateCurrentMode(
        new Date(),
        userPersona.location,
      );
      setVisualMode(mode);
    };
    
    updateVisualMode();
    const interval = setInterval(updateVisualMode, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [userPersona.location]);

  return visualMode;
}
