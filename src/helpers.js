import { Algebra } from "./algebra.js"
import { Checks } from "./checks.js"
import { Config } from "./config.js"
import { Errors } from "./errors.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

export const Helpers = {
    domain: (belongs = "∈ ℝ", explanation = tr("helpers.functionTakeX")) =>
        Ui.notifyOptions(`${tr("helpers.domain")} x ${belongs}`, { explanation }),

    range: (belongs = "∈ ℝ", interval = "", explanation = tr("helpers.functionTakeY")) =>
        Ui.notifyOptions(`${tr("helpers.range")} y ${belongs}`, { explanation: `${explanation} ${interval}` }),

    xAxis: (root = 0, explanation = "c", noHave = tr("helpers.noRoots")) => {
        const intersection = tr("helpers.intersectionXAxis")

        if (root == 0)
            explanation == "0"
                ? Ui.notifyOptions(`${intersection} ∃∞ x ∈ ℝ`, { explanation: "y = 0 ⇒ ∀ x ∈ ℝ" })
                : Ui.notifyOptions(`${intersection} ∄! x ∈ ℝ`, { explanation: "y = c ∧ c ≠ 0 ⇒ ∄ x" })
        else if (Checks.isFiniteNumber(root)) Ui.notifyOptions(`${intersection} ∄`, { explanation: noHave })
        else
            Ui.notifyOptions(`${intersection} (${Writing.decimalOptions(root)}, 0)`, {
                explanation: `${tr("helpers.rootPoint")} (${explanation}, 0)`,
            })
    },

    yAxis: (point = 0, func = "c", explanation = "c") =>
        Ui.notifyOptions(
            `${tr("helpers.intersectionYAxis")} ${
                String(point) != "∄" ? `(0, ${Writing.decimalOptions(point)})` : "∄"
            }`,
            {
                explanation: `${tr("helpers.sinceY")} ${func} ${String(point) != "∄" ? `⇒ (0, ${explanation})` : explanation}`,
            }
        ),

    xValues: (coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") =>
        Helpers.resolveXValues(
            { a: coefA, b: coefB, c: coefC },
            funcExp ? "exp" : funcLog ? "log" : funcTrig != "" ? funcTrig : "poly"
        ),
    resolveXValues: (
        { a = Number(State.globalA), b = Number(State.globalB), c = Number(State.globalC) } = {},
        funcType = "poly"
    ) => {
        const coefs = { a, b, c },
            x = Ui.input("x = ", "", true),
            message = `${tr("helpers.sinceX") + Writing.decimalOptions(x)}, `

        if (funcType == "poly")
            Ui.notifyOptions(`${message} y = ${Writing.decimalOptions(coefs.a * x ** 2 + coefs.b * x + coefs.c)}`, {
                explanation: `y = ${coefs.a != 0 ? "a · x² + " : ""}${coefs.b != 0 ? "b · x + " : ""}c`,
            })
        else if (funcType == "exp")
            Ui.notifyOptions(`${message} y = ${Writing.decimalOptions(coefs.b * coefs.a ** x + coefs.c)}`, {
                explanation: "y = b × aˣ + c",
            })
        else if (funcType == "log")
            x > 0
                ? Ui.notifyOptions(
                      `${message} y = ${Writing.decimalOptions(coefs.b * Algebra.logOptions(x, coefs.a) + coefs.c)}`,
                      { explanation: "y = b × logₐ(x) + c" }
                  )
                : Ui.notifyOptions(`${message} ∄! y ∈ ℝ`, { explanation: "x ≤ 0 ⇒ logₐ(x) ∉ ℝ" })
        else
            Ui.notifyOptions(
                `${message} y = ${Writing.decimalOptions(
                    coefs.b *
                        (funcType == "sin"
                            ? Math.sin(x)
                            : funcType == "cos"
                              ? Math.cos(x)
                              : funcType == "tan"
                                ? Math.tan(x)
                                : 0) +
                        coefs.c
                )}`,
                { explanation: `y = b × ${funcType}(x) + c` }
            )
    },

    yValues: (coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") =>
        Helpers.resolveYValues(
            { a: coefA, b: coefB, c: coefC },
            funcExp ? "exp" : funcLog ? "log" : funcTrig != "" ? funcTrig : "poly"
        ),
    resolveYValues: (
        { a = Number(State.globalA), b = Number(State.globalB), c = Number(State.globalC) } = {},
        funcType = "poly"
    ) => {
        const coefs = { a, b, c },
            y = Ui.input("y = ", "", true),
            message = `${tr("helpers.sinceY2") + Writing.decimalOptions(y)},`

        if (funcType == "poly") {
            if (coefs.a == 0 && coefs.b == 0)
                y == coefs.c
                    ? Ui.notifyOptions(`${message} ∃∞ x ∈ ℝ`, { explanation: "y = c ⇒ ∀ x ∈ ℝ" })
                    : Ui.notifyOptions(`${message} ∄! x ∈ ℝ`, { explanation: "y ≠ c ⇒ ∄ x" })
            else if (coefs.a == 0 && coefs.b != 0)
                Ui.notifyOptions(
                    `${message} x = ${Writing.decimalOptions(Algebra.divisionOptions(y - coefs.c, coefs.b))}`,
                    {
                        explanation: "x = (y − c) / b",
                    }
                )
            else if (coefs.a != 0) {
                const delta = Helpers.calcDelta(coefs.a, coefs.b, coefs.c - y)
                Helpers.showDelta(
                    delta[0],
                    `${message} ∄! x ∈ ℝ`,
                    `${message} x = ${Writing.decimalOptions(delta[1])}`,
                    `${message} x₁ = ${Writing.decimalOptions(delta[1])}, x₂ = ${Writing.decimalOptions(delta[2])}`,
                    true
                )
            }
        } else if (funcType == "exp" || funcType == "log") {
            const exponent = Algebra.divisionOptions(y - coefs.c, coefs.b, { round: false })
            funcType == "exp"
                ? exponent > 0
                    ? Ui.notifyOptions(
                          `${message} x = ${Writing.decimalOptions(Algebra.divisionOptions(Algebra.ln(exponent), Algebra.ln(coefs.a)))}`,
                          { explanation: "x = ln((y − c) / b) / ln(a)" }
                      )
                    : Ui.notifyOptions(`${message} ∄! x ∈ ℝ`, { explanation: "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ" })
                : Ui.notifyOptions(`${message} x = ${Writing.decimalOptions(coefs.a ** exponent)}`, {
                      explanation: "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾",
                  })
        } else Ui.notifyOptions(tr("helpers.notTrigonometric"), { explanation: tr("algebra.underConstruction") })
    },

    sign: (coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") =>
        Helpers.resolveSign(
            { a: coefA, b: coefB, c: coefC },
            funcExp ? "exp" : funcLog ? "log" : funcTrig != "" ? funcTrig : "poly"
        ),
    resolveSign: (
        { a = Number(State.globalA), b = Number(State.globalB), c = Number(State.globalC) } = {},
        funcType = "poly"
    ) => {
        const coefs = { a, b, c }
        if (funcType == "poly") {
            if (coefs.a == 0 && coefs.b == 0) signConstant(coefs)
            else if (coefs.a == 0 && coefs.b != 0) signAffine(coefs)
            else signQuadratic(coefs)
        } else if (funcType == "exp") signExponential(coefs)
        else if (funcType == "log") signLogarithmic(coefs)
        else signTrig()
    },

    equations: (polynomial = true, coefA = 0, coefB = 0, coefC = 0) => {
        if (!polynomial) {
            Ui.notifyOptions(tr("helpers.equationsNonPolynomial"), {
                explanation: tr("algebra.underConstruction"),
                type: "warning",
            })
            return 0
        }

        const coefs = { a: coefA, b: coefB, c: coefC }

        if (State.baseFunc == null) {
            State.baseFunc = coefs
            State.askCoeffs = true
            State.loop = true
            Ui.notifyOptions(`ƒ₁(x) ${tr("helpers.saved")}`, {
                explanation: tr("helpers.typeSecondFunction"),
                type: "warning",
            })
            return 0
        }

        Algebra.resolveEquations(State.baseFunc, coefs)
        State.baseFunc = null
        return 1
    },

    curve: (coefA = 0, coefB = 0, polynomial = true) => {
        if (!polynomial) {
            if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0))
                Ui.notifyOptions(tr("helpers.increasingUpper"), { explanation: "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" })
            else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0))
                Ui.notifyOptions(tr("helpers.decreasing"), { explanation: "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)" })
        } else if (coefB != 0) {
            coefB > 0
                ? Ui.notifyOptions(tr("helpers.increasingUpper"), { explanation: `${tr("helpers.pointsUpward")}b > 0` })
                : Ui.notifyOptions(tr("helpers.decreasing"), { explanation: `${tr("helpers.pointsDownward")}b < 0` })
        } else if (coefA != 0) {
            coefA > 0
                ? Ui.notifyOptions(tr("helpers.upwardConcavity"), { explanation: "a > 0" })
                : Ui.notifyOptions(tr("helpers.downwardConcavity"), { explanation: "a < 0" })
        }
    },

    calcRoot: (coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) => {
        if (!funcExp && !funcLog) {
            if (coefA == 0 && coefB == 0) return NaN
            return coefA == 0 ? Algebra.divisionOptions(-coefC, coefB) : Helpers.calcDelta(coefA, coefB, coefC)
        }

        const exponent = Algebra.divisionOptions(-coefC, coefB, { round: false })
        if (funcExp)
            return exponent > 0 ? Algebra.divisionOptions(Algebra.lnOptions(exponent), Algebra.lnOptions(coefA)) : NaN
        if (funcLog) return Algebra.round(coefA ** exponent)

        return NaN
    },

    showRoot: (root = 0, explanation = "c", noHave = "") => {
        const intersection = tr("helpers.realRoot")
        Checks.isFiniteNumber(root)
            ? Ui.notifyOptions(`${intersection} ∄! x ∈ ℝ`, { explanation: noHave })
            : Ui.notifyOptions(`${intersection} x = ${Writing.decimalOptions(root)}`, {
                  explanation: tr("helpers.theRootIs") + explanation,
              })
    },

    /** @returns {[Numeric, Numeric, Numeric]} */
    calcDelta: (coefA = 0, coefB = 0, coefC = 0) => {
        const delta = coefB ** 2 - 4 * coefA * coefC
        let x1 = delta >= 0 ? Algebra.divisionOptions(-coefB + Math.sqrt(delta), 2 * coefA) : NaN,
            x2 = delta > 0 ? Algebra.divisionOptions(-coefB - Math.sqrt(delta), 2 * coefA) : NaN
        if (delta > 0 && x1 > x2) [x1, x2] = [x2, x1]
        return [delta, x1, x2]
    },

    showDelta: (delta = 0, lower = "", equal = "", higher = "", hasY = false) => {
        if (delta < 0)
            Ui.notifyOptions(lower, { explanation: `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ < 0 ⇒ x ∉ ℝ` })
        else if (delta == 0)
            Ui.notifyOptions(equal, {
                explanation: `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ = 0 ⇒ x = (−b) / (2 · a)`,
            })
        else
            Ui.notifyOptions(higher, {
                explanation: `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ > 0 ⇒ x₁, x₂ = (−b ± √Δ) / (2 · a)`,
            })
    },

    vertex: (coefA = 0, coefB = 0, delta = 0) => [
        Algebra.divisionOptions(-coefB, 2 * coefA),
        Algebra.divisionOptions(-delta, 4 * coefA),
    ],

    exceededLimit: (limit = Config.iterationLimit) => {
        const exceeded = limit >= Config.iterationLimit

        if (exceeded) Errors.limitExceeded()

        return exceeded
    },

    calcPeriod: (coefA = 0, funcTan = false) =>
        Writing.decimalOptions((funcTan ? Math.PI : 2 * Math.PI) / Algebra.absoluteOptions(coefA)),

    showPeriod: (coefA = 0, funcTan = false) => {
        if (coefA != 0)
            Ui.notifyOptions(tr("helpers.period") + Helpers.calcPeriod(coefA, funcTan), {
                explanation: `${tr("helpers.periodEquals") + (funcTan ? "π" : "2π")} / |a|`,
            })
        else Ui.notifyOptions(tr("helpers.periodInfinity"), { explanation: tr("helpers.constantPeriod") })
    },

    amplitude: (coefB = 0) =>
        Ui.notifyOptions(`Amplitude: ${Writing.decimalOptions(Algebra.absoluteOptions(coefB))}`, {
            explanation: "Amplitude = |b|",
        }),

    verticalAsymptote: (coefA = 0) => {
        coefA != 0
            ? Ui.notifyOptions(`${tr("helpers.verticalAsymptote")} x = (π / 2 + n · π) / a, n ∈ ℤ`, {
                  explanation: `tan(a · x) ${tr("helpers.undefinedAsymptote")} cos(a · x) = 0, ${tr("helpers.ie")} a · x = π / 2 + n · π`,
              })
            : Ui.notifyOptions(`${tr("helpers.verticalAsymptote")} ∄`, { explanation: tr("helpers.noAsymptote") })
    },
}

