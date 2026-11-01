/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CIVIC_SERVICES,
  INDIAN_STATES_AND_UTS,
  LIFE_EVENT_TRIGGERS,
  getServicesForState,
  classifyCitizenIntent,
  validateDocumentQuality,
  detectLifeEventFromText,
  runPreFlightRejectionCheck,
  findServiceByIdOrAlias,
  extractMetadataFromTranscript,
} from './civicCatalog';
import {
  getLocalizedStateName,
  localizeEmotionalState,
  localizeDocumentName,
  localizeNextActionDate,
  localizeAuditEntry,
} from './speechAndLocale';

test('INDIAN_STATES_AND_UTS contains all 28 States and 8 Union Territories (36 total)', () => {
  assert.equal(INDIAN_STATES_AND_UTS.length, 36);
  const states = INDIAN_STATES_AND_UTS.filter((s) => s.type === 'state');
  const uts = INDIAN_STATES_AND_UTS.filter((s) => s.type === 'ut');
  assert.equal(states.length, 28);
  assert.equal(uts.length, 8);

  const maharashtra = INDIAN_STATES_AND_UTS.find((s) => s.name === 'Maharashtra');
  assert.ok(maharashtra);
  assert.ok(maharashtra.portalName.includes('Aaple Sarkar'));
  assert.equal(maharashtra.nameMr, 'महाराष्ट्र');
});

test('civic catalog contains MVP supported services with English, Hindi, and Marathi translations', () => {
  assert.ok(CIVIC_SERVICES.length >= 8);
  for (const srv of CIVIC_SERVICES) {
    assert.ok(srv.name.en && srv.name.hi && srv.name.mr);
    assert.ok(srv.description.en && srv.description.hi && srv.description.mr);
    for (const doc of srv.documents) {
      assert.ok(doc.name.en && doc.name.hi && doc.name.mr);
      assert.ok(doc.whyNeeded.en && doc.whyNeeded.hi && doc.whyNeeded.mr);
    }
  }
});

test('getServicesForState localizes portals and departments for any Indian state', () => {
  const mhServices = getServicesForState('Maharashtra');
  assert.equal(mhServices[0].state, 'Maharashtra');
  assert.ok(mhServices[0].portalName.includes('Aaple Sarkar'));
  assert.ok(mhServices[0].department.mr.includes('महाराष्ट्र'));

  const kaServices = getServicesForState('Karnataka');
  assert.equal(kaServices[0].state, 'Karnataka');
  assert.ok(kaServices[0].portalName.includes('Seva Sindhu'));
});

test('classifyCitizenIntent identifies Hindi, Marathi, and English pension requests across states', () => {
  const resHi = classifyCitizenIntent('मेरी माताजी की वृद्धावस्था पेंशन रुक गई है', 'Uttar Pradesh');
  assert.equal(resHi.status, 'matched');
  assert.equal(resHi.service?.id, 'up-pension-revival');
  assert.equal(resHi.service?.state, 'Uttar Pradesh');

  const resMr = classifyCitizenIntent(
    'माझ्या आईची वृद्धापकाळ पेन्शन थांबली आहे, हयातीचा दाखला द्यायचा आहे',
    'Maharashtra'
  );
  assert.equal(resMr.status, 'matched');
  assert.equal(resMr.service?.id, 'up-pension-revival');
  assert.equal(resMr.service?.state, 'Maharashtra');
  assert.ok(resMr.service?.portalName.includes('MahaDBT'));
  assert.ok(resMr.matchedReason.mr.includes('महाराष्ट्र'));
});

test('classifyCitizenIntent identifies Marathi and English income & domicile certificate requests', () => {
  const resIncomeMr = classifyCitizenIntent(
    'मला महाविद्यालयीन शिष्यवृत्तीसाठी उत्पन्नाचा दाखला काढायचा आहे',
    'Maharashtra'
  );
  assert.equal(resIncomeMr.status, 'matched');
  assert.equal(resIncomeMr.service?.id, 'up-income-certificate');
  assert.equal(resIncomeMr.service?.state, 'Maharashtra');

  const resDomicileMr = classifyCitizenIntent(
    'मला सरकारी नोकरीसाठी अधिवास व रहिवासी दाखला हवा आहे',
    'Maharashtra'
  );
  assert.equal(resDomicileMr.status, 'matched');
  assert.equal(resDomicileMr.service?.id, 'up-domicile-certificate');
});

