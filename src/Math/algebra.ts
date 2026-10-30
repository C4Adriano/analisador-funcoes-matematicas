import { isText } from "../Base/checks.js"
import { Config } from "../Base/config.js"
import { INPUT_FAILED, UNKNOWN_TOKEN } from "../Base/consts.js"
import { log, power, round } from "../Base/numeric.js"
import { callFunction, complex, isFunctionName, isInvalid, isLogBase, operate, real, SUFFIXES } from "../Base/quantity.js"
import { decimalOptions } from "../Lang/writing.js"
import { State } from "./state.js"

const COEF_KEYS: readonly Variable[] = ["a", "b", "c"]
type Count = 1 | 2 | 3
export interface AlgebraIO {
    readonly askExpression: (name: Variable, placeholder: string) => Promise<string | typeof INPUT_FAILED>
    readonly askPoints: <C extends Count>(count: C) => Promise<PointPairReturn<C>>
    readonly showFunction: (coefs: Partial<NamedCoefficients>, kind: FunctionType) => Promise<void>
    readonly notifyInvalidValues: () => Promise<void>
    readonly confirmChangeValues: () => Promise<boolean>
    readonly expressionError: (error: ExpressionError) => Promise<void>
}

type PointsReader = AlgebraIO["askPoints"]

function unwrap(result: QuantityResult): Quantity {
    if (result.kind === "invalid") throw new Error("errors.incompatible", { cause: result })
    return result.value
}

function numeric(value: NamedCoefficient): number {
    return typeof value === "number" ? value : 0
}

function evaluateExpression(expression = ""): ExpressionResult<typeof UNKNOWN_TOKEN> {
    if (/[^ %\(\)*+\-.\/0-9A-Z^a-z°√]/v.test(expression) || !isText(expression)) return { kind: "invalid", error: null }

    let pos = 0
    const ROOT_ALIASES = new Map<string, string>([
            ["√", "sqrt"],
            ["raiz", "sqrt"],
            ["raizQ", "sqrt"],
            ["raizC", "cbrt"],
        ]),
        tokens: (string | number)[] = expression
            .matchAll(/\d+\.?\d*|\.\d+|\*\*|√|[A-Za-z]+|\S/gv)
            .map((match): string | number => (/^\d/v.test(match[0]) || /^\.\d/v.test(match[0]) ? Number(match[0]) : match[0]))
            .toArray()

    function peek(): string | number | undefined {
        return tokens.at(pos)
    }

    function consume(): string | number | undefined {
        return tokens.at(pos++)
    }

    function parseGroup(): Quantity {
        consume()
        const value: Quantity = parseExpression()
        if (consume() === ")") return value
        throw new Error("errors.error007")
    }

    function parsePrimary(): Quantity {
        const token = peek()

        if (token === "(") return parseGroup()

        if (typeof token === "number") {
            consume()
            const suffix = peek(),
                build: Builder | null = (typeof suffix === "string" ? SUFFIXES.get(suffix) : null) ?? null
            if (build == null) return real(token)
            consume()
            return build(token)
        }

        if (token === "i") {
            consume()
            return complex(0, 1)
        }

        if (isText(token)) {
            const name: string = ROOT_ALIASES.get(token) ?? token
            if (isFunctionName(name)) {
                consume()
                if (peek() !== "(") throw new Error("errors.error008")
                return unwrap(callFunction(name, parseGroup()))
            }
        }

        if (isText(token) && /^[A-Za-z√]+$/v.test(token)) throw new Error("unknown token", { cause: UNKNOWN_TOKEN })

        throw new Error("errors.error009")
    }

    function parsePercent(): Quantity {
        let value: Quantity = parsePrimary()
        while (peek() === "%") {
            consume()
            value = unwrap(operate("/", value, real(100)))
        }
        return value
    }

    function parsePower(): Quantity {
        const base: Quantity = parsePercent()
        if (peek() !== "^" && peek() !== "**") return base

        consume()
        return unwrap(operate("^", base, parseUnary()))
    }

    function parseUnary(): Quantity {
        const token = peek()
        if (token === "-" || token === "+") {
            consume()
            return token === "-" ? unwrap(operate("*", real(-1), parseUnary())) : parseUnary()
        }
        return parsePower()
    }

    function parseBinaryLeft(next: () => Quantity, ops: Operator[]): Quantity {
        let value: Quantity = next()
        while (isText(peek()) && ops.includes(peek() as Operator)) {
            value = unwrap(operate(consume() as Operator, value, next()))
        }
        return value
    }

    function parseTerm(): Quantity {
        return parseBinaryLeft(parseUnary, ["*", "/"])
    }

    function parseExpression(): Quantity {
        return parseBinaryLeft(parseTerm, ["+", "-"])
    }

    let result: Quantity
    try {
        result = parseExpression()
    } catch (error) {
        if (!Error.isError(error)) return { kind: "invalid", error: null }
        if (error.cause === UNKNOWN_TOKEN) return { kind: "symbol", name: UNKNOWN_TOKEN }
        return { kind: "invalid", error: isInvalid(error.cause) ? error.cause : null }
    }

    return pos === tokens.length ? { kind: "valid", value: result } : { kind: "invalid", error: null }
}

