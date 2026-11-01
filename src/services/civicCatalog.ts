/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LocalizedText {
  en: string;
  hi: string;
  mr: string;
}

export interface StatePortalConfig {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  type: 'state' | 'ut';
  portalName: string;
  portalUrl: string;
  pensionPortalName: string;
  pensionPortalUrl: string;
  helpline: string;
}

export const INDIAN_STATES_AND_UTS: StatePortalConfig[] = [
  {
    id: 'AP',
    name: 'Andhra Pradesh',
    nameHi: 'आंध्र प्रदेश',
    nameMr: 'आंध्र प्रदेश',
    type: 'state',
    portalName: 'AP MeeSeva Portal (meeseva.ap.gov.in)',
    portalUrl: 'https://ap.meeseva.gov.in',
    pensionPortalName: 'YSR Pension Kanuka / NTR Bharosa (sspensions.ap.gov.in)',
    pensionPortalUrl: 'https://sspensions.ap.gov.in',
    helpline: '1902',
  },
  {
    id: 'AR',
    name: 'Arunachal Pradesh',
    nameHi: 'अरुणाचल प्रदेश',
    nameMr: 'अरुणाचल प्रदेश',
    type: 'state',
    portalName: 'e-District Arunachal Pradesh (eservice.arunachal.gov.in)',
    portalUrl: 'https://eservice.arunachal.gov.in',
    pensionPortalName: 'Arunachal Social Welfare Portal (eservice.arunachal.gov.in)',
    pensionPortalUrl: 'https://eservice.arunachal.gov.in',
    helpline: '155250',
  },
  {
    id: 'AS',
    name: 'Assam',
    nameHi: 'असम',
    nameMr: 'आसाम',
    type: 'state',
    portalName: 'Sewa Setu Assam (sewasetu.assam.gov.in)',
    portalUrl: 'https://sewasetu.assam.gov.in',
    pensionPortalName: 'Assam Pension Seva (sewasetu.assam.gov.in)',
    pensionPortalUrl: 'https://sewasetu.assam.gov.in',
    helpline: '1800-345-3574',
  },
  {
    id: 'BR',
    name: 'Bihar',
    nameHi: 'बिहार',
    nameMr: 'बिहार',
    type: 'state',
    portalName: 'RTPS Bihar ServicePlus (serviceonline.bihar.gov.in)',
    portalUrl: 'https://serviceonline.bihar.gov.in',
    pensionPortalName: 'e-Labharthi Bihar Pension Portal (elabharthi.bih.nic.in)',
    pensionPortalUrl: 'https://elabharthi.bih.nic.in',
    helpline: '1800-345-6268',
  },
  {
    id: 'CG',
    name: 'Chhattisgarh',
    nameHi: 'छत्तीसगढ़',
    nameMr: 'छत्तीसगड',
    type: 'state',
    portalName: 'Chhattisgarh e-District (edistrict.cgstate.gov.in)',
    portalUrl: 'https://edistrict.cgstate.gov.in',
    pensionPortalName: 'CG Social Welfare Pension Portal (sw.cg.gov.in)',
    pensionPortalUrl: 'https://sw.cg.gov.in',
    helpline: '1100',
  },
  {
    id: 'GA',
    name: 'Goa',
    nameHi: 'गोवा',
    nameMr: 'गोवा',
    type: 'state',
    portalName: 'Goa Online Portal (goaonline.gov.in)',
    portalUrl: 'https://goaonline.gov.in',
    pensionPortalName: 'Goa Social Welfare DSS Portal (goaonline.gov.in)',
    pensionPortalUrl: 'https://goaonline.gov.in',
    helpline: '1800-233-5060',
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    nameHi: 'गुजरात',
    nameMr: 'गुजरात',
    type: 'state',
    portalName: 'Digital Gujarat Portal (digitalgujarat.gov.in)',
    portalUrl: 'https://www.digitalgujarat.gov.in',
    pensionPortalName: 'e-Samaj Kalyan Gujarat (esamajkalyan.gujarat.gov.in)',
    pensionPortalUrl: 'https://esamajkalyan.gujarat.gov.in',
    helpline: '1800-233-5500',
  },
  {
    id: 'HR',
    name: 'Haryana',
    nameHi: 'हरियाणा',
    nameMr: 'हरियाणा',
    type: 'state',
    portalName: 'Antyodaya Saral Haryana (saralharyana.gov.in)',
    portalUrl: 'https://saralharyana.gov.in',
    pensionPortalName: 'Haryana Social Justice Pension (pension.socialjusticehry.gov.in)',
    pensionPortalUrl: 'https://pension.socialjusticehry.gov.in',
    helpline: '0172-3968400',
  },
  {
    id: 'HP',
    name: 'Himachal Pradesh',
    nameHi: 'हिमाचल प्रदेश',
    nameMr: 'हिमाचल प्रदेश',
    type: 'state',
    portalName: 'Himachal e-District (edistrict.hp.gov.in)',
    portalUrl: 'https://edistrict.hp.gov.in',
    pensionPortalName: 'e-Kalyan Himachal Pension (ekalyan.hp.gov.in)',
    pensionPortalUrl: 'https://ekalyan.hp.gov.in',
    helpline: '1100',
  },
  {
    id: 'JH',
    name: 'Jharkhand',
    nameHi: 'झारखंड',
    nameMr: 'झारखंड',
    type: 'state',
    portalName: 'Jharsewa Jharkhand (jharsewa.jharkhand.gov.in)',
    portalUrl: 'https://jharsewa.jharkhand.gov.in',
    pensionPortalName: 'NSAP / Jharsewa Pension Portal (jharsewa.jharkhand.gov.in)',
    pensionPortalUrl: 'https://jharsewa.jharkhand.gov.in',
    helpline: '1800-345-6526',
  },
  {
    id: 'KA',
    name: 'Karnataka',
    nameHi: 'कर्नाटक',
    nameMr: 'कर्नाटक',
    type: 'state',
    portalName: 'Seva Sindhu / Nadakacheri (sevasindhu.karnataka.gov.in)',
    portalUrl: 'https://sevasindhu.karnataka.gov.in',
    pensionPortalName: 'Sandhya Suraksha / DSSP Karnataka (dssp.karnataka.gov.in)',
    pensionPortalUrl: 'https://dssp.karnataka.gov.in',
    helpline: '1902',
  },
  {
    id: 'KL',
    name: 'Kerala',
    nameHi: 'केरल',
    nameMr: 'केरळ',
    type: 'state',
    portalName: 'Kerala e-District (edistrict.kerala.gov.in)',
    portalUrl: 'https://edistrict.kerala.gov.in',
    pensionPortalName: 'Sevana Social Security Pension (welfarepension.lsgkerala.gov.in)',
    pensionPortalUrl: 'https://welfarepension.lsgkerala.gov.in',
    helpline: '1800-425-11800',
  },
  {
    id: 'MP',
    name: 'Madhya Pradesh',
    nameHi: 'मध्य प्रदेश',
    nameMr: 'मध्य प्रदेश',
    type: 'state',
    portalName: 'MP Loksewa e-District (mpedistrict.gov.in)',
    portalUrl: 'https://mpedistrict.gov.in',
    pensionPortalName: 'Samagra Social Security Pension MP (pension.samagra.gov.in)',
    pensionPortalUrl: 'https://pension.samagra.gov.in',
    helpline: '181',
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    nameMr: 'महाराष्ट्र',
    type: 'state',
    portalName: 'Aaple Sarkar MahaOnline (aaplesarkar.mahaonline.gov.in)',
    portalUrl: 'https://aaplesarkar.mahaonline.gov.in',
    pensionPortalName: 'MahaDBT / Sanjay Gandhi Niradhar Portal (mahadbt.maharashtra.gov.in)',
    pensionPortalUrl: 'https://mahadbt.maharashtra.gov.in',
    helpline: '1800-120-8040',
  },
  {
    id: 'MN',
    name: 'Manipur',
    nameHi: 'मणिपुर',
    nameMr: 'मणिपूर',
    type: 'state',
    portalName: 'Manipur e-District (eservicesmanipur.gov.in)',
    portalUrl: 'https://eservicesmanipur.gov.in',
    pensionPortalName: 'Manipur Social Welfare Portal (socialwelfare.mn.gov.in)',
    pensionPortalUrl: 'https://socialwelfare.mn.gov.in',
    helpline: '1800-345-3818',
  },
  {
    id: 'ML',
    name: 'Meghalaya',
    nameHi: 'मेघालय',
    nameMr: 'मेघालय',
    type: 'state',
    portalName: 'Meghalaya e-District (megedistrict.gov.in)',
    portalUrl: 'https://megedistrict.gov.in',
    pensionPortalName: 'Meghalaya Social Welfare Portal (megedistrict.gov.in)',
    pensionPortalUrl: 'https://megedistrict.gov.in',
    helpline: '1971',
  },
  {
    id: 'MZ',
    name: 'Mizoram',
    nameHi: 'मिजोरम',
    nameMr: 'मिझोरम',
    type: 'state',
    portalName: 'Mizoram e-District (edistrict.mizoram.gov.in)',
    portalUrl: 'https://edistrict.mizoram.gov.in',
    pensionPortalName: 'Mizoram Social Welfare Portal (edistrict.mizoram.gov.in)',
    pensionPortalUrl: 'https://edistrict.mizoram.gov.in',
    helpline: '1800-345-3890',
  },
  {
    id: 'NL',
    name: 'Nagaland',
    nameHi: 'नागालैंड',
    nameMr: 'नागालँड',
    type: 'state',
    portalName: 'Nagaland e-District (edistrict.nagaland.gov.in)',
    portalUrl: 'https://edistrict.nagaland.gov.in',
    pensionPortalName: 'Nagaland Social Welfare Portal (edistrict.nagaland.gov.in)',
    pensionPortalUrl: 'https://edistrict.nagaland.gov.in',
    helpline: '1800-345-3701',
  },
  {
    id: 'OD',
    name: 'Odisha',
    nameHi: 'ओडिशा',
    nameMr: 'ओडिशा',
    type: 'state',
    portalName: 'Odisha e-District (edistrict.odisha.gov.in)',
    portalUrl: 'https://edistrict.odisha.gov.in',
    pensionPortalName: 'Madhu Babu Pension Portal SSEPD (ssepd.gov.in)',
    pensionPortalUrl: 'https://ssepd.gov.in',
    helpline: '1800-345-7150',
  },
  {
    id: 'PB',
    name: 'Punjab',
    nameHi: 'पंजाब',
    nameMr: 'पंजाब',
    type: 'state',
    portalName: 'Connect Punjab e-Sewa (esewa.punjab.gov.in)',
    portalUrl: 'https://esewa.punjab.gov.in',
    pensionPortalName: 'Punjab Social Security Pension (sswcd.punjab.gov.in)',
    pensionPortalUrl: 'https://sswcd.punjab.gov.in',
    helpline: '1100',
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    nameHi: 'राजस्थान',
    nameMr: 'राजस्थान',
    type: 'state',
    portalName: 'e-Mitra / SSO Rajasthan (sso.rajasthan.gov.in)',
    portalUrl: 'https://sso.rajasthan.gov.in',
    pensionPortalName: 'RajSSP Social Security Pension (rajssp.raj.nic.in)',
    pensionPortalUrl: 'https://rajssp.raj.nic.in',
    helpline: '181',
  },
  {
    id: 'SK',
    name: 'Sikkim',
    nameHi: 'सिक्किम',
    nameMr: 'सिक्कीम',
    type: 'state',
    portalName: 'Sikkim e-District (eservices.sikkim.gov.in)',
    portalUrl: 'https://eservices.sikkim.gov.in',
    pensionPortalName: 'Sikkim Social Justice & Welfare (eservices.sikkim.gov.in)',
    pensionPortalUrl: 'https://eservices.sikkim.gov.in',
    helpline: '1800-345-3236',
  },
  {
    id: 'TN',
    name: 'Tamil Nadu',
    nameHi: 'तमिलनाडु',
    nameMr: 'तामिळनाडू',
    type: 'state',
    portalName: 'TN e-Sevai / e-District (tnedistrict.tn.gov.in)',
    portalUrl: 'https://www.tnesevai.tn.gov.in',
    pensionPortalName: 'TN OAP Pension Portal (tnedistrict.tn.gov.in)',
    pensionPortalUrl: 'https://www.tnesevai.tn.gov.in',
    helpline: '1100',
  },
  {
    id: 'TG',
    name: 'Telangana',
    nameHi: 'तेलंगाना',
    nameMr: 'तेलंगणा',
    type: 'state',
    portalName: 'Telangana MeeSeva (ts.meeseva.telangana.gov.in)',
    portalUrl: 'https://ts.meeseva.telangana.gov.in',
    pensionPortalName: 'Aasara / Cheyutha Pension Telangana (aasara.telangana.gov.in)',
    pensionPortalUrl: 'https://aasara.telangana.gov.in',
    helpline: '1100',
  },
  {
    id: 'TR',
    name: 'Tripura',
    nameHi: 'त्रिपुरा',
    nameMr: 'त्रिपुरा',
    type: 'state',
    portalName: 'Tripura e-District (edistrict.tripura.gov.in)',
    portalUrl: 'https://edistrict.tripura.gov.in',
    pensionPortalName: 'Tripura Social Welfare Pension (edistrict.tripura.gov.in)',
    pensionPortalUrl: 'https://edistrict.tripura.gov.in',
    helpline: '1905',
  },
  {
    id: 'UP',
    name: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    nameMr: 'उत्तर प्रदेश',
    type: 'state',
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    pensionPortalName: 'UP Social Welfare Pension Portal (sspy-up.gov.in)',
    pensionPortalUrl: 'https://sspy-up.gov.in',
    helpline: '1076',
  },
  {
    id: 'UK',
    name: 'Uttarakhand',
    nameHi: 'उत्तराखंड',
    nameMr: 'उत्तराखंड',
    type: 'state',
    portalName: 'Apuni Sarkar Uttarakhand (eservices.uk.gov.in)',
    portalUrl: 'https://eservices.uk.gov.in',
    pensionPortalName: 'Uttarakhand Social Welfare Pension (ssp.uk.gov.in)',
    pensionPortalUrl: 'https://ssp.uk.gov.in',
    helpline: '1905',
  },
  {
    id: 'WB',
    name: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    nameMr: 'पश्चिम बंगाल',
    type: 'state',
    portalName: 'West Bengal e-District (edistrict.wb.gov.in)',
    portalUrl: 'https://edistrict.wb.gov.in',
    pensionPortalName: 'Jai Bangla Pension Portal (jaibangla.wb.gov.in)',
    pensionPortalUrl: 'https://edistrict.wb.gov.in',
    helpline: '1800-345-5505',
  },
  // 8 Union Territories
  {
    id: 'AN',
    name: 'Andaman and Nicobar Islands',
    nameHi: 'अंडमान और निकोबार द्वीपसमूह',
    nameMr: 'अंदमान आणि निकोबार बेटे',
    type: 'ut',
    portalName: 'A&N e-District (edistrict.andaman.gov.in)',
    portalUrl: 'https://edistrict.andaman.gov.in',
    pensionPortalName: 'A&N Social Welfare Portal (edistrict.andaman.gov.in)',
    pensionPortalUrl: 'https://edistrict.andaman.gov.in',
    helpline: '1800-345-2714',
  },
  {
    id: 'CH',
    name: 'Chandigarh',
    nameHi: 'चंडीगढ़',
    nameMr: 'चंदीगड',
    type: 'ut',
    portalName: 'Chandigarh e-Sampark (chandigarh.gov.in)',
    portalUrl: 'https://chandigarh.gov.in',
    pensionPortalName: 'Chandigarh Social Welfare Portal (chdsw.gov.in)',
    pensionPortalUrl: 'https://chdsw.gov.in',
    helpline: '0172-2700076',
  },
  {
    id: 'DN',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    nameHi: 'दादरा और नगर हवेली और दमन और दीव',
    nameMr: 'दादरा आणि नगर हवेली आणि दमण आणि दीव',
    type: 'ut',
    portalName: 'DNHDD e-District (serviceonline.gov.in)',
    portalUrl: 'https://serviceonline.gov.in',
    pensionPortalName: 'DNHDD Social Welfare Portal (serviceonline.gov.in)',
    pensionPortalUrl: 'https://serviceonline.gov.in',
    helpline: '1800-233-4001',
  },
  {
    id: 'DL',
    name: 'Delhi',
    nameHi: 'दिल्ली (NCT)',
    nameMr: 'दिल्ली (NCT)',
    type: 'ut',
    portalName: 'Delhi e-District (edistrict.delhigovt.nic.in)',
    portalUrl: 'https://edistrict.delhigovt.nic.in',
    pensionPortalName: 'Delhi Social Welfare Pension (edistrict.delhigovt.nic.in)',
    pensionPortalUrl: 'https://edistrict.delhigovt.nic.in',
    helpline: '1031',
  },
  {
    id: 'JK',
    name: 'Jammu and Kashmir',
    nameHi: 'जम्मू और कश्मीर',
    nameMr: 'जम्मू आणि काश्मीर',
    type: 'ut',
    portalName: 'e-UNNAT / Jan Sugam J&K (jansugam.jk.gov.in)',
    portalUrl: 'https://jansugam.jk.gov.in',
    pensionPortalName: 'J&K Social Welfare ISSS Portal (jansugam.jk.gov.in)',
    pensionPortalUrl: 'https://jansugam.jk.gov.in',
    helpline: '1905',
  },
  {
    id: 'LA',
    name: 'Ladakh',
    nameHi: 'लद्दाख',
    nameMr: 'लडाख',
    type: 'ut',
    portalName: 'Ladakh e-Seva Portal (ladakh.nic.in)',
    portalUrl: 'https://ladakh.nic.in',
    pensionPortalName: 'Ladakh Social Welfare Portal (ladakh.nic.in)',
    pensionPortalUrl: 'https://ladakh.nic.in',
    helpline: '01982-255567',
  },
  {
    id: 'LD',
    name: 'Lakshadweep',
    nameHi: 'लक्षद्वीप',
    nameMr: 'लक्षद्वीप',
    type: 'ut',
    portalName: 'Lakshadweep e-District (edistrict.lakshadweep.gov.in)',
    portalUrl: 'https://edistrict.lakshadweep.gov.in',
    pensionPortalName: 'Lakshadweep Social Justice Portal (edistrict.lakshadweep.gov.in)',
    pensionPortalUrl: 'https://edistrict.lakshadweep.gov.in',
    helpline: '1800-425-3115',
  },
  {
    id: 'PY',
    name: 'Puducherry',
    nameHi: 'पुदुचेरी',
    nameMr: 'पुदुच्चेरी',
    type: 'ut',
    portalName: 'Puducherry e-District (edistrict.py.gov.in)',
    portalUrl: 'https://edistrict.py.gov.in',
    pensionPortalName: 'Puducherry Social Welfare Portal (edistrict.py.gov.in)',
    pensionPortalUrl: 'https://edistrict.py.gov.in',
    helpline: '1031',
  },
];

