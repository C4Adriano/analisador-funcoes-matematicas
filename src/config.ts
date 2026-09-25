import defaultConfigJson from "./JSON/config.json" with { type: "json" }
import { VERSION } from "./version.js"

interface ConfigType {
    accents: boolean
    decimalPlaces: Places
    decimalSeparator: boolean
    degrees: Degrees
    divPrecision: Precision
    errors: boolean
    explanations: boolean
    explicitMulti: ExplicitMulti
    inputConfirm: boolean
    iterationLimit: number
    language: Language
    logPrecision: Precision
    outputConfirm: boolean
    showFunction: ShowFunction
    simpleMulti: boolean
    textCase: TextCase
    unicode: boolean
}

type ConfigKey = keyof ConfigType

const DEFAULT_CONFIG: ConfigType = structuredClone(defaultConfigJson as ConfigType)

class ConfigStore implements ConfigType {
    public accents!: boolean
    public decimalPlaces!: Places
    public decimalSeparator!: boolean
    public degrees!: Degrees
    public divPrecision!: Precision
    public errors!: boolean
    public explanations!: boolean
    public explicitMulti!: ExplicitMulti
    public inputConfirm!: boolean
    public iterationLimit!: number
    public language!: Language
    public logPrecision!: Precision
    public outputConfirm!: boolean
    public showFunction!: ShowFunction
    public simpleMulti!: boolean
    public textCase!: TextCase
    public unicode!: boolean

    public constructor() {
        Object.assign(this, structuredClone(defaultConfigJson))
    }

    public load(): "empty" | "corrupted" | "loaded" {
        const saved = localStorage.getItem("config")
        if (saved == null || saved.trim() === "") return "empty"

        let parsed: Partial<ConfigType>
        try {
            parsed = JSON.parse(saved) as Partial<ConfigType>
        } catch {
            localStorage.removeItem("config")
            return "corrupted"
        }

        const keys = Object.keys(defaultConfigJson) as ConfigKey[],
            updates: Partial<ConfigType> = {},
            VALID_VALUES: Partial<Record<ConfigKey, ReadonlySet<unknown>>> = {
                degrees: new Set(["deg", "rad"]),
                language: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]),
                textCase: new Set(["uppercase", "capitalized", "lowercase", "default"]),
                divPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
                logPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
                explicitMulti: new Set(["never", "zero", "one", "always"]),
                showFunction: new Set(["always", "never", "onChange"]),
            }

        for (const key of keys) {
            const value = parsed[key]
            if (value == null) continue
            const defaultValue = (defaultConfigJson as Record<string, unknown>)[key]
            if (typeof value !== typeof defaultValue) continue

            const allowed = VALID_VALUES[key]
            if (allowed && !allowed.has(value)) continue

            ;(updates as Record<string, unknown>)[key] = value
        }

        Object.assign(this, updates)
        return "loaded"
    }

    public save(): void {
        try {
            localStorage.setItem("config", JSON.stringify(this))
            localStorage.setItem("configVersion", VERSION)
        } catch {
            // Sem storage disponível (modo privado, quota excedida, etc.) — ignora silenciosamente
        }
    }

    public reset(): void {
        localStorage.removeItem("config")
        localStorage.removeItem("configVersion")
        Object.assign(this, structuredClone(defaultConfigJson))
    }
}

const Config = new ConfigStore()

function isConfigKey(value: unknown): value is ConfigKey {
    return typeof value === "string" && Object.hasOwn(Config, value)
}

export { Config, DEFAULT_CONFIG, isConfigKey }
export type { ConfigKey, ConfigType }
