import { round } from "./algebra.js"
import { isFiniteNumber } from "./checks.js"
import { Config, DEFAULT_CONFIG, type ConfigKey } from "./config.js"
import { tr } from "./i18n.js"

function capitalize(text = ""): string {
    return lowercase(text).replaceAll(/\p{L}+/gv, word => uppercase(word[0] ?? "") + word.slice(1))
}

function configItem(message: string, name: ConfigKey): string {
    return tr("writing.currentDefault", { message, current: formatValue(Config[name]), default: formatValue(DEFAULT_CONFIG[name]) })
}

function decimalOptions(number?: Value, options?: Options & { invert?: false }): string
function decimalOptions(number: Value, options: Options & { invert: true }): number
function decimalOptions(number: Value = 0, { invert = false, shouldRound = true, places = Config.decimalPlaces }: Options & { invert?: boolean } = {}): Value {
    let result = String(number)

    if (invert) return replace(result, ",", ".")

    const num = Number(result)

    if (shouldRound && isFiniteNumber(num)) result = String(round(num, places))
    if (Config.decimalSeparator) result = replace(result, ".", ",")

    return result
}

const textCaseFormatters: Partial<Record<TextCase, (s: string) => string>> = { capitalized: capitalize, lowercase, uppercase }

function formatMessage(message = "", explanation = ""): string {
    if (explanation.trim() !== "" && Config.explanations) message += `\n\n${explanation}`
    if (Config.simpleMulti) message = simplifyMultiplication(message)
    if (!Config.unicode) message = noUnicode(message)
    if (!Config.accents) message = noAccents(message)

    return textCaseFormatters[Config.textCase]?.(message) ?? message
}

function formatValue(value: Value | boolean = true): string {
    return typeof value === "boolean" ? tr(value ? "writing.yes" : "writing.no") : String(value)
}

function lowercase(text = ""): string {
    return replace(text.toLowerCase(), "δ", "Δ")
}

function noAccents(text = ""): string {
    return text.normalize("NFD").replaceAll(/\p{M}/gv, "")
}

const localizedReplacementsCache = new Map<Language, [string, string][]>(),
    STATIC_REPLACEMENTS: readonly (readonly [string, string])[] = Object.freeze([
        ["©", "(c)"],
        ["«", "<"],
        ["±", "+/-"],
        ["²", "^2"],
        ["³", "^3"],
        ["·", "*"],
        ["»", ">"],
        ["×", "*"],
        ["÷", "/"],
        ["ƒ", "f"],
        ["ʸ", "y"],
        ["ˣ", "^x"],
        ["ᵇ", "b"],
        ["ᶜ", "c"],
        ["–", "-"],
        ["—", "-"],
        ["‘", "'"],
        ["’", "'"],
        ["“", '"'],
        ["”", '"'],
        ["•", "*"],
        ["…", "..."],
        ["⁄", "/"],
        ["⁺", "+"],
        ["⁻", "-"],
        ["⁼", "="],
        ["⁽", "^("],
        ["⁾", ")"],
        ["₁", "1"],
        ["₂", "2"],
        ["₃", "3"],
        ["₊", "+"],
        ["₋", "-"],
        ["₌", "="],
        ["₍", "_("],
        ["₎", ")"],
        ["ₐ", "_a"],
        ["ₑ", "_e"],
        ["ₒ", "_o"],
        ["ₓ", "_x"],
        ["←", "<-"],
        ["↑", "^"],
        ["→", "->"],
        ["↓", "v"],
        ["↔", "<->"],
        ["↕", "^v"],
        ["↖", "\\"],
        ["↗", "/"],
        ["↘", "\\"],
        ["↙", "/"],
        ["↳", "->"],
        ["⇐", "<="],
        ["⇑", "^^"],
        ["⇒", "=>"],
        ["⇓", "vv"],
        ["⇔", "<=>"],
        ["⇕", "^^vv"],
        ["⇖", "\\"],
        ["⇗", "//"],
        ["⇘", "\\"],
        ["⇙", "//"],
        ["−", "-"],
        ["∓", "-/+"],
        ["∖", "-"],
        ["≠", "!="],
        ["≤", "<="],
        ["≥", ">="],
        ["≪", "<<"],
        ["≫", ">>"],
    ])

