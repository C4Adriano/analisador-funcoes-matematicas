import defaultConfigJson from "../src/JSON/config.json" with { type: "json" }
import { VERSION } from "./version.js"

import type { Degrees, Language, Numeric, Places, Precision, Text } from "./values.js"

/**
 * Tipo de configuração baseado no JSON
 */
export type ConfigType = {
    language: Language
    debug: boolean

    unicode: boolean
    explanations: boolean
    accents: boolean
    capitalized: boolean
    uppercase: boolean
    lowercase: boolean

    decimalSeparator: boolean
    simpleMulti: boolean
    inputConfirm: boolean
    outputConfirm: boolean
    errors: boolean
    showFunction: boolean

    decimalPlaces: Places
    logPrecision: Precision
    divPrecision: Precision
    iteractionLimit: Numeric
    degrees: Degrees
}

export type ConfigKey = keyof ConfigType

/**
 * Configurações ativas do programa
 */
export const Config: ConfigType = structuredClone(defaultConfigJson) as ConfigType
export const DEFAULT_CONFIG: ConfigType = structuredClone(defaultConfigJson) as ConfigType

/**
 * Carrega configurações salvas no localStorage
 */
export function loadConfig(): void {
    const saved: Text | null = localStorage.getItem("config")
    const savedVersion: Text | null = localStorage.getItem("configVersion")

    if (!saved) return

    if (savedVersion !== VERSION) {
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

        const currentType = typeof Config[key]
        const newValue = parsed[key]

        if (typeof newValue === currentType) {
            ;(Config as Record<string, unknown>)[key] = newValue
        } else {
            console.warn(
                `[loadConfig] Tipo inválido para '${String(key)}'.`,
                `Esperado: ${currentType} | Recebido: ${typeof newValue}`
            )
        }
    }
}

/**
 * Salva configurações atuais no localStorage
 */
export function saveConfig(): void {
    try {
        localStorage.setItem("config", JSON.stringify(Config))
        localStorage.setItem("configVersion", VERSION)
    } catch (e) {
        console.warn("[saveConfig] Não foi possível salvar as configurações.", e)
    }
}

/**
 * Reseta para os valores padrão do JSON
 */
export function resetConfig(): void {
    localStorage.removeItem("config")
    localStorage.removeItem("configVersion")

    Object.assign(Config, structuredClone(defaultConfigJson))
}
