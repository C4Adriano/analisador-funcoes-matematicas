import { tr } from "./i18n.js"
import { Ui } from "./ui.js"
export class Errors {
    static range = (min = 0, max = 1) =>
        Ui.notifyOptions(
            `${tr("errors.error001", { firstValue: min + (min == 0 ? 1 : 0), max })} ${min == 0 ? tr("errors.zeroToBack") : ""}`,
            { explanation: tr("errors.error001Exp"), type: "error" }
        )
    static divZero = (reason = "") =>
        Ui.notifyOptions(tr("errors.error002"), {
            explanation: reason == "" ? tr("errors.zeroDivision") : tr("errors.reason", { reason }),
            type: "error",
        })
    static limitExceeded = () =>
        Ui.notifyOptions(tr("errors.error003"), { explanation: tr("errors.iterationsExceeded"), type: "error" })
    static constantFunction = (type = "") =>
        Ui.notifyOptions(tr("errors.error004", { type }), { explanation: "(a = 0) ∨ (a = 1) ∨ (b = 0)", type: "error" })
    static invalidFunction = (type = "") =>
        Ui.notifyOptions(tr("errors.error005", { type }), { explanation: "a < 0", type: "error" })
    static invalidLog = (type = "log", reason = "") =>
        Ui.notifyOptions(tr("errors.error006", { type }), {
            explanation: reason == "" ? tr("errors.error006Exp") : tr("errors.reason", { reason }),
            type: "error",
        })
}
