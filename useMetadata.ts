
import { useState, useEffect, useRef } from 'react';
import { RadioStreamType } from './types';

const ZENO_KEYS: Record<RadioStreamType, string> = {
  PL: 'vz96pvl3pnktv',
  GLOBAL: 'umej2cuqncluv',
  BIBLIA: 'imo45hqnshyuv'
};

export const useMetadata = (activeStream: RadioStreamType, isPlaying: boolean) => {
  const [metadata, setMetadata] = useState<string>('');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const cleanTitle = (title: string) => {
      if (!title) return '';
      
      // 1. Remove file extensions like .wav, .mp3, .m4a etc.
      let cleaned = title.replace(/\.[a-zA-Z0-9]{2,4}$/, '');
      
      // 2. Remove standalone promotional strings that might appear (as a safety measure)
      const standalonePromo = [
        /Słuchaj w aplikacji Zeno Radio/gi,
        /Zeno\.fm/gi,
        /Zeno Radio/gi
      ];
      
      standalonePromo.forEach(pattern => {
        cleaned = cleaned.replace(pattern, '');
      });

      return cleaned.trim();
    };

    // Clean up previous connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (!isPlaying) {
      setMetadata('');
      return;
    }

    const key = ZENO_KEYS[activeStream];
    if (!key) return;

    try {
      // Zeno.fm SSE Metadata endpoint
      const url = `https://api.zeno.fm/mounts/metadata/subscribe/${key}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.streamTitle) {
            setMetadata(cleanTitle(data.streamTitle));
          }
        } catch (e) {
          // If not JSON, maybe it's raw text
          if (event.data) {
            setMetadata(cleanTitle(event.data));
          }
        }
      };

      es.onerror = () => {
        console.warn('[Metadata] SSE Error, closing connection');
        es.close();
      };

    } catch (error) {
      console.error('[Metadata] Failed to connect to Zeno SSE:', error);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [activeStream, isPlaying]);

  return metadata;
};
