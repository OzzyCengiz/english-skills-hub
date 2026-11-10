/**
 * Central state container. State is only ever changed through named mutations
 * registered by modules, so every change is traceable as `namespace/name`.
 *
 * Mutations may write in place; observers are notified once per outermost
 * batch with the list of mutation types that ran.
 */
export class Store {
  #state;
  #bus;
  #mutations = new Map();
  #batchDepth = 0;
  #pendingTypes = [];

  constructor(initialState, bus) {
    this.#state = initialState;
    this.#bus = bus;
  }

  get state() {
    return this.#state;
  }

  registerMutations(namespace, handlers) {
    for (const [name, handler] of Object.entries(handlers)) {
      const type = `${namespace}/${name}`;
      if (this.#mutations.has(type)) throw new Error(`Mutation "${type}" registered twice`);
      this.#mutations.set(type, handler);
    }
  }

  commit(type, payload) {
    const mutation = this.#mutations.get(type);
    if (!mutation) throw new Error(`Unknown mutation "${type}"`);
    const result = mutation(this.#state, payload);
    this.#pendingTypes.push(type);
    this.#bus.emit('state:committed', { type, payload });
    if (this.#batchDepth === 0) this.#flush();
    return result;
  }

  batch(work) {
    this.#batchDepth += 1;
    try {
      return work();
    } finally {
      this.#batchDepth -= 1;
      if (this.#batchDepth === 0) this.#flush();
    }
  }

  replace(nextState) {
    this.#state = nextState;
    this.#pendingTypes.push('*');
    this.#bus.emit('state:replaced', nextState);
    this.#flush();
  }

  snapshot() {
    return structuredClone(this.#state);
  }

  #flush() {
    if (this.#pendingTypes.length === 0) return;
    const types = this.#pendingTypes;
    this.#pendingTypes = [];
    this.#bus.emit('state:changed', { types, state: this.#state });
  }
}

