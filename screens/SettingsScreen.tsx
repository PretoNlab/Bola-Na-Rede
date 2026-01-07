import React, { useState } from 'react';
import { ArrowLeft, Trash2, Volume2, Info, Save, Database, Cloud, LogIn, LogOut, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import toast from 'react-hot-toast';

interface Props {
  onBack: () => void;
  onSave: () => void;
  onReset: () => void;
  session: any;
}

export default function SettingsScreen({ onBack, onSave, onReset, session }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleReset = () => {
     if (window.confirm("Tem certeza? Todo o seu progresso será perdido permanentemente.")) {
        onReset();
     }
  };

  const handleLogin = async () => {
     if (!isSupabaseConfigured()) {
        toast.error("Configure as chaves do Supabase no código primeiro.");
        return;
     }
     setLoading(true);
     const { error } = await supabase.auth.signInWithPassword({ email, password });
     if (error) {
        toast.error(error.message);
     } else {
        toast.success("Login realizado com sucesso!");
        setShowLogin(false);
     }
     setLoading(false);
  };

  const handleSignUp = async () => {
     if (!isSupabaseConfigured()) {
        toast.error("Configure as chaves do Supabase no código primeiro.");
        return;
     }
     setLoading(true);
     const { error } = await supabase.auth.signUp({ email, password });
     if (error) {
        toast.error(error.message);
     } else {
        toast.success("Conta criada! Verifique seu email se necessário.");
     }
     setLoading(false);
  };

  const handleLogout = async () => {
     await supabase.auth.signOut();
     toast.success("Desconectado.");
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

      <main className="p-4 space-y-6 overflow-y-auto pb-safe">
         
         {/* Cloud Sync Section */}
         <section className="space-y-3">
             <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Bolanarede ID (Nuvem)</h2>
             
             {!session ? (
                 <div className="bg-surface rounded-xl border border-white/5 overflow-hidden p-4">
                    {!showLogin ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Cloud size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Sincronizar Progresso</h3>
                                    <p className="text-[10px] text-secondary">Jogue em qualquer dispositivo sem perder nada.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowLogin(true)}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm transition-all active:scale-[0.98]"
                            >
                                Entrar ou Criar Conta
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 animate-fade-in">
                            <h3 className="font-bold text-sm mb-1">Acessar Conta</h3>
                            <input 
                                type="email" 
                                placeholder="Seu Email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none transition-colors"
                            />
                            <input 
                                type="password" 
                                placeholder="Sua Senha" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none transition-colors"
                            />
                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-primary text-white font-bold rounded-lg text-sm disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Entrar'}
                                </button>
                                <button 
                                    onClick={handleSignUp}
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-surface border border-white/10 text-white font-bold rounded-lg text-sm hover:bg-white/5"
                                >
                                    Criar Conta
                                </button>
                            </div>
                            <button onClick={() => setShowLogin(false)} className="text-xs text-secondary text-center mt-2 underline">Cancelar</button>
                        </div>
                    )}
                 </div>
             ) : (
                 <div className="bg-surface rounded-xl border border-white/5 overflow-hidden p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Check size={24} className="text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-emerald-400">Conectado</h3>
                                <p className="text-[10px] text-secondary truncate max-w-[150px]">{session.user.email}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <LogOut size={16} className="text-rose-400" />
                        </button>
                    </div>
                    <div className="bg-background/50 p-2 rounded text-[10px] text-secondary text-center">
                        Seu jogo está sendo salvo na nuvem automaticamente.
                    </div>
                 </div>
             )}
         </section>

         <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Dados Locais</h2>
            <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
               <button 
                  onClick={onSave}
                  className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors active:bg-white/10"
               >
                  <div className="flex items-center gap-3">
                     <Save size={20} className="text-emerald-500" />
                     <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-emerald-500">Forçar Save {session ? '(Nuvem + Local)' : '(Local)'}</span>
                        <span className="text-[10px] text-secondary">Última atualização: Automática</span>
                     </div>
                  </div>
               </button>

               <div className="flex items-start gap-3 p-4 bg-background/50">
                  <Database size={20} className="text-secondary shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-white mb-1">Backup</span>
                     <p className="text-[10px] text-secondary leading-relaxed">
                        O jogo prioriza o save local para performance, mas sincroniza com a nuvem quando possível se você estiver logado.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-secondary px-1">Zona de Perigo</h2>
            <button 
               onClick={handleReset}
               className="w-full flex items-center justify-between p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 active:scale-[0.98] transition-all"
            >
               <div className="flex items-center gap-3">
                  <Trash2 size={20} className="text-rose-500" />
                  <span className="text-sm font-bold text-rose-500">Apagar Save e Reiniciar</span>
               </div>
            </button>
         </section>
      </main>
    </div>
  );
}