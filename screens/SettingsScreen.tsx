
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Save, Database, Cloud, LogIn, LogOut, Check, Download, Info, Activity, ExternalLink, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from '../supabaseClient';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Props {
  onBack: () => void;
  onSave: () => void;
  onReset: () => void;
  onLoadCloud: () => void;
  session: any;
}

export default function SettingsScreen({ onBack, onSave, onReset, session, onLoadCloud }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ checked: boolean; ok: boolean; msg: string }>({ checked: false, ok: false, msg: '' });

  useEffect(() => {
    checkDB();
  }, []);

  const checkDB = async () => {
    const res = await testSupabaseConnection();
    setDbStatus({ checked: true, ok: res.success, msg: res.message });
  };

  const handleReset = () => {
     if (window.confirm("Atenção: Todo o seu progresso será apagado. Esta ação é irreversível.")) {
        onReset();
     }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">Ajustes</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 space-y-6 overflow-y-auto pb-safe no-scrollbar">
         
         <div className={clsx(
            "p-3 rounded-xl border flex items-center gap-3 transition-all",
            dbStatus.checked ? (dbStatus.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500") : "bg-surface border-white/5"
         )}>
            <Activity size={18} className={!dbStatus.checked ? "animate-pulse" : ""} />
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase">Sincronização Cloud</span>
               <span className="text-[9px] font-bold opacity-80">{dbStatus.checked ? dbStatus.msg : "Verificando..."}</span>
            </div>
         </div>

         {/* Sessão Legal e Suporte - EXIGIDO PELO GOOGLE */}
         <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Legal e Suporte</h2>
            <div className="bg-surface rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
               <button className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                  <div className="flex items-center gap-3 text-secondary">
                     <ShieldCheck size={20} />
                     <span className="text-sm font-bold">Política de Privacidade</span>
                  </div>
                  <ExternalLink size={14} className="text-secondary opacity-40" />
               </button>
               <button className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                  <div className="flex items-center gap-3 text-secondary">
                     <Info size={20} />
                     <span className="text-sm font-bold">Termos de Uso</span>
                  </div>
                  <ExternalLink size={14} className="text-secondary opacity-40" />
               </button>
            </div>
         </section>

         <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Gestão de Dados</h2>
            <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
               <button 
                  onClick={() => { onSave(); toast.success("Progresso salvo localmente!"); }}
                  className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors active:bg-white/10"
               >
                  <div className="flex items-center gap-3">
                     <Save size={20} className="text-emerald-500" />
                     <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-emerald-500">Salvar Progresso Agora</span>
                        <span className="text-[10px] text-secondary">Backup local imediato</span>
                     </div>
                  </div>
               </button>
            </div>
         </section>

         <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-500 px-1">Zona de Perigo</h2>
            <button 
               onClick={handleReset}
               className="w-full flex items-center justify-between p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 active:scale-[0.98] transition-all"
            >
               <div className="flex items-center gap-3">
                  <Trash2 size={20} className="text-rose-500" />
                  <span className="text-sm font-bold text-rose-500 uppercase">Apagar Carreira</span>
               </div>
            </button>
         </section>

         <div className="py-6 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-widest">Bolanarede Manager v2.0.0-PRO</p>
            <p className="text-[8px] font-bold">Desenvolvido para Android 14+</p>
         </div>
      </main>
    </div>
  );
}
