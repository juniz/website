# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** RS Bhayangkara Nganjuk
**Generated:** 2026-05-08 08:34:24
**Category:** Medical Clinic

---

## Global Rules

### Color Palette (Azure Blue Medical)

| Role | Hex | CSS Variable | Purpose |
|------|-----|--------------|---------|
| Primary Deep | `#042C53` | `--color-primary-900` | Navy terdalam: BG navbar, footer, hero dark |
| Primary Dark | `#0C447C` | `--color-primary-800` | Hover state dark, hero section bg |
| Primary Brand | `#185FA5` | `--color-primary-600` | Primary brand, CTA, link, border aktif |
| Primary Active | `#378ADD` | `--color-primary-400` | Button utama, badge aktif, highlight |
| Primary Muted | `#85B7EB` | `--color-primary-200` | Teks muted di atas dark bg |
| Primary Border | `#B5D4F4` | `--color-primary-100` | Border di dark surface, teks sekunder |
| Primary Light BG | `#E6F1FB` | `--color-primary-50` | BG chip, icon container, input dark bg |
| Accent Success | `#1D9E75` | `--color-accent-teal` | Status tersedia, sukses, dot ketersediaan |
| Accent Success BG | `#E1F5EE` | `--color-accent-teal-light` | BG badge tersedia |
| Accent Danger | `#E24B4A` | `--color-danger` | Alert, status penuh, error |
| Neutral Background | `#F1EFE8` | `--color-neutral-50` | Page background (warm medical gray) |
| Neutral Border | `#D3D1C7` | `--color-neutral-200` | Border default |
| Neutral Muted Text | `#5F5E5A` | `--color-neutral-600` | Teks muted / secondary |
| Neutral Body Text | `#2C2C2A` | `--color-neutral-900` | Teks body |

**Color Notes:** Azure Blue Medical system. All interactive components must implement transitions of 150-300ms. Emojis are strictly forbidden as structural icons.

### Typography

- **Heading Font:** Figtree
- **Body Font:** Inter / Noto Sans
- **Mood:** medical, clean, accessible, professional, healthcare, trustworthy, minimalist
- **Google Fonts:** [Figtree + Inter](https://fonts.google.com/share?selection.family=Figtree:wght@300;400;500;600;700|Inter:wght@300;400;500;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Inter:wght@300;400;500;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #DC2626;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0284C7;
  border: 2px solid #0284C7;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F0F9FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0284C7;
  outline: none;
  box-shadow: 0 0 0 3px #0284C720;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Accessible & Ethical

**Keywords:** High contrast, large text (16px+), keyboard navigation, screen reader friendly, WCAG compliant, focus state, semantic

**Best For:** Government, healthcare, education, inclusive products, large audience, legal compliance, public

**Key Effects:** Clear focus rings (3-4px), ARIA labels, skip links, responsive design, reduced motion, 44x44px touch targets

### Page Pattern

**Pattern Name:** Trust & Authority + Conversion

- **CTA Placement:** Above fold
- **Section Order:** Hero > Features > CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Outdated interface
- ❌ Confusing booking
- ❌ AI purple/pink gradients

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
