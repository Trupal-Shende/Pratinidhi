/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CivicService, DocumentRequirement } from '../services/civicCatalog';

export type Language = 'en' | 'hi';

export interface UploadedDocState {
  requirementId: string;
  name: string;
  fileName: string;
  fileSizeKb: number;
  status: 'verified' | 'warning' | 'rejected' | 'uploading';
  qualityScore: number;
  consentedForPortal: boolean;
  issues: Array<{
    code: string;
    message: { en: string; hi: string };
    severity: 'error' | 'warning';
  }>;
  remediation: { en: string; hi: string };
  previewUrl?: string;
  uploadedAt: string;
}

export interface ApplicationCase {
  id: string;
  applicantName: string;
  phoneMasked: string;
  preferredLanguage: Language;
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
