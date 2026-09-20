import { Algebra } from "./algebra.js"
import { Checks } from "./checks.js"
import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Errors } from "./errors.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Writing } from "./writing.js"

const formatLeadingTerm = (coef, symbol, term) =>
        String(coef).trim() === String(symbol).trim()
            ? `${symbol} · ${term}`
            : Algebra.absoluteOptions(Number(coef)) === 1
              ? (coef === -1 ? "−" : "") + term
              : coef === 0
                ? ""
                : `${String(coef)} · ${term}`,
    formatMiddleTerm = (coef, symbol, term) =>
        String(coef).trim() === String(symbol).trim()
            ? ` + ${symbol} · ${term}`
            : coef === 0
              ? ""
              : (Number(coef) > 0 ? " + " : " − ") +
                (Algebra.absoluteOptions(Number(coef)) === 1
                    ? term
                    : `${String(Algebra.absoluteOptions(Number(coef)))} · ${term}`),
    formatConstantTerm = (coef, symbol) =>
        String(coef).trim() === String(symbol).trim()
            ? ` + ${symbol}`
            : coef === 0
              ? ""
              : Number(coef) > 0
                ? ` + ${String(coef)}`
                : ` − ${String(-coef)}`,
    formatMultiplier = (coef, symbol) =>
        String(coef).trim() === String(symbol).trim()
            ? `${symbol} × `
            : coef !== 0 && coef !== 1
              ? `${String(coef)} × `
              : "",
    buildConstantFunction = (/** @type {Partial<Coefficients>} */ { c = State.current.c } = {}) =>
        tr("ui.theFunction") +
        (c === "c" ? "c" : String(c)) +
        tr("ui.constant") +
        (c === 0 ? tr("ui.constantNull") : ""),
    buildAffineFunction = (/** @type {Partial<Coefficients>} */ { b = State.current.b, c = State.current.c } = {}) =>
        tr("ui.theFunction") +
        formatLeadingTerm(b, "b", "x") +
        formatConstantTerm(c, "c") +
        tr("ui.affine") +
        (b !== 1 && c === 0
            ? tr("ui.affineLinear")
            : b === 1 && c === 0
              ? tr("ui.affineIdentity")
              : b === -1
                ? tr("ui.affineOpposite")
                : ""),
    buildQuadraticFunction = (
        /** @type {Partial<Coefficients>} */ { a = State.current.a, b = State.current.b, c = State.current.c } = {}
    ) =>
        tr("ui.theFunction") +
        formatLeadingTerm(a, "a", "x²") +
        formatMiddleTerm(b, "b", "x") +
        formatConstantTerm(c, "c") +
        tr("ui.quadratic") +
        (b === 0 && c === 0
            ? tr("ui.pure")
            : b === 0
              ? tr("ui.quadraticIncompleteLinear")
              : c === 0
                ? tr("ui.quadraticIncompleteConstant")
                : ""),
    buildExponentialFunction = (
        /** @type {Partial<Coefficients>} */ { a = State.current.a, b = State.current.b, c = State.current.c } = {}
    ) =>
        tr("ui.theFunction") +
        formatMultiplier(b, "b") +
        (a === "a" ? "aˣ" : a === 0 ? "" : `${String(a)}ˣ`) +
        formatConstantTerm(c, "c") +
        tr("ui.exponential") +
        (b === 1 && c === 0 ? tr("ui.pure") : "") +
        (a === Algebra.round(Math.E) ? tr("ui.natural") : ""),
    buildLogarithmicFunction = (
        /** @type {Partial<Coefficients>} */ { a = State.current.a, b = State.current.b, c = State.current.c } = {}
    ) =>
        tr("ui.theFunction") +
        formatMultiplier(b, "b") +
        (a === "a" ? "logₐ(x)" : a === 0 ? "" : `log${Writing.subscript(a)}(x)`) +
        formatConstantTerm(c, "c") +
        tr("ui.logarithmic") +
        (b === 1 && c === 0 ? tr("ui.pure") : "") +
        (a === Algebra.round(Math.E) ? tr("ui.natural") : a === 10 ? tr("ui.decimal") : ""),
    buildTrigFunction = (
        /** @type {Partial<Coefficients>} */ { a = State.current.a, b = State.current.b, c = State.current.c } = {},
        funcType = ""
    ) =>
        tr("ui.theFunction") +
        formatMultiplier(b, "b") +
        (a === "a" ? `${funcType}(a · x)` : a === 0 ? "" : `${funcType}(${String(a)} · x)`) +
        formatConstantTerm(c, "c")

