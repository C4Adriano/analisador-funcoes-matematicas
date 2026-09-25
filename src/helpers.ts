import { absoluteOptions, divisionOptions, lnOptions, logOptions, resolveEquations, round } from "./algebra.js"
import { isFiniteNumber } from "./checks.js"
import { Config } from "./config.js"
import { input, notify } from "./display.js"
import { errorLimitExceeded } from "./errors.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { decimalOptions } from "./writing.js"

function domain(belongs = "∈ ℝ", explanation: string = tr("helpers.functionTakeX")): void {
    notify(`${tr("helpers.domain")} x ${belongs}`, { explanation })
}

function range(belongs = "∈ ℝ", interval = "", explanation: string = tr("helpers.functionTakeY")): void {
    notify(`${tr("helpers.range")} y ${belongs}`, { explanation: `${explanation} ${interval}` })
}

function xAxis(root = 0, explanation = "c", noHave: string = tr("helpers.noRoots")): void {
    const intersection = tr("helpers.intersectionXAxis")

    if (root === 0)
        if (explanation === "0") notify(`${intersection} ∃∞ x ∈ ℝ`, { explanation: "y = 0 ⇒ ∀ x ∈ ℝ" })
        else notify(`${intersection} ∄! x ∈ ℝ`, { explanation: "y = c ∧ c ≠ 0 ⇒ ∄ x" })
    else if (isFiniteNumber(root)) notify(`${intersection} (${decimalOptions(root)}, 0)`, { explanation: `${tr("helpers.rootPoint")} (${explanation}, 0)` })
    else notify(`${intersection} ∄`, { explanation: noHave })
}

function yAxis(point: Value = 0, func = "c", explanation = "c"): void {
    const pointText = point === "∄" ? "∄" : `(0, ${decimalOptions(point)})`,
        explanationText = point === "∄" ? explanation : `⇒ (0, ${explanation})`

    notify(`${tr("helpers.intersectionYAxis")} ${pointText}`, { explanation: `${tr("helpers.sinceY")} ${func} ${explanationText}` })
}

function resolveXValues({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}, funcType: FunctionType = "poly"): void {
    const coefs: NumericCoefficients = { a, b, c },
        x = input("x = ", { number: true, placeholder: "0" }),
        message = `${tr("helpers.sinceX") + decimalOptions(x)}, y = `

    switch (funcType) {
        case "poly":
            notify(`${message}${decimalOptions(coefs.a * x ** 2 + coefs.b * x + coefs.c)}`, { explanation: `y = ${coefs.a === 0 ? "" : "a · x² + "}${coefs.b === 0 ? "" : "b · x + "}c` })
            break
        case "exp":
            notify(`${message}${decimalOptions(coefs.b * coefs.a ** x + coefs.c)}`, { explanation: "y = b × aˣ + c" })
            break
        case "log":
            x > 0 ? notify(`${message}${decimalOptions(coefs.b * logOptions(x, coefs.a) + coefs.c)}`, { explanation: "y = b × logₐ(x) + c" }) : notify(`${message} ∄! y ∈ ℝ`, { explanation: "x ≤ 0 ⇒ logₐ(x) ∉ ℝ" })
            break
        default:
            notify(`${message}${decimalOptions(coefs.b * (funcType === "sin" ? Math.sin(x) : funcType === "cos" ? Math.cos(x) : funcType === "tan" ? Math.tan(x) : 0) + coefs.c)}`, { explanation: `y = b × ${funcType}(x) + c` })
    }
}

