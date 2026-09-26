import { resolveUnknown, round, variables } from "./algebra.js"
import { isFiniteNumber } from "./checks.js"

export interface MathFunctionType {
    type: FunctionType
    a: NamedCoefficients["a"]
    b: NamedCoefficients["b"]
    c: NamedCoefficients["c"]

    resolveCoefs: () => void
    refreshCoefs: () => void
    toCoefficients: () => NamedCoefficients
    clone: () => MathFunction

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

    public resolveCoefs = (): void => {
        const solved = resolveUnknown({ a: this.a, b: this.b, c: this.c }, this.type)
        this.a = solved.a === "a" ? solved.a : round(Number(solved.a))
        this.b = solved.b === "b" ? solved.b : round(Number(solved.b))
        this.c = solved.c === "c" ? solved.c : round(Number(solved.c))
    }

    public refreshCoefs = (): void => {
        this.a = variables("a")
        this.b = variables("b")
        this.c = variables("c")
    }

    public toCoefficients = (): NamedCoefficients => ({ a: this.a, b: this.b, c: this.c })

    public toNumericCoefficients = (): NumericCoefficients => ({ a: this.numericA, b: this.numericB, c: this.numericC })

    public clone = (): MathFunction => new MathFunction({ type: this.type, a: this.a, b: this.b, c: this.c })
}
