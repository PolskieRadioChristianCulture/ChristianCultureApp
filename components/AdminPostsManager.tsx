import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import { SupportedLanguage, ToastMessage } from "../types";

interface Post {
  id: string;
  title: string;
  collection: "morning_inspirations" | "christianInspirations";
}

interface AdminPostsManagerProps {
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
}

export const AdminPostsManager: React.FC<AdminPostsManagerProps> = ({
  appLanguage,
  addToast,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [miTitle, setMiTitle] = useState("");
  const [miContent, setMiContent] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const qMorning = query(
      collection(db, "morning_inspirations"),
      orderBy("timestamp", "desc"),
    );
    const qChristian = query(
      collection(db, "christianInspirations"),
      orderBy("timestamp", "desc"),
    );

    const unsubMorning = onSnapshot(qMorning, (snapshot) => {
      const morningPosts = snapshot.docs.map(
        (d) =>
          ({
            id: d.id,
            title: d.data().title,
            collection: "morning_inspirations",
          }) as Post,
      );
      setPosts((prev) => [
        ...prev.filter((p) => p.collection !== "morning_inspirations"),
        ...morningPosts,
      ]);
    });

    const unsubChristian = onSnapshot(qChristian, (snapshot) => {
      const christianPosts = snapshot.docs.map(
        (d) =>
          ({
            id: d.id,
            title: d.data().title,
            collection: "christianInspirations",
          }) as Post,
      );
      setPosts((prev) => [
        ...prev.filter((p) => p.collection !== "christianInspirations"),
        ...christianPosts,
      ]);
    });

    return () => {
      unsubMorning();
      unsubChristian();
    };
  }, []);

  const deletePost = async (postId: string, col: string) => {
    try {
      await deleteDoc(doc(db, col, postId));
      addToast("Usunięto pomyślnie.", "success");
      setConfirmDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${col}/${postId}`);
      addToast("Błąd usuwania.", "alert");
    }
  };

  const republishPost = async (postId: string, col: string) => {
    try {
      await updateDoc(doc(db, col, postId), {
        timestamp: serverTimestamp(),
      });
      addToast("Ponownie opublikowano post.", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${col}/${postId}`);
      addToast("Błąd podczas ponownej publikacji.", "alert");
    }
  };

  const handlePublishMorningInspiration = async () => {
    try {
      await addDoc(collection(db, "morning_inspirations"), {
        title: miTitle,
        content: miContent,
        timestamp: serverTimestamp(),
        authorUid: auth.currentUser?.uid,
        authorName: auth.currentUser?.displayName || "Admin",
      });
      setMiTitle("");
      setMiContent("");
      addToast("Opublikowano pobudkę.", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "morning_inspirations");
      addToast("Błąd publikacji.", "alert");
    }
  };

  return (
    <div className="space-y-8 relative z-50">
      <div className="space-y-4">
        <h5 className="text-[#C5A059] font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-[#C5A059] rounded-full"></span>
          Zarządzanie opublikowanymi postami:
        </h5>
        {posts.length === 0 ? (
          <p className="text-zinc-500 text-xs italic">Brak postów.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-black/60 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-white"
            >
              <span className="font-medium text-sm">
                {post.title} <span className="text-zinc-500 text-xs ml-2">({post.collection === "morning_inspirations" ? "Pobudka" : "Inspiracja"})</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => republishPost(post.id, post.collection)}
                  aria-label={`Ponów publikację posta ${post.title}`}
                  className="text-[#C5A059] hover:text-white font-bold px-4 py-2 cursor-pointer bg-[#C5A059]/10 hover:bg-[#C5A059]/30 rounded-lg transition-colors text-xs"
                >
                  Ponów
                </button>
                {confirmDeleteId === post.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => deletePost(post.id, post.collection)}
                      className="text-white hover:text-white font-bold px-3 py-2 cursor-pointer bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-xs"
                    >
                      Potwierdź
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-zinc-400 hover:text-white font-bold px-3 py-2 cursor-pointer bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-xs"
                    >
                      Anuluj
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(post.id)}
                    aria-label={`Usuń post ${post.title}`}
                    className="text-red-500 hover:text-red-300 font-bold px-4 py-2 cursor-pointer bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-xs"
                  >
                    Usuń
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
