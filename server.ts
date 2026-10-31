/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { CIVIC_SERVICES, classifyCitizenIntent, validateDocumentQuality } from './src/services/civicCatalog.ts';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory seed database matching PRD Personas & Applications
interface StoredApplication {
  id: string;
  applicantName: string;
  phoneMasked: string;
  preferredLanguage: 'hi' | 'en';
  serviceId: string;
  serviceName: { en: string; hi: string };
  state: string;
  portalName: string;
  acknowledgementNumber?: string;
  status: 'needs_action' | 'in_progress' | 'submitted' | 'delayed' | 'completed';
  officialStatusText: { en: string; hi: string };
  plainExplanation: { en: string; hi: string };
  submittedAt?: string;
  lastCheckedAt: string;
  nextActionDate?: string;
  urgency: 'normal' | 'high';
  documents: Array<{
    id: string;
    requirementId: string;
    name: string;
    fileName: string;
    verified: boolean;
    qualityScore: number;
    consentedForPortal: boolean;
    redactedFields: string[];
    uploadedAt: string;
  }>;
  auditTrail: Array<{
    id: string;
    timestamp: string;
    action: string;
    actor: 'citizen' | 'agent' | 'portal';
    details: string;
  }>;
}

const mockApplications: StoredApplication[] = [
  {
    id: 'app-savitri-2026',
    applicantName: 'Savitri Devi (सावित्री देवी)',
    phoneMasked: '+91 98*** **312',
    preferredLanguage: 'hi',
    serviceId: 'up-pension-revival',
    serviceName: {
      en: 'Old Age Pension Revival & Life Verification',
      hi: 'वृद्धावस्था पेंशन पुनरारंभ एवं जीवन प्रमाणीकरण',
    },
    state: 'Uttar Pradesh',
    portalName: 'UP Social Welfare Portal (sspy-up.gov.in)',
    acknowledgementNumber: 'UP-SSPY-2026-78419',
    status: 'needs_action',
    officialStatusText: {
      en: 'Aadhaar e-KYC Pending / Bank DBT unlinked',
      hi: 'आधार ई-केवाईसी लंबित / बैंक डीबीटी मैपिंग अपुष्ट',
    },
    plainExplanation: {
      en: 'Your pension was temporarily halted because annual life verification is pending. Please review your passbook and confirm the e-KYC request.',
      hi: 'वार्षिक जीवन प्रमाणीकरण बाकी होने के कारण आपकी पेंशन रुक गई है। कृपया बैंक पासबुक चेक करें और ई-केवाईसी अनुरोध को मंजूरी दें।',
    },
    submittedAt: '2026-09-15T10:30:00Z',
    lastCheckedAt: new Date().toISOString(),
    nextActionDate: 'Immediate — Citizen confirmation required',
    urgency: 'high',
    documents: [
      {
        id: 'doc-sav-1',
        requirementId: 'doc-passbook',
        name: 'Bank Passbook (SBI Moradabad)',
        fileName: 'sbi_passbook_scan.jpg',
        verified: true,
        qualityScore: 92,
        consentedForPortal: true,
        redactedFields: ['Balance', 'Non-DBT transactions'],
        uploadedAt: '2026-09-14T14:20:00Z',
      },
      {
        id: 'doc-sav-2',
        requirementId: 'doc-pension-id',
        name: 'Old Pension Sanction PPO',
        fileName: 'old_ppo_order.pdf',
        verified: true,
        qualityScore: 88,
        consentedForPortal: true,
        redactedFields: [],
        uploadedAt: '2026-09-14T14:22:00Z',
      },
    ],
    auditTrail: [
      {
        id: 'aud-1',
        timestamp: '2026-09-14T14:15:00Z',
        action: 'VOICE_INTAKE_COMPLETED',
        actor: 'citizen',
        details: 'Citizen described stopped pension in Hindi voice. Matched to UP Old Age Pension Revival.',
      },
      {
        id: 'aud-2',
        timestamp: '2026-09-14T14:25:00Z',
        action: 'CONSENT_GRANTED_DOCUMENTS',
        actor: 'citizen',
        details: 'Granted specific consent to attach passbook and PPO for portal inspection.',
      },
      {
        id: 'aud-3',
        timestamp: '2026-10-28T09:00:00Z',
        action: 'PORTAL_STATUS_CHECKED',
        actor: 'agent',
        details: 'Official portal status retrieved: e-KYC life verification flag detected.',
      },
    ],
  },
  {
    id: 'app-imran-2026',
    applicantName: 'Imran Khan (इमरान खान)',
    phoneMasked: '+91 94*** **884',
    preferredLanguage: 'en',
    serviceId: 'up-domicile-certificate',
    serviceName: {
      en: 'Domicile Certificate (मूल निवास प्रमाण पत्र)',
      hi: 'मूल निवास प्रमाण पत्र (Domicile Certificate)',
    },
    state: 'Uttar Pradesh',
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    acknowledgementNumber: 'EDIST-UP-26-9048123',
    status: 'in_progress',
    officialStatusText: {
      en: 'Application forwarded to Tehsil Lekhpal for local verification',
      hi: 'आवेदन स्थानीय सत्यापन हेतु तहसील लेखपाल को अग्रेषित',
    },
    plainExplanation: {
      en: 'Your application has been accepted by the portal. The local revenue officer has 11 days remaining to complete verification.',
      hi: 'आपका आवेदन पोर्टल पर स्वीकार कर लिया गया है। स्थानीय राजस्व अधिकारी के पास सत्यापन हेतु 11 दिन शेष हैं।',
    },
    submittedAt: '2026-10-22T11:45:00Z',
    lastCheckedAt: new Date().toISOString(),
    nextActionDate: '2026-11-06 (Published SLA)',
    urgency: 'normal',
    documents: [
      {
        id: 'doc-imr-1',
        requirementId: 'doc-identity',
        name: 'Aadhaar Card Copy',
        fileName: 'aadhaar_redacted.jpg',
        verified: true,
        qualityScore: 95,
        consentedForPortal: true,
        redactedFields: ['First 8 digits masked'],
        uploadedAt: '2026-10-22T11:20:00Z',
      },
      {
        id: 'doc-imr-2',
        requirementId: 'doc-school-or-birth',
        name: 'Class 10th UP Board Marksheet',
        fileName: 'up_board_marksheet.pdf',
        verified: true,
        qualityScore: 98,
        consentedForPortal: true,
        redactedFields: [],
        uploadedAt: '2026-10-22T11:25:00Z',
      },
    ],
    auditTrail: [
      {
        id: 'aud-4',
        timestamp: '2026-10-22T11:30:00Z',
        action: 'SUBMISSION_CONFIRMED',
        actor: 'citizen',
        details: 'Citizen confirmed irreversible submission on e-District portal after summary review.',
      },
      {
        id: 'aud-5',
        timestamp: '2026-10-22T11:45:00Z',
        action: 'ACKNOWLEDGEMENT_EXTRACTED',
        actor: 'agent',
        details: 'Captured official receipt number EDIST-UP-26-9048123 from portal response.',
      },
    ],
  },
];

