import { Algebra } from "./algebra.js"
import { Checks } from "./checks.js"

/**
 * Tipo da Função Matemática (tipo + coeficientes).
 * @since v7.0.0
 */
export type MathFunctionType = {
    /** Tipo da Função (`poly` cobre Constante/Afim/Quadrática). */
    type: FunctionType
    /** Coeficiente `a`. */
    a: Value
    /** Coeficiente `b`. */
    b: Value
    /** Coeficiente `c`. */
    c: Value

    /** Coeficiente numérico `a`. */
    get numericA(): Numeric
    /** Coeficiente numérico `b`. */
    get numericB(): Numeric
    /** Coeficiente numérico `c`. */
    get numericC(): Numeric
    /** Todos os coeficientes são numéricos? */
    get numericCoefs(): boolean

    /** Coeficiente variável `a`. */
    get variableA(): boolean
    /** Coeficiente variável `b`. */
    get variableB(): boolean
    /** Coeficiente variável `c`. */
    get variableC(): boolean
    /** Algum coeficiente é variável? */
    get variableCoefs(): boolean

    /** É uma Função Constante (`a = 0 ∧ b = 0`)? Só relevante para `type = "poly"`. */
    get isConstant(): boolean
    /** É uma Função Afim (`a = 0 ∧ b ≠ 0`)? Só relevante para `type = "poly"`. */
    get isAffine(): boolean
    /** É uma Função Quadrática (`a ≠ 0`)? Só relevante para `type = "poly"`. */
    get isQuadratic(): boolean

    /** É uma Função Exponencial/Logarítmica válida (`a > 0 ∧ a ≠ 1 ∧ b ≠ 0`)? */
    get isValidExpLog(): boolean
    /** Degenera em Função Constante (`a = 0 ∨ a = 1 ∨ b = 0`)? */
    get isConstantExpLog(): boolean
    /** É inválida (`a < 0`)? */
    get isInvalidExpLog(): boolean

    /** É uma Função Trigonométrica válida (`a ≠ 0 ∧ b ≠ 0`)? */
    get isValidTrig(): boolean
    /** Degenera em Função Constante (`a = 0 ∨ b = 0`)? */
    get isConstantTrig(): boolean

    /** Soluciona os coeficientes desconhecidos desta Função. */
    resolveCoefs(): void

    /** Recria os coeficientes como variáveis (`a`, `b`, `c`). */
    refreshCoefs(): void

    /** Extrai `{ a, b, c }` como `Coefficients` puro (ex: para salvar no histórico). */
    toCoefficients(): Coefficients

    /** Cria uma cópia independente desta Função. */
    clone(): MathFunction
}

/**
 * Classe da Função Matemática.
 * @remarks Uma única classe cobre todos os tipos suportados; `type` ramifica o comportamento internamente.
 * @since ~v7.0.0
 */
export class MathFunction implements MathFunctionType {
    type: FunctionType
    a: MathValue
    b: MathValue
    c: MathValue

    constructor({ type = "poly", a = "a", b = "b", c = "c" }: Partial<Coefficients> & { type?: FunctionType } = {}) {
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
        return (
            Checks.isFiniteNumber(this.numericA) &&
            Checks.isFiniteNumber(this.numericB) &&
            Checks.isFiniteNumber(this.numericC)
        )
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

    resolveCoefs = () => {
        const solved = Algebra.resolveUnknown({ a: this.a, b: this.b, c: this.c }, this.type)
        this.a = Algebra.round(solved.a)
        this.b = Algebra.round(solved.b)
        this.c = Algebra.round(solved.c)
    }

    refreshCoefs = () => {
        this.a = Algebra.variables("a")
        this.b = Algebra.variables("b")
        this.c = Algebra.variables("c")
    }

    toCoefficients = (): Coefficients => ({ a: this.a, b: this.b, c: this.c })

    clone = () => new MathFunction({ type: this.type, a: this.a, b: this.b, c: this.c })
}
