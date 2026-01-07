import React, { useState, useEffect, useRef } from 'react';
import { Team, MatchEvent } from '../types';
import { Play, LayoutDashboard, Clock, Zap, FastForward } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  homeTeam: Team;
  awayTeam: Team;
  round: number;
  onFinish: (homeScore: number, awayScore: number) => void;
}

const GOAL_PHRASES = [
   "GOL!",
   "GOLAÇO!",
   "GOOOL!",
   "TÁ NA REDE!",
   "OLHA O GOL!"
];

const EVENT_PHRASES = [
   "Chute perigoso para fora",
   "Defesa espetacular do goleiro",
   "Bola na trave!",
   "Dominio de jogo no meio campo",
   "Contra-ataque rápido",
   "Falta perigosa na entrada da área",
   "Escanteio cobrado com perigo"
];

export default function MatchScreen({ homeTeam, awayTeam, round, onFinish }: Props) {
  const [minute, setMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState<1 | 10 | 100>(10); // Start fast (10x)
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
     }
  }, [events]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Determine interval speed based on speed state
    const intervalTime = speed === 1 ? 150 : (speed === 10 ? 30 : 5);

    if (minute < 95 && !isFinished) {
      interval = setInterval(() => {
        setMinute(m => {
          const nextMinute = m + 1;
          
          // Simulation Logic per minute
          const roll = Math.random();
          
          const homeAttackPower = (homeTeam.attack / 3000) * 1.1; 
          const awayAttackPower = awayTeam.attack / 3000;
          
          if (roll < homeAttackPower) {
             const phrase = GOAL_PHRASES[Math.floor(Math.random() * GOAL_PHRASES.length)];
             setHomeScore(s => s + 1);
             addEvent(nextMinute, 'goal', homeTeam.id, `${phrase} ${homeTeam.name}`);
             if(speed === 1) toast.success(`GOL! ${homeTeam.name}`, { icon: '⚽' });
          } else if (roll < homeAttackPower + awayAttackPower) {
             const phrase = GOAL_PHRASES[Math.floor(Math.random() * GOAL_PHRASES.length)];
             setAwayScore(s => s + 1);
             addEvent(nextMinute, 'goal', awayTeam.id, `${phrase} ${awayTeam.name}`);
             if(speed === 1) toast.success(`GOL! ${awayTeam.name}`, { icon: '⚽', style: { border: '1px solid #ef4444' } });
          } else if (roll > 0.992) {
             // Card
             const isHome = Math.random() > 0.5;
             const teamId = isHome ? homeTeam.id : awayTeam.id;
             addEvent(nextMinute, 'card_yellow', teamId, "Cartão Amarelo");
          } else if (roll > 0.95 && roll < 0.96) {
             // Flavor event
             const flavor = EVENT_PHRASES[Math.floor(Math.random() * EVENT_PHRASES.length)];
             const isHome = Math.random() > 0.5;
             addEvent(nextMinute, 'whistle', isHome ? homeTeam.id : awayTeam.id, flavor);
          }

          if (nextMinute === 45) {
             addEvent(45, 'whistle', undefined, "Fim do 1º Tempo");
          }
          if (nextMinute === 90) {
             addEvent(90, 'whistle', undefined, "Fim de Jogo");
             setIsFinished(true);
          }
          
          return nextMinute;
        });
      }, intervalTime);
    }

    return () => clearInterval(interval);
  }, [minute, homeTeam, awayTeam, speed, isFinished]);

  const addEvent = (minute: number, type: MatchEvent['type'], teamId: string | undefined, description: string) => {
    setEvents(prev => [{ minute, type, teamId, description }, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-background/95 backdrop-blur-sm p-4 border-b border-white/5">
        <div className="w-10"></div>
        <h2 className="flex-1 text-center text-xs font-bold uppercase tracking-widest opacity-80">
           Campeonato Baiano • Rodada {round}
        </h2>
        <div className="w-10 flex justify-end">
           <button 
             onClick={() => setSpeed(s => s === 1 ? 10 : (s === 10 ? 100 : 1))}
             className="p-2 bg-surface rounded-full active:scale-95 transition-transform"
           >
              {speed === 1 && <Play size={16} />}
              {speed === 10 && <FastForward size={16} className="text-primary" />}
              {speed === 100 && <Zap size={16} className="text-yellow-400" />}
           </button>
        </div>
      </div>

      {/* Scoreboard Area */}
      <div className="relative w-full flex flex-col items-center pt-8 pb-10 bg-gradient-to-b from-surface to-background">
         {/* Live Status Chip */}
         <div className="mb-6 flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
            {!isFinished ? (
              <>
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                 </span>
                 <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                   {minute < 45 ? '1º Tempo' : '2º Tempo'} • {minute}'
                 </span>
              </>
            ) : (
               <span className="text-secondary text-[10px] font-black uppercase tracking-widest">Partida Encerrada</span>
            )}
         </div>

         <div className="grid grid-cols-[1fr_auto_1fr] w-full max-w-md px-6 items-center gap-4">
            <div className="flex flex-col items-center gap-2 animate-in slide-in-from-left duration-700">
               <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${homeTeam.logoColor1} ${homeTeam.logoColor2} flex items-center justify-center shadow-2xl ring-4 ring-surface/50`}>
                  <span className="text-xl font-black">{homeTeam.shortName}</span>
               </div>
               <span className="text-lg font-bold text-center leading-tight">{homeTeam.name}</span>
            </div>

            <div className="flex flex-col items-center">
               <span className="text-6xl font-black tracking-tighter tabular-nums leading-none">
                  {homeScore} - {awayScore}
               </span>
            </div>

            <div className="flex flex-col items-center gap-2 animate-in slide-in-from-right duration-700">
               <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${awayTeam.logoColor1} ${awayTeam.logoColor2} flex items-center justify-center shadow-2xl ring-4 ring-surface/50`}>
                  <span className="text-xl font-black">{awayTeam.shortName}</span>
               </div>
               <span className="text-lg font-bold text-center leading-tight">{awayTeam.name}</span>
            </div>
         </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 w-full bg-background px-4 pb-24 relative overflow-y-auto" ref={scrollRef}>
         <div className="max-w-md mx-auto relative pt-4">
            <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-white/5 z-0"></div>
            
            {events.map((ev, i) => (
               <div key={i} className="relative grid grid-cols-[40px_1fr] gap-x-4 mb-4 group animate-fade-in-up">
                  <div className="relative flex flex-col items-center z-10">
                     <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-background shadow-lg
                        ${ev.type === 'goal' ? 'bg-surface ring-1 ring-primary' : 
                          ev.type === 'card_yellow' ? 'bg-surface ring-1 ring-yellow-500' : 'bg-surface ring-1 ring-secondary'}
                     `}>
                        {ev.type === 'goal' && <span className="text-lg">⚽</span>}
                        {ev.type === 'card_yellow' && <div className="w-3 h-4 bg-yellow-500 rounded-sm"></div>}
                        {ev.type === 'whistle' && <Clock size={16} className="text-secondary" />}
                     </div>
                  </div>
                  
                  <div className="flex flex-col py-2 border-b border-white/5 pb-4">
                     <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-base font-bold ${ev.type === 'goal' ? 'text-white' : 'text-secondary'}`}>
                           {ev.description}
                        </span>
                        <span className="text-primary text-sm font-mono font-bold">{ev.minute}'</span>
                     </div>
                     {ev.teamId && (
                       <span className="text-xs text-secondary font-medium">
                          {ev.teamId === homeTeam.id ? homeTeam.name : awayTeam.name}
                       </span>
                     )}
                  </div>
               </div>
            ))}
            
            {events.length === 0 && (
               <div className="flex items-center gap-4 text-secondary opacity-50 p-4">
                  <div className="w-10 flex justify-center"><Clock size={20} /></div>
                  <span className="text-sm font-bold uppercase tracking-widest">Início de Partida</span>
               </div>
            )}
         </div>
      </div>

      {/* Footer Action */}
      {isFinished && (
        <div className="fixed bottom-0 w-full bg-background/95 backdrop-blur-md border-t border-white/5 p-4 z-50 animate-in slide-in-from-bottom">
           <button 
             onClick={() => onFinish(homeScore, awayScore)}
             className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-4 px-6 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
           >
              <LayoutDashboard size={20} />
              Voltar ao Dashboard
           </button>
        </div>
      )}
    </div>
  );
}