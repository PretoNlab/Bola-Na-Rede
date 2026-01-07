
import React, { useState, useEffect, useRef } from 'react';
import { Team, MatchEvent, Player, FormationType, PlayingStyle } from '../types';
import { Play, Pause, LayoutDashboard, Clock, Zap, FastForward, Target, UserPlus, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Props {
  homeTeam: Team;
  awayTeam: Team;
  round: number;
  onFinish: (homeScore: number, awayScore: number, scorers: {scorerId: string}[]) => void;
}

export default function MatchScreen({ homeTeam, awayTeam, round, onFinish }: Props) {
  const [minute, setMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 10 | 100>(10);
  const [matchScorers, setMatchScorers] = useState<{scorerId: string}[]>([]);
  
  const [currentStyle, setCurrentStyle] = useState<PlayingStyle>(homeTeam.style);
  const [activeDecision, setActiveDecision] = useState<{title: string, options: {label: string, action: () => void}[]} | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const triggerVibration = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const getRandomScorer = (team: Team) => {
    const starters = team.roster.filter(p => team.lineup.includes(p.id));
    const attackers = starters.filter(p => p.position === 'ATA' || p.position === 'MEI');
    const pool = attackers.length > 0 ? attackers : starters;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const calculatePower = (team: Team, style: PlayingStyle) => {
     const starters = team.roster.filter(p => team.lineup.includes(p.id));
     const avgOvr = starters.length > 0 
        ? starters.reduce((acc, p) => acc + p.overall, 0) / starters.length 
        : (team.attack + team.defense) / 2;

     let attMod = 1.0;
     let defMod = 1.0;

     switch(style) {
        case 'Ultra-Defensivo': attMod = 0.5; defMod = 1.6; break;
        case 'Defensivo': attMod = 0.8; defMod = 1.3; break;
        case 'Ofensivo': attMod = 1.3; defMod = 0.7; break;
        case 'Tudo-ou-Nada': attMod = 1.8; defMod = 0.4; break;
     }

     return { att: (avgOvr / 3000) * attMod, def: (avgOvr / 3000) * defMod };
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (minute < 95 && !isFinished && !isPaused && !activeDecision) {
      const intervalTime = speed === 1 ? 500 : (speed === 10 ? 100 : 20);
      interval = setInterval(() => {
        setMinute(m => {
          const nextMinute = m + 1;
          const roll = Math.random();
          
          const hPower = calculatePower(homeTeam, currentStyle);
          const aPower = calculatePower(awayTeam, awayTeam.style);

          const homeGoalProb = hPower.att * (1 / aPower.def) * 0.05;
          const awayGoalProb = aPower.att * (1 / hPower.def) * 0.05;
          
          if (roll < homeGoalProb) {
             const scorer = getRandomScorer(homeTeam);
             setHomeScore(s => s + 1);
             setMatchScorers(prev => [...prev, { scorerId: scorer.id }]);
             addEvent(nextMinute, 'goal', homeTeam.id, `GOL DO ${homeTeam.name.toUpperCase()}! Marcou ${scorer.name}!`);
             triggerVibration([100, 50, 100]); // Vibração dupla para gol
          } else if (roll < homeGoalProb + awayGoalProb) {
             const scorer = getRandomScorer(awayTeam);
             setAwayScore(s => s + 1);
             setMatchScorers(prev => [...prev, { scorerId: scorer.id }]);
             addEvent(nextMinute, 'goal', awayTeam.id, `GOL DO ${awayTeam.name.toUpperCase()}! Marcou ${scorer.name}!`);
             triggerVibration(200); // Vibração simples para gol adversário
          }

          if (nextMinute === 45 || nextMinute === 75) {
             triggerDecision(nextMinute);
          }

          if (nextMinute >= 90 + Math.floor(Math.random() * 5)) {
             setIsFinished(true);
             addEvent(nextMinute, 'whistle', undefined, "Fim de Jogo!");
             triggerVibration([50, 50, 50, 50, 200]); // Padrão de apito final
             return nextMinute;
          }
          return nextMinute;
        });
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [minute, isFinished, isPaused, speed, currentStyle, activeDecision]);

  const addEvent = (minute: number, type: MatchEvent['type'], teamId: string | undefined, description: string) => {
    setEvents(prev => [{ minute, type, teamId, description }, ...prev]);
  };

  const triggerDecision = (min: number) => {
     setIsPaused(true);
     triggerVibration(50);
     const options = [
        { label: "Manter postura", action: () => { setIsPaused(false); setActiveDecision(null); } },
        { label: "Mudar para Ofensivo", action: () => { setCurrentStyle('Ofensivo'); setIsPaused(false); setActiveDecision(null); toast.success("Atacar!"); } },
        { label: "Mudar para Defensivo", action: () => { setCurrentStyle('Defensivo'); setIsPaused(false); setActiveDecision(null); toast.success("Recuar!"); } }
     ];
     setActiveDecision({
        title: `Decisão de Campo (${min}')`,
        options: options
     });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white relative overflow-hidden">
      <header className="flex items-center bg-surface/80 backdrop-blur-md p-4 border-b border-white/5 z-20">
        <button onClick={() => setIsPaused(!isPaused)} className="p-2 bg-background/50 rounded-lg">
           {isPaused ? <Play size={18} className="text-emerald-500" /> : <Pause size={18} />}
        </button>
        <h2 className="flex-1 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Rodada {round}</h2>
        <div className="flex gap-2">
           <button onClick={() => setSpeed(s => s === 1 ? 10 : (s === 10 ? 100 : 1))} className="p-2 bg-background/50 rounded-lg text-primary text-xs font-bold">
              {speed}x
           </button>
        </div>
      </header>

      <div className="pt-6 pb-8 bg-gradient-to-b from-surface to-background px-6">
         <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center gap-2">
               <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${homeTeam.logoColor1} ${homeTeam.logoColor2} flex items-center justify-center font-black shadow-xl`}>
                  {homeTeam.shortName}
               </div>
               <span className="text-[10px] font-bold text-center w-20 truncate uppercase">{homeTeam.name}</span>
            </div>
            
            <div className="flex flex-col items-center">
               <span className="text-xs font-black text-primary mb-1">{minute}'</span>
               <span className="text-5xl font-black tracking-tighter tabular-nums">{homeScore} - {awayScore}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
               <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${awayTeam.logoColor1} ${awayTeam.logoColor2} flex items-center justify-center font-black shadow-xl opacity-80`}>
                  {awayTeam.shortName}
               </div>
               <span className="text-[10px] font-bold text-center w-20 truncate uppercase">{awayTeam.name}</span>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 space-y-4 no-scrollbar" ref={scrollRef}>
         {events.map((ev, i) => (
            <div key={i} className={clsx(
               "flex gap-4 items-start p-3 rounded-xl animate-in slide-in-from-left duration-300",
               ev.type === 'goal' ? "bg-primary/10 border border-primary/20" : "bg-surface/30 border border-white/5"
            )}>
               <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0">
                  {ev.type === 'goal' ? '⚽' : ev.type === 'whistle' ? '🏁' : '💬'}
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">{ev.description}</span>
                  <span className="text-[9px] text-secondary font-black uppercase mt-1">{ev.minute}'</span>
               </div>
            </div>
         ))}
      </div>

      {!isFinished ? (
         <div className="fixed bottom-0 left-0 w-full p-4 grid grid-cols-2 gap-3 bg-surface/90 backdrop-blur-xl border-t border-white/5 z-30">
            <button onClick={() => { setIsPaused(true); }} className="flex items-center justify-center gap-2 bg-background/50 py-4 rounded-xl text-xs font-bold border border-white/10">
               <Target size={16} /> Estilo: {currentStyle}
            </button>
            <button onClick={() => toast("Substituições em breve!")} className="flex items-center justify-center gap-2 bg-background/50 py-4 rounded-xl text-xs font-bold border border-white/10">
               <UserPlus size={16} /> Substituir
            </button>
         </div>
      ) : (
         <div className="fixed bottom-0 left-0 w-full p-6 bg-background/95 backdrop-blur-xl border-t border-white/5 z-50 animate-in slide-in-from-bottom">
            <button 
               onClick={() => onFinish(homeScore, awayScore, matchScorers)}
               className="w-full bg-primary py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20"
            >
               Encerrar Partida
            </button>
         </div>
      )}

      {activeDecision && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-surface border border-white/10 rounded-3xl p-6 shadow-2xl">
               <AlertTriangle className="text-amber-500 w-10 h-10 mb-4 mx-auto" />
               <h3 className="text-lg font-black text-center mb-6">{activeDecision.title}</h3>
               <div className="space-y-3">
                  {activeDecision.options.map((opt, i) => (
                     <button key={i} onClick={opt.action} className="w-full py-4 px-6 bg-background/50 border border-white/5 rounded-xl text-sm font-bold text-left hover:bg-primary/20 transition-all">
                        {opt.label}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
