import { Algebra } from "./algebra.js"
import { Analyze } from "./analyze.js"
import { Checks } from "./checks.js"
import { Commands } from "./commands.js"
import { Config, VERSION, saveConfig, loadConfig, resetConfig, ConfigType, DEFAULT_CONFIG } from "./config.js"
import { Error } from "./error.js"
import { tr, changeLanguage } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

Ui.display(
    "====================================================" +
        "\n" +
        tr("Analisador de Funções Matemáticas", "Mathematical Function Analyzer") +
        " — " +
        VERSION +
        "\n" +
        tr("Todos os direitos reservados", "All rights reserved") +
        " © Adriano Lima 2025 — 2026" +
        "\n" +
        "====================================================",
    "",
    true
)

// Carregar as configurações
loadConfig()

// Introdução
Ui.display(
    tr("Bem-vindo ao Analisador de Funções Matemáticas!", "Welcome to the Mathematical Function Analyzer!"),
    tr(
        "Este programa analisa funções dos tipos constante, afim, quadrática, exponencial, logarítmica, seno, cosseno, tangente, etc. — identificando suas propriedades e características. Para começar, informe os dados da função quando solicitado.",
        "This program analyzes functions of the types constant, affine, quadratic, exponential, logarithmic, sine, cosine, tangent, etc. — identifying their properties and characteristics. To get started, enter the function data when prompted."
    )
)

// === OBJETOS GLOBAIS ===
// Para alterar o HTML também, conforme a língua
function setMeta(name, content) {
    const meta = document.querySelector(`meta[name="${name}"]`)
    if (meta) {
        meta.setAttribute("content", content)
    }
}

function setProperty(property, content) {
    const meta = document.querySelector(`meta[property="${property}"]`)
    if (meta) {
        meta.setAttribute("content", content)
    }
}

const title = tr("Analisador de Funções Matemáticas", "Mathematical Function Analyzer")

const description = tr(
    "Analisador de Funções Matemáticas desenvolvido em JavaScript e TypeScript.",
    "Mathematical Function Analyzer developed in JavaScript and TypeScript."
)

const locales = {
    pt: "pt_BR",
    en: "en_US",
}

document.documentElement.lang = Config.language
setProperty("og:locale", locales[Config.language])

document.title = title

setMeta("title", title)
setMeta("description", description)

setProperty("og:title", title)
setProperty("og:description", description)

