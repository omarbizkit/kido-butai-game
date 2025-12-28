import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const DiceTray: React.FC = () => {
  const activeRolls = useGameStore(state => state.activeRolls);

  if (!activeRolls || activeRolls.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
          className="flex gap-4 p-8 bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-game-gold/30 shadow-[0_0_50px_rgba(255,215,0,0.2)]"
        >
          {activeRolls.map((roll, i) => (
            <motion.div
              key={i}
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="w-16 h-16 bg-white rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden group"
            >
              {/* Die Pips */}
              <div className="grid grid-cols-3 grid-rows-3 gap-1.5 p-2 w-full h-full">
                {roll === 1 && <div className="col-start-2 row-start-2 bg-slate-900 rounded-full w-2.5 h-2.5 mx-auto" />}
                {roll === 2 && (
                  <>
                    <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                  </>
                )}
                {roll === 3 && (
                  <>
                    <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-2 row-start-2 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                  </>
                )}
                {roll === 4 && (
                  <>
                    <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-1 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                  </>
                )}
                {roll === 5 && (
                  <>
                    <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-2 row-start-2 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-1 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                  </>
                )}
                {roll === 6 && (
                  <>
                    <div className="col-start-1 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-1 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-1 row-start-2 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-2 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-1 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                    <div className="col-start-3 row-start-3 bg-slate-900 rounded-full w-2.5 h-2.5" />
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
