import { LOCATIONS, ROUTES } from '../../data/locations.js';
import { BIOMES } from '../../data/biomes.js';
import { BALANCE } from '../../data/balance.js';
import { greatCircleKm, project } from './projection.js';
import { isNight } from '../../core/clock.js';
import { isOverloaded, passiveBonus } from '../inventory/inventorySelectors.js';
import { statusTravelMultiplier } from '../status/statusSelectors.js';
import { WeatherEngine } from '../environment/weatherEngine.js';
import { VEHICLE_CATALOG, VehicleEngine } from '../vehicles/vehicleEngine.js';

/**
 * Precomputed static graph of real-world anchor nodes and connections,
 * projected onto the 2000x857 SVG coordinate space.
 */
const NODE_BY_ID = new Map();
const ADJACENCY = new Map();

for (const raw of LOCATIONS) {
  const { x, y } = project(raw);
  NODE_BY_ID.set(raw.id, Object.freeze({ ...raw, x, y }));
  ADJACENCY.set(raw.id, []);
}

export const EDGES = Object.freeze(
  ROUTES.map(({ a, b, mode }) => {
    const nodeA = NODE_BY_ID.get(a);
    const nodeB = NODE_BY_ID.get(b);
    if (!nodeA || !nodeB) throw new Error(`Route references unknown node: ${a} <-> ${b}`);
    const km = Math.round(greatCircleKm(nodeA, nodeB));
    const edge = Object.freeze({ id: `${a}--${b}`, a, b, mode, km });
    ADJACENCY.get(a).push(Object.freeze({ to: b, mode, km, edgeId: edge.id }));
    ADJACENCY.get(b).push(Object.freeze({ to: a, mode, km, edgeId: edge.id }));
    return edge;
  }),
);

export const ALL_NODES = Object.freeze([...NODE_BY_ID.values()]);

export function getNode(nodeId) {
  const node = NODE_BY_ID.get(nodeId);
  if (!node) throw new Error(`Unknown location node "${nodeId}"`);
  return node;
}

export function neighborsOf(nodeId) {
  return ADJACENCY.get(nodeId) ?? [];
}

export function findRoute(fromId, toId) {
  return neighborsOf(fromId).find((edge) => edge.to === toId) ?? null;
}

/**
 * Node visibility states:
 * - 'visited': player has physically entered this node
 * - 'known': adjacent to a visited node or revealed via survey/radio
 * - 'fog': unknown
 */
export function nodeVisibility(state, nodeId) {
  const entry = state.world.nodes[nodeId];
  if (entry?.visited) return 'visited';
  if (entry?.known) return 'known';
  return 'fog';
}

export function chartedCountries(state) {
  const countries = new Set();
  for (const [nodeId, entry] of Object.entries(state.world.nodes)) {
    if (entry.visited) countries.add(getNode(nodeId).country);
  }
  return countries;
}

/**
 * Computes travel duration (minutes), encounter risk (0..1), and segment count
 * for a route between `fromId` and `toId` given current player & world state.
 */
export function estimateJourney(state, fromId, toId) {
  const route = findRoute(fromId, toId);
  if (!route) return null;

  const destination = getNode(toId);
  const biome = BIOMES[destination.biome];
  const {
    baseHours, kmPerHour, seaTimeMultiplier, segmentMinutes,
    roundToMinutes, nightRiskMultiplier, seaRiskBonus, maxEncounterChance,
  } = BALANCE.travel;

  const mountedId = state?.vehicles?.mountedVehicleId;
  const mountedVehicle = mountedId ? state?.vehicles?.fleet?.[mountedId] : null;
  const vehicleDef = mountedId ? VEHICLE_CATALOG[mountedId] : null;
  const isDriving = Boolean(
    mountedVehicle &&
    mountedVehicle.restored &&
    (vehicleDef?.musclePowered || mountedVehicle.fuelLiters > 0) &&
    mountedVehicle.condition > 0 &&
    (route.mode !== 'sea' || vehicleDef?.amphibious)
  );

  let hours = (baseHours + route.km / kmPerHour) * biome.travelTime;
  if (route.mode === 'sea') {
    hours *= seaTimeMultiplier;
  }

  if (isDriving && vehicleDef) {
    hours *= vehicleDef.speedMultiplier;
    if (mountedVehicle.upgrades?.includes('all_terrain_tires') || vehicleDef.arcticTracked) {
      hours *= 0.9; // 10% faster over rough/arctic terrain
    }
  } else {
    if (isOverloaded(state)) hours *= BALANCE.inventory.overloadTravelPenalty;
    hours *= statusTravelMultiplier(state);
    hours *= Math.max(0.75, 1 - passiveBonus(state, 'travelSpeed'));
  }

  const totalMinutes = Math.max(
    roundToMinutes,
    Math.round((hours * 60) / roundToMinutes) * roundToMinutes,
  );
  const segments = Math.max(1, Math.ceil(totalMinutes / segmentMinutes));

  let risk = biome.encounterRate + (destination.danger - 1) * 0.06;
  if (route.mode === 'sea') risk += seaRiskBonus;
  
  const hasFloodlights = isDriving && mountedVehicle.upgrades?.includes('halogen_floodlights');
  if (isNight(state.time.minutes) && !hasFloodlights && passiveBonus(state, 'nightVision') <= 0) {
    risk *= nightRiskMultiplier;
  }
  const envMods = WeatherEngine.getStealthAndVisibilityModifiers(state);
  risk *= envMods.encounterRiskMultiplier;

  if (isDriving && vehicleDef) {
    risk *= vehicleDef.noiseRiskMultiplier;
    if (mountedVehicle.upgrades?.includes('halogen_floodlights')) {
      risk *= 0.85; // Better situational awareness reduces surprise ambushes
    }
  }

  risk = Math.min(maxEncounterChance, Math.max(0.05, risk));

  const fuelNeeded = isDriving && vehicleDef
    ? VehicleEngine.calculateJourneyFuel(mountedVehicle, vehicleDef, route.km)
    : 0;

  return {
    fromId,
    toId,
    mode: route.mode,
    km: route.km,
    minutes: totalMinutes,
    segments,
    risk,
    destination,
    isDriving,
    vehicleId: isDriving ? mountedId : null,
    fuelNeeded,
  };
}

export function scavengeProfile(state, nodeId = state.world.currentNodeId) {
  const node = getNode(nodeId);
  const biome = BIOMES[node.biome];
  const depletion = state.world.nodes[nodeId]?.depletion ?? 0;
  const night = isNight(state.time.minutes) && passiveBonus(state, 'nightVision') <= 0;

  let chance = BALANCE.scavenge.findChance * (1 - depletion * 0.75);
  chance += passiveBonus(state, 'scavengeBonus');
  if (night) chance -= BALANCE.scavenge.nightPenalty;
  chance = Math.max(0.08, Math.min(0.95, chance));

  const hazardRisk = Math.min(0.65, node.danger * BALANCE.scavenge.hazardChancePerDanger * (night ? 1.25 : 1));
  return { node, biome, depletion, chance, hazardRisk };
}

