import { audioEngine } from '../core/audioEngine.js';
import { getItem } from '../data/items.js';
import { i18n, t } from '../i18n/i18n.js';
import { loadSummary } from '../modules/inventory/inventorySelectors.js';
import { el } from './dom.js';

export class LootModalView {
  #root;
  #engine;
  #current = null;
  #selectedMap = new Map(); // index -> boolean
  #isScanning = false;
  #scanProgress = 0;
  #revealedCount = 0;
  #scanTimer = null;
  #startTime = 0;
  #scanDuration = 2400;

  // Cached DOM elements for stable, shake-free updates
  #cardEl = null;
  #statusTitleEl = null;
  #counterDigitalEl = null;
  #progressFillEl = null;
  #telemetryEl = null;
  #speedupBtnEl = null;
  #itemsListEl = null;
  #placeholderEl = null;
  #capacityLabelEl = null;
  #capacityBarEl = null;
  #footerEl = null;
  #itemRowEls = [];

  constructor(root, engine) {
    this.#root = root;
    this.#engine = engine;
  }

  get isOpen() {
    return !this.#root.hidden;
  }

  open({ type, titleKey, descKey, descParams = {}, items = [], nodeId, onConfirm }) {
    this.#clearScanTimer();
    this.#current = {
      type,
      titleKey,
      descKey,
      descParams,
      items,
      nodeId,
      onConfirm,
    };
    this.#selectedMap.clear();
    items.forEach((_, idx) => this.#selectedMap.set(idx, true));

    const isScavenge = type === 'scavenge' || type === 'scavenge_empty';
    if (isScavenge) {
      this.#isScanning = true;
      this.#scanProgress = 0;
      this.#revealedCount = 0;
      this.#scanDuration = items.length > 0 ? 2500 : 1600;
      this.#startTime = Date.now();
      this.#root.hidden = false;
      this.#buildInitialCard();
      this.#startScan(items);
    } else {
      this.#isScanning = false;
      this.#scanProgress = 100;
      this.#revealedCount = items.length;
      this.#root.hidden = false;
      this.#buildInitialCard();
    }
  }

  close() {
    this.#clearScanTimer();
    this.#root.hidden = true;
    this.#current = null;
    this.#selectedMap.clear();
    this.#isScanning = false;
    this.#scanProgress = 0;
    this.#revealedCount = 0;
    this.#cardEl = null;
    this.#itemRowEls = [];
  }

  #clearScanTimer() {
    if (this.#scanTimer) {
      clearInterval(this.#scanTimer);
      this.#scanTimer = null;
    }
  }

  #startScan(items) {
    this.#clearScanTimer();
    const count = items.length;

    this.#scanTimer = setInterval(() => {
      if (!this.#current || this.#root.hidden) {
        this.#clearScanTimer();
        return;
      }
      const elapsed = Date.now() - this.#startTime;
      const progress = Math.min(100, Math.floor((elapsed / this.#scanDuration) * 100));
      this.#scanProgress = progress;

      // In-place dynamic updates without re-creating card DOM
      if (this.#progressFillEl) {
        this.#progressFillEl.style.width = `${progress}%`;
      }
      if (this.#counterDigitalEl) {
        this.#counterDigitalEl.textContent = `%${progress}`;
      }

      if (count > 0) {
        for (let i = this.#revealedCount; i < count; i++) {
          const threshold = count === 1 ? 38 : Math.round(18 + (i / count) * 68);
          if (progress >= threshold) {
            this.#revealNextItem(i, items[i]);
            this.#revealedCount = i + 1;
            try {
              audioEngine.playGearRustle?.(0.35);
              audioEngine.playTerminalClick?.(1.1 + (i % 4) * 0.12, 0.4);
            } catch {}
          }
        }
      }

      if (progress >= 100) {
        this.#finishScan(items);
      }
    }, 45);
  }

  #revealNextItem(idx, item) {
    if (this.#placeholderEl && this.#placeholderEl.isConnected) {
      this.#placeholderEl.remove();
    }

