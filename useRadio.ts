
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { STREAMS } from './config';
import { ToastMessage, RadioAlarm, getLocalDateString, getBiblicalDateString, RadioStreamType, SpatialMode, SupportedLanguage } from './types';
import { PersistenceService } from './services/persistenceService';
import { CommunityService } from './services/communityService';
import { nativeService } from './services/nativeService';
import { useTranslation } from 'react-i18next';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { App as CapacitorApp } from '@capacitor/app';
import { CapacitorMusicControls } from 'capacitor-music-controls-plugin';

export const useRadio = (appLanguage: SupportedLanguage, addToast: (msg: string, type?: ToastMessage['type']) => string, keepScreenOn: boolean = false, spatialMode: SpatialMode = 'none') => {
  const { t } = useTranslation();
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [volume, setVolume] = useState(() => PersistenceService.loadVolume());
  
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = useCallback(async () => {
    if (!keepScreenOn) return;
    
    // Try Capacitor plugin first for native apps
    if (nativeService.isNative()) {
      try {
        await KeepAwake.keepAwake();
        console.log('[Radio] Native Wake Lock acquired (KeepAwake)');
        return;
      } catch (err) {
        console.error(`[Radio] Native Wake Lock error: ${err}`);
      }
    }

    // Fallback to Web API
    if ('wakeLock' in navigator && (navigator as any).wakeLock) {
      try {
        // Release existing if any
        if (wakeLockRef.current) {
          await wakeLockRef.current.release();
        }
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('[Radio] Web Wake Lock acquired');
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          console.log('[Radio] Web Wake Lock not allowed by permissions policy (expected in iframes).');
        } else {
          console.error(`[Radio] Web Wake Lock error: ${err}`);
        }
      }
    }
  }, [keepScreenOn]);

  const releaseWakeLock = useCallback(async () => {
    // Release Capacitor plugin
    if (nativeService.isNative()) {
      try {
        await KeepAwake.allowSleep();
        console.log('[Radio] Native Wake Lock released (KeepAwake)');
      } catch (err) {
        console.error(`[Radio] Native Wake Lock release error: ${err}`);
      }
    }

    // Release Web API
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('[Radio] Web Wake Lock released manually');
      } catch (err) {
        console.error(`[Radio] Web Wake Lock release error: ${err}`);
      }
    }
  }, []);

  // Re-acquire wake lock when visibility changes (it's released by browser when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (isRadioPlaying && keepScreenOn && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRadioPlaying, keepScreenOn, requestWakeLock]);

  // Manage wake lock based on playing state
  useEffect(() => {
    if (isRadioPlaying && keepScreenOn) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => { releaseWakeLock(); };
  }, [isRadioPlaying, keepScreenOn, requestWakeLock, releaseWakeLock]);

  // Capacitor App State Change Listener to ensure background stability
  useEffect(() => {
    if (!nativeService.isNative()) return;

    const listener = CapacitorApp.addListener('appStateChange', async ({ isActive }) => {
      console.log(`[Radio] App state changed. Active: ${isActive}, Playing: ${isRadioPlaying}`);
      
      if (isActive && isRadioPlaying) {
        // App returned to foreground, check if audio element is still playing
        const audio = audioRef.current;
        if (audio && audio.paused) {
          console.warn("[Radio] Audio was paused in background. Attempting to resume...");
          try {
            await safePlay(audio);
          } catch (e) {
            console.error("[Radio] Failed to resume audio on app activation:", e);
          }
        }
      }
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, [isRadioPlaying]);
  const [activeStream, setActiveStream] = useState<RadioStreamType>(() => {
    const saved = PersistenceService.loadLastStream();
    if (saved) return saved;
    return 'BIBLIA'; 
  });

  const [useCORS, setUseCORSState] = useState(false); 
  const useCorsRef = useRef(false);

  const setUseCORS = useCallback((val: boolean) => {
    useCorsRef.current = val;
    setUseCORSState(val);
    if (audioRef.current) {
        if (val) {
            audioRef.current.crossOrigin = 'anonymous';
        } else {
            audioRef.current.removeAttribute('crossOrigin');
        }
    }
  }, []);

  const [visualizerEnabled, setVisualizerEnabled] = useState(false);
  const [forceNative, setForceNative] = useState(false);

  const shortPlayTimeoutRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number>(0);

  const [radioAlarm, setRadioAlarm] = useState<RadioAlarm | null>(() => PersistenceService.loadRadioAlarm() || {
      id: 'default',
      time: "07:00",
      enabled: false,
      repeatDaily: true,
      selectedDays: [0, 1, 2, 3, 4, 5, 6],
      stream: 'PL',
      fadeInEnabled: true
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSwitchingRef = useRef(false);
  const switchTimeoutRef = useRef<number | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const intentionalStopRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 10;

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const stopPlayback = useCallback(async () => {
    intentionalStopRef.current = true;
    PersistenceService.saveIsPlaying(false);
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    retryCountRef.current = 0;

    const audio = audioRef.current;
    if (audio) {
      if ((audio as any).hls) {
        (audio as any).hls.destroy();
        (audio as any).hls = null;
      }
      
      try {
        if (!audio.paused) {
          if (playPromiseRef.current) {
            await playPromiseRef.current.catch(() => {});
          }
           await audio.pause();
        }
      } catch (e) {
        console.warn("[Radio] Pause during stopPlayback caught error:", e);
      }
      
      audio.src = '';
      audio.removeAttribute('src');
      audio.volume = 1.0; 
    }
    setIsRadioPlaying(false);
    isSwitchingRef.current = false;
  }, []);

  const safePlay = async (audio: HTMLAudioElement) => {
    try {
      playPromiseRef.current = audio.play();
      await playPromiseRef.current;
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.warn('[Radio] Play() interrupted by pause() - expected during rapid interactions');
      } else {
        throw e;
      }
    } finally {
      playPromiseRef.current = null;
    }
  };

  const playStreamRef = useRef<any>(null);

  const handleReconnect = useCallback(() => {
    // Reconnect if we ARE supposed to be playing (even if currently failed)
    if ((isRadioPlaying || retryCountRef.current > 0) && !isSwitchingRef.current && retryCountRef.current < MAX_RETRIES) {
      retryCountRef.current += 1;
      
      // Progressive fallback strategy
      if (retryCountRef.current === 1) {
        console.warn("[Radio] Retry 1: Disabling CORS and Visualizer");
        setUseCORS(false);
        setVisualizerEnabled(false);
      } else if (retryCountRef.current === 2) {
        console.warn("[Radio] Retry 2: Forcing Native Playback");
        setForceNative(true);
      }

      const delay = retryCountRef.current === 1 ? 1000 : Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 15000);
      
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log(`[Radio] Reconnecting (${retryCountRef.current}/${MAX_RETRIES})... CORS: ${useCorsRef.current}, Native: ${forceNative}`);
        if (playStreamRef.current) {
          playStreamRef.current(activeStream);
        }
      }, delay);
    } else if (retryCountRef.current >= MAX_RETRIES) {
      console.error("[Radio] Max retries reached. Stopping.");
      stopPlayback();
      addToast(t('radio.error'), "news");
    }
  }, [isRadioPlaying, activeStream, addToast, t, forceNative, stopPlayback, setUseCORS]);

  // Network connectivity dual protection
  useEffect(() => {
    const handleOnline = () => {
      console.log("[Radio] Network online detected. Checking stream...");
      if (isRadioPlaying && audioRef.current && (audioRef.current.paused || audioRef.current.readyState === 0)) {
         console.warn("[Radio] Network came back and audio is supposed to be playing but it's stopped/paused. Reconnecting...");
         if (retryCountRef.current === 0) retryCountRef.current = 1;
         handleReconnect();
      }
    };
    
    const handleOffline = () => {
      console.log("[Radio] Network offline detected.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isRadioPlaying, handleReconnect]);

  const playStream = useCallback(async (streamToPlay: RadioStreamType, initialMsg?: string, isAlarmTrigger: boolean = false): Promise<'success' | 'blocked' | 'error'> => {
    intentionalStopRef.current = false;
    const audio = audioRef.current;
    if (!audio) return 'error';

    console.log(`[Radio] playStream: ${streamToPlay}`);

    if (!isAlarmTrigger) {
      const todayStr = getBiblicalDateString(new Date());
      CommunityService.incrementDailyRadioStats(todayStr).catch(err => {
        console.error("Failed to increment daily radio stats", err);
      });
    }

    if (useCorsRef.current) {
      audio.crossOrigin = 'anonymous';
    } else {
      audio.removeAttribute('crossOrigin');
    }

    // CORS is handled by manual property setter
    
    // FORCED START LOGIC: Próba odblokowania AudioContext na starcie (krytyczne dla Smart TV)
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const dummyCtx = new AudioContextClass();
        if (dummyCtx.state === 'suspended') {
          // Promise.race to prevent hanging indefinitely if user hasn't interacted
          await Promise.race([
            dummyCtx.resume(),
            new Promise(resolve => setTimeout(resolve, 500))
          ]);
        }
      }
    } catch (e) {}

    // Ensure audio is NOT muted and has volume even before play() call
    audio.muted = false;
    audio.volume = volume;

    if (isSwitchingRef.current) {
      console.warn("[Radio] Already switching, forcing switch reset for new request.");
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    }
    isSwitchingRef.current = true;
    
    // Safety lock release after 35s max if switching hangs
    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    switchTimeoutRef.current = window.setTimeout(() => {
       if (isSwitchingRef.current) {
         console.error("[Radio] Switch timeout exceeded! Forcing lock release.");
         isSwitchingRef.current = false;
         handleReconnect();
       }
    }, 35000);

    if ((audio as any).hls) {
      (audio as any).hls.destroy();
      (audio as any).hls = null;
    }
    try {
      if (!audio.paused) {
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
        }
        await audio.pause();
      }
    } catch (e) {
      console.warn("[Radio] Pause during switch caught error:", e);
    }
    audio.removeAttribute('src');
    audio.load(); // Force clear

    const targetUrl = STREAMS[streamToPlay];
    if (!targetUrl) {
      console.error(`[Radio] No URL for stream: ${streamToPlay}`);
      isSwitchingRef.current = false;
      return 'error';
    }

    setActiveStream(streamToPlay);
    PersistenceService.saveLastStream(streamToPlay); 
    
    if (initialMsg) {
      addToast(initialMsg, "info");
    }

    const isHlsStream = targetUrl.includes('/hls/') || targetUrl.includes('.m3u8');
    console.log(`[Radio] Target URL: ${targetUrl}, isHLS: ${isHlsStream}, forceNative: ${forceNative}`);

    // Disable visualizer initially to ensure stable start, unless spatial mode is active
    setVisualizerEnabled(spatialMode !== 'none');

    if (isAlarmTrigger && radioAlarm?.fadeInEnabled) {
      audio.volume = 0;
      let currentVol = 0;
      const targetVol = volume; 
      const durationSeconds = 300; // 5 minutes
      const step = targetVol / (durationSeconds * 10); 
      
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current); 
      volumeIntervalRef.current = window.setInterval(() => {
        if (currentVol < targetVol) {
          currentVol += step;
          audio.volume = Math.min(currentVol, 1);
        } else {
          if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
          volumeIntervalRef.current = null;
        }
      }, 100); 
    } else {
      audio.volume = volume;
    }

    try {
      if (isHlsStream && !forceNative && window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backOffMaxRetries: 10,
          manifestLoadingTimeOut: 15000,
          fragLoadingTimeOut: 15000,
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          startLevel: -1,
          abrEwmaDefaultEstimate: 500000,
        });
        (audio as any).hls = hls;
        
        return await new Promise<'success' | 'blocked' | 'error'>((resolve) => {
          let hasResolved = false;
          let timeoutId: number;

          const cleanup = () => {
            hls.off(window.Hls.Events.MANIFEST_PARSED);
            hls.off(window.Hls.Events.ERROR);
            clearTimeout(timeoutId);
          };
          
          timeoutId = window.setTimeout(() => {
             if (!hasResolved) {
                hasResolved = true;
                console.error("[Radio] HLS initialization timed out after 10s. Forcing failover.");
                cleanup();
                handleReconnect();
                resolve('error');
             }
          }, 10000);

          hls.on(window.Hls.Events.MANIFEST_PARSED, async () => {
            try {
              console.log("[Radio] HLS Manifest parsed, playing...");
              await safePlay(audio);
              setIsRadioPlaying(true);
              PersistenceService.saveIsPlaying(true);
              if (!hasResolved) {
                hasResolved = true;
                if (!isAlarmTrigger) {
                  CommunityService.incrementDailyRadioStats(getBiblicalDateString(new Date()));
                }
                resolve('success');
                cleanup();
              }
            } catch (e: any) {
              console.error("[Radio] HLS Play failed:", e);
              if (e.name === 'NotAllowedError') {
                setIsRadioPlaying(false);
                if (!hasResolved) {
                  hasResolved = true;
                  resolve('blocked');
                  cleanup();
                }
              } else {
                if (!hasResolved) {
                  hasResolved = true;
                  resolve('error');
                  cleanup();
                }
              }
            }
          });

          hls.on(window.Hls.Events.ERROR, (event: any, data: any) => {
            console.error("[Radio] HLS.js error:", data);
            if (data.fatal) {
              switch (data.type) {
                case window.Hls.ErrorTypes.NETWORK_ERROR:
                  console.warn("HLS: Fatal network error, attempting recovery...", data);
                  hls.startLoad();
                  break;
                case window.Hls.ErrorTypes.MEDIA_ERROR:
                  console.warn("HLS: Fatal media error, attempting recovery...", data);
                  hls.recoverMediaError();
                  break;
                default:
                  console.error("HLS: Unrecoverable fatal error:", data);
                  hls.destroy();
                  (audio as any).hls = null;
                  
                  if (!hasResolved) {
                    hasResolved = true;
                    resolve('error');
                    cleanup();
                  }
                  handleReconnect();
                  break;
              }
            }
          });

          hls.loadSource(targetUrl);
          hls.attachMedia(audio);
        });
      } else {
        console.log("[Radio] Using native playback...");
        audio.src = targetUrl;
        audio.load();
        
        return await new Promise<'success' | 'blocked' | 'error'>(async (resolve) => {
          let hasResolved = false;
          
          let warnTimeoutId = window.setTimeout(() => {
             if (!hasResolved) {
                console.warn("[Radio] Native playback is taking longer than expected (> 10s)...");
             }
          }, 10000);

          const timeoutId = window.setTimeout(() => {
             if (!hasResolved) {
                hasResolved = true;
                clearTimeout(warnTimeoutId);
                console.error("[Radio] Native playback timed out after 30s. Forcing failover.");
                handleReconnect();
                resolve('error');
             }
          }, 30000);

          try {
            await safePlay(audio);
            if (!hasResolved) {
              hasResolved = true;
              clearTimeout(timeoutId);
              clearTimeout(warnTimeoutId);
              console.log("[Radio] Native playback started successfully.");
              setIsRadioPlaying(true);
              PersistenceService.saveIsPlaying(true);
              if (!isAlarmTrigger) {
                CommunityService.incrementDailyRadioStats(getBiblicalDateString(new Date()));
              }
              resolve('success');
            }
          } catch (e: any) {
            if (!hasResolved) {
              hasResolved = true;
              clearTimeout(timeoutId);
              clearTimeout(warnTimeoutId);
              console.error("[Radio] Native playback failed:", e);
              if (e.name === 'NotAllowedError') {
                setIsRadioPlaying(false);
                resolve('blocked');
              } else {
                if (retryCountRef.current === 0) {
                  setIsRadioPlaying(false);
                } else {
                  handleReconnect();
                }
                resolve('error');
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("[Radio] Unexpected error in playStream:", e);
      if (retryCountRef.current === 0) {
        setIsRadioPlaying(false);
      } else {
        handleReconnect();
      }
      return 'error';
    } finally {
      isSwitchingRef.current = false;
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
        switchTimeoutRef.current = null;
      }
    }
  }, [addToast, radioAlarm, volume, useCORS, handleReconnect, spatialMode]);
  // Restart stream when spatialMode changes to apply CORS if needed
  useEffect(() => {
    if (isRadioPlaying && !isSwitchingRef.current) {
      console.log("[Radio] spatialMode changed while playing, restarting stream to apply CORS settings...");
      playStream(activeStream);
    }
  }, [spatialMode]); // Removed isRadioPlaying and activeStream from deps to avoid unnecessary loops

  const hasHealedRef = useRef(false);

  useEffect(() => {
    const handleStopRadio = () => {
      console.log("[Radio] Received cc_stop_radio event. Stopping radio...");
      stopPlayback();
    };
    window.addEventListener('cc_stop_radio', handleStopRadio);
    return () => window.removeEventListener('cc_stop_radio', handleStopRadio);
  }, [stopPlayback]);

  // Handle initial autostart/resume
  useEffect(() => {
    const resumeRadio = async () => {
      if (hasHealedRef.current) return;
      
      const audio = audioRef.current;
      if (!audio) {
        console.log("[Radio] resumeRadio: audio element not ready yet.");
        return;
      }
      
      const wasPlaying = PersistenceService.loadIsPlaying();
      const actuallyPaused = audio.paused;
      
      console.log(`[Radio] Initial check - wasPlaying: ${wasPlaying}, actuallyPaused: ${actuallyPaused}`);
      
      if (wasPlaying) {
        hasHealedRef.current = true; // We commit to the attempt once audio is present
        if (actuallyPaused) {
          console.log("[Radio] Autostart/Resume triggered. Attempting to play last stream...");
          
          // Ensure NOT muted and volume is correct before play attempt
          audio.muted = false;
          audio.volume = volume;
          
          // One more AudioContext kick
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const ctx = new AudioContextClass();
              if (ctx.state === 'suspended') ctx.resume();
            }
          } catch(e) {}

          const result = await playStream(activeStream, 'Autostarting...');
          
          if (result === 'blocked') {
            console.warn("[Radio] Autoplay blocked. Waiting for any user interaction...");
            const handleUnblock = async () => {
              console.log("[Radio] User interaction detected, attempting to unlock audio...");
              
              // Force unlock AudioContext again
              try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContextClass) {
                  const dummyCtx = new AudioContextClass();
                  await dummyCtx.resume();
                }
              } catch (e) {}

              const res = await playStream(activeStream);
              if (res === 'success') {
                document.removeEventListener('click', handleUnblock);
                document.removeEventListener('touchstart', handleUnblock);
                document.removeEventListener('scroll', handleUnblock);
                document.removeEventListener('keydown', handleUnblock);
              }
            };
            document.addEventListener('click', handleUnblock);
            document.addEventListener('touchstart', handleUnblock);
            document.addEventListener('scroll', handleUnblock, { passive: true });
            document.addEventListener('keydown', handleUnblock);
            
            // Retry automatically every 5s
            const autoRetry = setInterval(async () => {
               const stillSupposed = PersistenceService.loadIsPlaying();
               if (!stillSupposed) {
                  clearInterval(autoRetry);
                  return;
               }
               const currentAudio = audioRef.current;
               if (currentAudio && currentAudio.paused) {
                  console.log("[Radio] Blocked retry attempt...");
                  const res = await playStream(activeStream);
                  if (res === 'success') clearInterval(autoRetry);
               } else if (currentAudio && !currentAudio.paused) {
                  clearInterval(autoRetry);
               }
            }, 5000);
          }
        }
      } else {
        // If it wasn't playing, we still mark it as healed so the effect doesn't keep running
        hasHealedRef.current = true;
      }
    };
    
    // Attempt resume almost immediately but also after short delay
    resumeRadio();
    const timeout = setTimeout(resumeRadio, 1000);
    const timeout2 = setTimeout(resumeRadio, 3000);

    const handleForceResume = () => {
      console.log("[Radio] Received cc_trigger_autostart_resume. Forcing playback...");
      resumeRadio();
    };
    window.addEventListener('cc_trigger_autostart_resume', handleForceResume);

    return () => {
        clearTimeout(timeout);
        clearTimeout(timeout2);
        window.removeEventListener('cc_trigger_autostart_resume', handleForceResume);
    };
  }, [activeStream, playStream]); // Dependencies allow it to re-run if needed

  const streams: RadioStreamType[] = ['PL', 'GLOBAL', 'BIBLIA'];

  const nextStream = useCallback(() => {
    const currentIndex = streams.indexOf(activeStream);
    const nextIndex = (currentIndex + 1) % streams.length;
    playStream(streams[nextIndex]);
  }, [activeStream, playStream]);

  const prevStream = useCallback(() => {
    const currentIndex = streams.indexOf(activeStream);
    const prevIndex = (currentIndex - 1 + streams.length) % streams.length;
    playStream(streams[prevIndex]);
  }, [activeStream, playStream]);

  useEffect(() => {
    playStreamRef.current = playStream;
  }, [playStream]);


  const toggleRadio = useCallback(() => {
    if (isRadioPlaying) {
      stopPlayback();
      addToast(t('radio.stopped'), "info");
    } else {
      // Reset CORS on manual start to try visualizer again
      setUseCORS(true);
      playStream(activeStream, t('radio.starting'));
    }
  }, [isRadioPlaying, activeStream, playStream, stopPlayback, t, addToast]);

  useEffect(() => {
    const alarmInterval = setInterval(() => {
      if (!radioAlarm || !radioAlarm.enabled) return;
      const now = new Date();
      const selectedDays = radioAlarm.selectedDays || [0, 1, 2, 3, 4, 5, 6];
      if (!selectedDays.includes(now.getDay())) return;
      const currentHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayStr = getLocalDateString(now);
      if (currentHHmm === radioAlarm.time && radioAlarm.lastTriggeredDate !== todayStr) {
        if (radioAlarm.localFileId) {
          import('./services/mediaPlayerService').then(({ mediaPlayerService }) => {
            const storedMaterialsStr = localStorage.getItem('cc_userMaterials') || '[]';
            let storedMaterials = [];
            try {
              storedMaterials = JSON.parse(storedMaterialsStr);
            } catch(e) {}
            const material = storedMaterials.find((m: any) => m.id === radioAlarm.localFileId);
            if (material) {
              if (isRadioPlaying) {
                stopPlayback();
              }
              mediaPlayerService.play(material, storedMaterials);
              const updatedAlarm = { ...radioAlarm, lastTriggeredDate: todayStr };
              setRadioAlarm(updatedAlarm);
              PersistenceService.saveRadioAlarm(updatedAlarm);
            } else {
              // Fallback to radio if file not found
              const targetStream = radioAlarm.stream || 'PL';
              playStream(targetStream, t('radio.alarm'), true);
              const updatedAlarm = { ...radioAlarm, lastTriggeredDate: todayStr };
              setRadioAlarm(updatedAlarm);
              PersistenceService.saveRadioAlarm(updatedAlarm);
            }
          });
        } else if (!isRadioPlaying) {
          const targetStream = radioAlarm.stream || 'PL';
          playStream(targetStream, t('radio.alarm'), true);
          const updatedAlarm = { ...radioAlarm, lastTriggeredDate: todayStr };
          setRadioAlarm(updatedAlarm);
          PersistenceService.saveRadioAlarm(updatedAlarm);
        }
      }
    }, 10000); 
    return () => clearInterval(alarmInterval);
  }, [radioAlarm, isRadioPlaying, playStream, t, stopPlayback]);

  useEffect(() => {
    const handleForcedTrigger = () => {
      if (radioAlarm && radioAlarm.enabled) {
        if (radioAlarm.localFileId) {
          import('./services/mediaPlayerService').then(({ mediaPlayerService }) => {
            const storedMaterialsStr = localStorage.getItem('cc_userMaterials') || '[]';
            let storedMaterials = [];
            try {
              storedMaterials = JSON.parse(storedMaterialsStr);
            } catch(e) {}
            const material = storedMaterials.find((m: any) => m.id === radioAlarm.localFileId);
            if (material) {
              if (isRadioPlaying) {
                stopPlayback();
              }
              mediaPlayerService.play(material, storedMaterials);
            } else {
              const targetStream = radioAlarm.stream || 'PL';
              playStream(targetStream, t('radio.alarm'), true);
            }
          });
        } else {
          const targetStream = radioAlarm.stream || 'PL';
          playStream(targetStream, t('radio.alarm'), true);
        }
      }
    };

    window.addEventListener('cc_trigger_radio_alarm', handleForcedTrigger);
    return () => window.removeEventListener('cc_trigger_radio_alarm', handleForcedTrigger);
  }, [radioAlarm, playStream, t, isRadioPlaying, stopPlayback]);

  const updateAlarm = useCallback((newAlarm: RadioAlarm) => {
    setRadioAlarm(newAlarm);
    PersistenceService.saveRadioAlarm(newAlarm);
    if (nativeService.isNative()) {
      nativeService.scheduleRadioAlarm({
        time: newAlarm.time,
        selectedDays: newAlarm.selectedDays,
        enabled: newAlarm.enabled
      });
    }
  }, []);

  const updateVolume = useCallback((val: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = val;
    }
    setVolume(val);
    PersistenceService.saveVolume(val);
  }, []);

  // Initial sync for native
  useEffect(() => {
    if (radioAlarm && nativeService.isNative()) {
      nativeService.scheduleRadioAlarm({
        time: radioAlarm.time,
        selectedDays: radioAlarm.selectedDays,
        enabled: radioAlarm.enabled
      });
    }
  }, []); // Only on mount

  useEffect(() => {
    if (!isRadioPlaying) return;
    
    let lastTime = audioRef.current?.currentTime || 0;
    let stallCount = 0;
    
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      // Check if paused but should be playing
      if (audio.paused && isRadioPlaying && !isSwitchingRef.current && retryCountRef.current === 0) {
        console.warn("Radio is supposed to be playing but is paused. Attempting to resume...");
        safePlay(audio).catch(() => handleReconnect());
        return;
      }
      
      // Check for time progress stalls
      if (audio.currentTime === lastTime && !audio.paused && isRadioPlaying && !isSwitchingRef.current) {
        stallCount++;
        if (stallCount > 10) { // Reduced to 10 seconds of no progress
          console.warn("Radio playback seems stalled (no time progress). Reconnecting...");
          handleReconnect();
          stallCount = 0;
        }
      } else {
        stallCount = 0;
      }
      lastTime = audio.currentTime;
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRadioPlaying, handleReconnect]);

  // Media Session API Integration
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.preload = "auto";
      (audio as any).playsInline = true;
      
      const onAudioError = (e: any) => {
        const error = audio.error;
        console.error("[Radio] Audio element error:", error || e);
        if (error && error.code === error.MEDIA_ERR_ABORTED) return;
        handleReconnect();
      };

      const onAudioEnded = () => {
        console.log("[Radio] Audio ended unexpectedly");
        handleReconnect();
      };

      const onAudioStalled = () => {
        console.warn("[Radio] Audio stalled");
      };

      const onAudioWaiting = () => {
        console.log("[Radio] Audio waiting (buffering)...");
      };

      const onAudioPlaying = () => {
        console.log("[Radio] Audio started playing");
        playStartTimeRef.current = Date.now();
        retryCountRef.current = 0; 
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        if (shortPlayTimeoutRef.current) clearTimeout(shortPlayTimeoutRef.current);
        shortPlayTimeoutRef.current = window.setTimeout(() => {
          console.log("[Radio] Playback sustained for 3s, clearing short-play detection.");
          shortPlayTimeoutRef.current = null;
        }, 3000);
      };

      const onAudioPause = () => {
        if (isRadioPlaying && !isSwitchingRef.current && !intentionalStopRef.current) {
          const playDuration = Date.now() - playStartTimeRef.current;
          console.warn(`[Radio] Audio paused unexpectedly. Duration: ${playDuration}ms, RetryCount: ${retryCountRef.current}`);
          
          if (playDuration < 3000 && playDuration > 100) {
            console.warn("[Radio] Short play detected. Forcing immediate reconnection strategy.");
            if (retryCountRef.current < 3) {
              // If it's a short play, we might want to skip directly to more aggressive strategies
              if (retryCountRef.current === 0) {
                setUseCORS(false);
                setVisualizerEnabled(false);
              } else if (retryCountRef.current === 1) {
                setForceNative(true);
              }
              handleReconnect();
            } else {
              console.error("[Radio] Too many short plays. Stopping to avoid loop.");
              stopPlayback();
              addToast(t('radio.error'), "news");
            }
          } else if (playDuration >= 3000) {
            console.warn("[Radio] Attempting to resume...");
            safePlay(audio).catch((err) => {
              if (err && err.name === 'NotAllowedError') {
                console.warn("[Radio] Auto-resume blocked. Pausing fully.");
                stopPlayback();
              } else {
                handleReconnect();
              }
            });
          }
        }
      };

      const onCanPlay = () => {
        console.log("[Radio] Audio can play now.");
      };

      audio.addEventListener('error', onAudioError);
      audio.addEventListener('ended', onAudioEnded);
      audio.addEventListener('stalled', onAudioStalled);
      audio.addEventListener('waiting', onAudioWaiting);
      audio.addEventListener('playing', onAudioPlaying);
      audio.addEventListener('pause', onAudioPause);
      audio.addEventListener('canplay', onCanPlay);

      return () => {
        audio.removeEventListener('error', onAudioError);
        audio.removeEventListener('ended', onAudioEnded);
        audio.removeEventListener('stalled', onAudioStalled);
        audio.removeEventListener('waiting', onAudioWaiting);
        audio.removeEventListener('playing', onAudioPlaying);
        audio.removeEventListener('pause', onAudioPause);
        audio.removeEventListener('canplay', onCanPlay);
      };
    }
  }, [handleReconnect, isRadioPlaying, forceNative, t, addToast, stopPlayback]);

  // Media Session API & Native Background Integration
  useEffect(() => {
    const metadataConfig: Record<RadioStreamType, { title: string, artist: string, album: string, artwork: string }> = {
      'PL': {
        title: 'Radio PL',
        artist: 'Christian Culture',
        album: 'Halleluyah Radio',
        artwork: '/android-chrome-512x512.png'
      },
      'GLOBAL': {
        title: 'Radio Global',
        artist: 'Christian Culture',
        album: 'CC Global',
        artwork: '/android-chrome-512x512.png'
      },
      'BIBLIA': {
        title: 'Radio Biblia',
        artist: 'Christian Culture',
        album: 'Biblia Audio',
        artwork: '/android-chrome-512x512.png'
      }
    };

    const config = metadataConfig[activeStream];

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => playStream(activeStream));
      navigator.mediaSession.setActionHandler('pause', () => stopPlayback());
      navigator.mediaSession.setActionHandler('stop', () => stopPlayback());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevStream());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextStream());

      if (isRadioPlaying) {
        navigator.mediaSession.playbackState = 'playing';
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: config.title,
          artist: config.artist,
          album: config.album,
          artwork: [
            { src: config.artwork + '?v=5', sizes: '512x512', type: 'image/png' },
            { src: '/android-chrome-192x192.png?v=5', sizes: '192x192', type: 'image/png' },
          ]
        });
      } else {
        navigator.mediaSession.playbackState = 'paused';
      }
    }

    if (nativeService.isNative()) {
      if (isRadioPlaying) {
        CapacitorMusicControls.create({
          track: config.title,
          artist: config.artist,
          cover: config.artwork,
          album: config.album || '',
          ticker: '',
          isPlaying: true,
          dismissable: false,
          hasPrev: true,
          hasNext: true,
          hasClose: true,
          notificationIcon: '',
          playIcon: '',
          pauseIcon: '',
          prevIcon: '',
          nextIcon: '',
          closeIcon: '',
        }).then(() => {
           // Success
        }).catch((e: any) => console.error("Error creating native media controls", e));
      } else {
        CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
        // We delay destroying so it stays in notification for a bit or immediately destroy
        setTimeout(() => {
           if (!intentionalStopRef.current) CapacitorMusicControls.destroy();
        }, 100);
      }
    }
  }, [isRadioPlaying, activeStream, playStream, stopPlayback, nextStream, prevStream]);

  // Synchronize callbacks for the single-mount native listener to prevent listener churn and stale closures
  const stopPlaybackRef = useRef(stopPlayback);
  const nextStreamRef = useRef(nextStream);
  const prevStreamRef = useRef(prevStream);
  const activeStreamRef = useRef(activeStream);

  useEffect(() => {
    stopPlaybackRef.current = stopPlayback;
    nextStreamRef.current = nextStream;
    prevStreamRef.current = prevStream;
    activeStreamRef.current = activeStream;
  }, [stopPlayback, nextStream, prevStream, activeStream]);

  // One time native listeners - mounts exactly once to remain stable in background
  useEffect(() => {
    if (!nativeService.isNative()) return;
    
    let listenerParams: any = undefined;
    console.log('[Radio] Registering background native music control listener...');
    
    CapacitorMusicControls.addListener('controlsNotification', (event: any) => {
      const message = event.message || event;
      console.log(`[Radio] Native music control notification event received: ${message}`);
      switch(message) {
        case 'music-controls-next':
          nextStreamRef.current();
          break;
        case 'music-controls-previous':
          prevStreamRef.current();
          break;
        case 'music-controls-pause':
          stopPlaybackRef.current();
          break;
        case 'music-controls-play':
          playStreamRef.current(activeStreamRef.current);
          break;
        case 'music-controls-destroy':
        case 'music-controls-stop':
          stopPlaybackRef.current();
          CapacitorMusicControls.destroy();
          break;
      }
    }).then((l: any) => {
      listenerParams = l;
    }).catch((e: any) => console.error(e));

    return () => {
       if (listenerParams && listenerParams.remove) {
         console.log('[Radio] Cleaning up persistent background music control listener');
         listenerParams.remove();
       }
    };
  }, []);

  return useMemo(() => ({ 
    audioRef, 
    isRadioPlaying, 
    activeStream, 
    toggleRadio, 
    playStream, 
    stopPlayback, 
    setActiveStream, 
    radioAlarm, 
    updateAlarm, 
    volume, 
    updateVolume, 
    visualizerEnabled, 
    useCORS,
    nextStream, 
    prevStream 
  }), [
    isRadioPlaying, 
    activeStream, 
    toggleRadio, 
    playStream, 
    stopPlayback, 
    radioAlarm, 
    updateAlarm, 
    volume, 
    updateVolume, 
    visualizerEnabled, 
    useCORS,
    nextStream, 
    prevStream
  ]);
};
