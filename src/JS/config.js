/**
 * [CONFIG] Configurações do programa
 * - Edite os valores aqui para mudar os valores padrões das configurações. Porém tente não ultrapassar os limites ou alterar os tipos dos valores
 * @since v6.1.0
 */
export const Config = {
    language: "pt-br", // Linguagem para as mensagens do programa (em construção, por enquanto só pt-br / en)
    debug: false, // Exibir mensagens de debug detalhadas para o desenvolvedor (como os passos intermediários dos cálculos)

    unicode: true, // Usar Unicode para deixar bonitinhas as frases / expressões (como Δ, ∈, etc.)
    explanations: true, // Exibir explicações detalhadas junto com os resultados
    accents: true, // Usar acentos nas palavras
    capitalized: true, // Forma normal de texto, com a primeira letra de cada frase em maiúscula
    uppercase: false, // Todas as letras em maiúscula
    lowercase: false, // Todas as letras em minúscula

    decimalSeparator: true, // Usar vírgula como separador decimal (em vez de ponto)
    simpleMulti: true, // Juntar letras em múltiplos (como "2x" em vez de "2 · x")
    inputConfirm: false, // Exibir mensagens de confirmação para as entradas do usuário
    outputConfirm: true, // Exibir mensagem de confirmação para sair do programa
    errors: true, // Exibir mensagens de erro detalhadas para o usuário
    showFunction: true, // Exibir a função que está sendo analisada antes dos resultados

    decimalPlaces: 6, // Número de casas decimais para arredondar os resultados numéricos
    logPrecision: 1e-12, // Precisão para cálculos logarítmicos (para evitar erros de arredondamento)
    divPrecision: 1e-12, // Precisão para cálculos de divisão (para evitar divisão por zero)
    interactionLimit: 1000, // Limite de interações para evitar state.loops infinitos (como no estudo do sinal de uma função sem raízes reais, onde o programa pode tentar testar infinitos valores de x para encontrar as raízes)
    degrees: false, // Usar graus ou radianos
}

/**
 * [CONFIG] Carrega as configurações salvas no localStorage (se existirem)
 * @since v6.1.0
 */
export function loadConfig() {
    let saved = localStorage.getItem("config"),
        savedVersion = localStorage.getItem("configVersion")

    if (saved == null) {
        return
    }

    if (savedVersion !== VERSION) {
        localStorage.removeItem("config")
        localStorage.removeItem("configVersion")
        return
    }

    let savedConfig
    try {
        savedConfig = JSON.parse(saved)
    } catch (e) {
        console.warn("[loadConfig] Config corrompida no localStorage. Ignorando.", e)
        localStorage.removeItem("config")
        localStorage.removeItem("configVersion")
        return
    }

    let keys = Object.keys(savedConfig)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (Config[key] !== undefined && typeof savedConfig[key] === typeof Config[key]) {
            Config[key] = savedConfig[key]
        } else if (Config[key] !== undefined) {
            console.warn(
                "[loadConfig] Tipo inválido para '" + key + "'.",
                "Esperado: " + typeof Config[key] + " | Recebido: " + typeof savedConfig[key]
            )
        }
    }
}

/**
 * [CONFIG] Salva as configurações atuais no localStorage
 * @since v6.1.0
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
 * [CONFIG] Remove as configurações salvas no localStorage, restaurando os padrões
 * @since v6.1.0
 */
export function resetConfig() {
    localStorage.removeItem("config")
    localStorage.removeItem("configVersion")

    let keys = Object.keys(DEFAULT_CONFIG)
    for (let i = 0; i < keys.length; i++) {
        Config[keys[i]] = DEFAULT_CONFIG[keys[i]]
    }
}

/**
 * [CONFIG] Configurações padrão do programa (para restaurar as configurações)
 * @since v6.1.0
 */
export const DEFAULT_CONFIG = JSON.parse(JSON.stringify(Config))

/**
 * [CONFIG] Versão do programa (MAJOR.MINOR.PATCH)
 * @since v6.1.0
 */
export const VERSION = "v6.2.0"
