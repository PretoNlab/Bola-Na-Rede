import React, { useState } from 'react';
import { Team, Player } from '../types';
import { ArrowLeft, SortDesc, User, Shield, Target, Activity } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  team: Team;
  onBack: () => void;
}

const POS_COLORS = {
  'GOL': 'text-yellow-500 bg-yellow-500/10',
  'ZAG': 'text-blue-500 bg-blue-500/10',
  'LAT': 'text-blue-400 bg-blue-400/10',
  'VOL': 'text-green-500 bg-green-500/10',
  'MEI': 'text-green-400 bg-green-400/10',
  'ATA': 'text-red-500 bg-red-500/10',
};

export default function SquadScreen({ team, onBack }: Props) {
  const [filter, setFilter] = useState<'ALL' | 'GOL' | 'DEF' | 'MID' | 'ATT'>('ALL');

  const filteredPlayers = team.roster.filter(p => {
    if (filter === 'ALL') return true;
    if (filter === 'GOL') return p.position === 'GOL';
    if (filter === 'DEF') return ['ZAG', 'LAT'].includes(p.position);
    if (filter === 'MID') return ['VOL', 'MEI'].includes(p.position);
    if (filter === 'ATT') return p.position === 'ATA';
    return true;
  });

  const avgOverall = Math.round(team.roster.reduce((acc, p) => acc + p.overall, 0) / team.roster.length);
  const avgAge = (team.roster.reduce((acc, p) => acc + p.age, 0) / team.roster.length).toFixed(1);

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">Elenco</h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <SortDesc className="text-white" size={20} />
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="px-4 py-4 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-3 bg-surface rounded-xl border border-white/5">
          <span className="text-2xl font-black text-white">{team.roster.length}</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">Atletas</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-surface rounded-xl border border-primary/20 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]">
          <span className="text-2xl font-black text-primary">{avgOverall}</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">Média</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-surface rounded-xl border border-white/5">
          <span className="text-2xl font-black text-white">{avgAge}</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">Idade</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-16 z-30 bg-background pt-0 pb-4 px-4 overflow-x-auto no-scrollbar flex gap-2 border-b border-transparent">
        {[
          { id: 'ALL', label: 'Todos' },
          { id: 'GOL', label: 'Goleiros' },
          { id: 'DEF', label: 'Defesa' },
          { id: 'MID', label: 'Meio' },
          { id: 'ATT', label: 'Ataque' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95",
              filter === tab.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-surface text-secondary hover:text-white border border-white/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List Header */}
      <div className="flex items-center px-6 py-2 text-[10px] font-bold text-secondary uppercase tracking-wider">
        <div className="w-10 text-center mr-3">Pos</div>
        <div className="flex-1">Nome / Status</div>
        <div className="w-10 text-center">OVR</div>
      </div>

      {/* Players List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-2 no-scrollbar">
        {filteredPlayers.map((player, idx) => (
          <div key={player.id} className="group flex items-center bg-surface hover:bg-surface/80 rounded-xl p-3 border border-white/5 transition-all active:scale-[0.99]">
            {/* Position */}
            <div className="flex flex-col items-center justify-center w-10 mr-3 border-r border-white/5 pr-3">
              <span className={clsx("text-[10px] font-black px-1.5 py-0.5 rounded", POS_COLORS[player.position])}>
                {player.position}
              </span>
              <span className="text-xs font-bold text-secondary mt-1">#{Math.floor(Math.random() * 99) + 1}</span>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-center overflow-hidden">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">{player.name}</h3>
                {player.status === 'fit' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                {player.status === 'injured' && <Activity size={12} className="text-red-500" />}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-secondary font-medium">
                 <span className="flex items-center gap-1">2{player.age % 10} anos</span>
                 {player.evolution && player.evolution > 0 && (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                       <Target size={10} /> +{player.evolution} Evo
                    </span>
                 )}
              </div>
            </div>

            {/* Rating */}
            <div className={clsx(
               "flex items-center justify-center w-10 h-10 rounded-lg font-bold text-base transition-colors",
               player.overall >= 80 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-background text-white"
            )}>
              {player.overall}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}