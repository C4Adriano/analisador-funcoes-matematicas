import { isInInterval, isReal } from "../Base/checks.js"
import { Config } from "../Base/config.js"
import { INPUT_FAILED } from "../Base/consts.js"
import { abs, add, round } from "../Base/numeric.js"
import { E, isZero, num, ONE, toInteger, toPlaces, toReal, ZERO } from "../Base/quantity.js"
import { tr } from "../Lang/i18n.js"
import { decimalOptions, subscript } from "../Lang/writing.js"
import { State } from "../Math/state.js"
import { isValidCommand, processCommand } from "./commands.js"
import { input, isInputAccepted, notify, readText } from "./display.js"

function buildConstantFunction({ c = State.current.c }: NamedCoefficientsFor<"c"> = {}): string {
    return tr("ui.theFunction") + String(c) + tr("ui.constant") + (c === ZERO ? tr("ui.constantNull") : "")
}

function buildAffineFunction({ b = State.current.b, c = State.current.c }: NamedCoefficientsFor<"b" | "c"> = {}): string {
    return tr("ui.theFunction") + formatLeadingTerm(b, "b", "x") + formatConstantTerm(c) + tr("ui.affine") + (c === ZERO ? tr(b === ONE ? "ui.affineIdentity" : b === num(-1) ? "ui.affineOpposite" : "ui.affineLinear") + tr("ui.pure") : "")
}

function buildQuadraticFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}): string {
    return tr("ui.theFunction") + formatLeadingTerm(a, "a", "x²") + formatMiddleTerm(b, "b", "x") + formatConstantTerm(c) + tr("ui.quadratic") + (b === ZERO ? tr(c === ZERO ? "ui.pure" : "ui.quadraticIncompleteLinear") : c === ZERO ? tr("ui.quadraticIncompleteConstant") : "")
}

function buildExponentialFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}): string {
    return tr("ui.theFunction") + formatMultiplier(b) + (a === "a" ? "aˣ" : a === ZERO ? "" : `${a}ˣ`) + formatConstantTerm(c) + tr("ui.exponential") + (a === round(E) ? tr("ui.natural") : "") + (b === ONE && c === ZERO ? tr("ui.pure") : "")
}

function buildLogarithmicFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}): string {
    return tr("ui.theFunction") + formatMultiplier(b) + (a === "a" ? "logₐ(x)" : a === ZERO ? "" : `log${subscript(a)}(x)`) + formatConstantTerm(c) + tr("ui.logarithmic") + (a === round(E) ? tr("ui.natural") : a === num(10) ? tr("ui.decimal") : "") + (b === ONE && c === ZERO ? tr("ui.pure") : "")
}

function buildTrigFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: NamedCoefficientsFor<Variable> = {}, kind: TrigonometricFunction = ""): string {
    return tr("ui.theFunction") + formatMultiplier(b) + (a === "a" ? `${kind}(a · x)` : a === ZERO ? "" : `${kind}(${a} · x)`) + formatConstantTerm(c)
}

function formatCoefficient<S extends Variable>(coef: NamedCoefficient<NoInfer<S>>, symbol: S, hasTerm = true): { hidden: boolean; text: string; negative: boolean } {
    if (typeof coef === "string") return { hidden: false, text: symbol, negative: false }

    const n = num(coef),
        absValue = abs(n)

    if (n === ZERO && !(Config.showTrivialFactors === "zero" || Config.showTrivialFactors === "on")) return { hidden: true, text: "", negative: false }

    return { hidden: false, text: absValue === ONE && hasTerm && !(Config.showTrivialFactors === "one" || Config.showTrivialFactors === "on") ? "" : String(absValue), negative: n < 0 }
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

export function inputCommands(message: string, options: InputOptions & { type: "number" }): Promise<Real | CommandNames | typeof INPUT_FAILED>
export function inputCommands(message: string, options?: InputOptions & { type?: "string" }): Promise<string | typeof INPUT_FAILED>
export async function inputCommands(message = "", { explanation = "", type = "string", places = Config.decimalPlaces, placeholder = "" }: InputOptions = {}): Promise<string | Real | typeof INPUT_FAILED> {
    let limit = 0

    do {
        const text: string = await readText(message, { explanation, placeholder })
        if (text === "") continue

        if (text.startsWith("/")) {
            const action: CommandNames | null = await processCommand(text)
            if (action != null) return action
            continue
        }

        if (!(await isInputAccepted(text, type))) continue
        if (type === "string") return text

        const value: Real | null = round(toReal(decimalOptions(text, { type: "number" })), places)
        if (value != null) return value
    } while (limit++ < Config.iterationLimit)

    return INPUT_FAILED
}

export function rangeOptions(message: string, options?: RangeOptions & { commands?: false }): Promise<Real>
export function rangeOptions(message: string, options?: RangeOptions): Promise<Real | CommandNames>
export async function rangeOptions(message = "", { explanation = "", min = toInteger(0), max = toInteger(1), places = toPlaces(0)!, commands = false }: RangeOptions = {}): Promise<Real | CommandNames> {
    let value: Real | CommandNames | typeof INPUT_FAILED

    if (max < min) [max, min] = [min, max]

    do {
        value = commands ? await inputCommands(message, { placeholder: String(min), type: "number", places, explanation }) : await input(message, { placeholder: String(min), type: "number", places, explanation })

        if (isValidCommand(value)) return value
        if (isReal(value) && !isInInterval(value, [min, max])) await notify(`${tr("errors.error001", { firstValue: add(min, isZero(min) ? ONE : ZERO), max })} ${isZero(min) ? tr("errors.zeroToBack") : ""}`, { explanation: tr("errors.error001Exp"), type: "error" })
    } while (isReal(value) && !isInInterval(value, [min, max]))

    return value === INPUT_FAILED ? num(0) : value
}

export async function resolveFunction({ a = State.current.a, b = State.current.b, c = State.current.c }: Partial<NamedCoefficients> = {}, kind: FunctionType = "poly", shouldShow = true): Promise<void> {
    if (!shouldShow || Config.showFunction === "off") return
    if (Config.showFunction === "changed" && !State.funcChanged) return
    const coefs: NamedCoefficients = { a, b, c }

    await notify(
        `=== ${tr("ui.currentFunction")} ===\n${
            kind === "poly"
                ? coefs.a === ZERO && coefs.b === ZERO
                    ? buildConstantFunction(coefs)
                    : coefs.a === ZERO
                      ? buildAffineFunction(coefs)
                      : buildQuadraticFunction(coefs)
                : kind === "exp"
                  ? buildExponentialFunction(coefs)
                  : kind === "log"
                    ? buildLogarithmicFunction(coefs)
                    : buildTrigFunction(coefs, kind)
        }`,
    )
}
