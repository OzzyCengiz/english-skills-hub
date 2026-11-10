/**
 * Selectable survivor backgrounds and starting anchors for the Main Menu
 * New Expedition screen.
 */
export const STARTING_LOCATIONS = [
  'istanbul',
  'berlin',
  'london',
  'cairo',
  'moscow',
  'tokyo',
  'new_york',
  'sao_paulo',
  'sydney',
];

export const ARCHETYPES = {
  scavenger: {
    glyph: '⊕',
    equipment: { weapon: 'kitchen_knife', body: null, pack: 'duffel_bag' },
    kit: [
      { itemId: 'bottled_water', qty: 2 },
      { itemId: 'canned_beans', qty: 2 },
      { itemId: 'bandage', qty: 1 },
      { itemId: 'cloth_rags', qty: 2 },
      { itemId: 'compass', qty: 1 },
    ],
    skills: { foraging: 25 },
  },
  medic: {
    glyph: '✚',
    equipment: { weapon: 'kitchen_knife', body: 'hazmat_poncho', pack: null },
    kit: [
      { itemId: 'bottled_water', qty: 2 },
      { itemId: 'energy_bar', qty: 2 },
      { itemId: 'first_aid_kit', qty: 1 },
      { itemId: 'antibiotics', qty: 2 },
      { itemId: 'antiseptic', qty: 1 },
      { itemId: 'bandage', qty: 3 },
    ],
    skills: { medical: 30 },
  },
  engineer: {
    glyph: '⚙',
    equipment: { weapon: 'crowbar', body: null, pack: null },
    kit: [
      { itemId: 'bottled_water', qty: 2 },
      { itemId: 'canned_beans', qty: 1 },
      { itemId: 'scrap_metal', qty: 3 },
      { itemId: 'duct_tape', qty: 2 },
      { itemId: 'copper_wire', qty: 3 },
      { itemId: 'electronics', qty: 1 },
    ],
    skills: { engineering: 30 },
  },
  veteran: {
    glyph: '⊹',
    equipment: { weapon: 'machete', body: 'leather_jacket', pack: null },
    kit: [
      { itemId: 'bottled_water', qty: 2 },
      { itemId: 'mre', qty: 2 },
      { itemId: 'bandage', qty: 2 },
      { itemId: 'painkillers', qty: 2 },
    ],
    skills: { marksmanship: 30 },
  },
};

