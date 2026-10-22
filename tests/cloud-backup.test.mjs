import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMigrationBackup } from '../src/cloud/importBackup.ts';
import { createMigrationBackup, compareCollections } from '../src/cloud/migrationSafety.ts';
import { updateCloudBackup } from '../src/cloud/updateSnapshot.ts';
import { uploadFirstCloudBackup } from '../src/cloud/firstUpload.ts';

function fixture() {
  return {
    data: { characters: [{ id: 1, name: 'Test Character' }] },
    checked: { characters: { '1': true } },
    owned: { characters: { '1': 'owned' } },
    ingredients: {},
    deletedIds: {},
    nextId: { characters: 2 },
    customUniverses: { characters: [{ name: 'Test', zone: 'Valley' }] },
  };
}
function backup() { return createMigrationBackup(fixture(), { total: 3 }, true); }

test('round trip preserves complete collection and manual totals', () => {
  const original = backup();
  const imported = parseMigrationBackup(JSON.stringify(original));
  assert.deepEqual(imported.collection, original.collection);
  assert.deepEqual(imported.manualTotals, { total: 3 });
  assert.equal(imported.ownedOnly, true);
});

test('rejects invalid JSON and unsupported schema', () => {
  assert.throws(() => parseMigrationBackup('{broken'));
  assert.throws(() => parseMigrationBackup(JSON.stringify({ ...backup(), schema: 'unknown' })));
});

test('rejects missing collection structures', () => {
  const value = backup();
  delete value.collection.owned;
  assert.throws(() => parseMigrationBackup(JSON.stringify(value)));
});

test('rejects malformed items and negative totals', () => {
  const value = backup();
  value.collection.data.characters = [{ id: 'bad', name: 'X' }];
  assert.throws(() => parseMigrationBackup(JSON.stringify(value)));
  assert.throws(() => parseMigrationBackup(JSON.stringify({ ...backup(), manualTotals: { total: -1 } })));
});

test('comparison notices mode changes', () => {
  const first = backup();
  assert.equal(compareCollections(first, { ...first, ownedOnly: false }).identical, false);
});

test('backup creation snapshots nested collection objects', () => {
  const collection = fixture();
  const saved = createMigrationBackup(collection, {}, false);
  collection.data.characters[0].name = 'Changed';
  assert.equal(saved.collection.data.characters[0].name, 'Test Character');
});

const config = { url: 'https://example.supabase.co', publishableKey: 'test-public-key' };
function mockResponse(value, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => value };
}
test('cloud CAS conflict returns null and sends expected revision', async () => {
  const previous = globalThis.fetch;
  let request;
  globalThis.fetch = async (_url, options) => {
    request = options;
    return mockResponse(null);
  };
  try {
    const result = await updateCloudBackup(config, 'test-token', backup(), 4);
    assert.equal(result, null);
    assert.equal(JSON.parse(request.body).expected_revision, 4);
    assert.equal(request.method, 'POST');
  } finally { globalThis.fetch = previous; }
});

test('cloud update accepts exactly the next revision', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => mockResponse(5);
  try {
    assert.equal(await updateCloudBackup(config, 'test-token', backup(), 4), 5);
  } finally { globalThis.fetch = previous; }
});

test('cloud update rejects unexpected revision and HTTP errors', async () => {
  const previous = globalThis.fetch;
  try {
    globalThis.fetch = async () => mockResponse(7);
    await assert.rejects(updateCloudBackup(config, 'test-token', backup(), 4), /Unexpected cloud revision/);
    globalThis.fetch = async () => mockResponse(null, 409);
    await assert.rejects(updateCloudBackup(config, 'test-token', backup(), 4), /HTTP 409/);
  } finally { globalThis.fetch = previous; }
});

test('invalid revision or absent token cannot send data', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Fetch should not be called'); };
  try {
    await assert.rejects(updateCloudBackup(config, 'test-token', backup(), 0), /Invalid expected revision/);
    await assert.rejects(updateCloudBackup(config, '', backup(), 1), /Sign in first/);
  } finally { globalThis.fetch = previous; }
});

test('empty browser cannot initialize or overwrite a cloud backup', async () => {
  const previous = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Network must not be called'); };
  const empty = backup();
  empty.collection.data = { characters: [] };
  try {
    await assert.rejects(uploadFirstCloudBackup(config, 'test-token', empty), /Empty local collection/);
    await assert.rejects(updateCloudBackup(config, 'test-token', empty, 3), /Empty local collection/);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = previous; }
});

test('malformed local entries cannot reach the cloud RPC', async () => {
  const previous = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Network must not be called'); };
  const invalid = backup();
  invalid.collection.data.characters = null;
  try {
    await assert.rejects(updateCloudBackup(config, 'test-token', invalid, 3), /Invalid local collection entries/);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = previous; }
});

