import React from 'react';
import { Trophy, TrendingUp, Calendar, Zap, Star, CircleDashed, Plus } from 'lucide-react';
import { HabitTracker } from './HabitTracker';
import { WeeklyCalendar } from './WeeklyCalendar';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { EnergyLandscape } from './EnergyLandscape';

import { BackgroundVisual } from './BackgroundVisual';

export const HabitMastery: React.FC = () => {
  const { habits } = useAppContext();
  
  const totalStreaks = habits.reduce((acc, curr) => acc + curr.streak, 0);
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);
  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.status === 'completed').length / habits.length) * 100) 
    : 0;

  return (
    <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-[#f8fafc] relative">
      <BackgroundVisual />

      <header className="max-w-6xl mx-auto mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100">
              Analytics Engine
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-3">
            Habit Mastery
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
            Your long-term performance and behavioral patterns.
          </p>
        </motion.div>
      </header>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Landscape Row */}
        <section>
          <EnergyLandscape />
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Streaks', value: totalStreaks, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Best Streak', value: `${bestStreak} Days`, icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Today\'s Rate', value: `${completionRate}%`, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6"
            >
              <div className={`p-4 ${stat.bg} rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main: Habit Management */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100/80">
              <h2 className="text-xs font-black mb-8 text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-slate-200" />
                Active Routines
              </h2>
              <HabitTracker />
            </section>
          </div>

          {/* Right: History & Calendar */}
          <div className="lg:col-span-4 space-y-10">
            <WeeklyCalendar />
            
            <section className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <CircleDashed className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-black mb-4 relative z-10 leading-tight">
                Consistency is the key to mastery.
              </h3>
              <p className="text-indigo-100 text-sm font-medium mb-8 relative z-10 leading-relaxed">
                You've maintained a {bestStreak} day streak on your best habit. Don't let the chain break today.
              </p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest relative z-10 hover:bg-indigo-50 transition-colors shadow-lg">
                View Reports
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
