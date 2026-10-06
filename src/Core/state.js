import { MathFunction } from "../Math/math.js"
class StateStore {
    askCoeffs = "on"
    current = new MathFunction()
    firstFunction = null
    history = []
    keepChoice = "off"
    lastRecorded = null
    loop = "off"
    menuChoice = "start"
    get funcChanged() {
        return this.current.a !== this.lastRecorded?.a || this.current.b !== this.lastRecorded.b || this.current.c !== this.lastRecorded.c
    }
    get currentCoefs() {
        return { a: this.current.a, b: this.current.b, c: this.current.c }
    }
    set currentCoefs(coefs) {
        this.current.a = coefs.a
        this.current.b = coefs.b
        this.current.c = coefs.c
    }
}
export const State = new StateStore()
