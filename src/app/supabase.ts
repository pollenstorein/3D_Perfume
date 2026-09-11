import { createClient } from "@supabase/supabase-js";

const viteEnv: Record<string, string | undefined> = {};
const supabaseUrl = viteEnv.VITE_SUPABASE_URL ?? "https://mwfcuajifedtzjtmvdbh.supabase.co";
const supabaseAnonKey = viteEnv.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_B22PSzXKU4uhmB8Vyb76NQ_8moZLUyR";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
};

export async function getProfile(userId: string, fallback: Profile): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("id, email").eq("id", userId).maybeSingle();
  if (error) throw error;
  if (data) return data;
  await saveProfile(fallback);
  return fallback;
}

export async function saveProfile(profile: Profile) {
  const { error } = await supabase.from("profiles").upsert(profile);
  if (error) throw error;
}

export type Order = {
  id: string;
  tracking_id: string;
  status: string;
  total_amount: number | null;
  created_at: string;
};

export async function getOrderByTrackingId(userId: string, trackingId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, tracking_id, status, total_amount, created_at")
    .eq("user_id", userId)
    .eq("tracking_id", trackingId)
    .maybeSingle();
  if (error) throw error;
  return data;
}