import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { SupportedLanguage } from "../types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppStore } from "../useAppStore";
import { SEOSchema } from "./SEOSchema";

const extractYouTubeVideoId = (text: string) => {
  if (!text) return null;
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = text.match(regExp);
  return match ? match[1] : null;
};

interface ChristianInspirationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: "info" | "success" | "alert") => void;
  openSmsSubscription: () => void;
  initialPostId?: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorUid: string;
  authorName: string;
  timestamp: any;
  sharesCount: number;
}

export const ChristianInspirationsModal: React.FC<
  ChristianInspirationsModalProps
> = ({
  isOpen,
  onClose,
  appLanguage,
  addToast,
  openSmsSubscription,
  initialPostId,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharingPostId, setSharingPostId] = useState<string | null>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const userPersona = useAppStore((state) => state.userPersona);
  const isAdmin =
    auth.currentUser?.email === "nazirczarkes@gmail.com" ||
    auth.currentUser?.uid === "u5SeqT54FcNocFcXjiRcKowjHqC2" ||
    auth.currentUser?.uid === "J4AQs5wSpaWsSjtj04JLqCHPIeg1" ||
    userPersona?.role === "admin";

  useEffect(() => {
    if (!isOpen) return;

    const q = query(
      collection(db, "christianInspirations"),
      orderBy("timestamp", "desc"),
      limit(20),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(fetchedPosts);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        handleFirestoreError(
          error,
          OperationType.LIST,
          "christianInspirations",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (!loading && initialPostId && isOpen) {
      let attempts = 0;
      const tryScroll = setInterval(() => {
        const element = document.getElementById(`post-${initialPostId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(tryScroll);
        }
        attempts++;
        if (attempts > 10) clearInterval(tryScroll);
      }, 100);
      return () => clearInterval(tryScroll);
    }
  }, [loading, initialPostId, isOpen]);

  const handleDeletePost = async (postId: string) => {
    if (
      !window.confirm(
        appLanguage === "pl"
          ? "Na pewno usunąć?"
          : "Are you sure you want to delete this?",
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "christianInspirations", postId));
      addToast(appLanguage === "pl" ? "Usunięto." : "Deleted.", "success");
    } catch (error) {
      console.error(error);
      handleFirestoreError(
        error,
        OperationType.DELETE,
        `christianInspirations/${postId}`,
      );
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
    setEditImageUrl(post.imageUrl || "");
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      await updateDoc(doc(db, "christianInspirations", postId), {
        title: editTitle,
        content: editContent,
        imageUrl: editImageUrl,
      });
      setEditingPostId(null);
      addToast(
        appLanguage === "pl" ? "Zaktualizowano." : "Updated.",
        "success",
      );
    } catch (error) {
      console.error(error);
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `christianInspirations/${postId}`,
      );
    }
  };

  const handleShare = async (post: Post) => {
    const postUrl = `https://cclite.pl/inspiration/${post.id}`;
    const shareData = {
      title: post.title,
      text: post.content.substring(0, 50) + "...",
      url: postUrl,
    };

    try {
      setSharingPostId(post.id);
      if (navigator.share) {
        await navigator.share(shareData);
        await updateDoc(doc(db, "christianInspirations", post.id), {
          sharesCount: increment(1),
        });
        addToast(
          appLanguage === "pl"
            ? "Udostępniono pomyślnie!"
            : "Shared successfully!",
          "success",
        );
      } else {
        await navigator.clipboard.writeText(`${post.title}\n${postUrl}`);
        addToast(
          appLanguage === "pl"
            ? "Skopiowano link do schowka!"
            : "Link copied to clipboard!",
          "info",
        );
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Błąd udostępniania:", err);
      }
    } finally {
      setSharingPostId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[4000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <SEOSchema
        type="Article"
        data={{
          "@graph": posts.map((post) => ({
            "@type": "Article",
            headline: post.title,
            author: { "@type": "Person", name: post.authorName },
            datePublished: post.timestamp?.toDate
              ? post.timestamp.toDate().toISOString()
              : new Date().toISOString(),
            image: post.imageUrl ? [post.imageUrl] : [],
            articleBody: post.content,
          })),
        }}
      />
      <div
        className="bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[90vh] rounded-[2rem] border border-[#C5A059]/40 shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-60"></div>

        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-zinc-900 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="text-[#C5A059] text-2xl">🕊️</span>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
              {appLanguage === "pl"
                ? "Chrześcijańskie Inspiracje"
                : "Christian Inspirations"}
            </h2>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-[#C5A059] hover:text-white rounded-full transition-colors border border-[#C5A059]/20"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scrollbar-thin">
          {loading ? (
            <div className="text-center py-20 animate-pulse">
              <span className="text-4xl text-[#C5A059]">🕊️</span>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4">
                Wczytywanie...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <span className="text-4xl">📭</span>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4">
                Brak inspiracji.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className="bg-zinc-900/40 rounded-[2rem] border border-[#C5A059]/20 overflow-hidden flex flex-col relative group"
              >
                {isAdmin && editingPostId !== post.id && (
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black/50 backdrop-blur-md p-2 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      aria-label="Ulubione"
                      onClick={() => handleEditClick(post)}
                      className="text-zinc-300 hover:text-white p-2 bg-zinc-800/80 rounded-full transition-colors shadow-lg"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      aria-label="Ulubione"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-zinc-300 hover:text-red-500 p-2 bg-zinc-800/80 rounded-full transition-colors shadow-lg"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {post.imageUrl && editingPostId !== post.id && (
                  <div className="w-full aspect-square bg-zinc-800 relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
                  </div>
                )}
                {!post.imageUrl &&
                  editingPostId !== post.id &&
                  extractYouTubeVideoId(post.content) && (
                    <div className="w-full aspect-video bg-black relative border-b border-[#C5A059]/20">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeVideoId(post.content)}`}
                        title="YouTube video player"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                <div className="p-6 relative">
                  {editingPostId === post.id ? (
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-black border border-[#C5A059]/30 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none"
                        placeholder="Tytuł"
                      />
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="bg-black border border-[#C5A059]/30 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none"
                        placeholder="URL obrazka (opcjonalnie)"
                      />
                      <textarea
                        className="bg-black border border-[#C5A059]/30 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none min-h-[150px]"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Treść"
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs uppercase font-bold hover:bg-zinc-700"
                        >
                          Anuluj
                        </button>
                        <button
                          onClick={() => handleSaveEdit(post.id)}
                          className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-xs uppercase font-bold hover:brightness-110"
                        >
                          Zapisz
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-white leading-tight italic">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest">
                          {post.authorName}
                        </span>
                        <span className="text-zinc-600 text-[10px]">
                          &bull;
                        </span>
                        <span className="text-zinc-500 text-[10px] font-medium">
                          {post.timestamp?.toDate
                            ? post.timestamp.toDate().toLocaleString()
                            : "Now"}
                        </span>
                      </div>

                      <div className="text-zinc-300 text-sm mt-5 leading-relaxed markdown-body">
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-lg font-bold text-[#C5A059] mt-6 mb-2"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-base font-bold text-white mt-4 mb-2"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong
                                className="font-bold text-white"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc list-inside my-4 space-y-1 text-zinc-300"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-2 border-[#C5A059] pl-4 py-2 my-4 italic text-zinc-400 bg-white/5 rounded-r-lg"
                                {...props}
                              />
                            ),
                            hr: ({ node, ...props }) => (
                              <hr
                                className="border-[#C5A059]/30 my-6"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p
                                className="mb-4 whitespace-pre-wrap"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {post.content}
                        </Markdown>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-black/40 p-4 border-t border-[#C5A059]/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      aria-label="Ulubione"
                      onClick={() => handleShare(post)}
                      disabled={sharingPostId === post.id}
                      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-xl"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {appLanguage === "pl" ? "Udostępnij" : "Share"}
                      </span>
                      {post.sharesCount > 0 && (
                        <span className="text-[#C5A059] text-xs font-bold ml-1">
                          ({post.sharesCount})
                        </span>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={openSmsSubscription}
                    className="flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors border border-[#C5A059]/30 hover:bg-[#C5A059]/20 px-4 py-2 rounded-xl"
                  >
                    <span className="text-sm">📱</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {appLanguage === "pl"
                        ? "Subskrybuj SMS"
                        : "SMS Subscribe"}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
