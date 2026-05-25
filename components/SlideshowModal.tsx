import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Plus,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PersistenceService } from "../services/persistenceService";
import { SupportedLanguage } from "../types";

interface SlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  onScreensaverToggle?: (isActive: boolean) => void;
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  onScreensaverToggle,
}) => {
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = async () => {
    if (!isOpen) return;

    const files = PersistenceService.loadMyFiles();
    const imageMetadata = files.filter(
      (f: any) =>
        f.type?.startsWith("image/") ||
        [".webp", ".webp", ".webp", ".gif", ".webp"].some((ext) =>
          f.name?.toLowerCase().endsWith(ext),
        ),
    );

    if (imageMetadata.length === 0) {
      setImages([]);
      return;
    }

    try {
      const opfsRoot = await navigator.storage.getDirectory();
      const materialsDir = await opfsRoot.getDirectoryHandle("cc_materials", {
        create: true,
      });

      const loadedImages = await Promise.all(
        imageMetadata.map(async (meta: any) => {
          try {
            const fileHandle = await materialsDir.getFileHandle(meta.name);
            const file = await fileHandle.getFile();
            const url = URL.createObjectURL(file);
            return { ...meta, url };
          } catch (err) {
            console.warn(`Could not load image ${meta.name} from OPFS`, err);
            return null;
          }
        }),
      );

      setImages(loadedImages.filter((img) => img !== null));
    } catch (err) {
      console.error("Failed to access OPFS for slideshow", err);
      setImages([]);
    }
  };

  useEffect(() => {
    let currentUrls: string[] = [];

    const init = async () => {
      await loadImages();
      setCurrentIndex(0);
    };

    if (isOpen) {
      init();
    }

    return () => {
      images.forEach((img) => {
        if (img.url) URL.revokeObjectURL(img.url);
      });
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isPlaying && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 10000); // 10 seconds per image
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, images.length]);

  useEffect(() => {
    if (!isOpen) {
      onScreensaverToggle?.(false);
    }
  }, [isOpen, onScreensaverToggle]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const opfsRoot = await navigator.storage.getDirectory();
      const materialsDir = await opfsRoot.getDirectoryHandle("cc_materials", {
        create: true,
      });

      const currentMaterials = PersistenceService.loadMyFiles();
      let newMaterials = [...currentMaterials];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;

        const fileHandle = await materialsDir.getFileHandle(file.name, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();

        // Check if already exists in metadata
        if (!newMaterials.find((m) => m.name === file.name)) {
          newMaterials.push({
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            size: file.size,
            addedAt: Date.now(),
          });
        }
      }

      PersistenceService.saveMyFiles(newMaterials);
      await loadImages();
      setCurrentIndex(0);
      setIsPlaying(true);
    } catch (err) {
      console.error("Error uploading from slideshow", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[9000] bg-black animate-fade-in flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {images.length === 0 ? (
          <div className="flex flex-col items-center gap-6">
            <div className="text-zinc-500 text-sm font-black uppercase tracking-widest text-center px-10">
              {appLanguage === "pl"
                ? 'Wgraj zdjęcia do "Moje Pliki", aby uruchomić pokaz slajdów.'
                : 'Upload photos to "My Files" to start the slideshow.'}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-8 py-4 bg-[#C5A059] text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {appLanguage === "pl"
                ? "Dodaj pierwsze zdjęcie"
                : "Add first photo"}
            </button>
          </div>
        ) : (
          <motion.div
            key={images[currentIndex].id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].name}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            />
            {/* Info overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
              {images[currentIndex].name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-[#C5A059] text-xs font-black uppercase tracking-[0.3em]">
            {appLanguage === "pl" ? "POKAZ SLAJDÓW CC" : "CC SLIDESHOW"}
          </h2>
        </div>
        <button
          aria-label="Zamknij"
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute inset-y-0 left-0 w-32 flex items-center justify-start p-6 bg-gradient-to-r from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <button
          aria-label="Wstecz"
          onClick={prev}
          className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 w-32 flex items-center justify-end p-6 bg-gradient-to-l from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <button
          aria-label="Dalej"
          onClick={next}
          className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute bottom-10 right-10 z-10 flex items-center gap-4">
        <button
          aria-label="Odtwarzaj"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-5 bg-black/40 hover:bg-black/60 text-[#C5A059] rounded-full transition-all border border-[#C5A059]/20 backdrop-blur-xl shadow-2xl group"
          title={
            isPlaying
              ? appLanguage === "pl"
                ? "Pauza"
                : "Pause"
              : appLanguage === "pl"
                ? "Start"
                : "Play"
          }
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>
        <button
          aria-label="Zamknij"
          onClick={onClose}
          className="p-5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-xl shadow-2xl"
          title={appLanguage === "pl" ? "Zamknij" : "Close"}
        >
          <X className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};
