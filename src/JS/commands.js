import { Config, VERSION, saveConfig, resetConfig, changeLanguage } from "./config.js"
import { State } from "./state.js"
import { Test } from "./test.js"
import { Ui } from "./ui.js"
import { Writing } from "./writing.js"

/**
 * [JS] Processamento de comandos do usuário
 * - Use o comando "/help" para ver todos os comandos disponíveis
 * @since v6.1.0
 */
export const Commands = {
    /**
     * [JS] Processa um comando slash
     * @param {string} raw - Texto digitado pelo usuário
     * @returns {string | null} - Ação a executar, ou null se não for comando
     * @since v6.1.0
     */
    process(raw = "") {
        if (raw[0] != "/") {
            return null
        }

        let parts = Writing.noAccents(raw.slice(1).toLowerCase()).split(" "),
            cmd = parts[0],
            arg = Commands.parseBool(parts[1] || ""),
            canonical = Commands.resolveCmd(cmd),
            cmds = Commands.listCmd()

        if (canonical == null) {
            let suggestion = Commands.suggestCmd(cmd)

            if (suggestion.type == "suggestion") {
                let answer = Ui.confirm(
                    "Você quis dizer: “/" + suggestion.canonical + "”?",
                    "Comando não reconhecido: “/" +
                        cmd +
                        "”\nA sugestão mais próxima é “/" +
                        suggestion.canonical +
                        "” (distância " +
                        suggestion.distance +
                        ")\nDeseja executar essa sugestão?"
                )
                if (answer == true) {
                    return Commands.process("/" + suggestion.canonical + " " + (parts[1] || ""))
                }
                return null
            }

            Ui.error(
                "Comando inválido",
                "/“" + cmd + "” não é um comando válido\nDigite “/help” para ver todos os comandos"
            )
            return null
        }

        return cmds[canonical].action(arg, parts)
    },

    /**
     * [JS] Calcula a distância de Levenshtein entre duas strings
     * @param {string} wrong - A string digitada pelo usuário
     * @param {string} correct - A string de um comando conhecido
     * @returns {number}
     * @since v6.1.0
     */
    levenshtein(wrong = "", correct = "") {
        let rows = correct.length + 1,
            cols = wrong.length + 1,
            matrix = [],
            row = 0,
            col = 0

        for (row = 0; row < rows; row++) {
            matrix[row] = [row]
        }
        for (col = 0; col < cols; col++) {
            matrix[0][col] = col
        }

        for (row = 1; row < rows; row++) {
            for (col = 1; col < cols; col++) {
                if (correct[row - 1] == wrong[col - 1]) {
                    matrix[row][col] = matrix[row - 1][col - 1]
                } else {
                    matrix[row][col] =
                        1 + Math.min(matrix[row - 1][col], matrix[row][col - 1], matrix[row - 1][col - 1])
                }
            }
        }

        return matrix[rows - 1][cols - 1]
    },

    /**
     * [JS] Sugere um comando baseado no digitado pelo usuário usando distância de Levenshtein
     * @param {string} typed - O digitado pelo usuário
     * @returns {object} - A sugestão de comando
     * @since v6.1.0
     */
    suggestCmd(typed = "") {
        const LIMIT = 3
        let cmds = Commands.listCmd(),
            keys = Object.keys(cmds),
            best = "",
            lowerDist = Infinity,
            i = 0,
            j = 0,
            candidates = [],
            dist = 0

        for (i = 0; i < keys.length; i++) {
            candidates = [keys[i]].concat(cmds[keys[i]].variations)

            for (j = 0; j < candidates.length; j++) {
                dist = Commands.levenshtein(typed, candidates[j])
                if (dist < lowerDist) {
                    lowerDist = dist
                    best = keys[i]
                }
            }
        }

        if (lowerDist == 0) {
            return { type: "exact", canonical: best, distance: 0 }
        }
        if (lowerDist <= LIMIT) {
            return { type: "suggestion", canonical: best, distance: lowerDist }
        }
        return { type: "unknown", canonical: "", distance: -1 }
    },

    /**
     * [JS] Pesquisa comandos por termo — busca no canônico, variações, short e long
     * @param {string} term - Termo de pesquisa
     * @returns {string[]} - Lista de nomes canônicos dos comandos encontrados
     * @since v6.2.0
     */
    searchCmd(term = "") {
        if (term == "") {
            return []
        }

        let cmds = Commands.listCmd(),
            keys = Object.keys(cmds),
            results = [],
            t = Writing.noAccents(term.toLowerCase()),
            i = 0,
            j = 0,
            cmd,
            candidates = []

        for (i = 0; i < keys.length; i++) {
            cmd = cmds[keys[i]]
            candidates = [keys[i], cmd.short, cmd.long].concat(cmd.variations)

            for (j = 0; j < candidates.length; j++) {
                if (Writing.noAccents(candidates[j].toLowerCase()).includes(t)) {
                    results.push(keys[i])
                    break
                }
            }
        }

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
                short: "mostra essa mensagem",
                long: "Exibe a lista de todos os comandos disponíveis.\nUso: /help [comando]",
                variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c", "comandos", "?"],
                action(arg, parts) {
                    return Commands.help(parts[1] || "")
                },
            },
            search: {
                short: "pesquisa comandos",
                long: "Pesquisa comandos por termo no nome, variações e descrições.\nUso: /search <termo>",
                variations: ["pesquisar", "search", "buscar", "find", "procurar", "seek", "s"],
                action(arg, parts) {
                    return Commands.searchHelp(parts[1] || "")
                },
            },
            shortcuts: {
                short: "lista variações de um comando",
                long: "Exibe todas as variações aceitas de um comando.\nUso: /shortcuts <comando>",
                variations: ["atalhos", "shortcuts", "variacoes", "variacao", "aliases", "alias", "sc"],
                action(arg, parts) {
                    return Commands.shortcuts(parts[1] || "")
                },
            },
            about: {
                short: "sobre o programa",
                long: "Exibe informações sobre o projeto, autor e repositório.",
                variations: ["sobre", "about", "info", "informacoes", "informacao", "projeto"],
                action() {
                    return Commands.about()
                },
            },
            config: {
                short: "abre as configurações",
                long: "Abre o menu de configurações do programa.",
                variations: ["config", "configuracoes", "conf", "settings", "cfg"],
                action(arg, parts) {
                    if (parts[1] != undefined) {
                        let canonical = Commands.resolveCmd(parts[1])
                        if (canonical != null && Config[canonical] != undefined) {
                            return Commands.change(canonical, arg)
                        }
                        Ui.error("Configuração inválida", "“" + parts[1] + "” não é uma configuração válida")
                        return null
                    }
                    State.type = "config"
                    return "config"
                },
            },
            reset: {
                short: "restaura as configurações",
                long: "Remove as configurações salvas e restaura os valores padrão.",
                variations: ["resetar", "reset", "restaurar", "restore"],
                action() {
                    resetConfig()
                    Ui.warning("Configurações restauradas para os valores padrão.")
                    return null
                },
            },
            start: {
                short: "volta ao menu principal",
                long: "Retorna ao menu inicial de seleção de função.",
                variations: ["inicio", "start", "home", "menu", "voltar", "back"],
                action() {
                    State.type = "start"
                    return "start"
                },
            },
            review: {
                short: "mostra os coeficientes atuais",
                long: "Exibe os coeficientes inseridos na sessão atual.",
                variations: ["rever", "review", "rev", "rver", "coefs", "coeficientes", "ver"],
                action() {
                    State.type = "review"
                    return "review"
                },
            },
            change: {
                short: "muda os coeficientes",
                long: "Permite alterar os coeficientes sem reiniciar a análise.",
                variations: ["alterar", "change", "editar", "edit", "modificar", "modify"],
                action() {
                    State.type = "change"
                    return "change"
                },
            },
            history: {
                short: "abre o histórico",
                long: "Exibe o histórico de funções analisadas na sessão.",
                variations: ["historico", "history", "hist"],
                action() {
                    State.type = "history"
                    return "history"
                },
            },
            version: {
                short: "mostra a versão",
                long: "Exibe a versão atual do programa e informações de autoria.",
                variations: ["versao", "version", "vers", "v"],
                action() {
                    return Commands.version()
                },
            },
            unicode: {
                short: "alterna Unicode",
                long: "Ativa ou desativa o uso de caracteres Unicode na saída.",
                variations: ["unicode", "uni"],
                action(arg) {
                    return Commands.change("unicode", arg)
                },
            },
            accents: {
                short: "alterna acentos",
                long: "Ativa ou desativa acentos nas mensagens exibidas.",
                variations: ["acentos", "accents", "acento", "accent"],
                action(arg) {
                    return Commands.change("accents", arg)
                },
            },
            explain: {
                short: "alterna explicações",
                long: "Ativa ou desativa as explicações detalhadas dos resultados.",
                variations: ["explicar", "explicacoes", "explain", "explicacao", "exp"],
                action(arg) {
                    return Commands.change("explanations", arg)
                },
            },
            capitalize: {
                short: "alterna capitalização",
                long: "Ativa ou desativa a capitalização das primeiras letras.",
                variations: ["capitalizar", "capitalizadas", "capitalize", "capitalized", "cap"],
                action(arg) {
                    return Commands.change("capitalized", arg)
                },
            },
            uppercase: {
                short: "alterna maiúsculas",
                long: "Ativa ou desativa a exibição em maiúsculas.",
                variations: ["maiuscula", "uppercase", "upper"],
                action(arg) {
                    return Commands.change("uppercase", arg)
                },
            },
            lowercase: {
                short: "alterna minúsculas",
                long: "Ativa ou desativa a exibição em minúsculas.",
                variations: ["minuscula", "lowercase", "lower"],
                action(arg) {
                    return Commands.change("lowercase", arg)
                },
            },
            separator: {
                short: "alterna separador decimal",
                long: "Alterna o separador decimal entre ponto e vírgula.",
                variations: ["decimal", "separador", "separator", "sep"],
                action(arg) {
                    return Commands.change("decimalSeparator", arg)
                },
            },
            multiples: {
                short: "alterna múltiplos simples",
                long: "Ativa ou desativa a simplificação de múltiplos.",
                variations: ["multiplos", "multiplo", "multiples", "multi"],
                action(arg) {
                    return Commands.change("simpleMulti", arg)
                },
            },
            confirm: {
                short: "alterna confirmações de entrada",
                long: "Ativa ou desativa as confirmações ao inserir dados.",
                variations: ["confirmacoes", "confirm", "confirmations", "confent", "confinp"],
                action(arg) {
                    return Commands.change("inputConfirm", arg)
                },
            },
            confirmExit: {
                short: "alterna confirmações de saída",
                long: "Ativa ou desativa a confirmação ao sair do programa.",
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
                short: "alterna exibição de erros",
                long: "Ativa ou desativa a exibição de mensagens de erro.",
                variations: ["erros", "erro", "errors", "error", "err"],
                action(arg) {
                    return Commands.change("errors", arg)
                },
            },
            function: {
                short: "alterna exibição da função",
                long: "Ativa ou desativa a exibição da função analisada.",
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
                short: "alterna modo graus",
                long: "Alterna entre graus e radianos nos cálculos.",
                variations: ["graus", "grau", "degrees", "degree", "deg", "rad", "radianos", "radians"],
                action(arg) {
                    return Commands.change("degrees", arg)
                },
            },
            language: {
                short: "alterna língua",
                long: "Altera a língua do programa entre português e inglês.\nUso: /language [pt | en]",
                variations: [
                    "lingua",
                    "language",
                    "lang",
                    "idioma",
                    "pt",
                    "en",
                    "pt-br",
                    "ingles",
                    "english",
                    "portugues",
                    "portuguese",
                ],
                action(arg, parts) {
                    if (parts[1] != undefined) {
                        parts[1] = Writing.noAccents(Writing.lowercase(parts[1]))

                        // Português
                        if (
                            parts[1] == "pt-br" ||
                            parts[1] == "pt" ||
                            parts[1] == "portugues" ||
                            parts[1] == "portuguese" ||
                            parts[1] == "brasileiro" ||
                            parts[1] == "brazilian"
                        ) {
                            if (Config.language == "pt-br") {
                                Ui.warning("A língua já está definida como português.")
                            } else {
                                changeLanguage("pt-br")
                            }
                        }

                        // Inglês
                        else if (
                            parts[1] == "en" ||
                            parts[1] == "english" ||
                            parts[1] == "ingles" ||
                            parts[1] == "inglese" ||
                            parts[1] == "anglo" ||
                            parts[1] == "anglo-saxon"
                        ) {
                            if (Config.language == "en") {
                                Ui.warning("A língua já está definida como inglês.")
                            } else {
                                changeLanguage("en")
                            }
                        }

                        // Erro
                        else {
                            Ui.error("Língua inválida", "“" + parts[1] + "” não é uma língua válida")
                        }
                        return null
                    }
                },
            },
            debug: {
                short: "alterna modo debug",
                long: "Ativa ou desativa o modo de depuração.",
                variations: ["debug", "dbg"],
                action(arg) {
                    return Commands.change("debug", arg)
                },
            },
            test: {
                short: "executa testes",
                long: "Executa a bateria de testes internos do programa.",
                variations: ["teste", "test"],
                action(arg, parts) {
                    if (parts[1] == "1234") {
                        Test.start()
                    } else {
                        Ui.error("Senha inválida", "“" + String(parts[1]) + "” não é uma senha válida")
                    }
                    return null
                },
            },
            exit: {
                short: "sai do programa",
                long: "Encerra o programa. Confirmação pode ser solicitada.",
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
     * @param {string} specific - Comando específico
     * @returns {string | null} - Nome canônico do comando, ou null se não for encontrado
     * @since v6.1.0
     */
    resolveCmd(specific = "") {
        let cmds = Commands.listCmd(),
            cmdKeys = Object.keys(cmds),
            canonical = specific,
            i = 0

        while (i < cmdKeys.length && canonical == specific) {
            if (cmds[cmdKeys[i]].variations.includes(specific)) {
                canonical = cmdKeys[i]
            }
            i++
        }

        return cmds[canonical] != undefined ? canonical : null
    },

    /**
     * [JS] Converte um texto em um valor boolean
     * @param {string} text - Texto
     * @returns {boolean | null} - Se é parecido com um valor boolean verdadeiro / falso ou se não é reconhecido
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
        return null
    },

    /**
     * [JS] Exibe ajuda sobre um comando específico ou lista paginada de todos os comandos
     * @param {string} specific - Nome ou variação de um comando específico (opcional)
     * @returns {null}
     * @since v6.1.0
     */
    help(specific = "") {
        let cmds = Commands.listCmd()

        if (specific != "") {
            let canonical = Commands.resolveCmd(specific)

            if (canonical != null) {
                let cmd = cmds[canonical],
                    shortList = [canonical].concat(cmd.variations).join(", ")
                Ui.display("“/" + canonical + "” — " + cmd.long + "\nVariações: " + shortList)
                return null
            }

            Ui.error("Comando desconhecido", "“/" + specific + "” não é um comando válido")
            return null
        }

        let key = Object.keys(cmds),
            total = Math.ceil(key.length / 5),
            page = 1,
            answer = 0

        do {
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            let start = (page - 1) * 5,
                end = Math.min(start + 5, key.length),
                menu = "=== Ajuda ===\nPágina " + String(page) + "/" + String(total) + "\n"

            for (let i = start; i < end; i++) {
                let aliases = [key[i]].concat(cmds[key[i]].variations).join(", ")
                menu += "\n/" + key[i] + " — " + cmds[key[i]].short + "\n  ↳ " + aliases
            }

            menu += "\n----------------\n8 = Anterior | 9 = Próxima | 0 = Voltar"

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
     * @param {string} term - Termo de pesquisa
     * @returns {null}
     * @since v6.2.0
     */
    searchHelp(term = "") {
        if (term == "") {
            Ui.error("Pesquisa vazia", "Use: /search <termo>\nExemplo: /search lingua")
            return null
        }

        term = Writing.noAccents(term.toLowerCase())

        let results = Commands.searchCmd(term),
            cmds = Commands.listCmd()

        if (results.length == 0) {
            Ui.warning("Nenhum comando encontrado para “/" + term + "”")
            return null
        }

        let total = Math.ceil(results.length / 5),
            page = 1,
            answer = 0

        do {
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            let start = (page - 1) * 5,
                end = Math.min(start + 5, results.length),
                menu =
                    "=== Pesquisa: “" +
                    term +
                    "” ===\n" +
                    String(results.length) +
                    " resultado(s) — Página " +
                    String(page) +
                    "/" +
                    String(total) +
                    "\n"

            for (let i = start; i < end; i++) {
                menu += "\n/" + results[i] + " — " + cmds[results[i]].short
            }

            menu += "\n----------------\n8 = Anterior | 9 = Próxima | 0 = Voltar"

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
     * @param {string} specific - Nome ou variação do comando
     * @returns {null}
     * @since v6.2.0
     */
    shortcuts(specific = "") {
        if (specific == "") {
            Ui.error("Comando não informado", "Use: /shortcuts <comando>\nExemplo: /shortcuts language")
            return null
        }

        let cmds = Commands.listCmd(),
            canonical = Commands.resolveCmd(specific)

        if (canonical == null) {
            Ui.error("Comando desconhecido", "“/" + specific + "” não é um comando válido")
            return null
        }

        let all = cmds[canonical].variations,
            list = all
                .map(function (v) {
                    return "/" + v
                })
                .join("\n")

        Ui.display("Variações de “/" + canonical + "”:\n" + list)
        return null
    },

    /**
     * [JS] Exibe informações sobre o projeto
     * @returns {null}
     * @since v6.2.0
     */
    about() {
        Ui.display(
            "" +
                "====================================================" +
                "\n" +
                "Analisador de Funções Matemáticas — " +
                VERSION +
                "\n" +
                "Autor: Adriano Lima" +
                "\n" +
                "Repositório: github.com/C4Adriano/analisador-funcoes-matematicas" +
                "\n" +
                "Todos os direitos reservados © Adriano Lima 2025 — 2026" +
                "\n" +
                "====================================================",
            ""
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
            "" +
                "====================================================" +
                "\n" +
                "Analisador de Funções Matemáticas — " +
                VERSION +
                "\n" +
                "Todos os direitos reservados © Adriano Lima 2025 — 2026" +
                "\n" +
                "====================================================",
            ""
        )
        return null
    },

    /**
     * [JS] Altera uma configuração do programa
     * @param {string} name - Nome da configuração
     * @param {any} value - Novo valor para a configuração
     * @returns {null}
     * @since v6.1.0
     */
    change(name = "", value = null) {
        if (value != null) {
            Config[name] = value
        } else {
            Config[name] = !Config[name]
        }

        if (name == "capitalized" && Config.capitalized) {
            Config.uppercase = false
            Config.lowercase = false
        } else if (name == "uppercase" && Config.uppercase) {
            Config.capitalized = false
            Config.lowercase = false
        } else if (name == "lowercase" && Config.lowercase) {
            Config.capitalized = false
            Config.uppercase = false
        }

        saveConfig()
        Ui.warning(Writing.configItem("Alterado: “" + name + "”", name))
        return null
    },

    /**
     * [JS] Retorna uma lista com os nomes canônicos dos comandos que alteram o fluxo de estado
     * @returns {string[]} - Lista de nomes canônicos
     * @since v6.1.0
     */
    names() {
        return ["config", "exit", "start", "review", "history", "change"]
    },
}
