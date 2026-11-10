import { START_MINUTES } from './clock.js';

export const SAVE_VERSION = 1;
const LOG_LIMIT = 150;

export function createBaseState(seed) {
  return {
    meta: { version: SAVE_VERSION, seed, startedAt: Date.now(), logSeq: 0 },
    time: { minutes: START_MINUTES },
    log: [],
  };
}

/** Engine-level mutations and effects that do not belong to any gameplay module. */
export const coreModule = {
  id: 'core',

  install({ store, effects, engine, rng }) {
    store.registerMutations('time', {
      advance(state, minutes) {
        state.time.minutes += minutes;
      },
    });

    store.registerMutations('log', {
      push(state, { key, params, tone }) {
        state.meta.logSeq += 1;
        state.log.push({ id: state.meta.logSeq, at: state.time.minutes, key, params, tone });
        if (state.log.length > LOG_LIMIT) state.log.splice(0, state.log.length - LOG_LIMIT);
      },
    });

    effects.register('time', (effect) => {
      const minutes = Array.isArray(effect.minutes)
        ? rng.int(effect.minutes[0], effect.minutes[1])
        : effect.minutes;
      engine.log('log.effect.time_lost', { minutes }, 'plain');
      engine.advanceTime(minutes, effect.activity ?? 'idle');
    });

    effects.register('log', (effect) => {
      engine.log(effect.key, effect.params, effect.tone);
    });
  },
};

