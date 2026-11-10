/**
 * Last Breath // Post-Apocalyptic Barter Economy Engine
 * Zero fiat currency. Zero digital credits.
 * Pure physical trade of ammunition, medical compounds, clean water, and salvage.
 */

import { getItem } from '../../data/items.js';
import { countItem } from '../inventory/inventoryModel.js';
import { skillLevel } from '../skills/skillSelectors.js';
import { FactionManager } from '../factions/factionManager.js';

export const MERCHANT_TYPES = {
  NOMAD_CARAVAN: 'nomad_caravan',
  IRON_GUARD_QUARTERMASTER: 'iron_guard_quartermaster',
  WASTELAND_PEDDLER: 'wasteland_peddler',
};

export const MERCHANT_PROFILES = {
  [MERCHANT_TYPES.NOMAD_CARAVAN]: {
    faction: 'nomad_guild',
    inventoryStock: [
      { itemId: 'combat_tourniquet_cat', qty: 2 },
      { itemId: 'chest_seal_vented', qty: 2 },
      { itemId: 'ciprofloxacin_antibiotic', qty: 2 },
      { itemId: 'sam_splint_roll', qty: 1 },
      { itemId: 'ammo_9mm_fmj', qty: 45 },
      { itemId: 'bottled_water', qty: 4 },
      { itemId: 'mre', qty: 3 },
      { itemId: 'high_lumen_tactical_flashlight', qty: 1 },
    ],
  },
  [MERCHANT_TYPES.IRON_GUARD_QUARTERMASTER]: {
    faction: 'iron_guard',
    minStanding: -20, // Rejects trade with hostile scavengers
    inventoryStock: [
      { itemId: 'chest_seal_vented', qty: 2 },
      { itemId: 'rifle_rounds', qty: 40 },
      { itemId: 'ammo_12g_buckshot_00', qty: 20 },
      { itemId: 'gp5_gas_mask_civilian', qty: 1 },
      { itemId: 'gas_mask_m40_filter', qty: 2 },
      { itemId: 'hazmat_poncho', qty: 1 },
    ],
  },
  [MERCHANT_TYPES.WASTELAND_PEDDLER]: {
    faction: 'ash_marauders',
    inventoryStock: [
      { itemId: 'canned_beans', qty: 3 },
      { itemId: 'ammo_9mm_fmj', qty: 18 },
      { itemId: 'copper_wire', qty: 5 },
      { itemId: 'electronics', qty: 2 },
      { itemId: 'scrap_metal', qty: 4 },
      { itemId: 'cloth_rags', qty: 6 },
    ],
  },
};

/**
 * Calculates intrinsic commodity barter value for an item.
 */
export function getItemBarterValue(itemId) {
  if (!itemId) return 0;
  const item = getItem(itemId);
  if (!item) return 1;

  // Specific high-value essentials
  const overrides = {
    combat_tourniquet_cat: 85,
    cat_tourniquet_gen7: 85,
    chest_seal_vented: 95,
    chest_seal_twin_pack: 140,
    decompression_needle_14g: 110,
    sam_splint_roll: 60,
    sam_splint_36inch: 60,
    ciprofloxacin_antibiotic: 80,
    ciprofloxacin_500mg_box: 80,
    broad_spectrum_antibiotics: 75,
    morphine_auto_injector: 130,
    gp5_gas_mask_civilian: 120,
    gas_mask_m40_filter: 70,
    hazmat_poncho: 150,
    car_battery_lead_acid: 75,
    car_battery_12v_lead_acid: 85,
    gasoline_fuel_canister_5l: 60,
    diesel_fuel_canister_5l: 60,
    diesel_fuel_canister_10l: 110,
    motor_oil_10w40_bottle: 40,
    motor_oil_synthetic_10w40: 50,
    spark_plug_set: 45,
    fuel_siphon_hose: 35,
    hunting_rifle: 240,
    hunting_rifle_308: 240,
    pump_shotgun_12g: 220,
    high_lumen_tactical_flashlight: 65,
    folding_camp_wood_stove: 160,
    thermal_mylar_bivvy_emergency_sleeping_bag: 75,
    ammo_9mm_fmj: 3,
    ammo_12g_buckshot_00: 5,
    rifle_rounds: 5,
    copper_wire: 12,
    electronics: 25,
    scrap_metal: 8,
    bottled_water: 15,
    canned_beans: 15,
    mre: 30,
  };

  if (overrides[itemId]) return overrides[itemId];

  // Dynamic derivation based on category, weight, and properties
  let val = 10;
  if (item.category === 'medical') val = 45;
  else if (item.category === 'weapons') val = item.equip?.power ? item.equip.power * 25 : 30;
  else if (item.category === 'gear') val = 40;
  else if (item.category === 'scrap') val = 15;
  else if (item.category === 'supplies') val = 12;

  if (item.equip?.armor) val += item.equip.armor * 30;
  if (item.tags?.includes('ammo')) val = 4;

  return Math.max(1, Math.round(val));
}

