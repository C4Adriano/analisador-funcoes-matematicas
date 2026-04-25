/**
 * [CONFIG] Estado inicial do programa
 * - Use os valores daqui para mudar o estado do programa
 * @since v6.1.0
 */
export const State = {
    loop: false, // Loop principal

    keepType: false, // Mantém o state.type, e não pergunta ele de novo
    askCoeffs: false, // Se irá pedir os coeficientes da função (a, b, c) para o usuário

    globalA: "a", // Variável global para o coeficiente a
    globalB: "b", // Variável global para o coeficiente b
    globalC: "c", // Variável global para o coeficiente c

    type: 0, // Tipo de função

    baseFunc: [], // Função base para usar em equações entre funções
    coefficients: [], // Coeficientes da função atual (a, b, c)
    currentFunc: ["a", "b", "c"], // Função atual (a, b, c)
    history: [], // Histórico de funções analisadas
}
