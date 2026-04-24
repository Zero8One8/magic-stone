create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  content jsonb not null default '{}'::jsonb,
  description text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.site_content enable row level security;

create or replace function public.touch_site_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row
execute function public.touch_site_content_updated_at();

drop policy if exists "Public can read active site content" on public.site_content;
create policy "Public can read active site content"
on public.site_content
for select
using (is_active = true);

drop policy if exists "Service role can manage site content" on public.site_content;
create policy "Service role can manage site content"
on public.site_content
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');