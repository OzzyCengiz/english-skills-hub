/**
 * Last Breath // Vehicles & Overland Travel Simulation Engine
 * Zero-dependency Vanilla JS simulation governing abandoned vehicle restoration,
 * component salvage, field siphoning, fuel telemetry, cargo trunk management,
 * modular upgrade attachments (bullbar, roof rack, mud tires, floodlights),
 * vehicle camping, and high-speed overland transit mechanics.
 */

import { getItem } from '../../data/items.js';
import { countItem, removeItem, addItem } from '../inventory/inventoryModel.js';

export const VEHICLE_CATALOG = {
  enduro_recon_bike: {
    id: 'enduro_recon_bike',
    nameKey: 'vehicle.enduro.name',
    descKey: 'vehicle.enduro.desc',
    glyph: '🏍️',
    fuelType: 'gasoline',
    fuelCapacity: 15, // Liters
    fuelLitersPer100Km: 1.8,
    trunkCapacityKg: 45, // kg
    speedMultiplier: 0.30, // 3.3x speed (cuts travel time by 70%)
    noiseRiskMultiplier: 1.6, // +60% encounter hazard
    cabinShelter: false, // exposed rider
    armorReduction: 0.0,
    amphibious: false,
    startNodeId: 'ankara',
    partsRequired: [
      { itemId: 'car_battery_lead_acid', qty: 1, alternates: ['car_battery_12v_lead_acid'] },
      { itemId: 'spark_plug_set', qty: 1, alternates: ['scrap_metal'] },
      { itemId: 'motor_oil_10w40_bottle', qty: 1, alternates: ['motor_oil_synthetic_10w40'] },
      { itemId: 'gasoline_fuel_canister_5l', qty: 1, initialFuel: 5 },
    ],
  },

  uaz_469_jeep: {
    id: 'uaz_469_jeep',
    nameKey: 'vehicle.uaz.name',
    descKey: 'vehicle.uaz.desc',
    glyph: '🚙',
    fuelType: 'gasoline',
    fuelCapacity: 55, // Liters
    fuelLitersPer100Km: 3.8,
    trunkCapacityKg: 220, // kg
    speedMultiplier: 0.22, // 4.5x speed (cuts travel time by 78%)
    noiseRiskMultiplier: 2.2, // +120% encounter hazard
    cabinShelter: true, // Sealed cabin protects from acid rain, cold front & ash fog
    armorReduction: 0.15, // 15% ambush defense
    amphibious: false,
    startNodeId: 'istanbul',
    partsRequired: [
      { itemId: 'car_battery_lead_acid', qty: 1, alternates: ['car_battery_12v_lead_acid'] },
      { itemId: 'motor_oil_10w40_bottle', qty: 2, alternates: ['motor_oil_synthetic_10w40'] },
      { itemId: 'spark_plug_set', qty: 1, alternates: ['scrap_metal'] },
      { itemId: 'copper_wire', qty: 3, alternates: ['steel_wire_galvanized'] },
      { itemId: 'gasoline_fuel_canister_5l', qty: 1, initialFuel: 5 },
    ],
  },

  scavenger_solar_buggy: {
    id: 'scavenger_solar_buggy',
    nameKey: 'vehicle.buggy.name',
    descKey: 'vehicle.buggy.desc',
    glyph: '🏎️',
    fuelType: 'electric',
    fuelCapacity: 35, // kWh capacity
    fuelLitersPer100Km: 0.8, // kWh per 100km
    trunkCapacityKg: 110, // kg
    speedMultiplier: 0.26, // 3.8x speed
    noiseRiskMultiplier: 0.65, // -35% encounter hazard (Whisper silent electric motor!)
    cabinShelter: false, // Open roll-cage
    armorReduction: 0.05,
    amphibious: false,
    solarChargingRatePerHour: 2.5, // Auto-charges 2.5 kWh per hour of daylight
    startNodeId: 'athens',
    partsRequired: [
      { itemId: 'car_battery_12v_lead_acid', qty: 2, alternates: ['car_battery_lead_acid'] },
      { itemId: 'copper_wire', qty: 3, alternates: ['steel_wire_galvanized'] },
      { itemId: 'scrap_metal', qty: 4 },
      { itemId: 'duct_tape', qty: 2 },
    ],
  },

  ural_4320_caravan: {
    id: 'ural_4320_caravan',
    nameKey: 'vehicle.ural.name',
    descKey: 'vehicle.ural.desc',
    glyph: '🚛',
    fuelType: 'diesel',
    fuelCapacity: 160, // Liters
    fuelLitersPer100Km: 7.2,
    trunkCapacityKg: 650, // kg
    speedMultiplier: 0.35, // 2.8x speed
    noiseRiskMultiplier: 2.8, // +180% raider ambush attraction
    cabinShelter: true, // Heavy mobile fortress
    armorReduction: 0.40, // 40% ballistic damage reduction
    amphibious: false,
    startNodeId: 'kyiv',
    partsRequired: [
      { itemId: 'car_battery_12v_lead_acid', qty: 2, alternates: ['car_battery_lead_acid'] },
      { itemId: 'diesel_fuel_canister_10l', qty: 1, alternates: ['diesel_fuel_canister_5l'], initialFuel: 10 },
      { itemId: 'motor_oil_10w40_bottle', qty: 3, alternates: ['motor_oil_synthetic_10w40'] },
      { itemId: 'scrap_iron_plates', qty: 4, alternates: ['scrap_metal'] },
      { itemId: 'copper_wire', qty: 4, alternates: ['steel_wire_galvanized'] },
    ],
  },

  btr_80_armored_carrier: {
    id: 'btr_80_armored_carrier',
    nameKey: 'vehicle.btr.name',
    descKey: 'vehicle.btr.desc',
    glyph: '🛡️',
    fuelType: 'diesel',
    fuelCapacity: 220, // Liters
    fuelLitersPer100Km: 8.5,
    trunkCapacityKg: 900, // kg
    speedMultiplier: 0.36, // 2.8x speed
    noiseRiskMultiplier: 3.2, // Heavy military rumble
    cabinShelter: true, // NBC sealed heavy armored hull
    armorReduction: 0.60, // 60% ballistic deflection
    amphibious: true, // Can traverse sea/river routes without boats!
    startNodeId: 'bucharest',
    partsRequired: [
      { itemId: 'car_battery_12v_lead_acid', qty: 2, alternates: ['car_battery_lead_acid'] },
      { itemId: 'diesel_fuel_canister_10l', qty: 2, alternates: ['diesel_fuel_canister_5l'], initialFuel: 20 },
      { itemId: 'scrap_iron_plates', qty: 6, alternates: ['scrap_metal'] },
      { itemId: 'motor_oil_synthetic_10w40', qty: 3, alternates: ['motor_oil_10w40_bottle'] },
      { itemId: 'copper_wire', qty: 5, alternates: ['steel_wire_galvanized'] },
    ],
  },

  paramedic_field_ambulance: {
    id: 'paramedic_field_ambulance',
    nameKey: 'vehicle.ambulance.name',
    descKey: 'vehicle.ambulance.desc',
    glyph: '🚑',
    fuelType: 'diesel',
    fuelCapacity: 75, // Liters
    fuelLitersPer100Km: 4.2,
    trunkCapacityKg: 350, // kg
    speedMultiplier: 0.25, // 4.0x speed
    noiseRiskMultiplier: 1.8,
    cabinShelter: true, // Sterile sealed medical cabin
    armorReduction: 0.20,
    amphibious: false,
    fieldClinic: true, // Medical healing during travel and rest
    startNodeId: 'berlin',
    partsRequired: [
      { itemId: 'car_battery_lead_acid', qty: 1, alternates: ['car_battery_12v_lead_acid'] },
      { itemId: 'motor_oil_10w40_bottle', qty: 2, alternates: ['motor_oil_synthetic_10w40'] },
      { itemId: 'spark_plug_set', qty: 1, alternates: ['scrap_metal'] },
      { itemId: 'first_aid_kit', qty: 1, alternates: ['military_ifak_complete', 'bandage'] },
      { itemId: 'diesel_fuel_canister_10l', qty: 1, alternates: ['diesel_fuel_canister_5l'], initialFuel: 10 },
    ],
  },

  tundra_tracked_snowcat: {
    id: 'tundra_tracked_snowcat',
    nameKey: 'vehicle.snowcat.name',
    descKey: 'vehicle.snowcat.desc',
    glyph: '🚜',
    fuelType: 'diesel',
    fuelCapacity: 130, // Liters
    fuelLitersPer100Km: 6.0,
    trunkCapacityKg: 550, // kg
    speedMultiplier: 0.32, // 3.1x speed
    noiseRiskMultiplier: 2.4,
    cabinShelter: true, // Heavy heated reinforced cabin
    armorReduction: 0.35,
    amphibious: false,
    arcticTracked: true, // Zero snow/frost penalties
    startNodeId: 'reykjavik',
    partsRequired: [
      { itemId: 'car_battery_12v_lead_acid', qty: 2, alternates: ['car_battery_lead_acid'] },
      { itemId: 'motor_oil_synthetic_10w40', qty: 2, alternates: ['motor_oil_10w40_bottle'] },
      { itemId: 'scrap_iron_plates', qty: 4, alternates: ['scrap_metal'] },
      { itemId: 'steel_wire_galvanized', qty: 3, alternates: ['copper_wire'] },
      { itemId: 'diesel_fuel_canister_10l', qty: 1, alternates: ['diesel_fuel_canister_5l'], initialFuel: 10 },
    ],
  },

  rail_handcar_draisine: {
    id: 'rail_handcar_draisine',
    nameKey: 'vehicle.draisine.name',
    descKey: 'vehicle.draisine.desc',
    glyph: '🚋',
    fuelType: 'muscle',
    fuelCapacity: 100, // Mechanical gear integrity
    fuelLitersPer100Km: 0.0, // Zero fuel required!
    trunkCapacityKg: 280, // kg
    speedMultiplier: 0.38, // 2.6x speed
    noiseRiskMultiplier: 0.30, // -70% encounter risk (Silent manual pumping)
    cabinShelter: false,
    armorReduction: 0.10,
    amphibious: false,
    musclePowered: true,
    startNodeId: 'vienna',
    partsRequired: [
      { itemId: 'scrap_metal', qty: 4 },
      { itemId: 'duct_tape', qty: 2 },
      { itemId: 'motor_oil_10w40_bottle', qty: 1, alternates: ['motor_oil_synthetic_10w40'] },
      { itemId: 'steel_wire_galvanized', qty: 2, alternates: ['copper_wire'] },
    ],
  },

  combat_assault_rhib: {
    id: 'combat_assault_rhib',
    nameKey: 'vehicle.rhib.name',
    descKey: 'vehicle.rhib.desc',
    glyph: '🚤',
    fuelType: 'gasoline',
    fuelCapacity: 60, // Liters
    fuelLitersPer100Km: 3.2,
    trunkCapacityKg: 180, // kg
    speedMultiplier: 0.22, // 4.5x speed
    noiseRiskMultiplier: 1.5,
    cabinShelter: false,
    armorReduction: 0.05,
    amphibious: true, // Special amphibious marine capability
    startNodeId: 'lisbon',
    partsRequired: [
      { itemId: 'car_battery_lead_acid', qty: 1, alternates: ['car_battery_12v_lead_acid'] },
      { itemId: 'spark_plug_set', qty: 1, alternates: ['scrap_metal'] },
      { itemId: 'duct_tape', qty: 3 },
      { itemId: 'gasoline_fuel_canister_5l', qty: 2, initialFuel: 10 },
    ],
  },
};