// API: Services Catalog
app.get('/api/services', (_req: Request, res: Response) => {
  res.json({ success: true, services: CIVIC_SERVICES });
});

// API: Voice & Text Intake Intent Parser
app.post('/api/intake/parse', (req: Request, res: Response) => {
  const { text, state } = req.body || {};
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text prompt is required for intent parsing' });
    return;
  }
  const result = classifyCitizenIntent(text, state || 'Uttar Pradesh');
  res.json({ success: true, result });
});

// API: Applications List
app.get('/api/applications', (_req: Request, res: Response) => {
  res.json({ success: true, applications: mockApplications });
});

// API: Create new Application
app.post('/api/applications', (req: Request, res: Response) => {
  const { serviceId, applicantName, phoneMasked, preferredLanguage, documents } = req.body || {};
  const service = CIVIC_SERVICES.find((s) => s.id === serviceId);

  if (!service) {
    res.status(400).json({ error: 'Invalid or unsupported service ID' });
    return;
  }

  const newApp: StoredApplication = {
    id: `app-${Date.now()}`,
    applicantName: applicantName || 'Citizen Applicant',
    phoneMasked: phoneMasked || '+91 98*** **000',
    preferredLanguage: preferredLanguage || 'en',
    serviceId: service.id,
    serviceName: service.name,
    state: service.state,
    portalName: service.portalName,
    status: 'in_progress',
    officialStatusText: {
      en: 'Draft created — Document verification & consent complete',
      hi: 'प्रारूप तैयार — दस्तावेज़ सत्यापन एवं सहमति पूर्ण',
    },
    plainExplanation: {
      en: 'All required documents have been validated locally. Ready for citizen final submission review.',
      hi: 'सभी आवश्यक दस्तावेजों का स्थानीय स्तर पर सत्यापन हो गया है। अंतिम समीक्षा के लिए तैयार।',
    },
    submittedAt: undefined,
    lastCheckedAt: new Date().toISOString(),
    urgency: 'normal',
    documents: documents || [],
    auditTrail: [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'APPLICATION_DRAFT_CREATED',
        actor: 'citizen',
        details: `Created application draft for ${service.name.en}`,
      },
    ],
  };

  mockApplications.unshift(newApp);
  res.status(201).json({ success: true, application: newApp });
});

// API: Validate Document Quality
app.post('/api/documents/validate', (req: Request, res: Response) => {
  const { fileName, docType, fileSizeKb, flags } = req.body || {};
  const validation = validateDocumentQuality(
    fileName || 'document.jpg',
    docType || 'Document',
    fileSizeKb || 120,
    flags || {}
  );
  res.json({ success: true, validation });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`JanSeva Civic Agent server running on http://0.0.0.0:${port}`);
  });
}

startServer();
