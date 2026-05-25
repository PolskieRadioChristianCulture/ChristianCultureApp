
// Scripts for firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBDuwM3vB5elVsTgFw6xKkwbqEUCT--h7c",
  authDomain: "gen-lang-client-0094354839.firebaseapp.com",
  projectId: "gen-lang-client-0094354839",
  storageBucket: "gen-lang-client-0094354839.firebasestorage.app",
  messagingSenderId: "553245611022",
  appId: "1:553245611022:web:5ae303f1fe0d6d16f8985f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  
  // Extract custom actions and data to show them in the notification
  const data = payload.data || {};
  let actions = [];
  if (data.type === 'morning_inspiration' && data.postId) {
    actions = [
      { action: `read_post_${data.postId}`, title: 'Czytaj' },
      { action: `share_post_${data.postId}`, title: 'Udostępnij' }
    ];
  } else if (data.type === 'christian_inspiration' && data.inspirationId) {
    actions = [
      { action: `read_inspiration_${data.inspirationId}`, title: 'Czytaj' },
      { action: `share_inspiration_${data.inspirationId}`, title: 'Udostępnij' },
      { action: `subscribe_sms`, title: 'Subskrybuj' }
    ];
  }

  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    data: data,
    actions: actions.length > 0 ? actions : undefined,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  // if the notification was from Morning Inspiration
  if (data.type === 'morning_inspiration' && data.postId) {
    const postUrl = `https://cclite.pl/post/${data.postId}`;

    if (action.startsWith('share_post_')) {
      // Just focus or open window, passing intent to share
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
          let foundClient = false;
          for (let client of windowClients) {
            if (client.url.includes('cclite.pl') || client.url.includes(self.location.origin)) {
              client.postMessage({ type: 'SHARE_MORNING_INSPIRATION', postId: data.postId });
              foundClient = true;
              return client.focus();
            }
          }
          if (!foundClient) {
             return clients.openWindow(postUrl + '?action=share');
          }
        })
      );
    } else {
      // Default: Read (open the modal)
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
          let foundClient = false;
          for (let client of windowClients) {
            if (client.url.includes('cclite.pl') || client.url.includes(self.location.origin)) {
              client.postMessage({ type: 'OPEN_MORNING_INSPIRATION', postId: data.postId });
              foundClient = true;
              return client.focus();
            }
          }
          if (!foundClient) {
             return clients.openWindow(postUrl);
          }
        })
      );
    }
  } else if (data.type === 'christian_inspiration' && data.inspirationId) {
    const postUrl = `https://cclite.pl/inspiration/${data.inspirationId}`;

    if (action.startsWith('share_inspiration_')) {
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
          let foundClient = false;
          for (let client of windowClients) {
            if (client.url.includes('cclite.pl') || client.url.includes(self.location.origin)) {
              client.postMessage({ type: 'SHARE_CHRISTIAN_INSPIRATION', inspirationId: data.inspirationId });
              foundClient = true;
              return client.focus();
            }
          }
          if (!foundClient) {
             return clients.openWindow(postUrl + '?action=share');
          }
        })
      );
    } else if (action === 'subscribe_sms') {
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
          let foundClient = false;
          for (let client of windowClients) {
            if (client.url.includes('cclite.pl') || client.url.includes(self.location.origin)) {
              client.postMessage({ type: 'SUBSCRIBE_SMS' });
              foundClient = true;
              return client.focus();
            }
          }
          if (!foundClient) {
             return clients.openWindow(self.location.origin + '?action=subscribe_sms');
          }
        })
      );
    } else {
      // Default: Read
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
          let foundClient = false;
          for (let client of windowClients) {
            if (client.url.includes('cclite.pl') || client.url.includes(self.location.origin)) {
              client.postMessage({ type: 'OPEN_CHRISTIAN_INSPIRATION', inspirationId: data.inspirationId });
              foundClient = true;
              return client.focus();
            }
          }
          if (!foundClient) {
             return clients.openWindow(postUrl);
          }
        })
      );
    }
  } else {
     // Default fallback
     event.waitUntil(
       clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
         for (let client of windowClients) {
           if (client.url.includes(self.location.origin)) {
             return client.focus();
           }
         }
         return clients.openWindow(self.location.origin);
       })
     );
  }
});