export const VEHICLE_UPGRADES = {
  bullbar_ram: {
    id: 'bullbar_ram',
    nameKey: 'vehicle.upgrade.bullbar.name',
    descKey: 'vehicle.upgrade.bullbar.desc',
    icon: '🛡️',
    requiredItems: [
      { itemId: 'scrap_iron_plates', qty: 2, alternates: ['scrap_metal'] },
      { itemId: 'steel_wire_galvanized', qty: 2, alternates: ['copper_wire'] },
    ],
    effects: {
      armorReductionBonus: 0.15,
      canRamRoadblocks: true,
    },
  },

  roof_cargo_rack: {
    id: 'roof_cargo_rack',
    nameKey: 'vehicle.upgrade.cargo_rack.name',
    descKey: 'vehicle.upgrade.cargo_rack.desc',
    icon: '📦',
    requiredItems: [
      { itemId: 'scrap_metal', qty: 4 },
      { itemId: 'duct_tape', qty: 2 },
    ],
    effects: {
      trunkCapacityMultiplier: 1.40, // +40% cargo capacity
    },
  },

  all_terrain_tires: {
    id: 'all_terrain_tires',
    nameKey: 'vehicle.upgrade.tires.name',
    descKey: 'vehicle.upgrade.tires.desc',
    icon: '🛞',
    requiredItems: [
      { itemId: 'scrap_metal', qty: 3 },
      { itemId: 'duct_tape', qty: 2 },
    ],
    effects: {
      fuelEfficiencyBonus: 0.20, // -20% fuel consumption
    },
  },

  halogen_floodlights: {
    id: 'halogen_floodlights',
    nameKey: 'vehicle.upgrade.floodlights.name',
    descKey: 'vehicle.upgrade.floodlights.desc',
    icon: '💡',
    requiredItems: [
      { itemId: 'copper_wire', qty: 2 },
      { itemId: 'car_battery_lead_acid', qty: 1, alternates: ['car_battery_12v_lead_acid'] },
    ],
    effects: {
      nightVision: true,
      noiseMultiplierReduction: 0.15,
    },
  },

  auxiliary_fuel_tank: {
    id: 'auxiliary_fuel_tank',
    nameKey: 'vehicle.upgrade.fuel_tank.name',
    descKey: 'vehicle.upgrade.fuel_tank.desc',
    icon: '⛽',
    requiredItems: [
      { itemId: 'scrap_metal', qty: 4 },
      { itemId: 'gasoline_fuel_canister_5l', qty: 1, alternates: ['diesel_fuel_canister_5l'] },
    ],
    effects: {
      extraFuelCapacity: 25, // +25 L / kWh
    },
  },

  mobile_camper_bed: {
    id: 'mobile_camper_bed',
    nameKey: 'vehicle.upgrade.camper_bed.name',
    descKey: 'vehicle.upgrade.camper_bed.desc',
    icon: '🛏️',
    requiredItems: [
      { itemId: 'down_filled_subzero_sleeping_bag', qty: 1, alternates: ['thermal_mylar_bivvy_emergency_sleeping_bag', 'bandage'] },
      { itemId: 'duct_tape', qty: 1 },
    ],
    effects: {
      canCamp: true,
      staminaRestBonus: 1.3,
    },
  },
};

