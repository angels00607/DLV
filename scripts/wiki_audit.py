#!/usr/bin/env python3
"""Read-only wiki discovery report. Never writes to the game catalog."""
import argparse
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API = "https://dreamlightvalleywiki.com/api.php"
CATEGORIES = {
    "clothing": "Category:Clothing",
    "furniture": "Category:Furniture",
    "meals": "Category:Meals",
    "crafting": "Category:Crafting",
}

def fetch_members(category, limit=5000):
    found, continuation = [], {}
    while len(found) < limit:
        params = {
            "action": "query", "list": "categorymembers", "cmtitle": category,
            "cmtype": "page", "cmlimit": "max", "format": "json", "formatversion": "2",
            **continuation,
        }
        url = API + "?" + urllib.parse.urlencode(params)
        request = urllib.request.Request(url, headers={"User-Agent": "DLV-Guide-Wiki-Audit/0.1 (read-only; GitHub Actions)", "Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=25) as response:
            payload = json.load(response)
        if "error" in payload:
            raise ValueError(str(payload["error"]))
        found.extend(member["title"] for member in payload.get("query", {}).get("categorymembers", []) if member.get("ns") == 0)
        continuation = payload.get("continue", {})
        if not continuation:
            break
    return sorted(set(found), key=str.casefold)

def normalized(name):
    return re.sub(r"\s+", " ", name.strip()).casefold()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", default="public/data.json")
    parser.add_argument("--output", default="wiki-sync-report.json")
    args = parser.parse_args()
    catalog = json.loads(Path(args.catalog).read_text(encoding="utf-8"))
    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "mode": "READ_ONLY_NO_CATALOG_CHANGES",
        "source": API,
        "categories": {},
        "warnings": ["Wiki category membership is only a candidate discovery source. Missing items, subcategories, universe and zone require human verification.", "This audit never changes catalog IDs, progress, zones or universes."],
    }
    for key, wiki_category in CATEGORIES.items():
        existing = catalog.get("data", {}).get(key, [])
        by_name = {}
        for item in existing:
            by_name.setdefault(normalized(item["name"]), []).append(item)
        try:
            titles = fetch_members(wiki_category)
            candidates = []
            matched = 0
            for title in titles:
                name = title.rsplit("/", 1)[-1].strip()
                matches = by_name.get(normalized(name), [])
                if len(matches) == 1:
                    matched += 1
                else:
                    candidates.append({
                        "wikiTitle": title,
                        "sourceUrl": "https://dreamlightvalleywiki.com/" + urllib.parse.quote(title.replace(" ", "_"), safe="/()"),
                        "status": "POSSIBLE_NEW" if not matches else "AMBIGUOUS",
                        "note": "Requires item-page review, category, universe and zone confirmation; not approved for import.",
                    })
            report["categories"][key] = {
                "wikiCategory": wiki_category, "wikiPagesFound": len(titles),
                "catalogItems": len(existing), "exactNameMatches": matched,
                "reviewCandidates": candidates,
            }
        except (OSError, ValueError, KeyError, json.JSONDecodeError) as exc:
            report["categories"][key] = {
                "wikiCategory": wiki_category, "catalogItems": len(existing),
                "error": f"{type(exc).__name__}: {exc}",
                "reviewCandidates": [],
            }
    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    errors = [key for key, entry in report["categories"].items() if "error" in entry]
    print(f"Read-only report: {args.output}; source errors: {', '.join(errors) or 'none'}")
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
