import { Config } from "../Base/config.js"
import { INPUT_FAILED } from "../Base/consts.js"
import { abs, add, divide, ln, log, max, min, negate, round, subtract } from "../Base/numeric.js"
import { cos, ensureReal, isLogBase, isNegative, isNonNegative, isNonPositive, isNonZero, isPositive, isZero, num, ONE, PI, radians, sin, tan, toInteger, toReal, ZERO } from "../Base/quantity.js"
import { tr } from "../Lang/i18n.js"
import { decimalOptions, formatReal } from "../Lang/writing.js"
import { State } from "../Math/state.js"
import { isValidCommand } from "../UI/commands.js"
import { input, notify } from "../UI/display.js"
import { rangeOptions, resolveFunction } from "../UI/ui.js"

type EquationsReturn = "result" | "nonPoly" | "saved"
type MenuAction = () => Promise<EquationsReturn> | Promise<void>
type Sign = "<" | ">"

const TRIGONOMETRIC: Partial<Record<FunctionType, (angle: Radians) => Real>> = { sin, cos, tan }

function fromUnit(value: Raw): Radians | null {
    const converted: Real | null = toReal(Config.angleUnit === "deg" ? (value * PI) / 180 : value)
    return converted == null ? null : radians(converted)
}

function toUnit(value: Raw): Raw {
    return Config.angleUnit === "deg" ? (value * 180) / PI : value
}

function current(key: Variable): Real {
    return State.current.toNumericCoefficients()[key]
}

async function domain(belongs = "∈ ℝ", explanation: string = tr("analyze.functionTakeX")): Promise<void> {
    await notify(`${tr("analyze.domain")} x ${belongs}`, { explanation })
}

async function range(belongs = "∈ ℝ", interval = "", explanation: string = tr("analyze.functionTakeY")): Promise<void> {
    await notify(`${tr("analyze.range")} y ${belongs}`, { explanation: `${explanation} ${interval}` })
}

async function xAxis(root: Real | null | "constant", explanation = "c", noHave: string = tr("analyze.noRoot")): Promise<void> {
    const intersection = tr("analyze.intersectionXAxis")

    if (root === "constant") explanation === "0" ? await notify(`${intersection} ∃∞ x ∈ ℝ`, { explanation: "y = 0 ⇒ ∀ x ∈ ℝ" }) : await notify(`${intersection} ∄! x ∈ ℝ`, { explanation: "y = c ∧ c ≠ 0 ⇒ ∄ x" })
    else if (root == null) await notify(`${intersection} ∄`, { explanation: noHave })
    else await notify(`${intersection} (${decimalOptions(root)}, 0)`, { explanation: `${tr("analyze.rootPoint")} (${explanation}, 0)` })
}

async function yAxis(point: Real | "∄" = ZERO, kind = "c", explanation = "c"): Promise<void> {
    await notify(`${tr("analyze.intersectionYAxis")} ${point === "∄" ? "∄" : `(0, ${decimalOptions(point)})`}`, { explanation: `${tr("analyze.sinceY")} ${kind} ${point === "∄" ? explanation : `⇒ (0, ${explanation})`}` })
}

async function resolveXValues({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}, kind: FunctionType = "poly"): Promise<void> {
    const x: Real | typeof INPUT_FAILED = await input("x = ", { placeholder: "0", type: "number" })
    if (x === INPUT_FAILED) return

    const message = `${tr("analyze.sinceX") + decimalOptions(x)}, y = `

    if (kind === "poly") await notify(`${message}${formatReal(toReal(a * x ** 2 + b * x + c))}`, { explanation: `y = ${a === ZERO ? "" : "a · x² + "}${b === ZERO ? "" : "b · x + "}c` })
    else if (kind === "exp") await notify(`${message}${formatReal(toReal(b * a ** x + c))}`, { explanation: "y = b × aˣ + c" })
    else if (kind === "log") isPositive(x) && isLogBase(a) ? await notify(`${message}${formatReal(toReal(b * log(x, a) + c))}`, { explanation: "y = b × logₐ(x) + c" }) : await notify(`${message} ∄! y ∈ ℝ`, { explanation: "x ≤ 0 ⇒ logₐ(x) ∉ ℝ" })
    else {
        const trig: ((angle: Radians) => Real) | null = TRIGONOMETRIC[kind] ?? null,
            angle: Radians | null = fromUnit(a * x)

        if (trig == null) await notify(tr("analyze.notTrigonometric"), { explanation: tr("algebra.underConstruction") })
        else await notify(`${message}${formatReal(angle == null ? null : toReal(b * trig(angle) + c))}`, { explanation: `y = b × ${kind}(a · x) + c` })
    }
}

