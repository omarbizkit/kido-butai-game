import { Unit, UnitType, GameLocation } from '../types';
import { rollDice } from './rules';

export const generateUSStrike = (): { units: Unit[]; log: string[] } => {
  const log: string[] = ['--- Drawing American Strike Force ---'];
  const units: Unit[] = [];

  // 1. Draw Bombers
  let bombersDrawn = 0;
  while (true) {
    const [drawRoll] = rollDice(1);
    if (drawRoll >= 5) { // 5-6 is Dummy? (Conceptual check)
      log.push('US Bomber draw: Dummy pulled.');
      break;
    }
    
    bombersDrawn++;
    const [typeRoll] = rollDice(1);
    const type: UnitType = typeRoll <= 3 ? 'TORPEDO_BOMBER' : 'DIVE_BOMBER';
    
    units.push({
      id: `US-B${bombersDrawn}-${Date.now()}`,
      type,
      owner: 'US',
      status: 'IN_FLIGHT',
      location: 'FLEET_APPROACH' as GameLocation,
      hp: 1,
    });
    log.push(`US Bomber draw: Real unit pulled (${type}).`);
  }

  // 2. Draw Fighters
  let fightersDrawn = 0;
  while (true) {
    const [drawRoll] = rollDice(1);
    if (drawRoll >= 4) { // 4-6 is Dummy?
      log.push('US Fighter draw: Dummy pulled.');
      break;
    }
    
    fightersDrawn++;
    units.push({
      id: `US-F${fightersDrawn}-${Date.now()}`,
      type: 'FIGHTER',
      owner: 'US',
      status: 'IN_FLIGHT',
      location: 'FLEET_APPROACH' as GameLocation,
      hp: 3,
    });
    log.push('US Fighter draw: Real unit pulled (FIGHTER).');
  }

  if (units.length === 0) {
    log.push('US strike attempt resulted in no units launched.');
  } else {
    log.push(`US launches strike of ${bombersDrawn} bombers and ${fightersDrawn} fighters!`);
  }

  return { units, log };
};
