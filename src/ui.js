import { Algebra } from "./algebra.js"
import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Errors } from "./errors.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Writing } from "./writing.js"

export const Ui = {
    notify(message = "", explanation = "", debug = Config.debug, asConfirm = false) {
        if (debug) {
            console.warn(message)
            if (explanation != "") {
                console.warn(explanation)
            }
            return asConfirm ? true : null
        }
        if (asConfirm) {
            return confirm(Writing.format(message, `${explanation}\n\n${tr("ui.confirm")}`))
        }
        alert(Writing.format(message, explanation))
        return null
    },

    notifyOptions(message = "", { explanation = "", debug = Config.debug, asConfirm = false, type = "display" } = {}) {
        if (type == "error") {
            return Ui.error(message, explanation, debug)
        }
        if (type == "warning") {
            return Ui.warning(message, explanation, asConfirm, debug)
        }
        return Ui.notify(message, explanation, debug, type == "confirm" || asConfirm)
    },

    display(message = "", explanation = "", debug = Config.debug) {
        Ui.notify(message, explanation, debug, false)
    },

    confirm(message = "", explanation = "", debug = Config.debug) {
        return Ui.notify(message, explanation, debug, true)
    },

    error(message = "", explanation = "", debug = Config.debug) {
        if (Config.errors) {
            Ui.display(`=== ${tr("ui.error")} ===\n${message}`, explanation, debug)
        }
    },

    warning(message = "", explanation = "", asConfirm = false, debug = Config.debug) {
        const header = `=== ${tr("ui.warning")} ===\n${message}`
        return asConfirm ? Ui.confirm(header, explanation, debug) : Ui.display(header, explanation, debug)
    },

    menu(options = ["---"], page = 1) {
        let answer,
            option = 1

        const list = options.slice()

        // Organiza
        while (list.length % 5 != 0 || list.length == 0) {
            list.push("---")
        }
        const total = Math.ceil(list.length / 5)

        // Loop
        let limit = 0
        do {
            // Arruma
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            // Pergunta
            let menu = `=== ${tr("ui.menu")} ===\n${tr("ui.page", { page, total })}\n${tr("main.whatWant")}`

            while (option <= 5) {
                menu += `\n${String(option)} = ${String(list[option - 1 + 5 * (page - 1)])}`
                option++
            }

            option = 1
            menu +=
                `\n----------------\n` +
                `6 = ${tr("main.review")} | 7 = ${tr("main.change")} | 8 = ${tr("commands.previous")} | 9 = ${tr(
                    "commands.next"
                )} | 0 = ${tr("commands.back")}`

            // Responde
            answer = Ui.range(menu, "", 0, 9, 0, true)
            if (answer == 0) {
                // Voltar
                State.askCoeffs = false
                State.loop = true
            } else if (answer == 7) {
                // Alterar
                State.askCoeffs = true
                State.loop = true
                answer = 0
            } else if (answer == 8) {
                // -1
                answer = -1
                page -= 1
            } else if (answer == 9) {
                // +1
                answer = -1
                page += 1
            } else if (Commands.names.includes(answer)) {
                State.loop = true
                State.keepType = true
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                answer = 0
                State.loop = true
            }
        } while (!(answer >= 0 && answer <= 9) || Commands.names.includes(answer))

        return [answer, page]
    },

    input(
        message = "",
        explanation = "",
        number = false,
        places = Config.decimalPlaces,
        allowCommands = false,
        angle = false
    ) {
        let text = "",
            value = 0,
            valid

        // Loop
        let limit = 0
        do {
            const raw = prompt(Writing.format(message, explanation))

            // Cancelar
            if (raw == null) {
                valid = false
            } else {
                text = String(raw).trim()
                valid = text != ""
            }

            // Comandos
            if (valid && raw[0] == "/" && allowCommands) {
                const action = Commands.process(raw)
                if (action != null) {
                    return action
                }
                valid = false
            }

            // Número
            if (valid && number) {
                if (angle == "rad") {
                    value = Writing.parseAngle(String(text))
                } else {
                    value = Number(Writing.decimal(text, true))
                }
                valid = isFinite(value)
            }

            // Confirma
            if (valid && Config.inputConfirm) {
                valid = Ui.warning(
                    tr("ui.inputConfirm", {
                        input: number ? (angle ? Writing.formatAngle(value) : Writing.decimal(value)) : text,
                    }),
                    tr("ui.inputConfirmNote"),
                    true
                )
            }

            // Retorna
            if (valid) {
                if (number) {
                    return Algebra.round(value, places)
                }
                return text
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                valid = true
            }
        } while (!valid)

        return number ? 0 : ""
    },

    function(
        coefA = 0,
        coefB = 0,
        coefC = 0,
        funcExp = false,
        funcLog = false,
        funcTrig = "",
        show = Config.showFunction
    ) {
        return Ui.resolveFunction(
            { a: coefA, b: coefB, c: coefC },
            funcExp ? "exp" : funcLog ? "log" : funcTrig != "" ? funcTrig : "poly",
            show
        )
    },

    resolveFunction({ a = State.globalA, b = State.globalB, c = State.globalC } = {}, funcType = "poly", show = true) {
        const coefs = { a, b, c }
        if (!show) {
            return ""
        }

        let funcStr
        if (funcType == "poly") {
            if (coefs.a == 0 && coefs.b == 0) {
                funcStr = buildConstantFunction(coefs)
            } else if (coefs.a == 0) {
                funcStr = buildAffineFunction(coefs)
            } else {
                funcStr = buildQuadraticFunction(coefs)
            }
        } else if (funcType == "exp") {
            funcStr = buildExponentialFunction(coefs)
        } else if (funcType == "log") {
            funcStr = buildLogarithmicFunction(coefs)
        } else {
            funcStr = buildTrigFunction(coefs, funcType)
        }

        Ui.display(`=== ${tr("ui.currentFunction")} ===\n${Writing.decimal(funcStr)}`)
        return ""
    },

    range(message = "", explanation = "", min = 0, max = 1, places = 0, allowCommands = false) {
        let value

        // Loop
        do {
            // Pede um valor
            value = Ui.input(message, explanation, true, places, allowCommands)

            // Comandos
            if (Commands.names.includes(value)) {
                return value
            }

            // Encerrar intervalo
            if (value == "end") {
                return 0
            }

            if (!(min <= value && value <= max)) {
                // Se o valor não estiver entre o intervalo, mostra um erro
                Errors.range(min, max)
            }
        } while (!(min <= value && value <= max))

        return value
    },
}

