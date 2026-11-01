/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApplicationCase,
  DigiLockerCaseConsent,
  Language,
  PaperDocumentFallbackRoute,
  RejectionCategory,
  RejectionDetails,
  RejectionRecoveryOption,
  SmsReceipt,
} from '../types/civic';
import { CivicService, LocalizedText, getServicesForState } from './civicCatalog';

export const OFFICIAL_TOLL_FREE_NUMBER = '1800-11-7728';

export const CORE_PRODUCT_PROMISE: LocalizedText = {
  en: 'You can call us, understand your government work, stay in control of your documents, and receive your own official receipt—without paying a middleman.',
  hi: 'आप हमें कॉल कर सकते हैं, अपना सरकारी काम समझ सकते हैं, अपने दस्तावेजों पर पूरा नियंत्रण रख सकते हैं, और बिना किसी बिचौलिए को पैसे दिए अपनी आधिकारिक रसीद पा सकते हैं।',
  mr: 'तुम्ही आम्हाला कॉल करू शकता, तुमचे सरकारी काम समजून घेऊ शकता, तुमच्या कागदपत्रांवर पूर्ण नियंत्रण ठेवू शकता आणि कोणत्याही मध्यस्थाला पैसे न देता तुमची अधिकृत पावती मिळवू शकता.',
};

export interface AccessModelRow {
  id: string;
  need: LocalizedText;
  keypadExperience: LocalizedText;
  systemAction: LocalizedText;
}

export const REVISED_ACCESS_MODEL_ROWS: AccessModelRow[] = [
  {
    id: 'learn',
    need: {
      en: 'Learn about a service',
      hi: 'किसी सरकारी सेवा के बारे में जानें',
      mr: 'शासकीय सेवेबद्दल माहिती घ्या',
    },
    keypadExperience: {
      en: 'The citizen calls the toll-free number and speaks naturally.',
      hi: 'नागरिक टोल-फ्री नंबर पर कॉल करता है और सामान्य भाषा में बात करता है।',
      mr: 'नागरिक टोल-फ्री नंबरवर कॉल करतो आणि नैसर्गिकपणे बोलतो.',
    },
    systemAction: {
      en: 'AI explains the process, eligibility, documents, official fee, and expected time.',
      hi: 'एआई प्रक्रिया, पात्रता, आवश्यक दस्तावेज, सरकारी शुल्क और लगने वाला समय समझाता है।',
      mr: 'एआय प्रक्रिया, पात्रता, आवश्यक कागदपत्रे, अधिकृत शुल्क आणि अपेक्षित वेळ समजावून सांगतो.',
    },
  },
  {
    id: 'start',
    need: {
      en: 'Start application',
      hi: 'नया आवेदन शुरू करें',
      mr: 'नवीन अर्ज सुरू करा',
    },
    keypadExperience: {
      en: 'AI asks short spoken questions and repeats answers.',
      hi: 'एआई छोटे बोलचाल के सवाल पूछता है और उत्तर दोहराकर पुष्टि करता है।',
      mr: 'एआय छोटे तोंडी प्रश्न विचारतो आणि उत्तरे पुन्हा वाचून दाखवतो.',
    },
    systemAction: {
      en: 'Creates a case ID and sends it by SMS.',
      hi: 'एक केस आईडी बनाता है और उसे तुरंत एसएमएस द्वारा भेजता है।',
      mr: 'केस आयडी तयार करतो आणि तो एसएमएसद्वारे पाठवतो.',
    },
  },
  {
    id: 'status',
    need: {
      en: 'Check status of application',
      hi: 'आवेदन की स्थिति जांचें',
      mr: 'अर्जाची सद्यस्थिती तपासा',
    },
    keypadExperience: {
      en: 'Citizen calls, speaks, or enters case ID.',
      hi: 'नागरिक कॉल करता है, बोलता है या कीपैड से केस आईडी दर्ज करता है।',
      mr: 'नागरिक कॉल करतो, बोलतो किंवा कीपॅडवरून केस आयडी टाकतो.',
    },
    systemAction: {
      en: 'Reads official status in their chosen language.',
      hi: 'उनकी चुनी हुई भाषा में आधिकारिक पोर्टल स्थिति पढ़कर सुनाता है।',
      mr: 'त्यांच्या निवडलेल्या भाषेत अधिकृत पोर्टल स्थिती वाचून दाखवतो.',
    },
  },
  {
    id: 'approve',
    need: {
      en: 'Approve submission',
      hi: 'सबमिशन को मंजूरी दें',
      mr: 'अर्ज सादर करण्यास मंजुरी द्या',
    },
    keypadExperience: {
      en: 'AI reads a short summary; the citizen presses 1 to approve.',
      hi: 'एआई संक्षिप्त सारांश पढ़कर सुनाता है; नागरिक मंजूरी के लिए 1 दबाता है।',
      mr: 'एआय संक्षिप्त सारांश वाचून दाखवतो; नागरिक मंजुरीसाठी 1 दाबतो.',
    },
    systemAction: {
      en: 'Records consent and continues portal submission.',
      hi: 'सहमति दर्ज करता है और सरकारी पोर्टल पर सबमिशन आगे बढ़ाता है।',
      mr: 'संमती नोंदवतो आणि शासकीय पोर्टलवर सबमिशन पूर्ण करतो.',
    },
  },
  {
    id: 'rejection',
    need: {
      en: 'Hear the rejection reason',
      hi: 'आवेदन निरस्त होने का कारण सुनें',
      mr: 'अर्ज नाकारण्याचे कारण ऐका',
    },
    keypadExperience: {
      en: 'AI calls/SMSs the citizen, then explains the official reason.',
      hi: 'एआई नागरिक को कॉल/एसएमएस करता है और सरकारी अस्वीकृति का कारण सरल भाषा में समझाता है।',
      mr: 'एआय नागरिकाला कॉल/एसएमएस करतो आणि अर्ज नाकारण्याचे अधिकृत कारण समजावून सांगतो.',
    },
    systemAction: {
      en: 'Creates a correction, appeal, or follow-up path (never auto-resubmits without approval).',
      hi: 'सुधार, अपील या फॉलो-अप का रास्ता बनाता है (बिना अनुमति कभी स्वतः सबमिट नहीं करता)।',
      mr: 'दुरुस्ती, अपील किंवा फॉलो-अपचा मार्ग तयार करतो (संमतीशिवाय कधीही ऑटो-सबमिट करत नाही).',
    },
  },
  {
    id: 'documents',
    need: {
      en: 'Share documents',
      hi: 'दस्तावेज साझा करें',
      mr: 'कागदपत्रे शेअर करा',
    },
    keypadExperience: {
      en: 'DigiLocker where available; otherwise, assisted camera capture.',
      hi: 'उपलब्ध होने पर डिजिलॉकर; अन्यथा परिवार के फोन या ऑडिटेड केंद्र से कैमरा कैप्चर।',
      mr: 'उपलब्ध असल्यास डिजिलॉकर; अन्यथा कुटुंबाच्या स्मार्टफोन किंवा केंद्राद्वारे कॅमेरा कॅप्चर.',
    },
    systemAction: {
      en: 'Collects only case-required documents with per-case, per-document consent.',
      hi: 'प्रत्येक केस और प्रत्येक दस्तावेज की अलग सहमति लेकर केवल आवश्यक दस्तावेज लेता है।',
      mr: 'प्रत्येक केस आणि प्रत्येक कागदपत्राच्या स्वतंत्र संमतीनेच आवश्यक कागदपत्रे घेतो.',
    },
  },
  {
    id: 'followup',
    need: {
      en: 'Follow up with the office',
      hi: 'सरकारी कार्यालय में फॉलो-अप करें',
      mr: 'शासकीय कार्यालयात पाठपुरावा करा',
    },
    keypadExperience: {
      en: 'The citizen approves the exact call purpose by pressing 1.',
      hi: 'नागरिक कॉल के सटीक उद्देश्य को सुनकर 1 दबाकर मंजूरी देता है।',
      mr: 'नागरिक कॉलचा नेमका उद्देश ऐकून 1 दाबून मंजुरी देतो.',
    },
    systemAction: {
      en: 'The voice agent calls the official number and records the outcome.',
      hi: 'वॉयस एजेंट सरकारी नंबर पर कॉल करता है और परिणाम दर्ज कर एसएमएस भेजता है।',
      mr: 'व्हॉइस एजंट अधिकृत नंबरवर कॉल करतो आणि निकाल नोंदवून एसएमएस पाठवतो.',
    },
  },
];

