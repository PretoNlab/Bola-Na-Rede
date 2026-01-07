import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Check, Zap, ArrowRight } from 'lucide-react';
import { Team } from '../types';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  onSelect: (teamId: string) => void;
  onBack: () => void;
}

export default function TeamSelectionScreen({ teams, onSelect, onBack }: Props) {
  const [selectedId, setSelectedId] = useState<string>(teams[0].id);

  const selectedTeam = teams.find(t => t.id === selectedId);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold">Bolanarede</h2>
        <button className="p-2 rounded-full hover:bg-surface text-white transition-colors">
          <HelpCircle className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 scroll-smooth no-scrollbar">
        <div className="py-2">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Temporada 2026</p>
          <h1 className="text-3xl font-bold text-white mb-2">Escolha seu Clube</h1>
          <p className="text-secondary text-sm leading-relaxed mb-6">
            Selecione o time que você irá gerenciar rumo ao título do Campeonato Baiano.
          </p>

          {/* Filters */}
          <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">
              Força Geral
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-surface border border-white/5 text-secondary hover:text-white text-xs font-bold transition-colors">
              Alfabeto
            </button>
            <button className="flex-shrink-0 px-4 py-2 rounded-full bg-surface border border-white/5 text-secondary hover:text-white text-xs font-bold transition-colors">
              Favoritos
            </button>
          </div>

          {/* Teams List */}
          <div className="flex flex-col gap-3">
            {teams.map((team) => {
              const isSelected = selectedId === team.id;
              const overall = Math.round((team.attack + team.defense) / 2);
              
              return (
                <div 
                  key={team.id}
                  onClick={() => setSelectedId(team.id)}
                  className={clsx(
                    "relative flex flex-col gap-3 rounded-2xl p-4 cursor-pointer transition-all duration-300",
                    isSelected 
                      ? "bg-surface border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02]" 
                      : "bg-surface border border-transparent hover:bg-surface/80"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-primary text-white rounded-bl-xl rounded-tr-xl px-2 py-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Team Logo Placeholder */}
                    <div className={`shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} shadow-lg`}>
                      <span className="text-white font-black text-lg tracking-wider drop-shadow-md">{team.shortName}</span>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white truncate">{team.name}</h3>
                        <div className={clsx("flex items-center gap-1 px-2 py-0.5 rounded-md", isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-secondary")}>
                          <Zap className="w-3 h-3" />
                          <span className="text-xs font-bold">{overall}</span>
                        </div>
                      </div>
                      <p className="text-secondary text-xs font-medium">{team.city}</p>
                    </div>
                  </div>

                  {/* Expanded Stats if Selected */}
                  {isSelected ? (
                    <div className="flex items-center gap-4 mt-1 animate-fade-in-up">
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-secondary uppercase">
                          <span>Ataque</span>
                          <span className="text-white">{team.attack}</span>
                        </div>
                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${team.attack}%` }}></div>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-secondary uppercase">
                          <span>Defesa</span>
                          <span className="text-white">{team.defense}</span>
                        </div>
                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${team.defense}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 text-[10px] font-bold text-secondary">
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> ATT {team.attack}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> DEF {team.defense}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 w-full z-20 bg-gradient-to-t from-background via-background to-transparent pt-12 pb-6 px-4">
        <button 
          onClick={() => onSelect(selectedId)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-white shadow-xl shadow-primary/25 transition-transform active:scale-[0.98] hover:bg-primary/90"
        >
          <span className="text-base font-bold">Confirmar {selectedTeam?.name}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}