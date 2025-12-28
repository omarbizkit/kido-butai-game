import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getNextPhase, resolveRecon, canMoveUnit } from '../engine/rules';
import { GameLocation, GameState, JapaneseCarrier, Phase, Unit } from '../types';

interface GameStore extends GameState {
  selectedUnitId: string | null;
  selectUnit: (id: string | null) => void;
  setPhase: (phase: Phase) => void;
  setNextPhase: () => void;
  performRecon: () => void;
  moveUnit: (unitId: string, targetLocation: GameLocation) => void;
  addLog: (message: string) => void;
  resetGame: () => void;
}

const TURNS = [
  '04:30', '05:30', '06:30', '07:30', '08:30', '09:30', 
  '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', 
  '16:30', '17:30', '18:30', '19:30'
];

const createInitialUnits = (): Unit[] => {
  const carriers: JapaneseCarrier[] = ['AKAGI', 'KAGA', 'HIRYU', 'SORYU'];
  const units: Unit[] = [];

  carriers.forEach((carrier) => {
    units.push({ id: `${carrier}_F1`, type: 'FIGHTER', owner: 'JAPAN', carrier, status: 'READY', location: carrier });
    units.push({ id: `${carrier}_DB1`, type: 'DIVE_BOMBER', owner: 'JAPAN', carrier, status: 'READY', location: carrier });
    units.push({ id: `${carrier}_TB1`, type: 'TORPEDO_BOMBER', owner: 'JAPAN', carrier, status: 'READY', location: carrier });
  });

  return units;
};

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
  units: createInitialUnits(),
  midwayDamage: 0,
  isUsFleetFound: false,
  isJapanFleetFound: false,
  log: ['Game started at 04:30'],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      selectedUnitId: null,
      selectUnit: (id: string | null) => set({ selectedUnitId: id }),
      setPhase: (phase: Phase) => set({ phase }),
      addLog: (message: string) => set((state) => ({ log: [message, ...state.log].slice(0, 50) })),
      setNextPhase: () => {
        const state = get();
        const result = getNextPhase(state.phase, state.turnIndex);
        
        const updates: Partial<GameState> & { selectedUnitId: null } = {
          phase: result.nextPhase,
          log: [...result.logEntries, ...state.log].slice(0, 50),
          selectedUnitId: null
        };

        if (result.shouldAdvanceTurn) {
          const nextIndex = state.turnIndex + 1;
          if (nextIndex < TURNS.length) {
            updates.turnIndex = nextIndex;
            updates.turn = TURNS[nextIndex];
            updates.log = [`--- Turn ${TURNS[nextIndex]} ---`, ...updates.log!];
          }
        }

        set(updates);
      },
      performRecon: () => {
        const state = get();
        const result = resolveRecon(state);
        const { log, ...others } = result;
        set((prev) => ({
          ...prev,
          ...others,
          log: [...log, ...prev.log].slice(0, 50)
        }));
      },
      moveUnit: (unitId: string, targetLocation: GameLocation) => {
        const state = get();
        const unit = state.units.find(u => u.id === unitId);
        if (!unit) return;

        const validation = canMoveUnit(unit, targetLocation, state);
        if (!validation.allowed) {
          set((s) => ({ log: [`Order rejected: ${validation.reason}`, ...s.log].slice(0, 50) }));
          return;
        }

        const carriers = { ...state.carriers };
        const oldLocation = unit.location;

        // Handle CAP transitions
        if (oldLocation === 'CAP') {
          const carrier = carriers[unit.carrier!];
          carrier.capSlots = carrier.capSlots.map(s => s === unitId ? null : s);
        }

        if (targetLocation === 'CAP') {
          const carrier = carriers[unit.carrier!];
          const emptySlot = carrier.capSlots.indexOf(null);
          if (emptySlot !== -1) {
            carrier.capSlots[emptySlot] = unitId;
          }
        }

        const newUnits = state.units.map(u => 
          u.id === unitId ? { ...u, location: targetLocation, status: targetLocation === 'CAP' ? 'CAP_NORMAL' : u.status } : u
        );

        set({ 
          units: newUnits, 
          carriers, 
          selectedUnitId: null,
          log: [`Squadron ${unitId} moved to ${targetLocation}`, ...state.log].slice(0, 50)
        });
      },
      resetGame: () => set(INITIAL_STATE),
    }),
    {
      name: 'kido-butai-storage',
    }
  )
);
