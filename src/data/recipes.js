/**
 * Crafting recipes.
 *   category     'survival' | 'medical' | 'weapons' | 'gear'
 *   tier         0 = handcraft anywhere, 1 = Field Workbench, 2 = Machinist Bench
 *   minutes      time spent crafting
 *   ingredients  [{ itemId, qty }]
 *   output       { itemId, qty }
 *   xp           { skill, amount }
 */
export const RECIPES = {
  // --- SURVIVAL ---
  clean_water: {
    category: 'survival',
    tier: 0,
    minutes: 15,
    ingredients: [
      { itemId: 'dirty_water', qty: 1 },
      { itemId: 'cloth_rags', qty: 1 },
    ],
    output: { itemId: 'bottled_water', qty: 1 },
    xp: { skill: 'foraging', amount: 5 },
  },
  fuel_siphon_hose: {
    category: 'survival',
    tier: 0,
    minutes: 20,
    ingredients: [
      { itemId: 'copper_wire', qty: 2 },
      { itemId: 'duct_tape', qty: 1 },
      { itemId: 'cloth_rags', qty: 1 },
    ],
    output: { itemId: 'fuel_siphon_hose', qty: 1 },
    xp: { skill: 'engineering', amount: 10 },
  },
  dynamo_lamp: {
    category: 'survival',
    tier: 1,
    minutes: 45,
    ingredients: [
      { itemId: 'electronics', qty: 1 },
      { itemId: 'copper_wire', qty: 2 },
      { itemId: 'duct_tape', qty: 1 },
    ],
    output: { itemId: 'flashlight', qty: 1 },
    xp: { skill: 'engineering', amount: 15 },
  },

  // --- MEDICAL ---
  makeshift_bandage: {
    category: 'medical',
    tier: 0,
    minutes: 10,
    ingredients: [{ itemId: 'cloth_rags', qty: 2 }],
    output: { itemId: 'bandage', qty: 1 },
    xp: { skill: 'medical', amount: 5 },
  },
  antiseptic_compress: {
    category: 'medical',
    tier: 0,
    minutes: 20,
    ingredients: [
      { itemId: 'bandage', qty: 1 },
      { itemId: 'antiseptic', qty: 1 },
    ],
    output: { itemId: 'first_aid_kit', qty: 1 },
    xp: { skill: 'medical', amount: 12 },
  },
  combat_tourniquet: {
    category: 'medical',
    tier: 1,
    minutes: 30,
    ingredients: [
      { itemId: 'cloth_rags', qty: 2 },
      { itemId: 'duct_tape', qty: 2 },
      { itemId: 'scrap_metal', qty: 1 },
    ],
    output: { itemId: 'combat_tourniquet_cat', qty: 1 },
    xp: { skill: 'medical', amount: 18 },
  },
  hemostatic_dressing: {
    category: 'medical',
    tier: 1,
    minutes: 30,
    ingredients: [
      { itemId: 'bandage', qty: 2 },
      { itemId: 'antiseptic', qty: 1 },
    ],
    output: { itemId: 'quikclot_hemostatic_gauze', qty: 1 },
    xp: { skill: 'medical', amount: 20 },
  },

  // --- WEAPONS & AMMO ---
  nailed_bat: {
    category: 'weapons',
    tier: 0,
    minutes: 20,
    ingredients: [
      { itemId: 'scrap_metal', qty: 1 },
      { itemId: 'duct_tape', qty: 1 },
    ],
    output: { itemId: 'nailed_baseball_bat', qty: 1 },
    xp: { skill: 'engineering', amount: 10 },
  },
  barbed_wire_club: {
    category: 'weapons',
    tier: 0,
    minutes: 25,
    ingredients: [
      { itemId: 'copper_wire', qty: 3 },
      { itemId: 'duct_tape', qty: 1 },
    ],
    output: { itemId: 'barbed_wire_bat', qty: 1 },
    xp: { skill: 'engineering', amount: 12 },
  },
  salvaged_blade: {
    category: 'weapons',
    tier: 1,
    minutes: 45,
    ingredients: [
      { itemId: 'scrap_metal', qty: 2 },
      { itemId: 'duct_tape', qty: 1 },
      { itemId: 'cloth_rags', qty: 1 },
    ],
    output: { itemId: 'machete', qty: 1 },
    xp: { skill: 'engineering', amount: 14 },
  },
  rebar_crusher: {
    category: 'weapons',
    tier: 1,
    minutes: 40,
    ingredients: [
      { itemId: 'scrap_metal', qty: 3 },
      { itemId: 'duct_tape', qty: 2 },
    ],
    output: { itemId: 'rebar_club_heavy', qty: 1 },
    xp: { skill: 'engineering', amount: 15 },
  },
  handloaded_9mm: {
    category: 'weapons',
    tier: 1,
    minutes: 35,
    ingredients: [
      { itemId: 'scrap_metal', qty: 1 },
      { itemId: 'copper_wire', qty: 1 },
    ],
    output: { itemId: 'ammo_9mm_fmj', qty: 8 },
    xp: { skill: 'engineering', amount: 12 },
  },
  handloaded_12g: {
    category: 'weapons',
    tier: 1,
    minutes: 40,
    ingredients: [
      { itemId: 'scrap_metal', qty: 1 },
      { itemId: 'duct_tape', qty: 1 },
    ],
    output: { itemId: 'ammo_12g_buckshot_00', qty: 6 },
    xp: { skill: 'engineering', amount: 14 },
  },
  reloaded_ammo: {
    category: 'weapons',
    tier: 2,
    minutes: 45,
    ingredients: [
      { itemId: 'scrap_metal', qty: 1 },
      { itemId: 'copper_wire', qty: 2 },
    ],
    output: { itemId: 'rifle_rounds', qty: 6 },
    xp: { skill: 'engineering', amount: 18 },
  },
  handloaded_556: {
    category: 'weapons',
    tier: 2,
    minutes: 50,
    ingredients: [
      { itemId: 'scrap_metal', qty: 2 },
      { itemId: 'copper_wire', qty: 2 },
    ],
    output: { itemId: 'ammo_556_nato_fmj', qty: 8 },
    xp: { skill: 'engineering', amount: 20 },
  },

  // --- GEAR & ARMOR ---
  patched_leathers: {
    category: 'gear',
    tier: 1,
    minutes: 60,
    ingredients: [
      { itemId: 'cloth_rags', qty: 4 },
      { itemId: 'duct_tape', qty: 2 },
      { itemId: 'scrap_metal', qty: 1 },
    ],
    output: { itemId: 'leather_jacket', qty: 1 },
    xp: { skill: 'engineering', amount: 16 },
  },
  hazmat_poncho: {
    category: 'gear',
    tier: 1,
    minutes: 40,
    ingredients: [
      { itemId: 'cloth_rags', qty: 3 },
      { itemId: 'duct_tape', qty: 2 },
    ],
    output: { itemId: 'hazmat_poncho', qty: 1 },
    xp: { skill: 'engineering', amount: 15 },
  },
  spark_plug_salvage: {
    category: 'gear',
    tier: 1,
    minutes: 35,
    ingredients: [
      { itemId: 'scrap_metal', qty: 2 },
      { itemId: 'copper_wire', qty: 2 },
    ],
    output: { itemId: 'spark_plug_set', qty: 1 },
    xp: { skill: 'engineering', amount: 16 },
  },
  plated_rig: {
    category: 'gear',
    tier: 2,
    minutes: 90,
    ingredients: [
      { itemId: 'scrap_metal', qty: 3 },
      { itemId: 'duct_tape', qty: 2 },
      { itemId: 'cloth_rags', qty: 3 },
    ],
    output: { itemId: 'riot_vest', qty: 1 },
    xp: { skill: 'engineering', amount: 25 },
  },
  tactical_backpack: {
    category: 'gear',
    tier: 2,
    minutes: 80,
    ingredients: [
      { itemId: 'cloth_rags', qty: 6 },
      { itemId: 'duct_tape', qty: 3 },
      { itemId: 'copper_wire', qty: 2 },
    ],
    output: { itemId: 'tactical_assault_pack_35l', qty: 1 },
    xp: { skill: 'engineering', amount: 24 },
  },
};

export function getRecipe(recipeId) {
  const recipe = RECIPES[recipeId];
  if (!recipe) throw new Error(`Unknown recipe "${recipeId}"`);
  return recipe;
}
