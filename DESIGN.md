---
name: LearnHarness
description: An agent harness for learning — a nocturnal instrument for adaptive teaching, practice, and a persistent knowledge graph.
colors:
  obsidian-ground: "#141414"
  graphite-panel: "#1c1c1c"
  bone-white: "#e6e6e6"
  ash: "#8d8d8d"
  pencil-line: "#434343"
  charcoal-hover: "#2a2a2a"
  signal-correct: "#22c55e"
  signal-incorrect: "#ef4444"
  signal-hint: "#f59e0b"
  destructive: "oklch(0.704 0.191 22.216)"
typography:
  display:
    fontFamily: "lh-cmu, Georgia, serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "lh-cmu, Georgia, serif"
    fontSize: "25px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  ui:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.bone-white}"
    textColor: "{colors.obsidian-ground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
    typography: "JetBrains Mono 12.5px/500"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ash}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "32px"
    typography: "JetBrains Mono 12.5px/500"
  input-field:
    backgroundColor: "{colors.obsidian-ground}"
    textColor: "{colors.bone-white}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
    typography: "JetBrains Mono 12.5px/400"
  option-row:
    backgroundColor: "transparent"
    textColor: "{colors.bone-white}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    typography: "JetBrains Mono 12.5px/400"
  transcript-card:
    backgroundColor: "{colors.graphite-panel}"
    textColor: "{colors.bone-white}"
    rounded: "{rounded.xl}"
    padding: "16px"
  composer:
    backgroundColor: "{colors.graphite-panel}"
    textColor: "{colors.bone-white}"
    rounded: "{rounded.xl}"
    padding: "6px"
  sidebar-row:
    backgroundColor: "transparent"
    textColor: "{colors.ash}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    typography: "JetBrains Mono 11px/400"
  tooltip-chip:
    backgroundColor: "{colors.charcoal-hover}"
    textColor: "{colors.bone-white}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
    typography: "JetBrains Mono 11px/400"
  code-block:
    backgroundColor: "color-mix(in oklab, #141414 86%, black)"
    textColor: "{colors.bone-white}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
    typography: "JetBrains Mono 12.5px/400"
  verdict-chip-correct:
    backgroundColor: "rgba(34, 197, 94, 0.15)"
    textColor: "{colors.signal-correct}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    typography: "JetBrains Mono 12.5px/400"
---

# Design System: LearnHarness

## Overview

**Creative North Star: "The Night Observatory"**

LearnHarness is a dark instrument for reading what someone understands. The screen is an obsidian field; the chrome is a thin, precise mono voice; the teaching text is set like a page under glass. Nothing glows for attention. Light is information: a bone-white action, a selected edge, a verdict. The interface stays quiet so the learner's reasoning, the question, and the graph remain the brightest things in the room.

The register is editorial and austere rather than technical for its own sake. CMU Serif titles announce a session the way a plate announces an exhibit; JetBrains Mono labels operate the instrument; Source Sans 3 carries the reading. Surfaces are flat panes separated by 1px pencil lines, with shadow reserved for things that genuinely float above the page — the composer, menus, dialogs, and node cards.

Component feel is a tactile drafting tool: controls are compact, squared-off, and firm under the hand. Selection is a tone shift plus a bone-white edge, never a glow. The result should feel like a well-made instrument left on a dark desk — restrained, legible, and ready for long sessions.

**Key Characteristics:**
- Obsidian ground, graphite panels, one step of tone per surface.
- One accent only: bone white. Hue is reserved for verdicts and system status.
- Three typographic voices: serif announces, mono operates, Source Sans 3 explains.
- Hairline borders define every surface; floating shadows mark true z-lift.
- A 4px rhythm and a 4/8/12/16px radius ladder.
- Motion is state, not decoration: 120–200ms fades and rises.

## Colors

A graphite monochrome with three signal hues held in reserve — the palette earns its calm by refusing color until a verdict needs it.

