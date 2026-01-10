
import React, { useState, useEffect, useRef } from 'react';
import { Team, MatchEvent, PlayingStyle, FormationType } from '../types';
import { Play, Pause, ArrowRightLeft, Settings2, X, Activity, MessageSquare, Zap, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Props {
  homeTeam: Team;
  awayTeam: Team;
  round: number;
  onFinish: (homeScore: number, awayScore: number, events: MatchEvent[]) => void;
}

interface Narration {
  minute: number;
  text: string;
  type: 'neutral' | 'danger' | 'goal' | 'event';
  teamId?: string;
}

export default function MatchScreen({ homeTeam: initialHomeTeam, awayTeam: initialAwayTeam, round, onFinish }: Props) {
  const [minute, setMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState<1 | 10 | 100>(10);
  
  const [homeTeam, setHomeTeam] = useState<Team>({ ...initialHomeTeam });
  const [currentStyle, setCurrentStyle] = useState<PlayingStyle>(initialHomeTeam.style);
  const [shoutActive, setShoutActive] = useState<string | null>(null);

  const [feed, setFeed] = useState<Narration[]>([]);
  const [stats, setStats] = useState({ homeShots: 0, awayShots: 0, possession: 50, momentum: 50 });

  const [showTacticsModal, setShowTacticsModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);
  
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [feed]);

  const addNarration = (text: string, type: Narration['type'] = 'neutral', teamId?: string) => {
    setFeed(prev => [...prev, { minute, text, type, teamId }]);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (minute < 96 && !isFinished && !isPaused) {
      const intervalTime = speed === 1 ? 1500 : (speed === 10 ? 300 : 80);
      interval = setInterval(() => {
        setMinute(m => {
          const nextMinute = m + 1;
          const shift = (Math.random() * 20 - 10);
          const newMomentum = Math.min(95, Math.max(5, stats.momentum + shift));
          
          setStats(prev => ({ ...prev, momentum: newMomentum, possession: Math.round(prev.possession * 0.95 + (newMomentum * 0.05)) }));

          if (Math.random() < 0.1) {
             const isHomeAttacking = Math.random() < (newMomentum / 100);
             const atkTeam = isHomeAttacking ? homeTeam : initialAwayTeam;
             if (Math.random() < 0.2) {
                if (isHomeAttacking) setHomeScore(s => s + 1); else setAwayScore(s => s + 1);
                addNarration(`GOOOOL DO ${atkTeam.shortName}!`, 'goal', atkTeam.id);
                toast.success(`GOL DO ${atkTeam.shortName}!`, { icon: '⚽' });
             } else {
                addNarration(`${atkTeam.shortName} cria uma boa chance de ataque!`, 'danger');
             }
          }

          if (nextMinute >= 90 + Math.floor(Math.random() * 5)) {
            setIsFinished(true);
            addNarration("FIM DE JOGO!", 'event');
            return nextMinute;
          }
          return nextMinute;
        });
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [minute, isFinished, isPaused, speed, stats.momentum]);

  return (
    <div className="flex flex-col h-screen bg-background text-white relative">
      <header className="bg-surface/50 border-b border-white/5 p-4 z-20">
        <div className="flex items-center justify-between max-w-lg mx-auto">
           <div className="flex flex-col items-center w-20">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${homeTeam.logoColor1} ${homeTeam.logoColor2} flex items-center justify-center font-black border border-white/10`}>{homeTeam.shortName}</div>
           </div>
           <div className="flex flex-col items-center">
              <div className="bg-black/40 px-6 py-2 rounded-3xl border border-white/10 flex items-center gap-4 mb-1">
                 <span className="text-3xl font-black">{homeScore}</span>
                 <div className="w-[1px] h-6 bg-white/10"></div>
                 <span className="text-3xl font-black text-white/40">{awayScore}</span>
              </div>
              <span className="text-lg font-black italic tabular-nums">{minute}'</span>
           </div>
           <div className="flex flex-col items-center w-20">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${initialAwayTeam.logoColor1} ${initialAwayTeam.logoColor2} flex items-center justify-center font-black border border-white/10 opacity-70`}>{initialAwayTeam.shortName}</div>
           </div>
        </div>
      </header>

      {/* Start Overlay - APENAS NO MINUTO 0 */}
      {minute === 0 && isPaused && (
         <div className="absolute inset-0 z-[60] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <Zap size={64} className="text-primary mb-6 animate-pulse" fill="currentColor" />
            <h2 className="text-3xl font-black mb-2">Tudo Pronto!</h2>
            <p className="text-secondary text-sm mb-8 max-w-[240px]">Escalação confirmada. O estádio está lotado para o início da partida.</p>
            <button 
               onClick={() => setIsPaused(false)}
               className="w-full max-w-xs py-6 bg-primary text-white font-black text-xl rounded-[32px] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-95 transition-all animate-bounce"
            >
               <Play size={24} fill="currentColor" />
               PONTAPÉ INICIAL
            </button>
         </div>
      )}

      <main className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        <div className="bg-surface/30 rounded-2xl p-4 border border-white/5">
           <div className="h-2 bg-black/40 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 bg-primary transition-all duration-1000" style={{ left: '0', width: `${stats.momentum}%` }}></div>
           </div>
        </div>

        <div ref={feedRef} className="flex-1 bg-black/20 rounded-[32px] border border-white/5 overflow-y-auto p-6 space-y-4 no-scrollbar">
           {feed.map((msg, i) => (
              <div key={i} className={clsx("flex gap-3", msg.type === 'goal' ? "text-emerald-400 font-black" : "text-gray-300")}>
                 <span className="text-[10px] opacity-40">{msg.minute}'</span>
                 <p className="text-sm">{msg.text}</p>
              </div>
           ))}
        </div>
      </main>

      {!isFinished && minute > 0 && (
         <div className="p-6 bg-surface/90 border-t border-white/10 space-y-4 pb-safe">
            <div className="flex justify-between items-center gap-4">
               <button onClick={() => setIsPaused(!isPaused)} className="flex-1 py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2">
                  {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />} {isPaused ? 'CONTINUAR' : 'PAUSAR'}
               </button>
               <button onClick={() => setSpeed(s => s === 1 ? 10 : (s === 10 ? 100 : 1))} className="w-16 h-14 bg-surface border border-white/10 rounded-2xl flex items-center justify-center text-xs font-black">
                  {speed}x
               </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => setShowTacticsModal(true)} className="bg-surface/50 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-white/5"><Settings2 size={16}/> TÁTICA</button>
               <button onClick={() => setShowSubModal(true)} className="bg-emerald-500/10 text-emerald-500 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-emerald-500/20"><ArrowRightLeft size={16}/> SUBS</button>
            </div>
         </div>
      )}

      {isFinished && (
         <div className="fixed inset-x-0 bottom-0 p-8 bg-primary z-50 animate-in slide-in-from-bottom pb-safe flex flex-col items-center gap-4">
            <h4 className="text-2xl font-black italic">FIM DE JOGO</h4>
            <button onClick={() => onFinish(homeScore, awayScore, [])} className="w-full max-w-sm h-16 bg-white text-primary rounded-3xl font-black uppercase shadow-2xl">VOLTAR AO CT</button>
         </div>
      )}
    </div>
  );
}
