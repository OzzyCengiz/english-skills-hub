/**
 * Last Breath // Environmental Weather & Thermal Exposure Engine
 * Zero-dependency Vanilla JS simulation governing dynamic weather states,
 * ambient temperature curves, thermal hypothermia, acid gear corrosion,
 * respiratory ash exposure, and light-based stealth/visibility multipliers.
 */

import { isNight } from '../../core/clock.js';
import { countItem } from '../inventory/inventoryModel.js';
import { applyBodyDamage } from '../status/bodyStatus.js';

function safeCount(inventory, itemId) {
  if (!inventory || !Array.isArray(inventory.stacks)) return 0;
  return countItem(inventory, itemId);
}

export const WEATHER_STATES = {
  CLEAR_SKY: 'clear_sky',
  ASH_FOG: 'radiation_ash_fog',
  ACID_RAIN: 'corrosive_acid_rain',
  COLD_FRONT: 'subzero_cold_front',
  WINDSTORM: 'gale_windstorm',
};

// EventBus Event Channels
export const EVENT_WEATHER_CHANGED = 'environment:weather_changed';
export const EVENT_EXPOSURE_WARNING = 'environment:exposure_warning';
export const EVENT_FLASHLIGHT_TOGGLED = 'environment:flashlight_toggled';

// Weather probability weights per biome
export const BIOME_WEATHER_DISTRIBUTIONS = {
  arctic: {
    [WEATHER_STATES.COLD_FRONT]: 0.50,
    [WEATHER_STATES.WINDSTORM]: 0.25,
    [WEATHER_STATES.CLEAR_SKY]: 0.20,
    [WEATHER_STATES.ASH_FOG]: 0.05,
    [WEATHER_STATES.ACID_RAIN]: 0.00,
  },
  coastal: {
    [WEATHER_STATES.ACID_RAIN]: 0.40,
    [WEATHER_STATES.WINDSTORM]: 0.30,
    [WEATHER_STATES.CLEAR_SKY]: 0.25,
    [WEATHER_STATES.ASH_FOG]: 0.05,
    [WEATHER_STATES.COLD_FRONT]: 0.00,
  },
  industrial: {
    [WEATHER_STATES.ASH_FOG]: 0.40,
    [WEATHER_STATES.ACID_RAIN]: 0.30,
    [WEATHER_STATES.CLEAR_SKY]: 0.20,
    [WEATHER_STATES.WINDSTORM]: 0.10,
    [WEATHER_STATES.COLD_FRONT]: 0.00,
  },
  urban: {
    [WEATHER_STATES.ASH_FOG]: 0.35,
    [WEATHER_STATES.ACID_RAIN]: 0.25,
    [WEATHER_STATES.CLEAR_SKY]: 0.30,
    [WEATHER_STATES.WINDSTORM]: 0.10,
    [WEATHER_STATES.COLD_FRONT]: 0.00,
  },
  wasteland: {
    [WEATHER_STATES.ASH_FOG]: 0.45,
    [WEATHER_STATES.WINDSTORM]: 0.25,
    [WEATHER_STATES.CLEAR_SKY]: 0.20,
    [WEATHER_STATES.COLD_FRONT]: 0.10,
    [WEATHER_STATES.ACID_RAIN]: 0.00,
  },
  forest: {
    [WEATHER_STATES.CLEAR_SKY]: 0.45,
    [WEATHER_STATES.COLD_FRONT]: 0.25,
    [WEATHER_STATES.ACID_RAIN]: 0.15,
    [WEATHER_STATES.WINDSTORM]: 0.15,
    [WEATHER_STATES.ASH_FOG]: 0.00,
  },
  rural: {
    [WEATHER_STATES.CLEAR_SKY]: 0.45,
    [WEATHER_STATES.COLD_FRONT]: 0.20,
    [WEATHER_STATES.WINDSTORM]: 0.20,
    [WEATHER_STATES.ACID_RAIN]: 0.15,
    [WEATHER_STATES.ASH_FOG]: 0.00,
  },
  military: {
    [WEATHER_STATES.ASH_FOG]: 0.35,
    [WEATHER_STATES.ACID_RAIN]: 0.25,
    [WEATHER_STATES.WINDSTORM]: 0.20,
    [WEATHER_STATES.CLEAR_SKY]: 0.20,
    [WEATHER_STATES.COLD_FRONT]: 0.00,
  },
};

