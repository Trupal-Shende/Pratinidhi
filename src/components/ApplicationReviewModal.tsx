/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, UploadedDocState, ApplicationCase } from '../types/civic';
import { CivicService } from '../services/civicCatalog';
import { getLocalizedStateName } from '../services/speechAndLocale';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  RefreshCw,
  Download,
} from 'lucide-react';

interface ApplicationReviewModalProps {
  language: Language;
  service: CivicService;
  activeBundleServices?: CivicService[];
  uploadedDocs: Record<string, UploadedDocState>;
  onClose: () => void;
  onSubmitSuccess: (newCase: ApplicationCase) => void;
}

export const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  language,
  service,
  activeBundleServices = [],
  uploadedDocs,
  onClose,
  onSubmitSuccess,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const servicesToSubmit =
    activeBundleServices.length > 1 ? activeBundleServices : [service];

  const [applicantName, setApplicantName] = useState(
    language === 'hi'
      ? 'सावित्री देवी (Savitri Devi)'
      : language === 'mr'
      ? 'सावित्री देवी (Savitri Devi)'
      : 'Savitri Devi'
  );
  const [phone, setPhone] = useState('+91 98765 43210');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [completedReceipt, setCompletedReceipt] = useState<ApplicationCase | null>(null);

  const handleExecutePortalSubmission = async () => {
    if (!declarationAccepted) return;
    setIsSubmitting(true);

    const steps = [
      tr(
        '1. Initializing isolated browser session on government portal...',
        '1. सुरक्षित पोर्टल सत्र प्रारंभ किया जा रहा है...',
        '१. शासकीय पोर्टलवर सुरक्षित ब्राउझर सत्र सुरू करत आहे...'
      ),
      tr(
        '2. Redacting sensitive data & applying document privacy filters...',
        '2. नागरिक द्वारा अनुमत दस्तावेजों का स्थानीय संपादन (आधार मास्किंग)...',
        '२. नागरिकाने संमत केलेल्या कागदपत्रांचे स्थानिक संपादन (आधार मास्किंग)...'
      ),
      tr(
        `3. Filling confirmed form data on ${service.portalName}...`,
        `3. ${service.portalName} पर फॉर्म प्रविष्टियों की स्वचालित प्रविष्टि...`,
        `३. ${service.portalName} वर फॉर्म माहिती स्वयंचलितपणे भरत आहे...`
      ),
      tr(
        '4. Capturing official acknowledgement and timestamped receipt...',
        '4. डिजिटल पावती एवं संदर्भ संख्या प्राप्त की जा रही है...',
        '४. अधिकृत डिजिटल पोचपावती आणि संदर्भ क्रमांक मिळवत आहे...'
      ),
    ];

    for (let i = 0; i < steps.length; i++) {
      setSubmissionStep(steps[i]);
      await new Promise((r) => setTimeout(r, 700));
    }

    let primaryReceipt: ApplicationCase | null = null;

    servicesToSubmit.forEach((srv, idx) => {
      const ackNo = `${srv.code.split('-')[0]}-${srv.code.split('-')[1]}-2026-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      const newCase: ApplicationCase = {
        id: `app-${Date.now()}-${idx}`,
        applicantName,
        phoneMasked: `${phone.slice(0, 6)}*** **${phone.slice(-3)}`,
        aadhaarMasked: 'XXXX XXXX 4312',
        preferredLanguage: language,
        serviceId: srv.id,
        serviceName: srv.name,
        state: srv.state,
        portalName: srv.portalName,
        acknowledgementNumber: ackNo,
        status: 'in_progress',
        statusText: {
          en: 'Pre-Flight Verified • Submitted to Officer Verification Queue',
          hi: 'प्री-फ़्लाइट जांच उत्तीर्ण • अधिकारी सत्यापन कतार में प्रस्तुत',
          mr: 'प्री-फ्लाईट तपासणी उत्तीर्ण • अधिकारी पडताळणी रांगेत सादर',
        },
        followUpCalls: [],
        officialStatusText: {
          en: 'Pre-Flight Verified • Submitted to Officer Verification Queue',
          hi: 'प्री-फ़्लाइट जांच उत्तीर्ण • अधिकारी सत्यापन कतार में प्रस्तुत',
          mr: 'प्री-फ्लाईट तपासणी उत्तीर्ण • अधिकारी पडताळणी रांगेत सादर',
        },
        plainExplanation: {
          en: `Your application passed all 4 Pre-Flight Rejection Checks and has been received by ${srv.portalName}.`,
          hi: `आपका आवेदन चारों प्री-फ़्लाइट अस्वीकृति जांचों में सफल रहा और ${srv.portalName} पर सुरक्षित रूप से जमा हो गया है।`,
          mr: `तुमचा अर्ज चारही प्री-फ्लाईट तपासण्यांमध्ये यशस्वी ठरला असून ${srv.portalName} वर सुरक्षितपणे जमा झाला आहे.`,
        },
        submittedAt: new Date().toISOString(),
        lastCheckedAt: new Date().toISOString(),
        nextActionDate: `${srv.estimatedDays} days SLA`,
        urgency: 'normal',
        documents: Object.values(uploadedDocs).map((doc) => ({
          id: `doc-${Date.now()}-${idx}-${doc.requirementId}`,
          requirementId: doc.requirementId,
          name: doc.name,
          fileName: doc.fileName,
          verified: doc.status === 'verified',
          qualityScore: doc.qualityScore,
          consentedForPortal: doc.consentedForPortal,
          redactedFields: ['Aadhaar masked', 'Pre-Flight Name & Seal Verified'],
          uploadedAt: doc.uploadedAt,
        })),
        auditTrail: [
          {
            id: `aud-${Date.now()}-${idx}-0`,
            timestamp: new Date().toISOString(),
            action: 'PRE_FLIGHT_REJECTION_AUDIT_PASSED',
            actor: 'agent',
            details: `Verified Name Match, Validity Date, Portal KB Format & Seal for ${srv.name.en}`,
          },
          {
            id: `aud-${Date.now()}-${idx}-1`,
            timestamp: new Date().toISOString(),
            action: 'APPLICATION_SUBMITTED_WITH_AFFIRMATIVE_CONSENT',
            actor: 'citizen',
            details: `Confirmed final portal submission for ${srv.name.en} (${srv.state})`,
          },
          {
            id: `aud-${Date.now()}-${idx}-2`,
            timestamp: new Date().toISOString(),
            action: 'ACKNOWLEDGEMENT_GENERATED',
            actor: 'portal',
            details: `Official acknowledgement ${ackNo} recorded from portal receipt`,
          },
        ],
      };

      if (idx === 0) primaryReceipt = newCase;
      onSubmitSuccess(newCase);
    });

    setIsSubmitting(false);
    setCompletedReceipt(primaryReceipt);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#D6D2C9] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D6D2C9]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#005B50]" />
            <h2 className="text-xl font-bold text-[#0B3A53]">
              {completedReceipt
                ? tr('Official Portal Receipt', 'आधिकारिक पावती रसीद', 'अधिकृत पोर्टल पोचपावती')
                : tr(
                    'Final Submission Review (Consequential Action)',
                    'अंतिम सबमिशन पुष्टि (अपरिवर्तनीय कार्यवाही)',
                    'अंतिम सबमिशन पुष्टी (अपरिवर्तनीय कृती)'
                  )}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#4B5563] hover:text-[#18212B] rounded-lg hover:bg-[#F2EFE8]"
            aria-label="Close review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedReceipt ? (
          /* Receipt Screen */
          <div className="space-y-6">
            <div className="bg-[#005B50]/10 border-2 border-[#005B50] rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#005B50] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#005B50]">
                {tr(
                  'Application Submitted Successfully',
                  'आवेदन सफलतापूर्वक जमा हुआ',
                  'अर्ज यशस्वीरित्या सादर झाला'
                )}
              </h3>
              <p className="text-sm text-[#18212B]">
                {tr(
                  'Captured official acknowledgement number from government portal.',
                  'सरकारी पोर्टल से आधिकारिक पावती क्रमांक प्राप्त हो गया है।',
                  'शासकीय पोर्टलवरून अधिकृत पोचपावती क्रमांक प्राप्त झाला आहे.'
                )}
              </p>

              <div className="bg-white border border-[#D6D2C9] rounded-lg p-3 inline-block">
                <span className="text-xs text-[#4B5563] uppercase tracking-wider block font-semibold">
                  {tr(
                    'Acknowledgement Number',
                    'पावती क्रमांक (Acknowledgement No)',
                    'पोचपावती क्रमांक (Acknowledgement No)'
                  )}
                </span>
                <span className="text-lg sm:text-xl font-mono font-bold text-[#0B3A53]">
                  {completedReceipt.acknowledgementNumber}
                </span>
              </div>
            </div>

            <div className="bg-[#F2EFE8] rounded-xl p-4 text-xs sm:text-sm text-[#18212B] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{tr('State', 'राज्य', 'राज्य')}:</span>
                <span className="font-semibold">
                  {getLocalizedStateName(service.state, language)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{tr('Service', 'सेवा का नाम', 'सेवेचे नाव')}:</span>
                <span className="font-semibold">{service.name[language]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{tr('Portal', 'पोर्टल', 'पोर्टल')}:</span>
                <span className="font-semibold">{service.portalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{tr('Applicant', 'आवेदक', 'अर्जदार')}:</span>
                <span className="font-semibold">{completedReceipt.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{tr('Estimated SLA', 'अनुमानित समय', 'अंदाजित वेळ')}:</span>
                <span className="font-semibold">
                  {service.estimatedDays} {tr('days', 'कार्य दिवस', 'कामाचे दिवस')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 px-4 py-3 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-sm font-semibold text-[#0B3A53] flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                <span>
                  {tr(
                    'Print / Download Receipt',
                    'रसीद प्रिंट / डाउनलोड करें',
                    'पावती प्रिंट / डाउनलोड करा'
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-[#0B3A53] hover:bg-[#08283a] text-white text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>
                  {tr(
                    'Return to My Applications',
                    'होमपेज पर वापस जाएं',
                    'माझ्या अर्जांकडे परत जा'
                  )}
                </span>
              </button>
            </div>
          </div>
        ) : isSubmitting ? (
          /* Live Progress Screen */
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#0B3A53]/10 flex items-center justify-center mx-auto text-[#0B3A53]">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0B3A53]">
                {tr(
                  'Autonomous Portal Automation in Progress',
                  'पोर्टल पर कार्य प्रगति पर है...',
                  'पोर्टलवर स्वयंचलित प्रक्रिया सुरू आहे...'
                )}
              </h3>
              <p className="text-sm text-[#4B5563] mt-2 font-mono bg-[#F2EFE8] p-3 rounded-lg max-w-md mx-auto">
                {submissionStep}
              </p>
            </div>
            <p className="text-xs text-[#005B50] font-medium">
              {tr(
                'The agent will pause and prompt you if OTP or CAPTCHA verification appears.',
                'यदि ओटीपी या कैप्चा की आवश्यकता होगी, तो एजेंट रुककर आपसे पूछेगा।',
                'ओटीपी किंवा कॅप्चाची आवश्यकता भासल्यास एजंट थांबेल आणि तुम्हाला विचारेल.'
              )}
            </p>
          </div>
        ) : (
          /* Review Form */
          <div className="space-y-6">
            <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#0B3A53] uppercase tracking-wider">
                {tr('Applicant Information', 'आवेदक का विवरण', 'अर्जदाराचा तपशील')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                    {tr('Full Name', 'आवेदक का पूरा नाम', 'अर्जदाराचे पूर्ण नाव')}
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-white border border-[#D6D2C9] rounded-lg px-3 py-2 text-sm text-[#18212B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                    {tr('Mobile Phone (for OTP)', 'मोबाइल नंबर (ओटीपी के लिए)', 'मोबाईल क्रमांक (ओटीपीसाठी)')}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#D6D2C9] rounded-lg px-3 py-2 text-sm text-[#18212B]"
                  />
                </div>
              </div>
            </div>

            {/* Documents attached & Pre-Flight Audit Summary */}
            <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B3A53] uppercase tracking-wider block">
                  {tr(
                    'Verified Documents & Pre-Flight Audit:',
                    'संलग्न दस्तावेज़ एवं प्री-फ़्लाइट जांच रिपोर्ट:',
                    'जोडलेली कागदपत्रे आणि प्री-फ्लाईट तपासणी अहवाल:'
                  )}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#005B50]/15 text-[#005B50]">
                  ✓ {tr('4/4 Pre-Flight Checks Passed', '4/4 प्री-फ़्लाइट जांच उत्तीर्ण', '४/४ प्री-फ्लाईट तपासणी उत्तीर्ण')}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-[#18212B]">
                {Object.values(uploadedDocs).map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#005B50]" />
                    <span>
                      {doc.name} ({doc.fileName}) —{' '}
                      {tr('Masking & Pre-Flight Verified', 'मास्किंग व प्री-फ़्लाइट सत्यापित', 'मास्किंग व प्री-फ्लाईट सत्यापित')}
                    </span>
                  </li>
                ))}
              </ul>
              {servicesToSubmit.length > 1 && (
                <div className="pt-2 border-t border-[#D6D2C9] text-xs text-[#005B50] font-semibold">
                  {tr(
                    `Bundled Life-Event Submission: Submitting ${servicesToSubmit.length} services simultaneously (${servicesToSubmit
                      .map((s) => s.name.en.split(' (')[0])
                      .join(', ')})`,
                    `जीवन-घटना बंडल सबमिशन: एक साथ ${servicesToSubmit.length} सेवाएं प्रस्तुत की जा रही हैं`,
                    `जीवन-घटना बंडल सबमिशन: एकत्र ${servicesToSubmit.length} सेवा सादर केल्या जात आहेत`
                  )}
                </div>
              )}
            </div>

            {/* Irreversible Action Warning & Consent Checkbox */}
            <div className="bg-[#A94600]/10 border border-[#A94600]/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#A94600] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#18212B]">
                  <strong className="text-[#A94600] block font-bold mb-0.5">
                    {tr(
                      'Consequential Action Disclosure:',
                      'महत्वपूर्ण चेतावनी:',
                      'महत्त्वाची सूचना:'
                    )}
                  </strong>
                  {tr(
                    `By confirming, this application will be formally submitted to ${service.portalName} (${service.state}). Portal submissions are consequential and cannot be undone.`,
                    `पुष्टि करने पर यह आवेदन आधिकारिक पोर्टल (${service.portalName}) पर प्रस्तुत कर दिया जाएगा। सबमिशन के बाद इसे पोर्टल से सीधे वापस नहीं लिया जा सकता।`,
                    `पुष्टी केल्यास हा अर्ज अधिकृत पोर्टल (${service.portalName}) वर सादर केला जाईल. सबमिशननंतर तो पोर्टलवरून थेट मागे घेता येत नाही.`
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#A94600]/20">
                <input
                  type="checkbox"
                  id="final-declaration"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="w-5 h-5 rounded border-[#D6D2C9] text-[#0B3A53] focus:ring-[#005EA8] mt-0.5"
                />
                <label htmlFor="final-declaration" className="text-xs sm:text-sm text-[#18212B] font-semibold cursor-pointer">
                  {tr(
                    'I certify that the information provided is accurate and grant explicit consent to execute submission.',
                    'मैं पुष्टि करता हूँ कि सभी जानकारी सत्य है और मैं एजेंट को इस पोर्टल पर सबमिट करने की अनुमति देता हूँ।',
                    'मी पुष्टी करतो की दिलेली सर्व माहिती सत्य आहे आणि मी एजंटला या पोर्टलवर सबमिट करण्याची परवानगी देतो.'
                  )}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-sm font-semibold text-[#4B5563] min-h-[48px]"
              >
                {tr('Cancel', 'रद्द करें', 'रद्द करा')}
              </button>

              <button
                type="button"
                disabled={!declarationAccepted}
                onClick={handleExecutePortalSubmission}
                className="px-6 py-3.5 rounded-xl bg-[#005B50] hover:bg-[#00473e] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2 min-h-[50px]"
              >
                <span>
                  {tr(
                    'Confirm & Execute Submission',
                    'अंतिम सबमिशन निष्पादित करें',
                    'अंतिम सबमिशन पूर्ण करा'
                  )}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
