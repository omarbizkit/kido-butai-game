import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, JapaneseCarrier, Phase } from '../types';

interface GameStore extends GameState {
  setPhase: (phase: Phase) => void;
  advanceTurn: () => void;
  addLog: (message: string) => void;
  resetGame: () => void;
}

const INITIAL_STATE: GameState = {
  turn: '04:30',
  turnIndex: 0,
  phase: 'JAPANESE',
  carriers: {
    AKAGI: { name: 'AKAGI', damage: 0, isSunk: false, capacity: 3, capSlots: [null, null] },
    KAGA: { name: 'KAGA', damage: 0, isSunk: false, capacity: 3, capSlots: [null, null] },
    HIRYU: { name: 'HIRYU', damage: 0, isSunk: false, capacity: 3, capSlots: [null, null] },
    SORYU: { name: 'SORYU', damage: 0, isSunk: false, capacity: 3, capSlots: [null, null] },
  },
  units: [],
  midwayDamage: 0,
  isUsFleetFound: false,
  isJapanFleetFound: false,
  log: ['Game started at 04:30'],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setPhase: (phase) => set({ phase }),
      addLog: (message) => set((state) => ({ log: [message, ...state.log].slice(0, 50) })),
      advanceTurn: () => set((state) => {
        const turns = ['04:30', '06:00', '07:30', '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'];
        const nextIndex = state.turnIndex + 1;
        if (nextIndex < turns.length) {
          return {
            turnIndex: nextIndex,
            turn: turns[nextIndex],
            phase: 'JAPANESE',
          };
        }
        return state;
      }),
      resetGame: () => set(INITIAL_STATE),
    }),
    {
      name: 'kido-butai-storage',
    }
  )
);
