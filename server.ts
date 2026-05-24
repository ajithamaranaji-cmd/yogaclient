import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

// Razorpay Configuration
let razorpayClient: any = null;

function getRazorpay() {
  if (!razorpayClient) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables via the Settings menu.');
    }

    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayClient;
}

let stripeClient: Stripe | null = null;

function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2025-01-27-acacia' as any,
    });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Yogaclientflow - 1 Month Access Pass',
                description: 'Unlock full expert details and direct messaging for 30 days',
              },
              unit_amount: 1900, // $19.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/checkout/success`,
        cancel_url: `${req.headers.origin}/search`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      console.error('Stripe error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Razorpay Routes
  app.post('/api/razorpay/create-order', async (req, res) => {
    const { amount, currency = 'INR', receipt = 'receipt_1' } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Minimum amount is 100 paise' });
    }

    try {
      const razorpay = getRazorpay();
      const options = {
        amount: Math.round(amount), // amount in the smallest currency unit
        currency: currency,
        receipt: receipt,
      };

      const order = await razorpay.orders.create(options);
      res.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (err: any) {
      console.error('Razorpay create order error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/razorpay/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    try {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error('Razorpay secret not configured');
      }

      const generated_signature = crypto
        .createHmac('sha256', keySecret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature === razorpay_signature) {
        // Payment is verified
        res.json({ status: 'success', message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
      }
    } catch (err: any) {
      console.error('Razorpay verify error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
