import stateJson from "../JSON/state.json" with { type: "json" }

export type StateType = {
    loop: boolean
    keepType: boolean
    askCoeffs: boolean

    globalA: string
    globalB: string
    globalC: string

    type: string | number

    baseFunc: (string | number)[]
    coefficients: number[]
    currentFunc: string[]
    history: (string | number)[]
}

export const State: StateType = structuredClone(stateJson)
