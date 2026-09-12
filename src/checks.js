import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Writing } from "./writing.js"

export const Checks = {
    /** @param {unknown} value */
    isText: value => typeof value == "string",

    /** @param {unknown} value */
    isValidText: value => Checks.isText(value) && value.trim().length > 0,

    /** @param {unknown} value */
    isNumeric: value => typeof value == "number",

    /** @param {unknown} value */
    isFiniteNumber: value =>
        (Checks.isNumeric(value) && Number.isFinite(value)) ||
        (Checks.isValidText(value) && Number.isFinite(Number(value))),

    /** @param {unknown} value */
    isValue: value => Checks.isText(value) || Checks.isNumeric(value),

    /** @param {unknown} value */
    isValidValue: value => Checks.isValidText(value) || Checks.isFiniteNumber(value),

    /** @param {CommandsNames} value */
    isCommand: value => Checks.isText(value) && Commands.names.includes(value),

    /** @param {CommandsNames} value */
    isValidCommand: value => Checks.isValidText(value) && Commands.names.includes(value),

    /** @param {import("./config.js").ConfigKey} value */
    isConfigKey: value => Checks.isValidValue(value) && value in Config,

    /** @param {ValueArray} points @param {Numeric} index */
    numericPoint: (points, index) => Number(Writing.decimalOptions(points[index] ?? 0, { invert: true })),
}
