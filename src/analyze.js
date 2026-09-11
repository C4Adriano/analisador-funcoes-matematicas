import { Algebra } from "./algebra.js"
import { Commands } from "./commands.js"
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
]

export const Analyze = {
    constant: (c = State.globalC) => Analyze.resolveConstant({ c }),
    resolveConstant: ({ c = State.globalC } = {}) => {
        const coefs = { c }
        Ui.resolveFunction(coefs)

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
            1: {
                1: () => Helpers.domain(),
                2: () => Helpers.range(`= ${Writing.decimalOptions(coefs.c)}`, "", tr("analyze.constantValue")),
                3: () => Helpers.xAxis(0, String(coefs.c)),
                4: () => Helpers.yAxis(coefs.c, "c", "c"),
                5: () => Helpers.xValues(0, 0, coefs.c),
            },
            2: {
                1: () => Helpers.yValues(0, 0, coefs.c),
                2: () => Helpers.sign(0, 0, coefs.c),
                3: () => {
                    option = Helpers.equations(true, 0, 0, coefs.c)
                },
            },
        }

        do {
            ;[option, page] = Ui.menu(trArr(BASE_OPTIONS), page)
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "poly", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },

    affine: (b = State.globalB, c = State.globalC) => Analyze.resolveAffine({ b, c }),
    resolveAffine: ({ b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { b, c }
        Ui.resolveFunction(coefs)

        const root = Helpers.calcRoot(0, coefs.b, coefs.c)

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
            1: {
                1: () => Helpers.curve(0, coefs.b),
                2: () => Helpers.showRoot(root, "(−c) / b"),
                3: () => Helpers.domain(),
                4: () => Helpers.range(),
                5: () => Helpers.xAxis(root, "(−c) / b"),
            },
            2: {
                1: () => Helpers.yAxis(coefs.c, "bx + c", "c"),
                2: () => Helpers.xValues(0, coefs.b, coefs.c),
                3: () => Helpers.yValues(0, coefs.b, coefs.c),
                4: () => Helpers.sign(0, coefs.b, coefs.c),
                5: () => {
                    option = Helpers.equations(true, 0, coefs.b, coefs.c)
                },
            },
        }

        do {
            ;[option, page] = Ui.menu(trArr(["analyze.options.slope", "analyze.options.root", ...BASE_OPTIONS]), page)
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "poly", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },

    quadratic: (a = State.globalA, b = State.globalB, c = State.globalC) => Analyze.resolveQuadratic({ a, b, c }),
    resolveQuadratic: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs)

        const delta = Helpers.calcDelta(coefs.a, coefs.b, coefs.c),
            vertex = Helpers.vertex(coefs.a, coefs.b, delta[0])

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
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
                3: () => Helpers.xValues(coefs.a, coefs.b, coefs.c),
                4: () => Helpers.yValues(coefs.a, coefs.b, coefs.c),
                5: () => Helpers.sign(coefs.a, coefs.b, coefs.c),
            },
            3: {
                1: () => (option = Helpers.equations(true, coefs.a, coefs.b, coefs.c)),
            },
        }

        do {
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.concavity", "analyze.options.root", "analyze.options.vertex", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "poly", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },

    exponential: (a = State.globalA, b = State.globalB, c = State.globalC) => Analyze.resolveExponential({ a, b, c }),
    resolveExponential: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "exp")

        const root = Helpers.calcRoot(coefs.a, coefs.b, coefs.c, true)

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
            1: {
                1: () => Helpers.curve(coefs.a, coefs.b, false),
                2: () => Helpers.showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"),
                3: () =>
                    Ui.notifyOptions(
                        tr("analyze.options.horizontalAsymptote", { y: Writing.decimalOptions(coefs.c) }),
                        {
                            explanation: "y = c",
                        }
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
                3: () => Helpers.xValues(coefs.a, coefs.b, coefs.c, true),
                4: () => Helpers.yValues(coefs.a, coefs.b, coefs.c, true),
                5: () => Helpers.sign(coefs.a, coefs.b, coefs.c, true),
            },
            3: {
                1: () => Helpers.equations(false),
            },
        }

        do {
            ;[option, page] = Ui.menu(
                trArr([
                    "analyze.options.curve",
                    "analyze.options.root",
                    "analyze.options.horizontalAsymptote",
                    ...BASE_OPTIONS,
                ]),
                page
            )
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "exp", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },

    logarithmic: (a = State.globalA, b = State.globalB, c = State.globalC) => Analyze.resolveLogarithmic({ a, b, c }),
    resolveLogarithmic: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "log")

        const root = Algebra.round(coefs.a ** Algebra.divisionOptions(-coefs.c, coefs.b, { round: false }))

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
            1: {
                1: () => Helpers.curve(coefs.a, coefs.b, false),
                2: () => Helpers.showRoot(root, "a⁽⁻ᶜ⁄ᵇ⁾"),
                3: () => Helpers.domain("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ"),
                4: () => Helpers.range(),
                5: () => Helpers.xAxis(root, "a⁽⁻ᶜ⁄ᵇ⁾"),
            },
            2: {
                1: () => Helpers.yAxis("∄", "b × logₐ(x) + c", "x = 0 ⇒ logₐ(x) ∉ ℝ"),
                2: () => Helpers.xValues(coefs.a, coefs.b, coefs.c, false, true),
                3: () => Helpers.yValues(coefs.a, coefs.b, coefs.c, false, true),
                4: () => Helpers.sign(coefs.a, coefs.b, coefs.c, false, true),
                5: () => Helpers.equations(false),
            },
        }

        do {
            ;[option, page] = Ui.menu(trArr(["analyze.options.curve", "analyze.options.root", ...BASE_OPTIONS]), page)
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "log", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },

    sine: (a = State.globalA, b = State.globalB, c = State.globalC) => Analyze.resolveSine({ a, b, c }),
    resolveSine: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "sin")

        const root = Algebra.round(Math.asin(Algebra.divisionOptions(-coefs.c, coefs.b)) / coefs.a)

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
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
                2: () => Helpers.xValues(coefs.a, coefs.b, coefs.c, false, false, "sin"),
                3: () => Helpers.yValues(coefs.a, coefs.b, coefs.c, false, false, "sin"),
                4: () => Helpers.sign(coefs.a, coefs.b, coefs.c, false, false, "sin"),
                5: () => Helpers.equations(false),
            },
        }

        do {
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.amplitude", "analyze.options.period", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "sin", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },

    cosine: (a = State.globalA, b = State.globalB, c = State.globalC) => Analyze.resolveCosine({ a, b, c }),
    resolveCosine: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "cos")

        const root = Algebra.round(Math.acos(Algebra.divisionOptions(-coefs.c, coefs.b)) / coefs.a)

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
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
                2: () => Helpers.xValues(coefs.a, coefs.b, coefs.c, false, false, "cos"),
                3: () => Helpers.yValues(coefs.a, coefs.b, coefs.c, false, false, "cos"),
                4: () => Helpers.sign(coefs.a, coefs.b, coefs.c, false, false, "cos"),
                5: () => Helpers.equations(false),
            },
        }

        do {
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.amplitude", "analyze.options.period", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "cos", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },

    tangent: (a = State.globalA, b = State.globalB, c = State.globalC) => Analyze.resolveTangent({ a, b, c }),
    resolveTangent: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c }
        Ui.resolveFunction(coefs, "tan")

        const root = Algebra.round(Math.atan(Algebra.divisionOptions(-coefs.c, coefs.b)) / coefs.a)

        let option,
            [page, limit] = [1, 0]

        const pageActions = {
            1: {
                1: () => Helpers.verticalAsymptote(coefs.a),
                2: () => Helpers.showPeriod(coefs.a, true),
                3: () => Helpers.domain(),
                4: () => Helpers.range(),
                5: () => Helpers.xAxis(root, "arctan(−c / b) / a"),
            },
            2: {
                1: () => Helpers.yAxis(coefs.c, "b × tan(a · x) + c", "c"),
                2: () => Helpers.xValues(coefs.a, coefs.b, coefs.c, false, false, "tan"),
                3: () => Helpers.yValues(coefs.a, coefs.b, coefs.c, false, false, "tan"),
                4: () => Helpers.sign(coefs.a, coefs.b, coefs.c, false, false, "tan"),
                5: () => Helpers.equations(false),
            },
        }

        do {
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.verticalAsymptote", "analyze.options.period", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(option)) [option, page] = [0, 1]

            pageActions[page]?.[option]?.()

            if (option == 6) Ui.resolveFunction(coefs, "tan", true)

            if (Helpers.exceededLimit(++limit)) option = 0
        } while (option != 0)
    },
}
