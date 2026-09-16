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