// Base environmental temperature and radiation profiles per state
export const WEATHER_PROFILES = {
  [WEATHER_STATES.CLEAR_SKY]: {
    ambientTempC: 18.0,
    radiationRateMsvPerHour: 0.6,
    scavengeEfficiencyMod: 1.0,
    stealthRiskMultiplier: 1.0,
    visibilityClass: 'clear',
  },
  [WEATHER_STATES.ASH_FOG]: {
    ambientTempC: 14.0,
    radiationRateMsvPerHour: 24.0, // Extreme airborne particulate spike
    scavengeEfficiencyMod: 0.70,   // -30% scavenge efficiency in toxic fog
    stealthRiskMultiplier: 0.45,   // -55% ambush risk (concealment)
    visibilityClass: 'dense_fog',
  },
  [WEATHER_STATES.ACID_RAIN]: {
    ambientTempC: 11.0,
    radiationRateMsvPerHour: 4.5,
    scavengeEfficiencyMod: 0.85,
    stealthRiskMultiplier: 0.80,
    visibilityClass: 'rain',
  },
  [WEATHER_STATES.COLD_FRONT]: {
    ambientTempC: -12.0,           // Severe sub-zero freeze
    radiationRateMsvPerHour: 0.8,
    scavengeEfficiencyMod: 0.80,
    stealthRiskMultiplier: 0.90,
    visibilityClass: 'frost_haze',
  },
  [WEATHER_STATES.WINDSTORM]: {
    ambientTempC: 9.0,
    radiationRateMsvPerHour: 3.5,
    scavengeEfficiencyMod: 0.75,
    stealthRiskMultiplier: 0.50,   // Noise of storm masks survivor movement
    visibilityClass: 'turbulent',
  },
};

/**
 * WeatherEngine: Simulates atmospheric cycles, thermal regulation,
 * chemical exposure, and illumination stealth trade-offs.
 */
export class WeatherEngine {
  /**
   * Generates default environment state for a fresh game run.
   */
  static getInitialState() {
    return {
      currentWeather: WEATHER_STATES.CLEAR_SKY,
      weatherDurationHours: 6,
      ambientTempC: 18.0,
      radiationRate: 0.6,
      coreBodyTemp: 37.0, // Normal physiological baseline: 37.0°C
      shivering: false,
      flashlightActive: false,
      absorbedRadiationTotal: 12.0, // Starting baseline load in mSv
      exposureAlert: null,
    };
  }

  /**
   * Checks if survivor has equipped gear that provides full waterproof/chemical acid shielding.
   */
  static hasAcidProtection(state) {
    const mountedId = state?.vehicles?.mountedVehicleId;
    if (mountedId === 'uaz_469_jeep' || mountedId === 'ural_4320_caravan') {
      return true; // Enclosed armored vehicle cabin provides 100% barrier
    }

    const bodyGear = state?.inventory?.equipment?.body;
    if (!bodyGear) return false;
    const protectiveItems = [
      'hazmat_poncho',
      'goretex_waterproof_parka_camo',
      'chemical_protective_suit',
      'heavy_neoprene_wading_boots',
    ];
    return protectiveItems.some((item) => bodyGear.includes(item));
  }

