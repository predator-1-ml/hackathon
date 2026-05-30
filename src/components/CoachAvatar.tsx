import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Bot, Sparkles, AlertCircle, Heart } from 'lucide-react';

export const CoachAvatar: React.FC = () => {
  const { mood, user } = useAppContext();

  const getMoodConfig = () => {
    switch (mood) {
      case 'alert':
        return {
          icon: <AlertCircle className="w-8 h-8 text-rose-500 animate-pulse" />,
          bgColor: 'bg-rose-100',
          label: 'Attentive',
          message: `Heads up, ${user?.name || 'friend'}.`
        };
      case 'encouraging':
        return {
          icon: <Heart className="w-8 h-8 text-emerald-500" />,
          bgColor: 'bg-emerald-100',
          label: 'Proud',
          message: "You're doing great!"
        };
      case 'thinking':
        return {
          icon: <Bot className="w-8 h-8 text-indigo-500 animate-bounce" />,
          bgColor: 'bg-indigo-100',
          label: 'Thinking',
          message: "Let's get to know each other..."
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
          bgColor: 'bg-indigo-100',
          label: 'Calm',
          message: `Ready when you are, ${user?.name || 'friend'}.`
        };
    }
  };

  const config = getMoodConfig();

  return (
    <div className="flex flex-col items-center gap-4 py-8 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm transition-all duration-500">
      <div className={`p-5 rounded-full ${config.bgColor} transition-colors duration-500`}>
        {config.icon}
      </div>
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1 block">
          Coach Status: {config.label}
        </span>
        <h3 className="text-lg font-semibold text-slate-800">
          {config.message}
        </h3>
      </div>
    </div>
  );
};
