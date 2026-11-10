/**
 * Last Breath // Targeted Body Trauma & Anatomical Status Engine
 * Zero-dependency Vanilla JS module replacing flat hit points
 * with realistic multi-part trauma, arterial hemodynamics, and targeted treatments.
 */

export const BODY_PARTS = ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

export const BLEED_LEVELS = {
  NONE: 'none',
  MINOR: 'minor',
  ARTERIAL: 'arterial',
};

// EventBus event channel names
export const EVENT_BODY_UPDATED = 'body:updated';
export const EVENT_BLEEDING_ALERT = 'body:bleeding_alert';
export const EVENT_FRACTURE_ALERT = 'body:fracture_alert';
export const EVENT_PNEUMOTHORAX_ALERT = 'body:pneumothorax_alert';
export const EVENT_INFECTION_ALERT = 'body:infection_alert';

// Hourly blood loss rates in absolute HP
export const BLEED_RATES_PER_HOUR = {
  none: 0,
  minor: 1.5,
  arterial: 14.0, // High-speed pulsatile loss leading to rapid shock
};

// Anatomical hit probability distribution when target part is unspecified
export const DEFAULT_HIT_WEIGHTS = {
  torso: 0.38,
  leftLeg: 0.16,
  rightLeg: 0.16,
  leftArm: 0.12,
  rightArm: 0.12,
  head: 0.06,
};

// Weight of each part in computing overall body integrity (0..100)
export const VITAL_PART_WEIGHTS = {
  head: 0.25,
  torso: 0.35,
  leftArm: 0.10,
  rightArm: 0.10,
  leftLeg: 0.10,
  rightLeg: 0.10,
};

/**
 * Creates default state for a single anatomical part.
 */
export function createDefaultBodyPart() {
  return {
    health: 100,
    bleeding: BLEED_LEVELS.NONE,
    fractures: false,
    burns: false,
    infectionRisk: 0, // 0 to 100
    punctured: false, // Tension pneumothorax flag for torso / deep puncture
  };
}

/**
 * Creates default complete body trauma state.
 */
export function createDefaultBodyState() {
  return {
    head: createDefaultBodyPart(),
    torso: createDefaultBodyPart(),
    leftArm: createDefaultBodyPart(),
    rightArm: createDefaultBodyPart(),
    leftLeg: createDefaultBodyPart(),
    rightLeg: createDefaultBodyPart(),
  };
}

/**
 * Checks if a body part is a limb (compatible with windlass tourniquets and splints).
 */
export function isLimb(partName) {
  return ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'].includes(partName);
}

/**
 * Applies targeted physical trauma to a specific or weighted body part.
 * Emits specific EventBus alerts when arterial bleeds, fractures, or pneumothorax occur.
 */
