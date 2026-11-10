/**
 * Last Breath // Procedural Retro-Terminal Audio Synthesis Engine
 * Zero external dependencies. Zero audio asset files.
 * Native Web Audio API procedural synthesis.
 */

class AudioEngine {
  #ctx = null;
  #masterGain = null;
  #crtFilter = null;
  #humOsc = null;
  #humGain = null;
  #noiseBuffer = null;
  #isMuted = false;
  #volume = 0.7;
  #unlocked = false;
  #geigerInterval = null;
  #heartbeatInterval = null;

  constructor() {
    this.#setupAutoplayUnlock();
  }

  /* =========================================================================
     Lifecycle & Autoplay Management
     ========================================================================= */

  /**
   * Lazily initializes and returns the Web Audio context.
   */
  #getContext() {
    if (!this.#ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.#ctx = new AudioContextClass();
        this.#initMasterChain();
      }
    }
    if (this.#ctx && this.#ctx.state === 'suspended' && this.#unlocked) {
      this.#ctx.resume().catch(() => {});
    }
    return this.#ctx;
  }

  /**
   * Builds the master signal routing chain:
   * [Source Nodes] ──► [CRT Warmer Filter] ──► [Master Gain] ──► [Destination]
   */
  #initMasterChain() {
    if (!this.#ctx) return;

    // Warm CRT low-pass filter (cuts harsh >12kHz frequencies like vintage monitor speakers)
    this.#crtFilter = this.#ctx.createBiquadFilter();
    this.#crtFilter.type = 'lowpass';
    this.#crtFilter.frequency.value = 11500;
    this.#crtFilter.Q.value = 0.7;

    // Master Volume Gain
    this.#masterGain = this.#ctx.createGain();
    this.#masterGain.gain.value = this.#isMuted ? 0 : this.#volume;

    this.#crtFilter.connect(this.#masterGain);
    this.#masterGain.connect(this.#ctx.destination);

    // Generate reusable 2-second white noise buffer
    this.#noiseBuffer = this.#createNoiseBuffer(2.0);
  }

  /**
   * Sets up one-time window listeners to satisfy browser autoplay policies on first gesture.
   */
  #setupAutoplayUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.#unlocked = true;
      const ctx = this.#getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  /**
   * Creates a monophonic white noise AudioBuffer for procedural percussive / ballistic bursts.
   */
  #createNoiseBuffer(seconds = 2.0) {
    if (!this.#ctx) return null;
    const sampleRate = this.#ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = this.#ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /* =========================================================================
     Master Controls & CRT Monitor Hum
     ========================================================================= */

  /**
   * Sets master audio gain (0.0 to 1.0).
   */
  setMasterVolume(val) {
    this.#volume = Math.max(0, Math.min(1, val));
    if (this.#masterGain && !this.#isMuted && this.#ctx) {
      this.#masterGain.gain.setValueAtTime(this.#volume, this.#ctx.currentTime);
    }
  }

  /**
   * Toggles master mute state.
   */
  toggleMute() {
    this.#isMuted = !this.#isMuted;
    if (this.#masterGain && this.#ctx) {
      const target = this.#isMuted ? 0 : this.#volume;
      this.#masterGain.gain.setValueAtTime(target, this.#ctx.currentTime);
    }
    return this.#isMuted;
  }

  get isMuted() {
    return this.#isMuted;
  }

  get volume() {
    return this.#volume;
  }

  /**
   * Enables or disables an authentic 50Hz CRT analog transformer ground hum.
   */
  enableCrtHum(enable = true, humLevel = 0.015) {
    const ctx = this.#getContext();
    if (!ctx) return;

    if (!enable) {
      if (this.#humOsc) {
        this.#humOsc.stop();
        this.#humOsc.disconnect();
        this.#humOsc = null;
      }
      if (this.#humGain) {
        this.#humGain.disconnect();
        this.#humGain = null;
      }
      return;
    }

    if (this.#humOsc) return; // already active

    this.#humOsc = ctx.createOscillator();
    this.#humOsc.type = 'sawtooth';
    this.#humOsc.frequency.value = 50; // European 50Hz mains hum

    // Lowpass filter to muffle the hum into a deep chassis vibration
    const humFilter = ctx.createBiquadFilter();
    humFilter.type = 'lowpass';
    humFilter.frequency.value = 95;

    this.#humGain = ctx.createGain();
    this.#humGain.gain.value = humLevel;

    this.#humOsc.connect(humFilter);
    humFilter.connect(this.#humGain);
    this.#humGain.connect(this.#crtFilter);

    this.#humOsc.start();
  }

  /* =========================================================================
     Procedural Sound Effects
     ========================================================================= */

  /**
   * Synthesizes a crisp retro terminal switch / keyboard click.
   * Dual-stage impulse: Micro-burst noise click followed by an ultra-fast frequency blip.
   * @param {number} [pitchMultiplier=1.0] - Pitch scaling (0.7 to 1.5).
   * @param {number} [volume=0.35] - Local amplitude.
   */
  playTerminalClick(pitchMultiplier = 1.0, volume = 0.35) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;

    // Stage 1: Sharp mechanical micro-transient (filtered white noise)
    if (this.#noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.#noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3200 * pitchMultiplier, t);
      noiseFilter.Q.value = 3.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.45, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.#crtFilter);

      noise.start(t);
      noise.stop(t + 0.02);
    }

    // Stage 2: Tactile relay frequency blip (fast downward pitch sweep)
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400 * pitchMultiplier, t);
    osc.frequency.exponentialRampToValueAtTime(350 * pitchMultiplier, t + 0.022);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(volume * 0.25, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(oscGain);
    oscGain.connect(this.#crtFilter);

    osc.start(t);
    osc.stop(t + 0.028);
  }

  /**
   * Synthesizes an authentic Geiger-Müller radiation ionization discharge tick.
   * Short, dry, irregular electrical pulse.
   * @param {number} [intensity=0.5] - Radiation intensity factor (0.0 to 1.0).
   * @param {number} [volume=0.4] - Local amplitude.
   */
  playGeigerTick(intensity = 0.5, volume = 0.4) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted || !this.#noiseBuffer) return;

    const t = ctx.currentTime;
    // Micro-jitter in frequency and amplitude to reflect natural isotopic decay
    const jitter = (Math.random() - 0.5) * 0.3;
    const dur = 0.003 + Math.random() * 0.003;

    const noise = ctx.createBufferSource();
    noise.buffer = this.#noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime((2800 + jitter * 800), t);
    filter.Q.value = 4.5;

    const gain = ctx.createGain();
    const peak = Math.max(0.1, Math.min(1, volume * (0.6 + intensity * 0.4)));
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.#crtFilter);

    noise.start(t);
    noise.stop(t + dur + 0.001);
  }

  /**
   * Starts a continuous, randomized Geiger counter audio stream calibrated to dosage (mSv/h).
   * @param {number} dosage - Radiation dosage (e.g. 0 to 50 mSv).
   */
  startGeigerStream(dosage = 10) {
    this.stopGeigerStream();
    if (dosage <= 0.5) return;

    const normalized = Math.min(1.0, dosage / 40);
    // Average interval between clicks: 400ms at background down to 25ms at lethal dose
    const meanInterval = Math.max(25, 420 - normalized * 380);

    const scheduleNext = () => {
      this.playGeigerTick(normalized);
      const nextDelay = meanInterval * (0.4 + Math.random() * 1.2);
      this.#geigerInterval = setTimeout(scheduleNext, nextDelay);
    };

    scheduleNext();
  }

  /**
   * Stops the continuous Geiger stream.
   */
  stopGeigerStream() {
    if (this.#geigerInterval) {
      clearTimeout(this.#geigerInterval);
      this.#geigerInterval = null;
    }
  }

  /**
   * Synthesizes a visceral sub-bass double-pulse heartbeat ("lub-dub").
   * Triggered when health or telemetry drops into critical band (<20%).
   * @param {number} [bpm=60] - Heart rate in beats per minute.
   * @param {number} [volume=0.75] - Local amplitude.
   */
  playHeartbeat(bpm = 60, volume = 0.75) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;

    // Helper to generate a single ventricular contraction thump
    const playThump = (startTime, startFreq, endFreq, dur, amp) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + dur);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(amp * volume, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.#crtFilter);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.01);
    };

    // First sound: S1 "Lub" (atrio-ventricular closure)
    playThump(t, 58, 38, 0.14, 0.9);

    // Second sound: S2 "Dub" (aortic/pulmonary closure, ~130ms later, slightly higher pitch)
    playThump(t + 0.13, 76, 44, 0.11, 0.65);
  }

  /**
   * Starts or stops automatic looping heartbeat when survivor is in critical status.
   */
  setCriticalHeartbeat(active = true, bpm = 75) {
    if (!active) {
      if (this.#heartbeatInterval) {
        clearInterval(this.#heartbeatInterval);
        this.#heartbeatInterval = null;
      }
      return;
    }

    if (this.#heartbeatInterval) return;

    const intervalMs = (60 / bpm) * 1000;
    this.playHeartbeat(bpm);
    this.#heartbeatInterval = setInterval(() => {
      this.playHeartbeat(bpm);
    }, intervalMs);
  }

  /**
   * Synthesizes procedural ballistic gunshots for distinct weapon calibers.
   * Features a sharp supersonic shockwave crack, heavy pressure body thump, and reverberant tail.
   * @param {string} caliberType - '9mm', '12g' (shotgun), or '556' (rifle).
   * @param {number} [volume=0.85] - Local amplitude.
   */
  playGunshot(caliberType = '9mm', volume = 0.85) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted || !this.#noiseBuffer) return;

    const t = ctx.currentTime;
    const norm = String(caliberType).toLowerCase();

    // Configuration profile per ballistic family
    const configs = {
      '9mm': {
        crackFreq: 2200,
        crackDur: 0.035,
        bodyStartFreq: 260,
        bodyEndFreq: 48,
        bodyDur: 0.09,
        tailDur: 0.38,
        tailCutoff: 1400,
      },
      '12g': {
        crackFreq: 1100,
        crackDur: 0.08,
        bodyStartFreq: 140,
        bodyEndFreq: 30,
        bodyDur: 0.22,
        tailDur: 0.75,
        tailCutoff: 900,
      },
      '556': {
        crackFreq: 4200,
        crackDur: 0.022,
        bodyStartFreq: 450,
        bodyEndFreq: 65,
        bodyDur: 0.07,
        tailDur: 0.48,
        tailCutoff: 2100,
      },
    };

    // Match caliber aliases
    const cfg = norm.includes('12') || norm.includes('shotgun')
      ? configs['12g']
      : (norm.includes('556') || norm.includes('rifle') || norm.includes('762') ? configs['556'] : configs['9mm']);

    // 1. Initial Supersonic Crack / Muzzle Blast (Filtered Noise Burst)
    const crackSource = ctx.createBufferSource();
    crackSource.buffer = this.#noiseBuffer;

    const crackFilter = ctx.createBiquadFilter();
    crackFilter.type = 'highpass';
    crackFilter.frequency.setValueAtTime(cfg.crackFreq, t);

    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(volume * 0.95, t);
    crackGain.gain.exponentialRampToValueAtTime(0.001, t + cfg.crackDur);

    crackSource.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(this.#crtFilter);

    crackSource.start(t);
    crackSource.stop(t + cfg.crackDur + 0.01);

    // 2. Kinetic Body Thump (Pitch-dropping low-end oscillator)
    const bodyOsc = ctx.createOscillator();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(cfg.bodyStartFreq, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(cfg.bodyEndFreq, t + cfg.bodyDur);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(volume * 0.8, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + cfg.bodyDur);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.#crtFilter);

    bodyOsc.start(t);
    bodyOsc.stop(t + cfg.bodyDur + 0.01);

    // 3. Reverberant Atmospheric Decay Tail
    const tailSource = ctx.createBufferSource();
    tailSource.buffer = this.#noiseBuffer;

    const tailFilter = ctx.createBiquadFilter();
    tailFilter.type = 'lowpass';
    tailFilter.frequency.setValueAtTime(cfg.tailCutoff, t);
    tailFilter.frequency.linearRampToValueAtTime(200, t + cfg.tailDur);

    const tailGain = ctx.createGain();
    tailGain.gain.setValueAtTime(volume * 0.4, t + 0.02);
    tailGain.gain.exponentialRampToValueAtTime(0.0001, t + cfg.tailDur);

    tailSource.connect(tailFilter);
    tailFilter.connect(tailGain);
    tailGain.connect(this.#crtFilter);

    tailSource.start(t + 0.01);
    tailSource.stop(t + cfg.tailDur + 0.02);
  }

  /**
   * Synthesizes an authentic CRT analog phosphor terminal power-up whine.
   * Includes high-voltage flyback transformer sweep (2.5kHz -> 15.6kHz) and degauss relay thump.
   * @param {number} [volume=0.6] - Local amplitude.
   */
  playTerminalBoot(volume = 0.6) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;
    const dur = 1.1;

    // 1. High-Voltage Flyback Transformer Sweep (Rising whine)
    const whineOsc = ctx.createOscillator();
    whineOsc.type = 'sine';
    whineOsc.frequency.setValueAtTime(2200, t);
    whineOsc.frequency.exponentialRampToValueAtTime(15625, t + 0.8); // 15.625kHz line rate

    const whineGain = ctx.createGain();
    whineGain.gain.setValueAtTime(0.001, t);
    whineGain.gain.linearRampToValueAtTime(volume * 0.22, t + 0.4);
    whineGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    whineOsc.connect(whineGain);
    whineGain.connect(this.#masterGain); // bypass lowpass to retain 15.6kHz whine

    whineOsc.start(t);
    whineOsc.stop(t + dur + 0.05);

    // 2. Heavy Degauss Coil Thump at t + 0.15s
    const degaussOsc = ctx.createOscillator();
    degaussOsc.type = 'sine';
    degaussOsc.frequency.setValueAtTime(95, t + 0.12);
    degaussOsc.frequency.exponentialRampToValueAtTime(32, t + 0.45);

    const degaussGain = ctx.createGain();
    degaussGain.gain.setValueAtTime(0.001, t + 0.12);
    degaussGain.gain.linearRampToValueAtTime(volume * 0.7, t + 0.15);
    degaussGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    degaussOsc.connect(degaussGain);
    degaussGain.connect(this.#crtFilter);

    degaussOsc.start(t + 0.12);
    degaussOsc.stop(t + 0.6);

    // 3. Phosphor Static Bloom (Muffled soft noise swell)
    if (this.#noiseBuffer) {
      const staticSource = ctx.createBufferSource();
      staticSource.buffer = this.#noiseBuffer;

      const staticFilter = ctx.createBiquadFilter();
      staticFilter.type = 'bandpass';
      staticFilter.frequency.setValueAtTime(1600, t);
      staticFilter.Q.value = 1.2;

      const staticGain = ctx.createGain();
      staticGain.gain.setValueAtTime(0.001, t);
      staticGain.gain.linearRampToValueAtTime(volume * 0.25, t + 0.3);
      staticGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      staticSource.connect(staticFilter);
      staticFilter.connect(staticGain);
      staticGain.connect(this.#crtFilter);

      staticSource.start(t);
      staticSource.stop(t + 0.95);
    }
  }

  /**
   * Synthesizes an emergency warning klaxon or DEFCON alert tone.
   * @param {number} [freq=880] - Alert pitch in Hz.
   * @param {number} [duration=0.3] - Tone length.
   */
  playWarningAlarm(freq = 880, duration = 0.3, volume = 0.5) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.#crtFilter);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  /**
   * Synthesizes tactical equipment rustle (for inventory movement / gear equipping).
   */
  playGearRustle(volume = 0.25) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted || !this.#noiseBuffer) return;

    const t = ctx.currentTime;
    const dur = 0.08;

    const noise = ctx.createBufferSource();
    noise.buffer = this.#noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, t);
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.#crtFilter);

    noise.start(t);
    noise.stop(t + dur + 0.01);
  }

  /**
   * Synthesizes procedural vehicle starter crank and engine ignition roar.
   */
  playEngineIgnition(volume = 0.4) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;

    // 1. Starter motor chug pulses (3 starter clicks)
    for (let i = 0; i < 3; i++) {
      const clickTime = t + i * 0.12;
      const starterOsc = ctx.createOscillator();
      starterOsc.type = 'square';
      starterOsc.frequency.setValueAtTime(45 + i * 5, clickTime);

      const starterGain = ctx.createGain();
      starterGain.gain.setValueAtTime(volume * 0.25, clickTime);
      starterGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.08);

      starterOsc.connect(starterGain);
      starterGain.connect(this.#crtFilter);
      starterOsc.start(clickTime);
      starterOsc.stop(clickTime + 0.09);
    }

    // 2. Engine catch and low-frequency rumble
    const catchTime = t + 0.4;
    const rumbleOsc = ctx.createOscillator();
    rumbleOsc.type = 'sawtooth';
    rumbleOsc.frequency.setValueAtTime(65, catchTime);
    rumbleOsc.frequency.linearRampToValueAtTime(80, catchTime + 0.3);
    rumbleOsc.frequency.exponentialRampToValueAtTime(52, catchTime + 1.2);

    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(220, catchTime);
    rumbleFilter.Q.value = 2.0;

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.001, catchTime);
    rumbleGain.gain.exponentialRampToValueAtTime(volume * 0.5, catchTime + 0.15);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, catchTime + 1.2);

    rumbleOsc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.#crtFilter);

    rumbleOsc.start(catchTime);
    rumbleOsc.stop(catchTime + 1.25);
  }

  /**
   * Synthesizes procedural engine throttle rev.
   */
  playEngineRev(volume = 0.35) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;
    const revOsc = ctx.createOscillator();
    revOsc.type = 'sawtooth';
    revOsc.frequency.setValueAtTime(55, t);
    revOsc.frequency.exponentialRampToValueAtTime(140, t + 0.4);
    revOsc.frequency.exponentialRampToValueAtTime(50, t + 1.0);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);
    filter.frequency.exponentialRampToValueAtTime(500, t + 0.4);
    filter.frequency.exponentialRampToValueAtTime(200, t + 1.0);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.2, t);
    gain.gain.exponentialRampToValueAtTime(volume * 0.45, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.05);

    revOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.#crtFilter);

    revOsc.start(t);
    revOsc.stop(t + 1.1);
  }

  /**
   * Synthesizes a retro 4-note ascending celebratory arpeggio for achievement unlocks.
   */
  playAchievementChime(volume = 0.35) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.11;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, noteTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(volume * 0.4, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.#crtFilter);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  /**
   * Synthesizes mechanical frequency dial tick.
   */
  playRadioDialTick(volume = 0.22) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted || !this.#noiseBuffer) return;

    const t = ctx.currentTime;
    const noise = ctx.createBufferSource();
    noise.buffer = this.#noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400 + Math.random() * 400, t);
    filter.Q.value = 4.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.#crtFilter);

    noise.start(t);
    noise.stop(t + 0.015);
  }

  /**
   * Synthesizes radio static hiss modulated by signal reception clarity.
   * @param {number} clarity - 0.0 (pure static) to 1.0 (crystal clear signal)
   */
  playRadioStatic(clarity = 0.0, volume = 0.2) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted || !this.#noiseBuffer) return;

    const t = ctx.currentTime;
    const staticIntensity = Math.max(0.05, 1.0 - clarity);

    const noise = ctx.createBufferSource();
    noise.buffer = this.#noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    // Frequency shifts slightly with tuning
    filter.frequency.setValueAtTime(1200 + clarity * 1800, t);
    filter.Q.value = 1.8 + clarity * 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * staticIntensity * 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.#crtFilter);

    noise.start(t);
    noise.stop(t + 0.18);
  }

  /**
   * Synthesizes high-frequency Morse telemetry chirps.
   */
  playRadioMorseChirp(volume = 0.22) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;
    const beeps = [0, 0.07, 0.14, 0.25];

    beeps.forEach((offset, idx) => {
      const noteTime = t + offset;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx % 2 === 0 ? 800 : 1200, noteTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(volume * 0.35, noteTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.045);

      osc.connect(gain);
      gain.connect(this.#crtFilter);

      osc.start(noteTime);
      osc.stop(noteTime + 0.05);
    });
  }

  /**
   * Synthesizes dynamo hand-crank winding gear ratcheting sound.
   */
  playRadioDynamoCrank(volume = 0.3) {
    const ctx = this.#getContext();
    if (!ctx || this.#isMuted) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(420, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.32);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(volume * 0.4, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.#crtFilter);

    osc.start(t);
    osc.stop(t + 0.35);
  }
}

// Export singleton instance as default and class for custom instances
export const audioEngine = new AudioEngine();
export { AudioEngine };

