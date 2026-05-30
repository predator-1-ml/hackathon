import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

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

export const ChatInput: React.FC<{ onAnalysis?: (transcript: string, updates: any, responseText: string, responseType: string) => void }> = ({ onAnalysis }) => {
  const context = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsVoiceMode(true);
      setInput('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsVoiceMode(false);
      
      // DEEP THINKING: Introduce a 3-second delay after user stops speaking
      setIsThinking(true);
      setTimeout(() => {
        handleCommand(transcript);
        setIsThinking(false);
      }, 3000);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsVoiceMode(false);
      setIsThinking(false);
    };

    recognition.onend = () => {
      setIsVoiceMode(false);
    };

    recognition.start();
  };

  const handleCommand = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

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
      
      if (onAnalysis && data.updates) {
        onAnalysis(userInput, data.updates, data.text, data.type || 'suggestion');
      } else {
        if (data.updates) {
          context.processAgentCommand(data.updates);
        }

        context.addCoachMessage({ 
          text: data.text, 
          type: data.type || 'suggestion' 
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallback = generateResponse(userInput, context);
      const coachMessageType: 'suggestion' | 'affirmation' | 'check-in' = 
        fallback.type === 'response' ? 'check-in' : fallback.type;
      context.addCoachMessage({ text: fallback.text, type: coachMessageType });
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isLoading || isVoiceMode || isThinking ? 'opacity-60 animate-pulse' : ''}`}></div>
        <form onSubmit={handleSubmit} className="relative flex items-center bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl overflow-hidden p-2">
          <button
            type="button"
            onClick={startSpeechRecognition}
            className={`p-5 rounded-2xl transition-all ${isVoiceMode ? 'text-rose-500 bg-rose-50 scale-110 shadow-inner' : isThinking ? 'text-amber-500 bg-amber-50 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
          >
            <Mic className={`w-6 h-6 ${isVoiceMode ? 'animate-pulse' : ''}`} />
          </button>
          
          <div className="flex-1 flex items-center px-4 overflow-hidden">
            {isThinking ? (
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-slate-400 italic truncate max-w-[200px]">"{input}"</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest ml-2">Deep Thinking</span>
              </div>
            ) : (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Deconstructing intent..." : isVoiceMode ? "Listening carefully..." : "Tell your coach what's on your mind..."}
                disabled={isLoading}
                className="w-full py-6 bg-transparent focus:outline-none text-lg font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
              />
            )}
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isThinking}
            className="p-5 text-indigo-600 hover:text-indigo-700 disabled:opacity-30 disabled:text-slate-300 transition-all transform active:scale-90"
          >
            <Send className={`w-6 h-6 ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {[
          { label: "Check-in", text: "I'm feeling low energy today" },
          { label: "New Habit", text: "Remind me to read every evening" },
          { label: "Task Done", text: "I finished my coding work" }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => { setInput(item.text); }}
            disabled={isLoading}
            className="text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-white/50 text-slate-500 rounded-2xl hover:bg-white hover:text-indigo-600 border border-slate-100 shadow-sm transition-all active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
