import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Battery, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface CommandAnalysisProps {
  transcript: string;
  updates: {
    intentions?: string[];
    habits?: { name: string; timeWindow: string }[];
    energyLevel?: number;
    completions?: string[];
  } | null;
  onComplete: () => void;
}

export const CommandAnalysis: React.FC<CommandAnalysisProps> = ({ transcript, updates, onComplete }) => {
  const [phase, setPhase] = useState<'transcript' | 'thinking' | 'categorizing'>('transcript');

  useEffect(() => {
    const transcriptTimer = setTimeout(() => setPhase('thinking'), 1500);
    const thinkingTimer = setTimeout(() => setPhase('categorizing'), 3500);
    
    return () => {
      clearTimeout(transcriptTimer);
      thinkingTimer && clearTimeout(thinkingTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-3xl"
    >
      <div className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-2xl border border-white/20 p-12 relative overflow-hidden">
        {/* Deep Thinking Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="analysis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#analysis-grid)" />
          </svg>
        </div>

        <div className="relative z-10 space-y-12">
          {/* Phase 1: Transcript Display */}
          <div className="space-y-6">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] block text-center"
            >
              Voice Input Captured
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-black text-slate-800 leading-tight tracking-tighter italic text-center px-4"
            >
              "{transcript}"
            </motion.h2>
          </div>

          {/* Phase 2: Thinking Indicator */}
          <AnimatePresence mode="wait">
            {phase === 'thinking' && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-6 py-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-t-2 border-indigo-500"
                  />
                  <Loader2 className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                  Deconstructing intent...
                </span>
              </motion.div>
            )}

            {/* Phase 3: Categorization Results */}
            {phase === 'categorizing' && (
              <motion.div
                key="categorizing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-[1px] flex-1 bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actionable Intelligence</span>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {updates?.intentions?.map((text, i) => (
                    <ResultItem key={i} icon={<Target className="w-5 h-5" />} label="New Intention" text={text} color="indigo" delay={0.1 * i} />
                  ))}
                  {updates?.habits?.map((h, i) => (
                    <ResultItem key={i} icon={<Zap className="w-5 h-5" />} label="New Habit" text={h.name} color="amber" delay={0.3} />
                  ))}
                  {updates?.energyLevel !== undefined && (
                    <ResultItem icon={<Battery className="w-5 h-5" />} label="Energy Level" text={`${updates.energyLevel}/10`} color="emerald" delay={0.5} />
                  )}
                  {updates?.completions?.map((term, i) => (
                    <ResultItem key={i} icon={<CheckCircle2 className="w-5 h-5" />} label="Completion" text={`Marked "${term}" as done`} color="blue" delay={0.7} />
                  ))}
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  onClick={onComplete}
                  className="w-full mt-8 py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                  Apply to System
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ResultItem: React.FC<{ icon: React.ReactNode, label: string, text: string, color: string, delay: number }> = ({ icon, label, text, color, delay }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay }}
    className={`flex items-center gap-5 p-5 bg-${color}-50/50 rounded-2xl border border-${color}-100/50`}
  >
    <div className={`w-10 h-10 bg-${color}-500 rounded-xl flex items-center justify-center text-white shadow-md`}>
      {icon}
    </div>
    <div>
      <span className={`text-[9px] font-black text-${color}-500 uppercase tracking-widest block mb-0.5`}>{label}</span>
      <p className="text-sm font-bold text-slate-700">{text}</p>
    </div>
  </motion.div>
);

