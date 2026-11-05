import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * No tables yet. Replace this with generated types after the schema is confirmed.
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local. See .env.example.`,
    );
  }
  return value;
}

/**
 * Server-only Supabase client. Import this from Server Components, Server
 * Actions, and Route Handlers. The service role key bypasses row level
 * security and must never be sent to the browser.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> {
  return createClient<Database>(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
