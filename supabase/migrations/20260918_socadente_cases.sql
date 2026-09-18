-- Casos clínicos públicos da Só Cadente. Não guardar dados identificáveis de pacientes.
alter table if exists projects rename to cases;
alter table if exists cases add column if not exists servico text;
alter table if exists cases add column if not exists preco numeric;
alter table if exists cases add column if not exists data date;
alter table if exists cases add column if not exists tipo_apresentacao text not null default 'single' check (tipo_apresentacao in ('before_after','single'));
alter table if exists cases add column if not exists imagem_antes text;
alter table if exists cases add column if not exists imagem_depois text;
alter table if exists cases add column if not exists imagem_unica text;
create table if not exists contact_requests (id uuid primary key default gen_random_uuid(), nome text not null, telefone text not null, tipo text not null, mensagem text, created_at timestamptz default now());
