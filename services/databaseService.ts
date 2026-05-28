import { PersistenceService } from './persistenceService';
import { DynamicDBData } from '../types';

const DB_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQXj76rwQYDvHaa7tPVNK81lK5nF0kcG0oicXtDs3i2Vhl2qKAQnpcRqXc9OrvC2nz8plzkM7yh-J2P/pub?output=csv";

export const DatabaseService = {
  fetchData: async (): Promise<DynamicDBData> => {
    try {
      console.log("[DatabaseService] Syncing with Google Sheets...");
      const response = await fetch(DB_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const csv = await response.text();
      const parsed = DatabaseService.parseCSV(csv);
      
      // Prevent CSV from overwriting local hardcoded weeklySchedule
      delete parsed['weeklySchedule'];

      // Add custom agent update text
      const previousNews = parsed['Nowości CC'] || "Odkryj najnowszą wersję Christian Culture!";
      parsed['Nowości CC'] = `[DEV] Wersja 1.4: Zmieniono nazwę aplikacji na CC Light w plikach konfiguracyjnych i strings.xml w celu odróżnienia jej od głównej aplikacji Christian Culture. Zastąpiono starą ikonę aplikacji nowym, neonowym logotypem CC oraz naprawiono błąd wyświetlania ikony (nie jest już cała czarna na telefonie).\n\n` + previousNews;

      const currentDB = PersistenceService.loadDynamicDB();
      const merged = { ...currentDB, ...parsed };
      
      // Save to local cache
      if (Object.keys(merged).length > 0) {
        PersistenceService.saveDynamicDB(merged);
      }
      return merged;
    } catch (error) {
      console.warn("[DatabaseService] Sync failed, using cache:", error);
      return PersistenceService.loadDynamicDB();
    }
  },

  parseCSV: (csv: string): DynamicDBData => {
    const lines = csv.split(/\r?\n/);
    const result: DynamicDBData = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line === ",,") continue;
      
      const parts = DatabaseService.splitCSVLine(line);
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        
        // Skip header-like rows or empty keys
        if (key && key !== 'Temat' && !key.includes('Baza Danych')) {
          // Flatten multi-line values if they have quotes
          result[key] = value.replace(/^"|"$/g, '').replace(/""/g, '"');
        }
      }
    }
    
    return result;
  },

  splitCSVLine: (line: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(cur);
            cur = "";
        } else {
            cur += char;
        }
    }
    result.push(cur);
    return result;
  }
};
