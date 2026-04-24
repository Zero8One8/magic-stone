-- История версий site_content
create table if not exists public.site_content_history (
  id uuid primary key default gen_random_uuid(),
  content_key text not null,
  content jsonb not null,
  saved_at timestamptz not null default now(),
  saved_by text
);

create index if not exists idx_site_content_history_key_saved
  on public.site_content_history (content_key, saved_at desc);

alter table public.site_content_history enable row level security;

drop policy if exists "Service role can manage site content history" on public.site_content_history;
create policy "Service role can manage site content history"
  on public.site_content_history
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Черновик (draft) для site_content
alter table public.site_content
  add column if not exists draft_content jsonb,
  add column if not exists draft_updated_at timestamptz,
  add column if not exists draft_updated_by text;
