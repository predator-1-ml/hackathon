import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { IntentionSetter } from './IntentionSetter';
import { HabitTracker } from './HabitTracker';
import { WeeklyCalendar } from './WeeklyCalendar';
import { CheckIn } from './CheckIn';
import { CoachAvatar } from './CoachAvatar';
import { ChatInput } from './ChatInput';
import { CoachCorner } from './CoachCorner';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user } = useAppContext();

  return (
    <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-slate-50/50">
      <header className="max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">
              System Active
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-3">
            Stay Intentional, {user?.name || 'Friend'}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
            Your agentic workspace is synchronized. Focus on what truly moves the needle today.
          </p>
        </motion.div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Main Content */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                <Sparkles className="w-24 h-24 text-indigo-600" />
              </div>
              <h2 className="text-xs font-black mb-8 text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-slate-200" />
                Primary Intentions
              </h2>
              <IntentionSetter />
            </section>

            <section className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80">
              <h2 className="text-xs font-black mb-8 text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-slate-200" />
                Behavioral Rhythms
              </h2>
              <HabitTracker />
            </section>
          </div>

          <WeeklyCalendar />
          <CheckIn />
        </div>

        {/* Right: Coach Presence */}
        <div className="lg:col-span-4 space-y-8">
          <CoachAvatar />
          
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
               <Bot className="w-3 h-3" />
               Direct Interface
            </h2>
            <ChatInput />
          </section>
          
          <section className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-h-[600px] flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
              Intelligence Stream
            </h2>
            <CoachCorner />
          </section>
        </div>
      </div>
    </div>
  );
};
