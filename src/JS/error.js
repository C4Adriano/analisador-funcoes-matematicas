import { tr } from "./i18n.js"
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
            tr("ERRO-001: Escolha um valor entre ", "ERROR-001: Choose a value between") +
                String(min + (min == 0 ? 1 : 0)) +
                tr(" e ", " and ") +
                String(max) +
                (min == 0 ? tr(" ou selecione 0 para voltar / sair", " or select 0 to go back / exit") : ""),
            tr("Tu escolheste algo fora do intervalo.", "You chose something outside the interval")
        )
    },

    /**
     * [ERRO] Exibe um erro de divisão por zero
     * @param {string} reason - Motivo da divisão por zero
     * @since v6.1.0
     */
    divZero(reason = "") {
        Ui.error(
            tr("ERRO-002: Divisão por zero", "ERROR-002: Division by zero"),
            reason != ""
                ? tr("Motivo: ", "Reason: ") + reason
                : tr(
                      "Tu tentaste dividir um número por zero, o que não é possível.",
                      "You tried to divide a number by zero, which is not possible"
                  )
        )
    },

    /**
     * [ERRO] Exibe um erro de limite de interações estourado
     * @since v6.1.0
     */
    limitExceeded() {
        Ui.error(
            tr("ERRO-003: Ultrapassou o limite", "ERROR-003: Limit exceeded"),
            tr("A quantidade de interações passou do limite.", "The number of iterations exceeded the limit.")
        )
    },

    /**
     * [ERRO] Exibe um erro de função que se torna constante pelos coeficientes dados
     * @param {string} type - Tipo de função
     * @since v6.1.0
     */
    constantFunction(type = "") {
        Ui.error(
            tr("ERRO-004: A função não é ", "ERROR-004: The function is not ") +
                type +
                tr("; ela é constante", "; it is constant"),
            "(a = 0) ∨ (a = 1) ∨ (b = 0)"
        )
    },

    /**
     * [ERRO] Exibe um erro de função inválida pelos coeficientes dados
     * @param {string} type - Tipo de função
     * @since v6.1.0
     */
    invalidFunction(type = "") {
        Ui.error(tr("ERRO-005: A função não é ", "ERROR-005: The function is not ") + type, "a < 0")
    },

    /**
     * [ERRO] Exibe um erro de logaritmo inválido
     * @param {string} type - Tipo de logaritmo (log, ln, etc.)
     * @param {string} reason - Motivo do erro
     * @since v6.1.0
     */
    invalidLog(type = "log", reason = "") {
        Ui.error(
            tr("ERRO-006: ", "ERROR-006: ") + type + tr(" inválido", " invalid"),
            reason != ""
                ? tr("Motivo: ", "Reason: ") + reason
                : tr(
                      "Tu tentaste calcular um logaritmo com base menor ou igual a 1, o que não é possível.",
                      "You tried to calculate a logarithm with a base less than or equal to 1, which is not possible."
                  )
        )
    },
}
