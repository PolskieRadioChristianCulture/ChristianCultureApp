import { PersistenceService } from "./services/persistenceService";

const db = PersistenceService.loadDynamicDB() || {};
if (!db["Nowości CC"]) {
  db["Nowości CC"] = [];
}
db["Nowości CC"].unshift({
  id: Date.now().toString(),
  text: "Przywrócono załączone przeźroczyste logo do wygaszacza ekranu.",
  link: "#",
  date: new Date().toISOString()
});
PersistenceService.saveDynamicDB(db);
