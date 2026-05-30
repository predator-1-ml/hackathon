import React from 'react';
import { motion } from 'framer-motion';

interface CoachVisualProps {
  mood: 'calm' | 'alert' | 'encouraging' | 'thinking';
}

export const CoachVisual: React.FC<CoachVisualProps> = ({ mood }) => {
  const getColors = () => {
    switch (mood) {
      case 'alert': return ['#f43f5e', '#fb7185', '#fda4af'];
      case 'encouraging': return ['#10b981', '#34d399', '#6ee7b7'];
      case 'thinking': return ['#6366f1', '#818cf8', '#a5b4fc'];
      default: return ['#818cf8', '#c7d2fe', '#e0e7ff'];
    }
  };

  const colors = getColors();

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)` }}
      />

      {/* Main Orb */}
      <motion.div
        animate={{
          borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 60% 40% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-24 h-24 overflow-hidden border border-white/40 shadow-xl backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
        }}
      >
        {/* Internal Shine */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/30 rounded-full blur-md" />
        
        {/* Animated Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
          />
        ))}
      </motion.div>

      {/* Pulsing Ring */}
      <motion.div
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
        className="absolute w-24 h-24 rounded-full border-2"
        style={{ borderColor: colors[0] }}
      />
    </div>
  );
};
