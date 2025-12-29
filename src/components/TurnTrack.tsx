import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../utils/cn';

interface TurnTrackProps {
  currentTurn: string;
  className?: string;
}

const TURNS = [
  '04:30', '05:30', '06:30', '07:30', '08:30', '09:30', 
  '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', 
  '16:30', '17:30', '18:30', '19:30'
];

export const TurnTrack: React.FC<TurnTrackProps> = ({ currentTurn, className }) => {
  const currentIndex = TURNS.indexOf(currentTurn);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
          <Clock size={10} />
          Operation Timeline
        </span>
        <span className="text-[10px] text-game-gold font-bold font-mono">
          {currentTurn}
        </span>
      </div>
      
      <div className="relative h-8 bg-black/40 rounded-lg border border-white/5 flex items-center px-1 shadow-inner overflow-hidden">
        {/* Progress Bar Background */}
        <motion.div 
          className="absolute left-0 top-0 bottom-0 bg-game-gold/10"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / TURNS.length) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Notches */}
        <div className="relative flex justify-between w-full z-10 px-2">
          {TURNS.map((time, index) => {
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;
            
            return (
              <div key={time} className="flex flex-col items-center gap-1 group">
                <div 
                  className={cn(
                    "w-1 h-2 rounded-full transition-all duration-300",
                    isActive ? "bg-game-gold h-4 shadow-[0_0_10px_rgba(255,215,0,0.8)]" : 
                    isPast ? "bg-slate-600" : "bg-slate-800"
                  )}
                />
                {/* Only show label for every 4th turn or active to save space */}
                {(index % 3 === 0 || isActive) && (
                  <span className={cn(
                    "absolute top-5 text-[8px] font-mono whitespace-nowrap transition-all",
                    isActive ? "text-game-gold font-bold scale-110" : "text-slate-600"
                  )}>
                    {time}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