export function applyBodyDamage(bodyState, {
  part = null,
  amount = 10,
  damageType = 'blunt', // 'blunt', 'ballistic', 'slashing', 'puncture', 'burn', 'blast'
  puncture = false,
  fractureChance = 0,
  arterialChance = 0,
  rng = null,
  bus = null,
} = {}) {
  const current = bodyState || createDefaultBodyState();

  // Select target part
  let targetPart = part;
  if (!targetPart || !BODY_PARTS.includes(targetPart)) {
    if (rng && typeof rng.weighted === 'function') {
      const pool = Object.entries(DEFAULT_HIT_WEIGHTS).map(([k, w]) => ({ part: k, weight: w }));
      targetPart = rng.weighted(pool, (entry) => entry.weight).part;
    } else {
      targetPart = 'torso';
    }
  }

  const p = current[targetPart] || (current[targetPart] = createDefaultBodyPart());
  const beforeHealth = p.health;
  p.health = Math.max(0, Math.min(100, p.health - amount));

  const alerts = [];

  // Ballistic, slashing, or puncture wounds trigger bleeding
  const isPenetrating = ['ballistic', 'slashing', 'puncture', 'blast'].includes(damageType);
  if (isPenetrating && amount > 4) {
    const defaultArterial = damageType === 'ballistic' ? 0.25 : (damageType === 'puncture' ? 0.20 : 0.12);
    const calcArterialChance = arterialChance || defaultArterial;
    const isArterial = rng ? rng.chance(calcArterialChance) : (Math.random() < calcArterialChance);

    if (isArterial && p.bleeding !== BLEED_LEVELS.ARTERIAL) {
      p.bleeding = BLEED_LEVELS.ARTERIAL;
      alerts.push({ type: EVENT_BLEEDING_ALERT, part: targetPart, level: BLEED_LEVELS.ARTERIAL });
      if (bus) bus.emit(EVENT_BLEEDING_ALERT, { part: targetPart, level: BLEED_LEVELS.ARTERIAL });
    } else if (p.bleeding === BLEED_LEVELS.NONE) {
      p.bleeding = BLEED_LEVELS.MINOR;
      alerts.push({ type: EVENT_BLEEDING_ALERT, part: targetPart, level: BLEED_LEVELS.MINOR });
      if (bus) bus.emit(EVENT_BLEEDING_ALERT, { part: targetPart, level: BLEED_LEVELS.MINOR });
    }

    // Dirt/particulate in wound raises infection risk
    p.infectionRisk = Math.min(100, p.infectionRisk + Math.round(amount * 0.6));
  }

  // Torso tension pneumothorax risk
  if (targetPart === 'torso' && (puncture || damageType === 'puncture' || (damageType === 'ballistic' && amount >= 18))) {
    if (!p.punctured) {
      p.punctured = true;
      alerts.push({ type: EVENT_PNEUMOTHORAX_ALERT, part: 'torso' });
      if (bus) bus.emit(EVENT_PNEUMOTHORAX_ALERT, { part: 'torso' });
    }
  }

  // Fracture check on limbs/head
  const isBluntOrBlast = ['blunt', 'blast'].includes(damageType);
  const calcFractureChance = fractureChance || (isBluntOrBlast && amount >= 15 ? 0.45 : (amount >= 28 ? 0.35 : 0));
  if (!p.fractures && calcFractureChance > 0) {
    const fractured = rng ? rng.chance(calcFractureChance) : (Math.random() < calcFractureChance);
    if (fractured) {
      p.fractures = true;
      alerts.push({ type: EVENT_FRACTURE_ALERT, part: targetPart });
      if (bus) bus.emit(EVENT_FRACTURE_ALERT, { part: targetPart });
    }
  }

  // Thermal burns
  if (damageType === 'burn') {
    p.burns = true;
    p.infectionRisk = Math.min(100, p.infectionRisk + 30);
  }

  if (bus) {
    bus.emit(EVENT_BODY_UPDATED, { part: targetPart, bodyState: current, alerts });
  }

  return {
    targetPart,
    damageDealt: beforeHealth - p.health,
    partState: { ...p },
    alerts,
  };
}

/**
 * Resolves medical item application to a specific body part.
 * Returns { success: boolean, reasonKey: string, effectDesc: string }
 */
