import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

const STORE_CONTEXT = `
You are AURA Concierge, the AI customer support specialist for AURA — a contemporary boutique store specializing in luxury acoustic hardware, titanium smart wearables, artisanal stoneware, and fine leather goods.

Store Catalog & Inventory:
1. AURA Studio Pro Wireless Headphones ($349) - 40mm biocellulose planar drivers, Hybrid ANC, 45-hour battery, Italian lambskin cushions. Stock: 18 units in stock.
2. Chronos Titanium Horizon Smartwatch ($495) - Grade 5 aerospace titanium, Sapphire AMOLED 1800 nits, 14-day battery, ECG and SpO2 telemetry. Stock: 7 units (Low stock).
3. Atelier Raw Sand Ceramic Tumbler ($48) - Hand-thrown stoneware, dual-wall thermal ceramic, 350ml, raw sand glaze. Stock: 34 units in stock.
4. Vachetta Minimalist Leather Bifold ($95) - Tuscan vegetable-tanned full-grain leather, solid brass badge, RFID blocking. Stock: 22 units in stock.
5. AURA Linear Desk Mat & Wireless Pad ($78) - Merino-blend felt with natural cork, built-in 15W Qi wireless charger. Stock: 40 units in stock.
6. Solace Soundbar One Acoustic Bar ($420) - Dolby Atmos spatial sound, acoustic Kvadrat wool fabric, HDMI eARC. Stock: 12 units in stock.

Store Policies:
- Free Express Delivery on orders over $150 (delivered within 1-2 business days).
- 30-Day Hassle-Free Returns: Full refunds to original payment method. Pre-paid QR return labels provided.
- 2-Year Full Hardware Replacement Warranty on all electronic audio and wearables.
- Available Discounts: 'WELCOME10' for 10% off orders over $50; 'FREESHIP' for free priority shipping on any order.
- Accepted Payments: Visa, Mastercard, AMEX (processed via Stripe), Apple Pay, Google Pay, and Cash on Delivery (COD).

Demo Orders in System:
- Order #ORD-89210: Status 'Out for Delivery' via Aura Express Courier. Driver Marcus Chen is 4 stops away (~24 mins). Contains 1x AURA Studio Pro Headphones + 2x Ceramic Tumblers.
- Order #ORD-76341: Status 'Delivered' on Nov 02 to Eleanor Vance in Portland. Contains 1x Chronos Titanium Horizon Smartwatch.

Instructions for your response:
- Answer with warmth, expertise, and precision.
- If a user asks about order tracking, ask for their Order ID or look up ORD-89210 / ORD-76341 if mentioned.
- If a user asks for recommendations, ask about their style or recommend items that pair nicely (e.g., Studio Headphones with the Linear Desk Mat).
- Keep replies clean, elegant, and under 3 concise paragraphs.
`;

// AI Support Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message text is required.' });
    return;
  }

  // If Gemini API is available, call gemini-2.5-flash
  if (aiClient) {
    try {
      // Build conversation context
      const chat = aiClient.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: STORE_CONTEXT,
        },
      });

      const response = await chat.sendMessage({
        message: message,
      });

      const replyText = response.text || 'I am here to help you with your order, product specifications, or return questions.';
      res.json({ reply: replyText });
      return;
    } catch (err: any) {
      console.error('Error invoking Gemini 2.5 Flash:', err);
      // Fall through to smart intelligent simulation fallback
    }
  }

  // Resilient Concierge Fallback when API key is not configured or during offline testing
  const query = message.toLowerCase();
  let fallbackReply = "I'd be delighted to assist you with our collection, order tracking, or boutique policies.";

  if (query.includes('ord-89210') || (query.includes('where') && query.includes('order'))) {
    fallbackReply = "Order **#ORD-89210** is currently **Out for Delivery** with Aura Express Courier! Driver **Marcus Chen** in an electric Mercedes eVito is approximately 4 stops away with an ETA of ~20 minutes. You can also view live delivery telemetry in the Track Order tab.";
  } else if (query.includes('ord-76341')) {
    fallbackReply = "Order **#ORD-76341** was safely **Delivered** to your residence on Nov 02. The package was signed for and confirmed. Let us know if you need an invoice or wish to arrange an exchange.";
  } else if (query.includes('track') || query.includes('status')) {
    fallbackReply = "You can track any order in real time! Simply provide your Order ID (such as #ORD-89210), or click the **Track Order** tab at the top of the store to watch your courier's live route progress.";
  } else if (query.includes('return') || query.includes('refund') || query.includes('warranty')) {
    fallbackReply = "We offer a **30-day complimentary return window** with zero restocking fees. Every order includes a prepaid digital return label. Additionally, all audio hardware and wearables are protected under our **2-Year AURA Complete Replacement Warranty**.";
  } else if (query.includes('discount') || query.includes('coupon') || query.includes('promo')) {
    fallbackReply = "You can apply **WELCOME10** at checkout for 10% off your first purchase, or use **FREESHIP** for complimentary express delivery on any order size.";
  } else if (query.includes('headphone') || query.includes('sound') || query.includes('audio')) {
    fallbackReply = "Our flagship **AURA Studio Pro Headphones ($349)** are in stock with 18 units remaining. They feature 40mm biocellulose planar drivers, hybrid ANC, 45 hours of battery life, and ultra-plush Italian lambskin ear cushions.";
  } else if (query.includes('watch') || query.includes('chronos') || query.includes('wearable')) {
    fallbackReply = "The **Chronos Titanium Horizon Smartwatch ($495)** is currently in limited stock (only 7 units left). It is milled from Grade 5 aerospace titanium with an 1,800-nit sapphire crystal display and 14-day battery life.";
  } else if (query.includes('recommend') || query.includes('gift')) {
    fallbackReply = "For everyday lifestyle elevation, our most loved duo is the **Atelier Raw Sand Ceramic Tumbler ($48)** paired with the **AURA Linear Desk Mat ($78)** with its integrated wireless charging coil. Or for audiophiles, nothing compares to the **AURA Studio Pro**.";
  } else {
    fallbackReply = `Thank you for contacting AURA Concierge. Whether you need assistance tracking a shipment, configuring specs for the Chronos Smartwatch or Studio Headphones, or applying promotional coupons, I am at your service. How may I assist you today?`;
  }

  res.json({ reply: fallbackReply });
});

// Store configuration info endpoint
app.get('/api/store-config', (_req: Request, res: Response) => {
  res.json({
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasSupabase: Boolean(process.env.VITE_SUPABASE_URL && !process.env.VITE_SUPABASE_URL.includes('your-project-ref')),
    hasStripeKey: Boolean(process.env.VITE_STRIPE_PUBLISHABLE_KEY && !process.env.VITE_STRIPE_PUBLISHABLE_KEY.includes('your_stripe')),
    currency: 'USD',
    storeName: 'AURA Contemporary Commerce'
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (dev: ${isDev})`);
  });
}

startServer();
