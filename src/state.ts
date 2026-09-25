import stateJson from "./JSON/state.json" with { type: "json" }
import { MathFunction } from "./math.js"

interface StateJson {
    askCoeffs: boolean
    baseFunc: NamedCoefficients | null
    history: NamedCoefficients[]
    keepType: boolean
    lastSaved: NamedCoefficients | null
    loop: boolean
    type: number | CommandsNames
}

interface StateType {
    askCoeffs: boolean
    baseFunc: NamedCoefficients | null
    readonly current: MathFunction
    history: NamedCoefficients[]
    keepType: boolean
    lastSaved: NamedCoefficients | null
    loop: boolean
    type: number | CommandsNames
    get funcChanged(): boolean
    get currentCoefs(): NamedCoefficients
    set currentCoefs(coefs: NamedCoefficients)
}

class StateStore implements StateType {
    #askCoeffs: boolean
    #baseFunc: NamedCoefficients | null
    readonly #current: MathFunction
    #history: NamedCoefficients[]
    #keepType: boolean
    #lastSaved: NamedCoefficients | null
    #loop: boolean
    #type: number | CommandsNames

    public constructor() {
        const initial = structuredClone(stateJson) as StateJson

        this.#askCoeffs = initial.askCoeffs
        this.#baseFunc = initial.baseFunc
        this.#history = initial.history
        this.#keepType = initial.keepType
        this.#lastSaved = initial.lastSaved
        this.#loop = initial.loop
        this.#type = initial.type
        this.#current = new MathFunction()
    }

    public get askCoeffs(): boolean {
        return this.#askCoeffs
    }

    public set askCoeffs(value: boolean) {
        this.#askCoeffs = value
    }

    public get baseFunc(): NamedCoefficients | null {
        return this.#baseFunc
    }

    public set baseFunc(value: NamedCoefficients | null) {
        this.#baseFunc = value
    }

    public get current(): MathFunction {
        return this.#current
    }

    public get history(): NamedCoefficients[] {
        return this.#history
    }

    public set history(value: NamedCoefficients[]) {
        this.#history = value
    }

    public get keepType(): boolean {
        return this.#keepType
    }

    public set keepType(value: boolean) {
        this.#keepType = value
    }

    public get lastSaved(): NamedCoefficients | null {
        return this.#lastSaved
    }

    public set lastSaved(value: NamedCoefficients | null) {
        this.#lastSaved = value
    }

    public get loop(): boolean {
        return this.#loop
    }

    public set loop(value: boolean) {
        this.#loop = value
    }

    public get type(): number | CommandsNames {
        return this.#type
    }

    public set type(value: number | CommandsNames) {
        this.#type = value
    }

    public get funcChanged(): boolean {
        return this.#current.a !== this.#lastSaved?.a || this.#current.b !== this.#lastSaved.b || this.#current.c !== this.#lastSaved.c
    }

    public get currentCoefs(): NamedCoefficients {
        return { a: this.#current.a, b: this.#current.b, c: this.#current.c }
    }

    public set currentCoefs(coefs: NamedCoefficients) {
        this.#current.a = coefs.a
        this.#current.b = coefs.b
        this.#current.c = coefs.c
    }
}

const State = new StateStore()
export { State }
