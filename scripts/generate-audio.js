/**
 * Audio generation script for Kido Butai game
 * Generates synthetic sound effects using Web Audio API
 * Run with: node scripts/generate-audio.js
 */

const fs = require('fs');
const path = require('path');

// Since we're in Node.js, we'll create simple WAV files with synthetic sounds
// For production, you'd want to use actual sound effect libraries or recordings

console.log('Generating synthetic audio files...');

// Create a simple WAV file header
function createWavHeader(dataSize, sampleRate = 44100, numChannels = 1, bitsPerSample = 16) {
  const buffer = Buffer.alloc(44);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28); // byte rate
  buffer.writeUInt16LE(numChannels * bitsPerSample / 8, 32); // block align
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

// Generate a simple tone
function generateTone(frequency, duration, sampleRate = 44100, envelope = true) {
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2); // 16-bit samples

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let amplitude = 0.3;

    // Apply envelope
    if (envelope) {
      const attackTime = 0.01;
      const releaseTime = 0.1;
      if (t < attackTime) {
        amplitude *= t / attackTime;
      } else if (t > duration - releaseTime) {
        amplitude *= (duration - t) / releaseTime;
      }
    }

    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate white noise
function generateNoise(duration, sampleRate = 44100, amplitude = 0.1) {
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const releaseTime = 0.2;
    let env = 1.0;

    if (t > duration - releaseTime) {
      env = (duration - t) / releaseTime;
    }

    const sample = (Math.random() * 2 - 1) * amplitude * env;
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate dice roll sound (multiple short clicks)
function generateDiceRoll() {
  const sampleRate = 44100;
  const duration = 0.8;
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  // Create rattling/clicking sounds
  const clickTimes = [0, 0.1, 0.15, 0.25, 0.3, 0.4, 0.5, 0.6];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    clickTimes.forEach(clickTime => {
      if (Math.abs(t - clickTime) < 0.02) {
        const localT = (t - clickTime) / 0.02;
        const freq = 800 + Math.random() * 400;
        const env = Math.exp(-localT * 100);
        sample += Math.sin(2 * Math.PI * freq * localT) * env * 0.3;
      }
    });

    // Add some noise
    sample += (Math.random() * 2 - 1) * 0.05;

    const intSample = Math.floor(Math.max(-1, Math.min(1, sample)) * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate explosion sound (low rumble + high crack)
function generateExplosion() {
  const sampleRate = 44100;
  const duration = 1.2;
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Attack envelope
    const attackEnv = Math.exp(-t * 3);

    // Low rumble
    sample += Math.sin(2 * Math.PI * 60 * t) * 0.4 * attackEnv;
    sample += Math.sin(2 * Math.PI * 80 * t) * 0.3 * attackEnv;

    // High crack at the beginning
    if (t < 0.1) {
      sample += Math.sin(2 * Math.PI * 2000 * t) * 0.3 * Math.exp(-t * 30);
    }

    // Noise component
    sample += (Math.random() * 2 - 1) * 0.2 * attackEnv;

    const intSample = Math.floor(Math.max(-1, Math.min(1, sample)) * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate launch sound (whoosh)
function generateLaunch() {
  const sampleRate = 44100;
  const duration = 1.0;
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Swept frequency (rising pitch)
    const freq = 200 + t * 400;
    const env = Math.exp(-t * 2);

    sample += Math.sin(2 * Math.PI * freq * t) * 0.2 * env;

    // Noise whoosh
    sample += (Math.random() * 2 - 1) * 0.3 * env;

    const intSample = Math.floor(Math.max(-1, Math.min(1, sample)) * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate recon success sound (sonar ping + beep)
function generateReconSuccess() {
  const sampleRate = 44100;
  const duration = 1.5;
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Sonar ping (low to high sweep)
    const freq = 400 + Math.sin(t * 8) * 200;
    const env = Math.exp(-t * 2);

    sample += Math.sin(2 * Math.PI * freq * t) * 0.4 * env;

    // Success beep at the end
    if (t > 1.0 && t < 1.2) {
      const beepT = t - 1.0;
      sample += Math.sin(2 * Math.PI * 880 * beepT) * 0.3 * Math.exp(-beepT * 10);
    }

    const intSample = Math.floor(Math.max(-1, Math.min(1, sample)) * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate phase change sound (transition tone)
function generatePhaseChange() {
  const sampleRate = 44100;
  const duration = 0.5;
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Two-tone chime
    const env = Math.exp(-t * 5);
    sample += Math.sin(2 * Math.PI * 660 * t) * 0.3 * env;
    sample += Math.sin(2 * Math.PI * 880 * t) * 0.2 * env;

    const intSample = Math.floor(Math.max(-1, Math.min(1, sample)) * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate sunk sound (dramatic descending tone)
function generateSunk() {
  const sampleRate = 44100;
  const duration = 2.0;
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Descending frequency (ship sinking)
    const freq = 300 - t * 150;
    const env = 0.5;

    sample += Math.sin(2 * Math.PI * freq * t) * 0.4 * env;
    sample += Math.sin(2 * Math.PI * (freq * 0.5) * t) * 0.3 * env; // Sub-harmonic

    // Bubbling noise
    sample += (Math.random() * 2 - 1) * 0.1 * (1 - Math.exp(-t * 2));

    const intSample = Math.floor(Math.max(-1, Math.min(1, sample)) * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Generate ambient ocean sound (looping)
function generateAmbient() {
  const sampleRate = 44100;
  const duration = 10.0; // 10 second loop
  const numSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Ocean waves (low frequency oscillation)
    sample += Math.sin(2 * Math.PI * 0.1 * t) * 0.1;
    sample += Math.sin(2 * Math.PI * 0.15 * t) * 0.08;

    // Filtered noise for ocean sound
    sample += (Math.random() * 2 - 1) * 0.05;

    const intSample = Math.floor(Math.max(-1, Math.min(1, sample)) * 16384);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Write WAV file
function writeWavFile(filename, audioBuffer) {
  const header = createWavHeader(audioBuffer.length);
  const fullBuffer = Buffer.concat([header, audioBuffer]);
  const outputPath = path.join(__dirname, '..', 'public', 'sounds', filename);
  fs.writeFileSync(outputPath, fullBuffer);
  console.log(`✓ Generated ${filename} (${Math.floor(fullBuffer.length / 1024)}KB)`);
}

// Generate all sound effects
const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

writeWavFile('dice-roll.mp3', generateDiceRoll());
writeWavFile('explosion.mp3', generateExplosion());
writeWavFile('launch.mp3', generateLaunch());
writeWavFile('recon-success.mp3', generateReconSuccess());
writeWavFile('phase-change.mp3', generatePhaseChange());
writeWavFile('sunk.mp3', generateSunk());
writeWavFile('ambient.mp3', generateAmbient());

console.log('\n✅ All audio files generated successfully!');
console.log('Note: These are WAV files with .mp3 extension. For production, convert to actual MP3.');
