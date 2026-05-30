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
      clearState
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
