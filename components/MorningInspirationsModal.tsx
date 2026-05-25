import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  deleteDoc,
  setDoc,
  getDoc,
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

interface MorningInspirationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: "info" | "success" | "alert") => void;
  initialPostId?: string | null;
}

interface Comment {
  id: string;
  text: string;
  authorUid: string;
  authorName: string;
  authorAvatar?: string;
  timestamp: any;
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorUid: string;
  authorName: string;
  timestamp: any;
  commentsCount: number;
  sharesCount: number;
  likesCount?: number;
}

export const MorningInspirationsModal: React.FC<
  MorningInspirationsModalProps
> = ({ isOpen, onClose, appLanguage, addToast, initialPostId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>(
    {},
  );
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
      collection(db, "morning_inspirations"),
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
        handleFirestoreError(error, OperationType.LIST, "morning_inspirations");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (!loading && initialPostId && isOpen) {
      // Try to scroll multiple times in case of slow rendering or image loading
      let attempts = 0;
      const tryScroll = setInterval(() => {
        const element = document.getElementById(`post-${initialPostId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(tryScroll);
        }
        attempts++;
        if (attempts > 10) clearInterval(tryScroll); // Stop after 1 second
      }, 100);

      return () => clearInterval(tryScroll);
    }
  }, [loading, initialPostId, isOpen]);

  const loadComments = (postId: string) => {
    const q = query(
      collection(db, "morning_inspirations", postId, "comments"),
      orderBy("timestamp", "asc"),
      limit(50),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        setCommentsMap((prev) => ({ ...prev, [postId]: fetchedComments }));
      },
      (error) => {
        console.error(error);
        handleFirestoreError(
          error,
          OperationType.LIST,
          `morning_inspirations/${postId}/comments`,
        );
      },
    );
  };

  const toggleComments = (postId: string) => {
    const isExpanded = !!expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded && !commentsMap[postId]) {
      loadComments(postId);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;
    if (!auth.currentUser) {
      addToast(
        appLanguage === "pl"
          ? "Musisz się zalogować, aby komentować."
          : "You must be logged in to comment.",
        "alert",
      );
      return;
    }

    try {
      const commentData = {
        text,
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "User",
        authorAvatar: auth.currentUser.photoURL || "",
        timestamp: serverTimestamp(),
      };

      await addDoc(
        collection(db, "morning_inspirations", postId, "comments"),
        commentData,
      );

      await updateDoc(doc(db, "morning_inspirations", postId), {
        commentsCount: increment(1),
      });

      setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error(error);
      handleFirestoreError(
        error,
        OperationType.CREATE,
        `morning_inspirations/${postId}/comments`,
      );
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteDoc(
        doc(db, "morning_inspirations", postId, "comments", commentId),
      );
      await updateDoc(doc(db, "morning_inspirations", postId), {
        commentsCount: increment(-1),
      });
      addToast(
        appLanguage === "pl" ? "Komentarz usunięty." : "Comment deleted.",
        "success",
      );
    } catch (error) {
      console.error(error);
      handleFirestoreError(
        error,
        OperationType.DELETE,
        `morning_inspirations/${postId}/comments/${commentId}`,
      );
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (
      !window.confirm(
        appLanguage === "pl"
          ? "Na pewno usunąć ten post?"
          : "Are you sure you want to delete this post?",
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "morning_inspirations", postId));
      addToast(
        appLanguage === "pl" ? "Post usunięty." : "Post deleted.",
        "success",
      );
    } catch (error) {
      console.error(error);
      handleFirestoreError(
        error,
        OperationType.DELETE,
        `morning_inspirations/${postId}`,
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
      await updateDoc(doc(db, "morning_inspirations", postId), {
        title: editTitle,
        content: editContent,
        imageUrl: editImageUrl,
      });
      setEditingPostId(null);
      addToast(
        appLanguage === "pl" ? "Post zaktualizowany." : "Post updated.",
        "success",
      );
    } catch (error) {
      console.error(error);
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `morning_inspirations/${postId}`,
      );
    }
  };

  const handleShare = async (post: Post) => {
    const postUrl = `https://cclite.pl/post/${post.id}`;
    const shareData = {
      title: post.title,
      text: post.content.substring(0, 50) + "...",
      url: postUrl,
    };

    try {
      setSharingPostId(post.id);
      if (navigator.share) {
        await navigator.share(shareData);
        await updateDoc(doc(db, "morning_inspirations", post.id), {
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

  const [likes, setLikes] = useState<
    Record<string, { isLiked: boolean; count: number }>
  >({});

  useEffect(() => {
    if (auth.currentUser && posts.length > 0) {
      const fetchLikes = async () => {
        const newLikes: Record<string, { isLiked: boolean; count: number }> =
          {};
        for (const post of posts) {
          try {
            const likeRef = doc(
              db,
              "morning_inspirations",
              post.id,
              "favorites",
              auth.currentUser!.uid,
            );
            const likeSnap = await getDoc(likeRef);
            newLikes[post.id] = {
              isLiked: likeSnap.exists(),
              count: post.likesCount || 0,
            };
          } catch (e) {
            console.error("Error fetching likes for post", post.id, e);
          }
        }
        setLikes((prev) => ({ ...prev, ...newLikes }));
      };
      fetchLikes();
    }
  }, [auth.currentUser, posts]);

  const toggleLike = async (post: Post) => {
    if (!auth.currentUser) {
      addToast(
        appLanguage === "pl"
          ? "Musisz się zalogować, aby dodać do ulubionych."
          : "You must be logged in to favorite.",
        "alert",
      );
      return;
    }

    const currentState = likes[post.id] || {
      isLiked: false,
      count: post.likesCount || 0,
    };
    const newIsLiked = !currentState.isLiked;
    const newCount = newIsLiked
      ? currentState.count + 1
      : currentState.count - 1;

    // Optimistic Update
    setLikes((prev) => ({
      ...prev,
      [post.id]: { isLiked: newIsLiked, count: newCount },
    }));

    try {
      const likeRef = doc(
        db,
        "morning_inspirations",
        post.id,
        "favorites",
        auth.currentUser.uid,
      );

      if (newIsLiked) {
        await setDoc(likeRef, {
          uid: auth.currentUser.uid,
          timestamp: serverTimestamp(),
        });
      } else {
        await deleteDoc(likeRef);
      }

      await updateDoc(doc(db, "morning_inspirations", post.id), {
        likesCount: increment(newIsLiked ? 1 : -1),
      });
    } catch (error) {
      console.error(error);
      // Rollback
      setLikes((prev) => ({ ...prev, [post.id]: currentState }));
      if (addToast)
        addToast(
          appLanguage === "pl"
            ? "Wystąpił błąd komunikacji z serwerem."
            : "A server error occurred.",
          "alert",
        );
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `morning_inspirations/${post.id}`,
      );
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
        className="bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[90vh] rounded-[2rem] border border-zinc-800 shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-zinc-900 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="text-[#C5A059] text-2xl">🌅</span>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">
              {appLanguage === "pl"
                ? "Pobudki Poranne"
                : "Morning Inspirations"}
            </h2>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-full transition-colors"
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scrollbar-thin">
          {loading ? (
            <div className="text-center py-20 animate-pulse">
              <span className="text-4xl">🕊️</span>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4">
                Wczytywanie...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <span className="text-4xl">📭</span>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4">
                Brak postów.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className="bg-zinc-900/60 rounded-[2rem] border border-zinc-800 overflow-hidden flex flex-col relative group"
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!post.imageUrl &&
                  editingPostId !== post.id &&
                  extractYouTubeVideoId(post.content) && (
                    <div className="w-full aspect-video bg-black relative border-b border-zinc-800">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeVideoId(post.content)}`}
                        title="YouTube video player"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                <div className="p-6">
                  {editingPostId === post.id ? (
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none"
                        placeholder="Tytuł"
                      />
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none"
                        placeholder="URL obrazka (opcjonalnie)"
                      />
                      <textarea
                        className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none min-h-[150px]"
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
                        <h3 className="text-lg font-black text-white leading-tight">
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

                      <div className="text-zinc-300 text-sm mt-4 leading-relaxed markdown-body">
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

                <div className="bg-black/40 p-4 border-t border-zinc-800/50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      aria-label="Ulubione"
                      onClick={() => toggleLike(post)}
                      className={`flex items-center gap-2 transition-colors ${
                        likes[post.id]?.isLiked
                          ? "text-[#C5A059]"
                          : "text-zinc-400 hover:text-[#C5A059]"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${likes[post.id]?.isLiked ? "fill-current" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-xs font-bold">
                        {likes[post.id]?.count ?? post.likesCount ?? 0}
                      </span>
                    </button>

                    <button
                      aria-label="Ulubione"
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-xs font-bold">
                        {post.commentsCount || 0}
                      </span>
                    </button>

                    <button
                      aria-label="Ulubione"
                      onClick={() => handleShare(post)}
                      disabled={sharingPostId === post.id}
                      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                      <span className="text-xs font-bold">
                        {post.sharesCount || 0}
                      </span>
                    </button>
                  </div>
                </div>

                {expandedComments[post.id] && (
                  <div className="bg-zinc-900 border-t border-zinc-800 p-4 sm:p-6 flex flex-col gap-4 animate-fade-in">
                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCommentText[post.id] || ""}
                        onChange={(e) =>
                          setNewCommentText((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          appLanguage === "pl"
                            ? "Napisz komentarz..."
                            : "Write a comment..."
                        }
                        className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#C5A059] outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-[#C5A059] text-white font-black text-xs uppercase rounded-xl hover:scale-105 active:scale-95 transition-transform"
                      >
                        ➔
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="flex flex-col gap-3 mt-4">
                      {!commentsMap[post.id] ? (
                        <div className="text-center py-4 text-xs text-zinc-500">
                          Wczytywanie...
                        </div>
                      ) : commentsMap[post.id].length === 0 ? (
                        <div className="text-center py-4 text-xs text-zinc-500">
                          {appLanguage === "pl"
                            ? "Bądź pierwszym, który skomentuje."
                            : "Be the first to comment."}
                        </div>
                      ) : (
                        commentsMap[post.id].map((comment) => (
                          <div
                            key={comment.id}
                            className="flex flex-col bg-black/40 p-3 rounded-xl border border-zinc-800/50"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">
                                  {comment.authorName}
                                </span>
                                <span className="text-[9px] text-zinc-600 font-medium">
                                  {comment.timestamp?.toDate
                                    ? comment.timestamp
                                        .toDate()
                                        .toLocaleString()
                                    : "Now"}
                                </span>
                              </div>
                              {(isAdmin ||
                                auth.currentUser?.uid ===
                                  comment.authorUid) && (
                                <button
                                  aria-label="Ulubione"
                                  onClick={() =>
                                    handleDeleteComment(post.id, comment.id)
                                  }
                                  className="text-zinc-600 hover:text-red-500 p-1 rounded-full"
                                >
                                  <svg
                                    className="w-3 h-3"
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
                              )}
                            </div>
                            <p className="text-sm text-zinc-300">
                              {comment.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};