function resolveYValues({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}, funcType: FunctionType = "poly"): void {
    const coefs: NumericCoefficients = { a, b, c },
        y = input("y = ", { number: true, placeholder: "0" }),
        message = `${tr("helpers.sinceY2") + decimalOptions(y)},`

    if (funcType === "poly")
        if (coefs.a === 0 && coefs.b === 0)
            if (y === coefs.c) notify(`${message} ∃∞ x ∈ ℝ`, { explanation: "y = c ⇒ ∀ x ∈ ℝ" })
            else notify(`${message} ∄! x ∈ ℝ`, { explanation: "y ≠ c ⇒ ∄ x" })
        else if (coefs.a === 0 && coefs.b !== 0) notify(`${message} x = ${decimalOptions(divisionOptions(y - coefs.c, coefs.b))}`, { explanation: "x = (y − c) / b" })
        else {
            const [delta, root1, root2] = calculateDelta({ a: coefs.a, b: coefs.b, c: coefs.c - y }),
                [x1, x2] = [decimalOptions(root1), decimalOptions(root2)]
            showDelta(delta, `${message} ∄! x ∈ ℝ`, `${message} x = ${x1}`, `${message} x₁ = ${x1}, x₂ = ${x2}`, true)
        }
    else if (funcType === "exp" || funcType === "log") {
        const exponent = divisionOptions(y - coefs.c, coefs.b, { shouldRound: false })
        funcType === "exp"
            ? exponent > 0
                ? notify(`${message} x = ${decimalOptions(divisionOptions(lnOptions(exponent), lnOptions(coefs.a)))}`, { explanation: "x = ln((y − c) / b) / ln(a)" })
                : notify(`${message} ∄! x ∈ ℝ`, { explanation: "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ" })
            : notify(`${message} x = ${decimalOptions(coefs.a ** exponent)}`, { explanation: "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾" })
    } else notify(tr("helpers.notTrigonometric"), { explanation: tr("algebra.underConstruction") })
}

function resolveSign({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}, funcType: FunctionType = "poly"): void {
    const coefs: NumericCoefficients = { a, b, c }
    switch (funcType) {
        case "poly":
            coefs.a === 0 && coefs.b === 0 ? signConstant(coefs) : coefs.a === 0 ? signAffine(coefs) : signQuadratic(coefs)
            break
        case "exp":
            signExponential(coefs)
            break
        case "log":
            signLogarithmic(coefs)
            break
        default:
            signTrig()
    }
}

function saveEquations({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}, funcType: FunctionType = "poly"): "nonPoly" | "saved" | "result" {
    if (funcType !== "poly") {
        notify(tr("helpers.equationsNonPolynomial"), { explanation: tr("algebra.underConstruction"), type: "warning" })
        return "nonPoly"
    }

    const coefs: NumericCoefficients = { a, b, c }

    if (State.baseFunc == null) {
        State.baseFunc = coefs
        State.askCoeffs = true
        State.loop = true
        notify(`ƒ₁(x) ${tr("helpers.saved")}`, { explanation: tr("helpers.typeSecondFunction"), type: "warning" })
        return "saved"
    }

    resolveEquations({ a1: Number(State.baseFunc.a), b1: Number(State.baseFunc.b), c1: Number(State.baseFunc.c) }, { a2: coefs.a, b2: coefs.b, c2: coefs.c })
    State.baseFunc = null
    return "result"
}

function curve(coefA = 0, coefB = 0, polynomial = true): void {
    if (!polynomial) {
        if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) notify(tr("helpers.increasingUpper"), { explanation: "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" })
        else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) notify(tr("helpers.decreasing"), { explanation: "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)" })
    } else if (coefB !== 0)
        if (coefB > 0) notify(tr("helpers.increasingUpper"), { explanation: `${tr("helpers.pointsUpward")}b > 0` })
        else notify(tr("helpers.decreasing"), { explanation: `${tr("helpers.pointsDownward")}b < 0` })
    else if (coefA !== 0)
        if (coefA > 0) notify(tr("helpers.upwardConcavity"), { explanation: "a > 0" })
        else notify(tr("helpers.downwardConcavity"), { explanation: "a < 0" })
}

function calculateRoot({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}, funcType: FunctionType = "poly"): number {
    if (funcType === "poly") {
        if (a === 0 && b === 0) return NaN
        return a === 0 ? divisionOptions(-c, b) : NaN
    }

    const exponent = divisionOptions(-c, b, { shouldRound: false })
    if (funcType === "exp") return exponent > 0 ? divisionOptions(lnOptions(exponent), lnOptions(a)) : NaN
    return funcType === "log" ? round(a ** exponent) : NaN
}

