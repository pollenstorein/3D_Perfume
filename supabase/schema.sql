create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  tracking_id text unique not null,
  status text default 'pending',
  total_amount numeric(10, 2),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can create own profile" on public.profiles;
drop policy if exists "Users can view own orders" on public.orders;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can create own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);