function signTrig() {
    Ui.notifyOptions(tr("helpers.singNotTrigonometric"), {
        explanation: tr("algebra.underConstruction"),
        type: "warning",
    })
}

function signConstant({ c = Number(State.globalC) } = {}) {
    const coefs = { c },
        operations = { positive: ">", negative: "<" },
        operation = coefs.c > 0 ? "positive" : "negative",
        symbol = coefs.c != 0 ? operations[operation] : "="
    Ui.notifyOptions(`ƒ(x) ${symbol} 0, ∀ x ∈ ℝ`, { explanation: `c ${symbol} 0 ⇒ ƒ(x) ${symbol} 0 ⇒ ∀ x ∈ ℝ` })
}

function signAffine({ b = Number(State.globalB), c = Number(State.globalC) } = {}) {
    const coefs = { b, c },
        operations = { positive: ">", negative: "<" },
        affineRoot = Helpers.calcRoot(0, coefs.b, coefs.c),
        operation = coefs.b > 0 ? "positive" : "negative",
        opposite = operation == "positive" ? "negative" : "positive"
    Ui.notifyOptions(
        `ƒ(x) ${operations[operation]} 0 ${tr("helpers.if")} x ${operations[opposite]} ${affineRoot}\n` +
            `ƒ(x) = 0 ${tr("helpers.in")} x = ${affineRoot}\n` +
            `ƒ(x) ${operations[opposite]} 0 ${tr("helpers.if")} x ${operations[operation]} ${affineRoot}`,
        { explanation: `b ${operations[operation]} 0 ⇒ ƒ(x) ${tr("helpers.increasing")}` }
    )
}

