/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ApplicationCase,
  Language,
  RejectionCategory,
  RejectionRecoveryOption,
  SmsReceipt,
} from '../types/civic';
import {
  applyRejectionCorrectionWithConsent,
  classifyPortalRejection,
} from '../services/keypadAndRejectionService';
import { speakTextAloud, stopSpeakingAloud } from '../services/speechAndLocale';
import {
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Volume2,
  ShieldCheck,
  FileText,
  X,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface RejectionJourneyModalProps {
  language: Language;
  application: ApplicationCase;
  onClose: () => void;
  onApplicationUpdated: (updated: ApplicationCase, sms: SmsReceipt) => void;
  onLaunchFollowUpCall: (app: ApplicationCase) => void;
}

const SIX_REJECTION_CATEGORIES: Array<{
  id: RejectionCategory;
  sampleRawPortalReason: string;
  label: { en: string; hi: string; mr: string };
}> = [
  {
    id: 'missing_document',
    sampleRawPortalReason: 'Income proof missing (Current FY declaration not attached)',
    label: {
      en: '1. Missing Document',
      hi: '1. आवश्यक दस्तावेज़ अनुपस्थित',
      mr: '१. आवश्यक कागदपत्र जोडलेले नाही',
    },
  },
  {
    id: 'unreadable_document',
    sampleRawPortalReason:
      'The address proof is older than the allowed period and all pages were not captured',
    label: {
      en: '2. Unreadable / Invalid Document',
      hi: '2. अस्पष्ट या पुराना दस्तावेज़',
      mr: '२. अस्पष्ट किंवा मुदतबाह्य कागदपत्र',
    },
  },
  {
    id: 'incorrect_form_detail',
    sampleRawPortalReason: 'Name spelling mismatch in form detail vs Aadhaar card',
    label: {
      en: '3. Incorrect Form Detail',
      hi: '3. फॉर्म के विवरण में त्रुटि',
      mr: '३. अर्जातील तपशिलात चूक',
    },
  },
  {
    id: 'eligibility_issue',
    sampleRawPortalReason: 'Income threshold criteria requires EWS/BPL category verification',
    label: {
      en: '4. Eligibility Issue',
      hi: '4. पात्रता मानदंड समस्या',
      mr: '४. पात्रता निकष अडचण',
    },
  },
  {
    id: 'unclear_portal_message',
    sampleRawPortalReason: 'System code ERR_REV_409 returned without clerk remark',
    label: {
      en: '5. Unclear Portal Message',
      hi: '5. अस्पष्ट पोर्टल संदेश',
      mr: '५. अस्पष्ट पोर्टल संदेश',
    },
  },
  {
    id: 'missed_deadline',
    sampleRawPortalReason: 'Verification query response missed deadline window of 15 days',
    label: {
      en: '6. Missed Deadline',
      hi: '6. समय-सीमा समाप्त',
      mr: '६. पडताळणी मुदत संपली',
    },
  },
];

export const RejectionJourneyModal: React.FC<RejectionJourneyModalProps> = ({
  language,
  application,
  onClose,
  onApplicationUpdated,
  onLaunchFollowUpCall,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const initialRejection =
    application.rejectionDetails ||
    classifyPortalRejection(
      'Income proof missing and the address proof is older than the allowed period',
      'REJ-EDIST-402'
    );

  const [activeRejection, setActiveRejection] = useState(initialRejection);
  const [selectedNextStep, setSelectedNextStep] =
    useState<RejectionRecoveryOption>('upload_replacement');
  const [citizenApproved, setCitizenApproved] = useState<boolean>(false);
  const [blockedWarning, setBlockedWarning] = useState<string | null>(null);
  const [submittedSms, setSubmittedSms] = useState<SmsReceipt | null>(null);

  const handleSwitchCategoryDemo = (sampleRawReason: string) => {
    const classified = classifyPortalRejection(sampleRawReason, 'REJ-EDIST-402');
    setActiveRejection(classified);
    setCitizenApproved(false);
    setBlockedWarning(null);
    setSubmittedSms(null);
  };

  const handleHearRejectionExplanation = () => {
    const speech = `${activeRejection.officialReason[language]} ${activeRejection.reassuranceMessage[language]} ${activeRejection.nonAutoResubmitPledge[language]}`;
    speakTextAloud(speech, language);
  };

  const handleAttemptSubmitCorrection = () => {
    if (selectedNextStep === 'approve_followup_call') {
      stopSpeakingAloud();
      onClose();
      onLaunchFollowUpCall(application);
      return;
    }

    const result = applyRejectionCorrectionWithConsent(
      {
        ...application,
        rejectionDetails: activeRejection,
      },
      selectedNextStep,
      citizenApproved
    );

    if (!result.smsReceipt) {
      setBlockedWarning(
        tr(
          'Action Blocked: Pratinidhi NEVER auto-resubmits a rejected application without your fresh approval. Please check the approval box or press 1 first.',
          'रोका गया: प्रतिनिधि आपकी नई अनुमति के बिना कभी भी अस्वीकृत आवेदन को स्वतः दोबारा सबमिट नहीं करता। कृपया पहले सहमति दें (या 1 दबाएं)।',
          'रोखले: प्रतिनिधी तुमच्या नवीन संमतीशिवाय कधीही नाकारलेला अर्ज आपोआप पुन्हा सबमिट करत नाही. कृपया आधी संमती द्या (किंवा 1 दाबा).'
        )
      );
      return;
    }

    setBlockedWarning(null);
    setSubmittedSms(result.smsReceipt);
    onApplicationUpdated(result.updatedApplication, result.smsReceipt);
    speakTextAloud(
      tr(
        'Your correction has been approved and submitted. An official SMS receipt has been sent to your phone.',
        'आपकी सहमति से सुधार सबमिट कर दिया गया है और आपके फोन पर एसएमएस रसीद भेज दी गई है।',
        'तुमच्या संमतीने दुरुस्ती सादर करण्यात आली आहे आणि तुमच्या फोनवर एसएमएस पावती पाठवली आहे.'
      ),
      language
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="rejection-journey-modal"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white border-2 border-[#A61B1B] rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white px-6 sm:px-8 pt-5 pb-4 border-b border-[#D6D2C9] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A61B1B]">
              <AlertTriangle className="w-4 h-4" />
              <span>
                {tr(
                  'First-Class Rejection Recovery Journey (Not an Error Toast)',
                  'अस्वीकृति (Rejection) समाधान एवं पुनर्प्राप्ति यात्रा',
                  'अर्ज नाकारणी (Rejection) निवारण आणि दुरुस्ती प्रवास'
                )}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B3A53]">
              {application.serviceName[language]} —{' '}
              <span className="font-mono text-base sm:text-lg text-[#A61B1B]">
                {application.acknowledgementNumber || application.id}
              </span>
            </h2>
            <p className="text-xs text-[#4B5563]">
              {tr('Applicant:', 'आवेदक:', 'अर्जदार:')} <strong>{application.applicantName}</strong> (
              {application.phoneMasked}) • {application.portalName}
            </p>
          </div>

          <button
            type="button"
            data-testid="close-rejection-modal-top-btn"
            onClick={() => {
              stopSpeakingAloud();
              onClose();
            }}
            className="p-2 text-[#4B5563] hover:text-[#18212B] rounded-lg hover:bg-[#F2EFE8]"
            aria-label="Close rejection journey"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

        {/* Step 1 & 2: Voice + SMS Notification of Official Reason & Reassurance */}
        <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#0B3A53]">
              <MessageSquare className="w-4 h-4 text-[#005B50]" />
              <span>
                {tr(
                  'Step 1 & 2: Spoken Voice Call + SMS Explanation to Citizen',
                  'कदम 1 व 2: नागरिक को कॉल और एसएमएस द्वारा सरकारी कारण की सूचना',
                  'टप्पा १ व २: नागरिकाला कॉल आणि एसएमएसद्वारे अधिकृत कारणाची माहिती'
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleHearRejectionExplanation}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B3A53] text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>
                {tr(
                  'Hear Spoken Explanation',
                  'बोलकर कारण सुनें',
                  'आवाजात कारण ऐका'
                )}
              </span>
            </button>
          </div>

          <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-2">
            <p className="text-sm sm:text-base font-bold text-[#A61B1B]">
              “{activeRejection.officialReason[language]}”
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#005B50]">
              ✓ {activeRejection.reassuranceMessage[language]}
            </p>
            <p className="text-xs text-[#18212B]">
              <strong>
                {tr('Specific Issue:', 'मुख्य समस्या:', 'नेमकी त्रुटी:')}
              </strong>{' '}
              {activeRejection.specificDocumentOrFieldIssue[language]}
            </p>
          </div>
        </div>

        {/* Step 3: 6-Category Problem Classifier */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3A53]">
              {tr(
                'Step 3: 6-Category Portal Rejection Classifier',
                'कदम 3: 6-श्रेणी पोर्टल अस्वीकृति वर्गीकरण',
                'टप्पा ३: ६-श्रेणी पोर्टल रिजेक्शन वर्गीकरण'
              )}
            </span>
            <span className="text-xs font-bold text-[#A61B1B]">
              {tr('Detected:', 'पहचानी गई श्रेणी:', 'ओळखलेली श्रेणी:')}{' '}
              {activeRejection.categoryLabel[language]}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SIX_REJECTION_CATEGORIES.map((cat) => {
              const isCurrent = activeRejection.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSwitchCategoryDemo(cat.sampleRawPortalReason)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-[#0B3A53] text-white border-[#0B3A53]'
                      : 'bg-[#F2EFE8] text-[#18212B] border-[#D6D2C9] hover:bg-white'
                  }`}
                >
                  {cat.label[language]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Valid Service-Specific Next Steps */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B3A53] block">
            {tr(
              'Step 4: Select Valid Recovery Path for This Service',
              'कदम 4: इस सेवा के लिए वैध समाधान विकल्प चुनें',
              'टप्पा ४: या सेवेसाठी वैध दुरुस्ती पर्याय निवडा'
            )}
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {activeRejection.validNextSteps.map((opt) => {
              const isChosen = selectedNextStep === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isChosen
                      ? 'bg-[#F2EFE8] border-[#0B3A53] ring-1 ring-[#0B3A53]/20'
                      : 'bg-white border-[#D6D2C9]'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejection-recovery-option"
                    checked={isChosen}
                    onChange={() => setSelectedNextStep(opt.id)}
                    className="mt-1 text-[#0B3A53] focus:ring-[#0B3A53]"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-[#0B3A53] block">
                      {opt.label[language]}
                    </span>
                    <span className="text-xs text-[#4B5563]">
                      {opt.description[language]}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 5: Non-Auto-Resubmit Gate ("I can prepare the correction. I will not submit it until you approve.") */}
        <div className="bg-[#F2EFE8] border-2 border-[#005B50] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#005B50]">
            <Lock className="w-4 h-4" />
            <span>
              {tr(
                'Step 5: Mandatory Fresh Citizen Approval Gate (Never Auto-Resubmits)',
                'कदम 5: अनिवार्य नई नागरिक सहमति (कभी स्वतः सबमिट नहीं होता)',
                'टप्पा ५: अनिवार्य नवीन नागरिक संमती (कधीही ऑटो-सबमिट होत नाही)'
              )}
            </span>
          </div>

          <p className="text-sm font-bold text-[#0B3A53]">
            “{activeRejection.nonAutoResubmitPledge[language]}”
          </p>

          <label
            htmlFor="citizen-approve-rejection-fix"
            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#D6D2C9] cursor-pointer"
          >
            <input
              id="citizen-approve-rejection-fix"
              data-testid="approve-rejection-fix-checkbox"
              type="checkbox"
              checked={citizenApproved}
              onChange={(e) => {
                setCitizenApproved(e.target.checked);
                if (e.target.checked) setBlockedWarning(null);
              }}
              className="w-5 h-5 rounded border-[#D6D2C9] text-[#005B50] mt-0.5 shrink-0"
            />
            <span className="text-xs sm:text-sm font-semibold text-[#18212B]">
              {tr(
                'Press 1 / Approve: I authorize Pratinidhi to submit this prepared correction/appeal and send my new official receipt by SMS.',
                '1 दबाएं / सहमति दें: मैं प्रतिनिधि को यह तैयार सुधार सबमिट करने और मुझे नई एसएमएस रसीद भेजने की स्पष्ट अनुमति देता हूँ।',
                '1 दाबा / संमती द्या: मी प्रतिनिधीला ही तयार केलेली दुरुस्ती सादर करण्याची आणि मला नवीन एसएमएस पावती पाठवण्याची परवानगी देतो.'
              )}
            </span>
          </label>

          {blockedWarning && (
            <div
              data-testid="rejection-blocked-warning"
              className="bg-red-50 border border-red-300 rounded-lg p-3 text-xs font-bold text-[#A61B1B]"
            >
              {blockedWarning}
            </div>
          )}

          {submittedSms && (
            <div
              data-testid="rejection-resubmitted-sms"
              className="bg-[#005B50]/10 border border-[#005B50] rounded-lg p-3 text-xs space-y-1 text-[#005B50]"
            >
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {tr(
                    'Correction Submitted & SMS Receipt Dispatched!',
                    'सुधार सबमिट हो गया और एसएमएस रसीद भेज दी गई!',
                    'दुरुस्ती सादर झाली आणि एसएमएस पावती पाठवली!'
                  )}
                </span>
              </div>
              <p className="text-[#18212B] font-mono">{submittedSms.messageBody[language]}</p>
            </div>
          )}
        </div>

        </div>

        {/* Fixed Footer Actions */}
        <div className="bg-[#FFFDF8] px-6 sm:px-8 py-4 border-t border-[#D6D2C9] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-xs sm:text-sm font-semibold text-[#4B5563]"
          >
            {tr('Close', 'बंद करें', 'बंद करा')}
          </button>

          <button
            type="button"
            data-testid="submit-rejection-correction-btn"
            onClick={handleAttemptSubmitCorrection}
            className="px-6 py-3 rounded-xl bg-[#005B50] hover:bg-[#00473e] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
          >
            <span>
              {selectedNextStep === 'approve_followup_call'
                ? tr(
                    'Proceed to District Office Call Consent',
                    'जिला कार्यालय कॉल सहमति पर जाएं',
                    'जिल्हा कार्यालय कॉल संमतीकडे जा'
                  )
                : tr(
                    'Approve (Press 1) & Submit Correction',
                    'मंजूरी दें (1 दबाएं) और सुधार सबमिट करें',
                    'मंजुरी द्या (1 दाबा) आणि दुरुस्ती सबमिट करा'
                  )}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
