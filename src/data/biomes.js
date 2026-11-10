/**
 * Biomes shape travel cost, encounter pressure and what scavenging yields.
 * `travelTime` multiplies journey duration into a node of that biome.
 */
export const BIOMES = {
  urban:      { travelTime: 1.15, encounterRate: 0.32, lootTable: 'urban',      yield: [1, 3] },
  suburban:   { travelTime: 1.0,  encounterRate: 0.24, lootTable: 'suburban',   yield: [1, 3] },
  industrial: { travelTime: 1.1,  encounterRate: 0.28, lootTable: 'industrial', yield: [1, 3] },
  rural:      { travelTime: 0.95, encounterRate: 0.2,  lootTable: 'rural',      yield: [1, 2] },
  coastal:    { travelTime: 1.0,  encounterRate: 0.22, lootTable: 'coastal',    yield: [1, 3] },
  forest:     { travelTime: 1.3,  encounterRate: 0.26, lootTable: 'forest',     yield: [1, 2] },
  wasteland:  { travelTime: 1.2,  encounterRate: 0.28, lootTable: 'wasteland',  yield: [0, 2] },
  arctic:     { travelTime: 1.5,  encounterRate: 0.22, lootTable: 'arctic',     yield: [0, 2] },
  military:   { travelTime: 1.1,  encounterRate: 0.42, lootTable: 'military',   yield: [1, 3] },
};