function signQuadratic({ a = Number(State.globalA), b = Number(State.globalB), c = Number(State.globalC) } = {}) {
    const coefs = { a, b, c },
        operations = { positive: ">", negative: "<" },
        operation = coefs.a > 0 ? "positive" : "negative",
        quadRoot = Helpers.calcDelta(coefs.a, coefs.b, coefs.c)

    if (quadRoot[1] > quadRoot[2]) [quadRoot[1], quadRoot[2]] = [quadRoot[2], quadRoot[1]]

    if (quadRoot[0] < 0)
        Ui.notifyOptions(`ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`, {
            explanation: `a ${operations[operation]} 0 ∧ Δ < 0 ⇒ ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`,
        })
    else if (quadRoot[0] == 0)
        Ui.notifyOptions(
            `ƒ(x) ${operations[operation]} 0, ${tr("helpers.exceptIn")} x = ${Writing.decimalOptions(quadRoot[1])}`,
            {
                explanation: `a ${operations[operation]} 0 ∧ Δ = 0 ⇒ ƒ(x) ${operations[operation]} 0, x ≠ ${Writing.decimalOptions(quadRoot[1])}`,
            }
        )
    else if (coefs.a < 0)
        Ui.notifyOptions(
            `ƒ(x) > 0 ${tr("helpers.if")} ${Writing.decimalOptions(quadRoot[1])} < x < ${Writing.decimalOptions(quadRoot[2])}\n` +
                `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimalOptions(quadRoot[1])} ∨ x = ${Writing.decimalOptions(quadRoot[2])}\n` +
                `ƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimalOptions(quadRoot[1])} ∨ x > ${Writing.decimalOptions(quadRoot[2])}`,
            { explanation: "a < 0 ∧ Δ > 0" }
        )
    else
        Ui.notifyOptions(
            `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimalOptions(quadRoot[1])} ∨ x > ${Writing.decimalOptions(quadRoot[2])}\n` +
                `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimalOptions(quadRoot[1])} ∨ x = ${Writing.decimalOptions(quadRoot[2])}\n` +
                `ƒ(x) < 0 ${tr("helpers.if")} ${Writing.decimalOptions(quadRoot[1])} < x < ${Writing.decimalOptions(quadRoot[2])}`,
            { explanation: "a > 0 ∧ Δ > 0." }
        )
}

