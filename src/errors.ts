import { tr } from "./i18n.js"
import { Ui } from "./ui.js"

/**
 * # Errors
 *
 * ## Funcionalidades:
 * Objeto base para os métodos envolvendo erros.
 *
 * ## Métodos:
 * - {@link Errors.constantFunction constantFunction} - Erro sobre a Função ser Constante, não o que foi pensado para ser.
 * - {@link Errors.divZero divZero} - Erro de divisão por zero (x/0).
 * - {@link Errors.invalidFunction invalidFunction} - Erro sobre a Função ser inválida.
 * - {@link Errors.invalidLog invalidLog} - Erro de log inválido.
 * - {@link Errors.limitExceeded limitExceeded} - Erro de limite excedido.
 * - {@link Errors.range range} - Erro de intervalo.
 *
 * ### Tags:
 * @license [License](../LICENSE.md)
 * @group Erro
 * @author [C4Adriano](https://github.com/C4Adriano)
 * @since v6.1.0
 */
export const Errors = {
    /**
     * Exibe um erro de valor fora do intervalo permitido.
     * @param min - Valor mínimo permitido.
     * @param max - Valor máximo permitido.
     * @group Erro
     * @since v6.1.0
     */
    range: (min: Numeric = 0, max: Numeric = 1): void => {
        Ui.notifyOptions(
            `${tr("errors.error001", { firstValue: min + (min == 0 ? 1 : 0), max })} ${min == 0 ? tr("errors.zeroToBack") : ""}`,
            { explanation: tr("errors.error001Exp"), type: "error" }
        )
    },

    /**
     * Exibe um erro de divisão por zero.
     * @param reason - Motivo da divisão por zero.
     * @group Erro
     * @since v6.1.0
     */
    divZero: (reason: Str = ""): void => {
        Ui.notifyOptions(tr("errors.error002"), {
            explanation: reason.trim() == "" ? tr("errors.zeroDivision") : tr("errors.reason", { reason }),
            type: "error",
        })
    },

    /**
     * Exibe um erro de limite de iterações estourado.
     * @group Erro
     * @since v6.1.0
     */
    limitExceeded: (): void => {
        Ui.notifyOptions(tr("errors.error003"), { explanation: tr("errors.iterationsExceeded"), type: "error" })
    },

    /**
     * Exibe um erro de Função que se torna constante pelos Coeficientes dados.
     * @param type - Tipo de Função.
     * @group Erro
     * @since v6.1.0
     */
    constantFunction: (type: Str = ""): void => {
        Ui.notifyOptions(tr("errors.error004", { type }), { explanation: "(a = 0) ∨ (a = 1) ∨ (b = 0)", type: "error" })
    },

    /**
     * Exibe um erro de Função inválida pelos Coeficientes dados.
     * @param type - Tipo de Função.
     * @group Erro
     * @since v6.1.0
     */
    invalidFunction: (type: Str = ""): void => {
        Ui.notifyOptions(tr("errors.error005", { type }), { explanation: "a < 0", type: "error" })
    },

    /**
     * Exibe um erro de logaritmo inválido.
     * @param type - Tipo de logaritmo `("log" | "ln")`.
     * @param reason - Motivo do erro!
     * @group Erro
     * @since v6.1.0
     */
    invalidLog: (type: "log" | "ln" = "log", reason: Str = ""): void => {
        Ui.notifyOptions(tr("errors.error006", { type }), {
            explanation: reason.trim() == "" ? tr("errors.error006Exp") : tr("errors.reason", { reason }),
            type: "error",
        })
    },
}
