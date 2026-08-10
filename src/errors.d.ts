import type { Numeric, Text } from "./values.js"

/**
 * # Errors
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo erros.
 *
 * ## Métodos:
 * - {@link Errors.range range} - Erro de intervalo
 * - {@link Errors.divZero divZero} - Erro de divisão por zero (x/0)
 * - {@link Errors.limitExceeded limitExceeded} - Erro de limite excedido
 * - {@link Errors.constantFunction constantFunction} - Erro sobre Função ser Constante, não o que foi pensado para ser
 * - {@link Errors.invalidFunction invalidFunction} - Erro de Função inválida
 * - {@link Errors.invalidLog invalidLog} - Erro de log inválido
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group Erro
 * @since v6.1.0
 */
export declare const Errors: {
    /**
     * Exibe um erro de valor fora do intervalo permitido
     * @param min - Valor mínimo permitido
     * @param max - Valor máximo permitido
     * @group Erro
     * @since v6.1.0
     */
    range(min: Numeric, max: Numeric): void

    /**
     * Exibe um erro de divisão por zero
     * @param reason - Motivo da divisão por zero
     * @group Erro
     * @since v6.1.0
     */
    divZero(reason: Text): void

    /**
     * Exibe um erro de limite de iterações estourado
     * @group Erro
     * @since v6.1.0
     */
    limitExceeded(): void

    /**
     * Exibe um erro de função que se torna constante pelos coeficientes dados
     * @param type - Tipo de função
     * @group Erro
     * @since v6.1.0
     */
    constantFunction(type: Text): void

    /**
     * Exibe um erro de função inválida pelos coeficientes dados
     * @param type - Tipo de função
     * @group Erro
     * @since v6.1.0
     */
    invalidFunction(type: Text): void

    /**
     * Exibe um erro de logaritmo inválido
     * @param type - Tipo de logaritmo (log, ln, etc.)
     * @param reason - Motivo do erro
     * @group Erro
     * @since v6.1.0
     */
    invalidLog(type: Text, reason: Text): void
}