export interface KeypadUtterancePreset {
  id: 'income_start' | 'scholarship_docs' | 'pension_stopped' | 'rejection_reason';
  spokenText: string;
  label: LocalizedText;
  requiresIdentityVerification: boolean;
  requiresCallbackAndPin: boolean;
  requiresDtmfApproval: boolean;
  serviceId: string;
  officialFee: number;
  caseId: string;
  aiSpokenPrompt: LocalizedText;
  aiReadbackFacts: LocalizedText;
  dtmfPrompt: LocalizedText;
}

export const KEYPAD_UTTERANCE_PRESETS: KeypadUtterancePreset[] = [
  {
    id: 'income_start',
    spokenText: 'Mujhe income certificate banana hai.',
    label: {
      en: '“Mujhe income certificate banana hai.” (Start Application)',
      hi: '“मुझे इनकम सर्टिफिकेट (आय प्रमाण पत्र) बनाना है।”',
      mr: '“मला उत्पन्नाचा दाखला (Income Certificate) काढायचा आहे.”',
    },
    requiresIdentityVerification: true,
    requiresCallbackAndPin: true,
    requiresDtmfApproval: true,
    serviceId: 'up-income-certificate',
    officialFee: 15,
    caseId: 'CASE-INC-2026-409',
    aiSpokenPrompt: {
      en: 'You want to apply for an Income Certificate. Official fee is ₹15 and expected time is 15 days. I have verified your registered callback number and 4-digit Case PIN.',
      hi: 'आप आय प्रमाण पत्र बनवाना चाहते हैं। सरकारी शुल्क ₹15 है और समय 15 दिन है। मैंने आपके पंजीकृत नंबर पर कॉलबैक और 4-अंकीय केस पिन सत्यापित कर लिया है।',
      mr: 'तुम्हाला उत्पन्नाचा दाखला काढायचा आहे. अधिकृत शुल्क ₹15 आहे आणि वेळ १५ दिवस आहे. मी तुमचा नोंदणीकृत कॉलबॅक नंबर आणि ४-अंकी केस पिन सत्यापित केला आहे.',
    },
    aiReadbackFacts: {
      en: 'Read-back before saving: Applicant Rameshwar Patil, Service: Income Certificate, Declared Annual Family Income: ₹48,000, Documents needed from DigiLocker: Class 10 certificate and address proof.',
      hi: 'सेव करने से पहले पुष्टि: आवेदक रामेश्वर पाटिल, सेवा: आय प्रमाण पत्र, घोषित वार्षिक आय: ₹48,000, डिजिलॉकर से केवल इस आवेदन हेतु: कक्षा 10 प्रमाण पत्र और निवास प्रमाण।',
      mr: 'जतन करण्यापूर्वी पडताळणी: अर्जदार रामेश्वर पाटील, सेवा: उत्पन्न दाखला, घोषित वार्षिक उत्पन्न: ₹४८,०००, डिजिलॉकरमधून फक्त या अर्जासाठी: इयत्ता १० वी प्रमाणपत्र आणि पत्ता पुरावा.',
    },
    dtmfPrompt: {
      en: 'To apply for this income certificate, we need your Class 10 certificate and address proof. We will request these from DigiLocker only for this application. Press 1 to approve.',
      hi: 'इस आय प्रमाण पत्र के आवेदन के लिए हमें आपका कक्षा 10 प्रमाण पत्र और निवास प्रमाण चाहिए। हम इन्हें डिजिलॉकर से केवल इसी आवेदन के लिए मंगाएंगे। मंजूरी देने के लिए 1 दबाएं।',
      mr: 'या उत्पन्न दाखल्याच्या अर्जासाठी आम्हाला तुमचे इयत्ता १० वी प्रमाणपत्र आणि पत्ता पुरावा हवा आहे. आम्ही हे डिजिलॉकरमधून फक्त या अर्जासाठीच मागवू. मंजुरी देण्यासाठी 1 दाबा.',
    },
  },
  {
    id: 'scholarship_docs',
    spokenText: 'What documents do I need for my scholarship?',
    label: {
      en: '“What documents do I need for my scholarship?” (General Inquiry — No PIN needed)',
      hi: '“छात्रवृत्ति (Scholarship) के लिए मुझे कौन-कौन से दस्तावेज चाहिए?”',
      mr: '“शिष्यवृत्तीसाठी (Scholarship) मला कोणती कागदपत्रे लागतील?”',
    },
    requiresIdentityVerification: false,
    requiresCallbackAndPin: false,
    requiresDtmfApproval: false,
    serviceId: 'up-income-certificate',
    officialFee: 0,
    caseId: 'INFO-SCH-2026-102',
    aiSpokenPrompt: {
      en: 'No identity verification or PIN is needed for general information. For a State Post-Matric Scholarship, you need: (1) Valid Income Certificate, (2) Caste or Domicile Certificate, (3) Class 10/12 Marksheet, and (4) Aadhaar-seeded Bank Passbook. Official application fee on the portal is ₹0 (Free).',
      hi: 'सामान्य जानकारी के लिए किसी पहचान सत्यापन या पिन की आवश्यकता नहीं है। छात्रवृत्ति के लिए आपको केवल 4 दस्तावेज चाहिए: (1) वैध आय प्रमाण पत्र, (2) जाति या निवास प्रमाण पत्र, (3) अंकतालिका (मार्कशीट), और (4) आधार से जुड़ा बैंक पासबुक। सरकारी पोर्टल शुल्क ₹0 (निःशुल्क) है।',
      mr: 'सामान्य माहितीसाठी कोणत्याही ओळख पडताळणीची किंवा पिनची गरज नाही. शिष्यवृत्तीसाठी तुम्हाला ४ कागदपत्रे लागतील: (१) वैध उत्पन्न दाखला, (२) जात किंवा अधिवास प्रमाणपत्र, (३) गुणपत्रिका (मार्कशीट), आणि (४) आधार संलग्न बँक पासबुक. अधिकृत पोर्टल शुल्क ₹० (मोफत) आहे.',
    },
    aiReadbackFacts: {
      en: 'Summary sent via SMS: 4 required documents listed, Official Portal Fee ₹0, Expected processing time 15–21 days.',
      hi: 'एसएमएस द्वारा भेजा गया सारांश: 4 आवश्यक दस्तावेज, सरकारी पोर्टल शुल्क ₹0 (निःशुल्क), अनुमानित समय 15–21 दिन।',
      mr: 'एसएमएसद्वारे पाठवलेला सारांश: ४ आवश्यक कागदपत्रे, अधिकृत पोर्टल शुल्क ₹० (मोफत), अपेक्षित वेळ १५–२१ दिवस.',
    },
    dtmfPrompt: {
      en: 'Press 1 to receive this document checklist and ₹0 fee notice by SMS.',
      hi: 'यह दस्तावेज सूची और ₹0 शुल्क की जानकारी एसएमएस पर पाने के लिए 1 दबाएं।',
      mr: 'ही कागदपत्र यादी आणि ₹० शुल्काची माहिती एसएमएसवर मिळवण्यासाठी 1 दाबा.',
    },
  },
  {
    id: 'pension_stopped',
    spokenText: 'My pension stopped. What happened?',
    label: {
      en: '“My pension stopped. What happened?” (Check Status & Approve Follow-up)',
      hi: '“मेरी पेंशन बंद हो गई है। क्या हुआ?”',
      mr: '“माझी पेन्शन थांबली आहे. काय झाले?”',
    },
    requiresIdentityVerification: true,
    requiresCallbackAndPin: true,
    requiresDtmfApproval: true,
    serviceId: 'up-pension-revival',
    officialFee: 0,
    caseId: 'UP-SSPY-2026-78419',
    aiSpokenPrompt: {
      en: 'After verifying your registered mobile callback and 4-digit Case PIN, I checked the Social Welfare Portal for Case UP-SSPY-2026-78419 (Savitri Devi). Your pension is paused only because annual life verification (Jeevan Pramaan e-KYC) is pending. Official fee is ₹0.',
      hi: 'आपके पंजीकृत मोबाइल कॉलबैक और 4-अंकीय केस पिन की पुष्टि के बाद मैंने समाज कल्याण पोर्टल पर केस UP-SSPY-2026-78419 (सावित्री देवी) की जांच की। आपकी पेंशन केवल वार्षिक जीवन प्रमाण (ई-केवाईसी) बाकी होने के कारण रुकी है। सरकारी शुल्क ₹0 है।',
      mr: 'तुमचा नोंदणीकृत मोबाईल कॉलबॅक आणि ४-अंकी केस पिन तपासल्यानंतर मी समाज कल्याण पोर्टलवर केस UP-SSPY-2026-78419 (सावित्री देवी) तपासली. वार्षिक हयातीचा दाखला (ई-केवायसी) प्रलंबित असल्यामुळेच तुमची पेन्शन थांबली आहे. शासकीय शुल्क ₹० आहे.',
    },
    aiReadbackFacts: {
      en: 'Read-back: Case ID UP-SSPY-2026-78419, Applicant: Savitri Devi, Stage: Aadhaar e-KYC Pending, Official Fee: ₹0. Never speak Aadhaar or OTP aloud.',
      hi: 'पुष्टि: केस आईडी UP-SSPY-2026-78419, आवेदक: सावित्री देवी, स्थिति: वार्षिक जीवन प्रमाण लंबित, सरकारी शुल्क: ₹0। कभी भी फोन पर आधार नंबर या ओटीपी बोलकर न बताएं।',
      mr: 'पडताळणी: केस आयडी UP-SSPY-2026-78419, अर्जदार: सावित्री देवी, स्थिती: हयातीचा दाखला प्रलंबित, शासकीय शुल्क: ₹०. कधीही फोनवर आधार क्रमांक किंवा ओटीपी बोलून सांगू नका.',
    },
    dtmfPrompt: {
      en: 'I will call the District Office to ask for the status of application UP-SSPY-2026-78419. I will share your name, application number, and submission date. Press 1 to approve.',
      hi: 'मैं आवेदन संख्या UP-SSPY-2026-78419 की स्थिति पूछने के लिए जिला कार्यालय में कॉल करूंगा। मैं केवल आपका नाम, आवेदन संख्या और जमा करने की तारीख साझा करूंगा। मंजूरी देने के लिए 1 दबाएं।',
      mr: 'अर्ज क्रमांक UP-SSPY-2026-78419 ची स्थिती विचारण्यासाठी मी जिल्हा कार्यालयात कॉल करेन. मी फक्त तुमचे नाव, अर्ज क्रमांक आणि अर्ज सादर केल्याची तारीख शेअर करेन. मंजुरी देण्यासाठी 1 दाबा.',
    },
  },
  {
    id: 'rejection_reason',
    spokenText: 'Tell me why my application was rejected.',
    label: {
      en: '“Tell me why my application was rejected.” (Hear Rejection & Prepare Correction)',
      hi: '“मुझे बताएं कि मेरा आवेदन क्यों खारिज (रिजेक्ट) हुआ?”',
      mr: '“माझा अर्ज का नाकारला गेला (रिजेक्ट झाला) ते मला सांगा.”',
    },
    requiresIdentityVerification: true,
    requiresCallbackAndPin: true,
    requiresDtmfApproval: true,
    serviceId: 'up-income-certificate',
    officialFee: 15,
    caseId: 'MH-APLS-2026-55104',
    aiSpokenPrompt: {
      en: 'Your application MH-APLS-2026-55104 was rejected. The official reason is: income proof missing and the address proof is older than the allowed 90-day period. This does not mean you are permanently ineligible.',
      hi: 'आपका आवेदन MH-APLS-2026-55104 अस्वीकार (रिजेक्ट) हुआ है। सरकारी कारण है: आय प्रमाण संलग्न नहीं था और निवास प्रमाण (बिजली बिल) निर्धारित 90 दिनों से पुराना है। इसका यह अर्थ बिल्कुल नहीं है कि आप स्थायी रूप से अपात्र हैं।',
      mr: 'तुमचा अर्ज MH-APLS-2026-55104 नाकारला गेला आहे. अधिकृत कारण आहे: उत्पन्नाचा पुरावा जोडलेला नाही आणि पत्त्याचा पुरावा विहित ९० दिवसांपेक्षा जुना आहे. याचा अर्थ असा नाही की तुम्ही कायमस्वरूपी अपात्र आहात.',
    },
    aiReadbackFacts: {
      en: 'I can prepare the correction by attaching your current FY 2026-27 income declaration and recent ration card. I will not submit it until you approve.',
      hi: 'मैं चालू वित्तीय वर्ष 2026-27 का आय घोषणा पत्र और राशन कार्ड जोड़कर सुधार तैयार कर सकता हूँ। जब तक आप मंजूरी नहीं देंगे, मैं इसे सबमिट नहीं करूंगा।',
      mr: 'मी चालू आर्थिक वर्ष २०२६-२७ चे उत्पन्न घोषणापत्र आणि रेशन कार्ड जोडून दुरुस्ती तयार करू शकतो. जोपर्यंत तुम्ही मंजुरी देत नाही तोपर्यंत मी ते सबमिट करणार नाही.',
    },
    dtmfPrompt: {
      en: 'I can prepare the correction. I will not submit it until you approve. Press 1 to approve preparing and submitting the corrected application.',
      hi: 'मैं सुधार तैयार कर सकता हूँ। आपकी मंजूरी के बिना मैं इसे सबमिट नहीं करूंगा। सुधार तैयार करने और सबमिट करने की अनुमति देने के लिए 1 दबाएं।',
      mr: 'मी दुरुस्ती तयार करू शकतो. तुमच्या संमतीशिवाय मी ते सबमिट करणार नाही. दुरुस्तीला मंजुरी देण्यासाठी 1 दाबा.',
    },
  },
];

