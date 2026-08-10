import { Checks } from "./checks.js"
import { Config } from "./config.js"
import { Errors } from "./errors.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

export const Algebra = {
    round(number = 0, places = Config.decimalPlaces) {
        if (!Checks.isFiniteNumber(places) || places < 0) {
            Ui.error(`[Algebra.round] “places” inválido: ${places}`, `Usando padrão: ${Config.decimalPlaces}`, true)
            places = Config.decimalPlaces
        }

        number = Writing.decimal(number, true, false)

        if (Checks.isFiniteNumber(number)) {
            number = Math.round(number * 10 ** places) / 10 ** places
            if (number == 0) {
                number = 0
            }
        }

        return number
    },

    variables(name = "x") {
        if (name.trim() == "") {
            Ui.error(`[Algebra.variables] “name” inválido: ${name}`, `Usando “x”`, true)
            name = "x"
        }

        let value = Ui.input(name + " = ", tr("algebra.variableAsk", { name: name }))

        value = Writing.decimal(value, true)
        if (Checks.isFiniteNumber(value)) {
            return Algebra.round(value)
        }

        return name
    },

    point(type = 1) {
        if (type != 1 && type != 2 && type != 3) {
            Ui.error(`[Algebra.point] “type” inválido: ${type}`, "Usando 1", true)
            type = 1
        }

        let array = []

        // Pergunta
        let x1 = Ui.input("x₁ = ", "", true)
        let y1 = Ui.input("y₁ = ", "", true)
        array.push(x1, y1)

        if (type == 2 || type == 3) {
            let x2 = Ui.input("x₂ = ", "", true)
            let y2 = Ui.input("y₂ = ", "", true)
            array.push(x2, y2)

            if (type == 3) {
                let x3 = Ui.input("x₃ = ", "", true)
                let y3 = Ui.input("y₃ = ", "", true)
                array.push(x3, y3)
            }
        }

        return array
    },

    equations(func1 = [0, 0, 0], func2 = [0, 0, 0]) {
        if (!Array.isArray(func1) || func1.length != 3) {
            Ui.error(`[Algebra.equations] “func1” inválido: ${func1}`, "Usando [0, 0, 0]", true)
            func1 = [0, 0, 0]
        }
        if (!Array.isArray(func2) || func2.length != 3) {
            Ui.error(`[Algebra.equations] “func2” inválido: ${func2}`, "Usando [0, 0, 0]", true)
            func2 = [0, 0, 0]
        }
        if (!func1.every(value => Checks.isFiniteNumber(value))) {
            Ui.error(`[Algebra.equations] “func1” contém valores inválidos: ${func1}`, "Usando [0, 0, 0]", true)
            func1 = [0, 0, 0]
        }
        if (!func2.every(value => Checks.isFiniteNumber(value))) {
            Ui.error(`[Algebra.equations] “func2” contém valores inválidos: ${func2}`, "Usando [0, 0, 0]", true)
            func2 = [0, 0, 0]
        }

        const [a1 = 0, b1 = 0, c1 = 0] = func1
        const [a2 = 0, b2 = 0, c2 = 0] = func2
        let coefA = a1 - a2,
            coefB = b1 - b2,
            coefC = c1 - c2,
            x = 0

        // Constante
        if (coefA == 0 && coefB == 0) {
            if (coefC == 0) {
                Ui.display(tr("algebra.constantCoincide"), tr("algebra.constantCoincideExp"))
            } else if (coefC != 0) {
                Ui.display(tr("algebra.constantDistinct"), tr("algebra.constantDistinctExp"))
            }
        }

        // Afim
        else if (coefA == 0 && coefB != 0) {
            x = Algebra.division(-coefC, coefB)
            Ui.display(tr("algebra.oneRoot", { x: Writing.decimal(x) }), "x = −c / b")
        }

        // Quadrática
        else if (coefA != 0) {
            let delta = Helpers.calcDelta(coefA, coefB, coefC)
            Helpers.showDelta(
                delta[0],
                tr("algebra.quadraticDistinc"),
                tr("algebra.oneRoot", { x: Writing.decimal(delta[1]) }),
                tr("algebra.twoRoots", { x1: Writing.decimal(delta[1]), x2: Writing.decimal(delta[2]) })
            )
        }
    },

    solveLinearSystem(matrix, vector) {
        const n = vector.length
        const m = matrix.map(row => row.slice())
        const v = vector.slice()

        for (let col = 0; col < n; col++) {
            let pivotRow = col
            for (let row = col + 1; row < n; row++) {
                if (Math.abs(m[row][col]) > Math.abs(m[pivotRow][col])) pivotRow = row
            }
            if (m[pivotRow][col] === 0) return null // sistema singular

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
            solution[row] = Algebra.division(sum, m[row][row])
        }
        return solution
    },

    solveLinearCoefs(basis = null, known, unknownKeys, points) {
        const knownKeys = Object.keys(basis).filter(key => !unknownKeys.includes(key))

        const matrix = points.map(({ x }) => unknownKeys.map(key => basis[key](x)))
        const vector = points.map(({ x, y }) => {
            const contribution = knownKeys.reduce((sum, key) => sum + known[key] * basis[key](x), 0)
            return y - contribution
        })

        const solved = Algebra.solveLinearSystem(matrix, vector)
        if (!solved) return null

        const result = { ...known }
        unknownKeys.forEach((key, i) => (result[key] = solved[i]))
        return result
    },

    getPointPairs(count = 1) {
        const raw = Algebra.point(count)
        const total = (count || 1) * 2
        const pairs = []
        for (let i = 0; i < total; i += 2) {
            pairs.push({ x: Checks.numericPoint(raw, i), y: Checks.numericPoint(raw, i + 1) })
        }
        return pairs
    },

    solvePolynomial(coefs = null) {
        const basis = { a: x => x * x, b: x => x, c: () => 1 }
        const eligible = { constant: ["c"], affine: ["b", "c"], quadratic: ["a", "b", "c"] }

        const degree = coefs.a === 0 && coefs.b === 0 ? "constant" : coefs.a === 0 ? "affine" : "quadratic"

        // Mantendo o comportamento original: em "constante", c é sempre recalculado
        const unknownKeys = degree === "constant" ? ["c"] : eligible[degree].filter(key => coefs[key] === key)

        if (unknownKeys.length === 0) return coefs

        const points = Algebra.getPointPairs(unknownKeys.length)
        return Algebra.solveLinearCoefs(basis, coefs, unknownKeys, points)
    },

    solveExponential(coefs = null) {
        const linearKeys = ["b", "c"]
        const unknownKeys = ["a", "b", "c"].filter(key => coefs[key] === key)
        if (unknownKeys.length === 0) return coefs

        if (unknownKeys.every(key => linearKeys.includes(key))) {
            const basis = { b: x => coefs.a ** x, c: () => 1 }
            return Algebra.solveLinearCoefs(basis, coefs, unknownKeys, Algebra.getPointPairs(unknownKeys.length))
        }

        if (unknownKeys.length === 1 && unknownKeys[0] === "a") {
            const [{ x, y }] = Algebra.getPointPairs(1)
            const a = Algebra.round(Algebra.division(y - coefs.c, coefs.b, false) ** Algebra.division(1, x, false))
            return { ...coefs, a }
        }

        if (unknownKeys.includes("a") && unknownKeys.includes("b")) {
            const [p0, p1] = Algebra.getPointPairs(2)
            const a = Algebra.round(
                Algebra.division(p0.y - coefs.c, p1.y - coefs.c, false) ** Algebra.division(1, p0.x - p1.x, false)
            )
            return { ...coefs, a, b: Algebra.division(p0.y - coefs.c, a ** p0.x) }
        }

        // TODO "a" e "c" juntos ainda não suportado
        Ui.warning(tr("algebra.cannotDetermine", { v1: "a", v2: "c", v3: "b" }), tr("algebra.underConstruction"))
        return { ...coefs, a: -1, c: 0 }
    },

    solveLogarithmic(coefs = null) {
        const linearKeys = ["b", "c"]
        const unknownKeys = ["a", "b", "c"].filter(key => coefs[key] === key)
        if (unknownKeys.length === 0) return coefs

        if (unknownKeys.every(key => linearKeys.includes(key))) {
            const basis = { b: x => Algebra.log(x, coefs.a), c: () => 1 }
            return Algebra.solveLinearCoefs(basis, coefs, unknownKeys, Algebra.getPointPairs(unknownKeys.length))
        }

        if (unknownKeys.length === 1 && unknownKeys[0] === "a") {
            const [{ x, y }] = Algebra.getPointPairs(1)
            return { ...coefs, a: Algebra.round(x ** Algebra.division(coefs.b, y - coefs.c, false)) }
        }

        if (unknownKeys.includes("a") && unknownKeys.includes("c")) {
            const [p0, p1] = Algebra.getPointPairs(2)
            const a = Algebra.round(
                Algebra.division(p0.x, p1.x, false) ** Algebra.division(coefs.b, p0.y - p1.y, false)
            )
            return { ...coefs, a, c: p0.y - coefs.b * Algebra.log(p0.x, a) }
        }

        // TODO - "a" e "b" juntos ainda não suportado
        Ui.warning(tr("algebra.cannotDetermine", { v1: "a", v2: "b", v3: "c" }), tr("algebra.underConstruction"))
        return { ...coefs, a: -1, b: 1, c: 0 }
    },

    resolveUnknown(coefs = { a: NaN, b: NaN, c: NaN }, funcType = "poly") {
        const solvers = { poly: Algebra.solvePolynomial, exp: Algebra.solveExponential, log: Algebra.solveLogarithmic }
        const solver = solvers[funcType] ?? Algebra.solvePolynomial // TODO - trig cai em poly

        if (funcType !== "poly") {
            if (coefs.a === 0 || coefs.a === 1 || coefs.b === 0) {
                return {
                    a: Checks.isFiniteNumber(coefs.a) ? coefs.a : 0,
                    b: Checks.isFiniteNumber(coefs.b) ? coefs.b : 0,
                    c: Checks.isFiniteNumber(coefs.c) ? coefs.c : 0,
                }
            }
        }

        Ui.function(coefs.a, coefs.b, coefs.c, funcType === "exp", funcType === "log", funcType)

        let current = coefs
        let limit = 0

        do {
            const solved = solver(current)

            if (!solved) {
                Errors.divZero(tr("algebra.invalidValues"))
                continue
            }

            const invalid = !["a", "b", "c"].every(key => Checks.isFiniteNumber(solved[key]))
            if (!invalid) return solved

            Errors.divZero(tr("algebra.invalidValues"))
            if (Ui.confirm(tr("algebra.changeValues"), tr("algebra.changeValuesExp"))) {
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

    /**
     * @deprecated Use Algebra.resolveUnknown(coefs, funcType). Mantido para compatibilidade.
     */
    unknown(coefA, coefB, coefC, funcExp = false, funcLog = false, funcTrig = "") {
        const funcType = funcExp ? "exp" : funcLog ? "log" : funcTrig || "poly"
        const result = Algebra.resolveUnknown({ a: coefA, b: coefB, c: coefC }, funcType)
        return [
            Number.isNaN(result.a) ? "a" : result.a,
            Number.isNaN(result.b) ? "b" : result.b,
            Number.isNaN(result.c) ? "c" : result.c,
        ]
    },

    log(x = 1, base = Math.E, precision = Config.logPrecision) {
        let y = x > 1 ? 1 : -1,
            number = 0,
            delta = 0,
            lnX = 0,
            lnBase = 0

        // Valida
        if (x <= 0 || base <= 0 || base == 1) {
            Errors.invalidLog("log", "x > 0 ∧ base > 0, base ≠ 1")
            return NaN
        }

        number = Algebra.ln(base)
        delta = Algebra.division(base ** y - x, base ** y * number, false)

        // Mudança de base
        if (base < 1) {
            lnX = Algebra.ln(x)
            lnBase = Algebra.ln(base)
            if (!Checks.isFiniteNumber(lnX) || !Checks.isFiniteNumber(lnBase) || lnBase == 0) {
                return NaN
            }

            return Algebra.division(lnX, lnBase)
        }

        // Loop
        let limit = 0
        while (Algebra.absolute(delta) > precision && limit < Config.interactionLimit) {
            delta = Algebra.division(base ** y - x, base ** y * number, false)
            y -= delta

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                return NaN
            }
        }

        return Algebra.round(y)
    },

    ln(x = 1, precision = Config.logPrecision) {
        let y = x > 1 ? 1 : -1,
            base = Math.E,
            delta = Algebra.division(base ** y - x, base ** y, false)

        // Valida
        if (x <= 0) {
            Errors.invalidLog("ln", "x > 0")
            return NaN
        }

        // Loop
        let limit = 0
        while (Algebra.absolute(delta) > precision && limit < Config.interactionLimit) {
            delta = Algebra.division(base ** y - x, base ** y, false)
            y -= delta

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                return NaN
            }
        }

        return Algebra.round(y)
    },

    division(numerator = 0, denominator = 1, round = true, precision = Config.divPrecision) {
        let result = 0

        numerator = Writing.decimal(numerator, true)
        denominator = Writing.decimal(denominator, true)

        // Valida
        if (denominator == 0 || !Checks.isFiniteNumber(numerator) || !Checks.isFiniteNumber(denominator)) {
            Ui.error(
                "[Algebra.division] Entrada inválida.",
                `numerator: ${String(numerator)} denominator: ${String(denominator)}`,
                true
            )
            return NaN
        }

        // Denominador pequeno
        if (Algebra.absolute(denominator) <= precision) {
            Ui.error("[Algebra.division] Denominador próximo de zero.", String(denominator), true)
            return NaN
        }

        result = numerator / denominator

        // Infinito
        if (!Checks.isFiniteNumber(result)) {
            return NaN
        }

        // Arredonda
        if (round) {
            return Algebra.round(result)
        }

        return result
    },

    absolute(number = 0, round = true, places = Config.decimalPlaces) {
        number = Writing.decimal(number, true)

        // Valida
        if (!Checks.isFiniteNumber(number)) {
            Ui.error(`[Algebra.absolute] Valor inválido: ${number}`, "", true)
            return NaN
        }

        if (round) {
            number = Algebra.round(number, places)
        }

        return Math.abs(number)
    },
}
