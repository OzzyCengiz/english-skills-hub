import { getItem } from '../data/items.js';
import { t } from '../i18n/i18n.js';
import {
  BarterEngine,
  MERCHANT_PROFILES,
  MERCHANT_TYPES,
  getItemBarterValue,
} from '../modules/economy/barterEngine.js';
import { el } from './dom.js';

export class BarterModalView {
  #root;
  #engine;

  constructor(root, engine) {
    this.#root = root;
    this.#engine = engine;

    engine.bus.on('barter:modal', ({ active }) => {
      if (active) {
        this.open();
      } else {
        this.close();
      }
    });
  }

  get isOpen() {
    return !this.#root.hidden;
  }

  open() {
    this.#root.hidden = false;
    this.render();
  }

  close() {
    this.#root.hidden = true;
    this.#root.replaceChildren();
  }

  render() {
    if (this.#root.hidden) return;

    const state = this.#engine.store.state;
    const session = state.economy?.activeSession;
    if (!session) {
      this.close();
      return;
    }

    const profile = MERCHANT_PROFILES[session.merchantType] || MERCHANT_PROFILES[MERCHANT_TYPES.NOMAD_CARAVAN];
    const merchantTitle = t(`barter.merchant.${session.merchantType}.name`);
    const merchantDesc = t(`barter.merchant.${session.merchantType}.desc`);

    // Prepare arrays for evaluation
    const playerOfferArr = Object.entries(session.playerOffer).map(([itemId, qty]) => ({ itemId, qty }));
    const merchantDemandArr = Object.entries(session.merchantDemands).map(([itemId, qty]) => ({ itemId, qty }));

    const evaluation = BarterEngine.evaluateTrade({
      playerOffer: playerOfferArr,
      merchantDemands: merchantDemandArr,
      merchantType: session.merchantType,
      state,
      haggleDiscount: session.haggleDiscount,
    });

    // 1. Header
    const headerEl = el(
      'div',
      { class: 'action-modal-header' },
      el('div', { class: 'encounter-kicker' }, `${t('barter.kicker')} // ${t(`faction.${session.faction}.name`)}`),
      el('h3', { class: 'action-modal-title' }, merchantTitle),
    );

    // 2. Evaluation Status Bar
    const statusClass = evaluation.isBalanced ? 'is-good' : 'is-danger';
    const statusText = evaluation.isBalanced
      ? `✓ ${t('barter.status_balanced')}`
      : `⚠ ${t('barter.status_insufficient', { diff: Math.abs(evaluation.difference) })}`;

    const evaluationEl = el(
      'div',
      { class: 'barter-eval-bar' },
      el(
        'div',
        { class: 'barter-value-group' },
        el('span', { class: 'muted-note' }, t('barter.player_offered_val')),
        el('strong', { class: 'barter-val-num' }, `${evaluation.playerTotal} pts`),
      ),
      el(
        'div',
        { class: 'barter-value-group' },
        el('span', { class: 'muted-note' }, t('barter.merchant_demanded_val')),
        el('strong', { class: 'barter-val-num' }, `${evaluation.merchantRequiredTotal} pts`),
      ),
      el(
        'div',
        { class: ['barter-status-tag', statusClass] },
        statusText,
      ),
    );

    // 3. Two-Column Exchange Area
    // Left: Player Inventory Stacks
    const playerStacks = state.inventory.stacks || [];
    const playerItemsList = el(
      'div',
      { class: 'barter-column-list' },
      playerStacks.length === 0
        ? el('p', { class: 'muted-note' }, t('barter.player_empty'))
        : playerStacks.map(({ itemId, qty: totalQty }) => {
            const def = getItem(itemId);
            const val = getItemBarterValue(itemId);
            const currentlyOffered = session.playerOffer[itemId] || 0;

            return el(
              'div',
              { class: ['barter-item-row', currentlyOffered > 0 && 'is-active'] },
              el(
                'div',
                { class: 'barter-item-meta' },
                el('span', { class: 'barter-item-name' }, t(`item.${itemId}.name`)),
                el('span', { class: 'muted-note' }, `${val} pts · pack: ${totalQty}`),
              ),
              el(
                'div',
                { class: 'barter-stepper' },
                el(
                  'button',
                  {
                    type: 'button',
                    class: ['btn btn-xs', currentlyOffered === 0 && 'is-disabled'],
                    disabled: currentlyOffered === 0,
                    onClick: () => this.#engine.dispatch('economy/togglePlayerOffer', { itemId, delta: -1 }),
                  },
                  '-',
                ),
                el('span', { class: 'barter-qty-indicator' }, String(currentlyOffered)),
                el(
                  'button',
                  {
                    type: 'button',
                    class: ['btn btn-xs', currentlyOffered >= totalQty && 'is-disabled'],
                    disabled: currentlyOffered >= totalQty,
                    onClick: () => this.#engine.dispatch('economy/togglePlayerOffer', { itemId, delta: 1 }),
                  },
                  '+',
                ),
              ),
            );
          }),
    );

    // Right: Merchant Stock
    const merchantStock = profile.inventoryStock || [];
    const merchantItemsList = el(
      'div',
      { class: 'barter-column-list' },
      merchantStock.map(({ itemId, qty: maxStock }) => {
        const val = getItemBarterValue(itemId);
        const wanted = session.merchantDemands[itemId] || 0;

        return el(
          'div',
          { class: ['barter-item-row', wanted > 0 && 'is-active'] },
          el(
            'div',
            { class: 'barter-item-meta' },
            el('span', { class: 'barter-item-name' }, t(`item.${itemId}.name`)),
            el('span', { class: 'muted-note' }, `${val} pts · stock: ${maxStock}`),
          ),
          el(
            'div',
            { class: 'barter-stepper' },
            el(
              'button',
              {
                type: 'button',
                class: ['btn btn-xs', wanted === 0 && 'is-disabled'],
                disabled: wanted === 0,
                onClick: () => this.#engine.dispatch('economy/toggleMerchantDemand', { itemId, delta: -1 }),
              },
              '-',
            ),
            el('span', { class: 'barter-qty-indicator' }, String(wanted)),
            el(
              'button',
              {
                type: 'button',
                class: ['btn btn-xs', wanted >= maxStock && 'is-disabled'],
                disabled: wanted >= maxStock,
                onClick: () => this.#engine.dispatch('economy/toggleMerchantDemand', { itemId, delta: 1 }),
              },
              '+',
            ),
          ),
        );
      }),
    );

    const columnsGrid = el(
      'div',
      { class: 'barter-columns-grid' },
      el(
        'div',
        { class: 'barter-col' },
        el('div', { class: 'tactical-subhead' }, `🎒 ${t('barter.col_player')}`),
        playerItemsList,
      ),
      el(
        'div',
        { class: 'barter-col' },
        el('div', { class: 'tactical-subhead' }, `📦 ${t('barter.col_merchant')}`),
        merchantItemsList,
      ),
    );

    // 4. Modal Footer Controls
    const canTrade = evaluation.isBalanced && merchantDemandArr.length > 0;
    const footerEl = el(
      'div',
      { class: 'action-modal-footer barter-footer' },
      el(
        'button',
        {
          type: 'button',
          class: ['btn btn-xs', session.haggleAttempted && 'is-disabled'],
          disabled: session.haggleAttempted,
          onClick: () => this.#engine.dispatch('economy/haggle'),
        },
        session.haggleAttempted
          ? `✓ ${t('barter.haggle_done')} (${evaluation.discountPercent}% off)`
          : `💬 ${t('barter.action_haggle')}`,
      ),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-xs btn-ghost',
          onClick: () => this.#engine.dispatch('economy/closeBarter'),
        },
        t('barter.action_cancel'),
      ),
      el(
        'button',
        {
          type: 'button',
          class: ['btn btn-xs btn-accent', !canTrade && 'is-disabled'],
          disabled: !canTrade,
          onClick: () => this.#engine.dispatch('economy/executeTrade'),
        },
        `🤝 ${t('barter.action_confirm')}`,
      ),
    );

    const card = el(
      'div',
      { class: 'action-modal-card barter-modal-card' },
      headerEl,
      el('p', { class: 'action-modal-desc' }, merchantDesc),
      evaluationEl,
      columnsGrid,
      footerEl,
    );

    this.#root.replaceChildren(card);
  }
}

