import { RECIPES, getRecipe } from '../../data/recipes.js';
import { activeWorkbenchTier, canAffordCost } from '../base/index.js';
import { countItem } from '../inventory/inventoryModel.js';
import { grantItems } from '../inventory/index.js';
import { codexManager } from '../../core/codexManager.js';
import { ref } from '../../i18n/i18n.js';
import { audioEngine } from '../../core/audioEngine.js';

export function maxCraftableCount(state, recipeId) {
  const recipe = getRecipe(recipeId);
  if (activeWorkbenchTier(state) < recipe.tier) return 0;
  let max = Infinity;
  for (const { itemId, qty } of recipe.ingredients) {
    const have = countItem(state.inventory, itemId);
    const possible = Math.floor(have / qty);
    if (possible < max) max = possible;
  }
  return max === Infinity ? 0 : max;
}

export function canCraftRecipe(state, recipeId, count = 1) {
  const recipe = getRecipe(recipeId);
  if (activeWorkbenchTier(state) < recipe.tier) return { ok: false, reason: 'reject.workbench_tier' };
  const scaledCosts = recipe.ingredients.map(({ itemId, qty }) => ({ itemId, qty: qty * count }));
  if (!canAffordCost(state, scaledCosts)) return { ok: false, reason: 'reject.missing_materials' };
  return { ok: true };
}

export const craftingModule = {
  id: 'crafting',

  createState() {
    return {
      unlockedRecipes: Object.keys(RECIPES),
      craftedCount: 0,
    };
  },

  install(ctx) {
    const { store, engine, effects } = ctx;

    store.registerMutations('crafting', {
      unlockRecipe(state, recipeId) {
        if (!state.crafting.unlockedRecipes.includes(recipeId)) {
          state.crafting.unlockedRecipes.push(recipeId);
        }
      },
      recordCraft(state, count = 1) {
        state.crafting.craftedCount = (state.crafting.craftedCount ?? 0) + count;
      },
    });

    engine.registerAction('crafting/craft', ({ recipeId, count = 1 }) => {
      const recipe = getRecipe(recipeId);
      const maxPossible = maxCraftableCount(store.state, recipeId);
      if (maxPossible < 1) {
        return canCraftRecipe(store.state, recipeId, 1);
      }

      const batch = Math.max(1, Math.min(count, maxPossible));
      const check = canCraftRecipe(store.state, recipeId, batch);
      if (!check.ok) return check;

      for (const { itemId, qty } of recipe.ingredients) {
        store.commit('inventory/remove', { itemId, qty: qty * batch });
      }
      store.commit('crafting/recordCraft', batch);
      codexManager.trackCareer('totalCraftsDone', batch);

      const totalProduced = recipe.output.qty * batch;
      const { itemId } = recipe.output;
      engine.log('log.crafting.crafted', {
        item: ref(`item.${itemId}.name`),
        count: totalProduced,
      }, 'good');
      grantItems(ctx, itemId, totalProduced);

      if (recipe.xp) {
        effects.apply([{ type: 'xp', skill: recipe.xp.skill, amount: recipe.xp.amount * batch }], ctx);
      }
      const isPowered = isAtOutpost(store.state) && Boolean(store.state.base?.generatorActive);
      const totalMinutes = isPowered
        ? Math.max(1, Math.ceil(recipe.minutes * batch * 0.5))
        : recipe.minutes * batch;
      engine.advanceTime(totalMinutes, 'idle');
      audioEngine?.playTerminalConfirm?.();
      return { ok: true, batch, totalProduced };
    });
  },
};
