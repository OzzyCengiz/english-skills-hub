/**
 * Last Breath // Environment Engine Module
 */

import { WeatherEngine, EVENT_FLASHLIGHT_TOGGLED } from './weatherEngine.js';
import { getNode } from '../map/mapGraph.js';

export const environmentModule = {
  id: 'environment',

  createState() {
    return WeatherEngine.getInitialState();
  },

  install(ctx) {
    const { store, engine, bus, rng } = ctx;

    store.registerMutations('environment', {
      setWeather(state, { weather, durationHours = 6 }) {
        if (!state.environment) state.environment = WeatherEngine.getInitialState();
        state.environment.currentWeather = weather;
        state.environment.weatherDurationHours = durationHours;
      },
      toggleFlashlight(state) {
        if (!state.environment) state.environment = WeatherEngine.getInitialState();
        state.environment.flashlightActive = !state.environment.flashlightActive;
        return state.environment.flashlightActive;
      },
      setCoreTemp(state, temp) {
        if (!state.environment) state.environment = WeatherEngine.getInitialState();
        state.environment.coreBodyTemp = Math.max(30.0, Math.min(42.0, temp));
      },
      addRadiation(state, dose) {
        if (!state.environment) state.environment = WeatherEngine.getInitialState();
        state.environment.absorbedRadiationTotal += dose;
      },
    });

    engine.registerAction('environment/toggleFlashlight', (_, { store, bus }) => {
      const active = store.commit('environment/toggleFlashlight');
      if (bus) {
        bus.emit(EVENT_FLASHLIGHT_TOGGLED, { active });
      }
      engine.log(active ? 'environment.flashlight_on' : 'environment.flashlight_off', {}, 'warn');
      return { ok: true, active };
    });

    // Listen to in-game time advancement
    bus.on('time:tick', ({ hours, activity }) => {
      const currentNodeId = store.state?.world?.currentNodeId;
      const node = currentNodeId ? getNode(currentNodeId) : null;
      const biome = node?.biome || 'urban';

      const result = WeatherEngine.tickEnvironment(store.state, {
        hours,
        activity,
        biome,
        rng,
        bus,
      });

      // Log exposure warnings to terminal log
      if (result.alerts && result.alerts.length > 0) {
        for (const alert of result.alerts) {
          if (alert.textKey) {
            engine.log(alert.textKey, {
              coreTemp: alert.coreTemp,
              dose: alert.dose,
            }, 'bad');
          }
        }
      }
    });
  },
};

export { WeatherEngine } from './weatherEngine.js';

