/**
 * English Skills Hub - Kokoro-82M Neural AI Speech & Pronunciation Engine
 *
 * Engine 1 (Primary Default): Kokoro-82M (onnx-community/Kokoro-82M-v1.0-ONNX via kokoro-js)
 *   - 82-Million parameter frontier open-weight TTS running 100% in the browser (WASM / WebGPU).
 *   - Delivers ultra-realistic human prosody, breathing, storytelling warmth, and multi-character voices.
 *   - Uses a background Web Worker (with automatic main-thread fallback for file:// protocol)
 *     plus lookahead sentence prefetching and in-memory WAV Blob caching for zero-lag playback.
 *
 * Engine 2 (Instant Cloud Stream Fallback): Studio Cloud WaveNet Audio (<audio>)
 *   - Streams natural WaveNet speech if the user selects a Cloud voice or if Kokoro is unavailable.
 *
 * Engine 3 (Offline Browser Fallback): Web Speech API (speechSynthesis)
 *   - Uses local/Edge Natural voices with pitch locked at 1.0.
 */
const SpeechEngine = {
  synth: window.speechSynthesis || null,
  RecognitionClass: window.SpeechRecognition || window.webkitSpeechRecognition || null,
  activeRecognizer: null,
  activeAudio: null,
  preloadAudioEl: null,
  roleplayTimer: null,
  sentencePauseTimer: null,
  rate: 0.92,
  isPlayingSequence: false,
  preferredVoice: null,
  availableEnglishVoices: [],
  selectedVoiceURI: localStorage.getItem("esh_preferred_voice_v2") || "kokoro:auto",
  onVoicesReadyCallbacks: [],
  onKokoroStatusCallbacks: [],

  // Kokoro-82M state
  kokoroModelId: "onnx-community/Kokoro-82M-v1.0-ONNX",
  kokoroCdnUrl: "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm",
  kokoroStatus: "idle", // "idle" | "loading" | "ready" | "generating" | "playing" | "error"
  kokoroProgress: 0,
  kokoroStatusText: "Kokoro-82M AI Ready to Load",
  kokoroWorker: null,
  kokoroMainThreadInstance: null,
  kokoroInitPromise: null,
  kokoroRequestQueue: new Map(),
  kokoroNextReqId: 1,
  kokoroAudioCache: new Map(), // key: `${voiceId}|${normalizedText}` -> blobUrl
  kokoroPendingGenerations: new Map(), // key -> Promise<string(blobUrl)>
  activeGenerationSession: 0,

  KOKORO_VOICES: [
    { id: "kokoro:auto", voice: "af_heart", label: "Kokoro-82M — Auto (Multi-Character AI) 🌟" },
    { id: "kokoro:af_heart", voice: "af_heart", label: "Kokoro-82M — Heart (US Female · Warm & Expressive) 🌟" },
    { id: "kokoro:af_bella", voice: "af_bella", label: "Kokoro-82M — Bella (US Female · Storyteller) 🌟" },
    { id: "kokoro:bf_emma", voice: "bf_emma", label: "Kokoro-82M — Emma (UK Female · Oxford British) 🌟" },
    { id: "kokoro:am_adam", voice: "am_adam", label: "Kokoro-82M — Adam (US Male · Deep Narrator)" },
    { id: "kokoro:bm_george", voice: "bm_george", label: "Kokoro-82M — George (UK Male · British Narrator)" },
    { id: "kokoro:af_nicole", voice: "af_nicole", label: "Kokoro-82M — Nicole (US Female · Calm & Gentle)" },
    { id: "kokoro:af_sarah", voice: "af_sarah", label: "Kokoro-82M — Sarah (US Female · Clear Teacher)" },
    { id: "kokoro:am_michael", voice: "am_michael", label: "Kokoro-82M — Michael (US Male · Friendly)" }
  ],

  CLOUD_VOICES: [
    { id: "cloud:auto", label: "Cloud Stream — Auto (Multi-Accent)", lang: "en-US" },
    { id: "cloud:en-US", label: "Cloud Stream — US Teacher (American)", lang: "en-US" },
    { id: "cloud:en-GB", label: "Cloud Stream — Oxford UK (British)", lang: "en-GB" },
    { id: "cloud:en-AU", label: "Cloud Stream — Sydney (Australian)", lang: "en-AU" }
  ],

  notifyKokoroStatus(status, statusText, progress = null) {
    this.kokoroStatus = status;
    if (statusText) this.kokoroStatusText = statusText;
    if (typeof progress === "number") this.kokoroProgress = Math.round(progress);
    this.onKokoroStatusCallbacks.forEach(cb => {
      try {
        cb({
          status: this.kokoroStatus,
          text: this.kokoroStatusText,
          progress: this.kokoroProgress
        });
      } catch {}
    });
  },

  isUsingKokoroVoice() {
    return !this.selectedVoiceURI || this.selectedVoiceURI.startsWith("kokoro:");
  },

  isUsingCloudVoice() {
    return Boolean(this.selectedVoiceURI && this.selectedVoiceURI.startsWith("cloud:"));
  },

  getKokoroVoiceForSpeaker(speakerIndex = 0) {
    if (this.selectedVoiceURI && this.selectedVoiceURI.startsWith("kokoro:") && this.selectedVoiceURI !== "kokoro:auto") {
      return this.selectedVoiceURI.replace("kokoro:", "");
    }
    // Multi-character rotation in "kokoro:auto" mode
    const cast = ["af_heart", "bm_george", "af_bella", "am_adam", "bf_emma", "am_michael"];
    return cast[speakerIndex % cast.length];
  },

  /**
   * Converts raw Float32Array PCM samples (-1.0 to 1.0) into a standard 16-bit PCM WAV Blob URL.
   */
  float32ToWavBlobUrl(samples, sampleRate = 24000) {
    const numSamples = samples.length;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeStr = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true);  // PCM format = 1
    view.setUint16(22, 1, true);  // Mono = 1 channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true);  // Block align
    view.setUint16(34, 16, true); // 16-bit samples
    writeStr(36, "data");
    view.setUint32(40, numSamples * 2, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }

    const blob = new Blob([buffer], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  },

  /**
   * Initializes Kokoro-82M in a background Web Worker (with automatic main-thread fallback).
   */
  initKokoro() {
    if (this.kokoroInitPromise) return this.kokoroInitPromise;

    this.notifyKokoroStatus("loading", "🧠 Kokoro-82M Downloading (0%)...", 0);

    this.kokoroInitPromise = new Promise((resolve, reject) => {
      const workerCode = `
        import { KokoroTTS } from "${this.kokoroCdnUrl}";
        let tts = null;

        self.onmessage = async (e) => {
          const { type, id, text, voice, modelId } = e.data;
          if (type === "init") {
            try {
              tts = await KokoroTTS.from_pretrained(modelId, {
                dtype: "q8",
                device: "wasm",
                progress_callback: (info) => {
                  if (info && typeof info.progress === "number") {
                    self.postMessage({ type: "progress", progress: info.progress, file: info.file || "" });
                  }
                }
              });
              self.postMessage({ type: "ready" });
            } catch (err) {
              self.postMessage({ type: "init_error", error: err?.message || String(err) });
            }
          } else if (type === "generate") {
            try {
              if (!tts) throw new Error("Kokoro-82M not initialized");
              const raw = await tts.generate(text, { voice: voice || "af_heart" });
              const samples = raw.audio;
              const sampleRate = raw.sampling_rate || 24000;
              self.postMessage(
                { type: "generated", id, samples, sampleRate },
                [samples.buffer]
              );
            } catch (err) {
              self.postMessage({ type: "gen_error", id, error: err?.message || String(err) });
            }
          }
        };
      `;

      const fallbackToMainThread = async () => {
        try {
          const mod = await import(this.kokoroCdnUrl);
          const KokoroTTS = mod.KokoroTTS;
          this.kokoroMainThreadInstance = await KokoroTTS.from_pretrained(this.kokoroModelId, {
            dtype: "q8",
            device: "wasm",
            progress_callback: (info) => {
              if (info && typeof info.progress === "number") {
                const pct = Math.round(info.progress);
                this.notifyKokoroStatus("loading", `🧠 Kokoro-82M Loading (${pct}%)...`, pct);
              }
            }
          });
          this.notifyKokoroStatus("ready", "🧠 Kokoro-82M Ready 🌟", 100);
          resolve(true);
        } catch (err) {
          this.kokoroInitPromise = null;
          this.notifyKokoroStatus("error", "⚠️ Kokoro-82M Offline (Fallback Active)", 0);
          reject(err);
        }
      };

      try {
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl, { type: "module" });
        this.kokoroWorker = worker;

        worker.onmessage = (e) => {
          const msg = e.data;
          if (msg.type === "progress") {
            const pct = Math.round(msg.progress);
            this.notifyKokoroStatus("loading", `🧠 Kokoro-82M Loading (${pct}%)...`, pct);
          } else if (msg.type === "ready") {
            this.notifyKokoroStatus("ready", "🧠 Kokoro-82M Ready 🌟", 100);
            resolve(true);
          } else if (msg.type === "init_error") {
            this.kokoroWorker = null;
            fallbackToMainThread();
          } else if (msg.type === "generated") {
            const pending = this.kokoroRequestQueue.get(msg.id);
            if (pending) {
              this.kokoroRequestQueue.delete(msg.id);
              const wavUrl = this.float32ToWavBlobUrl(msg.samples, msg.sampleRate);
              pending.resolve(wavUrl);
            }
          } else if (msg.type === "gen_error") {
            const pending = this.kokoroRequestQueue.get(msg.id);
            if (pending) {
              this.kokoroRequestQueue.delete(msg.id);
              pending.reject(new Error(msg.error));
            }
          }
        };

        worker.onerror = () => {
          this.kokoroWorker = null;
          fallbackToMainThread();
        };

        worker.postMessage({ type: "init", modelId: this.kokoroModelId });
      } catch {
        fallbackToMainThread();
      }
    });

    return this.kokoroInitPromise;
  },

  /**
   * Generates (or retrieves from cache) a Kokoro-82M WAV Blob URL for a given text and voice.
   */
  async synthesizeKokoroWav(text, voice = "af_heart") {
    const normalized = this.normalizeTextForSpeech(text);
    if (!normalized) throw new Error("Empty text");

    const cacheKey = `${voice}|${normalized}`;
    if (this.kokoroAudioCache.has(cacheKey)) {
      return this.kokoroAudioCache.get(cacheKey);
    }
    if (this.kokoroPendingGenerations.has(cacheKey)) {
      return this.kokoroPendingGenerations.get(cacheKey);
    }

    const genPromise = (async () => {
      await this.initKokoro();

      let wavUrl;
      if (this.kokoroWorker) {
        wavUrl = await new Promise((resolve, reject) => {
          const id = this.kokoroNextReqId++;
          this.kokoroRequestQueue.set(id, { resolve, reject });
          this.kokoroWorker.postMessage({
            type: "generate",
            id,
            text: normalized,
            voice
          });
        });
      } else if (this.kokoroMainThreadInstance) {
        const raw = await this.kokoroMainThreadInstance.generate(normalized, { voice });
        wavUrl = this.float32ToWavBlobUrl(raw.audio, raw.sampling_rate || 24000);
      } else {
        throw new Error("Kokoro-82M instance unavailable");
      }

      this.kokoroAudioCache.set(cacheKey, wavUrl);
      this.kokoroPendingGenerations.delete(cacheKey);
      return wavUrl;
    })();

    this.kokoroPendingGenerations.set(cacheKey, genPromise);
    try {
      return await genPromise;
    } catch (err) {
      this.kokoroPendingGenerations.delete(cacheKey);
      throw err;
    }
  },

  /**
   * Plays text using Kokoro-82M Neural AI, falling back to Cloud WaveNet if offline/error.
   */
  async playKokoroText(text, speakerIndex = 0, onEndCallback = null) {
    const sessionId = ++this.activeGenerationSession;
    const voice = this.getKokoroVoiceForSpeaker(speakerIndex);

    try {
      if (this.kokoroStatus === "ready") {
        this.notifyKokoroStatus("generating", "🧠 Kokoro-82M Synthesizing...");
      }
      const wavUrl = await this.synthesizeKokoroWav(text, voice);

      // Check if user clicked stop or started another playback while generating
      if (sessionId !== this.activeGenerationSession) return;

      this.notifyKokoroStatus("playing", `🔊 Kokoro-82M (${voice})`);

      const audio = document.createElement("audio");
      audio.src = wavUrl;
      audio.playbackRate = this.rate;
      if ("preservesPitch" in audio) audio.preservesPitch = true;
      if ("webkitPreservesPitch" in audio) audio.webkitPreservesPitch = true;

      this.activeAudio = audio;

      audio.onended = () => {
        if (this.activeAudio !== audio) return;
        this.activeAudio = null;
        this.notifyKokoroStatus("ready", "🧠 Kokoro-82M Ready 🌟");
        if (onEndCallback) onEndCallback();
      };

      audio.onerror = () => {
        if (this.activeAudio !== audio) return;
        this.activeAudio = null;
        this.notifyKokoroStatus("ready", "🧠 Kokoro-82M Ready 🌟");
        this.playCloudNeuralText(text, speakerIndex, onEndCallback);
      };

      await audio.play();
    } catch (err) {
      console.warn("Kokoro-82M fallback triggered:", err);
      if (sessionId !== this.activeGenerationSession) return;
      this.playCloudNeuralText(text, speakerIndex, onEndCallback);
    }
  },

  /**
   * Scores local/browser SpeechSynthesis voices by naturalness.
   */
  scoreVoice(v) {
    if (!v || !v.lang) return -999;
    const lang = v.lang.replace("_", "-");
    if (!/^en(-|$)/i.test(lang)) return -999;

    const name = (v.name || "").toLowerCase();
    let score = 0;

    if (/^en-us$/i.test(lang)) score += 40;
    else if (/^en-gb$/i.test(lang)) score += 38;
    else if (/^en-(au|ca|ie|nz)$/i.test(lang)) score += 28;
    else score += 15;

    if (name.includes("natural") || name.includes("neural")) score += 140;
    if (name.includes("online")) score += 70;
    if (/\b(aria|jenny|ana|sonia|libby|maisie|ava|andrew|emma|brian|guy|ryan|christopher|eric|michelle|steffan)\b/i.test(name)) {
      score += 60;
    }

    if (name.includes("google uk english female")) score += 110;
    else if (name.includes("google us english")) score += 105;
    else if (name.includes("google uk english male")) score += 100;
    else if (name.includes("google")) score += 85;

    if (name.includes("premium") || name.includes("enhanced")) score += 105;
    if (/\b(samantha|allison|ava|karen|daniel|moira|tessa|serena|alex|nicky)\b/i.test(name)) {
      score += 50;
    }

    if (/\b(david|mark|zira|richard|george|hazel|susan|heera|ravi)\b/i.test(name) && !name.includes("natural")) {
      score -= 40;
    }
    if (name.includes("espeak") || name.includes("festival")) {
      score -= 90;
    }

    return score;
  },

  initVoices() {
    if (this.isUsingKokoroVoice()) {
      // Warm up Kokoro-82M in the background shortly after page load
      setTimeout(() => {
        if (this.isUsingKokoroVoice()) {
          this.initKokoro().catch(() => {});
        }
      }, 600);
    }

    if (!this.synth) return;

    const selectVoice = () => {
      const rawVoices = this.synth.getVoices() || [];
      if (!rawVoices.length) return;

      const englishVoices = rawVoices
        .filter(v => v.lang && /^en(-|_|$)/i.test(v.lang))
        .map(v => ({ voice: v, score: this.scoreVoice(v) }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.voice);

      this.availableEnglishVoices = englishVoices.length > 0 ? englishVoices : rawVoices;

      if (this.selectedVoiceURI && !this.selectedVoiceURI.startsWith("cloud:") && !this.selectedVoiceURI.startsWith("kokoro:")) {
        const saved = this.availableEnglishVoices.find(
          v => v.voiceURI === this.selectedVoiceURI || v.name === this.selectedVoiceURI
        );
        this.preferredVoice = saved || this.availableEnglishVoices[0] || null;
      } else {
        this.preferredVoice = this.availableEnglishVoices[0] || null;
      }

      this.onVoicesReadyCallbacks.forEach(cb => {
        try { cb(this.availableEnglishVoices, this.preferredVoice); } catch {}
      });
    };

    selectVoice();
    if (typeof this.synth.onvoiceschanged !== "undefined") {
      this.synth.onvoiceschanged = selectVoice;
    }
  },

  setPreferredVoice(voiceURI) {
    this.selectedVoiceURI = voiceURI || "kokoro:auto";
    localStorage.setItem("esh_preferred_voice_v2", this.selectedVoiceURI);
    if (this.selectedVoiceURI.startsWith("kokoro:")) {
      this.initKokoro().catch(() => {});
    } else if (!this.selectedVoiceURI.startsWith("cloud:")) {
      const found = this.availableEnglishVoices.find(
        v => v.voiceURI === voiceURI || v.name === voiceURI
      );
      if (found) {
        this.preferredVoice = found;
      }
    }
  },

  formatVoiceLabel(v) {
    if (!v) return "Browser English Voice";
    let cleanName = v.name
      .replace(/^Microsoft\s+/i, "")
      .replace(/\s+Online\s+\(Natural\)\s*-\s*English.*$/i, " (Edge Natural 🌟)")
      .replace(/\s+-\s+English.*$/i, "");
    const langTag = (v.lang || "en").replace("_", "-");
    return `${cleanName} [${langTag}]`;
  },

  normalizeTextForSpeech(text) {
    if (!text) return "";
    return String(text)
      .replace(/^Heading\s+\d+:\s*/i, "")
      .replace(/^Main\s+Section\s+\d+:\s*/i, "")
      .replace(/\bDr\.\s+/g, "Doctor ")
      .replace(/\bMr\.\s+/g, "Mister ")
      .replace(/\bMrs\.\s+/g, "Misses ")
      .replace(/\bMs\.\s+/g, "Miz ")
      .replace(/\bSt\.\s+/g, "Saint ")
      .replace(/\s*—\s*/g, ", ")
      .replace(/\s*--\s*/g, ", ")
      .replace(/°C\b/g, " degrees Celsius")
      .replace(/°F\b/g, " degrees Fahrenheit")
      .replace(/\b5\s*Ws\b/gi, "five W's")
      .replace(/\s+/g, " ")
      .trim();
  },

  splitIntoSpeechChunks(text, maxLen = 165) {
    const normalized = this.normalizeTextForSpeech(text);
    if (!normalized) return [];
    if (normalized.length <= maxLen) return [normalized];

    const rawSentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [normalized];
    const chunks = [];

    rawSentences.forEach(sent => {
      const s = sent.trim();
      if (!s) return;
      if (s.length <= maxLen) {
        chunks.push(s);
        return;
      }

      const parts = s.split(/(?<=[,;:])\s+/);
      let current = "";
      parts.forEach(p => {
        if (!current) {
          current = p;
        } else if ((current + " " + p).length <= maxLen) {
          current += " " + p;
        } else {
          chunks.push(current.trim());
          current = p;
        }
      });
      if (current.trim()) chunks.push(current.trim());
    });

    return chunks;
  },

  getCloudLangForSpeaker(speakerIndex = 0) {
    if (this.selectedVoiceURI && this.selectedVoiceURI.startsWith("cloud:") && this.selectedVoiceURI !== "cloud:auto") {
      return this.selectedVoiceURI.replace("cloud:", "");
    }
    const accents = ["en-US", "en-GB", "en-AU", "en-CA"];
    return accents[speakerIndex % accents.length];
  },

  buildCloudAudioUrl(chunkText, langCode = "en-US") {
    return `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(langCode)}&q=${encodeURIComponent(chunkText)}`;
  },

  preloadText(text, speakerIndex = 0) {
    if (!text) return;
    if (this.isUsingKokoroVoice()) {
      const voice = this.getKokoroVoiceForSpeaker(speakerIndex);
      this.synthesizeKokoroWav(text, voice).catch(() => {});
      return;
    }
    if (!this.isUsingCloudVoice()) return;
    const chunks = this.splitIntoSpeechChunks(text);
    if (!chunks.length) return;
    try {
      const langCode = this.getCloudLangForSpeaker(speakerIndex);
      const audio = document.createElement("audio");
      audio.setAttribute("referrerpolicy", "no-referrer");
      audio.preload = "auto";
      audio.src = this.buildCloudAudioUrl(chunks[0], langCode);
      this.preloadAudioEl = audio;
    } catch {}
  },

  playCloudNeuralText(text, speakerIndex = 0, onEndCallback = null) {
    const chunks = this.splitIntoSpeechChunks(text);
    if (!chunks.length) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const langCode = this.getCloudLangForSpeaker(speakerIndex);
    let chunkIdx = 0;

    const playNextChunk = () => {
      if (chunkIdx >= chunks.length) {
        this.activeAudio = null;
        if (onEndCallback) onEndCallback();
        return;
      }

      const chunk = chunks[chunkIdx];
      const audio = document.createElement("audio");
      audio.setAttribute("referrerpolicy", "no-referrer");
      audio.preload = "auto";
      audio.src = this.buildCloudAudioUrl(chunk, langCode);

      audio.playbackRate = this.rate;
      if ("preservesPitch" in audio) audio.preservesPitch = true;
      if ("webkitPreservesPitch" in audio) audio.webkitPreservesPitch = true;

      this.activeAudio = audio;

      audio.onended = () => {
        if (this.activeAudio !== audio) return;
        chunkIdx++;
        if (chunkIdx < chunks.length) {
          this.sentencePauseTimer = setTimeout(playNextChunk, 160);
        } else {
          this.activeAudio = null;
          if (onEndCallback) onEndCallback();
        }
      };

      audio.onerror = () => {
        this.activeAudio = null;
        this.speakWithBrowserSynth(text, onEndCallback, speakerIndex);
      };

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          if (this.activeAudio === audio) {
            this.activeAudio = null;
            this.speakWithBrowserSynth(text, onEndCallback, speakerIndex);
          }
        });
      }
    };

    playNextChunk();
  },

  speakWithBrowserSynth(text, onEndCallback = null, speakerIndex = 0) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      if (this.synth.paused) this.synth.resume();
    } catch {}

    const normalized = this.normalizeTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(normalized);

    let chosenVoice = this.preferredVoice;
    if (speakerIndex > 0 && this.availableEnglishVoices.length > 1) {
      chosenVoice = this.availableEnglishVoices[speakerIndex % Math.min(3, this.availableEnglishVoices.length)];
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }

    utterance.pitch = 1.0;
    utterance.rate = this.rate;

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    this.synth.speak(utterance);
  },

  speak(text, onEndCallback = null, speakerIndex = 0) {
    this.stop();
    if (this.isUsingKokoroVoice()) {
      this.playKokoroText(text, speakerIndex, onEndCallback);
    } else if (this.isUsingCloudVoice()) {
      this.playCloudNeuralText(text, speakerIndex, onEndCallback);
    } else {
      this.speakWithBrowserSynth(text, onEndCallback, speakerIndex);
    }
  },

  speakSequence(lines, onLineStart, onComplete, userRoleSpeaker = "") {
    if (!lines || !lines.length) return;
    this.stop();
    this.isPlayingSequence = true;

    const speakerMap = {};
    let nextSpeakerId = 0;
    lines.forEach(l => {
      const key = (l.speaker || "Narrator").toLowerCase();
      if (typeof speakerMap[key] === "undefined") {
        speakerMap[key] = nextSpeakerId++;
      }
    });

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

      // Lookahead pipeline: pre-synthesize the next 2 lines in Kokoro-82M while current line plays
      for (let lookahead = 1; lookahead <= 2; lookahead++) {
        if (currentIdx + lookahead < lines.length) {
          const futureLine = lines[currentIdx + lookahead];
          const futureSpeakerIdx = speakerMap[(futureLine.speaker || "Narrator").toLowerCase()] || 0;
          this.preloadText(futureLine.text, futureSpeakerIdx);
        }
      }

      if (isUserTurn) {
        const wordCount = line.text.trim().split(/\s+/).length;
        const waitMs = Math.max(3000, wordCount * 480);
        this.roleplayTimer = setTimeout(() => {
          index++;
          next();
        }, waitMs);
        return;
      }

      const speakerIdx = speakerMap[(line.speaker || "Narrator").toLowerCase()] || 0;

      const onLineFinished = () => {
        if (!this.isPlayingSequence) return;
        index++;
        this.sentencePauseTimer = setTimeout(() => {
          next();
        }, 320);
      };

      if (this.isUsingKokoroVoice()) {
        this.playKokoroText(line.text, speakerIdx, onLineFinished);
      } else if (this.isUsingCloudVoice()) {
        this.playCloudNeuralText(line.text, speakerIdx, onLineFinished);
      } else {
        this.speakWithBrowserSynth(line.text, onLineFinished, speakerIdx);
      }
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
        } else if (code === "audio-capture") {
          msg = "No microphone was found on this device.";
        }
        if (onError) onError(msg);
      };

      recognition.onend = () => {
        this.activeRecognizer = null;
      };

      recognition.start();
    } catch {
      this.activeRecognizer = null;
      if (onError) onError("Could not start microphone recognition.");
    }
  },

  evaluateSimilarity(targetRaw, spokenRaw) {
    const clean = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s']/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const targetWords = clean(targetRaw);
    const spokenWords = clean(spokenRaw);

    if (!targetWords.length) {
      return { score: 0, spoken: spokenRaw, wordBreakdown: [] };
    }

    let matchedCount = 0;
    const spokenUsed = new Array(spokenWords.length).fill(false);

    const wordBreakdown = targetWords.map((tw) => {
      let matched = false;
      for (let i = 0; i < spokenWords.length; i++) {
        if (!spokenUsed[i] && (spokenWords[i] === tw || this.isCloseWord(tw, spokenWords[i]))) {
          spokenUsed[i] = true;
          matched = true;
          matchedCount++;
          break;
        }
      }
      return { word: tw, matched };
    });

    const score = Math.round((matchedCount / targetWords.length) * 100);
    return {
      score,
      spoken: spokenRaw,
      wordBreakdown
    };
  },

  isCloseWord(a, b) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1) return false;
    if (a.length < 4 || b.length < 4) return false;

    let edits = 0;
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] !== b[j]) {
        edits++;
        if (edits > 1) return false;
        if (a.length > b.length) i++;
        else if (b.length > a.length) j++;
        else { i++; j++; }
      } else {
        i++; j++;
      }
    }
    return true;
  },

  stop() {
    this.isPlayingSequence = false;
    this.activeGenerationSession++;
    if (this.roleplayTimer) {
      clearTimeout(this.roleplayTimer);
      this.roleplayTimer = null;
    }
    if (this.sentencePauseTimer) {
      clearTimeout(this.sentencePauseTimer);
      this.sentencePauseTimer = null;
    }
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.removeAttribute("src");
      } catch {}
      this.activeAudio = null;
    }
    if (this.kokoroStatus === "playing" || this.kokoroStatus === "generating") {
      this.notifyKokoroStatus("ready", "🧠 Kokoro-82M Ready 🌟");
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
