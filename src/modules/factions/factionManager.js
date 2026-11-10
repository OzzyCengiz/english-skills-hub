/**
 * Last Breath // Faction Diplomacy & Dynamic Encounter Weighting System
 * Zero-dependency Vanilla JS module managing faction standings (-100 to +100),
 * reputation ripple matrices, economic discount multipliers, and encounter modifications.
 */

import { codexManager } from '../../core/codexManager.js';

export const FACTION_IDS = {
  IRON_GUARD: 'iron_guard',
  NOMAD_GUILD: 'nomad_guild',
  ASH_MARAUDERS: 'ash_marauders',
};

export const FACTIONS = {
  iron_guard: {
    id: 'iron_guard',
    nameKey: 'faction.iron_guard.name',
    descKey: 'faction.iron_guard.desc',
    alignment: 'authoritarian_technocrat',
    defaultStanding: -10, // Suspicious of uncertified wasteland scavengers
    baseHubNodeId: 'ankara', // Bozkır Sector 09 deep redoubt
    primaryThreat: 'quarantine_enforcement',
    icon: '⚡',
  },
  nomad_guild: {
    id: 'nomad_guild',
    nameKey: 'faction.nomad_guild.name',
    descKey: 'faction.nomad_guild.desc',
    alignment: 'pragmatic_mercantile',
    defaultStanding: 15, // Receptive to peaceful barter and commerce
    baseHubNodeId: 'bursa', // Caravan road crossroads
    primaryThreat: 'price_gouging_embargo',
    icon: '⚖',
  },
  ash_marauders: {
    id: 'ash_marauders',
    nameKey: 'faction.ash_marauders.name',
    descKey: 'faction.ash_marauders.desc',
    alignment: 'opportunistic_raiders',
    defaultStanding: -40, // Extortion-driven, aggressive rogue bandits
    baseHubNodeId: 'edirne', // Borderland ruins
    primaryThreat: 'armed_ambush',
    icon: '☠',
  },
};

export const STANDING_TIERS = {
  ALLIED: {
    id: 'allied',
    min: 75,
    max: 100,
    labelKey: 'faction.tier.allied',
    discountMultiplier: 0.70, // 30% discount
    colorTone: 'good',
  },
  FRIENDLY: {
    id: 'friendly',
    min: 25,
    max: 74,
    labelKey: 'faction.tier.friendly',
    discountMultiplier: 0.85, // 15% discount
    colorTone: 'good',
  },
  NEUTRAL: {
    id: 'neutral',
    min: -24,
    max: 24,
    labelKey: 'faction.tier.neutral',
    discountMultiplier: 1.00, // Standard price
    colorTone: 'dim',
  },
  SUSPICIOUS: {
    id: 'suspicious',
    min: -74,
    max: -25,
    labelKey: 'faction.tier.suspicious',
    discountMultiplier: 1.30, // 30% price markup
    colorTone: 'warn',
  },
  HOSTILE: {
    id: 'hostile',
    min: -100,
    max: -75,
    labelKey: 'faction.tier.hostile',
    discountMultiplier: null, // Outright refused service / shoot-on-sight
    colorTone: 'bad',
  },
};

// Cross-faction ripple coefficient matrix (Reputation Karma)
export const REPUTATION_RIPPLE_MATRIX = {
  iron_guard: {
    ash_marauders: -0.65, // Aiding Iron Guard angers Marauders; attacking Iron Guard pleases Marauders
    nomad_guild: 0.15,    // Preserving order provides minor security comfort to Nomads
  },
  nomad_guild: {
    iron_guard: 0.20,     // Legitimate commerce supports civil stabilization
    ash_marauders: -0.50, // Empowering caravan defense starves raiders
  },
  ash_marauders: {
    iron_guard: -0.80,    // Raider collusion directly alienates the military garrison
    nomad_guild: -0.75,   // Highway piracy directly terrifies the merchant caravans
  },
};

// EventBus Channel Identifiers
export const EVENT_FACTION_STANDING_CHANGED = 'faction:standing_changed';
export const EVENT_FACTION_TIER_SHIFTED = 'faction:tier_shifted';
export const EVENT_FACTION_HOSTILE_TRIGGERED = 'faction:hostile_triggered';

/**
 * FactionManager: Governs survivor diplomatic standings, cross-faction karma ripples,
 * trade pricing formulas, and procedural encounter mutations.
 */
