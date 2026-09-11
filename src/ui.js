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
    coef == symbol
        ? `${symbol} · ${term}`
        : Algebra.absoluteOptions(coef) == 1
          ? (coef == -1 ? "−" : "") + term
          : coef == 0
            ? ""
            : `${String(coef)} · ${term}`

const formatMiddleTerm = (coef, symbol, term) =>
    coef == symbol
        ? ` + ${symbol} · ${term}`
        : coef == 0
          ? ""
          : (coef > 0 ? " + " : " − ") +
            (Algebra.absoluteOptions(coef) == 1 ? term : `${String(Algebra.absoluteOptions(coef))} · ${term}`)

const formatConstantTerm = (coef, symbol) =>
    coef == symbol ? ` + ${symbol}` : coef == 0 ? "" : coef > 0 ? ` + ${String(coef)}` : ` − ${String(-coef)}`

const formatMultiplier = (coef, symbol) =>
    coef == symbol ? `${symbol} × ` : coef != 0 && coef != 1 ? `${String(coef)} × ` : ""

const buildConstantFunction = ({ c = State.globalC } = {}) =>
    tr("ui.theFunction") + (c == "c" ? "c" : String(c)) + tr("ui.constant") + (c == 0 ? tr("ui.constantNull") : "")

const buildAffineFunction = ({ b = State.globalB, c = State.globalC } = {}) =>
    tr("ui.theFunction") +
    formatLeadingTerm(b, "b", "x") +
    formatConstantTerm(c, "c") +
    tr("ui.affine") +
    (b != 1 && c == 0
        ? tr("ui.affineLinear")
        : b == 1 && c == 0
          ? tr("ui.affineIdentity")
          : b == -1
            ? tr("ui.affineOpposite")
            : "")

const buildQuadraticFunction = ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) =>
    tr("ui.theFunction") +
    formatLeadingTerm(a, "a", "x²") +
    formatMiddleTerm(b, "b", "x") +
    formatConstantTerm(c, "c") +
    tr("ui.quadratic") +
    (b == 0 && c == 0
        ? tr("ui.pure")
        : b == 0
          ? tr("ui.quadraticIncompleteLinear")
          : c == 0
            ? tr("ui.quadraticIncompleteConstant")
            : "")

const buildExponentialFunction = ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) =>
    tr("ui.theFunction") +
    formatMultiplier(b, "b") +
    (a == "a" ? "aˣ" : a != 0 ? `${String(a)}ˣ` : "") +
    formatConstantTerm(c, "c") +
    tr("ui.exponential") +
    (b == 1 && c == 0 ? tr("ui.pure") : "") +
    (a == Algebra.round(Math.E) ? tr("ui.natural") : "")

const buildLogarithmicFunction = ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) =>
    tr("ui.theFunction") +
    formatMultiplier(b, "b") +
    (a == "a" ? "logₐ(x)" : a != 0 ? `log${Writing.subscript(a)}(x)` : "") +
    formatConstantTerm(c, "c") +
    tr("ui.logarithmic") +
    (b == 1 && c == 0 ? tr("ui.pure") : "") +
    (a == Algebra.round(Math.E) ? tr("ui.natural") : a == 10 ? tr("ui.decimal") : "")

const buildTrigFunction = ({ a = State.globalA, b = State.globalB, c = State.globalC } = {}, funcType) =>
    tr("ui.theFunction") +
    formatMultiplier(b, "b") +
    (a == "a" ? `${funcType}(a · x)` : a != 0 ? `${funcType}(${String(a)} · x)` : "") +
    formatConstantTerm(c, "c")