  /**
   * Checks if survivor has equipped an airtight respirator or gas mask against toxic ash particulate.
   */
  static hasAshProtection(state) {
    const mountedId = state?.vehicles?.mountedVehicleId;
    if (mountedId === 'uaz_469_jeep' || mountedId === 'ural_4320_caravan') {
      return true; // Sealed vehicle cabin filters atmospheric particulate
    }

    const headGear = state?.inventory?.equipment?.head;
    const bodyGear = state?.inventory?.equipment?.body;
    const gasMasks = [
      'gp5_gas_mask_civilian',
      'gas_mask_m40_filter',
      'half_face_chemical_respirator',
      'pmg_soviet_gas_mask',
      'hazmat_poncho',
    ];
    const hasHeadMask = headGear && gasMasks.some((mask) => headGear.includes(mask));
    const hasBodyMask = bodyGear && gasMasks.some((mask) => bodyGear.includes(mask));
    // Also check if survivor holds a spare filter/mask in inventory
    const hasPackFilter = safeCount(state?.inventory, 'gp5_gas_mask_civilian') > 0 ||
      safeCount(state?.inventory, 'half_face_chemical_respirator') > 0;
    return Boolean(hasHeadMask || hasBodyMask || hasPackFilter);
  }

  /**
   * Calculates thermal insulation value (0 to 100) provided by clothing and gear.
   */
  static getThermalInsulation(state) {
    const mountedId = state?.vehicles?.mountedVehicleId;
    if (mountedId === 'uaz_469_jeep' || mountedId === 'ural_4320_caravan') {
      return 90; // Heated cabin insulation
    }

    let insulation = 10; // Baseline street clothes
    const body = state?.inventory?.equipment?.body;
    if (body) {
      if (body.includes('parka') || body.includes('snow') || body.includes('heavy_down')) insulation += 50;
      else if (body.includes('wool') || body.includes('jacket') || body.includes('sweater')) insulation += 30;
      else insulation += 15;
    }
    // Thermal underwear or sleeping bivvy in pack adds passive comfort
    if (safeCount(state?.inventory, 'merino_wool_thermal_base_layer') > 0) insulation += 25;
    if (safeCount(state?.inventory, 'thermal_mylar_bivvy_emergency_sleeping_bag') > 0) insulation += 20;
    return Math.min(100, insulation);
  }

