/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types/civic';
import { CIVIC_SERVICES, CivicService } from '../services/civicCatalog';
import { X, CheckCircle2, FileText, ArrowRight, ExternalLink } from 'lucide-react';

interface ServiceCatalogModalProps {
  language: Language;
  onClose: () => void;
  onSelectService: (service: CivicService) => void;
}

export const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({
  language,
  onClose,
  onSelectService,
}) => {
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
              {language === 'hi' ? 'समर्थित सरकारी सेवाएं (MVP दायरा)' : 'Supported Civic Services (MVP Scope)'}
            </h2>
            <p className="text-xs text-[#4B5563]">
              {language === 'hi'
                ? 'वर्तमान में उत्तर प्रदेश राजस्व एवं समाज कल्याण पोर्टल पूर्णतः समर्थित हैं।'
                : 'Current release supports verified workflows on Uttar Pradesh e-District and SSPY portals.'}
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

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {CIVIC_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-5 hover:border-[#0B3A53] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] bg-[#005B50]/10 px-2 py-0.5 rounded">
                    {srv.state} • {srv.code}
                  </span>
                  <h3 className="text-lg font-bold text-[#0B3A53] mt-1">{srv.name[language]}</h3>
                  <p className="text-xs text-[#4B5563]">{srv.department[language]}</p>
                </div>
                <div className="text-right sm:shrink-0 text-xs text-[#4B5563]">
                  <span className="font-semibold text-[#18212B] block">
                    {srv.officialFee === 0
                      ? language === 'hi'
                        ? '₹0 (निःशुल्क)'
                        : '₹0 (Free)'
                      : language === 'hi'
                      ? `शुल्क: ₹${srv.officialFee}`
                      : `Fee: ₹${srv.officialFee}`}
                  </span>
                  <span>
                    {srv.estimatedDays} {language === 'hi' ? 'कार्य दिवस' : 'days SLA'}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#18212B] leading-relaxed">
                {srv.description[language]}
              </p>

              {/* Required documents preview */}
              <div className="bg-[#F2EFE8] rounded-lg p-3 text-xs text-[#4B5563] space-y-1">
                <span className="font-semibold text-[#18212B] block">
                  {language === 'hi' ? 'आवश्यक दस्तावेज़:' : 'Required Documents:'}
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
                  <span>{language === 'hi' ? 'यह सेवा चुनें' : 'Start with this service'}</span>
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
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
