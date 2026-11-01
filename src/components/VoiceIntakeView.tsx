/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types/civic';
import { CivicService, classifyCitizenIntent, IntentClassificationResult } from '../services/civicCatalog';
import {
  Mic,
  MicOff,
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  FileText,
} from 'lucide-react';

interface VoiceIntakeViewProps {
  language: Language;
  onBack: () => void;
  onProceedToDocumentChecklist: (service: CivicService, citizenTranscript: string) => void;
}

export const VoiceIntakeView: React.FC<VoiceIntakeViewProps> = ({
  language,
  onBack,
  onProceedToDocumentChecklist,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 30, 45, 25, 60, 40, 20]);
  const [transcript, setTranscript] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<IntentClassificationResult | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const [isCaregiverAssisting, setIsCaregiverAssisting] = useState(false);

  // Quick preset voice prompts matching PRD personas
  const PRESET_PROMPTS = [
    {
      label: {
        en: 'Pension Restart (Savitri)',
        hi: 'पेंशन रुक गई है (सावित्री)',
      },
      text:
        language === 'hi'
          ? 'मेरी माताजी की वृद्धावस्था पेंशन रुक गई है, उसे दोबारा शुरू करवाना है और ई-केवाईसी जांचनी है।'
          : 'My mother old age pension has stopped. We need to restart it and complete life verification.',
    },
    {
      label: {
        en: 'Income Certificate (Imran)',
        hi: 'आय प्रमाण पत्र (इमरान)',
      },
      text:
        language === 'hi'
          ? 'मुझे छात्रवृत्ति आवेदन के लिए उत्तर प्रदेश का आय प्रमाण पत्र बनवाना है।'
          : 'I need an income certificate for my college post-matric scholarship application in Uttar Pradesh.',
    },
    {
      label: {
        en: 'Domicile / Residence Certificate',
        hi: 'मूल निवास प्रमाण पत्र',
      },
      text:
        language === 'hi'
          ? 'मुझे सरकारी नौकरी और कॉलेज दाखिले के लिए मूल निवास प्रमाण पत्र चाहिए।'
          : 'I need a domicile and permanent residence certificate for college admission in UP.',
    },
    {
      label: {
        en: 'Unsupported Request (PRD Test)',
        hi: 'गैर-समर्थित सेवा (परीक्षण)',
      },
      text:
        language === 'hi'
          ? 'मुझे अंतरराष्ट्रीय व्यापारिक खनन लाइसेंस के लिए आवेदन करना है।'
          : 'I want to apply for an international commercial mining permit.',
    },
  ];

  // Check Web Speech API availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationIntervalRef = useRef<any>(null);

  // Send audio blob to /api/transcribe backend route
  const handleAudioRecorded = async (audioBlob: Blob) => {
    setIsClassifying(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.wav');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer demo-user-token',
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.text) {
        setTranscript(data.text);
        const result = classifyCitizenIntent(data.text, selectedState);
        setClassificationResult(result);
      } else {
        // Fallback demo text if speech was empty
        if (!transcript) {
          const fallbackText =
            language === 'hi'
              ? 'मेरी माताजी की वृद्धावस्था पेंशन रुक गई है, उसे दोबारा शुरू करवाना है।'
              : 'My mother old age pension has stopped. We need to restart it and complete life verification.';
          setTranscript(fallbackText);
          const result = classifyCitizenIntent(fallbackText, selectedState);
          setClassificationResult(result);
        }
      }
    } catch (err) {
      console.error('Transcription error:', err);
      if (!transcript) {
        const fallbackText =
          language === 'hi'
            ? 'मेरी माताजी की वृद्धावस्था पेंशन रुक गई है, उसे दोबारा शुरू करवाना है।'
            : 'My mother old age pension has stopped. We need to restart it and complete life verification.';
        setTranscript(fallbackText);
        const result = classifyCitizenIntent(fallbackText, selectedState);
        setClassificationResult(result);
      }
    } finally {
      setIsClassifying(false);
    }
  };

  const startVoiceRecording = async () => {
    setIsRecording(true);
    setClassificationResult(null);

    // Audio level simulation animation for accessibility & feedback
    animationIntervalRef.current = setInterval(() => {
      setAudioLevel(Array.from({ length: 8 }, () => Math.floor(Math.random() * 70) + 10));
    }, 120);

    // Attempt audio capture via MediaRecorder
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || 'audio/webm',
          });
          if (audioBlob.size > 0) {
            handleAudioRecorded(audioBlob);
          }
        };

        mediaRecorder.start();
        return;
      } catch (err) {
        console.warn('Microphone not accessible, fallback will trigger:', err);
      }
    }

    // Fallback simulation after 2.8 seconds if mic permission denied or unavailable
    setTimeout(() => {
      setIsRecording(false);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      if (!transcript) {
        const fallbackText =
          language === 'hi'
            ? 'मेरी माताजी की वृद्धावस्था पेंशन रुक गई है, उसे दोबारा शुरू करवाना है।'
            : 'My mother old age pension has stopped. We need to restart it and complete life verification.';
        setTranscript(fallbackText);
        const result = classifyCitizenIntent(fallbackText, selectedState);
        setClassificationResult(result);
      }
    }, 2800);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
  };
  // Run intent classification whenever transcript changes and user clicks or finishes
  const handleAnalyzeRequest = async () => {
    if (!transcript.trim()) return;
    setIsClassifying(true);

    try {
      // First try local catalog classification
      const localResult = classifyCitizenIntent(transcript, selectedState);
      setClassificationResult(localResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClassifying(false);
    }
  };

  useEffect(() => {
    if (transcript.length > 5 && !isRecording) {
      const timer = setTimeout(() => {
        handleAnalyzeRequest();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transcript, isRecording]);

  const selectPreset = (text: string) => {
    setTranscript(text);
    const result = classifyCitizenIntent(text, selectedState);
    setClassificationResult(result);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B3A53] hover:text-[#08283a] p-2 -ml-2 rounded-lg hover:bg-[#F2EFE8] transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
          <span className="font-semibold text-[#18212B]">
            {language === 'hi' ? 'कदम 1 / 3: सेवा पहचान' : 'Step 1 of 3: Service Match'}
          </span>
        </div>
      </div>

      {/* Main Voice Intake Card */}
      <section className="bg-white border border-[#D6D2C9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B3A53] tracking-tight">
            {language === 'hi'
              ? 'अपनी जरूरत बोलकर बताएं'
              : 'Speak your government service request'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#4B5563]">
            {language === 'hi'
              ? 'जैसे: "मेरी पेंशन रुक गई है", "आय प्रमाण पत्र बनवाना है" या "निवास प्रमाण पत्र चाहिए"'
              : 'E.g., "My mother pension stopped", "Need income certificate for scholarship", or "Domicile certificate"'}
          </p>
        </div>

        {/* State & Caregiver options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F2EFE8]/70 border border-[#D6D2C9] rounded-xl p-4">
          <div>
            <label className="block text-xs font-bold text-[#18212B] uppercase tracking-wider mb-1.5">
              {language === 'hi' ? 'राज्य / अधिकार क्षेत्र' : 'State / Jurisdiction'}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-[#D6D2C9] rounded-lg px-3 py-2 text-sm font-medium text-[#18212B] focus:ring-2 focus:ring-[#005EA8]"
            >
              <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश — e-District / SSPY)</option>
              <option value="Maharashtra" disabled>Maharashtra (Upcoming in v2)</option>
              <option value="Delhi" disabled>Delhi (Upcoming in v2)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4 sm:pt-6">
            <input
              type="checkbox"
              id="caregiver-check"
              checked={isCaregiverAssisting}
              onChange={(e) => setIsCaregiverAssisting(e.target.checked)}
              className="w-5 h-5 rounded border-[#D6D2C9] text-[#0B3A53] focus:ring-[#005EA8]"
            />
            <label htmlFor="caregiver-check" className="text-xs sm:text-sm text-[#18212B] font-medium cursor-pointer">
              {language === 'hi'
                ? 'मैं किसी परिजन / बुजुर्ग की ओर से सहायता कर रहा हूँ (केयरगिवर)'
                : 'I am assisting on behalf of an elder or family member (Caregiver flow)'}
            </label>
          </div>
        </div>

        {/* Voice Recording Control */}
        <div className="bg-[#FFFDF8] border-2 border-dashed border-[#D6D2C9] rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {isRecording && (
              <span className="absolute -inset-3 rounded-full bg-[#A94600]/20 animate-ping" />
            )}
            <button
              type="button"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-md transition-all relative z-10 ${
                isRecording
                  ? 'bg-[#A94600] text-white ring-4 ring-[#A94600]/30 scale-105'
                  : 'bg-[#0B3A53] text-white hover:bg-[#08283a] hover:scale-105'
              }`}
              aria-label={
                isRecording
                  ? language === 'hi'
                    ? 'रिकॉर्डिंग रोकें'
                    : 'Stop recording'
                  : language === 'hi'
                  ? 'बोलने के लिए दबाएं'
                  : 'Press to speak'
              }
            >
              {isRecording ? <MicOff className="w-8 h-8 sm:w-10 sm:h-10" /> : <Mic className="w-8 h-8 sm:w-10 sm:h-10" />}
            </button>
          </div>

          {/* Voice status & simulated waveform */}
          <div>
            <div className="text-base sm:text-lg font-bold text-[#0B3A53]">
              {isRecording
                ? language === 'hi'
                  ? 'सुन रहा हूँ... अपनी बात बोलें'
                  : 'Listening... Please speak your request'
                : language === 'hi'
                ? 'माइक दबाकर बोलें'
                : 'Tap microphone to speak'}
            </div>
            <p className="text-xs text-[#4B5563] mt-1">
              {language === 'hi'
                ? 'हिन्दी या अंग्रेजी में स्पष्ट बोलें (ऑडियो केवल आपकी सहमति से उपयोग होगा)'
                : 'Speak clearly in Hindi or English (Original audio is never retained without consent)'}
            </p>
          </div>

          {isRecording && (
            <div
              className="flex items-center justify-center gap-1.5 h-10 px-4 py-1"
              aria-hidden="true"
            >
              {audioLevel.map((lvl, idx) => (
                <div
                  key={idx}
                  className="w-1.5 bg-[#A94600] rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(8, lvl * 0.45)}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Voice Demo Presets */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#005B50]" />
            <span>
              {language === 'hi'
                ? 'त्वरित उदाहरण (एक क्लिक में आज़माएं)'
                : 'Quick Voice Presets (Try sample request)'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectPreset(p.text)}
                className="px-3 py-2 rounded-lg border border-[#D6D2C9] bg-[#F2EFE8] hover:bg-white text-xs font-semibold text-[#0B3A53] transition-colors text-left min-h-[44px] flex items-center"
              >
                {p.label[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Transcript Review & Editable Field */}
        <div className="space-y-2 pt-2 border-t border-[#D6D2C9]">
          <div className="flex items-center justify-between">
            <label
              htmlFor="transcript-box"
              className="text-xs font-bold text-[#18212B] uppercase tracking-wider flex items-center gap-2"
            >
              <span>{language === 'hi' ? 'ट्रांसक्रिप्ट समीक्षा (आवश्यकतानुसार सुधारें)' : 'Transcript Review (Edit if needed)'}</span>
            </label>
            {transcript && (
              <button
                type="button"
                onClick={() => {
                  setTranscript('');
                  setClassificationResult(null);
                }}
                className="text-xs text-[#A61B1B] hover:underline min-h-[36px] flex items-center px-2"
              >
                {language === 'hi' ? 'साफ़ करें' : 'Clear'}
              </button>
            )}
          </div>

          <textarea
            id="transcript-box"
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'बोला गया वाक्य यहाँ दिखेगा, या आप सीधे टाइप भी कर सकते हैं...'
                : 'What you speak will appear here, or you can type directly...'
            }
            className="w-full bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-3.5 text-sm sm:text-base text-[#18212B] focus:ring-2 focus:ring-[#005EA8] placeholder-[#4B5563]/60 leading-relaxed font-normal"
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!transcript.trim() || isClassifying}
              onClick={handleAnalyzeRequest}
              className="px-4 py-2 rounded-lg bg-[#0B3A53] text-white text-xs sm:text-sm font-semibold hover:bg-[#08283a] disabled:opacity-50 transition-colors flex items-center gap-2 min-h-[44px]"
            >
              {isClassifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'hi' ? 'पहचान हो रही है...' : 'Matching service...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#005B50]" />
                  <span>{language === 'hi' ? 'अनुरोध का मिलान करें' : 'Match Civic Service'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Service Match Result Screen (PRD Screen 4) */}
      {classificationResult && (
        <section
          aria-labelledby="match-heading"
          className={`border-2 rounded-2xl p-6 sm:p-8 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${
            classificationResult.status === 'matched'
              ? 'bg-white border-[#005B50]'
              : classificationResult.status === 'unsupported'
              ? 'bg-[#FFFDF8] border-[#A61B1B]/60'
              : 'bg-[#FFFDF8] border-[#A94600]/60'
          }`}
        >
          {classificationResult.status === 'matched' && classificationResult.service ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005B50]/10 text-[#005B50] text-xs font-bold border border-[#005B50]/30 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {language === 'hi' ? 'सेवा मिलान सफल' : 'Service Successfully Identified'} (
                      {Math.round(classificationResult.confidence * 100)}% match)
                    </span>
                  </div>
                  <h2 id="match-heading" className="text-xl sm:text-2xl font-bold text-[#0B3A53]">
                    {classificationResult.service.name[language]}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
                    {classificationResult.service.department[language]}
                  </p>
                </div>
              </div>

              {/* Service Details Card */}
              <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-[#4B5563] block">
                    {language === 'hi' ? 'सरकारी पोर्टल' : 'Official Portal'}
                  </span>
                  <a
                    href={classificationResult.service.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#005EA8] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{classificationResult.service.portalName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div>
                  <span className="font-semibold text-[#4B5563] block">
                    {language === 'hi' ? 'सरकारी शुल्क' : 'Official Government Fee'}
                  </span>
                  <span className="font-bold text-[#18212B] text-base mt-0.5 block">
                    {classificationResult.service.officialFee === 0
                      ? language === 'hi'
                        ? 'निःशुल्क (₹0)'
                        : 'Free (₹0)'
                      : `₹${classificationResult.service.officialFee}`}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-[#4B5563] block">
                    {language === 'hi' ? 'अनुमानित समय (SLA)' : 'Official SLA Time'}
                  </span>
                  <span className="font-bold text-[#18212B] text-base mt-0.5 block">
                    {classificationResult.service.estimatedDays}{' '}
                    {language === 'hi' ? 'कार्य दिवस' : 'working days'}
                  </span>
                </div>
              </div>

              {/* Plain language explanation */}
              <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-[#18212B] uppercase tracking-wider">
                  {language === 'hi' ? 'यह सेवा क्यों चुनी गई:' : 'Why this service was selected:'}
                </h4>
                <p className="text-sm text-[#18212B] leading-relaxed">
                  {classificationResult.matchedReason[language]}
                </p>
                <p className="text-xs text-[#005B50] font-medium pt-1">
                  ✓{' '}
                  {language === 'hi'
                    ? 'अगले चरण में आपको आवश्यक दस्तावेजों की सूची दिखाई जाएगी। किसी भी पोर्टल सबमिशन से पहले आपकी स्पष्ट अनुमति ली जाएगी।'
                    : 'Next, you will review the required documents checklist. No data is sent to the portal without your explicit affirmative confirmation.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#D6D2C9]">
                <button
                  type="button"
                  onClick={() => setClassificationResult(null)}
                  className="px-4 py-3 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-xs sm:text-sm font-semibold text-[#4B5563] min-h-[48px]"
                >
                  {language === 'hi' ? 'यह सही नहीं है (पुनः प्रयास करें)' : 'This is not right (Retry)'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onProceedToDocumentChecklist(classificationResult.service!, transcript)
                  }
                  className="px-6 py-3.5 rounded-xl bg-[#005B50] hover:bg-[#00473e] text-white font-semibold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 min-h-[50px] focus:ring-4 focus:ring-[#005B50]/30"
                >
                  <span>
                    {language === 'hi'
                      ? 'हाँ, यही सेवा चाहिए — दस्तावेज़ चेकलिस्ट देखें'
                      : 'Yes, this is my service — View Document Checklist'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Unsupported or Clarification State (PRD Section 6A & Section 8) */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#A61B1B]">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold">
                  {classificationResult.status === 'unsupported'
                    ? language === 'hi'
                      ? 'वर्तमान में असमर्थित सेवा (सीमा व्याख्या)'
                      : 'Service Outside MVP Scope'
                    : language === 'hi'
                    ? 'अधिक स्पष्टीकरण की आवश्यकता है'
                    : 'Clarification Needed'}
                </h3>
              </div>

              <p className="text-sm text-[#18212B] leading-relaxed">
                {classificationResult.matchedReason[language]}
              </p>

              <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 text-xs sm:text-sm text-[#4B5563] space-y-1">
                <span className="font-semibold text-[#18212B] block">
                  {language === 'hi' ? 'अनुशंसित सुरक्षित कदम:' : 'Recommended Safe Action:'}
                </span>
                <p>{classificationResult.suggestedAction[language]}</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setClassificationResult(null);
                    setTranscript('');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#0B3A53] text-white text-xs sm:text-sm font-semibold hover:bg-[#08283a]"
                >
                  {language === 'hi' ? 'अन्य समर्थित सेवा का अनुरोध करें' : 'Try another supported service'}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
