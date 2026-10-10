import { ChangeEvent, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Download,
  Edit3,
  Github,
  Home,
  MapPin,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { CATEGORIES, categoryById } from '../domain/categories';
import type { CategoryId, FilterState, GameItem, SavePayload } from '../domain/types';
import { fetchDefaultData } from '../data/defaultData';
import { INGREDIENT_OPTIONS } from '../data/ingredientOptions';
import { downloadSave, readImportedFile } from '../data/manualImport';
import { buildPortableData, getNextId, loadSave, mergeImportedSave, persistSave } from '../data/saveSystem';
import { normalizeText } from '../lib/text';
import { previewOwnedOnlyMigration } from '../data/ownedOnlyMigration';
import { COLLECTION_BACKUP_KEY, COLLECTION_MODE_KEY, STORAGE_KEY } from '../data/saveSystem';

const initialFilters: FilterState = {
  query: '',
  status: 'all',
  universe: 'all',
  group: 'all',
};

type ActiveView = 'home' | CategoryId;
type ActiveZone =
  | 'all'
  | 'DREAMLIGHT VALLEY'
  | 'ETERNITY ISLE'
  | 'HONEYGLOW WOODS'
  | 'STORYBOOK VALE'
  | 'WISHBLOSSOM MOUNTAINS';
const DIRECT_RENDER_LIMIT = 6;
const ALPHABETICAL_NAV_LIMIT = 40;
const DIRECT_ITEMS_LIMIT = 10;
const FIRST_WORD_ACCORDION_LIMIT = 3;
const GH_STORAGE_KEY = 'dlv_gh_config';
const CLOUD_COLLECTION_PATH = 'collection-sync.json';
const NAV_STORAGE_KEY = 'dlv_iphone_nav_v1';
type StarFilter = 'all' | 1 | 2 | 3 | 4 | 5;
const ZONES: Array<{ value: ActiveZone; label: string }> = [
  { value: 'all', label: 'All zones' },
  { value: 'DREAMLIGHT VALLEY', label: 'Dreamlight Valley' },
  { value: 'ETERNITY ISLE', label: 'Eternity Isle' },
  { value: 'HONEYGLOW WOODS', label: 'Honeyglow Woods' },
  { value: 'WISHBLOSSOM MOUNTAINS', label: 'Wishblossom Mountains' },
  { value: 'STORYBOOK VALE', label: 'Storybook Vale' },
];
const ZONE_OPTIONS = ZONES.filter((zone) => zone.value !== 'all').map((zone) => zone.value);

export function App() {
  const [save, setSave] = useState<SavePayload | null>(null);
  const [manualTotals, setManualTotals] = useState<Record<string, number>>(readManualTotals);
  const initialNav = readNavigationState();
  const [activeView, setActiveView] = useState<ActiveView>(initialNav.activeView);
  const [activeZone, setActiveZone] = useState<ActiveZone>(initialNav.activeZone);
  const [activeGroup, setActiveGroup] = useState(initialNav.activeGroup);
  const [starFilter, setStarFilter] = useState<StarFilter>('all');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [editingItem, setEditingItem] = useState<GameItem | null>(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isTotalsOpen, setTotalsOpen] = useState(false);
  const [isNewUniverseOpen, setNewUniverseOpen] = useState(false);
  const [newUniverseName, setNewUniverseName] = useState('');
  const [newUniverseZone, setNewUniverseZone] = useState<ActiveZone>('DREAMLIGHT VALLEY');
  const [migrationOpen, setMigrationOpen] = useState(false);
  const [migrationChecked, setMigrationChecked] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [reviewedCheckedIds, setReviewedCheckedIds] = useState<Record<string, boolean>>({});
  const [isGithubOpen, setGithubOpen] = useState(false);
  const [isZoneOpen, setZoneOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isQuickAddOpen, setQuickAddOpen] = useState(false);
  const [chooseCategoryForAdd, setChooseCategoryForAdd] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDefaultData().then((defaults) => setSave(loadSave(defaults)));
  }, []);

  useEffect(() => {
    if (save) persistSave(save);
  }, [save]);

  useEffect(() => {
    localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify({ activeView, activeZone, activeGroup }));
    const scrollKey = `${activeView}:${activeZone}:${activeGroup}`;
    const positions = readScrollPositions();
    requestAnimationFrame(() => window.scrollTo({ top: positions[scrollKey] ?? 0 }));
    const rememberScroll = () => {
      positions[scrollKey] = window.scrollY;
      sessionStorage.setItem(`${NAV_STORAGE_KEY}:scroll`, JSON.stringify(positions));
    };
    window.addEventListener('scroll', rememberScroll, { passive: true });
    return () => window.removeEventListener('scroll', rememberScroll);
  }, [activeView, activeZone, activeGroup]);

  const categoryId = activeView === 'home' ? 'clothing' : activeView;
  const currentCategory = categoryById[categoryId];
  const items = activeView === 'home' ? [] : save?.data[categoryId] ?? [];
  const zoneItems = useMemo(() => filterByZone(items, activeZone), [items, activeZone]);
  const baseFilteredItems = useMemo(
    () => filterItems(zoneItems, filters, save, categoryId),
    [zoneItems, filters, save, categoryId],
  );
  const universeOptions = useMemo(
    () => Array.from(new Set(zoneItems.map((item) => item.meta?.trim()).filter((value): value is string => !!value)))
      .sort((a, b) => a.localeCompare(b)),
    [zoneItems],
  );
  const groupedItems = useMemo(() => {
    const groups = groupItems(baseFilteredItems, currentCategory.groupBy[0] ?? 'meta');
    const extras = save?.customUniverses?.[categoryId] ?? [];
    // Include empty universes, even when they have no remaining items.
    // Previously configured totals can also restore universes from older saves.
    const totalUniverses = Object.keys(manualTotals).flatMap((key) => {
      try {
        const parsed: unknown = JSON.parse(key);
        if (!Array.isArray(parsed) || parsed.length !== 3 ||
          parsed[0] !== categoryId || typeof parsed[1] !== 'string' || typeof parsed[2] !== 'string') return [];
        return [{ zone: parsed[1], name: parsed[2] }];
      } catch { return []; }
    });
    for (const entry of [...extras, ...totalUniverses]) {
      if (activeZone !== 'all' && normalizeZone(entry.zone) !== normalizeZone(activeZone)) continue;
      if (!groups.some(([name]) => name === entry.name)) groups.push([entry.name, []]);
    }
    return groups.sort(([a], [b]) => a.localeCompare(b));
  }, [baseFilteredItems, currentCategory.groupBy, save?.customUniverses, categoryId, activeZone, filters, manualTotals]);
  const visibleItems = useMemo(
    () => baseFilteredItems.filter((item) =>
      (activeGroup === 'all' || (item.meta || 'Other') === activeGroup) &&
      (starFilter === 'all' || (categoryId === 'meals' && item.stars === starFilter)),
    ),
    [baseFilteredItems, activeGroup, starFilter, categoryId],
  );
  const progress = getUniverseProgress(zoneItems, save, categoryId, manualTotals);
  const totalProgress = getTotalProgress(save, activeZone, manualTotals);
  function createUniverse() {
    if (!save || activeView === 'home') return;
    const name = newUniverseName.trim();
    if (!name || name.toLowerCase() === 'all' || newUniverseZone === 'all') return;
    const existing = [...(save.data[activeView] ?? []).map((item) => item.meta || 'Other'), ...(save.customUniverses?.[activeView] ?? []).map((entry) => entry.name)];
    if (existing.some((entry) => normalizeText(entry) === normalizeText(name))) {
      window.alert('This universe already exists in this category.');
      return;
    }
    const next = structuredClone(save);
    next.customUniverses ??= {};
    next.customUniverses[activeView] = [...(next.customUniverses[activeView] ?? []), { name, zone: newUniverseZone }];
    updateSave(next);
    setNewUniverseOpen(false);
    setNewUniverseName('');
    setActiveZone(newUniverseZone);
    // Stay on the universe list so an empty universe is immediately visible and expandable.
    setActiveGroup('all');
  }

  function renameUniverse(category: CategoryId, oldName: string) {
    if (!save) return;
    const proposed = window.prompt('New universe name', oldName)?.trim();
    if (!proposed || proposed === oldName || normalizeText(proposed) === 'all') return;
    const existing = new Set([
      ...(save.data[category] ?? []).map((item) => normalizeText(item.meta || 'Other')),
      ...(save.customUniverses?.[category] ?? []).map((entry) => normalizeText(entry.name)),
    ]);
    if (existing.has(normalizeText(proposed))) {
      window.alert('An universe with this name already exists.');
      return;
    }
    const next = structuredClone(save);
    next.data[category] = (next.data[category] ?? []).map((item) =>
      (item.meta || 'Other') === oldName ? { ...item, meta: proposed } : item,
    );
    if (next.customUniverses?.[category]) {
      next.customUniverses[category] = next.customUniverses[category]!.map((entry) =>
        entry.name === oldName ? { ...entry, name: proposed } : entry,
      );
    }
    setManualTotals((current) => {
      const updated = { ...current };
      for (const [key, value] of Object.entries(current)) {
        // Only migrate totals whose key exactly matches a known zone and old universe.
        const zones = new Set([
          ...(save.data[category] ?? []).filter((item) => (item.meta || 'Other') === oldName).map((item) => normalizeZone(item.meta2)),
          ...(save.customUniverses?.[category] ?? []).filter((entry) => entry.name === oldName).map((entry) => normalizeZone(entry.zone)),
        ]);
        for (const zone of zones) {
          if (key === universeTotalKey(category, zone, oldName)) {
            delete updated[key];
            updated[universeTotalKey(category, zone, proposed)] = value;
          }
        }
      }
      localStorage.setItem(MANUAL_TOTALS_KEY, JSON.stringify(updated));
      return updated;
    });
    updateSave(next);
    if (activeView === category && activeGroup === oldName) setActiveGroup(proposed);
  }

  function removeEmptyUniverse(category: CategoryId, zone: string, universe: string) {
    if (!save) return;
    const isCustom = (save.customUniverses?.[category] ?? []).some((entry) =>
      entry.name === universe && normalizeZone(entry.zone) === normalizeZone(zone));
    const hasItems = (save.data[category] ?? []).some((item) =>
      (item.meta || 'Other') === universe && normalizeZone(item.meta2) === normalizeZone(zone));
    if (!isCustom || hasItems) return;
    if (!window.confirm(`Delete empty universe "${universe}" from ${formatZoneLabel(zone)}? This cannot be undone.`)) return;
    const next = structuredClone(save);
    next.customUniverses![category] = next.customUniverses![category]!.filter((entry) =>
      !(entry.name === universe && normalizeZone(entry.zone) === normalizeZone(zone)));
    updateSave(next);
    setManualTotals((current) => {
      const updated = { ...current };
      delete updated[universeTotalKey(category, zone, universe)];
      localStorage.setItem(MANUAL_TOTALS_KEY, JSON.stringify(updated));
      return updated;
    });
    if (activeView === category && activeGroup === universe) setActiveGroup('all');
  }

  function setCategoryTotal(category: CategoryId, zone: string, universe: string, value: number | null) {
    setManualTotals((current) => {
      const next = { ...current };
      if (value === null) delete next[universeTotalKey(category, zone, universe)];
      else next[universeTotalKey(category, zone, universe)] = Math.max(0, Math.floor(value));
      localStorage.setItem(MANUAL_TOTALS_KEY, JSON.stringify(next));
      return next;
    });
  }

  if (!save) {
    return (
      <main className="boot-screen">
        <div className="boot-mark">DLV</div>
        <p>Preparing your guide</p>
      </main>
    );
  }

  function updateSave(next: SavePayload) {
    setSave(next);
  }

  function toggleOwned(item: GameItem) {
    if (!save) return;
    const next = structuredClone(save);
    next.owned[categoryId] ??= {};
    const current = next.owned[categoryId]?.[item.id];
    if (current === 'owned') next.owned[categoryId]![item.id] = 'missing';
    else if (current === 'missing') delete next.owned[categoryId]![item.id];
    else next.owned[categoryId]![item.id] = 'owned';
    updateSave(next);
  }

  function toggleChecked(item: GameItem) {
    if (!save) return;
    const next = structuredClone(save);
    next.checked[categoryId] ??= {};
    if (categoryId === 'meals' || categoryId === 'crafting') {
      const wasChecked = !!next.checked[categoryId]?.[item.id] || next.owned[categoryId]?.[item.id] === 'owned';
      next.checked[categoryId]![item.id] = !wasChecked;
      // Legacy owned-only state is folded into the checklist on the first toggle.
      if (next.owned[categoryId]) delete next.owned[categoryId]![item.id];
    } else {
      next.checked[categoryId]![item.id] = !next.checked[categoryId]?.[item.id];
    }
    updateSave(next);
  }

  function updateItem(updatedItem: GameItem, ingredients?: string[]) {
    if (!save || activeView === 'home') return;
    const next = structuredClone(save);
    next.data[activeView] = (next.data[activeView] ?? []).map((item) =>
      item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
    );
    if (activeView === 'crafting' || activeView === 'meals') {
      next.ingredients[activeView] ??= {};
      const cleanedIngredients = (ingredients ?? []).map((ingredient) => ingredient.trim()).filter(Boolean);
      if (cleanedIngredients.length) next.ingredients[activeView]![updatedItem.id] = cleanedIngredients;
      else delete next.ingredients[activeView]![updatedItem.id];
    }
    updateSave(next);
    setEditingItem(null);
  }

  function deleteItem(item: GameItem) {
    if (!save || activeView === 'home') return;
    const next = structuredClone(save);
    const universe = item.meta?.trim() || 'Other';
    const zone = normalizeZone(item.meta2);
    const remainingInUniverse = (next.data[activeView] ?? []).some((entry) =>
      entry.id !== item.id && (entry.meta?.trim() || 'Other') === universe && normalizeZone(entry.meta2) === zone);
    // Register the universe before deleting its last item, so its name survives.
    if (!remainingInUniverse) {
      next.customUniverses ??= {};
      next.customUniverses[activeView] ??= [];
      if (!next.customUniverses[activeView]!.some((entry) =>
        entry.name === universe && normalizeZone(entry.zone) === zone)) {
        next.customUniverses[activeView]!.push({ name: universe, zone });
      }
    }
    next.data[activeView] = (next.data[activeView] ?? []).filter((entry) => entry.id !== item.id);
    delete next.checked[activeView]?.[item.id];
    delete next.owned[activeView]?.[item.id];
    delete next.ingredients[activeView]?.[item.id];
    next.deletedIds[activeView] ??= {};
    next.deletedIds[activeView]![item.id] = true;
    updateSave(next);
  }

  function selectSubcategory(group: string) {
    setActiveGroup(group);
  }

  function addItem(item: Omit<GameItem, 'id'>) {
    if (!save || activeView === 'home' || !item.name.trim()) return;
    const next = structuredClone(save);
    const nextId = next.nextId[activeView] ?? getNextId(next.data[activeView] ?? []);
    next.data[activeView] = [
      ...(next.data[activeView] ?? []),
      {
        id: nextId,
        name: item.name.trim(),
        meta: item.meta?.trim() ?? '',
        meta2: item.meta2?.trim() ?? '',
      },
    ];
    next.nextId[activeView] = nextId + 1;
    if (localStorage.getItem(COLLECTION_MODE_KEY) === '1') {
      next.owned[activeView] ??= {};
      next.owned[activeView]![nextId] = 'owned';
    }
    updateSave(next);
  }

  function commitOwnedOnlyMigration() {
    if (!save || !migrationChecked) return;
    try {
      const preview = previewOwnedOnlyMigration(save);
      for (const [category, ambiguousItems] of Object.entries(preview.ambiguousItems) as [CategoryId, GameItem[]][]) {
        for (const item of ambiguousItems) {
          if (reviewedCheckedIds[`${category}:${item.id}`]) {
            preview.collection.data[category] ??= [];
            preview.collection.data[category]!.push({ ...item });
            preview.collection.owned[category] ??= {};
            preview.collection.owned[category]![item.id] = 'owned';
            const ingredients = save.ingredients[category]?.[item.id];
            if (ingredients) {
              preview.collection.ingredients[category] ??= {};
              preview.collection.ingredients[category]![item.id] = [...ingredients];
            }
          }
        }
      }
      // Verify backup storage BEFORE touching the live save or mode flag.
      const original = localStorage.getItem(STORAGE_KEY);
      if (original === null) throw new Error('Existing local save was not found. No changes made.');
      localStorage.setItem(COLLECTION_BACKUP_KEY, original);
      if (localStorage.getItem(COLLECTION_BACKUP_KEY) !== original) {
        throw new Error('Could not verify the backup. No changes made.');
      }
      // Persist the converted save first; activate catalog-free mode only after success.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preview.collection));
      if (localStorage.getItem(STORAGE_KEY) === null) throw new Error('Could not write the new collection.');
      localStorage.setItem(COLLECTION_MODE_KEY, '1');
      setSave(preview.collection);
      setMigrationOpen(false);
    } catch (error) {
      setMigrationError(error instanceof Error ? error.message : 'Migration failed.');
    }
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    if (!save || !event.target.files?.[0]) return;
    const imported = await readImportedFile(event.target.files[0]);
    updateSave(mergeImportedSave(save, imported));
    event.target.value = '';
  }

  return (
    <div className="app-shell">
      <header className="top-panel">
        <div>
          <p className="eyebrow">Disney Dreamlight Valley</p>
          <h1>{activeView === 'home' ? 'Home' : 'Collection'}</h1>
        </div>
        <button className="icon-button" aria-label="Open settings" onClick={() => setSettingsOpen(true)}>
          <Settings size={21} />
        </button>
      </header>

      <nav className="tab-bar" aria-label="Primary">
        <button className={activeView === 'home' ? 'active' : ''} aria-current={activeView === 'home' ? 'page' : undefined} onClick={() => {
          setActiveView('home'); setActiveGroup('all'); setFilters(initialFilters);
        }}>
          <Home size={21} />
          <span>Home</span>
        </button>
        <button className={activeView !== 'home' ? 'active' : ''} aria-current={activeView !== 'home' ? 'page' : undefined} onClick={() => { setChooseCategoryForAdd(false); setCategoryOpen(true); }}>
          <span className="nav-collection-icon"><img src={currentCategory.icon} alt="" /></span>
          <span>Collection</span>
        </button>
        <button onClick={() => { if (activeView === 'home') { setChooseCategoryForAdd(true); setCategoryOpen(true); } else { setQuickAddOpen(true); } }} aria-label={activeView === 'home' ? 'Choose a collection to add an item' : 'Add an item'}>
          <Plus size={21} />
          <span>Add</span>
        </button>
        <button className={isTotalsOpen ? 'active' : ''} aria-label="Manage collection totals" onClick={() => setTotalsOpen(true)}>
          <SlidersHorizontal size={21} />
          <span>Totals</span>
        </button>
        <button onClick={() => setSettingsOpen(true)} aria-label="Open settings">
          <Settings size={21} />
          <span>Settings</span>
        </button>
      </nav>

      {isCategoryOpen && (
        <ChoiceSheet title={chooseCategoryForAdd ? "Add to which collection?" : "Choose a collection"} onClose={() => { setCategoryOpen(false); setChooseCategoryForAdd(false); }}>
          <div className="category-choice-list">
            {CATEGORIES.map((category) => {
              const counts = getUniverseProgress(filterByZone(save.data[category.id] ?? [], activeZone), save, category.id, manualTotals);
              return (
                <button className={category.id === activeView ? 'category-choice active' : 'category-choice'} key={category.id} onClick={() => {
                  setActiveView(category.id);
                  setActiveGroup('all');
                  setStarFilter('all');
                  setFilters(initialFilters);
                  setCategoryOpen(false);
                  if (chooseCategoryForAdd) setQuickAddOpen(true);
                  setChooseCategoryForAdd(false);
                }}>
                  <img src={category.icon} alt="" />
                  <span>{category.label}</span>
                  <small>{counts.done}/{counts.total}</small>
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </ChoiceSheet>
      )}

      <button className="zone-trigger" onClick={() => setZoneOpen(true)} aria-haspopup="dialog">
        <MapPin size={16} />
        <span>{formatZoneLabel(activeZone)}</span>
        <small>{totalProgress.done}/{totalProgress.total}</small>
        <ChevronDown size={17} />
      </button>

      {migrationOpen && (() => {
        const preview = previewOwnedOnlyMigration(save);
        const count = (values: Partial<Record<CategoryId, number>>) => Object.values(values).reduce((a, b) => a + (b ?? 0), 0);
        return (
          <div role="dialog" aria-modal="true" aria-label="Confirm owned-only migration" className="migration-overlay">
            <div className="migration-dialog">
              <h2>Switch to My Collection</h2>
              <p><strong>{count(preview.included)}</strong> explicitly Owned items will remain in your collection.</p>
              <p><strong>{count(preview.excluded)}</strong> other catalog entries will be removed from the active collection.</p>
              <p><strong>{count(preview.ambiguous)}</strong> Checked-only items need your decision. Select only the ones you own:</p>
              {Object.entries(preview.ambiguousItems).map(([category, entries]) => entries?.length ? (
                <details key={category}>
                  <summary>{category} ({entries.length} to review)</summary>
                  <div className="migration-review-list">
                    {entries.map((item) => (
                      <label key={item.id}>
                        <input type="checkbox" checked={!!reviewedCheckedIds[`${category}:${item.id}`]}
                          onChange={(event) => setReviewedCheckedIds((old) => ({ ...old, [`${category}:${item.id}`]: event.target.checked }))} />
                        {item.name} {item.meta ? `· ${item.meta}` : ''}
                      </label>
                    ))}
                  </div>
                </details>
              ) : null)}
              <p>A copy of your current save will be kept in this browser before conversion. Export your backup from Settings first for additional safety.</p>
              <label><input type="checkbox" checked={migrationChecked} onChange={(event) => setMigrationChecked(event.target.checked)} /> I understand that Checked does not necessarily mean Owned.</label>
              {migrationError && <p role="alert">{migrationError}</p>}
              <div className="migration-actions">
                <button onClick={() => { setMigrationOpen(false); setMigrationChecked(false); setMigrationError(''); }}>Cancel</button>
                <button disabled={!migrationChecked} onClick={commitOwnedOnlyMigration}>Confirm migration</button>
              </div>
            </div>
          </div>
        );
      })()}
      {activeView === 'home' ? (
        <HomeView
          save={save}
          activeZone={activeZone}
          totalProgress={totalProgress}
          manualTotals={manualTotals}
          onSetTotal={setCategoryTotal}
          onOpenCategory={(category) => {
            setActiveView(category);
            setActiveGroup('all');
          }}
        />
      ) : (
        <main className="content">
          <div className="section-title">
            <div>
              <button className="category-heading-switch" onClick={() => { setChooseCategoryForAdd(false); setCategoryOpen(true); }} aria-label="Change collection category"><h2>{currentCategory.label}</h2><ChevronDown size={20}/></button>
              <p>{progress.done} of {progress.total} collected</p>

            </div>
            <div className="progress-ring" style={{ '--progress': `${progress.percent * 3.6}deg` } as React.CSSProperties}>
              {Math.round(progress.percent)}%
            </div>
          </div>

          <div className="collection-tools">
            <div className="search-field">
              <Search size={18} />
              <input
                aria-label={`Search ${currentCategory.label.toLowerCase()}`}
                autoCapitalize="words"
                value={filters.query}
                onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                placeholder={`Search ${currentCategory.label.toLowerCase()}...`}
              />
              {filters.query && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => { setFilters(initialFilters); setStarFilter('all'); setActiveGroup('all'); }}
                >
                  <X size={17} />
                </button>
              )}
            </div>
            <button className="filter-trigger" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={17} />
              Filters{filters.status !== 'all' || starFilter !== 'all' || filters.universe !== 'all' ? ' •' : ''}
            </button>
          </div>
          <button className="inline-add-trigger" onClick={() => setQuickAddOpen(true)}><Plus size={18} /> Add an item to {currentCategory.label}</button>

          {filters.query.trim() ? (
            <section className="active-group-results search-results" aria-live="polite" aria-label="Search results">
              <p className="search-results-count">
                {baseFilteredItems.filter((item) => starFilter === 'all' || categoryId !== 'meals' || item.stars === starFilter).length} results
              </p>
              {groupItems(
                baseFilteredItems.filter((item) =>
                  starFilter === 'all' || categoryId !== 'meals' || item.stars === starFilter
                ),
                'meta',
              ).map(([universe, universeItems]) => (
                <div className="search-universe-group" key={universe}>
                  <h3>{universe} <small>({universeItems.length})</small></h3>
                  <ItemCards
                    categoryId={categoryId}
                    items={[...universeItems].sort((a, b) => a.name.localeCompare(b.name))}
                    showSearchContext
                    save={save}
                    onOwned={toggleOwned}
                    onChecked={toggleChecked}
                    onEdit={setEditingItem}
                    onDelete={deleteItem}
                  />
                </div>
              ))}
            </section>
          ) : filters.universe !== 'all' ? (
            <section className="active-group-results" aria-label={`Items in ${filters.universe}`}>
              <AlphabeticalCollection
                key={`${categoryId}:${activeZone}:${filters.universe}`}
                categoryId={categoryId}
                items={baseFilteredItems.filter((item) =>
                  starFilter === 'all' || categoryId !== 'meals' || item.stars === starFilter
                )}
                save={save}
                onOwned={toggleOwned}
                onChecked={toggleChecked}
                onEdit={setEditingItem}
                onDelete={deleteItem}
              />
            </section>
          ) : (
            <SubcategoryGrid
              groups={groupedItems}
              activeGroup={activeGroup}
              save={save}
              categoryId={categoryId}
              manualTotals={manualTotals}
              onSelect={selectSubcategory}
              onRename={(group) => renameUniverse(categoryId, group)}
              onCreate={() => { setNewUniverseZone(activeZone === 'all' ? 'DREAMLIGHT VALLEY' : activeZone); setNewUniverseOpen(true); }}
              onOwned={toggleOwned}
              onChecked={toggleChecked}
              onEdit={setEditingItem}
              onDelete={deleteItem}
              renderActiveGroup={() => (
                <AlphabeticalCollection
                  categoryId={categoryId}
                  items={visibleItems}
                  directItemsLimit={20}
                  pageSize={20}
                  save={save}
                  onOwned={toggleOwned}
                  onChecked={toggleChecked}
                  onEdit={setEditingItem}
                  onDelete={deleteItem}
                />
              )}
            />
          )}
        </main>
      )}

      {isZoneOpen && (
        <ChoiceSheet title="Choose a zone" onClose={() => setZoneOpen(false)}>
          {ZONES.map((zone) => {
            const zoneProgress = getTotalProgress(save, zone.value);
            return (
              <button className={`choice-row ${zone.value === activeZone ? 'active' : ''}`} key={zone.value} onClick={() => {
                setActiveZone(zone.value);
                setActiveGroup('all');
                setZoneOpen(false);
              }}>
                <MapPin size={17} />
                <span>{zone.label}</span>
                <small>{zoneProgress.done}/{zoneProgress.total}</small>
                {zone.value === activeZone && <Check size={17} />}
              </button>
            );
          })}
        </ChoiceSheet>
      )}

      {isFilterOpen && (
        <ChoiceSheet title="Filters" onClose={() => setFilterOpen(false)}>
          <div className="sheet-filter-group">
            <p>Status</p>
            <div className="filter-row">
              <Chip active={filters.status === 'all'} onClick={() => setFilters({ ...filters, status: 'all' })}>All</Chip>
              <Chip active={filters.status === 'owned'} onClick={() => setFilters({ ...filters, status: 'owned' })}>Collected</Chip>
              <Chip active={filters.status === 'missing'} onClick={() => setFilters({ ...filters, status: 'missing' })}>Missing</Chip>
            </div>
          </div>
          <div className="sheet-filter-group">
            <label htmlFor="collection-group-filter">
              {categoryId === 'clothing' || categoryId === 'furniture' ? 'Universe' : 'Category'}
            </label>
            <select
              id="collection-group-filter"
              value={filters.universe}
              onChange={(event) => {
                setFilters((current) => ({ ...current, universe: event.target.value }));
                setActiveGroup('all');
                if (event.target.value !== 'all') setFilterOpen(false);
              }}
            >
              <option value="all">{categoryId === 'clothing' || categoryId === 'furniture' ? 'All universes' : 'All categories'}</option>
              {universeOptions.map((universe) => (
                <option key={universe} value={universe}>{universe}</option>
              ))}
            </select>
          </div>
          {categoryId === 'meals' && (
            <div className="sheet-filter-group">
              <p>Recipe stars</p>
              <div className="filter-row star-filter-row">
                <Chip active={starFilter === 'all'} onClick={() => setStarFilter('all')}>All</Chip>
                {([1, 2, 3, 4, 5] as const).map((stars) => (
                  <Chip key={stars} active={starFilter === stars} onClick={() => setStarFilter(stars)}>{stars}★</Chip>
                ))}
              </div>
            </div>
          )}
        </ChoiceSheet>
      )}

      {isQuickAddOpen && activeView !== 'home' && (
        <ChoiceSheet title={`Add to ${currentCategory.label}`} onClose={() => setQuickAddOpen(false)}>
          <div className="quick-add-sheet-intro">Add an owned item. Save & add another keeps your universe and zone.</div>
          <AddItemRow category={currentCategory.label} activeZone={activeZone} existingItems={items} onAdd={addItem} />
        </ChoiceSheet>
      )}
      {isNewUniverseOpen && activeView !== 'home' && (
        <ChoiceSheet title="New universe" onClose={() => setNewUniverseOpen(false)}>
          <form className="new-universe-form" onSubmit={(event) => { event.preventDefault(); createUniverse(); }}>
            <label>Universe name
              <input required maxLength={100} autoFocus value={newUniverseName} onChange={(event) => setNewUniverseName(event.target.value)} placeholder="Name of the universe" />
            </label>
            <label>Zone
              <select value={newUniverseZone} onChange={(event) => setNewUniverseZone(event.target.value as ActiveZone)}>
                {ZONES.filter((zone) => zone.value !== 'all').map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
              </select>
            </label>
            <p>You can create an empty universe and add items later.</p>
            <button type="submit" className="action-button primary">Create universe</button>
          </form>
        </ChoiceSheet>
      )}
      {isTotalsOpen && (
        <TotalsAdmin save={save} manualTotals={manualTotals} onSetTotal={setCategoryTotal} onRemove={removeEmptyUniverse} onClose={() => setTotalsOpen(false)} />
      )}
      {isSettingsOpen && (
        <aside className="sheet" role="dialog" aria-modal="true" aria-label="Settings">
          <div className="sheet-card">
            <div className="sheet-head">
              <h2>Settings</h2>
              <button className="icon-button" aria-label="Close settings" onClick={() => setSettingsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <button
              className="action-button primary"
              onClick={() => {
                setSettingsOpen(false);
                setGithubOpen(true);
              }}
            >
              <Github size={18} />
              GitHub backup & restore
            </button>
            <button className="action-button" onClick={() => downloadSave(save)}>
              <Download size={18} />
              Export collection file
            </button>
            <button className="action-button" onClick={() => fileInput.current?.click()}>
              <Upload size={18} />
              Import collection file
            </button>
            <input ref={fileInput} className="hidden" type="file" accept="application/json" onChange={importFile} />
          </div>
        </aside>
      )}
      {isGithubOpen && <GithubSaveSheet save={save} onRestore={(cloudSave, totals) => {
        try {
          localStorage.setItem('dlv_before_cloud_restore_v1', localStorage.getItem(STORAGE_KEY) ?? '');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudSave));
          localStorage.setItem(MANUAL_TOTALS_KEY, JSON.stringify(totals));
          localStorage.setItem(COLLECTION_MODE_KEY, '1');
          setSave(cloudSave); setManualTotals(totals); setGithubOpen(false);
        } catch { window.alert('Restore failed. Check browser storage.'); }
      }} onClose={() => setGithubOpen(false)} />}
      {editingItem && activeView !== 'home' && (
        <EditSheet
          item={editingItem}
          supportsRecipe={categoryById[activeView].supportsIngredients === true}
          categoryLabel={categoryById[activeView].label}
          initialIngredients={save.ingredients[activeView]?.[editingItem.id] ?? []}
          onClose={() => setEditingItem(null)}
          onSave={updateItem}
        />
      )}
    </div>
  );
}

function NestedAccordions({
  categoryId,
  groupKey,
  parentKey,
  items,
  save,
  openGroups,
  setOpenGroups,
  onOwned,
  onChecked,
  onEdit,
  onDelete,
}: {
  categoryId: CategoryId;
  groupKey: string;
  parentKey: string;
  items: GameItem[];
  save: SavePayload;
  openGroups: Record<string, boolean>;
  setOpenGroups: (state: Record<string, boolean>) => void;
  onOwned: (item: GameItem) => void;
  onChecked: (item: GameItem) => void;
  onEdit: (item: GameItem) => void;
  onDelete: (item: GameItem) => void;
}) {
  if (items.length <= DIRECT_RENDER_LIMIT) {
    return (
      <div className="item-grid direct-item-grid">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            owned={save.owned[categoryId]?.[item.id]}
            checked={!!save.checked[categoryId]?.[item.id]}
            ingredients={save.ingredients[categoryId]?.[item.id] ?? []}
            stars={categoryId === 'meals' ? item.stars : undefined}
            onOwned={() => onOwned(item)}
            onChecked={() => onChecked(item)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </div>
    );
  }

  const letters = buildLetterGroups(items);

  return (
    <div className="nested-list">
      {letters.map(([letter, letterItems]) => {
        const letterKey = `${groupKey}-letter-${letter}`;
        const accordionKey = `letter:${groupKey}|${letterKey}`;
        const letterOpen = openGroups[accordionKey] ?? false;
        const letterProgress = getProgress(letterItems, save, categoryId);
        const wordGroups = buildWordGroups(letterItems);

        return (
          <section className="nested-group letter-group" key={letterKey}>
            <button
              className="nested-header"
              onClick={() => setOpenGroups(toggleAccordion(openGroups, accordionKey, [parentKey]))}
            >
              <span>{letter}</span>
              <small>{letterProgress.done}/{letterProgress.total}</small>
              <ChevronDown className={letterOpen ? 'rotate' : ''} size={17} />
            </button>

            {letterOpen && (
              letterItems.length <= DIRECT_RENDER_LIMIT ? (
                <ItemCards
                  categoryId={categoryId}
                  items={letterItems}
                  save={save}
                  onOwned={onOwned}
                  onChecked={onChecked}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ) : (
                <div className="word-list">
                  {wordGroups.map(([word, wordItems]) => {
                    const wordKey = `${letterKey}-word-${word}`;
                    const wordAccordionKey = `word:${letterKey}|${wordKey}`;
                    const wordOpen = openGroups[wordAccordionKey] ?? false;
                    const wordProgress = getProgress(wordItems, save, categoryId);

                    return (
                      <section className="nested-group word-group" key={wordKey}>
                        <button
                          className="nested-header word-header"
                          onClick={() =>
                            setOpenGroups(toggleAccordion(openGroups, wordAccordionKey, [parentKey, accordionKey]))
                          }
                        >
                          <span>{word}</span>
                          <small>{wordProgress.done}/{wordProgress.total}</small>
                          <ChevronDown className={wordOpen ? 'rotate' : ''} size={17} />
                        </button>

                        {wordOpen && (
                          <ItemCards
                            categoryId={categoryId}
                            items={wordItems}
                            save={save}
                            onOwned={onOwned}
                            onChecked={onChecked}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        )}
                      </section>
                    );
                  })}
                </div>
              )
            )}
          </section>
        );
      })}
    </div>
  );
}

function ChoiceSheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <aside className="sheet choice-sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet-card">
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-button" aria-label={`Close ${title}`} onClick={onClose}><X size={20} /></button>
        </div>
        {children}
      </div>
    </aside>
  );
}

