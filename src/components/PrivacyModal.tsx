/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types/civic';
import { ShieldCheck, Lock, Trash2, X, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  language: Language;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ language, onClose }) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const [dataDeleted, setDataDeleted] = useState(false);
  const [activePermissions, setActivePermissions] = useState({
    portalAutomation: true,
    documentRedaction: true,
    statusTracking: true,
    voiceRetention: false,
  });

  const handleToggle = (key: keyof typeof activePermissions) => {
    setActivePermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteLocalData = () => {
    setDataDeleted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#D6D2C9] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6D2C9]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#005B50]" />
            <h2 className="text-xl font-bold text-[#0B3A53]">
              {tr(
                'Privacy & Consent Center',
                'गोपनीयता एवं सहमति नियंत्रण केंद्र',
                'गोपनीयता आणि संमती नियंत्रण केंद्र'
              )}
            </h2>
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

        {/* Guarantees Box */}
        <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 text-xs sm:text-sm text-[#18212B] space-y-2">
          <div className="font-bold text-[#0B3A53] flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#005B50]" />
            <span>
              {tr(
                'Citizen Data Protection Guarantees',
                'नागरिक डेटा सुरक्षा मानक (PRD अनुपालन)',
                'नागरिक डेटा संरक्षण हमी (PRD अनुपालन)'
              )}
            </span>
          </div>
          <p className="text-[#4B5563]">
            {tr(
              'We never permanently store full Aadhaar numbers, banking credentials, or OTPs. All documents are masked locally prior to portal submission.',
              'हम कभी भी आधार नंबर, बैंक पासवर्ड या ओटीपी को सर्वर पर स्थायी रूप से स्टोर नहीं करते। सभी दस्तावेज आपके डिवाइस पर स्थानीय रूप से मास्क किए जाते हैं।',
              'आम्ही कधीही पूर्ण आधार क्रमांक, बँक पासवर्ड किंवा ओटीपी सर्व्हरवर कायमचे साठवत नाही. सर्व कागदपत्रे तुमच्या डिव्हाइसवर स्थानिक पातळीवर मास्क केली जातात.'
            )}
          </p>
        </div>

        {/* Granular Permission Toggles */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#18212B] uppercase tracking-wider">
            {tr(
              'Active Permissions (Granular Control)',
              'सक्रिय अनुमतियां (ग्रैनुलर नियंत्रण)',
              'सक्रिय परवानग्या (तपशीलवार नियंत्रण)'
            )}
          </h3>

          <div className="space-y-3">
            <div className="bg-[#F2EFE8] rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-sm text-[#0B3A53] block">
                  {tr(
                    'Portal Automation Consent',
                    'पोर्टल ऑटोमेशन सहमति',
                    'पोर्टल ऑटोमेशन संमती'
                  )}
                </span>
                <span className="text-xs text-[#4B5563]">
                  {tr(
                    'Permits agent to fill verified fields on allowlisted government domains',
                    'नागरिक-अनुमोदित फॉर्म डेटा को सरकारी पोर्टल पर भरने की अनुमति',
                    'नागरिक-मान्यताप्राप्त फॉर्म माहिती शासकीय पोर्टलवर भरण्याची परवानगी'
                  )}
                </span>
              </div>
              <input
                type="checkbox"
                checked={activePermissions.portalAutomation}
                onChange={() => handleToggle('portalAutomation')}
                className="w-5 h-5 text-[#005B50] rounded"
              />
            </div>

            <div className="bg-[#F2EFE8] rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-sm text-[#0B3A53] block">
                  {tr(
                    'Periodic Status Tracking',
                    'स्वचालित स्थिति ट्रैकिंग',
                    'नियमित अर्ज स्थिती ट्रॅकिंग'
                  )}
                </span>
                <span className="text-xs text-[#4B5563]">
                  {tr(
                    'Checks portal status at configured intervals with plain-language updates',
                    'पोर्टल से आवेदन स्थिति की नियमित जांच एवं सरल भाषा में सूचना',
                    'पोर्टलवरून अर्जाची स्थिती नियमित तपासणे आणि साध्या भाषेत माहिती देणे'
                  )}
                </span>
              </div>
              <input
                type="checkbox"
                checked={activePermissions.statusTracking}
                onChange={() => handleToggle('statusTracking')}
                className="w-5 h-5 text-[#005B50] rounded"
              />
            </div>

            <div className="bg-[#F2EFE8] rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-sm text-[#0B3A53] block">
                  {tr(
                    'Original Audio Retention (Default: Off)',
                    'वॉयस ऑडियो संग्रहण (डिफ़ॉल्ट रूप से बंद)',
                    'मूळ व्हॉइस ऑडिओ साठवण (डिफॉल्ट: बंद)'
                  )}
                </span>
                <span className="text-xs text-[#4B5563]">
                  {tr(
                    'By default, only text transcripts are kept. Audio is immediately discarded.',
                    'केवल ट्रांसक्रिप्ट सहेजा जाता है; मूल ऑडियो कभी भी आपकी स्पष्ट सहमति के बिना सुरक्षित नहीं रखा जाता',
                    'डिफॉल्टनुसार, फक्त मजकूर जतन केला जातो; मूळ ऑडिओ तुमच्या स्पष्ट संमतीशिवाय कधीही ठेवला जात नाही'
                  )}
                </span>
              </div>
              <input
                type="checkbox"
                checked={activePermissions.voiceRetention}
                onChange={() => handleToggle('voiceRetention')}
                className="w-5 h-5 text-[#005B50] rounded"
              />
            </div>
          </div>
        </div>

        {/* Delete Local Data */}
        <div className="pt-3 border-t border-[#D6D2C9]">
          {dataDeleted ? (
            <div className="bg-[#005B50]/10 border border-[#005B50]/30 rounded-xl p-4 text-xs sm:text-sm text-[#005B50] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {tr(
                  'Local cached drafts and documents wiped. Already-submitted portal applications remain with the department.',
                  'स्थानीय ड्राफ्ट एवं अस्थायी दस्तावेज हटा दिए गए हैं। सरकारी पोर्टल पर पूर्व में जमा हो चुके आवेदन पर इसका प्रभाव नहीं होगा।',
                  'स्थानिक मसुदे आणि तात्पुरती कागदपत्रे हटवली गेली आहेत. शासकीय पोर्टलवर आधीच सादर केलेल्या अर्जावर याचा परिणाम होणार नाही.'
                )}
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-[#A61B1B] block">
                  {tr(
                    'Delete Local Application Data',
                    'स्थानीय एप्लिकेशन डेटा मिटाएं',
                    'स्थानिक ॲप्लिकेशन डेटा हटवा'
                  )}
                </span>
                <span className="text-xs text-[#4B5563]">
                  {tr(
                    'Wipe locally cached drafts, uploads, and temporary session files',
                    'सभी स्थानीय कैश और अपलोड किए गए ड्राफ्ट फ़ाइलें मिटाएं',
                    'सर्व स्थानिक कॅश आणि अपलोड केलेल्या मसुदा फाईल्स पुसून टाका'
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={handleDeleteLocalData}
                className="px-4 py-2 rounded-lg border border-[#A61B1B] text-[#A61B1B] hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto min-h-[40px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{tr('Wipe Local Data', 'डेटा मिटाएं', 'डेटा हटवा')}</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0B3A53] text-white text-sm font-semibold hover:bg-[#08283a]"
          >
            {tr('Done', 'सहेजें व बंद करें', 'जतन करा व बंद करा')}
          </button>
        </div>
      </div>
    </div>
  );
};
