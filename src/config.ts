import defaultConfigJson from "../src/JSON/config.json" with { type: "json" }
import { Ui } from "./ui.js"
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
 * Configurações padrões do programa.
 * @since ~v6.1.0
 */
export const DEFAULT_CONFIG: ConfigType = structuredClone(defaultConfigJson) as ConfigType

/**
 * Classe das configurações ativas do programa.
 * @since ~v6.7.0
 */
class ConfigStore implements ConfigType {
    /** Idioma do sistema. */
    language!: Language

    /** Se terá caracteres Unicode? */
    unicode!: boolean
    /** Se terá acentos gráficos? */
    accents!: boolean
    /** O estilo do texto. */
    textCase!: TextCase
    /** Separador decimal ("," / "."). */
    decimalSeparator!: boolean

    /** Se terá explicações? */
    explanations!: boolean
    /** Se terá erros? */
    errors!: boolean
    /** Se irá mostrar a função? */
    showFunction!: boolean
    /** Se terá que confirmar as entradas? */
    inputConfirm!: boolean
    /** Se terá que confirmar as saidas? */
    outputConfirm!: boolean
    /** Se irá simplificar a multiplicação? */
    simpleMulti!: boolean

    /** Quantidade de casas decimais. */
    decimalPlaces!: Places
    /** Qual a precisão do Logaritmo? */
    logPrecision!: Precision
    /** Qual a precisão da divisão? */
    divPrecision!: Precision
    /** Qual o limite de iterações? */
    iterationLimit!: Numeric
    /** Qual o tipo do ângulo? */
    degrees!: Degrees

    constructor() {
        Object.assign(this, structuredClone(defaultConfigJson))
    }

    /**
     * Carrega configurações salvas no `localStorage`.
     * @since ~v6.1.0
     */
    load(): void {
        const saved: Str | null = localStorage.getItem("config")

        if (!saved) return

        let parsed: Partial<ConfigType>

        try {
            parsed = JSON.parse(saved)
        } catch (e) {
            Ui.notifyOptions("[Config.load] Config corrompida no localStorage. Ignorando.", {
                explanation: String(e),
                type: "console",
            })
            localStorage.removeItem("config")
            return
        }

        const keys = Object.keys(defaultConfigJson) as ConfigKey[],
            updates: Partial<ConfigType> = {}

        for (const key of keys) {
            const defaultValue = (defaultConfigJson as Record<string, unknown>)[key],
                newValue = parsed[key]

            if (newValue == null) continue

            if (typeof newValue == typeof defaultValue) (updates as Record<string, unknown>)[key] = newValue
            else
                Ui.notifyOptions(
                    `[Config.load] Tipo inválido para '${String(key)}'. Mantendo padrão da versão atual.`,
                    { explanation: `Esperado: ${typeof defaultValue} | Recebido: ${typeof newValue}`, type: "console" }
                )
        }

        Object.assign(this, updates)
    }

    /**
     * Salva configurações atuais no `localStorage`.
     * @since ~v6.1.0
     */
    save(): void {
        try {
            localStorage.setItem("config", JSON.stringify(this))
            localStorage.setItem("configVersion", VERSION)
        } catch (e) {
            Ui.notifyOptions("[Config.save] Não foi possível salvar as configurações.", {
                explanation: String(e),
                type: "console",
            })
        }
    }

    /**
     * Reseta para os valores padrão do `JSON`.
     * @since ~v6.1.0
     */
    reset(): void {
        localStorage.removeItem("config")
        localStorage.removeItem("configVersion")
        Object.assign(this, structuredClone(defaultConfigJson))
    }
}

/**
 * Configurações ativas do programa.
 * @since ~v6.1.0
 */
export const Config = new ConfigStore()
