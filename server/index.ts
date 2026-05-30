import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Mocking OpenAI for the hackathon environment if no key is provided
// In a real scenario, you'd use process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
});

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are an "Agentic Productivity Coach". Your goal is to help users stay intentional.
You have access to their daily intentions, habit history, and energy levels.

Guidelines:
1. Be proactive and specific.
2. If energy is low, suggest simplification.
3. If habits are missed, suggest recovery strategies.
4. Keep the tone encouraging but firm on intentionality.
5. Reference the user by name if provided.
6. Provide actionable advice, not generic motivation.
`;

app.post('/api/coach', async (req, res) => {
  const { userInput, state } = req.body;
  const { user, intentions, habits, energyLevel } = state;

  try {
    // For hackathon purposes, we'll simulate an AI response if no key is found
    // This ensures the product is "runnable" even without an API key immediately
    if (!process.env.OPENAI_API_KEY) {
      console.log("Simulating AI response (No API Key found)");
      const mockResponses = [
        `Hey ${user.name || 'friend'}, I've analyzed your progress. Since your energy is ${energyLevel}/10, let's focus only on "${intentions[0]?.text || 'your main goal'}" for the next hour.`,
        `I see you're doing great with your habits! ${user.name || ''}, how about we push the bar slightly on "${intentions[0]?.text || 'today\'s focus'}"?`,
        `Based on your streak, you're building real momentum. Don't let the late hour stop you, a 2-minute version of your habit is better than zero.`
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return res.json({ 
        text: randomResponse,
        type: 'suggestion'
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Context: User is ${user.name || 'anonymous'}. Intentions: ${JSON.stringify(intentions)}. Habits: ${JSON.stringify(habits)}. Energy: ${energyLevel}. User says: "${userInput}"` }
      ],
    });

    res.json({
      text: completion.choices[0].message.content,
      type: 'suggestion'
    });
  } catch (error) {
    console.error('AI Coaching Error:', error);
    res.status(500).json({ error: 'Failed to get AI coaching' });
  }
});

app.listen(port, () => {
  console.log(`AI Coach Backend running at http://localhost:${port}`);
});