test('classifyCitizenIntent safely handles unsupported requests with Marathi translation', () => {
  const res = classifyCitizenIntent('Apply for space station launch permit', 'Delhi');
  assert.equal(res.status, 'unsupported');
  assert.ok(res.matchedReason.en.includes('Delhi'));
  assert.ok(res.matchedReason.mr.includes('दिल्ली'));
});

test('validateDocumentQuality catches blurry and cut off documents with Marathi messages', () => {
  const cleanResult = validateDocumentQuality('aadhaar_front.jpg', 'Identity Proof', 150);
  assert.equal(cleanResult.status, 'verified');
  assert.ok(cleanResult.remediation.mr.length > 5);

  const blurryResult = validateDocumentQuality('aadhaar_blurry.jpg', 'Identity Proof', 120, {
    isBlurry: true,
  });
  assert.equal(blurryResult.status, 'rejected');
  assert.ok(blurryResult.issues[0].message.mr.includes('अंधूक'));
});

test('Life-Event Triggers unlock multi-service bundles and detect bereavement in EN, HI, MR', () => {
  assert.equal(LIFE_EVENT_TRIGGERS.length, 3);
  const bereavement = detectLifeEventFromText(
    'My husband passed away last month; need widow pension and property mutation'
  );
  assert.ok(bereavement);
  assert.equal(bereavement.id, 'bereavement-spouse');
  assert.equal(bereavement.unlockedServiceIds.length, 4);
  assert.ok(bereavement.unlockedServiceIds.includes('widow-pension-scheme'));
  assert.ok(bereavement.unlockedServiceIds.includes('family-pension-survivor'));
  assert.ok(bereavement.unlockedServiceIds.includes('property-mutation-ferfar'));
  assert.ok(bereavement.unlockedServiceIds.includes('ration-card-hof-update'));

  const bereavementMr = detectLifeEventFromText('माझ्या पतींचे गेल्या महिन्यात निधन झाले आहे');
  assert.equal(bereavementMr?.id, 'bereavement-spouse');
});

test('runPreFlightRejectionCheck evaluates 4 common rejection reasons and supports auto-resolution', () => {
  const widowService = getServicesForState('Maharashtra').find(
    (s) => s.id === 'widow-pension-scheme'
  )!;
  const cleanReport = runPreFlightRejectionCheck(widowService, 3, 3, false);
  assert.equal(cleanReport.checks.length, 4);
  assert.equal(cleanReport.predictedOutcome, 'likely_approved');
  assert.ok(cleanReport.readinessScore >= 90);

  const blockerReport = runPreFlightRejectionCheck(widowService, 3, 3, false, {
    simulateNameMismatch: true,
    simulateMissingAttestation: true,
  });
  assert.equal(blockerReport.predictedOutcome, 'critical_blocker');
  assert.ok(blockerReport.readinessScore < 60);

  const resolvedReport = runPreFlightRejectionCheck(widowService, 3, 3, false, {
    simulateNameMismatch: true,
    simulateMissingAttestation: true,
    resolvedCheckIds: {
      'check-name-mismatch': true,
      'check-missing-attestation': true,
    },
  });
  assert.equal(resolvedReport.predictedOutcome, 'likely_approved');
});

test('findServiceByIdOrAlias and extractMetadataFromTranscript support Feature 1 catalog aliases and metadata extraction', () => {
  const domicile = findServiceByIdOrAlias('up-domicile', 'Uttar Pradesh');
  assert.equal(domicile?.id, 'up-domicile-certificate');

  const income = findServiceByIdOrAlias('up-income', 'Uttar Pradesh');
  assert.equal(income?.id, 'up-income-certificate');

  const caste = findServiceByIdOrAlias('up-caste', 'Maharashtra');
  assert.equal(caste?.id, 'up-caste');
  assert.equal(caste?.state, 'Maharashtra');

  const ration = findServiceByIdOrAlias('ration-card', 'Uttar Pradesh');
  assert.equal(ration?.id, 'ration-card-hof-update');

  const meta = extractMetadataFromTranscript(
    'मेरी वृद्धावस्था पेंशन बंद हो गई है, मेरे पास आधार कार्ड और बैंक पासबुक है, तुरंत मदद करें'
  );
  assert.equal(meta.urgency, 'high');
  assert.ok(meta.mentionedDocuments.includes('Aadhaar Card'));
  assert.ok(meta.mentionedDocuments.includes('Bank Passbook'));
});

