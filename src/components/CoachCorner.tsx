import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Sparkles, MessageSquare, Check, X, Clock } from 'lucide-react';

export const CoachCorner: React.FC = () => {
  const { messages, respondToMessage } = useAppContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'affirmation': return <Check className="w-5 h-5 text-emerald-500" />;
      default: return <MessageSquare className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar flex flex-col">
      {messages.map((msg, index) => (
        <div
          key={msg.id}
          className={`p-4 rounded-2xl border transition-all animate-in slide-in-from-bottom-2 duration-300 ${
            msg.actionTaken 
              ? 'bg-slate-50/50 border-slate-100 opacity-60 self-start w-[90%]' 
              : 'bg-white border-indigo-100 shadow-sm self-start w-[95%]'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex gap-4">
            <div className="mt-1">{getIcon(msg.type)}</div>
            <div className="flex-1">
              <p className={`text-sm ${msg.actionTaken ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                {msg.text}
              </p>
              
              {!msg.actionTaken && msg.type === 'suggestion' && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => respondToMessage(msg.id, 'accepted')}
                    className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToMessage(msg.id, 'snoozed')}
                    className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" /> Snooze
                  </button>
                  <button
                    onClick={() => respondToMessage(msg.id, 'dismissed')}
                    className="text-xs px-3 py-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {msg.actionTaken && (
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-2 inline-block">
                  {msg.actionTaken}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-300 whitespace-nowrap">
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