export function mapDtmfDigitToLanguage(digit: string): Language | null {
  if (digit === '1') return 'hi';
  if (digit === '2') return 'mr';
  if (digit === '3') return 'en';
  return null;
}

export function matchKeypadUtterance(input: string): KeypadUtterancePreset {
  const clean = (input || '').toLowerCase();
  if (
    clean.includes('reject') ||
    clean.includes('खारिज') ||
    clean.includes('निरस्त') ||
    clean.includes('नाकार') ||
    clean.includes('रिजेक्ट')
  ) {
    return KEYPAD_UTTERANCE_PRESETS.find((p) => p.id === 'rejection_reason')!;
  }
  if (
    clean.includes('scholarship') ||
    clean.includes('what documents') ||
    clean.includes('छात्रवृत्ति') ||
    clean.includes('शिष्यवृत्ती')
  ) {
    return KEYPAD_UTTERANCE_PRESETS.find((p) => p.id === 'scholarship_docs')!;
  }
  if (
    clean.includes('pension') ||
    clean.includes('पेंशन') ||
    clean.includes('पेन्शन') ||
    clean.includes('stopped')
  ) {
    return KEYPAD_UTTERANCE_PRESETS.find((p) => p.id === 'pension_stopped')!;
  }
  return KEYPAD_UTTERANCE_PRESETS.find((p) => p.id === 'income_start')!;
}

