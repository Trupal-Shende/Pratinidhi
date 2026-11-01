/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, UploadedDocState, ApplicationCase } from '../types/civic';
import { CivicService } from '../services/civicCatalog';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  ExternalLink,
  Lock,
  FileCheck,
  RefreshCw,
  Download,
} from 'lucide-react';

interface ApplicationReviewModalProps {
  language: Language;
  service: CivicService;
  uploadedDocs: Record<string, UploadedDocState>;
  onClose: () => void;
  onSubmitSuccess: (newCase: ApplicationCase) => void;
}

export const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  language,
  service,
  uploadedDocs,
  onClose,
  onSubmitSuccess,
}) => {
  const [applicantName, setApplicantName] = useState('Savitri Devi');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [completedReceipt, setCompletedReceipt] = useState<ApplicationCase | null>(null);

  const handleExecutePortalSubmission = async () => {
    if (!declarationAccepted) return;
    setIsSubmitting(true);

    const steps = [
      language === 'hi' ? '1. सुरक्षित पोर्टल सत्र प्रारंभ किया जा रहा है...' : '1. Initializing isolated browser session on government portal...',
      language === 'hi' ? '2. नागरिक द्वारा अनुमत दस्तावेजों का स्थानीय संपादन (आधार मास्किंग)...' : '2. Redacting sensitive data & applying document privacy filters...',
      language === 'hi' ? '3. फॉर्म प्रविष्टियों की स्वचालित प्रविष्टि...' : '3. Filling confirmed form data on e-District portal...',
      language === 'hi' ? '4. डिजिटल पावती एवं संदर्भ संख्या प्राप्त की जा रही है...' : '4. Capturing official acknowledgement and timestamped receipt...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setSubmissionStep(steps[i]);
      await new Promise((r) => setTimeout(r, 700));
    }

    const ackNo = `UP-${service.code.split('-')[1]}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCase: ApplicationCase = {
      id: `app-${Date.now()}`,
      applicantName,
      phoneMasked: `${phone.slice(0, 6)}*** **${phone.slice(-3)}`,
      preferredLanguage: language,
      serviceId: service.id,
      serviceName: service.name,
      state: service.state,
      portalName: service.portalName,
      acknowledgementNumber: ackNo,
      status: 'in_progress',
      officialStatusText: {
        en: 'Application successfully submitted to Revenue Inspector / Lekhpal queue',
        hi: 'आवेदन सफलतापूर्वक प्रस्तुत; राजस्व निरीक्षक / लेखपाल सत्यापन कतार में',
      },
      plainExplanation: {
        en: `Your application has been received by ${service.portalName}. You will receive SMS updates directly from the department.`,
        hi: `आपका आवेदन ${service.portalName} पर सुरक्षित रूप से जमा हो गया है। विभाग द्वारा आपको सीधे एसएमएस अपडेट भेजे जाएंगे।`,
      },
      submittedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      nextActionDate:
        language === 'hi'
          ? `${service.estimatedDays} कार्य दिवस`
          : `${service.estimatedDays} days SLA`,
      urgency: 'normal',
      documents: Object.values(uploadedDocs).map((doc) => ({
        id: `doc-${Date.now()}-${doc.requirementId}`,
        requirementId: doc.requirementId,
        name: doc.name,
        fileName: doc.fileName,
        verified: doc.status === 'verified',
        qualityScore: doc.qualityScore,
        consentedForPortal: doc.consentedForPortal,
        redactedFields: ['Aadhaar masked', 'Bank details redacted'],
        uploadedAt: doc.uploadedAt,
      })),
      auditTrail: [
        {
          id: `aud-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          action: 'APPLICATION_SUBMITTED_WITH_AFFIRMATIVE_CONSENT',
          actor: 'citizen',
          details: `Confirmed final portal submission for ${service.name.en}`,
        },
        {
          id: `aud-${Date.now()}-2`,
          timestamp: new Date().toISOString(),
          action: 'ACKNOWLEDGEMENT_GENERATED',
          actor: 'portal',
          details: `Official acknowledgement ${ackNo} recorded from portal receipt`,
        },
      ],
    };

    setIsSubmitting(false);
    setCompletedReceipt(newCase);
    onSubmitSuccess(newCase);
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
                ? language === 'hi'
                  ? 'आधिकारिक पावती रसीद'
                  : 'Official Portal Receipt'
                : language === 'hi'
                ? 'अंतिम सबमिशन पुष्टि (अपरिवर्तनीय कार्यवाही)'
                : 'Final Submission Review (Consequential Action)'}
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
          /* Receipt Screen (PRD Screen 15) */
          <div className="space-y-6">
            <div className="bg-[#005B50]/10 border-2 border-[#005B50] rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#005B50] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#005B50]">
                {language === 'hi' ? 'आवेदन सफलतापूर्वक जमा हुआ' : 'Application Submitted Successfully'}
              </h3>
              <p className="text-sm text-[#18212B]">
                {language === 'hi'
                  ? 'सरकारी पोर्टल से आधिकारिक पावती क्रमांक प्राप्त हो गया है।'
                  : 'Captured official acknowledgement number from government portal.'}
              </p>

              <div className="bg-white border border-[#D6D2C9] rounded-lg p-3 inline-block">
                <span className="text-xs text-[#4B5563] uppercase tracking-wider block font-semibold">
                  {language === 'hi' ? 'पावती क्रमांक (Acknowledgement No)' : 'Acknowledgement Number'}
                </span>
                <span className="text-lg sm:text-xl font-mono font-bold text-[#0B3A53]">
                  {completedReceipt.acknowledgementNumber}
                </span>
              </div>
            </div>

            <div className="bg-[#F2EFE8] rounded-xl p-4 text-xs sm:text-sm text-[#18212B] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{language === 'hi' ? 'सेवा का नाम' : 'Service'}:</span>
                <span className="font-semibold">{service.name[language]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{language === 'hi' ? 'पोर्टल' : 'Portal'}:</span>
                <span className="font-semibold">{service.portalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{language === 'hi' ? 'आवेदक' : 'Applicant'}:</span>
                <span className="font-semibold">{completedReceipt.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{language === 'hi' ? 'अनुमानित समय' : 'Estimated SLA'}:</span>
                <span className="font-semibold">{service.estimatedDays} {language === 'hi' ? 'कार्य दिवस' : 'days'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 px-4 py-3 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-sm font-semibold text-[#0B3A53] flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'hi' ? 'रसीद प्रिंट / डाउनलोड करें' : 'Print / Download Receipt'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-[#0B3A53] hover:bg-[#08283a] text-white text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>{language === 'hi' ? 'होमपेज पर वापस जाएं' : 'Return to My Applications'}</span>
              </button>
            </div>
          </div>
        ) : isSubmitting ? (
          /* Live Progress Screen (PRD Screen 13) */
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#0B3A53]/10 flex items-center justify-center mx-auto text-[#0B3A53]">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0B3A53]">
                {language === 'hi' ? 'पोर्टल पर कार्य प्रगति पर है...' : 'Autonomous Portal Automation in Progress'}
              </h3>
              <p className="text-sm text-[#4B5563] mt-2 font-mono bg-[#F2EFE8] p-3 rounded-lg max-w-md mx-auto">
                {submissionStep}
              </p>
            </div>
            <p className="text-xs text-[#005B50] font-medium">
              {language === 'hi'
                ? 'यदि ओटीपी या कैप्चा की आवश्यकता होगी, तो एजेंट रुककर आपसे पूछेगा।'
                : 'The agent will pause and prompt you if OTP or CAPTCHA verification appears.'}
            </p>
          </div>
        ) : (
          /* Review Form (PRD Screen 11 & 12) */
          <div className="space-y-6">
            <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#0B3A53] uppercase tracking-wider">
                {language === 'hi' ? 'आवेदक का विवरण' : 'Applicant Information'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                    {language === 'hi' ? 'आवेदक का पूरा नाम' : 'Full Name'}
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
                    {language === 'hi' ? 'मोबाइल नंबर (ओटीपी के लिए)' : 'Mobile Phone (for OTP)'}
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

            {/* Documents attached */}
            <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-[#0B3A53] uppercase tracking-wider block">
                {language === 'hi' ? 'संलग्न एवं अनुमत दस्तावेज़:' : 'Verified & Consented Documents:'}
              </span>
              <ul className="space-y-1 text-xs text-[#18212B]">
                {Object.values(uploadedDocs).map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#005B50]" />
                    <span>
                      {doc.name} ({doc.fileName}) — {language === 'hi' ? 'गोपनीयता मास्किंग लागू' : 'Masking applied'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Irreversible Action Warning & Consent Checkbox (Design Principle 1) */}
            <div className="bg-[#A94600]/10 border border-[#A94600]/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#A94600] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#18212B]">
                  <strong className="text-[#A94600] block font-bold mb-0.5">
                    {language === 'hi' ? 'महत्वपूर्ण चेतावनी:' : 'Consequential Action Disclosure:'}
                  </strong>
                  {language === 'hi'
                    ? `पुष्टि करने पर यह आवेदन आधिकारिक पोर्टल (${service.portalName}) पर प्रस्तुत कर दिया जाएगा। सबमिशन के बाद इसे पोर्टल से सीधे वापस नहीं लिया जा सकता।`
                    : `By confirming, this application will be formally submitted to ${service.portalName}. Portal submissions are consequential and cannot be undone.`}
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
                  {language === 'hi'
                    ? 'मैं पुष्टि करता हूँ कि सभी जानकारी सत्य है और मैं एजेंट को इस पोर्टल पर सबमिट करने की अनुमति देता हूँ।'
                    : 'I certify that the information provided is accurate and grant explicit consent to execute submission.'}
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
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={!declarationAccepted}
                onClick={handleExecutePortalSubmission}
                className="px-6 py-3.5 rounded-xl bg-[#005B50] hover:bg-[#00473e] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2 min-h-[50px]"
              >
                <span>
                  {language === 'hi' ? 'अंतिम सबमिशन निष्पादित करें' : 'Confirm & Execute Submission'}
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
