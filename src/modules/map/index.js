import { BALANCE } from '../../data/balance.js';
import { ENCOUNTERS } from '../../data/encounters.js';
import { getRandomFieldLog } from '../../data/narratives.js';
import { i18n, ref } from '../../i18n/i18n.js';
import { rollRange } from '../../core/rng.js';
import { grantItems } from '../inventory/index.js';
import { rollLoot } from '../inventory/loot.js';
import { rollScavengeLoot } from '../../data/countryLoot.js';
import { skillMultiplier } from '../skills/skillSelectors.js';
import { passiveBonus } from '../inventory/inventorySelectors.js';
import {
  ALL_NODES, estimateJourney, findRoute, getNode, neighborsOf, scavengeProfile,
} from './mapGraph.js';
import { consumeCombatAmmo, evaluateCheckChance, pickEncounter } from './encounters.js';
import { WeatherEngine } from '../environment/weatherEngine.js';
import { VEHICLE_CATALOG, VehicleEngine } from '../vehicles/vehicleEngine.js';
import { codexManager } from '../../core/codexManager.js';
import { adManager } from '../../core/adManager.js';

const locName = (nodeId) => ref(`location.${nodeId}`);

function createInitialWorld() {
  const startId = BALANCE.startingNode;
  const nodes = {};
  nodes[startId] = { visited: true, known: true, depletion: 0, scavenges: 0 };
  for (const edge of neighborsOf(startId)) {
    nodes[edge.to] = { visited: false, known: true, depletion: 0, scavenges: 0 };
  }
  return {
    currentNodeId: startId,
    selectedNodeId: startId,
    nodes,
    encounter: null,
  };
}

function registerMapMutations(store) {
  store.registerMutations('world', {
    selectNode(state, nodeId) {
      state.world.selectedNodeId = nodeId;
    },
    visitNode(state, nodeId) {
      state.world.currentNodeId = nodeId;
      state.world.selectedNodeId = nodeId;
      const entry = (state.world.nodes[nodeId] ??= { visited: false, known: true, depletion: 0, scavenges: 0 });
      const firstVisit = !entry.visited;
      entry.visited = true;
      entry.known = true;
      for (const edge of neighborsOf(nodeId)) {
        const neighbor = (state.world.nodes[edge.to] ??= { visited: false, known: false, depletion: 0, scavenges: 0 });
        neighbor.known = true;
      }
      return firstVisit;
    },
    revealNode(state, nodeId) {
      const entry = (state.world.nodes[nodeId] ??= { visited: false, known: false, depletion: 0, scavenges: 0 });
      const wasHidden = !entry.known;
      entry.known = true;
      return wasHidden;
    },
    depleteNode(state, { nodeId, amount }) {
      const entry = (state.world.nodes[nodeId] ??= { visited: true, known: true, depletion: 0, scavenges: 0 });
      entry.depletion = Math.min(1, Math.max(0, entry.depletion + amount));
      if (amount > 0) entry.scavenges += 1;
    },
    recoverDepletion(state, amount) {
      for (const entry of Object.values(state.world.nodes)) {
        if (entry.depletion > 0) {
          entry.depletion = Math.max(0, entry.depletion - amount);
        }
      }
    },
    setEncounter(state, encounter) {
      state.world.encounter = encounter;
    },
    clearEncounter(state) {
      state.world.encounter = null;
    },
  });
}

function startEncounter(ctx, { context, nodeId, mode = 'road', pendingTravel = null }) {
  const chosen = pickEncounter(ctx.rng, { context, nodeId, mode });
  if (!chosen) return false;
  ctx.store.commit('world/setEncounter', {
    id: chosen.id,
    context,
    nodeId,
    mode,
    pendingTravel,
  });
  ctx.engine.log('log.encounter.triggered', { title: ref(`encounter.${chosen.id}.title`) }, 'warn');
  return true;
}

/**
 * Advances a multi-segment journey until either an encounter interrupts it,
 * the player dies en route, or the destination is reached.
 */
