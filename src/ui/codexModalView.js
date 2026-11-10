/**
 * Last Breath // Codex, Permadeath Memorial & Career Statistics View
 * Interactive terminal dossier governing the fallen survivors graveyard,
 * career telemetry dials, achievement medals, and classified post-collapse lore.
 */

import { t, i18n } from '../i18n/i18n.js';
import { ACHIEVEMENTS_CATALOG, LORE_CODEX_CATALOG, codexManager } from '../core/codexManager.js';
import { el } from './dom.js';

export class CodexModalView {
  #rootEl;
  #engine;
  #activeTab = 'memorial'; // 'memorial' | 'achievements' | 'career' | 'lore'

  constructor(rootEl, engine) {
    this.#rootEl = rootEl;
    this.#engine = engine;
    codexManager.setBus(engine.bus);

    // Achievement unlock banner listener
    engine.bus.on('codex:achievement_unlocked', ({ id, catalog }) => {
      this.#showUnlockToast(catalog);
      if (!this.#rootEl.hidden) {
        this.render();
      }
    });

    // Listen for direct open/close modal events
    engine.bus.on('codex:modal', ({ tab } = {}) => {
      if (tab) this.#activeTab = tab;
      this.open();
    });
  }

  open(tab = 'memorial') {
    this.#activeTab = tab;
    this.#rootEl.hidden = false;
    this.render();
  }

  close() {
    this.#rootEl.hidden = true;
    this.#rootEl.replaceChildren();
  }

