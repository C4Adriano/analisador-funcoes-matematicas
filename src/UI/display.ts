import { isNumber } from "../Base/checks.js"
import { Config } from "../Base/config.js"
import { INPUT_FAILED } from "../Base/consts.js"
import { round } from "../Base/numeric.js"
import { changeLanguage, tr } from "../Lang/i18n.js"
import { decimalOptions, formatMessage } from "../Lang/writing.js"
import { showAlert, showConfirm, showPrompt } from "./io.js"

function withHeading(message: string, type: MessageType): string {
    if (type === "error") return `=== ${tr("ui.error")} ===\n${message}`
    return type === "warning" ? `=== ${tr("ui.warning")} ===\n${message}` : message
}

export async function notify(message = "", { explanation = "", type = "display" }: MessageOptions = {}): Promise<void> {
    if (type === "console") {
        console.warn(message, explanation)
        return
    }

    if (type === "error" && Config.showErrors !== "on") return

    await showAlert(formatMessage(withHeading(message, type), explanation))
}

export async function isActionConfirmed(message: string, { explanation = "", type = "display" }: { explanation?: string; type?: "display" | "warning" } = {}): Promise<boolean> {
    return showConfirm(formatMessage(withHeading(message, type), `${explanation}\n\n${tr("ui.confirm")}`))
}

export async function readText(message: string, { explanation = "", placeholder = "" }: Pick<InputOptions, "explanation" | "placeholder"> = {}): Promise<string> {
    const raw = await showPrompt(formatMessage(message, explanation), placeholder)
    return raw?.trim() ?? ""
}

export async function isInputAccepted(text: string, type: NonNullable<InputOptions["type"]> = "string"): Promise<boolean> {
    const value = type === "number" ? decimalOptions(text, { type: "number" }) : text

    if (type === "number" && !isNumber(Number(value))) return false
    return Config.inputConfirm === "on" ? isActionConfirmed(tr("ui.inputConfirm", { input: value }), { explanation: tr("ui.inputConfirmNote"), type: "warning" }) : true
}

export function input(message: string, options?: InputOptions & { type?: "string" }): Promise<string | typeof INPUT_FAILED>
export function input(message: string, options: InputOptions & { type: "number" }): Promise<number | typeof INPUT_FAILED>
export async function input(message = "", { explanation = "", type = "string", places = Config.decimalPlaces, placeholder = "" }: InputOptions = {}): Promise<string | number | typeof INPUT_FAILED> {
    let limit = 0

    do {
        const text: string = await readText(message, { explanation, placeholder })
        if (text === "" || !(await isInputAccepted(text, type))) continue
        if (type === "string") return text

        const value: number | null = round(Number(decimalOptions(text, { type: "number" })), places)
        if (isNumber(value)) return value
    } while (limit++ < Config.iterationLimit)

    return INPUT_FAILED
}

export async function confirmLanguageChange(language: Language = "pt-br"): Promise<"same" | "notChange" | "changed"> {
    if (Config.language === language) return "same"
    return (await isActionConfirmed(tr("i18n.confirmChangeLanguage", { language }))) ? changeLanguage(language) : "notChange"
}
