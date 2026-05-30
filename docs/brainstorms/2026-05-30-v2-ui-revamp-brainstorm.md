# Agentic Productivity Coach v2 — UI Revamp & Advanced Features

## Vision
Move from a "Tracker with a Chatbot" to a "Living Workspace" where the agent is the core interface, not just a sidebar. The UI should feel like a high-end personal OS—minimalist, fast, and deeply personalized.

---

## 1. UI/UX Overhaul
- **Command Center (K/L/Space)**: A floating search/command bar to set intentions, log habits, or ask the coach anything instantly.
- **Glassmorphism & Micro-interactions**: Use high-end Tailwind glass effects, Framer Motion for smooth transitions, and subtle hover states.
- **Agent-First Layout**:
  - **Left Sidebar**: Navigation (Dashboard, Focus Mode, Insights, Habits).
  - **Main View**: Context-aware content (Intentions for morning, Habits for afternoon, Review for evening).
  - **Right Sidebar**: "The Coach Presence" — persistent avatar, current mood, and quick-access feed.
- **Theme Engine**: "Morning Sage", "Noon Cobalt", "Midnight Obsidian" (auto-switching based on time of day).

---

## 2. Advanced Agentic Features
- **Focus Mode (Agentic Gatekeeper)**:
  - User enters a 25-90 min focus session.
  - UI locks down to just the task.
  - Coach provides "Gentle Nudges" if inactivity is detected or after a set interval.
- **Dynamic Reasoning (R10+)**:
  - Coach notices: "You usually miss 'Morning Focus' when your energy is below 4."
  - Proactive Suggestion: "I've noticed your morning energy is low today. Should we swap your Deep Work for a Light Walk?"
- **Coach Archetypes**:
  - **The Spartan**: High-pressure, focus on streaks.
  - **The Zen Master**: Focus on mindfulness and sustainable pace.
  - **The Strategist**: Data-driven, focus on ROI of time.

---

## 3. Data & Insights
- **Habit-Energy Correlation**: A chart showing which energy levels lead to the most habit success.
- **Intentionality Score**: A daily score based on follow-through vs. stated intentions.
- **Streak Heatmap**: A GitHub-style 52-week view of productivity.

---

## 4. Integration Concepts (Future)
- **Calendar Hook**: "I see a meeting in 15 mins. Want to do a 5-min micro-habit before it starts?"
- **Browser extension**: Coach nudges when user visits distracting sites.

---

## Action Plan for Today
1. **Layout Migration**: Switch to a Sidebar-based "App" structure.
2. **Focus Mode**: Implement a "Deep Work" timer controlled by the agent.
3. **Advanced Cards**: Redesign Intention and Habit cards with better visual hierarchy.
4. **Enhanced Coach Presence**: Move the coach to a floating "Presence" element.
