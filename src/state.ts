import stateJson from "./JSON/state.json" with { type: "json" }
import { MathFunction } from "./math.js"

export type StateType = {
    loop: boolean
    type: Numeric | CommandsNames
    keepType: boolean
    askCoeffs: boolean

    /** Função sendo editada/analisada no momento. */
    current: MathFunction
    /** Função padrão (ƒ₁), usada em equações entre Funções. */
    baseFunc: Coefficients | null
    /** Última Função empurrada pro histórico — usada só para detectar mudança. */
    lastSaved: Coefficients | null
    /** Histórico de Funções. */
    history: Coefficients[]

    /** `current` difere de `lastSaved`? */
    get funcChanged(): boolean
}

class StateStore implements StateType {
    loop!: boolean
    type!: Numeric | CommandsNames
    keepType!: boolean
    askCoeffs!: boolean

    current!: MathFunction
    baseFunc!: Coefficients | null
    lastSaved!: Coefficients | null
    history!: Coefficients[]

    constructor() {
        Object.assign(this, structuredClone(stateJson))
        this.current = new MathFunction()
    }

    get funcChanged() {
        return (
            this.current.a !== this.lastSaved?.a ||
            this.current.b !== this.lastSaved?.b ||
            this.current.c !== this.lastSaved?.c
        )
    }
}

export const State = new StateStore()
