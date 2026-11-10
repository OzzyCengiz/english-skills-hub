/**
 * Last Breath // Codex, Permadeath Memorial & Career Statistics Manager
 * Zero external dependencies. Persistent meta-progression across permadeath runs.
 * Governs fallen survivors memorial graveyard, career milestones, achievements,
 * and classified post-collapse field dossiers.
 */

import { audioEngine } from './audioEngine.js';

const STORAGE_KEY = 'lastbreath_codex_v1';

export const ACHIEVEMENTS_CATALOG = {
  first_blood: {
    id: 'first_blood',
    icon: '⚔️',
    titleKey: 'codex.ach.first_blood.title',
    descKey: 'codex.ach.first_blood.desc',
  },
  pacifist_mercy: {
    id: 'pacifist_mercy',
    icon: '🕊️',
    titleKey: 'codex.ach.pacifist_mercy.title',
    descKey: 'codex.ach.pacifist_mercy.desc',
  },
  trauma_surgeon: {
    id: 'trauma_surgeon',
    icon: '🩹',
    titleKey: 'codex.ach.trauma_surgeon.title',
    descKey: 'codex.ach.trauma_surgeon.desc',
  },
  mechanic_maestro: {
    id: 'mechanic_maestro',
    icon: '🔧',
    titleKey: 'codex.ach.mechanic_maestro.title',
    descKey: 'codex.ach.mechanic_maestro.desc',
  },
  silk_road_tycoon: {
    id: 'silk_road_tycoon',
    icon: '⚖️',
    titleKey: 'codex.ach.silk_road_tycoon.title',
    descKey: 'codex.ach.silk_road_tycoon.desc',
  },
  nomad_ally: {
    id: 'nomad_ally',
    icon: '🤝',
    titleKey: 'codex.ach.nomad_ally.title',
    descKey: 'codex.ach.nomad_ally.desc',
  },
  iron_discipline: {
    id: 'iron_discipline',
    icon: '🛡️',
    titleKey: 'codex.ach.iron_discipline.title',
    descKey: 'codex.ach.iron_discipline.desc',
  },
  acid_survivor: {
    id: 'acid_survivor',
    icon: '☣️',
    titleKey: 'codex.ach.acid_survivor.title',
    descKey: 'codex.ach.acid_survivor.desc',
  },
  eurasian_nomad: {
    id: 'eurasian_nomad',
    icon: '🧭',
    titleKey: 'codex.ach.eurasian_nomad.title',
    descKey: 'codex.ach.eurasian_nomad.desc',
  },
  endurance_champion: {
    id: 'endurance_champion',
    icon: '⏳',
    titleKey: 'codex.ach.endurance_champion.title',
    descKey: 'codex.ach.endurance_champion.desc',
  },
  fuel_siphoner: {
    id: 'fuel_siphoner',
    icon: '⛽',
    titleKey: 'codex.ach.fuel_siphoner.title',
    descKey: 'codex.ach.fuel_siphoner.desc',
  },
  outpost_pioneer: {
    id: 'outpost_pioneer',
    icon: '⛺',
    titleKey: 'codex.ach.outpost_pioneer.title',
    descKey: 'codex.ach.outpost_pioneer.desc',
  },
  master_scavenger: {
    id: 'master_scavenger',
    icon: '🎒',
    titleKey: 'codex.ach.master_scavenger.title',
    descKey: 'codex.ach.master_scavenger.desc',
  },
  sniper_doctrine: {
    id: 'sniper_doctrine',
    icon: '🎯',
    titleKey: 'codex.ach.sniper_doctrine.title',
    descKey: 'codex.ach.sniper_doctrine.desc',
  },
};

