import { BALANCE } from '../../data/balance.js';
import { getItem } from '../../data/items.js';
import { skillLevel } from '../skills/skillSelectors.js';
import { SKILLS } from '../../data/skills.js';
import {
  capacity, carriedWeight, countItem, groundAt, hasEquippedFlag, matchingStacks, passiveTotal,
} from './inventoryModel.js';

const UNARMED_POWER = 1;

export function loadSummary(state) {
  const { inventory, player } = state;
  const extraKg = player?.trait === 'hoarder' ? 2.5 : 0;
  const limits = capacity(inventory);
  const totalKg = limits.kg + extraKg;
  const weight = carriedWeight(inventory);
  return {
    weight,
    capacityKg: totalKg,
    hardLimitKg: totalKg * BALANCE.inventory.hardLimitRatio,
    slotsUsed: inventory.stacks.length,
    slotsTotal: limits.slots,
    overloaded: weight > totalKg,
  };
}

export const isOverloaded = (state) => loadSummary(state).overloaded;

export function weaponProfile(state) {
  const weaponId = state.inventory.equipment.weapon;
  if (!weaponId) return { itemId: null, power: UNARMED_POWER, ammoId: null, loaded: true };
  const { power, ammo, unloadedPower } = getItem(weaponId).equip;
  const loaded = !ammo || countItem(state.inventory, ammo) > 0;
  return { itemId: weaponId, power: loaded ? power : unloadedPower, ammoId: ammo ?? null, loaded };
}

export function combatRating(state) {
  return weaponProfile(state).power + skillLevel(state, 'marksmanship') * SKILLS.marksmanship.bonusPerLevel;
}

export function armorValue(state) {
  const bodyId = state.inventory.equipment.body;
  return bodyId ? getItem(bodyId).equip.armor ?? 0 : 0;
}

export function incomingDamageMultiplier(state) {
  return Math.max(0.4, 1 - armorValue(state) * BALANCE.inventory.armorDamageReduction);
}

export const passiveBonus = (state, key) => passiveTotal(state.inventory, key);
export const hasGearFlag = (state, flag) => hasEquippedFlag(state.inventory, flag);
export const groundHere = (state) => groundAt(state.inventory, state.world.currentNodeId);

export function meetsRequirement(state, requires) {
  if (!requires) return true;
  return matchingStacks(state.inventory, requires).length > 0;
}

