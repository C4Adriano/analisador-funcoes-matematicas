import { Commands } from "./commands.js";
import { Config } from "./config.js";
import { Writing } from "./writing.js";
export class Checks {
    static isValidText = (value) => Checks.#isText(value) && value.trim().length > 0;
    static isFiniteNumber = (value) => (Checks.#isNumeric(value) || Checks.isValidText(value)) && Number.isFinite(Number(value));
    static isValidValue = (value) => Checks.isValidText(value) || Checks.isFiniteNumber(value);
    static isValidCommand = (value) => Checks.isValidText(value) && Checks.#isCommand(value);
    static isConfigKey = (value) => Checks.isValidValue(value) && Object.hasOwn(Config, value);
    static isTrKey = (value) => Checks.isValidText(value);
    static numericPoint = (points, index) => Writing.decimalOptions(points.at(index) ?? 0, { invert: true });
    static #isText = (value) => typeof value == "string";
    static #isNumeric = (value) => typeof value == "number";
    static #isCommand = (value) => Commands.names.includes(value);
}
