import type { Options } from "./values.d.ts"

/**
 * # Algebra
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo álgebra.
 *
 * ## Métodos:
 * - {@link Algebra.round round} — Arredonda números.
 * - {@link Algebra.variables variables} — Pede variáveis.
 * - {@link Algebra.point point} — Pede pontos.
 * - {@link Algebra.resolveEquations resolveEquations} — Executa equações entre Funções.
 * - {@link Algebra.solveLinearSystem solveLinearSystem} — Resolve um sistema linear.
 * - {@link Algebra.solveLinearCoefs solveLinearCoefs} — Resolve um subconjunto de Coeficientes desconhecidos de um Função.
 * - {@link Algebra.getPointPairs getPointPairs} — Coleta `count` pares de pontos (x, y).
 * - {@link Algebra.solvePolynomial solvePolynomial} — Resolve os Coeficientes desconhecidos de uma Função Polinomial.
 * - {@link Algebra.solveExponential solveExponential} — Resolve os Coeficientes desconhecidos de uma Função Exponencial.
 * - {@link Algebra.solveLogarithmic solveLogarithmic} — Resolve os Coeficientes desconhecidos de uma Função Logarítmica.
 * - {@link Algebra.resolveUnknown resolveUnknown} — Descobre quais são as incógnitas de uma Função.
 * - {@link Algebra.logOptions logOptions} — Logaritmo de `x` de uma `base` qualquer.
 * - {@link Algebra.divisionOptions divisionOptions} — Divide números de forma segura.
 * - {@link Algebra.absoluteOptions absoluteOptions} — Calcula o valor absoluto de números.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Numérico
 * @since v6.1.0
 */
