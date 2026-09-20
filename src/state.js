import stateJson from "./JSON/state.json" with { type: "json" };
import { MathFunction } from "./math.js";
class StateStore {
    loop;
    type;
    keepType;
    askCoeffs;
    current;
    baseFunc;
    lastSaved;
    history;
    constructor() {
        Object.assign(this, structuredClone(stateJson));
        this.current = new MathFunction();
    }
    get funcChanged() {
        return (this.current.a !== this.lastSaved?.a ||
            this.current.b !== this.lastSaved?.b ||
            this.current.c !== this.lastSaved?.c);
    }
}
export const State = new StateStore();
