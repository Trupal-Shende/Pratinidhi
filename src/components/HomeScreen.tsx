/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ApplicationCase, Language, SmsReceipt } from '../types/civic';
import {
  CivicService,
  LIFE_EVENT_TRIGGERS,
  LifeEventTrigger,
  getServicesForState,
} from '../services/civicCatalog';
import {
  CORE_PRODUCT_PROMISE,
  OFFICIAL_TOLL_FREE_NUMBER,
  PAPER_DOCUMENT_FALLBACK_ROUTES,
  ZERO_DISCRETION_HELPER_RULES,
  buildDigiLockerCaseConsent,
} from '../services/keypadAndRejectionService';
import {
  getLocalizedStateName,
  localizeNextActionDate,
} from '../services/speechAndLocale';
import { KeypadPhoneSimulator } from './KeypadPhoneSimulator';
import {
  PhoneCall,
  MessageSquare,
  Smartphone,
  Building2,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Lock,
  Sparkles,
  Layers,
  Users,
  Search,
  XCircle,
} from 'lucide-react';

interface HomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  selectedState: string;
  applications: ApplicationCase[];
  smsReceipts: SmsReceipt[];
  onNewSmsReceipt: (sms: SmsReceipt) => void;
  onStartVoiceIntake: () => void;
  onStartWithDigiLocker: (service: CivicService) => void;
  onSelectApplication: (app: ApplicationCase) => void;
  onOpenRejectionJourney: (app: ApplicationCase) => void;
  onStartFollowUpCall: (app: ApplicationCase) => void;
  onViewServiceCatalog: () => void;
  onNavigateTracking: () => void;
  onStartLifeEventBundle: (
    trigger: LifeEventTrigger,
    selectedServices: CivicService[]
  ) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onLanguageChange,
  selectedState,
  applications,
  smsReceipts,
  onNewSmsReceipt,
  onStartVoiceIntake,
  onStartWithDigiLocker,
  onSelectApplication,
  onOpenRejectionJourney,
  onStartFollowUpCall,
  onViewServiceCatalog,
  onNavigateTracking,
  onStartLifeEventBundle,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const keypadSectionRef = useRef<HTMLDivElement | null>(null);
  const applicationsSectionRef = useRef<HTMLDivElement | null>(null);

  const [showDigiLockerConsentDrawer, setShowDigiLockerConsentDrawer] =
    useState<boolean>(false);
  const [digiLockerApprovedForCase, setDigiLockerApprovedForCase] =
    useState<boolean>(false);
  const [showHelperConsentDrawer, setShowHelperConsentDrawer] =
    useState<boolean>(false);
  const [helperCitizenPhone, setHelperCitizenPhone] =
    useState<string>('+91 98201 44312');
  const [helperSmsDispatched, setHelperSmsDispatched] =
    useState<boolean>(false);
  const [caseLookupQuery, setCaseLookupQuery] = useState<string>('');
  const [showCaseLookupBar, setShowCaseLookupBar] = useState<boolean>(false);

  const [activeLifeEventId, setActiveLifeEventId] = useState<string>(
    LIFE_EVENT_TRIGGERS[0].id
  );
  const activeTrigger =
    LIFE_EVENT_TRIGGERS.find((t) => t.id === activeLifeEventId) ||
    LIFE_EVENT_TRIGGERS[0];

  const stateServices = getServicesForState(selectedState);
  const defaultIncomeService =
    stateServices.find((s) => s.id === 'up-income-certificate') ||
    stateServices[0];

  const sampleDigiLockerConsent = buildDigiLockerCaseConsent(
    defaultIncomeService,
    'CASE-INC-2026-409',
    digiLockerApprovedForCase
  );

  const unlockedServices = activeTrigger.unlockedServiceIds
    .map((id) => stateServices.find((s) => s.id === id))
    .filter(Boolean) as CivicService[];

  const [selectedBundleIds, setSelectedBundleIds] = useState<
    Record<string, boolean>
  >({
    'widow-pension-scheme': true,
    'family-pension-survivor': true,
    'property-mutation-ferfar': true,
    'ration-card-hof-update': true,
    'up-pension-revival': true,
    'up-income-certificate': true,
    'up-domicile-certificate': true,
  });

  const toggleBundleService = (serviceId: string) => {
    setSelectedBundleIds((prev) => ({
      ...prev,
      [serviceId]: prev[serviceId] === false ? true : false,
    }));
  };

  const currentlyCheckedServices = unlockedServices.filter(
    (s) => selectedBundleIds[s.id] !== false
  );

  const filteredApplications = caseLookupQuery.trim()
    ? applications.filter(
        (a) =>
          (a.acknowledgementNumber || '')
            .toLowerCase()
            .includes(caseLookupQuery.trim().toLowerCase()) ||
          a.applicantName
            .toLowerCase()
            .includes(caseLookupQuery.trim().toLowerCase()) ||
          a.id.toLowerCase().includes(caseLookupQuery.trim().toLowerCase())
      )
    : applications;

  const rejectedAndNeedsActionApps = filteredApplications.filter(
    (app) =>
      app.status === 'rejected' ||
      app.status === 'needs_action' ||
      app.urgency === 'high'
  );
  const activeApps = filteredApplications.filter(
    (app) => app.status === 'in_progress'
  );
  const completedApps = filteredApplications.filter(
    (app) => app.status === 'submitted' || app.status === 'completed'
  );

  const getStatusLabel = (status: ApplicationCase['status']) => {
    switch (status) {
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A61B1B]">
            <XCircle className="w-4 h-4" />
            {tr(
              'Rejected — Recovery Path Ready',
              'अस्वीकृत — सुधार पथ तैयार',
              'नाकारले — दुरुस्ती मार्ग तयार'
            )}
          </span>
        );
      case 'needs_action':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A94600]">
            <AlertTriangle className="w-4 h-4" />
            {tr(
              'Action Required',
              'आपकी कार्यवाही अपेक्षित',
              'तुमची कृती आवश्यक'
            )}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3A53]">
            <Clock className="w-4 h-4" />
            {tr('In Progress', 'प्रक्रिया में', 'प्रक्रियेत')}
          </span>
        );
      case 'submitted':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005B50]">
            <CheckCircle2 className="w-4 h-4" />
            {tr(
              'Submitted & Verified',
              'जमा हो चुका / स्वीकृत',
              'सादर आणि सत्यापित'
            )}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. FIRST SCREEN HERO: Core Product Promise + 5 Required First-Screen Actions (Never leads with "Upload document") */}
      <section
        aria-labelledby="first-screen-heading"
        data-testid="first-screen-hero"
        className="bg-gradient-to-b from-[#F2EFE8] to-[#FFFDF8] border-2 border-[#0B3A53] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* Top Row: Channel Hierarchy Summary & First-Screen Language Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#D6D2C9]">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] block">
              {tr(
                'Voice-First Civic Service • Companion View for Families & Smartphones',
                'वॉयस-फर्स्ट जनसेवा • परिवार और स्मार्टफोन के लिए सहायक पोर्टल',
                'व्हॉइस-फर्स्ट नागरी सेवा • कुटुंब आणि स्मार्टफोनसाठी सहाय्यक पोर्टल'
              )}
            </span>
            <h1
              id="first-screen-heading"
              className="text-2xl sm:text-3xl font-bold text-[#0B3A53] tracking-tight leading-snug"
            >
              {CORE_PRODUCT_PROMISE[language]}
            </h1>
          </div>

          {/* Required Action #2 on First Screen: Language Selector (Hindi first, Marathi, English) */}
          <div className="bg-white border border-[#D6D2C9] rounded-xl p-2.5 shrink-0 self-start md:self-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563] block mb-1.5 px-1">
              {tr(
                'Select Language (भाषा चुनें):',
                'अपनी भाषा चुनें (1/2/3):',
                'तुमची भाषा निवडा (1/2/3):'
              )}
            </span>
            <div
              className="inline-flex rounded-lg bg-[#F2EFE8] p-0.5 gap-1"
              role="group"
              aria-label="First screen language selector"
            >
              <button
                type="button"
                data-testid="first-screen-lang-hi"
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all min-h-[38px] ${
                  language === 'hi'
                    ? 'bg-[#0B3A53] text-white shadow-xs'
                    : 'text-[#18212B] hover:text-[#0B3A53]'
                }`}
              >
                1 • हिन्दी
              </button>
              <button
                type="button"
                data-testid="first-screen-lang-mr"
                onClick={() => onLanguageChange('mr')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all min-h-[38px] ${
                  language === 'mr'
                    ? 'bg-[#0B3A53] text-white shadow-xs'
                    : 'text-[#18212B] hover:text-[#0B3A53]'
                }`}
              >
                2 • मराठी
              </button>
              <button
                type="button"
                data-testid="first-screen-lang-en"
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all min-h-[38px] ${
                  language === 'en'
                    ? 'bg-[#0B3A53] text-white shadow-xs'
                    : 'text-[#18212B] hover:text-[#0B3A53]'
                }`}
              >
                3 • English
              </button>
            </div>
          </div>
        </div>

        {/* The 4 First-Screen Primary Action Cards (Never leading with "Upload document") */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Action 1: Call us to start: 1800-11-7728 */}
          <button
            type="button"
            data-testid="cta-call-to-start"
            onClick={() => {
              keypadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-[#0B3A53] hover:bg-[#08283a] text-white text-left transition-all shadow-sm flex flex-col justify-between gap-3 min-h-[124px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#f97316] block">
                  {tr(
                    '1. Primary Channel (Keypad Mobile)',
                    '1. मुख्य माध्यम (कीपैड मोबाइल कॉल)',
                    '१. मुख्य माध्यम (कीपॅड मोबाईल कॉल)'
                  )}
                </span>
                <span className="text-lg sm:text-xl font-bold block mt-1">
                  {tr(
                    `Call us to start: ${OFFICIAL_TOLL_FREE_NUMBER}`,
                    `शुरू करने के लिए कॉल करें: ${OFFICIAL_TOLL_FREE_NUMBER}`,
                    `सुरू करण्यासाठी कॉल करा: ${OFFICIAL_TOLL_FREE_NUMBER}`
                  )}
                </span>
              </div>
              <PhoneCall className="w-6 h-6 text-[#f97316] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-white/85 flex items-center justify-between">
              <span>
                {tr(
                  'Speak naturally in Hindi, Marathi, or English • Press 1 to approve • Get SMS receipt',
                  'हिन्दी, मराठी या अंग्रेजी में बोलें • 1 दबाकर मंजूरी दें • एसएमएस रसीद पाएं',
                  'हिंदी, मराठी किंवा इंग्रजीत बोला • 1 दाबून मंजुरी द्या • एसएमएस पावती मिळवा'
                )}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 ml-2" />
            </p>
          </button>

          {/* Action 2: Check my application */}
          <button
            type="button"
            data-testid="cta-check-my-application"
            onClick={() => {
              setShowCaseLookupBar(true);
              applicationsSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            className="p-5 rounded-2xl bg-white hover:bg-[#F2EFE8] border-2 border-[#D6D2C9] hover:border-[#0B3A53] text-left transition-all flex flex-col justify-between gap-3 min-h-[124px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] block">
                  {tr(
                    '2. Status, SMS Receipts & Rejections',
                    '2. आवेदन स्थिति, एसएमएस रसीद व अस्वीकृति कारण',
                    '२. अर्जाची स्थिती, एसएमएस पावती व रिजेक्शन कारण'
                  )}
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#0B3A53] block mt-1">
                  {tr(
                    'Check my application',
                    'मेरा आवेदन जांचें (Check My Application)',
                    'माझा अर्ज तपासा (Check My Application)'
                  )}
                </span>
              </div>
              <Search className="w-6 h-6 text-[#005B50] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] flex items-center justify-between">
              <span>
                {tr(
                  'Enter Case ID, hear official status, or fix a rejected application',
                  'केस आईडी डालें, सरकारी स्थिति सुनें या खारिज आवेदन सुधारें',
                  'केस आयडी टाका, अधिकृत स्थिती ऐका किंवा नाकारलेला अर्ज दुरुस्त करा'
                )}
              </span>
              <ArrowRight className="w-4 h-4 text-[#0B3A53] shrink-0 ml-2" />
            </p>
          </button>

          {/* Action 3: Start with DigiLocker */}
          <button
            type="button"
            data-testid="cta-start-with-digilocker"
            onClick={() =>
              setShowDigiLockerConsentDrawer((prev) => !prev)
            }
            className="p-5 rounded-2xl bg-white hover:bg-[#F2EFE8] border-2 border-[#D6D2C9] hover:border-[#005B50] text-left transition-all flex flex-col justify-between gap-3 min-h-[124px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] block">
                  {tr(
                    '3. Link Once; Consent Per Case & Document',
                    '3. एक बार लिंक करें; प्रत्येक केस व दस्तावेज़ पर सहमति',
                    '३. एकदाच लिंक करा; प्रत्येक केस व कागदपत्रासाठी संमती'
                  )}
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#0B3A53] block mt-1">
                  {tr(
                    'Start with DigiLocker',
                    'डिजिलॉकर के साथ शुरू करें (Start with DigiLocker)',
                    'डिजिलॉकरसह सुरू करा (Start with DigiLocker)'
                  )}
                </span>
              </div>
              <Lock className="w-6 h-6 text-[#005B50] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] flex items-center justify-between">
              <span>
                {tr(
                  'No blanket access forever — fetch only case-required issued certificates',
                  'कोई स्थायी खुली अनुमति नहीं — केवल इस आवेदन के जरूरी प्रमाण पत्र मंगाएं',
                  'कोणतीही कायमची एकत्रित परवानगी नाही — फक्त या अर्जापुरतीच कागदपत्रे घ्या'
                )}
              </span>
              <ArrowRight className="w-4 h-4 text-[#005B50] shrink-0 ml-2" />
            </p>
          </button>

          {/* Action 4: Help a family member with their consent */}
          <button
            type="button"
            data-testid="cta-help-family-member"
            onClick={() => setShowHelperConsentDrawer((prev) => !prev)}
            className="p-5 rounded-2xl bg-white hover:bg-[#F2EFE8] border-2 border-[#D6D2C9] hover:border-[#A94600] text-left transition-all flex flex-col justify-between gap-3 min-h-[124px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A94600] block">
                  {tr(
                    '4. Companion & Zero-Discretion Helper Mode',
                    '4. परिवार सहायक एवं जीरो-डिस्क्रीशन मोड',
                    '४. कुटुंब मदतनीस आणि झिरो-डिस्क्रिशन मोड'
                  )}
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#0B3A53] block mt-1">
                  {tr(
                    'Help a family member with their consent',
                    'परिवार के सदस्य की उनकी सहमति से मदद करें',
                    'कुटुंबातील सदस्याला त्यांच्या संमतीने मदत करा'
                  )}
                </span>
              </div>
              <Users className="w-6 h-6 text-[#A94600] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] flex items-center justify-between">
              <span>
                {tr(
                  'Scan paper documents from your smartphone; approval & SMS receipt stay with citizen',
                  'अपने फोन से कागजी दस्तावेज़ की फोटो जोड़ें; मंजूरी और रसीद नागरिक के फोन पर ही रहेगी',
                  'तुमच्या फोनवरून कागदी दाखल्याचा फोटो जोडा; मंजुरी व पावती नागरिकाच्याच फोनवर राहील'
                )}
              </span>
              <ArrowRight className="w-4 h-4 text-[#A94600] shrink-0 ml-2" />
            </p>
          </button>
        </div>

        {/* Updated 4-Tier Channel Hierarchy Strip */}
        <div className="pt-4 border-t border-[#D6D2C9] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3 space-y-1">
            <div className="font-bold text-[#0B3A53] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#005B50]" />
              <span>
                {tr(
                  '1. Primary: Toll-Free Voice',
                  '1. प्राथमिक: टोल-फ्री कॉल',
                  '१. प्राथमिक: टोल-फ्री कॉल'
                )}
              </span>
            </div>
            <p className="text-[#4B5563]">
              {tr(
                'Conversational voice on any keypad phone (1800-11-7728).',
                'किसी भी साधारण कीपैड फोन पर बोलकर सेवा (1800-11-7728)।',
                'कोणत्याही साध्या कीपॅड फोनवर बोलून सेवा (1800-11-7728).'
              )}
            </p>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3 space-y-1">
            <div className="font-bold text-[#0B3A53] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#005B50]" />
              <span>
                {tr(
                  '2. Secondary: SMS Receipts',
                  '2. द्वितीयक: एसएमएस रसीद',
                  '२. दुय्यम: एसएमएस पावती'
                )}
              </span>
            </div>
            <p className="text-[#4B5563]">
              {tr(
                'Case ID, stage, official ₹0/₹15 fee & callback number by SMS.',
                'केस आईडी, चरण, सरकारी शुल्क (₹0/₹15) और कॉलबैक नंबर एसएमएस पर।',
                'केस आयडी, टप्पा, अधिकृत शुल्क (₹०/₹१५) व कॉलबॅक नंबर एसएमएसवर.'
              )}
            </p>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3 space-y-1">
            <div className="font-bold text-[#0B3A53] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#005B50]" />
              <span>
                {tr(
                  '3. Optional: Web Companion',
                  '3. वैकल्पिक: वेब कम्पैनियन',
                  '३. ऐच्छिक: वेब कम्पॅनियन'
                )}
              </span>
            </div>
            <p className="text-[#4B5563]">
              {tr(
                'Lightweight companion for literate users or family helpers.',
                'पढ़े-लिखे नागरिकों या परिवार के सदस्यों की सहायता के लिए।',
                'साक्षर नागरिक किंवा कुटुंबातील सदस्यांच्या मदतीसाठी.'
              )}
            </p>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3 space-y-1">
            <div className="font-bold text-[#0B3A53] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#005B50]" />
              <span>
                {tr(
                  '4. Fallback: Audited Kiosk',
                  '4. विकल्प: ऑडिटेड कियोस्क',
                  '४. पर्याय: ऑडिटेड कियोस्क'
                )}
              </span>
            </div>
            <p className="text-[#4B5563]">
              {tr(
                'Zero-discretion document capture kiosk; receipt goes to citizen.',
                'जीरो-डिस्क्रीशन दस्तावेज स्कैन केंद्र; रसीद सीधे नागरिक के फोन पर।',
                'झिरो-डिस्क्रिशन कागदपत्र केंद्र; पावती थेट नागरिकाच्या फोनवर.'
              )}
            </p>
          </div>
        </div>

        {/* Secondary Web Companion Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onStartVoiceIntake}
              className="px-3.5 py-2 rounded-lg border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] font-semibold text-[#0B3A53]"
            >
              {tr(
                'Open Companion Web Voice Classifier',
                'वेब वॉयस क्लासिफायर खोलें',
                'वेब व्हॉइस क्लासिफायर उघडा'
              )}
            </button>
            <button
              type="button"
              onClick={onViewServiceCatalog}
              className="px-3.5 py-2 rounded-lg border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] font-semibold text-[#0B3A53]"
            >
              {tr(
                'Browse All 36 State & UT Services',
                'सभी 36 राज्यों की सेवाएं देखें',
                'सर्व ३६ राज्यांच्या सेवा पहा'
              )}
            </button>
          </div>
          <span className="text-[#4B5563] font-medium">
            {tr(
              'Offline-capable call tracking • Portal fetch & submission happen when connected',
              'ऑफलाइन-सक्षम कॉल ट्रैकिंग • पोर्टल सबमिशन व डिजिलॉकर कनेक्टिविटी पर',
              'ऑफलाइन-सक्षम कॉल ट्रॅकिंग • पोर्टल सबमिशन व डिजिलॉकर कनेक्टिव्हिटीवर'
            )}
          </span>
        </div>
      </section>

      {/* EXPANDABLE DRAWER A: "Start with DigiLocker" — Link Once; Consent Per Case and Per Document */}
      {showDigiLockerConsentDrawer && (
        <section
          aria-labelledby="digilocker-consent-heading"
          data-testid="digilocker-consent-drawer"
          className="bg-white border-2 border-[#005B50] rounded-2xl p-6 shadow-sm space-y-5"
        >
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D6D2C9]">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] block">
                {tr(
                  'DigiLocker Policy: Link Once; Consent Per Case & Per Document',
                  'डिजिलॉकर नीति: एक बार लिंक करें; प्रत्येक केस और प्रत्येक दस्तावेज़ पर अलग सहमति',
                  'डिजिलॉकर धोरण: एकदाच लिंक करा; प्रत्येक केस आणि प्रत्येक कागदपत्रासाठी स्वतंत्र संमती'
                )}
              </span>
              <h2
                id="digilocker-consent-heading"
                className="text-xl font-bold text-[#0B3A53]"
              >
                {tr(
                  'Explicit Case-Scoped DigiLocker & Paper Document Strategy',
                  'केस-सीमित डिजिलॉकर एवं कागजी दस्तावेज़ रणनीति',
                  'केस-मर्यादित डिजिलॉकर आणि कागदी दस्तऐवज कार्यपद्धती'
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                {sampleDigiLockerConsent.scopeNote[language]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDigiLockerConsentDrawer(false)}
              className="text-xs font-bold text-[#4B5563] hover:text-[#18212B] px-2.5 py-1 rounded border border-[#D6D2C9]"
            >
              {tr('Close', 'बंद करें', 'बंद करा')}
            </button>
          </div>

          {/* Exact Spoken & DTMF Consent Prompt */}
          <div className="bg-[#FFFDF8] border border-[#005B50] rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold uppercase text-[#005B50] block">
              {tr(
                'Spoken & SMS Consent Prompt for This Application:',
                'इस आवेदन के लिए बोला जाने वाला सहमति संदेश:',
                'या अर्जासाठी वाचून दाखवला जाणारा संमती संदेश:'
              )}
            </span>
            <p className="text-sm sm:text-base font-bold text-[#0B3A53]">
              “{sampleDigiLockerConsent.consentPrompt[language]}”
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                data-testid="approve-digilocker-case-btn"
                onClick={() => {
                  setDigiLockerApprovedForCase(true);
                  onStartWithDigiLocker(defaultIncomeService);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#005B50] hover:bg-[#00473e] text-white text-xs sm:text-sm font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {tr(
                    'Press 1 / Approve DigiLocker Fetch for This Case Only & Continue',
                    '1 दबाएं / केवल इस केस के लिए डिजिलॉकर सहमति दें और आगे बढ़ें',
                    '1 दाबा / फक्त या केससाठी डिजिलॉकर संमती द्या आणि पुढे जा'
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* 3-Path Document Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 space-y-1.5">
              <strong className="text-[#0B3A53] text-sm block">
                {tr(
                  '1. DigiLocker-Issued Document Available',
                  '1. डिजिलॉकर में जारी दस्तावेज़ उपलब्ध',
                  '१. डिजिलॉकरमध्ये जारी कागदपत्र उपलब्ध'
                )}
              </strong>
              <p className="text-[#4B5563]">
                {tr(
                  'Retrieved only after your spoken + DTMF/SMS consent, strictly scoped to that single Case ID.',
                  'आपकी बोलकर और 1 दबाकर दी गई सहमति के बाद केवल उसी केस आईडी के लिए लिया जाता है।',
                  'तुमच्या तोंडी व कीपॅड संमतीनंतर फक्त त्याच केस आयडीसाठी घेतले जाते.'
                )}
              </p>
            </div>

            <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 space-y-1.5">
              <strong className="text-[#0B3A53] text-sm block">
                {tr(
                  '2. Paper Document Only (4 Safe Routes)',
                  '2. केवल कागजी दस्तावेज़ (4 सुरक्षित रास्ते)',
                  '२. फक्त कागदी दाखला (४ सुरक्षित पर्याय)'
                )}
              </strong>
              <p className="text-[#4B5563]">
                {tr(
                  '(a) Family smartphone companion link, (b) Self-service camera kiosk, (c) Audited field capture device, or (d) In-person office verification.',
                  '(क) परिवार के स्मार्टफोन पर लिंक, (ख) सेल्फ-सर्विस कैमरा कियोस्क, (ग) ऑडिटेड फील्ड डिवाइस, या (घ) तहसील में प्रत्यक्ष सत्यापन।',
                  '(अ) कुटुंबाच्या स्मार्टफोनवर लिंक, (ब) सेल्फ-सर्व्हिस कियोस्क, (क) ऑडिटेड फिल्ड डिव्हाइस, किंवा (ड) कार्यालयात प्रत्यक्ष पडताळणी.'
                )}
              </p>
            </div>

            <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 space-y-1.5">
              <strong className="text-[#0B3A53] text-sm block">
                {tr(
                  '3. Document Not Accepted / Unreadable',
                  '3. दस्तावेज़ अस्वीकृत या अस्पष्ट होने पर',
                  '३. कागदपत्र अमान्य किंवा अस्पष्ट असल्यास'
                )}
              </strong>
              <p className="text-[#4B5563]">
                {tr(
                  'Explains exact issue in voice & SMS (“The address proof is older than the allowed period” or “All pages were not captured”) and offers the valid alternative.',
                  'कॉल और एसएमएस में सटीक कारण बताता है (“निवास प्रमाण निर्धारित अवधि से पुराना है” या “सभी पृष्ठ कैप्चर नहीं हुए”) और सही विकल्प सुझाता है।',
                  'कॉल व एसएमएसद्वारे नेमके कारण सांगतो (“पत्त्याचा पुरावा मुदतीपेक्षा जुना आहे” किंवा “सर्व पाने टिपली गेली नाहीत”) आणि वैध पर्याय देतो.'
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EXPANDABLE DRAWER B: "Help a family member with their consent" — Zero-Discretion Helper & Kiosk Guardrails */}
      {showHelperConsentDrawer && (
        <section
          aria-labelledby="helper-mode-heading"
          data-testid="helper-consent-drawer"
          className="bg-white border-2 border-[#A94600] rounded-2xl p-6 shadow-sm space-y-5"
        >
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D6D2C9]">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A94600] block">
                {tr(
                  'Zero-Discretion Family Companion & Assisted Center Mode',
                  'परिवार सहायक एवं जीरो-डिस्क्रीशन (Zero-Discretion) सुरक्षा नियम',
                  'कुटुंब मदतनीस आणि झिरो-डिस्क्रिशन (Zero-Discretion) सुरक्षा नियम'
                )}
              </span>
              <h2
                id="helper-mode-heading"
                className="text-xl font-bold text-[#0B3A53]"
              >
                {tr(
                  'Help a Family Member Without Becoming a Middleman',
                  'नागरिक के नियंत्रण को कम किए बिना परिवार के सदस्य की सहायता करें',
                  'नागरिकाचे नियंत्रण कायम ठेवून कुटुंबातील सदस्याला मदत करा'
                )}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowHelperConsentDrawer(false)}
              className="text-xs font-bold text-[#4B5563] hover:text-[#18212B] px-2.5 py-1 rounded border border-[#D6D2C9]"
            >
              {tr('Close', 'बंद करें', 'बंद करा')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#0B3A53]">
                {tr(
                  '5 Hard Zero-Discretion Rules for Helpers & Kiosks:',
                  'सहायक और कियोस्क के लिए 5 कठोर नियम:',
                  'मदतनीस आणि कियोस्कसाठी ५ कठोर नियम:'
                )}
              </h3>
              <ul className="space-y-2 text-xs text-[#18212B]">
                {ZERO_DISCRETION_HELPER_RULES.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#005B50] shrink-0 mt-0.5" />
                    <span>{rule[language]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#0B3A53]">
                {tr(
                  'Request Citizen Consent via Outbound Call / SMS:',
                  'नागरिक के मोबाइल पर सहमति कॉल / एसएमएस भेजें:',
                  'नागरिकाच्या मोबाईलवर संमती कॉल / एसएमएस पाठवा:'
                )}
              </h3>
              <label className="block text-xs font-semibold text-[#18212B]">
                {tr(
                  'Citizen’s Registered Keypad Mobile Number:',
                  'नागरिक का पंजीकृत कीपैड मोबाइल नंबर:',
                  'नागरिकाचा नोंदणीकृत कीपॅड मोबाईल नंबर:'
                )}
                <input
                  type="text"
                  value={helperCitizenPhone}
                  onChange={(e) => setHelperCitizenPhone(e.target.value)}
                  className="mt-1 w-full bg-white border border-[#D6D2C9] rounded-lg px-3 py-2 text-sm font-mono"
                />
              </label>

              <button
                type="button"
                data-testid="send-helper-consent-request-btn"
                onClick={() => setHelperSmsDispatched(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0B3A53] hover:bg-[#08283a] text-white text-xs font-bold"
              >
                {tr(
                  'Trigger Voice Callback to Citizen for Press-1 Helper Consent',
                  'नागरिक के फोन पर 1-दबाकर सहमति के लिए कॉलबैक भेजें',
                  'नागरिकाच्या फोनवर 1-दाबून संमतीसाठी कॉलबॅक पाठवा'
                )}
              </button>

              {helperSmsDispatched && (
                <div className="bg-white border border-[#005B50] rounded-lg p-3 text-xs text-[#005B50] font-semibold">
                  ✓{' '}
                  {tr(
                    `Outbound call placed to ${helperCitizenPhone}. Once the citizen presses 1, you can photograph their paper document for this case only.`,
                    `${helperCitizenPhone} पर कॉलबैक भेजा गया। नागरिक द्वारा 1 दबाते ही आप केवल इस केस के लिए कागजी दस्तावेज की फोटो जोड़ सकेंगे।`,
                    `${helperCitizenPhone} वर कॉलबॅक पाठवला. नागरिकाने 1 दाबताच तुम्ही फक्त या केससाठी कागदी दाखल्याचा फोटो जोडू शकाल.`
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-[#D6D2C9] space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#4B5563] block">
                  {tr(
                    '4 Paper Document Capture Routes:',
                    'कागजी दस्तावेजों के लिए 4 सुरक्षित रास्ते:',
                    'कागदी कागदपत्रांसाठी ४ सुरक्षित मार्ग:'
                  )}
                </span>
                {PAPER_DOCUMENT_FALLBACK_ROUTES.map((route) => (
                  <div key={route.id} className="text-[11px] text-[#18212B]">
                    <strong>{route.title[language]}:</strong>{' '}
                    {route.zeroDiscretionGuardrail[language]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. PRIMARY PRODUCT INTERACTIVE KEYPAD-MOBILE CALL & SMS RECEIPT SIMULATOR */}
      <div ref={keypadSectionRef}>
        <KeypadPhoneSimulator
          language={language}
          onLanguageChange={onLanguageChange}
          smsReceipts={smsReceipts}
          onNewSmsReceipt={onNewSmsReceipt}
          onOpenDigiLockerFlow={() => {
            onStartWithDigiLocker(defaultIncomeService);
          }}
          onOpenRejectionJourney={() => {
            const rejectedCase =
              applications.find((a) => a.status === 'rejected') ||
              applications[0];
            if (rejectedCase) onOpenRejectionJourney(rejectedCase);
          }}
          onOpenFollowUpCall={(caseId) => {
            const target =
              applications.find((a) => a.id === caseId) || applications[0];
            if (target) onStartFollowUpCall(target);
          }}
          applications={applications}
        />
      </div>

      {/* 3. CHECK MY APPLICATION: Rejected, Stalled & Active Applications */}
      <div ref={applicationsSectionRef} className="space-y-6">
        {showCaseLookupBar && (
          <div className="bg-white border-2 border-[#0B3A53] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-[#0B3A53] shrink-0" />
              <input
                type="text"
                value={caseLookupQuery}
                onChange={(e) => setCaseLookupQuery(e.target.value)}
                placeholder={tr(
                  'Enter Case ID / Acknowledgement No. (e.g. MH-APLS-2026-55104 or UP-SSPY-2026-78419)...',
                  'केस आईडी या पावती संख्या दर्ज करें (जैसे MH-APLS-2026-55104)...',
                  'केस आयडी किंवा पोचपावती क्रमांक टाका (उदा. MH-APLS-2026-55104)...'
                )}
                aria-label={tr(
                  'Search application by Case ID',
                  'केस आईडी से आवेदन खोजें',
                  'केस आयडीने अर्ज शोधा'
                )}
                className="w-full bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#18212B]"
              />
            </div>
            <button
              type="button"
              onClick={onNavigateTracking}
              className="px-4 py-2 rounded-xl bg-[#0B3A53] text-white text-xs font-bold shrink-0"
            >
              {tr(
                'Open Full Tracking View',
                'पूर्ण ट्रैकिंग डैशबोर्ड खोलें',
                'संपूर्ण ट्रॅकिंग डॅशबोर्ड उघडा'
              )}
            </button>
          </div>
        )}

        {/* Rejected & Needs Action Section */}
        {rejectedAndNeedsActionApps.length > 0 && (
          <section
            aria-labelledby="needs-action-heading"
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#A61B1B]" />
                <h2
                  id="needs-action-heading"
                  className="text-xl font-bold text-[#18212B]"
                >
                  {tr(
                    'Rejected & Action-Required Applications',
                    'अस्वीकृत (Rejected) एवं तुरंत कार्यवाही वाले आवेदन',
                    'नाकारलेले (Rejected) आणि तातडीची कृती आवश्यक असलेले अर्ज'
                  )}
                </h2>
                <span className="text-xs font-bold text-[#A61B1B]">
                  ({rejectedAndNeedsActionApps.length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {rejectedAndNeedsActionApps.map((app) => {
                const isRejected = app.status === 'rejected';
                return (
                  <div
                    key={app.id}
                    data-testid={`case-card-${app.id}`}
                    className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-sm space-y-4 ${
                      isRejected
                        ? 'border-[#A61B1B]'
                        : 'border-[#A94600]/50 hover:border-[#A94600]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D6D2C9]">
                      <div>
                        <span className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                          {getLocalizedStateName(app.state, language)} •{' '}
                          {app.portalName} •{' '}
                          {tr('Official Fee:', 'सरकारी शुल्क:', 'अधिकृत शुल्क:')}{' '}
                          {app.officialFee === 0
                            ? '₹0'
                            : `₹${app.officialFee ?? 15}`}
                        </span>
                        <h3 className="text-lg font-bold text-[#0B3A53] mt-0.5">
                          {app.serviceName[language]}
                        </h3>
                        <p className="text-xs text-[#4B5563]">
                          {tr('Applicant', 'आवेदक', 'अर्जदार')}:{' '}
                          <strong>{app.applicantName}</strong> ({app.phoneMasked}
                          ) •{' '}
                          <span className="font-mono font-bold text-[#0B3A53]">
                            {app.acknowledgementNumber}
                          </span>
                        </p>
                      </div>
                      <div>{getStatusLabel(app.status)}</div>
                    </div>

                    {/* Plain-language explanation vs Official portal notice */}
                    <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 space-y-2">
                      <div className="text-xs text-[#4B5563]">
                        <span className="font-semibold text-[#18212B]">
                          {tr(
                            'Official Portal Status:',
                            'सरकारी पोर्टल की स्थिति:',
                            'शासकीय पोर्टलची स्थिती:'
                          )}
                        </span>{' '}
                        <span className="font-mono text-xs text-[#A61B1B] font-bold">
                          {app.officialStatusText[language]}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#18212B] leading-relaxed">
                        <span
                          className={`font-bold ${
                            isRejected ? 'text-[#A61B1B]' : 'text-[#A94600]'
                          }`}
                        >
                          {tr(
                            'Spoken & SMS Explanation:',
                            'कॉल और एसएमएस व्याख्या:',
                            'कॉल आणि एसएमएस अर्थ:'
                          )}
                        </span>{' '}
                        {app.plainExplanation[language]}
                      </p>
                      {isRejected && app.rejectionDetails && (
                        <p className="text-xs font-bold text-[#005B50]">
                          ✓ {app.rejectionDetails.reassuranceMessage[language]}{' '}
                          • “{app.rejectionDetails.nonAutoResubmitPledge[language]}”
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-[#4B5563] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A94600]" />
                        <span>
                          {tr('Next step:', 'अगला कदम:', 'पुढील पाऊल:')}{' '}
                          {localizeNextActionDate(app.nextActionDate, language)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {isRejected ? (
                          <button
                            type="button"
                            data-testid={`open-rejection-journey-${app.id}`}
                            onClick={() => onOpenRejectionJourney(app)}
                            className="px-4 py-2.5 rounded-xl bg-[#A61B1B] hover:bg-red-800 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
                          >
                            <span>
                              {tr(
                                'Hear Rejection Reason & Prepare Correction',
                                'अस्वीकृति कारण सुनें और सुधार तैयार करें',
                                'नाकारण्याचे कारण ऐका आणि दुरुस्ती तयार करा'
                              )}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onStartFollowUpCall(app)}
                            className="px-4 py-2.5 rounded-xl bg-[#A94600] hover:bg-[#883600] text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
                          >
                            <PhoneCall className="w-4 h-4" />
                            <span>
                              {tr(
                                'Approve District Office Call (Press 1)',
                                'जिला कार्यालय कॉल को मंजूरी दें (1 दबाएं)',
                                'जिल्हा कार्यालय कॉलला मंजुरी द्या (1 दाबा)'
                              )}
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectApplication(app)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#D6D2C9] bg-[#F2EFE8] hover:bg-white text-xs font-bold text-[#0B3A53]"
                        >
                          {tr(
                            'View Audit & SMS Log',
                            'ऑडिट और एसएमएस लॉग देखें',
                            'ऑडिट आणि एसएमएस लॉग पहा'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Active Applications Section */}
        <section aria-labelledby="active-apps-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#005B50]" />
              <h2
                id="active-apps-heading"
                className="text-xl font-bold text-[#18212B]"
              >
                {tr(
                  'Active Applications',
                  'प्रक्रियाधीन आवेदन',
                  'प्रक्रियेतील अर्ज'
                )}
              </h2>
              <span className="text-xs font-bold text-[#0B3A53]">
                ({activeApps.length})
              </span>
            </div>
          </div>

          {activeApps.length === 0 ? (
            <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-6 text-center text-[#4B5563] text-sm">
              {tr(
                'No active applications matching your filter.',
                'इस फ़िल्टर में कोई सक्रिय आवेदन नहीं है।',
                'या फिल्टरमध्ये कोणताही सक्रिय अर्ज नाही.'
              )}
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
                        {getLocalizedStateName(app.state, language)} •{' '}
                        {app.portalName}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#0B3A53]">
                        {app.serviceName[language]}
                      </h3>
                    </div>
                    <div>{getStatusLabel(app.status)}</div>
                  </div>

                  <div className="text-xs sm:text-sm text-[#4B5563] space-y-1">
                    {app.acknowledgementNumber && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#18212B]">
                          {tr(
                            'Acknowledgement No:',
                            'पावती क्रमांक:',
                            'पोचपावती क्रमांक:'
                          )}
                        </span>
                        <span className="font-mono text-[#0B3A53] font-bold">
                          {app.acknowledgementNumber}
                        </span>
                      </div>
                    )}
                    <p className="text-[#18212B] bg-[#FFFDF8] p-2.5 rounded border border-[#D6D2C9]">
                      <span className="font-semibold text-[#005B50]">
                        {tr(
                          'Plain Explanation:',
                          'ताजा अपडेट:',
                          'ताजे अपडेट:'
                        )}
                      </span>{' '}
                      {app.plainExplanation[language]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#D6D2C9]/60 text-xs text-[#4B5563]">
                    <span>
                      {tr(
                        'Official Fee:',
                        'सरकारी शुल्क:',
                        'अधिकृत शुल्क:'
                      )}{' '}
                      <strong>
                        {app.officialFee === 0
                          ? '₹0 (Free)'
                          : `₹${app.officialFee ?? 15}`}
                      </strong>
                    </span>
                    <span className="text-[#005EA8] font-semibold flex items-center gap-1">
                      {tr(
                        'View timeline, SMS receipt & audit trail',
                        'विवरण, एसएमएस रसीद और ऑडिट देखें',
                        'तपशील, एसएमएस पावती आणि ऑडिट पहा'
                      )}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Applications */}
        {completedApps.length > 0 && (
          <section
            aria-labelledby="completed-apps-heading"
            className="space-y-3"
          >
            <h2
              id="completed-apps-heading"
              className="text-lg font-bold text-[#18212B]"
            >
              {tr(
                'Completed History',
                'पूर्ण एवं सुरक्षित इतिहास',
                'पूर्ण झालेला इतिहास'
              )}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {completedApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="bg-[#F2EFE8]/70 border border-[#D6D2C9] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#F2EFE8]"
                >
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-[#0B3A53]">
                      {app.serviceName[language]}
                    </h4>
                    <p className="text-xs text-[#4B5563]">
                      {app.acknowledgementNumber} • {app.applicantName}
                    </p>
                  </div>
                  {getStatusLabel(app.status)}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 4. PROACTIVE LIFE-EVENT TRIGGERS SECTION (Clean border, no border-l-4) */}
      <section
        aria-labelledby="life-event-heading"
        className="bg-white border-2 border-[#005B50]/50 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D6D2C9]">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#005B50] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeTrigger.detectedSignalBadge[language]}</span>
            </div>
            <h2
              id="life-event-heading"
              className="text-xl sm:text-2xl font-bold text-[#0B3A53]"
            >
              {tr(
                'Life-Event Triggers (Proactive Multi-Service Agent)',
                'जीवन-घटना आधारित सक्रिय एजेंट (एक घटना — अनेक सरकारी लाभ)',
                'जीवन-घटना आधारित सक्रिय एजंट (एक घटना — अनेक शासकीय योजना)'
              )}
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {LIFE_EVENT_TRIGGERS.map((trig) => (
              <button
                key={trig.id}
                type="button"
                onClick={() => setActiveLifeEventId(trig.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border min-h-[40px] ${
                  activeLifeEventId === trig.id
                    ? 'bg-[#0B3A53] text-white border-[#0B3A53]'
                    : 'bg-[#F2EFE8] text-[#18212B] border-[#D6D2C9] hover:bg-white'
                }`}
              >
                {trig.eventTitle[language]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#005B50]/40 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005B50]">
            <Layers className="w-4 h-4" />
            <span>
              {tr(
                `Pratinidhi Proactive Notice (${getLocalizedStateName(selectedState, 'en')}):`,
                `प्रतिनिधि सक्रिय सुझाव (${getLocalizedStateName(selectedState, 'hi')}):`,
                `प्रतिनिधी सक्रिय सूचना (${getLocalizedStateName(selectedState, 'mr')}):`
              )}
            </span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-[#0B3A53] leading-relaxed">
            {activeTrigger.proactiveAgentPrompt[language]}
          </p>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            <strong className="text-[#18212B]">
              {tr(
                'Combined Family Benefit:',
                'कुल पारिवारिक लाभ:',
                'एकूण कौटुंबिक लाभ:'
              )}
            </strong>{' '}
            {activeTrigger.totalEstimatedBenefit[language]}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unlockedServices.map((srv, idx) => {
            const isChecked = selectedBundleIds[srv.id] !== false;
            return (
              <label
                key={srv.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#F2EFE8]/60 border-[#0B3A53]'
                    : 'bg-white border-[#D6D2C9] opacity-75'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleBundleService(srv.id)}
                  className="w-5 h-5 rounded border-[#D6D2C9] text-[#005B50] mt-0.5 shrink-0"
                />
                <div className="text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0B3A53]">
                      #{idx + 1} {srv.name[language]}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1 line-clamp-2">
                    {srv.description[language]}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-[#005B50]">
                    <span>
                      {tr('Official Fee:', 'सरकारी शुल्क:', 'अधिकृत शुल्क:')}{' '}
                      {srv.officialFee === 0 ? '₹0' : `₹${srv.officialFee}`}
                    </span>
                    <span>•</span>
                    <span>
                      SLA: {srv.estimatedDays} {tr('days', 'दिन', 'दिवस')}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-[#4B5563]">
            ✓ {activeTrigger.sharedDocumentsSummary[language]}
          </div>

          <button
            type="button"
            disabled={currentlyCheckedServices.length === 0}
            onClick={() =>
              onStartLifeEventBundle(activeTrigger, currentlyCheckedServices)
            }
            className="px-6 py-3.5 rounded-xl bg-[#005B50] hover:bg-[#00473e] disabled:opacity-40 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 min-h-[48px] shrink-0"
          >
            <span>
              {tr(
                `Yes, Start All ${currentlyCheckedServices.length} Selected Services`,
                `हाँ, चयनित सभी ${currentlyCheckedServices.length} सेवाएं एक साथ शुरू करें`,
                `होय, निवडलेल्या सर्व ${currentlyCheckedServices.length} सेवा एकत्र सुरू करा`
              )}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. ANTI-MIDDLEMAN PROTECTIONS LEDGER */}
      <section
        aria-labelledby="anti-middleman-heading"
        className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#005B50]" />
          <h2
            id="anti-middleman-heading"
            className="text-lg sm:text-xl font-bold text-[#0B3A53]"
          >
            {tr(
              'Anti-Middleman & Citizen Protection Guarantees',
              'बिचौलिया-विरोधी एवं नागरिक सुरक्षा गारंटी',
              'मध्यस्थ-विरोधी आणि नागरिक संरक्षण हमी'
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3.5 space-y-1">
            <strong className="text-[#0B3A53] block">
              {tr(
                'Official Fee Shown Upfront',
                'सरकारी शुल्क पहले ही स्पष्ट',
                'अधिकृत शुल्क आधीच स्पष्ट'
              )}
            </strong>
            <p className="text-[#4B5563]">
              {tr(
                'Displays ₹0 where free (e.g., Pension / Scholarship) and exact statutory fee before submission.',
                'निःशुल्क सेवाओं के लिए ₹0 और सबमिशन से पहले सटीक सरकारी शुल्क दिखाता है।',
                'मोफत सेवांसाठी ₹० आणि सबमिशनपूर्वीच अचूक शासकीय शुल्क दाखवतो.'
              )}
            </p>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3.5 space-y-1">
            <strong className="text-[#0B3A53] block">
              {tr(
                'Never Cash, UPI PIN, or OTP',
                'नकद, यूपीआई पिन या ओटीपी कभी नहीं',
                'रोख पैसे, यूपीआय पिन किंवा ओटीपी कधीही नाही'
              )}
            </strong>
            <p className="text-[#4B5563]">
              {tr(
                'Never accepts cash and never asks for UPI PIN, bank password, Aadhaar OTP, or DigiLocker password.',
                'कभी नकद स्वीकार नहीं करता और न ही UPI पिन, बैंक पासवर्ड, आधार ओटीपी या डिजिलॉकर पासवर्ड मांगता है।',
                'कधीही रोख पैसे घेत नाही आणि UPI पिन, बँक पासवर्ड किंवा आधार ओटीपी मागत नाही.'
              )}
            </p>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3.5 space-y-1">
            <strong className="text-[#0B3A53] block">
              {tr(
                'Direct SMS Receipt to Citizen',
                'सीधे नागरिक के फोन पर एसएमएस रसीद',
                'थेट नागरिकाच्या फोनवर एसएमएस पावती'
              )}
            </strong>
            <p className="text-[#4B5563]">
              {tr(
                'Official acknowledgement number is sent directly to the citizen’s mobile phone by SMS.',
                'सरकारी पावती क्रमांक सीधे नागरिक के स्वयं के मोबाइल नंबर पर एसएमएस से भेजा जाता है।',
                'अधिकृत पोचपावती क्रमांक थेट नागरिकाच्याच मोबाईलवर एसएमएसने पाठवला जातो.'
              )}
            </p>
          </div>

          <div className="bg-white border border-[#D6D2C9] rounded-xl p-3.5 space-y-1">
            <strong className="text-[#0B3A53] block">
              {tr(
                'Document Sharing Action History',
                'दस्तावेज़ साझाकरण का पूरा हिसाब',
                'कागदपत्र शेअरिंगचा संपूर्ण इतिहास'
              )}
            </strong>
            <p className="text-[#4B5563]">
              {tr(
                'Logs every share: “Your address proof was shared with this portal on this date.”',
                'हर कदम दर्ज: “आपका निवास प्रमाण इस तारीख को इस सरकारी पोर्टल के साथ साझा किया गया।”',
                'प्रत्येक कृतीची नोंद: “तुमचा पत्ता पुरावा या तारखेला या पोर्टलवर शेअर केला गेला.”'
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
