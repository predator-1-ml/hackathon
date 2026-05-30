import { AppState, CoachMessage } from '../types';

export const analyzeState = (state: AppState): { message: Omit<CoachMessage, 'id' | 'timestamp'> | null, mood: AppState['mood'] } => {
  const { intentions, habits, messages, energyLevel, user } = state;
  const now = new Date();
  const hour = now.getHours();
  const userName = user?.name || 'friend';

  // Helper to check if a message type was sent recently
  const wasSentRecently = (text: string) => {
    return messages.some(m => m.text === text && Date.now() - m.timestamp < 4 * 60 * 60 * 1000);
  };

  // Default mood
  let mood: AppState['mood'] = 'calm';

  // AE2: Quiet when on track
  const allIntentionsDone = intentions.length > 0 && intentions.every(i => i.completed);
  const noMissedHabits = habits.every(h => h.status !== 'missed');
  
  if (allIntentionsDone && noMissedHabits) {
    return { message: null, mood: 'encouraging' };
  }

  // 1. Onboarding: Ask for name if not set
  if (!user.name) {
    return { message: null, mood: 'thinking' };
  }

  // 2. Morning Check-in
  if (intentions.length === 0 && hour < 11) {
    const text = `Good morning, ${userName}! What would make today feel successful?`;
    if (!wasSentRecently(text)) return { message: { text, type: 'check-in' }, mood: 'calm' };
  }

  // 3. Energy Alert
  if (energyLevel && energyLevel <= 3) {
    const text = `Hey ${userName}, your energy seems low. Should we simplify your remaining intentions?`;
    if (!wasSentRecently(text)) return { message: { text, type: 'suggestion' }, mood: 'calm' };
  }

  // 4. Drift Detection (Alert Mood)
  const uncompletedIntentions = intentions.filter(i => !i.completed);
  const missedHabits = habits.filter(h => h.status === 'missed');
  
  if (uncompletedIntentions.length > 0 && missedHabits.length > 0) {
    const text = `I noticed a slip, ${userName}. You missed "${missedHabits[0].name}". How can we protect time for your intention: "${uncompletedIntentions[0].text}"?`;
    if (!wasSentRecently(text)) return { message: { text, type: 'suggestion' }, mood: 'alert' };
  }

  // 5. Streak Protection
  const morningHabits = habits.filter(h => h.timeWindow === 'morning' && h.status === 'pending');
  if (hour >= 10 && morningHabits.length > 0) {
    const text = `${userName}, your ${morningHabits[0].streak}-day streak for "${morningHabits[0].name}" is at risk! Can we do a quick 2-minute version?`;
    if (!wasSentRecently(text)) return { message: { text, type: 'suggestion' }, mood: 'alert' };
  }

  return { message: null, mood };
};
