
import React from 'react';
import { Team } from '../types';
import { ArrowLeft, Wallet, TrendingUp, Building, Users, Home, ArrowUpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  team: Team;
  funds: number;
  ticketPrice: number;
  onUpdateTicketPrice: (price: number) => void;
  onBack: () => void;
  onLoan: (amount: number) => void;
  onExpandStadium: (cost: number, gain: number) => void;
}

export default function FinanceScreen({ team, funds, ticketPrice, onUpdateTicketPrice, onBack, onLoan, onExpandStadium }: Props) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const stadiumUpgradeCost = team.stadiumCapacity * 20; // R$ 20 por lugar novo
  const stadiumUpgradeGain = 5000;

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">Patrimônio</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 space-y-6 overflow-y-auto pb-safe no-scrollbar">
         {/* Balance Card */}
         <div className="bg-gradient-to-br from-surface to-background border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Wallet size={100} />
            </div>
            <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Saldo em Conta</p>
            <h2 className={`text-4xl font-black ${funds >= 0 ? 'text-white' : 'text-red-500'}`}>{formatMoney(funds)}</h2>
         </div>

         {/* Stadium Info */}
         <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Home size={18} className="text-amber-500" />
                  <h3 className="text-sm font-bold uppercase">Meu Estádio</h3>
               </div>
               <span className="text-sm font-black text-white">{team.stadiumCapacity.toLocaleString()} lugares</span>
            </div>
            
            <button 
               onClick={() => onExpandStadium(stadiumUpgradeCost, stadiumUpgradeGain)}
               className="w-full bg-amber-500 hover:bg-amber-600 text-background font-black py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
               <ArrowUpCircle size={18} />
               EXPANDIR (+5.000 Lugares) - {formatMoney(stadiumUpgradeCost)}
            </button>
         </div>

         {/* Ticket Price Control */}
         <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <h3 className="text-sm font-bold uppercase">Preço do Ingresso</h3>
               </div>
               <span className="text-xl font-black text-primary">{formatMoney(ticketPrice)}</span>
            </div>
            
            <input 
               type="range" min="10" max="200" step="5"
               value={ticketPrice}
               onChange={(e) => onUpdateTicketPrice(parseInt(e.target.value))}
               className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
            />
            
            <p className="text-[10px] text-center text-secondary leading-relaxed">
               Lembre-se: Preços altos espantam o público. O estádio cheio melhora o moral do time!
            </p>
         </div>

         {/* Actions */}
         <div className="space-y-3">
             <button 
               onClick={() => onLoan(500000)}
               className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5 active:scale-[0.98] transition-all"
             >
                <div className="flex items-center gap-3">
                   <div className="bg-primary/20 p-2 rounded-lg text-primary"><Building size={20} /></div>
                   <span className="font-bold text-sm">Empréstimo Bancário</span>
                </div>
                <div className="bg-primary px-3 py-1 rounded text-xs font-bold text-white">+ 500k</div>
             </button>
         </div>
      </main>
    </div>
  );
}
