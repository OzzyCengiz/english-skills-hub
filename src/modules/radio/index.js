/**
 * Last Breath // Radio & Signal Module Entry Point
 * Registers state mutations, action dispatches, and event bus integrations
 * for field transceiver scanning, emergency beacon tracking, and SOS broadcasts.
 */

import { RadioEngine } from './radioEngine.js';
import { audioEngine } from '../../core/audioEngine.js';
import { addItem } from '../inventory/inventoryModel.js';

function safeAudio(fn) {
  try {
    fn();
  } catch (_) {}
}

export const radioModule = {
  id: 'radio',

  createState() {
    return RadioEngine.getInitialState();
  },

  install(ctx) {
    const { store, engine, rng } = ctx;

    // Register Radio Store Mutations
    store.registerMutations('radio', {
      init(state, payload) {
        state.radio = payload || RadioEngine.getInitialState();
      },
      setFrequency(state, freq) {
        state.radio.activeFrequency = RadioEngine.formatFrequency(freq);
      },
      togglePower(state) {
        state.radio.isPowered = !state.radio.isPowered;
      },
      setVolume(state, vol) {
        state.radio.volume = Math.max(0, Math.min(1, vol));
      },
      crank(state, minutes) {
        state.radio.batteryMinutes = Math.min(300, Math.round(state.radio.batteryMinutes + minutes));
      },
      consumeBattery(state, minutes) {
        state.radio.batteryMinutes = Math.max(0, state.radio.batteryMinutes - minutes);
      },
      unlockSignal(state, signalId) {
        if (!state.radio.unlockedSignals.includes(signalId)) {
          state.radio.unlockedSignals.push(signalId);
        }
      },
      addBeacon(state, beacon) {
        if (!state.radio.discoveredBeacons.some((b) => b.id === beacon.id)) {
          state.radio.discoveredBeacons.push(beacon);
        }
      },
      collectBeacon(state, beaconId) {
        const b = state.radio.discoveredBeacons.find((item) => item.id === beaconId);
        if (b) b.collected = true;
      },
      toggleBookmark(state, freq) {
        const formatted = RadioEngine.formatFrequency(freq);
        const idx = state.radio.bookmarks.indexOf(formatted);
        if (idx >= 0) {
          state.radio.bookmarks.splice(idx, 1);
        } else {
          state.radio.bookmarks.push(formatted);
          state.radio.bookmarks.sort((a, b) => a - b);
        }
      }
    });

    // Register Engine Actions
    engine.registerAction('radio/tune', ({ freq }) => {
      const tuned = RadioEngine.tune(store.state, freq);
      store.commit('radio/setFrequency', tuned);
      return { ok: true, freq: tuned };
    });

    engine.registerAction('radio/scan', ({ direction = 1 }) => {
      const current = store.state.radio?.activeFrequency || 94.8;
      const nextFreq = RadioEngine.findNextSignalFrequency(current, direction);
      RadioEngine.tune(store.state, nextFreq);
      store.commit('radio/setFrequency', nextFreq);
      safeAudio(() => {
        audioEngine.playRadioDialTick();
        audioEngine.playRadioMorseChirp();
      });
      return { ok: true, freq: nextFreq };
    });

    engine.registerAction('radio/crank', () => {
      store.commit('radio/crank', 45);
      const minutes = store.state.radio?.batteryMinutes ?? 180;
      safeAudio(() => audioEngine.playRadioDynamoCrank());
      engine.log('radio.log.cranked', { battery: minutes });
      return { ok: true, batteryMinutes: minutes };
    });

    engine.registerAction('radio/decode', ({ signalId }) => {
      const res = RadioEngine.decodeSignal(store.state, signalId);
      if (!res.ok) {
        return res;
      }
      store.commit('radio/unlockSignal', signalId);
      safeAudio(() => {
        audioEngine.playAchievementChime();
        audioEngine.playRadioMorseChirp();
      });

      engine.log('radio.log.decoded', {
        title: res.signal.nameKey,
        freq: `${res.signal.frequency} MHz`
      }, 'good');

      if (res.beaconCreated) {
        engine.log('radio.log.beacon_plotted', {
          location: `location.${res.signal.locationNodeId}`
        });
      }

      return res;
    });

    engine.registerAction('radio/broadcastSOS', () => {
      const res = RadioEngine.broadcastSOS(store.state, rng);
      if (!res.ok) {
        engine.log('radio.reject.low_battery', {}, 'warn');
        safeAudio(() => audioEngine.playWarningAlarm());
        return res;
      }

      safeAudio(() => audioEngine.playRadioMorseChirp());
      if (res.outcome === 'aid_drop') {
        engine.log('radio.log.sos_aid_drop', {}, 'good');
      } else {
        engine.log('radio.log.sos_hostile_intercept', {}, 'warn');
      }

      return res;
    });

    engine.registerAction('radio/collectBeacon', ({ beaconId }) => {
      const beacon = store.state.radio?.discoveredBeacons?.find((b) => b.id === beaconId && !b.collected);
      if (!beacon) {
        return { ok: false, reason: 'beacon_not_found' };
      }

      const playerNodeId = store.state.world?.currentNodeId;
      if (beacon.nodeId !== playerNodeId) {
        return { ok: false, reason: 'wrong_location' };
      }

      store.commit('radio/collectBeacon', beaconId);

      const itemsGranted = [];
      if (beacon.reward?.items?.length) {
        let currentInv = store.state.inventory;
        for (const item of beacon.reward.items) {
          const res = addItem(currentInv, item.itemId, item.qty);
          if (res.ok) {
            currentInv = res.inventory;
            itemsGranted.push(item);
          }
        }
        store.state.inventory = currentInv;
      }

      if (beacon.reward?.xp && store.state.skills?.survival) {
        store.state.skills.survival.xp = (store.state.skills.survival.xp || 0) + beacon.reward.xp;
      }

      safeAudio(() => audioEngine.playAchievementChime());
      engine.log('radio.log.beacon_collected', {
        title: beacon.nameKey
      }, 'good');

      return { ok: true, beacon, itemsGranted };
    });

    engine.registerAction('radio/togglePower', () => {
      store.commit('radio/togglePower');
      safeAudio(() => audioEngine.playTerminalClick());
      return { ok: true, isPowered: store.state.radio.isPowered };
    });

    engine.registerAction('radio/toggleBookmark', ({ freq }) => {
      store.commit('radio/toggleBookmark', freq);
      safeAudio(() => audioEngine.playTerminalClick());
      return { ok: true };
    });
  }
};

