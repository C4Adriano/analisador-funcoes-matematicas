import defaultConfigJson from "../JSON/config.json" with { type: "json" }

/**
 * Tipo automático baseado no JSON
 */
export type ConfigType = typeof defaultConfigJson

/**
 * Configurações ativas do programa
 */
export const Config: ConfigType = structuredClone(defaultConfigJson)

/**
 * Versão do programa (MAJOR.MINOR.PATCH)
 */
export const VERSION = "v6.2.0"

/**
 * Carrega configurações salvas no localStorage
 */
export function loadConfig() {
    const saved = localStorage.getItem("config")
    const savedVersion = localStorage.getItem("configVersion")

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
            ;(Config as any)[key] = newValue
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
export function saveConfig() {
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
export function resetConfig() {
    localStorage.removeItem("config")
    localStorage.removeItem("configVersion")

    Object.assign(Config, structuredClone(defaultConfigJson))
}