export class FactionManager {
  /**
   * Generates default initial factions state for a fresh run.
   */
  static getInitialState() {
    return {
      standings: {
        iron_guard: FACTIONS.iron_guard.defaultStanding,
        nomad_guild: FACTIONS.nomad_guild.defaultStanding,
        ash_marauders: FACTIONS.ash_marauders.defaultStanding,
      },
      history: [],
    };
  }

  /**
   * Retrieves numerical standing for a specific faction clamped to [-100, 100].
   */
  static getStanding(state, factionId) {
    const raw = state?.factions?.standings?.[factionId];
    if (typeof raw !== 'number') {
      return FACTIONS[factionId]?.defaultStanding ?? 0;
    }
    return Math.max(-100, Math.min(100, Math.round(raw)));
  }

  /**
   * Maps a numerical standing (-100..100) to its corresponding standing tier.
   */
  static getTier(standing) {
    const val = Math.max(-100, Math.min(100, standing));
    if (val >= STANDING_TIERS.ALLIED.min) return STANDING_TIERS.ALLIED;
    if (val >= STANDING_TIERS.FRIENDLY.min) return STANDING_TIERS.FRIENDLY;
    if (val >= STANDING_TIERS.NEUTRAL.min) return STANDING_TIERS.NEUTRAL;
    if (val >= STANDING_TIERS.SUSPICIOUS.min) return STANDING_TIERS.SUSPICIOUS;
    return STANDING_TIERS.HOSTILE;
  }

  /**
   * Calculates trade price multiplier based on current diplomatic standing.
   * Returns null if faction is hostile (trade rejected).
   */
  static getDiscountMultiplier(state, factionId) {
    const standing = this.getStanding(state, factionId);
    const tier = this.getTier(standing);
    return tier.discountMultiplier;
  }

  /**
   * Adjusts reputation for a primary faction and propagates relational ripple shifts
   * to all connected wasteland factions.
   * 
   * @param {Object} state - Reactive store state.
   * @param {string} factionId - Target faction ID.
   * @param {number} delta - Points to add or subtract (-100 to +100).
   * @param {string} [reason=''] - Log description for historical record.
   * @param {Object} [options] - Optional EventBus context.
   * @returns {Object} { primaryChange, ripples, tierShifts }
   */
  static adjustStanding(state, factionId, delta, reason = '', { bus = null } = {}) {
    if (!state.factions) {
      state.factions = this.getInitialState();
    }

    const currentStanding = this.getStanding(state, factionId);
    const oldTier = this.getTier(currentStanding);
    const newStanding = Math.max(-100, Math.min(100, currentStanding + delta));
    const newTier = this.getTier(newStanding);

    state.factions.standings[factionId] = newStanding;

    if (newStanding >= 30) {
      if (factionId === FACTION_IDS.NOMAD_GUILD) codexManager.unlockAchievement('nomad_ally');
      if (factionId === FACTION_IDS.IRON_GUARD) codexManager.unlockAchievement('iron_discipline');
    }

    const tierShifts = [];
    if (oldTier.id !== newTier.id) {
      tierShifts.push({ factionId, from: oldTier.id, to: newTier.id });
      if (bus) {
        bus.emit(EVENT_FACTION_TIER_SHIFTED, { factionId, from: oldTier, to: newTier });
        if (newTier.id === STANDING_TIERS.HOSTILE.id) {
          bus.emit(EVENT_FACTION_HOSTILE_TRIGGERED, { factionId });
        }
      }
    }

    // Compute and apply relational karma ripples to rival/allied factions
    const ripples = [];
    const rippleConfig = REPUTATION_RIPPLE_MATRIX[factionId];
    if (rippleConfig) {
      for (const [linkedId, coefficient] of Object.entries(rippleConfig)) {
        const rippleDelta = Math.round(delta * coefficient);
        if (rippleDelta !== 0) {
          const linkedBefore = this.getStanding(state, linkedId);
          const linkedOldTier = this.getTier(linkedBefore);
          const linkedAfter = Math.max(-100, Math.min(100, linkedBefore + rippleDelta));
          const linkedNewTier = this.getTier(linkedAfter);

          state.factions.standings[linkedId] = linkedAfter;
          ripples.push({ factionId: linkedId, delta: rippleDelta, resulting: linkedAfter });

          if (linkedOldTier.id !== linkedNewTier.id) {
            tierShifts.push({ factionId: linkedId, from: linkedOldTier.id, to: linkedNewTier.id });
            if (bus) {
              bus.emit(EVENT_FACTION_TIER_SHIFTED, { factionId: linkedId, from: linkedOldTier, to: linkedNewTier });
            }
          }
        }
      }
    }

    const entry = {
      timestamp: Date.now(),
      primaryFaction: factionId,
      delta,
      newStanding,
      reason,
      ripples,
    };
    state.factions.history.unshift(entry);
    if (state.factions.history.length > 50) {
      state.factions.history.pop();
    }

    if (bus) {
      bus.emit(EVENT_FACTION_STANDING_CHANGED, entry);
    }

    return {
      primaryChange: { factionId, delta, before: currentStanding, after: newStanding },
      ripples,
      tierShifts,
    };
  }

