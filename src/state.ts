import stateJson from "./JSON/state.json" with { type: "json" }

/**
 * Tipo do estado do programa.
 * @since ~v6.2.0
 */
export type StateType = {
    /** Irá repetir o `loop` principal? */
    loop: boolean

    /** Tipo da Função. */
    type: Numeric | CommandsNames
    /** Manter o tipo da Função? */
    keepType: boolean
    /** Irá perguntar por outros coeficientes? */
    askCoeffs: boolean

    /** Coeficiente `a` global. */
    globalA: Value
    /** Coeficiente `b` global. */
    globalB: Value
    /** Coeficiente `c` global. */
    globalC: Value

    /** Função padrão. */
    baseFunc: Coefficients | null
    /** Coeficientes. */
    coefficients: Coefficients
    /** Função atual. */
    currentFunc: Coefficients
    /** Histórico de Funções. */
    history: Coefficients[]

    /** Coeficiente numérico `a` */
    get numericA(): Numeric
    /** Coeficiente numérico `b` */
    get numericB(): Numeric
    /** Coeficiente numérico `c` */
    get numericC(): Numeric
}

/**
 * Classe do estado do programa.
 * @since ~v6.7.0
 */
class StateStore implements StateType {
    loop!: boolean

    type!: Numeric | CommandsNames
    keepType!: boolean
    askCoeffs!: boolean

    globalA!: Value
    globalB!: Value
    globalC!: Value

    baseFunc!: Coefficients | null
    coefficients!: Coefficients
    currentFunc!: Coefficients
    history!: Coefficients[]

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

/**
 * Estado do programa.
 * @since ~v6.2.0
 */
export const State = new StateStore()
