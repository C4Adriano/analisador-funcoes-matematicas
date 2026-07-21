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
     * @param min - Valor mínimo permitido
     * @param max - Valor máximo permitido
     * @since v6.1.0
     */
    range(min = 0, max = 1) {
        if (!isFinite(min) || !isFinite(max)) {
            Ui.error("[Error.range] Parâmetros inválidos.", `Min: ${min} | Max: ${max}`, true)
            min = 0
            max = 1
        }

        Ui.error(
            `${tr("error.error001", { firstValue: min + (min == 0 ? 1 : 0), max: max })} ${
                min == 0 ? tr("error.zeroToBack") : ""
            }`,
            tr("error.error001Exp")
        )
    },

    /**
     * [ERRO] Exibe um erro de divisão por zero
     * @param reason - Motivo da divisão por zero
     * @since v6.1.0
     */
    divZero(reason = "") {
        if (typeof reason !== "string") {
            Ui.error("[Error.divZero] 'reason' inválido.", `Recebido: ${reason}`, true)
            reason = ""
        }

        Ui.error(tr("error.error002"), reason != "" ? tr("error.reason", { reason: reason }) : tr("error.zeroDivision"))
    },

    /**
     * [ERRO] Exibe um erro de limite de iterações estourado
     * @since v6.1.0
     */
    limitExceeded() {
        Ui.error(tr("error.error003"), tr("error.iterationsExceeded"))
    },

    /**
     * [ERRO] Exibe um erro de função que se torna constante pelos coeficientes dados
     * @param type - Tipo de função
     * @since v6.1.0
     */
    constantFunction(type = "") {
        Ui.error(tr("error.error004", { type: type }), "(a = 0) ∨ (a = 1) ∨ (b = 0)")
    },

    /**
     * [ERRO] Exibe um erro de função inválida pelos coeficientes dados
     * @param type - Tipo de função
     * @since v6.1.0
     */
    invalidFunction(type = "") {
        if (typeof type != "string") {
            Ui.error("[Error.invalidFunction] 'type' inválido.", `Recebido: ${type}`, true)
            type = ""
        }

        Ui.error(tr("error.error005", { type: type }), "a < 0")
    },

    /**
     * [ERRO] Exibe um erro de logaritmo inválido
     * @param type - Tipo de logaritmo (log, ln, etc.)
     * @param reason - Motivo do erro
     * @since v6.1.0
     */
    invalidLog(type = "log", reason = "") {
        if (typeof type != "string") {
            Ui.error("[Error.invalidLog] 'type' inválido.", `Recebido: ${type}`, true)
            type = "log"
        }
        if (typeof reason != "string") {
            Ui.error("[Error.invalidLog] 'reason' inválido.", `Recebido: ${reason}`, true)
            reason = ""
        }

        Ui.error(
            tr("error.error006", { type: type }),
            reason != "" ? tr("error.reason", { reason: reason }) : tr("error.error006Exp")
        )
    },
}
