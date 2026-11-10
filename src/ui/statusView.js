import { AILMENTS } from '../data/ailments.js';
import { SKILLS } from '../data/skills.js';
import { t, i18n } from '../i18n/i18n.js';
import { armorValue, combatRating, passiveBonus, weaponProfile } from '../modules/inventory/inventorySelectors.js';
import { SKILL_IDS, skillProgress } from '../modules/skills/skillSelectors.js';
import { VITALS, ailmentIntensity, vitalBand } from '../modules/status/statusSelectors.js';
import { BODY_PARTS } from '../modules/status/bodyStatus.js';
import { el } from './dom.js';

export class StatusView {
  #root;
  #engine;
  #activeTab = 'vitals';
  #lastState = null;

  constructor(root, engine = null) {
    this.#root = root;
    this.#engine = engine;
  }

  render(state) {
    this.#lastState = state;
    const { player } = state;

    const nav = el(
      'div',
      { class: 'status-page-nav' },
      el(
        'button',
        {
          type: 'button',
          class: ['status-page-btn', this.#activeTab === 'vitals' && 'is-active'],
          onClick: () => {
            this.#activeTab = 'vitals';
            this.render(this.#lastState);
          },
        },
        t('status.tabs.vitals'),
      ),
      el(
        'button',
        {
          type: 'button',
          class: ['status-page-btn', this.#activeTab === 'body' && 'is-active'],
          onClick: () => {
            this.#activeTab = 'body';
            this.render(this.#lastState);
          },
        },
        t('status.tabs.body'),
      ),
      el(
        'button',
        {
          type: 'button',
          class: ['status-page-btn', this.#activeTab === 'skills' && 'is-active'],
          onClick: () => {
            this.#activeTab = 'skills';
            this.render(this.#lastState);
          },
        },
        t('status.tabs.skills'),
      ),
    );

    let content = [];
    if (this.#activeTab === 'vitals') {
      content = [
        this.#renderDossier(player),
        this.#renderVitals(player),
        this.#renderReadout(state),
      ];
    } else if (this.#activeTab === 'body') {
      content = [
        this.#renderBodyTrauma(player, state),
        this.#renderAilments(player),
      ];
    } else {
      content = [
        this.#renderSkills(state),
      ];
    }

    this.#root.replaceChildren(...[nav, ...content].filter(Boolean));
  }

  #findBestTreatment(partId, part, stacks = []) {
    if (!stacks || stacks.length === 0) return null;
    const hasItem = (predicate) => stacks.find((s) => predicate(s.itemId))?.itemId || null;

    if (part.bleeding === 'arterial') {
      return hasItem((id) => id.includes('tourniquet')) ||
        hasItem((id) => id.includes('quikclot') || id.includes('hemostatic') || id.includes('israeli') || id.includes('stapler') || id.includes('suture'));
    }
    if (part.bleeding === 'minor') {
      return hasItem((id) => id.includes('quikclot') || id.includes('bandage') || id.includes('gauze') || id.includes('plaster') || id.includes('suture') || id.includes('stapler') || id.includes('adhesive'));
    }
    if (part.punctured) {
      return hasItem((id) => id.includes('chest_seal') || id.includes('decompression_needle') || id.includes('airway'));
    }
    if (part.fractures) {
      return hasItem((id) => id.includes('splint') || id.includes('sling') || id.includes('collar') || id.includes('vet_wrap'));
    }
    if (part.burns) {
      return hasItem((id) => id.includes('burn') || id.includes('sulfadiazine') || id.includes('calamine') || id.includes('hydrocortisone'));
    }
    if (part.infectionRisk >= 25) {
      return hasItem((id) => id.includes('antiseptic') || id.includes('iodine') || id.includes('chlorhexidine') || id.includes('antibiotic') || id.includes('amoxicillin') || id.includes('ciprofloxacin') || id.includes('alcohol') || id.includes('peroxide'));
    }
    if (part.health < 80) {
      return hasItem((id) => id.includes('first_aid') || id.includes('ifak') || id.includes('bandage') || id.includes('gauze') || id.includes('saline'));
    }
    return null;
  }

  #renderBodyTrauma(player, state) {
    const body = player.body;
    if (!body) return el('div');
    const stacks = state?.inventory?.stacks || [];

    const cards = BODY_PARTS.map((partId) => {
      const part = body[partId];
      if (!part) return el('div');
      const hp = Math.round(part.health);
      const isDamaged = hp < 100 || part.bleeding !== 'none' || part.fractures || part.burns || part.punctured || part.infectionRisk > 20;

      const badges = [];
      if (part.bleeding === 'arterial') {
        badges.push(el('span', { class: 'status-tag tone-bad pulse-alert' }, `▲ ${t('status.body.condition.arterial_bleed')}`));
      } else if (part.bleeding === 'minor') {
        badges.push(el('span', { class: 'status-tag tone-bad' }, `● ${t('status.body.condition.minor_bleed')}`));
      }
      if (part.fractures) {
        badges.push(el('span', { class: 'status-tag tone-warn' }, `✖ ${t('status.body.condition.fracture')}`));
      }
      if (part.punctured) {
        badges.push(el('span', { class: 'status-tag tone-bad' }, `☣ ${t('status.body.condition.pneumothorax')}`));
      }
      if (part.burns) {
        badges.push(el('span', { class: 'status-tag tone-warn' }, `♨ ${t('status.body.condition.burn')}`));
      }
      if (part.infectionRisk >= 25) {
        badges.push(el('span', { class: 'status-tag tone-warn' }, `☣ ${t('status.body.condition.infection')} ${Math.round(part.infectionRisk)}%`));
      }
      if (badges.length === 0) {
        badges.push(el('span', { class: 'status-tag tone-good' }, t('status.body.condition.intact')));
      }

      const meterTone = hp > 65 ? 'good' : (hp > 30 ? 'warn' : 'bad');

      // Direct treatment action if damaged
      let actionEl = null;
      if (isDamaged && this.#engine) {
        const bestItem = this.#findBestTreatment(partId, part, stacks);
        if (bestItem) {
          actionEl = el(
            'button',
            {
              type: 'button',
              class: 'btn btn-accent btn-xs body-part-treat-btn',
              style: 'margin-top: 6px; width: 100%; font-size: 0.72rem; padding: 4px 6px;',
              onClick: () => {
                this.#engine.dispatch('inventory/use', { itemId: bestItem });
              },
            },
            `💊 ${t('inventory.action.treat') || 'TEDAVİ ET'} (${t(`item.${bestItem}.name`) || bestItem})`
          );
        } else {
          actionEl = el(
            'span',
            { class: 'muted-note', style: 'font-size: 0.68rem; margin-top: 4px; display: block; opacity: 0.75;' },
            `⚠️ ${t('status.body.no_supplies') || 'Gereken tıbbi malzeme yok'}`
          );
        }
      }

      return el(
        'div',
        { class: ['body-part-card', isDamaged ? 'part-damaged' : 'part-healthy'] },
        el(
          'div',
          { class: 'body-part-head' },
          el('span', { class: 'body-part-name' }, t(`status.body.part.${partId}`)),
          el('strong', { class: ['body-part-hp', `tone-${meterTone}`] }, `${hp}%`),
        ),
        el(
          'div',
          { class: 'meter-track meter-thin' },
          el('div', { class: ['meter-fill', `fill-${meterTone}`], style: `width: ${Math.max(0, Math.min(100, hp))}%` }),
        ),
        el('div', { class: 'body-part-badges' }, badges),
        actionEl,
      );
    });

    return el(
      'section',
      { class: 'panel-block body-trauma-section' },
      el('h3', { class: 'block-title' }, t('status.section.body')),
      el('div', { class: 'body-parts-grid' }, cards),
    );
  }

  #renderDossier(player) {
    const name = player.name || t('character.default_name');
    const age = player.age ?? 28;
    const blood = player.bloodType ?? 'A+';
    const traitKey = player.trait ?? 'stoic';
    const archetypeKey = player.archetype ?? 'scavenger';

    return el(
      'section',
      { class: 'panel-block dossier-block' },
      el(
        'div',
        { class: 'dossier-id-row' },
        el(
          'div',
          { class: 'dossier-callsign-wrap' },
          el('span', { class: 'dossier-callsign-kicker' }, t('character.callsign_kicker')),
          el('strong', { class: 'dossier-callsign' }, name.toUpperCase()),
        ),
        el('span', { class: 'dossier-badge' }, t(`menu.archetype.${archetypeKey}.name`)),
      ),
      el(
        'div',
        { class: 'dossier-stats-strip' },
        el(
          'div',
          { class: 'dossier-stat' },
          el('span', { class: 'dossier-stat-label' }, t('character.label.age')),
          el('strong', { class: 'dossier-stat-value' }, String(age)),
        ),
        el(
          'div',
          { class: 'dossier-stat' },
          el('span', { class: 'dossier-stat-label' }, t('character.label.blood')),
          el('strong', { class: 'dossier-stat-value' }, blood),
        ),
        el(
          'div',
          { class: 'dossier-stat' },
          el('span', { class: 'dossier-stat-label' }, t('character.label.trait')),
          el('strong', { class: 'dossier-stat-value' }, t(`trait.${traitKey}.name`)),
        ),
      ),
    );
  }

  #renderVitals(player) {
    const rows = VITALS.map((vital) => {
      const value = Math.round(player[vital]);
      const band = vitalBand(value);
      return el(
        'div',
        { class: ['vital-row', `band-${band}`] },
        el(
          'div',
          { class: 'vital-head' },
          el('span', { class: 'vital-label' }, t(`status.vital.${vital}`)),
          el(
            'div',
            { class: 'vital-meta' },
            el('span', { class: 'vital-band-tag' }, t(`status.band.${band}`)),
            el('span', { class: 'vital-value' }, `${value}%`),
          ),
        ),
        el(
          'div',
          { class: 'meter-track' },
          el('div', { class: 'meter-fill', style: `width: ${Math.max(0, Math.min(100, value))}%` }),
        ),
      );
    });

    return el(
      'section',
      { class: 'panel-block' },
      el('h3', { class: 'block-title' }, t('status.section.vitals')),
      el('div', { class: 'vitals-list' }, rows),
    );
  }

  #renderAilments(player) {
    const entries = Object.entries(player.ailments);
    const body = entries.length === 0
      ? el('p', { class: 'muted-note' }, t('status.no_ailments'))
      : el(
        'ul',
        { class: 'ailment-list' },
        entries.map(([id, data]) => {
          const def = AILMENTS[id];
          const pct = Math.round(ailmentIntensity(id, data) * 100);
          const detail = this.#describeAilment(id, data);
          return el(
            'li',
            { class: ['ailment-item', `tone-${def.tone}`] },
            el(
              'div',
              { class: 'ailment-head' },
              el('span', { class: 'ailment-glyph' }, def.glyph),
              el('span', { class: 'ailment-name' }, t(`ailment.${id}.name`)),
              el('span', { class: 'ailment-detail' }, detail),
            ),
            el(
              'div',
              { class: 'meter-track meter-thin' },
              el('div', { class: 'meter-fill', style: `width: ${pct}%` }),
            ),
            el('p', { class: 'ailment-desc' }, t(`ailment.${id}.desc`)),
          );
        }),
      );

    return el(
      'section',
      { class: 'panel-block' },
      el('h3', { class: 'block-title' }, t('status.section.conditions')),
      body,
    );
  }

  #describeAilment(id, data) {
    if (id === 'bleeding') return t('ailment.bleeding.severity', { severity: data.severity });
    if (id === 'infection') return `${Math.round(data.progress)}%`;
    if (id === 'sprain') return t('ailment.sprain.remaining', { hours: Math.ceil(data.hours) });
    if (id === 'pain') return `${t('status.label.severity') || 'Şiddet'}: ${Math.round(data.severity || 1)}`;
    if (id === 'poison') return `${Math.round(data.severity || 10)}%`;
    return '';
  }