export class VehicleEngine {
  /**
   * Generates initial reactive state for the vehicles module.
   */
  static getInitialState() {
    const fleet = {};
    for (const [vId, def] of Object.entries(VEHICLE_CATALOG)) {
      const installedParts = {};
      for (const req of def.partsRequired) {
        installedParts[req.itemId] = 0;
      }
      fleet[vId] = {
        id: vId,
        discovered: false, // Initially hidden across the world until found
        claimed: false,    // Initially unclaimed by player
        nodeId: null,      // Dynamically placed on node when discovered
        restored: false,
        condition: 15 + Math.floor(Math.random() * 25), // 15-40% damaged derelict condition
        fuelLiters: def.musclePowered || def.fuelType === 'muscle' ? 0 : Math.floor(def.fuelCapacity * 0.15),
        maxFuel: def.fuelCapacity,
        installedParts,
        upgrades: [], // Installed upgrade IDs
        cargo: [], // [{ itemId, qty }]
      };
    }

    return {
      mountedVehicleId: null,
      activeModalVehicleId: null,
      fleet,
    };
  }

  /**
   * Retrieves definition from catalog.
   */
  static getDef(vehicleId) {
    return VEHICLE_CATALOG[vehicleId] || null;
  }

  /**
   * Retrieves active vehicle instance in fleet.
   */
  static getVehicle(state, vehicleId) {
    return state?.vehicles?.fleet?.[vehicleId] || null;
  }

