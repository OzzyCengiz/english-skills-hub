/**
 * Last Breath // Radio & Signal Engine
 * Handles radio transceiver hardware state, analog tuning, signal demodulation,
 * battery consumption, auto-scanning, SOS emergency broadcast, and map beacons.
 */

import { RADIO_SIGNALS, calculateSignalReception } from '../../data/radioSignals.js';
import { getNode } from '../map/mapGraph.js';
import { greatCircleKm } from '../map/projection.js';
import { addItem } from '../inventory/inventoryModel.js';

export const MIN_FREQUENCY = 88.0;
export const MAX_FREQUENCY = 108.0;
export const FREQUENCY_STEP = 0.1;

export class RadioEngine {
  static getInitialState() {
    return {
      activeFrequency: 94.8,
      isPowered: true,
      isScanning: false,
      volume: 0.85,
      batteryMinutes: 180, // Hand-crank / solar battery reserve
      unlockedSignals: [],
      discoveredBeacons: [],
      sosBroadcasts: 0,
      bookmarks: [89.4, 94.8, 101.5]
    };
  }

  /**
   * Clamps and rounds a frequency to 1 decimal place between 88.0 and 108.0 MHz.
   */
  static formatFrequency(freq) {
    const clamped = Math.max(MIN_FREQUENCY, Math.min(MAX_FREQUENCY, freq));
    return Math.round(clamped * 10) / 10;
  }

  /**
   * Calculates distance between player's current location and a target node.
   */
  static getDistanceToNode(playerNodeId, targetNodeId) {
    if (!playerNodeId || !targetNodeId || playerNodeId === targetNodeId) return 0;
    const a = getNode(playerNodeId);
    const b = getNode(targetNodeId);
    if (!a || !b) return 500;
    return greatCircleKm(a, b);
  }

  /**
   * Scans current environment and returns all signals within range, along with
   * their reception qualities.
   */
  static getActiveReception(state, frequency = null) {
    const radioState = state.radio || this.getInitialState();
    const currentFreq = frequency ?? radioState.activeFrequency;
    const playerNodeId = state.world?.currentNodeId || 'istanbul';
    const playerNode = getNode(playerNodeId);

    const matches = [];

    for (const signal of RADIO_SIGNALS) {
      const distanceKm = this.getDistanceToNode(playerNodeId, signal.locationNodeId);
      const reception = calculateSignalReception(signal, currentFreq, playerNode, distanceKm);

      if (reception.quality > 0) {
        matches.push({
          signal,
          ...reception,
          isDecoded: radioState.unlockedSignals.includes(signal.id)
        });
      }
    }

    // Sort by best quality first
    matches.sort((a, b) => b.quality - a.quality);

    const bestMatch = matches[0] || null;
    const primaryQuality = bestMatch ? bestMatch.quality : 0;
    const isLocked = bestMatch ? bestMatch.locked : false;

    return {
      currentFreq,
      matches,
      bestMatch,
      primaryQuality,
      isLocked,
      isPowered: Boolean(radioState.isPowered && radioState.batteryMinutes > 0),
      batteryMinutes: radioState.batteryMinutes
    };
  }

  /**
   * Finds next broadcast frequency in direction (+1 or -1) starting from current frequency.
   */
  static findNextSignalFrequency(currentFreq, direction = 1) {
    const sorted = [...RADIO_SIGNALS].sort((a, b) => a.frequency - b.frequency);
    if (direction > 0) {
      const next = sorted.find((s) => s.frequency > currentFreq + 0.1);
      return next ? next.frequency : sorted[0].frequency;
    } else {
      const prev = [...sorted].reverse().find((s) => s.frequency < currentFreq - 0.1);
      return prev ? prev.frequency : sorted[sorted.length - 1].frequency;
    }
  }

  /**
   * Tunes the radio to target frequency.
   */
  static tune(state, targetFreq) {
    const radioState = state.radio || this.getInitialState();
    const formatted = this.formatFrequency(targetFreq);
    radioState.activeFrequency = formatted;
    return formatted;
  }

  /**
   * Hand-cranks the dynamo charger to restore battery.
   */
  static crankDynamo(state, minutesBoost = 50) {
    const radioState = state.radio || this.getInitialState();
    radioState.batteryMinutes = Math.min(300, Math.round(radioState.batteryMinutes + minutesBoost));
    return radioState.batteryMinutes;
  }