export declare const Algebra: {
    /**
     * Arredonda um número.
     * @param number - Número.
     * @param places - Casas decimais.
     * @default places = Config.decimalPlaces
     * @returns Número arredondado.
     * @group Numérico
     * @since v6.1.0
     */
    round(number: Value, places?: Places): Numeric

    /**
     * Pede uma variável.
     * @param name - Nome da variável.
     * @default name = "x"
     * @returns Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome.
     * @group UI
     * @since v6.1.0
     */
    variables(name?: Str): Value

    /** Pede um ponto. */
    point(type?: 1): [Numeric, Numeric]
    /** Pede dois pontos. */
    point(type: 2): [Numeric, Numeric, Numeric, Numeric]
    /** Pede três pontos. */
    point(type: 3): [Numeric, Numeric, Numeric, Numeric, Numeric, Numeric]
    /**
     * Pede um ou mais pontos.
     * @param type - Quantos pontos vão ser pedidos (1, 2 ou 3).
     * @default type = 1
     * @returns Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃].
     * @group UI
     * @since v6.1.0
     */
    point(type?: 1 | 2 | 3): NumericArray

    /**
     * Vê se as Funções têm pontos de encontro.
     * @param func1 - Primeira Função { a, b, c }.
     * @param func2 - Segunda Função { a, b, c }.
     * @group UI
     * @since v6.1.0
     */
    resolveEquations(func1: Coefficients, func2: Coefficients): void

    /**
     * Resolve um sistema linear quadrado `matrix · x = vector` por eliminação de Gauss com pivô parcial.
     * @param matrix - Matriz de Coeficientes (n×n).
     * @param vector - Vetor de termos independentes (tamanho n).
     * @returns O vetor solução, ou `null` caso o sistema seja singular (pivô nulo em alguma coluna, isto é, sem solução única).
     * @group Numérico
     * @since v6.6.0
     */
    solveLinearSystem(matrix: NumericArray[], vector: NumericArray): NumericArray | null

    /**
     * Resolve um subconjunto de Coeficientes desconhecidos de uma Função, a partir de pontos amostrados e de uma base linear que descreve a contribuição de cada coeficiente.
     * @param basis - Base linear com uma Função por coeficiente.
     * @param known - Coeficientes já conhecidos (usados para descontar sua contribuição do valor de y antes de resolver o sistema).
     * @param unknownKeys - Chaves dos Coeficientes a serem descobertos.
     * @param points - Pontos de amostragem (um por incógnita).
     * @returns Objeto com todos os Coeficientes (conhecidos e recém-resolvidos), ou `null` caso o sistema resultante seja singular.
     * @group Numérico
     * @since v6.6.0
     */
    solveLinearCoefs(
        basis: LinearBasis,
        known: Coefficients,
        unknownKeys: Str[],
        points: PointPair[]
    ): Coefficients | null

    /**
     * Coleta `count` pares de pontos (x, y) do usuário, usando a mesma convenção de {@link Algebra.point} (valores intercalados x₁, y₁, x₂, y₂, ...).
     * @param count - Quantidade de pares para coletar.
     * @default count = 1
     * @returns Lista de pares ordenados já convertidos para número.
     * @group Numérico
     * @since v6.6.0
     */
    getPointPairs(count?: Numeric): PointPair[]

    /**
     * Resolve os Coeficientes desconhecidos de uma Função Polinomial (constante, afim ou quadrática), inferindo o grau a partir dos Coeficientes `a` e `b` já conhecidos.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @default coefs = { a: State.numericA, b: State.numericB, c: State.numericC }
     * @returns Coeficientes resolvidos, ou `null` caso os pontos coletados levem a um sistema singular (ex.: pontos com mesmo x)
     * @group Numérico
     * @since v6.6.0
     */
    solvePolynomial(coefs?: Coefficients): Coefficients | null

    /**
     * Resolve os Coeficientes desconhecidos de uma Função Exponencial (`y = b × aˣ + c`).
     * @remarks
     * Os casos que envolvem apenas `b` e/ou `c` são lineares e resolvidos via {@link Algebra.solveLinearCoefs}; os que envolvem `a` usam fórmula fechada.
     *
     * A combinação `a` e `c` juntos ainda não é suportada.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @default coefs = { a: State.numericA, b: State.numericB, c: State.numericC }
     * @returns Coeficientes resolvidos, ou `null` caso o sistema linear associado seja singular
     * @group Numérico
     * @since v6.6.0
     */
    solveExponential(coefs?: Coefficients): Coefficients | null

    /**
     * Resolve os Coeficientes desconhecidos de uma Função Logarítmica (`y = b × logₐ(x) + c`).
     * @remarks
     * Os casos que envolvem apenas `b` e/ou `c` são lineares e resolvidos via {@link Algebra.solveLinearCoefs}; os que envolvem `a` usam fórmula fechada.
     *
     * A combinação `a` e `b` juntos ainda não é suportada.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @default coefs = { a: State.numericA, b: State.numericB, c: State.numericC }
     * @returns Coeficientes resolvidos, ou `null` caso o sistema linear associado seja singular
     * @group Numérico
     * @since v6.6.0
     */
    solveLogarithmic(coefs?: Coefficients): Coefficients | null

    /**
     * Descobre quais são as incógnitas de uma Função e resolve seus Coeficientes, solicitando pontos ao usuário quando necessário.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @param funcType - Tipo da Função sendo resolvida
     * @default coefs = { a: State.numericA, b: State.numericB, c: State.numericC }; funcType = "poly"
     * @returns Coeficientes finais resolvidos.
     * @group Numérico
     * @since v6.6.0
     */
    resolveUnknown(coefs?: Coefficients, funcType?: FunctionType): Coefficients

    /**
     * Calcula o logaritmo de x.
     * @remarks Se `base` for {@link Math.E} (ou nada também, pois é o valor padrão), prefira {@link Algebra.lnOptions}.
     * @param x - Número.
     * @param base - Base.
     * @param options - Opções (round, precision, places).
     * @default base = Math.E; options = { round: false, precision: Config.logPrecision, places: Config.decimalPlaces }
     * @returns Resultado.
     * @group Numérico
     * @since v6.6.1
     */
    logOptions(x: Numeric, base?: Numeric, options?: Options): Numeric

    /**
     * Calcula o logaritmo natural de x.
     * @see {@link Algebra.logOptions}
     * @remarks
     * Alias de {@link Algebra.logOptions} com `base` fixa em `Math.E`.
     *
     * Equivalente a `Algebra.logOptions(x, Math.E, { precision, round, places })`.
     * @param x - Número.
     * @param options - Opções.
     * @default options = { round: false, precision: Config.logPrecision, places: Config.decimalPlaces }
     * @returns Resultado.
     * @group Numérico
     * @since v6.6.1
     */
    lnOptions(x: Numeric, options?: Options): Numeric

    /**
     * Divide o `numerator` pelo `denominator`.
     * @param numerator - Parte de cima da fração.
     * @param denominator - Parte de baixo da fração.
     * @param options - Opções.
     * @default options = { round: true, precision: Config.logPrecision }
     * @returns Resultado.
     * @group Numérico
     * @since v6.6.1
     */
    divisionOptions(numerator: Numeric, denominator: Numeric, options?: Options): Numeric

    /**
     * Calcula o valor absoluto de um número.
     * @param number - Número.
     * @param options - Opções.
     * @default options = { round: true, places: Config.decimalPlaces }
     * @returns Número absoluto.
     * @group Numérico
     * @since v6.6.1
     */
    absoluteOptions(number: Numeric, options?: Options): Numeric
}
