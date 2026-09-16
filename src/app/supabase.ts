import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mwfcuajifedtzjtmvdbh.supabase.co";
const supabaseAnonKey = "sb_publishable_B22PSzXKU4uhmB8Vyb76NQ_8moZLUyR";

export const PAYMENT_API_BASE_URL = "https://threed-perfume-server.onrender.com";
export const PAYMENT_ORDER_URL = `${PAYMENT_API_BASE_URL}/server_create_order`;
export const PAYMENT_CAPTURE_URL = `${PAYMENT_API_BASE_URL}/server_capture_payment`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createPaymentOrder(amount: number, receipt: string) {
  const response = await fetch(PAYMENT_ORDER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, receipt }),
  });
  const result = await response.json() as { success?: boolean; data?: { id: string; amount: number; currency: string }; error?: string };
  if (!response.ok || !result.success || !result.data) throw new Error(result.error ?? "Unable to start payment.");
  return result.data;
}

export async function capturePayment(paymentId: string, amount: number) {
  const response = await fetch(PAYMENT_CAPTURE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentId, amount: Math.round(amount * 100) }),
  });
  const result = await response.json() as { success?: boolean; data?: { status?: string }; error?: string };
  if (!response.ok || !result.success) throw new Error(result.error ?? "Unable to capture payment.");
  return result;
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

export async function markOrderPaid(userId: string, orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId)
    .eq("user_id", userId)
    .select("id, tracking_id, status, total_amount, created_at")
    .single();

  if (error) throw error;
  return data;
}