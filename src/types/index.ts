export interface Intention {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompletedAt?: number;
  timeWindow?: 'morning' | 'afternoon' | 'evening';
  status: 'pending' | 'completed' | 'missed';
  history?: { date: string; status: 'completed' | 'missed' }[];
}

export interface DayRecord {
  date: string;
  completedHabits: number;
  totalHabits: number;
  intentionsCompleted: number;
  totalIntentions: number;
}

export interface CoachMessage {
  id: string;
  text: string;
  type: 'suggestion' | 'affirmation' | 'check-in';
  timestamp: number;
  actionTaken?: 'accepted' | 'dismissed' | 'snoozed';
}

export interface AppState {
  user: {
    name: string;
    preferences: {
      morningStart: number; // hour
      eveningStart: number; // hour
    };
  };
  intentions: Intention[];
  habits: Habit[];
  messages: CoachMessage[];
  energyLevel?: number;
  mood: 'calm' | 'alert' | 'encouraging' | 'thinking';
  activeView: 'dashboard' | 'focus' | 'insights' | 'habits';
}
