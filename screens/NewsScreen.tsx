
import React from 'react';
import { MatchResult } from '../types';
import { ArrowLeft, Newspaper, AlertCircle, TrendingUp, UserMinus, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  history: MatchResult[];
  currentRound: number;
  onBack: () => void;
}

export default function NewsScreen({ history, currentRound, onBack }: Props) {
  const generateDynamicNews = () => {
    const news = [];
    
    // Default starting news
    if (currentRound === 1) {
       news.push({
          id: 'n1',
          title: "BAIANÃO 2026: A HORA DA VERDADE!",
          body: "Os clubes entraram em campo hoje para a abertura oficial. Especialistas apontam Bahia e Vitória como grandes favoritos, mas surpresas podem acontecer.",
          category: 'BOARD',
          icon: <Newspaper size={18} />,
          color: 'text-primary'
       });
    }

    // Reaction to results
    if (history.length > 0) {
       const lastMatches = history.filter(m => m.round === currentRound - 1);
       const bigWin = lastMatches.find(m => Math.abs(m.homeScore - m.awayScore) >= 3);
       
       if (bigWin) {
          const winner = bigWin.homeScore > bigWin.awayScore ? bigWin.homeTeamName : bigWin.awayTeamName;
          news.push({
             id: 'n2',
             title: `${winner.toUpperCase()} MOSTRA FORÇA!`,
             body: `Uma goleada histórica que deixou os torcedores em êxtase. O técnico declarou: "Estamos apenas começando".`,
             category: 'MATCH',
             icon: <TrendingUp size={18} />,
             color: 'text-emerald-500'
          });
       }

       const userResult = lastMatches.find(m => m.isUserMatch);
       if (userResult && (userResult.homeScore === 0 && userResult.awayScore === 0)) {
          news.push({
             id: 'n3',
             title: "JOGO SONOLENTO FRUSTRA TORCIDA",
             body: "A falta de gols no último jogo foi motivo de vaias. Os atacantes parecem estar com a pontaria descalibrada.",
             category: 'COMPLAINT',
             icon: <AlertCircle size={18} />,
             color: 'text-amber-500'
          });
       }
    }

    // Random events
    news.push({
       id: 'n4',
       title: "DM LOTADO: CRAQUE FORA!",
       body: "Exames confirmaram lesão de grau 2 em um dos principais meias da liga. Previsão de 3 semanas fora dos gramados.",
       category: 'INJURY',
       icon: <UserMinus size={18} />,
       color: 'text-rose-500'
    });

    news.push({
       id: 'n5',
       title: "DIRETORIA EXIGE RESULTADOS",
       body: "Rumores indicam que alguns técnicos estão na 'corda bamba'. A próxima rodada pode ser decisiva para muitas demissões.",
       category: 'BOARD',
       icon: <ShieldAlert size={18} />,
       color: 'text-primary'
    });

    return news;
  };

  const newsItems = generateDynamicNews();

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-surface"><ArrowLeft size={20} /></button>
          <h1 className="text-sm font-black uppercase tracking-widest">BN News Portal</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
         <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-xl font-black">Últimas Notícias</h2>
         </div>

         {newsItems.map((news, idx) => (
            <div key={news.id} className="group relative animate-in slide-in-from-bottom duration-500" style={{animationDelay: `${idx * 150}ms`}}>
               <div className="flex flex-col gap-3 p-5 bg-surface rounded-[32px] border border-white/5 shadow-xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                     <div className={clsx("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", news.color)}>
                        {news.icon}
                        {news.category}
                     </div>
                     <span className="text-[10px] text-secondary font-bold">AGORA</span>
                  </div>
                  <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">{news.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed line-clamp-3">{news.body}</p>
                  
                  <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-light border border-white/10 flex items-center justify-center text-[10px]">⚽</div>
                        <span className="text-[10px] font-bold text-secondary">Redação BN Esportes</span>
                     </div>
                     <button className="text-[10px] font-black text-primary uppercase underline">Ler mais</button>
                  </div>
               </div>
            </div>
         ))}

         <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20 flex flex-col items-center text-center gap-3">
            <AlertCircle className="text-primary" size={32} />
            <h4 className="font-black text-sm uppercase">Dica do Editor</h4>
            <p className="text-xs text-secondary italic">"Fique de olho na condição física dos seus atletas. No segundo tempo, o cansaço pode ser fatal."</p>
         </div>
      </main>
    </div>
  );
}
