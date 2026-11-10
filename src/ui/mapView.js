import { BALANCE } from '../data/balance.js';
import { getItem } from '../data/items.js';
import { getEnemy } from '../data/enemies.js';
import { t } from '../i18n/i18n.js';
import { weaponProfile } from '../modules/inventory/inventorySelectors.js';
import { describeEncounter } from '../modules/map/encounters.js';
import {
  ALL_NODES, EDGES, chartedCountries, estimateJourney, findRoute, getNode,
  neighborsOf, nodeVisibility, scavengeProfile,
} from '../modules/map/mapGraph.js';
import { MAP_VIEWBOX } from '../modules/map/projection.js';
import {
  RANGE_BANDS,
  RANGE_METERS,
  TARGET_ZONES,
  getWeaponRangeProfile,
  calculateTacticalHitChance,
} from '../modules/combat/tacticalCombat.js';
import { VEHICLE_CATALOG, VehicleEngine } from '../modules/vehicles/vehicleEngine.js';
import { el, svgEl } from './dom.js';

export class MapView {
  #viewportEl;
  #dossierEl;
  #encounterHostEl;
  #engine;
  #svgEl = null;
  #routesLayer = null;
  #nodesLayer = null;
  #countryPaths = new Map();
  #camera = { x: 0, y: 0, width: MAP_VIEWBOX.width, height: MAP_VIEWBOX.height };
  #drag = null;
  #lastState = null;
  #aimTargetZone = 'torso';
  #activeDossierTab = 'anchor';
  #corridorsPage = 1;
  #lastSelectedId = null;

  constructor({ viewportEl, dossierEl, encounterHostEl, engine }) {
    this.#viewportEl = viewportEl;
    this.#dossierEl = dossierEl;
    this.#encounterHostEl = encounterHostEl;
    this.#engine = engine;
  }

