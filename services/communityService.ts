import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  Timestamp,
  getDoc,
  getDocs,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { LiveUser, PrayerIntention, Post } from '../types';

export const CommunityService = {
  subscribeToDailyRadioStats: (dateId: string, callback: (clicks: number) => void) => {
    try {
      if (!db) return () => {};
      const statsRef = doc(db, 'radio_stats', dateId);
      return onSnapshot(statsRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().totalClicks) {
          callback(docSnap.data().totalClicks);
        } else {
          callback(0);
        }
      }, (error) => {
        console.error('Błąd subskrypcji radio_stats:', error);
      });
    } catch (e) {
      console.error(e);
      return () => {};
    }
  },

  incrementDailyRadioStats: async (dateId: string) => {
    try {
      if (!db) return;
      const statsRef = doc(db, 'radio_stats', dateId);
      await setDoc(statsRef, { totalClicks: increment(1) }, { merge: true });
    } catch (error) {
      console.error('Błąd inkrementacji radio_stats:', error);
    }
  },

  updatePresence: async (uid: string, userName?: string, activeStream?: string, isPraying?: boolean) => {
    if (!uid) return;
    const presenceRef = doc(db, 'live_presence', uid);
    try {
      const payload: any = {
        uid,
        userName: userName || 'Anonim',
        lastSeen: new Date().toISOString(),
        activeStream: activeStream || 'none',
        isPraying: !!isPraying
      };
      await setDoc(presenceRef, payload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `live_presence/${uid}`);
    }
  },

  subscribeToLivePresence: (callback: (users: LiveUser[]) => void) => {
    const q = query(collection(db, 'live_presence'), orderBy('lastSeen', 'desc'), limit(100));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as LiveUser);
      // Filter out users who haven't been seen in the last 1 minute
      const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
      const activeUsers = users.filter(u => new Date(u.lastSeen) > oneMinuteAgo);
      callback(activeUsers);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'live_presence');
    });
  },

  addIntention: async (userId: string, userName: string, text: string) => {
    try {
      const intentionRef = collection(db, 'prayer_intentions');
      await addDoc(intentionRef, {
        userId,
        userName,
        text,
        createdAt: new Date().toISOString(),
        prayerCount: 0
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'prayer_intentions');
    }
  },

  subscribeToIntentions: (callback: (intentions: PrayerIntention[]) => void) => {
    const q = query(collection(db, 'prayer_intentions'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const intentions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerIntention));
      callback(intentions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'prayer_intentions');
    });
  },

  deleteIntention: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'prayer_intentions', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prayer_intentions/${id}`);
    }
  },

  updateIntention: async (id: string, text: string) => {
    try {
      await updateDoc(doc(db, 'prayer_intentions', id), { text });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `prayer_intentions/${id}`);
    }
  },

  incrementPrayerCount: async (intentionId: string) => {
    const intentionRef = doc(db, 'prayer_intentions', intentionId);
    try {
      await updateDoc(intentionRef, {
        prayerCount: increment(1)
      });
    } catch (error: any) {
      console.warn(`Could not increment prayer count for ${intentionId}:`, error.message);
    }
  },

  subscribeToGlobalCounters: (callback: (counters: Record<string, number>) => void) => {
    const countersRef = doc(db, 'counters', 'global_intentions');
    return onSnapshot(countersRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data() as Record<string, number>);
      } else {
        callback({});
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'counters/global_intentions');
    });
  },

  incrementGlobalCounter: async (intentionId: string) => {
    // 1. Optymistyczna dystrybucja zdarzenia do natychmiastowego UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('local-amen-increment', { detail: { intentionId } }));
    }

    const countersRef = doc(db, 'counters', 'global_intentions');
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
    
    try {
      // Increment both specific daily counter and general intention counter
      await setDoc(countersRef, {
        [intentionId]: increment(1),
        [`${intentionId}_${today}`]: increment(1),
        lastUpdate: serverTimestamp()
      }, { merge: true });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, 'counters/global_intentions');
    }
  },

  // User Posts (Public Cards)
  addPost: async (userId: string, userName: string, text: string, imageUrl?: string) => {
    try {
      const postsRef = collection(db, 'user_posts');
      await addDoc(postsRef, {
        authorUid: userId,
        userName,
        text,
        imageUrl: imageUrl || null,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'user_posts');
    }
  },

  deletePost: async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'user_posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `user_posts/${postId}`);
    }
  },

  subscribeToUserPosts: (userId: string, callback: (posts: any[]) => void) => {
    const q = query(
      collection(db, 'user_posts'), 
      where('authorUid', '==', userId),
      orderBy('createdAt', 'desc'), 
      limit(20)
    );
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(posts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'user_posts');
    });
  },

  // Social Features
  sendFriendRequest: async (fromId: string, fromName: string, fromAvatar: string, toId: string) => {
    const requestId = `${fromId}_${toId}`;
    const requestRef = doc(db, 'friend_requests', requestId);
    try {
      await setDoc(requestRef, {
        fromId,
        fromName,
        fromAvatar,
        toId,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `friend_requests/${requestId}`);
    }
  },

  respondToFriendRequest: async (requestId: string, status: 'accepted' | 'rejected') => {
    const requestRef = doc(db, 'friend_requests', requestId);
    try {
      if (status === 'accepted') {
        const snap = await getDoc(requestRef);
        if (snap.exists()) {
          const data = snap.data();
          const uids = [data.fromId, data.toId].sort();
          const friendshipId = uids.join('_');
          
          // Create friendship
          await setDoc(doc(db, 'friends', friendshipId), {
            uids,
            since: new Date().toISOString()
          });
        }
      }
      await updateDoc(requestRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `friend_requests/${requestId}`);
    }
  },

  blockUser: async (blockerId: string, blockedId: string) => {
    const blockId = `${blockerId}_${blockedId}`;
    const blockRef = doc(db, 'blocks', blockId);
    try {
      await setDoc(blockRef, {
        blockerId,
        blockedId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `blocks/${blockId}`);
    }
  },

  unblockUser: async (blockerId: string, blockedId: string) => {
    const blockId = `${blockerId}_${blockedId}`;
    const blockRef = doc(db, 'blocks', blockId);
    try {
      await deleteDoc(blockRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blocks/${blockId}`);
    }
  },

  searchUsers: async (searchTerm: string) => {
    const q = query(
      collection(db, 'users'),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(20)
    );
    try {
      const snap = await getDocs(q);
      return snap.docs.map(doc => doc.data() as LiveUser);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
      return [];
    }
  },

  getAllUsers: async (limitCount: number = 50) => {
    const q = query(
      collection(db, 'users'),
      orderBy('name', 'asc'),
      limit(limitCount)
    );
    try {
      const snap = await getDocs(q);
      return snap.docs.map(doc => doc.data() as LiveUser);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
      return [];
    }
  },

  subscribeToFriendRequests: (userId: string, callback: (requests: any[]) => void) => {
    const q = query(
      collection(db, 'friend_requests'),
      where('toId', '==', userId),
      where('status', '==', 'pending')
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'friend_requests');
    });
  },

  subscribeToFriends: (userId: string, callback: (friends: any[]) => void) => {
    const q = query(
      collection(db, 'friends'),
      where('uids', 'array-contains', userId)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'friends');
    });
  },

  subscribeToPrivateMessages: (chatId: string, callback: (messages: any[]) => void) => {
    const q = query(
      collection(db, 'private_chats', chatId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `private_chats/${chatId}/messages`);
    });
  },

  setTypingStatus: async (chatId: string, userId: string, isTyping: boolean) => {
    const typingRef = doc(db, 'private_chats', chatId, 'typing', userId);
    try {
      if (isTyping) {
        await setDoc(typingRef, { timestamp: serverTimestamp() });
      } else {
        await deleteDoc(typingRef);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `private_chats/${chatId}/typing/${userId}`);
    }
  },

  subscribeToTyping: (chatId: string, callback: (typingUsers: string[]) => void) => {
    const typingRef = collection(db, 'private_chats', chatId, 'typing');
    return onSnapshot(typingRef, (snap) => {
      callback(snap.docs.map(doc => doc.id));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `private_chats/${chatId}/typing`);
    });
  },

  updateMessageStatus: async (chatId: string, messageId: string, status: 'delivered' | 'read') => {
    const messageRef = doc(db, 'private_chats', chatId, 'messages', messageId);
    try {
      await updateDoc(messageRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `private_chats/${chatId}/messages/${messageId}`);
    }
  },

  editMessage: async (chatId: string, messageId: string, newText: string) => {
    const messageRef = doc(db, 'private_chats', chatId, 'messages', messageId);
    try {
      await updateDoc(messageRef, { text: newText, isEdited: true, editedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `private_chats/${chatId}/messages/${messageId}`);
    }
  },

  deleteMessage: async (chatId: string, messageId: string) => {
    const messageRef = doc(db, 'private_chats', chatId, 'messages', messageId);
    try {
      await updateDoc(messageRef, { isDeleted: true, deletedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `private_chats/${chatId}/messages/${messageId}`);
    }
  },

  createPost: async (userId: string, userName: string, userAvatar: string, content: string) => {
    try {
      const postsRef = collection(db, 'posts');
      await addDoc(postsRef, {
        userId,
        userName,
        userAvatar,
        content,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  },

  subscribeToPosts: (userId: string, callback: (posts: Post[]) => void) => {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });
  },

  getUserProfile: async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      return null;
    }
  },

  checkRelationshipStatus: async (uid1: string, uid2: string) => {
    try {
      // Check friends
      const uids = [uid1, uid2].sort();
      const friendshipId = uids.join('_');
      const friendSnap = await getDoc(doc(db, 'friends', friendshipId));
      if (friendSnap.exists()) return { status: 'friends' };

      // Check pending request
      const requestId1 = `${uid1}_${uid2}`;
      const requestSnap1 = await getDoc(doc(db, 'friend_requests', requestId1));
      if (requestSnap1.exists() && requestSnap1.data().status === 'pending') return { status: 'pending_sent', requestId: requestId1 };

      const requestId2 = `${uid2}_${uid1}`;
      const requestSnap2 = await getDoc(doc(db, 'friend_requests', requestId2));
      if (requestSnap2.exists() && requestSnap2.data().status === 'pending') return { status: 'pending_received', requestId: requestId2 };

      return { status: 'none' };
    } catch (error) {
      console.error('Error checking relationship:', error);
      return { status: 'none' };
    }
  }
};
