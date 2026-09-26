import defaultConfigJson from "./JSON/config.json" with { type: "json" };
import { VERSION } from "./version.js";
const DEFAULT_CONFIG = structuredClone(defaultConfigJson), CONFIG_KEYS = Object.keys(defaultConfigJson), VALID_VALUES = {
    degrees: new Set(["deg", "rad"]),
    language: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]),
    textCase: new Set(["uppercase", "capitalized", "lowercase", "default"]),
    divPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
    logPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
    explicitMulti: new Set(["never", "zero", "one", "always"]),
    showFunction: new Set(["always", "never", "onChange"]),
};
class ConfigStore {
    #accents;
    #decimalPlaces;
    #decimalSeparator;
    #degrees;
    #divPrecision;
    #errors;
    #explanations;
    #explicitMulti;
    #inputConfirm;
    #iterationLimit;
    #language;
    #logPrecision;
    #outputConfirm;
    #showFunction;
    #simpleMulti;
    #textCase;
    #unicode;
    constructor() {
        const initial = structuredClone(defaultConfigJson);
        this.#accents = initial.accents;
        this.#decimalPlaces = initial.decimalPlaces;
        this.#decimalSeparator = initial.decimalSeparator;
        this.#degrees = initial.degrees;
        this.#divPrecision = initial.divPrecision;
        this.#errors = initial.errors;
        this.#explanations = initial.explanations;
        this.#explicitMulti = initial.explicitMulti;
        this.#inputConfirm = initial.inputConfirm;
        this.#iterationLimit = initial.iterationLimit;
        this.#language = initial.language;
        this.#logPrecision = initial.logPrecision;
        this.#outputConfirm = initial.outputConfirm;
        this.#showFunction = initial.showFunction;
        this.#simpleMulti = initial.simpleMulti;
        this.#textCase = initial.textCase;
        this.#unicode = initial.unicode;
    }
    get accents() {
        return this.#accents;
    }
    set accents(value) {
        this.#accents = value;
    }
    get decimalPlaces() {
        return this.#decimalPlaces;
    }
    set decimalPlaces(value) {
        this.#decimalPlaces = value;
    }
    get decimalSeparator() {
        return this.#decimalSeparator;
    }
    set decimalSeparator(value) {
        this.#decimalSeparator = value;
    }
    get degrees() {
        return this.#degrees;
    }
    set degrees(value) {
        this.#degrees = value;
    }
    get divPrecision() {
        return this.#divPrecision;
    }
    set divPrecision(value) {
        this.#divPrecision = value;
    }
    get errors() {
        return this.#errors;
    }
    set errors(value) {
        this.#errors = value;
    }
    get explanations() {
        return this.#explanations;
    }
    set explanations(value) {
        this.#explanations = value;
    }
    get explicitMulti() {
        return this.#explicitMulti;
    }
    set explicitMulti(value) {
        this.#explicitMulti = value;
    }
    get inputConfirm() {
        return this.#inputConfirm;
    }
    set inputConfirm(value) {
        this.#inputConfirm = value;
    }
    get iterationLimit() {
        return this.#iterationLimit;
    }
    set iterationLimit(value) {
        this.#iterationLimit = value;
    }
    get language() {
        return this.#language;
    }
    set language(value) {
        this.#language = value;
    }
    get logPrecision() {
        return this.#logPrecision;
    }
    set logPrecision(value) {
        this.#logPrecision = value;
    }
    get outputConfirm() {
        return this.#outputConfirm;
    }
    set outputConfirm(value) {
        this.#outputConfirm = value;
    }
    get showFunction() {
        return this.#showFunction;
    }
    set showFunction(value) {
        this.#showFunction = value;
    }
    get simpleMulti() {
        return this.#simpleMulti;
    }
    set simpleMulti(value) {
        this.#simpleMulti = value;
    }
    get textCase() {
        return this.#textCase;
    }
    set textCase(value) {
        this.#textCase = value;
    }
    get unicode() {
        return this.#unicode;
    }
    set unicode(value) {
        this.#unicode = value;
    }
    load() {
        const saved = localStorage.getItem("config");
        if (saved == null || saved.trim() === "")
            return "empty";
        let parsed;
        try {
            parsed = JSON.parse(saved);
        }
        catch {
            localStorage.removeItem("config");
            return "corrupted";
        }
        const updates = {};
        for (const key of CONFIG_KEYS) {
            const value = parsed[key];
            if (value == null)
                continue;
            const defaultValue = defaultConfigJson[key];
            if (typeof value !== typeof defaultValue)
                continue;
            const allowed = VALID_VALUES[key];
            if (allowed && !allowed.has(value))
                continue;
            updates[key] = value;
        }
        Object.assign(this, updates);
        return "loaded";
    }
    save() {
        try {
            localStorage.setItem("config", JSON.stringify(this));
            localStorage.setItem("configVersion", VERSION);
            return true;
        }
        catch {
            return false;
        }
    }
    reset() {
        localStorage.removeItem("config");
        localStorage.removeItem("configVersion");
        Object.assign(this, structuredClone(defaultConfigJson));
    }
}
const Config = new ConfigStore();
function isConfigKey(value) {
    return typeof value === "string" && CONFIG_KEYS.includes(value);
}
export { Config, DEFAULT_CONFIG, isConfigKey };
