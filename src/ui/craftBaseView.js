import { getItem } from '../data/items.js';
import { RECIPES, getRecipe } from '../data/recipes.js';
import { STRUCTURES, getStructure } from '../data/structures.js';
import { t } from '../i18n/i18n.js';
import {
  activeWorkbenchTier,
  canAffordCost,
  calculateThreatLevel,
  isAtOutpost,
  FUEL_ITEM_IDS,
} from '../modules/base/index.js';
import { maxCraftableCount } from '../modules/crafting/index.js';
import { countItem } from '../modules/inventory/inventoryModel.js';
import { audioEngine } from '../core/audioEngine.js';
import { el } from './dom.js';

const CRAFT_CATEGORIES = [
  { id: 'all', labelKey: 'crafting.category.all' },
  { id: 'survival', labelKey: 'crafting.category.survival' },
  { id: 'medical', labelKey: 'crafting.category.medical' },
  { id: 'weapons', labelKey: 'crafting.category.weapons' },
  { id: 'gear', labelKey: 'crafting.category.gear' },
];

export class CraftBaseView {
  #craftRoot;
  #baseRoot;
  #engine;
  #activeCategory = 'all';
  #selectedRecipeId = null;
  #craftPage = 1;
  #storagePage = 1;
  #activeBaseSubTab = 'facilities'; // 'facilities' | 'storage' | 'defense'
  #selectedFacilityId = null;
  #lastState = null;

  constructor(craftRoot, baseRoot, engine) {
    if (baseRoot && typeof baseRoot.dispatch === 'function') {
      this.#craftRoot = craftRoot;
      this.#baseRoot = null;
      this.#engine = baseRoot;
    } else {
      this.#craftRoot = craftRoot;
      this.#baseRoot = baseRoot;
      this.#engine = engine;
    }
  }

  render(state) {
    this.#lastState = state;
    this.renderCrafting(state);
    this.renderBase(state);
  }