export const LORE_CODEX_CATALOG = {
  iron_guard: {
    id: 'iron_guard',
    category: 'factions',
    glyph: '🛡️',
    titleKey: 'codex.lore.iron_guard.title',
    descKey: 'codex.lore.iron_guard.desc',
  },
  nomad_guild: {
    id: 'nomad_guild',
    category: 'factions',
    glyph: '🐫',
    titleKey: 'codex.lore.nomad_guild.title',
    descKey: 'codex.lore.nomad_guild.desc',
  },
  ash_marauders: {
    id: 'ash_marauders',
    category: 'factions',
    glyph: '💀',
    titleKey: 'codex.lore.ash_marauders.title',
    descKey: 'codex.lore.ash_marauders.desc',
  },
  trauma_tccc: {
    id: 'trauma_tccc',
    category: 'tactics',
    glyph: '🩸',
    titleKey: 'codex.lore.trauma_tccc.title',
    descKey: 'codex.lore.trauma_tccc.desc',
  },
  weather_extremes: {
    id: 'weather_extremes',
    category: 'tactics',
    glyph: '⛈️',
    titleKey: 'codex.lore.weather_extremes.title',
    descKey: 'codex.lore.weather_extremes.desc',
  },
  vehicle_overland: {
    id: 'vehicle_overland',
    category: 'vehicles',
    glyph: '🚙',
    titleKey: 'codex.lore.vehicle_overland.title',
    descKey: 'codex.lore.vehicle_overland.desc',
  },
};

export class CodexManager {
  #storage;
  #bus;
  #data;

  constructor({ bus = null, storage = globalThis.localStorage } = {}) {
    this.#bus = bus;
    this.#storage = storage;
    this.#data = this.#load();
  }

  setBus(bus) {
    this.#bus = bus;
  }

