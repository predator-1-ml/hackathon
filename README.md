# Agentic OS 🌌

A high-fidelity, autonomous productivity environment that transforms unstructured voice and thought into a structured daily roadmap. Powered by **Llama 3** and designed with a premium glassmorphic aesthetic.

## 🚀 The Vision
Agentic OS is not a tracker; it's a **Living Workspace**. It moves away from "Tracker with a Chatbot" toward a sentient-feeling intelligence layer that manages your intentions, habits, and energy in real-time.

---

## 🤝 Built With Trae
This project was developed in collaboration with **Trae**, the AI-powered evolutionary code editor. Every feature, from the Llama 3 integration to the SVG design system, was crafted through an agentic pair-programming flow.

---

## ✨ Key Features

### 🧠 Deep Thinking Voice Ingestion
- **Web Speech API Integration**: Speak naturally to your OS.
- **Thoughtful Delay**: A deliberate 3-second "anticipation beat" after speaking, allowing the agent to "listen" before analyzing.
- **Cinematic Deconstruction**: Watch your unstructured speech get deconstructed into categories (Intentions, Habits, State Updates) via a high-fidelity staged reveal.
- **Interactive Refinement**: Edit and tweak the agent's deconstruction before committing it to your system.

### 🤖 Proactive Intelligence
- **Drift Detection**: The agent proactively monitors your schedule. If it's 2 PM and your morning rhythm is pending, it will nudge you with recovery strategies.
- **Dynamic Mood Engine**: The central **Coach Orb** is a morphing SVG that shifts its visual behavior (Calm, Alert, Thinking, Encouraging) based on your real-time activity density and energy levels.
- **Predictive Analytics**: Uses a local SQLite history to identify patterns (e.g., "You usually lose momentum when energy is < 4") and pre-emptively suggests adjustments.

### 📊 Local Intelligence Layer
- **SQLite Persistence**: All emotions, intentions, and habit history are stored locally, ensuring data sovereignty and fast retrieval.
- **Energy Landscapes**: A generative SVG visualization of your historical energy trends, turning your biological data into a beautiful, navigable landscape.

### 🎭 High-End Design System
- **Glassmorphism**: Sophisticated backdrop blurs and white-border physical edges.
- **Organic SVGs**: Dynamic background "blobs" and micro-dot patterns that travel across all views.
- **Wave Progress**: Biological-feeling progress bars that use SVG wave animations to represent daily completion.

---

## 🛠️ Technical Stack

- **Frontend**: React (Vite) + TypeScript
- **Animations**: Framer Motion (Advanced Layout Transitions)
- **Styling**: Tailwind CSS + Custom SVG Design System
- **Intelligence**: Node.js/Express + OpenAI SDK (configured for **Groq/Llama 3**)
- **Database**: SQLite (Local persistent storage)

---

## 🚦 Getting Started

1. **Clone the repo**
2. **Configure Environment**:
   Create a `.env` file in the root:
   ```bash
   GROQ_API_KEY=your_llama3_key
   PORT=3001
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Launch Agentic OS**:
   ```bash
   # Terminal 1: Backend
   npm run server
   
   # Terminal 2: Frontend
   npm run dev
   ```

---

## 🎯 Usage
Click the **Microphone**, wait for the pulse, and say:
> *"I'm feeling high energy today. I want to finish the design review by 4 PM and remind me to meditate every evening."*

Watch as the OS deconstructs your life into a winning day.
