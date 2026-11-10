/**
 * Last Breath // Radio & Signal Intercept Modal View
 * Tactical analog/digital field transceiver interface with interactive tuner,
 * real-time S-meter signal strength, oscilloscope visualization, Morse demodulation,
 * emergency dynamo charging, animated auto-scanning, and sector map beacon plotting.
 */

import { el } from './dom.js';
import { t } from '../i18n/i18n.js';
import { RADIO_SIGNALS } from '../data/radioSignals.js';
import { RadioEngine, MIN_FREQUENCY, MAX_FREQUENCY, FREQUENCY_STEP } from '../modules/radio/radioEngine.js';
import { audioEngine } from '../core/audioEngine.js';

export class RadioModalView {
  #rootEl;
  #engine;
  #isOpen = false;
  #scanTimer = null;
  #lastAudioTick = 0;

  // DOM node references for in-place updates (avoids destroying DOM during slider dragging)
  #vfdDisplayEl = null;
  #vfdFreqEl = null;
  #smeterBarEl = null;
  #lockLedEl = null;
  #lockLabelEl = null;
  #signalPctEl = null;
  #sliderEl = null;
  #waveformEl = null;
  #oscStatusEl = null;
  #transcriptContainerEl = null;
  #batteryValEl = null;
  #bookmarkBtnEl = null;
  #scanBtnEl = null;
  #powerBtnEl = null;
  #presetsContainerEl = null;
  #wasLocked = false;

