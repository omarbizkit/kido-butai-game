'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';

import { CarrierState, Unit, JapaneseCarrier, GameLocation, GameState, LogEntry } from '../types';
import { UnitToken } from './UnitToken';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { calculateScore } from '../engine/scoring';
import { motion, AnimatePresence } from 'framer-motion';
import { DiceTray } from './DiceTray';
import { ScenarioSelector } from './ScenarioSelector';
import { CarrierProfileModal } from './CarrierProfileModal';
import { Target, Anchor, Plane, Skull, Trophy, Info, AlertTriangle, PlayCircle, BookOpen, Download, Maximize2, X, Filter, HelpCircle, FileText, RotateCcw } from 'lucide-react';
import { generateAAR } from '../utils/export';
import { TurnTrack } from './TurnTrack';
import { cn } from '../utils/cn';
import { getAdvisorBriefing } from '../engine/advisor';
import { CarrierSilhouette } from './CarrierSilhouettes';

export const GameBoard: React.FC = () => {
  const state = useGameStore();
  const { 
    turn, phase, carriers, units, log, isUsFleetFound, isJapanFleetFound, midwayDamage, isGameOver,
    selectedUnitId, selectUnit, moveUnit, setNextPhase, performRecon,
    performAmericanStrike, resolveStrikes,
    loadScenario, resetGame
  } = state;

  const [isScenarioOpen, setIsScenarioOpen] = React.useState(false);
  const [profileCarrier, setProfileCarrier] = React.useState<JapaneseCarrier | null>(null);
  const [isLogOpen, setIsLogOpen] = React.useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = React.useState(false);
  const [logFilter, setLogFilter] = React.useState<'ALL' | 'COMBAT' | 'RECON'>('ALL');

  const score = calculateScore({ turn, phase, carriers, units, log, isUsFleetFound, isJapanFleetFound, midwayDamage, isGameOver } as GameState);

  const getUnitsAtLocation = (location: string) => {
    return units.filter((u: Unit) => u.location === location);
  };

  const handleLocationClick = (location: GameLocation) => {
    if (selectedUnitId) {
      moveUnit(selectedUnitId, location);
    }
  };

  return (
    <div className="relative flex flex-col gap-6 w-full max-w-7xl mx-auto p-6 bg-slate-900/80 rounded-2xl backdrop-blur-xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Nautical Grid Background Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90(#fff 1px, transparent 1px))', backgroundSize: '200px 200px' }} />

      <div className="flex flex-col gap-3 border-b border-slate-700 pb-2">
        <div className="flex justify-between items-end">
          <TurnTrack currentTurn={turn} className="flex-1 max-w-2xl" />
          <div className="flex gap-4">
             {/* Phase Indicator */}
             <div className="flex flex-col items-end">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Current Phase</span>
                <span className={cn(
                  "text-xl font-black uppercase tracking-tighter italic",
                  phase === 'JAPANESE' ? "text-red-500" : 
                  phase === 'AMERICAN' ? "text-blue-400" : "text-slate-200"
                )}>
                  {phase}
                </span>
             </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/5">
           <div className="flex gap-4 text-xs font-mono text-slate-400">
             <span>US FLEET: <span className={isUsFleetFound ? "text-red-500 font-bold" : "text-slate-600"}>{isUsFleetFound ? "DETECTED" : "UNKNOWN"}</span></span>
             <span>KIDO BUTAI: <span className={isJapanFleetFound ? "text-game-gold font-bold" : "text-slate-600"}>{isJapanFleetFound ? "SPOTTED" : "HIDDEN"}</span></span>
           </div>
           
           <div className="flex gap-2">
            <button 
              onClick={() => {
                if (window.confirm('Restart Operation? This will reset all progress.')) {
                  resetGame();
                }
              }}
              className="px-3 py-1 bg-red-900/40 hover:bg-red-900/80 border border-red-500/30 text-red-200 rounded text-xs font-bold uppercase transition-all flex items-center gap-2"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button 
              onClick={() => setIsAdvisorOpen(true)}
              className="px-3 py-1 border border-game-gold/50 text-game-gold hover:bg-game-gold hover:text-black rounded text-xs font-bold uppercase transition-all flex items-center gap-2"
            >
              <HelpCircle size={12} />
              Intel / Help
            </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 z-10">
        {(Object.values(carriers) as CarrierState[]).map((carrier: CarrierState) => (
          <motion.div 
            key={carrier.name} 
            animate={carrier.lastHitTime ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.4 }
            } : {}}
            onClick={() => setProfileCarrier(carrier.name)}
            className="relative p-4 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col gap-4 shadow-2xl backdrop-blur-md overflow-hidden group/card cursor-pointer hover:border-game-gold/40 hover:bg-slate-950/60 transition-all"
          >
            {/* Carrier identification stripe */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none translate-x-8 -translate-y-8 rotate-45 bg-white" />
            
            {/* Silhouette Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
              <CarrierSilhouette 
                name={carrier.name} 
                className="w-[110%] text-white opacity-20" 
              />
            </div>
            
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-game-gold font-black uppercase tracking-tighter italic text-xl group-hover/card:text-white transition-colors">
                {carrier.name}
              </h3>
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest leading-none">Registry</span>
                <span className={cn(
                  "text-[10px] font-black font-mono",
                  carrier.isSunk ? "text-red-500" : "text-emerald-500"
                )}>
                  {carrier.isSunk ? 'SUNK' : 'COMBAT READY'}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                <span>Hull integrity</span>
                <span className="font-mono">{Math.max(0, 4 - carrier.damage)}/4</span>
              </div>
              <div className="flex gap-1.5 h-2.5">
                {[...Array(4)].map((_, i: number) => (
                  <div key={i} className={cn(
                    "flex-1 rounded-sm border transition-all duration-700",
                    i < carrier.damage 
                      ? "bg-red-600/30 border-red-500/50 shadow-[inset_0_0_10px_rgba(220,38,38,0.5)]" 
                      : "bg-slate-800/50 border-white/10"
                  )} />
                ))}
              </div>
            </div>

            <div 
              onClick={() => handleLocationClick(carrier.name)}
              className={cn(
                "group min-h-[90px] bg-black/40 rounded-lg p-3 border transition-all cursor-pointer relative",
                selectedUnitId ? "border-game-gold/40 bg-game-gold/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]" : "border-white/5"
              )}
            >
              <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  selectedUnitId ? "bg-game-gold animate-pulse" : "bg-slate-700"
                )} />
                Flight Deck
              </div>
              <div className="flex flex-wrap gap-2">
                {getUnitsAtLocation(carrier.name).map((u: Unit) => (
                  <UnitToken key={u.id} unit={u} />
                ))}
                {getUnitsAtLocation(carrier.name).length === 0 && (
                  <div className="w-full text-center py-4 text-slate-800 font-mono text-[9px] uppercase tracking-[0.2em] italic">
                    Deck Clear
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {carrier.capSlots.map((slot: string | null, i: number) => {
                const unitInSlot = slot ? units.find((u: Unit) => u.id === slot) : null;
                return (
                  <div 
                    key={i} 
                    onClick={() => handleLocationClick('CAP')}
                    className={cn(
                      "h-16 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden bg-black/40 group/cap",
                      selectedUnitId ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5"
                    )}
                  >
                    <div className="absolute top-1.5 left-2 text-[8px] font-black text-slate-700 uppercase tracking-tighter group-hover/cap:text-emerald-500 transition-colors">CAP {i+1}</div>
                    {unitInSlot ? (
                      <UnitToken unit={unitInSlot} className="scale-90" />
                    ) : (
                      <div className="text-[10px] text-slate-800 font-mono font-black uppercase tracking-widest opacity-20">Idle</div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 z-10 items-stretch">
        <div className="lg:col-span-2 p-8 bg-slate-950/40 rounded-2xl border border-white/5 flex flex-col gap-6 shadow-2xl backdrop-blur-xl relative overflow-hidden h-full">
          <div className="absolute top-0 left-0 w-1 h-full bg-game-gold opacity-50" />
          
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Strategy Council</h3>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.2em] leading-none mb-1">Fleet Discovery</span>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">US:</span>
                    <motion.span 
                      animate={!isUsFleetFound ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("w-2 h-2 rounded-full", isUsFleetFound ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-slate-700")} 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">JPN:</span>
                    <motion.span 
                      animate={!isJapanFleetFound ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("w-2 h-2 rounded-full", isJapanFleetFound ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-slate-700")} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.2em] leading-none mb-1 text-red-400">Midway Damage</span>
                <span className="text-xl font-black font-mono text-white leading-none">{midwayDamage}<span className="text-slate-600 text-xs">/12</span></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
            <button 
              onClick={() => state.setNextPhase()}
              disabled={
                (phase === 'RECON' && !state.isReconResolved) ||
                (phase === 'AMERICAN' && !state.isStrikeResolved)
              }
              className={cn(
                "px-8 py-4 font-black rounded-lg transition-all uppercase tracking-widest text-sm shadow-xl",
                ((phase === 'RECON' && !state.isReconResolved) ||
                 (phase === 'AMERICAN' && !state.isStrikeResolved))
                 ? "bg-slate-700 text-slate-500 cursor-not-allowed opacity-50"
                 : "bg-white text-black hover:bg-game-gold hover:-translate-y-0.5"
              )}
            >
              Advance to {phase === 'CLEANUP' ? 'Next Turn' : 'Next Phase'}
            </button>

            <button 
              onClick={() => setIsScenarioOpen(true)}
              className="px-8 py-4 border-2 border-white/20 text-white/60 font-black rounded-lg hover:border-game-gold hover:text-game-gold transition-all uppercase tracking-widest text-sm"
            >
              Historical Scenarios
            </button>
            
            {phase === 'RECON' && (
              <button 
                onClick={() => state.performRecon()}
                disabled={state.isReconResolved}
                className={cn(
                  "px-8 py-4 border-2 font-black rounded-lg transition-all uppercase tracking-widest text-sm",
                  state.isReconResolved 
                    ? "border-slate-800 text-slate-700 bg-slate-900/50 cursor-not-allowed" 
                    : "border-game-gold text-game-gold hover:bg-game-gold hover:text-black shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                )}
              >
                {state.isReconResolved 
                  ? "Recon Complete" 
                  : (state.isUsFleetFound && state.isJapanFleetFound) 
                    ? "Fleets Located (Confirm)" 
                    : "Launch Multi-Scout"}
              </button>
            )}

            {phase === 'JAPANESE' && (
              <button 
                onClick={() => resolveStrikes()}
                className={cn(
                  "px-8 py-4 border-2 font-black rounded-lg transition-all uppercase tracking-widest text-sm",
                  getUnitsAtLocation('STAGING').length > 0 || getUnitsAtLocation('MIDWAY_FLIGHT').length > 0
                    ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse"
                    : "border-slate-800 text-slate-700 cursor-not-allowed"
                )}
              >
                Commit Strike Package
              </button>
            )}

            {phase === 'AMERICAN' && (
              <button 
                onClick={() => performAmericanStrike()}
                disabled={state.isStrikeResolved}
                className={cn(
                  "px-8 py-4 text-white font-black rounded-lg transition-all uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(220,38,38,0.4)]",
                  state.isStrikeResolved ? "bg-slate-700 cursor-not-allowed opacity-50 shadow-none" : "bg-red-600 hover:bg-red-500 animate-pulse"
                )}
              >
                {state.isStrikeResolved ? "Strike Resolved" : "Weather the Storm"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div 
              onClick={() => handleLocationClick('STAGING')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all cursor-pointer bg-black/40 min-h-[120px]",
                selectedUnitId ? "border-emerald-500/30 hover:bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]" : "border-white/5"
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strike Staging (US Fleet)</span>
                <span className="px-2 py-0.5 bg-emerald-900/50 text-emerald-400 text-[8px] font-bold rounded border border-emerald-500/20">READY ZONE</span>
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
                "p-4 rounded-xl border-2 transition-all cursor-pointer bg-black/40 min-h-[120px]",
                selectedUnitId ? "border-amber-500/30 hover:bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]" : "border-white/5"
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Midway Attack Vector</span>
                <span className="px-2 py-0.5 bg-amber-900/50 text-amber-400 text-[8px] font-bold rounded border border-amber-500/20">TARGET ZONE</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getUnitsAtLocation('MIDWAY_FLIGHT').map((u: Unit) => (
                  <UnitToken key={u.id} unit={u} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-900/80 rounded-xl border border-white/5 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Turn Track / Fleet Recovery</h4>
              <span className="text-[9px] text-slate-600 italic">Sequential Return Cycles</span>
            </div>
            <div className="flex gap-4 min-h-[80px] overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3].map((delay) => (
                <div key={delay} className="flex-1 min-w-[120px] p-3 bg-black/20 rounded-lg border border-white/5 flex flex-col gap-3">
                  <div className="text-[9px] text-slate-600 uppercase font-black text-center border-b border-white/5 pb-1 tracking-widest">
                    Recovery T-{delay}
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {units
                      .filter((u: Unit) => u.location === 'TURN_TRACK' && u.turnsUntilReady === delay)
                      .map((u: Unit) => (
                        <UnitToken key={u.id} unit={u} className="w-8 h-8 !p-1 scale-90" />
                      ))
                    }
                    {units.filter((u: Unit) => u.location === 'TURN_TRACK' && u.turnsUntilReady === delay).length === 0 && (
                      <div className="h-8 flex items-center justify-center text-[10px] text-slate-800 font-mono italic">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/5 flex flex-col gap-4 shadow-xl backdrop-blur-md h-full">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Combat Log</h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest hidden sm:inline">Archives</span>
              <button onClick={() => setIsLogOpen(true)} className="text-slate-400 hover:text-white transition-colors">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[500px] min-h-0">
            {log.map((entry: LogEntry) => (
              <div key={entry.id} className={cn(
                "font-mono text-[11px] leading-relaxed border-l-2 pl-3 py-1.5 transition-all group",
                entry.type === 'SYSTEM' ? "text-game-gold border-game-gold/50 bg-game-gold/5 font-black uppercase tracking-tight py-2 my-2 border-l-4" : 
                entry.type === 'COMBAT' ? (entry.message.includes('CRITICAL') || entry.message.includes('SUNK') ? "text-red-400 border-red-500 bg-red-500/10 font-bold" : "text-red-400/80 border-red-900/40") :
                entry.type === 'RECON' ? "text-emerald-400 border-emerald-900/40" :
                entry.type === 'HISTORICAL' ? "text-blue-400 border-blue-500 bg-blue-500/5 italic" :
                "text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
              )}>
                <div className="flex justify-between items-start">
                  <span className="flex-1">{entry.message}</span>
                  <span className="opacity-0 group-hover:opacity-40 text-[8px] font-black uppercase ml-2 whitespace-nowrap">{entry.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isGameOver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-slate-950 border-2 border-game-gold/30 p-10 rounded-3xl max-w-xl w-full shadow-[0_0_100px_rgba(255,215,0,0.2)] animate-in zoom-in slide-in-from-bottom-10 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-game-gold opacity-5 rotate-45 translate-x-16 -translate-y-16" />
            
            <h2 className="text-5xl font-black text-game-gold text-center uppercase italic tracking-tighter mb-2 drop-shadow-lg">
              Mission Report
            </h2>
            <p className="text-center text-slate-400 font-mono text-sm uppercase mb-10 border-b border-white/10 pb-6 tracking-widest">
              Historical Assessment: <span className="text-white">{score.rating}</span>
            </p>

            <div className="space-y-6 mb-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Offensive Operations</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black font-mono text-white">{score.japanMidwayPoints + score.japanSquadronKillPoints}</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Points Gained</span>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Defense & Attrition</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black font-mono text-red-500">{score.totalUSScore}</span>
                    <span className="text-[10px] text-red-400 font-bold uppercase">Points Lost</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase font-bold tracking-tight">Midway Damage Bonus</span>
                  <span className="text-white font-mono">+{score.japanMidwayPoints}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase font-bold tracking-tight">US Air Attrition</span>
                  <span className="text-white font-mono">+{Math.round(score.japanSquadronKillPoints)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
                  <span className="text-slate-500 uppercase font-bold tracking-tight">Carrier Loss Penalty</span>
                  <span className="text-red-400 font-mono">-{score.usCarrierHitPoints + score.usCarrierSunkPoints}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase font-bold tracking-tight">Fleet Attrition Penalty</span>
                  <span className="text-red-400 font-mono">-{Math.round(score.usSquadronKillPoints)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-game-gold/5 p-6 rounded-2xl border border-game-gold/20 mt-8">
                <span className="text-2xl font-black text-white uppercase italic tracking-tighter">Final Score</span>
                <span className={cn(
                  "text-5xl font-black font-mono tracking-tighter",
                  score.finalScore >= 0 ? "text-game-gold" : "text-red-500"
                )}>
                  {score.finalScore > 0 ? `+${score.finalScore}` : score.finalScore}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => generateAAR(useGameStore.getState())}
                className="flex-1 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Export AAR
              </button>
              <button 
                onClick={() => resetGame()}
                className="flex-[2] py-4 bg-game-gold text-black font-black rounded-2xl hover:bg-yellow-500 transition-all uppercase tracking-widest shadow-[0_10px_30px_rgba(255,215,0,0.3)] hover:-translate-y-1 active:translate-y-0"
              >
                Return to Fleet Command
              </button>
            </div>
          </div>
        </div>
      )}
      <DiceTray />
      <AnimatePresence>
        {isScenarioOpen && (
          <ScenarioSelector 
            isOpen={isScenarioOpen} 
            onClose={() => setIsScenarioOpen(false)} 
          />
        )}
        {profileCarrier && (
          <CarrierProfileModal
            carrier={carriers[profileCarrier]}
            isOpen={!!profileCarrier}
            onClose={() => setProfileCarrier(null)}
          />
        )}
        {isLogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
               <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                 <div className="flex items-center gap-4">
                   <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Operational Log</h2>
                   <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                     {(['ALL', 'COMBAT', 'RECON'] as const).map(filter => (
                       <button
                         key={filter}
                         onClick={() => setLogFilter(filter)}
                         className={cn(
                           "px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all",
                           logFilter === filter ? "bg-game-gold text-black" : "text-slate-400 hover:text-white"
                         )}
                       >
                         {filter}
                       </button>
                     ))}
                   </div>
                 </div>
                 <button onClick={() => setIsLogOpen(false)} className="text-slate-400 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-lg">
                   <X size={20} />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar bg-slate-950/30">
                 {log
                   .filter(l => logFilter === 'ALL' || l.type === logFilter)
                   .map((entry: LogEntry) => (
                   <div key={entry.id} className={cn(
                     "font-mono text-xs leading-relaxed border-l-2 pl-4 py-2 transition-all flex gap-4",
                     entry.type === 'SYSTEM' ? "text-game-gold border-game-gold/50 bg-game-gold/5 font-bold py-3 my-2" : 
                     entry.type === 'COMBAT' ? "text-red-400/90 border-red-500/50 hover:bg-red-500/5" :
                     entry.type === 'RECON' ? "text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/5" :
                     "text-slate-300 border-slate-700 hover:bg-white/5"
                   )}>
                     <span className="text-[10px] text-slate-500 font-bold uppercase w-16 shrink-0 pt-0.5">{entry.timestamp || '00:00'}</span>
                     <span>{entry.message}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
        {isAdvisorOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
             <div className="bg-slate-900 border-2 border-game-gold/30 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden flex flex-col max-h-[80vh]">
               {/* Header */}
               <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-start">
                 <div className="flex gap-4">
                   <div className="p-3 bg-game-gold/10 rounded-lg border border-game-gold/20">
                     <FileText className="text-game-gold" size={24} />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                       {getAdvisorBriefing(state).title}
                     </h2>
                     <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mt-1">
                       Tactical Advisory System
                     </p>
                   </div>
                 </div>
                 <button onClick={() => setIsAdvisorOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                   <X size={24} />
                 </button>
               </div>

               {/* Content */}
               <div className="p-8 overflow-y-auto space-y-8">
                 {(() => {
                   const briefing = getAdvisorBriefing(state);
                   return (
                     <>
                       <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                         <h3 className="text-game-gold font-bold uppercase tracking-widest text-xs mb-2">Current Situation</h3>
                         <p className="text-lg text-white leading-relaxed font-serif italic">"{briefing.situation}"</p>
                       </div>

                       <div>
                         <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertTriangle size={12} /> Recommended Actions
                         </h3>
                         <ul className="space-y-3">
                           {briefing.orders.map((order, i) => (
                             <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                               <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                               <span className="leading-relaxed">{order}</span>
                             </li>
                           ))}
                         </ul>
                       </div>

                       <div className="border-t border-white/10 pt-6">
                         <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <BookOpen size={12} /> Rules Reference
                         </h3>
                         <ul className="grid grid-cols-1 gap-2">
                           {briefing.mechanics.map((mech, i) => (
                             <li key={i} className="flex gap-2 text-xs text-slate-400 font-mono items-center">
                               <div className="w-1 h-1 bg-slate-600 rounded-full" />
                               {mech}
                             </li>
                           ))}
                         </ul>
                       </div>
                     </>
                   );
                 })()}
               </div>
               
               <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                 <button 
                   onClick={() => setIsAdvisorOpen(false)}
                   className="px-8 py-3 bg-game-gold text-black font-black rounded-lg hover:bg-yellow-500 transition-all uppercase tracking-widest text-sm shadow-lg"
                 >
                   Acknowledge Orders
                 </button>
               </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
