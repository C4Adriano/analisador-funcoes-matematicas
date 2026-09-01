import type { ConfigKey } from "./config.js"
import type { CommandsNames, Numeric, Text, Value, ValueArray } from "./values.js"

/**
 * # Checks
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo verificações.
 *
 * ## Métodos:
 * - {@link Checks.isValidText isValidText} - Verifica se é texto válido.
 * - {@link Checks.isFiniteNumber isFiniteNumber} - Verifica se é um número finito.
 * - {@link Checks.isValidValue isValidValue} - Verifica se é um valor válido.
 * - {@link Checks.isCommand isCommand} - Verifica se é um comando válido.
 * - {@link Checks.isConfigKey isConfigKey} - Verifica se é chave de `Config`.
 * - {@link Checks.numericPoint numericPoint} - Verifica se é um ponto válido.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group JS
 * @since v6.1.0
 */
export declare const Checks: {
    /**
     * Verifica se o valor é um texto.
     * @param value Valor qualquer.
     * @remarks
     * Não valida o conteúdo, apenas o tipo.
     *
     * Use apenas quando a validade do texto já for garantida por outro meio; para o caso geral, prefira {@link Checks.isValidText isValidText}.
     * @see {@link Checks.isValidText isValidText}
     * @group JS
     * @since v6.1.0
     */
    isText(value: unknown): value is Text

    /**
     * Verifica se o valor é um texto válido.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    isValidText(value: unknown): value is Text

    /**
     * Verifica se o valor é um número.
     * @param value Valor qualquer.
     * @remarks
     * Não garante que o número seja finito (aceita `NaN`, `Infinity` e `-Infinity`).
     *
     * Use apenas quando isso já for garantido por outro meio; para o caso geral, prefira {@link Checks.isFiniteNumber isFiniteNumber}.
     * @see {@link Checks.isFiniteNumber isFiniteNumber}
     * @group JS
     * @since v6.1.0
     */
    isNumeric(value: unknown): value is Numeric

    /**
     * Verifica se o valor é um número válido.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    isFiniteNumber(value: unknown): value is Numeric

    /**
     * Verifica se o valor é um valor `(string | number)`.
     * @param value Valor qualquer.
     * @remarks
     * Não valida o conteúdo do texto nem garante que o número seja finito.
     *
     * Use apenas quando isso já for garantido por outro meio; para o caso geral, prefira {@link Checks.isValidValue isValidValue}.
     * @see {@link Checks.isValidValue isValidValue}
     * @group JS
     * @since v6.1.0
     */
    isValue(value: unknown): value is Value

    /**
     * Verifica se o valor é um valor `(string | number)` válido.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    isValidValue(value: unknown): value is Value

    /**
     * Verifica se o valor é um comando.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    isCommand(value: Value): value is CommandsNames

    /**
     * Verifica se o valor é uma chave de `Config`.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    isConfigKey(value: unknown): value is ConfigKey

    /**
     * Verifica se um ponto do `array` é válido.
     * @param points Array de pontos.
     * @param index Número no `array` desse ponto.
     * @group JS
     * @since v6.1.0
     */
    numericPoint(points: ValueArray, index: Numeric): Numeric
}