  renderCrafting(state = this.#lastState) {
    if (!state) return;
    if (this.#craftRoot) {
      const modal = this.#selectedRecipeId
        ? this.#renderRecipeInspectModal(this.#selectedRecipeId, state)
        : null;
      const nodes = [this.#renderCraftingSection(state), modal].filter(Boolean);
      this.#craftRoot.replaceChildren(...nodes);
    }
  }

  renderBase(state = this.#lastState) {
    if (!state) return;
    const modal = (this.#activeBaseSubTab === 'facilities' && this.#selectedFacilityId)
      ? this.#renderFacilityInspectModal(this.#selectedFacilityId, state)
      : null;
    if (this.#baseRoot) {
      const nodes = [this.#renderOutpostSection(state), modal].filter(Boolean);
      this.#baseRoot.replaceChildren(...nodes);
    } else if (this.#craftRoot && !this.#baseRoot) {
      const nodes = [
        this.#renderCraftingSection(state),
        this.#renderOutpostSection(state),
        modal,
      ].filter(Boolean);
      this.#craftRoot.replaceChildren(...nodes);
    }
  }

  // =========================================================================
  // 1. CRAFTING SECTION (TACTICAL GRID & INSPECT DRAWER)
  // =========================================================================
  #renderCraftingSection(state) {
    const stationTier = activeWorkbenchTier(state);

    // Filter Chips
    const tabs = CRAFT_CATEGORIES.map((cat) =>
      el(
        'button',
        {
          type: 'button',
          class: ['filter-chip', this.#activeCategory === cat.id && 'is-active'],
          onClick: () => {
            this.#activeCategory = cat.id;
            this.#craftPage = 1;
            this.#selectedRecipeId = null;
            if (this.#lastState) this.renderCrafting(this.#lastState);
          },
        },
        t(cat.labelKey),
      ),
    );

    const filteredRecipes = Object.entries(RECIPES).filter(([, recipe]) => {
      if (this.#activeCategory === 'all') return true;
      return recipe.category === this.#activeCategory;
    });

    if (this.#selectedRecipeId && !filteredRecipes.some(([id]) => id === this.#selectedRecipeId)) {
      this.#selectedRecipeId = null;
    }

    const RECIPES_PER_PAGE = 8;
    if (this.#selectedRecipeId) {
      const selectedIndex = filteredRecipes.findIndex(([id]) => id === this.#selectedRecipeId);
      if (selectedIndex !== -1) {
        this.#craftPage = Math.floor(selectedIndex / RECIPES_PER_PAGE) + 1;
      }
    }

    // Grid cells
    const cells = filteredRecipes.map(([recipeId, recipe]) => {
      const outItem = getItem(recipe.output.itemId);
      const maxCount = maxCraftableCount(state, recipeId);
      const canCraftOne = maxCount >= 1;
      const tierLocked = stationTier < recipe.tier;
      const isSelected = this.#selectedRecipeId === recipeId;

      return el(
        'button',
        {
          type: 'button',
          class: [
            'craft-slot-cell',
            'inv-slot-cell',
            outItem?.category ? `cat-${outItem.category}` : '',
            outItem?.rarity ? `rarity-${outItem.rarity}` : 'rarity-common',
            isSelected && 'is-selected',
            canCraftOne && 'is-craftable',
            tierLocked && 'is-tier-locked',
          ],
          title: `${t(`item.${recipe.output.itemId}.name`)} (${t(`crafting.tier.${recipe.tier}`)})`,
          onClick: () => {
            this.#selectedRecipeId = this.#selectedRecipeId === recipeId ? null : recipeId;
            try { audioEngine.playGearRustle?.(); } catch {}
            this.renderCrafting(this.#lastState);
          },
        },
        el('span', { class: 'slot-tier-tag' }, `T${recipe.tier}`),
        tierLocked && el('span', { class: 'slot-lock-badge' }, '🔒'),
        el('span', { class: 'slot-glyph' }, outItem.glyph),
        canCraftOne
          ? el('span', { class: ['slot-qty-badge', 'slot-craft-avail'] }, maxCount > 1 ? `×${maxCount}` : '✓')
          : (recipe.output.qty > 1 ? el('span', { class: 'slot-qty-badge' }, `×${recipe.output.qty}`) : null),
      );
    });

    const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE));
    this.#craftPage = Math.min(Math.max(1, this.#craftPage || 1), totalPages);
    const startIndex = (this.#craftPage - 1) * RECIPES_PER_PAGE;
    const pagedCells = cells.slice(startIndex, startIndex + RECIPES_PER_PAGE);

    const gridEl = pagedCells.length > 0
      ? el('div', { class: 'craft-slot-grid inv-slot-grid' }, pagedCells)
      : el('p', { class: 'muted-note pad-xs' }, t('crafting.no_recipes_in_cat'));

    const paginationBar = totalPages > 1
      ? el(
        'div',
        { class: 'pagination-bar' },
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', 'btn-page', this.#craftPage <= 1 && 'is-disabled'],
            disabled: this.#craftPage <= 1,
            onClick: () => {
              this.#craftPage = Math.max(1, this.#craftPage - 1);
              if (this.#lastState) this.renderCrafting(this.#lastState);
            },
          },
          '◀',
        ),
        el(
          'span',
          { class: 'page-indicator' },
          t('ui.page', { current: this.#craftPage, total: totalPages }),
        ),
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', 'btn-page', this.#craftPage >= totalPages && 'is-disabled'],
            disabled: this.#craftPage >= totalPages,
            onClick: () => {
              this.#craftPage = Math.min(totalPages, this.#craftPage + 1);
              if (this.#lastState) this.renderCrafting(this.#lastState);
            },
          },
          '▶',
        ),
      )
      : null;

    const hintBanner = el(
      'div',
      { class: 'inv-hint-banner' },
      el('span', { class: 'inv-hint-icon' }, '🔍'),
      el('span', { class: 'inv-hint-text' }, t('crafting.select_prompt')),
    );

    return el(
      'section',
      { class: 'panel-block craft-panel' },
      el(
        'div',
        { class: 'load-header' },
        el('h3', { class: 'block-title' }, t('crafting.section.recipes')),
        el('span', { class: 'meta-label station-tag' }, `${t('crafting.station')}: ${t(`crafting.tier.${stationTier}`)}`),
      ),
      el('div', { class: 'filter-row' }, tabs),
      gridEl,
      paginationBar,
      hintBanner,
    );
  }

  #renderRecipeInspectModal(recipeId, state) {
    const recipe = getRecipe(recipeId);
    if (!recipe) return null;
    const outItem = getItem(recipe.output.itemId);
    if (!outItem) return null;

    const stationTier = activeWorkbenchTier(state);
    const maxCount = maxCraftableCount(state, recipeId);
    const canCraftOne = maxCount >= 1;
    const tierLocked = stationTier < recipe.tier;
    const stationLabel = t(`crafting.tier.${recipe.tier}`);

    const closeModal = () => {
      this.#selectedRecipeId = null;
      if (this.#lastState) this.renderCrafting(this.#lastState);
    };

    const ingredients = recipe.ingredients.map(({ itemId, qty }) => {
      const have = countItem(state.inventory, itemId);
      const enough = have >= qty;
      return el(
        'span',
        { class: ['ing-pill', enough ? 'tone-good' : 'tone-bad'] },
        `${t(`item.${itemId}.name`)} ${have}/${qty}`,
      );
    });

    const actions = [
      el(
        'button',
        {
          type: 'button',
          class: ['btn', 'btn-accent', 'btn-inspect-act-primary', (!canCraftOne || tierLocked) && 'is-disabled'],
          disabled: !canCraftOne || tierLocked,
          onClick: () => {
            if (maxCount <= 1) {
              this.#selectedRecipeId = null;
            }
            this.#engine.dispatch('crafting/craft', { recipeId, count: 1 });
          },
        },
        maxCount > 1 ? `⚒️ ${t('crafting.action.craft_one')}` : `⚒️ ${t('crafting.action.craft')}`,
      ),
    ];

    if (maxCount > 1 && !tierLocked) {
      actions.push(
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-outline btn-inspect-act-primary batch-craft-btn',
            onClick: () => {
              this.#selectedRecipeId = null;
              this.#engine.dispatch('crafting/craft', { recipeId, count: maxCount });
            },
          },
          `⚒️ ${t('crafting.action.craft_max', { count: maxCount })}`,
        ),
      );
    }

    return el(
      'div',
      {
        class: 'item-inspect-overlay',
        onClick: (e) => {
          if (e.target === e.currentTarget) closeModal();
        },
      },
      el(
        'div',
        { class: 'item-inspect-modal' },
        el(
          'div',
          { class: 'inspect-header' },
          el(
            'div',
            { class: 'inspect-title-wrap' },
            el('span', { class: ['inspect-glyph', outItem.category ? `cat-${outItem.category}` : '', `rarity-${outItem.rarity || 'common'}`] }, outItem.glyph),
            el(
              'div',
              { class: 'inspect-meta' },
              el(
                'div',
                { class: 'item-title-line' },
                el('strong', { class: ['inspect-name', `rarity-${outItem.rarity || 'common'}`] }, t(`item.${recipe.output.itemId}.name`)),
                recipe.output.qty > 1 && el('span', { class: 'item-qty tone-good' }, `×${recipe.output.qty}`),
              ),
              el(
                'div',
                { class: 'inspect-sub-tags' },
                el('span', { class: 'inspect-cat-pill' }, t(`crafting.category.${recipe.category}`)),
                el('span', { class: ['inspect-rarity-pill', `rarity-${outItem.rarity || 'common'}`] }, t(`rarity.${outItem.rarity || 'common'}`)),
                el('span', { class: ['route-mode-tag', tierLocked ? 'tone-warn' : 'tone-dim'] }, stationLabel),
                el('span', { class: 'item-weight' }, `⏱ ${recipe.minutes}m`),
              ),
            ),
          ),
          el(
            'button',
            {
              type: 'button',
              class: 'inspect-close-btn',
              title: t('ui.close') || 'KAPAT',
              onClick: closeModal,
            },
            '✕',
          ),
        ),
        el(
          'div',
          { class: 'item-inspect-body' },
          el('p', { class: 'inspect-desc' }, t(`item.${recipe.output.itemId}.desc`)),
          el(
            'div',
            { class: 'craft-req-box' },
            el('div', { class: 'craft-req-title' }, t('crafting.ingredients_needed')),
            el('div', { class: 'ing-list' }, ingredients),
          ),
          tierLocked && el(
            'div',
            { class: 'tier-warn-banner' },
            `⚠️ ${t('crafting.station_missing_warn', { tier: stationLabel })}`,
          ),
          el('div', { class: 'inspect-actions-row' }, ...actions),
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost btn-xs btn-inspect-modal-close',
            onClick: closeModal,
          },
          `✕ ${t('ui.close') || 'KAPAT'}`,
        ),
      ),
    );
  }

  // =========================================================================
  // 2. OUTPOST & BASE OVERHAUL (FACILITIES BLUEPRINT, STORAGE, DEFENSE)
  // =========================================================================
  #renderOutpostSection(state) {
    const {
      outpostNodeId,
      integrity = 100,
      structures = {},
      storage = [],
      generatorFuelMinutes = 0,
      generatorActive = false,
      defenseLogs = [],
    } = state.base;

    const hereId = state.world.currentNodeId;
    const atOutpost = isAtOutpost(state);

    if (!atOutpost) {
      return el(
        'section',
        { class: 'panel-block outpost-panel' },
        el('h3', { class: 'block-title' }, t('base.section.outpost')),
        el(
          'div',
          { class: 'sector-header' },
          outpostNodeId
            ? el(
              'div',
              {},
              el('span', { class: 'meta-label' }, t('base.location_label')),
              el('strong', { class: 'sector-title' }, t(`location.${outpostNodeId}`)),
            )
            : el('p', { class: 'muted-note' }, t('base.none_established')),
        ),
        el(
          'div',
          { class: 'ops-actions' },
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-accent',
              onClick: () => this.#engine.dispatch('base/establish'),
            },
            outpostNodeId
              ? t('base.action.relocate', { location: t(`location.${hereId}`) })
              : t('base.action.establish', { location: t(`location.${hereId}`) }),
          ),
        ),
      );
    }

    const threat = calculateThreatLevel(state);
    const fuelHours = Math.floor(generatorFuelMinutes / 60);
    const fuelMins = generatorFuelMinutes % 60;

    // Telemetry HUD Bar
    const telemetryBar = el(
      'div',
      { class: 'base-telemetry-hud' },
      el(
        'div',
        { class: 'telemetry-card' },
        el('span', { class: 'telemetry-key' }, t('base.power_label')),
        el(
          'strong',
          { class: ['telemetry-val', generatorActive ? 'tone-good' : 'tone-dim'] },
          generatorActive ? t('base.power_active') : t('base.power_offline'),
        ),
      ),
      el(
        'div',
        { class: 'telemetry-card' },
        el('span', { class: 'telemetry-key' }, t('base.integrity')),
        el(
          'strong',
          { class: ['telemetry-val', integrity < 50 ? 'tone-bad' : 'tone-good'] },
          `${Math.round(integrity)}%`,
        ),
      ),
      el(
        'div',
        { class: 'telemetry-card' },
        el('span', { class: 'telemetry-key' }, t('base.threat_label')),
        el(
          'strong',
          { class: ['telemetry-val', threat > 60 ? 'tone-bad' : (threat > 30 ? 'tone-warn' : 'tone-good')] },
          `%${threat}`,
        ),
      ),
    );

    // Sub-tab Navigation
    const subTabs = [
      { id: 'facilities', label: t('base.subtab.facilities') },
      { id: 'storage', label: t('base.subtab.storage') },
      { id: 'defense', label: t('base.subtab.defense') },
    ].map((tab) =>
      el(
        'button',
        {
          type: 'button',
          class: ['base-subtab-btn', this.#activeBaseSubTab === tab.id && 'is-active'],
          onClick: () => {
            this.#activeBaseSubTab = tab.id;
            this.renderBase(this.#lastState);
          },
        },
        tab.label,
      ),
    );

    let content;
    if (this.#activeBaseSubTab === 'facilities') {
      content = this.#renderFacilitiesTab(state);
    } else if (this.#activeBaseSubTab === 'storage') {
      content = this.#renderStorageTab(state);
    } else {
      content = this.#renderDefenseTab(state);
    }

    return el(
      'section',
      { class: 'panel-block outpost-panel' },
      el(
        'div',
        { class: 'load-header' },
        el('h3', { class: 'block-title' }, t('base.section.outpost')),
        el('strong', { class: 'meta-val tone-good' }, t(`location.${outpostNodeId}`)),
      ),
      telemetryBar,
      el('div', { class: 'base-subnav' }, subTabs),
      content,
    );
  }

  // --- SUB-TAB 1: FACILITIES BLUEPRINT GRID ---
  #renderFacilitiesTab(state) {
    const { structures = {}, storage = [], generatorFuelMinutes = 0, generatorActive = false } = state.base;
    const hasGenerator = (structures.generator ?? 0) > 0;
    const hasFuelCanister = state.inventory.stacks?.some((s) => FUEL_ITEM_IDS.includes(s.itemId) && s.qty > 0);

    const fuelHours = Math.floor(generatorFuelMinutes / 60);
    const fuelMins = generatorFuelMinutes % 60;

    // Power Grid Control Strip (if generator exists)
    const generatorControlStrip = hasGenerator && el(
      'div',
      { class: 'generator-control-strip' },
      el(
        'div',
        { class: 'gen-info' },
        el('span', { class: 'gen-title' }, `⚡ ${t('structure.generator.name')}`),
        el('span', { class: 'gen-fuel' }, t('base.generator_fuel', { hours: fuelHours, mins: fuelMins })),
      ),
      el(
        'div',
        { class: 'gen-actions' },
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', generatorActive ? 'btn-warn' : 'btn-accent'],
            onClick: () => this.#engine.dispatch('base/toggleGenerator'),
          },
          t('base.action.toggle_generator'),
        ),
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', 'btn-outline', !hasFuelCanister && 'is-disabled'],
            disabled: !hasFuelCanister,
            title: hasFuelCanister ? 'Benzin / Yakıt Bidonu Kullan' : 'Çantada Yakıt Bidonu Yok',
            onClick: () => this.#engine.dispatch('base/refuelGenerator'),
          },
          t('base.action.refuel_generator'),
        ),
      ),
    );

    // Production banner if water or food has accumulated
    const waterEntry = storage.find((s) => s.itemId === 'bottled_water');
    const foodEntry = storage.find((s) => s.itemId === 'canned_beans');
    const waterQty = waterEntry?.qty ?? 0;
    const foodQty = foodEntry?.qty ?? 0;
    const hasProduction = waterQty > 0 || foodQty > 0;

    const productionBanner = hasProduction && el(
      'div',
      { class: 'outpost-prod-banner' },
      el(
        'div',
        { class: 'prod-info' },
        el('span', { class: 'prod-title' }, t('base.production_ready')),
        el(
          'span',
          { class: 'prod-counts' },
          waterQty > 0 ? `💧 ${t('item.bottled_water.name')}: ×${waterQty}  ` : null,
          foodQty > 0 ? `🥫 ${t('item.canned_beans.name')}: ×${foodQty}` : null,
        ),
      ),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-accent btn-xs',
          onClick: () => this.#engine.dispatch('base/collectAll'),
        },
        t('base.action.collect_all'),
      ),
    );

    // Facility Blueprint Cards
    const facilityCards = Object.entries(STRUCTURES).map(([id, def]) => {
      const level = structures[id] ?? 0;
      const isBuilt = level > 0;
      const isSelected = this.#selectedFacilityId === id;

      let statusBadge = isBuilt ? `LVL ${level}/${def.maxLevel}` : 'KİLİTLİ';
      if (id === 'generator') {
        statusBadge = generatorActive ? '⚡ AÇIK' : (level > 0 ? 'KAPALI' : 'YOK');
      } else if (id === 'rain_catcher' && waterQty > 0) {
        statusBadge = `💧 ×${waterQty}`;
      } else if (id === 'greenhouse' && foodQty > 0) {
        statusBadge = `🥫 ×${foodQty}`;
      }

      return el(
        'button',
        {
          type: 'button',
          class: [
            'facility-card',
            isSelected && 'is-selected',
            isBuilt && 'is-built',
          ],
          onClick: () => {
            this.#selectedFacilityId = this.#selectedFacilityId === id ? null : id;
            try { audioEngine.playTerminalClick?.(); } catch {}
            this.renderBase(this.#lastState);
          },
        },
        el('span', { class: 'facility-glyph' }, def.glyph),
        el('span', { class: 'facility-name' }, t(`structure.${id}.name`)),
        el('span', { class: ['facility-status-badge', isBuilt ? 'tone-good' : 'tone-dim'] }, statusBadge),
      );
    });

    const hintBanner = el(
      'div',
      { class: 'inv-hint-banner' },
      el('span', { class: 'inv-hint-icon' }, '🏗️'),
      el('span', { class: 'inv-hint-text' }, t('base.facility_inspect_prompt')),
    );

    return el(
      'div',
      { class: 'facilities-tab-body' },
      generatorControlStrip,
      productionBanner,
      el('div', { class: 'facility-blueprint-grid' }, facilityCards),
      hintBanner,
    );
  }

  #renderFacilityInspectModal(structureId, state) {
    const def = getStructure(structureId);
    if (!def) return null;

    const level = state.base.structures?.[structureId] ?? 0;
    const maxed = level >= def.maxLevel;
    const cost = maxed ? [] : def.costs[level];
    const affordable = !maxed && canAffordCost(state, cost);

    const closeModal = () => {
      this.#selectedFacilityId = null;
      if (this.#lastState) this.renderBase(this.#lastState);
    };

    const costPills = cost.map(({ itemId, qty }) => {
      const have = countItem(state.inventory, itemId);
      return el(
        'span',
        { class: ['ing-pill', have >= qty ? 'tone-good' : 'tone-bad'] },
        `${t(`item.${itemId}.name`)} ${have}/${qty}`,
      );
    });

    return el(
      'div',
      {
        class: 'item-inspect-overlay',
        onClick: (e) => {
          if (e.target === e.currentTarget) closeModal();
        },
      },
      el(
        'div',
        { class: 'item-inspect-modal' },
        el(
          'div',
          { class: 'inspect-header' },
          el(
            'div',
            { class: 'inspect-title-wrap' },
            el('span', { class: 'inspect-glyph' }, def.glyph),
            el(
              'div',
              { class: 'inspect-meta' },
              el('strong', { class: 'inspect-name' }, t(`structure.${structureId}.name`)),
              el(
                'div',
                { class: 'inspect-sub-tags' },
                el('span', { class: ['route-mode-tag', level > 0 ? 'tone-good' : 'tone-dim'] }, `${t('skill.level_short', { level })} / ${def.maxLevel}`),
                el('span', { class: 'item-weight' }, `⏱ ${def.minutes}m`),
              ),
            ),
          ),
          el(
            'button',
            {
              type: 'button',
              class: 'inspect-close-btn',
              title: t('ui.close') || 'KAPAT',
              onClick: closeModal,
            },
            '✕',
          ),
        ),
        el(
          'div',
          { class: 'item-inspect-body' },
          el('p', { class: 'inspect-desc' }, t(`structure.${structureId}.desc`)),
          !maxed && el(
            'div',
            { class: 'craft-req-box' },
            el('div', { class: 'craft-req-title' }, t('crafting.ingredients_needed')),
            el('div', { class: 'ing-list' }, costPills),
          ),
          el(
            'div',
            { class: 'inspect-actions-row' },
            el(
              'button',
              {
                type: 'button',
                class: ['btn', 'btn-accent', 'btn-inspect-act-primary', (!affordable || maxed) && 'is-disabled'],
                disabled: !affordable || maxed,
                onClick: () => {
                  this.#selectedFacilityId = null;
                  this.#engine.dispatch('base/upgrade', { structureId });
                },
              },
              maxed ? t('skill.max_level') : `🏗️ ${t('base.action.upgrade')}`,
            ),
          ),
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost btn-xs btn-inspect-modal-close',
            onClick: closeModal,
          },
          `✕ ${t('ui.close') || 'KAPAT'}`,
        ),
      ),
    );
  }

  // --- SUB-TAB 2: LOGISTICS STORAGE TAB ---
  #renderStorageTab(state) {
    const storage = state.base.storage ?? [];
    const packStacks = state.inventory.stacks ?? [];

    const quickBar = el(
      'div',
      { class: 'locker-quick-bar' },
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-accent btn-xs',
          onClick: () => this.#engine.dispatch('base/stashMaterials'),
        },
        t('base.action.stash_all_materials'),
      ),
      storage.length > 0 && el(
        'button',
        {
          type: 'button',
          class: 'btn btn-outline btn-xs',
          onClick: () => this.#engine.dispatch('base/collectAll'),
        },
        t('base.action.collect_all'),
      ),
      storage.length > 0 && el(
        'button',
        {
          type: 'button',
          class: 'btn btn-ghost btn-xs',
          onClick: () => this.#engine.dispatch('base/withdrawAll'),
        },
        t('base.action.take_all'),
      ),
    );

    const STORAGE_PER_PAGE = 6;
    const totalStoragePages = Math.max(1, Math.ceil(storage.length / STORAGE_PER_PAGE));
    this.#storagePage = Math.min(Math.max(1, this.#storagePage || 1), totalStoragePages);
    const startStorageIdx = (this.#storagePage - 1) * STORAGE_PER_PAGE;
    const pagedStorage = storage.slice(startStorageIdx, startStorageIdx + STORAGE_PER_PAGE);

    const storagePager = totalStoragePages > 1
      ? el(
        'div',
        { class: 'pagination-bar' },
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', 'btn-page', this.#storagePage <= 1 && 'is-disabled'],
            disabled: this.#storagePage <= 1,
            onClick: () => {
              this.#storagePage = Math.max(1, this.#storagePage - 1);
              this.renderBase(this.#lastState);
            },
          },
          '◀',
        ),
        el(
          'span',
          { class: 'page-indicator' },
          t('ui.page', { current: this.#storagePage, total: totalStoragePages }),
        ),
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', 'btn-page', this.#storagePage >= totalStoragePages && 'is-disabled'],
            disabled: this.#storagePage >= totalStoragePages,
            onClick: () => {
              this.#storagePage = Math.min(totalStoragePages, this.#storagePage + 1);
              this.renderBase(this.#lastState);
            },
          },
          '▶',
        ),
      )
      : null;

    const storedList = storage.length === 0
      ? el('p', { class: 'muted-note pad-xs' }, t('base.storage_empty'))
      : el(
        'ul',
        { class: 'item-list locker-items-list' },
        pagedStorage.map(({ itemId, qty }) => {
          const item = getItem(itemId);
          return el(
            'li',
            { class: 'item-row' },
            el('span', { class: 'item-glyph' }, item.glyph),
            el(
              'div',
              { class: 'item-main' },
              el(
                'div',
                { class: 'item-title-line' },
                el('span', { class: 'item-name' }, t(`item.${itemId}.name`)),
                el('span', { class: 'item-qty tone-good' }, `×${qty}`),
              ),
            ),
            el(
              'div',
              { class: 'item-actions locker-actions-group' },
              el(
                'button',
                {
                  type: 'button',
                  class: 'btn btn-xs',
                  onClick: () => this.#engine.dispatch('base/withdraw', { itemId, qty: 1 }),
                },
                qty > 1 ? t('inventory.action.take_one') : t('inventory.action.take'),
              ),
              qty > 1 && el(
                'button',
                {
                  type: 'button',
                  class: 'btn btn-outline btn-xs',
                  onClick: () => this.#engine.dispatch('base/withdrawAll', { itemId }),
                },
                t('inventory.action.take_all_item', { count: qty }),
              ),
            ),
          );
        }),
      );

    const stashQuickBtns = packStacks.map(({ itemId, qty }) =>
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-ghost btn-xs stash-stack-btn',
          onClick: () => this.#engine.dispatch('base/store', { itemId, qty: 1 }),
        },
        `+ ${t(`item.${itemId}.name`)} (${qty})`,
      ),
    );

    return el(
      'div',
      { class: 'storage-tab-body' },
      quickBar,
      storedList,
      storagePager,
      packStacks.length > 0 && el(
        'div',
        { class: 'ops-actions stash-pack-bar' },
        ...stashQuickBtns,
      ),
    );
  }

  // --- SUB-TAB 3: DEFENSE & THREAT RADAR TAB ---
  #renderDefenseTab(state) {
    const { integrity = 100, structures = {}, defenseLogs = [], generatorActive = false } = state.base;
    const threat = calculateThreatLevel(state);
    const barricadeLvl = structures.barricade ?? 0;
    const defenseScore = barricadeLvl * 35 + Math.round(integrity * 0.35) + (generatorActive ? 25 : 0);

    const threatLabel = threat > 60
      ? t('base.threat_high')
      : (threat > 30 ? t('base.threat_medium') : t('base.threat_low'));

    const radarCard = el(
      'div',
      { class: 'threat-radar-card' },
      el(
        'div',
        { class: 'radar-header' },
        el('span', { class: 'radar-title' }, `📡 ${t('base.threat_label')}`),
        el('strong', { class: ['radar-status', threat > 60 ? 'tone-bad' : 'tone-warn'] }, `%${threat} [${threatLabel}]`),
      ),
      el(
        'div',
        { class: 'meter-track' },
        el('div', {
          class: ['meter-fill', threat > 60 ? 'fill-bad' : 'fill-warn'],
          style: `width: ${threat}%`,
        }),
      ),
      el(
        'div',
        { class: 'radar-factors' },
        el('span', { class: 'factor-pill' }, `🛡️ Barikat Koruması: -${barricadeLvl * 10}`),
        generatorActive && el('span', { class: 'factor-pill tone-good' }, '⚡ Projektör Aydınlatması: -15'),
        el('span', { class: 'factor-pill' }, `⚔️ Toplam Savunma Gücü: ${defenseScore}`),
      ),
    );

    const integrityBox = el(
      'div',
      { class: 'perimeter-integrity-box' },
      el(
        'div',
        { class: 'integrity-header' },
        el('span', { class: 'integrity-label' }, t('base.integrity')),
        el('strong', { class: ['meta-val', integrity < 50 ? 'tone-bad' : 'tone-good'] }, `${Math.round(integrity)}%`),
      ),
      integrity < 100 && el(
        'button',
        {
          type: 'button',
          class: 'btn btn-xs btn-outline',
          onClick: () => this.#engine.dispatch('base/repair'),
        },
        t('base.action.repair'),
      ),
    );

    const logsList = defenseLogs.length === 0
      ? el('p', { class: 'muted-note pad-xs' }, t('base.no_defense_logs'))
      : el(
        'ul',
        { class: 'defense-log-list' },
        defenseLogs.map((log) =>
          el(
            'li',
            { class: ['defense-log-item', log.won ? 'is-victory' : 'is-defeat'] },
            el('span', { class: 'log-badge' }, log.won ? '🛡️ ' + t('base.raid_won_title') : '⚠️ ' + t('base.raid_lost_title')),
            el('span', { class: 'log-powers' }, `Savunma: ${log.defensePower} vs Tehdit: ${log.attackPower}`),
            log.won
              ? el('span', { class: 'log-result tone-good' }, `+${log.lootQty}x Hurda Metal kazanıldı`)
              : el('span', { class: 'log-result tone-bad' }, `-%${log.damage} Tahkimat Hasarı`),
          ),
        ),
      );

    return el(
      'div',
      { class: 'defense-tab-body' },
      radarCard,
      integrityBox,
      el('h4', { class: 'block-title' }, 'GÜVENLİK VE BASKIN GÜNLÜĞÜ'),
      logsList,
    );
  }
}
