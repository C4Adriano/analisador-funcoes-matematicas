import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Writing } from "./writing.js"

export const Checks = {
    isText: value => typeof value == "string",

    isValidText: value => Checks.isText(value) && value.trim().length > 0,

    isNumeric: value => typeof value == "number",

    isFiniteNumber: value =>
        (Checks.isNumeric(value) && Number.isFinite(value)) ||
        (Checks.isValidText(value) && Number.isFinite(Number(value))),

    isValue: value => Checks.isText(value) || Checks.isNumeric(value),

    isValidValue: value => Checks.isValidText(value) || Checks.isFiniteNumber(value),

    isCommand: value => Checks.isText(value) && Commands.names.includes(value),

    isConfigKey: value => Checks.isValidValue(value) && value in Config,

    numericPoint: (points, index) => Number(Writing.decimalOptions(points[index] ?? 0, { invert: true })),
}
