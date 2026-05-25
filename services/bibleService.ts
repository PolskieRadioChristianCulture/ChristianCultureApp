import { BibleVerse } from "../types";
import { PersistenceService } from "./persistenceService";

const POLISH_TO_ENG: Record<string, string> = {
    "1 mojżeszowa": "Genesis", "rdz": "Genesis", "księga rodzaju": "Genesis", "rodzaju": "Genesis",
    "2 mojżeszowa": "Exodus", "wj": "Exodus", "księga wyjścia": "Exodus", "wyjścia": "Exodus",
    "3 mojżeszowa": "Leviticus", "kpł": "Leviticus", "księga kapłańska": "Leviticus", "kapłańska": "Leviticus",
    "4 mojżeszowa": "Numbers", "lb": "Numbers", "księga liczb": "Numbers", "liczb": "Numbers",
    "5 mojżeszowa": "Deuteronomy", "pwt": "Deuteronomy", "księga powtórzonego prawa": "Deuteronomy", "powtórzonego prawa": "Deuteronomy",
    "jozuego": "Joshua", "joz": "Joshua", "księga jozuego": "Joshua",
    "sędziów": "Judges", "sdz": "Judges", "księga sędziów": "Judges",
    "rut": "Ruth", "rt": "Ruth", "księga rut": "Ruth",
    "1 samuela": "1 Samuel", "1 sm": "1 Samuel", "1 księga samuela": "1 Samuel",
    "2 samuela": "2 Samuel", "2 sm": "2 Samuel", "2 księga samuela": "2 Samuel",
    "1 królewska": "1 Kings", "1 krl": "1 Kings", "1 księga królewska": "1 Kings",
    "2 królewska": "2 Kings", "2 krl": "2 Kings", "2 księga królewska": "2 Kings",
    "1 kronik": "1 Chronicles", "1 krn": "1 Chronicles", "1 księga kronik": "1 Chronicles",
    "2 kronik": "2 Chronicles", "2 krn": "2 Chronicles", "2 księga kronik": "2 Chronicles",
    "ezdrasza": "Ezra", "ezd": "Ezra", "księga ezdrasza": "Ezra",
    "nehemiasza": "Nehemiah", "ne": "Nehemiah", "księga nehemiasza": "Nehemiah",
    "estery": "Esther", "est": "Esther", "księga estery": "Esther",
    "hioba": "Job", "hi": "Job", "księga hioba": "Job",
    "psalm": "Psalms", "psalmy": "Psalms", "ps": "Psalms", "księga psalmów": "Psalms",
    "przysłów": "Proverbs", "prz": "Proverbs", "księga przysłów": "Proverbs", "przypowieści salomona": "Proverbs", "przypowieści": "Proverbs",
    "kaznodziei salomona": "Ecclesiastes", "koh": "Ecclesiastes", "koheleta": "Ecclesiastes", "księga koheleta": "Ecclesiastes", "kaznodziei": "Ecclesiastes",
    "pieśń nad pieśniami": "Song of Solomon", "pnp": "Song of Solomon",
    "izajasza": "Isaiah", "iz": "Isaiah", "księga izajasza": "Isaiah",
    "jeremiasza": "Jeremiah", "jr": "Jeremiah", "księga jeremiasza": "Jeremiah",
    "treny": "Lamentations", "tr": "Lamentations", "lamentacje": "Lamentations",
    "ezechiela": "Ezekiel", "ez": "Ezekiel", "księga ezechiela": "Ezekiel",
    "daniela": "Daniel", "dn": "Daniel", "księga daniela": "Daniel",
    "ozeasza": "Hosea", "oz": "Hosea", "księga ozeasza": "Hosea",
    "joela": "Joel", "jl": "Joel", "księga joela": "Joel",
    "amosa": "Amos", "am": "Amos", "księga amosa": "Amos",
    "abdiasza": "Obadiah", "ab": "Obadiah", "księga abdiasza": "Obadiah",
    "jonasza": "Jonah", "jon": "Jonah", "księga jonasza": "Jonah",
    "micheasza": "Micah", "mi": "Micah", "księga micheasza": "Micah",
    "nahuma": "Nahum", "na": "Nahum", "księga nahuma": "Nahum",
    "habakuka": "Habakkuk", "ha": "Habakkuk", "księga habakuka": "Habakkuk",
    "sofoniasza": "Zephaniah", "so": "Zephaniah", "księga sofoniasza": "Zephaniah",
    "aggeusza": "Haggai", "ag": "Haggai", "księga aggeusza": "Haggai",
    "zachariasza": "Zechariah", "za": "Zechariah", "księga zachariasza": "Zechariah",
    "malachiasza": "Malachi", "ml": "Malachi", "księga malachiasza": "Malachi",
    "ewangelia mateusza": "Matthew", "mateusza": "Matthew", "mt": "Matthew",
    "ewangelia marka": "Mark", "marka": "Mark", "mk": "Mark",
    "ewangelia łukasza": "Luke", "łukasza": "Luke", "łk": "Luke",
    "ewangelia jana": "John", "jana": "John", "j": "John",
    "dzieje apostolskie": "Acts", "dz": "Acts", "dzieje": "Acts",
    "rzymian": "Romans", "rz": "Romans", "list do rzymian": "Romans",
    "1 koryntian": "1 Corinthians", "1 kor": "1 Corinthians", "1 list do koryntian": "1 Corinthians",
    "2 koryntian": "2 Corinthians", "2 kor": "2 Corinthians", "2 list do koryntian": "2 Corinthians",
    "galatów": "Galatians", "galacjan": "Galatians", "ga": "Galatians", "list do galatów": "Galatians",
    "efezjan": "Ephesians", "ef": "Ephesians", "list do efezjan": "Ephesians",
    "filipian": "Philippians", "flp": "Philippians", "list do filipian": "Philippians",
    "kolosan": "Colossians", "kol": "Colossians", "list do kolosan": "Colossians",
    "1 tesaloniczan": "1 Thessalonians", "1 tes": "1 Thessalonians", "1 list do tesaloniczan": "1 Thessalonians",
    "2 tesaloniczan": "2 Thessalonians", "2 tes": "2 Thessalonians", "2 list do tesaloniczan": "2 Thessalonians",
    "1 tymoteusza": "1 Timothy", "1 tym": "1 Timothy", "1 list do tymoteusza": "1 Timothy",
    "2 tymoteusza": "2 Timothy", "2 tym": "2 Timothy", "2 list do tymoteusza": "2 Timothy",
    "tytusa": "Titus", "tt": "Titus", "list do tytusa": "Titus",
    "filemona": "Philemon", "flm": "Philemon", "list do filemona": "Philemon",
    "hebrajczyków": "Hebrews", "hbr": "Hebrews", "list do hebrajczyków": "Hebrews",
    "jakuba": "James", "jk": "James", "list jakuba": "James",
    "1 piotra": "1 Peter", "1 pt": "1 Peter", "1 list piotra": "1 Peter",
    "2 piotra": "2 Peter", "2 pt": "2 Peter", "2 list piotra": "2 Peter",
    "1 jana": "1 John", "1 j": "1 John", "1 list jana": "1 John",
    "2 jana": "2 John", "2 j": "2 John", "2 list jana": "2 John",
    "3 jana": "3 John", "3 j": "3 John", "3 list jana": "3 John",
    "judy": "Jude", "jud": "Jude", "list judy": "Jude",
    "objawienie jana": "Revelation", "apokalipsa jana": "Revelation", "objawienie": "Revelation", "apokalipsa": "Revelation", "ap": "Revelation", "obj": "Revelation"
};

