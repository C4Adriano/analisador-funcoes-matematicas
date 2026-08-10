import type { Value, ValueArray } from "./values.js"

/**
 * # Analyze
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo análise de funções.
 *
 * ## Métodos:
 * - {@link Analyze.constant constant} - Função Constante
 * - {@link Analyze.affine affine} - Função Afim
 * - {@link Analyze.quadratic quadratic} - Função Quadrática
 * - {@link Analyze.exponential exponential} - Função Exponencial
 * - {@link Analyze.logarithmic logarithmic} - Função Logarítmica
 * - {@link Analyze.sine sine} - Função Seno
 * - {@link Analyze.cosine cosine} - Função Cosseno
 * - {@link Analyze.tangent tangent} - Função Tangente
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Função
 * @since v6.1.0
 */
export declare const Algebra: {
    /**
     * Monta uma função constante: ƒ(x) = c
     * @param coefC - Coeficiente c da função constante
     * @returns Retorna: [coefC]
     * @group Função
     * @since v6.1.0
     */
    constant(coefC: Value): ValueArray

    /**
     * Monta uma função afim: ƒ(x) = bx + c
     * @param coefB - Coeficiente b da função afim
     * @param coefC - Coeficiente c da função afim
     * @returns Retorna: [coefB, coefC]
     * @group Função
     * @since v6.1.0
     */
    affine(coefB: Value, coefC: Value): ValueArray

    /**
     * Monta uma função quadrática: ƒ(x) = ax² + bx + c
     * @param coefA - Coeficiente a da função quadrática
     * @param coefB - Coeficiente b da função quadrática
     * @param coefC - Coeficiente c da função quadrática
     * @returns Retorna: [coefA, coefB, coefC]
     * @group Função
     * @since v6.1.0
     */
    quadratic(coefA: Value, coefB: Value, coefC: Value): ValueArray

    /**
     * Monta uma função exponencial: ƒ(x) = b × aˣ + c
     * @param coefA - Coeficiente a da função exponencial
     * @param coefB - Coeficiente b da função exponencial
     * @param coefC - Coeficiente c da função exponencial
     * @returns Retorna: [coefA, coefB, coefC]
     * @group Função
     * @since v6.1.0
     */
    exponential(coefA: Value, coefB: Value, coefC: Value): ValueArray

    /**
     * Monta a função logarítmica: b × logₐ(x) + c
     * @param coefA - Coeficiente a da função logarítmica
     * @param coefB - Coeficiente b da função logarítmica
     * @param coefC - Coeficiente c da função logarítmica
     * @returns Retorna: [coefA, coefB, coefC]
     * @group Função
     * @since v6.1.0
     */
    logarithmic(coefA: Value, coefB: Value, coefC: Value): ValueArray

    /**
     * Monta a função seno: b × sin(a · x) + c
     * @param coefA - Coeficiente a da função seno
     * @param coefB - Coeficiente b da função seno
     * @param coefC - Coeficiente c da função seno
     * @returns Retorna: [coefA, coefB, coefC]
     * @group Função
     * @since v6.1.0
     */
    sine(coefA: Value, coefB: Value, coefC: Value): ValueArray

    /**
     * Monta a função cosseno: b × cos(a · x) + c
     * @param coefA - Coeficiente a da função cosseno
     * @param coefB - Coeficiente b da função cosseno
     * @param coefC - Coeficiente c da função cosseno
     * @returns Retorna: [coefA, coefB, coefC]
     * @group Função
     * @since v6.1.0
     */
    cosine(coefA: Value, coefB: Value, coefC: Value): ValueArray

    /**
     * Monta a função tangente: b × tan(a · x) + c
     * @param coefA - Coeficiente a da função tangente
     * @param coefB - Coeficiente b da função tangente
     * @param coefC - Coeficiente c da função tangente
     * @returns Retorna: [coefA, coefB, coefC]
     * @group Função
     * @since v6.1.0
     */
    tangent(coefA: Value, coefB: Value, coefC: Value): ValueArray
}
