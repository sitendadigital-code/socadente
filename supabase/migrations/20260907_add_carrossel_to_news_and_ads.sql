-- Execute this migration in the Supabase SQL Editor before using the
-- "Adicionar ao carrossel" controls in the management panel.
alter table public.news
  add column if not exists carrossel boolean not null default false;

alter table public.ads
  add column if not exists carrossel boolean not null default false;