export function createSmsReceipt(params: {
  caseId: string;
  recipientPhoneMasked?: string;
  serviceName: LocalizedText;
  stage: LocalizedText;
  officialFee: number;
  triggerType: SmsReceipt['triggerType'];
}): SmsReceipt {
  const phone = params.recipientPhoneMasked || '+91 98*** **312';
  const feeEn = params.officialFee === 0 ? '₹0 (Free)' : `₹${params.officialFee}`;
  const feeHi = params.officialFee === 0 ? '₹0 (निःशुल्क)' : `₹${params.officialFee}`;
  const feeMr = params.officialFee === 0 ? '₹0 (मोफत)' : `₹${params.officialFee}`;

  return {
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    caseId: params.caseId,
    recipientPhoneMasked: phone,
    serviceName: params.serviceName,
    stage: params.stage,
    officialFee: params.officialFee,
    callbackNumber: OFFICIAL_TOLL_FREE_NUMBER,
    timestamp: new Date().toISOString(),
    triggerType: params.triggerType,
    messageBody: {
      en: `[Pratinidhi Official Receipt] Case ID: ${params.caseId} | Service: ${params.serviceName.en} | Stage: ${params.stage.en} | Official Fee: ${feeEn} (Pay ₹0 to middlemen) | Toll-Free Callback: ${OFFICIAL_TOLL_FREE_NUMBER}`,
      hi: `[प्रतिनिधि आधिकारिक रसीद] केस आईडी: ${params.caseId} | सेवा: ${params.serviceName.hi} | स्थिति: ${params.stage.hi} | सरकारी शुल्क: ${feeHi} (किसी बिचौलिए को नकद न दें) | टोल-फ्री नंबर: ${OFFICIAL_TOLL_FREE_NUMBER}`,
      mr: `[प्रतिनिधी अधिकृत पावती] केस आयडी: ${params.caseId} | सेवा: ${params.serviceName.mr} | स्थिती: ${params.stage.mr} | शासकीय शुल्क: ${feeMr} (दलालांना पैसे देऊ नका) | टोल-फ्री क्र.: ${OFFICIAL_TOLL_FREE_NUMBER}`,
    },
  };
}

export function buildDigiLockerCaseConsent(
  service: CivicService,
  caseId: string,
  approvedViaDtmfOrSms: boolean = false
): DigiLockerCaseConsent {
  const docNames = service.documents
    .filter((d) => d.category === 'required')
    .slice(0, 2)
    .map((d) => d.name);

  const firstDocEn = docNames[0]?.en || 'Class 10 certificate';
  const secondDocEn = docNames[1]?.en || 'address proof';
  const firstDocHi = docNames[0]?.hi || 'कक्षा 10 प्रमाण पत्र';
  const secondDocHi = docNames[1]?.hi || 'निवास प्रमाण';
  const firstDocMr = docNames[0]?.mr || 'इयत्ता १० वी प्रमाणपत्र';
  const secondDocMr = docNames[1]?.mr || 'पत्ता पुरावा';

  return {
    caseId,
    serviceId: service.id,
    requestedDocuments: [
      {
        en: 'Class 10 Certificate / Marksheet',
        hi: 'कक्षा 10 प्रमाण पत्र / अंकतालिका',
        mr: 'इयत्ता १० वी प्रमाणपत्र / गुणपत्रिका',
      },
      {
        en: 'Address Proof (Ration Card / Domicile)',
        hi: 'निवास प्रमाण (राशन कार्ड / मूल निवास)',
        mr: 'पत्ता पुरावा (रेशन कार्ड / अधिवास)',
      },
      ...docNames,
    ].slice(0, 2),
    consentPrompt: {
      en: `To apply for this ${service.name.en}, we need your Class 10 certificate and address proof (${firstDocEn}, ${secondDocEn}). We will request these from DigiLocker only for this application (${caseId}). Press 1 to approve.`,
      hi: `इस ${service.name.hi} के लिए हमें आपका कक्षा 10 प्रमाण पत्र और निवास प्रमाण (${firstDocHi}, ${secondDocHi}) चाहिए। हम इन्हें डिजिलॉकर से केवल इसी आवेदन (${caseId}) के लिए मंगाएंगे। मंजूरी देने के लिए 1 दबाएं।`,
      mr: `या ${service.name.mr} साठी आम्हाला तुमचे इयत्ता १० वी प्रमाणपत्र आणि पत्ता पुरावा (${firstDocMr}, ${secondDocMr}) हवा आहे. आम्ही हे डिजिलॉकरमधून फक्त या अर्जासाठीच (${caseId}) मागवू. मंजुरी देण्यासाठी 1 दाबा.`,
    },
    approvedViaDtmfOrSms,
    approvedAt: approvedViaDtmfOrSms ? new Date().toISOString() : undefined,
    scopeNote: {
      en: 'Link once; consent per case and per document. No blanket authorization for all documents forever.',
      hi: 'एक बार लिंक करें; प्रत्येक केस और प्रत्येक दस्तावेज के लिए अलग सहमति। कभी भी सभी दस्तावेजों के लिए स्थायी अनुमति नहीं ली जाती।',
      mr: 'एकदाच लिंक करा; प्रत्येक केस आणि प्रत्येक कागदपत्रासाठी स्वतंत्र संमती. सर्व कागदपत्रांसाठी कधीही एकत्रित कायमची परवानगी घेतली जात नाही.',
    },
  };
}

