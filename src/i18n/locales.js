/**
 * Locales offered in the settings and main menu.
 */
export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
];

const LOCALE_STORAGE_KEY = 'lastbreath.locale';

export function readPreferredLocale(storage = globalThis.localStorage) {
  const stored = storage?.getItem(LOCALE_STORAGE_KEY);
  if (stored && LOCALES.some(({ code }) => code === stored)) return stored;
  const browser = globalThis.navigator?.language?.slice(0, 2);
  return LOCALES.find(({ code }) => code === browser)?.code ?? LOCALES[0].code;
}

export function storePreferredLocale(code, storage = globalThis.localStorage) {
  storage?.setItem(LOCALE_STORAGE_KEY, code);
}
