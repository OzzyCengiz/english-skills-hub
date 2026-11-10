import { ENEMIES, getEnemy } from '../../data/enemies.js';
import { ref } from '../../i18n/i18n.js';
import { rollRange } from '../../core/rng.js';
import { combatRating, weaponProfile } from '../inventory/inventorySelectors.js';
import { grantItems } from '../inventory/index.js';
import { rollLoot } from '../inventory/loot.js';
import { getNode } from '../map/mapGraph.js';
import { skillLevel } from '../skills/skillSelectors.js';
import { applyBodyDamage } from '../status/bodyStatus.js';
import { audioEngine } from '../../core/audioEngine.js';
import { codexManager } from '../../core/codexManager.js';
import {
  COVER_LEVELS,
  TARGET_ZONES,
  getWeaponRangeProfile,
  initTacticalState,
  determineEnemyIntent,
  calculateTacticalHitChance,
  calculateTacticalDamage,
  checkWeaponJam,
  shiftRange,
} from './tacticalCombat.js';

const enemyName = (enemyId) => ref(`enemy.${enemyId}.name`);

export function pickEnemyForNode(rng, nodeId) {
  const node = getNode(nodeId);
  const pool = Object.entries(ENEMIES)
    .filter(([, def]) => {
      if (def.minDanger && node.danger < def.minDanger) return false;
      if (def.biomes && !def.biomes.includes(node.biome)) return false;
      return true;
    })
    .map(([id, def]) => ({ id, ...def }));

  if (pool.length === 0) return { id: 'feral_hound', ...ENEMIES.feral_hound };
  return rng.pick(pool);
}