test('all edited fields survive a cloud JSON backup round trip', () => {
  const collection = fixture();
  collection.data.characters[0] = {
    id: 1, name: 'Arendellian Riding Helmet', meta: 'Frozen',
    meta2: 'WISHBLOSSOM MOUNTAINS', event: true, premiumShop: false,
    whereToGet: ['Friendship Quest', 'Other'],
    whereToGetOther: 'Special reward',
    friendshipQuestCharacter: 'Anna', stars: 5,
    image: 'custom-image', sourceUrl: 'https://example.org/item',
  };
  collection.ingredients.characters = { '1': ['ingredient A'] };
  const original = createMigrationBackup(collection, { 'clothing:Frozen': 22 }, true);
  const restored = parseMigrationBackup(JSON.stringify(original));
  assert.deepEqual(restored.collection, collection);
  assert.equal(compareCollections(original, restored).identical, true);
  restored.collection.data.characters[0].meta2 = 'DREAMLIGHT VALLEY';
  assert.equal(compareCollections(original, restored).identical, false);
});

test('cloud comparison ignores JSON object key order but detects nested field changes', () => {
  const first = backup();
  const reversed = JSON.parse(JSON.stringify(first));
  reversed.collection = Object.fromEntries(Object.entries(reversed.collection).reverse());
  reversed.collection.data.characters[0] = { name: 'Test Character', id: 1 };
  assert.equal(compareCollections(first, reversed).identical, true);
  reversed.collection.data.characters[0].event = true;
  assert.equal(compareCollections(first, reversed).identical, false);
});

// Reload must preserve user edits instead of reapplying bundled availability rules.
const { ensureCategoryShape, persistSave, loadSave } = await import('../src/data/saveSystem.ts');
test('edited GENERAL availability survives local reload and cloud restore', () => {
  const previous = globalThis.localStorage;
  const storage = new Map();
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  try {
    const collection = fixture();
    const edited = { id: 77, name: 'Basic Hoodie', meta: 'GENERAL', meta2: 'DREAMLIGHT VALLEY', event: true, premiumShop: true, whereToGet: ['Other'], whereToGetOther: 'My edited source' };
    collection.data.clothing = [edited];
    const defaults = { data: { clothing: [{ ...edited, meta: 'OTHER (GENERAL)', event: false, premiumShop: false }] } };
    persistSave(collection);
    const reloaded = loadSave(defaults);
    assert.deepEqual(reloaded.data.clothing.find(item => item.id === 77), edited);
    assert.equal(reloaded.data.clothing.length, 1);
    const cloud = parseMigrationBackup(JSON.stringify(createMigrationBackup(reloaded, {}, false)));
    const restored = ensureCategoryShape(cloud.collection, defaults);
    assert.deepEqual(restored.data.clothing, reloaded.data.clothing);
    assert.equal(restored.data.clothing.length, 1);
  } finally { globalThis.localStorage = previous; }
});

test('legacy universe consolidation preserves edited fields and checklist state', () => {
  const previous = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null };
  try {
    const collection = fixture();
    collection.data.clothing = [{ id: 78, name: 'Basic Hoodie', meta: 'OTHER (GENERAL)', event: true }];
    collection.checked.clothing = { 78: true };
    const result = ensureCategoryShape(collection, {});
    assert.equal(result.data.clothing[0].meta, 'GENERAL');
    assert.equal(result.data.clothing[0].event, true);
    assert.equal(result.checked.clothing[78], true);
  } finally { globalThis.localStorage = previous; }
});

for (const category of ['clothing', 'furniture', 'meals', 'crafting', 'characters', 'ingredients', 'redeemCodes']) {
  test(`${category}: all fields, removals and status survive reload, export and cloud JSON`, async () => {
    const previous = globalThis.localStorage;
    const storage = new Map();
    globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
    try {
      const collection = { data: {}, checked: {}, owned: {}, ingredients: {}, deletedIds: {}, nextId: {}, customUniverses: {} };
      const edited = { id: 101, name: 'Renamed item', meta: 'My universe', meta2: 'STORYBOOK VALE', stars: 5, image: 'custom-image', sourceUrl: 'https://example.org/custom', updatedAt: '2026-10-22', event: true, premiumShop: false, whereToGet: ['Other', 'Friendship Quest'], whereToGetOther: 'Edited reward', friendshipQuestCharacter: 'Anna' };
      collection.data[category] = [edited];
      collection.checked[category] = { 101: false };
      collection.owned[category] = {};
      collection.ingredients[category] = {};
      collection.deletedIds[category] = { 102: true };
      collection.nextId[category] = 999;
      collection.customUniverses[category] = [{ name: 'Empty universe', zone: 'ETERNITY ISLE' }];
      const defaults = { data: { [category]: [{ ...edited, name: 'Original name', stars: 1, event: false }, { id: 102, name: 'Deleted bundled item' }] }, owned: { [category]: { 101: 'owned' } }, checked: { [category]: { 101: true } }, ingredients: { [category]: { 101: ['Removed ingredient'] } } };
      persistSave(collection);
      const reloaded = loadSave(defaults);
      assert.deepEqual(reloaded.data[category], [edited]);
      assert.deepEqual(reloaded.owned[category], {});
      assert.deepEqual(reloaded.ingredients[category], {});
      assert.equal(reloaded.checked[category][101], false);
      assert.equal(reloaded.deletedIds[category][102], true);
      assert.equal(reloaded.nextId[category], 999);
      assert.deepEqual(reloaded.customUniverses[category], collection.customUniverses[category]);
      const { buildPortableData } = await import('../src/data/saveSystem.ts');
      const totals = { [JSON.stringify([category, 'STORYBOOK VALE', 'My universe'])]: 123 };
      const portable = JSON.parse(buildPortableData(reloaded, totals));
      assert.deepEqual(portable.data[category], [edited]);
      assert.deepEqual(portable.manualTotals, totals);
      const backup = createMigrationBackup(reloaded, totals, true);
      const restored = parseMigrationBackup(JSON.stringify(backup));
      assert.equal(compareCollections(backup, restored).identical, true);
      assert.deepEqual(ensureCategoryShape(restored.collection, defaults).data[category], [edited]);
    } finally { globalThis.localStorage = previous; }
  });
}