  /**
   * Fully decodes a locked signal, unlocking intel, granting rewards,
   * revealing secret caches on the map, or disarming ambushes.
   */
  static decodeSignal(state, signalId) {
    const radioState = state.radio || this.getInitialState();
    const signal = RADIO_SIGNALS.find((s) => s.id === signalId);
    if (!signal) return { ok: false, reason: 'unknown_signal' };

    if (!radioState.unlockedSignals.includes(signalId)) {
      radioState.unlockedSignals.push(signalId);
    }

    const result = {
      ok: true,
      signal,
      itemsGranted: [],
      xpGranted: 0,
      beaconCreated: false,
      intelType: signal.reward?.type
    };

    // 1. Award XP
    if (signal.reward?.xp && state.skills?.survival) {
      state.skills.survival.xp = (state.skills.survival.xp || 0) + signal.reward.xp;
      result.xpGranted = signal.reward.xp;
    }

    // 2. Spawn Map Beacon or supply cache
    if (signal.locationNodeId) {
      const existingBeacon = radioState.discoveredBeacons.find((b) => b.signalId === signalId);
      if (!existingBeacon) {
        radioState.discoveredBeacons.push({
          id: `beacon_${signalId}`,
          signalId,
          nodeId: signal.locationNodeId,
          type: signal.type,
          nameKey: signal.nameKey,
          reward: signal.reward,
          collected: false
        });
        result.beaconCreated = true;
      }
    } else if (signal.reward?.items && Array.isArray(signal.reward.items)) {
      // Directly grant items if no remote location (immediate air-drop)
      for (const item of signal.reward.items) {
        if (state.inventory && state.inventory.equipment) {
          const res = addItem(state.inventory, item.itemId, item.qty);
          if (res.ok) {
            state.inventory = res.inventory;
            result.itemsGranted.push(item);
          }
        }
      }
    }

    return result;
  }

  /**
   * Broadcasts an SOS distress ping from the field transceiver.
   * High risk / high reward: drains 40 mins of battery and either summons
   * friendly nomad aid or attracts opportunistic raiders.
   */
  static broadcastSOS(state, rng) {
    const radioState = state.radio || this.getInitialState();
    if (radioState.batteryMinutes < 25) {
      return { ok: false, reason: 'low_battery' };
    }

    radioState.batteryMinutes = Math.max(0, radioState.batteryMinutes - 40);
    radioState.sosBroadcasts = (radioState.sosBroadcasts || 0) + 1;

    // Roll random outcome (65% friendly / aid drop, 35% raider skirmish intercept)
    const roll = rng?.next ? rng.next() : (rng?.random ? rng.random() : Math.random());
    if (roll < 0.65) {
      if (state.inventory && state.inventory.equipment) {
        const rations = addItem(state.inventory, 'mre', 1);
        const water = addItem(rations.ok ? rations.inventory : state.inventory, 'purified_water_canteen', 1);
        if (water.ok) state.inventory = water.inventory;
      }
      return {
        ok: true,
        outcome: 'aid_drop',
        messageKey: 'radio.sos.aid_arrived',
        items: [
          { itemId: 'mre', qty: 1 },
          { itemId: 'purified_water_canteen', qty: 1 }
        ]
      };
    } else {
      return {
        ok: true,
        outcome: 'intercepted',
        messageKey: 'radio.sos.raider_alert'
      };
    }
  }

  /**
   * Checks whether the player is currently in range of any undiscovered emergency broadcast.
   */
  static hasUndiscoveredSignalInRange(state) {
    const radioState = state.radio;
    if (!radioState || !radioState.isPowered || radioState.batteryMinutes <= 0) return false;

    const playerNodeId = state.world?.currentNodeId || 'istanbul';
    for (const signal of RADIO_SIGNALS) {
      if (radioState.unlockedSignals.includes(signal.id)) continue;
      const distanceKm = this.getDistanceToNode(playerNodeId, signal.locationNodeId);
      if (distanceKm <= signal.rangeKm) {
        return true;
      }
    }
    return false;
  }
}
