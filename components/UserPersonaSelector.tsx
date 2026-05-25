import React, { useState, useEffect, useCallback, useRef } from "react";
// Fixed: Updated imports from types.ts
import {
  UserPersona,
  UserGender,
  ToastMessage,
  USER_ROLES,
  inferGenderFromName,
  UserAgeGroup,
  MaritalStatus,
  SpiritualStatus,
  USER_AGE_GROUPS,
  MARITAL_STATUS_OPTIONS,
  SPIRITUAL_STATUS_OPTIONS,
  SupportedLanguage,
  SocialLinks,
  CZAREK_AVATAR_URL,
} from "../types";
import {
  Youtube,
  Facebook,
  Instagram,
  Music,
  MessageCircle,
  MessageSquare,
  Smartphone,
  Globe,
  Quote,
  Link as LinkIcon,
} from "lucide-react";

const SocialIcons = {
  spotify: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.223.367-.704.482-1.071.259-2.92-1.785-6.595-2.187-10.925-1.197-.419.096-.841-.172-.937-.591-.096-.419.172-.841.591-.937 4.737-1.082 8.791-.622 12.083 1.394.367.223.482.704.259 1.072zm1.472-3.257c-.281.456-.88.604-1.336.323-3.342-2.054-8.438-2.651-12.39-1.452-.512.155-1.05-.141-1.205-.653-.155-.512.141-1.05.653-1.205 4.519-1.371 10.134-.703 14.004 1.675.456.281.604.88.323 1.336-.049.079-.049.079 0 0zm.127-3.41c-4.01-2.381-10.619-2.6-14.46-1.432-.614.186-1.263-.166-1.449-.78-.186-.614.166-1.263.78-1.449 4.417-1.34 11.712-1.08 16.331 1.66.552.327.739 1.035.412 1.587-.327.552-1.035.739-1.587.412-.027-.016-.027-.016 0 0z" />
    </svg>
  ),
  tiktok: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.417 6.417 0 0 1-1.87-1.62v7.94c.03 3.48-2.35 6.74-5.75 7.52-3.4.78-7.16-1.15-8.52-4.37-1.36-3.22-.05-7.22 2.99-8.82 1.08-.57 2.32-.82 3.53-.73v4.02c-.82-.13-1.73.07-2.35.65-.62.58-.91 1.48-.77 2.32.14.84.73 1.56 1.53 1.83.8.27 1.72.11 2.37-.42.65-.53.97-1.41.92-2.25V0h.02z" />
    </svg>
  ),
  whatsapp: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  messenger: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 4.97 0 11.11c0 3.5 1.62 6.62 4.15 8.65.22.17.35.44.35.73l-.01 2.57c0 .54.58.9 1.05.63l2.88-1.61c.23-.13.49-.16.74-.1 1.04.25 2.13.38 3.24.38 6.63 0 12-4.97 12-11.11S18.63 0 12 0zm1.19 14.83l-2.41-2.57-4.7 2.57 5.17-5.5 2.41 2.57 4.7-2.57-5.17 5.5z" />
    </svg>
  ),
};

interface UserPersonaSelectorProps {
  userName: string; // Pass current values from parent
  userGender: UserGender; // Pass current values from parent
  userAvatar?: string; // Add this prop
  userBackground?: string; // NEW: Add profile background prop
  userPersonalStatus?: string; // New prop for personal status
  preferredLaunchMode?: "standard" | "radio"; // NEW: Add preferredLaunchMode prop
  userAgeGroup: UserAgeGroup; // NEW: Add age group
  maritalStatus: MaritalStatus; // NEW: Add marital status
  spiritualStatus: SpiritualStatus; // NEW: Add spiritual status
  googleEmail?: string; // NEW: Google email
  isGoogleVerified?: boolean; // NEW: Google verification status
  bio?: string;
  socialLinks?: SocialLinks;
  embedCodes?: string[];
  onSave: (updatedFields: {
    name: string;
    gender?: UserGender;
    profilePicture?: string;
    profileBackground?: string;
    personalStatus?: string;
    preferredLaunchMode?: "standard" | "radio";
    ageGroup?: UserAgeGroup;
    maritalStatus?: MaritalStatus;
    spiritualStatus?: SpiritualStatus;
    bio?: string;
    socialLinks?: SocialLinks;
    embedCodes?: string[];
  }) => void; // Callback with only updated fields
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  appLanguage: SupportedLanguage; // Add appLanguage prop
  onSkip?: () => void; // New prop for skipping persona setup
  isInitialLogin?: boolean; // NEW: Prop to indicate if it's the initial login screen
}

