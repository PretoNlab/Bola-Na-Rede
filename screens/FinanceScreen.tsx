
import React from 'react';
import { Team } from '../types';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, Building, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  team: Team;
  funds: number;
  ticketPrice: number;
  onUpdateTicketPrice: (price: number) => void;
  onBack: () => void;
  onLoan: (amount: number) => void;
}

export default function FinanceScreen({ team, funds, ticketPrice, onUpdateTicketPrice, onBack, onLoan }: Props) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const totalValue = team.roster.reduce((acc, p) => acc + p.marketValue, 0);
  const wageBill = (team.roster.length * 1500); 
  
  const handleRequestLoan = () => {
     if (funds > 1000000) {
        toast.error("O banco recusou o empréstimo (Saldo alto).");
        return;
     }
     const loanAmount = 500000;
     onLoan(loanAmount);
     toast.success(`Empréstimo de ${formatMoney(loanAmount)} aprovado!`, { icon: '💰' });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">Finanças</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 space-y-6 overflow-y-auto pb-safe no-scrollbar">
         {/* Balance Card */}
         <div className="bg-gradient-to-br from-surface to-background border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Wallet size={100} />
            </div>
            <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Saldo Atual</p>
            <h2 className={`text-4xl font-black ${funds >= 0 ? 'text-white' : 'text-red-500'}`}>{formatMoney(funds)}</h2>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] text-secondary font-bold uppercase">Valor do Elenco</span>
                  <span className="text-emerald-400 font-bold">{formatMoney(totalValue)}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-secondary font-bold uppercase">Gasto com Salários</span>
                  <span className="text-rose-400 font-bold">{formatMoney(wageBill)} / jogo</span>
               </div>
            </div>
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
               type="range" 
               min="10" 
               max="200" 
               step="5"
               value={ticketPrice}
               onChange={(e) => onUpdateTicketPrice(parseInt(e.target.value))}
               className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
            />
            
            <div className="flex justify-between text-[10px] font-bold text-secondary uppercase tracking-widest">
               <span>Público Alto / Renda Baixa</span>
               <span>Renda Alta / Público Baixo</span>
            </div>
            
            <p className="text-[10px] text-center text-secondary leading-relaxed pt-2">
               Dica: O público diminui conforme o preço sobe. Encontre o equilíbrio para maximizar sua receita.
            </p>
         </div>

         {/* Actions */}
         <div className="space-y-3">
             <h3 className="text-xs font-bold text-secondary uppercase tracking-widest px-1">Operações Bancárias</h3>
             
             <button 
               onClick={handleRequestLoan}
               className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5 active:scale-[0.98] transition-all hover:bg-surface/80"
             >
                <div className="flex items-center gap-3">
                   <div className="bg-primary/20 p-2 rounded-lg text-primary">
                      <Building size={20} />
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="font-bold text-sm">Solicitar Empréstimo</span>
                      <span className="text-[10px] text-secondary">Apenas para emergências</span>
                   </div>
                </div>
                <div className="bg-primary px-3 py-1 rounded text-xs font-bold text-white">+ 500k</div>
             </button>
         </div>
      </main>
    </div>
  );
}
