import { SAVE_VERSION } from './coreModule.js';

export const TOTAL_SLOTS = 10;
export const FREE_SLOTS = 2;
const LEGACY_SAVE_KEY = 'lastbreath.save';
const ACTIVE_SLOT_KEY = 'lastbreath.active_slot';
const PREMIUM_KEY = 'lastbreath.is_premium';
const AUTOSAVE_DELAY_MS = 600;

/**
 * Ordered upgrade steps. MIGRATIONS[n] upgrades a version-n payload to n + 1.
 */
const MIGRATIONS = {};

function migrate(payload) {
  let current = payload;
  while (current.version < SAVE_VERSION) {
    const step = MIGRATIONS[current.version];
    if (!step) throw new Error(`No migration from save version ${current.version}`);
    current = { ...step(current), version: current.version + 1 };
  }
  return current;
}

export class SaveManager {
  #store;
  #rng;
  #storage;
  #timer = null;
  #activeSlot = 1;

  constructor({ store, rng, storage = globalThis.localStorage }) {
    this.#store = store;
    this.#rng = rng;
    this.#storage = storage;

    // Determine initial active slot
    const savedActive = this.#storage?.getItem(ACTIVE_SLOT_KEY);
    const parsedSlot = Number(savedActive);
    if (parsedSlot >= 1 && parsedSlot <= TOTAL_SLOTS) {
      this.#activeSlot = parsedSlot;
    } else {
      this.#activeSlot = 1;
    }

    // Auto-migrate legacy save to slot 1 if slot 1 is empty
    this.#migrateLegacySave();
  }

  get activeSlot() {
    return this.#activeSlot;
  }

  setActiveSlot(slotNumber) {
    const slot = Number(slotNumber);
    if (slot >= 1 && slot <= TOTAL_SLOTS) {
      this.#activeSlot = slot;
      this.#storage?.setItem(ACTIVE_SLOT_KEY, String(slot));
    }
  }

  isPremium() {
    try {
      return this.#storage?.getItem(PREMIUM_KEY) === 'true';
    } catch {
      return false;
    }
  }

  setPremium(enabled) {
    try {
      if (enabled) {
        this.#storage?.setItem(PREMIUM_KEY, 'true');
      } else {
        this.#storage?.removeItem(PREMIUM_KEY);
      }
      return true;
    } catch (e) {
      console.error('[save] failed to toggle premium', e);
      return false;
    }
  }

