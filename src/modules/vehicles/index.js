/**
 * Last Breath // Vehicles Module Entry Point
 * Registers mutations and actions for vehicle maintenance, cargo transfer,
 * mount/dismount toggles, and travel integration.
 */

import { VehicleEngine, VEHICLE_CATALOG } from './vehicleEngine.js';
import { audioEngine } from '../../core/audioEngine.js';
import { codexManager } from '../../core/codexManager.js';
import { addItem } from '../inventory/inventoryModel.js';
import { t } from '../../i18n/i18n.js';

export const vehiclesModule = {
  id: 'vehicles',

  createState() {
    return VehicleEngine.getInitialState();
  },

  install(ctx) {
    const { store, engine } = ctx;

    // Register vehicle state mutations
    store.registerMutations('vehicles', {
      init(state, payload) {
        const initial = VehicleEngine.getInitialState();
        if (!payload) {
          state.vehicles = initial;
        } else {
          const mergedFleet = { ...initial.fleet };
          if (payload.fleet) {
            for (const [k, v] of Object.entries(payload.fleet)) {
              if (mergedFleet[k]) {
                mergedFleet[k] = {
                  ...mergedFleet[k],
                  ...v,
                  discovered: v.discovered ?? Boolean(v.restored || payload.mountedVehicleId === k),
                  claimed: v.claimed ?? Boolean(v.restored || payload.mountedVehicleId === k),
                };
              }
            }
          }
          state.vehicles = {
            ...initial,
            ...payload,
            fleet: mergedFleet,
          };
        }
      },
      claim(state, vehicleId) {
        const v = state.vehicles?.fleet?.[vehicleId];
        if (v) {
          v.claimed = true;
          v.discovered = true;
        }
      },
      discover(state, { vehicleId, nodeId }) {
        const v = state.vehicles?.fleet?.[vehicleId];
        if (v) {
          v.discovered = true;
          v.nodeId = nodeId;
        }
      },
      mount(state, vehicleId) {
        state.vehicles.mountedVehicleId = vehicleId;
      },
      dismount(state) {
        state.vehicles.mountedVehicleId = null;
      },
      openModal(state, vehicleId) {
        state.vehicles.activeModalVehicleId = vehicleId;
      },
      closeModal(state) {
        state.vehicles.activeModalVehicleId = null;
      },
      updateVehicleLocation(state, { vehicleId, nodeId }) {
        if (state.vehicles?.fleet?.[vehicleId]) {
          state.vehicles.fleet[vehicleId].nodeId = nodeId;
        }
      },
      consumeFuel(state, { vehicleId, liters }) {
        const v = state.vehicles?.fleet?.[vehicleId];
        if (v) {
          v.fuelLiters = Math.max(0, Math.round((v.fuelLiters - liters) * 10) / 10);
        }
      },
      degradeCondition(state, { vehicleId, amount }) {
        const v = state.vehicles?.fleet?.[vehicleId];
        if (v) {
          v.condition = Math.max(0, Math.round(v.condition - amount));
        }
      },
    });

    // Register actions
    engine.registerAction('vehicles/openModal', ({ vehicleId }) => {
      store.commit('vehicles/openModal', vehicleId);
      audioEngine.playTerminalClick();
      engine.bus.emit('vehicles:modal', { vehicleId });
      return { ok: true };
    });

    engine.registerAction('vehicles/closeModal', () => {
      store.commit('vehicles/closeModal');
      audioEngine.playTerminalClick();
      engine.bus.emit('vehicles:modal', { vehicleId: null });
      return { ok: true };
    });

    engine.registerAction('vehicles/claim', ({ vehicleId }) => {
      const vehicle = VehicleEngine.getVehicle(store.state, vehicleId);
      const def = VEHICLE_CATALOG[vehicleId];
      if (!vehicle || !def) return { ok: false, reason: 'invalid_vehicle' };
      store.commit('vehicles/claim', vehicleId);
      const res = addItem(store.state.inventory, 'vehicle_ignition_key', 1);
      if (res?.inventory) store.state.inventory = res.inventory;
      try { audioEngine.playEngineRev(); } catch {}
      engine.log('vehicle.log.claimed', { vehicle: t(def.nameKey) }, 'good');
      return { ok: true };
    });

    engine.registerAction('vehicles/mount', ({ vehicleId }) => {
      const vehicle = VehicleEngine.getVehicle(store.state, vehicleId);
      const def = VEHICLE_CATALOG[vehicleId];
      if (!vehicle || !vehicle.restored) {
        engine.log('vehicle.log.not_ready', {}, 'warn');
        return { ok: false, reason: 'not_ready' };
      }
      if (!def?.musclePowered && def?.fuelType !== 'muscle' && vehicle.fuelLiters <= 0) {
        engine.log('vehicle.log.no_fuel', {}, 'warn');
        return { ok: false, reason: 'no_fuel' };
      }
      store.commit('vehicles/mount', vehicleId);
      audioEngine.playEngineIgnition();
      engine.log('vehicle.log.mounted', { vehicle: vehicleId }, 'good');
      return { ok: true };
    });

    engine.registerAction('vehicles/dismount', () => {
      const mountedId = store.state.vehicles?.mountedVehicleId;
      if (!mountedId) return { ok: true };
      store.commit('vehicles/dismount');
      audioEngine.playTerminalClick();
      engine.log('vehicle.log.dismounted', { vehicle: mountedId });
      return { ok: true };
    });

    engine.registerAction('vehicles/installPart', ({ vehicleId, reqItemId }) => {
      const res = VehicleEngine.installPart(store.state, vehicleId, reqItemId);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      audioEngine.playGearRustle();
      if (res.restored) {
        audioEngine.playEngineRev();
        codexManager.trackCareer('totalVehiclesRestored', 1);
        codexManager.unlockAchievement('mechanic_maestro');
        engine.log('vehicle.log.fully_restored', { vehicle: vehicleId }, 'good');
      } else {
        engine.log('vehicle.log.part_installed', { part: reqItemId, remaining: res.remainingNeed });
      }
      return res;
    });

    engine.registerAction('vehicles/refuel', ({ vehicleId, canisterItemId }) => {
      const res = VehicleEngine.refuel(store.state, vehicleId, canisterItemId);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      audioEngine.playGearRustle();
      engine.log('vehicle.log.refueled', { added: res.addedLiters, total: res.currentFuel }, 'good');
      return res;
    });

    engine.registerAction('vehicles/repair', ({ vehicleId, repairItemId }) => {
      const res = VehicleEngine.repairCondition(store.state, vehicleId, repairItemId);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      audioEngine.playGearRustle();
      engine.log('vehicle.log.repaired', { gain: res.gain, condition: res.condition }, 'good');
      return res;
    });

    engine.registerAction('vehicles/toCargo', ({ vehicleId, itemId, qty = 1 }) => {
      const res = VehicleEngine.transferToCargo(store.state, vehicleId, itemId, qty);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      audioEngine.playGearRustle();
      return res;
    });

    engine.registerAction('vehicles/toPack', ({ vehicleId, itemId, qty = 1 }) => {
      const res = VehicleEngine.transferToPack(store.state, vehicleId, itemId, qty);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      audioEngine.playGearRustle();
      return res;
    });

    engine.registerAction('vehicles/siphon', ({ vehicleId }) => {
      const res = VehicleEngine.siphonFuel(store.state, vehicleId);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      audioEngine.playGearRustle();
      codexManager.trackCareer('totalFuelSiphoned', res.siphonedLiters);
      codexManager.unlockAchievement('fuel_siphoner');
      engine.log('vehicle.log.siphoned', { siphoned: res.siphonedLiters, total: res.currentFuel }, 'good');
      return res;
    });

    engine.registerAction('vehicles/installUpgrade', ({ vehicleId, upgradeId }) => {
      const res = VehicleEngine.installUpgrade(store.state, vehicleId, upgradeId);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      audioEngine.playEngineRev();
      try { audioEngine.playTerminalClick(); } catch {}
      engine.log('vehicle.log.upgrade_installed', {
        upgrade: `vehicle.upgrade.${upgradeId}.name`,
        vehicle: vehicleId,
      }, 'good');
      return res;
    });

    engine.registerAction('vehicles/camp', ({ vehicleId, hours = 4 }) => {
      const res = VehicleEngine.campInVehicle(store.state, vehicleId, hours);
      if (!res.ok) {
        engine.log(`vehicle.reject.${res.reason}`, {}, 'warn');
        return res;
      }
      engine.advanceTime(hours * 60, 'rest');
      if (store.state.vitals?.energy) {
        store.state.vitals.energy = Math.min(100, store.state.vitals.energy + 25);
      }
      audioEngine.playTerminalClick();
      engine.log('vehicle.log.camped', { hours }, 'good');
      return res;
    });
  },
};

export { VehicleEngine, VEHICLE_CATALOG };