function resolveEnemyTurn(ctx, enemyId) {
  const { store, rng, effects, engine } = ctx;
  const active = store.state.combat.activeEngagement;
  if (!active) return;

  // Surrendered or routed enemies take no hostile action
  if (active.enemyStatus?.surrendered || active.enemyStatus?.routed) {
    return;
  }

  const enemy = getEnemy(enemyId);

  // --- OVERWATCH REACTION CHECK ---
  if (active.stance === 'overwatch') {
    active.stance = null;
    const weapon = weaponProfile(store.state);
    const hitChance = calculateTacticalHitChance({
      state: store.state,
      weaponProfile: weapon,
      range: active.range,
      targetZone: TARGET_ZONES.TORSO,
      defenderCover: active.enemyCover,
      enemy,
      bonusAccuracy: 0.20,
    });

    if (rng.chance(hitChance)) {
      const dmgCalc = calculateTacticalDamage({
        baseRating: combatRating(store.state),
        weaponId: weapon.itemId,
        range: active.range,
        targetZone: TARGET_ZONES.TORSO,
        defenderCover: active.enemyCover,
        rng,
      });

      const remHp = store.commit('combat/damageEnemy', dmgCalc.damage);
      if (weapon.ammoId && weapon.loaded) {
        store.commit('inventory/remove', { itemId: weapon.ammoId, qty: 1 });
        const prof = getWeaponRangeProfile(weapon.itemId);
        audioEngine.playGunshot(prof.caliber || '9mm');
      } else {
        audioEngine.playGearRustle(0.6);
      }

      engine.log('combat.overwatch_triggered', {
        name: enemyName(enemyId),
        dmg: dmgCalc.damage,
      }, 'good');

      if (remHp <= 0) {
        audioEngine.playCombatVictory();
        store.commit('combat/end', { won: true });
        codexManager.trackCareer('totalEnemiesSlain', 1);
        codexManager.trackEnemyKill(active.enemyId);
        effects.apply([{ type: 'xp', skill: 'marksmanship', amount: enemy.xp }], ctx);
        const drops = rollLoot(rng, enemy.lootTable, 2);
        const nodeId = store.state.world.currentNodeId;
        engine.bus.emit('loot:modal', {
          type: 'combat_victory',
          titleKey: 'loot.title.combat_victory',
          descKey: 'loot.desc.combat_victory',
          descParams: { enemy: enemyName(active.enemyId), xp: enemy.xp },
          items: drops,
          nodeId,
          onConfirm: (taken, left) => {
            for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
            for (const { itemId, qty } of left) {
              store.commit('inventory/toGround', { nodeId, itemId, qty });
            }
          },
        });
        return;
      }
    } else {
      engine.log('combat.overwatch_missed', { name: enemyName(enemyId) }, 'warn');
    }
  }

  // --- SUPPRESSION CHECK ---
  if (active.enemyStatus?.suppressed) {
    active.enemyStatus.suppressed = false;
    active.lastEnemyAction = { type: 'suppressed' };
    engine.log('combat.enemy_suppressed_turn', { name: enemyName(enemyId) }, 'good');
    active.enemyIntent = determineEnemyIntent({
      enemy,
      range: active.range,
      enemyCover: active.enemyCover,
      enemyStatus: active.enemyStatus,
      rng,
    });
    return;
  }

  // 1. Tactical AI Repositioning
  // Melee-only enemies MUST close distance if player is at medium, long, or extreme
  if (!enemy.ranged && active.range !== 'melee') {
    if (active.enemyStatus?.fracturedLeg) {
      active.lastEnemyAction = { type: 'crippled' };
      engine.log('combat.enemy_crippled_cannot_advance', { name: enemyName(enemyId) }, 'good');
    } else {
      active.range = shiftRange(active.range, 'closer');
      active.lastEnemyAction = { type: 'advance', range: active.range };
      engine.log('combat.enemy_advanced', { name: enemyName(enemyId), range: ref(`combat.range.${active.range}`) }, 'warn');
      audioEngine.playGearRustle(0.4);
    }
    active.enemyIntent = determineEnemyIntent({
      enemy,
      range: active.range,
      enemyCover: active.enemyCover,
      enemyStatus: active.enemyStatus,
      rng,
    });
    return;
  }

  // Ranged enemy: 30% chance to seek light cover if taking fire in the open
  if (enemy.ranged && active.enemyCover === COVER_LEVELS.NONE && rng.chance(0.30)) {
    active.enemyCover = COVER_LEVELS.LIGHT;
    active.lastEnemyAction = { type: 'cover', cover: active.enemyCover };
    engine.log('combat.enemy_took_cover', { name: enemyName(enemyId) }, 'warn');
    audioEngine.playGearRustle(0.4);
    active.enemyIntent = determineEnemyIntent({
      enemy,
      range: active.range,
      enemyCover: active.enemyCover,
      enemyStatus: active.enemyStatus,
      rng,
    });
    return;
  }

  // 2. Tactical Accuracy & Cover Modifiers
  const foraging = skillLevel(store.state, 'foraging');
  let dodgeBonus = foraging * 0.02;

  // Player cover evasion bonus
  if (active.playerCover === COVER_LEVELS.LIGHT) dodgeBonus += 0.22;
  else if (active.playerCover === COVER_LEVELS.HEAVY) dodgeBonus += 0.42;

  // Enemy disarmed debuff
  let accuracyPenalty = 0;
  if (active.enemyStatus?.disarmed) accuracyPenalty += 0.35;
  if (active.enemyStatus?.fracturedLeg) accuracyPenalty += 0.15;

  const hitChance = Math.max(0.10, Math.min(0.90, enemy.accuracy - dodgeBonus - accuracyPenalty));

  if (!rng.chance(hitChance)) {
    active.lastEnemyAction = { type: 'miss' };
    engine.log('combat.enemy_missed', { name: enemyName(enemyId) }, 'good');
    active.enemyIntent = determineEnemyIntent({
      enemy,
      range: active.range,
      enemyCover: active.enemyCover,
      enemyStatus: active.enemyStatus,
      rng,
    });
    return;
  }

  // 3. Damage Resolution & Cover Absorption
  let dmg = rollRange(rng, enemy.damage);
  if (active.enemyStatus?.disarmed) dmg = Math.max(2, Math.round(dmg * 0.5));

  // Player cover absorbs physical trauma
  if (active.playerCover === COVER_LEVELS.LIGHT) dmg = Math.max(1, Math.round(dmg * 0.70));
  else if (active.playerCover === COVER_LEVELS.HEAVY) dmg = Math.max(1, Math.round(dmg * 0.40));

  active.lastEnemyAction = { type: 'hit', dmg, absorbed: active.playerCover !== COVER_LEVELS.NONE };
  engine.log('combat.enemy_hit', { name: enemyName(enemyId), dmg }, 'bad');

  if (enemy.ranged) {
    audioEngine.playGunshot('9mm', 0.65);
  } else {
    audioEngine.playGearRustle(0.4);
  }

  const combatEffects = [{
    type: 'damage',
    amount: dmg,
    cause: 'wounds',
    damageType: enemy.ranged ? 'ballistic' : (enemy.bleedChance ? 'slashing' : 'blunt'),
  }];
  if (enemy.bleedChance && rng.chance(enemy.bleedChance)) {
    combatEffects.push({ type: 'ailment', id: 'bleeding' });
  }
  if (enemy.infectChance && rng.chance(enemy.infectChance)) {
    combatEffects.push({ type: 'ailment', id: 'infection' });
  }
  effects.apply(combatEffects, ctx, { kind: 'combat', enemyId });

  // Critical health alarm pulse
  if (store.state.player?.health < 25) {
    audioEngine.setCriticalHeartbeat(true, 85);
  }

  active.enemyIntent = determineEnemyIntent({
    enemy,
    range: active.range,
    enemyCover: active.enemyCover,
    enemyStatus: active.enemyStatus,
    rng,
  });
}

