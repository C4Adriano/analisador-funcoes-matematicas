import { isFiniteNumber, isFinitesNumbers, isValidText } from "./checks.js";
import { Config } from "./config.js";
import { UNKNOWN_TOKEN } from "./consts.js";
import { input, notify } from "./display.js";
import { errorDivZero, errorInvalidLog } from "./errors.js";
import { calculateDelta, exceededLimit, showDelta } from "./helpers.js";
import { isTrKey, tr } from "./i18n.js";
import { State } from "./state.js";
import { resolveFunction } from "./ui.js";
import { decimalOptions, subscript } from "./writing.js";
const COEF_KEYS = ["a", "b", "c"];
function absoluteOptions(number = 0, { shouldRound = true, places = Config.decimalPlaces } = {}) {
    return isFiniteNumber(number) ? Math.abs(shouldRound ? round(number, places) : number) : NaN;
}
function divisionOptions(numerator = 0, denominator = 1, { shouldRound = true, precision = Config.divPrecision } = {}) {
    const result = numerator / denominator;
    return denominator !== 0 && isFinitesNumbers([numerator, denominator, result]) && absoluteOptions(denominator) > precision ? (shouldRound ? round(result) : result) : NaN;
}
function evaluateExpression(expression = "") {
    if (/[^ %\(\)*+\-.\/0-9A-Z^a-z√]/v.test(expression) || !isValidText(expression))
        return NaN;
    let pos = 0;
    const ROOTS = { "√": 2, sqrt: 2, raiz: 2, raizQ: 2, cbrt: 3, raizC: 3 }, tokens = tokenize(expression);
    function peek() {
        return tokens[pos];
    }
    function consume() {
        const token = tokens[pos];
        pos++;
        return token;
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
            return value ** (1 / Number(degree));
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
        const values = [parsePercent()];
        while (peek() === "^" || peek() === "**") {
            consume();
            values.push(parsePercent());
        }
        let value = values.pop();
        while (values.length > 0)
            value = values.pop() ** value;
        return value;
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
    let error, result;
    try {
        result = parseExpression();
    }
    catch (e) {
        error = e;
    }
    if (error === UNKNOWN_TOKEN)
        return NaN;
    if (isTrKey(error))
        notify(tr(error));
    return error == null && pos === tokens.length ? result : null;
}
function getPointPairs(count = 1) {
    if (![1, 2, 3].includes(count))
        count = 1;
    const raw = point(count), total = count * 2, pairs = [];
    for (let i = 0; i < total; i += 2)
        pairs.push({ x: numericPoint(raw, i), y: numericPoint(raw, i + 1) });
    return pairs;
}
function lnOptions(x = 1, { shouldRound = false, places = Config.decimalPlaces, precision = Config.logPrecision } = {}) {
    return logOptions(x, Math.E, { precision, shouldRound, places });
}
function logOptions(x = 1, base = Math.E, { shouldRound = false, places = Config.decimalPlaces, precision = Config.logPrecision } = {}) {
    const isNatural = round(base) === round(Math.E);
    if (!validateLogOptions(x, base, isNatural))
        return NaN;
    if (base < 1)
        return divisionOptions(lnOptions(x, { precision, shouldRound }), lnOptions(base, { precision, shouldRound }));
    const lnBase = isNatural ? 1 : lnOptions(base, { precision, shouldRound });
    let y = x > 1 ? 1 : -1, delta = divisionOptions(base ** y - x, base ** y * lnBase, { shouldRound: false }), limit = 0;
    while (absoluteOptions(delta) > precision) {
        delta = divisionOptions(base ** y - x, base ** y * lnBase, { shouldRound: false });
        y -= delta;
        limit++;
        if (exceededLimit(limit))
            return NaN;
    }
    return shouldRound ? round(y, places) : y;
}
function numericPoint(points, index) {
    return decimalOptions(points.at(index) ?? 0, { invert: true });
}
function onePoint() {
    return getPointPairs(1)[0] ?? null;
}
function point(type) {
    const t = type ?? 1, array = [];
    for (let i = 1; i <= t; i++)
        array.push(input(`x${subscript(i)} = `, { number: true, placeholder: String(i) }), input(`y${subscript(i)} = `, { number: true, placeholder: String(i) }));
    return array;
}
function resolveEquations({ a1 = 0, b1 = 0, c1 = 0 } = {}, { a2 = 0, b2 = 0, c2 = 0 } = {}) {
    const [a, b, c] = [a1 - a2, b1 - b2, c1 - c2];
    if (a === 0 && b === 0)
        return c === 0 ? notify(tr("algebra.constantCoincide"), { explanation: tr("algebra.constantCoincideExp") }) : notify(tr("algebra.constantDistinct"), { explanation: tr("algebra.constantDistinctExp") });
    if (a === 0)
        return notify(tr("algebra.oneRoot", { x: decimalOptions(divisionOptions(-c, b)) }), { explanation: "x = −c / b" });
    const [delta, root1, root2] = calculateDelta({ a, b, c }), [x1, x2] = [decimalOptions(root1), decimalOptions(root2)];
    return showDelta(delta, tr("algebra.quadraticDistinct"), tr("algebra.oneRoot", { x: x1 }), tr("algebra.twoRoots", { x1, x2 }));
}
function resolveUnknown(partial = {}, functionType = "poly") {
    const coefs = withDefaults(partial);
    if (functionType !== "poly" && (coefs.a === 0 || coefs.a === 1 || coefs.b === 0))
        return { a: isFiniteNumber(coefs.a) ? coefs.a : 0, b: isFiniteNumber(coefs.b) ? coefs.b : 0, c: isFiniteNumber(coefs.c) ? coefs.c : 0 };
    resolveFunction(coefs, functionType);
    return resolveUnknownLoop(coefs, functionType);
}
function resolveUnknownLoop(coefs, functionType) {
    const solvers = { poly: solvePolynomial, exp: solveExponential, log: solveLogarithmic }, solver = solvers[functionType];
    if (!solver)
        return coefs;
    let [current, limit] = [coefs, 0];
    do {
        const solved = solver(current);
        if (!solved) {
            errorDivZero(tr("algebra.invalidValues"));
            continue;
        }
        if (COEF_KEYS.every(key => isFiniteNumber(solved[key])))
            return solved;
        errorDivZero(tr("algebra.invalidValues"));
        if (notify(tr("algebra.changeValues"), { explanation: tr("algebra.changeValuesExp"), type: "confirm" })) {
            State.askCoeffs = true;
            State.loop = true;
            return { a: "a", b: "b", c: "c" };
        }
        current = Object.fromEntries(COEF_KEYS.map(key => [key, isFiniteNumber(solved[key]) ? solved[key] : key]));
        limit++;
    } while (!exceededLimit(limit));
    return COEF_KEYS.every(key => isFiniteNumber(current[key])) ? current : { a: NaN, b: NaN, c: NaN };
}
function round(number = 0, places = Config.decimalPlaces) {
    if (!isFiniteNumber(places) || places < 0)
        places = Config.decimalPlaces;
    if (isFiniteNumber(number))
        number = Math.round(number * 10 ** places) / 10 ** places;
    return number === 0 ? 0 : number;
}
function solveExponential(partial = {}) {
    const coefs = withDefaults(partial), unknownKeys = COEF_KEYS.filter(key => coefs[key] === key);
    if (unknownKeys.length === 0)
        return coefs;
    const linearKeys = new Set(["b", "c"]);
    if (unknownKeys.every(key => linearKeys.has(key)))
        return solveLinearCoefs({ b: x => Number(coefs.a) ** x, c: () => 1 }, coefs, unknownKeys, getPointPairs(unknownKeys.length));
    if (unknownKeys.length === 1 && unknownKeys[0] === "a")
        return solveExponentialA(coefs);
    if (unknownKeys.includes("a") && unknownKeys.includes("b"))
        return solveExponentialAB(coefs);
    notify(tr("algebra.cannotDetermine", { v1: "a", v2: "c", v3: "b" }), { explanation: tr("algebra.underConstruction"), type: "warning" });
    return { ...coefs, a: -1, c: 0 };
}
function solveExponentialA(coefs) {
    const p = onePoint();
    if (!p)
        return { ...coefs, a: -1 };
    const a = round(divisionOptions(p.y - Number(coefs.c), Number(coefs.b), { shouldRound: false }) ** divisionOptions(1, p.x, { shouldRound: false }));
    return { ...coefs, a };
}
function solveExponentialAB(coefs) {
    const points = twoPoints();
    if (!points)
        return { ...coefs, a: -1 };
    const [p0, p1] = points, a = round(divisionOptions(p0.y - Number(coefs.c), p1.y - Number(coefs.c), { shouldRound: false }) ** divisionOptions(1, p0.x - p1.x, { shouldRound: false }));
    return { ...coefs, a, b: divisionOptions(p0.y - Number(coefs.c), a ** p0.x) };
}
function solveLinearCoefs(basis, known, unknownKeys, points) {
    const knownKeys = Object.keys(basis).filter(key => !unknownKeys.includes(key)), matrix = points.map(({ x }) => unknownKeys.map(key => basis[key](x))), vector = points.map(({ x, y }) => y - knownKeys.reduce((sum, key) => sum + known[key] * basis[key](x), 0)), solved = solveLinearSystem(matrix, vector);
    if (!solved)
        return null;
    const result = { ...known };
    for (const [i, k] of unknownKeys.entries())
        result[k] = solved[i];
    return result;
}
function solveLinearSystem(matrix, vector) {
    const n = vector.length, m = matrix.map(row => [...row]), v = [...vector];
    for (let col = 0; col < n; col++) {
        let pivotRow = col;
        for (let row = col + 1; row < n; row++)
            if (absoluteOptions(m[row][col]) > absoluteOptions(m[pivotRow][col]))
                pivotRow = row;
        if (m[pivotRow][col] === 0)
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
    const solution = Array.from({ length: n });
    for (let row = n - 1; row >= 0; row--) {
        let sum = v[row];
        for (let k = row + 1; k < n; k++)
            sum -= m[row][k] * solution[k];
        solution[row] = divisionOptions(sum, m[row][row]);
    }
    return solution;
}
function solveLogarithmic(partial = {}) {
    const coefs = withDefaults(partial), unknownKeys = COEF_KEYS.filter(key => coefs[key] === key);
    if (unknownKeys.length === 0)
        return coefs;
    const linearKeys = new Set(["b", "c"]);
    if (unknownKeys.every(key => linearKeys.has(key)))
        return solveLinearCoefs({ b: x => logOptions(x, Number(coefs.a)), c: () => 1 }, coefs, unknownKeys, getPointPairs(unknownKeys.length));
    if (unknownKeys.length === 1 && unknownKeys[0] === "a")
        return solveLogarithmicA(coefs);
    if (unknownKeys.includes("a") && unknownKeys.includes("c"))
        return solveLogarithmicAC(coefs);
    notify(tr("algebra.cannotDetermine", { v1: "a", v2: "b", v3: "c" }), { explanation: tr("algebra.underConstruction"), type: "warning" });
    return { ...coefs, a: -1, b: 1, c: 0 };
}
function solveLogarithmicA(coefs) {
    const p = onePoint();
    return p == null ? { ...coefs, a: -1 } : { ...coefs, a: round(p.x ** divisionOptions(Number(coefs.b), p.y - Number(coefs.c), { shouldRound: false })) };
}
function solveLogarithmicAC(coefs) {
    const points = twoPoints();
    if (!points)
        return { ...coefs, a: -1 };
    const [p0, p1] = points, a = round(divisionOptions(p0.x, p1.x, { shouldRound: false }) ** divisionOptions(Number(coefs.b), p0.y - p1.y, { shouldRound: false }));
    return { ...coefs, a, c: p0.y - Number(coefs.b) * logOptions(p0.x, a) };
}
function solvePolynomial(partial = {}) {
    const coefs = withDefaults(partial), degree = coefs.a === 0 && coefs.b === 0 ? "constant" : coefs.a === 0 ? "affine" : "quadratic", unknownKeys = degree === "constant" ? ["c"] : COEF_KEYS.filter(key => coefs[key] === key);
    if (unknownKeys.length === 0)
        return coefs;
    const basis = { a: x => x * x, b: x => x, c: () => 1 }, eligible = { constant: ["c"], affine: ["b", "c"], quadratic: ["a", "b", "c"] };
    if (degree !== "constant")
        unknownKeys.splice(0, unknownKeys.length, ...eligible[degree].filter(key => coefs[key] === key));
    return solveLinearCoefs(basis, coefs, unknownKeys, getPointPairs(unknownKeys.length));
}
function tokenize(expression = "") {
    return expression
        .matchAll(/\d+\.?\d*|\.\d+|\*\*|√|[A-Za-z]+|\S/gv)
        .map((match) => (/^\d/v.test(match[0]) || /^\.\d/v.test(match[0]) ? Number(match[0]) : match[0]))
        .toArray();
}
function twoPoints() {
    const [p0, p1] = getPointPairs(2);
    return p0 == null || p1 == null ? null : [p0, p1];
}
function validateLogOptions(x = 1, base = Math.E, isNatural = false) {
    if (x > 0 && (isNatural || (base !== 1 && base > 0)))
        return true;
    isNatural ? errorInvalidLog("ln", "x > 0") : errorInvalidLog("log", "x > 0 ∧ base > 0, base ≠ 1");
    return false;
}
function variables(name, placeholder = name) {
    const raw = decimalOptions(input(`${name} = `, { explanation: tr("algebra.variableAsk", { name }), placeholder }), { invert: true }), value = evaluateExpression(String(raw));
    return value == null ? variables(name, decimalOptions(raw)) : isFiniteNumber(value) ? round(value) : name;
}
function withDefaults({ a, b, c } = {}) {
    return { a: a ?? State.current.numericA, b: b ?? State.current.numericB, c: c ?? State.current.numericC };
}
export { absoluteOptions, divisionOptions, lnOptions, logOptions, resolveEquations, resolveUnknown, round, variables };
