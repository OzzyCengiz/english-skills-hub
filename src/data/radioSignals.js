/**
 * Last Breath // Radio & Signal Intercept Database
 * Defines broadcast frequencies, distress calls, military number stations,
 * raider intercepts, automated meteorological telemetry, and anomalous signals.
 */

export const RADIO_SIGNALS = [
  {
    id: 'sos_doctor_aris',
    frequency: 94.8,
    bandwidth: 0.5,
    type: 'distress',
    category: 'survivor',
    nameKey: 'radio.signal.dr_aris.name',
    callerKey: 'radio.signal.dr_aris.caller',
    transcriptKey: 'radio.signal.dr_aris.transcript',
    locationNodeId: 'istanbul',
    rangeKm: 8000,
    audioTone: 'voice_chatter',
    reward: {
      type: 'cache',
      cacheType: 'medical',
      titleKey: 'radio.cache.medical_drop',
      items: [
        { itemId: 'antibiotics', qty: 3 },
        { itemId: 'first_aid_kit', qty: 2 },
        { itemId: 'antiseptic', qty: 4 },
        { itemId: 'bandage', qty: 4 },
      ],
      xp: 45,
    },
  },
  {
    id: 'numbers_station_echo_309',
    frequency: 101.5,
    bandwidth: 0.5,
    type: 'military',
    category: 'numbers_station',
    nameKey: 'radio.signal.numbers_station.name',
    callerKey: 'radio.signal.numbers_station.caller',
    transcriptKey: 'radio.signal.numbers_station.transcript',
    locationNodeId: 'sofia',
    rangeKm: 10000, // Global NATO numbers broadcast
    audioTone: 'morse_telemetry',
    vaultCode: '74192',
    reward: {
      type: 'vault_code',
      vaultSector: 'sofia',
      titleKey: 'radio.cache.nato_bunker',
      items: [
        { itemId: 'ammo_9mm_parabellum_box', qty: 2 },
        { itemId: 'geiger_muller_counter', qty: 1 },
        { itemId: 'mre', qty: 3 },
      ],
      xp: 60,
    },
  },
  {
    id: 'raider_ambush_intercept',
    frequency: 98.2,
    bandwidth: 0.45,
    type: 'raider',
    category: 'intercept',
    nameKey: 'radio.signal.raider_ambush.name',
    callerKey: 'radio.signal.raider_ambush.caller',
    transcriptKey: 'radio.signal.raider_ambush.transcript',
    locationNodeId: 'ankara',
    rangeKm: 6000,
    audioTone: 'radio_squelch',
    reward: {
      type: 'intel_warning',
      ambushDisarmedSector: 'ankara',
      titleKey: 'radio.cache.ambush_thwarted',
      xp: 50,
    },
  },
  {
    id: 'noaa_automated_weather',
    frequency: 89.4,
    bandwidth: 0.6,
    type: 'weather',
    category: 'automated',
    nameKey: 'radio.signal.weather_beacon.name',
    callerKey: 'radio.signal.weather_beacon.caller',
    transcriptKey: 'radio.signal.weather_beacon.transcript',
    locationNodeId: 'athens',
    rangeKm: 12000, // Planetary satellite downlink
    audioTone: 'automated_beep',
    reward: {
      type: 'weather_telemetry',
      titleKey: 'radio.cache.forecast_logged',
      xp: 25,
    },
  },
  {
    id: 'nomad_caravan_bazaar',
    frequency: 91.8,
    bandwidth: 0.5,
    type: 'trader',
    category: 'merchant',
    nameKey: 'radio.signal.nomad_caravan.name',
    callerKey: 'radio.signal.nomad_caravan.caller',
    transcriptKey: 'radio.signal.nomad_caravan.transcript',
    locationNodeId: 'bucharest',
    rangeKm: 7000,
    audioTone: 'voice_chatter',
    reward: {
      type: 'trader_rendezvous',
      titleKey: 'radio.cache.trader_rendezvous',
      items: [
        { itemId: 'purified_water_canteen', qty: 2 },
        { itemId: 'scrap_metal', qty: 10 },
      ],
      xp: 35,
    },
  },
  {
    id: 'cosmic_anomaly_pulsar',
    frequency: 106.3,
    bandwidth: 0.45,
    type: 'anomaly',
    category: 'mystery',
    nameKey: 'radio.signal.pulsar_anomaly.name',
    callerKey: 'radio.signal.pulsar_anomaly.caller',
    transcriptKey: 'radio.signal.pulsar_anomaly.transcript',
    locationNodeId: 'kyiv',
    rangeKm: 15000, // Global Ionosphere bounce
    audioTone: 'eerie_drone',
    reward: {
      type: 'lore_breakthrough',
      titleKey: 'radio.cache.anomaly_analyzed',
      xp: 80,
    },
  },
];

/**
 * Calculates reception quality (0.0 to 1.0) and distance for a given frequency
 * relative to player's current node and the signal's origin.
 */
export function calculateSignalReception(signal, currentFreq, playerNode, distanceKm = 0) {
  const roundCurrent = Math.round(currentFreq * 10) / 10;
  const roundSignal = Math.round(signal.frequency * 10) / 10;
  const freqDelta = Math.abs(roundCurrent - roundSignal);
  const bandwidth = signal.bandwidth || 0.45;

  if (freqDelta > bandwidth) {
    return { quality: 0, distanceKm, locked: false, freqDelta };
  }

  // Frequency match factor: 1.0 at center, fades to 0 at edge of bandwidth
  const freqFactor = Math.max(0, 1 - (freqDelta / bandwidth));

  // Distance attenuation factor: full signal if close, minimum 0.5 even if far
  const maxRange = signal.rangeKm || 8000;
  const distRatio = Math.min(1.0, distanceKm / maxRange);
  const distFactor = Math.max(0.5, 1.0 - (distRatio * 0.5));

  // Combined reception quality (0 to 100%)
  const quality = Math.min(1.0, Math.round(freqFactor * distFactor * 100) / 100);
  const locked = freqDelta <= 0.11 && quality >= 0.35;

  return {
    quality,
    freqDelta: Math.round(freqDelta * 10) / 10,
    distanceKm: Math.round(distanceKm),
    locked,
  };
}
