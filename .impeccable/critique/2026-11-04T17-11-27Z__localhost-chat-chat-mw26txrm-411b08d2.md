---
target: teaching session (saya ingin belajar bahasa C)
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 4
timestamp: 2026-11-04T17-11-27Z
slug: localhost-chat-chat-mw26txrm-411b08d2
---
Method: dual-agent (A: ses_e58823f3fffeSXEQAdgcl455Ea · B: ses_e58823ee9ffeXMxBXLiXq2X7Ui)
Target: teaching session "saya ingin belajar bahasa C" — http://localhost:3000/chat/chat_mw26txrm_411b08d2 (Operate, desktop web build)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Selected/focus states are overridden by a global border rule; no probe progress or horizon. |
| 2 | Match System / Real World | 2 | "AGENT'S THINKING", "LIST_SESSIONS", "xhigh" speak harness, not teacher. |
| 3 | User Control and Freedom | 2 | Good escape hatches, but no skip/stop for an unbounded probe sequence. |
| 4 | Consistency and Standards | 2 | Visual language is coherent; the documented column, dock, radius, hue, and sidebar laws are not. |
| 5 | Error Prevention | 3 | Empty submits are guarded, but confidence is prefilled at 50% and sent silently. |
| 6 | Recognition Rather Than Recall | 1 | The expanded dock hides the teaching; the learner must hold the lesson in memory. |
| 7 | Flexibility and Efficiency | 3 | Strong keyboard machine (arrows, Tab, ←/→, Enter) but nearly undiscoverable. |
| 8 | Aesthetic and Minimalist Design | 3 | Beautiful, but the confidence rail is the loudest object on screen. |
| 9 | Error Recovery | 2 | Retry/rollback exist; an incorrect probe is a red chip with a collapsed "Why". |
| 10 | Help and Documentation | 1 | No explanation of confidence, probe phase, "xhigh", or the keyboard model. |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

## Design Specificity Verdict

LLM assessment: An authored instrument case around a category-interchangeable agent-chat core. The Night Observatory palette, serif titles, mono chrome, hairline surfaces, and click-to-rename title are unmistakably LearnHarness. The primary interaction is still "dark AI chat with a multiple-choice quiz": fixed sidebar → transcript → bottom dock → model/cost controls. Probe → plan → teach, the persistent graph, and evidence-over-self-report are not visible in the interaction. "PROBING" is a static header chip; the graph is an unlabeled ring; the plan has not appeared; the reason field is optional while confidence is pre-set. The product's differentiators are hidden behind its most polished surface.

Deterministic scan: Browser DOM injection succeeded — 35 anti-patterns: nested-cards 23, ai-color-palette 8, line-length 3, layout-transition 1. CLI over components found 17: 11 design-system-font-size (13/10/15px), 3 design-system-color (the logo mark), 1 side-tab, 2 border-accent-on-rounded. The session-relevant CLI subset is 2 advisory findings: practice-cards.tsx:68 and :146 at 15px, off the documented type ladder.

Where the evidence agrees: line-length confirms the transcript runs far wider than the 46rem reading measure. layout-transition confirms the sidebar animates width/margin. ai-color-palette catches the confidence rail's red→green hue, which contradicts The Verdict-Only Hue Rule. Neither detector caught the broken selected/focus borders or the dock occlusion — those required computed-state and composition judgment.

False positives: 6 purple/violet "AI palette" hits are Shiki code tokens; 2 "cyan gradient" hits are the confidence rail's semantic emerald fill; 15 nested-cards are intentional option rows; 6 more are code-block wrappers; sidebar filter and composer wrappers are controls, not decorative nesting. The logo's #fff/rgb(148,148,148) is a brand asset.

Visual overlays: injection succeeded and the overlay was present in a [Human] tab; the live server (port 8400) was stopped cleanly.

## Overall Impression

This is a beautiful shell that hides the product's actual teaching. The typography and dock-as-composer are genuinely authored. But at a standard laptop viewport the act of answering removes the lesson from the screen, the probe sequence reads as an exam, and the design system's own laws (46rem column, 55dvh dock, bone-white selection, verdict-only hue) do not render. The single biggest opportunity is the relationship between the teaching and the dock.

## What's Working

1. The three-voice type system lands. CMU Serif titles, JetBrains Mono chrome, Source Sans prose on obsidian is deliberate and legible; the click-to-rename title is a confident low-friction detail.
2. The dock-as-composer is the signature move. The question replaces the composer in place instead of opening a modal, and the height adapts by phase (probe quick, teach deep).
3. The answered card's record logic is refined. Code, selected/correct marks, a handle-less confidence rail, the learner's thinking lifted above the card, and a tucked explanation all read as a record rather than a control.

## Priority Issues