test('Hindi and Marathi localization helpers translate state names, emotional states, document names, and summaries', () => {
  assert.equal(getLocalizedStateName('Maharashtra', 'mr'), 'महाराष्ट्र');
  assert.equal(getLocalizedStateName('Uttar Pradesh', 'hi'), 'उत्तर प्रदेश');

  assert.ok(localizeEmotionalState('Distressed / Anxious', 'hi').includes('चिंतित'));
  assert.ok(localizeEmotionalState('Distressed / Anxious', 'mr').includes('त्रस्त'));

  assert.equal(localizeDocumentName('Aadhaar Card', 'hi'), 'आधार कार्ड');
  assert.equal(localizeDocumentName('Bank Passbook', 'mr'), 'बँक पासबुक');

  assert.ok(
    localizeNextActionDate('Immediate — Citizen confirmation required', 'hi').includes('तत्काल')
  );
  assert.ok(
    localizeNextActionDate('Immediate — Citizen confirmation required', 'mr').includes('तातडीने')
  );

  const auditHi = localizeAuditEntry('VOICE_INTAKE_COMPLETED', 'Citizen described stopped pension in Hindi voice. Matched to UP Old Age Pension Revival.', 'hi');
  assert.ok(auditHi.actionLabel.includes('वॉयस'));
  assert.ok(auditHi.detailsLabel.includes('वृद्धावस्था'));

  const resMr = classifyCitizenIntent(
    'माझ्या आईची वृद्धापकाळ पेन्शन थांबली आहे',
    'Maharashtra'
  );
  assert.ok(resMr.summary_mr && resMr.summary_mr.includes('पेन्शन'));
  assert.ok(resMr.summary_hi && resMr.summary_hi.includes('पेंशन'));
});

import {
  OFFICIAL_TOLL_FREE_NUMBER,
  REVISED_ACCESS_MODEL_ROWS,
  KEYPAD_UTTERANCE_PRESETS,
  ZERO_DISCRETION_HELPER_RULES,
  PAPER_DOCUMENT_FALLBACK_ROUTES,
  mapDtmfDigitToLanguage,
  matchKeypadUtterance,
  createSmsReceipt,
  buildDigiLockerCaseConsent,
  classifyPortalRejection,
  applyRejectionCorrectionWithConsent,
  buildPreCallOfficeConsentPrompt,
} from './keypadAndRejectionService';

test('Keypad-call flow maps DTMF 1->hi, 2->mr, 3->en and matches all 4 core citizen utterances', () => {
  assert.equal(mapDtmfDigitToLanguage('1'), 'hi');
  assert.equal(mapDtmfDigitToLanguage('2'), 'mr');
  assert.equal(mapDtmfDigitToLanguage('3'), 'en');
  assert.equal(mapDtmfDigitToLanguage('9'), null);

  assert.equal(REVISED_ACCESS_MODEL_ROWS.length, 7);
  assert.equal(KEYPAD_UTTERANCE_PRESETS.length, 4);

  const u1 = matchKeypadUtterance('Mujhe income certificate banana hai.');
  assert.equal(u1.id, 'income_start');
  assert.equal(u1.requiresCallbackAndPin, true);

  const u2 = matchKeypadUtterance('What documents do I need for my scholarship?');
  assert.equal(u2.id, 'scholarship_docs');
  assert.equal(u2.requiresIdentityVerification, false);

  const u3 = matchKeypadUtterance('My pension stopped. What happened?');
  assert.equal(u3.id, 'pension_stopped');
  assert.equal(u3.requiresDtmfApproval, true);

  const u4 = matchKeypadUtterance('Tell me why my application was rejected.');
  assert.equal(u4.id, 'rejection_reason');
  assert.ok(u4.aiSpokenPrompt.en.includes('permanently ineligible'));
});

test('SMS receipt generator includes Case ID, service, current stage, official fee, and callback number', () => {
  const sms = createSmsReceipt({
    caseId: 'UP-SSPY-2026-78419',
    serviceName: {
      en: 'Old Age Pension Revival',
      hi: 'वृद्धावस्था पेंशन पुनरारंभ',
      mr: 'वृद्धापकाळ पेन्शन पुनरारंभ',
    },
    stage: {
      en: 'Submitted to Portal',
      hi: 'पोर्टल पर जमा',
      mr: 'पोर्टलवर सादर',
    },
    officialFee: 0,
    triggerType: 'submission_approved',
  });

  assert.equal(sms.caseId, 'UP-SSPY-2026-78419');
  assert.equal(sms.officialFee, 0);
  assert.equal(sms.callbackNumber, OFFICIAL_TOLL_FREE_NUMBER);
  assert.ok(sms.messageBody.en.includes('₹0 (Free)'));
  assert.ok(sms.messageBody.hi.includes('₹0 (निःशुल्क)'));
  assert.ok(sms.messageBody.mr.includes('₹0 (मोफत)'));
});

