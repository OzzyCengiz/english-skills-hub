/**
 * Minimal synchronous pub/sub. Handlers are isolated: one throwing listener
 * never prevents the rest of the chain from running.
 */
export class EventBus {
  #listeners = new Map();

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  once(event, handler) {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe();
      handler(payload);
    });
    return unsubscribe;
  }

  off(event, handler) {
    const handlers = this.#listeners.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) this.#listeners.delete(event);
  }

  emit(event, payload) {
    this.#dispatch(event, event, payload);
    this.#dispatch('*', event, payload);
  }

  #dispatch(channel, event, payload) {
    const handlers = this.#listeners.get(channel);
    if (!handlers) return;
    for (const handler of [...handlers]) {
      try {
        channel === '*' ? handler(event, payload) : handler(payload);
      } catch (error) {
        console.error(`[bus] listener for "${event}" failed`, error);
      }
    }
  }
}

