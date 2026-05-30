import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Mic } from 'lucide-react';

interface ChatResponse {
  text: string;
  type: 'response' | 'suggestion' | 'affirmation';
}

const generateResponse = (input: string, state: ReturnType<typeof useAppContext>): ChatResponse => {
  const lowerInput = input.toLowerCase();
  const { intentions, habits, energyLevel } = state;
  
  const completedCount = intentions.filter(i => i.completed).length;
  const totalIntentions = intentions.length;
  const completedHabits = habits.filter(h => h.status === 'completed').length;
  const totalHabits = habits.length;
  
  if (lowerInput.includes('how') && (lowerInput.includes('day') || lowerInput.includes('going') || lowerInput.includes('doing'))) {
    if (completedCount === totalIntentions && totalIntentions > 0) {
      return { 
        text: `Outstanding, ${state.user.name}! You've crushed all your intentions today. ${completedHabits}/${totalHabits} habits complete. You're in the zone!`, 
        type: 'affirmation' 
      };
    } else if (completedCount > 0) {
      return { 
        text: `You're making progress, ${state.user.name}! ${completedCount}/${totalIntentions} intentions done. ${totalIntentions - completedCount} more to go. Keep the momentum!`, 
        type: 'response' 
      };
    } else {
      return { 
        text: `Today is a new opportunity, ${state.user.name}! What's one small step you can take right now toward your goals?`, 
        type: 'suggestion' 
      };
    }
  }
  
  if (lowerInput.includes('tired') || lowerInput.includes('exhausted') || lowerInput.includes('drained')) {
    return { 
      text: `I hear you, ${state.user.name}. Low energy days happen. Consider breaking your biggest task into a 5-minute micro-task. Sometimes just starting is the hardest part.`, 
      type: 'suggestion' 
    };
  }
  
  if (lowerInput.includes('stressed') || lowerInput.includes('overwhelmed')) {
    return { 
      text: `Deep breath, ${state.user.name}. Let's simplify. What's the ONE thing that matters most today? Everything else can wait.`, 
      type: 'suggestion' 
    };
  }
  
  if (lowerInput.includes('focus') || lowerInput.includes('concentrate')) {
    return { 
      text: `Try the Pomodoro technique: 25 minutes of focused work, then a 5-minute break. Want me to suggest which intention to focus on first?`, 
      type: 'suggestion' 
    };
  }
  
  if (lowerInput.includes('habit') && (lowerInput.includes('add') || lowerInput.includes('new'))) {
    return { 
      text: `Great thinking! Adding habits builds momentum. What habit would you like to track? I can help you name it and set a time window.`, 
      type: 'response' 
    };
  }
  
  if (lowerInput.includes('streak')) {
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);
    return { 
      text: `Your longest current streak is ${longestStreak} days! Streaks are built one day at a time. What's your goal?`, 
      type: 'response' 
    };
  }
  
  if (lowerInput.includes('energy')) {
    const energy = energyLevel ?? 5;
    return { 
      text: `Your current energy is at ${energy}/10. ${energy <= 3 ? 'Consider taking a short walk or doing a quick stretch to boost it.' : energy >= 7 ? 'You have good energy! This is a great time for challenging tasks.' : 'Moderate energy. Save complex tasks for when you feel more charged.'}`, 
      type: 'response' 
    };
  }
  
  if (lowerInput.includes('help')) {
    return { 
      text: `I can help you with:\n• Tracking your daily intentions\n• Monitoring habit streaks\n• Providing focus suggestions\n• Adapting to your energy levels\n\nJust ask me anything!`, 
      type: 'response' 
    };
  }
  
  if (lowerInput.includes('thank')) {
    return { 
      text: `Anytime, ${state.user.name}! That's what I'm here for. Now, what's next on your mind?`, 
      type: 'affirmation' 
    };
  }
  
  return { 
    text: `I hear you, ${state.user.name}. Remember: progress over perfection. What's one thing I can help you with right now?`, 
    type: 'response' 
  };
};

export const ChatInput: React.FC = () => {
  const context = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          state: {
            user: context.user,
            intentions: context.intentions,
            habits: context.habits,
            energyLevel: context.energyLevel,
          }
        }),
      });

      if (!response.ok) throw new Error('Backend failed');

      const data = await response.json();
      context.addCoachMessage({ 
        text: data.text, 
        type: data.type || 'suggestion' 
      });
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to local logic if backend is down
      const fallback = generateResponse(userInput, context);
      const coachMessageType: 'suggestion' | 'affirmation' | 'check-in' = 
        fallback.type === 'response' ? 'check-in' : fallback.type;
      context.addCoachMessage({ text: fallback.text, type: coachMessageType });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Coach is thinking..." : "Ask your coach anything..."}
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors"
        >
          <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        </button>
      </form>
      <div className="flex gap-2">
        {['How am I doing?', "I'm tired", 'Give me a tip'].map((phrase) => (
          <button
            key={phrase}
            onClick={() => setInput(phrase)}
            disabled={isLoading}
            className="text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
};
