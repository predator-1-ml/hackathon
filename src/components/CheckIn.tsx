import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export const CheckIn: React.FC = () => {
  const { energyLevel, setEnergyLevel, intentions, habits } = useAppContext();
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
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <Target className="w-3 h-3 text-indigo-500" />
              Check-in
            </h2>
          </div>
          {getBatteryIcon(energy)}
        </div>

        <div className="space-y-8 flex-1">
          {/* Energy Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Level</span>
              <span className="text-xl font-black text-slate-900 leading-none">{energy}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Low', val: 3, active: energy <= 3, color: 'rose' },
                { label: 'Mid', val: 6, active: energy > 3 && energy <= 7, color: 'amber' },
                { label: 'High', val: 9, active: energy > 7, color: 'emerald' }
              ].map(b => (
                <button
                  key={b.label}
                  onClick={() => setEnergyLevel(b.val)}
                  className={`flex-1 min-w-[60px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    b.active 
                      ? b.color === 'rose' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm' :
                        b.color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm'
                      : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-5 pt-4 border-t border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Daily Progress</span>
            
            <div className="space-y-4">
              <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tighter">
                <span>Intentions</span>
                <span>{completedIntentions}/{intentions.length || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${intentions.length > 0 ? (completedIntentions / intentions.length) * 100 : 0}%` }}
                  className="h-full bg-indigo-500 transition-all duration-500 relative"
                >
                  {/* SVG Wave Pattern overlay on the progress bar */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5 V 10 H 0 Z" fill="white" />
                  </svg>
                </motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tighter">
                <span>Habits</span>
                <span>{completedHabits}/{totalHabits || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0}%` }}
                  className={`h-full transition-all duration-500 ${getProgressColor()} relative`}
                >
                  {/* SVG Wave Pattern overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0 5 Q 25 10, 50 5 T 100 5 V 10 H 0 Z" fill="white" />
                  </svg>
                </motion.div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 text-center font-bold italic leading-relaxed">
          {energy <= 3 
            ? "Prioritize rest. It's part of the process."
            : "Keep the momentum high."}
        </p>
      </div>
    </div>
  );
};