  /**
   * Returns the vehicle currently mounted by player, if any.
   */
  static getMountedVehicle(state) {
    const vId = state?.vehicles?.mountedVehicleId;
    if (!vId) return null;
    const vehicle = state?.vehicles?.fleet?.[vId];
    if (!vehicle) return null;
    return {
      vehicle,
      def: VEHICLE_CATALOG[vId],
    };
  }

  /**
   * Returns list of vehicles parked in a given sector (only discovered ones).
   */
  static getVehiclesInSector(state, nodeId) {
    const fleetObj = state?.vehicles?.fleet || state?.fleet;
    if (!fleetObj || !nodeId) return [];
    return Object.values(fleetObj).filter((v) => v.discovered && v.nodeId === nodeId);
  }

  /**
   * Returns list of all vehicles discovered anywhere in the world.
   */
  static getDiscoveredVehicles(state) {
    const fleetObj = state?.vehicles?.fleet || state?.fleet;
    if (!fleetObj) return [];
    return Object.values(fleetObj).filter((v) => v.discovered);
  }

  /**
   * Returns list of all vehicles claimed into the player's personal fleet/inventory.
   */
  static getClaimedVehicles(state) {
    const fleetObj = state?.vehicles?.fleet || state?.fleet;
    if (!fleetObj) return [];
    return Object.values(fleetObj).filter((v) => v.claimed);
  }

