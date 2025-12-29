# Audio Files for Kido Butai

## Required Sound Effects

Place the following MP3 files in this directory:

### Sound Effects (SFX)
1. **dice-roll.mp3** - Dice rolling sound (used during combat)
2. **explosion.mp3** - Explosion/hit sound (carrier damage)
3. **launch.mp3** - Aircraft launch sound (strikes departing)
4. **recon-success.mp3** - Success notification (fleet found)
5. **phase-change.mp3** - Transition sound (phase changes)
6. **sunk.mp3** - Deep boom (carrier sinking)

### Ambient Music
7. **ambient.mp3** - Ocean/naval battle ambient loop (optional)

## Free Sound Resources

You can download royalty-free sounds from:
- **Freesound.org** - https://freesound.org/
- **Zapsplat** - https://www.zapsplat.com/
- **Mixkit** - https://mixkit.co/free-sound-effects/
- **BBC Sound Effects** - https://sound-effects.bbcrewind.co.uk/

## File Format
- Format: MP3
- Bitrate: 128kbps or higher
- Length: 1-3 seconds for SFX, any length for ambient

## Testing
After adding files, refresh the game at http://localhost:3000 and check:
- Audio controls appear in bottom-right
- Volume slider works
- No console errors about missing files

## Placeholder Files
If you don't have sounds yet, you can create silent placeholder files:
```bash
# Create 1-second silent MP3 files
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 -acodec libmp3lame dice-roll.mp3
```

Or simply disable audio in the game settings.
