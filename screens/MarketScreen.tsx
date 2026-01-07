import React, { useState } from 'react';
import { Team, Player } from '../types';
import { ArrowLeft, DollarSign, Search, Filter, Briefcase, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Props {
  userTeam: Team;
  allTeams: Team[];
  funds: number;
  onBack: () => void;
  onBuy: (player: Player, fromTeamId: string, cost: number) => void;
  onSell: (player: Player, value: number) => void;
}

const POS_COLORS = {
  'GOL': 'text-yellow-500 bg-yellow-500/10',
  'ZAG': 'text-blue-500 bg-blue-500/10',
  'LAT': 'text-blue-400 bg-blue-400/10',
  'VOL': 'text-green-500 bg-green-500/10',
  'MEI': 'text-green-400 bg-green-400/10',
  'ATA': 'text-red-500 bg-red-500/10',
};

export default function MarketScreen({ userTeam, allTeams, funds, onBack, onBuy, onSell }: Props) {
  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY');
  const [filterPos, setFilterPos] = useState<string>('ALL');

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // Aggregated list of all players NOT in user team (for buying)
  const marketPlayers = React.useMemo(() => {
    const list: { player: Player, teamId: string, teamName: string }[] = [];
    allTeams.forEach(t => {
      if (t.id !== userTeam.id) {
        t.roster.forEach(p => {
          list.push({ player: p, teamId: t.id, teamName: t.name });
        });
      }
    });
    // Sort by Overall Descending
    return list.sort((a, b) => b.player.overall - a.player.overall).slice(0, 50); // Show top 50 to optimize
  }, [allTeams, userTeam.id]);

  const filteredMarket = marketPlayers.filter(item => filterPos === 'ALL' || item.player.position === filterPos);
  
  // My players for selling
  const myPlayers = userTeam.roster.filter(item => filterPos === 'ALL' || item.position === filterPos);

  const handleBuyClick = (player: Player, teamId: string) => {
    if (funds >= player.marketValue) {
      // Small confirm dialog simulation (could be a real modal)
      if(window.confirm(`Contratar ${player.name} por ${formatMoney(player.marketValue)}?`)) {
        onBuy(player, teamId, player.marketValue);
      }
    } else {
      toast.error("Fundos insuficientes!");
    }
  };

  const handleSellClick = (player: Player) => {
     const sellValue = Math.round(player.marketValue * 0.8); // Sell for 80% of value
     if(window.confirm(`Vender ${player.name} por ${formatMoney(sellValue)}?`)) {
        onSell(player, sellValue);
     }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div className="flex flex-col items-center">
             <h1 className="text-sm font-bold uppercase tracking-wider">Mercado da Bola</h1>
             <span className="text-xs text-secondary font-medium">Temporada 2026</span>
          </div>
          <div className="flex items-center gap-1 bg-surface px-3 py-1.5 rounded-full border border-emerald-500/20">
             <DollarSign size={14} className="text-emerald-500" />
             <span className="text-xs font-bold text-emerald-400">{new Intl.NumberFormat('pt-BR', { notation: "compact", compactDisplay: "short" }).format(funds)}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-4 gap-4">
        <button 
          onClick={() => setActiveTab('BUY')}
          className={clsx(
            "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
            activeTab === 'BUY' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface text-secondary hover:text-white"
          )}
        >
          <ShoppingCart size={16} />
          Comprar
        </button>
        <button 
           onClick={() => setActiveTab('SELL')}
           className={clsx(
            "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
            activeTab === 'SELL' ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "bg-surface text-secondary hover:text-white"
          )}
        >
          <Briefcase size={16} />
          Vender
        </button>
      </div>

      {/* Pos Filter */}
      <div className="px-4 pb-4 overflow-x-auto no-scrollbar flex gap-2">
        {['ALL', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'].map(pos => (
           <button 
             key={pos}
             onClick={() => setFilterPos(pos)}
             className={clsx(
               "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors",
               filterPos === pos ? "bg-white text-background border-white" : "bg-transparent text-secondary border-white/10"
             )}
           >
             {pos === 'ALL' ? 'Todos' : pos}
           </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 no-scrollbar">
         {activeTab === 'BUY' ? (
            <>
               <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Destaques Disponíveis</div>
               {filteredMarket.map((item) => (
                  <div key={item.player.id} className="flex items-center justify-between bg-surface p-3 rounded-xl border border-white/5">
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className={clsx("w-9 h-9 flex items-center justify-center rounded-lg text-[10px] font-black", POS_COLORS[item.player.position])}>
                           {item.player.position}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                           <span className="text-sm font-bold truncate">{item.player.name}</span>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] text-secondary">{item.teamName}</span>
                              <div className="flex items-center gap-0.5 bg-background px-1.5 rounded text-[10px] font-bold">
                                 <span className="text-primary">{item.player.overall}</span> <span className="text-secondary/50">OVR</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => handleBuyClick(item.player, item.teamId)}
                        disabled={funds < item.player.marketValue}
                        className={clsx(
                           "flex flex-col items-end min-w-[80px] px-3 py-1.5 rounded-lg transition-all active:scale-95",
                           funds >= item.player.marketValue ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white" : "bg-white/5 text-gray-500 cursor-not-allowed"
                        )}
                     >
                        <span className="text-[10px] font-bold uppercase">Comprar</span>
                        <span className="text-xs font-black">{formatMoney(item.player.marketValue)}</span>
                     </button>
                  </div>
               ))}
            </>
         ) : (
            <>
               <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Meu Elenco (Venda Rápida)</div>
               {myPlayers.map((player) => {
                  const sellValue = Math.round(player.marketValue * 0.8);
                  return (
                     <div key={player.id} className="flex items-center justify-between bg-surface p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className={clsx("w-9 h-9 flex items-center justify-center rounded-lg text-[10px] font-black", POS_COLORS[player.position])}>
                              {player.position}
                           </div>
                           <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-bold truncate">{player.name}</span>
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] text-secondary">{player.age} anos</span>
                                 <div className="flex items-center gap-0.5 bg-background px-1.5 rounded text-[10px] font-bold">
                                    <span className="text-primary">{player.overall}</span> <span className="text-secondary/50">OVR</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <button 
                           onClick={() => handleSellClick(player)}
                           className="flex flex-col items-end min-w-[80px] px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                        >
                           <span className="text-[10px] font-bold uppercase">Vender</span>
                           <span className="text-xs font-black">{formatMoney(sellValue)}</span>
                        </button>
                     </div>
                  );
               })}
            </>
         )}
      </div>
    </div>
  );
}