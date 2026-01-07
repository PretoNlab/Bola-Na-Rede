
import React, { useState } from 'react';
import { Team } from '../types';
import { ArrowLeft, Trophy, Globe, Award, Star } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  userTeamId: string | null;
  onBack: () => void;
}

const GLOBAL_MOCK = [
  { rank: 1, name: 'Guardiola do Sertão', team: 'EC Bahia', prestige: 15400 },
  { rank: 2, name: 'Mister Juazeiro', team: 'Juazeirense', prestige: 12100 },
  { rank: 3, name: 'Ancelotti BR', team: 'Barcelona-BA', prestige: 9800 },
  { rank: 4, name: 'Professor Tite', team: 'Vitória', prestige: 8500 },
];

export default function LeagueScreen({ teams, userTeamId, onBack }: Props) {
  const [tab, setTab] = useState<'LOCAL' | 'GLOBAL'>('LOCAL');
  const [div, setDiv] = useState<1 | 2>(1);

  const standings = [...teams]
    .filter(t => t.division === div)
    .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="p-4 border-b border-white/5 flex items-center justify-between bg-surface/30 backdrop-blur-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-black uppercase tracking-tighter italic">Classificação</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 flex gap-2">
        <button onClick={() => setTab('LOCAL')} className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all", tab === 'LOCAL' ? "bg-primary text-white" : "bg-surface text-secondary")}>
          <div className="flex items-center justify-center gap-2"><Trophy size={14} /> ESTADUAL</div>
        </button>
        <button onClick={() => setTab('GLOBAL')} className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all", tab === 'GLOBAL' ? "bg-emerald-600 text-white" : "bg-surface text-secondary")}>
          <div className="flex items-center justify-center gap-2"><Globe size={14} /> MUNDIAL</div>
        </button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {tab === 'LOCAL' ? (
          <>
            <div className="flex justify-center p-4 gap-4">
              <button onClick={() => setDiv(1)} className={clsx("text-xs font-black pb-1 border-b-2 transition-all", div === 1 ? "border-primary text-white" : "border-transparent text-secondary")}>SÉRIE A</button>
              <button onClick={() => setDiv(2)} className={clsx("text-xs font-black pb-1 border-b-2 transition-all", div === 2 ? "border-primary text-white" : "border-transparent text-secondary")}>SÉRIE B</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-surface/50 text-[10px] text-secondary uppercase font-black">
                <tr>
                  <th className="px-4 py-3 text-left w-12">#</th>
                  <th className="px-2 py-3 text-left">CLUBE</th>
                  <th className="px-4 py-3 text-center">P</th>
                  <th className="px-4 py-3 text-center">J</th>
                  <th className="px-4 py-3 text-center">SG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings.map((t, i) => (
                  <tr key={t.id} className={clsx(t.id === userTeamId ? "bg-primary/10 border-l-4 border-primary" : "")}>
                    <td className="px-4 py-4 font-black">{i + 1}º</td>
                    <td className="px-2 py-4 font-bold flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${t.logoColor1} ${t.logoColor2}`}></div>
                      <span className="truncate max-w-[120px]">{t.name}</span>
                    </td>
                    <td className="px-4 py-4 text-center font-black">{t.points}</td>
                    <td className="px-4 py-4 text-center text-secondary">{t.played}</td>
                    <td className="px-4 py-4 text-center text-secondary">{t.gf - t.ga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="p-4 space-y-4">
            <div className="bg-emerald-600/10 border border-emerald-600/20 rounded-2xl p-6 flex flex-col items-center text-center gap-2">
               <Award size={40} className="text-emerald-500 mb-2" />
               <h3 className="text-lg font-black italic">HALL DA FAMA</h3>
               <p className="text-xs text-secondary">Os melhores treinadores do mundo conectados via Firebase.</p>
            </div>

            {GLOBAL_MOCK.map((entry) => (
               <div key={entry.rank} className="bg-surface p-4 rounded-2xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-4">
                     <span className="text-xl font-black text-secondary">#{entry.rank}</span>
                     <div>
                        <p className="text-sm font-bold">{entry.name}</p>
                        <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{entry.team}</p>
                     </div>
                  </div>
                  <div className="bg-background px-3 py-1 rounded-lg border border-emerald-500/20">
                     <span className="text-xs font-black text-emerald-500">{entry.prestige} pts</span>
                  </div>
               </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
