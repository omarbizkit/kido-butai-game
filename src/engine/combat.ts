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

  // 1. US CAP Interception (only if target is TF)
  if (target === 'US_TF') {
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

  if (unit.type === 'FIGHTER') {
    // Fighters vs US TF (if they get through) or vs Midway
    if (attackRoll >= 5) result.hits = 1;
  } else if (unit.type === 'DIVE_BOMBER') {
    if (target === 'MIDWAY') {
      if (attackRoll >= 6) result.hits = 1;
    } else {
      // vs TF: 6+ for hit (simplified)
      if (attackRoll >= 6) result.hits = 1;
    }
  } else if (unit.type === 'TORPEDO_BOMBER') {
    if (target === 'US_TF') {
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
        }
      };
      logs.push(`${target} hit for ${hits}! Current damage: ${newDamage}`);
      if (newDamage >= 4) logs.push(`CRITICAL: ${target} is sinking!`);
    }
  }

  return { ...updates, log: logs };
};