function signExponential({ a = Number(State.globalA), b = Number(State.globalB), c = Number(State.globalC) } = {}) {
    const coefs = { a, b, c }
    if (Algebra.divisionOptions(-coefs.c, coefs.b, { round: false }) > 0) {
        const expRoot = Number(Helpers.calcRoot(coefs.a, coefs.b, coefs.c, true))
        ;(coefs.a < 1 && coefs.b < 0) || (coefs.a > 1 && coefs.b > 0)
            ? Ui.notifyOptions(
                  `ƒ(x) > 0 ${tr("helpers.if")} x > ${Writing.decimalOptions(expRoot)}\n` +
                      `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimalOptions(expRoot)}\n` +
                      `ƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimalOptions(expRoot)}`,
                  { explanation: "a > 0 ∧ (−c) / b > 0." }
              )
            : Ui.notifyOptions(
                  `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimalOptions(expRoot)}\n` +
                      `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimalOptions(expRoot)}\n` +
                      `ƒ(x) < 0 ${tr("helpers.if")} x > ${Writing.decimalOptions(expRoot)}`,
                  { explanation: "a < 0 ∧ (−c) / b > 0." }
              )
    } else if (coefs.b > 0)
        Ui.notifyOptions("ƒ(x) > 0, ∀ x ∈ ℝ", { explanation: `${tr("helpers.accordingTo")} b > 0 ∧ (−c) / b ≤ 0.` })
    else Ui.notifyOptions("ƒ(x) < 0, ∀ x ∈ ℝ", { explanation: `${tr("helpers.accordingTo")} b < 0 ∧ (−c) / b ≤ 0.` })
}

function signLogarithmic({ a = Number(State.globalA), b = Number(State.globalB), c = Number(State.globalC) } = {}) {
    const coefs = { a, b, c },
        logRoot = Number(Helpers.calcRoot(coefs.a, coefs.b, coefs.c, false, true))
    ;(coefs.a < 1 && coefs.b < 0) || (coefs.a > 1 && coefs.b > 0)
        ? Ui.notifyOptions(
              `ƒ(x) > 0 ${tr("helpers.if")} x > ${Writing.decimalOptions(logRoot)}\n` +
                  `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimalOptions(logRoot)}\n` +
                  `ƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimalOptions(logRoot)}`,
              { explanation: "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)" }
          )
        : Ui.notifyOptions(
              `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimalOptions(logRoot)}\n` +
                  `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimalOptions(logRoot)}\n` +
                  `ƒ(x) < 0 ${tr("helpers.if")} x > ${Writing.decimalOptions(logRoot)}`,
              { explanation: "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)" }
          )
}
