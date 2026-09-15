import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mwfcuajifedtzjtmvdbh.supabase.co";
const supabaseAnonKey = "sb_publishable_B22PSzXKU4uhmB8Vyb76NQ_8moZLUyR";

export const PAYMENT_API_BASE_URL = "https://threed-perfume-server.onrender.com";
export const PAYMENT_CAPTURE_URL = `${PAYMENT_API_BASE_URL}/server_capture_payment`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  if (!userId) throw new Error("You must be signed in before placing an order.");

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  if (!session?.user || session.user.id !== userId) {
    throw new Error("Your session has expired. Please log in again to place your order.");
  }

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

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, tracking_id, status, total_amount, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}