async function resolveYValues({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}, kind: FunctionType = "poly"): Promise<void> {
    const y: Real | typeof INPUT_FAILED = await input("y = ", { placeholder: "0", type: "number" })
    if (y === INPUT_FAILED) return

    const message = `${tr("analyze.sinceY2") + decimalOptions(y)},`

    if (kind === "poly") {
        if (isNonZero(a)) {
            const [Δ, r1, r2] = calculateDelta({ a, b, c: subtract(c, y) }),
                [x1, x2] = [formatReal(r1), formatReal(r2)]
            await showDelta(Δ, `${message} ∄! x ∈ ℝ`, `${message} x = ${x1}`, `${message} x₁ = ${x1}, x₂ = ${x2}`, true)
        } else if (isNonZero(b)) await notify(`${message} x = ${formatReal(round(divide(subtract(y, c), b)))}`, { explanation: "x = (y − c) / b" })
        else y === c ? await notify(`${message} ∃∞ x ∈ ℝ`, { explanation: "y = c ⇒ ∀ x ∈ ℝ" }) : await notify(`${message} ∄! x ∈ ℝ`, { explanation: "y ≠ c ⇒ ∄ x" })
    } else if (kind === "exp" || kind === "log") {
        const exponent: Real | null = toReal(subtract(y, c) / b)
        if (kind === "exp") exponent != null && isPositive(exponent) && isLogBase(a) ? await notify(`${message} x = ${formatReal(round(divide(ln(exponent), ln(a))))}`, { explanation: "x = ln((y − c) / b) / ln(a)" }) : await notify(`${message} ∄! x ∈ ℝ`, { explanation: "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ" })
        else await notify(`${message} x = ${formatReal(exponent == null ? null : round(a ** exponent))}`, { explanation: "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾" })
    } else await notify(tr("analyze.notTrigonometric"), { explanation: tr("algebra.underConstruction") })
}

async function resolveSign({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}, kind: FunctionType = "poly"): Promise<void> {
    const coefs: NumericCoefficients = { a, b, c }
    if (kind === "poly") coefs.a === ZERO && coefs.b === ZERO ? await signConstant(coefs) : coefs.a === ZERO ? await signAffine(coefs) : await signQuadratic(coefs)
    else if (kind === "exp") await signExponential(coefs)
    else if (kind === "log") await signLogarithmic(coefs)
    else await signTrig()
}

async function resolveEquations(first: NumericCoefficients, second: NumericCoefficients): Promise<void> {
    const a: Real = subtract(first.a, second.a),
        b: Real = subtract(first.b, second.b),
        c: Real = subtract(first.c, second.c)

    if (a === ZERO && b === ZERO) c === ZERO ? await notify(tr("algebra.constantCoincide"), { explanation: tr("algebra.constantCoincideExp") }) : await notify(tr("algebra.constantDistinct"), { explanation: tr("algebra.constantDistinctExp") })
    else if (a === ZERO) await notify(tr("algebra.oneRoot", { x: formatReal(round(negate(c) / b)) }), { explanation: "x = −c / b" })
    else {
        const [Δ, r1, r2] = calculateDelta({ a, b, c }),
            [x1, x2] = [formatReal(r1), formatReal(r2)]
        await showDelta(Δ, `${tr("algebra.quadraticDistinct")}\n${complexRoots(a, b, Δ)}`, tr("algebra.oneRoot", { x: x1 }), tr("algebra.twoRoots", { x1, x2 }))
    }
}

