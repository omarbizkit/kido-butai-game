import { GameState, JapaneseCarrier } from '../types';

export interface TargetScore {
  carrier: JapaneseCarrier;
  score: number;
  reason: string;
}

export const selectUsTarget = (state: GameState): { target: JapaneseCarrier; reason: string } => {
  const carriers: JapaneseCarrier[] = ['AKAGI', 'KAGA', 'HIRYU', 'SORYU'];
  const activeCarriers = carriers.filter(c => !state.carriers[c].isSunk);

  if (activeCarriers.length === 0) {
    // Should not happen if game over checks are working, but fallback
    return { target: 'AKAGI', reason: 'No active carriers found' };
  }

  // Calculate "Attractiveness Score" for each carrier
  // Higher score = more likely to be targeted
  const scores: TargetScore[] = activeCarriers.map(carrierId => {
    const carrier = state.carriers[carrierId];
    let score = 0;
    const reasons: string[] = [];

    // 1. Damage Priority: "Finish them off"
    // A carrier with 3 damage is 1 hit away from sinking.
    if (carrier.damage >= 3) {
      score += 50;
      reasons.push('CRITICAL DAMAGE');
    } else if (carrier.damage > 0) {
      score += 20;
      reasons.push('DAMAGED');
    }

    // 2. CAP Vulnerability
    const capUnits = state.units.filter(u => u.location === 'CAP' && u.carrier === carrierId);
    const effectiveCap = capUnits.filter(u => u.status === 'CAP_NORMAL').length;
    const lowCap = capUnits.filter(u => u.status === 'CAP_LOW').length;

    if (effectiveCap === 0 && lowCap === 0) {
      score += 40; // Naked carrier, huge target
      reasons.push('NO CAP');
    } else if (effectiveCap === 0 && lowCap > 0) {
      score += 25; // Only exhausted CAP
      reasons.push('WEAK CAP');
    } else if (effectiveCap < 2) {
      score += 10; // Light CAP
    }

    // 3. Flagship Bias (Akagi) - Historically focused
    if (carrierId === 'AKAGI') {
      score += 5;
    }

    // 4. Random Flux (Fog of War)
    const flux = Math.floor(Math.random() * 20); // 0-19 random factor
    score += flux;

    return {
      carrier: carrierId,
      score,
      reason: reasons.length > 0 ? reasons.join(', ') : 'OPPORTUNITY'
    };
  });

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Return the winner
  const bestTarget = scores[0];
  return { target: bestTarget.carrier, reason: bestTarget.reason };
};
