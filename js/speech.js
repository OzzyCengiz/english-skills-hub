/**
 * Tarayıcı Seslendirme (Web Speech API) & Telaffuz Tanıma (SpeechRecognition) Servisi
 * Masaüstü ve Mobil (iOS Safari / Android Chrome) uyumlu ses seçimi, resume ve hata yönetimi içerir.
 */
const SpeechEngine = {
  synth: window.speechSynthesis || null,
  RecognitionClass: window.SpeechRecognition || window.webkitSpeechRecognition || null,
  activeRecognizer: null,
  roleplayTimer: null,
  rate: 0.9,
  isPlayingSequence: false,
  preferredVoice: null,

  initVoices() {
    if (!this.synth) return;
    const selectVoice = () => {
      const voices = this.synth.getVoices() || [];
      if (!voices.length) return;
      this.preferredVoice =
        voices.find(v => v.lang === "en-US" && v.localService) ||
        voices.find(v => v.lang === "en-US") ||
        voices.find(v => v.lang && v.lang.startsWith("en")) ||
        null;
    };
    selectVoice();
    if (typeof this.synth.onvoiceschanged !== "undefined") {
      this.synth.onvoiceschanged = selectVoice;
    }
  },

  createUtterance(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = this.rate;
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    return utterance;
  },

  speak(text, onEndCallback = null) {
    if (!this.synth) return;
    this.stop();

    try {
      if (this.synth.paused) this.synth.resume();
    } catch {}

    const utterance = this.createUtterance(text);
    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }
    this.synth.speak(utterance);
  },

  speakSequence(lines, onLineStart, onComplete, userRoleSpeaker = "") {
    if (!this.synth || !lines || !lines.length) return;
    this.stop();
    this.isPlayingSequence = true;

    try {
      if (this.synth.paused) this.synth.resume();
    } catch {}

    let index = 0;
    const next = () => {
      if (!this.isPlayingSequence || index >= lines.length) {
        this.isPlayingSequence = false;
        if (onComplete) onComplete();
        return;
      }

      const currentIdx = index;
      const line = lines[currentIdx];
      const isUserTurn = userRoleSpeaker && line.speaker.toLowerCase() === userRoleSpeaker.toLowerCase();

      if (onLineStart) onLineStart(currentIdx, isUserTurn);

      if (isUserTurn) {
        const wordCount = line.text.trim().split(/\s+/).length;
        const waitMs = Math.max(3000, wordCount * 480);
        this.roleplayTimer = setTimeout(() => {
          index++;
          next();
        }, waitMs);
        return;
      }

      const utterance = this.createUtterance(line.text);

      utterance.onend = () => {
        index++;
        next();
      };
      utterance.onerror = () => {
        this.isPlayingSequence = false;
        if (onComplete) onComplete();
      };

      this.synth.speak(utterance);
    };

    next();
  },

  // Mikrofonla Telaffuz Kontrolü (SpeechRecognition)
  listenAndEvaluate(targetText, onResult, onError) {
    if (!this.RecognitionClass) {
      if (onError) onError("Speech recognition is not supported on this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    this.stop();

    try {
      const recognition = new this.RecognitionClass();
      this.activeRecognizer = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        const evaluation = this.evaluateSimilarity(targetText, transcript);
        this.activeRecognizer = null;
        if (onResult) onResult(evaluation);
      };

      recognition.onerror = (event) => {
        this.activeRecognizer = null;
        const code = event.error;
        let msg = `Microphone error (${code}).`;
        if (code === "not-allowed" || code === "service-not-allowed") {
          msg = "Microphone permission was denied. Please allow microphone access in your browser settings.";
        } else if (code === "no-speech") {
          msg = "No speech was detected. Tap the microphone and speak clearly.";
        }
        if (onError) onError(msg);
      };

      recognition.onend = () => {
        this.activeRecognizer = null;
      };

      recognition.start();
    } catch (e) {
      this.activeRecognizer = null;
      if (onError) onError("Could not start microphone.");
    }
  },

  evaluateSimilarity(target, spoken) {
    const clean = (str) =>
      String(str)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const targetWords = clean(target);
    const spokenWords = clean(spoken);

    if (targetWords.length === 0) {
      return { transcript: spoken, score: 0, passed: false };
    }

    let matched = 0;
    targetWords.forEach(tw => {
      if (spokenWords.includes(tw)) matched++;
    });

    const score = Math.round((matched / targetWords.length) * 100);
    return {
      transcript: spoken,
      score,
      passed: score >= 70
    };
  },

  stop() {
    this.isPlayingSequence = false;
    if (this.roleplayTimer) {
      clearTimeout(this.roleplayTimer);
      this.roleplayTimer = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    if (this.activeRecognizer) {
      try {
        this.activeRecognizer.abort();
      } catch {}
      this.activeRecognizer = null;
    }
  }
};

SpeechEngine.initVoices();
