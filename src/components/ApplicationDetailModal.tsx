/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ApplicationCase, Language } from '../types/civic';
import {
  getLocalizedStateName,
  localizeDocumentName,
  localizeAuditEntry,
} from '../services/speechAndLocale';
import {
  X,
  PhoneCall,
  FileText,
  History,
  PhoneForwarded,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ApplicationDetailModalProps {
  language: Language;
  application: ApplicationCase;
  onClose: () => void;
  onStartFollowUpCall?: (application: ApplicationCase) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  language,
  application,
  onClose,
  onStartFollowUpCall,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#005B50] bg-[#005B50]/10 px-2 py-0.5 rounded">
                {getLocalizedStateName(application.state, language)}
              </span>
              {application.acknowledgementNumber && (
                <span className="font-mono text-xs font-semibold bg-[#F2EFE8] px-2 py-0.5 rounded text-[#1a365d]">
                  {application.acknowledgementNumber}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FFFDF8] border border-[#D6D2C9] px-2 py-0.5 rounded text-[#18212B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#005B50]" />
                <span>
                  {tr('Aadhaar:', 'आधार:', 'आधार:')} {application.aadhaarMasked || 'XXXX XXXX 4312'}
                </span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a365d] mt-1.5">
              {application.serviceName[language]}
            </h2>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {tr('Applicant', 'आवेदक', 'अर्जदार')}: {application.applicantName} (
              {application.phoneMasked})
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

        {/* Official Status vs Plain English Explanation */}
        <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] block">
                {tr(
                  'Official Government Portal Status:',
                  'सरकारी पोर्टल की वर्तमान स्थिति:',
                  'शासकीय पोर्टलची सद्यस्थिती:'
                )}
              </span>
              <p className="text-base font-bold text-[#18212B] font-mono mt-0.5">
                {application.officialStatusText[language]}
              </p>
            </div>
            <div className="text-xs text-[#4B5563]">
              {tr('Portal', 'पोर्टल', 'पोर्टल')}:{' '}
              <span className="font-semibold text-[#1a365d]">{application.portalName}</span>
            </div>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-lg p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] block mb-1">
              {tr(
                'Plain-Language Meaning for Citizen:',
                'नागरिक के लिए सरल व्याख्या:',
                'नागरिकांसाठी साध्या भाषेत अर्थ:'
              )}
            </span>
            <p className="text-sm font-medium text-[#18212B] leading-relaxed">
              {application.plainExplanation[language]}
            </p>
          </div>
        </div>

        {/* Stalled / Action Needed Prompt & Gemini Live Follow-up Calling workflow */}
        <div className="bg-[#f97316]/10 border border-[#f97316]/30 rounded-xl p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <PhoneForwarded className="w-5 h-5 text-[#A94600] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#A94600]">
                  {tr(
                    'Government Liaison Follow-up Call (Gemini Live API)',
                    'सरकारी कार्यालय फॉलो-अप कॉल (Gemini Live API)',
                    'शासकीय कार्यालय फॉलो-अप कॉल (Gemini Live API)'
                  )}
                </h4>
                <p className="text-xs text-[#18212B] mt-1">
                  {tr(
                    'With your explicit pre-call consent, the Pratinidhi voice agent can call the district office to inquire about your acknowledgement number and record a structured summary.',
                    'आपकी पूर्व-सहमति से जनसेवा एजेंट जिला कार्यालय में कॉल करके पावती संख्या की स्थिति पूछेगा और स्पष्ट सारांश दर्ज करेगा।',
                    'तुमच्या पूर्व-संमतीने प्रतिनिधी एजंट जिल्हा कार्यालयात कॉल करून पोचपावती क्रमांकाची स्थिती विचारेल आणि सारांश नोंदवेल.'
                  )}
                </p>
              </div>
            </div>

            {onStartFollowUpCall && (
              <button
                type="button"
                data-testid="detail-start-followup-btn"
                onClick={() => {
                  onClose();
                  onStartFollowUpCall(application);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shrink-0 shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>
                  {tr(
                    'Start Follow-up Call',
                    'फॉलो-अप कॉल शुरू करें',
                    'फॉलो-अप कॉल सुरू करा'
                  )}
                </span>
              </button>
            )}
          </div>

          {/* Recorded Follow-Up Calls History */}
          {application.followUpCalls && application.followUpCalls.length > 0 && (
            <div className="pt-3 border-t border-[#f97316]/25 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a365d] block">
                {tr(
                  'Recorded Follow-up Call Summaries:',
                  'पिछले फॉलो-अप कॉल का सारांश:',
                  'नोंदवलेले फॉलो-अप कॉल सारांश:'
                )}
              </span>
              {application.followUpCalls.map((call, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#D6D2C9] rounded-lg p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#005B50] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {tr('Status:', 'स्थिति:', 'स्थिती:')} {call.outcome.toUpperCase()}
                    </span>
                    <span className="font-mono text-[#4B5563]">
                      {tr('Deadline:', 'समय-सीमा:', 'मुदत:')} {call.deadlineGiven}
                    </span>
                  </div>
                  <p className="text-[#18212B] font-medium">
                    {language === 'hi'
                      ? call.summary.hi
                      : language === 'mr'
                      ? call.summary.mr || call.summary.hi
                      : call.summary.en}
                  </p>
                  <p className="text-[#4B5563]">
                    <strong>{tr('Next Action:', 'अगला कदम:', 'पुढील कृती:')}</strong>{' '}
                    {call.nextAction}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents used & Anti-Middleman Sharing Ledger */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#18212B] uppercase tracking-wider">
            {tr(
              'Associated Documents & Per-Case Sharing History',
              'संलग्न दस्तावेज़ एवं पोर्टल साझाकरण इतिहास',
              'जोडलेली कागदपत्रे आणि पोर्टल शेअरिंग इतिहास'
            )}
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {application.documents.map((doc) => {
              const shareDate = doc.uploadedAt ? doc.uploadedAt.slice(0, 10) : '2026-10-22';
              return (
                <div
                  key={doc.id}
                  className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#1a365d] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#18212B] block">
                        {localizeDocumentName(doc.name, language)} ({doc.fileName})
                      </span>
                      <span className="text-[#4B5563] block mt-0.5">
                        {tr(
                          `Your ${localizeDocumentName(doc.name, 'en')} was shared with ${application.portalName} on ${shareDate} (Scoped strictly to Case ${application.acknowledgementNumber || application.id}).`,
                          `आपका ${localizeDocumentName(doc.name, 'hi')} ${shareDate} को ${application.portalName} के साथ साझा किया गया (केवल केस ${application.acknowledgementNumber || application.id} के लिए)।`,
                          `तुमचे ${localizeDocumentName(doc.name, 'mr')} ${shareDate} रोजी ${application.portalName} सोबत शेअर केले गेले (फक्त केस ${application.acknowledgementNumber || application.id} साठी).`
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#005B50]/10 text-[#005B50] font-bold shrink-0 self-start sm:self-center">
                    {tr('Case-Scoped Consent', 'केवल इस केस हेतु अनुमत', 'फक्त या केससाठी संमत')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immutable Audit Trail */}
        <div className="space-y-3 pt-2 border-t border-[#D6D2C9]">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4B5563]">
            <History className="w-3.5 h-3.5" />
            <span>
              {tr('Immutable Audit Trail', 'अपरिवर्तनीय ऑडिट ट्रेल', 'अपरिवर्तनीय ऑडिट ट्रेल')}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {application.auditTrail.map((ev) => {
              const localizedEv = localizeAuditEntry(ev.action, ev.details, language);
              return (
                <div
                  key={ev.id}
                  className="text-xs bg-[#F2EFE8] rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1a365d] uppercase">
                      {localizedEv.actionLabel}
                    </span>
                    <span className="text-[#18212B]">— {localizedEv.detailsLabel}</span>
                  </div>
                  <span className="text-[#4B5563] font-mono text-[11px] shrink-0">
                    {new Date(ev.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1a365d] text-white text-sm font-semibold hover:bg-[#0B3A53]"
          >
            {tr('Close', 'बंद करें', 'बंद करा')}
          </button>
        </div>
      </div>
    </div>
  );
};
