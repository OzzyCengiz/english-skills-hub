/**
 * Tarayıcı Seslendirme (Web Speech API) Servisi
 */
const SpeechEngine = {
  synth: window.speechSynthesis || null,

  speak(text) {
    if (!this.synth) return;
    this.synth.cancel(); // Mevcut seslendirmeyi kes

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Öğrenciler için hafif yavaş ve anlaşılır tempo
    this.synth.speak(utterance);
  },

  stop() {
    if (this.synth) this.synth.cancel();
  }
};