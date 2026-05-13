import { Algebra } from "./algebra.js"
import { Analyze } from "./analyze.js"
import { Commands } from "./commands.js"
import { Config, DEFAULT_CONFIG, VERSION, saveConfig, loadConfig, changeLanguage } from "./config.js"
import { Error } from "./error.js"
import { Phrases } from "./phrases.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

/**
 * @status Funcionando
 * [ 0% ] Phrases
 */

console.log(
    "" +
        "====================================================" +
        "\n" +
        "Mathematical Function Analyzer / Analisador de Funções Matemáticas — " +
        VERSION +
        "\n" +
        "All rights reserved / Todos os direitos reservados © Adriano Lima 2025 — 2026" +
        "\n" +
        "===================================================="
)

// Carregar as configurações
loadConfig()

// Introdução
Ui.display(
    "Bem-vindo ao Analisador de Funções Matemáticas!",
    "Este programa analisa funções do tipo constante, afim, quadrática, exponencial e logarítmica — identificando suas propriedades e características. Para começar, informe os dados da função quando solicitado."
)

// === OBJETOS GLOBAIS ===
// Para alterar o HTML também, conforme a língua
document.title = Config.language == "en" ? "Mathematical Function Analyzer" : "Analisador de Funções Matemáticas"
document.querySelector("h1").textContent = Config.language == "en" ? "Mathematics" : "Matemática"
document.documentElement.lang = Config.language

let subType = 0,
    subLoop = false,
    choice = 0,
    page = 1

State.globalA = Algebra.variables("a")
State.globalB = Algebra.variables("b")
State.globalC = Algebra.variables("c")

