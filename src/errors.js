import { tr } from "./i18n.js"
import { Ui } from "./ui.js"

export const Errors = {
    range: (min = 0, max = 1) =>
        Ui.notifyOptions(
            `${tr("errors.error001", { firstValue: min + (min == 0 ? 1 : 0), max })} ${min == 0 ? tr("errors.zeroToBack") : ""}`,
            { explanation: tr("errors.error001Exp"), type: "error" }
        ),

    divZero: (reason = "") =>
        Ui.notifyOptions(tr("errors.error002"), {
            explanation: reason != "" ? tr("errors.reason", { reason }) : tr("errors.zeroDivision"),
            type: "error",
        }),

    limitExceeded: () =>
        Ui.notifyOptions(tr("errors.error003"), { explanation: tr("errors.iterationsExceeded"), type: "error" }),

    constantFunction: (type = "") =>
        Ui.notifyOptions(tr("errors.error004", { type }), {
            explanation: "(a = 0) ∨ (a = 1) ∨ (b = 0)",
            type: "error",
        }),

    invalidFunction: (type = "") =>
        Ui.notifyOptions(tr("errors.error005", { type }), { explanation: "a < 0", type: "error" }),

    invalidLog: (type = "log", reason = "") =>
        Ui.notifyOptions(tr("errors.error006", { type }), {
            explanation: reason != "" ? tr("errors.reason", { reason }) : tr("errors.error006Exp"),
            type: "error",
        }),
}
