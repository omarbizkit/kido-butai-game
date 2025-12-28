'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';

import { CarrierState, Unit } from '../types';
import { UnitToken } from './UnitToken';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GameBoard: React.FC = () => {
  const { 
    turn, 
    phase, 
    carriers, 
    units, 
    log, 
    isUsFleetFound, 
    isJapanFleetFound,
    midwayDamage,
    selectedUnitId,
    moveUnit,
    resolveStrikes,
    performAmericanStrike
  } = useGameStore();

  const getUnitsAtLocation = (location: string) => {
    return units.filter((u: Unit) => u.location === location);
  };

  const handleLocationClick = (location: any) => {
    if (selectedUnitId) {
      moveUnit(selectedUnitId, location);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-6 bg-slate-900/50 rounded-2xl backdrop-blur-sm border border-slate-700">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-game-gold tracking-tight uppercase italic">
            Time: {turn}
          </h2>
          <p className="text-slate-400 font-mono uppercase tracking-widest text-sm">
            Phase: {phase}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-sm uppercase transition-all">
            Save
          </button>
          <button className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white rounded font-bold text-sm uppercase transition-all">
            Menu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.values(carriers).map((carrier: CarrierState) => (
          <div key={carrier.name} className="p-4 bg-slate-800 rounded-lg border border-slate-600 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-game-gold font-bold uppercase tracking-wider">{carrier.name}</h3>
              <span className="text-[10px] text-slate-500 font-mono">CAP {carrier.capSlots.length}</span>
            </div>
            
            <div className="flex gap-1">
              {[...Array(4)].map((_, i: number) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < carrier.damage ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : 'bg-slate-900 border border-slate-700'}`} />
              ))}
            </div>

            <div 
              onClick={() => handleLocationClick(carrier.name)}
              className={cn(
                "min-h-[60px] bg-slate-900/50 rounded p-2 border transition-colors cursor-pointer",
                selectedUnitId ? "border-game-gold/50 hover:bg-game-gold/10" : "border-slate-700/50"
              )}
            >
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Ready Deck</div>
              <div className="flex flex-wrap gap-2">
                {getUnitsAtLocation(carrier.name).map((u: Unit) => (
                  <UnitToken key={u.id} unit={u} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {carrier.capSlots.map((slot: string | null, i: number) => (
                <div 
                  key={i} 
                  onClick={() => handleLocationClick('CAP')}
                  className={cn(
                    "h-10 bg-slate-900 rounded border border-dashed flex items-center justify-center text-[10px] text-slate-600 overflow-hidden cursor-pointer transition-colors",
                    selectedUnitId ? "border-game-gold/50 hover:bg-game-gold/10" : "border-slate-700"
                  )}
                >
                  {slot ? <UnitToken unit={units.find((u: Unit) => u.id === slot)!} /> : `CAP ${i+1}`}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 p-6 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Strategy Council</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => useGameStore.getState().setNextPhase()}
              className="px-6 py-3 bg-game-gold text-black font-black rounded hover:bg-yellow-500 transition-all uppercase tracking-tighter"
            >
              End {phase} Phase
            </button>
            {phase === 'RECON' && (
              <button 
                onClick={() => useGameStore.getState().performRecon()}
                className="px-6 py-3 border-2 border-game-gold text-game-gold font-black rounded hover:bg-game-gold hover:text-black transition-all uppercase tracking-tighter"
              >
                Launch Scouts
              </button>
            )}
            {phase === 'JAPANESE' && (
              <button 
                onClick={() => resolveStrikes()}
                className={cn(
                  "px-6 py-3 border-2 font-black rounded transition-all uppercase tracking-tighter",
                  getUnitsAtLocation('STAGING').length > 0 || getUnitsAtLocation('MIDWAY_FLIGHT').length > 0
                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    : "border-slate-700 text-slate-700 cursor-not-allowed"
                )}
              >
                Commence Strike
              </button>
            )}
            {phase === 'AMERICAN' && (
              <button 
                onClick={() => performAmericanStrike()}
                className="px-6 py-3 border-2 border-orange-500 text-orange-500 font-black rounded hover:bg-orange-500 hover:text-white transition-all uppercase tracking-tighter"
              >
                Weather the Storm
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div 
              onClick={() => handleLocationClick('STAGING')}
              className={cn(
                "p-4 rounded-xl border-2 border-dashed flex flex-col gap-2 min-h-[100px] transition-all cursor-pointer",
                selectedUnitId ? "border-game-gold bg-game-gold/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]" : "border-slate-700 bg-slate-900/50"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-500 tracking-tighter">Strike Staging (TF Target)</span>
                {isUsFleetFound ? <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">LOCKED ON</span> : <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded italic">WAITING FOR RECON</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {getUnitsAtLocation('STAGING').map((u: Unit) => (
                  <UnitToken key={u.id} unit={u} />
                ))}
              </div>
            </div>

            <div 
              onClick={() => handleLocationClick('MIDWAY_FLIGHT')}
              className={cn(
                "p-4 rounded-xl border-2 border-dashed flex flex-col gap-2 min-h-[100px] transition-all cursor-pointer",
                selectedUnitId ? "border-blue-400 bg-blue-400/5 shadow-[0_0_15px_rgba(96,165,250,0.1)]" : "border-slate-700 bg-slate-900/50"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-500 tracking-tighter">Midway Flight Path</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">OPEN</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getUnitsAtLocation('MIDWAY_FLIGHT').map((u: Unit) => (
                  <UnitToken key={u.id} unit={u} />
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-slate-700 bg-slate-900 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Midway Airbase Damage</span>
              <div className="flex gap-1 justify-center">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={cn("w-4 h-4 rounded-sm transition-all", i < midwayDamage ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-slate-800 border border-slate-700")} />
                ))}
              </div>
              <span className="text-2xl font-black text-white">{midwayDamage}/6</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className={cn(
              "p-3 rounded border flex justify-between items-center transition-colors",
              isUsFleetFound ? "bg-emerald-900/20 border-emerald-500/50 text-emerald-400" : "bg-slate-900 border-slate-700 text-slate-500"
            )}>
              <span className="text-xs font-bold uppercase">US Task Force</span>
              <span className="font-mono">{isUsFleetFound ? 'LOCATED' : 'UNKNOWN'}</span>
            </div>
            <div className={cn(
              "p-3 rounded border flex justify-between items-center transition-colors",
              isJapanFleetFound ? "bg-red-900/20 border-red-500/50 text-red-400" : "bg-slate-900 border-slate-700 text-slate-500"
            )}>
              <span className="text-xs font-bold uppercase">Kido Butai Status</span>
              <span className="font-mono">{isJapanFleetFound ? 'DISCOVERED' : 'HIDDEN'}</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-900/80 rounded-xl border border-slate-700 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Turn Track / Fleet Recovery</h4>
              <span className="text-[9px] text-slate-600 italic">Expected Return: 3 Turn Delay</span>
            </div>
            <div className="flex gap-4 min-h-[50px] overflow-x-auto pb-2">
              {[1, 2, 3].map((delay) => (
                <div key={delay} className="flex-1 min-w-[100px] p-2 bg-black/20 rounded border border-slate-800 flex flex-col gap-2">
                  <div className="text-[9px] text-slate-500 uppercase font-bold text-center border-b border-slate-800 pb-1">
                    T-{delay}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {units
                      .filter(u => u.location === 'TURN_TRACK' && u.turnsUntilReady === delay)
                      .map(u => (
                        <UnitToken key={u.id} unit={u} className="w-8 h-8" />
                      ))
                    }
                    {units.filter(u => u.location === 'TURN_TRACK' && u.turnsUntilReady === delay).length === 0 && (
                      <div className="h-8 flex items-center justify-center opacity-10">---</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-full bg-black/40 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto flex flex-col-reverse gap-1 min-h-[200px]">
          {log.map((msg: string, i: number) => (
            <div key={i} className="text-slate-400 py-1 border-b border-slate-800/50">
              <span className="text-game-gold/50 mr-2 text-[9px]">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
