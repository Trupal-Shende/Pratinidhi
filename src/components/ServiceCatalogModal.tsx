/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types/civic';
import {
  INDIAN_STATES_AND_UTS,
  getServicesForState,
  CivicService,
} from '../services/civicCatalog';
import { getLocalizedStateName } from '../services/speechAndLocale';
import { X, ArrowRight, ExternalLink, MapPin } from 'lucide-react';

interface ServiceCatalogModalProps {
  language: Language;
  selectedState: string;
  onStateChange: (stateName: string) => void;
  onClose: () => void;
  onSelectService: (service: CivicService) => void;
}

export const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({
  language,
  selectedState,
  onStateChange,
  onClose,
  onSelectService,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const stateServices = getServicesForState(selectedState);
  const indianStates = INDIAN_STATES_AND_UTS.filter((s) => s.type === 'state');
  const indianUTs = INDIAN_STATES_AND_UTS.filter((s) => s.type === 'ut');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#D6D2C9] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6D2C9] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#0B3A53]">
              {tr(
                'Supported Civic Services (All India)',
                'समर्थित सरकारी सेवाएं (संपूर्ण भारत)',
                'समर्थित शासकीय सेवा (संपूर्ण भारत)'
              )}
            </h2>
            <p className="text-xs text-[#4B5563]">
              {tr(
                'Select any Indian State or Union Territory to view official portals and verified workflows.',
                'आधिकारिक पोर्टल और सेवाएं देखने के लिए भारत का कोई भी राज्य या केंद्र शासित प्रदेश चुनें।',
                'अधिकृत पोर्टल आणि सेवा पाहण्यासाठी भारतातील कोणतेही राज्य किंवा केंद्रशासित प्रदेश निवडा.'
              )}
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

        {/* State Selector Bar inside Catalog */}
        <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <label
            htmlFor="catalog-state-select"
            className="text-xs font-bold text-[#0B3A53] uppercase tracking-wider flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-[#005B50]" />
            <span>
              {tr(
                'Select State / Union Territory:',
                'राज्य / केंद्र शासित प्रदेश चुनें:',
                'राज्य / केंद्रशासित प्रदेश निवडा:'
              )}
            </span>
          </label>
          <select
            id="catalog-state-select"
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="bg-white border border-[#D6D2C9] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#0B3A53] focus:ring-2 focus:ring-[#005EA8]"
          >
            <optgroup label={tr('Indian States (28)', 'भारतीय राज्य (28)', 'भारतीय राज्ये (२८)')}>
              {indianStates.map((st) => (
                <option key={st.id} value={st.name}>
                  {language === 'hi'
                    ? `${st.nameHi} (${st.name})`
                    : language === 'mr'
                    ? `${st.nameMr} (${st.name})`
                    : `${st.name} (${st.nameHi})`}
                </option>
              ))}
            </optgroup>
            <optgroup label={tr('Union Territories (8)', 'केंद्र शासित प्रदेश (8)', 'केंद्रशासित प्रदेश (८)')}>
              {indianUTs.map((ut) => (
                <option key={ut.id} value={ut.name}>
                  {language === 'hi'
                    ? `${ut.nameHi} (${ut.name})`
                    : language === 'mr'
                    ? `${ut.nameMr} (${ut.name})`
                    : `${ut.name} (${ut.nameHi})`}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {stateServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-5 hover:border-[#0B3A53] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] bg-[#005B50]/10 px-2 py-0.5 rounded">
                    {getLocalizedStateName(srv.state, language)} • {srv.code}
                  </span>
                  <h3 className="text-lg font-bold text-[#0B3A53] mt-1">{srv.name[language]}</h3>
                  <p className="text-xs text-[#4B5563]">{srv.department[language]}</p>
                </div>
                <div className="text-right sm:shrink-0 text-xs text-[#4B5563]">
                  <span className="font-semibold text-[#18212B] block">
                    {srv.officialFee === 0
                      ? tr('₹0 (Free)', '₹0 (निःशुल्क)', '₹0 (मोफत)')
                      : `${tr('Fee:', 'शुल्क:', 'शुल्क:')} ₹${srv.officialFee}`}
                  </span>
                  <span>
                    {srv.estimatedDays} {tr('days SLA', 'कार्य दिवस', 'कामाचे दिवस')}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#18212B] leading-relaxed">
                {srv.description[language]}
              </p>

              {/* Required documents preview */}
              <div className="bg-[#F2EFE8] rounded-lg p-3 text-xs text-[#4B5563] space-y-1">
                <span className="font-semibold text-[#18212B] block">
                  {tr('Required Documents:', 'आवश्यक दस्तावेज़:', 'आवश्यक कागदपत्रे:')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {srv.documents
                    .filter((d) => d.category === 'required')
                    .map((d) => (
                      <span
                        key={d.id}
                        className="bg-white border border-[#D6D2C9] px-2 py-0.5 rounded text-[11px] text-[#0B3A53] font-medium"
                      >
                        ✓ {d.name[language]}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={srv.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#005EA8] hover:underline flex items-center gap-1"
                >
                  <span>{srv.portalName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => onSelectService(srv)}
                  className="px-4 py-2 rounded-lg bg-[#0B3A53] hover:bg-[#08283a] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>
                    {tr('Start with this service', 'यह सेवा चुनें', 'ही सेवा निवडा')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-[#D6D2C9] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#F2EFE8] text-[#18212B] text-sm font-semibold hover:bg-[#D6D2C9]"
          >
            {tr('Close', 'बंद करें', 'बंद करा')}
          </button>
        </div>
      </div>
    </div>
  );
};
