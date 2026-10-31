/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LocalizedText {
  en: string;
  hi: string;
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
  service?: CivicService;
  confidence: number;
  matchedReason: LocalizedText;
  suggestedAction: LocalizedText;
}

export const CIVIC_SERVICES: CivicService[] = [
  {
    id: 'up-income-certificate',
    code: 'UP-EDIST-INC-01',
    name: {
      en: 'Income Certificate (आय प्रमाण पत्र)',
      hi: 'आय प्रमाण पत्र (Income Certificate)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Revenue Department, Government of Uttar Pradesh',
      hi: 'राजस्व विभाग, उत्तर प्रदेश सरकार',
    },
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    officialFee: 15,
    estimatedDays: 15,
    description: {
      en: 'Official revenue document verifying the total annual income of the applicant or family for educational scholarships, welfare schemes, and subsidies.',
      hi: 'छात्रवृत्ति, सरकारी कल्याणकारी योजनाओं और रियायतों के लिए आवेदक या परिवार की कुल वार्षिक आय प्रमाणित करने वाला आधिकारिक राजस्व प्रमाण पत्र।',
    },
    eligibility: [
      {
        id: 'residency',
        label: {
          en: 'Must be a permanent resident of Uttar Pradesh',
          hi: 'उत्तर प्रदेश का स्थायी निवासी होना आवश्यक है',
        },
        mandatory: true,
      },
      {
        id: 'valid_family_id',
        label: {
          en: 'Possesses a Ration Card or Family ID (Parivar Register)',
          hi: 'राशन कार्ड या परिवार रजिस्टर की प्रति उपलब्ध होनी चाहिए',
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
        },
        category: 'required',
        whyNeeded: {
          en: 'Required by the revenue inspector to verify the applicant identity against local records. Aadhaar number is masked; only last 4 digits are shared.',
          hi: 'राजस्व निरीक्षक द्वारा स्थानीय रिकॉर्ड से पहचान सत्यापन हेतु आवश्यक। आधार संख्या को छिपाया जाता है, केवल अंतिम 4 अंक साझा होते हैं।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Automatic local redaction of first 8 digits of Aadhaar before portal submission.',
          hi: 'पोर्टल पर सबमिट करने से पहले आधार के पहले 8 अंकों को स्वचालित रूप से छिपा दिया जाता है।',
        },
        examples: ['Aadhaar Card (front & back)', 'Voter ID Card'],
      },
      {
        id: 'doc-residence',
        name: {
          en: 'Residence Proof (Ration Card or Electricity Bill)',
          hi: 'निवास प्रमाण (राशन कार्ड या बिजली बिल)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Used by the Patwari/Lekhpal to establish tehsil and village jurisdiction for physical verification.',
          hi: 'पटवारी/लेखपाल द्वारा भौतिक सत्यापन हेतु तहसील और ग्राम अधिकार क्षेत्र निर्धारित करने के लिए।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Only address and head of family name are accessed. Account details are excluded.',
          hi: 'केवल पता और परिवार के मुखिया का नाम देखा जाता है। बैंक/खाता विवरण नहीं लिया जाता।',
        },
        examples: ['Ration Card copy', 'Recent Electricity Bill (< 3 months)'],
      },
      {
        id: 'doc-income-proof',
        name: {
          en: 'Income Declaration / Salary Slip / Land Record',
          hi: 'आय स्व-घोषणा / वेतन पर्ची / खतौनी',
        },
        category: 'required',
        whyNeeded: {
          en: 'Primary evidence of declared monthly/annual income across agricultural, wage, or business earnings.',
          hi: 'कृषि, मजदूरी या व्यवसाय से प्राप्त मासिक/वार्षिक आय का प्राथमिक साक्ष्य।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Strictly limited to the current fiscal year. No permanent storage on third-party servers.',
          hi: 'वर्तमान वित्तीय वर्ष तक सीमित। किसी तृतीय पक्ष सर्वर पर स्थायी रूप से संग्रहित नहीं।',
        },
        examples: ['Salary Certificate from employer', 'Self-declaration form signed by village head/councillor'],
      },
      {
        id: 'doc-photo',
        name: {
          en: 'Passport Size Photograph',
          hi: 'पासपोर्ट आकार का फोटो',
        },
        category: 'required',
        whyNeeded: {
          en: 'Printed directly on the finalized digitally signed certificate.',
          hi: 'डिजिटल रूप से हस्ताक्षरित प्रमाण पत्र पर मुद्रित करने के लिए।',
        },
        acceptedTypes: ['image/jpeg', 'image/png'],
        privacyRedactionNotes: {
          en: 'Used exclusively for portal image attachment; max 50KB as per portal specification.',
          hi: 'केवल पोर्टल अटैचमेंट के लिए प्रयुक्त; पोर्टल दिशानिर्देश के अनुसार अधिकतम 50KB।',
        },
        examples: ['Clear front-facing color photo'],
      },
      {
        id: 'doc-previous-cert',
        name: {
          en: 'Expired or Previous Income Certificate (if renewal)',
          hi: 'पुराना आय प्रमाण पत्र (यदि नवीनीकरण हो)',
        },
        category: 'optional',
        whyNeeded: {
          en: 'Speeds up verification by Lekhpal if a previous certificate number is on record.',
          hi: 'यदि पिछला प्रमाण पत्र क्रमांक उपलब्ध हो तो लेखपाल द्वारा सत्यापन में तेजी आती है।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Optional attachment only to reference prior application ID.',
          hi: 'केवल पूर्व आवेदन संदर्भ के लिए वैकल्पिक।',
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
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Social Welfare Department, Government of Uttar Pradesh',
      hi: 'समाज कल्याण विभाग, उत्तर प्रदेश सरकार',
    },
    portalName: 'UP Social Welfare Pension Portal (sspy-up.gov.in)',
    portalUrl: 'https://sspy-up.gov.in',
    officialFee: 0,
    estimatedDays: 21,
    description: {
      en: 'Assists senior citizens whose pension was halted due to pending annual Aadhaar biometric e-KYC or unverified bank account mapping.',
      hi: 'उन वरिष्ठ नागरिकों की सहायता जिनकी पेंशन वार्षिक आधार ई-केवाईसी या बैंक खाता मैपिंग लंबित होने के कारण रुक गई है।',
    },
    eligibility: [
      {
        id: 'age',
        label: {
          en: 'Citizen age 60 years or above (as per birth certificate or voter card)',
          hi: 'नागरिक की आयु 60 वर्ष या उससे अधिक होनी चाहिए',
        },
        mandatory: true,
      },
      {
        id: 'bpl_or_income',
        label: {
          en: 'Annual family income below ₹46,080 (rural) or ₹56,460 (urban)',
          hi: 'वार्षिक पारिवारिक आय ग्रामीण क्षेत्र में ₹46,080 या शहरी क्षेत्र में ₹56,460 से कम हो',
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
        },
        category: 'required',
        whyNeeded: {
          en: 'To verify the DBT bank account and IFSC code where monthly pension disbursement is transferred.',
          hi: 'उस डीबीटी बैंक खाते और आईएफएससी कोड के सत्यापन हेतु जहां मासिक पेंशन भेजी जाती है।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Account balance and non-related transaction history are kept private; only account number and IFSC are captured.',
          hi: 'खाते का शेष बैलेंस या अन्य लेन-देन निजी रखे जाते हैं; केवल खाता संख्या और IFSC देखा जाता है।',
        },
        examples: ['First page of nationalized bank passbook'],
      },
      {
        id: 'doc-pension-id',
        name: {
          en: 'Pension Registration Number or Previous PPO Slip',
          hi: 'पेंशन पंजीकरण संख्या या पूर्व पीपीओ पर्ची',
        },
        category: 'required',
        whyNeeded: {
          en: 'Identifies the stalled 12-digit pension application record on the SSPY portal.',
          hi: 'एसएसपीवाई पोर्टल पर रुकी हुई 12-अंकीय पेंशन आवेदन संख्या खोजने के लिए।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Used exclusively for portal look-up with the district social welfare office.',
          hi: 'केवल जिला समाज कल्याण अधिकारी के रिकॉर्ड में खोजने के लिए।',
        },
        examples: ['Pension sanction order', 'Old passbook pension entry'],
      },
      {
        id: 'doc-aadhaar',
        name: {
          en: 'Aadhaar Card (Linked with Mobile for e-KYC)',
          hi: 'आधार कार्ड (ई-केवाईसी हेतु मोबाइल से जुड़ा)',
        },
        category: 'required',
        whyNeeded: {
          en: 'Government mandate for annual Jeevan Pramaan / biometric alive verification.',
          hi: 'वार्षिक जीवन प्रमाण और आधार सत्यापन के लिए सरकारी नियम के तहत आवश्यक।',
        },
        acceptedTypes: ['image/jpeg', 'image/png'],
        privacyRedactionNotes: {
          en: 'Only verified against portal with citizen live OTP confirmation. No biometric storage.',
          hi: 'नागरिक की लाइव ओटीपी पुष्टि के साथ ही उपयोग। कोई बायोमेट्रिक डेटा स्टोर नहीं होता।',
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
      en: 'Domicile / Residence Certificate (मूल निवास प्रमाण पत्र)',
      hi: 'मूल निवास प्रमाण पत्र (Domicile Certificate)',
    },
    state: 'Uttar Pradesh',
    department: {
      en: 'Revenue Department, Government of Uttar Pradesh',
      hi: 'राजस्व विभाग, उत्तर प्रदेश सरकार',
    },
    portalName: 'e-District Uttar Pradesh (edistrict.up.gov.in)',
    portalUrl: 'https://edistrict.up.gov.in',
    officialFee: 15,
    estimatedDays: 20,
    description: {
      en: 'Proof of permanent residency in Uttar Pradesh for educational admissions, government recruitments, and local reservation.',
      hi: 'शैक्षणिक प्रवेश, सरकारी नौकरियों और राज्य आरक्षण हेतु उत्तर प्रदेश के स्थायी निवास का आधिकारिक प्रमाण।',
    },
    eligibility: [
      {
        id: 'continuous_stay',
        label: {
          en: 'Citizen has resided in Uttar Pradesh continuously for at least 3 years or was born in UP',
          hi: 'नागरिक कम से कम 3 वर्षों से उत्तर प्रदेश में रह रहा हो या जन्म उत्तर प्रदेश में हुआ हो',
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
        },
        category: 'required',
        whyNeeded: {
          en: 'Verifies the citizen identity.',
          hi: 'नागरिक की पहचान सुनिश्चित करने के लिए।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'First 8 digits masked.',
          hi: 'प्रथम 8 अंक सुरक्षित रूप से छिपाए गए।',
        },
        examples: ['Aadhaar Card'],
      },
      {
        id: 'doc-school-or-birth',
        name: {
          en: 'Educational Certificate or Birth Certificate in UP',
          hi: 'उत्तर प्रदेश में शिक्षा प्रमाण पत्र या जन्म प्रमाण पत्र',
        },
        category: 'required',
        whyNeeded: {
          en: 'Validates duration of residency within the state borders.',
          hi: 'राज्य में निवास की अवधि का प्रमाण स्थापित करने के लिए।',
        },
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        privacyRedactionNotes: {
          en: 'Used solely for residency tenure verification.',
          hi: 'केवल निवास अवधि सत्यापन हेतु प्रयुक्त।',
        },
        examples: ['Class 10th or 12th marksheet issued in UP', 'Birth Certificate'],
      },
      {
        id: 'doc-photo',
        name: {
          en: 'Passport Size Photograph',
          hi: 'पासपोर्ट आकार का फोटो',
        },
        category: 'required',
        whyNeeded: {
          en: 'Printed onto the finalized domicile certificate.',
          hi: 'जारी किए जाने वाले प्रमाण पत्र पर मुद्रित करने के लिए।',
        },
        acceptedTypes: ['image/jpeg', 'image/png'],
        privacyRedactionNotes: {
          en: 'Portal attachment.',
          hi: 'पोर्टल अटैचमेंट।',
        },
        examples: ['Color passport photo'],
      },
    ],
    isMvpSupported: true,
  },
];

export function classifyCitizenIntent(
  text: string,
  state: string = 'Uttar Pradesh'
): IntentClassificationResult {
  const clean = text.trim().toLowerCase();

  if (!clean || clean.length < 3) {
    return {
      status: 'needs_clarification',
      confidence: 0,
      matchedReason: {
        en: 'The request is too brief to identify a specific government service.',
        hi: 'अनुरोध बहुत संक्षिप्त है, किसी विशिष्ट सरकारी सेवा की पहचान नहीं हो सकी।',
      },
      suggestedAction: {
        en: 'Please speak or describe what document or welfare benefit you need.',
        hi: 'कृपया बोलकर या लिखकर बताएं कि आपको किस दस्तावेज या सरकारी योजना की आवश्यकता है।',
      },
    };
  }

  // Check Pension keywords (Hindi & English)
  const pensionKeywords = [
    'pension',
    'पेंशन',
    'vridha',
    'vriddha',
    'वृद्धावस्था',
    'old age',
    'elderly',
    'बुजुर्ग',
    'jeevan pramaan',
    'जीवन प्रमाण',
    'pension ruk gayi',
    'पेंशन रुक गई',
    'savitri',
    'pension restart',
  ];
  if (pensionKeywords.some((kw) => clean.includes(kw))) {
    const service = CIVIC_SERVICES.find((s) => s.id === 'up-pension-revival')!;
    return {
      status: 'matched',
      service,
      confidence: 0.94,
      matchedReason: {
        en: 'Detected request for old age pension restart and annual verification for Uttar Pradesh.',
        hi: 'उत्तर प्रदेश हेतु वृद्धावस्था पेंशन पुनरारंभ और जीवन प्रमाणीकरण का अनुरोध पहचाना गया।',
      },
      suggestedAction: {
        en: 'Check the required documents list (Passbook, Pension ID, Aadhaar) and confirm your request.',
        hi: 'आवश्यक दस्तावेजों (पासबुक, पेंशन आईडी, आधार) की सूची देखें और अनुरोध की पुष्टि करें।',
      },
    };
  }

  // Check Income Certificate keywords
  const incomeKeywords = [
    'income',
    'आय',
    'aay',
    'income certificate',
    'आय प्रमाण',
    'scholarship income',
    'praman patra',
    'earning proof',
    'certificate for scholarship',
    'chhatravritti',
    'छात्रवृत्ति',
  ];
  if (incomeKeywords.some((kw) => clean.includes(kw))) {
    const service = CIVIC_SERVICES.find((s) => s.id === 'up-income-certificate')!;
    return {
      status: 'matched',
      service,
      confidence: 0.96,
      matchedReason: {
        en: 'Detected request for official Income Certificate under UP Revenue Department.',
        hi: 'उत्तर प्रदेश राजस्व विभाग के तहत आय प्रमाण पत्र का अनुरोध पहचाना गया।',
      },
      suggestedAction: {
        en: 'Review the required documents checklist for Tehsil verification.',
        hi: 'तहसील सत्यापन हेतु आवश्यक दस्तावेजों की चेकलिस्ट की समीक्षा करें।',
      },
    };
  }

  // Check Domicile / Residence keywords
  const domicileKeywords = [
    'domicile',
    'residence',
    'निवास',
    'niwas',
    'mool niwas',
    'मूल निवास',
    'local resident',
    'address certificate',
  ];
  if (domicileKeywords.some((kw) => clean.includes(kw))) {
    const service = CIVIC_SERVICES.find((s) => s.id === 'up-domicile-certificate')!;
    return {
      status: 'matched',
      service,
      confidence: 0.92,
      matchedReason: {
        en: 'Detected request for Domicile / Permanent Residence Certificate.',
        hi: 'मूल निवास प्रमाण पत्र (Domicile Certificate) का अनुरोध पहचाना गया।',
      },
      suggestedAction: {
        en: 'Confirm your service match to begin the document checklist.',
        hi: 'दस्तावेज़ चेकलिस्ट शुरू करने के लिए सेवा मिलान की पुष्टि करें।',
      },
    };
  }

  // Out of scope / unsupported handling as mandated by PRD Section 6A & 8
  return {
    status: 'unsupported',
    confidence: 0.4,
    matchedReason: {
      en: 'This service is currently outside the MVP supported catalog (Uttar Pradesh Revenue & Social Welfare).',
      hi: 'यह सेवा वर्तमान में एमवीपी समर्थित कैटलॉग (उत्तर प्रदेश राजस्व एवं समाज कल्याण) के दायरे से बाहर है।',
    },
    suggestedAction: {
      en: 'Visit the National Portal of India (india.gov.in) or call the citizen helpline 1800-180-5145.',
      hi: 'कृपया भारत के राष्ट्रीय पोर्टल (india.gov.in) पर जाएं या नागरिक हेल्पलाइन 1800-180-5145 पर संपर्क करें।',
    },
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
      },
      severity: 'warning',
    });
  }

  if (flags?.isBlurry) {
    score -= 35;
    issues.push({
      code: 'BLURRY_TEXT',
      message: {
        en: 'Text appears blurry or out of focus. Lekhpal or inspector may reject illegible documents.',
        hi: 'दस्तावेज का टेक्स्ट धुंधला या अस्पष्ट है। अपठनीय होने पर अधिकारी आवेदन निरस्त कर सकते हैं।',
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
  };

  if (status === 'rejected') {
    remediation = {
      en: 'Please retake or re-upload a clear photo in good daylight with all edges visible.',
      hi: 'कृपया अच्छी रोशनी में चारों कोनों को दिखाते हुए स्पष्ट फोटो पुनः लें या अपलोड करें।',
    };
  } else if (status === 'warning') {
    remediation = {
      en: 'Document is readable but quality can be improved. You may proceed or replace.',
      hi: 'दस्तावेज पठनीय है लेकिन गुणवत्ता बेहतर हो सकती है। आप जारी रख सकते हैं या बदल सकते हैं।',
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
