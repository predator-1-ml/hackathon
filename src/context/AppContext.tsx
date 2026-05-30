import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Intention, Habit, CoachMessage } from '../types';
import { analyzeState } from '../lib/agent';

interface AppContextType extends AppState {
  addIntention: (text: string) => void;
  toggleIntention: (id: string) => void;
  updateHabitStatus: (id: string, status: Habit['status']) => void;
  addHabit: (name: string, timeWindow: Habit['timeWindow']) => void;
  removeHabit: (id: string) => void;
  addCoachMessage: (message: Omit<CoachMessage, 'id' | 'timestamp'>) => void;
  respondToMessage: (id: string, action: CoachMessage['actionTaken']) => void;
  setEnergyLevel: (level: number) => void;
  updateUser: (user: Partial<AppState['user']>) => void;
  setActiveView: (view: AppState['activeView']) => void;
  clearState: () => void;
  processAgentCommand: (command: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: {
    name: '',
    preferences: {
      morningStart: 8,
      eveningStart: 20,
    },
  },
  intentions: [],
  habits: [
    { id: '1', name: 'Morning Focus', streak: 5, status: 'pending', timeWindow: 'morning' },
    { id: '2', name: 'Exercise', streak: 3, status: 'pending', timeWindow: 'afternoon' },
    { id: '3', name: 'Evening Review', streak: 12, status: 'pending', timeWindow: 'evening' },
  ],
  messages: [
    { id: 'm1', text: "I'm your productivity coach. What should I call you?", type: 'check-in', timestamp: Date.now() }
  ],
  energyLevel: 5,
  mood: 'calm',
  activeView: 'dashboard',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('productivity-coach-state');
    if (!saved) return initialState;
    
    try {
      const parsed = JSON.parse(saved);
      // Deep merge with initialState to ensure new properties like 'user' exist
      return {
        ...initialState,
        ...parsed,
        user: {
          ...initialState.user,
          ...(parsed.user || {})
        }
      };
    } catch (e) {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem('productivity-coach-state', JSON.stringify(state));
  }, [state]);

  // Separate effect for agent analysis to avoid infinite loops and consolidate updates
  useEffect(() => {
    const { message, mood } = analyzeState(state);
    
    if (message || mood !== state.mood) {
      setState(prev => {
        // Double check wasSentRecently against the latest prev state
        if (message) {
          const alreadySent = prev.messages.some(m => m.text === message.text && Date.now() - m.timestamp < 4 * 60 * 60 * 1000);
          if (alreadySent && mood === prev.mood) return prev;
        }

        let newState = { ...prev };
        let stateChanged = false;

        if (mood !== prev.mood) {
          newState.mood = mood;
          stateChanged = true;
        }

        if (message) {
          const alreadySent = prev.messages.some(m => m.text === message.text && Date.now() - m.timestamp < 4 * 60 * 60 * 1000);
          if (!alreadySent) {
            const newMessage: CoachMessage = {
              ...message,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: Date.now(),
            };
            newState.messages = [newMessage, ...prev.messages];
            stateChanged = true;
          }
        }

        return stateChanged ? newState : prev;
      });
    }
  }, [state.intentions, state.habits, state.energyLevel, state.user.name, state.messages.length]);

  useEffect(() => {
    // Proactive "Drift Detection" and Mood Logic
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      
      // 1. Detect missed morning habits if it's afternoon
        if (hour >= 12) {
          const missedMorning = state.habits.find(h => h.timeWindow === 'morning' && h.status === 'pending');
          if (missedMorning && !state.messages.some((m: any) => m.text.includes(missedMorning.name))) {
            addCoachMessage({
              text: `It's already afternoon, and I noticed "${missedMorning.name}" is still pending. Shall we do a quick version now?`,
              type: 'suggestion'
            });
            // Set mood to 'alert' when drift is detected
            setState(prev => ({ ...prev, mood: 'alert' }));
          }
        }
  
        // 2. Adjust calmness based on activity density
        const totalTasks = state.intentions.length + state.habits.length;
        const completedTasks = state.intentions.filter(i => i.completed).length + state.habits.filter(h => h.status === 'completed').length;
        
        if (completedTasks === totalTasks && totalTasks > 0) {
          if (state.mood !== 'encouraging') {
            setState(prev => ({ ...prev, mood: 'encouraging' }));
          }
        } else if ((state.energyLevel || 0) <= 3) {
          if (state.mood !== 'calm') {
            setState(prev => ({ ...prev, mood: 'calm' }));
          }
        }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.habits, state.intentions, state.energyLevel, state.mood]);

