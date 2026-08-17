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
    constant(coefC = State.globalC) {
        Analyze.resolveConstant({ c: coefC })
    },

    resolveConstant(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs)

        let option = 0,
            page = 1,
            limit = 0

        const pageActions = {
            1: {
                1: () => Helpers.domain(),
                2: () => Helpers.range(`= ${Writing.decimal(coefs.c)}`, ".", tr("analyze.constantValue")),
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
            // Menu
            ;[option, page] = Ui.menu(trArr(BASE_OPTIONS), page)
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "poly", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },

    affine(coefB = State.globalB, coefC = State.globalC) {
        Analyze.resolveAffine({ b: coefB, c: coefC })
    },

    resolveAffine(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs)

        // Cálculo
        let root = Helpers.calcRoot(0, coefs.b, coefs.c)

        let option = 0,
            page = 1,
            limit = 0

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
            // Menu
            ;[option, page] = Ui.menu(trArr(["analyze.options.slope", "analyze.options.root", ...BASE_OPTIONS]), page)
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "poly", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },

    quadratic(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        Analyze.resolveQuadratic({ a: coefA, b: coefB, c: coefC })
    },

    resolveQuadratic(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs)

        // Cálculo
        let delta = Helpers.calcDelta(coefs.a, coefs.b, coefs.c),
            vertex = Helpers.vertex(coefs.a, coefs.b, delta[0])

        let option = 0,
            page = 1,
            limit = 0

        const pageActions = {
            1: {
                1: () => Helpers.curve(coefs.a),
                2: () =>
                    Helpers.showDelta(
                        delta[0],
                        tr("analyze.noRoots"),
                        tr("analyze.oneRoot", { x: Writing.decimal(delta[1]) }),
                        tr("analyze.twoRoots", { x1: Writing.decimal(delta[1]), x2: Writing.decimal(delta[2]) })
                    ),
                3: () =>
                    Ui.display(
                        tr("analyze.vertexPoint", { p1: Writing.decimal(vertex[0]), p2: Writing.decimal(vertex[1]) }),
                        tr("analyze.vertexExp")
                    ),
                4: () => Helpers.domain(),
                5: () => {
                    if (coefs.a > 0) {
                        Helpers.range(`∈ [${Writing.decimal(vertex[1])}, ∞)`, tr("analyze.betweenVertexInfinity"))
                    } else if (coefs.a < 0) {
                        Helpers.range(`∈ (-∞, ${Writing.decimal(vertex[1])} ]`, tr("analyze.betweenInfinityVertex"))
                    }
                },
            },
            2: {
                1: () =>
                    Helpers.showDelta(
                        delta[0],
                        tr("analyze.noIntersectionXAxis"),
                        tr("analyze.oneIntersectionXAxis", { p: Writing.decimal(delta[1]) }),
                        tr("analyze.twoIntersectionsXAxis", {
                            p1: Writing.decimal(delta[1]),
                            p2: Writing.decimal(delta[2]),
                        })
                    ),
                2: () => Helpers.yAxis(coefs.c, "ax² + bx + c", "c"),
                3: () => Helpers.xValues(coefs.a, coefs.b, coefs.c),
                4: () => Helpers.yValues(coefs.a, coefs.b, coefs.c),
                5: () => Helpers.sign(coefs.a, coefs.b, coefs.c),
            },
            3: {
                1: () => {
                    option = Helpers.equations(true, coefs.a, coefs.b, coefs.c)
                },
            },
        }

        do {
            // Menu
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.concavity", "analyze.options.root", "analyze.options.vertex", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "poly", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },

    exponential(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        Analyze.resolveExponential({ a: coefA, b: coefB, c: coefC })
    },

    resolveExponential(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs, "exp")

        // Cálculo
        let root = Helpers.calcRoot(coefs.a, coefs.b, coefs.c, true)

        let option = 0,
            page = 1,
            limit = 0

        const pageActions = {
            1: {
                1: () => Helpers.curve(coefs.a, coefs.b, false),
                2: () => Helpers.showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"),
                3: () =>
                    Ui.display(tr("analyze.options.horizontalAsymptote", { y: Writing.decimal(coefs.c) }), "y = c"),
                4: () => Helpers.domain(),
                5: () => {
                    if (coefs.b > 0) {
                        Helpers.range(`∈ (${Writing.decimal(coefs.c)}, ∞)`, tr("analyze.betweenCInfinity"))
                    } else {
                        Helpers.range(`∈ (-∞, ${Writing.decimal(coefs.c)})`, tr("analyze.betweenInfinityC"))
                    }
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
            // Menu
            ;[option, page] = Ui.menu(
                trArr([
                    "analyze.options.curve",
                    "analyze.options.root",
                    "analyze.options.horizontalAsymptote",
                    ...BASE_OPTIONS,
                ]),
                page
            )
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "exp", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },

    logarithmic(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        Analyze.resolveLogarithmic({ a: coefA, b: coefB, c: coefC })
    },

    resolveLogarithmic(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs, "log")

        // Cálculo
        let root = Algebra.round(coefs.a ** Algebra.division(-coefs.c, coefs.b, false))

        let option = 0,
            page = 1,
            limit = 0

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
            // Menu
            ;[option, page] = Ui.menu(trArr(["analyze.options.curve", "analyze.options.root", ...BASE_OPTIONS]), page)
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "log", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },

    sine(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        Analyze.resolveSine({ a: coefA, b: coefB, c: coefC })
    },

    resolveSine(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs, "sin")

        // Cálculo
        let root = Algebra.round(Math.asin(Algebra.division(-coefs.c, coefs.b)) / coefs.a)

        let option = 0,
            page = 1,
            limit = 0

        const pageActions = {
            1: {
                1: () => Helpers.amplitude(coefs.b),
                2: () => Helpers.showPeriod(coefs.a),
                3: () => Helpers.domain(),
                4: () => {
                    const modB = Writing.decimal(Algebra.absolute(coefs.b) + coefs.c)
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
            // Menu
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.amplitude", "analyze.options.period", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "sin", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },

    cosine(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        Analyze.resolveCosine({ a: coefA, b: coefB, c: coefC })
    },

    resolveCosine(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs, "cos")

        // Cálculo
        let root = Algebra.round(Math.acos(Algebra.division(-coefs.c, coefs.b)) / coefs.a)

        let option = 0,
            page = 1,
            limit = 0

        const pageActions = {
            1: {
                1: () => Helpers.amplitude(coefs.b),
                2: () => Helpers.showPeriod(coefs.a),
                3: () => Helpers.domain(),
                4: () =>
                    Helpers.range(
                        "∈ [" +
                            Writing.decimal(-Algebra.absolute(coefs.b) + coefs.c) +
                            ", " +
                            Writing.decimal(Algebra.absolute(coefs.b) + coefs.c) +
                            "]",
                        "",
                        "−|b| + c ≤ y ≤ |b| + c"
                    ),
                5: () => Helpers.xAxis(root, "arccos(−c / b) / a", "|(−c / b)| > 1, " + tr("analyze.withoutRoot")),
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
            // Menu
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.amplitude", "analyze.options.period", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "cos", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },

    tangent(coefA = State.globalA, coefB = State.globalB, coefC = State.globalC) {
        Analyze.resolveTangent({ a: coefA, b: coefB, c: coefC })
    },

    resolveTangent(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }) {
        Ui.resolveFunction(coefs, "tan")

        // Cálculo
        let root = Algebra.round(Math.atan(Algebra.division(-coefs.c, coefs.b)) / coefs.a)

        let option = 0,
            page = 1,
            limit = 0

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
            // Menu
            ;[option, page] = Ui.menu(
                trArr(["analyze.options.verticalAsymptote", "analyze.options.period", ...BASE_OPTIONS]),
                page
            )
            if (Commands.names.includes(String(option))) {
                option = 0
                page = 1
            }

            // Executa a ação da opção selecionada
            pageActions[page]?.[option]?.()

            // Rever
            if (option == 6) {
                Ui.resolveFunction(coefs, "tan", true)
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                option = 0
            }
        } while (option != 0)
    },
}
