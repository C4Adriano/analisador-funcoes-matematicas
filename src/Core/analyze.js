import { Config } from "../Core/config.js";
import { tr } from "../Lang/i18n.js";
import { decimalOptions } from "../Lang/writing.js";
import { absoluteOptions, divisionOptions, lnOptions, logOptions, round } from "../Math/numeric.js";
import { isValidCommand } from "../UI/commands.js";
import { input, notify } from "../UI/display.js";
import { rangeOptions, resolveFunction } from "../UI/ui.js";
import { isFiniteNumber } from "./checks.js";
import { State } from "./state.js";
function domain(belongs = "∈ ℝ", explanation = tr("analyze.functionTakeX")) {
    notify(`${tr("analyze.domain")} x ${belongs}`, { explanation });
}
function range(belongs = "∈ ℝ", interval = "", explanation = tr("analyze.functionTakeY")) {
    notify(`${tr("analyze.range")} y ${belongs}`, { explanation: `${explanation} ${interval}` });
}
function xAxis(root = 0, explanation = "c", noHave = tr("analyze.noRoot")) {
    const intersection = tr("analyze.intersectionXAxis");
    if (root === 0)
        explanation === "0" ? notify(`${intersection} ∃∞ x ∈ ℝ`, { explanation: "y = 0 ⇒ ∀ x ∈ ℝ" }) : notify(`${intersection} ∄! x ∈ ℝ`, { explanation: "y = c ∧ c ≠ 0 ⇒ ∄ x" });
    else if (isFiniteNumber(root))
        notify(`${intersection} (${decimalOptions(root)}, 0)`, { explanation: `${tr("analyze.rootPoint")} (${explanation}, 0)` });
    else
        notify(`${intersection} ∄`, { explanation: noHave });
}
function yAxis(point = 0, func = "c", explanation = "c") {
    notify(`${tr("analyze.intersectionYAxis")} ${point === "∄" ? "∄" : `(0, ${decimalOptions(point)})`}`, { explanation: `${tr("analyze.sinceY")} ${func} ${point === "∄" ? explanation : `⇒ (0, ${explanation})`}` });
}
function resolveXValues({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}, funcType = "poly") {
    const x = input("x = ", { placeholder: "0", type: "number" }), message = `${tr("analyze.sinceX") + decimalOptions(x)}, y = `;
    if (funcType === "poly")
        notify(`${message}${decimalOptions(a * x ** 2 + b * x + c)}`, { explanation: `y = ${a === 0 ? "" : "a · x² + "}${b === 0 ? "" : "b · x + "}c` });
    else if (funcType === "exp")
        notify(`${message}${decimalOptions(b * a ** x + c)}`, { explanation: "y = b × aˣ + c" });
    else if (funcType === "log")
        x > 0 ? notify(`${message}${decimalOptions(b * logOptions(x, a) + c)}`, { explanation: "y = b × logₐ(x) + c" }) : notify(`${message} ∄! y ∈ ℝ`, { explanation: "x ≤ 0 ⇒ logₐ(x) ∉ ℝ" });
    else
        notify(`${message}${decimalOptions(b * (funcType === "sin" ? Math.sin(x) : funcType === "cos" ? Math.cos(x) : funcType === "tan" ? Math.tan(x) : 0) + c)}`, { explanation: `y = b × ${funcType}(x) + c` });
}
function resolveYValues({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}, funcType = "poly") {
    const y = input("y = ", { placeholder: "0", type: "number" }), message = `${tr("analyze.sinceY2") + decimalOptions(y)},`;
    if (funcType === "poly")
        if (a === 0 && b === 0)
            y === c ? notify(`${message} ∃∞ x ∈ ℝ`, { explanation: "y = c ⇒ ∀ x ∈ ℝ" }) : notify(`${message} ∄! x ∈ ℝ`, { explanation: "y ≠ c ⇒ ∄ x" });
        else if (a === 0 && b !== 0)
            notify(`${message} x = ${decimalOptions(divisionOptions(y - c, b))}`, { explanation: "x = (y − c) / b" });
        else {
            const [Δ, r1, r2] = calculateDelta({ a, b, c: c - y }), [x1, x2] = [decimalOptions(r1), decimalOptions(r2)];
            showDelta(Δ, `${message} ∄! x ∈ ℝ`, `${message} x = ${x1}`, `${message} x₁ = ${x1}, x₂ = ${x2}`, true);
        }
    else if (funcType === "exp" || funcType === "log") {
        const exponent = divisionOptions(y - c, b, { shouldRound: false });
        if (funcType === "exp")
            exponent > 0 ? notify(`${message} x = ${decimalOptions(divisionOptions(lnOptions(exponent), lnOptions(a)))}`, { explanation: "x = ln((y − c) / b) / ln(a)" }) : notify(`${message} ∄! x ∈ ℝ`, { explanation: "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ" });
        else
            notify(`${message} x = ${decimalOptions(a ** exponent)}`, { explanation: "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾" });
    }
    else
        notify(tr("analyze.notTrigonometric"), { explanation: tr("algebra.underConstruction") });
}
function resolveSign({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}, funcType = "poly") {
    const coefs = { a, b, c };
    if (funcType === "poly")
        coefs.a === 0 && coefs.b === 0 ? signConstant(coefs) : coefs.a === 0 ? signAffine(coefs) : signQuadratic(coefs);
    else if (funcType === "exp")
        signExponential(coefs);
    else if (funcType === "log")
        signLogarithmic(coefs);
    else
        signTrig();
}
function resolveEquations({ a1 = 0, b1 = 0, c1 = 0 } = {}, { a2 = 0, b2 = 0, c2 = 0 } = {}) {
    const [a, b, c] = [a1 - a2, b1 - b2, c1 - c2];
    if (a === 0 && b === 0)
        c === 0 ? notify(tr("algebra.constantCoincide"), { explanation: tr("algebra.constantCoincideExp") }) : notify(tr("algebra.constantDistinct"), { explanation: tr("algebra.constantDistinctExp") });
    else if (a === 0)
        notify(tr("algebra.oneRoot", { x: decimalOptions(divisionOptions(-c, b)) }), { explanation: "x = −c / b" });
    else {
        const [Δ, r1, r2] = calculateDelta({ a, b, c }), [x1, x2] = [decimalOptions(r1), decimalOptions(r2)];
        showDelta(Δ, tr("algebra.quadraticDistinct"), tr("algebra.oneRoot", { x: x1 }), tr("algebra.twoRoots", { x1, x2 }));
    }
}
function saveEquations({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}, funcType = "poly") {
    if (funcType !== "poly") {
        notify(tr("analyze.equationsNonPolynomial"), { explanation: tr("algebra.underConstruction"), type: "warning" });
        return "nonPoly";
    }
    if (State.firstFunction == null) {
        State.firstFunction = { a, b, c };
        State.askCoeffs = "on";
        State.loop = "on";
        notify(`ƒ₁(x) ${tr("analyze.saved")}`, { explanation: tr("analyze.typeSecondFunction"), type: "warning" });
        return "saved";
    }
    const { a: a1, b: b1, c: c1 } = State.firstFunction;
    resolveEquations({ a1, b1, c1 }, { a2: a, b2: b, c2: c });
    State.firstFunction = null;
    return "result";
}
function curve(a = 0, b = 0, polynomial = true) {
    if (!polynomial)
        (a < 1 && b < 0) || (a > 1 && b > 0) ? notify(tr("analyze.increasingUpper"), { explanation: "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" }) : notify(tr("analyze.decreasing"), { explanation: "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)" });
    else if (b !== 0)
        b > 0 ? notify(tr("analyze.increasingUpper"), { explanation: `${tr("analyze.pointsUpward")}b > 0` }) : notify(tr("analyze.decreasing"), { explanation: `${tr("analyze.pointsDownward")}b < 0` });
    else if (a !== 0)
        a > 0 ? notify(tr("analyze.upwardConcavity"), { explanation: "a > 0" }) : notify(tr("analyze.downwardConcavity"), { explanation: "a < 0" });
}
function calculateRoot({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}, funcType = "poly") {
    if (funcType === "poly")
        return a === 0 && b !== 0 ? divisionOptions(-c, b) : NaN;
    const exponent = divisionOptions(-c, b, { shouldRound: false });
    return funcType === "exp" && exponent > 0 ? divisionOptions(lnOptions(exponent), lnOptions(a)) : funcType === "log" ? round(a ** exponent) : NaN;
}
function showRoot(root = 0, explanation = "c", noHave = "") {
    const found = isFiniteNumber(root);
    notify(`${tr("analyze.realRoot")} ${found ? `x = ${decimalOptions(root)}` : "∄! x ∈ ℝ"}`, { explanation: found ? tr("analyze.theRootIs") + explanation : noHave });
}
function calculateDelta({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const bSquared = b ** 2, fourAC = 4 * a * c, difference = bSquared - fourAC, Δ = Math.abs(difference) <= 8 * Number.EPSILON * Math.max(bSquared, Math.abs(fourAC)) ? 0 : difference;
    if (Δ <= 0)
        return [Δ, Δ === 0 ? divisionOptions(-b, 2 * a) : NaN, NaN];
    const sqrtDelta = Math.sqrt(Δ), q = -0.5 * (b + (b >= 0 ? sqrtDelta : -sqrtDelta)), raw1 = divisionOptions(q, a), raw2 = divisionOptions(c, q);
    return [Δ, Math.min(raw1, raw2), Math.max(raw1, raw2)];
}
function showDelta(Δ = 0, lower = "", equal = "", higher = "", hasY = false) {
    const [message, suffix] = Δ < 0 ? [lower, "< 0 ⇒ x ∉ ℝ"] : Δ === 0 ? [equal, "= 0 ⇒ x = (−b) / (2 · a)"] : [higher, "> 0 ⇒ x₁, x₂ = (−b ± √Δ) / (2 · a)"];
    notify(message, { explanation: `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ ${suffix}` });
}
function vertex(a = 0, b = 0, Δ = 0) {
    return [divisionOptions(-b, 2 * a), divisionOptions(-Δ, 4 * a)];
}
function exceededLimit(limit = Config.iterationLimit) {
    if (limit < Config.iterationLimit)
        return false;
    notify(tr("errors.error003"), { explanation: tr("errors.iterationsExceeded"), type: "error" });
    return true;
}
function calcPeriod(a = 0, funcTan = false) {
    return decimalOptions((funcTan ? Math.PI : 2 * Math.PI) / absoluteOptions(a));
}
function showPeriod(a = 0, funcTan = false) {
    a === 0 ? notify(tr("analyze.periodInfinity"), { explanation: tr("analyze.constantPeriod") }) : notify(tr("analyze.period") + calcPeriod(a, funcTan), { explanation: `${tr("analyze.periodEquals") + (funcTan ? "π" : "2π")} / |a|` });
}
function amplitude(b = 0) {
    notify(`Amplitude: ${decimalOptions(absoluteOptions(b))}`, { explanation: "Amplitude = |b|" });
}
function verticalAsymptote(a = 0) {
    const label = tr("analyze.verticalAsymptote");
    a === 0 ? notify(`${label} ∄`, { explanation: tr("analyze.noAsymptote") }) : notify(`${label} x = (π / 2 + n · π) / a, n ∈ ℤ`, { explanation: `tan(a · x) ${tr("analyze.undefinedAsymptote")} cos(a · x) = 0, ${tr("analyze.ie")} a · x = π / 2 + n · π` });
}
function signTrig() {
    notify(tr("analyze.singNotTrigonometric"), { explanation: tr("algebra.underConstruction"), type: "warning" });
}
function signConstant({ c = State.current.numericC } = {}) {
    const sign = c === 0 ? "=" : c > 0 ? ">" : "<";
    notify(`ƒ(x) ${sign} 0, ∀ x ∈ ℝ`, { explanation: `c ${sign} 0 ⇒ ƒ(x) ${sign} 0 ⇒ ∀ x ∈ ℝ` });
}
function signAffine({ b = State.current.numericB, c = State.current.numericC } = {}) {
    const sign = b > 0 ? ">" : "<";
    notify(rootSigns(sign, String(calculateRoot({ b, c }))), { explanation: `b ${sign} 0 ⇒ ƒ(x) ${tr(b > 0 ? "analyze.increasing" : "analyze.decreasing")}` });
}
function rootSigns(sign, root) {
    return `ƒ(x) > 0 ${tr("analyze.if")} x ${sign} ${root}\nƒ(x) = 0 ${tr("analyze.in")} x = ${root}\nƒ(x) < 0 ${tr("analyze.if")} x ${sign === ">" ? "<" : ">"} ${root}`;
}
function signQuadratic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const sign = a > 0 ? ">" : "<", [Δ, r1, r2] = calculateDelta({ a, b, c }), [x1, x2] = [decimalOptions(r1), decimalOptions(r2)];
    if (Δ < 0)
        notify(`ƒ(x) ${sign} 0, ∀ x ∈ ℝ`, { explanation: `a ${sign} 0 ∧ Δ < 0 ⇒ ƒ(x) ${sign} 0, ∀ x ∈ ℝ` });
    else if (Δ === 0)
        notify(`ƒ(x) ${sign} 0, ${tr("analyze.exceptIn")} x = ${x1}`, { explanation: `a ${sign} 0 ∧ Δ = 0 ⇒ ƒ(x) ${sign} 0, x ≠ ${x1}` });
    else {
        const inside = `${x1} < x < ${x2}`, outside = `x < ${x1} ∨ x > ${x2}`, [positive, negative] = a < 0 ? [inside, outside] : [outside, inside];
        notify(`ƒ(x) > 0 ${tr("analyze.if")} ${positive}\nƒ(x) = 0 ${tr("analyze.in")} x = ${x1} ∨ x = ${x2}\nƒ(x) < 0 ${tr("analyze.if")} ${negative}`, { explanation: `a ${sign} 0 ∧ Δ > 0` });
    }
}
function signExponential({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    if (divisionOptions(-c, b, { shouldRound: false }) > 0) {
        const sign = (a < 1 && b < 0) || (a > 1 && b > 0) ? ">" : "<";
        notify(rootSigns(sign, decimalOptions(calculateRoot({ a, b, c }, "exp"))), { explanation: `${sign === ">" ? "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" : "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)"} ∧ (−c) / b > 0` });
    }
    else {
        const sign = b > 0 ? ">" : "<";
        notify(`ƒ(x) ${sign} 0, ∀ x ∈ ℝ`, { explanation: `${tr("analyze.accordingTo")} b ${sign} 0 ∧ (−c) / b ≤ 0` });
    }
}
function signLogarithmic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const sign = (a < 1 && b < 0) || (a > 1 && b > 0) ? ">" : "<";
    notify(rootSigns(sign, decimalOptions(calculateRoot({ a, b, c }, "log"))), { explanation: sign === ">" ? "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" : "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)" });
}
const BASE_OPTIONS = ["analyze.options.domain", "analyze.options.range", "analyze.options.xIntersection", "analyze.options.yIntersection", "analyze.options.xValues", "analyze.options.yValues", "analyze.options.signAnalysis", "analyze.options.functionEquations"];
export function resolveConstant({ c = State.current.numericC } = {}) {
    const coefs = { a: 0, b: 0, c };
    resolveFunction(coefs);
    runAnalysisMenu(coefs, "poly", [], {
        1: { 1: () => domain(), 2: () => range(`= ${decimalOptions(coefs.c)}`, "", tr("analyze.constantValue")), 3: () => xAxis(0, decimalOptions(coefs.c)), 4: () => yAxis(coefs.c, "c", "c"), 5: () => resolveXValues(coefs) },
        2: { 1: () => resolveYValues(coefs), 2: () => resolveSign(coefs), 3: () => saveEquations(coefs) },
    });
}
export function resolveAffine({ b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a: 0, b, c };
    resolveFunction(coefs);
    const root = calculateRoot(coefs);
    runAnalysisMenu(coefs, "poly", ["analyze.options.slope", "analyze.options.root"], {
        1: { 1: () => curve(0, coefs.b), 2: () => showRoot(root, "(−c) / b"), 3: () => domain(), 4: () => range(), 5: () => xAxis(root, "(−c) / b") },
        2: { 1: () => yAxis(coefs.c, "bx + c", "c"), 2: () => resolveXValues(coefs), 3: () => resolveYValues(coefs), 4: () => resolveSign(coefs), 5: () => saveEquations(coefs) },
    });
}
export function resolveQuadratic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c };
    resolveFunction(coefs);
    const [Δ, r1, r2] = calculateDelta(coefs), [x1, x2] = [decimalOptions(r1), decimalOptions(r2)], [xV, yV] = vertex(coefs.a, coefs.b, Δ).map(value => decimalOptions(value));
    runAnalysisMenu(coefs, "poly", ["analyze.options.concavity", "analyze.options.root", "analyze.options.vertex"], {
        1: {
            1: () => curve(coefs.a),
            2: () => showDelta(Δ, tr("analyze.noRoots"), tr("analyze.oneRoot", { x: x1 }), tr("analyze.twoRoots", { x1, x2 })),
            3: () => notify(tr("analyze.vertexPoint", { p1: xV, p2: yV }), { explanation: tr("analyze.vertexExp") }),
            4: () => domain(),
            5: () => (coefs.a > 0 ? range(`∈ [${yV}, ∞)`, tr("analyze.betweenVertexInfinity")) : range(`∈ (−∞, ${yV}]`, tr("analyze.betweenInfinityVertex"))),
        },
        2: {
            1: () => showDelta(Δ, tr("analyze.noIntersectionXAxis"), tr("analyze.oneIntersectionXAxis", { p: x1 }), tr("analyze.twoIntersectionsXAxis", { p1: x1, p2: x2 })),
            2: () => yAxis(coefs.c, "ax² + bx + c", "c"),
            3: () => resolveXValues(coefs),
            4: () => resolveYValues(coefs),
            5: () => resolveSign(coefs),
        },
        3: { 1: () => saveEquations(coefs) },
    });
}
export function resolveExponential({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c };
    resolveFunction(coefs, "exp");
    const root = calculateRoot(coefs, "exp");
    runAnalysisMenu(coefs, "exp", ["analyze.options.curve", "analyze.options.root", "analyze.options.horizontalAsymptote"], {
        1: {
            1: () => curve(coefs.a, coefs.b, false),
            2: () => showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"),
            3: () => notify(tr("analyze.options.horizontalAsymptote", { y: decimalOptions(coefs.c) }), { explanation: "y = c" }),
            4: () => domain(),
            5: () => {
                if (coefs.b > 0)
                    range(`∈ (${decimalOptions(coefs.c)}, ∞)`, tr("analyze.betweenCInfinity"));
                else
                    range(`∈ (-∞, ${decimalOptions(coefs.c)})`, tr("analyze.betweenInfinityC"));
            },
        },
        2: { 1: () => xAxis(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"), 2: () => yAxis(coefs.b + coefs.c, "b × aˣ + c", "b + c"), 3: () => resolveXValues(coefs, "exp"), 4: () => resolveYValues(coefs, "exp"), 5: () => resolveSign(coefs, "exp") },
        3: { 1: () => saveEquations(coefs, "exp") },
    });
}
export function resolveLogarithmic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c };
    resolveFunction(coefs, "log");
    const root = round(coefs.a ** divisionOptions(-coefs.c, coefs.b, { shouldRound: false }));
    runAnalysisMenu(coefs, "log", ["analyze.options.curve", "analyze.options.root"], {
        1: { 1: () => curve(coefs.a, coefs.b, false), 2: () => showRoot(root, "a⁽⁻ᶜ⁄ᵇ⁾"), 3: () => domain("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ"), 4: () => range(), 5: () => xAxis(root, "a⁽⁻ᶜ⁄ᵇ⁾") },
        2: { 1: () => yAxis("∄", "b × logₐ(x) + c", "x = 0 ⇒ logₐ(x) ∉ ℝ"), 2: () => resolveXValues(coefs, "log"), 3: () => resolveYValues(coefs, "log"), 4: () => resolveSign(coefs, "log"), 5: () => saveEquations(coefs, "log") },
    });
}
export function resolveSine({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c };
    resolveFunction(coefs, "sin");
    runAnalysisMenu(coefs, "sin", ["analyze.options.amplitude", "analyze.options.period"], {
        1: {
            1: () => amplitude(coefs.b),
            2: () => showPeriod(coefs.a),
            3: () => domain(),
            4: () => range(`∈ [${decimalOptions(-absoluteOptions(coefs.b) + coefs.c)}, ${decimalOptions(absoluteOptions(coefs.b) + coefs.c)}]`, "", "−|b| + c ≤ y ≤ |b| + c"),
            5: () => xAxis(divisionOptions(Math.asin(-coefs.c / coefs.b), coefs.a), "arcsin(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
        },
        2: { 1: () => yAxis(coefs.c, "b × sin(a · x) + c", "c"), 2: () => resolveXValues(coefs, "sin"), 3: () => resolveYValues(coefs, "sin"), 4: () => resolveSign(coefs, "sin"), 5: () => saveEquations(coefs, "sin") },
    });
}
export function resolveCosine({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c };
    resolveFunction(coefs, "cos");
    runAnalysisMenu(coefs, "cos", ["analyze.options.amplitude", "analyze.options.period"], {
        1: {
            1: () => amplitude(coefs.b),
            2: () => showPeriod(coefs.a),
            3: () => domain(),
            4: () => range(`∈ [${decimalOptions(-absoluteOptions(coefs.b) + coefs.c)}, ${decimalOptions(absoluteOptions(coefs.b) + coefs.c)}]`, "", "−|b| + c ≤ y ≤ |b| + c"),
            5: () => xAxis(divisionOptions(Math.acos(-coefs.c / coefs.b), coefs.a), "arccos(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
        },
        2: { 1: () => yAxis(coefs.b + coefs.c, "b × cos(a · x) + c", "b + c"), 2: () => resolveXValues(coefs, "cos"), 3: () => resolveYValues(coefs, "cos"), 4: () => resolveSign(coefs, "cos"), 5: () => saveEquations(coefs, "cos") },
    });
}
export function resolveTangent({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c };
    resolveFunction(coefs, "tan");
    runAnalysisMenu(coefs, "tan", ["analyze.options.verticalAsymptote", "analyze.options.period"], {
        1: { 1: () => verticalAsymptote(coefs.a), 2: () => showPeriod(coefs.a, true), 3: () => domain(), 4: () => range(), 5: () => xAxis(divisionOptions(Math.atan(-coefs.c / coefs.b), coefs.a), "arctan(−c / b) / a") },
        2: { 1: () => yAxis(coefs.c, "b × tan(a · x) + c", "c"), 2: () => resolveXValues(coefs, "tan"), 3: () => resolveYValues(coefs, "tan"), 4: () => resolveSign(coefs, "tan"), 5: () => saveEquations(coefs, "tan") },
    });
}
function runAnalysisMenu(coefs, funcType, extraOptions, pageActions) {
    const options = [...extraOptions, ...BASE_OPTIONS].map(key => tr(key)), total = Math.max(1, Math.ceil(options.length / 5)), list = [...options, ...Array(total * 5 - options.length).fill("---")];
    let page = 1, limit = 0;
    do {
        page = Math.min(Math.max(page, 1), total);
        const currentPage = page, answer = rangeOptions(`=== ${tr("ui.menu")} ===\n${tr("ui.page", { page: currentPage, total })}\n${tr("main.whatWant")}${Array.from({ length: 5 }, (_, i) => `\n${i + 1} = ${list.at(i + 5 * (currentPage - 1))}`).join("")}` +
            `\n----------------\n6 = ${tr("main.review")} | 7 = ${tr("main.change")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`, { commands: true, max: 9, min: 0 });
        if (isValidCommand(answer)) {
            State.loop = "on";
            State.keepChoice = "on";
            return;
        }
        if (answer === 0 || answer === 7) {
            State.askCoeffs = answer === 7 ? "on" : "off";
            State.loop = "on";
            return;
        }
        if (answer === 8 || answer === 9) {
            page += answer === 8 ? -1 : 1;
            continue;
        }
        const result = pageActions[currentPage]?.[answer]?.();
        if (result !== "result" && result != null)
            return;
        if (answer === 6)
            resolveFunction(coefs, funcType, true);
    } while (!exceededLimit(limit++));
    State.loop = "on";
}
