/**
 * English Skills Hub - Application Controller
 * Handles UI rendering, theme injection, speech & roleplay, dictation/spelling, word bank, mobile navigation, and local curriculum sync.
 */
const App = {
  selectedClozeWord: null,
  searchQuery: "",

  init() {
    this.syncCustomCurriculum();
    this.applySurfaceMode(AppState.surfaceMode);
    this.renderGradePills();
    this.bindGlobalEvents();
    this.loadState();
  },

  syncCustomCurriculum() {
    const saved = localStorage.getItem("esh_custom_curriculum_v3");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(grade => {
          if (CURRICULUM_DATA[grade] && Array.isArray(parsed[grade]) && parsed[grade].length > 0) {
            CURRICULUM_DATA[grade] = parsed[grade];
          }
        });
      } catch (e) {
        console.error("Local curriculum sync error:", e);
      }
    }
  },

  applySurfaceMode(mode) {
    AppState.setSurfaceMode(mode);
    document.body.setAttribute("data-surface", mode);
    document.querySelectorAll(".surface-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.surfaceMode === mode);
    });
  },

  loadState(scrollToMainOnMobile = false) {
    SpeechEngine.stop();
    AppState.roleplaySpeaker = "";
    this.applyTheme();
    this.renderGradePills();
    this.renderSidebarUnits();
    this.renderWorkspace();
    this.updateWordBankButtonCount();

    if (scrollToMainOnMobile && window.innerWidth <= 960) {
      const mainEl = document.getElementById("main-workspace");
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  },

  updateWordBankButtonCount() {
    const btn = document.getElementById("btn-open-wordbank");
    if (!btn) return;
    const count = AppState.getSavedWords().length;
    btn.textContent = count > 0 ? `🔖 Word Bank (${count})` : "🔖 Word Bank";
  },

  applyTheme() {
    const currentUnit = AppState.getCurrentUnit();
    if (!currentUnit || !currentUnit.theme) return;

    const root = document.documentElement;
    root.style.setProperty("--accent-color", currentUnit.theme.primary);
    root.style.setProperty("--accent-tint", currentUnit.theme.tint);
    root.style.setProperty("--accent-border", currentUnit.theme.border);
  },

  renderGradePills() {
    const container = document.getElementById("grade-pills");
    if (!container) return;
    container.innerHTML = "";

    [1, 2, 3, 4, 5, 6].forEach(grade => {
      const btn = document.createElement("button");
      btn.className = `grade-nav-item ${grade === AppState.activeGrade ? "active" : ""}`;
      btn.textContent = `Grade ${grade}`;
      btn.onclick = () => {
        if (AppState.activeGrade === grade && !this.searchQuery) return;
        AppState.activeGrade = grade;
        AppState.activeUnitIndex = 0;
        this.searchQuery = "";
        const searchInput = document.getElementById("unit-search-input");
        if (searchInput) searchInput.value = "";

        this.loadState();
      };
      container.appendChild(btn);
    });
  },

  renderSidebarUnits() {
    const container = document.getElementById("unit-nav-list");
    const headingEl = document.getElementById("sidebar-units-heading");
    if (!container) return;
    container.innerHTML = "";

    const query = this.searchQuery.trim().toLowerCase();

    if (query) {
      if (headingEl) headingEl.textContent = "Search Results (All Grades)";
      const results = [];

      [1, 2, 3, 4, 5, 6].forEach(grade => {
        (CURRICULUM_DATA[grade] || []).forEach((unit, idx) => {
          const inTitle = unit.title.toLowerCase().includes(query);
          const inSkill = unit.skill.toLowerCase().includes(query);
          const inWriting = unit.writingGoal.toLowerCase().includes(query);
          const inVocab = (unit.vocab || []).some(v => v.word.toLowerCase().includes(query));
          if (inTitle || inSkill || inWriting || inVocab) {
            results.push({ grade, unit, idx });
          }
        });
      });

      if (results.length === 0) {
        container.innerHTML = `<li style="padding: 0.85rem 0; font-size: 0.82rem; color: var(--ink-400);">No matching units or words found.</li>`;
        return;
      }

      results.forEach(({ grade, unit, idx }) => {
        const li = document.createElement("li");
        li.className = "unit-index-item";

        const isActive = grade === AppState.activeGrade && idx === AppState.activeUnitIndex;
        const btn = document.createElement("button");
        btn.className = `unit-link ${isActive ? "active" : ""}`;
        btn.innerHTML = `
          <span><span class="unit-number">G${grade}</span> ${unit.title}</span>
          <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--ink-400);">${unit.skill}</span>
        `;
        btn.onclick = () => {
          AppState.activeGrade = grade;
          AppState.activeUnitIndex = idx;
          this.loadState(true);
        };

        li.appendChild(btn);
        container.appendChild(li);
      });
    } else {
      if (headingEl) headingEl.textContent = "Units in this Grade";
      const units = AppState.getCurrentGradeUnits();

      units.forEach((unit, idx) => {
        const li = document.createElement("li");
        li.className = "unit-index-item";

        const progress = AppState.getUnitProgress(unit.id);
        let badgeHtml = "";
        if (progress.quizDone && progress.writingDone) {
          badgeHtml = `<span class="unit-status-badge" title="Practice & Writing Completed">✓ Done</span>`;
        } else if (progress.quizDone || progress.writingDone) {
          badgeHtml = `<span class="unit-status-badge in-progress" title="In Progress">1/2</span>`;
        }

        const btn = document.createElement("button");
        btn.className = `unit-link ${idx === AppState.activeUnitIndex ? "active" : ""}`;
        btn.innerHTML = `
          <span><span class="unit-number">${String(idx + 1).padStart(2, "0")}</span> ${unit.title}</span>
          ${badgeHtml}
        `;
        btn.onclick = () => {
          AppState.activeUnitIndex = idx;
          this.loadState(true);
        };

        li.appendChild(btn);
        container.appendChild(li);
      });
    }

    const currentUnit = AppState.getCurrentUnit();
    if (currentUnit) {
      const skillEl = document.getElementById("sidebar-skill-name");
      const writingEl = document.getElementById("sidebar-writing-goal");
      if (skillEl) skillEl.textContent = currentUnit.skill;
      if (writingEl) writingEl.textContent = currentUnit.writingGoal;
    }
  },

  renderWorkspace() {
    const unit = AppState.getCurrentUnit();
    if (!unit) return;

    const tagEl = document.getElementById("banner-grade-tag");
    const titleEl = document.getElementById("banner-unit-title");
    const descEl = document.getElementById("banner-unit-desc");

    if (tagEl) tagEl.textContent = `Grade ${AppState.activeGrade} · Unit ${AppState.activeUnitIndex + 1}`;
    if (titleEl) titleEl.textContent = unit.title;
    if (descEl) descEl.textContent = `${unit.type} — Genre & Comprehension Practice`;

    const container = document.getElementById("workspace-content");
    if (!container) return;
    container.innerHTML = "";

    switch (AppState.activeTab) {
      case "passage":
        container.innerHTML = this.views.passage(unit);
        this.bindPassageEvents(unit);
        break;
      case "vocab":
        container.innerHTML = this.views.vocab(unit);
        this.bindVocabEvents(unit);
        break;
      case "practice":
        container.innerHTML = this.views.practice(unit);
        this.bindPracticeEvents(unit);
        break;
      case "write":
        container.innerHTML = this.views.write(unit);
        this.bindWriteEvents(unit);
        break;
    }
  },

  views: {
    passage(unit) {
      const uniqueSpeakers = [...new Set(unit.lines.map(l => l.speaker))];
      const roleOptions = uniqueSpeakers.map(sp => `
        <option value="${sp}" ${AppState.roleplaySpeaker === sp ? "selected" : ""}>🎭 Roleplay as: ${sp}</option>
      `).join("");

      const dialogueLines = unit.lines.map((l, idx) => {
        let text = l.text;
        unit.vocab.forEach(v => {
          const escaped = v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const reg = new RegExp(`\\b(${escaped})\\b`, "gi");
          text = text.replace(reg, `<span class="vocab-anchor" data-word="${v.word}">$1</span>`);
        });

        const isUserRole = AppState.roleplaySpeaker && l.speaker.toLowerCase() === AppState.roleplaySpeaker.toLowerCase();

        return `
          <div class="dialogue-turn ${isUserRole ? "is-user-role" : ""}" data-line-index="${idx}">
            <div>
              <span class="speaker-label">${l.speaker}</span>
              ${isUserRole ? `<div><span class="role-badge">🎤 YOUR LINE</span></div>` : ""}
            </div>
            <div>
              <div class="speech-body">${text}</div>
              <div class="speech-feedback-box line-feedback" data-feedback-index="${idx}" style="display: none;"></div>
            </div>
            <div class="line-actions">
              <button class="line-speak-btn" data-line-index="${idx}" title="Listen to this line" aria-label="Listen to line ${idx + 1}">🔊</button>
              <button class="line-mic-btn" data-line-index="${idx}" title="Practice reading this line aloud" aria-label="Read line ${idx + 1} aloud">🎙</button>
            </div>
          </div>
        `;
      }).join("");

      return `
        <div class="reading-canvas">
          <div class="reading-toolbar">
            <span style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--ink-400);">TAP DOTTED WORDS FOR DEFINITIONS · 🔊 LISTEN · 🎙 READ ALOUD</span>
            <div class="reading-toolbar-controls">
              <select id="roleplay-speaker-select" aria-label="Roleplay character" style="padding: 0.35rem 0.5rem; border: 1px solid var(--ink-border); border-radius: 4px; font-family: var(--font-mono); font-size: 0.75rem; background: var(--bg-surface); color: var(--ink-700);">
                <option value="">🎭 Roleplay: Off (Listen All)</option>
                ${roleOptions}
              </select>
              <select id="speech-rate-select" aria-label="Reading speed" style="padding: 0.35rem 0.5rem; border: 1px solid var(--ink-border); border-radius: 4px; font-family: var(--font-mono); font-size: 0.75rem; background: var(--bg-surface); color: var(--ink-700);">
                <option value="0.8" ${SpeechEngine.rate === 0.8 ? "selected" : ""}>0.8x Slow</option>
                <option value="0.9" ${SpeechEngine.rate === 0.9 ? "selected" : ""}>0.9x Clear</option>
                <option value="1" ${SpeechEngine.rate === 1 ? "selected" : ""}>1.0x Normal</option>
              </select>
              <button id="btn-read-passage" class="btn-pill" style="border-color: var(--accent-color); color: var(--accent-color);">
                ${AppState.roleplaySpeaker ? "🎭 Start Roleplay" : "🔊 Read Passage"}
              </button>
            </div>
          </div>
          <div class="passage-dialogue">
            ${dialogueLines}
          </div>
        </div>
      `;
    },

    vocab(unit) {
      const mode = AppState.vocabMode; // "list" | "flashcard" | "spelling"
      const cards = unit.vocab.map((v, idx) => {
        const isSaved = AppState.isWordSaved(v.word);

        if (mode === "flashcard") {
          return `
            <div class="vocab-card flashcard-mode" data-card-index="${idx}">
              <div class="flashcard-front">
                <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-400); text-transform: uppercase;">Tap to flip · ${v.part}</span>
                <h4 style="font-size: 1.65rem; font-family: var(--font-serif); margin-top: 0.35rem;">${v.word}</h4>
              </div>
              <div class="flashcard-back" style="display: none;">
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-color); font-weight: 600; text-transform: uppercase;">${v.word} (${v.part})</span>
                <p style="margin-top: 0.5rem; font-size: 0.95rem;">${v.def}</p>
              </div>
            </div>
          `;
        }

        if (mode === "spelling") {
          const maskedHint = v.word.length > 2
            ? `${v.word[0]} ${"_ ".repeat(v.word.length - 2)}${v.word[v.word.length - 1]}`
            : `${v.word[0]} _`;

          return `
            <div class="vocab-card" data-spelling-idx="${idx}" data-target-word="${v.word}">
              <div style="display:flex; justify-content:space-between; align-items:center; gap: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--accent-color); font-weight: 600;">${v.part} · ${v.word.length} LETTERS</span>
                <div style="display: flex; gap: 0.35rem;">
                  <button class="btn-pill vocab-listen-btn active" data-word="${v.word}">🔊 Hear Word</button>
                  <button class="btn-pill btn-spelling-hint" data-hint="${maskedHint}">💡 Hint</button>
                </div>
              </div>
              <p style="margin-top: 0.65rem; color: var(--ink-700); font-size: 0.95rem;">${v.def}</p>
              <div class="spelling-hint-display" style="display: none; margin-top: 0.45rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-color);"></div>
              <div class="spelling-input-row">
                <input type="text" class="spelling-input" placeholder="Type the word you hear..." autocomplete="off" autocapitalize="none" spellcheck="false">
                <button type="button" class="btn-pill btn-check-spelling">✓ Check</button>
              </div>
              <div class="speech-feedback-box spelling-feedback" style="display: none;"></div>
            </div>
          `;
        }

        return `
          <div class="vocab-card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap: 0.4rem; flex-wrap: wrap;">
              <h4 style="font-size: 1.35rem; font-family: var(--font-serif);">${v.word}</h4>
              <div style="display: flex; gap: 0.3rem;">
                <button class="btn-pill vocab-listen-btn" data-word="${v.word}" title="Listen to pronunciation">🔊</button>
                <button class="btn-pill vocab-mic-btn" data-word="${v.word}" data-vocab-idx="${idx}" title="Test your pronunciation">🎙</button>
                <button class="btn-pill btn-save-word ${isSaved ? "is-saved" : ""}" data-vocab-idx="${idx}" title="Save to your personal Word Bank">${isSaved ? "★ Saved" : "☆ Save"}</button>
              </div>
            </div>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--accent-color); font-weight: 600;">${v.part}</span>
            <p style="margin-top: 0.5rem; color: var(--ink-700);">${v.def}</p>
            <div class="speech-feedback-box vocab-feedback" data-vocab-feedback="${idx}" style="display: none;"></div>
          </div>
        `;
      }).join("");

      return `
        <div class="vocab-toolbar">
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-400);">
            ${unit.vocab.length} TARGET WORDS IN THIS UNIT
          </span>
          <div class="tool-group" role="group" aria-label="Vocabulary study mode">
            <button type="button" class="vocab-mode-btn ${mode === "list" ? "active" : ""}" data-vmode="list">📖 List</button>
            <button type="button" class="vocab-mode-btn ${mode === "flashcard" ? "active" : ""}" data-vmode="flashcard">🃏 Flashcards</button>
            <button type="button" class="vocab-mode-btn ${mode === "spelling" ? "active" : ""}" data-vmode="spelling">🎧 Dictation & Spell</button>
          </div>
        </div>
        <div class="vocab-grid">${cards}</div>
      `;
    },

    practice(unit) {
      const totalQ = unit.exercises.length;
      const scoreHeaderHtml = `
        <div class="vocab-toolbar" style="margin-bottom: 1.25rem; padding: 0.75rem 1rem; background: var(--bg-surface); border: 1px solid var(--ink-border); border-radius: 4px;">
          <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-700); font-weight: 600;">
            📝 READING COMPREHENSION (${totalQ} QUESTIONS)
          </span>
          <span id="mcq-score-banner" style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-color); font-weight: 600;">
            Answered: 0 / ${totalQ} · Correct: 0
          </span>
        </div>
      `;

      const mcqHtml = scoreHeaderHtml + unit.exercises.map((ex, i) => {
        const opts = [ex.correct, ...(ex.options || [])].sort(() => Math.random() - 0.5);
        const optButtons = opts.map(o => `
          <button class="choice-btn" data-correct="${o === ex.correct}">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; margin-right: 0.75rem; color: var(--ink-400);">•</span>
            ${o}
          </button>
        `).join("");

        return `
          <div class="exercise-entry mcq-entry" data-question-index="${i}">
            <p class="exercise-question"><strong>${i + 1}.</strong> ${ex.question}</p>
            <div class="choice-list">${optButtons}</div>
            <div class="tip-box" style="display: none; margin-top: 1rem; padding: 0.75rem; background: var(--accent-tint); border-left: 3px solid var(--accent-color); color: #121316; font-size: 0.85rem;">
              💡 <strong>Note:</strong> ${ex.tip}
            </div>
          </div>
        `;
      }).join("");

      let clozeSentencesHtml = "";
      const usedWords = [];

      unit.vocab.forEach(v => {
        const escaped = v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const reg = new RegExp(`\\b(${escaped})\\b`, "i");
        const matchingLine = unit.lines.find(l => reg.test(l.text));

        if (matchingLine) {
          usedWords.push(v.word);
          const blanked = matchingLine.text.replace(
            reg,
            `<button type="button" class="cloze-blank-btn" data-answer="${v.word}">[ _____ ]</button>`
          );
          clozeSentencesHtml += `<p style="margin-bottom: 0.75rem; font-size: 1rem; line-height: 1.8;">• ${blanked}</p>`;
        }
      });

      let clozeSectionHtml = "";
      if (usedWords.length > 0) {
        const shuffledBank = [...usedWords].sort(() => Math.random() - 0.5);
        const bankChips = shuffledBank.map(w => `
          <button type="button" class="cloze-bank-chip" data-bank-word="${w}">${w}</button>
        `).join("");

        clozeSectionHtml = `
          <div class="exercise-entry" id="cloze-exercise-box">
            <span class="section-label" style="margin-bottom: 0.25rem;">VOCABULARY IN CONTEXT</span>
            <p class="exercise-question" style="margin-bottom: 0.5rem;">Fill in the Blanks</p>
            <p style="font-size: 0.85rem; color: var(--ink-400); margin-bottom: 0.85rem;">
              Tap a word from the Word Bank below, then tap the matching <strong>[ _____ ]</strong> blank in the sentence.
            </p>
            <div class="cloze-word-bank">${bankChips}</div>
            <div>${clozeSentencesHtml}</div>
          </div>
        `;
      }

      let scrambleSectionHtml = "";
      if (unit.lines && unit.lines.length > 0) {
        const targetSentence = unit.lines[0].text.trim();
        const words = targetSentence.split(/\s+/);
        const shuffled = words
          .map((word, idx) => ({ word, idx }))
          .sort(() => Math.random() - 0.5);

        const poolButtons = shuffled.map(item => `
          <button type="button" class="scramble-tile" data-tile-id="${item.idx}" data-word="${item.word.replace(/"/g, "&quot;")}">${item.word}</button>
        `).join("");

        scrambleSectionHtml = `
          <div class="exercise-entry" id="scramble-exercise-box" data-target-sentence="${targetSentence.replace(/"/g, "&quot;")}">
            <span class="section-label" style="margin-bottom: 0.25rem;">SYNTAX & WORD ORDER</span>
            <p class="exercise-question" style="margin-bottom: 0.35rem;">Sentence Scrambler</p>
            <p style="font-size: 0.85rem; color: var(--ink-400); margin-bottom: 0.85rem;">
              Tap the scrambled words below in the correct order to rebuild a sentence from the passage.
            </p>
            <div id="scramble-answer-tray" class="scramble-tray">
              <span id="scramble-placeholder" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-400);">Tap words below to build the sentence here...</span>
            </div>
            <div id="scramble-word-pool" class="scramble-pool">${poolButtons}</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" id="btn-check-scramble" class="btn-pill active">✓ Check Sentence</button>
              <button type="button" id="btn-reset-scramble" class="btn-pill">↺ Reset</button>
              <span id="scramble-feedback" style="font-family: var(--font-mono); font-size: 0.8rem; margin-left: 0.5rem;"></span>
            </div>
          </div>
        `;
      }

      return mcqHtml + clozeSectionHtml + scrambleSectionHtml;
    },

    write(unit) {
      const savedDraft = AppState.getWritingDraft(unit.id);
      const vocabChips = unit.vocab.map(v => `
        <span class="vocab-check-chip" data-check-word="${v.word.toLowerCase()}">○ ${v.word}</span>
      `).join("");

      const wg = (unit.writingGoal || "").toLowerCase();
      let starters = [
        `In "${unit.title}", we learn that `,
        `For example, `,
        `This is important because `,
        `In conclusion, `
      ];

      if (wg.includes("also, in fact, as well")) {
        starters = [`In "${unit.title}", `, `Also, `, `In fact, `, `As well, `];
      } else if (wg.includes("in conclusion, to sum it up")) {
        starters = [`First of all, `, `Another key point is `, `In conclusion, `, `To sum it up, `];
      } else if (wg.includes("and, but, so")) {
        starters = [`In my opinion, `, `, and `, `, but `, `, so `];
      } else if (wg.includes("first, next, then, finally")) {
        starters = [`First, `, `Next, `, `Then, `, `Finally, `];
      } else if (wg.includes("in order to, so that")) {
        starters = [`First, prepare `, `In order to `, `so that `, `Finally, check `];
      } else if (wg.includes("for example, for instance, such as")) {
        starters = [`I strongly recommend `, `For example, `, `For instance, `, `such as `];
      } else if (wg.includes("in contrast, on the other hand")) {
        starters = [`Both subjects share `, `In contrast, `, `On the other hand, `, `Overall, `];
      }

      const starterButtons = starters.map(s => `
        <button type="button" class="starter-chip" data-starter="${s.replace(/"/g, "&quot;")}">+ "${s.trim()}"</button>
      `).join("");

      return `
        <div class="exercise-entry">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span class="section-label" style="margin-bottom: 0.25rem;">READING STRATEGY: ${unit.skill.toUpperCase()}</span>
              <h3 style="font-family: var(--font-serif); font-size: 1.65rem;">Writing Target: ${unit.writingGoal}</h3>
            </div>
            <span id="draft-save-indicator" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-400);">Auto-saved to browser</span>
          </div>

          <p style="color: var(--ink-700); font-size: 0.95rem; margin-top: 0.35rem;">
            Compose your response below. Try to include all target vocabulary words and satisfy the Writing Coach checks!
          </p>

          <!-- Hedef Kelime Kontrolü -->
          <div class="writing-checklist-bar">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-400); text-transform: uppercase; margin-right: 0.25rem;">Target Words:</span>
            ${vocabChips}
          </div>

          <!-- Akıllı Yazım Koçu (Mechanics & Punctuation Rubric) -->
          <div class="writing-checklist-bar" style="margin-top: 0.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-400); text-transform: uppercase; margin-right: 0.25rem;">Writing Coach:</span>
            <span id="coach-cap" class="mechanics-chip">○ Capital Letters</span>
            <span id="coach-punct" class="mechanics-chip">○ End Punctuation (. ! ?)</span>
            <span id="coach-length" class="mechanics-chip">○ 2+ Sentences (15+ Words)</span>
          </div>

          <div style="margin-top: 0.85rem;">
            <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-400); text-transform: uppercase;">Sentence Starters (Tap to insert):</span>
            <div class="starter-chips">${starterButtons}</div>
          </div>

          <textarea id="writing-textarea" style="width: 100%; height: 210px; margin-top: 1rem; padding: 1rem; border: 1px solid var(--ink-border); border-radius: 4px; font-family: var(--font-sans); font-size: 1rem; background: var(--bg-canvas); color: var(--ink-900); resize: vertical;" placeholder="Draft your response here...">${savedDraft}</textarea>

          <div class="writing-footer">
            <div class="writing-stats" id="writing-stats-label">0 words · 0 sentences</div>
            <div class="writing-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" id="btn-speak-draft" class="btn-pill">🔊 Listen</button>
              <button type="button" id="btn-download-draft" class="btn-pill">📥 Download .txt</button>
              <button type="button" id="btn-print-draft" class="btn-pill">🖨 Print Worksheet</button>
              <button type="button" id="btn-clear-draft" class="btn-pill" style="color: #dc2626; border-color: #fecaca;">Clear</button>
            </div>
          </div>
        </div>
      `;
    }
  },

  openVocabModal(wordData, unit) {
    document.getElementById("modal-term").textContent = wordData.word;
    document.getElementById("modal-pos").textContent = wordData.part;
    document.getElementById("modal-definition").textContent = wordData.def;

    const feedbackBox = document.getElementById("modal-speech-feedback");
    if (feedbackBox) {
      feedbackBox.style.display = "none";
      feedbackBox.className = "speech-feedback-box";
    }

    document.getElementById("modal-speak-btn").onclick = () => SpeechEngine.speak(wordData.word);

    const saveBtn = document.getElementById("modal-save-btn");
    if (saveBtn) {
      const updateModalSaveBtn = () => {
        const saved = AppState.isWordSaved(wordData.word);
        saveBtn.classList.toggle("is-saved", saved);
        saveBtn.textContent = saved ? "★ Saved in Word Bank" : "☆ Save Word";
      };
      updateModalSaveBtn();
      saveBtn.onclick = () => {
        AppState.toggleSavedWord(wordData, AppState.activeGrade, unit?.title || "");
        updateModalSaveBtn();
        this.updateWordBankButtonCount();
      };
    }

    const practiceBtn = document.getElementById("modal-practice-btn");
    if (practiceBtn) {
      practiceBtn.textContent = "🎙 Practice Saying It";
      practiceBtn.onclick = () => {
        practiceBtn.textContent = "🔴 Listening...";
        if (feedbackBox) {
          feedbackBox.style.display = "block";
          feedbackBox.textContent = `Say "${wordData.word}" clearly into your microphone...`;
        }
        SpeechEngine.listenAndEvaluate(
          wordData.word,
          (res) => {
            practiceBtn.textContent = "🎙 Practice Saying It";
            if (!feedbackBox) return;
            feedbackBox.classList.toggle("is-good", res.passed);
            feedbackBox.textContent = res.passed
              ? `🌟 Great pronunciation! Heard "${res.transcript}" (${res.score}% match)`
              : `Heard "${res.transcript}". Try again and emphasize "${wordData.word}".`;
          },
          (err) => {
            practiceBtn.textContent = "🎙 Practice Saying It";
            if (feedbackBox) feedbackBox.textContent = err;
          }
        );
      };
    }

    document.getElementById("vocab-modal").style.display = "flex";
  },

  openWordBankModal() {
    const modal = document.getElementById("wordbank-modal");
    const body = document.getElementById("wordbank-modal-body");
    if (!modal || !body) return;

    const list = AppState.getSavedWords();
    if (list.length === 0) {
      body.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; background: var(--bg-subtle); border-radius: 4px; color: var(--ink-400);">
          You haven't saved any vocabulary words yet. Tap <strong>☆ Save</strong> on any vocabulary card or dotted word in a passage to build your personal dictionary!
        </div>
      `;
    } else {
      body.innerHTML = list.map(item => `
        <div class="exercise-entry" style="padding: 1rem; margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem;">
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.35rem; display: inline;">${item.word}</h4>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-color); text-transform: uppercase; margin-left: 0.4rem;">${item.part} · G${item.grade}</span>
            </div>
            <div style="display: flex; gap: 0.35rem;">
              <button type="button" class="btn-pill wb-listen-btn" data-word="${item.word}">🔊</button>
              <button type="button" class="btn-pill wb-remove-btn" data-word="${item.word}" style="color: #dc2626;">✕</button>
            </div>
          </div>
          <p style="font-size: 0.9rem; color: var(--ink-700); margin-top: 0.35rem;">${item.def}</p>
        </div>
      `).join("");

      body.querySelectorAll(".wb-listen-btn").forEach(btn => {
        btn.onclick = () => SpeechEngine.speak(btn.dataset.word);
      });

      body.querySelectorAll(".wb-remove-btn").forEach(btn => {
        btn.onclick = () => {
          AppState.removeSavedWord(btn.dataset.word);
          this.updateWordBankButtonCount();
          this.openWordBankModal();
          if (AppState.activeTab === "vocab") this.renderWorkspace();
        };
      });
    }

    modal.style.display = "flex";
  },

  printFullHandout() {
    const unit = AppState.getCurrentUnit();
    const container = document.getElementById("printable-handout");
    if (!unit || !container) return;

    const linesHtml = unit.lines.map(l => `
      <p style="margin-bottom: 0.45rem;"><strong>${l.speaker}:</strong> ${l.text}</p>
    `).join("");

    const vocabRows = unit.vocab.map(v => `
      <tr>
        <td style="border: 1px solid #ccc; padding: 6px 10px; font-weight: 600;">${v.word} (${v.part})</td>
        <td style="border: 1px solid #ccc; padding: 6px 10px;">${v.def}</td>
      </tr>
    `).join("");

    const questionsHtml = unit.exercises.map((ex, i) => {
      const opts = [ex.correct, ...(ex.options || [])];
      const optList = opts.map(o => `<li style="margin-left: 1.25rem; margin-bottom: 0.2rem;">[ &nbsp; ] ${o}</li>`).join("");
      return `
        <div style="margin-bottom: 0.85rem;">
          <p style="font-weight: 600; margin-bottom: 0.25rem;">${i + 1}. ${ex.question}</p>
          <ul style="list-style: none;">${optList}</ul>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div style="border-bottom: 2px solid #000; padding-bottom: 0.75rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <h1 style="font-family: Georgia, serif; font-size: 20pt;">${unit.title}</h1>
          <p style="font-size: 9pt; text-transform: uppercase;">Grade ${AppState.activeGrade} · ${unit.type} · Reading Strategy: ${unit.skill}</p>
        </div>
        <div style="font-size: 10pt; text-align: right;">
          <p>Name: _______________________</p>
          <p style="margin-top: 4px;">Date: _______________________</p>
        </div>
      </div>

      <h3 style="font-size: 11pt; text-transform: uppercase; margin-bottom: 0.5rem;">Part 1: Reading Passage</h3>
      <div style="border: 1px solid #ccc; padding: 0.75rem; margin-bottom: 1.25rem;">
        ${linesHtml}
      </div>

      <h3 style="font-size: 11pt; text-transform: uppercase; margin-bottom: 0.5rem;">Part 2: Key Vocabulary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; font-size: 10pt;">
        ${vocabRows}
      </table>

      <h3 style="font-size: 11pt; text-transform: uppercase; margin-bottom: 0.5rem;">Part 3: Comprehension Check</h3>
      <div style="margin-bottom: 1.25rem;">
        ${questionsHtml}
      </div>

      <h3 style="font-size: 11pt; text-transform: uppercase; margin-bottom: 0.35rem;">Part 4: Writing Workshop (${unit.writingGoal})</h3>
      <p style="font-size: 9.5pt; margin-bottom: 0.75rem;">Use the target vocabulary words above to write your response:</p>
      <div style="border-bottom: 1px solid #999; height: 28px; margin-bottom: 8px;"></div>
      <div style="border-bottom: 1px solid #999; height: 28px; margin-bottom: 8px;"></div>
      <div style="border-bottom: 1px solid #999; height: 28px; margin-bottom: 8px;"></div>
      <div style="border-bottom: 1px solid #999; height: 28px; margin-bottom: 8px;"></div>
    `;

    document.body.classList.add("printing-full-handout");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-full-handout");
    }, 500);
  },

  bindPassageEvents(unit) {
    document.querySelectorAll(".vocab-anchor").forEach(tag => {
      tag.onclick = () => {
        const wordData = unit.vocab.find(v => v.word.toLowerCase() === tag.dataset.word.toLowerCase());
        if (wordData) this.openVocabModal(wordData, unit);
      };
    });

    const roleSelect = document.getElementById("roleplay-speaker-select");
    if (roleSelect) {
      roleSelect.onchange = (e) => {
        SpeechEngine.stop();
        AppState.roleplaySpeaker = e.target.value;
        this.renderWorkspace();
      };
    }

    const rateSelect = document.getElementById("speech-rate-select");
    if (rateSelect) {
      rateSelect.onchange = (e) => {
        SpeechEngine.rate = parseFloat(e.target.value) || 0.9;
      };
    }

    const clearHighlights = () => {
      document.querySelectorAll(".dialogue-turn").forEach(row => row.classList.remove("is-speaking"));
    };

    const readBtn = document.getElementById("btn-read-passage");
    const defaultBtnLabel = AppState.roleplaySpeaker ? "🎭 Start Roleplay" : "🔊 Read Passage";

    document.querySelectorAll(".line-speak-btn").forEach(btn => {
      btn.onclick = () => {
        const idx = Number(btn.dataset.lineIndex);
        const line = unit.lines[idx];
        if (!line) return;

        clearHighlights();
        if (readBtn) readBtn.textContent = defaultBtnLabel;

        const row = document.querySelector(`.dialogue-turn[data-line-index="${idx}"]`);
        if (row) row.classList.add("is-speaking");

        SpeechEngine.speak(line.text, () => {
          if (row) row.classList.remove("is-speaking");
        });
      };
    });

    document.querySelectorAll(".line-mic-btn").forEach(btn => {
      btn.onclick = () => {
        const idx = Number(btn.dataset.lineIndex);
        const line = unit.lines[idx];
        if (!line) return;

        const feedbackEl = document.querySelector(`.line-feedback[data-feedback-index="${idx}"]`);
        btn.classList.add("is-listening");
        if (feedbackEl) {
          feedbackEl.style.display = "block";
          feedbackEl.className = "speech-feedback-box line-feedback";
          feedbackEl.textContent = "🔴 Listening... Read this sentence aloud.";
        }

        SpeechEngine.listenAndEvaluate(
          line.text,
          (res) => {
            btn.classList.remove("is-listening");
            if (!feedbackEl) return;
            feedbackEl.classList.toggle("is-good", res.passed);
            feedbackEl.textContent = res.passed
              ? `🌟 Excellent reading! (${res.score}% accuracy — "${res.transcript}")`
              : `Keep practicing! (${res.score}% match — Heard: "${res.transcript}")`;
          },
          (err) => {
            btn.classList.remove("is-listening");
            if (feedbackEl) feedbackEl.textContent = err;
          }
        );
      };
    });

    if (readBtn) {
      readBtn.onclick = () => {
        if (SpeechEngine.isPlayingSequence) {
          SpeechEngine.stop();
          clearHighlights();
          readBtn.textContent = defaultBtnLabel;
          readBtn.classList.remove("active");
          return;
        }

        readBtn.textContent = "⏹ Stop";
        readBtn.classList.add("active");

        SpeechEngine.speakSequence(
          unit.lines,
          (lineIdx, isUserTurn) => {
            clearHighlights();
            const row = document.querySelector(`.dialogue-turn[data-line-index="${lineIdx}"]`);
            if (row) row.classList.add("is-speaking");
            if (isUserTurn) {
              const fb = document.querySelector(`.line-feedback[data-feedback-index="${lineIdx}"]`);
              if (fb) {
                fb.style.display = "block";
                fb.className = "speech-feedback-box is-good line-feedback";
                fb.textContent = "🎤 Your Turn! Read this line aloud now...";
              }
            }
          },
          () => {
            clearHighlights();
            readBtn.textContent = defaultBtnLabel;
            readBtn.classList.remove("active");
          },
          AppState.roleplaySpeaker
        );
      };
    }
  },

  bindVocabEvents(unit) {
    document.querySelectorAll(".vocab-mode-btn").forEach(btn => {
      btn.onclick = () => {
        AppState.vocabMode = btn.dataset.vmode;
        this.renderWorkspace();
      };
    });

    document.querySelectorAll(".vocab-listen-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        SpeechEngine.speak(btn.dataset.word);
      };
    });

    document.querySelectorAll(".btn-save-word").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = Number(btn.dataset.vocabIdx);
        const wordObj = unit.vocab[idx];
        if (!wordObj) return;
        const saved = AppState.toggleSavedWord(wordObj, AppState.activeGrade, unit.title);
        btn.classList.toggle("is-saved", saved);
        btn.textContent = saved ? "★ Saved" : "☆ Save";
        this.updateWordBankButtonCount();
      };
    });

    document.querySelectorAll(".vocab-mic-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const word = btn.dataset.word;
        const idx = btn.dataset.vocabIdx;
        const feedbackEl = document.querySelector(`.vocab-feedback[data-vocab-feedback="${idx}"]`);

        btn.textContent = "🔴";
        if (feedbackEl) {
          feedbackEl.style.display = "block";
          feedbackEl.className = "speech-feedback-box vocab-feedback";
          feedbackEl.textContent = `Listening for "${word}"...`;
        }

        SpeechEngine.listenAndEvaluate(
          word,
          (res) => {
            btn.textContent = "🎙";
            if (!feedbackEl) return;
            feedbackEl.classList.toggle("is-good", res.passed);
            feedbackEl.textContent = res.passed
              ? `🌟 Spot on! Heard "${res.transcript}".`
              : `Heard "${res.transcript}". Try saying "${word}" again.`;
          },
          (err) => {
            btn.textContent = "🎙";
            if (feedbackEl) feedbackEl.textContent = err;
          }
        );
      };
    });

    document.querySelectorAll(".vocab-card.flashcard-mode").forEach(card => {
      card.onclick = () => {
        const front = card.querySelector(".flashcard-front");
        const back = card.querySelector(".flashcard-back");
        const isFlipped = card.classList.toggle("is-flipped");
        if (front && back) {
          front.style.display = isFlipped ? "none" : "block";
          back.style.display = isFlipped ? "block" : "none";
        }
        const idx = Number(card.dataset.cardIndex);
        if (isFlipped && unit.vocab[idx]) {
          SpeechEngine.speak(unit.vocab[idx].word);
        }
      };
    });

    document.querySelectorAll(".vocab-card[data-spelling-idx]").forEach(card => {
      const targetWord = card.dataset.targetWord;
      const hintBtn = card.querySelector(".btn-spelling-hint");
      const hintDisplay = card.querySelector(".spelling-hint-display");
      const input = card.querySelector(".spelling-input");
      const checkBtn = card.querySelector(".btn-check-spelling");
      const feedback = card.querySelector(".spelling-feedback");

      if (hintBtn && hintDisplay) {
        hintBtn.onclick = () => {
          hintDisplay.style.display = "block";
          hintDisplay.textContent = `Hint: ${hintBtn.dataset.hint}`;
        };
      }

      const verifySpelling = () => {
        if (!input || !feedback) return;
        const typed = input.value.trim().toLowerCase();
        const expected = targetWord.toLowerCase();
        feedback.style.display = "block";
        if (typed === expected) {
          feedback.className = "speech-feedback-box spelling-feedback is-good";
          feedback.textContent = `✓ Correct! "${targetWord}" is spelled perfectly.`;
          SpeechEngine.speak(targetWord);
        } else {
          feedback.className = "speech-feedback-box spelling-feedback";
          feedback.textContent = `✗ Not quite. Tap 🔊 Hear Word or 💡 Hint and try again!`;
        }
      };

      if (checkBtn) checkBtn.onclick = verifySpelling;
      if (input) {
        input.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            verifySpelling();
          }
        };
      }
    });
  },

  bindPracticeEvents(unit) {
    const boxes = document.querySelectorAll(".mcq-entry");
    const scoreBanner = document.getElementById("mcq-score-banner");
    let answeredCount = 0;
    let correctCount = 0;

    boxes.forEach(box => {
      const buttons = box.querySelectorAll(".choice-btn");
      const tip = box.querySelector(".tip-box");

      buttons.forEach(btn => {
        btn.onclick = () => {
          buttons.forEach(b => (b.disabled = true));
          const isCorrect = btn.dataset.correct === "true";
          btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
          if (isCorrect) {
            correctCount++;
          } else {
            const correctBtn = box.querySelector('[data-correct="true"]');
            if (correctBtn) correctBtn.classList.add("is-correct");
          }
          if (tip) tip.style.display = "block";

          answeredCount++;
          if (scoreBanner) {
            scoreBanner.textContent = `Answered: ${answeredCount} / ${boxes.length} · Correct: ${correctCount}`;
          }
          if (answeredCount >= boxes.length) {
            AppState.updateUnitProgress(unit.id, { quizDone: true });
            this.renderSidebarUnits();
          }
        };
      });
    });

    this.selectedClozeWord = null;
    const bankChips = document.querySelectorAll(".cloze-bank-chip");
    const blankBtns = document.querySelectorAll(".cloze-blank-btn");

    if (bankChips.length > 0) {
      bankChips[0].classList.add("is-selected");
      this.selectedClozeWord = bankChips[0].dataset.bankWord;
    }

    bankChips.forEach(chip => {
      chip.onclick = () => {
        bankChips.forEach(c => c.classList.remove("is-selected"));
        chip.classList.add("is-selected");
        this.selectedClozeWord = chip.dataset.bankWord;
      };
    });

    blankBtns.forEach(blank => {
      blank.onclick = () => {
        if (blank.classList.contains("is-correct") || !this.selectedClozeWord) return;

        const expected = blank.dataset.answer.toLowerCase();
        const chosen = this.selectedClozeWord.toLowerCase();

        if (expected === chosen) {
          blank.textContent = blank.dataset.answer;
          blank.classList.remove("is-wrong");
          blank.classList.add("is-correct");
          SpeechEngine.speak(blank.dataset.answer);

          const usedChip = Array.from(bankChips).find(
            c => c.dataset.bankWord.toLowerCase() === chosen && !c.classList.contains("is-used")
          );
          if (usedChip) {
            usedChip.classList.remove("is-selected");
            usedChip.classList.add("is-used");
          }

          const nextAvailable = Array.from(bankChips).find(c => !c.classList.contains("is-used"));
          if (nextAvailable) {
            nextAvailable.classList.add("is-selected");
            this.selectedClozeWord = nextAvailable.dataset.bankWord;
          } else {
            this.selectedClozeWord = null;
          }
        } else {
          blank.textContent = `${this.selectedClozeWord} ✗`;
          blank.classList.add("is-wrong");
          setTimeout(() => {
            if (!blank.classList.contains("is-correct")) {
              blank.textContent = "[ _____ ]";
              blank.classList.remove("is-wrong");
            }
          }, 900);
        }
      };
    });

    const scrambleBox = document.getElementById("scramble-exercise-box");
    const tray = document.getElementById("scramble-answer-tray");
    const pool = document.getElementById("scramble-word-pool");
    const placeholder = document.getElementById("scramble-placeholder");
    const checkScrambleBtn = document.getElementById("btn-check-scramble");
    const resetScrambleBtn = document.getElementById("btn-reset-scramble");
    const scrambleFeedback = document.getElementById("scramble-feedback");

    if (scrambleBox && tray && pool) {
      const placedTiles = [];

      const renderTray = () => {
        tray.querySelectorAll(".scramble-tile").forEach(el => el.remove());
        if (placeholder) {
          placeholder.style.display = placedTiles.length === 0 ? "inline" : "none";
        }
        placedTiles.forEach((item, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "scramble-tile";
          btn.textContent = item.word;
          btn.onclick = () => {
            placedTiles.splice(idx, 1);
            item.sourceBtn.classList.remove("is-placed");
            if (scrambleFeedback) scrambleFeedback.textContent = "";
            renderTray();
          };
          tray.appendChild(btn);
        });
      };

      pool.querySelectorAll(".scramble-tile").forEach(sourceBtn => {
        sourceBtn.onclick = () => {
          if (sourceBtn.classList.contains("is-placed")) return;
          sourceBtn.classList.add("is-placed");
          placedTiles.push({ word: sourceBtn.dataset.word, sourceBtn });
          if (scrambleFeedback) scrambleFeedback.textContent = "";
          renderTray();
        };
      });

      if (resetScrambleBtn) {
        resetScrambleBtn.onclick = () => {
          placedTiles.length = 0;
          pool.querySelectorAll(".scramble-tile").forEach(b => b.classList.remove("is-placed"));
          if (scrambleFeedback) scrambleFeedback.textContent = "";
          tray.style.borderColor = "var(--accent-color)";
          renderTray();
        };
      }

      if (checkScrambleBtn) {
        checkScrambleBtn.onclick = () => {
          const target = scrambleBox.dataset.targetSentence;
          const built = placedTiles.map(t => t.word).join(" ");
          if (built === target) {
            tray.style.borderColor = "#059669";
            if (scrambleFeedback) {
              scrambleFeedback.style.color = "#059669";
              scrambleFeedback.textContent = "✓ Perfect sentence order!";
            }
            SpeechEngine.speak(target);
          } else {
            tray.style.borderColor = "#dc2626";
            if (scrambleFeedback) {
              scrambleFeedback.style.color = "#dc2626";
              scrambleFeedback.textContent = "✗ Not quite right yet. Tap words in the box to rearrange.";
            }
          }
        };
      }
    }
  },

  bindWriteEvents(unit) {
    const textarea = document.getElementById("writing-textarea");
    const statsLabel = document.getElementById("writing-stats-label");
    const saveIndicator = document.getElementById("draft-save-indicator");
    const coachCap = document.getElementById("coach-cap");
    const coachPunct = document.getElementById("coach-punct");
    const coachLength = document.getElementById("coach-length");
    if (!textarea) return;

    const updateWritingAnalysis = () => {
      const val = textarea.value;
      const trimmed = val.trim();
      const words = trimmed ? trimmed.split(/\s+/).length : 0;
      const sentenceMatches = trimmed ? trimmed.match(/[^.!?]+[.!?]+/g) || [] : [];
      const sentences = trimmed ? sentenceMatches.length || 1 : 0;

      if (statsLabel) {
        statsLabel.textContent = `${words} word${words === 1 ? "" : "s"} · ${sentences} sentence${sentences === 1 ? "" : "s"}`;
      }

      document.querySelectorAll(".vocab-check-chip").forEach(chip => {
        const targetWord = chip.dataset.checkWord;
        const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const used = new RegExp(`\\b${escaped}\\b`, "i").test(val);
        chip.classList.toggle("is-used", used);
        chip.textContent = `${used ? "✓" : "○"} ${targetWord}`;
      });

      const startsWithCap = /^[A-Z]/.test(trimmed);
      const endsWithPunct = /[.!?]$/.test(trimmed);
      const meetsLength = words >= 15 && sentenceMatches.length >= 2;

      if (coachCap) {
        coachCap.classList.toggle("is-used", startsWithCap);
        coachCap.textContent = `${startsWithCap ? "✓" : "○"} Capital Letters`;
      }
      if (coachPunct) {
        coachPunct.classList.toggle("is-used", endsWithPunct);
        coachPunct.textContent = `${endsWithPunct ? "✓" : "○"} End Punctuation (. ! ?)`;
      }
      if (coachLength) {
        coachLength.classList.toggle("is-used", meetsLength);
        coachLength.textContent = `${meetsLength ? "✓" : "○"} 2+ Sentences (15+ Words)`;
      }
    };

    updateWritingAnalysis();

    textarea.oninput = () => {
      updateWritingAnalysis();
      AppState.saveWritingDraft(unit.id, textarea.value);
      if (saveIndicator) {
        saveIndicator.textContent = "✓ Saved";
      }
      this.renderSidebarUnits();
    };

    document.querySelectorAll(".starter-chip").forEach(btn => {
      btn.onclick = () => {
        const starter = btn.dataset.starter;
        const prefix = textarea.value && !textarea.value.endsWith(" ") && !textarea.value.endsWith("\n") ? " " : "";
        textarea.value += prefix + starter;
        textarea.focus();
        textarea.oninput();
      };
    });

    const speakDraftBtn = document.getElementById("btn-speak-draft");
    if (speakDraftBtn) {
      speakDraftBtn.onclick = () => {
        const text = textarea.value.trim();
        if (!text) return;
        SpeechEngine.speak(text);
      };
    }

    const downloadBtn = document.getElementById("btn-download-draft");
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        const text = textarea.value.trim();
        if (!text) {
          alert("Write your response first before downloading.");
          return;
        }
        const content = [
          `ENGLISH SKILLS HUB - WRITING WORKSHEET`,
          `======================================`,
          `Grade: Grade ${AppState.activeGrade}`,
          `Unit: ${unit.title} (${unit.type})`,
          `Reading Strategy: ${unit.skill}`,
          `Writing Target: ${unit.writingGoal}`,
          `--------------------------------------`,
          ``,
          text,
          ``
        ].join("\n");

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${unit.id}-writing-response.txt`;
        a.click();
      };
    }

    const printBtn = document.getElementById("btn-print-draft");
    if (printBtn) {
      printBtn.onclick = () => window.print();
    }

    const clearBtn = document.getElementById("btn-clear-draft");
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (!textarea.value.trim()) return;
        if (confirm("Clear your current writing draft for this unit?")) {
          textarea.value = "";
          textarea.oninput();
        }
      };
    }
  },

  openProgressModal() {
    const summary = AppState.getPortfolioSummary();
    const body = document.getElementById("progress-modal-body");
    const modal = document.getElementById("progress-modal");
    if (!body || !modal) return;

    const badgesHtml = summary.achievements.map(b => `
      <div class="achievement-badge ${b.unlocked ? "is-unlocked" : ""}">
        <span style="font-size: 1.5rem;">${b.icon}</span>
        <div>
          <div style="font-weight: 600; font-size: 0.85rem;">${b.title} ${b.unlocked ? "✓" : "🔒"}</div>
          <div style="font-size: 0.72rem; color: var(--ink-400);">${b.desc}</div>
        </div>
      </div>
    `).join("");

    const gradeRows = summary.gradeBreakdown.map(g => `
      <div class="grade-progress-row">
        <span>Grade ${g.grade}</span>
        <div class="grade-progress-track">
          <div class="grade-progress-fill" style="width: ${g.pct}%;"></div>
        </div>
        <span style="text-align: right;">${g.pct}%</span>
      </div>
    `).join("");

    body.innerHTML = `
      <div class="progress-stat-grid">
        <div class="progress-stat-card">
          <div class="progress-stat-value">${summary.completedUnits} / ${summary.totalUnits}</div>
          <div class="progress-stat-label">Units Completed</div>
        </div>
        <div class="progress-stat-card">
          <div class="progress-stat-value">${summary.masteredVocabCount}</div>
          <div class="progress-stat-label">Vocab Practiced</div>
        </div>
        <div class="progress-stat-card">
          <div class="progress-stat-value">${summary.totalWordsWritten}</div>
          <div class="progress-stat-label">Words Written</div>
        </div>
      </div>
      <span class="section-label">Achievement Milestones</span>
      <div class="badge-grid">${badgesHtml}</div>
      <div>
        <span class="section-label">Mastery by Grade Level</span>
        ${gradeRows}
      </div>
    `;

    modal.style.display = "flex";
  },

  bindGlobalEvents() {
    document.querySelectorAll(".surface-btn").forEach(btn => {
      btn.onclick = () => this.applySurfaceMode(btn.dataset.surfaceMode);
    });

    // Mobil Ünite Listesi Aç/Kapat Butonu
    const mobileToggleBtn = document.getElementById("btn-toggle-units-mobile");
    const collapsibleEl = document.getElementById("sidebar-collapsible-content");
    if (mobileToggleBtn && collapsibleEl) {
      mobileToggleBtn.onclick = () => {
        const isCollapsed = collapsibleEl.classList.toggle("is-collapsed");
        mobileToggleBtn.textContent = isCollapsed ? "▸ Show Units" : "▾ Hide Units";
      };
    }

    const searchInput = document.getElementById("unit-search-input");
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderSidebarUnits();
      };
    }

    const printHandoutBtn = document.getElementById("btn-print-handout");
    if (printHandoutBtn) {
      printHandoutBtn.onclick = () => this.printFullHandout();
    }

    document.querySelectorAll(".tab-link").forEach(tab => {
      tab.onclick = (e) => {
        SpeechEngine.stop();
        document.querySelectorAll(".tab-link").forEach(t => t.classList.remove("active"));
        e.currentTarget.classList.add("active");
        AppState.activeTab = e.currentTarget.dataset.tab;
        this.renderWorkspace();
      };
    });

    const fontInc = document.getElementById("font-increase");
    const fontDec = document.getElementById("font-decrease");
    const fontLabel = document.getElementById("font-size-label");

    if (fontInc) {
      fontInc.onclick = () => {
        AppState.fontSize = Math.min(22, AppState.fontSize + 2);
        document.body.style.fontSize = `${AppState.fontSize}px`;
        if (fontLabel) fontLabel.textContent = `${AppState.fontSize}px`;
      };
    }

    if (fontDec) {
      fontDec.onclick = () => {
        AppState.fontSize = Math.max(14, AppState.fontSize - 2);
        document.body.style.fontSize = `${AppState.fontSize}px`;
        if (fontLabel) fontLabel.textContent = `${AppState.fontSize}px`;
      };
    }

    const easyBtn = document.getElementById("toggle-dyslexic");
    if (easyBtn) {
      easyBtn.onclick = () => {
        AppState.isDyslexicFont = !AppState.isDyslexicFont;
        document.body.classList.toggle("easy-read-mode", AppState.isDyslexicFont);
        easyBtn.classList.toggle("active", AppState.isDyslexicFont);
      };
    }

    // Kelime Modalı
    const modalClose = document.getElementById("modal-close");
    const vocabModal = document.getElementById("vocab-modal");

    if (modalClose && vocabModal) {
      modalClose.onclick = () => {
        SpeechEngine.stop();
        vocabModal.style.display = "none";
      };
    }

    if (vocabModal) {
      vocabModal.onclick = (e) => {
        if (e.target.id === "vocab-modal") {
          SpeechEngine.stop();
          vocabModal.style.display = "none";
        }
      };
    }

    // Kişisel Kelime Defteri (Word Bank) Modalı
    const openWbBtn = document.getElementById("btn-open-wordbank");
    const closeWbBtn = document.getElementById("wordbank-modal-close");
    const wbModal = document.getElementById("wordbank-modal");

    if (openWbBtn) {
      openWbBtn.onclick = () => this.openWordBankModal();
    }
    if (closeWbBtn && wbModal) {
      closeWbBtn.onclick = () => {
        wbModal.style.display = "none";
      };
    }
    if (wbModal) {
      wbModal.onclick = (e) => {
        if (e.target.id === "wordbank-modal") {
          wbModal.style.display = "none";
        }
      };
    }

    // Progress Modalı
    const openProgressBtn = document.getElementById("btn-open-progress");
    const closeProgressBtn = document.getElementById("progress-modal-close");
    const progressModal = document.getElementById("progress-modal");
    const resetProgressBtn = document.getElementById("btn-reset-progress");
    const printProgressBtn = document.getElementById("btn-print-progress");

    if (openProgressBtn) {
      openProgressBtn.onclick = () => this.openProgressModal();
    }

    if (closeProgressBtn && progressModal) {
      closeProgressBtn.onclick = () => {
        progressModal.style.display = "none";
      };
    }

    if (progressModal) {
      progressModal.onclick = (e) => {
        if (e.target.id === "progress-modal") {
          progressModal.style.display = "none";
        }
      };
    }

    if (resetProgressBtn) {
      resetProgressBtn.onclick = () => {
        if (confirm("Reset all quiz completions and writing drafts across all grades?")) {
          AppState.resetAllProgress();
          this.openProgressModal();
          this.loadState();
        }
      };
    }

    if (printProgressBtn) {
      printProgressBtn.onclick = () => window.print();
    }

    // Klavye Kısayolları
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        SpeechEngine.stop();
        if (vocabModal) vocabModal.style.display = "none";
        if (progressModal) progressModal.style.display = "none";
        if (wbModal) wbModal.style.display = "none";
        return;
      }

      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const units = AppState.getCurrentGradeUnits();
      if (e.key === "ArrowRight" && AppState.activeUnitIndex < units.length - 1) {
        AppState.activeUnitIndex++;
        this.loadState();
      } else if (e.key === "ArrowLeft" && AppState.activeUnitIndex > 0) {
        AppState.activeUnitIndex--;
        this.loadState();
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
