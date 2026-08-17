import stateJson from "./JSON/state.json" with { type: "json" }

import type { Coefficients, CommandsNames, Numeric, Value } from "./values.js"

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
    baseFunc: Coefficients
    /** Coeficientes. */
    coefficients: Coefficients
    /** Função atual. */
    currentFunc: Coefficients
    /** Histórico de Funções. */
    history: Coefficients[]
}

/**
 * Estado do programa.
 * @since ~v6.2.0
 */
export const State: StateType = structuredClone(stateJson)
