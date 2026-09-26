import { round } from "./algebra.js";
import { isFiniteNumber, isInInterval } from "./checks.js";
import { isValidCommand, processCommand } from "./commands.js";
import { Config } from "./config.js";
import { INPUT_FAILED } from "./consts.js";
import { input, notify } from "./display.js";
import { errorRange } from "./errors.js";
import { exceededLimit } from "./helpers.js";
import { tr } from "./i18n.js";
import { State } from "./state.js";
import { decimalOptions, formatMessage, subscript } from "./writing.js";
function buildAffineFunction({ b = State.current.b, c = State.current.c } = {}) {
    return (tr("ui.theFunction") +
        formatLeadingTerm(b, "b", "x") +
        formatConstantTerm(c, "c") +
        tr("ui.affine") +
        (!coefficientEquals(b, 1) && coefficientEquals(c, 0) ? tr("ui.affineLinear") : coefficientEquals(b, 1) && coefficientEquals(c, 0) ? tr("ui.affineIdentity") : coefficientEquals(b, -1) ? tr("ui.affineOpposite") : ""));
}
function buildConstantFunction({ c = State.current.c } = {}) {
    return tr("ui.theFunction") + (c === "c" ? "c" : String(c)) + tr("ui.constant") + (coefficientEquals(c, 0) ? tr("ui.constantNull") : "");
}
function buildExponentialFunction({ a = State.current.a, b = State.current.b, c = State.current.c } = {}) {
    return (tr("ui.theFunction") +
        formatMultiplier(b, "b") +
        (a === "a" ? "aˣ" : Number(a) === 0 ? "" : `${a}ˣ`) +
        formatConstantTerm(c, "c") +
        tr("ui.exponential") +
        (coefficientEquals(b, 1) && coefficientEquals(c, 0) ? tr("ui.pure") : "") +
        (coefficientEquals(a, round(Math.E)) ? tr("ui.natural") : ""));
}
function buildLogarithmicFunction({ a = State.current.a, b = State.current.b, c = State.current.c } = {}) {
    return (tr("ui.theFunction") +
        formatMultiplier(b, "b") +
        (a === "a" ? "logₐ(x)" : Number(a) === 0 ? "" : `log${subscript(a)}(x)`) +
        formatConstantTerm(c, "c") +
        tr("ui.logarithmic") +
        (coefficientEquals(b, 1) && coefficientEquals(c, 0) ? tr("ui.pure") : "") +
        (coefficientEquals(a, round(Math.E)) ? tr("ui.natural") : coefficientEquals(a, 10) ? tr("ui.decimal") : ""));
}
function buildQuadraticFunction({ a = State.current.a, b = State.current.b, c = State.current.c } = {}) {
    return (tr("ui.theFunction") +
        formatLeadingTerm(a, "a", "x²") +
        formatMiddleTerm(b, "b", "x") +
        formatConstantTerm(c, "c") +
        tr("ui.quadratic") +
        (coefficientEquals(b, 0) && coefficientEquals(c, 0) ? tr("ui.pure") : coefficientEquals(b, 0) ? tr("ui.quadraticIncompleteLinear") : coefficientEquals(c, 0) ? tr("ui.quadraticIncompleteConstant") : ""));
}
function buildTrigFunction({ a = State.current.a, b = State.current.b, c = State.current.c } = {}, funcType = "") {
    return tr("ui.theFunction") + formatMultiplier(b, "b") + (a === "a" ? `${funcType}(a · x)` : Number(a) === 0 ? "" : `${funcType}(${a} · x)`) + formatConstantTerm(c, "c");
}
function formatCoefficient(coef, symbol, hasTerm = true) {
    if (String(coef).trim() === symbol.trim())
        return { hidden: false, text: symbol, negative: false };
    const n = Number(coef), abs = Math.abs(n);
    if (abs === 0 && !(Config.explicitMulti === "zero" || Config.explicitMulti === "always"))
        return { hidden: true, text: "", negative: false };
    return { hidden: false, text: abs === 1 && hasTerm && !(Config.explicitMulti === "one" || Config.explicitMulti === "always") ? "" : String(abs), negative: n < 0 };
}
function coefficientEquals(coef, value) {
    return typeof coef === "number" && coef === value;
}
function formatConstantTerm(coef, symbol) {
    const { hidden, text, negative } = formatCoefficient(coef, symbol, false);
    if (hidden)
        return "";
    return negative ? ` − ${text}` : ` + ${text}`;
}
function formatLeadingTerm(coef, symbol, term) {
    const { hidden, text, negative } = formatCoefficient(coef, symbol);
    if (hidden)
        return "";
    if (text === symbol)
        return `${symbol} · ${term}`;
    const sign = negative ? "−" : "";
    return text === "" ? `${sign}${term}` : `${sign}${text} · ${term}`;
}
function formatMiddleTerm(coef, symbol, term) {
    const { hidden, text, negative } = formatCoefficient(coef, symbol);
    if (hidden)
        return "";
    if (text === symbol)
        return ` + ${symbol} · ${term}`;
    const sign = negative ? " − " : " + ";
    return text === "" ? `${sign}${term}` : `${sign}${text} · ${term}`;
}
function formatMultiplier(coef, symbol) {
    const { hidden, text, negative } = formatCoefficient(coef, symbol);
    if (hidden)
        return "";
    if (text === symbol)
        return `${symbol} × `;
    if (text === "")
        return negative ? "−" : "";
    return `${negative ? "−" : ""}${text} × `;
}
function inputCommands(message = "", { explanation = "", number = false, places = Config.decimalPlaces, placeholder = "" } = {}) {
    let limit = 0;
    do {
        limit++;
        const raw = prompt(formatMessage(message, explanation), placeholder);
        if (raw == null)
            continue;
        const text = raw.trim();
        if (text === "")
            continue;
        if (text.startsWith("/")) {
            const action = processCommand(text);
            if (action == null)
                continue;
            return action;
        }
        if (number && !isFiniteNumber(decimalOptions(text, { invert: true })))
            continue;
        if (Config.inputConfirm && !notify(tr("ui.inputConfirm", { input: number ? decimalOptions(text) : text }), { explanation: tr("ui.inputConfirmNote"), type: "warning", asConfirm: true }))
            continue;
        return number ? round(Number(text), places) : text;
    } while (!exceededLimit(limit));
    return INPUT_FAILED;
}
function menu(options = ["---"], page = 1) {
    let answer = 1, limit = 0;
    const total = Math.max(1, Math.ceil(options.length / 5)), list = [...options, ...Array(total * 5 - options.length).fill("---")], hasAnswer = (a) => {
        switch (a) {
            case 0:
                State.askCoeffs = false;
                State.loop = true;
                break;
            case 7:
                State.askCoeffs = true;
                State.loop = true;
                answer = 0;
                break;
            case 8:
                page--;
                break;
            case 9:
                page++;
                break;
            default:
                if (isValidCommand(answer)) {
                    State.loop = true;
                    State.keepType = true;
                }
        }
    };
    do {
        page = Math.min(Math.max(page, 1), total);
        const currentPage = page;
        answer = rangeOptions(`=== ${tr("ui.menu")} ===\n${tr("ui.page", { page, total })}\n${tr("main.whatWant")}${Array.from({ length: 5 }, (_, i) => `\n${i + 1} = ${list[i + 5 * (currentPage - 1)]}`).join("")}\n----------------\n6 = ${tr("main.review")} | 7 = ${tr("main.change")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`, { max: 9, commands: true });
        hasAnswer(Number(answer));
        limit++;
        if (exceededLimit(limit)) {
            State.loop = true;
            break;
        }
    } while (isFiniteNumber(answer) && !isInInterval(answer, [0, 7]));
    return [answer, page];
}
function rangeOptions(message = "", { explanation = "", min = 0, max = 1, places = 0, commands = false } = {}) {
    let value;
    if (max < min)
        [max, min] = [min, max];
    do {
        value = commands ? inputCommands(message, { placeholder: String(min), number: true, places, explanation }) : input(message, { placeholder: String(min), number: true, places, explanation });
        if (isValidCommand(value))
            return value;
        if (isFiniteNumber(value) && !isInInterval(value, [min, max]))
            errorRange(min, max);
    } while (isFiniteNumber(value) && !isInInterval(value, [min, max]));
    return value;
}
function resolveFunction({ a = State.current.a, b = State.current.b, c = State.current.c } = {}, funcType = "poly", show = true) {
    if (!show || Config.showFunction === "never")
        return;
    if (Config.showFunction === "onChange" && !State.funcChanged)
        return;
    const coefs = { a, b, c }, funcStr = funcType === "poly"
        ? coefficientEquals(coefs.a, 0) && coefficientEquals(coefs.b, 0)
            ? buildConstantFunction(coefs)
            : coefficientEquals(coefs.a, 0)
                ? buildAffineFunction(coefs)
                : buildQuadraticFunction(coefs)
        : funcType === "exp"
            ? buildExponentialFunction(coefs)
            : funcType === "log"
                ? buildLogarithmicFunction(coefs)
                : buildTrigFunction(coefs, funcType);
    notify(`=== ${tr("ui.currentFunction")} ===\n${funcStr}`);
}
export { inputCommands, menu, rangeOptions, resolveFunction };
