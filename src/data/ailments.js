/**
 * Ailment rules. Runtime instances live in `player.ailments[id]` and carry a
 * single magnitude field: `severity` (bleeding), `progress` (infection) or
 * `hours` remaining (sprain).
 */
export const AILMENTS = {
  bleeding: {
    glyph: '♦',
    tone: 'bad',
    initial: { severity: 1 },
    maxSeverity: 3,
    healthPerHourPerSeverity: 1.2,
    stopChancePerHour: 0.20,
    infectionChancePerHour: 0.03,
  },
  infection: {
    glyph: '☣',
    tone: 'bad',
    initial: { progress: 10 },
    growthPerHour: 1.0,
    recoveryPerHour: 1.2,
    recoveryBelow: 30,
    symptomaticAt: 35,
    severeAt: 80,
    healthPerHourSymptomatic: 0.8,
    healthPerHourSevere: 2.5,
    energyPerHourSymptomatic: 0.8,
  },
  sprain: {
    glyph: '⌇',
    tone: 'warn',
    initial: { hours: 24 },
    travelTimeMultiplier: 1.15,
  },
  pain: {
    glyph: '⚡',
    tone: 'warn',
    initial: { severity: 2 },
    maxSeverity: 5,
    decayPerHour: 0.5,
    travelTimeMultiplier: 1.10,
  },
  poison: {
    glyph: '☠',
    tone: 'bad',
    initial: { severity: 25 },
    maxSeverity: 100,
    healthPerHour: 1.5,
    decayPerHour: 1.0,
  },
};

