import { Checks } from "./checks.js"
import { Config, resetConfig, saveConfig } from "./config.js"
import { changeLanguage, tr } from "./i18n.js"
import { State } from "./state.js"
import { Ui } from "./ui.js"
import { VERSION } from "./version.js"
import { Writing } from "./writing.js"

/**
 * [JS] Processamento de comandos do usuário
 * - Use o comando "/help" para ver todos os comandos disponíveis
 * @since v6.1.0
 */
export const Commands = {
    /**
     * [JS] Processa um comando slash
     * @param {string} raw o digitado pelo usuário
     * @returns Ação a executar, ou null se não for comando
     * @since v6.1.0
     */
    process(raw = "") {
        if (raw.length == 0 || raw[0] != "/") {
            return null
        }

        const parts = Writing.noAccents(raw.slice(1).toLowerCase()).split(" ")
        const cmd = parts[0] ?? ""
        const arg = Commands.parseBool(parts[1] ?? "")
        const canonical = Commands.resolveCmd(cmd)
        const cmds = Commands.listCmd()

        if (canonical == null) {
            const suggestion = Commands.suggestCmd(cmd)

            if (suggestion.type == "suggestion") {
                let answer = Ui.confirm(
                    tr("Você quis dizer: ", "Did you mean: ") + "“/" + suggestion.canonical + "”?",
                    tr("Comando não reconhecido: ", "Unrecognized command: ") +
                        "“/" +
                        cmd +
                        "”\n" +
                        tr("Sugestão: ", "Suggestion: ") +
                        "“/" +
                        suggestion.canonical +
                        "” " +
                        tr("(distância ", "(distance ") +
                        suggestion.distance +
                        ")\n" +
                        tr("Deseja executar?", "Run it?")
                )
                if (answer) {
                    return Commands.process("/" + suggestion.canonical + " " + parts[1])
                }
                return null
            }

            Ui.error(
                tr("Comando inválido", "Invalid command"),
                "“/" +
                    cmd +
                    "” " +
                    tr("não é um comando válido", "is not a valid command") +
                    "\n" +
                    tr("Digite “/ajuda” para ver todos os comandos", "Type “/help” to see all commands")
            )
            return null
        }

        const command = cmds[canonical]
        if (command == undefined) {
            return null
        }

        return command.action(arg, parts)
    },

    /**
     * [JS] Calcula a distância de Levenshtein entre duas strings
     * @param {string} wrong - String digitada pelo usuário
     * @param {string} correct - String de um comando conhecido
     * @since v6.1.0
     */
    levenshtein(wrong = "", correct = "") {
        let rows = correct.length + 1,
            cols = wrong.length + 1,
            matrix = [],
            row = 0,
            col = 0,
            nowRow = [],
            backRow = [],
            diagonal,
            up,
            left

        // Primeira coluna
        for (row = 0; row < rows; row++) {
            matrix[row] = [row]
        }

        // Primeira linha
        for (col = 0; col < cols; col++) {
            matrix[0][col] = col
        }

        // Restante da matriz
        for (row = 1; row < rows; row++) {
            nowRow = matrix[row]
            backRow = matrix[row - 1]

            for (col = 1; col < cols; col++) {
                diagonal = backRow[col - 1]
                up = backRow[col]
                left = nowRow[col - 1]

                if (correct[row - 1] === wrong[col - 1]) {
                    nowRow[col] = diagonal
                } else {
                    nowRow[col] = 1 + Math.min(diagonal, up, left)
                }
            }
        }

        return matrix[rows - 1][cols - 1]
    },

    /**
     * [JS] Sugere um comando baseado no digitado pelo usuário usando distância de Levenshtein
     * @param {string} typed - O digitado pelo usuário
     * @returns A sugestão de comando
     * @since v6.1.0
     */
    suggestCmd(typed = "") {
        const LIMIT = 3
        const cmds = Commands.listCmd()
        const keys = Object.keys(cmds)
        let best = "",
            lowerDist = Infinity,
            candidates = []

        keys.forEach(key => {
            candidates = [key, ...cmds[key].variations]

            candidates.forEach(candidate => {
                let dist = Commands.levenshtein(typed, candidate)
                if (dist < lowerDist) {
                    lowerDist = dist
                    best = key
                }
            })
        })

        if (lowerDist <= LIMIT) {
            return { type: lowerDist == 0 ? "exact" : "suggestion", canonical: best, distance: lowerDist }
        }
        return { type: "unknown", canonical: "", distance: -1 }
    },

    /**
     * [JS] Pesquisa comandos por termo — busca no canônico, variações, short e long
     * @param {string} term - Termo de pesquisa
     * @returns Lista de nomes canônicos dos comandos encontrados
     * @since v6.2.0
     */
    searchCmd(term = "") {
        if (term == "") {
            return []
        }

        const cmds = Commands.listCmd()
        const keys = Object.keys(cmds)
        const results = []
        let candidates = []

        keys.forEach(key => {
            const cmd = cmds[key]
            if (cmd == undefined) {
                return
            }
            candidates = [key, cmd.short, cmd.long].concat(cmd.variations)

            candidates.forEach(candidate => {
                if (Writing.noAccents(candidate.toLowerCase()).includes(Writing.noAccents(term.toLowerCase()))) {
                    results.push(key)
                }
            })
        })

        return results
    },

    /**
     * [JS] Retorna a lista de comandos disponíveis
     * @returns {object} - Lista de comandos com suas descrições, variações e ações
     * @since v6.1.0
     */
    listCmd() {
        return {
            help: {
                short: tr("mostra essa mensagem", "shows this message"),
                long: tr(
                    "Exibe a lista de todos os comandos disponíveis.\nUse: /ajuda [comando]",
                    "Displays the list of all available commands.\nUsage: /help [command]"
                ),
                variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c", "comandos", "?"],
                action(arg, parts) {
                    return Commands.help(parts[1])
                },
            },
            search: {
                short: tr("pesquisa comandos", "searches commands"),
                long: tr(
                    "Pesquisa comandos por termo no nome, variações e descrições.\nUse: /pesquisa <termo>",
                    "Searches commands by term in name, variations and descriptions.\nUsage: /search <term>"
                ),
                variations: ["pesquisa", "pesquisar", "search", "buscar", "find", "procurar", "seek", "s"],
                action(arg, parts) {
                    return Commands.searchHelp(parts[1])
                },
            },
            shortcuts: {
                short: tr("lista variações de um comando", "lists variations of a command"),
                long: tr(
                    "Exibe todas as variações aceitas de um comando.\nUse: /atalhos <comando>",
                    "Displays all accepted variations of a command.\nUsage: /shortcuts <command>"
                ),
                variations: ["atalhos", "shortcuts", "variacoes", "variacao", "aliases", "alias", "sc"],
                action(arg, parts) {
                    return Commands.shortcuts(parts[1])
                },
            },
            about: {
                short: tr("sobre o programa", "about the program"),
                long: tr(
                    "Exibe informações sobre o Projeto, Autor e repositório.",
                    "Displays information about the Project, Author and repository."
                ),
                variations: ["sobre", "about", "info", "informacoes", "informacao", "projeto"],
                action() {
                    return Commands.about()
                },
            },
            config: {
                short: tr("abre as configurações", "opens settings"),
                long: tr("Abre o menu de configurações do programa.", "Opens the program settings menu."),
                variations: ["config", "configuracoes", "conf", "settings", "cfg"],
                action(arg, parts) {
                    if (parts[1] != undefined) {
                        const configKey = parts[1]
                        if (Checks.isConfigKey(configKey)) {
                            return Commands.change(configKey, arg)
                        }
                        Ui.error(
                            tr("Configuração inválida", "Invalid setting"),
                            "“" + parts[1] + "” " + tr("não é uma configuração válida", "is not a valid setting")
                        )
                        return null
                    }
                    State.type = "config"
                    return "config"
                },
            },
            reset: {
                short: tr("restaura as configurações", "restores settings"),
                long: tr(
                    "Remove as configurações salvas e restaura os valores padrão.",
                    "Removes saved settings and restores default values."
                ),
                variations: ["resetar", "reset", "restaurar", "restore"],
                action() {
                    resetConfig()
                    Ui.warning(
                        tr("Configurações restauradas para os valores padrão.", "Settings restored to default values.")
                    )
                    return null
                },
            },
            start: {
                short: tr("volta ao menu principal", "returns to main menu"),
                long: tr(
                    "Retorna ao menu inicial de seleção de função.",
                    "Returns to the initial function selection menu."
                ),
                variations: ["inicio", "start", "home", "menu", "voltar", "back"],
                action() {
                    State.type = "start"
                    return "start"
                },
            },
            review: {
                short: tr("mostra os coeficientes atuais", "shows current coefficients"),
                long: tr(
                    "Exibe os coeficientes inseridos na sessão atual.",
                    "Displays the coefficients entered in the current session."
                ),
                variations: ["rever", "review", "rev", "rver", "coefs", "coeficientes", "ver"],
                action() {
                    State.type = "review"
                    return "review"
                },
            },
            change: {
                short: tr("muda os coeficientes", "changes coefficients"),
                long: tr(
                    "Permite alterar os coeficientes sem reiniciar a análise.",
                    "Allows changing coefficients without restarting the analysis."
                ),
                variations: ["alterar", "change", "editar", "edit", "modificar", "modify"],
                action() {
                    State.type = "change"
                    return "change"
                },
            },
            history: {
                short: tr("abre o histórico", "opens history"),
                long: tr(
                    "Exibe o histórico de funções analisadas na sessão.",
                    "Displays the history of functions analyzed in the session."
                ),
                variations: ["historico", "history", "hist"],
                action() {
                    State.type = "history"
                    return "history"
                },
            },
            version: {
                short: tr("mostra a versão", "shows version"),
                long: tr(
                    "Exibe a versão atual do programa e informações de autoria.",
                    "Displays the current version of the program and authorship information."
                ),
                variations: ["versao", "version", "vers", "v"],
                action() {
                    return Commands.version()
                },
            },
            unicode: {
                short: tr("alterna Unicode", "toggles Unicode"),
                long: tr(
                    "Ativa ou desativa o uso de caracteres Unicode na saída.",
                    "Enables or disables the use of Unicode characters in output."
                ),
                variations: ["unicode", "uni"],
                action(arg) {
                    return Commands.change("unicode", arg)
                },
            },
            accents: {
                short: tr("alterna acentos", "toggles accents"),
                long: tr(
                    "Ativa ou desativa acentos nas mensagens exibidas.",
                    "Enables or disables accents in displayed messages."
                ),
                variations: ["acentos", "accents", "acento", "accent"],
                action(arg) {
                    return Commands.change("accents", arg)
                },
            },
            explain: {
                short: tr("alterna explicações", "toggles explanations"),
                long: tr(
                    "Ativa ou desativa as explicações detalhadas dos resultados.",
                    "Enables or disables detailed explanations of results."
                ),
                variations: ["explicar", "explicacoes", "explain", "explicacao", "exp"],
                action(arg) {
                    return Commands.change("explanations", arg)
                },
            },
            capitalize: {
                short: tr("alterna capitalização", "toggles capitalization"),
                long: tr(
                    "Ativa ou desativa a capitalização das primeiras letras.",
                    "Enables or disables capitalization of first letters."
                ),
                variations: ["capitalizar", "capitalizadas", "capitalize", "capitalized", "cap"],
                action(arg) {
                    return Commands.change("capitalized", arg)
                },
            },
            uppercase: {
                short: tr("alterna maiúsculas", "toggles uppercase"),
                long: tr("Ativa ou desativa a exibição em maiúsculas.", "Enables or disables uppercase display."),
                variations: ["maiuscula", "uppercase", "upper"],
                action(arg) {
                    return Commands.change("uppercase", arg)
                },
            },
            lowercase: {
                short: tr("alterna minúsculas", "toggles lowercase"),
                long: tr("Ativa ou desativa a exibição em minúsculas.", "Enables or disables lowercase display."),
                variations: ["minuscula", "lowercase", "lower"],
                action(arg) {
                    return Commands.change("lowercase", arg)
                },
            },
            separator: {
                short: tr("alterna separador decimal", "toggles decimal separator"),
                long: tr(
                    "Alterna o separador decimal entre ponto e vírgula.",
                    "Toggles the decimal separator between period and comma."
                ),
                variations: ["decimal", "separador", "separator", "sep"],
                action(arg) {
                    return Commands.change("decimalSeparator", arg)
                },
            },
            multiples: {
                short: tr("alterna múltiplos simples", "toggles simple multiples"),
                long: tr(
                    "Ativa ou desativa a simplificação de múltiplos.",
                    "Enables or disables simplification of multiples."
                ),
                variations: ["multiplos", "multiplo", "multiples", "multi"],
                action(arg) {
                    return Commands.change("simpleMulti", arg)
                },
            },
            confirm: {
                short: tr("alterna confirmações de entrada", "toggles input confirmations"),
                long: tr(
                    "Ativa ou desativa as confirmações ao inserir dados.",
                    "Enables or disables confirmations when entering data."
                ),
                variations: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"],
                action(arg) {
                    return Commands.change("inputConfirm", arg)
                },
            },
            confirmExit: {
                short: tr("alterna confirmações de saída", "toggles exit confirmations"),
                long: tr(
                    "Ativa ou desativa a confirmação ao sair do programa.",
                    "Enables or disables the confirmation when exiting the program."
                ),
                variations: [
                    "confirmarSaida",
                    "confirmExit",
                    "confirmarsaida",
                    "confirmsaida",
                    "confirmexit",
                    "confsaida",
                    "confexit",
                ],
                action(arg) {
                    return Commands.change("outputConfirm", arg)
                },
            },
            errors: {
                short: tr("alterna exibição de erros", "toggles error display"),
                long: tr(
                    "Ativa ou desativa a exibição de mensagens de erro.",
                    "Enables or disables the display of error messages."
                ),
                variations: ["erros", "erro", "errors", "error", "err"],
                action(arg) {
                    return Commands.change("errors", arg)
                },
            },
            function: {
                short: tr("alterna exibição da função", "toggles function display"),
                long: tr(
                    "Ativa ou desativa a exibição da função analisada.",
                    "Enables or disables the display of the analyzed function."
                ),
                variations: [
                    "funcao",
                    "mostrarfuncao",
                    "mostrarFuncao",
                    "function",
                    "showfunction",
                    "showFunction",
                    "func",
                    "fn",
                ],
                action(arg) {
                    return Commands.change("showFunction", arg)
                },
            },
            degrees: {
                short: tr("alterna modo graus", "toggles degrees mode"),
                long: tr(
                    "Alterna entre graus e radianos nos cálculos.",
                    "Toggles between degrees and radians in calculations."
                ),
                variations: ["graus", "grau", "degrees", "degree", "deg", "rad", "radianos", "radians"],
                action(arg) {
                    return Commands.change("degrees", arg)
                },
            },
            language: {
                short: tr("alterna língua", "toggles language"),
                long: tr(
                    "Altera a língua do programa entre português e inglês.\nUse: /language [pt | en]",
                    "Changes the program language between Portuguese and English.\nUsage: /language [pt | en]"
                ),
                variations: [
                    "lingua",
                    "language",
                    "lang",
                    "idioma",

                    // Português
                    "pt",
                    "pt-br",
                    "pt-pt",
                    "portugues",
                    "portuguese",
                    "brasileiro",
                    "brazilian",
                    "br",
                    "ptbr",

                    // Inglês
                    "en",
                    "en-us",
                    "en-gb",
                    "ingles",
                    "english",
                    "anglo",
                    "eua",
                    "usa",
                    "uk",
                ],
                action(arg, parts) {
                    let target = parts[1] != undefined ? parts[1] : parts[0]
                    target = Writing.noAccents(Writing.lowercase(target))

                    // Português
                    if (
                        [
                            // Geral
                            "lusitano",
                            "lusitana",

                            // BR
                            "br",
                            "pt-br",
                            "ptbr",
                            "brasileiro",
                            "brazilian",
                            "brasil",
                            "brazil",

                            // PT
                            "pt",
                            "pt-pt",
                            "ptpt",
                            "portugues",
                            "portuguese",
                            "portugal",
                        ].includes(target)
                    ) {
                        if (Config.language == "pt") {
                            Ui.warning(
                                tr(
                                    "A língua já está definida como português.",
                                    "The language is already set to Portuguese."
                                )
                            )
                        } else {
                            changeLanguage("pt")
                        }
                    }

                    // Inglês
                    else if (
                        [
                            // Geral
                            "en",
                            "anglo",
                            "anglo-saxon",
                            "anglosaxon",

                            // US
                            "en-us",
                            "enus",
                            "americano",
                            "american",
                            "eua",
                            "usa",

                            // GB
                            "en-gb",
                            "engb",
                            "ingles",
                            "english",
                            "britanico",
                            "british",
                            "uk",
                        ].includes(target)
                    ) {
                        if (Config.language == "en") {
                            Ui.warning(
                                tr("A língua já está definida como inglês.", "The language is already set to English.")
                            )
                        } else {
                            changeLanguage("en")
                        }
                    }

                    // Erro — só mostra se o utilizador tentou passar um argumento explícito
                    else if (parts[1] != undefined) {
                        Ui.error(
                            tr("Língua inválida", "Invalid language"),
                            "“" + target + "” " + tr("não é uma língua válida", "is not a valid language")
                        )
                    }

                    return null
                },
            },
            debug: {
                short: tr("alterna modo debug", "toggles debug mode"),
                long: tr("Ativa ou desativa o modo de depuração.", "Enables or disables debug mode."),
                variations: ["debug", "dbg"],
                action(arg) {
                    return Commands.change("debug", arg)
                },
            },
            exit: {
                short: tr("sai do programa", "exits the program"),
                long: tr(
                    "Encerra o programa. Confirmação pode ser solicitada.",
                    "Exits the program. Confirmation may be requested."
                ),
                variations: ["sair", "exit", "//", "ex", "out", "quit", "q", "fechar", "close"],
                action() {
                    State.type = "exit"
                    return "exit"
                },
            },
        }
    },

    /**
     * [JS] Resolve um comando específico para seu nome canônico
     * @param  specific - Comando específico
     * @returns Nome canônico do comando, ou null se não for encontrado
     * @since v6.1.0
     */
    resolveCmd(specific = "") {
        if (specific == "") {
            return null
        }

        const cmds = Commands.listCmd()
        const cmdKeys = Object.keys(cmds)
        let canonical = specific

        cmdKeys.forEach(key => {
            const cmd = cmds[key]
            if (cmd != undefined && cmd.variations.includes(specific)) {
                canonical = key
            }
        })

        return cmds[canonical] != undefined ? canonical : null
    },

    /**
     * [JS] Converte um texto em um valor boolean
     * @param  text o
     * @returns} - Se é parecido com um valor boolean verdadeiro / falso ou se não é reconhecido
     * @since v6.1.0
     */
    parseBool(text = "") {
        if (["true", "1", "sim", "yes", "on", "ativo", "enable", "enabled", "ligar", "ativar"].includes(text)) {
            return true
        }
        if (
            ["false", "0", "nao", "no", "off", "inativo", "disable", "disabled", "desligar", "desativar"].includes(text)
        ) {
            return false
        }
        return undefined
    },

    /**
     * [JS] Exibe ajuda sobre um comando específico ou lista paginada de todos os comandos
     * @param  specific - Nome ou variação de um comando específico (opcional)
     * @returns {null}
     * @since v6.1.0
     */
    help(specific = "") {
        const cmds = Commands.listCmd()

        if (specific != "") {
            const canonical = Commands.resolveCmd(specific)

            if (canonical != null) {
                const cmd = cmds[canonical]
                if (cmd != undefined) {
                    const shortList = [canonical].concat(cmd.variations).join(", ")
                    Ui.display(
                        "“/" + canonical + "” — " + cmd.long + "\n" + tr("Variações: ", "Variations: ") + shortList
                    )
                }
                return null
            }

            Ui.error(
                tr("Comando desconhecido", "Unknown command"),
                "“/" + specific + "” " + tr("não é um comando válido", "is not a valid command")
            )
            return null
        }

        const key = Object.keys(cmds)
        const total = Math.ceil(key.length / 5)
        let page = 1,
            answer = 0

        do {
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            const start = (page - 1) * 5
            const end = Math.min(start + 5, key.length)
            let menu =
                "=== " +
                tr("Ajuda", "Help") +
                " ===" +
                "\n" +
                tr("Página ", "Page ") +
                String(page) +
                "/" +
                String(total) +
                "\n"

            for (let i = start; i < end; i++) {
                let aliases = [key[i], ...cmds[key[i]].variations].join(", ")
                menu += "\n/" + key[i] + " — " + cmds[key[i]].short + "\n  ↳ " + aliases
            }

            menu +=
                "\n----------------\n8 = " +
                tr("Anterior", "Previous") +
                " | 9 = " +
                tr("Próxima", "Next") +
                " | 0 = " +
                tr("Voltar", "Back")

            answer = Ui.range(menu, "", 0, 9, 0, true)

            if (answer == 8) {
                page--
            } else if (answer == 9) {
                page++
            }
        } while (answer != 0)

        return null
    },

    /**
     * [JS] Exibe os resultados de uma pesquisa de comandos de forma paginada
     * @param  term - Termo de pesquisa
     * @returns {null}
     * @since v6.2.0
     */
    searchHelp(term = "") {
        if (term == "") {
            Ui.error(
                tr("Pesquisa vazia", "Empty search"),
                tr(
                    "Use: /pesquisa <termo>\nExemplo: /pesquisa lingua",
                    "Usage: /search <term>\nExample: /search language"
                )
            )
            return null
        }

        term = Writing.noAccents(term.toLowerCase())

        const results = Commands.searchCmd(term)
        const cmds = Commands.listCmd()

        if (results.length == 0) {
            Ui.warning(tr("Nenhum comando encontrado para ", "No commands found for ") + "“" + term + "”")
            return null
        }

        const total = Math.ceil(results.length / 5)
        let page = 1,
            answer = 0

        do {
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            const start = (page - 1) * 5
            const end = Math.min(start + 5, results.length)
            let menu =
                "=== " +
                tr("Pesquisa: ", "Search: ") +
                "“" +
                term +
                "” ===\n" +
                String(results.length) +
                " " +
                tr("resultado(s) — Página ", "result(s) — Page ") +
                String(page) +
                "/" +
                String(total) +
                "\n"

            for (let i = start; i < end; i++) {
                menu += "\n/" + results[i] + " — " + cmds[results[i]].short
            }

            menu +=
                "\n----------------\n" +
                "8 = " +
                tr("Anterior", "Previous") +
                " | 9 = " +
                tr("Próxima", "Next") +
                " | 0 = " +
                tr("Voltar", "Back")

            answer = Ui.range(menu, "", 0, 9, 0, true)

            if (answer == 8) {
                page--
            } else if (answer == 9) {
                page++
            }
        } while (answer != 0)

        return null
    },

    /**
     * [JS] Exibe todas as variações aceitas de um comando
     * @param  specific - Nome ou variação do comando
     * @returns {null}
     * @since v6.2.0
     */
    shortcuts(specific = "") {
        if (specific == "") {
            Ui.error(
                tr("Comando não informado", "Command not provided"),
                tr(
                    "Use: /atalhos <comando>\nExemplo: /atalhos language",
                    "Usage: /shortcuts <command>\nExample: /shortcuts language"
                )
            )
            return null
        }

        const cmds = Commands.listCmd()
        const canonical = Commands.resolveCmd(specific)

        if (canonical == null) {
            Ui.error(
                tr("Comando desconhecido", "Unknown command"),
                "“/" + specific + "” " + tr("não é um comando válido", "is not a valid command")
            )
            return null
        }

        const all = cmds[canonical].variations
        const list = all
            .map(function (v) {
                return "“/" + v
            })
            .join("\n")

        Ui.display(tr("Variações de ", "Variations of ") + "“/" + canonical + "”:\n" + list)
        return null
    },

    /**
     * [JS] Exibe informações sobre o Projeto
     * @returns {null}
     * @since v6.2.0
     */
    about() {
        Ui.display(
            "====================================================" +
                "\n" +
                tr("Analisador de Funções Matemáticas", "Mathematical Function Analyzer") +
                " — " +
                VERSION +
                "\n" +
                tr("Autor: ", "Author: ") +
                "Adriano Lima" +
                "\n" +
                tr("Repositório: ", "Repository: ") +
                "github.com/C4Adriano/analisador-funcoes-matematicas" +
                "\n" +
                tr("Todos os direitos reservados", "All rights reserved") +
                " © Adriano Lima 2025 — 2026" +
                "\n" +
                "===================================================="
        )
        return null
    },

    /**
     * [JS] Exibe a versão do programa
     * @returns {null}
     * @since v6.1.0
     */
    version() {
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
                "===================================================="
        )
        return null
    },

    change(name, value) {
        const currentValue = Config[name]

        if (currentValue === undefined) {
            Ui.error("[Commands.change] Configuração inexistente.", "'" + name + "' não existe em Config.", true)
            return null
        }

        if (typeof currentValue === "boolean" && value == undefined) {
            Config[name] = !currentValue
        } else if (value != undefined && typeof currentValue === typeof value) {
            Config[name] = value
        } else {
            Ui.error("[Commands.change] Valor inválido.", "Esta configuração não suporta alternância simples.", true)
            return null
        }

        if (name === "capitalized" && Config.capitalized) {
            Config.uppercase = false
            Config.lowercase = false
        } else if (name === "uppercase" && Config.uppercase) {
            Config.capitalized = false
            Config.lowercase = false
        } else if (name === "lowercase" && Config.lowercase) {
            Config.capitalized = false
            Config.uppercase = false
        }

        saveConfig()
        Ui.warning(Writing.configItem(tr("Alterado: ", "Changed: ") + "“" + name + "”", name))

        return null
    },

    /**
     * [JS] Retorna uma lista com os nomes canônicos dos comandos que alteram o fluxo de estado
     * @returns {string[]} Lista de nomes canônicos
     * @since v6.1.0
     */
    names() {
        return ["config", "exit", "start", "review", "history", "change"]
    },
}
