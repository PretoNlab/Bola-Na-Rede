
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zbsoogdgzxvtqdlibupx.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpic29vZ2Rnenh2dHFkbGlidXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTU5MTgsImV4cCI6MjA4MzM5MTkxOH0.FLAil8l6csN2x0rkLg8f3su11oKkciFsW1GdYnHzu7E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
    return SUPABASE_URL.includes('supabase.co') && SUPABASE_ANON_KEY.length > 50;
};

export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('saves').select('id').limit(1);
        if (error) return { success: false, message: error.message };
        return { success: true, message: "Conexão com Banco de Dados OK!" };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function saveToCloud(userId: string, gameState: any) {
  if (!isSupabaseConfigured()) return;
  
  const payload = { 
    id: userId, 
    game_state: gameState,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('saves')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error("Falha na sincronização cloud:", error.message);
    throw error;
  }
}

export async function loadFromCloud(userId: string) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('saves')
    .select('game_state')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao baixar da nuvem:", error.message);
    throw error;
  }

  return data?.game_state || null;
}
