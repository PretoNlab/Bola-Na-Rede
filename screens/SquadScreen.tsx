
import React, { useState } from 'react';
import { Team } from '../types';
import { ArrowLeft, PencilLine, Zap, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  team: Team;
  onBack: () => void;
  onRenew: (playerId: string) => void;
}

const POS_COLORS = {
  'GOL': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  'ZAG': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'LAT': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'VOL': 'text-green-500 bg-green-500/10 border-green-500/20',
  'MEI': 'text-green-400 bg-green-400/10 border-green-400/20',
  'ATA': 'text-red-500 bg-red-500/10 border-red-500/20',
};

export default function SquadScreen({ team, onBack, onRenew }: Props) {
  const [filter, setFilter] = useState<'ALL' | 'GOL' | 'DEF' | 'MID' | 'ATT'>('ALL');

  const filteredPlayers = team.roster.filter(p => {
    if (filter === 'ALL') return true;
    if (filter === 'GOL') return p.position === 'GOL';
    if (filter === 'DEF') return ['ZAG', 'LAT'].includes(p.position);
    if (filter === 'MID') return ['VOL', 'MEI'].includes(p.position);
    if (filter === 'ATT') return p.position === 'ATA';
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
          <button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Elenco Profissional</h1>
          <div className="w-10"></div>
      </header>

      <div className="px-4 py-4 overflow-x-auto no-scrollbar flex gap-2">
        {['ALL', 'GOL', 'DEF', 'MID', 'ATT'].map((tab) => (
          <button key={tab} onClick={() => setFilter(tab as any)} className={clsx("px-4 py-2 rounded-full text-xs font-bold transition-all", filter === tab ? "bg-primary text-white" : "bg-surface text-secondary")}>
            {tab === 'ALL' ? 'Todos' : tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-3 no-scrollbar">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="bg-surface rounded-2xl p-4 border border-white/5 relative overflow-hidden">
             {player.isSuspended && (
                <div className="absolute top-0 right-0 p-2 bg-rose-600 text-[8px] font-black uppercase rounded-bl-lg flex items-center gap-1">
                   <AlertCircle size={10} /> Suspenso
                </div>
             )}
             
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                   <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center border font-black text-xs", POS_COLORS[player.position])}>
                      {player.position}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-bold">{player.name}</span>
                      <span className="text-[10px] text-secondary">OVR {player.overall} • {player.age} anos • Pot. {player.potential}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400">
                      <Zap size={10} fill="currentColor" /> {player.energy}%
                   </div>
                   <span className="text-[9px] text-secondary uppercase font-bold">Contrato: {player.contractRounds} rod.</span>
                </div>
             </div>

             <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                   <div className={clsx("h-full transition-all", player.energy < 30 ? "bg-rose-500" : player.energy < 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${player.energy}%` }}></div>
                </div>
                {player.contractRounds <= 5 && (
                   <button onClick={() => onRenew(player.id)} className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                      <PencilLine size={10} /> RENOVAR
                   </button>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
