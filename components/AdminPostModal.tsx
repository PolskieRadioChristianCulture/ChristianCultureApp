import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Image as ImageIcon, Send } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { handleFirestoreError, OperationType } from "../firebase";

interface AdminPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: string;
  addToast: (msg: string, type: "success" | "error") => void;
  collectionName: string;
}

export const AdminPostModal: React.FC<AdminPostModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  addToast,
  collectionName,
}) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const postData = {
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
        createdAt: serverTimestamp(),
        authorEmail: auth.currentUser?.email || "admin@cclite.pl",
        authorUid: auth.currentUser?.uid || "admin",
        likesCount: 0,
        likedBy: [],
        sharesCount: 0,
        commentsCount: 0,
      };
      await addDoc(collection(db, collectionName), postData);
      setContent("");
      setImageUrl("");
      onClose();
      addToast(
        appLanguage === "pl" ? "Post został opublikowany!" : "Post published!",
        "success",
      );
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.CREATE, collectionName);
      addToast(
        appLanguage === "pl" ? "Błąd publikacji" : "Error publishing",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[6000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-900 border border-[#C5A059] rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
        >
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-[#C5A059] font-black uppercase text-center mb-6 tracking-widest text-lg">
            {appLanguage === "pl" ? "Dodaj Nowy Post" : "Add New Post"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1 block">
                {appLanguage === "pl" ? "Treśćposta" : "Post Content"}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  appLanguage === "pl"
                    ? "Wpisz treść chrześcijańskiej inspiracji lub pobudki..."
                    : "Write the inspiration..."
                }
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none min-h-[120px] resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1 block">
                {appLanguage === "pl"
                  ? "URL Grafiki (Proporcje 1:1 wymuszone)"
                  : "Image URL (1:1 aspect ratio forced)"}
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-[#C5A059] outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="w-full mt-4 py-4 bg-gradient-to-r from-[#C5A059] to-[#8B7344] text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-4 h-4" />
              {isSubmitting
                ? appLanguage === "pl"
                  ? "PUBLIKOWANIE..."
                  : "PUBLISHING..."
                : appLanguage === "pl"
                  ? "OPUBLIKUJ TREŚĆ"
                  : "PUBLISH CONTENT"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
