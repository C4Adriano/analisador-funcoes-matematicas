import { isFiniteNumber, isValidText } from "../Core/checks.js";
import { Config } from "../Core/config.js";
import { UNKNOWN_TOKEN } from "../Core/consts.js";
import { State } from "../Core/state.js";
import { tr } from "../Lang/i18n.js";
import { decimalOptions, subscript } from "../Lang/writing.js";
import { input, notify } from "../UI/display.js";
import { resolveFunction } from "../UI/ui.js";
import { divisionOptions, logOptions, round } from "./numeric.js";
const COEF_KEYS = ["a", "b", "c"];
function evaluateExpression(expression = "") {
    if (/[^ %\(\)*+\-.\/0-9A-Z^a-z√]/v.test(expression) || !isValidText(expression))
        return { kind: "invalid" };
    let pos = 0;
    const ROOTS = { "√": 2, sqrt: 2, raiz: 2, raizQ: 2, cbrt: 3, raizC: 3 }, tokens = expression
        .matchAll(/\d+\.?\d*|\.\d+|\*\*|√|[A-Za-z]+|\S/gv)
        .map((match) => (/^\d/v.test(match[0]) || /^\.\d/v.test(match[0]) ? Number(match[0]) : match[0]))
        .toArray();
    function peek() {
        return tokens.at(pos);
    }
    function consume() {
        return tokens.at(pos++);
    }
    function parsePrimary() {
        const token = peek();
        let value;
        if (token === "(") {
            consume();
            value = parseExpression();
            if (peek() !== ")")
                throw "errors.error007";
            consume();
            return value;
        }
        if (isFiniteNumber(token))
            return Number(consume());
        if (isValidText(token) && Object.hasOwn(ROOTS, token)) {
            const degree = ROOTS[token];
            consume();
            if (peek() !== "(")
                throw "errors.error008";
            consume();
            value = parseExpression();
            if (peek() !== ")")
                throw "errors.error007";
            consume();
            return degree === 3 ? Math.cbrt(value) : Math.sqrt(value);
        }
        if (isValidText(token) && /^[A-Za-z√]+$/v.test(token))
            throw UNKNOWN_TOKEN;
        throw "errors.error009";
    }
    function parsePercent() {
        let value = parsePrimary();
        while (peek() === "%") {
            consume();
            value /= 100;
        }
        return value;
    }
    function parsePower() {
        const base = parsePercent();
        if (peek() !== "^" && peek() !== "**")
            return base;
        consume();
        return base ** parseUnary();
    }
    function parseUnary() {
        const token = peek();
        if (token === "-" || token === "+") {
            consume();
            return token === "-" ? -parseUnary() : parseUnary();
        }
        return parsePower();
    }
    function parseBinaryLeft(next, ops) {
        let value = next();
        while (isValidText(peek()) && Object.hasOwn(ops, peek())) {
            value = ops[consume()](value, next());
        }
        return value;
    }
    function parseTerm() {
        return parseBinaryLeft(parseUnary, { "*": (a, b) => a * b, "/": (a, b) => a / b });
    }
    function parseExpression() {
        return parseBinaryLeft(parseTerm, { "+": (a, b) => a + b, "-": (a, b) => a - b });
    }
    let error, result = NaN;
    try {
        result = parseExpression();
    }
    catch (e) {
        error = e;
    }
    if (error === UNKNOWN_TOKEN)
        return { kind: "symbol", name: UNKNOWN_TOKEN };
    return error != null || pos !== tokens.length || !isFiniteNumber(result) ? { kind: "invalid" } : { kind: "valid", value: result };
}
export function variables(name, placeholder = name) {
    for (;;) {
        const raw = decimalOptions(input(`${name} = `, { explanation: tr("algebra.variableAsk", { name }), placeholder }), { type: "number" }), result = evaluateExpression(raw);
        if (result.kind === "invalid") {
            placeholder = decimalOptions(raw);
            continue;
        }
        return result.kind === "symbol" ? name : round(result.value);
    }
}
function getPointPairs(count) {
    const pairs = [];
    for (let i = 1; i <= count; i++) {
        const x = input(`x${subscript(i)} = `, { type: "number", placeholder: String(i) }), y = input(`y${subscript(i)} = `, { type: "number", placeholder: String(i) });
        pairs.push({ x: isFiniteNumber(x) ? x : NaN, y: isFiniteNumber(y) ? y : NaN });
    }
    return pairs;
}
function uniquePoints(points) {
    const unique = new Map();
    for (const { x, y } of points) {
        if (unique.has(x) && unique.get(x) !== y)
            return null;
        unique.set(x, y);
    }
    return Array.from(unique, ([x, y]) => ({ x, y }));
}
function solveLinearCoefs(basis, known, unknownKeys, points) {
    const knownKeys = Object.keys(basis).filter(key => !unknownKeys.includes(key)), m = points.map(({ x }) => unknownKeys.map(key => basis[key](x))), v = points.map(({ x, y }) => y - knownKeys.reduce((sum, key) => sum + Number(known[key]) * basis[key](x), 0)), n = v.length, tolerance = 1e-12 * Math.max(...m.flat().map(value => Math.abs(value)));
    for (let col = 0; col < n; col++) {
        let pivotRow = col;
        for (let row = col + 1; row < n; row++)
            if (Math.abs(m[row][col]) > Math.abs(m[pivotRow][col]))
                pivotRow = row;
        if (Math.abs(m[pivotRow][col]) <= tolerance)
            return null;
        [m[col], m[pivotRow]] = [m[pivotRow], m[col]];
        [v[col], v[pivotRow]] = [v[pivotRow], v[col]];
        for (let row = col + 1; row < n; row++) {
            const factor = m[row][col] / m[col][col];
            for (let k = col; k < n; k++)
                m[row][k] -= factor * m[col][k];
            v[row] -= factor * v[col];
        }
    }
    const solved = Array.from({ length: n });
    for (let row = n - 1; row >= 0; row--) {
        let sum = v[row];
        for (let k = row + 1; k < n; k++)
            sum -= m[row][k] * solved[k];
        solved[row] = sum / m[row][row];
    }
    const result = { ...known };
    for (const [i, key] of unknownKeys.entries())
        result[key] = round(solved[i]);
    return result;
}
function solvePolynomial({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c }, degree = coefs.a === 0 && coefs.b === 0 ? "constant" : coefs.a === 0 ? "affine" : "quadratic", unknownKeys = degree === "constant" ? ["c"] : COEF_KEYS.filter(key => coefs[key] === key);
    if (unknownKeys.length === 0)
        return { kind: "valid", value: coefs };
    const basis = { a: x => x * x, b: x => x, c: () => 1 }, eligible = { constant: ["c"], affine: ["b", "c"], quadratic: ["a", "b", "c"] };
    if (degree !== "constant")
        unknownKeys.splice(0, unknownKeys.length, ...eligible[degree].filter(key => coefs[key] === key));
    const points = uniquePoints(getPointPairs(unknownKeys.length));
    if (points == null)
        return { kind: "invalid" };
    const dropped = unknownKeys.splice(0, unknownKeys.length - points.length), known = { ...coefs }, linear = (() => {
        for (const key of dropped)
            known[key] = 0;
        return solveLinearCoefs(basis, known, unknownKeys, points);
    })();
    return linear == null ? { kind: "invalid" } : { kind: "valid", value: linear };
}
function solveExponential({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c }, unknownKeys = COEF_KEYS.filter(key => coefs[key] === key);
    if (unknownKeys.length === 0)
        return { kind: "valid", value: coefs };
    const linearKeys = new Set(["b", "c"]);
    if (unknownKeys.every(key => linearKeys.has(key))) {
        const linear = solveLinearCoefs({ b: x => Number(coefs.a) ** x, c: () => 1 }, coefs, unknownKeys, getPointPairs(unknownKeys.length));
        return linear == null ? { kind: "invalid" } : { kind: "valid", value: linear };
    }
    if (unknownKeys.length === 1 && unknownKeys[0] === "a") {
        const [point] = getPointPairs(1);
        coefs.a = round(divisionOptions(point.y - Number(coefs.c), Number(coefs.b), { shouldRound: false }) ** divisionOptions(1, point.x, { shouldRound: false }));
        return { kind: "valid", value: coefs };
    }
    if (unknownKeys.includes("a") && unknownKeys.includes("b")) {
        const [p0, p1] = getPointPairs(2), yc0 = p0.y - Number(coefs.c), yc1 = p1.y - Number(coefs.c), _a = divisionOptions(yc0, yc1, { shouldRound: false }) ** divisionOptions(1, p0.x - p1.x, { shouldRound: false });
        coefs.b = divisionOptions(yc0, _a ** p0.x);
        coefs.a = round(_a);
        return { kind: "valid", value: coefs };
    }
    return { kind: "note", note: { v1: "a", v2: "c", v3: "b" }, value: { ...coefs, a: -1, c: 0 } };
}
function solveLogarithmic({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}) {
    const coefs = { a, b, c }, unknownKeys = COEF_KEYS.filter(key => coefs[key] === key);
    if (unknownKeys.length === 0)
        return { kind: "valid", value: coefs };
    const linearKeys = new Set(["b", "c"]);
    if (unknownKeys.every(key => linearKeys.has(key))) {
        const linear = solveLinearCoefs({ b: x => logOptions(x, Number(coefs.a)), c: () => 1 }, coefs, unknownKeys, getPointPairs(unknownKeys.length));
        return linear == null ? { kind: "invalid" } : { kind: "valid", value: linear };
    }
    if (unknownKeys.length === 1 && unknownKeys[0] === "a") {
        const [point] = getPointPairs(1);
        coefs.a = round(point.x ** divisionOptions(Number(coefs.b), point.y - Number(coefs.c), { shouldRound: false }));
        return { kind: "valid", value: coefs };
    }
    if (unknownKeys.includes("a") && unknownKeys.includes("c")) {
        const [p0, p1] = getPointPairs(2), _a = divisionOptions(p0.x, p1.x, { shouldRound: false }) ** divisionOptions(Number(coefs.b), p0.y - p1.y, { shouldRound: false });
        coefs.c = round(p0.y - Number(coefs.b) * logOptions(p0.x, _a));
        coefs.a = round(_a);
        return { kind: "valid", value: coefs };
    }
    return { kind: "note", note: { v1: "a", v2: "b", v3: "c" }, value: { ...coefs, a: -1, b: 1, c: 0 } };
}
export function resolveUnknown({ a = State.current.numericA, b = State.current.numericB, c = State.current.numericC } = {}, funcType = "poly") {
    const coefs = { a, b, c };
    if (funcType !== "poly" && (coefs.a === 0 || coefs.a === 1 || coefs.b === 0))
        return { a: isFiniteNumber(coefs.a) ? coefs.a : 0, b: isFiniteNumber(coefs.b) ? coefs.b : 0, c: isFiniteNumber(coefs.c) ? coefs.c : 0 };
    resolveFunction(coefs, funcType);
    const solvers = { poly: solvePolynomial, exp: solveExponential, log: solveLogarithmic }, solver = solvers[funcType];
    if (solver == null)
        return coefs;
    let [current, limit] = [coefs, 0];
    do {
        const solved = solver(current);
        if (solved.kind === "invalid") {
            notify(tr("errors.error002"), { explanation: tr("errors.reason", { reason: tr("algebra.invalidValues") }), type: "error" });
            continue;
        }
        if (COEF_KEYS.every(key => isFiniteNumber(solved.value[key])))
            return solved.value;
        notify(tr("errors.error002"), { explanation: tr("errors.reason", { reason: tr("algebra.invalidValues") }), type: "error" });
        if (notify(tr("algebra.changeValues"), { explanation: tr("algebra.changeValuesExp"), type: "confirm" })) {
            State.askCoeffs = "on";
            State.loop = "on";
            return { a: "a", b: "b", c: "c" };
        }
        current = Object.fromEntries(COEF_KEYS.map(key => [key, isFiniteNumber(solved.value[key]) ? solved.value[key] : key]));
    } while (limit++ < Config.iterationLimit);
    return current;
}
