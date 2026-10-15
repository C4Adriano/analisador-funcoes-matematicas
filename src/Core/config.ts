import { isFiniteNumber } from "./checks.js"
import { readStorage, removeStorage, writeStorage } from "./storage.js"

export type ConfigType = { [K in keyof ConfigStore as ConfigStore[K] extends (...args: never[]) => unknown ? never : K]: ConfigStore[K] }
export type ConfigKey = keyof ConfigType

const STORAGE_PREFIX = "config.",
    TOGGLE_KEYS = ["exitConfirm", "implicitMulti", "inputConfirm", "showAccents", "showErrors", "showExplanations", "showUnicode", "showWelcome"] as const satisfies readonly ConfigKey[],
    TOGGLE = new Set(["on", "off"]),
    PRECISIONS = new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
    LEGACY_KEYS = ["config", "configVersao", "configVersion"] as const,
    VALID_VALUES: Partial<Record<ConfigKey, ReadonlySet<unknown>>> = {
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
    }

function isValidConfig(key: ConfigKey, value: unknown, fallback: unknown): boolean {
    if (typeof value !== typeof fallback) return false
    return key === "iterationLimit" ? isFiniteNumber(value) && value >= 100 && value <= 10_000 && Number.isSafeInteger(value) : (VALID_VALUES[key]?.has(value) ?? true)
}

class ConfigStore {
    public angleUnit: AngleUnit = "deg"
    public decimalPlaces: Places = 6
    public decimalSeparator: DecimalSeparator = "comma"
    public divPrecision: Precision = 1e-12
    public exitConfirm: Toggle = "on"
    public implicitMulti: Toggle = "on"
    public inputConfirm: Toggle = "off"
    public iterationLimit = 1000
    public language: Language = "pt-br"
    public logPrecision: Precision = 1e-12
    public showAccents: Toggle = "on"
    public showErrors: Toggle = "on"
    public showExplanations: Toggle = "on"
    public showFunction: ShowFunction = "on"
    public showTrivialFactors: ExplicitMulti = "off"
    public showUnicode: Toggle = "on"
    public showWelcome: Toggle = "off"
    public textCase: TextCase = "default"

    public load(): "loaded" | "empty" {
        for (const key of LEGACY_KEYS) removeStorage(key)

        const defaults = new ConfigStore()
        let found = false

        for (const key of Object.keys(defaults) as ConfigKey[]) {
            const raw = readStorage(STORAGE_PREFIX + key)
            if (raw == null) continue

            found = true
            const value = typeof defaults[key] === "number" ? Number(raw) : raw

            if (isValidConfig(key, value, defaults[key])) Object.assign(this, { [key]: value })
            else console.warn(`[Config] Invalid value ${JSON.stringify(raw)} for "${key}"; using default ${JSON.stringify(defaults[key])}.`)
        }

        return found ? "loaded" : "empty"
    }

    public save(): void {
        for (const [key, value] of Object.entries(this)) writeStorage(STORAGE_PREFIX + key, String(value))
    }

    public reset(): void {
        for (const key of Object.keys(this)) removeStorage(STORAGE_PREFIX + key)
        Object.assign(this, new ConfigStore())
    }
}

export const Config = new ConfigStore(),
    DEFAULT_CONFIG: Readonly<ConfigType> = Object.freeze(new ConfigStore())

export function isConfigKey(value: unknown): value is ConfigKey {
    return typeof value === "string" && Object.keys(DEFAULT_CONFIG).includes(value)
}