setMeta("twitter:title", title)
setMeta("twitter:description", description)

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
    if (!State.keepType || State.type == "start") {
        State.type = Ui.input(
            "=== " +
                tr("Início", "Start") +
                " ===\n" +
                tr("O que queres?", "What do you want?") +
                "\n" +
                "1 = " +
                tr("Funções polinomiais", "Polynomial functions") +
                "\n" +
                "2 = " +
                tr("Funções não polinomiais", "Non-polynomial functions") +
                "\n" +
                "3 = " +
                tr("Funções trigonométricas", "Trigonometric functions") +
                "\n" +
                "----------------\n" +
                "6 = " +
                tr("Histórico", "History") +
                " | 7 = " +
                tr("Configurações", "Settings") +
                " | 8 = " +
                tr("Rever", "Review") +
                " | 9 = " +
                tr("Alterar", "Change") +
                " | 0 = " +
                tr("Sair", "Exit"),
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
        (typeof State.type === "number" &&
            ((0 <= State.type && State.type <= 3) || (6 <= State.type && State.type <= 9))) ||
        (typeof State.type === "string" && Commands.names().includes(State.type))
    ) {
        // Polinomiais
        if (State.type == 1) {
            // Incógnitas
            if (
                !Checks.isNumeric(State.globalA) ||
                !Checks.isNumeric(State.globalB) ||
                !Checks.isNumeric(State.globalC)
            ) {
                State.coefficients = Algebra.unknown(State.globalA, State.globalB, State.globalC)
                State.globalA = Algebra.round(State.coefficients[0])
                State.globalB = Algebra.round(State.coefficients[1])
                State.globalC = Algebra.round(State.coefficients[2])
            }

            // Números
            if (Checks.isNumeric(State.globalA) && Checks.isNumeric(State.globalB) && Checks.isNumeric(State.globalC)) {
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
                    "=== Menu ===\n" +
                        tr("O que queres?", "What do you want?") +
                        "\n" +
                        "1 = " +
                        tr("Função exponencial", "Exponential function") +
                        "\n" +
                        "2 = " +
                        tr("Função logarítmica", "Logarithmic function") +
                        "\n" +
                        "----------------\n" +
                        "6 = " +
                        tr("Antigas", "History") +
                        " | 7 = " +
                        tr("Configurações", "Settings") +
                        " | 8 = " +
                        tr("Rever", "Review") +
                        " | 9 = " +
                        tr("Alterar", "Change") +
                        " | 0 = " +
                        tr("Voltar", "Back"),
                    "",
                    true,
                    0,
                    true
                )

                subLoop = false

                if (
                    (typeof subType === "number" && 0 <= subType && subType <= 2) ||
                    (typeof subType === "number" && 6 <= subType && subType <= 9) ||
                    (typeof subType === "string" && Commands.names().includes(subType))
                ) {
                    // Exponencial
                    if (subType == 1) {
                        // Incógnitas
                        if (
                            typeof State.globalA === "string" ||
                            typeof State.globalB === "string" ||
                            typeof State.globalC === "string"
                        ) {
                            State.coefficients = Algebra.unknown(State.globalA, State.globalB, State.globalC, true)
                            State.globalA = Algebra.round(State.coefficients[0])
                            State.globalB = Algebra.round(State.coefficients[1])
                            State.globalC = Algebra.round(State.coefficients[2])
                        }

                        // Números
                        if (
                            typeof State.globalA === "number" &&
                            typeof State.globalB === "number" &&
                            typeof State.globalC === "number"
                        ) {
                            if (
                                Checks.isNumeric(State.globalA) &&
                                Checks.isNumeric(State.globalB) &&
                                State.globalA > 0 &&
                                State.globalA != 1 &&
                                State.globalB != 0
                            ) {
                                Analyze.exponential(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunction(tr("exponencial", "exponential"))

                                if (
                                    State.globalA == 1 &&
                                    Checks.isNumeric(State.globalB) &&
                                    Checks.isNumeric(State.globalC)
                                ) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Error de base
                            else if (Checks.isNumeric(State.globalA) && State.globalA < 0) {
                                Error.invalidFunction(tr("exponencial", "exponential"))

                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Logarítmica
                    else if (subType == 2) {
                        // Incógnitas
                        if (typeof State.globalA === "string" || State.globalB == "b" || State.globalC == "c") {
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
                        if (
                            typeof State.globalA === "number" &&
                            typeof State.globalB == "number" &&
                            typeof State.globalC == "number"
                        ) {
                            if (
                                Checks.isNumeric(State.globalA) &&
                                Checks.isNumeric(State.globalB) &&
                                State.globalA > 0 &&
                                State.globalA != 1 &&
                                State.globalB != 0
                            ) {
                                Analyze.logarithmic(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Error.constantFunction(tr("logarítmica", "logarithmic"))
                                if (
                                    State.globalA == 1 &&
                                    Checks.isNumeric(State.globalB) &&
                                    Checks.isNumeric(State.globalC)
                                ) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Error de base
                            else if (Checks.isNumeric(State.globalA) && State.globalA < 0) {
                                Error.invalidFunction(tr("logarítmica", "logarithmic"))
                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if (typeof subType === "number" && 6 <= subType && subType <= 9) {
                        State.type = subType
                        State.loop = true
                        State.keepType = true
                    } else if (Checks.isCommand(subType)) {
                        State.type = subType
                        State.loop = true
                        if (subType != "exit") {
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
                    "=== Menu ===\n" +
                        tr("O que queres?", "What do you want?") +
                        "\n" +
                        "1 = " +
                        tr("Função seno", "Sine function") +
                        "\n" +
                        "2 = " +
                        tr("Função cosseno", "Cosine function") +
                        "\n" +
                        "3 = " +
                        tr("Função tangente", "Tangent function") +
                        "\n" +
                        "----------------\n" +
                        "6 = " +
                        tr("Antigas", "History") +
                        " | 7 = " +
                        tr("Configurações", "Settings") +
                        " | 8 = " +
                        tr("Rever", "Review") +
                        " | 9 = " +
                        tr("Alterar", "Change") +
                        " | 0 = " +
                        tr("Voltar", "Back"),
                    "",
                    true,
                    0,
                    true
                )

                subLoop = false

                if (
                    (typeof subType === "number" && 0 <= subType && subType <= 3) ||
                    (typeof subType === "number" && 6 <= subType && subType <= 9) ||
                    (typeof subType === "string" && Commands.names().includes(subType))
                ) {
                    // Seno
                    if (subType == 1) {
                        // Incógnitas
                        if (
                            typeof State.globalA === "string" ||
                            typeof State.globalB === "string" ||
                            typeof State.globalC === "string"
                        ) {
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
                        if (
                            typeof State.globalA === "number" &&
                            typeof State.globalB == "number" &&
                            typeof State.globalC == "number"
                        ) {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.sine(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Error.constantFunction(tr("seno", "sine"))

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
                        if (
                            typeof State.globalA === "string" ||
                            typeof State.globalB === "string" ||
                            typeof State.globalC === "string"
                        ) {
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
                        if (
                            typeof State.globalA === "number" &&
                            typeof State.globalB === "number" &&
                            typeof State.globalC === "number"
                        ) {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.cosine(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Error.constantFunction(tr("cosseno", "cosine"))

                                if (
                                    State.globalA == 0 &&
                                    Checks.isNumeric(State.globalC) &&
                                    Checks.isNumeric(State.globalB)
                                ) {
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
                        if (
                            typeof State.globalA === "string" ||
                            typeof State.globalB === "string" ||
                            typeof State.globalC === "string"
                        ) {
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
                        if (
                            typeof State.globalA === "number" &&
                            typeof State.globalB == "number" &&
                            typeof State.globalC == "number"
                        ) {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.tangent(State.globalA, State.globalB, State.globalC)
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Error.constantFunction(tr("tangente", "tangent"))

                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if (typeof subType === "number" && 6 <= subType && subType <= 9) {
                        State.type = subType
                        State.loop = true
                        State.keepType = true
                    } else if (Checks.isCommand(subType)) {
                        State.type = subType
                        State.loop = true
                        if (subType != "exit") {
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
        else if (State.type == 6 || State.type == "history") {
            State.loop = true

            // Error de histórico
            if (State.history.length <= 1) {
                Ui.display(
                    tr("Não há histórico o suficiente para mudanças.", "There is no history yet for changes."),
                    tr(
                        "Escrevestes apenas uma função até agora. Use “alterar” para escrever outra função.",
                        "You have written only one function so far. Use “changes” to write another function."
                    )
                )
            } else {
                let message =
                        "=== " +
                        tr("Histórico", "History") +
                        " ===\n" +
                        tr("O que queres?", "What do you want?") +
                        "\n",
                    answer = 0,
                    option = 1

                // Mostra histórico
                for (let func = State.history.length - 1; func >= 0; func--) {
                    const stored = State.history[func]
                    message +=
                        String(option) +
                        " ⇒ “a” = " +
                        Writing.decimal(stored[0]) +
                        "; “b” = " +
                        Writing.decimal(stored[1]) +
                        "; “c” = " +
                        Writing.decimal(stored[2]) +
                        "\n"
                    option++
                }

                // Escolha
                answer = Ui.range(message, "", 0, State.history.length - 1)

                if (answer != 0) {
                    // Restaura função
                    let index = State.history.length - answer
                    const stored = State.history[index]

                    State.globalA = stored[0]
                    State.globalB = stored[1]
                    State.globalC = stored[2]
                    if (
                        State.globalA != State.currentFunc[0] ||
                        State.globalB != State.currentFunc[1] ||
                        State.globalC != State.currentFunc[2]
                    ) {
                        State.currentFunc = [State.globalA, State.globalB, State.globalC]
                    }
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
                    Writing.configItem(tr("Caracteres Unicode", "Unicode characters"), "unicode"),
                    Writing.configItem(tr("Explicações", "Explanations"), "explanations"),
                    Writing.configItem(tr("Acentos", "Accents"), "accents"),
                    Writing.configItem(tr("Capitalizadas", "Capitalized"), "capitalized"),
                    Writing.configItem(tr("Maiúsculas", "Uppercase"), "uppercase"),
                    Writing.configItem(tr("Minúsculas", "Lowercase"), "lowercase"),

                    Writing.configItem(tr("Ponto decimal", "Decimal separator"), "decimalSeparator"),
                    Writing.configItem(tr("Multiplicação simples", "Simple multiplication"), "simpleMulti"),
                    Writing.configItem(tr("Confirmações de entrada", "Input confirmations"), "inputConfirm"),
                    Writing.configItem(tr("Confirmações de saída", "Output confirmations"), "outputConfirm"),
                    Writing.configItem(tr("Mensagens de erro", "Error messages"), "errors"),
                    Writing.configItem(tr("Mostrar função", "Show function"), "showFunction"),

                    Writing.configItem(tr("Casas decimais", "Decimal places"), "decimalPlaces"),
                    Writing.configItem(tr("Precisão do log", "Log precision"), "logPrecision"),
                    Writing.configItem(tr("Precisão da divisão", "Division precision"), "divPrecision"),
                    Writing.configItem(tr("Limite de interações", "Interaction limit"), "interactionLimit"),
                    Writing.configItem(tr("Linguagem", "Language"), "language"),
                    Writing.configItem(tr("Graus", "Degrees"), "degrees"),
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
                    "=== " +
                    tr("Configurações", "Settings") +
                    " ===\n" +
                    tr("Página ", "Page ") +
                    String(page) +
                    "/" +
                    String(total) +
                    "\n" +
                    tr("Obs.: Configurações não são salvas ao fechar", "Note: Settings are not saved when closing")
                while (option <= 6) {
                    text += "\n" + String(option) + " = " + String(configOptions[option - 1 + 6 * (page - 1)])
                    option++
                }
                option = 1
                text +=
                    "\n----------------\n" +
                    "7 = " +
                    tr("Restaurar padrão", "Restore default") +
                    " | 8 = " +
                    tr("Anterior", "Previous") +
                    " | 9 = " +
                    tr("Próxima", "Next") +
                    " | 0 = " +
                    tr("Voltar", "Back")

                // Escolha
                choice = Ui.range(text, "", 0, 9, 0, true)
                if (choice == 7) {
                    // Padrão
                    if (JSON.stringify(Config) == JSON.stringify(DEFAULT_CONFIG)) {
                        Ui.warning(
                            tr(
                                "Todas as configurações já estão na forma padrão.",
                                "All settings are already at their default values."
                            ),
                            tr("Não há necessidade de restaurar.", "There is no need to restore.")
                        )
                    } else {
                        let message = tr(
                                "Voltar às configurações padrão?\nConfigurações afetadas:\n",
                                "Do you want to restore the default settings?\nAffected settings:\n"
                            ),
                            keys = Object.keys(Config)

                        // Mostra configurações afetadas
                        keys.forEach(key => {
                            message += Config[key] != DEFAULT_CONFIG[key] ? key + ", " : ""
                        })

                        // Remove última vírgula e espaço
                        message = message.slice(0, -2)

                        // Confirmação
                        if (
                            Ui.warning(
                                message,
                                tr(
                                    "Obs.₁: Isso irá afetar todas as configurações acima\nObs.₂: Essa alteração é permanente",
                                    "Note₁: This will affect all the settings above\nNote₂: This change is permanent"
                                ),
                                true
                            )
                        ) {
                            resetConfig()
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
                } else if (choice == "exit") {
                    choice = 0
                    State.type = "exit"
                }

                // Página 1
                if (page == 1) {
                    // Unicode
                    if (choice == 1) {
                        Config.unicode = Ui.confirm(
                            Writing.configItem(
                                tr("Ativar caracteres Unicode?", "Enable Unicode characters?"),
                                "unicode"
                            ),
                            tr(
                                "Obs.₁: Caracteres Unicode são os símbolos especiais, tais como: “ℝ”, “∀”, etc. Desativar fará com que eles sejam transformados em uma palavra correspondente, tais como: “Reais”, “para todo”, etc.\nObs.₂: Nem todos os caracteres Unicode serão desativados\nObs.₃: Essa configuração pode mudar algumas explicações",
                                "Note₁: Unicode characters are special symbols, such as: “ℝ”, “∀”, etc. Disabling will replace them with a corresponding word, such as: “Reals”, “for all”, etc.\nNote₂: Not all Unicode characters will be disabled\nNote₃: This setting may change some explanations"
                            )
                        )
                    }

                    // Explicações
                    else if (choice == 2) {
                        Config.explanations = Ui.confirm(
                            Writing.configItem(tr("Ativar explicações?", "Enable explanations?"), "explanations"),
                            tr(
                                "Obs.₁: Ativar fará com que certas mensagens sejam diferentes e tenham explicações, por exemplo: o cálculo do Delta, Δ = b² - 4 · a · c, sem ser só o resultado dele\nObs.₂: Nem todas as mensagens têm versão explicada\nObs.₃: Desativar o Unicode fará com que seja mostrado: Delta = b^2 - 4 * a * c",
                                "Note₁: Enabling will make certain messages different and include explanations, e.g.: the Delta calculation, Δ = b² - 4 · a · c, not just the result\nNote₂: Not all messages have an explained version\nNote₃: Disabling Unicode will show: Delta = b^2 - 4 * a * c"
                            )
                        )
                    }

                    // Acentos
                    else if (choice == 3) {
                        Config.accents = Ui.confirm(
                            Writing.configItem(tr("Ativar acentos?", "Enable accents?"), "accents"),
                            tr(
                                "Obs.: Essa configuração irá tirar todos os acentos gráficos das palavras, podendo haver má interpretação",
                                "Note: This setting will remove all accents from words, which may cause misinterpretation"
                            )
                        )
                    }

                    // Capitalizadas
                    else if (choice == 4) {
                        Config.capitalized = Ui.confirm(
                            Writing.configItem(
                                tr("Ativar letras capitalizadas?", "Enable capitalized letters?"),
                                "capitalized"
                            ),
                            tr(
                                "Obs.₁: Essa configuração irá transformar as palavras em “normais”, no caso, a primeira letra da frase em maiúscula e as outras todas em minúsculas\nObs.₂: Essa configuração irá desativar “maiúsculas” e “minúsculas”",
                                "Note₁: This setting will make text “normal”, i.e., the first letter of each sentence capitalized and the rest lowercase\nNote₂: This setting will disable “uppercase” and “lowercase”"
                            )
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
                            Writing.configItem(
                                tr("Ativar todas as letras maiúsculas?", "Enable all uppercase letters?"),
                                "uppercase"
                            ),
                            tr(
                                "Obs.₁: Essa configuração irá transformar todas as letras em maiúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “minúsculas”",
                                "Note₁: This setting will transform all letters to uppercase\nNote₂: This setting will disable “capitalized” and “lowercase”"
                            )
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
                            Writing.configItem(
                                tr("Ativar todas as letras minúsculas?", "Enable all lowercase letters?"),
                                "lowercase"
                            ),
                            tr(
                                "Obs.₁: Essa configuração irá transformar todas as letras em minúsculas\nObs.₂: Essa configuração irá desativar “capitalizadas” e “maiúsculas”",
                                "Note₁: This setting will transform all letters to lowercase\nNote₂: This setting will disable “capitalized” and “uppercase”"
                            )
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
                            Writing.configItem(
                                tr("Alterar ponto decimal?", "Change decimal separator?"),
                                "decimalSeparator"
                            ),
                            tr(
                                "Obs.₁: Essa configuração irá transformar os números com “.” em números com “,”, por exemplo: ",
                                "Note₁: This setting will transform numbers with “.” into numbers with “,”, e.g.: "
                            ) +
                                Writing.decimal(123.456) +
                                tr(
                                    "\nObs.₂: Isso é apenas estético e não irá afetar as contas\nObs.₃: Tu também poderás escrever os números com “,” em vez de “.”",
                                    "\nNote₂: This is only aesthetic and will not affect calculations\nNote₃: You will also be able to type numbers with “,” instead of “.”"
                                )
                        )
                    }

                    // Multiplicação simples
                    else if (choice == 2) {
                        Config.simpleMulti = Ui.confirm(
                            Writing.configItem(
                                tr("Alterar para multiplicação simples?", "Enable simple multiplication?"),
                                "simpleMulti"
                            ),
                            tr(
                                "Obs.₁: Isso irá alterar esteticamente as contas polinomiais de: “a · x² + b · x + c” para: “ax² + bx + c”\nObs.₂: Desativar o Unicode irá transformar o “·” em *\nObs.₃: Isso não irá afetar o “×”, porém o Unicode irá transformá-lo em *",
                                "Note₁: This will aesthetically change polynomial expressions from: “a · x² + b · x + c” to: “ax² + bx + c”\nNote₂: Disabling Unicode will transform “·” into *\nNote₃: This will not affect “×”, but Unicode will transform it into *"
                            )
                        )
                    }

                    // Confirmações de entrada
                    else if (choice == 3) {
                        Config.inputConfirm = Ui.confirm(
                            Writing.configItem(
                                tr("Ativar confirmações de entrada?", "Enable input confirmations?"),
                                "inputConfirm"
                            ),
                            tr(
                                "Obs.: Toda e qualquer coisa digitada passará a ter que ser confirmada",
                                "Note: Everything typed will need to be confirmed"
                            )
                        )
                    }

                    // Confirmações de saída
                    else if (choice == 4) {
                        Config.outputConfirm = Ui.confirm(
                            Writing.configItem(
                                tr("Ativar confirmações de saída?", "Enable exit confirmations?"),
                                "outputConfirm"
                            ),
                            tr(
                                "Obs.: Isso irá ativar uma mensagem antes de sair / fechar o programa",
                                "Note: This will show a confirmation message before exiting / closing the program"
                            )
                        )
                    }

                    // Errors
                    else if (choice == 5) {
                        Config.errors = Ui.confirm(
                            Writing.configItem(tr("Ativar mensagens de erro?", "Enable error messages?"), "errors"),
                            tr(
                                "Obs.: Desativar pode fazer com que tu não percebas algum erro que estás cometendo",
                                "Note: Disabling may cause you not to notice errors you are making"
                            )
                        )
                    }

                    // Função
                    else if (choice == 6) {
                        Config.showFunction = Ui.confirm(
                            Writing.configItem(
                                tr("Ativar exibição da função?", "Enable function display?"),
                                "showFunction"
                            ),
                            tr(
                                "Obs.₁: “Mostrar função” significa que será mostrada a função (por exemplo: ax² + bx + c) no começo dos menus, antes das opções\nObs.₂: A função ainda continuará sendo mostrada quando for escolhida a opção “6” (Rever / Mostrar função)",
                                "Note₁: “Show function” means the function (e.g.: ax² + bx + c) will be shown at the start of menus, before the options\nNote₂: The function will still be shown when option “6” (Review / Show function) is selected"
                            )
                        )
                    }
                }

                // Página 3
                else if (page == 3) {
                    // Casas decimais
                    if (choice == 1) {
                        Config.decimalPlaces = Ui.range(
                            Writing.configItem(
                                tr("Quantas casas decimais?", "How many decimal places?"),
                                "decimalPlaces"
                            ),
                            tr(
                                "Obs.₁: Um número muito pequeno de casas decimais pode fazer as contas ficarem erradas\nObs.₂: Os números já digitados serão arredondados para o novo número de casas decimais",
                                "Note₁: Too few decimal places may cause calculation errors\nNote₂: Already entered numbers will be rounded to the new number of decimal places"
                            ),
                            3,
                            10
                        )

                        // Arredonda novamente
                        if (typeof State.globalA === "number") {
                            State.globalA = Algebra.round(State.globalA)
                        }
                        if (typeof State.globalB === "number") {
                            State.globalB = Algebra.round(State.globalB)
                        }
                        if (typeof State.globalC === "number") {
                            State.globalC = Algebra.round(State.globalC)
                        }
                    }

                    // Precisão do log
                    else if (choice == 2) {
                        Config.logPrecision = Ui.range(
                            Writing.configItem(
                                tr("Qual a precisão do log?", "What is the log precision?"),
                                "logPrecision"
                            ),
                            tr(
                                "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo logs\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                                "Note₁: This may affect very small calculations involving logarithms\nNote₂: You will have to literally type “1e-12”"
                            ),
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Precisão da divisão
                    else if (choice == 3) {
                        Config.divPrecision = Ui.range(
                            Writing.configItem(
                                tr("Qual a precisão da divisão?", "What is the division precision?"),
                                "divPrecision"
                            ),
                            tr(
                                "Obs.₁: Isso poderá afetar contas muito pequenas envolvendo divisões\nObs.₂: Tu terás que escrever literalmente “1e-12”",
                                "Note₁: This may affect very small calculations involving divisions\nNote₂: You will have to literally type “1e-12”"
                            ),
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Limite de interações
                    else if (choice == 4) {
                        Config.interactionLimit = Ui.range(
                            Writing.configItem(
                                tr("Qual o limite de interações?", "What is the iteration limit?"),
                                "interactionLimit"
                            ),
                            tr(
                                "Obs.₁: Isso irá afetar todos os loops, tais como logs, menus, etc.\nObs.₂: Essa configuração é útil para evitar loops infinitos no código, caso algo dê errado",
                                "Note₁: This will affect all loops, such as logarithms, menus, etc.\nNote₂: This setting is useful to avoid infinite loops in the code, in case something goes wrong"
                            ),
                            100,
                            10000
                        )
                    }

                    // Linguagem
                    else if (choice == 5) {
                        let question = Ui.range(
                                Writing.configItem(tr("Qual língua?", "Which language?"), "language") +
                                    "\n1 = " +
                                    tr("Português Brasileiro", "Brazilian Portuguese") +
                                    "\n2 = " +
                                    tr("Inglês", "English"),
                                tr(
                                    "Obs.: Isso irá alterar a língua do sistema inteiro.",
                                    "Note: This will change the entire system language."
                                ),
                                1,
                                2,
                                0
                            ),
                            language = question == 1 ? "pt" : "en"
                        if (language != Config.language) {
                            changeLanguage(language)

                            // Para alterar o HTML também, conforme a língua
                            document.title =
                                Config.language == "en"
                                    ? "Mathematical Function Analyzer"
                                    : "Analisador de Funções Matemáticas"
                            let h1 = document.querySelector("h1")
                            if (h1) {
                                h1.textContent = tr("Matemática", "Mathematics")
                            } else {
                                Ui.error("[main] Elemento 'h1' não encontrado no DOM.", "", true)
                            }
                            document.documentElement.lang = Config.language
                        }
                    }

                    // Graus
                    else if (choice == 6) {
                        const useDegrees = Ui.confirm(
                            Writing.configItem(
                                tr("Usar graus em vez de radianos?", "Use degrees instead of radians?"),
                                "degrees"
                            ),
                            tr(
                                "Obs.₁: Isso irá afetar as funções trigonométricas, tais como seno, cosseno e tangente\nObs.₂: Ativar isso irá fazer com que os ângulos sejam interpretados como graus, e não π radianos",
                                "Note₁: This will affect trigonometric functions, such as sine, cosine and tangent\nNote₂: Enabling this will make angles be interpreted as degrees, not π radians"
                            )
                        )
                        Config.degrees = useDegrees ? "deg" : "rad"
                    }
                }

                // Salvar as configurações
                if (Checks.isNumeric(choice) && 1 <= choice && choice <= 6) {
                    saveConfig()
                }
            } while (choice != 0)
        }

        // Rever
        else if (State.type == 8 || State.type == "review") {
            Ui.display(
                tr("Valores: ", "Values: ") +
                    "\n“a” = " +
                    Writing.decimal(State.globalA) +
                    "\n“b” = " +
                    Writing.decimal(State.globalB) +
                    "\n“c” = " +
                    Writing.decimal(State.globalC)
            )
            State.loop = true
        }

        // Mudar
        else if (State.type == 9 || State.type == "change") {
            State.loop = true
            State.askCoeffs = true
        }

        // Sair
        else if (State.type == 0 || State.type == "exit") {
            if (Config.outputConfirm) {
                State.loop = !Ui.confirm(
                    tr("Tu queres sair?", "Do you want to exit?"),
                    tr(
                        "Obs.: As configurações poderão ser redefinidas ao sair.",
                        "Note: Settings may be reset upon exit."
                    )
                )
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
