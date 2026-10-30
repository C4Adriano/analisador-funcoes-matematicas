import type { INPUT_FAILED } from "../Base/consts.js"
import { MathFunction } from "../Math/math.js"

class StateStore {
    public askCoeffs: Toggle = "on"
    public readonly current = new MathFunction()
    public firstFunction: NumericCoefficients | null = null
    public history: NamedCoefficients[] = []
    public keepChoice: Toggle = "off"
    public lastRecorded: NamedCoefficients | null = null
    public loop: Toggle = "off"
    public menuChoice: number | CommandNames | typeof INPUT_FAILED = "start"

    public get funcChanged(): boolean {
        return this.current.a !== this.lastRecorded?.a || this.current.b !== this.lastRecorded.b || this.current.c !== this.lastRecorded.c
    }

    public get currentCoefs(): NamedCoefficients {
        return this.current.toCoefficients()
    }

    public set currentCoefs(coefs: NamedCoefficients) {
        this.current.a = coefs.a
        this.current.b = coefs.b
        this.current.c = coefs.c
    }
}

export const State = new StateStore()
