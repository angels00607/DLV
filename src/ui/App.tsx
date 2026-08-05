import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
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
import { downloadSave, readImportedFile } from '../data/manualImport';
import { buildPortableData, getNextId, loadSave, mergeImportedSave, persistSave } from '../data/saveSystem';
import { normalizeText } from '../lib/text';

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
const GH_STORAGE_KEY = 'dlv_gh_config';
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
  const initialNav = readNavigationState();
  const [activeView, setActiveView] = useState<ActiveView>(initialNav.activeView);
  const [activeZone, setActiveZone] = useState<ActiveZone>(initialNav.activeZone);
  const [activeGroup, setActiveGroup] = useState(initialNav.activeGroup);
  const [starFilter, setStarFilter] = useState<StarFilter>('all');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [editingItem, setEditingItem] = useState<GameItem | null>(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isGithubOpen, setGithubOpen] = useState(false);
  const [isZoneOpen, setZoneOpen] = useState(false);
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
  const groupedItems = useMemo(
    () => groupItems(baseFilteredItems, currentCategory.groupBy[0] ?? 'meta'),
    [baseFilteredItems, currentCategory.groupBy],
  );
  const visibleItems = useMemo(
    () => baseFilteredItems.filter((item) =>
      (activeGroup === 'all' || (item.meta || 'Other') === activeGroup) &&
      (starFilter === 'all' || (categoryId === 'meals' && item.stars === starFilter)),
    ),
    [baseFilteredItems, activeGroup, starFilter, categoryId],
  );
  const progress = useMemo(() => getProgress(zoneItems, save, categoryId), [zoneItems, save, categoryId]);
  const totalProgress = useMemo(() => getTotalProgress(save, activeZone), [save, activeZone]);

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
    next.checked[categoryId]![item.id] = !next.checked[categoryId]?.[item.id];
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
    next.data[activeView] = (next.data[activeView] ?? []).filter((entry) => entry.id !== item.id);
    delete next.checked[activeView]?.[item.id];
    delete next.owned[activeView]?.[item.id];
    delete next.ingredients[activeView]?.[item.id];
    next.deletedIds[activeView] ??= {};
    next.deletedIds[activeView]![item.id] = true;
    updateSave(next);
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
    updateSave(next);
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
        <button
          className={activeView === 'home' ? 'active' : ''}
          onClick={() => {
            setActiveView('home');
            setActiveGroup('all');
            setFilters(initialFilters);
          }}
        >
          <Home size={20} />
          <span>Home</span>
          <small>{Math.round(totalProgress.percent)}%</small>
        </button>
        {CATEGORIES.map((category) => {
          const categoryProgress = getProgress(filterByZone(save.data[category.id] ?? [], activeZone), save, category.id);
          return (
            <button
              key={category.id}
              className={category.id === activeView ? 'active' : ''}
              onClick={() => {
                setActiveView(category.id);
                setActiveGroup('all');
                setStarFilter('all');
                setFilters(initialFilters);
              }}
            >
              <img src={category.icon} alt="" onError={(event) => (event.currentTarget.style.display = 'none')} />
              <span>{category.shortLabel}</span>
              <small>{categoryProgress.done}/{categoryProgress.total}</small>
            </button>
          );
        })}
      </nav>

      <button className="zone-trigger" onClick={() => setZoneOpen(true)} aria-haspopup="dialog">
        <MapPin size={16} />
        <span>{formatZoneLabel(activeZone)}</span>
        <small>{totalProgress.done}/{totalProgress.total}</small>
        <ChevronDown size={17} />
      </button>

      {activeView === 'home' ? (
        <HomeView
          save={save}
          activeZone={activeZone}
          totalProgress={totalProgress}
          onOpenCategory={(category) => {
            setActiveView(category);
            setActiveGroup('all');
          }}
        />
      ) : (
        <main className="content">
          <div className="section-title">
            <div>
              <h2>{currentCategory.label}</h2>
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
                aria-label="Search everything"
                autoCapitalize="words"
                value={filters.query}
                onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                placeholder="Search everything"
              />
              {filters.query && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => setFilters({ ...filters, query: '' })}
                >
                  <X size={17} />
                </button>
              )}
            </div>
            <button className="filter-trigger" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={17} />
              Filters{filters.status !== 'all' || starFilter !== 'all' ? ' •' : ''}
            </button>
          </div>

          <SubcategoryNavigator
            groups={groupedItems}
            activeGroup={activeGroup}
            save={save}
            categoryId={categoryId}
            onSelect={setActiveGroup}
          />

          {activeGroup === 'all' && !filters.query ? (
            <SubcategoryGrid groups={groupedItems} save={save} categoryId={categoryId} onSelect={setActiveGroup} />
          ) : (
            <AlphabeticalCollection
              categoryId={categoryId}
              items={visibleItems}
              save={save}
              onOwned={toggleOwned}
              onChecked={toggleChecked}
              onEdit={setEditingItem}
              onDelete={deleteItem}
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
          <AddItemRow category={currentCategory.label} activeZone={activeZone} onAdd={addItem} />
        </ChoiceSheet>
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
              Save on GitHub
            </button>
            <button className="action-button" onClick={() => downloadSave(save)}>
              <Download size={18} />
              Export manual save
            </button>
            <button className="action-button" onClick={() => fileInput.current?.click()}>
              <Upload size={18} />
              Import manual save
            </button>
            <input ref={fileInput} className="hidden" type="file" accept="application/json" onChange={importFile} />
          </div>
        </aside>
      )}
      {isGithubOpen && <GithubSaveSheet save={save} onClose={() => setGithubOpen(false)} />}
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