function getLocalizedReplacements(): [string, string][] {
    const cached = localizedReplacementsCache.get(Config.language)
    if (cached) return cached

    const computed: [string, string][] = [
        ["-∞", tr("symbols.negativeInfinity")],
        ["¬", tr("symbols.notWord")],
        ["Δ", tr("symbols.delta")],
        ["α", tr("symbols.alpha")],
        ["β", tr("symbols.beta")],
        ["γ", tr("symbols.gamma")],
        ["ε", tr("symbols.epsilon")],
        ["ζ", tr("symbols.zeta")],
        ["η", tr("symbols.eta")],
        ["θ", tr("symbols.theta")],
        ["κ", tr("symbols.kappa")],
        ["λ", tr("symbols.lambda")],
        ["μ", tr("symbols.mu")],
        ["ν", tr("symbols.nu")],
        ["ξ", tr("symbols.xi")],
        ["π", tr("symbols.pi")],
        ["ρ", tr("symbols.rho")],
        ["σ", tr("symbols.sigma")],
        ["τ", tr("symbols.tau")],
        ["φ", tr("symbols.phi")],
        ["χ", tr("symbols.chi")],
        ["ψ", tr("symbols.psi")],
        ["ω", tr("symbols.omega")],
        ["ℂ", tr("symbols.complexes")],
        ["ℕ", tr("symbols.naturals")],
        ["ℚ", tr("symbols.rationals")],
        ["ℝ", tr("symbols.reals")],
        ["ℤ", tr("symbols.integers")],
        ["ℯ", tr("symbols.eNumber")],
        ["∀", tr("symbols.forAll")],
        ["∂", tr("symbols.partialDerivative")],
        ["∃!", tr("symbols.existsUniqueOne")],
        ["∃∞", tr("symbols.existsInfinite")],
        ["∃", tr("symbols.exists")],
        ["∄!", tr("symbols.notExistsUniqueOne")],
        ["∄∞", tr("symbols.notExistsInfinite")],
        ["∄", tr("symbols.notExists")],
        ["∅", tr("symbols.emptySet")],
        ["∇", tr("symbols.nabla")],
        ["∈", tr("symbols.belongsTo")],
        ["∉", tr("symbols.notBelongsTo")],
        ["∋", tr("symbols.containsAsElement")],
        ["∌", tr("symbols.notContainsAsElement")],
        ["∏", tr("symbols.product")],
        ["∑", tr("symbols.sum")],
        ["√", tr("symbols.squareRootOf")],
        ["∛", tr("symbols.cubeRootOf")],
        ["∜", tr("symbols.fourthRootOf")],
        ["∝", tr("symbols.proportionalTo")],
        ["∞", tr("symbols.infinity")],
        ["∠", tr("symbols.angle")],
        ["∧", tr("symbols.and")],
        ["∨", tr("symbols.or")],
        ["∩", tr("symbols.intersection")],
        ["∪", tr("symbols.union")],
        ["∫", tr("symbols.integral")],
        ["∬", tr("symbols.doubleIntegral")],
        ["∭", tr("symbols.tripleIntegral")],
        ["∮", tr("symbols.lineIntegral")],
        ["∯", tr("symbols.surfaceIntegral")],
        ["∰", tr("symbols.volumeIntegral")],
        ["∴", tr("symbols.therefore")],
        ["∵", tr("symbols.because")],
        ["∼", tr("symbols.similarTo")],
        ["≅", tr("symbols.congruentTo")],
        ["≈", tr("symbols.approximatelyEqualTo")],
        ["≡", tr("symbols.identicalTo")],
        ["⊆", tr("symbols.subsetOf")],
        ["⊇", tr("symbols.supersetOf")],
        ["⊈", tr("symbols.notSubsetOf")],
        ["⊉", tr("symbols.notSupersetOf")],
        ["⊕", tr("symbols.exclusiveOr")],
        ["⊗", tr("symbols.inclusiveOr")],
    ]
    localizedReplacementsCache.set(Config.language, computed)
    return computed
}

function noUnicode(text = ""): string {
    return replaceGroup(text, [...getLocalizedReplacements(), ...STATIC_REPLACEMENTS])
}

function replace(text = "", from = "", to = ""): string {
    return text.replaceAll(from, () => to)
}

function replaceGroup(text = "", list: readonly (readonly [string, string])[] = [["", ""]]): string {
    return list.reduce((acc, [from, to]) => replace(acc, from, to), text)
}

function simplifyMultiplication(text = ""): string {
    return replace(text, " · ", "")
}

function subscript(value: Value = ""): string {
    return Config.unicode
        ? replaceGroup(String(value), [
              ["-", "₋"],
              [".", "․"],
              ["0", "₀"],
              ["1", "₁"],
              ["2", "₂"],
              ["3", "₃"],
              ["4", "₄"],
              ["5", "₅"],
              ["6", "₆"],
              ["7", "₇"],
              ["8", "₈"],
              ["9", "₉"],
          ])
        : `_${value}`
}

// TODO - Não é usado ainda, mas, é útil para quando se for criar exponenciais
function _superscript(value: Value = ""): string {
    return Config.unicode
        ? replaceGroup(String(value), [
              ["-", "⁻"],
              [".", "․"],
              ["0", "⁰"],
              ["1", "¹"],
              ["2", "²"],
              ["3", "³"],
              ["4", "⁴"],
              ["5", "⁵"],
              ["6", "⁶"],
              ["7", "⁷"],
              ["8", "⁸"],
              ["9", "⁹"],
          ])
        : `^${value}`
}

function uppercase(text = ""): string {
    return replace(text.toUpperCase(), "Ƒ", "ƒ")
}

export { configItem, decimalOptions, formatMessage, lowercase, noAccents, subscript, uppercase }
