/**
 * # Analyze
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo análise de Funções.
 *
 * ## Métodos:
 * - {@link Analyze.resolveConstant resolveConstant} - Função Constante.
 * - {@link Analyze.resolveAffine resolveAffine} - Função Afim.
 * - {@link Analyze.resolveQuadratic resolveQuadratic} - Função Quadrática.
 * - {@link Analyze.resolveExponential resolveExponential} - Função Exponencial.
 * - {@link Analyze.resolveLogarithmic resolveLogarithmic} - Função Logarítmica.
 * - {@link Analyze.resolveSine resolveSine} - Função Seno.
 * - {@link Analyze.resolveCosine resolveCosine} - Função Cosseno.
 * - {@link Analyze.resolveTangent resolveTangent} - Função Tangente.
 *
 * ### Tags:
 * @license [License](../LICENSE.md)
 * @group Função
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @since v6.1.0
 */
export declare const Analyze: {
    /**
     * Resolve uma Função Constante: `ƒ(x) = c`.
     * @param coefs - Coeficientes.
     * @default coefs = { c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveConstant: (coefs?: Pick<Coefficients, "c">) => void

    /**
     * Resolve uma Função Afim: `ƒ(x) = bx + c`.
     * @param coefs - Coeficientes.
     * @default coefs = { b: State.current.numericB, c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveAffine: (coefs?: Pick<Coefficients, "c" | "b">) => void

    /**
     * Resolve uma Função Quadrática: `ƒ(x) = ax² + bx + c`.
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.current.numericA, b: State.current.numericB, c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveQuadratic: (coefs?: Coefficients) => void

    /**
     * Resolve uma Função Exponencial: `ƒ(x) = b × aˣ + c`.
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.current.numericA, b: State.current.numericB, c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveExponential: (coefs?: Coefficients) => void

    /**
     * Resolve uma Função Logarítmica: `ƒ(x) = b × logₐ(x) + c`.
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.current.numericA, b: State.current.numericB, c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveLogarithmic: (coefs?: Coefficients) => void

    /**
     * Resolve uma Função Seno: `ƒ(x) = b × sin(a · x) + c`.
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.current.numericA, b: State.current.numericB, c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveSine: (coefs?: Coefficients) => void

    /**
     * Resolve uma Função Cosseno: `ƒ(x) = b × cos(a · x) + c`.
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.current.numericA, b: State.current.numericB, c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveCosine: (coefs?: Coefficients) => void

    /**
     * Resolve uma Função Tangente: `ƒ(x) = b × tan(a · x) + c`.
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.current.numericA, b: State.current.numericB, c: State.current.numericC }
     * @group Função
     * @since v6.6.1
     */
    resolveTangent: (coefs?: Coefficients) => void
}
