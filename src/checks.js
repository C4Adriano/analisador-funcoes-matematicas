import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Writing } from "./writing.js"
export class Checks {
    static #isText = value => typeof value == "string"
    static #isNumeric = value => typeof value == "number"
    static isValidText = value => Checks.#isText(value) && value.trim().length > 0
    static isFiniteNumber = value =>
        (Checks.#isNumeric(value) || Checks.isValidText(value)) && Number.isFinite(Number(value))
    static isValidValue = value => Checks.isValidText(value) || Checks.isFiniteNumber(value)
    static isValidCommand = value => Checks.isValidText(value) && Commands.names.includes(value)
    static isConfigKey = value => Checks.isValidValue(value) && value in Config
    static numericPoint = (points, index) => Number(Writing.decimalOptions(points[index] ?? 0, { invert: true }))
}
