/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalizedText } from '../services/civicCatalog';

export type Language = 'en' | 'hi' | 'mr';

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
    message: LocalizedText;
    severity: 'error' | 'warning';
  }>;
  remediation: LocalizedText;
  previewUrl?: string;
  uploadedAt: string;
}

export interface FollowUpCallRecord {
  id?: string;
  calledAt: string;
  transcript: string;
  outcome: 'resolved' | 'pending' | 'escalated';
  summary: { en: string; hi: string; mr?: string };
  nextAction?: string;
  deadlineGiven?: string | null;
}

export type RejectionCategory =
  | 'missing_document'
  | 'unreadable_document'
  | 'incorrect_form_detail'
  | 'eligibility_issue'
  | 'unclear_portal_message'
  | 'missed_deadline';

export type RejectionRecoveryOption =
  | 'upload_replacement'
  | 'correct_and_resubmit'
  | 'provide_additional_info'
  | 'submit_official_appeal'
  | 'approve_followup_call'
  | 'request_human_support';

export interface RejectionDetails {
  portalRejectionCode: string;
  officialReason: LocalizedText;
  category: RejectionCategory;
  categoryLabel: LocalizedText;
  reassuranceMessage: LocalizedText;
  nonAutoResubmitPledge: LocalizedText;
  specificDocumentOrFieldIssue: LocalizedText;
  validNextSteps: Array<{
    id: RejectionRecoveryOption;
    label: LocalizedText;
    description: LocalizedText;
    requiresFreshCitizenApproval: boolean;
  }>;
  citizenApprovedCorrection?: boolean;
  selectedRecoveryOption?: RejectionRecoveryOption;
  approvedAt?: string;
}

export interface SmsReceipt {
  id: string;
  caseId: string;
  recipientPhoneMasked: string;
  serviceName: LocalizedText;
  stage: LocalizedText;
  officialFee: number;
  callbackNumber: string;
  timestamp: string;
  messageBody: LocalizedText;
  triggerType:
    | 'case_created'
    | 'status_check'
    | 'digilocker_consent'
    | 'submission_approved'
    | 'rejection_alert'
    | 'correction_approved'
    | 'followup_call_summary';
}

export type PaperDocumentFallbackRoute =
  | 'family_smartphone_link'
  | 'self_service_kiosk'
  | 'scheduled_field_capture'
  | 'in_person_office_verification';

export interface DigiLockerCaseConsent {
  caseId: string;
  serviceId: string;
  requestedDocuments: LocalizedText[];
  consentPrompt: LocalizedText;
  approvedViaDtmfOrSms: boolean;
  approvedAt?: string;
  scopeNote: LocalizedText;
}

export interface ApplicationCase {
  id: string;
  userId?: string;
  applicantName: string;
  phone?: string;
  phoneMasked: string;
  aadhaarMasked?: string;
  casePinMasked?: string;
  preferredLanguage: Language;
  serviceId: string;
  serviceName: LocalizedText;
  state: string;
  portalName: string;
  officialFee?: number;
  acknowledgementNumber?: string;
  status:
    | 'needs_action'
    | 'rejected'
    | 'in_progress'
    | 'submitted'
    | 'delayed'
    | 'completed';
  statusText?: LocalizedText;
  officialStatusText: LocalizedText;
  plainExplanation: LocalizedText;
  submittedAt?: string;
  lastCheckedAt: string;
  nextActionDate?: string;
  urgency: 'normal' | 'high';
  rejectionDetails?: RejectionDetails;
  digilockerConsent?: DigiLockerCaseConsent;
  smsReceipts?: SmsReceipt[];
  documents: Array<{
    id: string;
    requirementId: string;
    name: string;
    fileName: string;
    sourceChannel?: 'digilocker' | 'family_smartphone' | 'kiosk' | 'field_device';
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
  followUpCalls?: FollowUpCallRecord[];
}

