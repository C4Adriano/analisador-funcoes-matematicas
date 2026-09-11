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
        Ui.notifyOptions(`${tr("helpers.domain")}x ${belongs}`, { explanation }),

    range: (belongs = "∈ ℝ", interval = "", explanation = tr("helpers.functionTakeY")) =>
        Ui.notifyOptions(`${tr("helpers.range")}y ${belongs}`, { explanation: `${explanation} ${interval}` }),

    xAxis: (root = 0, explanation = "c", noHave = tr("helpers.noRoots")) => {
        const intersection = tr("helpers.intersectionXAxis")

        if (root == 0)
            explanation == "0"
                ? Ui.notifyOptions(`${intersection} ∃∞ x ∈ ℝ`, { explanation: "y = 0 ⇒ ∀ x ∈ ℝ" })
                : Ui.notifyOptions(`${intersection} ∄! x ∈ ℝ`, { explanation: "y = c ∧ c ≠ 0 ⇒ ∄ x" })
        else if (Checks.isFiniteNumber(root)) Ui.notifyOptions(`${intersection} ∄`, { explanation: noHave })
        else
            Ui.notifyOptions(`${intersection}(${Writing.decimalOptions(root)}, 0)`, {
                explanation: `${tr("helpers.rootPoint")}(${explanation}, 0)`,
            })
    },

    yAxis: (point = 0, func = "c", explanation = "c") =>
        Ui.notifyOptions(
            tr("helpers.intersectionYAxis") + (point != "∄" ? `(0, ${Writing.decimalOptions(point)})` : "∄"),
            {
                explanation: tr("helpers.sinceY") + func + (point != "∄" ? ` ⇒ (0, ${explanation})` : explanation),
            }
        ),

    xValues: (coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") => {
        const x = Ui.input("x = ", "", true),
            message = `${tr("helpers.sinceX") + Writing.decimalOptions(x)}, `

        if (!funcExp && !funcLog && funcTrig == "")
            Ui.notifyOptions(`${message} y = ${Writing.decimalOptions(coefA * x ** 2 + coefB * x + coefC)}`, {
                explanation: `y = ${coefA != 0 ? "a · x² + " : ""}${coefB != 0 ? "b · x + " : ""}c`,
            })
        else if (funcExp)
            Ui.notifyOptions(`${message} y = ${Writing.decimalOptions(coefB * coefA ** x + coefC)}`, {
                explanation: "y = b × aˣ + c",
            })
        else if (funcLog)
            x > 0
                ? Ui.notifyOptions(
                      `${message} y = ${Writing.decimalOptions(coefB * Algebra.logOptions(x, coefA) + coefC)}`,
                      {
                          explanation: "y = b × logₐ(x) + c",
                      }
                  )
                : Ui.notifyOptions(`${message} ∄! y ∈ ℝ`, { explanation: "x ≤ 0 ⇒ logₐ(x) ∉ ℝ" })
        else if (funcTrig != "")
            Ui.notifyOptions(
                `${message} y = ${Writing.decimalOptions(
                    coefB *
                        (funcTrig == "sin"
                            ? Math.sin(x)
                            : funcTrig == "cos"
                              ? Math.cos(x)
                              : funcTrig == "tan"
                                ? Math.tan(x)
                                : 0) +
                        coefC
                )}`,
                { explanation: `y = b × ${funcTrig}(x) + c` }
            )
    },

    yValues: (coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") => {
        const y = Ui.input("y = ", "", true),
            message = `${tr("helpers.sinceY2") + Writing.decimalOptions(y)},`

        if (!funcExp && !funcLog && funcTrig == "") {
            if (coefA == 0 && coefB == 0)
                y == coefC
                    ? Ui.notifyOptions(`${message} ∃∞ x ∈ ℝ`, { explanation: "y = c ⇒ ∀ x ∈ ℝ" })
                    : Ui.notifyOptions(`${message} ∄! x ∈ ℝ`, { explanation: "y ≠ c ⇒ ∄ x" })
            else if (coefA == 0 && coefB != 0)
                Ui.notifyOptions(
                    `${message} x = ${Writing.decimalOptions(Algebra.divisionOptions(y - coefC, coefB))}`,
                    {
                        explanation: "x = (y − c) / b",
                    }
                )
            else if (coefA != 0) {
                const delta = Helpers.calcDelta(coefA, coefB, coefC - y)
                Helpers.showDelta(
                    delta[0],
                    `${message} ∄! x ∈ ℝ`,
                    `${message} x = ${Writing.decimalOptions(delta[1])}`,
                    `${message} x₁ = ${Writing.decimalOptions(delta[1])}, x₂ = ${Writing.decimalOptions(delta[2])}`,
                    true
                )
            }
        } else if (funcExp || funcLog) {
            const exponent = Algebra.divisionOptions(y - coefC, coefB, { round: false })
            funcExp
                ? exponent > 0
                    ? Ui.notifyOptions(
                          `${message} x = ${Writing.decimalOptions(Algebra.divisionOptions(Algebra.ln(exponent), Algebra.ln(coefA)))}`,
                          { explanation: "x = ln((y − c) / b) / ln(a)" }
                      )
                    : Ui.notifyOptions(`${message} ∄! x ∈ ℝ`, { explanation: "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ" })
                : Ui.notifyOptions(`${message} x = ${Writing.decimalOptions(coefA ** exponent)}`, {
                      explanation: "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾",
                  })
        } else if (funcTrig != "")
            Ui.notifyOptions(tr("helpers.notTrigonometric"), { explanation: tr("algebra.underConstruction") })
    },

    sign: (coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") =>
        Helpers.resolveSign(
            { coefA, coefB, coefC },
            funcExp ? "exp" : funcLog ? "log" : funcTrig != "" ? funcTrig : "poly"
        ),

    resolveSign: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}, funcType = "poly") => {
        const coefs = { a, b, c }
        if (funcType == "poly") {
            if (coefs.a == 0 && coefs.b == 0) signConstant(coefs)
            else if (coefs.a == 0 && coefs.b != 0) signAffine(coefs)
            else signQuadratic(coefs)
        } else if (funcType == "exp") signExponential(coefs)
        else if (funcType == "log") signLogarithmic(coefs)
        else signTrig()
    },

    equations: (polinomial = true, coefA = 0, coefB = 0, coefC = 0) => {
        if (polinomial) {
            if (State.baseFunc.length == 0) {
                State.baseFunc = [coefA, coefB, coefC]
                State.askCoeffs = true
                State.loop = true
                Ui.notifyOptions(`ƒ₁(x) ${tr("helpers.saved")}`, {
                    explanation: tr("helpers.typeSecondFunction"),
                    type: "warning",
                })
                return 0
            }
            Algebra.equations(State.baseFunc, [coefA, coefB, coefC])
            State.baseFunc = []
            return 1
        }
        Ui.notifyOptions(tr("helpers.equationsNonPolynomial"), {
            explanation: tr("algebra.underConstruction"),
            type: "warning",
        })
        return 0
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
        if (funcExp) return exponent > 0 ? Algebra.divisionOptions(Algebra.ln(exponent), Algebra.ln(coefA)) : NaN
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
            ? Ui.notifyOptions(`${tr("helpers.verticalAsymptote")}x = (π / 2 + n · π) /,  n ∈ ℤ`, {
                  explanation: `tan(a · x) ${tr("helpers.undefinedAsymptote")}cos(a · x) = 0, ${tr("helpers.ie")}a · x = π / 2 + n · π`,
              })
            : Ui.notifyOptions(`${tr("helpers.verticalAsymptote")}∄`, { explanation: tr("helpers.noAsymptote") })
    },
}

