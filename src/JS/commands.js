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
        if (raw[0] != "/") return null

        let parts = Writing.noAccents(raw.slice(1).toLowerCase()).split(" "),
            cmd = parts[0],
            arg = Commands.parseBool(parts[1] || ""),
            canonical = Commands.resolveCmd(cmd),
            cmds = Commands.listCmd()

        if (canonical === null) {
            let suggestion = Commands.suggestCmd(cmd)

            if (suggestion.tipo === "suggestion") {
                let answer = Ui.confirm(
                    "Você quis dizer: “/" + suggestion.canonical + "”?",
                    "Comando não reconhecido: “/" +
                        cmd +
                        "”\nA sugestão mais próxima é “" +
                        suggestion.canonical +
                        "” (distância " +
                        suggestion.distance +
                        ")\nDeseja executar essa sugestão?"
                )
                if (answer === 1) {
                    return Commands.process("/" + suggestion.canonical + " " + (parts[1] || ""))
                }
                return null
            }

            Ui.error("Comando inválido", cmd + " não é um comando válido\nDigite “/help” para ver todos os comandos")
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
            // Testa a chave canônica + todas as variações
            candidates = [keys[i]].concat(cmds[keys[i]].variations)

            for (j = 0; j < candidates.length; j++) {
                dist = Commands.levenshtein(typed, candidates[j])
                if (dist < lowerDist) {
                    lowerDist = dist
                    best = keys[i] // sempre salva o canônico
                }
            }
        }

        if (lowerDist === 0) return { type: "exact", canonical: best, distance: 0 }
        if (lowerDist <= LIMIT) return { type: "suggestion", canonical: best, distance: lowerDist }
        return { type: "unknown", canonical: "", distance: -1 }
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
                long: "Exibe a lista de todos os comandos disponíveis.\nUso: /ajuda [comando]",
                variations: ["ajuda", "help", "a", "h", "cmd", "cmds", "c"],
                action(arg, parts) {
                    return Commands.help(parts[1] || "")
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
                variations: ["inicio", "start"],
                action() {
                    State.type = "inicio"
                    return "inicio"
                },
            },
            review: {
                short: "mostra os coeficientes atuais",
                long: "Exibe os coeficientes inseridos na sessão atual.",
                variations: ["rever", "review"],
                action() {
                    State.type = "rever"
                    return "rever"
                },
            },
            change: {
                short: "muda os coeficientes",
                long: "Permite alterar os coeficientes sem reiniciar a análise.",
                variations: ["alterar", "change"],
                action() {
                    State.type = "alterar"
                    return "alterar"
                },
            },
            history: {
                short: "abre o histórico",
                long: "Exibe o histórico de funções analisadas na sessão.",
                variations: ["historico", "history"],
                action() {
                    State.type = "historico"
                    return "historico"
                },
            },
            version: {
                short: "mostra a versão",
                long: "Exibe a versão atual do programa e informações de autoria.",
                variations: ["versao", "version", "v"],
                action() {
                    return Commands.version()
                },
            },
            unicode: {
                short: "alterna Unicode",
                long: "Ativa ou desativa o uso de caracteres Unicode na saída.",
                variations: ["unicode"],
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
                variations: ["explicar", "explicacoes", "explain"],
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
                ],
                action(arg) {
                    return Commands.change("showFunction", arg)
                },
            },
            degrees: {
                short: "alterna modo graus",
                long: "Alterna entre graus e radianos nos cálculos.",
                variations: ["graus", "grau", "degrees", "degree", "deg"],
                action(arg) {
                    return Commands.change("degrees", arg)
                },
            },
            language: {
                short: "alterna língua",
                long: "Altera a língua do programa entre português e inglês.",
                variations: ["lingua", "language", "lang"],
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
                            if (Config.language === "pt-br") {
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
                            if (Config.language === "en") {
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
                variations: ["sair", "exit", "//", "ex", "out"],
                action() {
                    State.type = "sair"
                    return "sair"
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
        if (["true", "1", "sim", "yes", "on", "ativo"].includes(text)) {
            return true
        }
        if (["false", "0", "nao", "no", "off", "inativo"].includes(text)) {
            return false
        }
        return null
    },

    /**
     * [JS] Exibe ajuda sobre um comando específico
     * @param {string} specific - Específico
     * @returns {boolean | null} - Se o comando foi encontrado
     * @since v6.1.0
     */
    help(specific = "") {
        let cmds = Commands.listCmd()

        if (specific != "") {
            let canonical = Commands.resolveCmd(specific)

            if (canonical != null) {
                Ui.warning("/" + canonical + " — " + cmds[canonical].long)
                return null
            }

            Ui.error("Comando desconhecido", "“/" + specific + "” não é um comando válido")
            return null
        }

        let key = Object.keys(cmds),
            total = Math.ceil(key.length / 7),
            page = 1,
            answer = 0

        do {
            if (page < 1) {
                page = 1
            } else if (page > total) {
                page = total
            }

            let start = (page - 1) * 7,
                end = Math.min(start + 7, key.length),
                menu = "=== Ajuda ===\nPágina " + String(page) + "/" + String(total) + "\n"

            for (let i = start; i < end; i++) {
                menu += "\n/" + key[i] + " — " + cmds[key[i]].short
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
     * [JS] Exibe a versão do programa
     * @returns {null}
     * @since v6.1.0
     */
    version() {
        Ui.warning("Analisador de Funções Matemáticas\n" + VERSION + " — Adriano Lima 2025 - 2026")
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

        if (name == "capitalizadas" && Config.capitalized) {
            Config.uppercase = false
            Config.lowercase = false
        } else if (name == "maiusculas" && Config.uppercase) {
            Config.capitalized = false
            Config.lowercase = false
        } else if (name == "minusculas" && Config.lowercase) {
            Config.capitalized = false
            Config.uppercase = false
        }

        saveConfig()
        Ui.warning(Writing.configItem("Alterado: “" + name + "”", name))
        return null
    },

    /**
     * [JS] Retorna uma lista com os nomes dos comandos disponíveis
     * @returns {string[]} - Lista de nomes canônicos dos comandos disponíveis
     * @since v6.1.0
     */
    names() {
        return ["config", "sair", "inicio", "rever", "historico", "alterar"]
    },
}
