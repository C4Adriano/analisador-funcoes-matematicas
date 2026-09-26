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

const DEFAULT_CONFIG: ConfigType = structuredClone(defaultConfigJson as ConfigType),
    CONFIG_KEYS = Object.keys(defaultConfigJson) as ConfigKey[],
    VALID_VALUES: Partial<Record<ConfigKey, ReadonlySet<unknown>>> = {
        degrees: new Set(["deg", "rad"]),
        language: new Set(["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]),
        textCase: new Set(["uppercase", "capitalized", "lowercase", "default"]),
        divPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
        logPrecision: new Set([1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12]),
        explicitMulti: new Set(["never", "zero", "one", "always"]),
        showFunction: new Set(["always", "never", "onChange"]),
    }

class ConfigStore implements ConfigType {
    #accents: boolean
    #decimalPlaces: Places
    #decimalSeparator: boolean
    #degrees: Degrees
    #divPrecision: Precision
    #errors: boolean
    #explanations: boolean
    #explicitMulti: ExplicitMulti
    #inputConfirm: boolean
    #iterationLimit: number
    #language: Language
    #logPrecision: Precision
    #outputConfirm: boolean
    #showFunction: ShowFunction
    #simpleMulti: boolean
    #textCase: TextCase
    #unicode: boolean

    public constructor() {
        const initial = structuredClone(defaultConfigJson) as ConfigType

        this.#accents = initial.accents
        this.#decimalPlaces = initial.decimalPlaces
        this.#decimalSeparator = initial.decimalSeparator
        this.#degrees = initial.degrees
        this.#divPrecision = initial.divPrecision
        this.#errors = initial.errors
        this.#explanations = initial.explanations
        this.#explicitMulti = initial.explicitMulti
        this.#inputConfirm = initial.inputConfirm
        this.#iterationLimit = initial.iterationLimit
        this.#language = initial.language
        this.#logPrecision = initial.logPrecision
        this.#outputConfirm = initial.outputConfirm
        this.#showFunction = initial.showFunction
        this.#simpleMulti = initial.simpleMulti
        this.#textCase = initial.textCase
        this.#unicode = initial.unicode
    }

    public get accents(): boolean {
        return this.#accents
    }

    public set accents(value: boolean) {
        this.#accents = value
    }

    public get decimalPlaces(): Places {
        return this.#decimalPlaces
    }

    public set decimalPlaces(value: Places) {
        this.#decimalPlaces = value
    }

    public get decimalSeparator(): boolean {
        return this.#decimalSeparator
    }

    public set decimalSeparator(value: boolean) {
        this.#decimalSeparator = value
    }

    public get degrees(): Degrees {
        return this.#degrees
    }

    public set degrees(value: Degrees) {
        this.#degrees = value
    }

    public get divPrecision(): Precision {
        return this.#divPrecision
    }

    public set divPrecision(value: Precision) {
        this.#divPrecision = value
    }

    public get errors(): boolean {
        return this.#errors
    }

    public set errors(value: boolean) {
        this.#errors = value
    }

    public get explanations(): boolean {
        return this.#explanations
    }

    public set explanations(value: boolean) {
        this.#explanations = value
    }

    public get explicitMulti(): ExplicitMulti {
        return this.#explicitMulti
    }

    public set explicitMulti(value: ExplicitMulti) {
        this.#explicitMulti = value
    }

    public get inputConfirm(): boolean {
        return this.#inputConfirm
    }

    public set inputConfirm(value: boolean) {
        this.#inputConfirm = value
    }

    public get iterationLimit(): number {
        return this.#iterationLimit
    }

    public set iterationLimit(value: number) {
        this.#iterationLimit = value
    }

    public get language(): Language {
        return this.#language
    }

    public set language(value: Language) {
        this.#language = value
    }

    public get logPrecision(): Precision {
        return this.#logPrecision
    }

    public set logPrecision(value: Precision) {
        this.#logPrecision = value
    }

    public get outputConfirm(): boolean {
        return this.#outputConfirm
    }

    public set outputConfirm(value: boolean) {
        this.#outputConfirm = value
    }

    public get showFunction(): ShowFunction {
        return this.#showFunction
    }

    public set showFunction(value: ShowFunction) {
        this.#showFunction = value
    }

    public get simpleMulti(): boolean {
        return this.#simpleMulti
    }

    public set simpleMulti(value: boolean) {
        this.#simpleMulti = value
    }

    public get textCase(): TextCase {
        return this.#textCase
    }

    public set textCase(value: TextCase) {
        this.#textCase = value
    }

    public get unicode(): boolean {
        return this.#unicode
    }

    public set unicode(value: boolean) {
        this.#unicode = value
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

        const updates: Partial<ConfigType> = {}

        for (const key of CONFIG_KEYS) {
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

    public save(): boolean {
        try {
            localStorage.setItem("config", JSON.stringify(this))
            localStorage.setItem("configVersion", VERSION)
            return true
        } catch {
            return false
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
    return typeof value === "string" && (CONFIG_KEYS as string[]).includes(value)
}

export { Config, DEFAULT_CONFIG, isConfigKey }
export type { ConfigKey, ConfigType }
