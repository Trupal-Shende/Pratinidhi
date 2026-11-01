/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, UploadedDocState } from '../types/civic';
import {
  CivicService,
  DocumentRequirement,
  LifeEventTrigger,
  validateDocumentQuality,
  runPreFlightRejectionCheck,
} from '../services/civicCatalog';
import { getLocalizedStateName } from '../services/speechAndLocale';
import {
  PAPER_DOCUMENT_FALLBACK_ROUTES,
  buildDigiLockerCaseConsent,
} from '../services/keypadAndRejectionService';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Sparkles,
  Layers,
  Wrench,
} from 'lucide-react';

interface DocumentChecklistProps {
  language: Language;
  service: CivicService;
  citizenTranscript: string;
  activeLifeEvent?: LifeEventTrigger | null;
  activeBundleServices?: CivicService[];
  onSwitchBundleService?: (srv: CivicService) => void;
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
  activeLifeEvent,
  activeBundleServices = [],
  onSwitchBundleService,
  onBack,
  onProceedToReview,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  // Pre-Flight Rejection Predictor state
  const [simulateNameMismatch, setSimulateNameMismatch] = useState(false);
  const [simulateExpiredDoc, setSimulateExpiredDoc] = useState(false);
  const [simulateMissingAttestation, setSimulateMissingAttestation] = useState(false);
  const [resolvedPreFlightChecks, setResolvedPreFlightChecks] = useState<Record<string, boolean>>({});