function SubcategoryGrid({
  groups, activeGroup, save, categoryId, manualTotals, onSelect, onCreate, onRename, onOwned, onChecked, onEdit, onDelete, renderActiveGroup,
}: {
  groups: Array<[string, GameItem[]]>;
  activeGroup: string;
  save: SavePayload;
  categoryId: CategoryId;
  manualTotals: Record<string, number>;
  onSelect: (group: string) => void;
  onCreate: () => void;
  onRename: (group: string) => void;
  onOwned: (item: GameItem) => void;
  onChecked: (item: GameItem) => void;
  onEdit: (item: GameItem) => void;
  onDelete: (item: GameItem) => void;
  renderActiveGroup: () => React.ReactNode;
}) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const matching = groups.filter(([name]) => normalizeText(name).includes(normalizeText(query)));
  const selected = groups.find(([name]) => name === activeGroup);

  if (selected) {
    const progress = getUniverseDisplayProgress(selected[0], selected[1], save, categoryId, manualTotals);
    return (
      <section className="subcategory-browser universe-detail-view" aria-label={`Items in ${activeGroup}`}>
        <button type="button" className="universe-back-button" onClick={() => onSelect('all')}>← All universes</button>
        <div className="universe-detail-heading">
          <h3>{activeGroup}</h3>
          <button type="button" className="universe-rename-button" onClick={() => onRename(activeGroup)} aria-label={`Rename ${activeGroup}`}><Edit3 size={16}/> Rename</button>
          <span>{progress.done}/{progress.total} collected</span>
        </div>
        {renderActiveGroup()}
      </section>
    );
  }
  return (
    <section className="subcategory-browser" aria-label="Choose a universe">
      <button type="button" className="universe-create-button" onClick={onCreate}><Plus size={17}/> New universe</button>
      <div className="universe-browser-toolbar">
        <label className="universe-search-label">Find a universe
          <input type="search" value={query} placeholder="Search universes…" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <span>{matching.length} universes</span>
      </div>
      <div className="universe-compact-list">
        {matching.map(([group, items]) => {
          const progress = getUniverseDisplayProgress(group, items, save, categoryId, manualTotals);
          const inline = items.length < 15;
          const isExpanded = inline && expanded === group;
          return (
            <div key={group} className="universe-compact-entry">
              <button type="button" className="universe-compact-row"
                aria-expanded={inline ? isExpanded : undefined}
                aria-controls={inline ? `universe-inline-${categoryId}-${groups.findIndex(([name]) => name === group)}` : undefined}
                onClick={() => inline ? setExpanded(isExpanded ? null : group) : onSelect(group)}>
                <span className="universe-compact-name">{group}</span>
                <span className="universe-compact-progress">{progress.done}/{progress.total}</span>
                <ChevronDown className={isExpanded ? 'universe-chevron-open' : ''} size={17} aria-hidden="true" />
              </button>
              <button type="button" className="universe-inline-pencil" onClick={() => onRename(group)} aria-label={`Rename ${group}`} title={`Rename ${group}`}><Edit3 size={16}/></button>
              {isExpanded && (
                <div id={`universe-inline-${categoryId}-${groups.findIndex(([name]) => name === group)}`} className="universe-inline-items">
                  {items.length ? (
                    <ItemCards categoryId={categoryId} items={[...items].sort((a, b) => a.name.localeCompare(b.name))}
                      save={save} onOwned={onOwned} onChecked={onChecked} onEdit={onEdit} onDelete={onDelete} />
                  ) : <p className="empty-collection">No items in this universe yet.</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {matching.length === 0 && <p className="empty-collection">No universes match this search.</p>}

    </section>
  );
}

function AlphabeticalCollection({
  categoryId,
  items,
  directItemsLimit = DIRECT_ITEMS_LIMIT,
  pageSize = 12,
  save,
  onOwned,
  onChecked,
  onEdit,
  onDelete,
}: {
  categoryId: CategoryId;
  items: GameItem[];
  directItemsLimit?: number;
  pageSize?: number;
  showSearchContext?: boolean;
  save: SavePayload;
  onOwned: (item: GameItem) => void;
  onChecked: (item: GameItem) => void;
  onEdit: (item: GameItem) => void;
  onDelete: (item: GameItem) => void;
}) {
  const sortedItems = useMemo(
    () => [...items].sort((itemA, itemB) => itemA.name.localeCompare(itemB.name)),
    [items],
  );
  const letters = buildLetterGroups(sortedItems);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [openWords, setOpenWords] = useState<Set<string>>(() => new Set());
  const listTopRef = useRef<HTMLDivElement>(null);
  const availableLetters = letters.map(([letter]) => letter).join('|');
  const activeLetter = selectedLetter && letters.some(([letter]) => letter === selectedLetter)
    ? selectedLetter : null;

  useEffect(() => {
    setOpenWords(new Set());
    setSelectedLetter(null);
  }, [availableLetters, categoryId]);

  function chooseLetter(letter: string) {
    if (letter === activeLetter) return;
    setOpenWords(new Set());
    setSelectedLetter(letter);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        listTopRef.current?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    });
  }

  function toggleWord(word: string, open: boolean) {
    setOpenWords((current) => {
      const next = new Set(current);
      if (open) next.add(word);
      else next.delete(word);
      return next;
    });
  }

  if (!letters.length) return <div className="empty-collection">No items match these filters.</div>;

  if (items.length <= directItemsLimit) {
    return <ItemCards pageSize={pageSize} categoryId={categoryId} items={sortedItems} save={save}
      onOwned={onOwned} onChecked={onChecked} onEdit={onEdit} onDelete={onDelete} />;
  }

  const useLetterIndex = items.length > ALPHABETICAL_NAV_LIMIT;
  const visibleItems = useLetterIndex
    ? (activeLetter ? letters.find(([letter]) => letter === activeLetter)?.[1] ?? [] : [])
    : sortedItems;
  const wordGroups = buildFirstWordGroups(visibleItems);

  const renderWordGroups = () => (
    <div ref={listTopRef} className="alphabetical-word-list" aria-label="Browse items by name">
      {wordGroups.map(([word, groupedItems]) => (
        groupedItems.length > FIRST_WORD_ACCORDION_LIMIT ? (
          <details className="word-accordion" key={word} open={openWords.has(word)}
            onToggle={(event) => toggleWord(word, event.currentTarget.open)}>
            <summary>
              <strong>{word}</strong>
              <span>{groupedItems.length} items</span>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <ItemCards pageSize={pageSize} categoryId={categoryId} items={groupedItems} save={save}
              onOwned={onOwned} onChecked={onChecked} onEdit={onEdit} onDelete={onDelete} />
          </details>
        ) : (
          <section className="direct-word-group" key={word}>
            {wordGroups.length > 1 && <h4>{word}</h4>}
            <ItemCards pageSize={pageSize} categoryId={categoryId} items={groupedItems} save={save}
              onOwned={onOwned} onChecked={onChecked} onEdit={onEdit} onDelete={onDelete} />
          </section>
        )
      ))}
    </div>
  );

  return (
    <section className="drill-browser" aria-label="Alphabetical navigation">
      {useLetterIndex && (
        <>
          <p className="alphabetical-help">Choose a letter to browse {items.length} items.</p>
          <div className="letter-tile-grid persistent-letter-bar" aria-label="Letters">
            {letters.map(([letter, letterGroup]) => (
              <button key={letter} className={activeLetter === letter ? 'active' : ''}
                aria-pressed={activeLetter === letter} aria-label={`${letter}: ${letterGroup.length} items`} onClick={() => chooseLetter(letter)}>
                <strong>{letter}</strong><span>{letterGroup.length}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {(!useLetterIndex || activeLetter) && renderWordGroups()}
    </section>
  );
}

function buildFirstWordGroups(items: GameItem[]): Array<[string, GameItem[]]> {
  const groups = new Map<string, GameItem[]>();
  for (const item of items) {
    const firstWord = item.name.trim().split(/\s+/)[0]?.replace(/^["'“”]+|["'“”]+$/g, '') || 'Other';
    groups.set(firstWord, [...(groups.get(firstWord) ?? []), item]);
  }
  return Array.from(groups.entries()).sort(([wordA], [wordB]) => wordA.localeCompare(wordB));
}

function AddItemRow({
  category, activeZone, existingItems, onAdd,
}: {
  category: string;
  activeZone: ActiveZone;
  existingItems: GameItem[];
  onAdd: (item: Omit<GameItem, 'id'>) => void;
}) {
  const [name, setName] = useState('');
  const [universe, setUniverse] = useState('');
  const [zone, setZone] = useState<string>(activeZone === 'all' ? 'DREAMLIGHT VALLEY' : activeZone);
  const [newZone, setNewZone] = useState('');
  const [creatingZone, setCreatingZone] = useState(false);
  const [addedZones, setAddedZones] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const universes = Array.from(new Set(existingItems.map((item) => item.meta?.trim()).filter((x): x is string => !!x))).sort();
  const zones = Array.from(new Set([...ZONE_OPTIONS, ...existingItems.map((item) => item.meta2?.trim() ?? '').filter(Boolean), ...addedZones]));
  const duplicate = existingItems.some((item) => normalizeText(item.name) === normalizeText(name.trim()) &&
    normalizeText(item.meta ?? '') === normalizeText(universe.trim()) && normalizeZone(item.meta2) === normalizeZone(zone));

  useEffect(() => {
    if (activeZone !== 'all') setZone(activeZone);
  }, [activeZone]);

  function submit() {
    if (!name.trim() || !universe.trim() || !zone.trim() || duplicate) return;
    onAdd({ name: name.trim(), meta: universe.trim(), meta2: zone });
    setNotice(`Added ${name.trim()}`);
    setName('');
    nameInput.current?.focus();
  }

  return (
    <div className="quick-add">
      <label>Item name
        <input ref={nameInput} autoCapitalize="words" value={name} onChange={(event) => { setName(event.target.value); setNotice(''); }}
          onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} placeholder={`New ${category.toLowerCase()} item`} />
      </label>
      <label>Universe
        <input list="collection-universe-options" autoCapitalize="words" value={universe} onChange={(event) => setUniverse(event.target.value)}
          placeholder="Choose or type a universe" />
        <datalist id="collection-universe-options">{universes.map((value) => <option key={value} value={value} />)}</datalist>
      </label>
      <label>Zone / Expansion
        <select value={zone} onChange={(event) => setZone(event.target.value)}>
          {zones.map((value) => <option key={value} value={value}>{formatZoneLabel(value)}</option>)}
        </select>
      </label>
      {creatingZone ? (
        <div className="quick-add-zone">
          <input value={newZone} onChange={(event) => setNewZone(event.target.value)} placeholder="New expansion / zone" />
          <button type="button" disabled={!newZone.trim()} onClick={() => {
            const value = newZone.trim().toUpperCase();
            if (!zones.includes(value)) setAddedZones((current) => [...current, value]);
            setZone(value); setNewZone(''); setCreatingZone(false);
          }}>Save zone</button>
          <button type="button" onClick={() => setCreatingZone(false)}>Cancel</button>
        </div>
      ) : <button type="button" className="quick-add-secondary" onClick={() => setCreatingZone(true)}>+ Add a zone</button>}
      {duplicate && <p role="alert">This item already exists in this universe and zone.</p>}
      {notice && <p role="status">{notice}</p>}
      <button type="button" className="quick-add-submit" disabled={!name.trim() || !universe.trim() || !zone.trim() || duplicate}
        onClick={submit}><Plus size={17} /> Save & add another</button>
    </div>
  );
}

function GithubSaveSheet({ save, onClose, onRestore }: {
  save: SavePayload; onClose: () => void;
  onRestore: (cloudSave: SavePayload, totals: Record<string, number>) => void;
}) {
  const [user, setUser] = useState('angels00607');
  const [repo, setRepo] = useState('DLV');
  const [filename, setFilename] = useState('index.html');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setError] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [restorePreview, setRestorePreview] = useState<{ save: SavePayload; totals: Record<string, number> } | null>(null);

  useEffect(() => {
    try {
      const cfg = JSON.parse(localStorage.getItem(GH_STORAGE_KEY) || '{}') as Partial<{
        user: string;
        repo: string;
        filename: string;
        token: string;
      }>;
      setUser(cfg.user || 'angels00607');
      setRepo(cfg.repo || 'DLV');
      setFilename(cfg.filename || 'index.html');
      setToken('');
    } catch {
      // Keep defaults.
    }
  }, []);

  async function submit() {
    if (!user.trim() || !repo.trim() || !token.trim()) {
      setError(true);
      setStatus('Fill in all required fields.');
      return;
    }

    setSaving(true);
    setError(false);
    setStatus('Preparing data...');
    localStorage.setItem(GH_STORAGE_KEY, JSON.stringify({ user, repo, filename }));

    try {
      const repository = `${user.trim()}/${repo.trim()}`;
      const sourceDataPath = getDataPathFromFilename(filename.trim() || 'index.html');
      const payload = buildPortableData(save);
      const stamp = new Date().toLocaleString();

      setStatus('Sending public/data.json...');
      await uploadGithubFile(repository, 'public/data.json', token.trim(), payload, `Save DLV data - ${stamp}`);

      setStatus('Sending docs/data.json...');
      await uploadGithubFile(repository, 'docs/data.json', token.trim(), payload, `Deploy DLV data - ${stamp}`);

      if (sourceDataPath !== 'public/data.json' && sourceDataPath !== 'docs/data.json') {
        setStatus('Sending data.json...');
        await uploadGithubFile(repository, sourceDataPath, token.trim(), payload, `Save DLV data - ${stamp}`);
      }

      setStatus('Saved on GitHub.');
      setTimeout(onClose, 900);
    } catch (error) {
      setError(true);
      setStatus(error instanceof Error ? error.message : 'GitHub save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadCollection() {
    if (!user.trim() || !repo.trim() || !token.trim()) { setError(true); setStatus('Enter repository and token.'); return; }
    setSaving(true); setError(false);
    try {
      const repository = `${user.trim()}/${repo.trim()}`;
      const payload = JSON.stringify({
        schema: 'dlv-owned-collection-v1',
        collection: save,
        manualTotals: readManualTotals(),
        ownedOnly: localStorage.getItem(COLLECTION_MODE_KEY) === '1',
        savedAt: new Date().toISOString(),
      }, null, 2);
      localStorage.setItem(GH_STORAGE_KEY, JSON.stringify({ user, repo, filename }));
      await uploadGithubFile(repository, CLOUD_COLLECTION_PATH, token.trim(), payload, 'Back up personal DLV collection');
      setStatus('Personal collection and totals saved to GitHub.');
    } catch (error) { setError(true); setStatus(error instanceof Error ? error.message : 'Backup failed.'); }
    finally { setSaving(false); }
  }

  async function previewCloudCollection() {
    if (!user.trim() || !repo.trim() || !token.trim()) { setError(true); setStatus('Enter repository and token.'); return; }
    setLoading(true); setError(false); setRestorePreview(null);
    try {
      const repository = `${user.trim()}/${repo.trim()}`;
      const response = await fetch(`https://api.github.com/repos/${repository}/contents/${CLOUD_COLLECTION_PATH}`, {
        headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/vnd.github.raw+json' },
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`Could not read cloud collection (HTTP ${response.status}).`);
      const data = await response.json() as {
        schema?: string; collection?: SavePayload; manualTotals?: Record<string, number>; ownedOnly?: boolean;
      };
      if (data.schema !== 'dlv-owned-collection-v1' || !data.ownedOnly || !data.collection ||
        !data.collection.data || !data.collection.owned || !data.collection.nextId ||
        !data.collection.checked || !data.collection.ingredients || !data.collection.deletedIds ||
        !data.manualTotals || typeof data.manualTotals !== 'object' || Array.isArray(data.manualTotals)) {
        throw new Error('Cloud file is not a valid migrated personal collection. No local data changed.');
      }
      const totals = Object.fromEntries(Object.entries(data.manualTotals).filter(([, value]) =>
        typeof value === 'number' && Number.isSafeInteger(value) && value >= 0,
      )) as Record<string, number>;
      setRestorePreview({ save: data.collection, totals });
      setStatus('Cloud collection ready to review. Restoring will replace local data on this device.');
    } catch (error) { setError(true); setStatus(error instanceof Error ? error.message : 'Could not load cloud collection.'); }
    finally { setLoading(false); }
  }

  return (
    <aside className="sheet github-sheet" role="dialog" aria-modal="true" aria-label="Save on GitHub">
      <div className="sheet-card github-card">
        <div className="sheet-head">
          <h2>
            <Github size={19} />
            Save on GitHub
          </h2>
          <button type="button" className="icon-button" aria-label="Close GitHub save" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="github-help">
          Back up or restore your personal collection and manual totals using your GitHub token. The token stays in this form and is not saved.
        </p>
        <label>
          <span>GitHub user</span>
          <input autoCapitalize="none" autoCorrect="off" spellCheck={false} value={user} onChange={(event) => setUser(event.target.value)} />
        </label>
        <label>
          <span>Repository name</span>
          <input autoCapitalize="none" autoCorrect="off" spellCheck={false} value={repo} onChange={(event) => setRepo(event.target.value)} />
        </label>
        <label>
          <span>File name</span>
          <input autoCapitalize="none" autoCorrect="off" spellCheck={false} value={filename} onChange={(event) => setFilename(event.target.value)} />
        </label>
        <label>
          <span>GitHub token</span>
          <input type="password" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={token} onChange={(event) => setToken(event.target.value)} />
        </label>
        <p role="note">Privacy: this file is committed to your GitHub repository. If the repository is public, your collection backup will be publicly readable. Use a private repository for private backups.</p>
        <div className="github-actions">
          <button className="action-button primary" disabled={isSaving || isLoading} onClick={uploadCollection}>Back up collection</button>
          <button className="action-button" disabled={isSaving || isLoading} onClick={previewCloudCollection}>Load cloud backup</button>
        </div>
        {restorePreview && (
          <div className="cloud-restore-confirm">
            <p>Cloud: {Object.values(restorePreview.save.data).reduce((sum, items) => sum + (items?.length ?? 0), 0)} items.
              Local: {Object.values(save.data).reduce((sum, items) => sum + (items?.length ?? 0), 0)} items.</p>
            <p>Restoring will replace the collection and totals on this device. A local copy is kept before replacement.</p>
            <button className="action-button primary" onClick={() => onRestore(restorePreview.save, restorePreview.totals)}>Confirm restore on this device</button>
            <button className="action-button" onClick={() => setRestorePreview(null)}>Cancel restore</button>
          </div>
        )}
        {status && <p className={`github-status ${isError ? 'error' : ''}`}>{status}</p>}
        <div className="github-actions">
          <button className="action-button" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button className="action-button primary" onClick={submit} disabled={isSaving}>
            {isSaving ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </aside>
  );
}

function ItemCards({
  categoryId,
  items,
  pageSize = 12,
  showSearchContext = false,
  save,
  onOwned,
  onChecked,
  onEdit,
  onDelete,
}: {
  categoryId: CategoryId;
  items: GameItem[];
  pageSize?: number;
  showSearchContext?: boolean;
  save: SavePayload;
  onOwned: (item: GameItem) => void;
  onChecked: (item: GameItem) => void;
  onEdit: (item: GameItem) => void;
  onDelete: (item: GameItem) => void;
}) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <div className="paged-item-collection">
      <div className="item-grid direct-item-grid">
      {visibleItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          showSearchContext={showSearchContext}
          owned={save.owned[categoryId]?.[item.id]}
          checklist={categoryId === 'meals' || categoryId === 'crafting'}
          checked={!!save.checked[categoryId]?.[item.id] || ((categoryId === 'meals' || categoryId === 'crafting') && save.owned[categoryId]?.[item.id] === 'owned')}
          ingredients={save.ingredients[categoryId]?.[item.id] ?? []}
          stars={categoryId === 'meals' ? item.stars : undefined}
          onOwned={() => onOwned(item)}
          onChecked={() => onChecked(item)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      ))}
      </div>
      {pageCount > 1 && (
        <nav className="collection-pagination" aria-label="Item pages">
          <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage} of {pageCount}</span>
          <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button>
        </nav>
      )}
    </div>
  );
}

function ItemCard({
  item,
  showSearchContext = false,
  owned,
  checklist = false,
  checked,
  ingredients,
  stars,
  onOwned,
  onChecked,
  onEdit,
  onDelete,
}: {
  item: GameItem;
  showSearchContext?: boolean;
  owned?: 'owned' | 'missing';
  checklist?: boolean;
  checked: boolean;
  ingredients: string[];
  stars?: number;
  onOwned: () => void;
  onChecked: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <article className={`item-card ${owned ?? ''} ${checked ? 'checked' : ''}`}>
      {checklist ? (
        <button className="state-button" aria-pressed={checked} aria-label={`${item.name}: ${checked ? 'checked' : 'unchecked'}. Toggle check`} title={checked ? 'Checked' : 'Unchecked'} onClick={onChecked}>
          {checked ? <Check size={17} /> : null}
        </button>
      ) : (
      <button className="state-button" aria-label={`${item.name}: ${owned === 'owned' ? 'collected' : owned === 'missing' ? 'marked missing' : 'not marked'}. Change collection status`} title={owned === 'owned' ? 'Collected' : owned === 'missing' ? 'Missing' : 'Not marked'} onClick={onOwned}>
        {owned === 'owned' ? <Check size={17} /> : owned === 'missing' ? <X size={17} /> : null}
      </button>
      )}
      <div className="item-body">
        <button className="item-title-button" aria-pressed={checked} aria-label={`${item.name}: ${checked ? 'checked' : 'unchecked'}. Toggle check`} onClick={onChecked}>
        <strong>{item.name}</strong>
        <span className="item-meta-row">
          {showSearchContext ? (
            <>
              <span>{item.meta?.trim() || 'Other'}</span>
              <span>{item.meta2?.trim() ? formatZoneLabel(item.meta2.trim()) : 'Zone unspecified'}</span>
            </>
          ) : (
            <span>{item.meta2 || item.meta || 'Dreamlight Valley'}</span>
          )}
          {stars !== undefined && (
            <span className="meal-stars" role="img" aria-label={`${stars} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => (
                <i key={index} className={index < stars ? 'filled' : ''} aria-hidden="true">★</i>
              ))}
            </span>
          )}
        </span>
        </button>
        {ingredients.length > 0 && (
          <span className="ingredient-preview" aria-label={`Recipe: ${ingredients.join(', ')}`}>
            {ingredients.map((ingredient, index) => (
              <i key={`${ingredient}-${index}`}>{ingredient}</i>
            ))}
          </span>
        )}
      </div>
      <div className={`item-actions ${actionsOpen ? 'open' : ''}`}>
        <button className="mini-button item-menu-button" aria-label={`Actions for ${item.name}`} aria-expanded={actionsOpen} onClick={() => setActionsOpen(!actionsOpen)}>
          <MoreHorizontal size={17} />
        </button>
        {actionsOpen && (
          <>
            <button className="mini-button" aria-label={`Edit ${item.name}`} onClick={onEdit}>
              <Edit3 size={16} />
            </button>
            <button className="mini-button danger" aria-label={`Delete ${item.name}`} onClick={onDelete}>
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function HomeView({
  save,
  activeZone,
  totalProgress,
  manualTotals,
  onSetTotal,
  onOpenCategory,
}: {
  save: SavePayload;
  activeZone: ActiveZone;
  totalProgress: { done: number; total: number; percent: number };
  manualTotals: Record<string, number>;
  onSetTotal: (category: CategoryId, zone: string, universe: string, value: number | null) => void;
  onOpenCategory: (categoryId: CategoryId) => void;
}) {
  const missing = Math.max(0, totalProgress.total - totalProgress.done);
  const missingMarked = CATEGORIES.reduce(
    (count, category) =>
      count + getMarkedMissing(filterByZone(save.data[category.id] ?? [], activeZone), save, category.id),
    0,
  );
  const zoneLabel = formatZoneLabel(activeZone);

  return (
    <main className="content">
      <section className="home-hero">
        <div>
          <p className="eyebrow">{activeZone === 'all' ? 'Overview' : zoneLabel}</p>
          <h2>{Math.round(totalProgress.percent)}% complete</h2>
          <p>{totalProgress.done} collected out of {totalProgress.total} tracked items.</p>
        </div>
        <div className="progress-ring hero-ring" style={{ '--progress': `${totalProgress.percent * 3.6}deg` } as React.CSSProperties}>
          {Math.round(totalProgress.percent)}%
        </div>
      </section>

      <section className="home-stats" aria-label="Collection summary">
        <div className="home-stat"><strong>{totalProgress.done}</strong><span>Owned items</span></div>
        <div className="home-stat"><strong>{missing}</strong><span>To collect</span></div>
        {missingMarked > 0 && <div className="home-stat"><strong>{missingMarked}</strong><span>Marked missing</span></div>}
      </section>

      <section className="collection-group">
        <div className="home-section-title">Your collections</div>
        <div className="home-category-list">
          {CATEGORIES.map((category) => {
            const progress = getUniverseProgress(filterByZone(save.data[category.id] ?? [], activeZone), save, category.id, manualTotals);
            return (
              <button key={category.id} className="home-category-row" onClick={() => onOpenCategory(category.id)}>
                <img src={category.icon} alt="" onError={(event) => (event.currentTarget.style.display = 'none')} />
                <span>{category.label}</span>
                <small>{progress.done}/{progress.total} · {Math.round(progress.percent)}%</small>
                <div className="home-bar"><i style={{ width: `${progress.percent}%` }} /></div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function EditSheet({
  item,
  supportsRecipe,
  categoryLabel,
  initialIngredients,
  onClose,
  onSave,
}: {
  item: GameItem;
  supportsRecipe: boolean;
  categoryLabel: string;
  initialIngredients: string[];
  onClose: () => void;
  onSave: (item: GameItem, ingredients?: string[]) => void;
}) {
  const [draft, setDraft] = useState<GameItem>(item);
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [focusedIngredient, setFocusedIngredient] = useState<number | null>(null);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(0);

  useEffect(() => {
    setDraft(item);
    setIngredients(initialIngredients);
  }, [item, initialIngredients]);

  function updateIngredient(index: number, value: string) {
    setIngredients((current) => current.map((ingredient, ingredientIndex) =>
      ingredientIndex === index ? value : ingredient,
    ));
  }

  function removeIngredient(index: number) {
    setIngredients((current) => current.filter((_, ingredientIndex) => ingredientIndex !== index));
    setFocusedIngredient(null);
  }

  function selectIngredient(index: number, ingredient: string) {
    const currentValue = ingredients[index] ?? '';
    const firstLetterIndex = currentValue.search(/\p{L}/u);
    const preservedPrefix = firstLetterIndex === -1
      ? currentValue
      : currentValue.slice(0, firstLetterIndex);
    updateIngredient(index, `${preservedPrefix}${ingredient}`);
    setFocusedIngredient(null);
    setHighlightedSuggestion(0);
  }

  return (
    <aside className="sheet" role="dialog" aria-modal="true" aria-label={`Edit ${item.name}`}>
      <form
        className="sheet-card edit-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (draft.name.trim()) onSave({ ...draft, name: draft.name.trim() }, supportsRecipe ? ingredients : undefined);
        }}
      >
        <div className="sheet-head">
          <div>
            <p className="eyebrow">{categoryLabel}</p>
            <h2>Edit item</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close editor" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <label>
          <span>Name</span>
          <input autoCapitalize="words" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        </label>
        <label>
          <span>Group</span>
          <input autoCapitalize="words" value={draft.meta ?? ''} onChange={(event) => setDraft({ ...draft, meta: event.target.value })} />
        </label>
        <label>
          <span>Universe / zone</span>
          <input autoCapitalize="words" value={draft.meta2 ?? ''} onChange={(event) => setDraft({ ...draft, meta2: event.target.value })} />
        </label>
        {supportsRecipe && (
          <fieldset className="recipe-editor">
            <div className="recipe-editor-head">
              <div>
                <legend>Recipe ingredients</legend>
                <small>Add one ingredient per line.</small>
              </div>
              <button
                type="button"
                className="ingredient-add-button"
                onClick={() => setIngredients((current) => [...current, ''])}
              >
                <Plus size={16} />
                Add ingredient
              </button>
            </div>
            <div className="ingredient-fields">
              {ingredients.length === 0 && (
                <button
                  type="button"
                  className="recipe-empty-state"
                  onClick={() => setIngredients([''])}
                >
                  <Plus size={18} />
                  Add the first ingredient
                </button>
              )}
              {ingredients.map((ingredient, index) => {
                const suggestions = focusedIngredient === index
                  ? getIngredientSuggestions(ingredient)
                  : [];
                const suggestionListId = `ingredient-suggestions-${index}`;
                return (
                  <div className="ingredient-autocomplete" key={index}>
                    <div className="ingredient-field">
                      <span>{index + 1}</span>
                      <input
                        role="combobox"
                        aria-label={`Ingredient ${index + 1}`}
                        aria-autocomplete="list"
                        aria-expanded={suggestions.length > 0}
                        aria-controls={suggestions.length > 0 ? suggestionListId : undefined}
                        autoCapitalize="words"
                        autoComplete="off"
                        value={ingredient}
                        onFocus={() => {
                          setFocusedIngredient(index);
                          setHighlightedSuggestion(0);
                        }}
                        onBlur={() => window.setTimeout(() => setFocusedIngredient(null), 150)}
                        onChange={(event) => {
                          updateIngredient(index, event.target.value);
                          setFocusedIngredient(index);
                          setHighlightedSuggestion(0);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') setFocusedIngredient(null);
                          if (event.key === 'ArrowDown' && suggestions.length > 0) {
                            event.preventDefault();
                            setHighlightedSuggestion((current) => Math.min(current + 1, suggestions.length - 1));
                          }
                          if (event.key === 'ArrowUp' && suggestions.length > 0) {
                            event.preventDefault();
                            setHighlightedSuggestion((current) => Math.max(current - 1, 0));
                          }
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            if (suggestions.length > 0) {
                              selectIngredient(index, suggestions[highlightedSuggestion] ?? suggestions[0]);
                            } else {
                              setIngredients((current) => [...current, '']);
                              setFocusedIngredient(null);
                            }
                          }
                        }}
                        placeholder="Ingredient name"
                        autoFocus={index === ingredients.length - 1 && !ingredient}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ingredient ${index + 1}`}
                        onClick={() => removeIngredient(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {suggestions.length > 0 && (
                      <div className="ingredient-suggestions" id={suggestionListId} role="listbox">
                        {suggestions.map((suggestion, suggestionIndex) => (
                          <button
                            type="button"
                            role="option"
                            className={suggestionIndex === highlightedSuggestion ? 'active' : ''}
                            aria-selected={suggestionIndex === highlightedSuggestion}
                            key={suggestion}
                            onPointerDown={(event) => event.preventDefault()}
                            onClick={() => selectIngredient(index, suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}
        <button className="action-button primary" type="submit">
          <Save size={18} />
          Save changes
        </button>
      </form>
    </aside>
  );
}

function getIngredientSuggestions(value: string): string[] {
  const withoutNumbers = normalizeText(value).replace(/\d/g, '');
  const firstLetterIndex = withoutNumbers.search(/[a-z]/i);
  if (firstLetterIndex === -1) return [];

  const query = withoutNumbers.slice(firstLetterIndex).trim();
  if (!query) return [];

  return INGREDIENT_OPTIONS
    .map((ingredient) => ({
      ingredient,
      normalized: normalizeText(ingredient),
    }))
    .filter(({ normalized }) => normalized.includes(query))
    .sort((optionA, optionB) => {
      const startsA = optionA.normalized.startsWith(query);
      const startsB = optionB.normalized.startsWith(query);
      if (startsA !== startsB) return startsA ? -1 : 1;
      return optionA.ingredient.localeCompare(optionB.ingredient);
    })
    .slice(0, 8)
    .map(({ ingredient }) => ingredient);
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button className={`chip ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

function filterItems(items: GameItem[], filters: FilterState, save: SavePayload | null, categoryId: CategoryId) {
  const query = normalizeText(filters.query);
  return items.filter((item) => {
    const haystack = normalizeText(`${item.name} ${item.meta ?? ''} ${item.meta2 ?? ''}`);
    const owned = save?.owned[categoryId]?.[item.id];
    const checked = save?.checked[categoryId]?.[item.id];
    if (query && !haystack.includes(query)) return false;
    if (filters.status === 'owned' && owned !== 'owned') return false;
    if (filters.status === 'missing' && owned !== 'missing') return false;
    if (filters.status === 'unchecked' && checked) return false;
    if (filters.universe !== 'all' && item.meta?.trim() !== filters.universe) return false;
    if (filters.group !== 'all' && item.meta !== filters.group) return false;
    return true;
  });
}

function filterByZone(items: GameItem[], zone: ActiveZone): GameItem[] {
  if (zone === 'all') return items;
  return items.filter((item) => normalizeZone(item.meta2) === zone);
}

function normalizeZone(value?: string): ActiveZone | string {
  return (value ?? '').trim().toUpperCase();
}

function formatZoneLabel(zone: ActiveZone | string): string {
  if (zone === 'all') return 'All zones';
  return zone.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function groupItems(items: GameItem[], field: keyof GameItem): Array<[string, GameItem[]]> {
  const map = new Map<string, GameItem[]>();
  for (const item of items) {
    const group = String(item[field] || 'Other');
    map.set(group, [...(map.get(group) ?? []), item]);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

const SKIPPED_WORDS = new Set(['a', 'an', 'and', 'of', 'the', 'with']);

function buildLetterGroups(items: GameItem[]): Array<[string, GameItem[]]> {
  const map = new Map<string, GameItem[]>();
  for (const item of items) {
    const letter = getLetterKey(item.name);
    map.set(letter, [...(map.get(letter) ?? []), item]);
  }
  return Array.from(map.entries()).sort(([a], [b]) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });
}

function buildWordGroups(items: GameItem[]): Array<[string, GameItem[]]> {
  const map = new Map<string, GameItem[]>();
  for (const item of items) {
    const word = getSimilarWord(item.name);
    map.set(word, [...(map.get(word) ?? []), item]);
  }
  return Array.from(map.entries()).sort(([wordA], [wordB]) => wordA.localeCompare(wordB));
}

function getLetterKey(name: string): string {
  const normalized = normalizeText(name).replace(/\s+/g, '');
  const first = normalized[0]?.toUpperCase();
  return first && /^[A-Z]$/.test(first) ? first : '#';
}

function getSimilarWord(name: string): string {
  const words = normalizeText(name)
    .split(' ')
    .filter((word) => word.length > 1 && !SKIPPED_WORDS.has(word));
  return titleCase(words[0] ?? 'Other');
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getDataPathFromFilename(filename: string): string {
  if (!filename || filename === 'index.html') return 'public/data.json';
  if (filename.endsWith('/data.json') || filename === 'data.json') return filename;
  if (filename.includes('/')) return filename.replace(/[^/]+$/, 'data.json');
  return 'public/data.json';
}

function readNavigationState(): { activeView: ActiveView; activeZone: ActiveZone; activeGroup: string } {
  try {
    const parsed = JSON.parse(localStorage.getItem(NAV_STORAGE_KEY) ?? '{}') as Partial<{
      activeView: ActiveView;
      activeZone: ActiveZone;
      activeGroup: string;
    }>;
    const requestedView = parsed.activeView;
    const requestedZone = parsed.activeZone;
    const activeView: ActiveView = requestedView && (
      requestedView === 'home' || CATEGORIES.some(({ id }) => id === requestedView)
    )
      ? requestedView
      : 'home';
    const activeZone: ActiveZone = requestedZone && ZONES.some(({ value }) => value === requestedZone)
      ? requestedZone
      : 'all';
    return { activeView, activeZone, activeGroup: parsed.activeGroup || 'all' };
  } catch {
    return { activeView: 'home', activeZone: 'all', activeGroup: 'all' };
  }
}

function readScrollPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(`${NAV_STORAGE_KEY}:scroll`) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function encodeGithubContent(content: string): string {
  return btoa(unescape(encodeURIComponent(content)));
}

async function getGithubFileSha(repository: string, path: string, token: string): Promise<string | null> {
  const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub error ${response.status} while reading ${path}.`);
  const payload = (await response.json()) as { sha?: string };
  return payload.sha ?? null;
}

async function uploadGithubFile(repository: string, path: string, token: string, content: string, message: string) {
  const sha = await getGithubFileSha(repository, path, token);
  const body: { message: string; content: string; sha?: string } = {
    message,
    content: encodeGithubContent(content),
  };
  if (sha) body.sha = sha;

  const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = ((await response.json()) as { message?: string }).message ?? '';
    } catch {
      // Ignore JSON parsing errors and fall through to generic message.
    }
    throw new Error(detail || `GitHub error ${response.status} while writing ${path}.`);
  }
}

function toggleAccordion(
  openGroups: Record<string, boolean>,
  key: string,
  parentKeys: string[] = [],
): Record<string, boolean> {
  const isOpen = !!openGroups[key];
  const next = Object.fromEntries(parentKeys.map((parentKey) => [parentKey, true]));
  if (!isOpen) next[key] = true;
  return next;
}

const MANUAL_TOTALS_KEY = 'dlv_manual_collection_totals_v1';
function universeTotalKey(category: CategoryId, zone: string, universe: string) {
  return JSON.stringify([category, normalizeZone(zone), universe.trim()]);
}
function getUniverseDisplayProgress(universe: string, items: GameItem[], save: SavePayload, category: CategoryId, totals: Record<string, number>) {
  if (items.length) return getUniverseProgress(items, save, category, totals);
  // Empty universes may come from custom entries or older manual totals.
  const zones = new Set((save.customUniverses?.[category] ?? [])
    .filter((entry) => entry.name === universe)
    .map((entry) => normalizeZone(entry.zone)));
  for (const key of Object.keys(totals)) {
    try {
      const parsed: unknown = JSON.parse(key);
      if (Array.isArray(parsed) && parsed[0] === category && parsed[2] === universe && typeof parsed[1] === 'string') zones.add(parsed[1]);
    } catch { /* Ignore unrelated stored keys. */ }
  }
  const total = [...zones].reduce((sum, zone) => sum + (totals[universeTotalKey(category, zone, universe)] ?? 0), 0);
  return { done: 0, total, percent: 0 };
}
function getUniverseProgress(items: GameItem[], save: SavePayload | null, category: CategoryId, totals: Record<string, number>) {
  const groups = new Map<string, GameItem[]>();
  for (const item of items) {
    const key = universeTotalKey(category, item.meta2 ?? 'DREAMLIGHT VALLEY', item.meta || 'Other');
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  let done = 0, total = 0;
  for (const [key, entries] of groups) {
    done += entries.filter((item) => category === 'meals' || category === 'crafting' ? !!save?.checked[category]?.[item.id] || save?.owned[category]?.[item.id] === 'owned' : save?.owned[category]?.[item.id] === 'owned').length;
    total += totals[key] ?? entries.length;
  }
  return { done, total, percent: total ? Math.min(100, done / total * 100) : 0 };
}
function readManualTotals(): Record<string, number> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(MANUAL_TOTALS_KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) =>
      typeof value === 'number' && Number.isSafeInteger(value) && value >= 0,
    )) as Record<string, number>;
  } catch { return {}; }
}
function TotalsAdmin({ save, manualTotals, onSetTotal, onRemove, onClose }: {
  save: SavePayload;
  manualTotals: Record<string, number>;
  onSetTotal: (category: CategoryId, zone: string, universe: string, value: number | null) => void;
  onRemove: (category: CategoryId, zone: string, universe: string) => void;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<CategoryId>(CATEGORIES[0].id);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const groups = groupItems(save.data[category] ?? [], 'meta');
  const catalogEntries = groups.flatMap(([universe, items]) =>
    Array.from(new Set(items.map((item) => normalizeZone(item.meta2) || 'DREAMLIGHT VALLEY')))
      .map((zone) => ({ universe, zone }))
  );
  // Empty custom universes have no items, but must still be editable in Totals.
  const customEntries = (save.customUniverses?.[category] ?? []).map(({ name, zone }) => ({
    universe: name,
    zone: normalizeZone(zone),
  }));
  const entries = Array.from(
    new Map([...catalogEntries, ...customEntries].map((entry) => [
      universeTotalKey(category, entry.zone, entry.universe), entry,
    ])).values(),
  ).sort((a, b) => a.universe.localeCompare(b.universe) || a.zone.localeCompare(b.zone))
    .filter(({ universe, zone }) => normalizeText(`${universe} ${zone}`).includes(normalizeText(query)));
  const pageCount = Math.max(1, Math.ceil(entries.length / 12));
  const currentPage = Math.min(page, pageCount);
  return (
    <aside className="sheet totals-admin-sheet" role="dialog" aria-modal="true" aria-label="Manage totals">
      <div className="sheet-card totals-admin-card">
        <div className="sheet-head"><div><p className="eyebrow">Collection management</p><h2>Manage totals</h2></div>
          <button className="icon-button" aria-label="Close totals" onClick={onClose}><X size={20}/></button>
        </div>
        <p className="totals-admin-description">Edit the expected number of items for each universe and zone. Your collection stays unchanged.</p>
        <label className="totals-admin-field">Category
          <select value={category} onChange={(event) => { setCategory(event.target.value as CategoryId); setPage(1); }}>
            {CATEGORIES.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
          </select>
        </label>
        <label className="totals-admin-field">Find a universe or zone
          <input type="search" value={query} placeholder="Search…" onChange={(event) => { setQuery(event.target.value); setPage(1); }}/>
        </label>
        <p className="totals-admin-description">{entries.length} universe/zone totals</p>
        <div className="totals-admin-entries">
          {entries.slice((currentPage - 1) * 12, currentPage * 12).map(({ universe, zone }) => (
            <div className="totals-admin-entry" key={universeTotalKey(category, zone, universe)}>
              <strong>{universe}</strong>
              {(save.customUniverses?.[category] ?? []).some((entry) => entry.name === universe && normalizeZone(entry.zone) === zone) && !(save.data[category] ?? []).some((item) => (item.meta || 'Other') === universe && normalizeZone(item.meta2) === zone) && (
                <button type="button" className="universe-remove-button" onClick={() => onRemove(category, zone, universe)}><Trash2 size={15}/> Delete empty universe</button>
              )}
              <ManualTotalEditor category={category} zone={zone} universe={universe}
                value={manualTotals[universeTotalKey(category, zone, universe)]} onChange={onSetTotal} />
            </div>
          ))}
          {entries.length === 0 && <p className="empty-collection">No matching universes.</p>}
        </div>
        {pageCount > 1 && <nav className="collection-pagination" aria-label="Total editor pages">
          <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage} of {pageCount}</span>
          <button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button>
        </nav>}
      </div>
    </aside>
  );
}

function ManualTotalEditor({ category, zone, universe, value, onChange }: {
  category: CategoryId; zone: string; universe: string; value: number | undefined;
  onChange: (category: CategoryId, zone: string, universe: string, value: number | null) => void;
}) {
  return <label className="manual-total-editor" onClick={(event) => event.stopPropagation()}>
    Total · {formatZoneLabel(zone)} <input type="number" min="0" step="1" inputMode="numeric" aria-label={`Total for ${universe} in ${formatZoneLabel(zone)}`}
      placeholder="Set total" value={value ?? ''} onChange={(event) => {
        const raw = event.target.value;
        if (!raw) onChange(category, zone, universe, null);
        else if (/^\d+$/.test(raw) && Number.isSafeInteger(Number(raw))) onChange(category, zone, universe, Number(raw));
      }} />
  </label>;
}
function getProgress(items: GameItem[], save: SavePayload | null, categoryId: CategoryId, manualTotal?: number) {
  const done = items.filter((item) => save?.owned[categoryId]?.[item.id] === 'owned').length;
  const total = manualTotal ?? items.length;
  return { done, total, percent: total ? Math.min(100, (done / total) * 100) : 0 };
}

function getMarkedMissing(items: GameItem[], save: SavePayload | null, categoryId: CategoryId) {
  return items.filter((item) => save?.owned[categoryId]?.[item.id] === 'missing').length;
}

function getTotalProgress(save: SavePayload | null, zone: ActiveZone = 'all', manualTotals: Record<string, number> = {}) {
  const parts = CATEGORIES.map((category) => getUniverseProgress(
    filterByZone(save?.data[category.id] ?? [], zone), save, category.id, manualTotals,
  ));
  const done = parts.reduce((sum, part) => sum + part.done, 0);
  const total = parts.reduce((sum, part) => sum + part.total, 0);
  return { done, total, percent: total ? Math.min(100, (done / total) * 100) : 0 };
}
