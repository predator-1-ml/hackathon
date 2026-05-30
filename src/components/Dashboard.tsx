import React, { useState } from 'react';
import { Sparkles, Bot, Zap, Target } from 'lucide-react';
import { IntentionSetter } from './IntentionSetter';
import { CheckIn } from './CheckIn';
import { CoachAvatar } from './CoachAvatar';
import { ChatInput } from './ChatInput';
import { CoachCorner } from './CoachCorner';
import { CommandAnalysis } from './CommandAnalysis';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

import { BackgroundVisual } from './BackgroundVisual';

export const Dashboard: React.FC = () => {
  const { user, habits, processAgentCommand, addCoachMessage } = useAppContext();
  const [analysisState, setAnalysisState] = useState<{
    transcript: string;
    updates: any;
    responseText: string;
    responseType: string;
  } | null>(null);

  const pendingHabits = habits.filter(h => h.status === 'pending');

  const handleAnalysisComplete = () => {
    if (analysisState) {
      processAgentCommand(analysisState.updates);
      addCoachMessage({
        text: analysisState.responseText,
        type: analysisState.responseType as any
      });
      setAnalysisState(null);
    }
  };

  return (
    <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-[#f8fafc] relative">
      <BackgroundVisual />

      <AnimatePresence>
        {analysisState && (
          <CommandAnalysis
            transcript={analysisState.transcript}
            updates={analysisState.updates}
            onComplete={handleAnalysisComplete}
          />
        )}
      </AnimatePresence>

      <header className="max-w-4xl mx-auto mb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">
              Agentic OS
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-3 leading-[1.1]">
            Morning, {user?.name?.split(' ')[0] || 'Friend'}
          </h1>
          <p className="text-lg text-slate-500 font-medium mx-auto max-w-2xl leading-relaxed">
            I'm your intelligence layer. Tell me what's on your mind.
          </p>
        </motion.div>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Primary Agentic Interface */}
        <section className="space-y-8">
          <ChatInput onAnalysis={(transcript, updates, text, type) => 
            setAnalysisState({ transcript, updates, responseText: text, responseType: type })
          } />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <CoachAvatar />
            <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white shadow-sm p-8 flex flex-col h-full">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 shrink-0">
                 <Bot className="w-3 h-3" />
                 Intelligence Stream
              </h2>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <CoachCorner />
              </div>
            </div>
          </div>
        </section>

        <div className="h-[1px] bg-slate-200/50 w-full" />

        {/* Action Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100/80 relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
              <Target className="w-24 h-24 text-indigo-600" />
            </div>
            <h2 className="text-xs font-black mb-8 text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-[1px] bg-slate-200" />
              Current Intentions
            </h2>
            <IntentionSetter />
          </section>

          <div className="space-y-8 h-full flex flex-col">
            <div className="flex-1">
              <CheckIn />
            </div>
            
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100/80 flex flex-col shrink-0">
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" />
                Habit Snapshot
              </h2>
              <div className="space-y-3">
                {pendingHabits.length > 0 ? (
                  pendingHabits.slice(0, 3).map(h => (
                    <div key={h.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      <span className="text-sm font-bold text-slate-700 truncate min-w-0 flex-1">{h.name}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter shrink-0">{h.timeWindow}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <Sparkles className="w-5 h-5 text-amber-400 mb-2 opacity-50" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">All Clear</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