export const Ui = {
    notifyOptions: (message = "", { explanation = "", type = "display", asConfirm = false } = {}) =>
        type === "display"
            ? Ui.notify(message, explanation)
            : type === "confirm"
              ? Ui.notify(message, explanation, true)
              : type === "error" && Config.errors
                ? Ui.notify(`=== ${tr("ui.error")} ===\n${message}`, explanation)
                : type === "warning"
                  ? Ui.notify(`=== ${tr("ui.warning")} ===\n${message}`, explanation, asConfirm)
                  : console.warn(message, explanation),
    notify: (message = "", explanation = "", asConfirm = false) =>
        asConfirm
            ? confirm(Writing.format(message, `${explanation}\n\n${tr("ui.confirm")}`))
            : alert(Writing.format(message, explanation)),

    menu: (options = ["---"], page = 1) => {
        const total = Math.max(1, Math.ceil(options.length / 5)),
            list = [...options, ...Array(total * 5 - options.length).fill("---")]
        let answer,
            option = 1,
            limit = 0
        do {
            if (page < 1) page = 1
            if (page > total) page = total

            let menu = `=== ${tr("ui.menu")} ===\n${tr("ui.page", { page, total })}\n${tr("main.whatWant")}`

            for (; option <= 5; option++) menu += `\n${option} = ${list[option - 1 + 5 * (page - 1)]}`

            option = 1
            menu +=
                `\n----------------\n` +
                `6 = ${tr("main.review")} | 7 = ${tr("main.change")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`

            answer = Ui.rangeOptions(menu, { max: 9, commands: true })
            if (answer === 0) {
                State.askCoeffs = false
                State.loop = true
            } else if (answer === 7) {
                State.askCoeffs = true
                State.loop = true
                answer = 0
            } else if (answer === 8) page--
            else if (answer === 9) page++
            else if (Checks.isValidCommand(answer)) {
                State.loop = true
                State.keepType = true
            }

            if (Helpers.exceededLimit(++limit)) {
                State.loop = true
                break
            }
        } while ((Checks.isFiniteNumber(answer) && !(answer >= 0 && answer <= 7)) || Checks.isValidCommand(answer))

        return [answer, page]
    },

    inputOptions: (
        message = "",
        { explanation = "", number = false, places = Config.decimalPlaces, commands = false, placeholder = "" } = {}
    ) => {
        let limit = 0

        do {
            const raw = prompt(Writing.format(message, explanation), placeholder)
            if (raw == null) continue

            const text = String(raw).trim()
            if (text === "") continue

            if (raw[0] === "/" && commands) {
                const action = Commands.process(raw)
                if (action == null) continue
                return action
            }

            if (number && !Checks.isFiniteNumber(Writing.decimalOptions(text, { invert: true }))) continue

            if (
                Config.inputConfirm &&
                !Ui.notifyOptions(tr("ui.inputConfirm", { input: number ? Writing.decimalOptions(raw) : text }), {
                    explanation: tr("ui.inputConfirmNote"),
                    type: "warning",
                    asConfirm: true,
                })
            )
                continue

            return number ? Algebra.round(raw, places) : text
        } while (!Helpers.exceededLimit(++limit))

        return number ? 0 : ""
    },

    resolveFunction: (
        { a = State.current.a, b = State.current.b, c = State.current.c } = {},
        funcType = "poly",
        show = Config.showFunction
    ) => {
        const coefs = { a, b, c }
        if (!show) return

        const funcStr =
            funcType === "poly"
                ? coefs.a === 0 && coefs.b === 0
                    ? buildConstantFunction(coefs)
                    : coefs.a === 0
                      ? buildAffineFunction(coefs)
                      : buildQuadraticFunction(coefs)
                : funcType === "exp"
                  ? buildExponentialFunction(coefs)
                  : funcType === "log"
                    ? buildLogarithmicFunction(coefs)
                    : buildTrigFunction(coefs, funcType)

        Ui.notifyOptions(`=== ${tr("ui.currentFunction")} ===\n${Writing.decimalOptions(funcStr)}`)
    },

    rangeOptions: (message = "", { explanation = "", min = 0, max = 1, places = 0, commands = false } = {}) => {
        /** @type {Numeric | CommandsNames | "end"} */ let value

        if (max < min) [max, min] = [min, max]

        do {
            value = Ui.inputOptions(message, { explanation, number: true, places, commands, placeholder: String(min) })

            if (Checks.isValidCommand(value)) return value
            if (value === "end") return 0
            if (Checks.isFiniteNumber(value) && !(min <= value && value <= max)) Errors.range(min, max)
        } while (Checks.isFiniteNumber(value) && !(min <= value && value <= max))

        return value
    },
}
