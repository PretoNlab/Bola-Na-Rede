
import React, { useState } from 'react';
import { Team, Player } from '../types';
import { Play, Users, ArrowLeftRight, Wallet, LayoutDashboard, Trophy, Settings, Newspaper, Target, ChevronRight, UserRound, Flame, HandHeart } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  team: Team;
  nextOpponent: Team;
  standings: Team[];
  round: number;
  funds: number;
  onboardingComplete: boolean;
  onCompleteOnboarding: () => void;
  onOpenSquad: () => void;
  onOpenMarket: () => void;
  onOpenFinance: () => void;
  onOpenCalendar: () => void;
  onOpenLeague: () => void;
  onOpenNews: () => void;
  onOpenSettings: () => void;
  onSimulate: () => void;
  onOpenTactics: () => void;
}

export default function DashboardScreen({ 
  team, nextOpponent, standings, round, funds, onboardingComplete, onCompleteOnboarding,
  onOpenSquad, onOpenMarket, onOpenFinance, onOpenCalendar, 
  onOpenLeague, onOpenNews, onOpenSettings, onSimulate, onOpenTactics
}: Props) {
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  const div1Standings = standings.filter(t => t.division === 1);
  const div2Standings = standings.filter(t => t.division === 2);
  
  const userRank = (team.division === 1 ? div1Standings : div2Standings).findIndex(t => t.id === team.id) + 1;

  // Aggregate all players for stats
  const allPlayers = standings.flatMap(t => t.roster.map(p => ({ ...p, teamShort: t.shortName, teamColor: t.logoColor1 })));
  const topScorers = [...allPlayers].sort((a, b) => b.goals - a.goals || b.overall - a.overall).slice(0, 5);
  const topAssisters = [...allPlayers].sort((a, b) => b.assists - a.assists || b.overall - a.overall).slice(0, 5);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: "compact", maximumFractionDigits: 1 }).format(val);
  };

  const onboardingMessages = [
    {
      title: "Bem-vindo, Professor!",
      text: `É uma honra tê-lo no comando do ${team.name}. A cidade toda está ansiosa para ver o que você fará nesta temporada. Vamos revisar as bases?`,
      highlight: null
    },
    {
      title: "Mesa Tática",
      text: "Antes de cada jogo, você precisa definir seus 11 titulares e a formação. Lembre-se: jogar sem um time completo é pedir pela derrota!",
      highlight: "tactics"
    },
    {
      title: "Saúde Financeira",
      text: `No Bolanarede, as contas importam. Atualmente temos ${formatMoney(funds)}. Se o saldo ficar muito negativo por muito tempo, a diretoria pode te demitir.`,
      highlight: "finance"
    },
    {
      title: "O Espetáculo Começa",
      text: "Quando estiver pronto, use o botão Simular para ir ao estádio. Estarei nas tribunas torcendo por você. Boa sorte!",
      highlight: "simulate"
    }
  ];

  const handleNextOnboarding = () => {
    if (onboardingStep < onboardingMessages.length - 1) {
      setOnboardingStep(s => s + 1);
    } else {
      onCompleteOnboarding();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white relative">
      {/* Onboarding Overlay */}
      {!onboardingComplete && (
        <div className="absolute inset-0 z-[100] flex flex-col justify-end">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-700"></div>
           <div className="relative p-6 animate-in slide-in-from-bottom duration-500">
              <div className="bg-surface border border-white/10 rounded-[32px] p-6 shadow-2xl overflow-hidden">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-700 to-gray-400 flex items-center justify-center border-2 border-white/10 shrink-0 shadow-lg">
                       <UserRound size={32} className="text-white" />
                    </div>
                    <div>
                       <span className="text-[10px] font-black uppercase text-primary tracking-widest">O Presidente</span>
                       <h3 className="text-xl font-black">{onboardingMessages[onboardingStep].title}</h3>
                    </div>
                 </div>
                 <p className="text-sm text-secondary leading-relaxed mb-8 min-h-[60px]">
                    {onboardingMessages[onboardingStep].text}
                 </p>
                 <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                       {onboardingMessages.map((_, i) => (
                          <div key={i} className={clsx("h-1.5 rounded-full transition-all", onboardingStep === i ? "w-6 bg-primary" : "w-1.5 bg-white/10")}></div>
                       ))}
                    </div>
                    <button onClick={handleNextOnboarding} className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                       {onboardingStep === onboardingMessages.length - 1 ? "Entendido!" : "Próximo"}
                       <ChevronRight size={16} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

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
          <button onClick={onSimulate} className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-1 active:scale-95 transition-transform">
            <Play size={16} fill="currentColor" />
            <span>Simular</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-8 pb-24 no-scrollbar">
        {/* Next Match Card */}
        <section>
          <div className="flex items-center justify-between mb-2 px-1">
             <h2 className="text-xs font-bold uppercase tracking-wider text-secondary">Próximo Jogo</h2>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-surface border border-white/5 shadow-lg group">
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${team.logoColor1} to-transparent`}></div>
            <div className="relative p-5 flex flex-col items-center">
               <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex flex-col items-center flex-1">
                     <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center shadow-xl ring-4 ring-surface mb-2`}>
                        <span className="text-xs font-black">{team.shortName}</span>
                     </div>
                     <span className="text-sm font-bold text-center leading-tight">{team.name}</span>
                     <span className="text-[10px] font-bold text-secondary mt-1">{userRank}º</span>
                  </div>
                  <div className="flex flex-col items-center px-2">
                     <span className="text-2xl font-black text-white/10 italic">VS</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                     <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${nextOpponent.logoColor1} ${nextOpponent.logoColor2} flex items-center justify-center shadow-xl ring-4 ring-surface mb-2 opacity-90`}>
                        <span className="text-xs font-black">{nextOpponent.shortName}</span>
                     </div>
                     <span className="text-sm font-bold text-center leading-tight">{nextOpponent.name}</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Management Grid */}
        <section>
           <h2 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 px-1">Central de Comando</h2>
           <div className="grid grid-cols-2 gap-3">
              <button onClick={onOpenTactics} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-primary/10 text-primary p-2 rounded-lg"><Target size={20} /></div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Tática</span>
                    <span className="text-[10px] text-secondary">{team.formation}</span>
                 </div>
              </button>
              <button onClick={onOpenSquad} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg"><Users size={20} /></div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Elenco</span>
                    <span className="text-[10px] text-secondary">{team.roster.length} Atletas</span>
                 </div>
              </button>
              <button onClick={onOpenMarket} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg"><ArrowLeftRight size={20} /></div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Mercado</span>
                    <span className="text-[10px] text-secondary">Transferências</span>
                 </div>
              </button>
              <button onClick={onOpenFinance} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-white/5 hover:bg-surface/80 active:scale-95 transition-all">
                 <div className="bg-amber-500/10 text-amber-400 p-2 rounded-lg"><Wallet size={20} /></div>
                 <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Finanças</span>
                    <span className="text-[10px] text-secondary">{formatMoney(funds)}</span>
                 </div>
              </button>
           </div>
        </section>

        {/* Dual Classification */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-xs font-bold uppercase tracking-wider text-secondary">Classificação</h2>
             <button onClick={onOpenLeague} className="text-[10px] font-black text-primary uppercase tracking-widest">Ver Tudo</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Série A */}
             <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                <div className="bg-primary/10 px-3 py-2 border-b border-white/5 flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase">Série A - Elite</span>
                   <Trophy size={12} className="text-primary" />
                </div>
                <table className="w-full text-xs text-left">
                   <tbody className="divide-y divide-white/5">
                      {div1Standings.slice(0, 4).map((t, idx) => (
                         <tr key={t.id} className={clsx(t.id === team.id && "bg-primary/20")}>
                            <td className="px-3 py-2 font-black text-secondary w-6">{idx + 1}</td>
                            <td className="px-2 py-2 flex items-center gap-2">
                               <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${t.logoColor1} ${t.logoColor2}`}></div>
                               <span className="truncate">{t.name}</span>
                            </td>
                            <td className="px-3 py-2 text-right font-black">{t.points}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* Série B */}
             <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                <div className="bg-emerald-500/10 px-3 py-2 border-b border-white/5 flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase">Série B - Acesso</span>
                   <ChevronRight size={12} className="text-emerald-500" />
                </div>
                <table className="w-full text-xs text-left">
                   <tbody className="divide-y divide-white/5">
                      {div2Standings.slice(0, 4).map((t, idx) => (
                         <tr key={t.id} className={clsx(t.id === team.id && "bg-emerald-500/20")}>
                            <td className="px-3 py-2 font-black text-secondary w-6">{idx + 1}</td>
                            <td className="px-2 py-2 flex items-center gap-2">
                               <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${t.logoColor1} ${t.logoColor2}`}></div>
                               <span className="truncate">{t.name}</span>
                            </td>
                            <td className="px-3 py-2 text-right font-black">{t.points}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </section>

        {/* Player Stats (Artilheiros e Garçons) */}
        <section className="space-y-4">
           <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Destaques da Temporada</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Artilheiros */}
              <div className="bg-surface rounded-2xl border border-white/5 p-4">
                 <div className="flex items-center gap-2 mb-4">
                    <Flame size={18} className="text-rose-500" />
                    <h3 className="text-sm font-black uppercase">Artilharia</h3>
                 </div>
                 <div className="space-y-3">
                    {topScorers.map((p, idx) => (
                       <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className={`w-6 h-6 rounded bg-gradient-to-br ${p.teamColor} flex items-center justify-center text-[8px] font-black`}>{p.teamShort}</div>
                             <span className="text-xs font-bold truncate max-w-[100px]">{p.name}</span>
                          </div>
                          <span className="text-sm font-black text-rose-400 tabular-nums">{p.goals}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Assistências */}
              <div className="bg-surface rounded-2xl border border-white/5 p-4">
                 <div className="flex items-center gap-2 mb-4">
                    <HandHeart size={18} className="text-emerald-500" />
                    <h3 className="text-sm font-black uppercase">Garçons</h3>
                 </div>
                 <div className="space-y-3">
                    {topAssisters.map((p, idx) => (
                       <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className={`w-6 h-6 rounded bg-gradient-to-br ${p.teamColor} flex items-center justify-center text-[8px] font-black`}>{p.teamShort}</div>
                             <span className="text-xs font-bold truncate max-w-[100px]">{p.name}</span>
                          </div>
                          <span className="text-sm font-black text-emerald-400 tabular-nums">{p.assists}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-white/5 pb-safe z-50">
         <div className="flex justify-around items-center h-16">
            <button className="flex flex-col items-center justify-center w-full h-full text-primary gap-1">
               <LayoutDashboard size={22} /><span className="text-[9px] font-bold">Início</span>
            </button>
            <button onClick={onOpenTactics} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1">
               <Target size={22} /><span className="text-[9px] font-bold">Tática</span>
            </button>
            <button onClick={onOpenLeague} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1">
               <Trophy size={22} /><span className="text-[9px] font-bold">Liga</span>
            </button>
            <button onClick={onOpenNews} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1">
               <Newspaper size={22} /><span className="text-[9px] font-bold">News</span>
            </button>
            <button onClick={onOpenSettings} className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-white gap-1">
               <Settings size={22} /><span className="text-[9px] font-bold">Ajustes</span>
            </button>
         </div>
      </nav>
    </div>
  );
}
