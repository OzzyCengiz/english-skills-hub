import { BALANCE } from '../../data/balance.js';
import { getItem } from '../../data/items.js';
import { ref } from '../../i18n/i18n.js';
import { rollRange } from '../../core/rng.js';
import {
  addItem, addToGround, countItem, equipItem, matchingStacks, removeFromGround, removeItem, unequipSlot,
} from './inventoryModel.js';
import { rollLoot } from './loot.js';
import { codexManager } from '../../core/codexManager.js';
import { getRecommendedTargetPart, applyMedicalTreatment } from '../status/bodyStatus.js';

const EQUIP_MINUTES = 5;
const itemName = (itemId) => ref(`item.${itemId}.name`);

function createStartingInventory() {
  let inventory = { stacks: [], equipment: { ...BALANCE.startingEquipment }, ground: {} };
  for (const { itemId, qty } of BALANCE.startingKit) inventory = addItem(inventory, itemId, qty).inventory;
  return inventory;
}

/** Treatment items are refused when they would do nothing, instead of silently wasting them. */
function wouldBeWasted(item, player, itemId = '') {
  if (!item.use || !item.use.effects) return true;
  const effects = item.use.effects;
  const body = player.body || {};
  const parts = Object.values(body);

  let hasTreatableCondition = false;

  for (const eff of effects) {
    if (eff.type === 'heal') {
      if (player.health < 100 || parts.some((p) => p.health < 100)) {
        hasTreatableCondition = true;
      }
    } else if (eff.type === 'vital') {
      const current = player[eff.vital];
      if (current != null && current < 100) {
        hasTreatableCondition = true;
      }
    } else if (eff.type === 'cure') {
      const id = eff.id;
      if (player.ailments && player.ailments[id]) {
        hasTreatableCondition = true;
      }
      if (id === 'bleeding' && (player.ailments?.bleeding || parts.some((p) => p.bleeding && p.bleeding !== 'none'))) {
        hasTreatableCondition = true;
      }
      if (id === 'infection' && (player.ailments?.infection || parts.some((p) => (p.infectionRisk || 0) > 0))) {
        hasTreatableCondition = true;
      }
      if (id === 'infectionRisk' && parts.some((p) => (p.infectionRisk || 0) > 0)) {
        hasTreatableCondition = true;
      }
      if ((id === 'sprain' || id === 'fracture') && (player.ailments?.sprain || parts.some((p) => p.fractures))) {
        hasTreatableCondition = true;
      }
      if (id === 'burn' && parts.some((p) => p.burns)) {
        hasTreatableCondition = true;
      }
      if ((id === 'puncture' || id === 'pneumothorax') && body.torso?.punctured) {
        hasTreatableCondition = true;
      }
      if (id === 'pain' && (player.ailments?.pain || parts.some((p) => p.health < 80 || p.fractures || p.burns))) {
        hasTreatableCondition = true;
      }
      if (id === 'poison' && player.ailments?.poison) {
        hasTreatableCondition = true;
      }
      if (id === 'fever' && (player.ailments?.fever || player.ailments?.infection)) {
        hasTreatableCondition = true;
      }
      if (id === 'parasites' || id === 'malaria') {
        hasTreatableCondition = true;
      }
    } else if (eff.type === 'stat') {
      hasTreatableCondition = true;
    }
  }

  if (item.category === 'medical') {
    if (hasTreatableCondition) return false;
    const target = getRecommendedTargetPart(body, itemId);
    const probe = applyMedicalTreatment(JSON.parse(JSON.stringify(body)), itemId, target);
    if (probe.success) return false;

    return true;
  }

  const onlyCures = effects.every((eff) => eff.type === 'cure');
  if (onlyCures && !hasTreatableCondition) return true;

  return false;
}

/** Puts items in the pack; whatever does not fit is dropped where the player stands. */
export function grantItems({ store, engine }, itemId, qty) {
  const accepted = store.commit('inventory/add', { itemId, qty });
  if (accepted > 0) engine.log('log.inventory.gained', { item: itemName(itemId), count: accepted }, 'good');
  const overflow = qty - accepted;
  if (overflow > 0) {
    store.commit('inventory/toGround', { nodeId: store.state.world.currentNodeId, itemId, qty: overflow });
    engine.log('log.inventory.left_behind', { item: itemName(itemId), count: overflow }, 'warn');
  }
}

function registerInventoryMutations(store) {
  store.registerMutations('inventory', {
    add(state, { itemId, qty }) {
      const result = addItem(state.inventory, itemId, qty);
      state.inventory = result.inventory;
      return result.accepted;
    },
    remove(state, { itemId, qty }) {
      const result = removeItem(state.inventory, itemId, qty);
      state.inventory = result.inventory;
      return result.removed;
    },
    equip(state, { itemId }) {
      state.inventory = equipItem(state.inventory, itemId).inventory;
    },
    unequip(state, { slot }) {
      state.inventory = unequipSlot(state.inventory, slot).inventory;
    },
    toGround(state, { nodeId, itemId, qty }) {
      state.inventory = addToGround(state.inventory, nodeId, itemId, qty);
    },
    fromGround(state, { nodeId, itemId, qty }) {
      const result = removeFromGround(state.inventory, nodeId, itemId, qty);
      state.inventory = result.inventory;
      return result.removed;
    },
  });
}