export async function variables<Name extends Variable>(io: AlgebraIO, name: Name, placeholder: string = name): Promise<number | Name> {
    for (;;) {
        const asked: string | typeof INPUT_FAILED = await io.askExpression(name, placeholder)
        if (asked === INPUT_FAILED) return name

        const raw: string = decimalOptions(asked, { type: "number" }),
            result: ExpressionResult<typeof UNKNOWN_TOKEN> = evaluateExpression(raw)

        if (result.kind === "symbol") return name

        if (result.kind === "invalid") {
            if (result.error != null) await io.expressionError(result.error)
            placeholder = decimalOptions(raw)
            continue
        }

        if (result.value.kind !== "real") {
            await io.expressionError({ kind: "notReal", actual: result.value.kind })
            placeholder = decimalOptions(raw)
            continue
        }

        return round(result.value.value)
    }
}

function uniquePoints(points: Point[]): Point[] | null {
    const unique = new Map<number, number>()

    for (const { x, y } of points) {
        if (unique.has(x) && unique.get(x) !== y) return null
        unique.set(x, y)
    }

    return Array.from(unique, ([x, y]) => ({ x, y }))
}

function evaluateBasis(basis: LinearBasis, key: Variable, x: number): number | null {
    return basis[key]?.(x) ?? null
}

function solveLinearCoefs(basis: LinearBasis, known: NamedCoefficients, unknownKeys: Variable[], points: Point[]): NamedCoefficients | null {
    const knownKeys = (Object.keys(basis) as Variable[]).filter(key => !unknownKeys.includes(key)),
        m: number[][] = [],
        v: number[] = []

    for (const { x, y } of points) {
        const row: number[] = []
        let rhs: number = y

        for (const key of unknownKeys) {
            const value: number | null = evaluateBasis(basis, key, x)
            if (value == null) return null
            row.push(value)
        }

        for (const key of knownKeys) {
            const value: number | null = evaluateBasis(basis, key, x)
            if (value == null) return null
            rhs -= numeric(known[key]) * value
        }

        m.push(row)
        v.push(rhs)
    }

    const n = v.length,
        tolerance = 1e-12 * Math.max(...m.flat().map(value => Math.abs(value)))

    for (let col = 0; col < n; col++) {
        let pivotRow = col
        for (let row = col + 1; row < n; row++) if (Math.abs(m[row]![col]!) > Math.abs(m[pivotRow]![col]!)) pivotRow = row

        if (Math.abs(m[pivotRow]![col]!) <= tolerance) return null

        const pivotM = m[pivotRow]!,
            pivotV = v[pivotRow]!
        m[pivotRow] = m[col]!
        m[col] = pivotM
        v[pivotRow] = v[col]!
        v[col] = pivotV

        for (let row = col + 1; row < n; row++) {
            const factor = m[row]![col]! / m[col]![col]!
            for (let k = col; k < n; k++) m[row]![k]! -= factor * m[col]![k]!
            v[row]! -= factor * v[col]!
        }
    }

    const solved: number[] = Array.from({ length: n })
    for (let row = n - 1; row >= 0; row--) {
        let sum = v[row]!
        for (let k = row + 1; k < n; k++) sum -= m[row]![k]! * solved[k]!
        solved[row] = sum / m[row]![row]!
    }

    const result: NamedCoefficients = { ...known }
    for (const [index, key] of unknownKeys.entries()) {
        const value: number | null = round(solved[index] ?? null)
        if (value == null) return null
        result[key] = value
    }

    return result
}

