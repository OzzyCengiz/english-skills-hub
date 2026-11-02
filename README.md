English Skills Hub — Reading & Writing Studio

An editorial-grade, accessibility-first web application engineered for young English language learners (Grades 1–6). It bridges foundational reading comprehension with guided writing composition using clean typography, bespoke per-unit dynamic theming, and zero external dependencies.

Designed and developed by an ESL educator with 8+ years of classroom experience, translating real pedagogical problem-solving into a lightweight, human-crafted frontend architecture.

⚡ Live Demo

Launch Reading & Writing Studio

🖋 Design Philosophy: Editorial & Craft

Unlike generic, template-driven AI dashboards flooded with gradients and heavy component frameworks, this platform takes an editorial, typography-centric approach:

Warm Canvas & Paper Ink: High-contrast reading environment inspired by print publications (Instrument Serif paired with Plus Jakarta Sans and JetBrains Mono).

Dynamic Thematic Accents: Each unit injects its own distinct color identity (Terracotta, Sage, Indigo, Ochre, Teal) into CSS Custom Properties (--accent-color, --accent-tint, --accent-border) without touching JavaScript styles or full-page repaints.

Cognitive Clarity: Elimination of visual noise (no floating rounded cards or arbitrary emojis) to keep attention strictly on sentence structures and vocabulary context.

✨ Features & Pedagogical Engineering

Comprehensive Spiral Curriculum (Grades 1–6):

Progressive strategy ladders from character recognition and 5 Ws to complex paraphrasing and deep inferences.

Paired writing objectives for each text genre (Narrative, Informational, Explanatory, Comparative).

Interactive Vocabulary Anchors: In-text keywords open contextual modal cards with precise definitions, parts of speech, and auditory pronunciation.

Native Web Speech Synthesis: Browser-level Text-to-Speech (TTS) calibrated for young ESL learners (adjusted pacing and clear enunciation) for both full passage reading and individual terms.

Assistive Reading Tools:

Dynamic Tracking Mask: A mouse-following focus overlay that isolates the active line of text to assist students with ADHD, visual crowding, or emerging literacy.

Dyslexia-Friendly Adaptation: One-click typography shift to high-legibility geometric styling (Lexend) with expanded tracking and word spacing.

Adjustable Type Scale: Granular font sizing directly managed in app state.

Immediate Formative Feedback: Option-based comprehension checks providing contextual teaching notes upon answer selection.

🛠 Technical Architecture

Built purely with vanilla web standards—no React, no Tailwind CDN, no npm build step. Fast, accessible, and performant by design.

english-skills-hub/
│
├── index.html              # Semantic HTML5 markup (ARIA, dialogs, masthead)
├── css/
│   ├── main.css            # Editorial baseline, typographic scales & layout shell
│   └── components.css      # Dialogs, unit links, exercise choices & focus mask
├── js/
│   ├── data.js             # Curriculum data store (Grades 1–6 & unique palettes)
│   ├── state.js            # Single source of truth for runtime application state
│   ├── speech.js           # Lightweight Web Speech API wrapper
│   └── app.js              # DOM controller, dynamic CSS injector & event orchestrator
└── README.md


Key Engineering Decisions

Separation of Concerns: Data models (CURRICULUM_DATA), application state (AppState), and view renderers (App.views) are isolated into dedicated modules.

CSS Variable Theming: Dynamic colors are injected at the :root level during unit selection, allowing the entire theme cascade to update natively via CSS inheritance.

Event Delegation & Memory Safety: Reusable event bindings and modal managers eliminate redundant DOM listener creation.

🚀 Running Locally

No installation or node modules required.

Clone the repository:

git clone https://github.com/OzzyCengiz/english-skills-hub.git


Open the project:

Double-click index.html to open in any modern browser, or

Launch with VS Code Live Server (http://127.0.0.1:5500).

👨‍🏫 About the Author

A veteran ESL educator based in Thailand with 8+ years of classroom teaching experience across primary and secondary levels. Passionate about software craftsmanship, accessibility, and creating digital learning tools that actually work in real classroom environments.

GitHub: @yOzzyCengiz

Email: oguzhancengix@gmail.com