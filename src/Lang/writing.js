import { isFiniteNumber } from "../Core/checks.js";
import { Config, DEFAULT_CONFIG } from "../Core/config.js";
import { round } from "../Math/numeric.js";
import { tr } from "./i18n.js";
function capitalize(text = "") {
    return lowercase(text).replaceAll(/\p{L}+/gv, word => uppercase(word[0]) + word.slice(1));
}
function formatValue(value = true) {
    return typeof value === "boolean" ? tr(value ? "writing.yes" : "writing.no") : String(value);
}
export function configItem(message, name) {
    return tr("writing.currentDefault", { message, current: formatValue(Config[name]), default: formatValue(DEFAULT_CONFIG[name]) });
}
export function decimalOptions(number = 0, { type = "string", shouldRound = true, places = Config.decimalPlaces } = {}) {
    let result = String(number);
    if (type === "number")
        return replace(result, ",", ".");
    const num = Number(result);
    if (shouldRound && isFiniteNumber(num))
        result = String(round(num, places));
    if (Config.decimalSeparator === "comma")
        result = replace(result, ".", ",");
    return result;
}
const textCaseFormatters = { capitalized: capitalize, lowercase, uppercase };
export function formatMessage(message = "", explanation = "") {
    if (Config.showExplanations === "on" && explanation.trim() !== "")
        message += `\n\n${explanation}`;
    if (Config.implicitMulti === "on")
        message = simplifyMultiplication(message);
    if (Config.showUnicode === "off")
        message = noUnicode(message);
    if (Config.showAccents === "off")
        message = noAccents(message);
    return textCaseFormatters[Config.textCase]?.(message) ?? message;
}
export function lowercase(text = "") {
    return replace(text.toLowerCase(), "δ", "Δ");
}
export function noAccents(text = "") {
    return text.normalize("NFD").replaceAll(/\p{M}/gv, "");
}
const localizedReplacementsCache = new Map(), STATIC_REPLACEMENTS = Object.freeze([
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
]);
function getLocalizedReplacements() {
    const cached = localizedReplacementsCache.get(Config.language);
    if (cached != null)
        return cached;
    const computed = [
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
    localizedReplacementsCache.set(Config.language, computed);
    return computed;
}
function noUnicode(text = "") {
    return replaceGroup(text, [...getLocalizedReplacements(), ...STATIC_REPLACEMENTS]);
}
function replace(text = "", from = "", to = "") {
    return text.replaceAll(from, () => to);
}
function replaceGroup(text = "", list = [["", ""]]) {
    return list.reduce((acc, [from, to]) => replace(acc, from, to), text);
}
function simplifyMultiplication(text = "") {
    return replace(text, " · ", "");
}
export function subscript(value = "") {
    return Config.showUnicode === "on"
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
        : `_${value}`;
}
export function uppercase(text = "") {
    return replace(text.toUpperCase(), "Ƒ", "ƒ");
}