function showRoot(root = 0, explanation = "c", noHave = ""): void {
    const intersection = tr("helpers.realRoot")
    if (isFiniteNumber(root)) notify(`${intersection} x = ${decimalOptions(root)}`, { explanation: tr("helpers.theRootIs") + explanation })
    else notify(`${intersection} ∄! x ∈ ℝ`, { explanation: noHave })
}

function calculateDelta({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}): [delta: number, root1: number, root2: number] {
    const delta = b ** 2 - 4 * a * c

    if (delta <= 0) return [delta, delta === 0 ? divisionOptions(-b, 2 * a) : NaN, NaN]

    const sqrtDelta = Math.sqrt(delta),
        q = b >= 0 ? -0.5 * (b + sqrtDelta) : -0.5 * (b - sqrtDelta),
        raw1 = divisionOptions(q, a),
        raw2 = divisionOptions(c, q)
    return [delta, Math.min(raw1, raw2), Math.max(raw1, raw2)]
}

function showDelta(delta = 0, lower = "", equal = "", higher = "", hasY = false): void {
    const base = `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ`,
        [message, suffix] = delta < 0 ? [lower, "< 0 ⇒ x ∉ ℝ"] : delta === 0 ? [equal, "= 0 ⇒ x = (−b) / (2 · a)"] : [higher, "> 0 ⇒ x₁, x₂ = (−b ± √Δ) / (2 · a)"]

    notify(message, { explanation: `${base} ${suffix}` })
}

function vertex(coefA: Value = 0, coefB: Value = 0, delta = 0): [x: number, y: number] {
    const a = Number(coefA)
    return [divisionOptions(-a, 2 * Number(coefB)), divisionOptions(-delta, 4 * a)]
}

function exceededLimit(limit: number = Config.iterationLimit): boolean {
    if (limit < Config.iterationLimit) return false
    errorLimitExceeded()
    return true
}

function calcPeriod(coefA: Value = 0, funcTan = false): string {
    return decimalOptions((funcTan ? Math.PI : 2 * Math.PI) / absoluteOptions(Number(coefA)))
}

function showPeriod(coefA: Value = 0, funcTan = false): void {
    if (coefA === 0) notify(tr("helpers.periodInfinity"), { explanation: tr("helpers.constantPeriod") })
    else notify(tr("helpers.period") + calcPeriod(coefA, funcTan), { explanation: `${tr("helpers.periodEquals") + (funcTan ? "π" : "2π")} / |a|` })
}

function amplitude(coefB: Value = 0): void {
    notify(`Amplitude: ${decimalOptions(absoluteOptions(Number(coefB)))}`, { explanation: "Amplitude = |b|" })
}

function verticalAsymptote(coefA: Value = 0): void {
    const label = tr("helpers.verticalAsymptote")
    if (coefA === 0) notify(`${label} ∄`, { explanation: tr("helpers.noAsymptote") })
    else notify(`${label} x = (π / 2 + n · π) / a, n ∈ ℤ`, { explanation: `tan(a · x) ${tr("helpers.undefinedAsymptote")} cos(a · x) = 0, ${tr("helpers.ie")} a · x = π / 2 + n · π` })
}

function signTrig(): void {
    notify(tr("helpers.singNotTrigonometric"), { explanation: tr("algebra.underConstruction"), type: "warning" })
}

function signConstant({ c = State.current.numericC }: Partial<NumericCoefficients> = {}): void {
    const symbol: ">" | "<" | "=" = c === 0 ? "=" : c > 0 ? ">" : "<"
    notify(`ƒ(x) ${symbol} 0, ∀ x ∈ ℝ`, { explanation: `c ${symbol} 0 ⇒ ƒ(x) ${symbol} 0 ⇒ ∀ x ∈ ℝ` })
}

