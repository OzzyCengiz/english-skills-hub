/**
 * Encounter definitions. Text lives under `encounter.<id>` in the locale:
 *   .title  .text  .choice.<choiceId>
 *   .outcome.<choiceId>            (no check)
 *   .outcome.<choiceId>_success / _failure
 *
 * contexts  where it can fire: travel | scavenge | rest
 * terrain   land (default) | sea | any
 * biomes    restricts to destination/current biomes; omit for all
 * requires  { tags?, itemId?, category? } — choice disabled when unmet
 * check     { kind: 'skill', skill, base, perLevel } | { kind: 'combat', base }
 *           | { kind: 'gear', flag, base }
 */
const SETTLED = ['urban', 'suburban', 'industrial'];
const WILD = ['rural', 'forest', 'wasteland', 'suburban', 'coastal'];
const FOOD_OR_DRINK = { tags: ['food', 'drink'] };

export const ENCOUNTERS = {
  abandoned_car: {
    contexts: ['travel'], biomes: [...SETTLED, 'rural', 'wasteland'], weight: 4,
    choices: [
      { id: 'search', effects: [
        { type: 'time', minutes: 30 },
        { type: 'loot', table: 'roadside', rolls: [1, 2] },
        { type: 'xp', skill: 'foraging', amount: 4 },
      ] },
      { id: 'strip', check: { kind: 'skill', skill: 'engineering', base: 0.45, perLevel: 0.07 },
        success: [
          { type: 'give', itemId: 'copper_wire', qty: 2 },
          { type: 'give', itemId: 'electronics', qty: 1 },
          { type: 'xp', skill: 'engineering', amount: 8 },
        ],
        failure: [
          { type: 'damage', amount: [2, 5] },
          { type: 'ailment', id: 'bleeding', chance: 0.5 },
          { type: 'xp', skill: 'engineering', amount: 3 },
        ] },
      { id: 'leave', effects: [] },
    ],
  },

  feral_dogs: {
    contexts: ['travel', 'scavenge'], biomes: WILD, weight: 3,
    choices: [
      { id: 'stand', check: { kind: 'combat', base: 0.35 },
        success: [{ type: 'xp', skill: 'marksmanship', amount: 15 }],
        failure: [
          { type: 'damage', amount: [8, 15] },
          { type: 'ailment', id: 'bleeding', chance: 0.6 },
        ] },
      { id: 'feed', requires: { tags: ['food'] }, effects: [{ type: 'take', tags: ['food'], qty: 1 }] },
      { id: 'flee', check: { kind: 'skill', skill: 'foraging', base: 0.5, perLevel: 0.05 },
        success: [{ type: 'vital', vital: 'energy', amount: -8 }],
        failure: [
          { type: 'vital', vital: 'energy', amount: -10 },
          { type: 'damage', amount: [5, 10] },
          { type: 'ailment', id: 'bleeding', chance: 0.4 },
        ] },
    ],
  },

  raider_toll: {
    contexts: ['travel', 'scavenge'], biomes: [...SETTLED, 'military', 'wasteland'], weight: 3, minDanger: 2,
    faction: 'ash_marauders',
    choices: [
      { id: 'pay', requires: FOOD_OR_DRINK, effects: [
        { type: 'take', tags: ['food', 'drink'], qty: 2 },
        { type: 'reputation', factionId: 'ash_marauders', delta: 5, reason: 'submitted_tribute' },
      ] },
      { id: 'fight', check: { kind: 'combat', base: 0.25 },
        success: [
          { type: 'xp', skill: 'marksmanship', amount: 20 },
          { type: 'loot', table: 'raider', rolls: [1, 2] },
          { type: 'reputation', factionId: 'ash_marauders', delta: -15, reason: 'killed_marauder' },
        ],
        failure: [
          { type: 'damage', amount: [14, 24] },
          { type: 'ailment', id: 'bleeding', severity: 2, chance: 0.7 },
        ] },
      { id: 'barter', check: { kind: 'skill', skill: 'engineering', base: 0.3, perLevel: 0.08 },
        success: [
          { type: 'xp', skill: 'engineering', amount: 10 },
          { type: 'give', itemId: 'energy_bar', qty: 2 },
        ],
        failure: [{ type: 'damage', amount: [6, 12] }] },
    ],
  },

  collapsed_overpass: {
    contexts: ['travel'], biomes: SETTLED, weight: 3,
    choices: [
      { id: 'climb', check: { kind: 'skill', skill: 'foraging', base: 0.55, perLevel: 0.05 },
        success: [{ type: 'xp', skill: 'foraging', amount: 6 }],
        failure: [
          { type: 'damage', amount: [4, 9] },
          { type: 'ailment', id: 'sprain', chance: 0.7 },
        ] },
      { id: 'detour', effects: [
        { type: 'time', minutes: [120, 180], activity: 'travel' },
      ] },
    ],
  },

  acid_rain: {
    contexts: ['travel', 'rest'], biomes: ['urban', 'suburban', 'industrial', 'rural', 'coastal', 'forest', 'wasteland', 'military'], weight: 2,
    choices: [
      { id: 'shelter', effects: [{ type: 'time', minutes: [90, 150] }] },
      { id: 'push_on', check: { kind: 'gear', flag: 'acidProof', base: 0.15 },
        success: [],
        failure: [
          { type: 'damage', amount: [5, 11], cause: 'acid' },
          { type: 'ailment', id: 'infection', chance: 0.15 },
        ] },
    ],
  },

  supply_cache: {
    contexts: ['travel', 'scavenge'], weight: 1,
    choices: [
      { id: 'open', check: { kind: 'skill', skill: 'foraging', base: 0.72, perLevel: 0.03 },
        success: [
          { type: 'time', minutes: 20 },
          { type: 'loot', table: 'cache', rolls: [1, 2] },
          { type: 'xp', skill: 'foraging', amount: 8 },
        ],
        failure: [
          { type: 'damage', amount: [3, 8] },
          { type: 'ailment', id: 'bleeding', chance: 0.6 },
        ] },
      { id: 'leave', effects: [] },
    ],
  },

  rusted_debris: {
    contexts: ['scavenge'], weight: 3,
    choices: [
      { id: 'careful', check: { kind: 'skill', skill: 'foraging', base: 0.65, perLevel: 0.04 },
        success: [{ type: 'xp', skill: 'foraging', amount: 5 }],
        failure: [
          { type: 'damage', amount: [3, 6] },
          { type: 'ailment', id: 'bleeding', chance: 0.6 },
          { type: 'ailment', id: 'infection', chance: 0.2 },
        ] },
      { id: 'force', effects: [
        { type: 'damage', amount: [2, 4] },
        { type: 'ailment', id: 'bleeding', chance: 0.35 },
        { type: 'give', itemId: 'scrap_metal', qty: 1 },
      ] },
    ],
  },

  storm_at_sea: {
    contexts: ['travel'], terrain: 'sea', weight: 4,
    choices: [
      { id: 'ride_out', check: { kind: 'skill', skill: 'engineering', base: 0.5, perLevel: 0.06 },
        success: [
          { type: 'xp', skill: 'engineering', amount: 10 },
          { type: 'vital', vital: 'energy', amount: -10 },
        ],
        failure: [
          { type: 'damage', amount: [5, 12], cause: 'drowning' },
          { type: 'take', random: true, qty: 1 },
          { type: 'vital', vital: 'energy', amount: -15 },
        ] },
      { id: 'turn_back', effects: [{ type: 'travel_abort' }] },
    ],
  },

  lone_survivor: {
    contexts: ['travel', 'rest'], terrain: 'any', weight: 2,
    faction: 'nomad_guild',
    choices: [
      { id: 'share', requires: FOOD_OR_DRINK, effects: [
        { type: 'take', tags: ['food', 'drink'], qty: 1 },
        { type: 'loot', table: 'survivor_gift', rolls: 1 },
        { type: 'xp', skill: 'medical', amount: 6 },
        { type: 'reputation', factionId: 'nomad_guild', delta: 12, reason: 'aided_caravan_scout' },
      ] },
      { id: 'ignore', effects: [] },
    ],
  },

  night_prowler: {
    contexts: ['rest'], weight: 3,
    choices: [
      { id: 'confront', check: { kind: 'combat', base: 0.4 },
        success: [{ type: 'xp', skill: 'marksmanship', amount: 12 }],
        failure: [
          { type: 'damage', amount: [8, 16] },
          { type: 'ailment', id: 'bleeding', chance: 0.5 },
        ] },
      { id: 'hide', check: { kind: 'skill', skill: 'foraging', base: 0.5, perLevel: 0.05 },
        success: [],
        failure: [{ type: 'take', random: true, qty: 1 }] },
    ],
  },

  radio_static: {
    contexts: ['travel', 'rest'], terrain: 'any', weight: 2,
    choices: [
      { id: 'listen', effects: [
        { type: 'time', minutes: 30 },
        { type: 'reveal', count: 2 },
      ] },
      { id: 'ignore', effects: [] },
    ],
  },

  decompression_chamber: {
    contexts: ['travel', 'scavenge'], biomes: ['urban', 'suburban', 'industrial', 'military'], weight: 3,
    choices: [
      { id: 'decompress', check: { kind: 'skill', skill: 'medical', base: 0.5, perLevel: 0.08 },
        success: [
          { type: 'give', itemId: 'morphine_syrette_military', qty: 2 },
          { type: 'give', itemId: 'ammo_9mm_fmj', qty: 2 },
          { type: 'xp', skill: 'medical', amount: 25 },
        ],
        failure: [
          { type: 'damage', amount: [6, 12] },
          { type: 'ailment', id: 'bleeding', chance: 0.4 },
          { type: 'xp', skill: 'medical', amount: 8 },
        ] },
      { id: 'loot_pack', effects: [
        { type: 'give', itemId: 'energy_bar', qty: 2 },
        { type: 'give', itemId: 'bottled_water', qty: 1 },
        { type: 'xp', skill: 'foraging', amount: 8 },
      ] },
      { id: 'leave', effects: [] },
    ],
  },

  checkpoint_siphon: {
    contexts: ['travel'], biomes: ['industrial', 'wasteland', 'rural', 'military'], weight: 3, minDanger: 2,
    faction: 'iron_guard',
    choices: [
      { id: 'pay_toll', requires: FOOD_OR_DRINK, effects: [
        { type: 'take', tags: ['food', 'drink'], qty: 2 },
        { type: 'reputation', factionId: 'iron_guard', delta: 8, reason: 'obeyed_checkpoint_toll' },
      ] },
      { id: 'fight_sentry', check: { kind: 'combat', base: 0.35 },
        success: [
          { type: 'xp', skill: 'marksmanship', amount: 25 },
          { type: 'loot', table: 'raider', rolls: [2, 3] },
          { type: 'give', itemId: 'ammo_556_nato_fmj', qty: 1 },
          { type: 'reputation', factionId: 'iron_guard', delta: -30, reason: 'killed_checkpoint_sentry' },
        ],
        failure: [
          { type: 'damage', amount: [16, 28] },
          { type: 'ailment', id: 'bleeding', severity: 2, chance: 0.8 },
          { type: 'reputation', factionId: 'iron_guard', delta: -15, reason: 'attacked_sentry' },
        ] },
      { id: 'scale_gorge', check: { kind: 'skill', skill: 'foraging', base: 0.45, perLevel: 0.07 },
        success: [
          { type: 'vital', vital: 'energy', amount: -15 },
          { type: 'xp', skill: 'foraging', amount: 12 },
        ],
        failure: [
          { type: 'damage', amount: [8, 15] },
          { type: 'vital', vital: 'energy', amount: -25 },
          { type: 'ailment', id: 'sprain', chance: 0.6 },
        ] },
    ],
  },

  protocol47_cache: {
    contexts: ['travel', 'scavenge'], biomes: ['urban', 'military', 'industrial'], weight: 3,
    choices: [
      { id: 'decrypt', check: { kind: 'skill', skill: 'engineering', base: 0.4, perLevel: 0.08 },
        success: [
          { type: 'give', itemId: 'electronics', qty: 2 },
          { type: 'give', itemId: 'batteries', qty: 2 },
          { type: 'reveal', count: 3 },
          { type: 'xp', skill: 'engineering', amount: 25 },
        ],
        failure: [
          { type: 'damage', amount: [5, 10] },
          { type: 'time', minutes: 60 },
          { type: 'xp', skill: 'engineering', amount: 6 },
        ] },
      { id: 'salvage', effects: [
        { type: 'give', itemId: 'copper_wire', qty: 2 },
        { type: 'give', itemId: 'scrap_metal', qty: 3 },
        { type: 'time', minutes: 30 },
      ] },
      { id: 'ignore', effects: [] },
    ],
  },
};

