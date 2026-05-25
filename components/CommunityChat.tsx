import React, { useState, useEffect, useRef } from "react";
import {
  ref,
  push,
  onChildAdded,
  serverTimestamp,
  query,
  limitToLast,
} from "firebase/database";
import { rtdb, auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  User,
  MessageSquare,
  LogIn,
  ShieldCheck,
  Search,
  UserPlus,
  Check,
  X as CloseIcon,
  MoreVertical,
  Ban,
  UserMinus,
  Bell,
} from "lucide-react";
import { Button } from "./ui/button";
import { inferGenderFromName, LiveUser, ChatMessage } from "../types";
import { PersistenceService } from "../services/persistenceService";
import { CommunityService } from "../services/communityService";

interface CommunityChatProps {
  userName: string;
  userAvatar?: string;
  fullHeight?: boolean;
  initialView?: ChatView;
  initialUserId?: string;
  initialMessage?: string;
  onClose?: () => void;
  onOpenUserPanel?: (uid: string) => void;
}

type ChatView =
  | "lobby"
  | "global"
  | "private_list"
  | "private_chat"
  | "search"
  | "invitations"
  | "all_users";

export const CommunityChat: React.FC<CommunityChatProps> = ({
  userName,
  userAvatar,
  fullHeight = false,
  initialView,
  initialUserId,
  initialMessage,
  onClose,
  onOpenUserPanel,
}) => {
  const [view, setView] = useState<ChatView>(initialView || "lobby");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState(initialMessage || "");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<LiveUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<LiveUser[]>([]);
  const [allUsers, setAllUsers] = useState<LiveUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialView) setView(initialView);
    if (initialMessage) setNewMessage(initialMessage);
    if (initialUserId) {
      // If we have an initialUserId, we might want to find the chat with them
      const friend = friends.find((f) => f.uids.includes(initialUserId));
      if (friend) {
        setSelectedChatId(friend.id);
      }
    }
  }, [initialView, initialMessage, initialUserId, friends]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (!user) setView("lobby");
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || view !== "global") {
      if (view === "global") setIsLoading(false);
      return;
    }

    console.log("CC Global: Joining room 'global_cc_radio'...");
    const messagesRef = ref(rtdb, "global_cc_radio");
    const q = query(messagesRef, limitToLast(30));

    const unsubscribe = onChildAdded(
      q,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const message: ChatMessage = {
            id: snapshot.key as string,
            ...data,
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            const newMessages = [...prev, message];
            return newMessages.sort((a, b) => {
              const t1 =
                typeof a.timestamp === "number" ? a.timestamp : Date.now();
              const t2 =
                typeof b.timestamp === "number" ? b.timestamp : Date.now();
              return t1 - t2;
            });
          });
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("RTDB Listener Error:", error);
        setIsLoading(false);
      },
    );

    const timer = setTimeout(() => setIsLoading(false), 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [isAuthenticated, view]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const { displayName, photoURL, email, uid } = user;
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const gender = displayName
            ? inferGenderFromName(displayName)
            : "unspecified";
          const mentor = gender === "male" ? "Miriam" : "Jeszua";

          const persona = {
            name: displayName || "Pielgrzym",
            profilePicture: photoURL || "",
            gender: gender,
            googleEmail: email || undefined,
            assignedMentor: mentor,
            uid: uid,
            isFirstRun: false,
            ageGroup: "unspecified",
            maritalStatus: "unspecified",
            spiritualStatus: "believer",
            role: "client",
          };

          await setDoc(userDocRef, persona);
          PersistenceService.setSSOCookie(persona as any);
        }
      }
    } catch (error) {
      console.error("Chat Login Error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser) return;

    const unsubRequests = CommunityService.subscribeToFriendRequests(
      auth.currentUser.uid,
      setFriendRequests,
    );
    const unsubFriends = CommunityService.subscribeToFriends(
      auth.currentUser.uid,
      setFriends,
    );
    const unsubPresence =
      CommunityService.subscribeToLivePresence(setOnlineUsers);

    return () => {
      unsubRequests();
      unsubFriends();
      unsubPresence();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (view === "private_chat" && selectedChatId) {
      const unsubMessages = CommunityService.subscribeToPrivateMessages(
        selectedChatId,
        (messages) => {
          setPrivateMessages(messages);
          // Mark messages as read
          messages.forEach((msg) => {
            if (msg.userId !== auth.currentUser?.uid && msg.status !== "read") {
              CommunityService.updateMessageStatus(
                selectedChatId,
                msg.id,
                "read",
              );
            }
          });
        },
      );
      const unsubTyping = CommunityService.subscribeToTyping(
        selectedChatId,
        setTypingUsers,
      );
      return () => {
        unsubMessages();
        unsubTyping();
      };
    }
  }, [view, selectedChatId]);

  useEffect(() => {
    if (view === "all_users") {
      const fetchAllUsers = async () => {
        setIsUsersLoading(true);
        const users = await CommunityService.getAllUsers();
        setAllUsers(users.filter((u) => u.uid !== auth.currentUser?.uid));
        setIsUsersLoading(false);
      };
      fetchAllUsers();
    }
  }, [view]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    const results = await CommunityService.searchUsers(searchTerm.trim());
    setSearchResults(results.filter((u) => u.uid !== auth.currentUser?.uid));
    setIsSearching(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, privateMessages, view]);

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (view === "private_chat" && selectedChatId && auth.currentUser) {
      CommunityService.setTypingStatus(
        selectedChatId,
        auth.currentUser.uid,
        true,
      );
      // Reset typing status after 3 seconds of inactivity
      clearTimeout((window as any).typingTimer);
      (window as any).typingTimer = setTimeout(() => {
        CommunityService.setTypingStatus(
          selectedChatId,
          auth.currentUser!.uid,
          false,
        );
      }, 3000);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || isSending) return;

    if (view === "private_chat" && selectedChatId && auth.currentUser) {
      CommunityService.setTypingStatus(
        selectedChatId,
        auth.currentUser.uid,
        false,
      );
    }

    const messageText = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    // Timeout promise to prevent infinite spinning
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: Message sending took too long")),
        20000,
      ),
    );

    try {
      const sendOperation = async () => {
        if (view === "global") {
          const messagesRef = ref(rtdb, "global_cc_radio");
          const messageData = {
            text: messageText,
            userName: auth.currentUser?.displayName || userName || "Anonim",
            userAvatar: auth.currentUser?.photoURL || userAvatar || "",
            userId: auth.currentUser?.uid || "guest",
            timestamp: serverTimestamp(),
          };
          await push(messagesRef, messageData);
        } else if (view === "private_chat" && selectedChatId) {
          const chatRef = collection(
            db,
            "private_chats",
            selectedChatId,
            "messages",
          );
          await addDoc(chatRef, {
            senderId: auth.currentUser?.uid,
            text: messageText,
            timestamp: new Date().toISOString(),
            status: "sent",
          });
        }
      };

      await Promise.race([sendOperation(), timeoutPromise]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message if it failed to send
      setNewMessage(messageText);
      // Inform the user
      window.dispatchEvent(
        new CustomEvent("cc_show_toast", {
          detail: {
            msg: "Błąd wysyłania wiadomości. Spróbuj ponownie lub sprawdź połączenie.",
            title: "Błąd",
            type: "error",
          },
        }),
      );
    } finally {
      setIsSending(false);
    }
  };

  const renderLobby = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">
          Centrum Rozmów
        </h3>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          Wybierz tryb komunikacji
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Global Chat Card */}
        <button
          aria-label="Otwórz czat publiczny"
          onClick={() => setView("global")}
          className="group relative flex flex-col items-center p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] hover:border-gold/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(197,160,89,0.1)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
            <MessageSquare className="w-8 h-8 text-gold" />
          </div>
          <p className="text-sm font-black text-white uppercase tracking-widest mb-2">
            Społeczność
          </p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter text-center leading-relaxed">
            Pokój ogólny dla wszystkich pielgrzymów Christian Culture.
          </p>
          <div className="mt-6 px-4 py-1.5 bg-gold/10 rounded-full border border-gold/20">
            <span className="text-[8px] font-black text-gold uppercase tracking-widest">
              Dołącz do Global
            </span>
          </div>
        </button>

        {/* Private Chat Card */}
        <button
          aria-label="Otwórz czat prywatny"
          onClick={() => setView("private_list")}
          className="group relative flex flex-col items-center p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] hover:border-gold/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(197,160,89,0.1)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
            <User className="w-8 h-8 text-gold" />
          </div>
          <p className="text-sm font-black text-white uppercase tracking-widest mb-2">
            Czat Prywatny
          </p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter text-center leading-relaxed">
            Bezpieczne rozmowy 1-na-1 z Twoimi bliskimi znajomymi.
          </p>
          <div className="mt-6 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 group-hover:border-gold/30">
            <span className="text-[8px] font-black text-zinc-400 group-hover:text-gold uppercase tracking-widest transition-colors">
              Otwórz Kontakty
            </span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-fade-in">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Szukaj po nicku..."
            className="w-full bg-zinc-900 border border-white/5 rounded-full pl-11 pr-4 py-3 text-sm text-white focus:border-gold/50 outline-none"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-gold text-black rounded-full px-6"
        >
          {isSearching ? "..." : "Szukaj"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
        {searchResults.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <Search className="w-8 h-8 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Wpisz nick pielgrzyma
            </p>
          </div>
        ) : (
          searchResults.map((user) => (
            <div
              key={user.uid}
              className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                  <User className="w-5 h-5 text-zinc-500" />
                </div>
                <div>
                  <span className="block text-xs font-black text-white uppercase tracking-widest">
                    {user.userName}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">
                    Pielgrzym CC
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  CommunityService.sendFriendRequest(
                    auth.currentUser!.uid,
                    userName,
                    userAvatar || "",
                    user.uid,
                  )
                }
                className="text-gold hover:bg-gold/10 rounded-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Zaproś
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderInvitations = () => (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-fade-in">
      <span className="block text-xs font-black text-white uppercase tracking-widest px-2">
        Zaproszenia do kontaktu
      </span>
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
        {friendRequests.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <Bell className="w-8 h-8 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Brak nowych zaproszeń
            </p>
          </div>
        ) : (
          friendRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                {req.fromAvatar ? (
                  <img
                    src={req.fromAvatar}
                    className="w-10 h-10 rounded-full border border-gold/20"
                  />
                ) : (
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                    <User className="w-5 h-5 text-zinc-500" />
                  </div>
                )}
                <div>
                  <span className="block text-xs font-black text-white uppercase tracking-widest">
                    {req.fromName}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">
                    Chce dołączyć do Twoich znajomych
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  aria-label="Akceptuj zaproszenie"
                  onClick={() =>
                    CommunityService.respondToFriendRequest(req.id, "accepted")
                  }
                  className="bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-full w-8 h-8"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  aria-label="Odrzuć zaproszenie"
                  onClick={() =>
                    CommunityService.respondToFriendRequest(req.id, "rejected")
                  }
                  className="bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-full w-8 h-8"
                >
                  <CloseIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAllUsers = () => (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <span className="block text-xs font-black text-white uppercase tracking-widest">
          Wszyscy Pielgrzymi
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("search")}
          className="text-[9px] font-black text-gold uppercase tracking-widest hover:bg-gold/10"
        >
          Szukaj...
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
        {isUsersLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          </div>
        ) : allUsers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <User className="w-8 h-8 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Brak zarejestrowanych pielgrzymów
            </p>
          </div>
        ) : (
          allUsers.map((user) => {
            const isOnline = onlineUsers.some((u) => u.uid === user.uid);
            const isFriend = friends.some((f) => f.uids.includes(user.uid));

            return (
              <div
                key={user.uid}
                className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl cursor-pointer hover:border-gold/30 transition-all"
                onClick={() => onOpenUserPanel?.(user.uid)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        className="w-10 h-10 rounded-full border border-white/10"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                        <User className="w-5 h-5 text-zinc-500" />
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-zinc-600"} border-2 border-black rounded-full`}
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-white uppercase tracking-widest">
                      {user.userName}
                    </span>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase">
                      {isOnline ? "Dostępny" : "Offline"}
                    </span>
                  </div>
                </div>
                {isFriend ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const friend = friends.find((f) =>
                        f.uids.includes(user.uid),
                      );
                      if (friend) {
                        setSelectedChatId(friend.id);
                        setView("private_chat");
                      }
                    }}
                    className="text-gold hover:bg-gold/10 rounded-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Czat
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      CommunityService.sendFriendRequest(
                        auth.currentUser!.uid,
                        userName,
                        userAvatar || "",
                        user.uid,
                      )
                    }
                    className="text-white/50 hover:text-gold hover:bg-gold/10 rounded-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Zaproś
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderPrivateList = () => (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <span className="block text-xs font-black text-white uppercase tracking-widest">
          Twoi Znajomi
        </span>
        {friendRequests.length > 0 && (
          <button
            aria-label="Powiadomienia"
            onClick={() => setView("invitations")}
            className="flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full animate-pulse"
          >
            <Bell className="w-3 h-3 text-gold" />
            <span className="text-[8px] font-black text-gold uppercase tracking-widest">
              {friendRequests.length} nowe
            </span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
        {friends.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5">
              <UserPlus className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-center max-w-[200px]">
              Nie masz jeszcze żadnych znajomych. Skorzystaj z wyszukiwarki, aby
              kogoś zaprosić!
            </p>
            <Button
              onClick={() => setView("search")}
              className="bg-gold text-black rounded-full text-[9px] font-black uppercase tracking-widest px-6"
            >
              Szukaj Pielgrzymów
            </Button>
          </div>
        ) : (
          friends.map((friend) => {
            const otherUid = friend.uids.find(
              (u: string) => u !== auth.currentUser?.uid,
            );
            const isOnline = onlineUsers.some((u) => u.uid === otherUid);
            // In a real app, we'd fetch user details here or have them denormalized
            return (
              <div
                key={friend.id}
                onClick={() => {
                  setSelectedChatId(friend.id);
                  setView("private_chat");
                }}
                className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-gold/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                      <User className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-zinc-600"} border-2 border-black rounded-full`}
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-white uppercase tracking-widest group-hover:text-gold transition-colors">
                      Pielgrzym {otherUid?.slice(0, 5)}
                    </span>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase">
                      {isOnline ? "Dostępny" : "Niedostępny"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Zablokuj użytkownika"
                    onClick={(e) => {
                      e.stopPropagation();
                      CommunityService.blockUser(
                        auth.currentUser!.uid,
                        otherUid,
                      );
                    }}
                    className="text-zinc-600 hover:text-red-500 rounded-full w-8 h-8"
                  >
                    <Ban className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`flex flex-col ${fullHeight ? "h-full" : "h-[500px]"} bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view !== "lobby" && (
            <button
              aria-label="Ulubione"
              onClick={() => setView("lobby")}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gold" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              {view === "lobby"
                ? "Centrum Komunikacji"
                : view === "global"
                  ? "Społeczność Global"
                  : view === "all_users"
                    ? "Spis Pielgrzymów"
                    : "Czat Prywatny"}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onClose && (
            <Button
              aria-label="Zamknij czat"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-zinc-500 hover:text-white rounded-full"
            >
              <CloseIcon className="w-4 h-4" />
            </Button>
          )}
          {(view === "private_list" || view === "all_users") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setView(view === "private_list" ? "all_users" : "private_list")
              }
              className="text-[9px] font-black text-gold uppercase tracking-widest hover:bg-gold/10"
            >
              {view === "private_list" ? "Wszyscy Pielgrzymi" : "Twoi Znajomi"}
            </Button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
              System Aktywny
            </span>
          </div>
        </div>
      </div>

      {/* Status Bar (Only in chat views) */}
      {(view === "global" || view === "private_chat") && (
        <div className="px-6 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              {view === "global"
                ? "Połączono z Christian Culture Global"
                : `Rozmowa z ${selectedUser?.userName || "Pielgrzymem"}`}
            </span>
          </div>
          <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
            {view === "global" ? "Kanał: Global" : "Szyfrowanie: End-to-End"}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin relative flex flex-col">
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gold rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <ShieldCheck className="w-10 h-10 text-gold opacity-50 relative z-10" />
            </div>
            <div className="space-y-2">
              <span className="block text-sm font-black text-white uppercase tracking-[0.2em]">
                Wymagana Autoryzacja
              </span>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter leading-relaxed max-w-[200px]">
                Zaloguj się przez Google, aby dołączyć do rozmowy i dzielić się
                świadectwem.
              </p>
            </div>
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="bg-white text-black hover:bg-zinc-200 rounded-full px-10 py-7 font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <LogIn className="w-4 h-4 mr-3 relative z-10" />
              <span className="relative z-10">
                {isLoggingIn ? "Łączenie..." : "Zaloguj się przez Google"}
              </span>
            </Button>
          </div>
        ) : view === "lobby" ? (
          renderLobby()
        ) : view === "all_users" ? (
          renderAllUsers()
        ) : view === "search" ? (
          renderSearch()
        ) : view === "invitations" ? (
          renderInvitations()
        ) : view === "private_list" ? (
          renderPrivateList()
        ) : isLoading && view === "global" ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          </div>
        ) : view === "global" ? (
          messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Brak wiadomości. Bądź pierwszy!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.userId === auth.currentUser?.uid;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => onOpenUserPanel?.(msg.userId)}
                  >
                    {msg.userAvatar ? (
                      <img
                        src={msg.userAvatar}
                        alt={msg.userName}
                        className="w-8 h-8 rounded-full border border-gold/20 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}
                  >
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter mb-1 px-1">
                      {msg.userName}
                    </span>
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${
                        isMe
                          ? "bg-gold text-black font-medium rounded-tr-none"
                          : "bg-zinc-800 text-zinc-200 rounded-tl-none border border-white/5"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )
        ) : view === "private_chat" ? (
          privateMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Rozpocznij bezpieczną rozmowę
              </p>
            </div>
          ) : (
            privateMessages.map((msg) => {
              const isMe = msg.userId === auth.currentUser?.uid;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${
                        isMe
                          ? "bg-gold text-black font-medium rounded-tr-none"
                          : "bg-zinc-800 text-zinc-200 rounded-tl-none border border-white/5"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[7px] text-zinc-600">
                        {msg.timestamp?.toDate
                          ? new Date(msg.timestamp.toDate()).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )
                          : new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </span>
                      {isMe && (
                        <span className="text-[7px] text-zinc-500">
                          {msg.status === "sent"
                            ? "✓"
                            : msg.status === "delivered"
                              ? "✓✓"
                              : "✓✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5">
              <User className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-center">
              Moduł{" "}
              {view === "private_list"
                ? "Kontaktów"
                : view === "search"
                  ? "Wyszukiwania"
                  : "Prywatny"}{" "}
              w budowie...
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("lobby")}
              className="text-gold text-[9px] font-black uppercase tracking-widest"
            >
              Powrót do Lobby
            </Button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Only in chat views) */}
      {(view === "global" || view === "private_chat") && isAuthenticated && (
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-black/40 border-t border-white/5 flex flex-col gap-2"
        >
          {typingUsers.length > 0 && (
            <p className="text-[10px] text-zinc-500 italic px-2">
              {typingUsers.length === 1
                ? "Użytkownik pisze wiadomość..."
                : "Kilka osób pisze..."}
            </p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleNewMessageChange}
              placeholder="Napisz wiadomość..."
              aria-label="Wpisz wiadomość"
              className="flex-1 bg-zinc-900/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Wyślij wiadomość"
              disabled={!newMessage.trim() || isSending}
              className="bg-gold text-black hover:bg-gold/80 rounded-full w-10 h-10 flex-shrink-0 transition-all active:scale-90 disabled:opacity-50"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
