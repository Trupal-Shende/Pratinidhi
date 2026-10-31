/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ApplicationCase, Language } from '../types/civic';
import {
  X,
  PhoneCall,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  FileText,
  User,
  History,
  PhoneForwarded,
} from 'lucide-react';

interface ApplicationDetailModalProps {
  language: Language;
  application: ApplicationCase;
  onClose: () => void;
  onRefreshStatus?: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  language,
  application,
  onClose,
  onRefreshStatus,
}) => {
  const [showFollowUpCallModal, setShowFollowUpCallModal] = useState(false);
  const [callApproved, setCallApproved] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'completed'>('idle');

  const handleStartFollowUpCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('completed');
    }, 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#D6D2C9] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#D6D2C9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#005B50] bg-[#005B50]/10 px-2 py-0.5 rounded">
                {application.state}
              </span>
              {application.acknowledgementNumber && (
                <span className="font-mono text-xs font-semibold bg-[#F2EFE8] px-2 py-0.5 rounded text-[#0B3A53]">
                  {application.acknowledgementNumber}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B3A53] mt-1">
              {application.serviceName[language]}
            </h2>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {language === 'hi' ? 'आवेदक' : 'Applicant'}: {application.applicantName} ({application.phoneMasked})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#4B5563] hover:text-[#18212B] rounded-lg hover:bg-[#F2EFE8]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Status vs Plain English Explanation (Design Principle 2) */}
        <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                {language === 'hi' ? 'सरकारी पोर्टल की वर्तमान स्थिति:' : 'Official Government Portal Status:'}
              </span>
              <p className="text-base font-bold text-[#18212B] font-mono mt-0.5">
                {application.officialStatusText[language]}
              </p>
            </div>
            <div className="text-xs text-[#4B5563]">
              {language === 'hi' ? 'पोर्टल' : 'Portal'}:{' '}
              <span className="font-semibold text-[#0B3A53]">{application.portalName}</span>
            </div>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-lg p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] block mb-1">
              {language === 'hi' ? 'नागरिक के लिए सरल व्याख्या:' : 'Plain-Language Meaning for Citizen:'}
            </span>
            <p className="text-sm font-medium text-[#18212B] leading-relaxed">
              {application.plainExplanation[language]}
            </p>
          </div>
        </div>

        {/* Stalled / Action Needed Prompt & Follow-up Calling workflow (PRD Section 6H) */}
        {application.urgency === 'high' && (
          <div className="bg-[#A94600]/10 border border-[#A94600]/30 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <PhoneForwarded className="w-5 h-5 text-[#A94600] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#A94600]">
                  {language === 'hi'
                    ? 'आवेदन में विलंब — अनुमत फॉलो-अप कॉल उपलब्ध'
                    : 'Application Stalled / Delayed — Approved Follow-up Call'}
                </h4>
                <p className="text-xs text-[#18212B] mt-1">
                  {language === 'hi'
                    ? 'आपकी सहमति से एजेंट जिला समाज कल्याण अधिकारी / तहसील हेल्पलाइन को कॉल करके पारदर्शी अपडेट ले सकता है।'
                    : 'With your explicit permission, the agent can place an authorized follow-up call to the district helpline.'}
                </p>
              </div>
            </div>

            {callStatus === 'idle' ? (
              <button
                type="button"
                onClick={() => setShowFollowUpCallModal(true)}
                className="px-4 py-2 rounded-lg bg-[#A94600] text-white text-xs sm:text-sm font-semibold hover:bg-[#883600] transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{language === 'hi' ? 'कॉल स्क्रिप्ट की समीक्षा व स्वीकृति दें' : 'Review & Approve Call Script'}</span>
              </button>
            ) : callStatus === 'calling' ? (
              <div className="text-xs font-bold text-[#0B3A53] flex items-center gap-2 bg-white p-3 rounded-lg border border-[#D6D2C9]">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                <span>
                  {language === 'hi'
                    ? 'तहसील कार्यालय से संपर्क किया जा रहा है... (पारदर्शी कॉल प्रारंभ)'
                    : 'Calling Tehsil Helpline... Disclosing automated authorized assistant'}
                </span>
              </div>
            ) : (
              <div className="text-xs text-[#005B50] font-semibold bg-white p-3 rounded-lg border border-[#005B50]/30">
                ✓{' '}
                {language === 'hi'
                  ? 'कॉल संपन्न: अधिकारी ने पुष्टि की कि आगामी मंगलवार को शिविर में बायोमेट्रिक ई-केवाईसी स्वीकार होगी।'
                  : 'Call Outcome: Official confirmed biometric e-KYC camp will update this record next Tuesday.'}
              </div>
            )}
          </div>
        )}

        {/* Script approval drawer if requested */}
        {showFollowUpCallModal && callStatus === 'idle' && (
          <div className="bg-[#FFFDF8] border-2 border-[#A94600] rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-[#0B3A53]">
              {language === 'hi' ? 'अनुमोदित कॉल स्क्रिप्ट समीक्षा:' : 'Approved Call Script Review:'}
            </h4>
            <p className="text-xs font-mono bg-white p-3 rounded border border-[#D6D2C9] text-[#18212B]">
              "Hello, I am calling on behalf of applicant {application.applicantName} regarding application{' '}
              {application.acknowledgementNumber || 'UP-SSPY-2026-78419'}. The citizen has authorized this inquiry
              regarding life verification status. No bank secrets or Aadhaar numbers will be shared."
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#4B5563]">
                {language === 'hi' ? 'कॉल रिकॉर्डिंग केवल वैध सहमति से' : 'Call recording only with consent'}
              </span>
              <button
                type="button"
                onClick={handleStartFollowUpCall}
                className="px-4 py-2 bg-[#005B50] text-white text-xs font-bold rounded-lg hover:bg-[#00473e]"
              >
                {language === 'hi' ? 'स्वीकृत करें और कॉल करें' : 'Approve & Dial Call'}
              </button>
            </div>
          </div>
        )}

        {/* Documents used */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#18212B] uppercase tracking-wider">
            {language === 'hi' ? 'संलग्न दस्तावेज़ एवं सहमति स्थिति' : 'Associated Documents & Consent'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {application.documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0B3A53]" />
                  <div>
                    <span className="font-semibold text-[#18212B] block">{doc.name}</span>
                    <span className="text-[#4B5563]">{doc.fileName}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#005B50]/10 text-[#005B50] font-semibold border border-[#005B50]/20">
                  {language === 'hi' ? 'सहमति सक्रिय' : 'Consented'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Immutable Audit Trail (PRD Section 6I) */}
        <div className="space-y-3 pt-2 border-t border-[#D6D2C9]">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4B5563]">
            <History className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'अपरिवर्तनीय ऑडिट ट्रेल' : 'Immutable Audit Trail'}</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {application.auditTrail.map((ev) => (
              <div
                key={ev.id}
                className="text-xs bg-[#F2EFE8] rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0B3A53] uppercase">{ev.action}</span>
                  <span className="text-[#18212B]">— {ev.details}</span>
                </div>
                <span className="text-[#4B5563] font-mono text-[11px] shrink-0">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0B3A53] text-white text-sm font-semibold hover:bg-[#08283a]"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
