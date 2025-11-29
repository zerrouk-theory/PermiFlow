import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environnement incomplet. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

let browserClient: SupabaseClient | null = null;

export const getBrowserSupabase = () => {
  if (browserClient) return browserClient;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase non initialisé côté client");
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true },
  });

  return browserClient;
};

export const getServerSupabase = () => {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL manquant");
  }

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey ?? "";

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
