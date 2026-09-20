import { Commands } from "./commands.js"
import { Config, type ConfigKey } from "./config.js"
import { Writing } from "./writing.js"

import type { TranslationKey } from "./i18n.js"

/**
 * # Checks
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo verificações.
 *
 * ## Métodos:
 * - {@link Checks.isConfigKey isConfigKey} - Verifica se é chave de `Config`.
 * - {@link Checks.isFiniteNumber isFiniteNumber} - Verifica se é um número finito.
 * - {@link Checks.isTrKey isTrKey} - Verifica se é chave de `tr`.
 * - {@link Checks.isValidCommand isValidCommand} - Verifica se é um comando válido.
 * - {@link Checks.isValidText isValidText} - Verifica se é texto válido.
 * - {@link Checks.isValidValue isValidValue} - Verifica se é um valor válido.
 * - {@link Checks.numericPoint numericPoint} - Verifica se é um ponto válido.
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group JS
 * @since v6.1.0
 */
export class Checks {
    static #isText = (value: unknown): value is Str => typeof value == "string"

    static #isNumeric = (value: unknown): value is Numeric => typeof value == "number"

    /**
     * Verifica se o valor é um texto válido.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    static isValidText = (value: unknown): value is Str => Checks.#isText(value) && value.trim().length > 0

    /**
     * Verifica se o valor é um número válido.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    static isFiniteNumber = (value: unknown): value is Numeric =>
        (Checks.#isNumeric(value) || Checks.isValidText(value)) && Number.isFinite(Number(value))

    /**
     * Verifica se o valor é um valor `(string | number)` válido.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    static isValidValue = (value: unknown): value is Value => Checks.isValidText(value) || Checks.isFiniteNumber(value)

    /**
     * Verifica se o valor é um comando válido.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    static isValidCommand = (value: unknown): value is CommandsNames =>
        Checks.isValidText(value) && Commands.names.includes(value as CommandsNames)

    /**
     * Verifica se o valor é uma chave de `Config`.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.1.0
     */
    static isConfigKey = (value: unknown): value is ConfigKey => Checks.isValidValue(value) && value in Config

    /**
     * Verifica se o valor é uma chave de `tr`.
     * @param value Valor qualquer.
     * @group JS
     * @since v6.6.8
     */
    static isTrKey = (value: unknown): value is TranslationKey => Checks.isValidText(value)

    /**
     * Verifica se um ponto do `array` é válido.
     * @param points Array de pontos.
     * @param index Número no `array` desse ponto.
     * @group JS
     * @since v6.1.0
     */
    static numericPoint = (points: ValueArray, index: Numeric): Numeric =>
        Number(Writing.decimalOptions(points.at(index) ?? 0, { invert: true }))
}