export function applyMedicalTreatment(bodyState, itemId = '', targetPart = 'torso', { bus = null } = {}) {
  if (!bodyState || !bodyState[targetPart]) {
    return { success: false, reasonKey: 'invalid_part' };
  }
  if (!itemId || typeof itemId !== 'string') {
    return { success: false, reasonKey: 'invalid_item' };
  }

  const part = bodyState[targetPart];
  let treated = false;
  let actionDesc = '';

  // 1. Tourniquets (CAT / SOFFT-T)
  if (itemId === 'combat_tourniquet_cat' || itemId === 'softt_wide_tourniquet' || itemId.includes('tourniquet')) {
    if (!isLimb(targetPart)) {
      return { success: false, reasonKey: 'tourniquet_requires_limb' };
    }
    if (part.bleeding === BLEED_LEVELS.NONE) {
      return { success: false, reasonKey: 'no_active_bleed' };
    }
    const wasArterial = part.bleeding === BLEED_LEVELS.ARTERIAL;
    part.bleeding = BLEED_LEVELS.NONE;
    treated = true;
    actionDesc = wasArterial
      ? 'Turnike sıkıldı: Şiddetli atardamar kanaması derhal durduruldu.'
      : 'Turnike uygulandı: Uzuvdaki kanama tamamen kesildi.';
  }

  // 2. Hemostatic Combat Gauze / QuikClot / Israeli Pressure Dressings
  else if (
    itemId === 'quikclot_hemostatic_gauze' ||
    itemId === 'hemostatic_gauze_z_fold' ||
    itemId === 'emergency_israeli_bandage' ||
    itemId === 'pressure_dressing_trauma_4in'
  ) {
    if (part.bleeding === BLEED_LEVELS.NONE && part.health >= 100) {
      return { success: false, reasonKey: 'no_bleeding_wound' };
    }
    if (part.bleeding === BLEED_LEVELS.ARTERIAL) {
      part.bleeding = BLEED_LEVELS.MINOR; // Demotes arterial to manageable minor bleed
      actionDesc = 'Hemostatik kaolin sargı yaraya tamponlandı: Atardamar fışkırması durduruldu, kanama hafifledi.';
    } else {
      part.bleeding = BLEED_LEVELS.NONE;
      actionDesc = 'Basınçlı travma sargısı sarıldı: Kanama başarıyla durduruldu.';
    }
    part.health = Math.min(100, part.health + 12);
    part.infectionRisk = Math.max(0, part.infectionRisk - 25);
    treated = true;
  }

  // 3. Vented Chest Seals / Decompression Needles / Nasopharyngeal Airway (Pneumothorax / Torso Puncture)
  else if (
    itemId === 'chest_seal_vented' ||
    itemId === 'chest_seal_twin_pack' ||
    itemId === 'decompression_needle_14g' ||
    itemId === 'nasopharyngeal_airway_28fr'
  ) {
    if (targetPart !== 'torso') {
      return { success: false, reasonKey: 'chest_seal_requires_torso' };
    }
    if (!part.punctured && part.bleeding === BLEED_LEVELS.NONE && part.health >= 100) {
      return { success: false, reasonKey: 'no_chest_puncture' };
    }
    part.punctured = false;
    if (part.bleeding === BLEED_LEVELS.MINOR) part.bleeding = BLEED_LEVELS.NONE;
    part.health = Math.min(100, part.health + 18);
    treated = true;
    actionDesc = itemId.includes('needle')
      ? '14G dekompresyon iğnesiyle 2. kaburgalar arası boşluk delindi: Plevral hava boşaltıldı, akciğer rahatlatıldı.'
      : (itemId.includes('airway')
        ? 'Nazofaringeal hava yolu yerleştirildi: Solunum kanalı açıldı ve nefes alış normale döndü.'
        : 'Valfli hidrojel göğüs mührü yapıştırıldı: Açık göğüs yarası kapatıldı, pnömotoraks önlendi.');
  }

  // 4. SAM Splints & Orthopedic Supports (Fractures / Joint sprains)
  else if (
    itemId === 'sam_splint_roll' ||
    itemId === 'sam_splint_36inch' ||
    itemId === 'triangular_bandage_sling' ||
    itemId === 'cervical_extrication_collar' ||
    itemId === 'cohesive_flexible_vet_wrap'
  ) {
    const isCollar = itemId.includes('collar');
    if (!isCollar && !isLimb(targetPart)) {
      return { success: false, reasonKey: 'splint_requires_limb' };
    }
    if (!part.fractures && part.health >= 100) {
      return { success: false, reasonKey: 'no_fracture' };
    }
    const hadFracture = part.fractures;
    part.fractures = false;
    part.health = Math.min(100, part.health + 15);
    treated = true;
    actionDesc = hadFracture
      ? 'Alüminyum SAM ateli şekillendirilip sabitlendi: Kırık kemik hareketsizleştirildi, uzuv stabilize edildi.'
      : 'Ortopedik askı/bandaj uygulandı: Eklem burkulması ve doku gerginliği giderildi.';
  }

  // 5. Burn Treatments (Hydrogel Dressings, Burn Sheets, Burn Creams)
  else if (
    itemId === 'burn_hydrogel_dressing' ||
    itemId === 'burn_sheet_sterile' ||
    itemId === 'silver_sulfadiazine_burn_cream' ||
    itemId === 'burn_gel_hydrogel_packet' ||
    itemId === 'calamine_lotion_bottle' ||
    itemId === 'hydrocortisone_cream_1pct' ||
    itemId === 'zinc_oxide_petroleum_paste'
  ) {
    if (!part.burns && part.health >= 100 && part.infectionRisk <= 0) {
      return { success: false, reasonKey: 'no_burns' };
    }
    part.burns = false;
    part.infectionRisk = Math.max(0, part.infectionRisk - 40);
    part.health = Math.min(100, part.health + 20);
    treated = true;
    actionDesc = 'Steril hidrojel yanık örtüsü ve gümüş sülfadiazin merhemi uygulandı: Termal yanık soğutuldu ve doku yenilendi.';
  }

  // 6. Antiseptics & Wound Irrigation (Infection Risk Decontamination)
  else if (
    itemId === 'antiseptic' ||
    itemId === 'povidone_iodine_bottle' ||
    itemId === 'rubbing_alcohol_bottle' ||
    itemId === 'hydrogen_peroxide_bottle' ||
    itemId === 'chlorhexidine_scrub' ||
    itemId === 'chlorhexidine_gluconate_4pct' ||
    itemId === 'alcohol_prep_swabs' ||
    itemId === 'potassium_permanganate_crystals' ||
    itemId === 'antibacterial_triple_ointment' ||
    itemId === 'eye_wash_sterile_saline_bottle'
  ) {
    part.infectionRisk = Math.max(0, part.infectionRisk - 60);
    for (const p of Object.values(bodyState)) {
      p.infectionRisk = Math.max(0, p.infectionRisk - 30);
    }
    part.health = Math.min(100, part.health + 8);
    treated = true;
    actionDesc = 'Antiseptik solüsyonla açık yara yıkandı ve dezenfekte edildi: Bakteriyel enfeksiyon riski temizlendi.';
  }

  // 7. Systemic Broad-Spectrum Antibiotics
  else if (
    itemId === 'ciprofloxacin_antibiotic' ||
    itemId === 'ciprofloxacin_500mg_box' ||
    itemId === 'antibiotics' ||
    itemId === 'amoxicillin_capsules' ||
    itemId === 'amoxicillin_clavulanate_box' ||
    itemId === 'doxycycline_hyclate' ||
    itemId === 'doxycycline_100mg_bottle' ||
    itemId === 'azithromycin_250mg_zpack' ||
    itemId === 'metronidazole_500mg_bottle' ||
    itemId === 'chloroquine_phosphate_tabs'
  ) {
    for (const p of Object.values(bodyState)) {
      p.infectionRisk = 0;
      p.health = Math.min(100, p.health + 6);
    }
    treated = true;
    actionDesc = 'Geniş spektrumlu antibiyotik dozu alındı: Sistemik bakteri üremesi durduruldu ve doku enfeksiyonu sıfırlandı.';
  }

  // 8. Surgical Sutures, Skin Staplers & Liquid Adhesives
  else if (
    itemId === 'suture_needle_silk' ||
    itemId === 'disposable_skin_stapler' ||
    itemId === 'liquid_skin_adhesive' ||
    itemId === 'butterfly_wound_closure'
  ) {
    if (part.bleeding === BLEED_LEVELS.NONE && part.health >= 100) {
      return { success: false, reasonKey: 'no_wounds' };
    }
    if (part.bleeding === BLEED_LEVELS.ARTERIAL) {
      part.bleeding = BLEED_LEVELS.MINOR;
      actionDesc = 'Derin kesik cerrahi zımba/dikişle kapatıldı: Atardamar yaralanması sınırlandırıldı.';
    } else {
      part.bleeding = BLEED_LEVELS.NONE;
      actionDesc = 'Cerrahi dikiş ve doku yapıştırıcısıyla yara kenarları birleştirildi: Kesik tamamen dikildi.';
    }
    part.health = Math.min(100, part.health + 18);
    part.infectionRisk = Math.max(0, part.infectionRisk - 20);
    treated = true;
  }

  // 9. Standard Bandages & Gauze
  else if (itemId === 'bandage' || itemId === 'gauze_roll_sterile' || itemId === 'adhesive_plaster_strip' || itemId === 'elastic_compression_wrap') {
    if (part.bleeding === BLEED_LEVELS.NONE && part.health >= 100) {
      return { success: false, reasonKey: 'no_wounds' };
    }
    if (part.bleeding === BLEED_LEVELS.MINOR) {
      part.bleeding = BLEED_LEVELS.NONE;
      actionDesc = 'Steril sargı bezi yaraya sarıldı: Kanama durduruldu.';
    } else if (part.bleeding === BLEED_LEVELS.ARTERIAL) {
      return { success: false, reasonKey: 'bandage_insufficient_for_arterial' };
    } else {
      actionDesc = 'Temiz pansuman yapıldı: Hasarlı doku koruma altına alındı.';
    }
    part.health = Math.min(100, part.health + 8);
    treated = true;
  }

  // 10. Comprehensive First Aid Kits & Military IFAKs
  else if (itemId === 'first_aid_kit' || itemId === 'military_ifak_complete') {
    for (const p of Object.values(bodyState)) {
      if (p.bleeding === BLEED_LEVELS.ARTERIAL) p.bleeding = BLEED_LEVELS.MINOR;
      else if (p.bleeding === BLEED_LEVELS.MINOR) p.bleeding = BLEED_LEVELS.NONE;
      p.burns = false;
      p.punctured = false;
      p.infectionRisk = Math.max(0, p.infectionRisk - 50);
      p.health = Math.min(100, p.health + 15);
    }
    treated = true;
    actionDesc = 'Askeri travma çantası açıldı: Kapsamlı müdahaleyle kanamalar durduruldu, yaralar dezenfekte edildi.';
  }

  // 11. IV Fluid Resuscitation
  else if (
    itemId === 'iv_saline_bag_500ml' ||
    itemId === 'ringer_lactate_500ml_iv_bag' ||
    itemId === 'normal_saline_500ml_iv_bag' ||
    itemId === 'oral_rehydration_salts_who'
  ) {
    for (const p of Object.values(bodyState)) {
      p.health = Math.min(100, p.health + 10);
    }
    treated = true;
    actionDesc = 'Damar içi elektrolit serum infüzyonu yapıldı: Kan hacmi ve doku perfüzyonu yükseltildi.';
  }

  // 12. Surgical & Diagnostic Tools
  else if (
    itemId === 'trauma_shears_scissors' ||
    itemId === 'surgical_forceps' ||
    itemId === 'surgical_hemostat_forceps' ||
    itemId === 'surgical_scalpel_disposable_10' ||
    itemId === 'bone_saw_gigli_wire' ||
    itemId === 'tissue_forceps_toothed' ||
    itemId === 'dental_extraction_forceps' ||
    itemId === 'dual_head_stethoscope' ||
    itemId === 'aneroid_blood_pressure_cuff' ||
    itemId === 'pulse_oximeter_fingertip' ||
    itemId === 'sterile_disposable_hypodermic_syringes' ||
    itemId === 'iv_giving_infusion_set' ||
    itemId === 'iv_infusion_tubing_set' ||
    itemId === 'iv_cannula_catheter_18g'
  ) {
    if (part.bleeding === BLEED_LEVELS.MINOR) part.bleeding = BLEED_LEVELS.NONE;
    part.infectionRisk = Math.max(0, part.infectionRisk - 25);
    part.health = Math.min(100, part.health + 8);
    treated = true;
    actionDesc = 'Cerrahi/teşhis ekipmanıyla saha müdahalesi gerçekleştirildi: Yabancı cisimler çıkarıldı ve doku temizlendi.';
  }

  // 13. Analgesics, Antidotes & Emergency Injections
  else {
    part.health = Math.min(100, part.health + 5);
    treated = true;
    actionDesc = 'İlaç/antidot uygulandı: Ağrı ve toksik belirtiler hafifletildi.';
  }

  if (treated && bus) {
    bus.emit(EVENT_BODY_UPDATED, { part: targetPart, bodyState, actionDesc });
  }

  return { success: treated, actionDesc };
}