### Primary
- **Bone White** (#e6e6e6): the single accent. Primary buttons, selected borders, strong prose, active icons, and the focused edge of a chosen row. On Obsidian it measures roughly 13.6:1.
- **The One Light Rule.** Bone White is the only accent. Keep it under roughly 10% of any screen; its rarity is what makes it read as light rather than paint.

### Neutral
- **Obsidian Ground** (#141414): the app canvas, transcript ground, and the graph's field. The darkest surface in the system.
- **Graphite Panel** (#1c1c1c): cards, docks, popovers, composer, and muted controls — exactly one step above the ground.
- **Charcoal Hover** (#2a2a2a): hover wash, selected segment, tooltip chip, and quiet active states.
- **Ash** (#8d8d8d): muted labels, placeholders, metadata, and secondary UI text. Roughly 5.6:1 on Obsidian.
- **Pencil Line** (#434343): the 1px border, input edge, divider, and scrollbar thumb.
- **The Graphite Stack Rule.** Surfaces climb one step: Obsidian ground → Graphite panel → Charcoal hover. Recessed content (code) may sit one step below ground; never introduce a fourth decorative gray.

### Signal
- **Correct Green** (#22c55e): correct verdicts and connected/success status. Used as a 15% tint behind text, or solid for a status dot.
- **Incorrect Red** (#ef4444): incorrect verdicts and blocking errors.
- **Hint Amber** (#f59e0b): solved-with-hints, warnings, and provisional notices.
- **Destructive** (oklch(0.704 0.191 22.216)): destructive confirmation copy and destructive button tint.
- **The Verdict-Only Hue Rule.** Hue appears only for answer verdicts or system status. It never becomes a brand accent, a phase color, a gradient stop, or decoration.

## Typography

**Display Font:** CMU Serif (bundled `lh-cmu`, with Georgia fallback)
**Body Font:** Source Sans 3 (with ui-sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** an editorial title plate mounted inside a precision instrument. The serif announces, the mono operates, and Source Sans 3 does the reading. The contrast is deliberate: the further a piece of text is from the learner's thinking, the more instrument-like it becomes.

### Hierarchy
- **Display** (700, 32px/1.25, -0.025em): session titles and the chat header. CMU's only face is 700; the utility requests 900 so the variable fallback matches it.
- **Headline** (700, 25px/1.3, -0.025em): settings and setup dialog titles.
- **UI** (400, 14px/1.45): JetBrains Mono chrome — controls, navigation, metadata, dock labels.
- **Body** (400, 16px/1.5): teaching prose, tables, and long-form reading. Measure is the 46rem column, roughly 65–75 characters.
- **Label** (400, 11px/1.4, 0.05em, uppercase): section eyebrows, filter labels, compact metadata. The mono legibility floor.
- **Markdown headings** inherit the prose family and run at Black (900) via `--lh-heading-weight`; they are headings in a page, not chrome.
- **Inputs** share the prose family and 16px size but tighten leading to 1.25 so the caret sits close to the glyphs.

### Named Rules
**The Two Voices Rule.** Mono is chrome; Source Sans 3 is reading; CMU Serif is announcement. Never swap roles — no serif controls, no mono paragraphs, no prose in the sidebar chrome.

**The 11px Floor Rule.** No label, badge, or metadata text goes below 11px. Quiet comes from Ash, tracking, and case, not from shrinking the type.

**The 16px Reading Rule.** Teaching prose and tables stay at 16px. The reading surface is the product; the instrument around it may be 11–14px.

## Layout

The shell is a fixed 288px sidebar and a single centered reading column. The main column is `max-w-[46rem]` (736px) with 16px gutters; the composer, the dock, and the transcript all share that column, so the conversation never jumps width. The sidebar auto-closes below 928px and restores when the window widens; there is no separate mobile layout because the shipped surface is the desktop app.

Spacing follows a 4px base: 4, 8, 12, 16, 24, and 32px. Padding inside cards is 16px; option rows and nav rows use 8px × 12px; the composer shell uses 6px around a 2.5px-inset field. The top chrome band is 52px tall; on macOS the traffic-light gutter reserves 92px, divided by the live zoom factor so native controls and web chrome stay aligned at every zoom.

The composer is anchored 20px above the bottom (`pb-5`). The question and practice docks may grow to 55dvh and scroll internally before the transcript collapses. Long questions, option lists, and thinking fields scroll inside the dock rather than pushing the page.

**The Four-Pixel Rhythm Rule.** Every padding, margin, gap, and control height is a whole multiple of 4px. No hand-tuned exceptions.

**The 46rem Reading Rule.** Composer, dock, transcript, and empty-state summary share one 46rem column. A surface that changes the column width changes the reading rhythm and is out of system.

## Elevation & Depth

Depth is drawn with hairlines, not shadows. Transcript cards, option rows, navigation, and panels are flat graphite shapes separated by Pencil borders. Shadow is a z-axis statement: it appears only when an element genuinely floats above the page — the composer, menus, dialogs, tooltips, floating graph chrome, and node cards. There are no ambient shadows on static content, no inner glows, and no tonal gradients; the one exception is tonal layering itself, where Graphite sits one step above Obsidian.

### Shadow Vocabulary
- **Control** (`0 1px 2px rgba(0, 0, 0, 0.05)`): inputs and outline buttons at rest — a barely-there edge, not lift.
- **Float** (`0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`): composer, floating chrome pills, node cards, update banner.
- **Menu** (`0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`): popovers, dropdown menus, small dialogs.
- **Dialog** (`0 25px 50px -12px rgba(0, 0, 0, 0.25)`): the keyboard reference and large modal surfaces.

### Named Rules
**The Floating-Only Shadow Rule.** If it does not overlap other content, it does not cast a shadow. Cards, rows, navigation, and panels stay flat.

**The Hairline Rule.** Elevation is a 1px Pencil line before it is ever a shadow. Thickening a border to 2px to signal emphasis is out of system; use tone or a bone-white edge instead.

## Shapes

The form language is drafting-tool geometry: compact rectangles with gentle corners, crisp 1px edges, and circles only where a control is genuinely radial. The radius ladder is strictly 4 / 8 / 12 / 16px. Content cards and the composer sit at 16px; option rows, navigation rows, and code blocks at 12px; buttons, inputs, tooltips, and menus at 8px; chips and badges at 4px. Pills (`9999px`) are reserved for floating metadata and compact controls that ride on the canvas, not for content cards. Radio indicators and status dots are circles.

Borders are always 1px. Dashed 1px edges carry a specific meaning: an option that is not a normal answer ("don't know" / "other"). Selected states change the border to Bone White and the fill to Charcoal; they do not add a second border or a glow ring.

Focus follows the same logic. Pointer focus stays quiet; keyboard focus-visible gets a thin 1px Ash ring (outline-offset 1px) from the base layer, while components with their own ring utilities (buttons, inputs, dock rows) keep those local rings. Focus is never communicated by color alone — it always pairs a border or fill shift with the control's existing shape.

**The Two Silhouettes Rule.** Content is a rounded rectangle (12–16px). Controls that float over the canvas are a pill or an 8px-radius icon square. Circles belong to radios, selection dots, and avatars — never to content containers.

## Components

### Buttons
- **Shape:** 8px radius, compact height (32px small, 36px default, 40px large); icon buttons are 24/32/36/40px squares.
- **Primary:** Bone White background, Obsidian text, 8px × 16px padding, 12.5px mono at weight 500. Hover reduces opacity to 90%; disabled drops to 40%.
- **Ghost / Secondary:** transparent background, Ash text, Charcoal hover wash. Used for sidebar actions, toolbars, and quiet controls.
- **Focus:** no global outline; keyboard focus uses the control's local ring utilities (3px Ash at 50%).
- **Never:** gradients, colored primaries, or more than one filled button in a local cluster.

### Inputs / Fields
- **Style:** 36px tall, 8px radius, 1px Pencil border, transparent or 30%-dark fill, Ash placeholder; compact search fields shrink to 24px with a left icon inset.
- **Focus:** the border shifts to Ash with a 3px 50%-Ash ring; the caret and selection use Bone White on Obsidian.
- **Typing:** the shared 16px prose family with 1.25 leading (`lh-input`), so the caret does not tower over the glyphs.
- **Error / Disabled:** destructive border and 20% ring at 15% tint; disabled drops to 50% opacity and loses pointer events.

### Option Rows
- **Shape:** 12px radius, 1px Pencil border, 8px × 12px padding, 12.5px UI text.
- **Default / Hover:** transparent on Obsidian; hover adds a Charcoal wash.
- **Selected:** Charcoal fill plus a Bone White border.
- **Special:** "don't know" and "other" use a dashed border; the radio is a 16px circle with a 6px dot when selected.
- **Layout:** rows stack with 8px gaps; the row itself is the hit target, not just the radio.

### Cards / Containers
- **Transcript cards:** Graphite background, 16px radius, 1px Pencil border, 16px padding, no shadow.
- **Verdict chips:** 4px radius, 2px × 6px padding, 15% tint of the verdict hue with the solid hue as text. Correct, incorrect, don't-know, and moved-on each keep the same silhouette.
- **Reveals:** the model solution sits below a 1px divider inside the same card; it never becomes a second card or a colored panel.
- **Graph node card:** 16px radius, Graphite, 16px padding, Menu shadow, 320px wide — the one content card that floats, because it opens over the canvas.

### Segmented Controls
- **Container:** 8px radius, 1px Pencil border at 60%, 2px padding, Obsidian ground.
- **Items:** 4px radius, 11px uppercase mono, Ash at rest; the active item takes a Charcoal fill and Bone White text.
- **Use:** teaching/practice filters, home-mode switch, and small binary choices. Never for primary navigation.

### Navigation
- **Sidebar:** fixed 288px, Graphite-free Obsidian ground, 1px right border; 12px-radius rows with 8px × 12px padding.
- **Type:** 11px uppercase mono section labels in Ash; session titles use Source Sans 3 at the 16px reading size so a learner's own words stay in the reading voice.
- **States:** hover adds Charcoal; the active session takes Charcoal plus Bone White text. No icons on session rows; icons belong to global actions.
- **Collapse:** below 928px the sidebar slides out; the closed toggle keeps a 36px square hit target at the traffic-light gutter.

### Docks / Composer — the signature surface
- **Shape:** 16px radius, Graphite background, 1px Pencil border, 6px shell padding, Float shadow.
- **Composer:** a transparent contenteditable field at 16px prose/1.25, a 40px-square Bone White send button at 10px radius, and a quiet stats row below with 11px mono pills.
- **Question dock:** the same shell grows to `min(55dvh, 100% - 16rem)`. The statement, option rows, confidence rail and thinking field form ONE internally scrolling sheet; the Submit row stays pinned below it. Its content swaps with a 120ms fade-and-rise while the shell height morphs separately.
- **Law:** the dock replaces the composer in place. It never opens a modal, and it shares the 46rem reading column with the transcript and composer.

### Tooltips
- **Style:** Charcoal chip, 8px radius, 4px × 8px padding, 11px mono at 85% Bone White, no arrow.
- **Behavior:** opens after a 500ms rest; the shortcut rides in parentheses ("Dictate (⌘D)"). It is un-hoverable, so it disappears the moment the pointer leaves the trigger.
- **Use:** icon controls and unlabeled pills only; never for information the interface cannot live without.

### Code Blocks & Tables
- **Code:** 12px radius, 1px Pencil border, an inset well one step darker than the ground, 12px × 16px padding; no header bar. The copy affordance is a 24px icon that appears on hover in the top-right corner.
- **Tables:** 1px outer border, hairline row rules, a stronger header underline, and 16px prose text. Tables hug their content (`max-content`) and scroll horizontally inside the column rather than wrapping cells.
- **Syntax highlighting:** Shiki colors are allowed inside the code well only; they never leak into chrome.

## Do's and Don'ts

### Do:
- **Do** keep Obsidian `#141414` as the ground and Graphite `#1c1c1c` as the panel; every raised surface moves exactly one step.
- **Do** use Bone White `#e6e6e6` as the only accent and keep its coverage under roughly 10% of any screen.
- **Do** set teaching prose and tables at 16px/1.5, labels at 11px uppercase mono with 0.05em tracking, and titles in CMU Serif.
- **Do** stay on the 4px spacing rhythm and the 4/8/12/16px radius ladder.
- **Do** separate surfaces with 1px Pencil hairlines before reaching for a shadow.
- **Do** reserve shadows for elements that overlap other content (composer, menus, dialogs, node cards).
- **Do** use hue only as a 15% verdict tint or a solid status dot/text, never as decoration.
- **Do** animate state with 120–200ms ease-out fades and 4–6px rises; honor `prefers-reduced-motion`.
- **Do** keep the composer, dock, and transcript on the same 46rem column.
- **Do** give every keyboard-focusable control a visible 1px Ash focus-visible ring; pointer focus stays quiet.

### Don't:
- **Don't** introduce a brand hue, gradient, neon glow, or colored primary button.
- **Don't** use pure black or pure white; Obsidian and Bone White already carry the extremes.
- **Don't** put shadows on transcript cards, option rows, navigation, or static panels.
- **Don't** set serif type in controls or mono type in teaching prose.
- **Don't** set reading text below 16px or labels below 11px.
- **Don't** use pill shapes for content cards; pills are for floating metadata and compact canvas controls.
- **Don't** use color to mark lesson phases or to decorate the graph; phase color-coding is retired and state belongs to motion and tone.
- **Don't** rely on a heavy browser-default focus outline; keyboard focus is the 1px Ash ring (components may keep their local rings).
- **Don't** let code blocks or tables rebuild their own header chrome; they melt into the message as a single quiet block.
- **Don't** add a fourth surface gray beyond ground, panel, hover, and the recessed code well.
