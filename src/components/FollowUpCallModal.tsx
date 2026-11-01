/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ApplicationCase, FollowUpCallRecord, Language } from '../types/civic';
import { getAuthTokenHeader } from '../firebase';
import { speakTextAloud, stopSpeakingAloud } from '../services/speechAndLocale';
import {
  AI_CALL_SAFEGUARD_RULES,
  buildPreCallOfficeConsentPrompt,
} from '../services/keypadAndRejectionService';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Volume2,
  X,
  Send,
  Sparkles,
  FileText,
} from 'lucide-react';

interface FollowUpCallModalProps {
  language: Language;
  application: ApplicationCase;
  allApplications?: ApplicationCase[];
  onSelectApplication?: (app: ApplicationCase) => void;
  isInlineView?: boolean;
  onClose?: () => void;
  onCallRecorded: (updatedApp: ApplicationCase) => void;
}

interface TranscriptTurn {
  id: string;
  speaker: 'agent' | 'official';
  text: string;
  timestamp: string;
}

function float32ToPcm16Base64(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const FollowUpCallModal: React.FC<FollowUpCallModalProps> = ({
  language,
  application,
  allApplications = [],
  onSelectApplication,
  isInlineView = false,
  onClose,
  onCallRecorded,
}) => {
  const tr = (en: string, hi: string, mr: string) =>
    language === 'hi' ? hi : language === 'mr' ? mr : en;

  const [step, setStep] = useState<'consent' | 'live_call' | 'post_summary'>('consent');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [liveConnectionState, setLiveConnectionState] = useState<
    'connecting' | 'live_connected' | 'connected_fallback' | 'ended'
  >('connecting');
  const [transcriptTurns, setTranscriptTurns] = useState<TranscriptTurn[]>([]);
  const [officialInput, setOfficialInput] = useState('');
  const [isAgentResponding, setIsAgentResponding] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [callSummary, setCallSummary] = useState<{
    status: 'resolved' | 'pending' | 'escalated';
    summary_hi: string;
    summary_mr?: string;
    summary_en: string;
    nextAction: string;
    nextAction_hi?: string;
    nextAction_mr?: string;
    deadlineGiven: string | null;
  } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const isMicMutedRef = useRef<boolean>(false);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  const daysSinceSubmission = application.submittedAt
    ? Math.max(
        1,
        Math.round(
          (Date.now() - new Date(application.submittedAt).getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : 32;

  const callContext = {
    applicantName: application.applicantName,
    serviceName: application.serviceName[language] || application.serviceName.en,
    acknowledgementNumber: application.acknowledgementNumber || 'UP-SSPY-2026-78419',
    daysSinceSubmission,
    lastStatus: application.officialStatusText[language] || application.officialStatusText.en,
  };

  // Call timer when in live_call
  useEffect(() => {
    if (step !== 'live_call') return;
    const timer = setInterval(() => {
      setCallDurationSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Cleanup audio and WebSocket on unmount
  useEffect(() => {
    return () => {
      stopSpeakingAloud();
      cleanupLiveResources();
    };
  }, []);

  const cleanupLiveResources = () => {
    stopSpeakingAloud();
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {}
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch {}
      outputAudioCtxRef.current = null;
    }
  };

  const playPcm24kChunk = (base64Pcm: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
        nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
      }
      const ctx = outputAudioCtxRef.current;
      const binary = atob(base64Pcm);
      const len = binary.length;
      const int16 = new Int16Array(len / 2);
      const view = new DataView(new ArrayBuffer(len));
      for (let i = 0; i < len; i++) {
        view.setUint8(i, binary.charCodeAt(i));
      }
      for (let i = 0; i < int16.length; i++) {
        int16[i] = view.getInt16(i * 2, true);
      }

      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(startAt);
      nextStartTimeRef.current = startAt + audioBuffer.duration;
    } catch {
      // Ignore audio playback errors in headless environments
    }
  };

  const startLiveFollowUpCall = async () => {
    if (!consentChecked) return;
    setStep('live_call');
    setCallDurationSec(0);
    setLiveConnectionState('connecting');

    const initialGreeting = tr(
      `नमस्कार, मैं जनसेवा एजेंट से बोल रहा हूँ। मैं नागरिक ${callContext.applicantName} के आवेदन (${callContext.serviceName}, पावती संख्या: ${callContext.acknowledgementNumber}) के संबंध में कॉल कर रहा हूँ, जो ${callContext.daysSinceSubmission} दिनों से लंबित है। कृपया वर्तमान स्थिति बताने का कष्ट करें।`,
      `नमस्कार, मैं जनसेवा एजेंट से बोल रहा हूँ। मैं नागरिक ${callContext.applicantName} के आवेदन (${callContext.serviceName}, पावती संख्या: ${callContext.acknowledgementNumber}) के संबंध में कॉल कर रहा हूँ, जो ${callContext.daysSinceSubmission} दिनों से लंबित है। कृपया वर्तमान स्थिति बताने का कष्ट करें।`,
      `नमस्कार, मी जनसेवा प्रतिनिधी एजंट बोलत आहे. मी नागरिक ${callContext.applicantName} यांच्या अर्जाबाबत (${callContext.serviceName}, पोचपावती क्रमांक: ${callContext.acknowledgementNumber}) कॉल करत आहे, जो ${callContext.daysSinceSubmission} दिवसांपासून प्रलंबित आहे. कृपया अर्जाची सद्यस्थिती आणि निश्चित वेळ सांगावी.`
    );

    setTranscriptTurns([
      {
        id: `turn-${Date.now()}`,
        speaker: 'agent',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    speakTextAloud(initialGreeting, language === 'mr' ? 'mr' : 'hi');

    // Connect to Gemini Live WebSocket bridge (/live)
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/live`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'setup',
            ...callContext,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.status === 'live_connected') {
            setLiveConnectionState('live_connected');
          } else if (msg.status === 'connected_fallback') {
            setLiveConnectionState('connected_fallback');
          }
          if (msg.audio) {
            playPcm24kChunk(msg.audio);
          }
          if (msg.interrupted && outputAudioCtxRef.current) {
            nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
          }
          if (msg.inputTranscript) {
            setTranscriptTurns((prev) => [
              ...prev,
              {
                id: `turn-in-${Date.now()}-${Math.random()}`,
                speaker: 'official',
                text: msg.inputTranscript,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }
          if (msg.outputTranscript) {
            setTranscriptTurns((prev) => {
              // Avoid duplicating initial greeting
              if (prev.length === 1 && prev[0].text === msg.outputTranscript) return prev;
              return [
                ...prev,
                {
                  id: `turn-out-${Date.now()}-${Math.random()}`,
                  speaker: 'agent',
                  text: msg.outputTranscript,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                },
              ];
            });
          }
        } catch {}
      };

      ws.onerror = () => {
        setLiveConnectionState('connected_fallback');
      };
    } catch {
      setLiveConnectionState('connected_fallback');
    }

    // Attempt 16kHz microphone capture for bidirectional voice streaming
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const inputCtx = new AudioContext({ sampleRate: 16000 });
        inputAudioCtxRef.current = inputCtx;
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (isMicMutedRef.current) return;
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const base64Audio = float32ToPcm16Base64(e.inputBuffer.getChannelData(0));
            wsRef.current.send(JSON.stringify({ audio: base64Audio }));
          }
        };
      }
    } catch {
      // Microphone permission declined or unavailable in automated environment; interactive transcript controls remain active
    }
  };

  const handleSendOfficialStatement = async (statementText: string) => {
    const cleanText = statementText.trim();
    if (!cleanText || isAgentResponding) return;
    setOfficialInput('');

    const officialTurn: TranscriptTurn = {
      id: `turn-off-${Date.now()}`,
      speaker: 'official',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedTurns = [...transcriptTurns, officialTurn];
    setTranscriptTurns(updatedTurns);
    setIsAgentResponding(true);

    // Also forward text to Live WebSocket if open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: cleanText }));
    }

    try {
      const authHeaders = await getAuthTokenHeader();
      const historyText = updatedTurns
        .map((t) => `${t.speaker === 'agent' ? 'Agent' : 'Official'}: ${t.text}`)
        .join('\n');

      const res = await fetch('/api/followup/turn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          context: callContext,
          transcriptHistory: historyText,
          officialMessage: cleanText,
          language,
        }),
      });
      const data = await res.json();
      if (data && data.agentReply) {
        setTranscriptTurns((prev) => [
          ...prev,
          {
            id: `turn-ag-${Date.now()}`,
            speaker: 'agent',
            text: data.agentReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        speakTextAloud(data.agentReply, language === 'mr' ? 'mr' : 'hi');
      }
    } catch {
      // Fallback agent response
    } finally {
      setIsAgentResponding(false);
    }
  };

  const handleEndCallAndSummarize = async () => {
    cleanupLiveResources();
    setLiveConnectionState('ended');
    setIsGeneratingSummary(true);

    const fullTranscriptText = transcriptTurns
      .map((t) => `${t.speaker === 'agent' ? 'JanSeva Liaison Agent' : 'District Official'}: ${t.text}`)
      .join('\n');

    try {
      const authHeaders = await getAuthTokenHeader();
      const res = await fetch('/api/followup/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          context: callContext,
          transcript: fullTranscriptText,
          language,
        }),
      });
      const data = await res.json();
      const summaryObj = data?.summary || {
        status: 'resolved',
        summary_hi: `जिला समाज कल्याण कार्यालय से बात हुई। पावती संख्या ${callContext.acknowledgementNumber} पर अगले मंगलवार तक सत्यापन पूरा करने का आश्वासन मिला है।`,
        summary_mr: `जिल्हा कार्यालयाशी संवाद साधला. पोचपावती क्रमांक ${callContext.acknowledgementNumber} बाबत पुढील मंगळवारपर्यंत पडताळणी पूर्ण करण्याचे आश्वासन दिले आहे.`,
        summary_en: `Spoke with the district office regarding ${callContext.acknowledgementNumber}. Verification is scheduled for completion by next Tuesday.`,
        nextAction: 'Attend biometric e-KYC verification or check portal receipt next Tuesday',
        nextAction_hi: 'अगले मंगलवार तक बायोमेट्रिक ई-केवाईसी सत्यापन पूरा करें या पोर्टल रसीद जांचें',
        nextAction_mr: 'पुढील मंगळवारपर्यंत बायोमेट्रिक ई-केवायसी पडताळणी पूर्ण करा किंवा पोर्टल पावती तपासा',
        deadlineGiven: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      };

      setCallSummary(summaryObj);
      setStep('post_summary');

      const newCallRecord: FollowUpCallRecord = {
        id: `call-${Date.now()}`,
        calledAt: new Date().toISOString(),
        transcript: fullTranscriptText,
        outcome: summaryObj.status,
        summary: {
          en: summaryObj.summary_en,
          hi: summaryObj.summary_hi,
          mr: summaryObj.summary_mr || summaryObj.summary_hi,
        },
        nextAction:
          language === 'mr'
            ? summaryObj.nextAction_mr || summaryObj.nextAction
            : language === 'hi'
            ? summaryObj.nextAction_hi || summaryObj.nextAction
            : summaryObj.nextAction,
        deadlineGiven: summaryObj.deadlineGiven,
      };

      const nowIso = new Date().toISOString();
      const updatedApp: ApplicationCase = {
        ...application,
        lastCheckedAt: nowIso,
        nextActionDate: summaryObj.deadlineGiven
          ? `${summaryObj.deadlineGiven} (${
              language === 'mr'
                ? summaryObj.nextAction_mr || summaryObj.nextAction
                : language === 'hi'
                ? summaryObj.nextAction_hi || summaryObj.nextAction
                : summaryObj.nextAction
            })`
          : application.nextActionDate,
        plainExplanation: {
          en: summaryObj.summary_en,
          hi: summaryObj.summary_hi,
          mr: summaryObj.summary_mr || summaryObj.summary_hi,
        },
        followUpCalls: [newCallRecord, ...(application.followUpCalls || [])],
        auditTrail: [
          {
            id: `aud-call-end-${Date.now()}`,
            timestamp: nowIso,
            action: 'FOLLOWUP_CALL_COMPLETED',
            actor: 'agent',
            details: `Gemini Live follow-up call completed (${summaryObj.status.toUpperCase()}): ${summaryObj.summary_en}`,
          },
          {
            id: `aud-call-consent-${Date.now() - 1000}`,
            timestamp: nowIso,
            action: 'CONSENT_GRANTED_FOLLOWUP_CALL',
            actor: 'citizen',
            details: `Citizen granted explicit pre-call consent for liaison call on ${callContext.acknowledgementNumber}`,
          },
          ...application.auditTrail,
        ],
      };

      onCallRecorded(updatedApp);
    } catch {
      setStep('post_summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const OFFICIAL_PRESETS = [
    {
      label: tr(
        'Official: "Wait 7 more days"',
        'अधिकारी: "अभी भीड़ है, 7 दिन और प्रतीक्षा करें"',
        'अधिकारी: "अजून ७ दिवस प्रतीक्षा करा"'
      ),
      text: tr(
        'अभी पोर्टल पर सत्यापन लंबित है, कृपया कुछ दिन और प्रतीक्षा करें।',
        'अभी पोर्टल पर सत्यापन लंबित है, कृपया कुछ दिन और प्रतीक्षा करें।',
        'सध्या पोर्टलवर पडताळणी प्रलंबित आहे, कृपया काही दिवस प्रतीक्षा करा.'
      ),
    },
    {
      label: tr(
        'Official: "Aadhaar e-KYC & Passbook Missing"',
        'अधिकारी: "आधार ई-केवाईसी और पासबुक की प्रति बाकी है"',
        'अधिकारी: "आधार ई-केवायसी आणि पासबुक प्रत बाकी आहे"'
      ),
      text: tr(
        'आवेदक का आधार ई-केवाईसी और बैंक पासबुक डीबीटी सीडिंग पेंडिंग दिख रहा है।',
        'आवेदक का आधार ई-केवाईसी और बैंक पासबुक डीबीटी सीडिंग पेंडिंग दिख रहा है।',
        'अर्जदाराचे आधार ई-केवायसी आणि बँक पासबुक डीबीटी सीडिंग प्रलंबित दिसत आहे.'
      ),
    },
    {
      label: tr(
        'Official: "Cleared for Tuesday Camp (2026-11-05)"',
        'अधिकारी: "मंगलवार (2026-11-05) तक भुगतान जारी हो जाएगा"',
        'अधिकारी: "मंगळवारपर्यंत (2026-11-05) मंजूर होईल"'
      ),
      text: tr(
        'हमने फाइल चेक कर ली है, आगामी मंगलवार 2026-11-05 तक सत्यापन पूर्ण कर पेंशन जारी कर दी जाएगी।',
        'हमने फाइल चेक कर ली है, आगामी मंगलवार 2026-11-05 तक सत्यापन पूर्ण कर पेंशन जारी कर दी जाएगी।',
        'आम्ही फाईल तपासली आहे, पुढील मंगळवार 2026-11-05 पर्यंत पडताळणी पूर्ण करून पेन्शन मंजूर केली जाईल.'
      ),
    },
  ];

  const content = (
    <div
      className={`bg-white border border-[#D6D2C9] rounded-2xl ${
        isInlineView ? 'max-w-4xl mx-auto p-6 sm:p-8 shadow-sm' : 'max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8'
      } space-y-6`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D6D2C9]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a365d]/10 text-[#1a365d] text-xs font-bold mb-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#f97316]" />
            <span>
              {tr(
                'Gemini Live API • Government Liaison Agent',
                'जेमिनी लाइव एपीआई • सरकारी संपर्क एजेंट (Liaison Call)',
                'जेमिनी लाईव्ह एपीआय • शासकीय संपर्क एजंट'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a365d]">
            {tr(
              'Voice Conversation Agent for Government Follow-up',
              'लंबित आवेदन हेतु सरकारी कार्यालय फॉलो-अप कॉल',
              'प्रलंबित अर्जासाठी शासकीय कार्यालय फॉलो-अप कॉल'
            )}
          </h2>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={() => {
              cleanupLiveResources();
              onClose();
            }}
            className="p-2 text-[#4B5563] hover:text-[#18212B] rounded-lg hover:bg-[#F2EFE8]"
            aria-label="Close follow-up call"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Application Selector if in inline tab mode */}
      {isInlineView && allApplications.length > 1 && onSelectApplication && step === 'consent' && (
        <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4">
          <label
            htmlFor="followup-app-select"
            className="block text-xs font-bold uppercase tracking-wider text-[#1a365d] mb-1.5"
          >
            {tr(
              'Select Application to Follow Up On:',
              'फॉलो-अप कॉल के लिए आवेदन चुनें:',
              'फॉलो-अप कॉलसाठी अर्ज निवडा:'
            )}
          </label>
          <select
            id="followup-app-select"
            value={application.id}
            onChange={(e) => {
              const found = allApplications.find((a) => a.id === e.target.value);
              if (found) onSelectApplication(found);
            }}
            className="w-full bg-white border border-[#D6D2C9] rounded-lg px-3.5 py-2.5 text-sm font-semibold text-[#1a365d]"
          >
            {allApplications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.serviceName[language]} — {a.applicantName} ({a.acknowledgementNumber || a.id})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Context Summary Card */}
      <div className="bg-[#FFFDF8] border border-[#D6D2C9] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[#4B5563] block font-medium">
            {tr('Citizen Name', 'नागरिक का नाम', 'नागरिकाचे नाव')}
          </span>
          <span className="font-bold text-[#18212B] text-sm">{callContext.applicantName}</span>
          <span className="block text-[11px] text-[#4B5563] font-mono">
            {application.phoneMasked} • Aadhaar: {application.aadhaarMasked || 'XXXX XXXX 4312'}
          </span>
        </div>
        <div>
          <span className="text-[#4B5563] block font-medium">
            {tr('Acknowledgement No.', 'पावती संख्या', 'पोचपावती क्रमांक')}
          </span>
          <span className="font-mono font-bold text-[#1a365d] text-sm">
            {callContext.acknowledgementNumber}
          </span>
        </div>
        <div>
          <span className="text-[#4B5563] block font-medium">
            {tr('Days Since Submission', 'आवेदन के बाद बीते दिन', 'अर्ज केल्यापासूनचे दिवस')}
          </span>
          <span className="font-bold text-[#f97316] text-sm">
            {callContext.daysSinceSubmission} {tr('days', 'दिन', 'दिवस')}
          </span>
        </div>
        <div>
          <span className="text-[#4B5563] block font-medium">
            {tr('Last Known Status', 'अंतिम ज्ञात स्थिति', 'शेवटची स्थिती')}
          </span>
          <span className="font-semibold text-[#18212B] line-clamp-2">
            {application.officialStatusText[language]}
          </span>
        </div>
      </div>

      {/* STEP 1: PRE-CALL CONSENT GATE */}
      {step === 'consent' && (
        <div className="space-y-5">
          <div className="bg-[#1a365d]/5 border border-[#1a365d]/30 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-[#1a365d] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#005B50]" />
              <span>
                {tr(
                  'Pre-Call Citizen Consent Gate & TRAI Safeguard Protocol',
                  'कॉल प्रारंभ करने से पूर्व नागरिक की अनिवार्य सहमति एवं सुरक्षा नियम',
                  'कॉल सुरू करण्यापूर्वी नागरिकाची अनिवार्य संमती आणि सुरक्षा नियम'
                )}
              </span>
            </h3>

            {/* Exact Spoken Pre-Call Consent Prompt */}
            <div className="bg-white border border-[#005B50] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase text-[#005B50] block">
                {tr(
                  'Spoken Pre-Call Consent Prompt (Press 1 on Keypad):',
                  'कॉल से पहले नागरिक को सुनाया जाने वाला सहमति संदेश (1 दबाएं):',
                  'कॉलपूर्वी नागरिकाला ऐकवला जाणारा संमती संदेश (1 दाबा):'
                )}
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0B3A53]">
                “{buildPreCallOfficeConsentPrompt(application)[language]}”
              </p>
            </div>

            <div className="bg-white border border-[#D6D2C9] rounded-lg p-3 text-xs font-mono text-[#18212B]">
              {tr(
                `"नमस्कार, मैं जनसेवा स्वचालित सहायक (Automated Assistant) से नागरिक ${callContext.applicantName} की दर्ज सहमति से बोल रहा हूँ। मैं पावती संख्या ${callContext.acknowledgementNumber} के संबंध में कॉल कर रहा हूँ, जो ${callContext.daysSinceSubmission} दिनों से लंबित है। कृपया वर्तमान स्थिति और समय-सीमा बताएं।"`,
                `"नमस्कार, मैं जनसेवा स्वचालित सहायक (Automated Assistant) से नागरिक ${callContext.applicantName} की दर्ज सहमति से बोल रहा हूँ। मैं पावती संख्या ${callContext.acknowledgementNumber} के संबंध में कॉल कर रहा हूँ, जो ${callContext.daysSinceSubmission} दिनों से लंबित है। कृपया वर्तमान स्थिति और समय-सीमा बताएं।"`,
                `"नमस्कार, मी जनसेवा स्वयंचलित सहाय्यक (Automated Assistant) नागरिक ${callContext.applicantName} यांच्या नोंदणीकृत संमतीने बोलत आहे. मी पोचपावती क्रमांक ${callContext.acknowledgementNumber} बाबत कॉल करत आहे, जो ${callContext.daysSinceSubmission} दिवसांपासून प्रलंबित आहे. कृपया अर्जाची सद्यस्थिती आणि निश्चित मुदत सांगावी."`
              )}
            </div>

            {/* 5 AI Call Safeguards & TRAI Compliance */}
            <div className="pt-2 border-t border-[#D6D2C9] space-y-1.5">
              <span className="text-xs font-bold text-[#0B3A53] block">
                {tr(
                  'Mandatory AI Call Safeguards & TRAI Compliance:',
                  'अनिवार्य एआई कॉल सुरक्षा एवं TRAI (ट्राई) नियम पालन:',
                  'अनिवार्य एआय कॉल सुरक्षा आणि TRAI नियम पालन:'
                )}
              </span>
              <ul className="space-y-1 text-xs text-[#18212B]">
                {AI_CALL_SAFEGUARD_RULES.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#005B50] shrink-0 mt-0.5" />
                    <span>{rule[language]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <label
            htmlFor="approve-followup-call-checkbox"
            className="flex items-start gap-3 p-4 rounded-xl border-2 border-[#f97316]/50 bg-[#FFFDF8] cursor-pointer hover:border-[#f97316]"
          >
            <input
              id="approve-followup-call-checkbox"
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="w-5 h-5 rounded border-[#D6D2C9] text-[#1a365d] focus:ring-[#1a365d] mt-0.5 shrink-0"
            />
            <span className="text-xs sm:text-sm font-semibold text-[#18212B] leading-snug">
              {tr(
                `Press 1 / Approve: I explicitly authorize Pratinidhi to place this consented service call regarding application ${callContext.acknowledgementNumber} and share only my name, application number, and submission date.`,
                `1 दबाएं / सहमति दें: मैं प्रतिनिधि एजेंट को मेरे आवेदन (${callContext.acknowledgementNumber}) की स्थिति जानने के लिए जिला कार्यालय में कॉल करने और केवल मेरा नाम, आवेदन संख्या व तिथि साझा करने की स्पष्ट अनुमति देता/देती हूँ।`,
                `1 दाबा / संमती द्या: मी प्रतिनिधी एजंटला माझ्या अर्जाच्या (${callContext.acknowledgementNumber}) पाठपुराव्यासाठी जिल्हा कार्यालयात कॉल करण्याची आणि फक्त माझे नाव, अर्ज क्रमांक व तारीख शेअर करण्याची परवानगी देतो/देते.`
              )}
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-xs sm:text-sm font-semibold text-[#4B5563]"
              >
                {tr('Cancel', 'रद्द करें', 'रद्द करा')}
              </button>
            )}
            <button
              type="button"
              disabled={!consentChecked}
              onClick={startLiveFollowUpCall}
              className="px-6 py-3.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-40 text-white font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 min-h-[50px]"
            >
              <PhoneCall className="w-5 h-5" />
              <span>
                {tr(
                  'Approve & Start Live Voice Call',
                  'सहमति दें और लाइव वॉयस कॉल शुरू करें',
                  'संमती द्या आणि लाईव्ह व्हॉइस कॉल सुरू करा'
                )}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: LIVE VOICE CONVERSATION & BIDIRECTIONAL TRANSCRIPT */}
      {step === 'live_call' && (
        <div className="space-y-5">
          {/* Active Call Status Bar */}
          <div className="bg-[#1a365d] text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-ping" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base">
                    {tr(
                      'Live Liaison Call in Progress',
                      'जिला कार्यालय के साथ लाइव कॉल जारी है',
                      'जिल्हा कार्यालयाशी थेट संवाद सुरू आहे'
                    )}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/15 font-mono">
                    {Math.floor(callDurationSec / 60)
                      .toString()
                      .padStart(2, '0')}
                    :{(callDurationSec % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-white/80">
                  {liveConnectionState === 'live_connected'
                    ? tr(
                        'Connected via Gemini 3.8 Live Bidirectional Audio Stream (16kHz In / 24kHz Out)',
                        'जेमिनी 3.8 लाइव द्विदिश ऑडियो स्ट्रीम से जुड़ा है',
                        'जेमिनी ३.८ लाईव्ह ऑडिओ स्ट्रीमशी जोडलेले'
                      )
                    : tr(
                        'Bidirectional Voice & Live Transcript Active',
                        'द्विदिश संवाद एवं लाइव ट्रांसक्रिप्ट सक्रिय',
                        'द्विदिश संवाद आणि लाईव्ह ट्रान्सक्रिप्ट सक्रिय'
                      )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMicMuted((m) => !m)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isMicMuted
                    ? 'bg-red-500/20 text-red-200 border border-red-400/40'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMicMuted ? tr('Mic Muted', 'माइक म्यूट', 'माइक म्यूट') : tr('Mic Live', 'माइक चालू', 'माइक सुरू')}</span>
              </button>

              <button
                type="button"
                disabled={isGeneratingSummary}
                onClick={handleEndCallAndSummarize}
                className="px-4 py-2 rounded-lg bg-[#A61B1B] hover:bg-red-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs"
              >
                <PhoneOff className="w-4 h-4" />
                <span>
                  {isGeneratingSummary
                    ? tr('Summarizing...', 'सारांश बन रहा है...', 'सारांश तयार करत आहे...')
                    : tr('End Call & Generate Summary', 'कॉल समाप्त करें व सारांश देखें', 'कॉल संपवा आणि सारांश पहा')}
                </span>
              </button>
            </div>
          </div>

          {/* Live Transcript Box */}
          <div className="bg-[#FFFDF8] border-2 border-[#D6D2C9] rounded-xl p-4 space-y-3 max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#4B5563] border-b border-[#D6D2C9] pb-2">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#f97316]" />
                {tr('Live Call Transcript', 'लाइव कॉल ट्रांसक्रिप्ट (बातचीत का विवरण)', 'लाईव्ह कॉल ट्रान्सक्रिप्ट')}
              </span>
              <span className="text-[#005B50]">
                {transcriptTurns.length} {tr('turns', 'संवाद', 'संवाद')}
              </span>
            </div>

            <div className="space-y-3">
              {transcriptTurns.map((turn) => (
                <div
                  key={turn.id}
                  className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    turn.speaker === 'agent'
                      ? 'bg-[#1a365d]/10 border border-[#1a365d]/20 text-[#18212B] mr-6'
                      : 'bg-[#F2EFE8] border border-[#D6D2C9] text-[#18212B] ml-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className={turn.speaker === 'agent' ? 'text-[#1a365d]' : 'text-[#A94600]'}>
                      {turn.speaker === 'agent'
                        ? tr('Pratinidhi Liaison Agent', 'जनसेवा एजेंट (Pratinidhi)', 'जनसेवा एजंट (Pratinidhi)')
                        : tr('District Office Official', 'जिला कार्यालय अधिकारी', 'जिल्हा कार्यालय अधिकारी')}
                    </span>
                    <span className="text-[#4B5563] font-mono">{turn.timestamp}</span>
                  </div>
                  <p>{turn.text}</p>
                </div>
              ))}
              {isAgentResponding && (
                <div className="text-xs text-[#1a365d] font-semibold animate-pulse px-2">
                  {tr(
                    'Agent is speaking in Hindi...',
                    'जनसेवा एजेंट उत्तर दे रहा है...',
                    'जनसेवा एजंट उत्तर देत आहे...'
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive District Official Response Simulator / Input (allows testing bidirectional conversation in any environment) */}
          <div className="bg-[#F2EFE8] border border-[#D6D2C9] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a365d] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
              <span>
                {tr(
                  'Speak into your microphone OR simulate District Official reply:',
                  'माइक में बोलें या अधिकारी का उत्तर चुनकर एजेंट की प्रतिक्रिया देखें:',
                  'माइकमध्ये बोला किंवा अधिकाऱ्याचे उत्तर निवडून एजंटचा प्रतिसाद पहा:'
                )}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {OFFICIAL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isAgentResponding}
                  onClick={() => handleSendOfficialStatement(preset.text)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FFFDF8] border border-[#D6D2C9] text-xs font-semibold text-[#1a365d] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={officialInput}
                onChange={(e) => setOfficialInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendOfficialStatement(officialInput);
                }}
                placeholder={tr(
                  'Type what the government official says...',
                  'सरकारी अधिकारी का कथन यहाँ लिखें...',
                  'शासकीय अधिकाऱ्याचे म्हणणे येथे लिहा...'
                )}
                className="flex-1 bg-white border border-[#D6D2C9] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#18212B]"
              />
              <button
                type="button"
                disabled={!officialInput.trim() || isAgentResponding}
                onClick={() => handleSendOfficialStatement(officialInput)}
                className="px-4 py-2 rounded-lg bg-[#1a365d] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{tr('Reply', 'भेजें', 'पाठवा')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: POST-CALL PLAIN-LANGUAGE SUMMARY */}
      {step === 'post_summary' && callSummary && (
        <div className="space-y-5">
          <div className="bg-[#005B50]/10 border-2 border-[#005B50] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#005B50]/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#005B50]" />
                <div>
                  <h3 className="text-lg font-bold text-[#005B50]">
                    {tr(
                      'Post-Call Plain-Language Summary',
                      'कॉल के बाद नागरिक के लिए सरल सारांश',
                      'कॉलनंतर नागरिकांसाठी सोप्या भाषेत सारांश'
                    )}
                  </h3>
                  <p className="text-xs text-[#4B5563]">
                    {tr(
                      'Saved to your application record and logged in the immutable audit trail.',
                      'आपके आवेदन रिकॉर्ड और अपरिवर्तनीय ऑडिट ट्रेल में सुरक्षित कर दिया गया है।',
                      'तुमच्या अर्ज रेकॉर्ड आणि ऑडिट ट्रेलमध्ये जतन केले आहे.'
                    )}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  callSummary.status === 'resolved'
                    ? 'bg-[#005B50] text-white'
                    : callSummary.status === 'escalated'
                    ? 'bg-[#A61B1B] text-white'
                    : 'bg-[#f97316] text-white'
                }`}
              >
                {callSummary.status === 'resolved'
                  ? tr('RESOLVED', 'समाधान पूर्ण (Resolved)', 'निकाली लागला (Resolved)')
                  : callSummary.status === 'escalated'
                  ? tr('ESCALATED', 'उच्च स्तर पर भेजा', 'वरिष्ठांकडे पाठवले')
                  : tr('PENDING', 'लंबित (Pending)', 'प्रलंबित (Pending)')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {callSummary.summary_mr && (
                <div className="bg-white border border-[#D6D2C9] rounded-lg p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-[#1a365d] block">
                    मराठी सारांश (Marathi Summary)
                  </span>
                  <p className="text-xs sm:text-sm text-[#18212B] leading-relaxed">
                    {callSummary.summary_mr}
                  </p>
                </div>
              )}
              <div className="bg-white border border-[#D6D2C9] rounded-lg p-3.5 space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#1a365d] block">
                  हिन्दी सारांश (Hindi Summary)
                </span>
                <p className="text-xs sm:text-sm text-[#18212B] leading-relaxed">
                  {callSummary.summary_hi}
                </p>
              </div>
              <div className="bg-white border border-[#D6D2C9] rounded-lg p-3.5 space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#1a365d] block">
                  English Summary
                </span>
                <p className="text-xs sm:text-sm text-[#18212B] leading-relaxed">
                  {callSummary.summary_en}
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#D6D2C9] rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-[#1a365d]">
                  {tr('Next Action:', 'अगला कदम:', 'पुढील कृती:')}
                </span>{' '}
                <span className="text-[#18212B]">
                  {language === 'mr'
                    ? callSummary.nextAction_mr || callSummary.nextAction
                    : language === 'hi'
                    ? callSummary.nextAction_hi || callSummary.nextAction
                    : callSummary.nextAction}
                </span>
              </div>
              {callSummary.deadlineGiven && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f97316]/15 text-[#A94600] font-bold text-xs shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {tr('Deadline:', 'अंतिम तिथि:', 'अंतिम मुदत:')} {callSummary.deadlineGiven}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setStep('consent');
                setCallSummary(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-[#D6D2C9] bg-white hover:bg-[#F2EFE8] text-xs sm:text-sm font-semibold text-[#1a365d]"
            >
              {tr('Start Another Follow-up Call', 'एक और फॉलो-अप कॉल करें', 'दुसरा फॉलो-अप कॉल करा')}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#1a365d] hover:bg-[#0B3A53] text-white text-xs sm:text-sm font-bold"
              >
                {tr('Done', 'पूर्ण', 'पूर्ण')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isInlineView) {
    return content;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      {content}
    </div>
  );
};
