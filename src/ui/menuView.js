import { formatClock, readClock } from '../core/clock.js';
import { ARCHETYPES, STARTING_LOCATIONS } from '../data/archetypes.js';
import { BLOOD_TYPES, TRAITS, getAgeBracket, getRandomName } from '../data/traits.js';
import { i18n, t } from '../i18n/i18n.js';
import { getNode } from '../modules/map/mapGraph.js';
import { adManager } from '../core/adManager.js';
import { el } from './dom.js';

export class MenuView {
  #root;
  #onContinue;
  #onStartNew;
  #onLocaleChange;
  #saveManager;
  #pwaManager;
  #onLoadSlot;
  #onSaveSlot;
  #onDeleteSlot;
  #onResetAll;
  #onOpenCodex;

  #name = 'Mara';
  #age = 28;
  #bloodType = 'A+';
  #selectedTrait = 'stoic';
  #selectedArchetype = 'scavenger';
  #selectedLocation = 'istanbul';
  #hasSave = false;
  #savedState = null;

  #mode = 'menu'; // 'menu' | 'create' | 'load_game' | 'settings' | 'exit_confirm' | 'terminated'
  #currentStep = 1; // 1: Identity, 2: Archetype, 3: Sector, 4: Summary
  #lastRenderedStep = 1;
  #lastRenderedMode = 'menu';
  #isPremiumModalOpen = false;
  #slotActionFeedback = '';

  constructor({
    root,
    onContinue,
    onStartNew,
    onLocaleChange,
    saveManager,
    pwaManager,
    onLoadSlot,
    onSaveSlot,
    onDeleteSlot,
    onResetAll,
    onOpenCodex,
  }) {
    this.#root = root;
    this.#onContinue = onContinue;
    this.#onStartNew = onStartNew;
    this.#onLocaleChange = onLocaleChange;
    this.#saveManager = saveManager;
    this.#pwaManager = pwaManager;
    this.#onLoadSlot = onLoadSlot;
    this.#onSaveSlot = onSaveSlot;
    this.#onDeleteSlot = onDeleteSlot;
    this.#onResetAll = onResetAll;
    this.#onOpenCodex = onOpenCodex;
  }

  get isOpen() {
    return !this.#root.hidden;
  }

  open({ hasSave, state, mode } = {}) {
    this.#hasSave = Boolean(hasSave && state?.player?.alive);
    this.#savedState = state;
    this.#mode = mode || 'menu';
    this.#currentStep = 1;
    this.#isPremiumModalOpen = false;
    this.#slotActionFeedback = '';
    this.#root.hidden = false;
    document.body?.classList.add('is-menu-open');
    this.render();
  }

  close() {
    this.#root.hidden = true;
    document.body?.classList.remove('is-menu-open');
  }

