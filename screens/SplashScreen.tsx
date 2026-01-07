import React, { useEffect, useState } from 'react';
import { PlayCircle, Trophy, ChevronRight } from 'lucide-react';
import { Team } from '../types';

interface Props {
  onStart: () => void;
  onContinue: () => void;
  hasSave: boolean;
}

export default function SplashScreen({ onStart, onContinue, hasSave }: Props) {
  const [lastSaveDate, setLastSaveDate] = useState<string | null>(null);

  useEffect(() => {
    if (hasSave) {
      // Try to read metadata if available, otherwise just show generic text
      const savedData = localStorage.getItem('bolanarede_save');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const date = new Date(parsed.timestamp || Date.now());
          setLastSaveDate(new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
          }).format(date));
        } catch (e) {
          setLastSaveDate('Desconhecido');
        }
      }
    }
  }, [hasSave]);

  return (
    <div className="relative flex flex-col items-center justify-between h-screen w-full p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/800/1200?grayscale&blur=2" 
          alt="Stadium Background" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
      </div>

      <div className="z-10 w-full flex-1 flex flex-col items-center justify-center animate-fade-in">
        {/* Logo Container */}
        <div className="w-24 h-24 bg-gradient-to-tr from-primary/30 to-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] backdrop-blur-md">
          <Trophy className="text-primary w-12 h-12" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Bolanarede</h1>
        
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/50 border border-white/10 mb-6 backdrop-blur-sm">
          <Trophy className="w-3 h-3 text-primary" />
          <span className="text-secondary text-xs font-bold tracking-widest uppercase">Campeonato Baiano 2026</span>
        </div>

        <p className="text-secondary text-center max-w-xs leading-relaxed text-sm">
          Gerencie seu time rumo ao topo do futebol baiano. Estratégia, tática e glória.
        </p>
      </div>

      <div className="z-10 w-full flex flex-col gap-4 mb-8 max-w-md">
        <button 
          onClick={onStart}
          className="group relative w-full h-14 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="text-white text-lg font-bold tracking-wide mr-2">
            {hasSave ? 'Nova Carreira' : 'Iniciar Carreira'}
          </span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={onContinue}
          disabled={!hasSave}
          className={`w-full h-14 border border-white/10 active:scale-[0.98] transition-all duration-200 rounded-xl flex items-center justify-between px-6 backdrop-blur-sm group
            ${hasSave ? 'bg-surface/50 hover:bg-surface cursor-pointer' : 'bg-surface/20 opacity-50 cursor-not-allowed'}
          `}
        >
          <div className="flex flex-col items-start">
            <span className={`text-base font-bold ${hasSave ? 'text-gray-200' : 'text-gray-500'}`}>Continuar jogo</span>
            <span className="text-secondary text-xs font-medium">
              {hasSave ? `Último save: ${lastSaveDate}` : 'Nenhum jogo salvo'}
            </span>
          </div>
          <PlayCircle className={`transition-colors w-6 h-6 ${hasSave ? 'text-secondary group-hover:text-white' : 'text-gray-600'}`} />
        </button>
      </div>
      
      <div className="z-10 text-secondary text-[10px] font-bold tracking-widest uppercase opacity-50">
        Versão 1.0.2 • Beta
      </div>
    </div>
  );
}