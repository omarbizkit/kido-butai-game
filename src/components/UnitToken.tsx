import React from 'react';
import { Unit, JapaneseCarrier, UnitStatus, GameLocation } from '../types';
import { Plane, ArrowDown, ArrowRight, Shield, Timer, XCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  const { selectedUnitId, selectUnit } = useGameStore();
  const isJapan = unit.owner === 'JAPAN';
  const isSelected = selectedUnitId === unit.id;
  
  const theme = (isJapan && unit.carrier) ? CARRIER_THEMES[unit.carrier as JapaneseCarrier] : { 
    bg: 'bg-slate-900', 
    accent: 'bg-slate-400', 
    label: 'USN' 
  };

  const getIcon = () => {
    const size = 16;
    switch (unit.type) {
      case 'FIGHTER':
        return <Plane size={size} className="drop-shadow-sm" />;
      case 'DIVE_BOMBER':
        return <ArrowDown size={size} className="drop-shadow-sm" />;
      case 'TORPEDO_BOMBER':
        return <ArrowRight size={size} className="drop-shadow-sm" />;
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
        "relative w-12 h-12 aspect-square rounded-[3px] border-2 flex flex-col items-center justify-center cursor-pointer transition-shadow overflow-hidden",
        theme.bg,
        isSelected 
          ? "border-game-gold shadow-[0_0_15px_rgba(255,215,0,0.5),inset_0_0_8px_rgba(0,0,0,0.5)] z-20" 
          : "border-slate-800 shadow-lg hover:border-slate-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
        unit.status === 'DESTROYED' && "opacity-40 grayscale cursor-not-allowed",
        className
      )}
    >
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
    </motion.div>
  );
};
