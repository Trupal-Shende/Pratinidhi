/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { ApplicationCase, Language } from '../types/civic';
import {
  Mic,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Lock,
  Sparkles,
} from 'lucide-react';

interface HomeScreenProps {
  language: Language;
  applications: ApplicationCase[];
  onStartVoiceIntake: () => void;
  onSelectApplication: (app: ApplicationCase) => void;
  onViewServiceCatalog: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  applications,
  onStartVoiceIntake,
  onSelectApplication,
  onViewServiceCatalog,
}) => {
  // ⚡ Bolt: Memoize filtered arrays to avoid unnecessary recalculations on re-renders
  // Reduces the need to re-filter the full applications array unless it actually changes.
  const needsActionApps = useMemo(
    () => applications.filter((app) => app.status === 'needs_action' || app.urgency === 'high'),
    [applications]
  );

  const activeApps = useMemo(
    () => applications.filter((app) => app.status === 'in_progress'),
    [applications]
  );

  const completedApps = useMemo(
    () => applications.filter((app) => app.status === 'submitted' || app.status === 'completed'),
    [applications]
  );

  const getStatusBadge = (status: ApplicationCase['status']) => {
    switch (status) {
      case 'needs_action':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#A94600]/10 text-[#A94600] border border-[#A94600]/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            {language === 'hi' ? 'आपकी कार्यवाही अपेक्षित' : 'Action Required'}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0B3A53]/10 text-[#0B3A53] border border-[#0B3A53]/30">
            <Clock className="w-3.5 h-3.5" />
            {language === 'hi' ? 'प्रक्रिया में' : 'In Progress'}
          </span>
        );
      case 'submitted':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#005B50]/10 text-[#005B50] border border-[#005B50]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {language === 'hi' ? 'जमा हो चुका / स्वीकृत' : 'Submitted & Verified'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero / Start Request Banner */}
      <section className="bg-gradient-to-b from-[#F2EFE8] to-[#FFFDF8] border border-[#D6D2C9] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D6D2C9] text-xs font-semibold text-[#0B3A53] mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-[#005B50]" />
            <span>
              {language === 'hi'
                ? 'स्वतंत्र नागरिक सेवा मंच — कोई बिचौलिया नहीं'
                : 'Independent Civic Agent — Zero Middlemen'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B3A53] tracking-tight leading-snug">
            {language === 'hi'
              ? 'सरकारी सेवाओं के लिए बोलकर आवेदन करें'
              : 'Voice-led civic assistance in your language'}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#4B5563] leading-relaxed">
            {language === 'hi'
              ? 'अपनी जरूरत हिन्दी या अंग्रेजी में बोलें। हम सही योजना खोजेंगे, आवश्यक दस्तावेजों की जांच करेंगे और आपकी लाइव सहमति से पोर्टल पर काम करेंगे।'
              : 'Describe your need in Hindi or English. The agent identifies the official service, verifies document requirements, and prepares portal forms with your explicit approval.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onStartVoiceIntake}
              className="px-6 py-4 rounded-xl bg-[#0B3A53] hover:bg-[#08283a] text-white font-semibold text-base sm:text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 min-h-[56px] focus:ring-4 focus:ring-[#005EA8]/30 active:scale-[0.99]"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span>
                {language === 'hi'
                  ? 'बोलकर नया अनुरोध शुरू करें'
                  : 'Start a voice request'}
              </span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            <button
              type="button"
              onClick={onViewServiceCatalog}
              className="px-5 py-3.5 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-[#0B3A53] font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2 min-h-[52px]"
            >
              <FileCheck className="w-4 h-4 text-[#005B50]" />
              <span>
                {language === 'hi'
                  ? 'समर्थित सेवाएं देखें (कैटलॉग)'
                  : 'View supported services'}
              </span>
            </button>
          </div>
        </div>

        {/* Civic Guarantees Bar */}
        <div className="mt-8 pt-6 border-t border-[#D6D2C9]/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-[#4B5563]">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-[#005B50] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#18212B] font-semibold block">
                {language === 'hi' ? 'पूर्ण नागरिक नियंत्रण' : 'Citizen Consent First'}
              </strong>
              {language === 'hi'
                ? 'सबमिशन से पहले प्रत्येक कदम पर आपकी पुष्टि'
                : 'Explicit approval before every consequential action'}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#005B50] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#18212B] font-semibold block">
                {language === 'hi' ? 'गोपनीयता और मास्किंग' : 'Identity Redaction'}
              </strong>
              {language === 'hi'
                ? 'आधार नंबर के पहले 8 अंक हमेशा छिपे रहते हैं'
                : 'Sensitive IDs masked; zero retention of secrets or OTPs'}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <FileCheck className="w-4 h-4 text-[#005B50] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#18212B] font-semibold block">
                {language === 'hi' ? 'आधिकारिक रसीद' : 'Official Portal Proof'}
              </strong>
              {language === 'hi'
                ? 'सरकारी पोर्टल से वैध पावती क्रमांक व रसीद'
                : 'Real acknowledgement number and downloadable receipt'}
            </span>
          </div>
        </div>
      </section>

      {/* 1. Needs Your Action Section (PRD Section 6 Screen Home Rule: Needs Action First) */}
      {needsActionApps.length > 0 && (
        <section aria-labelledby="needs-action-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#A94600] animate-pulse" />
            <h2 id="needs-action-heading" className="text-xl font-bold text-[#18212B]">
              {language === 'hi' ? 'आपकी तुरंत कार्यवाही अपेक्षित' : 'Needs Your Action'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#A94600]/10 text-[#A94600]">
              {needsActionApps.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {needsActionApps.map((app) => (
              <div
                key={app.id}
                className="bg-white border-2 border-[#A94600]/40 rounded-xl p-5 hover:border-[#A94600] transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D6D2C9]">
                  <div>
                    <span className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                      {app.state} • {app.portalName}
                    </span>
                    <h3 className="text-lg font-bold text-[#0B3A53] mt-0.5">
                      {app.serviceName[language]}
                    </h3>
                    <p className="text-xs text-[#4B5563]">
                      {language === 'hi' ? 'आवेदक' : 'Applicant'}: {app.applicantName} ({app.phoneMasked})
                    </p>
                  </div>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                {/* Plain-language explanation vs Official portal notice */}
                <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-lg p-4 space-y-2">
                  <div className="text-xs text-[#4B5563]">
                    <span className="font-semibold text-[#18212B]">
                      {language === 'hi' ? 'सरकारी पोर्टल की स्थिति:' : 'Official Portal Notice:'}
                    </span>{' '}
                    <span className="font-mono text-xs bg-[#F2EFE8] px-2 py-0.5 rounded">
                      {app.officialStatusText[language]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#18212B] leading-relaxed">
                    <span className="font-semibold text-[#A94600]">
                      {language === 'hi' ? 'सरल भाषा में इसका अर्थ:' : 'What this means:'}
                    </span>{' '}
                    {app.plainExplanation[language]}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-[#4B5563] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#A94600]" />
                    <span>
                      {language === 'hi' ? 'लंबित' : 'Due'}: {app.nextActionDate}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectApplication(app)}
                    className="px-4 py-2.5 rounded-lg bg-[#A94600] hover:bg-[#883600] text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm focus:ring-2 focus:ring-[#A94600]"
                  >
                    <span>{language === 'hi' ? 'कार्यवाही पूरी करें' : 'Complete Required Action'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Active Applications Section */}
      <section aria-labelledby="active-apps-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#005B50]" />
            <h2 id="active-apps-heading" className="text-xl font-bold text-[#18212B]">
              {language === 'hi' ? 'प्रक्रियाधीन आवेदन' : 'Active Applications'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2EFE8] text-[#0B3A53]">
              {activeApps.length}
            </span>
          </div>
        </div>

        {activeApps.length === 0 ? (
          <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-8 text-center text-[#4B5563]">
            <p className="text-sm">
              {language === 'hi'
                ? 'वर्तमान में कोई सक्रिय प्रक्रियाधीन आवेदन नहीं है।'
                : 'No active applications in progress.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="bg-white border border-[#D6D2C9] rounded-xl p-5 hover:border-[#0B3A53] hover:shadow-sm transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                      {app.state} • {app.portalName}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#0B3A53]">
                      {app.serviceName[language]}
                    </h3>
                  </div>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                <div className="text-xs sm:text-sm text-[#4B5563] space-y-1">
                  {app.acknowledgementNumber && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#18212B]">
                        {language === 'hi' ? 'पावती क्रमांक:' : 'Acknowledgement No:'}
                      </span>
                      <span className="font-mono bg-[#F2EFE8] px-2 py-0.5 rounded text-[#0B3A53] font-semibold">
                        {app.acknowledgementNumber}
                      </span>
                    </div>
                  )}
                  <p className="line-clamp-2 text-[#18212B] bg-[#FFFDF8] p-2.5 rounded border border-[#D6D2C9]">
                    <span className="font-semibold text-[#005B50]">
                      {language === 'hi' ? 'ताजा अपडेट:' : 'Plain Explanation:'}
                    </span>{' '}
                    {app.plainExplanation[language]}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#D6D2C9]/60 text-xs text-[#4B5563]">
                  <span>
                    {language === 'hi' ? 'अंतिम जांच:' : 'Last verified'}:{' '}
                    {new Date(app.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[#005EA8] font-semibold flex items-center gap-1">
                    {language === 'hi' ? 'विवरण और समयरेखा देखें' : 'View timeline & documents'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Completed & Past Applications */}
      {completedApps.length > 0 && (
        <section aria-labelledby="completed-apps-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#005B50]" />
            <h2 id="completed-apps-heading" className="text-xl font-bold text-[#18212B]">
              {language === 'hi' ? 'पूर्ण एवं सुरक्षित इतिहास' : 'Completed History'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {completedApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="bg-[#F2EFE8]/70 border border-[#D6D2C9] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#F2EFE8] transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-[#0B3A53]">
                    {app.serviceName[language]}
                  </h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    {app.acknowledgementNumber && (
                      <span className="font-mono mr-2">{app.acknowledgementNumber}</span>
                    )}
                    {app.applicantName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(app.status)}
                  <ChevronRight className="w-4 h-4 text-[#4B5563]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
