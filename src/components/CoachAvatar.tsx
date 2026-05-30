import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CoachVisual } from './CoachVisual';

export const CoachAvatar: React.FC = () => {
  const { mood, user } = useAppContext();

  const getMoodConfig = () => {
    switch (mood) {
      case 'alert':
        return {
          label: 'Attentive',
          message: `Heads up, ${user?.name || 'friend'}.`
        };
      case 'encouraging':
        return {
          label: 'Proud',
          message: "You're doing great!"
        };
      case 'thinking':
        return {
          label: 'Thinking',
          message: "Analyzing the flow..."
        };
      default:
        return {
          label: 'Calm',
          message: `Ready when you are, ${user?.name || 'friend'}.`
        };
    }
  };

  const config = getMoodConfig();

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-10 px-8 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 h-full overflow-hidden relative group">
      {/* Decorative SVG Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10">
        <CoachVisual mood={mood} />
      </div>

      <div className="text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black">
            Agent Status: {config.label}
          </span>
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
          {config.message}
        </h3>
      </div>
    </div>
  );
};

