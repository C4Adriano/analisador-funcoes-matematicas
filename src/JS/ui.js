import { Algebra } from "./algebra.js"
import { Commands } from "./commands.js"
import { Config } from "./config.js"
import { Error } from "./error.js"
import { Helpers } from "./helpers.js"
import { tr } from "./i18n.js"
import { State } from "./state.js"
import { Writing } from "./writing.js"

/**
 * [UI] Objeto base para as funções envolvendo UI / UX e interação com o usuário
 * - Use as funções aqui para exibir mensagens, menus, prompts e outras interações.
 * @since v6.1.0
 */
export const Ui = {
    /**
     * [UI] Exibe um alert personalizado
     * @param {string} message - Mensagem
     * @param {string} explanation - Explicação
     * @since v6.1.0
     */
    display(message = "", explanation = "", debug = Config.debug) {
        if (debug) {
            console.log("Mensagem:", message)
            if (explanation != "") {
                console.log("Explicação:", explanation)
            }
        } else {
            alert(Writing.format(message, explanation))
        }
    },

    /**
     * [UI] Exibe um confirm personalizado
     * @param {string} message - Mensagem
     * @param {string} explanation - Explicação
     * @returns {boolean} - Sim / Não
     * @since v6.1.0
     */
    confirm(message = "", explanation = "", debug = Config.debug) {
        if (debug) {
            console.log(tr("Mensagem: ", "Message: "), message)
            if (explanation != "") {
                console.log(tr("Explicação: ", "Explanation: "), explanation)
            }
            return true
        } else {
            return confirm(
                Writing.format(
                    message,
                    explanation + "\n\n" + tr("“Ok” = “Sim” | “Cancelar” = “Não”", "“Ok” = “Yes” | “Cancel” = “No”")
                )
            )
        }
    },

    /**
     * [UI] Exibe uma mensagem de erro
     * @param {string} message - Mensagem
     * @param {string} explanation - Explicação
     * @since v6.1.0
     */
    error(message = "", explanation = "", debug = Config.debug) {
        if (Config.errors) {
            Ui.display("=== " + tr("Erro", "Error") + " ===\n" + message, explanation, debug)
        }
    },

    /**
     * [UI] Exibe uma mensagem de aviso
     * @param {string} message - Mensagem
     * @param {string} explanation - Explicação
     * @param {boolean} type - Tipo da mensagem
     * @since v6.1.0
     */
    warning(message = "", explanation = "", type = false, debug = Config.debug) {
        if (!type) {
            // Se tipo for falso, é um aviso simples, como um alert
            Ui.display("=== " + tr("Aviso", "Warning") + " ===\n" + message, explanation, debug)
        } else {
            // Se tipo for verdadeiro, é um aviso de confirmação, como um confirm
            return Ui.confirm("=== " + tr("Aviso", "Warning") + " ===\n" + message, explanation, debug)
        }
    },

    /**
     * [UI] Formata um menu paginado
     * @param {string[]} options Array com todas as opções possíveis
     * @param {number} page Página atual
     * @returns {number[]} - Retorna a resposta, a página atual, as opções por página
     * @since v6.1.0
     */
    menu(options = ["---"], page = 1) {
        let answer = 0,
            menu = "",
            option = 1,
            total = 0,
            list = [].concat(options)

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
            menu =
                "=== Menu ===\n" +
                tr("Página ", "Page ") +
                String(page) +
                "/" +
                String(total) +
                "\n" +
                tr("O que queres?", "What do you want?")

            while (option <= 5) {
                menu += "\n" + String(option) + " = " + String(list[option - 1 + 5 * (page - 1)])
                option++
            }

            option = 1
            menu +=
                "\n----------------\n" +
                "6 = " +
                tr("Rever", "Review") +
                " | 7 = " +
                tr("Alterar", "Change") +
                " | 8 = " +
                tr("Anterior", "Previous") +
                " | 9 = " +
                tr("Próxima", "Next") +
                " | 0 = " +
                tr("Voltar", "Back")

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
        } while (!(0 <= answer && answer <= 9) && !Commands.names().includes(answer))

        return [answer, page]
    },

    /**
     * [UI] Exibe um prompt personalizado e verifica ele
     * @param {string} message - Mensagem
     * @param {string} explanation - Explicação
     * @param {boolean} number - true = número, false = string
     * @param {number} places - Casas para arredondar (0 = sem casas)
     * @returns {string | number} - Valor verificado
     * @since v6.1.0
     */
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
                if (angle) {
                    value = Writing.parseAngle(text)
                } else {
                    value = Number(Writing.decimal(text, true))
                }
                valid = isFinite(value)
            }

            // Confirma
            if (valid && Config.inputConfirm) {
                valid = Ui.warning(
                    tr("Tu digitaste: “", "You typed: “") +
                        (number ? (angle ? Writing.formatAngle(value) : Writing.decimal(value)) : text) +
                        tr("”\nTens certeza?", "”\nAre you sure?"),
                    tr(
                        "Obs.₁: Se essa for uma variável e o que foi digitado não for um número, ela será transformada no nome da variável, não no que foi digitado\nObs.₂: Essas mensagens podem ser desativadas nas configurações, em “Confirmações de entrada”",
                        "Note₁: If this is a variable and what was typed is not a number, it will be transformed into the variable name, not what was typed.\nNote₂: These messages can be disabled in the settings, under “Input Confirmations”."
                    ),
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

    /**
     * [UI] Formata uma função
     * @param {string | number} coefA - Coeficiente a
     * @param {string | number} coefB - Coeficiente b
     * @param {string | number} coefC - Coeficiente c
     * @param {boolean} funcExp - Exponencial
     * @param {boolean} funcLog - Logarítmica
     * @param {string} funcTrig - Trigonométrica (sin, cos, tan)
     * @param {boolean} show - Mostrará a função ou não, baseado na configuração
     * @since v6.1.0
     */
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

        let funcStr = tr("A função: ƒ(x) = ", "The function: ƒ(x) = ")

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

                funcStr += tr(" é constante", " is constant")

                // Especiais
                if (coefC == 0) {
                    // Se for zero, é a função nula
                    funcStr += tr(" / nula", " / null")
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

                funcStr += tr(" é afim", " is affine")

                // Especiais
                if (coefB != 1 && coefC == 0) {
                    // Se o coeficiente b for diferente de 1 e o coeficiente c for zero, é uma função linear
                    funcStr += " / linear"
                } else if (coefB == 1 && coefC == 0) {
                    // Se o coeficiente b for 1 e o coeficiente c for zero, é a função identidade
                    funcStr += tr(" / identidade", " / identity")
                } else if (coefB == -1) {
                    // Se o coeficiente b for -1, é a função oposta da identidade
                    funcStr += tr(" / oposta", " / opposite")
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

                funcStr += tr(" é quadrática", " is quadratic")

                // Especiais
                if (coefB == 0 && coefC == 0) {
                    // Se os coeficientes b e c forem zero, é uma função quadrática pura
                    funcStr += tr(" / pura", " / pure")
                } else if (coefB == 0) {
                    // Se o coeficiente b for zero, é uma função incompleta sem termo linear
                    funcStr += tr(" / incompleta (sem termo linear)", " / incomplete (without linear term)")
                } else if (coefC == 0) {
                    // Se o coeficiente c for zero, é uma função incompleta sem termo constante
                    funcStr += tr(" / incompleta (sem termo constante)", " / incomplete (without constant term)")
                }
            }
        } else if (funcExp && funcTrig == "") {
            // Exponencial
            if (coefB != "b") {
                // Não variável
                if (coefB != 1) {
                    // Se for diferente de 1, mostra o número
                    funcStr += String(coefB) + " × "
                }
            } else if (coefB == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefA != "a") {
                // Não variável
                funcStr += String(coefA) + "ˣ"
            } else if (coefA == "a") {
                // Variável
                funcStr += "aˣ"
            }

            if (coefC != "c") {
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

            funcStr += tr(" é exponencial", " is exponential")

            // Especiais
            if (coefB == 1 && coefC == 0) {
                // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função exponencial pura
                funcStr += tr(" / pura", " / pure")
            }
            if (coefA == Algebra.round(Math.E)) {
                // Se o coeficiente a for igual a e, é uma função exponencial natural
                funcStr += " / natural"
            }
        } else if (funcLog && funcTrig == "") {
            // Logarítmica
            if (coefB != "b") {
                // Não variável
                if (coefB != 1) {
                    funcStr += String(coefB) + " × "
                }
            } else if (coefB == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefA != "a") {
                // Não variável
                funcStr += "log" + Writing.subscript(coefA) + "(x)"
            } else if (coefA == "a") {
                // Variável
                funcStr += "logₐ(x)"
            }

            if (coefC != "c") {
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

            funcStr += tr(" é logarítmica", " is logarithmic")

            // Especiais
            if (coefB == 1 && coefC == 0) {
                // Se o coeficiente b for 1 e o coeficiente c for zero, é uma função logarítmica pura
                funcStr += tr(" / pura", " / pure")
            }
            if (coefA == Algebra.round(Math.E)) {
                // Se o coeficiente a for igual a e, é uma função logarítmica natural
                funcStr += " / natural"
            } else if (coefA == 10) {
                // Se o coeficiente a for igual a 10, é uma função logarítmica decimal
                funcStr += " / decimal"
            }
        } else if (funcTrig != "") {
            // Trigonométrica
            if (coefB != "b") {
                // Não variável
                if (coefB != 1) {
                    funcStr += String(coefB) + " × "
                }
            } else if (coefB == "b") {
                // Variável
                funcStr += "b × "
            }

            if (coefA != "a") {
                // Não variável
                funcStr += funcTrig + "(" + String(coefA) + " · x)"
            } else if (coefA == "a") {
                funcStr += funcTrig + "(a · x)"
            }

            if (coefC != "c") {
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

        Ui.display("=== " + tr("Função Atual", "Current Function") + " ===\n" + Writing.decimal(funcStr))
    },

    /**
     * [UI] Pede ao usuário um valor entre o intervalo
     * @param {string} message - Mensagem
     * @param {string} explanation - Explicação
     * @param {number} min - Mínimo
     * @param {number} max - Máximo
     * @param {number} places - Casas decimais
     * @returns {number} - Um valor escolhido entre o intervalo
     * @since v6.1.0
     */
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
                Error.range(min, max)
            }
        } while (!(min <= value && value <= max))

        return value
    },
}
