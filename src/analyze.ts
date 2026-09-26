import { absoluteOptions, divisionOptions, round } from "./algebra.js"
import { isFiniteNumber, isValidText } from "./checks.js"
import { isValidCommand } from "./commands.js"
import { notify } from "./display.js"
import { amplitude, calculateDelta, calculateRoot, curve, domain, exceededLimit, range, resolveSign, resolveXValues, resolveYValues, saveEquations, showDelta, showPeriod, showRoot, vertex, verticalAsymptote, xAxis, yAxis } from "./helpers.js"
import { tr, trArr } from "./i18n.js"
import { State } from "./state.js"
import { menu, resolveFunction } from "./ui.js"
import { decimalOptions } from "./writing.js"

const BASE_OPTIONS: TranslationKey[] = ["analyze.options.domain", "analyze.options.range", "analyze.options.xIntersection", "analyze.options.yIntersection", "analyze.options.xValues", "analyze.options.yValues", "analyze.options.signAnalysis", "analyze.options.functionEquations"]

function resolveConstant({ c = State.current.numericC } = {}): void {
    const coefs = { a: 0, b: 0, c },
        showC = decimalOptions(coefs.c)
    resolveFunction(coefs)

    runAnalysisMenu(coefs, "poly", [], {
        1: { 1: () => domain(), 2: () => range(`= ${showC}`, "", tr("analyze.constantValue")), 3: () => xAxis(0, showC), 4: () => yAxis(coefs.c, "c", "c"), 5: () => resolveXValues(coefs) },
        2: { 1: () => resolveYValues(coefs), 2: () => resolveSign(coefs), 3: () => saveEquations(coefs) },
    })
}

function resolveAffine({ b = State.current.numericB, c = State.current.numericC } = {}): void {
    const coefs = { a: 0, b, c }
    resolveFunction(coefs)

    const root = calculateRoot(coefs)

    runAnalysisMenu(coefs, "poly", ["analyze.options.slope", "analyze.options.root"], {
        1: { 1: () => curve(0, coefs.b), 2: () => showRoot(root, "(−c) / b"), 3: () => domain(), 4: () => range(), 5: () => xAxis(root, "(−c) / b") },
        2: { 1: () => yAxis(coefs.c, "bx + c", "c"), 2: () => resolveXValues(coefs), 3: () => resolveYValues(coefs), 4: () => resolveSign(coefs), 5: () => saveEquations(coefs) },
    })
}

function resolveQuadratic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}): void {
    const coefs = { a, b, c }
    resolveFunction(coefs)

    const [delta, root1, root2] = calculateDelta(coefs),
        [x1, x2] = [decimalOptions(root1), decimalOptions(root2)],
        [vertexX, vertexY] = vertex(coefs.a, coefs.b, delta),
        [p1, p2] = [decimalOptions(vertexX), decimalOptions(vertexY)]

    runAnalysisMenu(coefs, "poly", ["analyze.options.concavity", "analyze.options.root", "analyze.options.vertex"], {
        1: {
            1: () => curve(coefs.a),
            2: () => showDelta(delta, tr("analyze.noRoots"), tr("analyze.oneRoot", { x: x1 }), tr("analyze.twoRoots", { x1, x2 })),
            3: () => notify(tr("analyze.vertexPoint", { p1, p2 }), { explanation: tr("analyze.vertexExp") }),
            4: () => domain(),
            5: () => (coefs.a > 0 ? range(`∈ [${p2}, ∞)`, tr("analyze.betweenVertexInfinity")) : range(`∈ (-∞, ${p2} ]`, tr("analyze.betweenInfinityVertex"))),
        },
        2: {
            1: () => showDelta(delta, tr("analyze.noIntersectionXAxis"), tr("analyze.oneIntersectionXAxis", { p: x1 }), tr("analyze.twoIntersectionsXAxis", { p1: x1, p2: x2 })),
            2: () => yAxis(coefs.c, "ax² + bx + c", "c"),
            3: () => resolveXValues(coefs),
            4: () => resolveYValues(coefs),
            5: () => resolveSign(coefs),
        },
        3: { 1: () => saveEquations(coefs) },
    })
}

