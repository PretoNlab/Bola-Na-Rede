import { createClient } from '@supabase/supabase-js';

// NOTA: O URL deve começar com https:// para evitar erros de inicialização (Invalid supabaseUrl).
// Substitua estas chaves pelas do seu projeto Supabase para habilitar o save na nuvem.

const SUPABASE_URL = 'https://placeholder-project.supabase.co'; 
const SUPABASE_ANON_KEY = 'placeholder-key';

// Cria o cliente com valores placeholder seguros para não quebrar o app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
    // Retorna false se as chaves ainda forem os placeholders
    return SUPABASE_URL !== 'https://placeholder-project.supabase.co';
};