  /**
   * Checks if survivor is in proximity to an active heat source (camp stove or outpost).
   */
  static hasActiveHeatSource(state, activity) {
    const mountedId = state?.vehicles?.mountedVehicleId;
    if (activity === 'rest' && (mountedId === 'uaz_469_jeep' || mountedId === 'ural_4320_caravan')) {
      return true; // Vehicle heater / insulated interior
    }
    if (activity === 'rest' && (safeCount(state?.inventory, 'folding_camp_wood_stove') > 0 || state?.base?.outpostNodeId === state?.world?.currentNodeId)) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a flashlight or active light source is switched on.
   */
  static isFlashlightActive(state) {
    if (!state?.environment?.flashlightActive) return false;
    const inv = state?.inventory;
    const hasLight = safeCount(inv, 'flashlight') > 0 ||
      safeCount(inv, 'headlamp_rechargeable_led') > 0 ||
      safeCount(inv, 'high_lumen_tactical_flashlight') > 0 ||
      (Array.isArray(inv?.stacks) && inv.stacks.some((s) => s.itemId?.includes('flashlight') || s.itemId?.includes('headlamp')));
    return Boolean(hasLight);
  }

  /**
   * Computes visibility, scavenge efficiency, and ambush encounter risk multipliers.
   * - Night and heavy fog reduce scavenge speed, but grant stealth concealment against raiders.
   * - Using a flashlight restores scavenge search speed, but triples (+300%) encounter risk!
   */
  static getStealthAndVisibilityModifiers(state) {
    const env = state?.environment || this.getInitialState();
    const weatherCfg = WEATHER_PROFILES[env.currentWeather] || WEATHER_PROFILES[WEATHER_STATES.CLEAR_SKY];
    const totalMinutes = state?.time?.minutes ?? (state?.clock?.hour !== undefined ? state.clock.hour * 60 : 360);
    const night = isNight(totalMinutes);
    const lightOn = this.isFlashlightActive(state);

    let scavengeEfficiency = weatherCfg.scavengeEfficiencyMod;
    let encounterRisk = weatherCfg.stealthRiskMultiplier;

    if (night) {
      if (lightOn) {
        // Flashlight cuts through the dark: +40% search speed
        scavengeEfficiency = Math.min(1.25, scavengeEfficiency * 1.40);
        // BUT illuminates the survivor: triples enemy encounter rate (x3.0 / +300%)
        encounterRisk *= 3.0;
      } else {
        // Darkness impairs search efficiency (-35%), but hides survivor (-50% ambush chance)
        scavengeEfficiency *= 0.65;
        encounterRisk *= 0.50;
      }
    } else if (lightOn) {
      // Flashlight on during daytime: slightly noticeable
      encounterRisk *= 1.25;
    }

    return {
      isNight: night,
      flashlightActive: lightOn,
      scavengeEfficiency: Math.max(0.35, Math.min(1.5, scavengeEfficiency)),
      encounterRiskMultiplier: Math.max(0.20, Math.min(3.5, encounterRisk)),
    };
  }

  /**
   * Hourly simulation tick processing:
   * 1. Rolls dynamic weather transitions upon duration expiration.
   * 2. Evaluates core body temperature drop & hypothermia during Sub-zero Cold Front.
   * 3. Applies chemical burn damage and equipment corrosion during Corrosive Acid Rain.
   * 4. Accelerates radiation load and respiratory distress during Radiation Ash Fog.
   * 5. Applies windstorm fatigue and hydration drain.
   */
  static tickEnvironment(state, { hours = 1, activity = 'idle', biome = 'urban', rng = null, bus = null } = {}) {
    if (!state.environment) {
      state.environment = this.getInitialState();
    }

    const env = state.environment;
    const alerts = [];

    // 1. Weather State Transition Cycle
    env.weatherDurationHours -= hours;
    if (env.weatherDurationHours <= 0) {
      const dist = BIOME_WEATHER_DISTRIBUTIONS[biome] || BIOME_WEATHER_DISTRIBUTIONS.urban;
      const weatherPool = Object.entries(dist).map(([weatherKey, weight]) => ({
        weatherKey,
        weight,
      }));

      const nextWeather = (rng && typeof rng.weighted === 'function')
        ? rng.weighted(weatherPool, (entry) => entry.weight).weatherKey
        : WEATHER_STATES.CLEAR_SKY;

      const previousWeather = env.currentWeather;
      env.currentWeather = nextWeather;
      // Weather persists between 4 and 10 hours
      env.weatherDurationHours = rng ? rng.int(4, 10) : 6;

      const cfg = WEATHER_PROFILES[nextWeather];
      env.ambientTempC = cfg.ambientTempC;
      env.radiationRate = cfg.radiationRateMsvPerHour;

      if (bus && previousWeather !== nextWeather) {
        bus.emit(EVENT_WEATHER_CHANGED, {
          from: previousWeather,
          to: nextWeather,
          temperature: env.ambientTempC,
          radiationRate: env.radiationRate,
        });
      }
      alerts.push({ type: 'weather_shift', weather: nextWeather });
    }

    // 2. Weather Condition Processing:
    const current = env.currentWeather;

    // --- CASE A: SUB-ZERO COLD FRONT (Thermal Exposure & Hypothermia) ---
    if (current === WEATHER_STATES.COLD_FRONT) {
      const insulation = this.getThermalInsulation(state);
      const hasHeat = this.hasActiveHeatSource(state, activity);

      if (hasHeat) {
        // Outpost or camp stove: Core temp warms back to equilibrium
        env.coreBodyTemp = Math.min(37.0, env.coreBodyTemp + 0.6 * hours);
        env.shivering = false;
      } else {
        // Thermal deficit: insulation protects against subzero chill
        const thermalDeficit = Math.max(0, (100 - insulation) / 100);
        const tempDrop = (0.35 * thermalDeficit) * hours;
        env.coreBodyTemp = Math.max(32.0, env.coreBodyTemp - tempDrop);

        // Core temp drops below 35.5°C triggers shivering and extra calorie burn
        if (env.coreBodyTemp < 35.5) {
          env.shivering = true;
          // Shivering increases calorie burn by +60% to produce metabolic heat
          if (state.player && state.player.satiety > 0) {
            state.player.satiety = Math.max(0, state.player.satiety - 2.5 * hours);
          }
          alerts.push({
            type: EVENT_EXPOSURE_WARNING,
            hazard: 'cold',
            textKey: 'environment.alert.shivering',
            coreTemp: env.coreBodyTemp.toFixed(1),
          });
        }

        // Severe hypothermia (Core Temp < 34.0°C) directly drains stamina and life
        if (env.coreBodyTemp < 34.0) {
          if (state.player) {
            state.player.energy = Math.max(0, state.player.energy - 8.0 * hours);
            state.player.health = Math.max(0, state.player.health - 3.0 * hours);
          }
          alerts.push({
            type: EVENT_EXPOSURE_WARNING,
            hazard: 'hypothermia',
            textKey: 'environment.alert.hypothermia',
            coreTemp: env.coreBodyTemp.toFixed(1),
          });
        }
      }
    } else {
      // Ambient temperatures above freezing allow natural recovery toward 37.0°C
      if (env.coreBodyTemp < 37.0) {
        env.coreBodyTemp = Math.min(37.0, env.coreBodyTemp + 0.5 * hours);
        if (env.coreBodyTemp >= 35.5) env.shivering = false;
      }
    }

    // --- CASE B: CORROSIVE ACID RAIN (Chemical Burns & Gear Degradation) ---
    if (current === WEATHER_STATES.ACID_RAIN) {
      const hasShielding = this.hasAcidProtection(state);

      if (!hasShielding) {
        // Direct caustic contact burns exposed skin and facial tissues
        if (state.player?.body) {
          applyBodyDamage(state.player.body, {
            part: 'torso',
            amount: Math.round(4.0 * hours),
            damageType: 'burn',
            rng,
            bus,
          });
        } else if (state.player) {
          state.player.health = Math.max(0, state.player.health - 4.0 * hours);
        }
        alerts.push({
          type: EVENT_EXPOSURE_WARNING,
          hazard: 'acid_burn',
          textKey: 'environment.alert.acid_burn',
        });
      }
    }

    // --- CASE C: RADIATION ASH FOG (Pulmonary & Radiometric Exposure) ---
    if (current === WEATHER_STATES.ASH_FOG) {
      const hasRespirator = this.hasAshProtection(state);
      const radDose = (hasRespirator ? 2.5 : env.radiationRate) * hours;
      env.absorbedRadiationTotal += radDose;

      if (!hasRespirator) {
        // Inhaling raw volcanic/industrial sulfur dust irritates lungs and drains stamina
        if (state.player) {
          state.player.energy = Math.max(0, state.player.energy - 6.0 * hours);
          // 25% chance of triggering chemical respiratory ailment
          if (rng && rng.chance(0.25) && state.player.ailments) {
            state.player.ailments.infection = { progress: 20 };
          }
        }
        alerts.push({
          type: EVENT_EXPOSURE_WARNING,
          hazard: 'ash_lung',
          textKey: 'environment.alert.ash_inhalation',
          dose: radDose.toFixed(1),
        });
      }
    }

    // --- CASE D: GALE WINDSTORM (Travel Fatigue & Dehydration) ---
    if (current === WEATHER_STATES.WINDSTORM) {
      if (activity === 'travel' && state.player) {
        state.player.hydration = Math.max(0, state.player.hydration - 3.0 * hours);
        state.player.energy = Math.max(0, state.player.energy - 4.0 * hours);
        alerts.push({
          type: EVENT_EXPOSURE_WARNING,
          hazard: 'windstorm',
          textKey: 'environment.alert.windstorm_fatigue',
        });
      }
    }

    if (bus && alerts.length > 0) {
      bus.emit(EVENT_EXPOSURE_WARNING, { alerts, environment: env });
    }

    return {
      currentWeather: env.currentWeather,
      coreBodyTemp: env.coreBodyTemp,
      ambientTempC: env.ambientTempC,
      radiationRate: env.radiationRate,
      alerts,
    };
  }
}
