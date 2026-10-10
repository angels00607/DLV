-- Phase 0 only: database preparation. No application code uses these tables yet.
-- Run in the Supabase SQL editor of a dedicated project after reviewing the plan.
create table if not exists public.dlv_collection_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 1 check (revision > 0),
  schema_version integer not null default 1 check (schema_version = 1),
  collection jsonb not null check (jsonb_typeof(collection) = 'object'),
  manual_totals jsonb not null default '{}'::jsonb check (jsonb_typeof(manual_totals) = 'object'),
  owned_only boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.dlv_collection_snapshots enable row level security;
revoke all on public.dlv_collection_snapshots from anon;
-- Clients can read their own snapshot; writes must go through the CAS RPC only.
grant select on public.dlv_collection_snapshots to authenticated;

drop policy if exists "read own dlv snapshot" on public.dlv_collection_snapshots;
create policy "read own dlv snapshot" on public.dlv_collection_snapshots
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "insert own dlv snapshot" on public.dlv_collection_snapshots;
create policy "insert own dlv snapshot" on public.dlv_collection_snapshots
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "update own dlv snapshot" on public.dlv_collection_snapshots;
create policy "update own dlv snapshot" on public.dlv_collection_snapshots
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Immutable server-side recovery points (not editable or removable by clients).
create table if not exists public.dlv_collection_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  revision bigint not null,
  schema_version integer not null,
  collection jsonb not null,
  manual_totals jsonb not null,
  owned_only boolean not null,
  archived_at timestamptz not null default now(),
  unique(user_id, revision)
);
alter table public.dlv_collection_history enable row level security;
revoke all on public.dlv_collection_history from anon, authenticated;
grant select on public.dlv_collection_history to authenticated;
drop policy if exists "read own dlv history" on public.dlv_collection_history;
create policy "read own dlv history" on public.dlv_collection_history
  for select to authenticated using ((select auth.uid()) = user_id);

-- Atomic compare-and-swap. Only the authenticated owner can write.
-- Returns the committed revision, or NULL for a conflict.
create or replace function public.dlv_write_snapshot(
  expected_revision bigint,
  next_collection jsonb,
  next_manual_totals jsonb,
  next_owned_only boolean
) returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  current_snapshot public.dlv_collection_snapshots%rowtype;
  committed_revision bigint;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if next_collection is null or jsonb_typeof(next_collection) <> 'object'
     or next_manual_totals is null or jsonb_typeof(next_manual_totals) <> 'object'
     or next_owned_only is null then
    raise exception 'Invalid snapshot payload';
  end if;

  -- First write: only if no row exists. Concurrent initial writes conflict safely.
  if expected_revision = 0 then
    insert into public.dlv_collection_snapshots
      (user_id, revision, collection, manual_totals, owned_only)
    values (uid, 1, next_collection, next_manual_totals, next_owned_only)
    on conflict (user_id) do nothing
    returning revision into committed_revision;
    return committed_revision;
  end if;

  select * into current_snapshot
    from public.dlv_collection_snapshots where user_id = uid for update;
  if not found or current_snapshot.revision <> expected_revision then
    return null;
  end if;

  insert into public.dlv_collection_history
    (user_id, revision, schema_version, collection, manual_totals, owned_only)
  values (uid, current_snapshot.revision, current_snapshot.schema_version,
          current_snapshot.collection, current_snapshot.manual_totals, current_snapshot.owned_only)
  on conflict (user_id, revision) do nothing;

  update public.dlv_collection_snapshots
    set revision = revision + 1, collection = next_collection,
        manual_totals = next_manual_totals, owned_only = next_owned_only,
        updated_at = now()
    where user_id = uid
    returning revision into committed_revision;
  return committed_revision;
end;
$$;

revoke all on function public.dlv_write_snapshot(bigint,jsonb,jsonb,boolean) from public, anon;
grant execute on function public.dlv_write_snapshot(bigint,jsonb,jsonb,boolean) to authenticated;
-- Client must never receive a service_role key.
