import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, ArrowRight } from 'lucide-react';

export const NameEntry: React.FC = () => {
  const { user, updateUser } = useAppContext();
  const [name, setName] = useState('');

  if (user?.name) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateUser({ name: name.trim() });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Hello! I'm your coach.</h2>
        <p className="text-slate-500 mb-8">Before we start optimizing your day, what should I call you?</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-lg"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
