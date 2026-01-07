
import React, { useState } from 'react';
import { Team } from '../types';
import { Play, Users, ArrowLeftRight, Wallet, LayoutDashboard, Trophy, Settings, Newspaper, Target, Globe, ChevronRight, UserRound, Flame, Award } from 'lucide-react';
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

  const onboardingMessages = [
    { title: "Bem-vindo, Professor!", text: `Sua missão no ${team.name} começa agora. A cidade espera por títulos!`, highlight: null },
    { title: "Ranking Mundial", text: "Ao vencer jogos, você ganha Prestígio para subir no Hall da Fama Global.", highlight: "online" }
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-white relative">
      {!onboardingComplete && (
        <div className="absolute inset-0 z-[100] flex flex-col justify-end p-6">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
           <div className="relative bg-surface border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <UserRound size={24} />
                 </div>
                 <h3 className="text-xl font-black">{onboardingMessages[onboardingStep].title}</h3>
              </div>
              <p className="text-sm text-secondary leading-relaxed mb-6">{onboardingMessages[onboardingStep].text}</p>
              <button onClick={() => onboardingStep < onboardingMessages.length - 1 ? setOnboardingStep(s => s + 1) : onCompleteOnboarding()} className="w-full bg-primary py-4 rounded-2xl font-black uppercase text-xs">Continuar</button>
           </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center shadow-lg`}>
               <span className="text-[10px] font-black">{team.shortName}</span>
            </div>
            <div>
               <h1 className="text-sm font-bold">{team.name}</h1>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase text-emerald-500">Ranking: #{Math.floor(Math.random() * 500) + 100}</span>
               </div>
            </div>
         </div>
         <button onClick={onSimulate} className="bg-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
            <Play size={14} fill="currentColor" /> Simular
         </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 no-scrollbar">
         {/* Prestige Status */}
         <div className="bg-surface/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Award size={24} className="text-yellow-500" />
               <div>
                  <p className="text-[10px] text-secondary font-bold uppercase">Prestígio do Técnico</p>
                  <p className="text-sm font-black text-white">{team.prestige || 1200} pts</p>
               </div>
            </div>
            <button onClick={onOpenLeague} className="text-[10px] font-black text-primary uppercase flex items-center gap-1">HALL DA FAMA <ChevronRight size={10} /></button>
         </div>

         {/* Next Match */}
         <div className="bg-surface border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${team.logoColor1} to-transparent`}></div>
            <div className="flex flex-col items-center flex-1">
               <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} mb-2`}></div>
               <span className="text-xs font-bold">{team.shortName}</span>
            </div>
            <span className="text-2xl font-black text-white/10 italic">VS</span>
            <div className="flex flex-col items-center flex-1">
               <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${nextOpponent.logoColor1} ${nextOpponent.logoColor2} mb-2`}></div>
               <span className="text-xs font-bold">{nextOpponent.shortName}</span>
            </div>
         </div>

         {/* Management Grid */}
         <div className="grid grid-cols-2 gap-3">
            <button onClick={onOpenTactics} className="bg-surface border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
               <Target className="text-primary" size={20} />
               <span className="text-sm font-bold">Tática</span>
            </button>
            <button onClick={onOpenSquad} className="bg-surface border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
               <Users className="text-blue-400" size={20} />
               <span className="text-sm font-bold">Elenco</span>
            </button>
            <button onClick={onOpenMarket} className="bg-surface border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
               <ArrowLeftRight className="text-emerald-400" size={20} />
               <span className="text-sm font-bold">Mercado</span>
            </button>
            <button onClick={onOpenFinance} className="bg-surface border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
               <Wallet className="text-amber-400" size={20} />
               <span className="text-sm font-bold">Finanças</span>
            </button>
         </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-white/5 h-16 flex justify-around items-center px-4">
         <button className="flex flex-col items-center text-primary"><LayoutDashboard size={20} /><span className="text-[9px] font-bold">Início</span></button>
         <button onClick={onOpenTactics} className="flex flex-col items-center text-secondary"><Target size={20} /><span className="text-[9px] font-bold">Tática</span></button>
         <button onClick={onOpenLeague} className="flex flex-col items-center text-secondary"><Trophy size={20} /><span className="text-[9px] font-bold">Liga</span></button>
         <button onClick={onOpenNews} className="flex flex-col items-center text-secondary"><Newspaper size={20} /><span className="text-[9px] font-bold">News</span></button>
         <button onClick={onOpenSettings} className="flex flex-col items-center text-secondary"><Settings size={20} /><span className="text-[9px] font-bold">Ajustes</span></button>
      </nav>
    </div>
  );
}
