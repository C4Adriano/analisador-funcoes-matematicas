import { isFiniteNumber, isInInterval } from "../Core/checks.js"
import { Config } from "../Core/config.js"
import { INPUT_FAILED } from "../Core/consts.js"
import { State } from "../Core/state.js"
import { tr } from "../Lang/i18n.js"
import { decimalOptions, formatMessage, subscript } from "../Lang/writing.js"
import { round } from "../Math/numeric.js"
import { isValidCommand, processCmd } from "./commands.js"
import { input, notify } from "./display.js"

function buildConstantFunction({ c = State.current.c }: NamedCoefficientsFor<"c"> = {}): string {
    return tr("ui.theFunction") + String(c) + tr("ui.constant") + (c === 0 ? tr("ui.constantNull") : "")
}

function buildAffineFunction({ b = State.current.b, c = State.current.c }: NamedCoefficientsFor<"b" | "c"> = {}): string {
    return tr("ui.theFunction") + formatLeadingTerm(b, "b", "x") + formatConstantTerm(c) + tr("ui.affine") + (c === 0 ? tr(b === 1 ? "ui.affineIdentity" : b === -1 ? "ui.affineOpposite" : "ui.affineLinear") + tr("ui.pure") : "")
}

function buildQuadraticFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}): string {
    return tr("ui.theFunction") + formatLeadingTerm(a, "a", "x²") + formatMiddleTerm(b, "b", "x") + formatConstantTerm(c) + tr("ui.quadratic") + (b === 0 ? tr(c === 0 ? "ui.pure" : "ui.quadraticIncompleteLinear") : c === 0 ? tr("ui.quadraticIncompleteConstant") : "")
}

function buildExponentialFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}): string {
    return tr("ui.theFunction") + formatMultiplier(b) + (a === "a" ? "aˣ" : a === 0 ? "" : `${a}ˣ`) + formatConstantTerm(c) + tr("ui.exponential") + (a === round(Math.E) ? tr("ui.natural") : "") + (b === 1 && c === 0 ? tr("ui.pure") : "")
}

function buildLogarithmicFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}): string {
    return tr("ui.theFunction") + formatMultiplier(b) + (a === "a" ? "logₐ(x)" : a === 0 ? "" : `log${subscript(a)}(x)`) + formatConstantTerm(c) + tr("ui.logarithmic") + (a === round(Math.E) ? tr("ui.natural") : a === 10 ? tr("ui.decimal") : "") + (b === 1 && c === 0 ? tr("ui.pure") : "")
}

function buildTrigFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}, funcType: TrigonometricFunction = ""): string {
    return tr("ui.theFunction") + formatMultiplier(b) + (a === "a" ? `${funcType}(a · x)` : a === 0 ? "" : `${funcType}(${a} · x)`) + formatConstantTerm(c)
}

function formatCoefficient<S extends Variable>(coef: NamedCoefficient<NoInfer<S>>, symbol: S, hasTerm = true): { hidden: boolean; text: string; negative: boolean } {
    if (coef === symbol) return { hidden: false, text: symbol, negative: false }

    const n = Number(coef),
        abs = Math.abs(n)

    if (abs === 0 && !(Config.showTrivialFactors === "zero" || Config.showTrivialFactors === "on")) return { hidden: true, text: "", negative: false }

    return { hidden: false, text: abs === 1 && hasTerm && !(Config.showTrivialFactors === "one" || Config.showTrivialFactors === "on") ? "" : String(abs), negative: n < 0 }
}

function formatConstantTerm(coef: NamedCoefficient<"c">): string {
    const { hidden, text, negative } = formatCoefficient(coef, "c", false)
    if (hidden) return ""
    return negative ? ` − ${text}` : ` + ${text}`
}

function formatLeadingTerm<S extends Variable>(coef: NamedCoefficient<NoInfer<S>>, symbol: S, term: string): string {
    const { hidden, text, negative } = formatCoefficient(coef, symbol)
    if (hidden) return ""
    if (text === symbol) return `${symbol} · ${term}`
    const sign = negative ? "−" : ""
    return text === "" ? `${sign}${term}` : `${sign}${text} · ${term}`
}

