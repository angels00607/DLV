# Collection persistence audit — 22 October 2026

Scope: Clothing (all universes), Furniture (all universes), Meals, Crafting;
all GameItem fields, ownership/checklist maps, ingredients, deletion markers,
custom/empty universes, ID allocation, manual totals, local reload, JSON export/import,
cloud upload/readback, current/history restore and concurrent tabs.

## Confirmed defects and corrections

- Clothing initialization reapplied Event/Premium catalog rules to saved records.
  Catalog availability corrections now apply only to newly imported catalog records.
- Legacy clothing/furniture universe migration ran on every reload. A persisted
  migration version now prevents it from undoing subsequent universe edits.
- Meals/Crafting matched defaults by mutable names instead of stable IDs, resurrecting
  a renamed item's old catalog record. Stable IDs now take precedence.
- Defaults could reintroduce intentionally removed ownership/ingredients. Default
  progress maps now initialize missing categories only; saved categories remain authoritative.
- Local changes depended on a later React effect. Mutations now write and verify
  local data immediately. Failed writes remain visible as errors; no delayed effect
  overwrites another tab's data.
- Cloud saving awaited authentication/read before persisting a captured React snapshot.
  It now freezes the current snapshot before network calls, aborts when newer edits
  appear before upload, and reports additional unsaved edits after upload.
- An editor effect reset the draft on parent rerenders when optional ingredient
  arrays were recreated. Each keyed editor now owns its draft until saved/closed.
- Simple JSON export omitted totals and filtered out non-displayed data categories.
  It now preserves all categories, totals and collection mode; import restores them.
- Restore paths had duplicated partial-write handling. A shared verified transaction
  writes collection/totals/mode and rolls back on detected write/readback failures.
  This is exception rollback, not an IndexedDB transaction or crash-safe cross-tab transaction.
- Backup validation checked only top-level maps. Item IDs, duplicate IDs, editable
  fields and nested status/ingredient/universe maps are now validated before writes.
- Startup cloud comparison was restricted to test mode. It now runs read-only for
  signed-in users. A visible status distinguishes device saves from verified cloud data.
- Cross-tab storage changes now block stale local/cloud writes until reload.
- The sync helper no longer lowers the saved next-ID high-water mark.

## Evidence

- Existing 14 cloud tests plus new regression cases: 29 passing Node tests.
- Running the first 27 tests against the original saveSystem implementation reproduced
  11 failures. These passed with the fixes.
- React + DOM integration with mocked fetch verified edit → immediate local storage →
  cloud RPC → full server readback for all four UI categories, parent rerenders while
  editing, reload without resurrecting original names, asynchronous save races, network failures and stale-tab write blocking.
- TypeScript and production Vite builds verified.
- Read-only inspection of live revision 32: 1,744 clothing, 3,943 furniture, 219 meals,
  355 crafting records, unique IDs within each category. Apollo Sandals had event=true.
  Revisions 1–31 were archived. No live collection/history rows were changed by this audit.

## Limits

The UI integration uses simulated DOM/network responses, not a physical iPad/iPhone.
A Chromium installation was attempted but its download was invalid in this environment.
Live authenticated browser save/restore was not performed, and deliberate failure,
corruption or conflicting writes were not injected into the user's live database.
No changes were made to the server schema, authentication or RLS policies.

During inspection, one unnecessarily large grouping query exceeded temporary database
space; the equivalent bounded per-category query succeeded. No evidence ties that
read-query error to a user save failure. The database size check returned 19 MB.

Saving to Supabase intentionally does not rewrite GitHub's bundled public/data.json.
GitHub export and Supabase are distinct destinations. No automatic background upload
or automatic cloud restoration was introduced.

## Checks

`npm run test:cloud`

`npm run build`
