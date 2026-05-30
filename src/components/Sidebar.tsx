import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Focus, 
  BarChart3, 
  Settings, 
  LogOut,
  CircleDashed,
  Bot,
  RefreshCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, user, clearState } = useAppContext();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: 'Focus Mode', icon: Focus },
    { id: 'habits', label: 'Habit Mastery', icon: CircleDashed },
  ];

  return (
    <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-slate-200/50 flex flex-col h-screen sticky top-0 z-40">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200/50">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">
            Agentic OS
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full" 
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-6">
        <div className="p-5 bg-white/50 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-100">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">{user?.name || 'Explorer'}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Elite Member</p>
            </div>
          </div>
          <button 
            onClick={clearState}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-rose-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-all group"
          >
            <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            Reset System
          </button>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-rose-500 transition-all font-bold text-xs uppercase tracking-widest">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
