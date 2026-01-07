import React, { useState } from 'react';
import { Team, Player, FormationType, PlayingStyle } from '../types';
import { ArrowLeft, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  team: Team;
  onBack: () => void;
  onSave: (formation: FormationType, style: PlayingStyle, lineup: string[]) => void;
}

// Added '5-3-2' to FORMATIONS array
const FORMATIONS: FormationType[] = ['4-4-2', '4-3-3', '3-5-2', '5-4-1', '4-5-1', '5-3-2'];
const STYLES: PlayingStyle[] = ['Ultra-Defensivo', 'Defensivo', 'Equilibrado', 'Ofensivo', 'Tudo-ou-Nada'];

export default function TacticsScreen({ team, onBack, onSave }: Props) {
  const [tempFormation, setTempFormation] = useState<FormationType>(team.formation);
  const [tempStyle, setTempStyle] = useState<PlayingStyle>(team.style);
  const [tempLineup, setTempLineup] = useState<string[]>(team.lineup);

  const togglePlayerInLineup = (playerId: string) => {
    if (tempLineup.includes(playerId)) {
      setTempLineup(prev => prev.filter(id => id !== playerId));
    } else {
      if (tempLineup.length < 11) {
        setTempLineup(prev => [...prev, playerId]);
      }
    }
  };

  const isComplete = tempLineup.length === 11;

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-surface"><ArrowLeft size={20} /></button>
          <h1 className="text-lg font-bold">Tática e Escalação</h1>
          <button 
            disabled={!isComplete}
            onClick={() => onSave(tempFormation, tempStyle, tempLineup)}
            className={clsx("p-2 rounded-full", isComplete ? "text-emerald-500 hover:bg-emerald-500/10" : "text-gray-600 cursor-not-allowed")}
          >
            <Save size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 no-scrollbar">
        {/* Tactics Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary px-1">Estratégia do Treinador</h2>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase">Formação</label>
                <select 
                   value={tempFormation}
                   onChange={(e) => setTempFormation(e.target.value as FormationType)}
                   className="w-full bg-surface border border-white/5 p-3 rounded-xl text-sm font-bold outline-none focus:border-primary"
                >
                   {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase">Estilo de Jogo</label>
                <select 
                   value={tempStyle}
                   onChange={(e) => setTempStyle(e.target.value as PlayingStyle)}
                   className="w-full bg-surface border border-white/5 p-3 rounded-xl text-sm font-bold outline-none focus:border-primary"
                >
                   {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>
        </section>

        {/* Squad Selection Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Titulares ({tempLineup.length}/11)</h2>
             {isComplete ? (
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase">
                   <CheckCircle2 size={12} /> Time Pronto
                </div>
             ) : (
                <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase">
                   <AlertCircle size={12} /> Escalar 11
                </div>
             )}
          </div>

          <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
             <div className="divide-y divide-white/5">
                {team.roster.sort((a,b) => b.overall - a.overall).map(player => {
                   const isStarter = tempLineup.includes(player.id);
                   return (
                      <button 
                         key={player.id}
                         onClick={() => togglePlayerInLineup(player.id)}
                         className={clsx(
                            "w-full flex items-center justify-between p-3 transition-colors",
                            isStarter ? "bg-primary/10" : "hover:bg-white/5"
                         )}
                      >
                         <div className="flex items-center gap-3">
                            <div className={clsx(
                               "w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] border",
                               isStarter ? "bg-primary text-white border-primary" : "bg-background text-secondary border-white/10"
                            )}>
                               {player.position}
                            </div>
                            <div className="flex flex-col items-start">
                               <span className={clsx("text-sm font-bold", isStarter ? "text-white" : "text-gray-400")}>{player.name}</span>
                               <span className="text-[10px] text-secondary">OVR {player.overall} • 2{player.age%10} anos</span>
                            </div>
                         </div>
                         <div className={clsx(
                            "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                            isStarter ? "bg-primary border-primary scale-110" : "bg-transparent border-white/20"
                         )}>
                            {isStarter && <div className="w-2 h-2 rounded-full bg-white"></div>}
                         </div>
                      </button>
                   );
                })}
             </div>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <div className="fixed bottom-0 w-full p-4 bg-background/95 backdrop-blur-md border-t border-white/5 z-50">
         <div className="flex items-center justify-between text-xs font-bold text-secondary">
            <span>Escalação Obrigatória</span>
            <span className={isComplete ? "text-emerald-500" : "text-rose-500"}>{tempLineup.length} / 11 selecionados</span>
         </div>
      </div>
    </div>
  );
}