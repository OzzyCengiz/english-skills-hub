/**
 * Last Breath // Tactical Combat 2.0 Engine
 * Governing range bands, physical cover, targeted anatomical shots,
 * weapon ballistic profiles, weapon jamming, and dynamic enemy morale/surrender.
 */

import { getItem } from '../../data/items.js';
import { skillLevel } from '../skills/skillSelectors.js';
import { getBodyDebuffs } from '../status/bodyStatus.js';

export const RANGE_BANDS = ['melee', 'close', 'medium', 'long', 'extreme'];

export const RANGE_METERS = {
  melee: '< 5m',
  close: '15m',
  medium: '40m',
  long: '85m',
  extreme: '150m',
};

export const COVER_LEVELS = {
  NONE: 'none',
  LIGHT: 'light',   // Car door, wooden crate, foliage: +20% evasion, -30% damage
  HEAVY: 'heavy',   // Concrete barrier, bunker trench, brick wall: +40% evasion, -60% damage
};

export const TARGET_ZONES = {
  HEAD: 'head',
  TORSO: 'torso',
  ARMS: 'arms',
  LEGS: 'legs',
};

/**
 * Infers ballistic range profile and optimal combat distances from a weapon item ID.
 */
export function getWeaponRangeProfile(weaponId) {
  if (!weaponId) {
    return {
      type: 'unarmed',
      isFirearm: false,
      optimal: ['melee'],
      usable: ['melee'],
      caliber: null,
      jamRate: 0,
    };
  }

  const id = weaponId.toLowerCase();
  const item = getItem(weaponId);
  const ammo = item?.equip?.ammo;
  const isFirearm = Boolean(ammo);

  // Precision Rifles / Snipers
  if (id.includes('sniper') || id.includes('scoped') || id.includes('svd') || id.includes('mosin')) {
    return {
      type: 'sniper',
      isFirearm: true,
      optimal: ['long', 'extreme'],
      usable: ['medium', 'long', 'extreme'],
      caliber: '7.62',
      jamRate: 0.04,
    };
  }

  // Assault Rifles / Battle Rifles
  if (id.includes('rifle') || id.includes('ak47') || id.includes('m4') || id.includes('g3') || id.includes('carbine')) {
    return {
      type: 'rifle',
      isFirearm: true,
      optimal: ['medium', 'long'],
      usable: ['close', 'medium', 'long', 'extreme'],
      caliber: '5.56',
      jamRate: 0.05,
    };
  }

  // Shotguns
  if (id.includes('shotgun') || id.includes('remington') || id.includes('toz') || id.includes('12_gauge') || id.includes('pump')) {
    return {
      type: 'shotgun',
      isFirearm: true,
      optimal: ['close'],
      usable: ['melee', 'close', 'medium'],
      caliber: '12gauge',
      jamRate: 0.06,
    };
  }

  // Pistols / Submachine Guns / Revolvers
  if (id.includes('pistol') || id.includes('smg') || id.includes('mp5') || id.includes('makarov') || id.includes('glock') || id.includes('revolver')) {
    return {
      type: 'pistol',
      isFirearm: true,
      optimal: ['close', 'medium'],
      usable: ['melee', 'close', 'medium'],
      caliber: '9mm',
      jamRate: 0.05,
    };
  }

  // Bows & Crossbows
  if (id.includes('bow') || id.includes('crossbow')) {
    return {
      type: 'archery',
      isFirearm: false,
      optimal: ['medium', 'long'],
      usable: ['close', 'medium', 'long'],
      caliber: 'arrow',
      jamRate: 0.02,
    };
  }

  // Melee weapons (Blades, Bludgeons, Axes, Spears)
  return {
    type: 'melee',
    isFirearm: false,
    optimal: ['melee'],
    usable: id.includes('spear') ? ['melee', 'close'] : ['melee'],
    caliber: null,
    jamRate: 0,
  };
}

/**
 * Determines enemy's telegraphed combat intent for the upcoming round.
 */
