/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types/civic';
import {
  ShieldCheck,
  HelpCircle,
  Home,
  Mic,
  ClipboardList,
  PhoneCall,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import type { User } from 'firebase/auth';

export type MainNavView =
  | 'home'
  | 'voice_intake'
  | 'document_checklist'
  | 'tracking_dashboard'
  | 'followup_call';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPrivacy: () => void;
  onOpenHelp: () => void;
  onNavigateHome: () => void;
  currentView: MainNavView;
  onNavigateView: (view: MainNavView) => void;
  user: User | null;
  authLoading?: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenPrivacy,
  onOpenHelp,
  onNavigateHome,
  currentView,
  onNavigateView,
  user,
  authLoading = false,
  onSignIn,
  onSignOut,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const navItems: {
    id: MainNavView;
    label: { en: string; hi: string; mr: string };
    icon: React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'voice_intake',
      label: { en: 'Service Flow', hi: 'आवाज़ से आवेदन', mr: 'आवाजाने अर्ज' },
      icon: <Mic className="w-4 h-4" />,
    },
    {
      id: 'tracking_dashboard',
      label: { en: 'Tracking Dashboard', hi: 'आवेदन ट्रैकिंग', mr: 'अर्ज ट्रॅकिंग' },
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      id: 'followup_call',
      label: { en: 'Follow-up Call', hi: 'फॉलो-अप कॉल', mr: 'फॉलो-अप कॉल' },
      icon: <PhoneCall className="w-4 h-4" />,
    },
  ];

  const isServiceFlowActive =
    currentView === 'voice_intake' || currentView === 'document_checklist';

  return (
    <header className="bg-[#FFFDF8] border-b border-[#D6D2C9] sticky top-0 z-30">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-[#005EA8] rounded-lg p-1.5 transition-colors hover:bg-[#F2EFE8] shrink-0"
          aria-label={tr(
            'Go to Pratinidhi Homepage',
            'प्रतिनिधि होमपेज पर जाएं',
            'प्रतिनिधी मुख्यपृष्ठावर जा'
          )}
        >
          <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm shrink-0 relative flex items-center justify-center bg-[#6B2135]">
            <span className="block w-full h-full relative overflow-hidden">
              <img
                src="/assets/aistudio/pratinidhi_voice_and_safeguard_logo_fe1b5129.png"
                alt={tr(
                  'Pratinidhi Shield and Voice Emblem',
                  'प्रतिनिधि प्रतीक चिन्ह',
                  'प्रतिनिधी प्रतीक चिन्ह'
                )}
                className="absolute max-w-none w-[425%] h-[150%] -left-[37.8%] -top-[25%] select-none pointer-events-none"
              />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#1a365d]">
                {tr('Pratinidhi', 'प्रतिनिधि', 'प्रतिनिधी')}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#F2EFE8] text-[#005B50] border border-[#D6D2C9] hidden md:inline-flex">
                {tr('Civic Agent', 'नागरिक सेवा सहायक', 'नागरी सेवा सहाय्यक')}
              </span>
            </div>
            <p className="text-xs text-[#4B5563] hidden sm:block">
              {tr(
                'Speaks for you. Guards your data.',
                'आपकी आवाज़। आपके डेटा की सुरक्षा।',
                'तुमचा आवाज. तुमच्या डेटाचे रक्षण.'
              )}
            </p>
          </div>
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher: English | हिन्दी | मराठी */}
          <div
            className="inline-flex rounded-lg border border-[#D6D2C9] bg-[#F2EFE8] p-0.5 text-sm font-medium"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              data-testid="lang-btn-en"
              onClick={() => onLanguageChange('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all min-h-[38px] flex items-center justify-center ${
                language === 'en'
                  ? 'bg-[#1a365d] text-white shadow-sm'
                  : 'text-[#18212B] hover:text-[#1a365d]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              data-testid="lang-btn-hi"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all min-h-[38px] flex items-center justify-center ${
                language === 'hi'
                  ? 'bg-[#1a365d] text-white shadow-sm'
                  : 'text-[#18212B] hover:text-[#1a365d]'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              data-testid="lang-btn-mr"
              onClick={() => onLanguageChange('mr')}
              className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all min-h-[38px] flex items-center justify-center ${
                language === 'mr'
                  ? 'bg-[#1a365d] text-white shadow-sm'
                  : 'text-[#18212B] hover:text-[#1a365d]'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Firebase Auth User Profile / Sign-In Button */}
          {!authLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-2 bg-white border border-[#D6D2C9] rounded-xl px-2.5 py-1.5 shadow-2xs">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Citizen'}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-[#1a365d]/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1a365d] text-white flex items-center justify-center text-xs font-bold">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="hidden lg:block text-left max-w-[130px]">
                    <span className="block text-xs font-bold text-[#1a365d] truncate">
                      {user.displayName || tr('Signed Citizen', 'पंजीकृत नागरिक', 'नोंदणीकृत नागरिक')}
                    </span>
                    <span className="block text-[10px] text-[#005B50] font-semibold">
                      ● {tr('Cloud Synced', 'क्लाउड सिंक', 'क्लाउड सिंक')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    title={tr('Sign out', 'लॉग आउट करें', 'बाहेर पडा')}
                    className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#A61B1B] hover:bg-[#F2EFE8] transition-colors"
                    aria-label={tr('Sign out', 'लॉग आउट करें', 'बाहेर पडा')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onSignIn}
                  data-testid="google-signin-btn"
                  className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-[#1a365d] hover:bg-[#0B3A53] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#f97316]" />
                  <span>
                    {tr('Sign in with Google', 'गूगल से साइन-इन', 'गुगलने साइन-इन')}
                  </span>
                </button>
              )}
            </>
          )}

          {/* Privacy & Consent Center Button */}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 px-2.5 py-2 min-h-[40px] rounded-lg border border-[#D6D2C9] bg-white text-xs font-medium text-[#1a365d] hover:bg-[#F2EFE8] transition-colors focus:ring-2 focus:ring-[#005EA8]"
            title={tr(
              'Privacy and Consent Controls',
              'गोपनीयता एवं सहमति नियंत्रण',
              'गोपनीयता आणि संमती नियंत्रण'
            )}
          >
            <ShieldCheck className="w-4 h-4 text-[#005B50]" />
            <span className="hidden xl:inline">
              {tr('Consent Audit', 'सहमति ऑडिट', 'संमती ऑडिट')}
            </span>
          </button>

          {/* Help Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#4B5563] hover:bg-[#F2EFE8] hover:text-[#1a365d] transition-colors focus:ring-2 focus:ring-[#005EA8]"
            aria-label={tr('Help', 'मदद', 'मदत')}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Secondary Navigation Bar: 4 Main Screens */}
      <nav
        aria-label={tr('Main navigation', 'मुख्य नेविगेशन', 'मुख्य नेव्हिगेशन')}
        className="bg-[#F2EFE8]/70 border-t border-[#D6D2C9]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5">
          {navItems.map((item) => {
            const isActive =
              item.id === 'voice_intake'
                ? isServiceFlowActive
                : currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`nav-${item.id}`}
                onClick={() => onNavigateView(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all min-h-[38px] ${
                  isActive
                    ? 'bg-[#1a365d] text-white shadow-xs border-b-2 border-[#f97316]'
                    : 'text-[#18212B] hover:bg-white hover:text-[#1a365d]'
                }`}
              >
                <span className={isActive ? 'text-[#f97316]' : 'text-[#005B50]'}>
                  {item.icon}
                </span>
                <span>{item.label[language]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
