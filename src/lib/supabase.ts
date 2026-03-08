import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

// Detecta a URL de produção automaticamente
export const getProductionUrl = () => {
  if (typeof window === 'undefined') return '';
  
  // Sempre retorna a URL atual (funciona tanto em localhost quanto em produção)
  // O Supabase precisa ter essa URL configurada nas "Redirect URLs" permitidas
  return window.location.origin;
};

// Create a singleton Supabase client to avoid multiple instances
export const supabase = createClient(
  `https://${projectId}.supabase.co`, 
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);