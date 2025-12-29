import { GameBoard } from '@/components/GameBoard';
import { AudioInitializer } from '@/components/AudioInitializer';
import { AudioControls } from '@/components/AudioControls';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-12 px-4 bg-[#0a0c10]">
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-sm flex flex-col gap-8">
        <header className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-7xl font-black text-game-gold tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            Kido Butai
          </h1>
          <div className="h-1 w-48 bg-game-gold" />
          <p className="text-slate-400 uppercase tracking-[0.2em] font-bold text-xs mt-2">
            Japan's Carriers at Midway
          </p>
        </header>
        
        <GameBoard />
        <AudioInitializer />
        <AudioControls />
      </div>
    </main>
  );
}
