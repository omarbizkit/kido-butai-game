import { GameState } from '../types';

export const generateAAR = (state: GameState) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `kido-butai-aar-${timestamp}.json`;

  const report = {
    meta: {
      generatedAt: new Date().toISOString(),
      gameVersion: '1.0.0',
    },
    finalState: {
      turn: state.turn,
      score: state.midwayDamage, // Simplified score reference, real score calc logic is in scoring.ts
      carriers: state.carriers,
    },
    log: state.log,
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