export const Ui = {
    notify: (message = "", explanation = "", asConfirm = false) =>
        asConfirm
            ? confirm(Writing.format(message, `${explanation}\n\n${tr("ui.confirm")}`))
            : alert(Writing.format(message, explanation)),

    notifyOptions: (message = "", { explanation = "", asConfirm = false, type = "display" } = {}) =>
        type == "error"
            ? Config.errors
                ? Ui.notify(`=== ${tr("ui.error")} ===\n${message}`, explanation)
                : undefined
            : type == "warning"
              ? Ui.notify(`=== ${tr("ui.warning")} ===\n${message}`, explanation, asConfirm)
              : type == "console"
                ? console.warn(message, explanation)
                : Ui.notify(message, explanation, type == "confirm" || asConfirm),

    display: (message = "", explanation = "") => Ui.notifyOptions(message, { explanation }),
    confirm: (message = "", explanation = "") => Ui.notifyOptions(message, { explanation, type: "confirm" }),
    error: (message = "", explanation = "") => Ui.notifyOptions(message, { explanation, type: "error" }),
    warning: (message = "", explanation = "", asConfirm = false) =>
        Ui.notifyOptions(message, { explanation, asConfirm, type: "warning" }),

    menu: (options = ["---"], page = 1) => {
        let answer,
            option = 1

        const list = options.slice()

        while (list.length % 5 != 0 || list.length == 0) list.push("---")

        const total = Math.ceil(list.length / 5)

        let limit = 0
        do {
            if (page < 1) page = 1
            if (page > total) page = total

            let menu = `=== ${tr("ui.menu")} ===\n${tr("ui.page", { page, total })}\n${tr("main.whatWant")}`

            while (option <= 5) {
                menu += `\n${String(option)} = ${String(list[option - 1 + 5 * (page - 1)])}`
                option++
            }

            option = 1
            menu +=
                `\n----------------\n` +
                `6 = ${tr("main.review")} | 7 = ${tr("main.change")} | 8 = ${tr("commands.previous")} | 9 = ${tr("commands.next")} | 0 = ${tr("commands.back")}`

            answer = Ui.range(menu, "", 0, 9, 0, true)
            if (answer == 0) {
                State.askCoeffs = false
                State.loop = true
            } else if (answer == 7) {
                State.askCoeffs = true
                State.loop = true
                answer = 0
            } else if (answer == 8) page--
            else if (answer == 9) page++
            else if (Commands.names.includes(answer)) {
                State.loop = true
                State.keepType = true
            }

            if (Helpers.exceededLimit(++limit)) {
                State.loop = true
                break
            }
        } while (!(answer >= 0 && answer <= 7) || Commands.names.includes(answer))

        return [answer, page]
    },

    input: (
        message = "",
        explanation = "",
        number = false,
        places = Config.decimalPlaces,
        allowCommands = false,
        angle = false
    ) => {
        let limit = 0

        do {
            const raw = prompt(Writing.format(message, explanation))
            if (raw == null) break

            const text = raw.trim()
            if (text == "") continue

            if (raw[0] == "/" && allowCommands) {
                const action = Commands.process(raw)
                if (action == null) continue
                return action
            }

            if (
                number &&
                !Checks.isFiniteNumber(
                    angle == "rad" ? Writing.parseAngle(text) : Writing.decimalOptions(text, { invert: true })
                )
            )
                continue

            if (
                Config.inputConfirm &&
                !Ui.notifyOptions(
                    tr("ui.inputConfirm", {
                        input: number ? (angle ? Writing.formatAngle(raw) : Writing.decimalOptions(raw)) : text,
                    }),
                    { explanation: tr("ui.inputConfirmNote"), type: "warning", asConfirm: true }
                )
            )
                continue

            return number ? Algebra.round(raw, places) : text
        } while (!Helpers.exceededLimit(++limit))

        return number ? 0 : ""
    },

    function: (
        coefA = 0,
        coefB = 0,
        coefC = 0,
        funcExp = false,
        funcLog = false,
        funcTrig = "",
        show = Config.showFunction
    ) =>
        Ui.resolveFunction(
            { a: coefA, b: coefB, c: coefC },
            funcExp ? "exp" : funcLog ? "log" : funcTrig != "" ? funcTrig : "poly",
            show
        ),

    resolveFunction: (
        { a = State.globalA, b = State.globalB, c = State.globalC } = {},
        funcType = "poly",
        show = true
    ) => {
        const coefs = { a, b, c }
        if (!show) return

        const funcStr =
            funcType == "poly"
                ? coefs.a == 0 && coefs.b == 0
                    ? buildConstantFunction(coefs)
                    : coefs.a == 0
                      ? buildAffineFunction(coefs)
                      : buildQuadraticFunction(coefs)
                : funcType == "exp"
                  ? buildExponentialFunction(coefs)
                  : funcType == "log"
                    ? buildLogarithmicFunction(coefs)
                    : buildTrigFunction(coefs, funcType)

        Ui.notifyOptions(`=== ${tr("ui.currentFunction")} ===\n${Writing.decimalOptions(funcStr)}`)
    },

    range: (message = "", explanation = "", min = 0, max = 1, places = 0, allowCommands = false) => {
        let value

        do {
            value = Ui.input(message, explanation, true, places, allowCommands)

            if (Commands.names.includes(value)) return value
            if (value == "end") return 0
            if (!(min <= value && value <= max)) Errors.range(min, max)
        } while (!(min <= value && value <= max))

        return value
    },
}
