#!/usr/bin/env python3
"""Import a pinned Clothing wiki revision into the bundled catalog without touching saves."""
import json
import re
import unicodedata
import urllib.request
from pathlib import Path
from bs4 import BeautifulSoup

REVISION = '186947'  # 2026-10-14, same revision as the user's saved HTML
URL = f'https://dreamlightvalleywiki.com/index.php?title=Clothing&oldid={REVISION}'
ROOT = Path(__file__).resolve().parents[1]

def norm(value):
    return re.sub(r'[^\w]+', '', unicodedata.normalize('NFKC', value).casefold())

def parse(html):
    soup = BeautifulSoup(html, 'html.parser')
    result = []
    for gallery in soup.select('ul.gallery'):
        heading = gallery.find_previous(['h2', 'h3'])
        if not heading:
            continue
        universe = heading.get_text(' ', strip=True).replace('[ edit ]', '').strip()
        for li in gallery.select('li.gallerybox'):
            label = li.select_one('.gallerytext a[href]')
            if not label:
                continue
            name = label.get_text(' ', strip=True)
            href = label.get('href', '')
            text = li.get_text(' ', strip=True)
            if 'not tracked' in text.casefold() or 'not counted' in text.casefold():
                continue
            if not href.startswith('https://dreamlightvalleywiki.com/'):
                continue
            premium = any('Premium_Shop' in (img.get('src', '') + img.get('srcset', '')) for img in li.select('.gallerycorner img'))
            result.append({'name': name, 'universe': universe, 'sourceUrl': href, 'premiumShop': premium})
    return result

def merge(data, incoming):
    rows = data['data']['clothing']
    by_name = {}
    for item in rows:
        by_name.setdefault(norm(item['name']), []).append(item)
    deleted = {int(k) for k,v in data.get('deletedIds', {}).get('clothing', {}).items() if v}
    used = {item['id'] for item in rows} | deleted
    next_id = max(1000000, max(used, default=0) + 1)
    report = {'matched': 0, 'added': 0, 'ambiguous': [], 'premiumFlagged': 0}
    seen = set()
    for entry in incoming:
        key = norm(entry['name'])
        if key in seen:
            continue
        seen.add(key)
        matches = by_name.get(key, [])
        if len(matches) > 1:
            report['ambiguous'].append(entry['name'])
            continue
        if matches:
            item = matches[0]
            report['matched'] += 1
            item.setdefault('sourceUrl', entry['sourceUrl'])
            if entry['premiumShop'] and not item.get('premiumShop'):
                item['premiumShop'] = True
                report['premiumFlagged'] += 1
        else:
            while next_id in used:
                next_id += 1
            item = {'id': next_id, 'name': entry['name'], 'meta': entry['universe'].upper(), 'meta2': 'DREAMLIGHT VALLEY', 'sourceUrl': entry['sourceUrl']}
            if entry['premiumShop']:
                item['premiumShop'] = True
                report['premiumFlagged'] += 1
            rows.append(item)
            used.add(next_id)
            next_id += 1
            report['added'] += 1
    rows.sort(key=lambda item: (item.get('meta', '').casefold(), item['name'].casefold()))
    data.setdefault('nextId', {})['clothing'] = max(data.get('nextId', {}).get('clothing', 1), next_id)
    return report

def main():
    req = urllib.request.Request(URL, headers={'User-Agent': 'DLV-personal-catalog-import/1.0 (one-time snapshot)'})
    with urllib.request.urlopen(req, timeout=40) as response:
        html = response.read().decode('utf-8')
    entries = parse(html)
    premium = sum(item['premiumShop'] for item in entries)
    if not 1700 <= len(entries) <= 1900 or not 450 <= premium <= 600:
        raise RuntimeError(f'Wiki extraction incomplete: {len(entries)} entries, {premium} premium. Refusing to alter catalog.')
    path = ROOT / 'public/data.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    report = merge(data, entries)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'extracted': len(entries), 'premiumIcons': premium, **report}, ensure_ascii=False))

if __name__ == '__main__':
    main()
