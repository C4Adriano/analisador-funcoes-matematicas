import type { Coefficients, Value } from "./values.js"

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
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Função
 * @since v6.1.0
 */
export declare const Analyze: {
    /**
     * Monta uma Função Constante: ƒ(x) = c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveConstant} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefC - Coeficiente c da Função Constante
     * @default coefC = State.globalC
     * @group Função
     * @since v6.1.0
     */
    constant(coefC?: Value): void

    /**
     * Resolve uma Função Constante: ƒ(x) = c
     * @param coefs - Coeficientes.
     * @default coefs = { c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveConstant(coefs?: Coefficients): void

    /**
     * Monta uma Função Afim: ƒ(x) = bx + c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveAffine} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefB - Coeficiente b da Função Afim
     * @param coefC - Coeficiente c da Função Afim
     * @default coefB = State.globalB; coefC = State.globalC]
     * @group Função
     * @since v6.1.0
     */
    affine(coefB?: Value, coefC?: Value): void

    /**
     * Resolve uma Função Afim: ƒ(x) = bx + c
     * @param coefs - Coeficientes.
     * @default coefs = { b: State.globalB, c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveAffine(coefs?: Coefficients): void

    /**
     * Monta uma Função Quadrática: ƒ(x) = ax² + bx + c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveQuadratic} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefA - Coeficiente a da Função Quadrática
     * @param coefB - Coeficiente b da Função Quadrática
     * @param coefC - Coeficiente c da Função Quadrática
     * @default coefA = State.globalA; coefB = State.globalB; coefC = State.globalC
     * @group Função
     * @since v6.1.0
     */
    quadratic(coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Resolve uma Função Quadrática: ƒ(x) = ax² + bx + c
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveQuadratic(coefs?: Coefficients): void

    /**
     * Monta uma Função Exponencial: ƒ(x) = b × aˣ + c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveExponential} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefA - Coeficiente a da Função Exponencial
     * @param coefB - Coeficiente b da Função Exponencial
     * @param coefC - Coeficiente c da Função Exponencial
     * @default coefA = State.globalA; coefB = State.globalB; coefC = State.globalC
     * @group Função
     * @since v6.1.0
     */
    exponential(coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Resolve uma Função Exponencial: ƒ(x) = b × aˣ + c
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveExponential(coefs?: Coefficients): void

    /**
     * Monta a Função Logarítmica: ƒ(x) = b × logₐ(x) + c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveLogarithmic} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefA - Coeficiente a da Função Logarítmica
     * @param coefB - Coeficiente b da Função Logarítmica
     * @param coefC - Coeficiente c da Função Logarítmica
     * @default coefA = State.globalA; coefB = State.globalB; coefC = State.globalC
     * @group Função
     * @since v6.1.0
     */
    logarithmic(coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Resolve uma Função Logarítmica: ƒ(x) = b × logₐ(x) + c
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveLogarithmic(coefs?: Coefficients): void

    /**
     * Monta a Função Seno: ƒ(x) = b × sin(a · x) + c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveSine} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefA - Coeficiente a da Função Seno
     * @param coefB - Coeficiente b da Função Seno
     * @param coefC - Coeficiente c da Função Seno
     * @default coefA = State.globalA; coefB = State.globalB; coefC = State.globalC
     * @group Função
     * @since v6.1.0
     */
    sine(coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Resolve uma Função Seno: ƒ(x) = b × sin(a · x) + c
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveSine(coefs?: Coefficients): void

    /**
     * Monta a Função Cosseno: ƒ(x) = b × cos(a · x) + c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveCosine} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefA - Coeficiente a da Função Cosseno
     * @param coefB - Coeficiente b da Função Cosseno
     * @param coefC - Coeficiente c da Função Cosseno
     * @default coefA = State.globalA; coefB = State.globalB; coefC = State.globalC
     * @group Função
     * @since v6.1.0
     */
    cosine(coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Resolve uma Função Cosseno: ƒ(x) = b × cos(a · x) + c
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveCosine(coefs?: Coefficients): void

    /**
     * Monta a Função Tangente: ƒ(x) = b × tan(a · x) + c
     * @deprecated
     * Desde v6.6.1. Use {@link Analyze.resolveTangent} com um objeto {@link Coefficients}.
     *
     * Por causa dessa mudança, não retorna mais nada. Então, não espere que ele retorne.
     *
     * Mantido apenas para compatibilidade retroativa; **não remover**.
     * @param coefA - Coeficiente a da Função Tangente
     * @param coefB - Coeficiente b da Função Tangente
     * @param coefC - Coeficiente c da Função Tangente
     * @default coefA = State.globalA; coefB = State.globalB; coefC = State.globalC
     * @group Função
     * @since v6.1.0
     */
    tangent(coefA?: Value, coefB?: Value, coefC?: Value): void

    /**
     * Resolve uma Função Tangente: ƒ(x) = b × tan(a · x) + c
     * @param coefs - Coeficientes.
     * @default coefs = { a: State.globalA, b: State.globalB, c: State.globalC }
     * @group Função
     * @since v6.6.1
     */
    resolveTangent(coefs?: Coefficients): void
}
