# DLV Guide V2

Premium iPhone-first redesign for the Disney Dreamlight Valley collection tracker.

## Current App Analysis

- UX: the existing app works, but most actions are concentrated in one dense page. Category switching, zone selection, status filters, manual editing, GitHub upload, and collection browsing compete for attention.
- UI: the interface has a soft color direction already, but it still feels like a compact web utility rather than a native mobile app. Several labels are French, while V2 is fully English.
- Architecture: `index.html` owns markup, styles, data loading, rendering, filtering, virtualization, GitHub upload, manual edits, and persistence. This makes every change high risk.
- Performance: the app already uses lazy group rendering and a virtual list path, but large categories still require careful grouping and repeated full-list rendering.
- Data: the local database is `data.json`; the stable save key is `dlv_guide_v6`.

## Save Compatibility

V2 preserves the existing save system by keeping:

- localStorage key: `dlv_guide_v6`
- payload fields: `data`, `checked`, `nextId`, `ingredients`, `owned`, `deletedIds`
- item state semantics: `owned` and `missing`
- manual JSON import/export shape

The compatibility code lives in `src/data/saveSystem.ts`. UI, sync, filtering, and category modules call that layer instead of changing the save contract.

## Architecture

- `src/domain`: typed category and item contracts.
- `src/data`: stable save-system adapter, default data loader, manual import/export.
- `src/sync`: Dreamlight Valley Wiki synchronization boundary.
- `src/ui`: React interface.
- `src/styles.css`: mobile-first visual system.
- `public/data.json`: current database copied from V1.
- `public/images`: current image assets copied from V1.

## Synchronization Strategy

The sync button calls the Dreamlight Valley Wiki MediaWiki API with `origin=*`, fetches category results, normalizes names, and incrementally upserts entries. It never clears local user data and never overwrites `checked`, `owned`, `ingredients`, or `deletedIds`.

Because the wiki is an external website, CORS/API availability can vary. If the wiki blocks a request, the app keeps the local database untouched and reports the category error in Settings.

## GitHub Pages

The Vite base path is `/DLV-Guide/`, matching the current GitHub Pages deployment.

```bash
pnpm install
pnpm run build
```

Deploy the generated `dist` folder to GitHub Pages, or use your existing Pages workflow.
