-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ENUMS
create type plan_type as enum ('free', 'team', 'enterprise');
create type user_role as enum ('owner', 'admin', 'member', 'viewer');
create type gov_status as enum ('passed','flagged','blocked','pending','reviewing');
create type rule_severity as enum ('block','flag','warn','log');

-- ORGANIZATIONS
create table public.organizations (
  id                    uuid primary key default uuid_generate_v4(),
  name                  text not null check (char_length(name) between 1 and 100),
  slug                  text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$'),
  plan                  plan_type not null default 'free',
  api_key               text not null unique default 'av_live_' || encode(gen_random_bytes(24), 'hex'),
  decisions_this_month  integer not null default 0,
  decisions_limit       integer not null default 10000,
  onboarding_complete   boolean not null default false,
  onboarding_step       integer not null default 1 check (onboarding_step between 1 and 3),
  primary_domain        text,
  webhook_url           text,
  slack_webhook_url     text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- PROFILES
create table public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  org_id          uuid references public.organizations on delete cascade,
  full_name       text check (char_length(full_name) <= 100),
  email           text,
  role            user_role not null default 'owner',
  avatar_url      text,
  timezone        text not null default 'UTC',
  onboarding_done boolean not null default false,
  preferences     jsonb not null default '{"email_alerts":true,"weekly_digest":true}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- DECISION EVENTS
create table public.decision_events (
  id                    uuid primary key default uuid_generate_v4(),
  org_id                uuid not null references public.organizations on delete cascade,
  model_name            text not null check (char_length(model_name) <= 100),
  model_version         text,
  model_provider        text,
  input_context         jsonb not null default '{}',
  output_decision       jsonb not null default '{}',
  confidence_score      float check (confidence_score between 0 and 1),
  trust_score           float check (trust_score between 0 and 1),
  trust_grade           char(1) generated always as (
    case
      when trust_score >= 0.9  then 'A'
      when trust_score >= 0.75 then 'B'
      when trust_score >= 0.6  then 'C'
      when trust_score >= 0.4  then 'D'
      else                          'F'
    end
  ) stored,
  causal_factors        jsonb not null default '[]',
  causal_explanation    text,
  counterfactual_summary text,
  governance_status     gov_status not null default 'pending',
  governance_violations jsonb not null default '[]',
  data_sources          jsonb not null default '[]',
  provenance_verified   boolean not null default false,
  domain                text,
  tags                  text[] not null default '{}',
  content_hash          text,
  sdk_version           text,
  latency_ms            integer,
  created_at            timestamptz not null default now()
);

-- GOVERNANCE RULES
create table public.governance_rules (
  id                uuid primary key default uuid_generate_v4(),
  org_id            uuid not null references public.organizations on delete cascade,
  name              text not null check (char_length(name) between 1 and 100),
  description       text,
  rule_logic        jsonb not null default '{}',
  severity          rule_severity not null default 'warn',
  active            boolean not null default true,
  triggered_count   integer not null default 0,
  last_triggered_at timestamptz,
  created_by        uuid references auth.users on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger rules_updated_at
  before update on public.governance_rules
  for each row execute function public.set_updated_at();

-- API KEYS
create table public.api_keys (
  id           uuid primary key default uuid_generate_v4(),
  org_id       uuid not null references public.organizations on delete cascade,
  name         text not null check (char_length(name) between 1 and 80),
  key_hash     text not null,
  key_prefix   text not null,
  scopes       text[] not null default '{trace,read}',
  last_used_at timestamptz,
  expires_at   timestamptz,
  active       boolean not null default true,
  created_by   uuid references auth.users on delete set null,
  created_at   timestamptz not null default now()
);

-- WORLD STATE
create table public.world_state (
  id                 uuid primary key default uuid_generate_v4(),
  org_id             uuid not null references public.organizations on delete cascade,
  entity_type        text not null,
  entity_id          text not null,
  properties         jsonb not null default '{}',
  valid_from         timestamptz not null default now(),
  valid_to           timestamptz,
  source_decision_id uuid references public.decision_events on delete set null,
  updated_by         text,
  unique nulls not distinct (org_id, entity_type, entity_id, valid_from)
);

-- AUDIT LOG
create table public.audit_log (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references public.organizations on delete cascade,
  actor_id      uuid references auth.users on delete set null,
  actor_email   text,
  action        text not null,
  resource_type text,
  resource_id   uuid,
  metadata      jsonb default '{}',
  created_at    timestamptz not null default now()
);

-- INDEXES
create index idx_decisions_org_time   on public.decision_events (org_id, created_at desc);
create index idx_decisions_org_status on public.decision_events (org_id, governance_status);
create index idx_decisions_org_domain on public.decision_events (org_id, domain) where domain is not null;
create index idx_decisions_org_grade  on public.decision_events (org_id, trust_grade) where trust_grade is not null;
create index idx_decisions_org_trust  on public.decision_events (org_id, trust_score desc) where trust_score is not null;
create index idx_decisions_tags       on public.decision_events using gin(tags);
create index idx_rules_org_active     on public.governance_rules (org_id, active);
create index idx_world_current        on public.world_state (org_id, entity_type, entity_id) where valid_to is null;
create index idx_profiles_org         on public.profiles (org_id);
create index idx_audit_org_time       on public.audit_log (org_id, created_at desc);

-- ROW LEVEL SECURITY
alter table public.organizations    enable row level security;
alter table public.profiles         enable row level security;
alter table public.decision_events  enable row level security;
alter table public.governance_rules enable row level security;
alter table public.api_keys         enable row level security;
alter table public.world_state      enable row level security;
alter table public.audit_log        enable row level security;

-- Helper: get caller's org_id
create or replace function public.my_org_id()
returns uuid language sql security definer stable as $$
  select org_id from public.profiles where id = auth.uid() limit 1;
$$;

-- RLS POLICIES
create policy "org_select" on public.organizations for select using (id = public.my_org_id());
create policy "org_update" on public.organizations for update using (id = public.my_org_id()) with check (id = public.my_org_id());
create policy "profile_own" on public.profiles for all using (id = auth.uid());
create policy "profile_org_read" on public.profiles for select using (org_id = public.my_org_id());
create policy "decisions_org" on public.decision_events for all using (org_id = public.my_org_id());
create policy "rules_org" on public.governance_rules for all using (org_id = public.my_org_id());
create policy "keys_org" on public.api_keys for all using (org_id = public.my_org_id());
create policy "world_org" on public.world_state for all using (org_id = public.my_org_id());
create policy "audit_org_read" on public.audit_log for select using (org_id = public.my_org_id());

-- TRIGGER: Auto-create org + profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public, auth
as $$
declare
  v_org_id    uuid;
  v_name      text;
  v_slug      text;
  v_counter   int := 0;
  v_base_slug text;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    split_part(new.email, '@', 1),
    'user'
  );

  v_base_slug := lower(regexp_replace(trim(v_name), '[^a-z0-9]+', '-', 'g'));
  v_base_slug := trim(v_base_slug, '-');
  v_base_slug := left(v_base_slug, 36);
  v_slug := v_base_slug || '-' || left(new.id::text, 6);

  loop
    exit when not exists (select 1 from public.organizations where slug = v_slug);
    v_counter := v_counter + 1;
    v_slug := v_base_slug || '-' || left(new.id::text, 6) || '-' || v_counter;
  end loop;

  insert into public.organizations (name, slug)
  values (v_name || '''s Workspace', v_slug)
  returning id into v_org_id;

  insert into public.profiles (id, org_id, full_name, email, role)
  values (new.id, v_org_id, v_name, new.email, 'owner');

  -- Default governance rules
  insert into public.governance_rules (org_id, name, description, rule_logic, severity)
  values
    (v_org_id, 'Low confidence alert',
     'Flags decisions with model confidence below 60%',
     '{"field":"confidence_score","operator":"lt","value":0.6}'::jsonb,
     'flag'),
    (v_org_id, 'Critical trust block',
     'Blocks decisions with trust score below 30%',
     '{"field":"trust_score","operator":"lt","value":0.3}'::jsonb,
     'block'),
    (v_org_id, 'Sensitive category detection',
     'Flags decisions involving protected categories',
     '{"field":"causal_sensitive","operator":"exists","value":true}'::jsonb,
     'flag'),
    (v_org_id, 'Unverified provenance warning',
     'Warns when input data provenance is unverified',
     '{"field":"provenance_verified","operator":"eq","value":false}'::jsonb,
     'warn'),
    (v_org_id, 'High value commitment flag',
     'Flags decisions tagged as high-value for review',
     '{"field":"tags","operator":"contains","value":"high-value"}'::jsonb,
     'flag');

  return new;
exception when others then
  raise warning 'Failed to create org for user %: %', new.id, sqlerrm;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- FUNCTION: Dashboard stats
create or replace function public.get_dashboard_stats(p_org_id uuid)
returns jsonb language plpgsql security definer
set search_path = public
as $$
declare v_result jsonb;
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and org_id = p_org_id
  ) then raise exception 'Access denied'; end if;

  select jsonb_build_object(
    'decisions_today', (
      select count(*)::int from public.decision_events
      where org_id = p_org_id and created_at >= current_date
    ),
    'decisions_yesterday', (
      select count(*)::int from public.decision_events
      where org_id = p_org_id
        and created_at >= current_date - interval '1 day'
        and created_at < current_date
    ),
    'decisions_this_month', (
      select count(*)::int from public.decision_events
      where org_id = p_org_id
        and created_at >= date_trunc('month', now())
    ),
    'avg_trust_score_7d', (
      select round(avg(trust_score)::numeric, 4)
      from public.decision_events
      where org_id = p_org_id
        and trust_score is not null
        and created_at >= now() - interval '7 days'
    ),
    'avg_trust_score_prev_7d', (
      select round(avg(trust_score)::numeric, 4)
      from public.decision_events
      where org_id = p_org_id
        and trust_score is not null
        and created_at >= now() - interval '14 days'
        and created_at < now() - interval '7 days'
    ),
    'violations_this_week', (
      select count(*)::int from public.decision_events
      where org_id = p_org_id
        and governance_status in ('flagged', 'blocked')
        and created_at >= now() - interval '7 days'
    ),
    'active_rules', (
      select count(*)::int from public.governance_rules
      where org_id = p_org_id and active = true
    )
  ) into v_result;

  return v_result;
end;
$$;

-- FUNCTION: Trust score timeseries
create or replace function public.get_trust_timeseries(
  p_org_id uuid,
  p_days int default 30
)
returns table(bucket timestamptz, avg_trust numeric, count bigint)
language plpgsql security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and org_id = p_org_id
  ) then raise exception 'Access denied'; end if;

  return query
  select
    date_trunc('day', created_at) as bucket,
    round(avg(trust_score)::numeric, 4) as avg_trust,
    count(*) as count
  from public.decision_events
  where
    org_id = p_org_id
    and created_at >= now() - (p_days || ' days')::interval
    and trust_score is not null
  group by 1
  order by 1 asc;
end;
$$;
