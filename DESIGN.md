---
name: RS Bhayangkara Nganjuk
description: A clear, modern clinical interface that helps patients move confidently toward care.
colors:
  deep-navy: "#023047"
  deep-blue: "#04699b"
  clinical-teal: "#219ebc"
  sky-blue: "#8ecae6"
  sky-mist: "#e8f4fa"
  sky-border: "#d2eaf5"
  amber-cta: "#ffb703"
  amber-deep: "#d09500"
  amber-soft: "#fff1cd"
  amber-ink: "#342500"
  paper: "#ffffff"
  border: "#d3d1c7"
  muted-ink: "#5f5e5a"
  ink: "#2c2c2a"
  danger: "#fb8500"
  danger-soft: "#ffe7cb"
  teal-soft: "#ceeef6"
  raised-surface: "#f0f9fe"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  card: "16px"
  pill: "999px"
spacing:
  xs: "0.375rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  section: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.clinical-teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0.6875rem 1.75rem"
    height: "48px"
  button-cta:
    backgroundColor: "{colors.amber-cta}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.md}"
    padding: "0.6875rem 1.75rem"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.clinical-teal}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.25rem"
    height: "40px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1rem"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.625rem"
    height: "32px"
---

# Design System: RS Bhayangkara Nganjuk

## Overview

**Creative North Star: “The Trusted Clinical Beacon”**

The interface presents the hospital as a dependable point of orientation: calm enough to reduce anxiety, direct enough to help patients act quickly, and precise enough to support real care decisions. It uses a light clinical canvas with a deep navy anchor, a sky-blue information scale, and a warm amber action signal.

The visual language is simple, modern, and professional. It favors clear hierarchy, familiar web patterns, and practical density over ornament. Rounded controls and cards soften the clinical setting without becoming luxurious; motion is brief and functional, used to reveal content and confirm state rather than entertain.

**Key Characteristics:**
- Deep navy structure with sky-blue information accents
- Amber reserved for high-value patient actions
- Figtree headings paired with Inter body copy
- Rounded, touch-friendly controls and restrained depth
- Clear, non-luxurious and non-playful clinical presentation

## Colors

The palette is a cool clinical spectrum with one warm action color. Navy establishes trust and structure, blue-green carries interaction and availability, and amber marks a decision that moves a patient forward.

### Primary
- **Deep Navy** (`{colors.deep-navy}`): The structural anchor for navigation, hero surfaces, footer areas, and high-contrast text on dark surfaces.
- **Deep Blue** (`{colors.deep-blue}`): The active dark-blue state for navigation and interactive emphasis.
- **Clinical Teal** (`{colors.clinical-teal}`): The principal interactive accent for links, active borders, availability, and primary actions.
- **Sky Blue** (`{colors.sky-blue}`): Focus rings, light highlights, and supportive badges.

### Secondary
- **Amber Signal** (`{colors.amber-cta}`): The clearest action signal for registration, booking, and other high-value CTAs.
- **Amber Deep** (`{colors.amber-deep}`): Hover, pressed, and warning states related to the amber action family.

### Tertiary
- **Danger Orange** (`{colors.danger}`): Errors, full capacity, and urgent alert states; it is semantic, not decorative.

### Neutral
- **Clinical Paper** (`{colors.paper}`): Default page and card surface.
- **Raised Mist** (`{colors.raised-surface}`): Subtle tonal lift for selected or grouped content.
- **Sky Mist** (`{colors.sky-mist}`): Light chips, icon panels, and input-adjacent surfaces.
- **Border Stone** (`{colors.border}`): Quiet dividers and default borders.
- **Muted Ink** (`{colors.muted-ink}`): Secondary copy and supporting metadata.
- **Ink** (`{colors.ink}`): Primary body text.

**The Amber Signal Rule.** Amber should identify a patient action or meaningful warning, never become a general decorative wash.

## Typography

**Display Font:** Figtree (with system sans-serif fallback)
**Body Font:** Inter (with system and platform sans-serif fallback)
**Label/Mono Font:** Figtree for compact labels; no distinct mono face is established.

**Character:** Figtree gives headings a confident, contemporary clinical voice. Inter keeps paragraphs, metadata, and form content neutral and highly readable.

### Hierarchy
- **Display** (800, `clamp(2.25rem, 5vw, 3.75rem)`, 1.15): Hero statements and the strongest landing-page promise.
- **Headline** (800, `clamp(1.5rem, 3vw, 2rem)`, 1.3): Section titles and major page headings.
- **Title** (600, `1.125rem`, 1.3): Card titles, subsection labels, and compact content anchors.
- **Body** (400, `0.875rem`, 1.6–1.65): Explanatory copy, metadata, and patient-facing instructions.
- **Label** (700, `0.75rem`, 1.2, `0.05em` tracking, uppercase where used): Section badges, status labels, and compact navigation cues.

