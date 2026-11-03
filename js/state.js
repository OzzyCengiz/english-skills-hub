/**
 * Merkezi Durum (State) Yönetimi
 */
const AppState = {
  activeGrade: 1,
  activeUnitIndex: 0,
  activeTab: "passage",
  fontSize: 16,
  isDyslexicFont: false,
  vocabMode: "list", // "list" | "flashcard" | "spelling"
  roleplaySpeaker: "",
  surfaceMode: localStorage.getItem("esh_surface_mode") || "paper",

  getCurrentGradeUnits() {
    return CURRICULUM_DATA[this.activeGrade] || [];
  },

  getCurrentUnit() {
    const units = this.getCurrentGradeUnits();
    return units[this.activeUnitIndex] || null;
  },

  setSurfaceMode(mode) {
    this.surfaceMode = mode;
    localStorage.setItem("esh_surface_mode", mode);
  },

  // Kişisel Kelime Defteri (Personal Word Bank / Bookmarks)
  getSavedWords() {
    try {
      return JSON.parse(localStorage.getItem("esh_saved_words") || "[]");
    } catch {
      return [];
    }
  },

  isWordSaved(word) {
    if (!word) return false;
    const list = this.getSavedWords();
    return list.some(item => item.word.toLowerCase() === word.toLowerCase());
  },

  toggleSavedWord(wordObj, grade, unitTitle) {
    if (!wordObj || !wordObj.word) return false;
    const list = this.getSavedWords();
    const idx = list.findIndex(item => item.word.toLowerCase() === wordObj.word.toLowerCase());

    if (idx !== -1) {
      list.splice(idx, 1);
      localStorage.setItem("esh_saved_words", JSON.stringify(list));
      return false;
    } else {
      list.push({
        word: wordObj.word,
        part: wordObj.part,
        def: wordObj.def,
        grade: grade || this.activeGrade,
        unitTitle: unitTitle || ""
      });
      localStorage.setItem("esh_saved_words", JSON.stringify(list));
      return true;
    }
  },

  removeSavedWord(word) {
    const list = this.getSavedWords().filter(item => item.word.toLowerCase() !== String(word).toLowerCase());
    localStorage.setItem("esh_saved_words", JSON.stringify(list));
  },

  // Öğrenci İlerleme Durumu (Practice & Writing Takibi)
  getProgressMap() {
    try {
      return JSON.parse(localStorage.getItem("esh_student_progress") || "{}");
    } catch {
      return {};
    }
  },

  getUnitProgress(unitId) {
    const map = this.getProgressMap();
    return map[unitId] || { quizDone: false, writingDone: false };
  },

  updateUnitProgress(unitId, partial) {
    if (!unitId) return;
    const map = this.getProgressMap();
    map[unitId] = { ...(map[unitId] || { quizDone: false, writingDone: false }), ...partial };
    localStorage.setItem("esh_student_progress", JSON.stringify(map));
  },

  // Yazma Atölyesi Taslaklarını Kaydetme / Okuma
  getAllWritingDrafts() {
    try {
      return JSON.parse(localStorage.getItem("esh_writing_drafts") || "{}");
    } catch {
      return {};
    }
  },

  getWritingDraft(unitId) {
    const drafts = this.getAllWritingDrafts();
    return drafts[unitId] || "";
  },

  saveWritingDraft(unitId, text) {
    if (!unitId) return;
    try {
      const drafts = this.getAllWritingDrafts();
      drafts[unitId] = text;
      localStorage.setItem("esh_writing_drafts", JSON.stringify(drafts));
      this.updateUnitProgress(unitId, { writingDone: text.trim().length >= 15 });
    } catch (e) {
      console.error("Failed to save writing draft:", e);
    }
  },

  // Genel Öğrenci Karnesi & Başarım Rozetleri
  getPortfolioSummary() {
    const progressMap = this.getProgressMap();
    const drafts = this.getAllWritingDrafts();
    const savedWords = this.getSavedWords();

    let totalUnits = 0;
    let completedUnits = 0;
    let anyActivity = false;
    let totalWordsWritten = 0;
    let masteredVocabCount = 0;
    const gradeBreakdown = [];

    [1, 2, 3, 4, 5, 6].forEach(grade => {
      const units = CURRICULUM_DATA[grade] || [];
      let gradeDone = 0;

      units.forEach(u => {
        totalUnits++;
        const p = progressMap[u.id] || {};
        if (p.quizDone || p.writingDone) anyActivity = true;

        if (p.quizDone && p.writingDone) {
          completedUnits++;
          gradeDone++;
        } else if (p.quizDone || p.writingDone) {
          gradeDone += 0.5;
        }

        const draftText = (drafts[u.id] || "").trim();
        if (draftText) {
          totalWordsWritten += draftText.split(/\s+/).length;
        }

        if (u.vocab && u.vocab.length) {
          u.vocab.forEach(v => {
            const escaped = v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            if (draftText && new RegExp(`\\b${escaped}\\b`, "i").test(draftText)) {
              masteredVocabCount++;
            } else if (p.quizDone) {
              masteredVocabCount++;
            }
          });
        }
      });

      const pct = units.length ? Math.round((gradeDone / units.length) * 100) : 0;
      gradeBreakdown.push({ grade, total: units.length, pct });
    });

    const achievements = [
      {
        icon: "📘",
        title: "First Step",
        desc: "Complete your first practice or writing activity",
        unlocked: anyActivity || completedUnits >= 1
      },
      {
        icon: "🔖",
        title: "Word Collector",
        desc: "Save at least 3 words to your Word Bank",
        unlocked: savedWords.length >= 3
      },
      {
        icon: "✍️",
        title: "Young Author",
        desc: "Write 50+ words across Writing Workshops",
        unlocked: totalWordsWritten >= 50
      },
      {
        icon: "🎓",
        title: "Grade Scholar",
        desc: "Reach 100% mastery in any Grade level",
        unlocked: gradeBreakdown.some(g => g.pct === 100)
      }
    ];

    return {
      totalUnits,
      completedUnits,
      totalWordsWritten,
      masteredVocabCount,
      savedWordsCount: savedWords.length,
      gradeBreakdown,
      achievements
    };
  },

  resetAllProgress() {
    localStorage.removeItem("esh_student_progress");
    localStorage.removeItem("esh_writing_drafts");
  }
};
