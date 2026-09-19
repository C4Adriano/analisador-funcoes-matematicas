import stateJson from "./JSON/state.json" with { type: "json" }
class StateStore {
    loop
    type
    keepType
    askCoeffs
    globalA
    globalB
    globalC
    baseFunc
    coefficients
    currentFunc
    history
    constructor() {
        Object.assign(this, structuredClone(stateJson))
    }
    get numericA() {
        return Number(this.globalA)
    }
    get numericB() {
        return Number(this.globalB)
    }
    get numericC() {
        return Number(this.globalC)
    }
}
export const State = new StateStore()
