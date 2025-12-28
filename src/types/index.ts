export type AttackType = 'BOMB' | 'TORPEDO' | 'FIGHTER';
export type Target = JapaneseCarrier | 'MIDWAY' | 'US_TF';

export interface CombatResult {
  attackerId: string;
  target: Target;
  rolls: number[];
  hits: number;
  aborted: boolean;
  destroyed: boolean;
}

export type Phase = 'JAPANESE' | 'RECON' | 'AMERICAN' | 'CLEANUP';

export type JapaneseCarrier = 'AKAGI' | 'KAGA' | 'HIRYU' | 'SORYU';

export type UnitType = 'FIGHTER' | 'DIVE_BOMBER' | 'TORPEDO_BOMBER';

export type UnitStatus = 'READY' | 'STAGING' | 'IN_FLIGHT' | 'RETURNING' | 'DESTROYED' | 'CAP_LOW' | 'CAP_NORMAL' | 'POOL';

export type GameLocation = 
  | JapaneseCarrier 
  | 'MIDWAY' 
  | 'STAGING' 
  | 'FLEET_APPROACH' 
  | 'FLEET_TARGET' 
  | 'MIDWAY_FLIGHT' 
  | 'MIDWAY_TARGET' 
  | 'US_POOL' 
  | 'TURN_TRACK'
  | 'CAP';

export interface Unit {
  id: string;
  type: UnitType;
  owner: 'JAPAN' | 'US';
  carrier?: JapaneseCarrier; // Original carrier for Japan
  status: UnitStatus;
  location: GameLocation;
  turnsUntilReady?: number;
}

export interface CarrierState {
  name: JapaneseCarrier;
  damage: number; // 0-4?
  isSunk: boolean;
  capacity: number;
  capSlots: (string | null)[]; // unit ids
  lastHitTime?: number; // timestamp for shake animations
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
  isGameOver: boolean;
  activeRolls?: number[];
  currentScenario?: string;
}

export type Scenario = {
  id: string;
  name: string;
  description: string;
  startTime: string;
  initialState: Partial<GameState>;
};
