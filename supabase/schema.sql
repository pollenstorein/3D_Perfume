create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  customer_name text,
  tracking_id text unique not null,
  status text default 'pending',
  total_amount numeric(10, 2),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.orders
  add column if not exists customer_name text;

create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  label text not null default 'Address',
  full_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.orders add column if not exists address_id uuid references public.user_addresses(id) on delete set null;
alter table public.orders add column if not exists delivery_phone text;
alter table public.orders add column if not exists delivery_address text;

-- Repair an existing orders table after removing the profiles table.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.orders'::regclass
      and conname = 'orders_user_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end;
$$;

alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own orders" on public.orders;

create policy "Users can update own orders"
  on public.orders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own pending orders" on public.orders;

create policy "Users can delete own pending orders"
  on public.orders for delete
  using (auth.uid() = user_id and status = 'pending');

alter table public.user_addresses enable row level security;

drop policy if exists "Users can view own addresses" on public.user_addresses;
create policy "Users can view own addresses"
  on public.user_addresses for select using (auth.uid() = user_id);

drop policy if exists "Users can create own addresses" on public.user_addresses;
create policy "Users can create own addresses"
  on public.user_addresses for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own addresses" on public.user_addresses;
create policy "Users can update own addresses"
  on public.user_addresses for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own addresses" on public.user_addresses;
create policy "Users can delete own addresses"
  on public.user_addresses for delete using (auth.uid() = user_id);