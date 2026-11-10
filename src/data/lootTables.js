/**
 * Loot tables: `[itemId, weight, qty]` where qty is a number or `[min, max]`.
 * Biome tables feed scavenging; the rest are referenced by encounter effects.
 */
const entry = (itemId, weight, qty = 1) => ({ itemId, weight, qty });

export const LOOT_TABLES = {
  urban: [
    entry('canned_beans', 6), entry('bottled_water', 6), entry('energy_bar', 4, [1, 2]),
    entry('instant_coffee', 2), entry('bandage', 4), entry('painkillers', 3, [1, 3]),
    entry('electronics', 4), entry('copper_wire', 3, [1, 3]), entry('duct_tape', 2),
    entry('cloth_rags', 4, [1, 3]), entry('duffel_bag', 1), entry('flashlight', 1),
    entry('kitchen_knife', 1), entry('dirty_water', 3),
  ],
  suburban: [
    entry('canned_beans', 6), entry('bottled_water', 5), entry('jerky', 3, [1, 2]),
    entry('dirty_water', 4), entry('bandage', 4), entry('antiseptic', 2),
    entry('cloth_rags', 5, [1, 3]), entry('duct_tape', 3), entry('hiking_pack', 1),
    entry('leather_jacket', 1), entry('crowbar', 1), entry('flashlight', 1),
  ],
  industrial: [
    entry('scrap_metal', 8, [1, 3]), entry('copper_wire', 6, [1, 4]), entry('electronics', 4),
    entry('duct_tape', 4), entry('dirty_water', 4), entry('crowbar', 2), entry('fire_axe', 1),
    entry('hazmat_poncho', 1), entry('energy_bar', 2), entry('instant_coffee', 2),
  ],
  rural: [
    entry('jerky', 5, [1, 2]), entry('canned_beans', 4), entry('dirty_water', 6),
    entry('cloth_rags', 4, [1, 2]), entry('machete', 1), entry('hunting_rifle', 1),
    entry('rifle_rounds', 2, [3, 8]), entry('bandage', 2), entry('compass', 1),
  ],
  coastal: [
    entry('dirty_water', 6), entry('bottled_water', 3), entry('jerky', 4, [1, 2]),
    entry('canned_beans', 3), entry('cloth_rags', 4, [1, 3]), entry('duct_tape', 2),
    entry('scrap_metal', 3), entry('compass', 1), entry('antiseptic', 1),
  ],
  forest: [
    entry('dirty_water', 7), entry('jerky', 3), entry('cloth_rags', 2),
    entry('machete', 1), entry('rifle_rounds', 2, [2, 6]), entry('bandage', 2),
    entry('compass', 1),
  ],
  wasteland: [
    entry('dirty_water', 5), entry('scrap_metal', 6, [1, 2]), entry('copper_wire', 3),
    entry('energy_bar', 2), entry('hazmat_poncho', 1), entry('painkillers', 1),
  ],
  arctic: [
    entry('mre', 2), entry('bottled_water', 3), entry('instant_coffee', 3),
    entry('leather_jacket', 1), entry('scrap_metal', 3), entry('rifle_rounds', 2, [2, 6]),
  ],
  military: [
    entry('mre', 6), entry('bottled_water', 4), entry('rifle_rounds', 5, [4, 12]),
    entry('first_aid_kit', 2), entry('antibiotics', 2), entry('riot_vest', 1),
    entry('military_rucksack', 1), entry('hunting_rifle', 1), entry('electronics', 3),
  ],

  roadside: [
    entry('bottled_water', 4), entry('energy_bar', 4, [1, 2]), entry('duct_tape', 3),
    entry('scrap_metal', 3), entry('copper_wire', 3, [1, 2]), entry('flashlight', 1),
    entry('painkillers', 2, [1, 2]),
  ],
  cache: [
    entry('mre', 3), entry('bottled_water', 4, [1, 2]), entry('antibiotics', 2),
    entry('first_aid_kit', 1), entry('rifle_rounds', 2, [4, 10]), entry('hiking_pack', 1),
    entry('canned_beans', 3, [1, 2]),
  ],
  raider: [
    entry('rifle_rounds', 4, [3, 8]), entry('jerky', 3, [1, 3]), entry('machete', 1),
    entry('painkillers', 2, [1, 2]), entry('bottled_water', 3), entry('leather_jacket', 1),
  ],
  survivor_gift: [
    entry('antibiotics', 2), entry('bandage', 4, [1, 2]), entry('antiseptic', 2),
    entry('compass', 1),
  ],
};

