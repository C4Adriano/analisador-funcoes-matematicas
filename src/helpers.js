import { Algebra } from "./algebra.js"
import { Config } from "./config.js"
import { Errors } from "./errors.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

export const Helpers = {
    domain(belongs = "∈ ℝ", explanation = tr("helpers.functionTakeX")) {
        Ui.display(`${tr("helpers.domain")}x ${belongs}`, explanation)
    },

    range(belongs = "∈ ℝ", interval = "", explanation = tr("helpers.functionTakeY")) {
        Ui.display(`${tr("helpers.range")}y ${belongs}`, `${explanation} ${interval}`)
    },

    xAxis(root = 0, explanation = "c", noHave = tr("helpers.noRoots")) {
        const intersection = tr("helpers.intersectionXAxis")

        if (root == 0) {
            // Constante
            if (explanation == "0") {
                // Se c = 0, a função é nula, então existe infinitas raízes
                Ui.display(`${intersection}∃∞ x ∈ ℝ`, "y = 0 ⇒ ∀ x ∈ ℝ")
            } else {
                // Se c ≠ 0, então não existe raiz
                Ui.display(`${intersection}∄! x ∈ ℝ`, "y = c ∧ c ≠ 0 ⇒ ∄ x")
            }
        } else if (isNaN(root)) {
            // Não polinomial
            Ui.display(`${intersection}∄`, noHave)
        } else {
            // Afim
            Ui.display(`${intersection}(${Writing.decimal(root)}, 0)`, `${tr("helpers.rootPoint")}(${explanation}, 0)`)
        }
    },

    yAxis(point = 0, func = "c", explanation = "c") {
        Ui.display(
            tr("helpers.intersectionYAxis") + (point != "∄" ? `(0, ${Writing.decimal(point)})` : "∄"),
            tr("helpers.sinceY") + func + (point != "∄" ? ` ⇒ (0, ${explanation})` : explanation)
        )
    },

    xValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        const x = Ui.input("x = ", "", true),
            message = `${tr("helpers.sinceX") + Writing.decimal(x)}, `

        if (!funcExp && !funcLog && funcTrig == "") {
            // Polinomial
            Ui.display(
                `${message}y = ${Writing.decimal(coefA * x ** 2 + coefB * x + coefC)}`,
                `y = ${coefA != 0 ? "a · x² + " : ""}${coefB != 0 ? "b · x + " : ""}c`
            )
        } else if (funcExp) {
            // Exponencial
            Ui.display(`${message}y = ${Writing.decimal(coefB * coefA ** x + coefC)}`, "y = b × aˣ + c")
        } else if (funcLog) {
            // Logarítmica
            if (x > 0) {
                // O logaritmo só é definido para x > 0
                Ui.display(
                    `${message}y = ${Writing.decimal(coefB * Algebra.log(x, coefA) + coefC)}`,
                    "y = b × logₐ(x) + c"
                )
            } else {
                // Se x ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse x
                Ui.display(`${message}∄! y ∈ ℝ`, "x ≤ 0 ⇒ logₐ(x) ∉ ℝ")
            }
        } else if (funcTrig != "") {
            // Trigonométrica
            Ui.display(
                `${message}y = ${Writing.decimal(
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
                `y = b × ${funcTrig}(x) + c`
            )
        }
    },

    yValues(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        const y = Ui.input("y = ", "", true),
            message = `${tr("helpers.sinceY2") + Writing.decimal(y)}, `

        if (!funcExp && !funcLog && funcTrig == "") {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                if (y == coefC) {
                    // Se y = c, então existe infinitas soluções
                    Ui.display(`${message}∃∞ x ∈ ℝ`, "y = c ⇒ ∀ x ∈ ℝ")
                } else {
                    // Se y ≠ c, então não existe solução
                    Ui.display(`${message}∄! x ∈ ℝ`, "y ≠ c ⇒ ∄ x")
                }
            } else if (coefA == 0 && coefB != 0) {
                // Afim
                Ui.display(`${message}x = ${Writing.decimal(Algebra.division(y - coefC, coefB))}`, "x = (y − c) / b")
            } else if (coefA != 0) {
                // Quadrática
                const delta = Helpers.calcDelta(coefA, coefB, coefC - y)
                Helpers.showDelta(
                    delta[0],
                    `${message}∄! x ∈ ℝ`,
                    `${message}x = ${Writing.decimal(delta[1])}`,
                    `${message}x₁ = ${Writing.decimal(delta[1])}, x₂ = ${Writing.decimal(delta[2])}`,
                    true
                )
            }
        } else if (funcExp || funcLog) {
            // Não polinomial
            const exponent = Algebra.division(y - coefC, coefB, false) // (y − c) / b
            if (funcExp) {
                // Exponencial
                if (exponent > 0) {
                    // Se (y − c) / b > 0, então o logaritmo é definido, então a função tem valor real para esse y
                    Ui.display(
                        `${message}x = ${Writing.decimal(Algebra.division(Algebra.ln(exponent), Algebra.ln(coefA)))}`,
                        "x = ln((y − c) / b) / ln(a)"
                    )
                } else {
                    // Se (y − c) / b ≤ 0, o logaritmo não é definido, então a função não tem valor real para esse y
                    Ui.display(`${message}∄! x ∈ ℝ`, "(y − c) / b ≤ 0 ⇒ ∄ x ∈ ℝ")
                }
            } else if (funcLog) {
                // Logarítmica
                Ui.display(`${message}x = ${Writing.decimal(coefA ** exponent)}`, "x = a⁽⁽ʸ⁻ᶜ⁾⁄ᵇ⁾")
            }
        } else if (funcTrig != "") {
            // Trigonométrica
            Ui.display(tr("helpers.notTrigonometric"), tr("algebra.underConstruction"))
        }
    },

    // eslint-disable-next-line complexity
    sign(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false, funcTrig = "") {
        const operations = { positive: ">", negative: "<" }

        if (!funcExp && !funcLog && funcTrig == "") {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                const operation = coefC > 0 ? "positive" : "negative"
                Ui.display(
                    `ƒ(x) ${coefC != 0 ? operations[operation] : "="} 0, ∀ x ∈ ℝ`,
                    `c ${coefC != 0 ? operations[operation] : "="} 0 ⇒ ƒ(x) ${
                        coefC != 0 ? operations[operation] : "="
                    } 0 ⇒ ∀ x ∈ ℝ`
                )
            } else if (coefA == 0 && coefB != 0) {
                // Afim
                const affineRoot = Helpers.calcRoot(0, coefB, coefC),
                    operation = coefB > 0 ? "positive" : "negative",
                    opposite = operation == "positive" ? "negative" : "positive"
                Ui.display(
                    `ƒ(x) ${operations[operation]} 0 ${tr("helpers.if")} x ${operations[opposite]} ${
                        affineRoot
                    }\nƒ(x) = 0 ${tr("helpers.in")} x = ${affineRoot}\nƒ(x) ${operations[opposite]} 0 ${tr(
                        "helpers.if"
                    )} x ${operations[operation]} ${affineRoot}`,
                    `b ${operations[operation]} 0 ⇒ ƒ(x) ${tr("helpers.increasing")}`
                )
            } else if (coefA != 0) {
                // Quadrática
                const quadRoot = Helpers.calcRoot(coefA, coefB, coefC),
                    operation = coefA > 0 ? "positive" : "negative"
                if (quadRoot[1] > quadRoot[2]) {
                    // Inverte para ficar de menor a maior
                    const temp = quadRoot[2]
                    quadRoot[2] = quadRoot[1]
                    quadRoot[1] = temp
                }
                if (quadRoot[0] < 0) {
                    // Sem raiz
                    Ui.display(
                        `ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`,
                        `a ${operations[operation]} 0 ∧ Δ < 0 ⇒ ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`
                    )
                } else if (quadRoot[0] == 0) {
                    // Uma raiz
                    Ui.display(
                        `ƒ(x) ${operations[operation]} 0, ${tr("helpers.exceptIn")} x = ${Writing.decimal(
                            quadRoot[1]
                        )}`,
                        `a ${operations[operation]} 0 ∧ Δ = 0 ⇒ ƒ(x) ${operations[operation]} 0, x ≠ ${Writing.decimal(
                            quadRoot[1]
                        )}`
                    )
                } else if (coefA < 0) {
                    // Concavidade para baixo
                    Ui.display(
                        `ƒ(x) > 0 ${tr("helpers.if")} ${Writing.decimal(quadRoot[1])} < x < ${Writing.decimal(
                            quadRoot[2]
                        )}\nƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(
                            quadRoot[1]
                        )} ∨ x = ${Writing.decimal(quadRoot[2])}\nƒ(x) < 0 ${tr(
                            "helpers.if"
                        )} x < ${Writing.decimal(quadRoot[1])} ∨ x > ${Writing.decimal(quadRoot[2])}`,
                        "a < 0 ∧ Δ > 0"
                    )
                } else {
                    // Concavidade para cima
                    Ui.display(
                        `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimal(quadRoot[1])} ∨ x > ${Writing.decimal(
                            quadRoot[2]
                        )}\nƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(
                            quadRoot[1]
                        )} ∨ x = ${Writing.decimal(quadRoot[2])}\nƒ(x) < 0 ${tr("helpers.if")} ${Writing.decimal(
                            quadRoot[1]
                        )} < x < ${Writing.decimal(quadRoot[2])}`,
                        "a > 0 ∧ Δ > 0."
                    )
                }
            }
        } else if (funcExp || funcLog) {
            // Não polinomial
            if (funcExp) {
                // Exponencial
                if (Algebra.division(-coefC, coefB, false) > 0) {
                    // Raiz
                    const expRoot = Helpers.calcRoot(coefA, coefB, coefC, true)
                    if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                        // Curva para cima
                        Ui.display(
                            `ƒ(x) > 0 ${tr("helpers.if")} x > ${Writing.decimal(expRoot)}\nƒ(x) = 0 ${tr(
                                "helpers.in"
                            )} x = ${Writing.decimal(expRoot)}\nƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimal(
                                expRoot
                            )}`,
                            "a > 0 ∧ (−c) / b > 0."
                        )
                    } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                        // Curva para baixo
                        Ui.display(
                            `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimal(expRoot)}\nƒ(x) = 0 ${tr(
                                "helpers.in"
                            )} x = ${Writing.decimal(expRoot)}\nƒ(x) < 0 ${tr("helpers.if")} x > ${Writing.decimal(
                                expRoot
                            )}`,
                            "a < 0 ∧ (−c) / b > 0."
                        )
                    }
                } else if (coefB > 0) {
                    // Sem raiz, mas curva para cima
                    Ui.display("ƒ(x) > 0, ∀ x ∈ ℝ", `${tr("helpers.accordingTo")}b > 0 ∧ (−c) / b ≤ 0.`)
                } else {
                    // Sem raiz, mas curva para baixo
                    Ui.display("ƒ(x) < 0, ∀ x ∈ ℝ", `${tr("helpers.accordingTo")}b < 0 ∧ (−c) / b ≤ 0.`)
                }
            } else if (funcLog) {
                // Logarítmica
                const logRoot = Helpers.calcRoot(coefA, coefB, coefC, false, true)
                if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                    // Curva para cima
                    Ui.display(
                        `ƒ(x) > 0 ${tr("helpers.if")} x > ${Writing.decimal(logRoot)}\nƒ(x) = 0 ${tr(
                            "helpers.in"
                        )} x = ${Writing.decimal(logRoot)}\nƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimal(
                            logRoot
                        )}`,
                        "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)"
                    )
                } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                    // Curva para baixo
                    Ui.display(
                        `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimal(logRoot)}\nƒ(x) = 0 ${tr(
                            "helpers.in"
                        )} x = ${Writing.decimal(logRoot)}\nƒ(x) < 0 ${tr("helpers.if")} x > ${Writing.decimal(
                            logRoot
                        )}`,
                        "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)"
                    )
                }
            }
        } else if (funcTrig != "") {
            // Trigonométrica
            Ui.display(tr("helpers.singNotTrigonometric"), tr("algebra.underConstruction"))
        }
    },

    resolveSign({ a = State.globalA, b = State.globalB, c = State.globalC } = {}, funcType = "poly") {
        const coefs = { a, b, c }
        if (funcType == "poly") {
            if (coefs.a == 0 && coefs.b == 0) {
                signConstant(coefs)
            } else if (coefs.a == 0 && coefs.b != 0) {
                signAffine(coefs)
            } else {
                signQuadratic(coefs)
            }
        } else if (funcType == "exp") {
            signExponential(coefs)
        } else if (funcType == "log") {
            signLogarithmic(coefs)
        } else {
            signTrig()
        }
    },

    equations(polinomial = true, coefA = 0, coefB = 0, coefC = 0) {
        if (polinomial) {
            // Polinomial
            if (State.baseFunc.length == 0) {
                // Salvar a primeira função para comparar depois
                State.baseFunc = [coefA, coefB, coefC]
                State.askCoeffs = true
                State.loop = true
                Ui.warning(`ƒ₁(x) ${tr("helpers.saved")}`, tr("helpers.typeSecondFunction"))
                return 0
            }
            // Comparar as duas funções
            Algebra.equations(State.baseFunc, [coefA, coefB, coefC])
            State.baseFunc = []
            return 1
        }
        // Não polinomial
        Ui.warning(tr("helpers.equationsNonPolynomial"), tr("algebra.underConstruction"))
        return 0
    },

    curve(coefA = 0, coefB = 0, polynomial = true) {
        if (!polynomial) {
            if ((coefA < 1 && coefB < 0) || (coefA > 1 && coefB > 0)) {
                Ui.display(tr("helpers.increasingUpper"), "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)")
            } else if ((coefA > 1 && coefB < 0) || (coefA < 1 && coefB > 0)) {
                Ui.display(tr("helpers.decreasing"), "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)")
            }
        } else if (coefB != 0) {
            if (coefB > 0) {
                Ui.display(tr("helpers.increasingUpper"), `${tr("helpers.pointsUpward")}b > 0`)
            } else if (coefB < 0) {
                Ui.display(tr("helpers.decreasing"), `${tr("helpers.pointsDownward")}b < 0`)
            }
        } else if (coefA != 0) {
            if (coefA > 0) {
                Ui.display(tr("helpers.upwardConcavity"), "a > 0")
            } else if (coefA < 0) {
                Ui.display(tr("helpers.downwardConcavity"), "a < 0")
            }
        }
    },

    calcRoot(coefA = 0, coefB = 0, coefC = 0, funcExp = false, funcLog = false) {
        if (!funcExp && !funcLog) {
            if (coefA == 0 && coefB == 0) {
                return NaN
            }
            if (coefA == 0 && coefB != 0) {
                return Algebra.division(-coefC, coefB)
            }
            if (coefA != 0) {
                return Helpers.calcDelta(coefA, coefB, coefC)
            }
        } else {
            const exponent = Algebra.division(-coefC, coefB, false)
            if (funcExp) {
                if (exponent > 0) {
                    return Algebra.division(Algebra.ln(exponent), Algebra.ln(coefA))
                }
                return NaN
            }
            if (funcLog) {
                return Number(Algebra.round(coefA ** exponent))
            }
        }
        return NaN
    },

    showRoot(root = 0, explanation = "c", noHave = "") {
        const intersection = tr("helpers.realRoot")
        if (isNaN(root)) {
            Ui.display(`${intersection}∄! x ∈ ℝ`, noHave)
        } else {
            Ui.display(`${intersection}x = ${Writing.decimal(root)}`, tr("helpers.theRootIs") + explanation)
        }
    },

    calcDelta(coefA = 0, coefB = 0, coefC = 0) {
        const delta = coefB ** 2 - 4 * coefA * coefC
        let x1 = delta >= 0 ? Algebra.division(-coefB + Math.sqrt(delta), 2 * coefA) : NaN
        let x2 = delta > 0 ? Algebra.division(-coefB - Math.sqrt(delta), 2 * coefA) : NaN
        if (delta > 0 && x1 > x2) [x1, x2] = [x2, x1]
        return [delta, x1, x2]
    },

    showDelta(delta = 0, lower = "", equal = "", higher = "", hasY = false) {
        if (delta < 0) {
            Ui.display(lower, `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ < 0 ⇒ x ∉ ℝ`)
        } else if (delta == 0) {
            Ui.display(equal, `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ = 0 ⇒ x = (−b) / (2 · a)`)
        } else {
            Ui.display(higher, `Δ = b² − 4 · a · ${hasY ? "(c − y)" : "c"} ⇒ Δ > 0 ⇒ x₁, x₂ = (−b ± √Δ) / (2 · a)`)
        }
    },

    vertex(coefA = 0, coefB = 0, delta = 0) {
        return [Algebra.division(-coefB, 2 * coefA), Algebra.division(-delta, 4 * coefA)]
    },

    exceededLimit(limit = Config.interactionLimit) {
        const exceeded = limit >= Config.interactionLimit

        // Exibe o erro se estourou o limite
        if (exceeded) {
            Errors.limitExceeded()
        }

        return exceeded
    },

    calcPeriod(coefA = 0, funcTan = false) {
        return Writing.decimal((funcTan ? Math.PI : 2 * Math.PI) / Algebra.absolute(coefA))
    },

    showPeriod(coefA = 0, funcTan = false) {
        if (coefA != 0) {
            Ui.display(
                tr("helpers.period") + Helpers.calcPeriod(coefA, funcTan),
                `${tr("helpers.periodEquals") + (funcTan ? "π" : "2π")} / |a|`
            )
        } else {
            Ui.display(tr("helpers.periodInfinity"), tr("helpers.constantPeriod"))
        }
    },

    amplitude(coefB = 0) {
        Ui.display(`Amplitude: ${Writing.decimal(Algebra.absolute(coefB))}`, "Amplitude = |b|")
    },

    verticalAsymptote(coefA = 0) {
        if (coefA != 0) {
            Ui.display(
                `${tr("helpers.verticalAsymptote")}x = (π / 2 + n · π) /,  n ∈ ℤ`,
                `tan(a · x) ${tr("helpers.undefinedAsymptote")}cos(a · x) = 0, ${tr("helpers.ie")}a · x = π / 2 + n · π`
            )
        } else {
            Ui.display(`${tr("helpers.verticalAsymptote")}∄`, tr("helpers.noAsymptote"))
        }
    },
}

function signTrig() {
    Ui.display(tr("helpers.singNotTrigonometric"), tr("algebra.underConstruction"))
}

function signConstant({ c = State.globalC } = {}) {
    const coefs = { c }
    const operations = { positive: ">", negative: "<" }
    const operation = coefs.c > 0 ? "positive" : "negative"
    const symbol = coefs.c != 0 ? operations[operation] : "="
    Ui.display(`ƒ(x) ${symbol} 0, ∀ x ∈ ℝ`, `c ${symbol} 0 ⇒ ƒ(x) ${symbol} 0 ⇒ ∀ x ∈ ℝ`)
}

function signAffine({ b = State.globalB, c = State.globalC } = {}) {
    const coefs = { b, c }
    const operations = { positive: ">", negative: "<" }
    const affineRoot = Helpers.calcRoot(0, coefs.b, coefs.c)
    const operation = coefs.b > 0 ? "positive" : "negative"
    const opposite = operation == "positive" ? "negative" : "positive"
    Ui.display(
        `ƒ(x) ${operations[operation]} 0 ${tr("helpers.if")} x ${operations[opposite]} ${affineRoot}\n` +
            `ƒ(x) = 0 ${tr("helpers.in")} x = ${affineRoot}\n` +
            `ƒ(x) ${operations[opposite]} 0 ${tr("helpers.if")} x ${operations[operation]} ${affineRoot}`,
        `b ${operations[operation]} 0 ⇒ ƒ(x) ${tr("helpers.increasing")}`
    )
}

function signQuadratic({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c }
    const operations = { positive: ">", negative: "<" }
    const operation = coefs.a > 0 ? "positive" : "negative"
    const quadRoot = Helpers.calcRoot(coefs.a, coefs.b, coefs.c)

    if (quadRoot[1] > quadRoot[2]) {
        // Inverte para ficar de menor a maior
        ;[quadRoot[1], quadRoot[2]] = [quadRoot[2], quadRoot[1]]
    }

    if (quadRoot[0] < 0) {
        Ui.display(
            `ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`,
            `a ${operations[operation]} 0 ∧ Δ < 0 ⇒ ƒ(x) ${operations[operation]} 0, ∀ x ∈ ℝ`
        )
    } else if (quadRoot[0] == 0) {
        Ui.display(
            `ƒ(x) ${operations[operation]} 0, ${tr("helpers.exceptIn")} x = ${Writing.decimal(quadRoot[1])}`,
            `a ${operations[operation]} 0 ∧ Δ = 0 ⇒ ƒ(x) ${operations[operation]} 0, x ≠ ${Writing.decimal(quadRoot[1])}`
        )
    } else if (coefs.a < 0) {
        Ui.display(
            `ƒ(x) > 0 ${tr("helpers.if")} ${Writing.decimal(quadRoot[1])} < x < ${Writing.decimal(quadRoot[2])}\n` +
                `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(quadRoot[1])} ∨ x = ${Writing.decimal(quadRoot[2])}\n` +
                `ƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimal(quadRoot[1])} ∨ x > ${Writing.decimal(quadRoot[2])}`,
            "a < 0 ∧ Δ > 0"
        )
    } else {
        Ui.display(
            `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimal(quadRoot[1])} ∨ x > ${Writing.decimal(quadRoot[2])}\n` +
                `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(quadRoot[1])} ∨ x = ${Writing.decimal(quadRoot[2])}\n` +
                `ƒ(x) < 0 ${tr("helpers.if")} ${Writing.decimal(quadRoot[1])} < x < ${Writing.decimal(quadRoot[2])}`,
            "a > 0 ∧ Δ > 0."
        )
    }
}

function signExponential({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c }
    if (Algebra.division(-coefs.c, coefs.b, false) > 0) {
        const expRoot = Helpers.calcRoot(coefs.a, coefs.b, coefs.c, true)
        if ((coefs.a < 1 && coefs.b < 0) || (coefs.a > 1 && coefs.b > 0)) {
            // Curva para cima
            Ui.display(
                `ƒ(x) > 0 ${tr("helpers.if")} x > ${Writing.decimal(expRoot)}\n` +
                    `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(expRoot)}\n` +
                    `ƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimal(expRoot)}`,
                "a > 0 ∧ (−c) / b > 0."
            )
        } else {
            // Curva para baixo
            Ui.display(
                `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimal(expRoot)}\n` +
                    `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(expRoot)}\n` +
                    `ƒ(x) < 0 ${tr("helpers.if")} x > ${Writing.decimal(expRoot)}`,
                "a < 0 ∧ (−c) / b > 0."
            )
        }
    } else if (coefs.b > 0) {
        Ui.display("ƒ(x) > 0, ∀ x ∈ ℝ", `${tr("helpers.accordingTo")}b > 0 ∧ (−c) / b ≤ 0.`)
    } else {
        Ui.display("ƒ(x) < 0, ∀ x ∈ ℝ", `${tr("helpers.accordingTo")}b < 0 ∧ (−c) / b ≤ 0.`)
    }
}

function signLogarithmic({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c }
    const logRoot = Helpers.calcRoot(coefs.a, coefs.b, coefs.c, false, true)
    if ((coefs.a < 1 && coefs.b < 0) || (coefs.a > 1 && coefs.b > 0)) {
        Ui.display(
            `ƒ(x) > 0 ${tr("helpers.if")} x > ${Writing.decimal(logRoot)}\n` +
                `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(logRoot)}\n` +
                `ƒ(x) < 0 ${tr("helpers.if")} x < ${Writing.decimal(logRoot)}`,
            "(a < 1 ∧ b < 0) ∨ (a > 1 ∧ b > 0)"
        )
    } else {
        Ui.display(
            `ƒ(x) > 0 ${tr("helpers.if")} x < ${Writing.decimal(logRoot)}\n` +
                `ƒ(x) = 0 ${tr("helpers.in")} x = ${Writing.decimal(logRoot)}\n` +
                `ƒ(x) < 0 ${tr("helpers.if")} x > ${Writing.decimal(logRoot)}`,
            "(a > 1 ∧ b < 0) ∨ (a < 1 ∧ b > 0)"
        )
    }
}