/**
 * Hourly biological degradation, infection proliferation, and hemodynamic blood loss tick.
 */
export function tickBodyState(bodyState, hours = 1, { rng = null, bus = null } = {}) {
  if (!bodyState) return { totalBleedLoss: 0, alerts: [] };

  let totalBleedLoss = 0;
  const alerts = [];

  for (const partName of BODY_PARTS) {
    const part = bodyState[partName];
    if (!part) continue;

    // Blood loss calculation
    const bleedRate = BLEED_RATES_PER_HOUR[part.bleeding] || 0;
    if (bleedRate > 0) {
      const bleedLoss = bleedRate * hours;
      totalBleedLoss += bleedLoss;
      part.health = Math.max(0, part.health - bleedLoss * 0.4);

      if (part.bleeding === BLEED_LEVELS.ARTERIAL) {
        alerts.push({
          type: EVENT_BLEEDING_ALERT,
          part: partName,
          text: `Severe pulsatile arterial bleed on ${partName}! Immediate tourniquet required.`,
        });
      }
    }

    // Infection progression if wound is open
    if (part.bleeding !== BLEED_LEVELS.NONE || part.burns || part.punctured) {
      part.infectionRisk = Math.min(100, part.infectionRisk + 2.5 * hours);
      if (part.infectionRisk >= 75) {
        alerts.push({
          type: EVENT_INFECTION_ALERT,
          part: partName,
          text: `Purulent bacterial infection developing on ${partName} (${Math.round(part.infectionRisk)}%).`,
        });
        part.health = Math.max(0, part.health - 2.0 * hours);
      }
    }

    // Natural recovery of healthy closed tissue
    if (part.bleeding === BLEED_LEVELS.NONE && !part.fractures && !part.punctured && part.infectionRisk < 20) {
      part.health = Math.min(100, part.health + 0.8 * hours);
    }
  }

  if (bus && alerts.length > 0) {
    bus.emit(EVENT_BODY_UPDATED, { bodyState, alerts });
  }

  return {
    totalBleedLoss,
    alerts,
  };
}