test('catalog loading does not mutate its defaults and is idempotent', () => {
  const previous = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null };
  try {
    const defaults = { data: { clothing: [{ id: 1, name: 'Basic Hoodie', meta: 'OTHER (GENERAL)' }] } };
    const original = structuredClone(defaults);
    const first = ensureCategoryShape(fixture(), defaults);
    const second = ensureCategoryShape(first, defaults);
    assert.deepEqual(second, first);
    assert.deepEqual(defaults, original);
  } finally { globalThis.localStorage = previous; }
});

test('local save rejects storage that silently discards writes', () => {
  const previous = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  try { assert.throws(() => persistSave(fixture()), /Local save failed/); }
  finally { globalThis.localStorage = previous; }
});

const { replaceLocalBackup, MANUAL_TOTALS_STORAGE_KEY } = await import('../src/data/localBackup.ts');
test('restore rolls back collection, totals and mode if one write fails', () => {
  const previous = globalThis.localStorage;
  const storage = new Map([['dlv_guide_v6', 'previous collection'], [MANUAL_TOTALS_STORAGE_KEY, 'previous totals'], ['dlv_collection_owned_only_v1', '0']]);
  const before = new Map(storage);
  let failed = false;
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => {
      if (key === MANUAL_TOTALS_STORAGE_KEY && !failed) { failed = true; throw new Error('Quota exceeded'); }
      storage.set(key, value);
    },
    removeItem: key => storage.delete(key),
  };
  try {
    assert.throws(() => replaceLocalBackup(fixture(), { total: 99 }, true), /Previous local collection, totals and mode were restored/);
    assert.deepEqual(storage, before);
  } finally { globalThis.localStorage = previous; }
});

test('complete restore verifies all three saved structures', () => {
  const previous = globalThis.localStorage;
  const storage = new Map();
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  try {
    replaceLocalBackup(fixture(), { total: 99 }, true);
    assert.deepEqual(JSON.parse(storage.get('dlv_guide_v6')), fixture());
    assert.deepEqual(JSON.parse(storage.get(MANUAL_TOTALS_STORAGE_KEY)), { total: 99 });
    assert.equal(storage.get('dlv_collection_owned_only_v1'), '1');
  } finally { globalThis.localStorage = previous; }
});

test('completed legacy migration never renames a subsequently edited universe again', () => {
  const previous = globalThis.localStorage;
  const storage = new Map();
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  try {
    let collection = ensureCategoryShape(fixture(), {});
    collection.data.furniture = [{ id: 1, name: 'Custom furniture', meta: 'GENERAL' }];
    collection.data.clothing = [{ id: 1, name: 'Custom clothing', meta: 'OTHER (GENERAL)', event: true }];
    persistSave(collection);
    collection = loadSave({});
    assert.equal(collection.data.furniture[0].meta, 'GENERAL');
    assert.equal(collection.data.clothing[0].meta, 'OTHER (GENERAL)');
    assert.equal(collection.data.clothing[0].event, true);
    const roundTrip = parseMigrationBackup(JSON.stringify(createMigrationBackup(collection, {}, false)));
    assert.equal(ensureCategoryShape(roundTrip.collection, {}).data.furniture[0].meta, 'GENERAL');
  } finally { globalThis.localStorage = previous; }
});

test('duplicate IDs and invalid item fields cannot overwrite a cloud backup', async () => {
  const previous = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Network must not be called'); };
  try {
    const duplicate = backup();
    duplicate.collection.data.characters.push({ id: 1, name: 'Duplicate' });
    await assert.rejects(updateCloudBackup(config, 'test-token', duplicate, 1), /duplicate collection item ID/);
    const invalid = backup();
    invalid.collection.data.characters[0].event = 'true';
    await assert.rejects(updateCloudBackup(config, 'test-token', invalid, 1), /Invalid item field/);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = previous; }
});
