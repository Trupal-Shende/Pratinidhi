import React, { useState, useEffect, useRef } from 'react';

type CallState = 'idle' | 'dialing' | 'intake' | 'consent' | 'processing' | 'rejected' | 'ended';

interface SMS {
    id: string;
    time: string;
    text: string;
}

export const KeypadPhoneView: React.FC = () => {
    const [callState, setCallState] = useState<CallState>('idle');
    const [agentText, setAgentText] = useState<string>('');
    const [smsList, setSmsList] = useState<SMS[]>([]);

    // Audio synthesis for the Agent's voice (using browser native for hackathon speed)
    const speak = (text: string, lang = 'hi-IN') => {
        setAgentText(text);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    };

    const addSms = (text: string) => {
        setSmsList(prev => [{ id: Date.now().toString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text }, ...prev]);
    };

    // State Machine Logic
    const handleDial = () => {
        setCallState('dialing');
        setTimeout(() => {
            setCallState('intake');
            speak("नमस्कार, जनसेवा में आपका स्वागत है। मुझे आय प्रमाण पत्र बनाने में आपकी सहायता करने दें। अपनी वार्षिक आय बताने के बाद 1 दबाएं।");
        }, 2000);
    };

    const handleKeypadPress = (key: string) => {
        if (callState === 'idle' || callState === 'dialing' || callState === 'ended') return;

        window.speechSynthesis.cancel(); // Stop current speech

        if (callState === 'intake' && key === '1') {
            setCallState('consent');
            addSms("JanSeva: Your Case ID INC-UP-2026 has been registered. Track here: janseva.in/INC-UP-2026. Official Fee: ₹0.");
            speak("धन्यवाद। आपके दस्तावेज़ डिजीलॉकर से सुरक्षित रूप से प्राप्त करने के लिए कृपया 1 दबाएं। या परिवार के सदस्य से अपलोड करवाने के लिए 2 दबाएं।");
        }
        else if (callState === 'consent' && key === '1') {
            setCallState('processing');
            speak("धन्यवाद। आपका फॉर्म सरकारी पोर्टल पर जमा किया जा रहा है। कृपया लाइन पर बने रहें।");

            // Simulate portal processing and success
            setTimeout(() => {
                addSms("JanSeva: Form Submitted Successfully. Acknowledgement: UP-INC-9912.");
                speak("आपका आवेदन सफलतापूर्वक जमा कर दिया गया है। रसीद आपके फोन पर SMS कर दी गई है। जनसेवा में कॉल करने के लिए धन्यवाद।");
                setCallState('ended');
            }, 4000);
        }
        else if (callState === 'rejected' && key === '1') {
            setCallState('processing');
            speak("धन्यवाद, हमने आपकी अपील तहसील कार्यालय को भेज दी है।");
            addSms("JanSeva: Appeal filed with Tehsil for missing income proof.");
            setTimeout(() => setCallState('ended'), 3000);
        }
    };

    const triggerRejectionFlow = () => {
        setCallState('rejected');
        speak("नमस्ते, तहसील कार्यालय ने आपके आय प्रमाण पत्र में अतिरिक्त जानकारी मांगी है। आपका आवेदन निरस्त नहीं हुआ है। अपील दर्ज करने के लिए 1 दबाएं।");
    };

    return (
        <div className="flex gap-8 max-w-4xl mx-auto p-6">
            {/* 1. Citizen Phone Simulator */}
            <div className="w-80 bg-gray-900 rounded-3xl p-4 shadow-2xl border-4 border-gray-800 flex flex-col h-[600px]">
                {/* Screen */}
                <div className="bg-gray-100 flex-1 rounded-xl mb-4 p-4 overflow-hidden flex flex-col">
                    <div className="text-center font-bold text-gray-800 mb-2 border-b pb-2">
                        {callState === 'idle' ? 'Ready to Call' : '☎ 1800-JAN-SEVA'}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        {callState !== 'idle' && callState !== 'ended' && (
                            <div className="animate-pulse text-green-600 font-bold mb-4">
                                ● 00:{callState === 'dialing' ? '00' : '14'}
                            </div>
                        )}
                        <p className="text-sm text-gray-600 italic">
                            {agentText ? `Agent: "${agentText}"` : ''}
                        </p>
                    </div>
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                        <button
                            key={key}
                            onClick={() => handleKeypadPress(key)}
                            className="bg-gray-800 text-white rounded-lg py-4 text-xl font-bold hover:bg-gray-700 active:bg-gray-600 transition"
                        >
                            {key}
                        </button>
                    ))}
                    <button
                        onClick={handleDial}
                        disabled={callState !== 'idle' && callState !== 'ended'}
                        className="col-span-1 bg-green-600 text-white rounded-lg py-4 text-xl font-bold hover:bg-green-500 disabled:opacity-50"
                    >
                        📞
                    </button>
                    <button
                        onClick={() => { window.speechSynthesis.cancel(); setCallState('ended'); }}
                        className="col-span-2 bg-red-600 text-white rounded-lg py-4 text-xl font-bold hover:bg-red-500"
                    >
                        End Call
                    </button>
                </div>
            </div>

            {/* 2. SMS Drawer & Dev Tools */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow p-4 border border-gray-200 flex-1">
                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">💬 Incoming SMS</h3>
                    <div className="flex flex-col gap-3">
                        {smsList.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center mt-10">No messages yet.</p>
                        ) : (
                            smsList.map(sms => (
                                <div key={sms.id} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <div className="text-xs text-blue-400 mb-1">{sms.time}</div>
                                    <div className="text-sm text-gray-800">{sms.text}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Dev Tools to trigger states for the judges */}
                <div className="bg-orange-50 rounded-xl shadow p-4 border border-orange-200">
                    <h3 className="font-bold text-orange-800 mb-2">Hackathon Demo Triggers</h3>
                    <button
                        onClick={triggerRejectionFlow}
                        className="w-full bg-orange-600 text-white py-2 rounded shadow hover:bg-orange-500 transition font-medium"
                    >
                        ⚠️ Simulate Portal Rejection & Callback
                    </button>
                </div>
            </div>
        </div>
    );
};