function SubcategoryNavigator({
  groups,
  activeGroup,
  save,
  categoryId,
  onSelect,
}: {
  groups: Array<[string, GameItem[]]>;
  activeGroup: string;
  save: SavePayload;
  categoryId: CategoryId;
  onSelect: (group: string) => void;
}) {
  const total = groups.reduce((count, [, items]) => count + items.length, 0);
  return (
    <nav className="subcategory-strip" aria-label="Subcategories">
      <button className={activeGroup === 'all' ? 'active' : ''} onClick={() => onSelect('all')}>
        <span>All groups</span><small>{total}</small>
      </button>
      {groups.map(([group, items]) => {
        const progress = getProgress(items, save, categoryId);
        return (
          <button key={group} className={activeGroup === group ? 'active' : ''} onClick={() => onSelect(group)}>
            <span>{group}</span><small>{progress.done}/{progress.total}</small>
          </button>
        );
      })}
    </nav>
  );
}

function SubcategoryGrid({
  groups,
  save,
  categoryId,
  onSelect,
}: {
  groups: Array<[string, GameItem[]]>;
  save: SavePayload;
  categoryId: CategoryId;
  onSelect: (group: string) => void;
}) {
  if (!groups.length) return <div className="empty-collection">No subcategories match these filters.</div>;
  return (
    <section className="subcategory-grid" aria-label="Choose a subcategory">
      {groups.map(([group, items]) => {
        const progress = getProgress(items, save, categoryId);
        return (
          <button key={group} onClick={() => onSelect(group)}>
            <strong>{group}</strong>
            <span>{progress.total} items</span>
            <small>{progress.done} collected · {progress.total - progress.done} remaining</small>
            <i><b style={{ width: `${progress.percent}%` }} /></i>
          </button>
        );
      })}
    </section>
  );
}

