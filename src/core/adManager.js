/**
 * Last Breath // Google AdSense (H5 Games Ads) & In-Game Monetization Engine
 * Publisher ID: pub-6006298574044898 (ca-pub-6006298574044898)
 * Governs interstitial ads, rewarded supply drops, premium ad-blocking bypass,
 * URL payment callbacks, and promo/license key verification.
 */

import { audioEngine } from './audioEngine.js';

export const ADSENSE_CLIENT_ID = 'ca-pub-6006298574044898';

export const VALID_PROMO_CODES = [
  'LASTBREATH-PREMIUM-2026',
  'VIP-SURVIVOR',
  'SON-NEFES-VIP',
  'PREMIUM2026',
  'DEV-UNLOCK',
];

export class AdManager {
  #saveManager = null;
  #bus = null;
  #initialized = false;
  #isAdActive = false;

  constructor() {
    this.#checkUrlCallbacks();
  }

  /**
   * Initializes AdManager with engine store and saveManager dependencies.
   */
  init({ saveManager, bus }) {
    this.#saveManager = saveManager;
    this.#bus = bus;
    this.#initialized = true;

    // Configure Google H5 adBreak if available in global scope
    if (typeof window !== 'undefined' && typeof window.adConfig === 'function') {
      try {
        window.adConfig({
          preloadAdBreaks: 'on',
          sound: 'on',
        });
      } catch (e) {
        console.warn('[AdManager] adConfig initialization notice:', e);
      }
    }
  }

  /**
   * Detects payment gateway returns via URL search parameters (e.g., ?premium=true or ?premium_success=true).
   */
  #checkUrlCallbacks() {
    if (typeof window === 'undefined' || !window.location) return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccess = urlParams.has('premium') || urlParams.has('premium_success') || urlParams.get('status') === 'success';

      if (isSuccess) {
        if (this.#saveManager) {
          this.#saveManager.setPremium(true);
        } else {
          // Fallback direct storage access if called before init
          try {
            window.localStorage?.setItem('lastbreath.is_premium', 'true');
          } catch {}
        }

        // Clean up URL parameters cleanly without refreshing
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);