  #getSlotKey(slot) {
    return `lastbreath.save.slot.${slot}`;
  }

  #migrateLegacySave() {
    try {
      const slot1Key = this.#getSlotKey(1);
      const slot1Data = this.#storage?.getItem(slot1Key);
      const legacyData = this.#storage?.getItem(LEGACY_SAVE_KEY);
      if (!slot1Data && legacyData) {
        this.#storage?.setItem(slot1Key, legacyData);
      }
    } catch {
      // Ignored in non-browser contexts
    }
  }

  listSlots() {
    const premiumUnlocked = this.isPremium();
    const slots = [];

    for (let slot = 1; slot <= TOTAL_SLOTS; slot++) {
      const isPremiumSlot = slot > FREE_SLOTS;
      const isLocked = isPremiumSlot && !premiumUnlocked;
      let hasSave = false;
      let meta = null;

      try {
        const raw = this.#storage?.getItem(this.#getSlotKey(slot));
        if (raw) {
          const payload = JSON.parse(raw);
          if (payload && payload.state) {
            hasSave = true;
            meta = {
              name: payload.state.player?.name || null,
              archetype: payload.state.player?.archetype || 'scavenger',
              locationId: payload.state.world?.currentNodeId || 'istanbul',
              minutes: payload.state.time?.minutes || 0,
              health: Math.round(payload.state.player?.health ?? 100),
              alive: Boolean(payload.state.player?.alive),
              savedAt: payload.savedAt || Date.now(),
              active: slot === this.#activeSlot,
            };
          }
        }
      } catch (err) {
        console.warn(`[save] Failed to parse slot ${slot}`, err);
      }

      slots.push({
        slot,
        isPremiumSlot,
        isLocked,
        hasSave,
        meta,
        isActive: slot === this.#activeSlot,
      });
    }

    return slots;
  }

  saveSlot(slotNumber) {
    const slot = Number(slotNumber);
    if (slot < 1 || slot > TOTAL_SLOTS) return false;
    if (slot > FREE_SLOTS && !this.isPremium()) {
      console.warn(`[save] Slot ${slot} requires premium`);
      return false;
    }

    const payload = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      rng: this.#rng.state,
      state: this.#store.state,
    };

    try {
      const str = JSON.stringify(payload);
      this.#storage?.setItem(this.#getSlotKey(slot), str);
      if (slot === 1) {
        this.#storage?.setItem(LEGACY_SAVE_KEY, str);
      }
      this.setActiveSlot(slot);
      return true;
    } catch (error) {
      console.error(`[save] write failed for slot ${slot}`, error);
      return false;
    }
  }

  loadSlot(slotNumber) {
    const slot = Number(slotNumber);
    if (slot < 1 || slot > TOTAL_SLOTS) return null;
    if (slot > FREE_SLOTS && !this.isPremium()) {
      console.warn(`[save] Slot ${slot} requires premium`);
      return null;
    }

    try {
      const raw = this.#storage?.getItem(this.#getSlotKey(slot));
      if (!raw) return null;
      const payload = migrate(JSON.parse(raw));
      this.setActiveSlot(slot);
      return { state: payload.state, rng: payload.rng, savedAt: payload.savedAt, slot };
    } catch (error) {
      console.error(`[save] unreadable save in slot ${slot}`, error);
      return null;
    }
  }

  deleteSlot(slotNumber) {
    const slot = Number(slotNumber);
    if (slot < 1 || slot > TOTAL_SLOTS) return false;
    try {
      this.#storage?.removeItem(this.#getSlotKey(slot));
      if (slot === 1) {
        this.#storage?.removeItem(LEGACY_SAVE_KEY);
      }
      return true;
    } catch (err) {
      console.error(`[save] failed to delete slot ${slot}`, err);
      return false;
    }
  }

  save() {
    return this.saveSlot(this.#activeSlot);
  }

  load() {
    // Try active slot first
    const fromActive = this.loadSlot(this.#activeSlot);
    if (fromActive) return fromActive;

    // Fall back to slot 1
    const fromSlot1 = this.loadSlot(1);
    if (fromSlot1) return fromSlot1;

    // Fall back to legacy key
    try {
      const raw = this.#storage?.getItem(LEGACY_SAVE_KEY);
      if (!raw) return null;
      const payload = migrate(JSON.parse(raw));
      return { state: payload.state, rng: payload.rng, savedAt: payload.savedAt, slot: 1 };
    } catch {
      return null;
    }
  }

  clear() {
    clearTimeout(this.#timer);
    this.deleteSlot(this.#activeSlot);
  }

  clearAllData() {
    clearTimeout(this.#timer);
    try {
      for (let s = 1; s <= TOTAL_SLOTS; s++) {
        this.#storage?.removeItem(this.#getSlotKey(s));
      }
      this.#storage?.removeItem(LEGACY_SAVE_KEY);
      this.#storage?.removeItem(ACTIVE_SLOT_KEY);
      this.#storage?.removeItem(PREMIUM_KEY);
      this.#activeSlot = 1;
      return true;
    } catch (err) {
      console.error('[save] clear all data failed', err);
      return false;
    }
  }

  watch(bus) {
    return bus.on('state:changed', () => {
      clearTimeout(this.#timer);
      this.#timer = setTimeout(() => this.save(), AUTOSAVE_DELAY_MS);
    });
  }
}
