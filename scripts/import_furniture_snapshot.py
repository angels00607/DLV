#!/usr/bin/env python3
"""Import the user's Furniture.htm snapshot (wiki revision 186956), preserving duplicates and saves."""
import json
import re
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "public/data.json"
SOURCE = "https://dreamlightvalleywiki.com/index.php?title=Furniture&oldid=186956"
HTML_FILE = ROOT / "Furniture.htm"

def key(item):
    return (item.get("name", "").strip().casefold(), item.get("meta", "").strip().casefold())

def extract(html):
    soup = BeautifulSoup(html, "html.parser")
    items = []
    for heading in soup.select("h2 .mw-headline"):
        universe = heading.get_text(" ", strip=True)
        if universe in {"Placing Furniture", "See Also", "History"}:
            continue
        gallery = heading.find_parent("h2").find_next_sibling("ul")
        if gallery is None or "furnituregallery" not in gallery.get("class", []):
            continue
        for card in gallery.select("li.gallerybox"):
            anchor = card.select_one(".gallerytext a[href]")
            if anchor is None:
                continue
            image = card.select_one(".galleryimg a[href] img")
            items.append({
                "name": anchor.get_text(" ", strip=True),
                "meta": universe.upper(),
                "meta2": "DREAMLIGHT VALLEY",
                "sourceUrl": urljoin("https://dreamlightvalleywiki.com", anchor["href"]),
                "image": urljoin("https://dreamlightvalleywiki.com", image["src"]) if image else None,
                "premiumShop": bool(card.select_one('.galleryicon img[src*="Premium_Shop"]')),
            })
    return items

def main():
    if HTML_FILE.exists():
        html = HTML_FILE.read_text(encoding="utf-8")
    else:
        request = Request(SOURCE, headers={"User-Agent": "DLV-collection-import/1.0"})
        with urlopen(request, timeout=90) as response:
            html = response.read().decode("utf-8")
    incoming = extract(html)
    if len(incoming) < 3900:
        raise RuntimeError(f"Expected ~4010 furniture entries from pinned snapshot; got {len(incoming)}")
    payload = json.loads(DB.read_text(encoding="utf-8"))
    existing = payload["data"]["furniture"]
    before = len(existing)
    # Match existing entries by their original wiki URL first; otherwise by
    # name+universe occurrence, never collapsing repeated names.
    by_url = defaultdict(list)
    by_key = defaultdict(list)
    for item in existing:
        if item.get("sourceUrl"):
            by_url[item["sourceUrl"]].append(item)
        by_key[key(item)].append(item)
    matched = set()
    max_id = max((item["id"] for category in payload["data"].values() for item in category), default=0)
    added = 0
    for item in incoming:
        candidate = None
        for pool in (by_url.get(item["sourceUrl"], []), by_key.get(key(item), [])):
            candidate = next((old for old in pool if old["id"] not in matched), None)
            if candidate is not None:
                break
        if candidate is not None:
            matched.add(candidate["id"])
            # Preserve original IDs, ownership, edits, deletions and Event flags.
            candidate.setdefault("sourceUrl", item["sourceUrl"])
            candidate.setdefault("image", item["image"])
            if item["premiumShop"]:
                candidate["premiumShop"] = True
        else:
            max_id += 1
            new_item = {"id": max_id, **item}
            existing.append(new_item)
            added += 1
    payload.setdefault("nextId", {})["furniture"] = max(
        payload.get("nextId", {}).get("furniture", 1), max_id + 1
    )
    # Existing owned/checked/deleted maps intentionally untouched.
    DB.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Furniture: {before} existing, {len(incoming)} wiki entries, {added} appended, {len(existing)} total.")
    print(f"Premium Shop: {sum(bool(x.get('premiumShop')) for x in existing)}; repeated names preserved.")

if __name__ == "__main__":
    main()