  /**
   * Intercepts and procedurally mutates an encounter definition based on faction standings.
   * If the player is hostile, peaceful choices are stripped or converted to ambushes.
   * If the player is friendly or allied, tolls are waived and safe barter or aid is added.
   * 
   * @param {Object} state - Current game state.
   * @param {Object} encounterDef - Raw encounter template.
   * @param {string} factionId - Associated faction ID.
   * @returns {Object} Mutated encounter template.
   */
  static modifyEncounterByFaction(state, encounterDef, factionId) {
    if (!encounterDef || !factionId || !FACTIONS[factionId]) {
      return encounterDef;
    }

    const standing = this.getStanding(state, factionId);
    const tier = this.getTier(standing);
    const modified = JSON.parse(JSON.stringify(encounterDef));

    // 1. HOSTILE DISPOSITION:
    // Strips barter/surrender choices, introduces pre-emptive combat and ambush ambiances
    if (tier.id === STANDING_TIERS.HOSTILE.id) {
      modified.textKey = `${encounterDef.id}.text_hostile`;
      modified.isHostileEncounter = true;
      modified.choices = modified.choices
        .filter((c) => c.id !== 'barter' && c.id !== 'pay' && c.id !== 'pay_toll')
        .map((c) => {
          if (c.id === 'fight' || c.id === 'fight_sentry' || c.id === 'stand') {
            return {
              ...c,
              labelKey: 'encounter.choice.fight_hostile_ambush',
              check: c.check ? { ...c.check, base: Math.max(0.10, (c.check.base || 0.3) - 0.15) } : null,
            };
          }
          return c;
        });
      // Guarantee at least a combat option if all peaceful ones were stripped
      if (!modified.choices.some((c) => c.id.includes('fight') || c.check?.kind === 'combat')) {
        modified.choices.unshift({
          id: 'defend_ambush',
          check: { kind: 'combat', base: 0.20 },
          success: [{ type: 'xp', skill: 'marksmanship', amount: 20 }],
          failure: [{ type: 'damage', amount: [18, 30] }, { type: 'ailment', id: 'bleeding', severity: 2, chance: 0.8 }],
        });
      }
    }

    // 2. SUSPICIOUS DISPOSITION:
    // Imposes tariff/toll and disables friendly bartering
    else if (tier.id === STANDING_TIERS.SUSPICIOUS.id) {
      modified.textKey = `${encounterDef.id}.text_suspicious`;
      modified.choices = modified.choices.map((c) => {
        if (c.id === 'barter') {
          return { ...c, requires: { tags: ['currency', 'fuel', 'ammo'] } };
        }
        return c;
      });
    }

    // 3. FRIENDLY DISPOSITION:
    // Waives tolls, unlocks peaceful dialogue, and improves skill success rates
    else if (tier.id === STANDING_TIERS.FRIENDLY.id) {
      modified.textKey = `${encounterDef.id}.text_friendly`;
      modified.choices = modified.choices.map((c) => {
        if (c.id === 'pay' || c.id === 'pay_toll') {
          return {
            id: 'waived_toll',
            effects: [{ type: 'time', minutes: 15 }, { type: 'xp', skill: 'foraging', amount: 5 }],
          };
        }
        if (c.check?.kind === 'skill') {
          return { ...c, check: { ...c.check, base: Math.min(0.90, (c.check.base || 0.4) + 0.15) } };
        }
        return c;
      });
    }

    // 4. ALLIED DISPOSITION:
    // Grants free passage, emergency field supplies, and maximum trade discounts
    else if (tier.id === STANDING_TIERS.ALLIED.id) {
      modified.textKey = `${encounterDef.id}.text_allied`;
      modified.choices = [
        {
          id: 'allied_safe_passage',
          effects: [
            { type: 'time', minutes: 10 },
            { type: 'give', itemId: 'energy_bar', qty: 1 },
            { type: 'xp', skill: 'foraging', amount: 10 },
          ],
        },
        ...modified.choices.filter((c) => !c.id.includes('pay')),
      ];
    }

    return modified;
  }
}

