import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const WeeklyCalendar: React.FC = () => {
  const { habits } = useAppContext();

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
      });
    }
    return days;
  };

  const days = getLast7Days();
  
  const getHabitStatusForDay = (habitIndex: number, dayDate: string) => {
    const habit = habits[habitIndex];
    if (!habit?.history) return null;
    const record = habit.history.find(h => h.date === dayDate);
    return record?.status;
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-2xl">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Mastery Calendar</h3>
        </div>
        <button className="flex items-center gap-1 text-xs font-black text-indigo-600 uppercase tracking-widest hover:gap-2 transition-all">
          View Full History <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="flex gap-2 justify-between">
          <div className="w-24" /> {/* Spacer for names */}
          {days.map((day) => (
            <div key={day.date} className="flex-1 text-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black block mb-1">
                {day.dayName}
              </span>
              <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                day.date === new Date().toISOString().split('T')[0] 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-600'
              }`}>
                {day.dayNum}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          {habits.slice(0, 5).map((habit, habitIndex) => (
            <motion.div 
              key={habit.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: habitIndex * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-bold text-slate-500 w-24 truncate">{habit.name}</span>
              <div className="flex-1 flex gap-2">
                {days.map((day) => {
                  const status = getHabitStatusForDay(habitIndex, day.date);
                  return (
                    <motion.div
                      key={day.date}
                      whileHover={{ scale: 1.1 }}
                      className={`flex-1 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${
                        status === 'completed' 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                          : status === 'missed' 
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-100'
                          : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      {status === 'completed' ? '✓' : status === 'missed' ? '✗' : '·'}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        
        {habits.length === 0 && (
          <div className="text-center py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Awaiting Habit Data
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-6">
        {[
          { label: 'Mastered', color: 'bg-emerald-500' },
          { label: 'Slipped', color: 'bg-rose-500' },
          { label: 'Pending', color: 'bg-slate-100' }
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
