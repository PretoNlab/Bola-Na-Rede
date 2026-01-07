import React from 'react';
import { MatchResult } from '../types';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Props {
  history: MatchResult[];
  currentRound: number;
  onBack: () => void;
}

export default function CalendarScreen({ history, currentRound, onBack }: Props) {
  // Group history by round
  const historyByRound: Record<number, MatchResult[]> = {};
  history.forEach(match => {
     if (!historyByRound[match.round]) historyByRound[match.round] = [];
     historyByRound[match.round].push(match);
  });

  const rounds = Object.keys(historyByRound).map(Number).sort((a, b) => b - a);

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">Calendário</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
         
         {/* Upcoming Round */}
         <div>
            <div className="flex items-center gap-2 mb-3">
               <CalendarIcon size={16} className="text-primary" />
               <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Rodada {currentRound} (Atual)</h2>
            </div>
            <div className="bg-surface border border-primary/20 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2 border-dashed">
               <Clock size={32} className="text-primary animate-pulse" />
               <p className="text-sm font-medium text-gray-300">Jogos agendados</p>
               <span className="text-[10px] text-secondary uppercase font-bold">Vá ao Dashboard para jogar</span>
            </div>
         </div>

         {/* History */}
         {rounds.map(round => (
            <div key={round} className="animate-fade-in-up">
               <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-secondary">Rodada {round}</h2>
               </div>
               
               <div className="bg-surface border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
                  {historyByRound[round].map((match, idx) => (
                     <div key={idx} className={`flex items-center justify-between p-3 ${match.isUserMatch ? 'bg-white/5' : ''}`}>
                        <span className={`text-xs font-medium w-[40%] text-right ${match.isUserMatch && match.homeScore > match.awayScore ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                           {match.homeTeamName}
                        </span>
                        
                        <div className="bg-background px-3 py-1 rounded text-xs font-black tracking-widest mx-2">
                           {match.homeScore} - {match.awayScore}
                        </div>
                        
                        <span className={`text-xs font-medium w-[40%] text-left ${match.isUserMatch && match.awayScore > match.homeScore ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                           {match.awayTeamName}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         ))}

         {history.length === 0 && (
            <div className="text-center py-10 text-secondary opacity-50">
               <p className="text-sm">Nenhum resultado registrado ainda.</p>
            </div>
         )}
      </main>
    </div>
  );
}