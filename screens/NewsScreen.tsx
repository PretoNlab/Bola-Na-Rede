import React from 'react';
import { MatchResult } from '../types';
import { ArrowLeft, Newspaper } from 'lucide-react';

interface Props {
  history: MatchResult[];
  currentRound: number;
  onBack: () => void;
}

export default function NewsScreen({ history, currentRound, onBack }: Props) {
  // Generate fake news based on history
  const newsItems = [];
  
  if (currentRound === 1) {
     newsItems.push({
        title: "Começa o Baianão 2026!",
        body: "A expectativa é alta para o início de mais uma temporada do campeonato estadual. Quem levantará a taça?",
        tag: "Destaque",
        color: "bg-blue-500"
     });
     newsItems.push({
        title: "Mercado da Bola Agitado",
        body: "Clubes correm contra o tempo para fechar seus elencos antes do fechamento da janela de transferências.",
        tag: "Transferências",
        color: "bg-emerald-500"
     });
  } else {
     // Generate news from last round
     const lastRoundMatches = history.filter(m => m.round === currentRound - 1);
     const bigWin = lastRoundMatches.find(m => Math.abs(m.homeScore - m.awayScore) >= 3);
     const draw = lastRoundMatches.find(m => m.homeScore === m.awayScore && m.homeScore > 1);

     if (bigWin) {
        const winner = bigWin.homeScore > bigWin.awayScore ? bigWin.homeTeamName : bigWin.awayTeamName;
        newsItems.push({
           title: `${winner} massacra na rodada!`,
           body: `Uma performance de gala garantiu uma vitória elástica para o ${winner} na última rodada.`,
           tag: "Goleada",
           color: "bg-purple-500"
        });
     }

     if (draw) {
        newsItems.push({
           title: `Tudo igual entre ${draw.homeTeamName} e ${draw.awayTeamName}`,
           body: "Um jogo eletrizante terminou sem vencedores, mas com muitos gols para a torcida.",
           tag: "Resumo",
           color: "bg-orange-500"
        });
     }

     newsItems.push({
        title: `Rodada ${currentRound} promete emoções`,
        body: "Os técnicos preparam suas estratégias para os jogos decisivos deste fim de semana.",
        tag: "Pré-jogo",
        color: "bg-blue-500"
     });
  }

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">Notícias</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
         {newsItems.map((news, idx) => (
            <div key={idx} className="bg-surface rounded-xl overflow-hidden border border-white/5 shadow-lg animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
               <div className="h-2 w-full" style={{ backgroundColor: news.color.replace('bg-', '') }}></div> {/* Fallback trick logic not perfect for dynamic classes in tailwind unless safelisted, simplified below */}
               <div className={`h-1 w-full ${news.color}`}></div>
               <div className="p-4">
                  <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white mb-2 ${news.color}`}>
                     {news.tag}
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-2">{news.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{news.body}</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                     <Newspaper size={12} />
                     <span>Redação BN</span>
                  </div>
               </div>
            </div>
         ))}
      </main>
    </div>
  );
}