import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface EnergyPoint {
  energy_level: number;
  timestamp: string;
}

export const EnergyLandscape: React.FC = () => {
  const [points, setPoints] = useState<EnergyPoint[]>([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/analytics');
        const data = await response.json();
        setPoints(data.energyTrend);
      } catch (error) {
        console.error('Failed to fetch energy trends:', error);
      }
    };
    fetchTrends();
  }, []);

  if (points.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Collecting energy data for landscape...</p>
      </div>
    );
  }

  const width = 800;
  const height = 200;
  const padding = 20;

  const getPath = () => {
    const step = (width - padding * 2) / (points.length - 1);
    return points.map((p, i) => {
      const x = padding + i * step;
      const y = height - padding - (p.energy_level / 10) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const pathData = getPath();

  return (
    <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-sm overflow-hidden relative group">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
           <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
             <path d="M2 20C2 20 5 10 12 10C19 10 22 20 22 20" />
           </svg>
           Energy Landscape
        </h2>
        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Historical Flow</span>
      </div>

      <div className="relative h-[200px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-2xl">
          {/* Gradient Fill */}
          <defs>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Path Shadow */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d={pathData}
            fill="none"
            stroke="#c7d2fe"
            strokeWidth="8"
            strokeLinecap="round"
            className="blur-md opacity-30"
          />

          {/* Main Path */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={pathData}
            fill="none"
            stroke="#818cf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => {
            const step = (width - padding * 2) / (points.length - 1);
            const x = padding + i * step;
            const y = height - padding - (p.energy_level / 10) * (height - padding * 2);
            return (
              <motion.circle
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                cx={x}
                cy={y}
                r="4"
                fill="white"
                stroke="#818cf8"
                strokeWidth="2"
                className="hover:scale-150 transition-transform cursor-pointer"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
