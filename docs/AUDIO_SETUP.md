# Audio System Setup Guide

## ✅ Status: Implemented with Graceful Fallback

The audio system is now fully implemented with error handling. The game will work perfectly even if audio files are missing.

## 📁 File Structure

```
public/sounds/
├── README.md              # Audio file documentation
├── dice-roll.mp3         # Dice rolling sound
├── explosion.mp3         # Carrier hit explosion
├── launch.mp3            # Aircraft launch
├── recon-success.mp3     # Fleet discovered notification
├── phase-change.mp3      # Phase transition sound
├── sunk.mp3              # Carrier sinking boom
└── ambient.mp3           # Background ocean/battle loop
```

## 🎵 Current State

**Placeholder files created** - Empty MP3 files that prevent errors
- Audio controls will appear in the UI
- No sounds will play (silent placeholders)
- Game functions perfectly without audio

## 🔊 Adding Real Sounds

### Option 1: Download from Free Resources

**Recommended Sites:**
1. **Freesound.org** - https://freesound.org/
   - Search: "dice roll", "explosion", "jet takeoff", "sonar ping", "boom"
2. **Mixkit** - https://mixkit.co/free-sound-effects/
   - Browse: Game, War, Notification categories
3. **Zapsplat** - https://www.zapsplat.com/
   - Free with attribution

### Option 2: Generate with AI

Use **ElevenLabs Sound Effects** or similar:
- https://elevenlabs.io/sound-effects
- Prompt examples: "dice rolling on table", "distant explosion", "jet engine startup"

### Installation Steps

1. Download 6 sound effects (1-3 seconds each)
2. Rename to match the file names above
3. Replace files in `public/sounds/`
4. Refresh browser at http://localhost:3000
5. Test audio controls

## 🧪 Testing

1. Open http://localhost:3000
2. Look for audio icon in bottom-right corner
3. Click to enable audio
4. Adjust volume slider
5. Play game - sounds trigger on:
   - Dice rolls during combat
   - Carrier hits
   - Aircraft launches
   - Fleet discoveries
   - Phase changes
   - Carrier sinking

## 🐛 Troubleshooting

**No audio controls visible?**
- Check browser console for errors
- Verify AudioInitializer is included in layout

**Audio controls show but no sound?**
- Check volume slider is not at 0
- Verify audio files exist in `/public/sounds/`
- Check browser console for "Audio preload failed" warnings
- Make sure audio is enabled (speaker icon)

**CORS errors?**
- Fixed! Now using local files in `/public/sounds/`
- External URLs removed

## 🔧 Technical Details

**Audio Manager** (`src/utils/audio.ts`):
- Web Audio API with AudioContext
- Graceful error handling (try/catch on all operations)
- Volume control (0-100%)
- Mute/unmute toggle
- Ambient background loop at 30% volume

**Integration Points**:
- Dice rolls → Combat resolution
- Explosions → Damage application
- Launches → Strike departures
- Notifications → Recon success
- Transitions → Phase changes

## 📝 Future Enhancements

- Historical radio chatter samples
- Engine sound variations
- Ocean wave ambience
- Victory/defeat music
- Customizable sound packs
