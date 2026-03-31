/**
 * Estado incial do programa
 * - Use os valores daqui para mudar o estado do programa
 */
export const State = {
    manterTipo: false, // Mantem o state.tipo, e não pergunta ele de novo
    loop: false, // Loop principal
    pedirCoefs: false, // Se irá pedir os coeficientes da função (a, b, c) para o usuário
    globalA: "a", // Variável global para o coeficiente a
    globalB: "b", // Variável global para o coeficiente b
    globalC: "c", // Variável global para o coeficiente c
    tipo: 0, // Tipo de função
    funcBase: [], // Função base para usar em equações entre funções
    coeficientes: [], // Coeficientes da função atual (a, b, c)
    funcAtual: ["a", "b", "c"], // Função atual (a, b, c)
    historico: [], // Histórico de funções analisadas
}