const normalizeVerseRef = (r: string) => r.toLowerCase().replace(/\s+/g, ':').replace(/::+/g, ':');

const BIBLE_JSON_URL = "https://drive.google.com/uc?export=download&id=1ZUHXB8mSjJxwTJvU0yW4hfDDLm6-DuOW";
const STORAGE_KEY = "cc_bible_bw_flat_v7_2";

const PROXY_LIST = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?quest="
];

// Rozszerzona rezerwowa baza wersetów na rok 2026
const FALLBACK_VERSES: FlatVerse[] = [
  { r: "Filipian 4:13", t: "Wszystko mogę w Chrystusie, który mnie umacnia." },
  { r: "Jana 3:16", t: "Tak bowiem Bóg umiłował świat, że dał swego jednorodzonego Syna, aby każdy, kto w niego wierzy, nie zginął, ale miał życie wieczne." },
  { r: "Przysłów 3:5", t: "Zaufaj Jahwe z całego swego serca i nie polegaj na własnym rozumie." },
  { r: "Rzymian 8:28", t: "A wiemy, że wszystko współdziała dla dobra tych, którzy miłują Boga." },
  { r: "Jozuego 1:9", t: "Czyż ci nie nakazałem: Bądź mężny i mocny? Nie bój się ani się nie lękaj, gdyż Jahwe, twój Bóg, będzie z tobą wszędzie, gdziekolwiek pójdziesz." },
  { r: "Psalm 23:1", t: "Jahwe jest moim pasterzem, niczego mi nie braknie." },
  { r: "Izajasza 40:31", t: "Lecz ci, którzy ufają Jahwe, nabiorą nowych sił; wzbiją się na skrzydłach jak orły, będą biec, a się nie zmęczą, będą iść, a nie ustaną." },
  { r: "Mateusza 11:28", t: "Przyjdźcie do mnie wszyscy, którzy jesteście spracowani i obciążeni, a ja wam dam odpoczynek." },
  { r: "Hebrajczyków 11:1", t: "A wiara jest podstawą tego, czego się spodziewamy, i dowodem tego, czego nie widzimy." },
  { r: "1 Koryntian 13:13", t: "A teraz trwają wiara, nadzieja, miłość, te trzy; z nich zaś największa jest miłość." },
  { r: "Efezjan 2:8", t: "Łaską bowiem jesteście zbawieni przez wiarę, i to nie jest z was, jest to dar Boży." },
  { r: "Psalm 119:105", t: "Twoje słowo jest pochodnią dla moich nóg i światłością na mojej ścieżce." },
  { r: "2 Tymoteusza 1:7", t: "Gdyż nie dał nam Bóg ducha bojaźni, ale mocy, miłości i zdrowego rozsądku." }
];

