/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ApplicationCase, Language, SmsReceipt } from '../types/civic';
import {
  KEYPAD_UTTERANCE_PRESETS,
  KeypadUtterancePreset,
  OFFICIAL_TOLL_FREE_NUMBER,
  REVISED_ACCESS_MODEL_ROWS,
  createSmsReceipt,
  mapDtmfDigitToLanguage,
  matchKeypadUtterance,
} from '../services/keypadAndRejectionService';
import { speakTextAloud, stopSpeakingAloud } from '../services/speechAndLocale';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mic,
  Hash,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

interface KeypadPhoneSimulatorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  smsReceipts: SmsReceipt[];
  onNewSmsReceipt: (sms: SmsReceipt) => void;
  onOpenDigiLockerFlow: () => void;
  onOpenRejectionJourney: (caseId?: string) => void;
  onOpenFollowUpCall: (caseId?: string) => void;
  applications: ApplicationCase[];
}

type CallStage =
  | 'language_prompt'
  | 'how_can_i_help'
  | 'low_confidence_clarification'
  | 'pin_verification'
  | 'readback_and_dtmf_approval'
  | 'approved_and_sms_sent';

export const KeypadPhoneSimulator: React.FC<KeypadPhoneSimulatorProps> = ({
  language,
  onLanguageChange,
  smsReceipts,
  onNewSmsReceipt,
  onOpenDigiLockerFlow,
  onOpenRejectionJourney,
  onOpenFollowUpCall,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const [isCallActive, setIsCallActive] = useState<boolean>(true);
  const [callStage, setCallStage] = useState<CallStage>('how_can_i_help');
  const [selectedPreset, setSelectedPreset] = useState<KeypadUtterancePreset>(
    KEYPAD_UTTERANCE_PRESETS[0]
  );
  const [customSpokenInput, setCustomSpokenInput] = useState<string>('');
  const [enteredPin, setEnteredPin] = useState<string>('2486');
  const [outboundCallbackVerified, setOutboundCallbackVerified] = useState<boolean>(true);
  const [lastDtmfPressed, setLastDtmfPressed] = useState<string>('1');
  const [lowConfidenceMode, setLowConfidenceMode] = useState<boolean>(false);

  const handleSelectUtterance = (preset: KeypadUtterancePreset) => {
    setSelectedPreset(preset);
    if (lowConfidenceMode) {
      setCallStage('low_confidence_clarification');
      speakTextAloud(
        tr(
          'I heard your voice clearly in parts. Are you asking about an Income Certificate? Press 1 for Yes, 2 for another service.',
          'मुझे आपकी आवाज़ थोड़ी धीमी सुनाई दी। क्या आप आय प्रमाण पत्र के बारे में पूछ रहे हैं? हाँ के लिए 1 दबाएं।',
          'मला तुमचा आवाज थोडा कमी ऐकू आला. तुम्ही उत्पन्नाच्या दाखल्याबद्दल विचारत आहात का? होय साठी 1 दाबा.'
        ),
        language
      );
      return;
    }

    if (!preset.requiresIdentityVerification) {
      setCallStage('readback_and_dtmf_approval');
      speakTextAloud(preset.aiSpokenPrompt[language], language);
    } else {
      setCallStage('pin_verification');
      speakTextAloud(
        tr(
          'This requires checking your personal case. Initiating outbound callback to your registered mobile and verifying your 4-digit Case PIN. Never speak Aadhaar or OTP aloud.',
          'इसके लिए आपके व्यक्तिगत केस की जांच आवश्यक है। आपके पंजीकृत मोबाइल पर आउटबाउंड कॉलबैक और 4-अंकीय केस पिन सत्यापित किया जा रहा है। कभी भी आधार या ओटीपी बोलकर न बताएं।',
          'यासाठी तुमच्या वैयक्तिक केसची तपासणी आवश्यक आहे. तुमच्या नोंदणीकृत मोबाईलवर कॉलबॅक आणि ४-अंकी केस पिन तपासला जात आहे. कधीही आधार किंवा ओटीपी बोलून सांगू नका.'
        ),
        language
      );
    }
  };

  const handleConfirmPinAndProceed = () => {
    setOutboundCallbackVerified(true);
    setCallStage('readback_and_dtmf_approval');
    speakTextAloud(
      `${selectedPreset.aiSpokenPrompt[language]} ${selectedPreset.dtmfPrompt[language]}`,
      language
    );
  };

  const handleApproveViaDtmfOne = () => {
    setLastDtmfPressed('1');
    setCallStage('approved_and_sms_sent');

    const newSms = createSmsReceipt({
      caseId: selectedPreset.caseId,
      recipientPhoneMasked: '+91 98*** **312',
      serviceName:
        selectedPreset.id === 'pension_stopped'
          ? {
              en: 'Old Age Pension Revival',
              hi: 'वृद्धावस्था पेंशन पुनरारंभ',
              mr: 'वृद्धापकाळ पेन्शन पुनरारंभ',
            }
          : selectedPreset.id === 'scholarship_docs'
          ? {
              en: 'Post-Matric Scholarship Checklist',
              hi: 'छात्रवृत्ति दस्तावेज़ सूची',
              mr: 'शिष्यवृत्ती कागदपत्र यादी',
            }
          : {
              en: 'Income Certificate',
              hi: 'आय प्रमाण पत्र',
              mr: 'उत्पन्न दाखला',
            },
      stage:
        selectedPreset.id === 'rejection_reason'
          ? {
              en: 'Correction Approved via DTMF 1 — Ready for Submission',
              hi: 'कीपैड 1 द्वारा सुधार स्वीकृत — सबमिशन के लिए तैयार',
              mr: 'कीपॅड 1 द्वारे दुरुस्ती मंजूर — सबमिशनसाठी तयार',
            }
          : selectedPreset.id === 'pension_stopped'
          ? {
              en: 'Office Follow-up Call Approved via DTMF 1',
              hi: 'जिला कार्यालय फॉलो-अप कॉल के लिए सहमति दर्ज (1 दबाया)',
              mr: 'जिल्हा कार्यालय फॉलो-अप कॉलसाठी संमती नोंदवली (1 दाबले)',
            }
          : selectedPreset.id === 'scholarship_docs'
          ? {
              en: 'Checklist & ₹0 Fee Sent by SMS (No PIN Required)',
              hi: 'दस्तावेज़ सूची व ₹0 शुल्क एसएमएस द्वारा भेजा गया',
              mr: 'कागदपत्र यादी आणि ₹० शुल्क एसएमएसद्वारे पाठवले',
            }
          : {
              en: 'DigiLocker Per-Case Consent Approved (Press 1)',
              hi: 'डिजिलॉकर प्रति-केस सहमति स्वीकृत (1 दबाया)',
              mr: 'डिजिलॉकर प्रति-केस संमती मंजूर (1 दाबले)',
            },
      officialFee: selectedPreset.officialFee,
      triggerType:
        selectedPreset.id === 'rejection_reason'
          ? 'correction_approved'
          : selectedPreset.id === 'income_start'
          ? 'digilocker_consent'
          : 'status_check',
    });

    onNewSmsReceipt(newSms);
    speakTextAloud(
      tr(
        `Consent recorded with key 1. Official SMS receipt sent for Case ${selectedPreset.caseId}. Official fee is rupees ${selectedPreset.officialFee}.`,
        `बटन 1 द्वारा आपकी सहमति दर्ज कर ली गई है। केस ${selectedPreset.caseId} की आधिकारिक एसएमएस रसीद आपके फोन पर भेज दी गई है। सरकारी शुल्क ₹${selectedPreset.officialFee} है।`,
        `बटण 1 द्वारे तुमची संमती नोंदवली गेली आहे. केस ${selectedPreset.caseId} ची अधिकृत एसएमएस पावती तुमच्या फोनवर पाठवली आहे. शासकीय शुल्क ₹${selectedPreset.officialFee} आहे.`
      ),
      language
    );
  };

  const handleKeypadPress = (key: string) => {
    setLastDtmfPressed(key);
    if (!isCallActive) {
      setIsCallActive(true);
      setCallStage('language_prompt');
      return;
    }

    if (callStage === 'language_prompt') {
      const mappedLang = mapDtmfDigitToLanguage(key);
      if (mappedLang) {
        onLanguageChange(mappedLang);
        setCallStage('how_can_i_help');
        speakTextAloud(
          mappedLang === 'hi'
            ? 'नमस्कार, प्रतिनिधि टोल-फ्री सेवा में आपका स्वागत है। मैं किस सरकारी काम में आपकी मदद कर सकता हूँ?'
            : mappedLang === 'mr'
            ? 'नमस्कार, प्रतिनिधी टोल-फ्री सेवेत आपले स्वागत आहे. मी कोणत्या शासकीय कामात तुमची मदत करू शकतो?'
            : 'Welcome to Pratinidhi toll-free service. How can I help with a government service?',
          mappedLang
        );
      }
      return;
    }

    if (callStage === 'low_confidence_clarification' && key === '1') {
      if (!selectedPreset.requiresIdentityVerification) {
        setCallStage('readback_and_dtmf_approval');
      } else {
        setCallStage('pin_verification');
      }
      return;
    }

    if (callStage === 'pin_verification') {
      if (key >= '0' && key <= '9') {
        const nextPin = (enteredPin.length >= 4 ? key : enteredPin + key).slice(0, 4);
        setEnteredPin(nextPin);
        if (nextPin.length === 4) {
          setOutboundCallbackVerified(true);
        }
      } else if (key === '#') {
        handleConfirmPinAndProceed();
      }
      return;
    }

    if (callStage === 'readback_and_dtmf_approval' && key === '1') {
      handleApproveViaDtmfOne();
      return;
    }

    // Also allow pressing 1/2/3 anytime to switch language if user wants
    if (callStage === 'how_can_i_help') {
      const mappedLang = mapDtmfDigitToLanguage(key);
      if (mappedLang) {
        onLanguageChange(mappedLang);
      }
    }
  };

  const handleCustomUtteranceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSpokenInput.trim()) return;
    const matched = matchKeypadUtterance(customSpokenInput);
    setCustomSpokenInput('');
    handleSelectUtterance(matched);
  };

  return (
    <section
      aria-labelledby="keypad-simulator-heading"
      data-testid="keypad-phone-simulator"
      className="bg-white border-2 border-[#0B3A53] rounded-2xl p-5 sm:p-7 shadow-sm space-y-6"
    >
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#D6D2C9]">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005B50]">
            <PhoneCall className="w-4 h-4" />
            <span>
              {tr(
                'Primary Product: Keypad-Mobile Voice Service + SMS Receipts',
                'मुख्य उत्पाद: कीपैड मोबाइल टोल-फ्री वॉयस सेवा + एसएमएस रसीद',
                'मुख्य उत्पादन: कीपॅड मोबाईल टोल-फ्री व्हॉइस सेवा + एसएमएस पावती'
              )}
            </span>
          </div>
          <h2 id="keypad-simulator-heading" className="text-xl sm:text-2xl font-bold text-[#0B3A53]">
            {tr(
              `Toll-Free Voice Service (${OFFICIAL_TOLL_FREE_NUMBER}) — No Smartphone Needed`,
              `टोल-फ्री वॉयस सेवा (${OFFICIAL_TOLL_FREE_NUMBER}) — बिना स्मार्टफोन सरकारी काम`,
              `टोल-फ्री व्हॉइस सेवा (${OFFICIAL_TOLL_FREE_NUMBER}) — स्मार्टफोनशिवाय शासकीय काम`
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] max-w-3xl">
            {tr(
              'An illiterate citizen never needs to understand menus, PDFs, portals, or file-upload buttons. Speak naturally on a normal keypad call, confirm critical actions by pressing 1, and receive an official SMS receipt.',
              'किसी भी नागरिक को वेबसाइट, पीडीएफ, पोर्टल या फाइल-अपलोड बटन समझने की ज़रूरत नहीं है। सामान्य कीपैड फोन से बात करें, 1 दबाकर सहमति दें और सीधे अपने फोन पर आधिकारिक एसएमएस रसीद पाएं।',
              'कोणत्याही नागरिकाला वेबसाईट, पीडीएफ, पोर्टल किंवा फाईल-अपलोड बटणे समजून घेण्याची गरज नाही. साध्या कीपॅड फोनवरून बोला, 1 दाबून संमती द्या आणि थेट फोनवर अधिकृत एसएमएस पावती मिळवा.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            data-testid="reset-language-prompt-btn"
            onClick={() => {
              setIsCallActive(true);
              setCallStage('language_prompt');
              speakTextAloud(
                'Hindi ke liye 1 dabaiye, Marathi ke liye 2, English ke liye 3 dabaiye.',
                'hi'
              );
            }}
            className="px-3.5 py-2 rounded-xl border border-[#D6D2C9] bg-[#F2EFE8] hover:bg-white text-xs font-bold text-[#0B3A53] min-h-[40px]"
          >
            {tr(
              'Hear Step 2 Language Prompt (1/2/3)',
              'कदम 2: भाषा प्रॉम्प्ट सुनें (1/2/3)',
              'टप्पा २: भाषा प्रॉम्प्ट ऐका (1/2/3)'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isCallActive) {
                stopSpeakingAloud();
                setIsCallActive(false);
              } else {
                setIsCallActive(true);
                setCallStage('how_can_i_help');
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 min-h-[40px] ${
              isCallActive
                ? 'bg-[#A61B1B] text-white hover:bg-red-800'
                : 'bg-[#005B50] text-white hover:bg-[#00473e]'
            }`}
          >
            {isCallActive ? (
              <>
                <PhoneOff className="w-3.5 h-3.5" />
                <span>{tr('End Call', 'कॉल समाप्त करें', 'कॉल संपवा')}</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-3.5 h-3.5" />
                <span>
                  {tr(
                    `Dial ${OFFICIAL_TOLL_FREE_NUMBER}`,
                    `${OFFICIAL_TOLL_FREE_NUMBER} डायल करें`,
                    `${OFFICIAL_TOLL_FREE_NUMBER} डायल करा`
                  )}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Interactive Workspace: Left = Citizen Voice & Call Steps, Right = Tactile Keypad Phone + SMS Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Voice-First Agent Flow (No Rigid IVR Tree) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step Progress Bar */}
          <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0B3A53]">
              <span>
                {tr(
                  'Voice-First Call Flow (With DTMF Keypad Fallback)',
                  'वॉयस-फर्स्ट कॉल प्रवाह (कीपैड विकल्प के साथ)',
                  'व्हॉइस-फर्स्ट कॉल प्रवाह (कीपॅड पर्यायासह)'
                )}
              </span>
              <span className="font-mono text-[#005B50]">
                {tr('Last Key:', 'अंतिम बटन:', 'शेवटचे बटण:')} [{lastDtmfPressed}]
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setCallStage('language_prompt')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  callStage === 'language_prompt'
                    ? 'bg-[#0B3A53] text-white border-[#0B3A53]'
                    : 'bg-white text-[#18212B] border-[#D6D2C9]'
                }`}
              >
                1. {tr('1 Hindi / 2 Marathi / 3 Eng', '1 हिन्दी / 2 मराठी / 3 Eng', '1 हिंदी / 2 मराठी / 3 Eng')}
              </button>
              <button
                type="button"
                onClick={() => setCallStage('how_can_i_help')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  callStage === 'how_can_i_help' || callStage === 'low_confidence_clarification'
                    ? 'bg-[#0B3A53] text-white border-[#0B3A53]'
                    : 'bg-white text-[#18212B] border-[#D6D2C9]'
                }`}
              >
                2. {tr('Speak Naturally', 'बोलकर समस्या बताएं', 'नैसर्गिकपणे बोला')}
              </button>
              <button
                type="button"
                onClick={() => setCallStage('pin_verification')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  callStage === 'pin_verification'
                    ? 'bg-[#0B3A53] text-white border-[#0B3A53]'
                    : 'bg-white text-[#18212B] border-[#D6D2C9]'
                }`}
              >
                3. {tr('Callback & Case PIN', 'कॉलबैक व केस पिन', 'कॉलबॅक व केस पिन')}
              </button>
              <button
                type="button"
                onClick={() => setCallStage('readback_and_dtmf_approval')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  callStage === 'readback_and_dtmf_approval' ||
                  callStage === 'approved_and_sms_sent'
                    ? 'bg-[#005B50] text-white border-[#005B50]'
                    : 'bg-white text-[#18212B] border-[#D6D2C9]'
                }`}
              >
                4. {tr('Press 1 & SMS Receipt', '1 दबाएं व एसएमएस रसीद', '1 दाबा व एसएमएस पावती')}
              </button>
            </div>
          </div>

          {/* 4 Required Natural Citizen Utterances */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-[#0B3A53]">
                {tr(
                  'What the citizen says on the call (tap any phrase to speak):',
                  'नागरिक फोन पर क्या बोलता है (किसी भी वाक्य को चुनें):',
                  'नागरिक फोनवर काय बोलतो (कोणतेही वाक्य निवडा):'
                )}
              </label>

              <label className="inline-flex items-center gap-1.5 text-xs text-[#4B5563] cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowConfidenceMode}
                  onChange={(e) => setLowConfidenceMode(e.target.checked)}
                  className="rounded border-[#D6D2C9] text-[#0B3A53]"
                />
                <span>
                  {tr(
                    'Simulate noisy line (ask 1 short question)',
                    'कमज़ोर नेटवर्क सिमुलेशन (एक छोटा सवाल पूछें)',
                    'कमकुवत नेटवर्क सिम्युलेशन (एक छोटा प्रश्न)'
                  )}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {KEYPAD_UTTERANCE_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    data-testid={`utterance-btn-${preset.id}`}
                    onClick={() => handleSelectUtterance(preset)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 min-h-[84px] ${
                      isSelected
                        ? 'bg-[#0B3A53] text-white border-[#0B3A53] shadow-xs'
                        : 'bg-[#FFFDF8] hover:bg-[#F2EFE8] text-[#18212B] border-[#D6D2C9]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm leading-snug">
                        “{preset.spokenText}”
                      </span>
                      <Mic
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#f97316]' : 'text-[#005B50]'
                        }`}
                      />
                    </div>
                    <div
                      className={`text-[11px] flex items-center justify-between ${
                        isSelected ? 'text-white/80' : 'text-[#4B5563]'
                      }`}
                    >
                      <span>{preset.label[language]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom spoken phrase input */}
            <form onSubmit={handleCustomUtteranceSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSpokenInput}
                onChange={(e) => setCustomSpokenInput(e.target.value)}
                placeholder={tr(
                  'Or type any spoken question in Hindi, Marathi, or English...',
                  'या हिंदी, मराठी या अंग्रेजी में अपना वाक्य लिखें...',
                  'किंवा हिंदी, मराठी किंवा इंग्रजीमध्ये तुमचे वाक्य लिहा...'
                )}
                aria-label={tr(
                  'Spoken question on keypad call',
                  'कीपैड कॉल पर बोला गया प्रश्न',
                  'कीपॅड कॉलवर बोललेला प्रश्न'
                )}
                className="flex-1 bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#18212B]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B3A53] hover:bg-[#08283a] text-white text-xs font-bold shrink-0"
              >
                {tr('Speak on Call', 'कॉल पर बोलें', 'कॉलवर बोला')}
              </button>
            </form>
          </div>

          {/* Active AI Voice Response & Verification Panel */}
          <div className="bg-[#FFFDF8] border-2 border-[#D6D2C9] rounded-2xl p-5 space-y-4">
            {callStage === 'language_prompt' && (
              <div className="space-y-3" data-testid="stage-language-prompt">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#005B50]">
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {tr(
                      'Step 2: Spoken Language Selection',
                      'कदम 2: भाषा चुनने का वॉयस संदेश',
                      'टप्पा २: भाषा निवडण्याचा व्हॉइस संदेश'
                    )}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-[#0B3A53]">
                  “Hindi ke liye 1 dabaiye, Marathi ke liye 2, English ke liye 3 dabaiye.”
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('1')}
                    className="px-4 py-2 rounded-lg bg-[#0B3A53] text-white text-xs font-bold"
                  >
                    Press 1 — हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('2')}
                    className="px-4 py-2 rounded-lg bg-[#0B3A53] text-white text-xs font-bold"
                  >
                    Press 2 — मराठी
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('3')}
                    className="px-4 py-2 rounded-lg bg-[#0B3A53] text-white text-xs font-bold"
                  >
                    Press 3 — English
                  </button>
                </div>
              </div>
            )}

            {callStage === 'low_confidence_clarification' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#A94600]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {tr(
                      'Low Speech Confidence — Asking 1 Short Question at a Time',
                      'कमज़ोर आवाज़ — एक बार में केवल एक छोटा सवाल',
                      'कमी आवाज स्पष्टता — एका वेळी एकच छोटा प्रश्न'
                    )}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-[#0B3A53]">
                  {tr(
                    '“Are you calling about an Income Certificate or Pension? Press 1 for Yes, or speak again.”',
                    '“क्या आप आय प्रमाण पत्र या पेंशन के लिए कॉल कर रहे हैं? हाँ के लिए 1 दबाएं।”',
                    '“तुम्ही उत्पन्न दाखला किंवा पेन्शनसाठी कॉल करत आहात का? होय साठी 1 दाबा.”'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('1')}
                  className="px-4 py-2.5 rounded-xl bg-[#005B50] text-white text-xs font-bold"
                >
                  {tr('Press 1 to Confirm Yes', 'हाँ की पुष्टि के लिए 1 दबाएं', 'होय पुष्टीसाठी 1 दाबा')}
                </button>
              </div>
            )}

            {callStage === 'pin_verification' && (
              <div className="space-y-3" data-testid="stage-pin-verification">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#0B3A53] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#005B50]" />
                    {tr(
                      'Step 6: Safer Case-Specific Verification Flow',
                      'कदम 6: व्यक्तिगत केस के लिए सुरक्षित सत्यापन',
                      'टप्पा ६: वैयक्तिक केससाठी सुरक्षित पडताळणी'
                    )}
                  </span>
                  <span className="text-xs font-semibold text-[#005B50]">
                    ✓ {tr('Outbound Callback Verified', 'पंजीकृत नंबर कॉलबैक सत्यापित', 'नोंदणीकृत कॉलबॅक सत्यापित')}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#18212B]">
                  {tr(
                    'For case-specific actions, Pratinidhi verifies you through: (1) outbound callback to your registered number (+91 98*** **312), (2) your self-created 4-digit Case PIN, and (3) DTMF/SMS confirmation.',
                    'व्यक्तिगत केस की जानकारी के लिए प्रतिनिधि 3 सुरक्षित कदम अपनाता है: (1) आपके पंजीकृत नंबर (+91 98*** **312) पर आउटबाउंड कॉलबैक, (2) आपका स्वयं बनाया 4-अंकीय केस पिन, और (3) 1 दबाकर सहमति।',
                    'वैयक्तिक केसच्या माहितीसाठी प्रतिनिधी ३ सुरक्षित टप्पे वापरतो: (१) तुमच्या नोंदणीकृत नंबरवर (+91 98*** **312) कॉलबॅक, (२) तुमचा ४-अंकी केस पिन, आणि (३) 1 दाबून संमती.'
                  )}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F2EFE8] p-3.5 rounded-xl border border-[#D6D2C9]">
                  <div>
                    <span className="text-xs text-[#4B5563] block">
                      {tr(
                        'Self-Created 4-Digit Case PIN (Entered via Keypad):',
                        'स्वयं निर्मित 4-अंकीय केस पिन (कीपैड द्वारा):',
                        'स्वतः तयार केलेला ४-अंकी केस पिन (कीपॅडद्वारे):'
                      )}
                    </span>
                    <span className="font-mono text-lg font-bold tracking-widest text-[#0B3A53]">
                      {enteredPin.padEnd(4, '•')}
                    </span>
                    <span className="text-[11px] text-[#005B50] ml-2 font-semibold">
                      ({outboundCallbackVerified ? tr('Verified', 'सत्यापित', 'सत्यापित') : ''})
                    </span>
                  </div>

                  <button
                    type="button"
                    data-testid="verify-case-pin-btn"
                    onClick={handleConfirmPinAndProceed}
                    className="px-4 py-2.5 rounded-xl bg-[#0B3A53] hover:bg-[#08283a] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>
                      {tr(
                        'Verify PIN & Hear Case Details',
                        'पिन सत्यापित करें व विवरण सुनें',
                        'पिन सत्यापित करा व तपशील ऐका'
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {(callStage === 'how_can_i_help' ||
              callStage === 'readback_and_dtmf_approval' ||
              callStage === 'approved_and_sms_sent') && (
              <div className="space-y-3.5" data-testid="stage-readback-approval">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005B50] flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    {tr('AI Voice Response:', 'एआई वॉयस एजेंट का उत्तर:', 'एआय व्हॉइस एजंटचे उत्तर:')}
                  </span>

                  <span className="text-xs font-semibold text-[#0B3A53]">
                    {selectedPreset.requiresIdentityVerification
                      ? tr(
                          'Case-Specific: Callback + Case PIN Verified',
                          'व्यक्तिगत केस: कॉलबैक + केस पिन सत्यापित',
                          'वैयक्तिक केस: कॉलबॅक + केस पिन सत्यापित'
                        )
                      : tr(
                          'General Inquiry: No Identity Verification Needed',
                          'सामान्य प्रश्न: किसी पहचान सत्यापन की आवश्यकता नहीं',
                          'सामान्य प्रश्न: ओळख पडताळणीची गरज नाही'
                        )}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-bold text-[#0B3A53] leading-relaxed">
                  “{selectedPreset.aiSpokenPrompt[language]}”
                </p>

                {/* Step 7: Read-back of critical facts */}
                <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563] block">
                    {tr(
                      'Step 7: Critical Facts Read-Back Before Saving',
                      'कदम 7: सेव करने से पहले महत्वपूर्ण तथ्यों का दोहराव',
                      'टप्पा ७: जतन करण्यापूर्वी महत्त्वाच्या बाबींची पडताळणी'
                    )}
                  </span>
                  <p className="text-xs sm:text-sm text-[#18212B] font-medium">
                    {selectedPreset.aiReadbackFacts[language]}
                  </p>
                </div>

                {/* DTMF Press 1 Consent Prompt */}
                <div className="bg-[#005B50]/10 border border-[#005B50]/40 rounded-xl p-4 space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-[#005B50] leading-relaxed">
                    “{selectedPreset.dtmfPrompt[language]}”
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      data-testid="press-1-approve-btn"
                      onClick={handleApproveViaDtmfOne}
                      className="px-5 py-2.5 rounded-xl bg-[#005B50] hover:bg-[#00473e] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs min-h-[44px]"
                    >
                      <Hash className="w-4 h-4" />
                      <span>
                        {tr(
                          'Press 1 on Keypad to Approve & Send SMS Receipt',
                          'सहमति देने और एसएमएस रसीद पाने के लिए 1 दबाएं',
                          'संमती देण्यासाठी आणि एसएमएस पावतीसाठी 1 दाबा'
                        )}
                      </span>
                    </button>

                    {selectedPreset.id === 'income_start' && (
                      <button
                        type="button"
                        onClick={onOpenDigiLockerFlow}
                        className="px-3.5 py-2.5 rounded-xl border border-[#0B3A53] bg-white hover:bg-[#F2EFE8] text-xs font-bold text-[#0B3A53] min-h-[44px]"
                      >
                        {tr(
                          'Open Companion DigiLocker View',
                          'डिजिलॉकर सहमति दृश्य खोलें',
                          'डिजिलॉकर संमती दृश्य उघडा'
                        )}
                      </button>
                    )}

                    {selectedPreset.id === 'rejection_reason' && (
                      <button
                        type="button"
                        onClick={() => onOpenRejectionJourney(selectedPreset.caseId)}
                        className="px-3.5 py-2.5 rounded-xl border border-[#A61B1B] bg-white hover:bg-red-50 text-xs font-bold text-[#A61B1B] min-h-[44px]"
                      >
                        {tr(
                          'Open Full Rejection Recovery Journey',
                          'अस्वीकृति सुधार यात्रा खोलें',
                          'अर्ज नाकारणी दुरुस्ती प्रवास उघडा'
                        )}
                      </button>
                    )}

                    {selectedPreset.id === 'pension_stopped' && (
                      <button
                        type="button"
                        onClick={() => onOpenFollowUpCall('app-savitri-2026')}
                        className="px-3.5 py-2.5 rounded-xl border border-[#A94600] bg-white hover:bg-[#FFFDF8] text-xs font-bold text-[#A94600] min-h-[44px]"
                      >
                        {tr(
                          'Launch District Office Call',
                          'जिला कार्यालय कॉल खोलें',
                          'जिल्हा कार्यालय कॉल उघडा'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Hard Speakerphone & Aadhaar/OTP Privacy Guarantee */}
            <div className="pt-3 border-t border-[#D6D2C9] flex items-start gap-2.5 text-xs text-[#4B5563]">
              <ShieldCheck className="w-4 h-4 text-[#005B50] shrink-0 mt-0.5" />
              <p>
                <strong className="text-[#18212B]">
                  {tr(
                    'Strict Voice Privacy Rule:',
                    'कठोर वॉयस गोपनीयता नियम:',
                    'कठोर व्हॉइस गोपनीयता नियम:'
                  )}
                </strong>{' '}
                {tr(
                  'Pratinidhi NEVER asks a citizen to speak Aadhaar numbers, bank details, passwords, or OTPs aloud, and NEVER reads sensitive document contents over a speakerphone.',
                  'प्रतिनिधि कभी भी किसी नागरिक से आधार नंबर, बैंक विवरण, पासवर्ड या ओटीपी फोन पर बोलकर बताने के लिए नहीं कहता, और न ही स्पीकरफोन पर संवेदनशील दस्तावेज़ पढ़ता है।',
                  'प्रतिनिधी कधीही नागरिकाला आधार क्रमांक, बँक तपशील, पासवर्ड किंवा ओटीपी फोनवर बोलून सांगण्यास सांगत नाही आणि स्पीकरफोनवर संवेदनशील माहिती वाचून दाखवत नाही.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Physical Feature-Phone Keypad + Live SMS Receipt Inbox */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tactile Keypad Mobile Device Card */}
          <div className="bg-[#18212B] text-white rounded-3xl p-5 border-4 border-[#374151] shadow-md space-y-4">
            {/* Feature Phone Top Earpiece & Screen */}
            <div className="text-center space-y-1">
              <div className="w-16 h-1.5 bg-[#4B5563] rounded-full mx-auto mb-2" />
              <span className="text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold">
                BHARAT KEYPAD VOICE • DUAL SIM
              </span>
            </div>

            {/* Feature Phone LCD Screen */}
            <div className="bg-[#E6F0EA] text-[#18212B] rounded-xl p-3.5 border-2 border-[#9CA3AF] font-mono text-xs space-y-1.5 min-h-[115px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] border-b border-[#18212B]/20 pb-1">
                <span className="font-bold text-[#005B50]">
                  {isCallActive ? '● IN CALL 01:18' : '○ CALL ENDED'}
                </span>
                <span className="font-bold">{OFFICIAL_TOLL_FREE_NUMBER}</span>
              </div>

              <div className="py-1 text-xs font-bold text-[#0B3A53] leading-snug">
                {callStage === 'language_prompt'
                  ? '1: हिन्दी | 2: मराठी | 3: English'
                  : callStage === 'pin_verification'
                  ? `Callback OK | PIN: ${enteredPin} (# to OK)`
                  : callStage === 'approved_and_sms_sent'
                  ? `✓ Approved (Key 1) -> SMS Sent: ${selectedPreset.caseId}`
                  : `Case: ${selectedPreset.caseId} | Fee: ₹${selectedPreset.officialFee} | Press 1 to Approve`}
              </div>

              <div className="flex items-center justify-between text-[11px] border-t border-[#18212B]/20 pt-1 text-[#4B5563]">
                <span>Lang: {language.toUpperCase()}</span>
                <span>DTMF: [{lastDtmfPressed}]</span>
              </div>
            </div>

            {/* 12-Button Tactile DTMF Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1" role="group" aria-label="Feature phone DTMF keypad">
              {[
                { digit: '1', sub: 'हिन्दी / YES' },
                { digit: '2', sub: 'मराठी / ABC' },
                { digit: '3', sub: 'ENG / DEF' },
                { digit: '4', sub: 'GHI' },
                { digit: '5', sub: 'JKL' },
                { digit: '6', sub: 'MNO' },
                { digit: '7', sub: 'PQRS' },
                { digit: '8', sub: 'TUV' },
                { digit: '9', sub: 'WXYZ' },
                { digit: '*', sub: 'REPEAT' },
                { digit: '0', sub: 'HELP' },
                { digit: '#', sub: 'CONFIRM' },
              ].map((btn) => (
                <button
                  key={btn.digit}
                  type="button"
                  data-testid={`keypad-digit-${btn.digit}`}
                  onClick={() => handleKeypadPress(btn.digit)}
                  aria-label={`Keypad button ${btn.digit} ${btn.sub}`}
                  className={`py-2.5 px-2 rounded-xl border text-center transition-all active:scale-95 ${
                    btn.digit === '1'
                      ? 'bg-[#005B50] hover:bg-[#00473e] border-[#005B50] text-white font-bold'
                      : 'bg-[#25303F] hover:bg-[#324054] border-[#4B5563] text-white'
                  }`}
                >
                  <span className="text-base font-bold block leading-none">{btn.digit}</span>
                  <span className="text-[9px] text-white/75 tracking-wider block mt-1">
                    {btn.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 8: Official SMS Receipt Inbox */}
          <div
            className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-2xl p-4 space-y-3"
            data-testid="sms-receipt-inbox"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#D6D2C9]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#005B50]" />
                <h3 className="text-sm font-bold text-[#0B3A53]">
                  {tr(
                    'Step 8: Citizen SMS Receipt Inbox',
                    'कदम 8: नागरिक एसएमएस रसीद इनबॉक्स',
                    'टप्पा ८: नागरिक एसएमएस पावती इनबॉक्स'
                  )}
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#005B50]">
                {smsReceipts.length} {tr('SMS', 'एसएमएस', 'एसएमएस')}
              </span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {smsReceipts.slice(0, 3).map((sms) => (
                <div
                  key={sms.id}
                  className="bg-white border border-[#D6D2C9] rounded-xl p-3 text-xs space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#005B50]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {sms.caseId}
                    </span>
                    <span className="font-mono text-[#0B3A53]">
                      {tr('Fee:', 'शुल्क:', 'शुल्क:')}{' '}
                      {sms.officialFee === 0 ? '₹0' : `₹${sms.officialFee}`}
                    </span>
                  </div>
                  <p className="text-[#18212B] leading-relaxed font-medium">
                    {sms.messageBody[language]}
                  </p>
                  <div className="text-[11px] text-[#4B5563] flex items-center justify-between pt-1 border-t border-[#D6D2C9]/50">
                    <span>
                      {tr('To:', 'प्राप्तकर्ता:', 'प्राप्तकर्ता:')} {sms.recipientPhoneMasked}
                    </span>
                    <span>
                      {tr('Callback:', 'कॉलबैक:', 'कॉलबॅक:')} {sms.callbackNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revised Access Model Table (Compact Reference) */}
      <details className="bg-[#F2EFE8]/70 border border-[#D6D2C9] rounded-xl p-4">
        <summary className="text-xs sm:text-sm font-bold text-[#0B3A53] cursor-pointer select-none">
          {tr(
            'View Revised Keypad-Mobile Access Model (All 7 Citizen Needs & System Actions)',
            'संशोधित कीपैड-मोबाइल एक्सेस मॉडल देखें (सभी 7 नागरिक आवश्यकताएं एवं सिस्टम कार्यवाही)',
            'सुधारित कीपॅड-मोबाईल ॲक्सेस मॉडेल पहा (सर्व ७ नागरिक गरजा आणि सिस्टम कृती)'
          )}
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D6D2C9] text-[#0B3A53] font-bold">
                <th className="py-2 pr-3">{tr('Citizen Need', 'नागरिक की आवश्यकता', 'नागरिकाची गरज')}</th>
                <th className="py-2 px-3">
                  {tr('Keypad-Mobile Experience', 'कीपैड-मोबाइल अनुभव', 'कीपॅड-मोबाईल अनुभव')}
                </th>
                <th className="py-2 pl-3">{tr('System Action', 'सिस्टम कार्यवाही', 'सिस्टम कृती')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6D2C9]/60 text-[#18212B]">
              {REVISED_ACCESS_MODEL_ROWS.map((row) => (
                <tr key={row.id}>
                  <td className="py-2 pr-3 font-semibold text-[#0B3A53]">{row.need[language]}</td>
                  <td className="py-2 px-3">{row.keypadExperience[language]}</td>
                  <td className="py-2 pl-3 text-[#005B50] font-medium">
                    {row.systemAction[language]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
};
