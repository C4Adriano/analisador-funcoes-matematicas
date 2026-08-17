import { Algebra } from "./algebra.js"
import { Analyze } from "./analyze.js"
import { Checks } from "./checks.js"
import { Commands } from "./commands.js"
import { Config, DEFAULT_CONFIG, loadConfig, resetConfig, saveConfig } from "./config.js"
import { Errors } from "./errors.js"
import { changeLanguage, tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { VERSION } from "./version.js"
import { Writing } from "./writing.js"

Ui.display(
    "====================================================" +
        "\n" +
        tr("commands.title") +
        " — " +
        VERSION +
        "\n" +
        tr("commands.copyright") +
        " © Adriano Lima 2025 — 2026" +
        "\n" +
        "====================================================",
    "",
    true
)

// Carregar as configurações
loadConfig()

// Introdução
Ui.display(tr("main.welcomeTitle"), tr("main.welcomeDescription"))

// === OBJETOS GLOBAIS ===
// Para alterar o HTML também, conforme a língua
function setMeta(name = "", content = "") {
    const meta = document.querySelector(`meta[name="${name}"]`)
    if (meta) {
        meta.setAttribute("content", content)
    }
}

function setProperty(property = "", content = "") {
    const meta = document.querySelector(`meta[property="${property}"]`)
    if (meta) {
        meta.setAttribute("content", content)
    }
}

const title = tr("commands.title")

const description = tr("main.documentDescription")

const locales = {
    "pt-br": "pt_BR",
    "pt-pt": "pt_PT",
    "en-us": "en_US",
    "en-gb": "en_GB",
    "es-419": "es_419",
    "es-es": "es_ES",
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
        State.globalA != State.currentFunc.a ||
        State.globalB != State.currentFunc.b ||
        State.globalC != State.currentFunc.c
    ) {
        State.currentFunc = { a: State.globalA, b: State.globalB, c: State.globalC }
        State.history.push(State.currentFunc)

        if (State.history.length > 9) {
            State.history.shift()
        }
    }

    // Tipo de função
    if (!State.keepType || State.type == "start") {
        State.type = Ui.input(
            "=== " +
                tr("main.start") +
                " ===\n" +
                tr("main.whatWant") +
                "\n" +
                "1 = " +
                tr("main.polynomialFunctions") +
                "\n" +
                "2 = " +
                tr("main.nonPolynomialFunctions") +
                "\n" +
                "3 = " +
                tr("main.trigonometricFunctions") +
                "\n" +
                "----------------\n" +
                "6 = " +
                tr("main.history") +
                " | 7 = " +
                tr("main.settings") +
                " | 8 = " +
                tr("main.review") +
                " | 9 = " +
                tr("main.change") +
                " | 0 = " +
                tr("main.exit"),
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
        Commands.names.includes(State.type)
    ) {
        // Polinomiais
        if (State.type == 1) {
            // Incógnitas
            if (
                !Checks.isFiniteNumber(State.globalA) ||
                !Checks.isFiniteNumber(State.globalB) ||
                !Checks.isFiniteNumber(State.globalC)
            ) {
                State.coefficients = Algebra.resolveUnknown({ a: State.globalA, b: State.globalB, c: State.globalC })
                State.globalA = Algebra.round(State.coefficients.a)
                State.globalB = Algebra.round(State.coefficients.b)
                State.globalC = Algebra.round(State.coefficients.c)
            }

            // Números
            if (
                Checks.isFiniteNumber(State.globalA) &&
                Checks.isFiniteNumber(State.globalB) &&
                Checks.isFiniteNumber(State.globalC)
            ) {
                if (State.globalA == 0 && State.globalB == 0) {
                    Analyze.resolveConstant({ c: State.globalC })
                } else if (State.globalA == 0 && State.globalB != 0) {
                    Analyze.resolveAffine({ b: State.globalB, c: State.globalC })
                } else if (State.globalA != 0) {
                    Analyze.resolveQuadratic({ a: State.globalA, b: State.globalB, c: State.globalC })
                }
            }
        }

        // Não polinomial
        else if (State.type == 2) {
            // Loop do menu
            do {
                subType = Ui.input(
                    "=== Menu ===\n" +
                        tr("main.whatWant") +
                        "\n" +
                        "1 = " +
                        tr("main.exponentialFunction") +
                        "\n" +
                        "2 = " +
                        tr("main.logarithmicFunction") +
                        "\n" +
                        "----------------\n" +
                        "6 = " +
                        tr("main.history") +
                        " | 7 = " +
                        tr("main.settings") +
                        " | 8 = " +
                        tr("main.review") +
                        " | 9 = " +
                        tr("main.change") +
                        " | 0 = " +
                        tr("commands.back"),
                    "",
                    true,
                    0,
                    true
                )

                subLoop = false

                if (
                    (0 <= subType && subType <= 2) ||
                    (6 <= subType && subType <= 9) ||
                    Commands.names.includes(subType)
                ) {
                    // Exponencial
                    if (subType == 1) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.resolveUnknown(
                                {
                                    a: State.globalA,
                                    b: State.globalB,
                                    c: State.globalC,
                                },
                                "exp"
                            )
                            State.globalA = Algebra.round(State.coefficients.a)
                            State.globalB = Algebra.round(State.coefficients.b)
                            State.globalC = Algebra.round(State.coefficients.c)
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (
                                Checks.isFiniteNumber(State.globalA) &&
                                Checks.isFiniteNumber(State.globalB) &&
                                State.globalA > 0 &&
                                State.globalA != 1 &&
                                State.globalB != 0
                            ) {
                                Analyze.resolveExponential({ a: State.globalA, b: State.globalB, c: State.globalC })
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Errors.constantFunction(tr("main.exponential"))

                                if (
                                    State.globalA == 1 &&
                                    Checks.isFiniteNumber(State.globalB) &&
                                    Checks.isFiniteNumber(State.globalC)
                                ) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Erro de base
                            else if (Checks.isFiniteNumber(State.globalA) && State.globalA < 0) {
                                Errors.invalidFunction(tr("main.exponential"))

                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Logarítmica
                    else if (subType == 2) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.resolveUnknown(
                                {
                                    a: State.globalA,
                                    b: State.globalB,
                                    c: State.globalC,
                                },
                                "log"
                            )
                            State.globalA = Algebra.round(State.coefficients.a)
                            State.globalB = Algebra.round(State.coefficients.b)
                            State.globalC = Algebra.round(State.coefficients.c)
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (
                                Checks.isFiniteNumber(State.globalA) &&
                                Checks.isFiniteNumber(State.globalB) &&
                                State.globalA > 0 &&
                                State.globalA != 1 &&
                                State.globalB != 0
                            ) {
                                Analyze.resolveLogarithmic({ a: State.globalA, b: State.globalB, c: State.globalC })
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalA == 1 || State.globalB == 0) {
                                Errors.constantFunction(tr("main.logarithmic"))
                                if (
                                    State.globalA == 1 &&
                                    Checks.isFiniteNumber(State.globalB) &&
                                    Checks.isFiniteNumber(State.globalC)
                                ) {
                                    State.globalC += State.globalB
                                }
                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }

                            // Erro de base
                            else if (Checks.isFiniteNumber(State.globalA) && State.globalA < 0) {
                                Errors.invalidFunction(tr("main.logarithmic"))
                                State.askCoeffs = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if (6 <= subType && subType <= 9) {
                        State.type = subType
                        State.loop = true
                        State.keepType = true
                    } else if (Commands.names.includes(subType)) {
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

                // Erro
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
                        tr("main.whatWant") +
                        "\n" +
                        "1 = " +
                        tr("main.sineFunction") +
                        "\n" +
                        "2 = " +
                        tr("main.cosineFunction") +
                        "\n" +
                        "3 = " +
                        tr("main.tangentFunction") +
                        "\n" +
                        "----------------\n" +
                        "6 = " +
                        tr("main.history") +
                        " | 7 = " +
                        tr("main.settings") +
                        " | 8 = " +
                        tr("main.review") +
                        " | 9 = " +
                        tr("main.change") +
                        " | 0 = " +
                        tr("commands.back"),
                    "",
                    true,
                    0,
                    true
                )

                subLoop = false

                if (
                    (0 <= subType && subType <= 3) ||
                    (6 <= subType && subType <= 9) ||
                    Commands.names.includes(subType)
                ) {
                    // Seno
                    if (subType == 1) {
                        // Incógnitas
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.resolveUnknown(
                                {
                                    a: State.globalA,
                                    b: State.globalB,
                                    c: State.globalC,
                                },
                                "sin"
                            )
                            State.globalA = Algebra.round(State.coefficients.a)
                            State.globalB = Algebra.round(State.coefficients.b)
                            State.globalC = Algebra.round(State.coefficients.c)
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.resolveSine({ a: State.globalA, b: State.globalB, c: State.globalC })
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Errors.constantFunction(tr("main.sine"))

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
                            State.coefficients = Algebra.resolveUnknown(
                                {
                                    a: State.globalA,
                                    b: State.globalB,
                                    c: State.globalC,
                                },
                                "cos"
                            )
                            State.globalA = Algebra.round(State.coefficients.a)
                            State.globalB = Algebra.round(State.coefficients.b)
                            State.globalC = Algebra.round(State.coefficients.c)
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.resolveCosine({ a: State.globalA, b: State.globalB, c: State.globalC })
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Errors.constantFunction(tr("main.cosine"))

                                if (
                                    State.globalA == 0 &&
                                    Checks.isFiniteNumber(State.globalC) &&
                                    Checks.isFiniteNumber(State.globalB)
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
                        if (State.globalA == "a" || State.globalB == "b" || State.globalC == "c") {
                            State.coefficients = Algebra.resolveUnknown(
                                {
                                    a: State.globalA,
                                    b: State.globalB,
                                    c: State.globalC,
                                },
                                "tan"
                            )
                            State.globalA = Algebra.round(State.coefficients.a)
                            State.globalB = Algebra.round(State.coefficients.b)
                            State.globalC = Algebra.round(State.coefficients.c)
                        }

                        // Números
                        if (State.globalA != "a" && State.globalB != "b" && State.globalC != "c") {
                            if (State.globalA != 0 && State.globalB != 0) {
                                Analyze.resolveTangent({ a: State.globalA, b: State.globalB, c: State.globalC })
                            }

                            // Constante
                            else if (State.globalA == 0 || State.globalB == 0) {
                                Errors.constantFunction(tr("main.tangent"))

                                State.globalA = 0
                                State.globalB = 0
                                State.type = 1
                                State.keepType = true
                                State.loop = true
                            }
                        }
                    }

                    // Manter
                    else if (6 <= subType && subType <= 9) {
                        State.type = subType
                        State.loop = true
                        State.keepType = true
                    } else if (Commands.names.includes(subType)) {
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

                // Erro
                else {
                    subLoop = true
                }
            } while (subLoop)
        }

        // Histórico
        else if (State.type == 6 || State.type == "history") {
            State.loop = true

            // Erro de histórico
            if (State.history.length <= 1) {
                Ui.display(tr("main.noHistory"), tr("main.noHistoryExp"))
            } else {
                let message = "=== " + tr("main.history") + " ===\n" + tr("main.whatWant") + "\n",
                    answer = 0,
                    option = 1

                // Mostra histórico
                for (let func = State.history.length - 1; func >= 0; func--) {
                    const stored = State.history[func]
                    message +=
                        String(option) +
                        " ⇒ “a” = " +
                        Writing.decimal(stored.a) +
                        "; “b” = " +
                        Writing.decimal(stored.b) +
                        "; “c” = " +
                        Writing.decimal(stored.c) +
                        "\n"
                    option++
                }

                // Escolha
                answer = Ui.range(message, "", 0, State.history.length)

                if (answer != 0) {
                    // Restaura função
                    const stored = State.history.at(State.history.length - answer)

                    State.globalA = stored.a
                    State.globalB = stored.b
                    State.globalC = stored.c
                    if (
                        State.globalA != State.currentFunc.a ||
                        State.globalB != State.currentFunc.b ||
                        State.globalC != State.currentFunc.c
                    ) {
                        State.currentFunc = { a: State.globalA, b: State.globalB, c: State.globalC }
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
                    Writing.configItem(tr("main.unicode"), "unicode"),
                    Writing.configItem(tr("main.explanations"), "explanations"),
                    Writing.configItem(tr("main.accents"), "accents"),
                    Writing.configItem(tr("main.capitalized"), "capitalized"),
                    Writing.configItem(tr("main.uppercase"), "uppercase"),
                    Writing.configItem(tr("main.lowercase"), "lowercase"),

                    Writing.configItem(tr("main.decimalSeparator"), "decimalSeparator"),
                    Writing.configItem(tr("main.simpleMulti"), "simpleMulti"),
                    Writing.configItem(tr("main.inputConfirm"), "inputConfirm"),
                    Writing.configItem(tr("main.outputConfirm"), "outputConfirm"),
                    Writing.configItem(tr("main.errors"), "errors"),
                    Writing.configItem(tr("main.showFunction"), "showFunction"),

                    Writing.configItem(tr("main.decimalPlaces"), "decimalPlaces"),
                    Writing.configItem(tr("main.logPrecision"), "logPrecision"),
                    Writing.configItem(tr("main.divisionPrecision"), "divPrecision"),
                    Writing.configItem(tr("main.iterationLimit"), "iterationLimit"),
                    Writing.configItem(tr("main.language"), "language"),
                    Writing.configItem(tr("main.degrees"), "degrees"),
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
                    tr("main.settings") +
                    " ===\n" +
                    tr("commands.page") +
                    String(page) +
                    "/" +
                    String(total) +
                    "\n" +
                    tr("main.settingsNote")
                while (option <= 6) {
                    text += "\n" + String(option) + " = " + String(configOptions[option - 1 + 6 * (page - 1)])
                    option++
                }
                option = 1
                text +=
                    "\n----------------\n" +
                    "7 = " +
                    tr("main.restoreDefault") +
                    " | 8 = " +
                    tr("commands.previous") +
                    " | 9 = " +
                    tr("commands.next") +
                    " | 0 = " +
                    tr("commands.back")

                // Escolha
                choice = Ui.range(text, "", 0, 9, 0, true)
                if (choice == 7) {
                    // Padrão
                    if (JSON.stringify(Config) == JSON.stringify(DEFAULT_CONFIG)) {
                        Ui.warning(tr("main.allSettingsDefault"), tr("main.allSettingsDefaultExp"))
                    } else {
                        let message = tr("main.wantRestoreDefault"),
                            keys = Object.keys(Config)

                        // Mostra configurações afetadas
                        keys.forEach(key => {
                            message += Config[key] != DEFAULT_CONFIG[key] ? key + ", " : ""
                        })

                        // Remove última vírgula e espaço
                        message = message.slice(0, -2)

                        // Confirmação
                        if (Ui.warning(message, tr("main.noteRestoreDefault"), true)) {
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
                            Writing.configItem(tr("main.enableUnicode"), "unicode"),
                            tr("main.noteUnicode")
                        )
                    }

                    // Explicações
                    else if (choice == 2) {
                        Config.explanations = Ui.confirm(
                            Writing.configItem(tr("main.enableExplanations"), "explanations"),
                            tr("main.noteExplanations")
                        )
                    }

                    // Acentos
                    else if (choice == 3) {
                        Config.accents = Ui.confirm(
                            Writing.configItem(tr("main.enableAccents"), "accents"),
                            tr("main.noteAccents")
                        )
                    }

                    // Capitalizadas
                    else if (choice == 4) {
                        Config.capitalized = Ui.confirm(
                            Writing.configItem(tr("main.enableCapitalized"), "capitalized"),
                            tr("main.noteCapitalized")
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
                            Writing.configItem(tr("main.enableUppercase"), "uppercase"),
                            tr("main.noteUppercase")
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
                            Writing.configItem(tr("main.enableLowercase"), "lowercase"),
                            tr("main.noteLowercase")
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
                            Writing.configItem(tr("main.changeDecimalSeparator"), "decimalSeparator"),
                            tr("main.noteDecimalSeparator") +
                                Writing.decimal(123.456) +
                                tr("main.noteDecimalSeparator2")
                        )
                    }

                    // Multiplicação simples
                    else if (choice == 2) {
                        Config.simpleMulti = Ui.confirm(
                            Writing.configItem(tr("main.changeSimpleMulti"), "simpleMulti"),
                            tr("main.noteSimpleMulti")
                        )
                    }

                    // Confirmações de entrada
                    else if (choice == 3) {
                        Config.inputConfirm = Ui.confirm(
                            Writing.configItem(tr("main.enableInputConfirm"), "inputConfirm"),
                            tr("main.noteInputConfirm")
                        )
                    }

                    // Confirmações de saída
                    else if (choice == 4) {
                        Config.outputConfirm = Ui.confirm(
                            Writing.configItem(tr("main.enableOutputConfirm"), "outputConfirm"),
                            tr("main.noteOutputConfirm")
                        )
                    }

                    // Errors
                    else if (choice == 5) {
                        Config.errors = Ui.confirm(
                            Writing.configItem(tr("main.enableErrors"), "errors"),
                            tr("main.noteErrors")
                        )
                    }

                    // Função
                    else if (choice == 6) {
                        Config.showFunction = Ui.confirm(
                            Writing.configItem(tr("main.enableShowFunction"), "showFunction"),
                            tr("main.noteShowFunction")
                        )
                    }
                }

                // Página 3
                else if (page == 3) {
                    // Casas decimais
                    if (choice == 1) {
                        Config.decimalPlaces = Ui.range(
                            Writing.configItem(tr("main.howManyDecimalPlaces"), "decimalPlaces"),
                            tr("main.noteDecimalPlaces"),
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
                            Writing.configItem(tr("main.whatLogPrecision"), "logPrecision"),
                            tr("main.noteLogPrecision"),
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Precisão da divisão
                    else if (choice == 3) {
                        Config.divPrecision = Ui.range(
                            Writing.configItem(tr("main.whatDivisionPrecision"), "divPrecision"),
                            tr("main.noteDivisionPrecision"),
                            1e-12,
                            1e-6,
                            20
                        )
                    }

                    // Limite de iterações
                    else if (choice == 4) {
                        Config.interactionLimit = Ui.range(
                            Writing.configItem(tr("main.whatInteracionLimit"), "interactionLimit"),
                            tr("main.noteIterationLimit"),
                            100,
                            10000
                        )
                    }

                    // Linguagem
                    else if (choice == 5) {
                        const LANGUAGES = ["pt-br", "pt-pt", "en-us", "en-gb", "es-419", "es-es"]
                        const optionLines = [
                            tr("main.brazilianPortuguese"),
                            tr("main.europeanPortuguese"),
                            tr("main.americanEnglish"),
                            tr("main.britishEnglish"),
                            tr("main.latinAmericanSpanish"),
                            tr("main.spainSpanish"),
                        ].map((label, index) => `${index + 1} = ${label}`)
                        let question = Ui.range(
                                `${Writing.configItem(tr("main.whatLanguage"), "language")}\n${optionLines.join("\n")}`,
                                tr("main.noteLanguage"),
                                1,
                                6,
                                0
                            ),
                            language = LANGUAGES[question - 1]
                        if (language != Config.language) {
                            changeLanguage(language)

                            // Para alterar o HTML também, conforme a língua
                            document.title =
                                Config.language == "en-us"
                                    ? "Mathematical Function Analyzer"
                                    : Config.language == "en-gb"
                                      ? "Mathematical Function Analyser"
                                      : Config.language == "es-419" || Config.language == "es-es"
                                        ? "Analizador de Funciones Matemáticas"
                                        : "Analisador de Funções Matemáticas"
                            let h1 = document.querySelector("h1")
                            if (h1) {
                                h1.textContent = tr("main.h1")
                            } else {
                                Ui.error("[main] Elemento 'h1' não encontrado no DOM.", "", true)
                            }
                            document.documentElement.lang = Config.language
                        }
                    }

                    // Graus
                    else if (choice == 6) {
                        const useDegrees = Ui.confirm(
                            Writing.configItem(tr("main.changeDegrees"), "degrees"),
                            tr("main.noteDegrees")
                        )
                        Config.degrees = useDegrees ? "deg" : "rad"
                    }
                }

                // Salvar as configurações
                if (Checks.isFiniteNumber(choice) && 1 <= choice && choice <= 6) {
                    saveConfig()
                }
            } while (choice != 0)
        }

        // Rever
        else if (State.type == 8 || State.type == "review") {
            Ui.display(
                tr("main.values") +
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
                State.loop = !Ui.confirm(tr("main.exitConfirm"), tr("main.noteSettingsExit"))
            } else {
                State.loop = false
            }
        }
    }

    // Erro
    else {
        State.loop = true
    }
} while (State.loop)
