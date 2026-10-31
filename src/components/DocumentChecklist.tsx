/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, UploadedDocState } from '../types/civic';
import { CivicService, DocumentRequirement, validateDocumentQuality } from '../services/civicCatalog';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  Camera,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface DocumentChecklistProps {
  language: Language;
  service: CivicService;
  citizenTranscript: string;
  onBack: () => void;
  onProceedToReview: (
    service: CivicService,
    uploadedDocuments: Record<string, UploadedDocState>
  ) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  language,
  service,
  citizenTranscript,
  onBack,
  onProceedToReview,
}) => {
  // Track uploaded documents mapped by requirement ID
  const [documentsState, setDocumentsState] = useState<Record<string, UploadedDocState>>(() => {
    // Initialize default pre-filled sample for demo readiness
    const initial: Record<string, UploadedDocState> = {};
    if (service.documents.length > 0) {
      const firstReq = service.documents[0];
      initial[firstReq.id] = {
        requirementId: firstReq.id,
        name: firstReq.name[language],
        fileName: 'aadhaar_card_masked_sample.jpg',
        fileSizeKb: 145,
        status: 'verified',
        qualityScore: 94,
        consentedForPortal: true,
        issues: [],
        remediation: {
          en: 'Document verified. First 8 digits of Aadhaar automatically masked.',
          hi: 'दस्तावेज सत्यापित। आधार के पहले 8 अंक स्वचालित रूप से छिपाए गए।',
        },
        uploadedAt: new Date().toISOString(),
      };
    }
    return initial;
  });

  // Track expanded "Why Needed" disclosures
  const [expandedWhyNeeded, setExpandedWhyNeeded] = useState<Record<string, boolean>>({
    [service.documents[0]?.id || '']: true,
  });

  const toggleWhyNeeded = (reqId: string) => {
    setExpandedWhyNeeded((prev) => ({
      ...prev,
      [reqId]: !prev[reqId],
    }));
  };

  const handleSimulateUpload = (
    req: DocumentRequirement,
    scenario: 'clean' | 'blurry' | 'cutoff' | 'glare'
  ) => {
    let flags: any = {};
    let fileSizeKb = 120;
    let fileName = `${req.id}_scan.jpg`;

    if (scenario === 'blurry') {
      flags.isBlurry = true;
      fileName = `${req.id}_blurry_sample.jpg`;
    } else if (scenario === 'cutoff') {
      flags.isCutOff = true;
      fileName = `${req.id}_clipped_edges.jpg`;
    } else if (scenario === 'glare') {
      flags.hasGlare = true;
      fileName = `${req.id}_glare_sample.jpg`;
    }

    const validation = validateDocumentQuality(fileName, req.name.en, fileSizeKb, flags);

    setDocumentsState((prev) => ({
      ...prev,
      [req.id]: {
        requirementId: req.id,
        name: req.name[language],
        fileName,
        fileSizeKb,
        status: validation.status,
        qualityScore: validation.score,
        consentedForPortal: validation.status === 'verified', // auto consent only if clean
        issues: validation.issues,
        remediation: validation.remediation,
        uploadedAt: new Date().toISOString(),
      },
    }));
  };

  const handleRealFileUpload = (
    req: DocumentRequirement,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeKb = Math.round(file.size / 1024);
    const validation = validateDocumentQuality(file.name, req.name.en, fileSizeKb);

    setDocumentsState((prev) => ({
      ...prev,
      [req.id]: {
        requirementId: req.id,
        name: req.name[language],
        fileName: file.name,
        fileSizeKb,
        status: validation.status,
        qualityScore: validation.score,
        consentedForPortal: validation.status === 'verified',
        issues: validation.issues,
        remediation: validation.remediation,
        uploadedAt: new Date().toISOString(),
      },
    }));
  };

  const toggleConsent = (reqId: string) => {
    setDocumentsState((prev) => {
      const current = prev[reqId];
      if (!current) return prev;
      return {
        ...prev,
        [reqId]: {
          ...current,
          consentedForPortal: !current.consentedForPortal,
        },
      };
    });
  };

  const removeDocument = (reqId: string) => {
    setDocumentsState((prev) => {
      const updated = { ...prev };
      delete updated[reqId];
      return updated;
    });
  };

  const requiredReqs = service.documents.filter((d) => d.category === 'required');
  const optionalReqs = service.documents.filter((d) => d.category === 'optional');

  // Check how many required documents are uploaded, verified (status !== 'rejected') and consented
  const completedRequiredCount = requiredReqs.filter((req) => {
    const doc = documentsState[req.id];
    return doc && doc.status !== 'rejected' && doc.consentedForPortal;
  }).length;

  const allRequiredMet = completedRequiredCount === requiredReqs.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B3A53] hover:text-[#08283a] p-2 -ml-2 rounded-lg hover:bg-[#F2EFE8] transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस जाएं' : 'Back to Voice Intake'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
          <span className="font-semibold text-[#18212B]">
            {language === 'hi' ? 'कदम 2 / 3: दस्तावेज़ चेकलिस्ट' : 'Step 2 of 3: Document Checklist'}
          </span>
        </div>
      </div>

      {/* Service Header Info Card */}
      <section className="bg-white border border-[#D6D2C9] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6D2C9] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#005B50] bg-[#005B50]/10 px-2.5 py-0.5 rounded-full border border-[#005B50]/20">
              {service.state} • {service.code}
            </span>
            <h1 className="text-2xl font-bold text-[#0B3A53] mt-2">
              {service.name[language]}
            </h1>
            <p className="text-sm text-[#4B5563] mt-1">
              {service.department[language]}
            </p>
          </div>

          <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-3 text-right sm:min-w-[180px]">
            <span className="text-xs text-[#4B5563] block">
              {language === 'hi' ? 'पोर्टल शुल्क एवं समय' : 'Portal Fee & SLA'}
            </span>
            <div className="text-lg font-bold text-[#0B3A53]">
              {service.officialFee === 0 ? '₹0 (Free)' : `₹${service.officialFee}`}
            </div>
            <div className="text-xs text-[#005B50] font-semibold">
              {service.estimatedDays} {language === 'hi' ? 'कार्य दिवस' : 'days SLA'}
            </div>
          </div>
        </div>

        {/* Citizen Voice Intake Context */}
        {citizenTranscript && (
          <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-lg p-3 text-xs sm:text-sm text-[#4B5563] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#005EA8] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#18212B]">
                {language === 'hi' ? 'आपका अनुरोध:' : 'Your stated request:'}
              </span>{' '}
              <span className="italic font-medium">"{citizenTranscript}"</span>
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#18212B] mb-2">
            <span>
              {language === 'hi' ? 'दस्तावेज़ पूर्णता स्थिति' : 'Document Checklist Progress'}
            </span>
            <span className={allRequiredMet ? 'text-[#005B50]' : 'text-[#A94600]'}>
              {completedRequiredCount} / {requiredReqs.length}{' '}
              {language === 'hi' ? 'आवश्यक पूर्ण' : 'Required Verified & Consented'}
            </span>
          </div>
          <div className="w-full bg-[#F2EFE8] h-3 rounded-full overflow-hidden border border-[#D6D2C9]">
            <div
              className={`h-full transition-all duration-300 ${
                allRequiredMet ? 'bg-[#005B50]' : 'bg-[#A94600]'
              }`}
              style={{
                width: `${Math.round((completedRequiredCount / requiredReqs.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section aria-labelledby="required-docs-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B3A53]" />
          <h2 id="required-docs-heading" className="text-xl font-bold text-[#18212B]">
            {language === 'hi' ? 'अनिवार्य दस्तावेज़ (Required Documents)' : 'Required Documents'}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0B3A53]/10 text-[#0B3A53]">
            {requiredReqs.length}
          </span>
        </div>

        <div className="space-y-5">
          {requiredReqs.map((req) => {
            const uploaded = documentsState[req.id];
            const isWhyOpen = !!expandedWhyNeeded[req.id];

            return (
              <div
                key={req.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all shadow-sm ${
                  uploaded?.status === 'verified' && uploaded.consentedForPortal
                    ? 'border-[#005B50] ring-1 ring-[#005B50]/20'
                    : uploaded?.status === 'rejected'
                    ? 'border-[#A61B1B] ring-1 ring-[#A61B1B]/20'
                    : 'border-[#D6D2C9]'
                }`}
              >
                {/* Document Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#A94600]/10 text-[#A94600]">
                        {language === 'hi' ? 'अनिवार्य' : 'Required'}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#0B3A53]">
                        {req.name[language]}
                      </h3>
                    </div>
                    <p className="text-xs text-[#4B5563] mt-1">
                      {language === 'hi' ? 'स्वीकार्य प्रारूप:' : 'Accepted formats:'}{' '}
                      <span className="font-medium text-[#18212B]">JPG, PNG, PDF (max 5MB)</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {uploaded ? (
                      uploaded.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#005B50]/10 text-[#005B50] border border-[#005B50]/30">
                          <CheckCircle2 className="w-4 h-4" />
                          {language === 'hi' ? 'गुणवत्ता सत्यापित (90%+)' : 'Quality Verified'}
                        </span>
                      ) : uploaded.status === 'warning' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A94600]/10 text-[#A94600] border border-[#A94600]/30">
                          <AlertTriangle className="w-4 h-4" />
                          {language === 'hi' ? 'चेतावनी (सुधार अनुशंसित)' : 'Warning / Review'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A61B1B]/10 text-[#A61B1B] border border-[#A61B1B]/30">
                          <XCircle className="w-4 h-4" />
                          {language === 'hi' ? 'अस्वीकृत / अस्पष्ट' : 'Rejected / Unreadable'}
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F2EFE8] text-[#4B5563] border border-[#D6D2C9]">
                        {language === 'hi' ? 'अपलोड प्रतीक्षारत' : 'Pending Upload'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Why Needed Disclosure Drawer (PRD Section 6B) */}
                <div className="mt-4 pt-3 border-t border-[#D6D2C9]">
                  <button
                    type="button"
                    onClick={() => toggleWhyNeeded(req.id)}
                    className="flex items-center justify-between w-full text-left text-xs sm:text-sm font-semibold text-[#005EA8] hover:text-[#0B3A53] py-1 focus:outline-none min-h-[36px]"
                    aria-expanded={isWhyOpen}
                  >
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#005B50]" />
                      <span>
                        {language === 'hi'
                          ? 'यह दस्तावेज़ क्यों आवश्यक है और गोपनीयता सुरक्षा'
                          : 'Why is this document needed & privacy protection?'}
                      </span>
                    </span>
                    {isWhyOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isWhyOpen && (
                    <div className="mt-2 bg-[#F2EFE8] rounded-xl p-4 text-xs sm:text-sm text-[#18212B] space-y-2 border border-[#D6D2C9]">
                      <div>
                        <strong className="text-[#0B3A53] block mb-0.5">
                          {language === 'hi' ? 'सरकारी उद्देश्य:' : 'Official Purpose:'}
                        </strong>
                        <p className="text-[#4B5563]">{req.whyNeeded[language]}</p>
                      </div>

                      <div className="pt-2 border-t border-[#D6D2C9]/60">
                        <strong className="text-[#005B50] flex items-center gap-1 mb-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>
                            {language === 'hi' ? 'गोपनीयता और डेटा सुरक्षा नियम:' : 'Privacy & Redaction Standard:'}
                          </span>
                        </strong>
                        <p className="text-[#4B5563]">{req.privacyRedactionNotes[language]}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload or Uploaded Document State */}
                <div className="mt-4">
                  {uploaded ? (
                    <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#0B3A53]" />
                          <div>
                            <span className="font-semibold text-sm text-[#18212B] block">
                              {uploaded.fileName}
                            </span>
                            <span className="text-xs text-[#4B5563]">
                              {uploaded.fileSizeKb} KB • {language === 'hi' ? 'गुणवत्ता स्कोर' : 'Quality'}:{' '}
                              <strong className={uploaded.qualityScore >= 80 ? 'text-[#005B50]' : 'text-[#A61B1B]'}>
                                {uploaded.qualityScore}/100
                              </strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => removeDocument(req.id)}
                            className="text-xs text-[#A61B1B] hover:underline px-2 py-1 min-h-[36px]"
                          >
                            {language === 'hi' ? 'हटाएं व दूसरा अपलोड करें' : 'Replace Document'}
                          </button>
                        </div>
                      </div>

                      {/* Remediation or Issues Notice */}
                      {uploaded.issues.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-900 space-y-1">
                          {uploaded.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-600" />
                              <span>{issue.message[language]}</span>
                            </div>
                          ))}
                          <div className="text-xs text-red-700 pt-1 font-semibold">
                            {language === 'hi' ? 'सुधार सुझाव:' : 'Action Required:'}{' '}
                            {uploaded.remediation[language]}
                          </div>
                        </div>
                      )}

                      {/* Granular Affirmative Consent Switch (PRD Section 6D) */}
                      {uploaded.status !== 'rejected' && (
                        <div className="pt-3 border-t border-[#D6D2C9] flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={`consent-${req.id}`}
                            checked={uploaded.consentedForPortal}
                            onChange={() => toggleConsent(req.id)}
                            className="w-5 h-5 rounded border-[#D6D2C9] text-[#005B50] focus:ring-[#005EA8] mt-0.5"
                          />
                          <label
                            htmlFor={`consent-${req.id}`}
                            className="text-xs sm:text-sm text-[#18212B] cursor-pointer"
                          >
                            <span className="font-semibold block text-[#0B3A53]">
                              {language === 'hi'
                                ? `मैं ${service.portalName} पोर्टल पर इस दस्तावेज़ के उपयोग की अनुमति देता हूँ`
                                : `I consent to sharing this document specifically for ${service.portalName}`}
                            </span>
                            <span className="text-xs text-[#4B5563]">
                              {language === 'hi'
                                ? 'यह अनुमति केवल इस सेवा तक सीमित है और इसे कभी भी वापस लिया जा सकता है।'
                                : 'Permission is limited to this single application and can be revoked from privacy settings.'}
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Document Upload / Capture Launchpad with Interactive Testing */
                    <div className="border border-dashed border-[#D6D2C9] rounded-xl p-4 bg-[#FFFDF8] space-y-3">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <label className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#0B3A53] hover:bg-[#08283a] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]">
                          <Upload className="w-4 h-4" />
                          <span>{language === 'hi' ? 'फ़ाइल चुनें (JPG, PDF)' : 'Select Document File'}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => handleRealFileUpload(req, e)}
                          />
                        </label>

                        <div className="text-xs text-[#4B5563] text-center sm:text-left">
                          {language === 'hi'
                            ? 'या परीक्षण के लिए सिमुलेशन परिदृश्य चुनें:'
                            : 'Or simulate document quality test:'}
                        </div>
                      </div>

                      {/* Interactive Simulation buttons for ultra fast verification */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#D6D2C9]/60">
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(req, 'clean')}
                          className="px-3 py-1.5 rounded-md bg-[#005B50]/10 hover:bg-[#005B50]/20 text-[#005B50] text-xs font-semibold border border-[#005B50]/30 flex items-center gap-1 min-h-[38px]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'स्पष्ट स्कैन सिमुलेशन' : 'Clear Scan (Pass)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(req, 'blurry')}
                          className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-[#A61B1B] text-xs font-semibold border border-red-200 flex items-center gap-1 min-h-[38px]"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'धुंधली फोटो सिमुलेशन' : 'Blurry Photo (Reject)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(req, 'glare')}
                          className="px-3 py-1.5 rounded-md bg-[#A94600]/10 hover:bg-[#A94600]/20 text-[#A94600] text-xs font-semibold border border-[#A94600]/30 flex items-center gap-1 min-h-[38px]"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'फ्लैश चमक सिमुलेशन' : 'Flash Glare (Warning)'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Optional Documents Section */}
      {optionalReqs.length > 0 && (
        <section aria-labelledby="optional-docs-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4B5563]" />
            <h2 id="optional-docs-heading" className="text-lg font-bold text-[#4B5563]">
              {language === 'hi' ? 'वैकल्पिक दस्तावेज़ (यदि उपलब्ध हों)' : 'Optional Documents (If available)'}
            </h2>
          </div>

          <div className="space-y-4">
            {optionalReqs.map((req) => (
              <div
                key={req.id}
                className="bg-[#F2EFE8]/70 border border-[#D6D2C9] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-semibold text-sm text-[#0B3A53]">{req.name[language]}</h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">{req.whyNeeded[language]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSimulateUpload(req, 'clean')}
                  className="px-3 py-1.5 rounded-lg border border-[#D6D2C9] bg-white text-xs font-semibold text-[#0B3A53] hover:bg-[#F2EFE8] self-start sm:self-auto min-h-[40px]"
                >
                  {language === 'hi' ? 'संलग्न करें (वैकल्पिक)' : 'Attach (Optional)'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Primary Action Sticky Footer / Submission Transition */}
      <div className="bg-[#FFFDF8] border-t border-[#D6D2C9] pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-[#4B5563]">
          {allRequiredMet ? (
            <span className="text-[#005B50] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {language === 'hi'
                ? 'सभी अनिवार्य दस्तावेज़ सत्यापित एवं अनुमत हैं'
                : 'All required documents verified and consented'}
            </span>
          ) : (
            <span className="text-[#A94600] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              {language === 'hi'
                ? `आगे बढ़ने के लिए शेष ${
                    requiredReqs.length - completedRequiredCount
                  } अनिवार्य दस्तावेज़ सत्यापित करें`
                : `${
                    requiredReqs.length - completedRequiredCount
                  } required document(s) remaining before proceeding`}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!allRequiredMet}
          onClick={() => onProceedToReview(service, documentsState)}
          className="px-8 py-4 rounded-xl bg-[#0B3A53] hover:bg-[#08283a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2 min-h-[56px] focus:ring-4 focus:ring-[#005EA8]/30"
        >
          <span>
            {language === 'hi'
              ? 'आवेदन समीक्षा एवं सबमिशन पर आगे बढ़ें'
              : 'Proceed to Application Review & Submission'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
