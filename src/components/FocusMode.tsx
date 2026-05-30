import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Zap, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const FocusMode: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const { intentions, setActiveView } = useAppContext();
  
  const currentIntention = intentions.find(i => !i.completed);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0b] text-white overflow-hidden relative">
      {/* Dynamic Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: isActive ? [1, 1.2, 1] : 1,
            opacity: isActive ? [0.1, 0.2, 0.1] : 0.05 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[160px] rounded-full" 
        />
      </div>

      <button 
        onClick={() => setActiveView('dashboard')}
        className="absolute top-12 left-12 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">Exit Focus</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center max-w-2xl w-full text-center"
      >
        <div className="mb-12 px-5 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          Deep Work Protocol
        </div>

        <div className="mb-16">
          <AnimatePresence mode="wait">
            {currentIntention ? (
              <motion.h2 
                key={currentIntention.id}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-tight"
              >
                {currentIntention.text}
              </motion.h2>
            ) : (
              <h2 className="text-4xl font-black text-slate-600 tracking-tighter">Enter an intention to focus</h2>
            )}
          </AnimatePresence>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Current Priority</p>
        </div>

        <div className="relative mb-20 group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000" />
          <div className="relative">
            <span className="text-[10rem] md:text-[12rem] font-black tabular-nums tracking-[-0.05em] leading-none block bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              {formatTime(timeLeft).split(':')[0]}
            </span>
            <span className="text-2xl font-black text-indigo-500/60 uppercase tracking-[1em] ml-[1em] -mt-4 block">
              Minutes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="p-6 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all text-slate-500 hover:text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.2)]' 
                : 'bg-indigo-600 text-white shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:bg-indigo-500'
            }`}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-6 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all text-slate-500 hover:text-amber-400"
          >
            <Zap className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="mt-20 flex justify-center gap-8">
          {[15, 25, 45].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setIsActive(false);
                setTimeLeft(mins * 60);
              }}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                timeLeft === mins * 60 ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {mins}M
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
