import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mwfcuajifedtzjtmvdbh.supabase.co";
const supabaseAnonKey = "sb_publishable_B22PSzXKU4uhmB8Vyb76NQ_8moZLUyR";

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
  const { error } = await supabase.from("profiles").upsert(profile, { onConflict: "id" });
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

export async function createOrder(userId: string, totalAmount: number) {
  const trackingId = `KP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { data, error } = await supabase.from("orders").insert({
    user_id: userId,
    tracking_id: trackingId,
    status: "pending",
    total_amount: totalAmount,
  }).select("id, tracking_id, status, total_amount, created_at").single();
  if (error) throw error;
  return data;
}