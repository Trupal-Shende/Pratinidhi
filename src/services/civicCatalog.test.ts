/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CIVIC_SERVICES,
  classifyCitizenIntent,
  validateDocumentQuality,
} from './civicCatalog';

test('civic catalog contains MVP supported services with valid requirements', () => {
  assert.ok(CIVIC_SERVICES.length >= 3);
  const incomeService = CIVIC_SERVICES.find((s) => s.id === 'up-income-certificate');
  assert.ok(incomeService);
  assert.equal(incomeService.state, 'Uttar Pradesh');
  assert.equal(incomeService.officialFee, 15);
  assert.ok(incomeService.documents.length >= 4);

  const pensionService = CIVIC_SERVICES.find((s) => s.id === 'up-pension-revival');
  assert.ok(pensionService);
  assert.equal(pensionService.officialFee, 0);
  assert.ok(pensionService.documents.some((d) => d.id === 'doc-passbook'));
});

test('classifyCitizenIntent identifies Hindi and English pension requests', () => {
  const res1 = classifyCitizenIntent('मेरी माताजी की वृद्धावस्था पेंशन रुक गई है');
  assert.equal(res1.status, 'matched');
  assert.equal(res1.service?.id, 'up-pension-revival');
  assert.ok(res1.confidence >= 0.85);

  const res2 = classifyCitizenIntent('Need to restart old age pension for senior citizen Savitri');
  assert.equal(res2.status, 'matched');
  assert.equal(res2.service?.id, 'up-pension-revival');
});

test('classifyCitizenIntent identifies income certificate requests', () => {
  const res = classifyCitizenIntent('Need income certificate for scholarship application in UP');
  assert.equal(res.status, 'matched');
  assert.equal(res.service?.id, 'up-income-certificate');
});

test('classifyCitizenIntent safely handles unsupported requests', () => {
  const res = classifyCitizenIntent('Apply for space station launch permit');
  assert.equal(res.status, 'unsupported');
  assert.ok(res.matchedReason.en.includes('outside the MVP supported catalog'));
});

test('classifyCitizenIntent handles too short input with clarification', () => {
  const res = classifyCitizenIntent('hi');
  assert.equal(res.status, 'needs_clarification');
});

test('validateDocumentQuality catches blurry and cut off documents', () => {
  const cleanResult = validateDocumentQuality('aadhaar_front.jpg', 'Identity Proof', 150);
  assert.equal(cleanResult.status, 'verified');
  assert.ok(cleanResult.score >= 90);

  const blurryResult = validateDocumentQuality('aadhaar_blurry.jpg', 'Identity Proof', 120, {
    isBlurry: true,
  });
  assert.equal(blurryResult.status, 'rejected');
  assert.ok(blurryResult.issues.some((i) => i.code === 'BLURRY_TEXT'));

  const glareResult = validateDocumentQuality('ration_card.jpg', 'Residence Proof', 250, {
    hasGlare: true,
  });
  assert.equal(glareResult.status, 'warning');
});