  #renderReadout(state) {
    const weapon = weaponProfile(state);
    const weaponLabel = weapon.itemId ? t(`item.${weapon.itemId}.name`) : t('inventory.unarmed');
    const scavengeBonus = Math.round(passiveBonus(state, 'scavengeBonus') * 100);
    const travelBonus = Math.round(passiveBonus(state, 'travelSpeed') * 100);

    const stats = [
      [t('status.readout.weapon'), weapon.loaded ? weaponLabel : `${weaponLabel} (${t('inventory.no_ammo')})`],
      [t('status.readout.combat_rating'), i18n.formatNumber(combatRating(state), 1)],
      [t('status.readout.armor'), String(armorValue(state))],
      [t('status.readout.scavenge_bonus'), `+${scavengeBonus}%`],
      [t('status.readout.travel_bonus'), `+${travelBonus}%`],
    ];

    return el(
      'section',
      { class: 'panel-block' },
      el('h3', { class: 'block-title' }, t('status.section.readout')),
      el(
        'dl',
        { class: 'kv-grid' },
        stats.flatMap(([label, val]) => [
          el('dt', {}, label),
          el('dd', {}, val),
        ]),
      ),
    );
  }

  #renderSkills(state) {
    const rows = SKILL_IDS.map((skillId) => {
      const def = SKILLS[skillId];
      const progress = skillProgress(state, skillId);
      const pct = Math.round(progress.ratio * 100);
      const xpNote = progress.next
        ? `${progress.xp} / ${progress.next} XP`
        : t('skill.max_level');

      return el(
        'div',
        { class: 'skill-row' },
        el(
          'div',
          { class: 'skill-head' },
          el('span', { class: 'skill-glyph' }, def.glyph),
          el('span', { class: 'skill-name' }, t(`skill.${skillId}.name`)),
          el('span', { class: 'skill-level' }, t('skill.level_short', { level: progress.level })),
          el('span', { class: 'skill-xp' }, xpNote),
        ),
        el(
          'div',
          { class: 'meter-track meter-thin' },
          el('div', { class: 'meter-fill', style: `width: ${pct}%` }),
        ),
        el('p', { class: 'skill-desc' }, t(`skill.${skillId}.desc`)),
      );
    });

    return el(
      'section',
      { class: 'panel-block' },
      el('h3', { class: 'block-title' }, t('status.section.skills')),
      el('div', { class: 'skills-list' }, rows),
    );
  }
}

