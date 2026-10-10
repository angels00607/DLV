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
