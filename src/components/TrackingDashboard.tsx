/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ApplicationCase, Language } from '../types/civic';
import { getLocalizedStateName } from '../services/speechAndLocale';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  FileText,
  History,
  ShieldCheck,
  ChevronRight,
  Database,
} from 'lucide-react';

interface TrackingDashboardProps {
  language: Language;
  applications: ApplicationCase[];
  isFirestoreSynced: boolean;
  onSelectApplication: (app: ApplicationCase) => void;
  onStartFollowUpCall: (app: ApplicationCase) => void;
  onOpenRejectionJourney?: (app: ApplicationCase) => void;
}

export const TrackingDashboard: React.FC<TrackingDashboardProps> = ({
  language,
  applications,
  isFirestoreSynced,
  onSelectApplication,
  onStartFollowUpCall,
  onOpenRejectionJourney,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const [filter, setFilter] = useState<'all' | 'needs_action' | 'in_progress' | 'completed'>('all');

  const filteredApps = applications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'needs_action')
      return (
        app.status === 'rejected' ||
        app.status === 'needs_action' ||
        app.status === 'delayed' ||
        app.urgency === 'high'
      );
    if (filter === 'in_progress') return app.status === 'in_progress';
    return app.status === 'submitted' || app.status === 'completed';
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-[#D6D2C9] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a365d]/10 text-[#1a365d] text-xs font-bold mb-2">
            <Database className="w-3.5 h-3.5 text-[#f97316]" />
            <span>
              {isFirestoreSynced
                ? tr(
                    'Cloud Firestore Real-Time Sync Active',
                    'क्लाउड फायरस्टोर रियल-टाइम सिंक सक्रिय',
                    'क्लाउड फायरस्टोअर रिअल-टाईम सिंक सक्रिय'
                  )
                : tr(
                    'Local Protected Session • Sign in with Google for Cloud Sync',
                    'सुरक्षित स्थानीय सत्र • क्लाउड सिंक के लिए गूगल से लॉग इन करें',
                    'स्थानिक सुरक्षित सत्र • क्लाउड सिंकसाठी गूगलने साइन इन करा'
                  )}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a365d]">
            {tr(
              'Application Tracking Dashboard',
              'नागरिक आवेदन ट्रैकिंग डैशबोर्ड',
              'नागरिक अर्ज ट्रॅकिंग डॅशबोर्ड'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
            {tr(
              'Track live portal status, masked PII guarantees, immutable audit trails, and launch Gemini Live follow-up calls.',
              'सभी आवेदनों की लाइव स्थिति, सुरक्षित मास्क्ड डेटा, ऑडिट ट्रेल देखें और लंबित आवेदनों पर फॉलो-अप कॉल करें।',
              'सर्व अर्जांची सद्यस्थिती, सुरक्षित मास्क केलेला डेटा, ऑडिट ट्रेल पहा आणि प्रलंबित अर्जांसाठी फॉलो-अप कॉल करा.'
            )}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: tr('All', 'सभी', 'सर्व'), count: applications.length },
            {
              id: 'needs_action',
              label: tr('Stalled / Action', 'लंबित / कार्यवाही', 'प्रलंबित / कृती'),
              count: applications.filter((a) => a.status === 'needs_action' || a.urgency === 'high').length,
            },
            {
              id: 'in_progress',
              label: tr('In Progress', 'प्रक्रियाधीन', 'प्रक्रियेत'),
              count: applications.filter((a) => a.status === 'in_progress').length,
            },
            {
              id: 'completed',
              label: tr('Completed', 'पूर्ण', 'पूर्ण'),
              count: applications.filter((a) => a.status === 'submitted' || a.status === 'completed').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'bg-[#1a365d] text-white shadow-xs'
                  : 'bg-[#F2EFE8] text-[#18212B] hover:bg-white border border-[#D6D2C9]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[11px]">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {filteredApps.map((app) => {
          const isStalled = app.status === 'needs_action' || app.status === 'delayed' || app.urgency === 'high';
          return (
            <div
              key={app.id}
              className={`bg-white border-2 rounded-2xl p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                isStalled ? 'border-[#f97316]/60' : 'border-[#D6D2C9]'
              }`}
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D6D2C9]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#1a365d] bg-[#1a365d]/10 px-2.5 py-0.5 rounded">
                      {getLocalizedStateName(app.state, language)}
                    </span>
                    {app.acknowledgementNumber && (
                      <span className="font-mono font-bold text-[#0B3A53] bg-[#F2EFE8] px-2.5 py-0.5 rounded">
                        {app.acknowledgementNumber}
                      </span>
                    )}
                    <span className="text-[#4B5563] font-mono">
                      {tr('Aadhaar:', 'आधार:', 'आधार:')} {app.aadhaarMasked || 'XXXX XXXX 4312'} •{' '}
                      {tr('Phone:', 'फ़ोन:', 'फोन:')} {app.phoneMasked}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1a365d] mt-1">
                    {app.serviceName[language]}
                  </h2>
                  <p className="text-xs text-[#4B5563]">
                    {tr('Applicant:', 'आवेदक:', 'अर्जदार:')} <strong>{app.applicantName}</strong> •{' '}
                    {app.portalName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isStalled ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f97316]/15 text-[#A94600] border border-[#f97316]/40">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {tr('Stalled / Needs Action', 'लंबित / कार्यवाही आवश्यक', 'प्रलंबित / कृती आवश्यक')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#005B50]/15 text-[#005B50] border border-[#005B50]/30">
                      <Clock className="w-3.5 h-3.5" />
                      {tr('In Progress', 'प्रक्रियाधीन', 'प्रक्रियेत')}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Timeline Bar */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { label: tr('1. Voice Intake', '1. वॉयस पहचान', '१. आवाज ओळख'), done: true },
                  { label: tr('2. Pre-Flight & Consent', '2. प्री-फ़्लाइट व सहमति', '२. पूर्व-तपासणी व संमती'), done: true },
                  { label: tr('3. Portal Submitted', '3. पोर्टल पर जमा', '३. पोर्टलवर सादर'), done: true },
                  {
                    label: tr('4. Officer Verification', '4. अधिकारी सत्यापन', '४. अधिकारी पडताळणी'),
                    done: app.status === 'completed',
                    active: app.status !== 'completed',
                  },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border text-center text-[11px] font-semibold ${
                      st.done
                        ? 'bg-[#005B50]/10 border-[#005B50]/30 text-[#005B50]'
                        : st.active
                        ? 'bg-[#f97316]/15 border-[#f97316] text-[#A94600]'
                        : 'bg-[#F2EFE8] border-[#D6D2C9] text-[#4B5563]'
                    }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>

              {/* Plain Explanation Box */}
              <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 space-y-1.5">
                <div className="text-xs text-[#4B5563]">
                  <strong className="text-[#18212B]">
                    {tr('Official Status:', 'पोर्टल स्थिति:', 'पोर्टल स्थिती:')}
                  </strong>{' '}
                  <span className="font-mono">{app.officialStatusText[language]}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#18212B] leading-relaxed">
                  <strong className="text-[#005B50]">
                    {tr('Plain Explanation:', 'सरल व्याख्या:', 'सोपा अर्थ:')}
                  </strong>{' '}
                  {app.plainExplanation[language]}
                </p>
              </div>

              {/* Bottom Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#D6D2C9]/70">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#4B5563]">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#1a365d]" />
                    {app.documents.length} {tr('Consented Docs', 'अनुमत दस्तावेज़', 'संमत कागदपत्रे')}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-[#005B50]" />
                    {app.auditTrail.length} {tr('Audit Logs', 'ऑडिट लॉग', 'ऑडिट नोंदी')}
                  </span>
                  {app.followUpCalls && app.followUpCalls.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-bold text-[#005B50]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {app.followUpCalls.length} {tr('Follow-up Call(s)', 'फॉलो-अप कॉल', 'फॉलो-अप कॉल')}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {app.status === 'rejected' && onOpenRejectionJourney && (
                    <button
                      type="button"
                      onClick={() => onOpenRejectionJourney(app)}
                      className="px-4 py-2.5 rounded-xl bg-[#A61B1B] hover:bg-red-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors min-h-[42px]"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        {tr(
                          'Open Rejection Recovery Journey',
                          'अस्वीकृति सुधार यात्रा खोलें',
                          'अर्ज नाकारणी दुरुस्ती प्रवास उघडा'
                        )}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onStartFollowUpCall(app)}
                    className="px-4 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors min-h-[42px]"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>
                      {tr(
                        'Start Follow-up Voice Call',
                        'फॉलो-अप वॉयस कॉल करें',
                        'फॉलो-अप व्हॉइस कॉल करा'
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectApplication(app)}
                    className="px-4 py-2.5 rounded-xl border border-[#D6D2C9] bg-[#F2EFE8] hover:bg-white text-xs sm:text-sm font-semibold text-[#1a365d] flex items-center gap-1.5 min-h-[42px]"
                  >
                    <span>
                      {tr('Timeline & Audit Trail', 'पूर्ण विवरण व ऑडिट', 'संपूर्ण तपशील व ऑडिट')}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
