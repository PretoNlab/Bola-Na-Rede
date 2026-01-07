import React from 'react';
import { Team } from '../types';
import { Play, Users, ArrowLeftRight, Wallet, Calendar, Shield, LayoutDashboard, Trophy, Settings, Newspaper } from 'lucide-react';

interface Props {
  team: Team;
  nextOpponent: Team;
  standings: Team[];
  round: number;
  funds: number;
  onOpenSquad: () => void;
  onOpenMarket: () => void;
  onOpenFinance: () => void;
  onOpenCalendar: () => void;
  onOpenLeague: () => void;
  onOpenNews: () => void;
  onOpenSettings: () => void;
  onSimulate: () => void;
}

export default function DashboardScreen({ 
  team, nextOpponent, standings, round, funds, 
  onOpenSquad, onOpenMarket, onOpenFinance, onOpenCalendar, 
  onOpenLeague, onOpenNews, onOpenSettings, onSimulate 
}: Props) {
  const userRank = standings.findIndex(t => t.id === team.id) + 1;
  const nextOpponentRank = standings.findIndex(t => t.id === nextOpponent.id) + 1;

  // Formatter for Currency
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: "compact", maximumFractionDigits: 1 }).format(val);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-surface">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center shadow-lg border-2 border-surface`}>
               <span className="text-[10px] font-black">{team.shortName}</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold leading-tight">{team.name}</h1>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Rodada {round} • Baianão 2026</span>
            </div>
          </div>
          <button 
            onClick={onSimulate}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-1 active:scale-95 transition-transform"
          >
            <Play size={16} fill="currentColor" />
            <span>Simular</span>
          </button>
        </div>
        {/* Quick Stats Bar */}
        <div className="bg-surface/50 px-4 py-1.5 flex items-center justify-between text-[10px] font-bold border-t border-white/5">
           <span className="text-secondary">Próx: Rodada {round}</span>
           <span className="text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>Moral Alta</span>
           <span className="text-amber-400">{formatMoney(funds)}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 no-scrollbar">
        
        {/* Next Match Card */}
        <section>
          <div className="flex items-center justify-between mb-2 px-1">
             <h2 className="text-xs font-bold uppercase tracking-wider text-secondary">Próximo Jogo</h2>
             <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">CONFIRMADO</span>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-surface border border-white/5 shadow-lg group">
            {/* Ambient Background */}
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${team.logoColor1} to-transparent`}></div>
            
            <div className="relative p-5 flex flex-col items-center">
               <div className="flex items-center justify-between w-full mb-4">
                  {/* Home Team (User) */}
                  <div className="flex flex-col items-center flex-1">
                     <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center shadow-xl ring-4 ring-surface mb-2`}>
                        <span className="text-xs font-black">{team.shortName}</span>
                     </div>
                     <span className="text-sm font-bold text-center leading-tight">{team.name}</span>
                     <span className="text-[10px] font-bold text-secondary mt-1 bg-background/50 px-2 rounded-full border border-white/5">{userRank}º ({team.points}p)</span>
                  </div>

                  {/* VS Details */}
                  <div className="flex flex-col items-center px-2">
                     <span className="text-2xl font-black text-white/10 italic">VS</span>
                     <div className="bg-background/80 backdrop-blur border border-white/10 text-xs font-bold py-1 px-3 rounded-full mt-1">16:00</div>
                  </div>

                  {/* Away Team (Opponent) */}
                  <div className="flex flex-col items-center flex-1">
                     <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${nextOpponent.logoColor1} ${nextOpponent.logoColor2} flex items-center justify-center shadow-xl ring-4 ring-surface mb-2 opacity-90`}>
                        <span className="text-xs font-black">{nextOpponent.shortName}</span>
                     </div>
                     <span className="text-sm font-bold text-center leading-tight">{nextOpponent.name}</span>
                     <span className="text-[10px] font-bold text-secondary mt-1 bg-background/50 px-2 rounded-full border border-white/5">{nextOpponentRank}º ({nextOpponent.points}p)</span>
                  </div>
               </div>
               
               {/* Venue Info */}
               <div className="w-full bg-background/30 rounded-lg py-2 flex items-center justify-center gap-2 border-t border-white/5">
                  <Shield size={12} className="text-secondary" />
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">Arena Cajueiro • Mando de Campo</span>
               </div>
            </div>
          </div>
        </section>

        {/* Management Grid */}
        <section>
           <h2 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 px-1">Central de Comando</h2>
           <div className="grid grid-cols-2 gap-3">
              <button onClick={onOpenSquad} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg">
                    <Users size={20} />
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Elenco</span>
                    <span className="text-[10px] text-secondary">{team.roster.length} Jogadores</span>
                 </div>
              </button>

              <button onClick={onOpenMarket} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">
                    <ArrowLeftRight size={20} />
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Mercado</span>
                    <span className="text-[10px] text-secondary">Transferências</span>
                 </div>
              </button>

              <button onClick={onOpenFinance} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-amber-500/10 text-amber-400 p-2 rounded-lg">
                    <Wallet size={20} />
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Finanças</span>
                    <span className="text-[10px] text-secondary">{formatMoney(funds)}</span>
                 </div>
              </button>

              <button onClick={onOpenCalendar} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-purple-500/10 text-purple-400 p-2 rounded-lg">
                    <Calendar size={20} />
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Agenda</span>
                    <span className="text-[10px] text-secondary">Próx. Eventos</span>
                 </div>
              </button>
           </div>
        </section>

        {/* Standings Table */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
             <h2 className="text-xs font-bold uppercase tracking-wider text-secondary">Classificação</h2>
             <button onClick={onOpenLeague} className="text-[10px] font-bold text-primary hover:text-primary/80">Ver Completa</button>
          </div>
          
          <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-secondary uppercase bg-surface/50 font-bold">
                 <tr>
                    <th className="px-3 py-2 text-center w-8">#</th>
                    <th className="px-2 py-2">Time</th>
                    <th className="px-2 py-2 text-center w-10">P</th>
                    <th className="px-2 py-2 text-center w-10">SG</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings.slice(0, 5).map((t, index) => {
                  const rank = index + 1;
                  const isUser = t.id === team.id;
                  
                  return (
                    <tr key={t.id} className={isUser ? "bg-primary/10" : "hover:bg-white/5"}>
                       <td className={`px-3 py-2.5 text-center font-bold text-xs ${rank <= 4 ? 'border-l-2 border-emerald-500' : 'border-l-2 border-transparent'}`}>
                          {rank}
                       </td>
                       <td className={`px-2 py-2.5 font-medium ${isUser ? 'text-white' : 'text-gray-300'}`}>
                          {t.name}
                       </td>
                       <td className="px-2 py-2.5 text-center font-bold text-white">
                          {t.points}
                       </td>
                       <td className="px-2 py-2.5 text-center text-xs text-secondary">
                          {t.gf - t.ga > 0 ? `+${t.gf - t.ga}` : t.gf - t.ga}
                       </td>
                    </tr>
                  );
                })}
                {standings.length > 5 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-2 text-center text-[10px] text-secondary font-medium">...</td>
                  </tr>
                )}
                {/* Show relegation zone if user is not in top 5 */}
                {standings.slice(-2).map((t, index) => {
                  const rank = standings.length - 1 + index;
                  return (
                    <tr key={t.id} className="hover:bg-white/5">
                       <td className="px-3 py-2.5 text-center font-bold text-xs border-l-2 border-red-500 text-secondary">
                          {rank}
                       </td>
                       <td className="px-2 py-2.5 font-medium text-gray-400">
                          {t.name}
                       </td>
                       <td className="px-2 py-2.5 text-center font-bold text-secondary">
                          {t.points}
                       </td>
                       <td className="px-2 py-2.5 text-center text-xs text-secondary">
                          {t.gf - t.ga}
                       </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-white/5 pb-safe z-50">
         <div className="flex justify-around items-center h-16">
            <button className="flex flex-col items-center justify-center w-full h-full text-primary gap-1">
               <LayoutDashboard size={22} />
               <span className="text-[9px] font-bold">Início</span>
            </button>
            <button onClick={onOpenSquad} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1 transition-colors">
               <Users size={22} />
               <span className="text-[9px] font-bold">Elenco</span>
            </button>
            <button onClick={onOpenLeague} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1 transition-colors">
               <Trophy size={22} />
               <span className="text-[9px] font-bold">Liga</span>
            </button>
            <button onClick={onOpenNews} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1 transition-colors">
               <Newspaper size={22} />
               <span className="text-[9px] font-bold">News</span>
            </button>
            <button onClick={onOpenSettings} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1 transition-colors">
               <Settings size={22} />
               <span className="text-[9px] font-bold">Ajustes</span>
            </button>
         </div>
      </nav>
    </div>
  );
}