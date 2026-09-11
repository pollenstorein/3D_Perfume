import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  email: string;
};

export async function getProfile(userId: string, fallback: Profile): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("id, name, email").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ?? fallback;
}

export async function saveProfile(profile: Profile) {
  const { error } = await supabase.from("profiles").upsert(profile);
  if (error) throw error;
}