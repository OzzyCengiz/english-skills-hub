/**
 * English Skills Hub - Dedicated Admin Studio (CRUD Engine)
 * Supports: Create, Read, Update, Delete (CRUD) and JSON Export.
 */
const AdminStudio = {
  selectedGrade: 1,
  editingUnitId: null,

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.renderUnitList();
  },

  // 1. Tarayıcı hafızasını senkronize et
  loadFromStorage() {
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
        console.error("Local curriculum parse error:", e);
      }
    }
  },

  saveToStorage() {
    localStorage.setItem("esh_custom_curriculum", JSON.stringify(CURRICULUM_DATA));
  },

  // 2. Sol Taraftaki Ünite Listesini Çiz
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
      btn.className = `unit-link ${this.editingUnitId === unit.id ? "active" : ""}`;
      btn.innerHTML = `<span class="unit-number">0${idx + 1}</span> ${unit.title}`;
      btn.onclick = () => this.loadUnitToForm(unit, this.selectedGrade);

      li.appendChild(btn);
      container.appendChild(li);
    });
  },

  // 3. Tıklanan Üniteyi Form Alanlarına Doldur (Edit Modu)
  loadUnitToForm(unit, grade) {
    this.editingUnitId = unit.id;

    // Başlık ve Mod Göstergeleri
    document.getElementById("form-mode-title").textContent = "Edit Unit";
    document.getElementById("form-mode-sub").textContent = `EDITING: ${unit.id.toUpperCase()} · GRADE ${grade}`;
    document.getElementById("btn-submit-form").textContent = "💾 Save Changes";
    document.getElementById("btn-delete-unit").style.display = "inline-block";

    // Gizli inputlar
    document.getElementById("edit-unit-id").value = unit.id;
    document.getElementById("edit-unit-grade").value = grade;

    // Temel Alanlar
    document.getElementById("adm-grade").value = grade;
    document.getElementById("adm-grade").disabled = true; // Edit yaparken grade değiştirmeyi kitle (ID karmaşasını önler)
    document.getElementById("adm-title").value = unit.title || "";
    document.getElementById("adm-type").value = unit.type || "";
    document.getElementById("adm-skill").value = unit.skill || "";
    document.getElementById("adm-writing").value = unit.writingGoal || "";

    // Diyalog Satırlarını Textarea Formatına Çevir (Speaker | Text)
    if (unit.lines && unit.lines.length) {
      document.getElementById("adm-passage").value = unit.lines.map(l => `${l.speaker} | ${l.text}`).join("\n");
    } else {
      document.getElementById("adm-passage").value = "";
    }

    // Kelimeleri Textarea Formatına Çevir (Word | POS | Def)
    if (unit.vocab && unit.vocab.length) {
      document.getElementById("adm-vocab").value = unit.vocab.map(v => `${v.word} | ${v.part} | ${v.def}`).join("\n");
    } else {
      document.getElementById("adm-vocab").value = "";
    }

    // Alıştırma Sorusu
    if (unit.exercises && unit.exercises.length) {
      const q = unit.exercises[0];
      document.getElementById("adm-q-text").value = q.question || "";
      document.getElementById("adm-q-correct").value = q.correct || "";
      document.getElementById("adm-q-wrong1").value = q.options ? q.options[0] : "";
      document.getElementById("adm-q-tip").value = q.tip || "";
    }

    this.renderUnitList();
  },

  // 4. Formu Sıfırla (Yeni Ünite Moduna Dön)
  resetFormToNew() {
    this.editingUnitId = null;

    document.getElementById("form-mode-title").textContent = "Create New Unit";
    document.getElementById("form-mode-sub").textContent = `NEW RECORD · GRADE ${this.selectedGrade}`;
    document.getElementById("btn-submit-form").textContent = "+ Publish Unit";
    document.getElementById("btn-delete-unit").style.display = "none";

    document.getElementById("edit-unit-id").value = "";
    document.getElementById("edit-unit-grade").value = "";

    const gradeSelect = document.getElementById("adm-grade");
    gradeSelect.disabled = false;
    gradeSelect.value = this.selectedGrade;

    document.getElementById("admin-unit-form").reset();
    gradeSelect.value = this.selectedGrade;

    this.renderUnitList();
  },

  // 5. Textarea'lardan Nesneleri Parse Et
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

  bindEvents() {
    const form = document.getElementById("admin-unit-form");
    const gradeFilter = document.getElementById("admin-grade-filter");
    const newUnitBtn = document.getElementById("btn-new-unit");
    const deleteBtn = document.getElementById("btn-delete-unit");
    const exportBtn = document.getElementById("btn-export-data");

    // Grade Değişimi
    if (gradeFilter) {
      gradeFilter.onchange = (e) => {
        this.selectedGrade = Number(e.target.value);
        this.resetFormToNew();
      };
    }

    // New Unit Butonu
    if (newUnitBtn) {
      newUnitBtn.onclick = () => this.resetFormToNew();
    }

    // Delete Butonu
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

    // Form Gönderme (Create OR Update)
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const grade = Number(document.getElementById("adm-grade").value);
        const title = document.getElementById("adm-title").value.trim();
        const type = document.getElementById("adm-type").value.trim();
        const skill = document.getElementById("adm-skill").value.trim();
        const writingGoal = document.getElementById("adm-writing").value.trim();

        const lines = this.parsePassage(document.getElementById("adm-passage").value);
        const vocab = this.parseVocab(document.getElementById("adm-vocab").value);
        const exercise = {
          question: document.getElementById("adm-q-text").value.trim(),
          correct: document.getElementById("adm-q-correct").value.trim(),
          options: [document.getElementById("adm-q-wrong1").value.trim()],
          tip: document.getElementById("adm-q-tip").value.trim()
        };

        if (this.editingUnitId) {
          // --- UPDATE (Mevcut Üniteyi Güncelle) ---
          const unitIndex = CURRICULUM_DATA[grade].findIndex(u => u.id === this.editingUnitId);
          if (unitIndex !== -1) {
            CURRICULUM_DATA[grade][unitIndex] = {
              ...CURRICULUM_DATA[grade][unitIndex],
              title,
              type,
              skill,
              writingGoal,
              lines,
              vocab,
              exercises: [exercise]
            };
            alert(`Unit "${title}" updated successfully!`);
          }
        } else {
          // --- CREATE (Yeni Ünite Ekle) ---
          const newUnit = {
            id: `g${grade}-u${(CURRICULUM_DATA[grade]?.length || 0) + 1}`,
            title,
            type,
            skill,
            writingGoal,
            theme: CURRICULUM_DATA[grade]?.[0]?.theme || { primary: "#111827", tint: "#f3f4f6", border: "#e5e7eb" },
            lines,
            vocab,
            exercises: [exercise]
          };

          if (!CURRICULUM_DATA[grade]) CURRICULUM_DATA[grade] = [];
          CURRICULUM_DATA[grade].push(newUnit);
          alert(`Unit "${title}" created and published to Grade ${grade}!`);
        }

        this.saveToStorage();
        this.resetFormToNew();
      };
    }

    // Export data.js
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