function registerInventoryActions(engine) {
  engine.registerAction('inventory/use', ({ itemId }, ctx) => {
    const { store, effects } = ctx;
    const item = getItem(itemId);
    if (!item.use) return { ok: false, reason: 'reject.not_usable' };
    if (countItem(store.state.inventory, itemId) < 1) return { ok: false, reason: 'reject.missing_item' };
    if (wouldBeWasted(item, store.state.player, itemId)) return { ok: false, reason: 'reject.nothing_to_treat' };

    store.commit('inventory/remove', { itemId, qty: 1 });
    engine.log('log.inventory.used', { item: itemName(itemId) });

    if (item.category === 'medical') {
      codexManager.trackCareer('totalMedicalTreatments', 1);
      if (itemId.includes('tourniquet') || itemId.includes('splint') || itemId.includes('chest_seal') || itemId.includes('ciprofloxacin')) {
        codexManager.unlockAchievement('trauma_surgeon');
      }
      if (store.state.player.body) {
        const target = getRecommendedTargetPart(store.state.player.body, itemId);
        const res = applyMedicalTreatment(store.state.player.body, itemId, target, { bus: ctx.bus });
        if (res.actionDesc) {
          engine.log(res.actionDesc, {}, 'good');
        }
      }
    }

    effects.apply(item.use.effects, ctx, { kind: 'item', itemId });
    engine.advanceTime(item.use.minutes);
    return { ok: true };
  }, { allowDuringEncounter: true });

  engine.registerAction('inventory/drop', ({ itemId, qty = 1 }, { store }) => {
    const removed = store.commit('inventory/remove', { itemId, qty });
    if (removed === 0) return { ok: false, reason: 'reject.missing_item' };
    store.commit('inventory/toGround', { nodeId: store.state.world.currentNodeId, itemId, qty: removed });
    engine.log('log.inventory.dropped', { item: itemName(itemId), count: removed });
    return { ok: true };
  });

  engine.registerAction('inventory/pickup', ({ itemId, qty = 1 }, { store }) => {
    const nodeId = store.state.world.currentNodeId;
    const planned = addItem(store.state.inventory, itemId, qty);
    if (planned.accepted === 0) {
      return { ok: false, reason: planned.reason === 'weight' ? 'reject.too_heavy' : 'reject.no_room' };
    }
    const lifted = store.commit('inventory/fromGround', { nodeId, itemId, qty: planned.accepted });
    store.commit('inventory/add', { itemId, qty: lifted });
    engine.log('log.inventory.picked_up', { item: itemName(itemId), count: lifted });
    return { ok: true };
  });

  engine.registerAction('inventory/equip', ({ itemId }, { store }) => {
    const result = equipItem(store.state.inventory, itemId);
    if (result.error) return { ok: false, reason: result.error };
    store.commit('inventory/equip', { itemId });
    engine.log('log.inventory.equipped', { item: itemName(itemId) });
    engine.advanceTime(EQUIP_MINUTES);
    return { ok: true };
  });

  engine.registerAction('inventory/unequip', ({ slot }, { store }) => {
    const result = unequipSlot(store.state.inventory, slot);
    if (result.error) return { ok: false, reason: result.error };
    store.commit('inventory/unequip', { slot });
    engine.log('log.inventory.unequipped', { item: itemName(result.itemId) });
    engine.advanceTime(EQUIP_MINUTES);
    return { ok: true };
  });
}

function registerInventoryEffects(effects, ctx) {
  const { store, rng, engine } = ctx;

  effects.register('loot', ({ table, rolls = 1 }) => {
    const found = rollLoot(rng, table, rollRange(rng, rolls));
    for (const { itemId, qty } of found) grantItems(ctx, itemId, qty);
  });

  effects.register('give', ({ itemId, qty = 1 }) => grantItems(ctx, itemId, qty));

  effects.register('take', ({ qty = 1, random, ...matcher }) => {
    for (let taken = 0; taken < qty; taken += 1) {
      const candidates = random
        ? store.state.inventory.stacks
        : matchingStacks(store.state.inventory, matcher);
      if (candidates.length === 0) {
        if (taken === 0) engine.log('log.inventory.nothing_to_lose', {}, 'plain');
        return;
      }
      const { itemId } = rng.pick(candidates);
      store.commit('inventory/remove', { itemId, qty: 1 });
      engine.log('log.inventory.lost', { item: itemName(itemId), count: 1 }, 'bad');
    }
  });
}

export const inventoryModule = {
  id: 'inventory',
  createState: createStartingInventory,

  install(ctx) {
    registerInventoryMutations(ctx.store);
    registerInventoryActions(ctx.engine);
    registerInventoryEffects(ctx.effects, ctx);
  },
};
