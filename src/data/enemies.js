/**
 * Hostile enemy registry for turn-based tactical combat encounters.
 * Text lives in `locales/en.json` under `enemy.<id>.name` and `enemy.<id>.desc`.
 */
export const ENEMIES = {
  feral_hound: {
    hp: 22,
    damage: [4, 8],
    accuracy: 0.72,
    evasion: 0.12,
    bleedChance: 0.35,
    infectChance: 0.25,
    xp: 12,
    lootTable: 'wasteland',
    biomes: ['rural', 'suburban', 'forest', 'wasteland', 'coastal'],
    minDanger: 1,
    ranged: false,
    preferredRange: 'melee',
    morale: 80,
    canSurrender: false, // Animals fight or route, cannot surrender
  },
  raider_scout: {
    hp: 32,
    damage: [6, 11],
    accuracy: 0.75,
    evasion: 0.15,
    bleedChance: 0.4,
    infectChance: 0.05,
    xp: 18,
    lootTable: 'raider',
    biomes: ['urban', 'suburban', 'industrial', 'wasteland'],
    minDanger: 2,
    ranged: true,
    preferredRange: 'close',
    morale: 65,
    canSurrender: true,
  },
  plague_stalker: {
    hp: 28,
    damage: [5, 10],
    accuracy: 0.68,
    evasion: 0.08,
    bleedChance: 0.3,
    infectChance: 0.5,
    xp: 16,
    lootTable: 'urban',
    biomes: ['urban', 'industrial', 'forest'],
    minDanger: 2,
    ranged: false,
    preferredRange: 'melee',
    morale: 100, // Rabid biological vector, no fear
    canSurrender: false,
  },
  cordon_deserter: {
    hp: 45,
    damage: [8, 15],
    accuracy: 0.8,
    evasion: 0.18,
    bleedChance: 0.5,
    infectChance: 0.1,
    xp: 28,
    lootTable: 'military',
    biomes: ['military', 'urban', 'arctic'],
    minDanger: 3,
    ranged: true,
    preferredRange: 'medium',
    morale: 85,
    canSurrender: true,
  },
  marauder_marksman: {
    hp: 36,
    damage: [12, 20],
    accuracy: 0.86,
    evasion: 0.14,
    bleedChance: 0.6,
    infectChance: 0.0,
    xp: 35,
    lootTable: 'military',
    biomes: ['wasteland', 'rural', 'industrial', 'military'],
    minDanger: 3,
    ranged: true,
    preferredRange: 'long',
    morale: 70,
    canSurrender: true,
  },
  iron_guard_sentinel: {
    hp: 60,
    damage: [10, 18],
    accuracy: 0.82,
    evasion: 0.10,
    bleedChance: 0.35,
    infectChance: 0.0,
    xp: 45,
    lootTable: 'military',
    biomes: ['military', 'urban', 'arctic'],
    minDanger: 4,
    ranged: true,
    preferredRange: 'medium',
    morale: 95,
    canSurrender: false, // Fanatical bunker garrison
  },
};

export function getEnemy(enemyId) {
  const enemy = ENEMIES[enemyId];
  if (!enemy) throw new Error(`Unknown enemy "${enemyId}"`);
  return enemy;
}

