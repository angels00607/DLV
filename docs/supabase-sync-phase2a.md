# Phase 2A: complete backup and comparison primitives

This is a **stacked draft** on Phase 1, which itself depends on Phase 0. No merge or cloud write.

## Included
- Settings button: **Export complete pre-sync backup (including totals)**. JSON includes all SavePayload fields, custom universes, manual totals and owned-only flag, plus a timestamp and schema identifier.
- Pure helper to compare local vs remote snapshot counts and raw payload equality; it deliberately does not merge or replace either side.
- Current JSON import remains unchanged; this new full backup is for preservation and later reviewed recovery flow, **not** yet directly restorable through the old import button.

## Next gated step
- Configure Supabase project and authentication.
- Implement safe auth callback, session handling and read-only cloud preview.
- Build a validated full-backup restore wizard with explicit confirmation and local recovery point.
- Test two-device divergence and concurrent writes before enabling uploads.

Never commit secrets or service-role keys to GitHub Pages.