  useEffect(() => {
    // Predictive Intelligence: Fetch trends from backend every 5 minutes
    const fetchPrediction = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/predict');
        const data = await response.json();
        
        if (data.confidence > 0.7 && !state.messages.some((m: any) => m.text === data.suggestion)) {
          addCoachMessage({
            text: data.suggestion,
            type: 'suggestion'
          });
        }
      } catch (error) {
        console.error('Failed to fetch prediction:', error);
      }
    };

    const interval = setInterval(fetchPrediction, 300000); // Every 5 minutes
    fetchPrediction(); // Initial call

    return () => clearInterval(interval);
  }, [state.messages.length]);

  const addIntention = (text: string) => {
    if (state.intentions.length >= 3) return;
    const newIntention: Intention = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setState(prev => ({ ...prev, intentions: [...prev.intentions, newIntention] }));
  };

  const toggleIntention = (id: string) => {
    setState(prev => ({
      ...prev,
      intentions: prev.intentions.map(i => i.id === id ? { ...i, completed: !i.completed } : i)
    }));
  };

  const updateHabitStatus = (id: string, status: Habit['status']) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== id) return h;
        
        const history = h.history || [];
        const filteredHistory = history.filter(entry => entry.date !== today);
        const newHistory = status === 'pending' 
          ? filteredHistory 
          : [...filteredHistory, { date: today, status: status as 'completed' | 'missed' }];

        return { 
          ...h, 
          status, 
          streak: status === 'completed' ? h.streak + 1 : (status === 'missed' ? 0 : h.streak),
          lastCompletedAt: status === 'completed' ? Date.now() : h.lastCompletedAt,
          history: newHistory
        };
      })
    }));
  };

  const addHabit = (name: string, timeWindow: Habit['timeWindow']) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      streak: 0,
      status: 'pending',
      timeWindow,
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const removeHabit = (id: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  };

  const addCoachMessage = (msg: Omit<CoachMessage, 'id' | 'timestamp'>) => {
    const newMessage: CoachMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setState(prev => ({ ...prev, messages: [newMessage, ...prev.messages] }));
  };

  const respondToMessage = (id: string, action: CoachMessage['actionTaken']) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, actionTaken: action } : m)
    }));
  };

  const setEnergyLevel = (level: number) => {
    setState(prev => ({ ...prev, energyLevel: level }));
  };

  const setActiveView = (view: AppState['activeView']) => {
    setState(prev => ({ ...prev, activeView: view }));
  };

  const updateUser = (userData: Partial<AppState['user']>) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...userData }
    }));
  };

  const clearState = () => {
    setState(initialState);
  };

  const processAgentCommand = (updates: any) => {
    if (!updates) return;

    setState(prev => {
      let newState = { ...prev };

      // Handle Energy Level
      if (typeof updates.energyLevel === 'number') {
        newState.energyLevel = updates.energyLevel;
      }

      // Handle Mood
      if (updates.mood) {
        newState.mood = updates.mood;
      }

      // Handle New Intentions
      if (Array.isArray(updates.intentions)) {
        const newIntentions: Intention[] = updates.intentions.map((text: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          text,
          completed: false,
          createdAt: Date.now(),
        }));
        newState.intentions = [...prev.intentions, ...newIntentions].slice(-3); // Keep max 3
      }

      // Handle New Habits
      if (Array.isArray(updates.habits)) {
        const newHabits: Habit[] = updates.habits.map((h: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: h.name,
          streak: 0,
          status: 'pending',
          timeWindow: h.timeWindow || 'morning',
        }));
        newState.habits = [...prev.habits, ...newHabits];
      }

      // Handle Completions
      if (Array.isArray(updates.completions)) {
        updates.completions.forEach((term: string) => {
          // Check intentions
          newState.intentions = newState.intentions.map(i => 
            i.text.toLowerCase().includes(term.toLowerCase()) ? { ...i, completed: true } : i
          );
          // Check habits
          newState.habits = newState.habits.map(h => 
            h.name.toLowerCase().includes(term.toLowerCase()) ? { ...h, status: 'completed', streak: h.streak + 1 } : h
          );
        });
      }

      return newState;
    });
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      addIntention, 
      toggleIntention, 
      updateHabitStatus, 
      addHabit, 
      removeHabit, 
      addCoachMessage, 
      respondToMessage, 
      setEnergyLevel,
      updateUser,
      setActiveView,
      clearState,
      processAgentCommand
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
