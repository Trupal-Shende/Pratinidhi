# Pratinidhi (प्रतिनिधि) — JanSeva Civic Agent

> **Autonomous, Voice-First Civic Agent for Indian Government Services**  
> *Built for Eigi Hackathon • Problem Statement: CITY-02 "Every Citizen Gets an Agent"*

---

## 1. Overview & Purpose

In India, accessing essential government welfare—whether reviving a halted pension, applying for an income certificate, or obtaining a domicile document—forces citizens to navigate Byzantine portals, fragmented forms, and unhelpful helplines. The citizens who need these public entitlements most—the elderly, daily-wage migrants, and non-literate individuals—are the least equipped to operate desktop web forms or decipher bureaucratic error codes. Consequently, millions fall prey to unauthorized middlemen (*dalals*) who extract extortionate fees and hoard citizens' private OTPs and identity cards.

**Pratinidhi** fundamentally rethinks civic delivery around a radical design principle: **an illiterate citizen should never be forced to navigate a website or upload a PDF.** 

Pratinidhi transforms civic engagement into a natural, voice-driven phone experience accessible from any basic ₹1,200 feature phone. Citizens state their need naturally in everyday Hindi, understand what documents are required, grant single-use DigiLocker access via numeric keypad keys (DTMF), receive verifiable ₹0 official fee SMS receipts, and get plain-language voice callbacks whenever an application stalls or requires clarification.

---

## 2. Dual-Interface Architecture

Pratinidhi solves the digital divide by decoupling the **citizen interaction tier** from the **oversight and auditing tier**. The evaluation demo presents these two interfaces side-by-side:

```
┌─────────────────────────────────────────┬─────────────────────────────────────────┐
│     1. CITIZEN PHONE SIMULATOR          │   2. COMPANION / KIOSK OVERSIGHT PORTAL │
│      (Voice-First / Keypad Channel)     │         (Audit & Family Helper Tier)    │
├─────────────────────────────────────────┼─────────────────────────────────────────┤
│ • Toll-free dialer (1800-JAN-SEVA)      │ • Real-time case tracker & state machine│
│ • Natural spoken Hindi voice synthesis  │ • Immutable audit trail & consent logs  │
│ • DTMF keypad consent ("Press 1")       │ • Purpose-limited DigiLocker disclosure │
│ • Direct SMS inbox & receipt extraction │ • Zero-Middleman guarantee: Fee = ₹0    │
│ • Rejection & stall callback simulation │ • Official government portal payload    │
└─────────────────────────────────────────┴─────────────────────────────────────────┘
```

### Interface 1: The Citizen Phone Interface (Offline / Keypad Channel)
- **Primary Persona:** Non-literate or rural citizens using standard feature phones (2G/keypad) with no desktop or app access.
- **Role:** Handles conversational voice intake in regional dialects (Hindi/English), captures case parameters without confusing multi-step forms, confirms identity consent via DTMF keypresses (`1` to approve, `2` for proxy assistance), and delivers SMS notifications containing official case references directly to the citizen's mobile.
- **Edge-Case Resilience:** When a government portal stalls or rejects an application (e.g., *Tehsil Lekhpal* asks for additional income proof), the voice agent places an outbound call to the citizen, explains the issue in colloquial spoken terms, and collects authorization to appeal or follow up with the district office.

### Interface 2: The Companion & Kiosk Oversight Portal
- **Primary Persona:** Family members, CSC (Common Service Centre) village kiosk operators, or Gram Panchayat helpers.
- **Role:** Serves as a transparent audit window. Displays live telemetry, portal transmission payloads, and cryptographically segregated application states.
- **Zero-Discretion Protection:** Designed so that third-party helpers or field operators cannot alter citizen answers, intercept OTPs, or siphon private documents. All official receipts and acknowledgement tokens route directly to the citizen's personal phone.

---

## 3. Technology Stack

| Layer | Technologies & Libraries | Architectural Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** (`react` 19.0.1, `react-dom` 19.0.1) | Component-driven UI rendering the Dual-Screen Interactive Simulator. |
| **Language & Tooling** | **TypeScript 7**, **Vite 8** (`@vitejs/plugin-react` 6.1.1) | Strict end-to-end type safety, modern ESM compilation, and hot module replacement. |
| **Styling & Icons** | **Tailwind CSS v4** (`@tailwindcss/vite` 4.3.3), **Lucide React** | High-contrast, mobile-responsive civic design system adhering to Indian government portal aesthetics. |
| **Backend Server** | **Node.js 22+**, **Express 4** (`express` 4.21.2), **TSX** | Unified API and static asset server hosting all services on a single port without CORS overhead. |
| **Speech & Audio** | **Groq SDK** (`groq-sdk` 1.6.0), **Whisper Large v3**, Web Speech API | Multi-lingual audio transcription handling colloquial Hindi/English, backed by browser speech synthesis for interactive IVR audio. |
| **Security & Middleware**| **Helmet 8** (`helmet` 8.3.0), **Express Rate Limit 8**, **Multer 2** | Pre-launch security hardening: anti-clickjacking frameguards, strict IP rate limiting (15 req/min on AI routes), and bounded 10MB in-memory audio buffers. |
| **Authentication** | **Bearer Token Middleware**, **JSONWebToken** (`jsonwebtoken` 9.0.3) | Token-verified route gating with strict tenant ID isolation (`req.user.id`) preventing IDOR data leaks. |
| **Testing** | **Node Native Test Runner** (`npx tsx --test`) | Zero-dependency unit testing for civic service mapping, document quality validation, and intent classification. |

