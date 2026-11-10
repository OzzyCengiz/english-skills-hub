/**
 * Tunable numbers in one place. Rates are per in-game hour unless noted.
 */
export const BALANCE = Object.freeze({
  vitals: {
    max: 100,
    start: { health: 100, satiety: 85, hydration: 90, energy: 100 },
    bands: { fine: 60, low: 30, critical: 1 },
  },

  /** Per-hour vital drift by what the player is doing. */
  activities: {
    idle:     { satiety: -1.2, hydration: -1.4, energy: -0.8 },
    travel:   { satiety: -1.8, hydration: -2.2, energy: -2.0 },
    scavenge: { satiety: -1.5, hydration: -2.0, energy: -1.8 },
    rest:     { satiety: -0.6, hydration: -0.8, energy: 15 },
  },

  deprivationDamage: { satiety: 1.5, hydration: 2.2, energy: 0.8 },

  regeneration: {
    requires: { satiety: 25, hydration: 25 },
    idle: 1.5,
    rest: 6.0,
  },

  inventory: {
    baseCapacityKg: 16,
    baseSlots: 10,
    hardLimitRatio: 1.5,
    overloadTravelPenalty: 1.15,
    overloadEnergyDrain: 1.15,
    armorDamageReduction: 0.08,
  },

  travel: {
    baseHours: 1.5,
    kmPerHour: 80,
    seaTimeMultiplier: 1.25,
    segmentMinutes: 8 * 60,
    roundToMinutes: 15,
    exhaustedThreshold: 20,
    exhaustedTimeMultiplier: 1.35,
    nightRiskMultiplier: 1.35,
    seaRiskBonus: 0.1,
    maxEncounterChance: 0.85,
  },

  scavenge: {
    minutes: [50, 75],
    findChance: 0.85,
    depletionPerSearch: 0.15,
    depletionRecoveryPerHour: 0.003,
    nightPenalty: 0.15,
    hazardChancePerDanger: 0.05,
  },

  survey: { minutes: 45, twoHopRumorChance: 0.35 },

  rest: { options: [1, 4, 8], ambushChancePerDanger: 0.018 },

  checks: { minChance: 0.05, maxChance: 0.95, combatPerRating: 0.06 },

  startingNode: 'istanbul',
  startingKit: [
    { itemId: 'bottled_water', qty: 3 },
    { itemId: 'canned_beans', qty: 1 },
    { itemId: 'bandage', qty: 1 },
    { itemId: 'cloth_rags', qty: 2 },
  ],
  startingEquipment: { weapon: 'kitchen_knife', body: null, pack: null },
});

