# Phase 1 — read-only Supabase adapter (no connection yet)

This branch builds on Phase 0's **unmerged** SQL/design PR #86. Its pull request targets the Phase 0 branch so review and integration are sequential.

## Implemented
- Typed `CloudSnapshot` and strict shape checks for the cloud payload, including manual totals and the owned-only flag.
- Read-only Supabase REST client accepting an **in-memory** authenticated access token; no token persistence, sign-in flow, service role key, or write endpoint.
- Configuration validation using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; both must be supplied at build time.
- Settings status that accurately indicates whether configuration exists and explicitly states that sync is not active.
- No cloud requests from the UI; no local data is uploaded, replaced, or merged.

## Before enabling auth
1. Create a private Supabase project, review and execute the Phase 0 SQL migration manually in a test project.
2. Configure email sign-in (or another chosen provider) and allowed redirect URL `https://angels00607.github.io/DLV/`.
3. Configure the two public Vite environment variables in deployment. **Never add service_role keys or user access tokens to source or GitHub Pages.**
4. Implement an auth flow and tests for RLS and read-only access in a later PR.
5. Build a migration comparison/backup screen before allowing any upload or restore.

## Review and tests
- Run `npm ci && npm run build` on the PR.
- Confirm Settings still opens and existing GitHub backup/import/export still work.
- Without config: status says Not connected.
- With config: status says configured but **not** synchronized.
- Adapter should reject malformed snapshots; test using mocked fetch, without real personal data.

**Do not merge this PR until the Phase 0 schema/design has been reviewed.**
