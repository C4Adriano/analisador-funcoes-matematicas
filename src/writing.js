import { Algebra } from "./algebra.js";
import { Config, DEFAULT_CONFIG } from "./config.js";
import { tr } from "./i18n.js";
export class Writing {
    static replace = (text = "", from = "", to = "") => String(text).replaceAll(from, to);
    static replaceGroup = (text = "", list = [["", ""]]) => list.reduce((acc, [from, to]) => (from != null && to != null ? Writing.replace(acc, from, to) : acc), text);
    static noUnicode = (text = "") => {
        const staticReplacements = [
            ["©", "(c)"],
            ["«", "'"],
            ["±", "+/-"],
            ["²", "^2"],
            ["³", "^3"],
            ["·", "*"],
            ["»", "'"],
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
            ["“", "'"],
            ["”", "'"],
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
        ], localizedReplacements = [
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
        ];
        return Writing.replaceGroup(text, [...localizedReplacements, ...staticReplacements]);
    };
    static noAccents = (text = "") => String(text)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    static lowercase = (text = "") => Writing.replace(String(text).toLowerCase(), "δ", "Δ");
    static uppercase = (text = "") => Writing.replace(String(text).toUpperCase(), "Ƒ", "ƒ");
    static capitalize = (text = "") => Writing.lowercase(text).replace(/\p{L}+/gu, word => Writing.uppercase(word[0]) + word.slice(1));
    static decimalOptions(number = 0, { invert = false, round = true, places = Config.decimalPlaces } = {}) {
        let result = String(number);
        if (invert)
            return Writing.replace(result, ",", ".");
        if (round)
            result = Algebra.round(result, places);
        if (Config.decimalSeparator)
            return Writing.replace(String(result), ".", ",");
        return result;
    }
    static simplifyMultiplication = (text = "") => Writing.replace(text, " · ", "");
    static format = (message = "", explanation = "") => {
        if (Config.explanations && explanation !== "")
            message += `\n\n${explanation}`;
        if (Config.simpleMulti)
            message = Writing.simplifyMultiplication(message);
        if (!Config.unicode)
            message = Writing.noUnicode(message);
        if (!Config.accents)
            message = Writing.noAccents(message);
        if (Config.textCase === "capitalized")
            message = Writing.capitalize(message);
        else if (Config.textCase === "lowercase")
            message = Writing.lowercase(message);
        else if (Config.textCase === "uppercase")
            message = Writing.uppercase(message);
        return message;
    };
    static superscript = (value = "") => Config.unicode
        ? Writing.replaceGroup(String(value), [
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
        : `^${value}`;
    static subscript = (value = "") => Config.unicode
        ? Writing.replaceGroup(String(value), [
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
        : `_${value}`;
    static formatValue = (value = true) => typeof value == "boolean" ? (value ? tr("writing.yes") : tr("writing.no")) : String(value);
    static configItem = (message = "", name) => tr("writing.currentDefault", {
        message,
        current: Writing.formatValue(Config[name]),
        default: Writing.formatValue(DEFAULT_CONFIG[name]),
    });
}
