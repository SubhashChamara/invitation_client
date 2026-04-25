import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Optional: Provide a highly descriptive error if Env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found in environment variables. RSVP will not work.");
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-key");
