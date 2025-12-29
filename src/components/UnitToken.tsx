import React from 'react';
import { Unit, JapaneseCarrier, UnitStatus, GameLocation } from '../types';
import { Plane, ArrowDown, ArrowRight, Shield, Timer, XCircle, Target } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface UnitTokenProps {
  unit: Unit;
  className?: string;
}

const CARRIER_THEMES: Record<JapaneseCarrier, { bg: string; accent: string; label: string }> = {
  AKAGI: { bg: 'bg-red-950', accent: 'bg-red-600', label: 'AKA' },
  KAGA: { bg: 'bg-blue-950', accent: 'bg-blue-600', label: 'KAG' },
  HIRYU: { bg: 'bg-emerald-950', accent: 'bg-emerald-600', label: 'HIR' },
  SORYU: { bg: 'bg-amber-950', accent: 'bg-amber-500', label: 'SOR' },
};

export const UnitToken: React.FC<UnitTokenProps> = ({ unit, className }: UnitTokenProps) => {
  const { selectedUnitId, selectUnit, activeCombatUnitId } = useGameStore();
  const isJapan = unit.owner === 'JAPAN';
  const isSelected = selectedUnitId === unit.id;
  const isActiveCombat = activeCombatUnitId === unit.id;
  
  const theme = (isJapan && unit.carrier) ? CARRIER_THEMES[unit.carrier as JapaneseCarrier] : { 
    bg: 'bg-blue-900', 
    accent: 'bg-white', 
    label: 'USN' 
  };

  const getIcon = () => {
    const size = 18;
    switch (unit.type) {
      case 'FIGHTER':
        return <Plane size={size} className="drop-shadow-sm rotate-0" />;
      case 'DIVE_BOMBER':
        return (
          <div className="relative">
            <Plane size={size} className="drop-shadow-sm rotate-[135deg]" />
            <Target size={10} className="absolute -bottom-1 -right-1 text-white/50" />
          </div>
        );
      case 'TORPEDO_BOMBER':
        return (
          <div className="relative">
            <Plane size={size} className="drop-shadow-sm rotate-90" />
            <ArrowRight size={10} className="absolute -bottom-1 -right-1 text-white/50" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unit.status === 'DESTROYED') return;
    selectUnit(isSelected ? null : unit.id);
  };

  return (
    <motion.div
      layoutId={`unit-${unit.id}`}
      onClick={handleClick}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative w-12 h-12 aspect-square rounded-[3px] border-2 flex flex-col items-center justify-center cursor-pointer transition-shadow overflow-visible group/token",
        theme.bg,
        isSelected || isActiveCombat
          ? "border-game-gold shadow-[0_0_15px_rgba(255,215,0,0.5),inset_0_0_8px_rgba(0,0,0,0.5)] z-20" 
          : "border-slate-800 shadow-lg hover:border-slate-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
        isActiveCombat && "ring-2 ring-red-500 shadow-[0_0_30px_rgba(220,38,38,0.6)] scale-110",
        unit.status === 'DESTROYED' && "opacity-40 grayscale cursor-not-allowed",
        className
      )}
    >
      {/* Strength Badge */}
      <div className="absolute top-0.5 right-0.5 bg-slate-950/90 text-white text-[9px] font-black leading-none px-1 py-0.5 rounded-sm border border-white/20 z-10">
         {unit.hp || 1}
      </div>

      {/* Carrier Accent Stripe */}
      <div className={cn("absolute top-0 left-0 w-full h-1.5", theme.accent)} />
      
      {/* Unit ID Label */}
      <div className="absolute top-2 left-1 text-[8px] font-black font-mono text-white/40 leading-none uppercase">
        {theme.label}
      </div>

      {/* Main Icon */}
      <div className={cn(
        "mt-1",
        isSelected ? "text-game-gold" : "text-white/80"
      )}>
        {getIcon()}
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-1 right-1 flex gap-0.5">
        {unit.status === 'CAP_NORMAL' && <Shield size={10} className="text-emerald-400" />}
        {unit.status === 'CAP_LOW' && <Shield size={10} className="text-amber-400" />}
        {unit.status === 'RETURNING' && (
          <div className="flex items-center gap-0.5 bg-purple-900/80 rounded px-0.5 border border-purple-500/50">
            <Timer size={8} className="text-purple-300" />
            <span className="text-[8px] font-bold text-white">{unit.turnsUntilReady}</span>
          </div>
        )}
        {unit.status === 'DESTROYED' && <XCircle size={10} className="text-red-500" />}
      </div>

      {/* Selected Indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -inset-1 border border-game-gold/50 rounded-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover/token:block z-50 pointer-events-none">
        <div className="bg-slate-900/90 text-white text-[9px] font-mono border border-white/20 rounded px-2 py-1 shadow-xl backdrop-blur-sm flex flex-col items-center gap-0.5">
           <span className="font-bold text-game-gold uppercase tracking-wider">{unit.id.split('_').pop() || unit.id}</span>
           <span className="text-slate-300 capitalize">{unit.type.replace('_', ' ').toLowerCase()}</span>
           {unit.status !== 'READY' && unit.status !== 'IN_FLIGHT' && (
             <span className={cn(
               "font-bold uppercase text-[8px]",
               unit.status === 'DESTROYED' ? "text-red-500" : "text-emerald-400"
             )}>
               {unit.status}
             </span>
           )}
        </div>
        {/* Tooltip Arrow */}
        <div className="w-2 h-2 bg-slate-900/90 border-r border-b border-white/20 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>
    </motion.div>
  );
};
