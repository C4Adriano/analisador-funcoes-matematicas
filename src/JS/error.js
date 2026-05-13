import { Ui } from "./ui.js"
import { Phrases } from "./phrases.js"

/**
 * @status Funcionando
 * [ 100% ] Phrases
 */

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
            Phrases.get(Phrases.Error.range.label) +
                String(min + (min == 0 ? 1 : 0)) +
                Phrases.get(Phrases.Error.range.and) +
                String(max) +
                (min == 0 ? Phrases.get(Phrases.Error.range.orBack) : ""),
            Phrases.get(Phrases.Error.range.detail)
        )
    },

    /**
     * [ERRO] Exibe um erro de divisão por zero
     * @param {string} reason - Motivo da divisão por zero
     * @since v6.1.0
     */
    divZero(reason = "") {
        Ui.error(
            Phrases.get(Phrases.Error.divZero.label),
            reason != ""
                ? Phrases.get(Phrases.Error.divZero.reason) + reason
                : Phrases.get(Phrases.Error.divZero.detail)
        )
    },

    /**
     * [ERRO] Exibe um erro de limite de interações estourado
     * @since v6.1.0
     */
    limitExceeded() {
        Ui.error(Phrases.get(Phrases.Error.limitExceeded.label), Phrases.get(Phrases.Error.limitExceeded.detail))
    },

    /**
     * [ERRO] Exibe um erro de função que se torna constante pelos coeficientes dados
     * @param {string} type - Tipo de função
     * @since v6.1.0
     */
    constantFunction(type = "") {
        Ui.error(
            Phrases.get(Phrases.Error.constantFunction.label.prefix) +
                type +
                Phrases.get(Phrases.Error.constantFunction.label.suffix),
            Phrases.get(Phrases.Error.constantFunction.detail)
        )
    },

    /**
     * [ERRO] Exibe um erro de função inválida pelos coeficientes dados
     * @param {string} type - Tipo de função
     * @since v6.1.0
     */
    invalidFunction(type = "") {
        Ui.error(
            Phrases.get(Phrases.Error.invalidFunction.label) + type,
            Phrases.get(Phrases.Error.invalidFunction.detail)
        )
    },

    /**
     * [ERRO] Exibe um erro de logaritmo inválido
     * @param {string} type - Tipo de logaritmo (log, ln, etc.)
     * @param {string} reason - Motivo do erro
     * @since v6.1.0
     */
    invalidLog(type = "log", reason = "") {
        Ui.error(
            Phrases.get(Phrases.Error.invalidLog.label) + type + Phrases.get(Phrases.Error.invalidLog.invalid),
            reason != ""
                ? Phrases.get(Phrases.Error.invalidLog.reason) + reason
                : Phrases.get(Phrases.Error.invalidLog.detail)
        )
    },
}