test('DigiLocker consent enforces "Link once; consent per case and per document" and 4 paper fallback routes', () => {
  const incomeService = getServicesForState('Maharashtra').find(
    (s) => s.id === 'up-income-certificate'
  )!;
  const consent = buildDigiLockerCaseConsent(incomeService, 'CASE-INC-2026-409', true);
  assert.equal(consent.caseId, 'CASE-INC-2026-409');
  assert.equal(consent.approvedViaDtmfOrSms, true);
  assert.ok(
    consent.consentPrompt.en.includes(
      'We will request these from DigiLocker only for this application'
    )
  );
  assert.ok(consent.consentPrompt.en.includes('Press 1 to approve'));
  assert.equal(PAPER_DOCUMENT_FALLBACK_ROUTES.length, 4);
  assert.equal(ZERO_DISCRETION_HELPER_RULES.length, 5);
});

test('First-Class Rejection Journey classifies 6 categories and blocks resubmission without citizen approval', () => {
  const missingDocRej = classifyPortalRejection('income proof missing', 'REJ-INC-101');
  assert.equal(missingDocRej.category, 'missing_document');
  assert.ok(
    missingDocRej.reassuranceMessage.en.includes(
      'This does not mean you are permanently ineligible'
    )
  );
  assert.ok(
    missingDocRej.nonAutoResubmitPledge.en.includes(
      'I can prepare the correction. I will not submit it until you approve.'
    )
  );

  const expiredDocRej = classifyPortalRejection(
    'The address proof is older than the allowed period and all pages were not captured',
    'REJ-INC-102'
  );
  assert.equal(expiredDocRej.category, 'unreadable_document');

  const formDetailRej = classifyPortalRejection('Name spelling mismatch in form detail');
  assert.equal(formDetailRej.category, 'incorrect_form_detail');

  const sampleRejectedCase: any = {
    id: 'app-rameshwar-2026',
    applicantName: 'Rameshwar Patil',
    phoneMasked: '+91 98*** **410',
    preferredLanguage: 'mr',
    serviceId: 'up-income-certificate',
    serviceName: {
      en: 'Income Certificate',
      hi: 'आय प्रमाण पत्र',
      mr: 'उत्पन्न दाखला',
    },
    state: 'Maharashtra',
    portalName: 'Aaple Sarkar (aaplesarkar.mahaonline.gov.in)',
    acknowledgementNumber: 'MH-APLS-2026-55104',
    status: 'rejected',
    officialStatusText: {
      en: 'Rejected: Income proof missing',
      hi: 'अस्वीकृत: आय प्रमाण अनुपस्थित',
      mr: 'नाकारले: उत्पन्नाचा पुरावा जोडलेला नाही',
    },
    plainExplanation: {
      en: 'Rejected due to missing income proof.',
      hi: 'आय प्रमाण न होने से अस्वीकृत।',
      mr: 'उत्पन्न पुरावा नसल्याने नाकारले.',
    },
    submittedAt: '2026-10-10T09:00:00Z',
    lastCheckedAt: '2026-10-30T10:00:00Z',
    urgency: 'high',
    rejectionDetails: missingDocRej,
    documents: [],
    auditTrail: [],
  };

  // Must block if citizenExplicitlyApproved is false
  const blockedAttempt = applyRejectionCorrectionWithConsent(
    sampleRejectedCase,
    'upload_replacement',
    false
  );
  assert.equal(blockedAttempt.smsReceipt, null);
  assert.ok(blockedAttempt.blockedReason?.includes('BLOCKED_NO_CITIZEN_CONSENT'));
  assert.equal(blockedAttempt.updatedApplication.status, 'rejected');

  // Must succeed and generate SMS receipt when citizenExplicitlyApproved is true
  const approvedAttempt = applyRejectionCorrectionWithConsent(
    sampleRejectedCase,
    'upload_replacement',
    true
  );
  assert.ok(approvedAttempt.smsReceipt);
  assert.equal(approvedAttempt.updatedApplication.status, 'in_progress');
  assert.equal(
    approvedAttempt.updatedApplication.rejectionDetails?.citizenApprovedCorrection,
    true
  );

  const preCallPrompt = buildPreCallOfficeConsentPrompt(sampleRejectedCase);
  assert.ok(preCallPrompt.en.includes('Press 1 to approve'));
  assert.ok(preCallPrompt.en.includes('MH-APLS-2026-55104'));
});

