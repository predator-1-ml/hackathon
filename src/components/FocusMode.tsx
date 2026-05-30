import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Zap, ArrowLeft, Bot } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CoachVisual } from './CoachVisual';

export const FocusMode: React.FC = () => {
  const { intentions, setActiveView, addCoachMessage } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isGhostActive, setIsGhostActive] = useState(false);
  const lastActivityRef = useRef(Date.now());
  
  const currentIntention = intentions.find(i => !i.completed);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        
        // Ghost Agent Logic: Check for inactivity every 10 seconds
        const inactiveTime = Date.now() - lastActivityRef.current;
        if (inactiveTime > 15000) { // 15 seconds of simulated inactivity
          setIsGhostActive(true);
        } else {
          setIsGhostActive(false);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      addCoachMessage({
        text: "Deep work session complete. Your focus was legendary. Time for a tactical break.",
        type: 'affirmation'
      });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      setIsGhostActive(false);
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

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
      {/* Ghost Agent Floating Presence */}
      <AnimatePresence>
        {isGhostActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <CoachVisual mood="alert" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-2xl text-center"
            >
              <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">Agent Nudge</p>
              <p className="text-lg font-black">Still in the flow?</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative SVG Shapes for Focus Mode */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="absolute -top-[5%] -right-[5%] w-[50%] h-[50%] text-indigo-900/40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M35.6,-47.1C44.7,-38.4,49.8,-25.6,53.4,-11.8C57,2,59.1,16.8,54.7,29.1C50.2,41.4,39.3,51.1,26.5,56.7C13.8,62.3,-0.7,63.7,-14.9,60.6C-29.1,57.5,-42.9,49.8,-52.6,38.3C-62.3,26.8,-67.9,11.5,-66.2,-2.7C-64.4,-16.9,-55.4,-30,-44,-39.2C-32.6,-48.3,-18.8,-53.6,-4.5,-52.8C9.7,-52.1,26.5,-55.8,35.6,-47.1Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] text-violet-900/30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M42.3,-58.2C54.9,-49.6,65.3,-37.8,70.1,-24.1C74.9,-10.3,74.1,5.3,68.4,18.9C62.7,32.5,52.2,44.1,39.3,51.8C26.5,59.5,11.3,63.3,-4,68.8C-19.3,74.3,-34.7,81.4,-47.2,76.5C-59.7,71.5,-69.3,54.6,-74.6,37.3C-79.8,20.1,-80.7,2.5,-76.8,-13.6C-72.9,-29.7,-64.1,-44.3,-51.4,-52.9C-38.6,-61.5,-22,-64,-5.4,-56.6C11.1,-49.1,29.7,-66.8,42.3,-58.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Global Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="focus-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#focus-pattern)" />
        </svg>
      </div>

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
