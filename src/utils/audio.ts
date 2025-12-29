export type SoundEffect = 'DICE_ROLL' | 'EXPLOSION' | 'LAUNCH' | 'RECON_SUCCESS' | 'PHASE_CHANGE' | 'SUNK';

class AudioManager {
  private ambientSource: AudioBufferSourceNode | null = null;
  private audioContext: AudioContext | null = null;
  private buffers: Map<SoundEffect, AudioBuffer> = new Map();
  private volume: number = 0.5;
  private enabled: boolean = true;

  private soundUrls: Record<SoundEffect, string> = {
    DICE_ROLL: '/sounds/dice-roll.mp3',
    EXPLOSION: '/sounds/explosion.mp3',
    LAUNCH: '/sounds/launch.mp3',
    RECON_SUCCESS: '/sounds/recon-success.mp3',
    PHASE_CHANGE: '/sounds/phase-change.mp3',
    SUNK: '/sounds/sunk.mp3',
  };

  private ambientUrl = '/sounds/ambient.mp3'; // Ocean/battle ambient loop

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async init() {
    if (!this.audioContext) return;
    // Preload sounds - wrapped in try/catch to handle CORS/network errors
    try {
      for (const [key, url] of Object.entries(this.soundUrls)) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.buffers.set(key as SoundEffect, audioBuffer);
      }
    } catch (error) {
      console.warn('Audio preload failed (CORS or network issue):', error);
      // Audio will be disabled but game continues
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.ambientSource) {
      this.stopAmbient();
    }
  }

  playSFX(effect: SoundEffect) {
    if (!this.enabled || !this.audioContext) return;
    try {
      const buffer = this.buffers.get(effect);
      if (buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.volume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.warn('SFX playback failed:', error);
    }
  }

  async startAmbient() {
    if (!this.enabled || !this.audioContext || this.ambientSource) return;

    try {
      const response = await fetch(this.ambientUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.ambientSource = this.audioContext.createBufferSource();
      this.ambientSource.buffer = audioBuffer;
      this.ambientSource.loop = true;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = this.volume * 0.3; // Ambient is quieter
      this.ambientSource.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      this.ambientSource.start();
    } catch (error) {
      console.warn('Ambient audio failed to load:', error);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
  }
}

export const audioManager = new AudioManager();