  /**
   * Evaluates random vehicle discovery chance when survivor performs world activities.
   */
  static checkRandomDiscovery(state, rng, { nodeId, source = 'scavenge' }) {
    const fleetObj = state?.vehicles?.fleet || state?.fleet;
    if (!fleetObj || !nodeId || !rng) return null;

    const undiscovered = Object.values(fleetObj).filter((v) => !v.discovered);
    if (!undiscovered.length) return null;

    // Rates based on activity source
    let chance = 0.20; // Default scavenge chance
    if (source === 'survey') chance = 0.35; // Recon/surveying yields higher chance
    if (source === 'patrol') chance = 0.22;
    if (source === 'travel') chance = 0.12; // Arrival in new sector

    if (!rng.chance(chance)) return null;

    const chosen = rng.pick(undiscovered);
    chosen.discovered = true;
    chosen.nodeId = nodeId;

    return {
      vehicleId: chosen.id,
      vehicle: chosen,
      def: VEHICLE_CATALOG[chosen.id],
      nodeId,
      source,
    };
  }

  /**
   * Checks if an upgrade is installed on the vehicle.
   */
  static hasUpgrade(vehicle, upgradeId) {
    return Boolean(vehicle?.upgrades?.includes(upgradeId));
  }

  /**
   * Calculates effective max fuel capacity including auxiliary fuel tank upgrades.
   */
  static getEffectiveMaxFuel(vehicle, def) {
    if (!def) return 0;
    const base = def.fuelCapacity;
    const hasAux = this.hasUpgrade(vehicle, 'auxiliary_fuel_tank');
    return hasAux ? base + 25 : base;
  }

  /**
   * Calculates effective trunk weight capacity including roof rack upgrades.
   */
  static getEffectiveTrunkCapacity(vehicle, def) {
    if (!def) return 0;
    const base = def.trunkCapacityKg;
    const hasRack = this.hasUpgrade(vehicle, 'roof_cargo_rack');
    return hasRack ? Math.round(base * 1.4) : base;
  }

  /**
   * Calculates effective armor reduction percentage.
   */
  static getEffectiveArmorReduction(vehicle, def) {
    if (!def) return 0;
    let armor = def.armorReduction || 0;
    if (this.hasUpgrade(vehicle, 'bullbar_ram')) {
      armor += 0.15;
    }
    return Math.min(0.85, armor);
  }

  /**
   * Calculates effective fuel consumption per 100km.
   */
  static getEffectiveFuelPer100Km(vehicle, def) {
    if (!def) return 0;
    let rate = def.fuelLitersPer100Km;
    if (this.hasUpgrade(vehicle, 'all_terrain_tires')) {
      rate *= 0.8; // -20% fuel consumption
    }
    return Math.round(rate * 10) / 10;
  }

  /**
   * Checks whether the player can camp/rest inside this vehicle.
   */
  static canCampInVehicle(vehicle, def) {
    if (!vehicle || !def || !vehicle.restored) return false;
    return Boolean(def.cabinShelter || this.hasUpgrade(vehicle, 'mobile_camper_bed'));
  }

  /**
   * Checks if all required parts have been installed.
   */
  static checkRestoration(vehicle, def) {
    if (vehicle.restored) return true;
    for (const req of def.partsRequired) {
      const installed = vehicle.installedParts?.[req.itemId] || 0;
      if (installed < req.qty) return false;
    }
    return true;
  }

  /**
   * Checks if player has any compatible item for a specific vehicle part requirement.
   */
  static findAvailablePartInInventory(inventory, req) {
    if (!inventory || !Array.isArray(inventory.stacks)) return null;
    if (countItem(inventory, req.itemId) >= 1) {
      return req.itemId;
    }
    if (Array.isArray(req.alternates)) {
      for (const altId of req.alternates) {
        if (countItem(inventory, altId) >= 1) {
          return altId;
        }
      }
    }
    return null;
  }

