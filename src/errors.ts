import { notify } from "./display.js"
import { tr } from "./i18n.js"

function errorConstantFunction(type = ""): void {
    notify(tr("errors.error004", { type }), { explanation: "(a = 0) ∨ (a = 1) ∨ (b = 0)", type: "error" })
}

function errorDivZero(reason = ""): void {
    notify(tr("errors.error002"), { explanation: reason.trim() === "" ? tr("errors.zeroDivision") : tr("errors.reason", { reason }), type: "error" })
}

function errorInvalidFunction(type = ""): void {
    notify(tr("errors.error005", { type }), { explanation: "a < 0", type: "error" })
}

function errorInvalidLog(type: "log" | "ln" = "log", reason = ""): void {
    notify(tr("errors.error006", { type }), { explanation: reason.trim() === "" ? tr("errors.error006Exp") : tr("errors.reason", { reason }), type: "error" })
}

function errorLimitExceeded(): void {
    notify(tr("errors.error003"), { explanation: tr("errors.iterationsExceeded"), type: "error" })
}

function errorRange(min = 0, max = 1): void {
    notify(`${tr("errors.error001", { firstValue: min + (min === 0 ? 1 : 0), max })} ${min === 0 ? tr("errors.zeroToBack") : ""}`, { explanation: tr("errors.error001Exp"), type: "error" })
}

export { errorConstantFunction, errorDivZero, errorInvalidFunction, errorInvalidLog, errorLimitExceeded, errorRange }
