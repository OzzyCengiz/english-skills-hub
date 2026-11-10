/**
 * Outpost / settlement structures.
 *   maxLevel     maximum upgrade tier
 *   minutes      construction time per level
 *   costs        cost per level (index 0 = level 1, index 1 = level 2)
 */
export const STRUCTURES = {
  workbench: {
    glyph: '⚙',
    category: 'crafting',
    maxLevel: 2,
    minutes: 60,
    costs: [
      [
        { itemId: 'scrap_metal', qty: 2 },
        { itemId: 'duct_tape', qty: 1 },
      ],
      [
        { itemId: 'scrap_metal', qty: 3 },
        { itemId: 'electronics', qty: 2 },
        { itemId: 'copper_wire', qty: 2 },
      ],
    ],
    grantsStationTier: [1, 2],
  },
  rain_catcher: {
    glyph: '◊',
    category: 'survival',
    maxLevel: 2,
    minutes: 45,
    costs: [
      [
        { itemId: 'cloth_rags', qty: 3 },
        { itemId: 'duct_tape', qty: 1 },
      ],
      [
        { itemId: 'scrap_metal', qty: 2 },
        { itemId: 'cloth_rags', qty: 3 },
      ],
    ],
    waterEveryHours: [12, 6],
  },
  greenhouse: {
    glyph: '🌱',
    category: 'survival',
    maxLevel: 2,
    minutes: 60,
    costs: [
      [
        { itemId: 'cloth_rags', qty: 4 },
        { itemId: 'duct_tape', qty: 2 },
        { itemId: 'scrap_metal', qty: 2 },
      ],
      [
        { itemId: 'scrap_metal', qty: 4 },
        { itemId: 'copper_wire', qty: 3 },
        { itemId: 'electronics', qty: 1 },
      ],
    ],
    foodEveryHours: [16, 8],
  },
  barricade: {
    glyph: '▤',
    category: 'defense',
    maxLevel: 3,
    minutes: 45,
    costs: [
      [{ itemId: 'scrap_metal', qty: 2 }],
      [
        { itemId: 'scrap_metal', qty: 3 },
        { itemId: 'duct_tape', qty: 1 },
      ],
      [
        { itemId: 'scrap_metal', qty: 4 },
        { itemId: 'copper_wire', qty: 2 },
      ],
    ],
    defenseBonus: [1, 2, 3],
  },
  med_cot: {
    glyph: '✚',
    category: 'medical',
    maxLevel: 2,
    minutes: 45,
    costs: [
      [
        { itemId: 'cloth_rags', qty: 4 },
        { itemId: 'bandage', qty: 2 },
      ],
      [
        { itemId: 'cloth_rags', qty: 6 },
        { itemId: 'first_aid_kit', qty: 1 },
        { itemId: 'antiseptic', qty: 1 },
      ],
    ],
    restHealBonus: [2.0, 4.5],
  },
  radio_relay: {
    glyph: '📡',
    category: 'utility',
    maxLevel: 2,
    minutes: 60,
    costs: [
      [
        { itemId: 'scrap_metal', qty: 3 },
        { itemId: 'copper_wire', qty: 3 },
        { itemId: 'electronics', qty: 1 },
      ],
      [
        { itemId: 'scrap_metal', qty: 4 },
        { itemId: 'copper_wire', qty: 4 },
        { itemId: 'electronics', qty: 2 },
      ],
    ],
    signalBoost: [1, 2],
  },
  vehicle_depot: {
    glyph: '🛞',
    category: 'utility',
    maxLevel: 2,
    minutes: 90,
    costs: [
      [
        { itemId: 'scrap_metal', qty: 4 },
        { itemId: 'duct_tape', qty: 2 },
        { itemId: 'copper_wire', qty: 2 },
      ],
      [
        { itemId: 'scrap_metal', qty: 6 },
        { itemId: 'duct_tape', qty: 4 },
        { itemId: 'electronics', qty: 2 },
      ],
    ],
    repairEveryHours: [12, 6],
  },
  generator: {
    glyph: '⚡',
    category: 'power',
    maxLevel: 2,
    minutes: 75,
    costs: [
      [
        { itemId: 'scrap_metal', qty: 4 },
        { itemId: 'copper_wire', qty: 3 },
        { itemId: 'electronics', qty: 2 },
      ],
      [
        { itemId: 'scrap_metal', qty: 6 },
        { itemId: 'copper_wire', qty: 5 },
        { itemId: 'electronics', qty: 3 },
      ],
    ],
    fuelCapacityHours: [24, 48],
  },
};

export function getStructure(structureId) {
  const structure = STRUCTURES[structureId];
  if (!structure) throw new Error(`Unknown structure "${structureId}"`);
  return structure;
}