export const combatModule = {
  id: 'combat',

  createState() {
    return { activeEngagement: null, victories: 0 };
  },

  install(ctx) {
    const { store, rng, effects, engine } = ctx;

    store.registerMutations('combat', {
      start(state, { enemyId, hp, tactical }) {
        state.combat.activeEngagement = {
          enemyId,
          hp,
          maxHp: hp,
          round: 1,
          scavenged: false,
          range: tactical.range,
          playerCover: tactical.playerCover,
          enemyCover: tactical.enemyCover,
          enemyMorale: tactical.enemyMorale,
          maxEnemyMorale: tactical.maxEnemyMorale,
          weaponJammed: tactical.weaponJammed,
          enemyStatus: { ...tactical.enemyStatus },
          stance: tactical.stance || null,
          aimBonus: tactical.aimBonus || false,
          enemyIntent: tactical.enemyIntent || null,
          lastPlayerAction: null,
          lastEnemyAction: null,
        };
      },
      damageEnemy(state, amount) {
        const active = state.combat.activeEngagement;
        if (!active) return 0;
        active.hp = Math.max(0, active.hp - amount);
        active.round += 1;
        return active.hp;
      },
      reduceMorale(state, amount) {
        const active = state.combat.activeEngagement;
        if (!active) return 0;
        active.enemyMorale = Math.max(0, active.enemyMorale - amount);
        return active.enemyMorale;
      },
      setRange(state, range) {
        if (state.combat.activeEngagement) {
          state.combat.activeEngagement.range = range;
          state.combat.activeEngagement.playerCover = COVER_LEVELS.NONE;
          state.combat.activeEngagement.round += 1;
        }
      },
      setPlayerCover(state, cover) {
        if (state.combat.activeEngagement) {
          state.combat.activeEngagement.playerCover = cover;
          state.combat.activeEngagement.round += 1;
        }
      },
      setWeaponJammed(state, jammed) {
        if (state.combat.activeEngagement) {
          state.combat.activeEngagement.weaponJammed = jammed;
        }
      },
      setEnemyStatusFlag(state, { flag, value }) {
        if (state.combat.activeEngagement?.enemyStatus) {
          state.combat.activeEngagement.enemyStatus[flag] = value;
        }
      },
      setStance(state, stance) {
        if (state.combat.activeEngagement) {
          state.combat.activeEngagement.stance = stance;
        }
      },
      setAimBonus(state, aimBonus) {
        if (state.combat.activeEngagement) {
          state.combat.activeEngagement.aimBonus = aimBonus;
        }
      },
      setEnemyIntent(state, intent) {
        if (state.combat.activeEngagement) {
          state.combat.activeEngagement.enemyIntent = intent;
        }
      },
      markScavenged(state) {
        if (state.combat.activeEngagement) {
          state.combat.activeEngagement.scavenged = true;
          state.combat.activeEngagement.round += 1;
        }
      },
      nextRound(state) {
        if (state.combat.activeEngagement) state.combat.activeEngagement.round += 1;
      },
      end(state, { won = false } = {}) {
        state.combat.activeEngagement = null;
        if (won) state.combat.victories = (state.combat.victories ?? 0) + 1;
        audioEngine.setCriticalHeartbeat(false);
      },
    });

    engine.addGuard((type, options, state) => {
      if (state.combat.activeEngagement && !options.allowDuringCombat && !options.allowDuringEncounter) {
        return 'reject.in_combat';
      }
      return null;
    });

    engine.registerAction('combat/patrol', () => {
      const nodeId = store.state.world.currentNodeId;
      const picked = pickEnemyForNode(rng, nodeId);
      const tactical = initTacticalState({
        enemy: picked,
        weather: store.state.environment?.currentWeather || 'clear_sky',
        rng,
      });

      store.commit('combat/start', { enemyId: picked.id, hp: picked.hp, tactical });
      engine.log('combat.enemy_appeared', { name: enemyName(picked.id) }, 'warn');
      engine.advanceTime(15, 'scavenge');
      return { ok: true };
    });

    engine.registerAction('combat/action', ({ move, zone = TARGET_ZONES.TORSO }) => {
      const active = store.state.combat.activeEngagement;
      if (!active) return { ok: false, reason: 'reject.no_combat' };

      const enemy = getEnemy(active.enemyId);
      const rating = combatRating(store.state);
      const weapon = weaponProfile(store.state);
      const weather = store.state.environment?.currentWeather || 'clear_sky';

      // --- ACTION A: SURRENDER RESOLUTIONS (SPARE vs EXECUTE) ---
      if (move === 'spare') {
        if (!active.enemyStatus?.surrendered) return { ok: false, reason: 'reject.not_surrendered' };
        store.commit('combat/end', { won: true });
        codexManager.trackCareer('totalEnemiesSpared', 1);
        codexManager.unlockAchievement('pacifist_mercy');
        engine.log('combat.enemy_spared', { name: enemyName(active.enemyId) }, 'good');
        effects.apply([
          { type: 'xp', skill: 'foraging', amount: Math.round(enemy.xp * 0.8) },
          { type: 'xp', skill: 'marksmanship', amount: Math.round(enemy.xp * 0.8) },
        ], ctx);

        // Peaceful disarm loot
        const drops = rollLoot(rng, enemy.lootTable, 2);
        const nodeId = store.state.world.currentNodeId;
        engine.bus.emit('loot:modal', {
          type: 'combat_victory',
          titleKey: 'loot.title.combat_disarm',
          descKey: 'loot.desc.combat_disarm',
          descParams: { enemy: enemyName(active.enemyId) },
          items: drops,
          nodeId,
          onConfirm: (taken, left) => {
            for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
            for (const { itemId, qty } of left) {
              store.commit('inventory/toGround', { nodeId, itemId, qty });
            }
          },
        });
        return { ok: true };
      }

      if (move === 'execute') {
        if (!active.enemyStatus?.surrendered) return { ok: false, reason: 'reject.not_surrendered' };
        audioEngine.playGunshot('9mm', 0.9);
        store.commit('combat/end', { won: true });
        engine.log('combat.enemy_executed', { name: enemyName(active.enemyId) }, 'bad');
        effects.apply([{ type: 'xp', skill: 'marksmanship', amount: enemy.xp }], ctx);

        const drops = rollLoot(rng, enemy.lootTable, 3);
        const nodeId = store.state.world.currentNodeId;
        engine.bus.emit('loot:modal', {
          type: 'combat_victory',
          titleKey: 'loot.title.combat_victory',
          descKey: 'loot.desc.combat_victory',
          descParams: { enemy: enemyName(active.enemyId), xp: enemy.xp },
          items: drops,
          nodeId,
          onConfirm: (taken, left) => {
            for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
            for (const { itemId, qty } of left) {
              store.commit('inventory/toGround', { nodeId, itemId, qty });
            }
          },
        });
        return { ok: true };
      }

      // --- ACTION B: TACTICAL REPOSITIONING & COVER ---
      if (move === 'advance') {
        const nextRange = shiftRange(active.range, 'closer');
        if (nextRange === active.range) return { ok: false, reason: 'reject.already_melee' };
        effects.apply([{ type: 'vital', vital: 'energy', amount: -2 }], ctx);
        store.commit('combat/setRange', nextRange);
        active.lastPlayerAction = { type: 'advance', range: nextRange };
        engine.log('combat.player_advanced', { range: ref(`combat.range.${nextRange}`) }, 'warn');
        audioEngine.playGearRustle(0.5);
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      if (move === 'retreat') {
        const nextRange = shiftRange(active.range, 'farther');
        if (nextRange === active.range) return { ok: false, reason: 'reject.max_range' };
        effects.apply([{ type: 'vital', vital: 'energy', amount: -2 }], ctx);
        store.commit('combat/setRange', nextRange);
        active.lastPlayerAction = { type: 'retreat', range: nextRange };
        engine.log('combat.player_retreated', { range: ref(`combat.range.${nextRange}`) }, 'warn');
        audioEngine.playGearRustle(0.5);
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      if (move === 'take_cover') {
        effects.apply([{ type: 'vital', vital: 'energy', amount: -1 }], ctx);
        const nextCover = active.playerCover === COVER_LEVELS.NONE ? COVER_LEVELS.LIGHT : COVER_LEVELS.HEAVY;
        store.commit('combat/setPlayerCover', nextCover);
        active.lastPlayerAction = { type: 'cover', cover: nextCover };
        engine.log('combat.player_took_cover', { cover: ref(`combat.cover.${nextCover}`) }, 'good');
        audioEngine.playGearRustle(0.6);
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      if (move === 'clear_jam') {
        if (!active.weaponJammed) return { ok: false, reason: 'reject.not_jammed' };
        effects.apply([{ type: 'vital', vital: 'energy', amount: -1 }], ctx);
        store.commit('combat/setWeaponJammed', false);
        active.lastPlayerAction = { type: 'clear_jam' };
        audioEngine.playTerminalClick(1.2, 0.6);
        engine.log('combat.jam_cleared', {}, 'good');
        store.commit('combat/nextRound');
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      // --- STANCES & ADVANCED MANEUVERS (OPTION B) ---
      if (move === 'overwatch') {
        effects.apply([{ type: 'vital', vital: 'energy', amount: -2 }], ctx);
        store.commit('combat/setStance', 'overwatch');
        active.lastPlayerAction = { type: 'overwatch' };
        audioEngine.playTerminalClick(1.2, 0.5);
        engine.log('combat.player_overwatch_set', {}, 'good');
        store.commit('combat/nextRound');
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      if (move === 'take_aim') {
        effects.apply([{ type: 'vital', vital: 'energy', amount: -1 }], ctx);
        store.commit('combat/setAimBonus', true);
        active.lastPlayerAction = { type: 'aim' };
        audioEngine.playGearRustle(0.5);
        engine.log('combat.player_aim_set', {}, 'good');
        store.commit('combat/nextRound');
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      if (move === 'suppress') {
        if (!weapon.ammoId) {
          return { ok: false, reason: 'reject.no_ammo' };
        }
        effects.apply([{ type: 'vital', vital: 'energy', amount: -3 }], ctx);
        const availableAmmo = store.state.inventory.stacks.find(s => s.itemId === weapon.ammoId)?.qty || 1;
        const ammoSpent = Math.min(2, availableAmmo);
        store.commit('inventory/remove', { itemId: weapon.ammoId, qty: ammoSpent });

        store.commit('combat/setEnemyStatusFlag', { flag: 'suppressed', value: true });
        const remainingMorale = store.commit('combat/reduceMorale', 25);
        active.lastPlayerAction = { type: 'suppress' };

        const rangeProf = getWeaponRangeProfile(weapon.itemId);
        audioEngine.playGunshot(rangeProf.caliber || '9mm', 0.85);

        engine.log('combat.player_suppression', { name: enemyName(active.enemyId) }, 'good');

        if (remainingMorale <= 20 && enemy.canSurrender) {
          store.commit('combat/setEnemyStatusFlag', { flag: 'surrendered', value: true });
          audioEngine.playWarningAlarm(440, 0.25, 0.5);
          engine.log('combat.enemy_surrendered', { name: enemyName(active.enemyId) }, 'warn');
          return { ok: true };
        }

        store.commit('combat/nextRound');
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      // --- ACTION C: FLEE & SCAVENGE ---
      if (move === 'flee') {
        // Being in cover or at extreme range makes escape significantly easier
        let coverBonus = 0;
        if (active.playerCover === COVER_LEVELS.LIGHT) coverBonus += 0.15;
        if (active.playerCover === COVER_LEVELS.HEAVY) coverBonus += 0.25;
        if (active.range === 'extreme' || active.range === 'long') coverBonus += 0.20;

        const escapeChance = Math.min(0.95, 0.50 + skillLevel(store.state, 'foraging') * 0.05 + coverBonus);
        effects.apply([{ type: 'vital', vital: 'energy', amount: -3 }], ctx);

        if (rng.chance(escapeChance)) {
          store.commit('combat/end', { won: false });
          engine.log('combat.fled_success', { name: enemyName(active.enemyId) }, 'warn');
          return { ok: true };
        }
        engine.log('combat.fled_failed', { name: enemyName(active.enemyId) }, 'bad');
        store.commit('combat/nextRound');
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      // --- ACTION D: VEHICLE RAMMING & SPEED AWAY ---
      if (move === 'vehicle_ram') {
        const vId = store.state.vehicles?.mountedVehicleId;
        const v = vId ? store.state.vehicles?.fleet?.[vId] : null;
        if (!v || !v.restored || v.fuelLiters < 0.8) {
          return { ok: false, reason: 'reject.no_fuel' };
        }
        store.commit('vehicles/consumeFuel', { vehicleId: vId, liters: 0.8 });
        store.commit('vehicles/degradeCondition', { vehicleId: vId, amount: 4 });
        audioEngine.playEngineRev();

        const ramDmg = rng.range(50, 85);
        const remHp = store.commit('combat/damageEnemy', ramDmg);
        engine.log('vehicle.log.ram_impact', { enemy: enemyName(active.enemyId), damage: ramDmg }, 'good');

        if (remHp <= 0) {
          audioEngine.playCombatVictory();
          store.commit('combat/end', { won: true });
          codexManager.trackCareer('totalEnemiesSlain', 1);
          codexManager.trackEnemyKill(active.enemyId);
          effects.apply([{ type: 'xp', skill: 'marksmanship', amount: enemy.xp }], ctx);
          const drops = rollLoot(rng, enemy.lootTable, 2);
          const nodeId = store.state.world.currentNodeId;
          engine.bus.emit('loot:modal', {
            type: 'combat_victory',
            titleKey: 'loot.title.combat_victory',
            descKey: 'loot.desc.combat_victory',
            descParams: { enemy: enemyName(active.enemyId), xp: enemy.xp },
            items: drops,
            nodeId,
            onConfirm: (taken, left) => {
              for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
              for (const { itemId, qty } of left) {
                store.commit('inventory/toGround', { nodeId, itemId, qty });
              }
            },
          });
          return { ok: true, ramDmg };
        }
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true, ramDmg };
      }

      if (move === 'vehicle_escape') {
        const vId = store.state.vehicles?.mountedVehicleId;
        const v = vId ? store.state.vehicles?.fleet?.[vId] : null;
        if (!v || !v.restored || v.fuelLiters < 1.0) {
          return { ok: false, reason: 'reject.no_fuel' };
        }
        store.commit('vehicles/consumeFuel', { vehicleId: vId, liters: 1.0 });
        audioEngine.playEngineRev();
        store.commit('combat/end', { won: false });
        engine.log('vehicle.log.escaped_in_vehicle', { name: enemyName(active.enemyId) }, 'good');
        return { ok: true };
      }

      if (move === 'scavenge') {
        if (active.scavenged) return { ok: false, reason: 'reject.already_scavenged' };
        store.commit('combat/markScavenged');
        const loot = rollLoot(rng, enemy.lootTable, 1);
        effects.apply([
          { type: 'xp', skill: 'foraging', amount: 6 },
          { type: 'vital', vital: 'energy', amount: -2 },
        ], ctx);
        const nodeId = store.state.world.currentNodeId;
        engine.bus.emit('loot:modal', {
          type: 'combat_scavenge',
          titleKey: 'loot.title.combat_scavenge',
          descKey: 'loot.desc.combat_scavenge',
          descParams: {},
          items: loot,
          nodeId,
          onConfirm: (taken, left) => {
            for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
            for (const { itemId, qty } of left) {
              store.commit('inventory/toGround', { nodeId, itemId, qty });
            }
          },
        });
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      // --- ACTION D: TACTICAL FIRE / TARGETED STRIKE ---
      if (active.weaponJammed) {
        audioEngine.playTerminalClick(0.3, 0.7); // Dry click
        engine.log('combat.weapon_is_jammed_prompt', {}, 'bad');
        return { ok: false, reason: 'reject.weapon_jammed' };
      }

      const targetZone = zone || TARGET_ZONES.TORSO;

      // Consume ammunition if weapon is a firearm
      if (weapon.ammoId && weapon.loaded) {
        store.commit('inventory/remove', { itemId: weapon.ammoId, qty: 1 });
      }

      // Check for firearm mechanical jam
      if (checkWeaponJam({ weaponId: weapon.itemId, weather, rng })) {
        store.commit('combat/setWeaponJammed', true);
        audioEngine.playTerminalClick(0.3, 0.7);
        engine.log('combat.weapon_jammed', { weapon: weapon.itemId ? ref(`item.${weapon.itemId}.name`) : '' }, 'bad');
        store.commit('combat/nextRound');
        resolveEnemyTurn(ctx, active.enemyId);
        return { ok: true };
      }

      // Stamina expenditure
      effects.apply([{ type: 'vital', vital: 'energy', amount: targetZone === TARGET_ZONES.HEAD ? -2 : -1 }], ctx);

      // Audio feedback
      if (weapon.ammoId) {
        const rangeProf = getWeaponRangeProfile(weapon.itemId);
        audioEngine.playGunshot(rangeProf.caliber || '9mm');
      } else {
        audioEngine.playTerminalClick(0.7, 0.4);
      }

      // Calculate Tactical Hit Chance
      const hitChance = calculateTacticalHitChance({
        state: store.state,
        weaponProfile: weapon,
        range: active.range,
        targetZone,
        defenderCover: active.enemyCover,
        enemy,
        weather,
        aimBonus: active.aimBonus,
      });

      const usedAimBonus = active.aimBonus;
      store.commit('combat/setAimBonus', false);
      store.commit('combat/setStance', null);

      if (rng.chance(hitChance)) {
        const { damage, isCritical, statusEffect } = calculateTacticalDamage({
          baseRating: rating,
          weaponId: weapon.itemId,
          range: active.range,
          targetZone,
          defenderCover: active.enemyCover,
          aimBonus: usedAimBonus,
          rng,
        });

        const remainingHp = store.commit('combat/damageEnemy', damage);
        active.lastPlayerAction = { type: 'attack', hit: true, dmg: damage, isCritical, zone: targetZone };

        // Targeted zone notifications
        if (isCritical) {
          engine.log('combat.headshot_crit', { name: enemyName(active.enemyId), dmg: damage }, 'good');
        } else if (statusEffect === 'fractured_leg') {
          store.commit('combat/setEnemyStatusFlag', { flag: 'fracturedLeg', value: true });
          engine.log('combat.leg_fractured', { name: enemyName(active.enemyId), dmg: damage }, 'good');
        } else if (statusEffect === 'disarm') {
          store.commit('combat/setEnemyStatusFlag', { flag: 'disarmed', value: true });
          engine.log('combat.arm_disarmed', { name: enemyName(active.enemyId), dmg: damage }, 'good');
        } else {
          engine.log('combat.player_hit', { name: enemyName(active.enemyId), dmg: damage }, 'good');
        }

        // Enemy Morale Check
        let moraleLoss = 12;
        if (isCritical) moraleLoss += 25;
        if (statusEffect === 'fractured_leg' || statusEffect === 'disarm') moraleLoss += 15;
        if (remainingHp <= active.maxHp * 0.35) moraleLoss += 20;

        const currentMorale = store.commit('combat/reduceMorale', moraleLoss);

        // Surrender or Routing resolution
        if (remainingHp > 0 && currentMorale <= 20) {
          if (enemy.canSurrender) {
            store.commit('combat/setEnemyStatusFlag', { flag: 'surrendered', value: true });
            audioEngine.playWarningAlarm(440, 0.25, 0.5);
            engine.log('combat.enemy_surrendered', { name: enemyName(active.enemyId) }, 'warn');
            return { ok: true };
          } else if (enemy.morale !== 100) {
            // Beasts with broken morale route and flee
            store.commit('combat/setEnemyStatusFlag', { flag: 'routed', value: true });
            store.commit('combat/end', { won: true });
            engine.log('combat.enemy_routed', { name: enemyName(active.enemyId) }, 'good');
            effects.apply([{ type: 'xp', skill: 'foraging', amount: Math.round(enemy.xp * 0.6) }], ctx);
            return { ok: true };
          }
        }

        // Victory
        if (remainingHp <= 0) {
          store.commit('combat/end', { won: true });
          codexManager.trackCareer('totalEnemiesDefeated', 1);
          codexManager.unlockAchievement('first_blood');
          if (isCritical && targetZone === TARGET_ZONES.HEAD) {
            codexManager.unlockAchievement('sniper_doctrine');
          }
          engine.log('combat.victory', { name: enemyName(active.enemyId) }, 'good');
          const drops = rollLoot(rng, enemy.lootTable, rng.int(1, 2));
          effects.apply([{ type: 'xp', skill: 'marksmanship', amount: enemy.xp }], ctx);
          const nodeId = store.state.world.currentNodeId;
          engine.bus.emit('loot:modal', {
            type: 'combat_victory',
            titleKey: 'loot.title.combat_victory',
            descKey: 'loot.desc.combat_victory',
            descParams: { enemy: enemyName(active.enemyId), xp: enemy.xp },
            items: drops,
            nodeId,
            onConfirm: (taken, left) => {
              for (const { itemId, qty } of taken) grantItems(ctx, itemId, qty);
              for (const { itemId, qty } of left) {
                store.commit('inventory/toGround', { nodeId, itemId, qty });
              }
            },
          });
          return { ok: true };
        }
      } else {
        active.lastPlayerAction = { type: 'attack', hit: false, zone: targetZone };
        store.commit('combat/nextRound');
        engine.log('combat.player_missed', { name: enemyName(active.enemyId) }, 'warn');
      }

      resolveEnemyTurn(ctx, active.enemyId);
      return { ok: true };
    }, { allowDuringCombat: true });
  },
};
