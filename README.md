# English Skills Hub & Studio 📚

An editorial, accessibility-first web platform and curriculum management studio designed for primary ESL learners (Grades 1–6). It bridges reading comprehension, vocabulary development, dictation, pronunciation practice, syntax building, and structured writing tasks using modern vanilla web standards, dynamic design token injection, browser-native speech synthesis & recognition, and an integrated authoring CMS.

Designed and architected by an educator with 8+ years of ESL classroom experience to solve real-world literacy bottlenecks without relying on heavy frontend frameworks or backend overhead.

---

## 🚀 Live Demo & Studio
- **Student Hub:** [https://ozzycengiz.github.io/english-skills-hub/](https://ozzycengiz.github.io/english-skills-hub/)
- **Curriculum Studio (Admin CMS):** [https://ozzycengiz.github.io/english-skills-hub/admin.html](https://ozzycengiz.github.io/english-skills-hub/admin.html)

---

## ✨ Key Capabilities

### 🎓 Learner Experience (`index.html`)
- **Structured Scaffolding & Global Search (Grades 1–6):** Level-appropriate literacy progression covering core reading strategies alongside writing goals, with instant cross-grade search by unit title, skill, or target word.
- **Dynamic Theming & Reading Comfort Modes:**
  - Seamless unit palette transitions per grade using zero-runtime CSS Custom Properties.
  - One-click **Reading Surface Themes** (`☀️ Paper`, `📜 Warm Sepia`, `🌙 Night Ink`) and dyslexia-friendly typography (`Lexend` Easy-Read toggle + live font scaling).
- **Integrated Speech Synthesis, Roleplay & Pronunciation Check:**
  - **Browser-Native TTS & Interactive Roleplay (`🎭 Roleplay Mode`):** Learners can listen to the full passage or select a character to roleplay—the browser voices the other speakers and pauses with a *"🎤 Your Turn!"* cue on the learner's lines.
  - **Microphone Read-Aloud & Pronunciation Check (`SpeechRecognition`):** Learners can speak individual vocabulary words or full dialogue sentences into their microphone to receive instant accuracy feedback.
- **3-Mode Vocabulary Studio & Personal Word Bank (`🔖 Word Bank`):**
  - **📖 Standard List**, **🃏 Flashcard Flip Mode**, and **🎧 Dictation & Spelling Challenge** (audio-first spelling practice with letter hints).
  - Bookmark any target word across Grades 1–6 into a persistent **Personal Word Bank**.
- **3-Stage Practice Engine (MCQs + Cloze Test + Sentence Scrambler):**
  - Multiple-choice comprehension checks with pedagogical clues.
  - Automatically generated **Vocabulary in Context (Fill in the Blanks)** exercises powered by an interactive Word Bank.
  - Interactive **Sentence Scrambler (Syntax & Word Order)** builder to reinforce English sentence structure.
- **Smart Writing Workshop & Writing Coach:**
  - Real-time target vocabulary checklist (chips turn green as students use target words).
  - **Writing Coach (Mechanics Check):** Live verification of capitalization, end punctuation (`. ! ?`), and sentence length goals.
  - Clickable sentence starters, live word/sentence counter, browser auto-save, TTS self-review, `.txt` download, and printable worksheet view.
- **Printable Full Lesson Handout (`📄 Print Full Handout`):** Generates a complete, single-page classroom worksheet (Passage + Vocabulary Table + MCQs + Lined Writing Section) ready for offline distribution.
- **Literacy Progress Report & Achievement Badges (`📊 Progress`):** Portfolio summary modal tracking completed units across Grades 1–6, vocabulary practiced, total words written, and unlockable milestone badges (*First Step*, *Word Collector*, *Young Author*, *Grade Scholar*).

### ⚙️ Curriculum Studio CMS (`admin.html`)
- **Complete In-Browser CRUD, Reordering & Duplication:** Create, read, update, delete, clone (`📋 Duplicate`), and reorder (`↑`/`↓`) lessons across Grades 1–6 directly in the browser interface.
- **Live Unit Preview (`👁 Preview`):** Inspect how passages, tokenized vocabulary, and questions render before publishing.
- **Editorial Palette Selector & Multi-Question Builder:** Choose from 6 editorial color palettes and add, edit, or remove multiple comprehension questions and distractors per unit.
- **Local Persistence, Import & Export:** Changes persist in `localStorage` and automatically reflect across the Student Hub. Includes one-click **📥 Export data.js**, **📂 Import** (`.js` / `.json`), and **↺ Reset Default**.

---

## 🛠 Tech Stack & Engineering Standards

Built entirely with modern vanilla web standards (zero build steps, zero external npm dependencies, zero framework bloat):

- **HTML5 & PWA Ready:** Clean semantic document structure, accessibility attributes (`aria-*`), keyboard navigation (`Esc`, `←`/`→`), custom SVG favicon, and `manifest.json`.
- **CSS3:** Bespoke editorial aesthetic with strict typography hierarchy, CSS Grid/Flexbox layouts, `@media print` classroom handout rules, and CSS Variables for dynamic runtime theming.
- **Vanilla JavaScript (ES6+):**
  - **Decoupled Architecture:** Strict separation between data models (`data.js`), runtime state (`state.js`), audio/speech interfaces (`speech.js`), DOM rendering (`app.js`), and CMS workflows (`admin.js`).
  - **State Synchronization:** Bidirectional synchronization between persistent browser storage and static data definitions.
  - **Web Speech API (`speechSynthesis` & `SpeechRecognition`):** Lightweight abstraction layer supporting sequential TTS playback, interactive roleplay turn-taking, and spoken pronunciation evaluation.

---

## 📂 Project Architecture

```text
english-skills-hub/
│
├── index.html              # Student-facing application shell
├── admin.html              # Dedicated Curriculum Studio (Authoring CMS)
├── favicon.svg             # Custom editorial SVG icon
├── manifest.json           # Web App Manifest for installable experience
├── css/
│   ├── main.css            # Editorial typography, Paper/Sepia/Night themes, Easy-Read & print rules
│   └── components.css      # Reusable UI components, dialogue turns, cloze, scrambler, flashcards & modals
├── js/
│   ├── data.js             # Core curriculum model (Grades 1–6, units, and palettes)
│   ├── state.js            # Centralized student hub state, word bank, achievements & draft storage
│   ├── speech.js           # Web Speech API wrapper (TTS + Roleplay + SpeechRecognition evaluation)
│   ├── app.js              # Student hub controller, theme injector, handout generator & event engine
│   └── admin.js            # Curriculum Studio controller (CRUD, reorder, preview, import/export)
└── README.md               # Technical and architectural documentation
```

---

## 💻 Local Setup & Development

No build pipeline, package manager, or compilation needed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OzzyCengiz/english-skills-hub.git
   ```
2. **Navigate into the project directory:**
   ```bash
   cd english-skills-hub
   ```
3. **Launch the platform:**
   - Open `index.html` directly in any modern browser for the student hub.
   - Open `admin.html` to manage and author lesson units.
   - Alternatively, serve via VS Code *Live Server* or any local static file server.

---

## 🔄 Content Authoring Workflow

1. Navigate to `/admin.html`.
2. Select the target grade and choose **+ New Unit** (or select an existing unit from the index to edit, reorder with `↑`/`↓`, or clone with **📋 Duplicate**).
3. Choose an **Editorial Palette**, fill in the passage lines (`Speaker | Sentence`), vocabulary items (`Word | POS | Definition`), and add one or more comprehension checks via **+ Add Question**.
4. Click **👁 Preview** to verify the layout, then click **Publish Unit** (or **Save Changes**) to review updates instantly in `/index.html`.
5. Click **Export data.js**, replace `js/data.js` in your local directory, and push to GitHub to ship updates to production.

---

## 📬 Contact & Inquiries

Open to frontend engineering roles, EdTech tooling, and custom educational web development.

- **GitHub:** [@OzzyCengiz](https://github.com/OzzyCengiz)
- **Email:** oguzhancengix@gmail.com