  render() {
    if (this.#root.hidden) return;

    const prevBody = this.#root.querySelector('.menu-body');
    const prevScrollTop = prevBody ? prevBody.scrollTop : 0;
    const isSameStepAndMode = this.#lastRenderedMode === this.#mode && this.#lastRenderedStep === this.#currentStep;

    const localeBtn = el(
      'button',
      {
        type: 'button',
        class: 'menu-locale-toggle-btn',
        title: i18n.locale === 'tr' ? 'Switch to English' : 'Türkçe Dilini Seç',
        onClick: () => {
          const nextLocale = i18n.locale === 'tr' ? 'en' : 'tr';
          this.#onLocaleChange(nextLocale);
        },
      },
      el('span', { class: 'menu-locale-icon' }, '🌐'),
      el('span', { class: 'menu-locale-code' }, (i18n.locale || 'en').toUpperCase()),
    );

    const isCreate = this.#mode === 'create';
    const isLoadGame = this.#mode === 'load_game';
    const isSettings = this.#mode === 'settings';
    const isExitConfirm = this.#mode === 'exit_confirm';
    const isTerminated = this.#mode === 'terminated';

    let signalLabel = t('menu.kicker');
    if (isCreate) signalLabel = t('character.create_title');
    else if (isLoadGame) signalLabel = t('menu.slots.title');
    else if (isSettings) signalLabel = t('menu.settings.title');
    else if (isExitConfirm || isTerminated) signalLabel = t('menu.exit.title');

    let loreText = t('menu.lore');
    if (isCreate) loreText = t(`character.step_subtitle.${this.#currentStep}`);
    else if (isLoadGame) loreText = t('menu.slots.subtitle');
    else if (isSettings) loreText = t('menu.settings.subtitle');
    else if (isExitConfirm) loreText = t('menu.exit.desc');

    const header = el(
      'header',
      { class: 'menu-header' },
      el(
        'div',
        { class: 'menu-top-line' },
        el(
          'div',
          { class: 'menu-signal-line' },
          el('span', { class: 'signal-dot' }),
          el('span', { class: 'menu-signal-label' }, signalLabel),
        ),
        localeBtn,
      ),
      el('h1', { class: 'menu-title' }, t('app.title')),
      el('p', { class: 'menu-lore' }, loreText),
    );

    let frame;

    if (isCreate) {
      const stepTabs = [
        { step: 1, key: 'character.steps.identity', glyph: '🆔' },
        { step: 2, key: 'character.steps.archetype', glyph: '🎒' },
        { step: 3, key: 'character.steps.sector', glyph: '📍' },
        { step: 4, key: 'character.steps.summary', glyph: '📋' },
      ].map(({ step, key, glyph }) => {
        const isActive = this.#currentStep === step;
        return el(
          'button',
          {
            type: 'button',
            class: ['menu-stepper-tab', isActive && 'is-active'],
            onClick: () => {
              this.#currentStep = step;
              this.render();
            },
          },
          el('span', { class: 'stepper-tab-glyph' }, glyph),
          el('span', { class: 'stepper-tab-label' }, t(key)),
        );
      });

      const stepperBar = el('div', { class: 'menu-stepper-bar' }, stepTabs);
      const stepBody = this.#renderActiveStep();
      const navBar = this.#renderStepNavBar();

      frame = el(
        'div',
        { class: 'menu-frame' },
        header,
        stepperBar,
        el('div', { class: 'menu-body' }, stepBody),
        navBar,
      );
    } else if (isLoadGame) {
      frame = el(
        'div',
        { class: 'menu-frame' },
        header,
        el('div', { class: 'menu-body' }, this.#renderLoadGameScreen()),
      );
    } else if (isSettings) {
      frame = el(
        'div',
        { class: 'menu-frame' },
        header,
        el('div', { class: 'menu-body' }, this.#renderSettingsScreen()),
      );
    } else if (isExitConfirm) {
      frame = el(
        'div',
        { class: 'menu-frame' },
        header,
        el('div', { class: 'menu-body' }, this.#renderExitConfirmScreen()),
      );
    } else if (isTerminated) {
      frame = el(
        'div',
        { class: 'menu-frame is-terminated' },
        header,
        el('div', { class: 'menu-body' }, this.#renderTerminatedScreen()),
      );
    } else {
      // Main Menu ('menu')
      const bodyContent = this.#renderMainMenuScreen();
      frame = el(
        'div',
        { class: 'menu-frame' },
        header,
        el('div', { class: 'menu-body' }, bodyContent),
        el(
          'footer',
          { class: 'menu-footer' },
          el('span', { class: 'menu-footer-sub' }, t('app.subtitle')),
          el('span', { class: 'menu-footer-hint' }, t('menu.footer_hint')),
        ),
      );
    }

    // Modal overlay if premium modal is open
    if (this.#isPremiumModalOpen) {
      const modal = this.#renderPremiumModal();
      frame.appendChild(modal);
    }

    this.#root.replaceChildren(frame);
    this.#lastRenderedMode = this.#mode;
    this.#lastRenderedStep = this.#currentStep;

    if (isSameStepAndMode && prevScrollTop > 0) {
      const newBody = this.#root.querySelector('.menu-body');
      if (newBody) {
        newBody.scrollTop = prevScrollTop;
      }
    }
  }

  // =========================================================================
  // 1. MAIN MENU SCREEN (NEW GAME, LOAD GAME, SETTINGS, EXIT + ACTIVE CONTINUE)
  // =========================================================================
  #renderMainMenuScreen() {
    const sections = [];

    // If an active expedition is ongoing, offer prominent Continue option
    if (this.#hasSave && this.#savedState) {
      const continueSection = this.#renderContinueCard(this.#savedState);
      sections.push(continueSection);
    }

    // Main 4 Core Menu Buttons
    const menuActions = [
      {
        id: 'new_game',
        glyph: '✦',
        titleKey: 'menu.action.new_game_main',
        descKey: 'menu.action.desc_new_game',
        isAccent: true,
        onClick: () => {
          this.#mode = 'create';
          this.#currentStep = 1;
          this.render();
        },
      },
      {
        id: 'load_game',
        glyph: '💾',
        titleKey: 'menu.action.load_game',
        descKey: 'menu.action.desc_load_game',
        isAccent: false,
        onClick: () => {
          this.#mode = 'load_game';
          this.render();
        },
      },
      {
        id: 'codex',
        glyph: '📖',
        titleKey: 'menu.action.codex_memorial',
        descKey: 'menu.action.desc_codex_memorial',
        isAccent: false,
        onClick: () => {
          if (this.#onOpenCodex) this.#onOpenCodex();
        },
      },
      {
        id: 'settings',
        glyph: '⚙',
        titleKey: 'menu.action.settings',
        descKey: 'menu.action.desc_settings',
        isAccent: false,
        onClick: () => {
          this.#mode = 'settings';
          this.render();
        },
      },
      {
        id: 'exit',
        glyph: '⏻',
        titleKey: 'menu.action.exit',
        descKey: 'menu.action.desc_exit',
        isAccent: false,
        onClick: () => {
          this.#mode = 'exit_confirm';
          this.render();
        },
      },
    ];

    if (this.#pwaManager && !this.#pwaManager.isInstalled) {
      menuActions.push({
        id: 'install_app',
        glyph: '📲',
        titleKey: 'menu.action.install_app',
        descKey: 'menu.action.desc_install_app',
        isAccent: false,
        onClick: () => {
          this.#pwaManager.install();
        },
      });
    }

    const actionCards = menuActions.map((action) => {
      return el(
        'button',
        {
          type: 'button',
          class: ['menu-action-card', action.isAccent && 'is-accent-action'],
          onClick: action.onClick,
        },
        el('span', { class: 'menu-action-glyph' }, action.glyph),
        el(
          'div',
          { class: 'menu-action-content' },
          el('strong', { class: 'menu-action-title' }, t(action.titleKey)),
          el('span', { class: 'menu-action-desc' }, t(action.descKey)),
        ),
        el('span', { class: 'menu-action-arrow' }, '→'),
      );
    });

    const menuGrid = el(
      'section',
      { class: 'menu-section menu-main-nav-section' },
      el('div', { class: 'menu-action-list' }, actionCards),
    );

    sections.push(menuGrid);
    return sections;
  }

  #renderContinueCard(state) {
    const { day } = readClock(state.time.minutes);
    const clock = formatClock(state.time.minutes);
    const location = t(`location.${state.world.currentNodeId}`);
    const hp = Math.round(state.player.health);
    const charted = Object.values(state.world.nodes).filter((n) => n.visited).length;
    const name = state.player?.name || t('character.default_name');
    const archetypeKey = state.player?.archetype || 'scavenger';

    return el(
      'section',
      { class: 'menu-section menu-continue-card' },
      el(
        'div',
        { class: 'menu-continue-info' },
        el(
          'div',
          { class: 'menu-continue-header-line' },
          el('span', { class: 'meta-label' }, t('menu.active_transmission')),
          el('span', { class: 'menu-continue-tag' }, `${name.toUpperCase()} // ${t(`menu.archetype.${archetypeKey}.name`)}`),
        ),
        el('h2', { class: 'menu-continue-title' }, `${location} — ${t('hud.day', { day })} · ${clock}`),
        el(
          'div',
          { class: 'route-meta menu-continue-stats' },
          el('span', {}, `${t('status.vital.health')}: ${hp}%`),
          el('span', {}, `·`),
          el('span', {}, `${t('menu.charted_sectors', { count: charted })}`),
        ),
      ),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-accent menu-cta-btn',
          onClick: () => this.#onContinue(),
        },
        t('menu.action.continue'),
      ),
    );
  }

  // =========================================================================
  // 2. LOAD GAME SCREEN (10 SLOTS: 2 FREE, 8 PREMIUM)
  // =========================================================================
  #renderLoadGameScreen() {
    const isPremium = this.#saveManager ? this.#saveManager.isPremium() : false;
    const slots = this.#saveManager ? this.#saveManager.listSlots() : [];

    const backBtn = el(
      'button',
      {
        type: 'button',
        class: 'btn btn-ghost menu-back-nav-btn',
        onClick: () => {
          this.#mode = 'menu';
          this.render();
        },
      },
      t('menu.action.back_to_menu'),
    );

    const premiumStatusPill = el(
      'div',
      { class: 'menu-premium-status-bar' },
      el(
        'span',
        { class: ['slot-tier-badge', isPremium ? 'is-tier-premium' : 'is-tier-free'] },
        isPremium ? t('menu.slots.premium_status_active') : t('menu.slots.premium_status_free'),
      ),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-ghost btn-sm menu-premium-toggle-btn',
          onClick: () => {
            this.#isPremiumModalOpen = true;
            this.render();
          },
        },
        isPremium ? '👑 Premium Bilgisi / Test' : `👑 ${t('menu.slots.upgrade_cta')}`,
      ),
    );