function runTravelSegments(ctx, plan) {
  const { store, rng, engine } = ctx;
  const { fromId, toId, mode, remainingMinutes, remainingSegments, risk, isDriving, vehicleId, fuelNeeded, km } = plan;

  let minutesLeft = remainingMinutes;
  let segmentsLeft = remainingSegments;

  // Consume fuel and update vehicle position if driving
  if (isDriving && vehicleId) {
    store.commit('vehicles/consumeFuel', { vehicleId, liters: fuelNeeded });
    store.commit('vehicles/degradeCondition', {
      vehicleId,
      amount: Math.max(1, Math.round((km / 100) * 1.5)),
    });
    store.commit('vehicles/updateVehicleLocation', { vehicleId, nodeId: toId });
  }

  while (segmentsLeft > 0 && store.state.player.alive) {
    const stepMinutes = Math.round(minutesLeft / segmentsLeft);
    engine.advanceTime(stepMinutes, 'travel');
    minutesLeft -= stepMinutes;
    segmentsLeft -= 1;

    if (!store.state.player.alive) return { ok: false, died: true };

    const perSegmentChance = 1 - (1 - risk) ** (1 / Math.max(1, plan.totalSegments));
    if (rng.chance(perSegmentChance)) {
      const interrupted = startEncounter(ctx, {
        context: 'travel',
        nodeId: toId,
        mode,
        pendingTravel: {
          fromId,
          toId,
          mode,
          remainingMinutes: minutesLeft,
          remainingSegments: segmentsLeft,
          totalSegments: plan.totalSegments,
          risk,
          isDriving,
          vehicleId,
        },
      });
      if (interrupted) {
        return {
          ok: true,
          interrupted: true,
          segmentsTraveled: plan.totalSegments - segmentsLeft,
          totalSegments: plan.totalSegments,
        };
      }
    }
  }

  if (!store.state.player.alive) return { ok: false, died: true };
  const firstVisit = store.commit('world/visitNode', toId);
  codexManager.trackCareer('totalKmTraveled', km);
  const visitedCount = Object.values(store.state.world.nodes).filter((node) => node.visited).length;
  if (visitedCount >= 10) {
    codexManager.unlockAchievement('eurasian_nomad');
  }
  engine.log(
    firstVisit ? 'log.travel.discovered' : 'log.travel.arrived',
    { destination: locName(toId) },
    firstVisit ? 'good' : 'plain',
  );
  if (isDriving && vehicleId) {
    const vDef = VEHICLE_CATALOG[vehicleId];
    if (vDef?.fieldClinic && store.state.player && store.state.player.health < 100) {
      store.commit('player/changeVital', { vital: 'health', delta: 15 });
      engine.log('vehicle.log.field_clinic_healed', {}, 'good');
    }
  }
  if (firstVisit) {
    ctx.effects.apply([{ type: 'xp', skill: 'foraging', amount: 8 }], ctx);
  }

  // Check for derelict vehicle discovery upon arriving in sector
  const vehicleDiscoveredOnTravel = VehicleEngine.checkRandomDiscovery(store.state, rng, { nodeId: toId, source: 'travel' });
  if (vehicleDiscoveredOnTravel) {
    engine.bus.emit('vehicles:discovered', vehicleDiscoveredOnTravel);
  }

  return {
    ok: true,
    arrived: true,
    firstVisit,
  };
}

