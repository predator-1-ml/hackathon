import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, CheckCircle2, Circle, Target } from 'lucide-react';

export const CheckIn: React.FC = () => {
  const { energyLevel, setEnergyLevel, intentions, habits, user } = useAppContext();
  const energy = energyLevel ?? 5;
  
  const completedIntentions = intentions.filter(i => i.completed).length;
  const completedHabits = habits.filter(h => h.status === 'completed').length;
  const totalHabits = habits.length;

  const getBatteryIcon = (level: number) => {
    if (level <= 3) return <BatteryLow className="w-6 h-6 text-rose-500" />;
    if (level <= 7) return <BatteryMedium className="w-6 h-6 text-amber-500" />;
    return <BatteryFull className="w-6 h-6 text-emerald-500" />;
  };

  const getProgressColor = () => {
    const progress = totalHabits > 0 ? completedHabits / totalHabits : 0;
    if (progress >= 0.7) return 'bg-emerald-500';
    if (progress >= 0.4) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Daily Check-in
          </h2>
          <p className="text-sm text-slate-500">How's your energy and progress?</p>
        </div>
        {getBatteryIcon(energy)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="text-sm text-slate-500 mb-2">Energy Level</div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-lg font-bold text-slate-700 w-8">{energy}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setEnergyLevel(3)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                energy <= 3 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-500'
              }`}
            >
              Low
            </button>
            <button
              onClick={() => setEnergyLevel(7)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                energy > 3 && energy <= 7 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'
              }`}
            >
              Moderate
            </button>
            <button
              onClick={() => setEnergyLevel(10)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                energy > 7 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
              }`}
            >
              High
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="text-sm text-slate-500 mb-2">Today's Progress</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Intentions</span>
              <span className="text-sm font-medium text-indigo-600">
                {completedIntentions}/{intentions.length}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-indigo-500 transition-all"
                style={{ width: `${intentions.length > 0 ? (completedIntentions / intentions.length) * 100 : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-slate-600">Habits</span>
              <span className="text-sm font-medium text-emerald-600">
                {completedHabits}/{totalHabits}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${getProgressColor()}`}
                style={{ width: `${totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-400 text-center italic">
        {energy <= 3 
          ? "Remember: rest is part of progress. Listen to your body."
          : completedHabits === totalHabits && completedIntentions === intentions.length
          ? "Outstanding progress today! You're crushing it!"
          : "Small steps lead to big changes. Keep going!"}
      </div>
    </div>
  );
};
