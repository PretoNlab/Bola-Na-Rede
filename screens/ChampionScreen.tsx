import React from 'react';
import { Team } from '../types';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  champion: Team;
  userTeam: Team;
  onNewSeason: () => void;
  onQuit: () => void;
}

export default function ChampionScreen({ champion, userTeam, onNewSeason, onQuit }: Props) {
  const isUserChampion = champion.id === userTeam.id;

  return (
    <div className="relative flex flex-col h-screen w-full bg-background overflow-hidden">
      
      {/* Background Effect */}
      <div className={clsx(
         "absolute inset-0 bg-gradient-to-b opacity-40 z-0",
         isUserChampion ? "from-yellow-500/20 via-background to-background" : "from-background via-background to-background"
      )}></div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
         
         <div className="mb-8 animate-bounce">
            <Trophy size={80} className={isUserChampion ? "text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" : "text-secondary"} />
         </div>

         <div className="space-y-2 mb-8">
            <p className="text-sm font-bold tracking-widest uppercase text-secondary">Campeão Baiano 2026</p>
            <h1 className="text-4xl font-black text-white">{champion.name}</h1>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mt-2 ${isUserChampion ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-surface border-white/10 text-secondary'}`}>
               {champion.points} Pontos
            </div>
         </div>

         {isUserChampion ? (
            <div className="max-w-xs bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-6 mb-8">
               <h2 className="text-xl font-bold text-yellow-100 mb-2">Parabéns, Treinador!</h2>
               <p className="text-sm text-yellow-200/80 leading-relaxed">
                  Sua liderança trouxe a glória para o {userTeam.name}. A torcida está em festa e seu nome está gravado na história!
               </p>
            </div>
         ) : (
            <div className="max-w-xs bg-surface border border-white/5 rounded-2xl p-6 mb-8">
               <h2 className="text-xl font-bold text-white mb-2">Fim de Temporada</h2>
               <p className="text-sm text-secondary leading-relaxed">
                  Não foi dessa vez. O título ficou com o {champion.name}, mas a diretoria confia no seu trabalho para o próximo ano.
               </p>
            </div>
         )}

         <div className="flex flex-col w-full max-w-xs gap-3">
            <button 
               onClick={onNewSeason}
               className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
               <RotateCcw size={20} />
               <span>Nova Temporada</span>
            </button>
            <button 
               onClick={onQuit}
               className="w-full py-4 px-6 bg-transparent border border-white/10 text-secondary hover:text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
               <span>Sair para o Menu</span>
            </button>
         </div>

      </main>
    </div>
  );
}