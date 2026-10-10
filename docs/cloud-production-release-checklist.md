# DLV real-collection cloud release checklist

## Verified before release (2026-10-10)
- Isolated Vercel test uses a separate Supabase project and domain.
- Test cloud backup, read-only preview and iPhone restore were exercised with fictional data.
- Production Supabase `dlv_collection_snapshots` has **0 rows** at verification.
- Production `authenticated` role has **SELECT only** on snapshots; direct INSERT/UPDATE/DELETE grants are absent. The version-checked `dlv_write_snapshot` RPC is used for writes.
- Production collection is currently stored in the existing desktop browser; do not clear storage, import into the test site, or merge PRs without explicit approval.

## Required before deploying to GitHub Pages
1. Review stacked draft PRs through #117 in order and validate the complete production build and GitHub Pages base `/DLV/`.
2. Confirm production cloud authentication works with the intended user account (test login is a separate Supabase project).
3. Ensure the final production build targets only `skenuigulnonrshkwelu.supabase.co`, never the test project.
4. Confirm a full JSON export of the **real desktop collection** exists and can be parsed and restored. Keep the original file offline.
5. Obtain explicit approval to merge and deploy. Do not merge based on this checklist alone.

## User-approved cutover sequence (only after production deploy)
1. On the original desktop and original production origin, verify all real items are present.
2. Download and keep a fresh complete JSON backup.
3. Sign in to production cloud; use **View my cloud backup** to verify no existing cloud backup is unexpectedly present.
4. Press **Save my collection** on desktop. Confirm the item count is the real count, not the 1–2 fictional test items. Confirm only after checking the JSON download.
5. On iPhone, sign in to the **same production account**, press **View my cloud backup**, verify item count and revision.
6. Press **Recover my collection on this device** on iPhone only after backing up any iPhone-local collection. Verify actual items.
7. Do not interpret the test cloud's revision 3 / 2 fictional items as real production data.

## Safety / limitations
- Manual backup/restore is not live bidirectional sync. Saving from an out-of-date device can overwrite newer cloud contents after explicit confirmation. Always recover the latest version before editing on another device.
- Never silently replace desktop data. The existing real desktop browser remains the recovery source until cutover is verified.
- CAS revision checks protect against simultaneous writes, but do not replace user review of differing snapshots.
