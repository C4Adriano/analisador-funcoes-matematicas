import { Algebra } from "./algebra.js"
import { Checks } from "./checks.js"

/**
 * Tipo da Função Matemática (tipo + coeficientes).
 * @since v7.0.0
 */
export interface MathFunctionType {
    /**
     * Tipo da Função (`poly` cobre Constante/Afim/Quadrática).
     */
    type: FunctionType

    /**
     * Coeficiente `a`.
     */
    a: Value

    /**
     * Coeficiente `b`.
     */
    b: Value

    /**
     * Coeficiente `c`.
     */
    c: Value

    /**
     * Soluciona os coeficientes desconhecidos desta Função.
     */
    resolveCoefs: () => void

    /**
     * Recria os coeficientes como variáveis (`a`, `b`, `c`).
     */
    refreshCoefs: () => void

    /**
     * Extrai `{ a, b, c }` como `Coefficients` puro (ex: para salvar no histórico).
     */
    toCoefficients: () => Coefficients

    /**
     * Cria uma cópia independente desta Função.
     */
    clone: () => MathFunction

    /**
     * Coeficiente numérico `a`.
     */
    get numericA(): Numeric

    /**
     * Coeficiente numérico `b`.
     */
    get numericB(): Numeric

    /**
     * Coeficiente numérico `c`.
     */
    get numericC(): Numeric

    /**
     * Todos os coeficientes são numéricos?
     */
    get numericCoefs(): boolean

    /**
     * Coeficiente variável `a`.
     */
    get variableA(): boolean

    /**
     * Coeficiente variável `b`.
     */
    get variableB(): boolean

    /**
     * Coeficiente variável `c`.
     */
    get variableC(): boolean

    /**
     * Algum coeficiente é variável?
     */
    get variableCoefs(): boolean

    /**
     * É uma Função Constante (`a = 0 ∧ b = 0`)? Só relevante para `type = "poly"`.
     */
    get isConstant(): boolean

    /**
     * É uma Função Afim (`a = 0 ∧ b ≠ 0`)? Só relevante para `type = "poly"`.
     */
    get isAffine(): boolean

    /**
     * É uma Função Quadrática (`a ≠ 0`)? Só relevante para `type = "poly"`.
     */
    get isQuadratic(): boolean

    /**
     * É uma Função Exponencial/Logarítmica válida (`a > 0 ∧ a ≠ 1 ∧ b ≠ 0`)?
     */
    get isValidExpLog(): boolean

    /**
     * Degenera em Função Constante (`a = 0 ∨ a = 1 ∨ b = 0`)?
     */
    get isConstantExpLog(): boolean

    /**
     * É inválida (`a < 0`)?
     */
    get isInvalidExpLog(): boolean

    /**
     * É uma Função Trigonométrica válida (`a ≠ 0 ∧ b ≠ 0`)?
     */
    get isValidTrig(): boolean

    /**
     * Degenera em Função Constante (`a = 0 ∨ b = 0`)?
     */
    get isConstantTrig(): boolean
}

/**
 * Classe da Função Matemática.
 * @remarks Uma única classe cobre todos os tipos suportados; `type` ramifica o comportamento internamente.
 * @since v7.0.0
 */
export class MathFunction implements MathFunctionType {
    public type: FunctionType
    public a: MathValue
    public b: MathValue
    public c: MathValue

    public constructor({
        type = "poly",
        a = "a",
        b = "b",
        c = "c",
    }: Partial<Coefficients> & { type?: FunctionType } = {}) {
        this.type = type
        this.a = a
        this.b = b
        this.c = c
    }

    public get numericA(): Numeric {
        return Number(this.a)
    }
    public get numericB(): Numeric {
        return Number(this.b)
    }
    public get numericC(): Numeric {
        return Number(this.c)
    }
    public get numericCoefs(): boolean {
        return (
            Checks.isFiniteNumber(this.numericA) &&
            Checks.isFiniteNumber(this.numericB) &&
            Checks.isFiniteNumber(this.numericC)
        )
    }

    public get variableA(): boolean {
        return this.a == "a"
    }
    public get variableB(): boolean {
        return this.b == "b"
    }
    public get variableC(): boolean {
        return this.c == "c"
    }
    public get variableCoefs(): boolean {
        return this.variableA || this.variableB || this.variableC
    }

    public get isConstant(): boolean {
        return this.numericA == 0 && this.numericB == 0
    }
    public get isAffine(): boolean {
        return this.numericA == 0 && this.numericB !== 0
    }
    public get isQuadratic(): boolean {
        return this.numericA !== 0
    }

    public get isValidExpLog(): boolean {
        return this.numericA > 0 && this.numericA !== 1 && this.numericB !== 0
    }
    public get isConstantExpLog(): boolean {
        return this.numericA == 0 || this.numericA == 1 || this.numericB == 0
    }
    public get isInvalidExpLog(): boolean {
        return this.numericA < 0
    }

    public get isValidTrig(): boolean {
        return this.numericA !== 0 && this.numericB !== 0
    }
    public get isConstantTrig(): boolean {
        return this.numericA == 0 || this.numericB == 0
    }

    public resolveCoefs = (): void => {
        const solved = Algebra.resolveUnknown({ a: this.a, b: this.b, c: this.c }, this.type)
        this.a = Algebra.round(solved.a)
        this.b = Algebra.round(solved.b)
        this.c = Algebra.round(solved.c)
    }

    public refreshCoefs = (): void => {
        this.a = Algebra.variables("a")
        this.b = Algebra.variables("b")
        this.c = Algebra.variables("c")
    }

    public toCoefficients = (): Coefficients => ({ a: this.a, b: this.b, c: this.c })

    public clone = (): MathFunction => new MathFunction({ type: this.type, a: this.a, b: this.b, c: this.c })
}
