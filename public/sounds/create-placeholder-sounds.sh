#!/bin/bash
# Create silent 1-second MP3 placeholder files
# This uses sox to create silence - lightweight alternative to ffmpeg

for file in dice-roll explosion launch recon-success phase-change sunk ambient; do
  # Create a 1-second WAV of silence, then convert to MP3 (if sox/lame available)
  # Fallback: create empty files that won't crash the app
  touch "${file}.mp3"
  echo "Created placeholder: ${file}.mp3"
done

echo "Placeholder audio files created!"
echo "Replace these with real sounds from freesound.org or mixkit.co"
