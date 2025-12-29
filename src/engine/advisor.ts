import { GameState, Phase } from '../types';

export interface AdvisorBriefing {
  title: string;
  situation: string;
  orders: string[];
  mechanics: string[];
}

export const getAdvisorBriefing = (state: GameState): AdvisorBriefing => {
  const { turn, phase, isUsFleetFound, isJapanFleetFound, carriers, units, log } = state;

  // 1. Initial State (Game Start)
  if (turn === '04:30' && phase === 'JAPANESE' && !isUsFleetFound) {
    return {
      title: 'Mission Briefing: Operation MI',
      situation: 'The Kido Butai has arrived at Midway. We must neutralize the US Carriers before they find us.',
      orders: [
        'Launch scouts immediately when the phase changes to RECON.',
        'Keep your CAP (Combat Air Patrol) fighters ready.',
        'Prepare strike packages on the flight decks.'
      ],
      mechanics: [
        'The game is played in 4 phases: Japanese Action, Recon, American Action, Cleanup.',
        'You can only move units during the Japanese Phase.',
        'Fighters protect carriers (CAP). Bombers attack targets.'
      ]
    };
  }

  // 2. Phase-Based Advice
  switch (phase) {
    case 'JAPANESE':
      const readyBombers = units.filter(u => u.location.includes('_') && u.type !== 'FIGHTER').length;
      const stagingBombers = units.filter(u => u.location === 'STAGING').length;
      
      const orders = [];
      if (!isUsFleetFound) {
        orders.push('The US Fleet is hidden. You cannot launch strikes against them yet.');
        orders.push('You CAN launch strikes against Midway Island (Target Zone).');
      } else {
        orders.push('US Fleet DETECTED! Prioritize launching strike packages to the "Strike Staging" area.');
      }
      
      if (stagingBombers > 0) {
        orders.push(`You have ${stagingBombers} units in Staging. Click "Commit Strike Package" to launch attack.`);
      }

      return {
        title: 'Command Phase: Flight Ops',
        situation: 'The flight decks are active. You may move units and launch strikes.',
        orders: orders.length > 0 ? orders : ['Move units from Ready Deck to Staging or CAP.', 'Ensure you have Fighters in CAP slots for defense.'],
        mechanics: [
          'Click a unit to select it, then click a destination (CAP slot, Staging, or Midway Vector).',
          'Torpedo Bombers can ONLY target ships (Staging).',
          'Dive Bombers can target ships or land (Midway).'
        ]
      };

    case 'RECON':
      if (state.isReconResolved) {
        return {
          title: 'Reconnaissance Report',
          situation: 'Scout planes have returned.',
          orders: ['Click "Advance to American Phase" to continue.'],
          mechanics: ['Recon outcomes are final for this turn.']
        };
      }
      return {
        title: 'Reconnaissance Phase',
        situation: 'Scout planes are searching the ocean sectors.',
        orders: [
          'Click "Launch Multi-Scout" to roll for detection.',
          'If you find the US Fleet, you can attack them next turn.'
        ],
        mechanics: [
          'Japan needs a 6 to find the US Fleet.',
          'The US needs a 5+ to find you.',
          'Once found, a fleet remains visible for the rest of the game.'
        ]
      };

    case 'AMERICAN':
      if (state.isStrikeResolved) {
        return {
          title: 'Damage Control',
          situation: 'Enemy attack wave has passed.',
          orders: ['Click "Advance to Cleanup Phase" to recover aircraft.'],
          mechanics: ['Damage has been applied. Check carrier status.']
        };
      }
      const threatLevel = isJapanFleetFound ? 'CRITICAL' : 'LOW';
      return {
        title: 'Enemy Action Phase',
        situation: `US Forces are counter-attacking. Threat Level: ${threatLevel}`,
        orders: [
          'Click "Weather the Storm" to resolve US attacks.',
          'Pray your CAP fighters intercept the incoming bombers.'
        ],
        mechanics: [
          'US attacks are automated.',
          'Your CAP fighters provide the first line of defense.',
          'AA (Anti-Air) fire provides the second line.',
          'Damage is applied automatically to your carriers.'
        ]
      };

    case 'CLEANUP':
      return {
        title: 'Recovery Phase',
        situation: 'Aircraft are returning and being serviced.',
        orders: [
          'Click "Advance to Next Turn" to cycle the timeline.',
          'Returning aircraft will move one step closer to readiness.'
        ],
        mechanics: [
          'Units in "Returning" status move down the recovery track.',
          'Exhausted CAP fighters (Low) recover to Normal status.'
        ]
      };
      
    default:
      return {
        title: 'Standard Operations',
        situation: 'Awaiting orders.',
        orders: ['Review the board state.'],
        mechanics: []
      };
  }
};
