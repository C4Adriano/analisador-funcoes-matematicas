import { Algebra } from "./algebra.js"
import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Errors } from "./errors.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Writing } from "./writing.js"

export const Ui = {
    display(message = "", explanation = "", debug = Config.debug) {
        if (debug) {
            console.warn(message)
            if (explanation != "") {
                console.warn(explanation)
            }
        } else {
            alert(Writing.format(message, explanation))
        }
    },

    confirm(message = "", explanation = "", debug = Config.debug) {
        if (debug) {
            console.warn(message)
            if (explanation != "") {
                console.warn(explanation)
            }
            return true
        } else {
            return confirm(Writing.format(message, explanation + "\n\n" + tr("ui.confirm")))
        }
    },

    error(message = "", explanation = "", debug = Config.debug) {
        if (Config.errors) {
            Ui.display(`=== ${tr("ui.error")} ===\n${message}`, explanation, debug)
        }
    },

    warning(message = "", explanation = "", type = false, debug = Config.debug) {
        if (!type) {
            // Se tipo for falso, é um aviso simples, como um alert
            Ui.display(`=== ${tr("ui.warning")} ===\n${message}`, explanation, debug)
        } else {
            // Se tipo for verdadeiro, é um aviso de confirmação, como um confirm
            return Ui.confirm(`=== ${tr("ui.warning")} ===\n${message}`, explanation, debug)
        }
        return null
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
            } else if (Commands.names().includes(answer)) {
                State.loop = true
                State.keepType = true
            }

            // Limite
            if (Helpers.exceededLimit(++limit)) {
                answer = 0
                State.loop = true
            }
        } while (!(0 <= answer && answer <= 9) || Commands.names().includes(answer))

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
        if (!show) {
            // Não mostrar
            return ""
        }

        let funcStr = tr("ui.theFunction")

        if (!funcExp && !funcLog && funcTrig == "") {
            // Polinomial
            if (coefA == 0 && coefB == 0) {
                // Constante
                if (coefC == "c") {
                    // Variável
                    funcStr += "c"
                } else if (coefC != "c") {
                    // Não variável
                    funcStr += String(coefC)
                }

                funcStr += tr("ui.constant")

                // Especiais
                if (coefC == 0) {
                    // Se for zero, é a função nula
                    funcStr += tr("ui.constantNull")
                }
            } else if (coefA == 0 && coefB != 0) {
                // Afim
                if (coefB == "b") {
                    // Variável
                    funcStr += "b · x"
                } else if (coefB != "b") {
                    // Não variável
                    if (Algebra.absolute(coefB) == 1) {
                        // Se for 1 ou -1, não mostra o número, só o sinal
                        if (coefB == -1) {
                            // Se for -1, mostra o sinal de menos
                            funcStr += "−"
                        }
                        funcStr += "x"
                    } else if (Algebra.absolute(coefB) != 1) {
                        // Se for diferente de 1 ou -1, mostra o número
                        funcStr += String(coefB) + " · x"
                    }
                }

                if (coefC == "c") {
                    // Variável
                    funcStr += " + c"
                } else if (coefC != "c") {
                    // Não variável
                    if (coefC > 0) {
                        // Se for positivo, mostra o sinal de mais
                        funcStr += " + " + String(coefC)
                    } else if (coefC < 0) {
                        // Se for negativo, mostra o sinal de menos e o número positivo
                        funcStr += " − " + String(-coefC)
                    }
                }

                funcStr += tr("ui.affine")

                // Especiais
                if (coefB != 1 && coefC == 0) {
                    // Se o coeficiente b for diferente de 1 e o coeficiente c for zero, é uma função linear
                    funcStr += tr("ui.affineLinear")
                } else if (coefB == 1 && coefC == 0) {
                    // Se o coeficiente b for 1 e o coeficiente c for zero, é a função identidade
                    funcStr += tr("ui.affineIdentity")
                } else if (coefB == -1) {
                    // Se o coeficiente b for -1, é a função oposta da identidade
                    funcStr += tr("ui.affineOpposite")
                }
            } else if (coefA != 0) {
                // Quadrática
                if (coefA == "a") {
                    // Variável
                    funcStr += "a · x²"
                } else if (coefA != "a") {
                    // Não variável
                    if (Algebra.absolute(coefA) == 1) {
                        // Se for 1 ou -1, não mostra o número, só o sinal
                        if (coefA == -1) {
                            // Se for -1, mostra o sinal de menos
                            funcStr += "−"
                        }
                        funcStr += "x²"
                    } else if (Algebra.absolute(coefA) != 1) {
                        // Se for diferente de 1 ou -1, mostra o número
                        funcStr += String(coefA) + " · x²"
                    }
                }

                if (coefB == "b") {
                    // Variável
                    funcStr += " + b · x"
                } else if (coefB != "b" && coefB != 0) {
                    // Não variável e diferente de zero
                    if (coefB > 0) {
                        // Se for positivo, mostra o sinal de mais
                        funcStr += " + "
                    } else if (coefB < 0) {
                        // Se for negativo, mostra o sinal de menos e o número positivo
                        funcStr += " − "
                    }

                    if (Algebra.absolute(coefB) == 1) {
                        // Se for 1 ou -1, não mostra o número, só o sinal
                        funcStr += "x"
                    } else if (Algebra.absolute(coefB) != 1) {
                        // Se for diferente de 1 ou -1, mostra o número
                        funcStr += String(Algebra.absolute(coefB)) + " · x"
                    }
                }

                if (coefC == "c") {
                    // Variável
                    funcStr += " + c"
                } else if (coefC != "c" && coefC != 0) {
                    // Não variável
                    if (coefC > 0) {
                        // Se for positivo, mostra o sinal de mais
                        funcStr += " + " + String(coefC)
                    } else if (coefC < 0) {
                        // Se for negativo, mostra o sinal de menos e o número positivo
                        funcStr += " − " + String(-coefC)
                    }
                }

                funcStr += tr("ui.quadratic")

                // Especiais
                if (coefB == 0 && coefC == 0) {
                    // Se os coeficientes b e c forem zero, é uma função quadrática pura
                    funcStr += tr("ui.pure")
                } else if (coefB == 0) {
                    // Se o coeficiente b for zero, é uma função incompleta sem termo linear
                    funcStr += tr("ui.quadraticIncompleteLinear")
                } else if (coefC == 0) {
                    // Se o coeficiente c for zero, é uma função incompleta sem termo constante
                    funcStr += tr("ui.quadraticIncompleteConstant")
                }
            }
        } else if (funcExp && funcTrig == "") {
            // Exponencial
            if (coefB != "b" && coefB != 0) {
                // Não variável
                if (coefB != 1) {
                    // Se for diferente de 1, mostra o número
                    funcStr += String(coefB) + " × "
                }
            } else if (coefB == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefA != "a" && coefA != 0) {
                // Não variável
                funcStr += String(coefA) + "ˣ"
            } else if (coefA == "a") {
                // Variável
                funcStr += "aˣ"
            }

            if (coefC != "c" && coefC != 0) {
                // Não variável
                if (coefC > 0) {
                    // Se for positivo, mostra o sinal de mais
                    funcStr += " + " + String(coefC)
                } else if (coefC < 0) {
                    // Se for negativo, mostra o sinal de menos e o número positivo
                    funcStr += " − " + String(-coefC)
                }
            } else if (coefC == "c") {
                // Variável
                funcStr += " + c"
            }

            funcStr += tr("ui.exponential")

            // Especiais
            if (coefB == 1 && coefC == 0) {
                // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função exponencial pura
                funcStr += tr("ui.pura")
            }
            if (coefA == Algebra.round(Math.E)) {
                // Se o coeficiente a for igual a e, é uma função exponencial natural
                funcStr += tr("ui.natural")
            }
        } else if (funcLog && funcTrig == "") {
            // Logarítmica
            if (coefB != "b" && coefB != 0) {
                // Não variável
                if (coefB != 1) {
                    funcStr += String(coefB) + " × "
                }
            } else if (coefB == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefA != "a" && coefA != 0) {
                // Não variável
                funcStr += "log" + Writing.subscript(coefA) + "(x)"
            } else if (coefA == "a") {
                // Variável
                funcStr += "logₐ(x)"
            }

            if (coefC != "c" && coefC != 0) {
                // Não variável
                if (coefC > 0) {
                    // Se for positivo, mostra o sinal de mais
                    funcStr += " + " + String(coefC)
                } else if (coefC < 0) {
                    // Se for negativo, mostra o sinal de menos e o número positivo
                    funcStr += " − " + String(-coefC)
                }
            } else if (coefC == "c") {
                // Variável
                funcStr += " + c"
            }

            funcStr += tr("ui.logarithmic")

            // Especiais
            if (coefB == 1 && coefC == 0) {
                // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função logarítmica pura
                funcStr += tr("ui.pure")
            }
            if (coefA == Algebra.round(Math.E)) {
                // Se o coeficiente a for igual a e, é uma função logarítmica natural
                funcStr += tr("ui.natural")
            } else if (coefA == 10) {
                // Se o coeficiente a for igual a 10, é uma função logarítmica decimal
                funcStr += tr("ui.decimal")
            }
        } else if (funcTrig != "") {
            // Trigonométrica
            if (coefB != "b" && coefB != 0) {
                // Não variável
                if (coefB != 1) {
                    funcStr += String(coefB) + " × "
                }
            } else if (coefB == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefA != "a" && coefA != 0) {
                // Não variável
                funcStr += funcTrig + "(" + String(coefA) + " · x)"
            } else if (coefA == "a") {
                funcStr += funcTrig + "(a · x)"
            }

            if (coefC != "c" && coefC != 0) {
                // Não variável
                if (coefC > 0) {
                    // Se for positivo, mostra o sinal de mais
                    funcStr += " + " + String(coefC)
                } else if (coefC < 0) {
                    // Se for negativo, mostra o sinal de menos e o número positivo
                    funcStr += " − " + String(-coefC)
                }
            } else if (coefC == "c") {
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
            if (Commands.names().includes(value)) {
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