export interface PaperFallbackOptionInfo {
  id: PaperDocumentFallbackRoute;
  title: LocalizedText;
  description: LocalizedText;
  zeroDiscretionGuardrail: LocalizedText;
}

export const PAPER_DOCUMENT_FALLBACK_ROUTES: PaperFallbackOptionInfo[] = [
  {
    id: 'family_smartphone_link',
    title: {
      en: '1. Family Member’s Smartphone Companion Link',
      hi: '1. परिवार के सदस्य के स्मार्टफोन पर कम्पैनियन लिंक',
      mr: '१. कुटुंबातील सदस्याच्या स्मार्टफोनवर कम्पॅनियन लिंक',
    },
    description: {
      en: 'Send a one-time case-scoped camera link by SMS so a son, daughter, or trusted relative can photograph the paper certificate.',
      hi: 'एसएमएस द्वारा केवल इस केस के लिए कैमरा लिंक भेजें ताकि परिवार का कोई सदस्य कागजी प्रमाण पत्र की फोटो खींच सके।',
      mr: 'एसएमएसद्वारे फक्त या केसपुरती कॅमेरा लिंक पाठवा जेणेकरून कुटुंबातील सदस्य कागदी दाखल्याचा फोटो काढू शकेल.',
    },
    zeroDiscretionGuardrail: {
      en: 'Companion uploader can only attach the requested document; final approval and receipt remain on the citizen’s phone.',
      hi: 'सहायक केवल मांगा गया दस्तावेज अपलोड कर सकता है; अंतिम मंजूरी और रसीद नागरिक के फोन पर ही आएगी।',
      mr: 'मदतनीस फक्त मागितलेले कागदपत्र अपलोड करू शकतो; अंतिम मंजुरी आणि पावती नागरिकाच्याच फोनवर येईल.',
    },
  },
  {
    id: 'self_service_kiosk',
    title: {
      en: '2. Self-Service Document Camera Kiosk',
      hi: '2. स्व-सेवा (Self-Service) डॉक्यूमेंट कैमरा कियोस्क',
      mr: '२. सेल्फ-सर्व्हिस डॉक्युमेंट कॅमेरा कियोस्क',
    },
    description: {
      en: 'Place the paper certificate under the fixed overhead scanner at a Panchayat or ward kiosk using your Case ID.',
      hi: 'पंचायत या वार्ड कियोस्क पर अपनी केस आईडी डालकर कागजी दस्तावेज को फिक्स्ड स्कैनर के नीचे रखें।',
      mr: 'ग्रामपंचायत किंवा वॉर्ड कियोस्कवर तुमचा केस आयडी टाकून कागदी दाखला स्कॅनरखाली ठेवा.',
    },
    zeroDiscretionGuardrail: {
      en: 'Zero local file retention; image is encrypted directly to your Case ID and auto-wiped from kiosk memory.',
      hi: 'कियोस्क में कोई कॉपी सेव नहीं होती; फोटो सीधे आपके केस आईडी में जुड़कर कियोस्क से तुरंत मिट जाती है।',
      mr: 'कियोस्कवर कोणतीही प्रत साठवली जात नाही; फोटो थेट केस आयडीला जोडून कियोस्कमधून लगेच डिलीट होतो.',
    },
  },
  {
    id: 'scheduled_field_capture',
    title: {
      en: '3. Scheduled Audited Field Capture Device',
      hi: '3. ऑडिटेड ग्राम/मोहल्ला फील्ड कैप्चर डिवाइस',
      mr: '३. ऑडिटेड क्षेत्रीय (Field) कॅप्चर डिव्हाइस',
    },
    description: {
      en: 'Request an audited community facilitator with a locked capture device during weekly camp hours.',
      hi: 'साप्ताहिक शिविर में लॉक किए गए सरकारी टैबलेट वाले ऑडिटेड सहायक से दस्तावेज स्कैन करवाएं।',
      mr: 'साप्ताहिक शिबिरात लॉक केलेल्या डिव्हाइससह ऑडिटेड सहाय्यकाकडून कागदपत्र स्कॅन करून घ्या.',
    },
    zeroDiscretionGuardrail: {
      en: 'Field operator cannot alter eligibility answers, cannot receive OTPs, and cannot charge cash.',
      hi: 'फील्ड सहायक पात्रता के उत्तर नहीं बदल सकता, ओटीपी नहीं ले सकता और नकद पैसे नहीं मांग सकता।',
      mr: 'क्षेत्रीय सहाय्यक पात्रतेची उत्तरे बदलू शकत नाही, ओटीपी घेऊ शकत नाही आणि पैसे मागू शकत नाही.',
    },
  },
  {
    id: 'in_person_office_verification',
    title: {
      en: '4. In-Person Government Verification Route',
      hi: '4. तहसील / सरकारी कार्यालय में प्रत्यक्ष दस्तावेज सत्यापन',
      mr: '४. तहसील / शासकीय कार्यालयात प्रत्यक्ष कागदपत्र पडताळणी',
    },
    description: {
      en: 'Book a token via voice call to show your original paper document directly at the Tehsil / Setu counter.',
      hi: 'कॉल के माध्यम से टोकन बुक करें और अपना मूल कागजी दस्तावेज सीधे तहसील खिड़की पर दिखाएं।',
      mr: 'कॉलद्वारे टोकन बुक करा आणि तुमचे मूळ कागदपत्र थेट तहसील/सेतू खिडकीवर दाखवा.',
    },
    zeroDiscretionGuardrail: {
      en: 'SMS token carries your Case ID and official ₹0 / ₹15 fee so no middleman outside the office can intercept you.',
      hi: 'एसएमएस टोकन में केस आईडी और सरकारी शुल्क लिखा होता है ताकि कार्यालय के बाहर कोई दलाल गुमराह न कर सके।',
      mr: 'एसएमएस टोकनवर केस आयडी आणि अधिकृत शुल्क असते जेणेकरून कार्यालयाबाहेरील दलाल फसवणूक करू शकणार नाहीत.',
    },
  },
];

