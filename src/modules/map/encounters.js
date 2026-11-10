import { ENCOUNTERS } from '../../data/encounters.js';
import { BALANCE } from '../../data/balance.js';
import { combatRating, hasGearFlag, meetsRequirement, weaponProfile } from '../inventory/inventorySelectors.js';
import { skillLevel } from '../skills/skillSelectors.js';
import { getNode } from './mapGraph.js';
import { FactionManager } from '../factions/factionManager.js';

const clampChance = (value) =>
  Math.max(BALANCE.checks.minChance, Math.min(BALANCE.checks.maxChance, value));

export function pickEncounter(rng, { context, nodeId, mode = 'road' }) {
  const node = getNode(nodeId);
  const terrain = mode === 'sea' ? 'sea' : 'land';

  const pool = Object.entries(ENCOUNTERS)
    .filter(([, def]) => {
      if (!def.contexts.includes(context)) return false;
      const defTerrain = def.terrain ?? 'land';
      if (defTerrain !== 'any' && defTerrain !== terrain) return false;
      if (def.biomes && !def.biomes.includes(node.biome)) return false;
      if (def.minDanger && node.danger < def.minDanger) return false;
      return true;
    })
    .map(([id, def]) => ({ id, ...def }));

  if (pool.length === 0) return null;
  return rng.weighted(pool, (entry) => entry.weight ?? 1);
}

/** Computes the exact success probability (0..1) of a choice check. */
export function evaluateCheckChance(state, check) {
  if (!check) return 1;
  switch (check.kind) {
    case 'skill': {
      const level = skillLevel(state, check.skill);
      return clampChance(check.base + level * (check.perLevel ?? 0.05));
    }
    case 'combat': {
      const rating = combatRating(state);
      return clampChance(check.base + rating * BALANCE.checks.combatPerRating);
    }
    case 'gear': {
      return hasGearFlag(state, check.flag) ? 0.95 : clampChance(check.base ?? 0.15);
    }
    default:
      return 0.5;
  }
}

export function describeEncounter(state, encounterState) {
  if (!encounterState) return null;
  const rawDef = ENCOUNTERS[encounterState.id];
  if (!rawDef) return null;

  const def = rawDef.faction ? FactionManager.modifyEncounterByFaction(state, rawDef, rawDef.faction) : rawDef;

  const choices = def.choices.map((choice) => {
    const available = meetsRequirement(state, choice.requires);
    const chance = choice.check ? evaluateCheckChance(state, choice.check) : null;
    return {
      id: choice.id,
      available,
      requires: choice.requires ?? null,
      check: choice.check ? { ...choice.check, chance } : null,
    };
  });

  return {
    id: encounterState.id,
    context: encounterState.context,
    nodeId: encounterState.nodeId,
    choices,
    factionId: rawDef.faction ?? null,
  };
}

export function consumeCombatAmmo(store, check) {
  if (check?.kind !== 'combat') return;
  const weapon = weaponProfile(store.state);
  if (weapon.ammoId && weapon.loaded) {
    store.commit('inventory/remove', { itemId: weapon.ammoId, qty: 1 });
  }
}

