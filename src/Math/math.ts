import { isFiniteNumber } from "../Core/checks.js"
import { readStorage, removeStorage, writeStorage } from "../Core/storage.js"
import { variables } from "./algebra.js"
import { round } from "./numeric.js"

const STORAGE_KEY = "currentFunction",
    STORAGE_PREFIX = `${STORAGE_KEY}.`,
    SAVED_KEYS = ["a", "b", "c", "type"] as const,
    FUNCTION_TYPES: readonly unknown[] = ["poly", "exp", "log", "sin", "cos", "tan", "csc", "sec", "cot"] satisfies readonly FunctionType[],
    DEFAULT_FUNCTION = { a: "a", b: "b", c: "c", type: "poly" } as const satisfies { type: FunctionType } & NamedCoefficients

function isFunctionType(value: unknown): value is FunctionType {
    return FUNCTION_TYPES.includes(value)
}

function parseSavedCoef<T extends Variable>(raw: string | null, variable: T): NamedCoefficient<T> | null {
    if (raw === variable) return variable
    if (raw == null || raw.trim() === "") return null

    const value = Number(raw)
    return isFiniteNumber(value) ? value : null
}

function settleCoef<T extends Variable>(value: number | Variable, variable: T): number | T {
    return value === variable ? variable : round(Number(value))
}

export class MathFunction {
    public type: FunctionType
    public a: NamedCoefficient<"a">
    public b: NamedCoefficient<"b">
    public c: NamedCoefficient<"c">

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
        this.a = settleCoef(solved.a, "a")
        this.b = settleCoef(solved.b, "b")
        this.c = settleCoef(solved.c, "c")
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
        for (const key of SAVED_KEYS) writeStorage(STORAGE_PREFIX + key, String(this[key]))
    }

    public load = (): boolean => {
        removeStorage(STORAGE_KEY)

        const a = parseSavedCoef(readStorage(`${STORAGE_PREFIX}a`), "a"),
            b = parseSavedCoef(readStorage(`${STORAGE_PREFIX}b`), "b"),
            c = parseSavedCoef(readStorage(`${STORAGE_PREFIX}c`), "c"),
            type = readStorage(`${STORAGE_PREFIX}type`)

        if (a == null || b == null || c == null || !isFunctionType(type)) return false

        Object.assign(this, { a, b, c, type })
        return true
    }

    public reset = (): void => {
        Object.assign(this, DEFAULT_FUNCTION)
    }
}
