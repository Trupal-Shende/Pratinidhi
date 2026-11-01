/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { transcribeWithGroqNode } from './transcribe';
import { CIVIC_SERVICES, classifyCitizenIntent, validateDocumentQuality } from './src/services/civicCatalog.ts';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// FINDING 5: Security Headers & Fingerprinting Protection
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite SPA to run locally
    frameguard: { action: 'deny' },
  })
);

app.use(express.json({ limit: '1mb' }));

// FINDING 4: Rate Limiting for AI Endpoints
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // max 15 requests per minute per IP
  message: { error: 'Too many requests. Please wait a moment before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// FINDING 1: Hardened Multer Configuration (10MB limit + MIME type filtering)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['audio/wav', 'audio/wave', 'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a'];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only valid audio files are permitted.'));
    }
  },
});

// FINDING 2: Auth Middleware — checks Bearer token and stamps authenticated user
interface AuthedRequest extends Request {
  user?: { id: string };
}

const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer demo-user-token') {
    res.status(401).json({ error: 'Unauthorized: valid Bearer token required' });
    return;
  }
  // Authenticated identity — swap for decoded JWT in production
  req.user = { id: 'citizen-1' };
  next();
};

// In-memory seed database matching PRD Personas & Applications
interface StoredApplication {
  id: string;
  userId: string;
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
    userId: 'citizen-1',
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
    userId: 'citizen-1',
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

// FINDING 6: Input Validation on Intent Parsing with Rate Limiting
app.post('/api/intake/parse', aiLimiter, (req: Request, res: Response) => {
  const { text, state } = req.body || {};
  if (!text || typeof text !== 'string' || text.length > 1000) {
    res.status(400).json({ error: 'Text prompt must be a string under 1,000 characters.' });
    return;
  }
  const result = classifyCitizenIntent(text, state || 'Uttar Pradesh');
  res.json({ success: true, result });
});

// FINDING 1 & 7: Protected Transcription Route with Rate Limiting and Sanitized Error Responses
app.post(
  '/api/transcribe',
  requireAuth,
  aiLimiter,
  upload.single('audio'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No audio file uploaded.' });
        return;
      }

      const text = await transcribeWithGroqNode(req.file.buffer);
      res.json({ success: true, text });
    } catch (error: any) {
      console.error('[Transcription Error]:', error?.message || error);
      res.status(500).json({ error: 'Transcription service temporarily unavailable.' });
    }
  }
);

// FINDING 3: Strict Multi-Tenant Isolation (No Bypass Allowed)
app.get('/api/applications', requireAuth, (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userApplications = mockApplications.filter((app) => app.userId === userId);
  res.json({ success: true, applications: userApplications });
});

// FINDING 6: Input Validation on Application Creation
app.post('/api/applications', requireAuth, (req: AuthedRequest, res: Response) => {
  const { serviceId, applicantName, phoneMasked, preferredLanguage, documents } = req.body || {};

  if (
    !applicantName ||
    typeof applicantName !== 'string' ||
    applicantName.trim().length === 0 ||
    applicantName.length > 100
  ) {
    res.status(400).json({ error: 'Invalid applicantName (must be 1-100 characters).' });
    return;
  }

  const service = CIVIC_SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    res.status(400).json({ error: 'Invalid or unsupported service ID' });
    return;
  }

  const newApp: StoredApplication = {
    id: `app-${Date.now()}`,
    userId: req.user?.id || 'citizen-1',
    applicantName: applicantName.trim(),
    phoneMasked: typeof phoneMasked === 'string' && phoneMasked.length <= 20 ? phoneMasked : '+91 98*** **000',
    preferredLanguage: preferredLanguage === 'hi' ? 'hi' : 'en',
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
    documents: Array.isArray(documents) ? documents.slice(0, 10) : [],
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
    console.log(`\n  ➜  Local:   http://localhost:${port}\n  ➜  Network: http://127.0.0.1:${port}\n`);
  });
}

startServer();
