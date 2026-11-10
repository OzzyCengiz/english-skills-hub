import { MINUTES_PER_HOUR } from './clock.js';

export const TICK_MINUTES = MINUTES_PER_HOUR;

/**
 * The engine owns orchestration only: module registration, the action
 * pipeline (commands issued by the UI) and the passage of time. All game rules
 * live in modules.
 *
 *   UI ──dispatch──▶ action ──commit──▶ mutation ──▶ state:changed ──▶ views
 *                      │
 *                      └─ advanceTime ──▶ time:tick ──▶ module tick handlers
 */
export class Engine {
  #modules = [];
  #actions = new Map();
  #guards = [];

  constructor({ bus, store, rng, effects }) {
    this.bus = bus;
    this.store = store;
    this.rng = rng;
    this.effects = effects;
    this.context = Object.freeze({ bus, store, rng, effects, engine: this });
  }

  register(module) {
    if (this.#modules.some(({ id }) => id === module.id)) {
      throw new Error(`Module "${module.id}" registered twice`);
    }
    this.#modules.push(module);
    module.install?.(this.context);
    return this;
  }

  createInitialState(baseState) {
    const state = structuredClone(baseState);
    for (const module of this.#modules) {
      if (module.createState) state[module.id] = module.createState(this.context);
    }
    return state;
  }

  /** Back-fills slices added by modules after a save was written. */
  hydrateState(freshState, savedState) {
    const hydrated = { ...freshState, ...savedState };
    for (const module of this.#modules) {
      if (!module.createState) continue;
      hydrated[module.id] = { ...freshState[module.id], ...savedState[module.id] };
    }
    return hydrated;
  }

  registerAction(type, handler, options = {}) {
    if (this.#actions.has(type)) throw new Error(`Action "${type}" registered twice`);
    this.#actions.set(type, { handler, options });
  }

  /** A guard returns a rejection reason (i18n key) or null to allow the action. */
  addGuard(guard) {
    this.#guards.push(guard);
  }

  dispatch(type, payload = {}) {
    const action = this.#actions.get(type);
    if (!action) throw new Error(`Unknown action "${type}"`);

    for (const guard of this.#guards) {
      const reason = guard(type, action.options, this.store.state);
      if (reason) return this.#reject(type, reason);
    }

    const result = this.store.batch(() => action.handler(payload, this.context)) ?? { ok: true };
    if (!result.ok) return this.#reject(type, result.reason, result.params);
    this.bus.emit('action:completed', { type, payload, result });
    return result;
  }

  /**
   * Advances the world clock in hourly ticks. Modules react to `time:tick`
   * (needs decay, ailments, depletion recovery). Stops early on death.
   */
  advanceTime(minutes, activity = 'idle') {
    let remaining = Math.max(0, Math.round(minutes));
    let elapsed = 0;
    this.store.batch(() => {
      while (remaining > 0 && this.store.state.player.alive) {
        const step = Math.min(TICK_MINUTES, remaining);
        this.store.commit('time/advance', step);
        this.bus.emit('time:tick', { minutes: step, hours: step / MINUTES_PER_HOUR, activity });
        remaining -= step;
        elapsed += step;
      }
    });
    return elapsed;
  }

  log(key, params = {}, tone = 'plain') {
    this.store.commit('log/push', { key, params, tone });
  }

  #reject(type, reason, params = {}) {
    const rejection = { ok: false, reason, params };
    this.bus.emit('action:rejected', { type, ...rejection });
    return rejection;
  }
}

