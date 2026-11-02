/**
 * Merkezi Durum (State) Yönetimi
 */
const AppState = {
  activeGrade: 1,
  activeUnitIndex: 0,
  activeTab: "passage",
  fontSize: 16,
  isDyslexicFont: false,
  isFocusActive: false,

  getCurrentGradeUnits() {
    return CURRICULUM_DATA[this.activeGrade] || [];
  },

  getCurrentUnit() {
    const units = this.getCurrentGradeUnits();
    return units[this.activeUnitIndex] || null;
  }
};