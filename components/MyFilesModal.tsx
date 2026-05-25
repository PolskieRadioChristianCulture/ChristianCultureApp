import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  FileText,
  Music,
  Video,
  File as FileIcon,
  Trash2,
  FolderOpen,
  Play,
  Square,
  Plus,
  Image,
} from "lucide-react";
import { SupportedLanguage, RadioAlarm, UserPersona } from "../types";
import { mediaPlayerService, Material } from "../services/mediaPlayerService";
import { nativeService } from "../services/nativeService";
import { ImpactStyle } from "@capacitor/haptics";
import { Bell, BellRing, UserCircle } from "lucide-react";
import { useCustomBackgrounds } from "../hooks/useCustomBackgrounds";

interface MyFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  radioAlarm?: RadioAlarm | null;
  onUpdateRadioAlarm?: (updates: Partial<RadioAlarm>) => void;
  userPersona?: UserPersona;
  onUpdateUserPersona?: (persona: UserPersona) => void;
}

export function MyFilesModal({
  isOpen,
  onClose,
  appLanguage,
  radioAlarm,
  onUpdateRadioAlarm,
  userPersona,
  onUpdateUserPersona,
}: MyFilesModalProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const {
    backgrounds,
    isActive,
    toggleActive,
    addBackground,
    removeBackground,
  } = useCustomBackgrounds();

  const toggleFolder = (title: string) => {
    setOpenFolders((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    const onPlayerChange = () => {
      setPlayingId(mediaPlayerService.playingMaterial?.id || null);
      setIsLoadingFile(false);
    };

    mediaPlayerService.on("changed", onPlayerChange);
    setPlayingId(mediaPlayerService.playingMaterial?.id || null);

    return () => {
      mediaPlayerService.removeListener("changed", onPlayerChange);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("cc_userMaterials");
      if (stored) {
        try {
          setMaterials(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  const processUploadedFiles = async (
    files: FileList | File[],
    folder?: string,
  ) => {
    setIsLoadingFile(true);
    let newMaterials: Material[] = [];

    try {
      if ("storage" in navigator && "getDirectory" in navigator.storage) {
        const opfsRoot = await navigator.storage.getDirectory();
        const materialsDir = await opfsRoot.getDirectoryHandle("cc_materials", {
          create: true,
        });

        let targetDir = materialsDir;
        if (folder) {
          targetDir = await materialsDir.getDirectoryHandle(folder, {
            create: true,
          });
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const fileName = file.name;
            const fileHandle = await targetDir.getFileHandle(fileName, {
              create: true,
            });
            const writable = await fileHandle.createWritable();
            await writable.write(file);
            await writable.close();

            newMaterials.push({
              id: Date.now().toString() + "_" + i,
              name: folder ? `${folder}/${fileName}` : fileName,
              type: file.type || "unknown",
              size: file.size,
              addedAt: new Date().toISOString(),
              folder: folder,
            });
          } catch (opfsErr) {
            console.warn("OPFS error for file", file.name, opfsErr);
          }
        }
      }
    } catch (e) {
      console.warn("OPFS access error:", e);
    }

    const storedMaterialsStr = localStorage.getItem("cc_userMaterials") || "[]";
    let storedMaterials: Material[] = [];
    try {
      storedMaterials = JSON.parse(storedMaterialsStr);
    } catch (e) {}

    const updatedMaterials = [...storedMaterials, ...newMaterials];
    localStorage.setItem("cc_userMaterials", JSON.stringify(updatedMaterials));
    setMaterials(updatedMaterials);
    setIsLoadingFile(false);
    nativeService.hapticImpact(ImpactStyle.Light);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processUploadedFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processUploadedFiles(files);
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsLoadingFile(true);
    for (let i = 0; i < files.length; i++) {
      try {
        await addBackground(files[i]);
      } catch (err: any) {
        if (err.message === "MAX_LIMIT") {
          alert(
            appLanguage === "pl"
              ? "Osiągnięto limit 12 tapet."
              : "Limit of 12 wallpapers reached.",
          );
          break;
        }
        console.warn(err);
      }
    }
    setIsLoadingFile(false);
    if (bgInputRef.current) bgInputRef.current.value = "";
  };

  const handlePlay = async (material: Material) => {
    if (playingId === material.id) {
      mediaPlayerService.stop();
      return;
    }

    setIsLoadingFile(true);
    await mediaPlayerService.play(material, materials);
  };

  const handleDelete = async (id: string, name: string) => {
    if (playingId === id) {
      mediaPlayerService.stop();
    }

    // Delete from OPFS
    if ("storage" in navigator && "getDirectory" in navigator.storage) {
      try {
        const opfsRoot = await navigator.storage.getDirectory();
        const materialsDir = await opfsRoot.getDirectoryHandle("cc_materials", {
          create: false,
        });

        if (name.includes("/")) {
          const parts = name.split("/");
          const folderName = parts[0];
          const fileName = parts[1];
          const folderHandle = await materialsDir.getDirectoryHandle(
            folderName,
            { create: false },
          );
          await folderHandle.removeEntry(fileName);
        } else {
          await materialsDir.removeEntry(name);
        }
      } catch (e) {
        console.log("Could not delete from OPFS, maybe not found", e);
      }
    }

    // Delete from metadata
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);
    localStorage.setItem("cc_userMaterials", JSON.stringify(updated));
  };

  if (!isOpen) return null;

  const handleSetAsAvatar = async (file: Material) => {
    if (!userPersona || !onUpdateUserPersona) return;

    const f = await mediaPlayerService.getFile(file);
    if (!f) return;

    const url = URL.createObjectURL(f);
    const currentAvatars = userPersona.avatarUrls || [
      userPersona.profilePicture || "",
    ];

    // Toggle logic: if already in list, remove (unless it's the only one?)
    // But user wants "adding" up to 12.
    let newAvatars = [...currentAvatars];
    const isAlreadyAvatar = currentAvatars.some((a) => a.includes(file.name)); // Simplified check as blob URLs change

    if (isAlreadyAvatar) {
      newAvatars = newAvatars.filter((a) => !a.includes(file.name));
    } else {
      newAvatars.push(url);
      if (newAvatars.length > 12) newAvatars.shift();
    }

    onUpdateUserPersona({
      ...userPersona,
      profilePicture: url,
      avatarUrls: newAvatars,
    });

    nativeService.hapticImpact(ImpactStyle.Medium);
  };

  const audioFiles = materials.filter(
    (m) => m.type.startsWith("audio/") || m.name.endsWith(".mp3"),
  );
  const videoFiles = materials.filter(
    (m) => m.type.startsWith("video/") || m.name.endsWith(".mp4"),
  );
  const imageFiles = materials.filter(
    (m) =>
      m.folder !== "Zdjęcia Profilowe" &&
      (m.type.startsWith("image/") ||
        [".webp", ".webp", ".webp", ".gif", ".webp"].some((ext) =>
          m.name.toLowerCase().endsWith(ext),
        )),
  );
  const profilePics = materials.filter((m) => m.folder === "Zdjęcia Profilowe");
  const documentFiles = materials.filter(
    (m) => m.type === "application/pdf" || m.name.endsWith(".pdf"),
  );
  const otherFiles = materials.filter(
    (m) =>
      !audioFiles.includes(m) &&
      !videoFiles.includes(m) &&
      !documentFiles.includes(m) &&
      !imageFiles.includes(m) &&
      !profilePics.includes(m),
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleSetAsAlarm = (file: Material) => {
    if (onUpdateRadioAlarm) {
      const isCurrentlyAlarm = radioAlarm?.localFileId === file.id;

      if (isCurrentlyAlarm) {
        onUpdateRadioAlarm({
          localFileId: undefined,
          localFileName: undefined,
        });
      } else {
        onUpdateRadioAlarm({
          localFileId: file.id,
          localFileName: file.name,
          enabled: true, // Auto-enable the alarm if setting a sound
        });
      }
      nativeService.hapticImpact(ImpactStyle.Medium);
    }
  };

  const handleToggleDocContext = (file: Material) => {
    try {
      const updated = materials.map((m) =>
        m.id === file.id ? { ...m, useAsContext: !m.useAsContext } : m,
      );
      setMaterials(updated);
      localStorage.setItem("cc_userMaterials", JSON.stringify(updated));
      nativeService.hapticImpact(ImpactStyle.Medium);
    } catch (e) {
      console.error(e);
    }
  };

  const renderBackgroundsList = () => {
    const title =
      appLanguage === "pl" ? "Własne tła (Tapety)" : "Custom Backgrounds";
    const isOpenFolder = openFolders[title];

    return (
      <div className="mb-4">
        <button
          aria-label="Ulubione"
          onClick={() => toggleFolder(title)}
          className="w-full text-left bg-zinc-900 border border-white/5 hover:bg-white/5 hover:border-white/20 p-4 rounded-2xl flex items-center justify-between transition-colors mb-2"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOpenFolder ? "bg-[#E2B859] text-black shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]" : "bg-black/50 text-[#E2B859] border border-white/5"}`}
            >
              {isOpenFolder ? (
                <FolderOpen className="w-5 h-5" />
              ) : (
                <Image className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                {title}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {backgrounds.length} / 12{" "}
                {appLanguage === "pl" ? "plików" : "files"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOpenFolder && backgrounds.length < 12 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  bgInputRef.current?.click();
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E2B859] hover:text-black transition-colors"
                title={appLanguage === "pl" ? "Dodaj tapetę" : "Add wallpaper"}
              >
                <Plus className="w-4 h-4" />
              </div>
            )}
            <svg
              className={`w-5 h-5 text-zinc-500 transition-transform ${isOpenFolder ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isOpenFolder && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {backgrounds.length > 0 && (
                <div className="px-1 mb-3 pt-2">
                  <button
                    onClick={() => toggleActive(!isActive)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border ${isActive ? "bg-[#E2B859]/20 text-[#E2B859] border-[#E2B859]/50 hover:bg-[#E2B859]/30" : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"}`}
                  >
                    {isActive
                      ? appLanguage === "pl"
                        ? "Przywróć domyślne tła"
                        : "Restore default backgrounds"
                      : appLanguage === "pl"
                        ? "Zastosuj wszystkie na pulpicie"
                        : "Apply all to desktop"}
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 pb-3">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.name}
                    className="flex flex-col bg-zinc-900 border border-white/5 p-3 rounded-2xl relative overflow-hidden group min-h-[120px]"
                  >
                    <img
                      src={bg.url}
                      alt={bg.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-100"
                    />
                    <div className="relative z-10 flex justify-end">
                      <button
                        aria-label="Usuń"
                        onClick={() => removeBackground(bg.name)}
                        className="w-7 h-7 flex flex-shrink-0 items-center justify-center bg-black/60 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="relative z-10 mt-auto">
                      <p className="text-xs font-bold line-clamp-1 leading-tight text-white/90 drop-shadow-md">
                        {bg.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type="file"
          multiple
          onChange={handleBgUpload}
          ref={bgInputRef}
          className="hidden"
          accept="image/*"
        />
      </div>
    );
  };

  const renderList = (
    title: string,
    list: Material[],
    icon: React.ReactNode,
    isPlayable: boolean = false,
    isAudio: boolean = false,
    isDocument: boolean = false,
    isAvatarFolder: boolean = false,
  ) => {
    if (list.length === 0 && !isAvatarFolder) return null;
    const isOpenFolder = openFolders[title];

    return (
      <div className="mb-4">
        <button
          aria-label="Ulubione"
          onClick={() => toggleFolder(title)}
          className="w-full text-left bg-zinc-900 border border-white/5 hover:bg-white/5 hover:border-white/20 p-4 rounded-2xl flex items-center justify-between transition-colors mb-2"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOpenFolder ? "bg-[#E2B859] text-black shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]" : "bg-black/50 text-[#E2B859] border border-white/5"}`}
            >
              {isOpenFolder ? <FolderOpen className="w-5 h-5" /> : icon}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                {title}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {list.length} {appLanguage === "pl" ? "plików" : "files"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOpenFolder && isAvatarFolder && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  avatarInputRef.current?.click();
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E2B859] hover:text-black transition-colors"
                title={
                  appLanguage === "pl"
                    ? "Dodaj zdjęcie profilowe"
                    : "Add profile picture"
                }
              >
                <Plus className="w-4 h-4" />
              </div>
            )}
            <svg
              className={`w-5 h-5 text-zinc-500 transition-transform ${isOpenFolder ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isOpenFolder && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 pt-1 pb-3">
                {list.map((file) => {
                  const isPlaying = playingId === file.id;
                  const isAlarmSound = radioAlarm?.localFileId === file.id;
                  const isContext = file.useAsContext;
                  const isAvatar =
                    userPersona?.profilePicture?.includes(file.name) ||
                    userPersona?.avatarUrls?.some((a) => a.includes(file.name));

                  return (
                    <div
                      key={file.id}
                      className={`flex flex-col bg-zinc-900 border p-3 rounded-2xl transition-all ${isPlaying ? "border-[#E2B859] shadow-[0_0_15px_rgba(226,184,89,0.2)] bg-[#E2B859]/5" : "border-white/5 hover:border-white/20 hover:bg-white/5"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPlaying ? "bg-[#E2B859] text-black shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]" : "bg-black/50 text-[#E2B859] border border-white/5"}`}
                        >
                          {icon}
                        </div>
                        <div className="flex gap-1">
                          {(isAvatarFolder ||
                            file.type.startsWith("image/")) && (
                            <button
                              aria-label="Profil"
                              onClick={() => handleSetAsAvatar(file)}
                              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isAvatar ? "bg-[#C5A059] text-black" : "bg-black/40 text-white hover:bg-[#C5A059] hover:text-black border border-white/5"}`}
                              title={
                                appLanguage === "pl"
                                  ? "Ustaw jako Avatar"
                                  : "Set as Avatar"
                              }
                            >
                              <UserCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isAudio && onUpdateRadioAlarm && (
                            <button
                              aria-label="Powiadomienia"
                              onClick={() => handleSetAsAlarm(file)}
                              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isAlarmSound ? "bg-[#E2B859] text-black" : "bg-black/40 text-white hover:bg-[#E2B859] hover:text-black border border-white/5"}`}
                              title={
                                appLanguage === "pl"
                                  ? isAlarmSound
                                    ? "Usuń jako budzik"
                                    : "Ustaw jako budzik"
                                  : isAlarmSound
                                    ? "Remove as alarm"
                                    : "Set as alarm"
                              }
                            >
                              {isAlarmSound ? (
                                <BellRing className="w-3.5 h-3.5" />
                              ) : (
                                <Bell className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          {isDocument && (
                            <button
                              aria-label="Ulubione"
                              onClick={() => handleToggleDocContext(file)}
                              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isContext ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-black/40 text-white hover:bg-emerald-500 hover:text-white border border-white/5"}`}
                              title={
                                appLanguage === "pl"
                                  ? isContext
                                    ? "Usuń z wiedzy AI"
                                    : "Użyj w wiedzy AI"
                                  : isContext
                                    ? "Remove from AI knowledge"
                                    : "Use in AI knowledge"
                              }
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                />
                              </svg>
                            </button>
                          )}
                          <button
                            aria-label="Usuń"
                            onClick={() => handleDelete(file.id, file.name)}
                            className="w-7 h-7 flex items-center justify-center bg-black/40 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-white/5"
                            title={appLanguage === "pl" ? "Usuń" : "Delete"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-bold line-clamp-2 leading-tight ${isPlaying ? "text-[#E2B859]" : "text-white"}`}
                          title={file.name}
                        >
                          {file.name}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex flex-col gap-1 items-start">
                          <p className="text-zinc-500 text-[9px] uppercase tracking-widest">
                            {formatSize(file.size)}
                          </p>
                          {isAlarmSound && (
                            <span className="text-[#E2B859] text-[8px] font-bold tracking-widest uppercase bg-[#E2B859]/10 px-1 py-0.5 rounded leading-none">
                              {appLanguage === "pl" ? "BUDZIK" : "ALARM"}
                            </span>
                          )}
                          {isContext && (
                            <span className="text-emerald-400 text-[8px] font-bold tracking-widest uppercase bg-emerald-400/10 px-1 py-0.5 rounded leading-none">
                              AI
                            </span>
                          )}
                        </div>
                        {isPlayable && (
                          <button
                            aria-label="Odtwarzaj"
                            onClick={() => handlePlay(file)}
                            className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${isPlaying ? "bg-[#E2B859] text-black shadow-lg shadow-[#E2B859]/20 scale-110" : "bg-white/10 text-white hover:bg-[#E2B859] hover:text-black hover:scale-110 active:scale-95"}`}
                            disabled={isLoadingFile && !isPlaying}
                          >
                            {isPlaying ? (
                              <Square className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#E2B859]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                  {appLanguage === "pl" ? "Moje Pliki" : "My Files"}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-6 h-6 flex items-center justify-center bg-[#E2B859] text-black rounded-full hover:scale-110 active:scale-95 transition-transform"
                    title={appLanguage === "pl" ? "Dodaj Pliki" : "Add Files"}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  {appLanguage === "pl"
                    ? "OPFS LOKALNY BANK DAT"
                    : "OPFS LOCAL DATA BANK"}
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                  accept=".mp3,.mp4,.pdf,.webp,.webp,.webp,.gif,.webp,audio/*,video/*,application/pdf,image/*"
                />
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    e.target.files &&
                    processUploadedFiles(e.target.files, "Zdjęcia Profilowe")
                  }
                  ref={avatarInputRef}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <button
                aria-label="Zamknij"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
                disabled={isLoadingFile}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`p-5 overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin transition-all relative ${isDragging ? "bg-[#E2B859]/10" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md border-2 border-dashed border-[#E2B859] m-4 rounded-3xl"
                  >
                    <div className="text-center">
                      <Plus className="w-12 h-12 text-[#E2B859] mx-auto mb-4 animate-bounce" />
                      <p className="text-white font-black uppercase tracking-widest text-lg">
                        {appLanguage === "pl"
                          ? "UPUŚĆ PLIK TERAZ"
                          : "DROP FILE NOW"}
                      </p>
                      <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-wider mt-2">
                        {appLanguage === "pl"
                          ? "Dodaj do swojego OPFS"
                          : "Add to your OPFS"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {materials.length === 0 && backgrounds.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <FileIcon className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                  <p className="text-sm font-bold text-white uppercase tracking-widest">
                    {appLanguage === "pl" ? "Brak Plików" : "No Files"}
                  </p>
                  <p className="text-[10px] mt-2">
                    {appLanguage === "pl"
                      ? "Użyj przycisku + powyżej lub przeciągnij plik tutaj."
                      : "Use the + button above or drag a file here."}
                  </p>
                </div>
              ) : (
                <>
                  {renderBackgroundsList()}
                  {renderList(
                    appLanguage === "pl"
                      ? "Zdjęcia Profilowe"
                      : "Profile Pictures",
                    profilePics,
                    <UserCircle className="w-4 h-4" />,
                    false,
                    false,
                    false,
                    true,
                  )}
                  {renderList(
                    appLanguage === "pl" ? "Galeria Zdjęć" : "Photo Gallery",
                    imageFiles,
                    <Image className="w-4 h-4" />,
                    false,
                    false,
                    false,
                  )}
                  {renderList(
                    appLanguage === "pl" ? "Audio" : "Audio",
                    audioFiles,
                    <Music className="w-4 h-4" />,
                    true,
                    true,
                    false,
                  )}
                  {renderList(
                    appLanguage === "pl" ? "Wideo" : "Video",
                    videoFiles,
                    <Video className="w-4 h-4" />,
                    true,
                    false,
                    false,
                  )}
                  {renderList(
                    appLanguage === "pl" ? "Dokumenty" : "Documents",
                    documentFiles,
                    <FileText className="w-4 h-4" />,
                    false,
                    false,
                    true,
                  )}
                  {renderList(
                    appLanguage === "pl"
                      ? "Inne (Mogą służyć jako kontekst AI)"
                      : "Other (Can be used as AI context)",
                    otherFiles,
                    <FileIcon className="w-4 h-4" />,
                    false,
                    false,
                    true,
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
