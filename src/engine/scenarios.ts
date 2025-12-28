import { Scenario, GameState, Unit, UnitStatus, GameLocation } from '../types';
import { logsToEntries } from '../utils/log';

export const SCENARIOS: Scenario[] = [
  {
    id: 'STANDARD_MORNING',
    name: 'Morning Strike',
    description: 'The standard 04:30 start. Secure the skies over Midway and locate the US Task Force.',
    startTime: '04:30',
    initialState: {
      turnIndex: 0,
      turn: '04:30',
      phase: 'JAPANESE',
    }
  },
  {
    id: 'FATEFUL_FIVE',
    name: 'The Fateful Five Minutes',
    description: '10:25 AM. Japanese flight decks are packed with rearmed bombers. US Dive Bombers are diving. Can you survive the onslaught?',
    startTime: '10:30',
    initialState: {
      turnIndex: 6,
      turn: '10:30',
      phase: 'AMERICAN',
      midwayDamage: 8,
      isUsFleetFound: true,
      log: logsToEntries(['HISTORICAL: 10:25 AM. US SBD Dauntlesses are beginning their dives!', 'All Japanese carriers have bombers spotted on deck!'], 'HISTORICAL'),
    }
  },
  {
    id: 'HIRYU_REVENGE',
    name: "Hiryū's Revenge",
    description: '14:30 PM. Akagi, Kaga, and Soryu are burning wrecks. Hiryu is the lone survivor. Launch everything against the US Task Force!',
    startTime: '14:30',
    initialState: {
      turnIndex: 10,
      turn: '14:30',
      phase: 'JAPANESE',
      midwayDamage: 10,
      isUsFleetFound: true,
      isJapanFleetFound: true,
      log: logsToEntries(['HISTORICAL: 14:30 PM. Hiryu stands alone against the US fleet.', 'Avenge the Kido Butai!'], 'HISTORICAL'),
    }
  }
];

export const applyScenario = (scenarioId: string, baseState: GameState): GameState => {
  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) return baseState;

  let newState = { ...baseState, ...scenario.initialState, currentScenario: scenario.id };

  // Special logic for Fateful Five
  if (scenarioId === 'FATEFUL_FIVE') {
    // move all DB/TB to STAGING (on deck) to make them vulnerable
    newState.units = newState.units.map(u => {
      if (u.owner === 'JAPAN' && (u.type === 'DIVE_BOMBER' || u.type === 'TORPEDO_BOMBER')) {
        return { ...u, location: 'STAGING' as GameLocation, status: 'STAGING' as UnitStatus };
      }
      return u;
    });
  }

  // Special logic for Hiryu's Revenge
  if (scenarioId === 'HIRYU_REVENGE') {
    // Sink others
    newState.carriers = {
      ...newState.carriers,
      AKAGI: { ...newState.carriers.AKAGI, damage: 4, isSunk: true },
      KAGA: { ...newState.carriers.KAGA, damage: 4, isSunk: true },
      SORYU: { ...newState.carriers.SORYU, damage: 4, isSunk: true },
    };
    // Destroy their units
    newState.units = newState.units.map(u => {
      if (u.carrier && ['AKAGI', 'KAGA', 'SORYU'].includes(u.carrier)) {
        return { ...u, status: 'DESTROYED' as UnitStatus, location: 'POOL' as GameLocation };
      }
      return u;
    });
  }

  return newState;
};
