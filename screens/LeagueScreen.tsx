import React, { useState } from 'react';
import { Team } from '../types';
import { ArrowLeft, Trophy } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  userTeamId: string | null;
  onBack: () => void;
}

export default function LeagueScreen({ teams, userTeamId, onBack }: Props) {
  const [activeDiv, setActiveDiv] = useState<1 | 2>(1);
  
  const filteredTeams = [...teams]
    .filter(t => t.division === activeDiv)
    .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">Campeonato Baiano 2026</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
         <div className="p-4 bg-gradient-to-b from-primary/20 to-background flex flex-col items-center justify-center mb-2">
            <Trophy className="text-primary w-12 h-12 mb-2" />
            <div className="flex bg-surface p-1 rounded-xl border border-white/5">
               <button 
                  onClick={() => setActiveDiv(1)}
                  className={clsx("px-4 py-2 rounded-lg text-xs font-black transition-all", activeDiv === 1 ? "bg-primary text-white" : "text-secondary")}
               >
                  SÉRIE A
               </button>
               <button 
                  onClick={() => setActiveDiv(2)}
                  className={clsx("px-4 py-2 rounded-lg text-xs font-black transition-all", activeDiv === 2 ? "bg-primary text-white" : "text-secondary")}
               >
                  SÉRIE B
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[10px] text-secondary uppercase bg-surface border-y border-white/5 font-bold sticky top-0">
                 <tr>
                    <th className="px-3 py-3 text-center w-10">Pos</th>
                    <th className="px-3 py-3">Clube</th>
                    <th className="px-2 py-3 text-center">P</th>
                    <th className="px-2 py-3 text-center">J</th>
                    <th className="px-2 py-3 text-center">V</th>
                    <th className="px-2 py-3 text-center">E</th>
                    <th className="px-2 py-3 text-center">D</th>
                    <th className="px-2 py-3 text-center">SG</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTeams.map((t, index) => {
                  const rank = index + 1;
                  const isUser = t.id === userTeamId;
                  
                  let rankColor = 'border-transparent';
                  if (activeDiv === 1) {
                    if (rank <= 4) rankColor = 'border-emerald-500'; // G4
                    if (rank > filteredTeams.length - 2) rankColor = 'border-red-500'; // Z2 (Rebaixamento)
                  } else {
                    if (rank <= 2) rankColor = 'border-emerald-500'; // Acesso
                  }

                  return (
                    <tr key={t.id} className={clsx("transition-colors", isUser ? "bg-primary/10" : "hover:bg-white/5")}>
                       <td className={`px-3 py-3 text-center font-bold text-xs border-l-4 ${rankColor}`}>
                          {rank}
                       </td>
                       <td className="px-3 py-3 font-medium flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${t.logoColor1} ${t.logoColor2} flex items-center justify-center text-[8px] font-bold shadow-sm`}>
                             {t.shortName}
                          </div>
                          <span className={isUser ? "text-white font-bold" : "text-gray-300"}>{t.name}</span>
                       </td>
                       <td className="px-2 py-3 text-center font-black text-white bg-surface/30">
                          {t.points}
                       </td>
                       <td className="px-2 py-3 text-center text-secondary">
                          {t.played}
                       </td>
                       <td className="px-2 py-3 text-center text-secondary">
                          {t.won}
                       </td>
                       <td className="px-2 py-3 text-center text-secondary">
                          {t.drawn}
                       </td>
                       <td className="px-2 py-3 text-center text-secondary">
                          {t.lost}
                       </td>
                       <td className="px-2 py-3 text-center text-secondary">
                          {t.gf - t.ga}
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
         </div>

         <div className="p-4 flex gap-4 text-[10px] font-bold uppercase text-secondary justify-center mt-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {activeDiv === 1 ? 'Classificação' : 'Acesso'}
            </div>
            {activeDiv === 1 && (
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div> Rebaixamento
              </div>
            )}
         </div>
      </main>
    </div>
  );
}