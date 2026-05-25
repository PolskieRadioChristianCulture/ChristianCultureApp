import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();

// Access Stripe Secret from Firebase Envs (requires Blaze plan or local emulator setup)
// Use process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

export const createStripeCheckout = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { amount, currency, title } = request.data;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      mode: 'payment',
      success_url: 'https://cclite.pl/success',
      cancel_url: 'https://cclite.pl/cancel',
      line_items: [
        {
          price_data: {
            currency: currency || 'pln',
            product_data: {
              name: title || 'Wsparcie Christian Culture',
            },
            unit_amount: amount || 5000, // Amount in gr (50.00 PLN by default)
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: request.auth.uid,
      }
    });

    return { id: session.id, url: session.url };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
