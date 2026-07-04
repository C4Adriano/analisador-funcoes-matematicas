import stateJson from "../JSON/state.json" with { type: "json" }

import type { CommandsNames, Numeric, Value, ValueArray } from "./values.js"

export type StateType = {
    loop: boolean
    keepType: boolean
    askCoeffs: boolean

    globalA: Value
    globalB: Value
    globalC: Value

    type: Numeric | CommandsNames

    baseFunc: ValueArray
    coefficients: ValueArray
    currentFunc: ValueArray
    history: ValueArray[]
}

export const State: StateType = structuredClone(stateJson)
