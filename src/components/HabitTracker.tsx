import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Habit } from '../types';
import { Flame, CheckCircle2, XCircle, Clock, Plus, Trash2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const HabitTracker: React.FC = () => {
  const { habits, updateHabitStatus, addHabit, removeHabit } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTime, setNewHabitTime] = useState<Habit['timeWindow']>('morning');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'missed': return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return <Clock className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50/50 border-emerald-100 text-emerald-700';
      case 'missed': return 'bg-rose-50/50 border-rose-100 text-rose-700';
      default: return 'bg-white border-slate-100 text-slate-700 hover:border-indigo-100';
    }
  };

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), newHabitTime);
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group flex flex-col p-5 rounded-[1.5rem] border-2 transition-all ${getStatusStyles(habit.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  habit.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                  habit.status === 'missed' ? 'bg-rose-100 text-rose-600' : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  {getStatusIcon(habit.status)}
                </div>
                <span className="font-bold text-slate-800">{habit.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-200">
                  <Flame className="w-3 h-3 fill-orange-600" />
                  {habit.streak} DAY STREAK
                </div>
                <button
                  onClick={() => removeHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {habit.timeWindow}
              </span>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={() => updateHabitStatus(habit.id, 'completed')}
                  className="text-[10px] px-3 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-black uppercase tracking-wider shadow-lg shadow-emerald-100"
                >
                  Done
                </button>
                <button
                  onClick={() => updateHabitStatus(habit.id, 'missed')}
                  className="text-[10px] px-3 py-1.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-black uppercase tracking-wider shadow-lg shadow-rose-100"
                >
                  Miss
                </button>
                <button
                  onClick={() => updateHabitStatus(habit.id, 'pending')}
                  className="text-[10px] px-3 py-1.5 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-colors font-black uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        ))}

      {showAddForm ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-200 space-y-4"
        >
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New Habit Name..."
            className="w-full px-4 py-3 bg-white border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 text-sm font-bold shadow-sm"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <select
              value={newHabitTime}
              onChange={(e) => setNewHabitTime(e.target.value as Habit['timeWindow'])}
              className="flex-1 px-4 py-3 bg-white border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 text-sm font-bold shadow-sm appearance-none"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
            <button
              onClick={handleAddHabit}
              disabled={!newHabitName.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm font-black uppercase tracking-wider shadow-lg shadow-indigo-100"
            >
              Save
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-all text-sm font-black uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-indigo-100 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">Add Master Habit</span>
        </button>
      )}
    </div>
  );
};
