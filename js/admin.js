/**
 * English Skills Hub - Dedicated Admin Studio (CRUD Engine)
 * Supports: Create, Read, Update, Delete (CRUD), Reordering, Duplication, Live Preview, Multi-Question Authoring, Import, Reset, and JSON Export.
 */
const THEME_PRESETS = {
  terracotta: { primary: "#9a3412", tint: "#ffedd5", border: "#fed7aa" },
  forest:     { primary: "#166534", tint: "#dcfce7", border: "#bbf7d0" },
  indigo:     { primary: "#312e81", tint: "#e0e7ff", border: "#c7d2fe" },
  plum:       { primary: "#831843", tint: "#fce7f3", border: "#fbcfe8" },
  ochre:      { primary: "#854d0e", tint: "#fef9c3", border: "#fde047" },
  teal:       { primary: "#115e59", tint: "#ccfbf1", border: "#99f6e4" }
};

const GRADE_DEFAULT_PRESET = {
  1: "terracotta",
  2: "forest",
  3: "indigo",
  4: "plum",
  5: "ochre",
  6: "teal"
};

const AdminStudio = {
  selectedGrade: 1,
  editingUnitId: null,

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.resetFormToNew();
  },

  loadFromStorage() {
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
        console.error("Local curriculum parse error:", e);
      }
    }
  },

  saveToStorage() {
    localStorage.setItem("esh_custom_curriculum_v3", JSON.stringify(CURRICULUM_DATA));
  },

  detectPresetKey(themeObj, grade) {
    if (themeObj && themeObj.primary) {
      const found = Object.entries(THEME_PRESETS).find(
        ([, val]) => val.primary.toLowerCase() === themeObj.primary.toLowerCase()
      );
      if (found) return found[0];
    }
    return GRADE_DEFAULT_PRESET[grade] || "terracotta";
  },

  renderUnitList() {
    const container = document.getElementById("admin-unit-list");
    if (!container) return;
    container.innerHTML = "";

    const units = CURRICULUM_DATA[this.selectedGrade] || [];

    if (units.length === 0) {
      container.innerHTML = `<li style="padding: 1rem 0; font-size: 0.85rem; color: var(--ink-400);">No units in Grade ${this.selectedGrade}.</li>`;
      return;
    }

    units.forEach((unit, idx) => {
      const li = document.createElement("li");
      li.className = "unit-index-item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `unit-link ${this.editingUnitId === unit.id ? "active" : ""}`;
      btn.innerHTML = `
        <span><span class="unit-number">${String(idx + 1).padStart(2, "0")}</span> ${unit.title}</span>
      `;
      btn.onclick = () => this.loadUnitToForm(unit, this.selectedGrade, true);

      const reorderGroup = document.createElement("div");
      reorderGroup.className = "unit-reorder-group";

      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.className = "unit-reorder-btn";
      upBtn.textContent = "↑";
      upBtn.title = "Move Up";
      upBtn.disabled = idx === 0;
      upBtn.onclick = (e) => {
        e.stopPropagation();
        this.moveUnit(idx, -1);
      };

      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.className = "unit-reorder-btn";
      downBtn.textContent = "↓";
      downBtn.title = "Move Down";
      downBtn.disabled = idx === units.length - 1;
      downBtn.onclick = (e) => {
        e.stopPropagation();
        this.moveUnit(idx, 1);
      };

      reorderGroup.appendChild(upBtn);
      reorderGroup.appendChild(downBtn);

      li.appendChild(btn);
      li.appendChild(reorderGroup);
      container.appendChild(li);
    });
  },

  moveUnit(index, direction) {
    const units = CURRICULUM_DATA[this.selectedGrade];
    if (!units) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= units.length) return;

    const temp = units[index];
    units[index] = units[targetIndex];
    units[targetIndex] = temp;

    this.saveToStorage();
    this.renderUnitList();
  },

  renderQuestionFields(exercises = []) {
    const container = document.getElementById("admin-questions-container");
    if (!container) return;
    container.innerHTML = "";

    const list = exercises.length > 0 ? exercises : [{ question: "", correct: "", options: ["", ""], tip: "" }];

    list.forEach((q, idx) => {
      this.appendQuestionCard(q, idx);
    });
  },

  appendQuestionCard(q = { question: "", correct: "", options: ["", ""], tip: "" }, index = null) {
    const container = document.getElementById("admin-questions-container");
    if (!container) return;

    const cardIndex = index !== null ? index : container.children.length;
    const card = document.createElement("div");
    card.className = "exercise-entry admin-question-card";
    card.style.marginBottom = "0";
    card.style.background = "var(--bg-subtle)";

    const wrong1 = q.options && q.options[0] ? q.options[0] : "";
    const wrong2 = q.options && q.options[1] ? q.options[1] : "";

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span class="section-label" style="margin-bottom: 0;">Question #${cardIndex + 1}</span>
        <button type="button" class="btn-remove-question" style="background: none; border: none; color: #dc2626; font-family: var(--font-mono); font-size: 0.72rem; cursor: pointer; padding: 0.2rem 0.4rem;">✕ Remove</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <input type="text" class="adm-q-text" required placeholder="Question text..." value="${this.escapeAttr(q.question || "")}" style="width: 100%; padding: 0.55rem; border: 1px solid var(--ink-border); border-radius: 4px; background: var(--bg-surface); color: var(--ink-900);">
        <div class="admin-question-options-grid">
          <input type="text" class="adm-q-correct" required placeholder="✓ Correct Answer..." value="${this.escapeAttr(q.correct || "")}" style="width: 100%; padding: 0.55rem; border: 1px solid #86efac; border-radius: 4px; background: var(--bg-surface); color: var(--ink-900);">
          <input type="text" class="adm-q-wrong1" required placeholder="✗ Wrong Option 1..." value="${this.escapeAttr(wrong1)}" style="width: 100%; padding: 0.55rem; border: 1px solid var(--ink-border); border-radius: 4px; background: var(--bg-surface); color: var(--ink-900);">
          <input type="text" class="adm-q-wrong2" placeholder="✗ Wrong Option 2 (Optional)..." value="${this.escapeAttr(wrong2)}" style="width: 100%; padding: 0.55rem; border: 1px solid var(--ink-border); border-radius: 4px; background: var(--bg-surface); color: var(--ink-900);">
        </div>
        <input type="text" class="adm-q-tip" required placeholder="💡 Pedagogical Clue / Note..." value="${this.escapeAttr(q.tip || "")}" style="width: 100%; padding: 0.55rem; border: 1px solid var(--ink-border); border-radius: 4px; background: var(--bg-surface); color: var(--ink-900);">
      </div>
    `;

    card.querySelector(".btn-remove-question").onclick = () => {
      if (container.children.length <= 1) {
        alert("Each unit must have at least one comprehension question.");
        return;
      }
      card.remove();
      Array.from(container.children).forEach((child, i) => {
        const lbl = child.querySelector(".section-label");
        if (lbl) lbl.textContent = `Question #${i + 1}`;
      });
    };

    container.appendChild(card);
  },

  escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  },

  loadUnitToForm(unit, grade, scrollOnMobile = false) {
    this.editingUnitId = unit.id;

    document.getElementById("form-mode-title").textContent = "Edit Unit";
    document.getElementById("form-mode-sub").textContent = `EDITING: ${unit.id.toUpperCase()} · GRADE ${grade}`;
    document.getElementById("btn-submit-form").textContent = "💾 Save Changes";
    document.getElementById("btn-delete-unit").style.display = "inline-flex";
    document.getElementById("btn-duplicate-unit").style.display = "inline-flex";

    document.getElementById("edit-unit-id").value = unit.id;
    document.getElementById("edit-unit-grade").value = grade;

    document.getElementById("adm-grade").value = grade;
    document.getElementById("adm-grade").disabled = true;
    document.getElementById("adm-theme-preset").value = this.detectPresetKey(unit.theme, grade);
    document.getElementById("adm-title").value = unit.title || "";
    document.getElementById("adm-type").value = unit.type || "";
    document.getElementById("adm-skill").value = unit.skill || "";
    document.getElementById("adm-writing").value = unit.writingGoal || "";

    if (unit.lines && unit.lines.length) {
      document.getElementById("adm-passage").value = unit.lines.map(l => `${l.speaker} | ${l.text}`).join("\n");
    } else {
      document.getElementById("adm-passage").value = "";
    }

    if (unit.vocab && unit.vocab.length) {
      document.getElementById("adm-vocab").value = unit.vocab.map(v => `${v.word} | ${v.part} | ${v.def}`).join("\n");
    } else {
      document.getElementById("adm-vocab").value = "";
    }

    this.renderQuestionFields(unit.exercises || []);
    this.renderUnitList();

    if (scrollOnMobile && window.innerWidth <= 960) {
      const editorCol = document.getElementById("admin-editor-column");
      if (editorCol) editorCol.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  resetFormToNew() {
    this.editingUnitId = null;

    document.getElementById("form-mode-title").textContent = "Create New Unit";
    document.getElementById("form-mode-sub").textContent = `NEW RECORD · GRADE ${this.selectedGrade}`;
    document.getElementById("btn-submit-form").textContent = "+ Publish Unit";
    document.getElementById("btn-delete-unit").style.display = "none";
    document.getElementById("btn-duplicate-unit").style.display = "none";

    document.getElementById("edit-unit-id").value = "";
    document.getElementById("edit-unit-grade").value = "";

    const gradeSelect = document.getElementById("adm-grade");
    gradeSelect.disabled = false;
    gradeSelect.value = this.selectedGrade;

    document.getElementById("admin-unit-form").reset();
    gradeSelect.value = this.selectedGrade;
    document.getElementById("adm-theme-preset").value = GRADE_DEFAULT_PRESET[this.selectedGrade] || "terracotta";

    this.renderQuestionFields([]);
    this.renderUnitList();
  },

  parsePassage(raw) {
    return raw.trim().split("\n").map(row => {
      const parts = row.split("|");
      return {
        speaker: parts[0] ? parts[0].trim() : "Narrator",
        text: parts[1] ? parts[1].trim() : ""
      };
    }).filter(l => l.text !== "");
  },

  parseVocab(raw) {
    return raw.trim().split("\n").map(row => {
      const parts = row.split("|");
      return {
        word: parts[0] ? parts[0].trim() : "",
        part: parts[1] ? parts[1].trim() : "noun",
        def: parts[2] ? parts[2].trim() : ""
      };
    }).filter(v => v.word !== "");
  },

  parseExercises() {
    const cards = document.querySelectorAll(".admin-question-card");
    const exercises = [];
    cards.forEach(card => {
      const question = card.querySelector(".adm-q-text")?.value.trim() || "";
      const correct = card.querySelector(".adm-q-correct")?.value.trim() || "";
      const wrong1 = card.querySelector(".adm-q-wrong1")?.value.trim() || "";
      const wrong2 = card.querySelector(".adm-q-wrong2")?.value.trim() || "";
      const tip = card.querySelector(".adm-q-tip")?.value.trim() || "";

      const options = [wrong1, wrong2].filter(Boolean);
      if (question && correct && options.length > 0) {
        exercises.push({ question, correct, options, tip });
      }
    });
    return exercises;
  },

  generateNextUnitId(grade) {
    const existing = CURRICULUM_DATA[grade] || [];
    let maxNum = existing.length;
    existing.forEach(u => {
      const match = String(u.id).match(/-u(\d+)$/);
      if (match) {
        maxNum = Math.max(maxNum, Number(match[1]));
      }
    });
    return `g${grade}-u${maxNum + 1}`;
  },

  openPreviewModal() {
    const title = document.getElementById("adm-title").value.trim() || "Untitled Unit";
    const grade = document.getElementById("adm-grade").value;
    const type = document.getElementById("adm-type").value.trim() || "Lesson";
    const skill = document.getElementById("adm-skill").value.trim() || "-";
    const writingGoal = document.getElementById("adm-writing").value.trim() || "-";
    const lines = this.parsePassage(document.getElementById("adm-passage").value);
    const vocab = this.parseVocab(document.getElementById("adm-vocab").value);
    const exercises = this.parseExercises();

    const modal = document.getElementById("admin-preview-modal");
    const titleEl = document.getElementById("preview-modal-title");
    const metaEl = document.getElementById("preview-modal-meta");
    const bodyEl = document.getElementById("preview-modal-body");
    if (!modal || !bodyEl) return;

    titleEl.textContent = title;
    metaEl.textContent = `GRADE ${grade} · ${type.toUpperCase()} · SKILL: ${skill.toUpperCase()} · WRITING: ${writingGoal.toUpperCase()}`;

    const dialogueHtml = lines.map(l => {
      let text = l.text;
      vocab.forEach(v => {
        const escaped = v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const reg = new RegExp(`\\b(${escaped})\\b`, "gi");
        text = text.replace(reg, `<span class="vocab-anchor">$1</span>`);
      });
      return `
        <div class="dialogue-turn" style="grid-template-columns: 100px 1fr;">
          <span class="speaker-label">${l.speaker}</span>
          <div class="speech-body" style="font-size: 1rem;">${text}</div>
        </div>
      `;
    }).join("") || `<p style="color: var(--ink-400); font-size: 0.9rem;">No passage lines entered yet.</p>`;

    const vocabHtml = vocab.map(v => `
      <span class="vocab-check-chip is-used" title="${this.escapeAttr(v.def)}">${v.word} (${v.part})</span>
    `).join("") || `<span style="color: var(--ink-400); font-size: 0.85rem;">No vocabulary entered.</span>`;

    const questionsHtml = exercises.map((ex, i) => `
      <div style="margin-top: 0.5rem; font-size: 0.9rem;">
        <strong>Q${i + 1}:</strong> ${ex.question} <span style="color: #059669; font-family: var(--font-mono); font-size: 0.78rem;">[✓ ${ex.correct}]</span>
      </div>
    `).join("") || `<p style="color: var(--ink-400); font-size: 0.85rem;">No valid questions entered.</p>`;

    bodyEl.innerHTML = `
      <div style="border: 1px solid var(--ink-border); border-radius: 4px; padding: 1.25rem; background: var(--bg-canvas); margin-bottom: 1rem;">
        <span class="section-label">Passage Preview</span>
        <div class="passage-dialogue">${dialogueHtml}</div>
      </div>
      <div style="margin-bottom: 1rem;">
        <span class="section-label">Target Vocabulary (${vocab.length})</span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">${vocabHtml}</div>
      </div>
      <div>
        <span class="section-label">Comprehension Questions (${exercises.length})</span>
        ${questionsHtml}
      </div>
    `;

    modal.style.display = "flex";
  },

  bindEvents() {
    const form = document.getElementById("admin-unit-form");
    const gradeFilter = document.getElementById("admin-grade-filter");
    const admGradeSelect = document.getElementById("adm-grade");
    const newUnitBtn = document.getElementById("btn-new-unit");
    const deleteBtn = document.getElementById("btn-delete-unit");
    const duplicateBtn = document.getElementById("btn-duplicate-unit");
    const previewBtn = document.getElementById("btn-preview-unit");
    const previewModal = document.getElementById("admin-preview-modal");
    const previewClose = document.getElementById("preview-modal-close");
    const exportBtn = document.getElementById("btn-export-data");
    const importBtn = document.getElementById("btn-import-data");
    const importInput = document.getElementById("input-import-file");
    const resetBtn = document.getElementById("btn-reset-data");
    const addQuestionBtn = document.getElementById("btn-add-question");

    if (gradeFilter) {
      gradeFilter.onchange = (e) => {
        this.selectedGrade = Number(e.target.value);
        this.resetFormToNew();
      };
    }

    if (admGradeSelect) {
      admGradeSelect.onchange = (e) => {
        const g = Number(e.target.value);
        const presetSelect = document.getElementById("adm-theme-preset");
        if (presetSelect && GRADE_DEFAULT_PRESET[g]) {
          presetSelect.value = GRADE_DEFAULT_PRESET[g];
        }
      };
    }

    if (addQuestionBtn) {
      addQuestionBtn.onclick = () => this.appendQuestionCard();
    }

    if (newUnitBtn) {
      newUnitBtn.onclick = () => this.resetFormToNew();
    }

    if (previewBtn) {
      previewBtn.onclick = () => this.openPreviewModal();
    }
    if (previewClose && previewModal) {
      previewClose.onclick = () => {
        previewModal.style.display = "none";
      };
    }
    if (previewModal) {
      previewModal.onclick = (e) => {
        if (e.target.id === "admin-preview-modal") {
          previewModal.style.display = "none";
        }
      };
    }

    if (duplicateBtn) {
      duplicateBtn.onclick = () => {
        if (!this.editingUnitId) return;
        const grade = this.selectedGrade;
        const source = (CURRICULUM_DATA[grade] || []).find(u => u.id === this.editingUnitId);
        if (!source) return;

        const cloned = JSON.parse(JSON.stringify(source));
        cloned.id = this.generateNextUnitId(grade);
        cloned.title = `${source.title} (Copy)`;

        CURRICULUM_DATA[grade].push(cloned);
        this.saveToStorage();
        this.loadUnitToForm(cloned, grade, true);
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm("Reset local browser changes and restore the default curriculum from data.js?")) {
          localStorage.removeItem("esh_custom_curriculum_v3");
          window.location.reload();
        }
      };
    }

    if (importBtn && importInput) {
      importBtn.onclick = () => importInput.click();
      importInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            let raw = String(evt.target.result || "").trim();
            raw = raw.replace(/^const\s+CURRICULUM_DATA\s*=\s*/, "").replace(/;\s*$/, "");
            const parsed = JSON.parse(raw);

            Object.keys(parsed).forEach(grade => {
              if (Array.isArray(parsed[grade])) {
                CURRICULUM_DATA[grade] = parsed[grade];
              }
            });

            this.saveToStorage();
            this.resetFormToNew();
            alert("Curriculum data imported successfully!");
          } catch (err) {
            alert("Failed to parse imported file. Please select a valid data.js or .json file.");
          }
          importInput.value = "";
        };
        reader.readAsText(file);
      };
    }

    if (deleteBtn) {
      deleteBtn.onclick = () => {
        if (!this.editingUnitId) return;
        const confirmDelete = confirm("Are you sure you want to delete this unit?");
        if (!confirmDelete) return;

        const grade = this.selectedGrade;
        CURRICULUM_DATA[grade] = (CURRICULUM_DATA[grade] || []).filter(u => u.id !== this.editingUnitId);
        this.saveToStorage();
        this.resetFormToNew();
        alert("Unit removed successfully.");
      };
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const grade = Number(document.getElementById("adm-grade").value);
        const presetKey = document.getElementById("adm-theme-preset").value;
        const theme = THEME_PRESETS[presetKey] || THEME_PRESETS.terracotta;
        const title = document.getElementById("adm-title").value.trim();
        const type = document.getElementById("adm-type").value.trim();
        const skill = document.getElementById("adm-skill").value.trim();
        const writingGoal = document.getElementById("adm-writing").value.trim();

        const lines = this.parsePassage(document.getElementById("adm-passage").value);
        const vocab = this.parseVocab(document.getElementById("adm-vocab").value);
        const exercises = this.parseExercises();

        if (this.editingUnitId) {
          const unitIndex = CURRICULUM_DATA[grade].findIndex(u => u.id === this.editingUnitId);
          if (unitIndex !== -1) {
            CURRICULUM_DATA[grade][unitIndex] = {
              ...CURRICULUM_DATA[grade][unitIndex],
              title,
              type,
              skill,
              writingGoal,
              theme,
              lines,
              vocab,
              exercises
            };
            alert(`Unit "${title}" updated successfully!`);
          }
        } else {
          const newUnit = {
            id: this.generateNextUnitId(grade),
            title,
            type,
            skill,
            writingGoal,
            theme,
            lines,
            vocab,
            exercises
          };

          if (!CURRICULUM_DATA[grade]) CURRICULUM_DATA[grade] = [];
          CURRICULUM_DATA[grade].push(newUnit);
          alert(`Unit "${title}" created and published to Grade ${grade}!`);
        }

        this.saveToStorage();
        this.resetFormToNew();
      };
    }

    if (exportBtn) {
      exportBtn.onclick = () => {
        const fileContent = "const CURRICULUM_DATA = " + JSON.stringify(CURRICULUM_DATA, null, 2) + ";\n";
        const blob = new Blob([fileContent], { type: "text/javascript" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "data.js";
        a.click();
      };
    }
  }
};

document.addEventListener("DOMContentLoaded", () => AdminStudio.init());
