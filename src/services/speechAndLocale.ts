/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types/civic';
import { getStateConfig } from './civicCatalog';

/**
 * Returns the localized name of an Indian State or Union Territory
 * in English ('en'), Hindi ('hi'), or Marathi ('mr').
 */
export function getLocalizedStateName(stateName: string, language: Language): string {
  if (!stateName) return '';
  const cfg = getStateConfig(stateName);
  if (cfg.name.toLowerCase() === stateName.toLowerCase() || cfg.id.toLowerCase() === stateName.toLowerCase()) {
    if (language === 'hi') return cfg.nameHi;
    if (language === 'mr') return cfg.nameMr;
    return cfg.name;
  }
  return stateName;
}

/**
 * Translates citizen emotional state strings into Hindi and Marathi.
 */
export function localizeEmotionalState(emotionalState: string | undefined, language: Language): string {
  if (!emotionalState) {
    return language === 'hi' ? 'शांत / सामान्य पूछताछ' : language === 'mr' ? 'शांत / सामान्य चौकशी' : 'Calm / Inquiry';
  }
  const lower = emotionalState.toLowerCase();
  if (lower.includes('grieving') || lower.includes('bereavement') || lower.includes('vulnerable')) {
    return language === 'hi'
      ? 'शोकाकुल / संवेदनशील (परिवार में निधन)'
      : language === 'mr'
      ? 'शोकाकुल / संवेदनशील (कुटुंबात निधन)'
      : 'Grieving / Vulnerable (Bereavement)';
  }
  if (lower.includes('distressed') || lower.includes('anxious') || lower.includes('halted')) {
    return language === 'hi'
      ? 'चिंतित / परेशान (पेंशन/लाभ रुका हुआ)'
      : language === 'mr'
      ? 'चिंतित / त्रस्त (पेन्शन/लाभ थांबलेला)'
      : 'Distressed / Anxious (Benefit Halted)';
  }
  if (lower.includes('time-sensitive') || lower.includes('student') || lower.includes('deadline')) {
    return language === 'hi'
      ? 'समय-संवेदनशील (छात्रवृत्ति अंतिम तिथि)'
      : language === 'mr'
      ? 'वेळ-संवेदनशील (शिष्यवृत्ती अंतिम मुदत)'
      : 'Time-Sensitive (Student Deadline)';
  }
  if (lower.includes('calm') || lower.includes('inquiry')) {
    return language === 'hi'
      ? 'शांत / सामान्य पूछताछ'
      : language === 'mr'
      ? 'शांत / सामान्य चौकशी'
      : 'Calm / Inquiry';
  }
  return emotionalState;
}

/**
 * Translates extracted or seeded document names into Hindi and Marathi.
 */
export function localizeDocumentName(docName: string, language: Language): string {
  if (language === 'en') return docName;
  const lower = docName.toLowerCase();

  if (lower.includes('bank passbook') && lower.includes('sbi')) {
    return language === 'hi' ? 'बैंक पासबुक (SBI मुरादाबाद)' : 'बँक पासबुक (SBI मुरादाबाद)';
  }
  if (lower.includes('old pension sanction') || lower.includes('ppo')) {
    return language === 'hi' ? 'पूर्व पेंशन स्वीकृति आदेश (PPO)' : 'जुना पेन्शन मंजुरी आदेश (PPO)';
  }
  if (lower.includes('aadhaar card copy')) {
    return language === 'hi' ? 'आधार कार्ड की प्रति (मास्क्ड)' : 'आधार कार्डची प्रत (मास्क केलेली)';
  }
  if (lower.includes('aadhaar')) {
    return language === 'hi' ? 'आधार कार्ड' : 'आधार कार्ड';
  }
  if (lower.includes('passbook') || lower.includes('bank')) {
    return language === 'hi' ? 'बैंक पासबुक' : 'बँक पासबुक';
  }
  if (lower.includes('death certificate')) {
    return language === 'hi' ? 'मृत्यु प्रमाण पत्र' : 'मृत्यू प्रमाणपत्र';
  }
  if (lower.includes('ration card')) {
    return language === 'hi' ? 'राशन कार्ड' : 'रेशन कार्ड';
  }
  if (lower.includes('marksheet') || lower.includes('class 10')) {
    return language === 'hi' ? 'कक्षा 10वीं बोर्ड अंकपत्र / मार्कशीट' : 'इयत्ता १०वी बोर्ड गुणपत्रिका';
  }
  if (lower.includes('land record') || lower.includes('7/12') || lower.includes('khatauni')) {
    return language === 'hi' ? 'भूमि रिकॉर्ड (खतौनी / 7/12)' : 'जमीन महसूल उतारा (७/१२ / फेरफार)';
  }
  return docName;
}

/**
 * Translates nextActionDate strings into Hindi and Marathi.
 */
export function localizeNextActionDate(nextActionDate: string | undefined, language: Language): string {
  if (!nextActionDate) {
    return language === 'hi' ? 'शीघ्र सत्यापन' : language === 'mr' ? 'लवकरच पडताळणी' : 'Pending verification';
  }
  if (language === 'en') return nextActionDate;

  if (nextActionDate.includes('Immediate')) {
    return language === 'hi'
      ? 'तत्काल — नागरिक पुष्टि आवश्यक'
      : 'तातडीने — नागरिकाची पुष्टी आवश्यक';
  }
  if (nextActionDate.includes('Published SLA')) {
    const datePart = nextActionDate.split(' (')[0];
    return language === 'hi'
      ? `${datePart} (निर्धारित समय-सीमा / SLA)`
      : `${datePart} (निश्चित कालावधी / SLA)`;
  }
  if (nextActionDate.includes('days SLA')) {
    const num = nextActionDate.replace(/[^0-9]/g, '') || '15';
    return language === 'hi' ? `${num} कार्य दिवस (SLA)` : `${num} कामाचे दिवस (SLA)`;
  }
  return nextActionDate;
}

