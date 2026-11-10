/**
 * Data-driven effect pipeline shared by items, encounters and (later) crafting
 * and combat. Modules register the effect types they own; data files only
 * describe effects as plain objects, e.g. `{ type: 'damage', amount: [4, 9] }`.
 *
 * Any effect may carry `chance` (0..1); it is rolled before the handler runs.
 */
export class EffectRegistry {
  #handlers = new Map();

  register(type, handler) {
    if (this.#handlers.has(type)) throw new Error(`Effect "${type}" registered twice`);
    this.#handlers.set(type, handler);
  }

  apply(effects = [], context, source = {}) {
    for (const effect of effects) {
      if (!context.store.state.player.alive) return;
      if (effect.chance != null && !context.rng.chance(effect.chance)) continue;
      const handler = this.#handlers.get(effect.type);
      if (!handler) {
        console.warn(`[effects] no handler for "${effect.type}"`, source);
        continue;
      }
      handler(effect, context, source);
    }
  }
}