// Código principal
do {
    // Variáveis globais
    if (State.askCoeffs) {
        State.globalA = Algebra.variables("a")
        State.globalB = Algebra.variables("b")
        State.globalC = Algebra.variables("c")
    }

    // Salva histórico
    if (
        State.globalA != State.currentFunc[0] ||
        State.globalB != State.currentFunc[1] ||
        State.globalC != State.currentFunc[2]
    ) {
        State.currentFunc = [State.globalA, State.globalB, State.globalC]
        State.history.push(State.currentFunc.slice())

        if (State.history.length > 9) {
            State.history.shift()
        }
    }

    // Tipo de função
    if (!State.keepType || State.type == "inicio") {
        State.type = Ui.input(
            "=== Início ===\nO que queres?\n1 = Funções polinomiais\n2 = Funções não polinomiais\n3 = Funções trigonométricas\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Sair",
            "",
            true,
            0,
            true
        )
    }

    State.keepType = false
    State.askCoeffs = false
    State.loop = false

    if (
        (0 <= State.type && State.type <= 3) ||
        (6 <= State.type && State.type <= 9) ||
        Commands.names().includes(State.type)
    ) {
        // Polinomiais
        if (State.type == 1) {
            // Incógnitas
            if (!isFinite(State.globalA) || !isFinite(State.globalB) || !isFinite(State.globalC)) {
                State.coefficients = Algebra.unknown(State.globalA, State.globalB, State.globalC)
                State.globalA = Algebra.round(State.coefficients[0])
                State.globalB = Algebra.round(State.coefficients[1])
                State.globalC = Algebra.round(State.coefficients[2])
            }

            // Números
            if (isFinite(State.globalA) && isFinite(State.globalB) && isFinite(State.globalC)) {
                if (State.globalA == 0 && State.globalB == 0) {
                    Analyze.constant(State.globalC)
                } else if (State.globalA == 0 && State.globalB != 0) {
                    Analyze.affine(State.globalB, State.globalC)
                } else if (State.globalA != 0) {
                    Analyze.quadratic(State.globalA, State.globalB, State.globalC)
                }
            }
        }

        // Não polinomial
        else if (State.type == 2) {
            // Loop do menu
            do {
                subType = Ui.input(
                    "=== Menu ===\nO que queres?\n1 = Função exponencial\n2 = Função logarítmica\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Voltar",
                    "",
                    true,
                    0,
                    true
                )

                subLoop = false

                if (
                    (0 <= subType && subType <= 2) ||
                    (6 <= subType && subType <= 9) ||
                    Commands.names().includes(subType)
                ) {
                    // Exponencial
                    if (subType == 1) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.unknown(State.globalA, State.globalB, State.globalC, true)
                            State.globalA = Algebra.round(State.coefficients[0])
                            State.globalB = Algebra.round(State.coefficients[1])
                            State.globalC = Algebra.round(State.coefficients[2])
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA > 0 && State.globalA != 1 && State.globalB != 0) {
                                Analyze.exponential(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunction("exponencial")

                                if (State.globalA == 1) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Error de base
                            else if (State.globalA < 0) {
                                Error.invalidFunction("exponencial")

                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Logarítmica
                    else if (subType == 2) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.unknown(
                                State.globalA,
                                State.globalB,
                                State.globalC,
                                false,
                                true
                            )
                            State.globalA = Algebra.round(State.coefficients[0])
                            State.globalB = Algebra.round(State.coefficients[1])
                            State.globalC = Algebra.round(State.coefficients[2])
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA > 0 && State.globalA != 1 && State.globalB != 0) {
                                Analyze.logarithmic(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunction("logarítmica")
                                if (State.globalA == 1) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Error de base
                            else if (State.globalA < 0) {
                                Error.invalidFunction("logarítmica")
                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if ((6 <= subType && subType <= 9) || Commands.names().includes(subType)) {
                        State.type = subType
                        State.loop = true
                        if (subType != "sair") {
                            State.keepType = true
                        }
                    }

                    // Voltar
                    else if (subType == 0) {
                        State.loop = true
                    }
                }

                // Error
                else {
                    subLoop = true
                }
            } while (subLoop)
        }

        // Trigonométrica
        else if (State.type == 3) {
            // Loop do menu
            do {
                subType = Ui.input(
                    "=== Menu ===\nO que queres?\n1 = Função seno\n2 = Função cosseno\n3 = Função tangente\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Voltar",
                    "",
                    true,
                    0,
                    true
                )

                subLoop = false

                if (
                    (0 <= subType && subType <= 2) ||
                    (6 <= subType && subType <= 9) ||
                    Commands.names().includes(subType)
                ) {
                    // Seno
                    if (subType == 1) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.unknown(
                                State.globalA,
                                State.globalB,
                                State.globalC,
                                false,
                                false,
                                "sin"
                            )
                            State.globalA = Algebra.round(State.coefficients[0])
                            State.globalB = Algebra.round(State.coefficients[1])
                            State.globalC = Algebra.round(State.coefficients[2])
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.sine(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Error.constantFunction("seno")

                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }
                        }
                    }

                    // Cosseno
                    else if (subType == 2) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.unknown(
                                State.globalA,
                                State.globalB,
                                State.globalC,
                                false,
                                false,
                                "cos"
                            )
                            State.globalA = Algebra.round(State.coefficients[0])
                            State.globalB = Algebra.round(State.coefficients[1])
                            State.globalC = Algebra.round(State.coefficients[2])
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.cosine(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Error.constantFunction("cosseno")

                                if (State.globalA == 0) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }
                        }
                    }

                    // Tangente
                    else if (subType == 3) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.unknown(
                                State.globalA,
                                State.globalB,
                                State.globalC,
                                false,
                                false,
                                "tan"
                            )
                            State.globalA = Algebra.round(State.coefficients[0])
                            State.globalB = Algebra.round(State.coefficients[1])
                            State.globalC = Algebra.round(State.coefficients[2])
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.tangent(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Error.constantFunction("tangente")

                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if ((6 <= subType && subType <= 9) || Commands.names().includes(subType)) {
                        State.type = subType
                        State.loop = true
                        if (subType != "sair") {
                            State.keepType = true
                        }
                    }

                    // Voltar
                    else if (subType == 0) {
                        State.loop = true
                    }
                }

                // Error
                else {
                    subLoop = true
                }
            } while (subLoop)
        }

        // Histórico
        else if (State.type == 6 || State.type == "historico") {
            State.loop = true

            // Error de histórico
            if (State.history.length == 1) {
                Ui.display(
                    "Não há histórico o suficiente para mudanças.",
                    "Escrevestes apenas uma função até agora. Use “alterar” para escrever outra função."
                )
            } else {
                let message = "=== Histórico ===\nO que queres?\n",
                    answer = 0,
                    option = 1

                // Mostra histórico
                for (let func = State.history.length - 1; func >= 0; func--) {
                    message +=
                        String(option) +
                        " ⇒ “a” = " +
                        Writing.decimal(State.history[func][0]) +
                        "; “b” = " +
                        Writing.decimal(State.history[func][1]) +
                        "; “c” = " +
                        Writing.decimal(State.history[func][2]) +
                        "\n"
                    option++
                }

                // Escolha
                answer = Ui.range(message, "", 0, State.history.length - 1)

                // Restaura função
                let index = State.history.length - 1 - answer
                ;((State.globalA = State.history[index][0]),
                    (State.globalB = State.history[index][1]),
                    (State.globalC = State.history[index][2]))
                if (
                    State.globalA != State.currentFunc[0] ||
                    State.globalB != State.currentFunc[1] ||
                    State.globalC != State.currentFunc[2]
                ) {
                    State.currentFunc = [State.globalA, State.globalB, State.globalC]
                }
            }
        }

        // Configurações
        else if (State.type == 7 || State.type == "config") {
            page = 1
            // Loop
            do {
                State.type = -1
                State.loop = true

                // Menu de configurações
                let configOptions = [
                    Writing.configItem("Caracteres Unicode", "unicode"),
                    Writing.configItem("Explicações", "explanations"),
                    Writing.configItem("Acentos", "accents"),
                    Writing.configItem("Capitalizadas", "capitalized"),
                    Writing.configItem("Maiúsculas", "uppercase"),
                    Writing.configItem("Minúsculas", "lowercase"),

                    Writing.configItem("Ponto decimal", "decimalSeparator"),
                    Writing.configItem("Multiplicação simples", "simpleMulti"),
                    Writing.configItem("Confirmações de entrada", "inputConfirm"),
                    Writing.configItem("Confirmações de saída", "outputConfirm"),
                    Writing.configItem("Mensagens de erro", "errors"),
                    Writing.configItem("Mostrar função", "showFunction"),

                    Writing.configItem("Casas decimais", "decimalPlaces"),
                    Writing.configItem("Precisão do log", "logPrecision"),
                    Writing.configItem("Precisão da divisão", "divPrecision"),
                    Writing.configItem("Limite de interações", "interactionLimit"),
                    Writing.configItem("Linguagem", "language"),
                    Writing.configItem("Graus", "degrees"),
                ]

                // Preenche com separadores
                while (configOptions.length % 6 != 0 || configOptions.length == 0) {
                    configOptions.push("---")
                }
                let total = Math.ceil(configOptions.length / 6),
                    option = 1

                // Controla página
                if (page < 1) {
                    page = 1
                } else if (page > total) {
                    page = total
                }

                // Mostra opções
                let text =
                    "=== Configurações ===\nPágina " +
                    String(page) +
                    "/" +
                    String(total) +
                    "\nObs.: Configurações não são salvas ao fechar"
                while (option <= 6) {
                    text += "\n" + String(option) + " = " + String(configOptions[option - 1 + 6 * (page - 1)])
                    option++
                }
                option = 1
                text += "\n----------------\n7 = Restaurar padrão | 8 = Anterior | 9 = Próxima | 0 = Voltar"

                // Escolha
                choice = Ui.range(text, "", 0, 9, 0, true)
                if (choice == 7) {
                    // Padrão
                    if (JSON.stringify(Config) == JSON.stringify(DEFAULT_CONFIG)) {
                        Ui.warning(
                            "Todas as configurações já estão na forma padrão.",
                            "Não há necessidade de restaurar."
                        )
                    } else {
                        let message = "Voltar às configurações padrão?\nConfigurações afetadas:\n",
                            keys = Object.keys(Config)

                        // Mostra configurações afetadas
                        for (let i = 0; i < keys.length; i++) {
                            message += Config[keys[i]] != DEFAULT_CONFIG[keys[i]] ? keys[i] + ", " : ""
                        }

                        // Remove última vírgula e espaço
                        message = message.slice(0, -2)

                        // Confirmação
                        if (
                            Ui.warning(
                                message,
                                "Obs.₁: Isso irá afetar todas as configurações acima\nObs.₂: Essa alteração é permanente",
                                true
                            )
                        ) {
                            for (let i = 0; i < keys.length; i++) {
                                Config[keys[i]] = DEFAULT_CONFIG[keys[i]]
                            }
                        }
                    }
                } else if (choice == 8) {
                    // -1
                    choice = -1
                    page -= 1
                } else if (choice == 9) {
                    // +1
                    choice = -1
                    page += 1
                } else if (choice == "config") {
                    choice = -1
                } else if (choice == "sair") {
                    choice = 0
                    State.type = "sair"
                }

                // Página 1
                if (page == 1) {
                    // Unicode
                    if (choice == 1) {
                        Config.unicode = Ui.confirm(
                            Writing.configItem("Ativar caracteres Unicode?", "unicode"),
                            "Obs.₁: Caracteres Unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. Desativar fará com que eles sejam transformados em uma palavra correspondente, tais como: “Reais”, “para todo”, etc.\nObs.₂: Nem todos os caracteres Unicode serão desativados\nObs.₃: Essa configuração pode mudar algumas explicações"
                        )
                    }

                    // Explicações
                    else if (choice == 2) {
                        Config.explanations = Ui.confirm(
                            Writing.configItem("Ativar explicações?", "explanations"),
                            "Obs.₁: Ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do Delta, Δ = b² - 4 · a · c, sem ser só o resultado dele\nObs.₂: Nem todas as mensagens têm versão explicada\nObs.₃: Desativar o Unicode fará com que seja mostrado: Delta = b^2 - 4 * a * c"
                        )
                    }

                    // Acentos
                    else if (choice == 3) {
                        Config.accents = Ui.confirm(
                            Writing.configItem("Ativar acentos?", "accents"),
                            "Obs.: Essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação"
                        )
                    }

                    // Capitalizadas
                    else if (choice == 4) {
                        Config.capitalized = Ui.confirm(
                            Writing.configItem("Ativar letras capitalizadas?", "capitalized"),
                            "Obs.₁: Essa configuração irá transformar as palavras em “normais”, no caso, a primeira letra da frase em maiúscula e as outras todas em minúsculas\nObs.₂: Essa configuração irá desativar “maiúsculas” e “minúsculas”"
                        )
                        if (Config.capitalized) {
                            Config.lowercase = false
                            Config.uppercase = false
                        } else if (!Config.uppercase && !Config.lowercase) {
                            Config.capitalized = true
                        }
                    }

                    // Maiúsculas
                    else if (choice == 5) {
                        Config.uppercase = Ui.confirm(
                            Writing.configItem("Ativar todas as letras maiúsculas?", "uppercase"),
                            "Obs.₁: Essa configuração irá transformar todas as letras em maiúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “minúsculas”"
                        )
                        if (Config.uppercase) {
                            Config.capitalized = false
                            Config.lowercase = false
                        } else if (!Config.lowercase && !Config.capitalized) {
                            Config.capitalized = true
                        }
                    }

                    // Minúsculas
                    else if (choice == 6) {
                        Config.lowercase = Ui.confirm(
                            Writing.configItem("Ativar todas as letras minúsculas?", "lowercase"),
                            "Obs.₁: Essa configuração irá transformar todas as letras em minúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “maiúsculas”"
                        )
                        if (Config.lowercase) {
                            Config.capitalized = false
                            Config.uppercase = false
                        } else if (!Config.uppercase && !Config.capitalized) {
                            Config.capitalized = true
                        }
                    }
                }

                // Página 2
                else if (page == 2) {
                    // Ponto decimal
                    if (choice == 1) {
                        Config.decimalSeparator = Ui.confirm(
                            Writing.configItem("Alterar ponto decimal?", "decimalSeparator"),
                            "Obs.₁: Essa configuração irá transformar os números com “.” em números com “,”, por exemplo: " +
                                Writing.decimal(123.456) +
                                "\nObs.₂: Isso é apenas estético e não irá afetar as contas\nObs.₃: Tu também poderás escrever os números com “,” em vez de “.”"
                        )
                    }

                    // Multiplicação simples
                    else if (choice == 2) {
                        Config.simpleMulti = Ui.confirm(
                            Writing.configItem("Alterar para multiplicação simples?", "simpleMulti"),
                            "Obs.₁: Isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”\nObs.₂: Desativar o Unicode irá transformar o “·” em “*”\nObs.₃: Isso não irá afetar o “×”, porém o Unicode irá transformá-lo em “*”"
                        )
                    }

                    // Confirmações de entrada
                    else if (choice == 3) {
                        Config.inputConfirm = Ui.confirm(
                            Writing.configItem("Ativar confirmações de entrada?", "inputConfirm"),
                            "Obs.: Toda e qualquer coisa digitada passará a ter que ser confirmada"
                        )
                    }

                    // Confirmações de saída
                    else if (choice == 4) {
                        Config.outputConfirm = Ui.confirm(
                            Writing.configItem("Ativar confirmações de saída?", "outputConfirm"),
                            "Obs.: Isso irá ativar uma mensagem antes de sair / fechar o programa"
                        )
                    }

                    // Errors
                    else if (choice == 5) {
                        Config.errors = Ui.confirm(
                            Writing.configItem("Ativar mensagens de erro?", "errors"),
                            "Obs.: Desativar pode fazer com que tu não percebas algum erro que estás cometendo"
                        )
                    }

                    // Função
                    else if (choice == 6) {
                        Config.showFunction = Ui.confirm(
                            Writing.configItem("Ativar exibição da função?", "showFunction"),
                            "Obs.₁: “Mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções\nObs.₂: A função ainda continuará sendo mostrada quando for escolhida a opção “6” (Rever / Mostrar função)"
                        )
                    }
                }

                // Página 3
                else if (page == 3) {
                    // Casas decimais
                    if (choice == 1) {
                        Config.decimalPlaces = Ui.range(
                            Writing.configItem("Quantas casas decimais?", "decimalPlaces"),
                            "Obs.₁: Um número muito pequeno de casas decimais pode fazer as contas ficarem erradas\nObs.₂: Os números já digitados serão arredondados para o novo número de casas decimais",
                            3,
                            10
                        )

                        // Arredonda novamente
                        if (State.globalA != "a") {
                            State.globalA = Algebra.round(State.globalA)
                        }
                        if (State.globalB != "b") {
                            State.globalB = Algebra.round(State.globalB)
                        }
                        if (State.globalC != "c") {
                            State.globalC = Algebra.round(State.globalC)
                        }
                    }

                    // Precisão do log
                    else if (choice == 2) {
                        Config.logPrecision = Ui.range(
                            Writing.configItem("Qual a precisão do log?", "logPrecision"),
                            "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo logs\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Precisão da divisão
                    else if (choice == 3) {
                        Config.divPrecision = Ui.range(
                            Writing.configItem("Qual a precisão da divisão?", "divPrecision"),
                            "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo divisões\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Limite de interações
                    else if (choice == 4) {
                        Config.interactionLimit = Ui.range(
                            Writing.configItem("Qual o limite de interações?", "interactionLimit"),
                            "Obs.₁: Isso irá afetar todos os loops, tais como logs, menus, etc.\nObs.₂: Essa configuração é útil para evitar loops infinitos no código, caso algo dê errado",
                            100,
                            10000
                        )
                    }

                    // Linguagem
                    else if (choice == 5) {
                        let question = Ui.range(
                                Writing.configItem("Qual língua?", "language") +
                                    "\n1 = Português Brasileiro\n2 = Inglês",
                                "Obs.: Isso irá alterar a língua do sistema inteiro.",
                                1,
                                2,
                                0
                            ),
                            language = question == 1 ? "pt-br" : "en"
                        if (language != Config.language) {
                            changeLanguage(language)

                            // Para alterar o HTML também, conforme a língua
                            document.title =
                                Config.language == "en"
                                    ? "Mathematical Function Analyzer"
                                    : "Analisador de Funções Matemáticas"
                            document.querySelector("h1").textContent =
                                Config.language == "en" ? "Mathematics" : "Matemática"
                            document.documentElement.lang = Config.language
                        }
                    }

                    // Graus
                    else if (choice == 6) {
                        Config.degrees = Ui.confirm(
                            Writing.configItem("Usar graus em vez de radianos?", "degrees"),
                            "Obs.₁: Isso irá afetar as funções trigonométricas, tais como seno, cosseno e tangente\nObs.₂: Ativar isso irá fazer com que os ângulos sejam interpretados como graus, e não π radianos"
                        )
                    }
                }

                // Salvar as configurações
                saveConfig()
            } while (choice != 0)
        }

        // Rever
        else if (State.type == 8 || State.type == "rever") {
            Ui.display(
                "Valores:\n“a” = " +
                    Writing.decimal(State.globalA) +
                    "\n“b” = " +
                    Writing.decimal(State.globalB) +
                    "\n“c” = " +
                    Writing.decimal(State.globalC)
            )
            State.loop = true
        }

        // Mudar
        else if (State.type == 9 || State.type == "alterar") {
            State.loop = true
            State.askCoeffs = true
        }

        // Sair
        else if (State.type == 0 || State.type == "sair") {
            if (Config.outputConfirm) {
                State.loop = !Ui.confirm("Tu queres sair?", "Obs.: Configurações poderão voltar ao padrão caso saias")
            } else {
                State.loop = false
            }
        }
    }

    // Error
    else {
        State.loop = true
    }
} while (State.loop)