  #getDefaultData() {
    return {
      memorial: [],
      career: {
        totalDaysSurvived: 0,
        totalExpeditions: 0,
        totalKmTraveled: 0,
        totalSectorsVisited: 0,
        totalEnemiesDefeated: 0,
        totalEnemiesSpared: 0,
        totalBarterValue: 0,
        totalVehiclesRestored: 0,
        totalCraftsDone: 0,
        totalFuelSiphoned: 0,
        totalScavenges: 0,
        totalMedicalTreatments: 0,
      },
      achievements: {},
      unlockedCodex: ['iron_guard', 'nomad_guild', 'trauma_tccc', 'weather_extremes'],
    };
  }

  #load() {
    try {
      const raw = this.#storage?.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.#getDefaultData(),
          ...parsed,
          career: { ...this.#getDefaultData().career, ...(parsed.career || {}) },
          achievements: { ...(parsed.achievements || {}) },
          unlockedCodex: Array.isArray(parsed.unlockedCodex) ? parsed.unlockedCodex : this.#getDefaultData().unlockedCodex,
          memorial: Array.isArray(parsed.memorial) ? parsed.memorial : [],
        };
      }
    } catch (e) {
      console.warn('[codex] failed to load codex storage', e);
    }
    return this.#getDefaultData();
  }

  #save() {
    try {
      this.#storage?.setItem(STORAGE_KEY, JSON.stringify(this.#data));
    } catch (e) {
      console.warn('[codex] failed to write codex storage', e);
    }
  }

  get memorial() {
    return this.#data.memorial;
  }

  get career() {
    return this.#data.career;
  }

  get achievements() {
    return this.#data.achievements;
  }

  get unlockedCodex() {
    return this.#data.unlockedCodex;
  }

  /**
   * Records a fallen survivor to the permanent memorial log upon death.
   */
  recordFallenSurvivor(state) {
    if (!state?.player) return null;

    const days = Math.max(0.1, Math.round(((state.player.diedAt ?? state.time?.minutes ?? 0) / 1440) * 10) / 10);
    const visitedNodes = Object.values(state.world?.nodes || {}).filter((n) => n.visited).length;

    const record = {
      id: `memorial_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: state.player.name || 'Bilinmeyen Hayatta Kalan',
      age: state.player.age || 28,
      archetype: state.player.archetype || 'scavenger',
      bloodType: state.player.bloodType || 'A+',
      trait: state.player.trait || 'stoic',
      startingLocation: 'istanbul',
      deathLocation: state.world?.currentNodeId || 'istanbul',
      causeOfDeath: state.player.causeOfDeath || 'wounds',
      diedAtTimestamp: Date.now(),
      daysSurvived: days,
      sectorsVisited: visitedNodes,
      enemiesNeutralized: state.combat?.totalEnemiesDefeated || 0,
      barterVolume: state.economy?.totalBarterVolume || 0,
      kmTraveled: state.world?.totalKmTraveled || 0,
      vehiclesRestored: state.vehicles?.fleet ? Object.values(state.vehicles.fleet).filter((v) => v.restored).length : 0,
      epitaph: this.#generateEpitaph(state.player.name, state.player.causeOfDeath, state.world?.currentNodeId),
    };

    // Update cumulative career statistics
    this.#data.career.totalExpeditions += 1;
    this.#data.career.totalDaysSurvived = Math.round((this.#data.career.totalDaysSurvived + days) * 10) / 10;
    this.#data.career.totalSectorsVisited += visitedNodes;

    // Check endurance milestone
    if (days >= 10) {
      this.unlockAchievement('endurance_champion');
    }

    // Prepend to memorial (latest death at top, capped at 40 records)
    this.#data.memorial.unshift(record);
    if (this.#data.memorial.length > 40) {
      this.#data.memorial.pop();
    }

    this.#save();
    return record;
  }

  #generateEpitaph(name, cause, location) {
    const epitaphs = {
      blood_loss: `${name}, ${location} harabelerinde kan kaybı ve şok içinde son nefesini verdi.`,
      hypothermia: `${name}, dondurucu kıyamet kışında soğuğa yenik düştü.`,
      radiation: `${name}, ölümcül radyoaktif kül fırtınasının ortasında yığıldı.`,
      starvation: `${name}, açlık ve bitkinlik içinde harabelerde sessizliğe gömüldü.`,
      dehydration: `${name}, kavurucu susuzluk içinde bir damla suya hasret kalarak can verdi.`,
      acid_burns: `${name}, zehirli asit yağmurunda kimyasal yanıklarla can verdi.`,
      wounds: `${name}, çatışma yaralarına yenik düşerek toprağa karıştı.`,
    };
    return epitaphs[cause] || `${name}, Avrasya harabelerinde hayata gözlerini yumdu.`;
  }

  /**
   * Tracks incremental career statistics across active gameplay.
   */
  trackCareer(statName, delta = 1) {
    if (this.#data.career[statName] !== undefined) {
      this.#data.career[statName] = Math.round((this.#data.career[statName] + delta) * 10) / 10;
      this.#save();
    }
  }

  /**
   * Evaluates and unlocks an achievement permanently.
   */
  unlockAchievement(achId) {
    if (!ACHIEVEMENTS_CATALOG[achId]) return false;
    if (this.#data.achievements[achId]) return false; // Already unlocked

    this.#data.achievements[achId] = {
      unlockedAt: Date.now(),
    };
    this.#save();

    // Trigger audio & broadcast notification event
    audioEngine.playAchievementChime();
    if (this.#bus) {
      this.#bus.emit('codex:achievement_unlocked', {
        id: achId,
        catalog: ACHIEVEMENTS_CATALOG[achId],
      });
    }

    return true;
  }

  /**
   * Unlocks a classified field codex entry.
   */
  unlockCodexEntry(entryId) {
    if (!LORE_CODEX_CATALOG[entryId]) return false;
    if (this.#data.unlockedCodex.includes(entryId)) return false;

    this.#data.unlockedCodex.push(entryId);
    this.#save();
    return true;
  }

  /**
   * Calculates overall survivor reputation rank based on career metrics.
   */
  getSurvivalRank() {
    const days = this.#data.career.totalDaysSurvived;
    const achCount = Object.keys(this.#data.achievements).length;

    if (days >= 50 || achCount >= 10) {
      return { tier: 5, rankKey: 'codex.rank.tier_5', glyph: '👑' };
    }
    if (days >= 25 || achCount >= 7) {
      return { tier: 4, rankKey: 'codex.rank.tier_4', glyph: '🎖️' };
    }
    if (days >= 10 || achCount >= 4) {
      return { tier: 3, rankKey: 'codex.rank.tier_3', glyph: '⚔️' };
    }
    if (days >= 3 || achCount >= 1) {
      return { tier: 2, rankKey: 'codex.rank.tier_2', glyph: '🐺' };
    }
    return { tier: 1, rankKey: 'codex.rank.tier_1', glyph: '🏕️' };
  }

  /**
   * Resets all memorial and career records (wiping history).
   */
  clearAll() {
    this.#data = this.#getDefaultData();
    this.#save();
  }
}

export const codexManager = new CodexManager();

