export type Phase = 'JAPANESE' | 'RECON' | 'AMERICAN' | 'CLEANUP';

export type JapaneseCarrier = 'AKAGI' | 'KAGA' | 'HIRYU' | 'SORYU';

export type UnitType = 'FIGHTER' | 'DIVE_BOMBER' | 'TORPEDO_BOMBER';

export type UnitStatus = 'READY' | 'STAGING' | 'IN_FLIGHT' | 'RETURNING' | 'DESTROYED' | 'CAP_LOW' | 'CAP_NORMAL';

export interface Unit {
  id: string;
  type: UnitType;
  owner: 'JAPAN' | 'US';
  carrier?: JapaneseCarrier;
  status: UnitStatus;
  turnsUntilReady?: number;
}

export interface CarrierState {
  name: JapaneseCarrier;
  damage: number; // 0-4?
  isSunk: boolean;
  capacity: number;
  capSlots: (string | null)[]; // unit ids
}

export interface GameState {
  turn: string; // "04:30", etc.
  turnIndex: number;
  phase: Phase;
  carriers: Record<JapaneseCarrier, CarrierState>;
  units: Unit[];
  midwayDamage: number;
  isUsFleetFound: boolean;
  isJapanFleetFound: boolean;
  log: string[];
}
