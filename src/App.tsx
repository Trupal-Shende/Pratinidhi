/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { VoiceIntakeView } from './components/VoiceIntakeView';
import { DocumentChecklist } from './components/DocumentChecklist';
import { ApplicationReviewModal } from './components/ApplicationReviewModal';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ServiceCatalogModal } from './components/ServiceCatalogModal';
import { ApplicationCase, Language, UploadedDocState } from './types/civic';
import { CivicService, CIVIC_SERVICES } from './services/civicCatalog';
import { ShieldCheck, Phone, HelpCircle, X, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'voice_intake' | 'document_checklist'>('home');
  const [language, setLanguage] = useState<Language>('hi');

  // Selected service and context for current workflow
  const [activeService, setActiveService] = useState<CivicService | null>(null);
  const [activeCitizenTranscript, setActiveCitizenTranscript] = useState<string>('');
  const [activeUploadedDocs, setActiveUploadedDocs] = useState<Record<string, UploadedDocState>>({});

  // Modals
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<ApplicationCase | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Applications list seeded from PRD personas
  const [applications, setApplications] = useState<ApplicationCase[]>([
    {
      id: 'app-savitri-2026',
      applicantName: 'Savitri Devi (सावित्री देवी)',
      phoneMasked: '+91 98*** **312',
      preferredLanguage: 'hi',
      serviceId: 'up-pension-revival',
      serviceName: {
        en: 'Old Age Pension Revival & Life Verification',
        hi: 'वृद्धावस्था पेंशन पुनरारंभ एवं जीवन प्रमाणीकरण',
      },
      state: 'Uttar Pradesh',
      portalName: 'UP Social Welfare Portal (sspy-up.gov.in)',
      acknowledgementNumber: 'UP-SSPY-2026-78419',
      status: 'needs_action',
      officialStatusText: {
        en: 'Aadhaar e-KYC Pending / Bank DBT unlinked',
        hi: 'आधार ई-केवाईसी लंबित / बैंक डीबीटी मैपिंग अपुष्ट',
      },
      plainExplanation: {
        en: 'Your pension was temporarily halted because annual life verification is pending. Please review your passbook and confirm the e-KYC request.',
        hi: 'वार्षिक जीवन प्रमाणीकरण बाकी होने के कारण आपकी पेंशन रुक गई है। कृपया बैंक पासबुक चेक करें और ई-केवाईसी अनुरोध को मंजूरी दें।',
      },
      submittedAt: '2026-09-15T10:30:00Z',
      lastCheckedAt: new Date().toISOString(),
      nextActionDate: 'Immediate — Citizen confirmation required',
      urgency: 'high',
      documents: [
        {
          id: 'doc-sav-1',
          requirementId: 'doc-passbook',
          name: 'Bank Passbook (SBI Moradabad)',
          fileName: 'sbi_passbook_scan.jpg',
          verified: true,
          qualityScore: 92,
          consentedForPortal: true,
          redactedFields: ['Balance', 'Non-DBT transactions'],
          uploadedAt: '2026-09-14T14:20:00Z',
        },
        {
          id: 'doc-sav-2',
          requirementId: 'doc-pension-id',
          name: 'Old Pension Sanction PPO',
          fileName: 'old_ppo_order.pdf',
          verified: true,
          qualityScore: 88,
          consentedForPortal: true,
          redactedFields: [],
          uploadedAt: '2026-09-14T14:22:00Z',
        },
      ],
      auditTrail: [
        {
          id: 'aud-1',
          timestamp: '2026-09-14T14:15:00Z',
          action: 'VOICE_INTAKE_COMPLETED',
          actor: 'citizen',
          details: 'Citizen described stopped pension in Hindi voice. Matched to UP Old Age Pension Revival.',
        },
        {
          id: 'aud-2',
          timestamp: '2026-09-14T14:25:00Z',
          action: 'CONSENT_GRANTED_DOCUMENTS',
          actor: 'citizen',
          details: 'Granted specific consent to attach passbook and PPO for portal inspection.',
        },
        {
          id: 'aud-3',
          timestamp: '2026-10-28T09:00:00Z',
          action: 'PORTAL_STATUS_CHECKED',
          actor: 'agent',
          details: 'Official portal status retrieved: e-KYC life verification flag detected.',
        },
      ],
    },
    {
      id: 'app-imran-2026',
      applicantName: 'Imran Khan (इमरान खान)',
      phoneMasked: '+91 94*** **884',
      preferredLanguage: 'en',
      serviceId: 'up-domicile-certificate',
      serviceName: {
        en: 'Domicile Certificate (मूल निवास प्रमाण पत्र)',
        hi: 'मूल निवास प्रमाण पत्र (Domicile Certificate)',
      },
      state: 'Uttar Pradesh',
      portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
      acknowledgementNumber: 'EDIST-UP-26-9048123',
      status: 'in_progress',
      officialStatusText: {
        en: 'Application forwarded to Tehsil Lekhpal for local verification',
        hi: 'आवेदन स्थानीय सत्यापन हेतु तहसील लेखपाल को अग्रेषित',
      },
      plainExplanation: {
        en: 'Your application has been accepted by the portal. The local revenue officer has 11 days remaining to complete verification.',
        hi: 'आपका आवेदन पोर्टल पर स्वीकार कर लिया गया है। स्थानीय राजस्व अधिकारी के पास सत्यापन हेतु 11 दिन शेष हैं।',
      },
      submittedAt: '2026-10-22T11:45:00Z',
      lastCheckedAt: new Date().toISOString(),
      nextActionDate: '2026-11-06 (Published SLA)',
      urgency: 'normal',
      documents: [
        {
          id: 'doc-imr-1',
          requirementId: 'doc-identity',
          name: 'Aadhaar Card Copy',
          fileName: 'aadhaar_redacted.jpg',
          verified: true,
          qualityScore: 95,
          consentedForPortal: true,
          redactedFields: ['First 8 digits masked'],
          uploadedAt: '2026-10-22T11:20:00Z',
        },
        {
          id: 'doc-imr-2',
          requirementId: 'doc-school-or-birth',
          name: 'Class 10th UP Board Marksheet',
          fileName: 'up_board_marksheet.pdf',
          verified: true,
          qualityScore: 98,
          consentedForPortal: true,
          redactedFields: [],
          uploadedAt: '2026-10-22T11:25:00Z',
        },
      ],
      auditTrail: [
        {
          id: 'aud-4',
          timestamp: '2026-10-22T11:30:00Z',
          action: 'SUBMISSION_CONFIRMED',
          actor: 'citizen',
          details: 'Citizen confirmed irreversible submission on e-District portal after summary review.',
        },
        {
          id: 'aud-5',
          timestamp: '2026-10-22T11:45:00Z',
          action: 'ACKNOWLEDGEMENT_EXTRACTED',
          actor: 'agent',
          details: 'Captured official receipt number EDIST-UP-26-9048123 from portal response.',
        },
      ],
    },
  ]);

  // Try to load any newly updated applications from backend
  useEffect(() => {
    fetch('/api/applications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.applications && Array.isArray(data.applications)) {
          setApplications(data.applications);
        }
      })
      .catch(() => {});
  }, []);

  const handleStartVoiceIntake = () => {
    setCurrentView('voice_intake');
  };

  const handleProceedToDocumentChecklist = (service: CivicService, transcript: string) => {
    setActiveService(service);
    setActiveCitizenTranscript(transcript);
    setCurrentView('document_checklist');
  };

  const handleProceedToReview = (
    service: CivicService,
    uploadedDocuments: Record<string, UploadedDocState>
  ) => {
    setActiveService(service);
    setActiveUploadedDocs(uploadedDocuments);
    setShowReviewModal(true);
  };

  const handleSubmissionSuccess = (newCase: ApplicationCase) => {
    setApplications((prev) => [newCase, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#18212B] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onNavigateHome={() => setCurrentView('home')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12">
        {currentView === 'home' && (
          <HomeScreen
            language={language}
            applications={applications}
            onStartVoiceIntake={handleStartVoiceIntake}
            onSelectApplication={(app) => setSelectedCaseForDetail(app)}
            onViewServiceCatalog={() => setShowCatalogModal(true)}
          />
        )}

        {currentView === 'voice_intake' && (
          <VoiceIntakeView
            language={language}
            onBack={() => setCurrentView('home')}
            onProceedToDocumentChecklist={handleProceedToDocumentChecklist}
          />
        )}

        {currentView === 'document_checklist' && activeService && (
          <DocumentChecklist
            language={language}
            service={activeService}
            citizenTranscript={activeCitizenTranscript}
            onBack={() => setCurrentView('voice_intake')}
            onProceedToReview={handleProceedToReview}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D6D2C9] bg-[#F2EFE8] py-6 px-4 text-xs text-[#4B5563]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0B3A53]">जनसेवा (JanSeva)</span>
            <span>•</span>
            <span>
              {language === 'hi'
                ? 'नागरिक-सहमति आधारित सरकारी सेवा सहायक'
                : 'Consent-First Civic Agent for India'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:underline text-[#005EA8]"
            >
              {language === 'hi' ? 'गोपनीयता नीति व डेटा नियंत्रण' : 'Privacy & Data Controls'}
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHelpModal(true)}
              className="hover:underline text-[#005EA8]"
            >
              {language === 'hi' ? 'नागरिक हेल्पलाइन' : 'Official Helpline'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showReviewModal && activeService && (
        <ApplicationReviewModal
          language={language}
          service={activeService}
          uploadedDocs={activeUploadedDocs}
          onClose={() => setShowReviewModal(false)}
          onSubmitSuccess={handleSubmissionSuccess}
        />
      )}

      {selectedCaseForDetail && (
        <ApplicationDetailModal
          language={language}
          application={selectedCaseForDetail}
          onClose={() => setSelectedCaseForDetail(null)}
        />
      )}

      {showPrivacyModal && (
        <PrivacyModal language={language} onClose={() => setShowPrivacyModal(false)} />
      )}

      {showCatalogModal && (
        <ServiceCatalogModal
          language={language}
          onClose={() => setShowCatalogModal(false)}
          onSelectService={(srv) => {
            setShowCatalogModal(false);
            setActiveService(srv);
            setActiveCitizenTranscript(
              language === 'hi'
                ? `${srv.name.hi} के लिए आवेदन`
                : `Application for ${srv.name.en}`
            );
            setCurrentView('document_checklist');
          }}
        />
      )}

      {/* Help & Human Handoff Modal (PRD Screen 20) */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-[#D6D2C9] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6D2C9]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0B3A53]" />
                <h3 className="text-lg font-bold text-[#0B3A53]">
                  {language === 'hi' ? 'नागरिक सहायता एवं हेल्पलाइन' : 'Citizen Assistance & Official Contacts'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 text-[#4B5563] hover:text-[#18212B] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-[#18212B] space-y-3">
              <p>
                {language === 'hi'
                  ? 'यदि आपका आवेदन सरकारी पोर्टल पर रुका हुआ है या आपको किसी ऑपरेटर से बात करनी है, तो आधिकारिक हेल्पलाइन उपलब्ध हैं:'
                  : 'If you require escalation or human assistance, you can reach out directly via official channels:'}
              </p>

              <div className="bg-[#F2EFE8] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0B3A53]">
                    {language === 'hi' ? 'उत्तर प्रदेश जनसुनवाई (CM Helpline)' : 'UP CM Helpline (Jansunwai)'}
                  </span>
                  <span className="font-bold text-[#005B50]">1076</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0B3A53]">
                    {language === 'hi' ? 'समाज कल्याण पेंशन हेल्पलाइन' : 'Social Welfare Pension Helpline'}
                  </span>
                  <span className="font-bold text-[#005B50]">1800-419-0001</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0B3A53]">
                    {language === 'hi' ? 'ई-डिस्ट्रिक्ट राजस्व सहायता' : 'e-District Revenue Desk'}
                  </span>
                  <span className="font-bold text-[#005B50]">0522-2304706</span>
                </div>
              </div>

              <div className="text-xs text-[#4B5563] pt-1">
                {language === 'hi'
                  ? 'चेतावनी: कभी भी किसी अनौपचारिक एजेंट या बिचौलिए को नकद भुगतान न करें। आधिकारिक पोर्टल शुल्क केवल ₹15 है।'
                  : 'Notice: Never pay cash to middlemen. The maximum official portal processing fee is ₹15.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-lg bg-[#0B3A53] text-white text-xs font-semibold"
              >
                {language === 'hi' ? 'समझ गया' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
