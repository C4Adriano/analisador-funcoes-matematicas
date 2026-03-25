/**
 * Configurações do programa
 * - Edite os valores aqui para mudar os valores padrões das configurações. Porém tente não ultrapassar os limites ou alterar os tipos dos valores
 */
export const config = {
    linguagem: "en", // Linguagem para as mensagens do programa (em construção, por enquanto só pt-br / en)

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
    graus: false // Usar graus ou radianos
}

/**
 * Configurações padrão do programa (para restaurar as configurações)
 */
export const configPadrao = JSON.parse(JSON.stringify(config))

/**
 * Versão do programa
 */
export const versao = "v6.0"