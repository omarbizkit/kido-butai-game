import { Unit, GameState, CombatResult, Target, AttackType, JapaneseCarrier } from '../types';
import { rollDice } from './rules';

export const resolveAA = (unit: Unit): { aborted: boolean; roll: number } => {
  const [roll] = rollDice(1);
  // US AA vs Japanese Bomber: 5+ abort
  const aborted = (unit.type !== 'FIGHTER') && roll >= 5;
  return { aborted, roll };
};

export const resolveInterception = (
  unit: Unit,
  isUsCap: boolean
): { destroyed: boolean; aborted: boolean; roll: number } => {
  const [roll] = rollDice(1);
  let aborted = false;
  let destroyed = false;

  if (isUsCap) {
    if (unit.type === 'FIGHTER') {
      // US CAP vs Japanese Fighter: 6 hit (destroy)
      if (roll >= 6) destroyed = true;
    } else {
      // US CAP vs Japanese Bomber: 5+ hit (destroy), 3-4 abort
      if (roll >= 5) destroyed = true;
      else if (roll >= 3) aborted = true;
    }
  } else {
    // Japanese Fighter vs US CAP (represented as rolls for the attacker)
    // 5+ hit
    if (roll >= 5) destroyed = true; 
  }

  return { destroyed, aborted, roll };
};

export const resolveJapaneseStrike = (
  unit: Unit,
  target: Target,
  state: GameState
): CombatResult => {
  const result: CombatResult = {
    attackerId: unit.id,
    target,
    rolls: [],
    hits: 0,
    aborted: false,
    destroyed: false,
  };

  // 1. US CAP Interception (only if target is US_TF)
  // Historical note: US CAP in this game doesn't have "Low CAP" state usually, 
  // but they can be bypassed or defeated.
  if (target === 'US_TF') {
    if (state.isUsFleetFound) { 
      // Simplified: US always has some CAP if found, unless we implement US carrier damage
      const intercept = resolveInterception(unit, true);
      result.rolls.push(intercept.roll);
      if (intercept.destroyed) {
        result.destroyed = true;
        return result;
      }
      if (intercept.aborted) {
        result.aborted = true;
        return result;
      }
    }
  }

  // 2. AA Fire
  const aa = resolveAA(unit);
  result.rolls.push(aa.roll);
  if (aa.aborted) {
    result.aborted = true;
    return result;
  }

  // 3. Final Attack
  const [attackRoll] = rollDice(1);
  result.rolls.push(attackRoll);

  // UNOPPOSED CHECK: If Midway target (no CAP) or US TF without CAP (not implemented yet)
  const isUnopposed = target === 'MIDWAY'; // Midway is always unopposed by CAP in this game

  if (isUnopposed) {
    // Special Rule: Hits = Pips rolled
    result.hits = attackRoll;
  } else {
    // Normal Attack: 1 hit on success
    if (unit.type === 'FIGHTER') {
      if (attackRoll >= 5) result.hits = 1;
    } else if (unit.type === 'DIVE_BOMBER') {
      if (attackRoll >= 6) result.hits = 1;
    } else if (unit.type === 'TORPEDO_BOMBER') {
      if (attackRoll >= 5) result.hits = 1;
    }
  }

  return result;
};

export const resolveAmericanStrike = (
  unit: Unit,
  targetCarrier: JapaneseCarrier,
  state: GameState
): CombatResult => {
  const result: CombatResult = {
    attackerId: unit.id,
    target: targetCarrier,
    rolls: [],
    hits: 0,
    aborted: false,
    destroyed: false,
  };

  // 1. Japan CAP Interception
  const carrier = state.carriers[targetCarrier];
  const capUnits = state.units.filter(u => 
    u.location === 'CAP' && 
    u.carrier === targetCarrier && 
    u.status !== 'DESTROYED'
  );
  
  const hasNormalCap = capUnits.some(u => u.status === 'CAP_NORMAL');
  const hasLowCap = capUnits.some(u => u.status === 'CAP_LOW');
  
  let capEngaged = false;
  if (hasNormalCap) {
    capEngaged = true;
  } else if (hasLowCap && unit.type !== 'DIVE_BOMBER') {
    // Low CAP can intercept Torpedo Bombers and Fighters, but NOT Dive Bombers
    capEngaged = true;
  }

  if (capEngaged) {
    const [roll] = rollDice(1);
    result.rolls.push(roll);
    
    if (unit.type === 'FIGHTER') {
      // Fighter vs Fighter: 5+ destroy
      if (roll >= 5) result.destroyed = true;
    } else {
      // CAP vs US Bomber: 5+ destroy, 3-4 abort
      if (roll >= 5) result.destroyed = true;
      else if (roll >= 3) result.aborted = true;
    }
    
    if (result.destroyed || result.aborted) return result;
  }

  // 2. Japanese AA
  const [aaRoll] = rollDice(1);
  result.rolls.push(aaRoll);
  // AA vs US Bomber: 6 aborts
  if (unit.type !== 'FIGHTER' && aaRoll >= 6) {
    result.aborted = true;
    return result;
  }

  // 3. Attack Run
  const [attackRoll] = rollDice(1);
  result.rolls.push(attackRoll);

  // UNOPPOSED CHECK
  // Unopposed if no CAP was engaged
  if (!capEngaged) {
    // Special Rule: Pips = Hits
    result.hits = attackRoll;
  } else {
    // Normal Attack
    if (unit.type === 'DIVE_BOMBER') {
      if (attackRoll >= 6) result.hits = 1;
    } else if (unit.type === 'TORPEDO_BOMBER') {
      if (attackRoll >= 5) result.hits = 1;
    }
  }

  return result;
};

export const applyDamage = (
  target: Target,
  hits: number,
  state: GameState
): Partial<GameState> & { log: string[] } => {
  const logs: string[] = [];
  const updates: any = {};

  if (target === 'MIDWAY') {
    updates.midwayDamage = (state.midwayDamage || 0) + hits;
    logs.push(`Midway takes ${hits} damage! Total: ${updates.midwayDamage}`);
  } else if (target === 'US_TF') {
    logs.push(`US Task Force hammered for ${hits} hits!`);
    // US TF damage logic (sinking carriers etc) would go here
  } else {
    // Target is a specific Japanese Carrier (e.g. from US attack)
    const carrier = state.carriers[target as JapaneseCarrier];
    if (carrier) {
      const newDamage = carrier.damage + hits;
      updates.carriers = {
        ...state.carriers,
        [target]: {
          ...carrier,
          damage: newDamage,
          isSunk: newDamage >= 4,
          lastHitTime: Date.now(),
        }
      };
      logs.push(`${target} hit for ${hits}! Current damage: ${newDamage}`);
      if (newDamage >= 4) logs.push(`CRITICAL: ${target} is sinking!`);
    }
  }

  return { ...updates, log: logs };
};