/**
 * Translates audit trail action codes and details into Hindi and Marathi.
 */
export function localizeAuditEntry(
  action: string,
  details: string,
  language: Language
): { actionLabel: string; detailsLabel: string } {
  if (language === 'en') {
    return { actionLabel: action, detailsLabel: details };
  }

  const actionMap: Record<string, { hi: string; mr: string }> = {
    VOICE_INTAKE_COMPLETED: {
      hi: 'वॉयस अनुरोध दर्ज',
      mr: 'व्हॉइस विनंती नोंदवली',
    },
    CONSENT_GRANTED_DOCUMENTS: {
      hi: 'दस्तावेज़ सहमति स्वीकृत',
      mr: 'कागदपत्र संमती मंजूर',
    },
    PORTAL_STATUS_CHECKED: {
      hi: 'पोर्टल स्थिति जांची गई',
      mr: 'पोर्टल स्थिती तपासली',
    },
    SUBMISSION_CONFIRMED: {
      hi: 'सबमिशन की पुष्टि',
      mr: 'सबमिशनची पुष्टी',
    },
    ACKNOWLEDGEMENT_EXTRACTED: {
      hi: 'पावती संख्या प्राप्त',
      mr: 'पोचपावती क्रमांक प्राप्त',
    },
    PRE_FLIGHT_REJECTION_AUDIT_PASSED: {
      hi: 'प्री-फ़्लाइट जांच उत्तीर्ण',
      mr: 'प्री-फ्लाईट तपासणी उत्तीर्ण',
    },
    APPLICATION_SUBMITTED_WITH_AFFIRMATIVE_CONSENT: {
      hi: 'सहमति सहित आवेदन जमा',
      mr: 'संमतीसह अर्ज सादर',
    },
    ACKNOWLEDGEMENT_GENERATED: {
      hi: 'आधिकारिक रसीद जारी',
      mr: 'अधिकृत पावती जारी',
    },
    FOLLOWUP_CALL_COMPLETED: {
      hi: 'फॉलो-अप कॉल पूर्ण',
      mr: 'फॉलो-अप कॉल पूर्ण',
    },
    CONSENT_GRANTED_FOLLOWUP_CALL: {
      hi: 'कॉल पूर्व-सहमति दर्ज',
      mr: 'कॉल पूर्व-संमती नोंदवली',
    },
  };

  let detailsLabel = details;
  if (details.includes('Citizen described stopped pension')) {
    detailsLabel =
      language === 'hi'
        ? 'नागरिक ने रुकी हुई पेंशन के बारे में हिंदी में बताया। वृद्धावस्था पेंशन पुनरारंभ से मिलान हुआ।'
        : 'नागरिकाने थांबलेल्या पेन्शनबद्दल सांगितले. वृद्धापकाळ पेन्शन पुनरारंभ सेवेशी जुळणी झाली.';
  } else if (details.includes('Granted specific consent to attach passbook')) {
    detailsLabel =
      language === 'hi'
        ? 'पोर्टल सत्यापन के लिए पासबुक और पीपीओ संलग्न करने की स्पष्ट अनुमति दी गई।'
        : 'पोर्टल पडताळणीसाठी पासबुक आणि पीपीओ जोडण्याची स्पष्ट संमती दिली.';
  } else if (details.includes('Official portal status retrieved: e-KYC')) {
    detailsLabel =
      language === 'hi'
        ? 'आधिकारिक पोर्टल स्थिति प्राप्त: ई-केवाईसी जीवन प्रमाणीकरण लंबित पाया गया।'
        : 'अधिकृत पोर्टल स्थिती प्राप्त: ई-केवायसी हयातीचे प्रमाणीकरण प्रलंबित आढळले.';
  } else if (details.includes('Citizen confirmed irreversible submission')) {
    detailsLabel =
      language === 'hi'
        ? 'सारांश समीक्षा के बाद नागरिक ने ई-डिस्ट्रिक्ट पोर्टल पर अंतिम सबमिशन की पुष्टि की।'
        : 'सारांश तपासणीनंतर नागरिकाने ई-डिस्ट्रिक्ट पोर्टलवर अंतिम सबमिशनची पुष्टी केली.';
  } else if (details.includes('Captured official receipt number')) {
    const ack = details.match(/[A-Z0-9-]{8,}/)?.[0] || '';
    detailsLabel =
      language === 'hi'
        ? `पोर्टल से आधिकारिक पावती संख्या ${ack} प्राप्त की गई।`
        : `पोर्टलवरून अधिकृत पोचपावती क्रमांक ${ack} प्राप्त केला.`;
  }

  return {
    actionLabel: actionMap[action]?.[language] || action,
    detailsLabel,
  };
}

/**
 * Speaks text aloud in Hindi ('hi-IN'), Marathi ('mr-IN'), or English ('en-IN')
 * using the browser's Web Speech Synthesis API.
 */
export function speakTextAloud(
  text: string,
  language: Language,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang =
      language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.96;

    const voices = window.speechSynthesis.getVoices();
    const exactVoice =
      voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(language)) ||
      (language === 'mr'
        ? voices.find((v) => v.lang.toLowerCase().startsWith('hi'))
        : undefined);

    if (exactVoice) {
      utterance.voice = exactVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }
}

export function stopSpeakingAloud(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
