import { BibleVerse, WidgetConfig } from './types';

export const DEFAULT_BIBLE_VERSE: BibleVerse = {
  reference: "Ps 23, 1",
  text: "Pan jest moim pasterzem, nie brak mi niczego.",
  translation: "BW"
};

export const DEFAULT_WIDGET_CONFIGS: Record<string, WidgetConfig> = {
  'bible-daily': {
    id: 'bible-daily',
    name: 'Słowo Dnia',
    nameEn: 'Word of the Day',
    description: 'Centrowany werset z tłem i przyciskami premium.',
    backgroundImage: "https://images.unsplash.com/photo-1504052434139-41951f690761?q=80&w=2070&auto=format&fit=crop",
    titleColor: '#D4AF37',
    contentColor: '#FFFFFF',
    accentColor: '#D4AF37',
    backgroundAlpha: 80,
    borderRadius: 32,
    letterSpacing: '0.3em',
    fontSize: 18,
    showLogo: true,
    blurAmount: 10,
    borderWidth: 1,
    shadowIntensity: 20,
    fontFamily: 'Lora',
    isPinned: true,
    gridPos: { x: 0, y: 0, w: 4, h: 4 }
  },
  'radio-control': {
    id: 'radio-control',
    name: 'CC Radio',
    nameEn: 'CC Radio',
    description: 'Kontroler radia z wyborem stacji.',
    accentColor: '#D4AF37',
    titleColor: '#D4AF37',
    backgroundAlpha: 90,
    borderRadius: 24,
    borderWidth: 1,
    shadowIntensity: 40,
    isPinned: true,
    gridPos: { x: 4, y: 0, w: 4, h: 2 }
  },
  'media-player': {
    id: 'media-player',
    name: 'Media Player',
    nameEn: 'Media Player',
    description: 'Prosty odtwarzacz multimedialny.',
    accentColor: '#D4AF37',
    titleColor: '#D4AF37',
    backgroundAlpha: 90,
    borderRadius: 16,
    borderWidth: 1,
    isPinned: true,
    gridPos: { x: 4, y: 2, w: 4, h: 2 }
  }
};