export const ZERO_DISCRETION_HELPER_RULES: LocalizedText[] = [
  {
    en: 'Cannot alter the citizen’s spoken eligibility answers',
    hi: 'नागरिक द्वारा बोले गए पात्रता उत्तरों को बदल नहीं सकता',
    mr: 'नागरिकाने दिलेली पात्रतेची उत्तरे बदलू शकत नाही',
  },
  {
    en: 'Cannot approve final portal submissions (only the citizen’s phone/DTMF can approve)',
    hi: 'फाइनल सबमिशन को मंजूरी नहीं दे सकता (केवल नागरिक अपने फोन से 1 दबाकर मंजूरी देगा)',
    mr: 'अंतिम सबमिशनला मंजुरी देऊ शकत नाही (फक्त नागरिक स्वतःच्या फोनवरून मंजुरी देईल)',
  },
  {
    en: 'Cannot receive or view citizen OTPs, Aadhaar numbers, or Case PINs',
    hi: 'नागरिक का ओटीपी, आधार नंबर या केस पिन प्राप्त नहीं कर सकता और न देख सकता है',
    mr: 'नागरिकाचा ओटीपी, आधार क्रमांक किंवा केस पिन पाहू किंवा मिळवू शकत नाही',
  },
  {
    en: 'Cannot keep local document copies on the helper phone or kiosk',
    hi: 'अपने फोन या कियोस्क पर दस्तावेजों की कोई प्रति सेव नहीं रख सकता',
    mr: 'मदतनीसाच्या फोनवर किंवा कियोस्कवर कागदपत्रांची प्रत साठवून ठेवता येत नाही',
  },
  {
    en: 'Official acknowledgement receipt and SMS always go directly to the citizen’s mobile number',
    hi: 'आधिकारिक पावती क्रमांक और रसीद हमेशा सीधे नागरिक के मोबाइल पर ही एसएमएस से जाएगी',
    mr: 'अधिकृत पोचपावती क्रमांक आणि एसएमएस नेहमी थेट नागरिकाच्याच मोबाईल नंबरवर जातो',
  },
];

