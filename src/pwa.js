import { t } from './i18n/i18n.js';
import { el } from './ui/dom.js';

class PwaManager {
  #deferredPrompt = null;
  #installBtn = null;
  #isInstalled = false;

  constructor() {
    this.#isInstalled =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      Boolean(window.navigator?.standalone);
  }

  get isInstalled() {
    return this.#isInstalled;
  }

  get canPrompt() {
    return Boolean(this.#deferredPrompt) || this.isIos;
  }

  get isIos() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream &&
      !this.#isInstalled
    );
  }

  init({ installBtn = document.getElementById('btn-install-app') } = {}) {
    this.#installBtn = installBtn;

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // Capture standard install prompt event (Android / Chromium / Edge / Samsung)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.#deferredPrompt = e;
      this.#updateButtonVisibility();
      console.log('[PWA] beforeinstallprompt captured.');
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.#deferredPrompt = null;
      this.#isInstalled = true;
      this.#updateButtonVisibility();
      console.log('[PWA] App successfully installed.');
    });

    // If on iOS and not yet installed, make button visible
    if (this.isIos) {
      this.#updateButtonVisibility();
    }

    // Bind button click
    if (this.#installBtn) {
      this.#installBtn.addEventListener('click', () => {
        this.install();
      });
    }
  }

  #updateButtonVisibility() {
    if (!this.#installBtn) return;
    if (this.#isInstalled) {
      this.#installBtn.hidden = true;
    } else if (this.#deferredPrompt || this.isIos) {
      this.#installBtn.hidden = false;
    }
  }

  async install() {
    if (this.#isInstalled) {
      window.alert(t('pwa.already_installed'));
      return;
    }

    if (this.#deferredPrompt) {
      this.#deferredPrompt.prompt();
      const choice = await this.#deferredPrompt.userChoice;
      console.log('[PWA] User choice:', choice.outcome);
      if (choice.outcome === 'accepted') {
        this.#deferredPrompt = null;
        this.#isInstalled = true;
        this.#updateButtonVisibility();
      }
      return;
    }

    // iOS or manual install guide
    this.showIosGuide();
  }

  showIosGuide() {
    const existing = document.getElementById('pwa-ios-modal');
    if (existing) existing.remove();

    const isIos = this.isIos;
    const titleText = isIos ? t('pwa.ios_guide_title') : t('pwa.install_title');

    const modal = el(
      'div',
      { id: 'pwa-ios-modal', class: 'premium-modal-backdrop' },
      el(
        'div',
        { class: 'premium-modal-dialog' },
        el(
          'header',
          { class: 'premium-modal-header' },
          el('span', { class: 'premium-kicker' }, '📱 PWA // MOBILE INSTALL'),
          el('h2', { class: 'premium-title' }, titleText),
          el('p', { class: 'premium-desc' }, t('pwa.install_desc')),
        ),
        el(
          'ul',
          { class: 'premium-feature-list' },
          el('li', { class: 'premium-feature-item' }, el('span', { class: 'premium-bullet' }, '1.'), el('span', {}, t('pwa.ios_guide_step1'))),
          el('li', { class: 'premium-feature-item' }, el('span', { class: 'premium-bullet' }, '2.'), el('span', {}, t('pwa.ios_guide_step2'))),
          el('li', { class: 'premium-feature-item' }, el('span', { class: 'premium-bullet' }, '3.'), el('span', {}, t('pwa.ios_guide_step3'))),
        ),
        el(
          'div',
          { class: 'premium-modal-actions' },
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-accent',
              onClick: () => modal.remove(),
            },
            t('pwa.close'),
          ),
        ),
      ),
    );

    document.body.appendChild(modal);
  }
}

export const pwaManager = new PwaManager();

