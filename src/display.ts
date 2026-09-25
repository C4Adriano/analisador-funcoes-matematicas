import { round } from "./algebra.js"
import { isFiniteNumber } from "./checks.js"
import { Config } from "./config.js"
import { INPUT_FAILED } from "./consts.js"
import { tr } from "./i18n.js"
import { decimalOptions, formatMessage } from "./writing.js"

function _notify(message = "", explanation = "", asConfirm = false): boolean | undefined {
    return asConfirm ? confirm(formatMessage(message, `${explanation}\n\n${tr("ui.confirm")}`)) : (alert(formatMessage(message, explanation)) as undefined)
}

function notify(message: string, option: MessageOptions & { type: "warning"; asConfirm?: false }): void
function notify(message: string, option: (MessageOptions & { type: "warning"; asConfirm: true }) | (MessageOptions & { type: "confirm"; asConfirm?: never })): boolean
function notify(message?: string, option?: MessageOptions & { type?: "display" | "error" | "console"; asConfirm?: never }): void
function notify(message: string, option?: MessageOptions): boolean | undefined
function notify(message = "", { explanation = "", type = "display", asConfirm = false }: { explanation?: string; type?: TypeMessage; asConfirm?: boolean } = {}): boolean | undefined {
    switch (type) {
        case "display":
            return _notify(message, explanation)
        case "confirm":
            return _notify(message, explanation, true)
        case "error":
            return Config.errors ? _notify(`=== ${tr("ui.error")} ===\n${message}`, explanation) : undefined
        case "warning":
            return _notify(`=== ${tr("ui.warning")} ===\n${message}`, explanation, asConfirm)
        case "console":
            console.warn(message, explanation)
            return undefined
        default:
            console.warn(message, explanation)
            return undefined
    }
}

function input(message: string, options?: InputOptions & { number: true }): number
function input(message: string, options?: InputOptions): string
function input(message = "", { explanation = "", number = false, places = Config.decimalPlaces, placeholder = "" }: InputOptions = {}): Value | typeof INPUT_FAILED {
    let limit = 0

    do {
        limit++
        const raw = prompt(formatMessage(message, explanation), placeholder)
        if (raw == null) continue

        const text = raw.trim()
        if (text === "") continue

        if (number && !isFiniteNumber(decimalOptions(text, { invert: true }))) continue

        if (Config.inputConfirm && !notify(tr("ui.inputConfirm", { input: number ? decimalOptions(raw) : text }), { explanation: tr("ui.inputConfirmNote"), type: "warning", asConfirm: true })) continue

        return number ? round(Number(raw), places) : text
    } while (limit < Config.iterationLimit)

    return INPUT_FAILED
}

export { input, notify }
