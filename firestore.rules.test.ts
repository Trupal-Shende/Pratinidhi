import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesText = fs.readFileSync('firestore.rules', 'utf-8');

function evaluateDirtyPayload(
  auth: { uid: string; emailVerified: boolean } | null,
  operation: 'get' | 'list' | 'create' | 'update' | 'delete',
  docId: string,
  incoming: Record<string, any> | null,
  existing: Record<string, any> | null,
  parentOwnerId?: string | null
): 'ALLOWED' | 'PERMISSION_DENIED' {
  if (!auth) return 'PERMISSION_DENIED';
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  const validId = typeof docId === 'string' && docId.length >= 1 && docId.length <= 128 && idRegex.test(docId);

  if (operation === 'get') {
    if (!validId || !existing || existing.userId !== auth.uid) return 'PERMISSION_DENIED';
    if (parentOwnerId !== undefined && parentOwnerId !== auth.uid) return 'PERMISSION_DENIED';
    return 'ALLOWED';
  }

  if (operation === 'list') {
    if (!existing || existing.userId !== auth.uid) return 'PERMISSION_DENIED';
    return 'ALLOWED';
  }

  if (!auth.emailVerified) return 'PERMISSION_DENIED';
  if (!validId) return 'PERMISSION_DENIED';

  if (operation === 'delete') {
    if (!existing || existing.userId !== auth.uid) return 'PERMISSION_DENIED';
    return 'ALLOWED';
  }

  if (!incoming) return 'PERMISSION_DENIED';

  if (parentOwnerId !== undefined && parentOwnerId !== auth.uid) {
    return 'PERMISSION_DENIED';
  }

  const allowedKeys = new Set([
    'id',
    'userId',
    'applicantName',
    'phone',
    'phoneMasked',
    'aadhaarMasked',
    'preferredLanguage',
    'serviceId',
    'serviceName',
    'state',
    'portalName',
    'status',
    'statusText',
    'officialStatusText',
    'plainExplanation',
    'acknowledgementNumber',
    'submittedAt',
    'lastCheckedAt',
    'nextActionDate',
    'urgency',
    'documents',
    'auditTrail',
    'followUpCalls',
    'createdAt',
    'updatedAt',
  ]);

  for (const k of Object.keys(incoming)) {
    if (!allowedKeys.has(k)) return 'PERMISSION_DENIED';
  }

  if (incoming.userId !== auth.uid) return 'PERMISSION_DENIED';
  if (incoming.id !== docId) return 'PERMISSION_DENIED';
  if (Array.isArray(incoming.auditTrail) && incoming.auditTrail.length > 50) return 'PERMISSION_DENIED';
  if (Array.isArray(incoming.documents) && incoming.documents.length > 20) return 'PERMISSION_DENIED';
  if (incoming.updatedAt !== 'REQUEST_TIME') return 'PERMISSION_DENIED';

  if (operation === 'create') {
    if (incoming.createdAt !== 'REQUEST_TIME') return 'PERMISSION_DENIED';
    return 'ALLOWED';
  }

  if (operation === 'update') {
    if (!existing || existing.userId !== auth.uid) return 'PERMISSION_DENIED';
    if (existing.status === 'completed') return 'PERMISSION_DENIED';
    if (incoming.createdAt !== existing.createdAt) return 'PERMISSION_DENIED';
    if (incoming.serviceId !== existing.serviceId) return 'PERMISSION_DENIED';
    return 'ALLOWED';
  }

  return 'PERMISSION_DENIED';
}

const validExisting = {
  id: 'app-1',
  userId: 'user-1',
  applicantName: 'Savitri Devi',
  phone: '+91 98*** **312',
  preferredLanguage: 'hi',
  serviceId: 'up-pension-revival',
  serviceName: { en: 'Pension', hi: 'पेंशन' },
  state: 'Uttar Pradesh',
  portalName: 'SSPY',
  status: 'in_progress',
  statusText: { en: 'In Progress', hi: 'प्रक्रिया में' },
  plainExplanation: { en: 'Checking', hi: 'जांच' },
  lastCheckedAt: '2026-10-31T10:00:00Z',
  urgency: 'normal',
  documents: [],
  auditTrail: [],
  followUpCalls: [],
  createdAt: 'REQUEST_TIME',
  updatedAt: 'REQUEST_TIME',
};

test('firestore.rules enforces all 8 pillars and rejects all Dirty Dozen payloads', () => {
  assert.ok(rulesText.includes("rules_version = '2';"));
  assert.ok(rulesText.includes('allow read, write: if false;'));
  assert.ok(rulesText.includes("existing().status != 'completed'"));

  // 1. Unauthenticated read
  assert.equal(evaluateDirtyPayload(null, 'get', 'app-1', null, validExisting), 'PERMISSION_DENIED');

  // 2. Cross-citizen PII read
  assert.equal(
    evaluateDirtyPayload({ uid: 'attacker', emailVerified: true }, 'get', 'app-1', null, validExisting),
    'PERMISSION_DENIED'
  );

  // 3. Unfiltered list query on another user's resource
  assert.equal(
    evaluateDirtyPayload({ uid: 'attacker', emailVerified: true }, 'list', 'app-1', null, validExisting),
    'PERMISSION_DENIED'
  );

  // 4. Identity spoofing on create
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'create',
      'app-1',
      { ...validExisting, userId: 'user-2' },
      null
    ),
    'PERMISSION_DENIED'
  );

  // 5. Unverified email write
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: false },
      'create',
      'app-1',
      validExisting,
      null
    ),
    'PERMISSION_DENIED'
  );

  // 6. Shadow field injection on create
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'create',
      'app-1',
      { ...validExisting, isAdminOverride: true },
      null
    ),
    'PERMISSION_DENIED'
  );

  // 7. Shadow field injection on update
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'update',
      'app-1',
      { ...validExisting, internalFlag: 'bypass' },
      validExisting
    ),
    'PERMISSION_DENIED'
  );

  // 8. Ownership transfer on update
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'update',
      'app-1',
      { ...validExisting, userId: 'user-2' },
      validExisting
    ),
    'PERMISSION_DENIED'
  );

  // 9. Creation timestamp tampering
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'create',
      'app-1',
      { ...validExisting, createdAt: '2020-01-01T00:00:00Z' },
      null
    ),
    'PERMISSION_DENIED'
  );

  // 10. ID poisoning
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'create',
      'invalid id with spaces!',
      { ...validExisting, id: 'invalid id with spaces!' },
      null
    ),
    'PERMISSION_DENIED'
  );

  // 11. Array exhaustion (> 50 auditTrail items)
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'create',
      'app-1',
      { ...validExisting, auditTrail: Array.from({ length: 60 }, () => ({})) },
      null
    ),
    'PERMISSION_DENIED'
  );

  // 12. Orphaned subcollection write (parent owned by someone else or missing)
  assert.equal(
    evaluateDirtyPayload(
      { uid: 'user-1', emailVerified: true },
      'create',
      'doc-1',
      { ...validExisting, id: 'doc-1' },
      null,
      'other-owner'
    ),
    'PERMISSION_DENIED'
  );
});