  constructor(rootEl, engine) {
    this.#rootEl = rootEl;
    this.#engine = engine;

    // React to store updates
    const onUpdate = () => {
      if (this.#isOpen) {
        this.#syncView(this.#engine.store.state);
      }
      this.updateHeaderBadge(this.#engine.store.state);
    };

    this.#engine.bus.on('state:changed', onUpdate);
    this.#engine.bus.on('state:replaced', onUpdate);

    this.#rootEl.addEventListener('click', (e) => {
      if (e.target === this.#rootEl) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.#isOpen) {
        this.close();
      }
    });
  }

  get isOpen() {
    return this.#isOpen;
  }

  render(state) {
    const s = state || this.#engine.store.state;
    if (this.#isOpen) {
      this.#syncView(s);
    }
    this.updateHeaderBadge(s);
  }

  open() {
    this.#isOpen = true;
    this.#rootEl.hidden = false;
    try {
      audioEngine.playTerminalBoot();
    } catch (_) {}
    this.#buildModal(this.#engine.store.state);
  }

  close() {
    this.stopAutoScan();
    this.#isOpen = false;
    this.#rootEl.hidden = true;
    this.#rootEl.replaceChildren();
  }

  updateHeaderBadge(state) {
    const badge = document.getElementById('radio-signal-badge');
    if (!badge) return;

    const hasIncoming = RadioEngine.hasUndiscoveredSignalInRange(state);
    badge.hidden = !hasIncoming;
  }

  #tune(targetFreq, playAudio = true) {
    const clamped = RadioEngine.formatFrequency(targetFreq);
    this.#engine.dispatch('radio/tune', { freq: clamped });

    if (playAudio) {
      const now = performance.now();
      if (now - this.#lastAudioTick > 90) {
        try {
          audioEngine.playRadioDialTick();
        } catch (_) {}
        this.#lastAudioTick = now;
      }
    }
  }

  startAutoScan() {
    if (this.#scanTimer) {
      this.stopAutoScan();
      return;
    }

    const state = this.#engine.store.state;
    const radioState = state.radio || RadioEngine.getInitialState();
    if (!radioState.isPowered || radioState.batteryMinutes <= 0) return;

    try {
      audioEngine.playRadioMorseChirp();
    } catch (_) {}
    if (this.#scanBtnEl) {
      this.#scanBtnEl.textContent = '⏹ STOP SCAN';
      this.#scanBtnEl.classList.add('is-scanning');
    }
    if (this.#oscStatusEl) {
      this.#oscStatusEl.textContent = 'AUTO-SCANNING WAVELENGTHS... [PRESS SCAN TO STOP]';
    }

    this.#scanTimer = setInterval(() => {
      const current = this.#engine.store.state.radio?.activeFrequency || MIN_FREQUENCY;
      let next = Math.round((current + 0.2) * 10) / 10;
      if (next > MAX_FREQUENCY) next = MIN_FREQUENCY;

      this.#tune(next, false);
      try {
        audioEngine.playRadioDialTick(0.12);
      } catch (_) {}

      const rec = RadioEngine.getActiveReception(this.#engine.store.state);
      if (rec.isLocked) {
        this.stopAutoScan();
        try {
          audioEngine.playRadioMorseChirp();
        } catch (_) {}
      }
    }, 60);
  }

  stopAutoScan() {
    if (this.#scanTimer) {
      clearInterval(this.#scanTimer);
      this.#scanTimer = null;
    }
    if (this.#scanBtnEl) {
      this.#scanBtnEl.textContent = '⚡ AUTO-SCAN';
      this.#scanBtnEl.classList.remove('is-scanning');
    }
  }

  #buildModal(state) {
    const radioState = state.radio || RadioEngine.getInitialState();
    const isPowered = Boolean(radioState.isPowered && radioState.batteryMinutes > 0);

    // Create persistent reactive elements
    this.#vfdFreqEl = el('span', { class: 'vfd-frequency' }, radioState.activeFrequency.toFixed(1));
    this.#batteryValEl = el(
      'strong',
      { class: radioState.batteryMinutes > 30 ? 'tone-good' : 'tone-bad' },
      `${radioState.batteryMinutes}m`
    );
    this.#lockLedEl = el('span', { class: 'lock-led' }, '●');
    this.#lockLabelEl = el('span', {}, t('radio.ui.scanning_carrier'));
    this.#signalPctEl = el('strong', {}, '0%');

    this.#smeterBarEl = el(
      'div',
      { class: 'radio-smeter-bar' },
      ...Array.from({ length: 12 }).map(() => el('span', { class: 'smeter-segment' }))
    );

    this.#waveformEl = el('div', { class: 'oscilloscope-waveform is-noise-wave' });
    this.#oscStatusEl = el(
      'div',
      { class: 'oscilloscope-status-line' },
      'AUDIO DEMODULATOR: CARRIER NOISE / SQUELCH ACTIVE'
    );

    this.#transcriptContainerEl = el('div', { class: 'radio-transcript-panel' });

    // Slider
    this.#sliderEl = el('input', {
      type: 'range',
      class: 'radio-freq-slider',
      min: MIN_FREQUENCY,
      max: MAX_FREQUENCY,
      step: FREQUENCY_STEP,
      value: radioState.activeFrequency,
      oninput: (e) => {
        const val = parseFloat(e.target.value);
        this.#tune(val, true);
      },
    });

    this.#bookmarkBtnEl = el(
      'button',
      {
        type: 'button',
        class: 'btn btn-ghost btn-sm btn-fkey',
        onclick: () => this.#engine.dispatch('radio/toggleBookmark', { freq: this.#engine.store.state.radio.activeFrequency }),
      },
      '☆ SAVE'
    );

    const card = el(
      'div',
      { class: 'modal-card radio-modal-card' },

      // Header Bar
      el(
        'div',
        { class: 'radio-header-bar' },
        el(
          'div',
          { class: 'radio-title-cluster' },
          el('span', { class: 'radio-glyph' }, '📻'),
          el(
            'div',
            {},
            el('h2', { class: 'radio-title' }, t('radio.ui.title')),
            el(
              'div',
              { class: 'radio-model-tag' },
              'AN/PRC-117F FIELD TRANSCEIVER // VHF/FM MULTI-BAND'
            )
          )
        ),
        el(
          'div',
          { class: 'radio-header-controls' },
          (this.#powerBtnEl = el(
            'button',
            {
              type: 'button',
              class: `btn btn-xs ${isPowered ? 'btn-accent' : 'btn-ghost'}`,
              onclick: () => this.#engine.dispatch('radio/togglePower'),
            },
            isPowered ? `🟢 ${t('radio.ui.pwr_on')}` : `🔴 ${t('radio.ui.pwr_off')}`
          )),
          el(
            'button',
            {
              type: 'button',
              class: 'btn-modal-close',
              'aria-label': 'Close',
              onclick: () => this.close(),
            },
            '✕'
          )
        )
      ),

      // Transceiver Body
      el(
        'div',
        { class: 'radio-terminal-body' },

        // Telemetry Row: Battery + Carrier Lock + Signal Strength
        el(
          'div',
          { class: 'radio-telemetry-row' },
          el(
            'div',
            { class: 'radio-battery-pill' },
            el('span', { class: 'pill-key' }, '⚡ BATT:'),
            this.#batteryValEl
          ),
          el(
            'div',
            { class: 'radio-lock-badge' },
            this.#lockLedEl,
            this.#lockLabelEl
          ),
          el(
            'div',
            { class: 'radio-smeter-pill' },
            el('span', { class: 'pill-key' }, 'SIGNAL:'),
            this.#signalPctEl
          )
        ),

        // VFD Frequency Display & Analog S-Meter
        (this.#vfdDisplayEl = el(
          'div',
          { class: 'radio-vfd-display' },
          el(
            'div',
            { class: 'vfd-digits-row' },
            this.#vfdFreqEl,
            el('span', { class: 'vfd-unit' }, 'MHz FM')
          ),
          this.#smeterBarEl
        )),

        // Analog Frequency Scale Marks (88 to 108 MHz)
        el(
          'div',
          { class: 'radio-dial-scale' },
          el('span', {}, '88'),
          el('span', {}, '92'),
          el('span', {}, '96'),
          el('span', {}, '100'),
          el('span', {}, '104'),
          el('span', {}, '108')
        ),

        // Tuning Control Dial & Steppers
        el(
          'div',
          { class: 'radio-tuning-controls' },
          el(
            'div',
            { class: 'tuning-steppers' },
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost btn-sm',
                onclick: () => this.#tune(this.#sliderEl.value - 1.0),
              },
              '« -1.0'
            ),
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost btn-sm',
                onclick: () => this.#tune(this.#sliderEl.value - FREQUENCY_STEP),
              },
              '‹ -0.1'
            )
          ),
          el(
            'div',
            { class: 'tuning-slider-wrapper' },
            this.#sliderEl
          ),
          el(
            'div',
            { class: 'tuning-steppers' },
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost btn-sm',
                onclick: () => this.#tune(parseFloat(this.#sliderEl.value) + FREQUENCY_STEP),
              },
              '+0.1 ›'
            ),
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost btn-sm',
                onclick: () => this.#tune(parseFloat(this.#sliderEl.value) + 1.0),
              },
              '+1.0 »'
            )
          )
        ),

        // Function Key Row: Auto-Scan, Dynamo Crank, Bookmark, SOS
        el(
          'div',
          { class: 'radio-function-row' },
          (this.#scanBtnEl = el(
            'button',
            {
              type: 'button',
              class: 'btn btn-ghost btn-sm btn-fkey',
              onclick: () => this.startAutoScan(),
            },
            '⚡ AUTO-SCAN'
          )),
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-ghost btn-sm btn-fkey',
              onclick: () => this.#engine.dispatch('radio/crank'),
            },
            '🔋 CRANK (+45m)'
          ),
          this.#bookmarkBtnEl,
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-ghost btn-sm btn-fkey btn-sos',
              onclick: () => {
                if (confirm(t('radio.ui.confirm_sos'))) {
                  this.#engine.dispatch('radio/broadcastSOS');
                }
              },
            },
            '🆘 BROADCAST SOS'
          )
        ),

        // Oscilloscope Screen
        el(
          'div',
          { class: 'radio-oscilloscope-box' },
          el('div', { class: 'oscilloscope-grid' }),
          this.#waveformEl,
          this.#oscStatusEl
        ),

        // Transcript / Decoded Teletype Box
        this.#transcriptContainerEl,

        // Bookmarks / Presets Chips
        el(
          'div',
          { class: 'radio-presets-row' },
          el('span', { class: 'presets-label' }, `${t('radio.ui.presets')}:`),
          (this.#presetsContainerEl = el(
            'div',
            { class: 'presets-chips' },
            ...RADIO_SIGNALS.map((sig) => {
              const isCurrent = Math.abs(sig.frequency - radioState.activeFrequency) < 0.08;
              return el(
                'button',
                {
                  type: 'button',
                  class: `preset-chip ${isCurrent ? 'is-active' : ''}`,
                  'data-freq': sig.frequency,
                  onclick: () => this.#tune(sig.frequency),
                },
                `📡 ${sig.frequency.toFixed(1)} MHz`
              );
            })
          ))
        )
      )
    );

    this.#rootEl.replaceChildren(card);
    this.#syncView(state);
  }

  /**
   * Smoothly synchronizes reactive telemetry values in-place without touching the slider DOM element!
   */
  #syncView(state) {
    if (!this.#isOpen || !this.#vfdFreqEl) return;

    const radioState = state.radio || RadioEngine.getInitialState();
    const reception = RadioEngine.getActiveReception(state);
    const { currentFreq, bestMatch, primaryQuality, isLocked, isPowered, batteryMinutes } = reception;

    // 1. Frequency VFD & Power
    if (this.#vfdDisplayEl) {
      this.#vfdDisplayEl.classList.toggle('is-power-off', !isPowered);
    }
    this.#vfdFreqEl.textContent = isPowered ? currentFreq.toFixed(1) : '---.-';

    if (this.#sliderEl) {
      this.#sliderEl.disabled = !isPowered;
      if (Math.abs(parseFloat(this.#sliderEl.value) - currentFreq) > 0.05) {
        this.#sliderEl.value = currentFreq;
      }
    }

    // 2. Power Button
    if (this.#powerBtnEl) {
      this.#powerBtnEl.className = `btn btn-xs ${isPowered ? 'btn-accent' : 'btn-ghost'}`;
      this.#powerBtnEl.textContent = isPowered ? `🟢 ${t('radio.ui.pwr_on')}` : `🔴 ${t('radio.ui.pwr_off')}`;
    }

    if (this.#scanBtnEl) {
      this.#scanBtnEl.disabled = !isPowered;
    }

    // 3. Battery
    if (this.#batteryValEl) {
      this.#batteryValEl.textContent = `${batteryMinutes}m`;
      this.#batteryValEl.className = batteryMinutes > 30 ? 'tone-good' : 'tone-bad';
    }

    // 4. S-Meter Segments
    if (this.#smeterBarEl) {
      const activeCount = isPowered ? Math.round(primaryQuality * 12) : 0;
      Array.from(this.#smeterBarEl.children).forEach((seg, idx) => {
        seg.className = `smeter-segment ${idx < activeCount ? 'is-active' : ''} ${idx >= 9 ? 'is-warn' : ''}`;
      });
    }

    // 5. Lock LED & Status
    if (this.#lockLedEl) {
      this.#lockLedEl.className = `lock-led ${isLocked && isPowered ? 'is-active' : ''}`;
    }
    if (this.#lockLabelEl) {
      this.#lockLabelEl.textContent = !isPowered
        ? t('radio.ui.pwr_off')
        : isLocked
          ? t('radio.ui.carrier_lock')
          : t('radio.ui.scanning_carrier');
    }
    if (this.#signalPctEl) {
      this.#signalPctEl.textContent = isPowered ? `${Math.round(primaryQuality * 100)}%` : '0%';
    }

    // Audio cue on lock acquisition
    if (isLocked && !this.#wasLocked && isPowered && !this.#scanTimer) {
      try {
        audioEngine.playRadioMorseChirp();
      } catch (_) {}
    }
    this.#wasLocked = Boolean(isLocked && isPowered);

    // 6. Bookmark button state
    if (this.#bookmarkBtnEl) {
      const isBookmarked = radioState.bookmarks?.includes(currentFreq);
      this.#bookmarkBtnEl.textContent = isBookmarked ? '★ SAVED' : '☆ SAVE';
      this.#bookmarkBtnEl.classList.toggle('is-bookmarked', Boolean(isBookmarked));
      this.#bookmarkBtnEl.disabled = !isPowered;
    }

    // 7. Oscilloscope
    if (this.#waveformEl) {
      this.#waveformEl.className = `oscilloscope-waveform ${!isPowered ? 'is-off' : isLocked ? 'is-locked-wave' : 'is-noise-wave'}`;
    }
    if (this.#oscStatusEl) {
      if (!this.#scanTimer) {
        this.#oscStatusEl.textContent = !isPowered
          ? 'TRANSCEIVER STANDBY // DC POWER OFF'
          : isLocked
            ? `AUDIO DEMODULATOR: LOCKED ONTO [${t(bestMatch.signal.nameKey)}]`
            : 'AUDIO DEMODULATOR: CARRIER NOISE / SQUELCH ACTIVE';
      }
    }

    // 8. Preset Chips Active State
    if (this.#presetsContainerEl) {
      Array.from(this.#presetsContainerEl.children).forEach((chip) => {
        const chipFreq = parseFloat(chip.dataset.freq);
        chip.classList.toggle('is-active', Math.abs(chipFreq - currentFreq) < 0.08);
      });
    }

    // 9. Transcript box content
    if (this.#transcriptContainerEl) {
      this.#renderTranscript(this.#transcriptContainerEl, reception);
    }
  }

  #renderTranscript(container, reception) {
    const { bestMatch, primaryQuality, isPowered } = reception;

    if (!isPowered) {
      container.replaceChildren(
        el(
          'div',
          { class: 'transcript-empty-state tone-warn' },
          `⚡ ${t('radio.ui.no_power_msg')}`
        )
      );
      return;
    }

    if (!bestMatch || primaryQuality < 0.15) {
      container.replaceChildren(
        el(
          'div',
          { class: 'transcript-empty-state' },
          el('div', { class: 'static-text' }, '· · · [STATIC HISS // NO CARRIER DETECTED] · · ·'),
          el('p', { class: 'muted-note' }, t('radio.ui.tuning_hint'))
        )
      );
      return;
    }

    const { signal, isDecoded, quality, distanceKm } = bestMatch;

    const transcriptCard = el(
      'div',
      { class: 'transcript-active-card' },
      el(
        'div',
        { class: 'transcript-header' },
        el('strong', { class: 'transcript-caller' }, t(signal.callerKey)),
        el('span', { class: 'transcript-distance' }, `~${distanceKm} km`),
        el('span', { class: `badge ${signal.type}` }, signal.type.toUpperCase())
      ),
      el('h4', { class: 'transcript-title' }, t(signal.nameKey)),
      el(
        'div',
        { class: 'transcript-body' },
        quality >= 0.65
          ? t(signal.transcriptKey)
          : this.#garbleTranscript(t(signal.transcriptKey), quality)
      ),
      el(
        'div',
        { class: 'transcript-actions' },
        isDecoded
          ? el('span', { class: 'decoded-pill tone-good' }, `✔ ${t('radio.ui.decoded_plotted')}`)
          : el(
              'button',
              {
                type: 'button',
                class: 'btn btn-accent btn-sm',
                onclick: () => this.#engine.dispatch('radio/decode', { signalId: signal.id }),
              },
              `🛰️ ${t('radio.ui.decode_and_plot')}`
            )
      )
    );

    container.replaceChildren(transcriptCard);
  }

  #garbleTranscript(fullText, quality) {
    return fullText
      .split(' ')
      .map((word) => (Math.random() > quality ? '···' : word))
      .join(' ');
  }
}