### [P0] The dock swallows the lesson
What: At 1440×900 the expanded dock is 657px tall (73% of the viewport), leaving 126px of transcript; at 1024×768 it is 620px (81%), leaving 32px (question-dock.tsx:565, chat.tsx:2387-2427).
Why it matters: It contradicts the 55dvh cap in DESIGN.md and turns answering into a quiz modal. At 1024px the lesson is entirely off-screen.
Fix: Cap the whole shell, not just the question area, to min(55dvh, 100% - 16rem); scroll the entire dock internally; collapse confidence and thinking into a compact row for probes; reserve at least 10 lines of the last teaching step above it.
Suggested command: /impeccable layout

### [P1] Two columns: 1104px transcript, 702px dock
What: The transcript is w-full max-w-none (measured 1104px) while the dock is 46rem (702px) (chat.tsx:97-98).
Why it matters: It violates The 46rem Reading Rule, runs prose far past a readable measure, and makes the signature dock look like a floating panel rather than the same page.
Fix: Restore one 46rem column for transcript, dock, and composer; if full-bleed is intentional, update DESIGN.md and keep the prose inside cards capped at 46rem.
Suggested command: /impeccable layout

### [P1] Probing is a graded gauntlet with no horizon
What: Three profile questions then seven-plus graded probes, CORRECT/INCORRECT chips, no teaching, no probe count, no "skip to plan".
Why it matters: Measurement reads as an exam; the session waited 26 minutes inside the loop; the learner cannot tell whether this ends in one question or twenty.
Fix: Add a probe register ("Probe 4 — finding your edge; two more, then a plan"), a count, and a skip link; use neutral "Noted / Not yet" for probes; keep verdict language for teach checks; auto-open the explanation and add a repair line.
Suggested command: /impeccable clarify

### [P1] The confidence rail contradicts the product and dominates the page
What: A 6-stop red→green rail, prefilled at 50, always sent, and shown unlabeled in the archive (confidence-rail.tsx:29-33).
Why it matters: It creates a second verdict channel, violates Verdict-Only Hue, and makes self-reported probability the loudest evidence in a product that promises to infer understanding from reasoning.
Fix: Make confidence an explicit, quiet, labeled "You were 70% sure"; drop the hue ramp; reserve color for confidence/outcome conflicts; never show an unlabeled rail.
Suggested command: /impeccable quieter

### [P1] Selected and focus states are broken system-wide
What: The global unlayered * { border-color: var(--color-border) } (app/globals.css:178-180) overrides border-primary, border-green-500, and focus-within. Measured: every state border is rgb(67,67,67); the thinking field has no visible focus.
Why it matters: The design's core selection language — tone shift plus bone-white edge — never renders, and a keyboard-first product has no visible focus on its central input.
Fix: Move the universal rule into @layer base or scope borders per component; verify selected, correct, destructive, and focus states across dock, cards, and composer; add a local focus ring to the thinking field.
Suggested command: /impeccable audit

## Persona Red Flags

Rina, returning adult learner. She comes back after 26 minutes. The sidebar says "Waiting for input", but the main surface shows the same probe with no "here's what I've learned" summary, no plan, and no resume cue. The dock has hidden the teaching.

Sam, keyboard/accessibility user. Tabs through the interface and finds no visible focus on the thinking field; selection is a one-step fill because the bone-white border is overridden. The confidence ramp is color-only, and "INCORRECT" is conveyed by hue.

Budi, Indonesian-speaking self-directed learner. The lesson is Indonesian but the chrome is English (CONFIDENCE, YOUR THINKING, INCORRECT, I don't know). He is asked to predict his correctness before submitting and sees a red failure chip during what is supposed to be a diagnostic.

## Minor Observations

- The collapsed dock teaser shows raw backticks/fences (question-dock.tsx:174-185).
- Option labels with $6$ render KaTeX/Times at ~19px inside a 12.5px mono row.
- Radius drift: 6px and 10px controls outside the 4/8/12/16 ladder.
- Top band is 60px against DESIGN.md's 52px.
- The scroll-to-bottom circle collides with the only visible teaching line at ~900px.
- Browser build never auto-closes the sidebar below 928px; DESIGN.md claims it does.
- Tab title "Learning Harness" vs product name LearnHarness.
- Fixture sessions ("steer: live", duplicated "Fixture mixed queue") pollute the first-run sidebar.
- /api/stt/token returns 503 while Dictate still looks enabled; favicon 404.
- "Why" is the learning payload but is an 11px ash link after the verdict.

## Questions to Consider

1. If the persistent graph is the product's memory, why is the only visible evidence a tiny unlabeled ring and a self-typed percentage?
2. What would this screen look like if probing were framed as "finding your edge" rather than "testing you"? Would INCORRECT survive in red?
3. Why does the most authored surface — the 657px dock — hide the teaching it exists to check?
4. What does Rina see when she returns? Why isn't it "here is what I now know about you; one more check and I'll propose your plan"?
