# Kido Butai - Digital Adaptation

A web-based implementation of the tabletop dice game "Kido Butai: Japan's Carriers at Midway" that faithfully preserves the original rules while providing a modern digital experience.

## Features

### Game Modes

- **Hotseat (2 Players)**: Play against another player on the same device
- **Solo (Assisted)**: Single-player mode with rule enforcement and guidance
- **Strict Manual**: Full manual control with rule validation

### Core Gameplay

- Complete turn-based sequence from 04:30 to 19:30
- All four phases: Japanese, Mutual Reconnaissance, American, and Cleanup
- Hidden information simulation with cup/bag draw mechanics
- Dice-based combat resolution with authentic thresholds
- Carrier damage states and capacity reduction
- Turn track scheduling for returning aircraft

### User Interface

- **Premium Tactical Command Console**: Glassmorphic UI with discovery status, animated integrity bars, and high-impact action buttons
- **Tactile Unit Tokens**: Iconified counters with carrier-specific themes and status pips
- **High-Fidelity Visuals**: Dynamic dice tray, shaker animations for damaged carriers, and smooth layout-based unit transitions
- **Historical Engagement Scenarios**: Select presets like "The Fateful Five Minutes" to jump into specific historical contexts
- **Carrier Profile Dossiers**: Access detailed historical carrier data with premium technical dossier art and status analysis
- **Combat Log Architecture**: Structured `LogEntry` system with real-time status updates, type-based styling, and archival timestamps
- **Turn Track Visualization**: Sequential recovery cycles for returning aircraft
- **Immersive Audio System**: Context-aware sound effects for dice rolls, explosions, launches, recon, phase transitions, and carrier sinkings with volume controls
- **In-app rules reference**

### Game State Management

- Automatic save to browser localStorage
- Manual save/export functionality
- Game state import for sharing/replay
- Persistent storage across sessions

### Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Color-blind friendly design
- High contrast mode compatibility

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd kido-butai

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## How to Play

### Starting a New Game

1. Open the application in your browser
2. Select your preferred game mode:
   - **Hotseat**: Take turns with another player on the same device
   - **Solo**: Play against the system with rule assistance
   - **Strict Manual**: Full control with validation warnings
3. Click "New Game" to begin

### Game Flow

#### Japanese Phase

1. **CAP Management**: Existing CAP units are processed, Low CAP status is removed after 1 turn
2. **Launch Decisions**:
   - Send fighters to CAP slots for fleet defense
   - Launch strike aircraft to staging area (only if US fleet is found)
3. **Movement**: Fly strike packages to Fleet or Midway targets
4. **Combat**: Resolve air combat, then Normal or Special attacks
5. **Recovery**: Land returning aircraft and prepare squadrons for next turn

#### Mutual Reconnaissance Phase

- Roll dice to find enemy fleets
- US finds Japan on 5-6, Japan finds US on 6
- Continue rolling until both fleets are discovered

#### American Phase (Turn 3+ only)

- Draw bombers until dummy token
- Determine bomber type (1-3: Torpedo, 4-6: Dive)
- Draw fighters until dummy token
- Resolve air combat (note Low CAP restrictions)
- Execute Normal or Special attack on Japanese carriers

#### Cleanup Phase

- Process turn track queue for returning aircraft
- Advance turn marker
- Return American squadrons to cups

### Combat Resolution

The game uses d6 dice with specific thresholds for each combat type:

- **Fighter vs Fighter**: 5+ hit (destroy).
- **Fighter vs Bomber**: 5+ kill, 3-4 abort.
- **AA Fire**: 6 abort (no damage).
- **Normal Attack**: 1 hit on success (Dive Bomber 6, Torpedo Bomber 5+).
- **Special Attack (Unopposed)**: If a target has no effective CAP, any surviving bomber inflicts hits equal to the **total pips rolled** on the die (e.g., a roll of 4 = 4 hits).

#### Advanced Mechanics

- **Low CAP**: Fighters that intercept Torpedo Bombers become exhausted (CAP_LOW). They cannot intercept Dive Bombers until they recover in the next Cleanup phase.
- **Midway Cratering**: Damage to Midway reduces landing capacity. If damage exceeds 12, the base is effectively neutralized.
- **Carrier Sinking**: Standard carriers sink after 4 hits. Damaged carriers have reduced aircraft capacity.

### Victory Conditions

Points are scored based on:

- Squadrons destroyed (×0.25, rounded)
- Carriers damaged or sunk (various multipliers)
- Midway base damage

**Final Score = Japanese Total - US Total**

- ≤ -6: Major Japanese Defeat
- -5 to -1: Minor Japanese Defeat
- 0: Draw
- +1 to +5: Minor Japanese Victory
- ≥ +6: Major Japanese Victory

## Technical Implementation

### Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS for responsive design
- **State Management**: Zustand for game state
- **Random Number Generation**: Web Crypto API with seeded PRNG support

### Key Components

#### Data Models (`/src/types/`)

- `GameState`: Complete game state representation
- `UnitState`: Individual squadron information
- `CarrierState`: Carrier status and embarked aircraft
- `RulesPreset`: Configurable game parameters

#### Engine (`/src/engine/`)

- `RulesEngine`: Core game logic and phase management
- `CombatEngine`: Air combat and attack resolution
- `CupSystem`: Bag draw mechanics with dummy tokens

#### Store (`/src/store/`)

- `gameStore`: Zustand store with persistence
- Actions for game state modifications
- Selectors for derived state

#### Components (`/src/components/`)

- `GameBoard`: Main playing surface
- `ActionPanel`: Phase-specific actions
- `DiceTray`: Animated dice rolling
- `UnitToken`: Draggable squadron pieces
- `TurnTrack`: Timeline visualization

### Configuration

Game rules are configurable through the `RulesPreset` system:

- Combat thresholds and hit numbers
- Carrier capacities and damage effects
- Turn delays for returning aircraft
- Advanced rule toggles
- Scoring multipliers

### Development

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run build

# Linting
npm run lint

# Testing
npm test
npm run test:watch
```

### Building for Production

```bash
npm run build
npm start
```

The built application is a static site that can be deployed to any web server.

## Rules Fidelity

This implementation preserves the original tabletop rules with these digital adaptations:

### Physical to Digital Conversions

- **Counter rotation** → Status indicators and timers
- **Cup draws** → Bag draws without replacement until dummy
- **Hidden information** → Fog of war between players
- **Manual tracking** → Automated turn track and scheduling

### Verified Implementations

- All combat tables match original player aid
- Turn sequence follows detailed SOP exactly
- Scoring system uses correct multipliers and rounding
- Carrier damage and capacity reduction works as specified
- Special attack conditions are properly evaluated

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This is a digital adaptation of the tabletop game Kido Butai. All original game concepts and rules remain property of their respective owners.

## Acknowledgments

- Original game design and rules
- Player aid and reference materials
- Historical research on the Battle of Midway

---

_"The Battle of Midway was essentially a victory of intelligence, skill, and courage." - Admiral Chester W. Nimitz_
