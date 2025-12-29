'use client';

import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audio';

export const AudioInitializer = () => {
  const { audioEnabled, volume } = useGameStore();

  useEffect(() => {
    const initAudio = async () => {
      await audioManager.init();
    };
    initAudio();
  }, []);

  useEffect(() => {
    audioManager.setEnabled(audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    audioManager.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (audioEnabled) {
      // Small delay to ensure initialization
      const timer = setTimeout(() => {
        audioManager.startAmbient();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      audioManager.stopAmbient();
    }
  }, [audioEnabled]);

  return null;
};
