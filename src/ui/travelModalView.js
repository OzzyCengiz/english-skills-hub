/**
 * Last Breath // Travel & Sector Arrival Modal View
 * Cinematic transit overlay displaying real-time movement counter, animated progress track,
 * atmospheric en-route telemetry, and evocative city arrival lore upon reaching any sector.
 */

import { el } from './dom.js';
import { t, i18n } from '../i18n/i18n.js';
import { getNode } from '../modules/map/mapGraph.js';
import { getLocationStory } from '../data/locationStories.js';
import { VEHICLE_CATALOG } from '../modules/vehicles/vehicleEngine.js';
import { audioEngine } from '../core/audioEngine.js';

export class TravelModalView {
  #rootEl;
  #engine;
  #isOpen = false;
  #animTimer = null;
  #journeyData = null;
  #queuedVehicleDiscovery = null;

  constructor(rootEl, engine) {
    this.#rootEl = rootEl;
    this.#engine = engine;

    // Listen to travel journey events from the map engine
    this.#engine.bus.on('travel:journey', (data) => {
      this.startJourney(data);
    });

    // Close on backdrop click (only in arrival stage)
    this.#rootEl.addEventListener('click', (e) => {
      if (e.target === this.#rootEl && this.#journeyData?.stage === 'arrival') {
        this.close();
      }
    });

    // Keyboard support: Escape or Enter closes when arrived, or skips transit
    window.addEventListener('keydown', (e) => {
      if (!this.#isOpen) return;
      if (e.key === 'Escape' || e.key === 'Enter') {
        if (this.#journeyData?.stage === 'arrival') {
          this.close();
        } else if (this.#journeyData?.stage === 'transit') {
          this.skipTransit();
        }
      }
    });
  }

  get isOpen() {
    return this.#isOpen;
  }

  /**
   * Initializes and starts a travel transit animation sequence.
   */
  startJourney({ fromId, toId, plan, result, skipAnimation = false }) {
    this.#stopTimer();
    this.#isOpen = true;
    this.#rootEl.hidden = false;

    const fromNode = getNode(fromId) || { id: fromId, country: '' };
    const toNode = getNode(toId) || { id: toId, country: '' };
    const vehicleId = plan.isDriving ? plan.vehicleId : null;
    const vehicleDef = vehicleId ? VEHICLE_CATALOG[vehicleId] : null;

    this.#journeyData = {
      stage: 'transit',
      fromId,
      toId,
      fromNode,
      toNode,
      plan,
      result,
      vehicleDef,
      progress: 0,
      distanceRemaining: plan.km || 100,
      totalKm: plan.km || 100,
      totalMinutes: plan.minutes || 120,
      isInterrupted: Boolean(result?.interrupted),
      interruptProgress: result?.interrupted
        ? Math.max(30, Math.min(85, Math.round(((result.segmentsTraveled || 1) / Math.max(1, result.totalSegments || 2)) * 100)))
        : 100,
    };

    // Play starting travel sound
    try {
      if (plan.isDriving) {
        audioEngine.playEngineRev();
      } else {
        audioEngine.playGearRustle();
      }
    } catch (_) {}

    if (skipAnimation) {
      this.skipTransit();
      return;
    }

    this.#renderTransit();
    this.#runTransitAnimation();
  }

  #stopTimer() {
    if (this.#animTimer) {
      clearInterval(this.#animTimer);
      this.#animTimer = null;
    }
  }

  #runTransitAnimation() {
    this.#stopTimer();
    const startTime = performance.now();
    const duration = 2400; // 2.4s pleasant and snappy countdown animation
    const targetProgress = this.#journeyData.isInterrupted
      ? this.#journeyData.interruptProgress
      : 100;

    let lastTickPct = 0;

    this.#animTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // Ease out quad
      const eased = ratio * (2 - ratio);
      const currentPct = Math.round(eased * targetProgress);

      this.#journeyData.progress = currentPct;
      this.#journeyData.distanceRemaining = Math.max(
        0,
        Math.round(this.#journeyData.totalKm * (1 - currentPct / 100))
      );

      // Audio feedback on every 25% progression
      if (currentPct - lastTickPct >= 25) {
        lastTickPct = currentPct;
        try {
          audioEngine.playTerminalClick(1.2, 0.2);
        } catch (_) {}
      }

      this.#updateTransitDynamicElements();

      if (ratio >= 1) {
        this.#stopTimer();
        if (this.#journeyData.isInterrupted) {
          this.#triggerEncounterAmbush();
        } else {
          this.#transitionToArrival();
        }
      }
    }, 40);
  }

  /**
   * Fast-forwards / skips transit animation immediately.
   */
  skipTransit() {
    this.#stopTimer();
    if (!this.#journeyData) return;

    if (this.#journeyData.isInterrupted) {
      this.#journeyData.progress = this.#journeyData.interruptProgress;
      this.#journeyData.distanceRemaining = Math.round(
        this.#journeyData.totalKm * (1 - this.#journeyData.interruptProgress / 100)
      );
      this.#triggerEncounterAmbush();
    } else {
      this.#journeyData.progress = 100;
      this.#journeyData.distanceRemaining = 0;
      this.#transitionToArrival();
    }
  }

  #triggerEncounterAmbush() {
    const card = this.#rootEl.querySelector('.travel-modal-card');
    if (card) {
      card.classList.add('is-ambushed');
    }

    try {
      audioEngine.playWarningAlarm();
    } catch (_) {}

    const telemetryLog = this.#rootEl.querySelector('#travel-telemetry-status');
    if (telemetryLog) {
      telemetryLog.className = 'travel-telemetry-log tone-bad';
      telemetryLog.textContent = t('travel.log.ambush_alert') || '⚠️ DİKKAT: YOLDA PUSUYA DÜŞÜRÜLDÜNÜZ! SİLAHLI TEHDİT TESPİT EDİLDİ!';
    }

    setTimeout(() => {
      this.close();
    }, 1200);
  }

  #transitionToArrival() {
    if (!this.#journeyData) return;
    this.#journeyData.stage = 'arrival';

    try {
      audioEngine.playAchievementChime();
    } catch (_) {}

    this.#renderArrival();
  }

  close() {
    this.#stopTimer();
    this.#isOpen = false;
    this.#rootEl.hidden = true;
    this.#rootEl.replaceChildren();

    // If an encounter or queued derelict vehicle discovery was waiting, let it surface now
    if (this.#queuedVehicleDiscovery) {
      const v = this.#queuedVehicleDiscovery;
      this.#queuedVehicleDiscovery = null;
      this.#engine.bus.emit('vehicles:discovered', v);
    }

    this.#journeyData = null;
  }

  render() {
    if (!this.#isOpen || !this.#journeyData) return;
    if (this.#journeyData.stage === 'transit') {
      this.#updateTransitDynamicElements();
    }
  }

  // ==========================================
  // TRANSIT VIEW (Movement, Progress & Counter)
  // ==========================================
  #renderTransit() {
    const { fromId, toId, fromNode, toNode, plan, vehicleDef } = this.#journeyData;
    const isTr = i18n.locale === 'tr';

    const fromName = t(`location.${fromId}`) || fromId;
    const toName = t(`location.${toId}`) || toId;

    const modeIcon = plan.isDriving ? '🚙' : '🚶';
    const modeLabel = plan.isDriving
      ? (vehicleDef ? (isTr ? vehicleDef.name_tr || vehicleDef.nameKey : vehicleDef.name_en || vehicleDef.nameKey) : 'MOTORLU ARAÇ')
      : (isTr ? 'Yaya İntikali' : 'Foot Traverse');

    const card = el(
      'div',
      { class: 'modal-card travel-modal-card travel-transit-card' },

      // Header Bar
      el(
        'div',
        { class: 'travel-header-bar' },
        el(
          'div',
          { class: 'travel-title-cluster' },
          el('span', { class: 'travel-glyph' }, '🧭'),
          el(
            'div',
            {},
            el('h2', { class: 'travel-title' }, isTr ? 'SEKTÖR İNTİKALİ' : 'SECTOR TRANSIT'),
            el(
              'div',
              { class: 'travel-subtag' },
              `${fromName.toUpperCase()} ➔ ${toName.toUpperCase()} // ${plan.km} KM`
            )
          )
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-xs btn-ghost btn-travel-skip',
            onclick: () => this.skipTransit(),
          },
          isTr ? '⏩ HIZLANDIR' : '⏩ SKIP'
        )
      ),

      // Transit Body
      el(
        'div',
        { class: 'travel-body' },

        // Mode and Journey Stats
        el(
          'div',
          { class: 'travel-stats-strip' },
          el(
            'div',
            { class: 'travel-stat-pill' },
            el('span', { class: 'pill-key' }, isTr ? 'MOD:' : 'MODE:'),
            el('strong', {}, `${modeIcon} ${modeLabel}`)
          ),
          el(
            'div',
            { class: 'travel-stat-pill' },
            el('span', { class: 'pill-key' }, isTr ? 'TOPLAM YOL:' : 'DISTANCE:'),
            el('strong', {}, `${plan.km} km`)
          ),
          el(
            'div',
            { class: 'travel-stat-pill' },
            el('span', { class: 'pill-key' }, isTr ? 'SÜRE:' : 'EST. TIME:'),
            el('strong', {}, this.#formatMinutes(plan.minutes))
          )
        ),

        // Visual Roadmap Progress Bar with Moving Traveler Icon
        el(
          'div',
          { class: 'travel-route-visualizer' },
          el(
            'div',
            { class: 'route-node-pill origin' },
            el('span', { class: 'node-dot' }, '●'),
            el('span', { class: 'node-label' }, fromName)
          ),
          el(
            'div',
            { class: 'route-track-wrapper' },
            el('div', { class: 'route-track-line' }),
            el('div', { id: 'travel-track-fill', class: 'route-track-fill', style: 'width: 0%;' }),
            el(
              'div',
              { id: 'travel-mover-marker', class: 'route-mover-marker', style: 'left: 0%;' },
              el('span', { class: 'mover-icon' }, modeIcon)
            )
          ),
          el(
            'div',
            { class: 'route-node-pill destination' },
            el('span', { class: 'node-dot' }, '📍'),
            el('span', { class: 'node-label' }, toName)
          )
        ),

        // Live Countdown Telemetry Counters
        el(
          'div',
          { class: 'travel-countdown-cluster' },
          el(
            'div',
            { class: 'countdown-box' },
            el('span', { class: 'countdown-key' }, isTr ? 'KALAN MESAFE' : 'REMAINING DISTANCE'),
            el('div', { id: 'travel-km-counter', class: 'countdown-val vfd-glow' }, `${plan.km} km`)
          ),
          el(
            'div',
            { class: 'countdown-box' },
            el('span', { class: 'countdown-key' }, isTr ? 'İNTİKAL İLERLEMESİ' : 'TRANSIT PROGRESS'),
            el('div', { id: 'travel-pct-counter', class: 'countdown-val vfd-glow' }, '0%')
          )
        ),

        // Atmospheric Teletype Telemetry Line
        el(
          'div',
          { class: 'travel-telemetry-box' },
          el('span', { class: 'telemetry-header' }, 'TRANSIT TELEMETRY // GPS RELAY:'),
          el(
            'div',
            { id: 'travel-telemetry-status', class: 'travel-telemetry-log' },
            isTr
              ? 'Çıkış koordinatları terk edildi. Çorak otoyol hattına intikal başladı...'
              : 'Departure coordinates cleared. Entering wasteland thoroughfare...'
          )
        )
      )
    );

    this.#rootEl.replaceChildren(card);
  }

  #updateTransitDynamicElements() {
    const { progress, distanceRemaining, totalKm } = this.#journeyData;
    const isTr = i18n.locale === 'tr';

    const trackFill = this.#rootEl.querySelector('#travel-track-fill');
    const mover = this.#rootEl.querySelector('#travel-mover-marker');
    const kmCounter = this.#rootEl.querySelector('#travel-km-counter');
    const pctCounter = this.#rootEl.querySelector('#travel-pct-counter');
    const telemetry = this.#rootEl.querySelector('#travel-telemetry-status');

    if (trackFill) trackFill.style.width = `${progress}%`;
    if (mover) mover.style.left = `${progress}%`;
    if (kmCounter) kmCounter.textContent = `${distanceRemaining} km`;
    if (pctCounter) pctCounter.textContent = `${progress}%`;

    if (telemetry) {
      if (progress < 25) {
        telemetry.textContent = isTr
          ? 'Bölge çıkışı geride bırakıldı. Çorak otoyol hattına intikal ediliyor...'
          : 'Origin perimeter left behind. Navigating wasteland highway corridor...';
      } else if (progress < 50) {
        telemetry.textContent = isTr
          ? 'Hız sabitlendi. Çevre radyasyon ve hava koşulları izleniyor...'
          : 'Velocity steady. Radiation attenuation and weather fronts nominal...';
      } else if (progress < 75) {
        telemetry.textContent = isTr
          ? 'Yarı yol aşıldı. Terk edilmiş askeri barikatlar ve viyadükler geride kalıyor...'
          : 'Halfway waypoint cleared. Bypassing rusted military checkpoints and broken viaducts...';
      } else if (progress < 100) {
        telemetry.textContent = isTr
          ? 'Hedef sektörün silüeti ufukta belirdi. İniş protokolü hazırlanıyor...'
          : 'Target sector skyline spotted on horizon. Preparing arrival protocol...';
      } else {
        telemetry.textContent = isTr
          ? 'Hedefe ulaşıldı! Sektör sınır kapıları açılıyor...'
          : 'Target sector reached! Engaging perimeter hatch...';
      }
    }
  }

  // ==========================================
  // ARRIVAL VIEW (Sector Story & Lore Briefing)
  // ==========================================
  #renderArrival() {
    const { toId, toNode, result, plan } = this.#journeyData;
    const isTr = i18n.locale === 'tr';

    const cityName = t(`location.${toId}`) || toId;
    const storyData = getLocationStory(toId, i18n.locale, toNode);
    const dangerCount = toNode.danger || 2;
    const dangerPills = '▲'.repeat(dangerCount);

    const card = el(
      'div',
      { class: 'modal-card travel-modal-card travel-arrival-card' },

      // Header Bar
      el(
        'div',
        { class: 'travel-header-bar arrival-header' },
        el(
          'div',
          { class: 'travel-title-cluster' },
          el('span', { class: 'travel-glyph arrival-glyph' }, '📍'),
          el(
            'div',
            {},
            el(
              'h2',
              { class: 'travel-title' },
              isTr ? `${cityName.toUpperCase()} SEKTÖRÜNE ULAŞILDI` : `ARRIVED AT ${cityName.toUpperCase()}`
            ),
            el('div', { class: 'travel-subtag' }, storyData.subtitle)
          )
        ),
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
      ),

      // Scrollable Arrival Content
      el(
        'div',
        { class: 'travel-body travel-arrival-body' },

        // Sector Badges
        el(
          'div',
          { class: 'travel-arrival-badges' },
          el(
            'span',
            { class: 'arrival-badge' },
            `🌍 ${toNode.country || (isTr ? 'Bölge' : 'Region')}`
          ),
          el(
            'span',
            { class: 'arrival-badge' },
            `🏛️ ${toNode.biome ? toNode.biome.toUpperCase() : 'URBAN'}`
          ),
          el(
            'span',
            { class: `arrival-badge danger-${dangerCount}` },
            `${isTr ? 'TEHDİT:' : 'THREAT:'} ${dangerPills}`
          ),
          result?.firstVisit
            ? el(
                'span',
                { class: 'arrival-badge first-visit' },
                isTr ? '🌟 İLK KEŞİF (+8 XP)' : '🌟 FIRST VISIT (+8 XP)'
              )
            : null
        ),

        // The City Story Narrative Card
        el(
          'div',
          { class: 'arrival-story-card' },
          el(
            'div',
            { class: 'story-header' },
            el('span', { class: 'story-kicker' }, isTr ? 'SEKTÖR İSTİHBARATI & GÜNLÜK' : 'SECTOR LORE & INTEL'),
            el('span', { class: 'story-tag' }, storyData.tag)
          ),
          el('p', { class: 'story-paragraph' }, storyData.story),
          storyData.landmarks
            ? el(
                'div',
                { class: 'story-landmarks-row' },
                el('span', { class: 'landmarks-label' }, isTr ? 'Önemli Kalıntılar:' : 'Key Landmarks:'),
                el('span', { class: 'landmarks-val' }, storyData.landmarks)
              )
            : null
        ),

        // Field Scavenging & Activity Tips
        el(
          'div',
          { class: 'arrival-tips-box' },
          el('span', { class: 'tip-icon' }, '💡'),
          el(
            'p',
            { class: 'tip-text' },
            isTr
              ? `${cityName} bölgesinde erzak ve hurda aramak için harita panelinden [BÖLGEYİ YAĞMALA], diğer rotalara seyahat etmek için komşu şehirleri seçebilirsiniz.`
              : `To search for provisions in ${cityName}, use [SCAVENGE SECTOR] on the map panel, or chart routes to neighboring outposts.`
          )
        ),

        // Action Confirmation Button
        el(
          'div',
          { class: 'arrival-actions-row' },
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-accent btn-block btn-enter-sector',
              onclick: () => this.close(),
            },
            isTr ? `🚪 ${cityName.toUpperCase()} SEKTÖRÜNE GİRİŞ YAP` : `🚪 ENTER ${cityName.toUpperCase()} SECTOR`
          )
        )
      )
    );

    this.#rootEl.replaceChildren(card);
  }

  #formatMinutes(mins) {
    if (!mins || mins <= 0) return '0dk';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}dk`;
    return m > 0 ? `${h}s ${m}dk` : `${h} saat`;
  }
}