  // Track uploaded documents mapped by requirement ID
  const [documentsState, setDocumentsState] = useState<Record<string, UploadedDocState>>(() => {
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
          mr: 'कागदपत्र सत्यापित. आधारचे पहिले ८ अंक आपोआप लपवले गेले आहेत.',
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
    const flags: any = {};
    const fileSizeKb = 120;
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
        consentedForPortal: validation.status === 'verified',
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

  // Ensure first document of newly switched service is pre-populated if shared in bundle
  useEffect(() => {
    if (service.documents.length > 0) {
      const firstReq = service.documents[0];
      setDocumentsState((prev) => {
        if (prev[firstReq.id]) return prev;
        return {
          ...prev,
          [firstReq.id]: {
            requirementId: firstReq.id,
            name: firstReq.name[language],
            fileName: `${firstReq.id}_verified_shared.jpg`,
            fileSizeKb: 145,
            status: 'verified',
            qualityScore: 95,
            consentedForPortal: true,
            issues: [],
            remediation: {
              en: 'Document verified & shared across linked Life-Event applications.',
              hi: 'दस्तावेज सत्यापित एवं जीवन-घटना बंडल में स्वतः साझा।',
              mr: 'कागदपत्र सत्यापित आणि जीवन-घटना बंडलमध्ये आपोआप सामायिक.',
            },
            uploadedAt: new Date().toISOString(),
          },
        };
      });
    }
  }, [service.id]);

  // Keep uploaded document names localized when language switches
  useEffect(() => {
    setDocumentsState((prev) => {
      const updated: Record<string, UploadedDocState> = {};
      for (const [key, docState] of Object.entries(prev)) {
        const req = service.documents.find((d) => d.id === docState.requirementId);
        updated[key] = {
          ...docState,
          name: req ? req.name[language] : docState.name,
        };
      }
      return updated;
    });
  }, [language, service.documents]);

  const handleVerifyAllRequired = () => {
    const nextState: Record<string, UploadedDocState> = { ...documentsState };
    service.documents
      .filter((d) => d.category === 'required')
      .forEach((req) => {
        nextState[req.id] = {
          requirementId: req.id,
          name: req.name[language],
          fileName: `${req.id}_verified_scan.jpg`,
          fileSizeKb: 138,
          status: 'verified',
          qualityScore: 96,
          consentedForPortal: true,
          issues: [],
          remediation: {
            en: 'Document verified and privacy masking applied.',
            hi: 'दस्तावेज सत्यापित एवं गोपनीयता मास्किंग लागू।',
            mr: 'कागदपत्र सत्यापित आणि गोपनीयता मास्किंग लागू.',
          },
          uploadedAt: new Date().toISOString(),
        };
      });
    setDocumentsState(nextState);
  };

  const requiredReqs = service.documents.filter((d) => d.category === 'required');
  const optionalReqs = service.documents.filter((d) => d.category === 'optional');

  const completedRequiredCount = requiredReqs.filter((req) => {
    const doc = documentsState[req.id];
    return doc && doc.status !== 'rejected' && doc.consentedForPortal;
  }).length;

  const hasLowQualityOrWarningDoc = Object.values(documentsState).some(
    (d) => d.status === 'warning' || d.status === 'rejected'
  );

  const preFlightReport = runPreFlightRejectionCheck(
    service,
    completedRequiredCount,
    requiredReqs.length,
    hasLowQualityOrWarningDoc,
    {
      simulateNameMismatch,
      simulateExpiredDoc,
      simulateMissingAttestation,
      resolvedCheckIds: resolvedPreFlightChecks,
    }
  );

  const allRequiredMet =
    completedRequiredCount === requiredReqs.length &&
    preFlightReport.predictedOutcome !== 'critical_blocker';

  const handleResolvePreFlightCheck = (checkId: string) => {
    setResolvedPreFlightChecks((prev) => ({
      ...prev,
      [checkId]: true,
    }));
  };

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
          <span>{tr('Back', 'वापस जाएं', 'मागे जा')}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
          <span className="font-semibold text-[#18212B]">
            {tr(
              'Step 2 of 3: Document Checklist & Pre-Flight Audit',
              'कदम 2 / 3: दस्तावेज़ चेकलिस्ट एवं अस्वीकृति पूर्व-जांच',
              'टप्पा २ / ३: कागदपत्र यादी आणि अर्ज नाकारणी पूर्व-तपासणी'
            )}
          </span>
        </div>
      </div>

      {/* Multi-Service Life-Event Bundle Banner (if active) */}
      {activeBundleServices.length > 1 && (
        <section className="bg-[#005B50]/10 border-2 border-[#005B50] rounded-2xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005B50]">
              <Layers className="w-4 h-4" />
              <span>
                {activeLifeEvent
                  ? activeLifeEvent.eventTitle[language]
                  : tr(
                      'Life-Event Multi-Service Bundle Active',
                      'जीवन-घटना बहु-सेवा पैकेज सक्रिय',
                      'जीवन-घटना बहु-सेवा पॅकेज सक्रिय'
                    )}{' '}
                ({activeBundleServices.length} {tr('Services', 'सेवाएं', 'सेवा')})
              </span>
            </div>
            <span className="text-xs font-semibold text-[#0B3A53] bg-white px-2.5 py-1 rounded-md border border-[#005B50]/30">
              ✓{' '}
              {tr(
                'Shared Documents (Death Cert, Aadhaar, Passbook) Reused Automatically',
                'साझा दस्तावेज़ (मृत्यु प्रमाण पत्र, आधार, पासबुक) सभी में स्वतः प्रयुक्त',
                'सामायिक कागदपत्रे (मृत्यू दाखला, आधार, पासबुक) सर्व अर्जांत आपोआप वापरली जातात'
              )}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeBundleServices.map((srv, idx) => {
              const isCurrent = srv.id === service.id;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => onSwitchBundleService && onSwitchBundleService(srv)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border min-h-[40px] ${
                    isCurrent
                      ? 'bg-[#0B3A53] text-white border-[#0B3A53] shadow-xs'
                      : 'bg-white text-[#0B3A53] border-[#005B50]/40 hover:bg-[#F2EFE8]'
                  }`}
                >
                  <span className="font-bold">#{idx + 1}</span>
                  <span>{srv.name[language]}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Service Header Info Card */}
      <section className="bg-white border border-[#D6D2C9] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6D2C9] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#005B50] bg-[#005B50]/10 px-2.5 py-0.5 rounded-full border border-[#005B50]/20">
              {getLocalizedStateName(service.state, language)} • {service.code}
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
              {tr('Portal Fee & SLA', 'पोर्टल शुल्क एवं समय', 'पोर्टल शुल्क व कालावधी')}
            </span>
            <div className="text-lg font-bold text-[#0B3A53]">
              {service.officialFee === 0
                ? tr('₹0 (Free)', '₹0 (निःशुल्क)', '₹0 (मोफत)')
                : `₹${service.officialFee}`}
            </div>
            <div className="text-xs text-[#005B50] font-semibold">
              {service.estimatedDays} {tr('days SLA', 'कार्य दिवस', 'कामाचे दिवस')}
            </div>
          </div>
        </div>

        {/* Citizen Voice Intake Context */}
        {citizenTranscript && (
          <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-lg p-3 text-xs sm:text-sm text-[#4B5563] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#005EA8] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#18212B]">
                {tr('Your stated request:', 'आपका अनुरोध:', 'तुमची विनंती:')}
              </span>{' '}
              <span className="italic font-medium">"{citizenTranscript}"</span>
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#18212B] mb-2">
            <span>
              {tr(
                'Document Checklist Progress',
                'दस्तावेज़ पूर्णता स्थिति',
                'कागदपत्र पूर्णता स्थिती'
              )}
            </span>
            <span className={allRequiredMet ? 'text-[#005B50]' : 'text-[#A94600]'}>
              {completedRequiredCount} / {requiredReqs.length}{' '}
              {tr(
                'Required Verified & Consented',
                'आवश्यक पूर्ण',
                'आवश्यक पूर्ण व संमत'
              )}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B3A53]" />
            <h2 id="required-docs-heading" className="text-xl font-bold text-[#18212B]">
              {tr(
                'Required Documents',
                'अनिवार्य दस्तावेज़ (Required Documents)',
                'अनिवार्य कागदपत्रे (Required Documents)'
              )}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0B3A53]/10 text-[#0B3A53]">
              {requiredReqs.length}
            </span>
          </div>

          {completedRequiredCount < requiredReqs.length && (
            <button
              type="button"
              onClick={handleVerifyAllRequired}
              className="px-3 py-1.5 rounded-lg bg-[#005B50]/10 hover:bg-[#005B50]/20 text-[#005B50] border border-[#005B50]/30 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto min-h-[38px]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {tr(
                  'Approve Per-Case DigiLocker Fetch (Press 1)',
                  'केवल इस केस के लिए डिजिलॉकर सहमति दें (1 दबाएं)',
                  'फक्त या केससाठी डिजिलॉकर संमती द्या (1 दाबा)'
                )}
              </span>
            </button>
          )}
        </div>

        {/* DigiLocker Per-Case Consent & Paper Document 4-Route Strategy */}
        <div
          className="bg-[#FFFDF8] border-2 border-[#005B50]/50 rounded-2xl p-5 space-y-3"
          data-testid="checklist-digilocker-banner"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              {tr(
                'Link Once; Consent Per Case & Per Document (No Blanket Access Forever)',
                'एक बार लिंक करें; प्रत्येक केस व दस्तावेज़ पर अलग सहमति',
                'एकदाच लिंक करा; प्रत्येक केस आणि प्रत्येक कागदपत्रासाठी स्वतंत्र संमती'
              )}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#0B3A53]">
            “{buildDigiLockerCaseConsent(service, `CASE-${service.code}-2026`, completedRequiredCount === requiredReqs.length).consentPrompt[language]}”
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-[#D6D2C9] text-xs">
            {PAPER_DOCUMENT_FALLBACK_ROUTES.map((route) => (
              <div
                key={route.id}
                className="bg-white border border-[#D6D2C9] rounded-xl p-2.5 space-y-1"
              >
                <strong className="text-[#0B3A53] block">{route.title[language]}</strong>
                <p className="text-[#4B5563] text-[11px]">
                  {route.zeroDiscretionGuardrail[language]}
                </p>
              </div>
            ))}
          </div>
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
                        {tr('Required', 'अनिवार्य', 'अनिवार्य')}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#0B3A53]">
                        {req.name[language]}
                      </h3>
                    </div>
                    <p className="text-xs text-[#4B5563] mt-1">
                      {tr('Accepted formats:', 'स्वीकार्य प्रारूप:', 'स्वीकृत स्वरूप:')}{' '}
                      <span className="font-medium text-[#18212B]">JPG, PNG, PDF (max 5MB)</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {uploaded ? (
                      uploaded.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#005B50]/10 text-[#005B50] border border-[#005B50]/30">
                          <CheckCircle2 className="w-4 h-4" />
                          {tr(
                            'Quality Verified',
                            'गुणवत्ता सत्यापित (90%+)',
                            'गुणवत्ता सत्यापित (90%+)'
                          )}
                        </span>
                      ) : uploaded.status === 'warning' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A94600]/10 text-[#A94600] border border-[#A94600]/30">
                          <AlertTriangle className="w-4 h-4" />
                          {tr(
                            'Warning / Review',
                            'चेतावनी (सुधार अनुशंसित)',
                            'सूचना (सुधारणा अपेक्षित)'
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A61B1B]/10 text-[#A61B1B] border border-[#A61B1B]/30">
                          <XCircle className="w-4 h-4" />
                          {tr(
                            'Rejected / Unreadable',
                            'अस्वीकृत / अस्पष्ट',
                            'अमान्य / अस्पष्ट'
                          )}
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F2EFE8] text-[#4B5563] border border-[#D6D2C9]">
                        {tr('Pending Upload', 'अपलोड प्रतीक्षारत', 'अपलोड प्रलंबित')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Why Needed Disclosure Drawer */}
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
                        {tr(
                          'Why is this document needed & privacy protection?',
                          'यह दस्तावेज़ क्यों आवश्यक है और गोपनीयता सुरक्षा',
                          'हे कागदपत्र का आवश्यक आहे आणि गोपनीयता सुरक्षा'
                        )}
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
                          {tr('Official Purpose:', 'सरकारी उद्देश्य:', 'शासकीय उद्देश:')}
                        </strong>
                        <p className="text-[#4B5563]">{req.whyNeeded[language]}</p>
                      </div>

                      <div className="pt-2 border-t border-[#D6D2C9]/60">
                        <strong className="text-[#005B50] flex items-center gap-1 mb-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>
                            {tr(
                              'Privacy & Redaction Standard:',
                              'गोपनीयता और डेटा सुरक्षा नियम:',
                              'गोपनीयता आणि डेटा सुरक्षा नियम:'
                            )}
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
                              {uploaded.fileSizeKb} KB • {tr('Quality', 'गुणवत्ता स्कोर', 'गुणवत्ता स्कोर')}:{' '}
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
                            {tr(
                              'Replace Document',
                              'हटाएं व दूसरा अपलोड करें',
                              'काढून टाका व दुसरे अपलोड करा'
                            )}
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
                            {tr('Action Required:', 'सुधार सुझाव:', 'सुधारणा सूचना:')}{' '}
                            {uploaded.remediation[language]}
                          </div>
                        </div>
                      )}

                      {/* Granular Affirmative Consent Switch */}
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
                              {tr(
                                `I consent to sharing this document specifically for ${service.portalName}`,
                                `मैं ${service.portalName} पोर्टल पर इस दस्तावेज़ के उपयोग की अनुमति देता हूँ`,
                                `मी ${service.portalName} पोर्टलवर या कागदपत्राच्या वापरासाठी संमती देतो`
                              )}
                            </span>
                            <span className="text-xs text-[#4B5563]">
                              {tr(
                                'Permission is limited to this single application and can be revoked from privacy settings.',
                                'यह अनुमति केवल इस सेवा तक सीमित है और इसे कभी भी वापस लिया जा सकता है।',
                                'ही परवानगी केवळ या अर्जापुरती मर्यादित आहे आणि ती कधीही मागे घेतली जाऊ शकते.'
                              )}
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
                          <span>
                            {tr(
                              'Select Document File',
                              'फ़ाइल चुनें (JPG, PDF)',
                              'फाईल निवडा (JPG, PDF)'
                            )}
                          </span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => handleRealFileUpload(req, e)}
                          />
                        </label>

                        <div className="text-xs text-[#4B5563] text-center sm:text-left">
                          {tr(
                            'Or simulate document quality test:',
                            'या परीक्षण के लिए सिमुलेशन परिदृश्य चुनें:',
                            'किंवा चाचणीसाठी सिम्युलेशन पर्याय निवडा:'
                          )}
                        </div>
                      </div>

                      {/* Interactive Simulation buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#D6D2C9]/60">
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(req, 'clean')}
                          className="px-3 py-1.5 rounded-md bg-[#005B50]/10 hover:bg-[#005B50]/20 text-[#005B50] text-xs font-semibold border border-[#005B50]/30 flex items-center gap-1 min-h-[38px]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {tr('Clear Scan (Pass)', 'स्पष्ट स्कैन सिमुलेशन', 'स्पष्ट स्कॅन सिम्युलेशन')}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(req, 'blurry')}
                          className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-[#A61B1B] text-xs font-semibold border border-red-200 flex items-center gap-1 min-h-[38px]"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>
                            {tr('Blurry Photo (Reject)', 'धुंधली फोटो सिमुलेशन', 'अंधूक फोटो सिम्युलेशन')}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(req, 'glare')}
                          className="px-3 py-1.5 rounded-md bg-[#A94600]/10 hover:bg-[#A94600]/20 text-[#A94600] text-xs font-semibold border border-[#A94600]/30 flex items-center gap-1 min-h-[38px]"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {tr('Flash Glare (Warning)', 'फ्लैश चमक सिमुलेशन', 'फ्लॅश चमक सिम्युलेशन')}
                          </span>
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
              {tr(
                'Optional Documents (If available)',
                'वैकल्पिक दस्तावेज़ (यदि उपलब्ध हों)',
                'ऐच्छिक कागदपत्रे (उपलब्ध असल्यास)'
              )}
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
                  {tr('Attach (Optional)', 'संलग्न करें (वैकल्पिक)', 'जोडा (ऐच्छिक)')}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rejection Predictor + Pre-Flight Check Section */}
      <section
        aria-labelledby="preflight-heading"
        className={`rounded-2xl border-2 p-6 shadow-sm space-y-5 transition-all ${
          preFlightReport.predictedOutcome === 'critical_blocker'
            ? 'bg-red-50/40 border-[#A61B1B]'
            : preFlightReport.predictedOutcome === 'high_rejection_risk'
            ? 'bg-[#FFFDF8] border-[#A94600]'
            : 'bg-white border-[#005B50]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6D2C9]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3A53]/10 text-[#0B3A53] text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#005B50]" />
              <span>
                {tr(
                  `Saves ~${preFlightReport.estimatedDaysSaved} Days of Clerk Rejection Delay`,
                  `क्लर्क द्वारा निरस्त होने के ~${preFlightReport.estimatedDaysSaved} दिनों के विलंब से बचाता है`,
                  `अर्ज नाकारल्यामुळे होणारा ~${preFlightReport.estimatedDaysSaved} दिवसांचा विलंब टाळतो`
                )}
              </span>
            </div>
            <h2 id="preflight-heading" className="text-xl sm:text-2xl font-bold text-[#0B3A53]">
              {tr(
                'Rejection Predictor + Pre-Flight Check',
                'अस्वीकृति पूर्वानुमान एवं प्री-फ़्लाइट जांच (Pre-Flight Check)',
                'अर्ज नाकारणी पूर्वानुमान आणि प्री-फ्लाईट तपासणी (Pre-Flight Check)'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              {tr(
                'Government applications mostly fail on trivia (name spelling mismatch, expired bill, wrong KB size, or missing seal). Pratinidhi audits all 4 before submitting.',
                'सरकारी आवेदन अक्सर छोटी कमियों (नाम की स्पेलिंग में अंतर, पुराना बिल, गलत KB आकार या मुहर छूटना) से खारिज होते हैं। सबमिट से पहले इन चारों की जांच की जाती है।',
                'शासकीय अर्ज बहुतेकदा किरकोळ कारणांमुळे (नावातील स्पेलिंग तफावत, जुने बिल, चुकीचा KB आकार किंवा शिक्का नसणे) नाकारले जातात. सबमिशनपूर्वी या ४ बाबींची तपासणी केली जाते.'
              )}
            </p>
          </div>

          {/* Readiness Score Gauge */}
          <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 text-center sm:min-w-[190px] shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
              {tr('Approval Readiness', 'स्वीकृति संभावना स्कोर', 'मंजुरी संभाव्यता स्कोर')}
            </span>
            <div
              className={`text-2xl sm:text-3xl font-extrabold mt-0.5 ${
                preFlightReport.readinessScore >= 85
                  ? 'text-[#005B50]'
                  : preFlightReport.readinessScore >= 65
                  ? 'text-[#A94600]'
                  : 'text-[#A61B1B]'
              }`}
            >
              {preFlightReport.readinessScore}%
            </div>
            <span
              className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                preFlightReport.predictedOutcome === 'likely_approved'
                  ? 'bg-[#005B50]/15 text-[#005B50]'
                  : preFlightReport.predictedOutcome === 'high_rejection_risk'
                  ? 'bg-[#A94600]/15 text-[#A94600]'
                  : 'bg-[#A61B1B]/15 text-[#A61B1B]'
              }`}
            >
              {preFlightReport.predictedOutcome === 'likely_approved'
                ? tr('Likely Approved First Try', 'प्रथम प्रयास में स्वीकृति योग्य', 'पहिल्याच प्रयत्नात मंजुरीस पात्र')
                : preFlightReport.predictedOutcome === 'high_rejection_risk'
                ? tr('Medium Risk — Review Warnings', 'मध्यम जोखिम — चेतावनी देखें', 'मध्यम धोका — सूचना तपासा')
                : tr('Critical Trivia Blocker Detected', 'अस्वीकृति का गंभीर जोखिम मिला', 'अर्ज नाकारला जाण्याचा गंभीर धोका')}
            </span>
          </div>
        </div>

        {/* Interactive Trivia Simulation Bar */}
        <div className="bg-[#F2EFE8]/80 border border-[#D6D2C9] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#0B3A53]">
            {tr(
              'Test how Pratinidhi catches common rejection trivia:',
              'परीक्षण करें कि एजेंट सामान्य अस्वीकृति कारणों को कैसे पकड़ता है:',
              'एजंट अर्ज नाकारण्याची सामान्य कारणे कशी पकडतो याची चाचणी करा:'
            )}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setSimulateNameMismatch((v) => !v);
                setResolvedPreFlightChecks((prev) => ({
                  ...prev,
                  'check-name-mismatch': false,
                }));
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px] ${
                simulateNameMismatch && !resolvedPreFlightChecks['check-name-mismatch']
                  ? 'bg-[#A61B1B] text-white border-[#A61B1B]'
                  : 'bg-white text-[#0B3A53] border-[#D6D2C9] hover:bg-[#FFFDF8]'
              }`}
            >
              {tr('Simulate Name Mismatch', 'नाम में अंतर सिमुलेशन', 'नाव तफावत सिम्युलेशन')}
            </button>
            <button
              type="button"
              onClick={() => {
                setSimulateExpiredDoc((v) => !v);
                setResolvedPreFlightChecks((prev) => ({
                  ...prev,
                  'check-expired-doc': false,
                }));
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px] ${
                simulateExpiredDoc && !resolvedPreFlightChecks['check-expired-doc']
                  ? 'bg-[#A61B1B] text-white border-[#A61B1B]'
                  : 'bg-white text-[#0B3A53] border-[#D6D2C9] hover:bg-[#FFFDF8]'
              }`}
            >
              {tr('Simulate Expired Date', 'पुराना दस्तावेज़ सिमुलेशन', 'मुदतबाह्य तारीख सिम्युलेशन')}
            </button>
            <button
              type="button"
              onClick={() => {
                setSimulateMissingAttestation((v) => !v);
                setResolvedPreFlightChecks((prev) => ({
                  ...prev,
                  'check-missing-attestation': false,
                }));
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px] ${
                simulateMissingAttestation && !resolvedPreFlightChecks['check-missing-attestation']
                  ? 'bg-[#A61B1B] text-white border-[#A61B1B]'
                  : 'bg-white text-[#0B3A53] border-[#D6D2C9] hover:bg-[#FFFDF8]'
              }`}
            >
              {tr('Simulate Missing Seal', 'मुहर/हस्ताक्षर कमी सिमुलेशन', 'शिक्का/स्वाक्षरी अभाव सिम्युलेशन')}
            </button>
          </div>
        </div>

        {/* 4 Pre-Flight Check Items */}
        <div className="grid grid-cols-1 gap-3">
          {preFlightReport.checks.map((chk) => (
            <div
              key={chk.id}
              className={`rounded-xl border p-4 transition-all ${
                chk.status === 'passed'
                  ? 'bg-[#FFFDF8] border-[#D6D2C9]'
                  : chk.status === 'warning'
                  ? 'bg-[#A94600]/5 border-[#A94600]/40'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  {chk.status === 'passed' ? (
                    <CheckCircle2 className="w-5 h-5 text-[#005B50] shrink-0 mt-0.5" />
                  ) : chk.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-[#A94600] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#A61B1B] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#0B3A53]">
                        {chk.title[language]}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F2EFE8] text-[#4B5563] border border-[#D6D2C9]">
                        {chk.rejectionRiskPercent}%{' '}
                        {tr('of portal rejections', 'अस्वीकृति का कारण', 'अर्ज नाकारण्याचे प्रमाण')}
                      </span>
                    </div>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      {chk.commonTrivialFailure[language]}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 self-start sm:self-center ${
                    chk.status === 'passed'
                      ? 'bg-[#005B50]/10 text-[#005B50]'
                      : chk.status === 'warning'
                      ? 'bg-[#A94600]/15 text-[#A94600]'
                      : 'bg-[#A61B1B] text-white'
                  }`}
                >
                  {chk.status === 'passed'
                    ? tr('Pre-Flight Passed', 'जांच सफल', 'तपासणी यशस्वी')
                    : chk.status === 'warning'
                    ? tr('Warning', 'चेतावनी', 'सूचना')
                    : tr('Blocker Detected', 'त्रुटि मिली', 'त्रुटी आढळली')}
                </span>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-[#D6D2C9]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    chk.status === 'failed'
                      ? 'text-[#A61B1B] font-semibold'
                      : chk.status === 'warning'
                      ? 'text-[#A94600]'
                      : 'text-[#005B50]'
                  }`}
                >
                  {chk.detailMessage[language]}
                </p>

                {chk.status !== 'passed' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (chk.id === 'check-wrong-format' && completedRequiredCount < requiredReqs.length) {
                        handleVerifyAllRequired();
                      }
                      handleResolvePreFlightCheck(chk.id);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#0B3A53] hover:bg-[#08283a] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto min-h-[38px]"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{chk.fixActionLabel[language]}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Action Sticky Footer / Submission Transition */}
      <div className="bg-[#FFFDF8] border-t border-[#D6D2C9] pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-[#4B5563]">
          {allRequiredMet ? (
            <span className="text-[#005B50] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {tr(
                `All required documents & Pre-Flight Checks (${preFlightReport.readinessScore}% Ready) verified`,
                `सभी अनिवार्य दस्तावेज़ एवं प्री-फ़्लाइट जांच (${preFlightReport.readinessScore}% तैयार) पूर्ण`,
                `सर्व अनिवार्य कागदपत्रे आणि प्री-फ्लाईट तपासणी (${preFlightReport.readinessScore}% तयार) पूर्ण`
              )}
            </span>
          ) : preFlightReport.predictedOutcome === 'critical_blocker' ? (
            <span className="text-[#A61B1B] font-semibold flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              {tr(
                'Please resolve the highlighted Pre-Flight Rejection Blocker above before submitting',
                'सबमिट करने से पहले ऊपर चिह्नित प्री-फ़्लाइट त्रुटि का समाधान करें',
                'सबमिट करण्यापूर्वी वर दर्शविलेल्या प्री-फ्लाईट त्रुटीचे निराकरण करा'
              )}
            </span>
          ) : (
            <span className="text-[#A94600] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              {tr(
                `${requiredReqs.length - completedRequiredCount} required document(s) remaining before proceeding`,
                `आगे बढ़ने के लिए शेष ${requiredReqs.length - completedRequiredCount} अनिवार्य दस्तावेज़ सत्यापित करें`,
                `पुढे जाण्यासाठी उर्वरित ${requiredReqs.length - completedRequiredCount} अनिवार्य कागदपत्रे सत्यापित करा`
              )}
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
            {activeBundleServices.length > 1
              ? tr(
                  `Review & Submit All ${activeBundleServices.length} Bundled Services`,
                  `सभी ${activeBundleServices.length} जुड़ी सेवाओं की समीक्षा व सबमिट करें`,
                  `सर्व ${activeBundleServices.length} संलग्न सेवांचे पुनरावलोकन व सबमिट करा`
                )
              : tr(
                  'Proceed to Application Review & Submission',
                  'आवेदन समीक्षा एवं सबमिशन पर आगे बढ़ें',
                  'अर्ज पुनरावलोकन आणि सबमिशनसाठी पुढे जा'
                )}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
