import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { UserPersona, Post } from "../types";
import { CommunityService } from "../services/communityService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ToastMessage } from "../types";

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  currentUser: UserPersona;
  addToast: (msg: string, type: ToastMessage["type"]) => void;
  appLanguage: string;
}

export function PublicProfileModal({
  isOpen,
  onClose,
  profileId,
  currentUser,
  addToast,
  appLanguage,
}: PublicProfileModalProps) {
  const t = (pl: string, en: string) => (appLanguage === "en" ? en : pl);

  const [profileUser, setProfileUser] = useState<UserPersona | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editSocial, setEditSocial] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
  });

  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");

  const isOwner =
    currentUser.uid === profileId || currentUser.googleEmail === profileId;

  useEffect(() => {
    if (!isOpen || !profileId) return;

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        if (isOwner && currentUser.uid) {
          setProfileUser(currentUser);
          setEditBio(currentUser.bio || "");
          setEditSocial({
            facebook: currentUser.socialLinks?.facebook || "",
            instagram: currentUser.socialLinks?.instagram || "",
            youtube: currentUser.socialLinks?.youtube || "",
            whatsapp: currentUser.socialLinks?.whatsapp || "",
          });
        } else {
          const userDoc = await getDoc(doc(db, "users", profileId));
          if (userDoc.exists()) {
            setProfileUser(userDoc.data() as UserPersona);
          } else {
            // Attempt to find by googleEmail for legacy support if needed, but normally profileId === uid
            setProfileUser(null);
          }
        }
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();

    const unsubscribePosts = CommunityService.subscribeToUserPosts(
      profileId,
      (userPosts) => {
        setPosts(userPosts);
      },
    );

    return () => unsubscribePosts();
  }, [isOpen, profileId, isOwner, currentUser]);

  const handleSaveProfile = async () => {
    if (!profileId) return;
    try {
      await updateDoc(doc(db, "users", profileId), {
        bio: editBio,
        socialLinks: {
          ...profileUser?.socialLinks,
          ...editSocial,
        },
      });
      addToast(t("Zapisano profil", "Profile saved"), "success");
      setIsEditing(false);
      if (profileUser) {
        setProfileUser({
          ...profileUser,
          bio: editBio,
          socialLinks: {
            ...profileUser.socialLinks,
            ...editSocial,
          },
        });
      }
    } catch (e) {
      addToast(t("Błąd zapisu", "Error saving"), "error");
    }
  };

  const handleAddPost = async () => {
    if (!newPostText.trim() && !newPostImage) return;
    if (!profileId) return;
    await CommunityService.addPost(
      profileId,
      profileUser?.name || currentUser.name || "Anonim",
      newPostText,
      newPostImage,
    );
    setNewPostText("");
    setNewPostImage("");
    addToast(t("Opublikowano", "Published"), "success");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profileUser?.name} - Christian Culture`,
          text:
            profileUser?.bio ||
            t(
              "Zobacz mój profil na Christian Culture",
              "Check out my profile on Christian Culture",
            ),
          url: `${window.location.origin}/profil/${profileId}`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/profil/${profileId}`,
      );
      addToast(t("Skopiowano link", "Copied link"), "info");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black border border-gold/30 rounded-3xl shadow-2xl flex flex-col">
        <div className="sticky top-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black to-black/90">
          <h2 className="text-xl font-bold text-gold uppercase">
            {isOwner
              ? t("Twoja Wizytówka", "Your Public Card")
              : t("Wizytówka Publiczna", "Public Card")}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-gold/50 text-gold hover:bg-gold/10"
            >
              {t("Udostępnij", "Share")}
            </Button>
            <button
              aria-label="Ulubione"
              onClick={onClose}
              className="p-2 bg-black/80 text-white hover:text-gold hover:bg-zinc-900 rounded-full transition-all"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 pt-0 space-y-6">
          {isLoading ? (
            <div className="text-center text-zinc-500 my-10">
              {t("Ładowanie profilu...", "Loading profile...")}
            </div>
          ) : !profileUser ? (
            <div className="text-center text-red-500 my-10">
              {t("Nie znaleziono profilu.", "Profile not found.")}
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                <div className="w-32 h-32 rounded-full border-4 border-gold overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0">
                  {profileUser.profilePicture ? (
                    <img
                      src={profileUser.profilePicture}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gold font-bold">
                      {profileUser.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h3 className="text-2xl font-black text-white">
                    {profileUser.name} {profileUser.surname}
                  </h3>

                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder={t(
                          "Dodaj krótkie bio...",
                          "Add short bio...",
                        )}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white resize-none"
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Facebook URL"
                          value={editSocial.facebook}
                          onChange={(e) =>
                            setEditSocial({
                              ...editSocial,
                              facebook: e.target.value,
                            })
                          }
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                        />
                        <input
                          placeholder="Instagram URL"
                          value={editSocial.instagram}
                          onChange={(e) =>
                            setEditSocial({
                              ...editSocial,
                              instagram: e.target.value,
                            })
                          }
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                        />
                        <input
                          placeholder="YouTube URL"
                          value={editSocial.youtube}
                          onChange={(e) =>
                            setEditSocial({
                              ...editSocial,
                              youtube: e.target.value,
                            })
                          }
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                        />
                        <input
                          placeholder="WhatsApp"
                          value={editSocial.whatsapp}
                          onChange={(e) =>
                            setEditSocial({
                              ...editSocial,
                              whatsapp: e.target.value,
                            })
                          }
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsEditing(false)}
                        >
                          {t("Anuluj", "Cancel")}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gold text-black hover:bg-gold/80"
                          onClick={handleSaveProfile}
                        >
                          {t("Zapisz", "Save")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-zinc-400 text-sm">
                        {profileUser.bio || t("Brak opisu", "No bio provided.")}
                      </p>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                        {profileUser.socialLinks?.facebook && (
                          <a
                            href={profileUser.socialLinks.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#1877F2]/20 text-[#1877F2] rounded-full text-xs font-bold hover:bg-[#1877F2]/30"
                          >
                            Facebook
                          </a>
                        )}
                        {profileUser.socialLinks?.instagram && (
                          <a
                            href={profileUser.socialLinks.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#E4405F]/20 text-[#E4405F] rounded-full text-xs font-bold hover:bg-[#E4405F]/30"
                          >
                            Instagram
                          </a>
                        )}
                        {profileUser.socialLinks?.youtube && (
                          <a
                            href={profileUser.socialLinks.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#FF0000]/20 text-[#FF0000] rounded-full text-xs font-bold hover:bg-[#FF0000]/30"
                          >
                            YouTube
                          </a>
                        )}
                        {profileUser.socialLinks?.whatsapp && (
                          <a
                            href={profileUser.socialLinks.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#25D366]/20 text-[#25D366] rounded-full text-xs font-bold hover:bg-[#25D366]/30"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>

                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="mt-2 text-gold hover:text-gold/80"
                        >
                          {t("Edytuj Profil", "Edit Profile")}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Ściana Użytkownika / User Wall */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white uppercase tracking-widest">
                  {t("Ściana", "Wall")}
                </h4>

                {isOwner && (
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 space-y-3">
                    <textarea
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder={t(
                        "Co u Ciebie słychać?",
                        "What's on your mind?",
                      )}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white resize-none"
                      rows={2}
                    />
                    <input
                      placeholder={t(
                        "Link do zdjęcia 1:1 (opcjonalnie)",
                        "Link to 1:1 image (optional)",
                      )}
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddPost}
                        size="sm"
                        className="bg-gold text-black hover:bg-gold/80 font-bold"
                      >
                        {t("Opublikuj", "Post")}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <AnimatePresence>
                    {posts.length === 0 ? (
                      <p className="text-zinc-600 text-center py-4 text-sm">
                        {t("Brak postów.", "No posts yet.")}
                      </p>
                    ) : (
                      posts.map((post) => (
                        <motion.div
                          key={post.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex flex-col justify-center items-center overflow-hidden shrink-0">
                              {profileUser.profilePicture ? (
                                <img
                                  src={profileUser.profilePicture}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-sm text-gold font-bold">
                                  {post.userName?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-white">
                                {post.userName}
                              </h5>
                              <span className="text-[10px] text-zinc-500">
                                {new Date(post.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {post.text && (
                            <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                              {post.text}
                            </p>
                          )}

                          {post.imageUrl && (
                            <div className="aspect-square w-full sm:w-2/3 max-w-sm rounded-xl overflow-hidden mt-2 mx-auto sm:mx-0">
                              <img
                                src={post.imageUrl}
                                alt="Złącznik"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Prosty panel akcji */}
                          <div className="flex gap-4 pt-2 border-t border-white/5">
                            <button
                              aria-label="Ulubione"
                              className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1"
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
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              Polub
                            </button>
                            {isOwner && (
                              <button
                                onClick={() =>
                                  CommunityService.deletePost(post.id)
                                }
                                className="text-xs text-zinc-600 hover:text-red-500 ml-auto"
                              >
                                Usuń
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
