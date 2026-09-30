create table if not exists public.archive_tabs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.archive_images (
  id uuid primary key default gen_random_uuid(),
  tab_id uuid not null references public.archive_tabs(id) on delete cascade,
  image_url text not null,
  alt_text text,
  created_at timestamptz not null default now()
);

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

alter table public.archive_tabs enable row level security;
alter table public.archive_images enable row level security;
alter table public.confessions enable row level security;
alter table public.fortune_wheels enable row level security;

drop policy if exists "archive_tabs_read" on public.archive_tabs;
drop policy if exists "archive_tabs_write" on public.archive_tabs;
drop policy if exists "archive_images_read" on public.archive_images;
drop policy if exists "archive_images_write" on public.archive_images;
drop policy if exists "confessions_read" on public.confessions;
drop policy if exists "confessions_write" on public.confessions;
drop policy if exists "fortune_wheels_read" on public.fortune_wheels;
drop policy if exists "fortune_wheels_write" on public.fortune_wheels;

create policy "archive_tabs_read" on public.archive_tabs
for select using (true);

create policy "archive_tabs_write" on public.archive_tabs
for insert with check (true);

create policy "archive_images_read" on public.archive_images
for select using (true);

create policy "archive_images_write" on public.archive_images
for insert with check (true);

create policy "confessions_read" on public.confessions
for select using (true);

create policy "confessions_write" on public.confessions
for insert with check (true);

create policy "fortune_wheels_read" on public.fortune_wheels
for select using (true);

create policy "fortune_wheels_write" on public.fortune_wheels
for insert with check (true);