  #showUnlockToast(catalog) {
    const toast = document.getElementById('toast-banner');
    if (!toast) return;
    toast.textContent = `🏆 ${t('codex.toast_unlocked')}: ${t(catalog.titleKey)}`;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4500);
  }

  render() {
    if (this.#rootEl.hidden) return;

    const rank = codexManager.getSurvivalRank();
    const achievements = codexManager.achievements;
    const totalAch = Object.keys(ACHIEVEMENTS_CATALOG).length;
    const unlockedAch = Object.keys(achievements).length;

    const card = el(
      'div',
      { class: 'modal-card codex-modal-card' },

      // Header Cluster
      el(
        'div',
        { class: 'codex-header' },
        el(
          'div',
          { class: 'codex-title-cluster' },
          el('span', { class: 'codex-header-glyph' }, '📖'),
          el(
            'div',
            {},
            el('h2', { class: 'codex-title' }, t('codex.title')),
            el(
              'div',
              { class: 'codex-submeta' },
              el('span', {}, `${t('codex.label.rank')}: ${rank.glyph} ${t(rank.rankKey)}`),
              el('span', {}, ' · '),
              el('span', { class: 'tone-amber' }, `${unlockedAch} / ${totalAch} ${t('codex.label.achievements')}`),
            ),
          ),
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost btn-xs',
            onClick: () => this.close(),
          },
          '✕',
        ),
      ),

      // Dossier Tab Switcher
      el(
        'div',
        { class: 'codex-tab-bar' },
        [
          { id: 'memorial', labelKey: 'codex.tab.memorial', glyph: '🪦' },
          { id: 'achievements', labelKey: 'codex.tab.achievements', glyph: '🏆' },
          { id: 'career', labelKey: 'codex.tab.career', glyph: '📊' },
          { id: 'lore', labelKey: 'codex.tab.lore', glyph: '📁' },
        ].map((tab) =>
          el(
            'button',
            {
              type: 'button',
              class: ['codex-tab-btn', this.#activeTab === tab.id && 'is-active'],
              onClick: () => {
                this.#activeTab = tab.id;
                this.render();
              },
            },
            `${tab.glyph} ${t(tab.labelKey)}`,
          ),
        ),
      ),

      // Tab Content Body
      el('div', { class: 'codex-body' }, this.#renderActiveTabContent()),
    );

    this.#rootEl.replaceChildren(card);
  }

  #renderActiveTabContent() {
    switch (this.#activeTab) {
      case 'memorial':
        return this.#renderMemorialTab();
      case 'achievements':
        return this.#renderAchievementsTab();
      case 'career':
        return this.#renderCareerTab();
      case 'lore':
        return this.#renderLoreTab();
      default:
        return el('div', {}, 'Unknown Tab');
    }
  }

  // =========================================================================
  // 1. MEMORIAL GRAVEYARD TAB
  // =========================================================================
  #renderMemorialTab() {
    const records = codexManager.memorial;

    if (records.length === 0) {
      return el(
        'div',
        { class: 'memorial-empty-state' },
        el('div', { class: 'empty-glyph' }, '🕯️'),
        el('h3', { class: 'empty-title' }, t('codex.memorial.empty_title')),
        el('p', { class: 'empty-desc' }, t('codex.memorial.empty_desc')),
      );
    }

    const items = records.map((survivor) => {
      const dateStr = new Date(survivor.diedAtTimestamp).toLocaleDateString(
        i18n.locale === 'tr' ? 'tr-TR' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
      );

      return el(
        'div',
        { class: 'memorial-card' },
        el(
          'div',
          { class: 'memorial-card-head' },
          el(
            'div',
            { class: 'memorial-name-cluster' },
            el('span', { class: 'memorial-rip-icon' }, '✟'),
            el('strong', { class: 'memorial-name' }, survivor.name),
            el('span', { class: 'memorial-archetype-tag' }, t(`archetype.${survivor.archetype}.name`)),
          ),
          el('span', { class: 'memorial-date' }, dateStr),
        ),
        el(
          'div',
          { class: 'memorial-vital-stats' },
          el('span', {}, `📍 ${t(`location.${survivor.deathLocation}`)}`),
          el('span', {}, ' · '),
          el('span', { class: 'tone-warn' }, `💀 ${t(`death.cause.${survivor.causeOfDeath}`)}`),
          el('span', {}, ' · '),
          el('span', {}, `⏳ ${survivor.daysSurvived} ${t('codex.label.days_survived')}`),
          el('span', {}, ' · '),
          el('span', {}, `🗺️ ${survivor.sectorsVisited} ${t('codex.label.sectors')}`),
          el('span', {}, ' · '),
          el('span', {}, `⚔️ ${survivor.enemiesNeutralized} ${t('codex.label.kills')}`),
        ),
        el('blockquote', { class: 'memorial-epitaph' }, `"${survivor.epitaph}"`),
      );
    });

    return el(
      'div',
      { class: 'memorial-list-container' },
      el('div', { class: 'memorial-header-intro' }, el('p', {}, t('codex.memorial.intro_text'))),
      el('div', { class: 'memorial-cards-list' }, items),
    );
  }

  // =========================================================================
  // 2. ACHIEVEMENTS & MEDALS TAB
  // =========================================================================
  #renderAchievementsTab() {
    const userAch = codexManager.achievements;
    const allAchs = Object.values(ACHIEVEMENTS_CATALOG);

    const cards = allAchs.map((ach) => {
      const isUnlocked = Boolean(userAch[ach.id]);
      const unlockDate = isUnlocked
        ? new Date(userAch[ach.id].unlockedAt).toLocaleDateString(i18n.locale === 'tr' ? 'tr-TR' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : null;

      return el(
        'div',
        { class: ['achievement-badge-card', isUnlocked ? 'is-unlocked' : 'is-locked'] },
        el('div', { class: 'ach-icon' }, isUnlocked ? ach.icon : '🔒'),
        el(
          'div',
          { class: 'ach-meta' },
          el('h4', { class: 'ach-title' }, t(ach.titleKey)),
          el('p', { class: 'ach-desc' }, t(ach.descKey)),
          el(
            'span',
            { class: ['ach-date', isUnlocked ? 'tone-good' : 'tone-dim'] },
            isUnlocked ? `✓ ${unlockDate}` : t('codex.label.locked'),
          ),
        ),
      );
    });

    return el('div', { class: 'achievements-grid' }, cards);
  }

  // =========================================================================
  // 3. CAREER STATISTICS TAB
  // =========================================================================
  #renderCareerTab() {
    const c = codexManager.career;
    const rank = codexManager.getSurvivalRank();

    const statRows = [
      { label: t('codex.stats.total_expeditions'), val: c.totalExpeditions, glyph: '🏕️' },
      { label: t('codex.stats.total_days'), val: `${c.totalDaysSurvived} ${t('codex.label.days')}`, glyph: '⏳' },
      { label: t('codex.stats.total_km'), val: `${c.totalKmTraveled} km`, glyph: '🧭' },
      { label: t('codex.stats.total_sectors'), val: c.totalSectorsVisited, glyph: '🗺️' },
      { label: t('codex.stats.enemies_neutralized'), val: c.totalEnemiesDefeated, glyph: '⚔️' },
      { label: t('codex.stats.enemies_spared'), val: c.totalEnemiesSpared, glyph: '🕊️' },
      { label: t('codex.stats.barter_volume'), val: `${c.totalBarterValue} pts`, glyph: '⚖️' },
      { label: t('codex.stats.vehicles_restored'), val: c.totalVehiclesRestored, glyph: '🚙' },
      { label: t('codex.stats.fuel_siphoned'), val: `${c.totalFuelSiphoned} L`, glyph: '⛽' },
      { label: t('codex.stats.crafts_done'), val: c.totalCraftsDone, glyph: '⚒️' },
    ];

    return el(
      'div',
      { class: 'career-container' },
      // Rank Hero Card
      el(
        'div',
        { class: 'career-rank-hero' },
        el('div', { class: 'rank-glyph' }, rank.glyph),
        el(
          'div',
          { class: 'rank-details' },
          el('span', { class: 'meta-label' }, t('codex.label.career_standing')),
          el('h3', { class: 'rank-title' }, t(rank.rankKey)),
          el('p', { class: 'rank-desc' }, t(`codex.rank.desc_${rank.tier}`)),
        ),
      ),

      // Dials Grid
      el(
        'div',
        { class: 'career-dials-grid' },
        statRows.map((row) =>
          el(
            'div',
            { class: 'career-dial-card' },
            el('span', { class: 'dial-glyph' }, row.glyph),
            el('span', { class: 'dial-label' }, row.label),
            el('strong', { class: 'dial-value' }, row.val),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // 4. CLASSIFIED LORE CODEX TAB
  // =========================================================================
  #renderLoreTab() {
    const entries = Object.values(LORE_CODEX_CATALOG);

    const categories = [
      { id: 'factions', title: t('codex.lore_cat.factions') },
      { id: 'tactics', title: t('codex.lore_cat.tactics') },
      { id: 'vehicles', title: t('codex.lore_cat.vehicles') },
    ];

    const blocks = categories.map((cat) => {
      const catEntries = entries.filter((e) => e.category === cat.id);
      return el(
        'div',
        { class: 'lore-category-block' },
        el('h4', { class: 'lore-cat-title' }, cat.title),
        el(
          'div',
          { class: 'lore-entries-grid' },
          catEntries.map((e) =>
            el(
              'div',
              { class: 'lore-dossier-card' },
              el(
                'div',
                { class: 'lore-dossier-head' },
                el('span', { class: 'lore-glyph' }, e.glyph),
                el('h5', { class: 'lore-title' }, t(e.titleKey)),
                el('span', { class: 'lore-stamp' }, `[${t('codex.lore.cleared')}]`),
              ),
              el('p', { class: 'lore-text' }, t(e.descKey)),
            ),
          ),
        ),
      );
    });

    return el('div', { class: 'lore-container' }, blocks);
  }
}

