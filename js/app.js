/**
 * English Skills Hub - Application Controller
 * Handles UI rendering, theme injection, accessibility tools, and local curriculum sync.
 */
const App = {
  init() {
    this.syncCustomCurriculum();
    this.renderGradePills();
    this.bindGlobalEvents();
    this.loadState();
  },

  // admin.html üzerinden eklenen yeni üniteleri localStorage'dan veri modeline aktar
  syncCustomCurriculum() {
    const saved = localStorage.getItem("esh_custom_curriculum");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(grade => {
          if (CURRICULUM_DATA[grade]) {
            CURRICULUM_DATA[grade] = parsed[grade];
          }
        });
      } catch (e) {
        console.error("Local curriculum sync error:", e);
      }
    }
  },

  loadState() {
    this.applyTheme();
    this.renderSidebarUnits();
    this.renderWorkspace();
  },

  // data.js içerisindeki üniteye özel paleti CSS değişkenlerine enjekte et
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
        if (AppState.activeGrade === grade) return;
        AppState.activeGrade = grade;
        AppState.activeUnitIndex = 0;
        
        document.querySelectorAll(".grade-nav-item").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");

        this.loadState();
      };
      container.appendChild(btn);
    });
  },

  renderSidebarUnits() {
    const units = AppState.getCurrentGradeUnits();
    const container = document.getElementById("unit-nav-list");
    if (!container) return;
    container.innerHTML = "";

    units.forEach((unit, idx) => {
      const li = document.createElement("li");
      li.className = "unit-index-item";

      const btn = document.createElement("button");
      btn.className = `unit-link ${idx === AppState.activeUnitIndex ? "active" : ""}`;
      btn.innerHTML = `<span class="unit-number">0${idx + 1}</span> ${unit.title}`;
      btn.onclick = () => {
        AppState.activeUnitIndex = idx;
        document.querySelectorAll(".unit-link").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.loadState();
      };

      li.appendChild(btn);
      container.appendChild(li);
    });

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

    // Başlık ve meta bilgileri
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
        break;
      case "practice":
        container.innerHTML = this.views.practice(unit);
        this.bindPracticeEvents();
        break;
      case "write":
        container.innerHTML = this.views.write(unit);
        break;
    }
  },

  views: {
    passage(unit) {
      const dialogueLines = unit.lines.map(l => {
        let text = l.text;
        unit.vocab.forEach(v => {
          const reg = new RegExp(`\\b(${v.word})\\b`, "gi");
          text = text.replace(reg, `<span class="vocab-anchor" data-word="${v.word}">$1</span>`);
        });

        return `
          <div class="dialogue-turn">
            <span class="speaker-label">${l.speaker}</span>
            <div class="speech-body">${text}</div>
          </div>
        `;
      }).join("");

      return `
        <div class="reading-canvas">
          <div class="reading-toolbar">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-400);">READING TEXT</span>
            <button id="btn-read-passage" class="btn-pill" style="border-color: var(--accent-color); color: var(--accent-color);">🔊 Read Passage</button>
          </div>
          <div class="passage-dialogue">
            ${dialogueLines}
          </div>
        </div>
      `;
    },

    vocab(unit) {
      const cards = unit.vocab.map(v => `
        <div class="exercise-entry">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="font-size: 1.2rem; font-family: var(--font-serif);">${v.word}</h4>
            <button class="btn-pill" onclick="SpeechEngine.speak('${v.word}')">🔊 Listen</button>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--accent-color); font-weight: 600;">${v.part}</span>
          <p style="margin-top: 0.5rem; color: var(--ink-700);">${v.def}</p>
        </div>
      `).join("");
      return `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">${cards}</div>`;
    },

    practice(unit) {
      return unit.exercises.map((ex, i) => {
        const opts = [ex.correct, ...ex.options].sort(() => Math.random() - 0.5);
        const optButtons = opts.map(o => `
          <button class="choice-btn" data-correct="${o === ex.correct}">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; margin-right: 0.75rem; color: var(--ink-400);">•</span>
            ${o}
          </button>
        `).join("");

        return `
          <div class="exercise-entry">
            <p class="exercise-question"><strong>${i + 1}.</strong> ${ex.question}</p>
            <div class="choice-list">${optButtons}</div>
            <div class="tip-box" style="display: none; margin-top: 1rem; padding: 0.75rem; background: var(--accent-tint); border-left: 3px solid var(--accent-color); font-size: 0.85rem;">
              💡 <strong>Note:</strong> ${ex.tip}
            </div>
          </div>
        `;
      }).join("");
    },

    write(unit) {
      return `
        <div class="exercise-entry">
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">Target: ${unit.writingGoal}</h3>
          <p style="color: var(--ink-700); font-size: 0.95rem;">Compose your thoughts applying today's skill focus.</p>
          <textarea style="width: 100%; height: 200px; margin-top: 1.5rem; padding: 1rem; border: 1px solid var(--ink-border); border-radius: 4px; font-family: var(--font-sans); font-size: 1rem; background: var(--bg-canvas);" placeholder="Draft your response here..."></textarea>
        </div>
      `;
    }
  },

  bindPassageEvents(unit) {
    document.querySelectorAll(".vocab-anchor").forEach(tag => {
      tag.onclick = () => {
        const wordData = unit.vocab.find(v => v.word.toLowerCase() === tag.dataset.word.toLowerCase());
        if (!wordData) return;

        document.getElementById("modal-term").textContent = wordData.word;
        document.getElementById("modal-pos").textContent = wordData.part;
        document.getElementById("modal-definition").textContent = wordData.def;
        document.getElementById("modal-speak-btn").onclick = () => SpeechEngine.speak(wordData.word);
        document.getElementById("vocab-modal").style.display = "flex";
      };
    });

    const readBtn = document.getElementById("btn-read-passage");
    if (readBtn) {
      readBtn.onclick = () => {
        const fullText = unit.lines.map(l => l.text).join(" ");
        SpeechEngine.speak(fullText);
      };
    }
  },

  bindPracticeEvents() {
    document.querySelectorAll(".exercise-entry").forEach(box => {
      const buttons = box.querySelectorAll(".choice-btn");
      const tip = box.querySelector(".tip-box");

      buttons.forEach(btn => {
        btn.onclick = () => {
          buttons.forEach(b => b.disabled = true);
          const isCorrect = btn.dataset.correct === "true";
          btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
          if (!isCorrect) {
            const correctBtn = box.querySelector('[data-correct="true"]');
            if (correctBtn) correctBtn.classList.add("is-correct");
          }
          if (tip) tip.style.display = "block";
        };
      });
    });
  },

  bindGlobalEvents() {
    // Sekmeler
    document.querySelectorAll(".tab-link").forEach(tab => {
      tab.onclick = (e) => {
        document.querySelectorAll(".tab-link").forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
        AppState.activeTab = e.target.dataset.tab;
        this.renderWorkspace();
      };
    });

    // Font Boyutu
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

    // Easy-Read Font (Lexend)
    const easyBtn = document.getElementById("toggle-dyslexic");
    if (easyBtn) {
      easyBtn.onclick = () => {
        AppState.isDyslexicFont = !AppState.isDyslexicFont;
        document.body.classList.toggle("easy-read-mode", AppState.isDyslexicFont);
        easyBtn.classList.toggle("active", AppState.isDyslexicFont);
      };
    }

    // Focus Mask
    const focusBtn = document.getElementById("toggle-focus");
    const mask = document.getElementById("focus-mask");
    const win = document.getElementById("focus-window");

    if (focusBtn && mask) {
      focusBtn.onclick = () => {
        AppState.isFocusActive = !AppState.isFocusActive;
        mask.style.display = AppState.isFocusActive ? "block" : "none";
        focusBtn.classList.toggle("active", AppState.isFocusActive);
      };
    }

    window.addEventListener("mousemove", (e) => {
      if (AppState.isFocusActive && win) {
        win.style.top = `${e.clientY - 50}px`;
      }
    });

    // Kelime Modalını Kapatma
    const modalClose = document.getElementById("modal-close");
    const vocabModal = document.getElementById("vocab-modal");

    if (modalClose && vocabModal) {
      modalClose.onclick = () => {
        vocabModal.style.display = "none";
      };
    }

    if (vocabModal) {
      vocabModal.onclick = (e) => {
        if (e.target.id === "vocab-modal") {
          vocabModal.style.display = "none";
        }
      };
    }
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());