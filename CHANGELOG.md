# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-12-28

### Added

- **Carrier Silhouettes**: Integrated procedural SVG silhouettes for Akagi, Kaga, Hiryu, and Soryu into the Flight Deck cards.
- **Unit HP Badges**: Unit tokens now display their remaining Steps (HP).
- **Step Reduction System**: Japanese units now start with 2 Steps (HP) matching standard "Full/Flipped" mechanics.
- **Interactive Combat**: American Strike phase now highlights the active unit and resolves attacks sequentially with a delay for dramatic effect.

### Changed

- **Inventory Balance**: Reverted Japanese initial roster to 3 squadrons per carrier (1F, 1DB, 1TB) with 2 HP each.
- **US Strike Balance**: Reduced generated US units to 1 HP to simulate waves and prevent overwhelming 3-HP defense.
- **Advance Phase Logic**: The "Advance to Next Phase" button is now disabled until mandatory phase actions (Recon, Strike) are resolved.
- **Sunk Carrier Rules**:
  - Units cannot be moved to/from a Sunk carrier.
  - Returning aircraft ditch (are destroyed) if their carrier is sunk.
- **Recon Logic**: "Launch Multi-Scout" button now confirms intelligence if both fleets are already found, effectively skipping the roll.

### Fixed

- **US Hidden Strike**: Prevented US from launching strikes if Kido Butai has not been detected (`isJapanFleetFound` check).
- **Combat Resolution**: Fixed game freezing or skipping logic during simultaneous strikes.
- **Type Safety**: added `POOL` to `GameLocation` and updated function signatures in `rules.ts`.