async function saveEquations({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}, kind: FunctionType = "poly"): Promise<EquationsReturn> {
    if (kind !== "poly") {
        await notify(tr("analyze.equationsNonPolynomial"), { explanation: tr("algebra.underConstruction"), type: "warning" })
        return "nonPoly"
    }

    if (State.firstFunction == null) {
        State.firstFunction = { a, b, c }
        State.askCoeffs = "on"
        State.loop = "on"
        await notify(`ƒ₁(x) ${tr("analyze.saved")}`, { explanation: tr("analyze.typeSecondFunction"), type: "warning" })
        return "saved"
    }

    await resolveEquations(State.firstFunction, { a, b, c })
    State.firstFunction = null
    return "result"
}

async function curve(a: Real = ZERO, b: Real = ZERO, type: "poly" | "exp" = "poly"): Promise<void> {
    if (type === "exp") (a < ONE && b < ZERO) || (a > ONE && b > ZERO) ? await notify(tr("analyze.increasingUpper"), { explanation: "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" }) : await notify(tr("analyze.decreasing"), { explanation: "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)" })
    else if (isNonZero(b)) isPositive(b) ? await notify(tr("analyze.increasingUpper"), { explanation: `${tr("analyze.pointsUpward")}b > 0` }) : await notify(tr("analyze.decreasing"), { explanation: `${tr("analyze.pointsDownward")}b < 0` })
    else if (isNonZero(a)) isPositive(a) ? await notify(tr("analyze.upwardConcavity"), { explanation: "a > 0" }) : await notify(tr("analyze.downwardConcavity"), { explanation: "a < 0" })
}

function calculateRoot({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}, kind: FunctionType = "poly"): Real | null {
    if (kind === "poly") return isZero(a) ? round(negate(c) / b) : null

    const exponent: Real | null = toReal(negate(c) / b)
    if (exponent == null) return null
    if (kind === "exp") return isPositive(exponent) && isLogBase(a) ? round(divide(ln(exponent), ln(a))) : null
    return kind === "log" ? round(a ** exponent) : null
}

async function showRoot(root: Real | null, explanation = "c", noHave = ""): Promise<void> {
    await notify(`${tr("analyze.realRoot")} ${root == null ? "∄! x ∈ ℝ" : `x = ${decimalOptions(root)}`}`, { explanation: root == null ? noHave : tr("analyze.theRootIs") + explanation })
}

function complexRoots(a: Real, b: Real, Δ: Real): string {
    if (isNonNegative(Δ)) return ""
    const re: string = formatReal(round(negate(b) / (2 * a))),
        im: string = formatReal(round(Math.sqrt(negate(Δ)) / (2 * Math.abs(a))))
    return `x₁ = ${re} − ${im}i, x₂ = ${re} + ${im}i`
}

function calculateDelta({ a, b, c }: NumericCoefficients): [Δ: Real, r1: Real | null, r2: Real | null] {
    const bSquared: Raw = b ** 2,
        fourAC: Raw = 4 * a * c,
        difference: Raw = bSquared - fourAC,
        Δ: Real = ensureReal(Math.abs(difference) <= 8 * Number.EPSILON * Math.max(bSquared, Math.abs(fourAC)) ? 0 : difference)
    if (isNonPositive(Δ)) return [Δ, isZero(Δ) ? round(negate(b) / (2 * a)) : null, null]

    const sqrtDelta: Raw = Math.sqrt(Δ),
        q: Raw = -0.5 * (b + (isNonNegative(b) ? sqrtDelta : -sqrtDelta)),
        raw1: Real | null = round(q / a),
        raw2: Real | null = round(c / q)
    return raw1 == null || raw2 == null ? [Δ, null, null] : [Δ, min(raw1, raw2), max(raw1, raw2)]
}

async function showDelta(Δ: Real = ZERO, lower = "", equal = "", higher = "", hasY = false): Promise<void> {
    const [message, suffix] = isNegative(Δ) ? [lower, "< 0 ⇒ x ∉ ℝ"] : isZero(Δ) ? [equal, "= 0 ⇒ x = (−b) / (2 · a)"] : [higher, "> 0 ⇒ x₁, x₂ = (−b ± √Δ) / (2 · a)"]
    await notify(message, { explanation: `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ ${suffix}` })
}

