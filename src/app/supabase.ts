import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kgstnsxkxytsjwiwwgms.supabase.co";
const supabaseAnonKey = "sb_publishable_qVrBXNWfyxd37tbbpCfzzA_rSNH8XZ6";

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
  customer_name: string | null;
  delivery_phone: string | null;
  delivery_address: string | null;
  status: string;
  total_amount: number | null;
  created_at: string;
};

export type SavedAddress = {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  post_office: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
};

const ORDER_COLUMNS =
  "id, tracking_id, customer_name, delivery_phone, delivery_address, status, total_amount, created_at";

export async function getOrderByTrackingId(userId: string, trackingId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("user_id", userId)
    .eq("tracking_id", trackingId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createOrder(
  userId: string,
  totalAmount: number,
  customerName: string,
  address: SavedAddress,
) {
  if (!userId) throw new Error("You must be signed in before placing an order.");

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  if (!session?.user || session.user.id !== userId) {
    throw new Error("Your session has expired. Please log in again to place your order.");
  }

  const trackingId = `KP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const deliveryAddress = [
    address.address_line1,
    address.post_office,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
  const { data, error } = await supabase.from("orders").insert({
    user_id: userId,
    customer_name: customerName.trim() || null,
    address_id: address.id,
    delivery_phone: address.phone,
    delivery_address: deliveryAddress,
    tracking_id: trackingId,
    status: "pending",
    total_amount: totalAmount,
  }).select(ORDER_COLUMNS).single();
  if (error) throw error;
  return data;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
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
    .select(ORDER_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

export async function getSavedAddresses(userId: string): Promise<SavedAddress[]> {
  const { data, error } = await supabase
    .from("user_addresses")
    .select("id, label, full_name, phone, address_line1, post_office, city, state, postal_code, country, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createSavedAddress(
  userId: string,
  address: Omit<SavedAddress, "id" | "created_at">,
): Promise<SavedAddress> {
  const { data, error } = await supabase
    .from("user_addresses")
    .insert({ user_id: userId, ...address })
    .select("id, label, full_name, phone, address_line1, post_office, city, state, postal_code, country, created_at")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOrder(userId: string, orderId: string) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", orderId)
    .eq("user_id", userId);

  if (error) throw error;
}