export const UserPersonaSelector: React.FC<UserPersonaSelectorProps> = ({
  userName,
  userGender,
  userAvatar,
  userPersonalStatus,
  preferredLaunchMode,
  onSave,
  addToast,
  appLanguage,
  onSkip,
  isInitialLogin = false,
  userAgeGroup,
  maritalStatus,
  spiritualStatus,
  googleEmail,
  isGoogleVerified,
  userBackground,
  bio,
  socialLinks,
  embedCodes,
}) => {
  const [localName, setLocalName] = useState(userName);
  const [localGender, setLocalGender] = useState<UserGender>(userGender);
  const [localAvatar, setLocalAvatar] = useState<string | undefined>(
    userAvatar,
  );
  const [localBackground, setLocalBackground] = useState<string | undefined>(
    userBackground,
  );

  const [localAgeGroup, setLocalAgeGroup] =
    useState<UserAgeGroup>(userAgeGroup);
  const [localMaritalStatus, setLocalMaritalStatus] =
    useState<MaritalStatus>(maritalStatus);
  const [localSpiritualStatus, setLocalSpiritualStatus] =
    useState<SpiritualStatus>(spiritualStatus);

  const [localBio, setLocalBio] = useState(bio || "");
  const [localSocialLinks, setLocalSocialLinks] = useState<SocialLinks>(
    socialLinks || {},
  );
  const [localEmbedCodes, setLocalEmbedCodes] = useState<string[]>(
    embedCodes || [""],
  );
  const [activeSocialEdit, setActiveSocialEdit] = useState<
    keyof SocialLinks | null
  >(null);

  // State for selected role from dropdown (ID from USER_ROLES or 'OTHER')
  const [selectedRole, setSelectedRole] = useState<string>("");
  // State for custom status input if 'Other' is selected
  const [customStatusInput, setCustomStatusInput] = useState<string>("");
  // NEW: State for local preferred launch mode choice
  const [localPreferredLaunchMode, setLocalPreferredLaunchMode] = useState<
    "standard" | "radio"
  >(preferredLaunchMode ?? "radio"); // Default to 'radio'

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalName(userName);
    setLocalGender(userGender);
    setLocalAvatar(userAvatar);
    setLocalBackground(userBackground);
    setLocalPreferredLaunchMode(preferredLaunchMode ?? "radio"); // Ensure default is 'radio'
    setLocalAgeGroup(userAgeGroup);
    setLocalMaritalStatus(maritalStatus);
    setLocalSpiritualStatus(spiritualStatus);
    setLocalBio(bio || "");
    setLocalSocialLinks(socialLinks || {});
    setLocalEmbedCodes(embedCodes || [""]);

    // Determine the selected role based on userPersonalStatus
    if (userPersonalStatus) {
      // Find exact match in current app language
      const foundRole = USER_ROLES.find(
        (role) =>
          (appLanguage === "pl" && role.pl === userPersonalStatus) ||
          (appLanguage === "en" && role.en === userPersonalStatus),
      );
      if (foundRole) {
        setSelectedRole(foundRole.id);
        setCustomStatusInput("");
      } else {
        // If no direct match, assume it's a custom input
        setSelectedRole("OTHER");
        setCustomStatusInput(userPersonalStatus);
      }
    } else {
      setSelectedRole(""); // No role selected, default to empty
      setCustomStatusInput("");
    }
  }, [
    userName,
    userGender,
    userAvatar,
    userPersonalStatus,
    appLanguage,
    preferredLaunchMode,
    userAgeGroup,
    maritalStatus,
    spiritualStatus,
    bio,
    socialLinks,
    embedCodes,
  ]); // Added all new deps

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalName(newName);
    // Infer gender automatically on name change if not explicitly set
    if (localGender === "unspecified") {
      setLocalGender(inferGenderFromName(newName));
    }
  };

  const handleGenderChange = (val: UserGender) => {
    setLocalGender(val);
  };

  const handleAgeGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalAgeGroup(e.target.value as UserAgeGroup);
  };

  const handleMaritalStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLocalMaritalStatus(e.target.value as MaritalStatus);
  };

  const handleSpiritualStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLocalSpiritualStatus(e.target.value as SpiritualStatus);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRole(value);
    if (value !== "OTHER") {
      setCustomStatusInput(""); // Clear custom input if a predefined role is selected
    }
  };

  const handleCustomStatusInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomStatusInput(e.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        addToast(
          appLanguage === "pl"
            ? "Zdjęcie zbyt duże (max 2MB)."
            : "Image too large (max 2MB).",
          "info",
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        // Fix: Explicitly check if reader.result is a string before setting localAvatar.
        // reader.result can be string | null. localAvatar expects string | undefined.
        if (typeof reader.result === "string") {
          setLocalAvatar(reader.result);
        } else {
          // If reading fails (result is null) or not a string, set to undefined.
          setLocalAvatar(undefined);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setLocalAvatar(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBackgroundFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit for base64
        addToast(
          appLanguage === "pl"
            ? "Zdjęcie zbyt duże (max 1MB)."
            : "Image too large (max 1MB).",
          "info",
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLocalBackground(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    setLocalBackground(undefined);
    if (backgroundFileInputRef.current)
      backgroundFileInputRef.current.value = "";
  };

  const handleSave = useCallback(() => {
    if (!localName.trim()) {
      addToast(
        appLanguage === "pl" ? "Proszę podać imię." : "Name is required.",
        "info",
      );
      return;
    }

    let finalPersonalStatus: string | undefined;
    if (selectedRole === "OTHER") {
      finalPersonalStatus = customStatusInput.trim() || undefined;
    } else if (selectedRole !== "") {
      const role = USER_ROLES.find((r) => r.id === selectedRole);
      finalPersonalStatus = role
        ? appLanguage === "pl"
          ? role.pl
          : role.en
        : undefined;
    } else {
      finalPersonalStatus = undefined; // No role selected
    }

    // For initial login, if optional fields are not explicitly set, pass undefined so defaults can be applied elsewhere
    // Otherwise, pass the local state
    const genderToSave =
      isInitialLogin && localGender === "unspecified" ? undefined : localGender;
    const ageGroupToSave =
      isInitialLogin && localAgeGroup === "unspecified"
        ? undefined
        : localAgeGroup;
    const maritalStatusToSave =
      isInitialLogin && localMaritalStatus === "unspecified"
        ? undefined
        : localMaritalStatus;
    const spiritualStatusToSave =
      isInitialLogin && localSpiritualStatus === "unspecified"
        ? undefined
        : localSpiritualStatus;

    onSave({
      name: localName.trim(),
      gender: genderToSave,
      profilePicture: localAvatar,
      profileBackground: localBackground,
      personalStatus: finalPersonalStatus,
      preferredLaunchMode: localPreferredLaunchMode,
      ageGroup: ageGroupToSave,
      maritalStatus: maritalStatusToSave,
      spiritualStatus: spiritualStatusToSave,
      bio: localBio.trim(),
      socialLinks: localSocialLinks,
      embedCodes: localEmbedCodes.filter((c) => c.trim() !== ""),
    });
  }, [
    localName,
    localGender,
    localAvatar,
    localBackground,
    selectedRole,
    customStatusInput,
    localPreferredLaunchMode,
    localAgeGroup,
    localMaritalStatus,
    localSpiritualStatus,
    localBio,
    localSocialLinks,
    localEmbedCodes,
    onSave,
    addToast,
    appLanguage,
    isInitialLogin,
  ]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    // Make this the flex container with full height for its children to distribute
    <div className="w-full flex flex-col h-full space-y-6 sm:space-y-8">
      {/* Scrollable content container */}
      <div
        className="flex-1 overflow-y-auto pr-2 scrollbar-thin"
        style={{
          scrollbarColor: "#C5A059 rgba(24, 24, 27, 0.5)",
          scrollbarWidth: "thin",
        }}
      >
        <div className="space-y-8">
          {/* 0. Zdjęcie Profilowe */}
          {!isInitialLogin && ( // Hide avatar selection for initial login
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                  {appLanguage === "pl" ? "Twoje Zdjęcie" : "Your Photo"}
                </label>
                <div
                  className="relative w-28 h-28 rounded-[2rem] bg-zinc-900 border-2 border-dashed border-zinc-800 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#C5A059] transition-all group shadow-2xl"
                  onClick={() => fileInputRef.current?.click()}
                  title={
                    appLanguage === "pl"
                      ? "Kliknij, aby zmienić zdjęcie"
                      : "Click to change photo"
                  }
                >
                  <img
                    src={localAvatar || CZAREK_AVATAR_URL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = CZAREK_AVATAR_URL;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l10.732-10.732z"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {localAvatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    {appLanguage === "pl" ? "Usuń zdjęcie" : "Remove photo"}
                  </button>
                )}
              </div>

              {/* Tło Profilowe */}
              <div className="flex flex-col items-center gap-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                  {appLanguage === "pl"
                    ? "Tło Wizytówki"
                    : "Business Card Background"}
                </label>
                <div
                  className="relative w-full h-32 rounded-[2rem] bg-zinc-900 border-2 border-dashed border-zinc-800 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#C5A059] transition-all group shadow-2xl"
                  onClick={() => backgroundFileInputRef.current?.click()}
                  title={
                    appLanguage === "pl"
                      ? "Kliknij, aby zmienić tło"
                      : "Click to change background"
                  }
                >
                  {localBackground ? (
                    <img
                      src={localBackground}
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 group-hover:text-[#C5A059] transition-colors">
                      <svg
                        className="w-8 h-8 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        +{" "}
                        {appLanguage === "pl" ? "Dodaj Tło" : "Add Background"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l10.732-10.732z"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  type="file"
                  ref={backgroundFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleBackgroundFileChange}
                />
                {localBackground && (
                  <button
                    onClick={handleRemoveBackground}
                    className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    {appLanguage === "pl" ? "Usuń tło" : "Remove background"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 2. Imię użytkownika (always visible) */}
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block">
                {appLanguage === "pl" ? "Twoje Imię" : "Your Name"}
              </label>
              {googleEmail && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <svg
                    className="w-3 h-3 text-blue-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">
                    {appLanguage === "pl"
                      ? "Zalogowano przez Google"
                      : "Logged in via Google"}
                  </span>
                  {isGoogleVerified && (
                    <div
                      className="flex items-center gap-1 ml-1 pl-1.5 border-l border-blue-500/20"
                      title={
                        appLanguage === "pl"
                          ? "Zweryfikowano przez Google"
                          : "Verified by Google"
                      }
                    >
                      <svg
                        className="w-2.5 h-2.5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-[7px] font-black text-green-400 uppercase tracking-widest">
                        {appLanguage === "pl" ? "Zweryfikowany" : "Verified"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative group">
              <input
                type="text"
                value={localName}
                onChange={handleNameChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  appLanguage === "pl"
                    ? "Wpisz swoje imię..."
                    : "Enter your name..."
                }
                className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-zinc-600 shadow-inner transition-all group-hover:border-zinc-700"
              />
            </div>
          </div>

          {/* 1. Wybór płci */}
          {!isInitialLogin && ( // Hide gender selection for initial login
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                {appLanguage === "pl" ? "Płeć" : "Gender"}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleGenderChange("male")}
                  className={`flex items-center justify-center gap-4 py-5 rounded-2xl border-2 transition-all ${
                    localGender === "male"
                      ? "bg-gold-dark border-gold-dark text-white shadow-xl scale-[1.02]"
                      : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-2xl">👨‍🦰</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {appLanguage === "pl" ? "Mężczyzna" : "Male"}
                  </span>
                </button>
                <button
                  onClick={() => handleGenderChange("female")}
                  className={`flex items-center justify-center gap-4 py-5 rounded-2xl border-2 transition-all ${
                    localGender === "female"
                      ? "bg-gold-dark border-gold-dark text-white shadow-xl scale-[1.02]"
                      : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-2xl">👩‍🦰</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {appLanguage === "pl" ? "Kobieta" : "Female"}
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* NEW: Age Group */}
            {!isInitialLogin && (
              <div className="space-y-4">
                <label
                  htmlFor="ageGroupSelect"
                  className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2"
                >
                  {appLanguage === "pl" ? "Grupa Wiekowa" : "Age Group"}
                </label>
                <div className="relative group">
                  <select
                    id="ageGroupSelect"
                    value={localAgeGroup}
                    onChange={handleAgeGroupChange}
                    onKeyDown={handleKeyDown}
                    className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
                  >
                    {USER_AGE_GROUPS.map((group) => (
                      <option
                        key={group.id}
                        value={group.id}
                        className="bg-zinc-900"
                      >
                        {appLanguage === "pl" ? group.pl : group.en}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600">
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* NEW: Marital Status */}
            {!isInitialLogin && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                  {appLanguage === "pl" ? "Stan Cywilny" : "Marital Status"}
                </label>
                <div className="relative group">
                  <select
                    value={localMaritalStatus}
                    onChange={handleMaritalStatusChange}
                    onKeyDown={handleKeyDown}
                    className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
                  >
                    {MARITAL_STATUS_OPTIONS.map((status) => (
                      <option
                        key={status.id}
                        value={status.id}
                        className="bg-zinc-900"
                      >
                        {appLanguage === "pl" ? status.pl : status.en}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600">
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NEW: Spiritual Status */}
          {!isInitialLogin && (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                {appLanguage === "pl" ? "Status Duchowy" : "Spiritual Status"}
              </label>
              <div className="relative group">
                <select
                  value={localSpiritualStatus}
                  onChange={handleSpiritualStatusChange}
                  onKeyDown={handleKeyDown}
                  className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
                >
                  {SPIRITUAL_STATUS_OPTIONS.map((status) => (
                    <option
                      key={status.id}
                      value={status.id}
                      className="bg-zinc-900"
                    >
                      {appLanguage === "pl" ? status.pl : status.en}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600">
                  <svg
                    className="fill-current h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 3. Spersonalizowany Status (new field - dropdown) */}
          {!isInitialLogin && ( // Hide personal status selection for initial login
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                {appLanguage === "pl"
                  ? "Twoja Rola Duchowa (Publiczna)"
                  : "Your Spiritual Role (Public)"}
              </label>
              <div className="relative group">
                <select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  onKeyDown={handleKeyDown}
                  className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
                >
                  <option value="" disabled className="text-zinc-600">
                    {appLanguage === "pl"
                      ? "Wybierz rolę..."
                      : "Select a role..."}
                  </option>
                  {USER_ROLES.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                      className="bg-zinc-900"
                    >
                      {appLanguage === "pl" ? role.pl : role.en}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600">
                  <svg
                    className="fill-current h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {selectedRole === "OTHER" && (
                <input
                  type="text"
                  value={customStatusInput}
                  onChange={handleCustomStatusInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    appLanguage === "pl"
                      ? "np. Uczeń Jezusa Chrystusa"
                      : "e.g. Disciple of Jesus Christ"
                  }
                  className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-zinc-600 mt-3 shadow-inner"
                  maxLength={30} // Limit to a reasonable length
                />
              )}
              <p className="text-[10px] text-zinc-600 italic pl-2">
                {appLanguage === "pl"
                  ? "Twoja rola będzie widoczna na wizytówce."
                  : "Your role will be visible on your digital card."}
              </p>
            </div>
          )}

          {/* BIO Section */}
          {!isInitialLogin && (
            <div className="space-y-4 pt-6 border-t border-zinc-800/50">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                {appLanguage === "pl" ? "O Tobie (BIO)" : "About You (BIO)"}
              </label>
              <div className="relative group">
                <textarea
                  value={localBio}
                  onChange={(e) => setLocalBio(e.target.value)}
                  placeholder={
                    appLanguage === "pl"
                      ? "Napisz kilka słów o sobie, ulubiony cytat, parafię..."
                      : "Write a few words about yourself, favorite quote, parish..."
                  }
                  className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-white placeholder-zinc-600 shadow-inner transition-all group-hover:border-zinc-700 min-h-[120px] resize-none"
                />
              </div>
            </div>
          )}

          {/* Social Links Section */}
          {!isInitialLogin && (
            <div className="space-y-4 pt-6 border-t border-zinc-800/50">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                {appLanguage === "pl"
                  ? "Media Społecznościowe"
                  : "Social Media"}
              </label>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    "spotify",
                    "youtube",
                    "facebook",
                    "instagram",
                    "tiktok",
                    "whatsapp",
                    "messenger",
                  ] as const
                ).map((platform) => {
                  const Icon =
                    platform === "youtube"
                      ? Youtube
                      : platform === "facebook"
                        ? Facebook
                        : platform === "instagram"
                          ? Instagram
                          : SocialIcons[platform as keyof typeof SocialIcons];
                  const hasLink = !!localSocialLinks[platform];

                  return (
                    <button
                      key={platform}
                      onClick={() =>
                        setActiveSocialEdit(
                          activeSocialEdit === platform ? null : platform,
                        )
                      }
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${
                        activeSocialEdit === platform
                          ? "bg-[#C5A059] border-[#C5A059] text-black scale-110 shadow-lg"
                          : hasLink
                            ? "bg-zinc-800 border-[#C5A059]/50 text-[#C5A059]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700"
                      }`}
                      title={
                        platform.charAt(0).toUpperCase() + platform.slice(1)
                      }
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  );
                })}
              </div>

              {activeSocialEdit && (
                <div className="mt-4 p-5 bg-zinc-900/80 rounded-2xl border border-[#C5A059]/30 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">
                      {activeSocialEdit.toUpperCase()} LINK
                    </label>
                    <button
                      aria-label="Ulubione"
                      onClick={() => setActiveSocialEdit(null)}
                      className="text-zinc-500 hover:text-white"
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
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={localSocialLinks[activeSocialEdit] || ""}
                    onChange={(e) =>
                      setLocalSocialLinks({
                        ...localSocialLinks,
                        [activeSocialEdit]: e.target.value,
                      })
                    }
                    placeholder={`https://${activeSocialEdit}.com/...`}
                    className="w-full py-4 px-5 bg-black/60 border border-zinc-800 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#C5A059] focus:outline-none text-white placeholder-zinc-700 shadow-inner"
                    autoFocus
                  />
                  <p className="text-[9px] text-zinc-500 mt-2 italic">
                    {appLanguage === "pl"
                      ? "Wklej link do swojego profilu lub ulubionej piosenki."
                      : "Paste link to your profile or favorite song."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Embed Code Section */}
          {!isInitialLogin && (
            <div className="space-y-4 pt-6 border-t border-zinc-800/50">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block">
                  {appLanguage === "pl"
                    ? "Kody Osadzone (np. Spotify Player)"
                    : "Embed Codes (e.g. Spotify Player)"}
                </label>
                <button
                  aria-label="Ulubione"
                  onClick={() => setLocalEmbedCodes([...localEmbedCodes, ""])}
                  className="text-[10px] font-black text-gold uppercase tracking-widest flex items-center gap-1 hover:text-gold/80"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {appLanguage === "pl" ? "DODAJ KOD" : "ADD CODE"}
                </button>
              </div>
              {localEmbedCodes.map((code, index) => (
                <div key={index} className="relative group">
                  <textarea
                    value={code}
                    onChange={(e) => {
                      const newCodes = [...localEmbedCodes];
                      newCodes[index] = e.target.value;
                      setLocalEmbedCodes(newCodes);
                    }}
                    placeholder={
                      appLanguage === "pl"
                        ? "Wklej kod iframe..."
                        : "Paste iframe code..."
                    }
                    className="w-full py-5 px-6 bg-black/40 border border-zinc-800 rounded-2xl text-[10px] font-mono focus:ring-2 focus:ring-[#C5A059] focus:outline-none text-zinc-300 placeholder-zinc-700 shadow-inner transition-all group-hover:border-zinc-700 min-h-[80px] resize-none"
                  />
                </div>
              ))}
              <p className="text-[9px] text-zinc-600 italic pl-2">
                {appLanguage === "pl"
                  ? "Aplikacja automatycznie dostosuje rozmiar odtwarzacza do wizytówki."
                  : "The app will automatically adjust the player size to fit the card."}
              </p>
            </div>
          )}

          {/* NEW: Preferred Launch Mode Selector for initial setup */}
          {!isInitialLogin && ( // Hide launch mode selection for initial login
            <div className="space-y-4 pt-6 border-t border-zinc-800/50">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                {appLanguage === "pl"
                  ? "Preferowany Tryb Uruchamiania"
                  : "Preferred Launch Mode"}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setLocalPreferredLaunchMode("standard")}
                  className={`flex items-center justify-center gap-4 py-5 rounded-2xl border-2 transition-all ${
                    localPreferredLaunchMode === "standard"
                      ? "bg-gold-dark border-gold-dark text-white shadow-xl scale-[1.02]"
                      : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-2xl">🏠</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {appLanguage === "pl" ? "Standardowy" : "Standard"}
                  </span>
                </button>
                <button
                  onClick={() => setLocalPreferredLaunchMode("radio")}
                  className={`flex items-center justify-center gap-4 py-5 rounded-2xl border-2 transition-all ${
                    localPreferredLaunchMode === "radio"
                      ? "bg-gold-dark border-gold-dark text-white shadow-xl scale-[1.02]"
                      : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-2xl">📻</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {appLanguage === "pl" ? "Samochodowy" : "Car Mode"}
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-zinc-600 italic pl-2">
                {appLanguage === "pl"
                  ? "Aplikacja uruchomi się w tym trybie po następnym starcie."
                  : "The app will launch in this mode on next startup."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed footer buttons */}
      <div className="pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 flex-shrink-0">
        {onSkip && (
          <button
            onClick={onSkip}
            className="flex-1 py-5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
          >
            {appLanguage === "pl" ? "Pomiń" : "Skip"}
          </button>
        )}
        <button
          onClick={handleSave}
          className="flex-1 py-5 bg-gold-dark text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(184,134,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          {appLanguage === "pl" ? "Zapisz Profil" : "Save Profile"}
        </button>
      </div>
    </div>
  );
};