export function determineEnemyIntent({ enemy, range, enemyCover, enemyStatus, rng }) {
  if (enemyStatus?.surrendered || enemyStatus?.routed) {
    return { type: 'surrendered', key: 'combat.intent.surrendered' };
  }
  if (enemyStatus?.suppressed) {
    return { type: 'suppressed', key: 'combat.intent.suppressed' };
  }
  // Melee enemy at distance MUST advance
  if (!enemy.ranged && range !== 'melee') {
    if (enemyStatus?.fracturedLeg) {
      return { type: 'crippled', key: 'combat.intent.crippled' };
    }
    return { type: 'advance', key: 'combat.intent.advance' };
  }
  // Ranged enemy in open might seek cover
  if (enemy.ranged && enemyCover === COVER_LEVELS.NONE && rng && rng.chance(0.35)) {
    return { type: 'take_cover', key: 'combat.intent.take_cover' };
  }
  // Ranged enemy aiming heavy shot
  if (enemy.ranged) {
    if (rng && rng.chance(0.35)) {
      return { type: 'heavy_shot', key: 'combat.intent.heavy_shot' };
    }
    return { type: 'shoot', key: 'combat.intent.shoot' };
  }
  // Melee in melee range: strike or vicious lunge
  if (rng && rng.chance(0.35)) {
    return { type: 'vicious_strike', key: 'combat.intent.vicious_strike' };
  }
  return { type: 'attack', key: 'combat.intent.attack' };
}

/**
 * Initializes a tactical engagement with range, cover, and morale parameters.
 */
export function initTacticalState({ enemy, weather = 'clear_sky', rng }) {
  // Determine starting range band based on enemy archetype & atmospheric visibility
  let startingRange = 'medium';
  if (enemy.preferredRange) {
    startingRange = enemy.preferredRange;
  } else if (!enemy.ranged) {
    startingRange = rng ? rng.pick(['close', 'melee']) : 'close';
  } else {
    startingRange = rng ? rng.pick(['medium', 'long']) : 'medium';
  }

  // Fog or night closes the initial engagement distance
  if (weather === 'radiation_ash_fog' && startingRange === 'long') {
    startingRange = 'medium';
  }

  const initialMorale = enemy.morale ?? (enemy.canSurrender === false ? 100 : 70);
  const enemyCover = rng && rng.chance(0.25) && enemy.ranged ? COVER_LEVELS.LIGHT : COVER_LEVELS.NONE;
  const enemyStatus = {
    fracturedLeg: false,
    disarmed: false,
    suppressed: false,
    surrendered: false,
    routed: false,
  };

  return {
    range: startingRange,
    playerCover: COVER_LEVELS.NONE,
    enemyCover,
    enemyMorale: initialMorale,
    maxEnemyMorale: initialMorale,
    weaponJammed: false,
    enemyStatus,
    stance: null, // 'overwatch' | null
    aimBonus: false,
    enemyIntent: determineEnemyIntent({ enemy, range: startingRange, enemyCover, enemyStatus, rng }),
  };
}

/**
 * Calculates hit probability accounting for weapon range efficiency, target zone penalty,
 * defender cover evasion, environmental visibility, and active aim bonus.
 */
export function calculateTacticalHitChance({
  state,
  weaponProfile,
  range,
  targetZone = TARGET_ZONES.TORSO,
  defenderCover = COVER_LEVELS.NONE,
  enemy,
  weather = 'clear_sky',
  aimBonus = false,
  bonusAccuracy = 0,
}) {
  const rangeProf = getWeaponRangeProfile(weaponProfile?.itemId);
  const marksmanship = skillLevel(state, 'marksmanship');
  const debuffs = getBodyDebuffs(state?.player?.body);

  // Baseline accuracy (aim bonus grants +0.25)
  let baseAccuracy = 0.78 + marksmanship * 0.025 - debuffs.weaponAccuracyPenalty + bonusAccuracy;
  if (aimBonus) {
    baseAccuracy += 0.25;
  }

  // Range penalty/bonus
  if (rangeProf.optimal.includes(range)) {
    baseAccuracy += 0.08;
  } else if (rangeProf.usable.includes(range)) {
    baseAccuracy -= 0.12;
  } else {
    // Outside effective weapon range: severe penalty (e.g. throwing knife at long range)
    baseAccuracy -= 0.45;
  }

  // Target Zone difficulty
  switch (targetZone) {
    case TARGET_ZONES.HEAD:
      baseAccuracy -= 0.30; // Small, lethal target
      break;
    case TARGET_ZONES.ARMS:
      baseAccuracy -= 0.16; // Moving target
      break;
    case TARGET_ZONES.LEGS:
      baseAccuracy -= 0.14; // Lower target
      break;
    case TARGET_ZONES.TORSO:
    default:
      baseAccuracy += 0.02; // Center of mass
      break;
  }

  // Defender Cover Evasion
  let coverEvasion = 0;
  if (defenderCover === COVER_LEVELS.LIGHT) coverEvasion = 0.22;
  else if (defenderCover === COVER_LEVELS.HEAVY) coverEvasion = 0.42;

  // Enemy intrinsic evasion & leg status
  let enemyEvasion = enemy.evasion || 0.1;
  if (enemy.status?.fracturedLeg) {
    enemyEvasion = Math.max(0.02, enemyEvasion - 0.20); // Crippled leg impairs dodging
  }

  // Weather penalty for ranged fire
  let envPenalty = 0;
  if (['radiation_ash_fog', 'gale_windstorm'].includes(weather) && range !== 'melee') {
    envPenalty = 0.18;
  }

  const finalChance = baseAccuracy - coverEvasion - enemyEvasion - envPenalty;
  return Math.max(0.12, Math.min(0.95, finalChance));
}

