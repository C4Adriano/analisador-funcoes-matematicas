import { isReal } from "../Base/checks.js"
import { round } from "../Base/numeric.js"
import { ONE, toReal, ZERO } from "../Base/quantity.js"
import { readStorage, removeStorage, writeStorage } from "../Base/storage.js"
import { type AlgebraIO, variables } from "./algebra.js"

const STORAGE_KEY = "currentFunction",
    STORAGE_PREFIX = `${STORAGE_KEY}.`,
    SAVED_KEYS = ["a", "b", "c", "type"] as const,
    FUNCTION_TYPES = new Set<FunctionType>(["poly", "exp", "log", "sin", "cos", "tan", "csc", "sec", "cot"]),
    DEFAULT_FUNCTION = { a: "a", b: "b", c: "c", type: "poly" } as const satisfies { type: FunctionType } & NamedCoefficients

function isFunctionType(value: unknown): value is FunctionType {
    return typeof value === "string" && FUNCTION_TYPES.has(value as FunctionType)
}

function parseSavedCoef<T extends Variable>(raw: string | null, variable: T): NamedCoefficient<T> | null {
    let result: NamedCoefficient<T> | null = null

    if (raw === variable) result = variable
    else if (raw != null && raw.trim() !== "") {
        const value = toReal(raw)
        if (isReal(value)) result = value
    }

    return result
}

export function settleCoef<T extends Variable>(value: NamedCoefficient<T>): NamedCoefficient<T> {
    return typeof value === "number" ? round(value) : value
}

export class MathFunction {
    public type: FunctionType
    public a: NamedCoefficient<"a">
    public b: NamedCoefficient<"b">
    public c: NamedCoefficient<"c">

    public constructor({ type = DEFAULT_FUNCTION.type, a = DEFAULT_FUNCTION.a, b = DEFAULT_FUNCTION.b, c = DEFAULT_FUNCTION.c }: Partial<NamedCoefficients> & { type?: FunctionType } = {}) {
        this.type = type
        this.a = a
        this.b = b
        this.c = c
    }

    public get numericA(): Real | null {
        return toReal(this.a)
    }

    public get numericB(): Real | null {
        return toReal(this.b)
    }

    public get numericC(): Real | null {
        return toReal(this.c)
    }

    public get numericCoefs(): boolean {
        return isReal(this.numericA) && isReal(this.numericB) && isReal(this.numericC)
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
        return this.numericA === ZERO && this.numericB === ZERO
    }

    public get isAffine(): boolean {
        return this.numericA === ZERO && this.numericB !== ZERO
    }

    public get isQuadratic(): boolean {
        return this.numericA !== ZERO
    }

    public get isValidExpLog(): boolean {
        return isReal(this.numericA) && this.numericA > ZERO && this.numericA !== ONE && this.numericB !== ZERO
    }

    public get isConstantExpLog(): boolean {
        return this.numericA === ZERO || this.numericA === ONE || this.numericB === ZERO
    }

    public get isInvalidExpLog(): boolean {
        return !isReal(this.numericA) || this.numericA < ZERO
    }

    public get isValidTrig(): boolean {
        return this.numericA !== ZERO && this.numericB !== ZERO
    }

    public get isConstantTrig(): boolean {
        return this.numericA === ZERO || this.numericB === ZERO
    }

    public resolveCoefs(solved: NamedCoefficients): void {
        this.a = settleCoef<"a">(solved.a)
        this.b = settleCoef<"b">(solved.b)
        this.c = settleCoef<"c">(solved.c)
        this.save()
    }

    public async refreshCoefs(io: AlgebraIO): Promise<void> {
        this.a = await variables(io, "a")
        this.b = await variables(io, "b")
        this.c = await variables(io, "c")
        this.save()
    }

    public toCoefficients(): NamedCoefficients {
        return { a: this.a, b: this.b, c: this.c }
    }

    public toNumericCoefficients(): NumericCoefficients {
        const a = this.numericA,
            b = this.numericB,
            c = this.numericC

        if (!isReal(a) || !isReal(b) || !isReal(c)) {
            throw new Error("Function coefficients must be finite numbers")
        }

        return { a, b, c }
    }

    public save(): void {
        for (const key of SAVED_KEYS) {
            writeStorage(STORAGE_PREFIX + key, String(this[key]))
        }
    }

    public load(): LoadOptions {
        removeStorage(STORAGE_KEY)

        const a = parseSavedCoef(readStorage(`${STORAGE_PREFIX}a`), "a"),
            b = parseSavedCoef(readStorage(`${STORAGE_PREFIX}b`), "b"),
            c = parseSavedCoef(readStorage(`${STORAGE_PREFIX}c`), "c"),
            type = readStorage(`${STORAGE_PREFIX}type`)

        if (a == null || b == null || c == null || !isFunctionType(type)) return "corrupted"

        this.a = a
        this.b = b
        this.c = c
        this.type = type

        return "loaded"
    }

    public reset(): void {
        this.a = DEFAULT_FUNCTION.a
        this.b = DEFAULT_FUNCTION.b
        this.c = DEFAULT_FUNCTION.c
        this.type = DEFAULT_FUNCTION.type
    }
}
