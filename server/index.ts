import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database Setup
let db: any;
(async () => {
  db = await open({
    filename: path.join(__dirname, 'agentic_os.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_input TEXT,
      agent_response TEXT,
      energy_level INTEGER,
      mood TEXT,
      action_taken TEXT
    );

    CREATE TABLE IF NOT EXISTS habits_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      habit_name TEXT,
      status TEXT
    );
  `);
  console.log("SQLite Database initialized.");
})();

// LLM Provider Configuration
const getLLMClient = () => {
  if (process.env.GROQ_API_KEY) {
    console.log("Using Groq (Open Source Llama 3)");
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      }),
      model: "llama3-8b-8192"
    };
  }
  
  if (process.env.OLLAMA_HOST || process.env.USE_OLLAMA === 'true') {
    console.log("Using Local Ollama (Open Source)");
    return {
      client: new OpenAI({
        apiKey: 'ollama',
        baseURL: `${process.env.OLLAMA_HOST || 'http://localhost:11434'}/v1`,
      }),
      model: process.env.OLLAMA_MODEL || "llama3"
    };
  }

  if (process.env.OPENAI_API_KEY) {
    console.log("Using OpenAI");
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      model: "gpt-3.5-turbo"
    };
  }

  return null;
};

const llm = getLLMClient();

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are the "Daily Productivity Engine" of Agentic OS. Your sole purpose is to help the user win their day.
You must be hyper-focused on today's intentions, immediate habits, and the user's current state.

CONSTRAINTS:
1. Only discuss and manage things relevant to the current 24-hour cycle.
2. Be brief, professional, and action-oriented.
3. Parse input into:
   - Intentions (Today's top 3 tasks)
   - Habits (Recurring daily rhythms)
   - Energy/Mood (Current capacity)
   - Completions (Marking today's tasks as done)

You MUST respond with a JSON object in the following format:
{
  "text": "Brief coaching response (max 2 sentences)",
  "type": "suggestion" | "affirmation" | "check-in",
  "updates": {
    "intentions": ["Task strings"],
    "habits": [{"name": "string", "timeWindow": "morning" | "afternoon" | "evening"}],
    "energyLevel": 1-10,
    "mood": "calm" | "alert" | "encouraging" | "thinking",
    "completions": ["IDs or names to finish"]
  }
}
`;

app.post('/api/coach', async (req, res) => {
  const { userInput, state } = req.body;
  const { user, intentions, habits, energyLevel } = state;

  try {
    if (!llm) {
      console.log("Simulating AI response (No LLM Configuration found)");
      
      // Basic mock parser for demo purposes
      let updates: any = {};
      if (userInput.toLowerCase().includes('energy') || userInput.toLowerCase().includes('tired')) {
        updates.energyLevel = userInput.toLowerCase().includes('low') || userInput.toLowerCase().includes('tired') ? 3 : 8;
      }
      if (userInput.toLowerCase().includes('focus on') || userInput.toLowerCase().includes('want to')) {
        const match = userInput.match(/(?:focus on|want to) (.*)/i);
        if (match) updates.intentions = [match[1]];
      }
      if (userInput.toLowerCase().includes('habit') || userInput.toLowerCase().includes('every')) {
        const match = userInput.match(/(?:habit|every) (.*)/i);
        if (match) updates.habits = [{ name: match[1], timeWindow: 'morning' }];
      }

      const mockResponse = {
        text: `I've updated your Agentic OS based on your input. ${updates.energyLevel ? `Adjusted energy to ${updates.energyLevel}.` : ''} ${updates.intentions ? `Added intention: ${updates.intentions[0]}.` : ''}`,
        type: 'suggestion',
        updates: Object.keys(updates).length > 0 ? updates : undefined
      };
      
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json(mockResponse);
    }

    const completion = await llm.client.chat.completions.create({
      model: llm.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Context: User is ${user.name || 'anonymous'}. Intentions: ${JSON.stringify(intentions)}. Habits: ${JSON.stringify(habits)}. Energy: ${energyLevel}. User says: "${userInput}"` }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Log to SQLite
    if (db) {
      await db.run(
        'INSERT INTO activity_log (user_input, agent_response, energy_level, mood, action_taken) VALUES (?, ?, ?, ?, ?)',
        [userInput, result.text, result.updates?.energyLevel || energyLevel, result.updates?.mood || 'calm', result.type]
      );

      if (result.updates?.habits) {
        for (const h of result.updates.habits) {
          await db.run(
            'INSERT INTO habits_history (habit_name, status) VALUES (?, ?)',
            [h.name, 'created']
          );
        }
      }

      if (result.updates?.completions) {
        for (const term of result.updates.completions) {
          await db.run(
            'INSERT INTO habits_history (habit_name, status) VALUES (?, ?)',
            [term, 'completed']
          );
        }
      }
    }

    res.json(result);
  } catch (error) {
    console.error('AI Coaching Error:', error);
    res.status(500).json({ error: 'Failed to get AI coaching' });
  }
});

// Analytics Endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const activity = await db.all('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 10');
    const habits = await db.all('SELECT * FROM habits_history ORDER BY timestamp DESC LIMIT 10');
    const energyTrend = await db.all('SELECT energy_level, timestamp FROM activity_log WHERE energy_level IS NOT NULL ORDER BY timestamp ASC');
    
    res.json({ activity, habits, energyTrend });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.listen(port, () => {
  console.log(`AI Coach Backend running at http://localhost:${port}`);
});
