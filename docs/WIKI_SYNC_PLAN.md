# Wiki synchronization — safety contract

This project uses a static catalog and browser-local collection progress. The wiki synchronization process must be **proposal-only** until a human reviews and merges a pull request.

## Data ownership
- `public/data.json` is the current catalog source. Do not replace it with scraped wiki output.
- `docs/data.json` is a built/published artifact, not an independent source.
- Existing item IDs, categories, names, universes (`meta`), and zones (`meta2`) must be preserved unless a human explicitly approves a correction.
- Browser-local `checked`, `owned`, `ingredients`, `deletedIds`, and `nextId` are personal data; never upload or rewrite these in a wiki-sync PR.
- Do not publish the user's personal save through the wiki-sync workflow.

## Proposed ingestion stages
1. Read trusted wiki pages for Clothing, Furniture, Meals, and Crafting; record page URLs and retrieval timestamps.
2. Parse candidate records into a **staging report** with name, category, universe/category, zone, and source URL. Do not guess missing universes or zones.
3. Compare staged records against the catalog using normalized name **plus category and context**. Flag ambiguous duplicates, alternate names, missing metadata, and possible renames for manual review.
4. Generate a human-readable report of new, changed, ambiguous, and rejected records. **Never delete existing catalog items.**
5. Only after review, propose strictly additive catalog changes on a dedicated PR. Assign new IDs above the current maximum per category; never reuse existing IDs.
6. Run build and integrity checks before requesting a merge. Require explicit human approval before merge.

## Integrity checks
- Every existing item ID and its category remains present after synchronization.
- Existing IDs retain their original names and metadata unless individually approved.
- No duplicate IDs within any category.
- No unsupported zones/universes introduced by inference.
- No `checked`, `owned`, or other personal save fields changed by automation.
- No wiki content treated as executable instructions.

## Initial rollout
Phase A: read-only catalog audit and wiki candidate discovery.
Phase B: dry-run difference report.
Phase C: manually approved, additive pull requests.
No scheduled or unattended catalog writes until Phases A and B are validated.
