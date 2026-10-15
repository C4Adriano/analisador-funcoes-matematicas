import { isFiniteNumber } from "../Core/checks.js"
import { Config } from "../Core/config.js"
import { INPUT_FAILED } from "../Core/consts.js"
import { tr } from "../Lang/i18n.js"
import { decimalOptions, formatMessage } from "../Lang/writing.js"
import { round } from "../Math/numeric.js"

function _notify(message = "", explanation = "", asConfirm = false): boolean | null {
    return asConfirm ? confirm(formatMessage(message, `${explanation}\n\n${tr("ui.confirm")}`)) : (alert(formatMessage(message, explanation)) as unknown as null)
}

export function notify(message: string, option: MessageOptions & { type: "warning"; asConfirm?: false }): void
export function notify(message: string, option: (MessageOptions & { type: "warning"; asConfirm: true }) | (MessageOptions & { type: "confirm"; asConfirm?: never })): boolean
export function notify(message?: string, option?: MessageOptions & { type?: "display" | "error" | "console"; asConfirm?: never }): void
export function notify(message: string, option?: MessageOptions): boolean | null
export function notify(message = "", { explanation = "", type = "display", asConfirm = false }: { explanation?: string; type?: MessageType; asConfirm?: boolean } = {}): boolean | null {
    if (type === "display") return _notify(message, explanation)
    if (type === "confirm") return _notify(message, explanation, true)
    if (type === "error") return Config.showErrors === "on" ? _notify(`=== ${tr("ui.error")} ===\n${message}`, explanation) : null
    if (type === "warning") return _notify(`=== ${tr("ui.warning")} ===\n${message}`, explanation, asConfirm)

    console.warn(message, explanation)
    return null
}

export function input(message: string, options?: InputOptions & { type?: "string" }): string
export function input(message: string, options?: InputOptions & { type: "number" }): number
export function input(message = "", { explanation = "", type = "string", places = Config.decimalPlaces, placeholder = "" }: InputOptions = {}): Value | typeof INPUT_FAILED {
    let limit = 0

    do {
        const raw = prompt(formatMessage(message, explanation), placeholder)
        if (raw == null) continue

        const text = raw.trim()
        if (text === "") continue

        if (type === "number" && !isFiniteNumber(decimalOptions(text, { type: "number" }))) continue

        if (Config.inputConfirm === "on" && !notify(tr("ui.inputConfirm", { input: type === "number" ? decimalOptions(text, { type: "number" }) : text }), { asConfirm: true, explanation: tr("ui.inputConfirmNote"), type: "warning" })) continue

        return type === "number" ? round(Number(decimalOptions(text, { type: "number" })), places) : text
    } while (limit++ < Config.iterationLimit)

    return INPUT_FAILED
}
