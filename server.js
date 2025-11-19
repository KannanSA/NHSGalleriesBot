// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

// Only load dotenv in non-production (Vercel uses environment variables)
if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the static frontend (index.html + assets) from this directory
app.use(express.static(__dirname));

// Set up OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up Google Sheets
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let sheetsClient = null;
if (GOOGLE_SHEETS_ID && GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY) {
  try {
    const auth = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    sheetsClient = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets integration enabled');
  } catch (err) {
    console.error('Failed to initialize Google Sheets:', err.message);
  }
} else {
  console.log('Google Sheets integration disabled (missing credentials)');
}

async function saveChatToSheets(data) {
  if (!sheetsClient || !GOOGLE_SHEETS_ID) {
    console.log('Skipping Google Sheets save (not configured)');
    return;
  }

  try {
    const timestamp = new Date().toISOString();
    const phq9Total = (data.phq9 || []).reduce((s, n) => s + (n || 0), 0);
    const gad7Total = (data.gad7 || []).reduce((s, n) => s + (n || 0), 0);

    const row = [
      timestamp,
      data.sessionId || '',
      data.ageOver18 ? 'Yes' : 'No',
      data.risk?.q1 ? 'Yes' : 'No',
      data.risk?.q2 ? 'Yes' : 'No',
      data.risk?.q3 ? 'Yes' : 'No',
      data.ice?.story || '',
      data.ice?.ideas || '',
      data.ice?.concerns || '',
      data.ice?.expectations || '',
      data.history?.duration || '',
      data.history?.triggers || '',
      data.history?.impact || '',
      data.history?.support || '',
      data.history?.substances || '',
      phq9Total,
      data.phq9Impact || '',
      gad7Total,
      data.gad7Impact || '',
      JSON.stringify(data.avatarChatHistory || [])
    ];

    console.log('Attempting to save to Google Sheets, session:', data.sessionId);

    const result = await sheetsClient.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Sheet1!A:T',
      valueInputOption: 'RAW',
      resource: {
        values: [row]
      }
    });

    console.log('Chat data saved to Google Sheets successfully. Updated range:', result.data.updates.updatedRange);
  } catch (err) {
    console.error('Error saving to Google Sheets:', err.message);
    if (err.response) {
      console.error('Response error:', err.response.data);
    }
    throw err;
  }
}

// Helper to clamp text length
function clampText(text, max = 2000) {
  if (!text) return "";
  const s = text.toString();
  return s.length > max ? s.slice(0, max) : s;
}

app.post("/api/save-chat", async (req, res) => {
  try {
    const { data } = req.body || {};
    if (!data) {
      return res.status(400).json({ error: "data is required" });
    }

    await saveChatToSheets(data);
    res.json({ success: true });
  } catch (err) {
    console.error("Save chat error:", err);
    res.status(500).json({ error: "Failed to save chat data" });
  }
});

app.post("/api/chatgpt", async (req, res) => {
  try {
    const { context, history, userMessage } = req.body || {};
    if (!userMessage) {
      return res.status(400).json({ error: "userMessage is required" });
    }

    const messages = [];

    messages.push({
      role: "system",
      content:
        "You are a calm, supportive virtual GP-style assistant talking about common mental health problems in adults " +
        "(stress, mild to moderate anxiety and depression) in a primary care setting. You are NOT a real doctor, " +
        "you cannot diagnose, and you must not give emergency or crisis care. You must ALWAYS:\n" +
        "• Encourage users to contact their GP or local health services for diagnosis and treatment.\n" +
        "• Advise urgent help (emergency services / crisis team / out-of-hours GP) if they mention active suicidal thoughts, " +
        "self-harm, harming others, or feeling very physically unwell.\n" +
        "• Avoid specific medication doses or changes; instead, say this must be decided with their doctor.\n" +
        "• Keep language simple, kind, and validating.\n" +
        "If you detect self-harm, suicide, or harming others, immediately stop giving self-help tips, do NOT provide instructions, " +
        "and instead focus on crisis signposting only.",
    });

    if (context) {
      messages.push({
        role: "system",
        content: clampText(
          "Background clinical context from a structured intake: " + context,
          2500
        ),
      });
    }

    if (Array.isArray(history)) {
      for (const m of history) {
        if (!m || !m.role || !m.content) continue;
        if (m.role !== "user" && m.role !== "assistant") continue;
        messages.push({
          role: m.role,
          content: clampText(m.content),
        });
      }
    }

    messages.push({
      role: "user",
      content: clampText(userMessage),
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cost-effective model
      messages,
      temperature: 0.4,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content || "";
    res.json({ reply });
  } catch (err) {
    console.error("ChatGPT error:", err);
    res.status(500).json({ error: "ChatGPT request failed" });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server listening on http://localhost:" + PORT);
  });
}

// Export for Vercel serverless
export default app;
