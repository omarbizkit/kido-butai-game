'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioControls: React.FC = () => {
  const { audioEnabled, volume, toggleAudio, setVolume } = useGameStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
      <button
        onClick={toggleAudio}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
        title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
      >
        {audioEnabled ? (
          <Volume2 size={20} className="text-game-gold" />
        ) : (
          <VolumeX size={20} className="text-slate-500" />
        )}
      </button>
      
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-game-gold"
          disabled={!audioEnabled}
        />
        <span className="text-xs font-mono text-slate-400 w-8">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};
