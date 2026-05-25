
import React from 'react';
import { 
  Zap, Radio, Book, Layers, Globe, ShoppingBag, 
  MapPin, MessageSquare, Heart, GraduationCap, 
  User, LifeBuoy, Calendar, Search, Music,
  Cpu, LayoutGrid, ShieldCheck, Mail
} from 'lucide-react';

export type EcosystemCategory = 'TOOL' | 'AUDIO' | 'STUDY' | 'COMMUNITY' | 'SYSTEM';

export interface AppFeature {
  id: string;
  category: EcosystemCategory;
  title: { pl: string; en: string };
  subtitle: { pl: string; en: string };
  keywords: { pl: string[]; en: string[] };
  icon: string; // We'll use a string key to map to icons in the component
  primaryAction: { 
    label: { pl: string; en: string }; 
    action: string;
  };
  secondaryAction?: { 
    label: { pl: string; en: string }; 
    action: string; 
  };
}

export const APP_INDEX: AppFeature[] = [
  {
    id: 'radio',
    category: 'AUDIO',
    title: { pl: 'POLSKIE RADIO CC', en: 'POLISH RADIO CC' },
    subtitle: { pl: 'Globalny strumień uwielbienia', en: 'Global worship stream' },
    keywords: { 
      pl: ['radio', 'muzyka', 'słuchaj', 'uwielbienie', 'polskie radio', 'stream'], 
      en: ['radio', 'music', 'listen', 'worship', 'stream'] 
    },
    icon: 'Radio',
    primaryAction: { label: { pl: 'Słuchaj Teraz', en: 'Listen Now' }, action: 'navigate:radio' },
    secondaryAction: { label: { pl: 'Strumienie', en: 'Streams' }, action: 'navigate:radio:streams' }
  },
  {
    id: 'verse-creator-mini',
    category: 'TOOL',
    title: { pl: 'KREATOR WERSETU', en: 'VERSE CREATOR' },
    subtitle: { pl: 'Kreator tła do Wersetu Dnia', en: 'Verse of the Day background creator' },
    keywords: { 
      pl: ['werset', 'grafika', 'kreator', 'obraz', 'tworzenie', 'generuj', 'zdjęcie'], 
      en: ['verse', 'graphics', 'creator', 'image', 'create', 'generate', 'picture'] 
    },
    icon: 'ImageIcon',
    primaryAction: { label: { pl: 'Otwórz Kreator', en: 'Open Creator' }, action: 'navigate:verse-creator' }
  },
  {
    id: 'song-creator',
    category: 'TOOL',
    title: { pl: 'SONG CREATOR AI', en: 'SONG CREATOR AI' },
    subtitle: { pl: 'Stwórz osobistą pieśń uwielbienia', en: 'Create personal worship song' },
    keywords: { 
      pl: ['piosenka', 'muzyka', 'stwórz', 'ai', 'utwór', 'dźwięk', 'produkcja'], 
      en: ['song', 'music', 'create', 'ai', 'composition', 'audio', 'production'] 
    },
    icon: 'Music',
    primaryAction: { label: { pl: 'Stwórz Pieśń', en: 'Create Song' }, action: 'navigate:song-creator' },
    secondaryAction: { label: { pl: 'Moje Pieśni', en: 'My Songs' }, action: 'navigate:song-creator:library' }
  },
  {
    id: 'imagination-studio',
    category: 'TOOL',
    title: { pl: 'IMAGINATION STUDIO', en: 'IMAGINATION STUDIO' },
    subtitle: { pl: 'Projektuj luksusową odzież 3D', en: 'Design luxury 3D apparel' },
    keywords: { 
      pl: ['koszulka', 'bluza', 'odzież', 't-shirt', 'design', '3d', 'projekt', 'ubranie'], 
      en: ['shirt', 'hoodie', 'clothing', 'apparel', 'design', '3d', 'project', 'garment'] 
    },
    icon: 'Zap',
    primaryAction: { label: { pl: 'Zacznij Projekt', en: 'Start Project' }, action: 'navigate:imagination-studio' },
    secondaryAction: { label: { pl: 'Zapisane', en: 'Saved' }, action: 'navigate:imagination-studio:saved' }
  },
  {
    id: 'store',
    category: 'TOOL',
    title: { pl: 'SKLEP CC', en: 'STORE CC' },
    subtitle: { pl: 'Luksusowe produkty Christian Culture', en: 'Luxury Christian Culture products' },
    keywords: { 
      pl: ['sklep', 'kup', 'produkty', 'odzież', 'kubek', 'akcesoria', 'merch'], 
      en: ['store', 'shop', 'buy', 'products', 'clothing', 'mug', 'accessories', 'merch'] 
    },
    icon: 'ShoppingBag',
    primaryAction: { label: { pl: 'Otwórz Sklep', en: 'Open Store' }, action: 'navigate:store' },
    secondaryAction: { label: { pl: 'Kategorie', en: 'Categories' }, action: 'navigate:store:categories' }
  },
  {
    id: 'open-letter',
    category: 'COMMUNITY',
    title: { pl: 'LIST OTWARTY', en: 'OPEN LETTER' },
    subtitle: { pl: 'Zaproszenie do Współtworzenia', en: 'Invitation to Co-create' },
    keywords: { 
      pl: ['list', 'otwarty', 'zaproszenie', 'współpraca', 'ekosystem', 'kultura', 'chrześcijańska', 'cezary rogowki'], 
      en: ['open', 'letter', 'invitation', 'cooperation', 'ecosystem', 'culture', 'christian', 'cezary rogowski'] 
    },
    icon: 'Mail',
    primaryAction: { label: { pl: 'Czytaj List', en: 'Read Letter' }, action: 'navigate:open-letter' }
  },
  {
    id: 'live-global',
    category: 'COMMUNITY',
    title: { pl: 'LIVE GLOBAL MAP', en: 'LIVE GLOBAL MAP' },
    subtitle: { pl: 'Duchowa łączność w czasie rzeczywistym', en: 'Real-time spiritual connection' },
    keywords: { 
      pl: ['mapa', 'global', 'świat', 'modlitwa', 'ludzie', 'aktywność', 'geografia', 'gdzie'], 
      en: ['map', 'global', 'world', 'prayer', 'people', 'activity', 'geography', 'where'] 
    },
    icon: 'Globe',
    primaryAction: { label: { pl: 'Centrum Dowodzenia', en: 'Command Center' }, action: 'navigate:live-global' },
    secondaryAction: { label: { pl: 'Zamelduj Się', en: 'Check-in' }, action: 'navigate:profile' }
  },
  {
    id: 'reading-room',
    category: 'STUDY',
    title: { pl: 'CZYTELNIA CC', en: 'CC READING ROOM' },
    subtitle: { pl: 'Biblioteka Słowa i wiedzy', en: 'Library of Word and knowledge' },
    keywords: { 
      pl: ['czytelnia', 'książka', 'lektura', 'biblioteka', 'tekst', 'czytaj', 'wiedza'], 
      en: ['reading', 'book', 'library', 'text', 'read', 'knowledge'] 
    },
    icon: 'Book',
    primaryAction: { label: { pl: 'Otwórz Czytelnię', en: 'Open Library' }, action: 'navigate:reading-room' },
    secondaryAction: { label: { pl: 'Katalog', en: 'Catalog' }, action: 'navigate:reading-room:catalog' }
  },
  {
    id: 'bible-courses',
    category: 'STUDY',
    title: { pl: 'KURSY BIBLIJNE', en: 'BIBLE COURSES' },
    subtitle: { pl: 'Odkryj darmowe Kursy Biblijne', en: 'Discover free Bible Courses' },
    keywords: { 
      pl: ['kursy', 'biblijne', 'biblia', 'nauka', 'kurs', 'rozwój', 'studium'], 
      en: ['courses', 'biblical', 'bible', 'study', 'course', 'development'] 
    },
    icon: 'GraduationCap',
    primaryAction: { label: { pl: 'Otwórz', en: 'Open' }, action: 'open:bible_courses' }
  },
  {
    id: 'school',
    category: 'STUDY',
    title: { pl: 'SZKOŁA BIBLIJNA', en: 'BIBLICAL SCHOOL' },
    subtitle: { pl: 'Twój rozwój w wierze', en: 'Your growth in faith' },
    keywords: { 
      pl: ['szkoła', 'lekcja', 'nauka', 'kurs', 'biblia', 'egzamin', 'rozwój', 'uczeń'], 
      en: ['school', 'lesson', 'study', 'course', 'bible', 'exam', 'growth', 'student'] 
    },
    icon: 'GraduationCap',
    primaryAction: { label: { pl: 'Moje Kursy', en: 'My Courses' }, action: 'navigate:school' },
    secondaryAction: { label: { pl: 'Egzaminy', en: 'Exams' }, action: 'navigate:school:exams' }
  },
  {
    id: 'bible',
    category: 'STUDY',
    title: { pl: 'ŚWIĘTA BIBLIA', en: 'HOLY BIBLE' },
    subtitle: { pl: 'Pismo Święte online', en: 'Holy Scriptures online' },
    keywords: { 
      pl: ['biblia', 'pismo', 'słowo', 'werset', 'rozdział', 'księga', 'stary testament', 'nowy testament'], 
      en: ['bible', 'scripture', 'word', 'verse', 'chapter', 'book', 'old testament', 'new testament'] 
    },
    icon: 'Book',
    primaryAction: { label: { pl: 'Szukaj Wersetu', en: 'Search Verse' }, action: 'navigate:biblia' },
    secondaryAction: { label: { pl: 'Czytaj', en: 'Read' }, action: 'navigate:reading-room' }
  },
  {
    id: 'daily-verse-plan',
    category: 'STUDY',
    title: { pl: 'SŁOWO NA DZIŚ / PLANER', en: 'WORD FOR TODAY / PLANNER' },
    subtitle: { pl: 'Biblia w rok i codzienny werset', en: 'Bible in a year and daily verse' },
    keywords: { 
      pl: ['biblia w rok', 'słowo dnia', 'słowo na dziś', 'czytam biblię', 'planer biblijny', 'plan'], 
      en: ['bible in a year', 'daily word', 'word for today', 'read bible', 'bible planner', 'reading plan'] 
    },
    icon: 'Calendar',
    primaryAction: { label: { pl: 'Otwórz Słowo Dnia', en: 'Open Word of the Day' }, action: 'open:daily_verse' }
  },
  {
    id: 'prayer',
    category: 'COMMUNITY',
    title: { pl: 'ŚCIANA MODLITWY', en: 'PRAYER WALL' },
    subtitle: { pl: 'Intencje modlitewne i wsparcie', en: 'Prayer intentions and support' },
    keywords: { 
      pl: ['modlitwa', 'intencja', 'prośba', 'podziękowanie', 'wsparcie', 'wołanie', 'ściana', 'modlitwy', 'sos'], 
      en: ['prayer', 'intention', 'request', 'thanksgiving', 'support', 'wall', 'sos'] 
    },
    icon: 'Heart',
    primaryAction: { label: { pl: 'Dodaj Intencję', en: 'Add Intention' }, action: 'navigate:prayer' },
    secondaryAction: { label: { pl: 'Módl się', en: 'Pray' }, action: 'navigate:live-global' }
  },
  {
    id: 'mentor',
    category: 'COMMUNITY',
    title: { pl: 'AI MENTOR - JOZUE', en: 'AI MENTOR - JOSHUA' },
    subtitle: { pl: 'Twój inteligentny asystent', en: 'Your intelligent assistant' },
    keywords: { 
      pl: ['mentor', 'asystent', 'pomoc', 'pytanie', 'jozue', 'joshua', 'ai', 'porada'], 
      en: ['mentor', 'assistant', 'help', 'question', 'joshua', 'ai', 'advice'] 
    },
    icon: 'Cpu',
    primaryAction: { label: { pl: 'Zapytaj Jozuego', en: 'Ask Joshua' }, action: 'navigate:mentor' },
    secondaryAction: { label: { pl: 'FAQ', en: 'FAQ' }, action: 'navigate:support' }
  },
  {
    id: 'chat',
    category: 'COMMUNITY',
    title: { pl: 'CZAT SPOŁECZNOŚCI', en: 'COMMUNITY CHAT' },
    subtitle: { pl: 'Buduj relacje w wierze', en: 'Build relationships in faith' },
    keywords: { 
      pl: ['czat', 'chat', 'rozmowa', 'wiadomość', 'społeczność', 'ludzie', 'kontakt'], 
      en: ['chat', 'conversation', 'message', 'community', 'people', 'contact'] 
    },
    icon: 'MessageSquare',
    primaryAction: { label: { pl: 'Otwórz Czat', en: 'Open Chat' }, action: 'navigate:chat' },
    secondaryAction: { label: { pl: 'Użytkownicy', en: 'Users' }, action: 'navigate:profile' }
  },
  {
    id: 'business-card',
    category: 'SYSTEM',
    title: { pl: 'WIZYTÓWKA / PROFIL', en: 'BUSINESS CARD / PROFILE' },
    subtitle: { pl: 'Zarządzaj swoim profilem publicznym i aplikacją', en: 'Manage your public profile and app' },
    keywords: { 
      pl: ['wizytówka', 'profil', 'profilu', 'biznesowa', 'karta', 'administrator', 'ustawienia'], 
      en: ['business', 'card', 'profile', 'admin', 'settings'] 
    },
    icon: 'User',
    primaryAction: { label: { pl: 'Otwórz Profil', en: 'Open Profile' }, action: 'open:business_card' }
  },
  {
    id: 'profile',
    category: 'SYSTEM',
    title: { pl: 'PROFIL WOJOWNIKA', en: 'WARRIOR PROFILE' },
    subtitle: { pl: 'Twoja tożsamość w Chrystusie', en: 'Your identity in Christ' },
    keywords: { 
      pl: ['profil', 'konto', 'ustawienia', 'avatar', 'ja', 'tożsamość', 'postęp'], 
      en: ['profile', 'account', 'settings', 'avatar', 'me', 'identity', 'progress'] 
    },
    icon: 'User',
    primaryAction: { label: { pl: 'Mój Profil', en: 'My Profile' }, action: 'navigate:profile' },
    secondaryAction: { label: { pl: 'Zmień Avatar', en: 'Change Avatar' }, action: 'navigate:profile:edit' }
  },
  {
    id: 'support',
    category: 'SYSTEM',
    title: { pl: 'CENTRUM POMOCY', en: 'SUPPORT CENTER' },
    subtitle: { pl: 'Pomoc techniczna i duchowa', en: 'Technical and spiritual support' },
    keywords: { 
      pl: ['pomoc', 'support', 'błąd', 'problem', 'kontakt', 'pomoż', 'awaria'], 
      en: ['help', 'support', 'error', 'problem', 'contact', 'repair'] 
    },
    icon: 'LifeBuoy',
    primaryAction: { label: { pl: 'Zgłoś Problem', en: 'Report Problem' }, action: 'navigate:support' },
    secondaryAction: { label: { pl: 'Dokumentacja', en: 'Documentation' }, action: 'navigate:support:docs' }
  },
  {
    id: 'calendar',
    category: 'SYSTEM',
    title: { pl: 'KALENDARZ CC', en: 'CC CALENDAR' },
    subtitle: { pl: 'Wydarzenia i plan dnia', en: 'Events and daily plan' },
    keywords: { 
      pl: ['kalendarz', 'wydarzenia', 'plan', 'harmonogram', 'czas', 'kiedy', 'termin'], 
      en: ['calendar', 'events', 'plan', 'schedule', 'time', 'when', 'date'] 
    },
    icon: 'Calendar',
    primaryAction: { label: { pl: 'Otwórz Kalendarz', en: 'Open Calendar' }, action: 'navigate:calendar' },
    secondaryAction: { label: { pl: 'Harmonogram', en: 'Schedule' }, action: 'navigate:calendar:schedule' }
  },
  {
    id: 'news',
    category: 'SYSTEM',
    title: { pl: 'NOWOŚCI CC', en: 'CC NEWS' },
    subtitle: { pl: 'Co nowego w ekosystemie?', en: 'What\'s new in the ecosystem?' },
    keywords: { 
      pl: ['nowości', 'news', 'aktualizacja', 'zmiany', 'wersja', 'co nowego'], 
      en: ['news', 'updates', 'changes', 'version', 'what\'s new'] 
    },
    icon: 'Layers',
    primaryAction: { label: { pl: 'Zobacz Nowości', en: 'See News' }, action: 'navigate:news' },
    secondaryAction: { label: { pl: 'Wersja', en: 'Version' }, action: 'navigate:support' }
  },
  {
    id: 'verse-generator',
    category: 'TOOL',
    title: { pl: 'VERSE GENERATOR MAX', en: 'VERSE GENERATOR MAX' },
    subtitle: { pl: 'Profesjonalny kreator grafik biblijnych', en: 'Professional Bible graphic creator' },
    keywords: { 
      pl: ['generator', 'grafika', 'obraz', 'werset', 'kreator', 'max', 'design'], 
      en: ['generator', 'graphic', 'image', 'verse', 'creator', 'max', 'design'] 
    },
    icon: 'Zap',
    primaryAction: { label: { pl: 'Generuj Grafike', en: 'Generate Graphic' }, action: 'navigate:imagination-studio' },
    secondaryAction: { label: { pl: 'Moje Grafiki', en: 'My Graphics' }, action: 'navigate:store' }
  },
  {
    id: 'identity',
    category: 'SYSTEM',
    title: { pl: 'IDENTITY ENGINE', en: 'IDENTITY ENGINE' },
    subtitle: { pl: 'Zarządzaj swoją tożsamością', en: 'Manage your identity' },
    keywords: { 
      pl: ['identity', 'tożsamość', 'silnik', 'profile', 'dane', 'rozpoznanie'], 
      en: ['identity', 'engine', 'profile', 'data', 'recognition'] 
    },
    icon: 'ShieldCheck',
    primaryAction: { label: { pl: 'Zarządzaj', en: 'Manage' }, action: 'navigate:profile' }
  },
  {
    id: 'law-decalogue',
    category: 'STUDY',
    title: { pl: 'PRAWO — DEKALOG', en: 'LAW — DECALOGUE' },
    subtitle: { pl: 'Dziesięć Przykazań Bożych', en: 'Ten Commandments of God' },
    keywords: { 
      pl: ['prawo', 'dekalog', 'przykazania', 'zasady', 'boże prawo', '10 przykazań'], 
      en: ['law', 'decalogue', 'commandments', 'rules', 'gods law', '10 commandments'] 
    },
    icon: 'ShieldCheck',
    primaryAction: { label: { pl: 'Otwórz Dekalog', en: 'Open Decalogue' }, action: 'navigate:law-decalogue' }
  },
  {
    id: 'opowiadania-z-moralem',
    category: 'STUDY',
    title: { pl: 'OPOWIADANIA Z MORAŁEM', en: 'STORIES WITH A MORAL' },
    subtitle: { pl: 'Poznaj Christian Culture: Opowiadania z morałem', en: 'Discover Christian Culture: Stories with a moral' },
    keywords: { 
      pl: ['opowiadania', 'morał', 'zbyszek', 'gieroń', 'historie', 'przewodnik', 'zbigniew'], 
      en: ['stories', 'moral', 'zbyszek', 'gieroń', 'guide', 'tales', 'zbigniew'] 
    },
    icon: 'Book',
    primaryAction: { label: { pl: 'Otwórz Wizytówkę', en: 'Open Profile' }, action: 'open:zbyszek_gieron' }
  },
  {
    id: 'profile-cezary',
    category: 'COMMUNITY',
    title: { pl: 'CEZARY ROGOWSKI', en: 'CEZARY ROGOWSKI' },
    subtitle: { pl: 'Wizjoner Christian Culture Network', en: 'Visionary of Christian Culture Network' },
    keywords: { 
      pl: ['cezary', 'rogowski', 'wizjoner', 'szef', 'założyciel', 'prowadzący', 'prezes', 'autor', 'pokonać goliata'], 
      en: ['cezary', 'rogowski', 'visionary', 'founder', 'leader', 'ceo', 'author', 'overcoming goliath'] 
    },
    icon: 'User',
    primaryAction: { label: { pl: 'Otwórz Wizytówkę', en: 'Open Profile' }, action: 'open:business_card' }
  },
  {
    id: 'profile-zbyszek',
    category: 'COMMUNITY',
    title: { pl: 'ZBYSZEK GIEROŃ', en: 'ZBYSZEK GIEROŃ' },
    subtitle: { pl: 'Opowiadania z morałem i inspiracja', en: 'Stories with a moral and inspiration' },
    keywords: { 
      pl: ['zbyszek', 'gieroń', 'zbigniew', 'opowiadania', 'morał', 'brat', 'lektor', 'jezus wraca'], 
      en: ['zbyszek', 'gieroń', 'zbigniew', 'stories', 'moral', 'brother', 'narrator', 'jesus returns'] 
    },
    icon: 'User',
    primaryAction: { label: { pl: 'Otwórz Wizytówkę', en: 'Open Profile' }, action: 'open:zbyszek_gieron' }
  },
  {
    id: 'profile-miriam',
    category: 'COMMUNITY',
    title: { pl: 'MIRIAM', en: 'MIRIAM' },
    subtitle: { pl: 'Twój Mentor AI - Pocieszyciel', en: 'Your AI Mentor - Comforter' },
    keywords: { 
      pl: ['miriam', 'mentor', 'ai', 'pocieszyciel', 'modlitwa', 'wsparcie', 'kobieta'], 
      en: ['miriam', 'mentor', 'ai', 'comforter', 'prayer', 'support', 'woman'] 
    },
    icon: 'User',
    primaryAction: { label: { pl: 'Rozmawiaj', en: 'Talk' }, action: 'navigate:miriam' }
  },
  {
    id: 'profile-katarzyna',
    category: 'COMMUNITY',
    title: { pl: 'KATARZYNA FEDKÓW', en: 'KATARZYNA FEDKÓW' },
    subtitle: { pl: 'Ambasadorka CC Women', en: 'CC Women Ambassador' },
    keywords: { 
      pl: ['katarzyna', 'fedków', 'fedkow', 'women', 'ambasadorka', 'kobieta', 'inspiracja', 'cc women'], 
      en: ['katarzyna', 'fedkow', 'fedkow', 'women', 'ambassador', 'woman', 'inspiration', 'cc women'] 
    },
    icon: 'User',
    primaryAction: { label: { pl: 'Otwórz Wizytówkę', en: 'Open Profile' }, action: 'open:katarzyna_fedkow' }
  },
  {
    id: 'strategic-partners',
    category: 'COMMUNITY',
    title: { pl: 'PARTNERZY STRATEGICZNI', en: 'STRATEGIC PARTNERS' },
    subtitle: { pl: 'Poznaj naszych sprzymierzeńców', en: 'Meet our allies' },
    keywords: { 
      pl: ['partnerzy', 'stratedzy', 'współpraca', 'osobowość plus', 'your imagination studio', 'yis'], 
      en: ['partners', 'strategic', 'cooperation', 'osobowosc plus', 'your imagination studio', 'yis'] 
    },
    icon: 'Layers',
    primaryAction: { label: { pl: 'Zobacz Partnerów', en: 'View Partners' }, action: 'open:partners' }
  },
  {
    id: 'wdowi-grosz',
    category: 'COMMUNITY',
    title: { pl: 'WDOWI GROSZ', en: 'WIDOW\'S MITE' },
    subtitle: { pl: 'Wesprzyj misję oglądając reklamę', en: 'Support the mission by viewing an ad' },
    keywords: { 
      pl: ['wdowi grosz', 'wsparcie', 'reklama', 'finanse', 'pomoc', 'utrzymanie'], 
      en: ['widow\'s mite', 'support', 'advertisement', 'ads', 'help', 'maintenance'] 
    },
    icon: 'Heart',
    primaryAction: { label: { pl: 'Wesprzyj Teraz', en: 'Support Now' }, action: 'open:wdowi_grosz' }
  },
  {
    id: 'media-emi',
    category: 'COMMUNITY',
    title: { pl: 'EMI - MEDIA INFORMACYJNE', en: 'EMI - INFORMATIONAL MEDIA' },
    subtitle: { pl: 'Rzetelne informacje w kontekście wiary', en: 'Reliable information in faith context' },
    keywords: { 
      pl: ['emi', 'media', 'informacje', 'news', 'fakt', 'cc', 'christian culture'], 
      en: ['emi', 'media', 'news', 'information', 'fact', 'cc', 'christian culture'] 
    },
    icon: 'Radio',
    primaryAction: { label: { pl: 'Słuchaj', en: 'Listen' }, action: 'open:emi_media' }
  },
  {
    id: 'instrumental-music',
    category: 'AUDIO',
    title: { pl: 'MUZYKA INSTRUMENTALNA', en: 'INSTRUMENTAL MUSIC' },
    subtitle: { pl: 'Playlista utworów instrumentalnych z Dysku Google', en: 'Playlist of instrumental music from Google Drive' },
    keywords: { 
      pl: ['muzyka', 'instrumentalna', 'instrumental', 'playlista', 'utwory', 'dysk google'], 
      en: ['music', 'instrumental', 'playlist', 'tracks', 'google drive'] 
    },
    icon: 'Music',
    primaryAction: { label: { pl: 'Słuchaj', en: 'Listen' }, action: 'open:instrumental_music' }
  },
  {
    id: 'daily-reflections-pdf',
    category: 'STUDY',
    title: { pl: 'CYKL CODZIENNYCH ROZWAŻAŃ', en: 'DAILY REFLECTIONS CYCLE' },
    subtitle: { pl: 'Duchowy kompas na każdy dzień - Zbyszek Gieroń', en: 'Spiritual compass for every day - Zbyszek Gieroń' },
    keywords: { 
      pl: ['rozważania', 'cykl', 'codzienne', 'zbyszek', 'gieroń', 'pdf', 'dokument', 'lektura', 'duchowość'], 
      en: ['reflections', 'cycle', 'daily', 'zbyszek', 'gieroń', 'pdf', 'document', 'reading', 'spirituality'] 
    },
    icon: 'Book',
    primaryAction: { label: { pl: 'Otwórz Dokument', en: 'Open Document' }, action: 'open:daily_reflections_pdf' }
  },
  {
    id: 'resources-cc',
    category: 'AUDIO',
    title: { pl: 'ZASOBY CHRISTIAN CULTURE', en: 'CHRISTIAN CULTURE RESOURCES' },
    subtitle: { pl: 'Pliki i dzwonki do pobrania', en: 'Downloadable files and ringtones' },
    keywords: { 
      pl: ['zasoby', 'dzwonki', 'pobierz', 'download', 'pliki', 'dzwonek', 'telefon', 'dzień dobry'], 
      en: ['resources', 'ringtones', 'download', 'files', 'ringtone', 'phone', 'good morning'] 
    },
    icon: 'Layers',
    primaryAction: { label: { pl: 'Otwórz Zasoby', en: 'Open Resources' }, action: 'open:resources_cc' }
  },
  {
    id: 'media-player-page',
    category: 'AUDIO',
    title: { pl: 'ODTWARZACZ MULTIMEDIALNY CC', en: 'CC MULTIMEDIA PLAYER' },
    subtitle: { pl: 'Twoje centrum audio i wideo', en: 'Your audio and video center' },
    keywords: { 
      pl: ['odtwarzacz', 'media', 'muzyka', 'wideo', 'filmy', 'centrum multimedialne', 'play'], 
      en: ['player', 'media', 'music', 'video', 'movies', 'multimedia center', 'play'] 
    },
    icon: 'PlayCircle',
    primaryAction: { label: { pl: 'Otwórz Odtwarzacz', en: 'Open Player' }, action: 'open:media_player_page' }
  },
  {
    id: 'patrons',
    category: 'COMMUNITY',
    title: { pl: 'PATRON | MECENAS KULTURY', en: 'PATRON | CULTURAL MECENAS' },
    subtitle: { pl: 'Podziękowanie dla Wspierających Misję', en: 'Gratitude for Mission Supporters' },
    keywords: { 
      pl: ['patron', 'mecenas', 'wspierający', 'bartek', 'mariusz', 'wanda', 'podziękowanie', 'darowizna', 'ofiarność'], 
      en: ['patron', 'mecenas', 'supporter', 'bartek', 'mariusz', 'wanda', 'gratitude', 'donation', 'generosity'] 
    },
    icon: 'Heart',
    primaryAction: { label: { pl: 'Zobacz Patrona', en: 'View Patrons' }, action: 'open:patrons_page' }
  },
  {
    id: 'wikifaith',
    category: 'STUDY',
    title: { pl: 'WIKIFAITH', en: 'WIKIFAITH' },
    subtitle: { pl: 'Bezpłatna Encyklopedia Wiary', en: 'Free Encyclopedia of Faith' },
    keywords: { 
      pl: ['wiki', 'faith', 'wikifaith', 'encyklopedia', 'wiary', 'wiedza', 'wyszukiwarka', 'szukaj'], 
      en: ['wiki', 'faith', 'wikifaith', 'encyclopedia', 'knowledge', 'search'] 
    },
    icon: 'Globe',
    primaryAction: { label: { pl: 'Otwórz WikiFaith', en: 'Open WikiFaith' }, action: 'open:wikifaith' }
  },
  {
    id: 'morning-wakeups',
    category: 'STUDY',
    title: { pl: 'POBUDKI', en: 'MORNING WAKEUPS' },
    subtitle: { pl: 'Codzienne duchowe inspiracje', en: 'Daily spiritual inspirations' },
    keywords: { 
      pl: ['pobudki', 'poranne', 'inspiracje', 'motywacja', 'duchowość', 'poranek', 'dzień dobry'], 
      en: ['morning', 'wakeups', 'inspirations', 'motivation', 'spirituality', 'good morning'] 
    },
    icon: 'Heart',
    primaryAction: { label: { pl: 'Otwórz Pobudki', en: 'Open Wakeups' }, action: 'open:morning_inspirations' }
  },
  {
    id: 'christian-inspirations',
    category: 'STUDY',
    title: { pl: 'INSPIRACJE', en: 'INSPIRATIONS' },
    subtitle: { pl: 'Moduł subskrypcji SMS', en: 'SMS subscription module' },
    keywords: { 
      pl: ['chrześcijańskie', 'inspiracje', 'sms', 'subskrypcja', 'powiadomienia', 'wiadomości'], 
      en: ['christian', 'inspirations', 'sms', 'subscription', 'notifications', 'messages'] 
    },
    icon: 'MessageSquare',
    primaryAction: { label: { pl: 'Otwórz Moduł', en: 'Open Module' }, action: 'open:christian_inspirations' }
  },
  {
    id: 'google-identity-link',
    category: 'SYSTEM',
    title: { pl: 'CHRISTIAN IDENTITY / LOGOWANIE GOOGLE', en: 'CHRISTIAN IDENTITY / GOOGLE LOGIN' },
    subtitle: { pl: 'Synchronizuj swoje dane i postępy w misji', en: 'Sync your data and progress in the mission' },
    keywords: { 
      pl: ['google', 'login', 'zaloguj', 'identity', 'christian identity', 'połącz', 'synchronizacja', 'konto', 'profil'], 
      en: ['google', 'login', 'identity', 'christian identity', 'connect', 'sync', 'account', 'profile'] 
    },
    icon: 'ShieldCheck',
    primaryAction: { label: { pl: 'Zaloguj Google', en: 'Google Login' }, action: 'open:google_login' }
  },
  {
    id: 'admin-panel',
    category: 'SYSTEM',
    title: { pl: 'CENTRUM DOWODZENIA', en: 'COMMAND CENTER' },
    subtitle: { pl: 'Zarządzanie aplikacją (Administrator)', en: 'App management (Admin)' },
    keywords: { 
      pl: ['centrum', 'dowodzenia', 'administrator', 'panel', 'zarządzanie', 'ustawienia', 'zaloguj', 'admin'], 
      en: ['command', 'center', 'administrator', 'panel', 'management', 'settings', 'login', 'admin'] 
    },
    icon: 'Shield',
    primaryAction: { label: { pl: 'Zaloguj jako Admin', en: 'Log in as Admin' }, action: 'open:admin_panel' }
  }
];
