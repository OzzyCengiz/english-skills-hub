/**
 * Seedable PRNG (mulberry32). Its internal state is persisted with the save,
 * so reloading never re-rolls an outcome the player has already seen.
 */
export class Rng {
  constructor(seed) {
    this.state = seed >>> 0;
  }

  reseed(seed) {
    this.state = seed >>> 0;
  }

  next() {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min, max) {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  float(min, max) {
    return min + this.next() * (max - min);
  }

  chance(probability) {
    if (probability <= 0) return false;
    if (probability >= 1) return true;
    return this.next() < probability;
  }

  pick(list) {
    return list[Math.floor(this.next() * list.length)];
  }

  weighted(entries, weightOf = (entry) => entry.weight) {
    const total = entries.reduce((sum, entry) => sum + Math.max(0, weightOf(entry)), 0);
    if (total <= 0) return null;
    let roll = this.next() * total;
    for (const entry of entries) {
      roll -= Math.max(0, weightOf(entry));
      if (roll < 0) return entry;
    }
    return entries[entries.length - 1];
  }
}

export const randomSeed = () => Math.floor(Math.random() * 2 ** 32) >>> 0;

/** Accepts either a fixed number or an inclusive `[min, max]` tuple. */
export function rollRange(rng, value) {
  return Array.isArray(value) ? rng.int(value[0], value[1]) : value;
}

