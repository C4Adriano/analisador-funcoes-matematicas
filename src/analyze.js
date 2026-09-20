import { Algebra } from "./algebra.js"
import { Checks } from "./checks.js"
import { Helpers } from "./helpers.js"
import { tr, trArr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

/**
 * Opções Base
 * @type {import("./i18n.js").TranslationKey[]}
 */
const BASE_OPTIONS = [
        "analyze.options.domain",
        "analyze.options.range",
        "analyze.options.xIntersection",
        "analyze.options.yIntersection",
        "analyze.options.xValues",
        "analyze.options.yValues",
        "analyze.options.signAnalysis",
        "analyze.options.functionEquations",
    ],
    runAnalysisMenu = (coefs, funcType, extraOptions, pageActions) => {
        /** @type {Numeric | CommandsNames} */ let option,
            [page, limit] = [1, 0]

        do {
            ;[option, page] = Ui.menu(trArr([...extraOptions, ...BASE_OPTIONS]), page)
            if (Checks.isValidCommand(option)) [option, page] = [0, 1]

            if (Checks.isFiniteNumber(option)) {
                const result = pageActions[page]?.[option]?.()
                if (Checks.isFiniteNumber(result)) option = result
            }

            if (option === 6) Ui.resolveFunction(coefs, funcType, true)
            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option !== 0)
    }

export const Analyze = {
    resolveConstant: ({ c = State.current.numericC } = {}) => {
        const coefs = { a: 0, b: 0, c }
        Ui.resolveFunction(coefs)

        runAnalysisMenu(coefs, "poly", [], {
            1: {
                1: () => Helpers.domain(),
                2: () => Helpers.range(`= ${Writing.decimalOptions(coefs.c)}`, "", tr("analyze.constantValue")),
                3: () => Helpers.xAxis(0, String(coefs.c)),
                4: () => Helpers.yAxis(coefs.c, "c", "c"),
                5: () => Helpers.resolveXValues(coefs),
            },
            2: {
                1: () => Helpers.resolveYValues(coefs),
                2: () => Helpers.resolveSign(coefs),
                3: () => Helpers.equations(true, 0, 0, coefs.c),
            },
        })
    },

    resolveAffine: ({ b = State.current.numericB, c = State.current.numericC } = {}) => {
        const coefs = { a: 0, b, c }
        Ui.resolveFunction(coefs)

        const root = Helpers.calcRoot(0, coefs.b, coefs.c)

        runAnalysisMenu(coefs, "poly", ["analyze.options.slope", "analyze.options.root"], {
            1: {
                1: () => Helpers.curve(0, coefs.b),
                2: () => Helpers.showRoot(root, "(−c) / b"),
                3: () => Helpers.domain(),
                4: () => Helpers.range(),
                5: () => Helpers.xAxis(root, "(−c) / b"),
            },
            2: {
                1: () => Helpers.yAxis(coefs.c, "bx + c", "c"),
                2: () => Helpers.resolveXValues(coefs),
                3: () => Helpers.resolveYValues(coefs),
                4: () => Helpers.resolveSign(coefs),
                5: () => Helpers.equations(true, 0, coefs.b, coefs.c),
            },
        })
    },

    resolveQuadratic: ({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs)

        const delta = Helpers.calcDelta(coefs.a, coefs.b, coefs.c),
            vertex = Helpers.vertex(coefs.a, coefs.b, delta[0])

        runAnalysisMenu(
            coefs,
            "poly",
            ["analyze.options.concavity", "analyze.options.root", "analyze.options.vertex"],
            {
                1: {
                    1: () => Helpers.curve(coefs.a),
                    2: () =>
                        Helpers.showDelta(
                            delta[0],
                            tr("analyze.noRoots"),
                            tr("analyze.oneRoot", { x: Writing.decimalOptions(delta[1]) }),
                            tr("analyze.twoRoots", {
                                x1: Writing.decimalOptions(delta[1]),
                                x2: Writing.decimalOptions(delta[2]),
                            })
                        ),
                    3: () =>
                        Ui.notifyOptions(
                            tr("analyze.vertexPoint", {
                                p1: Writing.decimalOptions(vertex[0]),
                                p2: Writing.decimalOptions(vertex[1]),
                            }),
                            { explanation: tr("analyze.vertexExp") }
                        ),
                    4: () => Helpers.domain(),
                    5: () =>
                        coefs.a > 0
                            ? Helpers.range(
                                  `∈ [${Writing.decimalOptions(vertex[1])}, ∞)`,
                                  tr("analyze.betweenVertexInfinity")
                              )
                            : Helpers.range(
                                  `∈ (-∞, ${Writing.decimalOptions(vertex[1])} ]`,
                                  tr("analyze.betweenInfinityVertex")
                              ),
                },
                2: {
                    1: () =>
                        Helpers.showDelta(
                            delta[0],
                            tr("analyze.noIntersectionXAxis"),
                            tr("analyze.oneIntersectionXAxis", { p: Writing.decimalOptions(delta[1]) }),
                            tr("analyze.twoIntersectionsXAxis", {
                                p1: Writing.decimalOptions(delta[1]),
                                p2: Writing.decimalOptions(delta[2]),
                            })
                        ),
                    2: () => Helpers.yAxis(coefs.c, "ax² + bx + c", "c"),
                    3: () => Helpers.resolveXValues(coefs),
                    4: () => Helpers.resolveYValues(coefs),
                    5: () => Helpers.resolveSign(coefs),
                },
                3: { 1: () => Helpers.equations(true, coefs.a, coefs.b, coefs.c) },
            }
        )
    },

    resolveExponential: ({
        a = State.current.numericA,
        b = State.current.numericB,
        c = State.current.numericC,
    } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "exp")

        const root = Helpers.calcRoot(coefs.a, coefs.b, coefs.c, true)

        runAnalysisMenu(
            coefs,
            "exp",
            ["analyze.options.curve", "analyze.options.root", "analyze.options.horizontalAsymptote"],
            {
                1: {
                    1: () => Helpers.curve(coefs.a, coefs.b, false),
                    2: () => Helpers.showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"),
                    3: () =>
                        Ui.notifyOptions(
                            tr("analyze.options.horizontalAsymptote", { y: Writing.decimalOptions(coefs.c) }),
                            { explanation: "y = c" }
                        ),
                    4: () => Helpers.domain(),
                    5: () => {
                        if (coefs.b > 0)
                            Helpers.range(`∈ (${Writing.decimalOptions(coefs.c)}, ∞)`, tr("analyze.betweenCInfinity"))
                        else Helpers.range(`∈ (-∞, ${Writing.decimalOptions(coefs.c)})`, tr("analyze.betweenInfinityC"))
                    },
                },
                2: {
                    1: () => Helpers.xAxis(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"),
                    2: () => Helpers.yAxis(coefs.b + coefs.c, "b × aˣ + c", "b + c"),
                    3: () => Helpers.resolveXValues(coefs, "exp"),
                    4: () => Helpers.resolveYValues(coefs, "exp"),
                    5: () => Helpers.resolveSign(coefs, "exp"),
                },
                3: { 1: () => Helpers.equations(false) },
            }
        )
    },

    resolveLogarithmic: ({
        a = State.current.numericA,
        b = State.current.numericB,
        c = State.current.numericC,
    } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "log")

        const root = Algebra.round(coefs.a ** Algebra.divisionOptions(-coefs.c, coefs.b, { round: false }))

        runAnalysisMenu(coefs, "log", ["analyze.options.curve", "analyze.options.root"], {
            1: {
                1: () => Helpers.curve(coefs.a, coefs.b, false),
                2: () => Helpers.showRoot(root, "a⁽⁻ᶜ⁄ᵇ⁾"),
                3: () => Helpers.domain("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ"),
                4: () => Helpers.range(),
                5: () => Helpers.xAxis(root, "a⁽⁻ᶜ⁄ᵇ⁾"),
            },
            2: {
                1: () => Helpers.yAxis("∄", "b × logₐ(x) + c", "x = 0 ⇒ logₐ(x) ∉ ℝ"),
                2: () => Helpers.resolveXValues(coefs, "log"),
                3: () => Helpers.resolveYValues(coefs, "log"),
                4: () => Helpers.resolveSign(coefs, "log"),
                5: () => Helpers.equations(false),
            },
        })
    },

    resolveSine: ({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "sin")

        const root = Algebra.round(Math.asin(Algebra.divisionOptions(-coefs.c, coefs.b)) / coefs.a)

        runAnalysisMenu(coefs, "sin", ["analyze.options.amplitude", "analyze.options.period"], {
            1: {
                1: () => Helpers.amplitude(coefs.b),
                2: () => Helpers.showPeriod(coefs.a),
                3: () => Helpers.domain(),
                4: () => {
                    const modB = Writing.decimalOptions(Algebra.absoluteOptions(coefs.b) + coefs.c)
                    Helpers.range(`∈ [${-modB}, ${modB}]`, "", "−|b| + c ≤ y ≤ |b| + c")
                },
                5: () => Helpers.xAxis(root, "arcsin(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
            },
            2: {
                1: () => Helpers.yAxis(coefs.c, "b × sin(a · x) + c", "c"),
                2: () => Helpers.resolveXValues(coefs, "sin"),
                3: () => Helpers.resolveYValues(coefs, "sin"),
                4: () => Helpers.resolveSign(coefs, "sin"),
                5: () => Helpers.equations(false),
            },
        })
    },

    resolveCosine: ({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "cos")

        const root = Algebra.round(Math.acos(Algebra.divisionOptions(-coefs.c, coefs.b)) / coefs.a)

        runAnalysisMenu(coefs, "cos", ["analyze.options.amplitude", "analyze.options.period"], {
            1: {
                1: () => Helpers.amplitude(coefs.b),
                2: () => Helpers.showPeriod(coefs.a),
                3: () => Helpers.domain(),
                4: () =>
                    Helpers.range(
                        `∈ [${Writing.decimalOptions(-Algebra.absoluteOptions(coefs.b) + coefs.c)}, ${Writing.decimalOptions(Algebra.absoluteOptions(coefs.b) + coefs.c)}]`,
                        "",
                        "−|b| + c ≤ y ≤ |b| + c"
                    ),
                5: () => Helpers.xAxis(root, "arccos(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
            },
            2: {
                1: () => Helpers.yAxis(coefs.b + coefs.c, "b × cos(a · x) + c", "b + c"),
                2: () => Helpers.resolveXValues(coefs, "cos"),
                3: () => Helpers.resolveYValues(coefs, "cos"),
                4: () => Helpers.resolveSign(coefs, "cos"),
                5: () => Helpers.equations(false),
            },
        })
    },

    resolveTangent: ({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "tan")

        const root = Algebra.round(Math.atan(Algebra.divisionOptions(-coefs.c, coefs.b)) / coefs.a)

        runAnalysisMenu(coefs, "tan", ["analyze.options.verticalAsymptote", "analyze.options.period"], {
            1: {
                1: () => Helpers.verticalAsymptote(coefs.a),
                2: () => Helpers.showPeriod(coefs.a, true),
                3: () => Helpers.domain(),
                4: () => Helpers.range(),
                5: () => Helpers.xAxis(root, "arctan(−c / b) / a"),
            },
            2: {
                1: () => Helpers.yAxis(coefs.c, "b × tan(a · x) + c", "c"),
                2: () => Helpers.resolveXValues(coefs, "tan"),
                3: () => Helpers.resolveYValues(coefs, "tan"),
                4: () => Helpers.resolveSign(coefs, "tan"),
                5: () => Helpers.equations(false),
            },
        })
    },
}
