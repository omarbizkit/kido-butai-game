import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCENARIOS } from '../engine/scenarios';
import { useGameStore } from '../store/gameStore';
import { Book, Clock, MapPin, Target } from 'lucide-react';

interface ScenarioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ isOpen, onClose }) => {
  const loadScenario = useGameStore((state: any) => state.loadScenario);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-game-gold/30 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-slate-950/50 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Historical Briefings</h2>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Select Engagement Scenario</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIOS.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col bg-slate-950/40 border border-white/5 rounded-2xl p-6 hover:border-game-gold/50 transition-all cursor-pointer"
              onClick={() => {
                loadScenario(scenario.id);
                onClose();
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-game-gold/10 rounded-lg group-hover:bg-game-gold/20 transition-colors">
                  <Clock size={20} className="text-game-gold" />
                </div>
                <span className="text-xs font-mono font-bold text-game-gold opacity-50">{scenario.startTime}</span>
              </div>
              
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-game-gold transition-colors">
                {scenario.name}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                {scenario.description}
              </p>

              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Initial Setup</span>
                <span className="text-game-gold text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">Deploy →</span>
              </div>

              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-game-gold/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950/50 border-t border-white/5 text-center">
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em]">
            Warning: Historical accuracy may vary by engagement level
          </p>
        </div>
      </motion.div>
    </div>
  );
};
