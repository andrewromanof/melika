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

alter table public.archive_tabs enable row level security;
alter table public.archive_images enable row level security;

create policy if not exists "archive_tabs_read" on public.archive_tabs
for select using (true);

create policy if not exists "archive_tabs_write" on public.archive_tabs
for insert with check (true);

create policy if not exists "archive_images_read" on public.archive_images
for select using (true);

create policy if not exists "archive_images_write" on public.archive_images
for insert with check (true);
