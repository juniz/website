# Design System Document: The Clinical Sanctuary

## 1. Overview & Creative North Star
In the high-stakes environment of hospital administration, clarity is a form of care. This design system moves away from the cluttered, "spreadsheet-heavy" legacy of medical software and toward a **Creative North Star: The Clinical Sanctuary.** 

The goal is to create an interface that feels both authoritative and breathable. We achieve this by blending **High-End Editorial Typography** with **Layered Tonal Depth**. Instead of rigid grids separated by harsh lines, the layout uses intentional asymmetry and shifting surface elevations to guide the eye. It is a "Sanctuary" because it reduces cognitive load, using "Blue Azure" as a signal of precision and reliability within a soft, expansive digital environment.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the trustworthiness of Azure, supported by a sophisticated range of neutral surfaces that mimic the clean, reflective environments of modern medical facilities.

### The "No-Line" Rule
To achieve a premium, custom feel, this design system **strictly prohibits 1px solid borders** for sectioning or containment. Boundaries are defined exclusively through:
*   **Background Color Shifts:** Using `surface-container-low` for secondary sidebars against a `surface` main stage.
*   **Tonal Transitions:** Defining logic blocks through subtle shifts in saturation rather than a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers.
*   **Base:** `surface` (#f7f9ff)
*   **Sub-sections:** `surface-container-low` (#f1f4fa) or `surface-container-high` (#e5e8ee)
*   **Interactive Elements:** `surface-container-lowest` (#ffffff) to make cards "pop" naturally against the cooler background.

### The "Glass & Gradient" Rule
Flat colors are for utilities; "The Clinical Sanctuary" uses soul. 
*   **Floating Elements:** Use Glassmorphism for overlays and floating navigation bars. Apply `surface` with 80% opacity and a `20px` backdrop-blur. 
*   **Signature Textures:** Main CTAs should utilize a subtle linear gradient from `primary` (#005ab7) to `primary_container` (#0072e5) at a 135-degree angle. This adds a sense of "robustness" and depth that feels more secure than a flat button.

---

## 3. Typography: Editorial Precision
We utilize a dual-typeface strategy to balance human-centric aesthetics with data-heavy functionality.

*   **The Display Face (Manrope):** Used for `display`, `headline`, and `title` scales. Manrope’s geometric yet friendly structure provides an "Editorial" feel, making high-level metrics feel important and curated.
*   **The Data Face (Inter):** Used for all `body` and `label` scales. Inter is the workhorse of this system, providing maximum legibility for patient records and administrative logs.

**Hierarchy as Brand:** Use `display-md` (Manrope, 2.75rem) for main dashboard greetings to create an inviting, low-stress entry point. Counter this with `label-sm` (Inter, 0.6875rem) in `on-surface-variant` for metadata to ensure precision without clutter.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than traditional structural lines.

*   **The Layering Principle:** To create a card, do not draw a box. Instead, place a `surface-container-lowest` (#ffffff) object onto a `surface-container-low` (#f1f4fa) background. The 1% shift in value creates a soft, natural lift.
*   **Ambient Shadows:** If an element must "float" (e.g., a critical modal), use an ultra-diffused shadow. 
    *   *Shadow Setting:* `0px 12px 32px` with a 6% opacity of the `on-surface` color (#181c20). This mimics natural ambient light rather than a harsh digital drop-shadow.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a border (e.g., in high-contrast data tables), use a **Ghost Border**. Apply the `outline-variant` (#c1c6d7) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Gradient-filled (`primary` to `primary-container`) with `md` (0.375rem) roundedness. Use `on-primary` for text.
*   **Secondary:** `surface-container-high` background with `on-secondary-container` text. No border.
*   **States:** On hover, increase the gradient intensity. On press, shift to `primary-fixed-dim`.

### Input Fields
*   **Structure:** Forgo the "boxed" input. Use a `surface-container-low` background with a 2px `primary` bottom-bar that only appears on focus. 
*   **Robustness:** Use `body-md` for input text and `label-md` for floating labels to ensure they feel substantial and secure.

### Cards & Data Lists
*   **The Divider Ban:** Strictly forbid the use of horizontal rules (`<hr>`). 
*   **Separation:** Use vertical whitespace (e.g., `1.5rem` gaps) or alternating background tints (`surface` vs `surface-container-lowest`) to distinguish list items.
*   **Chips:** Use `secondary-container` for status indicators (e.g., "In-Patient") with `sm` (0.125rem) roundedness to maintain a clinical, "tab-like" aesthetic.

### Status Monoliths (Specialty Component)
A large-format card for critical vitals. Uses a `surface-container-highest` background, a `headline-lg` Manrope value, and a `primary` "Blue Azure" accent bar on the left edge (4px width) to signify administrative priority.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `surface-bright` for the main workspace to keep the "clinical" feel fresh and energetic.
*   **Do** use `tertiary` (Burnt Orange) sparingly for non-error alerts that require attention but aren't life-threatening.
*   **Do** embrace asymmetry. Align large headers to the left while keeping data tables centered to create visual "rhythm."

### Don't
*   **Don't** use 100% opaque black for text. Always use `on-surface` (#181c20) to maintain a softer, premium contrast.
*   **Don't** use `xl` (0.75rem) rounding for clinical data; it feels too "consumer" and "bubbly." Stick to `sm` and `md` for a robust, professional feel.
*   **Don't** clutter the "Clinical Sanctuary." If a screen feels full, increase the padding by 20% and use a `surface-container` nesting strategy to group related items.