// === HELPERS DE FORMATAÇÃO (padrões repetidos entre os tipos em Ui.resolveFunction) ===

// Usado no termo líder com expoente: "a · x²" / "x²" / "−x²" / "3 · x²"
function formatLeadingTerm(coef, symbol, term) {
    if (coef == symbol) {
        return `${symbol} · ${term}`
    }
    if (Algebra.absolute(coef) == 1) {
        return (coef == -1 ? "−" : "") + term
    }
    if (coef == 0) {
        return ""
    }
    return `${String(coef)} · ${term}`
}

// Usado no termo do meio da quadrática: " + b · x" / " + x" / " − 3 · x"
function formatMiddleTerm(coef, symbol, term) {
    if (coef == symbol) {
        return ` + ${symbol} · ${term}`
    }
    if (coef == 0) {
        return ""
    }
    const sign = coef > 0 ? " + " : " − "
    const magnitude = Algebra.absolute(coef) == 1 ? term : `${String(Algebra.absolute(coef))} · ${term}`
    return sign + magnitude
}

// Usado no termo constante final: " + c" / " + 5" / " − 5"
function formatConstantTerm(coef, symbol) {
    if (coef == symbol) {
        return ` + ${symbol}`
    }
    if (coef == 0) {
        return ""
    }
    return coef > 0 ? ` + ${String(coef)}` : ` − ${String(-coef)}`
}

