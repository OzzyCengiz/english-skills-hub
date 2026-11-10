/**
 * Lightweight i18n runtime.
 *
 * - Dictionaries are nested JSON; keys are dot paths (`combat.enemy_appeared`).
 * - `{name}` placeholders are interpolated. A param may itself be a deferred
 *   reference created with `ref(key, params)`, so stored log entries stay
 *   language-neutral and re-render correctly after a locale swap.
 * - Plural entries are objects keyed by Intl.PluralRules categories
 *   (`one`, `few`, `other`, ...) and are selected by `params.count`.
 * - Missing keys fall back to the default locale, then to a visible marker.
 */
export const DEFAULT_LOCALE = 'en';
const LOCALE_BASE_URL = './locales';

class I18n {
  #dictionaries = new Map();
  #locale = DEFAULT_LOCALE;
  #listeners = new Set();
  #pluralRules = new Map();
  #numberFormats = new Map();
  #reportedMissing = new Set();

  get locale() {
    return this.#locale;
  }

  register(locale, dictionary) {
    this.#dictionaries.set(locale, dictionary);
  }

  async load(locale) {
    if (this.#dictionaries.has(locale)) return;
    const response = await fetch(`${LOCALE_BASE_URL}/${locale}.json`);
    if (!response.ok) throw new Error(`Locale "${locale}" failed to load (${response.status})`);
    this.register(locale, await response.json());
  }

  async setLocale(locale) {
    await this.load(DEFAULT_LOCALE);
    await this.load(locale);
    this.#locale = locale;
    if (globalThis.document?.documentElement) {
      globalThis.document.documentElement.lang = locale;
    }
    for (const listener of this.#listeners) listener(locale);
  }

  onChange(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  has(key) {
    return this.#lookup(this.#locale, key) != null || this.#lookup(DEFAULT_LOCALE, key) != null;
  }

  t(key, params = {}) {
    const entry = this.#lookup(this.#locale, key) ?? this.#lookup(DEFAULT_LOCALE, key);
    if (entry == null) return this.#missing(key);

    const template = typeof entry === 'object' ? this.#selectPlural(entry, params.count) : entry;
    if (typeof template !== 'string') return this.#missing(key);
    return template.replace(/\{(\w+)\}/g, (match, name) =>
      name in params ? this.#formatParam(params[name]) : match,
    );
  }

  formatNumber(value, maximumFractionDigits = 1) {
    const cacheKey = `${this.#locale}:${maximumFractionDigits}`;
    if (!this.#numberFormats.has(cacheKey)) {
      this.#numberFormats.set(cacheKey, new Intl.NumberFormat(this.#locale, { maximumFractionDigits }));
    }
    return this.#numberFormats.get(cacheKey).format(value);
  }

  /** Applies `data-i18n="key"` and `data-i18n-attr="attr:key;attr:key"` within a subtree. */
  translateTree(root) {
    for (const node of root.querySelectorAll('[data-i18n]')) {
      node.textContent = this.t(node.dataset.i18n);
    }
    for (const node of root.querySelectorAll('[data-i18n-attr]')) {
      for (const pair of node.dataset.i18nAttr.split(';')) {
        const [attribute, key] = pair.split(':').map((part) => part.trim());
        if (attribute && key) node.setAttribute(attribute, this.t(key));
      }
    }
  }

  #lookup(locale, key) {
    let node = this.#dictionaries.get(locale);
    for (const segment of key.split('.')) {
      if (node == null || typeof node !== 'object') return null;
      node = node[segment];
    }
    return node ?? null;
  }

  #selectPlural(entry, count = 0) {
    if (!this.#pluralRules.has(this.#locale)) {
      this.#pluralRules.set(this.#locale, new Intl.PluralRules(this.#locale));
    }
    const category = this.#pluralRules.get(this.#locale).select(count);
    return entry[category] ?? entry.other;
  }

  #formatParam(value) {
    if (value && typeof value === 'object' && 'key' in value) return this.t(value.key, value.params);
    if (typeof value === 'number') return this.formatNumber(value);
    return String(value);
  }

  #missing(key) {
    if (!this.#reportedMissing.has(key)) {
      this.#reportedMissing.add(key);
      console.warn(`[i18n] missing key "${key}" (${this.#locale})`);
    }
    return `⟦${key}⟧`;
  }
}

export const i18n = new I18n();
export const t = (key, params) => i18n.t(key, params);

/** Deferred translation, safe to persist in state. */
export const ref = (key, params) => (params ? { key, params } : { key });

