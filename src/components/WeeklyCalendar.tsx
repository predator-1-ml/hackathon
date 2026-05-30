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
  
  const getHabitStatusForDay = (habitId: string, dayDate: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit?.history) return null;
    const record = habit.history.find(h => h.date === dayDate);
    return record?.status;
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-2xl">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Consistency</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex gap-2 justify-between">
          <div className="w-20" /> {/* Reduced spacer */}
          {days.map((day) => (
            <div key={day.date} className="flex-1 text-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black block mb-1">
                {day.dayName[0]}
              </span>
              <div className={`w-7 h-7 mx-auto rounded-xl flex items-center justify-center text-[10px] font-black transition-colors ${
                day.date === new Date().toISOString().split('T')[0] 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-600 bg-slate-50'
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
              <span className="text-[10px] font-bold text-slate-500 w-20 truncate uppercase tracking-tighter">{habit.name}</span>
              <div className="flex-1 flex gap-2">
                {days.map((day) => {
                  const status = getHabitStatusForDay(habit.id, day.date);
                  return (
                    <motion.div
                      key={day.date}
                      whileHover={{ scale: 1.1 }}
                      className={`flex-1 h-7 rounded-xl flex items-center justify-center text-[8px] font-black transition-all ${
                        status === 'completed' 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                          : status === 'missed' 
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-100'
                          : 'bg-slate-50 text-slate-200'
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Awaiting Habit Data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