function vertex(a: Real, b: Real, Δ: Real): [x: Real | null, y: Real | null] {
    return [round(negate(b) / (2 * a)), round(negate(Δ) / (4 * a))]
}

async function hasExceededLimit(limit: Raw = Config.iterationLimit): Promise<boolean> {
    if (limit < Config.iterationLimit) return false
    await notify(tr("errors.error003"), { explanation: tr("errors.iterationsExceeded"), type: "error" })
    return true
}

function calcPeriod(a: Real, isTangent = false): string {
    return formatReal(round(toUnit(isTangent ? PI : 2 * PI) / Math.abs(a)))
}

async function showPeriod(a: Real = ZERO, isTangent = false): Promise<void> {
    isZero(a) ? await notify(tr("analyze.periodInfinity"), { explanation: tr("analyze.constantPeriod") }) : await notify(tr("analyze.period") + calcPeriod(a, isTangent), { explanation: `${tr("analyze.periodEquals") + (isTangent ? "π" : "2π")} / |a|` })
}

async function amplitude(b: Real = ZERO): Promise<void> {
    await notify(`Amplitude: ${formatReal(abs(b))}`, { explanation: "Amplitude = |b|" })
}

function amplitudeRange(b: Real, c: Real): string {
    const radius: NonNegative = abs(b)
    return `∈ [${decimalOptions(subtract(c, radius))}, ${decimalOptions(add(c, radius))}]`
}

async function verticalAsymptote(a: Real = ZERO): Promise<void> {
    const label = tr("analyze.verticalAsymptote")
    isZero(a) ? await notify(`${label} ∄`, { explanation: tr("analyze.noAsymptote") }) : await notify(`${label} x = (π / 2 + n · π) / a, n ∈ ℤ`, { explanation: `tan(a · x) ${tr("analyze.undefinedAsymptote")} cos(a · x) = 0, ${tr("analyze.ie")} a · x = π / 2 + n · π` })
}

async function signTrig(): Promise<void> {
    await notify(tr("analyze.singNotTrigonometric"), { explanation: tr("algebra.underConstruction"), type: "warning" })
}

async function signConstant({ c = current("c") }: NumericCoefficientsFor<"c"> = {}): Promise<void> {
    const sign: Sign | "=" = isZero(c) ? "=" : isPositive(c) ? ">" : "<"
    await notify(`ƒ(x) ${sign} 0, ∀ x ∈ ℝ`, { explanation: `c ${sign} 0 ⇒ ƒ(x) ${sign} 0 ⇒ ∀ x ∈ ℝ` })
}

async function signAffine({ b = current("b"), c = current("c") }: NumericCoefficientsFor<"b" | "c"> = {}): Promise<void> {
    const sign: Sign = isPositive(b) ? ">" : "<"
    await notify(rootSigns(sign, formatReal(calculateRoot({ a: ZERO, b, c }))), { explanation: `b ${sign} 0 ⇒ ƒ(x) ${tr(b > 0 ? "analyze.increasing" : "analyze.decreasing")}` })
}

function rootSigns(sign: Sign, root: string): string {
    return `ƒ(x) > 0 ${tr("analyze.if")} x ${sign} ${root}\nƒ(x) = 0 ${tr("analyze.in")} x = ${root}\nƒ(x) < 0 ${tr("analyze.if")} x ${sign === ">" ? "<" : ">"} ${root}`
}

