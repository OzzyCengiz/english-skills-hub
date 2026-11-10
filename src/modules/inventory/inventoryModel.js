import { BALANCE } from '../../data/balance.js';
import { getItem } from '../../data/items.js';

/**
 * Pure inventory model. Every operation takes an inventory value and returns a
 * new one, so actions can dry-run a change before committing it.
 *
 * Inventory shape:
 *   stacks     [{ itemId, qty }]   — each stack occupies one slot
 *   equipment  { weapon, body, pack } — worn items: no slot, but full weight
 *   ground     { [nodeId]: [{ itemId, qty }] } — items left behind per location
 */
const EPSILON = 1e-6;
const { baseCapacityKg, baseSlots, hardLimitRatio } = BALANCE.inventory;

const cloneInventory = (inventory) => structuredClone(inventory);

export function capacity(inventory) {
  const pack = inventory.equipment.pack ? getItem(inventory.equipment.pack).equip : null;
  return {
    kg: baseCapacityKg + (pack?.capacityKg ?? 0),
    slots: baseSlots + (pack?.slots ?? 0),
  };
}

export function carriedWeight(inventory) {
  const packed = inventory.stacks.reduce((sum, { itemId, qty }) => sum + getItem(itemId).weight * qty, 0);
  const worn = Object.values(inventory.equipment)
    .filter(Boolean)
    .reduce((sum, itemId) => sum + getItem(itemId).weight, 0);
  return packed + worn;
}

export const weightLimit = (inventory) => capacity(inventory).kg * hardLimitRatio;
export const usedSlots = (inventory) => inventory.stacks.length;

export function countItem(inventory, itemId) {
  return inventory.stacks.reduce((sum, stack) => (stack.itemId === itemId ? sum + stack.qty : sum), 0);
}

export function addItem(inventory, itemId, qty) {
  const item = getItem(itemId);
  const next = cloneInventory(inventory);
  const roomByWeight = item.weight > 0
    ? Math.floor((weightLimit(next) - carriedWeight(next) + EPSILON) / item.weight)
    : Infinity;
  let remaining = Math.max(0, Math.min(qty, roomByWeight));
  const weightBound = remaining < qty;

  for (const stack of next.stacks) {
    if (remaining === 0) break;
    if (stack.itemId !== itemId || stack.qty >= item.stack) continue;
    const moved = Math.min(item.stack - stack.qty, remaining);
    stack.qty += moved;
    remaining -= moved;
  }

  const slotLimit = capacity(next).slots;
  while (remaining > 0 && next.stacks.length < slotLimit) {
    const moved = Math.min(item.stack, remaining);
    next.stacks.push({ itemId, qty: moved });
    remaining -= moved;
  }

  const accepted = Math.min(qty, roomByWeight) - remaining;
  const rejected = qty - accepted;
  const reason = rejected === 0 ? null : weightBound && remaining === 0 ? 'weight' : 'slots';
  return { inventory: next, accepted, rejected, reason };
}

export function removeItem(inventory, itemId, qty) {
  const next = cloneInventory(inventory);
  let remaining = qty;
  for (let index = next.stacks.length - 1; index >= 0 && remaining > 0; index -= 1) {
    const stack = next.stacks[index];
    if (stack.itemId !== itemId) continue;
    const taken = Math.min(stack.qty, remaining);
    stack.qty -= taken;
    remaining -= taken;
    if (stack.qty === 0) next.stacks.splice(index, 1);
  }
  return { inventory: next, removed: qty - remaining };
}

export function equipItem(inventory, itemId) {
  const item = getItem(itemId);
  if (!item.equip) return { error: 'reject.not_equippable' };
  if (countItem(inventory, itemId) < 1) return { error: 'reject.missing_item' };

  let next = removeItem(inventory, itemId, 1).inventory;
  const { slot } = item.equip;
  const previous = next.equipment[slot];
  next.equipment[slot] = itemId;

  if (previous) {
    const swap = addItem(next, previous, 1);
    if (swap.accepted === 0) return { error: 'reject.no_room_to_swap' };
    next = swap.inventory;
  }
  if (usedSlots(next) > capacity(next).slots) return { error: 'reject.pack_too_small' };
  return { inventory: next, previous };
}

export function unequipSlot(inventory, slot) {
  const itemId = inventory.equipment[slot];
  if (!itemId) return { error: 'reject.slot_empty' };

  const next = cloneInventory(inventory);
  next.equipment[slot] = null;
  if (usedSlots(next) >= capacity(next).slots) return { error: 'reject.pack_too_small' };

  const result = addItem(next, itemId, 1);
  if (result.accepted === 0) return { error: 'reject.no_room' };
  return { inventory: result.inventory, itemId };
}

export function groundAt(inventory, nodeId) {
  return inventory.ground[nodeId] ?? [];
}

export function addToGround(inventory, nodeId, itemId, qty) {
  const next = cloneInventory(inventory);
  const pile = (next.ground[nodeId] ??= []);
  const existing = pile.find((stack) => stack.itemId === itemId);
  if (existing) existing.qty += qty;
  else pile.push({ itemId, qty });
  return next;
}

export function removeFromGround(inventory, nodeId, itemId, qty) {
  const next = cloneInventory(inventory);
  const pile = next.ground[nodeId] ?? [];
  const existing = pile.find((stack) => stack.itemId === itemId);
  const removed = Math.min(existing?.qty ?? 0, qty);
  if (existing) existing.qty -= removed;
  next.ground[nodeId] = pile.filter((stack) => stack.qty > 0);
  if (next.ground[nodeId].length === 0) delete next.ground[nodeId];
  return { inventory: next, removed };
}

/** Passive bonuses count once per distinct carried item type. */
export function passiveTotal(inventory, key) {
  const carried = new Set([
    ...inventory.stacks.map(({ itemId }) => itemId),
    ...Object.values(inventory.equipment).filter(Boolean),
  ]);
  let total = 0;
  for (const itemId of carried) total += getItem(itemId).passive?.[key] ?? 0;
  return total;
}

export function hasEquippedFlag(inventory, flag) {
  return Object.values(inventory.equipment)
    .filter(Boolean)
    .some((itemId) => getItem(itemId).equip?.flags?.includes(flag));
}

export function itemMatches(itemId, { itemId: wantedId, tags, category } = {}) {
  const item = getItem(itemId);
  if (wantedId && itemId !== wantedId) return false;
  if (category && item.category !== category) return false;
  if (tags && !tags.some((tag) => item.tags?.includes(tag))) return false;
  return true;
}

export function matchingStacks(inventory, matcher) {
  return inventory.stacks.filter(({ itemId }) => itemMatches(itemId, matcher));
}

