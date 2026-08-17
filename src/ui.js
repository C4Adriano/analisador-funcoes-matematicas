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
            return confirm(Writing.format(message, explanation + "\n\n" + tr("ui.confirm")))
        }
        alert(Writing.format(message, explanation))
        return null
    },

    notifyOptions(message = "", { explanation = "", debug = Config.debug, asConfirm = false, type = "display" } = {}) {
        if (type == "error") {
            return Ui.error(message, explanation, debug)
        } else if (type == "warning") {
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
            menu = "",
            option = 1,
            total = 0,
            list = options.slice()

        // Organiza
        while (list.length % 5 != 0 || list.length == 0) {
            list.push("---")
        }
        total = Math.ceil(list.length / 5)

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
            menu = `=== ${tr("ui.menu")} ===\n${tr("ui.page", { page: page, total: total })}\n${tr("main.whatWant")}`

            while (option <= 5) {
                menu += "\n" + String(option) + " = " + String(list[option - 1 + 5 * (page - 1)])
                option++
            }

            option = 1
            menu +=
                "\n----------------\n" +
                "6 = " +
                tr("main.review") +
                " | 7 = " +
                tr("main.change") +
                " | 8 = " +
                tr("commands.previous") +
                " | 9 = " +
                tr("commands.next") +
                " | 0 = " +
                tr("commands.back")

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
        } while (!(0 <= answer && answer <= 9) || Commands.names.includes(answer))

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
        let raw = "",
            text = "",
            value = 0,
            valid = false

        // Loop
        let limit = 0
        do {
            raw = prompt(Writing.format(message, explanation))

            // Cancelar
            if (raw == null) {
                valid = false
            } else {
                text = String(raw).trim()
                valid = text != ""
            }

            // Comandos
            if (valid && raw[0] == "/" && allowCommands) {
                let action = Commands.process(raw)
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

    resolveFunction(coefs = { a: State.globalA, b: State.globalB, c: State.globalC }, funcType = "poly", show = true) {
        if (!show) {
            // Não mostrar
            return ""
        }

        let funcStr = tr("ui.theFunction")

        if (funcType == "poly") {
            // Polinomial
            if (coefs.a == 0 && coefs.b == 0) {
                // Constante
                if (coefs.c == "c") {
                    // Variável
                    funcStr += "c"
                } else if (coefs.c != "c") {
                    // Não variável
                    funcStr += String(coefs.c)
                }

                funcStr += tr("ui.constant")

                // Especiais
                if (coefs.c == 0) {
                    // Se for zero, é a função nula
                    funcStr += tr("ui.constantNull")
                }
            } else if (coefs.a == 0 && coefs.b != 0) {
                // Afim
                if (coefs.b == "b") {
                    // Variável
                    funcStr += "b · x"
                } else if (coefs.b != "b") {
                    // Não variável
                    if (Algebra.absolute(coefs.b) == 1) {
                        // Se for 1 ou -1, não mostra o número, só o sinal
                        if (coefs.b == -1) {
                            // Se for -1, mostra o sinal de menos
                            funcStr += "−"
                        }
                        funcStr += "x"
                    } else if (Algebra.absolute(coefs.b) != 1) {
                        // Se for diferente de 1 ou -1, mostra o número
                        funcStr += String(coefs.b) + " · x"
                    }
                }

                if (coefs.c == "c") {
                    // Variável
                    funcStr += " + c"
                } else if (coefs.c != "c") {
                    // Não variável
                    if (coefs.c > 0) {
                        // Se for positivo, mostra o sinal de mais
                        funcStr += " + " + String(coefs.c)
                    } else if (coefs.c < 0) {
                        // Se for negativo, mostra o sinal de menos e o número positivo
                        funcStr += " − " + String(-coefs.c)
                    }
                }

                funcStr += tr("ui.affine")

                // Especiais
                if (coefs.b != 1 && coefs.c == 0) {
                    // Se o coeficiente b for diferente de 1 e o coeficiente c for zero, é uma função linear
                    funcStr += tr("ui.affineLinear")
                } else if (coefs.b == 1 && coefs.c == 0) {
                    // Se o coeficiente b for 1 e o coeficiente c for zero, é a função identidade
                    funcStr += tr("ui.affineIdentity")
                } else if (coefs.b == -1) {
                    // Se o coeficiente b for -1, é a função oposta da identidade
                    funcStr += tr("ui.affineOpposite")
                }
            } else if (coefs.a != 0) {
                // Quadrática
                if (coefs.a == "a") {
                    // Variável
                    funcStr += "a · x²"
                } else if (coefs.a != "a") {
                    // Não variável
                    if (Algebra.absolute(coefs.a) == 1) {
                        // Se for 1 ou -1, não mostra o número, só o sinal
                        if (coefs.a == -1) {
                            // Se for -1, mostra o sinal de menos
                            funcStr += "−"
                        }
                        funcStr += "x²"
                    } else if (Algebra.absolute(coefs.a) != 1) {
                        // Se for diferente de 1 ou -1, mostra o número
                        funcStr += String(coefs.a) + " · x²"
                    }
                }

                if (coefs.b == "b") {
                    // Variável
                    funcStr += " + b · x"
                } else if (coefs.b != "b" && coefs.b != 0) {
                    // Não variável e diferente de zero
                    if (coefs.b > 0) {
                        // Se for positivo, mostra o sinal de mais
                        funcStr += " + "
                    } else if (coefs.b < 0) {
                        // Se for negativo, mostra o sinal de menos e o número positivo
                        funcStr += " − "
                    }

                    if (Algebra.absolute(coefs.b) == 1) {
                        // Se for 1 ou -1, não mostra o número, só o sinal
                        funcStr += "x"
                    } else if (Algebra.absolute(coefs.b) != 1) {
                        // Se for diferente de 1 ou -1, mostra o número
                        funcStr += String(Algebra.absolute(coefs.b)) + " · x"
                    }
                }

                if (coefs.c == "c") {
                    // Variável
                    funcStr += " + c"
                } else if (coefs.c != "c" && coefs.c != 0) {
                    // Não variável
                    if (coefs.c > 0) {
                        // Se for positivo, mostra o sinal de mais
                        funcStr += " + " + String(coefs.c)
                    } else if (coefs.c < 0) {
                        // Se for negativo, mostra o sinal de menos e o número positivo
                        funcStr += " − " + String(-coefs.c)
                    }
                }

                funcStr += tr("ui.quadratic")

                // Especiais
                if (coefs.b == 0 && coefs.c == 0) {
                    // Se os coeficientes b e c forem zero, é uma função quadrática pura
                    funcStr += tr("ui.pure")
                } else if (coefs.b == 0) {
                    // Se o coeficiente b for zero, é uma função incompleta sem termo linear
                    funcStr += tr("ui.quadraticIncompleteLinear")
                } else if (coefs.c == 0) {
                    // Se o coeficiente c for zero, é uma função incompleta sem termo constante
                    funcStr += tr("ui.quadraticIncompleteConstant")
                }
            }
        } else if (funcType == "exp") {
            // Exponencial
            if (coefs.b != "b" && coefs.b != 0) {
                // Não variável
                if (coefs.b != 1) {
                    // Se for diferente de 1, mostra o número
                    funcStr += String(coefs.b) + " × "
                }
            } else if (coefs.b == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefs.a != "a" && coefs.a != 0) {
                // Não variável
                funcStr += String(coefs.a) + "ˣ"
            } else if (coefs.a == "a") {
                // Variável
                funcStr += "aˣ"
            }

            if (coefs.c != "c" && coefs.c != 0) {
                // Não variável
                if (coefs.c > 0) {
                    // Se for positivo, mostra o sinal de mais
                    funcStr += " + " + String(coefs.c)
                } else if (coefs.c < 0) {
                    // Se for negativo, mostra o sinal de menos e o número positivo
                    funcStr += " − " + String(-coefs.c)
                }
            } else if (coefs.c == "c") {
                // Variável
                funcStr += " + c"
            }

            funcStr += tr("ui.exponential")

            // Especiais
            if (coefs.b == 1 && coefs.c == 0) {
                // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função exponencial pura
                funcStr += tr("ui.pure")
            }
            if (coefs.a == Algebra.round(Math.E)) {
                // Se o coeficiente a for igual a e, é uma função exponencial natural
                funcStr += tr("ui.natural")
            }
        } else if (funcType == "log") {
            // Logarítmica
            if (coefs.b != "b" && coefs.b != 0) {
                // Não variável
                if (coefs.b != 1) {
                    funcStr += String(coefs.b) + " × "
                }
            } else if (coefs.b == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefs.a != "a" && coefs.a != 0) {
                // Não variável
                funcStr += "log" + Writing.subscript(coefs.a) + "(x)"
            } else if (coefs.a == "a") {
                // Variável
                funcStr += "logₐ(x)"
            }

            if (coefs.c != "c" && coefs.c != 0) {
                // Não variável
                if (coefs.c > 0) {
                    // Se for positivo, mostra o sinal de mais
                    funcStr += " + " + String(coefs.c)
                } else if (coefs.c < 0) {
                    // Se for negativo, mostra o sinal de menos e o número positivo
                    funcStr += " − " + String(-coefs.c)
                }
            } else if (coefs.c == "c") {
                // Variável
                funcStr += " + c"
            }

            funcStr += tr("ui.logarithmic")

            // Especiais
            if (coefs.b == 1 && coefs.c == 0) {
                // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função logarítmica pura
                funcStr += tr("ui.pure")
            }
            if (coefs.a == Algebra.round(Math.E)) {
                // Se o coeficiente a for igual a e, é uma função logarítmica natural
                funcStr += tr("ui.natural")
            } else if (coefs.a == 10) {
                // Se o coeficiente a for igual a 10, é uma função logarítmica decimal
                funcStr += tr("ui.decimal")
            }
        } else if (funcType != "poly") {
            // Trigonométrica
            if (coefs.b != "b" && coefs.b != 0) {
                // Não variável
                if (coefs.b != 1) {
                    funcStr += String(coefs.b) + " × "
                }
            } else if (coefs.b == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefs.a != "a" && coefs.a != 0) {
                // Não variável
                funcStr += funcType + "(" + String(coefs.a) + " · x)"
            } else if (coefs.a == "a") {
                funcStr += funcType + "(a · x)"
            }

            if (coefs.c != "c" && coefs.c != 0) {
                // Não variável
                if (coefs.c > 0) {
                    // Se for positivo, mostra o sinal de mais
                    funcStr += " + " + String(coefs.c)
                } else if (coefs.c < 0) {
                    // Se for negativo, mostra o sinal de menos e o número positivo
                    funcStr += " − " + String(-coefs.c)
                }
            } else if (coefs.c == "c") {
                // Variável
                funcStr += " + c"
            }
        }

        Ui.display("=== " + tr("ui.currentFunction") + " ===\n" + Writing.decimal(funcStr))
        return ""
    },

    range(message = "", explanation = "", min = 0, max = 1, places = 0, allowCommands = false) {
        let value = 0

        // Loop
        do {
            // Pede um valor
            value = Ui.input(message, explanation, true, places, allowCommands)

            // Comandos
            if (Commands.names.includes(value)) {
                return value
            }

            // Encerrar intervalo
            else if (value == "end") {
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
