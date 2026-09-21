import defaultConfigJson from "./JSON/config.json" with { type: "json" }
import { Ui } from "./ui.js"
import { VERSION } from "./version.js"

/**
 * Tipo de configuração baseado no `JSON`.
 * @since ~v6.1.0
 */
interface ConfigType {
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

type ConfigKey = keyof ConfigType

/**
 * Configurações padrões do programa.
 * @since ~v6.1.0
 */
const DEFAULT_CONFIG: ConfigType = structuredClone(defaultConfigJson) as ConfigType

/**
 * Classe das configurações ativas do programa.
 * @since ~v6.7.0
 */
class ConfigStore implements ConfigType {
    /**
     * Idioma do sistema.
     */
    public language!: Language

    /**
     * Se terá caracteres Unicode?
     */
    public unicode!: boolean

    /**
     * Se terá acentos gráficos?
     */
    public accents!: boolean

    /**
     * O estilo do texto.
     */
    public textCase!: TextCase

    /**
     * Separador decimal ("," / ".").
     */
    public decimalSeparator!: boolean

    /**
     * Se terá explicações?
     */
    public explanations!: boolean

    /**
     * Se terá erros?
     */
    public errors!: boolean

    /**
     * Se irá mostrar a função?
     */
    public showFunction!: boolean

    /**
     * Se terá que confirmar as entradas?
     */
    public inputConfirm!: boolean

    /**
     * Se terá que confirmar as saidas?
     */
    public outputConfirm!: boolean

    /**
     * Se irá simplificar a multiplicação?
     */
    public simpleMulti!: boolean

    /**
     * Quantidade de casas decimais.
     */
    public decimalPlaces!: Places

    /**
     * Qual a precisão do Logaritmo?
     */
    public logPrecision!: Precision

    /**
     * Qual a precisão da divisão?
     */
    public divPrecision!: Precision

    /**
     * Qual o limite de iterações?
     */
    public iterationLimit!: Numeric

    /**
     * Qual o tipo do ângulo?
     */
    public degrees!: Degrees

    public constructor() {
        Object.assign(this, structuredClone(defaultConfigJson))
    }

    /**
     * Carrega configurações salvas no `localStorage`.
     * @since ~v6.1.0
     */
    public load(): void {
        const saved: Str | null = localStorage.getItem("config")

        if (saved == null || saved.trim() == "") return

        let parsed: Partial<ConfigType>

        try {
            parsed = JSON.parse(saved) as Partial<ConfigType>
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
            const value = parsed[key]

            if (value == null) continue

            const defaultValue = (defaultConfigJson as Record<string, unknown>)[key]

            if (typeof value == typeof defaultValue) (updates as Record<string, unknown>)[key] = value
            else
                Ui.notifyOptions(`[Config.load] Tipo inválido para '${key}'. Mantendo padrão da versão atual.`, {
                    explanation: `Esperado: ${typeof defaultValue} | Recebido: ${typeof value}`,
                    type: "console",
                })
        }

        Object.assign(this, updates)
    }

    /**
     * Salva configurações atuais no `localStorage`.
     * @since ~v6.1.0
     */
    public save(): void {
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
    public reset(): void {
        localStorage.removeItem("config")
        localStorage.removeItem("configVersion")
        Object.assign(this, structuredClone(defaultConfigJson))
    }
}

/**
 * Configurações ativas do programa.
 * @since ~v6.1.0
 */
const Config = new ConfigStore()

export { Config, DEFAULT_CONFIG }
export type { ConfigKey, ConfigType }
