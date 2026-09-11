import { Checks } from "./checks.js"
import { Config } from "./config.js"
import { Errors } from "./errors.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

export const Algebra = {
    round: (number = 0, places = Config.decimalPlaces) => {
        if (!Checks.isFiniteNumber(places) || places < 0) places = Config.decimalPlaces

        number = Writing.decimalOptions(number, { invert: true, round: false })

        if (Checks.isFiniteNumber(number)) {
            number = Math.round(number * 10 ** places) / 10 ** places
            if (number == 0) number = 0
        }

        return number
    },

    variables: (name = "x") => {
        if (name.trim() == "") name = "x"

        const value = Writing.decimalOptions(Ui.input(`${name} = `, tr("algebra.variableAsk", { name })), {
            invert: true,
        })
        if (Checks.isFiniteNumber(value)) return Algebra.round(value)

        return name
    },

    point: (type = 1) => {
        if (![1, 2, 3].includes(type)) type = 1

        const array = []

        for (let i = 1; i <= type; i++)
            array.push(
                Ui.input(`x${Writing.subscript(i)} = `, "", true),
                Ui.input(`y${Writing.subscript(i)} = `, "", true)
            )

        return array
    },

    equations: (func1 = [0, 0, 0], func2 = [0, 0, 0]) => {
        if (!Array.isArray(func1) || func1.length != 3 || !func1.every(value => Checks.isFiniteNumber(value)))
            func1 = [0, 0, 0]
        if (!Array.isArray(func2) || func2.length != 3 || !func2.every(value => Checks.isFiniteNumber(value)))
            func2 = [0, 0, 0]

        const [a1 = 0, b1 = 0, c1 = 0] = func1,
            [a2 = 0, b2 = 0, c2 = 0] = func2,
            coefA = a1 - a2,
            coefB = b1 - b2,
            coefC = c1 - c2

        if (coefA == 0 && coefB == 0) {
            return coefC == 0
                ? Ui.notifyOptions(tr("algebra.constantCoincide"), { explanation: tr("algebra.constantCoincideExp") })
                : Ui.notifyOptions(tr("algebra.constantDistinct"), { explanation: tr("algebra.constantDistinctExp") })
        }

        if (coefA == 0) {
            const x = Algebra.divisionOptions(-coefC, coefB)
            return Ui.notifyOptions(tr("algebra.oneRoot", { x: Writing.decimalOptions(x) }), {
                explanation: "x = −c / b",
            })
        }

        const delta = Helpers.calcDelta(coefA, coefB, coefC)

        return Helpers.showDelta(
            delta[0],
            tr("algebra.quadraticDistinct"),
            tr("algebra.oneRoot", { x: Writing.decimalOptions(delta[1]) }),
            tr("algebra.twoRoots", { x1: Writing.decimalOptions(delta[1]), x2: Writing.decimalOptions(delta[2]) })
        )
    },

    resolveEquations: ({ a1 = 0, b1 = 0, c1 = 0 } = {}, { a2 = 0, b2 = 0, c2 = 0 } = {}) => {
        Algebra.equations([a1, b1, c1], [a2, b2, c2])
    },

    solveLinearSystem: (matrix, vector) => {
        const n = vector.length,
            m = matrix.map(row => row.slice()),
            v = vector.slice()

        for (let col = 0; col < n; col++) {
            let pivotRow = col
            for (let row = col + 1; row < n; row++)
                if (Algebra.absoluteOptions(m[row][col]) > Algebra.absoluteOptions(m[pivotRow][col])) pivotRow = row

            if (m[pivotRow][col] == 0) return null

            ;[m[col], m[pivotRow]] = [m[pivotRow], m[col]]
            ;[v[col], v[pivotRow]] = [v[pivotRow], v[col]]

            for (let row = col + 1; row < n; row++) {
                const factor = m[row][col] / m[col][col]
                for (let k = col; k < n; k++) m[row][k] -= factor * m[col][k]
                v[row] -= factor * v[col]
            }
        }

        const solution = new Array(n).fill(0)
        for (let row = n - 1; row >= 0; row--) {
            let sum = v[row]
            for (let k = row + 1; k < n; k++) sum -= m[row][k] * solution[k]
            solution[row] = Algebra.divisionOptions(sum, m[row][row])
        }
        return solution
    },

    solveLinearCoefs: (basis = null, known, unknownKeys, points) => {
        const knownKeys = Object.keys(basis).filter(key => !unknownKeys.includes(key)),
            matrix = points.map(({ x }) => unknownKeys.map(key => basis[key](x))),
            vector = points.map(({ x, y }) => {
                const contribution = knownKeys.reduce((sum, key) => sum + known[key] * basis[key](x), 0)
                return y - contribution
            }),
            solved = Algebra.solveLinearSystem(matrix, vector)

        if (!solved) return null

        const result = { ...known }
        unknownKeys.forEach((key, i) => (result[key] = solved[i]))
        return result
    },

    getPointPairs: (count = 1) => {
        const raw = Algebra.point(count),
            total = (count || 1) * 2,
            pairs = []
        for (let i = 0; i < total; i += 2)
            pairs.push({ x: Checks.numericPoint(raw, i), y: Checks.numericPoint(raw, i + 1) })

        return pairs
    },

    solvePolynomial: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c },
            basis = { a: x => x * x, b: x => x, c: () => 1 },
            eligible = { constant: ["c"], affine: ["b", "c"], quadratic: ["a", "b", "c"] },
            degree = coefs.a == 0 && coefs.b == 0 ? "constant" : coefs.a == 0 ? "affine" : "quadratic",
            unknownKeys = degree == "constant" ? ["c"] : eligible[degree].filter(key => coefs[key] == key)

        if (unknownKeys.length == 0) return coefs

        const points = Algebra.getPointPairs(unknownKeys.length)
        return Algebra.solveLinearCoefs(basis, coefs, unknownKeys, points)
    },

    solveExponential: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c },
            linearKeys = ["b", "c"],
            unknownKeys = ["a", "b", "c"].filter(key => coefs[key] == key)
        if (unknownKeys.length == 0) return coefs

        if (unknownKeys.every(key => linearKeys.includes(key)))
            return Algebra.solveLinearCoefs(
                { b: x => coefs.a ** x, c: () => 1 },
                coefs,
                unknownKeys,
                Algebra.getPointPairs(unknownKeys.length)
            )

        if (unknownKeys.length == 1 && unknownKeys[0] == "a") {
            const [{ x, y }] = Algebra.getPointPairs(1)
            a = Algebra.round(
                Algebra.divisionOptions(y - coefs.c, coefs.b, { round: false }) **
                    Algebra.divisionOptions(1, x, { round: false })
            )
            return { ...coefs, a }
        }

        if (unknownKeys.includes("a") && unknownKeys.includes("b")) {
            const [p0, p1] = Algebra.getPointPairs(2)
            a = Algebra.round(
                Algebra.divisionOptions(p0.y - coefs.c, p1.y - coefs.c, { round: false }) **
                    Algebra.divisionOptions(1, p0.x - p1.x, { round: false })
            )
            return { ...coefs, a, b: Algebra.divisionOptions(p0.y - coefs.c, a ** p0.x) }
        }

        // TODO - "a" e "c" juntos ainda não suportado
        Ui.notifyOptions(tr("algebra.cannotDetermine", { v1: "a", v2: "c", v3: "b" }), {
            explanation: tr("algebra.underConstruction"),
            type: "warning",
        })
        return { ...coefs, a: -1, c: 0 }
    },

    solveLogarithmic: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) => {
        const coefs = { a, b, c },
            linearKeys = ["b", "c"],
            unknownKeys = ["a", "b", "c"].filter(key => coefs[key] == key)
        if (unknownKeys.length == 0) return coefs

        if (unknownKeys.every(key => linearKeys.includes(key))) {
            const basis = { b: x => Algebra.logOptions(x, coefs.a), c: () => 1 }
            return Algebra.solveLinearCoefs(basis, coefs, unknownKeys, Algebra.getPointPairs(unknownKeys.length))
        }

        if (unknownKeys.length == 1 && unknownKeys[0] == "a") {
            const [{ x, y }] = Algebra.getPointPairs(1)
            return { ...coefs, a: Algebra.round(x ** Algebra.divisionOptions(coefs.b, y - coefs.c, { round: false })) }
        }

        if (unknownKeys.includes("a") && unknownKeys.includes("c")) {
            const [p0, p1] = Algebra.getPointPairs(2)
            a = Algebra.round(
                Algebra.divisionOptions(p0.x, p1.x, { round: false }) **
                    Algebra.divisionOptions(coefs.b, p0.y - p1.y, { round: false })
            )
            return { ...coefs, a, c: p0.y - coefs.b * Algebra.logOptions(p0.x, a) }
        }

        // TODO - "a" e "b" juntos ainda não suportado
        Ui.notifyOptions(tr("algebra.cannotDetermine", { v1: "a", v2: "b", v3: "c" }), {
            explanation: tr("algebra.underConstruction"),
            type: "warning",
        })
        return { ...coefs, a: -1, b: 1, c: 0 }
    },

    resolveUnknown: ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}, funcType = "poly") => {
        const coefs = { a, b, c },
            solvers = { poly: Algebra.solvePolynomial, exp: Algebra.solveExponential, log: Algebra.solveLogarithmic },
            solver = solvers[funcType] ?? Algebra.solvePolynomial // TODO - trig cai em poly

        if (funcType != "poly") {
            if (coefs.a == 0 || coefs.a == 1 || coefs.b == 0) {
                return {
                    a: Checks.isFiniteNumber(coefs.a) ? coefs.a : 0,
                    b: Checks.isFiniteNumber(coefs.b) ? coefs.b : 0,
                    c: Checks.isFiniteNumber(coefs.c) ? coefs.c : 0,
                }
            }
        }

        Ui.resolveFunction(coefs, funcType)

        let current = coefs,
            limit = 0

        do {
            const solved = solver(current)

            if (!solved) {
                Errors.divZero(tr("algebra.invalidValues"))
                continue
            }

            const invalid = !["a", "b", "c"].every(key => Checks.isFiniteNumber(solved[key]))
            if (!invalid) return solved

            Errors.divZero(tr("algebra.invalidValues"))
            if (
                Ui.notifyOptions(tr("algebra.changeValues"), {
                    explanation: tr("algebra.changeValuesExp"),
                    type: "confirm",
                })
            ) {
                State.askCoeffs = true
                State.loop = true
                return { a: "a", b: "b", c: "c" }
            }

            current = {
                a: Checks.isFiniteNumber(solved.a) ? solved.a : "a",
                b: Checks.isFiniteNumber(solved.b) ? solved.b : "b",
                c: Checks.isFiniteNumber(solved.c) ? solved.c : "c",
            }
        } while (!Helpers.exceededLimit(++limit))

        const invalid = !["a", "b", "c"].every(key => Checks.isFiniteNumber(current[key]))
        return invalid ? { a: NaN, b: NaN, c: NaN } : current
    },

    unknown: (
        coefA = State.globalA,
        coefB = State.globalB,
        coefC = State.globalC,
        funcExp = false,
        funcLog = false,
        funcTrig = ""
    ) => {
        const funcType = funcExp ? "exp" : funcLog ? "log" : funcTrig || "poly",
            result = Algebra.resolveUnknown({ a: coefA, b: coefB, c: coefC }, funcType)
        return [
            Checks.isFiniteNumber(result.a) ? "a" : result.a,
            Checks.isFiniteNumber(result.b) ? "b" : result.b,
            Checks.isFiniteNumber(result.c) ? "c" : result.c,
        ]
    },

    log: (x = 1, base = Math.E, precision = Config.logPrecision, round = false, places = Config.decimalPlaces) =>
        Algebra.logOptions(x, base, { precision, round, places }),

    logOptions: (
        x = 1,
        base = Math.E,
        { round = false, places = Config.decimalPlaces, precision = Config.logPrecision } = {}
    ) => {
        const isNatural = Algebra.round(base) == Algebra.round(Math.E)

        if (x <= 0 || (!isNatural && (base <= 0 || base == 1))) {
            isNatural ? Errors.invalidLog("ln", "x > 0") : Errors.invalidLog("log", "x > 0 ∧ base > 0, base ≠ 1")

            return NaN
        }

        if (base < 1) {
            const lnX = Algebra.lnOptions(x, { precision, round }),
                lnBase = Algebra.lnOptions(base, { precision, round })
            if (!Checks.isFiniteNumber(lnX) || !Checks.isFiniteNumber(lnBase) || lnBase == 0) return NaN

            return Algebra.divisionOptions(lnX, lnBase)
        }

        const lnBase = isNatural ? 1 : Algebra.lnOptions(base, { precision, round })
        let y = x > 1 ? 1 : -1,
            delta = Algebra.divisionOptions(base ** y - x, base ** y * lnBase, { round: false }),
            limit = 0
        while (Algebra.absoluteOptions(delta) > precision && limit < Config.iterationLimit) {
            delta = Algebra.divisionOptions(base ** y - x, base ** y * lnBase, { round: false })
            y -= delta

            if (Helpers.exceededLimit(++limit)) return NaN
        }

        return round ? Algebra.round(y, places) : y
    },

    ln: (x = 1, precision = Config.logPrecision, round = false, places = Config.decimalPlaces) =>
        Algebra.logOptions(x, Math.E, { round, places, precision }),

    lnOptions: (x = 1, { round = false, places = Config.decimalPlaces, precision = Config.logPrecision } = {}) =>
        Algebra.logOptions(x, Math.E, { precision, round, places }),

    division: (numerator = 0, denominator = 1, round = true, precision = Config.divPrecision) =>
        Algebra.divisionOptions(numerator, denominator, { round, precision }),
    divisionOptions: (numerator = 0, denominator = 1, { round = true, precision = Config.divPrecision } = {}) => {
        numerator = Writing.decimalOptions(numerator, { invert: true })
        denominator = Writing.decimalOptions(denominator, { invert: true })

        if (denominator == 0 || !Checks.isFiniteNumber(numerator) || !Checks.isFiniteNumber(denominator)) return NaN
        if (Algebra.absoluteOptions(denominator) <= precision) return NaN
        const result = numerator / denominator
        if (!Checks.isFiniteNumber(result)) return NaN
        if (round) return Algebra.round(result)
        return result
    },

    absolute: (number = 0, round = true, places = Config.decimalPlaces) =>
        Algebra.absoluteOptions(number, { round, places }),
    absoluteOptions: (number = 0, { round = true, places = Config.decimalPlaces } = {}) => {
        number = Writing.decimalOptions(number, { invert: true })
        if (!Checks.isFiniteNumber(number)) return NaN
        if (round) number = Algebra.round(number, places)
        return Math.abs(number)
    },
}
