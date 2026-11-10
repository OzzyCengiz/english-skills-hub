import { ref } from '../../i18n/i18n.js';
import { SKILL_IDS, levelForXp } from './skillSelectors.js';

export const skillsModule = {
  id: 'skills',

  createState() {
    return Object.fromEntries(SKILL_IDS.map((skillId) => [skillId, { xp: 0 }]));
  },

  install({ store, effects, engine }) {
    store.registerMutations('skills', {
      addXp(state, { skill, amount }) {
        state.skills[skill].xp += amount;
      },
    });

    effects.register('xp', ({ skill, amount }) => {
      const before = levelForXp(store.state.skills[skill].xp);
      store.commit('skills/addXp', { skill, amount });
      const after = levelForXp(store.state.skills[skill].xp);
      if (after > before) {
        engine.log('log.skill.level_up', { skill: ref(`skill.${skill}.name`), level: after }, 'good');
      }
    });
  },
};