// Usado no multiplicador líder de exp/log/trig: "b × " / "3 × " / ""
function formatMultiplier(coef, symbol) {
    if (coef == symbol) {
        return `${symbol} × `
    }
    if (coef != 0 && coef != 1) {
        return `${String(coef)} × `
    }
    return ""
}

// === MONTAGEM POR TIPO DE FUNÇÃO ===

function buildConstantFunction({ c = State.globalC } = {}) {
    const coefs = { c }
    let funcStr = tr("ui.theFunction")
    funcStr += coefs.c == "c" ? "c" : String(coefs.c)
    funcStr += tr("ui.constant")

    if (coefs.c == 0) {
        funcStr += tr("ui.constantNull")
    }
    return funcStr
}

function buildAffineFunction({ b = State.globalB, c = State.globalC } = {}) {
    const coefs = { b, c }
    let funcStr = tr("ui.theFunction")
    funcStr += formatLeadingTerm(coefs.b, "b", "x")
    funcStr += formatConstantTerm(coefs.c, "c")
    funcStr += tr("ui.affine")

    if (coefs.b != 1 && coefs.c == 0) {
        funcStr += tr("ui.affineLinear")
    } else if (coefs.b == 1 && coefs.c == 0) {
        funcStr += tr("ui.affineIdentity")
    } else if (coefs.b == -1) {
        funcStr += tr("ui.affineOpposite")
    }
    return funcStr
}

function buildQuadraticFunction({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c }
    let funcStr = tr("ui.theFunction")
    funcStr += formatLeadingTerm(coefs.a, "a", "x²")
    funcStr += formatMiddleTerm(coefs.b, "b", "x")
    funcStr += formatConstantTerm(coefs.c, "c")
    funcStr += tr("ui.quadratic")

    if (coefs.b == 0 && coefs.c == 0) {
        funcStr += tr("ui.pure")
    } else if (coefs.b == 0) {
        funcStr += tr("ui.quadraticIncompleteLinear")
    } else if (coefs.c == 0) {
        funcStr += tr("ui.quadraticIncompleteConstant")
    }
    return funcStr
}

function buildExponentialFunction({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c }
    let funcStr = tr("ui.theFunction")
    funcStr += formatMultiplier(coefs.b, "b")

    if (coefs.a == "a") {
        funcStr += "aˣ"
    } else if (coefs.a != 0) {
        funcStr += `${String(coefs.a)}ˣ`
    }

    funcStr += formatConstantTerm(coefs.c, "c")
    funcStr += tr("ui.exponential")

    if (coefs.b == 1 && coefs.c == 0) {
        funcStr += tr("ui.pure")
    }
    if (coefs.a == Algebra.round(Math.E)) {
        funcStr += tr("ui.natural")
    }
    return funcStr
}

function buildLogarithmicFunction({ a = State.globalA, b = State.globalB, c = State.globalC } = {}) {
    const coefs = { a, b, c }
    let funcStr = tr("ui.theFunction")
    funcStr += formatMultiplier(coefs.b, "b")

    if (coefs.a == "a") {
        funcStr += "logₐ(x)"
    } else if (coefs.a != 0) {
        funcStr += `log${Writing.subscript(coefs.a)}(x)`
    }

    funcStr += formatConstantTerm(coefs.c, "c")
    funcStr += tr("ui.logarithmic")

    if (coefs.b == 1 && coefs.c == 0) {
        funcStr += tr("ui.pure")
    }
    if (coefs.a == Algebra.round(Math.E)) {
        funcStr += tr("ui.natural")
    } else if (coefs.a == 10) {
        funcStr += tr("ui.decimal")
    }
    return funcStr
}

function buildTrigFunction({ a = State.globalA, b = State.globalB, c = State.globalC } = {}, funcType) {
    const coefs = { a, b, c }
    let funcStr = tr("ui.theFunction")
    funcStr += formatMultiplier(coefs.b, "b")

    if (coefs.a == "a") {
        funcStr += `${funcType}(a · x)`
    } else if (coefs.a != 0) {
        funcStr += `${funcType}(${String(coefs.a)} · x)`
    }

    funcStr += formatConstantTerm(coefs.c, "c")
    return funcStr
}
