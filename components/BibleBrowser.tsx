import React, { useState, useEffect } from "react";
import { BibleService } from "../services/bibleService";
import { Button } from "./ui/button";

export const BibleBrowser: React.FC = () => {
  const [translations, setTranslations] = useState<
    { id: string; name: string }[]
  >([{ id: "BW", name: "Biblia Warszawska" }]);
  const [books, setBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<
    { reference: string; text: string; connection: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // BibleService.loadDatabase is the way to get data
    BibleService.loadDatabase().then((db) => {
      // Extract unique books from references (e.g. "Genesis 1:1" -> "Genesis")
      const books = Array.from(new Set(db.map((v) => v.r.split(" ")[0])));
      setBooks(books.sort());
    });
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    const res = await BibleService.searchVerses(searchQuery);
    setResults(res);
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-zinc-950 text-white rounded-3xl border border-gold/20">
      <h2 className="text-2xl font-black text-gold mb-6 uppercase tracking-widest">
        Nawigator Biblijny
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select className="bg-zinc-900 border border-gold/30 p-3 rounded-xl text-sm italic">
          <option>Biblia Warszawska (BW)</option>
        </select>

        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="bg-zinc-900 border border-gold/30 p-3 rounded-xl text-sm"
        >
          <option value="">Wybierz księgę...</option>
          {books.map((book) => (
            <option key={book} value={book}>
              {book}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Szukaj wersetu (min 3 znaki)..."
          className="flex-1 bg-zinc-900 border border-gold/30 p-3 rounded-xl text-sm"
        />
        <Button
          onClick={handleSearch}
          className="bg-gold text-black font-black"
        >
          Szukaj
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-gold">Szukam...</p>}
        {results.map((res, i) => (
          <div
            key={i}
            className="p-4 bg-zinc-900 rounded-xl border border-white/5"
          >
            <h4 className="text-gold font-black mb-1">{res.reference}</h4>
            <p className="text-sm italic">{res.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
