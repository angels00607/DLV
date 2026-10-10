# Isolated DLV test release — preflight

## Current status

No test deployment exists. The Supabase account currently exposes only the live
`DLV Collection` project (`skenuigulnonrshkwelu`). Never run acceptance-test
writes against this project.

## Required setup before publishing a preview

1. Create a **separate Supabase test project**, explicitly choosing its organization
   and acknowledging any project cost. Do not reuse the live project.
2. Apply the SQL migrations from `supabase/migrations/` in order to the test
   project; verify RLS and the `dlv_write_snapshot` RPC using disposable users.
3. Deploy the PR build to a **different hostname** from
   `angels00607.github.io`, because GitHub Pages paths on that hostname share
   localStorage with the production collection.
4. Configure build variables:
   - `VITE_DLV_TEST_MODE=true`
   - `VITE_SUPABASE_URL=https://TEST_PROJECT.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=TEST_PROJECT_PUBLISHABLE_KEY`
5. Verify the test app shows an empty/disposable local collection before testing.
   Never import the user's desktop JSON into the preview.
6. Run the acceptance plan in `docs/cloud-acceptance-test.md`, including
   real browser recovery, iPhone Files download verification, concurrent revisions,
   and reload persistence.

## Release gate

No production merge or automatic sync until the user explicitly approves it.
The existing desktop browser and its exported JSON remain the recovery source.