function resolveExponential({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}): void {
    const coefs = { a, b, c }
    resolveFunction(coefs, "exp")

    const root = calculateRoot(coefs, "exp"),
        showC = decimalOptions(coefs.c)

    runAnalysisMenu(coefs, "exp", ["analyze.options.curve", "analyze.options.root", "analyze.options.horizontalAsymptote"], {
        1: {
            1: () => curve(coefs.a, coefs.b, false),
            2: () => showRoot(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"),
            3: () => notify(tr("analyze.options.horizontalAsymptote", { y: showC }), { explanation: "y = c" }),
            4: () => domain(),
            5: () => {
                if (coefs.b > 0) range(`∈ (${showC}, ∞)`, tr("analyze.betweenCInfinity"))
                else range(`∈ (-∞, ${showC})`, tr("analyze.betweenInfinityC"))
            },
        },
        2: { 1: () => xAxis(root, "ln((−c) / b) / ln(a)", "(−c) / b ≤ 0"), 2: () => yAxis(coefs.b + coefs.c, "b × aˣ + c", "b + c"), 3: () => resolveXValues(coefs, "exp"), 4: () => resolveYValues(coefs, "exp"), 5: () => resolveSign(coefs, "exp") },
        3: { 1: () => saveEquations(coefs, "exp") },
    })
}

function resolveLogarithmic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}): void {
    const coefs = { a, b, c }
    resolveFunction(coefs, "log")

    const root = round(coefs.a ** divisionOptions(-coefs.c, coefs.b, { shouldRound: false }))

    runAnalysisMenu(coefs, "log", ["analyze.options.curve", "analyze.options.root"], {
        1: { 1: () => curve(coefs.a, coefs.b, false), 2: () => showRoot(root, "a⁽⁻ᶜ⁄ᵇ⁾"), 3: () => domain("> 0", "x ≤ 0 ⇒ logₐ(x) ∉ ℝ"), 4: () => range(), 5: () => xAxis(root, "a⁽⁻ᶜ⁄ᵇ⁾") },
        2: { 1: () => yAxis("∄", "b × logₐ(x) + c", "x = 0 ⇒ logₐ(x) ∉ ℝ"), 2: () => resolveXValues(coefs, "log"), 3: () => resolveYValues(coefs, "log"), 4: () => resolveSign(coefs, "log"), 5: () => saveEquations(coefs, "log") },
    })
}

function resolveSine({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}): void {
    const coefs = { a, b, c }
    resolveFunction(coefs, "sin")

    runAnalysisMenu(coefs, "sin", ["analyze.options.amplitude", "analyze.options.period"], {
        1: {
            1: () => amplitude(coefs.b),
            2: () => showPeriod(coefs.a),
            3: () => domain(),
            4: () => range(`∈ [${decimalOptions(-absoluteOptions(coefs.b) + coefs.c)}, ${decimalOptions(absoluteOptions(coefs.b) + coefs.c)}]`, "", "−|b| + c ≤ y ≤ |b| + c"),
            5: () => xAxis(divisionOptions(Math.asin(-coefs.c / coefs.b), coefs.a), "arcsin(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
        },
        2: { 1: () => yAxis(coefs.c, "b × sin(a · x) + c", "c"), 2: () => resolveXValues(coefs, "sin"), 3: () => resolveYValues(coefs, "sin"), 4: () => resolveSign(coefs, "sin"), 5: () => saveEquations(coefs, "sin") },
    })
}

function resolveCosine({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}): void {
    const coefs = { a, b, c }
    resolveFunction(coefs, "cos")

    runAnalysisMenu(coefs, "cos", ["analyze.options.amplitude", "analyze.options.period"], {
        1: {
            1: () => amplitude(coefs.b),
            2: () => showPeriod(coefs.a),
            3: () => domain(),
            4: () => range(`∈ [${decimalOptions(-absoluteOptions(coefs.b) + coefs.c)}, ${decimalOptions(absoluteOptions(coefs.b) + coefs.c)}]`, "", "−|b| + c ≤ y ≤ |b| + c"),
            5: () => xAxis(divisionOptions(Math.acos(-coefs.c / coefs.b), coefs.a), "arccos(−c / b) / a", `|(−c / b)| > 1, ${tr("analyze.withoutRoot")}`),
        },
        2: { 1: () => yAxis(coefs.b + coefs.c, "b × cos(a · x) + c", "b + c"), 2: () => resolveXValues(coefs, "cos"), 3: () => resolveYValues(coefs, "cos"), 4: () => resolveSign(coefs, "cos"), 5: () => saveEquations(coefs, "cos") },
    })
}

function resolveTangent({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}): void {
    const coefs = { a, b, c }
    resolveFunction(coefs, "tan")

    runAnalysisMenu(coefs, "tan", ["analyze.options.verticalAsymptote", "analyze.options.period"], {
        1: { 1: () => verticalAsymptote(coefs.a), 2: () => showPeriod(coefs.a, true), 3: () => domain(), 4: () => range(), 5: () => xAxis(divisionOptions(Math.atan(-coefs.c / coefs.b), coefs.a), "arctan(−c / b) / a") },
        2: { 1: () => yAxis(coefs.c, "b × tan(a · x) + c", "c"), 2: () => resolveXValues(coefs, "tan"), 3: () => resolveYValues(coefs, "tan"), 4: () => resolveSign(coefs, "tan"), 5: () => saveEquations(coefs, "tan") },
    })
}

function runAnalysisMenu(coefs: Coefficients, funcType: FunctionType, extraOptions: TranslationKey[], pageActions: Record<number, Record<number, () => unknown>>): void {
    let option: number | CommandsNames,
        [page, limit] = [1, 0]

    do {
        ;[option, page] = menu(trArr([...extraOptions, ...BASE_OPTIONS]), page)
        if (isValidCommand(option)) [option, page] = [0, 1]

        if (isFiniteNumber(option)) {
            const result = pageActions[page]?.[option]?.()
            if (isValidText(result)) option = result === "result" ? 1 : 0 /** Propiedade de {@link saveEquations} */
        }

        if (option === 6) resolveFunction(coefs, funcType, true)
        limit++
        if (exceededLimit(limit)) option = 0
    } while (option !== 0)
}

export { resolveAffine, resolveConstant, resolveCosine, resolveExponential, resolveLogarithmic, resolveQuadratic, resolveSine, resolveTangent }
