# Pratinidhi Logo & Brand Tagline Integration

Integrate the official **Pratinidhi** shield-and-voice safeguard emblem into the selected header identity container alongside localized brand typography and the official *"Speaks for you. Guards your data."* tagline, while maintaining the high-contrast civic color palette.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions incorporate your confirmed preferences from the clarification step:

- **Confirmed Decision 1 — Emblem-Only Header Icon**: Display the shield-and-voice safeguard emblem from the uploaded brand asset inside the header's primary logo badge container next to the localized **Pratinidhi / प्रतिनिधि / प्रतिनिधी** title, ensuring crisp scaling at both mobile and desktop widths.
- **Confirmed Decision 2 — Official Tagline & High-Contrast Civic Palette**: Update the header subtitle to the brand motto (*"Speaks for you. Guards your data."* with corresponding Hindi and Marathi translations) while preserving the existing high-contrast civic color tokens (`#0B3A53` Ink, `#005B50` Teal, `#A94600` Saffron, and `#FFFDF8` Warm Canvas).

---

### 1. Overview & Core Concept

- **What It Does**: Replaces the text-based monogram badge in the top navigation bar with the official Pratinidhi emblem (maroon rounded square with white shield, voice waveform bubble, and amber safeguard lock) and aligns the subtitle with the brand's core promise.
- **Target Audience / Persona**: Indian citizens across all 28 States and 8 Union Territories using Pratinidhi in English, Hindi, or Marathi who rely on clear, trustworthy visual cues that the agent speaks on their behalf while guarding their personal identity data.
- **Key Value**: Strengthens brand recognition and visual trust immediately upon page load without sacrificing multilingual legibility or WCAG AA contrast compliance.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Header Brand Recognition**: On any screen (Home, Voice Intake, Document Checklist), the citizen sees the Pratinidhi shield-and-voice emblem paired with the localized title and *"Speaks for you. Guards your data."* subtitle.
  2. **Language Switching**: Toggling between **English**, **हिन्दी**, and **मराठी** dynamically updates both the primary brand wordmark (`Pratinidhi` / `प्रतिनिधि` / `प्रतिनिधी`) and the tagline while keeping the emblem anchored on the left.
  3. **Home Navigation**: Clicking or tapping the logo and brand lockup returns the user to the Home view with a clear focus ring (`#005EA8`) and a minimum $44 \times 44\text{px}$ touch target.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Calm, dignified public-service desk posture enhanced by the maroon-and-amber safeguard emblem.
  - *Color Palette & Mood*: Preserves `--color-canvas` (`#FFFDF8`), `--color-surface` (`#F2EFE8`), `--color-ink` (`#0B3A53`), and `--color-teal` (`#005B50`), while the emblem introduces a warm maroon (`#6B2135`) and amber lock (`#E69F22`) focal point in the top bar.
  - *Typography & Hierarchy*: Uses **Noto Sans** and **Noto Sans Devanagari** with bold `18px` brand title and `12px` muted tagline, keeping metadata unboxed for visual clarity.
  - *Component Styling & Layout*: The emblem container is sized at `44px × 44px` (`w-11 h-11 rounded-xl overflow-hidden shrink-0`) so the shield-and-voice icon is cropped cleanly from the left portion of the uploaded horizontal logo asset (or rendered with exact object positioning) without tiny unreadable text inside the icon box.
- **Interactive Feedback & Motion**: Subtle hover surface transition (`hover:bg-[#F2EFE8]`) and accessible keyboard focus ring (`focus-visible:outline-[#005EA8]`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Emblem Cropping vs. Full Horizontal Image in Header**:
  - *Chosen Approach*: Crop and frame the left square emblem portion of the uploaded logo asset inside a dedicated `44px × 44px` icon container next to live HTML text for the title and tagline.
  - *Why*: Rendering the full wide image inside a compact mobile/desktop header would shrink the embedded text to an illegible size and prevent the brand title and tagline from adapting when the user switches between English, Hindi, and Marathi.
  - *Alternatives Considered*: Displaying the full horizontal PNG as a static banner was rejected because it breaks multilingual switching and crowds the mobile header bar.
- **Decision 2 — Preserving High-Contrast Civic Palette**:
  - *Chosen Approach*: Keep `#0B3A53` (Ink) and `#005B50` (Teal) for interactive controls, status indicators, and primary actions while letting the emblem stand out as the signature brand mark.
  - *Why*: Preserves the tested WCAG AA contrast ratios and clear semantic separation between primary actions, verified states, and cautionary alerts.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Top Navigation Header                           │
│                                                                         │
│  ┌───────────────────────────────────────────────────┐  ┌────────────┐  │
│  │           Home Navigation Button Lockup           │  │  Controls  │  │
│  │                                                   │  │            │  │
│  │  ┌──────────────┐  ┌───────────────────────────┐  │  │ [En|हिं|मरा] │  │
│  │  │ Shield+Voice │  │ Pratinidhi / प्रतिनिधि     │  │  │ [Consent]  │  │
│  │  │ Emblem Icon  │  │ Speaks for you. Guards... │  │  │ [Help]     │  │
│  │  └──────────────┘  └───────────────────────────┘  │  └────────────┘  │
│  └───────────────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - Uses the active `Language` state (`'en' | 'hi' | 'mr'`) to localize the brand name and the new tagline:
    - **English**: *"Speaks for you. Guards your data."*
    - **Hindi**: *"आपकी आवाज़। आपके डेटा की सुरक्षा।"*
    - **Marathi**: *"तुमचा आवाज. तुमच्या डेटाचे रक्षण."*
- **Interactive Component & State Mapping**:
  - Targeting the focused header icon container (`div:nth-of-type(1)`) and inner element (`span:nth-of-type(1)`), the emblem is displayed using the local uploaded asset path (`/assets/aistudio/pratinidhi_voice_and_safeguard_logo_fe1b5129.png`) framed precisely onto the shield-and-voice icon so that clicking the brand lockup triggers `onNavigateHome()` and switching languages updates the adjacent text immediately.
