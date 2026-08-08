import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Writing } from "./writing.js"

import type { ConfigKey } from "./config.js"
import type { CommandsNames, Numeric, Text, Value, ValueArray } from "./values.js"

/**
 * # Checks
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo verificações.
 *
 * ## Métodos:
 * - {@link Checks.isText isText} - Verifica se é texto _(string)_
 * - {@link Checks.isValidText isValidText} - Verifica se é texto válido _(string)_
 * - {@link Checks.isNumeric isNumeric} - Verifica se é número _(number)_
 * - {@link Checks.isFiniteNumber isFiniteNumber} - Verifica se é um número finito _(number)_
 * - {@link Checks.isValue isValue} - Verifica se é um valor _(string | number)_
 * - {@link Checks.isValidValue isValidValue} - Verifica se é um valor válido _(string | number)
 * - {@link Checks.isCommand isCommand} - Verifica se é um comando válido _(string)_
 * - {@link Checks.isConfigKey isConfigKey} - Verifica se é chave de Config _(string | number)_
 * - {@link Checks.numericPoint numericPoint} - Verifica se é um ponto válido _(string | number)_
 *
 * ### Tags:
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @license [License](../LICENSE.md)
 * @group JS
 * @since v6.1.0
 *
 * - [Arquivo JS](../src/checks.js)
 */
export const Checks = {
    isText(value: unknown): value is Text {
        return typeof value === "string"
    },

    isValidText(value: unknown): value is Text {
        return Checks.isText(value) && value.trim().length > 0
    },

    isNumeric(value: unknown): value is Numeric {
        return typeof value === "number"
    },

    isFiniteNumber(value: unknown): value is Numeric {
        return (
            (Checks.isNumeric(value) && Number.isFinite(value)) ||
            (Checks.isValidText(value) && Number.isFinite(Number(value)))
        )
    },

    isValue(value: unknown): value is Value {
        return Checks.isText(value) || Checks.isNumeric(value)
    },

    isValidValue(value: unknown): value is Value {
        return Checks.isValidText(value) || Checks.isFiniteNumber(value)
    },

    isCommand(value: Value): value is CommandsNames {
        return Checks.isText(value) && Commands.names().includes(value)
    },

    isConfigKey(value: unknown): value is ConfigKey {
        return Checks.isValidValue(value) && Object.keys(Config).includes(String(value))
    },

    numericPoint(points: ValueArray, index: Numeric): Numeric {
        return Number(Writing.decimal((points[index] ?? 0) as Numeric, true))
    },
}