  /**
   * Calculates total weight of all cargo stored in vehicle trunk.
   */
  static getCargoWeight(vehicle) {
    if (!vehicle?.cargo || !Array.isArray(vehicle.cargo)) return 0;
    let total = 0;
    for (const { itemId, qty } of vehicle.cargo) {
      const item = getItem(itemId);
      if (item && item.weight) {
        total += item.weight * qty;
      }
    }
    return Math.round(total * 100) / 100;
  }

  /**
   * Calculates fuel requirement for a journey of given distance in km.
   */
  static calculateJourneyFuel(vehicle, def, km) {
    if (!def) return 0;
    if (def.musclePowered || def.fuelType === 'muscle') return 0;
    const rate = this.getEffectiveFuelPer100Km(vehicle, def);
    const liters = (km / 100) * rate;
    return Math.max(0.5, Math.round(liters * 10) / 10);
  }

  /**
   * Checks whether vehicle can make a journey over the specified km.
   */
  static canMakeJourney(vehicle, def, km) {
    if (!vehicle || !def || !vehicle.restored) {
      return { ok: false, canTravel: false, reason: 'vehicle_not_operational' };
    }
    if (vehicle.condition <= 0) {
      return { ok: false, canTravel: false, reason: 'engine_broken_down' };
    }
    if (def.musclePowered || def.fuelType === 'muscle') {
      return { ok: true, canTravel: true, needed: 0, current: vehicle.fuelLiters || 100 };
    }
    const needed = this.calculateJourneyFuel(vehicle, def, km);
    if (vehicle.fuelLiters < needed) {
      return { ok: false, canTravel: false, reason: 'insufficient_fuel', needed, current: vehicle.fuelLiters };
    }
    return { ok: true, canTravel: true, needed, current: vehicle.fuelLiters };
  }

  /**
   * Installs a part from player inventory into the vehicle during restoration.
   */
  static installPart(state, vehicleId, reqItemId) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    const def = VEHICLE_CATALOG[vehicleId];
    if (!vehicle || !def) return { ok: false, reason: 'invalid_vehicle' };

    const req = def.partsRequired.find((r) => r.itemId === reqItemId);
    if (!req) return { ok: false, reason: 'invalid_requirement' };

    const currentInstalled = vehicle.installedParts?.[req.itemId] || 0;
    if (currentInstalled >= req.qty) {
      return { ok: false, reason: 'requirement_already_fulfilled' };
    }

    const availablePartId = this.findAvailablePartInInventory(state.inventory, req);
    if (!availablePartId) {
      return { ok: false, reason: 'part_not_in_inventory' };
    }

    // Consume from inventory
    const remResult = removeItem(state.inventory, availablePartId, 1);
    if (!remResult.removed) return { ok: false, reason: 'failed_to_consume' };
    state.inventory = remResult.inventory;

    // Record installation
    vehicle.installedParts[req.itemId] = currentInstalled + 1;
    vehicle.condition = Math.min(100, vehicle.condition + 15);

    // Initial fuel if part was a fuel canister
    if (req.initialFuel) {
      const maxFuel = this.getEffectiveMaxFuel(vehicle, def);
      vehicle.fuelLiters = Math.min(maxFuel, vehicle.fuelLiters + req.initialFuel);
    }

    // Check full restoration
    const restoredNow = this.checkRestoration(vehicle, def);
    if (restoredNow && !vehicle.restored) {
      vehicle.restored = true;
      vehicle.condition = 100;
      if (vehicle.fuelLiters <= 0) vehicle.fuelLiters = 5;
    }