export function classifyPortalRejection(
  rawPortalMessage: string,
  portalCode: string = 'REJ-EDIST-402'
): RejectionDetails {
  const clean = (rawPortalMessage || '').toLowerCase();

  let category: RejectionCategory = 'missing_document';
  let categoryLabel: LocalizedText = {
    en: '1. Missing Document',
    hi: '1. आवश्यक दस्तावेज़ अनुपस्थित (Missing Document)',
    mr: '१. आवश्यक कागदपत्र जोडलेले नाही (Missing Document)',
  };
  let specificIssue: LocalizedText = {
    en: 'Income proof missing or supporting annexure was not attached.',
    hi: 'आय प्रमाण (वेतन पर्ची / खतौनी / स्व-घोषणा) संलग्न नहीं पाया गया।',
    mr: 'उत्पन्नाचा पुरावा (पगार स्लिप / ७-१२ / घोषणापत्र) जोडलेला आढळला नाही.',
  };

  if (
    clean.includes('older than') ||
    clean.includes('expired') ||
    clean.includes('all pages were not captured') ||
    clean.includes('unreadable') ||
    clean.includes('blurry') ||
    clean.includes('invalid')
  ) {
    category = 'unreadable_document';
    categoryLabel = {
      en: '2. Unreadable or Invalid Document',
      hi: '2. अस्पष्ट या अवधि-समाप्त दस्तावेज़ (Unreadable / Invalid Document)',
      mr: '२. अस्पष्ट किंवा मुदतबाह्य कागदपत्र (Unreadable / Invalid Document)',
    };
    specificIssue = {
      en: 'The address proof is older than the allowed 90-day period, or all pages were not captured clearly.',
      hi: 'निवास प्रमाण निर्धारित 90 दिनों की अवधि से पुराना है, अथवा दस्तावेज़ के सभी पृष्ठ स्पष्ट रूप से कैप्चर नहीं हुए हैं।',
      mr: 'पत्त्याचा पुरावा विहित ९० दिवसांच्या मुदतीपेक्षा जुना आहे किंवा कागदपत्राची सर्व पाने स्पष्टपणे टिपली गेली नाहीत.',
    };
  } else if (
    clean.includes('mismatch') ||
    clean.includes('spelling') ||
    clean.includes('form detail') ||
    clean.includes('tehsil')
  ) {
    category = 'incorrect_form_detail';
    categoryLabel = {
      en: '3. Incorrect Form Detail',
      hi: '3. फॉर्म के विवरण में त्रुटि (Incorrect Form Detail)',
      mr: '३. अर्जातील तपशिलात चूक (Incorrect Form Detail)',
    };
    specificIssue = {
      en: 'Name spelling or village/tehsil code in the form did not match the supporting identity card.',
      hi: 'फॉर्म में दर्ज नाम की स्पेलिंग या ग्राम/तहसील कोड पहचान पत्र से मेल नहीं खाता।',
      mr: 'अर्जातील नावाचे स्पेलिंग किंवा गाव/तालुका कोड ओळखपत्राशी जुळला नाही.',
    };
  } else if (
    clean.includes('ineligible') ||
    clean.includes('threshold') ||
    clean.includes('criteria') ||
    clean.includes('age')
  ) {
    category = 'eligibility_issue';
    categoryLabel = {
      en: '4. Eligibility Criterion Issue',
      hi: '4. पात्रता मानदंड संबंधित समस्या (Eligibility Issue)',
      mr: '४. पात्रता निकषाशी संबंधित अडचण (Eligibility Issue)',
    };
    specificIssue = {
      en: 'Declared income or age category requires verification under a different scheme or statutory appeal.',
      hi: 'घोषित आय या आयु वर्ग के लिए किसी अन्य योजना या वैधानिक अपील की आवश्यकता है।',
      mr: 'घोषित उत्पन्न किंवा वयोगटासाठी वेगळ्या योजनेची किंवा अधिकृत अपीलाची आवश्यकता आहे.',
    };
  } else if (
    clean.includes('deadline') ||
    clean.includes('time barred') ||
    clean.includes('expired window')
  ) {
    category = 'missed_deadline';
    categoryLabel = {
      en: '6. Missed Verification Deadline',
      hi: '6. सत्यापन की समय-सीमा समाप्त (Missed Deadline)',
      mr: '६. पडताळणीची मुदत संपली (Missed Deadline)',
    };
    specificIssue = {
      en: 'Local verification window lapsed before the document query was answered.',
      hi: 'दस्तावेज़ स्पष्टीकरण की समय-सीमा समाप्त होने के कारण आवेदन बंद हुआ।',
      mr: 'कागदपत्र पूर्ततेची मुदत संपल्यामुळे अर्ज बंद करण्यात आला.',
    };
  } else if (
    clean.includes('code') ||
    clean.includes('system') ||
    clean.includes('unspecified') ||
    clean.includes('unclear')
  ) {
    category = 'unclear_portal_message';
    categoryLabel = {
      en: '5. Unclear Portal Message',
      hi: '5. अस्पष्ट पोर्टल संदेश (Unclear Portal Message)',
      mr: '५. अस्पष्ट पोर्टल संदेश (Unclear Portal Message)',
    };
    specificIssue = {
      en: 'The portal returned a generic clerk code without specifying which attachment failed.',
      hi: 'पोर्टल ने बिना स्पष्ट कारण बताए केवल तकनीकी अस्वीकृति कोड भेजा है।',
      mr: 'पोर्टलने नेमके कारण न देता फक्त तांत्रिक रिजेक्शन कोड पाठवला आहे.',
    };
  }

  return {
    portalRejectionCode: portalCode,
    officialReason: {
      en: `Your application was rejected. The official reason is: ${rawPortalMessage}.`,
      hi: `आपका आवेदन अस्वीकृत (रिजेक्ट) हुआ है। सरकारी कारण है: ${rawPortalMessage}।`,
      mr: `तुमचा अर्ज नाकारण्यात आला आहे. अधिकृत कारण आहे: ${rawPortalMessage}.`,
    },
    category,
    categoryLabel,
    reassuranceMessage: {
      en: 'This does not mean you are permanently ineligible. Most government applications fail on fixable document trivia.',
      hi: 'इसका यह अर्थ बिल्कुल नहीं है कि आप स्थायी रूप से अपात्र हैं। अधिकांश सरकारी आवेदन छोटी दस्तावेज़ी कमियों से रुकते हैं जिन्हें सुधारा जा सकता है।',
      mr: 'याचा अर्थ असा नाही की तुम्ही कायमस्वरूपी अपात्र आहात. बहुतांश शासकीय अर्ज दुरुस्त करता येण्यासारख्या किरकोळ कागदपत्र त्रुटींमुळे नाकारले जातात.',
    },
    nonAutoResubmitPledge: {
      en: 'I can prepare the correction. I will not submit it until you approve.',
      hi: 'मैं सुधार तैयार कर सकता हूँ। जब तक आप मंजूरी नहीं देंगे, मैं इसे सबमिट नहीं करूंगा।',
      mr: 'मी दुरुस्ती तयार करू शकतो. जोपर्यंत तुम्ही मंजुरी देत नाही तोपर्यंत मी ते सबमिट करणार नाही.',
    },
    specificDocumentOrFieldIssue: specificIssue,
    validNextSteps: [
      {
        id: 'upload_replacement',
        label: {
          en: 'Provide Replacement Document (DigiLocker or Assisted Camera)',
          hi: 'नया/सही दस्तावेज़ दें (डिजिलॉकर या कैमरा लिंक से)',
          mr: 'नवीन/योग्य कागदपत्र द्या (डिजिलॉकर किंवा कॅमेरा लिंकद्वारे)',
        },
        description: {
          en: 'Fetch current FY income/address proof from DigiLocker or capture all pages clearly.',
          hi: 'डिजिलॉकर से नया प्रमाण मंगाएं या सभी पृष्ठों की स्पष्ट फोटो जोड़ें।',
          mr: 'डिजिलॉकरमधून नवीन पुरावा घ्या किंवा सर्व पानांचा स्पष्ट फोटो जोडा.',
        },
        requiresFreshCitizenApproval: true,
      },
      {
        id: 'correct_and_resubmit',
        label: {
          en: 'Correct Form Detail & Resubmit Application',
          hi: 'त्रुटि सुधारें और आवेदन पुनः सबमिट करें',
          mr: 'तपशील दुरुस्त करा आणि अर्ज पुन्हा सादर करा',
        },
        description: {
          en: 'Align name spelling / annexure and submit after your Press-1 confirmation.',
          hi: 'नाम व संलग्नक सुधारकर आपकी 1-दबाकर दी गई सहमति के बाद पुनः जमा करें।',
          mr: 'नाव व जोडपत्र दुरुस्त करून तुमच्या संमतीनंतर पुन्हा सादर करा.',
        },
        requiresFreshCitizenApproval: true,
      },
      {
        id: 'approve_followup_call',
        label: {
          en: 'Approve Voice Agent Call to District Office',
          hi: 'जिला कार्यालय में वॉयस एजेंट कॉल को मंजूरी दें',
          mr: 'जिल्हा कार्यालयात व्हॉइस एजंट कॉलला मंजुरी द्या',
        },
        description: {
          en: 'Agent calls the verifying officer to clarify the exact objection on your case ID.',
          hi: 'एजेंट संबंधित अधिकारी को कॉल करके आपके केस पर लगी आपत्ति का सटीक समाधान पूछेगा।',
          mr: 'एजंट संबंधित अधिकाऱ्याला कॉल करून तुमच्या अर्जावरील आक्षेपाचे नेमके कारण विचारेल.',
        },
        requiresFreshCitizenApproval: true,
      },
      {
        id: 'submit_official_appeal',
        label: {
          en: 'Prepare First Appellate Authority Appeal (Right to Public Services Act)',
          hi: 'लोक सेवा गारंटी अधिनियम के तहत प्रथम अपील तैयार करें',
          mr: 'लोकसेवा हक्क कायद्यांतर्गत (RTS) प्रथम अपील तयार करा',
        },
        description: {
          en: 'Where permitted by state RTS rules, file an appeal to the Tehsildar / SDO.',
          hi: 'तहसीलदार / एसडीएम के समक्ष आधिकारिक अपील तैयार करें (आपकी अनुमति के बाद ही सबमिट)।',
          mr: 'तहसीलदार / उपविभागीय अधिकाऱ्यांकडे अधिकृत अपील तयार करा (तुमच्या मंजुरीनंतरच सादर).',
        },
        requiresFreshCitizenApproval: true,
      },
      {
        id: 'request_human_support',
        label: {
          en: 'Request Human Helpline / Ombudsman Escalation',
          hi: 'मानव सहायता / राज्य हेल्पलाइन से जुड़ें',
          mr: 'मानवी सहाय्य / अधिकृत हेल्पलाइनशी संपर्क साधा',
        },
        description: {
          en: 'Hand off your case packet and SMS receipt to a verified human caseworker.',
          hi: 'अपने केस विवरण और एसएमएस रसीद के साथ सत्यापित मानव सहायक से बात करें।',
          mr: 'तुमच्या केस तपशीलासह अधिकृत मानवी सहाय्यकाशी संवाद साधा.',
        },
        requiresFreshCitizenApproval: true,
      },
    ],
    citizenApprovedCorrection: false,
  };
}