function registerMapActions(engine, ctx) {
  const { store, rng, effects } = ctx;

  engine.registerAction('map/select', ({ nodeId }) => {
    if (!ALL_NODES.some((node) => node.id === nodeId)) return { ok: false, reason: 'reject.unknown_node' };
    store.commit('world/selectNode', nodeId);
    return { ok: true };
  }, { allowDuringEncounter: true });

  engine.registerAction('map/travel', (payload) => {
    const toId = payload?.toId;
    const fromId = store.state.world.currentNodeId;
    if (fromId === toId) return { ok: false, reason: 'reject.already_here' };
    if (!findRoute(fromId, toId)) return { ok: false, reason: 'reject.no_route' };

    const plan = estimateJourney(store.state, fromId, toId);

    if (plan.isDriving) {
      const vehicle = store.state.vehicles?.fleet?.[plan.vehicleId];
      if (vehicle && vehicle.fuelLiters < plan.fuelNeeded) {
        engine.log('vehicle.log.no_fuel', {}, 'warn');
        return { ok: false, reason: 'reject.insufficient_fuel' };
      }
    } else if (store.state.vehicles?.mountedVehicleId && plan.mode === 'sea') {
      engine.log('vehicle.log.cannot_cross_water', {}, 'warn');
      return { ok: false, reason: 'reject.sea_cross' };
    }

    engine.log('log.travel.departed', {
      origin: locName(fromId),
      destination: locName(toId),
      km: plan.km,
    });

    const travelResult = runTravelSegments(ctx, {
      fromId,
      toId,
      mode: plan.mode,
      remainingMinutes: plan.minutes,
      remainingSegments: plan.segments,
      totalSegments: plan.segments,
      risk: plan.risk,
      isDriving: plan.isDriving,
      vehicleId: plan.vehicleId,
      fuelNeeded: plan.fuelNeeded,
      km: plan.km,
    });

    engine.bus.emit('travel:journey', {
      fromId,
      toId,
      plan,
      result: travelResult,
      skipAnimation: Boolean(payload?.skipAnimation),
    });

    return { ok: true, travelResult };
  });

  engine.registerAction('map/scavenge', () => {
    const nodeId = store.state.world.currentNodeId;
    const profile = scavengeProfile(store.state, nodeId);
    const country = profile.node?.country || '';
    const minutes = rollRange(rng, BALANCE.scavenge.minutes);

    engine.log('log.scavenge.started', { location: locName(nodeId), country });
    engine.advanceTime(minutes, 'scavenge');
    if (!store.state.player.alive) return { ok: true };

    store.commit('world/depleteNode', { nodeId, amount: BALANCE.scavenge.depletionPerSearch });

    const envMods = WeatherEngine.getStealthAndVisibilityModifiers(store.state);

    if (rng.chance(profile.chance)) {
      const foragingBonus = skillMultiplier(store.state, 'foraging');
      const scavBonus = passiveBonus(store.state, 'scavengeBonus') || 0;
      const items = rollScavengeLoot(rng, {
        node: profile.node,
        depletion: profile.depletion,
        foragingBonus,
        scavengeBonus: scavBonus,
        envEfficiency: envMods.scavengeEfficiency,
      });
      effects.apply([{ type: 'xp', skill: 'foraging', amount: 5 }], ctx);

      engine.log('log.scavenge.found', {
        location: locName(nodeId),
        country,
        count: items.reduce((acc, it) => acc + (it.qty || 1), 0),
      }, 'good');

      if (rng.chance(0.25)) {
        const dispatch = getRandomFieldLog(rng);
        const text = i18n.locale === 'tr' ? dispatch.text_tr : dispatch.text_en;
        engine.log('log.scavenge.field_log', { text });
      }
      engine.bus.emit('loot:modal', {
        type: 'scavenge',
        titleKey: 'loot.title.scavenge_found',
        descKey: 'loot.desc.scavenge_found',
        descParams: { location: locName(nodeId), country },
        items,
        nodeId,
        onConfirm: (taken, left) => {
          for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
          for (const { itemId, qty } of left) {
            store.commit('inventory/toGround', { nodeId, itemId, qty });
          }
        },
      });
    } else {
      engine.log('log.scavenge.empty', { location: locName(nodeId), country }, 'warn');
      effects.apply([{ type: 'xp', skill: 'foraging', amount: 2 }], ctx);
      engine.bus.emit('loot:modal', {
        type: 'scavenge_empty',
        titleKey: 'loot.title.scavenge_empty',
        descKey: 'loot.desc.scavenge_empty',
        descParams: { location: locName(nodeId), country },
        items: [],
        nodeId,
        onConfirm: () => {},
      });
    }

    if (store.state.player.alive && rng.chance(profile.hazardRisk * envMods.encounterRiskMultiplier)) {
      startEncounter(ctx, { context: 'scavenge', nodeId });
    }

    // Check for derelict vehicle discovery while scavenging
    const vehicleDiscoveredOnScavenge = VehicleEngine.checkRandomDiscovery(store.state, rng, { nodeId, source: 'scavenge' });
    if (vehicleDiscoveredOnScavenge) {
      engine.bus.emit('vehicles:discovered', vehicleDiscoveredOnScavenge);
    }

    return { ok: true };
  });

  engine.registerAction('map/survey', () => {
    const nodeId = store.state.world.currentNodeId;
    engine.advanceTime(BALANCE.survey.minutes, 'idle');
    if (!store.state.player.alive) return { ok: true };

    let newlyRevealed = 0;
    for (const edge of neighborsOf(nodeId)) {
      if (store.commit('world/revealNode', edge.to)) newlyRevealed += 1;
      for (const twoHop of neighborsOf(edge.to)) {
        if (rng.chance(BALANCE.survey.twoHopRumorChance) && store.commit('world/revealNode', twoHop.to)) {
          newlyRevealed += 1;
        }
      }
    }

    if (newlyRevealed > 0) {
      engine.log('log.survey.revealed', { count: newlyRevealed }, 'good');
      effects.apply([{ type: 'xp', skill: 'foraging', amount: 4 }], ctx);
      engine.bus.emit('loot:modal', {
        type: 'survey',
        titleKey: 'loot.title.survey_result',
        descKey: 'loot.desc.survey',
        descParams: { count: newlyRevealed },
        items: [],
        nodeId,
        onConfirm: () => {},
      });
    } else {
      engine.log('log.survey.nothing', { location: locName(nodeId) });
      engine.bus.emit('loot:modal', {
        type: 'survey',
        titleKey: 'loot.title.survey_result',
        descKey: 'loot.desc.survey_empty',
        descParams: { location: locName(nodeId) },
        items: [],
        nodeId,
        onConfirm: () => {},
      });
    }

    // Check for derelict vehicle discovery while surveying the area
    const vehicleDiscoveredOnSurvey = VehicleEngine.checkRandomDiscovery(store.state, rng, { nodeId, source: 'survey' });
    if (vehicleDiscoveredOnSurvey) {
      engine.bus.emit('vehicles:discovered', vehicleDiscoveredOnSurvey);
    }

    return { ok: true };
  });

  engine.registerAction('map/rest', ({ hours = 4 }) => {
    if (!BALANCE.rest.options.includes(hours)) return { ok: false, reason: 'reject.invalid_duration' };
    const nodeId = store.state.world.currentNodeId;
    const node = getNode(nodeId);

    engine.log('log.rest.started', { hours, location: locName(nodeId) });
    for (let hour = 0; hour < hours && store.state.player.alive; hour += 1) {
      engine.advanceTime(60, 'rest');
      if (!store.state.player.alive) return { ok: true };
      if (rng.chance(node.danger * BALANCE.rest.ambushChancePerDanger)) {
        if (startEncounter(ctx, { context: 'rest', nodeId })) return { ok: true };
      }
    }
    engine.log('log.rest.finished', { hours }, 'good');
    engine.bus.emit('loot:modal', {
      type: 'rest',
      titleKey: 'loot.title.rest_result',
      descKey: 'loot.desc.rest',
      descParams: { hours },
      items: [],
      nodeId,
      onConfirm: () => {},
    });
    return { ok: true };
  });

  engine.registerAction('map/requestAirdrop', () => {
    const nodeId = store.state.world.currentNodeId;
    adManager.showRewarded({
      name: 'emergency_supply_airdrop',
      onReward: ({ adSkipped } = {}) => {
        const supplies = [
          { itemId: 'canned_beans', qty: 2 },
          { itemId: 'bottled_water', qty: 2 },
          { itemId: 'bandage', qty: 2 },
        ];
        engine.log(adSkipped ? 'ad.log.reward_granted_vip' : 'ad.log.reward_granted', {}, 'good');
        engine.bus.emit('loot:modal', {
          type: 'airdrop',
          titleKey: 'ad.airdrop.title',
          descKey: 'ad.airdrop.desc',
          descParams: { location: locName(nodeId) },
          items: supplies,
          nodeId,
          onConfirm: (taken, left) => {
            for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
            for (const { itemId, qty } of left) {
              store.commit('inventory/toGround', { nodeId, itemId, qty });
            }
          },
        });
      },
      onDismiss: () => {
        engine.log('ad.log.dismissed', {}, 'warn');
      },
    });
    return { ok: true };
  });

  engine.registerAction('encounter/choose', ({ choiceId }) => {
    const active = store.state.world.encounter;
    if (!active) return { ok: false, reason: 'reject.no_encounter' };

    const def = ENCOUNTERS[active.id];
    const choice = def?.choices.find((entry) => entry.id === choiceId);
    if (!choice) return { ok: false, reason: 'reject.invalid_choice' };

    let outcomeKey = `encounter.${active.id}.outcome.${choiceId}`;
    let effectsToRun = choice.effects ?? [];
    let tone = 'plain';

    if (choice.check) {
      const chance = evaluateCheckChance(store.state, choice.check);
      consumeCombatAmmo(store, choice.check);
      const passed = rng.chance(chance);
      outcomeKey = `encounter.${active.id}.outcome.${choiceId}_${passed ? 'success' : 'failure'}`;
      effectsToRun = passed ? (choice.success ?? []) : (choice.failure ?? []);
      tone = passed ? 'good' : 'bad';
    }

    let abortedTravel = false;
    store.commit('world/clearEncounter');
    engine.log(outcomeKey, {}, tone);

    const filteredEffects = effectsToRun.filter((effect) => {
      if (effect.type === 'travel_abort') {
        abortedTravel = true;
        return false;
      }
      return true;
    });
    effects.apply(filteredEffects, ctx, { kind: 'encounter', id: active.id, choiceId });

    if (active.pendingTravel && store.state.player.alive) {
      if (abortedTravel) {
        engine.log('log.travel.aborted', { origin: locName(active.pendingTravel.fromId) }, 'warn');
      } else {
        runTravelSegments(ctx, active.pendingTravel);
      }
    }
    return { ok: true };
  }, { allowDuringEncounter: true });
}