    return {
      ok: true,
      restored: vehicle.restored,
      installedItem: availablePartId,
      remainingNeed: Math.max(0, req.qty - vehicle.installedParts[req.itemId]),
    };
  }

  /**
   * Installs a modular upgrade attachment (Bullbar, Roof Rack, Mud Tires, Floodlights, etc.).
   */
  static installUpgrade(state, vehicleId, upgradeId) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    const def = VEHICLE_CATALOG[vehicleId];
    const upDef = VEHICLE_UPGRADES[upgradeId];
    if (!vehicle || !def || !upDef) return { ok: false, reason: 'invalid_upgrade' };

    if (!vehicle.restored) {
      return { ok: false, reason: 'vehicle_not_restored' };
    }

    vehicle.upgrades = vehicle.upgrades || [];
    if (vehicle.upgrades.includes(upgradeId)) {
      return { ok: false, reason: 'upgrade_already_installed' };
    }

    // Verify all required items are in player inventory
    for (const req of upDef.requiredItems) {
      const hasPart = this.findAvailablePartInInventory(state.inventory, req);
      if (!hasPart || countItem(state.inventory, hasPart) < req.qty) {
        return { ok: false, reason: 'missing_upgrade_materials', itemId: req.itemId, needed: req.qty };
      }
    }

    // Consume items
    for (const req of upDef.requiredItems) {
      const partId = this.findAvailablePartInInventory(state.inventory, req);
      const rem = removeItem(state.inventory, partId, req.qty);
      if (!rem.removed) return { ok: false, reason: 'failed_to_consume' };
      state.inventory = rem.inventory;
    }

    vehicle.upgrades.push(upgradeId);
    vehicle.maxFuel = this.getEffectiveMaxFuel(vehicle, def);

    return { ok: true, upgradeId, vehicle };
  }

  /**
   * Refuels the vehicle using compatible canisters or batteries in inventory.
   */
  static refuel(state, vehicleId, canisterItemId) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    const def = VEHICLE_CATALOG[vehicleId];
    if (!vehicle || !def) return { ok: false, reason: 'invalid_vehicle' };

    if (def.musclePowered || def.fuelType === 'muscle') {
      return { ok: false, reason: 'muscle_powered_no_fuel' };
    }

    const fuelVolumes = {
      gasoline_fuel_canister_5l: { type: 'gasoline', liters: 5 },
      diesel_fuel_canister_5l: { type: 'diesel', liters: 5 },
      diesel_fuel_canister_10l: { type: 'diesel', liters: 10 },
      kerosene_fuel_canister: { type: 'gasoline', liters: 3 },
      car_battery_lead_acid: { type: 'electric', liters: 12 },
      car_battery_12v_lead_acid: { type: 'electric', liters: 18 },
    };

    const fuelSpec = fuelVolumes[canisterItemId];
    if (!fuelSpec) return { ok: false, reason: 'unrecognized_fuel_item' };
    if (fuelSpec.type !== def.fuelType) {
      return { ok: false, reason: 'fuel_type_mismatch', required: def.fuelType };
    }

    if (countItem(state.inventory, canisterItemId) < 1) {
      return { ok: false, reason: 'canister_not_owned' };
    }

    const maxFuel = this.getEffectiveMaxFuel(vehicle, def);
    if (vehicle.fuelLiters >= maxFuel) {
      return { ok: false, reason: 'tank_already_full' };
    }

    const remResult = removeItem(state.inventory, canisterItemId, 1);
    if (!remResult.removed) return { ok: false, reason: 'failed_to_consume' };
    state.inventory = remResult.inventory;

    const added = Math.min(maxFuel - vehicle.fuelLiters, fuelSpec.liters);
    vehicle.fuelLiters = Math.round((vehicle.fuelLiters + added) * 10) / 10;

    return { ok: true, addedLiters: added, currentFuel: vehicle.fuelLiters };
  }

  /**
   * Repairs vehicle engine condition using scrap metal, tools, or motor oil.
   */
  static repairCondition(state, vehicleId, repairItemId) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    if (!vehicle) return { ok: false, reason: 'invalid_vehicle' };
    if (vehicle.condition >= 100) return { ok: false, reason: 'already_pristine' };

    const repairValues = {
      scrap_metal: 10,
      scrap_iron_plates: 20,
      motor_oil_10w40_bottle: 25,
      motor_oil_synthetic_10w40: 35,
      duct_tape: 8,
    };

    const gain = repairValues[repairItemId];
    if (!gain) return { ok: false, reason: 'not_a_repair_item' };

    if (countItem(state.inventory, repairItemId) < 1) {
      return { ok: false, reason: 'item_not_owned' };
    }

    const rem = removeItem(state.inventory, repairItemId, 1);
    if (!rem.removed) return { ok: false, reason: 'failed_to_consume' };
    state.inventory = rem.inventory;

    vehicle.condition = Math.min(100, vehicle.condition + gain);
    return { ok: true, gain, condition: vehicle.condition };
  }

  /**
   * Transfers an item from player's pack into vehicle's trunk.
   */
  static transferToCargo(state, vehicleId, itemId, qty = 1) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    const def = VEHICLE_CATALOG[vehicleId];
    if (!vehicle || !def) return { ok: false, reason: 'invalid_vehicle' };

    const owned = countItem(state.inventory, itemId);
    if (owned < qty) return { ok: false, reason: 'insufficient_quantity' };

    const item = getItem(itemId);
    const weightPerItem = item?.weight || 0.1;
    const currentWeight = this.getCargoWeight(vehicle);
    const maxWeight = this.getEffectiveTrunkCapacity(vehicle, def);

    if (currentWeight + (weightPerItem * qty) > maxWeight) {
      return { ok: false, reason: 'trunk_full', max: maxWeight, current: currentWeight };
    }

    const rem = removeItem(state.inventory, itemId, qty);
    if (!rem.removed) return { ok: false, reason: 'failed_to_remove' };
    state.inventory = rem.inventory;

    // Add to vehicle cargo stacks
    vehicle.cargo = vehicle.cargo || [];
    const existing = vehicle.cargo.find((s) => s.itemId === itemId);
    if (existing) {
      existing.qty += qty;
    } else {
      vehicle.cargo.push({ itemId, qty });
    }

    return { ok: true, itemId, qty };
  }

  /**
   * Transfers an item from vehicle's trunk into player's pack.
   */
  static transferToPack(state, vehicleId, itemId, qty = 1) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    if (!vehicle) return { ok: false, reason: 'invalid_vehicle' };

    const cargoStack = vehicle.cargo?.find((s) => s.itemId === itemId);
    if (!cargoStack || cargoStack.qty < qty) {
      return { ok: false, reason: 'insufficient_cargo_quantity' };
    }

    const addRes = addItem(state.inventory, itemId, qty);
    state.inventory = addRes.inventory;

    cargoStack.qty -= qty;
    if (cargoStack.qty <= 0) {
      vehicle.cargo = vehicle.cargo.filter((s) => s.itemId !== itemId);
    }

    return { ok: true, itemId, qty };
  }

  /**
   * Siphons fuel from abandoned roadside wrecks into the vehicle.
   */
  static siphonFuel(state, vehicleId) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    const def = VEHICLE_CATALOG[vehicleId];
    if (!vehicle || !def) return { ok: false, reason: 'invalid_vehicle' };

    const hasHose = countItem(state.inventory, 'fuel_siphon_hose') > 0;
    if (!hasHose) return { ok: false, reason: 'no_siphon_hose' };

    const maxFuel = this.getEffectiveMaxFuel(vehicle, def);
    if (vehicle.fuelLiters >= maxFuel) {
      return { ok: false, reason: 'tank_full' };
    }

    const siphoned = Math.min(maxFuel - vehicle.fuelLiters, 4.0);
    vehicle.fuelLiters = Math.round((vehicle.fuelLiters + siphoned) * 10) / 10;

    return { ok: true, siphonedLiters: siphoned, currentFuel: vehicle.fuelLiters };
  }

  /**
   * Safe mobile camp/rest inside vehicle cabin or camper bed.
   */
  static campInVehicle(state, vehicleId, hours = 4) {
    const vehicle = state?.vehicles?.fleet?.[vehicleId];
    const def = VEHICLE_CATALOG[vehicleId];
    if (!vehicle || !def) return { ok: false, reason: 'invalid_vehicle' };

    if (!this.canCampInVehicle(vehicle, def)) {
      return { ok: false, reason: 'no_cabin_shelter' };
    }

    // Solar charging during daytime rest for solar buggy
    if (def.solarChargingRatePerHour && state.time) {
      const isNightTime = (state.time.minutes % 1440) < 360 || (state.time.minutes % 1440) > 1200;
      if (!isNightTime) {
        const charged = def.solarChargingRatePerHour * hours;
        const maxFuel = this.getEffectiveMaxFuel(vehicle, def);
        vehicle.fuelLiters = Math.min(maxFuel, Math.round((vehicle.fuelLiters + charged) * 10) / 10);
      }
    }

    // Paramedic field ambulance medical trauma treatment during camp
    if (def.fieldClinic && state.player) {
      if (state.player.health < 100) {
        state.player.health = Math.min(100, state.player.health + 30);
      }
      if (state.player.body) {
        for (const p of Object.values(state.player.body)) {
          if (p.bleeding === 'minor') p.bleeding = 'none';
          p.infectionRisk = Math.max(0, p.infectionRisk - 50);
          p.health = Math.min(100, p.health + 25);
        }
      }
    }

    return { ok: true, hours, fieldClinicHealing: Boolean(def.fieldClinic) };
  }
}
