
import React, { useState } from 'react';
import { Team, Player, TransferLog } from '../types';
import { ArrowLeft, PencilLine, Zap, AlertCircle, Target, Trophy, History, X, ChevronRight, TrendingUp, DollarSign, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  team: Team;
  onBack: () => void;
  onRenew: (playerId: string) => void;
  transferLogs?: TransferLog[];
}

const POS_COLORS = {
  'GOL': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  'ZAG': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'LAT': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'VOL': 'text-green-500 bg-green-500/10 border-green-500/20',
  'MEI': 'text-green-400 bg-green-400/10 border-green-400/20',
  'ATA': 'text-red-500 bg-red-500/10 border-red-500/20',
};

export default function SquadScreen({ team, onBack, onRenew, transferLogs = [] }: Props) {
  const [filter, setFilter] = useState<'ALL' | 'GOL' | 'DEF' | 'MID' | 'ATT'>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const filteredPlayers = team.roster.filter(p => {
    if (filter === 'ALL') return true;
    if (filter === 'GOL') return p.position === 'GOL';
    if (filter === 'DEF') return ['ZAG', 'LAT'].includes(p.position);
    if (filter === 'MID') return ['VOL', 'MEI'].includes(p.position);
    if (filter === 'ATT') return p.position === 'ATA';
    return true;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const playerHistory = selectedPlayer ? transferLogs.filter(log => log.playerName === selectedPlayer.name) : [];

  return (
    <div className="flex flex-col h-screen bg-background text-white relative">
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
          <div 
            key={player.id} 
            onClick={() => setSelectedPlayer(player)}
            className="bg-surface rounded-2xl p-4 border border-white/5 relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
          >
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
                      <span className="text-[10px] text-secondary">OVR {player.overall} • {player.age} anos</span>
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
                <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                   <div className={clsx("h-full transition-all", player.energy < 30 ? "bg-rose-500" : player.energy < 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${player.energy}%` }}></div>
                </div>
                <ChevronRight size={14} className="text-secondary opacity-40" />
             </div>
          </div>
        ))}
      </div>

      {/* Detalhes do Jogador (Modal) */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col pt-safe">
           <header className="p-4 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setSelectedPlayer(null)} className="p-2 bg-surface rounded-full"><X size={20}/></button>
              <h2 className="text-sm font-black uppercase tracking-widest italic">Perfil do Atleta</h2>
              <div className="w-10"></div>
           </header>

           <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              {/* Card de Identificação */}
              <div className="flex items-center gap-6">
                 <div className={clsx("w-24 h-24 rounded-[32px] flex items-center justify-center border-2 font-black text-2xl shadow-2xl", POS_COLORS[selectedPlayer.position])}>
                    {selectedPlayer.position}
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black">{selectedPlayer.name}</h3>
                    <p className="text-sm text-secondary font-bold uppercase tracking-widest">{selectedPlayer.age} ANOS • {selectedPlayer.status === 'fit' ? 'EM CONDIÇÕES' : 'INDISPONÍVEL'}</p>
                    <div className="flex items-center gap-2 pt-2">
                       <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded">OVR {selectedPlayer.overall}</span>
                       <span className="bg-surface text-secondary text-[10px] font-black px-2 py-1 rounded border border-white/5">POT {selectedPlayer.potential}</span>
                    </div>
                 </div>
              </div>

              {/* Grid de Estatísticas de Temporada */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                       <Target size={14} />
                       <span className="text-[10px] font-black uppercase">Gols</span>
                    </div>
                    <p className="text-3xl font-black">{selectedPlayer.goals}</p>
                 </div>
                 <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400">
                       <Trophy size={14} />
                       <span className="text-[10px] font-black uppercase">Assistências</span>
                    </div>
                    <p className="text-3xl font-black">{selectedPlayer.assists}</p>
                 </div>
                 <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-amber-500">
                       <ShieldAlert size={14} />
                       <span className="text-[10px] font-black uppercase">Amarelos</span>
                    </div>
                    <p className="text-3xl font-black">{selectedPlayer.yellowCards}</p>
                 </div>
                 <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-rose-500">
                       <ShieldAlert size={14} fill="currentColor" />
                       <span className="text-[10px] font-black uppercase">Vermelhos</span>
                    </div>
                    <p className="text-3xl font-black">{selectedPlayer.redCards}</p>
                 </div>
              </div>

              {/* Atributos e Valor */}
              <div className="space-y-4">
                 <div className="bg-surface rounded-3xl p-6 border border-white/5 space-y-6">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-secondary">
                          <span>Potencial de Evolução</span>
                          <span>{selectedPlayer.potential}%</span>
                       </div>
                       <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(selectedPlayer.overall / selectedPlayer.potential) * 100}%` }}></div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 border-t border-white/5 pt-6 gap-6">
                       <div className="space-y-1">
                          <span className="text-[10px] font-black text-secondary uppercase">Valor de Mercado</span>
                          <p className="text-sm font-black text-emerald-400">{formatCurrency(selectedPlayer.marketValue)}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-black text-secondary uppercase">Contrato Restante</span>
                          <p className="text-sm font-black text-white">{selectedPlayer.contractRounds} rodadas</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Histórico de Carreira */}
              <div className="space-y-4 pb-12">
                 <div className="flex items-center gap-2 px-1">
                    <History size={16} className="text-secondary" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Histórico de Carreira</h4>
                 </div>
                 
                 <div className="space-y-3">
                    <div className="relative pl-6 border-l border-white/10 space-y-6">
                       {/* Registro Atual */}
                       <div className="relative">
                          <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                          <div className="bg-surface p-4 rounded-2xl border border-white/5">
                             <p className="text-xs font-black">{team.name}</p>
                             <p className="text-[10px] text-secondary">Clube Atual • Profissional</p>
                          </div>
                       </div>
                       
                       {/* Logs de Transferência Reais */}
                       {playerHistory.map(log => (
                          <div key={log.id} className="relative">
                             <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-background"></div>
                             <div className="bg-surface p-4 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <p className="text-xs font-black">Transferido para {log.toTeamName}</p>
                                      <p className="text-[10px] text-secondary">De {log.fromTeamName} • Rodada {log.round}</p>
                                   </div>
                                   <span className="text-[10px] font-bold text-emerald-400">{formatCurrency(log.value)}</span>
                                </div>
                             </div>
                          </div>
                       ))}

                       {/* Registro Inicial Simulado */}
                       {!playerHistory.length && (
                          <div className="relative opacity-40">
                             <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-secondary border-4 border-background"></div>
                             <div className="bg-surface p-4 rounded-2xl border border-white/5">
                                <p className="text-xs font-black">Categorias de Base</p>
                                <p className="text-[10px] text-secondary">Início da Carreira</p>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </main>

           <div className="p-6 bg-surface border-t border-white/5 pb-safe">
              <button 
                 onClick={() => onRenew(selectedPlayer.id)}
                 className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                 <PencilLine size={18} /> RENOVAR CONTRATO
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
