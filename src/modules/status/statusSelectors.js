import { BALANCE } from '../../data/balance.js';
import { AILMENTS } from '../../data/ailments.js';
import { getBodyDebuffs } from './bodyStatus.js';

export const VITALS = ['health', 'satiety', 'hydration', 'energy'];
export const NEEDS = ['satiety', 'hydration', 'energy'];

export function vitalBand(value) {
  const { fine, low, critical } = BALANCE.vitals.bands;
  if (value >= fine) return 'fine';
  if (value >= low) return 'low';
  if (value >= critical) return 'critical';
  return 'depleted';
}

export function isSymptomatic(player) {
  const infection = player.ailments.infection;
  return Boolean(infection && infection.progress >= AILMENTS.infection.symptomaticAt);
}

export function canRegenerate(player) {
  const { requires } = BALANCE.regeneration;
  return !player.ailments.bleeding
    && !isSymptomatic(player)
    && player.satiety >= requires.satiety
    && player.hydration >= requires.hydration;
}

/** Multiplier (>1 means slower) applied to journey duration by the body's condition. */
export function statusTravelMultiplier(state) {
  const { player } = state;
  let multiplier = 1;
  if (player.energy < BALANCE.travel.exhaustedThreshold) multiplier *= BALANCE.travel.exhaustedTimeMultiplier;
  if (player.ailments.sprain) multiplier *= AILMENTS.sprain.travelTimeMultiplier;
  if (player.ailments.pain) multiplier *= (AILMENTS.pain?.travelTimeMultiplier || 1.10);
  if (player.body) {
    const debuffs = getBodyDebuffs(player.body);
    multiplier *= debuffs.travelTimeMultiplier;
  }
  return multiplier;
}

/** Ailment magnitude normalised to 0..1 for meters. */
export function ailmentIntensity(id, data) {
  switch (id) {
    case 'bleeding': return data.severity / AILMENTS.bleeding.maxSeverity;
    case 'infection': return data.progress / 100;
    case 'sprain': return Math.min(1, data.hours / AILMENTS.sprain.initial.hours);
    case 'pain': return Math.min(1, (data.severity || 1) / (AILMENTS.pain?.maxSeverity || 5));
    case 'poison': return Math.min(1, (data.severity || 1) / (AILMENTS.poison?.maxSeverity || 100));
    default: return 0.5;
  }
}

