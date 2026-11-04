# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Independent adult learners: self-directed people working through conceptually
difficult topics outside a formal curriculum. They want depth and usable
understanding, not quick answers. They choose their own models/providers and
often think out loud in the app's reasoning fields.

## Product Purpose

LearnHarness is an agent harness for learning. It plans and teaches from the
learner's current understanding to a goal: measure first, plan a dependency
map, teach one reasoning step at a time, then practice retrieval. A persistent
knowledge graph carries what was learned across sessions. Success means the
learner can use and derive the idea, not merely recognize it.

## Positioning

Teaching starts from evidence of what the learner actually understands, gathered
through probing before instruction. Each step is built on confirmed prior
understanding, confusions are repaired before anything is built on them, and
understanding is inferred from the learner's reasoning rather than self-reported
mastery ratings. A persistent proposition-and-reasoning graph makes that
evidence cumulative across sessions.

## Operating Context

- Desktop app for macOS, Windows and Linux; a Next.js browser build also runs
  locally in development under Herd at https://learnharness.test.
- Local storage for chats, knowledge graph, settings and API keys.
- Models via provider API keys, supported subscription connections, an installed
  Claude Code CLI, or a custom OpenAI-compatible endpoint (including local
  servers).
- Optional dictation (Deepgram) and web research use separate service keys.
- Background subagents research, read PDFs, build interactive demos and make
  visual explanations; demo code runs in a sandboxed iframe.

## Capabilities and Constraints

- Teaching sessions: prober -> plan -> teacher flow; quizzes, free recall,
  explain checks, and a visible plan tree.
- Practice sessions: committed problem + hidden model solution, learner thinking,
  conclusion with outcome and reveal.
- Persistent knowledge graph of propositions and reasoning chains, with
  message-granular provenance; notes import; graph context for new sessions.
- Open source under AGPL-3.0-only. No LearnHarness subscription or markup;
  billing belongs to the chosen provider.
- The understanding/state model for the graph is undecided and deliberately
  deferred; practice outcomes are session evidence, not a spaced-repetition
  store.
- No hosted multi-user web product today; local desktop is the shipped runtime.
- Terminology: learner, teacher, prober, practitioner, session (teaching /
  practice), proposition, chain, probe, plan, problem, thinking fields.

## Brand Commitments

- Name: LearnHarness.
- Open source and inspectable behavior: system prompts are visible and editable.
- Local-first ownership: the learner's keys and data stay on their machine.
- No formal voice guide exists; repo-facing copy is direct and plain.

## Evidence on Hand

- README plus screenshots in `docs/assets/` (teaching session, knowledge graph,
  banners).
- Technical and pedagogical docs in `docs/` (architecture, teaching methodology,
  development, keyboard, providers).
- No public testimonials, user counts, benchmarks, case studies or pricing.
  Synthetic illustrations are allowed, but must not be presented as real claims.

## Product Principles

1. Measure before teaching; adapt to evidence, not assumptions.
2. Build understanding one reasoning step at a time and repair confusion first.
3. Practice must require retrieval, not recognition.
4. Infer understanding from evidence; never store self-reported mastery.
5. Keep keys, data and behavior inspectable and owned by the learner.
