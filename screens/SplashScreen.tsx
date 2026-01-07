
import React from 'react';
import { Trophy, Play, History, ChevronRight } from 'lucide-react';

interface Props {
  onStart: () => void;
  onContinue: () => void;
  hasSave: boolean;
}

export default function SplashScreen({ onStart, onContinue, hasSave }: Props) {
  return (
    <div className="flex flex-col items-center justify-between h-screen w-full p-8 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>

      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 border border-white/10 animate-bounce">
          <Trophy className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">BOLANAREDE</h1>
        <p className="text-secondary text-sm font-bold uppercase tracking-widest bg-surface px-4 py-1.5 rounded-full border border-white/5">Manager 2026</p>
      </div>

      <div className="w-full max-w-sm space-y-4 mb-12 z-10">
        <button 
          onClick={onStart}
          className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          <Play size={20} fill="currentColor" />
          {hasSave ? "NOVA CARREIRA" : "INICIAR JOGO"}
        </button>

        {hasSave && (
          <button 
            onClick={onContinue}
            className="w-full bg-surface hover:bg-surface/80 text-white font-black py-5 rounded-2xl flex items-center justify-between px-8 border border-white/5 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <History size={20} className="text-secondary" />
              <span>CONTINUAR</span>
            </div>
            <ChevronRight size={20} className="text-secondary" />
          </button>
        )}
      </div>

      <p className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-40 mb-4">v2.0.0 • Alpha Mobile</p>
    </div>
  );
}