export class BarterEngine {
  /**
   * Evaluates barter value of a list of items: [{ itemId, qty }]
   */
  static calculateTotalValue(items = []) {
    return items.reduce((sum, { itemId, qty }) => {
      return sum + getItemBarterValue(itemId) * (qty || 1);
    }, 0);
  }

  /**
   * Computes the trade equation, applying faction reputation modifiers and haggling discounts.
   */
  static evaluateTrade({
    playerOffer = [],
    merchantDemands = [],
    merchantType = MERCHANT_TYPES.NOMAD_CARAVAN,
    state,
    haggleDiscount = 0,
  }) {
    const profile = MERCHANT_PROFILES[merchantType] || MERCHANT_PROFILES[MERCHANT_TYPES.NOMAD_CARAVAN];
    const factionId = profile.faction;

    // Faction multiplier: allied gets 30% discount; hostile has 30% markup
    const factionMultiplier = FactionManager.getDiscountMultiplier(state, factionId);

    const playerTotal = this.calculateTotalValue(playerOffer);
    const merchantBaseTotal = this.calculateTotalValue(merchantDemands);

    // Apply faction standing and haggling discounts to merchant item prices
    const totalDiscountMod = Math.max(0.40, factionMultiplier - haggleDiscount);
    const merchantRequiredTotal = Math.round(merchantBaseTotal * totalDiscountMod);

    const difference = playerTotal - merchantRequiredTotal;
    const isBalanced = merchantRequiredTotal === 0 ? true : difference >= 0;

    return {
      playerTotal,
      merchantBaseTotal,
      merchantRequiredTotal,
      difference,
      isBalanced,
      discountPercent: Math.round((1 - totalDiscountMod) * 100),
      factionId,
    };
  }

  /**
   * Attempts a haggle check to negotiate better prices with the merchant.
   */
  static attemptHaggle({ state, merchantType, rng }) {
    const foraging = skillLevel(state, 'foraging');
    const profile = MERCHANT_PROFILES[merchantType] || MERCHANT_PROFILES[MERCHANT_TYPES.NOMAD_CARAVAN];
    const standing = FactionManager.getStanding(state, profile.faction);

    // Baseline chance: 45% + foraging skill + standing bonus
    let successChance = 0.45 + foraging * 0.05;
    if (standing > 25) successChance += 0.15;
    else if (standing < -20) successChance -= 0.20;

    const success = rng ? rng.chance(successChance) : Math.random() < successChance;

    if (success) {
      return {
        ok: true,
        discount: 0.18, // 18% bonus discount
        messageKey: 'barter.haggle_success',
      };
    }

    return {
      ok: false,
      discount: -0.10, // 10% penalty markup for offensive haggling
      messageKey: 'barter.haggle_failed',
    };
  }
}
