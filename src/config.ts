import defaultConfigJson from "../src/JSON/config.json" with { type: "json" }
import { VERSION } from "./version.js"

/**
 * Tipo de configuração baseado no `JSON`.
 * @since ~v6.1.0
 */
export type ConfigType = {
    language: Language

    unicode: boolean
    accents: boolean
    textCase: TextCase
    decimalSeparator: boolean

    explanations: boolean
    errors: boolean
    showFunction: boolean
    inputConfirm: boolean
    outputConfirm: boolean
    simpleMulti: boolean

    decimalPlaces: Places
    logPrecision: Precision
    divPrecision: Precision
    iterationLimit: Numeric
    degrees: Degrees
}

export type ConfigKey = keyof ConfigType

/**
 * Configurações ativas do programa.
 * @since ~v6.1.0
 */
export const Config: ConfigType = structuredClone(defaultConfigJson) as ConfigType

/**
 * Configurações padrões do programa.
 * @since ~v6.1.0
 */
export const DEFAULT_CONFIG: ConfigType = structuredClone(defaultConfigJson) as ConfigType

/**
 * Carrega configurações salvas no `localStorage`.
 * @since ~v6.1.0
 */
export const loadConfig = () => {
    const saved: Str | null = localStorage.getItem("config"),
        savedVersion: Str | null = localStorage.getItem("configVersion")

    if (!saved) return

    if (savedVersion != VERSION) {
        localStorage.removeItem("config")
        localStorage.removeItem("configVersion")
        return
    }

    let parsed: Partial<ConfigType>

    try {
        parsed = JSON.parse(saved)
    } catch (e) {
        console.warn("[loadConfig] Config corrompida no localStorage. Ignorando.", e)
        localStorage.removeItem("config")
        localStorage.removeItem("configVersion")
        return
    }

    const keys = Object.keys(parsed) as (keyof ConfigType)[]

    for (const key of keys) {
        if (!(key in Config)) continue

        const currentType = typeof Config[key],
            newValue = parsed[key]

        if (typeof newValue == currentType) (Config as Record<string, unknown>)[key] = newValue
        else {
            console.warn(
                `[loadConfig] Tipo inválido para '${String(key)}'.`,
                `Esperado: ${currentType} | Recebido: ${typeof newValue}`
            )
        }
    }
}

/**
 * Salva configurações atuais no `localStorage`.
 * @since ~v6.1.0
 */
export const saveConfig = () => {
    try {
        localStorage.setItem("config", JSON.stringify(Config))
        localStorage.setItem("configVersion", VERSION)
    } catch (e) {
        console.warn("[saveConfig] Não foi possível salvar as configurações.", e)
    }
}

/**
 * Reseta para os valores padrão do `JSON`.
 * @since ~v6.1.0
 */
export const resetConfig = () => {
    localStorage.removeItem("config")
    localStorage.removeItem("configVersion")

    Object.assign(Config, structuredClone(defaultConfigJson))
}
