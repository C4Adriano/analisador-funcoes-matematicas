import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Writing } from "./writing.js"
export const Checks = {
    isText(value) {
        return typeof value === "string"
    },
    isValidText(value) {
        return Checks.isText(value) && value.trim().length > 0
    },
    isNumeric(value) {
        return typeof value === "number"
    },
    isFiniteNumber(value) {
        return Checks.isNumeric(value) || (Checks.isText(value) && Number.isFinite(value))
    },
    isValue(value) {
        return Checks.isText(value) || Checks.isNumeric(value)
    },
    isValidValue(value) {
        return Checks.isValidText(value) || Checks.isFiniteNumber(value)
    },
    isCommand(value) {
        return Checks.isText(value) && Commands.names().includes(value)
    },
    isConfigKey(value) {
        return Checks.isValidText(value) && Object.keys(Config).includes(value)
    },
    numericPoint(points, index) {
        return Number(Writing.decimal(points[index] ?? 0, true))
    },
}
