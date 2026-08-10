import { tr } from "./i18n.js"
import { Ui } from "./ui.js"

export const Errors = {
    range(min = 0, max = 1) {
        if (!isFinite(min) || !isFinite(max)) {
            Ui.error("[Errors.range] Parâmetros inválidos.", `Min: ${min} | Max: ${max}`, true)
            min = 0
            max = 1
        }

        Ui.error(
            `${tr("errors.error001", { firstValue: min + (min == 0 ? 1 : 0), max: max })} ${
                min == 0 ? tr("errors.zeroToBack") : ""
            }`,
            tr("errors.error001Exp")
        )
    },

    divZero(reason = "") {
        if (typeof reason !== "string") {
            Ui.error("[Errors.divZero] 'reason' inválido.", `Recebido: ${reason}`, true)
            reason = ""
        }

        Ui.error(
            tr("errors.error002"),
            reason != "" ? tr("errors.reason", { reason: reason }) : tr("errors.zeroDivision")
        )
    },

    limitExceeded() {
        Ui.error(tr("errors.error003"), tr("errors.iterationsExceeded"))
    },

    constantFunction(type = "") {
        Ui.error(tr("errors.error004", { type: type }), "(a = 0) ∨ (a = 1) ∨ (b = 0)")
    },

    invalidFunction(type = "") {
        if (typeof type != "string") {
            Ui.error("[Errors.invalidFunction] 'type' inválido.", `Recebido: ${type}`, true)
            type = ""
        }

        Ui.error(tr("errors.error005", { type: type }), "a < 0")
    },

    invalidLog(type = "log", reason = "") {
        if (typeof type != "string") {
            Ui.error("[Errors.invalidLog] 'type' inválido.", `Recebido: ${type}`, true)
            type = "log"
        }
        if (typeof reason != "string") {
            Ui.error("[Errors.invalidLog] 'reason' inválido.", `Recebido: ${reason}`, true)
            reason = ""
        }

        Ui.error(
            tr("errors.error006", { type: type }),
            reason != "" ? tr("errors.reason", { reason: reason }) : tr("errors.error006Exp")
        )
    },
}