/**
 * Calculates damage dealt and tactical status effects on the target zone.
 */
export function calculateTacticalDamage({
  baseRating,
  weaponId,
  range,
  targetZone = TARGET_ZONES.TORSO,
  defenderCover = COVER_LEVELS.NONE,
  aimBonus = false,
  rng,
}) {
  const rangeProf = getWeaponRangeProfile(weaponId);
  let damage = baseRating * 2.2 + (rng ? rng.int(2, 6) : 3);

  // If player took aim, apply +50% precision strike damage bonus
  if (aimBonus) {
    damage *= 1.5;
  }

  // Range efficiency damage adjustments
  if (rangeProf.type === 'shotgun') {
    if (range === 'melee' || range === 'close') damage *= 1.35; // devastating point-blank buckshot
    else if (range === 'medium') damage *= 0.85;
    else damage *= 0.35; // pellet spread drops off
  } else if (rangeProf.type === 'melee' && range !== 'melee') {
    damage *= 0.50; // desperate lunge
  }

  // Target Zone Multipliers
  let isCritical = Boolean(aimBonus);
  let statusEffect = null;

  switch (targetZone) {
    case TARGET_ZONES.HEAD:
      damage *= 2.4; // Devastating cranial trauma
      isCritical = true;
      statusEffect = 'cranial_shock';
      break;
    case TARGET_ZONES.ARMS:
      damage *= 0.75;
      statusEffect = 'disarm';
      break;
    case TARGET_ZONES.LEGS:
      damage *= 0.80;
      statusEffect = 'fractured_leg';
      break;
    case TARGET_ZONES.TORSO:
    default:
      damage *= 1.0;
      statusEffect = 'arterial_bleed';
      break;
  }

  // Defender Cover Damage Absorption
  if (defenderCover === COVER_LEVELS.LIGHT) damage *= 0.70;
  else if (defenderCover === COVER_LEVELS.HEAVY) damage *= 0.40;

  return {
    damage: Math.max(1, Math.round(damage)),
    isCritical,
    statusEffect,
  };
}

/**
 * Checks if a firearm weapon jams during a shot.
 */
export function checkWeaponJam({ weaponId, weather = 'clear_sky', rng }) {
  const prof = getWeaponRangeProfile(weaponId);
  if (!prof.isFirearm) return false;

  let jamChance = prof.jamRate;
  if (weather === 'corrosive_acid_rain') jamChance += 0.06;
  if (weather === 'radiation_ash_fog') jamChance += 0.04;

  return rng ? rng.chance(jamChance) : Math.random() < jamChance;
}

/**
 * Shifts range band closer or farther.
 */
export function shiftRange(currentRange, direction = 'closer') {
  const index = RANGE_BANDS.indexOf(currentRange);
  if (index === -1) return 'medium';

  if (direction === 'closer') {
    return RANGE_BANDS[Math.max(0, index - 1)];
  }
  return RANGE_BANDS[Math.min(RANGE_BANDS.length - 1, index + 1)];
}