async function solvePolynomial(coefs: NamedCoefficients, askPoints: PointsReader): Promise<SimpleResult<NamedCoefficients>> {
    const degree: "constant" | "affine" | "quadratic" = coefs.a === 0 && coefs.b === 0 ? "constant" : coefs.a === 0 ? "affine" : "quadratic",
        unknownKeys: Variable[] = degree === "constant" ? ["c"] : COEF_KEYS.filter(key => coefs[key] === key)

    if (unknownKeys.length === 0) return { kind: "valid", value: coefs }

    const basis: LinearBasis = { a: x => x * x, b: x => x, c: () => 1 },
        eligible: Record<"constant" | "affine" | "quadratic", Variable[]> = { constant: ["c"], affine: ["b", "c"], quadratic: ["a", "b", "c"] }
    if (degree !== "constant") unknownKeys.splice(0, unknownKeys.length, ...eligible[degree].filter(key => coefs[key] === key))

    const points: Point[] | null = uniquePoints(await askPoints(unknownKeys.length as Count))
    if (points == null) return { kind: "invalid" }

    const dropped: Variable[] = unknownKeys.splice(0, unknownKeys.length - points.length),
        known: NamedCoefficients = { ...coefs }
    for (const key of dropped) known[key] = 0

    const linear: NamedCoefficients | null = solveLinearCoefs(basis, known, unknownKeys, points)
    return linear == null ? { kind: "invalid" } : { kind: "valid", value: linear }
}

async function solveExponential(coefs: NamedCoefficients, askPoints: PointsReader): Promise<NotedResult<NamedCoefficients, { v1: "a"; v2: "c"; v3: "b" }>> {
    const unknownKeys: Variable[] = COEF_KEYS.filter(key => coefs[key] === key)
    if (unknownKeys.length === 0) return { kind: "valid", value: coefs }

    const linearKeys = new Set<Variable>(["b", "c"])
    if (unknownKeys.every(key => linearKeys.has(key))) {
        const linear: NamedCoefficients | null = solveLinearCoefs({ b: x => power(numeric(coefs.a), x), c: () => 1 }, coefs, unknownKeys, await askPoints(unknownKeys.length as Count))
        return linear == null ? { kind: "invalid" } : { kind: "valid", value: linear }
    }

    if (unknownKeys.length === 1 && unknownKeys[0] === "a") {
        const [point] = await askPoints(1),
            candidate = ((point.y - numeric(coefs.c)) / numeric(coefs.b)) ** (1 / point.x),
            solved: number | null = Number.isFinite(candidate) ? round(candidate) : null
        return { kind: "valid", value: { ...coefs, a: solved ?? "a" } }
    }

    if (unknownKeys.includes("a") && unknownKeys.includes("b")) {
        const [p0, p1] = await askPoints(2),
            yc0: number = p0.y - numeric(coefs.c),
            yc1: number = p1.y - numeric(coefs.c),
            base: number = (yc0 / yc1) ** (1 / (p0.x - p1.x)),
            coefficient: number = yc0 / base ** p0.x
        return { kind: "valid", value: { ...coefs, a: Number.isFinite(base) ? round(base) : "a", b: Number.isFinite(coefficient) ? round(coefficient) : "b" } }
    }

    return { kind: "note", note: { v1: "a", v2: "c", v3: "b" }, value: { ...coefs, a: -1, c: 0 } }
}