/**
 * Aggregates all active physiological debuffs produced by the current body trauma state.
 */
export function getBodyDebuffs(bodyState) {
  if (!bodyState) {
    return {
      travelTimeMultiplier: 1.0,
      travelCalorieMultiplier: 1.0,
      travelStaminaMultiplier: 1.0,
      weaponAccuracyPenalty: 0.0,
      scavengeSpeedMultiplier: 1.0,
      hasTensionPneumothorax: false,
      maxStaminaCap: 100,
      hasArterialBleed: false,
      totalBleedRate: 0,
      isImmobilized: false,
    };
  }

  let travelTimeMult = 1.0;
  let travelCalorieMult = 1.0;
  let travelStaminaMult = 1.0;
  let accuracyPenalty = 0.0;
  let scavengeMult = 1.0;
  let hasPneumothorax = Boolean(bodyState.torso?.punctured);
  let maxStaminaCap = hasPneumothorax ? 40 : 100;
  let hasArterial = false;
  let totalBleedRate = 0;

  // Leg Damage & Fractures:
  // Leg damage or fracture doubles sector travel time, increases stamina/calorie cost
  const leftLeg = bodyState.leftLeg;
  const rightLeg = bodyState.rightLeg;
  const leftLegCompromised = leftLeg && (leftLeg.fractures || leftLeg.health < 40);
  const rightLegCompromised = rightLeg && (rightLeg.fractures || rightLeg.health < 40);

  if (leftLegCompromised || rightLegCompromised) {
    travelTimeMult *= 2.0; // Doubles sector travel time
    travelCalorieMult *= 1.45; // Increases calorie cost
    travelStaminaMult *= 1.60; // Increases stamina expenditure
  }
  if (leftLegCompromised && rightLegCompromised) {
    travelTimeMult *= 1.5; // Additional compounding penalty if both legs wrecked
  }

  // Arm Damage:
  // Lowers weapon accuracy and scavenging speed
  const leftArm = bodyState.leftArm;
  const rightArm = bodyState.rightArm;
  if (rightArm && (rightArm.fractures || rightArm.health < 50)) {
    accuracyPenalty += 0.25; // Dominant arm penalty
    scavengeMult *= 1.40;
  }
  if (leftArm && (leftArm.fractures || leftArm.health < 50)) {
    accuracyPenalty += 0.12; // Support arm penalty
    scavengeMult *= 1.25;
  }

  // Check Arterial Bleeds across all parts
  for (const p of Object.values(bodyState)) {
    if (p.bleeding === BLEED_LEVELS.ARTERIAL) {
      hasArterial = true;
    }
    totalBleedRate += BLEED_RATES_PER_HOUR[p.bleeding] || 0;
  }

  return {
    travelTimeMultiplier: travelTimeMult,
    travelCalorieMultiplier: travelCalorieMult,
    travelStaminaMultiplier: travelStaminaMult,
    weaponAccuracyPenalty: Math.min(0.60, accuracyPenalty),
    scavengeSpeedMultiplier: scavengeMult,
    hasTensionPneumothorax: hasPneumothorax,
    maxStaminaCap,
    hasArterialBleed: hasArterial,
    totalBleedRate,
    isImmobilized: Boolean(leftLeg?.health === 0 && rightLeg?.health === 0),
  };
}

