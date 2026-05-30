import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const IntentionSetter: React.FC = () => {
  const { intentions, addIntention, toggleIntention } = useAppContext();
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && intentions.length < 3) {
      addIntention(text.trim());
      setText('');
    }
  };

  return (
    <div className="space-y-6">
      {intentions.length < 3 && (
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I will focus on..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/20 transition-all text-slate-900 placeholder:text-slate-400 font-bold"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      )}

      <div className="space-y-3">
        {intentions.map((intention, index) => (
          <motion.div
            key={intention.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleIntention(intention.id)}
            className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
              intention.completed
                ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5'
            }`}
          >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                intention.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-400'
              }`}>
                {intention.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span className={`font-bold flex-1 ${intention.completed ? 'line-through opacity-60' : ''}`}>
                {intention.text}
              </span>
              {!intention.completed && (
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              )}
            </motion.div>
          ))}
        
        {intentions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 px-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
          >
            <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-2">
              No Intentions Set
            </p>
            <p className="text-slate-500 text-sm">
              Your day starts with a clear focus. What matters most?
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
