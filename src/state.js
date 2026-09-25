import stateJson from "./JSON/state.json" with { type: "json" };
import { MathFunction } from "./math.js";
class StateStore {
    #askCoeffs;
    #baseFunc;
    #current;
    #history;
    #keepType;
    #lastSaved;
    #loop;
    #type;
    constructor() {
        const initial = structuredClone(stateJson);
        this.#askCoeffs = initial.askCoeffs;
        this.#baseFunc = initial.baseFunc;
        this.#history = initial.history;
        this.#keepType = initial.keepType;
        this.#lastSaved = initial.lastSaved;
        this.#loop = initial.loop;
        this.#type = initial.type;
        this.#current = new MathFunction();
    }
    get askCoeffs() {
        return this.#askCoeffs;
    }
    set askCoeffs(value) {
        this.#askCoeffs = value;
    }
    get baseFunc() {
        return this.#baseFunc;
    }
    set baseFunc(value) {
        this.#baseFunc = value;
    }
    get current() {
        return this.#current;
    }
    get history() {
        return this.#history;
    }
    set history(value) {
        this.#history = value;
    }
    get keepType() {
        return this.#keepType;
    }
    set keepType(value) {
        this.#keepType = value;
    }
    get lastSaved() {
        return this.#lastSaved;
    }
    set lastSaved(value) {
        this.#lastSaved = value;
    }
    get loop() {
        return this.#loop;
    }
    set loop(value) {
        this.#loop = value;
    }
    get type() {
        return this.#type;
    }
    set type(value) {
        this.#type = value;
    }
    get funcChanged() {
        return this.#current.a !== this.#lastSaved?.a || this.#current.b !== this.#lastSaved.b || this.#current.c !== this.#lastSaved.c;
    }
    get currentCoefs() {
        return { a: this.#current.a, b: this.#current.b, c: this.#current.c };
    }
    set currentCoefs(coefs) {
        this.#current.a = coefs.a;
        this.#current.b = coefs.b;
        this.#current.c = coefs.c;
    }
}
const State = new StateStore();
export { State };