export function applyRejectionCorrectionWithConsent(
  application: ApplicationCase,
  recoveryOption: RejectionRecoveryOption,
  citizenExplicitlyApproved: boolean
): {
  updatedApplication: ApplicationCase;
  smsReceipt: SmsReceipt | null;
  blockedReason?: string;
} {
  if (!citizenExplicitlyApproved) {
    return {
      updatedApplication: application,
      smsReceipt: null,
      blockedReason:
        'BLOCKED_NO_CITIZEN_CONSENT: Rejected applications are never auto-resubmitted without fresh citizen approval.',
    };
  }

  const nowIso = new Date().toISOString();
  const stageText: LocalizedText = {
    en: `Correction Approved & Resubmitted (${recoveryOption.replace(/_/g, ' ')})`,
    hi: 'नागरिक की नई सहमति से सुधार सबमिट किया गया',
    mr: 'नागरिकाच्या नवीन संमतीने दुरुस्तीसह अर्ज पुन्हा सादर केला',
  };

  const sms = createSmsReceipt({
    caseId: application.acknowledgementNumber || application.id,
    recipientPhoneMasked: application.phoneMasked,
    serviceName: application.serviceName,
    stage: stageText,
    officialFee: application.officialFee ?? 15,
    triggerType: 'correction_approved',
  });

  const updatedApp: ApplicationCase = {
    ...application,
    status: 'in_progress',
    officialStatusText: stageText,
    plainExplanation: {
      en: 'You approved the correction via Press 1 / Consent confirmation. Replacement income & address proof were attached and resubmitted. Official SMS receipt sent.',
      hi: 'आपने 1 दबाकर सुधार को मंजूरी दी। नया आय व निवास प्रमाण जोड़कर आवेदन पुनः सबमिट कर दिया गया है और आपको एसएमएस रसीद भेज दी गई है।',
      mr: 'तुम्ही 1 दाबून दुरुस्तीस मंजुरी दिली. नवीन उत्पन्न आणि पत्ता पुरावा जोडून अर्ज पुन्हा सादर केला आहे आणि तुम्हाला एसएमएस पावती पाठवली आहे.',
    },
    lastCheckedAt: nowIso,
    nextActionDate: '2026-11-12 (Resubmitted SLA)',
    urgency: 'normal',
    rejectionDetails: application.rejectionDetails
      ? {
          ...application.rejectionDetails,
          citizenApprovedCorrection: true,
          selectedRecoveryOption: recoveryOption,
          approvedAt: nowIso,
        }
      : undefined,
    smsReceipts: [sms, ...(application.smsReceipts || [])],
    auditTrail: [
      {
        id: `aud-rej-fix-${Date.now()}`,
        timestamp: nowIso,
        action: 'REJECTION_CORRECTION_APPROVED_BY_CITIZEN',
        actor: 'citizen',
        details: `Citizen explicitly approved rejection recovery (${recoveryOption}). Application resubmitted; SMS receipt ${sms.id} dispatched.`,
      },
      ...application.auditTrail,
    ],
  };

  return {
    updatedApplication: updatedApp,
    smsReceipt: sms,
  };
}

export function buildPreCallOfficeConsentPrompt(application: ApplicationCase): LocalizedText {
  const ack = application.acknowledgementNumber || application.id;
  const subDate = application.submittedAt
    ? application.submittedAt.slice(0, 10)
    : '2026-09-15';

  return {
    en: `I will call the District Office to ask for the status of application ${ack}. I will share your name (${application.applicantName}), application number (${ack}), and submission date (${subDate}). Press 1 to approve.`,
    hi: `मैं आवेदन संख्या ${ack} की स्थिति पूछने के लिए जिला कार्यालय में कॉल करूंगा। मैं केवल आपका नाम (${application.applicantName}), आवेदन संख्या (${ack}) और जमा करने की तारीख (${subDate}) साझा करूंगा। मंजूरी देने के लिए 1 दबाएं।`,
    mr: `अर्ज क्रमांक ${ack} ची स्थिती विचारण्यासाठी मी जिल्हा कार्यालयात कॉल करेन. मी फक्त तुमचे नाव (${application.applicantName}), अर्ज क्रमांक (${ack}) आणि अर्ज सादर केल्याची तारीख (${subDate}) शेअर करेन. मंजुरी देण्यासाठी 1 दाबा.`,
  };
}

export const AI_CALL_SAFEGUARD_RULES: LocalizedText[] = [
  {
    en: 'Identifies itself clearly as an automated civic assistant calling with the citizen’s recorded approval.',
    hi: 'स्पष्ट बताता है कि यह नागरिक की दर्ज सहमति से कॉल करने वाला स्वचालित जनसेवा सहायक (Automated Assistant) है।',
    mr: 'स्पष्टपणे सांगतो की हा नागरिकाच्या नोंदणीकृत संमतीने कॉल करणारा स्वयंचलित नागरी सहाय्यक आहे.',
  },
  {
    en: 'Never impersonates the citizen or a government official.',
    hi: 'कभी भी स्वयं को नागरिक या सरकारी अधिकारी बताकर बात नहीं करता।',
    mr: 'कधीही स्वतःला नागरिक किंवा शासकीय अधिकारी भासवत नाही.',
  },
  {
    en: 'Shares only the case fields the citizen explicitly approved (Name, Acknowledgement No., Submission Date).',
    hi: 'केवल वही जानकारी साझा करता है जिसकी नागरिक ने अनुमति दी है (नाम, पावती संख्या, आवेदन तिथि)।',
    mr: 'नागरिकाने मंजुरी दिलेलीच माहिती शेअर करतो (नाव, पोचपावती क्रमांक, अर्जाची तारीख).',
  },
  {
    en: 'Immediately stops and alerts the citizen if asked for any unofficial payment, bribe, OTP, or password.',
    hi: 'यदि कोई अनौपचारिक शुल्क, रिश्वत, ओटीपी या पासवर्ड मांगा जाए तो कॉल तुरंत रोक देता है और नागरिक को सूचित करता है।',
    mr: 'कोणत्याही अनधिकृत पैशांची, लाचेची, ओटीपी किंवा पासवर्डची मागणी केल्यास कॉल तात्काळ थांबवतो.',
  },
  {
    en: 'Complies with TRAI rules against unsolicited robo-calls — only places citizen-consented service calls and callbacks.',
    hi: 'TRAI (ट्राई) नियमों का पूर्ण पालन — कोई अनचाहा रोबो-कॉल नहीं; केवल नागरिक द्वारा अनुमत सेवा कॉल और कॉलबैक।',
    mr: 'TRAI नियमांचे पूर्ण पालन — कोणतेही अनावश्यक रोबो-कॉल नाहीत; फक्त नागरिकाच्या संमतीने सेवा कॉल.',
  },
];
