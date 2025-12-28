import { GameState, JapaneseCarrier } from '../types';

export interface ScoreBreakdown {
  japanMidwayPoints: number;
  japanUSFleetPoints: number;
  japanSquadronLosses: number; // Penalty
  japanSquadronKillPoints: number;
  usCarrierHitPoints: number;
  usCarrierSunkPoints: number;
  usSquadronKillPoints: number;
  totalJapanScore: number;
  totalUSScore: number;
  finalScore: number;
  rating: string;
  isGameOver: boolean;
}

export const calculateScore = (state: GameState): ScoreBreakdown => {
  // Japan Points
  const japanMidwayPoints = state.midwayDamage; // 1 pt per hit
  
  // Japan also gets points for US squadron kills? 
  // Let's stick to the README: "Squadrons destroyed (x0.25, rounded)" usually applies to both sides.
  const usSquadronsDestroyed = state.units.filter(u => u.owner === 'US' && u.status === 'DESTROYED').length;
  const japanSquadronKillPoints = Math.round(usSquadronsDestroyed * 0.25);

  // US Points
  let usCarrierHitPoints = 0;
  let usCarrierSunkPoints = 0;
  
  Object.values(state.carriers).forEach(carrier => {
    if (carrier.isSunk) {
      usCarrierSunkPoints += 10; // Sinking a carrier is big
    } else {
      usCarrierHitPoints += carrier.damage * 2; // 2 pts per damage point
    }
  });

  const japanSquadronsDestroyed = state.units.filter(u => u.owner === 'JAPAN' && u.status === 'DESTROYED').length;
  const usSquadronKillPoints = Math.round(japanSquadronsDestroyed * 0.25);

  const totalJapanScore = japanMidwayPoints + japanSquadronKillPoints;
  const totalUSScore = usCarrierHitPoints + usCarrierSunkPoints + usSquadronKillPoints;
  const finalScore = totalJapanScore - totalUSScore;

  let rating = 'Draw';
  if (finalScore <= -6) rating = 'Major Japanese Defeat';
  else if (finalScore <= -1) rating = 'Minor Japanese Defeat';
  else if (finalScore >= 6) rating = 'Major Japanese Victory';
  else if (finalScore >= 1) rating = 'Minor Japanese Victory';

  // Game over check:
  // 1. All carriers sunk
  // 2. Final turn reached (19:30) and phase is Cleanup -> Next
  const allCarriersSunk = Object.values(state.carriers).every(c => c.isSunk);
  const isFinalTurn = state.turn === '19:30';
  
  return {
    japanMidwayPoints,
    japanUSFleetPoints: 0,
    japanSquadronLosses: japanSquadronsDestroyed,
    japanSquadronKillPoints,
    usCarrierHitPoints,
    usCarrierSunkPoints,
    usSquadronKillPoints,
    totalJapanScore,
    totalUSScore,
    finalScore,
    rating,
    isGameOver: allCarriersSunk || isFinalTurn,
  };
};
