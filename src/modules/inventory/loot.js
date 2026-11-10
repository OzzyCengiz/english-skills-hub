import { LOOT_TABLES } from '../../data/lootTables.js';
import { rollRange } from '../../core/rng.js';

/** Rolls a loot table `rolls` times and merges duplicate items. */
export function rollLoot(rng, tableId, rolls = 1) {
  const table = LOOT_TABLES[tableId];
  if (!table) throw new Error(`Unknown loot table "${tableId}"`);

  const found = new Map();
  for (let roll = 0; roll < rolls; roll += 1) {
    const entry = rng.weighted(table);
    const qty = rollRange(rng, entry.qty);
    found.set(entry.itemId, (found.get(entry.itemId) ?? 0) + qty);
  }
  return [...found].map(([itemId, qty]) => ({ itemId, qty }));
}

