import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMigrationBackup } from '../src/cloud/importBackup.ts';
import { createMigrationBackup, compareCollections } from '../src/cloud/migrationSafety.ts';

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