    if (this.#telemetryEl && this.#current) {
      this.#telemetryEl.textContent = t('loot.scanner.items_detected', {
        revealed: idx + 1,
        total: this.#current.items.length,
      });
    }

    const row = this.#createItemRow(item, idx, true);
    this.#itemRowEls[idx] = row;
    this.#itemsListEl?.appendChild(row);
    this.#updateCapacityUI();
  }

  #finishScan(items) {
    this.#clearScanTimer();
    this.#isScanning = false;
    this.#scanProgress = 100;

    // Reveal any remaining items that didn't pop in yet
    for (let i = this.#revealedCount; i < items.length; i++) {
      this.#revealNextItem(i, items[i]);
    }
    this.#revealedCount = items.length;

    if (this.#placeholderEl && this.#placeholderEl.isConnected) {
      this.#placeholderEl.remove();
    }

    if (this.#progressFillEl) {
      this.#progressFillEl.style.width = '100%';
      this.#progressFillEl.classList.add('is-complete');
    }
    if (this.#counterDigitalEl) {
      this.#counterDigitalEl.textContent = '✓ 100%';
      this.#counterDigitalEl.classList.add('is-done');
    }
    if (this.#statusTitleEl) {
      this.#statusTitleEl.textContent =
        items.length > 0 ? t('loot.scanner.completed') : t('loot.scanner.empty_status');
    }
    if (this.#telemetryEl) {
      this.#telemetryEl.textContent =
        items.length > 0
          ? t('loot.scanner.completed_desc', { count: items.length })
          : t('loot.scanner.empty_desc');
    }
    if (this.#speedupBtnEl) {
      this.#speedupBtnEl.style.display = 'none';
    }

    // Enable inputs on item rows
    this.#itemRowEls.forEach((rowEl) => {
      if (!rowEl) return;
      const cb = rowEl.querySelector('input[type="checkbox"]');
      if (cb) cb.disabled = false;
      const btn = rowEl.querySelector('button');
      if (btn) btn.disabled = false;
    });

    // Update footer with interactive action buttons
    this.#renderUnlockedFooter();
    this.#updateCapacityUI();

    try {
      if (items.length > 0) {
        audioEngine.playAchievementChime?.();
      } else {
        audioEngine.playWarningAlarm?.(320, 0.2, 0.35);
      }
    } catch {}
  }

  #finishScanImmediately() {
    if (!this.#current) return;
    this.#finishScan(this.#current.items || []);
  }

  #createItemRow(item, idx, isScanning) {
    const def = getItem(item.itemId);
    const isSelected = Boolean(this.#selectedMap.get(idx));
    const totalItemWeight = i18n.formatNumber(def.weight * item.qty, 2);

    const checkbox = el('input', {
      type: 'checkbox',
      class: 'loot-item-checkbox',
      checked: isSelected,
      disabled: isScanning,
      onChange: (e) => {
        if (this.#isScanning) return;
        this.#toggleSelect(idx, e.target.checked);
      },
    });

    const toggleBtn = el(
      'button',
      {
        type: 'button',
        class: ['btn', 'btn-xs', isSelected ? 'btn-accent' : 'btn-ghost'],
        disabled: isScanning,
      },
      isSelected ? '✓' : '−',
    );

    const row = el(
      'div',
      {
        class: ['loot-item-row', isSelected && 'is-selected', 'loot-item-revealed-anim'],
        onClick: () => {
          if (this.#isScanning) return;
          this.#toggleSelect(idx, !this.#selectedMap.get(idx));
        },
      },
      el('div', { class: 'loot-item-check-col' }, checkbox),
      el('span', { class: 'item-glyph' }, def.glyph),
      el(
        'div',
        { class: 'loot-item-details' },
        el(
          'div',
          { class: 'loot-item-title-line' },
          el(
            'strong',
            { class: ['loot-item-name', def.rarity ? `rarity-${def.rarity}` : ''] },
            t(`item.${item.itemId}.name`),
          ),
          el('span', { class: 'loot-item-qty' }, `×${item.qty}`),
        ),
        el(
          'div',
          { class: 'loot-item-meta-row' },
          el(
            'span',
            { class: ['loot-item-rarity', def.rarity ? `rarity-${def.rarity}` : ''] },
            t(`rarity.${def.rarity || 'common'}`),
          ),
          el('span', { class: 'loot-item-weight' }, `${totalItemWeight} kg`),
        ),
      ),
      toggleBtn,
    );

    return row;
  }

  #toggleSelect(idx, val) {
    this.#selectedMap.set(idx, val);
    const rowEl = this.#itemRowEls[idx];
    if (rowEl) {
      rowEl.classList.toggle('is-selected', val);
      const cb = rowEl.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = val;
      const btn = rowEl.querySelector('button');
      if (btn) {
        btn.textContent = val ? '✓' : '−';
        btn.classList.toggle('btn-accent', val);
        btn.classList.toggle('btn-ghost', !val);
      }
    }
    this.#updateCapacityUI();
    this.#updateTakeSelectedBtn();
  }

  #updateCapacityUI() {
    if (!this.#capacityBarEl || !this.#current) return;
    const state = this.#engine.store.state;
    const summary = loadSummary(state);

    let selectedWeight = 0;
    this.#current.items.forEach((item, idx) => {
      if (idx < this.#revealedCount && this.#selectedMap.get(idx)) {
        const itemDef = getItem(item.itemId);
        selectedWeight += itemDef.weight * item.qty;
      }
    });

    const projectedWeight = summary.weight + selectedWeight;
    const isOverload = projectedWeight > summary.capacityKg;

    if (this.#capacityLabelEl) {
      this.#capacityLabelEl.textContent = t('loot.load_status', {
        current: i18n.formatNumber(summary.weight, 1),
        max: i18n.formatNumber(summary.capacityKg, 1),
        selected: i18n.formatNumber(selectedWeight, 2),
      });
    }

    this.#capacityBarEl.classList.toggle('is-overload', isOverload);
    this.#capacityBarEl.style.display = this.#revealedCount > 0 ? 'flex' : 'none';
  }

  #updateTakeSelectedBtn() {
    if (!this.#footerEl) return;
    const btn = this.#footerEl.querySelector('.js-take-selected');
    if (!btn || !this.#current) return;

    let selectedCount = 0;
    this.#current.items.forEach((_, idx) => {
      if (this.#selectedMap.get(idx)) selectedCount += 1;
    });

    btn.textContent = t('loot.action.take_selected', { count: selectedCount });
    btn.disabled = selectedCount === 0;
    btn.classList.toggle('is-disabled', selectedCount === 0);
  }

  #renderUnlockedFooter() {
    if (!this.#footerEl || !this.#current) return;
    const { items, onConfirm } = this.#current;
    const hasItems = items.length > 0;

    let selectedCount = 0;
    items.forEach((_, idx) => {
      if (this.#selectedMap.get(idx)) selectedCount += 1;
    });

    if (hasItems) {
      this.#footerEl.replaceChildren(
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost loot-action-btn',
            onClick: () => {
              const left = [...items];
              this.close();
              onConfirm?.([], left);
            },
          },
          t('loot.action.leave_all'),
        ),
        el(
          'button',
          {
            type: 'button',
            class: [
              'btn',
              'loot-action-btn',
              'js-take-selected',
              selectedCount === 0 && 'is-disabled',
            ],
            disabled: selectedCount === 0,
            onClick: () => {
              const taken = [];
              const left = [];
              items.forEach((it, idx) => {
                if (this.#selectedMap.get(idx)) taken.push(it);
                else left.push(it);
              });
              this.close();
              onConfirm?.(taken, left);
            },
          },
          t('loot.action.take_selected', { count: selectedCount }),
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent loot-action-btn',
            onClick: () => {
              const taken = [...items];
              this.close();
              onConfirm?.(taken, []);
            },
          },
          t('loot.action.take_all'),
        ),
      );
    } else {
      this.#footerEl.replaceChildren(
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent loot-action-btn',
            onClick: () => {
              this.close();
              onConfirm?.([], []);
            },
          },
          t('loot.action.close'),
        ),
      );
    }
  }

  #buildInitialCard() {
    const { type, titleKey, descKey, descParams, items } = this.#current;
    const hasItems = items.length > 0;
    const isScavenge = type === 'scavenge' || type === 'scavenge_empty';

    const kickerText = t(titleKey);
    const descText = t(descKey, descParams);

    this.#itemRowEls = [];

    // 1. Radar Scanner Header Box
    let scannerCard = null;
    if (isScavenge) {
      this.#statusTitleEl = el(
        'strong',
        { class: 'scavenge-status-title' },
        this.#isScanning
          ? t('loot.scanner.searching')
          : hasItems
          ? t('loot.scanner.completed')
          : t('loot.scanner.empty_status'),
      );

      this.#counterDigitalEl = el(
        'span',
        { class: ['scavenge-counter-digital', !this.#isScanning && 'is-done'] },
        this.#isScanning ? `%${this.#scanProgress}` : '✓ 100%',
      );

      this.#progressFillEl = el('div', {
        class: ['scavenge-progress-fill', !this.#isScanning && 'is-complete'],
        style: `width: ${this.#scanProgress}%;`,
      });

      this.#telemetryEl = el(
        'span',
        { class: 'scavenge-telemetry' },
        this.#isScanning
          ? t('loot.scanner.telemetry_searching')
          : hasItems
          ? t('loot.scanner.completed_desc', { count: items.length })
          : t('loot.scanner.empty_desc'),
      );

      this.#speedupBtnEl = el(
        'button',
        {
          type: 'button',
          class: 'btn btn-xs btn-accent scavenge-speedup-btn',
          onClick: (e) => {
            e.stopPropagation();
            this.#finishScanImmediately();
          },
        },
        t('loot.scanner.speedup'),
      );

      scannerCard = el(
        'div',
        { class: 'scavenge-counter-card' },
        el(
          'div',
          { class: 'scavenge-counter-header' },
          el(
            'div',
            { class: 'scavenge-header-left' },
            el('span', { class: 'scavenge-radar-pip is-pulsing' }),
            this.#statusTitleEl,
          ),
          el('div', { class: 'scavenge-header-right' }, this.#counterDigitalEl),
        ),
        el('div', { class: 'scavenge-progress-track' }, this.#progressFillEl),
        el('div', { class: 'scavenge-subline' }, this.#telemetryEl, this.#speedupBtnEl),
      );
    }

    // 2. Items List Container
    this.#itemsListEl = el('div', { class: 'loot-items-list' });

    if (isScavenge && this.#isScanning) {
      this.#placeholderEl = el(
        'div',
        { class: 'scavenge-scanning-placeholder' },
        el('span', {}, t('loot.scanner.telemetry_searching')),
      );
      this.#itemsListEl.appendChild(this.#placeholderEl);
    } else if (hasItems) {
      items.forEach((it, idx) => {
        const row = this.#createItemRow(it, idx, false);
        this.#itemRowEls[idx] = row;
        this.#itemsListEl.appendChild(row);
      });
    } else {
      this.#itemsListEl.appendChild(
        el('div', { class: 'loot-empty-note' }, t('loot.no_items')),
      );
    }

    // 3. Capacity Bar
    this.#capacityLabelEl = el('span', { class: 'loot-capacity-label' }, '');
    this.#capacityBarEl = el(
      'div',
      { class: 'loot-capacity-bar', style: 'display: none;' },
      this.#capacityLabelEl,
      el('span', { class: 'loot-overload-alert' }, t('loot.overload_warning')),
    );
    this.#updateCapacityUI();

    // 4. Footer
    this.#footerEl = el('div', { class: 'action-modal-footer' });
    if (this.#isScanning) {
      this.#footerEl.replaceChildren(
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent loot-action-btn',
            onClick: () => this.#finishScanImmediately(),
          },
          t('loot.scanner.speedup'),
        ),
      );
    } else {
      this.#renderUnlockedFooter();
    }

    // 5. Assemble modal card ONCE into DOM
    this.#cardEl = el(
      'div',
      { class: ['action-modal-card', isScavenge && 'scavenge-modal-card'] },
      el(
        'div',
        { class: 'action-modal-header' },
        el('h3', { class: 'action-modal-title' }, kickerText),
      ),
      scannerCard,
      !isScavenge && el('p', { class: 'action-modal-desc' }, descText),
      isScavenge && !this.#isScanning && el('p', { class: 'action-modal-desc' }, descText),
      this.#itemsListEl,
      this.#capacityBarEl,
      this.#footerEl,
    );

    this.#root.replaceChildren(this.#cardEl);
  }

  render() {
    if (!this.#current || this.#root.hidden) return;
    this.#buildInitialCard();
  }
}