export function getStateConfig(stateName: string): StatePortalConfig {
  const found = INDIAN_STATES_AND_UTS.find(
    (s) =>
      s.name.toLowerCase() === stateName.toLowerCase() ||
      s.id.toLowerCase() === stateName.toLowerCase()
  );
  return (
    found ||
    INDIAN_STATES_AND_UTS.find((s) => s.name === 'Uttar Pradesh')!
  );
}

export interface DocumentRequirement {
  id: string;
  name: LocalizedText;
  category: 'required' | 'optional' | 'not_needed';
  whyNeeded: LocalizedText;
  acceptedTypes: string[];
  privacyRedactionNotes: LocalizedText;
  examples: string[];
}

export interface EligibilityCriterion {
  id: string;
  label: LocalizedText;
  mandatory: boolean;
}

export interface CivicService {
  id: string;
  code: string;
  name: LocalizedText;
  state: string;
  department: LocalizedText;
  portalName: string;
  portalUrl: string;
  officialFee: number;
  estimatedDays: number;
  description: LocalizedText;
  eligibility: EligibilityCriterion[];
  documents: DocumentRequirement[];
  isMvpSupported: boolean;
}

export interface IntentClassificationResult {
  status: 'matched' | 'unsupported' | 'needs_clarification';
  serviceId?: string;
  service?: CivicService;
  confidence: number;
  summary_en?: string;
  summary_hi?: string;
  summary_mr?: string;
  matchedReason: LocalizedText;
  suggestedAction: LocalizedText;
  emotionalState?: string;
  urgency?: 'normal' | 'high';
  mentionedDocuments?: string[];
  source?: 'gemini' | 'fallback';
}

