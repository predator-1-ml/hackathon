import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Sparkles, MessageSquare, Check, X, Clock } from 'lucide-react';

export const CoachCorner: React.FC = () => {
  const { messages, respondToMessage } = useAppContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return (
        <div className="p-2 bg-indigo-50 rounded-xl">
          <Sparkles className="w-4 h-4 text-indigo-500" />
        </div>
      );
      case 'affirmation': return (
        <div className="p-2 bg-emerald-50 rounded-xl">
          <Check className="w-4 h-4 text-emerald-500" />
        </div>
      );
      default: return (
        <div className="p-2 bg-blue-50 rounded-xl">
          <MessageSquare className="w-4 h-4 text-blue-500" />
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar flex flex-col">
      {messages.map((msg, index) => (
        <div
          key={msg.id}
          className={`group relative p-6 rounded-[2rem] border transition-all animate-in slide-in-from-bottom-2 duration-300 ${
            msg.actionTaken 
              ? 'bg-slate-50/50 border-slate-100 opacity-60 w-full' 
              : 'bg-white border-slate-100 shadow-sm w-full hover:shadow-md hover:border-indigo-100'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Glassmorphic Shine Effect */}
          {!msg.actionTaken && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}

          <div className="flex gap-5 relative z-10">
            <div className="shrink-0">{getIcon(msg.type)}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] leading-relaxed tracking-tight ${msg.actionTaken ? 'text-slate-500' : 'text-slate-800 font-bold'}`}>
                {msg.text}
              </p>
              
              {!msg.actionTaken && msg.type === 'suggestion' && (
                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    onClick={() => respondToMessage(msg.id, 'accepted')}
                    className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToMessage(msg.id, 'snoozed')}
                    className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Clock className="w-3 h-3" /> Snooze
                  </button>
                </div>
              )}

              {msg.actionTaken && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black">
                    {msg.actionTaken}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end border-t border-slate-50 pt-3 relative z-10">
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <p className="text-center text-slate-400 py-8 italic text-sm">
          No messages from your coach yet.
        </p>
      )}
    </div>
  );
};
