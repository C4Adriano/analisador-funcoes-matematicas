import { Algebra } from "./algebra.js"
import { Config, DEFAULT_CONFIG } from "./config.js"
import { tr } from "./i18n.js"
export class Writing {
    static replace = (text = "", from = "", to = "") => String(text).replaceAll(from, to)
    static replaceGroup = (text = "", list = [["", ""]]) =>
        list.reduce((acc, [from, to]) => (from != null && to != null ? Writing.replace(acc, from, to) : acc), text)
    static noUnicode = (text = "") => {
        const staticReplacements = [
            ["©", "(c)"],
            ["ƒ", "f"],
            ["₁", "1"],
            ["₂", "2"],
            ["₃", "3"],
            ["²", "^2"],
            ["³", "^3"],
            ["ˣ", "^x"],
            ["ₐ", "_a"],
            ["ₑ", "_e"],
            ["ₒ", "_o"],
            ["ₓ", "_x"],
            ["⁽", "^("],
            ["⁾", ")"],
            ["₍", "_("],
            ["₎", ")"],
            ["⁻", "-"],
            ["⁺", "+"],
            ["⁼", "="],
            ["ᶜ", "c"],
            ["ᵇ", "b"],
            ["ʸ", "y"],
            ["⁄", "/"],
            ["₌", "="],
            ["₋", "-"],
            ["₊", "+"],
            ["≠", "!="],
            ["≤", "<="],
            ["≥", ">="],
            ["≪", "<<"],
            ["≫", ">>"],
            ["·", "*"],
            ["×", "*"],
            ["±", "+/-"],
            ["∓", "-/+"],
            ["÷", "/"],
            ["∖", "-"],
            ["⇒", "=>"],
            ["⇐", "<="],
            ["⇑", "^^"],
            ["⇓", "vv"],
            ["⇔", "<=>"],
            ["⇕", "^^vv"],
            ["⇖", "\\"],
            ["⇗", "//"],
            ["⇘", "\\"],
            ["⇙", "//"],
            ["→", "->"],
            ["←", "<-"],
            ["↑", "^"],
            ["↓", "v"],
            ["↳", "->"],
            ["↔", "<->"],
            ["↕", "^v"],
            ["↖", "\\"],
            ["↗", "/"],
            ["↘", "\\"],
            ["↙", "/"],
            ["“", "'"],
            ["”", "'"],
            ["‘", "'"],
            ["’", "'"],
            ["«", "'"],
            ["»", "'"],
            ["…", "..."],
            ["—", "-"],
            ["–", "-"],
            ["−", "-"],
            ["•", "*"],
        ]
        const localizedReplacements = [
            ["Δ", tr("symbols.delta")],
            ["π", tr("symbols.pi")],
            ["ℯ", tr("symbols.eNumber")],
            ["φ", tr("symbols.phi")],
            ["θ", tr("symbols.theta")],
            ["λ", tr("symbols.lambda")],
            ["μ", tr("symbols.mu")],
            ["σ", tr("symbols.sigma")],
            ["ρ", tr("symbols.rho")],
            ["τ", tr("symbols.tau")],
            ["ε", tr("symbols.epsilon")],
            ["γ", tr("symbols.gamma")],
            ["η", tr("symbols.eta")],
            ["ζ", tr("symbols.zeta")],
            ["κ", tr("symbols.kappa")],
            ["ν", tr("symbols.nu")],
            ["ξ", tr("symbols.xi")],
            ["ω", tr("symbols.omega")],
            ["α", tr("symbols.alpha")],
            ["β", tr("symbols.beta")],
            ["χ", tr("symbols.chi")],
            ["ψ", tr("symbols.psi")],
            ["∑", tr("symbols.sum")],
            ["∏", tr("symbols.product")],
            ["∫", tr("symbols.integral")],
            ["∬", tr("symbols.doubleIntegral")],
            ["∭", tr("symbols.tripleIntegral")],
            ["∮", tr("symbols.lineIntegral")],
            ["∯", tr("symbols.surfaceIntegral")],
            ["∰", tr("symbols.volumeIntegral")],
            ["∂", tr("symbols.partialDerivative")],
            ["∇", tr("symbols.nabla")],
            ["ℝ", tr("symbols.reals")],
            ["ℤ", tr("symbols.integers")],
            ["ℕ", tr("symbols.naturals")],
            ["ℚ", tr("symbols.rationals")],
            ["ℂ", tr("symbols.complexes")],
            ["∅", tr("symbols.emptySet")],
            ["∪", tr("symbols.union")],
            ["∩", tr("symbols.intersection")],
            ["⊆", tr("symbols.subsetOf")],
            ["⊇", tr("symbols.supersetOf")],
            ["⊈", tr("symbols.notSubsetOf")],
            ["⊉", tr("symbols.notSupersetOf")],
            ["∃!", tr("symbols.existsUniqueOne")],
            ["∄!", tr("symbols.notExistsUniqueOne")],
            ["∃∞", tr("symbols.existsInfinite")],
            ["∄∞", tr("symbols.notExistsInfinite")],
            ["∀", tr("symbols.forAll")],
            ["∃", tr("symbols.exists")],
            ["∄", tr("symbols.notExists")],
            ["∈", tr("symbols.belongsTo")],
            ["∉", tr("symbols.notBelongsTo")],
            ["∋", tr("symbols.containsAsElement")],
            ["∌", tr("symbols.notContainsAsElement")],
            ["∝", tr("symbols.proportionalTo")],
            ["∠", tr("symbols.angle")],
            ["∼", tr("symbols.similarTo")],
            ["≅", tr("symbols.congruentTo")],
            ["≈", tr("symbols.approximatelyEqualTo")],
            ["≡", tr("symbols.identicalTo")],
            ["√", tr("symbols.squareRootOf")],
            ["∛", tr("symbols.cubeRootOf")],
            ["∜", tr("symbols.fourthRootOf")],
            ["-∞", tr("symbols.negativeInfinity")],
            ["∞", tr("symbols.infinity")],
            ["∴", tr("symbols.therefore")],
            ["∵", tr("symbols.because")],
            ["∨", tr("symbols.or")],
            ["∧", tr("symbols.and")],
            ["¬", tr("symbols.notWord")],
            ["⊕", tr("symbols.exclusiveOr")],
            ["⊗", tr("symbols.inclusiveOr")],
        ]
        return Writing.replaceGroup(text, [...localizedReplacements, ...staticReplacements])
    }
    static noAccents = (text = "") =>
        String(text)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
    static lowercase = (text = "") => Writing.replace(String(text).toLowerCase(), "δ", "Δ")
    static uppercase = (text = "") => Writing.replace(String(text).toUpperCase(), "Ƒ", "ƒ")
    static capitalize = (text = "") =>
        Writing.lowercase(text).replace(/\p{L}+/gu, word => Writing.uppercase(word[0]) + word.slice(1))
    static decimalOptions(number = 0, { invert = false, round = true, places = Config.decimalPlaces } = {}) {
        let result = String(number)
        if (invert) return Writing.replace(result, ",", ".")
        if (round) result = Algebra.round(result, places)
        if (Config.decimalSeparator) return Writing.replace(String(result), ".", ",")
        return result
    }
    static simplifyMultiplication = (text = "") => Writing.replace(text, " · ", "")
    static format = (message = "", explanation = "") => {
        if (Config.explanations && explanation != "") message += `\n\n${explanation}`
        if (Config.simpleMulti) message = Writing.simplifyMultiplication(message)
        if (!Config.unicode) message = Writing.noUnicode(message)
        if (!Config.accents) message = Writing.noAccents(message)
        if (Config.textCase == "capitalized") message = Writing.capitalize(message)
        else if (Config.textCase == "lowercase") message = Writing.lowercase(message)
        else if (Config.textCase == "uppercase") message = Writing.uppercase(message)
        return message
    }
    static superscript = (value = "") =>
        Config.unicode
            ? Writing.replaceGroup(String(value), [
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
                  ["-", "⁻"],
                  [".", "․"],
              ])
            : `^${value}`
    static subscript = (value = "") =>
        Config.unicode
            ? Writing.replaceGroup(String(value), [
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
                  ["-", "₋"],
                  [".", "․"],
              ])
            : `_${value}`
    static formatValue = (value = true) =>
        typeof value == "boolean" ? (value ? tr("writing.yes") : tr("writing.no")) : String(value)
    static configItem = (message = "", name) =>
        tr("writing.currentDefault", {
            message,
            current: Writing.formatValue(Config[name]),
            default: Writing.formatValue(DEFAULT_CONFIG[name]),
        })
}