/**
 * Calculates weighted composite overall body health percentage (0..100).
 */
export function getOverallBodyHealth(bodyState) {
  if (!bodyState) return 100;
  let total = 0;
  for (const [part, weight] of Object.entries(VITAL_PART_WEIGHTS)) {
    const hp = bodyState[part]?.health ?? 100;
    total += hp * weight;
  }
  return Math.round(Math.max(0, Math.min(100, total)));
}

/**
 * Automatically selects the most medically urgent target part for a given item.
 */
export function getRecommendedTargetPart(bodyState, itemId = '') {
  if (!bodyState) return 'torso';
  if (!itemId || typeof itemId !== 'string') return 'torso';

  // 1. Tourniquets must go on bleeding limbs (arterial prioritized)
  if (itemId === 'combat_tourniquet_cat' || itemId === 'softt_wide_tourniquet' || itemId.includes('tourniquet')) {
    const arterialLimb = ['leftLeg', 'rightLeg', 'leftArm', 'rightArm'].find(
      (part) => bodyState[part]?.bleeding === BLEED_LEVELS.ARTERIAL
    );
    if (arterialLimb) return arterialLimb;
    const bleedingLimb = ['leftLeg', 'rightLeg', 'leftArm', 'rightArm'].find(
      (part) => bodyState[part]?.bleeding !== BLEED_LEVELS.NONE
    );
    if (bleedingLimb) return bleedingLimb;
    return 'leftArm';
  }

  // 2. Chest seal / Decompression needle / Airway always targets torso
  if (
    itemId === 'chest_seal_vented' ||
    itemId === 'chest_seal_twin_pack' ||
    itemId === 'decompression_needle_14g' ||
    itemId === 'nasopharyngeal_airway_28fr'
  ) {
    return 'torso';
  }

  // 3. Splints / Slings target fractured limbs (or head/torso for neck collar)
  if (
    itemId === 'sam_splint_roll' ||
    itemId === 'sam_splint_36inch' ||
    itemId === 'triangular_bandage_sling' ||
    itemId === 'cohesive_flexible_vet_wrap'
  ) {
    const fracturedLimb = ['leftLeg', 'rightLeg', 'leftArm', 'rightArm'].find(
      (part) => bodyState[part]?.fractures
    );
    if (fracturedLimb) return fracturedLimb;
    const lowestLimb = ['leftLeg', 'rightLeg', 'leftArm', 'rightArm'].sort(
      (a, b) => (bodyState[a]?.health ?? 100) - (bodyState[b]?.health ?? 100)
    )[0];
    return lowestLimb || 'leftLeg';
  }

  if (itemId === 'cervical_extrication_collar') {
    return 'head';
  }

  // 4. Burn treatments target burned parts first
  if (
    itemId.includes('burn') ||
    itemId === 'silver_sulfadiazine_burn_cream' ||
    itemId === 'calamine_lotion_bottle' ||
    itemId === 'hydrocortisone_cream_1pct'
  ) {
    const burnedPart = BODY_PARTS.find((p) => bodyState[p]?.burns);
    if (burnedPart) return burnedPart;
  }

  // 5. Antiseptics target parts with highest infection risk
  if (
    itemId === 'antiseptic' ||
    itemId.includes('iodine') ||
    itemId.includes('chlorhexidine') ||
    itemId.includes('alcohol') ||
    itemId.includes('peroxide')
  ) {
    const infectedPart = [...BODY_PARTS].sort(
      (a, b) => (bodyState[b]?.infectionRisk ?? 0) - (bodyState[a]?.infectionRisk ?? 0)
    )[0];
    if (bodyState[infectedPart]?.infectionRisk > 0) return infectedPart;
  }

  // 6. Hemostatic gauze / bandages / sutures target the part with most severe bleeding
  let worstBleedPart = null;
  for (const partName of BODY_PARTS) {
    if (bodyState[partName]?.bleeding === BLEED_LEVELS.ARTERIAL) {
      worstBleedPart = partName;
      break;
    }
  }
  if (!worstBleedPart) {
    worstBleedPart = BODY_PARTS.find((p) => bodyState[p]?.bleeding === BLEED_LEVELS.MINOR);
  }
  if (worstBleedPart) return worstBleedPart;

  // 7. Otherwise target lowest health part
  let lowestHpPart = 'torso';
  let minHp = 100;
  for (const partName of BODY_PARTS) {
    const hp = bodyState[partName]?.health ?? 100;
    if (hp < minHp) {
      minHp = hp;
      lowestHpPart = partName;
    }
  }
  return lowestHpPart;
}

/**
 * Checks for instantly fatal conditions (e.g. brain death from head collapse or heart rupture).
 */
export function isBodyConditionFatal(bodyState) {
  if (!bodyState) return false;
  if ((bodyState.head?.health ?? 100) <= 0) return true;
  if ((bodyState.torso?.health ?? 100) <= 0) return true;
  return false;
}
