# Offline wiki audit snapshots

The wiki's MediaWiki API currently returns HTTP 403 from GitHub Actions. The audit can also run from a **reviewed local JSON snapshot**, without requesting the blocked API.

Save a UTF-8 JSON file containing four arrays of **item names only**:

```json
{
  "clothing": ["Mysterious Moth Wings"],
  "furniture": [],
  "meals": [],
  "crafting": []
}
```

Run: `python3 scripts/wiki_audit.py --snapshot path/to/reviewed-snapshot.json --output wiki-sync-report.json`

Use source pages such as:
- https://dreamlightvalleywiki.com/Collections/Clothing_Sets
- https://dreamlightvalleywiki.com/Collections/Furniture_Sets
- https://dreamlightvalleywiki.com/Collections/Meals
- https://dreamlightvalleywiki.com/Collections/Crafting

**This does not retrieve pages automatically.** Snapshot data must be acquired with permission and checked for accuracy and license compliance before use. Empty arrays mean "not included", not "no items exist". A snapshot with empty arrays is not evidence of catalog completeness. No progress data is exported; no catalog is modified. Names are only discovery candidates and do not establish universes or zones. Never copy wiki images or substantial descriptions into the repository without confirming reuse rights.
