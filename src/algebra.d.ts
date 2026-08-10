import type {
    Coefficients,
    FunctionType,
    LinearBasis,
    Numeric,
    NumericArray,
    Places,
    PointPair,
    Precision,
    Text,
    TrigonometricFunction,
    Value,
    ValueArray,
} from "./values.js"

/**
 * # Algebra
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo álgebra.
 *
 * ## Métodos:
 * - {@link Algebra.round round} - Arredonda números
 * - {@link Algebra.variables variables} - Pede variáveis
 * - {@link Algebra.point point} - Pede pontos
 * - {@link Algebra.equations equations} - Equações entre funções
 * - {@link Algebra.unknown unknown} - Descobre variáveis
 * - {@link Algebra.log log} - Log de `x` de uma `base` qualquer
 * - {@link Algebra.ln ln} - Log natural de `x`
 * - {@link Algebra.division division} - Divide de forma segura
 * - {@link Algebra.absolute absolute} - Valor absoluto de um número
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Numérico
 * @since v6.1.0
 */
export declare const Algebra: {
    /**
     * Arredonda um número
     * @param number - Número
     * @param places - Casas decimais
     * @returns Número arredondado
     * @group Numérico
     * @since v6.1.0
     */
    round(number: Value, places: Places): Numeric

    /**
     * Pede uma variável
     * @param name - Nome da variável
     * @returns Se a variável tiver valor numérico, retorna o valor. Se não, retorna o nome
     * @group UI
     * @since v6.1.0
     */
    variables(name: Text): Value

    /**
     * Pede um ponto
     * @param type - Quantos pontos vão ser pedidos (nesse caso, 1)
     * @returns Um array com os pontos, na ordem: [x₁, y₁]
     * @group UI
     * @since v6.1.0
     */
    point(type: 1): NumericArray

    /**
     * Pede um(ns) ponto(s)
     * @param type - Quantos pontos vão ser pedidos (nesse caso, 2)
     * @returns Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂]
     * @group UI
     * @since v6.1.0
     */
    point(type: 2): NumericArray

    /**
     * Pede um(ns) ponto(s)
     * @param type - Quantos pontos vão ser pedidos (nesse caso, 3)
     * @returns Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
     * @group UI
     * @since v6.1.0
     */
    point(type: 3): NumericArray

    /**
     * Pede um(ns) ponto(s)
     * @param type - Quantos pontos vão ser pedidos (1, 2 ou 3)
     * @returns Um array com os pontos, na ordem: [x₁, y₁, x₂, y₂, x₃, y₃]
     * @group UI
     * @since v6.1.0
     */
    point(type: Numeric): NumericArray

    /**
     * Vê se as funções têm pontos de encontro
     * @param func1 - Primeira função [a, b, c]
     * @param func2 - Segunda função [a, b, c]
     * @group UI
     * @since v6.1.0
     */
    equations(func1: NumericArray, func2: NumericArray): void

    /**
     * Resolve um sistema linear quadrado `matrix · x = vector` por eliminação de Gauss com pivô parcial.
     * @param matrix - Matriz de coeficientes (n×n)
     * @param vector - Vetor de termos independentes (tamanho n)
     * @returns O vetor solução, ou `null` caso o sistema seja singular (pivô nulo em alguma coluna, isto é, sem solução única)
     * @group Numérico
     * @since v6.6.0
     */
    solveLinearSystem(matrix: NumericArray[], vector: NumericArray): NumericArray | null

    /**
     * Resolve um subconjunto de coeficientes desconhecidos de uma função, a partir de pontos amostrados e de uma base linear que descreve a contribuição de cada coeficiente.
     * @param basis - Base linear com uma função por coeficiente
     * @param known - Coeficientes já conhecidos (usados para descontar sua contribuição do valor de y antes de resolver o sistema)
     * @param unknownKeys - Chaves dos coeficientes a serem descobertos
     * @param points - Pontos de amostragem (um por incógnita)
     * @returns Objeto com todos os coeficientes (conhecidos e recém-resolvidos), ou `null` caso o sistema resultante seja singular
     * @group Numérico
     * @since v6.5.3
     */
    solveLinearCoefs(
        basis: LinearBasis,
        known: Coefficients,
        unknownKeys: string[],
        points: PointPair[]
    ): Coefficients | null

    /**
     * Coleta `count` pares de pontos (x, y) do usuário, usando a mesma convenção de {@link Algebra.point} (valores intercalados x₀, y₀, x₁, y₁, ...).
     * @param count - Quantidade de pares a coletar (padrão: 1 par)
     * @returns Lista de pares ordenados já convertidos para número
     * @group Numérico
     * @since v6.6.0
     */
    getPointPairs(count?: Numeric): PointPair[]

    /**
     * Resolve os coeficientes desconhecidos de uma função polinomial (constante, afim ou quadrática), inferindo o grau a partir dos coeficientes `a` e `b` já conhecidos.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @returns Coeficientes resolvidos, ou `null` caso os pontos coletados levem a um sistema singular (ex.: pontos com mesmo x)
     * @group Numérico
     * @since v6.6.0
     */
    solvePolynomial(coefs: Coefficients): Coefficients | null

    /**
     * Resolve os coeficientes desconhecidos de uma função exponencial (`y = b·aˣ + c`). Os casos que envolvem apenas `b` e/ou `c` são lineares e resolvidos via {@link Algebra.solveLinearCoefs}; os que envolvem `a` usam fórmula fechada. A combinação `a` e `c` juntos ainda não é suportada.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @returns Coeficientes resolvidos, ou `null` caso o sistema linear associado seja singular
     * @throws Emite um aviso via `Ui.warning` (não uma exceção) quando `a` e `c` são solicitados simultaneamente, retornando valores‑padrão
     * @group Numérico
     * @since v6.6.0
     */
    solveExponential(coefs: Coefficients): Coefficients | null

    /**
     * Resolve os coeficientes desconhecidos de uma função logarítmica (`y = b·log_a(x) + c`). Os casos que envolvem apenas `b` e/ou `c` são lineares e resolvidos via {@link Algebra.solveLinearCoefs}; os que envolvem `a` usam fórmula fechada. A combinação `a` e `b` juntos ainda não é suportada.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @returns Coeficientes resolvidos, ou `null` caso o sistema linear associado seja singular
     * @throws Emite um aviso via `Ui.warning` (não uma exceção) quando `a` e `b` são solicitados simultaneamente, retornando valores‑padrão
     * @group Numérico
     * @since v6.6.0
     */
    solveLogarithmic(coefs: Coefficients): Coefficients | null

    /**
     * Descobre quais são as incógnitas de uma função e resolve seus coeficientes, solicitando pontos ao usuário quando necessário.
     * Substitui {@link Algebra.unknown} com uma assinatura mais enxuta, agrupando os coeficientes em um único objeto e os antigos parâmetros booleanos (`funcExp`, `funcLog`, `funcTrig`) em um único tipo discriminado.
     * @param coefs - Coeficientes atuais, com incógnitas marcadas pela própria letra ("a", "b" ou "c")
     * @param funcType - Tipo da função sendo resolvida
     * @returns Coeficientes finais resolvidos.
     * @group Numérico
     * @since v6.6.0
     */
    resolveUnknown(coefs: Coefficients, funcType: FunctionType): Coefficients

    /**
     * Descobre quais são as incógnitas
     * @deprecated Desde v6.6.0. Use {@link Algebra.resolveUnknown} com um objeto {@link Coefficients} e um {@link FunctionType} no lugar dos três parâmetros booleanos. Mantido apenas para compatibilidade retroativa; não remover.
     * @param coefA - Coeficiente a
     * @param coefB - Coeficiente b
     * @param coefC - Coeficiente c
     * @param funcExp - Se é exponencial
     * @param funcLog - Se é logarítmica
     * @param funcTrig - Se é trigonométrica, e qual (sin, cos, tan)
     * @returns Retorna os coeficientes em formato de array [a, b, c]
     * @group Numérico
     * @since v6.1.0
     */
    unknown(
        coefA: Value,
        coefB: Value,
        coefC: Value,
        funcExp: boolean,
        funcLog: boolean,
        funcTrig: TrigonometricFunction
    ): ValueArray

    /**
     * Log de x na base
     * @param x - Número
     * @param base - Base
     * @param precision - Casas decimais
     * @returns Resultado
     * @group Numérico
     * @since v6.1.0
     */
    log(x: Numeric, base: Numeric, precision: Precision): Numeric

    /**
     * Log de x na base E
     * @param x - Número
     * @param precision - Casas decimais
     * @returns Resultado
     * @group Numérico
     * @since v6.1.0
     */
    ln(x: Numeric, precision: Precision): Numeric

    /**
     * Divide dois números
     * @param numerator - Parte de cima da fração
     * @param denominator - Parte de baixo da fração
     * @param round - Se irá arredondar
     * @param precision - Precisão do arredondamento
     * @returns Resultado
     * @group Numérico
     * @since v6.1.0
     */
    division(numerator: Numeric, denominator: Numeric, round: boolean, precision: Precision): Numeric

    /**
     * Calcula o valor absoluto de um número
     * @param number - Número
     * @param round - Se irá arredondar
     * @param places - Casas decimais
     * @returns Número absoluto
     * @group Numérico
     * @since v6.1.0
     */
    absolute(number: Numeric, round: boolean, places: Places): Numeric
}