**The Two-Voice Rule.** Use Figtree to orient and Inter to explain; do not turn body copy into display typography.

## Layout

Content sits in a centered container capped at 1280px. Horizontal padding is 1.5rem by default, 2rem from 768px, and 3rem from 1024px. Sections use a generous vertical rhythm of 4rem, increasing to 5rem on wider screens.

The public experience is section-led: a strong hero, then service discovery, doctors and schedules, reassurance content, FAQs, partners, a final registration CTA, and news. Responsive layouts collapse to single-column flows where scanning and touch access matter most. Navigation is sticky, becomes subtly elevated after scroll, and changes to a mobile menu rather than compressing a long desktop row.

## Elevation & Depth

The system is layered rather than heavily shadowed. Most surfaces rely on white or pale-blue tonal separation with quiet borders; shadows appear on sticky navigation, floating sheets, hover states, and elevated feedback. Motion uses short ease-out transitions (150–350ms) and scroll reveals around 600ms, with reduced-motion overrides.

### Shadow Vocabulary
- **Sticky navigation:** `0 2px 20px rgba(4, 44, 83, 0.5)` after scrolling; communicates persistent orientation.
- **Interactive lift:** soft blue-green shadows such as `0 4px 16px rgba(55, 138, 221, 0.35)` on hover; confirms action without spectacle.
- **Mobile sheet:** `0 -10px 40px rgba(2, 48, 71, 0.2)`; separates the active task from the page beneath it.

**The Calm Depth Rule.** Elevation should clarify hierarchy or state; never use large, glossy shadows to simulate luxury.

## Shapes

The form language is gently rounded and touch-friendly: 6–12px radii for controls, 16px for content cards, and pill geometry for badges and status chips. Borders are thin and quiet, typically 1–1.5px. The system avoids sharp editorial corners and avoids excessive pill-shaped containers outside labels and statuses.

## Components

### Buttons
- **Shape:** Compact rounded rectangles (8px) with 1.5px borders where outlined.
- **Primary:** Clinical teal fill with white text; medium buttons are 40px tall and large buttons are 48px tall.
- **CTA:** Amber fill with deep amber ink for registration and other high-value patient actions.
- **Hover / Focus:** Darker accent or filled light-blue state, subtle shadow, and a visible 2.5px focus outline with 2px offset.
- **Secondary / Ghost:** Transparent or outlined teal controls for lower-emphasis navigation.
- **Behavior:** Buttons compress slightly on press and expose loading state with an inline spinner.

### Chips
- **Style:** Sky-mist or amber-soft background, accent text, 1px border, and pill radius.
- **State:** Use for category, availability, warning, and compact filter/status information rather than primary navigation.

### Cards / Containers
- **Corner Style:** 12–16px rounded corners, with 16px as the recurring content-card silhouette.
- **Background:** Paper by default; raised surface or sky mist for grouping and selected states.
- **Shadow Strategy:** Prefer tonal layering and quiet rings; reserve shadows for hover, floating, or operational state.
- **Border:** A light neutral or sky border when separation is needed.
- **Internal Padding:** 1rem baseline, with tighter 0.75rem treatment for compact variants.

### Inputs / Fields
- **Style:** Full-width, transparent or paper-filled fields with 8–12px radius and 1–1.5px neutral borders.
- **Focus:** Teal border plus a visible ring; preserve the global focus treatment.
- **Error / Disabled:** Orange/red semantic border and ring for invalid state; disabled fields reduce opacity and pointer affordance.

### Navigation
- **Style:** Sticky deep-blue bar with a compact logo lockup, 64px desktop height, and Figtree navigation labels.
- **States:** Muted sky-blue at rest, paper text for the active route, and a sky-blue bottom border for active indication.
- **Mobile:** Replace the dense desktop row with a controlled menu and lock body scroll while open.

### Signature Component: Patient Registration CTA
The registration CTA is the system’s clearest conversion pattern: a deep navy or blue-green context, a concise benefit statement, small reassurance cues, and an amber or high-contrast action that makes the next step unmistakable.

## Do's and Don'ts

### Do:
- **Do** use deep navy to establish trust and structure.
- **Do** reserve amber for actions, warnings, and moments that deserve attention.
- **Do** keep headings in Figtree and explanatory copy in Inter.
- **Do** preserve visible focus states and touch-friendly minimum heights.
- **Do** use tonal layering and restrained shadows to keep the interface calm.

### Don't:
- **Don't** introduce luxury cues such as metallic finishes, ornate typography, or glossy gradients.
- **Don't** add playful illustrations, novelty motion, or decorative clutter that competes with care information.
- **Don't** make the interface bureaucratic with dense tables, unexplained labels, or long unbroken instruction blocks.
- **Don't** use amber as a general background or treat danger colors as brand accents.
- **Don't** remove the active route, skip link, or keyboard focus signals in pursuit of minimalism.
