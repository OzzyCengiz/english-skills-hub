# English Skills Hub & Studio 📚

An editorial, accessibility-first web platform and curriculum management studio designed for primary ESL learners (Grades 1–6). It bridges reading comprehension, vocabulary development, and structured writing tasks using modern vanilla web standards, dynamic design token injection, browser-native speech synthesis, and an integrated authoring CMS.

Designed and architected by an educator with 8+ years of ESL classroom experience to solve real-world literacy bottlenecks without relying on heavy frontend frameworks or backend overhead.

---

## 🚀 Live Demo & Studio
- **Student Hub:** https://ozzycengiz.github.io/english-skills-hub/
- **Curriculum Studio (Admin CMS):** https://ozzycengiz.github.io/english-skills-hub/admin.html

---

## ✨ Key Capabilities

### 🎓 Learner Experience (`index.html`)
- **Structured Scaffolding (Grades 1–6):** Level-appropriate literacy progression covering core reading strategies (paraphrasing, character analysis, inferences) alongside writing goals.
- **Dynamic Theming via CSS Tokens:** Seamless palette transitions per unit and grade using zero-runtime CSS Custom Properties.
- **Integrated Reading Assistance:**
  - **Browser-Native TTS:** Contextual speech synthesis via Web Speech API with tailored rate and accent controls.
  - **Focus Mask Lens:** Guided reading window to eliminate visual clutter and support learners with ADHD or visual tracking difficulties.
  - **Typography Adaptability:** Live scale controls and one-click toggle for dyslexia-friendly typography (`Lexend`).
- **Contextual Vocabulary Engine:** Non-destructive keyword tokenization and definition modals with pronunciation playback.
- **Immediate Formative Feedback:** Multiple-choice verification providing pedagogical hints and rationale.

### ⚙️ Curriculum Studio CMS (`admin.html`)
- **Complete In-Browser CRUD:** Create, read, update, and delete lessons across Grades 1–6 directly in the browser interface.
- **Local Persistence & Instant Sync:** Changes persist in `localStorage` and automatically reflect across the Student Hub without server round-trips.
- **Production Data Export:** One-click JSON serialization generating a ready-to-commit `data.js` for permanent Git-backed updates.
- **Isolated Architecture:** Keeps administrative code, form parsing, and state mutation strictly separated from the public student view.

---

## 🛠 Tech Stack & Engineering Standards

Built entirely with modern vanilla web standards (zero build steps, zero external npm dependencies, zero framework bloat):

- **HTML5:** Clean semantic document structure, accessibility attributes (`aria-*`), and responsive viewport standards.
- **CSS3:** Bespoke editorial aesthetic with strict typography hierarchy, CSS Grid/Flexbox layouts, and CSS Variables for dynamic runtime theming.
- **Vanilla JavaScript (ES6+):**
  - **Decoupled Architecture:** Strict separation between data models (`data.js`), runtime state (`state.js`), audio interfaces (`speech.js`), DOM rendering (`app.js`), and CMS workflows (`admin.js`).
  - **State Synchronization:** Bidirectional synchronization between persistent browser storage and static data definitions.
  - **Web Speech API:** Lightweight abstraction layer over the native browser speech synthesizer.

---

## 📂 Project Architecture

```text
english-skills-hub/
│
├── index.html              # Student-facing application shell
├── admin.html              # Dedicated Curriculum Studio (Authoring CMS)
├── css/
│   ├── main.css            # Editorial typography, layout shells, and CSS variables
│   └── components.css      # Reusable UI components, themes, dialogue turns, and modals
├── js/
│   ├── data.js             # Core curriculum model (Grades 1–6, units, and palettes)
│   ├── state.js            # Centralized student hub state
│   ├── speech.js           # Web Speech API wrapper
│   ├── app.js              # Student hub controller, theme injector, and event engine
│   └── admin.js            # Curriculum Studio controller (CRUD, storage & export)
└── README.md               # Technical and architectural documentation
```

---

## 💻 Local Setup & Development

No build pipeline, package manager, or compilation needed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/english-skills-hub.git
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
2. Select the target grade and choose **+ New Unit** (or select an existing unit from the index to edit).
3. Fill in the passage lines (`Speaker | Sentence`), vocabulary items (`Word | POS | Definition`), and comprehension checks.
4. Click **Publish Unit** to review changes instantly in `/index.html`.
5. Click **Export data.js**, replace `js/data.js` in your local directory, and push to GitHub to ship updates to production.

---

## 📬 Contact & Inquiries

Open to frontend engineering roles, EdTech tooling, and custom educational web development.

- **GitHub:** @OzzyCengiz
- **Email:** oguzhancengix@gmail.com
