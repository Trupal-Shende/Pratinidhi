/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types/civic';
import { ShieldCheck, Globe, HelpCircle, FileText } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPrivacy: () => void;
  onOpenHelp: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenPrivacy,
  onOpenHelp,
  onNavigateHome,
}) => {
  return (
    <header className="bg-[#FFFDF8] border-b border-[#D6D2C9] sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand / Title */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-[#005EA8] rounded-lg p-1.5 transition-colors hover:bg-[#F2EFE8]"
          aria-label={language === 'hi' ? 'जनसेवा होमपेज पर जाएं' : 'Go to JanSeva Homepage'}
        >
          <div className="w-10 h-10 rounded-xl bg-[#0B3A53] flex items-center justify-center text-white font-bold shadow-sm">
            <span className="text-lg">जन</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#0B3A53]">
                {language === 'hi' ? 'जनसेवा' : 'JanSeva'}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#F2EFE8] text-[#005B50] border border-[#D6D2C9] hidden sm:inline-flex">
                {language === 'hi' ? 'नागरिक सेवा सहायक' : 'Civic Agent'}
              </span>
            </div>
            <p className="text-xs text-[#4B5563] hidden sm:block">
              {language === 'hi'
                ? 'नागरिक-सहमति आधारित सरकारी सेवा सहायक'
                : 'Consent-first assistance for Indian government services'}
            </p>
          </div>
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div
            className="inline-flex rounded-lg border border-[#D6D2C9] bg-[#F2EFE8] p-0.5 text-sm font-medium"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all min-h-[40px] flex items-center justify-center ${
                language === 'en'
                  ? 'bg-[#0B3A53] text-white shadow-sm'
                  : 'text-[#18212B] hover:text-[#0B3A53]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all min-h-[40px] flex items-center justify-center ${
                language === 'hi'
                  ? 'bg-[#0B3A53] text-white shadow-sm'
                  : 'text-[#18212B] hover:text-[#0B3A53]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Privacy & Consent Center Button */}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-[#D6D2C9] bg-white text-xs sm:text-sm font-medium text-[#0B3A53] hover:bg-[#F2EFE8] transition-colors focus:ring-2 focus:ring-[#005EA8]"
            title={language === 'hi' ? 'गोपनीयता एवं सहमति नियंत्रण' : 'Privacy and Consent Controls'}
          >
            <ShieldCheck className="w-4 h-4 text-[#005B50]" />
            <span className="hidden md:inline">
              {language === 'hi' ? 'सहमति ऑडिट' : 'Consent Audit'}
            </span>
          </button>

          {/* Help Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#4B5563] hover:bg-[#F2EFE8] hover:text-[#0B3A53] transition-colors focus:ring-2 focus:ring-[#005EA8]"
            aria-label={language === 'hi' ? 'मदद' : 'Help'}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
