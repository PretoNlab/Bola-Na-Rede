import React from 'react';
import { Team } from '../types';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, Building } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  team: Team;
  funds: number;
  onBack: () => void;
  onLoan: (amount: number) => void;
}

export default function FinanceScreen({ team, funds, onBack, onLoan }: Props) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const totalValue = team.roster.reduce((acc, p) => acc + p.marketValue, 0);
  const wageBill = Math.round(totalValue * 0.005); // Estimated wage per match
  
  const handleRequestLoan = () => {
     if (funds > 5000000) {
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

      <main className="p-4 space-y-6 overflow-y-auto pb-safe">
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
                  <span className="text-[10px] text-secondary font-bold uppercase">Folha Salarial</span>
                  <span className="text-rose-400 font-bold">{formatMoney(wageBill)} / jogo</span>
               </div>
            </div>
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
                      <span className="text-[10px] text-secondary">Taxa de juros: 5% p.r.</span>
                   </div>
                </div>
                <div className="bg-primary px-3 py-1 rounded text-xs font-bold text-white">+ 500k</div>
             </button>

             <button className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5 opacity-75 cursor-not-allowed">
                <div className="flex items-center gap-3">
                   <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">
                      <DollarSign size={20} />
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="font-bold text-sm">Preço dos Ingressos</span>
                      <span className="text-[10px] text-secondary">Auto: R$ 50,00</span>
                   </div>
                </div>
             </button>
         </div>

         {/* Transactions Mock */}
         <div className="space-y-3">
             <h3 className="text-xs font-bold text-secondary uppercase tracking-widest px-1">Últimas Movimentações</h3>
             <div className="bg-surface rounded-xl border border-white/5 divide-y divide-white/5">
                <div className="flex items-center justify-between p-3">
                   <div className="flex items-center gap-2">
                      <div className="bg-rose-500/10 p-1.5 rounded text-rose-500"><TrendingDown size={14} /></div>
                      <span className="text-xs font-medium">Salários (Elenco)</span>
                   </div>
                   <span className="text-xs font-bold text-rose-400">-{formatMoney(wageBill)}</span>
                </div>
                <div className="flex items-center justify-between p-3">
                   <div className="flex items-center gap-2">
                      <div className="bg-emerald-500/10 p-1.5 rounded text-emerald-500"><TrendingUp size={14} /></div>
                      <span className="text-xs font-medium">Bilheteria</span>
                   </div>
                   <span className="text-xs font-bold text-emerald-400">+{formatMoney(Math.floor(Math.random() * 50000) + 20000)}</span>
                </div>
                <div className="flex items-center justify-between p-3">
                   <div className="flex items-center gap-2">
                      <div className="bg-emerald-500/10 p-1.5 rounded text-emerald-500"><TrendingUp size={14} /></div>
                      <span className="text-xs font-medium">Patrocínio Master</span>
                   </div>
                   <span className="text-xs font-bold text-emerald-400">+{formatMoney(15000)}</span>
                </div>
             </div>
         </div>
      </main>
    </div>
  );
}