  async mount(inlineSvgText = null) {
    let svgText = inlineSvgText;
    if (!svgText) {
      const response = await fetch('./world.svg');
      if (!response.ok) throw new Error(`Failed to load world.svg (${response.status})`);
      svgText = await response.text();
    }

    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const sourceSvg = doc.querySelector('svg');
    if (!sourceSvg) throw new Error('Invalid world.svg document');
    const parsedSvg = document.importNode(sourceSvg, true);

    parsedSvg.classList.add('world-svg');
    parsedSvg.removeAttribute('width');
    parsedSvg.removeAttribute('height');
    parsedSvg.setAttribute('viewBox', `0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`);

    for (const path of parsedSvg.querySelectorAll('path')) {
      const country = path.getAttribute('name') || path.getAttribute('class');
      path.classList.add('landmass');
      if (country) {
        if (!this.#countryPaths.has(country)) this.#countryPaths.set(country, []);
        this.#countryPaths.get(country).push(path);
        path.addEventListener('click', () => this.#onCountryClick(country));
      }
    }

    this.#routesLayer = svgEl('g', { class: 'map-routes-layer' });
    this.#nodesLayer = svgEl('g', { class: 'map-nodes-layer' });
    parsedSvg.append(this.#routesLayer, this.#nodesLayer);

    this.#svgEl = parsedSvg;
    this.#viewportEl.prepend(parsedSvg);
    this.#bindPanZoom();
  }

  #onCountryClick(country) {
    if (!this.#lastState) return;
    const candidates = ALL_NODES.filter(
      (node) => node.country === country && nodeVisibility(this.#lastState, node.id) !== 'fog',
    );
    if (candidates.length > 0) {
      this.#engine.dispatch('map/select', { nodeId: candidates[0].id });
    }
  }

  centerOnNode(nodeId, zoom = 3.2) {
    const node = getNode(nodeId);
    const width = MAP_VIEWBOX.width / zoom;
    const height = MAP_VIEWBOX.height / zoom;
    this.#setCamera({
      x: node.x - width / 2,
      y: node.y - height / 2,
      width,
      height,
    });
  }

  resetZoom() {
    this.#setCamera({ x: 0, y: 0, width: MAP_VIEWBOX.width, height: MAP_VIEWBOX.height });
  }

  zoomBy(factor) {
    const cx = this.#camera.x + this.#camera.width / 2;
    const cy = this.#camera.y + this.#camera.height / 2;
    const width = Math.max(220, Math.min(MAP_VIEWBOX.width, this.#camera.width / factor));
    const height = (width / MAP_VIEWBOX.width) * MAP_VIEWBOX.height;
    this.#setCamera({ x: cx - width / 2, y: cy - height / 2, width, height });
  }

  render(state) {
    this.#lastState = state;
    if (this.#svgEl) {
      this.#renderMapOverlay(state);
    }
    this.#renderDossier(state);
    this.#renderModalOverlay(state);
  }

  #renderMapOverlay(state) {
    const charted = chartedCountries(state);
    const selectedCountry = getNode(state.world.selectedNodeId).country;
    for (const [country, paths] of this.#countryPaths) {
      const isCharted = charted.has(country);
      const isSelectedCountry = country === selectedCountry;
      for (const path of paths) {
        path.classList.toggle('is-charted', isCharted);
        path.classList.toggle('is-selected-country', isSelectedCountry);
      }
    }

    const { currentNodeId, selectedNodeId } = state.world;
    const routeEls = [];
    for (const edge of EDGES) {
      const visA = nodeVisibility(state, edge.a);
      const visB = nodeVisibility(state, edge.b);
      if (visA === 'fog' && visB === 'fog') continue;
      if (visA !== 'visited' && visB !== 'visited') continue;

      const nodeA = getNode(edge.a);
      const nodeB = getNode(edge.b);
      const isActiveEdge =
        (edge.a === currentNodeId && edge.b === selectedNodeId) ||
        (edge.b === currentNodeId && edge.a === selectedNodeId);

      routeEls.push(
        svgEl('line', {
          x1: nodeA.x.toFixed(1),
          y1: nodeA.y.toFixed(1),
          x2: nodeB.x.toFixed(1),
          y2: nodeB.y.toFixed(1),
          class: [
            'map-route',
            edge.mode === 'sea' && 'is-sea',
            isActiveEdge && 'is-selected',
          ].filter(Boolean).join(' '),
        }),
      );
    }
    this.#routesLayer.replaceChildren(...routeEls);

    const nodeEls = [];
    const mountedId = state.vehicles?.mountedVehicleId;
    const allFleet = Object.values(state.vehicles?.fleet || {});

    for (const node of ALL_NODES) {
      const vis = nodeVisibility(state, node.id);
      if (vis === 'fog') continue;

      const isCurrent = node.id === currentNodeId;
      const isSelected = node.id === selectedNodeId;
      const isOutpost = state.base.outpostNodeId === node.id;
      const activeBeacon = state.radio?.discoveredBeacons?.find((b) => b.nodeId === node.id && !b.collected);

      const nodeVehicles = allFleet.filter((v) => v.discovered && v.nodeId === node.id);
      const isDrivingHere = Boolean(isCurrent && mountedId && nodeVehicles.some((v) => v.id === mountedId));
      const hasVehicle = nodeVehicles.length > 0;
      const primaryVehicle = isDrivingHere
        ? nodeVehicles.find((v) => v.id === mountedId)
        : nodeVehicles[0];
      const vehicleDef = primaryVehicle ? VEHICLE_CATALOG[primaryVehicle.id] : null;

      let labelText = t(`location.${node.id}`);
      if (activeBeacon) {
        labelText = `📡 ${labelText}`;
      } else if (isOutpost) {
        labelText = `⌂ ${labelText}`;
      } else if (hasVehicle && vehicleDef?.glyph) {
        labelText = `${vehicleDef.glyph} ${labelText}`;
      }

      const group = svgEl(
        'g',
        {
          class: [
            'map-node',
            `vis-${vis}`,
            isCurrent && 'is-current',
            isSelected && 'is-selected',
            isOutpost && 'is-outpost',
            activeBeacon && 'has-beacon',
            hasVehicle && 'has-vehicle',
            isDrivingHere && 'is-driving',
          ].filter(Boolean).join(' '),
          transform: `translate(${node.x.toFixed(1)}, ${node.y.toFixed(1)})`,
          'data-node-id': node.id,
        },
        svgEl('circle', { class: 'node-hit-area', r: 12 }),
        isCurrent && svgEl('circle', { class: 'node-pulse', r: 11 }),
        activeBeacon && svgEl('circle', { class: 'node-beacon-ring', r: 15 }),
        isSelected && svgEl('circle', { class: 'node-reticle', r: 8 }),
        svgEl('circle', { class: 'node-dot', r: isCurrent ? 4.8 : 3.8 }),
        hasVehicle && vehicleDef?.glyph && svgEl(
          'text',
          {
            class: ['node-vehicle-marker', isDrivingHere ? 'is-driving' : 'is-parked'].join(' '),
            x: 0,
            y: -9,
          },
          vehicleDef.glyph,
        ),
        svgEl('text', { class: 'node-label', x: 6.5, y: 3 }, labelText),
      );

      group.addEventListener('click', (event) => {
        event.stopPropagation();
        this.#engine.dispatch('map/select', { nodeId: node.id });
      });
      group.addEventListener('dblclick', (event) => {
        event.stopPropagation();
        if (findRoute(currentNodeId, node.id)) {
          this.#engine.dispatch('map/travel', { toId: node.id });
        }
      });
      nodeEls.push(group);
    }
    this.#nodesLayer.replaceChildren(...nodeEls);
  }

  #renderDossier(state) {
    this.#lastState = state;
    const { currentNodeId, selectedNodeId } = state.world;
    const current = getNode(currentNodeId);
    const selected = getNode(selectedNodeId);
    const scavenge = scavengeProfile(state, currentNodeId);
    const yieldPct = Math.round((1 - scavenge.depletion) * 100);

    const isSelectedOther = Boolean(selected && current && selected.id !== current.id);
    if (isSelectedOther && this.#lastSelectedId !== selected.id) {
      this.#activeDossierTab = 'corridors';
      this.#corridorsPage = 1;
    }
    this.#lastSelectedId = selected?.id;

    const nav = el(
      'div',
      { class: 'status-page-nav dossier-page-nav' },
      el(
        'button',
        {
          type: 'button',
          class: ['status-page-btn', this.#activeDossierTab === 'anchor' && 'is-active'],
          onClick: () => {
            this.#activeDossierTab = 'anchor';
            if (this.#lastState) this.#renderDossier(this.#lastState);
          },
        },
        t('map.tabs.anchor'),
      ),
      el(
        'button',
        {
          type: 'button',
          class: ['status-page-btn', this.#activeDossierTab === 'corridors' && 'is-active'],
          onClick: () => {
            this.#activeDossierTab = 'corridors';
            if (this.#lastState) this.#renderDossier(this.#lastState);
          },
        },
        t('map.tabs.corridors'),
      ),
    );

    let content = [];
    if (this.#activeDossierTab === 'anchor') {
      const vehicleHud = this.#renderVehicleDashboard(state);
      const parkedCard = !vehicleHud ? this.#renderParkedVehiclesCard(state, current.id) : null;
      const localOps = el(
        'section',
        { class: 'panel-block' },
        el(
          'div',
          { class: 'sector-header' },
          el(
            'div',
            {},
            el('span', { class: 'meta-label' }, t('map.current_sector')),
            el('h3', { class: 'sector-title' }, t(`location.${current.id}`)),
          ),
          el('span', { class: ['biome-badge', `biome-${current.biome}`] }, t(`biome.${current.biome}`)),
        ),
        el(
          'dl',
          { class: 'kv-grid kv-compact' },
          el('dt', {}, t('map.country')),
          el('dd', { class: 'tone-bright' }, current.country || '—'),
          el('dt', {}, t('map.coords')),
          el('dd', {}, this.#formatCoords(current)),
          el('dt', {}, t('map.threat_level')),
          el('dd', { class: `danger-${current.danger}` }, '▲'.repeat(current.danger)),
          el('dt', {}, t('map.scavenge_yield')),
          el('dd', {}, `${yieldPct}% (${Math.round(scavenge.chance * 100)}% ${t('map.find_chance')})`),
        ),
        (() => {
          const beacon = state.radio?.discoveredBeacons?.find((b) => b.nodeId === current.id && !b.collected);
          if (!beacon) return null;
          return el(
            'div',
            { class: 'beacon-intel-box' },
            el('span', { class: 'beacon-icon' }, '📡'),
            el(
              'div',
              { class: 'beacon-text-cluster' },
              el('strong', { class: 'beacon-title' }, t(beacon.nameKey || 'radio.ui.beacon_detected')),
              el('p', { class: 'beacon-desc' }, t('radio.ui.beacon_here_hint')),
            ),
            el(
              'div',
              { class: 'beacon-intel-actions' },
              beacon.reward?.items?.length
                ? el(
                    'button',
                    {
                      type: 'button',
                      class: 'btn btn-xs btn-accent',
                      onClick: () => this.#engine.dispatch('radio/collectBeacon', { beaconId: beacon.id }),
                    },
                    `📦 ${t('radio.ui.claim_cache')}`,
                  )
                : null,
              el(
                'button',
                {
                  type: 'button',
                  class: 'btn btn-xs btn-ghost',
                  onClick: () => this.#engine.dispatch('radio/openModal'),
                },
                t('radio.ui.tune_radio'),
              ),
            ),
          );
        })(),
        el(
          'div',
          { class: 'ops-actions' },
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-accent',
              onClick: () => this.#engine.dispatch('map/scavenge'),
            },
            t('map.action.scavenge'),
          ),
          el(
            'button',
            {
              type: 'button',
              class: 'btn',
              onClick: () => this.#engine.dispatch('combat/patrol'),
            },
            t('map.action.patrol'),
          ),
          el(
            'button',
            {
              type: 'button',
              class: 'btn',
              onClick: () => this.#engine.dispatch('map/survey'),
            },
            t('map.action.survey'),
          ),
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-ghost',
              onClick: () => this.#engine.dispatch('economy/openBarter', {
                merchantType: current.danger >= 3
                  ? 'iron_guard_quartermaster'
                  : (current.biome === 'wasteland' ? 'wasteland_peddler' : 'nomad_caravan'),
              }),
            },
            `🤝 ${t('barter.action_open')}`,
          ),
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-ghost',
              onClick: () => this.#engine.dispatch('map/requestAirdrop'),
            },
            `📡 ${t('ad.action_airdrop')}`,
          ),
          ...BALANCE.rest.options.map((hours) =>
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost',
                onClick: () => this.#engine.dispatch('map/rest', { hours }),
              },
              t('map.action.rest_hours', { hours }),
            ),
          ),
        ),
      );
      content = [vehicleHud, parkedCard, localOps].filter(Boolean);
    } else {
      const selectedTargetBanner = isSelectedOther
        ? this.#renderSelectedBanner(state, current, selected)
        : null;
      const routesSection = this.#renderRoutesList(state, current, selected);
      content = [selectedTargetBanner, routesSection].filter(Boolean);
    }

    this.#dossierEl.replaceChildren(...[nav, ...content].filter(Boolean));
  }

  #renderVehicleDashboard(state) {
    const mounted = VehicleEngine.getMountedVehicle(state);
    if (!mounted || !mounted.vehicle || !mounted.def) return null;

    const { vehicle, def } = mounted;
    const isMuscle = Boolean(def.musclePowered || def.fuelType === 'muscle');
    const maxFuel = VehicleEngine.getEffectiveMaxFuel(vehicle, def);
    const fuelPct = isMuscle ? 100 : (maxFuel > 0 ? Math.min(100, Math.round((vehicle.fuelLiters / maxFuel) * 100)) : 0);
    const conditionPct = Math.min(100, Math.max(0, vehicle.condition || 0));
    const cargoWeight = VehicleEngine.getCargoWeight(vehicle);
    const maxCargo = VehicleEngine.getEffectiveTrunkCapacity(vehicle, def);
    const cargoPct = maxCargo > 0 ? Math.min(100, Math.round((cargoWeight / maxCargo) * 100)) : 0;
    const speedRatio = def.speedMultiplier ? (1 / def.speedMultiplier).toFixed(1) : '1.0';

    const fuelFillClass = isMuscle ? 'fill-cyan' : (fuelPct > 50 ? 'fill-green' : (fuelPct > 20 ? 'fill-amber' : 'fill-danger'));
    const condFillClass = conditionPct > 60 ? 'fill-green' : (conditionPct > 30 ? 'fill-amber' : 'fill-danger');
    const cargoFillClass = cargoPct > 90 ? 'fill-danger' : (cargoPct > 70 ? 'fill-amber' : 'fill-green');

    const perkChips = [];
    perkChips.push(el('span', { class: 'hud-spec-chip' }, `⚡ ${speedRatio}x ${t('vehicle.spec.speed')}`));

    if (def.fieldClinic) {
      perkChips.push(el('span', { class: 'hud-spec-chip is-perk' }, `🚑 ${t('vehicle.spec.field_clinic')}`));
    }
    if (def.arcticTracked) {
      perkChips.push(el('span', { class: 'hud-spec-chip is-perk' }, `🚜 ${t('vehicle.spec.arctic_tracked')}`));
    }
    if (isMuscle) {
      perkChips.push(el('span', { class: 'hud-spec-chip is-perk' }, `🚋 ${t('vehicle.spec.muscle_powered')}`));
    }
    if (def.amphibious) {
      perkChips.push(el('span', { class: 'hud-spec-chip is-perk' }, `🚤 ${t('vehicle.spec.amphibious')}`));
    }
    if (def.cabinShelter) {
      perkChips.push(el('span', { class: 'hud-spec-chip is-perk' }, `🛡️ ${t('vehicle.spec.cabin')}`));
    }
    if (Array.isArray(vehicle.upgrades)) {
      for (const upId of vehicle.upgrades) {
        perkChips.push(el('span', { class: 'hud-spec-chip' }, t(`vehicle.upgrade.${upId}.name`)));
      }
    }

    const canCamp = VehicleEngine.canCampInVehicle(vehicle, def);

    return el(
      'section',
      { class: 'vehicle-dashboard-hud' },
      el(
        'div',
        { class: 'vehicle-hud-header' },
        el(
          'div',
          { class: 'vehicle-hud-title-wrap' },
          el('span', { class: 'vehicle-hud-glyph' }, def.glyph || '🚙'),
          el('strong', { class: 'vehicle-hud-name' }, t(def.nameKey)),
        ),
        el('span', { class: 'vehicle-hud-badge is-driving' }, `● ${t('vehicle.status.driving')}`),
      ),
      el(
        'div',
        { class: 'hud-meters-grid' },
        el(
          'div',
          { class: 'hud-meter-col' },
          el(
            'div',
            { class: 'hud-meter-label' },
            el('span', {}, isMuscle ? t('vehicle.fuel.muscle_label') : t('vehicle.gauge.fuel')),
            el('span', {}, `${fuelPct}%`),
          ),
          el('div', { class: 'hud-meter-val' }, isMuscle ? '∞ (0 L/100km)' : `${vehicle.fuelLiters}/${maxFuel} L`),
          el('div', { class: 'hud-meter-bar' }, el('div', { class: ['hud-meter-fill', fuelFillClass], style: `width: ${fuelPct}%` })),
        ),
        el(
          'div',
          { class: 'hud-meter-col' },
          el(
            'div',
            { class: 'hud-meter-label' },
            el('span', {}, t('vehicle.gauge.condition')),
            el('span', {}, `${conditionPct}%`),
          ),
          el('div', { class: 'hud-meter-val' }, `%${conditionPct}`),
          el('div', { class: 'hud-meter-bar' }, el('div', { class: ['hud-meter-fill', condFillClass], style: `width: ${conditionPct}%` })),
        ),
        el(
          'div',
          { class: 'hud-meter-col' },
          el(
            'div',
            { class: 'hud-meter-label' },
            el('span', {}, t('vehicle.trunk_load')),
            el('span', {}, `${cargoPct}%`),
          ),
          el('div', { class: 'hud-meter-val' }, `${cargoWeight}/${maxCargo} kg`),
          el('div', { class: 'hud-meter-bar' }, el('div', { class: ['hud-meter-fill', cargoFillClass], style: `width: ${cargoPct}%` })),
        ),
      ),
      el('div', { class: 'hud-specs-strip' }, ...perkChips),
      el(
        'div',
        { class: 'hud-actions-bar' },
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent',
            onClick: () => this.#engine.dispatch('vehicles/openModal', { vehicleId: vehicle.id }),
          },
          `📦 ${t('vehicle.action_open_trunk')}`,
        ),
        canCamp
          ? el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost',
                onClick: () => this.#engine.dispatch('vehicles/camp', { vehicleId: vehicle.id, hours: 4 }),
              },
              `🏕️ ${t('vehicle.action.camp_4h')}`,
            )
          : null,
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost',
            onClick: () => this.#engine.dispatch('vehicles/dismount'),
          },
          `🛑 ${t('vehicle.action_dismount')}`,
        ),
      ),
    );
  }

  #renderParkedVehiclesCard(state, nodeId) {
    const parked = VehicleEngine.getVehiclesInSector(state, nodeId).filter(
      (v) => v.id !== state.vehicles?.mountedVehicleId,
    );
    if (!parked.length) return null;

    return el(
      'section',
      { class: 'panel-block parked-vehicles-block' },
      el('span', { class: 'meta-label' }, `🅿️ ${t('vehicle.parked_in_sector')}`),
      ...parked.map((v) => {
        const def = VEHICLE_CATALOG[v.id];
        if (!def) return null;
        const isMuscle = Boolean(def.musclePowered || def.fuelType === 'muscle');
        const maxFuel = VehicleEngine.getEffectiveMaxFuel(v, def);
        const cargoWeight = VehicleEngine.getCargoWeight(v);
        const maxCargo = VehicleEngine.getEffectiveTrunkCapacity(v, def);
        const canMount = Boolean(v.restored && (isMuscle || v.fuelLiters > 0));

        return el(
          'div',
          { class: 'parked-vehicle-card' },
          el(
            'div',
            { class: 'parked-card-header' },
            el(
              'div',
              { class: 'vehicle-hud-title-wrap' },
              el('span', { class: 'vehicle-hud-glyph' }, def.glyph || '🚙'),
              el('strong', { class: 'vehicle-hud-name' }, t(def.nameKey)),
            ),
            el(
              'span',
              { class: ['vehicle-hud-badge', v.restored ? 'is-parked' : 'is-broken'].join(' ') },
              v.restored ? `● ${t('vehicle.status.ready')}` : `▲ ${t('vehicle.status.needs_repair')}`,
            ),
          ),
          el(
            'div',
            { class: 'parked-card-summary' },
            el('span', {}, `${t('vehicle.gauge.fuel')}: ${isMuscle ? '∞ (0 L)' : `${v.fuelLiters}/${maxFuel} L`}`),
            el('span', {}, `${t('vehicle.gauge.condition')}: %${v.condition}`),
            el('span', {}, `${t('vehicle.trunk_load')}: ${cargoWeight}/${maxCargo} kg`),
          ),
          el(
            'div',
            { class: 'parked-card-actions' },
            canMount
              ? el(
                  'button',
                  {
                    type: 'button',
                    class: 'btn btn-accent',
                    onClick: () => this.#engine.dispatch('vehicles/mount', { vehicleId: v.id }),
                  },
                  `🚙 ${t('vehicle.action_mount')}`,
                )
              : null,
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost',
                onClick: () => this.#engine.dispatch('vehicles/openModal', { vehicleId: v.id }),
              },
              `🛠️ ${t('vehicle.action_inspect')}`,
            ),
          ),
        );
      }).filter(Boolean),
    );
  }

  #renderSelectedBanner(state, current, selected) {
    const directPlan = estimateJourney(state, current.id, selected.id);
    return el(
      'section',
      { class: 'panel-block selected-target-block' },
      el(
        'div',
        { class: 'sector-header' },
        el(
          'div',
          {},
          el('span', { class: 'meta-label' }, t('map.selected_sector')),
          el('strong', { class: 'sector-title' }, t(`location.${selected.id}`)),
          el(
            'div',
            { class: 'route-meta' },
            el('span', {}, `${t(`biome.${selected.biome}`)} · ${this.#formatCoords(selected)}`),
            directPlan
              ? el(
                  'span',
                  {},
                  directPlan.isDriving
                    ? `🚙 ${directPlan.km} km · ~${(directPlan.minutes / 60).toFixed(1)}h (${directPlan.fuelNeeded}L)`
                    : `${directPlan.km} km · ~${(directPlan.minutes / 60).toFixed(1)}h`,
                )
              : el('span', { class: 'tone-warn' }, t('map.no_direct_corridor')),
          ),
        ),
        directPlan && el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent',
            onClick: () => this.#engine.dispatch('map/travel', { toId: selected.id }),
          },
          `${t('map.action.travel')} → ${t(`location.${selected.id}`)}`,
        ),
      ),
    );
  }

  #renderRoutesList(state, current, selected) {
    const edges = neighborsOf(current.id);
    const items = edges.map((edge) => {
      const target = getNode(edge.to);
      const vis = nodeVisibility(state, edge.to);
      const plan = estimateJourney(state, current.id, edge.to);
      const hours = (plan.minutes / 60).toFixed(1);
      const riskPct = Math.round(plan.risk * 100);
      const isSelected = selected.id === edge.to;

      return el(
        'li',
        {
          class: ['route-card', isSelected && 'is-selected'],
          onClick: () => this.#engine.dispatch('map/select', { nodeId: edge.to }),
        },
        el(
          'div',
          { class: 'route-main' },
          el(
            'div',
            { class: 'route-title-line' },
            el('span', { class: 'route-name' }, t(`location.${target.id}`)),
            el('span', { class: 'route-mode-tag' }, t(`map.mode.${edge.mode}`)),
            vis === 'visited' && el('span', { class: 'route-visited-tag' }, t('map.visited_badge')),
          ),
          el(
            'div',
            { class: 'route-meta' },
            el('span', {}, `${t(`biome.${target.biome}`)} · ${plan.km} km`),
            el('span', {}, plan.isDriving ? `🚙 ~${hours}h (${plan.fuelNeeded}L)` : `~${hours}h`),
            el('span', { class: riskPct >= 45 ? 'tone-warn' : '' }, `${t('map.risk')} ${riskPct}%`),
          ),
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-accent btn-xs',
            onClick: (event) => {
              event.stopPropagation();
              this.#engine.dispatch('map/travel', { toId: edge.to });
            },
          },
          t('map.action.travel'),
        ),
      );
    });

    const ROUTES_PER_PAGE = 3;
    const totalPages = Math.max(1, Math.ceil(items.length / ROUTES_PER_PAGE));
    this.#corridorsPage = Math.min(Math.max(1, this.#corridorsPage || 1), totalPages);
    const startIndex = (this.#corridorsPage - 1) * ROUTES_PER_PAGE;
    const pagedItems = items.slice(startIndex, startIndex + ROUTES_PER_PAGE);

    const paginationBar = totalPages > 1
      ? el(
        'div',
        { class: 'pagination-bar' },
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', 'btn-page', this.#corridorsPage <= 1 && 'is-disabled'],
            disabled: this.#corridorsPage <= 1,
            onClick: () => {
              this.#corridorsPage = Math.max(1, this.#corridorsPage - 1);
              if (this.#lastState) this.#renderDossier(this.#lastState);
            },
          },
          '◀',
        ),
        el(
          'span',
          { class: 'page-indicator' },
          t('ui.page', { current: this.#corridorsPage, total: totalPages }),
        ),
        el(
          'button',
          {
            type: 'button',
            class: ['btn', 'btn-xs', 'btn-page', this.#corridorsPage >= totalPages && 'is-disabled'],
            disabled: this.#corridorsPage >= totalPages,
            onClick: () => {
              this.#corridorsPage = Math.min(totalPages, this.#corridorsPage + 1);
              if (this.#lastState) this.#renderDossier(this.#lastState);
            },
          },
          '▶',
        ),
      )
      : null;

    return el(
      'section',
      { class: 'panel-block' },
      el('h3', { class: 'block-title' }, t('map.section.routes')),
      el('ul', { class: 'routes-list' }, pagedItems),
      paginationBar,
    );
  }

  #renderModalOverlay(state) {
    if (state.combat.activeEngagement) {
      this.#renderCombatCard(state, state.combat.activeEngagement);
      return;
    }
    const info = describeEncounter(state, state.world.encounter);
    if (info) {
      this.#renderEncounterCard(info);
      return;
    }
    this.#encounterHostEl.replaceChildren();
    this.#encounterHostEl.hidden = true;
  }

  #getEnemyAvatar(enemyId, enemy) {
    if (enemyId.includes('hound') || enemyId.includes('wolf') || enemyId.includes('dog')) return '🐺';
    if (enemyId.includes('mutant') || enemyId.includes('stalker') || enemyId.includes('crawler')) return '☣️';
    if (enemyId.includes('sniper') || enemyId.includes('marksman')) return '🎯';
    if (enemyId.includes('soldier') || enemyId.includes('deserter') || enemyId.includes('guard')) return '🎖️';
    if (enemyId.includes('sentinel') || enemyId.includes('heavy') || enemyId.includes('brute')) return '🛡️';
    if (enemyId.includes('scout') || enemyId.includes('raider') || enemyId.includes('bandit')) return '🥷';
    if (enemy?.ranged) return '🔫';
    return '💀';
  }

  #renderClashBox(engagement, enemyNameStr) {
    const playerAction = engagement.lastPlayerAction;
    const enemyAction = engagement.lastEnemyAction;

    if (!playerAction && !enemyAction) {
      return el(
        'div',
        { class: 'combat-clash-box' },
        el('span', { class: 'clash-neutral' }, t('combat.ui.clash_round_start')),
      );
    }

    const lines = [];

    if (playerAction) {
      if (playerAction.type === 'attack') {
        if (playerAction.hit) {
          const zoneName = t(`combat.zone.${playerAction.zone}`);
          if (playerAction.isCritical) {
            lines.push(
              el(
                'span',
                { class: 'clash-player-crit' },
                t('combat.ui.clash_player_crit', { dmg: playerAction.dmg }),
              ),
            );
          } else {
            lines.push(
              el(
                'span',
                { class: 'clash-player-hit' },
                t('combat.ui.clash_player_hit', { zone: zoneName, dmg: playerAction.dmg }),
              ),
            );
          }
        } else {
          lines.push(
            el(
              'span',
              { class: 'clash-neutral' },
              t('combat.ui.clash_player_miss'),
            ),
          );
        }
      }
    }

    if (enemyAction) {
      if (enemyAction.type === 'hit') {
        const hitText = enemyAction.absorbed
          ? t('combat.ui.clash_enemy_absorbed', { name: enemyNameStr, dmg: enemyAction.dmg })
          : t('combat.ui.clash_enemy_hit', { name: enemyNameStr, dmg: enemyAction.dmg });
        lines.push(el('span', { class: 'clash-enemy-hit' }, hitText));
      } else if (enemyAction.type === 'miss') {
        lines.push(
          el(
            'span',
            { class: 'clash-player-hit' },
            t('combat.ui.clash_enemy_miss', { name: enemyNameStr }),
          ),
        );
      } else if (enemyAction.type === 'advance') {
        lines.push(
          el(
            'span',
            { class: 'clash-neutral' },
            t('combat.ui.clash_enemy_advance', {
              name: enemyNameStr,
              range: t(`combat.range.${enemyAction.range}`),
            }),
          ),
        );
      } else if (enemyAction.type === 'cover') {
        lines.push(
          el(
            'span',
            { class: 'clash-neutral' },
            t('combat.ui.clash_enemy_cover', { name: enemyNameStr }),
          ),
        );
      } else if (enemyAction.type === 'suppressed') {
        lines.push(
          el(
            'span',
            { class: 'clash-player-hit' },
            t('combat.ui.clash_enemy_suppressed'),
          ),
        );
      } else if (enemyAction.type === 'crippled') {
        lines.push(
          el(
            'span',
            { class: 'clash-neutral' },
            t('combat.ui.clash_enemy_crippled', { name: enemyNameStr }),
          ),
        );
      }
    }

    return el('div', { class: 'combat-clash-box' }, ...lines);
  }

  #renderCombatCard(state, engagement) {
    this.#encounterHostEl.hidden = false;
    const enemy = getEnemy(engagement.enemyId);
    const enemyNameStr = t(`enemy.${engagement.enemyId}.name`);
    const weapon = weaponProfile(state);
    const weaponLabel = weapon.itemId ? t(`item.${weapon.itemId}.name`) : t('inventory.unarmed');
    const weather = state.environment?.currentWeather || 'clear_sky';
    const rangeProf = getWeaponRangeProfile(weapon.itemId);

    const isSurrendered = Boolean(engagement.enemyStatus?.surrendered);
    const isJammed = Boolean(engagement.weaponJammed);
    const rangeName = t(`combat.range.${engagement.range || 'medium'}`);
    const rangeMeter = RANGE_METERS[engagement.range || 'medium'] || '40m';
    const playerCoverName = t(`combat.cover.${engagement.playerCover || 'none'}`);
    const enemyCoverName = t(`combat.cover.${engagement.enemyCover || 'none'}`);

    // Player vitals
    const playerHp = Math.max(0, Math.min(100, Math.round(state.player?.health ?? 100)));
    const playerMaxHp = BALANCE.vitals?.max || 100;
    const playerHpPct = Math.max(0, Math.min(100, Math.round((playerHp / playerMaxHp) * 100)));
    const playerHpTone = playerHpPct > 50 ? 'is-good' : (playerHpPct > 25 ? 'is-warn' : 'is-crit');

    // Enemy vitals
    const enemyHp = Math.max(0, Math.round(engagement.hp));
    const enemyMaxHp = Math.max(1, Math.round(engagement.maxHp));
    const enemyHpPct = Math.max(0, Math.min(100, Math.round((enemyHp / enemyMaxHp) * 100)));

    // Real-time Tactical Hit Odds
    const headPct = Math.round(calculateTacticalHitChance({
      state,
      weaponProfile: weapon,
      range: engagement.range,
      targetZone: TARGET_ZONES.HEAD,
      defenderCover: engagement.enemyCover,
      enemy,
      weather,
      aimBonus: engagement.aimBonus,
    }) * 100);

    const torsoPct = Math.round(calculateTacticalHitChance({
      state,
      weaponProfile: weapon,
      range: engagement.range,
      targetZone: TARGET_ZONES.TORSO,
      defenderCover: engagement.enemyCover,
      enemy,
      weather,
      aimBonus: engagement.aimBonus,
    }) * 100);

    const legsPct = Math.round(calculateTacticalHitChance({
      state,
      weaponProfile: weapon,
      range: engagement.range,
      targetZone: TARGET_ZONES.LEGS,
      defenderCover: engagement.enemyCover,
      enemy,
      weather,
      aimBonus: engagement.aimBonus,
    }) * 100);

    const armsPct = Math.round(calculateTacticalHitChance({
      state,
      weaponProfile: weapon,
      range: engagement.range,
      targetZone: TARGET_ZONES.ARMS,
      defenderCover: engagement.enemyCover,
      enemy,
      weather,
      aimBonus: engagement.aimBonus,
    }) * 100);

    const activeZone = this.#aimTargetZone || TARGET_ZONES.TORSO;
    const activeOdds = activeZone === TARGET_ZONES.HEAD
      ? headPct
      : activeZone === TARGET_ZONES.LEGS
      ? legsPct
      : activeZone === TARGET_ZONES.ARMS
      ? armsPct
      : torsoPct;

    const activeZoneLabel = t(`combat.ui.zone_${activeZone}`) || t(`combat.zone.${activeZone}`);

    // Range Band Strip
    const rangeStrip = el(
      'div',
      { class: 'tactical-range-strip' },
      ...RANGE_BANDS.map((band) => {
        const isActive = band === (engagement.range || 'medium');
        const isOptimal = rangeProf.optimal.includes(band);
        const isUsable = rangeProf.usable.includes(band);
        return el(
          'div',
          {
            class: [
              'range-strip-step',
              isActive && 'is-active',
              isOptimal && 'is-optimal',
              !isUsable && 'is-out-of-range',
            ].filter(Boolean).join(' '),
          },
          el('span', { class: 'range-step-name' }, t(`combat.range_short.${band}`)),
          el('span', { class: 'range-meter-sub' }, RANGE_METERS[band]),
          isOptimal ? el('span', { class: 'range-opt-tag' }, 'OPT') : null,
        );
      }),
    );

    // Enemy Intent Alert Bar
    const intentKey = engagement.enemyIntent?.key || 'combat.intent.attack';
    const intentBox = !isSurrendered
      ? el(
          'div',
          { class: 'tactical-intent-box' },
          el('span', { class: 'intent-icon' }, '⚠️'),
          el(
            'div',
            { class: 'intent-text-wrap' },
            el('span', { class: 'intent-label' }, `${t('combat.enemy_intent_label')}: `),
            el('strong', { class: 'intent-desc' }, t(intentKey, { name: enemyNameStr })),
          ),
        )
      : null;

    // Duel Arena
    const duelArena = el(
      'div',
      { class: 'combat-duel-arena' },
      // Left: Player
      el(
        'div',
        { class: 'combat-fighter is-player' },
        el(
          'div',
          { class: 'fighter-header' },
          el('div', { class: 'fighter-avatar' }, '👤'),
          el(
            'div',
            { class: 'fighter-name-cluster' },
            el('span', { class: 'fighter-role' }, t('combat.ui.player_role')),
            el('span', { class: 'fighter-name' }, state.character?.name || t('combat.ui.player_role')),
          ),
        ),
        el(
          'div',
          { class: 'fighter-hp-bar' },
          el('div', { class: ['fighter-hp-fill', playerHpTone].join(' '), style: `width: ${playerHpPct}%` }),
        ),
        el(
          'div',
          { style: 'display: flex; justify-content: space-between; align-items: center; width: 100%;' },
          el('span', { class: 'fighter-hp-val' }, `${playerHp}/${playerMaxHp} HP`),
          el('span', { class: 'fighter-gear-tag' }, weaponLabel),
        ),
        el(
          'div',
          { class: 'fighter-status-row' },
          engagement.playerCover !== 'none' &&
            el('span', { class: 'tactical-badge is-good' }, `🛡️ ${playerCoverName}`),
          engagement.aimBonus &&
            el('span', { class: 'tactical-badge is-highlight' }, `🎯 ${t('combat.status.aimed')}`),
          engagement.stance === 'overwatch' &&
            el('span', { class: 'tactical-badge is-highlight' }, `👁️ ${t('combat.status.overwatch')}`),
        ),
      ),

      // Center: VS / Distance Badge
      el(
        'div',
        { class: 'combat-duel-vs' },
        el('div', { class: 'combat-duel-badge' }, `⚡ ${rangeMeter} ⚡`),
        el('span', { style: 'font-size: 8px; color: var(--ink-muted); text-transform: uppercase;' }, rangeName),
      ),

      // Right: Enemy
      el(
        'div',
        { class: 'combat-fighter is-enemy' },
        el(
          'div',
          { class: 'fighter-header' },
          el('div', { class: 'fighter-avatar' }, this.#getEnemyAvatar(engagement.enemyId, enemy)),
          el(
            'div',
            { class: 'fighter-name-cluster' },
            el('span', { class: 'fighter-role' }, t('combat.ui.enemy_role')),
            el('span', { class: 'fighter-name' }, enemyNameStr),
          ),
        ),
        el(
          'div',
          { class: 'fighter-hp-bar' },
          el('div', { class: 'fighter-hp-fill is-enemy-fill', style: `width: ${enemyHpPct}%` }),
        ),
        el(
          'div',
          { style: 'display: flex; justify-content: space-between; align-items: center; width: 100%;' },
          el('span', { class: 'fighter-gear-tag' }, enemy.ranged ? '🔫 Ranged' : '🔪 Melee'),
          el('span', { class: 'fighter-hp-val' }, `${enemyHp}/${enemyMaxHp} HP`),
        ),
        el(
          'div',
          { class: 'fighter-status-row' },
          engagement.enemyCover !== 'none' &&
            el('span', { class: 'tactical-badge is-good' }, `🧱 ${enemyCoverName}`),
          engagement.enemyStatus?.suppressed &&
            el('span', { class: 'tactical-badge is-good' }, `💥 ${t('combat.status.suppressed')}`),
          engagement.enemyStatus?.fracturedLeg &&
            el('span', { class: 'tactical-badge is-good' }, `🦵 ${t('combat.status.leg_crippled')}`),
          engagement.enemyStatus?.disarmed &&
            el('span', { class: 'tactical-badge is-good' }, `🖐️ ${t('combat.status.disarmed')}`),
        ),
      ),
    );

    // Clash Box (Feedback from the last exchange)
    const clashBox = this.#renderClashBox(engagement, enemyNameStr);

    // Target Selection Pills (Gövde / Kafa / Bacak / Kol)
    const targetPills = [
      { id: TARGET_ZONES.TORSO, label: `🎯 ${t('combat.ui.zone_torso')}`, odds: `${torsoPct}% · 1.0×` },
      { id: TARGET_ZONES.HEAD, label: `💀 ${t('combat.ui.zone_head')}`, odds: `${headPct}% · 2.4×` },
      { id: TARGET_ZONES.LEGS, label: `🦵 ${t('combat.ui.zone_legs')}`, odds: `${legsPct}% · ${t('combat.ui.zone_legs')}` },
      { id: TARGET_ZONES.ARMS, label: `🖐️ ${t('combat.ui.zone_arms')}`, odds: `${armsPct}% · ${t('combat.ui.zone_arms')}` },
    ].map((z) => {
      const isSelected = activeZone === z.id;
      return el(
        'button',
        {
          type: 'button',
          class: ['target-pill-btn', isSelected && 'is-selected'].filter(Boolean).join(' '),
          onClick: () => {
            this.#aimTargetZone = z.id;
            if (this.#lastState && this.#lastState.combat?.activeEngagement) {
              this.#renderCombatCard(this.#lastState, this.#lastState.combat.activeEngagement);
            }
          },
        },
        el('span', { class: 'target-pill-name' }, z.label),
        el('span', { class: 'target-pill-odds' }, z.odds),
      );
    });

    const targetSelector = el('div', { class: 'combat-target-selector' }, ...targetPills);

    // Primary Attack Button
    const attackBtnLabel = weapon.ammoId
      ? `⚔️ ${t('combat.ui.btn_attack')} [${activeZoneLabel}]`
      : `⚔️ ${t('combat.ui.btn_strike')} [${activeZoneLabel}]`;

    const attackBtnOdds = weapon.ammoId
      ? `%${activeOdds} · ${weapon.loaded} / ${weapon.capacity || '∞'}`
      : `%${activeOdds} · -1 STAM`;

    const primaryAttackBtn = el(
      'button',
      {
        type: 'button',
        class: 'btn-combat-primary-attack',
        onClick: () => this.#engine.dispatch('combat/action', { move: 'targeted', zone: activeZone }),
      },
      el('span', {}, attackBtnLabel),
      el('span', { style: 'font-family: var(--font-mono); font-size: 11px; opacity: 0.9;' }, attackBtnOdds),
    );

    // Maneuver Grid (2x2)
    const coverBtn = el(
      'button',
      {
        type: 'button',
        class: ['btn', 'btn-xs', 'encounter-choice-btn', engagement.playerCover !== 'none' && engagement.stance === 'overwatch' && 'is-disabled'].filter(Boolean).join(' '),
        disabled: engagement.playerCover !== 'none' && engagement.stance === 'overwatch',
        onClick: () => {
          if (engagement.playerCover === 'none') {
            this.#engine.dispatch('combat/action', { move: 'take_cover' });
          } else {
            this.#engine.dispatch('combat/action', { move: 'overwatch' });
          }
        },
      },
      el('span', {}, engagement.playerCover === 'none' ? `🛡️ ${t('combat.action.take_cover')}` : `👁️ ${t('combat.action.overwatch')}`),
      el('span', { class: 'choice-odds' }, '-1 STAM'),
    );

    const aimBtn = el(
      'button',
      {
        type: 'button',
        class: ['btn', 'btn-xs', 'encounter-choice-btn', engagement.aimBonus && 'is-disabled'].filter(Boolean).join(' '),
        disabled: Boolean(engagement.aimBonus),
        onClick: () => this.#engine.dispatch('combat/action', { move: 'take_aim' }),
      },
      el('span', {}, `🎯 ${t('combat.action.take_aim')}`),
      el('span', { class: 'choice-odds' }, '-1 STAM · +25% ACC'),
    );

    const advanceBtn = el(
      'button',
      {
        type: 'button',
        class: ['btn', 'btn-xs', 'encounter-choice-btn', engagement.range === 'melee' && 'is-disabled'].filter(Boolean).join(' '),
        disabled: engagement.range === 'melee',
        onClick: () => this.#engine.dispatch('combat/action', { move: 'advance' }),
      },
      el('span', {}, `👟 ${t('combat.action.advance')}`),
      el('span', { class: 'choice-odds' }, '-2 STAM'),
    );

    const retreatBtn = el(
      'button',
      {
        type: 'button',
        class: ['btn', 'btn-xs', 'encounter-choice-btn', engagement.range === 'extreme' && 'is-disabled'].filter(Boolean).join(' '),
        disabled: engagement.range === 'extreme',
        onClick: () => this.#engine.dispatch('combat/action', { move: 'retreat' }),
      },
      el('span', {}, `↩ ${t('combat.action.retreat')}`),
      el('span', { class: 'choice-odds' }, '-2 STAM'),
    );

    const utilityGrid = el(
      'div',
      { class: 'combat-utility-grid' },
      coverBtn,
      aimBtn,
      advanceBtn,
      retreatBtn,
    );

    // Secondary Actions (Suppression, Escape, Scavenge)
    const secondaryActions = [];

    if (weapon.ammoId && weapon.loaded) {
      secondaryActions.push(
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-xs btn-accent encounter-choice-btn',
            style: 'flex: 1;',
            onClick: () => this.#engine.dispatch('combat/action', { move: 'suppress' }),
          },
          el('span', {}, `💥 ${t('combat.action.suppress')}`),
          el('span', { class: 'choice-odds' }, '-3 STAM · -2 AMMO'),
        ),
      );
    }

    secondaryActions.push(
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-xs btn-ghost encounter-choice-btn',
          style: 'flex: 1;',
          onClick: () => this.#engine.dispatch('combat/action', { move: 'flee' }),
        },
        el('span', {}, `🏃 ${t('combat.action.flee')}`),
        el('span', { class: 'choice-odds' }, '-3 STAM'),
      ),
    );

    if (!engagement.scavenged) {
      secondaryActions.push(
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn-xs encounter-choice-btn',
            style: 'flex: 1;',
            onClick: () => this.#engine.dispatch('combat/action', { move: 'scavenge' }),
          },
          el('span', {}, `🎒 ${t('combat.action.scavenge')}`),
          el('span', { class: 'choice-odds' }, t('combat.scavenge_tag')),
        ),
      );
    }

    const secondaryRow = el('div', { class: 'combat-secondary-row' }, ...secondaryActions);

    // Vehicle Actions (if vehicle mounted & fueled)
    const mounted = VehicleEngine.getMountedVehicle(state);
    const vehicleSection = mounted && mounted.vehicle.restored && mounted.vehicle.fuelLiters >= 0.8
      ? el(
          'div',
          { class: 'tactical-vehicle-actions', style: 'margin-top: 6px;' },
          el('div', { class: 'tactical-subhead' }, `🚗 ${t('vehicle.label.mounted_vehicle')}: ${t(mounted.def.nameKey)}`),
          el(
            'div',
            { class: 'tactical-target-grid' },
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-xs btn-accent encounter-choice-btn',
                onClick: () => this.#engine.dispatch('combat/action', { move: 'vehicle_ram' }),
              },
              el('span', {}, `💥 ${t('vehicle.action.ram_enemy')}`),
              el('span', { class: 'choice-odds' }, '-0.8L · 50-85 DMG'),
            ),
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-xs btn-ghost encounter-choice-btn',
                onClick: () => this.#engine.dispatch('combat/action', { move: 'vehicle_escape' }),
              },
              el('span', {}, `💨 ${t('vehicle.action.speed_away')}`),
              el('span', { class: 'choice-odds' }, '-1.0L · ESCAPE'),
            ),
          ),
        )
      : null;

    // Medical Stacks (Fast Heal)
    const medStacks = state.inventory.stacks.filter(
      ({ itemId }) => getItem(itemId).category === 'medical' && getItem(itemId).use,
    );

    const medRow = medStacks.length > 0
      ? el(
          'div',
          { class: 'ops-actions', style: 'margin-top: 6px;' },
          ...medStacks.map(({ itemId, qty }) =>
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-xs',
                onClick: () => this.#engine.dispatch('inventory/use', { itemId }),
              },
              `+ ${t(`item.${itemId}.name`)} (${qty})`,
            ),
          ),
        )
      : null;

    // Render Container
    const card = el(
      'div',
      { class: 'encounter-card combat-card' },
      el(
        'div',
        { class: 'encounter-kicker' },
        `${t('combat.kicker')} // ${t('combat.round', { round: engagement.round })}`,
      ),
      el('h3', { class: 'encounter-title', style: 'margin-bottom: 4px;' }, enemyNameStr),

      // Duel Arena
      duelArena,

      // Range Strip
      rangeStrip,

      // Enemy Intent Box
      intentBox,

      // Clash Box (Feedback)
      clashBox,

      // Surrender Banner
      isSurrendered &&
        el(
          'div',
          { class: 'tactical-banner banner-surrender' },
          t('combat.surrender_banner', { name: enemyNameStr }),
        ),

      // Jammed Banner
      !isSurrendered && isJammed &&
        el(
          'div',
          { class: 'tactical-banner banner-jam' },
          t('combat.jammed_banner'),
        ),

      // Dynamic Action Container
      isSurrendered
        ? el(
            'div',
            { class: 'encounter-choices' },
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-accent encounter-choice-btn',
                onClick: () => this.#engine.dispatch('combat/action', { move: 'spare' }),
              },
              el('span', {}, t('combat.action.spare')),
              el('span', { class: 'choice-odds' }, t('combat.spare_tag')),
            ),
            el(
              'button',
              {
                type: 'button',
                class: 'btn encounter-choice-btn',
                onClick: () => this.#engine.dispatch('combat/action', { move: 'execute' }),
              },
              el('span', {}, t('combat.action.execute')),
              el('span', { class: 'choice-odds' }, t('combat.execute_tag')),
            ),
          )
        : isJammed
        ? el(
            'div',
            { class: 'encounter-choices' },
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-accent encounter-choice-btn',
                onClick: () => this.#engine.dispatch('combat/action', { move: 'clear_jam' }),
              },
              el('span', {}, `🔧 ${t('combat.action.clear_jam')}`),
              el('span', { class: 'choice-odds' }, '-1 STAM'),
            ),
            coverBtn,
            el(
              'button',
              {
                type: 'button',
                class: 'btn btn-ghost encounter-choice-btn',
                onClick: () => this.#engine.dispatch('combat/action', { move: 'flee' }),
              },
              el('span', {}, t('combat.action.flee')),
              el('span', { class: 'choice-odds' }, '-3 STAM'),
            ),
          )
        : el(
            'div',
            { class: 'encounter-choices' },
            targetSelector,
            primaryAttackBtn,
            utilityGrid,
            secondaryRow,
            vehicleSection,
          ),

      medRow,
    );

    this.#encounterHostEl.replaceChildren(card);
  }

  #renderEncounterCard(info) {
    this.#encounterHostEl.hidden = false;
    const choiceBtns = info.choices.map((choice) => {
      const label = t(`encounter.${info.id}.choice.${choice.id}`);
      const badge = choice.check
        ? `${this.#checkLabel(choice.check)} ${Math.round(choice.check.chance * 100)}%`
        : null;

      return el(
        'button',
        {
          type: 'button',
          class: ['btn', 'encounter-choice-btn', !choice.available && 'is-disabled'],
          disabled: !choice.available,
          onClick: () => this.#engine.dispatch('encounter/choose', { choiceId: choice.id }),
        },
        el('span', { class: 'choice-label' }, label),
        badge && el('span', { class: 'choice-odds' }, badge),
      );
    });

    const card = el(
      'div',
      { class: 'encounter-card' },
      el(
        'div',
        { class: 'encounter-kicker' },
        `${t('encounter.kicker')} // ${t(`location.${info.nodeId}`)}`,
      ),
      el('h3', { class: 'encounter-title' }, t(`encounter.${info.id}.title`)),
      el('p', { class: 'encounter-text' }, t(`encounter.${info.id}.text`)),
      el('div', { class: 'encounter-choices' }, choiceBtns),
    );

    this.#encounterHostEl.replaceChildren(card);
  }

  #checkLabel(check) {
    if (check.kind === 'skill') return t(`skill.${check.skill}.name`);
    if (check.kind === 'combat') return t('encounter.check.combat');
    if (check.kind === 'gear') return t('encounter.check.gear');
    return '';
  }

  #formatCoords({ lat, lon }) {
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(1)}°${ns} ${Math.abs(lon).toFixed(1)}°${ew}`;
  }

  #setCamera({ x, y, width, height }) {
    const clampedW = Math.max(200, Math.min(MAP_VIEWBOX.width, width));
    const clampedH = Math.max(85, Math.min(MAP_VIEWBOX.height, height));
    const clampedX = Math.max(0, Math.min(MAP_VIEWBOX.width - clampedW, x));
    const clampedY = Math.max(0, Math.min(MAP_VIEWBOX.height - clampedH, y));
    this.#camera = { x: clampedX, y: clampedY, width: clampedW, height: clampedH };
    if (this.#svgEl) {
      this.#svgEl.setAttribute(
        'viewBox',
        `${clampedX.toFixed(1)} ${clampedY.toFixed(1)} ${clampedW.toFixed(1)} ${clampedH.toFixed(1)}`,
      );
    }
  }

  #pointers = new Map();
  #pinchDist = null;

  #bindPanZoom() {
    this.#viewportEl.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        this.zoomBy(event.deltaY < 0 ? 1.2 : 1 / 1.2);
      },
      { passive: false },
    );

    this.#viewportEl.addEventListener('pointerdown', (event) => {
      if (event.target.closest('.map-node, .map-ctrl-btn')) return;
      this.#pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (this.#pointers.size === 1) {
        this.#drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          camX: this.#camera.x,
          camY: this.#camera.y,
        };
      } else if (this.#pointers.size === 2) {
        const [p1, p2] = Array.from(this.#pointers.values());
        this.#pinchDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      }
      try {
        this.#viewportEl.setPointerCapture?.(event.pointerId);
      } catch {}
    });

    this.#viewportEl.addEventListener('pointermove', (event) => {
      if (this.#pointers.has(event.pointerId)) {
        this.#pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }

      if (this.#pointers.size === 2 && this.#pinchDist) {
        const [p1, p2] = Array.from(this.#pointers.values());
        const newDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        const factor = newDist / this.#pinchDist;
        if (Math.abs(factor - 1) > 0.03) {
          this.zoomBy(factor);
          this.#pinchDist = newDist;
        }
        return;
      }

      if (!this.#drag || event.pointerId !== this.#drag.pointerId) return;
      const rect = this.#viewportEl.getBoundingClientRect();
      const dx = ((event.clientX - this.#drag.startX) / rect.width) * this.#camera.width;
      const dy = ((event.clientY - this.#drag.startY) / rect.height) * this.#camera.height;
      this.#setCamera({
        x: this.#drag.camX - dx,
        y: this.#drag.camY - dy,
        width: this.#camera.width,
        height: this.#camera.height,
      });
    });

    const release = (event) => {
      this.#pointers.delete(event.pointerId);
      if (this.#pointers.size < 2) this.#pinchDist = null;
      if (this.#drag && event.pointerId === this.#drag.pointerId) {
        this.#drag = null;
      }
    };
    this.#viewportEl.addEventListener('pointerup', release);
    this.#viewportEl.addEventListener('pointercancel', release);
  }
}
