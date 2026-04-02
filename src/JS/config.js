/**
 * Configurações do programa
 * - Edite os valores aqui para mudar os valores padrões das configurações. Porém tente não ultrapassar os limites ou alterar os tipos dos valores
 */
export const Config = {
    linguagem: "en", // Linguagem para as mensagens do programa (em construção, por enquanto só pt-br / en)
    debug: false, // Exibir mensagens de debug detalhadas para o desenvolvedor (como os passos intermediários dos cálculos)

    unicode: true, // Usar Unicode para deixar bonitinhas as frases / expressões (como Δ, ∈, etc.)
    explicacoes: true, // Exibir explicações detalhadas junto com os resultados
    acentos: false, // Usar acentos nas palavras (como "raízes" em vez de "raizes")
    capitalizadas: true, // Forma normal de texto, com a primeira letra de cada frase em maiúscula
    maiusculas: false, // Todas as letras em maiúscula
    minusculas: false, // Todas as letras em minúscula

    separadorDecimal: false, // Usar vírgula como separador decimal (em vez de ponto)
    multiSimples: true, // Juntar letras em multiplos (como "2x" em vez de "2 · x")
    confirmacoesEntrada: false, // Exibir mensagens de confirmação para as entradas do usuário
    confirmacoesSaida: true, // Exibir mensagem de confirmação para sair do programa
    erros: true, // Exibir mensagens de erro detalhadas para o usuário
    mostrarFuncao: true, // Exibir a função que está sendo analisada antes dos resultados

    casasDecimais: 6, // Número de casas decimais para arredondar os resultados numéricos
    logPrecisao: 1e-12, // Precisão para cálculos logarítmicos (para evitar erros de arredondamento)
    divPrecisao: 1e-12, // Precisão para cálculos de divisão (para evitar divisão por zero)
    limiteInteracoes: 1000, // Limite de interações para evitar state.loops infinitos (como no estudo do sinal de uma função sem raízes reais, onde o programa pode tentar testar infinitos valores de x para encontrar as raízes)
    graus: false, // Usar graus ou radianos
}

/**
 * Carrega as configurações salvas no localStorage (se existirem)
 */
export function carregarConfig() {
    let salvo = localStorage.getItem("config"),
        versaoSalva = localStorage.getItem("configVersao")

    if (salvo == null) {
        return
    }

    if (versaoSalva !== VERSAO) {
        // Versão diferente: descarta o salvo e começa do zero
        localStorage.removeItem("config")
        localStorage.removeItem("configVersao")
        return
    }

    let configSalva = JSON.parse(salvo),
        chaves = Object.keys(configSalva)

    for (let i = 0; i < chaves.length; i++) {
        let chave = chaves[i]
        if (Config[chave] !== undefined) {
            Config[chave] = configSalva[chave]
        }
    }
}

/**
 * Salva as configurações atuais no localStorage
 */
export function salvarConfig() {
    localStorage.setItem("config", JSON.stringify(Config))
    localStorage.setItem("configVersao", VERSAO)
    console.log("Configurações salvas:", Config)
}

/**
 * Remove as configurações salvas no localStorage, restaurando os padrões
 */
export function resetarConfig() {
    localStorage.removeItem("config")

    let chaves = Object.keys(CONFIG_PADRAO)
    for (let i = 0; i < chaves.length; i++) {
        Config[chaves[i]] = CONFIG_PADRAO[chaves[i]]
    }
}

/**
 * Configurações padrão do programa (para restaurar as configurações)
 */
export const CONFIG_PADRAO = JSON.parse(JSON.stringify(Config))

/**
 * Versão do programa (MAJOR.MINOR.PATCH)
 */
export const VERSAO = "v6.1.1"
