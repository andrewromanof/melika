create table if not exists public.confessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.fortune_wheels (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Wheel of Fate',
  options jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.confessions enable row level security;
alter table public.fortune_wheels enable row level security;

drop policy if exists "confessions_read" on public.confessions;
drop policy if exists "confessions_write" on public.confessions;
drop policy if exists "fortune_wheels_read" on public.fortune_wheels;
drop policy if exists "fortune_wheels_write" on public.fortune_wheels;

create policy "confessions_read" on public.confessions
for select using (true);

create policy "confessions_write" on public.confessions
for insert with check (true);

create policy "fortune_wheels_read" on public.fortune_wheels
for select using (true);

create policy "fortune_wheels_write" on public.fortune_wheels
for insert with check (true);

notify pgrst, 'reload schema';
