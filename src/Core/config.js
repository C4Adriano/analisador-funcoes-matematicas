import { isFiniteNumber } from "./checks.js"
export const DEFAULT_CONFIG = {
    angleUnit: "deg",
    decimalPlaces: 6,
    decimalSeparator: "comma",
    divPrecision: 1e-12,
    exitConfirm: "on",
    implicitMulti: "on",
    inputConfirm: "off",
    iterationLimit: 1000,
    language: "pt-br",
    logPrecision: 1e-12,
    showAccents: "on",
    showErrors: "on",
    showExplanations: "on",
    showFunction: "on",
    showTrivialFactors: "off",
    showUnicode: "on",
    showWelcome: "off",
    textCase: "default",
}
const CONFIG_KEYS = Object.keys(DEFAULT_CONFIG),
    TOGGLE = new Set(["on", "off"]),
    PRECISIONS = new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
    VALID_VALUES = {
        angleUnit: new Set(["deg", "rad"]),
        decimalPlaces: new Set([3, 4, 5, 6, 7, 8, 9, 10]),
        decimalSeparator: new Set(["comma", "dot"]),
        divPrecision: PRECISIONS,
        exitConfirm: TOGGLE,
        implicitMulti: TOGGLE,
        inputConfirm: TOGGLE,
        language: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]),
        logPrecision: PRECISIONS,
        showAccents: TOGGLE,
        showErrors: TOGGLE,
        showExplanations: TOGGLE,
        showFunction: new Set(["on", "off", "changed"]),
        showTrivialFactors: new Set(["on", "off", "zero", "one"]),
        showUnicode: TOGGLE,
        showWelcome: TOGGLE,
        textCase: new Set(["default", "uppercase", "capitalized", "lowercase"]),
    },
    LEGACY_KEYS = ["configVersao", "configVersion"],
    RENAMED_KEYS = new Map([
        ["accents", "showAccents"],
        ["degrees", "angleUnit"],
        ["errors", "showErrors"],
        ["explanations", "showExplanations"],
        ["explicitMulti", "showTrivialFactors"],
        ["outputConfirm", "exitConfirm"],
        ["simpleMulti", "implicitMulti"],
        ["unicode", "showUnicode"],
    ]),
    BOOLEAN_TO_TOGGLE = new Map([
        [true, "on"],
        [false, "off"],
    ]),
    RENAMED_VALUES = {
        exitConfirm: BOOLEAN_TO_TOGGLE,
        implicitMulti: BOOLEAN_TO_TOGGLE,
        inputConfirm: BOOLEAN_TO_TOGGLE,
        showAccents: BOOLEAN_TO_TOGGLE,
        showErrors: BOOLEAN_TO_TOGGLE,
        showExplanations: BOOLEAN_TO_TOGGLE,
        showFunction: new Map([
            ["always", "on"],
            ["never", "off"],
            ["onChange", "changed"],
        ]),
        showTrivialFactors: new Map([
            ["always", "on"],
            ["never", "off"],
        ]),
        showUnicode: BOOLEAN_TO_TOGGLE,
        textCase: new Map([["normal", "default"]]),
    }
function isValidConfig(key, value) {
    if (typeof value !== typeof DEFAULT_CONFIG[key]) return false
    return key === "iterationLimit" ? isFiniteNumber(value) && value >= 100 && value <= 10000 && Number.isSafeInteger(value) : (VALID_VALUES[key]?.has(value) ?? true)
}
class ConfigStore {
    constructor() {
        Object.assign(this, DEFAULT_CONFIG)
    }
    load() {
        for (const key of LEGACY_KEYS) localStorage.removeItem(key)
        const saved = localStorage.getItem("config")
        if (saved == null || saved.trim() === "") return "empty"
        let parsed
        try {
            parsed = JSON.parse(saved)
        } catch {
            localStorage.removeItem("config")
            return "corrupted"
        }
        if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
            localStorage.removeItem("config")
            return "corrupted"
        }
        const stored = parsed,
            updates = {}
        let dirty = false
        for (const [storedKey, storedValue] of Object.entries(stored)) {
            const key = RENAMED_KEYS.get(storedKey) ?? storedKey
            if (!isConfigKey(key)) {
                console.warn(`[Config] Removed unknown key "${storedKey}".`)
                dirty = true
                continue
            }
            if (key !== storedKey) {
                dirty = true
                if (Object.hasOwn(stored, key)) continue
            }
            const map = RENAMED_VALUES[key],
                value = map?.has(storedValue) ? map.get(storedValue) : storedValue
            if (value !== storedValue) dirty = true
            if (!isValidConfig(key, value)) {
                console.warn(`[Config] Invalid value ${JSON.stringify(storedValue)} for "${key}"; using default ${JSON.stringify(DEFAULT_CONFIG[key])}.`)
                dirty = true
                continue
            }
            updates[key] = value
        }
        Object.assign(this, updates)
        if (dirty) this.save()
        return "loaded"
    }
    save() {
        try {
            localStorage.setItem("config", JSON.stringify(this))
            return true
        } catch {
            return false
        }
    }
    reset() {
        localStorage.removeItem("config")
        Object.assign(this, DEFAULT_CONFIG)
    }
}
export function isConfigKey(value) {
    return typeof value === "string" && CONFIG_KEYS.includes(value)
}
export const Config = new ConfigStore()