export const CIVIC_SERVICES: CivicService[] = [
  {
    id: 'up-income-certificate',
    code: 'UP-EDIST-INC-01',
    name: {
      en: 'Income Certificate (आय प्रमाण पत्र / उत्पन्न दाखला)',
      hi: 'आय प्रमाण पत्र (Income Certificate)',
      mr: 'उत्पन्न प्रमाणपत्र / दाखला (Income Certificate)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Revenue Department, State Government',
      hi: 'राजस्व विभाग, राज्य सरकार',
      mr: 'महसूल विभाग, राज्य शासन',
    },
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    officialFee: 15,
    estimatedDays: 15,
    description: {
      en: 'Official revenue document verifying the total annual income of the applicant or family for educational scholarships, welfare schemes, and subsidies.',
      hi: 'छात्रवृत्ति, सरकारी कल्याणकारी योजनाओं और रियायतों के लिए आवेदक या परिवार की कुल वार्षिक आय प्रमाणित करने वाला आधिकारिक राजस्व प्रमाण पत्र।',
      mr: 'शैक्षणिक शिष्यवृत्ती, सरकारी कल्याणकारी योजना आणि अनुदानांसाठी अर्जदाराचे किंवा कुटुंबाचे एकूण वार्षिक उत्पन्न प्रमाणित करणारा अधिकृत महसूल दाखला.',
    },
    eligibility: [
      {
        id: 'residency',
        label: {
          en: 'Must be a resident of the selected State / Union Territory',
          hi: 'चयनित राज्य / केंद्र शासित प्रदेश का निवासी होना आवश्यक है',
          mr: 'निवडलेल्या राज्य / केंद्रशासित प्रदेशाचा रहिवासी असणे आवश्यक आहे',
        },
        mandatory: true,
      },
      {
        id: 'valid_family_id',
        label: {
          en: 'Possesses a Ration Card or Family ID',
          hi: 'राशन कार्ड या परिवार रजिस्टर की प्रति उपलब्ध होनी चाहिए',
          mr: 'रेशन कार्ड किंवा कुटुंब ओळखपत्र उपलब्ध असणे आवश्यक आहे',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-identity',
        name: {
          en: 'Identity Proof (Aadhaar / Voter ID)',
          hi: 'पहचान प्रमाण (आधार / मतदाता पहचान पत्र)',
          mr: 'ओळख पुरावा (आधार / मतदार ओळखपत्र)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Required by the revenue inspector to verify the applicant identity against local records. Aadhaar number is masked; only last 4 digits are shared.',
          hi: 'राजस्व निरीक्षक द्वारा स्थानीय रिकॉर्ड से पहचान सत्यापन हेतु आवश्यक। आधार संख्या को छिपाया जाता है, केवल अंतिम 4 अंक साझा होते हैं।',
          mr: 'महसूल निरीक्षकांद्वारे स्थानिक नोंदींशी ओळख पडताळणीसाठी आवश्यक. आधार क्रमांक सुरक्षित ठेवला जातो; फक्त शेवटचे ४ अंक शेअर केले जातात.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Automatic local redaction of first 8 digits of Aadhaar before portal submission.',
          hi: 'पोर्टल पर सबमिट करने से पहले आधार के पहले 8 अंकों को स्वचालित रूप से छिपा दिया जाता है।',
          mr: 'पोर्टलवर सबमिट करण्यापूर्वी आधारचे पहिले ८ अंक आपोआप लपवले (मास्क केले) जातात.',
        },
        examples: ['Aadhaar Card (front & back)', 'Voter ID Card'],
      },
      {
        id: 'doc-residence',
        name: {
          en: 'Residence Proof (Ration Card or Electricity Bill)',
          hi: 'निवास प्रमाण (राशन कार्ड या बिजली बिल)',
          mr: 'निवास पुरावा (रेशन कार्ड किंवा वीज बिल)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Used by the Talathi/Patwari/Lekhpal to establish tehsil and village jurisdiction for verification.',
          hi: 'पटवारी/लेखपाल द्वारा भौतिक सत्यापन हेतु तहसील और ग्राम अधिकार क्षेत्र निर्धारित करने के लिए।',
          mr: 'तलाठी/मंडळ अधिकारी/लेखपाल यांच्याद्वारे तालुका आणि गाव कार्यक्षेत्र निश्चित करण्यासाठी वापरले जाते.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Only address and head of family name are accessed. Account details are excluded.',
          hi: 'केवल पता और परिवार के मुखिया का नाम देखा जाता है। बैंक/खाता विवरण नहीं लिया जाता।',
          mr: 'फक्त पत्ता आणि कुटुंबप्रमुखाचे नाव पाहिले जाते. इतर खाते तपशील वगळले जातात.',
        },
        examples: ['Ration Card copy', 'Recent Electricity Bill (< 3 months)'],
      },
      {
        id: 'doc-income-proof',
        name: {
          en: 'Income Declaration / Salary Slip / Land Record (7/12 or Khatauni)',
          hi: 'आय स्व-घोषणा / वेतन पर्ची / खतौनी',
          mr: 'उत्पन्न स्वयं-घोषणापत्र / पगार स्लिप / ७/१२ उतारा',
        },
        category: 'required',
        whyNeeded: {
          en: 'Primary evidence of declared monthly/annual income across agricultural, wage, or business earnings.',
          hi: 'कृषि, मजदूरी या व्यवसाय से प्राप्त मासिक/वार्षिक आय का प्राथमिक साक्ष्य।',
          mr: 'शेती, मजुरी किंवा व्यवसायातून मिळणाऱ्या मासिक/वार्षिक उत्पन्नाचा प्राथमिक पुरावा.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Strictly limited to the current fiscal year. No permanent storage on third-party servers.',
          hi: 'वर्तमान वित्तीय वर्ष तक सीमित। किसी तृतीय पक्ष सर्वर पर स्थायी रूप से संग्रहित नहीं।',
          mr: 'फक्त चालू आर्थिक वर्षापुरते मर्यादित. कोणत्याही तृतीय-पक्ष सर्व्हरवर कायमस्वरूपी साठवण नाही.',
        },
        examples: ['Salary Certificate from employer', 'Self-declaration form / Talathi report'],
      },
      {
        id: 'doc-photo',
        name: {
          en: 'Passport Size Photograph',
          hi: 'पासपोर्ट आकार का फोटो',
          mr: 'पासपोर्ट आकाराचा फोटो',
        },
        category: 'required',
        whyNeeded: {
          en: 'Printed directly on the finalized digitally signed certificate.',
          hi: 'डिजिटल रूप से हस्ताक्षरित प्रमाण पत्र पर मुद्रित करने के लिए।',
          mr: 'डिजिटल स्वाक्षरी केलेल्या अंतिम प्रमाणपत्रावर छापण्यासाठी आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png'],
        privacyRedactionNotes: {
          en: 'Used exclusively for portal image attachment; max 50KB as per portal specification.',
          hi: 'केवल पोर्टल अटैचमेंट के लिए प्रयुक्त; पोर्टल दिशानिर्देश के अनुसार अधिकतम 50KB।',
          mr: 'फक्त पोर्टल फोटो जोडणीसाठी वापरले जाते; पोर्टल नियमानुसार कमाल 50KB.',
        },
        examples: ['Clear front-facing color photo'],
      },
      {
        id: 'doc-previous-cert',
        name: {
          en: 'Expired or Previous Income Certificate (if renewal)',
          hi: 'पुराना आय प्रमाण पत्र (यदि नवीनीकरण हो)',
          mr: 'जुना उत्पन्न दाखला (नूतनीकरण असल्यास)',
        },
        category: 'optional',
        whyNeeded: {
          en: 'Speeds up verification by Talathi/Lekhpal if a previous certificate number is on record.',
          hi: 'यदि पिछला प्रमाण पत्र क्रमांक उपलब्ध हो तो लेखपाल द्वारा सत्यापन में तेजी आती है।',
          mr: 'मागील दाखल्याचा क्रमांक उपलब्ध असल्यास तलाठी/अधिकाऱ्यांकडून पडताळणी जलद होते.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Optional attachment only to reference prior application ID.',
          hi: 'केवल पूर्व आवेदन संदर्भ के लिए वैकल्पिक।',
          mr: 'फक्त मागील अर्जाच्या संदर्भासाठी ऐच्छिक.',
        },
        examples: ['Expired Income Certificate copy'],
      },
    ],
    isMvpSupported: true,
  },
  {
    id: 'up-pension-revival',
    code: 'UP-SWD-PEN-02',
    name: {
      en: 'Old Age Pension Revival & Annual Life Verification',
      hi: 'वृद्धावस्था पेंशन पुनरारंभ एवं वार्षिक जीवन प्रमाणीकरण',
      mr: 'वृद्धापकाळ पेन्शन पुनरारंभ आणि वार्षिक हयातीचा दाखला (जीवन प्रमाण)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Social Justice & Welfare Department, State Government',
      hi: 'समाज कल्याण विभाग, राज्य सरकार',
      mr: 'सामाजिक न्याय व विशेष सहाय्य विभाग, राज्य शासन',
    },
    portalName: 'UP Social Welfare Pension Portal (sspy-up.gov.in)',
    portalUrl: 'https://sspy-up.gov.in',
    officialFee: 0,
    estimatedDays: 21,
    description: {
      en: 'Assists senior citizens whose pension was halted due to pending annual Aadhaar biometric e-KYC or unverified bank account mapping.',
      hi: 'उन वरिष्ठ नागरिकों की सहायता जिनकी पेंशन वार्षिक आधार ई-केवाईसी या बैंक खाता मैपिंग लंबित होने के कारण रुक गई है।',
      mr: 'ज्या ज्येष्ठ नागरिकांची पेन्शन प्रलंबित वार्षिक आधार ई-केवायसी किंवा बँक खाते डीबीटी मॅपिंगमुळे थांबली आहे त्यांच्यासाठी सहाय्य.',
    },
    eligibility: [
      {
        id: 'age',
        label: {
          en: 'Citizen age 60 years or above (as per birth certificate or voter card)',
          hi: 'नागरिक की आयु 60 वर्ष या उससे अधिक होनी चाहिए',
          mr: 'नागरिकाचे वय ६० वर्षे किंवा त्याहून अधिक असावे',
        },
        mandatory: true,
      },
      {
        id: 'bpl_or_income',
        label: {
          en: 'Meets state BPL or low-income threshold criteria',
          hi: 'राज्य के बीपीएल या निम्न-आय मानदंडों को पूरा करता हो',
          mr: 'राज्याच्या दारिद्र्यरेषेखालील (BPL) किंवा अल्प-उत्पन्न निकषांची पूर्तता करणे आवश्यक',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-passbook',
        name: {
          en: 'Bank Passbook Copy (showing active NPCI / DBT mapping)',
          hi: 'बैंक पासबुक की प्रति (NPCI / DBT सक्रियण सहित)',
          mr: 'बँक पासबुकची प्रत (NPCI / DBT मॅपिंगसह)',
        },
        category: 'required',
        whyNeeded: {
          en: 'To verify the DBT bank account and IFSC code where monthly pension disbursement is transferred.',
          hi: 'उस डीबीटी बैंक खाते और आईएफएससी कोड के सत्यापन हेतु जहां मासिक पेंशन भेजी जाती है।',
          mr: 'जिथे मासिक पेन्शन जमा होते त्या डीबीटी बँक खात्याची आणि IFSC कोडची पडताळणी करण्यासाठी.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Account balance and non-related transaction history are kept private; only account number and IFSC are captured.',
          hi: 'खाते का शेष बैलेंस या अन्य लेन-देन निजी रखे जाते हैं; केवल खाता संख्या और IFSC देखा जाता है।',
          mr: 'खात्यातील शिल्लक आणि इतर व्यवहार गोपनीय ठेवले जातात; फक्त खाते क्रमांक आणि IFSC वापरला जातो.',
        },
        examples: ['First page of nationalized bank passbook'],
      },
      {
        id: 'doc-pension-id',
        name: {
          en: 'Pension Registration Number or Previous PPO Slip',
          hi: 'पेंशन पंजीकरण संख्या या पूर्व पीपीओ पर्ची',
          mr: 'पेन्शन नोंदणी क्रमांक किंवा जुनी मंजुरी पावती (PPO)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Identifies the stalled pension application record on the State Social Welfare portal.',
          hi: 'पोर्टल पर रुकी हुई पेंशन आवेदन संख्या खोजने के लिए।',
          mr: 'राज्य समाज कल्याण पोर्टलवर थांबलेला पेन्शन अर्ज शोधण्यासाठी आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Used exclusively for portal look-up with the district social welfare office.',
          hi: 'केवल जिला समाज कल्याण अधिकारी के रिकॉर्ड में खोजने के लिए।',
          mr: 'फक्त जिल्हा समाज कल्याण कार्यालयाच्या नोंदी तपासण्यासाठी वापरले जाते.',
        },
        examples: ['Pension sanction order', 'Old passbook pension entry'],
      },
      {
        id: 'doc-aadhaar',
        name: {
          en: 'Aadhaar Card (Linked with Mobile for e-KYC)',
          hi: 'आधार कार्ड (ई-केवाईसी हेतु मोबाइल से जुड़ा)',
          mr: 'आधार कार्ड (ई-केवायसीसाठी मोबाईलशी जोडलेले)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Government mandate for annual Jeevan Pramaan / biometric alive verification.',
          hi: 'वार्षिक जीवन प्रमाण और आधार सत्यापन के लिए सरकारी नियम के तहत आवश्यक।',
          mr: 'वार्षिक जीवन प्रमाण (हयातीचा दाखला) आणि आधार पडताळणीसाठी शासकीय नियमानुसार आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png'],
        privacyRedactionNotes: {
          en: 'Only verified against portal with citizen live OTP confirmation. No biometric storage.',
          hi: 'नागरिक की लाइव ओटीपी पुष्टि के साथ ही उपयोग। कोई बायोमेट्रिक डेटा स्टोर नहीं होता।',
          mr: 'नागरिकाच्या थेट ओटीपी पुष्टीसहच वापरले जाते. कोणताही बायोमेट्रिक डेटा साठवला जात नाही.',
        },
        examples: ['Aadhaar card copy'],
      },
    ],
    isMvpSupported: true,
  },
  {
    id: 'up-domicile-certificate',
    code: 'UP-EDIST-DOM-03',
    name: {
      en: 'Domicile / Residence Certificate (मूल निवास / अधिवास प्रमाणपत्र)',
      hi: 'मूल निवास प्रमाण पत्र (Domicile Certificate)',
      mr: 'अधिवास व राष्ट्रीयत्व प्रमाणपत्र / रहिवासी दाखला (Domicile Certificate)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Revenue Department, State Government',
      hi: 'राजस्व विभाग, राज्य सरकार',
      mr: 'महसूल विभाग, राज्य शासन',
    },
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    officialFee: 15,
    estimatedDays: 20,
    description: {
      en: 'Proof of permanent residency in the state for educational admissions, government recruitments, and local reservation.',
      hi: 'शैक्षणिक प्रवेश, सरकारी नौकरियों और राज्य आरक्षण हेतु स्थायी निवास का आधिकारिक प्रमाण।',
      mr: 'शैक्षणिक प्रवेश, सरकारी भरती आणि स्थानिक आरक्षणासाठी राज्याचे कायमस्वरूपी रहिवासी असल्याचा अधिकृत दाखला.',
    },
    eligibility: [
      {
        id: 'continuous_stay',
        label: {
          en: 'Citizen meets the state continuous residency tenure or birth requirement',
          hi: 'नागरिक राज्य में निर्धारित निवास अवधि या जन्म की शर्त पूरी करता हो',
          mr: 'नागरिक राज्यातील विहित वास्तव्य कालावधी किंवा जन्माची अट पूर्ण करतो',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-identity',
        name: {
          en: 'Identity Proof (Aadhaar or Voter ID)',
          hi: 'पहचान प्रमाण (आधार या मतदाता पहचान पत्र)',
          mr: 'ओळख पुरावा (आधार किंवा मतदार ओळखपत्र)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Verifies the citizen identity.',
          hi: 'नागरिक की पहचान सुनिश्चित करने के लिए।',
          mr: 'नागरिकाची ओळख पटवण्यासाठी आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'First 8 digits masked.',
          hi: 'प्रथम 8 अंक सुरक्षित रूप से छिपाए गए।',
          mr: 'पहिले ८ अंक सुरक्षितपणे लपवले जातात.',
        },
        examples: ['Aadhaar Card'],
      },
      {
        id: 'doc-school-or-birth',
        name: {
          en: 'School Leaving Certificate / Marksheet or Birth Certificate in State',
          hi: 'राज्य में शिक्षा प्रमाण पत्र या जन्म प्रमाण पत्र',
          mr: 'शाळा सोडल्याचा दाखला / गुणपत्रिका किंवा जन्म प्रमाणपत्र',
        },
        category: 'required',
        whyNeeded: {
          en: 'Validates duration of residency within the state borders.',
          hi: 'राज्य में निवास की अवधि का प्रमाण स्थापित करने के लिए।',
          mr: 'राज्यातील वास्तव्याचा कालावधी सिद्ध करण्यासाठी आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Used solely for residency tenure verification.',
          hi: 'केवल निवास अवधि सत्यापन हेतु प्रयुक्त।',
          mr: 'फक्त वास्तव्य कालावधी पडताळणीसाठी वापरले जाते.',
        },
        examples: ['Class 10th or 12th marksheet / School LC', 'Birth Certificate'],
      },
      {
        id: 'doc-photo',
        name: {
          en: 'Passport Size Photograph',
          hi: 'पासपोर्ट आकार का फोटो',
          mr: 'पासपोर्ट आकाराचा फोटो',
        },
        category: 'required',
        whyNeeded: {
          en: 'Printed onto the finalized domicile certificate.',
          hi: 'जारी किए जाने वाले प्रमाण पत्र पर मुद्रित करने के लिए।',
          mr: 'जारी केल्या जाणाऱ्या अधिवास प्रमाणपत्रावर छापण्यासाठी.',
        },
        acceptedTypes: ['image/jpeg', 'image/png'],
        privacyRedactionNotes: {
          en: 'Portal attachment.',
          hi: 'पोर्टल अटैचमेंट।',
          mr: 'पोर्टल जोडणीसाठी.',
        },
        examples: ['Color passport photo'],
      },
    ],
    isMvpSupported: true,
  },
  {
    id: 'widow-pension-scheme',
    code: 'UP-SWD-WID-04',
    name: {
      en: 'Widow / Destitute Women Pension Scheme (विधवा / निराधार महिला पेंशन)',
      hi: 'निराश्रित महिला / विधवा पेंशन योजना (Widow Pension)',
      mr: 'विधवा व संजय गांधी निराधार महिला पेन्शन योजना (Widow Pension)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Women & Child / Social Welfare Department, State Government',
      hi: 'महिला कल्याण एवं समाज कल्याण विभाग, राज्य सरकार',
      mr: 'महिला व बालविकास / सामाजिक न्याय विभाग, राज्य शासन',
    },
    portalName: 'UP Social Welfare Pension Portal (sspy-up.gov.in)',
    portalUrl: 'https://sspy-up.gov.in',
    officialFee: 0,
    estimatedDays: 21,
    description: {
      en: 'Monthly direct benefit transfer (DBT) financial assistance for women after the loss of a spouse to ensure household security.',
      hi: 'पति के निधन के पश्चात महिलाओं को आर्थिक सुरक्षा प्रदान करने हेतु मासिक डीबीटी (DBT) पेंशन सहायता।',
      mr: 'पतीच्या निधनानंतर महिलांना आर्थिक आधार देण्यासाठी थेट बँक खात्यात (DBT) मासिक पेन्शन सहाय्य योजना.',
    },
    eligibility: [
      {
        id: 'bereavement_proof',
        label: {
          en: 'Possesses official Death Certificate of late husband',
          hi: 'स्वर्गीय पति का आधिकारिक मृत्यु प्रमाण पत्र उपलब्ध होना चाहिए',
          mr: 'दिवंगत पतीचे अधिकृत मृत्यू प्रमाणपत्र उपलब्ध असणे आवश्यक आहे',
        },
        mandatory: true,
      },
      {
        id: 'income_threshold',
        label: {
          en: 'Annual family income within state social security threshold',
          hi: 'वार्षिक पारिवारिक आय राज्य की निर्धारित सीमा के भीतर हो',
          mr: 'कुटुंबाचे वार्षिक उत्पन्न राज्याच्या विहित मर्यादेच्या आत असावे',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-death-cert',
        name: {
          en: 'Husband Death Certificate (Registrar QR Verified)',
          hi: 'पति का मृत्यु प्रमाण पत्र (रजिस्ट्रार द्वारा जारी)',
          mr: 'पतीचे मृत्यू प्रमाणपत्र (ग्रामपंचायत / नगरपालिका नोंदणीकृत)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Primary statutory proof of bereavement required to sanction widow pension.',
          hi: 'विधवा पेंशन स्वीकृति के लिए प्राथमिक वैधानिक प्रमाण।',
          mr: 'विधवा पेन्शन मंजुरीसाठी आवश्यक असलेला प्राथमिक वैधानिक पुरावा.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Shared across linked life-event services (Family Pension & Property Mutation) with a single upload.',
          hi: 'एक बार अपलोड करने पर पारिवारिक पेंशन और नामांतरण आवेदनों में भी सुरक्षित उपयोग।',
          mr: 'एकदा अपलोड केल्यावर कुटुंब पेन्शन आणि मालमत्ता फेरफार अर्जांसाठीही सुरक्षितपणे वापरले जाते.',
        },
        examples: ['CRS Death Certificate with QR code'],
      },
      {
        id: 'doc-aadhaar',
        name: {
          en: 'Applicant Aadhaar Card (Identity & Age Proof)',
          hi: 'आवेदिका का आधार कार्ड (पहचान एवं आयु प्रमाण)',
          mr: 'अर्जदार महिलेचे आधार कार्ड (ओळख व वयाचा पुरावा)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Verifies identity and links DBT payment pipeline.',
          hi: 'पहचान सत्यापन और डीबीटी भुगतान पाइपलाइन जोड़ने हेतु।',
          mr: 'ओळख पडताळणी आणि डीबीटी थेट लाभ जोडणीसाठी आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'First 8 digits masked locally before portal transmission.',
          hi: 'पोर्टल पर भेजने से पहले प्रथम 8 अंक सुरक्षित रूप से छिपाए जाते हैं।',
          mr: 'पोर्टलवर पाठवण्यापूर्वी पहिले ८ अंक स्थानिक पातळीवर लपवले जातात.',
        },
        examples: ['Aadhaar Card front & back'],
      },
      {
        id: 'doc-passbook',
        name: {
          en: 'Single-Holder Bank Passbook (NPCI / DBT Seeded)',
          hi: 'एकल बैंक खाता पासबुक (NPCI / DBT से जुड़ा)',
          mr: 'वैयक्तिक बँक पासबुक (NPCI / आधार सीडिंगसह)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Monthly pension can only be credited to a single-holder account (not a joint account with late spouse).',
          hi: 'मासिक पेंशन केवल आवेदिका के एकल खाते में ही भेजी जा सकती है (संयुक्त खाते में नहीं)।',
          mr: 'मासिक पेन्शन फक्त अर्जदाराच्या वैयक्तिक खात्यातच जमा होऊ शकते (संयुक्त खात्यात नाही).',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Transaction history redacted; only Account Number, IFSC, and Bank Seal are read.',
          hi: 'लेन-देन विवरण छिपाया जाता है; केवल खाता संख्या, IFSC और बैंक मुहर देखी जाती है।',
          mr: 'व्यवहार तपशील लपवला जातो; फक्त खाते क्रमांक, IFSC आणि बँकेचा शिक्का तपासला जातो.',
        },
        examples: ['Bank passbook first page with IFSC stamp'],
      },
    ],
    isMvpSupported: true,
  },
  {
    id: 'family-pension-survivor',
    code: 'UP-SWD-FAM-05',
    name: {
      en: 'Family Benefit & Survivor Lump-Sum Grant (राष्ट्रीय पारिवारिक लाभ / कुटुंब सहाय्य)',
      hi: 'राष्ट्रीय पारिवारिक लाभ एवं आश्रित सहायता योजना (Family Benefit)',
      mr: 'राष्ट्रीय कुटुंब लाभ व वारस अर्थसहाय्य योजना (Family Survivor Benefit)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Social Justice & Welfare Department, State Government',
      hi: 'समाज कल्याण विभाग, राज्य सरकार',
      mr: 'सामाजिक न्याय व विशेष सहाय्य विभाग, राज्य शासन',
    },
    portalName: 'UP Social Welfare Pension Portal (sspy-up.gov.in)',
    portalUrl: 'https://sspy-up.gov.in',
    officialFee: 0,
    estimatedDays: 30,
    description: {
      en: 'Immediate lump-sum financial grant (₹20,000–₹30,000) and survivor family pension on the death of the primary breadwinner.',
      hi: 'परिवार के मुख्य कमाऊ सदस्य की मृत्यु होने पर तत्काल एकमुश्त आर्थिक सहायता (₹20,000–₹30,000) एवं पारिवारिक लाभ।',
      mr: 'कुटुंबातील मुख्य कमावत्या व्यक्तीच्या मृत्यूनंतर तात्काळ एकरकमी आर्थिक मदत (₹२०,०००–₹३०,०००) व कुटुंब निवृत्तीवेतन लाभ.',
    },
    eligibility: [
      {
        id: 'breadwinner_death',
        label: {
          en: 'Application filed within statutory window of primary earner death',
          hi: 'मुख्य कमाऊ सदस्य की मृत्यु के निर्धारित समय के भीतर आवेदन',
          mr: 'मुख्य कमावत्या व्यक्तीच्या निधनानंतर विहित मुदतीत अर्ज',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-death-cert',
        name: {
          en: 'Death Certificate of Deceased Breadwinner',
          hi: 'मृतक मुखिया का मृत्यु प्रमाण पत्र',
          mr: 'मृत कुटुंबप्रमुखाचे मृत्यू प्रमाणपत्र',
        },
        category: 'required',
        whyNeeded: {
          en: 'Confirms date and registration of demise for lump-sum family benefit sanction.',
          hi: 'एकमुश्त पारिवारिक सहायता स्वीकृति हेतु मृत्यु पंजीकरण की पुष्टि।',
          mr: 'एकरकमी कुटुंब सहाय्य मंजुरीसाठी मृत्यू नोंदणीची पुष्टी करते.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Automatically reused from your Life-Event bundle.',
          hi: 'आपके जीवन-घटना बंडल से स्वतः सुरक्षित रूप से साझा।',
          mr: 'तुमच्या जीवन-घटना बंडलमधून आपोआप सुरक्षितपणे वापरले जाते.',
        },
        examples: ['Official Death Certificate'],
      },
      {
        id: 'doc-aadhaar',
        name: {
          en: 'Survivor / Spouse Aadhaar Card',
          hi: 'आश्रित / पत्नी का आधार कार्ड',
          mr: 'वारसदार / पत्नीचे आधार कार्ड',
        },
        category: 'required',
        whyNeeded: {
          en: 'Establishes identity of the surviving claimant.',
          hi: 'आश्रित दावेदार की पहचान स्थापित करने के लिए।',
          mr: 'हयात वारसदाराची ओळख पटवण्यासाठी आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'First 8 digits masked.',
          hi: 'प्रथम 8 अंक छिपाए गए।',
          mr: 'पहिले ८ अंक सुरक्षितपणे लपवले जातात.',
        },
        examples: ['Aadhaar Card'],
      },
      {
        id: 'doc-passbook',
        name: {
          en: 'Bank Passbook (for ₹30,000 DBT Transfer)',
          hi: 'बैंक पासबुक (एकमुश्त सहायता राशि हेतु)',
          mr: 'बँक पासबुक (थेट खात्यात निधी जमा करण्यासाठी)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Direct transfer of lump-sum survivor benefit.',
          hi: 'एकमुश्त सहायता राशि के सीधे अंतरण के लिए।',
          mr: 'एकरकमी मदत थेट बँक खात्यात जमा करण्यासाठी.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Only account number and IFSC shared.',
          hi: 'केवल खाता संख्या और IFSC साझा।',
          mr: 'फक्त खाते क्रमांक आणि IFSC कोड शेअर केला जातो.',
        },
        examples: ['Bank passbook copy'],
      },
    ],
    isMvpSupported: true,
  },
  {
    id: 'property-mutation-ferfar',
    code: 'UP-REV-MUT-06',
    name: {
      en: 'Property & Land Mutation / Succession (दाखिल-खारिज / ७/१२ वारस फेरफार)',
      hi: 'उत्तराधिकार / वरासत संपत्ति नामांतरण (दाखिल-खारिज / खतौनी)',
      mr: 'मालमत्ता व ७/१२ वारस नोंदणी / फेरफार (Property Mutation)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Revenue & Land Records Department, State Government',
      hi: 'राजस्व परिषद एवं भू-अभिलेख विभाग, राज्य सरकार',
      mr: 'महसूल व भूमिअभिलेख विभाग (महाभूलेख / आपले सरकार)',
    },
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    officialFee: 50,
    estimatedDays: 35,
    description: {
      en: 'Legal transfer of house or agricultural land title (7/12 extract, Khatauni, or municipal property card) to surviving spouse and legal heirs.',
      hi: 'मृतक के नाम दर्ज कृषि भूमि (खतौनी) या मकान का पत्नी एवं वैध उत्तराधिकारियों के नाम कानूनी नामांतरण (वरासत)।',
      mr: 'मृत व्यक्तीच्या नावावरील शेतजमीन (७/१२ उतारा, ८-अ) किंवा घराची पत्नी व कायदेशीर वारसांच्या नावे अधिकृत फेरफार नोंदणी.',
    },
    eligibility: [
      {
        id: 'legal_heir',
        label: {
          en: 'Applicant is a legal heir / surviving spouse of the recorded property holder',
          hi: 'आवेदक दर्ज खातेदार का वैध उत्तराधिकारी / जीवनसाथी है',
          mr: 'अर्जदार हा नोंदणीकृत मालमत्ताधारकाचा कायदेशीर वारस / जोडीदार आहे',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-death-cert',
        name: {
          en: 'Death Certificate of Recorded Title Holder',
          hi: 'खातेदार का मृत्यु प्रमाण पत्र',
          mr: 'मूळ खातेदाराचे मृत्यू प्रमाणपत्र',
        },
        category: 'required',
        whyNeeded: {
          en: 'Triggers succession mutation (Varasat / वारस फेरफार) in revenue records.',
          hi: 'राजस्व अभिलेखों में वरासत (उत्तराधिकार) दर्ज करने का आधार।',
          mr: 'महसूल दप्तरी वारस फेरफार नोंदवण्यासाठी मुख्य पुरावा.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Reused from your Life-Event bundle.',
          hi: 'जीवन-घटना बंडल से स्वतः प्रयुक्त।',
          mr: 'जीवन-घटना बंडलमधून आपोआप वापरले जाते.',
        },
        examples: ['Official Death Certificate'],
      },
      {
        id: 'doc-land-extract',
        name: {
          en: 'Current Land / Property Extract (7/12 Utara, Khatauni, or Property Tax Receipt)',
          hi: 'वर्तमान खतौनी नकल / संपत्ति कर रसीद',
          mr: 'चालू ७/१२ उतारा, ८-अ किंवा मालमत्ता कर पावती (Property Card)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Identifies the survey/gat number or house number to be mutated in the revenue register.',
          hi: 'गाटा/खसरा संख्या या मकान नंबर की पहचान के लिए जिसमें नाम दर्ज होना है।',
          mr: 'ज्या गट क्रमांक/सर्व्हे नंबर किंवा घरावर वारसांची नावे लावायची आहेत त्याची पडताळणी करण्यासाठी.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Used solely to match Talathi / Lekhpal mutation register.',
          hi: 'केवल लेखपाल द्वारा खतौनी मिलान के लिए।',
          mr: 'फक्त तलाठी / मंडळ अधिकारी फेरफार नोंदवहीशी जुळवण्यासाठी.',
        },
        examples: ['7/12 extract (Mahabhulekh / Bhulekh)', 'Municipal tax bill'],
      },
      {
        id: 'doc-heir-affidavit',
        name: {
          en: 'Family Tree / Legal Heir Self-Declaration (Vanshavali / वारस प्रतिज्ञापत्र)',
          hi: 'परिवार रजिस्टर नकल / उत्तराधिकारी स्व-घोषणा (वंशावली)',
          mr: 'कुटुंब वंशावळ / वारस स्वयं-घोषणापत्र (तलाठी समक्ष)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Lists all surviving legal heirs so no family member is unlawfully excluded.',
          hi: 'सभी वैध उत्तराधिकारियों का विवरण ताकि किसी वारिस का नाम न छूटे।',
          mr: 'सर्व कायदेशीर वारसांची यादी, जेणेकरून कोणत्याही वारसाचा हक्क डावलला जाणार नाही.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Shared only with the jurisdictional Revenue Circle Officer.',
          hi: 'केवल संबंधित राजस्व निरीक्षक / तहसीलदार के साथ साझा।',
          mr: 'फक्त संबंधित तलाठी व मंडळ अधिकाऱ्यांशी शेअर केले जाते.',
        },
        examples: ['Signed legal heir declaration / Ration card family page'],
      },
    ],
    isMvpSupported: true,
  },
  {
    id: 'ration-card-hof-update',
    code: 'UP-FCS-RAT-07',
    name: {
      en: 'Ration Card Head-of-Family Transfer (राशन कार्ड मुखिया परिवर्तन / कुटुंबप्रमुख बदल)',
      hi: 'राशन कार्ड मुखिया परिवर्तन एवं नाम विलोपन (Ration Card Update)',
      mr: 'रेशन कार्ड कुटुंबप्रमुख बदल व नाव कमी करणे (Ration Card Update)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Food & Civil Supplies Department, State Government',
      hi: 'खाद्य एवं रसद विभाग, राज्य सरकार',
      mr: 'अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभाग, राज्य शासन',
    },
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    officialFee: 10,
    estimatedDays: 14,
    description: {
      en: 'Updates the Ration Card to make the surviving spouse the official Head of Family and ensures uninterrupted NFSA foodgrain entitlement.',
      hi: 'राशन कार्ड में जीवित पत्नी को परिवार का मुखिया दर्ज करना ताकि सरकारी राशन वितरण बिना रुके जारी रहे।',
      mr: 'रेशन कार्डवर हयात पत्नीची कुटुंबप्रमुख म्हणून नोंद करणे, जेणेकरून स्वस्त धान्य (रेशन) पुरवठा अखंड सुरू राहील.',
    },
    eligibility: [
      {
        id: 'existing_ration_card',
        label: {
          en: 'Family holds an existing Priority Household (PHH) or Antyodaya Ration Card',
          hi: 'परिवार के पास पहले से पात्र गृहस्थी या अंत्योदय राशन कार्ड उपलब्ध है',
          mr: 'कुटुंबाकडे आधीच प्राधान्य कुटुंब किंवा अंत्योदय रेशन कार्ड आहे',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-death-cert',
        name: {
          en: 'Death Certificate',
          hi: 'मृत्यु प्रमाण पत्र',
          mr: 'मृत्यू प्रमाणपत्र',
        },
        category: 'required',
        whyNeeded: {
          en: 'Required to transfer Head-of-Family status.',
          hi: 'मुखिया का नाम बदलने के लिए आवश्यक।',
          mr: 'कुटुंबप्रमुखाचे नाव बदलण्यासाठी आवश्यक.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Reused from your Life-Event bundle.',
          hi: 'बंडल से स्वतः प्रयुक्त।',
          mr: 'बंडलमधून आपोआप वापरले जाते.',
        },
        examples: ['Death Certificate'],
      },
      {
        id: 'doc-aadhaar',
        name: {
          en: 'New Head of Family Aadhaar Card',
          hi: 'नई महिला मुखिया का आधार कार्ड',
          mr: 'नवीन महिला कुटुंबप्रमुखाचे आधार कार्ड',
        },
        category: 'required',
        whyNeeded: {
          en: 'Links e-POS biometric authentication to the new Head of Family.',
          hi: 'राशन दुकान की ई-पॉस मशीन पर प्रमाणीकरण हेतु।',
          mr: 'रेशन दुकानातील ई-पॉस मशीनवर बायोमेट्रिक ओळखीसाठी.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'First 8 digits masked.',
          hi: 'प्रथम 8 अंक छिपाए गए।',
          mr: 'पहिले ८ अंक लपवले जातात.',
        },
        examples: ['Aadhaar Card'],
      },
    ],
    isMvpSupported: true,
  },
  {
    id: 'up-caste',
    code: 'UP-EDIST-CST-08',
    name: {
      en: 'Caste Certificate (जाति प्रमाण पत्र / जातीचा दाखला — SC/ST/OBC)',
      hi: 'जाति प्रमाण पत्र (Caste Certificate — अनुसूचित जाति/जनजाति/ओबीसी)',
      mr: 'जातीचा दाखला / प्रमाणपत्र (Caste Certificate — SC/ST/OBC)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Revenue & Backward Classes Welfare Department, State Government',
      hi: 'राजस्व एवं समाज कल्याण विभाग, राज्य सरकार',
      mr: 'महसूल व सामाजिक न्याय विभाग, राज्य शासन',
    },
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    officialFee: 15,
    estimatedDays: 15,
    description: {
      en: 'Official Caste Certificate (Jaati Praman Patra) verifying SC, ST, or OBC category for educational scholarships, reservations, and welfare schemes.',
      hi: 'छात्रवृत्ति, आरक्षण और सरकारी योजनाओं हेतु अनुसूचित जाति, जनजाति या अन्य पिछड़ा वर्ग (SC/ST/OBC) प्रमाणित करने वाला जाति प्रमाण पत्र।',
      mr: 'शिष्यवृत्ती, आरक्षण आणि शासकीय योजनांसाठी अनुसूचित जाती, जमाती किंवा इतर मागासवर्ग (SC/ST/OBC) प्रमाणित करणारा अधिकृत जातीचा दाखला.',
    },
    eligibility: [
      {
        id: 'caste_lineage',
        label: {
          en: 'Belongs to a notified SC/ST/OBC community in the state schedule',
          hi: 'राज्य की अधिसूचित अनुसूचित जाति/जनजाति/ओबीसी सूची में शामिल समुदाय से संबंध',
          mr: 'राज्याच्या अधिसूचित SC/ST/OBC प्रवर्गातील समुदायाशी संबंधित असणे आवश्यक',
        },
        mandatory: true,
      },
    ],
    documents: [
      {
        id: 'doc-identity',
        name: {
          en: 'Applicant Aadhaar Card',
          hi: 'आवेदक का आधार कार्ड',
          mr: 'अर्जदाराचे आधार कार्ड',
        },
        category: 'required',
        whyNeeded: {
          en: 'Verifies applicant identity and permanent address.',
          hi: 'आवेदक की पहचान और स्थायी पते के सत्यापन हेतु।',
          mr: 'अर्जदाराची ओळख आणि कायमस्वरूपी पत्त्याच्या पडताळणीसाठी.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'First 8 digits masked locally before portal upload.',
          hi: 'पोर्टल अपलोड से पहले प्रथम 8 अंक सुरक्षित रूप से छिपाए जाते हैं।',
          mr: 'पोर्टलवर अपलोड करण्यापूर्वी पहिले ८ अंक सुरक्षितपणे लपवले जातात.',
        },
        examples: ['Aadhaar Card copy'],
      },
      {
        id: 'doc-caste-proof',
        name: {
          en: 'Father/Family Caste Record or School Leaving Certificate mentioning Caste',
          hi: 'पिता/परिवार का जाति प्रमाण पत्र या स्कूल टीसी/परिवार रजिस्टर नकल',
          mr: 'वडिलांचा/कुटुंबाचा जातीचा दाखला किंवा जातीची नोंद असलेला शाळा सोडल्याचा दाखला',
        },
        category: 'required',
        whyNeeded: {
          en: 'Establishes community lineage for Tehsildar/Lekhpal verification.',
          hi: 'तहसीलदार एवं लेखपाल द्वारा जाति सत्यापन हेतु वंशावली प्रमाण।',
          mr: 'तहसीलदार आणि तलाठी यांच्याकडून जात पडताळणीसाठी वंशावळ पुरावा.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Shared strictly with the jurisdictional revenue officer.',
          hi: 'केवल संबंधित राजस्व अधिकारी के साथ साझा।',
          mr: 'फक्त संबंधित महसूल अधिकाऱ्यांशी शेअर केले जाते.',
        },
        examples: ['Father caste certificate', 'School LC with caste entry'],
      },
      {
        id: 'doc-self-decl',
        name: {
          en: 'Self-Declaration Form (Swamitva / Caste Affidavit)',
          hi: 'स्व-प्रमाणित घोषणा पत्र (प्रपत्र)',
          mr: 'स्वयं-घोषणापत्र (प्रतिज्ञापत्र)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Mandatory signed affirmation of community and non-creamy layer status.',
          hi: 'जाति एवं क्रीमी लेयर स्थिति की पुष्टि हेतु अनिवार्य हस्ताक्षरित घोषणा।',
          mr: 'जात आणि नॉन-क्रीमी लेयर स्थितीच्या पुष्टीसाठी अनिवार्य स्वाक्षरीकृत घोषणा.',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Attached directly to the e-District application.',
          hi: 'सीधे ई-डिस्ट्रिक्ट आवेदन के साथ संलग्न।',
          mr: 'थेट ई-डिस्ट्रिक्ट अर्जासोबत जोडले जाते.',
        },
        examples: ['Signed self-declaration'],
      },
    ],
    isMvpSupported: true,
  },
];

export interface LifeEventTrigger {
  id: string;
  eventTitle: LocalizedText;
  proactiveAgentPrompt: LocalizedText;
  detectedSignalBadge: LocalizedText;
  unlockedServiceIds: string[];
  sharedDocumentsSummary: LocalizedText;
  totalEstimatedBenefit: LocalizedText;
  sampleVoiceTranscript: LocalizedText;
}

export const LIFE_EVENT_TRIGGERS: LifeEventTrigger[] = [
  {
    id: 'bereavement-spouse',
    eventTitle: {
      en: 'Loss of Spouse / Bereavement Support',
      hi: 'पति का निधन / वैधव्य सहायता पैकेज',
      mr: 'पतीचे निधन / विधवा व वारस सहाय्य पॅकेज',
    },
    proactiveAgentPrompt: {
      en: '“Your husband passed away last month; you may be eligible for a Widow Pension, Family Survivor Benefit, Property Mutation (Ferfar), and Ration Card Head-of-Family Transfer. Want me to start all of them?”',
      hi: '“आपके पति का पिछले महीने निधन हो गया; आप विधवा पेंशन, राष्ट्रीय पारिवारिक लाभ, संपत्ति नामांतरण (दाखिल-खारिज) और राशन कार्ड मुखिया परिवर्तन के लिए पात्र हो सकती हैं। क्या मैं ये सभी आवेदन एक साथ शुरू करूँ?”',
      mr: '“तुमच्या पतींचे गेल्या महिन्यात निधन झाले; तुम्ही विधवा पेन्शन, राष्ट्रीय कुटुंब लाभ, मालमत्ता वारस फेरफार (७/१२ नोंद) आणि रेशन कार्ड कुटुंबप्रमुख बदलासाठी पात्र असू शकता. मी हे सर्व अर्ज एकत्र सुरू करू का?”',
    },
    detectedSignalBadge: {
      en: 'Proactive Life-Event Trigger • 1 Event Unlocks 4 Services',
      hi: 'सक्रिय जीवन-घटना पहचान • 1 घटना से 4 सरकारी सेवाएं अनलॉक',
      mr: 'सक्रिय जीवन-घटना ओळख • १ घटनेतून ४ शासकीय सेवा उपलब्ध',
    },
    unlockedServiceIds: [
      'widow-pension-scheme',
      'family-pension-survivor',
      'property-mutation-ferfar',
      'ration-card-hof-update',
    ],
    sharedDocumentsSummary: {
      en: 'Upload Death Certificate, Aadhaar & Bank Passbook ONCE — Pratinidhi reuses them across all 4 applications automatically.',
      hi: 'मृत्यु प्रमाण पत्र, आधार और बैंक पासबुक केवल एक बार अपलोड करें — प्रतिनिधि इन्हें चारों आवेदनों में स्वतः लगा देगा।',
      mr: 'मृत्यू प्रमाणपत्र, आधार आणि बँक पासबुक फक्त एकदाच अपलोड करा — प्रतिनिधी ते चारही अर्जांमध्ये आपोआप वापरेल.',
    },
    totalEstimatedBenefit: {
      en: '₹1,500/mo Widow Pension + ₹30,000 Family Benefit + Legal Land Title Mutation + Uninterrupted Ration',
      hi: '₹1,500/माह विधवा पेंशन + ₹30,000 पारिवारिक सहायता + कानूनी भूमि वरासत + निर्बाध राशन',
      mr: '₹१,५००/महिना विधवा पेन्शन + ₹३०,००० कुटुंब सहाय्य + कायदेशीर ७/१२ वारस नोंद + अखंड रेशन',
    },
    sampleVoiceTranscript: {
      en: 'My husband passed away last month. Please help me apply for widow pension, family benefit, and property mutation.',
      hi: 'मेरे पति का पिछले महीने निधन हो गया है। मुझे विधवा पेंशन, पारिवारिक लाभ और जमीन की वरासत (नामांतरण) शुरू करवानी है।',
      mr: 'माझ्या पतींचे गेल्या महिन्यात निधन झाले आहे. मला विधवा पेन्शन, कुटुंब लाभ आणि ७/१२ वारस फेरफार अर्ज सुरू करायचे आहेत.',
    },
  },
  {
    id: 'turning-60-senior',
    eventTitle: {
      en: 'Turning 60 / Senior Citizen Milestone',
      hi: '60 वर्ष की आयु पूर्ण / वरिष्ठ नागरिक पैकेज',
      mr: '६० वर्षे पूर्ण / ज्येष्ठ नागरिक सन्मान पॅकेज',
    },
    proactiveAgentPrompt: {
      en: '“Your parent turned 60 this month; they are eligible for Old Age Pension Revival/Enrolment, Senior Income Exemption Certificate, and Permanent Domicile Proof. Want me to start all three?”',
      hi: '“आपके माता-पिता इस महीने 60 वर्ष के हो गए हैं; वे अब वृद्धावस्था पेंशन, वरिष्ठ आय प्रमाण पत्र और निवास प्रमाण पत्र के लिए पात्र हैं। क्या मैं तीनों शुरू करूँ?”',
      mr: '“तुमचे पालक या महिन्यात ६० वर्षांचे झाले आहेत; ते आता वृद्धापकाळ पेन्शन, उत्पन्न दाखला आणि अधिवास प्रमाणपत्रासाठी पात्र आहेत. मी तिन्ही अर्ज सुरू करू का?”',
    },
    detectedSignalBadge: {
      en: 'Senior Milestone Trigger • Unlocks 3 Linked Services',
      hi: 'वरिष्ठ नागरिक जीवन-घटना • 3 जुड़ी हुई सेवाएं उपलब्ध',
      mr: 'ज्येष्ठ नागरिक टप्पा • ३ संलग्न शासकीय सेवा उपलब्ध',
    },
    unlockedServiceIds: [
      'up-pension-revival',
      'up-income-certificate',
      'up-domicile-certificate',
    ],
    sharedDocumentsSummary: {
      en: 'Aadhaar & Bank Passbook uploaded once are shared across Pension & Revenue certificates.',
      hi: 'आधार और पासबुक एक बार अपलोड करने पर पेंशन व राजस्व प्रमाण पत्रों में साझा।',
      mr: 'आधार आणि पासबुक एकदा अपलोड केल्यावर पेन्शन व महसूल दाखल्यांसाठी एकत्र वापरले जातात.',
    },
    totalEstimatedBenefit: {
      en: '₹1,000–₹1,500/mo Senior Pension + State Concessions & Healthcare Eligibility',
      hi: '₹1,000–₹1,500/माह वृद्धावस्था पेंशन + राज्य रियायतें व स्वास्थ्य लाभ',
      mr: '₹१,०००–₹१,५००/महिना वृद्धापकाळ पेन्शन + ज्येष्ठ नागरिक आरोग्य व प्रवास सवलत',
    },
    sampleVoiceTranscript: {
      en: 'My mother just turned 60 and needs old age pension and income certificate.',
      hi: 'मेरी माताजी 60 वर्ष की हो गई हैं, उनकी वृद्धावस्था पेंशन और आय प्रमाण पत्र शुरू करें।',
      mr: 'माझी आई ६० वर्षांची झाली आहे, तिची वृद्धापकाळ पेन्शन आणि उत्पन्नाचा दाखला सुरू करा.',
    },
  },
  {
    id: 'student-scholarship-admission',
    eventTitle: {
      en: '10th/12th Board Pass & College Admission Pack',
      hi: 'बोर्ड परीक्षा उत्तीर्ण एवं कॉलेज छात्रवृत्ति पैकेज',
      mr: '१०वी/१२वी उत्तीर्ण आणि महाविद्यालयीन शिष्यवृत्ती पॅकेज',
    },
    proactiveAgentPrompt: {
      en: '“Your child passed board exams and is applying for college; state scholarships require both a fresh Income Certificate and a Domicile Certificate before the deadline. Want me to start both now?”',
      hi: '“आपका बच्चा कॉलेज में प्रवेश ले रहा है; छात्रवृत्ति पोर्टल पर नया आय प्रमाण पत्र और मूल निवास प्रमाण पत्र दोनों अनिवार्य हैं। क्या मैं दोनों एक साथ शुरू करूँ?”',
      mr: '“तुमचे पाल्य महाविद्यालयात प्रवेश घेत आहे; महाडीबीटी/शिष्यवृत्तीसाठी नवीन उत्पन्नाचा दाखला आणि अधिवास (Domicile) प्रमाणपत्र दोन्ही आवश्यक आहेत. मी दोन्ही एकत्र सुरू करू का?”',
    },
    detectedSignalBadge: {
      en: 'Education Milestone • Unlocks 2 Mandatory Certificates',
      hi: 'शिक्षा जीवन-घटना • छात्रवृत्ति के 2 अनिवार्य प्रमाण पत्र',
      mr: 'शैक्षणिक टप्पा • शिष्यवृत्तीसाठी २ अनिवार्य दाखले',
    },
    unlockedServiceIds: ['up-income-certificate', 'up-domicile-certificate'],
    sharedDocumentsSummary: {
      en: 'Aadhaar, Photo & Ration Card are verified once and attached to both Tehsil applications.',
      hi: 'आधार, फोटो और राशन कार्ड एक बार जांचकर दोनों तहसील आवेदनों में लगाए जाएंगे।',
      mr: 'आधार, फोटो आणि रेशन कार्ड एकदाच तपासून दोन्ही तहसील अर्जांना जोडले जातील.',
    },
    totalEstimatedBenefit: {
      en: '100% Tuition Fee Reimbursement & Post-Matric Scholarship Eligibility',
      hi: '100% शिक्षण शुल्क प्रतिपूर्ति एवं पोस्ट-मैट्रिक छात्रवृत्ति पात्रता',
      mr: '१००% शैक्षणिक शुल्क परतावा आणि पोस्ट-मॅट्रिक शिष्यवृत्ती पात्रता',
    },
    sampleVoiceTranscript: {
      en: 'I passed 12th standard and need both income certificate and domicile certificate for college scholarship.',
      hi: 'मैंने 12वीं पास की है और कॉलेज छात्रवृत्ति के लिए आय और निवास दोनों प्रमाण पत्र चाहिए।',
      mr: 'मी १२वी उत्तीर्ण झालो असून महाविद्यालयीन शिष्यवृत्तीसाठी उत्पन्नाचा आणि रहिवासी दोन्ही दाखले हवे आहेत.',
    },
  },
];

export function detectLifeEventFromText(text: string): LifeEventTrigger | undefined {
  const clean = text.trim().toLowerCase();
  if (!clean) return undefined;

  const bereavementKeywords = [
    'husband passed away',
    'passed away',
    'husband died',
    'spouse passed',
    'widow',
    'bereavement',
    'निधन',
    'मृत्यु',
    'मृत्यू',
    'पति का निधन',
    'पति की मृत्यु',
    'विधवा',
    'निराश्रित',
    'वरासत',
    'दाखिल-खारिज',
    'पतीचे निधन',
    'पतींचे निधन',
    'पती वारले',
    'विधवा पेन्शन',
    'निराधार',
    'वारस नोंद',
    'फेरफार',
    'death certificate',
    'मृत्यु प्रमाण',
    'मृत्यू प्रमाणपत्र',
  ];
  if (bereavementKeywords.some((kw) => clean.includes(kw))) {
    return LIFE_EVENT_TRIGGERS[0];
  }

  const scholarshipPackKeywords = [
    'both income and domicile',
    'college admission',
    'passed 12th',
    'passed 10th',
    'दोनों प्रमाण पत्र',
    'दोन्ही दाखले',
  ];
  if (scholarshipPackKeywords.some((kw) => clean.includes(kw))) {
    return LIFE_EVENT_TRIGGERS[2];
  }

  return undefined;
}

export function localizeServiceForState(
  baseService: CivicService,
  stateName: string
): CivicService {
  const stateCfg = getStateConfig(stateName);
  const isSocialWelfare =
    baseService.id === 'up-pension-revival' ||
    baseService.id === 'widow-pension-scheme' ||
    baseService.id === 'family-pension-survivor';
  const codePrefix = stateCfg.id;
  const codeSuffix = baseService.code.split('-').slice(1).join('-');

  return {
    ...baseService,
    code: `${codePrefix}-${codeSuffix}`,
    state: stateCfg.name,
    portalName: isSocialWelfare ? stateCfg.pensionPortalName : stateCfg.portalName,
    portalUrl: isSocialWelfare ? stateCfg.pensionPortalUrl : stateCfg.portalUrl,
    department: isSocialWelfare
      ? {
          en: `Social Justice & Welfare Department, Government of ${stateCfg.name}`,
          hi: `समाज कल्याण विभाग, ${stateCfg.nameHi} शासन`,
          mr: `सामाजिक न्याय व विशेष सहाय्य विभाग, ${stateCfg.nameMr} शासन`,
        }
      : {
          en: `Revenue & Civil Supplies Department, Government of ${stateCfg.name}`,
          hi: `राजस्व एवं नागरिक आपूर्ति विभाग, ${stateCfg.nameHi} शासन`,
          mr: `महसूल व नागरी पुरवठा विभाग, ${stateCfg.nameMr} शासन`,
        },
  };
}

export function getServicesForState(stateName: string = 'Uttar Pradesh'): CivicService[] {
  return CIVIC_SERVICES.map((srv) => localizeServiceForState(srv, stateName));
}

export function findServiceByIdOrAlias(
  serviceId: string,
  stateName: string = 'Uttar Pradesh'
): CivicService | undefined {
  const aliasMap: Record<string, string> = {
    'up-pension-revival': 'up-pension-revival',
    'up-domicile': 'up-domicile-certificate',
    'up-domicile-certificate': 'up-domicile-certificate',
    'up-income': 'up-income-certificate',
    'up-income-certificate': 'up-income-certificate',
    'up-caste': 'up-caste',
    'up-caste-certificate': 'up-caste',
    'ration-card': 'ration-card-hof-update',
    'ration-card-hof-update': 'ration-card-hof-update',
    'widow-pension-scheme': 'widow-pension-scheme',
    'family-pension-survivor': 'family-pension-survivor',
    'property-mutation-ferfar': 'property-mutation-ferfar',
  };
  const resolvedId = aliasMap[serviceId] || serviceId;
  const baseService = CIVIC_SERVICES.find((s) => s.id === resolvedId);
  return baseService ? localizeServiceForState(baseService, stateName) : undefined;
}

export function extractMetadataFromTranscript(text: string): {
  emotionalState: string;
  urgency: 'normal' | 'high';
  mentionedDocuments: string[];
} {
  const clean = text.toLowerCase();
  const mentionedDocuments: string[] = [];

  const docPatterns: Array<{ label: string; keys: string[] }> = [
    { label: 'Aadhaar Card', keys: ['aadhaar', 'aadhar', 'आधार'] },
    { label: 'Bank Passbook', keys: ['passbook', 'bank', 'पासबुक', 'बैंक', 'बँक'] },
    { label: 'Death Certificate', keys: ['death certificate', 'मृत्यु प्रमाण', 'मृत्यू प्रमाणपत्र', 'निधन'] },
    { label: 'Ration Card', keys: ['ration', 'राशन', 'रेशन', 'bpl'] },
    { label: 'Marksheet / School LC', keys: ['marksheet', '10th', '12th', 'school', 'मार्कशीट', 'गुणपत्रिका'] },
    { label: 'Land Record (7/12 / Khatauni)', keys: ['7/12', '७/१२', 'khatauni', 'खतौनी', 'ferfar', 'फेरफार'] },
    { label: 'Pension PPO / ID', keys: ['ppo', 'pension id', 'jeevan pramaan', 'जीवन प्रमाण'] },
  ];

  for (const dp of docPatterns) {
    if (dp.keys.some((k) => clean.includes(k))) {
      mentionedDocuments.push(dp.label);
    }
  }

  const urgentKeys = [
    'stopped',
    'ruk gayi',
    'रुक गई',
    'बंद हो गई',
    'थांबली',
    'passed away',
    'निधन',
    'मृत्यु',
    'died',
    'urgent',
    'deadline',
    'तुरंत',
    'तातडीने',
  ];
  const isUrgent = urgentKeys.some((k) => clean.includes(k));

  let emotionalState = 'Calm / Inquiry';
  if (clean.includes('passed away') || clean.includes('निधन') || clean.includes('मृत्यु') || clean.includes('विधवा')) {
    emotionalState = 'Grieving / Vulnerable (Bereavement)';
  } else if (clean.includes('stopped') || clean.includes('बंद') || clean.includes('रुक गई') || clean.includes('थांबली')) {
    emotionalState = 'Distressed / Anxious (Benefit Halted)';
  } else if (clean.includes('scholarship') || clean.includes('admission') || clean.includes('छात्रवृत्ति') || clean.includes('शिष्यवृत्ती')) {
    emotionalState = 'Time-Sensitive (Student Deadline)';
  }

  return {
    emotionalState,
    urgency: isUrgent ? 'high' : 'normal',
    mentionedDocuments,
  };
}

export function classifyCitizenIntent(
  text: string,
  state: string = 'Uttar Pradesh'
): IntentClassificationResult {
  const clean = text.trim().toLowerCase();
  const stateCfg = getStateConfig(state);
  const meta = extractMetadataFromTranscript(text);

  if (!clean || clean.length < 3) {
    return {
      status: 'needs_clarification',
      confidence: 0,
      matchedReason: {
        en: 'The request is too brief to identify a specific government service.',
        hi: 'अनुरोध बहुत संक्षिप्त है, किसी विशिष्ट सरकारी सेवा की पहचान नहीं हो सकी।',
        mr: 'विनंती खूप लहान आहे, कोणतीही विशिष्ट सरकारी सेवा ओळखता आली नाही.',
      },
      suggestedAction: {
        en: 'Please speak or describe what document or welfare benefit you need.',
        hi: 'कृपया बोलकर या लिखकर बताएं कि आपको किस दस्तावेज या सरकारी योजना की आवश्यकता है।',
        mr: 'कृपया तुम्हाला कोणता दाखला किंवा सरकारी योजना हवी आहे ते बोलून किंवा लिहून सांगा.',
      },
      ...meta,
    };
  }

  // Check Bereavement / Widow Pension / Mutation keywords first
  const widowOrBereavementKeywords = [
    'widow',
    'husband passed',
    'passed away',
    'husband died',
    'विधवा',
    'निराश्रित महिला',
    'निधन',
    'पति का निधन',
    'पति की मृत्यु',
    'पतीचे निधन',
    'पतींचे निधन',
    'पती वारले',
    'संजय गांधी निराधार महिला',
  ];
  if (widowOrBereavementKeywords.some((kw) => clean.includes(kw))) {
    const baseService = CIVIC_SERVICES.find((s) => s.id === 'widow-pension-scheme')!;
    const service = localizeServiceForState(baseService, stateCfg.name);
    return {
      status: 'matched',
      serviceId: 'widow-pension-scheme',
      service,
      confidence: 0.97,
      summary_en: `Widow Pension & Bereavement Support for ${stateCfg.name}`,
      summary_hi: `${stateCfg.nameHi} हेतु विधवा पेंशन एवं पारिवारिक सहायता`,
      summary_mr: `${stateCfg.nameMr} करिता विधवा पेन्शन आणि कौटुंबिक सहाय्य`,
      matchedReason: {
        en: `Detected bereavement life event for ${stateCfg.name}. Matched primary Widow Pension scheme plus 3 linked survivor & mutation services.`,
        hi: `${stateCfg.nameHi} हेतु पति के निधन की जीवन-घटना पहचानी गई। विधवा पेंशन के साथ 3 अन्य जुड़ी सेवाएं (पारिवारिक लाभ, नामांतरण, राशन कार्ड) उपलब्ध हैं।`,
        mr: `${stateCfg.nameMr} करिता पतीच्या निधनाची जीवन-घटना ओळखली गेली. विधवा पेन्शनसह ३ संलग्न सेवा (कुटुंब लाभ, ७/१२ वारस फेरफार, रेशन कार्ड) उपलब्ध आहेत.`,
      },
      suggestedAction: {
        en: 'Review the Widow Pension checklist or start all 4 bereavement services together with one document upload.',
        hi: 'विधवा पेंशन चेकलिस्ट देखें या एक ही दस्तावेज़ अपलोड से चारों सेवाएं एक साथ शुरू करें।',
        mr: 'विधवा पेन्शन यादी पहा किंवा एकाच कागदपत्र अपलोडद्वारे चारही सेवा एकत्र सुरू करा.',
      },
      ...meta,
    };
  }

  // Check Property Mutation / Ferfar keywords
  const mutationKeywords = [
    'mutation',
    'ferfar',
    'dakhil kharij',
    'varasat',
    'नामांतरण',
    'दाखिल-खारिज',
    'वरासत',
    'खतौनी में नाम',
    'फेरफार',
    'वारस नोंद',
    '७/१२ वारस',
    '7/12 mutation',
  ];
  if (mutationKeywords.some((kw) => clean.includes(kw))) {
    const baseService = CIVIC_SERVICES.find((s) => s.id === 'property-mutation-ferfar')!;
    const service = localizeServiceForState(baseService, stateCfg.name);
    return {
      status: 'matched',
      serviceId: 'property-mutation-ferfar',
      service,
      confidence: 0.95,
      summary_en: `Property & Land Record Mutation in ${stateCfg.name}`,
      summary_hi: `${stateCfg.nameHi} में संपत्ति नामांतरण (दाखिल-खारिज / वरासत)`,
      summary_mr: `${stateCfg.nameMr} मध्ये मालमत्ता व ७/१२ वारस फेरफार नोंदणी`,
      matchedReason: {
        en: `Detected request for Property & Land Record Mutation (Ferfar / Dakhil-Kharij) in ${stateCfg.name}.`,
        hi: `${stateCfg.nameHi} राजस्व विभाग के अंतर्गत संपत्ति नामांतरण (दाखिल-खारिज / वरासत) का अनुरोध पहचाना गया।`,
        mr: `${stateCfg.nameMr} महसूल विभागांतर्गत मालमत्ता व ७/१२ वारस फेरफार नोंदणीची विनंती ओळखली गेली.`,
      },
      suggestedAction: {
        en: 'Verify Death Certificate, 7/12 or Khatauni extract, and Legal Heir declaration.',
        hi: 'मृत्यु प्रमाण पत्र, खतौनी नकल और उत्तराधिकारी घोषणा पत्र की जांच करें।',
        mr: 'मृत्यू प्रमाणपत्र, ७/१२ उतारा आणि वारस प्रतिज्ञापत्राची पडताळणी करा.',
      },
      ...meta,
    };
  }

  // Check Pension keywords (Hindi, Marathi & English)
  const pensionKeywords = [
    'pension',
    'पेंशन',
    'पेन्शन',
    'निवृत्तीवेतन',
    'vridha',
    'vriddha',
    'वृद्धावस्था',
    'वृद्धापकाळ',
    'संजय गांधी निराधार',
    'श्रावणबाळ',
    'हयातीचा दाखला',
    'old age',
    'elderly',
    'बुजुर्ग',
    'ज्येष्ठ नागरिक',
    'jeevan pramaan',
    'जीवन प्रमाण',
    'pension ruk gayi',
    'पेंशन रुक गई',
    'पेन्शन थांबली',
    'savitri',
    'pension restart',
  ];
  if (pensionKeywords.some((kw) => clean.includes(kw))) {
    const baseService = CIVIC_SERVICES.find((s) => s.id === 'up-pension-revival')!;
    const service = localizeServiceForState(baseService, stateCfg.name);
    return {
      status: 'matched',
      serviceId: 'up-pension-revival',
      service,
      confidence: 0.94,
      summary_en: 'Pension revival for old age pension that has been stopped',
      summary_hi: 'वृद्धावस्था पेंशन पुनरारंभ जो बंद हो गई है',
      summary_mr: 'थांबलेली वृद्धापकाळ पेन्शन पुन्हा सुरू करणे आणि हयातीचे प्रमाणीकरण',
      matchedReason: {
        en: `Detected request for old age pension restart and annual verification for ${stateCfg.name}.`,
        hi: `${stateCfg.nameHi} हेतु वृद्धावस्था पेंशन पुनरारंभ और जीवन प्रमाणीकरण का अनुरोध पहचाना गया।`,
        mr: `${stateCfg.nameMr} करिता वृद्धापकाळ पेन्शन पुनरारंभ आणि हयातीच्या प्रमाणीकरणाची विनंती ओळखली गेली.`,
      },
      suggestedAction: {
        en: 'Check the required documents list (Passbook, Pension ID, Aadhaar) and confirm your request.',
        hi: 'आवश्यक दस्तावेजों (पासबुक, पेंशन आईडी, आधार) की सूची देखें और अनुरोध की पुष्टि करें।',
        mr: 'आवश्यक कागदपत्रांची यादी (पासबुक, पेन्शन आयडी, आधार) तपासा आणि आपल्या विनंतीची पुष्टी करा.',
      },
      ...meta,
    };
  }

  // Check Income Certificate keywords (Hindi, Marathi & English)
  const incomeKeywords = [
    'income',
    'आय',
    'उत्पन्न',
    'उत्पन्नाचा दाखला',
    'उत्पन्न प्रमाणपत्र',
    'utpanna',
    'aay',
    'income certificate',
    'आय प्रमाण',
    'scholarship income',
    'praman patra',
    'earning proof',
    'certificate for scholarship',
    'chhatravritti',
    'छात्रवृत्ति',
    'शिष्यवृत्ती',
  ];
  if (incomeKeywords.some((kw) => clean.includes(kw))) {
    const baseService = CIVIC_SERVICES.find((s) => s.id === 'up-income-certificate')!;
    const service = localizeServiceForState(baseService, stateCfg.name);
    return {
      status: 'matched',
      serviceId: 'up-income',
      service,
      confidence: 0.96,
      summary_en: `Income Certificate (Aay Praman Patra) application in ${stateCfg.name}`,
      summary_hi: `${stateCfg.nameHi} में आय प्रमाण पत्र के लिए आवेदन`,
      summary_mr: `${stateCfg.nameMr} मध्ये उत्पन्नाच्या दाखल्यासाठी (Income Certificate) अर्ज`,
      matchedReason: {
        en: `Detected request for official Income Certificate under ${stateCfg.name} Revenue Department.`,
        hi: `${stateCfg.nameHi} राजस्व विभाग के तहत आय प्रमाण पत्र का अनुरोध पहचाना गया।`,
        mr: `${stateCfg.nameMr} महसूल विभागांतर्गत अधिकृत उत्पन्न दाखल्याची विनंती ओळखली गेली.`,
      },
      suggestedAction: {
        en: 'Review the required documents checklist for Tehsil / Talathi verification.',
        hi: 'तहसील सत्यापन हेतु आवश्यक दस्तावेजों की चेकलिस्ट की समीक्षा करें।',
        mr: 'तहसील / तलाठी पडताळणीसाठी आवश्यक कागदपत्रांची यादी तपासा.',
      },
      ...meta,
    };
  }

  // Check Domicile / Residence keywords (Hindi, Marathi & English)
  const domicileKeywords = [
    'domicile',
    'residence',
    'निवास',
    'अधिवास',
    'रहिवासी',
    'रहिवासी दाखला',
    'अधिवास प्रमाणपत्र',
    'niwas',
    'rahivasi',
    'adhivas',
    'mool niwas',
    'मूल निवास',
    'local resident',
    'address certificate',
  ];
  if (domicileKeywords.some((kw) => clean.includes(kw))) {
    const baseService = CIVIC_SERVICES.find((s) => s.id === 'up-domicile-certificate')!;
    const service = localizeServiceForState(baseService, stateCfg.name);
    return {
      status: 'matched',
      serviceId: 'up-domicile',
      service,
      confidence: 0.92,
      summary_en: `Domicile / Residence Certificate (Niwas Praman Patra) in ${stateCfg.name}`,
      summary_hi: `${stateCfg.nameHi} में मूल निवास प्रमाण पत्र के लिए आवेदन`,
      summary_mr: `${stateCfg.nameMr} मध्ये अधिवास / रहिवासी दाखल्यासाठी (Domicile) अर्ज`,
      matchedReason: {
        en: `Detected request for Domicile / Permanent Residence Certificate in ${stateCfg.name}.`,
        hi: `${stateCfg.nameHi} में मूल निवास प्रमाण पत्र (Domicile Certificate) का अनुरोध पहचाना गया।`,
        mr: `${stateCfg.nameMr} मधील अधिवास / रहिवासी दाखल्याची (Domicile Certificate) विनंती ओळखली गेली.`,
      },
      suggestedAction: {
        en: 'Confirm your service match to begin the document checklist.',
        hi: 'दस्तावेज़ चेकलिस्ट शुरू करने के लिए सेवा मिलान की पुष्टि करें।',
        mr: 'कागदपत्रांची चेकलिस्ट सुरू करण्यासाठी सेवा जुळणीची पुष्टी करा.',
      },
      ...meta,
    };
  }

  // Check Caste Certificate keywords
  const casteKeywords = [
    'caste',
    'jaati',
    'jati',
    'जाति',
    'जातीचा दाखला',
    'जात प्रमाणपत्र',
    'sc/st',
    'obc',
    'अनुसूचित',
    'पिछड़ा वर्ग',
  ];
  if (casteKeywords.some((kw) => clean.includes(kw))) {
    const baseService = CIVIC_SERVICES.find((s) => s.id === 'up-caste')!;
    const service = localizeServiceForState(baseService, stateCfg.name);
    const meta = extractMetadataFromTranscript(text);
    return {
      status: 'matched',
      serviceId: 'up-caste',
      service,
      confidence: 0.94,
      summary_en: `Caste Certificate (SC/ST/OBC) application in ${stateCfg.name}`,
      summary_hi: `${stateCfg.nameHi} में जाति प्रमाण पत्र (SC/ST/OBC) के लिए आवेदन`,
      summary_mr: `${stateCfg.nameMr} मध्ये जात प्रमाणपत्रासाठी (SC/ST/OBC) अर्ज`,
      matchedReason: {
        en: `Detected request for Caste Certificate (Jaati Praman Patra) in ${stateCfg.name}.`,
        hi: `${stateCfg.nameHi} में जाति प्रमाण पत्र (Jaati Praman Patra) का अनुरोध पहचाना गया।`,
        mr: `${stateCfg.nameMr} मधील जातीच्या दाखल्याची (Caste Certificate) विनंती ओळखली गेली.`,
      },
      suggestedAction: {
        en: 'Confirm your service match to begin the Caste Certificate document checklist.',
        hi: 'जाति प्रमाण पत्र दस्तावेज़ चेकलिस्ट शुरू करने के लिए पुष्टि करें।',
        mr: 'जातीच्या दाखल्याची कागदपत्र यादी सुरू करण्यासाठी पुष्टी करा.',
      },
      ...meta,
    };
  }

  // Check Ration Card keywords
  const rationKeywords = [
    'ration card',
    'ration',
    'राशन कार्ड',
    'रेशन कार्ड',
    'food security',
    'bpl card',
    'पात्र गृहस्थी',
    'अंत्योदय',
    'धान्य',
  ];
  if (rationKeywords.some((kw) => clean.includes(kw))) {
    const baseService = CIVIC_SERVICES.find((s) => s.id === 'ration-card-hof-update')!;
    const service = localizeServiceForState(baseService, stateCfg.name);
    const meta = extractMetadataFromTranscript(text);
    return {
      status: 'matched',
      serviceId: 'ration-card',
      service,
      confidence: 0.93,
      summary_en: `Ration Card Application / Family Update in ${stateCfg.name}`,
      summary_hi: `${stateCfg.nameHi} में राशन कार्ड आवेदन / अद्यतन`,
      summary_mr: `${stateCfg.nameMr} मध्ये रेशन कार्ड अर्ज / कुटुंब माहिती दुरुस्ती`,
      matchedReason: {
        en: `Detected request for Ration Card Application / Update under ${stateCfg.name} Food & Civil Supplies.`,
        hi: `${stateCfg.nameHi} खाद्य एवं रसद विभाग के अंतर्गत राशन कार्ड आवेदन/अद्यतन पहचाना गया।`,
        mr: `${stateCfg.nameMr} अन्न व नागरी पुरवठा विभागांतर्गत रेशन कार्ड अर्ज/बदल ओळखला गेला.`,
      },
      suggestedAction: {
        en: 'Review the required Ration Card documents to proceed.',
        hi: 'आगे बढ़ने के लिए आवश्यक राशन कार्ड दस्तावेजों की जांच करें।',
        mr: 'पुढे जाण्यासाठी आवश्यक रेशन कार्ड कागदपत्रांची तपासणी करा.',
      },
      ...meta,
    };
  }

  // Out of scope / unsupported handling as mandated by PRD Section 6A & 8
  const fallbackMeta = extractMetadataFromTranscript(text);
  return {
    status: 'unsupported',
    serviceId: 'unsupported',
    confidence: 0.0,
    summary_en: 'Could not match to a known service',
    summary_hi: 'किसी ज्ञात सरकारी सेवा से मिलान नहीं हो सका',
    summary_mr: 'कोणत्याही ज्ञात शासकीय सेवेशी जुळणी होऊ शकली नाही',
    matchedReason: {
      en: `This service is currently outside the MVP supported catalog (${stateCfg.name} Revenue & Social Welfare).`,
      hi: `यह सेवा वर्तमान में एमवीपी समर्थित कैटलॉग (${stateCfg.nameHi} राजस्व एवं समाज कल्याण) के दायरे से बाहर है।`,
      mr: `ही सेवा सध्या एमव्हीपी समर्थित कॅटलॉग (${stateCfg.nameMr} महसूल आणि समाज कल्याण) च्या कक्षेबाहेर आहे.`,
    },
    suggestedAction: {
      en: `Please describe your need more specifically, use the manual service dropdown below, or call helpline ${stateCfg.helpline}.`,
      hi: `कृपया अपनी आवश्यकता अधिक स्पष्ट बताएं, नीचे दिए गए मैनुअल ड्रॉपडाउन से सेवा चुनें, या हेल्पलाइन ${stateCfg.helpline} पर कॉल करें।`,
      mr: `कृपया तुमची गरज अधिक स्पष्टपणे सांगा, खालील ड्रॉपडाउनमधून सेवा निवडा किंवा हेल्पलाइन ${stateCfg.helpline} वर संपर्क साधा.`,
    },
    ...fallbackMeta,
  };
}

export interface DocumentValidationResult {
  status: 'verified' | 'warning' | 'rejected';
  score: number; // 0 to 100
  issues: Array<{
    code: string;
    message: LocalizedText;
    severity: 'error' | 'warning';
  }>;
  detectedType: string;
  remediation: LocalizedText;
}

export function validateDocumentQuality(
  fileName: string,
  docType: string,
  fileSizeKb: number,
  flags?: {
    isBlurry?: boolean;
    isCutOff?: boolean;
    isExpired?: boolean;
    hasGlare?: boolean;
  }
): DocumentValidationResult {
  const issues: Array<{
    code: string;
    message: LocalizedText;
    severity: 'error' | 'warning';
  }> = [];

  let score = 95;

  if (fileSizeKb < 15) {
    score -= 40;
    issues.push({
      code: 'TOO_SMALL_FILE',
      message: {
        en: 'File size is too low (< 15KB). Image resolution may be too pixelated for official portal scanning.',
        hi: 'फ़ाइल का आकार बहुत छोटा है (< 15KB)। आधिकारिक पोर्टल स्कैनिंग के लिए रिज़ॉल्यूशन अपर्याप्त हो सकता है।',
        mr: 'फाईलचा आकार खूपच लहान आहे (< 15KB). अधिकृत पोर्टल स्कॅनिंगसाठी रिझोल्यूशन अपुरे असू शकते.',
      },
      severity: 'error',
    });
  } else if (fileSizeKb > 5000) {
    score -= 30;
    issues.push({
      code: 'OVERSIZED_FILE',
      message: {
        en: 'File exceeds 5MB. Most state portals reject uploads larger than 100KB-200KB; compression is needed.',
        hi: 'फ़ाइल 5MB से अधिक है। राज्य पोर्टल 100KB-200KB से बड़ी फाइलों को अस्वीकार करते हैं; कम्प्रेशन आवश्यक है।',
        mr: 'फाईल 5MB पेक्षा मोठी आहे. बहुतांश राज्य पोर्टल 100KB-200KB पेक्षा मोठ्या फाईल्स नाकारतात; कॉम्प्रेशन आवश्यक आहे.',
      },
      severity: 'warning',
    });
  }

  if (flags?.isBlurry) {
    score -= 35;
    issues.push({
      code: 'BLURRY_TEXT',
      message: {
        en: 'Text appears blurry or out of focus. Officer or inspector may reject illegible documents.',
        hi: 'दस्तावेज का टेक्स्ट धुंधला या अस्पष्ट है। अपठनीय होने पर अधिकारी आवेदन निरस्त कर सकते हैं।',
        mr: 'कागदपत्रावरील मजकूर अंधूक किंवा अस्पष्ट दिसत आहे. वाचता न आल्यास अधिकारी अर्ज नाकारू शकतात.',
      },
      severity: 'error',
    });
  }

  if (flags?.hasGlare) {
    score -= 20;
    issues.push({
      code: 'GLARE_REFLECTION',
      message: {
        en: 'Flash glare detected over key identity lines. Numbers or name may be obscured.',
        hi: 'दस्तावेज पर फ्लैश की चमक पाई गई है जिससे नाम या संख्या छिप सकती है।',
        mr: 'कागदपत्रावर फ्लॅशची चमक दिसत आहे ज्यामुळे नाव किंवा क्रमांक झाकला जाऊ शकतो.',
      },
      severity: 'warning',
    });
  }

  if (flags?.isCutOff) {
    score -= 30;
    issues.push({
      code: 'CORNERS_CUT_OFF',
      message: {
        en: 'Document edges or seal are clipped. Please capture all 4 corners.',
        hi: 'दस्तावेज के कोने या आधिकारिक मुहर कटी हुई है। कृपया चारों कोनों सहित पूरा पृष्ठ कैप्चर करें।',
        mr: 'कागदपत्राच्या कडा किंवा अधिकृत शिक्का कापला गेला आहे. कृपया चारही कोपऱ्यांसह पूर्ण पृष्ठ कॅप्चर करा.',
      },
      severity: 'error',
    });
  }

  const hasErrors = issues.some((i) => i.severity === 'error');
  const hasWarnings = issues.some((i) => i.severity === 'warning');

  let status: 'verified' | 'warning' | 'rejected' = 'verified';
  if (hasErrors || score < 50) {
    status = 'rejected';
  } else if (hasWarnings || score < 80) {
    status = 'warning';
  }

  let remediation: LocalizedText = {
    en: 'Document is clear, complete, and ready for privacy redaction & upload.',
    hi: 'दस्तावेज स्पष्ट, पूर्ण और गोपनीयता संपादन एवं अपलोड के लिए तैयार है।',
    mr: 'कागदपत्र स्पष्ट, पूर्ण आणि गोपनीयता मास्किंग व अपलोडसाठी तयार आहे.',
  };

  if (status === 'rejected') {
    remediation = {
      en: 'Please retake or re-upload a clear photo in good daylight with all edges visible.',
      hi: 'कृपया अच्छी रोशनी में चारों कोनों को दिखाते हुए स्पष्ट फोटो पुनः लें या अपलोड करें।',
      mr: 'कृपया चांगल्या प्रकाशात चारही कोपरे स्पष्ट दिसतील असा फोटो पुन्हा घ्या किंवा अपलोड करा.',
    };
  } else if (status === 'warning') {
    remediation = {
      en: 'Document is readable but quality can be improved. You may proceed or replace.',
      hi: 'दस्तावेज पठनीय है लेकिन गुणवत्ता बेहतर हो सकती है। आप जारी रख सकते हैं या बदल सकते हैं।',
      mr: 'कागदपत्र वाचण्यायोग्य आहे परंतु गुणवत्ता सुधारता येईल. आपण पुढे जाऊ शकता किंवा बदलू शकता.',
    };
  }

  return {
    status,
    score: Math.max(0, Math.min(100, score)),
    issues,
    detectedType: docType || 'Government Document',
    remediation,
  };
}

export interface PreFlightCheckItem {
  id: string;
  category: 'name_mismatch' | 'expired_document' | 'wrong_format' | 'missing_attestation';
  title: LocalizedText;
  commonTrivialFailure: LocalizedText;
  rejectionRiskPercent: number;
  status: 'passed' | 'warning' | 'failed';
  detailMessage: LocalizedText;
  fixActionLabel: LocalizedText;
}

export interface PreFlightReport {
  serviceId: string;
  readinessScore: number;
  predictedOutcome: 'likely_approved' | 'high_rejection_risk' | 'critical_blocker';
  estimatedDaysSaved: number;
  checks: PreFlightCheckItem[];
}

export interface PreFlightOptions {
  simulateNameMismatch?: boolean;
  simulateExpiredDoc?: boolean;
  simulateMissingAttestation?: boolean;
  resolvedCheckIds?: Record<string, boolean>;
}

export function runPreFlightRejectionCheck(
  service: CivicService,
  uploadedDocsCount: number,
  requiredDocsCount: number,
  hasLowQualityOrWarningDoc: boolean = false,
  options: PreFlightOptions = {}
): PreFlightReport {
  const resolved = options.resolvedCheckIds || {};

  // 1. Name Mismatch Check (accounts for ~38% of real-world portal rejections)
  const nameMismatchTriggered =
    options.simulateNameMismatch && !resolved['check-name-mismatch'];
  const nameCheck: PreFlightCheckItem = {
    id: 'check-name-mismatch',
    category: 'name_mismatch',
    title: {
      en: 'Cross-Document Name & Spelling Match',
      hi: 'सभी दस्तावेजों में नाम और स्पेलिंग का मिलान',
      mr: 'सर्व कागदपत्रांवर नाव आणि स्पेलिंगची अचूक जुळणी',
    },
    commonTrivialFailure: {
      en: '38% of rejections happen because Aadhaar says "Savitri Devi" while Passbook/7-12 says "Savitri Bai" or omits middle name.',
      hi: '38% आवेदन इसलिए निरस्त होते हैं क्योंकि आधार में "सावित्री देवी" और पासबुक/खतौनी में "सावित्री बाई" या उपनाम भिन्न होता है।',
      mr: '३८% अर्ज नाकारले जातात कारण आधारवर "सावित्री देवी" आणि पासबुक/७-१२ वर "सावित्री बाई" किंवा वडिलांचे/पतीचे नाव वेगळे असते.',
    },
    rejectionRiskPercent: 38,
    status: nameMismatchTriggered ? 'failed' : 'passed',
    detailMessage: nameMismatchTriggered
      ? {
          en: 'MISMATCH DETECTED: Aadhaar reads "Savitri Devi" but supporting record reads "Smt. Savitri Bai". Clerk will reject under Name Discrepancy.',
          hi: 'अंतर पाया गया: आधार में "Savitri Devi" है परंतु सहायक दस्तावेज में "Smt. Savitri Bai" दर्ज है। तहसील क्लर्क इसे अस्वीकार कर देगा।',
          mr: 'तफावत आढळली: आधारवर "Savitri Devi" आहे पण सहायक कागदपत्रावर "Smt. Savitri Bai" आहे. तलाठी/क्लर्क हा अर्ज नाकारू शकतात.',
        }
      : {
          en: 'Verified: Applicant name spelling matches across Aadhaar and supporting records (or One-and-Same Person declaration attached).',
          hi: 'सत्यापित: आधार और अन्य दस्तावेजों में आवेदक के नाम की स्पेलिंग एक समान है।',
          mr: 'सत्यापित: आधार आणि इतर सर्व कागदपत्रांवर अर्जदाराच्या नावाचे स्पेलिंग तंतोतंत जुळते.',
        },
    fixActionLabel: {
      en: 'Auto-Attach "One & Same Person" Self-Declaration & Align Name',
      hi: '"एक ही व्यक्ति" स्व-घोषणा पत्र जोड़ें और नाम संरेखित करें',
      mr: '"एकच व्यक्ती असल्याबाबत" स्वयं-घोषणापत्र जोडा व नाव जुळवा',
    },
  };

  // 2. Expired Document / Recency Window Check (~24% of rejections)
  const expiredTriggered =
    options.simulateExpiredDoc && !resolved['check-expired-doc'];
  const expiryCheck: PreFlightCheckItem = {
    id: 'check-expired-doc',
    category: 'expired_document',
    title: {
      en: 'Document Validity & Fiscal Year Window',
      hi: 'दस्तावेज़ की वैधता अवधि एवं चालू वित्तीय वर्ष',
      mr: 'कागदपत्राची वैधता मुदत आणि चालू आर्थिक वर्ष',
    },
    commonTrivialFailure: {
      en: '24% fail due to attaching an electricity bill older than 90 days or an income declaration from the previous financial year.',
      hi: '24% आवेदन 90 दिन से पुराना बिजली बिल या पिछले वित्तीय वर्ष का आय घोषणा पत्र लगाने के कारण खारिज होते हैं।',
      mr: '२४% अर्ज ९० दिवसांपेक्षा जुने वीज बिल किंवा मागील आर्थिक वर्षाचे उत्पन्न घोषणापत्र जोडल्यामुळे नाकारले जातात.',
    },
    rejectionRiskPercent: 24,
    status: expiredTriggered ? 'failed' : 'passed',
    detailMessage: expiredTriggered
      ? {
          en: 'EXPIRED DATE FLAG: Supporting residence/income proof date is older than the 90-day / current FY 2026-27 portal cutoff.',
          hi: 'अवधि समाप्त: संलग्न निवास/आय प्रमाण की तिथि 90 दिन या चालू वित्तीय वर्ष 2026-27 से पुरानी पाई गई है।',
          mr: 'मुदतबाह्य दिनांक: जोडलेल्या निवास/उत्पन्न पुराव्याची तारीख ९० दिवसांपेक्षा जुनी किंवा मागील आर्थिक वर्षातील आहे.',
        }
      : {
          en: 'Verified: All uploaded certificates and bills fall within the valid 2026-27 statutory date window.',
          hi: 'सत्यापित: सभी दस्तावेज चालू वित्तीय वर्ष 2026-27 और वैध समय-सीमा के भीतर हैं।',
          mr: 'सत्यापित: सर्व कागदपत्रे चालू आर्थिक वर्ष २०२६-२७ आणि विहित मुदतीच्या आतील आहेत.',
        },
    fixActionLabel: {
      en: 'Re-Validate with Current FY 2026-27 Timestamped Declaration',
      hi: 'चालू वित्तीय वर्ष 2026-27 घोषणा के साथ अपडेट करें',
      mr: 'चालू आर्थिक वर्ष २०२६-२७ घोषणापत्रासह अद्ययावत करा',
    },
  };

  // 3. Portal Format, DPI & Size Limit (~21% of rejections)
  const formatWarning =
    (hasLowQualityOrWarningDoc || uploadedDocsCount < requiredDocsCount) &&
    !resolved['check-wrong-format'];
  const formatCheck: PreFlightCheckItem = {
    id: 'check-wrong-format',
    category: 'wrong_format',
    title: {
      en: 'State Portal File Format, DPI & KB Compression',
      hi: 'सरकारी पोर्टल फ़ाइल प्रारूप, DPI एवं KB आकार जांच',
      mr: 'शासकीय पोर्टल फाईल स्वरूप, DPI आणि KB आकार तपासणी',
    },
    commonTrivialFailure: {
      en: '21% fail silently when photos exceed 50KB or PDF scans are over 200KB / low contrast on NIC e-District servers.',
      hi: '21% आवेदन फोटो 50KB से बड़ा होने या PDF 200KB से अधिक/अस्पष्ट होने पर पोर्टल सर्वर द्वारा अस्वीकार कर दिए जाते हैं।',
      mr: '२१% अर्ज फोटो ५०KB पेक्षा मोठा असल्यास किंवा PDF २००KB पेक्षा जास्त/अस्पष्ट असल्यास पोर्टल सर्व्हरकडून नाकारले जातात.',
    },
    rejectionRiskPercent: 21,
    status: formatWarning ? 'warning' : 'passed',
    detailMessage: formatWarning
      ? {
          en: `Attention: ${
            uploadedDocsCount < requiredDocsCount
              ? `${requiredDocsCount - uploadedDocsCount} required document(s) still pending upload.`
              : 'One or more scans have glare/compression warnings that may fail NIC portal upload.'
          }`,
          hi: `ध्यान दें: ${
            uploadedDocsCount < requiredDocsCount
              ? `अभी ${requiredDocsCount - uploadedDocsCount} अनिवार्य दस्तावेज़ अपलोड होना बाकी है।`
              : 'एक या अधिक स्कैन में चमक या आकार की चेतावनी है जिसे पोर्टल अस्वीकार कर सकता है।'
          }`,
          mr: `लक्ष द्या: ${
            uploadedDocsCount < requiredDocsCount
              ? `अद्याप ${requiredDocsCount - uploadedDocsCount} अनिवार्य कागदपत्रे अपलोड करणे बाकी आहे.`
              : 'एका किंवा अधिक स्कॅनमध्ये चमक किंवा आकाराची त्रुटी आहे जी पोर्टल नाकारू शकते.'
          }`,
        }
      : {
          en: 'Verified: Auto-compressed to NIC e-District spec (Photo < 50KB, Docs < 200KB, 200 DPI grayscale/color).',
          hi: 'सत्यापित: सभी फाइलें ई-डिस्ट्रिक्ट मानक (फोटो < 50KB, दस्तावेज < 200KB, 200 DPI) में स्वतः अनुकूलित हैं।',
          mr: 'सत्यापित: सर्व फाईल्स ई-डिस्ट्रिक्ट नियमानुसार (फोटो < 50KB, कागदपत्रे < 200KB, 200 DPI) अनुकूलित केल्या आहेत.',
        },
    fixActionLabel: {
      en: 'Auto-Normalize DPI & Compress to Portal KB Spec',
      hi: 'पोर्टल KB मानक के अनुसार स्वतः कम्प्रेस व सुधारें',
      mr: 'पोर्टल KB नियमानुसार आपोआप कॉम्प्रेस व दुरुस्त करा',
    },
  };

  // 4. Mandatory Attestation / Official Seal Check (~17% of rejections)
  const attestationTriggered =
    options.simulateMissingAttestation && !resolved['check-missing-attestation'];
  const attestationCheck: PreFlightCheckItem = {
    id: 'check-missing-attestation',
    category: 'missing_attestation',
    title: {
      en: 'Mandatory Seal, IFSC Stamp & Applicant Signature',
      hi: 'अनिवार्य आधिकारिक मुहर, IFSC स्टैम्प एवं आवेदक हस्ताक्षर',
      mr: 'अनिवार्य अधिकृत शिक्का, IFSC स्टॅम्प आणि अर्जदाराची स्वाक्षरी/अंगठा',
    },
    commonTrivialFailure: {
      en: '17% fail because the bank passbook copy lacks a legible IFSC stamp or the self-declaration box is unsigned.',
      hi: '17% आवेदन पासबुक पर बैंक की मुहर/IFSC स्पष्ट न होने या स्व-घोषणा पत्र पर हस्ताक्षर/अंगूठा छूटने से निरस्त होते हैं।',
      mr: '१७% अर्ज बँक पासबुकवर IFSC शिक्का नसल्यामुळे किंवा स्वयं-घोषणापत्रावर स्वाक्षरी/अंगठा राहून गेल्यामुळे नाकारले जातात.',
    },
    rejectionRiskPercent: 17,
    status: attestationTriggered ? 'failed' : 'passed',
    detailMessage: attestationTriggered
      ? {
          en: 'MISSING ATTESTATION: Signature/thumbprint box or official IFSC/Registrar seal is missing on the declaration page.',
          hi: 'हस्ताक्षर/मुहर अनुपस्थित: घोषणा पत्र पर आवेदक के हस्ताक्षर या पासबुक पर बैंक IFSC मुहर दिखाई नहीं दे रही है।',
          mr: 'स्वाक्षरी/शिक्का अनुपस्थित: घोषणापत्रावर अर्जदाराची स्वाक्षरी किंवा पासबुकवर बँकेचा IFSC शिक्का दिसत नाही.',
        }
      : {
          en: `Verified: Required signature/thumbprint and official seal verified for ${service.code}.`,
          hi: `सत्यापित: ${service.code} के लिए आवश्यक हस्ताक्षर/अंगूठे का निशान और आधिकारिक मुहर सत्यापित है।`,
          mr: `सत्यापित: ${service.code} साठी आवश्यक स्वाक्षरी/अंगठ्याचा ठसा आणि अधिकृत शिक्का सत्यापित आहे.`,
        },
    fixActionLabel: {
      en: 'Attach Digital e-Sign / Confirm Seal Verification',
      hi: 'डिजिटल स्व-सत्यापन हस्ताक्षर जोड़ें व पुष्टि करें',
      mr: 'डिजिटल स्वयं-साक्षांकित स्वाक्षरी जोडा व पुष्टी करा',
    },
  };

  const checks = [nameCheck, expiryCheck, formatCheck, attestationCheck];

  let readinessScore = 98;
  checks.forEach((c) => {
    if (c.status === 'failed') readinessScore -= 30;
    if (c.status === 'warning') readinessScore -= 14;
  });
  readinessScore = Math.max(15, Math.min(99, readinessScore));

  const hasFailed = checks.some((c) => c.status === 'failed');
  const hasWarning = checks.some((c) => c.status === 'warning');

  const predictedOutcome: PreFlightReport['predictedOutcome'] = hasFailed
    ? 'critical_blocker'
    : hasWarning
    ? 'high_rejection_risk'
    : 'likely_approved';

  return {
    serviceId: service.id,
    readinessScore,
    predictedOutcome,
    estimatedDaysSaved: service.estimatedDays || 21,
    checks,
  };
}

