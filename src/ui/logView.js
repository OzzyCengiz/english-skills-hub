import { formatClock, readClock } from '../core/clock.js';
import { t } from '../i18n/i18n.js';
import { el } from './dom.js';

export class LogView {
  #listEl;
  #toastEl;
  #toastTimer = null;
  #currentPage = 1;
  #lastState = null;
  #pagerEl = null;

  constructor({ listEl, toastEl }) {
    this.#listEl = listEl;
    this.#toastEl = toastEl;
  }

  render(state) {
    if (!this.#listEl) return;
    this.#lastState = state;
    const entries = (state.log || []).slice(-100).reverse();
    const LOGS_PER_PAGE = 7;
    const totalPages = Math.max(1, Math.ceil(entries.length / LOGS_PER_PAGE));
    this.#currentPage = Math.min(Math.max(1, this.#currentPage || 1), totalPages);

    const startIndex = (this.#currentPage - 1) * LOGS_PER_PAGE;
    const pagedEntries = entries.slice(startIndex, startIndex + LOGS_PER_PAGE);

    const nodes = pagedEntries.map((entry) => {
      const { day } = readClock(entry.at);
      const stamp = `${t('hud.day_short', { day })} ${formatClock(entry.at)}`;
      return el(
        'li',
        { class: ['log-entry', `tone-${entry.tone ?? 'plain'}`] },
        el('span', { class: 'log-stamp' }, stamp),
        el('span', { class: 'log-msg' }, t(entry.key, entry.params)),
      );
    });
    this.#listEl.replaceChildren(...nodes);

    this.#renderPager(totalPages);
  }

  #renderPager(totalPages) {
    const parent = this.#listEl.parentElement;
    if (!parent) return;

    if (!this.#pagerEl) {
      this.#pagerEl = el('div', { class: 'pagination-bar log-pagination-bar' });
      parent.insertBefore(this.#pagerEl, this.#listEl);
    }

    if (totalPages <= 1) {
      this.#pagerEl.style.display = 'none';
      return;
    }

    this.#pagerEl.style.display = 'flex';
    this.#pagerEl.replaceChildren(
      el(
        'button',
        {
          type: 'button',
          class: ['btn', 'btn-xs', 'btn-page', this.#currentPage <= 1 && 'is-disabled'],
          disabled: this.#currentPage <= 1,
          onClick: () => {
            this.#currentPage = Math.max(1, this.#currentPage - 1);
            if (this.#lastState) this.render(this.#lastState);
          },
        },
        '◀',
      ),
      el(
        'span',
        { class: 'page-indicator' },
        t('ui.page', { current: this.#currentPage, total: totalPages }),
      ),
      el(
        'button',
        {
          type: 'button',
          class: ['btn', 'btn-xs', 'btn-page', this.#currentPage >= totalPages && 'is-disabled'],
          disabled: this.#currentPage >= totalPages,
          onClick: () => {
            this.#currentPage = Math.min(totalPages, this.#currentPage + 1);
            if (this.#lastState) this.render(this.#lastState);
          },
        },
        '▶',
      ),
    );
  }

  flashRejection(reasonKey, params = {}) {
    if (!this.#toastEl) return;
    this.#toastEl.textContent = t(reasonKey, params);
    this.#toastEl.classList.add('is-visible');
    clearTimeout(this.#toastTimer);
    this.#toastTimer = setTimeout(() => {
      this.#toastEl.classList.remove('is-visible');
    }, 2400);
  }
}