async function solveLogarithmic(coefs: NamedCoefficients, askPoints: PointsReader): Promise<NotedResult<NamedCoefficients, { v1: "a"; v2: "b"; v3: "c" }>> {
    const unknownKeys: Variable[] = COEF_KEYS.filter(key => coefs[key] === key)
    if (unknownKeys.length === 0) return { kind: "valid", value: coefs }

    const linearKeys = new Set<Variable>(["b", "c"])
    if (unknownKeys.every(key => linearKeys.has(key))) {
        const base: number = numeric(coefs.a),
            linear: NamedCoefficients | null = solveLinearCoefs({ b: x => (x > 0 && isLogBase(base) ? log(x, base) : null), c: () => 1 }, coefs, unknownKeys, await askPoints(unknownKeys.length as Count))
        return linear == null ? { kind: "invalid" } : { kind: "valid", value: linear }
    }

    if (unknownKeys.length === 1 && unknownKeys[0] === "a") {
        const [point] = await askPoints(1),
            candidate = point.x ** (numeric(coefs.b) / (point.y - numeric(coefs.c))),
            solved: number | null = Number.isFinite(candidate) ? round(candidate) : null
        return { kind: "valid", value: { ...coefs, a: solved ?? "a" } }
    }

    if (unknownKeys.includes("a") && unknownKeys.includes("c")) {
        const [p0, p1] = await askPoints(2),
            base: number = (p0.x / p1.x) ** (numeric(coefs.b) / (p0.y - p1.y))
        if (p0.x <= 0 || !isLogBase(base) || !Number.isFinite(base)) return { kind: "valid", value: coefs }

        const solvedC = p0.y - numeric(coefs.b) * log(p0.x, base)
        return { kind: "valid", value: { ...coefs, a: round(base), c: Number.isFinite(solvedC) ? round(solvedC) : "c" } }
    }

    return { kind: "note", note: { v1: "a", v2: "b", v3: "c" }, value: { ...coefs, a: -1, b: 1, c: 0 } }
}

export async function resolveUnknown(io: AlgebraIO, { a = State.current.numericA, b = State.current.numericB, c = State.current.numericC }: Partial<NamedCoefficients> = {}, kind: FunctionType = "poly"): Promise<NamedCoefficients> {
    const coefs: NamedCoefficients = { a, b, c }

    if (kind !== "poly" && (coefs.a === 0 || coefs.a === 1 || coefs.b === 0)) return { a: numeric(coefs.a), b: numeric(coefs.b), c: numeric(coefs.c) }

    await io.showFunction(coefs, kind)
    const solvers: Partial<Record<FunctionType, (coefs: NamedCoefficients, askPoints: PointsReader) => Promise<NotedResult<NamedCoefficients, { v1: "a"; v2: "b" | "c"; v3: "b" | "c" }>>>> = { poly: solvePolynomial, exp: solveExponential, log: solveLogarithmic },
        solver = solvers[kind]

    if (solver == null) return coefs
    let current: NamedCoefficients = coefs,
        limit = 0

    do {
        const solved = await solver(current, io.askPoints)

        if (solved.kind === "invalid") {
            await io.notifyInvalidValues()
            continue
        }

        if (COEF_KEYS.every(key => typeof solved.value[key] === "number")) return solved.value

        await io.notifyInvalidValues()
        if (await io.confirmChangeValues()) {
            State.askCoeffs = "on"
            State.loop = "on"
            return { a: "a", b: "b", c: "c" }
        }

        current = solved.value
    } while (limit++ < Config.iterationLimit)

    return current
}
