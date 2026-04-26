import { Algebra } from "./algebra.js"
import { Analisar } from "./analisar.js"
import { loadConfig, Config, DEFAULT_CONFIG, saveConfig, VERSION } from "./config.js"
import { Error } from "./erro.js"
import { Writing } from "./escrita.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Commands } from "./comandos.js"

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
        State.globalA != State.funcAtual[0] ||
        State.globalB != State.funcAtual[1] ||
        State.globalC != State.funcAtual[2]
    ) {
        State.funcAtual = [State.globalA, State.globalB, State.globalC]
        State.history.push(State.funcAtual.slice())

        if (State.history.length > 9) {
            State.history.shift()
        }
    }

    // Tipo de função
    if (!State.keepType || State.type == "inicio") {
        State.type = Ui.input(
            "=== Início ===\nO que queres?\n1 = Funções polinomiais\n2 = Funções não polinomiais\n----------------\n6 = Antigas | 7 = Configurações | 8 = Rever | 9 = Alterar | 0 = Sair",
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
        (0 <= State.type && State.type <= 2) ||
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
                    Analisar.constant(State.globalC)
                } else if (State.globalA == 0 && State.globalB != 0) {
                    Analisar.affine(State.globalB, State.globalC)
                } else if (State.globalA != 0) {
                    Analisar.quadratic(State.globalA, State.globalB, State.globalC)
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
                                Analisar.exponential(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunc("exponencial")

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
                                Error.invalidFunc("exponencial")

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
                                Analisar.logarithmic(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunc("logarítmica")
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
                                Error.invalidFunc("logarítmica")
                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if ((6 <= subType && subType <= 9) || Commands.nomes().includes(subType)) {
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
                    State.globalA != State.funcAtual[0] ||
                    State.globalB != State.funcAtual[1] ||
                    State.globalC != State.funcAtual[2]
                ) {
                    State.funcAtual = [State.globalA, State.globalB, State.globalC]
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
                    Writing.itemConfig("Caracteres Unicode", "unicode"),
                    Writing.itemConfig("Explicações", "explanations"),
                    Writing.itemConfig("Acentos", "accents"),
                    Writing.itemConfig("Capitalizadas", "capitalized"),
                    Writing.itemConfig("Maiúsculas", "uppercase"),
                    Writing.itemConfig("Minúsculas", "lowercase"),

                    Writing.itemConfig("Ponto decimal", "decimalSeparator"),
                    Writing.itemConfig("Multiplicação simples", "simpleMulti"),
                    Writing.itemConfig("Confirmações de entrada", "inputConfirm"),
                    Writing.itemConfig("Confirmações de saída", "outputConfirm"),
                    Writing.itemConfig("Mensagens de erro", "errors"),
                    Writing.itemConfig("Mostrar função", "showFunction"),

                    Writing.itemConfig("Casas decimais", "decimalPlaces"),
                    Writing.itemConfig("Precisão do log", "logPrecision"),
                    Writing.itemConfig("Precisão da divisão", "divPrecision"),
                    Writing.itemConfig("Limite de interações", "interactionLimit"),
                    Writing.itemConfig("Linguagem", "language"),
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
                            Writing.itemConfig("Ativar caracteres Unicode?", "unicode"),
                            "Obs.₁: Caracteres Unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. Desativar fará com que eles sejam transformados em uma palavra correspondente, tais como: “Reais”, “para todo”, etc.\nObs.₂: Nem todos os caracteres Unicode serão desativados\nObs.₃: Essa configuração pode mudar algumas explicações"
                        )
                    }

                    // Explicações
                    else if (choice == 2) {
                        Config.explanations = Ui.confirm(
                            Writing.itemConfig("Ativar explicações?", "explanations"),
                            "Obs.₁: Ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do Delta, Δ = b² - 4 · a · c, sem ser só o resultado dele\nObs.₂: Nem todas as mensagens têm versão explicada\nObs.₃: Desativar o Unicode fará com que seja mostrado: Delta = b^2 - 4 * a * c"
                        )
                    }

                    // Acentos
                    else if (choice == 3) {
                        Config.accents = Ui.confirm(
                            Writing.itemConfig("Ativar acentos?", "accents"),
                            "Obs.: Essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação"
                        )
                    }

                    // Capitalizadas
                    else if (choice == 4) {
                        Config.capitalized = Ui.confirm(
                            Writing.itemConfig("Ativar letras capitalizadas?", "capitalized"),
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
                            Writing.itemConfig("Ativar todas as letras maiúsculas?", "uppercase"),
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
                            Writing.itemConfig("Ativar todas as letras minúsculas?", "lowercase"),
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
                            Writing.itemConfig("Alterar ponto decimal?", "decimalSeparator"),
                            "Obs.₁: Essa configuração irá transformar os números com “.” em números com “,”, por exemplo: " +
                                Writing.decimal(123.456) +
                                "\nObs.₂: Isso é apenas estético e não irá afetar as contas\nObs.₃: Tu também poderás escrever os números com “,” em vez de “.”"
                        )
                    }

                    // Multiplicação simples
                    else if (choice == 2) {
                        Config.simpleMulti = Ui.confirm(
                            Writing.itemConfig("Alterar para multiplicação simples?", "simpleMulti"),
                            "Obs.₁: Isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”\nObs.₂: Desativar o Unicode irá transformar o “·” em “*”\nObs.₃: Isso não irá afetar o “×”, porém o Unicode irá transformá-lo em “*”"
                        )
                    }

                    // Confirmações de entrada
                    else if (choice == 3) {
                        Config.inputConfirm = Ui.confirm(
                            Writing.itemConfig("Ativar confirmações de entrada?", "inputConfirm"),
                            "Obs.: Toda e qualquer coisa digitada passará a ter que ser confirmada"
                        )
                    }

                    // Confirmações de saída
                    else if (choice == 4) {
                        Config.outputConfirm = Ui.confirm(
                            Writing.itemConfig("Ativar confirmações de saída?", "outputConfirm"),
                            "Obs.: Isso irá ativar uma mensagem antes de sair / fechar o programa"
                        )
                    }

                    // Errors
                    else if (choice == 5) {
                        Config.errors = Ui.confirm(
                            Writing.itemConfig("Ativar mensagens de erro?", "errors"),
                            "Obs.: Desativar pode fazer com que tu não percebas algum erro que estás cometendo"
                        )
                    }

                    // Função
                    else if (choice == 6) {
                        Config.showFunction = Ui.confirm(
                            Writing.itemConfig("Ativar exibição da função?", "showFunction"),
                            "Obs.₁: “Mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções\nObs.₂: A função ainda continuará sendo mostrada quando for escolhida a opção “6” (Rever / Mostrar função)"
                        )
                    }
                }

                // Página 3
                else if (page == 3) {
                    // Casas decimais
                    if (choice == 1) {
                        Config.decimalPlaces = Ui.range(
                            Writing.itemConfig("Quantas casas decimais?", "decimalPlaces"),
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
                            Writing.itemConfig("Qual a precisão do log?", "logPrecision"),
                            "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo logs\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Precisão da divisão
                    else if (choice == 3) {
                        Config.divPrecision = Ui.range(
                            Writing.itemConfig("Qual a precisão da divisão?", "divPrecision"),
                            "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo divisões\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Limite de interações
                    else if (choice == 4) {
                        Config.interactionLimit = Ui.range(
                            Writing.itemConfig("Qual o limite de interações?", "interactionLimit"),
                            "Obs.₁: Isso irá afetar todos os loops, tais como logs, menus, etc.\nObs.₂: Essa configuração é útil para evitar loops infinitos no código, caso algo dê errado",
                            100,
                            10000
                        )
                    }

                    // Linguagem
                    else if (choice == 5) {
                        let question = Ui.range(
                                Writing.itemConfig("Qual língua?", "language") +
                                    "\n1 = Português Brasileiro\n2 = Inglês",
                                "Obs.: Isso irá alterar a língua do sistema inteiro.",
                                1,
                                2,
                                0
                            ),
                            language = question == 1 ? "pt-br" : "en"
                        if (language != Config.language) {
                            if (Ui.confirm("Tu queres alterar a língua para: " + language, "")) {
                                if (language == "pt-br") {
                                    Config.decimalSeparator = true
                                    Config.accents = true
                                } else if (language == "en") {
                                    Config.decimalSeparator = false
                                    Config.accents = false
                                }

                                Config.language = language

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
                    }

                    /* Comandos
                    else if (choice == 6) {
                    } */
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
