import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMigrationBackup } from './importBackup.ts';
import { compareCollections, createMigrationBackup } from './migrationSafety.ts';
import type { SavePayload } from '../domain/types.ts';

const collection: SavePayload = {
  data: { characters: [{ id: 1, name: 'Test Character' }] },
  checked: { characters: { '1': true } },
  owned: { characters: { '1': 'owned' } },
  ingredients: {},
  deletedIds: {},
  nextId: { characters: 2 },
  customUniverses: { characters: [{ name: 'Test', zone: 'Valley' }] },
};
const make = () => createMigrationBackup(collection, { 'test-total': 3 }, true);

test('full backup round trips without dropping collection metadata', () => {
  const restored = parseMigrationBackup(JSON.stringify(make()));
  assert.deepEqual(restored.collection, collection);
  assert.deepEqual(restored.manualTotals, { 'test-total': 3 });
  assert.equal(restored.ownedOnly, true);
});

test('backup rejects wrong schema', () => {
  assert.throws(() => parseMigrationBackup(JSON.stringify({ ...make(), schema: 'other' })));
});

test('backup rejects incomplete collection', () => {
  const bad = make();
  delete (bad.collection as Partial<SavePayload>).owned;
  assert.throws(() => parseMigrationBackup(JSON.stringify(bad)));
});

test('backup rejects negative manual totals', () => {
  assert.throws(() => parseMigrationBackup(JSON.stringify({ ...make(), manualTotals: { a: -1 } })));
});

test('backup rejects invalid JSON', () => {
  assert.throws(() => parseMigrationBackup('{invalid'));
});

test('comparison detects different ownership mode', () => {
  const first = make();
  assert.equal(compareCollections(first, { ...first, ownedOnly: false }).identical, false);
});

test('creating a backup snapshots data rather than sharing mutable references', () => {
  const backup = make();
  collection.data.characters![0].name = 'Changed after export';
  assert.equal(backup.collection.data.characters![0].name, 'Test Character');
});