interface FlatVerse {
  r: string; // Reference
  t: string; // Text
}

export const BibleService = {
  privateDb: null as FlatVerse[] | null,
  isInitializing: false,

  async fetchWithTimeout(url: string, options = {}, timeout = 8000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  },

  async fetchWithProxy(url: string): Promise<Response> {
    let lastError: any;
    try {
      const direct = await this.fetchWithTimeout(url, { method: 'GET' }, 4000);
      if (direct.ok) return direct;
    } catch (e) {
      lastError = e;
    }

    const proxies = [
      "https://api.codetabs.com/v1/proxy?quest=",
      "https://api.allorigins.win/raw?url=",
      "https://corsproxy.io/?"
    ];

    for (const proxy of proxies) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        const response = await this.fetchWithTimeout(proxyUrl, { method: 'GET' }, 7000);
        if (response.ok) {
          return response;
        }
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError || new Error("ALL_FETCH_METHODS_FAILED");
  },

  parseBibleData(data: any): FlatVerse[] {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => ({
        r: item.r || item.reference || "?",
        t: item.t || item.text || ""
      })).filter(v => v.t);
    }
    if (data && data.books && Array.isArray(data.books)) {
      const verses: FlatVerse[] = [];
      for (const book of data.books) {
        if (!book.name || !Array.isArray(book.chapters)) continue;
        for (const chapter of book.chapters) {
          if (!chapter.chapter || !Array.isArray(chapter.verses)) continue;
          for (const verseObj of chapter.verses) {
            if (verseObj.verse && verseObj.text) {
              verses.push({
                r: `${book.name} ${chapter.chapter}:${verseObj.verse}`,
                t: verseObj.text
              });
            }
          }
        }
      }
      return verses;
    }
    return [];
  },

  async loadDatabase(): Promise<FlatVerse[]> {
    if (this.privateDb && this.privateDb.length > 100) return this.privateDb;

    if (this.isInitializing) {
      console.log("[BibleService] Already initializing, waiting...");
      // Poll until initialized
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      return this.privateDb || FALLBACK_VERSES;
    }
    this.isInitializing = true;

    try {
      console.log("[BibleService] Próba ładowania lokalnego /bible.json...");
      const response = await fetch(window.location.origin + '/bible.json');
      
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          const parsed = this.parseBibleData(data);
          if (parsed.length > 0) {
            this.privateDb = parsed;
            console.log(`[BibleService] Sukces: Załadowano lokalną Biblię (${this.privateDb.length} wersetów).`);
            this.isInitializing = false;
            return this.privateDb;
          } else {
            console.warn("[BibleService] Lokalny /bible.json jest pusty lub ma błędny format.");
          }
        } else {
          console.warn("[BibleService] Serwer zwrócił format inny niż JSON (prawdopodobnie strona 404 HTML).");
        }
      } else {
        console.warn(`[BibleService] Błąd pobierania /bible.json: ${response.status}`);
      }
    } catch (localError) {
      console.error("[BibleService] Błąd krytyczny podczas ładowania lokalnej Biblii:", localError);
    }

    // Try Remote Fallback
    try {
      console.log("[BibleService] Attempting to fetch remote bible from drive fallback...");
      const response = await this.fetchWithProxy(BIBLE_JSON_URL);
      if (response.ok) {
        const data = await response.json();
        const parsed = this.parseBibleData(data);
        if (parsed.length > 500) {
          this.privateDb = parsed;
          console.log(`[BibleService] Success: Remote Bible loaded with ${this.privateDb.length} verses.`);
          this.isInitializing = false;
          return this.privateDb;
        }
      }
    } catch (remoteError) {
      console.error("[BibleService] Remote Bible fetch critically failed:", remoteError);
    }

    console.warn("[BibleService] ALL LOADING METHODS FAILED. Using skeleton fallback database.");
    this.privateDb = FALLBACK_VERSES;
    this.isInitializing = false;
    return FALLBACK_VERSES;
  },

  sanitizeGodName(text: string): string {
    if (!text) return "";
    // Replace "PAN" (uppercase) with "Jahwe"
    return text.replace(/PANU/g, 'Jahwe')
               .replace(/PANA/g, 'Jahwe')
               .replace(/PAN/g, 'Jahwe');
  },

  mapToBibleVerse(flat: FlatVerse): BibleVerse {
    return {
      reference: flat.r,
      text: this.sanitizeGodName(flat.t),
      reflection: "", 
      commentary: "",
      callToAction: "",
      blessing: "",
      prayer: "",
      application: ""
    };
  },

  async getDailyVerse(): Promise<BibleVerse> {
    const db = await this.loadDatabase();
    const now = new Date();
    const seed = (now.getFullYear() * 10000) + ((now.getMonth() + 1) * 100) + now.getDate();
    const index = seed % db.length;
    return this.mapToBibleVerse(db[index]);
  },

  async getRandomVerse(): Promise<BibleVerse> {
    const db = await this.loadDatabase();
    const index = Math.floor(Math.random() * db.length);
    return this.mapToBibleVerse(db[index]);
  },

  async getChapter(reference: string): Promise<string> {
    const db = await this.loadDatabase();
    
    // Zastąp przecinki na dwukropki, np. "Psalm 23, 1" -> "Psalm 23: 1"
    let normalizedRef = reference.replace(/,/g, ':').replace(/\s*:\s*/g, ':');
    const parts = normalizedRef.split(':');
    
    let chapterPrefixRaw = parts[0].trim();
    
    // Robust parsing: "Jana3" or "Jana 3"
    let bookName = "";
    let chapterNum = "1";
    
    const match = chapterPrefixRaw.match(/^([a-zA-Ząćęłńóśźż\s]+)(\d+)$/i);
    if (match) {
        bookName = match[1].trim();
        chapterNum = match[2];
    } else {
        const lastSpaceIdx = chapterPrefixRaw.lastIndexOf(' ');
        if (lastSpaceIdx !== -1) {
            bookName = chapterPrefixRaw.substring(0, lastSpaceIdx).trim();
            chapterNum = chapterPrefixRaw.substring(lastSpaceIdx + 1).trim();
        } else {
            return "Zły format odniesienia.";
        }
    }

    const polishToEng: Record<string, string> = {
        "1 mojżeszowa": "Genesis", "rdz": "Genesis", "księga rodzaju": "Genesis", "rodzaju": "Genesis",
        "2 mojżeszowa": "Exodus", "wj": "Exodus", "księga wyjścia": "Exodus", "wyjścia": "Exodus",
        "3 mojżeszowa": "Leviticus", "kpł": "Leviticus", "księga kapłańska": "Leviticus", "kapłańska": "Leviticus",
        "4 mojżeszowa": "Numbers", "lb": "Numbers", "księga liczb": "Numbers", "liczb": "Numbers",
        "5 mojżeszowa": "Deuteronomy", "pwt": "Deuteronomy", "księga powtórzonego prawa": "Deuteronomy", "powtórzonego prawa": "Deuteronomy",
        "jozuego": "Joshua", "joz": "Joshua", "księga jozuego": "Joshua",
        "sędziów": "Judges", "sdz": "Judges", "księga sędziów": "Judges",
        "rut": "Ruth", "rt": "Ruth", "księga rut": "Ruth",
        "1 samuela": "1 Samuel", "1 sm": "1 Samuel", "1 księga samuela": "1 Samuel",
        "2 samuela": "2 Samuel", "2 sm": "2 Samuel", "2 księga samuela": "2 Samuel",
        "1 królewska": "1 Kings", "1 krl": "1 Kings", "1 księga królewska": "1 Kings",
        "2 królewska": "2 Kings", "2 krl": "2 Kings", "2 księga królewska": "2 Kings",
        "1 kronik": "1 Chronicles", "1 krn": "1 Chronicles", "1 księga kronik": "1 Chronicles",
        "2 kronik": "2 Chronicles", "2 krn": "2 Chronicles", "2 księga kronik": "2 Chronicles",
        "ezdrasza": "Ezra", "ezd": "Ezra", "księga ezdrasza": "Ezra",
        "nehemiasza": "Nehemiah", "ne": "Nehemiah", "księga nehemiasza": "Nehemiah",
        "estery": "Esther", "est": "Esther", "księga estery": "Esther",
        "hioba": "Job", "hi": "Job", "księga hioba": "Job",
        "psalm": "Psalms", "psalmy": "Psalms", "ps": "Psalms", "księga psalmów": "Psalms",
        "przysłów": "Proverbs", "prz": "Proverbs", "księga przysłów": "Proverbs", "przypowieści salomona": "Proverbs", "przypowieści": "Proverbs",
        "kaznodziei salomona": "Ecclesiastes", "koh": "Ecclesiastes", "koheleta": "Ecclesiastes", "księga koheleta": "Ecclesiastes", "kaznodziei": "Ecclesiastes",
        "pieśń nad pieśniami": "Song of Solomon", "pnp": "Song of Solomon",
        "izajasza": "Isaiah", "iz": "Isaiah", "księga izajasza": "Isaiah",
        "jeremiasza": "Jeremiah", "jr": "Jeremiah", "księga jeremiasza": "Jeremiah",
        "treny": "Lamentations", "tr": "Lamentations", "lamentacje": "Lamentations",
        "ezechiela": "Ezekiel", "ez": "Ezekiel", "księga ezechiela": "Ezekiel",
        "daniela": "Daniel", "dn": "Daniel", "księga daniela": "Daniel",
        "ozeasza": "Hosea", "oz": "Hosea", "księga ozeasza": "Hosea",
        "joela": "Joel", "jl": "Joel", "księga joela": "Joel",
        "amosa": "Amos", "am": "Amos", "księga amosa": "Amos",
        "abdiasza": "Obadiah", "ab": "Obadiah", "księga abdiasza": "Obadiah",
        "jonasza": "Jonah", "jon": "Jonah", "księga jonasza": "Jonah",
        "micheasza": "Micah", "mi": "Micah", "księga micheasza": "Micah",
        "nahuma": "Nahum", "na": "Nahum", "księga nahuma": "Nahum",
        "habakuka": "Habakkuk", "ha": "Habakkuk", "księga habakuka": "Habakkuk",
        "sofoniasza": "Zephaniah", "so": "Zephaniah", "księga sofoniasza": "Zephaniah",
        "aggeusza": "Haggai", "ag": "Haggai", "księga aggeusza": "Haggai",
        "zachariasza": "Zechariah", "za": "Zechariah", "księga zachariasza": "Zechariah",
        "malachiasza": "Malachi", "ml": "Malachi", "księga malachiasza": "Malachi",
        "ewangelia mateusza": "Matthew", "mateusza": "Matthew", "mt": "Matthew",
        "ewangelia marka": "Mark", "marka": "Mark", "mk": "Mark",
        "ewangelia łukasza": "Luke", "łukasza": "Luke", "łk": "Luke",
        "ewangelia jana": "John", "jana": "John", "j": "John",
        "dzieje apostolskie": "Acts", "dz": "Acts", "dzieje": "Acts",
        "rzymian": "Romans", "rz": "Romans", "list do rzymian": "Romans",
        "1 koryntian": "1 Corinthians", "1 kor": "1 Corinthians", "1 list do koryntian": "1 Corinthians",
        "2 koryntian": "2 Corinthians", "2 kor": "2 Corinthians", "2 list do koryntian": "2 Corinthians",
        "galatów": "Galatians", "galacjan": "Galatians", "ga": "Galatians", "list do galatów": "Galatians",
        "efezjan": "Ephesians", "ef": "Ephesians", "list do efezjan": "Ephesians",
        "filipian": "Philippians", "flp": "Philippians", "list do filipian": "Philippians",
        "kolosan": "Colossians", "kol": "Colossians", "list do kolosan": "Colossians",
        "1 tesaloniczan": "1 Thessalonians", "1 tes": "1 Thessalonians", "1 list do tesaloniczan": "1 Thessalonians",
        "2 tesaloniczan": "2 Thessalonians", "2 tes": "2 Thessalonians", "2 list do tesaloniczan": "2 Thessalonians",
        "1 tymoteusza": "1 Timothy", "1 tym": "1 Timothy", "1 list do tymoteusza": "1 Timothy",
        "2 tymoteusza": "2 Timothy", "2 tym": "2 Timothy", "2 list do tymoteusza": "2 Timothy",
        "tytusa": "Titus", "tt": "Titus", "list do tytusa": "Titus",
        "filemona": "Philemon", "flm": "Philemon", "list do filemona": "Philemon",
        "hebrajczyków": "Hebrews", "hbr": "Hebrews", "list do hebrajczyków": "Hebrews",
        "jakuba": "James", "jk": "James", "list jakuba": "James",
        "1 piotra": "1 Peter", "1 pt": "1 Peter", "1 list piotra": "1 Peter",
        "2 piotra": "2 Peter", "2 pt": "2 Peter", "2 list piotra": "2 Peter",
        "1 jana": "1 John", "1 j": "1 John", "1 list jana": "1 John",
        "2 jana": "2 John", "2 j": "2 John", "2 list jana": "2 John",
        "3 jana": "3 John", "3 j": "3 John", "3 list jana": "3 John",
        "judy": "Jude", "jud": "Jude", "list judy": "Jude",
        "objawienie jana": "Revelation", "apokalipsa jana": "Revelation", "objawienie": "Revelation", "apokalipsa": "Revelation", "ap": "Revelation", "obj": "Revelation"
    };

    // Normalized search: Removing all spaces around ":" and replacing space between book and chapter with ":"
    const normalizeVerseRef = (r: string) => r.toLowerCase().replace(/\s+/g, ':').replace(/::+/g, ':');
    
    const engBook = polishToEng[bookName.toLowerCase()] || bookName.trim();
    
    // Find all possible Polish names that map to the same English book
    const possiblePolishNames = Object.keys(polishToEng).filter(k => 
      polishToEng[k].toLowerCase() === engBook.toLowerCase()
    );
    
    // Build an array of search references
    const searchRefs = [
      normalizeVerseRef(`${engBook} ${chapterNum}:`),
      normalizeVerseRef(`${bookName} ${chapterNum}:`),
      ...possiblePolishNames.map(plName => normalizeVerseRef(`${plName} ${chapterNum}:`))
    ];
    
    console.log(`[BibleService] getChapter searching for refs starting with:`, searchRefs);
    
    let verses = db.filter(v => {
        const nr = normalizeVerseRef(v.r);
        return searchRefs.some(ref => nr.startsWith(ref));
    });

    if (verses.length === 0) return "Nie znaleziono pełnego rozdziału.";
    
    // Sort verses numerically
    verses.sort((a, b) => {
        const aV = parseInt(a.r.split(':')[1] || "0");
        const bV = parseInt(b.r.split(':')[1] || "0");
        return aV - bV;
    });

    return verses.map(v => `${v.r.split(':')[1] || ''} ${this.sanitizeGodName(v.t)}`).join('\n\n');
  },

  async searchVerses(query: string, limit: number = 30): Promise<{reference: string, text: string, connection: string}[]> {
    const db = await this.loadDatabase();
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    let results = db.filter(v => 
      v.t.toLowerCase().includes(normalizedQuery) || 
      v.r.toLowerCase().includes(normalizedQuery)
    );
    
    // Sort slightly? Better to just take the first few
    results = results.slice(0, limit);

    return results.map(v => ({
      reference: v.r,
      text: this.sanitizeGodName(v.t),
      connection: `Werset zawiera szukane słowo/frazę: "${query}"`
    }));
  }
};