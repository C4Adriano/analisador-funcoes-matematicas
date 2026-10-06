import { isFiniteNumber, isValidText } from "../Core/checks.js"
import { variables } from "./algebra.js"
import { round } from "./numeric.js"

const STORAGE_KEY = "currentFunction",
    FUNCTION_TYPES = ["poly", "exp", "log", "sin", "cos", "tan", "csc", "sec", "cot"] as const satisfies readonly FunctionType[],
    SAVED_CHECKS: Record<string, (value: unknown) => boolean> = { a: value => isSavedCoef(value, "a"), b: value => isSavedCoef(value, "b"), c: value => isSavedCoef(value, "c"), type: isFunctionType },
    DEFAULT_FUNCTION = { a: "a", b: "b", c: "c", type: "poly" } as const satisfies { type: FunctionType } & NamedCoefficients

function isFunctionType(value: unknown): value is FunctionType {
    return isValidText(value) && FUNCTION_TYPES.includes(value as FunctionType)
}

function isSavedCoef<T extends "a" | "b" | "c">(value: unknown, variable: T): value is number | T {
    return value === variable || isFiniteNumber(value)
}

function isSavedFunction(saved: Record<string, unknown>): boolean {
    return Object.entries(SAVED_CHECKS).every(([key, check]) => check(saved[key]))
}

function attempt<T, F>(action: () => T, fallback: F): T | F {
    try {
        return action()
    } catch {
        return fallback
    }
}

function readSaved(): Record<string, unknown> {
    const raw = attempt(() => JSON.parse(String(localStorage.getItem(STORAGE_KEY))) as unknown, null)
    return Object(raw) as Record<string, unknown>
}

interface MathFunctionType {
    type: FunctionType
    a: NamedCoefficients["a"]
    b: NamedCoefficients["b"]
    c: NamedCoefficients["c"]

    resolveCoefs: (solved: Coefficients) => void
    refreshCoefs: () => void
    toCoefficients: () => NamedCoefficients
    save: () => void
    load: () => boolean
    reset: () => void

    get numericA(): number
    get numericB(): number
    get numericC(): number
    get numericCoefs(): boolean

    get variableA(): boolean
    get variableB(): boolean
    get variableC(): boolean
    get variableCoefs(): boolean

    get isConstant(): boolean
    get isAffine(): boolean
    get isQuadratic(): boolean
    get isValidExpLog(): boolean
    get isConstantExpLog(): boolean
    get isInvalidExpLog(): boolean
    get isValidTrig(): boolean
    get isConstantTrig(): boolean
}

export class MathFunction implements MathFunctionType {
    public type: FunctionType
    public a: number | "a"
    public b: number | "b"
    public c: number | "c"

    public constructor({ type = "poly", a = "a", b = "b", c = "c" }: Partial<NamedCoefficients> & { type?: FunctionType } = {}) {
        this.type = type
        this.a = a
        this.b = b
        this.c = c
    }

    public get numericA(): number {
        return Number(this.a)
    }
    public get numericB(): number {
        return Number(this.b)
    }
    public get numericC(): number {
        return Number(this.c)
    }
    public get numericCoefs(): boolean {
        return isFiniteNumber(this.numericA) && isFiniteNumber(this.numericB) && isFiniteNumber(this.numericC)
    }

    public get variableA(): boolean {
        return this.a === "a"
    }
    public get variableB(): boolean {
        return this.b === "b"
    }
    public get variableC(): boolean {
        return this.c === "c"
    }
    public get variableCoefs(): boolean {
        return this.variableA || this.variableB || this.variableC
    }

    public get isConstant(): boolean {
        return this.numericA === 0 && this.numericB === 0
    }
    public get isAffine(): boolean {
        return this.numericA === 0 && this.numericB !== 0
    }
    public get isQuadratic(): boolean {
        return this.numericA !== 0
    }

    public get isValidExpLog(): boolean {
        return this.numericA > 0 && this.numericA !== 1 && this.numericB !== 0
    }
    public get isConstantExpLog(): boolean {
        return this.numericA === 0 || this.numericA === 1 || this.numericB === 0
    }
    public get isInvalidExpLog(): boolean {
        return this.numericA < 0
    }

    public get isValidTrig(): boolean {
        return this.numericA !== 0 && this.numericB !== 0
    }
    public get isConstantTrig(): boolean {
        return this.numericA === 0 || this.numericB === 0
    }

    public resolveCoefs = (solved: Coefficients): void => {
        this.a = solved.a === "a" ? solved.a : round(Number(solved.a))
        this.b = solved.b === "b" ? solved.b : round(Number(solved.b))
        this.c = solved.c === "c" ? solved.c : round(Number(solved.c))
        this.save()
    }

    public refreshCoefs = (): void => {
        this.a = variables("a")
        this.b = variables("b")
        this.c = variables("c")
        this.save()
    }

    public toCoefficients = (): NamedCoefficients => ({ a: this.a, b: this.b, c: this.c })

    public toNumericCoefficients = (): NumericCoefficients => ({ a: this.numericA, b: this.numericB, c: this.numericC })

    public save = (): void => {
        attempt(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...this.toCoefficients(), type: this.type }))
        }, null)
    }

    public load = (): boolean => {
        const saved = readSaved(),
            { a, b, c, type } = saved,
            valid = isSavedFunction(saved)
        Object.assign(this, valid ? { a, b, c, type } : {})
        return valid
    }

    public reset = (): void => {
        Object.assign(this, DEFAULT_FUNCTION)
    }
}
