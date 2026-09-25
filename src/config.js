import defaultConfigJson from "./JSON/config.json" with { type: "json" };
import { VERSION } from "./version.js";
const DEFAULT_CONFIG = structuredClone(defaultConfigJson);
class ConfigStore {
    accents;
    decimalPlaces;
    decimalSeparator;
    degrees;
    divPrecision;
    errors;
    explanations;
    explicitMulti;
    inputConfirm;
    iterationLimit;
    language;
    logPrecision;
    outputConfirm;
    showFunction;
    simpleMulti;
    textCase;
    unicode;
    constructor() {
        Object.assign(this, structuredClone(defaultConfigJson));
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
        const keys = Object.keys(defaultConfigJson), updates = {}, VALID_VALUES = {
            degrees: new Set(["deg", "rad"]),
            language: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]),
            textCase: new Set(["uppercase", "capitalized", "lowercase", "default"]),
            divPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
            logPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
            explicitMulti: new Set(["never", "zero", "one", "always"]),
            showFunction: new Set(["always", "never", "onChange"]),
        };
        for (const key of keys) {
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
        }
        catch {
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
    return typeof value === "string" && Object.hasOwn(Config, value);
}
export { Config, DEFAULT_CONFIG, isConfigKey };
