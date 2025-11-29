-- Users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  balance numeric default 0,
  kyc_level text default 'light',
  created_at timestamptz default now()
);

-- Towns table
create table if not exists public.towns (
  id bigserial primary key,
  iris_code text unique not null,
  name text not null,
  region text default 'N/A',
  permits integer default 0,
  score integer default 0,
  updated_at timestamptz default now()
);

-- Bets table
create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  town_id bigint references public.towns(id) on delete cascade,
  direction text check (direction in ('UP', 'DOWN')),
  amount numeric not null,
  odds numeric default 1.9,
  expiry date not null,
  settled boolean default false,
  created_at timestamptz default now()
);

-- Payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  stripe_session_id text,
  amount numeric not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create or replace function public.increment_balance(p_user_id uuid, p_amount numeric)
returns void
language plpgsql
security definer
as $$
begin
  update public.users
  set balance = coalesce(balance, 0) + p_amount
  where id = p_user_id;
end;
$$;

alter table public.users enable row level security;
alter table public.bets enable row level security;
alter table public.towns enable row level security;

create policy "Users can view their profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can view towns" on public.towns
  for select using (true);

create policy "Users insert bets" on public.bets
  for insert with check (auth.uid() = user_id);

create policy "Users view their bets" on public.bets
  for select using (auth.uid() = user_id);
