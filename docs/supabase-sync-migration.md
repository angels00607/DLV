# DLV — Supabase sync migration (phase 0, review only)

**Status:** preparatory design and SQL only. No login, cloud connection, data transfer, or automatic sync is enabled by this PR. Existing localStorage, GitHub backup/restore, and GitHub Pages continue unchanged. **Do not merge or execute the SQL until reviewed.**

## Current state confirmed in source

- React 19 + Vite static GitHub Pages app; no authentication or Supabase client.
- Local save key: `dlv_guide_v6`; collection mode: `dlv_collection_owned_only_v1`.
- SavePayload contains `data`, `owned`, `checked`, `ingredients`, `deletedIds`, `nextId`, and `customUniverses`.
- Manual totals are a **separate localStorage value** (`MANUAL_TOTALS_KEY` in App.tsx), not part of SavePayload.
- GitHub personal backup is an explicit manual upload/restore of `collection-sync.json`, not multi-device sync.
- Existing localStorage persistence swallows write failures; it has no cross-device revision control.
- `ensureCategoryShape` can repopulate bundled Meals/Crafting catalogs; migrations must preserve deletedIds, checked, owned-only flag and catalog semantics.

## Chosen initial architecture

1. **Supabase Auth** with one private user account (email OTP/magic link or another provider configured later). Never embed a service-role secret in the static website. Supabase public URL + publishable/anon key may be client-side; RLS is mandatory.
2. **One owner-scoped snapshot per user** in `dlv_collection_snapshots`: complete SavePayload, manual totals, owned-only mode, revision, schema version, update time. Keep this as a transitional snapshot to avoid lossy field-by-field migration.
3. **Atomic optimistic concurrency** via `dlv_write_snapshot(expected_revision, ...)`. A successful write advances the revision. A stale writer receives NULL and **must not overwrite the cloud**. The function stores the prior version in an owner-readable history table.
4. **Local-first** editing: save to localStorage first and queue an unsynced snapshot; send when online/authenticated. No background sync guarantees on iOS when the page is closed.
5. **Pull only when safe**: on login, app focus, reconnect, and manual refresh. If local changes are pending and remote revision advanced, enter a visible conflict state. Do **not** silently choose newest timestamp, union deleted items, or overwrite either side.
6. **Backups**: keep the existing manual GitHub backup and JSON export available during rollout; provide an explicit downloadable pre-migration backup and a local recovery point.

## Initial import / device linking

- Export a JSON backup **from every device** before enabling sync. This matters because devices may contain different collections.
- Show cloud revision, local unsynced state and an explicit first-device selection. First upload uses expected_revision=0 and fails safely if another device initialized the account.
- A second device must preview the cloud snapshot versus its local collection, including item counts, owned/checked states, deleted IDs, custom/empty universes, and manual totals.
- When both differ, **pause and request a choice** or a reviewed merge. Never automatically restore over local data.
- Preserve the local save untouched until cloud write and a read-back verification succeed. Keep the original as a recovery copy.

## Sync state machine for phase 1

`local-only → authenticating → comparing → synced → pending-upload → syncing → synced`

Exceptions: `offline`, `authentication-expired`, `conflict`, `error`. The UI must show status and the last confirmed revision, not claim “saved” after only local persistence.

### CAS write contract

1. Read current snapshot and revision R under the signed-in user's session.
2. Save local edits immediately; queue snapshot with base revision R.
3. Call `dlv_write_snapshot(R, collection, manual_totals, owned_only)`.
4. If result is R+1, read back and confirm the revision before marking synced.
5. If result is NULL, fetch remote snapshot, preserve local edits and show conflict; do not retry a blind write.
6. Offline edits stay queued. If a device changes multiple times offline, coalesce the local snapshot but retain its **original** base revision.

## Safety checks before production

- RLS isolation: user A cannot read/write user B; anon cannot read any collection.
- CAS: two simultaneous writes based on revision R → exactly one succeeds; no lost update.
- History: previous snapshot recoverable by owner; test delete/rename and manual total changes.
- First login on device B with divergent local data → no silent replacement.
- Offline device A + online device B → explicit conflict, both copies preserved.
- Full round-trip of every SavePayload field, including `deletedIds`, empty custom universes, manual totals and owned-only flag.
- Large collection payload and quota checks; error states, expired sessions, interrupted requests, Safari iPhone resume.
- Security review of auth redirects and Supabase site URL for `https://angels00607.github.io/DLV/`.
- Retention/restore policy for history and privacy implications of cloud storage.

## Rollout phases

- **Phase 0 (this PR):** design, schema and CAS SQL only; no application behavior change.
- **Phase 1:** Auth + read-only cloud status, feature-flagged, with environment configuration and tests.
- **Phase 2:** explicit backup + import comparison and initial upload wizard; read-back verification.
- **Phase 3:** local-first queue, CAS writes, pull on focus/reconnect, visible conflicts and recovery UI.
- **Phase 4:** multi-device integration tests, opt-in beta, gradual rollout. Remove old manual flow only after proven parity.

## Configuration needed later

A Supabase project and selected login method. Store `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as build configuration (public values), not service-role credentials. No Supabase project, auth users, credentials, or remote tables are created by this PR.

## SQL migration notes

Review `supabase/migrations/20261010_000001_dlv_sync_phase0.sql`. Tables have RLS; clients can SELECT only their own snapshot and history. Snapshot writes require the authenticated CAS RPC. The RPC uses `security definer` with a fixed empty search_path and `auth.uid()` to scope every operation; EXECUTE is granted only to authenticated users. History is append-only to clients. No database migration is executed automatically by GitHub Pages.
