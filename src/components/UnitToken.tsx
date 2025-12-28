import React from 'react';
import { Unit } from '../types';
import { Plane, ArrowDown, ArrowRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UnitTokenProps {
  unit: Unit;
  className?: string;
}

export const UnitToken: React.FC<UnitTokenProps> = ({ unit, className }) => {
  const { selectedUnitId, selectUnit } = useGameStore();
  const isJapan = unit.owner === 'JAPAN';
  const isSelected = selectedUnitId === unit.id;
  
  const getIcon = () => {
    switch (unit.type) {
      case 'FIGHTER':
        return <Plane size={14} />;
      case 'DIVE_BOMBER':
        return <ArrowDown size={14} />;
      case 'TORPEDO_BOMBER':
        return <ArrowRight size={14} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (unit.status) {
      case 'READY':
        return isJapan ? 'bg-blue-600' : 'bg-slate-600';
      case 'STAGING':
        return 'bg-amber-500';
      case 'IN_FLIGHT':
        return 'bg-emerald-600';
      case 'RETURNING':
        return 'bg-purple-600';
      case 'DESTROYED':
        return 'bg-red-900 opacity-50';
      default:
        return 'bg-slate-700';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      selectUnit(null);
    } else {
      selectUnit(unit.id);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "w-10 h-10 rounded border-2 flex items-center justify-center text-white shadow-lg cursor-pointer transition-all hover:scale-110 active:scale-95",
        getStatusColor(),
        isJapan ? "border-red-500" : "border-blue-400",
        isSelected && "ring-4 ring-yellow-400 scale-110 z-10",
        className
      )}
      title={`${unit.id} (${unit.type}) - ${unit.status}`}
    >
      {getIcon()}
    </div>
  );
};
