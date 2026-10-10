-- Keep repository migrations consistent with live Supabase permission hardening.
-- Clients may SELECT only; all writes must pass through revision-checked RPC.
revoke all privileges on table public.dlv_collection_snapshots from anon, authenticated;
grant select on table public.dlv_collection_snapshots to authenticated;
revoke all privileges on table public.dlv_collection_history from anon, authenticated;
grant select on table public.dlv_collection_history to authenticated;