function AlphabeticalCollection({
  categoryId,
  items,
  save,
  onOwned,
  onChecked,
  onEdit,
  onDelete,
}: {
  categoryId: CategoryId;
  items: GameItem[];
  save: SavePayload;
  onOwned: (item: GameItem) => void;
  onChecked: (item: GameItem) => void;
  onEdit: (item: GameItem) => void;
  onDelete: (item: GameItem) => void;
}) {
  const PAGE_SIZE = 8;
  const letters = buildLetterGroups(items);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [isWordPickerOpen, setWordPickerOpen] = useState(false);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    setSelectedLetter(null);
    setSelectedWord(null);
    setPage(0);
  }, [items]);

  if (!letters.length) return <div className="empty-collection">No items match these filters.</div>;

  const letterItems = selectedLetter
    ? letters.find(([letter]) => letter === selectedLetter)?.[1] ?? []
    : [];
  const wordGroups = buildFirstWordGroups(letterItems);
  const wordItems = selectedWord
    ? wordGroups.find(([word]) => word === selectedWord)?.[1] ?? []
    : [];
  const totalPages = Math.max(1, Math.ceil(wordItems.length / PAGE_SIZE));
  const visiblePage = wordItems.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function focusBrowser() {
    requestAnimationFrame(() =>
      document.getElementById(`collection-browser-${categoryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  }

  function chooseLetter(letter: string) {
    setSelectedLetter(letter);
    setSelectedWord(null);
    setPage(0);
    focusBrowser();
  }

  function chooseWord(word: string) {
    setSelectedWord(word);
    setPage(0);
    setWordPickerOpen(false);
    focusBrowser();
  }

  function changePage(nextPage: number) {
    setPage(Math.max(0, Math.min(totalPages - 1, nextPage)));
    focusBrowser();
  }

  if (!selectedLetter) {
    return (
      <section id={`collection-browser-${categoryId}`} className="drill-browser" aria-label="Choose a letter">
        <div className="drill-heading">
          <div><p>Browse alphabetically</p><h3>Choose a letter</h3></div>
          <small>{items.length} items</small>
        </div>
        <div className="letter-tile-grid">
          {letters.map(([letter, letterGroup]) => (
            <button key={letter} onClick={() => chooseLetter(letter)}>
              <strong>{letter}</strong>
              <span>{letterGroup.length}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (!selectedWord) {
    return (
      <section id={`collection-browser-${categoryId}`} className="drill-browser" aria-label={`Words beginning with ${selectedLetter}`}>
        <div className="drill-heading">
          <button className="drill-back" onClick={() => setSelectedLetter(null)} aria-label="Back to letters">‹</button>
          <div><p>Letter {selectedLetter}</p><h3>Choose the first word</h3></div>
          <small>{letterItems.length} items</small>
        </div>
        <div className="word-tile-grid">
          {wordGroups.map(([word, groupedWordItems]) => (
            <button key={word} onClick={() => chooseWord(word)}>
              <strong>{word}</strong>
              <span>{groupedWordItems.length} item{groupedWordItems.length === 1 ? '' : 's'}</span>
              {groupedWordItems.length > PAGE_SIZE && <small>{Math.ceil(groupedWordItems.length / PAGE_SIZE)} pages</small>}
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={`collection-browser-${categoryId}`} className="drill-browser" aria-label={`${selectedWord} items`}>
      <div className="drill-heading">
        <button className="drill-back" onClick={() => { setSelectedWord(null); setPage(0); }} aria-label="Back to first words">‹</button>
        <div>
          <p>{selectedLetter} / First word</p>
          <button className="word-switch-trigger" onClick={() => setWordPickerOpen(true)}>
            <h3>{selectedWord}</h3><ChevronDown size={15} />
          </button>
        </div>
        <small>{wordItems.length} items</small>
      </div>
      <div
        className="item-grid paged-item-grid"
        onTouchStart={(event) => { swipeStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (swipeStartX.current === null) return;
          const delta = event.changedTouches[0]?.clientX - swipeStartX.current;
          swipeStartX.current = null;
          if (Math.abs(delta) < 55) return;
          if (delta < 0 && page + 1 < totalPages) changePage(page + 1);
          if (delta > 0 && page > 0) changePage(page - 1);
        }}
      >
        {visiblePage.map((item) => (
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
      {totalPages > 1 && (
        <nav className="pagination" aria-label={`Pages for ${selectedWord}`}>
          <button disabled={page === 0} onClick={() => changePage(page - 1)}>‹ Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page + 1 >= totalPages} onClick={() => changePage(page + 1)}>Next ›</button>
        </nav>
      )}
      {isWordPickerOpen && (
        <ChoiceSheet title={`Groups in ${selectedLetter}`} onClose={() => setWordPickerOpen(false)}>
          {wordGroups.map(([word, groupedItems]) => (
            <button className={`choice-row ${word === selectedWord ? 'active' : ''}`} key={word} onClick={() => chooseWord(word)}>
              <span>{word}</span>
              <small>{groupedItems.length} items</small>
              <span />
              {word === selectedWord && <Check size={17} />}
            </button>
          ))}
        </ChoiceSheet>
      )}
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
  category,
  activeZone,
  onAdd,
}: {
  category: string;
  activeZone: ActiveZone;
  onAdd: (item: Omit<GameItem, 'id'>) => void;
}) {
  const [name, setName] = useState('');
  const [meta, setMeta] = useState('');
  const [meta2, setMeta2] = useState(activeZone === 'all' ? '' : activeZone);

  useEffect(() => {
    if (activeZone !== 'all') setMeta2(activeZone);
  }, [activeZone]);

  function submit() {
    if (!name.trim()) return;
    onAdd({ name, meta, meta2 });
    setName('');
    setMeta('');
  }

  return (
    <div className="add-item-row">
      <input
        autoCapitalize="words"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit();
        }}
        placeholder={`Add ${category.toLowerCase()}...`}
      />
      <input
        autoCapitalize="words"
        value={meta}
        onChange={(event) => setMeta(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit();
        }}
        placeholder="Tag 1"
      />
      <select value={meta2} onChange={(event) => setMeta2(event.target.value)}>
        <option value="">-- No zone --</option>
        {ZONE_OPTIONS.map((zone) => (
          <option key={zone} value={zone}>
            {formatZoneLabel(zone)}
          </option>
        ))}
      </select>
      <button onClick={submit}>
        <Plus size={17} />
        Add
      </button>
    </div>
  );
}

function GithubSaveSheet({ save, onClose }: { save: SavePayload; onClose: () => void }) {
  const [user, setUser] = useState('angels00607');
  const [repo, setRepo] = useState('DLV');
  const [filename, setFilename] = useState('index.html');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setError] = useState(false);
  const [isSaving, setSaving] = useState(false);

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
      setToken(cfg.token || '');
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
    localStorage.setItem(GH_STORAGE_KEY, JSON.stringify({ user, repo, filename, token }));

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
          data.json will be sent to GitHub with your checks, crosses, edits, and deletions.
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
  save,
  onOwned,
  onChecked,
  onEdit,
  onDelete,
}: {
  categoryId: CategoryId;
  items: GameItem[];
  save: SavePayload;
  onOwned: (item: GameItem) => void;
  onChecked: (item: GameItem) => void;
  onEdit: (item: GameItem) => void;
  onDelete: (item: GameItem) => void;
}) {
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

function ItemCard({
  item,
  owned,
  checked,
  ingredients,
  stars,
  onOwned,
  onChecked,
  onEdit,
  onDelete,
}: {
  item: GameItem;
  owned?: 'owned' | 'missing';
  checked: boolean;
  ingredients: string[];
  stars?: number;
  onOwned: () => void;
  onChecked: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <article className={`item-card ${owned ?? ''} ${checked ? 'checked' : ''}`}>
      <button className="state-button" aria-label={`Change status for ${item.name}`} onClick={onOwned}>
        {owned === 'owned' ? <Check size={17} /> : owned === 'missing' ? <X size={17} /> : null}
      </button>
      <div className="item-body">
        <button className="item-title-button" onClick={onChecked}>
        <strong>{item.name}</strong>
        <span className="item-meta-row">
          <span>{item.meta2 || item.meta || 'Dreamlight Valley'}</span>
          {stars !== undefined && (
            <span className="meal-stars" role="img" aria-label={`${stars} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => (
                <i key={index} className={index < stars ? 'filled' : ''} aria-hidden="true">★</i>
              ))}
            </span>
          )}
        </span>
        </button>
        {ingredients.length > 0 && !expanded && (
          <button className="ingredient-summary" onClick={() => setExpanded(true)}>
            {ingredients.length} ingredient{ingredients.length === 1 ? '' : 's'}
            <ChevronDown size={15} />
          </button>
        )}
        {ingredients.length > 0 && expanded && (
          <span className="ingredient-preview" aria-label={`Recipe: ${ingredients.join(', ')}`}>
            {ingredients.map((ingredient, index) => (
              <i key={`${ingredient}-${index}`}>{ingredient}</i>
            ))}
            <button className="ingredient-collapse" aria-label="Collapse ingredients" onClick={() => setExpanded(false)}>
              <ChevronDown className="rotate" size={15} />
            </button>
          </span>
        )}
      </div>
      <div className={`item-actions ${actionsOpen ? 'open' : ''}`}>
        <button className="mini-button item-menu-button" aria-label={`Actions for ${item.name}`} onClick={() => setActionsOpen(!actionsOpen)}>
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
  onOpenCategory,
}: {
  save: SavePayload;
  activeZone: ActiveZone;
  totalProgress: { done: number; total: number; percent: number };
  onOpenCategory: (categoryId: CategoryId) => void;
}) {
  const missing = totalProgress.total - totalProgress.done;
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

      <section className="overview" aria-label="Overall progress">
        <div>
          <span>{totalProgress.done}</span>
          <p>Collected</p>
        </div>
        <div>
          <span>{missing}</span>
          <p>Remaining</p>
        </div>
        <div>
          <span>{missingMarked}</span>
          <p>Marked missing</p>
        </div>
      </section>

      <section className="collection-group">
        <div className="home-section-title">Categories</div>
        <div className="home-category-list">
          {CATEGORIES.map((category) => {
            const progress = getProgress(filterByZone(save.data[category.id] ?? [], activeZone), save, category.id);
            return (
              <button key={category.id} className="home-category-row" onClick={() => onOpenCategory(category.id)}>
                <img src={category.icon} alt="" onError={(event) => (event.currentTarget.style.display = 'none')} />
                <span>{category.label}</span>
                <small>{progress.done}/{progress.total}</small>
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
              {ingredients.map((ingredient, index) => (
                <div className="ingredient-field" key={index}>
                  <span>{index + 1}</span>
                  <input
                    aria-label={`Ingredient ${index + 1}`}
                    autoCapitalize="words"
                    value={ingredient}
                    onChange={(event) => updateIngredient(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        setIngredients((current) => [...current, '']);
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
              ))}
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
    if (filters.universe !== 'all' && item.meta2 !== filters.universe) return false;
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

function getProgress(items: GameItem[], save: SavePayload | null, categoryId: CategoryId) {
  const done = items.filter((item) => save?.owned[categoryId]?.[item.id] === 'owned').length;
  const total = items.length;
  return { done, total, percent: total ? (done / total) * 100 : 0 };
}

function getMarkedMissing(items: GameItem[], save: SavePayload | null, categoryId: CategoryId) {
  return items.filter((item) => save?.owned[categoryId]?.[item.id] === 'missing').length;
}

function getTotalProgress(save: SavePayload | null, zone: ActiveZone = 'all') {
  const entries = CATEGORIES.flatMap((category) => filterByZone(save?.data[category.id] ?? [], zone));
  const done = CATEGORIES.reduce(
    (count, category) =>
      count +
      filterByZone(save?.data[category.id] ?? [], zone).filter(
        (item) => save?.owned[category.id]?.[item.id] === 'owned',
      ).length,
    0,
  );
  const total = entries.length;
  return { done, total, percent: total ? (done / total) * 100 : 0 };
}


