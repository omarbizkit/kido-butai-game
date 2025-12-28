import { Phase, GameState, GameLocation, Unit } from '../types';

export const PHASES: Phase[] = ['JAPANESE', 'RECON', 'AMERICAN', 'CLEANUP'];

export const processTurnTrack = (units: Unit[]): { units: Unit[]; log: string[] } => {
  const log: string[] = [];
  const nextUnits = units.map(u => {
    if (u.location === 'TURN_TRACK' && u.turnsUntilReady !== undefined) {
      const nextTurns = u.turnsUntilReady - 1;
      if (nextTurns <= 0) {
        log.push(`${u.id} returned to ${u.carrier || 'Ready Deck'} and is now combat ready.`);
        return {
          ...u,
          location: u.carrier as GameLocation || 'POOL',
          status: 'READY' as const,
          turnsUntilReady: undefined
        };
      }
      return { ...u, turnsUntilReady: nextTurns };
    }
    return u;
  });

  return { units: nextUnits, log };
};

export interface RulesResult {
  nextPhase: Phase;
  shouldAdvanceTurn: boolean;
  logEntries: string[];
}

export const canMoveUnit = (unit: Unit, targetLocation: GameLocation, state: GameState): { allowed: boolean; reason?: string } => {
  if (state.phase !== 'JAPANESE') return { allowed: false, reason: 'Can only move units in Japanese Phase' };
  
  // Basic carrier capacity check (simulated as 3 for now in summary, but types have slots)
  if (targetLocation === 'CAP') {
    if (unit.type !== 'FIGHTER') return { allowed: false, reason: 'Only fighters can go to CAP' };
    
    // Check if there is an empty slot on its carrier
    const carrier = state.carriers[unit.carrier!];
    if (carrier.capSlots.every(s => s !== null)) return { allowed: false, reason: 'All CAP slots full for this carrier' };
  }

  if (targetLocation === 'STAGING') {
    if (!state.isUsFleetFound) return { allowed: false, reason: 'US Fleet must be found to launch strike' };
  }

  if (targetLocation === 'MIDWAY_FLIGHT') {
    if (unit.type === 'TORPEDO_BOMBER') return { allowed: false, reason: 'Torpedo bombers only attack carriers' };
  }

  return { allowed: true };
};

export const getNextPhase = (currentPhase: Phase, turnIndex: number): RulesResult => {
// ... existing getNextPhase
  const result: RulesResult = {
    nextPhase: currentPhase,
    shouldAdvanceTurn: false,
    logEntries: [],
  };

  const phaseIndex = PHASES.indexOf(currentPhase);
  
  if (phaseIndex < PHASES.length - 1) {
    result.nextPhase = PHASES[phaseIndex + 1];
    
    // Skip AMERICAN phase for first two turns (04:30, 05:30)
    if (result.nextPhase === 'AMERICAN' && turnIndex < 2) {
      result.nextPhase = 'CLEANUP';
      result.logEntries.push('US strikes skipped (early morning)');
    }
  } else {
    // Current is CLEANUP, move to next turn
    result.nextPhase = 'JAPANESE';
    result.shouldAdvanceTurn = true;
  }

  result.logEntries.push(`Transitioned to ${result.nextPhase} phase`);
  return result;
};

export const rollDice = (count: number = 1): number[] => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
};

export const resolveRecon = (state: GameState): Partial<GameState> & { log: string[] } => {
  const japanRoll = rollDice(1)[0];
  const usRoll = rollDice(1)[0];
  const logs: string[] = [];
  const updates: Partial<GameState> = {};

  if (!state.isUsFleetFound) {
    logs.push(`Japan recon roll: ${japanRoll}`);
    if (japanRoll >= 6) {
      updates.isUsFleetFound = true;
      logs.push('US Task Force located!');
    }
  }

  if (!state.isJapanFleetFound) {
    logs.push(`US recon roll: ${usRoll}`);
    if (usRoll >= 5) {
      updates.isJapanFleetFound = true;
      logs.push('Kido Butai discovered by US scouts!');
    }
  }

  return { ...updates, log: logs };
};
