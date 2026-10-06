import { isFiniteNumber } from "../Core/checks.js"
import { Config } from "../Core/config.js"
import { INPUT_FAILED } from "../Core/consts.js"
import { tr } from "../Lang/i18n.js"
import { decimalOptions, formatMessage } from "../Lang/writing.js"
import { round } from "../Math/numeric.js"
function _notify(message = "", explanation = "", asConfirm = false) {
    return asConfirm ? confirm(formatMessage(message, `${explanation}\n\n${tr("ui.confirm")}`)) : alert(formatMessage(message, explanation))
}
export function notify(message = "", { explanation = "", type = "display", asConfirm = false } = {}) {
    if (type === "display") return _notify(message, explanation)
    if (type === "confirm") return _notify(message, explanation, true)
    if (type === "error") return Config.showErrors === "on" ? _notify(`=== ${tr("ui.error")} ===\n${message}`, explanation) : undefined
    if (type === "warning") return _notify(`=== ${tr("ui.warning")} ===\n${message}`, explanation, asConfirm)
    console.warn(message, explanation)
    return undefined
}
export function input(message = "", { explanation = "", type = "string", places = Config.decimalPlaces, placeholder = "" } = {}) {
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
