import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://mwfcuajifedtzjtmvdbh.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_B22PSzXKU4uhmB8Vyb76NQ_8moZLUyR";

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