function signTrig() {
    Ui.notifyOptions(tr("helpers.singNotTrigonometric"), {
        explanation: tr("algebra.underConstruction"),
        type: "warning",
    })
}

function signConstant({ c = State.globalC } = {}) {
    const coefs = { c },
        operations = { positive: ">", negative: "<" },
        operation = coefs.c > 0 ? "positive" : "negative",
        symbol = coefs.c != 0 ? operations[operation] : "="
    Ui.notifyOptions(`ƒ(x) ${symbol} 0, ∀ x ∈ ℝ`, { explanation: `c ${symbol} 0 ⇒ ƒ(x) ${symbol} 0 ⇒ ∀ x ∈ ℝ` })
}

function signAffine({ b = State.globalB, c = State.globalC } = {}) {
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

function signQuadratic({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c },
        operations = { positive: ">", negative: "<" },
        operation = coefs.a > 0 ? "positive" : "negative",
        quadRoot = Helpers.calcRoot(coefs.a, coefs.b, coefs.c)

    if (quadRoot[1] > quadRoot[2]) [quadRoot[1], quadRoot[2]] = [quadRoot[2], quadRoot[1]]

    if (quadRoot[0] < 0)
        Ui.notifyOptions(`ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`, {
            explanation: `a ${operations[operation]} 0 ∧ Δ < 0 ⇒ ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`,
        })
    else if (quadRoot[0] == 0)
        Ui.notifyOptions(
            `ƒ(x) ${operations[operation]} 0, ${tr("helpers.exceptIn")} x = ${Writing.decimalOptions(quadRoot[1])}`,
            {
                explanation: `${operations[operation]} 0 ∧ Δ = 0 ⇒ ƒ(x) ${operations[operation]} 0, x ≠ ${Writing.decimalOptions(quadRoot[1])}`,
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

function signExponential({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c }
    if (Algebra.divisionOptions(-coefs.c, coefs.b, { round: false }) > 0) {
        const expRoot = Helpers.calcRoot(coefs.a, coefs.b, coefs.c, true)
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
        Ui.notifyOptions("ƒ(x) > 0, ∀ x ∈ ℝ", { explanation: `${tr("helpers.accordingTo")}b > 0 ∧ (−c) / b ≤ 0.` })
    else Ui.notifyOptions("ƒ(x) < 0, ∀ x ∈ ℝ", { explanation: `${tr("helpers.accordingTo")}b < 0 ∧ (−c) / b ≤ 0.` })
}

function signLogarithmic({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c },
        logRoot = Helpers.calcRoot(coefs.a, coefs.b, coefs.c, false, true)
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