    const topBar = el('div', { class: 'menu-slots-top-bar' }, backBtn, premiumStatusPill);

    const slotCards = slots.map((slotData) => {
      const { slot, isPremiumSlot, isLocked, hasSave, meta, isActive } = slotData;

      if (isLocked) {
        // Locked Premium Slot (Slots 3-10 without premium)
        return el(
          'div',
          { class: 'slot-card is-premium-locked' },
          el(
            'div',
            { class: 'slot-card-header' },
            el('span', { class: 'slot-index-badge' }, `SLOT ${slot}`),
            el('span', { class: 'slot-tier-badge is-tier-locked' }, t('menu.slots.locked_badge')),
          ),
          el(
            'div',
            { class: 'slot-locked-content' },
            el('span', { class: 'slot-lock-icon' }, '🔒'),
            el('strong', { class: 'slot-locked-title' }, `YUVA ${slot} // ${t('menu.slots.premium_badge')}`),
            el('p', { class: 'slot-locked-desc' }, t('menu.slots.locked_desc')),
          ),
          el(
            'div',
            { class: 'slot-card-actions' },
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-accent btn-sm slot-unlock-btn',
                onClick: () => {
                  this.#isPremiumModalOpen = true;
                  this.render();
                },
              },
              t('menu.slots.unlock_btn'),
            ),
          ),
        );
      }