async function signQuadratic({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const sign: Sign = isPositive(a) ? ">" : "<",
        [Δ, r1, r2] = calculateDelta({ a, b, c }),
        [x1, x2] = [formatReal(r1), formatReal(r2)]

    if (isNegative(Δ)) await notify(`ƒ(x) ${sign} 0, ∀ x ∈ ℝ`, { explanation: `a ${sign} 0 ∧ Δ < 0 ⇒ ƒ(x) ${sign} 0, ∀ x ∈ ℝ` })
    else if (isZero(Δ)) await notify(`ƒ(x) ${sign} 0, ${tr("analyze.exceptIn")} x = ${x1}`, { explanation: `a ${sign} 0 ∧ Δ = 0 ⇒ ƒ(x) ${sign} 0, x ≠ ${x1}` })
    else {
        const inside = `${x1} < x < ${x2}`,
            outside = `x < ${x1} ∨ x > ${x2}`,
            [positive, negative] = isNegative(a) ? [inside, outside] : [outside, inside]
        await notify(`ƒ(x) > 0 ${tr("analyze.if")} ${positive}\nƒ(x) = 0 ${tr("analyze.in")} x = ${x1} ∨ x = ${x2}\nƒ(x) < 0 ${tr("analyze.if")} ${negative}`, { explanation: `a ${sign} 0 ∧ Δ > 0` })
    }
}

async function signExponential({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const exponent: Real | null = toReal(negate(c) / b)

    if (exponent != null && isPositive(exponent)) {
        const sign: Sign = (a < ONE && b < ZERO) || (a > ONE && b > ZERO) ? ">" : "<"
        await notify(rootSigns(sign, formatReal(calculateRoot({ a, b, c }, "exp"))), { explanation: `${sign === ">" ? "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" : "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)"} ∧ (−c) / b > 0` })
    } else {
        const sign: Sign = isPositive(b) ? ">" : "<"
        await notify(`ƒ(x) ${sign} 0, ∀ x ∈ ℝ`, { explanation: `${tr("analyze.accordingTo")} b ${sign} 0 ∧ (−c) / b ≤ 0` })
    }
}

async function signLogarithmic({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const sign: Sign = (a < ONE && b < ZERO) || (a > ONE && b > ZERO) ? ">" : "<"
    await notify(rootSigns(sign, formatReal(calculateRoot({ a, b, c }, "log"))), { explanation: sign === ">" ? "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" : "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)" })
}

const BASE_OPTIONS: TranslationKey[] = ["analyze.options.domain", "analyze.options.range", "analyze.options.xIntersection", "analyze.options.yIntersection", "analyze.options.xValues", "analyze.options.yValues", "analyze.options.signAnalysis", "analyze.options.functionEquations"]

export async function resolveConstant({ c = current("c") }: NumericCoefficientsFor<"c"> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a: ZERO, b: ZERO, c }
    await resolveFunction(coefs)

    await runAnalysisMenu(coefs, "poly", [], {
        1: { 1: async () => domain(), 2: async () => range(`= ${decimalOptions(coefs.c)}`, "", tr("analyze.constantValue")), 3: async () => xAxis("constant", decimalOptions(coefs.c)), 4: async () => yAxis(coefs.c, "c", "c"), 5: async () => resolveXValues(coefs) },
        2: { 1: async () => resolveYValues(coefs), 2: async () => resolveSign(coefs), 3: async () => saveEquations(coefs) },
    })
}

export async function resolveAffine({ b = current("b"), c = current("c") }: NumericCoefficientsFor<"b" | "c"> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a: ZERO, b, c }
    await resolveFunction(coefs)

    const root: Real | null = calculateRoot(coefs)

    await runAnalysisMenu(coefs, "poly", ["analyze.options.slope", "analyze.options.root"], {
        1: { 1: async () => curve(ZERO, coefs.b), 2: async () => showRoot(root, "(−c) / b"), 3: async () => domain(), 4: async () => range(), 5: async () => xAxis(root, "(−c) / b") },
        2: { 1: async () => yAxis(coefs.c, "bx + c", "c"), 2: async () => resolveXValues(coefs), 3: async () => resolveYValues(coefs), 4: async () => resolveSign(coefs), 5: async () => saveEquations(coefs) },
    })
}

export async function resolveQuadratic({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a, b, c }
    await resolveFunction(coefs)

    const [Δ, r1, r2] = calculateDelta(coefs),
        [x1, x2] = [formatReal(r1), formatReal(r2)],
        [vx, vy] = vertex(coefs.a, coefs.b, Δ),
        [xV, yV] = [formatReal(vx), formatReal(vy)]

    await runAnalysisMenu(coefs, "poly", ["analyze.options.concavity", "analyze.options.root", "analyze.options.vertex"], {
        1: {
            1: async () => curve(coefs.a),
            2: async () => showDelta(Δ, `${tr("analyze.noRoots")}\n${complexRoots(coefs.a, coefs.b, Δ)}`, tr("analyze.oneRoot", { x: x1 }), tr("analyze.twoRoots", { x1, x2 })),
            3: async (): Promise<void> => {
                await notify(tr("analyze.vertexPoint", { p1: xV, p2: yV }), { explanation: tr("analyze.vertexExp") })
            },
            4: async () => domain(),
            5: async () => (isPositive(coefs.a) ? range(`∈ [${yV}, ∞)`, tr("analyze.betweenVertexInfinity")) : range(`∈ (−∞, ${yV}]`, tr("analyze.betweenInfinityVertex"))),
        },
        2: {
            1: async () => showDelta(Δ, tr("analyze.noIntersectionXAxis"), tr("analyze.oneIntersectionXAxis", { p: x1 }), tr("analyze.twoIntersectionsXAxis", { p1: x1, p2: x2 })),
            2: async () => yAxis(coefs.c, "ax² + bx + c", "c"),
            3: async () => resolveXValues(coefs),
            4: async () => resolveYValues(coefs),
            5: async () => resolveSign(coefs),
        },
        3: { 1: async () => saveEquations(coefs) },
    })
}

export async function resolveExponential({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a, b, c }
    await resolveFunction(coefs, "exp")

    const root: Real | null = calculateRoot(coefs, "exp")

    await runAnalysisMenu(coefs, "exp", ["analyze.options.curve", "analyze.options.root", "analyze.options.horizontalAsymptote"], {
        1: {
            1: async () => curve(coefs.a, coefs.b, "exp"),
            2: async () => showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"),
            3: async (): Promise<void> => {
                await notify(tr("analyze.horizontalAsymptotePoint", { y: decimalOptions(coefs.c) }), { explanation: "y = c" })
            },
            4: async () => domain(),
            5: async () => (isPositive(coefs.b) ? range(`∈ (${decimalOptions(coefs.c)}, ∞)`, tr("analyze.betweenCInfinity")) : range(`∈ (-∞, ${decimalOptions(coefs.c)})`, tr("analyze.betweenInfinityC"))),
        },
        2: { 1: async () => xAxis(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"), 2: async () => yAxis(add(coefs.b, coefs.c), "b × aˣ + c", "b + c"), 3: async () => resolveXValues(coefs, "exp"), 4: async () => resolveYValues(coefs, "exp"), 5: async () => resolveSign(coefs, "exp") },
        3: { 1: async () => saveEquations(coefs, "exp") },
    })
}

export async function resolveLogarithmic({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a, b, c }
    await resolveFunction(coefs, "log")

    const root: Real | null = calculateRoot(coefs, "log")

    await runAnalysisMenu(coefs, "log", ["analyze.options.curve", "analyze.options.root"], {
        1: { 1: async () => curve(coefs.a, coefs.b, "exp"), 2: async () => showRoot(root, "a⁽⁻ᶜ⁄ᵇ⁾"), 3: async () => domain("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ"), 4: async () => range(), 5: async () => xAxis(root, "a⁽⁻ᶜ⁄ᵇ⁾") },
        2: { 1: async () => yAxis("∄", "b × logₐ(x) + c", "x = 0 ⇒ logₐ(x) ∉ ℝ"), 2: async () => resolveXValues(coefs, "log"), 3: async () => resolveYValues(coefs, "log"), 4: async () => resolveSign(coefs, "log"), 5: async () => saveEquations(coefs, "log") },
    })
}

export async function resolveSine({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a, b, c }
    await resolveFunction(coefs, "sin")

    await runAnalysisMenu(coefs, "sin", ["analyze.options.amplitude", "analyze.options.period"], {
        1: {
            1: async () => amplitude(coefs.b),
            2: async () => showPeriod(coefs.a),
            3: async () => domain(),
            4: async () => range(amplitudeRange(coefs.b, coefs.c), "", "−|b| + c ≤ y ≤ |b| + c"),
            5: async () => xAxis(round(toUnit(Math.asin(negate(coefs.c) / coefs.b)) / coefs.a), "arcsin(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
        },
        2: { 1: async () => yAxis(coefs.c, "b × sin(a · x) + c", "c"), 2: async () => resolveXValues(coefs, "sin"), 3: async () => resolveYValues(coefs, "sin"), 4: async () => resolveSign(coefs, "sin"), 5: async () => saveEquations(coefs, "sin") },
    })
}

export async function resolveCosine({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a, b, c }
    await resolveFunction(coefs, "cos")

    await runAnalysisMenu(coefs, "cos", ["analyze.options.amplitude", "analyze.options.period"], {
        1: {
            1: async () => amplitude(coefs.b),
            2: async () => showPeriod(coefs.a),
            3: async () => domain(),
            4: async () => range(amplitudeRange(coefs.b, coefs.c), "", "−|b| + c ≤ y ≤ |b| + c"),
            5: async () => xAxis(round(toUnit(Math.acos(negate(coefs.c) / coefs.b)) / coefs.a), "arccos(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
        },
        2: { 1: async () => yAxis(add(coefs.b, coefs.c), "b × cos(a · x) + c", "b + c"), 2: async () => resolveXValues(coefs, "cos"), 3: async () => resolveYValues(coefs, "cos"), 4: async () => resolveSign(coefs, "cos"), 5: async () => saveEquations(coefs, "cos") },
    })
}

export async function resolveTangent({ a = current("a"), b = current("b"), c = current("c") }: NumericCoefficientsFor<Variable> = {}): Promise<void> {
    const coefs: NumericCoefficients = { a, b, c }
    await resolveFunction(coefs, "tan")

    await runAnalysisMenu(coefs, "tan", ["analyze.options.verticalAsymptote", "analyze.options.period"], {
        1: { 1: async () => verticalAsymptote(coefs.a), 2: async () => showPeriod(coefs.a, true), 3: async () => domain(), 4: async () => range(), 5: async () => xAxis(round(toUnit(Math.atan(negate(coefs.c)) / coefs.b) / coefs.a), "arctan(−c / b) / a") },
        2: { 1: async () => yAxis(coefs.c, "b × tan(a · x) + c", "c"), 2: async () => resolveXValues(coefs, "tan"), 3: async () => resolveYValues(coefs, "tan"), 4: async () => resolveSign(coefs, "tan"), 5: async () => saveEquations(coefs, "tan") },
    })
}

async function runAnalysisMenu(coefs: NumericCoefficients, kind: FunctionType, extraOptions: TranslationKey[], pageActions: Record<Raw, Record<Raw, MenuAction>>): Promise<void> {
    const options: List<string> = [...extraOptions, ...BASE_OPTIONS].map(key => tr(key)),
        total = toInteger(Math.max(1, Math.ceil(options.length / 5)))!,
        list: List<string> = [...options, ...Array.from({ length: total * 5 - options.length }, () => "---")]
    let page: Integer = ONE,
        limit = 0

    do {
        page = toInteger(Math.min(Math.max(page, 1), total))!

        const currentPage = page,
            answer = await rangeOptions(
                `=== ${tr("ui.menu")} ===\n${tr("ui.page", { page: currentPage, total })}\n${tr("main.whatWant")}${Array.from({ length: 5 }, (_, index) => `\n${index + 1} = ${list.at(index + 5 * (currentPage - 1))}`).join("")}` +
                    `\n----------------\n6 = ${tr("main.review")} | 7 = ${tr("main.change")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`,
                { commands: true, max: num(9), min: ZERO },
            )

        if (isValidCommand(answer)) {
            State.loop = "on"
            State.keepChoice = "on"
            return
        }

        if (answer === 0 || answer === 7) {
            State.askCoeffs = answer === 7 ? "on" : "off"
            State.loop = "on"
            return
        }

        if (answer === 8 || answer === 9) {
            page = add(page, num(answer === 8 ? -1 : 1))
            continue
        }

        const actions = pageActions[currentPage],
            action = actions?.[answer],
            result = action ? await action() : null
        if (result !== "result" && result != null) return
        if (answer === 6) await resolveFunction(coefs, kind, true)
    } while (!(await hasExceededLimit(limit++)))

    State.loop = "on"
}