---

## 4. Judge Setup & Evaluation Guide

Follow these steps to run and evaluate the complete project on your local workstation in under 2 minutes.

### Prerequisites
- **Node.js**: Version `20.0.0` or higher (Node 22 LTS recommended)
- **Package Manager**: `npm` (comes bundled with Node)
- **Git**: Installed and available in your terminal path

### Step 1: Clone the Repository
```bash
git clone https://github.com/Trupal-Shende/Pratinidhi.git
cd Pratinidhi
```

### Step 2: Configure Environment Variables
Copy the provided environment template to create your local `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your port and API credentials:
```env
# Port for the unified Express + Vite server
PORT=3000

# Groq API Key for Whisper speech-to-text audio transcription
# (Obtain a free evaluation key at https://console.groq.com/keys)
GROQ_API_KEY="[YOUR_GROQ_API_KEY]"
```
*(Note: If testing purely via the interactive keypad simulator, the browser's built-in speech synthesis operates offline without requiring external API credits).*

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Launch the Unified Server
```bash
npm run dev
```
Once initialized, the terminal will report:
```text
  ➜  Local:   http://localhost:3000
  ➜  Network: http://127.0.0.1:3000
```
Open **`http://localhost:3000`** in your web browser.

---

## 5. Step-by-Step Judge Walkthrough

To experience the complete citizen lifecycle during evaluation, perform the following 5-step test loop:

1. **Initiate the Voice Intake (Citizen Phone):**
   - In the left pane (**Citizen Phone Interface**), click the green **📞 (Call)** button.
   - Listen to the automated Hindi greeting: *"नमस्कार, जनसेवा में आपका स्वागत है..."* (Audio plays aloud via speech synthesis; transcript displays on screen).
2. **Issue Case ID & Deliver SMS:**
   - Press **`1`** on the numeric keypad.
   - Observe the **💬 Incoming SMS** drawer slide open in real-time, receiving Case ID `INC-UP-2026` and confirming the **Official Fee: ₹0**.
3. **Grant Single-Use DigiLocker Consent:**
   - The agent requests authorization to fetch the citizen's ration card and identity document from DigiLocker.
   - Press **`1`** on the keypad to confirm consent over DTMF.
4. **Execute Portal Submission & Obtain Receipt:**
   - The system transitions to submission mode, preparing the schema-compliant payload for the Uttar Pradesh Social Welfare portal.
   - The final SMS arrives displaying official acknowledgement receipt `UP-INC-9912`.
5. **Simulate Stalled / Rejected Application Recovery:**
   - Click the orange **⚠️ Simulate Portal Rejection & Callback** trigger in the lower left panel.
   - The voice agent initiates an immediate outbound call to the citizen explaining: *"नमस्ते, तहसील कार्यालय ने आपके आय प्रमाण पत्र में अतिरिक्त जानकारी मांगी है..."*
   - Press **`1`** to approve filing an expedited appeal with the Tehsil office.
6. **Inspect Companion Oversight (Right Panel):**
   - Review the **Immutable Audit Trail & Consent Log** verifying that every DTMF consent, voice intake milestone, and fee disclosure is permanently recorded with zero intermediary intervention.

---

## 6. Automated Testing & Verification

The project includes unit test suites verifying civic service discovery, keyword parsing, intent classification, and document quality detection.

Run the test suite:
```bash
npx tsx --test src/services/civicCatalog.test.ts
```
Expected output:
```text
✔ civic catalog contains MVP supported services with valid requirements
✔ classifyCitizenIntent identifies Hindi and English pension requests
✔ classifyCitizenIntent identifies income certificate requests
✔ classifyCitizenIntent safely handles unsupported requests
✔ classifyCitizenIntent handles too short input with clarification
✔ validateDocumentQuality catches blurry and cut off documents
ℹ tests 6 | pass 6 | fail 0
```

To run TypeScript strict compilation checks:
```bash
npm run lint
```

---

## 7. Security & Safeguards

- **Strict Identity Scoping:** No citizen can access records belonging to another caller; all endpoints enforce per-user tenant boundaries (`userId: 'citizen-1'`).
- **No Blanket Document Access:** DigiLocker permissions are single-use and scoped per-document and per-application.
- **Zero Credential Solicitation:** The voice agent is architecturally blocked from ever requesting Aadhaar OTPs, UPI PINs, or net banking passwords over the phone.
- **Anti-Denial of Service:** AI inference routes are shielded with `express-rate-limit` (15 requests/minute per IP) and strict 10MB memory-bounded buffers.

---

## 8. License & Attribution

- **License:** Apache License 2.0. See `LICENSE` for details.
- **Hackathon:** Developed for the **Eigi Hackathon** (Problem Statement: *CITY-02 Every Citizen Gets an Agent*).
- **Core Contributor:** **Trupal Shende** (gwtrupal@gmail.com) • **[ORGANIZATION_OR_TEAM]**

