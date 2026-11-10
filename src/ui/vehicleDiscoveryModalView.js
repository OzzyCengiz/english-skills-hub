/**
 * Last Breath // Vehicle Discovery Modal View
 * Terminal popup overlay appearing when an abandoned/derelict vehicle is discovered
 * anywhere in the world. Displays telemetry, required restoration parts, and
 * allows claiming directly into the player's inventory/fleet.
 */

import { getItem } from '../data/items.js';
import { t, i18n } from '../i18n/i18n.js';
import { countItem } from '../modules/inventory/inventoryModel.js';
import { getNode } from '../modules/map/mapGraph.js';
import { VehicleEngine, VEHICLE_CATALOG } from '../modules/vehicles/vehicleEngine.js';
import { el } from './dom.js';
import { audioEngine } from '../core/audioEngine.js';

export class VehicleDiscoveryModalView {
  #rootEl;
  #engine;
  #current = null;

  constructor(rootEl, engine) {
    this.#rootEl = rootEl;
    this.#engine = engine;

    // Listen to vehicle discovery events
    this.#engine.bus.on('vehicles:discovered', (payload) => {
      this.open(payload);
    });
  }

  get isOpen() {
    return !this.#rootEl.hidden && Boolean(this.#current);
  }

  open({ vehicleId, nodeId, source }) {
    this.#current = { vehicleId, nodeId, source };
    this.#rootEl.hidden = false;
    try { audioEngine.playEngineRev(); } catch {}
    this.render();
  }

  close() {
    this.#current = null;
    this.#rootEl.hidden = true;
    this.#rootEl.replaceChildren();
  }

  render() {
    if (!this.#current || this.#rootEl.hidden) return;

    const { vehicleId, nodeId } = this.#current;
    const state = this.#engine.store.state;
    const vehicle = VehicleEngine.getVehicle(state, vehicleId);
    const def = VEHICLE_CATALOG[vehicleId];
    if (!vehicle || !def) {
      this.close();
      return;
    }

    const node = getNode(nodeId);
    const nodeName = node ? t(`location.${node.id}`) : nodeId;
    const countryName = node?.country || '';
    const isMuscle = Boolean(def.musclePowered || def.fuelType === 'muscle');
    const maxFuel = VehicleEngine.getEffectiveMaxFuel(vehicle, def);
    const maxTrunk = VehicleEngine.getEffectiveTrunkCapacity(vehicle, def);
    const speedRatio = def.speedMultiplier ? (1 / def.speedMultiplier).toFixed(1) : '1.0';

    // Rarity / tag
    let roleTag = t('vehicle.discovery.tag_derelict');
    if (def.fieldClinic) roleTag = `🚑 ${t('vehicle.spec.field_clinic')}`;
    else if (def.arcticTracked) roleTag = `🚜 ${t('vehicle.spec.arctic_tracked')}`;
    else if (isMuscle) roleTag = `🚋 ${t('vehicle.spec.muscle_powered')}`;
    else if (def.amphibious) roleTag = `🚤 ${t('vehicle.spec.amphibious')}`;

    // Check parts requirements in inventory
    const partBadges = def.partsRequired.map((req) => {
      const owned = countItem(state.inventory, req.itemId);
      const hasAlternates = Array.isArray(req.alternates)
        ? req.alternates.some((alt) => countItem(state.inventory, alt) >= req.qty)
        : false;
      const satisfied = owned >= req.qty || hasAlternates;
      return el(
        'div',
        { class: ['disc-part-chip', satisfied ? 'is-satisfied' : 'is-missing'].join(' ') },
        el('span', {}, satisfied ? '✓' : '✗'),
        el('span', {}, `${t(`item.${req.itemId}.name`)} (x${req.qty})`),
        el('span', { class: 'disc-part-status' }, satisfied ? t('vehicle.status.installed') : t('vehicle.status.missing')),
      );
    });

    const card = el(
      'div',
      { class: 'action-modal-card vehicle-discovery-card' },
      // Header
      el(
        'div',
        { class: 'action-modal-header vehicle-disc-header' },
        el(
          'div',
          { class: 'vehicle-disc-title-cluster' },
          el('span', { class: 'vehicle-disc-alert-icon' }, '🚨'),
          el(
            'div',
            {},
            el('h3', { class: 'action-modal-title' }, t('vehicle.discovery.title')),
            el('span', { class: 'vehicle-disc-subtitle' }, `📍 ${nodeName} ${countryName ? `(${countryName})` : ''}`),
          ),
        ),
        el('span', { class: 'disc-role-badge' }, roleTag),
      ),
      // Visual Body
      el(
        'div',
        { class: 'vehicle-disc-body' },
        el(
          'div',
          { class: 'vehicle-disc-hero' },
          el('div', { class: 'vehicle-disc-glyph' }, def.glyph || '🚙'),
          el(
            'div',
            { class: 'vehicle-disc-info' },
            el('h2', { class: 'vehicle-disc-name' }, t(def.nameKey)),
            el('p', { class: 'vehicle-disc-desc' }, t(def.descKey)),
          ),
        ),
        // Telemetry Grid
        el(
          'div',
          { class: 'vehicle-disc-telemetry' },
          el(
            'div',
            { class: 'disc-tel-col' },
            el('span', { class: 'disc-tel-label' }, t('vehicle.gauge.condition')),
            el('strong', { class: 'disc-tel-val tone-warn' }, `%${vehicle.condition}`),
          ),
          el(
            'div',
            { class: 'disc-tel-col' },
            el('span', { class: 'disc-tel-label' }, isMuscle ? t('vehicle.fuel.muscle_label') : t('vehicle.gauge.fuel')),
            el('strong', { class: 'disc-tel-val tone-good' }, isMuscle ? '∞ (0 L)' : `${vehicle.fuelLiters}/${maxFuel} L`),
          ),
          el(
            'div',
            { class: 'disc-tel-col' },
            el('span', { class: 'disc-tel-label' }, t('vehicle.trunk_load')),
            el('strong', { class: 'disc-tel-val' }, `${maxTrunk} kg`),
          ),
          el(
            'div',
            { class: 'disc-tel-col' },
            el('span', { class: 'disc-tel-label' }, t('vehicle.spec.speed')),
            el('strong', { class: 'disc-tel-val' }, `${speedRatio}x`),
          ),
        ),
        // Required Restoration Parts
        el(
          'div',
          { class: 'vehicle-disc-parts-section' },
          el('h4', { class: 'disc-section-title' }, t('vehicle.discovery.parts_needed_title')),
          el('div', { class: 'disc-parts-grid' }, ...partBadges),
        ),
      ),
      // Footer Actions
      el(
        'div',
        { class: 'action-modal-footer vehicle-disc-footer' },
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent btn-disc-claim',
            onClick: () => {
              this.#engine.dispatch('vehicles/claim', { vehicleId });
              this.close();
            },
          },
          `🔑 ${t('vehicle.discovery.action_claim_inventory')}`,
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost',
            onClick: () => {
              this.#engine.dispatch('vehicles/claim', { vehicleId });
              this.close();
              this.#engine.dispatch('vehicles/openModal', { vehicleId });
            },
          },
          `🛠️ ${t('vehicle.discovery.action_inspect_now')}`,
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost',
            onClick: () => this.close(),
          },
          `📍 ${t('vehicle.discovery.action_leave_sector')}`,
        ),
      ),
    );

    this.#rootEl.replaceChildren(card);
  }
}
