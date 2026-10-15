import { isFiniteNumber } from "./checks.js";
import { readStorage, removeStorage, writeStorage } from "./storage.js";
const STORAGE_PREFIX = "config.", TOGGLE_KEYS = ["exitConfirm", "implicitMulti", "inputConfirm", "showAccents", "showErrors", "showExplanations", "showUnicode", "showWelcome"], TOGGLE = new Set(["on", "off"]), PRECISIONS = new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]), LEGACY_KEYS = ["config", "configVersao", "configVersion"], VALID_VALUES = {
    ...Object.fromEntries(TOGGLE_KEYS.map(key => [key, TOGGLE])),
    angleUnit: new Set(["deg", "rad"]),
    decimalPlaces: new Set([3, 4, 5, 6, 7, 8, 9, 10]),
    decimalSeparator: new Set(["comma", "dot"]),
    divPrecision: PRECISIONS,
    language: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]),
    logPrecision: PRECISIONS,
    showFunction: new Set(["on", "off", "changed"]),
    showTrivialFactors: new Set(["on", "off", "zero", "one"]),
    textCase: new Set(["default", "uppercase", "capitalized", "lowercase"]),
};
function isValidConfig(key, value, fallback) {
    if (typeof value !== typeof fallback)
        return false;
    return key === "iterationLimit" ? isFiniteNumber(value) && value >= 100 && value <= 10000 && Number.isSafeInteger(value) : (VALID_VALUES[key]?.has(value) ?? true);
}
class ConfigStore {
    angleUnit = "deg";
    decimalPlaces = 6;
    decimalSeparator = "comma";
    divPrecision = 1e-12;
    exitConfirm = "on";
    implicitMulti = "on";
    inputConfirm = "off";
    iterationLimit = 1000;
    language = "pt-br";
    logPrecision = 1e-12;
    showAccents = "on";
    showErrors = "on";
    showExplanations = "on";
    showFunction = "on";
    showTrivialFactors = "off";
    showUnicode = "on";
    showWelcome = "off";
    textCase = "default";
    load() {
        for (const key of LEGACY_KEYS)
            removeStorage(key);
        const defaults = new ConfigStore();
        let found = false;
        for (const key of Object.keys(defaults)) {
            const raw = readStorage(STORAGE_PREFIX + key);
            if (raw == null)
                continue;
            found = true;
            const value = typeof defaults[key] === "number" ? Number(raw) : raw;
            if (isValidConfig(key, value, defaults[key]))
                Object.assign(this, { [key]: value });
            else
                console.warn(`[Config] Invalid value ${JSON.stringify(raw)} for "${key}"; using default ${JSON.stringify(defaults[key])}.`);
        }
        return found ? "loaded" : "empty";
    }
    save() {
        for (const [key, value] of Object.entries(this))
            writeStorage(STORAGE_PREFIX + key, String(value));
    }
    reset() {
        for (const key of Object.keys(this))
            removeStorage(STORAGE_PREFIX + key);
        Object.assign(this, new ConfigStore());
    }
}
export const Config = new ConfigStore(), DEFAULT_CONFIG = Object.freeze(new ConfigStore());
export function isConfigKey(value) {
    return typeof value === "string" && Object.keys(DEFAULT_CONFIG).includes(value);
}
