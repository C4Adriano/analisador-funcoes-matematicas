import stateJson from "./JSON/state.json" with { type: "json" }
import { MathFunction } from "./math.js"

interface StateType {
    loop: boolean
    type: Numeric | CommandsNames
    keepType: boolean
    askCoeffs: boolean

    /**
     * Função sendo editada/analisada no momento.
     */
    current: MathFunction

    /**
     * Função padrão (ƒ₁), usada em equações entre Funções.
     */
    baseFunc: Coefficients | null

    /**
     * Última Função empurrada pro histórico — usada só para detectar mudança.
     */
    lastSaved: Coefficients | null

    /**
     * Histórico de Funções.
     */
    history: Coefficients[]

    /**
     * `current` difere de `lastSaved`?
     */
    get funcChanged(): boolean
}

class StateStore implements StateType {
    public loop!: boolean
    public type!: Numeric | CommandsNames
    public keepType!: boolean
    public askCoeffs!: boolean

    public current!: MathFunction
    public baseFunc!: Coefficients | null
    public lastSaved!: Coefficients | null
    public history!: Coefficients[]

    public constructor() {
        Object.assign(this, structuredClone(stateJson))
        this.current = new MathFunction()
    }

    public get funcChanged(): boolean {
        return (
            this.current.a !== this.lastSaved?.a ||
            this.current.b !== this.lastSaved.b ||
            this.current.c !== this.lastSaved.c
        )
    }
}

const State = new StateStore()
export { State }
