import { Ui } from "./ui.js"

/**
 * [ERRO] Mensagens de erro padronizadas do programa
 * - Use as funções aqui para exibir erros ao usuário. Nunca chame Ui.error() diretamente
 * @since v6.1.0
 */
export const Error = {
    /**
     * [ERRO] Exibe um erro de valor fora do intervalo permitido
     * @param {number} min - Valor mínimo permitido
     * @param {number} max - Valor máximo permitido
     * @since v6.1.0
     */
    range(min = 0, max = 1) {
        Ui.error(
            "ERRO-001: Escolha um valor entre " +
                String(min + (min == 0 ? 1 : 0)) +
                " e " +
                String(max) +
                (min == 0 ? " ou selecione 0 para voltar / sair" : ""),
            "Tu escolheste algo fora do intervalo.",
        )
    },

    /**
     * [ERRO] Exibe um erro de divisão por zero
     * @param {string} reason - Motivo da divisão por zero, para exibir uma mensagem mais específica (opcional)
     * @since v6.1.0
     */
    divZero(reason = "") {
        Ui.error(
            "ERRO-002: Divisão por zero",
            reason != "" ? "Motivo: " + reason : "Tu tentaste dividir um número por zero, o que não é possível.",
        )
    },

    /**
     * [ERRO] Exibe um erro de limite de interações estourado
     * @since v6.1.0
     */
    limitExceeded() {
        Ui.error("ERRO-003: Ultrapassou o limite", "A quantidade de interações passou do limite.")
    },

    /**
     * [ERRO] Exibe um erro de função que se torna constante pelos coeficientes dados
     * @param {string} type - Tipo
     * @since v6.1.0
     */
    constantFunction(type = "") {
        Ui.error("ERRO-004: A função não é " + type + "; ela é constante", "(a = 0) ∨ (a = 1) ∨ (b = 0)")
    },

    /**
     * [ERRO] Exibe um erro de função inválida pelos coeficientes dados
     * @param {string} type - Tipo
     * @since v6.1.0
     */
    invalidFunction(type = "") {
        Ui.error("ERRO-005: A função não é " + type, "a < 0")
    },

    /**
     * [ERRO] Exibe um erro de logaritmo inválido
     * @param {string} type - Tipo de logaritmo (log, ln, etc.), para exibir uma mensagem mais específica (opcional)
     * @param {string} reason - Motivo do erro, para exibir uma mensagem mais específica (opcional)
     * @since v6.1.0
     */
    invalidLog(type = "log", reason = "") {
        Ui.error(
            "ERRO-006: " + type + " inválido",
            reason != ""
                ? "Motivo: " + reason
                : "Tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível.",
        )
    },
}