      // Unlocked slot (Free slot 1-2, or 3-10 with premium)
      if (hasSave && meta) {
        const { day } = readClock(meta.minutes);
        const clock = formatClock(meta.minutes);
        const locName = t(`location.${meta.locationId}`);
        const dateStr = new Date(meta.savedAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return el(
          'div',
          { class: ['slot-card is-unlocked', isActive && 'is-active-slot'] },
          el(
            'div',
            { class: 'slot-card-header' },
            el('span', { class: 'slot-index-badge' }, `SLOT ${slot}`),
            el(
              'span',
              { class: ['slot-tier-badge', isPremiumSlot ? 'is-tier-premium' : 'is-tier-free'] },
              isPremiumSlot ? t('menu.slots.premium_badge') : t('menu.slots.free_badge'),
            ),
            isActive && el('span', { class: 'slot-active-pill' }, t('menu.slots.active_badge')),
          ),
          el(
            'div',
            { class: 'slot-save-info' },
            el(
              'div',
              { class: 'slot-survivor-callsign' },
              el('strong', {}, (meta.name || t('character.default_name')).toUpperCase()),
              el('span', { class: 'slot-archetype-label' }, `// ${t(`menu.archetype.${meta.archetype}.name`)}`),
            ),
            el('div', { class: 'slot-meta-line' }, `${locName} — ${t('hud.day', { day })} · ${clock}`),
            el(
              'div',
              { class: 'slot-vitals-line' },
              el('span', {}, `${t('status.vital.health')}: ${meta.health}%`),
              el('span', {}, `·`),
              el('span', { class: 'slot-timestamp' }, `📅 ${dateStr}`),
            ),
          ),
          el(
            'div',
            { class: 'slot-card-actions' },
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-accent btn-sm',
                onClick: () => {
                  if (this.#onLoadSlot) {
                    this.#onLoadSlot(slot);
                  }
                },
              },
              t('menu.slots.load_btn'),
            ),
            this.#savedState &&
              el(
                'button',
                {
                  type: 'button',
                  class: 'btn btn-ghost btn-sm',
                  onClick: () => {
                    if (this.#onSaveSlot) {
                      this.#onSaveSlot(slot);
                      this.render();
                    }
                  },
                },
                t('menu.slots.save_btn'),
              ),
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost btn-sm slot-delete-btn',
                onClick: () => {
                  if (window.confirm(t('menu.slots.delete_confirm'))) {
                    if (this.#onDeleteSlot) {
                      this.#onDeleteSlot(slot);
                      this.render();
                    }
                  }
                },
              },
              t('menu.slots.delete_btn'),
            ),
          ),
        );
      }

      // Empty unlocked slot
      return el(
        'div',
        { class: 'slot-card is-empty-slot' },
        el(
          'div',
          { class: 'slot-card-header' },
          el('span', { class: 'slot-index-badge' }, `SLOT ${slot}`),
          el(
            'span',
            { class: ['slot-tier-badge', isPremiumSlot ? 'is-tier-premium' : 'is-tier-free'] },
            isPremiumSlot ? t('menu.slots.premium_badge') : t('menu.slots.free_badge'),
          ),
        ),
        el(
          'div',
          { class: 'slot-empty-content' },
          el('strong', { class: 'slot-empty-title' }, t('menu.slots.empty')),
          el('p', { class: 'slot-empty-desc' }, t('menu.slots.empty_desc')),
        ),
        el(
          'div',
          { class: 'slot-card-actions' },
          this.#savedState &&
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-accent btn-sm',
                onClick: () => {
                  if (this.#onSaveSlot) {
                    this.#onSaveSlot(slot);
                    this.render();
                  }
                },
              },
              t('menu.slots.save_btn'),
            ),
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-ghost btn-sm',
              onClick: () => {
                if (this.#saveManager) {
                  this.#saveManager.setActiveSlot(slot);
                }
                this.#mode = 'create';
                this.#currentStep = 1;
                this.render();
              },
            },
            t('menu.action.new_game_main'),
          ),
        ),
      );
    });

    return [
      topBar,
      el('div', { class: 'menu-slots-grid' }, slotCards),
    ];
  }

  // =========================================================================
  // 3. PREMIUM UNLOCK MODAL
  // =========================================================================
  #renderPremiumModal() {
    const isPremium = this.#saveManager ? this.#saveManager.isPremium() : false;

    const featureItems = [
      t('menu.premium.feature_1'),
      t('menu.premium.feature_2'),
      t('menu.premium.feature_3'),
      t('menu.premium.feature_4'),
    ].map((f) => el('li', { class: 'premium-feature-item' }, el('span', { class: 'premium-bullet' }, '✦'), el('span', {}, f)));

    let promoInputEl;
    let promoFeedbackEl = el('span', { class: 'promo-feedback-msg' }, '');

    const promoBox = !isPremium
      ? el(
          'div',
          { class: 'promo-code-container' },
          el('span', { class: 'promo-code-label' }, t('menu.premium.promo_label')),
          el(
            'div',
            { class: 'promo-code-row' },
            (promoInputEl = el('input', {
              type: 'text',
              class: 'promo-code-input',
              placeholder: 'Örn: VIP-SURVIVOR',
              maxLength: 30,
            })),
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-sm btn-accent',
                onClick: () => {
                  const val = promoInputEl?.value?.trim();
                  const res = adManager.redeemPromoCode(val);
                  if (res.ok) {
                    promoFeedbackEl.textContent = t('menu.premium.promo_success');
                    promoFeedbackEl.className = 'promo-feedback-msg tone-good';
                    setTimeout(() => {
                      this.render();
                    }, 600);
                  } else {
                    promoFeedbackEl.textContent = t('menu.premium.promo_invalid');
                    promoFeedbackEl.className = 'promo-feedback-msg tone-warn';
                  }
                },
              },
              t('menu.premium.promo_submit'),
            ),
          ),
          promoFeedbackEl,
        )
      : null;

    return el(
      'div',
      { class: 'premium-modal-backdrop' },
      el(
        'div',
        { class: 'premium-modal-dialog' },
        el(
          'header',
          { class: 'premium-modal-header' },
          el('span', { class: 'premium-kicker' }, t('menu.premium.kicker')),
          el('h2', { class: 'premium-title' }, `👑 ${t('menu.premium.title')}`),
          el('p', { class: 'premium-desc' }, isPremium ? t('menu.premium.active_badge') : t('menu.premium.desc')),
        ),
        el('ul', { class: 'premium-feature-list' }, featureItems),
        promoBox,
        el(
          'div',
          { class: 'premium-modal-actions' },
          !isPremium
            ? el(
                'button',
                {
                  type: 'button',
                  class: 'btn btn-accent premium-cta-btn',
                  onClick: () => {
                    if (this.#saveManager) {
                      this.#saveManager.setPremium(true);
                    }
                    this.render();
                  },
                },
                t('menu.premium.unlock_btn'),
              )
            : el(
                'button',
                {
                  type: 'button',
                  class: 'btn btn-ghost premium-revoke-btn',
                  onClick: () => {
                    if (this.#saveManager) {
                      this.#saveManager.setPremium(false);
                    }
                    this.render();
                  },
                },
                t('menu.premium.revoke_btn'),
              ),
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-ghost',
              onClick: () => {
                this.#isPremiumModalOpen = false;
                this.render();
              },
            },
            t('menu.premium.close'),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // 4. SETTINGS SCREEN
  // =========================================================================
  #renderSettingsScreen() {
    const backBtn = el(
      'button',
      {
        type: 'button',
        class: 'btn btn-ghost menu-back-nav-btn',
        onClick: () => {
          this.#mode = 'menu';
          this.render();
        },
      },
      t('menu.action.back_to_menu'),
    );

    // Language options
    const isTr = i18n.locale === 'tr';
    const langGroup = el(
      'div',
      { class: 'settings-row' },
      el('label', { class: 'settings-label' }, t('menu.settings.language')),
      el(
        'div',
        { class: 'settings-btn-group' },
        el(
          'button',
          {
            type: 'button',
            class: ['btn btn-sm', isTr ? 'btn-accent' : 'btn-ghost'],
            onClick: () => this.#onLocaleChange('tr'),
          },
          'Türkçe (TR)',
        ),
        el(
          'button',
          {
            type: 'button',
            class: ['btn btn-sm', !isTr ? 'btn-accent' : 'btn-ghost'],
            onClick: () => this.#onLocaleChange('en'),
          },
          'English (EN)',
        ),
      ),
    );

    // Audio SFX Volume Slider
    const initialSfx = localStorage.getItem('lastbreath.sfx_volume') || '80';
    const sfxBadge = el('span', { class: 'settings-val-badge' }, `${initialSfx}%`);
    const sfxSlider = el('input', {
      type: 'range',
      min: '0',
      max: '100',
      value: initialSfx,
      class: 'menu-range-slider',
      onInput: (e) => {
        const val = e.target.value;
        sfxBadge.textContent = `${val}%`;
        localStorage.setItem('lastbreath.sfx_volume', val);
      },
    });

    const sfxRow = el(
      'div',
      { class: 'settings-row' },
      el('div', { class: 'settings-spread' }, el('label', { class: 'settings-label' }, t('menu.settings.sfx')), sfxBadge),
      sfxSlider,
    );

    // Ambient / Music Volume Slider
    const initialAmb = localStorage.getItem('lastbreath.ambient_volume') || '60';
    const ambBadge = el('span', { class: 'settings-val-badge' }, `${initialAmb}%`);
    const ambSlider = el('input', {
      type: 'range',
      min: '0',
      max: '100',
      value: initialAmb,
      class: 'menu-range-slider',
      onInput: (e) => {
        const val = e.target.value;
        ambBadge.textContent = `${val}%`;
        localStorage.setItem('lastbreath.ambient_volume', val);
      },
    });

    const ambRow = el(
      'div',
      { class: 'settings-row' },
      el('div', { class: 'settings-spread' }, el('label', { class: 'settings-label' }, t('menu.settings.ambient')), ambBadge),
      ambSlider,
    );

    // CRT Scanlines Effect Toggle
    const isCrt = localStorage.getItem('lastbreath.crt_effects') !== 'false';
    const crtBtn = el(
      'button',
      {
        type: 'button',
        class: ['btn btn-sm', isCrt ? 'btn-accent' : 'btn-ghost'],
        onClick: () => {
          const nextVal = !isCrt;
          localStorage.setItem('lastbreath.crt_effects', String(nextVal));
          document.body.classList.toggle('crt-active', nextVal);
          this.render();
        },
      },
      isCrt ? t('menu.settings.on') : t('menu.settings.off'),
    );

    const crtRow = el(
      'div',
      { class: 'settings-row settings-inline-row' },
      el('label', { class: 'settings-label' }, t('menu.settings.crt')),
      crtBtn,
    );

    // Auto-Save Toggle
    const isAutosave = localStorage.getItem('lastbreath.autosave') !== 'false';
    const autosaveBtn = el(
      'button',
      {
        type: 'button',
        class: ['btn btn-sm', isAutosave ? 'btn-accent' : 'btn-ghost'],
        onClick: () => {
          const nextVal = !isAutosave;
          localStorage.setItem('lastbreath.autosave', String(nextVal));
          this.render();
        },
      },
      isAutosave ? t('menu.settings.on') : t('menu.settings.off'),
    );

    const autosaveRow = el(
      'div',
      { class: 'settings-row settings-inline-row' },
      el('label', { class: 'settings-label' }, t('menu.settings.autosave')),
      autosaveBtn,
    );

    // Danger Zone / Clear All Data
    const dangerZone = el(
      'div',
      { class: 'settings-danger-card' },
      el('strong', { class: 'settings-danger-title' }, t('menu.settings.reset_title')),
      el('p', { class: 'settings-danger-desc' }, t('menu.settings.reset_desc')),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-ghost slot-delete-btn',
          onClick: () => {
            if (window.confirm(t('menu.settings.reset_confirm'))) {
              if (this.#onResetAll) {
                this.#onResetAll();
              }
              this.#mode = 'menu';
              this.render();
            }
          },
        },
        t('menu.settings.reset_btn'),
      ),
    );

    // PWA Mobile / Desktop Install Row
    const pwaRow = el(
      'div',
      { class: 'settings-row settings-inline-row' },
      el(
        'div',
        { class: 'settings-label-col' },
        el('label', { class: 'settings-label' }, t('menu.action.install_app')),
        el('span', { class: 'settings-sub-note' }, t('menu.action.desc_install_app')),
      ),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-sm btn-accent',
          onClick: () => {
            if (this.#pwaManager) {
              this.#pwaManager.install();
            }
          },
        },
        '📲 ' + t('hud.install_app'),
      ),
    );

    const settingsContainer = el(
      'section',
      { class: 'menu-section menu-settings-section' },
      langGroup,
      pwaRow,
      sfxRow,
      ambRow,
      crtRow,
      autosaveRow,
      dangerZone,
    );

    return [backBtn, settingsContainer];
  }

  // =========================================================================
  // 5. EXIT & TERMINATED SCREENS
  // =========================================================================
  #renderExitConfirmScreen() {
    return el(
      'section',
      { class: 'menu-section menu-exit-section' },
      el('h2', { class: 'menu-exit-title' }, `⏻ ${t('menu.exit.title')}`),
      el('p', { class: 'menu-exit-desc' }, t('menu.exit.desc')),
      el(
        'div',
        { class: 'menu-exit-actions' },
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent menu-exit-confirm-btn',
            onClick: () => {
              if (this.#saveManager) {
                this.#saveManager.save();
              }
              this.#mode = 'terminated';
              this.render();
            },
          },
          t('menu.exit.confirm_btn'),
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost',
            onClick: () => {
              this.#mode = 'menu';
              this.render();
            },
          },
          t('menu.exit.cancel_btn'),
        ),
      ),
    );
  }

  #renderTerminatedScreen() {
    return el(
      'section',
      { class: 'menu-section menu-terminated-card' },
      el('div', { class: 'terminal-static-line' }, '/// NO CARRIER — LINK DROPPED ///'),
      el('h2', { class: 'terminated-title' }, t('menu.exit.terminated_title')),
      el('p', { class: 'terminated-desc' }, t('menu.exit.terminated_desc')),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-accent menu-reconnect-btn',
          onClick: () => {
            this.#mode = 'menu';
            this.render();
          },
        },
        t('menu.exit.reconnect_btn'),
      ),
    );
  }

  // =========================================================================
  // 6. CHARACTER CREATION STEPS
  // =========================================================================
  #renderActiveStep() {
    switch (this.#currentStep) {
      case 1:
        return this.#renderStepIdentity();
      case 2:
        return this.#renderStepArchetype();
      case 3:
        return this.#renderStepSector();
      case 4:
      default:
        return this.#renderStepSummary();
    }
  }

  #renderStepIdentity() {
    const nameInput = el('input', {
      type: 'text',
      class: 'menu-text-input',
      maxlength: '24',
      value: this.#name,
      placeholder: t('character.placeholder.name'),
      onInput: (e) => {
        this.#name = e.target.value;
      },
    });

    const randomNameBtn = el(
      'button',
      {
        type: 'button',
        class: 'btn btn-ghost menu-random-btn',
        onClick: () => {
          this.#name = getRandomName(this.#name);
          nameInput.value = this.#name;
        },
      },
      t('character.action.random_name'),
    );

    const ageBracket = getAgeBracket(this.#age);
    const ageValueBadge = el('strong', { class: 'menu-badge-val' }, `${this.#age}`);
    const ageBracketDesc = el('span', { class: 'menu-sub-note' }, t(`character.age_bracket.${ageBracket}`));

    const ageSlider = el('input', {
      type: 'range',
      class: 'menu-range-slider',
      min: '18',
      max: '65',
      value: String(this.#age),
      onInput: (e) => {
        this.#age = Number(e.target.value);
        ageValueBadge.textContent = `${this.#age}`;
        const nextBracket = getAgeBracket(this.#age);
        ageBracketDesc.textContent = t(`character.age_bracket.${nextBracket}`);
      },
    });

    const bloodChips = BLOOD_TYPES.map((type) => {
      const isSelected = this.#bloodType === type;
      return el(
        'button',
        {
          type: 'button',
          class: ['menu-blood-chip', isSelected && 'is-selected'],
          onClick: (e) => {
            this.#bloodType = type;
            const grid = e.currentTarget.closest('.menu-blood-grid');
            if (grid) {
              grid.querySelectorAll('.menu-blood-chip').forEach((chip) => {
                chip.classList.remove('is-selected');
              });
              e.currentTarget.classList.add('is-selected');
            } else {
              this.render();
            }
          },
        },
        type,
      );
    });

    const traitCards = Object.entries(TRAITS).map(([id, def]) => {
      const isSelected = this.#selectedTrait === id;
      return el(
        'button',
        {
          type: 'button',
          class: ['menu-trait-card', isSelected && 'is-selected'],
          onClick: (e) => {
            this.#selectedTrait = id;
            const grid = e.currentTarget.closest('.menu-trait-grid');
            if (grid) {
              grid.querySelectorAll('.menu-trait-card').forEach((card) => {
                card.classList.remove('is-selected');
                const badge = card.querySelector('.menu-check-badge');
                if (badge) badge.remove();
              });
              e.currentTarget.classList.add('is-selected');
              const head = e.currentTarget.querySelector('.menu-option-head');
              if (head && !head.querySelector('.menu-check-badge')) {
                head.appendChild(el('span', { class: 'menu-check-badge' }, '✓'));
              }
            } else {
              this.render();
            }
          },
        },
        el(
          'div',
          { class: 'menu-option-head' },
          el('span', { class: 'item-glyph' }, def.glyph),
          el('strong', { class: 'menu-option-name' }, t(`trait.${id}.name`)),
          isSelected && el('span', { class: 'menu-check-badge' }, '✓'),
        ),
        el('p', { class: 'menu-option-desc' }, t(`trait.${id}.desc`)),
      );
    });

    return el(
      'section',
      { class: 'menu-section menu-step-section' },
      el('h2', { class: 'block-title' }, t('character.label.identity')),
      el(
        'div',
        { class: 'menu-form-row' },
        el(
          'div',
          { class: 'menu-form-col' },
          el('label', { class: 'meta-label' }, t('character.label.name')),
          el('div', { class: 'menu-input-cluster' }, nameInput, randomNameBtn),
        ),
        el(
          'div',
          { class: 'menu-form-col' },
          el(
            'div',
            { class: 'menu-label-spread' },
            el('label', { class: 'meta-label' }, t('character.label.age')),
            ageValueBadge,
          ),
          ageSlider,
          ageBracketDesc,
        ),
      ),
      el('div', { class: 'menu-label-row' }, el('label', { class: 'meta-label' }, t('character.label.blood'))),
      el('div', { class: 'menu-blood-grid' }, bloodChips),
      el('div', { class: 'menu-label-row' }, el('label', { class: 'meta-label' }, t('character.label.trait'))),
      el('div', { class: 'menu-trait-grid' }, traitCards),
    );
  }

  #renderStepArchetype() {
    const archetypeCards = Object.entries(ARCHETYPES).map(([id, def]) => {
      const isSelected = this.#selectedArchetype === id;
      const itemLabels = def.kit
        .map(({ itemId, qty }) => `${t(`item.${itemId}.name`)}${qty > 1 ? ` ×${qty}` : ''}`)
        .join(' · ');

      return el(
        'button',
        {
          type: 'button',
          class: ['menu-option-card', isSelected && 'is-selected'],
          onClick: (e) => {
            this.#selectedArchetype = id;
            const grid = e.currentTarget.closest('.menu-archetype-grid');
            if (grid) {
              grid.querySelectorAll('.menu-option-card').forEach((card) => {
                card.classList.remove('is-selected');
                const badge = card.querySelector('.menu-check-badge');
                if (badge) badge.remove();
              });
              e.currentTarget.classList.add('is-selected');
              const head = e.currentTarget.querySelector('.menu-option-head');
              if (head && !head.querySelector('.menu-check-badge')) {
                head.appendChild(el('span', { class: 'menu-check-badge' }, '✓'));
              }
            } else {
              this.render();
            }
          },
        },
        el(
          'div',
          { class: 'menu-option-head' },
          el('span', { class: 'item-glyph' }, def.glyph),
          el('strong', { class: 'menu-option-name' }, t(`menu.archetype.${id}.name`)),
          isSelected && el('span', { class: 'menu-check-badge' }, '✓'),
        ),
        el('p', { class: 'menu-option-desc' }, t(`menu.archetype.${id}.desc`)),
        el('span', { class: 'menu-option-kit' }, `📦 ${itemLabels}`),
      );
    });

    return el(
      'section',
      { class: 'menu-section menu-step-section' },
      el('h2', { class: 'block-title' }, t('character.label.archetype')),
      el('div', { class: 'menu-archetype-grid' }, archetypeCards),
    );
  }

  #renderStepSector() {
    const locationChips = STARTING_LOCATIONS.map((nodeId) => {
      const node = getNode(nodeId);
      const isSelected = this.#selectedLocation === nodeId;
      return el(
        'button',
        {
          type: 'button',
          class: ['menu-sector-chip', isSelected && 'is-selected'],
          onClick: (e) => {
            this.#selectedLocation = nodeId;
            const grid = e.currentTarget.closest('.menu-sector-grid');
            if (grid) {
              grid.querySelectorAll('.menu-sector-chip').forEach((chip) => {
                chip.classList.remove('is-selected');
                const badge = chip.querySelector('.menu-check-badge');
                if (badge) badge.remove();
              });
              e.currentTarget.classList.add('is-selected');
              const top = e.currentTarget.querySelector('.sector-chip-top');
              if (top && !top.querySelector('.menu-check-badge')) {
                top.appendChild(el('span', { class: 'menu-check-badge' }, '✓'));
              }
            } else {
              this.render();
            }
          },
        },
        el(
          'div',
          { class: 'sector-chip-top' },
          el('span', { class: 'sector-chip-name' }, t(`location.${nodeId}`)),
          isSelected && el('span', { class: 'menu-check-badge' }, '✓'),
        ),
        el(
          'span',
          { class: 'sector-chip-meta' },
          `${t(`biome.${node.biome}`)} · ${'▲'.repeat(node.danger)}`,
        ),
      );
    });

    return el(
      'section',
      { class: 'menu-section menu-step-section' },
      el('h2', { class: 'block-title' }, t('character.label.sector')),
      el('div', { class: 'menu-sector-grid' }, locationChips),
    );
  }

  #renderStepSummary() {
    const finalName = (this.#name.trim() || t('character.default_name')).toUpperCase();
    const archetype = ARCHETYPES[this.#selectedArchetype] || ARCHETYPES.scavenger;
    const node = getNode(this.#selectedLocation);

    const kitSummary = archetype.kit
      .map(({ itemId, qty }) => `${t(`item.${itemId}.name`)}${qty > 1 ? ` ×${qty}` : ''}`)
      .join(', ');

    const dossierCard = el(
      'div',
      { class: 'menu-live-dossier' },
      el(
        'div',
        { class: 'live-dossier-header' },
        el('span', { class: 'live-dossier-kicker' }, t('character.label.dossier_preview')),
        el(
          'strong',
          { class: 'live-dossier-callsign' },
          `${finalName} // ${t(`menu.archetype.${this.#selectedArchetype}.name`)}`,
        ),
      ),
      el(
        'div',
        { class: 'live-dossier-meta' },
        el('span', {}, `${t('character.label.age')}: ${this.#age}`),
        el('span', {}, `·`),
        el('span', {}, `${t('character.label.blood')}: ${this.#bloodType}`),
        el('span', {}, `·`),
        el('span', {}, `${t('character.label.trait')}: ${t(`trait.${this.#selectedTrait}.name`)}`),
        el('span', {}, `·`),
        el(
          'span',
          {},
          `${t('character.label.sector')}: ${t(`location.${this.#selectedLocation}`)} (${t(`biome.${node.biome}`)})`,
        ),
      ),
      el('div', { class: 'live-dossier-kit' }, `📦 ${t('character.label.archetype')}: ${kitSummary}`),
    );

    return el(
      'section',
      { class: 'menu-section menu-step-section' },
      el('h2', { class: 'block-title' }, t('character.label.dossier_preview')),
      dossierCard,
    );
  }

  #renderStepNavBar() {
    const isFirstStep = this.#currentStep === 1;
    const isLastStep = this.#currentStep === 4;

    const leftBtn = isFirstStep
      ? el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost menu-nav-btn',
            onClick: () => {
              this.#mode = 'menu';
              this.render();
            },
          },
          t('character.action.back_to_menu'),
        )
      : el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost menu-nav-btn',
            onClick: () => {
              this.#currentStep = Math.max(1, this.#currentStep - 1);
              this.render();
            },
          },
          t('character.action.prev'),
        );

    const rightBtn = isLastStep
      ? el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent menu-nav-btn menu-deploy-btn',
            onClick: () => {
              try {
                const finalName = this.#name.trim() || t('character.default_name');
                this.close();
                this.#onStartNew({
                  name: finalName,
                  age: this.#age,
                  bloodType: this.#bloodType,
                  trait: this.#selectedTrait,
                  archetypeId: this.#selectedArchetype,
                  locationId: this.#selectedLocation,
                });
              } catch (err) {
                console.error('[menuView] deploy button error:', err);
              }
            },
          },
          t('character.action.deploy'),
        )
      : el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent menu-nav-btn',
            onClick: () => {
              this.#currentStep = Math.min(4, this.#currentStep + 1);
              this.render();
            },
          },
          t('character.action.next'),
        );

    return el('div', { class: 'menu-step-nav-bar' }, leftBtn, rightBtn);
  }
}