function signAffine({ b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}): void {
    const affineRoot = calculateRoot({ b, c }),
        symbol: ">" | "<" = b > 0 ? ">" : "<",
        opposite: ">" | "<" = symbol === ">" ? "<" : ">"
    notify(`ƒ(x) ${symbol} 0 ${tr("helpers.if")} x ${opposite} ${affineRoot}\nƒ(x) = 0 ${tr("helpers.in")} x = ${affineRoot}\nƒ(x) ${opposite} 0 ${tr("helpers.if")} x ${symbol} ${affineRoot}`, {
        explanation: `b ${symbol} 0 ⇒ ƒ(x) ${tr("helpers.increasing")}`,
    })
}

function signQuadratic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}): void {
    const symbol: ">" | "<" = a > 0 ? ">" : "<",
        [delta, root1, root2] = calculateDelta({ a, b, c }),
        [x1, x2] = [decimalOptions(root1), decimalOptions(root2)]

    if (delta < 0) notify(`ƒ(x) ${symbol} 0, ∀ x ∈ ℝ`, { explanation: `a ${symbol} 0 ∧ Δ < 0 ⇒ ƒ(x) ${symbol} 0, ∀ x ∈ ℝ` })
    else if (delta === 0) notify(`ƒ(x) ${symbol} 0, ${tr("helpers.exceptIn")} x = ${x1}`, { explanation: `a ${symbol} 0 ∧ Δ = 0 ⇒ ƒ(x) ${symbol} 0, x ≠ ${x1}` })
    else if (a < 0) notify(`ƒ(x) > 0 ${tr("helpers.if")} ${x1} < x < ${x2}\nƒ(x) = 0 ${tr("helpers.in")} x = ${x1} ∨ x = ${x2}\nƒ(x) < 0 ${tr("helpers.if")} x < ${x1} ∨ x > ${x2}`, { explanation: "a < 0 ∧ Δ > 0" })
    else notify(`ƒ(x) > 0 ${tr("helpers.if")} x < ${x1} ∨ x > ${x2}\nƒ(x) = 0 ${tr("helpers.in")} x = ${x1} ∨ x = ${x2}\nƒ(x) < 0 ${tr("helpers.if")} ${x1} < x < ${x2}`, { explanation: "a > 0 ∧ Δ > 0." })
}

function signExponential({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}): void {
    if (divisionOptions(-c, b, { shouldRound: false }) > 0) {
        const root = decimalOptions(calculateRoot({ a, b, c }, "exp")),
            symbol: ">" | "<" = (a < 1 && b < 0) || (a > 1 && b > 0) ? ">" : "<",
            opposite: ">" | "<" = symbol === ">" ? "<" : ">"
        notify(`ƒ(x) > 0 ${tr("helpers.if")} x ${symbol} ${root}\nƒ(x) = 0 ${tr("helpers.in")} x = ${root}\nƒ(x) < 0 ${tr("helpers.if")} x ${opposite} ${root}`, { explanation: `a ${symbol} 0 ∧ (−c) / b > 0.` })
    } else if (b > 0) notify("ƒ(x) > 0, ∀ x ∈ ℝ", { explanation: `${tr("helpers.accordingTo")} b > 0 ∧ (−c) / b ≤ 0.` })
    else notify("ƒ(x) < 0, ∀ x ∈ ℝ", { explanation: `${tr("helpers.accordingTo")} b < 0 ∧ (−c) / b ≤ 0.` })
}

function signLogarithmic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NumericCoefficients> = {}): void {
    const root = decimalOptions(calculateRoot({ a, b, c }, "log")),
        increasing = (a < 1 && b < 0) || (a > 1 && b > 0),
        symbol: ">" | "<" = increasing ? ">" : "<",
        opposite: ">" | "<" = increasing ? "<" : ">"
    notify(`ƒ(x) > 0 ${tr("helpers.if")} x ${symbol} ${root}\nƒ(x) = 0 ${tr("helpers.in")} x = ${root}\nƒ(x) < 0 ${tr("helpers.if")} x ${opposite} ${root}`, {
        explanation: increasing ? "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" : "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)",
    })
}

export { amplitude, calculateDelta, calculateRoot, curve, domain, exceededLimit, range, resolveSign, resolveXValues, resolveYValues, saveEquations, showDelta, showPeriod, showRoot, vertex, verticalAsymptote, xAxis, yAxis }
