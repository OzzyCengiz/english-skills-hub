import { BarterEngine, MERCHANT_PROFILES, MERCHANT_TYPES } from './barterEngine.js';
import { grantItems } from '../inventory/index.js';
import { FactionManager } from '../factions/factionManager.js';
import { audioEngine } from '../../core/audioEngine.js';
import { codexManager } from '../../core/codexManager.js';
import { ref } from '../../i18n/i18n.js';

export const economyModule = {
  id: 'economy',

  createState() {
    return {
      activeSession: null,
    };
  },

  install(ctx) {
    const { store, rng, effects, engine } = ctx;

    store.registerMutations('economy', {
      startSession(state, { merchantType }) {
        const profile = MERCHANT_PROFILES[merchantType] || MERCHANT_PROFILES[MERCHANT_TYPES.NOMAD_CARAVAN];
        state.economy.activeSession = {
          merchantType,
          faction: profile.faction,
          playerOffer: {},     // { [itemId]: qty }
          merchantDemands: {}, // { [itemId]: qty }
          haggleDiscount: 0,
          haggleAttempted: false,
        };
      },
      updatePlayerOffer(state, { itemId, qty }) {
        if (!state.economy.activeSession) return;
        if (qty <= 0) {
          delete state.economy.activeSession.playerOffer[itemId];
        } else {
          state.economy.activeSession.playerOffer[itemId] = qty;
        }
      },
      updateMerchantDemand(state, { itemId, qty }) {
        if (!state.economy.activeSession) return;
        if (qty <= 0) {
          delete state.economy.activeSession.merchantDemands[itemId];
        } else {
          state.economy.activeSession.merchantDemands[itemId] = qty;
        }
      },
      applyHaggle(state, { discount }) {
        if (!state.economy.activeSession) return;
        state.economy.activeSession.haggleDiscount += discount;
        state.economy.activeSession.haggleAttempted = true;
      },
      closeSession(state) {
        state.economy.activeSession = null;
      },
    });

    engine.registerAction('economy/openBarter', ({ merchantType = MERCHANT_TYPES.NOMAD_CARAVAN }) => {
      const profile = MERCHANT_PROFILES[merchantType] || MERCHANT_PROFILES[MERCHANT_TYPES.NOMAD_CARAVAN];

      // Standing verification for faction merchants
      if (profile.minStanding !== undefined) {
        const standing = FactionManager.getStanding(store.state, profile.faction);
        if (standing < profile.minStanding) {
          engine.log('barter.refused_standing', { faction: ref(`faction.${profile.faction}.name`) }, 'bad');
          return { ok: false, reason: 'reject.hostile_faction' };
        }
      }

      store.commit('economy/startSession', { merchantType });
      audioEngine.playGearRustle(0.4);
      engine.bus.emit('barter:modal', { active: true });
      return { ok: true };
    });

    engine.registerAction('economy/togglePlayerOffer', ({ itemId, delta }) => {
      const session = store.state.economy.activeSession;
      if (!session) return { ok: false, reason: 'reject.no_session' };

      const current = session.playerOffer[itemId] || 0;
      const next = Math.max(0, current + delta);
      store.commit('economy/updatePlayerOffer', { itemId, qty: next });
      audioEngine.playTerminalClick(1.0, 0.2);
      engine.bus.emit('barter:modal', { active: true });
      return { ok: true };
    });

    engine.registerAction('economy/toggleMerchantDemand', ({ itemId, delta }) => {
      const session = store.state.economy.activeSession;
      if (!session) return { ok: false, reason: 'reject.no_session' };

      const current = session.merchantDemands[itemId] || 0;
      const next = Math.max(0, current + delta);
      store.commit('economy/updateMerchantDemand', { itemId, qty: next });
      audioEngine.playTerminalClick(1.0, 0.2);
      engine.bus.emit('barter:modal', { active: true });
      return { ok: true };
    });

    engine.registerAction('economy/haggle', () => {
      const session = store.state.economy.activeSession;
      if (!session) return { ok: false, reason: 'reject.no_session' };
      if (session.haggleAttempted) return { ok: false, reason: 'reject.already_haggled' };

      const res = BarterEngine.attemptHaggle({
        state: store.state,
        merchantType: session.merchantType,
        rng,
      });

      store.commit('economy/applyHaggle', { discount: res.discount });
      if (res.ok) {
        audioEngine.playTerminalClick(1.3, 0.5);
        engine.log(res.messageKey, {}, 'good');
      } else {
        audioEngine.playTerminalClick(0.6, 0.6);
        engine.log(res.messageKey, {}, 'bad');
      }
      engine.bus.emit('barter:modal', { active: true });
      return { ok: true };
    });

    engine.registerAction('economy/executeTrade', () => {
      const session = store.state.economy.activeSession;
      if (!session) return { ok: false, reason: 'reject.no_session' };

      const playerOfferArr = Object.entries(session.playerOffer).map(([itemId, qty]) => ({ itemId, qty }));
      const merchantDemandArr = Object.entries(session.merchantDemands).map(([itemId, qty]) => ({ itemId, qty }));

      if (merchantDemandArr.length === 0) {
        return { ok: false, reason: 'reject.no_demands' };
      }

      const evaluation = BarterEngine.evaluateTrade({
        playerOffer: playerOfferArr,
        merchantDemands: merchantDemandArr,
        merchantType: session.merchantType,
        state: store.state,
        haggleDiscount: session.haggleDiscount,
      });

      if (!evaluation.isBalanced) {
        engine.log('barter.insufficient_value', {}, 'warn');
        return { ok: false, reason: 'reject.insufficient_value' };
      }

      // Deduct offered items from player inventory
      for (const { itemId, qty } of playerOfferArr) {
        store.commit('inventory/remove', { itemId, qty });
      }

      // Grant acquired goods
      for (const { itemId, qty } of merchantDemandArr) {
        grantItems(ctx, itemId, qty);
      }

      // Small karma/reputation reward with merchant faction
      if (session.faction) {
        FactionManager.adjustStanding(store.state, session.faction, 2, 'fair_trade', { bus: engine.bus });
      }

      codexManager.trackCareer('totalBarterValue', evaluation.playerTotal);
      if (evaluation.playerTotal >= 200) {
        codexManager.unlockAchievement('silk_road_tycoon');
      }

      audioEngine.playTerminalClick(1.2, 0.5);
      audioEngine.playGearRustle(0.5);
      engine.log('barter.trade_completed', {
        playerVal: evaluation.playerTotal,
        merchantVal: evaluation.merchantRequiredTotal,
      }, 'good');

      store.commit('economy/closeSession');
      engine.bus.emit('barter:modal', { active: false });
      return { ok: true };
    });

    engine.registerAction('economy/closeBarter', () => {
      store.commit('economy/closeSession');
      engine.bus.emit('barter:modal', { active: false });
      return { ok: true };
    });
  },
};
