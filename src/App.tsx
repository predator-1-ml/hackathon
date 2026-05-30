import React from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { FocusMode } from './components/FocusMode'
import { NameEntry } from './components/NameEntry'
import { useAppContext } from './context/AppContext'
import { motion } from 'framer-motion'

function App() {
  const { activeView, mood } = useAppContext();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'focus':
        return <FocusMode />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-1000 ${
      activeView === 'focus' ? 'bg-slate-900' :
      mood === 'alert' ? 'bg-rose-50/30' : mood === 'encouraging' ? 'bg-emerald-50/30' : 'bg-slate-50'
    } text-slate-900`}>
      <NameEntry />
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen">
        {renderView()}
      </main>
    </div>
  )
}

export default App
