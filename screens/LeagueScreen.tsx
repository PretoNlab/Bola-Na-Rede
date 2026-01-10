
import React, { useState, useMemo } from 'react';
import { Team, Player } from '../types';
import { ArrowLeft, User, Trophy, ListOrdered } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  userTeamId: string | null;
  onBack: () => void;
}

export default function LeagueScreen({ teams, userTeamId, onBack }: Props) {
  const [tab, setTab] = useState<'LOCAL' | 'SCORERS'>('LOCAL');
  const [div, setDiv] = useState<1 | 2>(1);

  const standings = useMemo(() => {
    return [...teams]
      .filter(t => t.division === div)
      .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
  }, [teams, div]);

  const topScorers = useMemo(() => {
    const scorers: { p: Player, t: Team }[] = [];
    // Busca em todos os times que pertencem à divisão selecionada
    teams.filter(team => team.division === div).forEach(team => {
      team.roster.forEach(player => {
        if (player.goals > 0) {
          scorers.push({ p: player, t: team });
        }
      });
    });
    return scorers.sort((a, b) => b.p.goals - a.p.goals).slice(0, 15);
  }, [teams, div]);

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="p-4 border-b border-white/5 flex items-center justify-between bg-surface/30 backdrop-blur-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-black uppercase italic tracking-tighter">Série {div === 1 ? 'A' : 'B'}</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 flex gap-2">
        <button 
           onClick={() => setTab('LOCAL')} 
           className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2", tab === 'LOCAL' ? "bg-primary text-white" : "bg-surface text-secondary")}
        >
          <ListOrdered size={14} /> CLASSIFICAÇÃO
        </button>
        <button 
           onClick={() => setTab('SCORERS')} 
           className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2", tab === 'SCORERS' ? "bg-emerald-600 text-white" : "bg-surface text-secondary")}
        >
          <Trophy size={14} /> ARTILHARIA
        </button>
      </div>

      <div className="flex justify-center px-4 gap-8 mb-4">
        <button onClick={() => setDiv(1)} className={clsx("text-xs font-black pb-2 border-b-2 transition-all px-4", div === 1 ? "border-primary text-white" : "border-transparent text-secondary")}>1ª DIVISÃO</button>
        <button onClick={() => setDiv(2)} className={clsx("text-xs font-black pb-2 border-b-2 transition-all px-4", div === 2 ? "border-primary text-white" : "border-transparent text-secondary")}>2ª DIVISÃO</button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {tab === 'LOCAL' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface/50 text-[10px] text-secondary uppercase font-black">
                <tr>
                  <th className="px-4 py-3 text-left w-12">#</th>
                  <th className="px-2 py-3 text-left">CLUBE</th>
                  <th className="px-3 py-3 text-center">P</th>
                  <th className="px-3 py-3 text-center">J</th>
                  <th className="px-3 py-3 text-center">SG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings.map((t, i) => (
                  <tr key={t.id} className={clsx(t.id === userTeamId ? "bg-primary/20" : "")}>
                    <td className="px-4 py-4 font-black">{i + 1}º</td>
                    <td className="px-2 py-4 font-bold flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${t.logoColor1} ${t.logoColor2}`}></div>
                      <span className="truncate">{t.name}</span>
                    </td>
                    <td className="px-3 py-4 text-center font-black">{t.points}</td>
                    <td className="px-3 py-4 text-center text-secondary">{t.played}</td>
                    <td className="px-3 py-4 text-center text-secondary">{t.gf - t.ga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 space-y-3 pb-20">
            {topScorers.length === 0 ? (
               <div className="py-20 flex flex-col items-center justify-center text-secondary opacity-40 gap-4">
                  <User size={48} strokeWidth={1} />
                  <p className="text-sm font-bold uppercase tracking-widest">Aguardando o início dos gols...</p>
               </div>
            ) : (
               topScorers.map((entry, idx) => (
                  <div key={idx} className="bg-surface p-4 rounded-3xl flex items-center justify-between border border-white/5 animate-in slide-in-from-bottom duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                     <div className="flex items-center gap-4">
                        <span className="text-xl font-black italic text-white/20">#{idx + 1}</span>
                        <div>
                           <p className="text-sm font-black text-white">{entry.p.name}</p>
                           <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${entry.t.logoColor1} ${entry.t.logoColor2}`}></div>
                              <p className="text-[10px] text-secondary font-bold uppercase">{entry.t.name}</p>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-emerald-400">{entry.p.goals}</span>
                        <span className="text-[8px] font-black text-secondary uppercase tracking-tighter">GOLS</span>
                     </div>
                  </div>
               ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