        // Show celebratory notification after dom load
        setTimeout(() => {
          this.#showToast('👑 PREMIUM AKTİF! Tüm Reklamlar Kaldırıldı & 10 Yuva Açıldı.');
          audioEngine.playAchievementChime();
        }, 1200);
      }
    } catch (e) {
      console.warn('[AdManager] URL callback check notice:', e);
    }
  }

  /**
   * Checks whether the active player has Lifetime Premium unlocked.
   */
  isPremium() {
    return Boolean(this.#saveManager?.isPremium());
  }

  /**
   * Triggers an Interstitial Ad (e.g., upon character death or between expeditions).
   * If player has Premium, the ad is instantly bypassed with zero delay.
   */
  showInterstitial({ name = 'expedition_break', onComplete } = {}) {
    if (this.isPremium()) {
      if (onComplete) onComplete({ shown: false, reason: 'premium_user' });
      return Promise.resolve({ shown: false, reason: 'premium_user' });
    }

    return new Promise((resolve) => {
      let resolved = false;
      const finish = (result) => {
        if (resolved) return;
        resolved = true;
        this.#isAdActive = false;
        if (onComplete) onComplete(result);
        resolve(result);
      };

      // 1. Check if official Google H5 adBreak API is present
      if (typeof window !== 'undefined' && typeof window.adBreak === 'function') {
        this.#isAdActive = true;
        try {
          window.adBreak({
            type: 'next',
            name,
            beforeAd: () => {
              this.#muteGameAudio(true);
            },
            afterAd: () => {
              this.#muteGameAudio(false);
            },
            adBreakDone: (placementInfo) => {
              this.#muteGameAudio(false);
              finish({ shown: true, placementInfo });
            },
          });

          // Safety timeout in case ad blocker stops adBreakDone callback
          setTimeout(() => {
            finish({ shown: false, reason: 'adblock_or_timeout' });
          }, 8000);
          return;
        } catch (e) {
          console.warn('[AdManager] adBreak error, falling back to simulated dialog:', e);
        }
      }

      // 2. Fallback: In-Game CRT Sponsor Transmission Dialog
      this.#showSimulatedAdModal({
        type: 'interstitial',
        durationSec: 3,
        onDone: () => finish({ shown: true, simulated: true }),
      });
    });
  }

  /**
   * Triggers an Optional Rewarded Ad (e.g., emergency radio airdrop for rations/water/bandages).
   * If player has Premium, the reward is granted INSTANTLY without watching ads!
   */
  showRewarded({ name = 'emergency_airdrop', onReward, onDismiss } = {}) {
    if (this.isPremium()) {
      this.#showToast('👑 VIP ERİŞİM: Acil Erzak Sandığı Reklamsız Teslim Edildi!');
      audioEngine.playAchievementChime();
      if (onReward) onReward({ rewarded: true, adSkipped: true, reason: 'premium_user' });
      return Promise.resolve({ rewarded: true, adSkipped: true });
    }

    return new Promise((resolve) => {
      let rewarded = false;
      let handled = false;

      const finish = (result) => {
        if (handled) return;
        handled = true;
        this.#isAdActive = false;
        this.#muteGameAudio(false);

        if (result.rewarded) {
          if (onReward) onReward(result);
        } else {
          if (onDismiss) onDismiss(result);
        }
        resolve(result);
      };

      // 1. Google H5 adBreak rewarded flow
      if (typeof window !== 'undefined' && typeof window.adBreak === 'function') {
        this.#isAdActive = true;
        try {
          window.adBreak({
            type: 'reward',
            name,
            beforeReward: (showAdFn) => {
              this.#muteGameAudio(true);
              showAdFn();
            },
            adDismissed: () => {
              finish({ rewarded: false, reason: 'dismissed' });
            },
            adViewed: () => {
              rewarded = true;
              finish({ rewarded: true });
            },
            adBreakDone: () => {
              if (!rewarded) {
                finish({ rewarded: false, reason: 'uncompleted' });
              }
            },
          });

          // Safety timeout
          setTimeout(() => {
            if (!handled) {
              finish({ rewarded: false, reason: 'timeout' });
            }
          }, 15000);
          return;
        } catch (e) {
          console.warn('[AdManager] Rewarded adBreak failed, falling back:', e);
        }
      }

      // 2. Fallback: In-Game CRT Sponsor Transmission Dialog (5 seconds)
      this.#showSimulatedAdModal({
        type: 'rewarded',
        durationSec: 5,
        onDone: () => finish({ rewarded: true, simulated: true }),
        onCancel: () => finish({ rewarded: false, reason: 'user_cancelled' }),
      });
    });
  }

  /**
   * Validates and activates a lifetime Premium license/promo code.
   */
  redeemPromoCode(code) {
    if (!code || typeof code !== 'string') {
      return { ok: false, reason: 'empty_code' };
    }

    const clean = code.trim().toUpperCase();
    if (VALID_PROMO_CODES.includes(clean)) {
      if (this.#saveManager) {
        this.#saveManager.setPremium(true);
      } else {
        window.localStorage?.setItem('lastbreath.is_premium', 'true');
      }

      audioEngine.playAchievementChime();
      this.#showToast('👑 LİSANS DOĞRULANDI! Premium Hesabınız Aktif Edildi.');
      return { ok: true, code: clean };
    }

    return { ok: false, reason: 'invalid_code' };
  }

  /**
   * Helper to mute/unmute audio engine during full-screen commercial playback.
   */
  #muteGameAudio(mute) {
    try {
      if (audioEngine) {
        audioEngine.setMasterVolume(mute ? 0 : 0.7);
      }
    } catch {}
  }

  #showToast(text) {
    if (typeof document === 'undefined') return;
    const toast = document.getElementById('toast-banner');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4500);
  }

  /**
   * In-Game Retro CRT Sponsor Transmission Overlay.
   * Acts as a bulletproof fallback when AdSense scripts are blocked by adblockers,
   * offline environments, or domain pending verification.
   */
  #showSimulatedAdModal({ type = 'interstitial', durationSec = 3, onDone, onCancel }) {
    let timeLeft = durationSec;
    const isRewarded = type === 'rewarded';

    const overlay = document.createElement('div');
    overlay.className = 'ad-sponsor-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'ad-sponsor-dialog modal-card';

    dialog.innerHTML = `
      <div class="ad-sponsor-header">
        <span class="ad-sponsor-kicker">📡 SAHA SPONSOR YAYINI // ADSENSE SIMULATION</span>
        <span class="ad-countdown-tag" id="ad-countdown-sec">${timeLeft}s</span>
      </div>
      <div class="ad-sponsor-body">
        <h3 class="ad-sponsor-title">${isRewarded ? '🎁 ACİL YARDIM PARAŞÜTÜ HAZIRLANIYOR' : '📻 HARABE TELSİZ REKLAM ARASI'}</h3>
        <p class="ad-sponsor-desc">
          ${isRewarded
            ? 'Telsiz operatörleri koordinatlarınıza acil durum erzak sandığı (Tayın, Su, Bandaj) ulaştırıyor. Lütfen yayını izleyin...'
            : 'Sefer verileri yerel terminale senkronize ediliyor...'}
        </p>
        <div class="meter-track">
          <div class="meter-fill tone-fill-accent" id="ad-progress-bar" style="width: 0%"></div>
        </div>
      </div>
      <div class="ad-sponsor-actions">
        ${isRewarded ? '<button type="button" class="btn btn-ghost btn-xs" id="ad-btn-cancel">İptal Et</button>' : ''}
        <button type="button" class="btn btn-accent btn-xs" id="ad-btn-skip" disabled>LÜTFEN BEKLEYİN (${timeLeft}s)</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const countdownEl = dialog.querySelector('#ad-countdown-sec');
    const progressEl = dialog.querySelector('#ad-progress-bar');
    const skipBtn = dialog.querySelector('#ad-btn-skip');
    const cancelBtn = dialog.querySelector('#ad-btn-cancel');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        clearInterval(timer);
        overlay.remove();
        if (onCancel) onCancel();
      });
    }

    const timer = setInterval(() => {
      timeLeft -= 1;
      const pct = Math.round(((durationSec - timeLeft) / durationSec) * 100);
      if (progressEl) progressEl.style.width = `${pct}%`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        if (countdownEl) countdownEl.textContent = '✓ TAMAMLANDI';
        if (skipBtn) {
          skipBtn.disabled = false;
          skipBtn.textContent = isRewarded ? '🎁 ÖDÜLÜ AL VE DEVAM ET' : 'DEVAM ET →';
          skipBtn.addEventListener('click', () => {
            overlay.remove();
            if (onDone) onDone();
          });
        }
      } else {
        if (countdownEl) countdownEl.textContent = `${timeLeft}s`;
        if (skipBtn) skipBtn.textContent = `LÜTFEN BEKLEYİN (${timeLeft}s)`;
      }
    }, 1000);
  }
}

export const adManager = new AdManager();
