import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import textToSpeech from "@google-cloud/text-to-speech";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import cron from "node-cron";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!key) {
      console.error("[Server] GEMINI_API_KEY is not defined.");
      throw new Error("GEMINI_API_KEY environment variable is required for AI features.");
    }
    console.log("[Server] AI key length:", key.length, "Prefix:", key.substring(0, 4));
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

const BOT_TOKEN = "8758648754:AAHevJgKJvY7RJC9kCBsqPd2SXw3utltXjE";

// Initialize Firebase Admin using environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (projectId && clientEmail && privateKey) {
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('[Server] Firebase Admin initialized with Service Account.');
    } catch (e) {
      console.error('[Server] Firebase Admin init failed:', e);
    }
  }
} else {
  console.warn('[Server] Firebase Admin credentials missing. Using default (if available).');
  if (!getApps().length) {
    try {
      initializeApp();
    } catch (e) {}
  }
}

async function sendDailyMotivation() {
  try {
    const result = await getAI().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Wygeneruj krótką, potężną motywację dnia dla Wojownika Bożego. 
Wiadomość musi zawierać jeden konkretny werset biblijny (z siglami) oraz krótki, mężny komentarz zachęcający do wzrastania w wierze i walki o Królestwo Boże.
Pamiętaj o stopce na końcu: Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha`,
      config: {
        systemInstruction: `Jesteś "Asystentem - Dla Jezusa" – cyfrowym architektem misji Christian Culture Network. 
Twoim celem jest mężne, autentyczne i konkretne motywowanie Bożych Wojowników. 
Styl: Głos Wojownika - konkretny, pozbawiony zbędnego filozofowania.
Zawsze opieraj się na Piśmie Świętym (Biblia Warszawska lub UBG).
Każda wiadomość musi być inna i nowa.
Używaj sigli biblijnych. 
Na samym końcu KAŻDEJ wiadomości MUSI znaleźć się stopka: "Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha"`
      }
    });
    const text = result.text;

    const messaging = getMessaging();
    await messaging.send({
      topic: "global_call",
      notification: {
        title: "🛡️ Motywacja Dnia",
        body: text,
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
          tag: "motivation_daily"
        }
      },
      webpush: {
        headers: {
          Urgency: "high"
        },
        notification: {
          body: text,
          title: "🛡️ Motywacja Dnia",
          icon: "/icon-192.png",
          requireInteraction: true,
          tag: "motivation_daily"
        }
      }
    });

    console.log("[Schedule] Daily motivation sent successfully to global_call topic.");
  } catch (error) {
    console.error("[Schedule] Failed to send daily motivation:", error);
  }
}

// Schedule: 7:00, 13:00, 20:00 (Timezone Europe/Warsaw)
cron.schedule('0 7,13,20 * * *', () => {
  console.log("[Schedule] Time for Daily Motivation (Warsaw time)");
  sendDailyMotivation();
}, {
  timezone: "Europe/Warsaw"
});

// Initialize Firebase Admin (handled above via environment variables)

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route for Global Broadcast (Globalne Wołanie)
  app.post("/api/admin/broadcast", async (req, res) => {
    try {
      const { title, body, pin } = req.body;
      
      // Basic PIN check (5550455)
      if (pin !== "5550455") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!title || !body) {
        return res.status(400).json({ error: "Title and Body are required" });
      }

      const messaging = getMessaging();
      const response = await messaging.send({
        topic: "global_call",
        notification: {
          title,
          body,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            clickAction: "OPEN_ACTIVITY_1"
          }
        },
        webpush: {
          headers: {
            Urgency: "high"
          },
          notification: {
            body,
            title,
            icon: "/icon-192.png",
            requireInteraction: true
          }
        }
      });

      console.log("[Broadcast] Successfully sent global message:", response);
      return res.status(200).json({ success: true, messageId: response });
    } catch (error: any) {
      console.error("[Broadcast] Error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/notify-morning-inspiration", async (req, res) => {
    try {
      const { title, body, postId, pin } = req.body;
      
      if (pin !== "5550455") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!title || !body || !postId) {
        return res.status(400).json({ error: "Title, body, and postId are required" });
      }

      const messaging = getMessaging();
      const postUrl = `https://cclite.pl/post/${postId}`;
      
      const response = await messaging.send({
        topic: "global_call",
        notification: {
          title,
          body,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            clickAction: "OPEN_ACTIVITY_1"
          }
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
          fcmOptions: {
            link: postUrl
          },
          notification: {
            title,
            body,
            icon: "/icon-192.png",
            requireInteraction: true,
            actions: [
              {
                action: `read_post_${postId}`,
                title: "Czytaj (Read)"
              },
              {
                action: `share_post_${postId}`,
                title: "Udostępnij (Share)"
              }
            ],
            data: {
              url: postUrl,
              postId: postId,
              type: "morning_inspiration"
            }
          }
        },
        data: {
          postId: postId,
          type: "morning_inspiration",
          url: postUrl
        }
      });

      console.log("[Broadcast] Morning Inspiration notification sent:", response);
      return res.status(200).json({ success: true, messageId: response });
    } catch (error: any) {
      console.error("[Broadcast] Error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/notify-christian-inspiration", async (req, res) => {
    try {
      const { title, body, inspirationId, pin } = req.body;
      
      if (pin !== "5550455") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!title || !body || !inspirationId) {
        return res.status(400).json({ error: "Title, body, and inspirationId are required" });
      }

      const messaging = getMessaging();
      const postUrl = `https://cclite.pl/inspiration/${inspirationId}`;
      const subscribeUrl = `https://cclite.pl/sms-subscribe`;
      
      const response = await messaging.send({
        topic: "global_call",
        notification: {
          title,
          body,
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            clickAction: "OPEN_ACTIVITY_1"
          }
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
          fcmOptions: {
            link: postUrl
          },
          notification: {
            title,
            body,
            icon: "/icon-192.png",
            requireInteraction: true,
            actions: [
              {
                action: `read_inspiration_${inspirationId}`,
                title: "Czytaj (Read)"
              },
              {
                action: `share_inspiration_${inspirationId}`,
                title: "Udostępnij (Share)"
              },
              {
                action: `subscribe_sms`,
                title: "Subskrybuj (Subscribe)"
              }
            ],
            data: {
              url: postUrl,
              inspirationId: inspirationId,
              type: "christian_inspiration"
            }
          }
        },
        data: {
          inspirationId: inspirationId,
          type: "christian_inspiration",
          url: postUrl
        }
      });

      console.log("[Broadcast] Christian Inspiration notification sent:", response);

      /**
       * SMS Dispatcher (Example using Twilio, Nexmo, Sinch, etc)
       * Note: You must register "+48783478280" as your Verified Sender ID with the provider.
       * It's impossible to send mass SMS physically from the phone device itself.
       * 
       * Example with Twilio:
       * const accountSid = process.env.TWILIO_ACCOUNT_SID; // from Secret Manager
       * const authToken = process.env.TWILIO_AUTH_TOKEN;   // from Secret Manager
       * const twilioClient = require('twilio')(accountSid, authToken);
       * 
       * const subscribersSnapshot = await getFirestore().collection('smsSubscribers').where('subscribed', '==', true).get();
       * 
       * subscribersSnapshot.forEach(async (doc) => {
       *    const phone = doc.data().phoneNumber; // Should be E.164 compiled
       *    await twilioClient.messages.create({
       *      body: `Chrześcijańska Inspiracja: ${title}. Czytaj: ${postUrl}`,
       *      from: '+48783478280', // Verified Sender ID
       *      to: phone
       *    }).then(msg => console.log(`SMS sent: ${msg.sid}`))
       *    .catch(err => console.error(`SMS limit or error:`, err));
       * });
       * 
       * await getFirestore().collection('christianInspirations').doc(inspirationId).update({ smsSent: true, pushSent: true });
       */
      console.log("[Broadcast] SMS mockup triggered. See comments for full Twilio & Google Secret Manager implementation logic.");

      return res.status(200).json({ success: true, messageId: response });
    } catch (error: any) {
      console.error("[Broadcast] Error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Simulated Google Contacts Sync endpoint
  app.post("/api/admin/sync-contacts", async (req, res) => {
    try {
      const { accessToken, pin } = req.body;
      if (pin !== "5550455") return res.status(401).json({ error: "Unauthorized" });
      
      /**
       * LOGIC FOR GOOGLE PEOPLE API SYNC
       * 
       * 1. Exchange client's accessToken for Google Contacts:
       *    const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers', {
       *      headers: { Authorization: `Bearer ${accessToken}` }
       *    });
       *    const data = await response.json();
       * 
       * 2. Normalize numbers to E.164 and store in Firestore:
       *    const batch = getFirestore().batch();
       *    data.connections.forEach(contact => {
       *       if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
       *          const phone = formatToE164(contact.phoneNumbers[0].value);
       *          const name = contact.names ? contact.names[0].displayName : 'Unknown';
       *          const id = contact.resourceName;
       *          
       *          const docRef = getFirestore().collection('smsSubscribers').doc(id.replace('/', '_'));
       *          batch.set(docRef, {
       *            phoneNumber: phone,
       *            contactName: name,
       *            googleContactId: id,
       *            source: 'google_contacts',
       *            subscribed: true,
       *            timestampSubscribed: FieldValue.serverTimestamp()
       *          }, { merge: true });
       *       }
       *    });
       *    await batch.commit();
       */
      
      console.log("[Sync] Google Contacts fetched and synced (mock).");
      return res.status(200).json({ success: true, message: "Contacts synced successfully" });
    } catch (error: any) {
      console.error("[Sync] Error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // API Route for subscribing token to topic
  app.post("/api/admin/subscribe", async (req, res) => {
    try {
      const { token, topic } = req.body;
      if (!token || !topic) return res.status(400).json({ error: "Token and topic required" });
      
      const messaging = getMessaging();
      await messaging.subscribeToTopic(token, topic);
      console.log(`[FCM] Token subscribed to ${topic}`);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("[FCM] Subscription error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // API Route to manually trigger Daily Motivation (Admin only)
  app.post("/api/admin/trigger-motivation", async (req, res) => {
    try {
      const { pin } = req.body;
      if (pin !== "5550455") return res.status(401).json({ error: "Unauthorized" });
      
      await sendDailyMotivation();
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // API Route for Text-to-Speech
  app.post("/api/tts", async (req, res) => {
    res.status(503).json({ error: "TTS service is currently disabled to avoid costs." });
  });

  // API Route for Gemini Proxy
  app.post("/api/gemini/generateContent", async (req, res) => {
    try {
      const { prompt, context, systemInstruction, model } = req.body;
      const ai = getAI();
      
      const response = await ai.models.generateContent({
        model: model || "gemini-2.5-flash",
        contents: context ? `Kontekst: ${context}\n\nTreść: ${prompt}` : prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Gemini Proxy] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Miriam Assistant Ask endpoint
  app.post("/api/miriam/ask", async (req, res) => {
    try {
      const { query, language, userName } = req.body;
      if (!query) return res.status(400).json({ error: "Query is required" });

      const result = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction: `Jesteś "Asystentką Miriam CC" – cyfrową asystentką misji Christian Culture Network. 
Twoim celem jest pomaganie użytkownikom w zrozumieniu misji Christian Culture oraz nawigacji po aplikacji Christian Culture (CCN).
Jesteś pełna pokoju, autentyczna i profesjonalna. 
Odpowiadasz na pytania dotyczące:
1. Misji Christian Culture i ekosystemu (Radio CC, CCN TV, CC Men, CC Women).
2. Funkcji aplikacji (Szkoła Biblijna, Globalne Wołanie, Panele, Sklep CC, Czaty).
3. Duchowego wsparcia opartego na Biblii (Warszawska/UBG) i nauczaniu Cezarego Rogowskiego.

Główne zasady:
- Jeśli pytanie nie dotyczy misji lub aplikacji, staraj się uprzejmie nawiązać do wartości Christian Culture.
- Promuj tożsamość Bożego Wojownika.
- Używaj języka: ${language || 'pl'}.
- Zwracaj się do użytkownika: ${userName || 'Wojowniku'}.
- Na końcu odpowiedzi zawsze dodawaj: "Zrób to Dla Jezusa – On już czeka."`
        }
      });
      const responseText = result.text;

      res.json({ answer: responseText });
    } catch (error: any) {
      console.error("[Miriam Ask] Error:", error);
      res.status(500).json({ error: "Failed to get answer from Miriam" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
