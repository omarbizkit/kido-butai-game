import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JapaneseCarrier, CarrierState } from '../types';
import { CARRIER_DATA } from '../data/carriers';
import { Shield, Target, Activity, Anchor, ChevronRight, Book } from 'lucide-react';

interface Props {
  carrier: CarrierState;
  isOpen: boolean;
  onClose: () => void;
}

export const CarrierProfileModal: React.FC<Props> = ({ carrier, isOpen, onClose }) => {
  const data = CARRIER_DATA[carrier.name];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: 20 }}
        className="relative w-full max-w-5xl bg-slate-900 border border-game-gold/30 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img 
            src="/japanese_carrier_dossier_art.png" 
            alt="Historical Background" 
            className="w-full h-full object-cover grayscale brightness-200"
          />
        </div>
        {/* Left: Imagery/Stats Side */}
        <div className="relative z-10 md:w-1/3 bg-slate-950/60 backdrop-blur-md border-r border-white/5 p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{data.name}</h2>
            <p className="text-game-gold font-mono text-xs uppercase tracking-[0.3em] font-bold mt-2">{data.hullNumber}</p>
          </div>

          <div className="space-y-6 flex-1">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase font-mono mb-2 block">Commanding Officer</span>
              <p className="text-white font-bold leading-tight">{data.commander}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-mono mb-1 block">Speed</span>
                <p className="text-white font-black">{data.stats.speed}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-mono mb-1 block">Aircraft</span>
                <p className="text-white font-black">{data.stats.aircraft}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase font-mono mb-2 block">Deployment</span>
              <div className="flex items-center gap-2">
                <Anchor size={14} className="text-game-gold" />
                <p className="text-white text-sm font-medium">1st Air Fleet (Kido Butai)</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="mt-8 py-3 w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all uppercase text-[10px] font-black tracking-widest border border-white/5"
          >
            Close Dossier
          </button>
        </div>

        {/* Right: Detailed Info */}
        <div className="relative z-10 flex-1 p-10 overflow-y-auto bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
             <div className="h-0.5 flex-1 bg-gradient-to-r from-game-gold/50 to-transparent" />
             <div className="px-3 py-1 bg-game-gold/10 rounded-full border border-game-gold/20">
               <span className="text-game-gold text-[10px] font-black uppercase tracking-widest">Tactical Dossier</span>
             </div>
          </div>

          <div className="mb-12">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Historical Background</h3>
            <p className="text-slate-300 text-xl leading-relaxed font-serif italic">
              "{data.description}"
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                <Activity size={12} /> Status & Integrity
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-white text-xs font-black uppercase">Hull Structural Damage</span>
                  <span className={carrier.damage >= 3 ? "text-red-500" : "text-white"}>{carrier.damage}/4</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(carrier.damage / 4) * 100}%` }}
                    className={`h-full ${carrier.damage >= 3 ? 'bg-red-500' : 'bg-game-gold'}`}
                  />
                </div>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  {carrier.damage === 0 ? "Vessel is fully operational. Damage control teams at ready." :
                   carrier.damage < 3 ? "Superficial damage reported. Flight operations continue." :
                   carrier.isSunk ? "VESSEL SUNK. ALL HANDS ABANDON SHIP." : "CRITICAL DAMAGE. UNCONTROLLED FIRES REPORTED."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                <Shield size={12} /> Combat Fate
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {data.historicalFate}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-white/5">
            <h3 className="text-white font-black uppercase tracking-tight mb-4">{data.type} Specifications</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Displacement</span>
                <span className="text-white font-bold">{data.stats.displacement}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Length</span>
                <span className="text-white font-bold">{data.stats.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 p-4 pointer-events-none">
          <Book size={64} className="text-white/5 -rotate-12" />
        </div>
      </motion.div>
    </div>
  );
};
