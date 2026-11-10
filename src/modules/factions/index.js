/**
 * Last Breath // Factions Core Engine Module
 */

import { FactionManager } from './factionManager.js';

export const factionModule = {
  id: 'factions',

  createState() {
    return FactionManager.getInitialState();
  },

  install(ctx) {
    const { store, engine, bus, effects } = ctx;

    store.registerMutations('factions', {
      setStanding(state, { factionId, standing }) {
        if (!state.factions) state.factions = FactionManager.getInitialState();
        state.factions.standings[factionId] = Math.max(-100, Math.min(100, standing));
      },
      adjustStanding(state, { factionId, delta, reason = '' }) {
        return FactionManager.adjustStanding(state, factionId, delta, reason, { bus });
      },
      resetFactions(state) {
        state.factions = FactionManager.getInitialState();
      },
    });

    engine.registerAction('factions/adjust', ({ factionId, delta, reason }, { store }) => {
      const result = store.commit('factions/adjustStanding', { factionId, delta, reason });
      return { ok: true, result };
    });

    effects.register('reputation', ({ factionId, delta, reason = 'field_action' }) => {
      store.commit('factions/adjustStanding', { factionId, delta, reason });
    });
  },
};

export { FactionManager };
