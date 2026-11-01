import React, { useState } from 'react';
import { KeypadPhoneView } from './KeypadPhoneView';

export const DemoSplitView: React.FC = () => {
  const [activeCaseId] = useState('INC-UP-2026');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Pratinidhi (JanSeva) — Autonomous Civic Agent</h1>
          <p className="text-xs text-blue-200">Hackathon Live Demo: Dual-Interface Voice & Kiosk Architecture</p>
        </div>
        <div className="bg-blue-800 px-3 py-1.5 rounded-lg text-sm border border-blue-700">
          Status: <span className="text-green-400 font-semibold">● Live API Connected</span>
        </div>
      </header>
      
      {/* Main Split Screen */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Side: The Citizen Phone Simulator */}
        <section className="w-1/2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">1. Citizen Phone Interface (Offline / Keypad)</h2>
            <p className="text-sm text-gray-500">
              Simulates a toll-free voice call, IVR prompts, DTMF keypad consent, and SMS notifications for non-digital native citizens.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <KeypadPhoneView />
          </div>
        </section>

        {/* Right Side: The Kiosk / Companion Portal */}
        <section className="w-1/2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-y-auto">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-lg font-bold text-gray-800">2. Companion / Kiosk Oversight Portal</h2>
            <p className="text-sm text-gray-500">
              Live audit logs, DigiLocker consent tracking, and portal payload preview for family members or local helpers.
            </p>
          </div>

          {/* Live Case Tracker Card */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Case</span>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">Needs Action</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Old Age Pension Revival & e-KYC</h3>
              <p className="text-sm text-gray-600 mt-1">Case ID: <span className="font-mono font-semibold">{activeCaseId}</span></p>
              <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-blue-900 flex justify-between">
                <span>Official Portal: UP Social Welfare (sspy-up.gov.in)</span>
                <span className="font-bold text-green-700">Official Fee: ₹0</span>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="border rounded-xl p-4">
              <h4 className="font-bold text-gray-800 text-sm mb-3">Immutable Audit Trail & Consent Log</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1 rounded-full bg-green-500 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Voice Intake Completed</p>
                    <p className="text-gray-500">Citizen intent parsed in Hindi. Mapped to UP Pension Revival.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Single-Use DigiLocker Consent</p>
                    <p className="text-gray-500">Confirmed via DTMF keypress [1] on toll-free call.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1 rounded-full bg-gray-300 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Tehsil Document Verification</p>
                    <p className="text-gray-500">Pending final clerk confirmation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-50 rounded-xl p-4 border text-xs text-gray-600">
              <span className="font-bold text-gray-800">🛡 Zero-Middleman Guarantee:</span> Passwords and OTPs are never stored or requested by the agent. Acknowledgements route directly to the citizen's phone.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