function formatMiddleTerm<S extends Variable>(coef: NamedCoefficient<NoInfer<S>>, symbol: S, term: string): string {
    const { hidden, text, negative } = formatCoefficient(coef, symbol)
    if (hidden) return ""
    if (text === symbol) return ` + ${symbol} · ${term}`
    const sign = negative ? " − " : " + "
    return text === "" ? `${sign}${term}` : `${sign}${text} · ${term}`
}

function formatMultiplier(coef: NamedCoefficient<"b">): string {
    const { hidden, text, negative } = formatCoefficient(coef, "b")
    if (hidden) return ""
    if (text === "b") return "b × "
    if (text === "") return negative ? "−" : ""
    return `${negative ? "−" : ""}${text} × `
}

export function inputCommands(message: string, options: InputOptions & { type: "number" }): number | CommandNames
export function inputCommands(message: string, options: InputOptions & { isCoefs: true }): MathValue | CommandNames
export function inputCommands(message: string, options?: InputOptions): CommandNames
export function inputCommands(message = "", { explanation = "", type = "string", places = Config.decimalPlaces, placeholder = "" }: InputOptions = {}): MathValue | CommandNames | typeof INPUT_FAILED {
    let limit = 0

    do {
        const raw = prompt(formatMessage(message, explanation), placeholder)
        if (raw == null) continue

        const text = raw.trim()
        if (text === "") continue

        if (text.startsWith("/")) {
            const action = processCmd(text)
            if (action == null) continue
            return action
        }

        if (type === "number" && !isFiniteNumber(decimalOptions(text, { type: "number" }))) continue

        if (Config.inputConfirm === "on" && !notify(tr("ui.inputConfirm", { input: type === "number" ? decimalOptions(text) : text }), { explanation: tr("ui.inputConfirmNote"), type: "warning", asConfirm: true })) continue

        return type === "number" ? round(Number(decimalOptions(text, { type: "number" })), places) : (text as CommandNames)
    } while (limit++ < Config.iterationLimit)

    return INPUT_FAILED
}

export function rangeOptions(message: string, options?: RangeOptions & { commands?: false }): number
export function rangeOptions(message: string, options?: RangeOptions): number | CommandNames
export function rangeOptions(message = "", { explanation = "", min = 0, max = 1, places = 0, commands = false }: RangeOptions = {}): number | CommandNames {
    let value: number | CommandNames

    if (max < min) [max, min] = [min, max]

    do {
        value = commands ? inputCommands(message, { placeholder: String(min), type: "number", places, explanation }) : input(message, { placeholder: String(min), type: "number", places, explanation })

        if (isValidCommand(value)) return value
        if (isFiniteNumber(value) && !isInInterval(value, [min, max])) notify(`${tr("errors.error001", { firstValue: min + (min === 0 ? 1 : 0), max })} ${min === 0 ? tr("errors.zeroToBack") : ""}`, { explanation: tr("errors.error001Exp"), type: "error" })
    } while (isFiniteNumber(value) && !isInInterval(value, [min, max]))

    return value
}

export function resolveFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: Partial<NamedCoefficients> = {}, funcType: FunctionType = "poly", show = true): void {
    if (!show || Config.showFunction === "off") return
    if (Config.showFunction === "changed" && !State.funcChanged) return
    const coefs: NamedCoefficients = { a, b, c }

    notify(
        `=== ${tr("ui.currentFunction")} ===\n${
            funcType === "poly"
                ? coefs.a === 0 && coefs.b === 0
                    ? buildConstantFunction(coefs)
                    : coefs.a === 0
                      ? buildAffineFunction(coefs)
                      : buildQuadraticFunction(coefs)
                : funcType === "exp"
                  ? buildExponentialFunction(coefs)
                  : funcType === "log"
                    ? buildLogarithmicFunction(coefs)
                    : buildTrigFunction(coefs, funcType)
        }`,
    )
}
