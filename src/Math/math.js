import { isFiniteNumber, isValidText } from "../Core/checks.js"
import { variables } from "./algebra.js"
import { round } from "./numeric.js"
const STORAGE_KEY = "currentFunction",
    FUNCTION_TYPES = ["poly", "exp", "log", "sin", "cos", "tan", "csc", "sec", "cot"],
    SAVED_CHECKS = { a: value => isSavedCoef(value, "a"), b: value => isSavedCoef(value, "b"), c: value => isSavedCoef(value, "c"), type: isFunctionType },
    DEFAULT_FUNCTION = { a: "a", b: "b", c: "c", type: "poly" }
function isFunctionType(value) {
    return isValidText(value) && FUNCTION_TYPES.includes(value)
}
function isSavedCoef(value, variable) {
    return value === variable || isFiniteNumber(value)
}
function isSavedFunction(saved) {
    return Object.entries(SAVED_CHECKS).every(([key, check]) => check(saved[key]))
}
function attempt(action, fallback) {
    try {
        return action()
    } catch {
        return fallback
    }
}
function readSaved() {
    const raw = attempt(() => JSON.parse(String(localStorage.getItem(STORAGE_KEY))), null)
    return Object(raw)
}
export class MathFunction {
    type
    a
    b
    c
    constructor({ type = "poly", a = "a", b = "b", c = "c" } = {}) {
        this.type = type
        this.a = a
        this.b = b
        this.c = c
    }
    get numericA() {
        return Number(this.a)
    }
    get numericB() {
        return Number(this.b)
    }
    get numericC() {
        return Number(this.c)
    }
    get numericCoefs() {
        return isFiniteNumber(this.numericA) && isFiniteNumber(this.numericB) && isFiniteNumber(this.numericC)
    }
    get variableA() {
        return this.a === "a"
    }
    get variableB() {
        return this.b === "b"
    }
    get variableC() {
        return this.c === "c"
    }
    get variableCoefs() {
        return this.variableA || this.variableB || this.variableC
    }
    get isConstant() {
        return this.numericA === 0 && this.numericB === 0
    }
    get isAffine() {
        return this.numericA === 0 && this.numericB !== 0
    }
    get isQuadratic() {
        return this.numericA !== 0
    }
    get isValidExpLog() {
        return this.numericA > 0 && this.numericA !== 1 && this.numericB !== 0
    }
    get isConstantExpLog() {
        return this.numericA === 0 || this.numericA === 1 || this.numericB === 0
    }
    get isInvalidExpLog() {
        return this.numericA < 0
    }
    get isValidTrig() {
        return this.numericA !== 0 && this.numericB !== 0
    }
    get isConstantTrig() {
        return this.numericA === 0 || this.numericB === 0
    }
    resolveCoefs = solved => {
        this.a = solved.a === "a" ? solved.a : round(Number(solved.a))
        this.b = solved.b === "b" ? solved.b : round(Number(solved.b))
        this.c = solved.c === "c" ? solved.c : round(Number(solved.c))
        this.save()
    }
    refreshCoefs = () => {
        this.a = variables("a")
        this.b = variables("b")
        this.c = variables("c")
        this.save()
    }
    toCoefficients = () => ({ a: this.a, b: this.b, c: this.c })
    toNumericCoefficients = () => ({ a: this.numericA, b: this.numericB, c: this.numericC })
    save = () => {
        attempt(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...this.toCoefficients(), type: this.type }))
        }, null)
    }
    load = () => {
        const saved = readSaved(),
            { a, b, c, type } = saved,
            valid = isSavedFunction(saved)
        Object.assign(this, valid ? { a, b, c, type } : {})
        return valid
    }
    reset = () => {
        Object.assign(this, DEFAULT_FUNCTION)
    }
}
