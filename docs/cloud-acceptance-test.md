# DLV — safe cloud acceptance test (desktop browser → iPhone)

**Status:** Test plan only. This branch is NOT production and does not migrate data.

## Before testing

- Keep the existing exported JSON file outside the browser (ideally two copies).
- Open the existing desktop app in its normal browser/profile and confirm collection counts.
- Do **not** clear site data, switch browser profiles, or restore/import into the production origin.
- GitHub Pages production `https://angels00607.github.io/DLV/` remains unchanged until explicitly approved.
- A separate test origin is required: a different path on the same origin may still share localStorage. **Use a separate hostname** and disposable test data, or an isolated browser profile with verified independent storage.
- Confirm the test origin's Supabase configuration points to an isolated **test Supabase project**, not production. Otherwise do not test writes.

## Desktop test (disposable data only)

1. Open the test build in its isolated origin and confirm it contains only disposable test data.
2. Export a full local JSON backup and independently confirm the downloaded file exists and can be opened.
3. Sign in to the **test** Supabase account; verify an empty cloud snapshot.
4. Create first cloud backup; confirm revision 1 and item totals.
5. Compare local/cloud; confirm exact match.
6. Modify a test item locally, then manually upload from a known matching baseline; confirm revision 2 and archived revision 1.
7. Simulate a concurrent update from another session; confirm stale revision is rejected without overwriting either side.
8. Preview history; restore archived revision 1 locally after exporting a backup; verify local state and that cloud revision 2 is unchanged.
9. Confirm sign-out prevents further cloud actions.

## iPhone test (disposable data only)

1. Open the **same test environment**, sign in to the same test account.
2. Before restoring, confirm the local JSON backup really appears in Files/Downloads and opens correctly; a download click alone is not proof.
3. Restore the test cloud snapshot; verify items, manual totals and owned-only mode.
4. Repeat comparison and conflicting-update checks between desktop and iPhone.
5. Reload both browsers; verify saved data persists without accidental overwrite.

## Release gates

- Run build/CI and tests; inspect migration schema and authorization (RLS) with a test user.
- Test network loss, invalid payloads, browser storage quota errors, and interrupted restore.
- Validate **recovery from the exported JSON** using a disposable environment. Current cloud UI downloads backups but does not yet provide a dedicated re-import for that backup format.
- Confirm that local edits cannot be lost between baseline comparison and upload (the baseline must be invalidated on local edits or compared to a frozen snapshot).
- Do not merge the stacked PRs or activate auto-sync until all gates pass and the user approves.