function registerMapEffects(ctx) {
  const { effects, store, rng, engine } = ctx;

  effects.register('reveal', ({ count = 1 }) => {
    const unknown = ALL_NODES.filter((node) => !store.state.world.nodes[node.id]?.known);
    let revealed = 0;
    for (let i = 0; i < count && unknown.length > 0; i += 1) {
      const index = rng.int(0, unknown.length - 1);
      const [picked] = unknown.splice(index, 1);
      if (store.commit('world/revealNode', picked.id)) {
        revealed += 1;
        engine.log('log.survey.signal_node', { location: locName(picked.id) }, 'good');
      }
    }
    if (revealed === 0) engine.log('log.survey.nothing', { location: locName(store.state.world.currentNodeId) });
  });
}

export const mapModule = {
  id: 'world',
  createState: createInitialWorld,

  install(ctx) {
    registerMapMutations(ctx.store);
    registerMapActions(ctx.engine, ctx);
    registerMapEffects(ctx);

    ctx.engine.addGuard((type, options, state) => {
      if (state.world.encounter && !options.allowDuringEncounter) {
        return 'reject.in_encounter';
      }
      return null;
    });

    ctx.bus.on('time:tick', ({ hours }) => {
      ctx.store.commit('world/recoverDepletion', BALANCE.scavenge.depletionRecoveryPerHour * hours);
    });
  },
};

