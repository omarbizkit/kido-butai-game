'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';

import { CarrierState } from '../types';

export const GameBoard: React.FC = () => {
  const { turn, phase, carriers, log } = useGameStore();

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
          <div key={carrier.name} className="p-4 bg-slate-800 rounded-lg border border-slate-600 flex flex-col gap-2">
            <h3 className="text-game-gold font-bold uppercase tracking-wider">{carrier.name}</h3>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i: number) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full ${i < carrier.damage ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : 'bg-slate-900 border border-slate-700'}`}
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-400 uppercase font-bold">
              CAP Slots
            </div>
            <div className="grid grid-cols-2 gap-2">
              {carrier.capSlots.map((slot: string | null, i: number) => (
                <div key={i} className="h-10 bg-slate-900 rounded border border-slate-700 border-dashed flex items-center justify-center text-[10px] text-slate-600">
                  {slot || 'EMPTY'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="h-40 bg-black/40 rounded-lg border border-slate-800 p-4 font-mono text-xs overflow-y-auto flex flex-col-reverse gap-1">
          {log.map((msg: string, i: number) => (
            <div key={i} className="text-slate-400">
              <span className="text-game-gold mr-2 text-[10px] opacity-70">[{new Date().toLocaleTimeString()}]</span>
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
